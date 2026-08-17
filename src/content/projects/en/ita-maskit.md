---
title: ITA-Maskit
slug: ita-maskit
locale: en
translationKey: ita-maskit
summary: A local masking workbench for audit material, connecting rule-driven masking and deterministic pseudonymization with preview, execution, and audit trails.
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

## How a user works with it

<ol class="project-flow" data-project-flow>
  <li>Select files, a rule set, and optional personnel data</li>
  <li>Preview matches without writing output</li>
  <li>Execute masking or deterministic pseudonymization locally</li>
  <li>Inspect statistics, output paths, and the audit log</li>
</ol>

Users can choose files and YAML rules through the CLI or Windows GUI. Rules enter a preflight preview that reports possible fields and hit counts; after confirmation, table and text engines mask or pseudonymize locally and keep outputs, statistics, and audit records within the same processing boundary.

<figure class="project-evidence">
  <img src="/projects/ita-maskit/preview.png" alt="ITA-Maskit rule preview showing files, rule matches, and pending processing statistics" width="980" height="520" loading="lazy" />
  <figcaption>The preview screen puts file, rule, and hit statistics before formal execution; the image comes from the repository and uses scripted demonstration data.</figcaption>
</figure>

## System architecture

<figure class="project-architecture">
  <div class="project-architecture__scroller" data-project-architecture-scroller tabindex="0">
    <img src="/projects/ita-maskit-architecture.svg" alt="ITA-Maskit architecture: the CLI and Windows GUI validate rules, route files through table and text engines, mask or pseudonymize values, and emit statistics and audit logs" width="1400" height="760" />
  </div>
  <figcaption>The diagram separates rule decisions, format engines, pseudonymization configuration, and output records; the user-supplied pepper enters pseudonymization as configuration rather than stored data.</figcaption>
</figure>

The same rule decision connects preflight preview and formal execution. Tabular data goes through a column-oriented table engine; email, PDF, Word, and similar material goes through a full-text engine. Masking or deterministic pseudonymization then produces output and statistics while an audit log is appended.

## Key technical decisions

### Express masking rules as versioned data

Rule sets store field mappings, match strategies, masking templates, and pseudonymization templates in YAML. Changing a business rule means changing validated data configuration rather than rewriting the processing code.

### Normalize before domain-separated HMAC pseudonymization

Values are normalized according to field rules before a user-supplied pepper participates in domain-separated HMAC pseudonymization. The same input can therefore keep a consistent replacement across files while the pepper remains part of runtime configuration.

### Reuse the same rule decision path for preview and execution

Preview reports field hits before output is written, and formal processing reuses that rule set. This keeps the visible preflight decision and the resulting output on one logic path.

<figure class="project-evidence">
  <img src="/projects/ita-maskit/rules.png" alt="ITA-Maskit rule management screen showing YAML rule sets and field strategies" width="820" height="560" loading="lazy" />
  <figcaption>The rule-management screen shows field strategies and the rule-set entry point; the image comes from the repository and uses scripted demonstration data.</figcaption>
</figure>

## Known limitations and next steps

Deterministic pseudonymization is not encryption and cannot replace key management or encrypted storage. The default PDF text-extraction/reflow path and image OCR cropping remain beta capabilities that can change layout or image dimensions; original-layout PDF masking is also an explicitly enabled beta path. An optional rule-generation service receives only rule descriptions or policy documents that the user provides; masking data is kept out of that call, but the service boundary still needs review for the deployment environment.

Excel can lose precision before processing when long identifiers are stored as numbers, and the tool cannot restore truncated digits; such fields should remain text. Running `ruff check .` in WSL produced 15 Ruff findings, so this page does not present static checks as clean. The project does not claim certification or present itself as a compliance solution. Next, I would add repeatable CLI acceptance records for more file boundaries and evaluate beta-format paths separately.
