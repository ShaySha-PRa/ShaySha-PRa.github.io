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
---

## 项目解决什么

合同审核常常把事实核对、风险判断和人工责任混在一次操作里。这个 MVP 将 PDF/DOCX 合同解析、字段核验、风险分级路由和人工审核连接成一条可追踪的决策支持流程，让审阅者清楚知道每个决定为什么进入当前路径，以及如何继续或撤回。

## 核心功能

<ul class="project-capabilities" data-project-capabilities>
  <li>上传并解析 PDF/DOCX 合同</li>
  <li>抽取并核验合同双方、金额、日期和管辖法律</li>
  <li>扫描风险条款并显示依据与建议</li>
  <li>按高中低风险进入不同审核路径</li>
  <li>确认、编辑、驳回、撤销并恢复人工审核</li>
  <li>汇总决定并导出审核报告</li>
</ul>

## 使用流程

<ol class="project-flow" data-project-flow>
  <li>上传并解析合同</li>
  <li>核验合同字段</li>
  <li>扫描风险并按等级分流</li>
  <li>审核决定并导出报告</li>
</ol>

使用者先上传 PDF 或 DOCX 合同，由本地解析器生成文本；系统抽取合同双方、金额、日期和管辖法律，并把这些事实放到可见的核验节点。只有字段核验完成后才开始风险扫描，扫描结果再按高中低风险路由到不同审核路径，最后汇总决定并通过 SSE 将进度推回工作台。

## 项目亮点

### 让风险等级直接改变审核路径

风险扫描不会把所有条款送进同一个队列：高风险条款逐条审批，中风险条款批量确认，低风险条款自动通过。每项风险都保留依据与建议，审阅者可以从路由结果进入对应的审核路径，并在需要时转回人工处理。

<figure class="project-evidence">
  <img src="/projects/agent-teams-project/contracts.png" alt="合同审核工作流合同列表界面" width="1400" height="900" loading="lazy" />
  <figcaption>合同列表展示审核会话入口；图像来自仓库演示截图，使用演示数据。</figcaption>
</figure>

### 在扫描风险前先核验合同事实

本地 PDF/DOCX 解析器先生成文本，模型再抽取合同双方、金额、日期和管辖法律。字段核验是风险扫描前的明确检查点，审阅者可以先修正事实，再让后续扫描依据已确认的合同信息给出风险依据与建议。

### 把人工决策做成可恢复的流程节点

人工决定必须带备注，并以备注门控（note-gated）的幂等决定（idempotent decision）写入审核状态；重复提交不会重复生效。确认、编辑和驳回都可以撤销（undo），流程从中断点恢复（resume）后继续，SQLite 保存审核决定、审计记录和报告状态。

<figure class="project-evidence">
  <img src="/projects/agent-teams-project/upload.png" alt="合同审核工作流上传合同界面" width="1400" height="900" loading="lazy" />
  <figcaption>上传界面展示文件进入审核会话的入口；图像来自仓库演示截图，使用演示数据。</figcaption>
</figure>

## 系统架构

<figure class="project-architecture">
  <div class="project-architecture__scroller" data-project-architecture-scroller tabindex="0">
    <img src="/projects/agent-teams-project-architecture.svg" alt="合同审核多智能体工作流系统架构：React 工作台通过 FastAPI 连接字段提取、风险路由、人工决策和报告流" width="1400" height="760" />
  </div>
  <figcaption>架构图展示合同进入字段核验、风险分级路由、人工决策和报告输出的路径；SQLite 保存权威审核状态。</figcaption>
</figure>

React 工作台通过 FastAPI 进入合同、会话、字段、事件和报告接口。本地 PDF/DOCX 解析器先生成文本，字段核验完成后才由 LangGraph 扫描并路由风险；SQLite 持久化合同审核状态，SSE 将进行中的事件传回页面。

## 项目边界

这是一个以人工审核为核心的合同决策支持 MVP：认证仍是模拟请求头，文本解析和模型扫描依赖本地运行配置，报告输出为 JSON。它是决策支持工作流，不提供法律意见，也不对风险识别准确率作任何保证。
