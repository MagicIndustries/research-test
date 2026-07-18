# Obsidian AI Plugins — AI Inside the Editor

> Researched 2026-07-18. Plugin landscape is stable; the 2026 consensus stack is Smart Connections + Copilot on local Ollama.

## The approach

Keep your existing Obsidian vault and workflow; add AI *inside the editor* via community plugins. Lowest possible switching cost — no new app, no pattern to adopt — and fully composable with the LLM Wiki pattern (plugins serve interactive use; the agent serves maintenance).

## The consensus stack (2026)

### Smart Connections — ambient discovery
[github.com/brianpetro/obsidian-smart-connections](https://github.com/brianpetro/obsidian-smart-connections)

Shows semantically related notes and excerpts in a sidebar while you write, powered by a **local embedding model — zero setup, no API key**. For local chat/embeddings it pairs with Ollama models (`nomic-embed-text`, `mxbai-embed-large`). Wins at *surfacing connections you didn't ask for* — the automated version of Zettelkasten serendipity.

### Copilot for Obsidian — active chat and generation
[github.com/logancyang/obsidian-copilot](https://github.com/logancyang/obsidian-copilot)

The closest thing to a native AI assistant in Obsidian: chat-with-your-vault (vault QA over an embedded index), inline generation/edit commands, semantic search — supporting cloud providers *and* local models via Ollama's OpenAI-compatible endpoint.

**Together** (per the [2026 comparisons](https://codeculture.store/blogs/developer-culture/obsidian-ai-plugin-comparison-2025)): Smart Connections for ambient discovery + Copilot for active questions covers ~80% of second-brain use cases, fully local if you point both at Ollama.

## Supporting cast

- **Text Generator** — template-driven text generation into notes (multi-provider).
- **Local GPT** — context-aware local-model actions on selected text.
- **BMO Chatbot** — lightweight chat sidebar for local models.
- **Khoj plugin** ([listing](https://community.obsidian.md/plugins/khoj)) — connects the vault to a Khoj server (see `../03-rag-assistants/`) for search/chat/agents.
- **Digital Garden plugin** — publishing (see `../07-publishing-wikis/`).

## Plugins vs Claude Code on the vault

| | Plugins | Claude Code / agent |
|---|---|---|
| Interaction | in-editor, interactive | CLI/agentic, batch |
| Strength | search, chat, quick generation | restructuring, filing, multi-file maintenance, wiki upkeep |
| Setup | minutes | ~an hour incl. schema |
| Risk | low (read-mostly) | agent edits files — needs git |

The [Code Culture comparison](https://codeculture.store/blogs/developer-culture/obsidian-ai-plugin-comparison-2025) frames these as complementary, and that matches everything else in this research: **plugins for reading, agent for writing.**

## Local-first setup notes

1. Install [Ollama](https://ollama.com); `ollama pull llama3.1` (chat) and `ollama pull nomic-embed-text` (embeddings).
2. Smart Connections: works out of the box with its bundled local embedding model; optionally switch to Ollama embeddings in settings.
3. Copilot: add a custom model pointing at `http://localhost:11434/v1` (Ollama's OpenAI-compatible endpoint).
4. Nothing leaves the machine; cost is zero; quality is a step below frontier cloud models — acceptable for search/linking, noticeable for long-form synthesis.
