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
}, testInfo) => {
  await page.goto('/');

  const navigation =
    testInfo.project.name === 'mobile-chromium'
      ? page.locator('details.mobile-nav nav')
      : page.getByRole('navigation', { name: '主导航' });
  if (testInfo.project.name === 'mobile-chromium') {
    await page.locator('details.mobile-nav summary').click();
  }

  await expect(navigation).toBeVisible();
  await expect(
    navigation.getByRole('link', { name: 'English' }),
  ).toHaveAttribute('href', '/en/');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    /个人空间/,
  );
});

test('mobile menu hides desktop navigation and exposes all routes', async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== 'mobile-chromium',
    'mobile-only regression',
  );

  await page.goto('/');
  const header = page.locator('header.site-header');
  await expect(header.locator('.primary-nav')).toBeHidden();

  const menu = header.locator('details.mobile-nav');
  await expect(menu).toBeVisible();
  await menu.locator('summary').click();

  const mobileNavigation = menu.locator('nav');
  await expect(mobileNavigation).toBeVisible();
  const routeLinks = mobileNavigation.locator('a:not(.locale-switch)');
  await expect(routeLinks).toHaveCount(5);
  for (const href of ['/', '/projects/', '/writing/', '/journal/', '/about/']) {
    await expect(mobileNavigation.locator(`a[href="${href}"]`)).toBeVisible();
  }
});
