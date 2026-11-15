import { expect, test, type Page } from '@playwright/test';

/** Browser checks for the rebuilt dashboard (ui/rebuild-from-scratch). Numbers asserted here are recomputed by src/core. */
const open = async (page: Page, view: string) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto(`/console#${view}`);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  return errors;
};
const noSidewaysScroll = async (page: Page) => {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
};

test.describe('rebuilt dashboard', () => {
  test('overview follows a question through the evidence flow to its result', async ({ page }) => {
    const errors = await open(page, 'overview');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('From a fire-safety question to a sourced result');
    await expect(page.locator('.story li')).toHaveCount(5);
    await expect(page.getByRole('heading', { name: '2 of 7 Saffire burns ran inside the Moon Base atmosphere range' })).toBeVisible();
    const wide = (page.viewportSize()?.width ?? 0) > 1000;
    const choose = async (tag: string, question: RegExp) => {
      if (wide) await page.locator('.fm-node.c0', { hasText: question }).click();
      else await page.locator('.q-chips').getByRole('button', { name: tag, exact: true }).click();
    };
    if (wide) await expect(page.locator('.fm-node')).toHaveCount(32);
    await choose('Detection', /Do detector readings agree/);
    await expect(page.getByRole('heading', { name: 'A pooled detector result hides two flights that disagree' })).toBeVisible();
    await expect(page.getByText('108 of 108 SAME-R obscuration readings are stored as exactly 0 V')).toBeVisible();
    await choose('Modelling', /What can a published fire model claim/);
    await expect(page.getByRole('heading', { name: 'Not supported for this claim' })).toBeVisible();
    await choose('Relevance', /Which investigations matter/);
    await expect(page.getByRole('table').filter({ hasText: 'PSI records' }).getByRole('row')).toHaveCount(11);
    await choose('Suppression', /Is a flame that looks out/);
    await expect(page.getByRole('heading', { name: /droplet flame can look extinguished/ })).toBeVisible();
    await noSidewaysScroll(page);
    await page.getByRole('button', { name: 'Read the suppression findings' }).click();
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Reviewed findings');
    expect(errors).toEqual([]);
  });

  test('every view renders without sideways scroll', async ({ page }) => {
    for (const view of ['overview', 'investigations', 'atmospheres', 'smoke', 'findings', 'figures', 'sources', 'local-data', 'si']) {
      const errors = await open(page, view);
      await noSidewaysScroll(page);
      expect(errors, view).toEqual([]);
    }
  });

  test('atmosphere comparison follows the target and the material group', async ({ page }) => {
    await open(page, 'atmospheres');
    await expect(page.locator('#atm-headline')).toContainText('VI-3 is nearer to the target on both oxygen and pressure');
    await page.getByLabel('Material and burning sides').selectOption('Cotton-2');
    await expect(page.locator('#atm-headline')).toContainText('V-2 is the only Cotton case');
    await page.getByLabel('Target oxygen, mole %').fill('0');
    await expect(page.getByText('Enter oxygen between 0 and 100 mole %.')).toBeVisible();
    await page.getByRole('button', { name: '34% oxygen, 56.5 kPa' }).click();
    await expect(page.getByLabel('Target oxygen, mole %')).toHaveValue('34');
  });

  test('smoke lab reproduces the source counts', async ({ page }) => {
    await open(page, 'smoke');
    await page.locator('label.field', { hasText: /^Material/ }).locator('select').selectOption('Kapton');
    await expect(page.locator('#single-headline')).toContainText('20 of 35 finite readings are below 2 V');
    await page.getByRole('tab', { name: 'Two channels' }).click();
    await page.locator('label.field', { hasText: /^Material/ }).locator('select').selectOption('all');
    await expect(page.locator('#pair-headline')).toContainText('+70/133');
    await expect(page.locator('#pair-headline')).toContainText('opposite directions');
    await page.getByRole('tab', { name: 'Cutoff range' }).click();
    await expect(page.locator('#range-headline')).toContainText('opposite signs');
    await expect(page.getByRole('cell', { name: '[+66, +78]/133' })).toBeVisible();
    await page.getByRole('tab', { name: 'One channel' }).click();
    await page.locator('label.field', { hasText: /^Detector channel/ }).locator('select').selectOption('issObscurationV');
    await expect(page.getByRole('row', { name: /SAME-R 108 108/ })).toBeVisible();
    await page.locator('label.field', { hasText: /^Detector channel/ }).locator('select').selectOption('issScatterV');
    await page.getByRole('tab', { name: 'Cutoff range' }).click();
    await page.getByRole('button', { name: '0 to 5 V' }).click();
    await expect(page.getByText('Changes sign inside the range').first()).toBeVisible();
  });

  test('investigations can be searched, opened and compared', async ({ page }) => {
    await open(page, 'investigations');
    await page.getByLabel('Search title, objective or table column').fill('droplet');
    await expect(page.getByText(/investigations? shown/)).toBeVisible();
    await page.getByLabel('Search title, objective or table column').fill('');
    await page.getByLabel('Compare FLEX', { exact: true }).check();
    await page.getByLabel('Compare FLEX-2', { exact: true }).check();
    await expect(page.getByRole('heading', { name: /FLEX and FLEX-2: what each table records/ })).toBeVisible();
    await page.getByLabel('Search title, objective or table column').fill('zzzz-no-match');
    await expect(page.getByText(/No investigation matches/)).toBeVisible();
  });

  test('findings filter by area and a model claim is checked and revised', async ({ page }) => {
    await open(page, 'findings');
    await expect(page.locator('.claim').first()).toBeVisible();
    await page.getByRole('button', { name: 'Suppression', exact: true }).click();
    await expect(page.getByText(/2 findings/)).toBeVisible();
    await page.getByRole('tab', { name: 'Model claim check' }).click();
    await page.getByRole('button', { name: 'Check this claim' }).click();
    await expect(page.getByText('Comparison specified (conditional)').first()).toBeVisible();
    await page.getByRole('button', { name: 'Chemical heat release, Saffire VI' }).click();
    await page.getByRole('button', { name: 'Check the revised claim' }).click();
    await expect(page.getByText('Not supported for this claim').first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'What changed from your previous question' })).toBeVisible();
  });
});
