# Résumé Content Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish the supplied KPMG work experience and four project experiences on the bilingual résumé pages.

**Architecture:** Add one Chinese and one English Astro content entry to the existing `resume` collection. Keep the page component and content schema unchanged; verify the real rendered routes with Playwright and use the existing prose styles, adding only résumé-specific spacing if visual inspection requires it.

**Tech Stack:** Astro content collections, Markdown, Playwright, Prettier, TypeScript.

## Global Constraints

- Preserve every supplied project, metric, date, and named technology.
- Chinese content uses the supplied wording with web-safe line wrapping and punctuation cleanup only.
- English content is a faithful translation and does not add claims.
- Do not add education, contact details, a PDF, employer details, or personal claims that were not supplied.
- The résumé remains maintained as Markdown plus Git.

---

### Task 1: Protect published résumé behavior

**Files:**
- Modify: `tests/e2e/routes.spec.ts`

**Interfaces:**
- Consumes: `/resume/` and `/en/resume/` Astro routes.
- Produces: browser-level assertions that both locales render the supplied experience and do not expose a nonexistent PDF link.

- [ ] **Step 1: Write the failing test**

Replace the résumé empty-state expectations with literal assertions for `毕马威上海分所（KPMG）`, `My Company Brain`, `KPMG Shanghai`, and `AI Mathematical Animation Workbench`.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx playwright test tests/e2e/routes.spec.ts --grep "published résumé"`

Expected: FAIL because the résumé collection has no entries and the pages still render empty states.

- [ ] **Step 3: Continue to Task 2**

The content entries are the minimal production change that will make the browser behavior pass.

### Task 2: Add bilingual résumé entries

**Files:**
- Create: `src/content/resume/zh.md`
- Create: `src/content/resume/en.md`

**Interfaces:**
- Consumes: the existing `resume` content schema (`localizedBase`, `order`, optional `pdfPath`).
- Produces: one published `zh` entry and one matching `en` entry with `translationKey: resume` and `order: 1`.

- [ ] **Step 1: Add Chinese Markdown**

Add the supplied KPMG role followed by the four supplied projects, keeping their dates, bullet structure, metrics, and technology names.

- [ ] **Step 2: Add English Markdown**

Translate the same hierarchy and factual content without inventing missing profile, education, contact, place, or PDF data.

- [ ] **Step 3: Format and validate the content**

Run: `npm run format && npm run check`

Expected: both commands exit with code 0 and Astro accepts both collection entries.

- [ ] **Step 4: Run the focused browser test**

Run: `npx playwright test tests/e2e/routes.spec.ts --grep "published résumé"`

Expected: PASS in Chromium for both locales.

### Task 3: Verify, review, and publish

**Files:**
- Modify only if visual inspection requires it: `src/pages/resume.astro`, `src/pages/en/resume.astro`, or `src/styles/prose.css`

**Interfaces:**
- Consumes: built bilingual résumé pages.
- Produces: responsive, accessible production pages on GitHub Pages.

- [ ] **Step 1: Run full validation**

Run: `npm run validate`

Expected: formatting, Astro checks, content verification, unit tests, build, link checks, and Playwright tests all pass.

- [ ] **Step 2: Inspect desktop and mobile layouts**

Open `/resume/` and `/en/resume/` locally at desktop and mobile widths. Confirm headings, dates, bullets, long technology names, and metrics wrap without clipping or horizontal overflow.

- [ ] **Step 3: Commit and push**

Stage only this plan, the two résumé entries, the focused test, and any justified style adjustments. Commit with `feat: publish bilingual resume experience`, then push the current branch to `origin/main` as established for this personal-site repository.

- [ ] **Step 4: Verify deployment**

Confirm the GitHub Pages workflow succeeds and both production résumé routes show the published content.
