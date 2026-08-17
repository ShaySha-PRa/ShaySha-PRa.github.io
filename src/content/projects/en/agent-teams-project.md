---
title: Agent Teams Project
slug: agent-teams-project
locale: en
translationKey: agent-teams-project
summary: A contract-review MVP that connects upload, field review, risk routing, and human decisions in one traceable workflow.
published: 2026-08-16
updated: 2026-08-17
draft: false
status: completed
role: Independent developer
tech: [React, FastAPI, LangGraph, SQLite, Human-in-the-Loop, SSE]
repoUrl: https://github.com/ShaySha-PRa/Agent_Teams_Project
cover: ../../../assets/projects/agent-teams-project/cover.png
gallery: []
featured: false
order: 3
evidence:
  - The images are authentic dashboard, contracts, and upload screenshots from the repository; they use demo data and are not runtime metrics.
  - A local FastAPI run reproduced health, upload, session, contract-list, and field-query steps; model-dependent continuation is marked separately.
caseStudy:
  category: AI Workflow
  scope: Contract-review MVP
---

## How someone uses it

<ol class="project-flow" data-project-flow>
  <li>Upload a contract</li>
  <li>Review extracted fields</li>
  <li>Handle routed risks</li>
  <li>Inspect the JSON report</li>
</ol>

Someone uploads a PDF or DOCX contract, waits for a local parser to turn the file into text, and then has a model extract parties, amount, dates, and other structured fields. Once risk scanning completes, the workflow routes by risk level to human decisions, then assembles a JSON report and streams progress back to the workspace with SSE.

## System architecture

<figure class="project-architecture">
  <div class="project-architecture__scroller" data-project-architecture-scroller tabindex="0">
    <img src="/projects/agent-teams-project-architecture.svg" alt="Agent Teams Project architecture: the React workspace uses FastAPI for field extraction, risk routing, human decisions, and report streaming" width="1400" height="760" />
  </div>
  <figcaption>The diagram emphasizes extraction before risk routing, the human decision interrupt boundary, and SQLite as the authoritative review state.</figcaption>
</figure>

The React workspace enters contract, session, field, event, and report interfaces through FastAPI. A local PDF/DOCX parser first produces text; a model then performs structured field extraction before LangGraph risk routing chooses itemized human review, batch handling, or auto-pass. SQLite persists the review state while SSE sends in-progress events back to the page.

<figure class="project-evidence">
  <img src="/projects/agent-teams-project/contracts.png" alt="Agent Teams contract-review contracts list" width="1400" height="900" loading="lazy" />
  <figcaption>The contracts list is the entry point for review sessions; the image is an authentic repository screenshot using demo data.</figcaption>
</figure>

## Three key technical decisions

### Parse locally, then extract fields with a model

Local PDF/DOCX parsing and model-based structured field extraction happen before the LangGraph risk route. That gives reviewers a visible checkpoint for parties, amount, and effective dates, and keeps file reading, model extraction, and risk decisions separately locatable.

### Use interrupt / resume for human decisions

High-risk items interrupt the workflow until a reviewer confirms, edits, or rejects them, then continue through the resume path. A valid human note gates the decision write, keeping a visible responsibility boundary between automated scanning and the final decision.

### Keep SQLite authoritative for review state

Contracts, sessions, items, fields, audit records, and reports are modeled in SQLite. LangGraph's InMemorySaver is only a development-time graph checkpoint and is not the business-state store.

<figure class="project-evidence">
  <img src="/projects/agent-teams-project/upload.png" alt="Agent Teams contract-review upload screen" width="1400" height="900" loading="lazy" />
  <figcaption>The upload screen is the entry point into a review session; the image is an authentic repository screenshot using demo data.</figcaption>
</figure>

## Limitations and next steps

This is a contract-review MVP: authentication is simulated through request headers, text extraction uses local PDF/DOCX parsers, graph checkpoints use the in-process InMemorySaver, the unavailable-model path has a mock-risk fallback, and the report boundary is JSON rather than a production document system. It provides no legal advice or compliance certification and makes no real-contract risk-accuracy claim. Next, add a reproducible model configuration, retain redacted run artifacts, and complete end-to-end acceptance from scanning through HITL decisions to report generation.
