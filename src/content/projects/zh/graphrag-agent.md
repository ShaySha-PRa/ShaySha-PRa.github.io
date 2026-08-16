---
title: GraphRAGAgent
slug: graphrag-agent
locale: zh
translationKey: graphrag-agent
summary: 结合知识图谱、向量检索、D3 可视化和多轮问答的知识探索应用。
published: 2026-08-16
updated: 2026-08-16
draft: false
status: completed
role: 独立开发者
tech: [GraphRAG, REST API, D3.js, 向量检索]
repoUrl: https://github.com/ShaySha-PRa/GraphRAGAgent
cover: ../../../assets/projects/graphrag-agent/cover.svg
gallery: []
featured: false
order: 2
evidence:
  - README 报告 25 个 REST endpoints、5 个前端页面、D3 graph 和 44 个 integration tests。
---

## 要解决的问题

知识问答需要同时呈现检索到的上下文和知识之间的关系。这个项目把 GraphRAG、向量检索、多轮问答和图谱可视化放进一个可访问的应用结构中。

## 我的设计与实现

我围绕 REST API、前端页面和 D3 图谱视图组织应用，让问答流程与知识关系视图能够在同一套界面中使用。README 报告了 25 个 REST endpoints 和 5 个前端页面，这些数字作为仓库证据保留。

## 系统架构

应用由 REST API、检索与问答路径、前端页面以及 D3 graph 视图组成。向量检索用于召回相关内容，图谱路径用于呈现实体关系；本页不从架构推断未被 README 报告的运行结果。

## 关键技术决策

选择 GraphRAG 与向量检索组合，是为了同时保留语义召回和关系探索；D3 用于在前端表达图谱。REST API 作为前后端边界，便于把问答与图谱展示拆成可检查的接口。

## 结果与验证证据

README 报告 25 个 REST endpoints、5 个前端页面、D3 graph，以及 44 个 integration tests。这里仅复述仓库报告的证据，不新增性能指标或外部验收结论。

## 已知限制与下一步

本页的验证范围以 README 报告和仓库中的测试为边界，未延伸为生产规模或真实用户结果。下一步可以在保持现有接口与图谱视图边界的前提下补充更具体的真实资料验收。
