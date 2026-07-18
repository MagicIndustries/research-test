# Annotated Resources — Single-Prompt Research Skills

> AS_OF: 2026-07-18. Every entry was surfaced by this project's research pipeline (registry numbers in brackets). Accessibility: all public.

## Primary documentation (start here)

- **[50] Claude Code docs — Extend Claude with skills** — https://code.claude.com/docs/en/skills — official, 2026-07. The authoritative frontmatter reference (13+ fields incl. `context: fork`, `agent`, `hooks`), skill locations and precedence, the 1,536-char description cap, the 5,000/25,000-token compaction mechanics, and dynamic context injection. Read in full before writing a skill.
- **[35] Anthropic Engineering — Equipping agents for the real world with Agent Skills** — https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills — official, 2025-10. The design rationale: three-level progressive disclosure and why filesystem-backed skills make context "effectively unbounded".
- **[34] Introducing Agent Skills** — https://claude.com/blog/skills — official announcement, 2025-10. Positioning and cross-surface scope (apps, Claude Code, API).
- **[52] Agent Skills open standard** — https://agentskills.io — official, 2026-07. The vendor-neutral spec Claude Code implements. Referenced from [50]; not independently fetched by this pipeline.

## Repositories

- **[37] anthropics/skills** — https://github.com/anthropics/skills — official examples + spec, active as of 2026-07. The canonical patterns to imitate.
- **[39] 199-biotechnologies/claude-deep-research-skill** — https://github.com/199-biotechnologies/claude-deep-research-skill — community, 939 stars, MIT, v2.3.1 (2026-03). The best public research-skill template found: 8-phase pipeline, 4 effort modes, 3+-sources-per-claim, disk-persisted citations, DOI/URL hallucination checks. Demonstrates skills converging on orchestration features.
- **[40] Weizhena/Deep-Research-skills** — https://github.com/Weizhena/Deep-Research-skills — community, ~1.7k stars per GitHub search listing (2026-07). Listed from a fetched search-results page only; not deep-read by this pipeline — verify before relying on it.

## Analysis / articles (secondary)

- **[36] Simon Willison — "Claude Skills are awesome, maybe a bigger deal than MCP"** — https://simonwillison.net/2025/Oct/16/claude-skills/ — community/secondary, 2025-10. The key independent economic argument: dozens of idle tokens per skill vs tens of thousands for heavyweight MCP servers.

## Videos

- None passed this pipeline's citation registry. The research session's web-search budget was exhausted before community-media sweeps could run (see SUMMARY §9); treat this as a coverage gap, not evidence that no good video content exists.
