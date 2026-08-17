---
title: My Company Brain
slug: my-company-brain
locale: zh
translationKey: my-company-brain
summary: 面向企业团队的多知识库平台，将文档知识、关系知识、知识页面和知识助理组织在一个可治理工作台中。
published: 2026-08-16
updated: 2026-08-17
draft: false
status: active
role: 独立开发者
tech: [TypeScript, Python, PostgreSQL, Neo4j, Docker, RAG, GraphRAG]
repoUrl: https://github.com/ShaySha-PRa/my-company-brain
cover: ../../../assets/projects/my-company-brain/workspace.png
gallery: []
featured: true
order: 1
evidence:
  - 代码包含 Web、统一 API、Agent Gateway、三条知识链路和 Compose 部署定义。
  - 当前仓库记录了自动检查与本机 Compose 服务状态，真实资料端到端验收仍待完成。
caseStudy:
  category: 企业知识平台 / RAG + Agent
  scope: 3 条知识路径
---

## 项目解决什么

My Company Brain 面向企业团队，把知识源、业务场景与可追溯问答放进同一可治理工作台。团队成员可以按资料形态选择知识路径、连续追问并回看来源，同时由公开、本人私有和团队授权范围约束每次检索。

## 核心功能

<ul class="project-capabilities" data-project-capabilities>
  <li>管理知识源与可见范围</li>
  <li>导入文档、表格与知识页面</li>
  <li>创建业务场景与处理任务</li>
  <li>跨知识路径发起连续问答</li>
  <li>查看片段、页面、表格和图片来源</li>
  <li>管理用户、知识资产与运行状态</li>
</ul>

## 使用流程

<ol class="project-flow" data-project-flow>
  <li>创建知识源</li>
  <li>导入资料</li>
  <li>发起查询</li>
  <li>查看回答与来源</li>
</ol>

先创建知识源并设定可见范围，再导入资料或知识页面；成员选择业务场景发起问题，系统跨适合的路径组合回答，最后展开片段、页面、表格和图片来源。

## 项目亮点

### 让不同资料走适合自己的知识路径

仓库中的 Agent Gateway 按资料类型把请求路由到对应模块：Nano Brain 处理页面、事实和链接，Traditional RAG 负责文档与表格检索，GraphRAG 处理实体与关系。结果是团队可以复用同一工作台，又不必把所有知识压成同一种索引。

### 在一次问答中组合知识并保留来源

全局问答可以在同一次回答中合并多条知识路径，响应仍返回 passage、page、table、image 来源，让用户能从结论回到具体材料。仓库的跨模块问答编排与统一来源模型支撑这个结果，而不是只拼接无出处的文本。

### 把权限判断带到实际检索中

公开、本人私有和团队授权的 authorization 会在模块查询边界再次检查；统一 API 与 Agent Gateway 只是入口，实际知识查询仍携带可见范围过滤。仓库把权限复核放在 module query boundaries，而不是只在 UI 隐藏按钮，避免用户绕过界面后读到越权内容。

## 系统架构

<figure class="project-architecture">
  <div class="project-architecture__scroller" data-project-architecture-scroller tabindex="0">
    <img src="/projects/my-company-brain-architecture.svg" alt="My Company Brain 系统架构：Web 经统一 API 进入 Agent Gateway，并连接三条知识路径" />
  </div>
  <figcaption>架构图证明 Web、统一 API、Agent Gateway 与三条知识路径的代码边界；运行结论以验证矩阵为准。</figcaption>
</figure>

Web 只进入统一 API，由 Agent Gateway 将能力编排到 Nano Brain、Traditional RAG 与 GraphRAG。身份、平台、Agent 和三条知识路径划分为六个 PostgreSQL 逻辑数据库，GraphRAG 另用 Neo4j 保存图数据。

## 项目边界

当前范围是可自托管的团队知识工作台，结论基于仓库中的代码、Compose 定义与本机运行边界。项目不宣称生产级高可用（production HA）、企业 SSO（enterprise SSO）或大规模负载（large-scale load）能力；这些场景需要独立的部署、身份与压测验证。
