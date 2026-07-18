# Agentic Deep Research: State of the Art — Report Index

Compiled 2026-07-18. This report surveys the current state of the art in agentic deep research: the methods, skills, prompts, and tools that make LLM agents produce excellent research reports.

**Start here:** [state-of-the-art.md](./state-of-the-art.md) — the main document. Opens with a TL;DR, then covers definitions (deep research, research agent, orchestrator-worker, LLM-as-judge), background/history, a comparative map of the four major approaches, an analysis of shared methodological ingredients, a summary of the evaluation literature, an explicit list of what could not be found, and a recommended-steps guide for a solo developer working in Claude Code with a skill-comparison harness.

## Structure

```
.
├── README.md                          (this file)
├── state-of-the-art.md                (main document — start here)
└── approaches/
    ├── single-prompt-skills/          Single agent/prompt running a research skill in an existing harness
    │   ├── README.md                  How it works, maturity/activity, trade-offs, getting-going guide
    │   └── resources.md               Annotated repos, papers, articles, videos
    ├── orchestrated-multi-agent/      Orchestrator (lead agent) + parallel worker sub-agents
    │   ├── README.md
    │   └── resources.md
    ├── commercial-products/           OpenAI Deep Research, Google Gemini Deep Research, Perplexity Deep Research (+ notes on others)
    │   ├── README.md
    │   └── resources.md
    └── open-source-frameworks/        STORM, GPT Researcher, LangChain open deep research, and others
        ├── README.md
        └── resources.md
```

## How to read this report

1. Read the TL;DR and Definitions in [state-of-the-art.md](./state-of-the-art.md) for shared vocabulary.
2. Read the Background section for how the field got here (WebGPT → ReAct → AutoGPT/BabyAGI → Gemini Deep Research (Dec 2024) → OpenAI Deep Research (Feb 2025) → Perplexity Deep Research (Feb 2025) → Anthropic's multi-agent architecture (Jun 2025) → the 2025-2026 evaluation/open-source maturation).
3. Use the approach-map table to decide which of the four `approaches/` subdirectories matters most for your situation, then read that subdirectory's `README.md` and `resources.md` in full — they contain the detailed evidence, trade-offs, getting-going instructions, and citations that the main document only summarizes.
4. Read the methodological-ingredients and evaluation-literature sections for what the best systems have in common and how research quality is actually measured (rubric-based LLM-as-judge scoring plus dedicated citation/hallucination auditing — no current system, commercial or open, reliably clears ~70% on expert rubrics).
5. Read the "What we could not find" section before treating any single number (especially hallucination rates and cross-approach quality comparisons) as settled.
6. If you're a solo developer working in Claude Code with a skill-comparison harness, go straight to the final "Recommended steps" section in [state-of-the-art.md](./state-of-the-art.md) for a concrete build order.

## Sourcing conventions used throughout

- Every load-bearing claim is cited with a URL.
- `[primary]` = original/official source (repo, paper, official docs, vendor engineering blog for "what they built"). `[secondary]` = commentary, tutorials, or analysis about a primary source.
- Vendor claims about their own product's performance or superiority are explicitly flagged as **vendor self-reporting**, even when the source is otherwise primary.
- Numbers are cross-checked across sources where possible; unresolved conflicts are flagged rather than silently resolved.
- Anything published before ~2025-01 (more than ~18 months before this report's compile date) is flagged as potentially stale given how fast this space is moving.
- "I couldn't find data on X" is used explicitly wherever true, rather than filling gaps with guesses — see each subdirectory's resources file and the main document's "What we could not find" section.
