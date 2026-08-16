import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { caseStudySchema, httpsUrl } from './lib/schema';

const localizedBase = z.object({
  title: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  locale: z.enum(['zh', 'en']),
  translationKey: z.string().min(1),
  summary: z.string().min(20),
  published: z.coerce.date(),
  updated: z.coerce.date(),
  draft: z.boolean().default(false),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

const projects = defineCollection({
  loader: glob({
    base: './src/content/projects',
    pattern: '**/*.{md,mdx}',
    generateId: ({ data }) =>
      `${String(data.locale ?? 'und')}-${String(data.slug ?? '')}`,
  }),
  schema: ({ image }) =>
    localizedBase.extend({
      status: z.enum(['active', 'completed', 'experiment']),
      role: z.string().min(1),
      tech: z.array(z.string()).min(1),
      repoUrl: httpsUrl,
      demoUrl: httpsUrl.optional(),
      cover: image(),
      gallery: z.array(image()).default([]),
      featured: z.boolean().default(false),
      order: z.number().int().min(1),
      evidence: z.array(z.string()).default([]),
      caseStudy: caseStudySchema.optional(),
    }),
});

const articles = defineCollection({
  loader: glob({ base: './src/content/articles', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    localizedBase.extend({
      tags: z.array(z.string()).default([]),
      cover: image().optional(),
      series: z.string().optional(),
      canonicalUrl: httpsUrl.optional(),
    }),
});

const journal = defineCollection({
  loader: glob({
    base: './src/content/journal',
    pattern: '**/*.{md,mdx}',
    generateId: ({ data }) =>
      `${String(data.locale ?? 'und')}-${String(data.slug ?? '')}`,
  }),
  schema: ({ image }) =>
    localizedBase.extend({
      date: z.coerce.date(),
      place: z.string().optional(),
      cover: image(),
      photos: z
        .array(
          z.object({
            src: image(),
            alt: z.string().min(1),
            caption: z.string().optional(),
          }),
        )
        .min(1),
      tags: z.array(z.string()).default([]),
      camera: z.string().optional(),
    }),
});

const profile = defineCollection({
  loader: glob({
    base: './src/content/profile',
    pattern: '**/*.md',
    generateId: ({ data }) =>
      `${String(data.locale ?? 'und')}-${String(data.slug ?? '')}`,
  }),
  schema: localizedBase.extend({ order: z.number().default(1) }),
});

const resume = defineCollection({
  loader: glob({
    base: './src/content/resume',
    pattern: '**/*.md',
    generateId: ({ data }) =>
      `${String(data.locale ?? 'und')}-${String(data.slug ?? '')}`,
  }),
  schema: localizedBase.extend({
    pdfPath: z.string().optional(),
    order: z.number().default(1),
  }),
});

export const collections = { projects, articles, journal, profile, resume };
