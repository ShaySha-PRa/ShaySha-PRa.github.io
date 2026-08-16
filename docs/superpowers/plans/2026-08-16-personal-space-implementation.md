# Personal Space Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy a bilingual Astro personal-space website that presents six software projects, technical writing, photography/life, an about page, a résumé, and contact links in the approved Editorial Lab / Ink & Vermilion design.

**Architecture:** Use Astro static output with typed Content Collections for projects, articles, journal entries, profile, and résumé content. Chinese routes live at the root and English routes under `/en/`; a pure localization helper pairs translations and provides explicit Chinese fallback. GitHub Actions validates pull requests and deploys the `dist/` Pages artifact from `main` without a `gh-pages` branch.

**Tech Stack:** Node.js 22.12+, Astro 7.2.2, TypeScript, Markdown, Astro Content Collections, Vitest 4.1.10, Playwright 1.62.1, axe-core, Prettier, Linkinator, Lighthouse CI, GitHub Actions, GitHub Pages.

## Global Constraints

- Require Node.js `>=22.12.0`; reject older Node versions through `package.json#engines`.
- Use Astro `7.2.2` with static output; do not add an SSR adapter, database, account system, CMS, comments, analytics, or remote font service.
- Use npm and commit `package-lock.json`; CI must run `npm ci`.
- Chinese is the default locale at root routes; English uses `/en/` routes.
- Use Markdown + local Git-tracked images for all editable content.
- Use the approved colors exactly: Paper `#F4F0E8`, Ink `#171717`, Vermilion `#C6442B`, Sand `#C9BDA8`, muted text `#555555`.
- Use Editorial Lab / Curated Cover visual hierarchy with title serif fonts and body sans-serif system fonts.
- Feature exactly these six main projects: My Company Brain, GraphRAGAgent, Agent Teams Project, Manim Project, SQLAgent, and ITA-Maskit.
- Mark My Company Brain as `active`; do not describe unverified capabilities as production-validated.
- Do not invent biography, employment, education, contact details, résumé claims, article authorship, photo captions, or project outcomes.
- Except for the mobile menu, locale switch, and accessible photo lightbox, ship no client-side JavaScript.
- Use GitHub Pages artifact deployment; do not create or push a `gh-pages` branch.
- A failed validation or build must prevent deployment and preserve the last successful production version.

---

## File Structure

The implementation creates the following responsibility boundaries:

```text
.
├── .github/workflows/
│   ├── ci.yml                         # pull-request and push validation
│   └── deploy-pages.yml               # main-only Pages artifact deployment
├── public/
│   ├── favicon.svg                    # Ink/Vermilion site mark
│   └── resume/
│       └── junshu-sha-resume.pdf      # user-supplied, confirmed résumé PDF
├── scripts/
│   └── verify-content.mjs             # cross-collection translation and asset checks
├── src/
│   ├── assets/
│   │   ├── projects/                  # project covers and screenshots
│   │   └── journal/                   # user-supplied photography
│   ├── components/
│   │   ├── cards/                     # list-only project/article/journal cards
│   │   ├── home/                      # Curated Cover homepage sections
│   │   ├── journal/                   # grid and accessible lightbox
│   │   ├── project/                   # project-case-study sections
│   │   ├── FallbackNotice.astro       # explicit untranslated-content notice
│   │   ├── LocaleSwitch.astro         # current-page locale link
│   │   ├── SeoHead.astro              # canonical, hreflang, OG, structured data
│   │   ├── SiteFooter.astro            # contact/résumé/GitHub footer
│   │   └── SiteHeader.astro            # navigation and mobile menu
│   ├── content/
│   │   ├── projects/                  # 12 Markdown entries: zh/en for six projects
│   │   ├── articles/                  # user-authored technical writing
│   │   ├── journal/                   # user-authored photo/life entries
│   │   ├── profile/                   # confirmed zh/en biography
│   │   └── resume/                    # confirmed zh/en web résumé
│   ├── layouts/
│   │   ├── BaseLayout.astro           # document shell and shared metadata
│   │   ├── ArticleLayout.astro        # article prose, dates, tags, related links
│   │   └── ProjectLayout.astro        # fixed case-study narrative structure
│   ├── lib/
│   │   ├── content.ts                 # Astro collection queries
│   │   ├── i18n.ts                    # pure locale selection and URL helpers
│   │   ├── reading-time.ts            # deterministic reading-time calculation
│   │   └── seo.ts                     # canonical/hreflang/JSON-LD data builders
│   ├── pages/
│   │   ├── en/                        # English list, detail, about, résumé routes
│   │   ├── projects/                  # Chinese project routes
│   │   ├── writing/                   # Chinese writing routes
│   │   ├── journal/                   # Chinese journal routes
│   │   ├── about.astro
│   │   ├── resume.astro
│   │   ├── index.astro
│   │   ├── 404.astro
│   │   ├── robots.txt.ts
│   │   └── rss.xml.ts
│   ├── styles/
│   │   ├── tokens.css                 # approved design tokens
│   │   ├── global.css                 # reset, shell, typography, focus, motion
│   │   └── prose.css                  # article/project rendered Markdown
│   ├── config/site.ts                 # typed site title, URL, labels, navigation
│   ├── content.config.ts              # all collection schemas
│   └── env.d.ts
├── tests/
│   ├── e2e/
│   │   ├── accessibility.spec.ts
│   │   ├── homepage.spec.ts
│   │   ├── journal.spec.ts
│   │   ├── locale.spec.ts
│   │   ├── projects.spec.ts
│   │   └── routes.spec.ts
│   ├── fixtures/                      # test-only plain localization records
│   └── unit/
│       ├── i18n.test.ts
│       ├── reading-time.test.ts
│       └── seo.test.ts
├── astro.config.mjs
├── lighthouse.config.cjs
├── package.json
├── package-lock.json
├── playwright.config.ts
├── prettier.config.mjs
├── tsconfig.json
└── vitest.config.ts
```

## Content Inputs Required During Execution

These inputs are required before the related content tasks can be declared complete:

- One confirmed Chinese biography and its confirmed English translation.
- Confirmed contact destinations; GitHub is already known, while email and any additional platform links must come from the user.
- A confirmed web résumé in Chinese and English plus the final PDF copied to `public/resume/junshu-sha-resume.pdf`.
- At least one user-authored technical article, with either a confirmed English translation or explicit Chinese fallback approval.
- At least three user-supplied photographs for one journal entry, including captions, date, location policy, and alternative text.

If an input is not available when its task begins, implement and test the empty state, keep the affected content entry unpublished, and report that the production-content acceptance criterion remains open. Do not substitute invented content.

---

### Task 1: Bootstrap the Astro Project and Validation Toolchain

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `src/env.d.ts`
- Create: `src/pages/index.astro`
- Create: `src/styles/tokens.css`
- Create: `prettier.config.mjs`
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `lighthouse.config.cjs`
- Modify: `.gitignore`
- Test: `tests/e2e/homepage.spec.ts`

**Interfaces:**
- Consumes: Approved design specification at `docs/superpowers/specs/2026-08-16-personal-space-design.md`.
- Produces: npm scripts `dev`, `check`, `test`, `build`, `preview`, `test:e2e`, `test:links`, `test:lighthouse`, `format`, `format:check`, and `validate`; a static Astro build at `dist/`.

- [ ] **Step 1: Record the runtime floor and install pinned dependencies**

Create `package.json` with the exact scripts and runtime policy below, then run the two install commands so npm writes the resolved dependency versions and lockfile:

```json
{
  "name": "junshu-personal-space",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "engines": { "node": ">=22.12.0" },
  "scripts": {
    "dev": "astro dev",
    "check": "astro check",
    "test": "vitest run",
    "build": "astro build",
    "preview": "astro preview --host 127.0.0.1",
    "test:e2e": "playwright test",
    "test:links": "linkinator ./dist --recurse --skip 'mailto:|github.com'",
    "test:lighthouse": "lhci autorun --config=lighthouse.config.cjs",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "validate": "npm run format:check && npm run check && npm run test && npm run build && npm run test:links && npm run test:e2e"
  }
}
```

Run:

```bash
npm install astro@7.2.2 @astrojs/check@0.9.10 @astrojs/rss@4.0.19 @astrojs/sitemap@3.7.3 sharp@0.35.3
npm install --save-dev typescript@5.9.3 vitest@4.1.10 @playwright/test@1.62.1 @axe-core/playwright@4.13.0 prettier@3.9.6 prettier-plugin-astro@0.14.1 linkinator@8.0.3 @lhci/cli@0.15.1 gray-matter@4.0.3
```

Expected: `package-lock.json` exists and `npm ls --depth=0` exits 0.

- [ ] **Step 2: Write the failing homepage smoke test**

Create `tests/e2e/homepage.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

test('Chinese homepage has the personal-space identity', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Junshu Sha/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Building useful systems',
  );
});
```

- [ ] **Step 3: Configure the static Astro and test runners**

Create `astro.config.mjs`:

```js
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://shaysha-pra.github.io',
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap()],
  i18n: {
    locales: ['zh', 'en'],
    defaultLocale: 'zh',
    routing: { prefixDefaultLocale: false },
  },
});
```

Create `vitest.config.ts`:

```ts
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: { include: ['tests/unit/**/*.test.ts'] },
});
```

Create `playwright.config.ts`:

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  webServer: {
    command: 'npm run preview',
    url: 'http://127.0.0.1:4321/',
    reuseExistingServer: !process.env.CI,
  },
  use: { baseURL: 'http://127.0.0.1:4321/' },
  projects: [
    { name: 'desktop-chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-chromium', use: { ...devices['Pixel 7'] } },
  ],
});
```

Create `tsconfig.json`:

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 4: Add the initial failing page and visual tokens**

Create `src/styles/tokens.css`:

```css
:root {
  --paper: #f4f0e8;
  --ink: #171717;
  --vermilion: #c6442b;
  --sand: #c9bda8;
  --muted: #555555;
  --content-max: 72rem;
}
```

Create `src/pages/index.astro` with only an empty layout shell so the smoke test fails specifically on the missing heading:

```astro
---
import '../styles/tokens.css';
---

<html lang="zh-CN">
  <head><title>Junshu Sha</title></head>
  <body></body>
</html>
```

Extend `.gitignore` with these generated paths while preserving `.superpowers/`:

```gitignore
node_modules/
dist/
.astro/
playwright-report/
test-results/
.lighthouseci/
```

- [ ] **Step 5: Run the smoke test to verify the intended failure**

Run:

```bash
npx playwright install chromium
npm run build
npm run test:e2e -- homepage.spec.ts
```

Expected: FAIL because the level-one heading is absent.

- [ ] **Step 6: Add the minimal heading and complete baseline configuration**

Add this to the page body:

```astro
<main><h1>Building useful systems, collecting curious ideas.</h1></main>
```

Create `prettier.config.mjs`:

```js
export default {
  plugins: ['prettier-plugin-astro'],
  overrides: [{ files: '*.astro', options: { parser: 'astro' } }],
  singleQuote: true,
  trailingComma: 'all',
};
```

Create `lighthouse.config.cjs` with one desktop run and 0.90 minimum category assertions:

```js
module.exports = {
  ci: {
    collect: { staticDistDir: './dist', numberOfRuns: 1 },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.9 }]
      }
    },
    upload: { target: 'temporary-public-storage' }
  }
};
```

- [ ] **Step 7: Verify the baseline and commit**

Run:

```bash
npm run format
npm run check
npm run test
npm run build
npm run test:e2e -- homepage.spec.ts
```

Expected: all commands PASS.

Commit:

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json src tests prettier.config.mjs vitest.config.ts playwright.config.ts lighthouse.config.cjs .gitignore
git commit -m "feat: bootstrap Astro personal space"
```

---

### Task 2: Define Content Schemas and Localization Interfaces

**Files:**
- Create: `src/content.config.ts`
- Create: `src/lib/i18n.ts`
- Create: `src/lib/content.ts`
- Create: `scripts/verify-content.mjs`
- Modify: `package.json`
- Test: `tests/unit/i18n.test.ts`
- Test: `tests/fixtures/localized-records.ts`

**Interfaces:**
- Consumes: Astro runtime and TypeScript configuration from Task 1.
- Produces: `Locale`, `Section`, `LocalizedRecord`, `LocalizedSelection`, `selectLocalizedRecords(records, locale)`, `localizedPath(locale, section, slug?)`, `getLocalizedCollection(collection, locale)`, and typed schemas for five collections.

- [ ] **Step 1: Write localization tests before implementation**

Create `tests/unit/i18n.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { localizedPath, selectLocalizedRecords } from '../../src/lib/i18n';

const records = [
  { locale: 'zh' as const, translationKey: 'alpha', slug: 'jia', order: 1 },
  { locale: 'en' as const, translationKey: 'alpha', slug: 'alpha', order: 1 },
  { locale: 'zh' as const, translationKey: 'beta', slug: 'yi', order: 2 },
];

describe('selectLocalizedRecords', () => {
  it('selects requested translations and marks Chinese fallbacks', () => {
    expect(selectLocalizedRecords(records, 'en')).toEqual([
      { entry: records[1], requestedLocale: 'en', isFallback: false },
      { entry: records[2], requestedLocale: 'en', isFallback: true },
    ]);
  });
});

describe('localizedPath', () => {
  it('keeps Chinese at root and prefixes English', () => {
    expect(localizedPath('zh', 'projects', 'jia')).toBe('/projects/jia/');
    expect(localizedPath('en', 'projects', 'alpha')).toBe('/en/projects/alpha/');
    expect(localizedPath('zh', 'home')).toBe('/');
    expect(localizedPath('en', 'home')).toBe('/en/');
  });
});
```

- [ ] **Step 2: Run the tests and verify missing-module failures**

Run:

```bash
npm run test -- tests/unit/i18n.test.ts
```

Expected: FAIL because `src/lib/i18n.ts` does not exist.

- [ ] **Step 3: Implement pure locale selection and path helpers**

Create `src/lib/i18n.ts`:

```ts
export type Locale = 'zh' | 'en';
export type Section =
  | 'home'
  | 'projects'
  | 'writing'
  | 'journal'
  | 'about'
  | 'resume';

export interface LocalizedRecord {
  locale: Locale;
  translationKey: string;
  slug: string;
  order?: number;
}

export interface LocalizedSelection<T extends LocalizedRecord> {
  entry: T;
  requestedLocale: Locale;
  isFallback: boolean;
}

export function selectLocalizedRecords<T extends LocalizedRecord>(
  records: T[],
  requestedLocale: Locale,
): LocalizedSelection<T>[] {
  const groups = new Map<string, T[]>();
  for (const record of records) {
    groups.set(record.translationKey, [
      ...(groups.get(record.translationKey) ?? []),
      record,
    ]);
  }
  return [...groups.values()]
    .map((group) => {
      const requested = group.find((item) => item.locale === requestedLocale);
      const fallback = group.find((item) => item.locale === 'zh');
      const entry = requested ?? fallback;
      return entry
        ? { entry, requestedLocale, isFallback: entry.locale !== requestedLocale }
        : null;
    })
    .filter((item): item is LocalizedSelection<T> => item !== null)
    .sort((a, b) => (a.entry.order ?? 999) - (b.entry.order ?? 999));
}

export function localizedPath(
  locale: Locale,
  section: Section,
  slug?: string,
): string {
  const prefix = locale === 'en' ? '/en' : '';
  if (section === 'home') return `${prefix || ''}/`;
  return `${prefix}/${section}/${slug ? `${slug}/` : ''}`;
}
```

- [ ] **Step 4: Define all collection schemas**

Create `src/content.config.ts` using `glob()` loaders. Define `localizedBase` with `title`, `slug`, `locale`, `translationKey`, `summary`, `published`, `updated`, `draft`, `seoTitle`, and `seoDescription`. Extend it with these exact enums and fields:

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const localizedBase = z.object({
  title: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  locale: z.enum(['zh', 'en']),
  translationKey: z.string().min(1),
  summary: z.string().min(20),
  published: z.coerce.date(),
  updated: z.coerce.date(),
  draft: z.boolean().default(false),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    localizedBase.extend({
      status: z.enum(['active', 'completed', 'experiment']),
      role: z.string().min(1),
      tech: z.array(z.string()).min(1),
      repoUrl: z.string().url(),
      demoUrl: z.string().url().optional(),
      cover: image(),
      gallery: z.array(image()).default([]),
      featured: z.boolean().default(false),
      order: z.number().int().min(1),
      evidence: z.array(z.string()).default([]),
    }),
});

const articles = defineCollection({
  loader: glob({ base: './src/content/articles', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    localizedBase.extend({
      tags: z.array(z.string()).default([]),
      cover: image().optional(),
      series: z.string().optional(),
      canonicalUrl: z.string().url().optional(),
    }),
});

const journal = defineCollection({
  loader: glob({ base: './src/content/journal', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    localizedBase.extend({
      date: z.coerce.date(),
      place: z.string().optional(),
      cover: image(),
      photos: z.array(z.object({ src: image(), alt: z.string().min(1), caption: z.string().optional() })).min(1),
      tags: z.array(z.string()).default([]),
      camera: z.string().optional(),
    }),
});

const profile = defineCollection({
  loader: glob({ base: './src/content/profile', pattern: '**/*.md' }),
  schema: localizedBase.extend({ order: z.number().default(1) }),
});

const resume = defineCollection({
  loader: glob({ base: './src/content/resume', pattern: '**/*.md' }),
  schema: localizedBase.extend({ pdfPath: z.string().optional(), order: z.number().default(1) }),
});

export const collections = { projects, articles, journal, profile, resume };
```

- [ ] **Step 5: Add the Astro collection adapter and cross-entry verifier**

Create `src/lib/content.ts` exporting this signature:

```ts
import { getCollection, type CollectionEntry, type CollectionKey } from 'astro:content';
import {
  selectLocalizedRecords,
  type Locale,
  type LocalizedRecord,
} from './i18n';

export async function getLocalizedCollection<T extends CollectionKey>(
  collection: T,
  locale: Locale,
) {
  const entries = await getCollection(collection, ({ data }) => !data.draft);
  return selectLocalizedRecords(
    entries.map((entry) => ({ ...entry.data, id: entry.id, entry })) as Array<
      LocalizedRecord & { id: string; entry: CollectionEntry<T> }
    >,
    locale,
  );
}
```

Create `scripts/verify-content.mjs` to scan each collection's Markdown front matter and exit nonzero when two entries share the same `translationKey + locale` pair:

```js
import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';

const root = path.resolve('src/content');
const collections = ['projects', 'articles', 'journal', 'profile', 'resume'];

async function markdownFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true }).catch(() => []);
  const nested = await Promise.all(
    entries.map((entry) => {
      const target = path.join(directory, entry.name);
      return entry.isDirectory()
        ? markdownFiles(target)
        : /\.mdx?$/.test(entry.name)
          ? [target]
          : [];
    }),
  );
  return nested.flat();
}

let invalid = false;
for (const collection of collections) {
  const seen = new Set();
  for (const file of await markdownFiles(path.join(root, collection))) {
    const { data } = matter(await fs.readFile(file, 'utf8'));
    const key = `${data.translationKey}/${data.locale}`;
    if (seen.has(key)) {
      console.error(`Duplicate localized content: ${collection}/${key}`);
      invalid = true;
    }
    seen.add(key);
  }
}
process.exitCode = invalid ? 1 : 0;
```

Update the package script after the verifier exists:

```json
"check": "astro check && node scripts/verify-content.mjs"
```

- [ ] **Step 6: Run tests, content sync, and commit**

Run:

```bash
npm run test -- tests/unit/i18n.test.ts
npx astro sync
npm run check
```

Expected: PASS with empty collections permitted.

Commit:

```bash
git add src/content.config.ts src/lib scripts tests/unit tests/fixtures
git commit -m "feat: add typed bilingual content model"
```

---

### Task 3: Build the Site Shell, Design System, and SEO Primitives

**Files:**
- Create: `src/config/site.ts`
- Create: `src/styles/global.css`
- Create: `src/styles/prose.css`
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/SiteHeader.astro`
- Create: `src/components/SiteFooter.astro`
- Create: `src/components/LocaleSwitch.astro`
- Create: `src/components/FallbackNotice.astro`
- Create: `src/components/SeoHead.astro`
- Create: `src/lib/seo.ts`
- Modify: `src/pages/index.astro`
- Test: `tests/unit/seo.test.ts`
- Test: `tests/e2e/homepage.spec.ts`

**Interfaces:**
- Consumes: `Locale`, `localizedPath()` and approved visual tokens.
- Produces: `BaseLayout` props `{ locale, title, description, canonicalPath, translationPath?, image?, fallback? }`; `buildHreflangLinks(site, zhPath, enPath)`; reusable semantic header/footer and fallback notice.

- [ ] **Step 1: Write failing SEO and shell tests**

Create `tests/unit/seo.test.ts`:

```ts
import { expect, it } from 'vitest';
import { buildHreflangLinks } from '../../src/lib/seo';

it('builds Chinese, English, and x-default alternate links', () => {
  expect(
    buildHreflangLinks(new URL('https://example.com'), '/projects/a/', '/en/projects/a/'),
  ).toEqual([
    { lang: 'zh-CN', href: 'https://example.com/projects/a/' },
    { lang: 'en', href: 'https://example.com/en/projects/a/' },
    { lang: 'x-default', href: 'https://example.com/projects/a/' },
  ]);
});
```

Extend `tests/e2e/homepage.spec.ts`:

```ts
test('homepage exposes semantic navigation and locale switch', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('navigation', { name: '主导航' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'English' })).toHaveAttribute('href', '/en/');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /个人空间/);
});
```

- [ ] **Step 2: Run tests and verify missing-interface failures**

Run:

```bash
npm run test -- tests/unit/seo.test.ts
npm run build
npm run test:e2e -- homepage.spec.ts
```

Expected: FAIL because `buildHreflangLinks`, navigation, and metadata do not exist.

- [ ] **Step 3: Implement typed site metadata and SEO helpers**

Create `src/config/site.ts` with a typed `SITE` object:

```ts
export const SITE = {
  name: 'Junshu Sha',
  url: 'https://shaysha-pra.github.io',
  github: 'https://github.com/ShaySha-PRa',
  descriptions: {
    zh: 'Junshu Sha 的个人空间：软件项目、技术文章、摄影与生活记录。',
    en: 'Junshu Sha’s personal space for software projects, technical writing, photography, and life.',
  },
  nav: {
    zh: { projects: '项目', writing: '文章', journal: '影像与生活', about: '关于' },
    en: { projects: 'Projects', writing: 'Writing', journal: 'Journal', about: 'About' },
  },
} as const;
```

Create `src/lib/seo.ts`:

```ts
export function buildHreflangLinks(site: URL, zhPath: string, enPath: string) {
  return [
    { lang: 'zh-CN', href: new URL(zhPath, site).href },
    { lang: 'en', href: new URL(enPath, site).href },
    { lang: 'x-default', href: new URL(zhPath, site).href },
  ];
}
```

- [ ] **Step 4: Implement global CSS and semantic shell components**

Implement `global.css` with:

```css
@import './tokens.css';

* { box-sizing: border-box; }
html { color-scheme: light; background: var(--paper); }
body { margin: 0; color: var(--ink); background: var(--paper); font-family: Inter, 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif; line-height: 1.65; }
h1, h2, h3 { font-family: Georgia, 'Noto Serif SC', 'Source Han Serif SC', serif; line-height: 1.1; }
a { color: inherit; text-decoration-color: var(--vermilion); text-underline-offset: 0.2em; }
a:hover { color: var(--vermilion); }
:focus-visible { outline: 3px solid var(--vermilion); outline-offset: 4px; }
.shell { width: min(calc(100% - 2rem), var(--content-max)); margin-inline: auto; }
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { scroll-behavior: auto !important; transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; } }
```

Implement `SiteHeader.astro` with `<nav aria-label={locale === 'zh' ? '主导航' : 'Primary'}>`, the five approved routes, and a native `<details>` mobile menu. Implement `SiteFooter.astro` with GitHub and résumé links only; add email only after confirmed input. Implement `LocaleSwitch.astro` as a plain link so it ships no JavaScript.

- [ ] **Step 5: Implement SEO head and base layout**

`SeoHead.astro` must render:

```astro
<title>{title}</title>
<meta name="description" content={description} />
<link rel="canonical" href={canonicalUrl} />
{alternates.map(({ lang, href }) => <link rel="alternate" hreflang={lang} href={href} />)}
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:url" content={canonicalUrl} />
<meta property="og:type" content={type} />
```

`BaseLayout.astro` must set `lang={locale === 'zh' ? 'zh-CN' : 'en'}`, include skip navigation, `SiteHeader`, `<main id="main-content">`, `SiteFooter`, and `FallbackNotice` when `fallback` is true.

- [ ] **Step 6: Convert the homepage to the shared layout and verify**

Use:

```astro
<BaseLayout
  locale="zh"
  title="Junshu Sha · 个人空间"
  description={SITE.descriptions.zh}
  canonicalPath="/"
  translationPath="/en/"
>
  <h1>Building useful systems, collecting curious ideas.</h1>
</BaseLayout>
```

Run:

```bash
npm run test -- tests/unit/seo.test.ts
npm run build
npm run test:e2e -- homepage.spec.ts
npm run format:check
```

Expected: PASS.

- [ ] **Step 7: Commit the shell**

```bash
git add src/config src/styles src/layouts src/components src/lib src/pages/index.astro tests
git commit -m "feat: add editorial bilingual site shell"
```

---

### Task 4: Add the Six Project Content Pairs and Project Case-Study Pages

**Files:**
- Create: `src/content/projects/zh/my-company-brain.md`
- Create: `src/content/projects/en/my-company-brain.md`
- Create: `src/content/projects/zh/graphrag-agent.md`
- Create: `src/content/projects/en/graphrag-agent.md`
- Create: `src/content/projects/zh/agent-teams-project.md`
- Create: `src/content/projects/en/agent-teams-project.md`
- Create: `src/content/projects/zh/manim-project.md`
- Create: `src/content/projects/en/manim-project.md`
- Create: `src/content/projects/zh/sql-agent.md`
- Create: `src/content/projects/en/sql-agent.md`
- Create: `src/content/projects/zh/ita-maskit.md`
- Create: `src/content/projects/en/ita-maskit.md`
- Create: `src/assets/projects/*/cover.svg` or confirmed repository screenshots
- Create: `src/components/cards/ProjectCard.astro`
- Create: `src/components/project/ProjectMeta.astro`
- Create: `src/layouts/ProjectLayout.astro`
- Create: `src/pages/projects/index.astro`
- Create: `src/pages/projects/[slug].astro`
- Create: `src/pages/en/projects/index.astro`
- Create: `src/pages/en/projects/[slug].astro`
- Test: `tests/e2e/projects.spec.ts`

**Interfaces:**
- Consumes: `getLocalizedCollection('projects', locale)`, `BaseLayout`, `LocalizedSelection`, project schema.
- Produces: `ProjectCard` props `{ project, requestedLocale, fallback }`; twelve validated entries; list and detail routes for both locales.

- [ ] **Step 1: Write failing project route tests**

Create `tests/e2e/projects.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

const projectNames = [
  'My Company Brain',
  'GraphRAGAgent',
  'Agent Teams Project',
  'Manim Project',
  'SQLAgent',
  'ITA-Maskit',
];

test('Chinese project index lists exactly six ordered projects', async ({ page }) => {
  await page.goto('/projects/');
  const cards = page.locator('[data-project-card]');
  await expect(cards).toHaveCount(6);
  await expect(cards.locator('h2')).toHaveText(projectNames);
});

test('My Company Brain is explicitly active', async ({ page }) => {
  await page.goto('/projects/my-company-brain/');
  await expect(page.getByText('持续开发中')).toBeVisible();
  await expect(page.getByRole('heading', { name: '已知限制与下一步' })).toBeVisible();
});

test('English project route is available', async ({ page }) => {
  await page.goto('/en/projects/graphrag-agent/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('GraphRAGAgent');
});
```

- [ ] **Step 2: Run the test to verify 404 failures**

Run:

```bash
npm run build
npm run test:e2e -- projects.spec.ts
```

Expected: FAIL because the routes do not exist.

- [ ] **Step 3: Create factual project covers and bilingual front matter**

Use repository screenshots where the repository already contains a representative asset. For My Company Brain, create a local editorial architecture cover in `src/assets/projects/my-company-brain/cover.svg` using Paper, Ink, Vermilion, and Sand; it must describe the three knowledge paths without inventing UI screenshots.

Use this exact front matter contract for My Company Brain Chinese content:

```yaml
---
title: My Company Brain
slug: my-company-brain
locale: zh
translationKey: my-company-brain
summary: 面向企业团队的多知识库平台，将文档知识、关系知识、知识页面和知识助理组织在一个可治理工作台中。
published: 2026-08-16
updated: 2026-08-16
draft: false
status: active
role: 独立开发者
tech: [TypeScript, Python, PostgreSQL, Neo4j, Docker, RAG, GraphRAG]
repoUrl: https://github.com/ShaySha-PRa/my-company-brain
cover: ../../../assets/projects/my-company-brain/cover.svg
gallery: []
featured: true
order: 1
evidence:
  - 代码包含 Web、统一 API、Agent Gateway、三条知识链路和 Compose 部署定义。
  - 当前仓库记录了自动检查与本机 Compose 服务状态，真实资料端到端验收仍待完成。
---
```

The body headings must be exactly:

```markdown
## 要解决的问题
## 我的设计与实现
## 系统架构
## 关键技术决策
## 结果与验证证据
## 已知限制与下一步
```

For the other five projects, use the exact repository facts below and the same body heading contract; do not add metrics absent from their READMEs:

| translationKey | status | order | role | required evidence |
|---|---:|---:|---|---|
| `graphrag-agent` | `completed` | 2 | 独立开发者 / Independent developer | 25 REST endpoints, 5-page frontend, D3 graph, 44 integration tests reported by README |
| `agent-teams-project` | `completed` | 3 | 独立开发者 / Independent developer | contract upload-to-report flow, HITL decisions, SSE progress, 11 frontend routes |
| `manim-project` | `experiment` | 4 | 独立开发者 / Independent developer | immutable version chain, Redis queue, isolated Runner, Preview/Final artifacts |
| `sql-agent` | `completed` | 5 | 独立开发者 / Independent developer | NL2SQL flow, RAG context, Milvus, MySQL, SSE results and charts |
| `ita-maskit` | `completed` | 6 | 独立开发者 / Independent developer | local processing, deterministic pseudonymization, GUI, README-reported 1M-row benchmarks and test count |

- [ ] **Step 4: Implement the project card and layout**

`ProjectCard.astro` must render a semantic `<article data-project-card>`, optimized Astro `<Image>`, title, summary, translated status label, and one link covering the card title. It must limit the visible tech list to three items.

`ProjectLayout.astro` must render the project hero, `ProjectMeta`, repository/demo links, the Markdown body, gallery, and previous/next project navigation. It must not infer outcomes from `tech` or `status`.

- [ ] **Step 5: Implement list and static detail routes**

Both `[slug].astro` files must generate paths from `getLocalizedCollection('projects', locale)`:

```ts
export async function getStaticPaths() {
  const projects = await getLocalizedCollection('projects', 'zh');
  return projects.map((selection) => ({
    params: { slug: selection.entry.slug },
    props: selection,
  }));
}
```

The English route uses `'en'`. Render `<FallbackNotice>` if `isFallback` is true.

- [ ] **Step 6: Run project validation and tests**

Run:

```bash
npm run check
npm run build
npm run test:e2e -- projects.spec.ts
npm run test:links
```

Expected: PASS; the production build contains 12 project detail routes.

- [ ] **Step 7: Commit project content and pages**

```bash
git add src/content/projects src/assets/projects src/components/cards src/components/project src/layouts/ProjectLayout.astro src/pages/projects src/pages/en/projects tests/e2e/projects.spec.ts
git commit -m "feat: publish six bilingual project case studies"
```

---

### Task 5: Build the Curated Cover Homepage

**Files:**
- Create: `src/components/home/EditorialHero.astro`
- Create: `src/components/home/FeaturedProject.astro`
- Create: `src/components/home/NowPanel.astro`
- Create: `src/components/home/ProjectSelection.astro`
- Create: `src/components/home/LatestWriting.astro`
- Create: `src/components/home/LatestJournal.astro`
- Create: `src/pages/en/index.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/styles/global.css`
- Test: `tests/e2e/homepage.spec.ts`

**Interfaces:**
- Consumes: six project selections, `BaseLayout`, `ProjectCard`, site labels.
- Produces: Chinese and English Curated Cover homepages with sections `intro`, `featured-project`, `now`, `selected-projects`, `latest-writing`, and `latest-journal`.

- [ ] **Step 1: Extend the failing homepage tests**

Add:

```ts
test('homepage follows the approved curated-cover hierarchy', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-section="featured-project"]')).toContainText('My Company Brain');
  await expect(page.locator('[data-section="selected-projects"] [data-project-card]')).toHaveCount(5);
  await expect(page.locator('[data-section="latest-writing"]')).toBeVisible();
  await expect(page.locator('[data-section="latest-journal"]')).toBeVisible();
});

test('mobile homepage is a single readable column', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-chromium');
  await page.goto('/');
  const boxes = await page.locator('main > section').evaluateAll((sections) =>
    sections.map((section) => section.getBoundingClientRect().width),
  );
  expect(boxes.every((width) => width <= 420)).toBe(true);
});
```

- [ ] **Step 2: Verify the new tests fail**

Run:

```bash
npm run build
npm run test:e2e -- homepage.spec.ts
```

Expected: FAIL because the six homepage sections are absent.

- [ ] **Step 3: Implement the Curated Cover components**

Implement the hero copy exactly as approved:

```text
Building useful systems, collecting curious ideas.
```

Use an asymmetric two-column desktop grid for featured project + Now panel, a three-column project grid that displays five cards across two rows, and a split writing/journal closing row. At `max-width: 48rem`, set every grid to one column. Use `clamp()` for display type and keep body line length at `70ch`.

The `NowPanel` content must come from a local object in `src/config/site.ts`, not from repository update timestamps. Seed it conservatively as:

```ts
now: {
  zh: '正在构建 My Company Brain，并整理个人项目与技术记录。',
  en: 'Building My Company Brain and organizing project and technical notes.',
}
```

- [ ] **Step 4: Implement both homepage routes and empty states**

Query projects, articles, and journal entries at build time. When no published article or journal entry exists, render these explicit messages:

```text
文章正在整理中。 / Writing is being prepared.
影像记录正在整理中。 / Journal entries are being prepared.
```

Do not hide the sections, because the information architecture must remain visible before content arrives.

- [ ] **Step 5: Verify desktop/mobile behavior and commit**

Run:

```bash
npm run build
npm run test:e2e -- homepage.spec.ts
npm run test:lighthouse
```

Expected: Playwright PASS; Lighthouse Accessibility and SEO are at least 0.90.

Commit:

```bash
git add src/components/home src/pages/index.astro src/pages/en/index.astro src/styles/global.css src/config/site.ts tests/e2e/homepage.spec.ts
git commit -m "feat: add curated editorial homepage"
```

---

### Task 6: Add Technical Writing, Reading Time, and RSS

**Files:**
- Create: `src/lib/reading-time.ts`
- Create: `src/components/cards/ArticleCard.astro`
- Create: `src/layouts/ArticleLayout.astro`
- Create: `src/pages/writing/index.astro`
- Create: `src/pages/writing/[slug].astro`
- Create: `src/pages/en/writing/index.astro`
- Create: `src/pages/en/writing/[slug].astro`
- Create: `src/pages/rss.xml.ts`
- Create from user input: `src/content/articles/zh/launch-article.md`
- Create from user input or omit with fallback approval: `src/content/articles/en/launch-article.md`
- Test: `tests/unit/reading-time.test.ts`
- Test: `tests/e2e/routes.spec.ts`

**Interfaces:**
- Consumes: article collection, locale selection, `BaseLayout`.
- Produces: `readingTime(text): { words: number; minutes: number }`, writing list/detail routes, `/rss.xml` containing published Chinese articles only.

- [ ] **Step 1: Write failing reading-time tests**

Create `tests/unit/reading-time.test.ts`:

```ts
import { expect, it } from 'vitest';
import { readingTime } from '../../src/lib/reading-time';

it('counts Chinese characters and English words deterministically', () => {
  expect(readingTime('知识图谱 makes retrieval explainable.')).toEqual({
    words: 7,
    minutes: 1,
  });
});

it('rounds reading time up', () => {
  expect(readingTime(Array(401).fill('word').join(' ')).minutes).toBe(3);
});
```

- [ ] **Step 2: Run tests and verify the missing implementation**

Run:

```bash
npm run test -- tests/unit/reading-time.test.ts
```

Expected: FAIL because the module is absent.

- [ ] **Step 3: Implement reading time**

Create `src/lib/reading-time.ts`:

```ts
export function readingTime(text: string) {
  const chineseCharacters = text.match(/[\u3400-\u9fff]/g)?.length ?? 0;
  const latinWords = text
    .replace(/[\u3400-\u9fff]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  const words = chineseCharacters + latinWords;
  return { words, minutes: Math.max(1, Math.ceil(words / 200)) };
}
```

- [ ] **Step 4: Implement writing list/detail pages and RSS**

`ArticleLayout.astro` renders title, date, updated date, reading time, tags, fallback notice, article body, and related articles sharing at least one tag. `rss.xml.ts` must filter `draft === false` and `locale === 'zh'` and use `@astrojs/rss`.

Add to `tests/e2e/routes.spec.ts`:

```ts
test('writing routes and RSS respond successfully', async ({ page, request }) => {
  await page.goto('/writing/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('文章');
  const rss = await request.get('/rss.xml');
  expect(rss.ok()).toBe(true);
  expect(await rss.text()).toContain('<rss');
});
```

- [ ] **Step 5: Add one confirmed article without fabricating authorship**

Request the article text from the user. Save the confirmed Chinese version in `launch-article.md` and set its public `slug` to a lowercase hyphenated value derived from the confirmed title. If the English translation is confirmed, save it with the same `translationKey`; otherwise obtain explicit fallback approval, follow the first article link from `/en/writing/`, and verify that the detail page shows the fallback notice.

The committed front matter must include a real title, summary of at least 20 characters, confirmed publish date, `draft: false`, and user-confirmed tags. Do not turn a repository README into an article without user approval.

- [ ] **Step 6: Verify and commit writing**

Run:

```bash
npm run test -- tests/unit/reading-time.test.ts
npm run check
npm run build
npm run test:e2e -- routes.spec.ts
```

Expected: PASS and RSS contains the confirmed published article.

Commit:

```bash
git add src/lib/reading-time.ts src/components/cards/ArticleCard.astro src/layouts/ArticleLayout.astro src/pages/writing src/pages/en/writing src/pages/rss.xml.ts src/content/articles tests
git commit -m "feat: add bilingual technical writing and RSS"
```

---

### Task 7: Add the Photography and Life Journal

**Files:**
- Create: `src/components/cards/JournalCard.astro`
- Create: `src/components/journal/PhotoGrid.astro`
- Create: `src/components/journal/Lightbox.astro`
- Create: `src/pages/journal/index.astro`
- Create: `src/pages/journal/[slug].astro`
- Create: `src/pages/en/journal/index.astro`
- Create: `src/pages/en/journal/[slug].astro`
- Create from user input: `src/content/journal/zh/first-set.md`
- Create from user input or fallback approval: `src/content/journal/en/first-set.md`
- Create from user input: `src/assets/journal/first-set/01.jpg`, `02.jpg`, `03.jpg`
- Test: `tests/e2e/journal.spec.ts`

**Interfaces:**
- Consumes: journal schema, Astro image pipeline, locale selection.
- Produces: `PhotoGrid` rendered with responsive images; one progressively enhanced `Lightbox` island with Escape, ArrowLeft, ArrowRight, touch-safe controls, dialog semantics, and focus restoration.

- [ ] **Step 1: Write failing journal and lightbox tests**

Create `tests/e2e/journal.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

test('journal entry renders optimized photos with alt text', async ({ page }) => {
  await page.goto('/journal/');
  const firstEntry = page.locator('[data-journal-card]').first();
  await firstEntry.getByRole('link').click();
  const photos = page.locator('[data-photo-grid] img');
  await expect(photos).toHaveCount(3);
  for (const image of await photos.all()) {
    await expect(image).not.toHaveAttribute('alt', '');
  }
});

test('lightbox closes with Escape and restores focus', async ({ page }) => {
  await page.goto('/journal/');
  await page.locator('[data-journal-card]').first().getByRole('link').click();
  const firstPhoto = page.locator('[data-photo-grid] button').first();
  await firstPhoto.focus();
  await firstPhoto.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(firstPhoto).toBeFocused();
});
```

- [ ] **Step 2: Run the tests and verify missing-route failures**

Run:

```bash
npm run build
npm run test:e2e -- journal.spec.ts
```

Expected: FAIL because journal routes do not exist.

- [ ] **Step 3: Implement journal cards and responsive photo rendering**

Use Astro `<Image widths={[480, 960, 1440]} formats={['avif', 'webp']}>`. The index displays photo sets, not individual photos. Preserve each image's aspect ratio and do not crop unless the user explicitly approves a cover crop.

- [ ] **Step 4: Implement the accessible lightbox**

Use a native `<dialog>` enhanced by one inline module script. The script must:

```ts
let trigger: HTMLElement | null = null;
function openLightbox(button: HTMLElement) { trigger = button; dialog.showModal(); }
function closeLightbox() { dialog.close(); trigger?.focus(); }
```

Add labelled previous/next/close buttons, Escape handling through the dialog's native cancel event, and ArrowLeft/ArrowRight handling. The no-JavaScript state remains a complete photo grid.

- [ ] **Step 5: Add one confirmed photo set**

Request at least three photos and confirmed metadata from the user. Normalize copies to the exact destination names `01.jpg`, `02.jpg`, and `03.jpg` without overwriting the originals. Put location only when the user confirms it is safe to publish. Write meaningful alternative text from the user-confirmed captions.

- [ ] **Step 6: Verify and commit the journal**

Run:

```bash
npm run check
npm run build
npm run test:e2e -- journal.spec.ts
npm run test:lighthouse
```

Expected: PASS; the page works with JavaScript disabled except for modal enlargement.

Commit:

```bash
git add src/components/cards/JournalCard.astro src/components/journal src/pages/journal src/pages/en/journal src/content/journal src/assets/journal tests/e2e/journal.spec.ts
git commit -m "feat: add accessible photography journal"
```

---

### Task 8: Add Confirmed Biography, Résumé, and Contact Content

**Files:**
- Create from user input: `src/content/profile/zh/about.md`
- Create from user input: `src/content/profile/en/about.md`
- Create from user input: `src/content/resume/zh/resume.md`
- Create from user input: `src/content/resume/en/resume.md`
- Create from user input: `public/resume/junshu-sha-resume.pdf`
- Create: `src/pages/about.astro`
- Create: `src/pages/en/about.astro`
- Create: `src/pages/resume.astro`
- Create: `src/pages/en/resume.astro`
- Modify: `src/config/site.ts`
- Modify: `src/components/SiteFooter.astro`
- Test: `tests/e2e/routes.spec.ts`

**Interfaces:**
- Consumes: confirmed user content, profile/resume schemas, `BaseLayout`.
- Produces: bilingual About and Résumé pages; typed contact links array `{ label, href, kind }[]`; optional PDF link shown only when the confirmed file exists.

- [ ] **Step 1: Write failing route and privacy tests**

Add to `tests/e2e/routes.spec.ts`:

```ts
test('about and resume routes expose confirmed identity links', async ({ page }) => {
  await page.goto('/about/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('关于');
  await expect(page.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
    'href',
    'https://github.com/ShaySha-PRa',
  );
  await page.goto('/resume/');
  await expect(page.getByRole('link', { name: /PDF/ })).toHaveAttribute(
    'href',
    '/resume/junshu-sha-resume.pdf',
  );
});

test('site contains no analytics or remote-font hosts', async ({ page }) => {
  const hosts = new Set<string>();
  page.on('request', (request) => hosts.add(new URL(request.url()).host));
  await page.goto('/about/');
  expect([...hosts].every((host) => host === '127.0.0.1:4321')).toBe(true);
});
```

- [ ] **Step 2: Run tests and verify 404 failures**

Run:

```bash
npm run build
npm run test:e2e -- routes.spec.ts
```

Expected: FAIL because About and Résumé routes do not exist.

- [ ] **Step 3: Collect and save confirmed content**

Ask the user for the five inputs listed in “Content Inputs Required During Execution.” Save the supplied biography and résumé text verbatim except for Markdown formatting. Confirm every public contact href before adding it to `SITE.contacts`. Do not expose a private email, phone number, home address, precise photo location, or legal identifier without explicit confirmation.

- [ ] **Step 4: Implement About and Résumé pages**

Query exactly one published entry per locale and collection. Render fallback notice when the English content is absent. The résumé page displays structured Markdown and a PDF download link only after `public/resume/junshu-sha-resume.pdf` has been supplied and manually opened successfully.

Define contacts in `src/config/site.ts`:

```ts
contacts: [
  { label: 'GitHub', href: 'https://github.com/ShaySha-PRa', kind: 'profile' },
  // Add only user-confirmed public destinations here.
],
```

Before committing, remove the explanatory source comment if another confirmed contact is added; an array containing GitHub alone is valid.

- [ ] **Step 5: Verify content and commit**

Run:

```bash
npm run check
npm run build
npm run test:e2e -- routes.spec.ts
```

Expected: PASS, confirmed PDF returns HTTP 200, and no remote trackers/fonts are requested.

Commit:

```bash
git add src/content/profile src/content/resume public/resume src/pages/about.astro src/pages/en/about.astro src/pages/resume.astro src/pages/en/resume.astro src/config/site.ts src/components/SiteFooter.astro tests/e2e/routes.spec.ts
git commit -m "feat: add confirmed profile resume and contact pages"
```

---

### Task 9: Complete 404, Robots, Sitemap, Metadata, and Accessible Route Coverage

**Files:**
- Create: `src/pages/404.astro`
- Create: `src/pages/robots.txt.ts`
- Create: `public/favicon.svg`
- Create: `tests/e2e/locale.spec.ts`
- Create: `tests/e2e/accessibility.spec.ts`
- Modify: `src/components/SeoHead.astro`
- Modify: `tests/e2e/routes.spec.ts`

**Interfaces:**
- Consumes: `SITE.url`, localization helpers, all public routes.
- Produces: static bilingual 404, `/robots.txt`, sitemap index from `@astrojs/sitemap`, JSON-LD for Person/CreativeWork/Article, complete route and axe checks.

- [ ] **Step 1: Write failing route, metadata, and accessibility tests**

Create `tests/e2e/locale.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

test('locale switch preserves equivalent project content', async ({ page }) => {
  await page.goto('/projects/graphrag-agent/');
  await page.getByRole('link', { name: 'English' }).click();
  await expect(page).toHaveURL('/en/projects/graphrag-agent/');
});

test('missing English translation is explicitly marked', async ({ page }) => {
  await page.goto('/en/writing/');
  const fallback = page.locator('[data-translation-fallback]');
  if (await fallback.count()) await expect(fallback.first()).toBeVisible();
});
```

Create `tests/e2e/accessibility.spec.ts`:

```ts
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

for (const path of ['/', '/projects/', '/writing/', '/journal/', '/about/', '/resume/']) {
  test(`has no serious accessibility violations: ${path}`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);
  });
}
```

- [ ] **Step 2: Run tests and verify missing-feature failures**

Run:

```bash
npm run build
npm run test:e2e -- locale.spec.ts accessibility.spec.ts routes.spec.ts
```

Expected: FAIL on missing 404/robots assertions or any unresolved accessible-name problem.

- [ ] **Step 3: Implement robots, 404, favicon, and JSON-LD**

`robots.txt.ts` must return:

```text
User-agent: *
Allow: /
Sitemap: https://shaysha-pra.github.io/sitemap-index.xml
```

The 404 page must contain Chinese and English headings in one static page and links to `/`, `/projects/`, and `/writing/`. `SeoHead.astro` must add valid Person JSON-LD on home/about, CreativeWork on project pages, and Article on writing pages using only confirmed content fields.

- [ ] **Step 4: Add route and generated-file assertions**

Extend `tests/e2e/routes.spec.ts` to assert successful responses for all list pages, six Chinese project pages, six English project pages, `/rss.xml`, `/robots.txt`, and `/sitemap-index.xml`. Assert that `/404.html` includes both `页面未找到` and `Page not found`.

- [ ] **Step 5: Run the full local acceptance suite**

Run:

```bash
npm run format
npm run validate
npm run test:lighthouse
```

Expected: all validation passes; Lighthouse Accessibility and SEO are at least 0.90; other sub-0.90 categories are investigated before accepting the task.

- [ ] **Step 6: Commit quality completion**

```bash
git add src/pages/404.astro src/pages/robots.txt.ts public/favicon.svg src/components/SeoHead.astro tests/e2e
git commit -m "feat: complete SEO accessibility and route coverage"
```

---

### Task 10: Add GitHub Actions Validation and Pages Deployment

**Files:**
- Create: `.github/workflows/ci.yml`
- Create: `.github/workflows/deploy-pages.yml`
- Modify: `README.md`
- Modify: `.gitignore`

**Interfaces:**
- Consumes: npm `validate` script and static `dist/` output.
- Produces: PR validation workflow; protected `github-pages` environment deployment from `main`; contributor documentation.

- [ ] **Step 1: Add the CI workflow and deliberately verify its trigger/configuration locally**

Create `.github/workflows/ci.yml`:

```yaml
name: Validate

on:
  pull_request:
  push:
    branches: [main]

permissions:
  contents: read

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-node@v6
        with:
          node-version: 22.12.0
          cache: npm
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm run validate
```

Inspect it with:

```bash
git diff --check -- .github/workflows/ci.yml
```

Expected: no whitespace errors; workflow has read-only repository permission.

- [ ] **Step 2: Add artifact-based Pages deployment**

Create `.github/workflows/deploy-pages.yml`:

```yaml
name: Deploy GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-node@v6
        with:
          node-version: 22.12.0
          cache: npm
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm run validate
      - uses: actions/upload-pages-artifact@v4
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy Pages artifact
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 3: Document local authoring and content safety**

Create `README.md` with exact sections:

```markdown
# Junshu Sha · Personal Space

## Requirements
## Install and run
## Validate
## Add or translate a project
## Publish a technical article
## Publish a journal entry
## Update profile, résumé, and contacts
## Deploy to GitHub Pages
## Content privacy checklist
```

Document `npm ci`, `npm run dev`, `npm run validate`, the five collection directories, `translationKey` pairing, `draft: true`, local image handling, PDF replacement, and the rule never to commit secrets or unconfirmed personal information.

- [ ] **Step 4: Run final verification from a clean dependency install**

Use a recoverable local dependency reinstall, then verify:

```bash
npm ci
npx playwright install chromium
npm run validate
npm run test:lighthouse
git diff --check
git status --short
```

Expected: all commands PASS; only planned files are modified; `.superpowers/`, `node_modules/`, `dist/`, Playwright reports, and Lighthouse output are ignored.

- [ ] **Step 5: Commit workflows and documentation**

```bash
git add .github/workflows README.md .gitignore
git commit -m "ci: validate and deploy personal space"
```

---

### Task 11: Production Readiness Review and GitHub Pages Enablement

**Files:**
- Modify only when evidence requires: content, tests, configuration, or documentation files identified by the failing check.
- Verify: all files in the repository and deployed URLs.

**Interfaces:**
- Consumes: complete site and GitHub workflows from Tasks 1–10.
- Produces: one verified release candidate and a recorded deployment URL; no new product feature.

- [ ] **Step 1: Verify the release candidate locally**

Run:

```bash
npm ci
npx playwright install chromium
npm run validate
npm run test:lighthouse
git log --oneline --decorate -12
git status --short
```

Expected: all checks PASS and the working tree is clean.

- [ ] **Step 2: Perform the content truthfulness review**

For each of the six project pages, compare role, metrics, status, screenshots, evidence, and limitations against the linked repository README and current public code. Confirm My Company Brain remains marked active and that pending validation is not presented as completed. Open the résumé PDF and confirm every public contact link with the user.

Expected: each public claim has a repository source or explicit user confirmation.

- [ ] **Step 3: Perform visual and responsive review**

Capture desktop and mobile screenshots of:

```text
/
/projects/
/projects/my-company-brain/
/writing/
/journal/
/about/
/resume/
/en/
/404.html
```

Verify Curated Cover hierarchy, Ink/Vermilion colors, no horizontal overflow, readable 200% zoom, visible keyboard focus, reduced-motion behavior, and non-cropped photography.

- [ ] **Step 4: Enable Pages and observe the first deployment**

In GitHub repository settings, set Pages Source to **GitHub Actions**. Push the reviewed branch only through the user-approved publishing workflow. Observe the `Validate` and `Deploy GitHub Pages` runs. Do not create a `gh-pages` branch.

Expected: both workflows succeed and GitHub reports the production URL from the `github-pages` environment.

- [ ] **Step 5: Verify production URLs and social metadata**

Open the deployed root, both locale homepages, all six project routes, RSS, sitemap, robots, résumé PDF, and 404. Inspect page source for canonical, hreflang, Open Graph, and JSON-LD. Re-run a production Lighthouse pass against the deployed URL.

Expected: no broken route, mixed content, missing asset, incorrect locale link, or serious accessibility violation.

- [ ] **Step 6: Commit only evidence-driven corrections**

If verification required corrections, first list the changed paths and stage only the matching correction category after its failing test passes:

```bash
git diff --name-only
# Content correction:
git add src/content src/assets public/resume
# Page, component, configuration, or test correction:
git add src/components src/layouts src/lib src/pages src/styles tests astro.config.mjs
git commit -m "fix: address production readiness finding"
```

If no corrections were required, do not create an empty commit. Record the deployed URL and verification date in the task handoff.

---

## Final Acceptance Checklist

- [ ] `npm ci`, `npm run validate`, and `npm run test:lighthouse` pass from a clean checkout.
- [ ] The Chinese root and English `/en/` routes work and preserve equivalent-content switching.
- [ ] Exactly six main project cards and twelve bilingual project case-study routes are published.
- [ ] My Company Brain is the featured active project and accurately distinguishes implementation from validation.
- [ ] At least one confirmed technical article appears in Writing and RSS.
- [ ] At least one confirmed three-photo journal entry appears with meaningful alternative text.
- [ ] Confirmed biography, résumé, résumé PDF, and public contacts are present without invented data.
- [ ] Keyboard navigation, reduced motion, mobile layout, 200% zoom, and axe checks pass.
- [ ] Canonical, hreflang, Open Graph, JSON-LD, RSS, sitemap, robots, and bilingual 404 are correct.
- [ ] GitHub Actions validates changes and deploys a Pages artifact from `main` without `gh-pages`.
- [ ] The deployed production URL passes route, asset, privacy, and Lighthouse review.
