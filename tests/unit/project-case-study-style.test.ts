import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';

const styles = readFileSync(
  new URL('../../src/styles/prose.css', import.meta.url),
  'utf8',
);

it('styles contextual project evidence as a bordered responsive figure', () => {
  expect(styles).toMatch(/\.prose \.project-evidence\s*\{/);
  expect(styles).toMatch(
    /\.prose \.project-evidence img\s*\{[^}]*width:\s*100%;[^}]*height:\s*auto;/s,
  );
  expect(styles).toMatch(
    /\.prose \.project-evidence figcaption\s*\{[^}]*color:\s*var\(--muted\);/s,
  );
});
