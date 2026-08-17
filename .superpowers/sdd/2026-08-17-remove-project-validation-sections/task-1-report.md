# Task 1 report: remove project validation sections

## RED evidence

Updated the schema, case-study content, and project E2E contracts before changing production code.

- `npm run test -- tests/unit/schema.test.ts tests/unit/project-case-studies.test.ts` failed with 6 failing tests (2 test files, 8 tests total): the schema still accepted `evidenceTarget`, and the five localized case studies still exposed `evidenceTarget` and `id="validation"`.
- `npm run build` passed at the RED checkpoint, confirming the failure was contract-specific rather than a baseline build error.
- `npx playwright test tests/e2e/projects.spec.ts --grep "My Company Brain|case study"` failed with 14 failures, 7 passes, and 1 skipped: the validation CTA and `#validation` sections were still rendered, and My Company Brain still included the validation heading.

## GREEN verification

- `npx prettier --write src/lib/schema.ts src/layouts/ProjectLayout.astro src/styles/prose.css src/content/projects tests/unit/schema.test.ts tests/unit/project-case-studies.test.ts tests/e2e/projects.spec.ts` — completed successfully.
- `npm run test -- tests/unit/schema.test.ts tests/unit/project-case-studies.test.ts` — 2 files passed, 8 tests passed.
- `npm run test` — 14 files passed, 31 tests passed.
- `npm run check` — 0 errors, 0 warnings, 38 pre-existing hints.
- `npm run build` — completed successfully; 27 pages built.
- `npx playwright test tests/e2e/projects.spec.ts` — 27 passed, 1 skipped.
- `git diff --check` — passed with no whitespace errors.
- Content scan confirmed no `evidenceTarget`, validation section, validation heading, or `project-validation` styling remains in `src/content/projects`.

## Changed files

- `src/lib/schema.ts` — case-study metadata now contains only `category` and `scope`; `.strict()` ensures obsolete validation metadata is rejected.
- `src/layouts/ProjectLayout.astro` — removed bilingual validation labels and CTA; the case-study action row retains only the repository link.
- `src/styles/prose.css` — removed unused `.project-validation` styling.
- `src/content/projects/{zh,en}/*.md` — removed `evidenceTarget` and the complete validation section from all twelve localized project bodies; preserved architecture, evidence images, limitations, and next steps. Standardized the two English headings that used “Known limitations and next steps” to the required “Limitations and next steps” contract.
- `tests/unit/schema.test.ts` — added the strict no-validation-target schema contract.
- `tests/unit/project-case-studies.test.ts` — added bilingual metadata, markup, heading, and limitations assertions.
- `tests/e2e/projects.spec.ts` — replaced validation visibility/CTA checks with absence checks, repository-link count checks, and limitations-heading checks.

## Commit

- `a022c08` — `feat: remove project validation sections`

## Self-review

- All six projects remain available in both locales, with hero status metadata unchanged.
- All twelve localized bodies retain architecture diagrams, two evidence images, and limitations/next-step prose.
- Architecture assets were not modified.
- The `.strict()` addition is intentional: Zod otherwise strips unknown keys, which would make the required `evidenceTarget` rejection assertion pass incorrectly.
- Build/check output contains existing repository warnings about the absent articles collection and deprecated Astro `z` APIs; neither introduces an error for this change.
