# Approach 1: Single-Prompt Research Skills

A research method packaged as instructions — typically an Agent Skill (a directory with a `SKILL.md`) — executed by one agent in one conversation context using its built-in search/fetch tools.

## How it works

A skill is a folder containing a `SKILL.md` with YAML frontmatter (`name`, `description`) plus optional scripts and reference files. The host agent preloads only every skill's name and description; the full instructions load on demand — "progressive disclosure" — so dozens of methods can be installed without burning context ([Anthropic engineering, primary](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills); [Claude Code skills docs](https://code.claude.com/docs/en/skills)). A research skill encodes the pipeline as prose: scope → search → verify → synthesize → write, with rules ("every claim needs a source," "flag data older than 18 months") and an output template. The agent then runs the whole thing sequentially in its own context.

Community skills push this surprisingly far while staying single-artifact:

- [199-biotechnologies/claude-deep-research-skill](https://github.com/199-biotechnologies/claude-deep-research-skill): 8-phase pipeline (Scope → Plan → Retrieve → Triangulate → Outline → Synthesize → Critique with loop-back → Refine → Package), Python helpers for source-credibility scoring and citation tracking, "10+ sources, 3+ per major claim" gates (repo, primary; its "outperforms OpenAI/Gemini" claim is unverified vendor-style self-reporting).
- [Weizhena/Deep-Research-skills](https://github.com/Weizhena/Deep-Research-skills): human-in-the-loop checkpoints, targets Claude Code/OpenCode/Codex (repo, primary).
- Skills that spawn subagents blur into Approach 2 — the skill file is then the orchestrator's playbook.

## Evidence of maturity and activity

- Agent Skills shipped across Claude.ai, Claude Code, the Agent SDK, and the API in late 2025; Anthropic open-sourced a set at [anthropics/skills](https://github.com/anthropics/skills) (primary). Reported adoption as an open standard (agentskills.io, Dec 2025) by ~40 clients including Copilot, Cursor, Codex, and Gemini CLI is from secondary sources ([ClaudeWorld](https://claude-world.com/articles/anthropic-official-skills-complete-guide/), unverified).
- Community research skills are young: hundreds of stars (199-bio: 939 stars, last commit 2026-03-19), single-maintainer, no third-party benchmarks. Marketplaces (mcpmarket.com, claudemarketplaces.com) list many variants — activity, not evidence of quality.

## Trade-offs

- **Quality**: bounded by one context window and the host model; no parallel coverage; long sessions risk context rot. But for focused questions this matches heavier setups — LangChain observed users don't want 10-minute multi-agent runs for simple requests ([LangChain, primary](https://www.langchain.com/blog/open-deep-research)).
- **Cost**: cheapest approach — roughly single-agent token usage (~4× chat per Anthropic's measurements, vs ~15× for multi-agent) ([Anthropic, primary](https://www.anthropic.com/engineering/multi-agent-research-system)).
- **Transparency**: best in class. The entire method is a diffable text file in git; every run is a readable transcript.
- **Open vs hosted**: fully yours; portable across any client speaking the skills format. No independent evaluation of any community skill exists (gap flagged in SUMMARY.md).

## Getting going

1. Create `.claude/skills/deep-research/SKILL.md` with frontmatter (`name`, `description` with trigger phrasing) and a staged process: scope questions, search list, verification rules, synthesis instructions, report template ([docs](https://code.claude.com/docs/en/skills)).
2. Steal structure from the community skills above and from Anthropic's [anthropics/skills](https://github.com/anthropics/skills) examples; add hard rules (source-per-claim, date flagging, "couldn't find" section, TL;DR-first).
3. Keep helper scripts (citation checker, source-quality rubric) next to the SKILL.md; reference them from the skill so they load only when used.
4. Iterate by feeding failed transcripts back to Claude and asking it to rewrite the skill — then A/B the variants in your harness.
