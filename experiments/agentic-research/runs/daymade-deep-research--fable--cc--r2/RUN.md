---
experiment: agentic-research
variant: daymade-deep-research--fable--cc--r2
skills:
  - { name: daymade-deep-research, sha: c1a86bd }
model: claude-fable-5
provider: anthropic
harness: claude-code
date: 2026-07-18
duration: 11m27s
tokens: 116151
cost: USD 25.11
settings: { dispatch: headless claude -p, permission-mode: acceptEdits }
status: complete
---

## Prompt as issued

Research the current state of the art in agentic deep research — the methods, skills, prompts, and tools that make LLM agents produce excellent research reports. Define the key terms early (deep research, research agent, orchestrator–worker, LLM-as-judge) and give the background: where automated deep research came from and how it has developed. Map the major approaches — single-prompt research skills, orchestrated multi-agent pipelines, commercial deep-research products (OpenAI, Google, Perplexity), and open-source research frameworks — and for each: how it works, evidence of maturity and activity, trade-offs (quality, cost, transparency, open-source vs hosted), and a getting-going guide. Include an analysis of what methodological ingredients the best systems share, what the evaluation literature says about judging research quality, and what you could not find. Conclude with a recommended-steps guide tailored to a solo developer who works in Claude Code daily and runs a skill-comparison harness in a git repo, aiming to assemble the best research capability from existing parts. Start the main summary with a TL;DR. Cite a primary source for every load-bearing claim; label secondary sources as such; flag vendor self-reporting. Deliver as markdown files: a top-level README index, the main summary, and one subdirectory per approach holding its documentation and an annotated resources file (repos, papers, articles, videos).

## Deviations & notes

Re-run of `daymade-deep-research--fable--cc` under the `--r<N>` convention (owner-requested full-budget run). What changed vs the original: executed in its **own session** per the one-variant-per-session rule (the original shared a four-run parallel window and exhausted the session-wide WebSearch quota mid-pipeline, degrading tasks d–f to fetch-only). Dispatched headlessly (`claude -p`, fresh session) by the orchestrating session; the skill's interactive gates (mode/plan approval) auto-approved for AFK execution, as in the original. Retrieval date matches the original runs (same day) but is a later window within it — the four launch runs were one parallel window; treat cross-run freshness deltas as intra-day.

**Retrieval-path deviation**: the headless session was not granted the native WebSearch/WebFetch tools, so the skill's own degraded-mode provisions ran retrieval via curl-based search (DuckDuckGo HTML endpoint) and curl page fetches inside subagents — disclosed in the report (`summary.md` method disclosure, `research-notes/execution-log.md`). Consequence: **no quota starvation** — all six research tasks completed with live-fetched sources (55-source registry, 64% official, 0 from model memory) — but the retrieval mechanism differs from the launch runs' native web tools, so retrieval-quality differences between r1 and r2 confound with the search-engine change. Comparisons using this run must say so.

**Metrics provenance** (first automated capture for a Claude Code run): from the headless session's `--output-format json` result. `tokens` is input + cache-creation + output (38 + 61,919 + 54,194), the basis comparable to the launch runs; cache reads additionally totalled 3,029,145. `cost` is the JSON's `total_cost_usd` (API-equivalent pricing).
