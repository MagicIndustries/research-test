---
task_id: a
role: AI Research Historian
status: complete
sources_found: 7
---

## Sources

[1] Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks (Lewis et al.) | https://arxiv.org/abs/2005.11401 | Source-Type: academic | As Of: 2020-05 | Authority: 9/10
[2] WebGPT: Browser-assisted question-answering with human feedback (Nakano et al., OpenAI) | https://arxiv.org/abs/2112.09332 | Source-Type: academic | As Of: 2021-12 | Authority: 9/10
[3] ReAct: Synergizing Reasoning and Acting in Language Models (Yao et al.) | https://arxiv.org/abs/2210.03629 | Source-Type: academic | As Of: 2022-10 | Authority: 9/10
[4] Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena (Zheng et al.) | https://arxiv.org/abs/2306.05685 | Source-Type: academic | As Of: 2023-06 | Authority: 9/10
[5] Try Deep Research and our new experimental model in Gemini, your AI assistant (Google, The Keyword) | https://blog.google/products/gemini/google-gemini-deep-research/ | Source-Type: official | As Of: 2024-12 | Authority: 8/10
[6] Deep Research System Card (OpenAI) | https://cdn.openai.com/deep-research-system-card.pdf | Source-Type: official | As Of: 2025-02 | Authority: 9/10
[7] How we built our multi-agent research system (Anthropic Engineering) | https://www.anthropic.com/engineering/built-multi-agent-research-system | Source-Type: official | As Of: 2025-06 | Authority: 8/10

## Findings

- The RAG paradigm was defined in May 2020 by Lewis et al. as "models which combine pre-trained parametric and non-parametric memory for language generation," pairing a pre-trained seq2seq model with a dense vector index of Wikipedia accessed by a neural retriever. [1]
- WebGPT (submitted to arXiv 2021-12-17) fine-tuned GPT-3 to answer long-form questions in a text-based web-browsing environment, required the model to collect supporting references while browsing, and its best model's answers were preferred by humans 56% of the time over human demonstrators' answers. [2]
- ReAct (October 2022) established the interleaved reasoning-and-acting loop — reasoning traces alternating with tool actions against external sources such as a Wikipedia API — that underlies later agentic tool use, reducing hallucination on HotpotQA and Fever versus chain-of-thought alone. [3]
- Zheng et al. (June 2023) formalized "LLM-as-a-judge" as using strong LLMs to evaluate other models on open-ended questions, showing GPT-4 judges reach over 80% agreement with human preferences — the same level as human-human agreement — while cataloguing position, verbosity, and self-enhancement biases. [4]
- Google launched Deep Research on 2024-12-11 as "our new agentic feature in Gemini Advanced" that, under user supervision, "creates a multi-step research plan" for the user to revise or approve before analyzing information from across the web into a comprehensive report (vendor self-reported description). [5]
- OpenAI's Deep Research System Card (dated February 25, 2025) defines deep research as "a new agentic capability that conducts multi-step research on the internet for complex tasks," powered by an early version of OpenAI o3 optimized for web browsing. [6]
- OpenAI's deep research model was trained via reinforcement learning on new browsing datasets, with responses graded against ground-truth answers or rubrics by a chain-of-thought model acting as grader — an LLM-as-judge mechanism inside the training loop (vendor self-reported). [6]
- Anthropic (June 13, 2025) defines its Research feature's architecture as "a multi-agent architecture with an orchestrator-worker pattern, where a lead agent coordinates the process while delegating to specialized subagents that operate in parallel," and defines a multi-agent system as "multiple agents (LLMs autonomously using tools in a loop) working together." [7]
- Anthropic reports (vendor self-reported, internal eval) that a multi-agent system with Claude Opus 4 as lead and Claude Sonnet 4 subagents outperformed single-agent Claude Opus 4 by 90.2% on its internal research eval, while noting multi-agent systems use about 15x more tokens than chat interactions. [7]
- OpenAI's system card flags prompt injection — malicious instructions embedded in web pages the agent browses — as a defining risk category for deep research agents, with harms including inaccurate answers and data exfiltration. [6]

## Deep Read Notes

### Source [2]: WebGPT: Browser-assisted question-answering with human feedback
Key data: arXiv submission date 2021-12-17 (citation_date 2021/12/17; online date 2022/06/01); 18 OpenAI authors including Nakano, Hilton, Schulman; evaluated on ELI5 (Reddit questions); best model = behavior cloning + rejection sampling against a human-preference reward model; answers preferred 56% vs human demonstrators and 69% vs highest-voted Reddit answer.
Key insight: The direct bridge between RAG and deep research products — it moved retrieval from a fixed corpus index to live web browsing (search + navigate) and made citation collection a mandatory part of the task, the two features that define later "deep research" outputs.
Useful for: The 2020-2026 lineage's middle link (RAG -> browsing agents) and the origin of citation-backed AI answers.

### Source [6]: Deep Research System Card (OpenAI)
Key data: Dated February 25, 2025; deep research powered by "an early version of OpenAI o3 that is optimized for web browsing"; trained by reinforcement learning on new browsing datasets (searching, clicking, scrolling, interpreting files, sandboxed python tool); training responses graded against ground truth or rubrics "using a chain-of-thought model as a grader"; ChatGPT deployment adds a custom-prompted o3-mini summarizer; launched first to Pro users; safety sections cover prompt injection, bio/chem, cybersecurity, AI self-improvement thresholds.
Key insight: The only primary-source definition of OpenAI's "deep research" plus the disclosure that LLM graders (LLM-as-judge) were used inside the RL training loop — tying two of the task's key terms together in one document.
Useful for: Authoritative definition of "deep research"; the commercial-product endpoint of the lineage; evidence that RL-on-browsing (WebGPT's method scaled up) produced the product.

### Source [7]: How we built our multi-agent research system (Anthropic)
Key data: Published Jun 13, 2025; orchestrator-worker pattern with lead agent + parallel specialized subagents; multi-agent (Opus 4 lead, Sonnet 4 workers) beat single-agent Opus 4 by 90.2% on internal research eval; agents use ~4x more tokens than chat, multi-agent systems ~15x more.
Key insight: The canonical published definition of the orchestrator-worker multi-agent pattern for research agents, including the economic caveat (15x token cost) that constrains when the pattern is justified.
Useful for: Authoritative definitions of "research agent" and "orchestrator-worker"; the post-product architectural phase (2025) of the lineage.

## Gaps

- Could not verify OpenAI's "Introducing deep research" launch blog post (openai.com/index/introducing-deep-research/) directly: both openai.com and its Wayback Machine capture returned Cloudflare JavaScript challenges, so the commonly cited February 2, 2025 launch date could not be confirmed from a live primary fetch; the system card's February 25, 2025 date is the closest primary-source date obtained. Related: the Humanity's Last Exam score claim for deep research could not be verified from a fetchable primary source.
- DuckDuckGo HTML search became rate-limited after the first query, so no live search results were obtained for "orchestrator worker multi-agent Anthropic" or Perplexity/xAI deep-research launches; earlier or competing uses of the term "deep research" before Google's December 2024 launch could not be checked.
- Counter-claim candidate: Anthropic's 90.2% multi-agent improvement is a vendor self-reported number on an unpublished internal eval, and Anthropic's own post reports ~15x token cost for multi-agent systems — a plausible alternative reading is that orchestrator-worker gains largely reflect increased token/compute spend rather than the architecture itself, and single-agent systems at matched budgets might close much of the gap.
- Counter-claim candidate: Google's framing of Deep Research as new in December 2024 is vendor self-reported; the underlying capability (plan -> browse -> cite -> report) was demonstrated by WebGPT in December 2021, so "invention" claims by any single vendor in 2024-2025 are contestable — what was new was productization and long-horizon autonomy, not the browsing-research loop itself.

## END
