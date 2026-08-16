import { expect, test } from '@playwright/test';

const projectNames = [
  'My Company Brain',
  'GraphRAGAgent',
  'Agent Teams Project',
  'Manim Project',
  'SQLAgent',
  'ITA-Maskit',
];

test('Chinese project index lists exactly six ordered projects', async ({
  page,
}) => {
  await page.goto('/projects/');
  const cards = page.locator('[data-project-card]');
  await expect(cards).toHaveCount(6);
  await expect(cards.locator('h2')).toHaveText(projectNames);
});

test('My Company Brain is explicitly active', async ({ page }) => {
  await page.goto('/projects/my-company-brain/');
  await expect(page.getByText('持续开发中')).toBeVisible();
  await expect(
    page.getByRole('heading', { name: '限制与下一步' }),
  ).toBeVisible();
});

test('My Company Brain uses a loaded product preview', async ({ page }) => {
  for (const route of [
    '/projects/my-company-brain/',
    '/en/projects/my-company-brain/',
  ]) {
    await page.goto(route);
    const cover = page.getByRole('img', {
      name: 'My Company Brain cover',
    });
    await expect(cover).toBeVisible();

    const image = await cover.evaluate((element) => {
      const img = element as HTMLImageElement;
      return {
        complete: img.complete,
        width: img.naturalWidth,
        height: img.naturalHeight,
        src: img.currentSrc,
      };
    });

    expect(image.complete).toBe(true);
    expect(image.width).toBeGreaterThanOrEqual(1100);
    expect(image.height).toBeGreaterThanOrEqual(700);
    expect(image.src).not.toContain('.svg');
  }
});

test('My Company Brain presents scope, actions, product evidence, and technology in recruiter order', async ({
  page,
}) => {
  await page.goto('/projects/my-company-brain/');
  await expect(page.locator('.project-detail__category')).toHaveText(
    '企业知识平台 / RAG + Agent',
  );
  const overview = page.locator('.project-detail__overview');
  await expect(overview).toContainText('3 条知识路径');
  await expect(overview).toContainText('持续开发中');
  await expect(overview).toContainText('独立开发者');

  const actions = page.locator('.project-detail__actions');
  await expect(actions.getByRole('link', { name: /GitHub/ })).toHaveAttribute(
    'href',
    'https://github.com/ShaySha-PRa/my-company-brain',
  );
  await expect(
    actions.getByRole('link', { name: '查看验证证据' }),
  ).toHaveAttribute('href', '#validation');

  const sequence = await page
    .locator(
      '.project-detail__overview, .project-detail__actions, .project-detail__cover, .project-detail__technology',
    )
    .evaluateAll((nodes) => nodes.map((node) => node.className));
  expect(sequence).toEqual([
    'project-detail__overview',
    'project-detail__actions',
    'project-detail__cover',
    'project-detail__technology',
  ]);
});

test('My Company Brain case study exposes the approved workflow, architecture, and validation matrix', async ({
  page,
}) => {
  await page.goto('/projects/my-company-brain/');
  await expect(page.getByRole('heading', { level: 2 })).toHaveText([
    '用户如何使用它',
    '系统架构',
    '三个关键技术决策',
    '当前验证状态',
    '限制与下一步',
  ]);
  await expect(page.locator('[data-project-flow] li')).toHaveText([
    '创建知识源',
    '导入资料',
    '发起查询',
    '查看回答与来源',
  ]);

  const architecture = page.getByRole('img', {
    name: 'My Company Brain 系统架构：Web 经统一 API 进入 Agent Gateway，并连接三条知识路径',
  });
  await expect(architecture).toBeVisible();
  await expect(architecture).toHaveAttribute(
    'src',
    '/projects/my-company-brain-architecture.svg',
  );

  const validation = page.locator('#validation');
  await expect(validation).toBeVisible();
  await expect(validation.locator('tbody tr')).toHaveCount(5);
  await expect(validation.getByRole('rowheader')).toHaveCount(5);
  await expect(validation).toContainText('88 项 Bun + 15 项 Python');
  await expect(validation).toContainText('8 个常驻服务健康');
  await expect(validation).toContainText('待完成');
  await expect(validation).toContainText('未声明');
});

test('standard project pages keep the existing metadata layout', async ({
  page,
}) => {
  await page.goto('/projects/graphrag-agent/');
  await expect(page.locator('.project-detail__category')).toHaveCount(0);
  await expect(page.locator('[data-project-meta]')).toBeVisible();
  await expect(page.locator('.project-detail__technology')).toHaveCount(0);
});

test('mobile case study contains wide architecture within its own scroller', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-chromium');
  await page.goto('/projects/my-company-brain/');
  const dimensions = await page.evaluate(() => {
    const root = document.documentElement;
    const scroller = document.querySelector<HTMLElement>(
      '[data-project-architecture-scroller]',
    );
    return {
      pageWidth: root.scrollWidth,
      viewportWidth: root.clientWidth,
      scrollerWidth: scroller?.scrollWidth ?? 0,
      scrollerViewport: scroller?.clientWidth ?? 0,
    };
  });
  expect(dimensions.pageWidth).toBeLessThanOrEqual(dimensions.viewportWidth);
  expect(dimensions.scrollerWidth).toBeGreaterThan(dimensions.scrollerViewport);
});

test('English project route is available', async ({ page }) => {
  await page.goto('/en/projects/graphrag-agent/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'GraphRAGAgent',
  );
});
