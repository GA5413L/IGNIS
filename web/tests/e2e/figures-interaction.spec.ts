import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { detectorDataset } from '../../src/core/detector';

const baseline = detectorDataset.records.filter((row) => row.materialRole !== 'reference');
const teflon = baseline.filter((row) => row.material === 'Teflon');

test('material legend isolates on first click, toggles thereafter, restores all and preserves axes and point positions', async ({ page }) => {
  await page.goto('/console#figures');
  const figure = page.getByTestId('detector-figure-explorer'), legend = figure.getByRole('group', { name: 'Detector figure materials', exact: true });
  const teflonButton = legend.getByRole('button', { name: 'Teflon, 23 source rows', exact: true });
  const kaptonButton = legend.getByRole('button', { name: 'Kapton, 36 source rows', exact: true });
  await expect(legend.getByRole('status')).toHaveText('All 5 materials visible · 134 source rows.');
  const domains = await figure.locator('svg[data-detector-panel]').evaluateAll((nodes) => nodes.map((node) => node.getAttribute('data-y-domain')));
  const witness = figure.locator('[data-source-cell="AW134"]');
  const before = [await witness.getAttribute('data-point-x'), await witness.getAttribute('data-point-y')];
  await teflonButton.focus(); await page.keyboard.press('Enter');
  await expect(teflonButton).toHaveAttribute('aria-pressed', 'true'); await expect(kaptonButton).toHaveAttribute('aria-pressed', 'false');
  await expect(legend.getByRole('status')).toHaveText('1 of 5 materials visible · 23 source rows.');
  await expect(figure.locator('[data-source-cell]')).toHaveCount(92);
  expect(await figure.locator('[data-source-cell]').evaluateAll((nodes) => [...new Set(nodes.map((node) => node.getAttribute('data-material')))])).toEqual(['Teflon']);
  expect([await witness.getAttribute('data-point-x'), await witness.getAttribute('data-point-y')]).toEqual(before);
  expect(await figure.locator('svg[data-detector-panel]').evaluateAll((nodes) => nodes.map((node) => node.getAttribute('data-y-domain')))).toEqual(domains);
  await kaptonButton.click(); await expect(legend.getByRole('status')).toHaveText('2 of 5 materials visible · 59 source rows.');
  await teflonButton.click(); await expect(legend.getByRole('status')).toHaveText('1 of 5 materials visible · 36 source rows.');
  await kaptonButton.click(); await expect(legend.getByRole('status')).toHaveText('No materials visible · 0 source rows.');
  await expect(figure.locator('[data-source-cell]')).toHaveCount(0); await expect(figure.locator('svg[data-detector-panel]')).toHaveCount(4);
  await legend.getByRole('button', { name: 'Show all', exact: true }).click(); await expect(legend.getByRole('status')).toHaveText('All 5 materials visible · 134 source rows.');
  await expect(figure.locator('[data-source-cell]')).toHaveCount(533);
  await teflonButton.click(); await expect(legend.getByRole('status')).toHaveText('1 of 5 materials visible · 23 source rows.');
  for (const material of ['Kapton', 'Lampwick', 'Silicone', 'Pyrell']) await legend.getByRole('button', { name: new RegExp(`^${material},`) }).click();
  await expect(legend.getByRole('status')).toHaveText('All 5 materials visible · 134 source rows.');
  await teflonButton.click(); await expect(legend.getByRole('status')).toHaveText('4 of 5 materials visible · 111 source rows.');
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0);
});

test('visible JSON/SVG export the exact selection and source cells; static exports retain their full view', async ({ page }) => {
  await page.goto('/console#figures');
  const figure = page.getByTestId('detector-figure-explorer'), legend = figure.getByRole('group', { name: 'Detector figure materials', exact: true });
  const staticSvg = page.locator('a[href="/figures/fig2-detector-readings.svg"]');
  await expect(staticSvg).toBeVisible();
  await legend.getByRole('button', { name: 'Teflon, 23 source rows', exact: true }).click();
  await expect(staticSvg).toHaveAttribute('href', '/figures/fig2-detector-readings.svg');
  await figure.locator('[data-source-cell="AW134"]').focus(); await page.keyboard.press('Enter');
  await expect(figure.getByRole('article', { name: 'Figure source cells', exact: true })).toContainText('1.6403656500000001');
  const jsonPending = page.waitForEvent('download'); await figure.getByRole('button', { name: 'Download visible data · JSON', exact: true }).click();
  const packet = JSON.parse(await readFile((await (await jsonPending).path())!, 'utf8'));
  expect(packet.recipe.visibleMaterials).toEqual(['Teflon']); expect(packet.recipe.selectionMode).toBe('explicit');
  expect(packet.viewOnly).toBe(true);
  expect(packet.rows).toEqual(teflon); expect(packet.visibleRecordIds).toEqual(teflon.map((row) => row.id));
  expect(packet.source.workbook.sha256).toBe(detectorDataset.source.workbook.sha256); expect(packet.counts.issScatterV).toEqual({ rows: 23, finite: 23, missing: 0, error: 0, nonNumeric: 0 });
  await page.getByRole('combobox', { name: 'Figure palette', exact: true }).selectOption('monochrome');
  await expect(page.locator('a[href="/figures/monochrome/fig2-detector-readings.svg"]')).toBeVisible();
  await expect(legend.getByRole('status')).toHaveText('1 of 5 materials visible · 23 source rows.');
  await expect(figure.locator('[data-source-cell="AW134"] [data-material-mark="Teflon"]')).toHaveAttribute('stroke', '#f4f4f4');
  const screenWitnesses = await figure.locator('[data-source-cell]').evaluateAll((nodes) => nodes.map((node) => ({ cell: node.getAttribute('data-source-cell'), recordId: node.getAttribute('data-record-id'), x: node.getAttribute('data-point-x'), y: node.getAttribute('data-point-y') })));
  const svgPending = page.waitForEvent('download'); await figure.getByRole('button', { name: 'Download visible SVG', exact: true }).click();
  const svg = await readFile((await (await svgPending).path())!, 'utf8');
  const parsed = await page.evaluate((text) => {
    const doc = new DOMParser().parseFromString(text, 'image/svg+xml'), metadata = JSON.parse(doc.querySelector('metadata')!.textContent!);
    return { errors: doc.querySelectorAll('parsererror').length, materials: [...new Set([...doc.querySelectorAll('[data-source-cell]')].map((node) => node.getAttribute('data-material')))],
      marks: doc.querySelectorAll('[data-source-cell]').length, panels: doc.querySelectorAll('[data-detector-panel]').length, palette: metadata.recipe.palette,
      rowIds: metadata.visibleRecordIds, strokes: [...new Set([...doc.querySelectorAll('[data-material-mark]')].map((node) => node.getAttribute('stroke')))],
      linkedAssets: doc.querySelectorAll('image,script,foreignObject').length, axes: metadata.recipe.axes,
      witnesses: [...doc.querySelectorAll('[data-source-cell]')].map((node) => ({ cell: node.getAttribute('data-source-cell'), recordId: node.getAttribute('data-record-id'), x: node.getAttribute('data-point-x'), y: node.getAttribute('data-point-y') })), counts: metadata.counts };
  }, svg);
  expect(parsed).toMatchObject({ errors: 0, materials: ['Teflon'], marks: 92, panels: 4, palette: 'monochrome', strokes: ['#111111'], linkedAssets: 0 });
  expect(parsed.rowIds).toEqual(packet.visibleRecordIds); expect(parsed.axes).toEqual(packet.recipe.axes);
  expect(parsed.witnesses).toEqual(screenWitnesses); expect(parsed.counts).toEqual(packet.counts);
  expect(parsed.witnesses.map((point) => point.cell).sort()).toEqual(teflon.flatMap((row) => Object.values(row.channels).filter((cell) => cell.status === 'finite').map((cell) => cell.cell)).sort());
  await legend.getByRole('button', { name: 'Hide all', exact: true }).click();
  await expect(figure.getByRole('article', { name: 'Figure source cells', exact: true })).toHaveCount(0);
  const emptyPending = page.waitForEvent('download'); await figure.getByRole('button', { name: 'Download visible data · JSON', exact: true }).click();
  const empty = JSON.parse(await readFile((await (await emptyPending).path())!, 'utf8'));
  expect(empty.rows).toEqual([]); expect(empty.recipe.visibleMaterials).toEqual([]); expect(empty.recipe.axes).toEqual(packet.recipe.axes);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0);
});

test('a material with missing cells retains the row and exposes its unavailable statuses', async ({ page }) => {
  await page.goto('/console#figures');
  const figure = page.getByTestId('detector-figure-explorer'), legend = figure.getByRole('group', { name: 'Detector figure materials', exact: true });
  await legend.getByRole('button', { name: 'Kapton, 36 source rows', exact: true }).click();
  await expect(figure.locator('svg[data-detector-panel="issScatterV"]')).toHaveAttribute('aria-label', 'ISS detector scatter: 35 finite readings of 36 visible source rows');
  await expect(figure.locator('svg[data-detector-panel="issScatterV"]')).toContainText('1 missing');
  await figure.getByText('Every visible source row (36)', { exact: true }).click(); await figure.getByRole('button', { name: 'Inspect row 50', exact: true }).click();
  const inspector = figure.getByRole('article', { name: 'Figure source cells', exact: true });
  await expect(inspector).toContainText('AW50'); await expect(inspector).toContainText('(blank)'); await expect(inspector).toContainText('missing');
  await expect(figure.locator('[data-source-cell="AW50"]')).toHaveCount(0);
  const pending = page.waitForEvent('download'); await figure.getByRole('button', { name: 'Download visible data · JSON', exact: true }).click();
  const packet = JSON.parse(await readFile((await (await pending).path())!, 'utf8'));
  expect(packet.counts.issScatterV).toEqual({ rows: 36, finite: 35, missing: 1, error: 0, nonNumeric: 0 });
  expect(packet.rows.find((row: { excelRow: number }) => row.excelRow === 50).channels.issScatterV).toMatchObject({ cell: 'AW50', originalValue: null, value: null, status: 'missing' });
});
