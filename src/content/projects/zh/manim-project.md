---
title: AI 数学动画生成工作台
slug: manim-project
locale: zh
translationKey: manim-project
summary: 将教学意图整理为可审阅的 ContentPlan，再沿着版本化代码链生成可检查的 Manim 视频产物。
published: 2026-08-16
updated: 2026-08-17
draft: false
status: experiment
role: 独立开发者
tech: [Next.js, FastAPI, Python, Manim, SQLite, Redis, Docker]
repoUrl: https://github.com/ShaySha-PRa/Manim_project
cover: ../../../assets/projects/manim-project/cover.png
gallery: []
featured: false
order: 4
evidence:
  - 封面来自仓库 docs/assets/workbench-demo.png；两张上下文图均从仓库 docs/assets/formula-derivation-demo.mp4 提取，分别取 30.0 秒和 50.0 秒帧。
  - 本轮在 WSL Python 3.10 环境完成仓库 519 项测试；使用确定性模板完成一条结构化公式任务，并对仓库演示视频执行本地质量检查，未记录模型或生产指标。
caseStudy:
  category: 应用型 AI
  scope: 安全媒体生成流水线
---

## 项目解决什么

数学动画的难点不只是生成一段 Manim 代码，而是把教学目标、受众、时长和公式假设变成可以共同审阅的制作计划。这个工作台先让教师确认结构化的 ContentPlan，再把计划变成带版本关系的代码与渲染任务，让每一次修改都能回到教学意图，并把最终视频、缩略图、日志和质量诊断交还给人检查。

## 核心功能

<ul class="project-capabilities" data-project-capabilities>
  <li>输入教学目标、受众、时长与假设</li>
  <li>生成并编辑结构化 ContentPlan</li>
  <li>生成只读、版本化的 Manim CodeVersion</li>
  <li>提交 Preview 和 Final 渲染</li>
  <li>查看视频、缩略图与渲染日志</li>
  <li>检查时长、帧率和严重视觉异常</li>
</ul>

## 使用流程

<ol class="project-flow" data-project-flow>
  <li>输入教学需求</li>
  <li>生成结构化计划</li>
  <li>预览与检查</li>
  <li>交付最终产物</li>
</ol>

教师先描述一个公式推导或函数可视化任务，工作台将需求整理为包含受众、时长、场景、公式步骤和显式假设的 ContentPlan。计划由人审阅和编辑后，才会生成 Manim 代码；Preview 和 Final 任务通过 job ID 排队，在隔离执行边界内渲染，再把视频、缩略图、元数据和质量诊断返回工作台。

## 项目亮点

### 先把教学意图变成可审阅计划

ContentPlan 先于代码生成：它把教学目标、受众、时长、场景、公式步骤和假设整理成可编辑的制作对象。教师可以先审阅这份计划，再决定是否进入代码生成和 Preview 渲染，避免把不可读的生成代码当成教学设计本身。

<figure class="project-evidence">
  <img src="/projects/manim-project/formula-derivation-demo.jpg" alt="公式推导动画演示画面" width="1920" height="1080" loading="lazy" />
  <figcaption>公式推导演示帧来自仓库 docs/assets/formula-derivation-demo.mp4 的 30.0 秒位置；它只作为项目上下文，不代表本轮重新生成的模型结果。</figcaption>
</figure>

### 用版本链连接每次修改与产物

Prompt → Plan → Code → Artifact 是一条不可变、可追溯的版本链。Prompt、ContentPlan 和只读的 CodeVersion 都按版本追加，后续修改通过 parent version 关联；每个 Preview 或 Final 产物都能反查对应的计划和代码，不会覆盖旧的审阅对象。

### 在隔离执行前拒绝不可信代码

生成代码先经过 AST 与 Manim API 白名单、编译和 Scene 预检；只有通过这些检查的任务才会进入无网络、非 root、资源受限的隔离 Manim 容器。产物随后接受确定性的媒体检查，以时长、帧率、帧数和严重视觉异常生成质量诊断，并在返回工作台前脱敏日志。

<figure class="project-evidence">
  <img src="/projects/manim-project/quality-result.png" alt="仓库演示视频 50 秒处的数学动画帧" width="1920" height="1080" loading="lazy" />
  <figcaption>这是从同一仓库演示视频 50.0 秒位置提取的真实动画帧；旁边的质量结论来自本地 PyAV 检查，不把静态帧伪装成产品质量面板。</figcaption>
</figure>

## 系统架构

<figure class="project-architecture">
  <div class="project-architecture__scroller" data-project-architecture-scroller tabindex="0">
    <img src="/projects/manim-project-architecture.svg" alt="AI 数学动画生成工作台系统架构：Next.js 工作台通过 FastAPI 和 Redis 调度隔离 Manim 渲染与质量报告" width="1400" height="760" />
  </div>
  <figcaption>架构图只保留工作台、控制平面、执行边界和产物检查四层；不把模型提供方、端口或生产部署写进实现证据。</figcaption>
</figure>

Next.js 工作台通过 FastAPI + SQLite 保存 Prompt、ContentPlan、CodeVersion 与任务状态；Redis 只负责传递带 job ID 的渲染任务。Host Runner 在提交执行前完成 AST/API 白名单、编译和 Scene 预检，再把不可信代码交给默认拒绝的隔离 Manim 容器。Preview 和 Final artifacts 分开落盘，确定性媒体检查把渲染结果、缩略图和脱敏日志汇成可审阅的 QualityReport。

## 项目边界

这是一个需要人工审阅的创作工具，而不是任意数学内容的一键出片服务。数学范围受 ContentPlan 和公式校验边界约束；生成代码不保证每次都能成功渲染，也不保证对任意数学内容一次生成出可交付结果。模型修复、确定性降级和本地质量检查都不能替代人的教学判断。本轮完成了确定性代码链路和演示产物的本地检查，没有完成兼容模型驱动的端到端 Preview → Final 渲染，也没有做市场或生产验证。
