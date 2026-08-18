import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import matter from 'gray-matter';

const articlePath = path.resolve(
  process.cwd(),
  'src/content/articles/zh/coding-agent-principles-and-differences.md',
);

const allowedOrigins = [
  'https://code.claude.com/',
  'https://docs.anthropic.com/',
  'https://learn.chatgpt.com/',
  'https://developers.openai.com/',
  'https://openai.com/',
  'https://github.com/openai/',
  'https://github.com/NousResearch/',
  'https://hermes-agent.nousresearch.com/',
  'https://github.com/badlogic/',
  'https://modelcontextprotocol.io/',
  'https://github.com/modelcontextprotocol/',
];

const requiredSources = {
  hermesCompression:
    'https://hermes-agent.nousresearch.com/docs/developer-guide/context-compression-and-caching',
  hermesArchitecture:
    'https://hermes-agent.nousresearch.com/docs/developer-guide/architecture',
  hermesContextFiles:
    'https://hermes-agent.nousresearch.com/docs/user-guide/features/context-files',
  codexLoop: 'https://openai.com/index/unrolling-the-codex-agent-loop/',
  codexCloudInternet: 'https://learn.chatgpt.com/codex/cloud/internet-access',
};

function sectionBlock(content: string, sectionNumber: number): string {
  const sectionId = `section-${String(sectionNumber).padStart(2, '0')}`;
  const start = content.indexOf(`<h2 id="${sectionId}"`);
  const next = content.indexOf('<h2 id="', start + 1);
  return content.slice(
    start,
    next === -1 ? content.indexOf('## 参考资料') : next,
  );
}

describe('Coding Agent article integrity', () => {
  it('publishes the complete article with stable structure and metadata', () => {
    expect(fs.existsSync(articlePath)).toBe(true);

    const { data, content } = matter(fs.readFileSync(articlePath, 'utf8'));

    expect(data).toMatchObject({
      title: 'Coding Agent 原理与差异：Claude Code、Codex、Hermes Agent、pi',
      slug: 'coding-agent-principles-and-differences',
      locale: 'zh',
      translationKey: 'coding-agent-principles-and-differences',
      hideDate: true,
      draft: false,
    });
    expect(data.cover).toBeUndefined();
    expect(data.tags).toEqual([
      'Coding Agent',
      'Memory',
      'Agent Architecture',
      'Claude Code',
      'Codex',
    ]);
    expect(content.match(/<h2 id="[^"]+" data-article-section>/g)).toHaveLength(
      50,
    );
    expect((content.match(/^```/gm) ?? []).length / 2).toBe(131);
    expect(content.match(/class="article-table-scroller"/g)).toHaveLength(4);
    const tocLinks = [...content.matchAll(/href="#(section-[^"]+)"/g)].map(
      (match) => match[1],
    );
    expect(tocLinks).toEqual(
      Array.from(
        { length: 50 },
        (_, index) => `section-${String(index + 1).padStart(2, '0')}`,
      ),
    );
    expect(content).toContain('<details class="article-toc">');
    expect(content).toContain('## 参考资料');
    expect(content).toContain('50. 最终总结');
    expect(content).not.toMatch(/cite|turn\d+(?:search|view|fetch)\d+/);
    expect(content).not.toMatch(/切换主题|Contents · 50 Sections|>复制</);
    expect(content).not.toContain('[官方文档]');
  });

  it('uses only approved official HTTPS sources', () => {
    expect(fs.existsSync(articlePath)).toBe(true);
    const { content } = matter(fs.readFileSync(articlePath, 'utf8'));
    const links = [...content.matchAll(/https?:\/\/[^\s)>'"]+/g)].map(
      (match) => match[0],
    );
    const uniqueLinks = [...new Set(links)];
    const referenceSection = content.slice(content.indexOf('## 参考资料'));
    const referenceLinks = [
      ...referenceSection.matchAll(/https?:\/\/[^\s)>'"]+/g),
    ].map((match) => match[0]);
    expect(uniqueLinks.length).toBeGreaterThan(0);
    expect(new Set(referenceLinks).size).toBe(referenceLinks.length);
    expect(uniqueLinks.every((link) => referenceLinks.includes(link))).toBe(
      true,
    );
    expect(uniqueLinks.every((link) => link.startsWith('https://'))).toBe(true);
    expect(
      uniqueLinks.every((link) =>
        allowedOrigins.some(
          (origin) => link === origin.slice(0, -1) || link.startsWith(origin),
        ),
      ),
    ).toBe(true);
    expect(uniqueLinks.some((link) => link.includes('code.claude.com/'))).toBe(
      true,
    );
    expect(
      uniqueLinks.some((link) => link.includes('learn.chatgpt.com/')),
    ).toBe(true);
    expect(
      uniqueLinks.some((link) => link.includes('github.com/NousResearch/')),
    ).toBe(true);
    expect(
      uniqueLinks.some((link) => link.includes('github.com/badlogic/')),
    ).toBe(true);
    expect(
      uniqueLinks.some((link) => link.includes('modelcontextprotocol.io/')),
    ).toBe(true);
  });

  it('uses current primary sources for corrected claims', () => {
    const { content } = matter(fs.readFileSync(articlePath, 'utf8'));

    expect(content).toContain(requiredSources.hermesCompression);
    expect(content).toContain(requiredSources.hermesArchitecture);
    expect(content).toContain(requiredSources.hermesContextFiles);
    expect(content).toContain(requiredSources.codexLoop);
    expect(content).toContain(requiredSources.codexCloudInternet);

    const hermesCompaction = sectionBlock(content, 28);
    expect(hermesCompaction).toContain('compression.in_place: true');
    expect(hermesCompaction).toContain('同一个 session id');
    expect(hermesCompaction).toContain('in_place: false');
    expect(hermesCompaction).toContain('parent_session_id');
    expect(hermesCompaction).not.toMatch(/默认[\s\S]{0,80}session A\s*#2/);

    const codexCompaction = sectionBlock(content, 17);
    expect(codexCompaction).toContain('/responses/compact');
    expect(codexCompaction).toContain('encrypted');
    expect(codexCompaction).toContain(requiredSources.codexLoop);

    const hermesTools = sectionBlock(content, 23);
    expect(hermesTools).toContain('70+ tools');
    expect(hermesTools).toContain('28 个 toolsets');
    expect(hermesTools).toContain(requiredSources.hermesArchitecture);

    const hermesContext = sectionBlock(content, 26);
    expect(hermesContext).toContain(requiredSources.hermesContextFiles);

    const piContext = sectionBlock(content, 35);
    expect(piContext).toContain(
      'https://github.com/badlogic/pi-mono/tree/main/packages/coding-agent',
    );
    expect(piContext).not.toContain(
      'https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/skills.md',
    );

    for (const sectionNumber of [36, 37, 38, 39, 40, 41]) {
      const block = sectionBlock(content, sectionNumber);
      expect(block).toMatch(/https:\/\/github\.com\/badlogic\/pi-mono\//);
    }

    expect(sectionBlock(content, 44)).toMatch(
      /https:\/\/code\.claude\.com\/|https:\/\/learn\.chatgpt\.com\/|https:\/\/github\.com\/(?:NousResearch|badlogic)\//,
    );
    expect(sectionBlock(content, 45)).toMatch(
      /https:\/\/code\.claude\.com\/|https:\/\/learn\.chatgpt\.com\/|https:\/\/github\.com\/(?:NousResearch|badlogic)\//,
    );
  });
});
