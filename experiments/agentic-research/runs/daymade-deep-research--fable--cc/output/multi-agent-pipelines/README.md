# Approach 2: Orchestrated Multi-Agent Pipelines

> Part of [The State of the Art in Agentic Deep Research](../SUMMARY.md) | AS_OF: 2026-07-18 | Citation numbers are global — see [../research-notes/registry.md](../research-notes/registry.md)

## What it is

The **orchestrator–worker** pattern, per Anthropic's canonical December 2024 definition: "a central LLM dynamically breaks down tasks, delegates them to worker LLMs, and synthesizes their results," recommended for tasks whose subtasks cannot be predicted in advance [4]. Applied to research, a lead agent plans the investigation, spawns parallel search subagents with isolated contexts, and synthesizes their distilled findings into a report.

## How it works — the reference implementation

The best-documented system is Anthropic's own Research feature, described in the June 13, 2025 engineering post [5]:

- **Architecture:** a lead Claude Opus 4 agent coordinates and delegates to parallel Claude Sonnet 4 subagents; each subagent's raw search results stay in its own context, and only distilled findings return to the lead.
- **Claimed quality:** the multi-agent system "outperformed single-agent Claude Opus 4 by 90.2%" on Anthropic's internal research eval — **vendor self-reported, internal, with no independent replication found** [5].
- **Economics:** agents use ~4x the tokens of chat; multi-agent systems ~15x. Token usage alone explains 80% of performance variance on BrowseComp; tokens + tool calls + model choice explain 95% [5].
- **Latency:** two layers of parallelism (3–5 concurrent subagents; each making 3+ parallel tool calls) "cut research time by up to 90% for complex queries" (vendor self-reported) [5].
- **Prompt-engineering lessons:** scale effort to complexity (simple fact-finding: 1 agent, 3–10 tool calls; comparisons: 2–4 subagents, 10–15 calls each); give subagents explicit objectives, output formats, and task boundaries; use extended thinking as a "controllable scratchpad"; judge by end-state, not intermediate steps [5].
- **Evaluation:** rubric-based LLM-as-judge (factual accuracy, citation accuracy, completeness, source quality, tool efficiency; 0.0–1.0 single-call scoring) plus human review [5].
- **Honest limits (from the vendor itself):** domains "that require all agents to share the same context or involve many dependencies between agents" — e.g. most coding — fit poorly; the pattern only pays when task value covers the ~15x token bill; synchronous lead-agent execution is a named bottleneck [5].

Open-source instantiations of the same shape: LangChain's open_deep_research (supervisor/researcher sub-agent phases on LangGraph, per-stage model configuration) [23][24], GPT Researcher's planner → parallel executors → publisher pipeline with a LangGraph+AG2 multi-agent mode [22], and ByteDance's DeerFlow (lead agent + parallel sub-agents + sandboxes) [25] — detailed in [../open-source-frameworks/](../open-source-frameworks/README.md).

## The counter-position

Cognition's "Don't Build Multi-Agents" (June 12, 2025 — one day before Anthropic's post) argues parallel subagents are fragile because "actions carry implicit decisions, and conflicting decisions carry bad results," and recommends a single-threaded linear agent with a context-compression model instead [38]. The reconciliation: subagent context isolation is an asset for *read-heavy, parallelizable* work (research) and a liability for *write-heavy, interdependent* work (coding) — a boundary Anthropic itself draws [5][38]. See SUMMARY §7, Controversy 1, for the unresolved architecture-vs-token-budget confound.

## Evidence of maturity and activity

Production deployment in a flagship consumer feature since April 2025 [5]; the pattern is now the explicit architecture of the leading open frameworks (DeerFlow 77.3k stars, GPT Researcher 28.4k, open_deep_research ~12k as of July 2026) [25][22][23]; and Claude Code exposes the pattern natively via custom subagents and skill forking [50]. This is the most battle-tested approach — but also the only one whose headline quality number is an unreplicated internal eval [5].

## Trade-offs

**For:** the only approach with (self-reported) quantified quality gains for research specifically [5]; scales evidence volume beyond one context window; parallelism cuts wall-clock time [5]; fully transparent if self-built.

**Against:** ~15x token cost [5]; coordination fragility and conflicting implicit decisions [38]; engineering complexity (Anthropic needed rainbow deployments and end-state evaluation discipline to run it in production [5]); the quality gain may substantially be a token-budget effect, not an architecture effect (80% variance from tokens alone [5]).

**Confidence: High** on the architecture and its documented mechanics; **Medium** on the magnitude of quality gains (single vendor-internal source).
**Counter-reading:** Cognition's position [38] — that the correct default is a single-threaded agent with context compression — is a serious practitioner counter-claim, and Anthropic's own doctrine ("add complexity only when it demonstrably improves outcomes" [4]) cuts the same way.

## Getting going (Claude Code native)

1. Define worker agents in `.claude/agents/` and let a research skill fork into them (`context: fork`, `agent:` frontmatter) [50] — orchestration without adopting any framework.
2. Follow the reference prompt doctrine [5]: explicit per-subagent objectives, output formats, and task boundaries; distilled-notes-only communication back to the lead; effort scaled to question complexity.
3. Parallelize retrieval only; keep synthesis single-threaded in the lead — this respects both Anthropic's read-heavy boundary [5] and Cognition's conflict warning [38].
4. Script and meter pipelines headlessly: `claude -p` with `--output-format json` exposes `total_cost_usd` per invocation, `--resume` chains multi-pass runs, and stream-json tags subagent messages with `parent_tool_use_id` [51].
5. Only escalate to a full framework (LangGraph/DeerFlow) if you need checkpointing, sandboxes, or non-Claude models [23][25].

## References (cited here)

[4] Anthropic. "Building Effective AI Agents". official. 2024-12. https://www.anthropic.com/research/building-effective-agents
[5] Anthropic. "How we built our multi-agent research system". official (vendor self-reported metrics). 2025-06. https://www.anthropic.com/engineering/multi-agent-research-system
[22] assafelovic/gpt-researcher (GitHub). official. 2026-07. https://github.com/assafelovic/gpt-researcher
[23] langchain-ai/open_deep_research (GitHub). official. 2026-07. https://github.com/langchain-ai/open_deep_research
[24] LangChain. "Open Deep Research" (blog). official. 2025-08. https://www.langchain.com/blog/open-deep-research
[25] bytedance/deer-flow (GitHub). official. 2026-07. https://github.com/bytedance/deer-flow
[38] Cognition (Walden Yan). "Don't Build Multi-Agents". secondary-industry. 2025-06. https://cognition.com/blog/dont-build-multi-agents
[50] Claude Code docs. "Extend Claude with skills". official. 2026-07. https://code.claude.com/docs/en/skills
[51] Claude Code docs. "Run Claude Code programmatically". official. 2026-07. https://code.claude.com/docs/en/headless
