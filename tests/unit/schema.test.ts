import { expect, it } from 'vitest';
import { httpsUrl } from '../../src/lib/schema';

it('accepts valid HTTPS URLs and rejects insecure URL fields', () => {
  expect(httpsUrl.safeParse('https://github.com/example/project').success).toBe(
    true,
  );
  expect(httpsUrl.safeParse('http://github.com/example/project').success).toBe(
    false,
  );
  expect(httpsUrl.safeParse('/local/path/').success).toBe(false);
});
