import { expect, test, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';

async function notebook(page: Page) {
  const toggle = page.locator('.notebook-toggle');
  if ((await toggle.getAttribute('open')) === null) await toggle.locator(':scope > summary').click();
}
async function savePacket(page: Page) {
  await notebook(page);
  const [download] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Download session', exact: true }).click()]);
  return readFileSync(await download.path(), 'utf8');
}
async function importPacket(page: Page, content: string) {
  await notebook(page);
  await page.getByLabel('Session JSON file').setInputFiles({ name: 'session.json', mimeType: 'application/json', buffer: Buffer.from(content) });
}

test('exact condition selection survives a brief, export and fresh-browser replay', async ({ page, browser }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Conditions', exact: true }).click();
  await page.getByRole('button', { name: 'Show a two-axis tradeoff' }).click();
  await page.getByRole('button', { name: 'Prepare a prevention brief' }).click();
  await expect(page.locator('.attached-selections')).toContainText('22% oxygen / 54.4 kPa');
  await page.getByRole('button', { name: 'Confirm and assess' }).click();
  await expect(page.getByRole('heading', { name: 'Selected atmosphere comparison' })).toBeVisible();
  const [download] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Export JSON', exact: true }).click()]);
  const original = JSON.parse(readFileSync(await download.path(), 'utf8'));
  expect(original.researchAnalyses[0].result.target).toEqual({ oxygenPercent: 22, pressureKPa: 54.4 });
  const packet = await savePacket(page);
  const context = await browser.newContext({ viewport: page.viewportSize()!, acceptDownloads: true });
  try {
    const fresh = await context.newPage();
    await fresh.goto('http://127.0.0.1:3100/');
    await importPacket(fresh, packet);
    await expect(fresh.getByText('1 reproduced with unchanged source, method and result fingerprints.', { exact: false })).toBeVisible();
    await fresh.getByRole('button', { name: 'Load rechecked workspace' }).click();
    await expect(fresh.getByRole('heading', { name: 'Selected atmosphere comparison' })).toBeVisible();
    await fresh.getByRole('button', { name: 'Conditions', exact: true }).click();
    await expect(fresh.getByLabel('Target oxygen (mole %)')).toHaveValue('22');
    await expect(fresh.getByLabel('Target pressure (kPa)')).toHaveValue('54.4');
    expect(await fresh.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  } finally { await context.close(); }
});

test('paired audit exposes flight reversal and the literal-status exclusion effect', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/'); await page.getByRole('button', { name: 'Smoke lab', exact: true }).click();
  await page.getByRole('button', { name: 'Paired cohort audit', exact: true }).click();
  await expect(page.locator('.paired-stats')).toContainText('133 / 134');
  const table = page.getByRole('table', { name: 'Paired flight comparison' });
  await expect(table).toContainText('-6 / 25'); await expect(table).toContainText('+76 / 108');
  await expect(page.getByText('The descriptive paired difference has opposite signs', { exact: false })).toBeVisible();
  await page.getByLabel('Require literal “n” in the fan-problem field').check();
  await expect(page.locator('.paired-stats')).toContainText('25 / 25');
  await expect(page.getByText('The literal recorded-n fan filter excluded 109 row(s).', { exact: false })).toBeVisible();
  const [download] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Export paired audit' }).click()]);
  const result = JSON.parse(readFileSync(await download.path(), 'utf8'));
  expect(result.summary.pairedDifference).toMatchObject({ numerator: -6, denominator: 25 });
  expect(result.excludedRows).toHaveLength(109);
  expect(result.policy.alarmClassification).toBe(false);
  await page.getByRole('button', { name: 'Attach paired audit to brief' }).click();
  await page.getByRole('button', { name: 'Confirm and assess' }).click();
  await expect(page.getByRole('heading', { name: 'Paired-channel cohort sensitivity' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  expect(errors).toEqual([]);
});

test('invalid session imports preserve the current draft; browser save is explicit', async ({ page }) => {
  await page.goto('/'); await page.getByRole('textbox', { name: 'Question', exact: true }).fill('Keep this research question');
  await notebook(page); await page.getByRole('button', { name: 'Save in this browser' }).click();
  await expect(page.getByText('Session saved in this browser.', { exact: false })).toBeVisible();
  await importPacket(page, '{"schemaVersion":"wrong"}');
  await expect(page.locator('.session-message')).toContainText('Nothing loaded');
  await expect(page.getByRole('textbox', { name: 'Question', exact: true })).toHaveValue('Keep this research question');
  await page.getByRole('button', { name: 'Restore browser save' }).click();
  await expect(page.getByRole('heading', { name: 'Recheck report' })).toBeVisible();
  await page.getByRole('button', { name: 'Load rechecked workspace' }).click();
  await expect(page.getByRole('textbox', { name: 'Question', exact: true })).toHaveValue('Keep this research question');
});

test('a delayed old assessment cannot overwrite an imported workspace', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('textbox', { name: 'Question', exact: true }).fill('Saved question');
  const packet = await savePacket(page);
  await page.getByRole('textbox', { name: 'Question', exact: true }).fill('Late response question');
  let release!: () => void;
  const gate = new Promise<void>((resolve) => { release = resolve; });
  let observed!: () => void;
  const intercepted = new Promise<void>((resolve) => { observed = resolve; });
  await page.route('**/api/assess', async (route) => { const response = await route.fetch(); observed(); await gate; await route.fulfill({ response }); });
  await page.getByRole('button', { name: 'Confirm and assess' }).click(); await intercepted;
  await importPacket(page, packet); await page.getByRole('button', { name: 'Load rechecked workspace' }).click();
  const responseArrived = page.waitForResponse('**/api/assess'); release(); await responseArrived;
  await page.waitForLoadState('networkidle');
  await expect(page.getByRole('textbox', { name: 'Question', exact: true })).toHaveValue('Saved question');
  await expect(page.getByRole('heading', { name: 'Research brief', exact: true })).toHaveCount(0);
});

test('data opportunities expose source roles and export all four reviewed investigations', async ({ page }) => {
  await page.goto('/'); await page.getByRole('button', { name: 'Data & methods', exact: true }).click();
  await expect(page.getByRole('table', { name: 'Saffire model data roles' })).toContainText('Saffire V RS3');
  await expect(page.getByRole('heading', { name: 'Audit Saffire-I channel clocks before alignment' })).toBeVisible();
  const [download] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Export research opportunities' }).click()]);
  const data = JSON.parse(readFileSync(await download.path(), 'utf8'));
  expect(data.opportunities).toHaveLength(4);
  expect(data.opportunities.every((o: any) => o.sources.every((s: any) => /^[a-f0-9]{64}$/.test(s.sha256)))).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
});
