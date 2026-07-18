# Second Brain Research Pack

Deep-dive research on building a "second brain" with LLMs, knowledge graphs, wikis, and personal knowledge management (PKM) tools. Compiled 2026-07-18 from live web sources.

Start with **[overview.md](overview.md)** — the full report: concept, history, the six current method families, how they compare, and how to choose.

## Method directories

Each directory contains a `README.md` (concept documentation + getting-started instructions) and a `resources.md` (GitHub repos, articles, tutorials, videos).

| Directory | Method | One-line pitch |
|---|---|---|
| [llm-wiki/](llm-wiki/README.md) | Agent-maintained LLM Wiki (Karpathy pattern) | An AI agent builds and maintains an interlinked markdown wiki for you; the hottest technique of 2026 |
| [obsidian-ai/](obsidian-ai/README.md) | Obsidian + AI plugins & MCP | Keep your familiar local vault; add semantic search, chat, and agent access via plugins and MCP servers |
| [rag-apps/](rag-apps/README.md) | Self-hosted RAG second-brain apps | Turnkey apps (Khoj, AnythingLLM, Quivr) that index your documents and let you chat with them |
| [knowledge-graphs/](knowledge-graphs/README.md) | Knowledge-graph / GraphRAG systems | Extract entities and relations from your notes into a graph for multi-hop, relationship-aware retrieval |
| [memory-layers/](memory-layers/README.md) | Agent memory layers | Persistent memory infrastructure (Mem0, Letta, Zep/Graphiti, Basic Memory) so your AI remembers you across sessions |
| [classic-pkm-wikis/](classic-pkm-wikis/README.md) | Classic PKM methods & wikis, AI-augmented | Zettelkasten, PARA/CODE, Logseq, TiddlyWiki, Dendron/Foam and open-source Notion alternatives with AI layered on |
| [hosted-tools/](hosted-tools/README.md) | Hosted AI-native note tools | Commercial tools (NotebookLM, Notion AI, Tana, Mem, Reflect, Capacities) if you want zero setup |

## How this pack was built

- Process: scoped question -> multi-angle web research -> source verification (GitHub repos fetched directly for stars/licenses/activity; primary sources such as Karpathy's gist read in full) -> synthesis -> report.
- Every factual claim in these files carries a source link. Star counts and activity status were verified against the live repos on 2026-07-18 and are marked as of that date.
- Conflicting views (e.g., wiki-compilation vs. RAG, "AI second brain" skeptics) are included deliberately.
