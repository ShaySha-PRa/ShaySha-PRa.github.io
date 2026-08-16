import { describe, expect, it } from 'vitest';
import { latestByDate } from '../../src/lib/dates';

describe('latestByDate', () => {
  it('selects the newest resolved date without mutating the input', () => {
    const records = [
      { id: 'old', published: new Date('2026-01-01') },
      { id: 'new', published: new Date('2026-03-01') },
    ];

    expect(latestByDate(records, (record) => record.published)?.id).toBe('new');
    expect(records.map((record) => record.id)).toEqual(['old', 'new']);
  });

  it('falls back to published when the preferred date is unavailable', () => {
    const records = [
      {
        id: 'fallback-newest',
        published: new Date('2026-04-01'),
        date: undefined,
      },
      {
        id: 'journal-date',
        published: new Date('2026-01-01'),
        date: new Date('2026-03-01'),
      },
    ];

    expect(
      latestByDate(records, (record) => record.date ?? record.published)?.id,
    ).toBe('fallback-newest');
  });
});
