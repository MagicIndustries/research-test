---
task_id: a
role: Research Historian & Terminologist
status: complete
sources_found: 15
---

## Sources

[1] WebGPT: Browser-assisted question-answering with human feedback | https://arxiv.org/abs/2112.09332 | Source-Type: academic | As Of: 2021-12 | Authority: 9/10
[2] ReAct: Synergizing Reasoning and Acting in Language Models | https://arxiv.org/abs/2210.03629 | Source-Type: academic | As Of: 2022-10 | Authority: 9/10
[3] Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena | https://arxiv.org/abs/2306.05685 | Source-Type: academic | As Of: 2023-06 | Authority: 9/10
[4] Building Effective AI Agents (Anthropic) | https://www.anthropic.com/research/building-effective-agents | Source-Type: official | As Of: 2024-12 | Authority: 9/10
[5] How we built our multi-agent research system (Anthropic) | https://www.anthropic.com/engineering/multi-agent-research-system | Source-Type: official | As Of: 2025-06 | Authority: 9/10
[6] Google introduces Gemini 2.0: A new AI model for the agentic era | https://blog.google/technology/google-deepmind/google-gemini-ai-update-december-2024/ | Source-Type: official | As Of: 2024-12 | Authority: 9/10
[7] The Rise of Agent-Based Deep Research (Aaron Tay) | https://aarontay.substack.com/p/the-rise-of-agent-based-deep-research | Source-Type: secondary-industry | As Of: 2025-02 | Authority: 7/10
[8] Characterizing Deep Research: A Benchmark and Formal Definition | https://arxiv.org/abs/2508.04183 | Source-Type: academic | As Of: 2025-08 | Authority: 8/10
[9] GPT Researcher - Autonomous AI Research Agent | https://gptr.dev/ | Source-Type: official | As Of: 2026 | Authority: 6/10
[10] Introducing Perplexity Deep Research | https://www.perplexity.ai/hub/blog/introducing-perplexity-deep-research | Source-Type: official | As Of: 2025-02 | Authority: 8/10
[11] Introducing Perplexity Deep Research (Simon Willison) | https://simonwillison.net/2025/Feb/16/introducing-perplexity-deep-research/ | Source-Type: secondary-industry | As Of: 2025-02 | Authority: 7/10
[12] Deep Research: A Systematic Survey | https://arxiv.org/pdf/2512.02038 | Source-Type: academic | As Of: 2025-12 | Authority: 8/10
[13] Google launched its deepest AI research agent yet (TechCrunch) | https://techcrunch.com/2025/12/11/google-launched-its-deepest-ai-research-agent-yet-on-the-same-day-openai-dropped-gpt-5-2/ | Source-Type: journalism | As Of: 2025-12 | Authority: 7/10
[14] Deep Research Max: a step change for autonomous research agents (Google) | https://blog.google/innovation-and-ai/models-and-research/gemini-models/next-generation-gemini-deep-research/ | Source-Type: official | As Of: 2026-04 | Authority: 8/10
[15] STORM: How Stanford Built a Two-Stage Pipeline (Starlog) | https://starlog.is/articles/ai-agents/stanford-oval-storm/ | Source-Type: secondary-industry | As Of: 2024 | Authority: 5/10

## Findings

- WebGPT (Nakano et al., Dec 17, 2021) fine-tuned GPT-3 to answer long-form ELI5 questions in a text-based web-browsing environment with search, navigation, and human feedback, making it the earliest direct ancestor of search-and-cite research agents. [1]
- ReAct (Yao et al., Oct 2022, Princeton/Google) established the interleaved reasoning-trace-plus-action paradigm that underlies virtually all later research-agent loops. [2]
- The term "LLM-as-a-judge" was established by Zheng et al. (arXiv 2306.05685, June 2023, NeurIPS 2023 Datasets & Benchmarks), showing GPT-4 judges match human preferences at over 80% agreement while identifying position, verbosity, and self-enhancement biases. [3]
- Anthropic's "Building Effective Agents" (Dec 2024) supplies the canonical definition of the orchestrator-workers workflow: "a central LLM dynamically breaks down tasks, delegates them to worker LLMs, and synthesizes their results," recommended for tasks where subtasks cannot be predicted in advance. [4]
- Anthropic's Research feature (blog post June 13, 2025) applies the orchestrator-worker pattern with a lead Claude Opus 4 agent spawning parallel Claude Sonnet 4 subagents, outperforming a single-agent baseline by 90.2% on internal evals at roughly 15x chat-level token cost. [5]
- Anthropic evaluated its research system with rubric-based LLM-as-judge scoring (factual accuracy, citation accuracy, completeness, source quality, tool efficiency, 0.0-1.0 scale) plus human review. [5]
- Google announced Deep Research on December 11, 2024 as a Gemini Advanced feature that "explores complex topics and compil[es] reports on your behalf," making Google the first vendor to ship a product named "Deep Research". [6]
- OpenAI launched its Deep Research agent on February 2, 2025 (built on the o3 model), and Perplexity followed on February 14, 2025, making Perplexity the third company to release a product with "Deep Research" in the name. [11]
- Perplexity's launch post defines the capability operationally: it "performs dozens of searches, reads hundreds of sources, and reasons through the material" in 2-4 minutes to deliver a comprehensive cited report, offered free to all users. [10]
- Precursors include GPT Researcher (open-source autonomous agent producing multi-source cited reports, launched 2023 by Assaf Elovic) and Stanford OVAL's STORM (NAACL 2024), which Aaron Tay calls possibly "the first 'deep research' system" for generating full Wikipedia-like cited articles via perspective-guided multi-agent conversations. [9]
- The first formal academic characterization of "deep research" (Java et al., Microsoft, Aug 2025) defines it by "the high fan-out over concepts required during the search process, i.e., broad and reasoning-intensive exploration" rather than by report length. [8]
- Later developments include an academic consolidation ("Deep Research: A Systematic Survey," Dec 2025), Google's Gemini 3 Pro-based Deep Research relaunch on December 11, 2025, and Deep Research Max on Gemini 3.1 Pro in April 2026. [12]

## Deep Read Notes

### Source [6]: Google introduces Gemini 2.0 (blog.google)
Key data: December 11, 2024; Deep Research launched in Gemini Advanced, powered by Gemini 2.0-era reasoning and long context; quote: "explores complex topics and compiling reports on your behalf."
Key insight: Primary-source proof that Google, not OpenAI, first shipped the product name "Deep Research" (Dec 2024, two months before OpenAI).
Useful for: term-coinage question and the Dec 2024 point on the lineage timeline.

### Source [7]: The Rise of Agent-Based Deep Research (Aaron Tay)
Key data: Article dated Feb 20, 2025; timeline: Gemini Deep Research (late 2024), Ai2 ScholarQA (Jan 2025), OpenAI Deep Research on o3 (Feb 2, 2025), Perplexity plus SciSpace "Deep Review" and Elicit "Research Reports" (Feb 2025); flags STORM, Undermind.ai, PaperQA2 as precursors.
Key insight: Treats "deep research" as an emergent category label rather than a coined trademark, and is the best single contemporaneous chronicle of the Dec 2024-Feb 2025 explosion.
Useful for: lineage section and the "who popularized the term" analysis.

### Source [8]: Characterizing Deep Research (arXiv 2508.04183)
Key data: Submitted Aug 6, 2025 by Java, Khandelwal, et al.; defines deep research via "high fan-out over concepts... broad and reasoning-intensive exploration"; proposes intermediate representation of "key claims uncovered during search"; measures branching/backtracking of current DR systems.
Key insight: The first attempt at a formal, vendor-neutral definition, explicitly decoupling deep research from long report generation.
Useful for: the definitions section of the research question.

### Source [5]: How we built our multi-agent research system (Anthropic)
Key data: June 13, 2025; lead agent "coordinates the process while delegating to specialized subagents that operate in parallel"; 90.2% eval gain over single Opus 4; agents use ~4x, multi-agent systems ~15x chat tokens; LLM-as-judge rubric with 0.0-1.0 scores.
Key insight: Only vendor primary source that quantifies both the benefit (90.2%) and cost (15x tokens) of the orchestrator-worker pattern for research agents.
Useful for: orchestrator-worker definition and the Anthropic Claude Research entry in the lineage.

## Gaps

- Could not surface a primary openai.com URL for the Feb 2, 2025 "Introducing deep research" announcement in search results (only secondary confirmations); likewise no primary URL for the RAG paper (Lewis et al. 2020, NeurIPS - cited in results but without a link) or for AutoGPT's March 2023 GitHub launch, so those lineage nodes rest on secondary sourcing.
- Counter-claim candidate: Aaron Tay [7] dates Gemini Deep Research to "November 2024" and some secondary comparisons claim Deep Research was "initially released" by OpenAI in February 2025, both contradicting Google's own blog dating the first "Deep Research" product to December 11, 2024 [6]; the Dec 11, 2024 primary source should be preferred, but the discrepancy shows term-origin attribution is contested in secondary literature.
- Methodological limitation: no source definitively identifies who coined the phrase "deep research" as a generic term (it predates AI products in ordinary English), so claims can only address who first productized and popularized it.

## END
