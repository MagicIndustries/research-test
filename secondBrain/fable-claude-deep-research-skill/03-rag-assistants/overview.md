# RAG Assistants — "Chat With Your Notes" Products

> Researched 2026-07-18. All tools listed are actively maintained as of mid-2026.

## The approach

Index your documents (embeddings + keyword search), retrieve relevant chunks at question time, have an LLM synthesize an answer with citations. This is classic RAG packaged as a product: install an app, point it at your files, start chatting. No schema design, no agent workflow — the fastest path to an AI second brain, at the cost of nothing compounding (see the compile-time vs query-time distinction in `../00-deep-summary.md`).

## The main options

### Khoj — the feature-complete open second brain
[github.com/khoj-ai/khoj](https://github.com/khoj-ai/khoj) · [docs.khoj.dev](https://docs.khoj.dev/)

Self-hostable; chats over your docs (markdown, org-mode, PDF, Word, Notion) **and** the web; custom agents with personas; **scheduled automations** (e.g., weekly digest emails); deep-research mode; works with any online or local LLM (GPT, Claude, Gemini, Llama, Qwen, Mistral). Has an Obsidian plugin, Emacs package, WhatsApp bot, and a hosted free tier. The strongest pick if you want agents + automation without building anything.

### AnythingLLM — workspace-based document chat
[github.com/Mintplex-Labs/anything-llm](https://github.com/mintplex-labs/anything-llm) (MIT)

Desktop app (single-user, zero-config) or Docker (multi-user with roles). Documents organized into workspaces; local-by-default (model, docs, chats all stay on disk); supports every major LLM provider + Ollama/LM Studio; includes agent capabilities and a no-code agent builder. Reviewers note it's more a general "chat with documents" tool than a NotebookLM-style research notebook.

### Reor — the local-AI note editor
[github.com/reorproject/reor](https://github.com/reorproject/reor) (AGPL)

Desktop markdown editor in the Obsidian mold with AI built in: automatic semantic linking of related notes, Q&A over notes, semantic search — all fully offline via embedded Ollama. Best fit if you want *one app* that is both your editor and your AI, with hard privacy guarantees. Smaller project than the others; check recent commit activity before committing.

### Open Notebook — self-hosted NotebookLM
[github.com/lfnovo/open-notebook](https://github.com/lfnovo/open-notebook)

Docker-deployed NotebookLM clone: notebooks of sources, chat with citations, and the signature **podcast/audio-overview generation**. 18+ model providers including Ollama and LM Studio. XDA's reviews rate it the best privacy-purist option.

### SurfSense — the connector-heavy team option
[github.com/MODSetter/SurfSense](https://github.com/MODSetter/SurfSense)

Open-source NotebookLM alternative with broader scope: 100+ LLMs (OpenAI-spec/LiteLLM, vLLM, Ollama), 50+ file formats, **27+ connectors** (Google Drive, Notion, Slack, GitHub, YouTube…). XDA's three-way test called it "the real deal" — the closest true NotebookLM replacement.

### NotebookLM (Google) — the hosted benchmark
[notebooklm.google.com](https://notebooklm.google.com)

The polished hosted product the open tools chase: source-grounded chat, audio overviews, mind maps. Zero setup, but your sources live with Google and source counts are capped per notebook.

## Choosing

| Want | Pick |
|---|---|
| Agents + scheduled automations, self-hosted | **Khoj** |
| Simple desktop doc-chat, most mature ecosystem | **AnythingLLM** |
| Editor + AI in one, fully offline | **Reor** |
| NotebookLM features, private | **Open Notebook** (solo) / **SurfSense** (connectors/teams) |
| Zero effort, cloud OK | **NotebookLM** |

## Limits of the whole category

- Retrieval is over **raw documents** — no synthesis persists, contradictions aren't resolved, knowledge doesn't compound.
- Quality is bounded by chunking/retrieval; multi-hop and "global" questions are weak (that's what `../04-knowledge-graphs/` fixes).
- Common pattern: run one of these **alongside** an LLM wiki — the assistant for quick lookup, the wiki for durable knowledge.
