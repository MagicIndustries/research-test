# Comparison ledger

One block per comparison, appended by `compare-runs` after the human verdict lands (ADR-0001). The loop's primary dataset; entries are never rewritten.

| Date | Experiment | Comparison | Dimension | Pass 1 | Pass 2 | Notes |
|---|---|---|---|---|---|---|
| 2026-07-18 | second-brain | [research vs spartan](../experiments/second-brain/comparisons/2026-07-18-research-vs-spartan-deep-research.md) | coverage | tie | slightly A | magnitude gap |
| 2026-07-18 | second-brain | 〃 | synthesis | strongly B | slightly B | magnitude gap |
| 2026-07-18 | second-brain | 〃 | instruction | slightly A | slightly A | |
| 2026-07-18 | second-brain | 〃 | readability | tie | tie | |
| 2026-07-18 | second-brain | 〃 | citation | strongly A | slightly A | magnitude gap; spot-check 12: 9/3/0 |
| 2026-07-18 | second-brain | 〃 | **overall** | slightly A | slightly A | judge = baseline; **human = spartan** — disagree |
| 2026-07-18 | second-brain-original | [research vs spartan](../experiments/second-brain-original/comparisons/2026-07-18-research-vs-spartan-deep-research.md) | coverage | slightly A | slightly A | |
| 2026-07-18 | second-brain-original | 〃 | synthesis | slightly B | slightly B | |
| 2026-07-18 | second-brain-original | 〃 | instruction | slightly A | slightly A | |
| 2026-07-18 | second-brain-original | 〃 | readability | tie | tie | |
| 2026-07-18 | second-brain-original | 〃 | citation | slightly B | slightly B | spot-check 11: 8/2/1 (baseline UNSUPPORTED) |
| 2026-07-18 | second-brain-original | 〃 | **overall** | slightly A | slightly A | judge = baseline; **human = spartan** — disagree |

| 2026-07-18 | agentic-research | [four-way-launch](../experiments/agentic-research/comparisons/2026-07-18-four-way-launch.md) | coverage | A>C=D>B | C>A>B≈D | **order split** on leader |
| 2026-07-18 | agentic-research | 〃 | synthesis | D>A=C>B | D>A≈C>B | agree: D first, B last |
| 2026-07-18 | agentic-research | 〃 | instruction | A=D>C>B | D>B≈C>A | A flips first↔last |
| 2026-07-18 | agentic-research | 〃 | readability | B>C>D>A | C>B≈D>A | agree: A last; B/C swap first |
| 2026-07-18 | agentic-research | 〃 | citation | A=D>C>B | D>A≈C>B | agree: D top, B last; spot-check 20: 19/1/0 |
| 2026-07-18 | agentic-research | 〃 | **overall** | D>A>C>B | C>D>A≈B | **passes split**; **human = C (spartan-fable)** — pass 2 agrees, pass 1 doesn't |
| 2026-07-18 | agentic-research | [writing-stage-r2-vs-edit](../experiments/agentic-research/comparisons/2026-07-18-writing-stage-r2-vs-edit.md) | coverage | tie | tie | content byte-identical by design |
| 2026-07-18 | agentic-research | 〃 | synthesis | tie | tie | 〃 |
| 2026-07-18 | agentic-research | 〃 | instruction | tie | slightly B | pass 2: scannable TL;DR is instructed behavior |
| 2026-07-18 | agentic-research | 〃 | readability | strongly B | strongly B | 8v6 / 9v6 — the decisive dimension |
| 2026-07-18 | agentic-research | 〃 | citation | tie | tie | live check 5/5; fidelity 5/8 faithful, 3/8 drifted (re-stamping), 0 invented |
| 2026-07-18 | agentic-research | 〃 | **overall** | B | B | **human = B ("definitely better but not great")** — first unanimous judge–human agreement |
| 2026-07-19 | agentic-research | [writing-threeway](../experiments/agentic-research/comparisons/2026-07-19-writing-threeway.md) | coverage | tie | tie | content byte-identical by design |
| 2026-07-19 | agentic-research | 〃 | synthesis | tie | A=C>B | pass 2: atomization dilutes connected reasoning |
| 2026-07-19 | agentic-research | 〃 | instruction | A=B>C | tie | C's semicolon-fused step 5 |
| 2026-07-19 | agentic-research | 〃 | readability | A>B>C | A>B>C | 8/6/5 and 9/7/5 — decisive; only A renders references one-per-line |
| 2026-07-19 | agentic-research | 〃 | citation | tie | tie | fidelity: spartan 8/8 faithful (rule held) vs pocock 3/8 (pre-rule); live check deferred to two-way's 5/5 |
| 2026-07-19 | agentic-research | 〃 | **overall** | A>B>C | A>B>C | **human = A ("i prefer the spartan rewrite")** — second fully unanimous comparison |

Key: A/B are the comparison's blind labels — resolve via each comparison file's Key line. Costs live in RUN.md frontmatter.

**Meta-metrics to date**: judge–human overall agreement **5/10 passes** (last two comparisons fully unanimous); inter-pass overall agreement 4/4 on small comparisons, 0/1 on the four-way; spot-check totals 41 SUPPORTED / 6 PARTIAL / 1 UNSUPPORTED across 48 live claims; stage-fidelity: pocock 5/8 faithful + 3 re-stamping drifts (pre-rule) vs spartan 8/8 faithful (under the no-re-stamping rule) — the loop's rule change eliminated its target failure mode.

**Loop obligations open**:

- ~~2× judge–human disagreement → propose reweighting/judge-briefing/argued-taste~~ **discharged 2026-07-18** by the loop iteration below (PR: preferences formatting + judge-briefing amendment); the agentic-research verdict added the missing signal — the owner's readability concern is *formatting mechanics* (paragraph breaks, one-citation-per-line), which the rubric's readability dimension wasn't naming.
- v2 cross-provider re-judge of all v1-fallback comparisons once the provider hold lifts.
- Four-way order-sensitivity: watch whether overall splits recur at n=4; if so, consider a third tie-break pass or pairwise decomposition (no proposal yet — one data point).
- Writing-stage verdict loop iteration (2026-07-18): proposal PR filed — rendered-output formatting preference (bullet-listed references), derived-stack pattern standardized, edit-stage dispatch rules (scope + no citation re-stamping). Owner usage-model note (spartan everyday / daymade deep; synthesis interest) recorded in the verdict and the map's writing-skill fog.
