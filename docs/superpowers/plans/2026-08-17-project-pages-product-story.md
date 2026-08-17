# Project Pages Product Story Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite all six bilingual project detail pages so recruiters first understand what each product does, its core capabilities, and its project-specific highlights before reading the system architecture.

**Architecture:** Keep the existing Astro content model, `ProjectLayout`, media assets, and project metadata. Implement the new product-led story entirely in twelve localized Markdown files plus one responsive prose style, and lock the shared heading order, capability count, project-specific highlights, images, and CTA contract with Vitest and Playwright.

**Tech Stack:** Astro 7, TypeScript, Markdown content collections, CSS Grid, Vitest, Playwright.

## Global Constraints

- Apply the six-section order to all six projects in Chinese and English: project purpose, core capabilities, usage flow, project highlights, system architecture, project scope.
- Every page contains exactly six core-capability items and exactly three project-specific highlight headings.
- Highlight titles describe product capabilities or domain mechanisms, not FastAPI, React, Redis, SSE, protocols, or generic frontend/backend boundaries.
- Keep the existing project status, role, technology stack, repository URL, cover, architecture SVG, and existing evidence images unchanged.
- Keep exactly one hero action, pointing to the confirmed GitHub repository.
- Do not restore validation-status sections, `evidenceTarget`, `#validation`, or validation evidence CTAs.
- Do not add unverified performance, accuracy, production-readiness, or business-result claims.
- Compress the ending to `项目边界 / Project scope` in two or three sentences; do not describe missing API keys, reproduction attempts, or setup history.
- Add no runtime dependencies, backend interfaces, data migrations, or new client framework.
- Publish directly to the existing GitHub Pages `main` branch only after the complete validation gate passes.

---

## File Map

- `src/content/projects/zh/*.md`: Chinese product purpose, six capabilities, four-step flow, three highlights, architecture explanation, and concise scope.
- `src/content/projects/en/*.md`: Natural English counterpart with identical information hierarchy and claim boundaries.
- `src/styles/prose.css`: Responsive two-column `.project-capabilities` list, with a single-column mobile fallback.
- `tests/unit/project-case-studies.test.ts`: Source-level bilingual structure, content, asset, repository, and no-validation contracts.
- `tests/unit/project-case-study-style.test.ts`: Core-capability grid and mobile fallback contract.
- `tests/e2e/projects.spec.ts`: Rendered heading order, capability/highlight counts, project-specific copy, image loading, unique GitHub CTA, and mobile overflow behavior.

---

## Task 1: Establish the Product-Story Contract with My Company Brain

**Files:**

- Modify: `tests/unit/project-case-studies.test.ts`
- Modify: `tests/unit/project-case-study-style.test.ts`
- Modify: `tests/e2e/projects.spec.ts`
- Modify: `src/styles/prose.css`
- Modify: `src/content/projects/zh/my-company-brain.md`
- Modify: `src/content/projects/en/my-company-brain.md`

**Interfaces:**

- Produces: `<ul class="project-capabilities" data-project-capabilities>` with exactly six `<li>` children.
- Produces: level-two headings in the exact localized six-section order.
- Produces: exactly three `h3` highlight headings between `Project highlights` and `System architecture`.
- Produces: a reusable Playwright helper `expectProductStory(page, expected)` for later project tasks.

- [ ] **Step 1: Add failing source and style contracts**

In `tests/unit/project-case-studies.test.ts`, add helpers that extract the new structure:

```ts
const storyHeadings = {
  zh: [
    '项目解决什么',
    '核心功能',
    '使用流程',
    '项目亮点',
    '系统架构',
    '项目边界',
  ],
  en: [
    'What it solves',
    'Core capabilities',
    'How it works',
    'Project highlights',
    'System architecture',
    'Project scope',
  ],
} as const;

function getLevelTwoHeadings(content: string) {
  return [...content.matchAll(/^## (.+)$/gm)].map((match) => match[1]);
}

function getCapabilityItems(content: string) {
  const list = content.match(
    /<ul class="project-capabilities" data-project-capabilities>([\s\S]*?)<\/ul>/,
  )?.[1];
  return list?.match(/<li>[\s\S]*?<\/li>/g) ?? [];
}

function getHighlightHeadings(content: string, locale: 'zh' | 'en') {
  const start = locale === 'zh' ? '项目亮点' : 'Project highlights';
  const end = locale === 'zh' ? '系统架构' : 'System architecture';
  const block = content.match(
    new RegExp(`## ${start}([\\s\\S]*?)## ${end}`),
  )?.[1];
  return [...(block ?? '').matchAll(/^### (.+)$/gm)].map(
    (match) => match[1],
  );
}
```

Add a My Company Brain bilingual assertion with these exact highlight titles:

```ts
expect(getLevelTwoHeadings(zh.content)).toEqual(storyHeadings.zh);
expect(getLevelTwoHeadings(en.content)).toEqual(storyHeadings.en);
expect(getCapabilityItems(zh.content)).toHaveLength(6);
expect(getCapabilityItems(en.content)).toHaveLength(6);
expect(getHighlightHeadings(zh.content, 'zh')).toEqual([
  '让不同资料走适合自己的知识路径',
  '在一次问答中组合知识并保留来源',
  '把权限判断带到实际检索中',
]);
expect(getHighlightHeadings(en.content, 'en')).toEqual([
  'Match each knowledge type to the right path',
  'Combine knowledge while preserving sources',
  'Enforce access rules inside retrieval',
]);
```

In `tests/unit/project-case-study-style.test.ts`, assert:

```ts
expect(styles).toMatch(
  /\.prose \.project-capabilities\s*\{[^}]*display:\s*grid;[^}]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\);/s,
);
expect(styles).toMatch(
  /@media \(max-width:\s*48rem\)[\s\S]*\.prose \.project-capabilities\s*\{[^}]*grid-template-columns:\s*1fr;/s,
);
```

- [ ] **Step 2: Add the failing rendered-page contract**

In `tests/e2e/projects.spec.ts`, add:

```ts
type ProductStoryExpectation = {
  headings: string[];
  highlights: string[];
};

async function expectProductStory(
  page: Page,
  expected: ProductStoryExpectation,
) {
  await expect(page.locator('.prose > h2')).toHaveText(expected.headings);
  await expect(page.locator('[data-project-capabilities] > li')).toHaveCount(6);
  await expect(page.locator('.prose > h3')).toHaveText(expected.highlights);
}
```

Call it for both My Company Brain routes with the localized headings and highlight titles from Step 1. Also assert the removed generic copy stays absent:

```ts
await expect(
  page.getByRole('heading', {
    name: /统一 API 是治理边界|Unified API is the governance boundary/,
  }),
).toHaveCount(0);
```

- [ ] **Step 3: Run the new tests and observe RED**

```powershell
npm run test -- tests/unit/project-case-studies.test.ts tests/unit/project-case-study-style.test.ts
npm run build
npx playwright test tests/e2e/projects.spec.ts --grep "My Company Brain"
```

Expected: the source and E2E assertions fail because the old four-section story and old technical-decision headings remain; the style assertion fails because `.project-capabilities` does not exist.

- [ ] **Step 4: Add the responsive capability-list style**

Add to `src/styles/prose.css` before `.project-flow`:

```css
.prose .project-capabilities {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
  padding: 0;
  list-style: none;
}

.prose .project-capabilities li {
  min-width: 0;
  padding: 1rem;
  border: 1px solid var(--sand);
  background: color-mix(in srgb, var(--sand) 12%, transparent);
}
```

Extend the existing `@media (max-width: 48rem)` block:

```css
.prose .project-capabilities,
.prose .project-flow {
  grid-template-columns: 1fr;
}
```

- [ ] **Step 5: Rewrite both My Company Brain pages**

Use the exact section order from `storyHeadings`. Add six capabilities in each language:

```text
ZH: 管理知识源与可见范围；导入文档、表格与知识页面；创建业务场景与处理任务；跨知识路径发起连续问答；查看片段、页面、表格和图片来源；管理用户、知识资产与运行状态
EN: Manage knowledge sources and visibility; Import documents, tables, and knowledge pages; Create business scenarios and follow-up tasks; Ask follow-up questions across knowledge paths; Inspect passage, page, table, and image sources; Govern users, knowledge assets, and system state
```

Use the three approved highlight titles from Step 1. Each highlight paragraph must explain its product result and repository-backed mechanism:

- Nano Brain handles pages/facts/links, Traditional RAG handles document and table retrieval, and GraphRAG handles entities and relationships.
- Global Q&A can merge paths while returning passage/page/table/image sources.
- public/private/team authorization is rechecked at module query boundaries rather than only hidden in the UI.

Move the unchanged architecture figure and its technical explanation after the three highlights. Rename the final section to `项目边界 / Project scope` and compress it to the self-hosted scope plus the explicit exclusion of production HA, enterprise SSO, and large-scale load claims. Keep frontmatter, cover, status, technologies, architecture asset, and GitHub URL unchanged.

- [ ] **Step 6: Verify GREEN and commit**

```powershell
npx prettier --write src/content/projects/zh/my-company-brain.md src/content/projects/en/my-company-brain.md src/styles/prose.css tests/unit/project-case-studies.test.ts tests/unit/project-case-study-style.test.ts tests/e2e/projects.spec.ts
npm run test -- tests/unit/project-case-studies.test.ts tests/unit/project-case-study-style.test.ts
npm run build
npx playwright test tests/e2e/projects.spec.ts --grep "My Company Brain"
git diff --check
git add src/content/projects/zh/my-company-brain.md src/content/projects/en/my-company-brain.md src/styles/prose.css tests/unit/project-case-studies.test.ts tests/unit/project-case-study-style.test.ts tests/e2e/projects.spec.ts
git commit -m "feat: lead My Company Brain with product capabilities"
```

---

## Task 2: Rewrite GraphRAGAgent Around Knowledge Exploration

**Files:**

- Modify: `tests/unit/project-case-studies.test.ts`
- Modify: `tests/e2e/projects.spec.ts`
- Modify: `src/content/projects/zh/graphrag-agent.md`
- Modify: `src/content/projects/en/graphrag-agent.md`

**Interfaces:**

- Consumes: `getLevelTwoHeadings`, `getCapabilityItems`, `getHighlightHeadings`, and `expectProductStory` from Task 1.
- Produces: bilingual GraphRAGAgent pages following the shared six-section contract.

- [ ] **Step 1: Add failing GraphRAGAgent expectations**

Extend the source and E2E fixtures with:

```text
ZH highlights:
1. 从文档自动建立可探索图谱
2. 让关系检索与原文语义共同回答
3. 在图谱探索与多轮问答之间连续切换

EN highlights:
1. Turn documents into an explorable graph
2. Answer with relationships and source semantics
3. Move continuously between graph exploration and chat
```

Assert six capabilities and the common localized heading order. Add a negative assertion for `用 FastAPI 固定前后端边界 / Use FastAPI as the frontend boundary`.

- [ ] **Step 2: Run the focused tests and observe RED**

```powershell
npm run test -- tests/unit/project-case-studies.test.ts
npm run build
npx playwright test tests/e2e/projects.spec.ts --grep "GraphRAGAgent"
```

Expected: GraphRAGAgent fails the new heading, capability, and highlight expectations.

- [ ] **Step 3: Rewrite both GraphRAGAgent pages**

Add exactly these six capabilities in natural localized wording:

```text
ZH: 上传文档并跟踪索引进度；浏览实体关系图与节点详情；按名称和类型搜索实体；查询两个实体之间的关系路径；搜索关键词相关的局部子图；保存多轮问答并从引用节点返回图谱
EN: Upload documents and track indexing; Browse the entity graph and node details; Search entities by name and type; Find relationship paths between entities; Search keyword-related subgraphs; Keep multi-turn sessions and return from cited nodes to the graph
```

Explain the three highlights with the repository-backed flow: page assembly → LangExtract entity extraction → NetworkX global merge + Chroma indexing; QA tools for entity/neighbor/path/vector retrieval; shared nodes between D3 exploration, “Ask AI,” and cited chat entities. Move both evidence figures near the related feature/highlight, keep both files and captions unchanged, and place the unchanged architecture figure after highlights. End with a two-sentence local knowledge-exploration scope that does not claim multi-user governance.

- [ ] **Step 4: Verify GREEN and commit**

```powershell
npx prettier --write src/content/projects/zh/graphrag-agent.md src/content/projects/en/graphrag-agent.md tests/unit/project-case-studies.test.ts tests/e2e/projects.spec.ts
npm run test -- tests/unit/project-case-studies.test.ts
npm run build
npx playwright test tests/e2e/projects.spec.ts --grep "GraphRAGAgent"
git diff --check
git add src/content/projects/zh/graphrag-agent.md src/content/projects/en/graphrag-agent.md tests/unit/project-case-studies.test.ts tests/e2e/projects.spec.ts
git commit -m "feat: foreground GraphRAG exploration features"
```

---

## Task 3: Rewrite Agent Teams Around Risk-Routed Human Review

**Files:**

- Modify: `tests/unit/project-case-studies.test.ts`
- Modify: `tests/e2e/projects.spec.ts`
- Modify: `src/content/projects/zh/agent-teams-project.md`
- Modify: `src/content/projects/en/agent-teams-project.md`

**Interfaces:**

- Consumes: shared story helpers from Task 1.
- Produces: bilingual contract-review pages with risk routing and HITL as the product story.

- [ ] **Step 1: Add failing Agent Teams expectations**

Use these exact highlight titles:

```text
ZH: 让风险等级直接改变审核路径；在扫描风险前先核验合同事实；把人工决策做成可恢复的流程节点
EN: Let risk level change the review path; Verify contract facts before risk scanning; Make human decisions recoverable workflow nodes
```

Assert the common six headings, six capability items, three highlights, two unchanged evidence images, and the existing GitHub URL.

- [ ] **Step 2: Run focused tests and observe RED**

```powershell
npm run test -- tests/unit/project-case-studies.test.ts
npm run build
npx playwright test tests/e2e/projects.spec.ts --grep "Agent Teams"
```

Expected: the old four sections and technical-decision headings fail the new contract.

- [ ] **Step 3: Rewrite both Agent Teams pages**

Use six capabilities:

```text
ZH: 上传并解析 PDF/DOCX 合同；抽取并核验合同双方、金额、日期和管辖法律；扫描风险条款并显示依据与建议；按高中低风险进入不同审核路径；确认、编辑、驳回、撤销并恢复人工审核；汇总决定并导出审核报告
EN: Upload and parse PDF/DOCX contracts; Extract and verify parties, value, dates, and governing law; Scan clauses and show rationale and suggestions; Route high, medium, and low risks differently; Confirm, edit, reject, undo, and resume human review; Aggregate decisions into an exportable report
```

Explain high-risk itemized approval, medium-risk batch confirmation, and low-risk auto-pass; field verification before scanning; and note-gated idempotent decisions with undo/resume. Keep screenshots, architecture SVG, status, frontmatter, and repository unchanged. End with a concise decision-support scope that explicitly does not provide legal advice or accuracy guarantees.

- [ ] **Step 4: Verify GREEN and commit**

```powershell
npx prettier --write src/content/projects/zh/agent-teams-project.md src/content/projects/en/agent-teams-project.md tests/unit/project-case-studies.test.ts tests/e2e/projects.spec.ts
npm run test -- tests/unit/project-case-studies.test.ts
npm run build
npx playwright test tests/e2e/projects.spec.ts --grep "Agent Teams"
git diff --check
git add src/content/projects/zh/agent-teams-project.md src/content/projects/en/agent-teams-project.md tests/unit/project-case-studies.test.ts tests/e2e/projects.spec.ts
git commit -m "feat: present contract review as a routed workflow"
```

---

## Task 4: Rewrite Manim Project Around the Teaching-to-Video Workflow

**Files:**

- Modify: `tests/unit/project-case-studies.test.ts`
- Modify: `tests/e2e/projects.spec.ts`
- Modify: `src/content/projects/zh/manim-project.md`
- Modify: `src/content/projects/en/manim-project.md`

**Interfaces:**

- Consumes: shared story helpers from Task 1.
- Produces: bilingual Manim pages centered on structured teaching plans, versioned artifacts, and isolated rendering.

- [ ] **Step 1: Add failing Manim expectations**

Use these exact highlight titles:

```text
ZH: 先把教学意图变成可审阅计划；用版本链连接每次修改与产物；在隔离执行前拒绝不可信代码
EN: Turn teaching intent into a reviewable plan first; Connect every revision to its artifact; Reject untrusted code before isolated execution
```

Assert the shared six-section structure, six capabilities, three highlights, both existing video-frame images, and the unique GitHub link.

- [ ] **Step 2: Run focused tests and observe RED**

```powershell
npm run test -- tests/unit/project-case-studies.test.ts
npm run build
npx playwright test tests/e2e/projects.spec.ts --grep "Manim Project"
```

Expected: the old story fails the new structure and highlight assertions.

- [ ] **Step 3: Rewrite both Manim pages**

Use six capabilities:

```text
ZH: 输入教学目标、受众、时长与假设；生成并编辑结构化 ContentPlan；生成只读、版本化的 Manim CodeVersion；提交 Preview 和 Final 渲染；查看视频、缩略图与渲染日志；检查时长、帧率和严重视觉异常
EN: Enter learning goals, audience, duration, and assumptions; Generate and edit a structured ContentPlan; Create read-only versioned Manim CodeVersions; Submit Preview and Final renders; Inspect video, thumbnails, and render logs; Check duration, frame rate, and severe visual anomalies
```

Explain ContentPlan before code, the immutable Prompt → Plan → Code → Artifact chain, and the AST/API whitelist + compile/Scene preflight + isolated container + deterministic media checks. Preserve both extracted demonstration frames and their source-accurate captions. End with a human-review creative-tool scope and no guarantee of one-shot output for arbitrary mathematics.

- [ ] **Step 4: Verify GREEN and commit**

```powershell
npx prettier --write src/content/projects/zh/manim-project.md src/content/projects/en/manim-project.md tests/unit/project-case-studies.test.ts tests/e2e/projects.spec.ts
npm run test -- tests/unit/project-case-studies.test.ts
npm run build
npx playwright test tests/e2e/projects.spec.ts --grep "Manim Project"
git diff --check
git add src/content/projects/zh/manim-project.md src/content/projects/en/manim-project.md tests/unit/project-case-studies.test.ts tests/e2e/projects.spec.ts
git commit -m "feat: tell the Manim teaching-to-video story"
```

---

## Task 5: Rewrite SQLAgent Around Complete Analysis Delivery

**Files:**

- Modify: `tests/unit/project-case-studies.test.ts`
- Modify: `tests/e2e/projects.spec.ts`
- Modify: `src/content/projects/zh/sql-agent.md`
- Modify: `src/content/projects/en/sql-agent.md`

**Interfaces:**

- Consumes: shared story helpers from Task 1.
- Produces: bilingual SQLAgent pages centered on business context, observable query steps, and multi-format results.

- [ ] **Step 1: Add failing SQLAgent expectations**

Use these exact highlight titles:

```text
ZH: 用三类知识补足 SQL 语境；让查询过程可观察、可定位；一次交付 SQL、数据、图表与解读
EN: Ground SQL in three kinds of context; Make every query stage observable; Deliver SQL, data, charts, and interpretation together
```

Assert the common structure, six capabilities, three highlights, both existing screenshots, and the repository URL. Replace the old `Known limitations and next steps` expectation with `Project scope`.

- [ ] **Step 2: Run focused tests and observe RED**

```powershell
npm run test -- tests/unit/project-case-studies.test.ts
npm run build
npx playwright test tests/e2e/projects.spec.ts --grep "SQLAgent"
```

Expected: the old headings and technical decisions fail the new contract.

- [ ] **Step 3: Rewrite both SQLAgent pages**

Use six capabilities:

```text
ZH: 用自然语言查询业务数据库；管理 DDL、业务文档和历史 SQL 示例；保存多轮分析上下文；生成、查看、校验并执行 SQL；在结果表格中检查数据；自动生成图表与文字分析
EN: Query a business database in natural language; Manage DDL, business documentation, and historical SQL examples; Preserve multi-turn analysis context; Generate, inspect, validate, and execute SQL; Inspect data in a result table; Generate charts and written analysis automatically
```

Explain three-context retrieval, observable retrieval/generation/validation/execution/interpretation stages, and the combined SQL/table/chart/narrative output. Keep the query-result and API-documentation screenshots but describe the latter as the available query/training surface rather than a FastAPI achievement. End with the known-database assistant scope and state that database permissions, sandboxing, and human review remain external safeguards.

- [ ] **Step 4: Verify GREEN and commit**

```powershell
npx prettier --write src/content/projects/zh/sql-agent.md src/content/projects/en/sql-agent.md tests/unit/project-case-studies.test.ts tests/e2e/projects.spec.ts
npm run test -- tests/unit/project-case-studies.test.ts
npm run build
npx playwright test tests/e2e/projects.spec.ts --grep "SQLAgent"
git diff --check
git add src/content/projects/zh/sql-agent.md src/content/projects/en/sql-agent.md tests/unit/project-case-studies.test.ts tests/e2e/projects.spec.ts
git commit -m "feat: frame SQLAgent as an analysis workflow"
```

---

## Task 6: Rewrite ITA-Maskit Around Local Audit-Data Protection

**Files:**

- Modify: `tests/unit/project-case-studies.test.ts`
- Modify: `tests/e2e/projects.spec.ts`
- Modify: `src/content/projects/zh/ita-maskit.md`
- Modify: `src/content/projects/en/ita-maskit.md`

**Interfaces:**

- Consumes: shared story helpers from Task 1.
- Produces: bilingual ITA-Maskit pages centered on multi-format local processing, maintainable rules, and deterministic cross-file pseudonyms.

- [ ] **Step 1: Add failing ITA-Maskit expectations**

Use these exact highlight titles:

```text
ZH: 用双引擎覆盖表格与文档；把脱敏规则变成可维护的数据；保留跨文件关联而不暴露原值
EN: Cover tables and documents with two processing engines; Turn masking policy into maintainable data; Preserve cross-file joins without exposing source values
```

Assert the common structure, six capabilities, three highlights, both existing screenshots, and the repository URL. Replace the old `Known limitations and next steps` expectation with `Project scope`.

- [ ] **Step 2: Run focused tests and observe RED**

```powershell
npm run test -- tests/unit/project-case-studies.test.ts
npm run build
npx playwright test tests/e2e/projects.spec.ts --grep "ITA-Maskit"
```

Expected: the old headings and technical-decision section fail the new contract.

- [ ] **Step 3: Rewrite both ITA-Maskit pages**

Use six capabilities:

```text
ZH: 通过 CLI 或 Windows GUI 选择规则并批量处理；在本地处理表格、JSON、邮件、PDF 和 Word；正式写出前预览规则命中与样例变化；选择遮盖或确定性伪名化；使用人员清单补足姓名与员工标识匹配；查看统计、输出位置和版本化审计日志
EN: Select rules and batch-process files through the CLI or Windows GUI; Process tables, JSON, email, PDF, and Word locally; Preview rule matches and sample changes before writing output; Choose masking or deterministic pseudonymization; Use personnel lists to improve name and employee-ID matching; Inspect statistics, output locations, and versioned audit logs
```

Explain the column-based table engine versus full-text document engine, YAML rule/version separation, and normalized HMAC + domain-separated user pepper for stable cross-file aliases. Preserve the preview and rules screenshots. End with the statement that pseudonymization is not encryption and that image OCR and layout-preserving PDF masking remain beta.

- [ ] **Step 4: Verify GREEN and commit**

```powershell
npx prettier --write src/content/projects/zh/ita-maskit.md src/content/projects/en/ita-maskit.md tests/unit/project-case-studies.test.ts tests/e2e/projects.spec.ts
npm run test -- tests/unit/project-case-studies.test.ts
npm run build
npx playwright test tests/e2e/projects.spec.ts --grep "ITA-Maskit"
git diff --check
git add src/content/projects/zh/ita-maskit.md src/content/projects/en/ita-maskit.md tests/unit/project-case-studies.test.ts tests/e2e/projects.spec.ts
git commit -m "feat: foreground ITA-Maskit privacy workflows"
```

---

## Task 7: Consolidate the Six-Project Contract, Validate, and Publish

**Files:**

- Modify only if consolidation exposes a gap: `tests/unit/project-case-studies.test.ts`
- Modify only if consolidation exposes a gap: `tests/e2e/projects.spec.ts`
- Modify only if responsive QA exposes a regression: `src/styles/prose.css`

**Interfaces:**

- Consumes: all twelve localized product-story pages from Tasks 1–6.
- Produces: a production deployment where all twelve routes expose the six-section product-led story.

- [ ] **Step 1: Consolidate shared fixtures and negative contracts**

Ensure the source fixture covers all six slugs and both locales. For every localized document, assert:

```ts
expect(getLevelTwoHeadings(document.content)).toEqual(storyHeadings[locale]);
expect(getCapabilityItems(document.content)).toHaveLength(6);
expect(getHighlightHeadings(document.content, locale)).toHaveLength(3);
expect(document.content).not.toMatch(
  /三个关键技术决策|Three key technical decisions|关键技术决策|用 FastAPI 固定前后端边界|Use FastAPI as the frontend boundary|限制与下一步|Limitations and next steps|Known limitations and next steps/,
);
expect(document.content).not.toMatch(
  /当前验证状态|Current validation status|查看验证证据|View validation evidence|id="validation"|#validation/,
);
```

Keep the existing architecture label, image existence, evidence count, repository URL, and no-`evidenceTarget` assertions.

- [ ] **Step 2: Extend E2E to all twelve routes**

Call `expectProductStory` for every Chinese and English project fixture. For each route assert:

```ts
await expect(page.locator('[data-project-capabilities] > li')).toHaveCount(6);
await expect(page.locator('.prose > h3')).toHaveCount(3);
await expect(page.locator('.project-detail__actions a')).toHaveCount(1);
await expect(page.locator('.project-architecture img')).toBeVisible();
await expect(page.locator('#validation')).toHaveCount(0);
```

For the five non-My-Company-Brain projects, keep exactly two loaded `.project-evidence img` assertions. For both My Company Brain routes, keep the loaded cover assertion. In the mobile-only test, add the capability list layout check:

```ts
const columns = await page
  .locator('[data-project-capabilities]')
  .evaluate((element) => getComputedStyle(element).gridTemplateColumns);
expect(columns.trim().split(/\s+/)).toHaveLength(1);
```

- [ ] **Step 3: Run focused consolidation tests**

```powershell
npm run test -- tests/unit/project-case-studies.test.ts tests/unit/project-case-study-style.test.ts
npm run build
npx playwright test tests/e2e/projects.spec.ts
git diff --check
```

Expected: unit, build, all project E2E desktop/mobile cases, and whitespace checks pass.

- [ ] **Step 4: Run the complete local gate**

```powershell
npm run validate
git status -sb
git diff --check origin/main..HEAD
```

Expected: Prettier, Astro check, all unit tests, the 27-page build, link scan, and desktop/mobile E2E pass; only the repository's existing non-blocking Astro hints and empty-articles warning may remain.

- [ ] **Step 5: Audit copy and asset preservation**

```powershell
rg -n '三个关键技术决策|Three key technical decisions|关键技术决策|用 FastAPI 固定前后端边界|Use FastAPI as the frontend boundary|限制与下一步|Limitations and next steps|Known limitations and next steps|当前验证状态|Current validation status|查看验证证据|View validation evidence|id="validation"|#validation' src/content/projects
git diff --name-status 8c2a4866928358565619aa8f45f1ab2b9e47518d..HEAD
```

Expected: the copy scan returns no matches. The diff contains the design/plan documents, twelve project Markdown files, the prose style, and the two project test files; it contains no architecture SVG, cover, evidence image, schema, dependency, or backend change.

- [ ] **Step 6: Commit any consolidation-only changes**

If Steps 1–5 changed tracked files:

```powershell
git add tests/unit/project-case-studies.test.ts tests/e2e/projects.spec.ts src/styles/prose.css
git commit -m "test: lock product-led project stories"
```

If no tracked files changed, record that no consolidation commit was necessary.

- [ ] **Step 7: Push directly to main and verify workflow success**

```powershell
git push origin HEAD:main
git fetch origin main
git rev-parse HEAD
git rev-parse origin/main
gh run list --commit (git rev-parse HEAD) --limit 10 --json databaseId,workflowName,status,conclusion,headSha,url
```

Expected: local and remote SHAs match. Wait for the new-sha `Validate` and `Deploy GitHub Pages` runs with `gh run watch <run-id> --exit-status`; both must succeed, and the deploy run must include the production Lighthouse threshold step.

- [ ] **Step 8: Verify all twelve production routes**

Check these paths at `https://shaysha-pra.github.io`: both locale variants of `my-company-brain`, `graphrag-agent`, `agent-teams-project`, `manim-project`, `sql-agent`, and `ita-maskit`.

For every route verify HTTP 200, the six localized h2 headings in order, six capability items, three project-specific h3 headings, one GitHub CTA, a loaded architecture image, and zero validation UI. Also verify two loaded evidence images for the five non-My-Company-Brain projects and a loaded cover for My Company Brain. Record final SHA, validation counts, workflow run IDs, production URL, and the existing non-blocking warnings.
