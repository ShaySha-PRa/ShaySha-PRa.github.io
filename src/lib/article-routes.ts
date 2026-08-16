import type { Locale } from './i18n';

export interface ArticleRouteRecord {
  locale: Locale;
  translationKey: string;
  slug: string;
}

function articlePath(locale: Locale, slug: string): string {
  return `${locale === 'en' ? '/en' : ''}/writing/${slug}/`;
}

export function articleTranslationPath(
  currentLocale: Locale,
  current: ArticleRouteRecord,
  records: readonly ArticleRouteRecord[],
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

  return articlePath(targetLocale, target.slug);
}
