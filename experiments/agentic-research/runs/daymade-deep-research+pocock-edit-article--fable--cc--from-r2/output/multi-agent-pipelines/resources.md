# Annotated resources — orchestrated multi-agent pipelines

All URLs live-verified during this run (AS_OF 2026-07-18). Global citation numbers match `../research-notes/registry.md`.

## Primary engineering sources

- **[7] How we built our multi-agent research system** — https://www.anthropic.com/engineering/multi-agent-research-system — Anthropic Engineering, 2025-06-13. The canonical document for this approach: orchestrator–worker definition, eight prompt-engineering principles, effort-scaling rules (1 agent/3–10 calls → 10+ subagents), CitationAgent pass, two-level parallelism (−90% time), token economics (~15x chat; token spend explains 80% of BrowseComp variance), evaluation practice (LLM judge with single rubric; ~20 real queries to start), and explicit fit caveats. *Official; performance numbers are vendor self-reported on an internal eval.*
- **[33] Building effective agents** — https://www.anthropic.com/engineering/building-effective-agents — Anthropic, 2024-12. The taxonomy underneath: workflows (prompt chaining, routing, parallelization, orchestrator-workers, evaluator-optimizer) vs autonomous agents, and the "simplest thing that works" doctrine. *Official.*
- **[34] Effective context engineering for AI agents** — https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents — Anthropic, 2025. Compaction, structured note-taking, subagent architectures; context as a finite "attention budget"; just-in-time retrieval. Applies to both this approach and single-agent skills. *Official.*
- **[25] Open Deep Research** — https://blog.langchain.com/open-deep-research/ — LangChain blog, 2025-07. The Scope→Research→Write supervisor architecture explained, including research-brief compression and subagent context isolation; frames hosted products (OpenAI, Anthropic, Perplexity, Google) as the trade-off baseline. *Official; vendor self-reporting (LangChain reports #6 / 0.4344 on Deep Research Bench, 2025-08).*

## Repositories

- **[17] langchain-ai/open_deep_research** — https://github.com/langchain-ai/open_deep_research — MIT, 12,033 stars, pushed 2026-07-17 (observed 2026-07-18). The reference open implementation; bring-your-own models via `init_chat_model()`, search tools, MCP servers; runs on a local LangGraph server with Studio UI. *Official metadata via GitHub API.*

## Docs

- **[35] LangChain multi-agent patterns** — https://docs.langchain.com/oss/python/langchain/multi-agent — 2026-07. Formalizes Subagents / Handoffs / Skills / Router with token-cost comparisons (~9K vs ~15K tokens; 40–50% call savings for stateful patterns). *Official.*
- **[49] Claude Code: Create custom subagents** — https://code.claude.com/docs/en/sub-agents — Custom agents in `.claude/agents/` with isolated context, restricted tools, per-agent model routing; built-in read-only Explore/Plan agents. *Official.*

## The dissent

- **[38] Don't Build Multi-Agents** — https://cognition.ai/blog/dont-build-multi-agents — Cognition, 2025-06. Argues orchestrator–worker is fragile (subagents act on implicit, conflicting assumptions); prescribes single-threaded agents with full-context sharing. Read alongside [7]'s own fit caveats. *Secondary industry; vendor-motivated.*
