---
title: Agent Teams Project
slug: agent-teams-project
locale: zh
translationKey: agent-teams-project
summary: 面向合同审核的多智能体工作流，包含上传到报告的流程、人工决策和 SSE 进度反馈。
published: 2026-08-16
updated: 2026-08-16
draft: false
status: completed
role: 独立开发者
tech: [LangGraph, Human-in-the-Loop, SSE, 多智能体]
repoUrl: https://github.com/ShaySha-PRa/Agent_Teams_Project
cover: ../../../assets/projects/agent-teams-project/cover.svg
gallery: []
featured: false
order: 3
evidence:
  - README 报告从合同上传到报告生成的流程、HITL decisions、SSE progress 和 11 个前端路由。
---

## 要解决的问题

合同审核需要把文件处理、多个智能体的判断和人的复核连成可追踪流程。项目关注上传到报告的完整路径，并在需要人工判断的位置保留 Human-in-the-Loop 决策。

## 我的设计与实现

我实现了从合同上传到报告的流程，将多智能体协作与 HITL decisions 放进工作流，并用 SSE progress 反馈处理进度。README 报告前端包含 11 个路由。

## 系统架构

系统围绕上传入口、智能体工作流、人工决策节点、报告输出和 SSE 进度通道组织。前端的 11 个路由覆盖这条工作流的不同操作界面；本页不从路由数量推断业务结果。

## 关键技术决策

LangGraph 用于表达多智能体流程和人工介入边界；SSE 用于把进行中的状态推送给前端。把上传到报告作为一条明确流程，有助于让 HITL decisions 出现在可定位的节点上。

## 结果与验证证据

README 报告了 contract upload-to-report flow、HITL decisions、SSE progress 和 11 个 frontend routes。这里使用仓库报告的术语与范围，不新增合同审核准确率或其他未报告指标。

## 已知限制与下一步

本页的结论限于 README 报告的流程、节点和路由范围，未把它们扩展为真实合同场景的效果承诺。下一步应继续补充真实流程验收，并记录人工决策边界的具体案例。
