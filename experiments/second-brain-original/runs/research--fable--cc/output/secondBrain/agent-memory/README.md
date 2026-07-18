# Agent Memory as a Second Brain

*Method documentation. Resource list: [resources.md](resources.md). Researched 2026-07-18.*

## What it is

This method flips the direction of the other approaches: instead of building a knowledge base and giving an AI access to it, you give a persistent AI assistant **long-term memory**, and the memory store accumulates into your second brain as a side effect of ordinary conversations and work sessions. Capture friction drops to zero — you never "take notes," you just talk to your assistant — at the cost of trusting a model's judgment about what's worth remembering.

The 2026 framework landscape has consolidated around a few architectures ([Graphlit survey of AI agent memory frameworks](https://www.graphlit.com/blog/survey-of-ai-agent-memory-frameworks); [DevGenius 2026 comparison](https://blog.devgenius.io/ai-agent-memory-systems-in-2026-mem0-zep-hindsight-memvid-and-everything-in-between-compared-96e35b818da8)):

- **Extractive vector memory** — after each exchange, an LLM extracts salient facts and stores them (vector-indexed) for later semantic recall. (mem0, LangMem)
- **Temporal knowledge-graph memory** — facts stored as graph edges with validity windows; recall by hybrid graph+vector+BM25 search. (Zep/Graphiti)
- **Memory-OS / self-managed memory** — the model itself pages information between in-context "RAM," recall storage, and archival storage via function calls. (Letta, ex-MemGPT)
- **Markdown knowledge-base memory via MCP** — the assistant reads/writes a local markdown knowledge base through the Model Context Protocol; the store is simultaneously agent memory and a human-browsable vault. (Basic Memory, Obsidian MCP servers)

For a *personal second brain* (as opposed to memory for a product you're shipping), the markdown-via-MCP family is usually the best fit: the artifact is yours, readable, and portable. The framework family matters most if you're building agents.

## The main options

### mem0 — the most-adopted memory layer

[mem0ai/mem0](https://github.com/mem0ai/mem0) — the most widely known memory library in the agent space (~41k stars, ~14M downloads; selected by AWS as memory provider for their Agent SDK, per the [DevGenius comparison](https://blog.devgenius.io/ai-agent-memory-systems-in-2026-mem0-zep-hindsight-memvid-and-everything-in-between-compared-96e35b818da8)). Answers the practical product question: "how does my app remember what matters about this user without stuffing everything into the prompt?" Simple API (add/search/get), hosted platform or self-host, integrates with basically every agent framework. As a personal second brain it's developer-shaped: your "memories" live in a store you query via API, not a vault you browse.

### Zep / Graphiti — temporal-graph memory

[getzep/graphiti](https://github.com/getzep/graphiti) (Apache-2.0) is the open-source temporal knowledge-graph engine; Zep is the managed service built on it. Facts carry validity windows — the memory knows what you said, when, and how it superseded earlier statements. Zep reports 63.8% vs mem0's 49.0% on LongMemEval with GPT-4o, a gap attributed to temporal fact-validity modeling (vendor-reported; via [Atlan's 2026 ranking](https://atlan.com/know/best-ai-agent-memory-frameworks-2026/) and [particula.tech's independent test](https://particula.tech/blog/agent-memory-frameworks-tested-mem0-zep-letta-cognee-2026)). Full detail in [knowledge-graphs/](../knowledge-graphs/).

### Letta (formerly MemGPT) — the memory operating system

[letta-ai/letta](https://github.com/letta-ai/letta) implements the MemGPT idea: treat the LLM like an OS managing its own memory — **main context** (what's in the prompt now), **recall store** (conversation history), **archival store** (long-term external storage) — with the model deciding via function calls what to page in and out, and self-editing "memory blocks" for durable facts about you. Agents are persistent services, not sessions. Best fit: a long-lived personal assistant whose self-managed memory becomes the brain.

### Basic Memory — markdown knowledge base over MCP (most second-brain-shaped)

[basicmachines-co/basic-memory](https://github.com/basicmachines-co/basic-memory) — "AI conversations that actually remember." Verified from the repo and guides: it's an **MCP server** that lets Claude (Desktop/Code — or any MCP client) both read and write a local-first knowledge base of **standard markdown files** (default `~/basic-memory/`). Markdown patterns are parsed into a semantic graph — files become *entities*, bullet facts become *observations*, wikilinks become *relations* — indexed in SQLite for search. No cloud account, no proprietary database. Killer feature: point Obsidian at the folder and the AI-written knowledge appears as a normal vault — wikilinks, frontmatter, graph view; edit either side and sync handles it ([hands-on guide](https://samuellawrentz.com/blog/basic-memory-mcp-obsidian/); [MCP directory entry](https://mcpservers.org/servers/basicmachines-co/basic-memory)).

### Obsidian MCP servers — memory over your existing vault

Several MCP servers expose an existing Obsidian vault to Claude (read, search, write notes), effectively making your current vault the assistant's memory: see the [qed42 integration walkthrough](https://www.qed42.com/insights/supercharge-your-knowledge-management---integrating-obsidian-mcp-with-claude) and [Verdent's Obsidian MCP guide](https://www.verdent.ai/guides/obsidian-mcp-server). This is also the plumbing beneath most Claude-Code-plus-Obsidian second-brain builds ([llm-wiki/](../llm-wiki/)).

## Choosing within this method

| Need | Pick |
|---|---|
| Personal memory that doubles as a browsable markdown vault | Basic Memory (or an Obsidian MCP server over your vault) |
| Memory for an app/agent you're shipping, simplest API | mem0 |
| Time-aware memory; "what did I believe when" | Zep/Graphiti |
| A persistent assistant that manages its own memory | Letta |

## Trial instructions

**Trial (2 evenings) — Basic Memory:** install per the repo README; register it as an MCP server in Claude Desktop and/or Claude Code config; have normal working conversations for a few days, occasionally prompting "record what we decided as notes"; then open `~/basic-memory/` as an Obsidian vault and audit what accumulated — coverage, accuracy, and link structure. Success signal: a week later, a fresh conversation correctly picks up context you never re-explained.

**Developer trial — mem0 vs Graphiti:** wire each into a small chat loop over the same week of synthetic conversations; compare recall precision on ten questions, including two temporal ones ("what changed between Monday and Friday?") where Graphiti should differentiate. The [particula.tech test writeup](https://particula.tech/blog/agent-memory-frameworks-tested-mem0-zep-letta-cognee-2026) is a good methodology template.

**Caveats:** extractive memory inherits the model's salience judgments — audit early and often; benchmark numbers in this space are mostly vendor-reported; and framework-shaped stores lock your "brain" behind an API, which is exactly what the markdown-based options avoid.
