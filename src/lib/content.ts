import {
  getCollection,
  type CollectionEntry,
  type CollectionKey,
} from 'astro:content';
import {
  selectLocalizedRecords,
  type Locale,
  type LocalizedRecord,
} from './i18n';

export async function getLocalizedCollection<T extends CollectionKey>(
  collection: T,
  locale: Locale,
) {
  const entries = await getCollection(collection, ({ data }) => !data.draft);
  return selectLocalizedRecords(
    entries.map((entry) => ({ ...entry.data, id: entry.id, entry })) as Array<
      LocalizedRecord & { id: string; entry: CollectionEntry<T> }
    >,
    locale,
  );
}
