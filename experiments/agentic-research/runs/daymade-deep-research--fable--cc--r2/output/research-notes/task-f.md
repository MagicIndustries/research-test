---
task_id: f
role: Developer Tooling Scout
status: complete
sources_found: 10
---

## Sources

[1] Extend Claude with skills - Claude Code Docs | https://code.claude.com/docs/en/skills | Source-Type: official | As Of: 2026-07 | Authority: 10/10
[2] Create custom subagents - Claude Code Docs | https://code.claude.com/docs/en/sub-agents | Source-Type: official | As Of: 2026-07 | Authority: 10/10
[3] Connect Claude Code to tools via MCP - Claude Code Docs | https://code.claude.com/docs/en/mcp | Source-Type: official | As Of: 2026-07 | Authority: 10/10
[4] anthropics/skills (Public repository for Agent Skills) | https://github.com/anthropics/skills | Source-Type: official | As Of: 2026-07 | Authority: 9/10
[5] 199-biotechnologies/claude-deep-research-skill | https://github.com/199-biotechnologies/claude-deep-research-skill | Source-Type: community | As Of: 2026-04 | Authority: 6/10
[6] Weizhena/Deep-Research-skills | https://github.com/Weizhena/Deep-Research-skills | Source-Type: community | As Of: 2026-05 | Authority: 5/10
[7] tavily-ai/tavily-mcp | https://github.com/tavily-ai/tavily-mcp | Source-Type: official | As Of: 2026-07 | Authority: 8/10
[8] exa-labs/exa-mcp-server | https://github.com/exa-labs/exa-mcp-server | Source-Type: official | As Of: 2026-07 | Authority: 8/10
[9] promptfoo/promptfoo | https://github.com/promptfoo/promptfoo | Source-Type: community | As Of: 2026-07 | Authority: 8/10
[10] Model-graded metrics - Promptfoo docs | https://www.promptfoo.dev/docs/configuration/expected-outputs/model-graded/ | Source-Type: official | As Of: 2026-07 | Authority: 8/10

## Findings

- Claude Code skills are SKILL.md files loaded from personal (`~/.claude/skills/`), project (`.claude/skills/`), plugin, or enterprise scopes, invocable via `/skill-name`, and follow the cross-tool Agent Skills open standard (agentskills.io) with Claude Code extensions for invocation control, subagent execution, and dynamic context injection. [1]
- Claude Code ships bundled prompt-based skills (`/code-review`, `/batch`, `/loop`, `/debug`, `/claude-api`) in every session, disableable via `disableBundledSkills`. [1]
- Custom subagents run in their own context window with a custom system prompt, restricted tool access, and per-agent model routing (e.g. Haiku for cheap exploration); built-in Explore and Plan subagents are read-only and, as of v2.1.198, Explore inherits the session model capped at Opus. [2]
- MCP servers attach to Claude Code as remote HTTP/SSE or local stdio processes via `claude mcp add` or `.mcp.json`, and Anthropic maintains a reviewed connector directory at claude.ai/directory. [3]
- anthropics/skills had 162,240 stars and was last pushed 2026-07-17 (observed 2026-07-18); it doubles as a Claude Code plugin marketplace (`/plugin marketplace add anthropics/skills`) but its README advertises document/creative/enterprise skills, not a deep-research skill. [4]
- The most-starred community deep-research skill found, Weizhena/Deep-Research-skills, had 1,674 stars (pushed 2026-05-07, observed 2026-07-18). [6]
- 199-biotechnologies/claude-deep-research-skill (939 stars, observed 2026-07-18) is a complete composed pipeline: 4 research modes, parallel searches plus 2-3 subagents, multi-persona critique loop, disk-persisted `sources.json` citations, and Python validators for structure and DOI/URL hallucination checks; it needs no dependencies for basic use, with optional multi-provider `search-cli` (Brave/Serper/Exa/Jina/Firecrawl API keys) and Exa MCP. [5]
- Official vendor MCP search servers exist for both Tavily (tavily-ai/tavily-mcp, 2,232 stars, search/extract/map/crawl) and Exa (exa-labs/exa-mcp-server, 4,738 stars), both actively pushed within the week before 2026-07-18; each requires a vendor API key. [7][8]
- promptfoo (23,380 stars, pushed 2026-07-18) is a CLI/CI eval harness with declarative configs that claims use by OpenAI and Anthropic. [9]
- promptfoo's model-graded assertions cover the judge needs of a research harness directly: `llm-rubric` (custom-criteria LLM judge), `select-best` (pairwise/multi-output comparison), `g-eval`, `factuality`, and `search-rubric` (judge with web search for verifying current claims). [10]

## Deep Read Notes

### Source [1]: Extend Claude with skills (code.claude.com)
Key data: Skill precedence enterprise > personal > project; plugin skills namespaced `plugin:skill`; nested `.claude/skills/` in monorepo subdirectories load contextually with directory-qualified names (`apps/web:deploy`). Skill bodies load only when used, so long reference material is near-free until invoked. Bundled `/run`, `/verify`, `/run-skill-generator` trio requires v2.1.145+.
Key insight: The skill system is explicitly designed for exactly the "assemble from parts" pattern in this task — a research skill can carry its own reference files, scripts, and templates, and can be forced to run in a subagent.
Useful for: The "native surface" section of the report; explains where a best-of-breed research skill should live and how it composes with subagents.

### Source [5]: 199-biotechnologies/claude-deep-research-skill
Key data: v2.3.1 (2026-03-19), MIT license, 939 stars observed 2026-07-18. Install is a one-line git clone into `~/.claude/skills/deep-research`. Search priority chain: search-cli (multi-provider, API keys) -> built-in WebSearch fallback (no setup) -> optional Exa MCP. Quality gates: 10+ sources, 3+ per major claim, validate/fix/retry loop max 3 cycles; reports over 18K words auto-continue via recursive agent spawning.
Key insight: This is a working existence proof of the full composition the task asks about — skill + MCP/multi-provider search + subagents + automated validation — buildable today by a solo developer with zero mandatory dependencies.
Useful for: The "existing skills to reuse" recommendation; its architecture (lean SKILL.md + reference/ + scripts/) is a template for a home-grown variant.

### Source [10]: Promptfoo model-graded metrics
Key data: Assertion types relevant to comparing research outputs: `llm-rubric` (general LLM judge against custom rubric), `select-best` (compares multiple outputs across prompts/providers and picks the winner — i.e. pairwise-or-better comparison out of the box), `agent-rubric` (coding-agent grader that inspects workspace evidence), `search-rubric` (judge with live web search to verify factual currency), plus `factuality` and `g-eval`.
Key insight: A git-repo research harness gets blind-judge comparison "for free" from promptfoo's CLI: point `select-best` or `llm-rubric` at run output files as providers/outputs; no custom judge scripts needed. `search-rubric` is notable because research reports contain time-sensitive claims a static judge cannot verify.
Useful for: The evaluation-harness section; the single credible off-the-shelf option, with a custom pairwise script as the lighter alternative.

## Gaps

- No official Anthropic deep-research skill was found in anthropics/skills — its README lists document, creative, and enterprise skills only; searched the README directly (observed 2026-07-18). A solo dev must use community skills or build their own.
- Could not verify the content or quality of Weizhena/Deep-Research-skills (the star leader at 1,674) — only GitHub search metadata was retrieved, not its README; star count alone is not evidence it composes well with Claude Code.
- Counter-claim candidate: promptfoo's "Used by OpenAI and Anthropic" is a self-claim in its own repo description with no independent confirmation found in this session; treat as vendor marketing until corroborated.
- Counter-claim candidate: the task premise that WebSearch/WebFetch docs needed verification went partially unmet — the dedicated background-tasks and web-tools doc pages were not fetched (session budget went to skills/subagents/MCP), so claims about WebSearch rate limits or availability tiers remain unverified here.
- Mojeek search was not exercised (GitHub API and r.jina.ai covered all queries); no plugin-marketplace aggregator beyond anthropics/skills itself was surfaced.

## END
