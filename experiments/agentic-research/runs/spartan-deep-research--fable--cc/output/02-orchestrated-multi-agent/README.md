# Approach 2: Orchestrated Multi-Agent Pipelines

An orchestrator (lead agent) plans the research, spawns parallel worker subagents with isolated context windows, and synthesizes their compressed findings into one report. This is the published architecture behind Anthropic's Claude Research feature and LangChain's Open Deep Research, and the pattern most community "/deep" workflows copy.

## How it works

**Anthropic's production account** ([engineering blog, 13 Jun 2025, primary](https://www.anthropic.com/engineering/multi-agent-research-system)): a lead agent analyzes the query, develops a strategy, and spawns subagents that search in parallel; each subagent acts as an "intelligent filter," iterating on search tools and returning distilled findings, which the lead compiles. Key measured results:

- Multi-agent (Opus 4 lead + Sonnet 4 workers) beat single-agent Opus 4 by **90.2%** on breadth-first internal research evals.
- Agents use ~4× the tokens of chat; multi-agent systems ~**15×** — economical only when the task's value covers it.
- Prompting principles that mattered: teach the orchestrator to delegate with detailed task descriptions; embed effort-scaling rules by query complexity; start broad then narrow; use extended thinking as a scratchpad; parallel tool calls; let Claude diagnose and improve its own prompts.
- Evaluation: LLM judge scoring a rubric (factual accuracy, citation accuracy, completeness, source quality, tool efficiency) plus human spot checks.

**LangChain's open implementation** ([blog, primary](https://www.langchain.com/blog/open-deep-research); [repo](https://github.com/langchain-ai/open_deep_research)) refines the pattern into three phases — scope (build a research brief), research (supervisor delegates to parallel researcher subagents, each with its own context), report (one LLM writes the whole report in one shot over all findings). Two hard-won lessons: parallel *section-writing* produces disjoint reports (so only research is parallelized), and context engineering (compressing history into briefs, summarizing tool output) is what keeps 15×-token workloads affordable.

**In Claude Code specifically**, the same shape is available natively: a skill or command has the main context act as orchestrator and dispatch Task/subagent workers, each returning compressed findings; community "/deep" commands do exactly this, arguing parallel agents also stop early retrieval errors from compounding ([MindStudio, secondary](https://www.mindstudio.ai/blog/what-is-deep-research-command-claude-code)).

## Evidence of maturity and activity

- Runs in production at Anthropic (Claude's Research feature) — primary engineering account, June 2025.
- Independently replicated: LangChain ODR (MIT, ~12k stars, self-reported #6 on FutureSearch's Deep Research Bench with RACE 0.4943 using GPT-5); GPT Researcher's LangGraph multi-agent mode; SkyworkAI's hierarchical [DeepResearchAgent](https://github.com/SkyworkAI/DeepResearchAgent).
- The orchestrator–worker pattern is treated as the default production architecture in 2025–2026 practitioner writing ([ByteByteGo](https://blog.bytebytego.com/p/how-anthropic-built-a-multi-agent), secondary).

## Trade-offs

- **Quality**: the strongest scaffold evidence in the field (90.2% on breadth-first tasks) — but that gain is task-shaped; narrow single-thread questions don't benefit and pay the coordination tax anyway.
- **Cost**: ~15× chat tokens (Anthropic, primary). Model choice dominates: upgrading the model beat doubling the token budget.
- **Transparency**: moderate. Each subagent transcript is inspectable, but emergent coordination failures (duplicated work, over-spawning) are harder to debug than a single linear transcript; Anthropic notes debugging emergent behavior required tracing and rainbow deployments.
- **Open vs hosted**: the pattern is fully reproducible with open tools (LangGraph, Claude Code subagents); Anthropic's exact prompts are not public, but LangChain's and GPT Researcher's are.

## Getting going

1. **Claude Code-native (recommended for a skills harness)**: write an orchestrator skill that (a) produces a research brief, (b) spawns 3–5 parallel research subagents, each given an explicit objective, output format, tool guidance, and task boundaries, (c) has workers write compressed findings + source ledgers to files, (d) runs a single-writer synthesis over those files, then a critique pass. Scale worker count with question breadth (Anthropic's effort-scaling rule).
2. **Framework route**: `git clone langchain-ai/open_deep_research`, configure models per role (summarizer/researcher/compressor/writer) and a search API (Tavily default; MCP supported), run via LangGraph Studio. Use it to observe supervisor prompts, then port them.
3. Budget guardrails: cap tool calls per worker, cap workers per run — token spend is the failure mode (Anthropic, primary).
