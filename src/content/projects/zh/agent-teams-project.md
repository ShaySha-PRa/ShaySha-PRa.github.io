---
title: 合同审核多智能体工作流
slug: agent-teams-project
locale: zh
translationKey: agent-teams-project
summary: 把合同上传、字段核验、风险路由和人工决策组织成一条可追踪的审核 MVP 工作流。
published: 2026-08-16
updated: 2026-08-17
draft: false
status: completed
role: 独立开发者
tech: [React, FastAPI, LangGraph, SQLite, Human-in-the-Loop, SSE]
repoUrl: https://github.com/ShaySha-PRa/Agent_Teams_Project
cover: ../../../assets/projects/agent-teams-project/cover.png
gallery: []
featured: false
order: 3
evidence:
  - 页面图像来自仓库 assets/screenshots 的 dashboard、contracts 和 upload 截图；使用演示数据，不宣称运行指标。
  - 本地启动 FastAPI 后复现健康检查、合同上传、会话查询、合同列表和字段查询；模型依赖的后续流程单独标记。
caseStudy:
  category: AI 工作流
  scope: 合同审核 MVP
  evidenceTarget: '#validation'
---

## 用户如何使用它

<ol class="project-flow" data-project-flow>
  <li>上传合同</li>
  <li>核验字段</li>
  <li>人工处理风险</li>
  <li>查看 JSON 报告</li>
</ol>

使用者先上传一份 PDF 或 DOCX 合同，等待本地解析器将文件转成文本，再由模型从文本中提取合同双方、金额、日期等结构化字段。风险扫描完成后，工作流按风险等级进入人工决策节点，最后汇总为 JSON 报告，并通过 SSE 把进度推回工作台。

## 系统架构

<figure class="project-architecture">
  <div class="project-architecture__scroller" data-project-architecture-scroller tabindex="0">
    <img src="/projects/agent-teams-project-architecture.svg" alt="合同审核多智能体工作流系统架构：React 工作台通过 FastAPI 连接字段提取、风险路由、人工决策和报告流" width="1400" height="760" />
  </div>
  <figcaption>架构图强调字段提取先于风险路由、人工决策的中断边界，以及 SQLite 作为审核状态的权威来源。</figcaption>
</figure>

React 工作台通过 FastAPI 进入合同、会话、字段、事件和报告接口。本地 PDF/DOCX 解析器先生成文本，模型再完成结构化字段提取；之后 LangGraph 风险路由决定是进入逐条人工审核、批量处理还是自动通过。SQLite 持久化合同审核状态，SSE 负责把进行中的事件传回页面。

<figure class="project-evidence">
  <img src="/projects/agent-teams-project/contracts.png" alt="合同审核工作流合同列表界面" width="1400" height="900" loading="lazy" />
  <figcaption>合同列表展示审核会话入口；图像来自仓库演示截图，使用演示数据。</figcaption>
</figure>

## 三个关键技术决策

### 先本地解析，再由模型提取字段

把本地 PDF/DOCX 文本解析和模型结构化字段提取放在 LangGraph 风险路由之前，让人工先看到合同双方、金额、生效日期等可核验信息，也避免把文件读取、模型提取和风险决策混成一个不可定位的步骤。

### 用 interrupt / resume 固定人工决策边界

高风险条款会在工作流中断，等待人工确认、编辑或驳回，再沿 resume 路径继续。合法的人类备注是决策写入的门槛；这让自动扫描和最终判断之间保持可见的责任边界。

### 让 SQLite 保留权威审核状态

合同、会话、条款、字段、审计记录和报告都落在 SQLite 模型中。LangGraph 的 InMemorySaver 只承担开发期的图检查点，不能替代业务状态的持久化。

<figure class="project-evidence">
  <img src="/projects/agent-teams-project/upload.png" alt="合同审核工作流上传合同界面" width="1400" height="900" loading="lazy" />
  <figcaption>上传界面展示文件进入审核会话的入口；图像来自仓库演示截图，使用演示数据。</figcaption>
</figure>

<section id="validation" class="project-validation" tabindex="0">
  <h2>当前验证状态</h2>
  <table>
    <thead><tr><th>能力</th><th>状态</th><th>可核验证据</th></tr></thead>
    <tbody>
      <tr><th scope="row">FastAPI 启动与健康检查</th><td>已本机复现</td><td>本地启动 Uvicorn 后，<code>/health</code> 返回 200 和 <code>status: ok</code>。</td></tr>
      <tr><th scope="row">上传合同 → 会话 → 字段查询</th><td>部分复现</td><td>使用仓库提供的 MVP 脚本完成上传、会话查询、合同列表和字段查询；字段接口返回 5 项。</td></tr>
      <tr><th scope="row">风险路由 → 人工决策 → JSON 报告</th><td>未复现</td><td>无可用模型凭据时会话在扫描阶段等待 120 秒，未进入 HITL，报告接口返回 404；mock-risk fallback 不计为模型验证。</td></tr>
      <tr><th scope="row">合同审核准确率或法律结论</th><td>未声明</td><td>本项目没有在本轮提供可复现的准确率评测；页面不把模型输出写成法律意见。</td></tr>
    </tbody>
  </table>
</section>

## 限制与下一步

这是一个合同审核 MVP：认证仍是模拟的请求头，文本提取依赖本地 PDF/DOCX 解析，图检查点使用进程内 InMemorySaver，模型不可用时存在 mock-risk fallback，报告边界是 JSON 而不是生产文档系统。它不提供法律意见或合规认证，也不声明真实合同上的风险识别准确率。下一步是补齐可复现的模型配置、保存脱敏运行产物，并完成从扫描到 HITL 决策再到报告的端到端验收。
