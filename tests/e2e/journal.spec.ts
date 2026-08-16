import { expect, test } from '@playwright/test';

test('Chinese journal index renders its exact empty state', async ({
  page,
}) => {
  const response = await page.goto('/journal/');
  expect(response?.ok()).toBe(true);
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    '影像与生活',
  );
  await expect(page.locator('[data-journal-empty]')).toHaveText(
    '影像记录正在整理中。',
  );
});

test('English journal index renders its exact empty state', async ({
  page,
}) => {
  const response = await page.goto('/en/journal/');
  expect(response?.ok()).toBe(true);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Journal');
  await expect(page.locator('[data-journal-empty]')).toHaveText(
    'Journal entries are being prepared.',
  );
});
