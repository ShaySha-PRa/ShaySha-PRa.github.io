import { expect, it } from 'vitest';
import { buildHreflangLinks } from '../../src/lib/seo';

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
