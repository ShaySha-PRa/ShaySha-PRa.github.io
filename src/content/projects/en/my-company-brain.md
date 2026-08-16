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
  evidenceTarget: '#validation'
---

## How someone uses it

<ol class="project-flow" data-project-flow>
  <li>Create a knowledge source</li>
  <li>Import material</li>
  <li>Ask a question</li>
  <li>Inspect the answer and sources</li>
</ol>

Team members enter the knowledge paths through one workspace. The shared entry point governs knowledge sources and authorization, while each module keeps the parsing, retrieval, and citation behavior suited to its material.

## System architecture

<figure class="project-architecture">
  <div class="project-architecture__scroller" data-project-architecture-scroller>
    <img src="/projects/my-company-brain-architecture.svg" alt="My Company Brain architecture: Web enters the Agent Gateway through a unified API and connects to three knowledge paths" />
  </div>
  <figcaption>The diagram establishes the code boundaries between Web, the unified API, the Agent Gateway, and the three knowledge paths; runtime claims remain in the validation matrix.</figcaption>
</figure>

The Web layer enters only through the unified API, while the Agent Gateway orchestrates Nano Brain, Traditional RAG, and GraphRAG. Identity, platform, Agent, and the three knowledge paths use six logical PostgreSQL databases, with Neo4j dedicated to GraphRAG data.

## Three key technical decisions

### The unified API is the governance boundary

The frontend does not connect directly to individual knowledge services. The unified API applies identity and knowledge-source access boundaries, while the Agent Gateway invokes modules only through protected HTTP Tools and MCP adapters.

### The three knowledge paths remain independent

Nano Brain, Traditional RAG, and GraphRAG serve different material and retrieval goals. Traditional RAG combines keyword, lexical, and vector retrieval with RRF fusion; GraphRAG owns entity relationships and graph queries.

### Compose defines the repeatable runtime boundary

Database migration, initialization, service health checks, and loopback-only local ports live in Compose and its scripts, separating code presence from environment validation.

<section id="validation" class="project-validation">
  <h2>Current validation status</h2>
  <table>
    <thead><tr><th>Capability</th><th>Status</th><th>Verifiable evidence</th></tr></thead>
    <tbody>
      <tr><th scope="row">Web, unified API, Agent Gateway, and three knowledge paths</th><td>Implemented</td><td><a href="https://github.com/ShaySha-PRa/my-company-brain/tree/main/apps">Application directories</a> and <a href="https://github.com/ShaySha-PRa/my-company-brain/blob/main/docs/ARCHITECTURE.md">architecture documentation</a></td></tr>
      <tr><th scope="row">Automated checks</th><td>Automatically verified</td><td>88 Bun + 15 Python tests, plus TypeScript and Python type checks</td></tr>
      <tr><th scope="row">Local Compose orchestration</th><td>Locally verified</td><td>9 orchestrated services, 8 long-running services healthy, and migration exited with code 0</td></tr>
      <tr><th scope="row">Real-material end-to-end validation across all three paths</th><td>Pending</td><td><a href="https://github.com/ShaySha-PRa/my-company-brain/blob/main/docs/CURRENT_STATUS.md">Current product status</a></td></tr>
      <tr><th scope="row">Production deployment and load behavior</th><td>Not claimed</td><td>Outside the current project conclusions</td></tr>
    </tbody>
  </table>
</section>

## Limitations and next steps

The most important remaining gap is end-to-end validation of the three knowledge paths, browser routes, and authorization matrix with real team material. Production deployment, load behavior, and long-running stability are outside the current claims.
