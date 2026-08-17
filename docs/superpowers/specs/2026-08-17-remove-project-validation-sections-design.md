# Remove Project Validation Sections — Design

## Goal

Remove the recruiter-facing validation-status presentation from every project Case Study. The project pages should read as completed portfolio narratives rather than unfinished acceptance reports, while retaining honest limitations and next steps.

## Scope

Apply the change to all six projects in both Chinese and English:

- My Company Brain
- GraphRAGAgent
- Agent Teams Project
- Manim Project
- SQLAgent
- ITA-Maskit

For all twelve localized pages:

- delete the complete `#validation` section;
- remove the `evidenceTarget` frontmatter field;
- keep the existing project status in the hero;
- keep architecture, user flow, technical decisions, evidence images, limitations, and next steps unchanged.

## Shared Interface Changes

- Remove the “查看验证证据 / View validation evidence” action from `ProjectLayout.astro`.
- Keep the GitHub repository action as the sole Case Study CTA.
- Remove `evidenceTarget` from `caseStudySchema`; `caseStudy` retains only `category` and `scope`.
- Remove `.project-validation` styling after confirming it has no remaining consumers.

## Test Changes

Use test-first implementation:

1. Update unit and E2E contracts to require no `evidenceTarget`, no `#validation`, no validation-status headings, and no evidence CTA across all bilingual project routes.
2. Run the focused tests and observe failure against the current implementation.
3. Remove production content, layout, schema, and unused styles.
4. Run focused tests, then full `npm run validate`.
5. Confirm all twelve production routes have only the repository CTA and still expose architecture, evidence images, and limitations.

## Publishing

Commit the focused removal, push directly to the existing `main` branch, and verify Validate, Pages Deploy, production Lighthouse, and representative Chinese/English project routes.

## Non-goals

- Do not change project completion statuses.
- Do not remove limitations or next steps.
- Do not alter architecture diagrams, screenshots, technical decisions, or reproduced-result wording outside the deleted sections.
- Do not add new dependencies or runtime APIs.
