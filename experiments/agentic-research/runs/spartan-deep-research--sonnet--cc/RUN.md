---
experiment: agentic-research
variant: spartan-deep-research--sonnet--cc
skills:
  - { name: spartan-deep-research, sha: c1a86bd }
model: claude-sonnet-5
provider: anthropic
harness: claude-code
date: 2026-07-18
duration: 9m12s
tokens: 111447
cost: unknown
settings: { }
status: complete
---

## Prompt as issued

Research the current state of the art in agentic deep research — the methods, skills, prompts, and tools that make LLM agents produce excellent research reports. Define the key terms early (deep research, research agent, orchestrator–worker, LLM-as-judge) and give the background: where automated deep research came from and how it has developed. Map the major approaches — single-prompt research skills, orchestrated multi-agent pipelines, commercial deep-research products (OpenAI, Google, Perplexity), and open-source research frameworks — and for each: how it works, evidence of maturity and activity, trade-offs (quality, cost, transparency, open-source vs hosted), and a getting-going guide. Include an analysis of what methodological ingredients the best systems share, what the evaluation literature says about judging research quality, and what you could not find. Conclude with a recommended-steps guide tailored to a solo developer who works in Claude Code daily and runs a skill-comparison harness in a git repo, aiming to assemble the best research capability from existing parts. Start the main summary with a TL;DR. Cite a primary source for every load-bearing claim; label secondary sources as such; flag vendor self-reporting. Deliver as markdown files: a top-level README index, the main summary, and one subdirectory per approach holding its documentation and an annotated resources file (repos, papers, articles, videos).

## Deviations & notes

The model contrast run: executed by a Sonnet-class subagent (`model: sonnet` override on the background agent; recorded as claude-sonnet-5 per the harness's model mapping) while all sibling runs use fable. Usual overrides: spartan scope step pre-answered from the prompt; skill's `02-research/` output rule mapped to `output/`. Executed in parallel with siblings via a staging directory, copied in byte-identical (verified by recursive diff).
