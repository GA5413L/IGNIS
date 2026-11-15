import { expect, test, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { replayWorkbenchPackage } from '../../src/core/workbench';
import { calculateTrajectory, trajectoryExample } from '../../src/core/trajectory';
import { auditEndpoints, endpointExample } from '../../src/core/endpointAudit';
import { auditDesign, TWO_POINT_DESIGN_EXAMPLE } from '../../src/core/designAudit';
import { digestOf } from '../../src/core/canonicalize';

const open = async (page: Page, view = 'local-data') => {
  await page.goto(`/console#${view}`);
  expect((await (await page.request.get('/api/health')).json()).buildRevision).toBe('web-2026-11-15.13');
  await page.waitForLoadState('networkidle');
};
const downloadedText = async (page: Page, button: string) => {
  const event = page.waitForEvent('download');
  await page.getByRole('button', { name: button, exact: true }).click();
  return readFile((await (await event).path())!, 'utf8');
};

test('local example, window, raw inspector and package replay work with all network requests blocked', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', (e) => errors.push(e.message));
  await open(page);
  const requests: string[] = [];
  await page.route('**/*', (route) => { requests.push(route.request().url()); return route.abort(); });
  await page.getByRole('button', { name: 'Load hypothetical example' }).click();
  await expect(page.getByRole('heading', { name: 'Inspect one run and phase' })).toBeVisible();
  await expect(page.getByText(/^Time origin:/)).toContainText('5 included records');
  await page.getByRole('button', { name: 'Record 2', exact: true }).click();
  await expect(page.getByRole('article', { name: 'Raw record inspector' })).toContainText('physical lines 2–2');
  await page.getByLabel('Time from (ms)', { exact: true }).fill('500');
  await page.getByLabel('Time to (ms)', { exact: true }).fill('1500');
  await page.getByRole('button', { name: 'Apply inclusive time window' }).click();
  await expect(page.getByText(/^Time origin:/)).toContainText('3 included records');
  await page.getByRole('checkbox', { name: /downloaded package/ }).check();
  const raw = await downloadedText(page, 'Download local replay package');
  const replay = replayWorkbenchPackage(raw);
  expect(replay.result.includedRecords).toEqual([3, 4, 5]);
  expect(replay.result.origin).toBe('hypothetical');
  expect(replay.packet.file.sha256).toBe(createHash('sha256').update(replay.packet.file.rawUtf8, 'utf8').digest('hex'));
  await page.getByRole('button', { name: 'Clear local data' }).click();
  await page.getByLabel('Replay package · JSON, up to 8 MiB').setInputFiles({ name: 'replay.json', mimeType: 'application/json', buffer: Buffer.from(raw) });
  await expect(page.getByRole('status').filter({ hasText: 'Recomputed identically' })).toBeVisible();
  await expect(page.getByText(/^Time origin:/)).toContainText('3 included records');
  expect(requests).toEqual([]); expect(errors).toEqual([]);
  expect(await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length }))).toEqual({ local: 0, session: 0 });
  expect(page.url()).toMatch(/#local-data$/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
});

test('a supplied BOM/CRLF file needs explicit mapping and exports its original bytes', async ({ page }) => {
  await open(page);
  const raw = '\uFEFFtime,run,x\r\n0,µ-run,1\r\n1000,µ-run,2\r\n';
  await page.getByLabel('CSV file · UTF-8, up to 1 MiB').setInputFiles({ name: 'private-local-example.csv', mimeType: 'text/csv', buffer: Buffer.from(raw) });
  await expect(page.getByRole('heading', { name: 'Inspect one run and phase' })).toHaveCount(0);
  await page.getByRole('combobox', { name: 'Time column', exact: true }).selectOption('0');
  await page.getByLabel('Time unit as supplied', { exact: true }).fill('ms');
  await page.getByRole('combobox', { name: 'run mapping', exact: true }).selectOption('column');
  await page.getByRole('combobox', { name: 'run column', exact: true }).selectOption('1');
  await page.getByRole('combobox', { name: 'Channel 1 column', exact: true }).selectOption('2');
  await page.getByLabel('Quantity 1', { exact: true }).fill('Coordinate');
  await page.getByLabel('Unit 1 as supplied', { exact: true }).fill('mm');
  await page.getByRole('button', { name: 'Confirm mapping and inspect' }).click();
  await expect(page.getByText(/^Time origin:/)).toContainText('2 included records');
  await page.getByRole('checkbox', { name: /downloaded package/ }).check();
  const output = JSON.parse(await downloadedText(page, 'Download local replay package'));
  expect(output.file.rawUtf8).toBe(raw);
  expect(output.file.sha256).toBe(createHash('sha256').update(Buffer.from(raw)).digest('hex'));
  expect(replayWorkbenchPackage(JSON.stringify(output)).result.channels[0].maximum).toBe(2);
  await page.getByRole('link', { name: /Overview/ }).click();
  await page.getByRole('link', { name: /Your data/ }).click();
  await expect(page.getByText(/^Time origin:/)).toContainText('2 included records');
});

test('tampered packages and malformed CSV do not retain a previous result', async ({ page }) => {
  await open(page);
  await page.getByRole('button', { name: 'Load hypothetical example' }).click();
  await page.getByRole('checkbox', { name: /downloaded package/ }).check();
  const packet = JSON.parse(await downloadedText(page, 'Download local replay package')); packet.file.rawUtf8 += 'changed';
  await page.getByLabel('Replay package · JSON, up to 8 MiB').setInputFiles({ name: 'changed.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(packet)) });
  await expect(page.locator('p[role="alert"]')).toContainText('checksum mismatch');
  await expect(page.getByRole('heading', { name: 'Inspect one run and phase' })).toHaveCount(0);
  await page.getByLabel('CSV file · UTF-8, up to 1 MiB').setInputFiles({ name: 'bad.csv', mimeType: 'text/csv', buffer: Buffer.from('a,b\n1,"not closed') });
  await expect(page.locator('p[role="alert"]')).toContainText('Unclosed');
});

test('notebook rechecks originals separately, preserves imported bytes and reloads only computed assessments', async ({ page }) => {
  await open(page, 'sources');
  const original = await downloadedText(page, 'Download evidence package');
  const packet = JSON.parse(original); expect(packet.originals.length).toBeGreaterThan(0);
  await page.getByLabel('Session JSON file').setInputFiles({ name: 'evidence.json', mimeType: 'application/json', buffer: Buffer.from(original) });
  await expect(page.getByRole('heading', { name: 'Preserved evidence' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Recheck report' })).toBeVisible();
  const saved = await downloadedText(page, 'Download original package'); expect(saved).toBe(original);
  await page.getByRole('button', { name: 'Load rechecked workspace' }).click();
  await expect(page.getByText('Rechecked workspace loaded.', { exact: true })).toBeVisible();
  await expect(page.getByText(/1 of 16 notebook places used/)).toBeVisible();
});

test('notebook rejects imports over the hosted limit before sending any request', async ({ page }) => {
  await open(page, 'sources');
  const requests: string[] = [];
  await page.route('**/api/**', (route) => { requests.push(route.request().url()); return route.abort(); });
  await page.getByLabel('Session JSON file').setInputFiles({ name: 'oversize.json', mimeType: 'application/json', buffer: Buffer.alloc(4 * 1024 * 1024 + 1, 0x20) });
  await expect(page.getByRole('status').filter({ hasText: 'Nothing loaded:' })).toContainText('4 MiB hosted HTTP limit');
  await expect(page.getByRole('status').filter({ hasText: 'Nothing loaded:' })).toContainText('Nothing was sent or truncated');
  await expect(page.getByRole('status').filter({ hasText: 'Nothing loaded:' })).toContainText('8 MiB');
  expect(requests).toEqual([]);
});

test('an in-flight filtered brief never appears under a different selection', async ({ page }) => {
  await open(page, 'findings');
  await expect(page.locator('.claim').first()).toBeVisible();
  let release: (() => void) | undefined;
  const hold = new Promise<void>((resolve) => { release = resolve; });
  await page.route('**/api/assess', async (route) => { await hold; await route.continue(); });
  await page.getByRole('button', { name: 'Suppression', exact: true }).click();
  await expect(page.locator('.claim')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Download brief as JSON' })).toHaveCount(0);
  release!();
  await expect(page.getByText('2 findings', { exact: true })).toBeVisible();
});

test('all three scientific calculators use the exact backend methods without network access', async ({ page }) => {
  await open(page, 'sources');
  await page.getByText('Open scientific calculators', { exact: true }).click();
  const requests: string[] = [];
  await page.route('**/*', (route) => { requests.push(route.request().url()); return route.abort(); });
  const expected = { trajectory: calculateTrajectory(trajectoryExample()), design: auditDesign(TWO_POINT_DESIGN_EXAMPLE), endpoint: auditEndpoints(endpointExample()) };
  for (const method of ['trajectory', 'design', 'endpoint'] as const) {
    await page.getByRole('combobox', { name: 'Scientific method', exact: true }).selectOption(method);
    await page.getByRole('button', { name: 'Run local calculation', exact: true }).click();
    await expect(page.getByRole('article', { name: 'Scientific calculation result' })).toBeVisible();
    const output = JSON.parse(await downloadedText(page, 'Download calculation record'));
    expect(output.result).toEqual(expected[method]); expect(output.resultDigest).toBe(digestOf(expected[method]));
  }
  expect(requests).toEqual([]);
});
