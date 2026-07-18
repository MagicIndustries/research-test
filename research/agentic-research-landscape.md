# Agentic-research landscape survey

> Researched 2026-07-18 for [issue #3](https://github.com/MagicIndustries/research-test/issues/3) (child of map [#1](https://github.com/MagicIndustries/research-test/issues/1)). Question: what are the best current skills, tools, and methods for LLM/agentic research, and which should become variants in this repo's research-comparison harness?

## TL;DR — recommended launch set

Four variants on day one, all runnable inside Claude Code (matching the map's skill-axis + model-axis decision), plus one retrofit:

| Variant | Skill | Model | Why |
|---|---|---|---|
| `research-default` | installed `/research` (baseline) | default (Sonnet-class) | The control. Minimal skill; measures what the harness gives you for free. |
| `research-strong-model` | installed `/research` | strongest available (Opus-class) | Isolates the model axis against the same skill. |
| `deep-research-v1` | **write in-repo** (see below) | default | The interesting variant: an orchestrated deep-research skill modeled on Anthropic's published multi-agent research method. |
| `deep-research-strong` | `deep-research-v1` | strongest available | Skill × model interaction. Anthropic found lead-strong/sub-cheap the sweet spot. |
| *(retrofit)* secondBrain | historical `/research` + `/deep-research` outputs | as-run | First experiment, per the map. Note: the `/deep-research` skill that produced half of secondBrain is **not installed anywhere findable** — only its output survives. Its RUN.md provenance must record "skill definition lost". |

Second wave (after the harness works end-to-end): a Codex CLI variant (`codex exec --search`), a Gemini CLI headless variant, and one commercial deep-research product via API (OpenAI `o3-deep-research` or Gemini `deep-research-preview`) filed through the retrofit skill. All are realistic; mechanics in section C.

Judging: blind pairwise + rubric, order-swapped, judge model from a **different provider** than the variants under comparison (or at minimum a model that produced none of the outputs). Rationale in section D.

---

## A. Research-agent skills and patterns beyond the installed pair

### What's installed here today

- `/research` (`.agents/skills/research/SKILL.md`) is 13 lines: delegate to a background agent, use primary sources, cite claims, save one Markdown file where the repo keeps such notes. It is a *policy* skill, not a *process* skill — no planning, decomposition, coverage checking, or citation verification.
- `/deep-research` is referenced by secondBrain's directory names (`fable-claude-deep-research-skill/`) but **no skill definition exists** in the repo, `~/.claude/skills`, `.agents/skills`, or installed plugins. The harness needs one written or installed before a deep-research variant can run reproducibly.

### The reference pattern: Anthropic's multi-agent research system

Anthropic's engineering write-up of their Research feature ([How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system)) is the highest-value primary source found. Key mechanics a Claude Code skill can copy directly:

- **Orchestrator–worker**: a lead agent plans, spawns parallel search subagents, synthesizes, loops until coverage is sufficient.
- **Explicit effort-scaling rules in the prompt**: simple fact-finding = 1 agent / 3–10 tool calls; comparisons = 2–4 subagents / 10–15 calls each; complex surveys = 10+ subagents. Without this, agents over-spawn on trivial queries.
- **Subagent task specs** must carry an objective, output format, tool guidance, and boundaries — vague delegation duplicates work.
- **Broad-then-narrow search**: start with short broad queries, evaluate, then progressively narrow (agents default to overly specific queries otherwise).
- **Separate citation pass**: a CitationAgent maps claims to sources after synthesis.
- Measured result: Opus-lead + Sonnet-subagents beat single-agent Opus by **90.2%** on their internal research eval; token usage alone explained ~80% of performance variance; multi-agent runs cost ~15× a chat. Cost is the price of the pattern — worth recording per run.

### Community skills worth knowing (none clearly better than writing our own)

- Anthropic's official [anthropics/skills](https://github.com/anthropics/skills) repo contains document/creative/dev skills but **no research skill** — research skills live in the community.
- [Weizhena/Deep-Research-skills](https://github.com/Weizhena/Deep-Research-skills) — notable because it targets **Claude Code, OpenCode, and Codex from one skill**: two-phase (outline generation → parallel deep investigation) with human-in-the-loop gates between phases. Useful as a cross-harness design reference even if we don't install it.
- [Imbad0202/academic-research-skills](https://github.com/imbad0202/academic-research-skills) and k-dense-ai's literature-review skills ([marketplace listing](https://claudemarketplaces.com/skills/k-dense-ai/scientific-agent-skills/literature-review)) — academic-pipeline suites (PubMed/arXiv/Semantic Scholar, PICO-style search protocols, citation-verified output). Overkill for general research prompts; relevant only if an experiment is literature-review-shaped.
- NVIDIA's [AI-Q deep-research skill](https://developer.nvidia.com/blog/add-a-specialized-deep-research-skill-to-agent-harnesses/) shows a third pattern: the skill is a thin client that submits the task to an external research server. Interesting architecturally (harness-independent by construction) but adds infrastructure this repo doesn't want.

**Assessment**: no off-the-shelf skill encodes the Anthropic method well; the community skills are either thin wrappers or academic-specific. Writing `deep-research-v1` in-repo (with `writing-great-skills`) is the right call — it also gives the harness a variant whose full definition is versioned next to its runs, which the lost `/deep-research` skill proves matters.

## B. What the strongest deep-research systems do methodologically

| System | Method (from first-party docs) | Replicable in a Claude Code skill? |
|---|---|---|
| **OpenAI Deep Research** ([intro](https://openai.com/index/introducing-deep-research/), [API guide](https://developers.openai.com/api/docs/guides/deep-research)) | Dedicated end-to-end **RL-trained** agentic models (`o3-deep-research`, `o4-mini-deep-research`) that plan sub-questions, browse, run Python, and emit citation-rich reports; 5–30 min per task; API requires ≥1 data source (web search / MCP / file search). | The RL training is not replicable; the *behavioral loop* (decompose → search → adapt → cite) is. |
| **Gemini Deep Research** ([overview](https://gemini.google/overview/deep-research/), [API docs](https://ai.google.dev/gemini-api/docs/deep-research)) | Plan → multi-source search → iterate → output. Distinctive move: emits an **editable research plan for user approval before executing**; reads full pages, not snippets; revisits coverage gaps. Now API-invokable as agents `deep-research-preview-04-2026` (~$1–3/task) and `deep-research-max-preview-04-2026` (~$3–7/task), async `background=True`. | The approval-gated plan artifact is the single most copyable idea — it doubles as the run's audit trail. |
| **Perplexity Deep Research** ([announcement](https://www.perplexity.ai/hub/blog/introducing-perplexity-deep-research)) | Loop-based iterative search/read/reason; refines its plan as it learns; dozens of searches, can draw on hundreds of sources per report. | Breadth-of-sources discipline; otherwise same loop. |
| **LangChain open_deep_research** ([repo](https://github.com/langchain-ai/open_deep_research), [blog](https://www.langchain.com/blog/open-deep-research)) | Open-source supervisor agent that splits queries into subtopics and spawns parallel sub-agents; model-agnostic. Ranked #6 on FutureSearch's Deep Research Bench (0.4344) — evidence the orchestrator pattern holds up outside Anthropic. | Directly — it is the same orchestrator-worker shape. |
| **GPT Researcher** ([repo](https://github.com/assafelovic/gpt-researcher)) | Planner/executor split; opinionated about **source traceability through the pipeline** and parallelism. | Traceability convention (keep the source ledger as you go, don't reconstruct citations at the end). |
| **Stanford STORM** ([stanford-oval/storm](https://github.com/stanford-oval/storm)) | Pre-writing stage: **perspective-guided question asking** (simulate conversations from multiple reader perspectives) → outline → article with citations. | The perspective-taking trick is cheap to add and improves coverage of counterarguments. |

**Method distilled for `deep-research-v1`** (each element sourced above): (1) written research plan with sub-questions, approval-gated; (2) effort-scaling rules; (3) parallel subagents with tight task specs; (4) broad-then-narrow queries, read pages not snippets; (5) reflection step between waves — "what's missing / what conflicts"; (6) running source ledger; (7) separate citation-verification pass before the report is final.

## C. Running the same prompt in non-Claude harnesses — what's realistic

All three routes are realistic today; the map's retrofit skill is the right integration point for all of them. What each can capture for RUN.md:

- **Codex CLI**: `codex exec "prompt"` runs the agent loop headlessly, prints the final message to stdout, and `--json` emits a JSONL event stream (parseable for tool calls and token usage) ([exec docs](https://github.com/openai/codex/blob/main/docs/exec.md), [non-interactive docs](https://developers.openai.com/codex/noninteractive)). `AGENTS.md` is the CLAUDE.md equivalent for repo conventions. Caveat that matters for research: built-in web search defaults to **cached/pre-indexed results**; pass `--search` or set `web_search = "live"` for live results, and even live mode returns **snippets only** — no full-page reading ([Codex web-search notes](https://codex.danielvaughan.com/2026/05/09/codex-cli-web-search-configuration-cached-live-domain-allow-lists-prompt-injection-defence/), [issue #6031](https://github.com/openai/codex/issues/6031)). This is a genuine methodological handicap vs Claude Code's WebFetch and should be recorded in the variant definition, not hidden.
- **Gemini CLI**: headless via `-p "prompt"` (or any non-TTY invocation); built-in `google_web_search` and web-fetch tools; JSON output mode includes per-tool stats usable for cost capture; `GEMINI.md` carries repo context ([headless docs](https://google-gemini.github.io/gemini-cli/docs/cli/headless.html)). Closest non-Claude analogue to a Claude Code run.
- **API scripts**: two distinct flavors. (1) *Product* deep research — OpenAI Responses API with `o3-deep-research`/`o4-mini-deep-research` in background mode ([guide](https://developers.openai.com/api/docs/guides/deep-research), [cookbook](https://cookbook.openai.com/examples/deep_research_api/introduction_to_deep_research_api)), or Gemini Interactions API deep-research agents ([docs](https://ai.google.dev/gemini-api/docs/deep-research)). These are the frontier systems themselves — the most informative external baseline per dollar (Gemini publishes ~$1–7/task). (2) *Plain* model+search-tool scripts — cheap but reproduce none of the agentic method; low priority.
- **Filing convention**: every route reduces to "prompt text in, Markdown out, plus a usage/cost record" — so the retrofit skill needs only: the untouched output file, the exact prompt as sent, harness+model+settings, timestamps, and whatever usage object the harness emitted. Codex JSONL, Gemini CLI JSON stats, and both APIs' usage fields answer part of the map's open "automated cost/token capture" question; Claude Code interactive runs are the hardest to meter.

## D. Evaluation practice worth copying

- **DeepResearch Bench** ([arXiv 2506.11763](https://arxiv.org/abs/2506.11763), [repo](https://github.com/Ayanami0730/deep_research_bench)) is the closest published analogue to this harness's comparison problem. Two copyable mechanisms: **RACE** — per-task adaptive criteria under four fixed dimensions (comprehensiveness, insight/depth, instruction-following, readability) with dynamic weights, scored *relative to a reference report* rather than absolutely (92.7% pairwise agreement with human experts); and **FACT** — extract claim–URL pairs from the report and verify each citation actually supports its claim (0.88 Pearson vs humans). Mapping to this repo: PROMPT.md's rubric should declare per-experiment criteria under fixed dimensions, and the compare skill should score runs *against each other* (relative), plus run a citation spot-check pass.
- **FutureSearch Deep Research Bench** ([arXiv 2506.06287](https://arxiv.org/abs/2506.06287), [leaderboard](https://futuresearch.ai/deep-research-bench/)) evaluates against human-worked answers on a **frozen web snapshot** so scores stay comparable over time. Full snapshotting is out of scope here, but the lesson transfers: runs of one experiment should happen in the same time window, and RUN.md should timestamp retrieval so later re-runs aren't judged against a moved web.
- **LLM-judge bias findings**, all with primary sources: *position bias* — judges favor the first answer in pairwise comparison; standard mitigation is judging both orders and averaging ([Zheng et al., MT-Bench, arXiv 2306.05685](https://arxiv.org/abs/2306.05685); [Shi et al., arXiv 2406.07791](https://arxiv.org/html/2406.07791v5)). *Verbosity bias* — longer answers score higher independent of quality; length-controlled adjustment exists but is imperfect ([AlpacaEval-LC](https://arxiv.org/abs/2404.04475)). *Self-preference bias* — models rate their own (and family) outputs higher, and can recognize their own text ([Panickssery et al., arXiv 2404.13076](https://arxiv.org/abs/2404.13076); [Wataoka et al., arXiv 2410.21819](https://arxiv.org/html/2410.21819v2)). This sharpens the map's open judge-model question: **the judge should come from a provider whose model produced none of the compared runs** — easy day one (variants are all Claude → use a non-Anthropic judge, or accept and document the bias), unavoidable to formalize once cross-provider variants land.
- **Anthropic's own eval practice** (same engineering post): a single judge call with a rubric (factual accuracy, citation accuracy, completeness, source quality, tool efficiency) outputting 0.0–1.0 scores plus pass/fail was *more consistent* than multi-call judging; and judge **end-state, not process** — agents legitimately find different paths. Both fit the map's blind-rubric design as-is.
- **Blind protocol details**: beyond hiding variant identity, normalize superficial format (strip harness-specific headers/footers, equalize markdown flavor) before judging, since style tells de-blind the judge; and randomize file order per judging call in addition to the A/B swap.

## Annotated shortlist (decision table)

| Candidate | Type | Verdict |
|---|---|---|
| Installed `/research` | skill (have) | **Launch.** Baseline/control for both model variants. |
| `deep-research-v1` (write in-repo, Anthropic-method) | skill (write) | **Launch.** The survey's main deliverable-to-build; section B lists its seven ingredients. |
| Model axis: default vs strongest Claude | model | **Launch.** Cheapest second axis; Anthropic's own data says orchestration and token budget matter more than raw model, which is testable here. |
| secondBrain retrofit | experiment | **Launch** (already decided by map). Record the lost-skill caveat. |
| Codex CLI (`codex exec --json --search`) | harness | **Wave 2.** Realistic; snippets-only search is a real handicap to document. |
| Gemini CLI (`-p`, JSON output) | harness | **Wave 2.** Closest non-Claude analogue. |
| OpenAI `o3-deep-research` / Gemini `deep-research-preview` via API | product baseline | **Wave 2, one of them.** The frontier reference point; ~$1–7/task (Gemini published pricing). |
| Weizhena/Deep-Research-skills | skill (install) | **Skip for now**; keep as cross-harness design reference. |
| Academic literature-review suites | skill (install) | **Skip** unless an experiment is literature-review-shaped. |
| NVIDIA AI-Q server skill | infrastructure | **Skip** — external server dependency. |
| Plain API + search-tool scripts | harness | **Skip** — reproduces no method; low information value. |
| Judge: cross-provider, order-swapped pairwise + RACE-style relative rubric + citation spot-check | evaluation | **Launch** with the first comparison. |

## Sources

Primary sources are linked inline throughout. Load-bearing ones: [Anthropic multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system) · [OpenAI Deep Research intro](https://openai.com/index/introducing-deep-research/) and [API guide](https://developers.openai.com/api/docs/guides/deep-research) · [Gemini Deep Research overview](https://gemini.google/overview/deep-research/) and [API docs](https://ai.google.dev/gemini-api/docs/deep-research) · [Perplexity Deep Research](https://www.perplexity.ai/hub/blog/introducing-perplexity-deep-research) · [langchain-ai/open_deep_research](https://github.com/langchain-ai/open_deep_research) · [assafelovic/gpt-researcher](https://github.com/assafelovic/gpt-researcher) · [stanford-oval/storm](https://github.com/stanford-oval/storm) · [anthropics/skills](https://github.com/anthropics/skills) · [Weizhena/Deep-Research-skills](https://github.com/Weizhena/Deep-Research-skills) · [Codex exec docs](https://github.com/openai/codex/blob/main/docs/exec.md) · [Gemini CLI headless docs](https://google-gemini.github.io/gemini-cli/docs/cli/headless.html) · [DeepResearch Bench (arXiv 2506.11763)](https://arxiv.org/abs/2506.11763) · [FutureSearch Deep Research Bench (arXiv 2506.06287)](https://arxiv.org/abs/2506.06287) · [MT-Bench judge biases (arXiv 2306.05685)](https://arxiv.org/abs/2306.05685) · [Self-recognition/self-preference (arXiv 2404.13076)](https://arxiv.org/abs/2404.13076) · [Deep research agents survey (arXiv 2506.18096)](https://arxiv.org/abs/2506.18096). secondBrain/ was consulted only as provenance for the retrofit experiment; its topic content (PKM) did not seed methodological claims here.
