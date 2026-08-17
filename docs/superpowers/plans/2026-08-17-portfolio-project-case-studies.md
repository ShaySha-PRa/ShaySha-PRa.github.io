# Portfolio Project Case Studies Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the five remaining portfolio projects into bilingual, recruiter-oriented Case Studies with authentic screenshots, compact architecture diagrams, independently reproduced evidence, and production verification.

**Architecture:** Reuse the existing optional `caseStudy` metadata and `ProjectLayout.astro` hero. Each project task independently reproduces the repository, adds a real cover plus two contextual screenshots, creates one shared English SVG, rewrites both localized Markdown files, and extends common contract/E2E coverage. A final task validates all ten routes and publishes the finished site.

**Tech Stack:** Astro 7, TypeScript, Markdown, SVG, Vitest, Playwright, Axe, GitHub CLI, Python/Node/Docker/WSL for source-project validation, GitHub Actions, GitHub Pages.

## Global Constraints

- Follow `docs/superpowers/specs/2026-08-17-portfolio-project-case-studies-design.md` as the source of truth.
- Keep all existing slugs, translation keys, repository URLs, project ordering, navigation, and the My Company Brain page unchanged.
- Chinese project titles are descriptive; English titles remain repository names.
- Every converted page must use `caseStudy` with `evidenceTarget: '#validation'`.
- Every project uses one real cover, exactly two contextual screenshots, one compact English-only SVG, a four-step flow, three technical decisions, a validation matrix, and limitations.
- Validation matrices contain only commands and representative flows executed successfully during this task. README-reported counts and unexecuted CI claims are excluded.
- Failures and unavailable paths appear only in limitations with their concrete blocking condition.
- Use MiniMax's official OpenAI-compatible endpoint `https://api.minimax.io/v1` and model `MiniMax-M3` for temporary reproduction configuration.
- Never place API keys or tokens in commands recorded in reports, `.env` files, source, screenshots, Git, or retained logs. Read only pre-injected `MINIMAX_API_KEY` and `MINERU_API_TOKEN` environment variables.
- Use Windows first and WSL when the repository requires Linux tooling or containers. Bind all local services to loopback.
- Do not commit or push changes to the five source repositories.
- Architecture diagrams contain no ports, model-provider names, gradients, shadows, icons, benchmark results, production claims, or exhaustive capability inventories.
- Context screenshots use localized alt text and captions, identify synthetic/scripted demo data, and remain local production assets.
- No new runtime dependency, client-side framework, lightbox, or backend is added.
- Use TDD for website behavior: write the project contract/E2E assertion, observe RED, then add content/assets/SVG and observe GREEN.
- After each source-project reproduction, remove secret-bearing processes and confirm the retained evidence report contains no credential values.

---

## Task 1: Shared Case Study Evidence Infrastructure

**Files:**

- Create: `tests/unit/project-case-study-style.test.ts`
- Modify: `src/styles/prose.css:76-98`
- Modify: `tests/e2e/projects.spec.ts:1-29`

**Interfaces:**

- Produces CSS class `.project-evidence` for contextual figures.
- Produces `expectArchitectureImage(page, accessibleName, src, expectedSize)` for all project E2E tests.
- Preserves all My Company Brain behavior.

- [ ] **Step 1: Write the failing contextual-figure style contract**

Create `tests/unit/project-case-study-style.test.ts`:

```ts
import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';

const styles = readFileSync(
  new URL('../../src/styles/prose.css', import.meta.url),
  'utf8',
);

it('styles contextual project evidence as a bordered responsive figure', () => {
  expect(styles).toMatch(/\.prose \.project-evidence\s*\{/);
  expect(styles).toMatch(
    /\.prose \.project-evidence img\s*\{[^}]*width:\s*100%;[^}]*height:\s*auto;/s,
  );
  expect(styles).toMatch(
    /\.prose \.project-evidence figcaption\s*\{[^}]*color:\s*var\(--muted\);/s,
  );
});
```

- [ ] **Step 2: Run the style contract and verify RED**

```powershell
npm run test -- tests/unit/project-case-study-style.test.ts
```

Expected: FAIL because `.project-evidence` is absent.

- [ ] **Step 3: Add the reusable evidence style**

Append to `src/styles/prose.css`:

```css
.prose .project-evidence {
  margin-inline: 0;
}

.prose .project-evidence img {
  display: block;
  width: 100%;
  height: auto;
  border: 1px solid var(--sand);
  background: var(--paper);
}

.prose .project-evidence figcaption {
  margin-top: 0.75rem;
  color: var(--muted);
  font-size: 0.88rem;
}
```

- [ ] **Step 4: Generalize the architecture E2E helper without changing behavior**

Change the helper signature to:

```ts
async function expectArchitectureImage(
  page: Page,
  accessibleName: string,
  src: string,
  expectedSize: { width: number; height: number },
) {
  const architecture = page.getByRole('img', { name: accessibleName });
  await expect(architecture).toBeVisible();
  await expect(architecture).toHaveAttribute('src', src);
  const intrinsicSize = await architecture.evaluate((element) => {
    const image = element as HTMLImageElement;
    return {
      complete: image.complete,
      width: image.naturalWidth,
      height: image.naturalHeight,
    };
  });
  expect(intrinsicSize).toEqual({ complete: true, ...expectedSize });
}
```

Update both My Company Brain calls with:

```ts
'/projects/my-company-brain-architecture.svg',
{ width: 1400, height: 820 },
```

- [ ] **Step 5: Verify shared infrastructure**

```powershell
npx prettier --write src/styles/prose.css tests/unit/project-case-study-style.test.ts tests/e2e/projects.spec.ts
npm run test -- tests/unit/project-case-study-style.test.ts
npm run build
npx playwright test tests/e2e/projects.spec.ts --grep "My Company Brain"
```

Expected: style test passes; existing My Company Brain tests remain green.

- [ ] **Step 6: Commit**

```powershell
git add src/styles/prose.css tests/unit/project-case-study-style.test.ts tests/e2e/projects.spec.ts
git commit -m "feat: add project evidence presentation"
```

---

## Task 2: GraphRAGAgent Case Study

**Files:**

- Create: `tests/unit/project-case-studies.test.ts`
- Modify: `tests/e2e/projects.spec.ts`
- Modify: `src/content/projects/zh/graphrag-agent.md`
- Modify: `src/content/projects/en/graphrag-agent.md`
- Replace: `src/assets/projects/graphrag-agent/cover.svg` with `cover.png`
- Create: `public/projects/graphrag-agent/graph.png`
- Create: `public/projects/graphrag-agent/chat.png`
- Create: `public/projects/graphrag-agent-architecture.svg`

**Interfaces:**

- Chinese title: `GraphRAG 知识探索工作台`.
- English title: `GraphRAGAgent`.
- Category/scope: `AI 知识系统` / `全栈 GraphRAG 工作台`; `AI Knowledge Systems` / `Full-stack GraphRAG workspace`.
- Diagram size: `1400 × 760`.

- [ ] **Step 1: Reproduce the repository without retaining secrets**

Clone `ShaySha-PRa/GraphRAGAgent` into the plan's ignored validation workspace. Record the exact source commit. Fail fast unless `MINIMAX_API_KEY` and `MINERU_API_TOKEN` exist in the process environment, but never print their values.

Use temporary environment mappings:

```text
DEEPSEEK_API_KEY ← MINIMAX_API_KEY
DEEPSEEK_BASE_URL = https://api.minimax.io/v1
MINERU_API_TOKEN ← MINERU_API_TOKEN
```

Run the backend's executable test command from its README/test entrypoint and the representative flow:

```text
one non-sensitive PDF → parse → index → graph retrieval → one follow-up question
```

If the repository hardcodes an incompatible model name and configuration alone cannot select `MiniMax-M3`, record the LLM portion as not reproduced; do not patch product logic and claim success.

Write a secret-free ignored report containing only source commit, environment, commands, successful outcomes, failures, and retained non-sensitive artifacts.

- [ ] **Step 2: Add GraphRAGAgent to the failing project contract**

Create `tests/unit/project-case-studies.test.ts` with a reusable `ProjectCase` table and a first GraphRAGAgent entry. Use `gray-matter`, `existsSync`, and `readFileSync` to assert:

```ts
{
  slug: 'graphrag-agent',
  zhTitle: 'GraphRAG 知识探索工作台',
  enTitle: 'GraphRAGAgent',
  architecture: 'graphrag-agent-architecture.svg',
  architectureLabels: [
    'REACT WORKSPACE',
    'FASTAPI',
    'INDEXING PIPELINE',
    'NETWORKX GRAPH',
    'CHROMA VECTOR INDEX',
    'QA AGENT',
  ],
  screenshots: ['graph.png', 'chat.png'],
}
```

For both locales assert `caseStudy.evidenceTarget === '#validation'`, four `data-project-flow` items, two `project-evidence` figures, the architecture path, and `id="validation"`. For the SVG assert `width="1400"`, `height="760"`, meaningful title/desc, all labels, and absence of ports/model-provider names.

Run and observe RED:

```powershell
npm run test -- tests/unit/project-case-studies.test.ts
```

- [ ] **Step 3: Add the failing bilingual E2E contract**

Update the Chinese `projectNames` array entry from `GraphRAGAgent` to `GraphRAG 知识探索工作台`. Remove the obsolete `standard project pages keep the existing metadata layout` test because the accepted end state converts every remaining page. Add a Chinese/English route loop asserting the approved title, category, scope, four localized workflow labels, two contextual figures, validation section, and architecture asset via the shared helper.

Run:

```powershell
npm run build
npx playwright test tests/e2e/projects.spec.ts --grep "GraphRAG"
```

Expected: FAIL against the old page.

- [ ] **Step 4: Import authentic product assets**

Download the exact source-repository images:

```text
docs/screenshots/dashboard.png → src/assets/projects/graphrag-agent/cover.png
docs/screenshots/graph.png     → public/projects/graphrag-agent/graph.png
docs/screenshots/chat.png      → public/projects/graphrag-agent/chat.png
```

Delete the obsolete placeholder `cover.svg` after confirming the new cover exists and opens.

- [ ] **Step 5: Create the compact architecture SVG**

Use `viewBox="0 0 1400 760"`, explicit `width="1400" height="760"`, and four bands:

```text
01 EXPERIENCE      BROWSER → REACT WORKSPACE
02 APPLICATION     FASTAPI → DOCUMENTS / GRAPH EXPLORER / Q&A
03 KNOWLEDGE       INDEXING PIPELINE → NETWORKX GRAPH + CHROMA VECTOR INDEX → QA AGENT
04 OUTPUT          GRAPH VIEW + ANSWER / CITED ENTITIES
```

Use solid vermilion for the request path, dashed vermilion for Agent retrieval calls, and gray for graph/vector ownership. Do not show DeepSeek, MiniMax, MinerU credentials, or ports.

- [ ] **Step 6: Rewrite both localized content files**

Follow the approved order. Insert exactly two contextual figures:

```html
<figure class="project-evidence">
  <img src="/projects/graphrag-agent/graph.png" alt="GraphRAGAgent D3 知识图谱探索界面" width="1600" height="1000" loading="lazy" />
  <figcaption>图谱视图展示实体、关系和邻居探索；画面来自项目演示数据。</figcaption>
</figure>
```

and the equivalent chat figure. Fill the validation matrix only from successful Task 2 Step 1 results. State authentication, multi-tenancy, mobile, and retrieval-quality boundaries in limitations.

- [ ] **Step 7: Verify GREEN and commit**

```powershell
npx prettier --write src/content/projects/zh/graphrag-agent.md src/content/projects/en/graphrag-agent.md tests/unit/project-case-studies.test.ts tests/e2e/projects.spec.ts
npm run test -- tests/unit/project-case-studies.test.ts
npm run build
npx playwright test tests/e2e/projects.spec.ts --grep "GraphRAG"
git diff --check
git add src/assets/projects/graphrag-agent public/projects/graphrag-agent public/projects/graphrag-agent-architecture.svg src/content/projects/zh/graphrag-agent.md src/content/projects/en/graphrag-agent.md tests/unit/project-case-studies.test.ts tests/e2e/projects.spec.ts
git commit -m "feat: turn GraphRAGAgent into a case study"
```

---

## Task 3: Agent Teams Case Study

**Files:**

- Modify: `tests/unit/project-case-studies.test.ts`
- Modify: `tests/e2e/projects.spec.ts`
- Modify: `src/content/projects/zh/agent-teams-project.md`
- Modify: `src/content/projects/en/agent-teams-project.md`
- Replace: `src/assets/projects/agent-teams-project/cover.svg` with `cover.png`
- Create: `public/projects/agent-teams-project/contracts.png`
- Create: `public/projects/agent-teams-project/upload.png`
- Create: `public/projects/agent-teams-project-architecture.svg`

**Interfaces:**

- Chinese title: `合同审核多智能体工作流`.
- English title: `Agent Teams Project`.
- Category/scope: `AI 工作流` / `合同审核 MVP`; `AI Workflow` / `Contract-review MVP`.
- Diagram size: `1400 × 760`.

- [ ] **Step 1: Reproduce repository and representative flow**

Clone `ShaySha-PRa/Agent_Teams_Project` at its current `master` commit into the ignored validation workspace. Configure only through environment:

```text
DEEPSEEK_API_KEY ← MINIMAX_API_KEY
DEEPSEEK_BASE_URL = https://api.minimax.io/v1
DEEPSEEK_MODEL = MiniMax-M3
```

Run the repository's executable backend tests and a synthetic contract flow:

```text
upload → extracted-field review → risk routing → valid human note → JSON report
```

Do not count the mock-risk fallback as model validation. Record successful results and concrete failures without secrets.

- [ ] **Step 2: Extend unit/E2E contracts and observe RED**

Add:

```ts
{
  slug: 'agent-teams-project',
  zhTitle: '合同审核多智能体工作流',
  enTitle: 'Agent Teams Project',
  architecture: 'agent-teams-project-architecture.svg',
  architectureLabels: [
    'REACT WORKSPACE',
    'FASTAPI',
    'FIELD EXTRACTION',
    'LANGGRAPH RISK ROUTING',
    'SQLITE REVIEW STATE',
    'HUMAN DECISION',
    'REPORT + SSE',
  ],
  screenshots: ['contracts.png', 'upload.png'],
}
```

Update the Chinese `projectNames` entry to `合同审核多智能体工作流`. Add bilingual E2E expectations for the four flows, two figures, and architecture. Run focused unit/build/E2E and confirm failures precede implementation.

- [ ] **Step 3: Import authentic assets**

```text
assets/screenshots/dashboard.png → src/assets/projects/agent-teams-project/cover.png
assets/screenshots/contracts.png → public/projects/agent-teams-project/contracts.png
assets/screenshots/upload.png    → public/projects/agent-teams-project/upload.png
```

If local reproduction produces a clearer review screen, it may replace `upload.png` only when its provenance and synthetic-data caption are recorded. Delete the placeholder cover after verification.

- [ ] **Step 4: Create architecture SVG**

Four bands:

```text
01 EXPERIENCE      BROWSER → REACT WORKSPACE
02 APPLICATION     FASTAPI → FIELD EXTRACTION
03 REVIEW WORKFLOW LANGGRAPH RISK ROUTING → HUMAN DECISION
04 STATE & OUTPUT  SQLITE REVIEW STATE → REPORT + SSE
```

Show extraction before LangGraph. Show SQLite as authoritative state. Use a distinct dashed path for interrupt/resume. Do not show a production OCR service, JWT, ports, or a legal-accuracy claim.

- [ ] **Step 5: Rewrite bilingual content**

Use the approved four-step flow, two figures, three decisions, and only independently reproduced validation rows. Limitations explicitly cover MVP status, simulated authentication, local text extraction, in-memory graph checkpointing, mock fallback, JSON report boundary, and legal disclaimer.

- [ ] **Step 6: Verify and commit**

```powershell
npx prettier --write src/content/projects/zh/agent-teams-project.md src/content/projects/en/agent-teams-project.md tests/unit/project-case-studies.test.ts tests/e2e/projects.spec.ts
npm run test -- tests/unit/project-case-studies.test.ts
npm run build
npx playwright test tests/e2e/projects.spec.ts --grep "Agent Teams|合同审核"
git diff --check
git add src/assets/projects/agent-teams-project public/projects/agent-teams-project public/projects/agent-teams-project-architecture.svg src/content/projects/zh/agent-teams-project.md src/content/projects/en/agent-teams-project.md tests/unit/project-case-studies.test.ts tests/e2e/projects.spec.ts
git commit -m "feat: turn Agent Teams into a case study"
```

---

## Task 4: Manim Project Case Study

**Files:**

- Modify: `tests/unit/project-case-studies.test.ts`
- Modify: `tests/e2e/projects.spec.ts`
- Modify: `src/content/projects/zh/manim-project.md`
- Modify: `src/content/projects/en/manim-project.md`
- Replace: `src/assets/projects/manim-project/cover.svg` with `cover.png`
- Create: `public/projects/manim-project/formula-derivation-demo.jpg`
- Create: `public/projects/manim-project/quality-result.png`
- Create: `public/projects/manim-project-architecture.svg`

**Interfaces:**

- Chinese title: `AI 数学动画生成工作台`.
- English title: `Manim Project`.
- Category/scope: `应用型 AI` / `安全媒体生成流水线`; `Applied AI` / `Secure media generation pipeline`.
- Diagram size: `1400 × 760`.

- [ ] **Step 1: Reproduce repository in WSL when required**

Clone `ShaySha-PRa/Manim_project` into the ignored validation workspace. Run the complete executable test suite in the repository's supported environment. Configure `DEEPSEEK_API_KEY` from the pre-injected MiniMax key only when configuration can select `MiniMax-M3` without changing product logic.

Execute one bounded formula-derivation flow:

```text
prompt → ContentPlan → code → preview → quality inspection → final artifact
```

Do not rerun the full golden set. Retain one secret-free quality screenshot and outcome summary.

- [ ] **Step 2: Extend contracts and observe RED**

Add:

```ts
{
  slug: 'manim-project',
  zhTitle: 'AI 数学动画生成工作台',
  enTitle: 'Manim Project',
  architecture: 'manim-project-architecture.svg',
  architectureLabels: [
    'NEXT.JS WORKBENCH',
    'FASTAPI + SQLITE',
    'REDIS JOB QUEUE',
    'HOST RUNNER',
    'ISOLATED MANIM CONTAINER',
    'PREVIEW / FINAL ARTIFACTS',
    'QUALITY REPORT',
  ],
  screenshots: ['formula-derivation-demo.jpg', 'quality-result.png'],
}
```

Update the Chinese `projectNames` entry to `AI 数学动画生成工作台`. Add bilingual E2E expectations and verify RED.

- [ ] **Step 3: Import and capture authentic assets**

```text
docs/assets/workbench-demo.png          → src/assets/projects/manim-project/cover.png
docs/assets/formula-derivation-demo.jpg → public/projects/manim-project/formula-derivation-demo.jpg
independent representative flow screen  → public/projects/manim-project/quality-result.png
```

The third asset must show a real locally reproduced preview, artifact, or quality screen and must contain no key, local username, absolute path, or sensitive log.

- [ ] **Step 4: Create architecture SVG**

Four bands:

```text
01 EXPERIENCE    BROWSER → NEXT.JS WORKBENCH
02 CONTROL PLANE FASTAPI + SQLITE → REDIS JOB QUEUE
03 EXECUTION     HOST RUNNER → ISOLATED MANIM CONTAINER
04 ARTIFACTS     PREVIEW / FINAL ARTIFACTS → QUALITY REPORT
```

Use a dashed boundary around untrusted execution and solid/gray arrows for job and artifact flows. Do not show provider, ports, historical benchmark numbers, or production deployment.

- [ ] **Step 5: Rewrite bilingual content**

Explain immutable versions, job-ID queue, default-deny execution, and deterministic quality checks. The validation matrix uses only this run. Limitations cover bounded math domains, local acceptance environment, no market/production validation, and non-guaranteed generation success.

- [ ] **Step 6: Verify and commit**

```powershell
npx prettier --write src/content/projects/zh/manim-project.md src/content/projects/en/manim-project.md tests/unit/project-case-studies.test.ts tests/e2e/projects.spec.ts
npm run test -- tests/unit/project-case-studies.test.ts
npm run build
npx playwright test tests/e2e/projects.spec.ts --grep "Manim|数学动画"
git diff --check
git add src/assets/projects/manim-project public/projects/manim-project public/projects/manim-project-architecture.svg src/content/projects/zh/manim-project.md src/content/projects/en/manim-project.md tests/unit/project-case-studies.test.ts tests/e2e/projects.spec.ts
git commit -m "feat: turn Manim Project into a case study"
```

---

## Task 5: SQLAgent Case Study

**Files:**

- Modify: `tests/unit/project-case-studies.test.ts`
- Modify: `tests/e2e/projects.spec.ts`
- Modify: `src/content/projects/zh/sql-agent.md`
- Modify: `src/content/projects/en/sql-agent.md`
- Replace: `src/assets/projects/sql-agent/cover.svg` with `cover.png`
- Create: `public/projects/sql-agent/query-result.png`
- Create: `public/projects/sql-agent/api-docs.png`
- Create: `public/projects/sql-agent-architecture.svg`

**Interfaces:**

- Chinese title: `NL2SQL 数据分析工作台`.
- English title: `SQLAgent`.
- Category/scope: `数据平台` / `全栈 NL2SQL 助手`; `Data Platform` / `Full-stack NL2SQL assistant`.
- Diagram size: `1400 × 760`.

- [ ] **Step 1: Reproduce the principal Vanna/LangChain track**

Clone `ShaySha-PRa/SQLAgent` into the ignored validation workspace. Do not treat `backend/csv_qa_project` as the principal product.

Use local MySQL, Milvus, and the repository's local embedding service. Configure:

```text
API_KEY ← MINIMAX_API_KEY
BASE_URL = https://api.minimax.io/v1
LLM_MODEL = MiniMax-M3
```

Run executable repository tests, then one synthetic-data flow:

```text
load DDL/docs/question-SQL examples → ask question → retrieve → generate/validate/execute SQL → table/chart/answer
```

Do not claim the direct raw-SQL endpoint is sandboxed. Record only successful observed behavior.

- [ ] **Step 2: Extend contracts and observe RED**

Add:

```ts
{
  slug: 'sql-agent',
  zhTitle: 'NL2SQL 数据分析工作台',
  enTitle: 'SQLAgent',
  architecture: 'sql-agent-architecture.svg',
  architectureLabels: [
    'REACT WORKSPACE',
    'FASTAPI',
    'NL2SQL AGENT',
    'DDL / DOCS / SQL EXAMPLES',
    'VECTOR STORE',
    'SQL VALIDATION + EXECUTION',
    'MYSQL',
    'SSE RESULTS',
  ],
  screenshots: ['query-result.png', 'api-docs.png'],
}
```

Update the Chinese `projectNames` entry to `NL2SQL 数据分析工作台`. Add bilingual E2E and verify RED.

- [ ] **Step 3: Import authentic assets**

```text
docs/images/home.png         → src/assets/projects/sql-agent/cover.png
docs/images/query-result.png → public/projects/sql-agent/query-result.png
docs/images/api-docs.png     → public/projects/sql-agent/api-docs.png
```

If a locally reproduced training-data screen is clearer than API docs, replace only the second context image and update the contract filename/captions together.

- [ ] **Step 4: Create architecture SVG**

Four bands:

```text
01 EXPERIENCE       BROWSER → REACT WORKSPACE
02 ORCHESTRATION    FASTAPI → NL2SQL AGENT
03 RETRIEVAL/QUERY  DDL / DOCS / SQL EXAMPLES → VECTOR STORE
                    SQL VALIDATION + EXECUTION → MYSQL
04 RESULTS          SSE RESULTS → TABLE / CHART / ANSWER
```

Keep the Vanna/LangChain track coherent. Exclude the CSV prototype, ports, provider names, and security/accuracy claims.

- [ ] **Step 5: Rewrite bilingual content**

Use the approved flow and three decisions. The validation matrix contains only independently run results. Limitations disclose synthetic data, permissive development CORS, incomplete SQL-sandbox semantics, global runtime state, separate CSV prototype, and no generalized NL2SQL accuracy.

- [ ] **Step 6: Verify and commit**

```powershell
npx prettier --write src/content/projects/zh/sql-agent.md src/content/projects/en/sql-agent.md tests/unit/project-case-studies.test.ts tests/e2e/projects.spec.ts
npm run test -- tests/unit/project-case-studies.test.ts
npm run build
npx playwright test tests/e2e/projects.spec.ts --grep "SQLAgent|NL2SQL"
git diff --check
git add src/assets/projects/sql-agent public/projects/sql-agent public/projects/sql-agent-architecture.svg src/content/projects/zh/sql-agent.md src/content/projects/en/sql-agent.md tests/unit/project-case-studies.test.ts tests/e2e/projects.spec.ts
git commit -m "feat: turn SQLAgent into a case study"
```

---

## Task 6: ITA-Maskit Case Study

**Files:**

- Modify: `tests/unit/project-case-studies.test.ts`
- Modify: `tests/e2e/projects.spec.ts`
- Modify: `src/content/projects/zh/ita-maskit.md`
- Modify: `src/content/projects/en/ita-maskit.md`
- Replace: `src/assets/projects/ita-maskit/cover.svg` with `cover.png`
- Create: `public/projects/ita-maskit/preview.png`
- Create: `public/projects/ita-maskit/rules.png`
- Create: `public/projects/ita-maskit-architecture.svg`

**Interfaces:**

- Chinese title: `本地数据脱敏工作台`.
- English title: `ITA-Maskit`.
- Category/scope: `数据隐私` / `CLI + Windows 桌面应用`; `Data Privacy` / `CLI + Windows desktop app`.
- Diagram size: `1400 × 760`.

- [ ] **Step 1: Reproduce local-first masking behavior**

Clone `ShaySha-PRa/ITA-Maskit` into the ignored validation workspace. Run its complete executable Python suite without enabling optional LLM rule generation.

Create a synthetic mixed-PII CSV and execute:

```text
load rules → preview → mask + deterministic pseudonymization → output → audit log
```

Verify preview counts agree with execution, repeated values receive consistent pseudonyms, and the input file remains unchanged. Run the repository's executable packaging/static checks when available; do not claim CI success if the current repository CI fails.

- [ ] **Step 2: Extend contracts and observe RED**

Add:

```ts
{
  slug: 'ita-maskit',
  zhTitle: '本地数据脱敏工作台',
  enTitle: 'ITA-Maskit',
  architecture: 'ita-maskit-architecture.svg',
  architectureLabels: [
    'CLI / WINDOWS GUI',
    'RULE LOADING + VALIDATION',
    'TABLE ENGINE',
    'TEXT ENGINE',
    'MASK / PSEUDONYMIZE',
    'OUTPUT + STATISTICS',
    'AUDIT LOG',
  ],
  screenshots: ['preview.png', 'rules.png'],
}
```

Update the Chinese `projectNames` entry to `本地数据脱敏工作台`. Add bilingual E2E and verify RED.

- [ ] **Step 3: Import authentic assets**

```text
assets/screenshots/main.png    → src/assets/projects/ita-maskit/cover.png
assets/screenshots/preview.png → public/projects/ita-maskit/preview.png
assets/screenshots/rules.png   → public/projects/ita-maskit/rules.png
```

Captions must state that repository screenshots use scripted demonstration data.

- [ ] **Step 4: Create architecture SVG**

Four bands:

```text
01 EXPERIENCE  CLI / WINDOWS GUI
02 CONTROL     RULE LOADING + VALIDATION → PREFLIGHT PREVIEW
03 PROCESSING  TABLE ENGINE + TEXT ENGINE → MASK / PSEUDONYMIZE
04 OUTPUT      OUTPUT + STATISTICS → AUDIT LOG
```

Show the user-supplied pepper as configuration entering pseudonymization, not as stored data. Exclude provider names, ports, encryption/compliance claims, and optional LLM rule generation from the main data path.

- [ ] **Step 5: Rewrite bilingual content**

Use the approved flow and three decisions. Matrix rows come only from Step 1. Limitations cover pseudonymization versus encryption, beta PDF/image behavior, optional service data boundary, Excel precision loss, and no certified-compliance claim.

- [ ] **Step 6: Verify and commit**

```powershell
npx prettier --write src/content/projects/zh/ita-maskit.md src/content/projects/en/ita-maskit.md tests/unit/project-case-studies.test.ts tests/e2e/projects.spec.ts
npm run test -- tests/unit/project-case-studies.test.ts
npm run build
npx playwright test tests/e2e/projects.spec.ts --grep "ITA-Maskit|数据脱敏"
git diff --check
git add src/assets/projects/ita-maskit public/projects/ita-maskit public/projects/ita-maskit-architecture.svg src/content/projects/zh/ita-maskit.md src/content/projects/en/ita-maskit.md tests/unit/project-case-studies.test.ts tests/e2e/projects.spec.ts
git commit -m "feat: turn ITA-Maskit into a case study"
```

---

## Task 7: Cross-Project Visual QA, Full Validation, and Publication

**Files:**

- Verify: all ten localized routes
- Verify: five cover images, ten contextual screenshots, five architecture SVGs
- Modify only for verified defects: `src/styles/prose.css`, affected content/SVG/test files

**Interfaces:**

- Consumes all five completed project Case Studies.
- Produces a validated, deployed GitHub Pages site.

- [ ] **Step 1: Run the complete repository gate**

```powershell
npm run validate
```

Expected: Prettier, Astro/content checks, unit tests, 27-page-or-newer build, link checks, and all Playwright projects pass.

- [ ] **Step 2: Inspect all ten pages at desktop width**

For every Chinese and English route verify:

- category/title/summary communicate the product immediately;
- scope/status/role and CTA order match My Company Brain;
- real cover is sharp and uncropped at the intended focal point;
- four-step flow is concise;
- exactly two contextual figures appear beside relevant text;
- architecture labels, connectors, arrowheads, and card copy are legible;
- validation language matches retained independent evidence;
- limitations are specific without repetitive defensive phrasing.

- [ ] **Step 3: Inspect all ten pages at 390 px**

Verify via browser runtime measurements:

```ts
document.documentElement.scrollWidth <= document.documentElement.clientWidth
```

For each architecture scroller verify:

```ts
scroller.scrollWidth > scroller.clientWidth
```

Pan to both ends and confirm every node/data store is reachable. Confirm contextual screenshots do not create page overflow.

- [ ] **Step 4: Run accessibility verification**

Run the complete accessibility E2E coverage and add the five Chinese project routes if the shared Axe route list does not already include them.

Expected: zero serious or critical Axe violations.

- [ ] **Step 5: Fix only observed defects and repeat focused checks**

Every defect fix must be paired with a focused regression assertion when it is machine-testable. Re-run affected unit/E2E tests after each correction, then rerun:

```powershell
npm run validate
git diff --check
git status --short
```

- [ ] **Step 6: Final content and secret audit**

Run repository scans that confirm:

- neither supplied secret value nor any `sk-` credential-shaped token appears in tracked files;
- no `.env`, reproduction clone, log, benchmark output, temporary screenshot, or intermediate SVG is tracked;
- all old placeholder covers are removed;
- all production assets are referenced;
- architecture SVGs contain no ports or provider names;
- validation matrices contain no `README reports` wording or unexecuted counts.

Do not print secret values as part of the scan command or output.

- [ ] **Step 7: Commit any final QA fixes**

If tracked corrections exist:

```powershell
git add -- src/styles/prose.css src/content/projects src/assets/projects public/projects tests/unit/project-case-study-style.test.ts tests/unit/project-case-studies.test.ts tests/e2e/projects.spec.ts
git commit -m "fix: polish project case study evidence"
```

Do not create an empty commit.

- [ ] **Step 8: Push and verify production**

```powershell
git push origin HEAD:main
```

Wait for Validate and Deploy GitHub Pages. Confirm production Lighthouse succeeds. Verify all ten project routes and representative image/SVG assets with hard reload/no-cache requests.

- [ ] **Step 9: Clear temporary validation material**

Stop all reproduction services, remove only the verified temporary validation workspace, and clear process-level secret variables. Preserve the website worktree and branch unless the user separately requests cleanup.

## Final Acceptance Checklist

- [ ] All five projects use the shared Case Study hero and body structure.
- [ ] Chinese titles are descriptive and English titles remain repository names.
- [ ] Five real raster covers replace placeholder SVGs.
- [ ] Ten contextual screenshots are local, captioned, and placed beside relevant narrative.
- [ ] Five English-only architecture SVGs are readable, accessible, no-port, and provider-neutral.
- [ ] Each project has four workflow steps, three decisions, a validation matrix, and limitations.
- [ ] Published validation claims come only from this task's successful reproduction.
- [ ] All ten routes pass desktop, 390 px, and accessibility checks.
- [ ] No secrets or validation scratch artifacts are tracked.
- [ ] Full local validation, GitHub Actions, Pages deployment, and production Lighthouse succeed.
