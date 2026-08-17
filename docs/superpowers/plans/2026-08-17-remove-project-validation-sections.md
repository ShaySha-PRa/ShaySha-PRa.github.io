# Remove Project Validation Sections Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the validation-status presentation and evidence CTA from all six bilingual project Case Studies without changing their architecture, evidence images, limitations, or project status.

**Architecture:** Simplify the shared `caseStudy` interface from `{ category, scope, evidenceTarget }` to `{ category, scope }`. The shared project layout renders only the GitHub CTA, while each localized Markdown file keeps the narrative through “Limitations and next steps” but no longer renders a validation section.

**Tech Stack:** Astro, TypeScript, Zod, Markdown content collections, Vitest, Playwright.

## Global Constraints

- Apply to all six projects in Chinese and English.
- Keep the hero project status, architecture, workflow, technical decisions, screenshots, limitations, and next steps unchanged.
- Remove the evidence CTA, `evidenceTarget`, `#validation`, and unused validation-only styles.
- Add no runtime dependencies or APIs.
- Publish directly to the existing GitHub Pages `main` branch after full validation.

---

## Task 1: Remove the Validation Presentation and Interface

**Files:**

- Modify: `tests/unit/schema.test.ts`
- Modify: `tests/unit/project-case-studies.test.ts`
- Modify: `tests/e2e/projects.spec.ts`
- Modify: `src/lib/schema.ts`
- Modify: `src/layouts/ProjectLayout.astro`
- Modify: `src/styles/prose.css`
- Modify: `src/content/projects/{zh,en}/*.md`

**Interfaces:**

- Produces: `caseStudySchema = z.object({ category, scope })`.
- Produces: Case Study hero actions containing exactly one GitHub repository link.
- Produces: twelve localized project bodies with no `#validation` section or validation-status heading.

- [ ] **Step 1: Write the failing schema and content contracts**

Replace the schema test with:

```ts
it('accepts a complete case study summary without a validation target', () => {
  expect(
    caseStudySchema.safeParse({
      category: 'Enterprise Knowledge Platform / RAG + Agent',
      scope: '3 knowledge paths',
    }).success,
  ).toBe(true);
  expect(
    caseStudySchema.safeParse({
      category: 'Enterprise Knowledge Platform / RAG + Agent',
      scope: '3 knowledge paths',
      evidenceTarget: '#validation',
    }).success,
  ).toBe(false);
});
```

In `project-case-studies.test.ts`, assert for both locales:

```ts
expect(document.data.caseStudy).not.toHaveProperty('evidenceTarget');
expect(document.content).not.toContain('id="validation"');
expect(document.content).not.toMatch(/当前验证状态|Current validation status/);
expect(document.content).toContain('限制与下一步'); // zh
expect(document.content).toContain('Limitations and next steps'); // en
```

- [ ] **Step 2: Write the failing bilingual E2E contract**

For My Company Brain and the five project route loops, replace validation visibility assertions with:

```ts
await expect(page.locator('#validation')).toHaveCount(0);
await expect(
  page.getByRole('link', { name: /查看验证证据|View validation evidence/ }),
).toHaveCount(0);
await expect(page.locator('.project-detail__actions a')).toHaveCount(1);
await expect(page.getByRole('heading', { name: /限制与下一步|Limitations and next steps/ })).toBeVisible();
```

Update the My Company Brain heading list so it contains only workflow, architecture, technical decisions, and limitations.

- [ ] **Step 3: Run focused tests and observe RED**

```powershell
npm run test -- tests/unit/schema.test.ts tests/unit/project-case-studies.test.ts
npm run build
npx playwright test tests/e2e/projects.spec.ts --grep "My Company Brain|case study"
```

Expected: failures identify the existing `evidenceTarget`, validation sections, and evidence CTA.

- [ ] **Step 4: Remove the shared interface and CTA**

Change `caseStudySchema` to:

```ts
export const caseStudySchema = z.object({
  category: z.string().min(1),
  scope: z.string().min(1),
});
```

Remove `labels.evidence` from both locales and remove this layout link:

```astro
<a href={caseStudy.evidenceTarget}>{labels.evidence} ↓</a>
```

Keep the repository link and its surrounding navigation.

- [ ] **Step 5: Remove localized sections and dead styling**

In all twelve project Markdown files:

- remove `evidenceTarget: '#validation'`;
- delete the complete `<section id="validation" ...>...</section>` block;
- leave the following limitations heading and content intact.

Delete only this unused rule from `prose.css`:

```css
.prose .project-validation {
  max-width: 100%;
  overflow-x: auto;
  scroll-margin-top: 2rem;
}
```

- [ ] **Step 6: Verify GREEN and commit**

```powershell
npx prettier --write src/lib/schema.ts src/layouts/ProjectLayout.astro src/styles/prose.css src/content/projects tests/unit/schema.test.ts tests/unit/project-case-studies.test.ts tests/e2e/projects.spec.ts
npm run test -- tests/unit/schema.test.ts tests/unit/project-case-studies.test.ts
npm run build
npx playwright test tests/e2e/projects.spec.ts
git diff --check
git add src tests
git commit -m "feat: remove project validation sections"
```

---

## Task 2: Full QA and Production Publication

**Files:**

- Modify only if QA exposes a regression: `tests/e2e/*.spec.ts`, `src/**/*`

**Interfaces:**

- Consumes: the validation-free Case Study contract from Task 1.
- Produces: published GitHub Pages routes with one repository CTA and no validation section.

- [ ] **Step 1: Run the full local gate**

```powershell
npm run validate
git status -sb
git diff --check origin/main..HEAD
```

Expected: format, Astro check, unit tests, 27-page build, link scan, and desktop/mobile E2E all pass.

- [ ] **Step 2: Audit the removal scope**

```powershell
rg -n '当前验证状态|Current validation status|id="validation"|#validation|evidenceTarget|查看验证证据|View validation evidence' src tests
```

Expected: no matches.

- [ ] **Step 3: Push directly to main**

```powershell
git push origin HEAD:main
git fetch origin main
git rev-parse HEAD
git rev-parse origin/main
```

Expected: local HEAD equals `origin/main`.

- [ ] **Step 4: Verify GitHub Actions and production**

Confirm the new-sha Validate and Deploy GitHub Pages workflows succeed, including production Lighthouse. Check all twelve bilingual project routes and assert:

```text
#validation count = 0
validation evidence link count = 0
.project-detail__actions a count = 1
architecture image loaded = true
project-evidence count = 2 for the five remaining projects
limitations heading visible = true
```

- [ ] **Step 5: Record final status**

Report the final commit, local validation counts, Actions run IDs, production URL, and the non-blocking existing warnings only.
