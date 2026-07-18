# Resources: Single-Prompt Research Skills

## Primary docs and repos

- [Anthropic engineering: Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills) — 2025. Primary. The design rationale: skills as folders of instructions, progressive disclosure, executable resources.
- [Claude Code: Extend Claude with skills](https://code.claude.com/docs/en/skills) — current. Primary. SKILL.md format, frontmatter requirements, installation paths.
- [Agent Skills overview (Claude Platform docs)](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) — current. Primary. Cross-surface support matrix.
- [anthropics/skills](https://github.com/anthropics/skills) — Anthropic's open-source skill collection (17 skills incl. document tooling). Primary; good structural templates.
- [199-biotechnologies/claude-deep-research-skill](https://github.com/199-biotechnologies/claude-deep-research-skill) — 939 stars, MIT, last commit 2026-03-19. Primary repo. 8-phase pipeline, source_evaluator.py credibility scoring, citation_manager.py, critique loop-back, multi-persona red-teaming in Deep/UltraDeep modes. Its "outperforms OpenAI, Gemini, Claude Desktop" claim ships with no benchmark — treat as self-reporting.
- [Weizhena/Deep-Research-skills](https://github.com/Weizhena/Deep-Research-skills) — primary repo. Structured deep-research skill with human-in-the-loop control; targets Claude Code, OpenCode, Codex.

## Secondary articles

- [ClaudeWorld: Anthropic official skills guide](https://claude-world.com/articles/anthropic-official-skills-complete-guide/) — secondary; source of the "open standard, ~40 clients" adoption claim (unverified against agentskills.io directly).
- [MindStudio: What is the /deep research command in Claude Code?](https://www.mindstudio.ai/blog/what-is-deep-research-command-claude-code) — secondary; describes community parallel-subagent research workflows and the error-compounding argument for parallelism.
- [Tosea.ai: Academic research skills for Claude Code (2026)](https://tosea.ai/blog/academic-research-skills-claude-code-suite-guide-2026) — secondary; survey of the academic-skill suite pattern (research → write → review → revise).

## Courses / video

- [DeepLearning.AI: Agent Skills with Anthropic](https://www.deeplearning.ai/courses/agent-skills-with-anthropic) — short course on building skills. Vendor-affiliated teaching material.
- [Anthropic Skilljar: Introduction to agent skills](https://anthropic.skilljar.com/introduction-to-agent-skills) — vendor course.
