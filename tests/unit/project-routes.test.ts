import { expect, it } from 'vitest';
import { projectTranslationPath } from '../../src/lib/project-routes';

it('uses the counterpart slug for a translated project', () => {
  const records = [
    {
      locale: 'zh' as const,
      translationKey: 'company-brain',
      slug: 'my-company-brain',
    },
    {
      locale: 'en' as const,
      translationKey: 'company-brain',
      slug: 'my-company-brain-platform',
    },
  ];

  expect(projectTranslationPath('zh', records[0], records)).toBe(
    '/en/projects/my-company-brain-platform/',
  );
  expect(projectTranslationPath('en', records[1], records)).toBe(
    '/projects/my-company-brain/',
  );
});

it('uses the source slug when a target locale is missing', () => {
  const records = [
    {
      locale: 'zh' as const,
      translationKey: 'only-zh',
      slug: 'only-zh',
    },
  ];

  expect(projectTranslationPath('zh', records[0], records)).toBe(
    '/en/projects/only-zh/',
  );
  expect(projectTranslationPath('en', records[0], records)).toBe(
    '/projects/only-zh/',
  );
});
