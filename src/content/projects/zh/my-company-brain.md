---
title: My Company Brain
slug: my-company-brain
locale: zh
translationKey: my-company-brain
summary: 面向企业团队的多知识库平台，将文档知识、关系知识、知识页面和知识助理组织在一个可治理工作台中。
published: 2026-08-16
updated: 2026-08-16
draft: false
status: active
role: 独立开发者
tech: [TypeScript, Python, PostgreSQL, Neo4j, Docker, RAG, GraphRAG]
repoUrl: https://github.com/ShaySha-PRa/my-company-brain
cover: ../../../assets/projects/my-company-brain/cover.svg
gallery: []
featured: true
order: 1
evidence:
  - 代码包含 Web、统一 API、Agent Gateway、三条知识链路和 Compose 部署定义。
  - 当前仓库记录了自动检查与本机 Compose 服务状态，真实资料端到端验收仍待完成。
---

## 要解决的问题

企业团队的文档、关系知识、知识页面和问答入口容易分散在不同工具里。这个项目尝试把这些知识路径放进同一个可治理的工作台，同时保留对资料来源和验收边界的清晰说明。

## 我的设计与实现

代码包含 Web、统一 API 和 Agent Gateway，并组织了文档知识、关系知识与知识页面/知识助理三条知识链路。当前页面描述的是仓库中的实现范围，不把仍未完成的真实资料验收写成已交付结果。

## 系统架构

仓库中的结构以 Web 进入统一 API，再由 Agent Gateway 连接各条知识链路。PostgreSQL 与 Neo4j 分别承担关系型资料和图谱相关的数据边界，Compose 文件描述本机服务编排。

## 关键技术决策

TypeScript 与 Python 分别用于 Web/API 和智能代理相关代码；RAG 与 GraphRAG 用于组织检索路径；Docker Compose 让本机服务状态可以被检查。这里记录的是代码中的技术选择，不推断尚未验收的运行效果。

## 结果与验证证据

当前仓库记录了自动检查结果与本机 Compose 服务状态。代码包含上述模块和部署定义，但真实资料端到端验收仍待完成，因此本页不将其表述为生产验证能力。

## 已知限制与下一步

真实资料端到端验收仍待完成，知识路径在真实团队资料上的覆盖和边界也仍需确认。下一步应继续补齐资料驱动的端到端验收，并在验收完成前保持“代码包含”“README 报告”“仍待验收”等限定语。
