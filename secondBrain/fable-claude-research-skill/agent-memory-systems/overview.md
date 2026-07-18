# Agent-Managed Memory Systems

The frontier: your second brain as **memory belonging to an AI agent** rather than notes belonging to you. The agent extracts, stores, updates, and recalls facts about you and your work across sessions — you converse; it remembers.

Two distinct flavors:

## Flavor 1: Memory frameworks (infrastructure)

Libraries/servers that give any agent persistent memory. The 2026 big four ([multi-system comparison](https://medium.com/@wasowski.jarek/i-compared-5-ai-agent-memory-systems-across-6-dimensions-none-wins-6a658335ed0a), [tested head-to-head](https://particula.tech/blog/agent-memory-frameworks-tested-mem0-zep-letta-cognee-2026)):

- **[Mem0](https://github.com/mem0ai/mem0)** (61k★, Apache-2.0) — the most adopted: an extraction pipeline distills salient facts from conversations into compact memories, then ADD/UPDATE/DELETE/NOOPs them against the store. Chosen by AWS as the memory provider for their Agent SDK. Benchmarks: ~67% LLM-judge on LOCOMO at ~0.2s p95 search, using ~1.8k tokens/conversation vs 26k full-context. Best for stable user facts and preferences.
- **[Zep / Graphiti](https://github.com/getzep/graphiti)** (28.8k★, Apache-2.0) — temporal knowledge graph memory: facts carry time validity, relations survive change. Scores ~63.8% vs Mem0's 49.0% on LongMemEval (time-anchored recall) but graph construction is expensive and ingestion→retrieval lag is real. Best when *state that changes over time* matters.
- **[Letta (ex-MemGPT)](https://github.com/letta-ai/letta)** (23.8k★, Apache-2.0) — the "LLM operating system" from the [MemGPT paper (arXiv 2310.08560)](https://arxiv.org/abs/2310.08560): the model manages its own core/recall/archival memory via function calls, paging information in and out of context. Conceptually the richest; in practice the agentic overhead costs latency and money. Now a full stateful-agents server.
- **[cognee](https://github.com/topoteretes/cognee)** (28k★) — document-pipeline-to-KG memory (covered more in [knowledge-graph-rag](../knowledge-graph-rag/overview.md)).

Verdict from 2026 testing: *none wins on all dimensions* — Mem0 for cheap stable-fact recall, Zep for temporal correctness, Letta for self-curating long-lived agents.

## Flavor 2: File-based agent memory (the "agentic second brain")

The pattern closest to home: an agent (typically **Claude Code**) maintains plain Markdown memory files it reads at session start and edits as it learns — e.g. Claude Code's `MEMORY.md` + topic files, `CLAUDE.md` project instructions, and Anthropic's memory-tool pattern for API builders ([Anthropic memory docs](https://docs.anthropic.com/en/docs/build-with-claude/memory)). Scale the same pattern up and you get the [Karpathy LLM wiki](../llm-generated-wikis/overview.md) — the two families converge: an LLM wiki *is* file-based agent memory with the human as curator.

Consumer assistants ship the same idea closed-source: [ChatGPT memory](https://help.openai.com/en/articles/8590148-memory-faq) and [Claude's memory](https://www.anthropic.com/news/memory) both auto-extract and persist user facts across chats — a zero-effort second brain you don't control or fully see.

## Trade-offs

**Strengths**
- Zero filing burden — memory forms as a by-product of conversation/work.
- Frameworks are benchmarked, composable infrastructure (MCP/REST/SDKs) — the same memory can serve many agents.
- File-based flavor is transparent and gittable: you can read exactly what the agent believes.

**Weaknesses**
- Framework flavor: you're building an app, not adopting a practice — real engineering required; extraction errors compound silently; benchmarks (LOCOMO, LongMemEval) measure chat recall, not knowledge work.
- Consumer flavor: opaque, non-portable, vendor-controlled.
- An agent's memory is *about interactions*; it doesn't replace a curated corpus of sources — pair it with one of the other families.

## Who it's for

Developers building assistants/agents that must know their user; Claude Code users who want their tooling to accumulate understanding of their projects for free; anyone whose "second brain" is really "I want my AI to remember me."

## Getting started (concrete)

1. **File-based, zero code**: in Claude Code, just tell it things to remember — inspect the Markdown it writes in its memory directory; add project facts to `CLAUDE.md`. You now have a transparent agent memory.
2. **Mem0 in an afternoon**: `pip install mem0ai`, follow the [quickstart](https://docs.mem0.ai/quickstart) — add memories from a chat loop, query them, watch the ADD/UPDATE decisions.
3. **Temporal graph**: run [Graphiti quickstart](https://help.getzep.com/graphiti/graphiti/quick-start) with dated facts; ask what was true when.
4. **Letta**: [Letta quickstart](https://docs.letta.com/quickstart) to feel self-editing memory blocks in action.
