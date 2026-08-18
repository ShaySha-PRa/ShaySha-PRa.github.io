import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { expect, it } from 'vitest';

const sourcePath = (relativePath: string) =>
  resolve(process.cwd(), relativePath);

const contentConfig = readFileSync(sourcePath('src/content.config.ts'), 'utf8');
const articleLayout = readFileSync(
  sourcePath('src/layouts/ArticleLayout.astro'),
  'utf8',
);
const articleCard = readFileSync(
  sourcePath('src/components/cards/ArticleCard.astro'),
  'utf8',
);

it('defines optional article date visibility and preserves structured dates', () => {
  expect(contentConfig).toMatch(/hideDate:\s*z\.boolean\(\)\.default\(false\)/);
  expect(articleLayout).toContain('!article.data.hideDate');
  expect(articleCard).toContain('!article.hideDate');
  expect(articleLayout).toContain(
    'datePublished: article.data.published.toISOString()',
  );
  expect(articleLayout).toContain(
    'dateModified: article.data.updated.toISOString()',
  );
});

it('keeps reading time visible independently of article dates', () => {
  const cardDateBlock = articleCard.match(
    /\{\s*!article\.hideDate && \(\s*<>[\s\S]*?<\/>(?:\s*)\)\s*\}/,
  )?.[0];
  expect(cardDateBlock).toBeDefined();
  expect(cardDateBlock).toContain('<time ');
  expect(cardDateBlock).toContain(' · ');
  expect(cardDateBlock).not.toContain('{minutes} {labels.minutes}');
  expect(articleCard).toMatch(
    /\{\s*!article\.hideDate && \([\s\S]*?\)\s*\}\s*<span>\{minutes\} \{labels\.minutes\}<\/span>/,
  );

  const detailMeta = articleLayout.match(
    /<dl class="article-detail__meta">[\s\S]*?<\/dl>/,
  )?.[0];
  expect(detailMeta).toBeDefined();
  expect(detailMeta).toContain('<dt>{labels.reading}</dt>');
  expect(detailMeta).toContain('<dd>{minutes}');
});
