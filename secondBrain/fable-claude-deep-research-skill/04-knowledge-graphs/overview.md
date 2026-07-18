# Knowledge Graphs & GraphRAG — Structured Relational Second Brains

> Researched 2026-07-18. GraphRAG (2024) is the oldest item here and still the reference architecture; LightRAG (EMNLP 2025) is the current pragmatic default.

## The approach

Instead of (or in addition to) embedding text chunks, an LLM **extracts entities and relationships** from your content and stores them as an explicit graph. Retrieval then walks the graph — enabling questions flat RAG fails at:

- **Multi-hop:** "How does X relate to Z through Y?"
- **Global/aggregate:** "What are the main themes across everything I've read this year?"
- **Relational:** "Which people/projects/ideas connect these two domains?"

## The main frameworks

### Microsoft GraphRAG — the reference implementation
[github.com/microsoft/graphrag](https://github.com/microsoft/graphrag)

Pipeline: chunk → LLM entity/relation extraction → **Leiden community detection** → hierarchical **community summaries**. Query modes: *local* (entity-centric) and *global* (across community summaries — its signature capability). **Cost warning:** indexing makes LLM calls per chunk and again per community summary; it's expensive and slow on real corpora. Best when you need its global-question power and the corpus justifies the spend.

### LightRAG — the pragmatic default
[github.com/HKUDS/LightRAG](https://github.com/hkuds/lightrag) (EMNLP 2025)

Dual-layer architecture managing a knowledge graph **and** vector embeddings together; dual-level (local+global) retrieval. Benchmarked ~30% lower query latency than standard pipelines and ~50% faster **incremental updates** — the killer feature for a second brain, where you add sources daily and can't afford full re-indexing. Start here for personal graph-RAG.

### nano-graphrag — for learning the internals
[github.com/gusye1234/nano-graphrag](https://github.com/gusye1234/nano-graphrag)

A small, readable, hackable GraphRAG (~1k lines core). Not what you run in production; what you read to actually understand the architecture, and fork for experiments. [Good breakdown here](https://gonamlui.com/blog/brief-breakdown-of-nano-graphrag-a-lightweight-alternative-to-graphrag).

### Neo4j LLM Knowledge Graph Builder — the no-code path
[github.com/neo4j-labs/llm-graph-builder](https://github.com/neo4j-labs/llm-graph-builder) · [hosted app](https://llm-graph-builder.neo4jlabs.com/)

Web app: connect a (free) Neo4j Aura instance, feed it PDFs/URLs/YouTube transcripts, pick an LLM, and it constructs + visualizes the graph. Schema can be predefined, inferred, or LLM-suggested. Backed by [neo4j-graphrag-python](https://neo4j.com/docs/neo4j-graphrag-python/current/user_guide_kg_builder.html) and a [free GraphAcademy course](https://graphacademy.neo4j.com/courses/llm-knowledge-graph-construction/). The fastest way to *see* your knowledge as a graph before writing any code.

## Personal second-brain graph projects (smaller, inspiration-grade)

- [Jallermax/knowledge-nexus](https://github.com/Jallermax/knowledge-nexus) — "GraphRAG for Second Brain": ingests Notion/Pocket/web into a Neo4j entity-topic-content graph.
- [M0nkeyFl0wer/second-brain-hybrid-graph](https://github.com/M0nkeyFl0wer/second-brain-hybrid-graph) — local-first hybrid: flat vector search → graph traversal; embedded DuckDB + Ollama + NetworkX; no server, no API keys. Interesting thesis: graph context lets small local models punch above their weight.
- [raold/second-brain](https://github.com/raold/second-brain) — 100% local multimodal second brain: PostgreSQL + pgvector, LLaVA/CLIP for images, knowledge-graph features, Google Drive streaming.
- [violettance/second_brain](https://github.com/violettance/second_brain) — AI-assisted notes with dynamic knowledge-graph visualization and short/long-term memory framing.
- [cristianleoo/rag-knowledge-graph](https://github.com/cristianleoo/rag-knowledge-graph) — tutorial-style RAG + KG repo.

## Honest trade-offs

| | Flat RAG | LLM Wiki | GraphRAG-class |
|---|---|---|---|
| Setup | minutes | ~1 hour | hours–days |
| Infra | app only | markdown + agent | graph DB (or embedded), pipelines |
| Indexing cost | low | medium (agent tokens) | **high** (GraphRAG) / medium (LightRAG) |
| Multi-hop & global questions | weak | decent (if linked well) | **best** |
| Human-readable store | n/a | **yes (markdown)** | no (DB) |
| Incremental updates | trivial | natural | hard (GraphRAG) / OK (LightRAG) |

**When graphs earn their keep:** large corpus (thousands of documents), entity-dense domains (papers, people, orgs, products), genuine relational questions. For a personal vault of hundreds of notes, the LLM Wiki (`../02-llm-wiki/`) delivers most of the benefit in markdown. Hybrid path: keep the wiki as source of truth, run LightRAG over it when you need graph queries.
