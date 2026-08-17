---
title: Manim Project
slug: manim-project
locale: en
translationKey: manim-project
summary: Turns teaching requests into reviewable ContentPlans and Manim code, then organizes preview and final artifacts with queues, isolated execution, and deterministic quality checks.
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
  evidenceTarget: '#validation'
---

## How someone uses it

<ol class="project-flow" data-project-flow>
  <li>Enter a teaching request</li>
  <li>Generate a structured plan</li>
  <li>Preview and inspect</li>
  <li>Deliver the final artifact</li>
</ol>

A teacher describes a formula derivation or function-visualization task. The workbench turns it into a ContentPlan with an audience, duration, scenes, formula steps, and explicit assumptions. After review, it generates versioned Manim code; preview and final jobs are queued by job ID, rendered inside an isolated execution boundary, and returned with video, thumbnail, metadata, and quality diagnostics.

## System architecture

<figure class="project-architecture">
  <div class="project-architecture__scroller" data-project-architecture-scroller>
    <img src="/projects/manim-project-architecture.svg" alt="Manim Project architecture: the Next.js workbench uses FastAPI and Redis to schedule isolated Manim rendering and quality reports" width="1400" height="760" />
  </div>
  <figcaption>The diagram keeps only the workbench, control plane, execution boundary, and artifact inspection layers; providers, ports, and production deployment are intentionally outside the evidence.</figcaption>
</figure>

The Next.js workbench uses FastAPI + SQLite for Prompt, ContentPlan, CodeVersion, and job state; Redis only carries jobs with stable IDs. The Host Runner performs static checks before handing untrusted code to a default-deny isolated Manim container. Preview and Final artifacts stay separate, while deterministic media metadata and sampled-frame checks produce the quality report.

<figure class="project-evidence">
  <img src="/projects/manim-project/formula-derivation-demo.jpg" alt="Formula derivation animation demo frame" width="1920" height="1080" loading="lazy" />
  <figcaption>This formula-derivation frame is extracted from the repository's docs/assets/formula-derivation-demo.mp4 at 30.0 seconds; it is project context, not a newly generated model result from this run.</figcaption>
</figure>

## Three key technical decisions

### Preserve teaching intent with immutable version chains

Prompt, ContentPlan, and CodeVersion are append-only versions connected by parent versions rather than overwritten. That makes each render's plan, code, and artifact traceable, and gives each repair attempt a clear review object.

### Decouple submission from execution with job IDs

FastAPI creates jobs and persists state, Redis queues them, and the Runner claims, recovers, or cancels work. Preview and Final share a traceable job boundary but remain separate delivery layers, so an intermediate preview is not mistaken for a final artifact.

### Run generated code behind a default-deny boundary

Code passes AST and Manim API allowlists, compilation, and Scene preflight before entering a network-disabled, non-root, resource-constrained container. The quality layer uses PyAV to check duration, FPS, frame count, and severe visual anomalies; diagnostic text is redacted before it reaches the workbench.

<figure class="project-evidence">
  <img src="/projects/manim-project/quality-result.png" alt="Manim workbench local quality report and preview artifact inspection" width="1600" height="1000" loading="lazy" />
  <figcaption>This is a real animation frame extracted from the same repository demo video at 50.0 seconds; the quality conclusion comes from local PyAV inspection, and the still is not presented as a product quality panel.</figcaption>
</figure>

<section id="validation" class="project-validation">
  <h2>Current validation status</h2>
  <table>
    <thead><tr><th>Capability</th><th>Status</th><th>Verifiable evidence</th></tr></thead>
    <tbody>
      <tr><th scope="row">Executable repository tests</th><td>Reproduced locally</td><td>In WSL Python 3.10, <code>uv run pytest -s -q</code> completed with 519 passed.</td></tr>
      <tr><th scope="row">Prompt → ContentPlan → code</th><td>Partially reproduced</td><td>Without a usable compatible model credential, the repository deterministic template completed one formula task; the ContentPlan and static security checks passed.</td></tr>
      <tr><th scope="row">Preview / Final rendering and quality inspection</th><td>Partially reproduced</td><td>Manim rendering runtime was not installed in this run. PyAV inspected the repository demo video deterministically; 12 sampled frames produced no diagnostics, and the page image is the real 50.0-second frame.</td></tr>
      <tr><th scope="row">Full model success rate, market, or production capability</th><td>Not claimed</td><td>This run made no model call and did not execute the full golden set, so it makes no success-rate, throughput, market-feedback, or production-deployment claim.</td></tr>
    </tbody>
  </table>
</section>

## Limitations and next steps

The project remains a local development and acceptance environment, with mathematical scope bounded by ContentPlan and formula-validation rules. Generated code is not guaranteed to render on every attempt, and model repair or deterministic fallback is not a substitute for human review. This run completed the deterministic code path and local demo-artifact inspection, but not a compatible-model-driven end-to-end Preview → Final render or any market or production validation. Next, add a reproducible model configuration, render one real formula task through both stages in the isolated environment, and retain its redacted QualityReport.
