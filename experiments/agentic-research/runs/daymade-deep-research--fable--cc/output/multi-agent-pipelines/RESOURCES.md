# Annotated Resources — Orchestrated Multi-Agent Pipelines

> AS_OF: 2026-07-18. Every entry was surfaced by this project's research pipeline (registry numbers in brackets). Accessibility: all public.

## Primary engineering accounts (start here)

- **[5] Anthropic — How we built our multi-agent research system** — https://www.anthropic.com/engineering/multi-agent-research-system — official, 2025-06. The single most information-dense document in this entire research project: architecture, 90.2% internal-eval claim (self-reported), 4x/15x token multipliers, 80%/95% BrowseComp variance decomposition, parallelism design, eight prompt-engineering lessons, LLM-as-judge rubric, and production war stories (rainbow deployments, sync bottlenecks).
- **[4] Anthropic — Building Effective AI Agents** — https://www.anthropic.com/research/building-effective-agents — official, 2024-12. The canonical orchestrator-workers definition and the simplicity-first doctrine that bounds when to use it.
- **[38] Cognition — Don't Build Multi-Agents** — https://cognition.com/blog/dont-build-multi-agents — secondary-industry, 2025-06. The essential counter-read: context-sharing principles, why conflicting implicit decisions break parallel subagents, and the single-threaded-plus-compression alternative. Read [5] and [38] together.

## Repositories implementing the pattern

- **[25] bytedance/deer-flow** — https://github.com/bytedance/deer-flow — MIT, 77.3k stars, v2.0.0 (2026-06). Lead agent + parallel sub-agents + memory + sandboxes (local/Docker/K8s) on LangGraph; the heaviest-duty open orchestrator.
- **[22] assafelovic/gpt-researcher** — https://github.com/assafelovic/gpt-researcher — Apache-2.0, 28.4k stars, v3.5.1 (2026-06). Planner/executors/publisher; LangGraph+AG2 multi-agent mode; the cost-discipline reference (~$0.40/run, self-reported).
- **[23] langchain-ai/open_deep_research** — https://github.com/langchain-ai/open_deep_research — MIT, ~12k stars. Supervisor/researcher architecture with per-stage model configuration; the only open pipeline with a Deep Research Bench score (RACE 0.4943 with GPT-5, self-reported ranking #6).

## Articles (secondary)

- **[24] LangChain — Open Deep Research blog** — https://www.langchain.com/blog/open-deep-research — official, 2025-08. Argues for flexible agent-driven strategy selection over fixed workflows as the key design principle.

## Tooling for building your own (Claude Code)

- **[50] Claude Code docs — skills** — https://code.claude.com/docs/en/skills — official, 2026-07. `context: fork` + `agent:` = native orchestration seam.
- **[51] Claude Code docs — headless mode** — https://code.claude.com/docs/en/headless — official, 2026-07. `claude -p`, `--bare`, `--json-schema`, `--resume`, `total_cost_usd` metering, subagent-tagged stream-json — the scripting surface for pipelines.

## Videos

- None passed this pipeline's citation registry (search-budget degradation; see SUMMARY §9). Coverage gap, not absence of material.
