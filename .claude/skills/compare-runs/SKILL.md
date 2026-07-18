---
name: compare-runs
description: Run a blind, order-swapped, rubric-scored comparison across an experiment's runs and file the comparison. Use when the user wants runs compared, judged, or evaluated against each other, or asks which variant did better.
---

Produce a **comparison** across two or more complete runs of one experiment, per [`docs/agents/research-harness.md`](../../../docs/agents/research-harness.md) — read it first; it owns the rubric, the judge protocol, and the comparison template. The judge sees anonymous reports; you hold the key.

## Steps

1. **Load the experiment**: PROMPT.md's rubric (conventions default where it doesn't override) and the runs to compare — the user's selection, else every `status: complete` run not yet in a comparison. Done when: ≥2 runs and a rubric are fixed.
2. **Build the blind pack** in the scratchpad, per the protocol: neutral labels randomized, identity markers stripped, superficial format normalized, key kept out of any judge context. Record each report's length. Done when: a reviewer reading only the pack could not name a variant.
3. **Judge twice**: two fresh subagents, presentation order swapped between them, each scoring every rubric dimension relatively with rationale, judging end-state not process. Then a **citation spot-check**: ≥5 claim–source pairs per report, each verified against the cited source. Done when: both passes cover every dimension and the spot-check table is full.
4. **File the comparison** on branch `compare/<experiment>`: the template filled — scores with pass agreement, disagreements flagged rather than averaged, judge model and caveats recorded, key unblinded, "Human verdict" left empty for the owner. Update PROMPT.md's Status and append a dated entry to the experiment's `OBSERVATIONS.md` (judge quirks, protocol friction, anything the comparison file's structure doesn't hold). Commit, push, PR titled `compare(<experiment>): <slug>`. Done when: the PR is open and the comparison file contains every template section, with Human verdict present and empty.
