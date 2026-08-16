import { z } from 'zod';

export const httpsUrl = z
  .string()
  .url()
  .refine((value) => value.startsWith('https://'), {
    message: 'URL must use HTTPS',
  });
