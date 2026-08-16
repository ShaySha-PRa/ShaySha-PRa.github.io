---
title: Manim Project
slug: manim-project
locale: en
translationKey: manim-project
summary: An AI-math-animation task system organized around an immutable version chain, a Redis queue, an isolated Runner, and Preview/Final artifacts.
published: 2026-08-16
updated: 2026-08-16
draft: false
status: experiment
role: Independent developer
tech: [Python, Manim, Redis, Runner, Task queue]
repoUrl: https://github.com/ShaySha-PRa/Manim_project
cover: ../../../assets/projects/manim-project/cover.svg
gallery: []
featured: false
order: 4
evidence:
  - The README reports an immutable version chain, Redis queue, isolated Runner, and Preview/Final artifacts.
---

## The problem to solve

Math-animation generation needs both a record of version changes and an isolated place to run rendering work. This experiment explores how to connect AI generation, queue scheduling, and Preview/Final artifacts.

## My design and implementation

I used an immutable version chain to preserve version relationships, a Redis queue to organize tasks, and an isolated Runner for rendering. The flow separates Preview and Final artifacts so outputs from different stages remain explicit.

## System architecture

The system is composed of a version chain, Redis queue, isolated Runner, and artifact paths. Tasks enter the queue and are executed by the Runner, with preview and final outputs kept at separate boundaries; this page makes no claim about throughput or render success rate.

## Key technical decisions

The immutable version chain preserves each change relationship; the Redis queue decouples submission from Runner execution; and the isolated Runner defines a rendering boundary. Preview/Final layers keep intermediate and final artifacts separate during the experiment.

## Results and validation evidence

The README reports an immutable version chain, Redis queue, isolated Runner, and Preview/Final artifacts. These are structural facts from the repository; the project remains marked as an experiment rather than stable production capability.

## Known limitations and next steps

The experiment status leaves real rendering scenarios, task scale, and artifact quality for further validation. This page adds no success rate or performance metric absent from the README; the next step is repeatable validation around concrete animation tasks.
