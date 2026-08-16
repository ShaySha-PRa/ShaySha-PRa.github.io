---
title: ITA-Maskit
slug: ita-maskit
locale: zh
translationKey: ita-maskit
summary: 本地运行的数据脱敏工具，以确定性伪名化、桌面 GUI 和安全边界处理大规模表格数据。
published: 2026-08-16
updated: 2026-08-16
draft: false
status: completed
role: 独立开发者
tech: [Python, GUI, 确定性伪名化, 本地处理]
repoUrl: https://github.com/ShaySha-PRa/ITA-Maskit
cover: ../../../assets/projects/ita-maskit/cover.svg
gallery: []
featured: false
order: 6
evidence:
  - README 报告 local processing、deterministic pseudonymization、GUI，以及 1M-row benchmarks 和测试数量。
---

## 要解决的问题

数据脱敏经常涉及敏感资料，处理边界和可重复性都很重要。ITA-Maskit 聚焦本地处理、确定性伪名化和桌面 GUI，让脱敏流程在本机完成并可被操作。

## 我的设计与实现

我围绕 local processing 设计流程，用 deterministic pseudonymization 保持同一输入的替换关系，并提供 GUI 作为操作入口。README 报告了 1M-row benchmarks 和测试数量。

## 系统架构

系统由本地处理路径、伪名化逻辑、桌面 GUI 和输入/输出边界组成。资料在本机进入处理流程，GUI 负责操作和结果反馈；本页不从“本地”一词推断额外的合规结论。

## 关键技术决策

选择 local processing 是为了明确数据不必离开本地处理边界；deterministic pseudonymization 让替换关系可重复；GUI 则把处理步骤暴露给桌面用户。这些决策对应 README 报告的能力。

## 结果与验证证据

README 报告 local processing、deterministic pseudonymization、GUI，以及 1M-row benchmarks 和测试数量。这里保留 README 的 benchmark 与测试证据，不新增脱敏质量或安全认证结论。

## 已知限制与下一步

本页不把 README 报告的 benchmark 或测试数量扩展成所有数据形态下的保证。下一步可继续覆盖不同输入边界，并在保持本地处理和确定性伪名化语义的前提下记录验证结果。
