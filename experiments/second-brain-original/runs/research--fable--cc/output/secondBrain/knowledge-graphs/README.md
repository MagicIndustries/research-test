# Knowledge-Graph Second Brains (GraphRAG Family)

*Method documentation. Resource list: [resources.md](resources.md). Researched 2026-07-18.*

## What it is

A knowledge-graph second brain stores knowledge as **entities and relationships** rather than (only) as documents or embedding vectors. An LLM pipeline reads your unstructured material, extracts "Alice —works-on→ Project X," "Concept A —contradicts→ Concept B" style triples plus summaries, and loads them into a graph database. Questions are then answered by graph traversal and community summaries, optionally combined with vector search.

Why this matters now: LLMs removed the historical blocker — building graphs used to require manual ontology work and information-extraction engineering; now LLMs build them automatically from text ([Kloia, Knowledge Base vs Knowledge Graph for LLM Systems, 2026](https://www.kloia.com/blog/knowledge-base-vs-knowledge-graph-llm)). Graphs beat plain vector RAG precisely on the questions second brains exist for: multi-hop connections ("how does this note relate to that decision from March?"), whole-corpus summaries, and provenance. The 2025–26 production consensus is **hybrid**: vector + graph + structured lookup, routed per query, with "agentic GraphRAG" — an agent orchestrating retrieval strategies over a persistent graph — as the emerging frontier ([Branzan, production graph systems 2025](https://medium.com/@claudiubranzan/from-llms-to-knowledge-graphs-building-production-ready-graph-systems-in-2025-2b4aff1ec99a)).

## The main options

### Microsoft GraphRAG — the reference architecture

[microsoft/graphrag](https://github.com/microsoft/graphrag) (MIT, ~34.5k stars, v3.1.1 released 2026-07-18, docs at [microsoft.github.io/graphrag](https://microsoft.github.io/graphrag/)). A data pipeline that extracts entities/relationships from a corpus, clusters them into hierarchical **communities**, and pre-writes community summaries — enabling both "local" (entity-centric) and "global" (whole-corpus) query modes. Verified caveats from the repo: it's a research demonstration, not a supported product, and "GraphRAG indexing can be an expensive operation" — start small. **LazyGraphRAG** (deferred summarization) reduced indexing cost by 10–90%, which is what makes personal-scale corpora practical. Best fit: batch-indexing a research corpus for deep global questions.

### Graphiti (Zep) — temporal knowledge graphs

[getzep/graphiti](https://github.com/getzep/graphiti) (Apache-2.0; the open-source engine inside Zep's managed service). Distinctives, verified from the repo:

- **Temporal facts**: every fact has a validity window; superseded facts are preserved, not deleted — query current state *or* any historical point. This is uniquely valuable for a second brain that tracks evolving beliefs and decisions.
- **Episodes and provenance**: every entity/edge traces back to the raw data that produced it.
- **Incremental updates**: new data integrates without re-computing the graph (unlike GraphRAG's batch indexing).
- **Hybrid retrieval**: embeddings + BM25 + graph traversal, without depending on LLM summarization at query time.
- Stack: Python 3.10+, `pip install graphiti-core`, Neo4j / FalkorDB / Amazon Neptune backends, OpenAI (default) / Anthropic / Gemini / Groq LLMs; custom ontologies via Pydantic models.

Best fit: continuously-updated personal/agent memory where *when things were true* matters. Zep reports strong results vs alternatives on LongMemEval (63.8% vs mem0's 49.0% with GPT-4o — vendor-reported; see [agent-memory/](../agent-memory/)).

### Cognee — pragmatic vector+graph memory

[topoteretes/cognee](https://github.com/topoteretes/cognee) (Apache-2.0, ~28k stars, v1.4.0 July 2026). "Persistent long-term memory for agents": combines vector embeddings with graph reasoning so documents are "both searchable by meaning and connected by relationships." Four operations: **remember, recall, forget, improve**. Its infrastructure flexibility is the draw for personal use, verified from the repo: it can run entirely on Postgres+pgvector, on a traditional stack (Neo4j, Redis, vector DB), or **fully embedded** (SQLite + LanceDB + Kuzu) — meaning a laptop-only knowledge graph with no servers. Install: `uv pip install cognee`; Python 3.10–3.14 plus an LLM key. Best fit: developers who want graph+vector memory without operating Neo4j.

### Neo4j LLM Knowledge Graph Builder — no-code entry point

Neo4j's open tool turns PDFs, web pages, and YouTube videos into a Neo4j knowledge graph via a web UI, with a built-in GraphRAG chat over the result ([Neo4j developer blog](https://neo4j.com/blog/developer/llm-knowledge-graph-builder-release/)). Pairs with Neo4j AuraDB's free tier. Best fit: seeing your material as a graph within an hour, no code.

### knowledge-nexus — GraphRAG aimed at second brains

[Jallermax/knowledge-nexus](https://github.com/Jallermax/knowledge-nexus) — a community project explicitly framed as "GraphRAG for Second Brain": ingest knowledge (Notion, bookmarks, notes) → build knowledge graphs → query and explore connections. Smaller and less polished than the above, but the closest match to this method's personal use case; good code to read.

## Choosing within this method

| Need | Pick |
|---|---|
| Deep batch analysis of a research corpus; global questions | Microsoft GraphRAG |
| Continuously growing memory with time-aware facts | Graphiti |
| Graph+vector memory, minimal ops, embedded option | Cognee |
| Visual, no-code first experience | Neo4j LLM KG Builder |
| Reference code for a personal-notes graph | knowledge-nexus |

## Trial instructions

**Path 1 — no-code (1–2 h):** free Neo4j AuraDB instance → LLM Knowledge Graph Builder → upload ~10 documents → inspect the extracted graph visually → use the built-in chat and note where graph answers beat what you'd expect from vector search.

**Path 2 — embedded Cognee (an evening):** `uv pip install cognee`, set an OpenAI key, run the quickstart (add → cognify → search) over a folder of notes; stays entirely on-device with the embedded stores.

**Path 3 — Graphiti (weekend):** run Neo4j via Docker; `pip install graphiti-core`; write a small script that ingests dated journal entries or meeting notes as episodes; then query "what did I believe about X in May vs now" to see temporal facts work.

**Path 4 — GraphRAG (weekend + budget):** follow the [command-line quickstart](https://microsoft.github.io/graphrag/); index a *small* corpus first (indexing costs scale with corpus size and model choice); compare `local` vs `global` query modes on the same question.

**Reality check:** this is the heaviest method in this pack. If your questions are mostly recall ("find that note"), a [RAG assistant](../rag-assistants/) or [LLM Wiki](../llm-wiki/) delivers more value per unit of setup; graphs earn their cost when connection-questions dominate.
