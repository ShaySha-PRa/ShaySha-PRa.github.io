# 个人空间展示网站设计规格

日期：2026-08-16  
状态：已完成对话设计，等待书面规格审阅  
站点所有者：Junshu Sha（GitHub：ShaySha-PRa）

## 1. 项目定义

本项目建设一个长期维护的中英双语个人空间展示网站。它不是只面向招聘的传统作品集，也不是企业产品官网，而是集中展示以下内容的个人数字主页：

- 个人简介与当前关注方向；
- 六个代表性个人开发项目；
- 技术文章、开发记录与思考；
- 摄影作品和生活片段；
- 简历与联系方式。

网站以项目为主要内容，但允许技术、兴趣和生活并列存在。访客既可以快速了解站点所有者，也可以进入项目或文章详情深读。

## 2. 目标与非目标

### 2.1 目标

- 在首页建立鲜明、真实且不企业化的个人形象。
- 用统一案例结构展示六个项目的背景、个人贡献、工程决策和验证证据。
- 使用 Markdown + Git 管理全部文本内容。
- 中文为默认语言，英文提供完整切换与可控回退。
- 保持静态、快速、可访问、便于迁移和长期维护。
- 使用 GitHub Actions 自动验证并部署到 GitHub Pages。

### 2.2 非目标

- 第一版不提供账号、评论、搜索后端、数据库或内容管理后台。
- 第一版不加入访问分析、广告或第三方行为追踪。
- 第一版不追求复杂动画、滚动劫持、粒子背景或 WebGL 展示。
- 网站不复制各仓库 README；项目页必须重新组织为案例叙事。
- 不把未验证、演示桩或持续开发中的能力描述成生产验证能力。

## 3. 代表项目

首页和项目页展示以下六个项目，顺序固定但可通过内容字段调整：

1. [My Company Brain](https://github.com/ShaySha-PRa/my-company-brain)：企业知识中台，首页主项目；状态标记为“持续开发中”。
2. [GraphRAGAgent](https://github.com/ShaySha-PRa/GraphRAGAgent)：知识图谱、向量检索、D3 可视化与多轮问答。
3. [Agent Teams Project](https://github.com/ShaySha-PRa/Agent_Teams_Project)：合同审核、LangGraph 与 Human-in-the-Loop 工作流。
4. [Manim Project](https://github.com/ShaySha-PRa/Manim_project)：AI 数学动画、任务队列、Runner 与隔离渲染。
5. [SQLAgent](https://github.com/ShaySha-PRa/SQLAgent)：NL2SQL、RAG、数据库查询与数据可视化。
6. [ITA-Maskit](https://github.com/ShaySha-PRa/ITA-Maskit)：本地数据脱敏、桌面 GUI、安全边界与性能优化。

以下仓库不占主要项目位置：

- `ITA-Project`：可在关于页或 GitHub 入口中列为其他项目。
- `Agentic-GraphRAG-source`：作为 GraphRAGAgent 的前期探索或技术演进材料。
- `Resume-Matcher`：属于 fork；只有在能明确列出独立贡献时才作为开源贡献展示。

## 4. 信息架构

### 4.1 主导航

主导航仅保留五个入口：

- 首页 / Home
- 项目 / Projects
- 文章 / Writing
- 影像与生活 / Journal
- 关于 / About

简历拥有独立页面，但不占主导航位置；从首页、关于页和页脚进入。联系方式放在关于页末尾和全站页脚。

### 4.2 路由

中文为默认语言，不加语言前缀；英文统一使用 `/en/` 前缀。

| 内容 | 中文 | 英文 |
|---|---|---|
| 首页 | `/` | `/en/` |
| 项目列表 | `/projects/` | `/en/projects/` |
| 项目详情 | `/projects/:slug/` | `/en/projects/:slug/` |
| 文章列表 | `/writing/` | `/en/writing/` |
| 文章详情 | `/writing/:slug/` | `/en/writing/:slug/` |
| 影像与生活 | `/journal/` | `/en/journal/` |
| 影像详情 | `/journal/:slug/` | `/en/journal/:slug/` |
| 关于 | `/about/` | `/en/about/` |
| 简历 | `/resume/` | `/en/resume/` |
| 404 | `/404.html` | 英文文案包含在同一静态 404 页面中 |

语言切换器优先跳转至当前内容的对应译文。没有英文译文时，英文路由显示中文内容，并明确显示“English version in preparation / 英文版准备中”，避免空页面或隐式混用语言。

## 5. 首页结构

首页采用已确认的 `Curated Cover` 策展式封面结构：

1. 顶部导航与中英文切换；
2. 个人短介绍和一句核心表达；
3. 当前主项目 My Company Brain 的大型展示区；
4. “Now / 最近在做什么”短区块；
5. 其余五个代表项目的精选入口；
6. 最新技术文章；
7. 最近影像或生活记录；
8. 简历、联系方式和页脚。

首页核心表达暂定为视觉设计中的工作文案：

> Building useful systems, collecting curious ideas.

正式上线前，所有个人简介、中文对应文案、简历和联系方式必须由站点所有者确认。不得由实现过程虚构个人经历、联系方式或成果。

## 6. 项目案例结构

每个项目详情页统一包含：

1. 项目概述；
2. 要解决的问题；
3. 个人角色与完成范围；
4. 系统架构和主要数据流；
5. 关键技术决策及其权衡；
6. 界面、运行截图或演示媒体；
7. 结果、测试、性能或其他验证证据；
8. 已知限制和下一步；
9. GitHub、演示、视频或下载入口。

项目状态使用明确枚举：`active`、`completed`、`experiment`。界面分别显示为“持续开发中”“已完成”“实验项目”。

My Company Brain 必须按仓库当前状态区分“已实现”“已自动验证”“已真实环境验证”和“待验证”，不使用“生产可用”等无法由仓库证据支持的描述。

## 7. 内容模型

### 7.1 目录

```text
src/content/
├── projects/
├── articles/
├── journal/
├── profile/
└── resume/
```

每种内容由 Astro Content Collections 定义 Schema。构建时校验必需字段、URL、日期、状态枚举、翻译键和本地资源路径。

### 7.2 通用字段

所有可翻译内容包含：

- `title`
- `slug`
- `locale`: `zh` 或 `en`
- `translationKey`
- `summary`
- `published`
- `updated`
- `draft`
- `seoTitle`（可选）
- `seoDescription`（可选）

### 7.3 项目字段

- `status`: `active`、`completed` 或 `experiment`
- `role`
- `tech`
- `repoUrl`
- `demoUrl`（可选）
- `cover`
- `gallery`
- `featured`
- `order`
- `evidence`

### 7.4 文章字段

- `tags`
- `cover`（可选）
- `series`（可选）
- `canonicalUrl`（可选）

阅读时长、目录和相关文章在构建时派生，不在 Markdown 中重复维护。

### 7.5 影像与生活字段

- `date`
- `place`（可选）
- `cover`
- `photos`
- `tags`
- `camera`（可选）

影像内容以照片集或生活片段为单位，不采用无限滚动式社交信息流。

### 7.6 个人与简历内容

个人简介与简历同样以 Markdown 保存。履历、教育、技能和联系方式不从 GitHub 自动推断；实现时只使用用户明确提供或确认的内容。简历页面提供 PDF 下载入口，PDF 文件同样纳入 Git 版本管理。

## 8. 视觉系统

### 8.1 方向

视觉方向为 `Editorial Lab`，首页结构为 `Curated Cover`，配色为 `Ink & Vermilion`。

网站应像一本克制的独立出版物和个人实验室，而不是 SaaS 落地页或标准开发者模板。

### 8.2 色彩

基础色值：

- Paper：`#F4F0E8`
- Ink：`#171717`
- Vermilion：`#C6442B`
- Sand：`#C9BDA8`
- Muted text：`#555555`

朱红用于链接状态、栏目编号、标签和少量强调，不作为大面积正文背景。所有文本组合必须满足 WCAG AA 对比度要求。

### 8.3 字体

- 英文展示标题：Georgia 或经过性能评估后自托管的同类衬线字体。
- 中文展示标题：系统可用的中文衬线字体栈，优先 `Noto Serif SC` / `Source Han Serif SC`，无可用字体时回退系统宋体。
- 中英文正文：现代无衬线系统字体栈，优先 `Inter`、`Noto Sans SC`、`PingFang SC`、`Microsoft YaHei`。
- 代码：系统等宽字体栈。

第一版优先使用系统字体或严格控制的自托管字体，避免外部字体服务成为渲染阻塞或隐私依赖。

### 8.4 图像

- 项目截图保持真实，不使用虚构产品界面。
- 摄影图像保留原始长宽比。
- 构建时生成响应式尺寸和 WebP/AVIF；首屏主图可保留高质量 JPEG/WebP 回退。
- 非首屏图片懒加载；首屏关键视觉不懒加载。
- 每张有信息含义的图片必须提供对应语言的替代文字。

## 9. 组件边界

核心组件及职责：

- `BaseLayout`：文档骨架、全局样式、SEO 基础和语言属性。
- `Header`：主导航、当前栏目和移动菜单。
- `Footer`：联系方式、GitHub、简历入口和版权信息。
- `LocaleSwitch`：解析当前内容的对应翻译并生成安全回退。
- `ProjectCard`：项目列表卡片，不承载详情页长内容。
- `ProjectDetail`：项目案例页的固定语义结构。
- `ArticleCard`：文章摘要、日期和标签。
- `ArticleLayout`：正文、目录、阅读时长和相关文章。
- `PhotoGrid`：响应式图片网格。
- `Lightbox`：可键盘关闭、前后切换并遵守焦点管理的大图查看器。
- `SEOHead`：canonical、Open Graph、Twitter Card、`hreflang` 和结构化数据。

组件只接收已通过 Schema 校验的内容对象。组件内部不读取任意 Markdown 文件路径，路由和内容查询统一在页面层完成。

## 10. 技术架构与数据流

技术选型：Astro 静态站、TypeScript、Markdown、Astro Content Collections、GitHub Actions、GitHub Pages。

```text
Markdown + local images
        ↓
Content Collections schema validation
        ↓
translation pairing + route generation
        ↓
Astro component rendering + image optimization
        ↓
static HTML / CSS / minimal JavaScript
        ↓
GitHub Pages artifact deployment
```

除语言切换、移动导航和图片查看器外，页面不依赖客户端 JavaScript。技术文章代码高亮在构建时完成。

## 11. 交互与响应式

- 页面不使用滚动劫持。
- 动效限于下划线、朱红状态变化和轻微卡片位移。
- 所有动画遵守 `prefers-reduced-motion`。
- 桌面首页使用非对称策展网格；移动端依次排列主项目、其他项目、文章和影像。
- 项目卡片优先展示标题、短摘要和截图，技术标签数量受限；完整技术栈在详情页展示。
- 图片查看器支持触屏、键盘方向键、Escape 关闭和焦点返回。
- 移动导航打开时锁定背景焦点，但不劫持页面历史记录。

## 12. 错误处理与降级

- 必需 Front Matter、翻译键、状态枚举或必需图片缺失：构建失败。
- 可选封面缺失：生成 Ink/Vermilion 文字封面，不显示破损图片。
- 英文译文缺失：使用中文内容并显示明确提示。
- 内部链接失效：CI 失败。
- GitHub Pages 构建或测试失败：不执行部署，保留最后一次成功版本。
- 外部 GitHub 仓库临时不可用：页面仍显示本地项目内容，外部链接作为普通链接处理。
- 提供中英双语 404 文案以及返回首页、项目和文章的入口。

## 13. SEO、可访问性与隐私

- 每页提供唯一标题和描述。
- 输出 canonical、`hreflang`、Open Graph 和社交分享图。
- 文章生成 RSS；全站生成 sitemap。
- 使用语义化标题层级、导航、主内容、文章和时间元素。
- 所有交互支持键盘，焦点状态使用高对比度 Ink/Vermilion 样式。
- 正确设置页面 `lang`，混合语言片段按需设置局部 `lang`。
- 第一版不使用 Cookie Banner，因为不写入追踪 Cookie。
- 第一版不加载第三方分析脚本、评论脚本或远程字体追踪。

## 14. 发布流程

Pull Request 流程：

```text
content/code change
→ formatting and lint
→ Astro type/content checks
→ production build
→ internal link check
→ automated smoke tests
```

合并到 `main` 后：

```text
repeat validation
→ upload Pages artifact
→ deploy with GitHub Pages Actions
```

部署不维护 `gh-pages` 分支。Pages 设置使用 GitHub Actions 作为发布源。草稿内容 `draft: true` 不进入生产页面、RSS 或 sitemap。

## 15. 测试与验收

自动验证包括：

- Astro/TypeScript 类型检查；
- Content Collections Schema 校验；
- 格式与 lint；
- 生产构建；
- 内部链接和资源路径检查；
- 中英文路由与翻译切换测试；
- 首页、项目、文章、影像、关于、简历和 404 的 Playwright 冒烟测试；
- 键盘导航和基础无障碍扫描；
- 关键页面桌面与移动截图回归。

人工验收包括：

- 首页在桌面、平板和手机上的视觉层级；
- 六个项目的名称、状态、个人贡献和证据准确性；
- 中英文内容和语言切换；
- 摄影图像质量、裁切和替代文字；
- 简历 PDF、GitHub、邮箱及其他联系方式；
- GitHub Pages 正式 URL 与社交分享预览。

Lighthouse 的 Performance、Accessibility、Best Practices 和 SEO 以 90 分以上为目标。若单项未达到目标，必须记录具体原因并优先修正可控问题，不能通过删除必要内容或降低图片可读性来追分。

## 16. 首版完成标准

首版只有满足以下条件才可视为完成：

- Astro 项目可在干净环境安装、检查和构建；
- 首页和所有主导航页面完成中英文路由；
- 六个项目均有案例页，不直接复制 README；
- 至少一篇技术文章和一个影像集合可用于验证内容流程；
- 个人简介、简历和联系方式由站点所有者确认；
- 响应式、键盘导航、404、SEO、RSS 和 sitemap 可验证；
- PR 验证与 `main` 部署工作流可运行；
- GitHub Pages 上线版本来自一次完整通过的构建。

## 17. 已确认决策

- 定位：个人空间展示网站；
- 技术：Astro；
- 内容：Markdown + Git；
- 语言：中文默认、英文完整切换；
- 主内容：个人简介、六个项目、技术文章、摄影与生活、简历和联系方式；
- 视觉：Editorial Lab；
- 首页：Curated Cover；
- 配色：Ink & Vermilion；
- 部署：GitHub Actions Pages Artifact，不使用 `gh-pages`；
- 第一版：静态、无后台、无评论、无分析追踪。

