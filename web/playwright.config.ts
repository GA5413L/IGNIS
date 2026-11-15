import { defineConfig, devices } from '@playwright/test';

// Current UI handoff tests. Older workspace/notebook/scenario specs retain the historical selectors.
// Uses installed Playwright browsers; this command never downloads a browser.
export default defineConfig({
  testDir: 'tests/e2e',
  testMatch: ['landing.spec.ts', 'dashboard.spec.ts', 'source-identity.spec.ts', 'workbench.spec.ts', 'si-figures.spec.ts', 'gateway.spec.ts', 'channel-differences.spec.ts', 'detector-association.spec.ts', 'figures-interaction.spec.ts'],
  timeout: 60_000,
  retries: 0,
  workers: 2,
  reporter: [['list']],
  use: { baseURL: 'http://127.0.0.1:3000', trace: 'off', acceptDownloads: true },
  projects: [
    { name: 'desktop-1366', use: { ...devices['Desktop Chrome'], viewport: { width: 1366, height: 768 }, launchOptions: { executablePath: process.env.IGNIS_CHROMIUM_EXECUTABLE } } },
    { name: 'mobile-375', use: { browserName: 'chromium', viewport: { width: 375, height: 812 }, isMobile: false, launchOptions: { executablePath: process.env.IGNIS_CHROMIUM_EXECUTABLE } } },
    ...(process.env.IGNIS_TEST_FIREFOX === '1' ? [{ name: 'firefox-1366', use: { browserName: 'firefox' as const, viewport: { width: 1366, height: 768 }, launchOptions: { executablePath: process.env.IGNIS_FIREFOX_EXECUTABLE } } }] : []),
  ],
  webServer: { command: 'node node_modules/next/dist/bin/next start -p 3000 -H 127.0.0.1', url: 'http://127.0.0.1:3000/api/health', timeout: 120_000, reuseExistingServer: true },
});
