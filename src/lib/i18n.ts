export type Locale = 'zh' | 'en';

export type Section =
  'home' | 'projects' | 'writing' | 'journal' | 'about' | 'resume';

export interface LocalizedRecord {
  locale: Locale;
  translationKey: string;
  slug: string;
  order?: number;
}

export interface LocalizedSelection<T extends LocalizedRecord> {
  entry: T;
  requestedLocale: Locale;
  isFallback: boolean;
}

export function selectLocalizedRecords<T extends LocalizedRecord>(
  records: T[],
  requestedLocale: Locale,
): LocalizedSelection<T>[] {
  const groups = new Map<string, T[]>();
  for (const record of records) {
    groups.set(record.translationKey, [
      ...(groups.get(record.translationKey) ?? []),
      record,
    ]);
  }

  return [...groups.values()]
    .map((group) => {
      const requested = group.find((item) => item.locale === requestedLocale);
      const fallback = group.find((item) => item.locale === 'zh');
      const entry = requested ?? fallback;
      return entry
        ? {
            entry,
            requestedLocale,
            isFallback: entry.locale !== requestedLocale,
          }
        : null;
    })
    .filter((item): item is LocalizedSelection<T> => item !== null)
    .sort((a, b) => (a.entry.order ?? 999) - (b.entry.order ?? 999));
}

export function selectNativeLocalizedRecords<T extends LocalizedRecord>(
  records: T[],
  requestedLocale: Locale,
): LocalizedSelection<T>[] {
  return selectLocalizedRecords(records, requestedLocale).filter(
    ({ entry }) => entry.locale === requestedLocale,
  );
}

export function localizedPath(
  locale: Locale,
  section: Section,
  slug?: string,
): string {
  const prefix = locale === 'en' ? '/en' : '';
  if (section === 'home') return `${prefix || ''}/`;
  return `${prefix}/${section}/${slug ? `${slug}/` : ''}`;
}
