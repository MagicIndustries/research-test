---
task_id: e
role: Evaluation Methodologist
status: complete
sources_found: 10
---

## Sources

[1] DeepResearch Bench: A Comprehensive Benchmark for Deep Research Agents (Du et al.) | https://arxiv.org/abs/2506.11763 | Source-Type: academic | As Of: 2025-06 | Authority: 9/10
[2] DeepResearch Bench official repository (RACE/FACT implementation + leaderboard) | https://github.com/Ayanami0730/deep_research_bench | Source-Type: official | As Of: 2026-07 | Authority: 8/10
[3] Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena (Zheng et al., NeurIPS 2023) | https://arxiv.org/abs/2306.05685 | Source-Type: academic | As Of: 2023-12 | Authority: 10/10
[4] From Generation to Judgment: Opportunities and Challenges of LLM-as-a-judge (Li et al., EMNLP 2025 survey) | https://arxiv.org/abs/2411.16594 | Source-Type: academic | As Of: 2025-09 | Authority: 8/10
[5] Deep Research Bench: Evaluating AI Web Research Agents (Bosse et al., FutureSearch) | https://arxiv.org/abs/2506.06287 | Source-Type: academic | As Of: 2025-06 | Authority: 8/10
[6] BrowseComp: A Simple Yet Challenging Benchmark for Browsing Agents (Wei et al., OpenAI) | https://arxiv.org/abs/2504.12516 | Source-Type: academic | As Of: 2025-04 | Authority: 9/10
[7] GAIA: a benchmark for General AI Assistants (Mialon et al.) | https://arxiv.org/abs/2311.12983 | Source-Type: academic | As Of: 2023-11 | Authority: 9/10
[8] Humanity's Last Exam (Phan et al.) | https://arxiv.org/abs/2501.14249 | Source-Type: academic | As Of: 2026-02 | Authority: 9/10
[9] ResearchRubrics: A Benchmark of Prompts and Rubrics For Evaluating Deep Research Agents (Sharma et al., Scale AI) | https://arxiv.org/abs/2511.07685 | Source-Type: academic | As Of: 2025-11 | Authority: 8/10
[10] DeepResearchGym: A Free, Transparent, and Reproducible Evaluation Sandbox for Deep Research (Coelho et al., CMU) | https://arxiv.org/abs/2505.19253 | Source-Type: academic | As Of: 2025-05 | Authority: 8/10

## Findings

- Zheng et al. show that strong LLM judges like GPT-4 reach over 80% agreement with human preferences on MT-Bench (3,000 expert votes) and Chatbot Arena (30,000 conversations), the same level as human-human agreement. [3]
- The same paper identifies the canonical LLM-judge failure modes: position bias, verbosity bias, self-enhancement bias, and limited reasoning ability on math/grading questions. [3]
- The Li et al. EMNLP 2025 survey provides a systematic taxonomy of LLM-as-judge methods (what/how/where to judge) and catalogs open reliability challenges for the field. [4]
- DeepResearch Bench comprises 100 PhD-level research tasks crafted by domain experts across 22 fields, targeting agents that produce citation-rich analyst-grade reports. [1]
- Its RACE framework scores reports on four dimensions — Comprehensiveness, Insight/Depth, Instruction-Following, and Readability — using automatically generated task-specific criteria with dynamic per-task weights and a reference report for calibration. [2]
- Its FACT framework extracts statement-URL pairs, deduplicates them, and verifies whether each cited source actually supports the claim, yielding citation accuracy and average effective citations per task. [2]
- The human inter-annotator agreement baseline on DeepResearch Bench's 50-task annotated subset is only 68.78%, bounding how "aligned with humans" any judge can meaningfully be. [2]
- FutureSearch's Deep Research Bench uses 89 multi-step task instances across 8 categories with a frozen-web RetroSearch environment for reproducibility, and tracks hallucinations, tool use, and information forgetting in agent traces. [5]
- BrowseComp (OpenAI) sidesteps report-quality judging entirely with 1,266 hard-to-find-fact questions whose short answers are easily verified against references. [6]
- GAIA scores 466 real-world assistant questions by exact match and found humans at 92% versus 15% for GPT-4 with plugins, motivating tool-use-centric evaluation. [7]
- Humanity's Last Exam offers 2,500 expert-written closed-ended questions with unambiguous, automatically gradable answers, on which frontier models show low accuracy and poor calibration. [8]
- ResearchRubrics (Nov 2025) supplies 2,500+ expert-written fine-grained rubrics over 101 prompts and finds leading agents (Gemini and OpenAI Deep Research) achieve under 68% rubric compliance, mostly from missed implicit context and weak reasoning over retrieved evidence. [9]

## Deep Read Notes

### Source [3]: Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena
Key data: GPT-4 judge >80% agreement with humans, matching human-human consistency; 3,000 expert votes (MT-Bench), 30,000 Arena conversations.
Key insight: First rigorous validation that LLM judges approximate human preference at scale, while naming position/verbosity/self-enhancement biases that all later deep-research judges inherit.
Useful for: Foundational justification and caveat framing for any LLM-judged report-quality metric.

### Source [2]: DeepResearch Bench repo (RACE + FACT)
Key data: 100 tasks / 22 fields; 4 RACE dimensions with dynamic weights; FACT = extract-dedupe-verify pipeline giving citation accuracy + effective citations; human inter-annotator agreement 68.78% on 50 tasks.
Key insight: Separates report quality (RACE, reference-calibrated adaptive rubrics) from retrieval faithfulness (FACT, claim-level citation verification) as two independent axes.
Useful for: The de facto rubric-dimension template (comprehensiveness, insight, instruction-following, readability) for judging deep-research output.

### Source [5]: Deep Research Bench (FutureSearch)
Key data: 89 task instances, 8 task types; RetroSearch frozen-page corpus; offline agents shown to match live-web agent performance; automated tracking of hallucinations, tool use, forgetting.
Key insight: Web drift makes live benchmarks unstable — a frozen offline web is needed for longitudinal comparability of research agents.
Useful for: Reproducibility limitations of any citation-verification or web-research evaluation.

### Source [9]: ResearchRubrics
Key data: 2,500+ expert-written rubrics; task-complexity framework over 3 dimensions; Gemini DR and OpenAI DR under 68% rubric compliance.
Key insight: Human-authored per-prompt rubrics (rather than model-generated criteria as in RACE) expose failures — missed implicit context, shallow reasoning over retrieved facts — that holistic LLM scoring misses.
Useful for: 2025-2026 successor generation of deep-research evaluation and evidence that top agents still fail fine-grained expert criteria.

## Gaps

- Counter-claim candidate: human experts themselves agree only 68.78% of the time on DeepResearch Bench report rankings [2], and Zheng et al.'s self-enhancement/verbosity biases [3] imply an LLM judge can systematically diverge from expert judgment while still reporting high "alignment" — claims that RACE-style judges match humans are bounded by a noisy human ceiling, not validated against a gold standard.
- Could not fetch the official OpenAI BrowseComp announcement page (openai.com returned HTTP 403); BrowseComp facts are sourced from the arXiv paper only, and specific model score numbers were not in the abstract.
- Could not verify exact RACE-vs-human correlation coefficients from the paper full text (arXiv HTML version returns 404); only the repo's 68.78% inter-annotator baseline was confirmed.
- Did not find a dedicated 2025-2026 survey specifically on evaluating deep-research reports (as opposed to general LLM-as-judge surveys), nor a published study directly demonstrating rubric gaming (e.g., inflating RACE scores via verbosity) — this remains an inferred, not documented, limitation.
- Session web-search budget was exhausted before this task ran, so discovery relied on direct arXiv/GitHub API queries rather than open web search; secondary-industry and journalism coverage is therefore absent from the source mix.

## END
