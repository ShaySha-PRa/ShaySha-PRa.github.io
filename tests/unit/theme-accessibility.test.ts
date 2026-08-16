import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';

const styles = readFileSync(
  new URL('../../src/styles/global.css', import.meta.url),
  'utf8',
);

it('keeps link hover text at Ink contrast while using Vermilion decoration', () => {
  expect(styles).toMatch(
    /a:hover\s*\{[^}]*color:\s*var\(--ink\);[^}]*text-decoration-color:\s*var\(--vermilion\);/s,
  );
});
