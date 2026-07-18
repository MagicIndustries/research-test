# Approach 1: Single-Prompt Research Skills

*Research capability as one instruction package loaded into an agent harness
you already run. Part of the [agentic deep research report](../SUMMARY.md).*

## How it works

An **Agent Skill** is "an organized folder of instructions, scripts, and
resources that agents can discover and load dynamically to perform better at
specific tasks"
([Anthropic engineering, "Equipping agents for the real world with Agent Skills"](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)).
Mechanically, a skill is a directory containing a `SKILL.md` with YAML
frontmatter (`name`, `description`); the agent preloads only every skill's
name and description into its system prompt, and pulls in the full body — and
any bundled reference files or executable scripts — only when the task matches.
Anthropic calls this **progressive disclosure**
([Agent Skills docs](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)).
Skills follow a published open standard and run across Claude apps, Claude
Code, and the API ([docs](https://code.claude.com/docs/en/skills)).

A *research* skill applies this to deep research: the harness (e.g. Claude
Code) already provides the agentic loop, web search/fetch tools, subagent
dispatch, and a filesystem; the skill contributes the methodology. A good one
encodes, in prose and checklists, the same ingredients the big systems
implement in code (see [SUMMARY.md §4](../SUMMARY.md)):

1. Clarify the question; write a research brief with scope and stopping conditions.
2. Search broad → evaluate the landscape → progressively narrow
   (Anthropic's own search heuristic for its Research agents,
   [engineering post](https://www.anthropic.com/engineering/multi-agent-research-system)).
3. Prefer primary sources; follow claims back to the owner of the fact.
4. Outline before drafting (STORM's core lesson,
   [arXiv:2402.14207](https://arxiv.org/abs/2402.14207)).
5. Verify each load-bearing citation before delivery; label secondary sources
   and vendor self-reporting.
6. Deliver as Markdown files with a source list.

## Evidence of maturity and activity

- Agent Skills shipped publicly in October 2025 with first-party skills
  (docx/xlsx/pptx/pdf) and an open repo,
  [anthropics/skills](https://github.com/anthropics/skills) (Apache-2.0,
  actively maintained as of July 2026).
- The format is an open standard positioned for cross-platform portability
  ("build once, use across Claude apps, Claude Code, and API" — vendor claim,
  [platform docs](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)).
- A large community ecosystem of third-party skills exists (secondary sources:
  e.g. [Claude Code skills guide](https://code.claude.com/docs/en/skills),
  community catalogs). Research-specific skills circulate widely but **no
  published benchmark evaluates any of them** — see
  [SUMMARY.md §6](../SUMMARY.md).

## Trade-offs

| Dimension | Assessment |
|---|---|
| Quality | Depends on harness model + tools; captures most non-RL methodological ingredients; single context window caps breadth unless the skill dispatches subagents |
| Cost | Lowest of the four approaches — one agent, tokens scale with task; agents in general run ~4× chat tokens ([Anthropic](https://www.anthropic.com/engineering/multi-agent-research-system)) |
| Transparency | Total: the entire method is a readable, diffable Markdown file in git |
| Open vs hosted | The skill is yours; the harness and model are typically hosted |
| Iteration speed | Best-in-class — edit a prose file, re-run, compare |
| Failure modes | Skill drift (instructions ignored under long context), no architectural enforcement of the workflow, no trained-in browsing policy |

## Getting going

1. Read the two primary references: the
   [Agent Skills engineering post](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)
   and the [skills docs](https://code.claude.com/docs/en/skills); skim
   examples in [anthropics/skills](https://github.com/anthropics/skills).
2. Create `.claude/skills/deep-research/SKILL.md` in your repo with a
   trigger-rich `description` and a body that walks the six-step method above.
   Keep the body short; push long rubrics/checklists into bundled reference
   files (progressive disclosure).
3. Encode *output contract* explicitly: file layout, TL;DR-first summary,
   citation rules, secondary-source labeling.
4. Add an effort-scaling table (when to answer inline, when to spawn parallel
   subagents) — lifted from
   [Anthropic's delegation heuristics](https://www.anthropic.com/engineering/multi-agent-research-system).
5. Evaluate with your harness: same query through skill variants, judged
   blind with a RACE/FACT-style rubric ([SUMMARY.md §5](../SUMMARY.md)).

Annotated sources: [resources.md](resources.md).
