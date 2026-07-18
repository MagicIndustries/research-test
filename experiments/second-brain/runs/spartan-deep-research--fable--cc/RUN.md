---
experiment: second-brain
variant: spartan-deep-research--fable--cc
skills:
  - { name: spartan-deep-research, sha: c1a86bd }
model: claude-fable-5
provider: anthropic
harness: claude-code
date: 2026-07-18
duration: 8m32s
tokens: 93315
cost: unknown
settings: { }
status: complete
---

## Prompt as issued

Research the current landscape of approaches to building a personal "second brain" — an external, searchable, LLM-augmented system that captures, organizes, and resurfaces what its owner learns. Identify the major method families and how LLMs have changed each; for every family, name the leading tools with evidence of maturity and activity, their trade-offs (ownership, privacy, cost, effort), and where the ecosystem is converging. Conclude with concrete recommendations for a solo developer who works in Claude Code daily and keeps notes in Obsidian, including what to set up first and why. Cite a primary source for every load-bearing claim.

## Deviations & notes

Two prescriptions of the skill overridden by harness conventions, recorded per the vendoring rule (skill itself unmodified): (1) the skill's Scope step asks the user — pre-answered from the canonical prompt (full report; no angle restriction; audience: the solo developer described); (2) the skill's "save to `02-research/`" output rule — output goes to this run's `output/` instead.
