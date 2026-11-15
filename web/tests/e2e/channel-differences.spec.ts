import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { makeDifferencePackage, replayDifferencePackage, serializeDifferencePackage } from '../../src/core/channelDifferences';
import { defaultRecipe, parseCsv, type ImportSpec } from '../../src/core/workbench';

const raw = '\uFEFFtime,run,left,right\r\n0,a,1,0\r\n1,a,2,4\r\n2,a,,3\r\n';
const spec: ImportSpec = { delimiter: ',', headerRecord: 1, firstDataRecord: 2, lastDataRecord: null, origin: 'hypothetical', sourceDescription: 'Invented browser fixture',
  context: 'Same synthetic context', timeOrigin: 'Common synthetic zero', timeColumn: 0, timeUnit: 's', timeMissingTokens: [], run: { kind: 'column', column: 1 }, phase: { kind: 'constant', value: 'spread' },
  channels: [2, 3].map((column) => ({ column, quantity: 'Coordinate', unit: 'mm', operator: 'Same invented coordinate', missingTokens: [] })) };
const recipe = { ...defaultRecipe(spec), run: 'a', phase: 'spread' };
const packet = makeDifferencePackage(parseCsv(new TextEncoder().encode(raw), ','), 'hypothetical-pairs.csv', spec, recipe,
  { leftColumn: 2, rightColumn: 3, alignedByRecord: true, linearAdditiveQuantity: true, sharedReferenceDatum: true, referenceDatum: 'Same synthetic coordinate origin and axis',
    upstreamProcessing: 'Invented values on the same row clock. No fitting or resampling.' });

test('local difference plot exposes raw witnesses and exports/replays the exact comparison', async ({ page }) => {
  const external: string[] = [];
  await page.route(/gateway\.ai\.cloudflare\.com|api\.groq\.com|openrouter\.ai/, (route) => { external.push(route.request().url()); return route.abort(); });
  await page.goto('/console#local-data');
  await page.getByLabel('Replay package · JSON, up to 8 MiB', { exact: true }).setInputFiles({ name: 'comparison.json', mimeType: 'application/json', buffer: Buffer.from(serializeDifferencePackage(packet)) });
  await expect(page.getByText(/Recomputed identically, including channel differences/)).toBeVisible();
  await expect(page.getByText(/2 paired of 3 selected records/)).toBeVisible();
  const assumptions = page.getByRole('complementary', { name: 'Declared comparison assumptions', exact: true });
  await expect(assumptions).toBeVisible(); await expect(assumptions).toContainText('linear, additive scale');
  await expect(assumptions).toContainText('Same synthetic coordinate origin and axis');
  await expect(assumptions).toContainText('Relative lag'); await expect(assumptions).toContainText('not time weighting');
  await expect(assumptions).toContainText('Missing pairs change the represented population');
  await page.getByRole('button', { name: 'Difference record 3: -2 mm', exact: true }).click();
  await expect(page.getByRole('article', { name: 'Raw record inspector' })).toContainText('Record 3');
  const downloadButton = page.getByRole('button', { name: 'Download comparison replay package', exact: true });
  await expect(downloadButton).toBeDisabled();
  await page.getByRole('checkbox', { name: 'I want the downloaded package to include this raw file and its metadata.', exact: true }).check();
  const pending = page.waitForEvent('download'); await downloadButton.click();
  const exported = replayDifferencePackage(await readFile((await (await pending).path())!, 'utf8'));
  expect(exported.document.rawText).toBe(raw); expect(exported.result.metrics?.meanDifference).toBe(-0.5); expect(exported.source.recipe.selectedRecord).toBe(3);
  expect(exported.packet.pairing).toEqual(packet.pairing); expect(exported.result.assumptions.referenceDatum).toBe(packet.pairing.referenceDatum);
  await page.getByRole('textbox', { name: 'Upstream alignment and processing', exact: true }).fill('Changed declaration');
  await expect(page.getByText('Mean difference', { exact: true })).toHaveCount(0);
  expect(external).toEqual([]); expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0);
});

test('clearing either scientific assertion invalidates displayed results and prevents recomputation', async ({ page }) => {
  await page.goto('/console#local-data');
  await page.getByLabel('Replay package · JSON, up to 8 MiB', { exact: true }).setInputFiles({ name: 'comparison.json', mimeType: 'application/json', buffer: Buffer.from(serializeDifferencePackage(packet)) });
  const compute = page.getByRole('button', { name: 'Compute channel differences', exact: true });
  const linear = page.getByRole('checkbox', { name: 'I assert that ordinary subtraction is meaningful on a linear, additive scale, without circular wrapping or logarithmic subtraction.', exact: true });
  const reference = page.getByRole('checkbox', { name: 'I assert that both channels use the stated common reference or datum.', exact: true });
  await expect(page.getByText('Mean difference', { exact: true })).toBeVisible();
  for (const assertion of [linear, reference]) {
    await assertion.uncheck(); await expect(compute).toBeDisabled(); await expect(page.getByText('Mean difference', { exact: true })).toHaveCount(0);
    await assertion.check(); await expect(compute).toBeEnabled(); await compute.click();
    await expect(page.getByText('Mean difference', { exact: true })).toBeVisible();
  }
  await page.getByRole('textbox', { name: 'Shared reference or datum', exact: true }).fill('unknown'); await compute.click();
  await expect(page.locator('p[role="alert"]')).toContainText('Describe the shared reference or datum');
  await expect(page.getByText('Mean difference', { exact: true })).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0);
});

test('nonzero underflow is visibly unavailable while the original tiny pairs remain inspectable', async ({ page }) => {
  const tinyRaw = 'time,run,left,right\n0,a,5e-324,0\n1,a,0,0\n2,a,0,0\n3,a,0,0\n4,a,0,0\n';
  const tiny = makeDifferencePackage(parseCsv(new TextEncoder().encode(tinyRaw), ','), 'hypothetical-tiny.csv', spec, recipe, packet.pairing);
  await page.goto('/console#local-data');
  await page.getByLabel('Replay package · JSON, up to 8 MiB', { exact: true }).setInputFiles({ name: 'tiny.json', mimeType: 'application/json', buffer: Buffer.from(serializeDifferencePackage(tiny)) });
  await expect(page.getByText('Unavailable (numeric range)', { exact: true })).toHaveCount(3);
  await expect(page.getByRole('status').getByRole('listitem').filter({ hasText: /Root mean square difference is unavailable: floating-point underflow/ })).toBeVisible();
  await page.getByRole('button', { name: 'Difference record 2: 5e-324 mm', exact: true }).focus(); await page.keyboard.press('Enter');
  await expect(page.getByRole('article', { name: 'Raw record inspector' })).toContainText('5e-324');
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0);
});

test('different measurement operators block aggregate differences despite identical units', async ({ page }) => {
  const different = structuredClone(spec); different.channels[1].operator = 'Different optical diagnostic';
  const blocked = makeDifferencePackage(parseCsv(new TextEncoder().encode(raw), ','), 'mismatched.csv', different, recipe, packet.pairing);
  await page.goto('/console#local-data');
  await page.getByLabel('Replay package · JSON, up to 8 MiB', { exact: true }).setInputFiles({ name: 'blocked.json', mimeType: 'application/json', buffer: Buffer.from(serializeDifferencePackage(blocked)) });
  await expect(page.getByRole('heading', { name: 'Comparison needs compatible declarations', exact: true })).toBeVisible();
  await expect(page.getByText('Mean difference', { exact: true })).toHaveCount(0);
  await expect(page.getByText('Equal units do not imply equal measurement meaning. Review the mapping above.', { exact: true })).toBeVisible();
});
