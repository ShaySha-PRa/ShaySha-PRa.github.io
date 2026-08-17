import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';

const svg = readFileSync(
  new URL(
    '../../public/projects/my-company-brain-architecture.svg',
    import.meta.url,
  ),
  'utf8',
);

it('describes the approved four-layer My Company Brain architecture', () => {
  expect(svg).toMatch(/viewBox="0 0 1400 820"/);
  expect(svg).toContain(
    '<title id="title">My Company Brain system architecture</title>',
  );
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

  for (const database of [
    'identity',
    'core',
    'agent',
    'nano',
    'traditional',
    'graph',
  ]) {
    expect(svg).toMatch(new RegExp(`\\b${database}\\b`));
  }
});

it('omits deployment and model implementation detail', () => {
  expect(svg).not.toMatch(
    /(?:localhost|127\.0\.0\.1|[a-z0-9][a-z0-9.-]*):(?:\d{2,5})\b/i,
  );

  for (const detail of [
    /\b(?:model\s+)?provider\b/i,
    /\bmodel[-\s]+boundary\b/i,
    /\bminimax\b/i,
    /\bembeddings?\b/i,
    /\bfallback\b/i,
    /\b(?:test\s+counts?|(?:\d+\s+)?tests?)\b/i,
    /\bhealth(?:check|y)?\b/i,
    /\bcapacity\b/i,
    /\bproduction(?:[-\s]+ready)?\b/i,
  ]) {
    expect(svg).not.toMatch(detail);
  }
});
