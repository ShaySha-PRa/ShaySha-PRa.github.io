import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import matter from 'gray-matter';
import sharp from 'sharp';
import { expect, it } from 'vitest';

const root = resolve(import.meta.dirname, '../..');

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

function getCapabilityTexts(content: string) {
  return getCapabilityItems(content).map((item) =>
    item.replace(/^<li>|<\/li>$/g, '').trim(),
  );
}

function getHighlightHeadings(content: string, locale: 'zh' | 'en') {
  const start = locale === 'zh' ? '项目亮点' : 'Project highlights';
  const end = locale === 'zh' ? '系统架构' : 'System architecture';
  const block = content.match(
    new RegExp(`## ${start}([\\s\\S]*?)## ${end}`),
  )?.[1];
  return [...(block ?? '').matchAll(/^### (.+)$/gm)].map((match) => match[1]);
}

function getScope(content: string, locale: 'zh' | 'en') {
  const heading = locale === 'zh' ? '项目边界' : 'Project scope';
  return content
    .match(new RegExp(`## ${heading}\\n\\n([\\s\\S]*?)(?=\\n\\n## |$)`))?.[1]
    .trim();
}

const localizedProjectCases = [
  {
    slug: 'my-company-brain',
    repoUrl: 'https://github.com/ShaySha-PRa/my-company-brain',
    enLimitationsHeading: 'Project scope',
  },
  {
    slug: 'graphrag-agent',
    repoUrl: 'https://github.com/ShaySha-PRa/GraphRAGAgent',
    enLimitationsHeading: 'Project scope',
  },
  {
    slug: 'agent-teams-project',
    repoUrl: 'https://github.com/ShaySha-PRa/Agent_Teams_Project',
    enLimitationsHeading: 'Project scope',
  },
  {
    slug: 'manim-project',
    repoUrl: 'https://github.com/ShaySha-PRa/Manim_project',
    enLimitationsHeading: 'Project scope',
  },
  {
    slug: 'sql-agent',
    repoUrl: 'https://github.com/ShaySha-PRa/SQLAgent',
    enLimitationsHeading: 'Project scope',
  },
  {
    slug: 'ita-maskit',
    repoUrl: 'https://github.com/ShaySha-PRa/ITA-Maskit',
    enLimitationsHeading: 'Project scope',
  },
] as const;

const projectCases = [
  {
    slug: 'graphrag-agent',
    zhTitle: 'GraphRAG 知识探索工作台',
    enTitle: 'GraphRAGAgent',
    category: 'AI 知识系统',
    scope: '全栈 GraphRAG 工作台',
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
  },
  {
    slug: 'agent-teams-project',
    zhTitle: '合同审核多智能体工作流',
    enTitle: 'Agent Teams Project',
    category: 'AI 工作流',
    scope: '合同审核 MVP',
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
  },
  {
    slug: 'manim-project',
    zhTitle: 'Manim Project · 科研动画工作台',
    enTitle: 'Manim Project · Animation Agent Workbench',
    category: '科学可视化 / Agent + Compiler',
    scope: '双路径 Animation Agent 工作台',
    architecture: 'manim-project-architecture.svg',
    architectureLabels: [
      'NEXT.JS WORKBENCH',
      'INTENTSPEC',
      'ALLOWLISTED SCIENCE TOOLS',
      'TOOLRUN + PROVENANCE',
      'ANIMATIONIR 2.0',
      'CRITIC + IR REPAIR',
      'DETERMINISTIC COMPILER',
      'MANIM BACKEND',
      'WEB JSON BACKEND',
      'RENDER SANDBOX',
      'PREVIEW / FINAL + QUALITYREPORT',
    ],
    screenshots: ['formula-derivation-demo.jpg', 'quality-result.png'],
  },
  {
    slug: 'sql-agent',
    zhTitle: 'NL2SQL 数据分析工作台',
    enTitle: 'SQLAgent',
    category: '数据平台',
    scope: '全栈 NL2SQL 助手',
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
  },
  {
    slug: 'ita-maskit',
    zhTitle: '本地数据脱敏工作台',
    enTitle: 'ITA-Maskit',
    category: '数据隐私',
    scope: 'CLI + Windows 桌面应用',
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
  },
] as const;

for (const project of projectCases) {
  it(`${project.slug} has the approved case-study contract`, () => {
    const zhPath = resolve(root, `src/content/projects/zh/${project.slug}.md`);
    const enPath = resolve(root, `src/content/projects/en/${project.slug}.md`);
    const zh = matter(readFileSync(zhPath, 'utf8'));
    const en = matter(readFileSync(enPath, 'utf8'));

    expect(zh.data.title).toBe(project.zhTitle);
    expect(en.data.title).toBe(project.enTitle);
    expect(zh.data.caseStudy).toMatchObject({
      category: project.category,
      scope: project.scope,
    });
    expect(en.data.caseStudy).toMatchObject({
      category:
        project.slug === 'agent-teams-project'
          ? 'AI Workflow'
          : project.slug === 'manim-project'
            ? 'Scientific Visualization / Agent + Compiler'
            : project.slug === 'sql-agent'
              ? 'Data Platform'
              : project.slug === 'ita-maskit'
                ? 'Data Privacy'
                : 'AI Knowledge Systems',
      scope:
        project.slug === 'agent-teams-project'
          ? 'Contract-review MVP'
          : project.slug === 'manim-project'
            ? 'Dual-track Animation Agent workbench'
            : project.slug === 'sql-agent'
              ? 'Full-stack NL2SQL assistant'
              : project.slug === 'ita-maskit'
                ? 'CLI + Windows desktop app'
                : 'Full-stack GraphRAG workspace',
    });

    for (const [locale, document] of [
      ['zh', zh],
      ['en', en],
    ] as const) {
      expect(document.content.match(/data-project-flow/g)).toHaveLength(1);
      expect(document.content.match(/<li>[^<]+<\/li>/g)).toHaveLength(10);
      expect(document.content.match(/class="project-evidence"/g)).toHaveLength(
        2,
      );
      expect(document.content).toContain(
        `src="/projects/${project.slug}/${project.screenshots[0]}"`,
      );
      expect(document.content).toContain(
        `src="/projects/${project.slug}/${project.screenshots[1]}"`,
      );
      expect(document.content).toContain(
        `src="/projects/${project.architecture}"`,
      );
      expect(document.data.caseStudy).not.toHaveProperty('evidenceTarget');
      expect(document.content).not.toContain('id="validation"');
      expect(document.content).not.toMatch(
        /当前验证状态|Current validation status/,
      );
      expect(document.content).toContain(
        locale === 'zh' ? '项目边界' : 'Project scope',
      );
      expect(document.data.locale).toBe(locale);
    }

    expect(
      existsSync(
        resolve(
          root,
          `public/projects/${project.slug}/${project.screenshots[0]}`,
        ),
      ),
    ).toBe(true);
    expect(
      existsSync(
        resolve(
          root,
          `public/projects/${project.slug}/${project.screenshots[1]}`,
        ),
      ),
    ).toBe(true);
    expect(
      existsSync(resolve(root, `public/projects/${project.architecture}`)),
    ).toBe(true);

    const architecture = readFileSync(
      resolve(root, `public/projects/${project.architecture}`),
      'utf8',
    );
    expect(architecture).toContain('width="1400"');
    expect(architecture).toContain('height="760"');
    expect(architecture).toMatch(/<title[^>]*>[^<]+<\/title>/);
    expect(architecture).toMatch(/<desc[^>]*>[^<]+<\/desc>/);
    for (const label of project.architectureLabels) {
      expect(architecture).toContain(label);
    }
    if (project.slug === 'graphrag-agent') {
      expect(architecture).toContain('04 OUTPUT');
      expect(architecture).toContain('GRAPH VIEW + ANSWER / CITED ENTITIES');
      expect(architecture).toContain('GRAPH RETRIEVAL');
      expect(architecture).toContain('VECTOR RETRIEVAL');
      expect(architecture).toContain(
        'data-flow="documents-upload-to-indexing"',
      );
      expect(architecture).toContain('DOCUMENT UPLOAD → INDEX');
      expect(
        (architecture.match(/class="retrieval"/g) ?? []).length,
      ).toBeGreaterThanOrEqual(2);
    } else if (project.slug === 'agent-teams-project') {
      expect(architecture).toContain('01 EXPERIENCE');
      expect(architecture).toContain('02 APPLICATION');
      expect(architecture).toContain('03 REVIEW WORKFLOW');
      expect(architecture).toContain('04 STATE &amp; OUTPUT');
      expect(architecture).toContain('interrupt / resume');
      expect(architecture).toContain(
        'React Workspace → FastAPI → Field Extraction',
      );
      expect(architecture).toContain('data-flow="react-fastapi-fields"');
      expect(architecture).not.toMatch(
        /\b(?:OCR service|JWT|legal accuracy)\b/i,
      );
    } else if (project.slug === 'sql-agent') {
      expect(architecture).toContain('01 EXPERIENCE');
      expect(architecture).toContain('02 ORCHESTRATION');
      expect(architecture).toContain('03 RETRIEVAL/QUERY');
      expect(architecture).toContain('04 RESULTS');
      expect(architecture).toContain('REACT WORKSPACE');
      expect(architecture).toContain('DDL / DOCS / SQL EXAMPLES');
      expect(architecture).toContain('SQL VALIDATION + EXECUTION');
      expect(architecture).toContain('SSE RESULTS');
      expect(architecture).toContain('RETRIEVED CONTEXT');
      expect(architecture).toContain('GENERATED SQL');
      expect(architecture).toContain('data-flow="vector-to-agent"');
      expect(architecture).toContain('data-flow="agent-to-sql"');
      expect(architecture).not.toContain('data-flow="vector-to-sql"');
      expect(architecture).not.toMatch(
        /\b(?:MiniMax|MinerU|DeepSeek|\d{2,5}\s*ports?)\b/i,
      );
    } else if (project.slug === 'manim-project') {
      expect(architecture).toContain('01 EXPERIENCE');
      expect(architecture).toContain('02 AGENT + COMPUTE');
      expect(architecture).toContain('03 COMPILE + EXECUTE');
      expect(architecture).toContain('04 OUTPUT');
      expect(architecture).toContain('data-boundary="scientific-compute"');
      expect(architecture).toContain('data-boundary="render-sandbox"');
      for (const flow of [
        'workbench-to-intent',
        'intent-to-tools',
        'tools-to-ir',
        'ir-to-compiler',
        'compiler-to-manim',
        'compiler-to-web',
        'teaching-to-render',
        'render-to-output',
      ]) {
        expect(architecture).toContain(`data-flow="${flow}"`);
      }
      expect(architecture).not.toMatch(
        /\b(?:DeepSeek|OpenAI|MiniMax|\d{2,5}\s*ports?)\b/i,
      );
    } else {
      expect(architecture).toContain('01 EXPERIENCE');
      expect(architecture).toContain('02 CONTROL');
      expect(architecture).toContain('03 PROCESSING');
      expect(architecture).toContain('04 OUTPUT');
      expect(architecture).toContain('PREVIEW');
      expect(architecture).toContain('pepper');
      for (const flow of [
        'preview-to-table-engine',
        'preview-to-text-engine',
        'local-files-to-table-engine',
        'local-files-to-text-engine',
        'pepper-to-pseudonymize',
        'pseudonymize-to-output',
      ]) {
        expect(architecture).toContain(`data-flow="${flow}"`);
      }
      expect(architecture).not.toMatch(
        /\b(?:encryption|compliance|LLM rule generation)\b/i,
      );
    }
    expect(architecture).not.toMatch(
      /\b(?:DeepSeek|MiniMax|MinerU|\d{2,5}\s*ports?)\b/i,
    );
  });
}

it('My Company Brain leads with the bilingual product-story contract', () => {
  const zh = matter(
    readFileSync(
      resolve(root, 'src/content/projects/zh/my-company-brain.md'),
      'utf8',
    ),
  );
  const en = matter(
    readFileSync(
      resolve(root, 'src/content/projects/en/my-company-brain.md'),
      'utf8',
    ),
  );

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
});

it('GraphRAGAgent leads with the bilingual knowledge-exploration story', () => {
  const zh = matter(
    readFileSync(
      resolve(root, 'src/content/projects/zh/graphrag-agent.md'),
      'utf8',
    ),
  );
  const en = matter(
    readFileSync(
      resolve(root, 'src/content/projects/en/graphrag-agent.md'),
      'utf8',
    ),
  );

  expect(getLevelTwoHeadings(zh.content)).toEqual(storyHeadings.zh);
  expect(getLevelTwoHeadings(en.content)).toEqual(storyHeadings.en);
  expect(getCapabilityItems(zh.content)).toHaveLength(6);
  expect(getCapabilityItems(en.content)).toHaveLength(6);
  expect(getHighlightHeadings(zh.content, 'zh')).toEqual([
    '从文档自动建立可探索图谱',
    '让关系检索与原文语义共同回答',
    '在图谱探索与多轮问答之间连续切换',
  ]);
  expect(getHighlightHeadings(en.content, 'en')).toEqual([
    'Turn documents into an explorable graph',
    'Answer with relationships and source semantics',
    'Move continuously between graph exploration and chat',
  ]);
  expect(zh.content).not.toContain('用 FastAPI 固定前后端边界');
  expect(en.content).not.toContain('Use FastAPI as the frontend boundary');
});

it('Agent Teams leads with the bilingual risk-routed human-review story', () => {
  const zh = matter(
    readFileSync(
      resolve(root, 'src/content/projects/zh/agent-teams-project.md'),
      'utf8',
    ),
  );
  const en = matter(
    readFileSync(
      resolve(root, 'src/content/projects/en/agent-teams-project.md'),
      'utf8',
    ),
  );

  expect(getLevelTwoHeadings(zh.content)).toEqual(storyHeadings.zh);
  expect(getLevelTwoHeadings(en.content)).toEqual(storyHeadings.en);
  expect(getCapabilityItems(zh.content)).toHaveLength(6);
  expect(getCapabilityItems(en.content)).toHaveLength(6);
  expect(getHighlightHeadings(zh.content, 'zh')).toEqual([
    '让风险等级直接改变审核路径',
    '在扫描风险前先核验合同事实',
    '把人工决策做成可恢复的流程节点',
  ]);
  expect(getHighlightHeadings(en.content, 'en')).toEqual([
    'Let risk level change the review path',
    'Verify contract facts before risk scanning',
    'Make human decisions recoverable workflow nodes',
  ]);
  expect(zh.content.match(/class="project-evidence"/g)).toHaveLength(2);
  expect(en.content.match(/class="project-evidence"/g)).toHaveLength(2);
  expect(zh.data.repoUrl).toBe(
    'https://github.com/ShaySha-PRa/Agent_Teams_Project',
  );
  expect(en.data.repoUrl).toBe(
    'https://github.com/ShaySha-PRa/Agent_Teams_Project',
  );
});

it('Manim leads with the bilingual Animation Agent product story', () => {
  const zh = matter(
    readFileSync(
      resolve(root, 'src/content/projects/zh/manim-project.md'),
      'utf8',
    ),
  );
  const en = matter(
    readFileSync(
      resolve(root, 'src/content/projects/en/manim-project.md'),
      'utf8',
    ),
  );

  expect(getLevelTwoHeadings(zh.content)).toEqual(storyHeadings.zh);
  expect(getLevelTwoHeadings(en.content)).toEqual(storyHeadings.en);
  expect(getCapabilityItems(zh.content)).toHaveLength(6);
  expect(getCapabilityItems(en.content)).toHaveLength(6);
  expect(getHighlightHeadings(zh.content, 'zh')).toEqual([
    '让模型规划意图，而不是编写自由 Scene',
    '把科学数值和来源锁进 ToolRun',
    '用同一份 IR 连接双 Backend 与修复闭环',
  ]);
  expect(getHighlightHeadings(en.content, 'en')).toEqual([
    'Let the model plan intent instead of writing free-form Scenes',
    'Keep scientific values and provenance inside ToolRun',
    'Use one IR for two backends and a repair loop',
  ]);
  for (const document of [zh, en]) {
    expect(document.content).toContain(
      'src="/projects/manim-project/formula-derivation-demo.jpg"',
    );
    expect(document.content).toContain(
      'src="/projects/manim-project/quality-result.png"',
    );
    expect(document.data.repoUrl).toBe(
      'https://github.com/ShaySha-PRa/Manim_project',
    );
    expect(document.data.evidence.join(' ')).toMatch(/580.*1 skipped/i);
    expect(document.content).toContain('AnimationIR 2.0');
    expect(document.content).toContain('130');
  }
});

it('GraphRAG and Manim scopes stay concise and free of reproduction history', () => {
  const scopes = {
    'graphrag-agent': {
      zh: '这是一个结合图谱构建、关系检索和多轮问答的本地文档知识探索工作台。它不提供多用户协作、租户隔离或企业知识治理。',
      en: 'This project is a local-document knowledge exploration workbench combining graph construction, relationship search, and multi-turn Q&A. It does not provide multi-user collaboration, tenant isolation, or enterprise knowledge governance.',
    },
    'manim-project': {
      zh: '这是一个本地开发与验收工作台：科研路径只覆盖封闭的 Intent/工具目录，教学 ContentPlan 路径继续保留。P0/P1/P2 数字来自内部黄金集与实验室 harness，不代表外部科研用户研究或生产部署能力。',
      en: 'This remains a local development and acceptance workbench: the research path covers a closed intent/tool catalog, while the teaching ContentPlan path remains available. P0/P1/P2 figures come from internal gold sets and a lab harness, not an external researcher study or production-deployment claim.',
    },
  } as const;

  for (const [slug, expected] of Object.entries(scopes)) {
    for (const locale of ['zh', 'en'] as const) {
      const document = matter(
        readFileSync(
          resolve(root, `src/content/projects/${locale}/${slug}.md`),
          'utf8',
        ),
      );
      const scope = getScope(document.content, locale);
      expect(scope).toBe(expected[locale]);
      expect(scope).not.toMatch(
        locale === 'zh'
          ? /本轮|复现|依赖|配置|环境|端到端|预览|验证矩阵/u
          : /this run|reproduction|dependencies|configuration|environment|end-to-end|preview|validation matrix/iu,
      );
    }
  }
});

it('SQLAgent leads with the bilingual analysis-delivery product story', () => {
  const zh = matter(
    readFileSync(resolve(root, 'src/content/projects/zh/sql-agent.md'), 'utf8'),
  );
  const en = matter(
    readFileSync(resolve(root, 'src/content/projects/en/sql-agent.md'), 'utf8'),
  );

  expect(getLevelTwoHeadings(zh.content)).toEqual(storyHeadings.zh);
  expect(getLevelTwoHeadings(en.content)).toEqual(storyHeadings.en);
  expect(getCapabilityItems(zh.content)).toHaveLength(6);
  expect(getCapabilityItems(en.content)).toHaveLength(6);
  expect(getHighlightHeadings(zh.content, 'zh')).toEqual([
    '用三类知识补足 SQL 语境',
    '让查询过程可观察、可定位',
    '一次交付 SQL、数据、图表与解读',
  ]);
  expect(getHighlightHeadings(en.content, 'en')).toEqual([
    'Ground SQL in three kinds of context',
    'Make every query stage observable',
    'Deliver SQL, data, charts, and interpretation together',
  ]);
  for (const document of [zh, en]) {
    expect(document.content).toContain(
      'src="/projects/sql-agent/query-result.png"',
    );
    expect(document.content).toContain(
      'src="/projects/sql-agent/api-docs.png"',
    );
    expect(document.data.repoUrl).toBe(
      'https://github.com/ShaySha-PRa/SQLAgent',
    );
  }
});

it('ITA-Maskit leads with the bilingual local audit-data protection story', () => {
  const zh = matter(
    readFileSync(
      resolve(root, 'src/content/projects/zh/ita-maskit.md'),
      'utf8',
    ),
  );
  const en = matter(
    readFileSync(
      resolve(root, 'src/content/projects/en/ita-maskit.md'),
      'utf8',
    ),
  );

  expect(getLevelTwoHeadings(zh.content)).toEqual(storyHeadings.zh);
  expect(getLevelTwoHeadings(en.content)).toEqual(storyHeadings.en);
  expect(getCapabilityTexts(zh.content)).toEqual([
    '通过 CLI 或 Windows GUI 选择规则并批量处理',
    '在本地处理表格、JSON、邮件、PDF 和 Word',
    '正式写出前预览规则命中与样例变化',
    '选择遮盖或确定性伪名化',
    '使用人员清单补足姓名与员工标识匹配',
    '查看统计、输出位置和版本化审计日志',
  ]);
  expect(getCapabilityTexts(en.content)).toEqual([
    'Select rules and batch-process files through the CLI or Windows GUI',
    'Process tables, JSON, email, PDF, and Word locally',
    'Preview rule matches and sample changes before writing output',
    'Choose masking or deterministic pseudonymization',
    'Use personnel lists to improve name and employee-ID matching',
    'Inspect statistics, output locations, and versioned audit logs',
  ]);
  expect(getHighlightHeadings(zh.content, 'zh')).toEqual([
    '用双引擎覆盖表格与文档',
    '把脱敏规则变成可维护的数据',
    '保留跨文件关联而不暴露原值',
  ]);
  expect(getHighlightHeadings(en.content, 'en')).toEqual([
    'Cover tables and documents with two processing engines',
    'Turn masking policy into maintainable data',
    'Preserve cross-file joins without exposing source values',
  ]);
  for (const document of [zh, en]) {
    expect(document.content).toContain(
      'src="/projects/ita-maskit/preview.png"',
    );
    expect(document.content).toContain('src="/projects/ita-maskit/rules.png"');
    expect(document.data.repoUrl).toBe(
      'https://github.com/ShaySha-PRa/ITA-Maskit',
    );
  }
});

for (const project of localizedProjectCases) {
  it(`${project.slug} has no validation presentation in both locales`, () => {
    for (const [locale, document] of [
      [
        'zh',
        matter(
          readFileSync(
            resolve(root, `src/content/projects/zh/${project.slug}.md`),
            'utf8',
          ),
        ),
      ],
      [
        'en',
        matter(
          readFileSync(
            resolve(root, `src/content/projects/en/${project.slug}.md`),
            'utf8',
          ),
        ),
      ],
    ] as const) {
      expect(getLevelTwoHeadings(document.content)).toEqual(
        storyHeadings[locale],
      );
      expect(getCapabilityItems(document.content)).toHaveLength(6);
      expect(getHighlightHeadings(document.content, locale)).toHaveLength(3);
      expect(document.content).not.toMatch(
        /三个关键技术决策|Three key technical decisions|关键技术决策|用 FastAPI 固定前后端边界|Use FastAPI as the frontend boundary|限制与下一步|Limitations and next steps|Known limitations and next steps/,
      );
      expect(document.content).not.toMatch(
        /当前验证状态|Current validation status|查看验证证据|View validation evidence|id="validation"|#validation/,
      );
      expect(document.data.caseStudy).not.toHaveProperty('evidenceTarget');
      expect(document.content).toContain(
        locale === 'zh' ? '项目边界' : 'Project scope',
      );
      expect(document.data.repoUrl).toBe(project.repoUrl);
      expect(document.data.locale).toBe(locale);
    }
  });
}

it('Manim contextual images contain visible visual variation', async () => {
  const cover = await sharp(
    readFileSync(resolve(root, 'src/assets/projects/manim-project/cover.png')),
  ).metadata();
  expect({ width: cover.width, height: cover.height }).toEqual({
    width: 1903,
    height: 1080,
  });

  for (const filename of [
    'formula-derivation-demo.jpg',
    'quality-result.png',
  ]) {
    const image = await sharp(
      readFileSync(resolve(root, `public/projects/manim-project/${filename}`)),
    )
      .resize({ width: 160, height: 120, fit: 'inside' })
      .stats();
    expect(
      Math.max(...image.channels.map((channel) => channel.stdev)),
    ).toBeGreaterThan(5);
  }
});
