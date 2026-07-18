# Approach 4: Open-Source Research Frameworks and Models

Everything you can clone: turnkey research agents, minimal reference implementations, methodology-first academic systems, and open-weights RL-trained research models.

## The landscape

### GPT Researcher — the turnkey product
Planner/execution architecture: the planner generates research questions, execution agents gather per-question evidence with per-resource source tracking, a publisher aggregates the report; explicitly inspired by the STORM paper. Adds a recursive "Deep Research" mode (tree exploration with configurable depth/breadth; ~5 min and ~$0.40 per run on o3-mini — maintainer's own figure), MCP retrievers, domain whitelists, local/offline operation, and LangGraph/AG2 multi-agent variants ([assafelovic/gpt-researcher](https://github.com/assafelovic/gpt-researcher), primary). **Maturity**: 28.4k stars, 71 releases, v3.5.1 on 2026-06-23, Apache-2.0 — the most product-like FOSS option.

### LangChain Open Deep Research — the reference architecture
Supervisor + parallel researcher subagents + one-shot writer (see approach 2). MIT, ~12k stars, model-role configuration, Tavily/native/MCP search; self-reported RACE 0.4943 (GPT-5 config) on Deep Research Bench ([repo](https://github.com/langchain-ai/open_deep_research); [blog](https://www.langchain.com/blog/open-deep-research), primary). Best choice for studying and porting prompts.

### dzhng/deep-research — the minimal loop
~500 lines of TypeScript: generate queries (breadth), search, extract "learnings" and follow-up directions, recurse (depth), write report. Explicitly a reference implementation to understand completely and build on; ~19k stars, MIT ([repo](https://github.com/dzhng/deep-research), primary). The cleanest expression of the core loop — ideal to transliterate into a skill.

### Stanford STORM — the methodology
Pre-dates the product wave (NAACL 2024). Perspective-guided question asking (discover perspectives from similar articles, simulate writer–expert dialogues), then outline-first generation of a cited long-form article; Co-STORM adds human-in-the-loop collaboration ([arXiv:2402.14207](https://arxiv.org/pdf/2402.14207); [stanford-oval/storm](https://github.com/stanford-oval/storm), primary). Its question-diversity and outline-first ideas survive in nearly every later system.

### Hugging Face open Deep Research (smolagents) — the replication experiment
Built in days after OpenAI's launch: a **CodeAgent** (actions expressed as Python rather than JSON tool calls) with a text web browser; 55.15% GAIA validation vs OpenAI's self-reported 67.36%; switching from code-actions to JSON dropped performance to 33% — their headline lesson ([HF blog, 2025-02-04](https://huggingface.co/blog/open-deep-research), primary).

### Tongyi DeepResearch — the open-weights trained agent
Alibaba's 30.5B-param MoE (3.3B active), 128k context, Apache-2.0, trained with agentic continual pre-training + SFT + on-policy GRPO RL; ReAct mode plus a test-time-scaled "Heavy" IterResearch mode; claims parity/wins vs OpenAI's agent on HLE/BrowseComp-family benchmarks (vendor self-reported) ([Alibaba-NLP/DeepResearch](https://github.com/Alibaba-NLP/DeepResearch), 19.7k stars, primary; [VentureBeat](https://venturebeat.com/ai/the-deepseek-moment-for-ai-agents-is-here-meet-alibabas-open-source-tongyi), secondary). Proof that the RL-trained paradigm is now reproducible outside the big labs — if you can serve a 30B MoE.

## Trade-offs (as a class)

- **Quality**: real but behind hosted frontier agents on open evals (GAIA gap above; <50% expert-rubric satisfaction across the board per [DRB II](https://arxiv.org/abs/2601.08536)). Quality tracks the underlying model you plug in.
- **Cost**: cheapest per task when tuned ($0.05–$0.55 measured across agent configs by [FutureSearch](https://futuresearch.ai/blog/cost-of-deep-research/), independent primary; ~$0.40/run maintainer figure for GPT Researcher).
- **Transparency**: full — prompts, loops, and source handling are inspectable and modifiable; the only route to domain whitelists, local models, and air-gapped research.
- **Open vs hosted**: you own the pipeline but also the maintenance; framework choice (LangGraph vs code-agents vs plain loops) is a real dependency decision ([Langfuse comparison](https://langfuse.com/blog/2025-03-19-ai-agent-comparison), secondary).

## Getting going

1. **Want a product now**: `pip install gpt-researcher`, set an LLM key + Tavily key, run; or clone the repo for the full app. Flip on Deep Research mode for recursive runs.
2. **Want to learn/port the architecture**: clone `langchain-ai/open_deep_research`, run in LangGraph Studio, read `configuration.py` and the prompts; or read dzhng's ~500 lines in one sitting and re-implement as a Claude Code skill.
3. **Want STORM's method**: `pip install knowledge-storm` (stanford-oval), or just lift perspective-guided question generation into your planner prompt.
4. **Want open weights**: Tongyi-DeepResearch-30B-A3B from Hugging Face or via OpenRouter; budget for MoE serving.
