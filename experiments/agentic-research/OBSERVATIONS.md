# Observations — agentic-research

Dated log per the conventions.

## 2026-07-18 — four launch runs (parallel)

- **Cost-spread hypothesis part-falsified**: prediction was ±20% across skills on the same model; actual spread was baseline 83.9k → spartan 113.3k → daymade 141.9k tokens (+69% over baseline). Orchestration has a real token price — though daymade's includes a persistent evidence trail (52-source citation registry, per-subagent notes) no other variant produces.
- **Model contrast, first look**: sonnet (spartan) wrote ~15,400 words vs fable (spartan) ~6,600 on the same prompt — a 2.3× verbosity gap at similar token cost. Fable spent tokens on verification-per-word; sonnet on words. Verbosity bias controls will matter in this comparison.
- **Harness constraint discovered**: a session-wide WebSearch cap (200/200) exists and was hit by the daymade run mid-pipeline (it degraded gracefully to direct WebFetch). Running four research agents in one parallel window shares that budget — future multi-run windows should stagger or budget searches per run.
- **Recurring Write-denial quirk** hit every run again (heredoc fallback held). Worth a permissions fix before runs that can't fall back.
- **Prompt encoding worked**: all four outputs produced TL;DR-first summaries, early definitions, per-approach subdirectories, and owner-tailored recommended-steps — the qualities that vanished in second-brain-original when unrequested. Prompt-level encoding of the preferences doc held across skills and models.
- **Convergent meta-finding across all four runs**: every variant independently identified the same core ingredients (plan-first, parallel subagents with context isolation, effort scaling, citation verification, rubric-based judging) and flagged that no independent head-to-head evaluation of research systems exists — the gap this repo's harness sits in.
