import { expect, it } from 'vitest';
import { caseStudySchema, httpsUrl } from '../../src/lib/schema';

it('accepts valid HTTPS URLs and rejects insecure URL fields', () => {
  expect(httpsUrl.safeParse('https://github.com/example/project').success).toBe(
    true,
  );
  expect(httpsUrl.safeParse('http://github.com/example/project').success).toBe(
    false,
  );
  expect(httpsUrl.safeParse('/local/path/').success).toBe(false);
});

it('accepts a complete case study summary and rejects non-fragment evidence targets', () => {
  expect(
    caseStudySchema.safeParse({
      category: 'Enterprise Knowledge Platform / RAG + Agent',
      scope: '3 knowledge paths',
      evidenceTarget: '#validation',
    }).success,
  ).toBe(true);
  expect(
    caseStudySchema.safeParse({
      category: 'Enterprise Knowledge Platform / RAG + Agent',
      scope: '3 knowledge paths',
      evidenceTarget: '/validation',
    }).success,
  ).toBe(false);
});
