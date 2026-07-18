# Approach 4: Open-Source Research Frameworks

> Part of [The State of the Art in Agentic Deep Research](../SUMMARY.md) | AS_OF: 2026-07-18 | Citation numbers are global — see [../research-notes/registry.md](../research-notes/registry.md)
> Star counts and release data were read directly from GitHub in July 2026 unless noted; project quality/cost claims are project-self-reported.

## The major frameworks

**GPT Researcher** (assafelovic) — the ecosystem's elder (2023 origin [9]): 28.4k stars, Apache-2.0, v3.5.1 released June 23, 2026 — actively maintained. Planner → parallel executors → publisher pipeline, plus a LangGraph+AG2 multi-agent mode and MCP integration. Its Deep Research mode does tree-like exploration with configurable depth/breadth, and it is the only major framework publishing a per-run cost figure: ~$0.40 and ~5 minutes per run using o3-mini at high reasoning effort (self-reported) [22].

**LangChain Open Deep Research** — ~12k stars, MIT. Supervisor/researcher sub-agent architecture on LangGraph; fully model-agnostic via `init_chat_model()` with *separately configurable models per stage* (summarization, research, compression, final report — defaults GPT-4.1 family); Tavily default search; MCP-compatible. The only open framework with a quantified external benchmark position: #6 on Deep Research Bench, RACE 0.4344 (0.4943 with GPT-5) — self-reported ranking [23]. LangChain's design thesis: flexible agent-driven strategy selection beats fixed workflows [24].

**DeerFlow** (ByteDance) — 77.3k stars, 10.5k forks, MIT, v2.0.0 released June 25, 2026. Open-sourced Feb 27, 2026 as a 2.0 ground-up rewrite on LangChain/LangGraph, pivoting from a deep-research framework to a "super agent harness": lead agent + parallel sub-agents, memory, sandboxes (local/Docker/Kubernetes), SQLite/PostgreSQL checkpointing, model-agnostic across any OpenAI-compatible API (100k+ context reasoning models recommended) [25]. Note: secondary coverage reported ~25k stars in March 2026 [31] — see SUMMARY §7, Controversy 4, on this discrepancy.

**Stanford STORM** — 30.1k stars, MIT, peer-reviewed (NAACL 2024; Co-STORM EMNLP 2024). Four-stage pipeline: perspective-guided knowledge curation → outline generation → article generation → polishing; built on dspy with ~10 pluggable retrievers (Bing, Brave, SearXNG, DuckDuckGo, Tavily, Azure AI Search, …). Co-STORM adds a moderator agent, LLM experts, human turn-taking, and a dynamic mind map. Caveat: latest release v1.1.0 dates to January 23, 2025 — the slowest release cadence among the majors [26].

**smolagents open_deep_research** (Hugging Face) — a CodeAgent-based replication of OpenAI Deep Research that scored 55% pass@1 on GAIA validation vs 67% for OpenAI's original, ranking #1 among open submissions at the time (self-reported) [27].

**Others:** Jina node-DeepResearch (iterative search-read-reason loop until answer or token budget exhaustion; Gemini/OpenAI/local LLMs + Jina Reader) [28]; local-deep-research (privacy-first, fully local, claiming ~95% SimpleQA — self-reported [29]); Khoj (self-hostable "AI second brain" with deep-research mode [30]); btahir/open-deep-research (lightweight Firecrawl-based report generator [33]). The category formed within days of OpenAI's launch as an explicit "$200/month alternative" movement [32].

## Evidence of maturity and activity

Three tiers as of July 2026: (1) **hyper-active, org-backed** — DeerFlow (ByteDance, release <1 month old) [25]; (2) **mature, community-led** — GPT Researcher and open_deep_research (recent releases, large user bases) [22][23]; (3) **academically validated but slowing** — STORM (peer-reviewed, 18-month-old release) [26]. Activity caution: star counts are popularity, not quality, and secondary star reporting proved unreliable (Controversy 4) [31][25].

## Trade-offs

**For:** full transparency and auditability (MIT/Apache); model-agnosticism — swap in cheap or local models per stage [23][25]; dramatic cost advantage (~$0.40/run self-reported vs commercial subscriptions) [22]; self-hosting and privacy options [29][30]; components are borrowable piecemeal.

**Against:** quality evidence is fragmented and non-comparable — each project self-reports on a different benchmark (GAIA vs Deep Research Bench vs SimpleQA), and no independent head-to-head across frameworks exists [22][23][27][29]; operational burden (API keys, search providers, upgrades) falls on you; the best open GAIA result still trailed OpenAI's by 12 points [27]; rapid churn (DeerFlow's full rewrite and scope pivot inside a year [25]).

**Confidence: High** for architecture, license, and activity facts (read directly from repos); **Medium-Low** for all quality and cost claims (self-reported, non-comparable).
**Counter-reading:** the frameworks' implicit claim of parity with commercial products rests on cherry-picked single benchmarks; the one number with a shared scale (smolagents on GAIA) showed a meaningful gap to the commercial original [27].

## Getting going

1. **Want a working researcher fastest:** GPT Researcher — install, add LLM + search API keys, run; budget ~$0.40/run as the self-reported baseline [22].
2. **Want a hackable reference architecture:** open_deep_research — clean supervisor/researcher LangGraph graph with per-stage model configuration to study or fork [23].
3. **Want Wikipedia-style structured articles:** STORM/Co-STORM, accepting the stale release cadence [26].
4. **Want a self-hosted general agent platform:** DeerFlow with sandboxes and persistence [25].
5. **Want privacy/local-only:** local-deep-research or Khoj [29][30].
6. **For a Claude Code developer:** mine these for components (planner prompts, per-stage model routing, retriever abstractions) rather than adopting a second orchestration stack — see SUMMARY §8, step 7.

## References (cited here)

[9] GPT Researcher official site. official. 2026. https://gptr.dev/
[22] assafelovic/gpt-researcher (GitHub). official (self-reported cost/quality). 2026-07. https://github.com/assafelovic/gpt-researcher
[23] langchain-ai/open_deep_research (GitHub). official (self-reported benchmark). 2026-07. https://github.com/langchain-ai/open_deep_research
[24] LangChain. "Open Deep Research" (blog). official. 2025-08. https://www.langchain.com/blog/open-deep-research
[25] bytedance/deer-flow (GitHub). official. 2026-07. https://github.com/bytedance/deer-flow
[26] stanford-oval/storm (GitHub). academic. 2026-07. https://github.com/stanford-oval/storm
[27] huggingface/smolagents open_deep_research README. official (self-reported benchmark). 2026-07. https://github.com/huggingface/smolagents/blob/main/examples/open_deep_research/README.md
[28] jina-ai/node-DeepResearch (GitHub). official. 2026-07. https://github.com/jina-ai/node-DeepResearch
[29] LearningCircuit/local-deep-research (GitHub). community (self-reported benchmark). 2026-07. https://github.com/LearningCircuit/local-deep-research
[30] khoj-ai/khoj (GitHub). official. 2026-07. https://github.com/khoj-ai/khoj
[31] DEV Community. "DeerFlow 2.0". community. 2026-03. https://dev.to/arshtechpro/deerflow-20-what-it-is-how-it-works-and-why-developers-should-pay-attention-3ip3
[32] MarkTechPost. "4 Open-Source Alternatives to OpenAI's $200/Month Deep Research". journalism. 2025-02. https://www.marktechpost.com/2025/02/05/4-open-source-alternatives-to-openais-200-month-deep-research-ai-agent/
[33] btahir/open-deep-research (GitHub). community. 2026-07. https://github.com/btahir/open-deep-research
