# Resources: Open-Source Research Frameworks

*All links checked live on 2026-07-18. Star counts/commit dates are snapshots from that date and will drift; conflicting figures found across sources are noted explicitly rather than resolved by guessing.*

## Repos

- **GPT Researcher** — https://github.com/assafelovic/gpt-researcher — Latest release v3.5.1 (June 23, 2026); 28.4k stars, 3.8k forks, 3,077 commits, Apache-2.0. [primary]. Multi-agent planner/executor/publisher deep-research pipeline; the most starred, most steadily-released framework in this category. Note: maintainer also co-founded Tavily, the default (commercial) search retriever — disclose when citing "best default" claims. (partial vendor self-interest — maintainer's own search product is the default backend)

- **Stanford STORM** — https://github.com/stanford-oval/storm — Latest release v1.1.0 (Jan 23, 2025); last commit Sept 30, 2025; 30.1k stars, 2.8k forks. [primary]. Academic (Stanford OVAL) implementation of the perspective-driven, outline-then-write pipeline from the STORM/Co-STORM papers; **no 2026 commits found — activity has clearly slowed**, treat as a stable reference implementation rather than an actively maintained product.

- **LangChain `open_deep_research`** — https://github.com/langchain-ai/open_deep_research — Active commits through July 17, 2026; star count conflicts across pages checked same-day (10.5k activity page vs. ~12k secondary aggregator vs. 7.3k releases page — flagged, not resolved). [primary] (vendor self-report — authored/promoted by LangChain). LangGraph-based graph-of-nodes research pipeline with plan-and-execute and supervisor-researcher variants; ranks on the DeepResearch Bench leaderboard (reported #6, RACE score cited inconsistently as 0.4943 and 0.4344 across sources — verify against live leaderboard).

- **LangChain `local-deep-researcher`** — https://github.com/langchain-ai/local-deep-researcher — ~9.3k stars, 154 commits on main (exact last-commit date not confirmed in this session). [primary] (vendor self-report). Fully local IterDRAG-style iterative research loop for Ollama/LM Studio, with a LangGraph Studio UI.

- **Hugging Face `smolagents` — Open Deep Research example** — https://github.com/huggingface/smolagents/tree/main/examples/open_deep_research — Example folder last touched Dec 17, 2025 (sparse commits since mid-2025); parent `smolagents` repo itself is more actively developed. [primary] (vendor self-report — Hugging Face). CodeAgent-based reproduction of OpenAI's Deep Research; hit #1 open submission on the GAIA leaderboard (55% pass@1) in Feb 2025. Best treated as a reference/proof-of-concept, not a maintained product.

- **local-deep-research** — https://github.com/LearningCircuit/local-deep-research — Latest release v1.9.3 (July 16, 2026); star counts vary by snapshot across sources checked (6.6k–8.7k), consistent with fast organic growth. [primary]. Community (non-corporate) project; 10+ search engines (arXiv, PubMed, Semantic Scholar, SearXNG, GitHub, Wayback Machine, Tavily, Google/SerpAPI), fully-local + encrypted-by-default design, self-reports ~95% SimpleQA and 77% xbench-DeepSearch (self-report, not independently audited here).

- **DeepResearch Bench** — https://github.com/Ayanami0730/deep_research_bench — 790 stars; last update May 11, 2026 (evaluator pipeline v2 / switch to GPT-5.5 judge). [primary]. 100 PhD-level research tasks across 22 fields, scored via the RACE metric (comprehensiveness/depth/instruction-following/readability vs. expert reference reports); DeepResearch Bench II released Feb 6, 2026. Used to rank both commercial (Kimi-Researcher, Claude-Researcher, Doubao-DeepResearch) and open frameworks (e.g., LangChain's open_deep_research).

- **GAIA Leaderboard (Hugging Face Space)** — https://huggingface.co/spaces/gaia-benchmark/leaderboard — [primary]. Live leaderboard for the GAIA benchmark (see paper below); used by both HF's Open Deep Research and other agent frameworks to report open-source standing against closed systems.

- **AutoGPT** — https://github.com/significant-gravitas/autogpt — 183k+ stars (most-starred general agent repo); v0.6.59 released May 2026, commits through June 19, 2026. [secondary/primary mixed — star/commit figures from secondary aggregator, cross-check directly on GitHub before quoting]. General autonomous-agent platform, not deep-research-specific; the field has moved to dedicated frameworks (above) for research-report use cases specifically. The community "AutoGPT-local" fork was reported broken against modern Ollama/Python 3.11 as of May 2026.

- **CAMEL-AI / OWL** — https://github.com/camel-ai/camel and https://github.com/camel-ai/owl — [primary]. Multi-agent "workforce" framework (role assignment, task delegation, RAG pipelines); general multi-agent infrastructure, not purpose-built for long-form cited research reports, but usable as a substrate for one.

- **Perplexica (rebranded "Vane")** — https://github.com/ItzCrazyKns/Perplexica — 35.7k stars, 3.9k forks, latest release v1.12.2 (April 10, 2026), ~1,008 commits. [primary]. Open-source Perplexity-style cited-answer search engine (SearXNG-backed, Ollama-capable for full local operation); adjacent to this category — it's an interactive answer engine, not a long-form multi-section report pipeline, but frequently grouped with deep-research tools in comparisons.

- **Dify** — https://github.com/langgenius/dify — 149k stars, commits through July 17, 2026 (v1.16.0), 23.5k forks, 11,785+ commits on main. [primary]; note commercial backing — $30M Series Pre-A closed March 2026 (vendor self-report risk on any "production adoption" numbers Dify publishes about itself). General low-code agent/workflow/RAG platform; can host a self-built research flow but is not purpose-built for deep research specifically.

## Papers

- **"Assisting in Writing Wikipedia-like Articles From Scratch with Large Language Models" (STORM)** — https://arxiv.org/abs/2402.14207 — Submitted Feb 22, 2024, accepted NAACL 2024. Authors: Shao, Jiang, Kanell, Xu, Khattab, Lam (Stanford). [primary]. Introduces the perspective-guided-question-asking + outline-then-write pipeline and the FreshWiki evaluation dataset; reports 70% of surveyed Wikipedia editors found the pre-writing stage useful.

- **"Into the Unknown Unknowns: Engaged Human Learning through Participation in Language Model Agent Conversations" (Co-STORM)** — https://arxiv.org/abs/2408.15232 — Submitted Aug 27, 2024, accepted EMNLP 2024. Authors: Jiang, Shao, Ma, Semnani, Lam (Stanford). [primary]. Introduces the collaborative human+multi-agent discourse extension with a dynamic mind map; reports 70% of participants preferred Co-STORM over a search engine and 78% over a RAG chatbot.

- **"GAIA: a benchmark for General AI Assistants"** — https://arxiv.org/abs/2311.12983 — Submitted Nov 21, 2023. Authors: Mialon, Fourrier, Swift, Wolf, LeCun, Scialom. [primary]. The benchmark most open-source research-agent frameworks (Hugging Face's Open Deep Research, others) self-report against; notes humans score ~92% vs. GPT-4's ~15% on the same question set, illustrating the difficulty gap the benchmark targets.

## Articles

- **"Open-source DeepResearch – Freeing our search agents"** (Hugging Face blog) — https://huggingface.co/blog/open-deep-research — Published Feb 4, 2025. [primary] (vendor self-report — Hugging Face promoting its own smolagents-based reproduction). Reports 55.15% on GAIA validation (vs. ~67% for OpenAI's Deep Research at the time), and that CodeAgent-style actions cut step count ~30% vs. JSON tool-calling, directly reducing per-report cost.

- **STORM Stanford Review 2026** — https://www.buildfastwithai.com/ai-tools/storm-stanford — [secondary]. Third-party 2026 review/walkthrough of the STORM project; useful for a non-Stanford framing of the pipeline and use cases, but treat feature/performance claims as secondary until cross-checked against the repo/paper.

- **"Running the STORM AI research system with your local documents"** (Towards Data Science) — https://towardsdatascience.com/running-the-storm-ai-research-system-with-your-local-documents-e413ea2ae064/ — [secondary]. Practical local-documents setup walkthrough for STORM, useful for the getting-going path beyond the default web-retrieval configuration.

- **"The best open source frameworks for building AI agents in 2026"** (Firecrawl blog) — https://www.firecrawl.dev/blog/best-open-source-agent-frameworks — [secondary] (partial vendor self-report — Firecrawl is a commercial web-scraping/search API that competes with/complements tools like Tavily; treat framework rankings as advertising-adjacent). General 2026 landscape survey covering CAMEL, Dify, and others; used here only to corroborate general framework existence/positioning, not for hard numbers.

- **"Dify Review — Open-Source AI Workflow Platform"** (ChatForest) — https://chatforest.com/reviews/dify-open-source-ai-workflow-agent-platform-review/ — [secondary]. Independent review corroborating Dify's ~131k–149k star range (snapshot-dependent), MCP bidirectional support, and March 2026 funding round; cross-checked against direct GitHub fetch for star count in this report.

- **"Self-Host Perplexica: Open Source Perplexity 2026"** (OSSAlt guides) — https://ossalt.com/guides/self-host-perplexica-open-source-perplexity-2026 — [secondary]. Setup guide corroborating Perplexica's continued maintenance and local-LLM (Ollama) support as of 2026; star count in this article (33k) is close to but not identical with the 35.7k observed via direct GitHub fetch in this session — minor snapshot-timing discrepancy, not a material conflict.

## Videos

No video sources were located and verified in this research session. If a video walkthrough is needed for the getting-going guide (e.g., a GPT Researcher or local-deep-research setup screencast), it should be sourced and verified separately rather than assumed here.
