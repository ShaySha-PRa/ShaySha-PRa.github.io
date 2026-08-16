import { expect, it } from 'vitest';
import { buildHreflangLinks, serializeStructuredData } from '../../src/lib/seo';

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
  const data = {
    '@context': 'https://schema.org' as const,
    '@type': 'Article' as const,
    headline: '</script><script>alert(1)</script>',
    description: 'A confirmed article description.',
    url: 'https://example.com/writing/safe/',
    datePublished: '2026-01-01T00:00:00.000Z',
    dateModified: '2026-01-02T00:00:00.000Z',
  };
  const serialized = serializeStructuredData(data);

  expect(serialized).not.toContain('</script>');
  expect(JSON.parse(serialized)).toEqual(data);
});
