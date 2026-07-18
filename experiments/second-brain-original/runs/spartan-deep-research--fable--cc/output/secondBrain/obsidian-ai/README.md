# Method: Obsidian + AI (Plugins, Local LLMs, and MCP)

Keep your notes as a local Obsidian vault — plain markdown you own — and add AI three ways: **plugins inside Obsidian** (semantic search, chat, generation), **local models via Ollama** (privacy), and **agent access via MCP or Claude Code** (letting an external AI read/write the vault). This is the lowest-friction path for anyone already using Obsidian, and it composes directly with the [LLM Wiki method](../llm-wiki/README.md).

## The 2026 consensus plugin stack

Multiple 2026 roundups converge on the same pairing ([PromptQuorum](https://www.promptquorum.com/power-local-llm/local-llm-with-obsidian-2026); [Local AI Master](https://localaimaster.com/blog/local-ai-obsidian-integration); [anthemcreation comparison of 7 plugins](https://anthemcreation.com/en/artificial-intelligence/ai-plugins-obsidian-2026-comparison/)):

- **Smart Connections** — vault-wide semantic linking using local embeddings; passively surfaces related notes as you write. Wins for "passive recall." ([plugin page](https://community.obsidian.md/plugins/smart-connections))
- **Copilot for Obsidian** — chat interface over your vault; point it at Ollama's OpenAI-compatible endpoint (`http://localhost:11434/v1`) for fully local chat. Wins for "chat with vault" and text generation. ([plugin page](https://community.obsidian.md/plugins/copilot))

Together these cover roughly 80% of second-brain use cases (semantic search + chat) with nothing leaving your machine ([PromptQuorum](https://www.promptquorum.com/power-local-llm/local-llm-with-obsidian-2026)). Also-rans worth knowing: **Text Generator** (templated generation), **Local GPT** (context-aware local completion), **BMO Chatbot** and **Smart Second Brain** (both Ollama/LM Studio-friendly chat).

## Three ways to connect an agent (Claude) to the vault

Per [innobu's 2026 setup guide](https://www.innobu.com/en/articles/obsidian-claude-second-brain-knowledge-management.html), three established paths, all keeping files local but with different capability/risk profiles:

1. **Claude Desktop + MCP server.** Install the Obsidian **Local REST API** community plugin (which now ships a built-in MCP server) or a community MCP server such as `MarkusPfundstein/mcp-obsidian` (tools: list/read/search/patch/append/delete notes). Configure Claude Desktop with the plugin's API key. Best for conversational use with controlled tool surface. ([obsidian-local-rest-api](https://github.com/coddingtonbear/obsidian-local-rest-api); [mcp-obsidian](https://github.com/MarkusPfundstein/mcp-obsidian))
2. **Claude Code CLI on the vault folder.** Run the agent directly in the vault directory with a `CLAUDE.md` schema. Most powerful (bulk refactors, scheduled maintenance, scripting) and highest risk — the agent can edit anything, so use git. This is the LLM Wiki configuration ([MindStudio](https://www.mindstudio.ai/blog/build-ai-second-brain-claude-code-obsidian); [Code With Seb](https://www.codewithseb.com/blog/claude-code-obsidian-second-brain-guide)).
3. **In-app plugin** (e.g. `iansinnott/obsidian-claude-code-mcp`, or Copilot with an Anthropic key). Most convenient; capabilities bounded by the plugin.

## Getting started (step-by-step)

1. **Install Obsidian** (free; obsidian.md) and create a vault — a plain folder of markdown.
2. **Pick an organizing method** — PARA folders or Zettelkasten links (see [../classic-pkm-wikis/](../classic-pkm-wikis/README.md)); a shallow structure helps both humans and agents.
3. **Local AI (private path):** install [Ollama](https://ollama.com), pull a chat model and an embedding model; install Smart Connections (embeddings) and Copilot (chat -> base URL `http://localhost:11434/v1`). Test: "What do my notes say about X?"
4. **Agent access (power path):** install the Local REST API plugin, enable it, copy the API key; add the MCP server to Claude Desktop config with `OBSIDIAN_API_KEY`; or skip MCP and run Claude Code in the vault with a `CLAUDE.md`.
5. **Put the vault in git** before letting any agent write to it.
6. Escalate gradually: read-only queries first, then append-only notes, then full maintenance workflows.

## Trade-offs

**For:** you own the files; the plugin ecosystem is enormous; local-first privacy is achievable; every other method in this pack can sit on top of an Obsidian vault.
**Against:** plugin quality varies and stacking too many is fragile; local models lag frontier models for synthesis; agent write-access needs discipline (git + schema); Obsidian itself is free but closed-source (the files are open, the app is not — Logseq is the open-source alternative, see [../classic-pkm-wikis/](../classic-pkm-wikis/README.md)).

All links, plugin pages, MCP servers, tutorials, and videos: **[resources.md](resources.md)**.
