---
title: SQLAgent
slug: sql-agent
locale: zh
translationKey: sql-agent
summary: 将自然语言转 SQL、RAG 上下文、Milvus、MySQL 和 SSE 结果图表连接起来的数据查询代理。
published: 2026-08-16
updated: 2026-08-16
draft: false
status: completed
role: 独立开发者
tech: [NL2SQL, RAG, Milvus, MySQL, SSE]
repoUrl: https://github.com/ShaySha-PRa/SQLAgent
cover: ../../../assets/projects/sql-agent/cover.svg
gallery: []
featured: false
order: 5
evidence:
  - README 报告 NL2SQL flow、RAG context、Milvus、MySQL、SSE results 和 charts。
---

## 要解决的问题

让用户用自然语言查询数据，需要把问题理解、数据库结构上下文、SQL 执行和结果展示串成一条可观察流程。SQLAgent 聚焦这条 NL2SQL 路径及其结果反馈。

## 我的设计与实现

我将 NL2SQL flow 与 RAG context 组合起来，为查询生成提供上下文；Milvus 和 MySQL 分别位于检索与数据库边界，SSE 用于传递 results 和 charts。

## 系统架构

系统围绕自然语言输入、RAG context、NL2SQL、MySQL 查询执行、SSE 结果流和图表展示组织。Milvus 承担向量检索边界，MySQL 承担数据库查询边界；本页不从这些组件推断未报告的准确率。

## 关键技术决策

RAG context 为 NL2SQL 提供资料边界；Milvus 处理向量检索，MySQL 保持查询数据源清晰；SSE 让结果和 charts 可以沿查询流程返回前端。每项决策都对应 README 报告的组件或路径。

## 结果与验证证据

README 报告 NL2SQL flow、RAG context、Milvus、MySQL、SSE results 和 charts。这里仅记录仓库给出的能力组成，不新增查询准确率、延迟或数据规模等指标。

## 已知限制与下一步

本页不把组件链路等同于真实数据场景的效果保证。下一步可围绕不同数据库结构和自然语言问题补充可重复的验收记录，同时继续明确检索、查询和结果展示的边界。
