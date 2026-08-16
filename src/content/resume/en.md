---
title: Junshu Sha's Résumé
slug: resume
locale: en
translationKey: resume
summary: Experience across IT audit, applied AI engineering, and intelligent knowledge systems.
published: 2026-08-17
updated: 2026-08-17
draft: false
order: 1
---

## Work Experience

### KPMG Shanghai｜IT Audit Consultant

_Oct 2025 – Apr 2026_

- **ITGC delivery and log analysis:** Contributed to 4+ SOX, IPO, and annual audit engagements covering user access, access reviews, change management, and IT operations controls. Worked with client IT and business teams to map control processes, trace audit evidence, and identify control exceptions. Used Python and PowerShell to filter keywords, aggregate users, and isolate high-risk operations across 1.96M+ lines of system logs.
- **AI data analysis assistant:** Independently developed an NL2SQL tool with LangChain, FastAPI, and React to reduce manual SQL authoring and repetitive chart creation in audit data analysis. Integrated Alibaba Cloud Model Studio's Qwen3 to support natural-language queries, SQL generation and execution, multi-session context, automatic result visualization, and SSE streaming. Automated tests covered NL2SQL conversion, model calls, and exception-handling paths.
- **ITA-Maskit data masking tool:** Developed a local, open-source Python, Polars, and PyQt5 tool to reduce omissions when masking complex audit materials. Delivered both a CLI and Windows GUI with support for 8 format categories, 13 file extensions, and 12 types of sensitive fields. Implemented consistent deterministic pseudonymization across files with HMAC and a pepper, and used a YAML rules engine to separate regular expressions and masking templates from the core code. Supported million-row CSV and Excel processing, backed by 171 automated tests, CI, and Windows EXE packaging.
- **ITA audit evidence verification workflow:** Independently built a FastAPI and Next.js full-stack prototype around real ITGC audit workflows, turning “evidence upload → normalized parsing → rule validation → draft conclusion → human sign-off” into an executable workflow. Supported 6 types of audit evidence and 5 validation rules to detect excessive privileges, failure to deactivate departed employees, approval-chain anomalies, and evidence gaps. Preserved the provenance of each conclusion through source-document backlinks and policy-clause citation gates.

## Project Experience

### My Company Brain — Multi-Knowledge-Base RAG and Agent Platform

_Jun 2026 – Aug 2026_

- **Multi-path knowledge architecture:** Designed three independent knowledge paths—Nano Brain, Traditional RAG, and GraphRAG—to handle enterprise documents, spreadsheets, knowledge pages, and entity relationships that could not be served uniformly by a single retrieval path. Exposed consistent knowledge management, question answering, source presentation, and governance through a unified API, LangGraph Agent Gateway, and Next.js workspace.
- **Hybrid retrieval and citation provenance:** Implemented document parsing, chunking, MiniMax Embedding adaptation, and pgvector ingestion. Combined keyword (`tsvector`), lexical, and vector retrieval in Traditional RAG and fused candidates with RRF. Supported filtering by knowledge source, document, and file type, returning retrieval paths, ranking details, and page-, table-, image-, and chunk-level citations.
- **Authorization, data, and state boundaries:** Divided identity, platform, Agent, and the three knowledge paths across 6 logical databases within one PostgreSQL instance, while GraphRAG used a dedicated Neo4j database. Enforced public, owner-private, and authorized-source filtering at module query boundaries. Exposed module capabilities through protected HTTP Tools and MCP adapters, and persisted LangGraph checkpoints with PostgresSaver.
- **Automation and deployment verification:** Completed 88 Bun and 15 Python automated tests and passed TypeScript and Python type checks. Orchestrated 9 services with Docker Compose, completed local database migration and initialization, and passed health checks for all 8 long-running services.

### AI Mathematical Animation Workbench

_Jul 2026 – Aug 2026_

- **Structured lesson planning:** Transformed teachers' natural-language requests into a ContentPlan containing the audience, duration, scenes, formula steps, and explicit assumptions. Applied layered validation using Pydantic Schema, business semantics, and formula parsing. Across 30 real golden tasks, Schema validity, formula validity, and actionability each reached 30/30, while semantic validation reached 29/30.
- **Generation and repair loop:** Injected the ContentPlan, reference Scenes, Manim API constraints, and sanitized diagnostics into DeepSeek to generate complete ManimCE Scenes. With up to two model-repair rounds and deterministic template fallback, 27/30 tasks rendered successfully on the first attempt and 28/30 succeeded finally; 28/30 samples achieved at least 4/5 for both mathematical correctness and visual quality.
- **Untrusted code execution:** Built defense in depth with fail-closed AST/API allowlists, compilation and Scene preflight checks, diagnostic sanitization, and a network-disabled, non-root, resource-constrained Docker sandbox. All 8 supplied attack samples were blocked before reaching the sandbox, with no bypass observed.
- **Quality and regression:** Used PyAV to verify preview and final videos for duration, FPS, frame count, and severe visual anomalies. Preserved versioned Prompt/Plan/Code artifacts and append-only QualityReports. Completed 60 terminal renders across 30 tasks, with all 519 Python tests in the repository passing.

### HR-Insight — Self-Hosted Feishu HR Agent

_May 2026_

- **Recruiting Agent workflow:** Built a Feishu recruiting Agent on OpenClaw, persisting résumé PDFs and Markdown, candidate profiles, interview transcripts, recruiting pipelines, and comparative reports in convention-based directories within the container workspace. Used AGENTS/HIRING rules to constrain candidate fields, stage updates, history retention, and source attribution.
- **Multimodal toolchain:** Developed a local pypdf résumé-to-Markdown tool that preserves page numbers, extraction statistics, and text-quality reports while flagging scanned files that require OCR. Standardized audio formats with FFmpeg, switched between Feishu file transcription and streaming ASR based on duration, and supported rate-limit retries plus an optional Whisper-compatible backend.
- **Privacy-isolated deployment:** Deployed the OpenClaw Gateway only inside Docker Engine, isolated candidate data from the host filesystem with named volumes, and bound ports solely to the local loopback interface. Did not mount host directories, the operating-system drive, the Docker Socket, or privileged mode; injected secrets through environment variables.

### Financial LLM Fine-Tuning, GRPO Reinforcement, and INT4 Quantization

_May 2025 – Jul 2025_

- **Financial-domain fine-tuning:** Prepared 13,369 training examples and 1,208 validation examples around DeepSeek-R1-Distill-Qwen-7B. Completed parameter-efficient fine-tuning with LoRA/QLoRA and Llama-Factory, using DeepSpeed, gradient accumulation, cosine learning-rate scheduling, early stopping, and checkpoints. Validation-set PPL fell from 13 to 2.8, a 78.5% reduction.
- **GRPO reinforcement and evaluation:** Designed a reward-evaluation workflow integrated with Skywork Reward Model and used TRL GRPOTrainer to generate 4 candidate responses for each of 5,000 prompts for within-group relative optimization. Under two predefined evaluation configurations, task accuracy rose from 70% to 97% / 99.6%, while the average evaluation score increased from 12 to 25, a 108% gain.
- **Model compression and deployment:** Built financial calibration data and an INT4 quantization workflow with GPTQModel, covering model loading, calibration, quantized artifact persistence, output inspection, and reload verification. Reduced model-weight size from 12 GB to 5 GB, approximately 58%, and lowered peak VRAM usage by approximately 15 GB under the same test configuration.
