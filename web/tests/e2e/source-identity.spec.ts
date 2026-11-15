import { expect, test } from '@playwright/test';
import { detectorDataset } from '../../src/core/detector';
import { conditionDataset } from '../../src/core/conditions';
import { requireCatalog } from '../../src/core/registry';
import atlasDataset from '../../data/investigation-atlas.json';
import { buildResearchAnalysis } from '../../src/core/researchSelections';
import { DEFAULT_CUTOFF_ENVELOPE_SELECTION } from '../../src/core/cutoffEnvelope';
import { readFile } from 'node:fs/promises';

test('production server and browser preserve the offline source numbers and analysis identities', async ({ page, request }) => {
  // Expected values are parsed by the Node test runner, independently of the production bundler.
  const response = await request.get('/api/evidence?collection=detectors&includeReference=true');
  expect(response.ok()).toBe(true);
  const exported = await response.json();
  expect(exported.rows.map((row: { record: unknown }) => row.record)).toEqual(detectorDataset.records);
  for (const [collection, expected] of [['conditions', conditionDataset], ['atlas', atlasDataset]] as const) {
    const read = await request.get(`/api/evidence?collection=${collection}`);
    expect(read.ok()).toBe(true); expect(await read.json()).toEqual(expected);
  }
  const health = await (await request.get('/api/health')).json();
  expect(health.catalogDigest).toBe(requireCatalog().digest);
  await page.goto('/#smoke');
  await page.getByRole('tab', { name: 'Cutoff range', exact: true }).click();
  const file = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download range analysis', exact: true }).click();
  const downloaded = await file;
  const packet = JSON.parse(await readFile((await downloaded.path())!, 'utf8'));
  const offline = buildResearchAnalysis({ kind: 'cutoff_envelope', options: DEFAULT_CUTOFF_ENVELOPE_SELECTION });
  expect(packet).toEqual(offline.result);
});
