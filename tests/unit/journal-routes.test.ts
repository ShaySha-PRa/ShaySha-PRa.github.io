import { expect, it } from 'vitest';
import { journalTranslationPath } from '../../src/lib/journal-routes';

it('uses the counterpart locale slug for a translated journal entry', () => {
  const records = [
    {
      locale: 'zh' as const,
      translationKey: 'morning-walk',
      slug: 'morning-walk-zh',
    },
    {
      locale: 'en' as const,
      translationKey: 'morning-walk',
      slug: 'morning-walk',
    },
  ];

  expect(journalTranslationPath('zh', records[0], records)).toBe(
    '/en/journal/morning-walk/',
  );
  expect(journalTranslationPath('en', records[1], records)).toBe(
    '/journal/morning-walk-zh/',
  );
});

it('falls back to the Chinese slug when an English entry is missing', () => {
  const records = [
    {
      locale: 'zh' as const,
      translationKey: 'only-zh',
      slug: 'only-zh-photo-set',
    },
  ];

  expect(journalTranslationPath('zh', records[0], records)).toBe(
    '/en/journal/only-zh-photo-set/',
  );
});
