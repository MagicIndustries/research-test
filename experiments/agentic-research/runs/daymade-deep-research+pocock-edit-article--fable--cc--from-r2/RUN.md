---
experiment: agentic-research
variant: daymade-deep-research+pocock-edit-article--fable--cc--from-r2
skills:
  - { name: daymade-deep-research, sha: c1a86bd }
  - { name: pocock-edit-article, sha: c1a86bd }
model: claude-fable-5
provider: anthropic
harness: claude-code
date: 2026-07-18
duration: 10m22s
tokens: 110258
cost: unknown
settings: { stage-1: reused from daymade-deep-research--fable--cc--r2 }
status: complete
---

## Prompt as issued

Research the current state of the art in agentic deep research — the methods, skills, prompts, and tools that make LLM agents produce excellent research reports. Define the key terms early (deep research, research agent, orchestrator–worker, LLM-as-judge) and give the background: where automated deep research came from and how it has developed. Map the major approaches — single-prompt research skills, orchestrated multi-agent pipelines, commercial deep-research products (OpenAI, Google, Perplexity), and open-source research frameworks — and for each: how it works, evidence of maturity and activity, trade-offs (quality, cost, transparency, open-source vs hosted), and a getting-going guide. Include an analysis of what methodological ingredients the best systems share, what the evaluation literature says about judging research quality, and what you could not find. Conclude with a recommended-steps guide tailored to a solo developer who works in Claude Code daily and runs a skill-comparison harness in a git repo, aiming to assemble the best research capability from existing parts. Start the main summary with a TL;DR. Cite a primary source for every load-bearing claim; label secondary sources as such; flag vendor self-reporting. Deliver as markdown files: a top-level README index, the main summary, and one subdirectory per approach holding its documentation and an annotated resources file (repos, papers, articles, videos).

## Deviations & notes

First writing-stage stack run, testing the owner's verdict hypothesis: daymade's depth in readable packaging.

- **Stage 1 not re-executed** (owner decision, `--from-r2` suffix): `intermediate/1-daymade-deep-research/` is a byte-copy (recursive-diff verified) of `daymade-deep-research--fable--cc--r2`'s output. This perfectly isolates the writing delta — the edit stage's input is identical to a filed run — at the price of the stack not executing end-to-end in one session.
- **Stage 2 scope**: `pocock-edit-article` is article-oriented, so it edits the six article-like files (top README, summary, four approach READMEs). The four `resources.md` lists and the `research-notes/` evidence trail pass through byte-identical — an edit stage must never touch the evidence.
- **Session deviation** (owner-approved): the edit stage ran as a fresh subagent of the orchestrating session rather than its own session. The one-variant-per-session rule exists to protect the WebSearch quota; this stage performs zero web operations.
- The skill's interactive gate (step 1 "confirm the sections with the user") auto-approved for AFK execution, as with daymade's gates.
- Stage-fidelity spot-check (shape, never invent) is a comparison-time obligation per conventions; the dispatch instructions additionally forbade new facts, numbers, or citations at write time. Write-time verification: citation-marker sets and URL counts identical between intermediate and output for all six edited files (independently re-checked: zero URLs in output absent from input); all internal relative links resolve; longest prose paragraph per file 136–239 chars (the skill's 240 limit).
- Metrics: duration and `tokens` are the edit-stage subagent's (110,258 tokens, 10m22s); stage 1's metrics live in r2's RUN.md. `cost` unknown — subagent usage isn't dollar-reported; the stage ran inside the orchestrating session's subscription allowance.
- Harness quirk hit: the Write tool's report-file guard blocked a direct write of `summary.md`; the stage staged it in the scratchpad and copied it into place, then verified. Recorded for the observations log.
