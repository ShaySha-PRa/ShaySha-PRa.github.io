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
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'GraphRAGAgent',
  );
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

test('all writing surfaces stay native to their requested locale', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.locator('[data-section="latest-writing"]')).toHaveCount(1);

  await page.goto('/writing/');
  const card = page.locator('[data-article-card]');
  await expect(card).toHaveCount(1);
  await expect(card.getByRole('heading', { level: 2 })).toHaveText(
    'Coding Agent 原理与差异：Claude Code、Codex、Hermes Agent、pi',
  );
  await expect(card.locator('.article-card__summary')).toContainText(
    '系统比较 Claude Code、OpenAI Codex、Hermes Agent 与 pi',
  );
  await expect(card.locator('time')).toHaveCount(0);
  await expect(card.locator('.article-card__meta')).toHaveText(/\d+ 分钟阅读/);
  await expect(card.locator('.article-card__tags li')).toHaveCount(5);
  await expect(page.locator('.locale-switch').first()).toHaveAttribute(
    'href',
    '/en/writing/',
  );

  await page.goto('/writing/coding-agent-principles-and-differences/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Coding Agent 原理与差异',
  );
  await expect(page.locator('[data-translation-fallback]')).toHaveCount(0);

  await page.goto('/en/');
  await expect(page.locator('[data-section="latest-writing"]')).toHaveCount(0);

  await page.goto('/en/writing/');
  await expect(page.locator('[data-writing-empty]')).toBeVisible();
  await expect(page.locator('[data-article-card]')).toHaveCount(0);
  await expect(page.locator('[data-translation-fallback]')).toHaveCount(0);

  const response = await page.goto(
    '/en/writing/coding-agent-principles-and-differences/',
  );
  expect(response?.status()).toBe(404);
});
