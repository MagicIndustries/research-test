---
task_id: d
role: Agent Engineering Specialist
status: complete
sources_found: 9
---

## Sources

[1] How we built our multi-agent research system (Anthropic Engineering) | https://www.anthropic.com/engineering/multi-agent-research-system | Source-Type: official | As Of: 2025-06 | Authority: 9/10
[2] Building Effective AI Agents (Anthropic) | https://www.anthropic.com/research/building-effective-agents | Source-Type: official | As Of: 2024-12 | Authority: 9/10
[3] Introducing Agent Skills (Claude blog; redirect target of anthropic.com/news/skills) | https://claude.com/blog/skills | Source-Type: official | As Of: 2025-10 | Authority: 9/10
[4] Equipping agents for the real world with Agent Skills (Anthropic Engineering) | https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills | Source-Type: official | As Of: 2025-10 | Authority: 9/10
[5] Claude Skills are awesome, maybe a bigger deal than MCP (Simon Willison) | https://simonwillison.net/2025/Oct/16/claude-skills/ | Source-Type: community | As Of: 2025-10 | Authority: 8/10
[6] anthropics/skills — official Agent Skills examples and spec | https://github.com/anthropics/skills | Source-Type: official | As Of: 2026-07 | Authority: 8/10
[7] Don't Build Multi-Agents (Cognition AI, Walden Yan; redirect target of cognition.ai) | https://cognition.com/blog/dont-build-multi-agents | Source-Type: secondary-industry | As Of: 2025-06 | Authority: 8/10
[8] 199-biotechnologies/claude-deep-research-skill (community skill, 939 stars) | https://github.com/199-biotechnologies/claude-deep-research-skill | Source-Type: community | As Of: 2026-03 | Authority: 6/10
[9] Weizhena/Deep-Research-skills (community skill, 1.7k stars, per GitHub search listing) | https://github.com/Weizhena/Deep-Research-skills | Source-Type: community | As Of: 2026-07 | Authority: 5/10

## Findings

- Anthropic's Research feature (June 13, 2025) uses an orchestrator-worker architecture in which a lead Claude Opus 4 agent plans and spawns parallel Claude Sonnet 4 subagents, and it "outperformed single-agent Claude Opus 4 by 90.2%" on Anthropic's internal research eval (vendor self-reported, internal benchmark). [1]
- Anthropic reports agents use about 4x more tokens than chat interactions and multi-agent systems about 15x, with token usage alone explaining 80% of performance variance on BrowseComp (three factors — tokens, tool calls, model choice — explain 95%). [1]
- Two layers of parallelism — the lead agent spinning up 3-5 subagents concurrently and each subagent using 3+ tools in parallel — "cut research time by up to 90% for complex queries". [1]
- Anthropic's key prompt-engineering lessons include scaling effort to complexity (simple fact-finding: 1 agent, 3-10 tool calls; comparisons: 2-4 subagents with 10-15 calls each), giving subagents explicit objectives/output formats/task boundaries, using extended thinking as a "controllable scratchpad," and judging agents by end-state rather than intermediate steps. [1]
- Anthropic itself bounds the pattern: domains "that require all agents to share the same context or involve many dependencies between agents" (e.g., most coding) are poor fits, and multi-agent only pays off when task value covers the ~15x token bill. [1]
- Anthropic's "Building Effective Agents" (Dec 19, 2024) defines orchestrator-workers as "a central LLM dynamically breaks down tasks, delegates them to worker LLMs, and synthesizes their results," recommended for tasks whose subtasks cannot be predicted in advance. [2]
- The same Dec 2024 post cautions to "add complexity only when it demonstrably improves outcomes" and to start with simple prompts before any multi-step agentic system. [2]
- Agent Skills (announced Oct 16, 2025) are "folders that include instructions, scripts, and resources that Claude can load when needed," working across Claude apps, Claude Code, and the API, positioned as "custom onboarding materials" that make Claude a specialist without new infrastructure. [3]
- Skills use three-level progressive disclosure — preloaded name/description metadata, SKILL.md body loaded on relevance, bundled files navigated on demand — making effective context "effectively unbounded" for agents with filesystem access. [4]
- Simon Willison argues Skills may be "a bigger deal than MCP" because each skill costs only "a few dozen extra tokens" versus MCP servers like GitHub's that consume tens of thousands of context tokens. [5]
- Cognition's "Don't Build Multi-Agents" (June 12, 2025) argues parallel subagents are fragile because "actions carry implicit decisions, and conflicting decisions carry bad results," recommending a single-threaded linear agent with context compression instead. [7]
- Community deep-research skills demonstrate the single-prompt approach at production quality: a 939-star MIT-licensed skill implements an 8-phase pipeline (scope→plan→parallel retrieve→triangulate→synthesize→critique loop→package) with citation verification and credibility scoring, installed by cloning into the skills directory with no additional infrastructure. [8]

## Deep Read Notes

### Source [1]: How we built our multi-agent research system
Key data: 90.2% gain over single Opus 4 (internal eval, vendor self-reported); ~4x/~15x token multipliers; 80%/95% BrowseComp variance explained; up-to-90% latency cut via 3-5 parallel subagents each making 3+ parallel tool calls; LLM-as-judge rubric (factual accuracy, citation accuracy, completeness, source quality, tool efficiency; 0.0-1.0 single-call scoring); rainbow deployments; synchronous lead-agent execution flagged as a bottleneck.
Key insight: The only primary source quantifying both benefit and cost of orchestrated research, and it explicitly names its own disqualifying conditions (shared-context/high-dependency tasks, low task value).
Useful for: the entire "orchestrated pipeline" side — architecture, economics, prompting lessons, and honest limits.

### Source [2]: Building Effective AI Agents
Key data: Dec 19, 2024; workflows (predefined code paths) vs agents (dynamic self-direction); orchestrator-workers verbatim definition; "add complexity only when it demonstrably improves outcomes."
Key insight: Anthropic's own pre-existing doctrine argues for the simplest sufficient design — effectively a first-party argument for skill-style single agents six months before its multi-agent post.
Useful for: framing the two approaches as points on Anthropic's own simplicity-first spectrum, not rivals.

### Source [4]: Equipping agents for the real world with Agent Skills
Key data: Oct 16, 2025; three-tier progressive disclosure (metadata in system prompt → SKILL.md body → bundled files); analogy of "a well-organized manual" (TOC → chapters → appendix); agents with filesystem/code tools "don't need to read the entirety of a skill into their context window," making capacity "effectively unbounded."
Key insight: Skills are framed as a context-engineering mechanism — organizing knowledge outside the window — which is the same problem orchestration solves via separate subagent contexts.
Useful for: the single-prompt/skill side's technical mechanism and its link to context engineering.

### Source [5]: Claude Skills (Simon Willison)
Key data: Oct 16, 2025; each skill's metadata costs "a few dozen extra tokens"; GitHub's MCP "famously consumes tens of thousands of tokens"; predicts a "Cambrian explosion" of skills; defends the design against "hardly a feature at all" criticism.
Key insight: Independent authority quantifying why packaged-prompt skills are the token-cheap path, mirror-imaging Anthropic's 15x multi-agent cost figure.
Useful for: independent validation of the skill approach's economics and adoption trajectory.

### Source [7]: Don't Build Multi-Agents (Cognition)
Key data: June 12, 2025, Walden Yan (one day before Anthropic's post); principles: "Share context, and share full agent traces, not just individual messages" and "Actions carry implicit decisions, and conflicting decisions carry bad results"; Flappy Bird example of subagents building incompatible parts; recommends single-threaded linear agent plus a compression LLM for long histories.
Key insight: The strongest practitioner counter-position: subagent context isolation — Anthropic's scaling asset for read-heavy research — is precisely what breaks write-heavy tasks.
Useful for: the counter-claim that orchestrated multi-agent is the wrong default, and reconciling it with Anthropic's own coding caveat.

### Source [8]: claude-deep-research-skill (199 Biotechnologies)
Key data: 939 stars, MIT, v2.3.1 (Mar 2026); 8-phase pipeline with critique loop-back; 4 modes (Quick 2-5 min to UltraDeep 20-45 min); 10+ sources, 3+ per claim; disk-persisted citations surviving context compaction; DOI/URL hallucination checks; install = clone into skills directory.
Key insight: Shows the skill approach can internally reproduce orchestration features (parallel retrieval, subagent spawning, critique loops) while remaining a zero-infrastructure markdown package.
Useful for: evidence that the two approaches converge — skills can script lightweight orchestration from inside one agent.

## Gaps

- Counter-claim candidate: Cognition [7] argues multi-agent architectures should generally NOT be built because isolated parallel subagents make conflicting implicit decisions, and Anthropic [1] itself concedes multi-agent is not worth it for shared-context/high-dependency domains (e.g., coding) or when task value cannot justify ~15x token spend — so the 90.2% claim applies narrowly to parallelizable, read-heavy research, and no independent replication of that internal-eval number was found (vendor self-reported).
- The session's WebSearch budget was exhausted before this task ran, so sources came from search-verified URLs in prior notes, direct fetches of official pages (with redirects followed and content verified), and one fetched GitHub search-results page; planned query variations (e.g., third-party analyses specifically dissecting the 15x token figure, academic comparisons of skill-based vs orchestrated deep research) could not be executed, and source [9] was listed from the search page but not deep-read.
- No source offers a controlled head-to-head benchmark of skill-based single-agent research vs orchestrator-worker research on the same tasks; the comparison currently rests on asymmetric evidence (Anthropic's internal eval vs community adoption signals), a methodological limitation for any cost-effectiveness conclusion.

## END
