# My Company Brain Architecture Diagram Redesign

## Objective

Replace the current simplified My Company Brain architecture SVG with a diagram that is concrete enough for technical interviews while remaining scannable for recruiters. The diagram must match the repository's documented boundaries, fit the existing Editorial Lab visual system, and remain readable on desktop and mobile.

## Approved direction

Use a layered system map with four horizontal bands:

1. Experience
2. Control Plane
3. Knowledge Plane
4. Data Plane

The diagram uses English only so the Chinese and English case-study pages can share one asset. It does not show deployment ports. It preserves real service names, primary responsibilities, security boundaries, knowledge paths, and data ownership without reproducing every implementation capability.

## Information architecture

### Experience

- Browser: team member and administrator entry point.
- Next.js Web: workspace, global Q&A, knowledge, and administration.
- The browser-to-Web relationship is the first step in the main request path.

### Control Plane

- Unified API: identity, platform routes, and module proxy.
- Agent Gateway: LangGraph, tools, SSE, and checkpoints.
- Platform Domain: scenes, tasks, audit, and global retrieval.
- Preserve `/api/platform/*` and `/api/agent/*` because these routes clarify the two Web entry paths without exposing deployment details.

### Protected module boundary

A single horizontal boundary separates orchestration from the three knowledge modules. Its label communicates:

- internal token;
- user context;
- resource-level permission filters.

This boundary must be visually distinct from an ordinary service node.

### Knowledge Plane

- Nano Brain: pages, facts, links, and search/ask.
- Traditional RAG: documents, tables, hybrid retrieval, and RRF.
- GraphRAG: entities, relations, graph search, and governance.

The three modules have equal visual weight to communicate that they are independent knowledge paths rather than modes inside one engine.

### Data Plane

- PostgreSQL: one instance containing six logical databases—identity, core, agent, nano, traditional, and graph.
- Neo4j: GraphRAG workspace and relationship graph.
- Fine ownership lines associate modules with their data stores without competing with the primary request path.

## Visual system

- Canvas: approximately `1400 × 820`, with generous outer margins and horizontal layer dividers.
- Background: existing paper color.
- Primary text and high-emphasis nodes: existing ink color.
- Main request flow and protected module calls: accessible dark vermilion.
- Dividers and secondary surfaces: existing sand color.
- Typography:
  - Georgia for the title and editorial heading;
  - Arial or the existing sans-serif system stack for nodes and descriptions;
  - Consolas or the existing monospace stack for route and database names.
- Avoid gradients, decorative shadows, icons, and unnecessary container chrome.
- Use consistent card sizes, aligned baselines, and orthogonal connectors.

## Connector language

- Solid vermilion lines: primary request flow.
- Dashed vermilion lines: protected internal module calls.
- Fine gray lines: data ownership.
- A compact legend appears below the title.
- Arrowheads must remain visible at the rendered desktop size.

## Responsive behavior

- The SVG keeps a wide fixed viewBox and scales to the case-study content width on desktop.
- On narrow screens, the existing architecture scroller contains the SVG; the page itself must not gain horizontal overflow.
- The minimum rendered width should preserve legible node text while allowing intentional horizontal exploration.
- The SVG title and description remain available to assistive technology, and the page retains localized alt text and captioning.

## Scope limits

The diagram will not include:

- deployment port numbers;
- model provider names, embedding dimensions, or fallback strategies;
- exhaustive route, tool, or capability inventories;
- test counts, health status, or production claims;
- runtime sequence details better explained in the case-study prose and validation matrix.

## Verification

- Add or update tests that assert the production SVG contains the four layer labels, three knowledge paths, protected boundary, six-database summary, and Neo4j.
- Assert removed details such as port suffixes and the external model boundary are absent.
- Rebuild the site and run the existing project-page desktop/mobile tests.
- Confirm the architecture asset loads, has meaningful SVG accessibility metadata, and remains inside its own mobile scroller.
- Render the final SVG for visual inspection at desktop size and at the mobile scroller's minimum width.
- Run the full repository validation before publishing.

## Acceptance criteria

The redesign is complete when a reader can identify the main request path, governance layer, three independent knowledge paths, permission boundary, and data ownership within roughly 30 seconds, while the diagram remains visually consistent with the surrounding Editorial Lab case study.
