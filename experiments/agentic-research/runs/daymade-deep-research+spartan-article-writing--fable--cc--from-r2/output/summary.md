# The State of the Art in Agentic Deep Research (AS_OF 2026-07-18)

## TL;DR

**Deep research** — an agent that plans, browses, and synthesizes hundreds of sources into a cited report — went from a 2021 research paper (WebGPT) to a product category in about ten weeks across winter 2024–25: Google Dec 2024, OpenAI and Perplexity Feb 2025, Anthropic Apr 2025.

All four major approaches are now converging on the same recipe: **decompose the question under explicit effort-scaling rules, fan out parallel searches with isolated context windows, keep evidence in external files rather than the context window, run a dedicated citation-verification pass, and force a self-critique step** [7][25][34][36].

Commercial products lead on polish and headline benchmarks. But every performance number they publish is self-reported, and the one independent audit found deep-research agents hallucinate 3–13% of their citation URLs — *more* than plain search-augmented LLMs [14]. Open-source frameworks appear to trail (GAIA 55% vs 67% on the only quantified comparison — though each side of that number is self-reported by its own vendor under non-identical early-2025 conditions [26][8]) but are fully transparent and reproducible.

The evaluation literature's verdict: rubric-based LLM judging with per-task criteria (RACE/FACT-style) is the de-facto standard for scoring research reports, and it now exceeds a surprisingly low human agreement ceiling (68.78%). But judge identity changes rankings, so comparisons are only valid within a fixed judge [42][43][41].

If you work in Claude Code daily and already run a skill-comparison harness in git: you are one search-MCP server and one judging protocol away from a best-of-breed setup. The steps are in §8.

**Method disclosure:** this report was produced unattended (AFK) by the daymade-deep-research skill. Its interactive gates (mode selection, plan approval, clarifications) were auto-approved per harness instruction, and retrieval ran through a degraded-but-live path documented in `research-notes/execution-log.md`. Every URL cited was live-fetched during the run; no sources come from model memory.

---

## 1. Key terms

- **Deep research** — OpenAI's system card defines it as "a new agentic capability that conducts multi-step research on the internet for complex tasks" [6]. In practice: autonomous plan → browse → analyze → synthesize into a cited, report-length answer, over minutes-to-hours rather than seconds [8][5].
- **Research agent** — an LLM autonomously using tools (search, fetch, code) in a loop toward a research goal. Anthropic's working definition of agents is "LLMs autonomously using tools in a loop," with multi-agent systems being "multiple agents working together" [7].
- **Orchestrator–worker** — "a multi-agent architecture ... where a lead agent coordinates the process while delegating to specialized subagents that operate in parallel" [7]. Anthropic's Research feature, LangChain's Open Deep Research, and (by disclosure) most orchestrated pipelines follow it [7][25].
- **LLM-as-judge** — using a strong LLM to evaluate other models' open-ended outputs. Formalized by Zheng et al. (2023), who showed GPT-4 judges reach >80% agreement with human preferences — matching human–human agreement — while documenting position, verbosity, and self-enhancement biases [4].

## 2. Background: where deep research came from

The capability assembled in four documented steps, each with a primary source:

1. **Retrieval grounding (2020).** Lewis et al. defined RAG: generation backed by a retriever over an external corpus, instead of parametric memory alone [1].
2. **Live browsing with citations (2021).** OpenAI's WebGPT fine-tuned GPT-3 to answer long-form questions in a text-based browser *and made collecting supporting references mandatory*. Its best answers were preferred over human demonstrators' 56% of the time [2]. The two defining features of today's deep-research outputs — live web plus citations — are both here, three years before the product category.
3. **The agentic loop (2022).** ReAct interleaved reasoning traces with tool actions, reducing hallucination versus chain-of-thought alone — the template for every "search, read, think, search again" loop since [3].
4. **Productization (Dec 2024 – Apr 2025).** Google shipped the first "Deep Research" in Gemini Advanced on 2024-12-11: user-approvable research plan, 1M-token context, cited report [5]. OpenAI followed on 2025-02-02 with an o3 variant trained by reinforcement learning on browsing tasks — graded during training by a chain-of-thought LLM judge [8][6]. Perplexity shipped a freemium version on 2025-02-14 (secondary source: TechCrunch [13]). Anthropic launched Research on 2025-04-15 [12] and published its orchestrator–worker architecture that June [7].

Since then the products have moved from chat features to API primitives. OpenAI exposes `o3-deep-research`/`o4-mini-deep-research` in its Responses API [9]; Google's April 2026 "Deep Research Max" release targets agentic pipelines, MCP data sources, and enterprise data partners [10][11].

**Counter-reading (adopted):** vendor framing of 2024–25 as the invention moment is contestable. What was new was productization and long-horizon autonomy, not the browsing-research loop — WebGPT demonstrated that in 2021 [2][5][8]. *(Confidence: High — dated primary chain.)*

## 3. The four approaches

Each has a subdirectory with full documentation and annotated resources.

| Approach | In one line | Maturity signal | Quality evidence | Cost | Transparency |
|---|---|---|---|---|---|
| [Single-prompt skills](single-prompt-skills/) | Method-as-markdown loaded by a capable agent | Skills mechanism: 162K★ repo [32]; research skills are community-made, small | No independent benchmark; convergent design with vendor pipelines [36][7] | Lowest | Highest (diffable files) |
| [Multi-agent pipelines](multi-agent-pipelines/) | Orchestrator delegates to parallel context-isolated workers | Production systems (Claude Research [12]); 12K★ open reference [17] | +90.2% vs single agent — vendor self-reported, token-confounded [7] | ~15x chat tokens [7] | High for open impls; the method is published [7][25] |
| [Commercial products](commercial-products/) | Hosted turnkey agents (OpenAI, Google, Perplexity, Anthropic) | Fastest evolution; API-first since late 2025 [9][10] | Best headline numbers — all self-reported [8][10][13]; 3–13% hallucinated citation URLs in independent audit [14] | Subscription/API | Lowest |
| [Open-source frameworks](open-source-frameworks/) | Self-hosted loops/graphs, your keys | 8 active-to-dormant repos, 5K–77K★ (with caveats) [16–23] | GAIA 55% vs hosted 67% (only quantified gap, early 2025) [26] | Tokens + search fees | Full |

## 4. What the best systems share: seven methodological ingredients

The same ingredients recur across vendor pipelines [7], open frameworks [25][24][21], context-engineering guidance [34], and community skills [36]. Two caveats up front: stated methods are well-sourced but *causal* attribution to quality is not — no controlled ablations published (see §6). And the convergence is read from systems that publish their methods, so publication bias may make the field look more converged than it is. *(Confidence: High that these are the stated methods; Medium that each causes quality.)*

1. **Explicit decomposition with delegation contracts.** Subtasks carry an objective, output format, tool guidance, and boundaries — Anthropic found vague delegation caused duplicate work and gaps [7]. LangChain's version: compress the conversation into a "research brief" that acts as the north star [25].
2. **Effort scaling rules.** Numeric rules mapping query complexity to agent/tool budgets: 1 agent + 3–10 calls for lookups, 10+ subagents for complex research [7]. Community skills ship the same idea as user-selectable effort modes (Quick → UltraDeep) [36]; dzhng's minimal loop makes breadth/depth the only two parameters [21].
3. **Parallel fan-out with context isolation.** Parallel subagents (and parallel tool calls inside each) cut research time up to 90% [7]. The supervisor/subagent split exists primarily to isolate context windows, with each worker's raw scrapes filtered by a clean-up call before synthesis [25].
4. **External memory over context.** Plans saved outside the window (200K-token truncation risk) [7]; compaction, structured note-taking, just-in-time retrieval via file paths [34]; disk-persisted `sources.json` surviving compaction in community skills [36]. This report's own research-notes/ directory is this pattern.
5. **A dedicated citation pass.** Anthropic runs a separate CitationAgent after research ends [7]; community skills run `verify_citations.py` in a validate–fix–retry loop [36]. The independent audit shows why: agentic URL self-correction cuts non-resolving citations 6–79x [14].
6. **Perspective diversity and self-critique.** STORM's perspective-guided questioning via simulated writer-expert conversations [24]; multi-persona red-teaming and critique loop-backs in community skills [36]; "start wide, then narrow" search heuristics [7].
7. **Prompts and tool descriptions as the primary engineering surface.** Anthropic's system is steered almost entirely by prompt principles, including letting the model rewrite its own failing prompts and tool descriptions — one rewritten tool description cut completion time 40% [7].

## 5. Judging research quality: what the evaluation literature says

*(Confidence: High — academic primary sources throughout.)*

**Two benchmark camps exist, and neither covers both halves.** Answer-verifiable benchmarks score retrieval competence with exact matching but say nothing about report synthesis: GAIA (466 assistant questions) [46], BrowseComp (1,266 hard-to-find-fact questions; explicitly does *not* measure long-answer generation) [45], Humanity's Last Exam (2,500 expert questions resistant to quick retrieval) [47], and FutureSearch's frozen-web Deep Research Bench (89 tasks over a "RetroSearch" snapshot for reproducibility) [44]. Judged-report benchmarks — principally **DeepResearch Bench** (100 PhD-level tasks across 22 fields) — score the report itself [42].

**The de-facto standard for report quality is adaptive rubric judging.** DeepResearch Bench's RACE framework generates *task-specific* criteria across four dimensions (comprehensiveness, insight/depth, instruction-following, readability) and scores against a reference report. Its FACT framework extracts statement–URL pairs and verifies by scraping whether each cited source actually supports its claim [42][43].

**Judges now exceed the human ceiling — which is low.** The benchmark's maintainers measured human inter-annotator agreement on report quality at only **68.78%**, with frontier judge models exceeding that baseline (GPT-5.5 71.82, Gemini-3.1-Pro 70.58, Claude-Opus-4-7 70.11). They migrated official evaluators and run dual leaderboards because **rankings are only comparable within a fixed judge** [43].

**But judge validity is task-conditional.** The LLM-as-judge survey organizes the whole field around reliability [39]; CALM catalogs 12 bias types persisting in advanced judges [40]; and JUDGE-BENCH (20 datasets, 11 LLMs) finds judge–human agreement varies by model, property, and annotator expertise — weakest exactly where deep-research evaluation lives: expert-level judgments of model-generated long text [41].

**Practitioner shortcut that held up:** Anthropic found a single LLM judge with one rubric prompt (factual accuracy, citation accuracy, completeness, source quality, tool efficiency; 0–1 score + pass/fail) aligned with human judgment better than an ensemble of per-dimension judges, and recommends starting evaluation with ~20 real queries immediately [7].

**Independent ground truth on citations:** 3–13% of citation URLs from commercial LLMs and deep-research agents are hallucinated outright; 5–18% don't resolve; deep-research agents are *worse* than search-augmented LLMs on this axis [14].

## 6. What we could not find

- **No independent replication of any vendor benchmark claim.** OpenAI's HLE 26.6%/GAIA numbers, Perplexity's HLE 21.1%, Google's unnumbered "leap in performance" chart, and Anthropic's 90.2% are all self-reported [8][13][10][7].
- **No independent comparison of single-agent-plus-skill vs orchestrated multi-agent** on identical research tasks — the central architecture debate ([7] vs [38]) is empirically unresolved.
- **No 2026 head-to-head benchmark of the open-source frameworks.** The only cross-system numbers are early-2025 GAIA (55 vs 67) and LangChain's self-reported leaderboard placement [26][25].
- **No audited per-product citation-accuracy figures** — the 3–13% audit aggregates across systems without a per-product breakdown we could retrieve [14].
- **Perplexity's primary announcement was unfetchable** through three routes (Cloudflare, reader-proxy block, archive block). All Perplexity claims rest on a February 2025 TechCrunch piece [13] and are likely stale by AS_OF — pricing, caps, and API state unverified for mid-2026.
- **Anthropic's mid-2026 product state is under-documented.** The reported July 2026 "Claude Science" launch was snippet-verified only [15], and no Anthropic deep-research API model was found.
- Search-engine access was itself constrained this run (bot-walls), so **secondary/community sentiment coverage is thin** — findings lean on primary sources (see execution-log.md).

## 7. Key controversies

- **Architecture: orchestration vs context engineering.** Anthropic reports multi-agent beats single-agent by 90.2% [7]. Cognition argues multi-agent systems are inherently fragile — subagents act on conflicting implicit assumptions — and single-threaded context-engineered agents are more reliable [38]. Anthropic's own data offers the reconciling confound: token spend explains 80% of performance variance, and multi-agent costs ~15x tokens [7]. The gain may be mostly budget, not architecture. Unresolved for lack of independent evidence.
- **"Verifiable citations" vs measured hallucination.** Vendor marketing: "fully documented, with clear citations" [8], "rigorous factuality" [10]. Independent audit: 3–13% of citation URLs fabricated, worse than non-agentic baselines [14]. Both can be true — reports cite more sources than chat answers — but the marketing claim is materially oversold.
- **Can LLM judges be trusted to rank research?** DeepResearch Bench's judges now exceed the human agreement ceiling [43], yet JUDGE-BENCH shows agreement collapses precisely on expert-level long-form judgments [41], and the human ceiling itself (68.78%) says report quality is partly irreducibly subjective [43]. Practical resolution: fixed-judge, within-comparison rankings only — never absolute scores across judges [43].

## 8. Recommended steps: solo developer, Claude Code daily, skill-comparison harness in git

You already have the two hardest parts: a daily driver that supports skills/subagents/MCP natively, and a harness that compares runs blind. The gaps: dedicated search, a project skill encoding the seven shared ingredients, and judging upgraded to what the literature supports.

1. **Make search a first-class tool.** Raw WebSearch plus page-fetching is the weakest link — and, as this run's execution log shows, the most environment-fragile. Add a dedicated search MCP server: Tavily (`tavily-ai/tavily-mcp`, 2,232★, search/extract/map/crawl) or Exa (`exa-labs/exa-mcp-server`, 4,738★), both pushed within the last week, each needing one API key [52][53]. Wire it via `claude mcp add` or `.mcp.json` [50].
2. **Build (or fork) one project research skill encoding the seven ingredients from §4.** Start from the 199-biotechnologies skill as a working existence proof — one git clone, zero mandatory dependencies [36]. Or write your own `SKILL.md` with: effort modes; delegation contracts for subagents; a disk-persisted source registry with per-source type/date/authority; a mandatory citation-verification pass; and a critique loop [7][34][36][48].
3. **Use Claude Code subagents for the fan-out, cheaply.** Define retrieval workers in `.claude/agents/` with restricted tools and a cheaper model, keeping synthesis in the lead session — per-agent model routing is native [49]. Respect the fit rule: parallelize breadth-first retrieval, never interdependent synthesis [7][38].
4. **Keep every run's evidence trail in the repo.** Task notes, source registry, and execution log per run — the external-memory pattern [34][7]. This is also exactly what makes blind judging and citation audits possible later.
5. **Upgrade the harness's judging to the supported protocol.** Per-task adaptive rubrics (RACE-style: comprehensiveness, insight, instruction-following, readability) rather than one fixed rubric [42]. A separate citation-verification check that fetches cited URLs (FACT-style, or the audit's open `urlhealth` approach) [43][14]. Pairwise, order-swapped, blind comparisons with a **pinned judge model**, treating rankings as valid only within that judge [43]. A cross-provider judge to blunt self-enhancement bias [4][41]. Off the shelf, promptfoo's `llm-rubric` and `select-best` assertions cover this from a CLI if you'd rather not maintain judge scripts (its "used by OpenAI and Anthropic" claim is unverified self-marketing) [54][55].
6. **Calibrate against a hosted baseline occasionally.** A few dollars of `o4-mini-deep-research` [9] or `deep-research-preview-04-2026` [11] on your own harness prompts gives you a moving reference point for the open/skill variants — and your own citation-accuracy audit of them will likely be more informative than any vendor benchmark [14].
7. **Start the eval set small and real.** ~20 queries you actually care about, evaluated immediately, beats a big benchmark later [7].

## 9. Method and disclosures

Produced by the daymade-deep-research V6.1 skill, Standard mode, orchestrator–worker execution: 6 specialist subagent tasks (history, commercial, open-source, architecture, evaluation, developer tooling), 60 source lines distilled into a 55-source deduplicated registry (64% official, 25% academic, 17 domains; all public-accessibility; 0 privileged). Interactive gates were auto-approved for unattended execution per harness instruction. Retrieval used a degraded path — session web tools ungranted; live curl-based search/fetch documented in `research-notes/execution-log.md`, including which engines were bot-walled. Counter-review findings are incorporated in §6–§7 and `research-notes/counter-review.md`. Vendor self-reporting is flagged inline throughout; secondary sources are labeled. AS_OF for all time-sensitive claims: 2026-07-18.

## References

Full registry with source types, dates, authority scores, and provenance: [`research-notes/registry.md`](research-notes/registry.md).

- [1] Lewis et al., RAG — https://arxiv.org/abs/2005.11401 (academic, 2020)
- [2] Nakano et al., WebGPT — https://arxiv.org/abs/2112.09332 (academic, 2021)
- [3] Yao et al., ReAct — https://arxiv.org/abs/2210.03629 (academic, 2022)
- [4] Zheng et al., LLM-as-a-Judge / MT-Bench — https://arxiv.org/abs/2306.05685 (academic, 2023)
- [5] Google, Gemini Deep Research launch — https://blog.google/products/gemini/google-gemini-deep-research/ (official, 2024-12; self-reported)
- [6] OpenAI, Deep Research System Card — https://cdn.openai.com/deep-research-system-card.pdf (official, 2025-02)
- [7] Anthropic, How we built our multi-agent research system — https://www.anthropic.com/engineering/multi-agent-research-system (official, 2025-06; self-reported)
- [8] OpenAI, Introducing deep research — https://openai.com/index/introducing-deep-research/ (official, 2025-02 + updates to 2026-02; self-reported)
- [9] OpenAI, Deep research API guide — https://developers.openai.com/api/docs/guides/deep-research (official, 2026-07)
- [10] Google, Deep Research Max — https://blog.google/innovation-and-ai/models-and-research/gemini-models/next-generation-gemini-deep-research/ (official, 2026-04; self-reported)
- [11] Google, Gemini API Deep Research docs — https://ai.google.dev/gemini-api/docs/deep-research (official, 2026)
- [12] Anthropic, Claude takes research to new places — https://www.anthropic.com/news/research (official, 2025-04)
- [13] TechCrunch, Perplexity deep research — https://techcrunch.com/2025/02/15/perplexity-launches-its-own-freemium-deep-research-product/ (journalism/secondary, 2025-02)
- [14] arXiv 2604.03173, Reference hallucinations audit — https://arxiv.org/abs/2604.03173 (academic/independent, 2026-04)
- [15] Tech Times, Claude Science — https://www.techtimes.com/articles/319439/20260701/anthropic-launches-claude-science-ai-research-workbench-open-all-paid-subscribers.htm (journalism/secondary, 2026-07; snippet-verified only, Low confidence)
- [16]–[23] GitHub API metadata for gpt-researcher, open_deep_research, deer-flow, storm, smolagents, dzhng/deep-research, node-DeepResearch, Tongyi DeepResearch (official metadata, observed 2026-07-18) — URLs in registry
- [24] Shao et al., STORM — http://arxiv.org/abs/2402.14207v2 (academic, 2024)
- [25] LangChain, Open Deep Research — https://blog.langchain.com/open-deep-research/ (official, 2025-07; self-reported)
- [26] smolagents open_deep_research README — https://raw.githubusercontent.com/huggingface/smolagents/main/examples/open_deep_research/README.md (official, observed 2026-07)
- [27] DeerFlow 2.0 README — https://raw.githubusercontent.com/bytedance/deer-flow/main/README.md (official, observed 2026-07)
- [28] GPT Researcher README — https://raw.githubusercontent.com/assafelovic/gpt-researcher/master/README.md (official, observed 2026-07)
- [29] STORM README — https://raw.githubusercontent.com/stanford-oval/storm/main/README.md (official, 2025-09)
- [30] Anthropic, Introducing Agent Skills — https://www.anthropic.com/news/skills (official, 2025-10)
- [31] Anthropic, Equipping agents for the real world — https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills (official, 2025-10)
- [32] anthropics/skills — https://github.com/anthropics/skills (official, observed 2026-07-18)
- [33] Anthropic, Building effective agents — https://www.anthropic.com/engineering/building-effective-agents (official, 2024-12)
- [34] Anthropic, Effective context engineering — https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents (official, 2025)
- [35] LangChain, Multi-agent patterns — https://docs.langchain.com/oss/python/langchain/multi-agent (official, 2026-07)
- [36] 199-biotechnologies/claude-deep-research-skill — https://github.com/199-biotechnologies/claude-deep-research-skill (community, 2026-04)
- [37] mvanhorn/last30days-skill — https://github.com/mvanhorn/last30days-skill (community, observed 2026-07-18)
- [38] Cognition, Don't Build Multi-Agents — https://cognition.ai/blog/dont-build-multi-agents (secondary-industry, 2025-06; vendor-motivated)
- [39] Gu et al., A Survey on LLM-as-a-Judge — https://arxiv.org/abs/2411.15594 (academic, v6 2025-10)
- [40] Ye et al., CALM bias framework — https://arxiv.org/abs/2410.02736 (academic, 2024-10)
- [41] Bavaresco et al., JUDGE-BENCH — https://arxiv.org/abs/2406.18403 (academic, ACL 2025)
- [42] Du et al., DeepResearch Bench — https://arxiv.org/abs/2506.11763 (academic, 2025-06)
- [43] deep_research_bench repo (RACE/FACT + 2026 evaluator migration) — https://github.com/Ayanami0730/deep_research_bench (official, 2026-05)
- [44] FutureSearch, Deep Research Bench — https://arxiv.org/abs/2506.06287 (academic, 2025-05)
- [45] Wei et al., BrowseComp — https://arxiv.org/abs/2504.12516 (academic, 2025-04)
- [46] Mialon et al., GAIA — https://arxiv.org/abs/2311.12983 (academic, 2023-11)
- [47] Phan et al., Humanity's Last Exam — https://arxiv.org/abs/2501.14249 (academic, 2025)
- [48] Claude Code docs, Skills — https://code.claude.com/docs/en/skills (official, 2026-07)
- [49] Claude Code docs, Subagents — https://code.claude.com/docs/en/sub-agents (official, 2026-07)
- [50] Claude Code docs, MCP — https://code.claude.com/docs/en/mcp (official, 2026-07)
- [51] Weizhena/Deep-Research-skills — https://github.com/Weizhena/Deep-Research-skills (community, 2026-05; metadata-only)
- [52] tavily-ai/tavily-mcp — https://github.com/tavily-ai/tavily-mcp (official, observed 2026-07-18)
- [53] exa-labs/exa-mcp-server — https://github.com/exa-labs/exa-mcp-server (official, observed 2026-07-18)
- [54] promptfoo/promptfoo — https://github.com/promptfoo/promptfoo (official, observed 2026-07-18; "used by OpenAI/Anthropic" is unverified self-claim)
- [55] promptfoo docs, Model-graded metrics — https://www.promptfoo.dev/docs/configuration/expected-outputs/model-graded/ (official, 2026-07)
