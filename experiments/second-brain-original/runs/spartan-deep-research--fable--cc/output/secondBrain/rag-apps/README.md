# Method: Self-Hosted RAG Second-Brain Apps

Turnkey applications that ingest your documents (markdown, PDF, org-mode, Word, Notion exports, web pages), embed them into a vector store, and give you a chat/search interface over them — retrieval-augmented generation (RAG) packaged as a product. You get a working "chat with my knowledge" system in minutes rather than building pipelines.

## How it works

1. **Ingest**: documents are chunked and embedded into a vector database (LanceDB, Qdrant, pgvector, …).
2. **Retrieve**: your question is embedded; the closest chunks are fetched (often hybrid: vector + keyword).
3. **Generate**: an LLM (hosted or local via Ollama) answers grounded in the retrieved chunks, usually with citations.

Contrast with the [LLM Wiki](../llm-wiki/README.md): RAG **re-derives** answers from raw documents each time — always fresh, nothing compounds. Contrast with [knowledge graphs](../knowledge-graphs/README.md): plain RAG struggles with multi-hop, relationship-heavy questions.

## The main options (verified 2026-07-18)

### AnythingLLM — best all-rounder
~63.5k stars, MIT ([repo](https://github.com/Mintplex-Labs/anything-llm)). "Private, fully-featured ChatGPT" — desktop apps (Mac/Win/Linux) and Docker for teams. Document chat with citations, AI agents with web browsing, no-code agent builder, scheduled tasks, MCP tool support, 25+ LLM providers (OpenAI, Anthropic, Gemini, Ollama, Groq, …), many vector DBs (LanceDB default). Reviewers score its RAG highest of the category and note the easiest install (~5 min signed installer, ~300 MB idle RAM) ([openhuman.guide comparison](https://www.openhuman.guide/anythingllm-alternatives)).

### Khoj — best "second brain" framing and reach
~35.8k stars, AGPL-3.0, verified: 2.0.0-beta.28 released 2026-03-26, active ([repo](https://github.com/khoj-ai/khoj)). Self-describes as "Your AI second brain." Distinguishing features: clients for **Obsidian, Emacs, browser, desktop, phone, WhatsApp**; custom agents with their own knowledge/persona/tools; scheduled automations; deep research mode; answers from web + your docs (pdf, markdown, org-mode, images, Word, Notion). Self-host via Docker Compose or use their cloud ([app.khoj.dev](https://app.khoj.dev)).

### Quivr — best brain-shaped organization, heavier ops
Open-source "second brain" platform organized into "brains," Supabase backend. Reviewers rate its knowledge organization (tags, graphs, persistence) above workspace-style tools but note the heaviest setup of the group (Docker + Supabase, ~20 min, ~500 MB RAM) ([openhuman.guide](https://www.openhuman.guide/anythingllm-alternatives)). https://github.com/QuivrHQ/quivr

### Reor — cautionary tale (archived)
The 2024 breakout "private & local AI PKM app" (auto-linking, semantic search, local Q&A over an Obsidian-like editor; Ollama + Transformers.js + LanceDB). **Archived and read-only as of 2026-03-07**; last release Apr 2025; 8.6k stars ([repo](https://github.com/reorproject/reor)). Lesson: single-purpose AI note apps struggled once general agents + plain vaults could do the same job. Prefer tools whose data you can walk away with (Reor's markdown is at least portable).

### Also notable
- **Open Notebook / open-source NotebookLM clones** — for the podcast-style "chat with sources" workflow self-hosted; quality varies widely ([xda-developers test](https://www.xda-developers.com/tried-open-source-notebooklm-alternatives-only-one-is-the-real-deal/)).
- **NotebookLM itself** (hosted) — covered in [../hosted-tools/](../hosted-tools/README.md).

## Getting started (fastest path: AnythingLLM desktop)

1. Download the desktop installer from https://anythingllm.com (Mac/Windows/Linux).
2. Choose an LLM provider — for privacy, select Ollama and pull a local model first (`ollama pull llama3.1` or similar).
3. Create a workspace; drag in a folder of documents (your notes export, PDFs).
4. Chat; verify citations point at your documents.
5. For a server/team setup, use the Docker image instead; for Khoj, `docker compose up` from their repo and connect the Obsidian plugin if you use Obsidian.

## When to choose this method

- You want working document-chat today, with minimal building.
- Your corpus is large or changes frequently (no re-compilation step).
- You want one private endpoint for family/team use (AnythingLLM multi-user, Khoj agents).

Avoid if: you want knowledge that compounds into a readable artifact ([LLM Wiki](../llm-wiki/README.md)), or your questions require entity-relationship traversal ([knowledge graphs](../knowledge-graphs/README.md)).

All links: **[resources.md](resources.md)**.
