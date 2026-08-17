---
title: ITA-Maskit
slug: ita-maskit
locale: en
translationKey: ita-maskit
summary: A local audit-data protection workbench that connects two processing engines, maintainable rules, and deterministic pseudonymization with preview and audit trails.
published: 2026-08-16
updated: 2026-08-17
draft: false
status: completed
role: Independent developer
tech: [Python, Polars, PyQt5, YAML rules, Deterministic pseudonymization]
repoUrl: https://github.com/ShaySha-PRa/ITA-Maskit
cover: ../../../assets/projects/ita-maskit/cover.png
gallery: []
featured: false
order: 6
evidence:
  - The complete Python suite actually ran in WSL Ubuntu with 211 passed, 1 skipped, and 1 xfailed; optional rule-generation services were not enabled.
  - A synthetic mixed-PII CSV actually completed preview, masking/pseudonymization, output, and audit logging; screenshots use scripted demonstration data from the repository.
caseStudy:
  category: Data Privacy
  scope: CLI + Windows desktop app
---

## What it solves

Audit material often combines tables, JSON, email, PDF, and Word, where manual processing can miss sensitive values and break the relationship between the same person or employee identifier across files. ITA-Maskit connects rule selection, hit preview, local processing, and versioned audit records so that necessary joins survive while source values leave the original files.

## Core capabilities

<ul class="project-capabilities" data-project-capabilities>
  <li>Select rules and batch-process files through the CLI or Windows GUI</li>
  <li>Process tables, JSON, email, PDF, and Word locally</li>
  <li>Preview rule matches and sample changes before writing output</li>
  <li>Choose masking or deterministic pseudonymization</li>
  <li>Use personnel lists to improve name and employee-ID matching</li>
  <li>Inspect statistics, output locations, and versioned audit logs</li>
</ul>

## How it works

<ol class="project-flow" data-project-flow>
  <li>Select files, a rule set, and optional personnel data</li>
  <li>Preview matches without writing output</li>
  <li>Execute masking or deterministic pseudonymization locally</li>
  <li>Inspect statistics, output paths, and the audit log</li>
</ol>

Users select files, rule sets, and personnel lists through the CLI or Windows GUI. The workbench previews rule matches and sample changes before it writes anything, then processes the batch locally; statistics, output locations, and versioned audit logs stay within the same processing boundary.

## Project highlights

### Cover tables and documents with two processing engines

The column-based table engine applies rules at field boundaries for tabular data, while the full-text document engine scans JSON, email, PDF, Word, and similar material. Both paths run locally and reuse the same preview and rule decision, keeping cross-format audit batches inspectable.

<figure class="project-evidence">
  <img src="/projects/ita-maskit/preview.png" alt="ITA-Maskit rule preview showing files, rule matches, and pending processing statistics" width="980" height="520" loading="lazy" />
  <figcaption>The preview screen puts files, rule matches, and sample changes before formal writing; the image comes from the repository and uses scripted demonstration data.</figcaption>
</figure>

### Turn masking policy into maintainable data

YAML stores field mappings, match strategies, masking templates, and pseudonymization templates while rule versions remain separate from processing code. A business-policy change updates validated data configuration; preview and formal execution reuse that same version to reduce rule drift.

### Preserve cross-file joins without exposing source values

Inputs are normalized according to field strategy before a user-supplied pepper participates in domain-separated HMAC. The same normalized value therefore receives a stable deterministic alias across files, while personnel lists can improve name and employee-ID matching; source values are not exposed as aliases, and the pepper remains runtime configuration.

<figure class="project-evidence">
  <img src="/projects/ita-maskit/rules.png" alt="ITA-Maskit rule management screen showing YAML rule sets and field strategies" width="820" height="560" loading="lazy" />
  <figcaption>The rule-management screen shows YAML rule versions, field strategies, and the rule-set entry point; the image comes from the repository and uses scripted demonstration data.</figcaption>
</figure>

## System architecture

<figure class="project-architecture">
  <div class="project-architecture__scroller" data-project-architecture-scroller tabindex="0">
    <img src="/projects/ita-maskit-architecture.svg" alt="ITA-Maskit architecture: the CLI and Windows GUI validate rules, route files through table and text engines, mask or pseudonymize values, and emit statistics and audit logs" width="1400" height="760" />
  </div>
  <figcaption>The diagram separates rule decisions, format engines, pseudonymization configuration, and output records; the user-supplied pepper enters pseudonymization as configuration rather than stored data.</figcaption>
</figure>

The same rule version drives preview first, then routes files through the column-based table engine or full-text document engine. Masking or deterministic pseudonymization produces the output, statistics, and versioned audit log locally, without sending audit material to an external service.

## Project scope

This is a local audit-material processing tool, not a claim of certification or a replacement for deployment-level access control, key management, or encrypted storage; screenshots use scripted demonstration data from the repository. Deterministic pseudonymization is not encryption, and image OCR and layout-preserving PDF masking remain beta.
