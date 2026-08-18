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
});
