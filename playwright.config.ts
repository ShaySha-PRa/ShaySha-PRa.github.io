import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  webServer: {
    command:
      process.platform === 'win32'
        ? 'set ASTRO_PREVIEW_BACKGROUND=0&& npm run preview'
        : 'ASTRO_PREVIEW_BACKGROUND=0 npm run preview',
    url: 'http://127.0.0.1:4321/',
    reuseExistingServer: !process.env.CI,
  },
  use: { baseURL: 'http://127.0.0.1:4321/' },
  projects: [
    { name: 'desktop-chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-chromium', use: { ...devices['Pixel 7'] } },
  ],
});
