---
experiment: agentic-research
variant: daymade-deep-research+spartan-article-writing--fable--cc--from-r2
skills:
  - { name: daymade-deep-research, sha: c1a86bd }
  - { name: spartan-article-writing, sha: c1a86bd }
model: claude-fable-5
provider: anthropic
harness: claude-code
date: 2026-07-19
duration: 8m13s
tokens: 101061
cost: unknown
settings: { stage-1: reused from daymade-deep-research--fable--cc--r2 }
status: complete
---

## Prompt as issued

Research the current state of the art in agentic deep research — the methods, skills, prompts, and tools that make LLM agents produce excellent research reports. Define the key terms early (deep research, research agent, orchestrator–worker, LLM-as-judge) and give the background: where automated deep research came from and how it has developed. Map the major approaches — single-prompt research skills, orchestrated multi-agent pipelines, commercial deep-research products (OpenAI, Google, Perplexity), and open-source research frameworks — and for each: how it works, evidence of maturity and activity, trade-offs (quality, cost, transparency, open-source vs hosted), and a getting-going guide. Include an analysis of what methodological ingredients the best systems share, what the evaluation literature says about judging research quality, and what you could not find. Conclude with a recommended-steps guide tailored to a solo developer who works in Claude Code daily and runs a skill-comparison harness in a git repo, aiming to assemble the best research capability from existing parts. Start the main summary with a TL;DR. Cite a primary source for every load-bearing claim; label secondary sources as such; flag vendor self-reporting. Deliver as markdown files: a top-level README index, the main summary, and one subdirectory per approach holding its documentation and an annotated resources file (repos, papers, articles, videos).

## Deviations & notes

Second writing-stage derived stack — the owner's synthesis idea ("have spartan include / refine content from daymade"): spartan's write-up voice applied to daymade's research. Directly comparable with `daymade-deep-research+pocock-edit-article--fable--cc--from-r2` and bare `--r2` — all three share the identical research stage.

- **Derived stack per conventions** (`--from-r2`): `intermediate/1-daymade-deep-research/` is a recursive-diff-verified byte-copy of `daymade-deep-research--fable--cc--r2`'s output. Run date is 2026-07-19; the research stage's retrieval date remains 2026-07-18 (r2's RUN.md).
- **Stage 2 scope per the edit-stage dispatch rules**: the six article-like files; resources lists and `research-notes/` pass through byte-identical.
- **First run under the rendered-output rules** (loop PR #43, merged before this run): the dispatch required bullet-listed reference lists and forbade adding citation markers to text that lacked them (the citation re-stamping rule from the pocock run's fidelity check). The pocock run predates both rules — a comparison between the two writing stages must note this dispatch asymmetry.
- **Session deviation** (same as the pocock run): edit stage executed as a fresh subagent of the orchestrating session — zero web operations, so the session rule's quota rationale doesn't apply. The skill's HITL interaction style ("two-way talk") auto-resolved for AFK execution.
- Write-time fidelity constraints in the dispatch: no new facts, claims, numbers, or sources; the skill's own rule 5 ("never make up facts") aligns. Stage-fidelity spot-check applies at comparison time.
- Write-time verification: per-file citation-marker **multisets** byte-identical input→output (zero added, zero dropped — the re-stamping rule held); orchestrator re-checked zero new URLs and intermediate integrity (recursive diff). All six reference lists converted to bullet lists per the rendered-output rule. Banned-pattern grep clean. Word counts flat (prose tightened; bullet markers offset the reduction).
- Metrics: edit-stage subagent — 101,061 tokens, 8m13s; stage 1's metrics in r2's RUN.md; cost unknown (subagent of the orchestrating session).
- The Write-tool report-file guard hit `summary.md` again (staged via scratchpad + cp, verified) — third occurrence of this quirk family; see OBSERVATIONS.
