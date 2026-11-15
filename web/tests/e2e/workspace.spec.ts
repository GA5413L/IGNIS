import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';

test.describe('signed-out workspace (M29, CH01)', () => {
  test('interpretation waits for its catalogue instead of silently ignoring an early click', async ({ page }) => {
    let release!: () => void, observed!: () => void;
    const gate = new Promise<void>((r) => { release = r; }), intercepted = new Promise<void>((r) => { observed = r; });
    await page.route('**/api/catalog', async (route) => { const response = await route.fetch(); observed(); await gate; await route.fulfill({ response }); });
    try {
      await page.goto('/'); await intercepted;
      await page.getByRole('textbox', { name: 'Question', exact: true }).fill('A question typed before the catalogue arrives');
      await expect(page.getByRole('button', { name: 'Interpret with AI', exact: true })).toBeDisabled();
      release();
      await expect(page.getByRole('button', { name: 'Interpret with AI', exact: true })).toBeEnabled();
      await page.getByRole('button', { name: 'Interpret with AI', exact: true }).click();
      await expect(page.getByText(/AI interpretation unavailable/).first()).toBeVisible();
    } finally { release(); }
  });
  test('catalogue, honest AI status and the typed fallback', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Investigations in this reviewed bank' })).toBeVisible();
    await expect(page.locator('table.inv-table tbody tr')).toHaveCount(10);
    await expect(page.getByText('AI interpretation: unavailable')).toBeVisible();
    await page.getByRole('textbox', { name: 'Question' }).fill('Compare heat release');
    await page.getByRole('button', { name: 'Interpret with AI' }).click();
    await expect(page.getByText(/AI interpretation unavailable/).first()).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });

  test('W1 → result → exports match → W3 revision explains the change', async ({ page }, info) => {
    test.skip(info.project.name !== 'desktop-1366', 'full path checked once on desktop');
    await page.goto('/');
    await page.getByRole('button', { name: /what tests its later CO₂ response/ }).click();
    await page.getByRole('button', { name: 'Confirm and assess' }).click();
    await expect(page.getByRole('heading', { name: 'Model assessment' })).toBeVisible();
    await expect(page.getByText('Comparison specified (conditional)').first()).toBeVisible();
    await expect(page.getByText('Unresolved: requirement missing').first()).toBeVisible();
    const shown = await page.locator('article.claim').first().innerText();

    const [md] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Export Markdown' }).first().click()]);
    const mdText = readFileSync(await md.path(), 'utf8').replace(/\\(.)/g, '$1');
    const [js] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Export JSON' }).first().click()]);
    const json = JSON.parse(readFileSync(await js.path(), 'utf8'));
    for (const c of json.claims) expect(mdText).toContain(c.authoritativeText);
    expect(shown).toContain(json.claims[0].title);

    // keyboard: inspector opens with Enter, Escape closes and focus returns
    const inspect = page.getByRole('button', { name: 'Inspect evidence' }).first();
    await inspect.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('heading', { name: 'Evidence', exact: true })).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(inspect).toBeFocused();

    await page.getByRole('button', { name: 'Explore' }).click();
    await page.getByRole('button', { name: /does it predict chemical heat release/ }).click();
    await page.getByRole('button', { name: 'Reassess as a revision of the current result' }).click();
    await expect(page.getByRole('heading', { name: 'What changed' })).toBeVisible();
    await expect(page.getByText('Not supported for this claim').first()).toBeVisible();
    await expect(page.getByText(/1280 kJ/).first()).toBeVisible();
  });

  test('broad brief shows all three safety areas', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Broad brief/ }).click();
    await page.getByRole('button', { name: 'Confirm and assess' }).click();
    await expect(page.getByRole('heading', { name: 'Research brief' })).toBeVisible();
    for (const area of ['Prevention', 'Detection', 'Suppression']) await expect(page.getByRole('heading', { name: area, exact: true })).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
  test('model result fits a 375 px screen; wide tables scroll inside their container (M28)', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /what tests its later CO₂ response/ }).click();
    await page.getByRole('button', { name: 'Confirm and assess' }).click();
    await expect(page.getByRole('heading', { name: 'Model assessment' })).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
});
