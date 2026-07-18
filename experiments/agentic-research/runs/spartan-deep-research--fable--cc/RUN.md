---
experiment: agentic-research
variant: spartan-deep-research--fable--cc
skills:
  - { name: spartan-deep-research, sha: c1a86bd }
model: claude-fable-5
provider: anthropic
harness: claude-code
date: 2026-07-18
duration: 12m40s
tokens: 113309
cost: unknown
settings: { }
status: complete
---

## Prompt as issued

Research the current state of the art in agentic deep research — the methods, skills, prompts, and tools that make LLM agents produce excellent research reports. Define the key terms early (deep research, research agent, orchestrator–worker, LLM-as-judge) and give the background: where automated deep research came from and how it has developed. Map the major approaches — single-prompt research skills, orchestrated multi-agent pipelines, commercial deep-research products (OpenAI, Google, Perplexity), and open-source research frameworks — and for each: how it works, evidence of maturity and activity, trade-offs (quality, cost, transparency, open-source vs hosted), and a getting-going guide. Include an analysis of what methodological ingredients the best systems share, what the evaluation literature says about judging research quality, and what you could not find. Conclude with a recommended-steps guide tailored to a solo developer who works in Claude Code daily and runs a skill-comparison harness in a git repo, aiming to assemble the best research capability from existing parts. Start the main summary with a TL;DR. Cite a primary source for every load-bearing claim; label secondary sources as such; flag vendor self-reporting. Deliver as markdown files: a top-level README index, the main summary, and one subdirectory per approach holding its documentation and an annotated resources file (repos, papers, articles, videos).

## Deviations & notes

Usual spartan overrides (scope pre-answered; `02-research/` mapped to `output/`). Executed in parallel with siblings via staging, copied byte-identical (recursive-diff verified). The skill's verify step reported discarding low-credibility sources and flagged an unconfirmable rumor ("Deep Research Max") as a negative finding.
