import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';

test('guided analysis changes its conclusion and opens exactly the selected lab settings', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/example');
  await expect(page.getByRole('heading', { name: 'One pooled result. Two different stories.' })).toBeVisible();
  const ranges = page.getByRole('region', { name: 'Worked example exact ranges' });
  await expect(ranges).toContainText('[66, 78] / 133'); await expect(ranges).toContainText('[-6, -3] / 25');
  await expect(page.locator('.example-finding')).toContainText('opposite signs');
  await page.getByRole('button', { name: 'Pooled only', exact: true }).click();
  await expect(page.getByRole('img', { name: /Pooled range only/ })).toBeVisible();
  await expect(ranges).toContainText('[-6, -3] / 25');
  await page.getByRole('button', { name: 'Separate the flights', exact: true }).click();
  await expect(page.locator('.example-finding')).toContainText('opposite signs');
  await page.getByRole('radio', { name: '0–5 V · wider range' }).check();
  await expect(page.locator('.example-finding')).toContainText('either sign');
  await expect(ranges).toContainText('Both signs attainable');
  const [download] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Download this analysis', exact: true }).click()]);
  const data = JSON.parse(readFileSync(await download.path(), 'utf8'));
  expect(data.result.summary.pairedDifferenceEnvelope.stability).toBe('both_signs');
  expect(data.selection.options.rangeA).toEqual({ min: 0, max: 5 });
  await page.getByRole('button', { name: 'Open these settings in Smoke lab' }).click();
  await expect(page.getByRole('heading', { name: 'Does the finding survive the cutoff choice?' })).toBeVisible();
  await expect(page.getByLabel('A range minimum (V)')).toHaveValue('0');
  await expect(page.getByLabel('A range maximum (V)')).toHaveValue('5');
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  expect(errors).toEqual([]);
});

test('guided result becomes a single preserved package and reopens in a fresh browser', async ({ page, browser }) => {
  await page.goto('/example'); await page.getByRole('button', { name: 'Attach this result to a brief' }).click();
  await page.getByRole('button', { name: 'Confirm and assess', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Exact cutoff-range sensitivity', exact: true })).toBeVisible();
  await page.locator('.notebook-toggle > summary').click();
  const [download] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Download evidence package', exact: true }).click()]);
  const text = readFileSync(await download.path(), 'utf8'), packet = JSON.parse(text);
  expect(packet.schemaVersion).toBe('ignis-evidence-package-1'); expect(packet.collections.detectors.data.records).toHaveLength(154);
  expect(packet.originals).toHaveLength(1);
  const context = await browser.newContext({ viewport: page.viewportSize()!, acceptDownloads: true });
  try {
    const fresh = await context.newPage(); await fresh.goto('http://127.0.0.1:3100/');
    await fresh.locator('.notebook-toggle > summary').click();
    const originalBytes = Buffer.from('\uFEFF\r\n' + text + '\t\n');
    await fresh.getByLabel('Session JSON file').setInputFiles({ name: 'package.json', mimeType: 'application/json', buffer: originalBytes });
    await expect(fresh.getByRole('heading', { name: 'Preserved evidence', exact: true })).toBeVisible();
    await expect(fresh.locator('.historical-review')).toContainText('internally consistent');
    await expect(fresh.locator('.historical-review')).toContainText('stored payload fields match');
    const [originalDownload] = await Promise.all([fresh.waitForEvent('download'), fresh.getByRole('button', { name: 'Download original package', exact: true }).click()]);
    expect(readFileSync(await originalDownload.path())).toEqual(originalBytes);
    const [newPackage] = await Promise.all([fresh.waitForEvent('download'), fresh.getByRole('button', { name: 'Download evidence package', exact: true }).click()]);
    expect(await newPackage.path()).toBeTruthy();
    await expect(fresh.getByRole('heading', { name: 'Preserved evidence', exact: true })).toBeVisible();
    await fresh.getByRole('button', { name: 'Load rechecked workspace', exact: true }).click();
    await expect(fresh.getByRole('heading', { name: 'Exact cutoff-range sensitivity', exact: true })).toBeVisible();
    const [result] = await Promise.all([fresh.waitForEvent('download'), fresh.getByRole('button', { name: 'Export JSON', exact: true }).click()]);
    const current = JSON.parse(readFileSync(await result.path(), 'utf8'));
    expect(current.researchAnalyses[0].result).toEqual(packet.originals[0].researchAnalyses[0].result);
    expect(await fresh.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  } finally { await context.close(); }
});

test('a rejected package replaces neither the current draft nor an earlier import review', async ({ page }) => {
  await page.goto('/'); await page.getByRole('textbox', { name: 'Question', exact: true }).fill('Keep my question');
  await page.locator('.notebook-toggle > summary').click();
  const [download] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Download evidence package', exact: true }).click()]);
  const text = readFileSync(await download.path(), 'utf8');
  await page.getByLabel('Session JSON file').setInputFiles({ name: 'good.json', mimeType: 'application/json', buffer: Buffer.from(text) });
  await expect(page.getByRole('button', { name: 'Load rechecked workspace', exact: true })).toBeVisible();
  const broken = JSON.parse(text); broken.createdAt = '2020-01-01T00:00:00.000Z';
  await page.getByLabel('Session JSON file').setInputFiles({ name: 'bad.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(broken)) });
  await expect(page.locator('.session-message')).toContainText('Nothing loaded');
  await expect(page.getByRole('button', { name: 'Load rechecked workspace', exact: true })).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Preserved evidence', exact: true })).toHaveCount(0);
  await expect(page.getByRole('textbox', { name: 'Question', exact: true })).toHaveValue('Keep my question');
});

test('a delayed package response cannot replace a newer loaded session', async ({ page }) => {
  await page.goto('/'); await page.getByRole('textbox', { name: 'Question', exact: true }).fill('Archived draft A');
  await page.locator('.notebook-toggle > summary').click();
  const [archiveDownload] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Download evidence package', exact: true }).click()]);
  const archive = readFileSync(await archiveDownload.path(), 'utf8');
  await page.getByRole('textbox', { name: 'Question', exact: true }).fill('Newer draft B');
  const [sessionDownload] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Download session', exact: true }).click()]);
  const session = readFileSync(await sessionDownload.path(), 'utf8');
  let release!: () => void, observed!: () => void;
  const gate = new Promise<void>((r) => { release = r; }), intercepted = new Promise<void>((r) => { observed = r; });
  await page.route('**/api/package/recheck', async (route) => { const response = await route.fetch(); observed(); await gate; await route.fulfill({ response }); });
  await page.getByLabel('Session JSON file').setInputFiles({ name: 'archive.json', mimeType: 'application/json', buffer: Buffer.from(archive) });
  await intercepted;
  await page.getByLabel('Session JSON file').setInputFiles({ name: 'newer.json', mimeType: 'application/json', buffer: Buffer.from(session) });
  await page.getByRole('button', { name: 'Load rechecked workspace', exact: true }).click();
  const responseArrived = page.waitForResponse('**/api/package/recheck'); release(); await responseArrived;
  await page.waitForLoadState('networkidle');
  await expect(page.getByRole('textbox', { name: 'Question', exact: true })).toHaveValue('Newer draft B');
  await expect(page.getByRole('heading', { name: 'Preserved evidence', exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Load rechecked workspace', exact: true })).toHaveCount(0);
});

test('cancelling a stalled export preserves the earlier import review and unlocks the notebook', async ({ page }) => {
  await page.goto('/'); await page.locator('.notebook-toggle > summary').click();
  const [download] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Download evidence package', exact: true }).click()]);
  const content = readFileSync(await download.path());
  await page.getByLabel('Session JSON file').setInputFiles({ name: 'package.json', mimeType: 'application/json', buffer: content });
  await expect(page.getByRole('heading', { name: 'Preserved evidence', exact: true })).toBeVisible();
  let release!: () => void, observed!: () => void;
  const gate = new Promise<void>((r) => { release = r; }), intercepted = new Promise<void>((r) => { observed = r; });
  await page.route('**/api/package', async (route) => { observed(); await gate; await route.abort(); });
  await page.getByRole('button', { name: 'Download evidence package', exact: true }).click(); await intercepted;
  await expect(page.getByRole('button', { name: 'Load rechecked workspace', exact: true })).toBeDisabled();
  await page.getByRole('button', { name: 'Cancel notebook operation', exact: true }).click(); release();
  await expect(page.getByRole('heading', { name: 'Preserved evidence', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Import session or package', exact: true })).toBeEnabled();
  await expect(page.getByRole('button', { name: 'Load rechecked workspace', exact: true })).toBeEnabled();
  await expect(page.locator('.session-message')).toContainText('Operation cancelled');
});
