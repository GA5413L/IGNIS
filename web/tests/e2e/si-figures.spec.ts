import { expect, test } from '@playwright/test';

test('figure palette changes plots and downloads; its source and exact data are accessible', async ({ page }) => {
  await page.goto('/console#figures');
  await page.getByRole('combobox', { name: 'Figure palette', exact: true }).selectOption('monochrome');
  await expect(page.locator('.shell')).toHaveAttribute('data-palette', 'monochrome');
  await expect(page.getByRole('link', { name: 'Download PDF', exact: true }).first()).toHaveAttribute('href', '/figures/monochrome/fig1-atmosphere-cases.pdf');
  await page.getByText('Code for Figure 1', { exact: true }).click();
  const details = page.locator('details').filter({ has: page.getByText('Code for Figure 1', { exact: true }) });
  await expect(details).toContainText('--figure 1 --palette monochrome');
  await expect(details).toContainText('def fig_atmospheres');
  const manifest = await (await page.request.get('/figures/code/manifest.json')).json();
  expect(manifest.palettes).toEqual(['okabe-ito', 'monochrome']);
  expect((await page.request.get('/figures/code/ignis-figure-reproduction.zip')).ok()).toBe(true);
  await page.getByRole('combobox', { name: 'Figure palette', exact: true }).selectOption('okabe-ito');
  await expect(page.getByRole('link', { name: 'Download PDF', exact: true }).first()).toHaveAttribute('href', '/figures/fig1-atmosphere-cases.pdf');
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0);
});
