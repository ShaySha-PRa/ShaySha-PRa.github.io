import type { Locale } from './i18n';

export interface JournalRouteRecord {
  locale: Locale;
  translationKey: string;
  slug: string;
}

function journalPath(locale: Locale, slug: string): string {
  return `${locale === 'en' ? '/en' : ''}/journal/${slug}/`;
}

export function journalTranslationPath(
  currentLocale: Locale,
  current: JournalRouteRecord,
  records: readonly JournalRouteRecord[],
): string {
  const targetLocale: Locale = currentLocale === 'zh' ? 'en' : 'zh';
  const target =
    records.find(
      (record) =>
        record.translationKey === current.translationKey &&
        record.locale === targetLocale,
    ) ??
    records.find(
      (record) =>
        record.translationKey === current.translationKey &&
        record.locale === 'zh',
    ) ??
    current;

  return journalPath(targetLocale, target.slug);
}
