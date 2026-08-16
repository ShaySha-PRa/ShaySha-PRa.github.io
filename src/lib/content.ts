import {
  getCollection,
  type CollectionEntry,
  type CollectionKey,
} from 'astro:content';
import {
  selectLocalizedRecords,
  type Locale,
  type LocalizedRecord,
  type LocalizedSelection,
} from './i18n';

type LocalizedCollectionRecord<T extends CollectionKey> = LocalizedRecord &
  CollectionEntry<T>['data'] & {
    id: string;
    entry: CollectionEntry<T>;
  };

export async function getLocalizedCollection<T extends CollectionKey>(
  collection: T,
  locale: Locale,
): Promise<LocalizedSelection<LocalizedCollectionRecord<T>>[]> {
  const entries = await getCollection(collection, ({ data }) => !data.draft);
  return selectLocalizedRecords(
    entries.map((entry) => ({ ...entry.data, id: entry.id, entry })) as Array<
      LocalizedCollectionRecord<T>
    >,
    locale,
  );
}
