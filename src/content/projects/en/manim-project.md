---
title: Manim Project · Animation Agent Workbench
slug: manim-project
locale: en
translationKey: manim-project
summary: Compiles a one-sentence research goal and optional data into traceable AnimationIR, controlled scientific computation, and reviewable video while retaining the teaching ContentPlan path.
published: 2026-08-16
updated: 2026-08-19
draft: false
status: experiment
role: Independent developer
tech:
  [Next.js, FastAPI, Python, AnimationIR, ManimCE, NumPy/SciPy, Redis, Docker]
repoUrl: https://github.com/ShaySha-PRa/Manim_project
cover: ../../../assets/projects/manim-project/cover.png
gallery: []
featured: false
order: 4
evidence:
  - The cover is the repository's 2026-08-19 docs/assets/workbench-demo.png; the two contextual frames remain from docs/assets/formula-derivation-demo.mp4 at 30.0 and 50.0 seconds and represent the retained teaching path.
  - The latest GitHub Actions Python job completed Ruff and 580 passed, 1 skipped; the Web job stopped at the preceding high-severity nanoid audit, while local WSL lint, typecheck, and production build passed.
  - 'Local closed-set reruns passed the P0, P1, and P2 gates: P0 rendered all six ready slices and correctly paused one paper/CSV case; P1 contains 76 cases and P2 contains 130. P2 is explicitly a lab harness, not an external user study.'
caseStudy:
  category: Scientific Visualization / Agent + Compiler
  scope: Dual-track Animation Agent workbench
---

## What it solves

A scientific animation cannot treat “ask a model to write Manim Python” as the source of scientific correctness: trajectories, fields, residuals, and data points need traceable computation, while visual expression needs a verifiable intermediate representation. Animation Agent V2 turns a one-sentence research goal and optional CSV into IntentSpec, calls allowlisted scientific tools to produce ToolRuns, builds AnimationIR 2.0, and uses deterministic compilation to produce a reviewable Preview. The original Teaching Prompt → ContentPlan → CodeVersion path remains available, and both paths share versioning, queues, sandboxes, and delivery.

## Core capabilities

<ul class="project-capabilities" data-project-capabilities>
  <li>Create an animation task from one research sentence and optional CSV</li>
  <li>Constrain model output to structured IntentSpec JSON</li>
  <li>Produce traceable ToolRuns through allowlisted scientific tools</li>
  <li>Compile AnimationIR 2.0 into Manim and Web JSON</li>
  <li>Run an expression critic and at most one IR repair</li>
  <li>Deliver Preview / Final, QualityReport, and the teaching ContentPlan path</li>
</ul>

## How it works

<ol class="project-flow" data-project-flow>
  <li>Enter a research goal and optional assets</li>
  <li>Resolve intent and run scientific tools</li>
  <li>Build and inspect AnimationIR</li>
  <li>Compile and render a Preview</li>
</ol>

The user enters a research goal in a local workbench that issues its own development session and optionally supplies CSV data. The system presents inferred domain, assumptions, and tools_needed for review. An unmatched closed catalog returns needs_confirmation; missing required data returns asset_required, so it neither invents equations nor fabricates data. Ready ToolRun outputs enter AnimationIR, the critic, and the compiler before the existing Runner renders a Preview inside the network-disabled Docker boundary.

In the closed P0 acceptance set, all six renderable vertical slices passed scientific assertions, deterministic compilation, and first Docker render; the paper-plus-CSV case outside the closed catalog paused for confirmation as intended. These are internal acceptance outcomes, not a general generation success rate.

## Project highlights

### Let the model plan intent instead of writing free-form Scenes

On the research path, an enabled model can only fill IntentSpec JSON; it cannot emit Scene Python, lambdas, or arbitrary NumPy expressions. Without a model configuration, the same entry point falls back to a transparent keyword intent catalog. A deterministic compiler lowers constrained IR to Manim code, while unknown capabilities return structured errors and explicit fallbacks. The teaching path can still create an AST/API-allowlisted CodeVersion, but its evidence is kept separate from the research compiler.

<figure class="project-evidence">
  <img src="/projects/manim-project/formula-derivation-demo.jpg" alt="Formula-derivation animation frame from the retained teaching path" width="1920" height="1080" loading="lazy" />
  <figcaption>This frame comes from the teaching path's docs/assets/formula-derivation-demo.mp4 at 30.0 seconds. The new research path coexists with this ContentPlan workflow.</figcaption>
</figure>

### Keep scientific values and provenance inside ToolRun

Trajectories, fields, and time series come from registered NumPy/SciPy/pandas tools instead of ad hoc computation inside a Scene. ToolRun records parameter, input, and output hashes; AssetVersion preserves immutable asset provenance, and AnimationIR refers to artifact_ref. Paper-plus-CSV reproduction currently accepts only a closed Lotka–Volterra catalog with complete coefficients; other papers move to needs_confirmation.

The 76-case internal P1 gold set contains 58 ready cases. Expected, science, and provenance rates were 1.0, the expression-critic mean was 5.0, and mean IR repairs were 0. These figures describe closed-corpus gates, not external research findings.

### Use one IR for two backends and a repair loop

AnimationIR 2.0 passes structural validation and a TIFA-style expression critic before at most one IR-level repair. The same IR lowers deterministically to Manim Python and Web JSON, so a second preview surface does not reinterpret the scientific goal. Manim output enters the existing network-disabled Render Sandbox; the Web backend is an inspectable JSON lowering, not a second video renderer.

In the 130-case internal P2 benchmark, 100 cases were ready; science, expected, and cross-backend rates were 1.0, and the unexpected FAILED rate was 0. The protocol explicitly records external_user_study=false.

<figure class="project-evidence">
  <img src="/projects/manim-project/quality-result.png" alt="Animation frame at 50 seconds from the retained teaching-path demo" width="1920" height="1080" loading="lazy" />
  <figcaption>This 50.0-second frame comes from the retained teaching demo. Preview / Final artifacts, thumbnails, redacted logs, and QualityReport remain shared delivery primitives across both paths.</figcaption>
</figure>

## System architecture

<figure class="project-architecture">
  <div class="project-architecture__scroller" data-project-architecture-scroller tabindex="0">
    <img src="/projects/manim-project-architecture.svg" alt="Animation Agent V2 architecture: a research prompt flows through IntentSpec, allowlisted scientific tools, AnimationIR 2.0, and deterministic compilation into Manim and Web backends" width="1400" height="760" />
  </div>
  <figcaption>This UML-like component and activity view separates the research-agent path, retained teaching path, compute boundary, and render boundary without adding ports, model providers, or production topology.</figcaption>
</figure>

The Next.js workbench sends a research prompt through Intent Resolver and an allowlisted Compute Sandbox. ToolRuns and provenance hashes enter AnimationIR, the critic, and at most one repair before the deterministic compiler dispatches to Manim and Web JSON backends. Teaching ContentPlan / CodeVersion passes a separate security preflight and joins the same Runner. Only the Manim backend enters the network-disabled, non-root, resource-limited Render Sandbox; Preview / Final and QualityReport return to the shared workbench.

## Project scope

This remains a local development and acceptance workbench: the research path covers a closed intent/tool catalog, while the teaching ContentPlan path remains available. P0/P1/P2 figures come from internal gold sets and a lab harness, not an external researcher study or production-deployment claim.
