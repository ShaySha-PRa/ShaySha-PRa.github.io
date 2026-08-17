import { z } from 'zod';

export const httpsUrl = z
  .string()
  .url()
  .refine((value) => value.startsWith('https://'), {
    message: 'URL must use HTTPS',
  });

export const caseStudySchema = z
  .object({
    category: z.string().min(1),
    scope: z.string().min(1),
  })
  .strict();
