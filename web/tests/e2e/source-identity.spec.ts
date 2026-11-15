import { expect, test } from '@playwright/test';
import { detectorDataset } from '../../src/core/detector';
import { conditionDataset } from '../../src/core/conditions';
import { requireCatalog } from '../../src/core/registry';
import atlasDataset from '../../data/investigation-atlas.json';
import { buildResearchAnalysis } from '../../src/core/researchSelections';
import { DEFAULT_CUTOFF_ENVELOPE_SELECTION } from '../../src/core/cutoffEnvelope';

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
  await page.goto('/');
  await page.getByRole('button', { name: 'Test a finding’s robustness', exact: false }).click();
  await expect(page.getByRole('table', { name: 'Cutoff range by flight' })).toBeVisible();
  await page.getByRole('button', { name: 'Create scenario link', exact: true }).click();
  const url = await page.getByLabel('Scenario URL', { exact: true }).inputValue();
  const packet = JSON.parse(Buffer.from(new URL(url).hash.slice('#ignis-scenario='.length), 'base64url').toString('utf8'));
  const offline = buildResearchAnalysis({ kind: 'cutoff_envelope', options: DEFAULT_CUTOFF_ENVELOPE_SELECTION });
  expect(packet.sourceDigest).toBe(offline.sourceDigest);
  expect(packet.resultDigest).toBe(offline.resultDigest);
  expect(packet.selection).toEqual(offline.selection);
});
