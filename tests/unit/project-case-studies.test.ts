import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import matter from 'gray-matter';
import { expect, it } from 'vitest';

const root = resolve(import.meta.dirname, '../..');

const projectCases = [
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
      category: 'AI 知识系统',
      scope: '全栈 GraphRAG 工作台',
      evidenceTarget: '#validation',
    });
    expect(en.data.caseStudy).toMatchObject({
      category: 'AI Knowledge Systems',
      scope: 'Full-stack GraphRAG workspace',
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
    expect(architecture).toContain('04 OUTPUT');
    expect(architecture).toContain('GRAPH VIEW + ANSWER / CITED ENTITIES');
    expect(architecture).toContain('GRAPH RETRIEVAL');
    expect(architecture).toContain('VECTOR RETRIEVAL');
    expect(
      (architecture.match(/class="retrieval"/g) ?? []).length,
    ).toBeGreaterThanOrEqual(2);
    expect(architecture).not.toMatch(
      /\b(?:DeepSeek|MiniMax|MinerU|\d{2,5}\s*ports?)\b/i,
    );
  });
}
