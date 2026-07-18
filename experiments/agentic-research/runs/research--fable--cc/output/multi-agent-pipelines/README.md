# Approach 2: Orchestrated Multi-Agent Pipelines

*Orchestrator–worker research systems. Part of the
[agentic deep research report](../SUMMARY.md).*

## How it works

A **lead/orchestrator agent** receives the query, "analyzes it, develops a
strategy, and spawns subagents to explore different aspects simultaneously";
each **worker/subagent** runs its own search-and-read loop in an isolated
context window and returns condensed findings; the lead agent synthesizes and
iterates until it can write the cited report
([Anthropic engineering, "How we built our multi-agent research system"](https://www.anthropic.com/engineering/multi-agent-research-system)).
LangChain's open implementation names the same roles supervisor and
researchers: the supervisor "determines if the research brief can be
broken-down into independent sub-topics" and delegates to parallel sub-agents
with isolated context windows
([LangChain, "Open Deep Research"](https://blog.langchain.com/open-deep-research/)).

Why it wins on hard, breadth-heavy questions: separate context windows let
total reasoning/token budget scale far beyond one window, and Anthropic found
token budget is the dominant variable — "token usage by itself explains 80% of
the variance" in browsing-eval performance, with parallel tool use cutting
research time "by up to 90%" on complex queries (same post).

## Evidence of maturity and activity

- **Anthropic (production system, June 2025 write-up).** Multi-agent (Opus 4
  lead + Sonnet 4 subagents) outperformed single-agent Opus 4 by **90.2%** on
  an internal research eval **[vendor self-reported, unreplicated]**. The post
  also documents production hardening: checkpoint/resume for long-running
  agents, full tracing, "rainbow deployments." This powers the shipping
  Claude Research feature.
- **LangChain open_deep_research (open source,
  [repo](https://github.com/langchain-ai/open_deep_research)).** LangGraph
  supervisor architecture; scored RACE **0.4344**, ranked #6 on the public
  [DeepResearch Bench](https://deepresearch-bench.github.io/) leaderboard at
  the time of the blog post (framework-reported score on a third-party
  benchmark). Tavily search by default, MCP-compatible. A companion teaching
  repo, [deep_research_from_scratch](https://github.com/langchain-ai/deep_research_from_scratch), walks the build.
- **Community reimplementations** of the Anthropic pattern exist (e.g.
  [The-Swarm-Corporation/AdvancedResearch](https://github.com/The-Swarm-Corporation/AdvancedResearch)) — activity signal, quality unverified (secondary).
- The academic surveys treat multi-agent configuration as one of the two
  canonical DRA architectures
  ([arXiv:2506.18096](https://arxiv.org/abs/2506.18096)).

## Key design rules (from the primary source)

Anthropic's post distills eight prompt-engineering principles; the load-bearing
ones for reimplementation:

- **Detailed delegation.** Subagent tasks need explicit objectives, output
  formats, tool guidance, and boundaries — vague tasks duplicate work.
- **Effort scaling.** Encode rules like "simple fact-finding requires just 1
  agent with 3–10 tool calls"; early versions spawned 50 subagents for simple
  queries.
- **Broad-then-narrow search.** Short broad queries first, then focus.
- **Extended thinking as a controllable scratchpad** for planning and
  synthesis.
- **End-state evaluation** with an LLM judge scoring factual accuracy,
  citation accuracy, completeness, source quality, tool efficiency (0.0–1.0),
  plus human review for edge cases.

## Trade-offs

| Dimension | Assessment |
|---|---|
| Quality | Best documented gains on breadth-heavy, parallelizable research; Anthropic explicitly scopes the win to that task class |
| Cost | ~**15×** chat tokens (vs ~4× for single agents) ([Anthropic](https://www.anthropic.com/engineering/multi-agent-research-system)) — the price of admission |
| Transparency | Open implementations fully inspectable; Anthropic's production system only described, not released |
| Reliability | Compound failure surface: stateful long-running agents, non-deterministic coordination; needs tracing and resumability |
| Debugging | Hardest of the four approaches; "minor system failures can be catastrophic" (Anthropic) |

## Getting going

1. Read the [Anthropic post](https://www.anthropic.com/engineering/multi-agent-research-system) end to end — it is the field's best design document.
2. For a runnable system: `uvx`/clone
   [langchain-ai/open_deep_research](https://github.com/langchain-ai/open_deep_research),
   add a Tavily (or native provider) search key, run under LangGraph Studio to
   watch the supervisor delegate. Its prompts are plain files — read them.
3. In Claude Code specifically, the same pattern is available without a
   framework: a lead session dispatching parallel subagents via the harness's
   agent/task tool, governed by a skill that carries the delegation and
   effort-scaling rules ([approach 1](../single-prompt-skills/README.md)).
4. Gate multi-agent mode behind query type: only fan out when subtopics are
   genuinely independent; otherwise the 15× spend buys coordination overhead.

Annotated sources: [resources.md](resources.md).
