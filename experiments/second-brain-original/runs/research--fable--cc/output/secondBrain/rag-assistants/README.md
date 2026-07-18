# RAG Assistants: Chat With Your Documents as a Second Brain

*Method documentation. Resource list: [resources.md](resources.md). Researched 2026-07-18.*

## What it is

The RAG (retrieval-augmented generation) approach treats your existing files — notes, PDFs, exports, papers — as the second brain and adds an AI query layer on top. The pipeline: documents are **chunked**, each chunk is **embedded** into a vector index, and at query time the system **retrieves** the most semantically similar chunks and hands them to an LLM to **synthesize** an answer with citations back to your files.

This is the fastest route to a working "ask my second brain anything" system because it requires no reorganization of your existing material and no new writing habits. Its structural limitation is the mirror image: nothing compounds. Every answer is recomputed from scratch, retrieval by vector similarity misses relational/multi-hop questions, and quality is bounded by chunking decisions — the exact gaps that motivate the [knowledge-graph](../knowledge-graphs/) and [LLM Wiki](../llm-wiki/) methods.

## The main options

### Khoj — the most complete self-hosted AI second brain

[Khoj](https://github.com/khoj-ai/khoj) (AGPL-3.0, ~35.8k stars, YC-backed, docs at [docs.khoj.dev](https://docs.khoj.dev)) markets itself literally as "Your AI second brain." Verified from the repo (2026-07): indexes PDFs, Markdown, org-mode, Word, and Notion; works with local models (Llama 3, Qwen, Gemma, Mistral via Ollama) or cloud (GPT, Claude, Gemini, Deepseek); accessible from browser, Obsidian plugin, Emacs, desktop app, mobile, and WhatsApp; supports **custom agents** with their own knowledge/persona/tools, **scheduled automations** (newsletters, smart notifications), **deep research mode**, semantic search, and image generation/TTS. Self-host via Docker or pip, or use the hosted app at app.khoj.dev. Latest release 2.0.0-beta.28 (March 2026). Best fit: you want one self-hosted assistant over all your documents with automation, not just Q&A.

### AnythingLLM — easiest local document chat

[AnythingLLM](https://anythingllm.com/) (Mintplex Labs, MIT) organizes knowledge into **workspaces** — isolated knowledge bases ("Tax docs," "Research papers") with their own documents and conversations. The **desktop app** (macOS/Windows/Linux) is the easiest local RAG on the market: one-click install with a built-in LLM engine, CPU embedder, and bundled LanceDB — no Docker ([setup guide](https://localaimaster.com/blog/anythingllm-setup-guide); [DataCamp guide](https://www.datacamp.com/blog/anythingllm)). Also ships built-in agents (web search, SQL) and a multi-user Docker server mode. The 2026 comparison consensus: "AnythingLLM is a RAG-and-agents application with chat attached; Open WebUI is a chat application with RAG attached" ([Open WebUI's own comparison page](https://docs.openwebui.com/alternatives/anythingllm/)). Best fit: document chat is the primary use case; you want zero-friction local setup.

### Open WebUI — chat-first with knowledge bases

[Open WebUI](https://github.com/open-webui/open-webui) is the leading self-hosted chat UI (pairs naturally with Ollama); its **Knowledge** feature attaches document collections — with nested directories for larger sets — to chats and custom model presets ([Knowledge docs](https://docs.openwebui.com/features/workspace/knowledge/)). Strong for multi-user households/teams and pipeline extensions. Best fit: you live in a chat UI all day and want your knowledge attachable to it, rather than a dedicated knowledge tool.

### Quivr — the RAG framework (for builders)

[Quivr](https://github.com/QuivrHQ/quivr) (Apache-2.0, ~39k stars) began as a consumer "second brain" app and **pivoted to `quivr-core`**, an opinionated Python RAG framework: `pip install quivr-core`, then build a "brain" over your files in ~5 lines with `Brain.from_files()`; supports OpenAI/Anthropic/Mistral/Groq/Ollama, PGVector/Faiss, and Megaparse for ingestion ([docs](https://core.quivr.com/)). Release cadence has slowed (v0.0.33, Feb 2025). Best fit: you're coding your own second-brain application and want the RAG plumbing handled.

### Reor — cautionary tale (archived)

[Reor](https://github.com/reorproject/reor) (AGPL-3.0) was the promising "self-organizing" local AI note app — automatic note linking by vector similarity, local Q&A via Ollama + Transformers.js + LanceDB, Obsidian-like markdown editor. **The repo was archived on 2026-03-07 and is read-only.** Its architecture remains a good reference for how local-first AI notes work; don't build your workflow on it. (Its niche is now served by Obsidian + Smart Connections — see [pkm-apps/](../pkm-apps/).)

## Choosing within this method

| Need | Pick |
|---|---|
| One assistant over everything, self-hosted, with automations | Khoj |
| Fastest local, private document chat, no Docker | AnythingLLM desktop |
| Chat UI for the whole household/team + attachable knowledge | Open WebUI |
| Python library to build your own | quivr-core (or LlamaIndex/LangChain) |

## Trial instructions

**Quick trial (30 min, no server):** install AnythingLLM desktop → choose the built-in model or point at Ollama/an API key → create a workspace → drag in a folder of PDFs and notes → ask ten questions you actually care about, checking citations. This calibrates what query-time RAG can and can't do for your corpus.

**Full trial (weekend):** self-host Khoj with Docker following [docs.khoj.dev](https://docs.khoj.dev); connect your notes directory and Notion; install the Khoj Obsidian plugin; set up one scheduled automation (e.g., weekly digest of a topic); compare answer quality between a local model and a cloud model.

**Privacy note:** all four options can run fully local (Ollama/LM Studio backends); Khoj and AnythingLLM also offer hosted/cloud paths — read each project's telemetry settings if that matters to you ([local RAG overview](https://runaihome.com/blog/local-rag-private-document-ai-2026/)).
