import { expect, test } from '@playwright/test';

test('writing routes and RSS respond successfully', async ({
  page,
  request,
}) => {
  await page.goto('/writing/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('文章');
  const rss = await request.get('/rss.xml');
  expect(rss.ok()).toBe(true);
  expect(await rss.text()).toContain('<rss');
});
