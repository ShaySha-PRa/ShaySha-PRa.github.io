import { expect, test } from '@playwright/test';

test('Chinese journal publishes Cloud and Stone with confirmed metadata', async ({
  page,
}) => {
  const response = await page.goto('/journal/');
  expect(response?.ok()).toBe(true);
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    '影像与生活',
  );
  const card = page.locator('[data-journal-card]');
  await expect(card).toHaveCount(1);
  await expect(card.getByRole('link', { name: '云与石' })).toHaveAttribute(
    'href',
    '/journal/cloud-and-stone/',
  );
  await expect(card).toContainText('2022-03-07');
  await expect(card).toContainText('1 张照片');

  await page.goto('/journal/cloud-and-stone/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('云与石');
  await expect(page.getByText('2022-03-07', { exact: true })).toBeVisible();
  await expect(page.getByText('英国峰区', { exact: true })).toBeVisible();
  await expect(
    page.getByRole('img', {
      name: '一名穿黑色衣服的人坐在岩壁边缘，抬头望向蓝天和大片白云。',
    }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: '在大图查看器中查看第 1 张照片' }),
  ).toBeVisible();
});

test('English journal publishes the translated Cloud and Stone entry', async ({
  page,
}) => {
  const response = await page.goto('/en/journal/');
  expect(response?.ok()).toBe(true);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Journal');
  const card = page.locator('[data-journal-card]');
  await expect(card).toHaveCount(1);
  await expect(
    card.getByRole('link', { name: 'Cloud and Stone' }),
  ).toHaveAttribute('href', '/en/journal/cloud-and-stone/');
  await expect(card.locator('[data-translation-fallback]')).toHaveCount(0);

  await page.goto('/en/journal/cloud-and-stone/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Cloud and Stone',
  );
  await expect(page.getByText('2022-03-07', { exact: true })).toBeVisible();
  await expect(
    page.getByText('Peak District, United Kingdom', { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('img', {
      name: 'A person dressed in black sits at the edge of a rock face, looking up at a blue sky filled with white clouds.',
    }),
  ).toBeVisible();
});
