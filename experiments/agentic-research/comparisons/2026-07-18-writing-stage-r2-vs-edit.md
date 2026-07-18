# Agentic research: daymade-deep-research--fable--cc--r2 vs daymade-deep-research+pocock-edit-article--fable--cc--from-r2

Judge: claude-fable-5 (anthropic) | Protocol: v1 (fallback — provider hold; owner, 2026-07-18) | Key: report-A = daymade-deep-research--fable--cc--r2, report-B = daymade-deep-research+pocock-edit-article--fable--cc--from-r2
Provider independence: NOT met — judge shares a provider (anthropic) with both runs; self-preference caveat applies. Queued for v2 re-judging when the hold lifts.
Caveats: **first writing-stage comparison** — the research stage is held literally constant (the stack's intermediate is a byte-copy of r2's output), so every difference is the edit stage's work; per conventions the rubric weights readability/navigation and instruction-following highest for the overall, and a stage-fidelity spot-check replaces redundancy in the citation check (shared content — one live check covers both). Blind pack: reader-facing files only, research-notes excluded symmetrically (byte-identical between runs); self-identifications neutralized symmetrically. Verbosity: near-identical (A 9,223 / B 9,335 words) — editing did not inflate length. Same-day retrieval, single research stage.

## Scores

Cells are pass-1 / pass-2 (pass 1 read A→B, pass 2 read B→A; each pass a fresh judge with no memory of the other).

| Dimension | report-A (r2, unedited) | report-B (edit stack) | Pass agreement |
|---|---|---|---|
| Coverage | 9 / 8 | 9 / 8 | **Agree**: tie — content identical |
| Depth of synthesis | 9 / 8 | 9 / 8 | **Agree**: tie — same analytical moves |
| Instruction-following / actionability | 9 / 8 | 9 / 9 | **Near-agree**: pass 1 ties, pass 2 gives B a slight edge (a scannable TL;DR is itself an instructed behavior) |
| Readability / navigation | 6 / 6 | 8 / 9 | **Agree**: B clearly ahead — the decisive dimension in both passes |
| Citation quality | 8 / 8 | 8 / 8 | **Agree**: tie — identical apparatus, shared [n]-registry penalty |

**Overall: both passes pick report-B (the edit stack) — full inter-pass agreement**, restoring the perfect agreement record that the four-way comparison broke (pairwise comparisons are now 3-for-3 on inter-pass agreement).

## Judge rationale

Both passes independently observed that the reports are "the same underlying content in two formattings" — which is literally true (the stack's intermediate is a byte-copy of r2's output) and neither judge was told. That makes this, in pass 2's words, "almost a pure test of the formatting-mechanics rubric":

- **The substance dimensions all tie** in both passes: same four-approach map, same seven shared ingredients, same token-confound reconciliation of the Anthropic-vs-Cognition debate, same 55-source registry with identical flagging, same honestly-disclosed gaps.
- **Readability is where they part** (6 vs 8 and 6 vs 9): r2's ~250-word single-paragraph TL;DR "works against the purpose of a TL;DR"; its §5 benchmark sentence-train, three mega-bullet controversies, and inline vendor timelines are exactly the walls the rubric scores down. The edited report renders the same content as short paragraphs, dated bullet timelines, headed `###` controversy subsections (which double as navigation anchors), and sub-bulleted protocols.
- **The edit stage's one flaw, flagged by both passes**: over-fragmentation — occasional one-sentence paragraphs that split single thoughts awkwardly (the STORM and RACE/FACT passages). This is why B scores 8–9 rather than 10.
- **A shared penalty neither run escapes**: the numeric [n] citation registry forcing reference-hopping, and the summary's collapsed "[16]–[23]" range entry. The edit stage was constrained to shape-not-invent and left the registry style in place; converting [n] markers to in-flow links (permitted by the dispatch as reformatting) was only partially exploited. Headroom for a future edit-stage variant.

## Stage-fidelity spot-check

8 claims from the stack's final output verified against the byte-copied intermediate (shape, never invent):

| Claim (≤20 words) | Final file | Verdict | Note |
|---|---|---|---|
| Produced unattended by the deep-research skill (V6.1, Standard mode) | README.md | faithful | Sentence split from longer intro paragraph; wording otherwise identical |
| Converging recipe: decompose, parallel fan-out, external files, citation pass, self-critique [7][25][34][36] | summary.md | faithful | Prose → bulleted list in TL;DR; all four citations retained |
| Human inter-annotator agreement 68.78%; judges 71.82 / 70.58 / 70.11 [43] | summary.md | faithful | One sentence split into three; all numbers and attribution preserved |
| Deep-research skills exploit unbounded filesystem loading [31] | single-prompt-skills/README.md | **drifted** | Split-off clause was uncited synthesis in intermediate; edit stamped [31] on it, extending the source's attribution |
| LeadResearcher plans, saves plan to Memory; context past 200K truncated [7] | multi-agent-pipelines/README.md | faithful | Arrow-chain flow → numbered list; content and citation intact |
| OpenAI claims 26.6% HLE (vs 3.3% GPT-4o); GAIA 67.36/72.57 [8] | commercial-products/README.md | faithful | All four figures identical; vendor-self-report framing kept |
| MCP partnerships "in public preview on paid Gemini API tiers" [10] | commercial-products/README.md | **drifted** | Intermediate scoped the preview to the whole April 2026 release; edit narrows it to the partnerships. Minor |
| DeerFlow's 77K stars shouldn't credit the deep-research category [27][18] | open-source-frameworks/README.md | **drifted** | Editorial judgment was uncited in intermediate; edit added [27][18]. Meaning unchanged, attribution added |

**Tally: 5 faithful / 3 drifted / 0 invented.** Every drift is one mechanism — sentence-splitting re-stamps citations onto fragments, occasionally extending a citation to a previously uncited editorial clause or narrowing a modifier's scope. No numbers, hedges, or claim strength changed anywhere. The checker also verified (untabled) the GAIA, 90.2%/80%/15×, evolution-date, and URL-audit clusters: byte-faithful. **Protocol note**: "citation re-stamping under paragraph splitting" is a newly observed writing-stage failure mode — meaning survives, but source attribution silently spreads to editorial text. Future edit-stage dispatches should forbid adding citation markers to text that lacked them.

## Citation spot-check

Shared research content — one live check covers both reports. 5 claim–source pairs, fetched 2026-07-18:

| Claim | Source | Verdict | Note |
|---|---|---|---|
| WebGPT answers preferred over human demonstrators' 56% of the time | arxiv.org/abs/2112.09332 | supported | Abstract states the 56% figure verbatim |
| 3–13% citation URLs hallucinated, 5–18% non-resolving; urlhealth cuts 6–79× | arxiv.org/abs/2604.03173 | supported | Abstract matches all three figures; 53,090-URL count confirmed |
| Multi-agent beat single-agent Opus 4 by 90.2% | anthropic.com multi-agent post | supported | Exact quote present; 80%-variance and ~15× also verified |
| Smolagents open Deep Research: 55% pass@1 GAIA vs 67% OpenAI | open_deep_research README | supported | README states both figures |
| Agent Skills launched Oct 16 2025 as "folders that include instructions, scripts, and resources…" | anthropic.com/news/skills | supported | Via benign permanent redirect; date, quote, scope confirmed |

**Tally: 5/5 supported.**

## Human verdict

<!-- appended by the owner — the judge never fills this in -->
