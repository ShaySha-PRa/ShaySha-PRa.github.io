---
title: Manim Project
slug: manim-project
locale: en
translationKey: manim-project
summary: Turns teaching intent into a reviewable ContentPlan, then follows a versioned code chain to inspectable Manim video artifacts.
published: 2026-08-16
updated: 2026-08-17
draft: false
status: experiment
role: Independent developer
tech: [Next.js, FastAPI, Python, Manim, SQLite, Redis, Docker]
repoUrl: https://github.com/ShaySha-PRa/Manim_project
cover: ../../../assets/projects/manim-project/cover.png
gallery: []
featured: false
order: 4
evidence:
  - The cover is the repository's docs/assets/workbench-demo.png; both contextual images are frames extracted from docs/assets/formula-derivation-demo.mp4 at 30.0 and 50.0 seconds.
  - This run completed all 519 repository tests in WSL Python 3.10, used the deterministic template for one structured formula task, and ran local quality inspection against the repository demo video without claiming model or production metrics.
caseStudy:
  category: Applied AI
  scope: Secure media generation pipeline
---

## What it solves

The hard part of a math animation is not merely generating Manim code; it is turning learning goals, audience, duration, and formula assumptions into a production plan people can review together. This workbench asks a teacher to approve a structured ContentPlan first, then turns that plan into version-linked code and render jobs so every revision can return to its teaching intent and the final video, thumbnails, logs, and quality diagnostics can be reviewed by a person.

## Core capabilities

<ul class="project-capabilities" data-project-capabilities>
  <li>Enter learning goals, audience, duration, and assumptions</li>
  <li>Generate and edit a structured ContentPlan</li>
  <li>Create read-only versioned Manim CodeVersions</li>
  <li>Submit Preview and Final renders</li>
  <li>Inspect video, thumbnails, and render logs</li>
  <li>Check duration, frame rate, and severe visual anomalies</li>
</ul>

## How it works

<ol class="project-flow" data-project-flow>
  <li>Enter a teaching request</li>
  <li>Generate a structured plan</li>
  <li>Preview and inspect</li>
  <li>Deliver the final artifact</li>
</ol>

A teacher describes a formula derivation or function-visualization task, and the workbench turns it into a ContentPlan with an audience, duration, scenes, formula steps, and explicit assumptions. A person reviews and edits that plan before any Manim code is generated; Preview and Final jobs are queued by job ID, rendered inside an isolated execution boundary, and returned with video, thumbnails, metadata, and quality diagnostics.

## Project highlights

### Turn teaching intent into a reviewable plan first

ContentPlan comes before code generation: it turns learning goals, audience, duration, scenes, formula steps, and assumptions into an editable production object. A teacher can review the plan before entering code generation and Preview rendering, so opaque generated code does not stand in for the teaching design itself.

<figure class="project-evidence">
  <img src="/projects/manim-project/formula-derivation-demo.jpg" alt="Formula derivation animation demo frame" width="1920" height="1080" loading="lazy" />
  <figcaption>This formula-derivation frame is extracted from the repository's docs/assets/formula-derivation-demo.mp4 at 30.0 seconds; it is project context, not a newly generated model result from this run.</figcaption>
</figure>

### Connect every revision to its artifact

Prompt → Plan → Code → Artifact is an immutable, traceable version chain. Prompt, ContentPlan, and read-only CodeVersions are appended as versions, while later edits point to a parent version; every Preview or Final artifact can be traced back to its plan and code without overwriting an earlier review object.

### Reject untrusted code before isolated execution

Generated code first passes an AST and Manim API whitelist, compilation, and Scene preflight; only then does a job enter a network-disabled, non-root, resource-constrained isolated Manim container. Deterministic media checks inspect duration, frame rate, frame count, and severe visual anomalies, producing a quality diagnosis with redacted logs before it returns to the workbench.

<figure class="project-evidence">
  <img src="/projects/manim-project/quality-result.png" alt="Manim formula animation frame at 50 seconds from the repository demo video" width="1920" height="1080" loading="lazy" />
  <figcaption>This is a real animation frame extracted from the same repository demo video at 50.0 seconds; the quality conclusion comes from local PyAV inspection, and the still is not presented as a product quality panel.</figcaption>
</figure>

## System architecture

<figure class="project-architecture">
  <div class="project-architecture__scroller" data-project-architecture-scroller tabindex="0">
    <img src="/projects/manim-project-architecture.svg" alt="Manim Project architecture: the Next.js workbench uses FastAPI and Redis to schedule isolated Manim rendering and quality reports" width="1400" height="760" />
  </div>
  <figcaption>The diagram keeps only the workbench, control plane, execution boundary, and artifact inspection layers; providers, ports, and production deployment are intentionally outside the evidence.</figcaption>
</figure>

The Next.js workbench uses FastAPI + SQLite for Prompt, ContentPlan, CodeVersion, and job state; Redis only carries jobs with stable IDs. The Host Runner performs the AST/API whitelist, compilation, and Scene preflight before handing untrusted code to a default-deny isolated Manim container. Preview and Final artifacts stay separate, while deterministic media checks combine the render result, thumbnails, and redacted logs into a reviewable QualityReport.

## Project scope

This is a human-review creative tool, not a one-click service for arbitrary mathematics. Its mathematical scope is bounded by ContentPlan and formula-validation rules; generated code is not guaranteed to render on every attempt or to produce a deliverable result in one shot for arbitrary mathematics. Model repair, deterministic fallback, and local quality checks are not substitutes for human teaching judgment. This run completed the deterministic code path and local demo-artifact inspection, but not a compatible-model-driven end-to-end Preview → Final render or any market or production validation.
