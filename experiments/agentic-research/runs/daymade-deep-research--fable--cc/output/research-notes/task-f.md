---
task_id: f
role: Developer Tooling Scout
status: partial
sources_found: 3
---

## Sources

[1] Extend Claude with skills (Claude Code docs) | https://code.claude.com/docs/en/skills | Source-Type: official | As Of: 2026-07 | Authority: 10/10
[2] Run Claude Code programmatically (headless / Agent SDK CLI) | https://code.claude.com/docs/en/headless | Source-Type: official | As Of: 2026-07 | Authority: 10/10
[3] Agent Skills open standard (referenced from [1], not fetched) | https://agentskills.io | Source-Type: official | As Of: 2026-07 | Authority: 7/10

## Findings

- Agent Skills are directories with a required SKILL.md whose YAML frontmatter fields (description, when_to_use, allowed-tools, disallowed-tools, model, effort, context, agent, hooks, paths, disable-model-invocation, user-invocable, shell) control invocation, per-turn tool permissions, model/effort overrides, and execution context. [1]
- Setting `context: fork` runs a skill in a forked subagent context and the `agent` frontmatter field selects which custom subagent type executes it, directly wiring skills to subagents for isolated research runs. [1]
- Skills load from ~/.claude/skills/ (personal), .claude/skills/ (project, including nested monorepo directories), enterprise-managed locations, and plugin skills/ directories, with enterprise overriding personal overriding project on name clashes. [1]
- Progressive disclosure is explicit: skill descriptions are always in context but full bodies load only on invocation, with description+when_to_use truncated at 1,536 characters in the listing and a recommended 500-line cap on SKILL.md. [1]
- Once invoked, skill content persists in context for the rest of the session, and auto-compaction re-attaches the first 5,000 tokens of each invoked skill under a combined 25,000-token budget, dropping older skills first — a concrete token-cost mechanic for long research sessions. [1]
- Dynamic context injection (!`command` lines) runs shell commands and inlines their output into the skill content before Claude sees it, letting a research skill arrive pre-grounded in live data. [1]
- A skill folder containing .claude-plugin/plugin.json loads as a plugin that can bundle agents, hooks, and MCP servers together — a packaging path for a complete deep-research capability. [1]
- Claude Code skills follow the Agent Skills open standard (agentskills.io), with Claude-specific extensions for invocation control, subagent execution, and dynamic context injection. [1][3]
- Headless mode is `claude -p`, supporting --allowedTools, --permission-mode, --output-format text|json|stream-json, --json-schema for schema-conforming structured output, --continue/--resume for multi-turn pipelines, and --mcp-config to load MCP servers (e.g., web-search servers) per invocation. [2]
- `--bare` mode skips auto-discovery of hooks, skills, plugins, MCP servers, and CLAUDE.md for reproducible scripted runs, requires ANTHROPIC_API_KEY-style auth, and is the recommended (and future default) mode for scripted/SDK calls. [2]
- With --output-format json the response payload includes total_cost_usd and a per-model cost breakdown, so scripted research pipelines can track spend per invocation without the usage dashboard. [2]
- User-invoked skills work inside -p prompts (e.g., claude -p "/deep-research topic"), and stream-json tags subagent messages with parent_tool_use_id plus emits system/api_retry events with a `rate_limit` error category, giving pipelines native rate-limit visibility. [2]

## Deep Read Notes

### Source [1]: Extend Claude with skills
Key data: SKILL.md frontmatter reference (13+ fields incl. context: fork, agent, allowed-tools, hooks, paths); paths ~/.claude/skills/ and .claude/skills/; 1,536-char description cap; 5,000-token per-skill / 25,000-token combined compaction budget; bundled skills (/code-review, /debug, /loop, /batch); ${CLAUDE_SKILL_DIR}, ${CLAUDE_PROJECT_DIR}, $ARGUMENTS substitutions.
Key insight: Skills, subagents, hooks, and MCP servers are now a unified extension surface — a skill can fork into a named subagent, scope hooks to its lifecycle, and ship as a plugin bundling MCP servers, which is exactly the assembly kit for a deep-research capability.
Useful for: extension points (aspect 1) and token-cost mechanics (aspect 3).

### Source [2]: Run Claude Code programmatically
Key data: claude -p flags (--bare, --allowedTools, --output-format json/stream-json, --json-schema, --mcp-config, --agents, --append-system-prompt, --continue, --resume, --forward-subagent-text); total_cost_usd in json output; 10MB stdin cap; api_retry error categories incl. rate_limit and overloaded; session_id capture via jq for chained pipelines.
Key insight: Multi-step scripted research pipelines are first-class — capture session_id from json output, --resume it for follow-up passes, and enforce output shape with --json-schema, all while metering cost per call.
Useful for: headless/SDK scripted pipelines (aspect 1) and per-invocation cost tracking (aspect 3).

## Gaps

- Could NOT gather any community sources (awesome-claude-skills lists, GitHub research-skill repos, blog posts), user-reported cost/rate-limit/Max-plan experiences, or head-to-head research-skill comparisons/harnesses: this session's WebSearch budget was already exhausted (200/200) before the task ran, all search queries were rejected by the tool, and the 2-page WebFetch allowance was spent on the two official docs pages. Aspects (2) and (4) of the brief are therefore entirely uncovered, and (3) only via official mechanics, not user reports.
- Counter-claim candidate: the official docs' claim that skill reference material "costs almost nothing until you need it" is contestable for research workloads — the same page documents that once invoked, skill content persists across all subsequent turns and is re-attached after compaction (up to 25k tokens), so a heavy deep-research skill invoked early can impose a recurring context cost for the whole session; community token-consumption reports that would test this could not be retrieved.
- Methodological limitation: the source base is official-docs-only (2 fetched, 1 referenced from within a fetched page), so there is no independent triangulation, no adversarial/community perspective, and authority scores reflect provenance rather than cross-validation; per instructions, no URLs were included that did not appear in actually retrieved content.

## END
