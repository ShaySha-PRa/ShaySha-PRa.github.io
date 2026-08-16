import { describe, expect, it } from 'vitest';
import { localizedPath, selectLocalizedRecords } from '../../src/lib/i18n';
import { records } from '../fixtures/localized-records';

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
    expect(localizedPath('en', 'projects', 'alpha')).toBe(
      '/en/projects/alpha/',
    );
    expect(localizedPath('zh', 'home')).toBe('/');
    expect(localizedPath('en', 'home')).toBe('/en/');
  });
});
