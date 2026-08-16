import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';

const workflow = readFileSync(
  new URL('../../.github/workflows/deploy-pages.yml', import.meta.url),
  'utf8',
);

function jobBlock(name: string) {
  const marker = new RegExp(`^  ${name}:\\r?\\n`, 'm');
  const match = marker.exec(workflow);

  expect(match, `expected ${name} job in deploy workflow`).not.toBeNull();

  const start = match!.index + match![0].length;
  const remainder = workflow.slice(start);
  const nextJob = remainder.search(/^  [a-zA-Z0-9_-]+:/m);

  return remainder.slice(0, nextJob === -1 ? remainder.length : nextJob);
}

it('gates deployment completion with production Lighthouse assertions', () => {
  const production = jobBlock('verify-production');

  expect(workflow).toMatch(/^permissions:\r?\n  contents: read\r?\n/m);
  expect(production).toMatch(/^    needs: deploy\r?\n/m);
  expect(production).toMatch(/^    runs-on: ubuntu-latest\r?\n/m);
  expect(production).toMatch(
    /^    permissions:\r?\n      contents: read\r?\n/m,
  );
  expect(production).toMatch(/uses: actions\/checkout@v6/);
  expect(production).toMatch(/uses: actions\/setup-node@v6/);
  expect(production).toMatch(/run: npm ci/);
  expect(production).toContain(
    'npx lhci collect --no-lighthouserc --url=https://shaysha-pra.github.io/ --numberOfRuns=1',
  );
  expect(production).toContain(
    'npx lhci assert --config=lighthouse.config.cjs',
  );
  expect(production).not.toMatch(/^      (?:pages|id-token): write\r?\n/m);
});
