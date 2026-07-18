# Observations — second-brain

Dated log of anything noticed while working this experiment: anomalies, friction, hypothesis drift, judge quirks. Appended by every session that touches the experiment; raw material for the self-improvement loop.

## 2026-07-18 — launch runs (research--fable--cc, spartan-deep-research--fable--cc)

- **Cost hypothesis wobbling already**: Spartan deep-research used 93,315 tokens vs the baseline's 90,493 — near-identical — and was *faster* (8m32s vs 9m29s). The hypothesis's "meaningfully higher cost" clause doesn't hold at this scale; the comparison should judge whether the quality gap (if any) is free.
- **Conclusion convergence**: both runs independently landed on the same headline recommendation (plain-Markdown vault + agent-maintained wiki + kepano/obsidian-skills). Discriminating signal will be evidence quality and verification depth, not verdicts.
- **Verification asymmetry**: Spartan's explicit verify step surfaced source contradictions the baseline never looked for — Screenpipe's marketing (MIT, $400 lifetime) vs its own repo (source-available, $25/mo), an Obsidian announcement misdated by secondary sources, vendor-self-reported and mutually inconsistent Mem0/Zep benchmarks. The citation spot-check should test whether this depth survives blinding.
- **Harness quirk**: both background agents had the Write tool denied for the run's `output/` path and fell back to shell heredocs (content unaffected). Worth understanding before it bites a run that can't fall back.
- **Length gap**: 4,034 vs 3,170 words — verbosity bias is live in this comparison; judges must see lengths reported per protocol.
