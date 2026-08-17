# My Company Brain Architecture Diagram Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing simplified My Company Brain SVG with the approved four-layer, no-port architecture map and verify that it remains accessible, readable, and contained on desktop and mobile.

**Architecture:** Keep the diagram as one shared, English-only static SVG referenced by both localized Markdown pages. Encode the approved information hierarchy directly in the SVG, protect it with a Node/Vitest asset-contract test, and extend the existing Playwright case-study coverage to verify the intrinsic canvas and mobile scroller behavior.

**Tech Stack:** SVG, Astro content pages, Vitest, Playwright, Prettier, GitHub Actions, GitHub Pages.

## Global Constraints

- Follow `docs/superpowers/specs/2026-08-17-my-company-brain-architecture-diagram-design.md` as the source of truth.
- Do not add ports, model-provider names, embedding details, fallback strategies, test counts, health claims, or production-capacity claims to the diagram.
- Keep `/api/platform/*`, `/api/agent/*`, the protected module boundary, all three knowledge paths, PostgreSQL's six logical databases, and Neo4j.
- Do not add runtime dependencies or replace the existing mobile architecture scroller.
- Preserve the localized page alt text and captioning already present in the Chinese and English project Markdown.
- Use the existing Editorial Lab palette: paper `#F4F0E8`, ink `#171717`, vermilion `#A63D2F`, sand `#C9BDA8`, muted text `#555555`.

---

## Task 1: Lock the approved diagram contract with failing tests

**Files:**

- Create: `tests/unit/architecture-diagram.test.ts`
- Modify: `tests/e2e/projects.spec.ts:65-122`
- Read: `public/projects/my-company-brain-architecture.svg`

- [ ] **Step 1: Add a static SVG contract test**

Create `tests/unit/architecture-diagram.test.ts` with the complete contract below:

```ts
import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';

const svg = readFileSync(
  new URL('../../public/projects/my-company-brain-architecture.svg', import.meta.url),
  'utf8',
);

it('describes the approved four-layer My Company Brain architecture', () => {
  expect(svg).toMatch(/viewBox="0 0 1400 820"/);
  expect(svg).toContain('<title id="title">My Company Brain system architecture</title>');
  expect(svg).toMatch(/<desc id="desc">[^<]{80,}<\/desc>/);

  for (const label of [
    '01 / EXPERIENCE',
    '02 / CONTROL PLANE',
    '03 / KNOWLEDGE PLANE',
    '04 / DATA PLANE',
    'BROWSER',
    'NEXT.JS WEB',
    'UNIFIED API',
    'AGENT GATEWAY',
    'PLATFORM DOMAIN',
    'NANO BRAIN',
    'TRADITIONAL RAG',
    'GRAPHRAG',
    'PROTECTED MODULE BOUNDARY',
    'POSTGRESQL · 6 LOGICAL DATABASES',
    'NEO4J',
    '/api/platform/*',
    '/api/agent/*',
  ]) {
    expect(svg).toContain(label);
  }
});

it('omits deployment and model implementation detail', () => {
  expect(svg).not.toMatch(/\b(?:3000|3001|5432|7474|7687|8000|8001|8002|8003)\b/);
  expect(svg).not.toMatch(/external model boundary|minimax|embedding|fallback/i);
});
```

- [ ] **Step 2: Extend the existing browser test with the final intrinsic canvas**

In the existing `My Company Brain case study exposes...` test, immediately after the SVG `src` assertion, add:

```ts
  const intrinsicSize = await architecture.evaluate((element) => {
    const image = element as HTMLImageElement;
    return {
      complete: image.complete,
      width: image.naturalWidth,
      height: image.naturalHeight,
    };
  });
  expect(intrinsicSize).toEqual({ complete: true, width: 1400, height: 820 });
```

- [ ] **Step 3: Run the focused tests and confirm the expected red state**

```powershell
npm run test -- tests/unit/architecture-diagram.test.ts
npm run build
npx playwright test tests/e2e/projects.spec.ts --project=desktop-chromium --grep "approved workflow"
```

Expected: the unit test fails because the current asset uses `1200 760` and lacks the approved labels; the E2E test fails because its intrinsic size is still `1200 × 760`.

- [ ] **Step 4: Commit the failing contract**

```powershell
git add tests/unit/architecture-diagram.test.ts tests/e2e/projects.spec.ts
git commit -m "test: define architecture diagram contract"
```

---

## Task 2: Redraw the production SVG as the approved layered system map

**Files:**

- Modify: `public/projects/my-company-brain-architecture.svg:1-30`
- Reference: `docs/superpowers/specs/2026-08-17-my-company-brain-architecture-diagram-design.md`

- [ ] **Step 1: Replace the canvas, metadata, reusable styles, and arrow markers**

Replace the current SVG rather than layering new artwork over it. Begin with this exact document shell and style vocabulary:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 820" role="img" aria-labelledby="title desc">
  <title id="title">My Company Brain system architecture</title>
  <desc id="desc">Four-layer architecture map showing the browser and Next.js experience, the Unified API, Agent Gateway and Platform Domain control plane, three protected knowledge paths, and their PostgreSQL and Neo4j data stores.</desc>
  <defs>
    <marker id="arrow-primary" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#A63D2F"/>
    </marker>
    <marker id="arrow-data" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#8A8174"/>
    </marker>
    <style>
      .layer-label { font: 700 13px Arial, sans-serif; letter-spacing: 2.4px; fill: #A63D2F; }
      .title { font: 48px Georgia, serif; fill: #171717; }
      .legend { font: 13px Arial, sans-serif; fill: #555555; }
      .node-title { font: 700 16px Arial, sans-serif; letter-spacing: 1px; fill: #171717; }
      .node-copy { font: 14px Arial, sans-serif; fill: #555555; }
      .mono { font: 13px Consolas, monospace; fill: #555555; }
      .card { fill: #FBF8F1; stroke: #171717; stroke-width: 1.5; }
      .module-card { fill: #FBF8F1; stroke: #A63D2F; stroke-width: 1.5; }
      .divider { stroke: #C9BDA8; stroke-width: 1; }
      .main-flow { fill: none; stroke: #A63D2F; stroke-width: 2.5; marker-end: url(#arrow-primary); }
      .protected-flow { fill: none; stroke: #A63D2F; stroke-width: 2; stroke-dasharray: 7 6; marker-end: url(#arrow-primary); }
      .data-flow { fill: none; stroke: #8A8174; stroke-width: 1.5; marker-end: url(#arrow-data); }
    </style>
  </defs>
  <rect width="1400" height="820" fill="#F4F0E8"/>
</svg>
```

- [ ] **Step 2: Build the four aligned bands using the approved content map**

Use these coordinates and copy exactly so alignment, density, and responsibility length stay consistent:

| Band | Label position | Cards |
|---|---:|---|
| Experience | `(64, 145)` | Browser `(90,170,190,72)`; Next.js Web `(390,165,360,82)` |
| Control Plane | `(64, 295)` | Unified API `(90,320,350,96)`; Agent Gateway `(525,320,350,96)`; Platform Domain `(960,320,350,96)` |
| Knowledge Plane | `(64, 510)` | Nano Brain `(90,540,380,105)`; Traditional RAG `(510,540,380,105)`; GraphRAG `(930,540,380,105)` |
| Data Plane | `(64, 705)` | PostgreSQL `(190,730,760,64)`; Neo4j `(1030,730,280,64)` |

Use one title and one concise responsibility line per service:

```text
BROWSER              Team member / administrator
NEXT.JS WEB          Workspace, global Q&A, knowledge, administration
UNIFIED API          Identity, platform routes, module proxy
AGENT GATEWAY        LangGraph, tools, SSE, checkpoints
PLATFORM DOMAIN      Scenes, tasks, audit, global retrieval
NANO BRAIN           Pages, facts, links, search / ask
TRADITIONAL RAG      Documents, tables, hybrid retrieval, RRF
GRAPHRAG             Entities, relations, graph search, governance
POSTGRESQL · 6 LOGICAL DATABASES
identity / core / agent / nano / traditional / graph
NEO4J                GraphRAG workspace
```

Draw horizontal sand dividers at `y=270`, `y=480`, and `y=680`. Keep at least 24 px between all text and card edges. Use Georgia only for the diagram title `System architecture`; use the layer-label style for the numbered band names.

- [ ] **Step 3: Add the compact legend and connector language**

Place the legend below the title. It must label these three line samples without icons:

```text
PRIMARY REQUEST      PROTECTED CALL      DATA OWNERSHIP
```

Draw only orthogonal paths:

- solid vermilion: Browser → Next.js Web; Next.js Web → Unified API with `/api/platform/*`; Next.js Web → Agent Gateway with `/api/agent/*`; Unified API → Platform Domain;
- dashed vermilion: the Agent Gateway and Unified API join a protected-call bus above the Knowledge Plane, then branch to Nano Brain, Traditional RAG, and GraphRAG;
- fine gray: Nano Brain, Traditional RAG, and GraphRAG → PostgreSQL; GraphRAG → Neo4j.

Place a sand-backed boundary label centered over the dashed bus:

```text
PROTECTED MODULE BOUNDARY · INTERNAL TOKEN · USER CONTEXT · RESOURCE FILTERS
```

Do not include any numeric ports or an external-model box.

- [ ] **Step 4: Format and run the focused tests to green**

```powershell
npx prettier --write public/projects/my-company-brain-architecture.svg tests/unit/architecture-diagram.test.ts tests/e2e/projects.spec.ts
npm run test -- tests/unit/architecture-diagram.test.ts
npm run build
npx playwright test tests/e2e/projects.spec.ts --project=desktop-chromium --grep "approved workflow"
```

Expected: both focused tests pass; the SVG reports `1400 × 820` and satisfies every required/forbidden-content assertion.

- [ ] **Step 5: Commit the production asset**

```powershell
git add public/projects/my-company-brain-architecture.svg
git commit -m "feat: redraw My Company Brain architecture"
```

---

## Task 3: Verify visual quality, mobile containment, and accessibility

**Files:**

- Verify: `public/projects/my-company-brain-architecture.svg`
- Verify: `src/styles/prose.css:76-98`
- Verify: `src/content/projects/zh/my-company-brain.md`
- Verify: `src/content/projects/en/my-company-brain.md`
- Modify only if a verified defect exists: `public/projects/my-company-brain-architecture.svg`

- [ ] **Step 1: Run both localized project pages through the existing desktop and mobile coverage**

```powershell
npm run build
npx playwright test tests/e2e/projects.spec.ts --project=desktop-chromium
npx playwright test tests/e2e/projects.spec.ts --project=mobile-chromium --grep "wide architecture"
```

Expected: the image loads in both locales; the mobile page has no horizontal overflow; the architecture scroller itself remains horizontally scrollable.

- [ ] **Step 2: Inspect the rendered diagram at desktop width**

Start the production preview:

```powershell
npm run preview
```

Open `/projects/my-company-brain/` at a desktop viewport and verify:

- the main request path reads left-to-right/top-to-bottom in under 30 seconds;
- all three knowledge modules have equal visual weight;
- arrowheads are visible and do not collide with cards or labels;
- no connector crosses node copy;
- the boundary label reads as a boundary, not a fourth service;
- body text remains readable at the case-study's normal content width;
- the diagram visually matches the surrounding paper/ink/vermilion Editorial Lab system.

- [ ] **Step 3: Inspect the mobile scroller at 390 px**

At a 390 px viewport, verify:

- the page itself does not scroll horizontally;
- the diagram can be intentionally panned inside its container;
- the left edge begins with the title and first layer rather than a clipped midpoint;
- panning exposes every module and both data stores;
- localized alt text and the existing caption remain present.

- [ ] **Step 4: Correct only observed SVG defects and repeat focused validation**

If inspection finds overlap, low contrast, clipping, or connector ambiguity, adjust coordinates/styles in the SVG without changing the approved content hierarchy. Then rerun:

```powershell
npx prettier --write public/projects/my-company-brain-architecture.svg
npm run test -- tests/unit/architecture-diagram.test.ts
npm run build
npx playwright test tests/e2e/projects.spec.ts
```

- [ ] **Step 5: Commit any visual-QA corrections**

If changes were required:

```powershell
git add public/projects/my-company-brain-architecture.svg
git commit -m "fix: refine architecture diagram readability"
```

If no changes were required, do not create an empty commit.

---

## Task 4: Run full validation and publish

**Files:**

- Verify: entire repository
- Verify after deploy: Chinese and English My Company Brain production routes

- [ ] **Step 1: Run the complete repository gate**

```powershell
npm run validate
```

Expected: formatting, Astro checks, content verification, unit tests, build, link checks, and the full Playwright suite all pass.

- [ ] **Step 2: Review the final diff for scope and forbidden detail**

```powershell
git status --short
git diff origin/main...HEAD -- public/projects/my-company-brain-architecture.svg tests/unit/architecture-diagram.test.ts tests/e2e/projects.spec.ts docs/superpowers/specs/2026-08-17-my-company-brain-architecture-diagram-design.md docs/superpowers/plans/2026-08-17-my-company-brain-architecture-diagram.md
```

Confirm there are no unrelated edits, no ports, no model boundary/provider detail, no placeholder text, and no duplicate architecture asset.

- [ ] **Step 3: Commit the implementation plan if it is still uncommitted**

```powershell
git add docs/superpowers/plans/2026-08-17-my-company-brain-architecture-diagram.md
git commit -m "docs: plan architecture diagram implementation"
```

Skip this commit if the plan is already committed.

- [ ] **Step 4: Push the reviewed branch to the production branch**

```powershell
git push origin HEAD:main
```

- [ ] **Step 5: Verify CI and the deployed pages**

Use GitHub Actions to confirm Validate, Pages Deploy, and production Lighthouse succeed for the pushed commit. Then verify both production routes:

```text
https://shaysha-pra.github.io/projects/my-company-brain/
https://shaysha-pra.github.io/en/projects/my-company-brain/
```

Confirm the new diagram is served, the intrinsic asset is `1400 × 820`, the mobile scroller remains contained, and the old simplified artwork is no longer cached after a hard reload.

---

## Final Acceptance Checklist

- [ ] Four numbered layers are immediately visible.
- [ ] Browser, Next.js Web, Unified API, Agent Gateway, and Platform Domain form a clear main path.
- [ ] `/api/platform/*` and `/api/agent/*` are present; ports are absent.
- [ ] The protected boundary communicates internal token, user context, and resource filters.
- [ ] Nano Brain, Traditional RAG, and GraphRAG are equal peers.
- [ ] PostgreSQL lists all six logical databases; Neo4j ownership is clear.
- [ ] No model provider, embedding, fallback, test-count, health, or production-capacity detail appears.
- [ ] SVG title/description and localized page alt/caption remain meaningful.
- [ ] Desktop and 390 px visual checks pass.
- [ ] `npm run validate` and production CI/deployment checks pass.
