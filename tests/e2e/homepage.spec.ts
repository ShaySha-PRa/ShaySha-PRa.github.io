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

test('homepage follows the approved curated-cover hierarchy', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.locator('[data-section="featured-project"]')).toContainText(
    'My Company Brain',
  );
  await expect(
    page.locator('[data-section="selected-projects"] [data-project-card]'),
  ).toHaveCount(5);
  await expect(page.locator('[data-section="latest-writing"]')).toBeVisible();
  await expect(page.locator('[data-section="latest-journal"]')).toBeVisible();
  await expect(page.locator('[data-section="latest-writing"]')).toContainText(
    '文章正在整理中。 / Writing is being prepared.',
  );
  await expect(page.locator('[data-section="latest-journal"]')).toContainText(
    '影像记录正在整理中。 / Journal entries are being prepared.',
  );
});

test('mobile homepage is a single readable column', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-chromium');
  await page.goto('/');
  const sections = page.locator('[data-section]');
  await expect(sections).toHaveCount(6);
  const viewportWidth = page.viewportSize()?.width ?? 420;
  const boxes = await sections.evaluateAll((items) =>
    items.map((section) => {
      const box = section.getBoundingClientRect();
      return { width: box.width, x: box.x, y: box.y, bottom: box.bottom };
    }),
  );
  expect(boxes.every((box) => box.width <= Math.min(viewportWidth, 420))).toBe(
    true,
  );
  const closingBoxes = boxes.slice(-2);
  expect(Math.abs(closingBoxes[0].x - closingBoxes[1].x)).toBeLessThan(1);
  expect(closingBoxes[1].y).toBeGreaterThanOrEqual(closingBoxes[0].bottom);
});

test('English homepage keeps the approved bilingual empty states', async ({
  page,
}) => {
  await page.goto('/en/');
  await expect(page.locator('[data-section]')).toHaveCount(6);
  await expect(page.locator('[data-section="featured-project"]')).toContainText(
    'My Company Brain',
  );
  await expect(
    page.locator('[data-section="selected-projects"] [data-project-card]'),
  ).toHaveCount(5);
  await expect(page.locator('[data-section="now"]')).toContainText(
    'Building My Company Brain and organizing project and technical notes.',
  );
  await expect(page.locator('[data-section="latest-writing"]')).toContainText(
    '文章正在整理中。 / Writing is being prepared.',
  );
  await expect(page.locator('[data-section="latest-journal"]')).toContainText(
    '影像记录正在整理中。 / Journal entries are being prepared.',
  );
});
