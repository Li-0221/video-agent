import process from 'node:process';
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './test/e2e',
  outputDir: './test/test-results',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never', outputFolder: './test/playwright-report' }], ['list']],
  use: {
    baseURL: 'http://127.0.0.1:9527',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ],
  webServer: {
    command: 'pnpm exec vite --host 127.0.0.1 --port 9527 --strictPort --open=false',
    url: 'http://127.0.0.1:9527',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  }
});
