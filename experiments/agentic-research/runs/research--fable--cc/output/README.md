# Agentic Deep Research: State of the Art (July 2026)

Research report on the methods, skills, prompts, and tools that make LLM agents
produce excellent research reports. Compiled 2026-07-18 from primary sources
(vendor engineering posts, official docs, source repositories, arXiv papers);
secondary sources are labeled as such and vendor self-reporting is flagged.

## Contents

| File | What it covers |
|---|---|
| [SUMMARY.md](SUMMARY.md) | **Start here.** TL;DR, key terms, background and history, the approach map, shared methodological ingredients, the evaluation literature, gaps, and a recommended-steps guide for a solo Claude Code developer with a skill-comparison harness |
| [single-prompt-skills/](single-prompt-skills/README.md) | Research as a single-prompt/skill inside an agent harness (Agent Skills, SKILL.md, Claude Code) |
| [multi-agent-pipelines/](multi-agent-pipelines/README.md) | Orchestrated multi-agent research (orchestrator–worker; Anthropic's Research system, LangChain Open Deep Research) |
| [commercial-products/](commercial-products/README.md) | Hosted deep-research products: OpenAI, Google Gemini, Perplexity, Anthropic Claude Research |
| [open-source-frameworks/](open-source-frameworks/README.md) | Open-source frameworks: GPT Researcher, STORM/Co-STORM, Hugging Face Open Deep Research, dzhng/deep-research, LangChain ODR |

Each approach directory contains:

- `README.md` — how the approach works, evidence of maturity/activity, trade-offs, and a getting-going guide
- `resources.md` — annotated links: repos, papers, articles, videos

## Method and caveats

- Every load-bearing claim links to the source that owns it (vendor post, repo, paper).
- Performance numbers published by a vendor about its own product are marked
  **[vendor self-reported]**. One benchmark (Perplexity's DRACO) is authored by a
  vendor whose product tops it; this conflict is flagged where cited.
- Star counts and release data were read from the GitHub repositories on 2026-07-18
  and will drift.
- What could **not** be verified is listed in SUMMARY.md § "What I could not find".
