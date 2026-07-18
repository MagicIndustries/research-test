# Approach 4: Open-Source Research Frameworks

> Self-hosted frameworks that reproduce the deep-research loop with your own model and search keys. Permissively licensed across the board.
>
> Architecturally diverse — from 500-line recursive loops to full LangGraph supervisor pipelines — with one quantified quality gap versus hosted products.

**Confidence: High** for repo facts (all metadata observed live via GitHub API on 2026-07-18) and architectures (primary READMEs/papers/blogs); **Medium** for maturity judgments — stars measure attention, not quality (see counter-claims).

## The landscape at a glance (observed 2026-07-18)

| Framework | Stars | License | Last push | Architecture |
|---|---|---|---|---|
| bytedance/deer-flow [18] | 77,320 | MIT | 2026-07-18 | ⚠ 2.0 is a general agent harness; deep research lives on legacy `main-1.x` [27] |
| STORM (stanford-oval) [19] | 30,136 | MIT | 2025-09-30 (dormant) | Two-stage: perspective-guided pre-writing → cited article writing [24] |
| smolagents (HF) [20] | 28,419 | Apache-2.0 | 2026-07-14 | Library; open Deep Research is an example dir [26] |
| GPT Researcher [16] | 28,379 | Apache-2.0 | 2026-07-18 | Planner → parallel execution agents → publisher [28] |
| Tongyi DeepResearch (Alibaba) [23] | 19,678 | Apache-2.0 | 2026-02-27 | Purpose-trained open deep-research **model** (not just orchestration) |
| dzhng/deep-research [21] | 19,373 | MIT | 2026-04-11 | ~500-line recursive breadth/depth loop |
| open_deep_research (LangChain) [17] | 12,033 | MIT | 2026-07-17 | LangGraph Scope → Research (supervisor + parallel subagents) → Write [25] |
| node-DeepResearch (Jina) [22] | 5,196 | Apache-2.0 | 2026-05-01 | Single-agent search-read-reason loop until answer or token budget |

## How the main architectures work

**GPT Researcher** — the most actively maintained "classic" deep-research agent: a planner agent generates research questions, parallel crawler/execution agents gather per-question evidence, and a publisher aggregates the report [16][28].

It is model-provider-agnostic, installs via pip/Docker/Colab, and is now also installable as a Claude Skill [28].

**LangChain Open Deep Research** — the reference orchestrated pipeline: supervisor delegation into parallel context-isolated subagents, each ending with a citation-writing clean-up call [17][25].

See `../multi-agent-pipelines/README.md` for the architecture in depth. LangChain self-reported #6 / 0.4344 on Deep Research Bench (2025-08) [25].

**STORM (Stanford)** — the academic entry (NAACL 2024) [24].

Its pre-writing stage does perspective-guided question asking through a simulated conversation between a Wikipedia-writer agent and a topic expert, producing an outline plus references [24].

The writing stage then generates the cited article [24].

It ships as pip-installable `knowledge-storm` with litellm model-agnosticism and pluggable retrievers (You.com, Bing, or VectorRM over your own documents) [29].

Effectively a completed research artifact — last push 2025-09-30 [19].

**Hugging Face open Deep Research** — not a standalone framework but an example inside smolagents: a CodeAgent-based replication of OpenAI Deep Research [20][26].

It scores **55% pass@1 on GAIA validation vs 67% for OpenAI's original** — the only quantified open-vs-hosted gap found [26].

**Minimalist loops** — dzhng/deep-research deliberately stays under ~500 lines of TypeScript [21].

User-set breadth/depth parameters drive a recursive loop that generates SERP queries, extracts "learnings" and follow-up directions, and emits a Markdown report [21].

Jina's node-DeepResearch runs a single search-read-reason loop "until it finds the answer or exceeds the token budget" [22].

These are the best pedagogical reading for understanding the core loop.

**Tongyi DeepResearch (Alibaba)** — notable as the odd one out: it centers on a purpose-trained open deep-research *model* rather than orchestrating third-party LLMs [23].

**DeerFlow (ByteDance)** — carries the biggest caveat. DeerFlow 2.0 (Feb 2026, #1 on GitHub Trending 2026-02-28) is a ground-up rewrite repositioned as a general "super agent harness" [27][18].

The rewrite covers subagents, sandboxes, memory, skills, IM channels, and Claude Code integration; the original LangGraph deep-research framework survives only on the `main-1.x` branch [27].

Its 77K stars should **not** be credited to the deep-research category [27][18].

## Getting going

Common pattern across all frameworks: supply at least one LLM API key **plus** a web-search provider key (SerpAPI/Serper/Tavily/etc.) [28][25][26][29].

That extra search key is the main friction versus hosted products, where search and model come bundled.

- **GPT Researcher**: `pip install` (or Docker/Colab), set LLM + search keys, run; also installable as a Claude Skill [28].
- **Open Deep Research**: clone, `uv` sync, `.env` with model/search keys, local LangGraph server + Studio UI [25].
- **STORM**: `pip install knowledge-storm`, pick LLM via litellm and a retriever (You.com/Bing/VectorRM) [29].
- **dzhng/deep-research**: clone the TypeScript repo, set keys, choose breadth/depth — smallest surface to modify [21].
- **smolagents example**: clone smolagents, install example requirements, SerpAPI/Serper key + model key (default was o1, gated at OpenAI tier 3) [26].
- **DeerFlow for deep research specifically**: use branch `main-1.x`, not 2.0 [27].

## Trade-offs vs hosted products

| Dimension | Assessment |
|---|---|
| Quality | Apparently behind hosted on the one available comparison (GAIA 55 vs 67, early-2025 era — but each number is self-reported by its own vendor under non-identical conditions) [26]; no 2026 head-to-head exists (gap) |
| Cost | Pay-per-token + search API fees; no subscription; cost fully controllable |
| Transparency | Full — you can read and modify every prompt and graph node; ideal for a skill-comparison harness |
| Reproducibility | Strong — pin versions and models in git; hosted pipelines change under you |
| Effort | Real setup and maintenance burden: keys, infra, breakage on provider API changes |

## Gaps and counter-claims

- No current (2026) benchmark compares these frameworks head-to-head; the only cross-system numbers found are HF's GAIA 55-vs-67 (early 2025) and LangChain's self-reported Deep Research Bench placement (2025-08) [26][25].
- Counter-claim (adopted in this report): headline star counts materially misdescribe the category — DeerFlow 2.0 is no longer a deep-research framework, and smolagents' stars measure an agent library, not its research example [27][18][20][26].
- Secondary/journalistic coverage was largely inaccessible this session (search engines bot-walled); findings lean almost entirely on primary GitHub/arXiv/vendor-blog sources — a robustness feature for facts, but community-sentiment evidence is missing.

## References

[16] GitHub API — assafelovic/gpt-researcher — https://api.github.com/repos/assafelovic/gpt-researcher (official metadata)
[17] GitHub API — langchain-ai/open_deep_research — https://api.github.com/repos/langchain-ai/open_deep_research (official metadata)
[18] GitHub API — bytedance/deer-flow — https://api.github.com/repos/bytedance/deer-flow (official metadata)
[19] GitHub API — stanford-oval/storm — https://api.github.com/repos/stanford-oval/storm (official metadata)
[20] GitHub API — huggingface/smolagents — https://api.github.com/repos/huggingface/smolagents (official metadata)
[21] GitHub API — dzhng/deep-research — https://api.github.com/repos/dzhng/deep-research (official metadata)
[22] GitHub API — jina-ai/node-DeepResearch — https://api.github.com/repos/jina-ai/node-DeepResearch (official metadata)
[23] GitHub API — Alibaba-NLP/DeepResearch — https://api.github.com/repos/Alibaba-NLP/DeepResearch (official metadata)
[24] STORM paper (NAACL 2024) — http://arxiv.org/abs/2402.14207v2 (academic)
[25] LangChain blog — Open Deep Research — https://blog.langchain.com/open-deep-research/ (official; vendor self-reporting)
[26] smolagents open_deep_research README — https://raw.githubusercontent.com/huggingface/smolagents/main/examples/open_deep_research/README.md (official)
[27] DeerFlow 2.0 README — https://raw.githubusercontent.com/bytedance/deer-flow/main/README.md (official)
[28] GPT Researcher README — https://raw.githubusercontent.com/assafelovic/gpt-researcher/master/README.md (official)
[29] STORM README — https://raw.githubusercontent.com/stanford-oval/storm/main/README.md (official)
