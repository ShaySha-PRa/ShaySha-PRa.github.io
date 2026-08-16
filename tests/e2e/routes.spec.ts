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

test('bilingual about and resume routes expose private-safe empty states', async ({
  page,
}) => {
  await page.goto('/about/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('关于');
  await expect(page.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
    'href',
    'https://github.com/ShaySha-PRa',
  );
  await expect(page.getByRole('status')).toContainText('简介正在整理中');

  await page.goto('/en/about/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('About');
  await expect(page.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
    'href',
    'https://github.com/ShaySha-PRa',
  );
  await expect(page.getByRole('status')).toContainText(
    'Biography is being prepared',
  );

  await page.goto('/resume/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('简历');
  await expect(page.getByRole('status')).toContainText('履历正在整理中');
  await expect(page.getByRole('link', { name: /PDF/i })).toHaveCount(0);

  await page.goto('/en/resume/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Résumé');
  await expect(page.getByRole('status')).toContainText(
    'Résumé is being prepared',
  );
  await expect(page.getByRole('link', { name: /PDF/i })).toHaveCount(0);
});

test('about pages request only local hosts', async ({ page }) => {
  const hosts = new Set<string>();
  page.on('request', (request) => hosts.add(new URL(request.url()).host));
  await page.goto('/about/');
  expect([...hosts].every((host) => host === '127.0.0.1:4321')).toBe(true);
});
