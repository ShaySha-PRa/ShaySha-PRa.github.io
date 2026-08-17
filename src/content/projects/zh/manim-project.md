---
title: AI 数学动画生成工作台
slug: manim-project
locale: zh
translationKey: manim-project
summary: 将教学需求转为可审阅的 ContentPlan 与 Manim 代码，并以队列、隔离执行和确定性质量检查组织预览与最终产物。
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

## 用户如何使用它

<ol class="project-flow" data-project-flow>
  <li>输入教学需求</li>
  <li>生成结构化计划</li>
  <li>预览与检查</li>
  <li>交付最终产物</li>
</ol>

教师先描述一个公式推导或函数可视化任务，工作台将需求整理为包含受众、时长、场景、公式步骤和显式假设的 ContentPlan。计划确认后生成带版本关系的 Manim 代码，预览任务和最终任务都通过 job ID 排队，在隔离执行边界内渲染，最后把视频、缩略图、元数据和质量诊断返回工作台。

## 系统架构

<figure class="project-architecture">
  <div class="project-architecture__scroller" data-project-architecture-scroller tabindex="0">
    <img src="/projects/manim-project-architecture.svg" alt="AI 数学动画生成工作台系统架构：Next.js 工作台通过 FastAPI 和 Redis 调度隔离 Manim 渲染与质量报告" width="1400" height="760" />
  </div>
  <figcaption>架构图只保留工作台、控制平面、执行边界和产物检查四层；不把模型提供方、端口或生产部署写进实现证据。</figcaption>
</figure>

Next.js 工作台通过 FastAPI + SQLite 保存 Prompt、ContentPlan、CodeVersion 与任务状态；Redis 只负责传递带 job ID 的渲染任务。Host Runner 在提交执行前经过静态检查，再把不可信代码交给默认拒绝的隔离 Manim 容器。Preview 和 Final artifacts 分开落盘，质量报告由确定性的媒体元数据和抽样帧检查生成。

<figure class="project-evidence">
  <img src="/projects/manim-project/formula-derivation-demo.jpg" alt="公式推导动画演示画面" width="1920" height="1080" loading="lazy" />
  <figcaption>公式推导演示帧来自仓库 docs/assets/formula-derivation-demo.mp4 的 30.0 秒位置；它只作为项目上下文，不代表本轮重新生成的模型结果。</figcaption>
</figure>

## 三个关键技术决策

### 用不可变版本链保留教学意图

Prompt、ContentPlan 和 CodeVersion 都按版本追加，后续修改通过 parent version 关联，而不是覆盖旧内容。这样可以把某次渲染对应的计划、代码和产物重新定位，也让修复尝试有清晰的审阅对象。

### 用 job ID 解耦提交与执行

FastAPI 负责创建任务并持久化状态，Redis 负责排队，Runner 负责领取、恢复和取消。Preview 与 Final 共享同一条可追踪任务边界，但保留不同的交付层，避免把中间预览当成最终产物。

### 对生成代码执行默认拒绝的检查

代码先经过 AST 与 Manim API 白名单、编译和 Scene 预检，再进入无网络、非 root、资源受限的隔离容器。质量层以 PyAV 检查时长、FPS、帧数和严重视觉异常；诊断文本经过脱敏，不把任意生成代码直接暴露给工作台。

<figure class="project-evidence">
  <img src="/projects/manim-project/quality-result.png" alt="仓库演示视频 50 秒处的数学动画帧" width="1920" height="1080" loading="lazy" />
  <figcaption>这是从同一仓库演示视频 50.0 秒位置提取的真实动画帧；旁边的质量结论来自本地 PyAV 检查，不把静态帧伪装成产品质量面板。</figcaption>
</figure>

## 限制与下一步

项目仍是本地开发与验收环境，数学内容范围受 ContentPlan 和公式校验边界约束；生成代码并不保证每次都能成功渲染，模型修复与确定性降级也不能替代人工审阅。本轮只完成了确定性代码链路和演示产物的本地检查，没有完成兼容模型驱动的端到端 Preview → Final 渲染，也没有做市场或生产验证。下一步是补齐可复现的模型配置、在隔离环境完成一条真实公式任务的双阶段渲染，并保留对应的脱敏 QualityReport。
