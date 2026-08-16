import { expect, test } from '@playwright/test';

const projectNames = [
  'My Company Brain',
  'GraphRAGAgent',
  'Agent Teams Project',
  'Manim Project',
  'SQLAgent',
  'ITA-Maskit',
];

test('Chinese project index lists exactly six ordered projects', async ({
  page,
}) => {
  await page.goto('/projects/');
  const cards = page.locator('[data-project-card]');
  await expect(cards).toHaveCount(6);
  await expect(cards.locator('h2')).toHaveText(projectNames);
});

test('My Company Brain is explicitly active', async ({ page }) => {
  await page.goto('/projects/my-company-brain/');
  await expect(page.getByText('持续开发中')).toBeVisible();
  await expect(
    page.getByRole('heading', { name: '已知限制与下一步' }),
  ).toBeVisible();
});

test('English project route is available', async ({ page }) => {
  await page.goto('/en/projects/graphrag-agent/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'GraphRAGAgent',
  );
});
