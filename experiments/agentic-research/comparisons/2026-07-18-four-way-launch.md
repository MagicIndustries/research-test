# Agentic research: research--fable--cc vs spartan-deep-research--fable--cc vs daymade-deep-research--fable--cc vs spartan-deep-research--sonnet--cc

Judge: claude-fable-5 (anthropic) | Protocol: v1 (fallback — provider hold: all non-Anthropic model use paused until the new Google API account arrives; owner, 2026-07-18) | Key: report-A = spartan-deep-research--sonnet--cc, report-B = research--fable--cc, report-C = spartan-deep-research--fable--cc, report-D = daymade-deep-research--fable--cc
Provider independence: NOT met — judge shares a provider (anthropic) with all four runs; self-preference caveat applies, and a fable judge scored two fable-produced runs. Queued for v2 re-judging when the hold lifts.
Caveats: verbosity spread is large (A 15,272 / B 6,230 / C 6,633 / D 18,018 words — verbosity bias risk); all runs same retrieval window (2026-07-18). Blinding edits: daymade's pipeline self-identification neutralized in two places (method description kept, name removed); one self-referential parenthetical dropped from A ("like the one this report was produced under"); C's header "via the spartan-deep-research skill" → "via a single-prompt deep-research skill".

## Scores

Cells are pass-1 / pass-2 (pass 1 read A→D, pass 2 read D→A; each pass a fresh judge with no memory of the other).

| Dimension | report-A | report-B | report-C | report-D | Pass agreement |
|---|---|---|---|---|---|
| Coverage | 9 / 8 | 6 / 7 | 8 / 9 | 8 / 7 | **Disagree**: pass 1 puts A first, pass 2 puts C first and drops D to tie-last; both put B at/near the bottom |
| Depth of synthesis | 8 / 8 | 6 / 7 | 8 / 8 | 9 / 9 | **Agree**: D first, B last, A≈C between |
| Instruction-following / actionability | 9 / 7 | 7 / 8 | 8 / 8 | 9 / 9 | **Partial**: D first in both; A flips from tied-first (pass 1) to last (pass 2) |
| Readability / navigation | 6 / 6 | 9 / 8 | 8 / 9 | 7 / 8 | **Partial**: A last in both; first place flips B↔C |
| Citation quality | 9 / 8 | 7 / 7 | 8 / 8 | 9 / 9 | **Agree**: D first (A ties it in pass 1), B last |

**Overall verdicts — the passes disagree and are reported unaveraged (per protocol):**

- Pass 1: **D > A > C > B** — "D converts its bulk into a verifiable evidence trail and the set's best critical analysis; A converts its bulk into the widest coverage but a noticeably harder read."
- Pass 2: **C > D (very close) > A ≈ B** — "C is the broadest and most balanced map in the most navigable package; D has the best evidence discipline but is missing several of the field's landmarks that others found."

Stable across both passes: **D** has the strongest synthesis and citation apparatus; **B** is the most readable but thinnest on evidence and independent verification; **A** is the hardest to read; **C** is the best value-per-word all-rounder. The flip is in how much C's balance outweighs D's evidence discipline — and pass 2 penalizes D's disclosed coverage gaps harder ("honest disclosure of a coverage gap does not fill it").

## Judge rationale

Full per-dimension rationales from both passes are long; the load-bearing points, with pass disagreements flagged:

- **Coverage** — *disagreement*: Pass 1 ranks A first for the widest ecosystem sweep (security angle: Snyk ToxicSkills, SkillsBench; independent Google Research cross-check; most current 2026 commercial detail). Pass 2 ranks C first as the only report treating RL-trained research agents (OpenAI, Tongyi DeepResearch) as a first-class paradigm alongside the scaffolded ones, and counts D's honestly-disclosed gaps (RL paradigm, DRACO, DRB II, dzhng) as real absences: "disclosed absence is still absence."
- **Depth of synthesis** — *agreement*: D's "Key controversies" apparatus is the strongest analytical work in the set (adjudicates the architecture-vs-token-budget confound behind Anthropic's 90.2% claim; UPenn citation-fabrication numbers; per-section confidence grades). A is the best externally-triangulated (Google scaling-agents error-amplification cross-check, Tran & Kiela equal-compute counterpoint). B relays flagged claims without stress-testing them.
- **Instruction-following / actionability** — *partial*: both passes call all four structurally complete and rank D's recommended steps the most concretely harness-shaped (cost metering via headless JSON, evidence snapshotting, fork-based fan-out). The A flip: pass 1 credits its explicit "search budget exhausted" gap-flagging; pass 2 dings its single-paragraph ~400-word TL;DR and generic steps.
- **Readability / navigation** — *partial*: A is last in both passes (dense unbroken prose slabs). B and C trade first place: B's short consistent sections and one-sitting summary vs C's "reading order for the impatient" and tight tables. Both passes note D's [n]-style citation registry forces reference-hopping and leaks pipeline jargon into the deliverable.
- **Citation quality** — *agreement*: D's registry (source types, authority scores, 403-disclosures, drop log) is best-in-class; A is nearly as scrupulous but pass 2 flags load-bearing figures resting on unnamed "secondary reporting" with no URL (GhostCite spread, hallucination-reduction numbers, an uncorroborated "162k stars"). C's one outright attribution error (crediting the RACE 0.4943/#6 result to FutureSearch's benchmark — a conflation of two different benchmarks it elsewhere cites correctly) is the only such error either pass found in any report. B has the thinnest verification trail.

**Judge observations both passes surfaced independently**: the cross-report "Deep Research Max" conflict (A and D cite a blog.google primary for it; C calls it unconfirmable — one side is wrong); LangChain ODR's RACE score drifting between 0.4344 and 0.4943 across reports with only A flagging the tension; and — a set-wide strength — all four reports independently flag Anthropic's 90.2%/15× figures as unreplicated vendor self-reporting.

## Citation spot-check

Run by a local Claude subagent (fact verification is provider-independent per protocol); 5 load-bearing claims per report, each fetched live 2026-07-18.

| Report | Claim (paraphrased) | Source | Verdict | Evidence note |
|---|---|---|---|---|
| A | ResearchRubrics: 2,500+ expert rubrics, 2,800+ hours; leading systems under 68% rubric compliance | arxiv.org/abs/2511.07685 | supported | Abstract confirms all three figures and the missed-implicit-context failure mode verbatim |
| A | OpenAI Deep Research: 26.6% HLE vs DeepSeek R1 9.4%, GPT-4o 3.3% | openai.com/index/introducing-deep-research | supported | Primary 403-blocked (as report discloses); figures confirmed via Fortune/TechRadar/Windows Central coverage |
| A | HF smolagents hit #1 open GAIA submission, 55% pass@1 vs ~67% for OpenAI | huggingface.co/blog/open-deep-research | supported | Blog: 55.15% validation, OpenAI ~67%, prior open SOTA Magentic-One ~46% |
| A | Google Research: multi-agent +81% on finance tasks, −39–70% on PlanCraft; error amplification 17.2x vs 4.4x | research.google blog (scaling agent systems) | supported | Post states 80.9%, 39–70% degradation, 17.2x independent vs 4.4x centralized |
| A | Snyk ToxicSkills: 3,984 skills audited; 36% flawed, 13.4% (534) critical, 76 malicious, 8 still live | snyk.io ToxicSkills post | supported | Post: 36.82% (1,467), 534/13.4% critical, 76 payloads, 8 live — all match |
| B | Anthropic: multi-agent beat single-agent Opus 4 by 90.2%, at ~15x chat tokens | anthropic.com multi-agent post | supported | Post states 90.2% internal-eval gain and ~15x token multiplier exactly |
| B | Perplexity Deep Research: 21.1% HLE, 93.9% SimpleQA | perplexity.ai launch blog | supported | Primary 403-blocked; both figures confirmed via Perplexity's X post and multiple secondary sources |
| B | LangChain ODR scored RACE 0.4344, ranked #6 on Deep Research Bench | LangChain blog + repo | supported | Figure absent from the cited blog but stated verbatim in the also-cited repo README |
| B | STORM judged +25 absolute points organization, +10 breadth vs baseline (expert-judged) | arxiv.org/abs/2402.14207 | supported | Abstract: "organized (by a 25% absolute increase) and broad in coverage (by 10%)" |
| B | Same HF agent: 55.15% GAIA with code actions vs 33% with JSON tool calls | huggingface.co/blog/open-deep-research | supported | Blog: JSON version "instantly degraded to 33%"; code actions need 30% fewer steps |
| C | DeepResearch Bench II: best models satisfy <50% of 9,430 expert binary rubrics | arxiv.org/abs/2601.08536 | supported | Abstract confirms 132 tasks, 9,430 rubrics, 400+ human-hours, <50% satisfaction |
| C | FutureSearch measured $0.05–$0.55/task across 20+ configs, most well under $1 | futuresearch.ai cost blog | supported | Post: $0.05 (Gemini 3 Flash low) to $0.55 (Claude Opus high); dates Feb/Mar 2026 match |
| C | sonar-deep-research pricing: $2/$8 per M tokens, citation $2/M, reasoning $3/M, $5/1k searches | docs.perplexity.ai | supported | All five price components plus 128K context confirmed on the docs page |
| C | LangChain: parallel section-writing gave disjoint reports; fix is parallel research + one-shot writer | langchain.com blog | supported | Blog quotes the disjoint-reports problem and "write the report in one-shot" fix directly |
| C | Tongyi DeepResearch: 30.5B MoE with 3.3B active, 128K, CPT+SFT+GRPO, ReAct + Heavy mode | github.com/Alibaba-NLP/DeepResearch | supported | README confirms every spec, Apache-2.0 license included |
| D | UPenn audit (~168k URLs): Gemini DR fabricated 13.3% of URLs, OpenAI 3.5%, baseline 4.8%; tool cut failures 6–79x | arxiv.org/html/2604.03173v1 | supported | Paper: 168,021 URLs; 13.3%/3.5%/4.8%; 6–79x reduction; volume ≠ reliability confirmed |
| D | Human inter-annotator agreement on DeepResearch Bench subset is only 68.78% | github.com/Ayanami0730/deep_research_bench | supported | Repo states "human inter-annotator agreement baseline = 68.78%" (50-task subset) |
| D | Willison-documented API pricing $10/$40 (o3-DR), $2/$8 (o4-mini), ~10–30 searches/query | til.simonwillison.net | partial | Pricing and Responses-API-only confirmed; but Willison's run shows 45–77 searches, not ~10–30 |
| D | Cognition (Jun 12, 2025): "actions carry implicit decisions…"; recommends single-threaded agent + compression | cognition.com/blog/dont-build-multi-agents | supported | Quote verbatim, date exact (one day before Anthropic's post, as D notes), Flappy Bird example confirmed |
| D | DeerFlow: 77.3k stars, 10.5k forks, MIT, v2.0.0 (Jun 25, 2026), lead agent + parallel subagents + sandboxes | github.com/bytedance/deer-flow | supported | Repo shows exactly these stats, license, release, architecture, and sandbox modes |

**Tally**: A 5/0/0, B 5/0/0, C 5/0/0, D 4/1/0 (supported/partial/unsupported). Checker's patterns: citation fidelity uniformly high — numbers reproduce exactly, not approximately; self-disclosed 403 fetch failures were honest and the cross-checked figures held; D's one partial is an understatement (report says ~10–30 searches, source shows 45–77), not an inflation; B's RACE figure is real but credited to the wrong one of its two cited sources (repo README, not the blog). With accuracy near-uniform, the differentiator in this sample was precision of attribution — A's and D's aggressive inline vendor-self-report flagging proved consistent with what the sources actually say.

## Human verdict

<!-- appended by the owner — the judge never fills this in -->
