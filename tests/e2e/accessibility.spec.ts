import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

for (const path of [
  '/',
  '/projects/',
  '/writing/',
  '/journal/',
  '/journal/cloud-and-stone/',
  '/writing/coding-agent-principles-and-differences/',
  '/about/',
  '/resume/',
  '/projects/graphrag-agent/',
  '/projects/agent-teams-project/',
  '/projects/manim-project/',
  '/projects/sql-agent/',
  '/projects/ita-maskit/',
  '/en/projects/graphrag-agent/',
  '/en/projects/agent-teams-project/',
  '/en/projects/manim-project/',
  '/en/projects/sql-agent/',
  '/en/projects/ita-maskit/',
]) {
  test(`has no serious accessibility violations: ${path}`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).analyze();
    expect(
      results.violations.filter((item) =>
        ['serious', 'critical'].includes(item.impact ?? ''),
      ),
    ).toEqual([]);
  });
}
