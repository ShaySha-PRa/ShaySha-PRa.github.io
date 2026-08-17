---
title: SQLAgent
slug: sql-agent
locale: en
translationKey: sql-agent
summary: An observable data-analysis workflow connecting natural-language questions, retrieved context, SQL execution, and table-and-chart results.
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

## How a user works with it

<ol class="project-flow" data-project-flow>
  <li>Enter a natural-language question</li>
  <li>Retrieve context and generate SQL</li>
  <li>Validate and execute the query</li>
  <li>Inspect the table, chart, and answer</li>
</ol>

The user enters a question in the React workspace, and FastAPI hands it to the NL2SQL Agent. The agent retrieves context from DDL, business documentation, and SQL examples, generates SQL, sends it through validation and execution tools to MySQL, and streams steps, data, chart configuration, and the answer back to the page.

## System architecture

<figure class="project-architecture">
  <div class="project-architecture__scroller" data-project-architecture-scroller tabindex="0">
    <img src="/projects/sql-agent-architecture.svg" alt="SQLAgent architecture: the React workspace uses FastAPI to orchestrate an NL2SQL agent, vector retrieval, MySQL queries, and SSE results" width="1400" height="760" />
  </div>
  <figcaption>The diagram keeps the Vanna/LangChain principal track visible and separates context retrieval from database querying; it does not extend the raw SQL endpoint into a security claim.</figcaption>
</figure>

The NL2SQL Agent sits behind FastAPI and coordinates retrieval and database tools. DDL, business documentation, and historical SQL examples enter the vector store to supply schema and business context; generated SQL is validated and executed, then streamed back to the React workspace.

<figure class="project-evidence">
  <img src="/projects/sql-agent/query-result.png" alt="SQLAgent query result workspace" width="1500" height="940" loading="lazy" />
  <figcaption>The query screen visibly includes the SQL editor, result table, chart, and input area; the image comes from the repository demo.</figcaption>
</figure>

## Three key technical decisions

### Treat schema, documentation, and SQL examples as retrieval context

NL2SQL should not rely on the question text alone. The system puts DDL, business documentation, and historical SQL examples into vector retrieval so the agent sees table structure and business naming before generating a statement; the CSV QA prototype remains a separate experiment.

### Let the agent separate retrieval from execution through tools

The LangChain/LangGraph agent interprets the question, plans steps, and calls tools. A retrieval tool obtains table-schema context, while database tools handle SQL validation, version checks, and execution. This makes a failure attributable to a concrete stage: retrieval, generation, or execution.

### Use SSE to return intermediate steps and results to the workspace

The FastAPI streaming endpoint can send agent steps, query data, chart configuration, and the final answer to React. The frontend can therefore show SQL, a table, a chart, and an explanation together instead of waiting for an opaque final response.

<figure class="project-evidence">
  <img src="/projects/sql-agent/api-docs.png" alt="SQLAgent FastAPI API documentation interface" width="1400" height="900" loading="lazy" />
  <figcaption>The API documentation screen shows FastAPI endpoints for chat, training data, database, and query operations; the image comes from the repository demo.</figcaption>
</figure>

## Limitations and next steps

This page follows the repository's Vanna/LangChain principal track, with demo or synthetic data in the screenshots. Development CORS is permissive; the direct SQL endpoint executes the supplied statement, so the page does not describe it as a completed SQL sandbox. Runtime state still includes global client objects, CSV QA remains a separate prototype path, and component composition does not imply generalized NL2SQL accuracy. The next step is to provide isolated dependencies, services, and model configuration, then record one repeatable retrieval, generation, validation, execution, and SSE acceptance flow with sanitized synthetic data.
