---
title: NL2SQL 数据分析工作台
slug: sql-agent
locale: zh
translationKey: sql-agent
summary: 把自然语言问题、检索上下文、SQL 执行与表格图表结果串成一条可观察的数据分析工作流。
published: 2026-08-16
updated: 2026-08-17
draft: false
status: completed
role: 独立开发者
tech: [React, FastAPI, LangChain, Vanna, Milvus, MySQL, SSE]
repoUrl: https://github.com/ShaySha-PRa/SQLAgent
cover: ../../../assets/projects/sql-agent/cover.png
gallery: []
featured: false
order: 5
evidence:
  - 仓库主链路包含 React、FastAPI、LangChain/Vanna、Milvus、本地 Embedding、MySQL 与 SSE；CSV 问答原型不作为本项目主路径。
  - 页面图像来自仓库 docs/images 的首页、查询结果和 API 文档截图；使用演示或合成数据，不宣称准确率。
caseStudy:
  category: 数据平台
  scope: 全栈 NL2SQL 助手
  evidenceTarget: '#validation'
---

## 用户如何使用它

<ol class="project-flow" data-project-flow>
  <li>输入自然语言问题</li>
  <li>检索上下文并生成 SQL</li>
  <li>验证并执行查询</li>
  <li>查看表格、图表与回答</li>
</ol>

用户在 React 工作台中输入问题，FastAPI 将请求交给 NL2SQL Agent。Agent 从 DDL、业务文档和 SQL 示例中检索上下文，生成 SQL 后交给验证与执行工具访问 MySQL，最后通过 SSE 把步骤、数据、图表配置和回答传回页面。

## 系统架构

<figure class="project-architecture">
  <div class="project-architecture__scroller" data-project-architecture-scroller>
    <img src="/projects/sql-agent-architecture.svg" alt="NL2SQL 数据分析工作台系统架构：React 工作台通过 FastAPI 调度 NL2SQL Agent、向量检索、MySQL 查询和 SSE 结果" width="1400" height="760" />
  </div>
  <figcaption>架构图保留 Vanna/LangChain 主链路，把上下文检索与数据库查询分开；原始 SQL 执行接口的安全边界不在图中扩展。</figcaption>
</figure>

NL2SQL Agent 位于 FastAPI 之后，统一调度检索工具和数据库工具。DDL、业务文档和历史 SQL 示例进入向量存储，用于补充 schema 与业务语境；生成的 SQL 经过校验后执行，结果通过 SSE 回到 React 工作台。

<figure class="project-evidence">
  <img src="/projects/sql-agent/query-result.png" alt="SQLAgent 自然语言查询结果界面" width="1500" height="940" loading="lazy" />
  <figcaption>查询结果界面展示自然语言问题、生成 SQL、结果表格、图表与分析回答；画面来自仓库演示截图。</figcaption>
</figure>

## 三个关键技术决策

### 把 schema、文档和 SQL 示例作为检索上下文

NL2SQL 不只依赖问题文本。系统将 DDL、业务文档和历史 SQL 示例纳入向量检索，让 Agent 在生成语句前获得表结构和业务命名的上下文；CSV 问答原型保持为独立实验，不混入主架构叙述。

### 让 Agent 通过工具分开检索与执行

LangChain/LangGraph Agent 负责理解问题、组织步骤并调用工具；检索工具负责获取表结构上下文，数据库工具负责 SQL 校验、版本检查和执行。这样的边界使失败点能落在检索、生成或执行中的具体阶段。

### 用 SSE 把中间步骤和结果送回工作台

FastAPI 的流式接口可向 React 推送 Agent 步骤、查询数据、图表配置和最终回答。前端因此能同时呈现 SQL、表格、图表与文字解释，而不是只等待一个不可观察的最终响应。

<figure class="project-evidence">
  <img src="/projects/sql-agent/api-docs.png" alt="SQLAgent FastAPI API 文档界面" width="1400" height="900" loading="lazy" />
  <figcaption>API 文档界面展示 FastAPI 服务的对话、训练数据、数据库与查询接口；画面来自仓库演示截图。</figcaption>
</figure>

<section id="validation" class="project-validation">
  <h2>当前验证状态</h2>
  <table>
    <thead><tr><th>能力</th><th>状态</th><th>可核验证据</th></tr></thead>
    <tbody>
      <tr><th scope="row">React 工作台、FastAPI、NL2SQL Agent 与主链路组件</th><td>已确认代码边界</td><td>仓库目录、API 服务入口、Agent 工具定义与本页架构图；不写成端到端运行成功。</td></tr>
      <tr><th scope="row">Vanna 测试与 Python 依赖</th><td>未复现</td><td>本轮执行仓库测试时环境缺少 <code>vanna</code> 依赖，测试在收集阶段停止；不声明测试通过数量。</td></tr>
      <tr><th scope="row">本地 MySQL、Milvus、Embedding 与 MiniMax 驱动的合成数据查询</th><td>未复现</td><td>本轮环境未提供所需服务与可用模型凭据，未完成“导入资料 → 检索 → 生成/校验/执行 SQL → 结果”闭环。</td></tr>
      <tr><th scope="row">查询结果表格、图表与回答的 SSE 展示</th><td>代码路径已确认</td><td>API 服务包含流式事件处理与结果序列化逻辑；未把演示截图写成实时运行证据。</td></tr>
      <tr><th scope="row">NL2SQL 准确率、延迟或生产负载</th><td>未声明</td><td>本轮没有独立评测或压测结果。</td></tr>
    </tbody>
  </table>
</section>

## 限制与下一步

当前展示以仓库的 Vanna/LangChain 主链路为准，截图使用演示或合成数据。开发配置允许宽泛 CORS；直接 SQL 查询接口会执行传入语句，页面不把它描述为已完成的 SQL sandbox。运行时仍存在全局客户端状态，CSV 问答是分离的原型路径，也不能从组件组成推导通用 NL2SQL 准确率。下一步是在隔离环境中补齐依赖、服务和模型配置，使用脱敏合成数据完成一条可重复的检索、生成、校验、执行与 SSE 验收记录。
