# Approach 1: Single-Prompt Research Skills

> Part of [The State of the Art in Agentic Deep Research](../SUMMARY.md) | AS_OF: 2026-07-18 | Citation numbers are global — see [../research-notes/registry.md](../research-notes/registry.md)

## What it is

A research *skill* is a packaged set of instructions — a folder with a `SKILL.md` and optional scripts and reference files — that a general-purpose agent loads on demand to become a competent researcher, with no additional infrastructure. Anthropic's launch framing (Oct 16, 2025): skills are "folders that include instructions, scripts, and resources that Claude can load when needed," working across Claude apps, Claude Code, and the API, positioned as "custom onboarding materials" [34]. Claude Code implements the Agent Skills open standard (agentskills.io) with Claude-specific extensions [50][52].

## How it works

The core mechanism is **three-level progressive disclosure**: (1) skill name + description metadata preloaded into the system prompt; (2) the SKILL.md body loaded only when relevant; (3) bundled reference files navigated on demand. Anthropic's engineering post argues this makes effective context "effectively unbounded" for agents with filesystem access — the analogy is a well-organized manual: table of contents, then chapters, then appendix [35].

Claude Code's implementation adds concrete control surfaces documented in the official reference [50]:

- YAML frontmatter fields (`description`, `when_to_use`, `allowed-tools`, `disallowed-tools`, `model`, `effort`, `context`, `agent`, `hooks`, `paths`, and more) govern invocation, per-turn tool permissions, and model/effort overrides.
- `context: fork` runs the skill in an isolated subagent context, and `agent:` selects which custom subagent executes it — the bridge between this approach and orchestrated pipelines (see [../multi-agent-pipelines/](../multi-agent-pipelines/README.md)).
- Dynamic context injection (`!`-prefixed command lines) inlines live shell output into the skill before the model sees it, so a research skill can arrive pre-grounded in current data.
- A skill folder with `.claude-plugin/plugin.json` becomes a plugin bundling agents, hooks, and MCP servers — a packaging path for a complete research capability.

What a *good* research skill contains is best shown by the strongest public community example, a 939-star MIT-licensed deep-research skill: an 8-phase pipeline (scope → plan → parallel retrieve → triangulate → synthesize → critique loop → package), four effort modes (Quick 2–5 min to UltraDeep 20–45 min), 10+ sources with 3+ per claim, credibility scoring, disk-persisted citations that survive context compaction, and DOI/URL hallucination checks — installed by cloning into the skills directory [39].

## Evidence of maturity and activity

- Announced Oct 16, 2025, simultaneously in product, engineering-blog, and open-spec form [34][35][52]; official examples and spec maintained at anthropics/skills [37].
- Independent validation: Simon Willison called skills "maybe a bigger deal than MCP," noting each skill idles at "a few dozen extra tokens" versus MCP servers that consume tens of thousands, and predicted a "Cambrian explosion" of skills [36].
- Community research skills with real adoption: 939 stars for the deep-research skill above [39]; a 1.7k-star deep-research skill collection also surfaced in GitHub search listings (not deep-read) [40].
- Caveat: no controlled benchmark of any research skill was found — maturity evidence here is adoption and design quality, not measured output quality (see SUMMARY §6).

## Trade-offs

**For:** near-zero idle cost [36]; zero infrastructure; full transparency (it is readable markdown in your repo, trivially diffable and versionable — ideal for a skill-comparison harness); portable across Claude surfaces [34]; can internally reproduce orchestration features (parallel retrieval, forked contexts, critique loops) [39][50].

**Against:** once invoked, skill content persists in context for the rest of the session, and auto-compaction re-attaches the first 5,000 tokens per skill under a 25,000-token combined budget — a recurring context cost precisely for long research sessions, which undercuts the "costs almost nothing" framing [50]. A single context also caps total evidence volume unless the skill forks subagents. And quality claims are unbenchmarked (community adoption is a popularity signal, not a quality measure).

**Confidence: High** on mechanics (official docs, primary announcements); **Medium** on quality relative to other approaches (no controlled comparison exists).
**Counter-reading:** the official claim that skill reference material "costs almost nothing until you need it" is contestable for research workloads given the documented persistence and compaction re-attachment mechanics [50].

## Getting going

1. Read the skill spec and official examples: anthropics/skills [37] and the Claude Code skills reference [50].
2. Clone one strong community research skill into `~/.claude/skills/` (personal) or `.claude/skills/` (project) — the 939-star skill is the best-documented template [39].
3. Run it on a real question; inspect which of the 8 phases actually fire and where citations come from.
4. Write your own SKILL.md encoding the seven shared ingredients (SUMMARY §4): plan-first, effort modes, source triangulation rules, mandatory critique pass. Keep it under the recommended 500-line cap; put depth in reference files for progressive disclosure [50].
5. When retrieval volume outgrows one context, add `context: fork` + a custom `agent:` rather than switching frameworks [50].

## References (cited here)

[34] Claude blog. "Introducing Agent Skills". official. 2025-10. https://claude.com/blog/skills
[35] Anthropic Engineering. "Equipping agents for the real world with Agent Skills". official. 2025-10. https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills
[36] Simon Willison. "Claude Skills are awesome, maybe a bigger deal than MCP". community. 2025-10. https://simonwillison.net/2025/Oct/16/claude-skills/
[37] anthropics/skills (GitHub). official. 2026-07. https://github.com/anthropics/skills
[39] 199-biotechnologies/claude-deep-research-skill (GitHub). community. 2026-03. https://github.com/199-biotechnologies/claude-deep-research-skill
[40] Weizhena/Deep-Research-skills (GitHub; listing only, not deep-read). community. 2026-07. https://github.com/Weizhena/Deep-Research-skills
[50] Claude Code docs. "Extend Claude with skills". official. 2026-07. https://code.claude.com/docs/en/skills
[52] Agent Skills open standard. official. 2026-07. https://agentskills.io
