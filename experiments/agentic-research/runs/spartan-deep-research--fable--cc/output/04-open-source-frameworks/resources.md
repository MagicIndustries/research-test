# Resources: Open-Source Research Frameworks and Models

## Repos (all primary)

- [assafelovic/gpt-researcher](https://github.com/assafelovic/gpt-researcher) — 28.4k stars, Apache-2.0, v3.5.1 (2026-06-23). Planner/execution agents, STORM-inspired, recursive deep mode, MCP retrievers, LangGraph/AG2 multi-agent. Cost/latency figures are maintainer-reported. Docs: [Tavily example page](https://docs.tavily.com/examples/open-sources/gpt-researcher).
- [langchain-ai/open_deep_research](https://github.com/langchain-ai/open_deep_research) — MIT, ~12k stars. Supervisor architecture; per-role model config; benchmark self-reporting (RACE 0.4943 w/ GPT-5). Companion blog: [Open Deep Research](https://www.langchain.com/blog/open-deep-research); internals walkthrough: [Bolshchikov's architecture guide](https://www.bolshchikov.com/p/open-deep-research-internals-a-step) (secondary).
- [dzhng/deep-research](https://github.com/dzhng/deep-research) — MIT, ~19k stars, ~500 LoC TypeScript. Depth/breadth recursive loop; the best "read it whole" reference.
- [stanford-oval/storm](https://github.com/stanford-oval/storm) — knowledge-storm package; STORM + Co-STORM. Paper: [arXiv:2402.14207](https://arxiv.org/pdf/2402.14207) (NAACL 2024); project page: [storm-project.stanford.edu](https://storm-project.stanford.edu/research/storm/).
- [huggingface open-deep-research blog + code](https://huggingface.co/blog/open-deep-research) — 2025-02-04. CodeAgent > JSON tool-calls finding; GAIA 55.15%; code lives in the smolagents examples.
- [Alibaba-NLP/DeepResearch](https://github.com/Alibaba-NLP/DeepResearch) — Apache-2.0, 19.7k stars. 30B-A3B MoE weights ([HF model card](https://huggingface.co/Alibaba-NLP/Tongyi-DeepResearch-30B-A3B)), ReAct + IterResearch Heavy mode, CPT→SFT→GRPO pipeline; 18-paper research family. Technical report: [arXiv:2510.24701](https://arxiv.org/pdf/2510.24701). Benchmark wins are vendor self-reported.
- [SkyworkAI/DeepResearchAgent](https://github.com/SkyworkAI/DeepResearchAgent) — hierarchical planning multi-agent framework.
- [ai-agents-2030/awesome-deep-research-agent](https://github.com/ai-agents-2030/awesome-deep-research-agent) — maintained curated list; the field's index.
- [scienceaix/deepresearch](https://github.com/scienceaix/deepresearch) — awesome-list companion to the arXiv:2506.12594 survey.

## Papers (primary, academic)

- [arXiv:2506.18096 — Deep Research Agents: A Systematic Examination and Roadmap](https://arxiv.org/abs/2506.18096) — architectures, retrieval strategies, tool use, training; the standard survey.
- [arXiv:2506.12594 — A Comprehensive Survey of Deep Research](https://arxiv.org/abs/2506.12594) — 80+ systems since 2023; four-dimension taxonomy.
- [arXiv:2508.12752 — Deep Research: A Survey of Autonomous Research Agents](https://arxiv.org/html/2508.12752v1) — complementary survey.
- [arXiv:2402.14207 — STORM](https://arxiv.org/pdf/2402.14207) — perspective-guided question asking, outline-first writing.
- [arXiv:2510.24701 — Tongyi DeepResearch Technical Report](https://arxiv.org/pdf/2510.24701) — the open RL-training recipe.

## Evaluation (primary unless noted)

- [arXiv:2506.11763 — DeepResearch Bench](https://arxiv.org/pdf/2506.11763) + [leaderboard site](https://deepresearch-bench.github.io/) — 100 tasks/22 domains; RACE (LLM-judged comprehensiveness/insight/instruction-following/readability vs reference reports) and FACT (statement–URL citation support).
- [arXiv:2601.08536 — DeepResearch Bench II](https://arxiv.org/abs/2601.08536) — 132 tasks, 9,430 expert-derived binary rubrics, 400+ human-hours; best models <50%.
- [arXiv:2506.06287 — Deep Research Bench (FutureSearch)](https://arxiv.org/abs/2506.06287) + [leaderboard](https://futuresearch.ai/deep-research-bench/) — 89 human-verified tasks; RetroSearch frozen-web environment (189k+ pages); o3 topped at 0.51/1.0.
- [FutureSearch: cost of deep research](https://futuresearch.ai/blog/cost-of-deep-research/) — 2026-02/03. Cost–accuracy–speed Pareto across 20+ configs.
- [arXiv:2508.04183 — Characterizing Deep Research / LiveDRBench](https://arxiv.org/abs/2508.04183) — formal fan-out definition; claim-based scoring; F1 0.02–0.72.
- [arXiv:2306.05685 — MT-Bench / Judging LLM-as-a-Judge](https://arxiv.org/abs/2306.05685), [arXiv:2410.02736 — Justice or Prejudice?](https://arxiv.org/html/2410.02736v1), [arXiv:2410.21819 — Self-Preference Bias](https://arxiv.org/pdf/2410.21819) — the judge-bias canon (position, verbosity, self-preference).

## Secondary articles / video

- [VentureBeat: the "DeepSeek moment" for AI agents (Tongyi)](https://venturebeat.com/ai/the-deepseek-moment-for-ai-agents-is-here-meet-alibabas-open-source-tongyi) — secondary.
- [MarkTechPost: Tongyi DeepResearch release](https://www.marktechpost.com/2025/09/18/alibaba-releases-tongyi-deepresearch-a-30b-parameter-open-source-agentic-llm-optimized-for-long-horizon-research/) — secondary.
- [Langfuse: comparing open-source agent frameworks](https://langfuse.com/blog/2025-03-19-ai-agent-comparison) — secondary; framework-choice context.
- [Barnacle Goose: Open-source "Deep Research" AI assistants](https://medium.com/@leucopsis/open-source-deep-research-ai-assistants-157462a59c14) — secondary field tour.
- [ZenML: Smolagents vs LangGraph](https://www.zenml.io/blog/smolagents-vs-langgraph) — secondary; code-agent vs graph-orchestration trade-offs.
