import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import matter from 'gray-matter';
import sharp from 'sharp';
import { expect, it } from 'vitest';

const root = resolve(import.meta.dirname, '../..');

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
    zhTitle: 'AI 数学动画生成工作台',
    enTitle: 'Manim Project',
    category: '应用型 AI',
    scope: '安全媒体生成流水线',
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
      evidenceTarget: '#validation',
    });
    expect(en.data.caseStudy).toMatchObject({
      category:
        project.slug === 'agent-teams-project'
          ? 'AI Workflow'
          : project.slug === 'manim-project'
            ? 'Applied AI'
            : project.slug === 'sql-agent'
              ? 'Data Platform'
              : project.slug === 'ita-maskit'
                ? 'Data Privacy'
                : 'AI Knowledge Systems',
      scope:
        project.slug === 'agent-teams-project'
          ? 'Contract-review MVP'
          : project.slug === 'manim-project'
            ? 'Secure media generation pipeline'
            : project.slug === 'sql-agent'
              ? 'Full-stack NL2SQL assistant'
              : project.slug === 'ita-maskit'
                ? 'CLI + Windows desktop app'
                : 'Full-stack GraphRAG workspace',
      evidenceTarget: '#validation',
    });

    for (const [locale, document] of [
      ['zh', zh],
      ['en', en],
    ] as const) {
      expect(document.content.match(/data-project-flow/g)).toHaveLength(1);
      expect(document.content.match(/<li>[^<]+<\/li>/g)).toHaveLength(4);
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
      expect(document.content).toContain('id="validation"');
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
      expect(architecture).toContain('02 CONTROL PLANE');
      expect(architecture).toContain('03 EXECUTION');
      expect(architecture).toContain('04 ARTIFACTS');
      expect(architecture).toContain('default-deny');
      expect(architecture).toContain('data-boundary="untrusted-execution"');
      expect(architecture).toContain('data-flow="workbench-control-queue"');
      expect(architecture).toContain('data-flow="runner-to-container"');
      expect(architecture).toContain('data-flow="container-to-artifacts"');
      expect(architecture).toContain('data-source="isolated-manim-container"');
      expect(architecture).toContain('data-target="preview-final-artifacts"');
      expect(architecture).toContain('data-flow="artifacts-to-quality"');
      expect(architecture).not.toContain('data-flow="runner-to-artifacts"');
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

it('Manim contextual images contain visible visual variation', async () => {
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
