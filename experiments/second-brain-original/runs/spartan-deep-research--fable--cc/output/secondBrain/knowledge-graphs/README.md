# Method: Knowledge Graphs & GraphRAG

Use an LLM to extract **entities and relationships** from your notes and documents into a graph, then answer questions by traversing that graph (optionally combined with vector search). This is the method for questions plain RAG handles poorly: multi-hop reasoning ("how does X relate to Z via Y?"), whole-corpus themes ("what are the main tensions across everything I've read?"), and relationship-dense domains.

## How it works

1. **Extraction/indexing**: an LLM reads each document and emits entities (people, concepts, projects) and typed relations, merged into a graph; GraphRAG additionally clusters the graph into hierarchical "communities" and pre-writes community summaries.
2. **Retrieval**: *local search* fans out from specific entities to neighbors; *global search* uses community summaries for corpus-wide questions; hybrid systems mix in vector search ([GraphRAG docs](https://microsoft.github.io/graphrag/)).
3. **Generation**: the LLM answers grounded in retrieved subgraphs + source chunks.

The 2025–2026 production trend is **hybrid routing** — vector + graph + structured lookup, chosen per query — and "agentic Graph RAG," where an agent orchestrates retrieval with the graph as persistent structured memory ([Branzan, Medium](https://medium.com/@claudiubranzan/from-llms-to-knowledge-graphs-building-production-ready-graph-systems-in-2025-2b4aff1ec99a)).

## The main options (verified 2026-07-18 where noted)

### Microsoft GraphRAG — the reference architecture
([repo](https://github.com/microsoft/graphrag); [docs](https://microsoft.github.io/graphrag/)). CLI-driven: `graphrag init` scaffolds a project (`settings.yaml`, `.env`, `input/`), `graphrag index` builds the graph, `graphrag query` supports Local / Global / DRIFT / Basic search modes. **Caveat the docs themselves state: indexing is expensive — read the docs and start small.** LazyGraphRAG (Microsoft, late 2024) reduced indexing costs 10–90%.

### LightRAG — the practical default for individuals
~37.8k stars (verified), MIT, from HKU; EMNLP 2025 paper ([repo](https://github.com/HKUDS/LightRAG)). Dual-layer graph+vector architecture, dual-level retrieval; benchmarks show it beating NaiveRAG/HyDE/GraphRAG across domains at ~10x lower token cost. Ships a **server with Web UI**, REST API, Python SDK, Docker Compose; storage backends from files (dev) to PostgreSQL/Neo4j/Qdrant/Milvus/MongoDB. Install: `uv tool install "lightrag-hku[api]"`. Active: 78 releases, multimodal ingestion, reranking, RAGAS/Langfuse integration.

### Graphiti (Zep) — temporal knowledge graphs
([repo](https://github.com/getzep/graphiti); paper [arXiv:2501.13956](https://arxiv.org/abs/2501.13956)). Facts carry **validity windows**: when information changes, old facts are invalidated, not deleted — query what's true now or at any past time. Purpose-built for agent memory over evolving personal/real-world data; provenance to sources; prescribed or learned ontologies. The strongest fit when your second brain must model *change over time* (projects, relationships, opinions).

### Neo4j LLM Knowledge Graph Builder — the visual on-ramp
([repo](https://github.com/neo4j-labs/llm-graph-builder); [hosted app](https://llm-graph-builder.neo4jlabs.com/)). Drag in PDFs, web pages, YouTube transcripts; an LLM (OpenAI/Gemini/Claude/Llama/Diffbot/Qwen) extracts nodes and relations into Neo4j with a visual explorer. Deployable locally via Docker Compose. Best way to *see* what graph extraction does before committing to a pipeline.

### Personal-notes-specific
- **Jallermax/knowledge-nexus** — "GraphRAG for Second Brain": ingest -> build KG -> query/explore connections, aimed at PKM corpora. https://github.com/Jallermax/knowledge-nexus
- **junhewk/simple-graph-builder** — Obsidian plugin doing LLM entity extraction + RAG search inside your vault. https://github.com/junhewk/simple-graph-builder

## Getting started (recommended: LightRAG)

1. `uv tool install "lightrag-hku[api]"` (or clone + Docker Compose).
2. Set your LLM/embedding keys (or point at Ollama) in the env/config.
3. Start the server; open the Web UI; upload a batch of notes/PDFs.
4. Inspect the extracted graph in the UI — check entity quality before scaling; garbage extraction compounds.
5. Query in the four modes (naive/local/global/hybrid) and compare answers against plain RAG on your own questions; keep the graph only if it wins.
6. To try GraphRAG proper: `pip install graphrag`, `graphrag init --root ./mykb`, put text in `input/`, run index then query — with a small corpus first (cost).

## When to choose this method

- Multi-hop and "connect the dots" questions dominate.
- Your domain is entity-rich (research fields, organizations, codebases, history).
- You're building agent memory that must track change over time (Graphiti).

**Costs to accept**: LLM-powered indexing costs money and time on every re-index; extraction quality varies by domain; the graph is machine-facing (unlike a wiki, you won't read it for pleasure). Skeptical practitioners note plain markdown + grep + a good agent covers many "graph" use cases — benchmark before committing ([Kloia's KB-vs-KG guide](https://www.kloia.com/blog/knowledge-base-vs-knowledge-graph-llm)).

All links: **[resources.md](resources.md)**.
