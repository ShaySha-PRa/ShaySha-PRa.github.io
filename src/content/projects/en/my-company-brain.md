---
title: My Company Brain
slug: my-company-brain
locale: en
translationKey: my-company-brain
summary: A multi-knowledge-base workspace for teams, organizing document knowledge, relational knowledge, knowledge pages, and an assistant behind one governable surface.
published: 2026-08-16
updated: 2026-08-17
draft: false
status: active
role: Independent developer
tech: [TypeScript, Python, PostgreSQL, Neo4j, Docker, RAG, GraphRAG]
repoUrl: https://github.com/ShaySha-PRa/my-company-brain
cover: ../../../assets/projects/my-company-brain/workspace.png
gallery: []
featured: true
order: 1
evidence:
  - The codebase contains a web app, unified API, Agent Gateway, three knowledge paths, and Compose deployment definitions.
  - The repository records automated checks and local Compose service status; end-to-end validation with real material is still pending.
caseStudy:
  category: Enterprise Knowledge Platform / RAG + Agent
  scope: 3 knowledge paths
---

## What it solves

My Company Brain gives enterprise teams one governable workspace for knowledge sources, business scenarios, and traceable answers. Team members can choose a path that matches the material, ask follow-up questions, and inspect sources while public, private, and team authorization scopes constrain each retrieval.

## Core capabilities

<ul class="project-capabilities" data-project-capabilities>
  <li>Manage knowledge sources and visibility</li>
  <li>Import documents, tables, and knowledge pages</li>
  <li>Create business scenarios and follow-up tasks</li>
  <li>Ask follow-up questions across knowledge paths</li>
  <li>Inspect passage, page, table, and image sources</li>
  <li>Govern users, knowledge assets, and system state</li>
</ul>

## How it works

<ol class="project-flow" data-project-flow>
  <li>Create a knowledge source</li>
  <li>Import material</li>
  <li>Ask a question</li>
  <li>Inspect the answer and sources</li>
</ol>

Members first create a knowledge source and set its visibility, then import material or knowledge pages. They choose a business scenario, ask a question across the suitable paths, and open passage, page, table, and image sources behind the answer.

## Project highlights

### Match each knowledge type to the right path

The repository's Agent Gateway routes requests by material type: Nano Brain handles pages, facts, and links; Traditional RAG handles document and table retrieval; and GraphRAG handles entities and relationships. The product result is one reusable workspace without forcing every knowledge type into one index.

### Combine knowledge while preserving sources

Global Q&A can merge multiple knowledge paths in one answer while returning passage/page/table/image sources, so a user can move from a conclusion back to the material behind it. The repository's cross-module orchestration and shared source model provide that traceability instead of concatenating uncited text.

### Enforce access rules inside retrieval

public/private/team authorization is rechecked at module query boundaries rather than only hidden in the UI. The unified API and Agent Gateway establish the entry boundary, but each knowledge query carries visibility filtering again so a caller cannot bypass the interface and read unauthorized material.

## System architecture

<figure class="project-architecture">
  <div class="project-architecture__scroller" data-project-architecture-scroller tabindex="0">
    <img src="/projects/my-company-brain-architecture.svg" alt="My Company Brain architecture: Web enters the Agent Gateway through a unified API and connects to three knowledge paths" />
  </div>
  <figcaption>The diagram establishes the code boundaries between Web, the unified API, the Agent Gateway, and the three knowledge paths; runtime claims remain in the validation matrix.</figcaption>
</figure>

The Web layer enters only through the unified API, while the Agent Gateway orchestrates Nano Brain, Traditional RAG, and GraphRAG. Identity, platform, Agent, and the three knowledge paths use six logical PostgreSQL databases, with Neo4j dedicated to GraphRAG data.

## Project scope

The current scope is a self-hosted team knowledge workspace, with claims grounded in the repository code, Compose definitions, and local runtime boundary. It does not claim production HA, enterprise SSO, or large-scale load capability; those scenarios require separate deployment, identity, and load-test validation.
