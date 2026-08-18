import { expect, test } from '@playwright/test';

const projectSlugs = [
  'agent-teams-project',
  'graphrag-agent',
  'ita-maskit',
  'manim-project',
  'my-company-brain',
  'sql-agent',
];

test('all public routes and generated files respond successfully', async ({
  request,
}) => {
  const routes = [
    '/',
    '/en/',
    '/projects/',
    '/en/projects/',
    '/writing/',
    '/writing/coding-agent-principles-and-differences/',
    '/en/writing/',
    '/journal/',
    '/en/journal/',
    '/journal/cloud-and-stone/',
    '/en/journal/cloud-and-stone/',
    '/about/',
    '/en/about/',
    '/resume/',
    '/en/resume/',
    '/rss.xml',
    '/robots.txt',
    '/sitemap-index.xml',
    '/404.html',
    '/favicon.svg',
    ...projectSlugs.flatMap((slug) => [
      `/projects/${slug}/`,
      `/en/projects/${slug}/`,
    ]),
  ];

  for (const route of routes) {
    const response = await request.get(route);
    expect(response.ok(), `${route} returned ${response.status()}`).toBe(true);
  }
});

test('robots and 404 include the required public guidance', async ({
  request,
}) => {
  const robots = await request.get('/robots.txt');
  expect(robots.headers()['content-type']).toBe('text/plain');
  expect(await robots.text()).toBe(
    'User-agent: *\nAllow: /\nSitemap: https://shaysha-pra.github.io/sitemap-index.xml\n',
  );

  const notFound = await request.get('/404.html');
  const notFoundHtml = await notFound.text();
  expect(notFoundHtml).toContain('页面未找到');
  expect(notFoundHtml).toContain('Page not found');
  expect(notFoundHtml).toContain('href="/"');
  expect(notFoundHtml).toContain('href="/projects/"');
  expect(notFoundHtml).toContain('href="/writing/"');
});

test('structured data is scoped to confirmed page types', async ({ page }) => {
  async function readJsonLd() {
    const scripts = page.locator('script[type="application/ld+json"]');
    await expect(scripts).toHaveCount(1);
    const raw = await scripts.evaluate((node) => node.textContent ?? '');
    return JSON.parse(raw) as Record<string, unknown>;
  }

  await page.goto('/');
  expect(await readJsonLd()).toEqual({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Junshu Sha',
    url: 'https://shaysha-pra.github.io',
    sameAs: ['https://github.com/ShaySha-PRa'],
  });

  await page.goto('/about/');
  expect(await readJsonLd()).toEqual({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Junshu Sha',
    url: 'https://shaysha-pra.github.io',
    sameAs: ['https://github.com/ShaySha-PRa'],
  });

  await page.goto('/projects/graphrag-agent/');
  expect(await readJsonLd()).toEqual({
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    name: 'GraphRAG 知识探索工作台',
    description:
      '将文档解析、实体关系、向量检索和可视化问答组织在同一套 GraphRAG 工作台中。',
    url: 'https://shaysha-pra.github.io/projects/graphrag-agent/',
    codeRepository: 'https://github.com/ShaySha-PRa/GraphRAGAgent',
    datePublished: '2026-08-16T00:00:00.000Z',
    dateModified: '2026-08-17T00:00:00.000Z',
    author: {
      '@type': 'Person',
      name: 'Junshu Sha',
      url: 'https://shaysha-pra.github.io',
    },
    keywords: ['React', 'FastAPI', 'LangGraph', 'NetworkX', 'Chroma', 'D3.js'],
    creativeWorkStatus: 'completed',
  });

  await page.goto('/writing/');
  await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(
    0,
  );
});

test('social metadata uses absolute confirmed cover images', async ({
  page,
}) => {
  for (const route of ['/', '/projects/my-company-brain/']) {
    await page.goto(route);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      'content',
      'summary_large_image',
    );
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute(
      'content',
      /.+/,
    );
    await expect(
      page.locator('meta[name="twitter:description"]'),
    ).toHaveAttribute('content', /.+/);
    const image = page.locator('meta[property="og:image"]');
    await expect(image).toHaveCount(1);
    await expect(image).toHaveAttribute(
      'content',
      /^https:\/\/shaysha-pra\.github\.io\/.+/,
    );
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
      'content',
      /^https:\/\/shaysha-pra\.github\.io\/.+/,
    );
  }
});

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

test('Chinese article, feeds, and sitemap publish the approved public contracts', async ({
  page,
  request,
}) => {
  await page.goto('/writing/coding-agent-principles-and-differences/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Coding Agent 原理与差异：Claude Code、Codex、Hermes Agent、pi',
  );
  await expect(page.locator('.article-detail__summary')).toContainText(
    '系统比较 Claude Code、OpenAI Codex、Hermes Agent 与 pi',
  );
  await expect(page.locator('[data-article-section]')).toHaveCount(50);
  await expect(page.locator('details.article-toc')).toHaveCount(1);
  await expect(
    page.locator('details.article-toc a[href^="#section-"]'),
  ).toHaveCount(50);
  await expect(page.locator('.article-detail__meta')).toHaveText(
    /阅读时长\s+\d+ 分钟/,
  );
  await expect(page.locator('.article-detail__meta')).not.toContainText(
    '发布于',
  );
  await expect(page.locator('.article-detail__meta')).not.toContainText(
    '更新于',
  );
  await expect(page.locator('.article-detail__meta time')).toHaveCount(0);
  await expect(page.locator('.article-detail__tags li')).toHaveCount(5);
  await expect(page.locator('.article-table-scroller')).toHaveCount(4);

  const externalLinks = await page
    .locator('.prose a[href^="http"]')
    .evaluateAll((links) =>
      links.map((link) => link.getAttribute('href') ?? ''),
    );
  expect(externalLinks.length).toBeGreaterThan(0);
  expect(externalLinks.every((href) => href.startsWith('https://'))).toBe(true);

  const rss = await request.get('/rss.xml');
  const rssText = await rss.text();
  expect(rssText).toContain(
    'Coding Agent 原理与差异：Claude Code、Codex、Hermes Agent、pi',
  );
  expect(rssText).toContain(
    'https://shaysha-pra.github.io/writing/coding-agent-principles-and-differences/',
  );
  expect(rssText).toContain('<pubDate>Thu, 13 Aug 2026 00:00:00 GMT</pubDate>');

  const sitemap = await request.get('/sitemap-0.xml');
  const sitemapText = await sitemap.text();
  expect(sitemapText).toContain(
    'https://shaysha-pra.github.io/writing/coding-agent-principles-and-differences/',
  );
  expect(sitemapText).not.toContain(
    'https://shaysha-pra.github.io/en/writing/coding-agent-principles-and-differences/',
  );
});

test('article JSON-LD publishes concrete canonical and dates', async ({
  page,
}) => {
  await page.goto('/writing/coding-agent-principles-and-differences/');
  const jsonLd = page.locator('script[type="application/ld+json"]');
  await expect(jsonLd).toHaveCount(1);
  const data = JSON.parse((await jsonLd.textContent()) ?? '{}') as Record<
    string,
    unknown
  >;
  expect(data).toMatchObject({
    '@type': 'Article',
    headline: 'Coding Agent 原理与差异：Claude Code、Codex、Hermes Agent、pi',
    url: 'https://shaysha-pra.github.io/writing/coding-agent-principles-and-differences/',
    datePublished: '2026-08-13T00:00:00.000Z',
    dateModified: '2026-08-18T00:00:00.000Z',
  });
});

test('article TOC and tables remain keyboard and viewport safe at 390px', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/writing/coding-agent-principles-and-differences/');

  const rootWidth = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(rootWidth.scrollWidth).toBeLessThanOrEqual(rootWidth.clientWidth);

  const tableOverflow = await page
    .locator('.article-table-scroller')
    .evaluateAll((scrollers) =>
      scrollers.map((scroller) => ({
        clientWidth: scroller.clientWidth,
        scrollWidth: scroller.scrollWidth,
      })),
    );
  expect(tableOverflow).toHaveLength(4);
  expect(
    tableOverflow.some(
      ({ scrollWidth, clientWidth }) => scrollWidth > clientWidth,
    ),
  ).toBe(true);

  const firstScroller = page.locator('.article-table-scroller').first();
  const rootScrollLeft = await page.evaluate(
    () => document.scrollingElement?.scrollLeft ?? 0,
  );
  await firstScroller.evaluate((element) => {
    element.scrollLeft = element.scrollWidth;
  });
  expect(
    await firstScroller.evaluate((element) => element.scrollLeft),
  ).toBeGreaterThan(0);
  expect(
    await page.evaluate(() => document.scrollingElement?.scrollLeft ?? 0),
  ).toBe(rootScrollLeft);

  const toc = page.locator('details.article-toc');
  const summary = toc.locator('summary');
  await summary.focus();
  await summary.press('Enter');
  await expect(toc).toHaveAttribute('open', '');
  await toc.locator('a[href="#section-01"]').click();
  await expect(page).toHaveURL(/#section-01$/);
  await expect(page.locator('#section-01')).toBeVisible();
});

test('bilingual about routes publish the confirmed profile and contact links', async ({
  page,
}) => {
  await page.goto('/about/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('关于');
  await expect(page.locator('.profile-page__summary')).toContainText(
    '专注 Agent、RAG 与数据系统',
  );
  await expect(page.locator('#contact')).toBeVisible();
  await expect(
    page.locator('#contact').getByRole('link', { name: 'GitHub ↗' }),
  ).toHaveAttribute('href', 'https://github.com/ShaySha-PRa');
  await expect(page.getByRole('link', { name: '在线简历' })).toHaveAttribute(
    'href',
    '/resume/',
  );
  await expect(page.getByRole('status')).toHaveCount(0);

  await page.goto('/en/about/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('About');
  await expect(page.locator('.profile-page__summary')).toContainText(
    'focused on agents, RAG, and data systems',
  );
  await expect(page.locator('#contact')).toBeVisible();
  await expect(
    page.locator('#contact').getByRole('link', { name: 'GitHub ↗' }),
  ).toHaveAttribute('href', 'https://github.com/ShaySha-PRa');
  await expect(
    page.getByRole('link', { name: 'Online résumé' }),
  ).toHaveAttribute('href', '/en/resume/');
  await expect(page.getByRole('status')).toHaveCount(0);
});

test('bilingual resume routes publish the supplied experience', async ({
  page,
}) => {
  await page.goto('/resume/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('简历');
  await expect(
    page.getByRole('heading', { level: 3, name: /毕马威上海分所/ }),
  ).toBeVisible();
  await expect(
    page.getByText('My Company Brain——企业多知识库 RAG 与 Agent 平台'),
  ).toBeVisible();
  await expect(page.getByText(/1,960,000/)).toBeVisible();
  await expect(page.getByRole('link', { name: /PDF/i })).toHaveCount(0);

  await page.goto('/en/resume/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Résumé');
  await expect(
    page.getByRole('heading', { level: 3, name: /KPMG Shanghai/ }),
  ).toBeVisible();
  await expect(
    page.getByText('AI Mathematical Animation Workbench'),
  ).toBeVisible();
  await expect(page.getByText(/519 Python tests/)).toBeVisible();
  await expect(page.getByRole('link', { name: /PDF/i })).toHaveCount(0);
});

test('about pages request only local hosts', async ({ page }) => {
  const hosts = new Set<string>();
  page.on('request', (request) => hosts.add(new URL(request.url()).host));
  await page.goto('/about/');
  expect([...hosts].every((host) => host === '127.0.0.1:4321')).toBe(true);
});
