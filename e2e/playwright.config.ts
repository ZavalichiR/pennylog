import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  retries: 0,
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: [
    {
      command: 'DB_PATH=../e2e/pennylog.test.db npm run dev --prefix ../backend',
      port: 3001,
      reuseExistingServer: false,
      timeout: 15_000,
    },
    {
      command: 'npm run dev --prefix ../frontend',
      port: 5173,
      reuseExistingServer: false,
      timeout: 15_000,
    },
  ],
});
