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

Key: A/B are the comparison's blind labels — resolve via each comparison file's Key line. Costs live in RUN.md frontmatter.

**Meta-metrics to date**: judge–human overall agreement **0/2**; inter-pass directional agreement 10/10 dimensions; spot-check totals 17 SUPPORTED / 5 PARTIAL / 1 UNSUPPORTED across 23 claims.

**Loop obligations open**: 2× judge–human disagreement (both: judges weight literal compliance/citation above the owner's synthesis/self-criticism priority) → next loop iteration must propose reweighting, judge-briefing change, or argued-taste case (ADR-0001 §4).
