# Second Brain Research Pack

**Research date:** 2026-07-18. Compiled from live web sources — primary GitHub repos, official docs, and current (2025–2026) articles, tutorials, and videos. Every claim is cited inline.

This directory is a comprehensive map of the current (mid-2026) methods and tools for building a "second brain" — a personal, external knowledge system — with special focus on how LLMs, knowledge graphs, and wikis have changed the practice since ~2024.

## How to use this pack

1. Read **[overview.md](overview.md)** first — it explains the concept, its history, the major variations in depth, and summarizes every method and every tool option covered here.
2. Use **[getting-started.md](getting-started.md)** to pick a method that matches your constraints (privacy, budget, effort, technical skill) and follow a concrete trial path for it.
3. Dive into the per-method subdirectories. Each contains:
   - `README.md` — detailed documentation of the method: what it is, how it works, architecture, strengths/weaknesses, and step-by-step instructions for trialling it.
   - `resources.md` — the curated resource list: GitHub repos, code, articles, official docs, tutorials, and videos.

## Directory map

| Directory | Method | One-line summary |
|---|---|---|
| [methodologies/](methodologies/) | Human frameworks (PARA, CODE, Zettelkasten, MOC, digital gardening) | The organizing philosophies every tool-based approach builds on |
| [llm-wiki/](llm-wiki/) | Karpathy's LLM Wiki / agent-maintained wiki | The 2026 breakout pattern: an LLM agent (e.g. Claude Code) compiles your sources into a persistent, cross-linked markdown wiki and maintains it |
| [pkm-apps/](pkm-apps/) | PKM apps + AI (Obsidian + AI plugins, Logseq, Notion, Tana, Capacities, Reflect, Mem, NotebookLM) | Human-first note apps with AI layered on top |
| [rag-assistants/](rag-assistants/) | Self-hosted RAG "second brain" assistants (Khoj, AnythingLLM, Open WebUI, Quivr, Reor) | Chat-with-your-documents systems: embed your files, retrieve at query time |
| [knowledge-graphs/](knowledge-graphs/) | Knowledge-graph and GraphRAG systems (Microsoft GraphRAG, Graphiti/Zep, Cognee, Neo4j tooling) | Extract entities and relations from your data into a queryable graph |
| [agent-memory/](agent-memory/) | Agent memory as second brain (mem0, Letta, Basic Memory, MCP servers) | Give a persistent AI assistant long-term memory that doubles as your knowledge base |
| [wikis-digital-gardens/](wikis-digital-gardens/) | Personal wikis and published digital gardens (Quartz, Obsidian Publish, TiddlyWiki, Wiki.js) | Structured, browsable, optionally public knowledge sites |

## The one-paragraph orientation

A second brain in 2026 is built from three ingredients that you can mix freely: a **methodology** (how knowledge is captured, organized, and linked — PARA, Zettelkasten, CODE), a **substrate** (where it lives — markdown vault, database app, wiki, graph database), and increasingly an **AI layer** (what reads, writes, retrieves, or maintains it — RAG chat, semantic search, a knowledge-graph pipeline, or a full agent that owns the maintenance work). The biggest shift of the past year is the move from *AI-assisted* second brains (you write, AI retrieves) to *AI-maintained* second brains (you curate sources, the LLM writes and maintains the knowledge base), crystallized by Andrej Karpathy's ["LLM Wiki" gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) in April 2026 and the wave of Claude Code + Obsidian workflows that followed.
