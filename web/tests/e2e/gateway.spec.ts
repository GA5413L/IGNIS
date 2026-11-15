import { expect, test, type Route } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { proposalFromForm } from '../../src/core/interpretation';
import { verifyAssessment } from '../../src/core/export';
import { requireCatalog } from '../../src/core/registry';
import { gatewayAssess, gatewayPost, gatewayStatus } from '../../src/server/gateway/handler';
import { GatewayStore } from '../../src/server/gateway/store';
import { GATEWAY_ROUTES, GATEWAY_REVISION, type GatewayConfig } from '../../src/server/gateway/policy';

async function browserRequest(route: Route): Promise<Request> {
  const request = route.request();
  return new Request(request.url(), { method: request.method(), headers: await request.allHeaders(),
    ...(request.method() === 'POST' ? { body: request.postData() } : {}) });
}
async function respond(route: Route, response: Response) {
  await route.fulfill({ status: response.status, headers: Object.fromEntries(response.headers), body: await response.text() });
}

test('retired SI page redirects to overview while floating chat remains usable', async ({ page }) => {
  await page.goto('/console#si');
  await expect(page).toHaveURL(/\/console#overview$/);
  await expect(page.getByRole('navigation', { name: 'Dashboard sections' }).getByRole('link', { name: 'SI', exact: true })).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Your research question', exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Open SI chat', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'SI Scientific Intelligence' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Search evidence', exact: true })).toBeDisabled();
  await page.getByRole('textbox', { name: 'Ask SI about the evidence' }).fill('Smoke detection');
  await page.getByRole('button', { name: 'Search evidence', exact: true }).click();
  await expect(page.getByText('Catalogue matches', { exact: true })).toBeVisible();
  await expect(page.locator('.si-chat-sources a').first()).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Open SI chat', exact: true })).toBeFocused();
  const status = await (await page.request.get('/api/si/gateway')).json();
  expect(status.available).toBe(false); expect(status.reasons).toContain('provider_evaluation_pending');
  expect(JSON.stringify(status)).not.toMatch(/CF_AI_GATEWAY_TOKEN|signingKey/);
  await page.getByRole('navigation', { name: 'Dashboard sections' }).getByRole('link', { name: 'Sources' }).click();
  await page.getByRole('button', { name: 'Open SI chat', exact: true }).click();
  await expect(page.getByText('Catalogue matches', { exact: true })).toBeVisible();
});

test('mocked SI confirms a visitor-bound receipt, preserves scope and rejects ordinary-endpoint provenance forgery', async ({ page }) => {
  let requests = 0, confirmations = 0, providerCalls = 0;
  let submittedConfirmation: unknown;
  const proposal = { ...proposalFromForm({ intent: 'synthesize_findings', safetyAreas: ['detection'] }), unknownTerms: ['unregistered calibration reference'], supportingContextIds: ['SRC-R09'] };
  const config: GatewayConfig = { enabled: true, account: 'a'.repeat(32), gateway: 'test-gateway', token: 'MOCK_NO_LIVE_TOKEN', signingKey: 'MOCK_RECEIPT_SIGNING_KEY'.repeat(3),
    database: 'C:/ignis-test/quota.sqlite', origin: 'http://127.0.0.1:3000', mode: 'local', turnstileSecret: '', turnstileSiteKey: '', tokenRotated: false,
    byokOnlyVerified: true, privacyVerified: true, sharedStoreVerified: true, freeVerified: GATEWAY_ROUTES.map((route) => route.id) };
  const store = new GatewayStore(':memory:');
  const deps = { config, store, snapshot: requireCatalog(), accepted: GATEWAY_ROUTES.map((route) => route.id), transport: async () => {
    providerCalls++;
    return Response.json({ model: 'openai/gpt-oss-120b', choices: [{ finish_reason: 'stop', message: { content: JSON.stringify(proposal) } }], usage: { prompt_tokens: 100, completion_tokens: 100 } });
  } };
  try {
    // Exercise real signing/confirmation code locally. Only the provider transport is mocked;
    // the running application's accepted routes stay empty and no provider request is sent.
    await page.route('**/api/si/gateway', async (route) => {
      const request = await browserRequest(route);
      if (request.method === 'GET') return respond(route, gatewayStatus(request, deps));
      requests++; return respond(route, await gatewayPost(request, deps));
    });
    await page.route('**/api/si/gateway/assess', async (route) => {
      confirmations++; submittedConfirmation = route.request().postDataJSON();
      return respond(route, await gatewayAssess(await browserRequest(route), deps));
    });
    await page.goto('/console#findings');
  await page.getByRole('button', { name: 'Open SI chat', exact: true }).click();
    await page.getByRole('textbox', { name: 'Ask SI about the evidence', exact: true }).fill('What do spacecraft smoke detector experiments report?');
    await expect(page.getByRole('button', { name: 'Interpret with SI', exact: true })).toBeDisabled();
    await page.getByRole('checkbox', { name: /This question contains public research information only/ }).check();
    await page.getByRole('button', { name: 'Interpret with SI', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Review the SI interpretation', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'SI-assisted assessment', exact: true })).toHaveCount(0);
    await page.getByRole('button', { name: 'Confirm SI scope and assess', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'SI-assisted assessment', exact: true })).toBeVisible();
    expect(Object.keys(submittedConfirmation as object).sort()).toEqual(['receipt', 'researchSelections']);
    expect(submittedConfirmation).toMatchObject({ receipt: { receiptVersion: 'ignis-si-receipt-1', signature: expect.stringMatching(/^[a-f0-9]{64}$/), proposal } });
    const pending = page.waitForEvent('download'); await page.getByRole('button', { name: 'Download assisted assessment', exact: true }).click();
    const result = JSON.parse(await readFile((await (await pending).path())!, 'utf8'));
    expect(() => verifyAssessment(result)).not.toThrow();
    expect(result.request.proposal).toEqual(proposal);
    expect(result.request.inputMode).toBe('ai_assisted');
    expect(result.request.runtimeProvenanceRef).toEqual({ id: expect.stringMatching(/^CF-[a-f0-9]{64}$/), revision: GATEWAY_REVISION });
    const forged = await page.request.post('/api/assess', { headers: { Origin: config.origin }, data: { request: result.request, catalogRevision: result.catalogRevision } });
    expect(forged.status()).toBe(403); expect((await forged.json()).code).toBe('unverified_ai_provenance');
    await page.getByRole('textbox', { name: 'Ask SI about the evidence', exact: true }).fill('A different spacecraft fire question');
    await expect(page.getByRole('heading', { name: 'SI-assisted assessment', exact: true })).toHaveCount(0);
    await expect(page.getByRole('heading', { name: 'Review the SI interpretation', exact: true })).toHaveCount(0);
    expect(requests).toBe(1); expect(confirmations).toBe(1); expect(providerCalls).toBe(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0);
  } finally { store.close(); }
});

test('citation identity checks expose a dated receipt without provider or metadata calls from the browser', async ({ page }) => {
  const external: string[] = [];
  await page.route(/api\.crossref\.org|api\.datacite\.org|ntrs\.nasa\.gov\/api/, (route) => { external.push(route.request().url()); return route.abort(); });
  await page.goto('/console#sources');
  await expect(page.getByRole('heading', { name: 'Citation identity checks', exact: true })).toBeVisible();
  await expect(page.getByText('7 of 7 metadata matches', { exact: true })).toBeVisible();
  const snapshot = await (await page.request.get('/api/citations')).json();
  expect(snapshot.records).toHaveLength(7); expect(snapshot.records.every((r: { status: string }) => r.status === 'metadata_match')).toBe(true);
  expect(external).toEqual([]); expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0);
});
