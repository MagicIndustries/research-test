# RAG Assistants — Resources

## Repos and docs

| Tool | Repo | Docs / site |
|---|---|---|
| Khoj | [khoj-ai/khoj](https://github.com/khoj-ai/khoj) | [docs.khoj.dev](https://docs.khoj.dev/) · [Obsidian plugin](https://community.obsidian.md/plugins/khoj) |
| AnythingLLM | [Mintplex-Labs/anything-llm](https://github.com/mintplex-labs/anything-llm) | [anythingllm.com](https://anythingllm.com/) · [docs](https://docs.useanything.com/) |
| Reor | [reorproject/reor](https://github.com/reorproject/reor) | [reor site](https://reor.framer.ai/) |
| Open Notebook | [lfnovo/open-notebook](https://github.com/lfnovo/open-notebook) | — |
| SurfSense | [MODSetter/SurfSense](https://github.com/MODSetter/SurfSense) | — |

## Reviews and comparisons (2025–2026)

- [I tried three open-source NotebookLM alternatives — XDA](https://www.xda-developers.com/tried-open-source-notebooklm-alternatives-only-one-is-the-real-deal/) — SurfSense wins; honest on the others' gaps.
- [I replaced NotebookLM with Open Notebook — XDA](https://www.xda-developers.com/replaced-notebooklm-with-open-notebook/) and [follow-up](https://www.xda-developers.com/switched-from-notebooklm-to-open-source-tool-open-notebook/)
- [5 Best Open-Source NotebookLM Alternatives — Peekaboo Labs](https://peekaboolabs.ai/blog/best-open-source-notebooklm-alternatives)
- [12 Free Self-hosted NotebookLM Alternatives — Medevel](https://medevel.com/12-free-self-hosted-opensource-notebooklm-alternatives-manage-your-personal-knowledge/)
- [AnythingLLM: Complete Guide — DataCamp](https://www.datacamp.com/blog/anythingllm) — setup, RAG config, use cases.
- [AnythingLLM Setup 2026 — Local AI Master](https://localaimaster.com/blog/anythingllm-setup-guide)
- [Local RAG with AnythingLLM — IBM Open Source AI Workshop](https://ibm.github.io/opensource-ai-workshop/lab-5/) — hands-on lab.
- [Khoj explained — HoangYell](https://hoangyell.com/khoj-explained/) · [Khoj overview — i-SCOOP](https://www.i-scoop.eu/khoj/)
- [Reor review — TechXplainator](https://techxplainator.com/reor-the-best-open-source-obsidian-alternative-with-local-ai-integration/) · [Reor Show HN thread](https://news.ycombinator.com/item?id=39372159) (2024 — older, but the discussion of local-AI note-taking trade-offs holds up)

## Build-it-yourself course (bridges this category and the next two)

- **[decodingml/second-brain-ai-assistant-course](https://github.com/decodingml/second-brain-ai-assistant-course)** — free, open-source, 6 modules / 11 written lessons: architecture → Notion/web ETL → dataset distillation → fine-tuning Llama 3.1 8B → advanced RAG → agentic inference + observability, orchestrated with ZenML. [Course intro article](https://www.decodingai.com/p/build-your-second-brain-ai-assistant). The best single resource for understanding what's inside these products.

## Trial instructions

**Khoj (Docker, ~15 min):** follow [docs.khoj.dev](https://docs.khoj.dev/) self-host guide → `docker-compose up` → point it at a folder of markdown/PDFs → try chat, then create an agent and a scheduled automation. Or use the hosted free tier first.

**AnythingLLM (~10 min):** download the desktop app from [anythingllm.com](https://anythingllm.com/) → create a workspace → drag in documents → pick a provider (or Ollama for local) → chat.

**Open Notebook (~20 min):** `docker compose up` per the repo README → add sources to a notebook → generate a podcast from your own notes (the wow-demo).

**Reor (~10 min):** download release → let it index a copy of your vault → watch the auto-related-notes sidebar. (Point it at a *copy* until you trust it.)
