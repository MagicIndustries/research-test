# Second Brain Research — Master Index

> Research compiled 2026-07-18. All sources checked for freshness; anything older than ~18 months is flagged inline.

This directory is a comprehensive research base on building a "second brain" — a personal knowledge system that captures, organizes, connects, and resurfaces everything you learn — using LLMs, knowledge graphs, wikis, and related techniques.

## How to navigate

| File / Directory | What's in it |
|---|---|
| [`00-deep-summary.md`](00-deep-summary.md) | **Start here.** The full research report: concept, all variations in depth, comparisons, analysis, recommendations. |
| [`01-methodology/`](01-methodology/) | The organizational foundations: PARA, Zettelkasten, CODE, and how they've evolved in the AI era. |
| [`02-llm-wiki/`](02-llm-wiki/) | **The current dominant technique** — Karpathy's LLM Wiki pattern: an agent (Claude Code etc.) builds and maintains your knowledge base for you. |
| [`03-rag-assistants/`](03-rag-assistants/) | "Chat with your notes" tools: Khoj, Reor, AnythingLLM, Open Notebook, SurfSense, NotebookLM alternatives. |
| [`04-knowledge-graphs/`](04-knowledge-graphs/) | Graph-based approaches: Microsoft GraphRAG, LightRAG, nano-graphrag, Neo4j LLM Graph Builder, personal graph-RAG projects. |
| [`05-agent-memory/`](05-agent-memory/) | AI memory layers: mem0, Zep/Graphiti, Letta (MemGPT), Cognee, Basic Memory, MCP memory servers. |
| [`06-obsidian-plugins/`](06-obsidian-plugins/) | In-editor AI: Smart Connections, Copilot for Obsidian, Text Generator, Local GPT, local Ollama setups. |
| [`07-publishing-wikis/`](07-publishing-wikis/) | Making it public: Quartz, Obsidian Publish, digital gardens, TiddlyWiki, Logseq. |

Each subdirectory contains:
- `overview.md` — how the method works, architecture, strengths/weaknesses, when to choose it
- `resources.md` — GitHub repos, articles, tutorials, videos, courses, with setup instructions to trial it

## The seven approaches at a glance

| # | Approach | Core idea | Effort to start | Best for |
|---|---|---|---|---|
| 1 | Methodology (PARA/Zettelkasten) | Human-curated structure; AI assists | Low | Anyone; the foundation under everything else |
| 2 | LLM Wiki (Karpathy pattern) | An LLM agent *maintains* the knowledge base | Low–Medium (~1 hr) | Developers comfortable with Claude Code/CLI agents |
| 3 | RAG assistants | Index your docs, chat with them | Low (install an app) | Fast wins, non-developers, privacy-focused local AI |
| 4 | Knowledge graphs / GraphRAG | Extract entities+relations into a queryable graph | Medium–High | Deep relational questions across a large corpus |
| 5 | Agent memory layers | Memory as infrastructure for AI agents | Medium (dev work) | Building your own assistant/agent products |
| 6 | Obsidian AI plugins | AI inside the note editor | Very low | Existing Obsidian users |
| 7 | Publishing / digital gardens | Second brain as a public wiki | Low–Medium | Learning in public, sharing knowledge |

## Recommended trial order (from the analysis)

1. **If you use Obsidian already:** install Smart Connections + Copilot (`06-obsidian-plugins/`) — 30 minutes, immediate payoff.
2. **For the biggest capability jump:** build a Karpathy-style LLM Wiki with Claude Code on top of an Obsidian vault (`02-llm-wiki/`) — this is the technique the ecosystem converged on in 2026 and it composes with everything else.
3. **If you want a packaged product:** trial Khoj or Open Notebook (`03-rag-assistants/`).
4. **Go deeper later:** GraphRAG/LightRAG (`04-knowledge-graphs/`) when your corpus outgrows flat retrieval; agent memory (`05-agent-memory/`) if you start building your own assistant.
