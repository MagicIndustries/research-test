# Observations — agentic-research

Dated log per the conventions.

## 2026-07-18 — four launch runs (parallel)

- **Cost-spread hypothesis part-falsified**: prediction was ±20% across skills on the same model; actual spread was baseline 83.9k → spartan 113.3k → daymade 141.9k tokens (+69% over baseline). Orchestration has a real token price — though daymade's includes a persistent evidence trail (52-source citation registry, per-subagent notes) no other variant produces.
- **Model contrast, first look**: sonnet (spartan) wrote ~15,400 words vs fable (spartan) ~6,600 on the same prompt — a 2.3× verbosity gap at similar token cost. Fable spent tokens on verification-per-word; sonnet on words. Verbosity bias controls will matter in this comparison.
- **Harness constraint discovered**: a session-wide WebSearch cap (200/200) exists and was hit by the daymade run mid-pipeline (it degraded gracefully to direct WebFetch). Running four research agents in one parallel window shares that budget — future multi-run windows should stagger or budget searches per run.
- **Recurring Write-denial quirk** hit every run again (heredoc fallback held). Worth a permissions fix before runs that can't fall back.
- **Prompt encoding worked**: all four outputs produced TL;DR-first summaries, early definitions, per-approach subdirectories, and owner-tailored recommended-steps — the qualities that vanished in second-brain-original when unrequested. Prompt-level encoding of the preferences doc held across skills and models.
- **Convergent meta-finding across all four runs**: every variant independently identified the same core ingredients (plan-first, parallel subagents with context isolation, effort scaling, citation verification, rubric-based judging) and flagged that no independent head-to-head evaluation of research systems exists — the gap this repo's harness sits in.

## 2026-07-18 — four-way comparison (v1 fallback judge)

- **Judge ran as the v1 fallback** (Claude judging Claude) under the owner's provider hold — first comparison filed under the hold; queued for v2 re-judging when the Google API account arrives.
- **First order-swap disagreement on an overall verdict**: pass 1 (read A→D) picked daymade; pass 2 (read D→A) picked spartan-fable, demoting daymade for disclosed coverage gaps ("disclosed absence is still absence"). Two-report comparisons so far had perfect agreement — four-way ranking appears materially more order-sensitive, and the passes even weighted honesty-about-gaps in opposite directions (pass 1 credits it under instruction-following, pass 2 refuses to let it offset coverage). The protocol's flag-don't-average rule is earning its keep.
- **Dimension-level agreement was still solid**: both passes agree daymade leads synthesis + citation quality, baseline `/research` is most readable but thinnest on evidence, spartan-sonnet is the hardest to read. The disagreement is confined to how the stable dimension picture should aggregate.
- **Blinding was harder than previous comparisons**: the topic *is* research skills, so reports legitimately name the skills under test as survey subjects; three explicit self-identifications had to be neutralized (daymade's pipeline banner ×2, spartan-fable's header, plus one self-referential aside in spartan-sonnet). Content mentions of skill names were left — a judge can't be blinded to the field itself.
- **Spot-check near-ceiling**: 19/20 supported, 1 partial (an understatement, not an inflation), 0 unsupported. At this citation-fidelity level the spot-check stops discriminating between variants — the differentiator was attribution precision, which the rubric's citation dimension already captured. Future experiments may need a harder verification probe (e.g., sampling only conflicting-number claims) to regain signal.
- **Verbosity did not buy verdicts**: the two longest reports (spartan-sonnet 15.3k words, daymade 18k) did not sweep either pass; the 6.6k-word spartan-fable won pass 2 outright. Encouraging sign against verbosity bias, worth tracking across comparisons.
