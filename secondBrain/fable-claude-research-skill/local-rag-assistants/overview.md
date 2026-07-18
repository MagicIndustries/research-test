# Local / Open-Source RAG Personal Knowledge Assistants

Self-hosted apps that index your documents (Markdown, PDFs, org files, repos) into embeddings and let you chat with them — retrieval-augmented generation (RAG) over a *personal* corpus, with local or API models. Own the pipeline, keep the data.

## How RAG works here (30 seconds)

Your files are split into chunks → embedded into vectors → stored in a vector DB. A question is embedded, similar chunks are retrieved, and an LLM answers *grounded in those chunks*, ideally with citations. Quality hinges on chunking, embedding model, and retrieval strategy — which is why dedicated tools beat note-app plugins at scale.

## The main tools (all verified active July 2026 except where noted)

- **[Khoj](https://github.com/khoj-ai/khoj)** (35.8k★, AGPL-3.0, YC W24) — positions itself literally as "Your AI second brain." Self-hostable; indexes Markdown/PDF/org-mode/Notion/GitHub; chat via web, Obsidian plugin, Emacs, even WhatsApp; custom agents, scheduled automations, deep research mode; works with any online or local LLM. The most second-brain-shaped tool in this family. Free self-hosted; paid cloud at [khoj.dev](https://khoj.dev).
- **[AnythingLLM](https://github.com/Mintplex-Labs/anything-llm)** (63.5k★, MIT) — polished desktop app + server; drag-in documents, per-workspace RAG, agents, MCP support. Cleanest UX for private document chat; pair with Ollama/LM Studio for fully-local ([RAG guide](https://www.nullzen.dev/blog/anythingllm-rag-guide/)).
- **[Open WebUI](https://github.com/open-webui/open-webui)** (145.8k★) — the dominant self-hosted LLM chat UI; has built-in RAG ("knowledge" collections + `#` references). Best if you want one interface for all local-LLM use with your notes as one feature. License note: no longer plain BSD — it has a branding-protection clause; review it for commercial deployment.
- **[PrivateGPT](https://github.com/zylon-ai/private-gpt)** (57.3k★, Apache-2.0) — began as the canonical "chat with your docs 100% offline" project; now evolved into Zylon's complete private-AI API layer (RAG, tools, MCP). Better as a building block/API than a personal app today.
- **[Reor](https://github.com/reorproject/reor)** (8.6k★, AGPL-3.0) — ⚠️ **stale: last push May 2025.** A lovely idea (local Markdown editor with automatic note-linking + local RAG chat) and fine to try, but don't build your workflow on an unmaintained app.

## DIY with frameworks

If you'd rather own the code: [LlamaIndex](https://github.com/run-llama/llama_index) (50.9k★, MIT) is purpose-built for document indexing/retrieval and stays the cleanest path to a custom personal-KB pipeline; [LangChain](https://github.com/langchain-ai/langchain) (142k★, MIT) if you want the broader agent ecosystem. A weekend project: watch a notes folder → chunk/embed into a local vector store (Chroma, LanceDB, pgvector) → expose a chat CLI or an MCP server your existing AI tools can call.

## Trade-offs

**Strengths**
- Privacy and ownership: data, embeddings, and (optionally) models all on your hardware; open licenses.
- Works over the notes you *already have* — no migration, no new habit; Khoj/AnythingLLM read your existing vault in place.
- Composable: MCP servers, APIs, agents.

**Weaknesses**
- Setup and upkeep: Docker/Python, embedding re-indexing, GPU-or-patience for local models; quality tuning is on you.
- Plain RAG retrieves *fragments* — it has no persistent understanding, struggles with multi-hop and "what does my whole corpus say about X" questions (that's what [knowledge-graph RAG](../knowledge-graph-rag/overview.md) and [LLM wikis](../llm-generated-wikis/overview.md) fix).
- Local model quality: fully-offline answers are noticeably weaker than frontier-API answers; most people run hybrid (local data, API model).

## Who it's for

Technical users with an existing pile of Markdown/PDFs who want private chat-over-notes *now*, without changing how they take notes. The gentlest entry: AnythingLLM desktop. The most second-brain-featured: Khoj.

## Getting started (concrete)

1. **Fast path**: install [AnythingLLM Desktop](https://anythingllm.com/download), point it at Ollama (or an API key), drag your notes folder into a workspace, ask questions.
2. **Khoj path**: `pip install khoj` or Docker per the [self-host docs](https://docs.khoj.dev/get-started/setup/); connect your vault directory; install the Obsidian plugin if you live there; try an automation ("every Monday summarize what I added last week").
3. Evaluate honestly with 10 real questions whose answers you know are in your notes; check citation quality, not vibes.
