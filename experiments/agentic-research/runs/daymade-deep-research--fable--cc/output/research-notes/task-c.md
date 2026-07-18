---
task_id: c
role: Open-Source Ecosystem Mapper
status: complete
sources_found: 13
---

## Sources

[1] GitHub - assafelovic/gpt-researcher | https://github.com/assafelovic/gpt-researcher | Source-Type: official | As Of: 2026-07 | Authority: 9/10
[2] GitHub - langchain-ai/open_deep_research | https://github.com/langchain-ai/open_deep_research | Source-Type: official | As Of: 2026-07 | Authority: 9/10
[3] Open Deep Research (LangChain blog) | https://www.langchain.com/blog/open-deep-research | Source-Type: official | As Of: 2025-08 | Authority: 8/10
[4] GitHub - bytedance/deer-flow | https://github.com/bytedance/deer-flow | Source-Type: official | As Of: 2026-07 | Authority: 9/10
[5] GitHub - stanford-oval/storm | https://github.com/stanford-oval/storm | Source-Type: academic | As Of: 2026-07 | Authority: 9/10
[6] smolagents/examples/open_deep_research README | https://github.com/huggingface/smolagents/blob/main/examples/open_deep_research/README.md | Source-Type: official | As Of: 2026-07 | Authority: 8/10
[7] GitHub - jina-ai/node-DeepResearch | https://github.com/jina-ai/node-DeepResearch | Source-Type: official | As Of: 2026-07 | Authority: 8/10
[8] GitHub - LearningCircuit/local-deep-research | https://github.com/LearningCircuit/local-deep-research | Source-Type: community | As Of: 2026-07 | Authority: 7/10
[9] GitHub - khoj-ai/khoj | https://github.com/khoj-ai/khoj | Source-Type: official | As Of: 2026-07 | Authority: 7/10
[10] DeerFlow 2.0: What It Is, How It Works (DEV Community) | https://dev.to/arshtechpro/deerflow-20-what-it-is-how-it-works-and-why-developers-should-pay-attention-3ip3 | Source-Type: community | As Of: 2026-03 | Authority: 5/10
[11] 4 Open-Source Alternatives to OpenAI's $200/Month Deep Research (MarkTechPost) | https://www.marktechpost.com/2025/02/05/4-open-source-alternatives-to-openais-200-month-deep-research-ai-agent/ | Source-Type: journalism | As Of: 2025-02 | Authority: 5/10
[12] DeerFlow 2.0: ByteDance's open-source AI agent harness (Kiledjian) | https://kiledjian.com/2026/03/06/deerflow-bytedances-opensource-ai-agent.html | Source-Type: community | As Of: 2026-03 | Authority: 4/10
[13] GitHub - btahir/open-deep-research (Firecrawl-style report generator) | https://github.com/btahir/open-deep-research | Source-Type: community | As Of: 2026-07 | Authority: 6/10

## Findings

- GPT Researcher (assafelovic) has 28.4k stars, 3.8k forks, Apache-2.0 license, and latest release v3.5.1 dated June 23, 2026, using a planner/executor/publisher multi-agent pipeline. [1]
- GPT Researcher's Deep Research mode does tree-like exploration with configurable depth/breadth and claims roughly $0.40 and ~5 minutes per research run using o3-mini at high reasoning effort. [1]
- LangChain's open_deep_research shows ~12k stars, 1.7k forks, MIT license, a supervisor/researcher sub-agent architecture on LangGraph, and a #6 Deep Research Bench ranking (RACE 0.4344; 0.4943 with GPT-5). [2]
- open_deep_research is model-agnostic via init_chat_model() with separate configurable models for summarization, research, compression, and final report (defaults GPT-4.1 family), plus Tavily default search and MCP compatibility. [2]
- LangChain positions flexible agent-driven strategy selection (rather than a fixed workflow) as the key design principle of Open Deep Research. [3]
- ByteDance DeerFlow shows 77.3k stars, 10.5k forks, MIT license, and release 2.0.0 dated June 25, 2026, having pivoted from a deep-research framework to a "super agent harness" with lead agent, parallel sub-agents, memory, and sandboxes (local/Docker/Kubernetes). [4]
- DeerFlow 2.0 is a ground-up rewrite on LangChain/LangGraph (SQLite or PostgreSQL checkpointing) and is model-agnostic across any OpenAI-compatible API, recommending 100k+ context reasoning models. [4]
- Community coverage of DeerFlow 2.0's launch (open-sourced Feb 27, 2026) reported ~25,000 stars within weeks — far below the 77.3k visible on GitHub by July 2026, indicating extremely rapid growth but inconsistent secondary reporting. [10]
- Stanford STORM has 30.1k stars, 2.8k forks, MIT license, a four-stage pipeline (perspective-guided knowledge curation, outline generation, article generation, polishing), NAACL 2024 / EMNLP 2024 papers, but its latest release is v1.1.0 from January 23, 2025. [5]
- STORM is built on dspy with model support via litellm and ~10 pluggable retrieval engines (Bing, You, Serper, Brave, SearXNG, DuckDuckGo, Tavily, Azure AI Search, etc.), and Co-STORM adds a moderator agent, LLM experts, human turn-taking, and a dynamic mind map. [5]
- Hugging Face's smolagents open_deep_research example, a CodeAgent-based replication of OpenAI Deep Research, scored 55% pass@1 on GAIA validation versus 67% for OpenAI's original, ranking #1 among open submissions at the time. [6]
- Jina node-DeepResearch takes an iterative search-read-reason loop until answer or token budget exhaustion (Gemini/OpenAI/local LLMs plus Jina Reader), while self-hosted privacy-focused options include local-deep-research (claiming ~95% SimpleQA with 20+ strategies and 10+ search engines, all local and encrypted) and Khoj (self-hostable "AI second brain" with deep research, agents, and any online or local LLM). [7][8][9]

## Deep Read Notes

### Source [1]: GitHub - assafelovic/gpt-researcher
Key data: 28.4k stars, 3.8k forks, Apache-2.0, v3.5.1 (Jun 23, 2026); planner->executors->publisher pipeline; LangGraph+AG2 multi-agent mode; MCP integration; $0.4/~5min per deep research (o3-mini).
Key insight: The only major framework publishing an explicit per-run cost figure, making it the cost-efficiency benchmark of the ecosystem.
Useful for: cost trade-offs, maturity signals, architecture archetype (planner/executor).

### Source [2]: GitHub - langchain-ai/open_deep_research
Key data: ~12k stars, 1.7k forks, MIT; supervisor/researcher phases; per-stage model config (GPT-4.1 defaults, Claude Sonnet 4, GPT-5); Deep Research Bench RACE 0.4344 (#6), 0.4943 with GPT-5; updates through Aug 2025.
Key insight: Only open framework with a quantified position on Deep Research Bench, enabling apples-to-apples quality comparison with closed products.
Useful for: quality claims, model-agnosticism, LangGraph reference architecture.

### Source [4]: GitHub - bytedance/deer-flow
Key data: 77.3k stars, 10.5k forks, MIT, v2.0.0 (Jun 25, 2026); lead agent + parallel sub-agents, sandboxes (local/Docker/K8s), LangGraph persistence (SQLite/Postgres), MCP skills, OpenAI-compatible model-agnostic.
Key insight: Documents the ecosystem's trajectory: deep-research frameworks generalizing into full "super agent harnesses" beyond report writing.
Useful for: org-backed maturity, architecture evolution, self-hosting story.

### Source [5]: GitHub - stanford-oval/storm
Key data: 30.1k stars, 2.8k forks, MIT, v1.1.0 (Jan 23, 2025 — stale vs peers); 4-module pipeline; dspy + litellm; 10 retrievers; NAACL/EMNLP 2024 papers; 70k+ preview users.
Key insight: The academically validated, Wikipedia-article-shaped approach — peer-reviewed pipeline but the slowest release cadence among major frameworks.
Useful for: academic grounding, structured-writing architecture, activity contrast.

## Gaps

- Could not find current (2026) star counts for jina-ai/node-DeepResearch, smolagents, khoj, or local-deep-research from the pages actually read — only architecture and claims; concrete numbers would require fetching each repo page.
- Could not find any independent head-to-head benchmark covering all seven frameworks on a common task set; each project self-reports on a different benchmark (GAIA vs Deep Research Bench vs SimpleQA), so quality claims are not directly comparable.
- Counter-claim candidate: secondary coverage [10][12] reported DeerFlow 2.0 at ~25k stars shortly after its Feb 2026 launch, and one source claimed 47k "in under three months," both conflicting with the 77.3k observed on GitHub in July 2026 — at least one of these figures (or the growth narrative) is wrong or stale, and star totals may also conflate the pre-2.0 deep-research-era repo history.
- Onyx and Firecrawl's own deep-research offerings were not directly located in search results (only a Firecrawl-based community implementation [13]); their status as "prominent frameworks" is unverified here.

## END
