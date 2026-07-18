---
experiment: harness-dryrun
variant: freeform--fable--manual
skills: []
model: claude-fable-5
provider: anthropic
harness: manual
date: 2026-07-18
duration: unknown
tokens: unknown
cost: unknown
settings: { }
status: complete
---

## Prompt as issued

What is the current Node.js LTS release line, and what is its scheduled end-of-life date? Answer in at most two short paragraphs, citing the official Node.js release schedule as the source.

## Deviations & notes

Retrofit dry-run ([Build the harness skills](https://github.com/MagicIndustries/research-test/issues/4)): output produced outside the wrapper (freeform, from working knowledge, no skill and no live source fetch — the output says so itself). No skills used, so no skill-snapshot. Copy verified byte-identical by SHA-256 checksum. Filed on the feature branch rather than a run/ branch.
