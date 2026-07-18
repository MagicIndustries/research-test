# Approach 1: Single-Prompt Research Skills

> One well-engineered instruction package turns a capable general agent (Claude Code, claude.ai, or any Agent-Skills-compatible host) into a research agent. No orchestration infrastructure; the "system" is a folder of markdown and scripts.

**Confidence: High** for how the mechanism works (official primary docs); **Medium** for quality claims (no independent benchmark of skills vs pipelines exists — see Gaps).

## How it works

Anthropic launched **Agent Skills** on October 16, 2025 as "folders that include instructions, scripts, and resources that Claude can load when needed," working across the Claude apps, Claude Code, and the API [30]. A skill is a directory whose required `SKILL.md` carries YAML frontmatter (`name`, `description`) plus procedural instructions; it may bundle arbitrary additional files [31].

The core design principle is **three-level progressive disclosure** [31]:

1. Only each installed skill's `name` + `description` sit in the system prompt at startup.
2. The full `SKILL.md` body is loaded only when the agent judges it relevant.
3. Bundled reference files (e.g. `reference.md`, `forms.md`, validation scripts) are read only as needed.

Because loading is filesystem-mediated, bundled context is "effectively unbounded" for agents with a filesystem and code execution [31] — which is exactly what deep-research skills exploit: multi-phase pipelines, personas, citation validators, and report templates all ride in one folder without polluting the context window.

In Claude Code specifically, skills load from personal (`~/.claude/skills/`), project (`.claude/skills/`), plugin, or enterprise scopes, are invocable as `/skill-name`, follow the cross-tool Agent Skills open standard (agentskills.io), and can be forced to execute inside a subagent [48].

## What a state-of-the-art research skill contains

The best-documented community exemplar found, `199-biotechnologies/claude-deep-research-skill` (939 stars, v2.3.1, MIT; observed 2026-07-18), packs a full research methodology into a single skill [36]:

- A 3–8-phase pipeline: Scope → Plan → Retrieve → Triangulate → Outline → Synthesize → Critique (with loop-back) → Refine → Package
- Four effort modes (Quick 2–5 min to UltraDeep 20–45 min)
- 5–10 concurrent searches plus 2–3 subagents returning structured evidence objects
- A disk-persisted `sources.json` that survives context compaction
- Quality gates (10+ sources, 3+ per major claim) and Python validators (`validate_report.py`, `verify_citations.py` with DOI/URL hallucination checks) in a validate–fix–retry loop
- Multi-persona red-teaming, and a "Step 0" date check to prevent stale training-data assumptions

Notably, these ingredients — effort scaling, parallel retrieval, subagent fan-out, citation verification passes, external memory — are the same ones Anthropic's orchestrated multi-agent system describes [7], independently converged on inside one skill folder [36]. The two "assemble it yourself" approaches are converging in practice.

## Evidence of maturity and activity

- The mechanism itself is mature and heavily adopted: `anthropics/skills` (created 2025-09) had **162,240 stars and was pushed 2026-07-17** (observed 2026-07-18; star count independently re-verified via GitHub API) [32].
- However, `anthropics/skills` contains **no official deep-research skill** — its README advertises document, creative, and enterprise skills only [32]. Research skills are community territory.
- Community research skills are numerous but individually small: the most-starred deep-research skill found was `Weizhena/Deep-Research-skills` at 1,674 stars (content unreviewed — metadata-only observation) [51]; a narrower recency-research skill, `mvanhorn/last30days-skill`, had 52,585 stars (observed 2026-07-18) [37].

## Trade-offs

| Dimension | Assessment |
|---|---|
| Cost | Lowest of the four approaches — one agent session; no extra infrastructure; token use scales with effort mode |
| Quality | Depends heavily on host-agent capability and the skill's method; no independent benchmark against orchestrated pipelines exists (Anthropic's 90.2% multi-agent advantage is vendor self-reported on an internal eval [7]) |
| Transparency | Highest — the entire method is human-readable markdown in your repo, diffable and version-controlled |
| Open vs hosted | Fully yours; but the executing agent (e.g. Claude Code) is typically a hosted product |
| Limits | Single main context window constrains breadth; mitigations are exactly Anthropic's context-engineering trio — compaction, structured note-taking, subagent architectures [34] |

## Getting going

1. Create `.claude/skills/<name>/SKILL.md` with `name` + `description` frontmatter and your method as instructions; add reference files and scripts as needed; invoke with `/<name>` [48].
2. Or start from an existing skill: `git clone` a community deep-research skill into `~/.claude/skills/` (the 199-biotechnologies skill installs this way and needs no mandatory dependencies; optional multi-provider search via Brave/Serper/Exa/Jina/Firecrawl keys or an Exa MCP server) [36].
3. Steal the load-bearing ingredients when writing your own: effort modes, disk-persisted source registry, a citation-verification pass, and an explicit critique loop [36][7].

## Gaps and counter-claims

- No independent (non-vendor) benchmark comparing a single-agent-plus-skill setup against an orchestrated multi-agent pipeline on the same research tasks was found (task-d gap).
- Counter-view in favor of this approach: Cognition argues context-engineered single-threaded agents are *more* reliable than multi-agent orchestration ("Don't Build Multi-Agents") [38] — meaning the ceiling of the humble skill may be higher than the multi-agent marketing suggests.
- Star counts measure attention, not research quality; the top-starred community skill's content was not reviewed [51].

## References

[7] Anthropic — How we built our multi-agent research system — https://www.anthropic.com/engineering/multi-agent-research-system (official; vendor self-reporting on its own system)
[30] Anthropic — Introducing Agent Skills — https://www.anthropic.com/news/skills (official)
[31] Anthropic — Equipping agents for the real world with Agent Skills — https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills (official)
[32] anthropics/skills — https://github.com/anthropics/skills (official)
[34] Anthropic — Effective context engineering for AI agents — https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents (official)
[36] 199-biotechnologies/claude-deep-research-skill — https://github.com/199-biotechnologies/claude-deep-research-skill (community)
[37] mvanhorn/last30days-skill — https://github.com/mvanhorn/last30days-skill (community)
[38] Cognition — Don't Build Multi-Agents — https://cognition.ai/blog/dont-build-multi-agents (secondary industry; vendor-motivated commentary)
[48] Claude Code docs — Extend Claude with skills — https://code.claude.com/docs/en/skills (official)
[51] Weizhena/Deep-Research-skills — https://github.com/Weizhena/Deep-Research-skills (community; metadata-only observation)
