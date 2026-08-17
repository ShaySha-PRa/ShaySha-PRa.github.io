---
title: 本地数据脱敏工作台
slug: ita-maskit
locale: zh
translationKey: ita-maskit
summary: 面向审计资料的本地数据保护工作台，用双引擎、可维护规则和确定性伪名化连接预览、执行与审计留痕。
published: 2026-08-16
updated: 2026-08-17
draft: false
status: completed
role: 独立开发者
tech: [Python, Polars, PyQt5, YAML 规则, 确定性伪名化]
repoUrl: https://github.com/ShaySha-PRa/ITA-Maskit
cover: ../../../assets/projects/ita-maskit/cover.png
gallery: []
featured: false
order: 6
evidence:
  - WSL Ubuntu 中完整 Python suite 实际结果为 211 passed、1 skipped、1 xfailed；未启用可选规则生成服务。
  - 合成混合 PII CSV 的 CLI 流程实际完成预验证、脱敏/伪名化、输出与审计留痕；截图使用仓库的脚本演示数据。
caseStudy:
  category: 数据隐私
  scope: CLI + Windows 桌面应用
---

## 项目解决什么

审计资料往往同时包含表格、JSON、邮件、PDF 和 Word，人工处理既容易遗漏，也难以让同一个人或员工标识在不同文件中保持可追踪的替身。ITA-Maskit 把规则选择、命中预览、本地处理和版本化审计记录串成一条工作流，让敏感值离开原始文件后仍能保留必要的关联关系。

## 核心功能

<ul class="project-capabilities" data-project-capabilities>
  <li>通过 CLI 或 Windows GUI 选择规则并批量处理</li>
  <li>在本地处理表格、JSON、邮件、PDF 和 Word</li>
  <li>正式写出前预览规则命中与样例变化</li>
  <li>选择遮盖或确定性伪名化</li>
  <li>使用人员清单补足姓名与员工标识匹配</li>
  <li>查看统计、输出位置和版本化审计日志</li>
</ul>

## 使用流程

<ol class="project-flow" data-project-flow>
  <li>选择文件、规则集和可选人员数据</li>
  <li>预验证命中而不写出结果</li>
  <li>在本地执行遮盖或确定性伪名化</li>
  <li>查看统计、输出路径和审计日志</li>
</ol>

使用者可以通过 CLI 或 Windows GUI 选择文件、规则集和人员清单。系统先预览规则命中与样例变化，确认后才在本地批量写出结果；统计、输出位置和版本化审计日志留在同一条处理边界内。

## 项目亮点

### 用双引擎覆盖表格与文档

按列处理的表格引擎适合表格数据，可在字段边界上应用规则；全文文档引擎则扫描 JSON、邮件、PDF、Word 等文档内容。两条路径都在本地运行，并沿用同一套预览与规则决策，让跨格式的批量审计资料处理保持可检查。

<figure class="project-evidence">
  <img src="/projects/ita-maskit/preview.png" alt="本地数据脱敏工作台规则预验证界面，展示文件、规则命中和待处理统计" width="980" height="520" loading="lazy" />
  <figcaption>预验证界面把文件、规则命中和样例变化放在正式写出之前；图像来自仓库，使用脚本演示数据。</figcaption>
</figure>

### 把脱敏规则变成可维护的数据

规则以 YAML 保存字段映射、匹配策略、遮盖模板和伪名化模板，并把规则版本与处理代码分开。业务规则变化时只需更新经过校验的数据配置；预览和正式执行复用同一版本，减少规则漂移。

### 保留跨文件关联而不暴露原值

系统先按字段策略归一化输入，再使用用户提供的 pepper 做域分离的 HMAC。相同的归一化值在不同文件中会得到稳定的确定性别名，人员清单还可以补足姓名和员工标识的匹配；原始值不会作为别名暴露，pepper 也只停留在运行配置中。

<figure class="project-evidence">
  <img src="/projects/ita-maskit/rules.png" alt="本地数据脱敏工作台规则管理界面，展示 YAML 规则集和字段策略" width="820" height="560" loading="lazy" />
  <figcaption>规则管理界面展示 YAML 规则版本、字段策略和规则集入口；图像来自仓库，使用脚本演示数据。</figcaption>
</figure>

## 系统架构

<figure class="project-architecture">
  <div class="project-architecture__scroller" data-project-architecture-scroller tabindex="0">
    <img src="/projects/ita-maskit-architecture.svg" alt="本地数据脱敏工作台系统架构：CLI 与 Windows GUI 通过规则校验进入表格和文本引擎，经过遮盖或伪名化后输出统计与审计日志" width="1400" height="760" />
  </div>
  <figcaption>架构图把规则决策、格式引擎、伪名化配置与输出留痕分开；用户提供的 pepper 只作为配置进入伪名化，不作为存储数据。</figcaption>
</figure>

同一版本的规则先驱动预览，再分别进入按列的表格引擎或全文的文档引擎。遮盖或确定性伪名化完成后，系统输出处理结果、统计和版本化审计日志；整个过程不需要把审计文件发送到外部服务。

## 项目边界

这是一个面向审计资料的本地处理工具，不宣称通过认证或替代部署环境中的访问控制、密钥管理与加密存储；截图使用仓库的脚本演示数据。确定性伪名化不是加密，图片 OCR 与保持版式的 PDF 脱敏仍处于 beta。
