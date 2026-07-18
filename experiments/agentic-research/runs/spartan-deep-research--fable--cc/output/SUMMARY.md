# Agentic Deep Research: State of the Art (July 2026)

Research date: 2026-07-18. All sources checked live on that date. Primary sources cited for load-bearing claims; secondary sources and vendor self-reporting labeled as such.

## TL;DR

Deep research — an agent that plans, searches, reads dozens-to-hundreds of sources, and writes a cited report — has gone from one OpenAI product (Feb 2025) to a crowded field of commercial products, open-source frameworks, RL-trained open models, and portable "skills," all converging on the same recipe: scope the question, decompose it, run parallel search workers with isolated contexts, compress findings, synthesize with a single writer, and self-critique. Independent evaluations say even the best systems satisfy fewer than half of expert-derived quality rubrics ([DeepResearch Bench II, Jan 2026](https://arxiv.org/abs/2601.08536)), so evaluation discipline — rubric-based LLM-as-judge with bias controls plus citation verification — is now as much a differentiator as the agent itself. For a solo Claude Code developer with a skill-comparison harness, the highest-leverage move is not adopting a framework but porting the shared methodological ingredients into versioned skills and measuring them against a commercial-API baseline.

## Definitions

- **Deep research**: an agentic AI workflow that takes a research question, autonomously plans, performs multi-hop web retrieval and iterative tool use over an extended horizon, and produces a structured, cited analytical report ([Deep Research Agents: A Systematic Examination and Roadmap, arXiv:2506.18096, Jun 2025](https://arxiv.org/abs/2506.18096)). A competing formal definition argues the essence is "high fan-out over concepts required during the search process," not report length ([Characterizing Deep Research, arXiv:2508.04183, Aug 2025](https://arxiv.org/abs/2508.04183)).
- **Research agent / deep research agent (DRA)**: an LLM system combining dynamic reasoning, adaptive long-horizon planning, multi-hop retrieval, and iterative tool use to execute that workflow ([arXiv:2506.18096](https://arxiv.org/abs/2506.18096)).
- **Orchestrator–worker (lead agent–subagent)**: a multi-agent pattern in which a lead agent analyzes the query, plans, and spawns specialized subagents that search in parallel with isolated context windows, then synthesizes their results ([Anthropic engineering blog, 13 Jun 2025](https://www.anthropic.com/engineering/multi-agent-research-system)).
- **LLM-as-judge**: using an LLM to score another model's output against criteria or rubrics instead of (or alongside) human raters; standard for grading research reports, but subject to position, verbosity, and self-preference biases ([Justice or Prejudice?, arXiv:2410.02736](https://arxiv.org/html/2410.02736v1); [Self-Preference Bias in LLM-as-a-Judge, arXiv:2410.21819](https://arxiv.org/pdf/2410.21819)).

## Background: where deep research came from

The ancestry runs through tool-augmented QA — OpenAI's WebGPT trained a model to browse and cite ([arXiv:2112.09332](https://arxiv.org/abs/2112.09332), Dec 2021) — and the ReAct pattern interleaving reasoning with tool actions ([arXiv:2210.03629](https://arxiv.org/abs/2210.03629), Oct 2022). Autonomous-agent hype (AutoGPT, 2023) produced the first report-writing agent that survived: GPT Researcher (mid-2023, still the most-starred open research agent). Stanford's STORM (Feb 2024) contributed the outline-first, perspective-guided question-asking method for long-form cited articles ([arXiv:2402.14207](https://arxiv.org/pdf/2402.14207); [stanford-oval/storm](https://github.com/stanford-oval/storm)).

The product category crystallized in a five-month window:

| Date | Event | Source |
|---|---|---|
| 11 Dec 2024 | Google ships Gemini Deep Research (plan → browse → report, editable plan) | [Google blog](https://blog.google/products/gemini/google-gemini-deep-research/) (primary) |
| Early Feb 2025 | OpenAI Deep Research: o3-based, end-to-end RL-trained browsing; 26.6% on Humanity's Last Exam | [OpenAI announcement](https://openai.com/index/introducing-deep-research/) (primary, access-restricted); [Fortune, 12 Feb 2025](https://fortune.com/2025/02/12/openai-deepresearch-humanity-last-exam/) (secondary) |
| 4 Feb 2025 | Hugging Face open replication hits 55.15% GAIA (vs OpenAI's self-reported 67.36%) | [HF blog](https://huggingface.co/blog/open-deep-research) (primary) |
| 14 Feb 2025 | Perplexity Deep Research, free tier, 2–4 min runs | [TechCrunch](https://techcrunch.com/2025/02/15/perplexity-launches-its-own-freemium-deep-research-product/) (secondary); [Perplexity blog](https://www.perplexity.ai/hub/blog/introducing-perplexity-deep-research) (primary, access-restricted) |
| 13 Jun 2025 | Anthropic publishes the orchestrator–worker engineering account behind Claude's Research feature | [Anthropic engineering](https://www.anthropic.com/engineering/multi-agent-research-system) (primary) |
| Jun 2025 | OpenAI exposes `o3-deep-research` / `o4-mini-deep-research` in the API with webhooks | [OpenAI API docs](https://developers.openai.com/api/docs/guides/deep-research) (primary) |
| 17 Sep 2025 | Alibaba open-sources Tongyi DeepResearch (30B MoE, RL-trained) | [Alibaba-NLP/DeepResearch](https://github.com/Alibaba-NLP/DeepResearch) (primary) |
| Oct–Dec 2025 | Anthropic launches Agent Skills (SKILL.md); reported adoption as an open standard by ~40 clients | [Anthropic engineering](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills) (primary); adoption breadth per [ClaudeWorld](https://claude-world.com/articles/anthropic-official-skills-complete-guide/) (secondary, unverified) |
| 11 Dec 2025 | Gemini 3 Pro Deep Research + Interactions API, same day as OpenAI GPT-5.2 | [TechCrunch](https://techcrunch.com/2025/12/11/google-launched-its-deepest-ai-research-agent-yet-on-the-same-day-openai-dropped-gpt-5-2/) (secondary) |
| Jan–Jul 2026 | Evaluation wave: DeepResearch Bench II (Jan), FutureSearch cost/accuracy Pareto (Feb), Perplexity DRACO (Jul) | [arXiv:2601.08536](https://arxiv.org/abs/2601.08536); [FutureSearch](https://futuresearch.ai/blog/cost-of-deep-research/); [DRACO](https://research.perplexity.ai/articles/evaluating-deep-research-performance-in-the-wild-with-the-draco-benchmark) |

Surveys now track 80+ implementations since 2023 ([arXiv:2506.12594](https://arxiv.org/abs/2506.12594)) and a curated field list is maintained at [ai-agents-2030/awesome-deep-research-agent](https://github.com/ai-agents-2030/awesome-deep-research-agent).

## Key Findings

1. **Two paradigms dominate: trained agents vs orchestrated scaffolds.** OpenAI and Tongyi train models end-to-end (RL) to browse and research; Anthropic, LangChain, and GPT Researcher orchestrate general models with prompts and structure. The scaffold path is reproducible in a git repo; the trained path is not, but sets top benchmark scores ([arXiv:2506.18096](https://arxiv.org/abs/2506.18096); [Anthropic](https://www.anthropic.com/engineering/multi-agent-research-system); [Alibaba-NLP/DeepResearch](https://github.com/Alibaba-NLP/DeepResearch)).
2. **Orchestrator–worker with parallel subagents is the proven scaffold.** Anthropic measured a 90.2% improvement over single-agent Claude Opus 4 on breadth-first research queries — at ~15× the token cost of chat ([Anthropic, primary](https://www.anthropic.com/engineering/multi-agent-research-system)).
3. **Parallel writing fails; parallel research works.** LangChain found subagents writing report sections in parallel produced disjoint reports; the fix is parallel research followed by a single one-shot writer over all compressed findings ([LangChain blog, primary](https://www.langchain.com/blog/open-deep-research)).
4. **Quality is far from expert level.** Best models satisfy <50% of 9,430 expert-derived binary rubrics ([DeepResearch Bench II](https://arxiv.org/abs/2601.08536)); the top agent on FutureSearch's human-verified 89-task bench scored 0.51/1.0 ([arXiv:2506.06287](https://arxiv.org/abs/2506.06287)); LiveDRBench F1 ranges 0.02–0.72 by sub-category ([arXiv:2508.04183](https://arxiv.org/abs/2508.04183)).
5. **Cost has collapsed.** FutureSearch measured $0.05–$0.55 per deep-research task across 20+ agent configurations (Feb 2026, updated Mar 2026), with most under $1.00 ([FutureSearch, primary](https://futuresearch.ai/blog/cost-of-deep-research/)). Perplexity's `sonar-deep-research` API runs roughly $0.40–$1+ per call ([docs.perplexity.ai, primary/vendor](https://docs.perplexity.ai/docs/sonar/models/sonar-deep-research)).
6. **Benchmark claims are a vendor arms race.** Google, OpenAI, and Perplexity each claim leadership on benchmarks they created or ran themselves (DeepSearchQA, GPT-5.2 launch claims, DRACO — where Perplexity tops all ten domains of its own benchmark built from its own production queries). All are vendor self-reporting; no independent 2026 head-to-head of the flagship products exists ([TechCrunch](https://techcrunch.com/2025/12/11/google-launched-its-deepest-ai-research-agent-yet-on-the-same-day-openai-dropped-gpt-5-2/); [DRACO](https://research.perplexity.ai/articles/evaluating-deep-research-performance-in-the-wild-with-the-draco-benchmark)).
7. **Evaluation moved from holistic scores to atomic rubrics.** DeepResearch Bench's RACE/FACT (LLM-judged dimensions + citation-support checking, [arXiv:2506.11763](https://arxiv.org/pdf/2506.11763)) gave way to expert-derived binary rubrics with heavy human review (DRB II: 400+ human-hours; DRACO: ~45% of rubrics revised by experts). Rubric-anchored binary judgments are the current best practice.
8. **Skills made research methods portable.** Anthropic's Agent Skills (a SKILL.md directory with progressive disclosure) turned research pipelines into versionable text artifacts; community deep-research skills with multi-phase pipelines, source-credibility scoring, and critique loops now exist, though none has independent benchmark evidence ([Anthropic](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills); [199-biotechnologies skill](https://github.com/199-biotechnologies/claude-deep-research-skill)).

## Analysis: what the best systems share

Across Anthropic's production system, Google's product, LangChain's framework, GPT Researcher, STORM, and the strongest community skills, the same ingredients recur. This is the checklist worth porting anywhere:

1. **Explicit scoping before research.** Gemini shows an editable plan ([Google](https://blog.google/products/gemini/google-gemini-deep-research/)); OpenAI's API docs recommend a clarifier + prompt-rewriting stage before the research model, because "the model expects fully-formed prompts up front" ([OpenAI docs](https://developers.openai.com/api/docs/guides/deep-research)); LangChain compresses chat history into a research brief ([LangChain](https://www.langchain.com/blog/open-deep-research)).
2. **Decomposition with explicit delegation.** Anthropic's biggest prompt-engineering lever was teaching the orchestrator to write detailed subagent task descriptions and scale effort to query complexity ([Anthropic](https://www.anthropic.com/engineering/multi-agent-research-system)).
3. **Parallel search with isolated contexts** — subagents as "intelligent filters" that return distilled findings, not raw pages (Anthropic; LangChain supervisor; GPT Researcher's planner/execution split, [gpt-researcher](https://github.com/assafelovic/gpt-researcher)).
4. **Iterative loops with a depth/breadth budget.** dzhng's ~500-line agent reduces the whole field to two knobs — breadth (queries per round) and depth (recursive rounds) ([dzhng/deep-research](https://github.com/dzhng/deep-research)); GPT Researcher's Deep Research mode does tree-shaped recursion.
5. **Broad-to-narrow search strategy** — start with short general queries, then progressively narrow (Anthropic, explicit prompt principle).
6. **Context engineering / compression** — summarize and compress at every hop; Gemini pairs a 1M-token window with RAG over session findings ([gemini.google overview](https://gemini.google/overview/deep-research/), vendor).
7. **Source tracking as a first-class object** — GPT Researcher's per-resource source-tracking, citation managers in skills, FACT-style statement–URL support checking at eval time.
8. **Single-writer synthesis** over all findings (LangChain's hard-won lesson), followed by **self-critique passes** (Gemini's "multiple passes of self-critique," vendor; critique-with-loop-back phases in community skills).
9. **Evaluation-driven iteration** — Anthropic used an LLM judge with a rubric (factual accuracy, citation accuracy, completeness, source quality, tool efficiency) plus human review, and found Claude effective at diagnosing and rewriting its own failing prompts ([Anthropic](https://www.anthropic.com/engineering/multi-agent-research-system)).
10. **Model quality beats budget** — "upgrading to Claude Sonnet 4 is a larger performance gain than doubling the token budget on Claude Sonnet 3.7" (Anthropic). Spend on the model before spending on tokens.

**What the evaluation literature says about judging research.** Three lessons. First, anchor judges in rubrics: binary, atomic, verifiable criteria (roughly half about factual accuracy in DRACO) make LLM-as-judge reliable enough that relative rankings hold across judge models even when absolute scores differ ([DRACO](https://research.perplexity.ai/articles/evaluating-deep-research-performance-in-the-wild-with-the-draco-benchmark), vendor). Second, control the known judge biases — position bias (verdicts flip when answer order swaps), verbosity bias (longer preferred >90% of the time in early studies), and self-preference — via order-swapping, length penalties, and cross-family judges; they can be reduced, not eliminated ([arXiv:2410.02736](https://arxiv.org/html/2410.02736v1); [arXiv:2410.21819](https://arxiv.org/pdf/2410.21819); [MT-Bench, arXiv:2306.05685](https://arxiv.org/abs/2306.05685)). Third, verify citations mechanically: FACT extracts statement–URL pairs and checks support ([arXiv:2506.11763](https://arxiv.org/pdf/2506.11763)); FutureSearch freezes the web (RetroSearch, 189k+ archived pages) so scores stay comparable over time ([arXiv:2506.06287](https://arxiv.org/abs/2506.06287)).

**Disagreements worth noting.** The field does not agree on what deep research *is* (long-horizon report generation per arXiv:2506.18096 vs high fan-out claim discovery per arXiv:2508.04183), nor on whether multi-agent beats single-agent in general — Anthropic's 90.2% held for breadth-first queries specifically, and LangChain notes users don't want 10-minute runs for simple questions. Architecture should scale with the question, not be fixed.

## What I could not find

- **Any independent, current head-to-head of the 2026 flagship products** (Gemini 3.x Deep Research vs GPT-5.2-era Deep Research vs Perplexity). Every cross-product comparison found was run by one of the vendors.
- **Internal architectures of OpenAI's and Perplexity's products** — both are proprietary; only Anthropic and Google have published meaningful engineering detail, and Google's is partial.
- **Controlled evidence for community skill quality.** The 199-biotechnologies skill claims to outperform OpenAI/Gemini "in quality and verification" with no published benchmark; I found no third-party evaluation of any Claude Code research skill.
- **Ablation data on how much the scoping/clarification step improves final report quality** — universally recommended, nowhere quantified.
- **A trustworthy primary source for Google's reported April 2026 "Deep Research Max"** — only low-credibility outlets carried it; treated as unconfirmed and excluded from findings.

## Recommended steps: solo developer, Claude Code daily, skill-comparison harness in git

1. **Keep two skill variants under test.** A single-context baseline skill (cheap, fast, fine for most questions) and an orchestrated variant that has the lead context spawn 3–5 parallel research subagents with written task briefs and a single-writer synthesis. The public evidence (90.2% on breadth-first tasks, 15× tokens) predicts the orchestrated one wins only on wide questions — your harness can verify on your own task mix.
2. **Port the ten shared ingredients into the skill text** (scope brief; delegation with explicit boundaries; broad-to-narrow; depth/breadth budget; compression to files as external memory; source ledger with URL + date + quality tier; single-writer synthesis; critique pass with loop-back; "couldn't find" section; effort scaling rules). These are prompt-level changes — free to try, easy to diff in git.
3. **Steal prompts, not frameworks.** The prompts in [langchain-ai/open_deep_research](https://github.com/langchain-ai/open_deep_research) (supervisor/compression/writer), [gpt-researcher](https://github.com/assafelovic/gpt-researcher) (planner questions, report formats), and [dzhng/deep-research](https://github.com/dzhng/deep-research) (learning-extraction loop) are MIT/Apache-licensed and port directly into SKILL.md files; running the Python/TS frameworks adds infrastructure you don't need inside Claude Code.
4. **Make the harness's judge rubric-based and bias-controlled.** Per-task binary rubrics (majority weighted toward factual accuracy), blind order-swapped pairwise judging, a judge from a different model family when possible, and a mechanical citation spot-check (fetch N cited URLs, verify each supports its claim — a mini-FACT). Track tokens, wall-clock, and cost per run to build your own Pareto view like FutureSearch's.
5. **Add one commercial API baseline as calibration** — `sonar-deep-research` (cheapest, ~$0.40+/call) or `o4-mini-deep-research` in background mode — so skill scores mean something in absolute terms.
6. **Close the loop with self-improvement.** Feed failing transcripts back to Claude and ask it to diagnose and rewrite the skill (Anthropic found Claude 4-class models are effective prompt engineers for their own failures). Commit each rewrite as a harness experiment.
7. **Re-run the eval set periodically** — the web moves; a fixed task set with stable expected findings is your poor-man's RetroSearch.

## Open Questions

- Does RL-trained browsing (OpenAI, Tongyi) keep its lead over prompt-orchestrated scaffolds as frontier base models improve, or does the gap close for free?
- Can rubric-based LLM judging scale down to a solo developer's 10-task eval set without expert rubric-writing hours, and remain discriminative?
- Where is the cost/quality knee for subagent count? No published ablation.
- Will the Agent Skills standard become the durable distribution format for research methods, or be superseded by hosted deep-research APIs with MCP data access?

## Approach directories

- [01-single-prompt-skills/](01-single-prompt-skills/README.md) — SKILL.md-style research pipelines in one context
- [02-orchestrated-multi-agent/](02-orchestrated-multi-agent/README.md) — orchestrator–worker systems
- [03-commercial-products/](03-commercial-products/README.md) — OpenAI, Google, Perplexity
- [04-open-source-frameworks/](04-open-source-frameworks/README.md) — GPT Researcher, LangChain ODR, dzhng, STORM, smolagents, Tongyi

## Sources

Master list with dates and type labels; per-source annotations live in each approach's `resources.md`.

- [Anthropic: How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system) — 2025-06-13 — primary (vendor engineering)
- [Anthropic: Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills) — 2025 — primary (vendor)
- [OpenAI: Introducing deep research](https://openai.com/index/introducing-deep-research/) — 2025-02 — primary (vendor; direct fetch blocked, figures cross-checked via Fortune/TechRadar)
- [OpenAI: Deep research API guide](https://developers.openai.com/api/docs/guides/deep-research) — current 2026 — primary (vendor docs)
- [OpenAI: BrowseComp](https://openai.com/index/browsecomp/) — 2025-04 — primary (vendor)
- [Google: Try Deep Research in Gemini](https://blog.google/products/gemini/google-gemini-deep-research/) — 2024-12-11 — primary (vendor)
- [Gemini Deep Research overview](https://gemini.google/overview/deep-research/) — current 2026 — primary (vendor marketing)
- [Gemini API: Deep Research agent docs](https://ai.google.dev/gemini-api/docs/interactions/deep-research) — current 2026 — primary (vendor docs)
- [TechCrunch: Google's deepest research agent / GPT-5.2 day](https://techcrunch.com/2025/12/11/google-launched-its-deepest-ai-research-agent-yet-on-the-same-day-openai-dropped-gpt-5-2/) — 2025-12-11 — secondary
- [TechCrunch: Perplexity freemium deep research](https://techcrunch.com/2025/02/15/perplexity-launches-its-own-freemium-deep-research-product/) — 2025-02-15 — secondary
- [Fortune: OpenAI deep research and HLE](https://fortune.com/2025/02/12/openai-deepresearch-humanity-last-exam/) — 2025-02-12 — secondary
- [Perplexity: Introducing Deep Research](https://www.perplexity.ai/hub/blog/introducing-perplexity-deep-research) — 2025-02-14 — primary (vendor; direct fetch blocked)
- [Perplexity: DRACO benchmark](https://research.perplexity.ai/articles/evaluating-deep-research-performance-in-the-wild-with-the-draco-benchmark) — 2026-07-17 — primary (vendor self-reporting)
- [Perplexity docs: sonar-deep-research](https://docs.perplexity.ai/docs/sonar/models/sonar-deep-research) — current 2026 — primary (vendor docs)
- [Hugging Face: Open-source DeepResearch](https://huggingface.co/blog/open-deep-research) — 2025-02-04 — primary
- [LangChain blog: Open Deep Research](https://www.langchain.com/blog/open-deep-research) — 2025 — primary (vendor engineering)
- [langchain-ai/open_deep_research](https://github.com/langchain-ai/open_deep_research) — active 2025–2026 — primary (repo)
- [assafelovic/gpt-researcher](https://github.com/assafelovic/gpt-researcher) — v3.5.1, 2026-06-23 — primary (repo)
- [dzhng/deep-research](https://github.com/dzhng/deep-research) — current 2026 — primary (repo)
- [stanford-oval/storm](https://github.com/stanford-oval/storm) + [arXiv:2402.14207](https://arxiv.org/pdf/2402.14207) — 2024 — primary
- [Alibaba-NLP/DeepResearch](https://github.com/Alibaba-NLP/DeepResearch) — 2025-09-17 — primary (repo; benchmark claims vendor self-reported)
- [arXiv:2506.18096 — Deep Research Agents: Systematic Examination and Roadmap](https://arxiv.org/abs/2506.18096) — 2025-06 (rev 2025-09) — primary (academic survey)
- [arXiv:2506.12594 — Comprehensive Survey of Deep Research](https://arxiv.org/abs/2506.12594) — 2025-06-14 — primary (academic survey)
- [arXiv:2508.12752 — Deep Research: A Survey of Autonomous Research Agents](https://arxiv.org/html/2508.12752v1) — 2025-08 — primary (academic survey)
- [arXiv:2506.11763 — DeepResearch Bench (RACE/FACT)](https://arxiv.org/pdf/2506.11763) — 2025-06 — primary
- [arXiv:2601.08536 — DeepResearch Bench II](https://arxiv.org/abs/2601.08536) — 2026-01-13 — primary
- [arXiv:2506.06287 — Deep Research Bench (FutureSearch)](https://arxiv.org/abs/2506.06287) — 2025-06 — primary
- [FutureSearch: How much does deep research cost?](https://futuresearch.ai/blog/cost-of-deep-research/) — 2026-02-12 (upd. 2026-03-30) — primary
- [arXiv:2508.04183 — Characterizing Deep Research / LiveDRBench](https://arxiv.org/abs/2508.04183) — 2025-08-06 — primary
- [arXiv:2410.02736 — Justice or Prejudice? Quantifying Biases in LLM-as-a-Judge](https://arxiv.org/html/2410.02736v1) — 2024-10 — primary
- [arXiv:2410.21819 — Self-Preference Bias in LLM-as-a-Judge](https://arxiv.org/pdf/2410.21819) — 2024-10 — primary
- [arXiv:2306.05685 — Judging LLM-as-a-Judge (MT-Bench)](https://arxiv.org/abs/2306.05685) — 2023-06 — primary
- [OpenAI simple-evals (BrowseComp code)](https://github.com/openai/simple-evals) — primary (repo)
- [199-biotechnologies/claude-deep-research-skill](https://github.com/199-biotechnologies/claude-deep-research-skill) — last commit 2026-03-19 — primary (repo; performance claims unverified)
- [Weizhena/Deep-Research-skills](https://github.com/Weizhena/Deep-Research-skills) — 2025–2026 — primary (repo)
- [ai-agents-2030/awesome-deep-research-agent](https://github.com/ai-agents-2030/awesome-deep-research-agent) — maintained — primary (curated list)
