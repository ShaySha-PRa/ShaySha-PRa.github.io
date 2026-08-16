---
title: My Company Brain
slug: my-company-brain
locale: en
translationKey: my-company-brain
summary: A multi-knowledge-base workspace for teams, organizing document knowledge, relational knowledge, knowledge pages, and an assistant behind one governable surface.
published: 2026-08-16
updated: 2026-08-16
draft: false
status: active
role: Independent developer
tech: [TypeScript, Python, PostgreSQL, Neo4j, Docker, RAG, GraphRAG]
repoUrl: https://github.com/ShaySha-PRa/my-company-brain
cover: ../../../assets/projects/my-company-brain/cover.svg
gallery: []
featured: true
order: 1
evidence:
  - The codebase contains a web app, unified API, Agent Gateway, three knowledge paths, and Compose deployment definitions.
  - The repository records automated checks and local Compose service status; end-to-end validation with real material is still pending.
---

## The problem to solve

Team documents, relationship knowledge, knowledge pages, and assistant entry points can become scattered across separate tools. This project brings those paths into one governable workspace while keeping the evidence boundary explicit.

## My design and implementation

The codebase contains a web app, unified API, and Agent Gateway, with document knowledge, relationship knowledge, and knowledge-page/assistant paths. This case study describes the implementation present in the repository; it does not present unfinished validation as a delivered outcome.

## System architecture

The repository structure routes the Web layer through a unified API and then to the Agent Gateway and its knowledge paths. PostgreSQL and Neo4j define relational and graph-oriented data boundaries, while Compose files describe local service orchestration.

## Key technical decisions

TypeScript and Python are used across the Web/API and agent-oriented code; RAG and GraphRAG organize retrieval paths; Docker Compose makes local service status inspectable. These are implementation choices visible in the code, not claims about unverified runtime outcomes.

## Results and validation evidence

The repository records automated checks and local Compose service status. The codebase contains the modules and deployment definitions above, but end-to-end validation with real material is still pending, so this page does not call it production-validated.

## Known limitations and next steps

End-to-end validation with real material is still pending, as is confirmation of how the knowledge paths behave against real team data. The next step is to complete that material-driven validation while retaining qualifiers such as “the codebase contains,” “the README reports,” and “still pending.”
