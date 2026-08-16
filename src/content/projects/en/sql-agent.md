---
title: SQLAgent
slug: sql-agent
locale: en
translationKey: sql-agent
summary: A data-query agent connecting natural-language-to-SQL, RAG context, Milvus, MySQL, and SSE results with charts.
published: 2026-08-16
updated: 2026-08-16
draft: false
status: completed
role: Independent developer
tech: [NL2SQL, RAG, Milvus, MySQL, SSE]
repoUrl: https://github.com/ShaySha-PRa/SQLAgent
cover: ../../../assets/projects/sql-agent/cover.svg
gallery: []
featured: false
order: 5
evidence:
  - The README reports an NL2SQL flow, RAG context, Milvus, MySQL, SSE results, and charts.
---

## The problem to solve

Natural-language data questions need an observable path from understanding the request and database context through SQL execution and result presentation. SQLAgent focuses on that NL2SQL path and its result feedback.

## My design and implementation

I combined an NL2SQL flow with RAG context so query generation has an explicit context boundary. Milvus and MySQL sit at the retrieval and database boundaries, while SSE carries results and charts back through the flow.

## System architecture

The system is organized around natural-language input, RAG context, NL2SQL, MySQL query execution, an SSE result stream, and chart presentation. Milvus defines the vector-retrieval boundary and MySQL defines the query-data boundary; these components are not treated as an unreported accuracy claim.

## Key technical decisions

RAG context supplies the information boundary for NL2SQL; Milvus handles vector retrieval; MySQL keeps the query data source explicit; and SSE lets results and charts return along the query flow. Each decision corresponds to a component or path reported by the README.

## Results and validation evidence

The README reports an NL2SQL flow, RAG context, Milvus, MySQL, SSE results, and charts. This section records the repository-reported composition only, adding no query-accuracy, latency, or data-volume metric.

## Known limitations and next steps

The component chain is not presented as a guarantee about outcomes on real datasets. A next step is repeatable validation across database structures and natural-language questions while keeping retrieval, querying, and result presentation boundaries explicit.
