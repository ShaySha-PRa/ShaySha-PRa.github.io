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

## 用户如何使用它

<ol class="project-flow" data-project-flow>
  <li>创建知识源</li>
  <li>导入资料</li>
  <li>发起查询</li>
  <li>查看回答与来源</li>
</ol>

团队成员从同一个工作台进入不同知识路径。统一入口负责知识源与权限边界，各模块保留适合自身资料形态的解析、检索和引用方式。

## 系统架构

<figure class="project-architecture">
  <div class="project-architecture__scroller" data-project-architecture-scroller tabindex="0">
    <img src="/projects/my-company-brain-architecture.svg" alt="My Company Brain 系统架构：Web 经统一 API 进入 Agent Gateway，并连接三条知识路径" />
  </div>
  <figcaption>架构图证明 Web、统一 API、Agent Gateway 与三条知识路径的代码边界；运行结论以验证矩阵为准。</figcaption>
</figure>

Web 只进入统一 API，由 Agent Gateway 将能力编排到 Nano Brain、Traditional RAG 与 GraphRAG。身份、平台、Agent 和三条知识路径划分为六个 PostgreSQL 逻辑数据库，GraphRAG 另用 Neo4j 保存图数据。

## 三个关键技术决策

### 统一 API 是治理边界

前端不直接连接各知识服务。统一 API 处理身份与知识源访问边界，Agent Gateway 只通过受保护的 HTTP Tools 与 MCP 适配器调用模块能力。

### 三条知识路径保持独立

Nano Brain、Traditional RAG 与 GraphRAG 面向不同资料形态和检索目标。Traditional RAG 组合关键词、字面与向量召回并以 RRF 融合候选；GraphRAG 独立承担实体关系与图查询。

### Compose 是可重复运行边界

数据库迁移、初始化、服务健康检查与本机端口约束都进入 Compose 和启动脚本，避免把“代码存在”误写成“环境已验证”。

## 限制与下一步

当前最重要的缺口是使用真实团队资料完成三条知识路径、浏览器全路由与权限矩阵的端到端验收。生产环境部署、负载和长期运行稳定性不在当前结论范围内。
