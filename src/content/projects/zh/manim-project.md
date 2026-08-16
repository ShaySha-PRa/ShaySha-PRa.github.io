---
title: Manim Project
slug: manim-project
locale: zh
translationKey: manim-project
summary: 面向 AI 数学动画的任务系统，围绕不可变版本链、Redis 队列、隔离 Runner 和预览/最终产物组织渲染流程。
published: 2026-08-16
updated: 2026-08-16
draft: false
status: experiment
role: 独立开发者
tech: [Python, Manim, Redis, Runner, 任务队列]
repoUrl: https://github.com/ShaySha-PRa/Manim_project
cover: ../../../assets/projects/manim-project/cover.svg
gallery: []
featured: false
order: 4
evidence:
  - README 报告 immutable version chain、Redis queue、isolated Runner，以及 Preview/Final artifacts。
---

## 要解决的问题

数学动画生成既需要记录版本变化，也需要把渲染任务和执行环境隔离开。这个实验项目探索如何把 AI 生成、队列调度与预览/最终产物连接起来。

## 我的设计与实现

我围绕 immutable version chain 保存版本关系，用 Redis queue 组织任务，并将渲染放进 isolated Runner。流程区分 Preview 和 Final artifacts，以便把不同阶段的输出明确分开。

## 系统架构

系统由版本链、Redis 队列、隔离 Runner 和产物路径组成。任务进入队列后由 Runner 执行，预览与最终产物分别落在对应的输出边界；这里不推断队列吞吐或渲染成功率。

## 关键技术决策

不可变版本链保留每次变更的关系；Redis queue 将任务提交与 Runner 执行解耦；isolated Runner 划出渲染执行边界。Preview/Final 分层让实验过程中的中间产物和最终产物不混在一起。

## 结果与验证证据

README 报告 immutable version chain、Redis queue、isolated Runner 和 Preview/Final artifacts。这些是仓库给出的结构性证据，本项目仍标记为实验项目，不扩写成稳定生产能力。

## 已知限制与下一步

实验状态意味着真实渲染场景、任务规模和产物质量仍需要进一步验收。本页不添加 README 未给出的成功率或性能指标；下一步是围绕具体动画任务补充可重复的验证记录。
