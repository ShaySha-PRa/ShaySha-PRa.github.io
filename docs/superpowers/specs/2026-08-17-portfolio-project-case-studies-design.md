# Portfolio Project Case Studies Redesign

## Objective

Upgrade the five remaining project pages to the same recruiter-oriented Case Study system used by My Company Brain, while preserving the Editorial Lab identity and adapting depth to the strength of each repository's evidence.

The redesign must let a recruiter understand the product, role, workflow, and evidence within roughly 30 seconds, while giving a technical interviewer enough architecture, implementation decisions, and verification boundaries to continue a deeper conversation.

## Scope

This redesign covers:

1. GraphRAGAgent
2. Agent Teams Project
3. Manim Project
4. SQLAgent
5. ITA-Maskit

My Company Brain remains the reference implementation and is not rewritten in this change.

Both Chinese and English routes are included. The Chinese pages use descriptive product names; the English pages retain the repository names.

## Shared Case Study System

Every project uses the same high-level structure:

1. category, title, and concise value proposition;
2. project scope, status, and role;
3. GitHub and validation-evidence calls to action;
4. one real product cover and the technology list;
5. a four-step user workflow;
6. two contextual product screenshots placed beside the relevant narrative;
7. one project-specific compact architecture diagram;
8. three key technical decisions;
9. an independently reproduced validation matrix;
10. limitations and next steps.

The depth of each section may vary with the repository evidence, but no project falls back to the old generic metadata layout.

### Project titles

| Project | Chinese title | English title |
|---|---|---|
| GraphRAGAgent | GraphRAG 知识探索工作台 | GraphRAGAgent |
| Agent Teams Project | 合同审核多智能体工作流 | Agent Teams Project |
| Manim Project | AI 数学动画生成工作台 | Manim Project |
| SQLAgent | NL2SQL 数据分析工作台 | SQLAgent |
| ITA-Maskit | 本地数据脱敏工作台 | ITA-Maskit |

Slugs, translation keys, repository URLs, project ordering, and existing navigation behavior remain unchanged.

### Case-study metadata

Each project fills the existing optional `caseStudy` structure:

| Project | Category | Scope |
|---|---|---|
| GraphRAGAgent | AI 知识系统 / AI Knowledge Systems | 全栈 GraphRAG 工作台 / Full-stack GraphRAG workspace |
| Agent Teams Project | AI 工作流 / AI Workflow | 合同审核 MVP / Contract-review MVP |
| Manim Project | 应用型 AI / Applied AI | 安全媒体生成流水线 / Secure media generation pipeline |
| SQLAgent | 数据平台 / Data Platform | 全栈 NL2SQL 助手 / Full-stack NL2SQL assistant |
| ITA-Maskit | 数据隐私 / Data Privacy | CLI + Windows 桌面应用 / CLI + Windows desktop app |

Every `evidenceTarget` points to the localized validation section at `#validation`.

## Visual Evidence System

### Image density

Each project uses:

- one repository-backed product screenshot as the hero cover;
- two contextual screenshots inside the Case Study body;
- no separate bottom gallery unless a future project explicitly requires it.

Screenshots are copied into the website repository so production pages do not depend on GitHub raw-image availability.

Repository screenshots that use synthetic or scripted demonstration data receive captions that identify them as demonstrations rather than production records.

### Screenshot selection

#### GraphRAGAgent

- Cover: `docs/screenshots/dashboard.png`
- Context: `docs/screenshots/graph.png`
- Context: `docs/screenshots/chat.png`

#### Agent Teams Project

- Cover: `assets/screenshots/dashboard.png`
- Context: `assets/screenshots/contracts.png`
- Context: `assets/screenshots/upload.png` or the most informative review screen available during local reproduction

#### Manim Project

- Cover: `docs/assets/workbench-demo.png`
- Context: `docs/assets/formula-derivation-demo.jpg`
- Context: a locally captured quality, preview, or artifact screen from the independently reproduced representative flow

#### SQLAgent

- Cover: `docs/images/home.png`
- Context: `docs/images/query-result.png`
- Context: the training-data or API screen that best explains the reproduced workflow; `docs/images/api-docs.png` is the fallback

#### ITA-Maskit

- Cover: `assets/screenshots/main.png`
- Context: `assets/screenshots/preview.png`
- Context: `assets/screenshots/rules.png`

### Contextual figure behavior

Add a reusable prose figure style for contextual evidence:

- full-width image inside the article measure;
- one-pixel sand border and paper background;
- localized caption explaining what the screenshot demonstrates;
- intrinsic dimensions to avoid layout shift;
- descriptive localized alt text;
- no decorative lightbox or new client-side dependency.

## Architecture Diagram System

Create one English-only SVG per project. Each asset is shared by Chinese and English pages and follows the existing My Company Brain diagram language:

- wide fixed viewBox with mobile horizontal exploration;
- paper background, ink text, dark vermilion primary flow, sand dividers;
- Georgia title, sans-serif node labels, monospace technical identifiers where useful;
- orthogonal connectors;
- no gradients, shadows, decorative icons, or deployment ports;
- no model-provider names;
- concise service responsibilities rather than exhaustive capability lists;
- meaningful SVG `title` and `desc`;
- localized page alt text and caption.

The diagrams must not claim production scale, security certification, model accuracy, or runtime results.

### GraphRAGAgent diagram

Primary path:

```text
Browser → React workspace → FastAPI
                         → indexing pipeline → knowledge graph + vector index
                         → QA Agent → answer and cited entities
```

Key boundaries:

- document parsing and entity extraction;
- NetworkX knowledge graph;
- Chroma vector index;
- graph exploration and QA as separate user surfaces.

### Agent Teams Project diagram

Primary path:

```text
Browser → React workspace → FastAPI
                         → document and field extraction
                         → LangGraph risk routing
                         → SQLite review state + HITL decision
                         → report + SSE status
```

Key boundaries:

- extraction occurs before the LangGraph workflow;
- SQLite is the authoritative review state;
- high-, medium-, and low-risk decisions have different routing;
- the report is presented as an auditable MVP output, not legal advice.

### Manim Project diagram

Primary path:

```text
Browser → Next.js → FastAPI + SQLite
                  → Redis job queue
                  → host Runner
                  → isolated Manim container
                  → preview/final artifacts + quality report
```

Key boundaries:

- immutable plan/code/artifact versions;
- job-ID-only queue;
- untrusted generated code enters the isolated render container;
- deterministic media and visual checks gate outputs.

### SQLAgent diagram

Primary path:

```text
Browser → React workspace → FastAPI
                         → NL2SQL Agent
                         → RAG context → vector store
                         → validation and execution → MySQL
                         → SSE steps, data, chart, answer
```

Key boundaries:

- DDL, business documentation, and historical question/SQL examples are separate retrieval sources;
- retrieval context and database execution remain distinct;
- the diagram describes the principal Vanna/LangChain track and does not mix in the separate CSV-agent prototype.

### ITA-Maskit diagram

Primary path:

```text
CLI / Windows GUI → rule loading and validation
                  → table engine / text engine
                  → mask or deterministic pseudonymization
                  → output files + statistics + audit log
```

Key boundaries:

- local input/output processing;
- versioned YAML rules;
- preflight preview and formal execution share the same decision logic;
- HMAC pseudonymization uses normalized values and a user-supplied pepper;
- optional rule-generation services are outside the main masking data path.

## Project Narratives

### GraphRAGAgent

User workflow:

1. upload a document;
2. build graph and vector indexes;
3. explore entities and relationships;
4. ask multi-turn questions and inspect cited entities.

Key decisions:

1. separate API, service, pipeline, and storage layers;
2. combine knowledge-graph exploration with vector retrieval;
3. expose graph and retrieval capabilities as QA Agent tools.

Limitations must state that production authentication, multi-tenancy, mobile completeness, and externally validated retrieval quality are not claimed.

### Agent Teams Project

User workflow:

1. upload a contract;
2. review extracted fields;
3. resolve risk-routed human decisions;
4. generate and inspect the report.

Key decisions:

1. encode risk routing and interruption in LangGraph;
2. keep review decisions and audit state in the database;
3. stream long-running workflow status through SSE.

Limitations must state that it is an MVP, authentication is simulated, extraction is not a production OCR service, checkpoints are not crash-safe across processes, the report is not legal advice, and no risk-detection accuracy is claimed.

### Manim Project

User workflow:

1. enter the lesson prompt, audience, duration, and assumptions;
2. review the structured ContentPlan;
3. generate code and submit a preview render;
4. inspect quality evidence and produce the final artifact.

Key decisions:

1. make plans, code, jobs, and artifacts immutable/versioned;
2. execute generated code in a default-deny isolated container;
3. gate outputs with deterministic media inspection and quality reports.

Limitations must state that the environment is local acceptance infrastructure, supports a bounded first set of mathematics tasks, has no production or market validation, and does not claim that every generated scene succeeds.

### SQLAgent

User workflow:

1. configure the database and retrieval/training material;
2. ask a natural-language question;
3. retrieve context, generate, validate, and execute SQL;
4. inspect streaming steps, table data, charts, and the answer.

Key decisions:

1. retrieve DDL, business documentation, and historical SQL separately;
2. combine the Agent tool path with an explicit database boundary;
3. expose observable intermediate and result events through SSE.

Limitations must state that the reproduced data is synthetic, the application is not a multi-tenant production security boundary, SQL validation is not a complete sandbox, the CSV prototype is separate, and no general NL2SQL accuracy is claimed.

### ITA-Maskit

User workflow:

1. select files, a rule set, and optional personnel data;
2. preview matches without writing output;
3. execute masking or deterministic pseudonymization locally;
4. inspect statistics, output paths, and the audit log.

Key decisions:

1. express masking rules as versioned data;
2. normalize before domain-separated HMAC pseudonymization;
3. reuse the same rule decision path for preview and execution.

Limitations must state that deterministic pseudonymization is not encryption, some PDF/image paths are beta or change layout, optional rule generation may send rule descriptions to a configured service, and the tool is not presented as a certified compliance solution.

## Independent Reproduction Protocol

### Secret handling

The supplied MiniMax and MinerU credentials are runtime-only secrets:

- inject them only into the process environment;
- never write them into `.env`, source, reports, screenshots, command output, shell history created by the task, or Git;
- redact exception messages and request traces before retaining evidence;
- clear temporary environments and secret-bearing processes after validation;
- recommend rotating both credentials after the work because they were pasted into the conversation.

### LLM configuration

Use the current official MiniMax OpenAI-compatible endpoint:

```text
https://api.minimax.io/v1
```

Use `MiniMax-M3` as the default model. Project-specific environment variables may be mapped to this endpoint in temporary runtime configuration.

A result counts as independently reproduced only when configuration changes are sufficient. If product logic must be modified to accommodate MiniMax, the original repository capability is not recorded as reproduced.

### Environment strategy

- Start with the native Windows environment.
- Use WSL when a repository's toolchain, shell scripts, containers, or Linux dependencies require it.
- Use isolated temporary clones or worktrees outside the website repository.
- Do not commit changes to the five source repositories.
- Reuse local Docker services where appropriate, but do not expose databases or application services beyond loopback during validation.

### Representative flows

#### GraphRAGAgent

Use one non-sensitive sample document and attempt:

```text
upload → parse → index → graph view → one multi-turn question
```

MinerU is enabled only for this document-processing path.

#### Agent Teams Project

Use one synthetic contract and attempt:

```text
upload → field review → risk routing → human decision → JSON report
```

The report result is an application artifact, not a legal conclusion.

#### Manim Project

Use one bounded formula-derivation task and attempt:

```text
prompt → ContentPlan → preview → quality inspection → final artifact
```

Do not rerun the full historical benchmark or all golden tasks.

#### SQLAgent

Use local synthetic MySQL data and attempt:

```text
load retrieval context → ask one question → generate and execute SQL → render table/chart/answer
```

#### ITA-Maskit

Use a synthetic mixed-PII CSV and attempt:

```text
load rules → preview → mask/pseudonymize → output → audit log
```

### Validation matrices

Only successful commands and representative flows appear in the validation matrices.

Every row identifies:

- what was executed;
- the environment;
- the observed outcome;
- a repository path or local artifact that supports the statement.

README-reported counts, historical benchmark claims, and unexecuted CI claims are excluded from the matrices. Important unsuccessful or unavailable paths appear in “Limitations and next steps” without being converted into success metrics.

## Data and Component Changes

### Content

Update ten localized project content files. All five projects receive `caseStudy` metadata and the shared Case Study body order.

### Assets

Replace five placeholder SVG covers with repository-backed raster screenshots. Add ten contextual screenshots and five architecture SVGs.

Retain only assets used by the final pages; do not keep intermediate downloads, temporary renders, duplicate screenshots, or reproduction logs in tracked production directories.

### Styling

Extend `src/styles/prose.css` with a reusable contextual evidence-figure style. Reuse the existing flow, architecture scroller, and validation-table styles.

No new client-side framework, lightbox, or runtime dependency is introduced.

### Layout and schema

The existing `caseStudy` schema and `ProjectLayout.astro` support the required hero structure. Schema or layout changes are allowed only if implementation reveals a concrete accessibility or localization need that cannot be handled through current fields; such a change must be tested and remain backward compatible with My Company Brain.

## Testing and Acceptance

### Independent repository validation

For each source repository:

- run the full test suites that are executable in the prepared Windows or WSL environment;
- execute the representative flow;
- retain a secret-free, ignored evidence summary until the website content is finalized;
- publish only independently observed successes.

### Website unit tests

Cover:

- all six projects now carry valid `caseStudy` metadata;
- Chinese and English titles match the approved naming policy;
- all five new architecture assets expose meaningful `title`, `desc`, and wide viewBoxes;
- required components and data boundaries are present;
- ports and model-provider names are absent;
- all referenced screenshot assets exist;
- validation sections use unique `#validation` targets.

### Website E2E tests

Cover Chinese and English routes for:

- Case Study hero order and evidence CTA;
- four workflow steps;
- cover and two contextual screenshots;
- architecture image loading and intrinsic size;
- validation matrix presence;
- localized alt text and captions;
- 390 px page-level overflow containment;
- architecture-scroller horizontal exploration where necessary;
- zero serious or critical Axe violations.

### Full acceptance

Run `npm run validate`, then manually inspect all ten project pages at desktop and 390 px.

After deployment:

- confirm GitHub Validate, Pages Deploy, and production Lighthouse succeed;
- verify the ten production routes;
- hard-reload representative image and SVG assets to confirm the new files are served.

## Out of Scope

- rewriting My Company Brain;
- changing project order or navigation;
- adding new product features to the five source repositories;
- publishing modifications to those repositories;
- full historical benchmark reruns or all Manim golden tasks;
- production deployment of the five source applications;
- claims about customer outcomes, production load, legal accuracy, compliance certification, or generalized model accuracy;
- exposing the supplied credentials in any tracked or retained artifact.

## Acceptance Summary

The redesign is complete when every project presents a consistent recruiter-first Case Study, uses authentic product evidence, communicates its own architecture and technical decisions, and distinguishes independently reproduced results from limitations without relying on README claims as verification.

