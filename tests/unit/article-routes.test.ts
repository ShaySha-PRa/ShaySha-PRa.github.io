import { expect, it } from 'vitest';
import { articleTranslationPath } from '../../src/lib/article-routes';

it('uses the counterpart slug for a translated article', () => {
  const records = [
    {
      locale: 'zh' as const,
      translationKey: 'retrieval-notes',
      slug: 'retrieval-notes-zh',
    },
    {
      locale: 'en' as const,
      translationKey: 'retrieval-notes',
      slug: 'retrieval-notes',
    },
  ];

  expect(articleTranslationPath('zh', records[0], records)).toBe(
    '/en/writing/retrieval-notes/',
  );
  expect(articleTranslationPath('en', records[1], records)).toBe(
    '/writing/retrieval-notes-zh/',
  );
});

it('uses the writing index when the target locale is missing', () => {
  const records = [
    { locale: 'zh' as const, translationKey: 'only-zh', slug: 'only-zh' },
  ];

  expect(articleTranslationPath('zh', records[0], records)).toBe(
    '/en/writing/',
  );
  expect(articleTranslationPath('en', records[0], records)).toBe('/writing/');
});
