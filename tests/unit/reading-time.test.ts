import { expect, it } from 'vitest';
import { readingTime } from '../../src/lib/reading-time';

it('counts Chinese characters and English words deterministically', () => {
  expect(readingTime('知识图谱 makes retrieval explainable.')).toEqual({
    words: 7,
    minutes: 1,
  });
});

it('rounds reading time up', () => {
  expect(readingTime(Array(401).fill('word').join(' ')).minutes).toBe(3);
});
