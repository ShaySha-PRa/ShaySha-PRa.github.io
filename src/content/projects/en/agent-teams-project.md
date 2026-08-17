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

## What it solves

Contract review often mixes fact checking, risk judgment, and human accountability into one opaque operation. This MVP connects PDF/DOCX parsing, field verification, risk-level routing, and human review into a traceable decision-support workflow, so reviewers can see why each decision took its path and how to continue or undo it.

## Core capabilities

<ul class="project-capabilities" data-project-capabilities>
  <li>Upload and parse PDF/DOCX contracts</li>
  <li>Extract and verify parties, value, dates, and governing law</li>
  <li>Scan clauses and show rationale and suggestions</li>
  <li>Route high, medium, and low risks differently</li>
  <li>Confirm, edit, reject, undo, and resume human review</li>
  <li>Aggregate decisions into an exportable report</li>
</ul>

## How it works

<ol class="project-flow" data-project-flow>
  <li>Upload and parse a contract</li>
  <li>Verify contract fields</li>
  <li>Scan and route risks by level</li>
  <li>Review decisions and export the report</li>
</ol>

Someone uploads a PDF or DOCX contract, and a local parser turns it into text. The workflow extracts and verifies parties, value, dates, and governing law at a visible checkpoint; only after field verification does risk scanning begin. Results then route by high, medium, or low risk into different review paths before decisions are aggregated and progress is streamed back with SSE.

## Project highlights

### Let risk level change the review path

Risk scanning does not send every clause to one queue: high-risk items use itemized approval, medium-risk items use batch confirmation, and low-risk items auto-pass. Each risk keeps its rationale and suggestions so a reviewer can enter the appropriate path and return to human review when needed.

<figure class="project-evidence">
  <img src="/projects/agent-teams-project/contracts.png" alt="Agent Teams contract-review contracts list" width="1400" height="900" loading="lazy" />
  <figcaption>The contracts list is the entry point for review sessions; the image is an authentic repository screenshot using demo data.</figcaption>
</figure>

### Verify contract facts before risk scanning

The local PDF/DOCX parser produces text first, then a model extracts parties, value, dates, and governing law. Field verification is an explicit check before risk scanning, letting a reviewer correct facts before the scanner uses confirmed contract information to produce rationale and suggestions.

### Make human decisions recoverable workflow nodes

Human decisions are note-gated and idempotent: a decision write requires a reviewer note, and a repeated submission cannot apply the same decision twice. Confirm, edit, and reject actions support undo, while interrupt/resume lets the workflow continue from the saved human-review node; SQLite keeps the decision, audit record, and report state authoritative.

<figure class="project-evidence">
  <img src="/projects/agent-teams-project/upload.png" alt="Agent Teams contract-review upload screen" width="1400" height="900" loading="lazy" />
  <figcaption>The upload screen is the entry point into a review session; the image is an authentic repository screenshot using demo data.</figcaption>
</figure>

## System architecture

<figure class="project-architecture">
  <div class="project-architecture__scroller" data-project-architecture-scroller tabindex="0">
    <img src="/projects/agent-teams-project-architecture.svg" alt="Agent Teams Project architecture: the React workspace uses FastAPI for field extraction, risk routing, human decisions, and report streaming" width="1400" height="760" />
  </div>
  <figcaption>The diagram shows contracts moving through field verification, risk-level routing, human decisions, and report output; SQLite stores the authoritative review state.</figcaption>
</figure>

The React workspace enters contract, session, field, event, and report interfaces through FastAPI. A local PDF/DOCX parser produces text first; after field verification, LangGraph scans and routes risks. SQLite persists the review state while SSE sends in-progress events back to the page.

## Project scope

This is a human-review-centered contract decision-support MVP: authentication is simulated through request headers, text parsing and model scanning depend on local runtime configuration, and reports are JSON. It is a decision-support workflow, not legal advice, and it provides no accuracy guarantees.
