# Observations — second-brain

Dated log of anything noticed while working this experiment: anomalies, friction, hypothesis drift, judge quirks. Appended by every session that touches the experiment; raw material for the self-improvement loop.

## 2026-07-18 — launch runs (research--fable--cc, spartan-deep-research--fable--cc)

- **Cost hypothesis wobbling already**: Spartan deep-research used 93,315 tokens vs the baseline's 90,493 — near-identical — and was *faster* (8m32s vs 9m29s). The hypothesis's "meaningfully higher cost" clause doesn't hold at this scale; the comparison should judge whether the quality gap (if any) is free.
- **Conclusion convergence**: both runs independently landed on the same headline recommendation (plain-Markdown vault + agent-maintained wiki + kepano/obsidian-skills). Discriminating signal will be evidence quality and verification depth, not verdicts.
- **Verification asymmetry**: Spartan's explicit verify step surfaced source contradictions the baseline never looked for — Screenpipe's marketing (MIT, $400 lifetime) vs its own repo (source-available, $25/mo), an Obsidian announcement misdated by secondary sources, vendor-self-reported and mutually inconsistent Mem0/Zep benchmarks. The citation spot-check should test whether this depth survives blinding.
- **Harness quirk**: both background agents had the Write tool denied for the run's `output/` path and fell back to shell heredocs (content unaffected). Worth understanding before it bites a run that can't fall back.
- **Length gap**: 4,034 vs 3,170 words — verbosity bias is live in this comparison; judges must see lengths reported per protocol.

## 2026-07-18 — first blind comparison (research vs spartan-deep-research)

- **Verbosity bias did not decide it**: the *shorter* report won both passes — either the anti-volume instruction worked or the gap was real. Worth re-testing when a comparison has a bigger length spread.
- **Order-swap earned its cost in nuance, not direction**: no dimension flipped between passes, but magnitudes moved (tie↔slightly, slightly↔strongly) on three of five dimensions. Two passes look worth keeping for calibration even when directions agree.
- **The interesting result is dimensional, not overall**: baseline won on citation discipline and literal instruction-following; spartan won synthesis (conflicts, dissent, gaps) in both passes. A stacked variant (spartan's verify/synthesize + baseline's primary-source rule) is an obvious future experiment.
- **Spot-check calibration**: judges' citation verdicts matched the live spot-check (baseline 5/6 clean vs spartan 4/6) — a small sign the blind judging tracks verifiable ground truth. All three PARTIALs were *attribution* errors (right number, wrong source), not fabrications; 0 UNSUPPORTED across 12 claims.
- **Hypothesis outcome**: "deep research is better but costs more" — half-falsified. Cost was identical; quality differences were dimensional, not overall. PROMPT.md hypotheses should predict *dimensions*, not just winners.

## 2026-07-18 — human verdict recorded

- **Human overrode the LLM judges**: owner prefers Spartan overall; both blind passes said "slightly A" (baseline). The disagreement is legible from the dimensional scores — the owner weights depth of synthesis, self-criticism, and readability-with-TL;DR above literal instruction-following and strict primary-sourcing, roughly inverting the judges' implicit weights. First direct evidence that the default rubric's *unweighted* dimensions don't match owner priorities: the self-improvement design (#8) should consider owner-declared dimension weights in PROMPT.md, and the judges' overall verdict should perhaps be dropped in favor of dimensions-only + human weighting.
- The owner's per-dimension preference notes (in the comparison's Human verdict section) double as the requirements seed for the future own-research-agent map.
