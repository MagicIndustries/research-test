# Approach 3: Commercial Deep-Research Products (OpenAI, Google, Perplexity)

Hosted, productized deep research: a query box in, a cited multi-page report out, with the agent's internals proprietary. All benchmark numbers in this file are **vendor self-reported** unless marked otherwise.

## OpenAI Deep Research

- **How it works**: an agentic version of o3 trained **end-to-end with reinforcement learning** on browsing and reasoning tasks — the agent itself is the model, not a prompt scaffold. Runs 5–30 minutes, browses, runs Python, and produces a cited report ([OpenAI announcement](https://openai.com/index/introducing-deep-research/), primary/vendor — direct fetch blocked, figures cross-checked via [Fortune](https://fortune.com/2025/02/12/openai-deepresearch-humanity-last-exam/) and [TechRadar](https://www.techradar.com/computing/artificial-intelligence/openais-deep-research-smashes-records-for-the-worlds-hardest-ai-exam-with-chatgpt-o3-mini-and-deepseek-left-in-its-wake), secondary). Launched early Feb 2025.
- **Reported results**: 26.6% on Humanity's Last Exam at launch (~3× the previous best; note it had web access, which most compared models lacked — flagged by TechRadar); 67.36% GAIA validation (vendor, via the HF replication post).
- **API**: `o3-deep-research` and `o4-mini-deep-research` via the Responses API; requires at least one data source (web search, file search, or remote MCP), supports code interpreter, background mode, webhooks, and `max_tool_calls` for cost control. Docs recommend a clarify → rewrite → research prompt chain and warn the model "expects fully-formed prompts up front" ([API docs](https://developers.openai.com/api/docs/guides/deep-research), primary). OpenRouter lists o3-deep-research at $10/M input, $40/M output tokens ([OpenRouter](https://openrouter.ai/openai/o3-deep-research), secondary). GPT-5.2 (Dec 2025) refreshed the underlying model line ([TechCrunch](https://techcrunch.com/2025/12/11/google-launched-its-deepest-ai-research-agent-yet-on-the-same-day-openai-dropped-gpt-5-2/), secondary).

## Google Gemini Deep Research

- **How it works**: three visible stages — an **editable multi-point research plan**, autonomous browsing ("up to hundreds of websites," plus optional Gmail/Drive/Chat), and synthesis with "multiple passes of self-critique"; long-horizon memory via a 1M-token context plus RAG; fully asynchronous ([Google blog, 11 Dec 2024](https://blog.google/products/gemini/google-gemini-deep-research/), primary; [gemini.google overview](https://gemini.google/overview/deep-research/), vendor marketing).
- **Trajectory**: launched on Gemini 1.5 Pro (Dec 2024); rebuilt on Gemini 3 Pro (11 Dec 2025) with developer access via the Interactions API; Google published its own DeepSearchQA benchmark and reports leading on it and HLE, with "ChatGPT 5 Pro a surprisingly close second" and OpenAI slightly ahead on BrowseComp ([TechCrunch](https://techcrunch.com/2025/12/11/google-launched-its-deepest-ai-research-agent-yet-on-the-same-day-openai-dropped-gpt-5-2/), secondary reporting vendor claims). A reported April 2026 "Deep Research Max" tier could not be confirmed from a credible source — treated as unverified. API docs: [ai.google.dev deep research agent](https://ai.google.dev/gemini-api/docs/interactions/deep-research) (primary).

## Perplexity Deep Research

- **How it works**: iterative search-read-reason loops ("dozens of searches, hundreds of sources"), optimized for speed — 2–4 minutes per report; freemium (5 free queries/day at launch, 14 Feb 2025) ([TechCrunch](https://techcrunch.com/2025/02/15/perplexity-launches-its-own-freemium-deep-research-product/), secondary; [Perplexity blog](https://www.perplexity.ai/hub/blog/introducing-perplexity-deep-research), primary/vendor, direct fetch blocked).
- **Reported results**: 21.1% HLE, 93.9% SimpleQA at launch (vendor). In July 2026 Perplexity released **DRACO**, a benchmark built from its own production queries with expert-reviewed binary rubrics (~50% factual-accuracy criteria) and an LLM-as-judge protocol validated across three judge models — on which Perplexity ranks first in all ten domains with lowest latency (459.6s vs 592–1808s) ([DRACO article](https://research.perplexity.ai/articles/evaluating-deep-research-performance-in-the-wild-with-the-draco-benchmark), primary but maximal self-reporting: vendor's benchmark, vendor's data distribution, vendor's win).
- **API**: `sonar-deep-research` — $2/M input, $8/M output, plus citation tokens ($2/M), reasoning tokens ($3/M), and $5/1k search queries; roughly $0.40–$1+ per call ([docs.perplexity.ai](https://docs.perplexity.ai/docs/sonar/models/sonar-deep-research), primary/vendor).

## Trade-offs (as a class)

- **Quality**: highest polish and the only place RL-trained browsing agents are available at frontier scale; still <50% of expert rubrics satisfied on independent-style evals ([DRB II](https://arxiv.org/abs/2601.08536), primary).
- **Cost**: subscription or per-call; per-task API costs ($0.40–several dollars) vs $0.05–$0.55 for tuned open scaffolds ([FutureSearch](https://futuresearch.ai/blog/cost-of-deep-research/), primary).
- **Transparency**: lowest. No prompts, no architecture, benchmark claims unverifiable; every cross-product comparison found was vendor-run.
- **Open vs hosted**: hosted only; source control limited to domain filters/connectors (MCP support in Gemini API and OpenAI API narrows the gap for private data).

## Getting going

1. **Fastest**: Perplexity free tier (5/day) for a feel of speed-optimized research; ChatGPT or Gemini subscriptions for the heavyweight agents.
2. **As harness baseline via API**: `sonar-deep-research` (cheapest, OpenAI-compatible chat format) or `o4-mini-deep-research` (Responses API, background mode + webhook; set `max_tool_calls` to cap spend). Gemini's Deep Research is callable via the Interactions API ([docs](https://ai.google.dev/gemini-api/docs/interactions/deep-research)).
3. Follow OpenAI's pattern regardless of vendor: clarify → rewrite into a full brief → submit; these agents don't ask follow-ups mid-run.
