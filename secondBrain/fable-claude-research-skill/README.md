# Building a Second Brain with LLMs — The 2026 Landscape

A research deep-dive into every current major approach to building a "second brain" — a personal, external, searchable extension of your memory and thinking — and how LLMs, knowledge graphs, and auto-generated wikis have transformed the practice. Compiled 2026-07-18; all GitHub stats verified via the GitHub API on that date, all links checked.

## Contents

| Directory | Method family |
|---|---|
| [llm-augmented-pkm/](./llm-augmented-pkm/overview.md) | Classic PKM (PARA/Zettelkasten) in Obsidian/Logseq + AI plugins |
| [llm-native-note-apps/](./llm-native-note-apps/overview.md) | Commercial AI-first apps: Notion AI, Tana, Mem, Reflect, Capacities, NotebookLM |
| [local-rag-assistants/](./local-rag-assistants/overview.md) | Self-hosted RAG over your files: Khoj, AnythingLLM, Open WebUI, PrivateGPT |
| [knowledge-graph-rag/](./knowledge-graph-rag/overview.md) | GraphRAG, LightRAG, temporal KGs (Graphiti), Neo4j builders |
| [llm-generated-wikis/](./llm-generated-wikis/overview.md) | The Karpathy "LLM wiki" pattern + DeepWiki — the agent writes the wiki |
| [agent-memory-systems/](./agent-memory-systems/overview.md) | Mem0, Zep/Graphiti, Letta/MemGPT, file-based agent memory |
| [capture-pipelines/](./capture-pipelines/overview.md) | Voice/Whisper pipelines, web clipping, AI auto-filing |

Each directory has an `overview.md` (how it works, architecture, trade-offs, first steps) and a `resources.md` (annotated repos/docs/articles/videos). `llm-generated-wikis/` adds a full [getting-started.md](./llm-generated-wikis/getting-started.md).

---

## The concept, in depth

**The idea.** A "second brain" is a trusted external system that captures, organizes, and resurfaces what you learn, so your biological brain can do thinking instead of storage. The term was popularized by Tiago Forte's *Building a Second Brain* (2022), built on his [PARA method](https://fortelabs.com/blog/para/) (organize by actionability: Projects, Areas, Resources, Archive) and CODE process (Capture, Organize, Distill, Express). Its intellectual ancestor is Niklas Luhmann's **Zettelkasten** — thousands of atomic, densely-linked index cards from which ideas emerged combinatorially ([zettelkasten.de](https://zettelkasten.de/introduction/)).

**The chronic failure mode.** Classic second brains die of *maintenance debt*: capture is easy, but filing, linking, distilling, and pruning are chores, so vaults rot into write-only landfills. Every pre-LLM methodology is, at bottom, a discipline for making a human do librarian work sustainably.

**What LLMs changed.** Three distinct revolutions, which map to the three big new families:

1. **Retrieval got smart** (→ RAG assistants). Semantic search and chat-with-your-notes means messy vaults become *queryable* — you can under-organize and still find things. But plain RAG retrieves fragments with no persistent understanding.
2. **The graph got buildable** (→ knowledge-graph RAG). LLMs can extract entities and relations automatically, so the densely-linked structure Zettelkasten built by hand over decades can be generated — including *temporal* graphs that model how facts change ([Graphiti](https://github.com/getzep/graphiti)).
3. **The librarian got automated** (→ LLM wikis & agent memory). The decisive move, crystallized in [Andrej Karpathy's llm-wiki gist (April 2026)](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f): stop making the human maintain the knowledge base at all. An agent ingests sources, writes and cross-links wiki pages, and lints for contradictions; "the tedious part … is not the reading or the thinking — it's the bookkeeping," and LLMs are tireless bookkeepers. Meanwhile Forte's own 2026 reframing points the same direction from the methodology side: the second brain's new job is [personal context management](https://www.buildingasecondbrain.com/ai-second-brain) — being the context store your AI reads.

A second-order effect worth internalizing: **your notes now have two audiences** — future-you and the LLM. Notes that leave context implicit retrieve badly and get misinterpreted by the model; good 2026 notes state their context explicitly ([Atlas PKM guide](https://www.atlasworkspace.ai/blog/personal-knowledge-management)).

**Where it's converging.** The families are hybridizing: LLM wikis are file-based agent memory at corpus scale; Zep's agent memory *is* a knowledge graph; Khoj bundles RAG + agents + automations; NotebookLM pairs with an Obsidian vault. The durable architecture emerging across all of them: **plain files you own** + **an agent that maintains them** + **retrieval infrastructure (vectors and/or graph)** + **frictionless capture in front**.

---

## The seven families, compared

| Family | You maintain | Privacy | Cost | Effort to start | Best at | Weakest at |
|---|---|---|---|---|---|---|
| [LLM-augmented PKM](./llm-augmented-pkm/overview.md) | Notes + filing (AI assists) | ★★★ local files | Free–$; API optional | Low | Ownership, longevity, community | Still needs your discipline |
| [LLM-native apps](./llm-native-note-apps/overview.md) | Little (app organizes) | ★ cloud SaaS | $10–12/mo typical | Minimal | Polish, mobile, zero setup | Lock-in, opacity, mortality |
| [Local RAG assistants](./local-rag-assistants/overview.md) | Infra, not notes | ★★★ self-hosted | Free + compute/API | Medium | Private chat over existing files | Fragmentary answers, no synthesis |
| [Knowledge-graph RAG](./knowledge-graph-rag/overview.md) | Pipelines | ★★★ self-hosted | Indexing tokens can be $$ | High | Multi-hop & corpus-level questions | No turnkey personal product |
| [LLM-generated wikis](./llm-generated-wikis/overview.md) | Curation only — agent writes | ★★★ local files | API tokens / CC subscription | Medium | Compounding readable knowledge, low upkeep | Young pattern; terminal comfort needed |
| [Agent memory](./agent-memory-systems/overview.md) | Nothing (agent extracts) | Varies (OSS ↔ SaaS) | Free–usage-based | Low (consumer) / High (framework) | AI that knows *you*; zero effort | Not a curated corpus; opaque (consumer) |
| [Capture pipelines](./capture-pipelines/overview.md) | Plumbing | ★★★ local possible | Mostly free | Low–Medium | Feeding all of the above | Useless without a processing step |

## Every concrete tool covered

Stars/activity per GitHub API, 2026-07-18. ⚠️ = stale/caveat.

| Tool | Family | Stars | License | Note |
|---|---|---|---|---|
| [Obsidian](https://obsidian.md) | PKM | — | closed core, local data | De-facto vault standard |
| [Copilot for Obsidian](https://github.com/logancyang/obsidian-copilot) | PKM | 7.4k | AGPL-3.0 | Best all-round vault AI |
| [Smart Connections](https://github.com/brianpetro/obsidian-smart-connections) | PKM | 5.3k | — | Passive related-notes, local embeddings |
| [Text Generator](https://github.com/nhaouari/obsidian-textgenerator-plugin) | PKM | 2.0k | MIT | Template generation |
| [Logseq](https://github.com/logseq/logseq) | PKM | 43.9k | AGPL-3.0 | OSS outliner; DB-rewrite era |
| [Notion / Notion AI](https://www.notion.com) | Apps | — | closed | Workspace + AI |
| [Tana](https://tana.inc) | Apps | — | closed | Supertags = personal KG |
| [Mem](https://mem.ai) | Apps | — | closed | Auto-organization bet |
| [Reflect](https://reflect.app) | Apps | — | closed | E2EE, $10/mo |
| [Capacities](https://capacities.io) | Apps | — | closed | Object-based notes |
| [NotebookLM](https://notebooklm.google) | Apps | — | closed | Source-grounded research sidecar |
| [Khoj](https://github.com/khoj-ai/khoj) | RAG | 35.8k | AGPL-3.0 | "Your AI second brain", agents+automations |
| [AnythingLLM](https://github.com/Mintplex-Labs/anything-llm) | RAG | 63.5k | MIT | Cleanest private docs-chat |
| [Open WebUI](https://github.com/open-webui/open-webui) | RAG | 145.8k | custom | Dominant self-hosted chat UI |
| [PrivateGPT](https://github.com/zylon-ai/private-gpt) | RAG | 57.3k | Apache-2.0 | Now an API layer |
| [Reor](https://github.com/reorproject/reor) | RAG | 8.6k | AGPL-3.0 | ⚠️ unmaintained since May 2025 |
| [LlamaIndex](https://github.com/run-llama/llama_index) | RAG (DIY) | 50.9k | MIT | Best DIY KB framework |
| [GraphRAG](https://github.com/microsoft/graphrag) | KG | 34.5k | MIT | Reference impl + LazyGraphRAG |
| [LightRAG](https://github.com/HKUDS/LightRAG) | KG | 37.8k | MIT | Cheap fast graph RAG (EMNLP'25) |
| [Graphiti](https://github.com/getzep/graphiti) | KG/Memory | 28.8k | Apache-2.0 | Temporal KG (Zep) |
| [Neo4j LLM Graph Builder](https://github.com/neo4j-labs/llm-graph-builder) | KG | 5.0k | Apache-2.0 | GUI docs→graph |
| [cognee](https://github.com/topoteretes/cognee) | KG/Memory | 28.0k | Apache-2.0 | Doc→KG memory pipelines |
| [nano-graphrag](https://github.com/gusye1234/nano-graphrag) | KG | 3.9k | MIT | Read-the-code learning impl |
| [fast-graphrag](https://github.com/circlemind-ai/fast-graphrag) | KG | 3.8k | MIT | ⚠️ quiet since Nov 2025 |
| [Karpathy llm-wiki gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) | Wiki | — | — | The canonical pattern doc |
| [second-brain template](https://github.com/NicholasSpisak/second-brain) | Wiki | 618 | — | Ready-made Karpathy-pattern vault |
| [qmd](https://github.com/tobi/qmd) | Wiki | 27.9k | MIT | CLI/MCP search for Markdown KBs |
| [DeepWiki](https://deepwiki.com) / [deepwiki-open](https://github.com/AsyncFuncAI/deepwiki-open) | Wiki | 17.3k (open) | MIT | Auto-wikis for repos |
| [Mem0](https://github.com/mem0ai/mem0) | Memory | 61.1k | Apache-2.0 | Most-adopted memory layer |
| [Letta (MemGPT)](https://github.com/letta-ai/letta) | Memory | 23.8k | Apache-2.0 | Self-managing agent memory |
| [Whisper](https://github.com/openai/whisper) / [WhisperX](https://github.com/m-bain/whisperX) / faster-whisper | Capture | 23.1k (X) | MIT/BSD | Local speech-to-text stack |
| [Karakeep](https://github.com/karakeep-app/karakeep) | Capture | 27.5k | AGPL-3.0 | AI-tagged self-hosted bookmarks |
| [OpenWhispr](https://openwhispr.com) / [Wispr Flow](https://wisprflow.ai) | Capture | — | OSS / closed | Dictation |

---

## Choosing where to start

- **"I want to own my notes for decades and I'm willing to garden them"** → [LLM-augmented PKM](./llm-augmented-pkm/overview.md): Obsidian + PARA + Smart Connections + Copilot.
- **"I want results this week and don't care about self-hosting"** → [LLM-native apps](./llm-native-note-apps/overview.md): pick by philosophy (Notion=workspace, Tana=structure, Mem=auto-filing, Reflect=privacy, NotebookLM=research).
- **"I already have a pile of Markdown/PDFs; let me chat with it privately"** → [Local RAG](./local-rag-assistants/overview.md): AnythingLLM (easy) or Khoj (featured).
- **"My questions are analytical/multi-hop across a rich corpus"** → [KG-RAG](./knowledge-graph-rag/overview.md): LightRAG first, GraphRAG if corpus is small and dense.
- **"I use Claude Code; maintenance is what kills my systems"** → [LLM wiki](./llm-generated-wikis/overview.md): the Karpathy pattern (see [getting-started](./llm-generated-wikis/getting-started.md)).
- **"I'm building an assistant that should remember me"** → [Agent memory](./agent-memory-systems/overview.md): Mem0 (stable facts) or Graphiti (changing facts).
- **Whatever you pick** → add one [capture upgrade](./capture-pipelines/overview.md) first; input friction is the usual point of failure.

**This repo's context**: you already run Claude Code with skills (`understand-anything`, GitNexus) that build knowledge graphs and LLM wikis — the LLM-wiki pattern composes directly with tooling you have today.
