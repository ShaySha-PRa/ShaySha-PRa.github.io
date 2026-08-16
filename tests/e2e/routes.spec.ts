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
  expect(await robots.text()).toContain(
    'User-agent: *\nAllow: /\nSitemap: https://shaysha-pra.github.io/sitemap-index.xml',
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
  await page.goto('/');
  const person = page.locator('script[type="application/ld+json"]');
  await expect(person).toHaveCount(1);
  expect(await person.evaluate((node) => node.textContent)).toContain(
    '"@type":"Person"',
  );

  await page.goto('/about/');
  expect(
    await page
      .locator('script[type="application/ld+json"]')
      .evaluate((node) => node.textContent),
  ).toContain('"@type":"Person"');

  await page.goto('/projects/graphrag-agent/');
  expect(
    await page
      .locator('script[type="application/ld+json"]')
      .evaluate((node) => node.textContent),
  ).toContain('"@type":"CreativeWork"');

  await page.goto('/writing/');
  await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(
    0,
  );
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
