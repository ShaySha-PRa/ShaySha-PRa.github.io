import { expect, test } from '@playwright/test';

test('Chinese homepage has the personal-space identity', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Junshu Sha/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Building useful systems',
  );
});

test('homepage exposes semantic navigation and locale switch', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.getByRole('navigation', { name: '主导航' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'English' })).toHaveAttribute(
    'href',
    '/en/',
  );
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    /个人空间/,
  );
});
