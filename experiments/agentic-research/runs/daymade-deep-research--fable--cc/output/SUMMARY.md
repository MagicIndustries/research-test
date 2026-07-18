# The State of the Art in Agentic Deep Research

> Research date: 2026-07-18 | Sources: 52 approved (42% official, 29% academic) | Mode: Standard (P0–P7 pipeline, 6 subagent tasks) | AS_OF: 2026-07-18

## TL;DR

**Deep research** — an LLM agent autonomously searching, reading, and synthesizing a long cited report — went from research prototypes (WebGPT, 2021 [1]) to a product category in one winter: Google shipped the first product named "Deep Research" in December 2024 [6][17], OpenAI and Perplexity followed in February 2025 [15][10][20], and Anthropic published the canonical engineering account of the orchestrator–worker architecture behind its Research feature in June 2025 [5]. Four implementation approaches now coexist: **single-prompt research skills** (markdown-packaged instructions that turn a general agent into a researcher for near-zero infrastructure cost [34][35][36]), **orchestrated multi-agent pipelines** (a lead agent fanning out parallel search subagents — Anthropic self-reports +90.2% over single-agent at ~15x token cost [5]), **commercial products** (polished but opaque; an independent UPenn audit found Gemini Deep Research fabricated 13.3% of citation URLs [19]), and **open-source frameworks** (GPT Researcher, LangChain Open Deep Research, DeerFlow, STORM — transparent, model-agnostic, and cheap, e.g. ~$0.40/run for GPT Researcher, self-reported [22]). The best systems share the same ingredients: explicit planning, parallel decomposition with context isolation, source quality gates, claim-level citation verification, and a self-critique pass. Evaluation has converged on rubric-based LLM-as-judge scoring (RACE) plus citation-verification (FACT) [41][42], but human experts only agree with each other 68.78% of the time on report rankings [42] — so judge scores are noisy signals, not ground truth. **For a solo Claude Code developer**: start with a skill (the token-cheap 80% solution), wire it to subagent fan-out via Claude Code's `context: fork`/`agent` frontmatter [50], script comparable runs headlessly with per-run cost metering [51], judge outputs with a RACE-style rubric plus mechanical URL/citation checks [42][19], and treat all vendor benchmark numbers as marketing until independently replicated.

---

## Contents

1. Key terms, defined from primary sources
2. Background: where deep research came from
3. The four approaches, mapped
4. What the best systems share
5. Judging research quality: what the evaluation literature says
6. What we could not find
7. Key controversies (counter-review)
8. Recommended steps for a solo Claude Code developer
9. Limitations of this report
10. References

Per-approach deep dives live in the subdirectories: [single-prompt-skills/](single-prompt-skills/README.md), [multi-agent-pipelines/](multi-agent-pipelines/README.md), [commercial-products/](commercial-products/README.md), [open-source-frameworks/](open-source-frameworks/README.md).

---

## 1. Key terms, defined from primary sources

**Deep research.** Operationally, Perplexity's launch post defines the capability as a system that "performs dozens of searches, reads hundreds of sources, and reasons through the material" to deliver a comprehensive cited report [10]. The first vendor-neutral academic definition (Java et al., Microsoft, Aug 2025) deliberately decouples the term from report length, defining deep research by "the high fan-out over concepts required during the search process, i.e., broad and reasoning-intensive exploration" [8]. A December 2025 academic survey consolidates the field under this name [12].

**Research agent.** An LLM system that autonomously interleaves reasoning with actions (search, browse, read) toward a research goal. The mechanism traces to ReAct (Yao et al., Oct 2022), which established the interleaved reasoning-trace-plus-action loop underlying essentially all later research agents [2], with WebGPT (Nakano et al., Dec 2021) as the earliest direct ancestor: GPT-3 fine-tuned to answer long-form questions in a text-based browsing environment with citations [1].

**Orchestrator–worker (orchestrator–workers).** Anthropic's "Building Effective Agents" (Dec 2024) supplies the canonical definition: a workflow where "a central LLM dynamically breaks down tasks, delegates them to worker LLMs, and synthesizes their results," recommended when subtasks cannot be predicted in advance [4]. Anthropic's Research feature is the flagship application: a lead Claude Opus 4 agent spawning parallel Claude Sonnet 4 subagents [5].

**LLM-as-judge.** Established by Zheng et al. (NeurIPS 2023): using a strong LLM to grade another model's output. GPT-4 judges matched human preferences at over 80% agreement — the same level as human–human agreement — while exhibiting position, verbosity, and self-enhancement biases [3]. A 2025 EMNLP survey (Li et al.) taxonomizes the method and its open reliability challenges [43].

**Confidence: High** — every definition above is traced to the primary document that introduced or formalized the term.
**Counter-reading:** "Deep research" is ordinary English older than any AI product; no source identifies a coiner of the generic phrase, so only *productization* (Google, Dec 2024 [6]) and *popularization* (OpenAI/Perplexity, Feb 2025 [20][10]) can be attributed.

## 2. Background: where deep research came from

The lineage runs in three phases:

**Research prototypes (2021–2023).** WebGPT demonstrated browse-search-cite question answering with human feedback in December 2021 [1]. ReAct (2022) contributed the reasoning-plus-acting loop [2]. In 2023, LLM-as-judge made automated quality grading credible [3], and the first open-source autonomous research agent, GPT Researcher (Assaf Elovic), shipped multi-source cited report generation [9].

**Structured pipelines (2024).** Stanford OVAL's STORM (NAACL 2024) generated full Wikipedia-style cited articles via perspective-guided multi-agent conversations — called by librarian-analyst Aaron Tay possibly "the first 'deep research' system" [9][7][26]. In December 2024, Anthropic published the orchestrator-workers pattern [4], and Google shipped the first product named "Deep Research" in Gemini Advanced on December 11, 2024, with an iterative plan-search-read-reason loop, user-editable research plans, and a 1M-token context window (vendor self-described) [6][17].

**The product explosion (2025–2026).** OpenAI launched Deep Research on the o3 model on February 2, 2025 [15][20]; Perplexity followed on February 14, 2025, with a free tier [10][11]. The same window saw scholarly variants (Ai2 ScholarQA, Elicit Research Reports, SciSpace Deep Review) per Tay's contemporaneous chronicle [7]. Anthropic launched Claude's Research feature in April 2025 and published its engineering account in June 2025 [5]. By late 2025–2026 the category matured and churned: OpenAI moved Deep Research to GPT-5.2 (Feb 2026) [16], Google relaunched on Gemini 3 Pro (Dec 2025) [13] and shipped Deep Research Max on Gemini 3.1 Pro with MCP access (Apr 2026) [14], and academic consolidation arrived with a systematic survey (Dec 2025) [12] and formal definitions [8].

**Confidence: High** for the timeline's anchor dates (each rests on a primary vendor post or arXiv record). **Medium** for OpenAI's exact launch-day details, which rest on journalism [20] plus snippets of a 403-blocked official page [15].
**Counter-reading:** Some secondary sources date Gemini Deep Research to November 2024 or credit OpenAI as first [7]; Google's own blog dating the launch to December 11, 2024 [6][17] should be preferred as primary, but attribution is genuinely contested in secondary literature.

## 3. The four approaches, mapped

| | Single-prompt skills | Multi-agent pipelines | Commercial products | Open-source frameworks |
|---|---|---|---|---|
| **Core mechanism** | Packaged markdown instructions loaded on demand [34][35] | Lead agent + parallel search subagents [4][5] | Hosted autonomous browse-and-report agents [15][17][10] | Self-hosted pipelines (planner/executor, supervisor/researcher) [22][23] |
| **Quality evidence** | Community adoption; no controlled benchmark found | +90.2% vs single-agent (vendor self-reported, internal) [5] | ~21% HLE (Perplexity, self-reported) [10]; <68% rubric compliance (independent) [48] | RACE 0.4943 #6 on Deep Research Bench (open_deep_research) [23]; 55% GAIA pass@1 (smolagents) [27] |
| **Cost** | "A few dozen extra tokens" until invoked [36] | ~15x chat tokens [5] | Subscription tiers; API $2–$40/Mtok [21] | ~$0.40/run self-reported (GPT Researcher) [22] |
| **Transparency** | Full (readable markdown) | Full if self-built | Low (internal evals, no traces) | Full (MIT/Apache licenses) [22][23][25] |
| **Key risk** | Persisting context cost once invoked [50] | Coordination fragility; conflicting subagent decisions [38] | Fabricated citations (13.3% Gemini, 3.5% OpenAI) [19] | Fragmented, non-comparable self-benchmarks [22][23][27] |

Details, maturity evidence, trade-offs, and getting-going guides: see each subdirectory's README.

The map's most important structural finding: **the approaches are converging.** A 939-star community Claude skill implements an 8-phase pipeline with parallel retrieval and critique loops from inside a single markdown package [39]; DeerFlow pivoted from a deep-research framework to a general "super agent harness" with lead agent, parallel subagents, and sandboxes [25]; Claude Code's skill format can fork a skill into a named subagent (`context: fork`, `agent:` frontmatter), directly wiring the single-prompt and multi-agent approaches together [50]; and Google's Deep Research Max exposes the commercial product through an API with MCP connectivity, blurring product and framework [14].

**Confidence: High** for the mechanisms and licensing facts; **Medium** for all quality-column numbers (mostly self-reported on non-comparable benchmarks).

## 4. What the best systems share

Across all four approaches, the systems with the strongest evidence share seven ingredients:

1. **Explicit planning before searching.** Gemini generates a user-editable research plan [17]; GPT Researcher has a dedicated planner stage [22]; Anthropic's lead agent plans before delegating [5].
2. **Decomposition with parallelism and context isolation.** Anthropic runs 3–5 subagents concurrently, each making 3+ parallel tool calls, cutting research time "by up to 90% for complex queries" (vendor self-reported) [5]; LangChain uses supervisor/researcher phases [23]; the academic definition of deep research is precisely this "high fan-out" [8].
3. **Scaling effort to question complexity.** Anthropic's prompting doctrine: simple fact-finding = 1 agent and 3–10 tool calls; comparisons = 2–4 subagents with 10–15 calls each [5]. Community skills mirror this with Quick-to-UltraDeep modes [39].
4. **Token budget as the primary quality lever.** On BrowseComp, token usage alone explains 80% of performance variance; tokens + tool calls + model choice explain 95% [5]. This is the least intuitive and best-quantified finding in the literature: much of "architecture" is spending more tokens in an organized way.
5. **Source governance and triangulation.** Community skills enforce 10+ sources and 3+ per claim with credibility scoring [39]; STORM grounds every section in retrieved references [26]; FACT-style evaluation checks whether each cited source actually supports its claim [42].
6. **Claim-level citation verification.** The UPenn audit shows why: deep research agents fabricate citation URLs at material rates (Gemini 13.3%, OpenAI 3.5% of ~168k audited URLs), and a mechanical URL-checking tool cut non-resolving URLs 6–79x [19].
7. **Self-critique / end-state evaluation.** Anthropic judges agents "by end-state rather than intermediate steps" and runs rubric-based LLM-as-judge scoring plus human review [5]; the 939-star skill loops a critique phase back into synthesis [39].

**Confidence: High** that these ingredients recur across the strongest systems (multiple independent primary sources per ingredient); **Medium** on their causal contribution — no ablation study isolating individual ingredients was found.

## 5. Judging research quality: what the evaluation literature says

The evaluation stack has three layers:

**Foundations.** Zheng et al. validated LLM judges at >80% human agreement while naming the biases every later judge inherits: position, verbosity, self-enhancement [3]. Li et al.'s EMNLP 2025 survey catalogs the method's open reliability challenges [43].

**Deep-research-specific benchmarks.** DeepResearch Bench (100 PhD-level tasks, 22 fields) split evaluation into two independent axes: **RACE** scores report quality on Comprehensiveness, Insight/Depth, Instruction-Following, and Readability using dynamically weighted, reference-calibrated criteria; **FACT** extracts statement–URL pairs and verifies support, yielding citation accuracy and effective-citation counts [41][42]. FutureSearch's Deep Research Bench (89 task instances) adds a frozen-web RetroSearch environment because web drift makes live benchmarks unstable [44]. Short-answer benchmarks sidestep judging entirely: BrowseComp (1,266 hard-to-find facts) [45], GAIA (466 assistant tasks; humans 92% vs GPT-4-with-plugins 15%) [46], Humanity's Last Exam (2,500 expert questions) [47]. DeepResearchGym offers a free, reproducible evaluation sandbox [49].

**The 2025–2026 correction.** ResearchRubrics (Scale AI, Nov 2025) replaced model-generated criteria with 2,500+ expert-written per-prompt rubrics — and found the leading commercial agents (Gemini and OpenAI Deep Research) achieve **under 68% rubric compliance**, failing mostly on missed implicit context and weak reasoning over retrieved evidence [48]. Meanwhile the human ceiling itself is low: inter-annotator agreement on DeepResearch Bench's annotated subset is only 68.78% [42].

Practical upshot for anyone building an evaluation harness: (a) use a rubric, not holistic scores; (b) verify citations mechanically, separately from prose quality; (c) freeze or snapshot sources for comparability; (d) treat judge–human agreement claims as bounded by a noisy human ceiling, and control for verbosity bias explicitly.

**Confidence: High** — this section rests almost entirely on peer-reviewed or arXiv primary sources with concrete numbers.
**Counter-reading:** An LLM judge can systematically diverge from experts while still reporting high "alignment," because the human baseline is itself only ~69% self-consistent [42][3]. No published study yet demonstrates rubric gaming (e.g., inflating RACE via verbosity) — an inferred, not documented, risk.

## 6. What we could not find

Documented absences, from the subagents' explicit gap logs:

- **No controlled head-to-head of skill-based vs orchestrated research** on the same tasks; the comparison rests on asymmetric evidence (Anthropic's internal eval vs community adoption signals).
- **No independent citation-accuracy audit of Claude Research** — the UPenn study tested Claude only as a search-augmented LLM, not the Research agent — so Anthropic's 90.2% internal claim has no external check [19][5].
- **No common-task benchmark across the major open-source frameworks**; each self-reports on a different benchmark (GAIA vs Deep Research Bench vs SimpleQA), making quality claims non-comparable [22][23][27][29].
- **No primary openai.com fetch**: the official OpenAI and Perplexity announcement pages returned HTTP 403; their benchmark figures are relayed via snippets and journalism [15][10][20].
- **No identified coiner** of "deep research" as a generic phrase; only productization order is attributable [6][7].
- **No dedicated survey on evaluating deep-research reports** (as opposed to general LLM-as-judge surveys), and no published rubric-gaming study [43].
- **Community cost/experience reports for Claude Code research workloads** could not be gathered — a session-wide search budget cap forced tasks d–f into fetch-only mode; the developer-tooling picture is official-docs-heavy (see Limitations).
- Vendor BrowseComp scores for the commercial products were not confirmed in any fetched source, despite being commonly referenced in commentary.

## 7. Key controversies (counter-review)

Mandatory P6 counter-review; five material issues found (2 critical, 3 high):

- **Controversy 1 (critical) — Does multi-agent actually beat single-agent, or does more money beat less money?** Anthropic self-reports +90.2% for orchestrator–worker over single-agent Opus 4, but concedes ~15x token cost and that token spend alone explains 80% of BrowseComp variance [5]. Cognition's contemporaneous "Don't Build Multi-Agents" argues parallel subagents make conflicting implicit decisions and recommends a single-threaded agent with context compression [38]. Anthropic itself bounds the pattern to parallelizable, read-heavy tasks [5]. No independent replication exists. Verdict: the 90.2% figure is plausible for research workloads specifically, but the architecture-vs-budget confound is unresolved.
- **Controversy 2 (critical) — Are deep research agents more reliable than plain search?** Vendors market them as such; the only large independent audit found deep research agents pooled fabricate citation URLs at a *higher* rate than plain search-augmented LLMs (Gemini DR 13.3% vs 4.8% pooled baseline; OpenAI DR 3.5%), and more citations per query does not improve per-citation reliability [19]. Independent journalism echoes that "targeted search queries with capable reasoning models are often more reliable" than long agentic reports [16].
- **Controversy 3 (high) — Contested firsts.** Secondary sources date Gemini Deep Research to November 2024 or credit OpenAI as the category creator [7]; Google's primary blog says December 11, 2024 [6][17]. This report follows the primary source.
- **Controversy 4 (high) — Conflicting activity data.** DeerFlow's star count: secondary coverage reported ~25k (and elsewhere 47k) in Feb–Mar 2026 [31], while direct GitHub observation in July 2026 shows 77.3k [25]. Direct observation preferred; the discrepancy may reflect stale reporting, explosive growth, or conflation with the repo's pre-2.0 history.
- **Controversy 5 (high) — "Skills cost almost nothing" is only half true.** Metadata costs "a few dozen tokens" [36], but once invoked, skill content persists for the session and is re-attached after compaction under a 25,000-token budget [50] — a recurring cost precisely for long research sessions. Relatedly on self-serving metrics: Perplexity's "state-of-the-art" claims on DRACO are on a benchmark Perplexity itself authored [18].

## 8. Recommended steps for a solo Claude Code developer

Tailored to: works in Claude Code daily, runs a skill-comparison harness in a git repo, wants to assemble the best research capability from existing parts.

1. **Make a skill your baseline, not a framework.** Anthropic's own doctrine says add complexity only when it demonstrably improves outcomes [4], and skills are the token-cheapest packaging (idle cost: dozens of tokens [36]). Study two references before writing yours: the official anthropics/skills spec and examples [37], and the 939-star community deep-research skill whose 8-phase pipeline (scope → plan → parallel retrieve → triangulate → synthesize → critique → package) with 3+-sources-per-claim rules is the best public template [39].
2. **Encode the seven shared ingredients (§4) as explicit skill phases** — plan first, scale effort to complexity with named modes, force source triangulation, and end with a critique pass. These are the load-bearing methods the strongest systems agree on [5][22][39].
3. **Add fan-out through Claude Code's native seams, not a new framework.** `context: fork` runs a skill in an isolated subagent context; the `agent:` field binds it to a custom subagent; plugins can bundle skills + agents + hooks + MCP servers into one installable research capability [50]. This gives you the orchestrator–worker pattern's read-heavy benefits [4][5] while Cognition's warning about conflicting subagent decisions [38] stays managed: keep synthesis single-threaded, parallelize only retrieval.
4. **Script comparable runs headlessly.** `claude -p` with `--bare` (reproducible, no auto-discovered config), `--json-schema` for structured output, `--resume` for multi-pass pipelines, and `total_cost_usd` in JSON output for per-run cost metering [51] — exactly what a git-based comparison harness needs for provenance and cost columns.
5. **Judge with a rubric + mechanical citation checks, never holistic scores.** Adopt RACE's four dimensions (comprehensiveness, insight, instruction-following, readability) and a FACT-style claim–URL verification pass [42]; add a URL-liveness check, which cut non-resolving URLs 6–79x in the UPenn study [19]. Mitigate known judge biases: randomize comparison order (position bias), normalize for length (verbosity bias), and use a different model family as judge than as researcher (self-enhancement bias) [3]. Expect ~69% ceiling agreement even between human experts [42] — run multiple judge passes and report variance, not point scores.
6. **Snapshot evidence for comparability.** FutureSearch's core finding is that web drift breaks longitudinal comparisons [44]; have every run persist its fetched sources (or at least extracts) in the repo so later variants are judged against the same evidence base.
7. **Borrow components, not architectures, from open source.** GPT Researcher for planner/executor patterns and cost discipline [22]; LangChain open_deep_research for per-stage model configuration (cheap model for summarization, strong model for synthesis) [23]; STORM for perspective-guided question generation and outline-first writing [26]. All MIT/Apache licensed.
8. **Distrust every number a vendor reports about itself.** The pattern across this report: internal evals without replication [5], self-authored benchmarks [18], 403-blocked announcement pages [15][10], and independent audits contradicting marketing [19]. Build your harness so that the numbers you trust are the ones it produces.

**Confidence: High** on the mechanisms each step relies on (official docs, primary engineering posts); **Medium** on the overall strategy ranking, since no controlled skill-vs-pipeline comparison exists (§6).

## 9. Limitations of this report

- **Search-budget degradation:** the session's web-search quota was exhausted after the first three research tasks; tasks d–f substituted direct fetches of known primary URLs (arXiv API, GitHub API, official docs). Consequence: the evaluation and skills sections skew academic/official, and community experience reports (costs, comparisons) are underrepresented. Task-f is explicitly marked `status: partial` in the notes.
- **403-blocked primaries:** OpenAI and Perplexity announcement figures rest on snippets plus journalism (Medium confidence).
- **Fast-moving field:** several sources are less than 3 months old (Deep Research Max, Apr 2026 [14]; UPenn audit, Apr 2026 [19]); expect churn. All claims carry AS_OF 2026-07-18.
- **English-language, public-web sources only;** no paywalled analyst coverage. No user-private or privileged sources were used (0 rejected).
- **Provenance note:** this report was produced by the daymade-deep-research V6.1 pipeline running autonomously; plan-approval and clarification gates were auto-approved as instructed by the dispatching agent. Full evidence trail in [research-notes/](research-notes/).

**Future directions:** run the missing experiment (same tasks, skill vs forked-subagent pipeline vs GPT Researcher, RACE+FACT scored, sources snapshotted) — the harness described in §8 is precisely the instrument the literature lacks.

---

## References

[1] Nakano et al. "WebGPT: Browser-assisted question-answering with human feedback". Source-Type: academic. As Of: 2021-12. https://arxiv.org/abs/2112.09332
[2] Yao et al. "ReAct: Synergizing Reasoning and Acting in Language Models". Source-Type: academic. As Of: 2022-10. https://arxiv.org/abs/2210.03629
[3] Zheng et al. "Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena". Source-Type: academic. As Of: 2023-06. https://arxiv.org/abs/2306.05685
[4] Anthropic. "Building Effective AI Agents". Source-Type: official. As Of: 2024-12. https://www.anthropic.com/research/building-effective-agents
[5] Anthropic. "How we built our multi-agent research system". Source-Type: official (vendor self-reported metrics). As Of: 2025-06. https://www.anthropic.com/engineering/multi-agent-research-system
[6] Google. "Introducing Gemini 2.0: A new AI model for the agentic era". Source-Type: official. As Of: 2024-12. https://blog.google/technology/google-deepmind/google-gemini-ai-update-december-2024/
[7] Aaron Tay. "The Rise of Agent-Based Deep Research". Source-Type: secondary-industry. As Of: 2025-02. https://aarontay.substack.com/p/the-rise-of-agent-based-deep-research
[8] Java et al. "Characterizing Deep Research: A Benchmark and Formal Definition". Source-Type: academic. As Of: 2025-08. https://arxiv.org/abs/2508.04183
[9] GPT Researcher official site. Source-Type: official. As Of: 2026. https://gptr.dev/
[10] Perplexity. "Introducing Perplexity Deep Research". Source-Type: official (vendor self-reported; fetch blocked, relayed via snippets). As Of: 2025-02. https://www.perplexity.ai/hub/blog/introducing-perplexity-deep-research
[11] Simon Willison. "Introducing Perplexity Deep Research" (commentary). Source-Type: secondary-industry. As Of: 2025-02. https://simonwillison.net/2025/Feb/16/introducing-perplexity-deep-research/
[12] "Deep Research: A Systematic Survey". Source-Type: academic. As Of: 2025-12. https://arxiv.org/pdf/2512.02038
[13] TechCrunch. "Google launched its deepest AI research agent yet". Source-Type: journalism. As Of: 2025-12. https://techcrunch.com/2025/12/11/google-launched-its-deepest-ai-research-agent-yet-on-the-same-day-openai-dropped-gpt-5-2/
[14] Google. "Deep Research Max: a step change for autonomous research agents". Source-Type: official (vendor self-reported win-rates). As Of: 2026-04. https://blog.google/innovation-and-ai/models-and-research/gemini-models/next-generation-gemini-deep-research/
[15] OpenAI. "Introducing deep research". Source-Type: official (vendor self-reported; fetch blocked, relayed via snippets). As Of: 2025-02. https://openai.com/index/introducing-deep-research/
[16] The Decoder. "OpenAI's Deep Research now runs on GPT-5.2". Source-Type: journalism. As Of: 2026-02. https://the-decoder.com/openais-deep-research-now-runs-on-gpt-5-2-and-lets-users-search-specific-websites/
[17] Google. "Try Deep Research and our new experimental model in Gemini". Source-Type: official. As Of: 2024-12. https://blog.google/products/gemini/google-gemini-deep-research/
[18] TestingCatalog. "Perplexity launches Advanced Deep Research for Max users". Source-Type: secondary-industry. As Of: 2026-02. https://www.testingcatalog.com/perplexity-launches-advanced-deep-research-for-max-users/
[19] Rao, Wong, Callison-Burch (UPenn). "Detecting and Correcting Reference Hallucinations in Commercial LLMs and Deep Research Agents". Source-Type: academic. As Of: 2026-04. https://arxiv.org/html/2604.03173v1
[20] TechCrunch. "OpenAI unveils a new ChatGPT agent for 'deep research'". Source-Type: journalism. As Of: 2025-02. https://techcrunch.com/2025/02/02/openai-unveils-a-new-chatgpt-agent-for-deep-research/
[21] Simon Willison. "Exploring OpenAI's deep research API model o4-mini-deep-research". Source-Type: community. As Of: 2025-07. https://til.simonwillison.net/llms/o4-mini-deep-research
[22] assafelovic/gpt-researcher (GitHub). Source-Type: official (project self-reported cost/quality). As Of: 2026-07. https://github.com/assafelovic/gpt-researcher
[23] langchain-ai/open_deep_research (GitHub). Source-Type: official (project self-reported benchmark). As Of: 2026-07. https://github.com/langchain-ai/open_deep_research
[24] LangChain. "Open Deep Research" (blog). Source-Type: official. As Of: 2025-08. https://www.langchain.com/blog/open-deep-research
[25] bytedance/deer-flow (GitHub). Source-Type: official. As Of: 2026-07. https://github.com/bytedance/deer-flow
[26] stanford-oval/storm (GitHub). Source-Type: academic. As Of: 2026-07. https://github.com/stanford-oval/storm
[27] huggingface/smolagents open_deep_research README. Source-Type: official (project self-reported benchmark). As Of: 2026-07. https://github.com/huggingface/smolagents/blob/main/examples/open_deep_research/README.md
[28] jina-ai/node-DeepResearch (GitHub). Source-Type: official. As Of: 2026-07. https://github.com/jina-ai/node-DeepResearch
[29] LearningCircuit/local-deep-research (GitHub). Source-Type: community (project self-reported benchmark). As Of: 2026-07. https://github.com/LearningCircuit/local-deep-research
[30] khoj-ai/khoj (GitHub). Source-Type: official. As Of: 2026-07. https://github.com/khoj-ai/khoj
[31] DEV Community. "DeerFlow 2.0: What It Is, How It Works". Source-Type: community. As Of: 2026-03. https://dev.to/arshtechpro/deerflow-20-what-it-is-how-it-works-and-why-developers-should-pay-attention-3ip3
[32] MarkTechPost. "4 Open-Source Alternatives to OpenAI's $200/Month Deep Research". Source-Type: journalism. As Of: 2025-02. https://www.marktechpost.com/2025/02/05/4-open-source-alternatives-to-openais-200-month-deep-research-ai-agent/
[33] btahir/open-deep-research (GitHub). Source-Type: community. As Of: 2026-07. https://github.com/btahir/open-deep-research
[34] Claude blog. "Introducing Agent Skills". Source-Type: official. As Of: 2025-10. https://claude.com/blog/skills
[35] Anthropic Engineering. "Equipping agents for the real world with Agent Skills". Source-Type: official. As Of: 2025-10. https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills
[36] Simon Willison. "Claude Skills are awesome, maybe a bigger deal than MCP". Source-Type: community. As Of: 2025-10. https://simonwillison.net/2025/Oct/16/claude-skills/
[37] anthropics/skills (GitHub). Source-Type: official. As Of: 2026-07. https://github.com/anthropics/skills
[38] Cognition (Walden Yan). "Don't Build Multi-Agents". Source-Type: secondary-industry. As Of: 2025-06. https://cognition.com/blog/dont-build-multi-agents
[39] 199-biotechnologies/claude-deep-research-skill (GitHub). Source-Type: community. As Of: 2026-03. https://github.com/199-biotechnologies/claude-deep-research-skill
[41] Du et al. "DeepResearch Bench: A Comprehensive Benchmark for Deep Research Agents". Source-Type: academic. As Of: 2025-06. https://arxiv.org/abs/2506.11763
[42] Ayanami0730/deep_research_bench (GitHub) — RACE/FACT implementation + leaderboard. Source-Type: official. As Of: 2026-07. https://github.com/Ayanami0730/deep_research_bench
[43] Li et al. "From Generation to Judgment: Opportunities and Challenges of LLM-as-a-judge". Source-Type: academic. As Of: 2025-09. https://arxiv.org/abs/2411.16594
[44] Bosse et al. (FutureSearch). "Deep Research Bench: Evaluating AI Web Research Agents". Source-Type: academic. As Of: 2025-06. https://arxiv.org/abs/2506.06287
[45] Wei et al. (OpenAI). "BrowseComp: A Simple Yet Challenging Benchmark for Browsing Agents". Source-Type: academic. As Of: 2025-04. https://arxiv.org/abs/2504.12516
[46] Mialon et al. "GAIA: a benchmark for General AI Assistants". Source-Type: academic. As Of: 2023-11. https://arxiv.org/abs/2311.12983
[47] Phan et al. "Humanity's Last Exam". Source-Type: academic. As Of: 2026-02. https://arxiv.org/abs/2501.14249
[48] Sharma et al. (Scale AI). "ResearchRubrics: A Benchmark of Prompts and Rubrics For Evaluating Deep Research Agents". Source-Type: academic. As Of: 2025-11. https://arxiv.org/abs/2511.07685
[49] Coelho et al. (CMU). "DeepResearchGym: A Free, Transparent, and Reproducible Evaluation Sandbox for Deep Research". Source-Type: academic. As Of: 2025-05. https://arxiv.org/abs/2505.19253
[50] Claude Code docs. "Extend Claude with skills". Source-Type: official. As Of: 2026-07. https://code.claude.com/docs/en/skills
[51] Claude Code docs. "Run Claude Code programmatically". Source-Type: official. As Of: 2026-07. https://code.claude.com/docs/en/headless

(Registry entries [40] and [52] are annotated-resource pointers only and are cited in the subdirectory resource files, not in this summary. Full registry with accessibility labels: [research-notes/registry.md](research-notes/registry.md).)
