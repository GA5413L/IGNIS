import { defineConfig, devices } from '@playwright/test';

// Uses the locally installed Google Chrome (channel 'chrome'); no browser binary is downloaded.
export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 60_000,
  retries: 0,
  reporter: [['list']],
  use: { baseURL: 'http://127.0.0.1:3100', channel: 'chrome', trace: 'off', acceptDownloads: true },
  projects: [
    { name: 'desktop-1366', use: { ...devices['Desktop Chrome'], channel: 'chrome', viewport: { width: 1366, height: 768 } } },
    { name: 'mobile-375', use: { channel: 'chrome', viewport: { width: 375, height: 812 }, isMobile: false } },
  ],
  webServer: { command: 'npx next start -p 3100 -H 127.0.0.1', url: 'http://127.0.0.1:3100/api/health', timeout: 120_000, reuseExistingServer: false },
});
