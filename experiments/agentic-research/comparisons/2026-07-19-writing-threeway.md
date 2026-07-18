# Agentic research: r2 (unedited) vs +pocock-edit-article vs +spartan-article-writing — three-way writing comparison

Judge: claude-fable-5 (anthropic) | Protocol: v1 (fallback — provider hold; owner, 2026-07-18) | Key: report-A = daymade-deep-research+spartan-article-writing--fable--cc--from-r2, report-B = daymade-deep-research+pocock-edit-article--fable--cc--from-r2, report-C = daymade-deep-research--fable--cc--r2
Provider independence: NOT met — judge shares a provider (anthropic) with all three runs; self-preference caveat applies. Queued for v2 re-judging when the hold lifts.
Caveats: writing-stage comparison, research stage byte-identical across all three (both stacks' intermediates are diff-verified copies of r2's output) — every scored difference is writing-stage work. Rubric weights readability/navigation + instruction-following highest; judges briefed on rendered-form mechanics and prose quality. **Dispatch asymmetry**: the spartan stack ran under the rendered-output rules (bulleted references, no-re-stamping ban); the pocock stack predates them — reference-list deltas are partly rule-attributable, voice deltas skill-attributable. Live citation check omitted: identical research content was live-checked 5/5 in [the two-way comparison](2026-07-18-writing-stage-r2-vs-edit.md) (same retrieval window); the new verification surface is the spartan stack's stage-fidelity check below. Blind pack: reader-facing files only, research-notes excluded symmetrically; verbosity near-identical (A 9,297 / B 9,335 / C 9,223 words).

## Scores

Cells are pass-1 / pass-2 (pass 1 read A,B,C; pass 2 read C,B,A; each pass a fresh judge with no memory of the other).

| Dimension | report-A (spartan-voiced) | report-B (pocock-segmented) | report-C (r2, unedited) | Pass agreement |
|---|---|---|---|---|
| Coverage | 9 / 9 | 9 / 9 | 9 / 9 | **Agree**: three-way tie — content identical |
| Depth of synthesis | 8 / 9 | 8 / 8 | 8 / 9 | **Near-agree**: pass 2 dings B alone — atomized one-sentence paragraphs dilute connected reasoning |
| Instruction-following / actionability | 9 / 9 | 9 / 9 | 8 / 9 | **Near-agree**: pass 1 dings C's semicolon-fused step 5; pass 2 ties all three |
| Readability / navigation | 8 / 9 | 6 / 7 | 5 / 5 | **Agree**: A > B > C in both — the decisive dimension |
| Citation quality | 9 / 9 | 9 / 9 | 9 / 9 | **Agree**: tie — identical apparatus |

**Overall: both passes rank A > B > C — unanimous full ranking.** The spartan-voiced stack wins, the pocock-segmented stack second, the unedited report last. Inter-pass agreement on pairwise-and-small comparisons is now 4-for-4.

## Judge rationale

Both passes confirmed the design held — "three formatting variants of the same underlying report" — and the verdict reduced to rendered-form mechanics, exactly what the rubric weights:

- **Why A wins**: it is the only report whose reference lists are bullet lists, so all 55 references render one per line (B and C's bare adjacent lines collapse into "one enormous merged paragraph" — a 48-entry wall). Its paragraphing hits the middle ground: 2–4-sentence paragraphs that carry an argument, bullets only where content is genuinely enumerable (the OpenAI timeline, the LangGraph phases). Pass 1: "§5 is a model of scannable argument"; pass 2: "only A gets it right at both scales."
- **Why B beats C but loses to A**: B's body is highly scannable (bulleted TL;DR recipe, `### Controversy` sub-headers, sub-bulleted step 5) but it over-fragments — "'Unresolved for lack of independent evidence.' floats alone" — and pass 2 charged that fragmentation against *synthesis*, not just style: severing a claim from its qualifier dilutes the reasoning a reader experiences. B also shares C's broken reference rendering (it predates the rendered-output rules — see caveats).
- **Why C is last**: it stacks both failures — the ~250–370-word single-paragraph TL;DR (pass 1: "the worst single rendering failure in the pack"), semicolon-fused run-ons in its most actionable step, and the collapsed reference blobs. Pass 2: "a rendered document that actively resists the fast-path reading its own README promises."
- **Uniform penalties that separated no one**: the numeric [n] registry style (caps every readability score), the collapsed "[16]–[23]" registry-deferred entry, and one shared content looseness pass 2 caught — the TL;DR's "product category in about ten weeks" fits Google→Perplexity but stretches to ~18 weeks for Anthropic — identical in all three, i.e. inherited from the shared research stage, not introduced by any writing stage.

## Stage-fidelity spot-check (spartan stack)

8 claims from the spartan stack's final output verified against the byte-copied intermediate, with a strength-drift focus (voice rewrites risk hedges becoming assertions). The pocock stack's check (5/8 faithful, 3 drifted via citation re-stamping, 0 invented) is in [the two-way comparison](2026-07-18-writing-stage-r2-vs-edit.md).

| Claim (≤20 words) | Final file | Verdict | Note |
|---|---|---|---|
| Four approaches converging on same recipe: decompose, fan out, external memory, citation pass, self-critique [7][25][34][36] | summary.md | faithful | Mega-sentence split; citations stayed with the recipe claim — their correct referent — not spread onto the dates paragraph |
| Human inter-annotator agreement only 68.78%; frontier judges exceed it (71.82 / 70.58 / 70.11) [43] | summary.md | faithful | All four numbers, the "within a fixed judge" caveat, and [43] intact |
| Token spend explains 80% of variance; multi-agent ~15× tokens [7]; gain may be mostly budget | summary.md | faithful | "May be" hedge and "Unresolved for lack of independent evidence" both survived the split |
| Report maps what makes LLM agents produce excellent research, as four approaches | README.md | faithful | Opener reframed; structure claim matches the report |
| Bundled context "effectively unbounded" [31]; exactly what deep-research skills exploit | single-prompt-skills/README.md | faithful | The exploit claim's uncited-synthesis status unchanged — the exact clause pocock's edit had mis-stamped |
| Open Deep Research is a three-phase LangGraph: Scope, Research, Write [17][25] | multi-agent-pipelines/README.md | faithful | Prose → numbered list; no citations re-stamped onto list items |
| OpenAI evolution: Apr 24 2025 o4-mini, quotas 25/250/5; Feb 10 2026 MCP connections [8] | commercial-products/README.md | faithful | Run-on → bullets under "[8]:" which still governs the whole list; all dates and quotas exact |
| "Eight repos at a glance" — the open-source landscape is eight frameworks | open-source-frameworks/README.md | faithful | Count introduced by the rewrite but grounded: the table has 8 rows and the intermediate says "8 active-to-dormant repos" |

**Tally: 8 faithful / 0 drifted / 0 invented.** The checker also swept the full diff for the named failure modes: every hedge survived, removed discourse markers were stylistic not epistemic, and the re-stamping mechanism did not occur — in the TL;DR split the rewrite *narrowed* citation scope correctly (the [7][25][34][36] block now attaches only to the recipe claim it sources). **Protocol note**: the pocock run (3/8 drift) ran *without* the no-re-stamping dispatch rule; the spartan run (0/8) ran *with* it — one pair, but direct evidence the loop's rule change eliminated the failure mode it targeted.

## Human verdict

Owner, 2026-07-19: **"i prefer the spartan rewrite"** — concurs with both passes' A > B > C. Second fully unanimous comparison in a row (judges + human aligned).

Consequences: `daymade-deep-research+spartan-article-writing` (as a derived stack) is the validated answer to the owner's "daymade's depth in readable packaging" synthesis idea, and spartan-article-writing becomes the working default writing stage for deep-research stacks. Loop iteration: proposal PR codifying the prose-voice preference (rewriting over segmentation; spartan register) — see the ledger.
