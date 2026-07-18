# Agent Memory Layers — Memory as Infrastructure

> Researched 2026-07-18. Fast-moving space; star counts and pricing are mid-2026 snapshots.

## The approach

Instead of organizing *notes*, give an AI assistant a **memory system**: as you converse, it extracts facts, preferences, and events, stores them (vectors, graphs, or both), and recalls them in later sessions. This is the second brain built from the software side — the knowledge base is a byproduct of using the assistant, not something you tend.

Relevant to a second-brain project in two ways: (1) if you build your own assistant, this is the persistence layer; (2) MCP memory servers bring the same capability directly into Claude, often storing to your own markdown vault.

## The main systems

### mem0 — the pragmatic default
[github.com/mem0ai/mem0](https://github.com/mem0ai/mem0) (~47k stars)

Hybrid vector + graph + key-value store with **automatic fact extraction** from conversations. Simple API (`add`, `search`), managed platform with a free tier (paid from ~$19/mo) or self-hosted OSS. Best for user-personalization memory with minimal integration effort.

### Zep / Graphiti — the temporal knowledge graph
[github.com/getzep/graphiti](https://github.com/getzep/graphiti) (Apache 2.0, ~28k stars) · [getzep.com](https://www.getzep.com/)

Graphiti builds a **temporally-aware** knowledge graph: *EpisodicNodes* (raw inputs each fact came from), *EntityNodes*, *CommunityNodes* (cluster summaries), and fact edges carrying **validity intervals** — so "used to live in London, now lives in Tokyo" is represented correctly rather than as a contradiction. Benchmarks: Zep's paper reports 94.8% on Deep Memory Retrieval (vs 93.4% MemGPT) and up to +18.5% accuracy with ~90% latency reduction vs full-context on LongMemEval; third-party comparisons put Graphiti at **63.8% vs mem0's 49.0%** on LongMemEval with GPT-4o. *Caveat: headline numbers originate from Zep's own paper.* Managed Zep is the priciest tier (~$104/mo Flex); OSS Graphiti is free. Pick it when facts change over time and relationships matter.

### Letta — the agent runtime with self-managed memory
[github.com/letta-ai/letta](https://github.com/letta-ai/letta)

The MemGPT lineage: an OS metaphor where the context window is RAM and archival storage is disk, and **the agent itself** manages what moves between them via memory tools. It's a full agent framework (runs the agent for you, REST API), not a bolt-on layer. Strongest open-source community; managed Pro ~$20/mo.

### Cognee — pipelines that "cognify"
[github.com/topoteretes/cognee](https://github.com/topoteretes/cognee)

ECL (extract-cognify-load) pipelines that turn documents and conversations into a combined graph+vector memory queryable by agents. Sits between the RAG world and the memory world; good fit for turning an existing document corpus into agent memory.

### MCP memory servers — memory inside Claude, on your files

- **[Basic Memory](https://github.com/basicmachines-co/basic-memory)** (basicmachines-co) — the standout for second-brain purposes: conversation knowledge is written as **local markdown files** (entities, observations, relations) that are Obsidian-compatible, indexed in SQLite with hybrid full-text + vector search (FastEmbed). ~17 MCP tools; works with Claude Desktop, Claude Code, Cursor. Your AI memory *is* your vault.
- [modelcontextprotocol memory server](https://mcpservers.org/servers/modelcontextprotocol/memory) — the official simple local knowledge-graph server.
- [shaneholloman/mcp-knowledge-graph](https://github.com/shaneholloman/mcp-knowledge-graph) — local-development-focused fork of the same idea.
- Directories: [mcpservers.org memory category](https://mcpservers.org/category/memory) (98 servers listed), [Awesome Claude ranking](https://awesomeclaude.ai/mcp/knowledge-memory).

## Choosing

| Situation | Pick |
|---|---|
| Want Claude to remember things into your markdown vault | **Basic Memory** |
| Building an app, need drop-in personalization memory fast | **mem0** |
| Facts/relationships change over time; temporal reasoning | **Zep/Graphiti** |
| Want the agent framework + memory in one, community-driven | **Letta** |
| Turning an existing corpus into agent memory | **Cognee** |

## Relationship to the other approaches

These systems automate what Zettelkasten does manually (atomic facts + relations) and what the LLM wiki does semi-manually (agent-written pages). Basic Memory is the concrete convergence point: MCP memory that doubles as an Obsidian vault. A plausible end-state stack: LLM wiki as curated knowledge + Basic Memory for ambient conversational capture, both in one vault.
