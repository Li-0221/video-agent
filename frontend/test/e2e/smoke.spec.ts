import { expect, test } from '@playwright/test';

test('应用壳在 Chromium 无头模式可正常加载', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveURL(/http:\/\/127\.0\.0\.1:9527\/?/);
  await expect(page.locator('body')).toBeVisible();
});
