# State of the Art in Agentic Deep Research — Report Index

Deep-research report produced 2026-07-18 via the spartan-deep-research skill (full-depth run: scope, research, verify, synthesize, report). Audience: a solo developer working daily in Claude Code who runs a skill-comparison harness in a git repo and wants to assemble the best research capability from existing parts.

## Start here

- **[SUMMARY.md](SUMMARY.md)** — the main report. TL;DR, definitions (deep research, research agent, orchestrator–worker, LLM-as-judge), historical background and timeline, key findings, cross-approach analysis of shared methodological ingredients, what the evaluation literature says, what could not be found, recommended steps for the target developer, open questions, and the master source list.

## Approach deep-dives

Each directory holds a `README.md` (how it works, maturity/activity evidence, trade-offs, getting-going guide) and a `resources.md` (annotated repos, papers, articles, courses/videos, with primary/secondary/vendor labels).

| Directory | Approach | One-line verdict |
|---|---|---|
| [01-single-prompt-skills/](01-single-prompt-skills/README.md) | SKILL.md research pipelines in one context | Cheapest and most transparent; quality unbenchmarked; the right baseline |
| [02-orchestrated-multi-agent/](02-orchestrated-multi-agent/README.md) | Orchestrator–worker pipelines (Anthropic, LangChain) | Best-evidenced scaffold (+90.2% on breadth tasks) at ~15× token cost |
| [03-commercial-products/](03-commercial-products/README.md) | OpenAI, Google Gemini, Perplexity products/APIs | Highest polish, RL-trained agents, zero transparency; benchmark claims are vendor-run |
| [04-open-source-frameworks/](04-open-source-frameworks/README.md) | GPT Researcher, LangChain ODR, dzhng, STORM, smolagents, Tongyi | Full control and lowest cost; mine them for prompts and patterns |

## Reading order for the impatient

1. SUMMARY.md TL;DR + "Analysis: what the best systems share" (the portable checklist).
2. SUMMARY.md "Recommended steps" (the harness plan).
3. 02-orchestrated-multi-agent/README.md (the architecture worth copying).
4. 04-open-source-frameworks/resources.md (where to steal prompts and how to grade results).

## Method and caveats

- Live web research on 2026-07-18: ~15 targeted searches plus direct fetches of primary sources (vendor engineering blogs, GitHub repos, arXiv abstracts, API docs).
- Every load-bearing claim carries an inline citation; secondary sources and vendor self-reporting are labeled at point of use.
- Two vendor announcement pages (OpenAI, Perplexity) blocked direct fetching; their figures are cross-checked against contemporaneous secondary coverage and labeled accordingly.
- Negative findings (no independent 2026 product head-to-head; no third-party skill evaluations; unconfirmed "Deep Research Max") are reported in SUMMARY.md as findings, not filled with guesses.
