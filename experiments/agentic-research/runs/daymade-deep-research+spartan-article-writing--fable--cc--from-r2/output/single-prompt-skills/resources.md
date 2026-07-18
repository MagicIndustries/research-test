# Annotated resources — single-prompt research skills

All URLs live-verified during this run (AS_OF 2026-07-18). Global citation numbers match the run's citation registry (`../research-notes/registry.md`).

## Official documentation

- **[30] Introducing Agent Skills** — https://www.anthropic.com/news/skills — Anthropic announcement (2025-10-16). The launch primary source: skills as folders of instructions/scripts/resources; availability across Claude apps, Claude Code, and the API (API requires the Code Execution Tool beta). *Official; vendor self-reporting on adoption claims.*
- **[31] Equipping agents for the real world with Agent Skills** — https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills — The engineering deep-dive (2025-10). Best single explanation of progressive disclosure and why filesystem-mediated loading makes skill size "effectively unbounded"; includes the production PDF skill's design (separate `forms.md`). *Official.*
- **[48] Claude Code docs: Extend Claude with skills** — https://code.claude.com/docs/en/skills — Practical reference: skill scopes and precedence (enterprise > personal > project), `/skill-name` invocation, plugin namespacing, subagent execution, monorepo directory-scoped skills, bundled skills list. *Official.*

## Repositories

- **[32] anthropics/skills** — https://github.com/anthropics/skills — 162,240 stars, pushed 2026-07-17 (observed 2026-07-18). Example skills, the Agent Skills specification (`./spec`; broader standard at agentskills.io), a template, and the source-available document skills powering Claude's production docx/pdf/pptx/xlsx features. Doubles as a Claude Code plugin marketplace (`/plugin marketplace add anthropics/skills`). Contains **no** deep-research skill. *Official.*
- **[36] 199-biotechnologies/claude-deep-research-skill** — https://github.com/199-biotechnologies/claude-deep-research-skill — 939 stars, v2.3.1 (2026-03-19), MIT. The best-documented community deep-research skill found: 4 effort modes, parallel searches + subagents, disk-persisted `sources.json`, citation validators in a validate–fix–retry loop, multi-persona critique. One-line install into `~/.claude/skills/`. *Community; deep-read during this run.*
- **[51] Weizhena/Deep-Research-skills** — https://github.com/Weizhena/Deep-Research-skills — 1,674 stars, pushed 2026-05-07 (observed 2026-07-18). The star-leader among community deep-research skills, but only GitHub metadata was retrieved this run — content and quality unreviewed. *Community; unvetted.*
- **[37] mvanhorn/last30days-skill** — https://github.com/mvanhorn/last30days-skill — 52,585 stars (observed 2026-07-18). Not a full deep-research skill (researches the last 30 days of a topic) but evidence that narrow, well-scoped research skills can see mass adoption. *Community.*

## Context (why this approach can work at all)

- **[34] Effective context engineering for AI agents** — https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents — The three techniques a single-session research skill leans on for long-horizon work: compaction, structured note-taking (external memory files), and just-in-time retrieval via lightweight identifiers. *Official.*
- **[38] Don't Build Multi-Agents** — https://cognition.ai/blog/dont-build-multi-agents — Cognition (Devin), 2025-06. The strongest argument that a context-engineered single-threaded agent — i.e., exactly what a good skill produces — is more reliable than orchestrated subagents. *Secondary industry; vendor-motivated.*
