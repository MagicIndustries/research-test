# Agent Memory — Resources

## Repos

- [mem0ai/mem0](https://github.com/mem0ai/mem0) — memory layer, OSS + managed platform ([docs](https://docs.mem0.ai/))
- [getzep/graphiti](https://github.com/getzep/graphiti) — temporal knowledge graph engine (Apache 2.0) · [Zep](https://www.getzep.com/) · [Zep paper (arXiv)](https://arxiv.org/abs/2501.13956)
- [letta-ai/letta](https://github.com/letta-ai/letta) — MemGPT-lineage agent runtime · [MemGPT paper](https://arxiv.org/abs/2310.08560) (2023 — foundational, not current product docs)
- [topoteretes/cognee](https://github.com/topoteretes/cognee) — ECL pipelines for agent memory
- [basicmachines-co/basic-memory](https://github.com/basicmachines-co/basic-memory) — markdown-file MCP memory ([listing](https://mcpservers.org/servers/basicmachines-co/basic-memory))
- [shaneholloman/mcp-knowledge-graph](https://github.com/shaneholloman/mcp-knowledge-graph) — local KG MCP server
- [modelcontextprotocol memory server](https://mcpservers.org/servers/modelcontextprotocol/memory) — official reference server

## Comparisons and surveys (2025–2026)

- [Survey of AI Agent Memory Frameworks — Graphlit](https://www.graphlit.com/blog/survey-of-ai-agent-memory-frameworks) — broadest 2026 survey (mem0, Zep, Graphiti, LangMem, Cognee, CrewAI, LlamaIndex, Graphlit).
- [Comparing Mem0, Zep, Graphiti, Letta, LangMem across 6 dimensions — Jaroslaw Wasowski](https://medium.com/@wasowski.jarek/i-compared-5-ai-agent-memory-systems-across-6-dimensions-none-wins-6a658335ed0a) — "none wins" is the honest conclusion.
- [Picking Between Letta, Mem0 & Zep — Calvin Ku](https://medium.com/asymptotic-spaghetti-integration/from-beta-to-battle-tested-picking-between-letta-mem0-zep-for-ai-memory-6850ca8703d1)
- [Best AI Agent Memory Providers 2026 — Developers Digest](https://www.developersdigest.tech/blog/best-ai-agent-memory-providers-2026) — includes pricing (mem0 ~$19/mo, Letta ~$20/mo, Zep ~$104/mo).
- [Agent Memory Frameworks Tested — Particula](https://particula.tech/blog/agent-memory-frameworks-tested-mem0-zep-letta-cognee-2026) — hands-on testing incl. Cognee.
- [Agent Memory Systems and Knowledge Graphs — Codepointer](https://codepointer.substack.com/p/agent-memory-systems-and-knowledge) — the Graphiti data-model deep-dive (EpisodicNodes/EntityNodes/CommunityNodes).
- [Best AI Agent Memory Frameworks — Atlan](https://atlan.com/know/best-ai-agent-memory-frameworks-2026/)
- [Mem0 vs Zep vs Letta — AgenticWire](https://www.agenticwire.news/article/mem0-zep-letta-agent-memory)

## MCP-specific

- [Claude Code Memory MCP Servers (2026) — MCP.Directory](https://mcp.directory/blog/claude-code-memory-mcp-servers-2026)
- [Basic Memory guides: MCPlane](https://mcplane.com/mcp_servers/basic-memory) · [MCP Market](https://mcpmarket.com/server/basic-memory)
- [Memory MCP server directory (98 listed)](https://mcpservers.org/category/memory) · [Awesome Claude knowledge/memory ranking](https://awesomeclaude.ai/mcp/knowledge-memory)

## Trial instructions

**Basic Memory (recommended first — ~15 min):** `uv tool install basic-memory` (or per README) → add to Claude Desktop/Code MCP config → in conversation, ask Claude to "remember" project facts → open the generated markdown folder as an Obsidian vault and watch the knowledge graph grow. This is the lowest-friction way to experience agent memory as a second brain.

**mem0 (~20 min):** `pip install mem0ai` → follow the quickstart with an OpenAI/Anthropic key → `m.add()` a few conversation turns → `m.search("what do you know about me?")`.

**Graphiti (~1 hr):** needs Neo4j (or FalkorDB) → `pip install graphiti-core` → run the README example → inspect the temporal edges it creates when you feed contradictory facts at different times ("I live in London" … "I moved to Tokyo").

**Letta (~30 min):** `pip install letta` → `letta run` for the local server + ADE UI → create an agent and watch it edit its own core memory blocks.
