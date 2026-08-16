---
title: Agent Teams Project
slug: agent-teams-project
locale: en
translationKey: agent-teams-project
summary: A multi-agent contract-review workflow with an upload-to-report path, human decisions, and SSE progress updates.
published: 2026-08-16
updated: 2026-08-16
draft: false
status: completed
role: Independent developer
tech: [LangGraph, Human-in-the-Loop, SSE, Multi-agent workflow]
repoUrl: https://github.com/ShaySha-PRa/Agent_Teams_Project
cover: ../../../assets/projects/agent-teams-project/cover.svg
gallery: []
featured: false
order: 3
evidence:
  - The README reports a contract upload-to-report flow, HITL decisions, SSE progress, and 11 frontend routes.
---

## The problem to solve

Contract review needs file handling, several agent judgments, and human review to form one traceable flow. The project focuses on the upload-to-report path while keeping Human-in-the-Loop decisions at explicit review points.

## My design and implementation

I built the contract upload-to-report flow, placed multi-agent work and HITL decisions inside the workflow, and used SSE progress to expose processing state to the frontend. The README reports 11 frontend routes.

## System architecture

The system is organized around an upload entry point, agent workflow, human-decision nodes, report output, and an SSE progress channel. The 11 frontend routes reported by the README cover operations across that workflow; route count is not treated as a business outcome.

## Key technical decisions

LangGraph expresses the multi-agent flow and human-intervention boundaries, while SSE pushes in-progress state to the frontend. Treating upload-to-report as one explicit path keeps HITL decisions located at identifiable workflow nodes.

## Results and validation evidence

The README reports a contract upload-to-report flow, HITL decisions, SSE progress, and 11 frontend routes. This section stays within that repository-reported scope and adds no contract-review accuracy or other unreported metric.

## Known limitations and next steps

The conclusions here are limited to the workflow, decision nodes, and routes reported by the README; they are not a promise about outcomes on real contracts. The next step is to add validation with real flows and document concrete examples of the human-decision boundaries.
