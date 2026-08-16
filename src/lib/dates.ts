export function latestByDate<T>(
  records: readonly T[],
  getDate: (record: T) => Date | undefined,
): T | undefined {
  return records.reduce<T | undefined>((latest, record) => {
    const date = getDate(record);
    if (!date) return latest;
    if (!latest) return record;

    const latestDate = getDate(latest);
    return !latestDate || date.getTime() > latestDate.getTime()
      ? record
      : latest;
  }, undefined);
}
