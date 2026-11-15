import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';

test('the initial source chart hydrates without browser exceptions', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/', { waitUntil: 'networkidle' });
  await expect(page.getByRole('heading', { name: 'Investigations in this reviewed bank' })).toBeVisible();
  expect(errors).toEqual([]);
});

test('atlas searches the acquired inventory and exports all profiles', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Understand fire. Beyond Earth.' })).toBeVisible();
  await page.getByRole('searchbox', { name: 'Find an investigation' }).fill('PSI-101');
  await expect(page.locator('.atlas-card')).toHaveCount(1);
  await page.locator('.atlas-card').click();
  await expect(page.getByRole('link', { name: 'Open NASA PSI record' })).toHaveAttribute('href', /PSI-101$/);
  const [download] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Export atlas JSON' }).click()]);
  const data = JSON.parse(readFileSync(await download.path(), 'utf8'));
  expect(data.records).toHaveLength(24);
  expect(data.counts.experimentalCsvDataRecords).toBe(2009);
  expect(data.records.find((r: { id: string }) => r.id === 'PSI-10').license.status).toBe('not_reported');
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
});

test('condition tradeoff, exact export, invalid target and navigation persistence', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Conditions', exact: true }).click();
  await page.getByRole('button', { name: 'Show a two-axis tradeoff' }).click();
  await expect(page.getByRole('heading', { name: '2 of 2 cases are on this condition-gap frontier' })).toBeVisible();
  await expect(page.getByRole('table', { name: 'Condition gaps' }).getByText('Frontier', { exact: true })).toHaveCount(2);
  const [download] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Export comparison JSON' }).click()]);
  const data = JSON.parse(readFileSync(await download.path(), 'utf8'));
  expect(data.target).toEqual({ oxygenPercent: 22, pressureKPa: 54.4 });
  expect(data.frontier.strata[0].frontier).toHaveLength(2);
  expect(data.cases.map((c: { id: string }) => c.id)).toEqual(['SAFFIRE-IV-2', 'SAFFIRE-VI-3']);
  expect(data.earlierSourceContext[0].pdfPage).toBe(3);
  expect(data.comparisonPolicy.physicalTransferEstablished).toBe(false);
  await page.getByLabel('Target pressure (kPa)').fill('0');
  await expect(page.getByRole('main').getByRole('alert')).toContainText('Invalid condition comparison');
  await expect(page.getByRole('button', { name: 'Export comparison JSON' })).toBeDisabled();
  await page.getByLabel('Target pressure (kPa)').fill('54.4');
  await page.getByRole('button', { name: 'Explore', exact: true }).click();
  await page.getByRole('button', { name: 'Conditions', exact: true }).click();
  await expect(page.getByLabel('Target oxygen (mole %)')).toHaveValue('22');
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
});

test('detector denominators, a blank source cell and matching selected export', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Smoke lab', exact: true }).click();
  await page.getByLabel('Material', { exact: true }).selectOption('Kapton');
  await expect(page.locator('.detector-stats')).toContainText('20 / 35');
  await expect(page.locator('.detector-stats')).toContainText('1 blank');
  const [download] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Export readings JSON' }).click()]);
  const data = JSON.parse(readFileSync(await download.path(), 'utf8'));
  expect(data.counts).toMatchObject({ total: 36, finite: 35, below: 20, missing: 1 });
  expect(data.selection).toMatchObject({ material: 'Kapton', cutoff: 2, includeReference: false });
  expect(data.policy.alarmClassification).toBe(false);
  await expect(page.locator('.detector-table tbody tr').first().locator('td').nth(3)).toHaveText(data.rows[0].record.sameTestNumber ?? 'unreported');
  expect(data.rows.find((r: { measurement: { cell: string } }) => r.measurement.cell === 'AW50').measurement).toMatchObject({ status: 'missing', value: null });
  await page.getByLabel('Show unavailable cells only').check();
  await expect(page.locator('.detector-table tbody tr')).toHaveCount(1);
  await page.getByRole('button', { name: 'Inspect AW50' }).click();
  await expect(page.getByRole('heading', { name: 'Kapton · AW50' })).toBeVisible();
  await expect(page.locator('.cell-inspector')).toContainText('SAME # (separate source identifier)');
  await page.getByLabel('Descriptive cutoff (V)').fill('');
  await expect(page.getByRole('main').getByRole('alert')).toContainText('finite, nonnegative');
  await expect(page.getByRole('button', { name: 'Export readings JSON' })).toBeDisabled();
  await page.getByLabel('Descriptive cutoff (V)').fill('2');
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
});

test('new views connect to the reviewed evidence workflow without inventing observations', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Smoke lab', exact: true }).click();
  await page.getByRole('button', { name: 'Prepare a detection brief' }).click();
  await expect(page.getByRole('textbox', { name: 'Question' })).toHaveValue(/source analysis: All materials, issScatterV, cutoff 2 V/);
  await expect(page.getByText('Your exact source selection is attached below.', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: 'Confirm and assess' }).click();
  await expect(page.getByRole('heading', { name: 'Research brief', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Selected source analyses', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Detection', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Prevention', exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Smoke lab', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Response by material' })).toBeVisible();
});
