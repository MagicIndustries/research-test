# Method: Agent Memory Layers

Instead of (or alongside) a knowledge base *you* browse, give your AI assistants a **persistent memory**: infrastructure that extracts facts and preferences from conversations, stores them (vectors, key-value, graphs, or markdown), and retrieves them so the AI remembers you across sessions and apps. This is "second brain for your agents" — increasingly the substrate under every other method here.

## The architectural split

Per the 2026 comparisons ([Vectorize: Mem0 vs Letta](https://vectorize.io/articles/mem0-vs-letta); [Mem0 vs Zep](https://vectorize.io/articles/mem0-vs-zep); [Atlan framework roundup](https://atlan.com/know/best-ai-agent-memory-frameworks-2026/)):

- **Memory as a layer** (Mem0, Zep/Graphiti, Basic Memory): bolt-on storage+retrieval you add to any agent framework.
- **Memory as the runtime** (Letta, ex-MemGPT): the agent platform *is* the memory system — it manages the loop, tools, and tiered memory.

## The main options (verified 2026-07-18 where noted)

### Mem0 — the ecosystem leader
~61.1k stars (verified), Apache-2.0 ([repo](https://github.com/mem0ai/mem0)). `pip install mem0ai`; `add()` extracts facts/preferences from messages and stores them across **vector + key-value + graph** stores; hybrid semantic/keyword/entity retrieval; multi-level memory (user/session/agent). April 2026 research release: single-pass ADD-only extraction, LoCoMo 92.5 (+21), LongMemEval 94.4 (+27), BEAM 64.1 at 1M tokens — vendor-reported but published with reproducible benchmarks ([mem0.ai/research](https://mem0.ai/research)). Run as library, self-hosted Docker server, or their cloud. Also behind **OpenMemory**, an MCP memory server usable across MCP clients.

### Letta (formerly MemGPT) — the agent OS
([letta.com](https://www.letta.com); [repo](https://github.com/letta-ai/letta)). Full runtime with OS-inspired memory tiers: **core memory** in-context (RAM), **recall memory** — searchable conversation history (disk cache), **archival memory** — long-term store queried via tools (cold storage). Choose it when you're building agents top-to-bottom, not adding memory to an existing stack ([Vectorize comparison](https://vectorize.io/articles/mem0-vs-letta)).

### Zep / Graphiti — temporal-graph memory
([getzep/graphiti](https://github.com/getzep/graphiti); paper [arXiv:2501.13956](https://arxiv.org/abs/2501.13956)). Memory as a knowledge graph where facts have validity intervals — "what's true now" vs "what was true then." Best for assistants that must track evolving preferences/projects without forgetting history. Detailed in [../knowledge-graphs/](../knowledge-graphs/README.md).

### Basic Memory — memory you can read
([basicmachines-co/basic-memory](https://github.com/basicmachines-co/basic-memory); [docs](https://docs.basicmemory.com/welcome)). Local-first MCP server whose storage is **plain markdown files with wikilinks — an Obsidian-compatible vault**. Tools like `write_note`, `search_notes`, `build_context`; works with Claude (Desktop/Code), Cursor, ChatGPT, anything MCP. The bridge between agent memory and the human-readable second brain: the AI's memory *is* your vault. Companion repos add memory-management skills (reflection, defragmentation) and Claude Code plugins.

## Getting started (two easy paths)

**Path A — human-readable memory (Basic Memory):**
1. Install per docs (`uv tool install basic-memory` or the documented installer) and add it as an MCP server to Claude Desktop/Code config.
2. Point it at (or let it create) a markdown directory; open that directory as an Obsidian vault.
3. In conversation: "remember this," "write a note about X," "what do you know about project Y" — then watch the markdown appear/update, and edit it yourself freely.

**Path B — programmatic memory (Mem0):**
1. `pip install mem0ai`; instantiate `Memory()` (add a graph store config for entity memory).
2. On each conversation turn: `m.add(messages, user_id="you")`; before responding: `m.search(query, user_id="you")` and inject results into the prompt.
3. For cross-app memory without code, run OpenMemory (their MCP server) and register it in each MCP client.

## When to choose this method

- You use multiple AI tools and are tired of re-explaining context to each.
- You're building an assistant/agent product needing per-user personalization.
- You want your agent's memory auditable (choose Basic Memory) or benchmarked at scale (Mem0/Zep).

**Caveats**: benchmark numbers are mostly vendor-published — independent replication is thin; extraction-based memory can store wrong "facts" that then persist (review matters); a memory layer complements rather than replaces a knowledge base — it stores *what the agent learned about you*, not *your library*.

All links: **[resources.md](resources.md)**.
