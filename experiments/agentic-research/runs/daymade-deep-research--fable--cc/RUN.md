---
experiment: agentic-research
variant: daymade-deep-research--fable--cc
skills:
  - { name: daymade-deep-research, sha: c1a86bd }
model: claude-fable-5
provider: anthropic
harness: claude-code
date: 2026-07-18
duration: 20m37s
tokens: 141875
cost: unknown
settings: { }
status: complete
---

## Prompt as issued

Research the current state of the art in agentic deep research — the methods, skills, prompts, and tools that make LLM agents produce excellent research reports. Define the key terms early (deep research, research agent, orchestrator–worker, LLM-as-judge) and give the background: where automated deep research came from and how it has developed. Map the major approaches — single-prompt research skills, orchestrated multi-agent pipelines, commercial deep-research products (OpenAI, Google, Perplexity), and open-source research frameworks — and for each: how it works, evidence of maturity and activity, trade-offs (quality, cost, transparency, open-source vs hosted), and a getting-going guide. Include an analysis of what methodological ingredients the best systems share, what the evaluation literature says about judging research quality, and what you could not find. Conclude with a recommended-steps guide tailored to a solo developer who works in Claude Code daily and runs a skill-comparison harness in a git repo, aiming to assemble the best research capability from existing parts. Start the main summary with a TL;DR. Cite a primary source for every load-bearing claim; label secondary sources as such; flag vendor self-reporting. Deliver as markdown files: a top-level README index, the main summary, and one subdirectory per approach holding its documentation and an annotated resources file (repos, papers, articles, videos).

## Deviations & notes

First outing for the vendored daymade skill (Standard mode, full P0–P7, 6 parallel subagents in 2 groups). Its user-interaction gates (mode/plan approval) were auto-approved for AFK execution — disclosed inside the report itself. `output/research-notes/` is the skill's own evidence trail (per-subagent findings + a 52-source citation registry with pass/fail gates) — kept as part of the untouched output; the report proper is README.md + SUMMARY.md + the four approach dirs. Two disclosed degradations: a session-wide WebSearch cap (200/200) hit mid-run (later tasks switched to direct WebFetch; one task marked partial), and the recurring Write-tool denial (heredoc fallback). Executed in parallel with siblings via staging, copied byte-identical (recursive-diff verified).
