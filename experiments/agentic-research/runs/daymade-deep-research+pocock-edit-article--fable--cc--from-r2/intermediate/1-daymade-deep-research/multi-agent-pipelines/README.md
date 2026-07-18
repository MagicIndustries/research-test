# Approach 2: Orchestrated Multi-Agent Pipelines

> A lead agent decomposes the research question, dispatches parallel specialist subagents with isolated context windows, then synthesizes their distilled findings — the **orchestrator–worker** pattern. This is the architecture behind Anthropic's Claude Research and LangChain's Open Deep Research.

**Confidence: High** for how these systems work (detailed primary engineering sources); **Medium** for the claimed quality advantage (vendor self-reported, with credible dissent).

## The pattern, defined by its builders

Anthropic's engineering post (June 13, 2025) — the canonical primary source — defines it as "a multi-agent architecture with an orchestrator-worker pattern, where a lead agent coordinates the process while delegating to specialized subagents that operate in parallel," and defines a multi-agent system as "multiple agents (LLMs autonomously using tools in a loop) working together" [7].

Anthropic's end-to-end flow [7]: LeadResearcher plans → saves the plan to external Memory (context past 200K tokens gets truncated) → spawns subagents → iterative synthesis loop → a dedicated **CitationAgent** pass attaches sources to claims → final report.

Anthropic's earlier "Building effective agents" (December 2024) situates orchestrator–workers among five workflow patterns (prompt chaining, routing, parallelization, orchestrator-workers, evaluator-optimizer), recommends the simplest solution that works, and notes the pattern suits tasks where subtasks can't be predicted in advance [33].

## The method is mostly prompt engineering

The load-bearing content of [7] is eight prompt-engineering principles, with unusually concrete numbers (all vendor self-reported from internal experience):

1. **Think like your agents** — simulate them step by step to find failure modes.
2. **Teach the orchestrator to delegate**: every subagent task carries an objective, an output format, tool/source guidance, and task boundaries. Vague tasks ("research the semiconductor shortage") caused duplicated work and gaps.
3. **Scale effort to query complexity** with explicit rules: simple fact-finding = 1 agent, 3–10 tool calls; direct comparisons = 2–4 subagents, 10–15 calls each; complex research = 10+ subagents with divided responsibilities.
4. **Tool design is a first-class interface**: bad tool descriptions send agents down wrong paths; a self-improving "tool-testing agent" that rewrote a failing tool description cut task completion time 40%.
5. **Let the model improve its own prompts.**
6. **Start wide, then narrow** — short broad queries before drilling down.
7. **Use extended thinking** (lead) and interleaved thinking (subagents) as a visible planning scratchpad.
8. **Parallelize at two levels** — the lead spawns 3–5 subagents in parallel; each subagent calls 3+ tools in parallel — cutting research time by up to 90% for complex queries.

## Evidence on quality and cost

- Anthropic reports a multi-agent system (Claude Opus 4 lead + Claude Sonnet 4 subagents) outperformed single-agent Opus 4 by **90.2%** on its internal research eval (**vendor self-reported, unpublished eval**) [7].
- The same source reports token usage alone explains **80% of performance variance** on BrowseComp, and that agents use ~4x — and multi-agent systems **~15x** — the tokens of ordinary chat [7]. The confound is stated by the vendor itself: much of the multi-agent advantage may be *spending more tokens*, not the architecture.
- Anthropic's own fit caveat: multi-agent suits breadth-first, parallelizable, high-value questions; it is a poor fit where workers must share full context or have tight interdependencies (e.g. most coding) [7].
- LangChain's 2026 docs quantify pattern trade-offs: subagents win for parallel multi-domain work (~9K tokens vs ~15K for a skills-based single agent on a 3-way comparison), while stateful patterns save 40–50% of calls on repeat requests [35].

## The counter-case

Cognition (makers of Devin) argue in "Don't Build Multi-Agents" (June 2025) that orchestrator–worker systems are "very fragile": subagents act on implicit, conflicting assumptions because they don't share context, and reliable long-running agents should instead be single-threaded with aggressive context engineering ("Share context; actions carry implicit decisions") [38]. This is vendor-motivated commentary (Cognition sells a single-agent product), but it aligns with Anthropic's own caveats about interdependent tasks and 15x token cost [7]. No independent head-to-head benchmark between the two philosophies was found (see Gaps).

## Open implementation to study

LangChain's **Open Deep Research** (MIT, 12,033 stars, pushed 2026-07-17; observed 2026-07-18) is the cleanest open orchestrated pipeline [17][25]: a three-phase LangGraph — **Scope** (user clarification → a compressed "research brief" that acts as the north star), **Research** (a supervisor delegates independent sub-topics to parallel tool-calling subagents with isolated context windows, each ending with an LLM clean-up call that writes a cited answer and filters raw scrape debris), **Write** (final report). The blog is explicit that the supervisor/subagent split exists for *context-window isolation and parallelism* — context engineering, not search tooling, is the differentiator [25].

## Getting going

- **In Claude Code**: define custom subagents in `.claude/agents/` — each runs in its own context window with a custom system prompt, restricted tools, and per-agent model routing (e.g. a cheap model for exploration) [49]. A research skill can act as the orchestrator prompt and dispatch these subagents; this run itself executed that way (see `../research-notes/execution-log.md`).
- **In LangGraph**: clone `langchain-ai/open_deep_research`; quickstart is `uv` + a `.env` of model/search keys + a local LangGraph server with Studio UI; models are pluggable via `init_chat_model()`, search tools and MCP servers are configurable [17][25].
- **Port the method, not the infra**: the eight principles above plus a dedicated citation pass and external memory are reproducible in any harness [7][34].

## Gaps and counter-claims

- The 90.2% improvement figure has no independent replication; it may substantially reflect token budget rather than architecture (Anthropic's own 80%-variance-from-tokens finding invites this reading) [7].
- No third-party benchmark comparing orchestrated pipelines vs single-agent skills on identical tasks was found (task-d gap).
- Publication dates for [7] and [33] were inferred from content (r.jina.ai omitted page metadata); the June 13, 2025 date for [7] comes from task-a's fetch.

## References

[7] Anthropic — How we built our multi-agent research system — https://www.anthropic.com/engineering/multi-agent-research-system (official; vendor self-reporting)
[17] GitHub API — langchain-ai/open_deep_research — https://api.github.com/repos/langchain-ai/open_deep_research (official metadata)
[25] LangChain blog — Open Deep Research — https://blog.langchain.com/open-deep-research/ (official; vendor self-reporting)
[33] Anthropic — Building effective agents — https://www.anthropic.com/engineering/building-effective-agents (official)
[34] Anthropic — Effective context engineering for AI agents — https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents (official)
[35] LangChain docs — Multi-agent patterns — https://docs.langchain.com/oss/python/langchain/multi-agent (official; vendor self-reporting)
[38] Cognition — Don't Build Multi-Agents — https://cognition.ai/blog/dont-build-multi-agents (secondary industry; vendor-motivated)
[49] Claude Code docs — Create custom subagents — https://code.claude.com/docs/en/sub-agents (official)
