---
task_id: c
role: OSS Ecosystem Mapper
status: complete
sources_found: 14
---

## Sources

[1] GitHub API: assafelovic/gpt-researcher | https://api.github.com/repos/assafelovic/gpt-researcher | Source-Type: official | As Of: 2026-07 | Authority: 9/10
[2] GitHub API: langchain-ai/open_deep_research | https://api.github.com/repos/langchain-ai/open_deep_research | Source-Type: official | As Of: 2026-07 | Authority: 9/10
[3] GitHub API: bytedance/deer-flow | https://api.github.com/repos/bytedance/deer-flow | Source-Type: official | As Of: 2026-07 | Authority: 9/10
[4] GitHub API: stanford-oval/storm | https://api.github.com/repos/stanford-oval/storm | Source-Type: official | As Of: 2026-07 | Authority: 9/10
[5] GitHub API: huggingface/smolagents | https://api.github.com/repos/huggingface/smolagents | Source-Type: official | As Of: 2026-07 | Authority: 9/10
[6] GitHub API: dzhng/deep-research | https://api.github.com/repos/dzhng/deep-research | Source-Type: official | As Of: 2026-07 | Authority: 8/10
[7] GitHub API: jina-ai/node-DeepResearch | https://api.github.com/repos/jina-ai/node-DeepResearch | Source-Type: official | As Of: 2026-07 | Authority: 8/10
[8] GitHub API: Alibaba-NLP/DeepResearch (Tongyi) | https://api.github.com/repos/Alibaba-NLP/DeepResearch | Source-Type: official | As Of: 2026-07 | Authority: 8/10
[9] Assisting in Writing Wikipedia-like Articles From Scratch with Large Language Models (STORM paper, arXiv 2402.14207) | http://arxiv.org/abs/2402.14207v2 | Source-Type: academic | As Of: 2024-02 | Authority: 9/10
[10] LangChain blog: Open Deep Research | https://blog.langchain.com/open-deep-research/ | Source-Type: official | As Of: 2025-07 | Authority: 9/10
[11] smolagents open_deep_research example README | https://raw.githubusercontent.com/huggingface/smolagents/main/examples/open_deep_research/README.md | Source-Type: official | As Of: 2026-07 | Authority: 8/10
[12] DeerFlow 2.0 README | https://raw.githubusercontent.com/bytedance/deer-flow/main/README.md | Source-Type: official | As Of: 2026-07 | Authority: 9/10
[13] GPT Researcher README | https://raw.githubusercontent.com/assafelovic/gpt-researcher/master/README.md | Source-Type: official | As Of: 2026-07 | Authority: 9/10
[14] STORM README (knowledge-storm) | https://raw.githubusercontent.com/stanford-oval/storm/main/README.md | Source-Type: official | As Of: 2025-09 | Authority: 9/10

## Findings

- GPT Researcher (Apache-2.0) has 28,379 stars and was pushed 2026-07-18 (observed 2026-07-18), making it the most actively maintained of the "classic" deep-research agents; it uses a planner agent that generates research questions, parallel crawler/execution agents that gather per-question evidence, and a publisher that aggregates the report, is model-provider-agnostic ("any LLM providers"), installs via pip/Docker/Colab, and is now also installable as a Claude Skill. [1][13]
- LangChain Open Deep Research (MIT, 12,033 stars, pushed 2026-07-17 as observed 2026-07-18) is a LangGraph three-phase graph — Scope (user clarification + research-brief generation), Research (a supervisor agent delegating sub-topics to parallel tool-calling sub-agents with isolated context windows, each ending with an LLM "clean-up" summarization call), and Write — explicitly designed to let users bring their own models via init_chat_model(), search tools, and MCP servers; quickstart is uv + .env + a local LangGraph server with Studio UI. [2][10]
- ByteDance DeerFlow (MIT) is by far the largest at 77,320 stars (pushed 2026-07-18, observed 2026-07-18), but its 2.0 release (a ground-up rewrite that hit #1 on GitHub Trending on 2026-02-28) repositions it as a general "super agent harness" (sub-agents, sandboxes, memory, skills, IM channels, Claude Code integration); the original LangGraph-based Deep Research framework survives only on the `main-1.x` branch, and 2.0 requires Python 3.12+, Node.js 22+, Docker (recommended), and recommends Doubao-Seed-2.0-Code / DeepSeek v3.2 / Kimi 2.5 as models. [3][12]
- Stanford STORM (MIT, 30,136 stars) shows the least recent activity — last push 2025-09-30 (observed 2026-07-18) — consistent with a completed academic artifact: the NAACL 2024 paper (arXiv 2402.14207) formalizes a two-stage pipeline (pre-writing: perspective-guided question asking plus a simulated Wikipedia-writer-vs-expert conversation to build an outline and references; writing: outline-to-article with citations), shipped as the pip-installable `knowledge-storm` package with litellm integration for model-agnostic LLM/embedding choice and pluggable retrievers (You.com, Bing, VectorRM for own documents). [4][9][14]
- Hugging Face's open Deep Research is not a standalone repo but an example inside smolagents (Apache-2.0, 28,419 stars, pushed 2026-07-14 as observed 2026-07-18): a CodeAgent-based replication of OpenAI Deep Research that scores 55% pass@1 on GAIA validation vs 67% for OpenAI's original, and requires cloning smolagents, pip-installing example requirements, plus a SerpAPI or Serper key and a model key (default o1, which needed OpenAI tier-3 API access). [5][11]
- dzhng/deep-research (MIT, 19,373 stars, pushed 2026-04-11 as observed 2026-07-18) deliberately stays under ~500 lines of TypeScript: a single recursive loop with user-set breadth/depth parameters that generates SERP queries, extracts "learnings" and follow-up directions, and recurses until depth is exhausted, then emits a Markdown report. [6]
- jina-ai/node-DeepResearch (Apache-2.0, 5,196 stars, pushed 2026-05-01 as observed 2026-07-18) implements deep research as a single-agent search-read-reason loop that continues "until it finds the answer or exceeds the token budget" — an iterative-loop architecture rather than a planner/writer graph. [7]
- Alibaba-NLP/DeepResearch ("Tongyi Deep Research", Apache-2.0, 19,678 stars, pushed 2026-02-27 as observed 2026-07-18) surfaced in a live GitHub star-ranked search as a major additional entrant, notable because it centers on a purpose-trained open deep-research model rather than orchestration of third-party LLMs. [8]
- LangChain's blog frames the core design problem as strategy flexibility — comparisons, ranked lists, and validation questions need different search depth/breadth — and cites OpenAI, Anthropic, Perplexity, and Google hosted deep-research products as the baseline the open implementations trade against (self-hosted key management and infra vs turnkey UX). [10]
- License and setup patterns across the ecosystem: all seven mapped frameworks are permissively licensed (4x MIT, 3x Apache-2.0), and every one requires the user to supply at least one LLM API key plus (except STORM's optional VectorRM path and DeerFlow's bundled InfoQuest) a separate web-search provider key — the main friction point vs hosted products where search and model are bundled. [1][2][3][11][12][13][14]

## Deep Read Notes

### Source [10]: LangChain blog: Open Deep Research
Key data: Three-step process: Scope (User Clarification -> Brief Generation, compressing verbose chat into a focused research brief that acts as the "north star"), Research (supervisor agent decides whether the brief decomposes into independent sub-topics and delegates to parallel sub-agents with isolated context windows; each sub-agent runs a tool-calling loop over user-configured search/MCP tools and ends with an LLM call that writes a cited answer to its subquestion, filtering raw scraped pages and failed tool calls), Write (final report). Built on LangGraph; runnable on Open Agent Platform.
Key insight: The supervisor/sub-agent split exists specifically for context-window isolation and parallelism — the blog treats context engineering (brief compression, sub-agent cleanup calls) as the differentiator, not the search tooling.
Useful for: Canonical description of the supervisor/sub-agent "research graph" architecture that DeerFlow 1.x and others echo; also for the hosted-vs-open trade-off framing (OpenAI/Anthropic/Perplexity/Google named as hosted baselines).

### Source [12]: DeerFlow 2.0 README
Key data: DeerFlow = "Deep Exploration and Efficient Research Flow"; 2.0 is a ground-up rewrite sharing no code with v1; v1 (the deep-research framework) maintained on `main-1.x` branch. 2.0 is a "super agent harness": sub-agents, long-term memory, sandboxes, extensible skills, MCP server support, IM channels, scheduled tasks, TUI, Claude Code integration, LangSmith/Langfuse/Monocle tracing. Python 3.12+, Node.js 22+, Docker recommended; ByteDance promotes Doubao-Seed-2.0-Code, DeepSeek v3.2, Kimi 2.5 and bundles BytePlus InfoQuest search/crawl tooling. Claimed #1 GitHub Trending 2026-02-28. MIT license.
Key insight: The star count (77.3k) no longer measures a deep-research framework — the project pivoted category in Feb 2026, so comparing DeerFlow 2.0 stars against GPT Researcher et al. as "deep research" peers overstates that segment.
Useful for: Maturity/activity assessment; evidence that the OSS deep-research category is consolidating into general agent harnesses; counter-claim about DeerFlow's classification.

### Source [11]: smolagents open_deep_research example README
Key data: Open replication of OpenAI Deep Research living at examples/open_deep_research inside huggingface/smolagents; 55% pass@1 on GAIA validation vs 67% for OpenAI's Deep Research. Setup: clone smolagents, pip install example requirements plus dev smolagents, set SERPAPI_API_KEY or SERPER_API_KEY plus a model key (default model o1, gated behind OpenAI tier-3 at the time); run.py CLI. GAIA submission files were manually augmented with PNG screenshots of PDFs/XLS for the multimodal file-reading path.
Key insight: HF's entry is a benchmark-driven demo of the smolagents CodeAgent paradigm (agent writes code actions) rather than a productized research framework — model-swappable via --model-id but with a documented gap to the hosted product it replicates.
Useful for: Quantified open-vs-hosted quality gap (GAIA 55 vs 67); concrete setup/API-key requirements; correcting the task premise that this is a standalone framework.

## Gaps

- Could not find current (2026) GAIA or Deep Research Bench scores comparing all seven frameworks head-to-head; the only cross-system numbers found are HF's GAIA 55%-vs-67% (early 2025 era) and LangChain's self-reported #6 / 0.4344 on Deep Research Bench (2025-08) — no independent 2026 benchmark surfaced in accessible sources.
- Mojeek (403 bot-wall) and the huggingface.co domain via r.jina.ai (abuse-block) were inaccessible this session, so the HF blog post itself and general-web secondary coverage (journalism/industry commentary) could not be read; findings lean almost entirely on primary GitHub/arXiv sources.
- Counter-claim candidate: "ByteDance DeerFlow is a leading open-source deep-research framework with 77k stars" — as of 2026-07, DeerFlow 2.0 is explicitly a general-purpose super-agent harness, not a deep-research framework; the deep-research codebase is a legacy 1.x branch, so its headline star count should not be credited to the deep-research category. Similarly contestable: "Hugging Face's open Deep Research" is an example directory within smolagents, and smolagents' 28.4k stars measure the agent library, not the research agent.

## END
