import { expect, test } from '@playwright/test';

test('home presents the evidence and opens the research console', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Fire-safety evidence for crewed spaceflight');
  const catalog = await (await page.request.get('/api/catalog')).json();
  const stats = page.locator('.lp-stats').getByRole('definition');
  await expect(stats).toHaveText(['24', String(catalog.findings.length), '7', '154', String(catalog.sources.length)]);
  await expect(page.locator('#models')).toContainText('Comparison specified (conditional)');
  await expect(page.locator('#models')).toContainText('Not supported for this claim');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.getByRole('link', { name: 'Open the console', exact: true }).click();
  await expect(page).toHaveURL(/\/console$/);
  await expect(page.getByRole('navigation', { name: 'Dashboard sections' })).toBeVisible();
  await page.getByRole('link', { name: 'IGNIS home', exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator('#landing-title')).toBeVisible();
  expect(errors).toEqual([]);
});

test('landing anchors stay on home and result links open the matching console view', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Read the four results' }).click();
  await expect(page).toHaveURL(/\/#prevention$/);
  await expect(page.locator('#prevention-title')).toBeInViewport();
  await page.getByRole('link', { name: 'Compare atmosphere cases', exact: true }).click();
  await expect(page).toHaveURL(/\/console#atmospheres$/);
  await expect(page.getByRole('navigation', { name: 'Dashboard sections' }).getByRole('link', { name: 'Atmospheres' })).toHaveAttribute('aria-current', 'page');
  await page.goBack();
  await expect(page).toHaveURL(/\/#prevention$/);
  await expect(page.locator('#prevention-title')).toBeVisible();
});

test('shared root bookmarks and the example route retain their destinations', async ({ page }) => {
  for (const [before, after, label] of [
    ['/?from=bookmark#si', '/console?from=bookmark#si', 'SI'],
    ['/#figures', '/console#figures', 'Figures'],
    ['/example', '/console#smoke', 'Smoke detection'],
  ]) {
    await page.goto(before);
    await expect(page).toHaveURL(new URL(after, 'http://127.0.0.1:3000').href);
    await expect(page.getByRole('navigation', { name: 'Dashboard sections' }).getByRole('link', { name: label, exact: false })).toHaveAttribute('aria-current', 'page');
  }
});
