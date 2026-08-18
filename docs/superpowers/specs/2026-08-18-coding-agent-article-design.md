# Coding Agent 长文整合设计

## 背景

源文件为本地独立 HTML：

`C:\Users\Joshu\Documents\Codex\2026-08-13\referenced-chatgpt-conversation-this-is-an\outputs\Coding-Agent-原理与差异-Claude-Code-Codex-Hermes-pi.html`

正文约 94 KB，包含 50 个主章节、131 个代码或结构示意块、4 张比较表和 34 处仅在原生成会话中有效的 `turn…search…` 引用标记。网站目前已经具备 Astro `articles` collection、文章列表、详情布局、RSS 与结构化数据，但尚未发布任何文章。

本轮将原文转换为网站第一篇原生中文技术文章。内容保留完整，视觉与导航适配现有 Editorial Lab 风格；无效内部引用改为可核验的一手来源。

## 目标

- 完整收录 50 节正文，不压缩或拆分为系列。
- 将独立 HTML 转换为可维护、可搜索、可访问的 Astro Markdown 内容。
- 保留代码示意、比较表和关键提示框，并修复原始标题层级。
- 用官方文档或官方仓库替换不可公开访问的内部引用标记。
- 在中文首页和文章列表展示文章；英文文章栏目继续保持空状态。
- 只对本篇隐藏视觉日期，保留排序、RSS 和结构化数据所需的机器可读日期。

## 非目标

- 不保留原 HTML 的独立导航栏、主题切换、CSS 或 JavaScript。
- 不制作完整英文译文、英文摘要页或中文 fallback 英文路由。
- 不增加封面图、评论系统、全文搜索或客户端目录脚本。
- 不修改项目、影像、简历或 About 内容。
- 不把第三方博客、搜索结果摘要或生成会话内部引用作为最终来源。

## 文章元数据

- 标题：`Coding Agent 原理与差异：Claude Code、Codex、Hermes Agent、pi`
- Slug：`coding-agent-principles-and-differences`
- Locale：`zh`
- Translation key：`coding-agent-principles-and-differences`
- 摘要：`系统比较 Claude Code、OpenAI Codex、Hermes Agent 与 pi 的 Agent Loop、上下文、记忆、Compaction、工具、子代理、安全边界与扩展机制。`
- 标签：`Coding Agent`、`Memory`、`Agent Architecture`、`Claude Code`、`Codex`
- Cover：不设置
- `hideDate: true`

Schema 仍要求 `published` 与 `updated`，本篇分别保存原文版本日期 `2026-08-13` 与站内整理日期 `2026-08-18`。这些日期继续进入排序、RSS 与 Article JSON-LD，但不在文章卡片或详情页视觉呈现。

## 正文结构

文章详情页的唯一 `h1` 由 `ArticleLayout` 输出。原 HTML 的 50 个主章节改为正文 `h2`，其内部小节改为 `h3`；章节文字与编号保持不变。

文章开头增加原生 `<details class="article-toc">` 折叠目录，使用 `<summary>目录 · 50 节</summary>`。目录按五组组织：

1. Agent 与 Memory 基础：第 1–4 节。
2. Claude Code：第 5–12 节。
3. Codex：第 13–21 节。
4. Hermes Agent：第 22–30 节。
5. pi 与四家横向比较：第 31–50 节。

每个主章节使用稳定英文 ID，目录链接直接指向对应 `h2`。正文保留全部论述、131 个代码或结构示意块、4 张比较表、列表与提示框；允许在不改变含义的前提下修复换行、代码语言标记、重复的“复制”按钮文字和错误的标题等级。

四张比较表包裹在可聚焦的 `.article-table-scroller` 容器中。容器自身横向滚动，390px 页面根节点不得出现横向溢出。

## 引用策略

删除全部 34 个 `turn…search…` 内部标记。逐项核对相关事实，并改为 Markdown 脚注或紧邻句子的可点击引用。

允许的来源层级：

1. Claude Code：`code.claude.com` 官方文档和 Anthropic 官方 Agent SDK 文档。
2. OpenAI Codex：`developers.openai.com/codex`、OpenAI 官方文档或官方 OpenAI GitHub 仓库。
3. Hermes Agent：Nous Research 的 `NousResearch/hermes-agent` 官方仓库及仓库内文档。
4. pi：pi 官方仓库及其仓库内 packages、README 与文档。
5. MCP 通用事实：Model Context Protocol 官方规范或官方文档。

如果原文事实与当前官方文档不一致，以当前一手来源为准，并将措辞改为范围明确的陈述。无法从一手来源验证的特性不继续作为确定事实。正文以转述为主，不复制来源中的长段文字。文末新增「参考资料」，按产品分组列出实际使用的官方链接。

## 日期隐藏模型

`articles` schema 增加可选字段：

```ts
hideDate: z.boolean().default(false)
```

当 `hideDate` 为 `true`：

- `ArticleCard` 不渲染日期 `<time>` 和日期后的分隔符，只显示阅读时长。
- `ArticleLayout` 不渲染“发布于”和“更新于”两项，只保留阅读时长。
- RSS `pubDate` 与 Article JSON-LD 的 `datePublished` / `dateModified` 保持存在。

其他文章缺失该字段时继续显示日期，兼容既有设计。

## 中文限定与英文空状态

网站的通用本地化选择器支持中文 fallback，但本篇已确认只发布中文。因此 Writing 栏目采用原生语言内容，不把中文文章作为英文 fallback：

- 中文首页、`/writing/` 和中文详情页正常展示文章。
- 英文首页不渲染 Latest writing。
- `/en/writing/` 保持现有空状态。
- 不生成 `/en/writing/coding-agent-principles-and-differences/`。
- 中文文章的语言切换链接指向 `/en/writing/`，而不是不存在的英文详情页。

该行为只作用于 `articles`，不改变项目、Journal、Profile 或 Resume 的本地化规则。

## 展示样式

- 复用现有 `ArticleLayout` 和 `.prose` 排版。
- 为 `.article-toc` 增加边框、留白、summary 焦点和分组列表样式。
- 为 `.article-table-scroller` 增加 `max-width: 100%` 与 `overflow-x: auto`。
- 长标题使用现有响应式字号并允许必要断行。
- 代码块继续在自身容器横向滚动。
- 不引入运行时 JavaScript 或新的客户端依赖。

## 内容与界面验收

- 中文文章文件具有确认的 frontmatter、50 个主章节、4 张比较表、最终总结与参考资料。
- 正文不含 `turn…search…`、原页面主题脚本、导航或“复制”按钮文本。
- 所有外部来源为 HTTPS 一手来源，链接可访问。
- 中文首页和 `/writing/` 显示文章；卡片和详情页均不显示日期。
- 详情页保留阅读时长和标签，目录可用键盘展开并跳转。
- 英文首页不显示文章板块，`/en/writing/` 保持空状态，英文详情路由不生成。
- RSS 包含文章及机器可读日期；Sitemap 包含中文详情路由，不包含英文详情路由。
- Article JSON-LD 含 headline、description、URL、datePublished 和 dateModified。
- 390px 下页面无横向溢出，表格自身可滚动；严重和致命级 Axe 问题为零。
- 完整 `npm run validate` 通过，发布后 Validate、Pages Deploy 与生产 Lighthouse 成功，并核验首页、文章列表、文章详情、英文空状态、RSS 和 Sitemap。

## 预计修改范围

- Create: `src/content/articles/zh/coding-agent-principles-and-differences.md`
- Modify: `src/content.config.ts`
- Modify: `src/layouts/ArticleLayout.astro`
- Modify: `src/components/cards/ArticleCard.astro`
- Modify: `src/lib/article-routes.ts`
- Modify: `src/pages/en/index.astro`
- Modify: `src/pages/en/writing/index.astro`
- Modify: `src/pages/en/writing/[slug].astro`
- Modify: `src/styles/prose.css`
- Modify/add focused unit and Playwright tests for content, routing, dates, RSS, structured data, accessibility, and responsive behavior.
