# Building a Second Brain with LLMs, Knowledge Graphs, and Wikis — State of the Art, July 2026

## TL;DR

The second-brain space flipped in 2025–2026 from "note apps with AI features" to "AI agents that build and maintain your knowledge base for you," crystallized by Andrej Karpathy's viral **LLM Wiki** pattern (April 2026): plain interlinked markdown files that an agent like Claude Code ingests into, queries, and lints. Six method families now coexist — agent-maintained wikis, Obsidian+AI plugins/MCP, self-hosted RAG apps, knowledge-graph/GraphRAG systems, agent memory layers, and classic PKM/wiki methods with AI layered on — and they converge on two substrates: **plain local markdown** as the storage format and **MCP** as the connector. The practical starting point for most people today is an Obsidian vault plus Claude Code (or another agent CLI) with a schema file, escalating to GraphRAG/memory infrastructure only if you need multi-hop retrieval or programmatic agent memory.

## Background

"Second brain" entered the mainstream through Tiago Forte's book *Building a Second Brain* and his CODE workflow (Capture, Organize, Distill, Express) with the PARA filing scheme (Projects, Areas, Resources, Archives) ([buildingasecondbrain.com](https://www.buildingasecondbrain.com/)). The older intellectual lineage is Niklas Luhmann's Zettelkasten — atomic, densely linked notes ([zettelkasten.de](https://zettelkasten.de/posts/building-a-second-brain-and-zettelkasten/)) — and, further back, Vannevar Bush's 1945 Memex concept of a personal store of documents joined by associative trails, which Karpathy explicitly cites as the ancestor of the LLM wiki ([Karpathy's gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)).

The pre-LLM tooling era (roughly 2016–2022) produced the current substrate: Obsidian, Logseq, Roam, TiddlyWiki, Dendron, Foam — local-first, markdown- or block-based, bidirectionally linked. The perennial failure mode was maintenance: humans abandon wikis because updating cross-references, keeping summaries current, and resolving contradictions scales worse than the value it produces ([Karpathy's gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f); [Techstrong.ai](https://techstrong.ai/features/karpathys-instructions-for-building-an-ai-driven-second-brain/)).

LLMs changed the economics twice. First (2023–2024) via retrieval: RAG apps like Khoj and AnythingLLM let you chat with your documents. Second (2025–2026) via agency: coding agents (Claude Code and peers) that can read, write, and reorganize whole folders of files turned the maintenance burden itself into something an AI does. That second shift is what "second brain" mostly means in 2026 discourse.

## Key Findings

1. **The LLM Wiki is the defining pattern of 2026.** On April 3, 2026, Karpathy published a gist describing a knowledge base of interlinked markdown files that an LLM agent builds and maintains: three layers (immutable **raw sources**, the agent-written **wiki**, and a **schema** file — e.g. CLAUDE.md — encoding conventions), three operations (**ingest**, **query**, **lint**), plus an `index.md` catalog and an append-only `log.md`. It went viral (reported ~16M views on X) and one of his topics reportedly grew to ~100 articles / ~400k words without him writing any of it directly ([gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f); [Codersera](https://codersera.com/blog/karpathy-llm-knowledge-base-second-brain/); [Professor Glitch](https://www.askglitch.com/blog/build-a-second-brain)). An ecosystem of templates and tools formed within weeks (see [llm-wiki/](llm-wiki/resources.md)).

2. **Compilation vs. retrieval is the central architectural divide.** Traditional RAG re-derives answers from raw documents on every query; the wiki/graph approaches pre-compile knowledge once into a persistent artifact that compounds — prior reasoning becomes addressable knowledge ([Kloia](https://www.kloia.com/blog/knowledge-base-vs-knowledge-graph-llm); [ivgraph](https://ivgraph.com/journal/second-brain-llm-notion-claude-code/)). Production systems increasingly hybridize: vector retrieval + graph traversal + structured lookup, routed per query ([Branzan, Medium](https://medium.com/@claudiubranzan/from-llms-to-knowledge-graphs-building-production-ready-graph-systems-in-2025-2b4aff1ec99a)).

3. **Obsidian became the de facto front end for AI second brains.** The 2026-consensus stack is Smart Connections (local embeddings, passive related-notes) + Copilot for Obsidian (chat with vault), both pointable at a local Ollama endpoint so notes never leave the machine — covering ~80% of second-brain use cases ([PromptQuorum](https://www.promptquorum.com/power-local-llm/local-llm-with-obsidian-2026); [Local AI Master](https://localaimaster.com/blog/local-ai-obsidian-integration)). Three distinct Claude-integration paths exist (Desktop+MCP, Claude Code CLI on the vault folder, or in-app plugin) with different capability/risk profiles ([innobu](https://www.innobu.com/en/articles/obsidian-claude-second-brain-knowledge-management.html)).

4. **Self-hosted RAG apps are mature but consolidating.** Verified 2026-07-18: AnythingLLM ~63.5k stars, MIT, desktop+Docker, 25+ LLM providers, MCP support ([repo](https://github.com/Mintplex-Labs/anything-llm)); Khoj ~35.8k stars, AGPL, self-hostable "AI second brain" with Obsidian/Emacs/WhatsApp clients ([repo](https://github.com/khoj-ai/khoj)). But **Reor — the flagship "AI note-taking app" of 2024 — was archived March 7, 2026** ([repo](https://github.com/reorproject/reor)): purpose-built AI note apps are losing to general agents operating on plain files.

5. **Knowledge-graph RAG went from research to commodity.** Microsoft GraphRAG remains the reference architecture ([microsoft/graphrag](https://github.com/microsoft/graphrag)); LightRAG (HKU, EMNLP 2025; ~37.8k stars, MIT, verified 2026-07-18) delivers comparable quality with roughly 10x less token cost via dual-level retrieval and ships a server + web UI ([repo](https://github.com/HKUDS/LightRAG)); LazyGraphRAG cut indexing costs 10–90% ([Branzan](https://medium.com/@claudiubranzan/from-llms-to-knowledge-graphs-building-production-ready-graph-systems-in-2025-2b4aff1ec99a)). Temporal knowledge graphs (Zep's Graphiti, [arXiv:2501.13956](https://arxiv.org/abs/2501.13956)) add time-validity to facts — old facts are invalidated, not deleted ([getzep/graphiti](https://github.com/getzep/graphiti)).

6. **Agent memory layers are the fastest-growing adjacent category.** Mem0 (~61.1k stars, Apache-2.0, verified 2026-07-18) posted big April 2026 benchmark gains (LoCoMo 92.5) with a new ADD-only extraction algorithm ([repo](https://github.com/mem0ai/mem0)); Letta (ex-MemGPT) is a full agent runtime with tiered memory; Basic Memory bridges the categories — an MCP server whose "memory" is human-readable markdown in your Obsidian vault ([basicmachines-co/basic-memory](https://github.com/basicmachines-co/basic-memory)).

7. **MCP is the connective tissue.** Obsidian's Local REST API plugin now ships a built-in MCP server; multiple community MCP servers (MarkusPfundstein/mcp-obsidian and others) expose vault read/write/search to any MCP client ([obsidian-local-rest-api](https://github.com/coddingtonbear/obsidian-local-rest-api); [mcpservers.org](https://mcpservers.org/servers/MarkusPfundstein/mcp-obsidian)).

8. **The classic methodologies did not die — they became the ontology.** PARA/CODE and Zettelkasten are being re-used as the folder/linking schema the agent follows; Forte himself now sells an "AI Second Brain" program taught with Claude, Claude Cowork and Claude Code ([buildingasecondbrain.com/ai-second-brain](https://www.buildingasecondbrain.com/ai-second-brain)). Commentators note AI erases the cost of the "Organize" step Forte already called pure overhead ([self.md](https://self.md/articles/tiago-forte-second-brain-ai/)).

9. **Serious criticisms exist and are specific.** (a) *Model collapse in your own notes*: repeated LLM read-rewrite cycles smooth out detail and homogenize style ([WenHao Yu](https://yu-wenhao.com/en/blog/karpathy-zettelkasten-comparison/)); (b) *cognitive offloading*: outsourcing thinking, not just storage ([Howz Nguyen](https://howznguyen.dev/blog/second-brain-karpathy-applying-or-just-fomo); [arXiv:2604.04387](https://arxiv.org/pdf/2604.04387)); (c) *the human is still the operator* — Karpathy's own workflow is manual curation with AI assistance, not autopilot ([Tony Demol](https://medium.com/@tony.demol/karpathys-llm-wiki-with-a-single-brain-975df9c84be6)); (d) *verification burden* on agent-written content.

## Analysis

**What the facts add up to:** the durable winners are formats, not apps. Plain markdown + git + folder conventions survived every tooling generation and is now what the newest technique (LLM Wiki) is deliberately built on, precisely because agents read and write it natively. Reor's archival while Obsidian-plus-agent guides proliferate is the clearest signal: value migrated from the application layer to (1) the substrate (your files) and (2) the agent (interchangeable). Bet on the substrate.

**The methods are less rival than layered.** A realistic 2026 stack is: classic PKM method as ontology (PARA folders, Zettelkasten linking) -> Obsidian as human interface -> agent CLI + schema file as maintainer (LLM Wiki) -> optionally a graph/RAG index (LightRAG) for retrieval at scale -> optionally a memory layer (Basic Memory/Mem0) so assistants carry context across sessions. Each subdirectory here is one layer, not one silo.

**What's genuinely contested:** whether pre-compiling a wiki beats retrieval-on-demand. Wiki advocates argue compounding synthesis and readable artifacts; RAG advocates argue freshness and no rewrite-drift; graph advocates argue only explicit relations support multi-hop questions. The honest answer is workload-dependent — heavy synthesis over a stable corpus favors the wiki; large fast-changing corpora favor RAG; relationship-dense domains favor graphs. This is where the interesting engineering lives, and hybrid routing is the emerging production answer.

**What surprised us:** how fast the ecosystem formed around a single gist (templates, plugins, courses within ~3 months), and that the strongest skepticism comes from within the PKM community (Zettelkasten practitioners warning about homogenization and offloaded thinking), not from AI skeptics.

## Open Questions

- **Long-horizon quality:** no public longitudinal data yet on what an agent-maintained wiki looks like after 12+ months of rewrites (drift, bloat, contradiction accumulation). The pattern is only ~3.5 months old.
- **Cost at personal scale:** GraphRAG-style indexing costs are documented as "expensive, start small" ([Microsoft docs](https://microsoft.github.io/graphrag/get_started/)), but I couldn't find rigorous per-vault cost benchmarks for personal corpora.
- **Evaluation:** agent-memory benchmarks (LoCoMo, LongMemEval) are vendor-reported (Mem0's numbers are its own, though published with reproduction code); independent replication is thin.
- **Privacy line:** local models via Ollama handle chat/embeddings well, but the strongest agentic maintenance still leans on frontier hosted models — the fully-local LLM Wiki story is aspirational for large vaults.

## Sources

Primary and load-bearing sources (all accessed 2026-07-18; per-method files carry their own full lists):

- Karpathy, "LLM Wiki" gist (2026-04-03) — https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f
- khoj-ai/khoj (GitHub, verified) — https://github.com/khoj-ai/khoj
- Mintplex-Labs/anything-llm (GitHub, verified) — https://github.com/Mintplex-Labs/anything-llm
- HKUDS/LightRAG (GitHub, verified; EMNLP 2025) — https://github.com/HKUDS/LightRAG
- microsoft/graphrag + docs — https://github.com/microsoft/graphrag ; https://microsoft.github.io/graphrag/get_started/
- mem0ai/mem0 (GitHub, verified) — https://github.com/mem0ai/mem0
- getzep/graphiti + Zep paper (arXiv:2501.13956, Jan 2025) — https://github.com/getzep/graphiti ; https://arxiv.org/abs/2501.13956
- reorproject/reor (GitHub, verified archived 2026-03-07) — https://github.com/reorproject/reor
- basicmachines-co/basic-memory — https://github.com/basicmachines-co/basic-memory
- eugeniughelbur/obsidian-second-brain (GitHub, verified; v0.12 Jul 2026) — https://github.com/eugeniughelbur/obsidian-second-brain
- Forte Labs, "The AI Second Brain" — https://www.buildingasecondbrain.com/ai-second-brain
- PromptQuorum, "Obsidian + Local LLM: 5 Plugins" (2026) — https://www.promptquorum.com/power-local-llm/local-llm-with-obsidian-2026
- innobu, "Obsidian and Claude: Second Brain Setup 2026" — https://www.innobu.com/en/articles/obsidian-claude-second-brain-knowledge-management.html
- Kloia, "Knowledge Base vs Knowledge Graph for LLM Systems (2026)" — https://www.kloia.com/blog/knowledge-base-vs-knowledge-graph-llm
- Branzan, "From LLMs to Knowledge Graphs… in 2025" (Medium) — https://medium.com/@claudiubranzan/from-llms-to-knowledge-graphs-building-production-ready-graph-systems-in-2025-2b4aff1ec99a
- Critical views: Howz Nguyen — https://howznguyen.dev/blog/second-brain-karpathy-applying-or-just-fomo ; WenHao Yu — https://yu-wenhao.com/en/blog/karpathy-zettelkasten-comparison/ ; Tony Demol (Medium, May 2026) — https://medium.com/@tony.demol/karpathys-llm-wiki-with-a-single-brain-975df9c84be6 ; arXiv:2604.04387 — https://arxiv.org/pdf/2604.04387

---

## Appendix: choosing a method

| You are… | Start with | Directory |
|---|---|---|
| Comfortable in a terminal, want the current best practice | Obsidian vault + Claude Code + schema file (LLM Wiki) | [llm-wiki/](llm-wiki/README.md) |
| An Obsidian user who wants AI without changing workflow | Smart Connections + Copilot (+ Ollama for privacy) | [obsidian-ai/](obsidian-ai/README.md) |
| Wanting a turnkey private ChatGPT over your documents | AnythingLLM desktop, or Khoj if you want agents/automations | [rag-apps/](rag-apps/README.md) |
| Asking multi-hop, relationship-heavy questions of a corpus | LightRAG (cheap) or Microsoft GraphRAG (reference) | [knowledge-graphs/](knowledge-graphs/README.md) |
| Building agents that must remember users across sessions | Basic Memory (markdown-native) or Mem0 (infrastructure) | [memory-layers/](memory-layers/README.md) |
| Method-first, tool-agnostic, or fully offline | Zettelkasten/PARA in Logseq, Obsidian, or TiddlyWiki | [classic-pkm-wikis/](classic-pkm-wikis/README.md) |
| Zero-setup, happy with hosted tools | NotebookLM (research), Notion AI (workspace), Tana (structure) | [hosted-tools/](hosted-tools/README.md) |
