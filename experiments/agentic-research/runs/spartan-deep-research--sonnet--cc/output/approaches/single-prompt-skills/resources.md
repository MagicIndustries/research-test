# Resources: Single-Prompt Research Skills

## Repos

- **anthropics/skills** — https://github.com/anthropics/skills — accessed July 2026, actively maintained. Anthropic's official public repository for the Agent Skills format: reference `SKILL.md` examples, the format spec, and a skill template. 162k stars / 19.2k forks. Most bundled examples are document/creative-task skills rather than a canonical general-purpose research skill, but it is the origin repo for the mechanism this whole category runs on. [primary] (vendor self-report on adoption claims within)

- **199-biotechnologies/claude-deep-research-skill** — https://github.com/199-biotechnologies/claude-deep-research-skill — last commit March 19, 2026. An 8-phase single-skill research pipeline (Scope → Plan → Retrieve → Triangulate → Outline Refinement → Synthesize → Critique → Refine → Package) with four depth modes and Markdown/HTML/PDF output. 939 stars / 98 forks, MIT. Its README claims to "outperform OpenAI, Gemini, and Claude Desktop," an unverified individual-developer self-report with no cited methodology. [primary] (vendor/author self-report re: quality claims)

- **Weizhena/Deep-Research-skills** — https://github.com/Weizhena/Deep-Research-skills — 1.7k stars / 135 forks, MIT. Cross-platform (Claude Code, OpenCode, Codex) structured research skill with a distinct two-phase design: outline generation with human checkpoints, then automated per-item deep research and report assembly. Good template for tabular/comparison-style research tasks. [primary]

- **recomby-ai/researcher-skill** — https://github.com/recomby-ai/researcher-skill — 28 stars / 3 forks, MIT. A minimal, single-file ReAct-pattern research skill for Claude Code/Codex; explicitly designed to search "deep, not wide." Useful as a lightweight starting template rather than a feature-complete pipeline. [primary]

- **daymade/claude-code-skills** — https://github.com/daymade/claude-code-skills — 1.3k stars / 211 forks, MIT, 446 commits. A 60+ skill marketplace-style collection including a deep-research skill with source-governance, citation-tracking, and freshness-check design elements. The maintainer claims their skill-creator meta-skill outscores Anthropic's official version 65/80 vs 42/80 on an unnamed independent audit — unverified, flagged as author self-report. [primary] (self-report re: comparative scoring claim)

- **alirezarezvani/claude-skills** — https://github.com/alirezarezvani/claude-skills — 22.7k stars / 3.1k forks, last updated May 28, 2026 (v2.9.0). A large marketplace-style aggregation of 345 skills across 18 domains, including dedicated "Academic Research" and "Research Operations" categories. Evidence of how broad the skills ecosystem has gotten, more than a single opinionated research design. [primary]

- **noahshinn/reflexion** — https://github.com/noahshinn/reflexion — code accompanying the Reflexion paper (below); the verbal self-reflection/episodic-memory pattern several research skills' "critique with loop-back" phases structurally resemble. Published 2023 — flagged as old/foundational, not itself a research skill. [primary]

## Papers

- **ReAct: Synergizing Reasoning and Acting in Language Models** (Yao, Zhao, Yu, Du, Shafran, Narasimhan, Cao) — https://arxiv.org/abs/2210.03629 — ICLR 2023 (submitted 2022). **Old/foundational — flagged as pre-2025.** The interleaved reason→act→observe loop that underlies nearly every single-prompt research skill's search cycle described above. Still the dominant mental model cited by community skill authors. [primary]

- **Reflexion: Language Agents with Verbal Reinforcement Learning** (Shinn, Cassano, Berman, Gopinath, Narasimhan, Yao) — https://arxiv.org/abs/2303.11366 — NeurIPS 2023. **Old/foundational — flagged as pre-2025.** Verbal self-critique stored in episodic memory to improve a subsequent attempt without weight updates; the conceptual ancestor of the "critique with loop-back" step seen in several deep-research skill pipelines. [primary]

- **SkillsBench: Benchmarking How Well Agent Skills Work Across Diverse Tasks** — https://arxiv.org/abs/2602.12670 — 2026 (Stanford/CMU/Berkeley/Oxford/BenchFlow). First dedicated benchmark for the Agent Skills format; evaluated 47,150 public skills, found an ecosystem-wide average quality score of 6.2/12, and showed curated top-quartile skills raise pass rates from 33.9% to 50.5%. Directly relevant to the quality trade-off of relying on community-authored single-prompt research skills. [primary]

- **Single-Agent LLMs Outperform Multi-Agent Systems on Multi-Hop Reasoning Under Equal Thinking Token Budgets** (Tran, Kiela) — https://arxiv.org/abs/2604.02460 — submitted April 2, 2026 (revised April 11, 2026). Argues that Anthropic's and others' reported multi-agent advantages are largely explained by uncontrolled extra compute rather than architectural superiority, and that single-agent systems are more information-efficient under a fixed token budget — a direct, currently-unresolved counterpoint to the multi-agent case for breadth-first research. [primary]

## Articles

- **Equipping agents for the real world with Agent Skills** (Anthropic Engineering) — https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills — October 16, 2025. Anthropic's own explanation of the Agent Skills mechanism (progressive disclosure, production deployment across Claude.ai/Claude Code/Agent SDK/Developer Platform). No quantitative benchmarks given. [primary] (vendor self-report)

- **How we built our multi-agent research system** (Anthropic Engineering) — https://www.anthropic.com/engineering/multi-agent-research-system — originally published June 2025. The key contrast source for this category: describes Anthropic's orchestrator-worker multi-agent Research product, reports a 90.2% quality improvement over a single Opus agent on their internal eval, and that multi-agent systems use ~15x the tokens of a chat interaction, with token volume explaining ~80% of performance variance. Essential for the cost/quality trade-off discussion even though it describes the category this slice excludes. [primary] (vendor self-report)

- **Extend Claude with skills** (Claude Code Docs) — https://code.claude.com/docs/en/skills — current as of query date, mid-2026. Official documentation of `SKILL.md` frontmatter, progressive disclosure, subagent (forked) execution option, and dynamic context injection — the concrete mechanics referenced throughout the README. [primary]

- **Agent Skills specification and overview** — https://agentskills.io — spec published December 18, 2025, stewarded per the site via an open GitHub project and Discord. Defines the open, cross-vendor format and lists a client showcase of ~40 compatible agent products as of June 2026 (Cursor, GitHub Copilot, VS Code, Gemini CLI, OpenCode, Goose, Databricks Genie Code, Snowflake Cortex Code, and others). [primary]

- **The Agent Skills Ecosystem in 2026: Who's Building, What's Working, and What's Next** (Agentman) — https://agentman.ai/blog/agent-skills-ecosystem-report-2026 — 2026. Secondary aggregation/commentary citing ecosystem growth numbers (client count, SkillsMP catalog size, marketplace counts) and a security-audit figure ("22,511 skills, 140,963 issues," attributed to "Agensi/Snyk, 2026") that could not be traced to a locatable primary source and does not match Snyk's own directly-published 3,984-skill ToxicSkills study below — flagged as an unreconciled numbers conflict. [secondary] (Agentman is itself a vendor in this space; treat ecosystem-growth framing as partly self-interested)

- **ToxicSkills: Malicious AI Agent Skills and Supply-Chain Compromise** (Snyk) — https://snyk.io/blog/toxicskills-malicious-ai-agent-skills-clawhub/ — audit dataset as of February 5, 2026. Security audit of 3,984 skills sourced from ClawHub and skills.sh: 36% contained security flaws, 13.4% (534) had at least one critical issue (malware, prompt injection, exposed secrets), 76 confirmed malicious payloads, 8 still live at publication. Directly relevant to the "installing a third-party research skill = supply-chain risk" trade-off. [primary] (Snyk is a security vendor; the underlying audit methodology is their own, though the subject is not their own product)

- **Add a Specialized Deep Research Skill to Agent Harnesses** (NVIDIA Technical Blog) — https://developer.nvidia.com/blog/add-a-specialized-deep-research-skill-to-agent-harnesses/ — May 20, 2026. Describes NVIDIA's AI-Q blueprint: a `SKILL.md` plus helper script that lets a harness (Claude Code, Codex, LangChain) delegate research to an external multi-stage backend server. Included as a boundary case — it is packaged as a single skill but the heavy research work runs in an external, multi-stage service rather than the single agent context itself, so it sits at the edge of this category rather than squarely inside it. [primary] (vendor self-report)

## Videos

I couldn't find data on notable videos specifically covering single-prompt/single-skill research patterns (as distinct from Anthropic's hosted multi-agent Research product, which has more video coverage). The web-search budget for this research session was exhausted before a dedicated video search could be completed, so this is an incomplete rather than a confirmed-empty finding.
