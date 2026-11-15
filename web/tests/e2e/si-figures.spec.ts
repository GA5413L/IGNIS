import { expect, test, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { verifyAssessment } from '../../src/core/export';

async function openSI(page: Page) {
  await page.goto('/#si');
  await expect(page.getByRole('heading', { name: 'SI · Scientific Intelligence', exact: true })).toBeVisible();
  await page.waitForLoadState('networkidle');
}

test('SI requires scope review, produces a bound source assessment and exports the same result', async ({ page }) => {
  const providerCalls: string[] = [];
  await page.route(/api\.groq\.com|generativelanguage\.googleapis\.com|api\.anthropic\.com/, (route) => { providerCalls.push(route.request().url()); return route.abort(); });
  await openSI(page);
  await expect(page.getByRole('button', { name: 'Review request', exact: true })).toBeDisabled();
  await page.getByRole('button', { name: 'Later CO₂ response', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Confirm and assess', exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Review request', exact: true }).click();
  await page.getByRole('button', { name: 'Confirm and assess', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Assessment', exact: true })).toBeVisible();
  await expect(page.locator('#si-results').locator('..').locator('..')).toContainText('Comparison specified (conditional)');
  const event = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download SI assessment · JSON', exact: true }).click();
  const a = JSON.parse(await readFile((await (await event).path())!, 'utf8'));
  expect(() => verifyAssessment(a)).not.toThrow();
  expect(a.request.inputMode).toBe('form');
  expect(a.request.proposal.quantityIds).toEqual(['Q-CO2-REMOTE-CONC']);
  expect(a.request.runtimeProvenanceRef).toBeNull();
  await page.getByRole('combobox', { name: 'Quantity', exact: true }).selectOption('Q-HEAT-CHEMICAL-RELEASE');
  await expect(page.getByRole('heading', { name: 'Assessment', exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Confirm and assess', exact: true })).toHaveCount(0);
  expect(providerCalls).toEqual([]);
});

test('a delayed SI assessment cannot reappear after editing or cancellation', async ({ page }) => {
  await openSI(page);
  let release!: () => void;
  const held = new Promise<void>((resolve) => { release = resolve; });
  await page.route('**/api/assess', async (route) => { const response = await route.fetch(); await held; await route.fulfill({ response }).catch(() => {}); });
  await page.getByRole('button', { name: 'Smoke detection evidence', exact: true }).click();
  await page.getByRole('button', { name: 'Review request', exact: true }).click();
  await page.getByRole('button', { name: 'Confirm and assess', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Cancel request', exact: true })).toBeVisible();
  await page.getByRole('textbox', { name: 'Question', exact: true }).fill('A different question');
  release();
  await page.waitForLoadState('networkidle');
  await expect(page.getByRole('heading', { name: 'Assessment', exact: true })).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Confirm the scope', exact: true })).toHaveCount(0);
});

test('SI packet preview preserves the question and chosen provider and excludes local data', async ({ page }) => {
  await openSI(page);
  await page.getByRole('button', { name: 'Smoke detection evidence', exact: true }).click();
  await page.getByRole('combobox', { name: 'SI provider', exact: true }).selectOption('gemini');
  await page.getByRole('button', { name: 'Preview SI packet', exact: true }).click();
  await expect(page.getByText('Packet prepared locally · inference NOT RUN.', { exact: true })).toBeVisible();
  const event = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download SI packet preview', exact: true }).click();
  const packet = JSON.parse(await readFile((await (await event).path())!, 'utf8'));
  expect(packet).toMatchObject({ provider: 'gemini', dispatched: false, inference: 'NOT RUN', configurationId: 'GEM38-LOW' });
  expect(JSON.parse(packet.messages.user).question).toBe(await page.getByRole('textbox', { name: 'Question', exact: true }).inputValue());
  expect(Object.keys(packet).some((k) => /notebook|rawCsv|history|apiKey/i.test(k))).toBe(false);
});

test('figure palette changes plots and downloads; its source and exact data are accessible', async ({ page }) => {
  await page.goto('/#figures');
  await page.getByRole('combobox', { name: 'Figure palette', exact: true }).selectOption('monochrome');
  await expect(page.locator('.shell')).toHaveAttribute('data-palette', 'monochrome');
  await expect(page.getByRole('link', { name: 'Download PDF', exact: true }).first()).toHaveAttribute('href', '/figures/monochrome/fig1-atmosphere-cases.pdf');
  await page.getByText('Code for Figure 1', { exact: true }).click();
  const details = page.locator('details').filter({ has: page.getByText('Code for Figure 1', { exact: true }) });
  await expect(details).toContainText('--figure 1 --palette monochrome');
  await expect(details).toContainText('def fig_atmospheres');
  const manifest = await (await page.request.get('/figures/code/manifest.json')).json();
  expect(manifest.palettes).toEqual(['okabe-ito', 'monochrome']);
  expect((await page.request.get('/figures/code/ignis-figure-reproduction.zip')).ok()).toBe(true);
  await page.getByRole('combobox', { name: 'Figure palette', exact: true }).selectOption('okabe-ito');
  await expect(page.getByRole('link', { name: 'Download PDF', exact: true }).first()).toHaveAttribute('href', '/figures/fig1-atmosphere-cases.pdf');
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0);
});
