import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';
import {
  buildArticleStructuredData,
  buildHreflangLinks,
  serializeStructuredData,
} from '../../src/lib/seo';

it('builds Chinese, English, and x-default alternate links', () => {
  expect(
    buildHreflangLinks(
      new URL('https://example.com'),
      '/projects/a/',
      '/en/projects/a/',
    ),
  ).toEqual([
    { lang: 'zh-CN', href: 'https://example.com/projects/a/' },
    { lang: 'en', href: 'https://example.com/en/projects/a/' },
    { lang: 'x-default', href: 'https://example.com/projects/a/' },
  ]);
});

it('serializes JSON-LD safely while preserving valid JSON', () => {
  const data = buildArticleStructuredData({
    headline: '</script><script>alert(1)</script>',
    description: 'A confirmed article description.',
    url: 'https://example.com/writing/safe/',
    datePublished: '2026-01-01T00:00:00.000Z',
    dateModified: '2026-01-02T00:00:00.000Z',
  });
  const serialized = serializeStructuredData(data);

  expect(serialized).not.toContain('</script>');
  expect(JSON.parse(serialized)).toEqual(data);
});

it('builds Article JSON-LD from only confirmed article fields', () => {
  expect(
    buildArticleStructuredData({
      headline: 'Retrieval notes',
      description: 'A confirmed article description.',
      url: 'https://example.com/en/writing/retrieval-notes/',
      datePublished: '2026-08-16T00:00:00.000Z',
      dateModified: '2026-08-17T00:00:00.000Z',
    }),
  ).toEqual({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Retrieval notes',
    description: 'A confirmed article description.',
    url: 'https://example.com/en/writing/retrieval-notes/',
    datePublished: '2026-08-16T00:00:00.000Z',
    dateModified: '2026-08-17T00:00:00.000Z',
  });
});

it('keeps canonical link checks bounded to the canonical host', () => {
  const packageJson = JSON.parse(
    readFileSync(new URL('../../package.json', import.meta.url), 'utf8'),
  ) as { scripts: { 'test:links': string } };

  expect(packageJson.scripts['test:links']).toContain(
    '^https://shaysha-pra\\.github\\.io(?:/|$)',
  );
});
