# Resources: Single-Prompt Research Skills

## Primary — vendor engineering and docs

- [Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills) — Anthropic engineering post introducing skills; defines the SKILL.md format, progressive disclosure, and design rationale. The canonical reference.
- [Agent Skills overview — Claude Platform docs](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) — normative spec: frontmatter requirements, discovery, cross-surface portability.
- [Extend Claude with skills — Claude Code docs](https://code.claude.com/docs/en/skills) — harness-side mechanics: where skills live, how they're triggered, personal vs project scope.
- [anthropics/skills (GitHub)](https://github.com/anthropics/skills) — first-party open repository of skills; the best worked examples of skill structure to imitate.
- [How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system) — not about skills per se, but its eight prompt-engineering principles (effort scaling, broad-then-narrow search, extended thinking as scratchpad) are the content a research skill should encode.

## Primary — method sources worth folding into a skill

- [STORM paper (arXiv:2402.14207)](https://arxiv.org/abs/2402.14207) — perspective-guided question asking + outline-first writing; both portable to prose instructions.
- [DeepResearch Bench (arXiv:2506.11763)](https://arxiv.org/abs/2506.11763) — RACE/FACT criteria double as a self-review checklist inside a skill.

## Secondary — guides and commentary (label: secondary)

- [The Complete Guide to Building Skills for Claude (Anthropic resources PDF)](https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf) — vendor tutorial-format guide.
- [Anthropic Skilljar course: Introduction to agent skills](https://anthropic.skilljar.com/introduction-to-agent-skills) — free vendor course (video format).
- [Claude Code Skills Complete Guide (hidekazu-konishi.com)](https://hidekazu-konishi.com/entry/claude_code_skills_complete_guide.html) — third-party walkthrough of creating/testing/distributing skills.

## Gap

No peer-reviewed or benchmark evaluation of skill-based research pipelines was
found (searched July 2026). Treat all quality claims about specific community
research skills as anecdotal.
