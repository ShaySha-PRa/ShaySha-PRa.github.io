---
title: GraphRAG 知识探索工作台
slug: graphrag-agent
locale: zh
translationKey: graphrag-agent
summary: 将文档解析、实体关系、向量检索和可视化问答组织在同一套 GraphRAG 工作台中。
published: 2026-08-16
updated: 2026-08-17
draft: false
status: completed
role: 独立开发者
tech: [React, FastAPI, LangGraph, NetworkX, Chroma, D3.js]
repoUrl: https://github.com/ShaySha-PRa/GraphRAGAgent
cover: ../../../assets/projects/graphrag-agent/cover.png
gallery: []
featured: false
order: 2
evidence:
  - 仓库包含 React 前端、FastAPI 后端、文档索引流水线以及图谱与向量存储模块。
  - 页面截图来自 GraphRAGAgent 仓库的演示界面；本页不把截图或源码阅读写成运行指标。
caseStudy:
  category: AI 知识系统
  scope: 全栈 GraphRAG 工作台
---

## 项目解决什么

GraphRAGAgent 是一个面向本地资料的知识探索工作台。它先把文档整理成可追踪的页面，再自动抽取实体和关系，让用户可以在图谱、关系路径、局部子图与带来源的问答之间连续探索，而不必只从一段文本开始检索。

## 核心功能

<ul class="project-capabilities" data-project-capabilities>
  <li>上传文档并跟踪索引进度</li>
  <li>浏览实体关系图与节点详情</li>
  <li>按名称和类型搜索实体</li>
  <li>查询两个实体之间的关系路径</li>
  <li>搜索关键词相关的局部子图</li>
  <li>保存多轮问答并从引用节点返回图谱</li>
</ul>

## 使用流程

<ol class="project-flow" data-project-flow>
  <li>上传文档并整理页面</li>
  <li>抽取实体并建立索引</li>
  <li>浏览图谱并查询关系</li>
  <li>发起问答并回到引用节点</li>
</ol>

工作台先组装上传文档的页面内容，再由 LangExtract 抽取实体和关系；索引流程把结果合并进全局 NetworkX 图谱，同时写入 Chroma 向量索引。用户随后在 D3 图谱中浏览节点、查询关系或局部子图，再通过问答工具补充原文语义并查看引用。

## 项目亮点

### 从文档自动建立可探索图谱

仓库的页面组装先把上传文档整理成可处理内容，LangExtract 再抽取实体与关系；索引阶段把各页结果合并到全局 NetworkX 图谱，并同步写入 Chroma 向量索引。这样一次上传会留下可从页面走向实体、关系和语义检索的探索入口。

<figure class="project-evidence">
  <img src="/projects/graphrag-agent/graph.png" alt="GraphRAGAgent D3 知识图谱探索界面" width="1600" height="1000" loading="lazy" />
  <figcaption>图谱视图展示实体、关系和邻居探索；画面来自项目演示数据。</figcaption>
</figure>

### 让关系检索与原文语义共同回答

QA 工具围绕问题提供实体、邻居、路径和向量检索：先定位相关实体，再按邻居与关系路径补足结构上下文，并用向量检索补充原文语义。回答因此不只依赖单一文本片段，而是把关系上下文与来源语义一起组织出来。

### 在图谱探索与多轮问答之间连续切换

D3 探索、Ask AI 与聊天中的引用实体使用同一批节点，用户可以从图谱节点打开问答，再从引用节点返回图谱继续查看邻居和路径。多轮会话保留这条切换路径，让图谱探索和聊天不是两条分离的入口。

<figure class="project-evidence">
  <img src="/projects/graphrag-agent/chat.png" alt="GraphRAGAgent 多轮问答界面" width="1440" height="900" loading="lazy" />
  <figcaption>问答界面展示多轮对话和知识回答；画面来自项目演示数据。</figcaption>
</figure>

## 系统架构

<figure class="project-architecture">
  <div class="project-architecture__scroller" data-project-architecture-scroller tabindex="0">
    <img src="/projects/graphrag-agent-architecture.svg" alt="GraphRAG 知识探索工作台系统架构：React 工作台通过 FastAPI 连接索引、图谱、向量检索和问答路径" width="1400" height="760" />
  </div>
  <figcaption>架构图只展示应用边界、知识构建路径与输出关系；运行结果以验证矩阵为准。</figcaption>
</figure>

React 工作台通过 FastAPI 接收文档、图谱浏览和问答请求。索引流水线把资料整理为 NetworkX 图谱和 Chroma 向量索引，QA Agent 再把两类检索结果组织成回答与图谱输出。

## 项目边界

这是一个结合图谱构建、关系检索和多轮问答的本地文档知识探索工作台。它不提供多用户协作、租户隔离或企业知识治理。
