---
title: Junshu Sha 的简历
slug: resume
locale: zh
translationKey: resume
summary: IT 审计、AI 应用工程与智能知识系统方向的工作及项目经历。
published: 2026-08-17
updated: 2026-08-17
draft: false
order: 1
---

## 工作经历

### 毕马威上海分所（KPMG）｜IT 审计顾问

_2025.10 – 2026.04_

- **ITGC 项目交付与日志分析：** 参与 4+ 个 SOX、IPO 及年审项目，覆盖用户访问、权限审阅、变更管理和运维控制；与客户 IT/业务团队梳理控制流程、追踪审计证据并识别控制异常；使用 Python/PowerShell 对 1,960,000+（196 万+）行系统日志进行关键词筛选、用户聚合与高风险操作拆分。
- **AI 数据分析助手：** 针对审计数据分析依赖人工编写 SQL、重复制图的问题，基于 LangChain + FastAPI + React 独立开发 NL2SQL 工具，接入阿里云百炼 Qwen3，实现自然语言查询、SQL 生成与执行、多会话上下文、结果自动图表化及 SSE 流式响应；自动化测试覆盖 NL2SQL 转换、模型调用与异常处理链路。
- **数据脱敏工具 ITA-Maskit：** 针对审计资料格式复杂、人工脱敏易遗漏的问题，开发 Python + Polars + PyQt5 本地化开源工具，提供 CLI 与 Windows GUI，支持 8 类格式、13 种扩展名及 12 类敏感字段；以 HMAC + pepper 实现跨文件一致的确定性伪名化，并通过 YAML 规则引擎解耦正则、遮盖模板与核心代码；支持百万行级 CSV/Excel 处理，配套 171 项自动化测试、CI 与 Windows EXE 打包。
- **ITA 审计证据核验工作流：** 结合真实 ITGC 审计流程，独立开发 FastAPI + Next.js 全栈原型，将“证据上传 → 标准化解析 → 规则核验 → 结论草稿 → 人工签字”抽象为可执行工作流；支持 6 类审计证据和 5 条核验规则，识别权限越权、离职账号未停用、审批链异常及证据缺口，并通过原文回链与制度条款引用门禁保留结论出处。

## 项目经历

### My Company Brain——企业多知识库 RAG 与 Agent 平台

_2026.06 – 2026.08_

- **多链路知识架构：** 针对企业文档、表格、知识页面与实体关系难以由单一检索链路统一处理的问题，设计 Nano Brain、Traditional RAG 与 GraphRAG 三条独立知识链路，并通过统一 API、LangGraph Agent Gateway 与 Next.js 工作台，提供一致的知识管理、问答、来源展示与治理入口。
- **混合检索与引用溯源：** 实现文档解析、分块、MiniMax Embedding 适配与 pgvector 入库链路；在 Traditional RAG 中组合关键词（tsvector）、字面匹配与向量三路召回，并使用 RRF 融合候选；支持按知识源、文档和文件类型过滤，返回召回路径、排序明细以及页面、表格、图片与片段级引用。
- **权限、数据与状态边界：** 在单 PostgreSQL 实例内为身份、平台、Agent 及三条知识链路划分 6 个逻辑数据库，GraphRAG 独立使用 Neo4j；在模块查询边界执行公开、本人私有及授权知识源过滤，模块能力通过受保护的 HTTP Tools 与 MCP 适配器暴露，并使用 PostgresSaver 持久化 LangGraph Checkpoint。
- **自动化与部署验证：** 完成 88 项 Bun 与 15 项 Python 自动化测试，并通过 TypeScript/Python 类型检查；使用 Docker Compose 编排 9 个服务，本地完成数据库迁移与初始化，8 个常驻服务健康检查通过。

### AI 数学动画生成工作台

_2026.07 – 2026.08_

- **结构化教学规划：** 将教师自然语言需求转为包含受众、时长、场景、公式步骤和显式假设的 ContentPlan，并以 Pydantic Schema、业务语义及公式解析进行分层校验；30 条真实黄金任务中 Schema、公式与可行动性均为 30/30，语义通过 29/30。
- **生成与修复闭环：** 将 ContentPlan、参考 Scene、Manim API 约束及脱敏诊断注入 DeepSeek，生成完整 ManimCE Scene；通过最多两轮模型修复与确定性模板降级，30 条任务首次渲染成功 27/30、最终成功 28/30，数学正确性与视觉质量达到 4/5 及以上的样例均为 28/30。
- **不可信代码执行：** 以默认拒绝（fail-closed）的 AST/API 白名单、编译与 Scene 预检、诊断脱敏及无网络、非 root、资源受限 Docker 沙箱构建纵深防护；给定 8 个攻击样例全部在沙箱前被拦截，未观察到绕过。
- **质量与回归：** 使用 PyAV 校验预览/终版视频的时长、FPS、帧数及严重视觉异常，以版本化 Prompt/Plan/Code 与只追加的 QualityReport 留痕；30 个任务完成 60 次终态渲染，全仓 519 项 Python 测试通过。

### HR-Insight——基于飞书的自托管 HR Agent

_2026.05_

- **招聘 Agent 工作流：** 基于 OpenClaw 构建飞书招聘 Agent，将简历 PDF/Markdown、候选人档案、面试转录、招聘 Pipeline 与横向比较报告按约定目录持久化至容器 Workspace；通过 AGENTS/HIRING 规则约束候选人字段、阶段更新、历史保留与来源归因。
- **多模态工具链：** 开发 pypdf 本地简历转 Markdown 工具，保留页码、抽取统计与文本质量报告，并对扫描件提示 OCR 需求；使用 FFmpeg 统一音频格式，根据时长切换飞书文件识别与流式 ASR，支持限流重试及 Whisper-compatible 可选后端。
- **隐私隔离部署：** 将 OpenClaw Gateway 仅部署于 Docker Engine，以命名卷隔离候选人资料与宿主文件系统，端口仅绑定本机回环地址；不挂载宿主目录、操作系统盘、Docker Socket 或 privileged，密钥通过环境变量注入。

### 金融领域大模型微调、GRPO 强化与 INT4 量化

_2025.05 – 2025.07_

- **金融领域微调：** 围绕 DeepSeek-R1-Distill-Qwen-7B 整理 13,369 条训练数据与 1,208 条验证数据，采用 LoRA/QLoRA + Llama-Factory 完成参数高效微调，并结合 DeepSpeed、梯度累积、余弦学习率、早停与检查点机制完成训练；验证集 PPL 由 13 降至 2.8，下降 78.5%。
- **GRPO 强化与评测：** 设计奖励评估流程并接入 Skywork Reward Model，使用 TRL GRPOTrainer 在 5,000 条 Prompt 上为每题生成 4 个候选回复并进行组内相对优化；在两组既定评测配置下，任务准确率由 70% 提升至 97% / 99.6%，平均评测得分由 12 提升至 25，提升 108%。
- **模型压缩与部署：** 基于 GPTQModel 构建金融校准数据与 INT4 量化流程，完成模型加载、校准、量化保存、产物检查及回载验证；模型权重体积由 12 GB 缩减至 5 GB，减少约 58%，同等测试配置下峰值显存占用降低约 15 GB。
