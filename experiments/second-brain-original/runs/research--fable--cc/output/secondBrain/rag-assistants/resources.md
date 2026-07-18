# RAG Assistants — Resources

*Collected 2026-07-18.*

## GitHub repositories

- **Khoj** — self-hostable AI second brain; agents, automations, deep research; AGPL-3.0. https://github.com/khoj-ai/khoj
- **AnythingLLM** — all-in-one document chat with workspaces; desktop + Docker; MIT. https://github.com/Mintplex-Labs/anything-llm
- **Open WebUI** — self-hosted chat UI with Knowledge feature. https://github.com/open-webui/open-webui
- **Quivr (quivr-core)** — opinionated Python RAG framework; Apache-2.0. https://github.com/QuivrHQ/quivr
- **Reor** — local AI notes (ARCHIVED 2026-03; reference only). https://github.com/reorproject/reor

## Official docs and sites

- Khoj docs — https://docs.khoj.dev · site: https://khoj.dev · one-click deploy: https://railway.com/deploy/khoj
- AnythingLLM — https://anythingllm.com/
- Open WebUI Knowledge docs — https://docs.openwebui.com/features/workspace/knowledge/
- quivr-core docs — https://core.quivr.com/
- Reor site — https://reorproject.org

## Guides and tutorials

- **AnythingLLM Setup (2026): Chat With Your Documents Locally** (Local AI Master) — end-to-end desktop setup. https://localaimaster.com/blog/anythingllm-setup-guide
- **AnythingLLM: Complete Guide to Setup, RAG, and Use Cases** (DataCamp) — structured tutorial. https://www.datacamp.com/blog/anythingllm
- **AnythingLLM as Knowledge Base** (SumGuy) — private knowledge-base build. https://sumguy.com/anythingllm-private-knowledge-base/
- **Local RAG in 2026: Build a Private Document AI That Never Leaves Your Machine** — full local pipeline. https://runaihome.com/blog/local-rag-private-document-ai-2026/
- **How to Build a "Personal AI Second Brain" Using Local LLMs** (TechCybo) — local-LLM second-brain walkthrough. https://techcybo.com/ai/how-to-build-a-personal-ai-second-brain-using-local-llms
- **Khoj, the Open-Source Second Brain and Research Copilot** (i-scoop) — feature overview. https://www.i-scoop.eu/khoj/
- **Quivr: Your Second Brain with AI, Free and Open-source** (Medevel) — Quivr overview. https://medevel.com/quivr-your-second-brain-with-ai-free-and-open-source/

## Comparisons

- **Open WebUI vs AnythingLLM** (Open WebUI's official comparison) — https://docs.openwebui.com/alternatives/anythingllm/
- **AnythingLLM vs Open WebUI (2026): Best Local RAG App?** — https://localaimaster.com/blog/anythingllm-vs-open-webui
- **Open WebUI vs AnythingLLM vs LibreChat: Best Self-Hosted AI Chat in 2026** — https://toolhalla.ai/blog/open-webui-vs-anythingllm-vs-librechat-2026
- **AnythingLLM Review 2026** (andrew.ooo) — https://andrew.ooo/posts/anythingllm-all-in-one-ai-app/

## Code snippets to start from

- quivr-core minimal brain: `pip install quivr-core`, then `Brain.from_files(name="my-brain", file_paths=[...])` and `.ask("...")` — see https://core.quivr.com/ quickstart.
- Khoj Docker compose — in-repo: https://github.com/khoj-ai/khoj (docker-compose.yml) with setup at https://docs.khoj.dev/get-started/setup
