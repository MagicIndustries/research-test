# Agentic Deep Research: State of the Art (July 2026)

A multi-file research report on the methods, skills, prompts, and tools that make LLM agents produce excellent research reports.

> AS_OF: 2026-07-18 | 52 approved sources (42% official, 29% academic, 19 domains) | Produced by the daymade-deep-research V6.1 pipeline (lead agent + 6 parallel research subagents; counter-review and citation verification applied). Plan-approval gates were auto-approved per dispatch instructions; all limitations are disclosed in the summary.

## Start here

**[SUMMARY.md](SUMMARY.md)** — the main report (begins with a TL;DR): definitions of key terms from primary sources, the 2021→2026 history, a comparative map of the four approaches, the seven methodological ingredients the best systems share, what the evaluation literature says about judging research quality, what we could not find, key controversies, and a recommended-steps guide for a solo Claude Code developer with a skill-comparison harness.

## Per-approach deep dives

Each subdirectory contains a README (how it works, evidence of maturity, trade-offs, getting-going guide) and an annotated RESOURCES file (repos, papers, articles; video coverage gap disclosed):

| Directory | Approach | One-line verdict |
|---|---|---|
| [single-prompt-skills/](single-prompt-skills/README.md) | Packaged markdown research skills (Agent Skills) | Cheapest, most transparent; unbenchmarked quality |
| [multi-agent-pipelines/](multi-agent-pipelines/README.md) | Orchestrator–worker research systems | Best (self-reported) quality; ~15x token cost; contested by practitioners |
| [commercial-products/](commercial-products/README.md) | OpenAI / Google / Perplexity / Anthropic hosted agents | Most polished; opaque; independently measured citation-fabrication rates |
| [open-source-frameworks/](open-source-frameworks/README.md) | GPT Researcher, Open Deep Research, DeerFlow, STORM, … | Transparent and cheap; fragmented, non-comparable quality evidence |

## Evidence trail

[research-notes/](research-notes/) holds the unedited working evidence: six subagent note files (task-a … task-f, with per-task sources, findings, deep-read notes, and gap logs) and [registry.md](research-notes/registry.md), the deduplicated citation registry with source-type, accessibility, freshness (As Of), and authority scores, plus dropped sources and quality-gate stats. Every bracketed citation [n] in every report file resolves in that registry; two sources were dropped and never cited.

## Citation conventions

- `[n]` numbers are global across all files; each file repeats full reference entries for the sources it cites.
- Primary sources back every load-bearing claim; secondary sources are labeled `secondary-industry`, `journalism`, or `community`.
- Vendor self-reported figures are flagged inline as "(vendor self-reported)" or equivalent wherever they appear.
