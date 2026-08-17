---
title: NL2SQL 数据分析工作台
slug: sql-agent
locale: zh
translationKey: sql-agent
summary: 把自然语言问题、业务语境、可观察的查询步骤与 SQL、数据、图表和解读串成一条分析交付工作流。
published: 2026-08-16
updated: 2026-08-17
draft: false
status: completed
role: 独立开发者
tech: [React, FastAPI, LangChain, Vanna, Milvus, MySQL, SSE]
repoUrl: https://github.com/ShaySha-PRa/SQLAgent
cover: ../../../assets/projects/sql-agent/cover.png
gallery: []
featured: false
order: 5
evidence:
  - 仓库主链路包含 React、FastAPI、LangChain/Vanna、Milvus、本地 Embedding、MySQL 与 SSE；CSV 问答原型不作为本项目主路径。
  - 页面图像来自仓库 docs/images 的首页、查询结果和 API 文档截图；使用演示或合成数据，不宣称准确率。
caseStudy:
  category: 数据平台
  scope: 全栈 NL2SQL 助手
---

## 项目解决什么

业务数据分析的难点不只是把问题翻译成 SQL，而是让系统理解已知数据库里的表结构、业务命名和历史查询习惯，并让分析过程可以被检查、定位和复用。这个工作台把自然语言问题、三类检索上下文、SQL 查询和多格式结果放进同一条工作流，让使用者能从问题一路跟到 SQL、数据、图表与文字解读。

## 核心功能

<ul class="project-capabilities" data-project-capabilities>
  <li>用自然语言查询业务数据库</li>
  <li>管理 DDL、业务文档和历史 SQL 示例</li>
  <li>保存多轮分析上下文</li>
  <li>生成、查看、校验并执行 SQL</li>
  <li>在结果表格中检查数据</li>
  <li>自动生成图表与文字分析</li>
</ul>

## 使用流程

<ol class="project-flow" data-project-flow>
  <li>输入自然语言问题</li>
  <li>检索上下文并生成 SQL</li>
  <li>验证并执行查询</li>
  <li>查看表格、图表与回答</li>
</ol>

使用者在 React 工作台中提出问题，系统先检索 DDL、业务文档和历史 SQL 示例，再生成面向已知数据库的查询。检索命中、SQL 草稿、校验反馈、执行状态和最终解读都作为可观察步骤回到工作台；多轮对话保留分析上下文，让后续问题可以接着同一份分析继续推进。

## 项目亮点

### 用三类知识补足 SQL 语境

系统把 DDL、业务文档和历史 SQL 示例分别作为结构、业务语义和查询习惯的上下文来源。三类知识在生成 SQL 前共同补足问题文本，让 Agent 能依据表结构和业务命名组织查询，而不是只猜测字段；CSV 问答原型仍保持为独立实验路径。

### 让查询过程可观察、可定位

工作流把检索、生成、校验、执行和解读拆成可以回看的阶段。使用者能看到系统取到了什么上下文、生成了哪段 SQL、校验如何反馈、查询是否执行，以及结果如何被解释；当结果不符合预期时，可以把问题定位到具体阶段，而不是只面对一个不可解释的最终回答。

<figure class="project-evidence">
  <img src="/projects/sql-agent/api-docs.png" alt="SQLAgent 可用查询与训练接口文档界面" width="1400" height="900" loading="lazy" />
  <figcaption>API 文档截图展示可用的对话、训练数据、数据库和查询操作面，作为查询与训练的可用界面证据；画面来自仓库演示截图。</figcaption>
</figure>

### 一次交付 SQL、数据、图表与解读

查询完成后，工作台同时保留生成的 SQL、结果表格、图表配置和文字分析。使用者可以先检查数据，再结合图表和解读判断结论；SSE 把中间步骤和结果送回页面，让一次自然语言提问落成可检查的完整交付物。

<figure class="project-evidence">
  <img src="/projects/sql-agent/query-result.png" alt="SQLAgent 查询结果工作台界面" width="1500" height="940" loading="lazy" />
  <figcaption>查询结果界面可见 SQL 编辑器、结果表格、图表和输入区域，展示 SQL、数据与分析交付如何汇合；画面来自仓库演示截图。</figcaption>
</figure>

## 系统架构

<figure class="project-architecture">
  <div class="project-architecture__scroller" data-project-architecture-scroller tabindex="0">
    <img src="/projects/sql-agent-architecture.svg" alt="NL2SQL 数据分析工作台系统架构：React 工作台通过 FastAPI 调度 NL2SQL Agent、向量检索、MySQL 查询和 SSE 结果" width="1400" height="760" />
  </div>
  <figcaption>架构图保留 Vanna/LangChain 主链路，把上下文检索与数据库查询分开；原始 SQL 执行接口的安全边界不在图中扩展。</figcaption>
</figure>

React 工作台通过 FastAPI 连接 NL2SQL Agent。Agent 从包含 DDL、业务文档和历史 SQL 示例的向量存储获取上下文，再调用 SQL 校验与执行工具访问 MySQL；结果和中间步骤通过 SSE 回到页面，汇合为 SQL、表格、图表与文字分析。数据库权限、SQL sandbox 和最终人工复核不由这条应用链路单独保证，仍是部署环境中的外部 safeguards。

## 项目边界

这是一个面向已知数据库的分析助手，不宣称对任意数据库或任意自然语言都具备通用 NL2SQL 能力。截图使用演示或合成数据，不能从组件组成推导准确率；CSV 问答也不属于主路径。数据库权限控制、执行隔离（sandboxing）和人工审阅仍是外部 safeguards，需要由部署环境和使用流程补足。
