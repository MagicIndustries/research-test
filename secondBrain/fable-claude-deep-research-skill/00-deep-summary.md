# Building a Second Brain with LLMs, Knowledge Graphs, and Wikis — Deep Research Report

> Compiled 2026-07-18. Sources dated 2024–2026; anything older flagged. Every claim is sourced; conflicting views are noted rather than resolved silently.

## TL;DR

The second-brain field has shifted from *human-maintained notes queried by AI* (RAG over your vault) to *AI-maintained knowledge bases curated by humans* — crystallized by Andrej Karpathy's "LLM Wiki" pattern (early 2026), which the whole ecosystem rapidly adopted. Underneath that headline, six other viable approaches coexist: classic methodologies (PARA/Zettelkasten) as the organizational substrate, packaged RAG assistants (Khoj, AnythingLLM, Open Notebook), graph-based retrieval (GraphRAG/LightRAG), agent memory infrastructure (mem0, Zep/Graphiti, Letta), in-editor AI plugins (Smart Connections, Copilot for Obsidian), and public digital gardens (Quartz). The winning setups in practice **combine** them: plain-markdown vault (Obsidian) + agentic maintainer (Claude Code) + optional semantic search + optional publishing.

---

## 1. Background: what "second brain" means and how it got here

**The term.** "Second brain" was popularized by Tiago Forte's *Building a Second Brain* (BASB): an external, digital system that stores and organizes what you learn so your biological brain can focus on thinking, not remembering. Forte's method rests on **CODE** (Capture → Organize → Distill → Express) and **PARA** (Projects / Areas / Resources / Archives). Forte now runs an explicit "[AI Second Brain](https://www.buildingasecondbrain.com/ai-second-brain)" track, acknowledging the field's shift.

**The lineage before AI:**
- **Zettelkasten** (Luhmann): atomic, densely linked notes designed to generate insight through connection.
- **Digital gardens / personal wikis**: publicly tended, non-chronological note collections (Maggie Appleton's [digital-gardeners](https://github.com/MaggieAppleton/digital-gardeners) repo is the canonical resource hub).
- **Tools-for-thought wave (2020–2023)**: Roam, Obsidian, Logseq — backlinks, graph views, local-first markdown.

**The AI inflection (2023–2026), in three phases:**
1. **Phase 1 — RAG over notes (2023–2024):** embed your vault, retrieve chunks, chat with them. Tools: Khoj, AnythingLLM, Obsidian Copilot, NotebookLM.
2. **Phase 2 — Graph-augmented retrieval (2024–2025):** Microsoft GraphRAG showed that extracting an entity/relation graph plus community summaries answers "global" questions flat RAG can't. LightRAG (EMNLP 2025) made it cheap and incremental.
3. **Phase 3 — LLM-maintained knowledge (2025–2026):** agentic CLIs (Claude Code, Codex CLI) can read and write local files reliably, so the LLM stops being just a query engine and becomes the **librarian**. Karpathy's [llm-wiki gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) named and specified this pattern; dozens of implementations, guides, and videos followed within weeks.

A parallel track — **agent memory** (mem0, Zep, Letta) — approaches the same problem from the software-engineering side: not "how do I organize my notes" but "how does my AI assistant remember things about me across sessions."

---

## 2. The variations, in depth

### 2.1 Methodology layer: PARA, Zettelkasten, CODE (see `01-methodology/`)

Still the substrate everything else sits on. Current consensus ([Saner.ai guide](https://www.saner.ai/blogs/note-taking-methods), [Brainfo comparison](https://brainfo.ai/blog/zettelkasten-para-and-beyond/), [LocArk](https://locark.com/zettelkasten-para-method-offline-2025/)):
- **PARA** organizes by *actionability* (what project does this serve?); **Zettelkasten** organizes by *connection* (what idea does this relate to?). They answer different questions and are commonly **combined**: PARA for the folder skeleton, Zettelkasten for the note-linking style within it.
- **What AI changes:** the expensive parts of both methods — filing, tagging, linking, distilling — are exactly what LLMs automate well. The methods survive as *schemas you teach the LLM* rather than disciplines you perform manually. This is the through-line to the LLM Wiki pattern: the human's job collapses to schema design and source curation.

### 2.2 The LLM Wiki pattern — the current headline technique (see `02-llm-wiki/`)

Karpathy's gist ([primary source](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)) defines a **three-layer architecture**:

1. **`raw/`** — immutable source material (articles, PDFs, transcripts). The LLM reads but never modifies it.
2. **`wiki/`** — interlinked markdown pages (entity pages, concept pages, syntheses) that the LLM owns entirely: it creates pages, updates cross-references, resolves contradictions. A single ingested source may touch 10–15 pages.
3. **The schema file** (`CLAUDE.md` or equivalent) — the human-authored spec governing page types, naming, structure, and workflows. Karpathy: "the schema file is everything"; it co-evolves with use.

**Three operations:** `ingest` (process new sources into the wiki), `query` (read relevant pages, answer with citations, optionally file the answer back as a page), `lint` (health-check for contradictions, stale claims, orphan pages — "drift is the failure mode"). Two special files: `index.md` (catalog, read first on every query) and `log.md` (append-only operation log).

**Why it beats RAG for personal scale:** RAG re-retrieves and re-synthesizes raw chunks on every query; the wiki *compiles once* — cross-references and contradictions are resolved at ingest time, so queries run over clean, dense, pre-synthesized pages. For a personal corpus (hundreds of sources, not millions), analyses like [decodethefuture's pattern-vs-RAG piece](https://decodethefuture.org/en/llm-wiki-karpathy-pattern/) conclude the wiki approach nearly always wins. **Known ceiling:** ~50–100k tokens (~150–200 dense pages) before you need selective page loading or a search layer (Karpathy suggests `qmd`, a hybrid BM25/vector search tool).

**The practical stack that emerged:** Obsidian as the human-facing browser ("the IDE for the wiki"), Claude Code (or Codex CLI, Cursor — the pattern is agent-agnostic, pure markdown) as the maintainer, git for versioning, optionally MCP to wire Claude Desktop to the vault. Guides: [MindStudio](https://www.mindstudio.ai/blog/build-ai-second-brain-claude-code-obsidian), [The Tool Nerd step-by-step](https://www.thetoolnerd.com/p/step-by-step-guide-build-your-own-second-brain-obsidian-kaparthy), [Professor Glitch](https://www.askglitch.com/blog/build-a-second-brain). Reported setup time: ~1 hour basic, a few sessions to dial in.

### 2.3 Packaged RAG assistants (see `03-rag-assistants/`)

For people who want a product, not a pattern:
- **[Khoj](https://github.com/khoj-ai/khoj)** — self-hostable "AI second brain": chats over your docs (md, org, PDF, Notion, Word) and the web, custom agents, scheduled automations, deep research mode; works with any online or local LLM. The most feature-complete open option.
- **[AnythingLLM](https://github.com/mintplex-labs/anything-llm)** (MIT, Mintplex Labs) — desktop or Docker; workspace-based document chat, local-by-default, multi-user in Docker mode, agent capabilities.
- **[Reor](https://github.com/reorproject/reor)** — local-first AI note app: Obsidian-like markdown editor with automatic semantic linking, Q&A, and offline Ollama models. Closest to "Obsidian with AI built in."
- **[Open Notebook](https://github.com/lfnovo/open-notebook)** — self-hosted NotebookLM clone (Docker), 18+ providers, podcast generation. XDA's tests ([1](https://www.xda-developers.com/replaced-notebooklm-with-open-notebook/), [2](https://www.xda-developers.com/tried-open-source-notebooklm-alternatives-only-one-is-the-real-deal/)) rate **SurfSense** the closest true NotebookLM replacement (100+ LLMs, 27+ connectors — Drive, Notion, Slack, GitHub, YouTube) and Open Notebook the privacy-purist pick.

**Trade-off vs the LLM Wiki:** instant setup and polished UX, but the knowledge stays *unrefined* — these tools retrieve over raw documents; nothing compounds. Several users run both: a packaged assistant for convenience, a wiki for durable synthesis.

### 2.4 Knowledge graphs and GraphRAG (see `04-knowledge-graphs/`)

Structured-graph approaches extract **entities and relations** from your content into an actual graph database, enabling multi-hop, relational, and "global" questions:
- **[Microsoft GraphRAG](https://github.com/microsoft/graphrag)** — the reference implementation: entity extraction → Leiden community detection → hierarchical community summaries. Powerful for global questions; **expensive and slow to index** (LLM calls per chunk).
- **[LightRAG](https://github.com/hkuds/lightrag)** (EMNLP 2025) — dual-layer graph+vector, ~30% lower query latency, ~50% cheaper incremental updates; the pragmatic default for personal use.
- **[nano-graphrag](https://github.com/gusye1234/nano-graphrag)** — small, readable, hackable GraphRAG for learning the internals.
- **[Neo4j LLM Knowledge Graph Builder](https://github.com/neo4j-labs/llm-graph-builder)** — no-code web app + [free GraphAcademy course](https://graphacademy.neo4j.com/courses/llm-knowledge-graph-construction/); turns PDFs/URLs/YouTube into a Neo4j graph you can query in Cypher.
- **Personal second-brain graph projects:** [knowledge-nexus](https://github.com/Jallermax/knowledge-nexus) (GraphRAG for second brain, Notion/Pocket ingestion, Neo4j), [second-brain-hybrid-graph](https://github.com/M0nkeyFl0wer/second-brain-hybrid-graph) (local-first vector→graph traversal, DuckDB + Ollama), [raold/second-brain](https://github.com/raold/second-brain) (100% local multimodal, pgvector + LLaVA/CLIP).

**Honest assessment:** highest capability for relational questions, highest complexity and indexing cost. For most personal corpora, the LLM Wiki achieves similar "pre-synthesized knowledge" benefits with markdown instead of a graph DB. Graph approaches earn their keep when the corpus is large, entity-heavy, and relationship-dense (research literature, org intelligence, CRM-like data).

### 2.5 Agent memory layers (see `05-agent-memory/`)

Memory as *infrastructure* — for when you're building an assistant rather than organizing notes:
- **[mem0](https://github.com/mem0ai/mem0)** (~47k stars): hybrid vector+graph+KV store with automatic fact extraction; easiest managed path; best for personalization.
- **[Zep](https://www.getzep.com/) / [Graphiti](https://github.com/getzep/graphiti)** (~28k stars, Apache 2.0): *temporally-aware* knowledge graph — facts carry validity intervals, so "used to live in London, now Tokyo" resolves correctly. Benchmarks (from Zep's paper — vendor-reported, treat accordingly): 94.8% on Deep Memory Retrieval; on LongMemEval, third-party comparisons put Graphiti at 63.8% vs mem0's 49.0% with GPT-4o.
- **[Letta](https://github.com/letta-ai/letta)** (MemGPT lineage): full agent runtime with OS-style memory management (context = RAM, archival = disk; the agent self-manages).
- **[Cognee](https://github.com/topoteretes/cognee)**: pipelines that "cognify" data into a queryable graph+vector memory.
- **MCP memory servers** — the bridge back to personal knowledge: **[Basic Memory](https://github.com/basicmachines-co/basic-memory)** stores AI-conversation knowledge as local markdown files (Obsidian-compatible!) with entities/observations/relations and semantic search; the official [MCP memory server](https://mcpservers.org/servers/modelcontextprotocol/memory) and [mcp-knowledge-graph](https://github.com/shaneholloman/mcp-knowledge-graph) offer simpler local knowledge graphs. Pricing for managed tiers: mem0 from ~$19/mo, Letta Pro ~$20/mo, Zep Flex ~$104/mo ([Developers Digest comparison](https://www.developersdigest.tech/blog/best-ai-agent-memory-providers-2026)).

### 2.6 Obsidian AI plugins (see `06-obsidian-plugins/`)

The lowest-effort entry point if you already keep notes in Obsidian:
- **[Smart Connections](https://github.com/brianpetro/obsidian-smart-connections)** — ambient semantic linking; local embeddings, zero setup, no API key.
- **Copilot for Obsidian** — chat-with-vault + inline generation; cloud or local models.
- Supporting cast: Text Generator, Local GPT, BMO Chatbot, the Khoj plugin.
- 2026 consensus ([comparison](https://codeculture.store/blogs/developer-culture/obsidian-ai-plugin-comparison-2025), [PromptQuorum local-LLM guide](https://www.promptquorum.com/power-local-llm/local-llm-with-obsidian-2026)): **Smart Connections + Copilot, both pointed at local Ollama** (nomic-embed-text embeddings) covers ~80% of second-brain use cases fully privately.

### 2.7 Publishing: wikis and digital gardens (see `07-publishing-wikis/`)

Making the second brain (or part of it) public:
- **[Quartz](https://quartz.jzhao.xyz/)** — the de-facto standard for publishing an Obsidian vault as a free static site with search, graph view, backlinks (deployable via GitHub Actions — see [example repo](https://github.com/kevin7lou/wiki)).
- **Obsidian Publish** — paid, zero-effort official option.
- **TiddlyWiki** — single-file wiki, still alive for card-style knowledge bases.
- **Logseq** — caution flag: its database rewrite has been in beta with long delays through 2025–2026 ([status thread](https://discuss.logseq.com/t/why-the-database-version-and-how-its-going/26744), [migration analysis](https://medium.com/@theo-james/logseq-development-delays-are-users-migrating-to-affine-or-obsidian-e22bb42b8741)); Obsidian is the stable choice right now.

---

## 3. Key findings

1. **The role reversal is the story of 2026.** Every major guide published since Karpathy's gist frames the second brain as *LLM-maintained, human-curated* — the human writes the schema and picks sources; the agent does filing, linking, synthesis, and maintenance. (Sources: Karpathy gist; MindStudio; AI Maker; Techstrong.)
2. **Plain markdown won the storage war.** Every credible 2026 approach — LLM wiki, Basic Memory, Reor, Quartz, Obsidian plugins — stores knowledge as local markdown files. This makes approaches *composable*: one vault can simultaneously be an Obsidian workspace, an LLM wiki, an MCP memory target, and a published Quartz site. Lock-in is effectively dead at the storage layer.
3. **Compile-time vs query-time synthesis is the real architectural divide.** RAG assistants synthesize at query time (cheap start, nothing compounds); LLM wikis and GraphRAG synthesize at ingest time (more upfront cost, knowledge compounds). GraphRAG and the LLM wiki are structurally the same idea — pre-computed synthesis — differing in representation (graph DB vs markdown pages).
4. **Agent memory and PKM are converging.** Basic Memory writes agent memory as Obsidian-compatible markdown; Graphiti/Zep's temporal knowledge graph is what a Zettelkasten becomes when automated; the LLM-wiki `log.md` is episodic memory. Expect these tracks to merge.
5. **Benchmarks favor temporal knowledge graphs for memory** (Graphiti 63.8% vs mem0 49.0% on LongMemEval) — but note Zep's headline numbers come from Zep's own paper; third-party numbers are thinner.
6. **Old methodology still matters.** PARA/Zettelkasten didn't die; they became the schema vocabulary you hand the LLM. Guides that skip the methodology layer produce wikis that drift — "drift is the failure mode" (Karpathy).
7. **Scale ceilings are real and documented.** Single-context LLM wikis top out around 150–200 dense pages; beyond that you add selective loading or search (qmd, Smart Connections, LightRAG). Plan for this from day one by keeping a good `index.md`.

## 4. Analysis (my take)

- **For you specifically** — already running Claude Code, comfortable with CLI agents, with an existing Obsidian-vault skill and an Obsidian vault in play — the **LLM Wiki pattern is the clear first trial**. It's ~1 hour to stand up, uses tools you already have, and its artifacts remain useful under every other approach if you later change course.
- **Don't start with a graph database.** GraphRAG-class systems are the most impressive tech in this space and the least likely to survive contact with a personal workflow — indexing cost, infra maintenance, and schema rigidity all bite. Get there only if/when markdown + search fails you.
- **The packaged tools are trial-worthy but not destination-worthy** for a technical user: Khoj is the best of them (agents + automations + self-host), and Open Notebook is worth running for the podcast/audio-overview trick, but neither compounds knowledge the way an agent-maintained wiki does.
- **What surprised me:** how completely the ecosystem standardized within weeks of one gist — and that the gist's core insight is organizational, not technical ("the human's job is to curate sources, direct the analysis, and ask good questions; the LLM's job is everything else"). The scarce skill is schema design.
- **What's missing from the data:** longitudinal evidence. Almost everything here is <6 months old; there are no studies of what an LLM-maintained wiki looks like after a year of drift, model changes, and schema evolution. Treat `lint` discipline and git history as your insurance.

## 5. Open questions

- **Long-term drift:** does an LLM wiki stay coherent after 12+ months and thousands of pages? No data yet.
- **Cost at scale:** ingest touching 10–15 pages per source is token-hungry; nobody has published careful cost curves.
- **Multi-agent contention:** what happens when multiple agents (or scheduled automations) write to the same wiki concurrently? Team-scale implementations use PR review gates, but personal-scale patterns are immature.
- **Benchmark independence:** memory-layer comparisons lean heavily on vendor papers; independent LongMemEval-style testing across mem0/Zep/Letta/Cognee is thin.
- **Logseq's future:** unresolved; its DB beta could still make it the best open second-brain app or finish its decline.

## 6. Sources

Consolidated in each subdirectory's `resources.md`. Primary anchors:
- Karpathy, [llm-wiki gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) (2026) — the pattern spec
- [Building a Second Brain — AI track](https://www.buildingasecondbrain.com/ai-second-brain) (Forte)
- [decodingml/second-brain-ai-assistant-course](https://github.com/decodingml/second-brain-ai-assistant-course) — free 6-module build-it-yourself course (LLMs, RAG, fine-tuning, LLMOps)
- [Graphlit survey of AI agent memory frameworks](https://www.graphlit.com/blog/survey-of-ai-agent-memory-frameworks) (2026)
- [Awesome-GraphRAG](https://github.com/DEEP-PolyU/Awesome-GraphRAG) — curated papers/benchmarks/projects
- [MaggieAppleton/digital-gardeners](https://github.com/MaggieAppleton/digital-gardeners)
