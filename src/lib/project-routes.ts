import type { Locale } from './i18n';

export interface ProjectRouteRecord {
  locale: Locale;
  translationKey: string;
  slug: string;
}

function projectPath(locale: Locale, slug: string): string {
  return `${locale === 'en' ? '/en' : ''}/projects/${slug}/`;
}

export function projectTranslationPath(
  currentLocale: Locale,
  current: ProjectRouteRecord,
  records: readonly ProjectRouteRecord[],
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

  return projectPath(targetLocale, target.slug);
}
