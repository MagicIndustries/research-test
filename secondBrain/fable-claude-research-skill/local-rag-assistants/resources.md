# Resources — Local / Open-Source RAG Assistants

Star counts and activity checked via the GitHub API on 2026-07-18.

## Repos (primary)

- [khoj-ai/khoj](https://github.com/khoj-ai/khoj) — 35.8k★, AGPL-3.0, pushed June 2026. "Your AI second brain. Self-hostable." Indexing for Markdown/org/PDF/Notion/GitHub, custom agents, scheduled automations, deep research; any local or online LLM. [Docs](https://docs.khoj.dev) · [Obsidian plugin](https://docs.khoj.dev/clients/obsidian/) · [1-click Railway deploy](https://railway.com/deploy/khoj).
- [Mintplex-Labs/anything-llm](https://github.com/Mintplex-Labs/anything-llm) — 63.5k★, MIT, pushed this week. Desktop + server RAG workspaces, agents, MCP. [Site/download](https://anythingllm.com) · [Docs](https://docs.anythingllm.com).
- [open-webui/open-webui](https://github.com/open-webui/open-webui) — 145.8k★, pushed this week. Self-hosted chat UI with built-in RAG knowledge collections. [Docs](https://docs.openwebui.com) — note the license's branding clause.
- [zylon-ai/private-gpt](https://github.com/zylon-ai/private-gpt) — 57.3k★, Apache-2.0, active. Private-AI API layer (RAG, tools, MCP, text-to-SQL); the original all-offline docs-chat. [Docs](https://docs.privategpt.dev).
- [reorproject/reor](https://github.com/reorproject/reor) — 8.6k★, AGPL-3.0. ⚠️ Last push May 2025 — effectively unmaintained; listed for completeness because it still appears on many "best of" lists.
- [run-llama/llama_index](https://github.com/run-llama/llama_index) — 50.9k★, MIT. The document-indexing/RAG framework for DIY builds. [Docs](https://docs.llamaindex.ai).
- [langchain-ai/langchain](https://github.com/langchain-ai/langchain) — 142k★, MIT. Agent/RAG framework; heavier abstraction, bigger ecosystem. [Docs](https://python.langchain.com).
- [ollama/ollama](https://github.com/ollama/ollama) — the standard local model runner all of the above plug into. [Site](https://ollama.com).

## Tutorials & articles

- [AnythingLLM + RAG: The Ultimate Guide to Building Private Knowledge Bases (nullzen)](https://www.nullzen.dev/blog/anythingllm-rag-guide/) — end-to-end private setup with Ollama.
- [Khoj: The Open-Source AI Second Brain You Can Self-Host (HoangYell)](https://hoangyell.com/khoj-explained/) — architecture explainer.
- [Khoj self-hosting docs](https://docs.khoj.dev/get-started/setup/) — the authoritative setup path (Docker or pip).
- [8 Best Open-Source Personal AI Assistants in 2026 (Vellum)](https://www.vellum.ai/blog/best-open-source-personal-ai-assistants) — situates these tools in the wider 2026 landscape (document-chat vs frameworks vs full assistants).
- [LlamaIndex: building a RAG pipeline (official tutorial)](https://docs.llamaindex.ai/en/stable/understanding/rag/) — the canonical starting point for a hand-rolled personal KB.

## Video

- [Khoj AI vs AnythingLLM: The Best Local RAG for Obsidian and Markdown Users (YouTube)](https://www.youtube.com/watch?v=TFcrUXg6Jik) — direct head-to-head for exactly the personal-vault use case.

## Choosing within this family

| Want | Pick |
|---|---|
| Easiest private docs-chat today | AnythingLLM Desktop + Ollama |
| Most "second brain" features (agents, automations, clients) | Khoj (self-hosted) |
| One UI for all local-LLM usage, notes included | Open WebUI |
| A code-level building block | LlamaIndex (or PrivateGPT's API) |
