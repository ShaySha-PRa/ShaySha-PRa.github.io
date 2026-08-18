# Coding Agent Article Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish the complete Chinese “Coding Agent 原理与差异” field note as the site's first native technical article, with official citations, no visible dates, a grouped collapsible table of contents, and no English fallback article.

**Architecture:** Extend the article collection with an opt-in `hideDate` presentation flag and add native-only article selection without changing localization for other collections. Convert the standalone HTML into semantic Markdown with stable section IDs, official primary-source links, and article-specific table/TOC styles; then verify homepage, writing index, detail, RSS, Sitemap, JSON-LD, accessibility, responsive behavior, and production deployment.

**Tech Stack:** Astro 7 content collections, TypeScript, Markdown/HTML, CSS, Vitest, Playwright, GitHub Pages.

## Global Constraints

- Source file: `C:\Users\Joshu\Documents\Codex\2026-08-13\referenced-chatgpt-conversation-this-is-an\outputs\Coding-Agent-原理与差异-Claude-Code-Codex-Hermes-pi.html`.
- Publish all 50 main sections; do not summarize or split the article.
- Preserve all 131 source `<pre>` code/diagram blocks and all four comparison tables after semantic conversion.
- Exact article slug: `coding-agent-principles-and-differences`.
- Exact title: `Coding Agent 原理与差异：Claude Code、Codex、Hermes Agent、pi`.
- Article locale is Chinese only; do not generate an English detail route or show a Chinese fallback on English writing surfaces.
- Hide visible published/updated dates only for this article; retain dates in sorting, RSS, Sitemap, and Article JSON-LD.
- Remove every `turn…search…` citation marker and replace supported claims with HTTPS primary sources from official documentation or official repositories.
- Do not copy the standalone HTML's navigation, theme switcher, CSS, JavaScript, or “复制” controls.
- Use a native `<details>/<summary>` grouped table of contents with no client JavaScript.
- Wide tables must scroll inside their own focusable container; the page root must not overflow at 390px.
- Add no runtime dependency, backend interface, external script, analytics, comment system, or cover image.
- Publish directly to the existing GitHub Pages `main` branch only after the complete local validation gate and final review pass.

---

## File Map

- `src/content.config.ts`: opt-in article `hideDate` field.
- `src/lib/i18n.ts`, `src/lib/content.ts`: native-only localized selection for the Writing collection.
- `src/lib/article-routes.ts`: route the locale switch to the target writing index when no translation exists.
- `src/layouts/ArticleLayout.astro`: hide visual date terms conditionally while retaining reading time and JSON-LD dates.
- `src/components/cards/ArticleCard.astro`: hide only this article's card date while retaining reading time.
- Chinese and English home/writing route files: consume native-only article selections and avoid fallback detail generation.
- `src/content/articles/zh/coding-agent-principles-and-differences.md`: the complete converted article.
- `src/styles/prose.css`: article TOC and table-scroller presentation.
- Unit/E2E tests: source integrity, route policy, visual metadata, RSS/SEO, responsive behavior, accessibility, and publication contracts.

---

## Task 1: Add Date Visibility and Native-Only Article Routing

**Files:**

- Modify: `tests/unit/i18n.test.ts`
- Modify: `tests/unit/article-routes.test.ts`
- Create: `tests/unit/article-presentation.test.ts`
- Modify: `src/content.config.ts`
- Modify: `src/lib/i18n.ts`
- Modify: `src/lib/content.ts`
- Modify: `src/lib/article-routes.ts`
- Modify: `src/layouts/ArticleLayout.astro`
- Modify: `src/components/cards/ArticleCard.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/pages/writing/index.astro`
- Modify: `src/pages/writing/[slug].astro`
- Modify: `src/pages/en/index.astro`
- Modify: `src/pages/en/writing/index.astro`
- Modify: `src/pages/en/writing/[slug].astro`

**Interfaces:**

- Produces: `selectNativeLocalizedRecords<T>(records, requestedLocale): LocalizedSelection<T>[]`.
- Produces: `getNativeLocalizedCollection<T>(collection, locale)` with the same resolved record shape as `getLocalizedCollection`, but without fallbacks.
- Produces: `articleTranslationPath(currentLocale, current, records): string` returning the target writing index when no target-locale counterpart exists.
- Produces: `articles.hideDate: boolean`, default `false`.

- [ ] **Step 1: Write failing native-language and translation-route tests**

Extend `tests/unit/i18n.test.ts`:

```ts
import {
  localizedPath,
  selectLocalizedRecords,
  selectNativeLocalizedRecords,
} from '../../src/lib/i18n';

it('excludes Chinese fallbacks when native-only content is requested', () => {
  expect(selectNativeLocalizedRecords(records, 'en')).toEqual([
    { entry: records[1], requestedLocale: 'en', isFallback: false },
  ]);
});
```

Change the missing-translation assertion in `tests/unit/article-routes.test.ts` to:

```ts
expect(articleTranslationPath('zh', records[0], records)).toBe('/en/writing/');
expect(articleTranslationPath('en', records[0], records)).toBe('/writing/');
```

- [ ] **Step 2: Write the failing presentation-source contract**

Create `tests/unit/article-presentation.test.ts` that reads `src/content.config.ts`, `ArticleLayout.astro`, and `ArticleCard.astro` and asserts:

```ts
expect(contentConfig).toMatch(/hideDate:\s*z\.boolean\(\)\.default\(false\)/);
expect(articleLayout).toContain('!article.data.hideDate');
expect(articleCard).toContain('!article.hideDate');
expect(articleLayout).toContain('datePublished: article.data.published.toISOString()');
expect(articleLayout).toContain('dateModified: article.data.updated.toISOString()');
```

The test must also assert the card's reading-time text is outside the date conditional and the detail layout always keeps its reading-time item.

- [ ] **Step 3: Run the focused tests and observe RED**

```powershell
npm run test -- tests/unit/i18n.test.ts tests/unit/article-routes.test.ts tests/unit/article-presentation.test.ts
```

Expected: missing native-only helpers, old missing-translation path behavior, absent `hideDate` schema, and unconditional date markup fail.

- [ ] **Step 4: Implement native-only selection**

Add to `src/lib/i18n.ts`:

```ts
export function selectNativeLocalizedRecords<T extends LocalizedRecord>(
  records: T[],
  requestedLocale: Locale,
): LocalizedSelection<T>[] {
  return selectLocalizedRecords(records, requestedLocale).filter(
    ({ entry }) => entry.locale === requestedLocale,
  );
}
```

Add `getNativeLocalizedCollection` to `src/lib/content.ts` using the same collection load/filter as `getLocalizedCollection`, then call `selectNativeLocalizedRecords`.

Use `getNativeLocalizedCollection('articles', locale)` in both homepages, both writing indexes, and both article detail route generators/related-article queries. Other collections continue using `getLocalizedCollection`.

- [ ] **Step 5: Implement missing-translation routing**

Update `articleTranslationPath` so a real target-locale counterpart returns its detail URL; otherwise return `${targetLocale === 'en' ? '/en' : ''}/writing/`. Do not construct a fallback detail slug.

- [ ] **Step 6: Implement the opt-in date presentation flag**

Extend only the article collection schema:

```ts
hideDate: z.boolean().default(false),
```

In `ArticleLayout.astro`, wrap only the Published and Updated `<div>` terms in `!article.data.hideDate`; always render Reading time. Keep `datePublished` and `dateModified` in structured data unconditionally.

In `ArticleCard.astro`, when `hideDate` is true, omit `<time>` and the adjacent separator; always render reading time.

- [ ] **Step 7: Verify GREEN and commit**

```powershell
npx prettier --write src/content.config.ts src/lib/i18n.ts src/lib/content.ts src/lib/article-routes.ts src/layouts/ArticleLayout.astro src/components/cards/ArticleCard.astro src/pages/index.astro src/pages/writing/index.astro 'src/pages/writing/[slug].astro' src/pages/en/index.astro src/pages/en/writing/index.astro 'src/pages/en/writing/[slug].astro' tests/unit/i18n.test.ts tests/unit/article-routes.test.ts tests/unit/article-presentation.test.ts
npm run test -- tests/unit/i18n.test.ts tests/unit/article-routes.test.ts tests/unit/article-presentation.test.ts
npm run check
npm run build
git diff --check
git add src tests/unit
git commit -m "feat: support undated native-language articles"
```

Expected: focused tests, Astro check, and the existing 27-page no-article build pass before the article is added.

---

## Task 2: Convert the Complete Article and Replace Internal Citations

**Files:**

- Create: `tests/unit/coding-agent-article.test.ts`
- Create: `src/content/articles/zh/coding-agent-principles-and-differences.md`

**Interfaces:**

- Consumes: article schema and native-only route behavior from Task 1.
- Produces: one Chinese article with 50 `<h2 data-article-section>` elements, 131 fenced code blocks, four `.article-table-scroller` tables, one grouped `.article-toc`, and official HTTPS references.

- [ ] **Step 1: Write the failing article-integrity test**

Create `tests/unit/coding-agent-article.test.ts`. Read the Markdown with `gray-matter` and assert:

```ts
expect(data).toMatchObject({
  title: 'Coding Agent 原理与差异：Claude Code、Codex、Hermes Agent、pi',
  slug: 'coding-agent-principles-and-differences',
  locale: 'zh',
  translationKey: 'coding-agent-principles-and-differences',
  hideDate: true,
  draft: false,
});
expect(data.cover).toBeUndefined();
expect(data.tags).toEqual([
  'Coding Agent',
  'Memory',
  'Agent Architecture',
  'Claude Code',
  'Codex',
]);
expect(content.match(/<h2 id="[^"]+" data-article-section>/g)).toHaveLength(50);
expect((content.match(/^```/gm) ?? []).length / 2).toBe(131);
expect(content.match(/class="article-table-scroller"/g)).toHaveLength(4);
expect(content.match(/href="#section-[^"]+"/g)).toHaveLength(50);
expect(content).toContain('<details class="article-toc">');
expect(content).toContain('## 参考资料');
expect(content).toContain('50. 最终总结');
expect(content).not.toMatch(/cite|turn\d+(?:search|view|fetch)\d+/);
expect(content).not.toMatch(/切换主题|Contents · 50 Sections|>复制</);
```

Extract all external links and require HTTPS. Allow only:

```text
code.claude.com
docs.anthropic.com
learn.chatgpt.com
developers.openai.com
openai.com
github.com/openai
github.com/NousResearch
hermes-agent.nousresearch.com
github.com/badlogic
modelcontextprotocol.io
github.com/modelcontextprotocol
```

Require at least one official link for each of Claude Code, Codex, Hermes, pi, and MCP.

- [ ] **Step 2: Run the integrity test and observe RED**

```powershell
npm run test -- tests/unit/coding-agent-article.test.ts
```

Expected: FAIL because the article file does not exist.

- [ ] **Step 3: Mechanically extract semantic content**

Use a temporary, untracked conversion script under `.superpowers/sdd/2026-08-18-coding-agent-article/`. Parse the source with WSL Python and its available `bs4` module. Select the main article content, exclude the standalone navigation/header/theme controls/scripts/styles, and convert:

- 50 source main headings → `<h2 id="section-01" data-article-section>` through `<h2 id="section-50" data-article-section>`.
- Source subheadings → `###` headings.
- Every `<pre>` → a fenced block, preserving its text exactly except removing UI-only “复制”.
- Paragraphs, lists, emphasis, and blockquotes → Markdown equivalents.
- Four tables → semantic HTML tables inside `<div class="article-table-scroller" tabindex="0" role="region" aria-label="…">`.

Generate the file with this exact frontmatter:

```yaml
---
title: 'Coding Agent 原理与差异：Claude Code、Codex、Hermes Agent、pi'
slug: coding-agent-principles-and-differences
locale: zh
translationKey: coding-agent-principles-and-differences
summary: 系统比较 Claude Code、OpenAI Codex、Hermes Agent 与 pi 的 Agent Loop、上下文、记忆、Compaction、工具、子代理、安全边界与扩展机制。
published: 2026-08-13
updated: 2026-08-18
draft: false
hideDate: true
tags: [Coding Agent, Memory, Agent Architecture, Claude Code, Codex]
series: Coding Agents
---
```

- [ ] **Step 4: Add the grouped 50-link table of contents**

Insert a static `<details class="article-toc">` immediately after the opening article note. Its summary is exactly `目录 · 50 节`; its child `.article-toc__groups` contains five named groups. Generate one list item for every source main heading by pairing the source heading text with IDs `section-01` through `section-50`. The groups and ranges are exactly: Agent 与 Memory 基础 (1–4), Claude Code (5–12), Codex (13–21), Hermes Agent (22–30), pi 与四家横向比较 (31–50). No section may be omitted or duplicated.

- [ ] **Step 5: Replace all internal citations with primary sources**

Remove every internal marker and validate/rewrite surrounding claims against these official sources:

```text
Claude Code
https://code.claude.com/docs/en/how-claude-code-works
https://code.claude.com/docs/en/features-overview
https://code.claude.com/docs/en/context-window
https://code.claude.com/docs/en/memory
https://code.claude.com/docs/en/sub-agents
https://code.claude.com/docs/en/hooks
https://code.claude.com/docs/en/security
https://code.claude.com/docs/en/mcp

OpenAI Codex
https://learn.chatgpt.com/docs/codex/cli
https://learn.chatgpt.com/docs/agent-configuration/agents-md
https://learn.chatgpt.com/docs/agent-configuration/memories
https://learn.chatgpt.com/docs/agent-configuration/subagents
https://learn.chatgpt.com/docs/security/sandboxing
https://learn.chatgpt.com/docs/security/internet-access
https://learn.chatgpt.com/docs/extend/mcp?surface=cli
https://github.com/openai/codex

Hermes Agent
https://github.com/NousResearch/hermes-agent
https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/memory.md
https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/skills.md
https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/delegation.md
https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/sessions.md
https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/security.md

pi
https://github.com/badlogic/pi-mono/tree/main/packages/coding-agent
https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/compaction.md
https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/extensions.md
https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/sessions.md
https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/skills.md
https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/providers.md
https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/security.md

MCP
https://modelcontextprotocol.io/docs/getting-started/intro
https://github.com/modelcontextprotocol
```

Use only the subset actually needed. Place citations beside supported claims and list every used URL once in `## 参考资料`, grouped by product. If a claim is absent from the official sources, qualify or remove that claim instead of citing an adjacent fact.

- [ ] **Step 6: Verify content integrity and commit**

```powershell
npx prettier --write src/content/articles/zh/coding-agent-principles-and-differences.md tests/unit/coding-agent-article.test.ts
npm run test -- tests/unit/coding-agent-article.test.ts
npm run check
npm run build
git diff --check
git add src/content/articles/zh/coding-agent-principles-and-differences.md tests/unit/coding-agent-article.test.ts
git commit -m "feat: publish the Coding Agent field note"
```

Expected: the article integrity test passes and the build adds only the Chinese detail route.

---

## Task 3: Integrate the Long-Form Reading Experience and Public Contracts

**Files:**

- Modify: `src/styles/prose.css`
- Modify: `tests/e2e/homepage.spec.ts`
- Modify: `tests/e2e/locale.spec.ts`
- Modify: `tests/e2e/routes.spec.ts`
- Modify: `tests/e2e/accessibility.spec.ts`
- Modify: `tests/unit/seo.test.ts` only if the existing Article JSON-LD helper contract needs the new concrete article case.

**Interfaces:**

- Consumes: article content and presentation/routing interfaces from Tasks 1–2.
- Produces: styled TOC/table scrollers and end-to-end contracts for all public surfaces.

- [ ] **Step 1: Write failing page-level contracts**

Add E2E assertions for:

```text
Chinese homepage:
- latest-writing section is visible
- title link targets /writing/coding-agent-principles-and-differences/

Chinese /writing/:
- exactly one article card
- title and summary visible
- no time element in the card
- reading time and five tags visible

Article detail:
- title and summary visible
- exactly 50 [data-article-section] headings
- details.article-toc and 50 internal links
- no Published/Updated labels and no visible time elements in article meta
- reading time and five tags visible
- four article-table-scroller containers
- all external article links use HTTPS

English surfaces:
- /en/ has no latest-writing section
- /en/writing/ keeps its empty-state message and no fallback card
- /en/writing/coding-agent-principles-and-differences/ returns 404
- Chinese locale switch points to /en/writing/

Feeds and metadata:
- RSS contains title, Chinese detail URL, and pubDate
- Sitemap contains Chinese detail URL and excludes English detail URL
- Article JSON-LD contains Article type, headline, canonical URL, datePublished, and dateModified
```

Add the Chinese detail route to the accessibility route set.

- [ ] **Step 2: Write failing 390px and interaction contracts**

At an explicit viewport `{ width: 390, height: 844 }`, assert:

```ts
expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
  document.documentElement.clientWidth,
);
```

For each `.article-table-scroller`, assert `scrollWidth > clientWidth` for at least one wide table and that setting `scrollLeft = scrollWidth` moves the scroller without moving the page root. Focus the `<summary>` and press Enter to confirm the native TOC opens; activate one link and verify the URL hash and target heading.

- [ ] **Step 3: Run E2E and observe RED**

```powershell
npm run build
npx playwright test tests/e2e/homepage.spec.ts tests/e2e/locale.spec.ts tests/e2e/routes.spec.ts tests/e2e/accessibility.spec.ts --grep "writing|Coding Agent|article|390px"
```

Expected: content routes exist, but TOC/table styling and any missing concrete public contracts fail.

- [ ] **Step 4: Add TOC and table-scroller styles**

Add focused rules to `src/styles/prose.css`:

```css
.prose .article-toc {
  margin-block: 2rem;
  border-block: 1px solid var(--sand);
  padding-block: 1rem;
}

.prose .article-toc summary {
  cursor: pointer;
  font-weight: 700;
}

.prose .article-toc summary:focus-visible {
  outline: 2px solid var(--vermilion);
  outline-offset: 0.35rem;
}

.prose .article-toc__groups {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.25rem;
  margin-top: 1rem;
}

.prose .article-table-scroller {
  max-width: 100%;
  overflow-x: auto;
  margin-block: 1.5rem;
}

.prose .article-table-scroller table {
  margin-block: 0;
}
```

At `max-width: 48rem`, collapse `.article-toc__groups` to one column. Do not alter the existing project architecture scroller.

- [ ] **Step 5: Complete public integration tests and verify GREEN**

```powershell
npx prettier --write src/styles/prose.css tests/e2e/homepage.spec.ts tests/e2e/locale.spec.ts tests/e2e/routes.spec.ts tests/e2e/accessibility.spec.ts tests/unit/seo.test.ts
npm run test
npm run build
npx playwright test tests/e2e/homepage.spec.ts tests/e2e/locale.spec.ts tests/e2e/routes.spec.ts tests/e2e/accessibility.spec.ts
git diff --check
```

Expected: homepage, writing index, detail, English empty state, RSS, Sitemap, JSON-LD, TOC keyboard interaction, 390px layout, and Axe serious/critical checks pass.

- [ ] **Step 6: Commit**

```powershell
git add src/styles/prose.css tests/e2e tests/unit/seo.test.ts
git commit -m "feat: integrate the long-form article experience"
```

Stage only files that actually changed.

---

## Task 4: Full QA, Source Audit, and Production Publication

**Files:**

- Modify only if QA exposes a regression: article, presentation, routing, style, or focused tests from Tasks 1–3.

**Interfaces:**

- Consumes: complete article implementation.
- Produces: published Chinese article with verified official references and no English fallback.

- [ ] **Step 1: Run the complete local gate**

```powershell
npm run validate
git status -sb
git diff --check origin/main..HEAD
```

Expected: format, Astro check, all unit tests, build, link scan, and all desktop/mobile E2E pass. Only existing non-blocking Astro hints and the former empty-articles warning may remain; the empty-articles warning should disappear after publication.

- [ ] **Step 2: Audit conversion completeness**

```powershell
rg -n 'cite|turn[0-9]+(?:search|view|fetch)[0-9]+|切换主题|Contents · 50 Sections|>复制<' src/content/articles
rg -n '^<h2 id="[^"]+" data-article-section>' src/content/articles/zh/coding-agent-principles-and-differences.md
rg -n '^```' src/content/articles/zh/coding-agent-principles-and-differences.md
rg -n 'class="article-table-scroller"' src/content/articles/zh/coding-agent-principles-and-differences.md
```

Expected: forbidden scan has no matches; counts are 50 section headings, 262 fence lines (131 blocks), and four table scrollers.

- [ ] **Step 3: Validate every external source**

Extract unique external URLs from the article and request each with redirects enabled. Every URL must use HTTPS, belong to the approved primary-source allowlist, and return HTTP 200–399. Record any redirect target; replace dead, third-party, or generic links before publication.

- [ ] **Step 4: Inspect the generated routes and metadata**

Confirm:

```text
/writing/coding-agent-principles-and-differences/index.html exists
/en/writing/coding-agent-principles-and-differences/index.html does not exist
Chinese homepage and writing index contain the article
English homepage and writing index do not contain the article
RSS and Sitemap contain only the Chinese article URL
Article JSON-LD retains both dates while visible meta contains no date
```

- [ ] **Step 5: Push directly to main**

```powershell
git push origin HEAD:main
git fetch origin main
git rev-parse HEAD
git rev-parse origin/main
```

Expected: local and remote SHAs match.

- [ ] **Step 6: Verify Actions and production**

Wait for the new-sha Validate and Deploy GitHub Pages workflows. Require build, deploy, production Lighthouse collection, and Lighthouse threshold assertion to succeed.

Verify production:

```text
https://shaysha-pra.github.io/
https://shaysha-pra.github.io/writing/
https://shaysha-pra.github.io/writing/coding-agent-principles-and-differences/
https://shaysha-pra.github.io/en/
https://shaysha-pra.github.io/en/writing/
https://shaysha-pra.github.io/rss.xml
https://shaysha-pra.github.io/sitemap-index.xml
```

Require the first five expected pages to return 200, the nonexistent English detail route to return 404, official article links to remain reachable, visible dates to remain absent, 390px to have no page overflow, and serious/critical Axe issues to remain zero. Record final SHA, test counts, workflow run IDs, production URL, and only genuinely non-blocking warnings.
