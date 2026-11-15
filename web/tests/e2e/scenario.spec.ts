import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';

test('a scenario link reopens exact conditions in a clean browser and changes require a new link', async ({ page, browser }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Conditions', exact: true }).click();
  await page.getByLabel('Target oxygen (mole %)').fill('29');
  await page.getByLabel('Target pressure (kPa)').fill('68');
  await page.getByRole('button', { name: 'Create scenario link', exact: true }).click();
  const url = await page.getByLabel('Scenario URL', { exact: true }).inputValue();
  expect(url).toContain('#ignis-scenario=');
  const context = await browser.newContext({ viewport: page.viewportSize()! });
  try {
    const fresh = await context.newPage();
    await fresh.goto(url);
    await expect(fresh.getByLabel('Target oxygen (mole %)')).toHaveValue('29');
    await expect(fresh.getByLabel('Target pressure (kPa)')).toHaveValue('68');
    await expect(fresh.getByText('Scenario reopened: source, method and result match the link.', { exact: false })).toBeVisible();
    expect(await fresh.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  } finally { await context.close(); }
  await page.getByLabel('Target pressure (kPa)').fill('69');
  await expect(page.getByText('Settings changed. Create a new link for the current selection.')).toBeVisible();
  await expect(page.getByLabel('Scenario URL', { exact: true })).toHaveCount(0);
});

test('a malformed scenario does not replace a draft or an existing result', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('textbox', { name: 'Question', exact: true }).fill('Keep this exact draft');
  await page.getByRole('button', { name: 'Confirm and assess' }).click();
  await expect(page.getByRole('heading', { name: 'Research brief', exact: true })).toBeVisible();
  const [beforeDownload] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Export JSON', exact: true }).click()]);
  const before = JSON.parse(readFileSync(await beforeDownload.path(), 'utf8'));
  await page.evaluate(() => { window.location.hash = '#ignis-scenario=invalid'; });
  await expect(page.getByRole('alert').filter({ hasText: 'Scenario was not loaded.' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Research brief', exact: true })).toBeVisible();
  const [afterDownload] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Export JSON', exact: true }).click()]);
  expect(JSON.parse(readFileSync(await afterDownload.path(), 'utf8')).payloadSha256).toBe(before.payloadSha256);
  await page.getByRole('button', { name: 'Explore', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'Question', exact: true })).toHaveValue('Keep this exact draft');
});

test('cutoff ranges expose robust flight reversal, a wider counterexample and a source-bound brief', async ({ page, browser }) => {
  const errors: string[] = []; page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await page.getByRole('button', { name: 'Test a finding’s robustness', exact: false }).click();
  const table = page.getByRole('table', { name: 'Cutoff range by flight' });
  await expect(table).toContainText('[66, 78] / 133');
  await expect(table).toContainText('[-6, -3] / 25');
  await expect(table).toContainText('[72, 81] / 108');
  await expect(page.getByText('The jointly finite flight strata have opposite nonzero signs for every cutoff pair', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: 'Widen to [0, 5] V', exact: true }).click();
  await expect(table).toContainText('[-51, 133] / 133');
  await expect(page.getByText('The selected cutoff rectangle permits both signs', { exact: false })).toBeVisible();
  await page.getByLabel('A range maximum (V)').fill('-1');
  await expect(page.getByRole('alert').filter({ hasText: 'Enter four finite cutoff values' })).toBeVisible();
  await expect(table).toHaveCount(0);
  await page.getByRole('button', { name: 'Use [1, 3] V ranges', exact: true }).click();
  await page.getByRole('button', { name: 'Create scenario link', exact: true }).click();
  const url = await page.getByLabel('Scenario URL', { exact: true }).inputValue();
  const context = await browser.newContext({ viewport: page.viewportSize()! });
  try {
    const fresh = await context.newPage(); await fresh.goto(url);
    await expect(fresh.getByLabel('A range minimum (V)')).toHaveValue('1');
    await expect(fresh.getByLabel('B range maximum (V)')).toHaveValue('3');
    await expect(fresh.getByRole('table', { name: 'Cutoff range by flight' })).toContainText('[66, 78] / 133');
    expect(await fresh.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  } finally { await context.close(); }
  await page.getByRole('button', { name: 'Attach cutoff range to brief', exact: true }).click();
  await expect(page.locator('.attached-selections')).toContainText('[1, 3] V');
  await page.getByRole('button', { name: 'Confirm and assess', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Exact cutoff-range sensitivity', exact: true })).toBeVisible();
  const [download] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Export JSON', exact: true }).click()]);
  const certificate = JSON.parse(readFileSync(await download.path(), 'utf8')).researchAnalyses[0].result;
  expect(certificate.summary.pairedDifferenceEnvelope).toMatchObject({ lowerNumerator: 66, upperNumerator: 78, denominator: 133 });
  expect(certificate.rows.find((row: any) => row.measurementA.cell === 'AW50').measurementA.value).toBeNull();
  expect(certificate.policy.alarmClassification).toBe(false);
  expect(errors).toEqual([]);
});

test('the paired-to-range handoff keeps the selected cohort and recorded-status filter', async ({ page }) => {
  await page.goto('/'); await page.getByRole('button', { name: 'Smoke lab', exact: true }).click();
  await page.getByRole('button', { name: 'Paired cohort audit', exact: true }).click();
  await page.getByLabel('Require literal “n” in the fan-problem field').check();
  await page.getByRole('button', { name: 'Audit this cohort across cutoff ranges', exact: false }).click();
  await expect(page.getByLabel('Require recorded “n” for the range audit')).toBeChecked();
  await expect(page.locator('.envelope-stats')).toContainText('25 / 25');
  await expect(page.getByRole('table', { name: 'Cutoff range by flight' })).toContainText('[-6, -3] / 25');
  await expect(page.getByRole('table', { name: 'Cutoff range by flight' })).toContainText('Undefined');
});
