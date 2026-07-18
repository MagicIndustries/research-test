# Annotated resources — open-source research frameworks

All repo metadata observed live via unauthenticated GitHub API on 2026-07-18. Global citation numbers match `../research-notes/registry.md`.

## Repositories (star-ordered, with category caveats)

- **[18]/[27] bytedance/deer-flow** — https://github.com/bytedance/deer-flow — 77,320 ★, MIT, pushed 2026-07-18. ⚠ **Category caveat:** 2.0 (Feb 2026) is a general "super agent harness" (subagents, sandboxes, memory, skills, Claude Code integration; Python 3.12+/Node 22+/Docker; ByteDance promotes Doubao/DeepSeek/Kimi models + bundled InfoQuest search). The deep-research framework is the legacy `main-1.x` branch only. README: https://raw.githubusercontent.com/bytedance/deer-flow/main/README.md
- **[19]/[29] stanford-oval/storm** — https://github.com/stanford-oval/storm — 30,136 ★, MIT, last push 2025-09-30 (**dormant** — completed academic artifact). Pip package `knowledge-storm`; litellm model-agnostic; retrievers: You.com, Bing, VectorRM (own documents).
- **[20]/[26] huggingface/smolagents (open Deep Research example)** — https://github.com/huggingface/smolagents — 28,419 ★, Apache-2.0, pushed 2026-07-14. The open replication of OpenAI Deep Research lives at `examples/open_deep_research`: CodeAgent paradigm (agent writes code actions), GAIA validation 55% pass@1 vs OpenAI's 67%. Setup: clone + example requirements + SerpAPI/Serper key + model key. README: https://raw.githubusercontent.com/huggingface/smolagents/main/examples/open_deep_research/README.md
- **[16]/[28] assafelovic/gpt-researcher** — https://github.com/assafelovic/gpt-researcher — 28,379 ★, Apache-2.0, pushed 2026-07-18 (most actively maintained classic). Planner/execution/publisher architecture; any LLM provider; pip/Docker/Colab; installable as a Claude Skill. README: https://raw.githubusercontent.com/assafelovic/gpt-researcher/master/README.md
- **[23] Alibaba-NLP/DeepResearch (Tongyi)** — https://github.com/Alibaba-NLP/DeepResearch — 19,678 ★, Apache-2.0, pushed 2026-02-27. A purpose-trained open deep-research model rather than an orchestration layer — the "open-weights product" end of the spectrum.
- **[21] dzhng/deep-research** — https://github.com/dzhng/deep-research — 19,373 ★, MIT, pushed 2026-04-11. ~500 lines of TypeScript; recursive breadth/depth loop; the best minimal reading of the core algorithm.
- **[17] langchain-ai/open_deep_research** — https://github.com/langchain-ai/open_deep_research — 12,033 ★, MIT, pushed 2026-07-17. The reference LangGraph supervisor pipeline (see `../multi-agent-pipelines/`).
- **[22] jina-ai/node-DeepResearch** — https://github.com/jina-ai/node-DeepResearch — 5,196 ★, Apache-2.0, pushed 2026-05-01. Single-agent search-read-reason loop under a token budget — the "iterative loop" architecture without planner/writer separation.

## Papers

- **[24] Assisting in Writing Wikipedia-like Articles From Scratch with Large Language Models (STORM)** — http://arxiv.org/abs/2402.14207v2 — NAACL 2024 (arXiv 2024-02, confirmed via arXiv API). Formalizes perspective-guided question asking and simulated writer-expert conversations for outline/reference building — the research-methodology paper behind the repo. *Academic.*

## Articles

- **[25] Open Deep Research** — https://blog.langchain.com/open-deep-research/ — LangChain, 2025-07. Architecture rationale (brief compression, context isolation, supervisor parallelism) plus the hosted-vs-open trade-off framing; names OpenAI/Anthropic/Perplexity/Google as the baselines open implementations trade against. *Official (LangChain); self-reported benchmark placement.*

## Videos

- None live-verified this run. Search-engine access was restricted this session (bot-walls), and no video resource surfaced through the primary-source channels used; rather than cite unverified links from memory, this category is left empty — see `../research-notes/execution-log.md`.
