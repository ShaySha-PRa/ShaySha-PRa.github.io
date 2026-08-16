import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';

const svg = readFileSync(
  new URL('../../public/projects/my-company-brain-architecture.svg', import.meta.url),
  'utf8',
);

it('describes the approved four-layer My Company Brain architecture', () => {
  expect(svg).toMatch(/viewBox="0 0 1400 820"/);
  expect(svg).toContain('<title id="title">My Company Brain system architecture</title>');
  expect(svg).toMatch(/<desc id="desc">[^<]{80,}<\/desc>/);

  for (const label of [
    '01 / EXPERIENCE',
    '02 / CONTROL PLANE',
    '03 / KNOWLEDGE PLANE',
    '04 / DATA PLANE',
    'BROWSER',
    'NEXT.JS WEB',
    'UNIFIED API',
    'AGENT GATEWAY',
    'PLATFORM DOMAIN',
    'NANO BRAIN',
    'TRADITIONAL RAG',
    'GRAPHRAG',
    'PROTECTED MODULE BOUNDARY',
    'POSTGRESQL · 6 LOGICAL DATABASES',
    'NEO4J',
    '/api/platform/*',
    '/api/agent/*',
  ]) {
    expect(svg).toContain(label);
  }
});

it('omits deployment and model implementation detail', () => {
  expect(svg).not.toMatch(/\b(?:3000|3001|5432|7474|7687|8000|8001|8002|8003)\b/);
  expect(svg).not.toMatch(/external model boundary|minimax|embedding|fallback/i);
});
