---
title: Manim Project · 科研动画工作台
slug: manim-project
locale: zh
translationKey: manim-project
summary: 将一句科研描述与可选数据编译为可追溯的 AnimationIR、受控科学计算和可审阅视频，同时保留教学 ContentPlan 路径。
published: 2026-08-16
updated: 2026-08-19
draft: false
status: experiment
role: 独立开发者
tech:
  [Next.js, FastAPI, Python, AnimationIR, ManimCE, NumPy/SciPy, Redis, Docker]
repoUrl: https://github.com/ShaySha-PRa/Manim_project
cover: ../../../assets/projects/manim-project/cover.png
gallery: []
featured: false
order: 4
evidence:
  - 封面来自仓库 2026-08-19 更新后的 docs/assets/workbench-demo.png；两张上下文图仍取自 docs/assets/formula-derivation-demo.mp4 的 30.0 秒与 50.0 秒帧，代表保留的教学路径。
  - 最新 GitHub Actions Python job 完成 Ruff 与 580 passed、1 skipped；Web job 因 nanoid high-severity audit 在前置门禁停止，本机 WSL 的 lint、typecheck 与 production build 均通过。
  - 本机重跑封闭验收：P0 7 例中 6 个可渲染切片首次出片、1 例正确进入 needs_confirmation；P1 76 例与 P2 130 例均通过各自内部门禁。P2 明确是实验室 harness，不是外部用户研究。
caseStudy:
  category: 科学可视化 / Agent + Compiler
  scope: 双路径 Animation Agent 工作台
---

## 项目解决什么

科研动画不能把“让模型写一段 Manim Python”当成科学正确性的来源：轨迹、场、残差和数据点需要可追溯的计算产物，动画表达也需要可验证的中间表示。这个工作台新增 Animation Agent V2，把一句科研描述与可选 CSV 先解析为 IntentSpec，再调用白名单科学工具生成 ToolRun，构建 AnimationIR 2.0，并由确定性 Compiler 输出可审阅的 Preview；原有教学 Prompt → ContentPlan → CodeVersion 路径继续保留，二者共用版本、队列、沙箱与交付层。

## 核心功能

<ul class="project-capabilities" data-project-capabilities>
  <li>用一句科研描述和可选 CSV 创建动画任务</li>
  <li>将模型输出限制为结构化 IntentSpec JSON</li>
  <li>通过白名单科学工具生成可追溯 ToolRun</li>
  <li>将 AnimationIR 2.0 编译为 Manim 与 Web JSON</li>
  <li>以表达 critic 检查并最多修复一次 IR</li>
  <li>交付 Preview / Final、QualityReport 与教学 ContentPlan</li>
</ul>

## 使用流程

<ol class="project-flow" data-project-flow>
  <li>输入科研目标与可选资产</li>
  <li>解析 Intent 并运行科学工具</li>
  <li>构建并检查 AnimationIR</li>
  <li>编译并渲染 Preview</li>
</ol>

用户从无需登录的本地工作台输入一句科研目标，并按需附上 CSV。系统将目标整理为可审阅的 domain、assumptions 和 tools_needed；未匹配封闭目录时返回 needs_confirmation，缺少必需数据时返回 asset_required，不自行补公式或伪造数据。匹配成功后，ToolRun 的输出进入 AnimationIR、critic 与 Compiler，再沿现有 Runner 和无网 Docker 渲染边界生成 Preview。

在封闭 P0 验收中，6 个可渲染纵向切片全部通过科学断言、确定性编译和首次 Docker 出片，论文+CSV 未满足封闭目录条件的样例正确暂停确认；这些是内部验收结果，不是通用生成成功率。

## 项目亮点

### 让模型规划意图，而不是编写自由 Scene

科研路径中，模型若启用也只能填写 IntentSpec JSON，不能输出 Scene Python、lambda 或自由 NumPy 表达式；没有模型配置时则回退到透明的关键词 Intent 目录。确定性 Compiler 负责把受限 IR lowering 为 Manim 代码，未知 capability 返回结构化错误与显式 fallback。教学路径仍允许受 AST/API 白名单约束的 CodeVersion，但不会与科研 Compiler 的证据口径混在一起。

<figure class="project-evidence">
  <img src="/projects/manim-project/formula-derivation-demo.jpg" alt="教学路径中的公式推导动画演示画面" width="1920" height="1080" loading="lazy" />
  <figcaption>公式推导演示帧来自仓库教学路径的 docs/assets/formula-derivation-demo.mp4 30.0 秒位置；新版科研路径与这条教学 ContentPlan 路径并存。</figcaption>
</figure>

### 把科学数值和来源锁进 ToolRun

轨迹、场和时间序列来自注册式 NumPy/SciPy/pandas 工具，而不是 Scene 运行时临场计算。ToolRun 记录参数、输入与输出哈希；AssetVersion 保存不可变资产来源，AnimationIR 只引用 artifact_ref。论文+CSV 复现目前只接受封闭的 Lotka–Volterra 目录和完整系数，其他论文明确进入 needs_confirmation。

P1 的 76 条内部黄金任务中有 58 条 ready；expected、science 与 provenance rate 均为 1.0，表达 critic 均值为 5.0，平均 IR repair 为 0。它证明的是封闭语料上的溯源与表达门禁，不是外部研究结论。

### 用同一份 IR 连接双 Backend 与修复闭环

AnimationIR 2.0 经过结构校验和 TIFA 风格表达 critic 后，最多执行一次 IR-level repair；同一份 IR 可以确定性 lowering 为 Manim Python 和 Web JSON，避免为不同预览端重新解释科学意图。Manim 结果进入现有无网 Render Sandbox，Web backend 只输出可检查的 JSON 预览，不冒充第二套视频渲染器。

P2 的 130 条内部 benchmark 中有 100 条 ready，science、expected 与 cross-backend rate 均为 1.0，非预期 FAILED rate 为 0；协议同时明确 external_user_study=false。

<figure class="project-evidence">
  <img src="/projects/manim-project/quality-result.png" alt="教学路径仓库演示视频 50 秒处的动画帧" width="1920" height="1080" loading="lazy" />
  <figcaption>这是保留的教学路径演示视频 50.0 秒帧；Preview / Final、缩略图、脱敏日志与 QualityReport 仍由两条生成路径共用。</figcaption>
</figure>

## 系统架构

<figure class="project-architecture">
  <div class="project-architecture__scroller" data-project-architecture-scroller tabindex="0">
    <img src="/projects/manim-project-architecture.svg" alt="Animation Agent V2 系统架构：科研 Prompt 经 IntentSpec、白名单科学工具、AnimationIR 2.0 和确定性编译进入 Manim 与 Web 双 Backend" width="1400" height="760" />
  </div>
  <figcaption>UML-like 组件与活动视图区分科研 Agent 路径、保留的教学路径、计算边界和渲染边界；不展示端口、模型供应商或生产拓扑。</figcaption>
</figure>

Next.js 工作台把科研 Prompt 送入 Intent Resolver 和白名单 Compute Sandbox，ToolRun 与来源哈希进入 AnimationIR、critic 和一次 IR repair，再由确定性 Compiler 分发到 Manim 与 Web JSON backend。教学 ContentPlan / CodeVersion 经过独立安全预检后汇入同一 Runner。只有 Manim backend 进入无网络、非 root、资源受限的 Render Sandbox；Preview / Final 和 QualityReport 返回同一工作台。

## 项目边界

这是一个本地开发与验收工作台：科研路径只覆盖封闭的 Intent/工具目录，教学 ContentPlan 路径继续保留。P0/P1/P2 数字来自内部黄金集与实验室 harness，不代表外部科研用户研究或生产部署能力。
