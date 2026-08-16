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
    '/en/writing/',
    '/journal/',
    '/en/journal/',
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
    '@type': 'CreativeWork',
    name: 'GraphRAGAgent',
    description: '结合知识图谱、向量检索、D3 可视化和多轮问答的知识探索应用。',
    url: 'https://shaysha-pra.github.io/projects/graphrag-agent/',
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

test('bilingual about routes expose private-safe empty states', async ({
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
