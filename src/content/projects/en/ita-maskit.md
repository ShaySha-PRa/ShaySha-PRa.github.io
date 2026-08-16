---
title: ITA-Maskit
slug: ita-maskit
locale: en
translationKey: ita-maskit
summary: A local data-masking tool with deterministic pseudonymization, a desktop GUI, and explicit processing boundaries for large tabular data.
published: 2026-08-16
updated: 2026-08-16
draft: false
status: completed
role: Independent developer
tech: [Python, GUI, Deterministic pseudonymization, Local processing]
repoUrl: https://github.com/ShaySha-PRa/ITA-Maskit
cover: ../../../assets/projects/ita-maskit/cover.svg
gallery: []
featured: false
order: 6
evidence:
  - The README reports local processing, deterministic pseudonymization, a GUI, 1M-row benchmarks, and a test count.
---

## The problem to solve

Data masking often involves sensitive material, so processing boundaries and repeatability matter. ITA-Maskit focuses on local processing, deterministic pseudonymization, and a desktop GUI so the masking flow runs on the local machine.

## My design and implementation

I organized the flow around local processing, used deterministic pseudonymization to preserve replacement relationships for the same input, and provided a GUI as the operating surface. The README reports 1M-row benchmarks and a test count.

## System architecture

The system consists of a local processing path, pseudonymization logic, desktop GUI, and input/output boundaries. Material enters the flow on the local machine, while the GUI handles operation and feedback; “local” is not expanded into an additional compliance claim here.

## Key technical decisions

Local processing makes the data boundary explicit; deterministic pseudonymization keeps replacement relationships repeatable; and the GUI exposes processing steps to desktop users. These decisions correspond to capabilities reported by the README.

## Results and validation evidence

The README reports local processing, deterministic pseudonymization, a GUI, 1M-row benchmarks, and a test count. This section preserves that benchmark and test evidence without adding a masking-quality or security-certification claim.

## Known limitations and next steps

The README-reported benchmark and test count are not presented as a guarantee across every data shape. A next step is to cover more input boundaries while preserving the local-processing and deterministic-pseudonymization semantics and recording the resulting validation.
