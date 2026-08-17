---
title: 本地数据脱敏工作台
slug: ita-maskit
locale: zh
translationKey: ita-maskit
summary: 面向审计资料的本地数据脱敏工作台，以规则驱动的遮盖与确定性伪名化连接预览、执行和审计留痕。
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
  evidenceTarget: '#validation'
---

## 用户如何使用它

<ol class="project-flow" data-project-flow>
  <li>选择文件、规则集和可选人员数据</li>
  <li>预验证命中而不写出结果</li>
  <li>在本地执行遮盖或确定性伪名化</li>
  <li>查看统计、输出路径和审计日志</li>
</ol>

用户可以通过 CLI 或 Windows GUI 选择待处理文件与 YAML 规则集。规则先进入预验证流程，展示可能命中的列和数量；确认后，表格引擎与文本引擎在本地执行遮盖或伪名化，并把输出、统计和审计记录留在同一条处理边界内。

<figure class="project-evidence">
  <img src="/projects/ita-maskit/preview.png" alt="本地数据脱敏工作台规则预验证界面，展示文件、规则命中和待处理统计" width="980" height="520" loading="lazy" />
  <figcaption>预验证界面把文件、规则和命中统计放在正式执行之前；图像来自仓库，使用脚本演示数据。</figcaption>
</figure>

## 系统架构

<figure class="project-architecture">
  <div class="project-architecture__scroller" data-project-architecture-scroller>
    <img src="/projects/ita-maskit-architecture.svg" alt="本地数据脱敏工作台系统架构：CLI 与 Windows GUI 通过规则校验进入表格和文本引擎，经过遮盖或伪名化后输出统计与审计日志" width="1400" height="760" />
  </div>
  <figcaption>架构图把规则决策、格式引擎、伪名化配置与输出留痕分开；用户提供的 pepper 只作为配置进入伪名化，不作为存储数据。</figcaption>
</figure>

系统用同一套规则决策连接预验证与正式执行：表格数据进入按列处理的表格引擎，邮件、PDF、Word 等资料进入全文扫描的文本引擎，最终由遮盖或确定性伪名化策略生成输出和统计，并追加审计日志。

## 关键技术决策

### 把脱敏规则表达为版本化数据

规则集用 YAML 保存字段映射、匹配方式、遮盖模板和伪名化模板。规则变化时只调整数据配置，并由加载器校验版本和字段引用，避免把每一次业务规则变化都写进处理代码。

### 先归一化，再做域分离的 HMAC 伪名化

伪名化前先按字段规则归一化输入，再使用用户提供的 pepper 参与域分离的 HMAC。相同输入因此可以在不同文件中保持一致的替换关系，而 pepper 仍停留在运行配置边界中。

### 让预验证与执行复用同一条规则决策路径

预验证先报告命中数量和字段，再由正式处理沿用同一规则集执行，减少“预览看到的结果”和“最终写出的结果”之间的逻辑漂移。

<figure class="project-evidence">
  <img src="/projects/ita-maskit/rules.png" alt="本地数据脱敏工作台规则管理界面，展示 YAML 规则集和字段策略" width="820" height="560" loading="lazy" />
  <figcaption>规则管理界面展示字段策略和规则集入口；图像来自仓库，使用脚本演示数据。</figcaption>
</figure>

<section id="validation" class="project-validation">
  <h2>当前验证状态</h2>
  <table>
    <thead><tr><th>能力</th><th>状态</th><th>可核验证据</th></tr></thead>
    <tbody>
      <tr><th scope="row">完整 Python 测试套件</th><td>已通过</td><td>WSL Ubuntu 中实际运行：211 passed、1 skipped、1 xfailed，未启用可选规则生成服务。</td></tr>
      <tr><th scope="row">预验证 → 脱敏/伪名化 → 输出 → 审计日志</th><td>已复现</td><td>3 行合成混合 PII CSV 实际完成；预验证命中 12 次，重复 email 与 phone 伪名一致，输入文件未改变，审计记录 rows 为 3。</td></tr>
      <tr><th scope="row">遮盖列与伪名化列</th><td>已观察</td><td>本次输出中 name 采用遮盖，email、phone、notes 采用确定性伪名化；输出由仓库 CLI 生成。</td></tr>
    </tbody>
  </table>
</section>

## 限制与下一步

确定性伪名化不是加密，不能替代密钥管理或加密存储。PDF 的默认文本提取/重排路径以及图片 OCR 裁剪仍属于 beta 能力，可能改变版式或图像尺寸；原样 PDF 遮盖也是显式启用的 beta 路径。可选的规则生成服务只接收用户主动提供的规则描述或制度文档，脱敏数据不进入该调用，但这条服务边界仍需按实际部署环境评估。

Excel 中若把长标识符存成数字，文件格式本身可能先丢失精度，工具无法恢复被截断的末位；这类字段应保持为文本。在 WSL 中执行 `ruff check .` 得到 15 条 Ruff findings，因此本页不把静态检查写成通过；项目也不宣称通过任何认证或构成合规解决方案。下一步是在更多文件边界上补充可重复的 CLI 验收记录，并单独评估 beta 格式路径。
