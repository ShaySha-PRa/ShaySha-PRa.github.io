import { expect, test } from '@playwright/test';

test('Chinese homepage leads with the approved AI application positioning', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Junshu Sha/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'AI 应用工程师 · Agent / RAG / Data Systems',
  );
  await expect(page.locator('.home-hero__lede')).toHaveText(
    '将复杂知识、数据和业务流程构建为可验证、可部署的 AI 应用。',
  );
  await expect(page.locator('.home-hero__signature')).toHaveText(
    'Building useful systems, collecting curious ideas.',
  );
});

test('homepage exposes representative project, resume, and contact calls to action', async ({
  page,
}) => {
  await page.goto('/');
  const actions = page.locator('.home-hero__actions');
  await expect(
    actions.getByRole('link', { name: '查看代表项目' }),
  ).toHaveAttribute('href', '#featured-project');
  await expect(actions.getByRole('link', { name: '查看简历' })).toHaveAttribute(
    'href',
    '/resume/',
  );
  await expect(actions.getByRole('link', { name: '联系我' })).toHaveAttribute(
    'href',
    '/about/#contact',
  );
  await expect(page.locator('.home-hero__proof')).toContainText(
    '测试与验收边界',
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
  await expect(routeLinks).toHaveCount(7);
  for (const href of [
    '/',
    '/projects/',
    '/writing/',
    '/journal/',
    '/about/',
    '/resume/',
    '/about/#contact',
  ]) {
    await expect(mobileNavigation.locator(`a[href="${href}"]`)).toBeVisible();
  }
});

test('desktop navigation exposes one current page and never marks contact current', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name === 'mobile-chromium');
  await page.goto('/projects/');
  const navigation = page.getByRole('navigation', { name: '主导航' });
  await expect(navigation.getByRole('link', { name: '项目' })).toHaveAttribute(
    'aria-current',
    'page',
  );
  await expect(navigation.locator('[aria-current="page"]')).toHaveCount(1);
  await expect(
    navigation.getByRole('link', { name: '联系' }),
  ).not.toHaveAttribute('aria-current', 'page');
});

test('mobile menu traps focus and restores it when closed', async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== 'mobile-chromium',
    'mobile-only regression',
  );

  await page.goto('/');
  const menu = page.locator('details.mobile-nav');
  const summary = menu.locator('summary');
  await summary.focus();
  await summary.press('Enter');

  await expect(menu).toHaveAttribute('open', '');
  await expect(page.locator('main')).toHaveAttribute('inert', '');
  const links = menu.locator('a');
  const first = links.first();
  const last = links.last();
  await expect(first).toBeFocused();

  await page.keyboard.press('Shift+Tab');
  await expect(last).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(first).toBeFocused();

  await page.keyboard.press('Escape');
  await expect(menu).not.toHaveAttribute('open', '');
  await expect(page.locator('main')).not.toHaveAttribute('inert', '');
  await expect(summary).toBeFocused();
});

test('homepage follows the approved recruiter-oriented curated hierarchy', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.locator('[data-section="featured-project"]')).toContainText(
    'My Company Brain',
  );
  await expect(
    page.locator('[data-section="selected-projects"] [data-project-card]'),
  ).toHaveCount(5);
  await expect(page.locator('[data-section="latest-writing"]')).toHaveCount(0);
  await expect(page.locator('[data-section="latest-journal"]')).toBeVisible();
  await expect(page.locator('[data-section="latest-journal"]')).toContainText(
    '云与石',
  );
});

test('homepage keeps the English brand signature and hides empty writing', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.locator('.home-hero__signature[lang="en"]')).toHaveText(
    'Building useful systems, collecting curious ideas.',
  );
  await expect(page.locator('.home-hero__lede[lang="zh-CN"]')).toHaveText(
    '将复杂知识、数据和业务流程构建为可验证、可部署的 AI 应用。',
  );
  await expect(page.locator('[data-section="latest-writing"]')).toHaveCount(0);
  await expect(page.locator('[data-section="latest-journal"] h3 a')).toHaveText(
    '云与石',
  );
});

test('mobile homepage is a single readable column', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-chromium');
  await page.goto('/');
  const sections = page.locator('[data-section]');
  await expect(sections).toHaveCount(5);
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

test('English homepage publishes the latest translated journal entry', async ({
  page,
}) => {
  await page.goto('/en/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'AI Application Engineer · Agent / RAG / Data Systems',
  );
  await expect(page.locator('[data-section]')).toHaveCount(5);
  await expect(page.locator('[data-section="featured-project"]')).toContainText(
    'My Company Brain',
  );
  await expect(
    page.locator('[data-section="selected-projects"] [data-project-card]'),
  ).toHaveCount(5);
  await expect(page.locator('[data-section="now"]')).toContainText(
    'Organizing My Company Brain’s three knowledge paths, source tracing, and acceptance boundaries for real-material validation.',
  );
  await expect(page.locator('[data-section="latest-writing"]')).toHaveCount(0);
  await expect(page.locator('[data-section="latest-journal"]')).toContainText(
    'Cloud and Stone',
  );
});
