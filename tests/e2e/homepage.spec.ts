import { expect, test } from '@playwright/test';

test('Chinese homepage has the personal-space identity', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Junshu Sha/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Building useful systems',
  );
});
