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
  evidenceTarget: '#validation'
---

## 用户如何使用它

<ol class="project-flow" data-project-flow>
  <li>上传文档</li>
  <li>解析并建立索引</li>
  <li>探索知识图谱</li>
  <li>发起追问并查看回答</li>
</ol>

用户从工作台上传一份资料，等待解析和索引完成后进入图谱视图，沿实体关系探索上下文，再通过问答入口发起追问。图谱与向量检索分别保留结构关系和语义上下文，最终在同一个工作流里呈现。

## 系统架构

<figure class="project-architecture">
  <div class="project-architecture__scroller" data-project-architecture-scroller>
    <img src="/projects/graphrag-agent-architecture.svg" alt="GraphRAG 知识探索工作台系统架构：React 工作台通过 FastAPI 连接索引、图谱、向量检索和问答路径" width="1400" height="760" />
  </div>
  <figcaption>架构图只展示应用边界、知识构建路径与输出关系；运行结果以验证矩阵为准。</figcaption>
</figure>

React 工作台通过 FastAPI 接收文档、图谱浏览和问答请求。索引流水线把资料整理为 NetworkX 图谱和 Chroma 向量索引，QA Agent 再把两类检索结果组织成回答与图谱输出。

<figure class="project-evidence">
  <img src="/projects/graphrag-agent/graph.png" alt="GraphRAGAgent D3 知识图谱探索界面" width="1600" height="1000" loading="lazy" />
  <figcaption>图谱视图展示实体、关系和邻居探索；画面来自项目演示数据。</figcaption>
</figure>

## 三个关键技术决策

### 把图谱和向量索引放在同一条知识路径中

向量索引负责补充语义上下文，NetworkX 图谱负责保留实体与关系。两者各自承担清晰职责，问答路径再按问题组织所需的检索结果。

### 用 FastAPI 固定前后端边界

React 不直接操作文件、图谱或向量存储。FastAPI 统一承接上传、索引状态、图谱查询和问答请求，让页面交互与知识处理保持可替换的边界。

### 把图谱浏览作为一等交互

D3 图谱不是问答结果的装饰，而是独立的探索入口。用户可以先从实体关系建立上下文，再回到问答路径继续追问。

<figure class="project-evidence">
  <img src="/projects/graphrag-agent/chat.png" alt="GraphRAGAgent 多轮问答界面" width="1440" height="900" loading="lazy" />
  <figcaption>问答界面展示多轮对话和知识回答；画面来自项目演示数据。</figcaption>
</figure>

<section id="validation" class="project-validation">
  <h2>当前验证状态</h2>
  <table>
    <thead><tr><th>能力</th><th>状态</th><th>可核验证据</th></tr></thead>
    <tbody>
      <tr><th scope="row">React 工作台、FastAPI 与知识路径</th><td>已确认代码边界</td><td>源码目录与本页架构图；未写成运行成功结论</td></tr>
      <tr><th scope="row">后端可执行测试</th><td>未复现</td><td>本轮环境未提供可用的依赖与凭据，不声明测试通过数量</td></tr>
      <tr><th scope="row">非敏感 PDF → 解析 → 索引 → 图谱检索</th><td>未复现</td><td>代表性流程未完成，不声明端到端成功</td></tr>
      <tr><th scope="row">追问与回答生成</th><td>未复现</td><td>本轮未完成与兼容模型的真实调用，不声明回答质量</td></tr>
    </tbody>
  </table>
</section>

## 限制与下一步

当前页面不声明身份认证、多人租户隔离、移动端适配或召回质量指标。真实资料驱动的解析、索引、图谱检索与追问流程仍需在具备项目依赖和兼容模型配置的环境中复现；下一步应保存可审计的非敏感运行产物，再补充端到端验收结论。
