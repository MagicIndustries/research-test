# Knowledge Graphs / GraphRAG — Resources

*Collected 2026-07-18.*

## GitHub repositories

- **microsoft/graphrag** — reference GraphRAG pipeline; MIT; v3.1.1 (2026-07). https://github.com/microsoft/graphrag
- **getzep/graphiti** — temporal knowledge graphs for agents; Apache-2.0; engine behind Zep. https://github.com/getzep/graphiti
- **topoteretes/cognee** — vector+graph agent memory; Apache-2.0; embedded or server deployment. https://github.com/topoteretes/cognee
- **Jallermax/knowledge-nexus** — "GraphRAG for Second Brain": ingest → graph → query/explore. https://github.com/Jallermax/knowledge-nexus
- **neo4j-labs/llm-graph-builder** — Neo4j's no-code LLM Knowledge Graph Builder. https://github.com/neo4j-labs/llm-graph-builder

## Official docs

- GraphRAG docs (quickstart, prompt tuning, cost warnings) — https://microsoft.github.io/graphrag/
- Zep / Graphiti docs — https://help.getzep.com/graphiti
- Cognee docs — https://docs.cognee.ai
- Neo4j LLM Knowledge Graph Builder release post — https://neo4j.com/blog/developer/llm-knowledge-graph-builder-release/

## Articles and guides

- **Knowledge Base vs Knowledge Graph for LLM Systems (2026 Guide)** (Kloia) — when graphs beat vectors; hybrid architecture guidance. https://www.kloia.com/blog/knowledge-base-vs-knowledge-graph-llm
- **From LLMs to Knowledge Graphs: Building Production-Ready Graph Systems in 2025** (Claudiu Branzan) — production patterns, hybrid routing, agentic GraphRAG. https://medium.com/@claudiubranzan/from-llms-to-knowledge-graphs-building-production-ready-graph-systems-in-2025-2b4aff1ec99a
- **Agent Memory Systems and Knowledge Graphs: Letta, Mem0, Graphiti, and Cognee** (Codepointer) — how the graph-memory tools relate. https://codepointer.substack.com/p/agent-memory-systems-and-knowledge

## Research papers

- **PersonalAI 2.0: Enhancing knowledge graph traversal/retrieval with planning for Personalized LLM Agents** — https://arxiv.org/pdf/2605.13481
- **GraphRAG-Router: Cost-Efficient Routing over GraphRAGs and LLMs with RL** — https://arxiv.org/pdf/2604.16401
- Microsoft's original GraphRAG paper ("From Local to Global") — linked from the repo/docs above.

## Getting-started commands

- GraphRAG: `pip install graphrag` then the CLI quickstart at https://microsoft.github.io/graphrag/ (index small first — indexing is expensive).
- Graphiti: `pip install graphiti-core`; needs Neo4j/FalkorDB/Neptune + an LLM key; ontology via Pydantic models.
- Cognee: `uv pip install cognee`; embedded mode needs only an LLM key (SQLite + LanceDB + Kuzu under the hood).
