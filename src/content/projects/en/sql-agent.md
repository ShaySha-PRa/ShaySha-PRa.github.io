---
title: SQLAgent
slug: sql-agent
locale: en
translationKey: sql-agent
summary: An analysis-delivery workflow that connects business context, observable query stages, and SQL, data, charts, and interpretation.
published: 2026-08-16
updated: 2026-08-17
draft: false
status: completed
role: Independent developer
tech: [React, FastAPI, LangChain, Vanna, Milvus, MySQL, SSE]
repoUrl: https://github.com/ShaySha-PRa/SQLAgent
cover: ../../../assets/projects/sql-agent/cover.png
gallery: []
featured: false
order: 5
evidence:
  - The principal repository track contains React, FastAPI, LangChain/Vanna, Milvus, a local embedding service, MySQL, and SSE; the CSV QA prototype is kept separate.
  - Images come from the repository's docs/images home, query-result, and API documentation screens; they use demo or synthetic data and make no accuracy claim.
caseStudy:
  category: Data Platform
  scope: Full-stack NL2SQL assistant
---

## What it solves

Business data analysis is not only a matter of translating a question into SQL. The system also needs to understand the schema, business naming, and query habits of a known database, while making the analysis inspectable, traceable, and reusable. This workspace puts the natural-language question, three kinds of retrieved context, SQL, and multi-format results into one workflow so a user can follow the path from the question to SQL, data, charts, and written interpretation.

## Core capabilities

<ul class="project-capabilities" data-project-capabilities>
  <li>Query a business database in natural language</li>
  <li>Manage DDL, business documentation, and historical SQL examples</li>
  <li>Preserve multi-turn analysis context</li>
  <li>Generate, inspect, validate, and execute SQL</li>
  <li>Inspect data in a result table</li>
  <li>Generate charts and written analysis automatically</li>
</ul>

## How it works

<ol class="project-flow" data-project-flow>
  <li>Enter a natural-language question</li>
  <li>Retrieve context and generate SQL</li>
  <li>Validate and execute the query</li>
  <li>Inspect the table, chart, and answer</li>
</ol>

The user asks a question in the React workspace, and the system first retrieves DDL, business documentation, and historical SQL examples before generating a query for the known database. Retrieval hits, the SQL draft, validation feedback, execution status, and final interpretation return as observable stages; multi-turn analysis context is preserved so a follow-up can continue the same investigation.

## Project highlights

### Ground SQL in three kinds of context

The system treats DDL, business documentation, and historical SQL examples as separate context sources for structure, business semantics, and query conventions. Together they supplement the question before SQL generation, allowing the agent to use table structure and business naming rather than guess at fields; the CSV QA prototype remains a separate experiment.

### Make every query stage observable

The workflow separates retrieval, generation, validation, execution, and interpretation into stages that can be inspected afterward. A user can see what context was retrieved, which SQL was generated, how validation responded, whether the query executed, and how the result was interpreted; when an answer is unexpected, the issue can be located in a concrete stage instead of hidden behind one opaque response.

<figure class="project-evidence">
  <img src="/projects/sql-agent/api-docs.png" alt="SQLAgent available query and training interface documentation" width="1400" height="900" loading="lazy" />
  <figcaption>The API documentation screenshot shows the available chat, training-data, database, and query operations as a query-and-training surface; it comes from the repository demo.</figcaption>
</figure>

### Deliver SQL, data, charts, and interpretation together

After execution, the workspace keeps the generated SQL, result table, chart configuration, and written analysis together. A user can inspect the data first and then assess the conclusion through the chart and interpretation; SSE returns intermediate stages and results so a natural-language question becomes a complete, inspectable delivery.

<figure class="project-evidence">
  <img src="/projects/sql-agent/query-result.png" alt="SQLAgent query result workspace" width="1500" height="940" loading="lazy" />
  <figcaption>The query screen visibly includes the SQL editor, result table, chart, and input area, showing how SQL, data, and analysis delivery meet; the image comes from the repository demo.</figcaption>
</figure>

## System architecture

<figure class="project-architecture">
  <div class="project-architecture__scroller" data-project-architecture-scroller tabindex="0">
    <img src="/projects/sql-agent-architecture.svg" alt="SQLAgent architecture: the React workspace uses FastAPI to orchestrate an NL2SQL agent, vector retrieval, MySQL queries, and SSE results" width="1400" height="760" />
  </div>
  <figcaption>The diagram keeps the Vanna/LangChain principal track visible and separates context retrieval from database querying; it does not extend the raw SQL endpoint into a security claim.</figcaption>
</figure>

The React workspace connects through FastAPI to the NL2SQL Agent. The agent obtains context from a vector store containing DDL, business documentation, and historical SQL examples, then calls SQL validation and execution tools against MySQL; SSE returns intermediate steps and results to the page, where SQL, table, chart, and written analysis meet. Database permissions, an SQL sandbox, and final human review are not guaranteed by this application path alone and remain external safeguards in the deployment environment.

## Project scope

This is an assistant for a known database, not a claim of generalized NL2SQL capability across arbitrary databases or natural-language requests. The screenshots use demo or synthetic data and do not imply an accuracy metric; CSV QA is outside the principal path. Database permissions, sandboxing, and human review remain external safeguards that must be supplied by the deployment environment and operating process.
