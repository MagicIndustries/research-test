# P6 Counter-Review (manual mode — counter-review team unavailable in this session)

Method: opposite-view checks on each major conclusion; single-source dependency scan; staleness scan against AS_OF 2026-07-18. Found 6 issues (≥3 required).

## Issues found

1. **[HIGH — fixed] GAIA 55-vs-67 treated as a clean "open vs hosted gap."** The two numbers come from different parties measuring their own systems (HF self-reporting 55% for its replication [26]; OpenAI self-reporting 67.36% [8]) under non-identical conditions and in the early-2025 era. Presenting them as one quantified comparison overstated comparability. **Fix applied:** caveat added in summary TL;DR/§3 context and in open-source-frameworks/README.md trade-off table.

2. **[MEDIUM — fixed] Perplexity facts are stale as well as secondary.** All Perplexity claims rest on a Feb 2025 TechCrunch piece [13]; by AS_OF, pricing/caps/API state have likely changed. The draft flagged the secondary-source problem but not staleness. **Fix applied:** staleness noted in summary §6 and commercial-products/README.md.

3. **[MEDIUM — fixed] The §4 "convergence" thesis has survivorship/selection bias.** The shared-ingredients list is read from systems that publish their methods (Anthropic, LangChain, STORM, one community skill); systems that don't publish may use different methods, and publication itself may drive the apparent convergence. **Fix applied:** explicit caveat sentence added to §4.

4. **[LOW — accepted with labeling] 68.78% human-agreement ceiling is a single source.** The figure and the judge-migration narrative come solely from the benchmark maintainers' repo [43]; no independent replication. Draft already attributes it explicitly to the maintainers; left as-is with attribution language, confidence unchanged (it is the primary source for its own benchmark).

5. **[LOW — already disclosed] Anthropic engineering-post dates are partly inferred.** Publication dates for [7]/[33] were inferred from content by task-d; task-a's fetch supplied 2025-06-13 for [7]. Disclosure exists in multi-agent-pipelines/README.md Gaps; no further action.

6. **[LOW — accepted] Claude Science [15] and Weizhena [51] retained despite weak verification.** Both are single weak sources kept because each supports a materially useful, explicitly-flagged claim (mid-2026 Anthropic product direction; existence of a star-leading community skill). Both carry inline Low-confidence/unreviewed labels in every place they are cited. Risk accepted knowingly.

## Opposite-view checks on the three headline conclusions

- **"Multi-agent orchestration is the SOTA architecture"** — the report does NOT conclude this; it presents the token-spend confound [7] and the Cognition dissent [38] as an open controversy. Check passed.
- **"Vendor benchmarks demonstrate product quality"** — report treats all vendor numbers as self-reported and foregrounds the independent 3–13% citation-hallucination audit [14]. Check passed.
- **"LLM judges can rank research reports"** — report conditions this on fixed-judge/within-comparison validity and the JUDGE-BENCH task-conditionality evidence [41][43]. Check passed.

## Single-source high-impact claims register

| Claim | Source | Handling |
|---|---|---|
| 90.2% multi-agent advantage; 15x tokens; 80% variance | [7] vendor internal | flagged self-reported everywhere cited |
| Claude Science launch | [15] snippet | Low confidence, "unconfirmed" |
| All Perplexity facts | [13] journalism | Low confidence + staleness note |
| 68.78% human ceiling; judge migration | [43] maintainers | attributed to maintainers |
| DeerFlow 2.0 repositioning | [27] own README | primary for its own project — acceptable |
