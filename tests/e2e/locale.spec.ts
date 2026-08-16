import { expect, test } from '@playwright/test';

test('locale switch preserves equivalent project content', async ({ page }) => {
  await page.goto('/projects/graphrag-agent/');
  if (await page.locator('.primary-nav .locale-switch').isVisible()) {
    await page.locator('.primary-nav .locale-switch').click();
  } else {
    await page.locator('.mobile-nav summary').click();
    await page.locator('.mobile-nav .locale-switch').click();
  }
  await expect(page).toHaveURL('/en/projects/graphrag-agent/');
});

test('empty English writing state is deterministic and has no translation fallback', async ({
  page,
}) => {
  await page.goto('/en/writing/');
  await expect(page.locator('[data-writing-empty]')).toHaveText(
    'Writing is being prepared. Published technical notes will appear here.',
  );
  await expect(page.locator('[data-translation-fallback]')).toHaveCount(0);
});
