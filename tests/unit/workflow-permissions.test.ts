import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';

const workflow = readFileSync(
  new URL('../../.github/workflows/deploy-pages.yml', import.meta.url),
  'utf8',
);

it('keeps build read-only and scopes Pages deployment writes to deploy', () => {
  expect(workflow).toMatch(/^permissions:\r?\n  contents: read\r?\n/m);
  expect(workflow).not.toMatch(/^permissions:[\s\S]*?^  (?:pages|id-token):/m);
  expect(workflow).toMatch(
    /^  deploy:\r?\n[\s\S]*?^    permissions:\r?\n      pages: write\r?\n      id-token: write/m,
  );
});
