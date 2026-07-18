---
task_id: e
role: Evaluation Methodologist
status: complete
sources_found: 9
---

## Sources

[1] A Survey on LLM-as-a-Judge | https://arxiv.org/abs/2411.15594 | Source-Type: academic | As Of: 2025-10 | Authority: 8/10
[2] Justice or Prejudice? Quantifying Biases in LLM-as-a-Judge | https://arxiv.org/abs/2410.02736 | Source-Type: academic | As Of: 2024-10 | Authority: 7/10
[3] LLMs instead of Human Judges? A Large Scale Empirical Study across 20 NLP Evaluation Tasks (JUDGE-BENCH) | https://arxiv.org/abs/2406.18403 | Source-Type: academic | As Of: 2025 | Authority: 8/10
[4] DeepResearch Bench: A Comprehensive Benchmark for Deep Research Agents | https://arxiv.org/abs/2506.11763 | Source-Type: academic | As Of: 2025-06 | Authority: 9/10
[5] DeepResearch Bench GitHub repository (RACE/FACT implementation + 2026 evaluator migration) | https://github.com/Ayanami0730/deep_research_bench | Source-Type: official | As Of: 2026-05 | Authority: 8/10
[6] Deep Research Bench: Evaluating AI Web Research Agents (FutureSearch) | https://arxiv.org/abs/2506.06287 | Source-Type: academic | As Of: 2025-05 | Authority: 7/10
[7] BrowseComp: A Simple Yet Challenging Benchmark for Browsing Agents (OpenAI) | https://arxiv.org/abs/2504.12516 | Source-Type: academic | As Of: 2025-04 | Authority: 8/10
[8] GAIA: a benchmark for General AI Assistants | https://arxiv.org/abs/2311.12983 | Source-Type: academic | As Of: 2023-11 | Authority: 8/10
[9] Humanity's Last Exam | https://arxiv.org/abs/2501.14249 | Source-Type: academic | As Of: 2025 (v10) | Authority: 8/10

## Findings

- The central open question framed by the LLM-as-a-Judge literature is reliability: the major survey (v6, updated Oct 2025) organizes the field around building reliable judge systems via consistency improvement, bias mitigation, and adaptation to diverse assessment scenarios, plus a benchmark for evaluating judge reliability itself. [1]
- The CALM framework identifies 12 distinct bias types in LLM judges and finds via principle-guided perturbation that even advanced models retain significant biases on specific tasks, cautioning against unvalidated use of judges for benchmarks and reward signals. [2]
- JUDGE-BENCH (ACL 2025), covering 20 human-annotated NLP datasets and 11 LLMs, finds judge-human agreement varies substantially by model, by evaluated property, by human-judge expertise level, and by whether text is human- or model-generated — concluding LLM judges must be validated against humans per-task before use. [3]
- DeepResearch Bench comprises 100 PhD-level research tasks crafted by domain experts across 22 fields, and scores deep-research agents with two frameworks: RACE (reference-based, adaptive task-specific criteria for report quality) and FACT (effective citation count plus overall citation accuracy), both claiming strong alignment with human judgment. [4]
- RACE dynamically generates task-specific criteria across four dimensions — comprehensiveness, insight/depth, instruction-following, and readability — rather than using one fixed rubric for all reports. [4][5]
- FACT operationalizes citation accuracy end-to-end: extract statement-URL pairs from the report, deduplicate, then use web scraping plus LLM judgment to verify each cited source actually supports its claim. [5]
- As of May 2026 the DeepResearch Bench maintainers measured human inter-annotator agreement on report quality at only 68.78% (50 tasks x 4 agents), and all three frontier candidate judge models exceeded that human baseline by 1.3-3 points, prompting an evaluator migration from Gemini-2.5-Pro to GPT-5.5. [5]
- FutureSearch's Deep Research Bench takes the opposite design tack: 89 multi-step web research tasks with human-verified answers and a frozen "RetroSearch" web snapshot to control for the changing web, with automated trace evaluation tracking hallucinations, tool use, and forgetting in deployed "Deep Research" products. [6]
- BrowseComp (OpenAI, 1,266 questions) deliberately sidesteps report-quality judging by requiring short, easily verifiable answers to hard-to-find entangled information — its authors explicitly note it does not measure long-answer generation or ambiguity resolution typical of real research queries. [7]
- GAIA (466 real-world assistant questions with unambiguous factoid answers) and Humanity's Last Exam (2,500 expert-written closed-ended questions designed to resist quick internet retrieval) both use exact-match automated grading, so neither measures report synthesis quality; HLE additionally documents poor model calibration at the expert frontier. [8][9]

## Deep Read Notes

### Source [4]/[5]: DeepResearch Bench (paper + repository)
Key data: 100 PhD-level tasks, 22 fields, expert-authored. RACE = Reference-based Adaptive Criteria-driven Evaluation (four dimensions: comprehensiveness, insight/depth, instruction-following, readability; criteria generated per-task, scored against a reference report). FACT = Framework for Factual Abundance and Citation Trustworthiness (statement-URL extraction -> dedup -> scrape-and-verify support -> citation accuracy + effective citation count). May 2026 repo update: human inter-annotator agreement baseline 68.78%; candidate judges GPT-5.5 (71.82 overall alignment), Gemini-3.1-Pro (70.58), Claude-Opus-4-7 (70.11); RACE evaluator migrated to GPT-5.5, FACT to GPT-5.4-mini, with dual leaderboards during the transition window because scores are only comparable within a fixed evaluator.
Key insight: The de-facto standard for judging deep-research reports is adaptive per-task rubrics scored by a frontier LLM against a reference, and its own maintainers concede judge-model choice shifts rankings enough to require separate leaderboards — evaluator identity is part of the benchmark.
Useful for: Justifying rubric-based judged comparison of research reports; the 68.78% human-agreement ceiling is the key calibration number for how much judge-human alignment is even achievable.

### Source [3]: JUDGE-BENCH (LLMs instead of Human Judges?)
Key data: 20 NLP datasets with human annotations, 11 open and proprietary LLMs tested for ability to replicate human judgments. Result: substantial variance across models and datasets; reliability depends on the property evaluated, annotator expertise, and human- vs model-generated text.
Key insight: There is no blanket validity claim for LLM judges — agreement with humans is task-conditional, and it is weakest exactly where deep-research evaluation lives (expert-level judgments of model-generated long text).
Useful for: The counter-claim side of any comparison protocol; motivates per-rubric validation and cross-provider judging rather than trusting a single judge.

### Source [6]: Deep Research Bench (FutureSearch)
Key data: 89 task instances, 8 categories, answers worked out by skilled humans; frozen RetroSearch page set makes evaluation reproducible over time; offline agents shown to perform comparably to live-web agents; public leaderboard evaluates deployed Deep Research products; automated trace analysis for hallucinations, tool use, forgetting.
Key insight: Answer-verifiable benchmarks with frozen corpora solve reproducibility but trade away exactly what rubric benchmarks measure (synthesis, insight, citation practice) — the field splits into verifiable-answer vs judged-report camps with no benchmark doing both well.
Useful for: Choosing between exact-match and rubric evaluation designs; evidence that deployed products can be compared on hallucination rates via trace audits.

## Gaps

- Could not find (in live-retrieved sources) a peer-reviewed study quantifying citation accuracy of specific deployed deep-research products (e.g., an audited citation-error percentage for OpenAI or Gemini Deep Research); FACT-style leaderboard scores exist but per-product audited figures were not retrieved this session.
- Could not verify position/verbosity/self-enhancement bias magnitudes from a live source beyond the CALM paper's abstract-level claim of "12 biases, significant in specific tasks" (the MT-Bench quantifications are covered by another task).
- Counter-claim candidate: JUDGE-BENCH shows LLM judge-human agreement varies substantially and degrades on model-generated text judged by expert annotators — evidence that LLM judges may NOT reliably track human judgment for long expert-level research reports [3]; compounding this, DeepResearch Bench's own human inter-annotator agreement is only 68.78%, so "alignment with human judgment" for report quality is itself a noisy target [5].

## END
