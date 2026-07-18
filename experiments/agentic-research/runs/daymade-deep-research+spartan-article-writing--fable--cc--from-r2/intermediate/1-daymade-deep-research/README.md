# Agentic Deep Research: State of the Art (2026-07-18)

A filed research run on the methods, skills, prompts, and tools that make LLM agents produce excellent research reports — produced unattended by the `daymade-deep-research` skill (V6.1, Standard mode). Start with the summary; drill into approaches as needed.

## Contents

| File | What it is |
|---|---|
| **[summary.md](summary.md)** | Main report (TL;DR first): key terms, history, the four-approach map, shared methodological ingredients, evaluation literature, gaps, controversies, and a recommended-steps guide for a solo Claude Code developer with a skill-comparison harness |
| [single-prompt-skills/](single-prompt-skills/README.md) | Approach 1: research method packaged as an Agent Skill (SKILL.md) — mechanism, exemplars, trade-offs, getting going ([resources](single-prompt-skills/resources.md)) |
| [multi-agent-pipelines/](multi-agent-pipelines/README.md) | Approach 2: orchestrator–worker pipelines — Anthropic's method, LangChain's open reference, the Cognition dissent ([resources](multi-agent-pipelines/resources.md)) |
| [commercial-products/](commercial-products/README.md) | Approach 3: OpenAI, Google, Perplexity, Anthropic hosted products — timelines, APIs, self-reported claims flagged, independent limitations ([resources](commercial-products/resources.md)) |
| [open-source-frameworks/](open-source-frameworks/README.md) | Approach 4: GPT Researcher, Open Deep Research, DeerFlow, STORM, smolagents, minimalist loops, Tongyi — live repo metadata, architectures, getting going ([resources](open-source-frameworks/resources.md)) |

## Evidence trail (`research-notes/`)

| File | What it is |
|---|---|
| [registry.md](research-notes/registry.md) | Deduplicated citation registry: 55 approved sources with type/date/authority/provenance; quality-gate stats |
| task-a.md … task-f.md | Distilled specialist research notes (history, commercial, OSS, architecture, evaluation, tooling) — every report claim traces to a line here |
| [outline.md](research-notes/outline.md) | Evidence-mapped outline (P4) |
| [counter-review.md](research-notes/counter-review.md) | Mandatory counter-review findings (P6) |
| [verification.md](research-notes/verification.md) | Citation cross-check and claim spot-checks (P7) |
| [p0-config.md](research-notes/p0-config.md) | Run configuration and AFK auto-approval disclosure |
| [execution-log.md](research-notes/execution-log.md) | Environment events and the degraded retrieval path (which tools/engines worked) |
| tools/ | The curl-based search/fetch helper scripts used for retrieval provenance |

## Reading guide

- **Want the answer fast:** summary.md TL;DR, then §8 (recommended steps).
- **Deciding what to build on:** §3 table, then the two "assemble it yourself" subdirectories.
- **Building the judging side of a harness:** summary §5 plus [multi-agent-pipelines/resources.md](multi-agent-pipelines/resources.md) entry for [7] and the DeepResearch Bench entries in the registry.
- **Auditing this report's claims:** every bracketed [n] resolves in [research-notes/registry.md](research-notes/registry.md); every URL was live-fetched during the run (AS_OF 2026-07-18).
