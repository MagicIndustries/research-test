# Getting Started: Choosing and Trialling a Second-Brain Method

*Companion to [overview.md](overview.md). Each trial path below is designed to give you a real signal within a weekend. Detailed instructions live in each method's subdirectory.*

## 1. Decision guide

Answer these five questions:

**Q1 — Do you already have a pile of notes/documents, or are you starting fresh?**
- Existing pile → RAG assistant ([rag-assistants/](rag-assistants/)) gives the fastest payoff; or point an LLM Wiki agent at the pile as raw sources.
- Starting fresh → methodology first ([methodologies/](methodologies/)), then pick a substrate.

**Q2 — Do you want to write the notes yourself, or curate while an AI writes?**
- Write yourself → Obsidian + AI plugins ([pkm-apps/](pkm-apps/)).
- Curate, AI writes → LLM Wiki ([llm-wiki/](llm-wiki/)) or agent memory ([agent-memory/](agent-memory/)).

**Q3 — How hard is your privacy requirement?**
- Absolute (nothing leaves the machine) → Obsidian + Smart Connections/Copilot pointed at Ollama; AnythingLLM desktop; Cognee/Graphiti with local models. Avoid NotebookLM, Notion AI, hosted Khoj.
- Pragmatic → everything is on the table; cloud LLMs make the agentic methods dramatically better.

**Q4 — Terminal comfort?**
- Comfortable → LLM Wiki (Claude Code), GraphRAG, Graphiti, Basic Memory.
- Not → NotebookLM, Obsidian plugins, AnythingLLM desktop, Reflect/Mem/Capacities.

**Q5 — What questions will you ask it?**
- "Where's that note / what did source X say" → vector RAG is enough.
- "How do these ideas connect / what's the whole-corpus picture" → knowledge graph or LLM Wiki.
- "What did I decide, and when did that change" → temporal graph (Graphiti) or LLM Wiki with log.md.

## 2. Recommended starting combinations (mid-2026)

| Profile | Stack |
|---|---|
| Developer, wants the current best-practice | **Obsidian vault + Claude Code running Karpathy's LLM Wiki schema**, published later with Quartz. See [llm-wiki/](llm-wiki/) |
| Non-technical knowledge worker | **NotebookLM** per research project + a durable notes app (Obsidian or Capacities). See [pkm-apps/](pkm-apps/) |
| Privacy-absolute researcher | **Obsidian + Smart Connections + Copilot → Ollama**, optionally AnythingLLM desktop for document piles. See [pkm-apps/](pkm-apps/), [rag-assistants/](rag-assistants/) |
| Self-hosting enthusiast | **Khoj** (docker) over your files + email/WhatsApp automations. See [rag-assistants/](rag-assistants/) |
| Builder of an AI product/agent | **mem0 or Graphiti + Cognee** as memory; **Basic Memory** if the store should double as human notes. See [agent-memory/](agent-memory/), [knowledge-graphs/](knowledge-graphs/) |
| Learn-in-public writer | Obsidian + **Quartz** on GitHub Pages. See [wikis-digital-gardens/](wikis-digital-gardens/) |

## 3. Weekend trial paths

**Trial A — LLM Wiki (recommended first trial if you use Claude Code).** Install Obsidian; make a vault with `raw/`, `wiki/`, `CLAUDE.md`; copy the schema ideas from [Karpathy's gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f); drop in 5–10 articles; run ingest; browse the result in Obsidian's graph view; run a lint pass. Success signal: the agent surfaces a cross-source connection you hadn't made. Full steps: [llm-wiki/README.md](llm-wiki/README.md).

**Trial B — RAG over your existing files.** Install [AnythingLLM desktop](https://anythingllm.com/) (no Docker needed), create one workspace, drag in a folder of PDFs/notes, ask ten real questions. If you want more power, graduate to [Khoj self-hosted](https://docs.khoj.dev). Full steps: [rag-assistants/README.md](rag-assistants/README.md).

**Trial C — Obsidian + AI plugins.** Install Obsidian, then Smart Connections and Copilot from community plugins; point them at OpenAI/Anthropic or a local Ollama model; write for a week and watch what Smart Connections surfaces. Full steps: [pkm-apps/README.md](pkm-apps/README.md).

**Trial D — Knowledge graph.** `pip install graphiti-core` with a free Neo4j instance, or run Cognee embedded (`uv pip install cognee`); ingest 20 notes; ask a multi-hop question that vector search would fail. Full steps: [knowledge-graphs/README.md](knowledge-graphs/README.md).

**Trial E — Persistent Claude memory.** Install [Basic Memory](https://github.com/basicmachines-co/basic-memory) as an MCP server for Claude Desktop/Code; converse for a few days; open `~/basic-memory/` as an Obsidian vault and inspect what accumulated. Full steps: [agent-memory/README.md](agent-memory/README.md).

**Trial F — Digital garden.** Fork [Quartz](https://github.com/jackyzha0/quartz), point it at a folder of notes, deploy to GitHub Pages. Full steps: [wikis-digital-gardens/README.md](wikis-digital-gardens/README.md).

## 4. Anti-patterns to avoid

- **Tool-hopping before methodology.** PARA/Zettelkasten habits transfer between tools; migrations without habits just move the mess ([brainfo methods comparison](https://brainfo.ai/blog/second-brain-methods-zettelkasten-para-code/)).
- **Write-only capture.** If nothing resurfaces, it's a junk drawer. Every method here exists to close the loop — pick one resurfacing mechanism (Smart Connections, lint pass, spaced repetition) and keep it.
- **Adopting archived tools.** Check pulse before committing — e.g. Reor was archived in March 2026 ([repo](https://github.com/reorproject/reor)).
- **Skipping the lint/review pass in agentic setups.** Karpathy: "The lint pass is not optional; it keeps the graph healthy" ([gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)).
- **Vector-only for relational questions.** If your questions are about connections, budget for a graph or a compiled wiki ([Kloia](https://www.kloia.com/blog/knowledge-base-vs-knowledge-graph-llm)).
