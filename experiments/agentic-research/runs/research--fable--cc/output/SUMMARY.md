# Agentic Deep Research: Main Summary

*Compiled 2026-07-18. Index: [README.md](README.md).*

## TL;DR

Deep research — an agent that plans, searches, reads, and iterates for minutes
before writing a cited report — went from a Google product name (December 2024)
to a commodity capability in about eighteen months. Every frontier vendor ships
one; several open-source frameworks with 19k–30k GitHub stars replicate the
pattern; and the core recipe is now well documented, most explicitly in
[Anthropic's engineering post on its multi-agent Research system](https://www.anthropic.com/engineering/multi-agent-research-system).
The recipe's shared ingredients: an explicit **research plan/brief** before any
searching; **iterative search→read→reason loops** that start broad and
progressively narrow; **parallel subagents with isolated contexts** for
breadth-heavy questions (Anthropic reports a 90.2% internal-eval improvement
over a single agent — at ~15× the tokens of chat) [vendor self-reported];
**outline-first writing** (pioneered by Stanford's
[STORM](https://arxiv.org/abs/2402.14207)); **citation grounding with a
verification pass**; and **rubric-based LLM-as-judge evaluation** during
development. The frontier products additionally use **end-to-end RL training on
research tasks** ([OpenAI](https://openai.com/index/introducing-deep-research/)),
which no prompt-level system can copy — but the evaluation literature
([DeepResearch Bench](https://arxiv.org/abs/2506.11763),
[DRACO](https://research.perplexity.ai/articles/evaluating-deep-research-performance-in-the-wild-with-the-draco-benchmark))
shows prompt- and orchestration-level systems get most of the way there. For a
solo developer already in Claude Code with a skill-comparison harness, the
leverage ranking is: (1) a well-engineered research **skill** encoding the
shared ingredients, (2) **selective subagent parallelism** with effort-scaling
rules, (3) a **RACE/FACT-style judge** wired into the harness, and (4) a
commercial deep-research API as a **baseline comparator** — in that order.

---

## 1. Key terms

**Deep research.** An agentic capability in which a model "conducts multi-step
research on the internet for complex tasks," independently finding, analyzing,
and synthesizing many online sources into a cited report over tens of minutes
([OpenAI, "Introducing deep research," Feb 2, 2025](https://openai.com/index/introducing-deep-research/)).
The academic survey literature defines it more generally as systems that
"combine the reasoning capabilities of LLMs with external tools, such as search
engines" to tackle complex open-ended tasks with verifiable outputs
([Shi et al., *Deep Research: A Systematic Survey*, arXiv:2512.02038](https://arxiv.org/abs/2512.02038)).

**Research agent / deep research agent (DRA).** An "autonomous AI system" built
on LLMs that performs "dynamic reasoning, adaptive long-horizon planning,
multi-hop information retrieval, iterative tool use, and the generation of
structured analytical reports"
([Huang et al., *Deep Research Agents: A Systematic Examination And Roadmap*, arXiv:2506.18096](https://arxiv.org/abs/2506.18096)).

**Orchestrator–worker (lead agent + subagents).** A multi-agent architecture in
which a lead agent "analyzes [the query], develops a strategy, and spawns
subagents to explore different aspects simultaneously," then synthesizes their
condensed findings
([Anthropic engineering, June 2025](https://www.anthropic.com/engineering/multi-agent-research-system)).
Also called supervisor–researcher
([LangChain Open Deep Research](https://blog.langchain.com/open-deep-research/)).

**LLM-as-judge.** Using a strong LLM to grade another model's output against a
rubric or reference. Foundational result: GPT-4-as-judge reaches "over 80%
agreement" with human preferences — the same level as human–human agreement —
but exhibits position bias, verbosity bias, self-enhancement bias, and limited
reasoning capability
([Zheng et al., *Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena*, arXiv:2306.05685](https://arxiv.org/abs/2306.05685)).

---

## 2. Background: where deep research came from

The lineage runs through four phases (secondary synthesis; each anchor is a
primary source):

1. **Tool-using LLMs (2021–2022).**
   [WebGPT (Nakano et al., 2021, arXiv:2112.09332)](https://arxiv.org/abs/2112.09332)
   put GPT-3 behind a text-based browser and trained it with human feedback to
   answer long-form questions with citations — the direct ancestor of every
   browsing agent.
   [ReAct (Yao et al., 2022, arXiv:2210.03629)](https://arxiv.org/abs/2210.03629)
   supplied the architectural template — interleaved reasoning and acting —
   that essentially all agent frameworks still implement.
2. **The autonomous-agent moment (2023).** AutoGPT/BabyAGI-style loops made
   "agent plans its own subtasks" mainstream;
   [GPT Researcher](https://github.com/assafelovic/gpt-researcher) (mid-2023)
   applied a planner/executor split specifically to web research, well before
   any vendor product carried the name.
3. **Academic pre-writing systems (2024).** Stanford's
   [STORM (NAACL 2024)](https://arxiv.org/abs/2402.14207) showed that
   *perspective-guided question asking* plus *outline-first drafting* produces
   Wikipedia-grade long-form articles — experts judged its articles
   25 absolute points more "well-organized" than a baseline (paper-reported).
4. **The product wave (Dec 2024–2026).**
   [Google shipped Gemini Deep Research on Dec 11, 2024](https://blog.google/products/gemini/google-gemini-deep-research/)
   — the first product with the name.
   [OpenAI followed Feb 2, 2025](https://openai.com/index/introducing-deep-research/)
   with an RL-trained o3-based agent;
   [Perplexity on Feb 14, 2025](https://www.perplexity.ai/hub/blog/introducing-perplexity-deep-research)
   made it free-tier; Hugging Face published a
   [24-hour open reproduction](https://huggingface.co/blog/open-deep-research)
   (Feb 2025); Anthropic shipped
   [Claude Research (Apr–May 2025)](https://siliconangle.com/2025/05/01/anthropic-updates-claude-new-integrations-feature-upgraded-research-tool/)
   *(secondary report of the announcement)* and published the
   [engineering write-up](https://www.anthropic.com/engineering/multi-agent-research-system)
   that became the field's de facto design document. By 2026 deep research is
   an API primitive:
   [OpenAI's `o3-deep-research` via the Responses API](https://developers.openai.com/api/docs/guides/deep-research)
   and
   [Google's `deep-research-preview-04-2026` via the Interactions API](https://ai.google.dev/gemini-api/docs/deep-research).
   The survey literature caught up in 2025 with
   [arXiv:2506.18096](https://arxiv.org/abs/2506.18096) and
   [arXiv:2512.02038](https://arxiv.org/abs/2512.02038), the latter
   decomposing all systems into query planning, information acquisition,
   memory management, and answer generation.

---

## 3. The approach map

Four ways to get a research report out of an LLM agent, in increasing order of
machinery. Full write-ups in each subdirectory.

### 3.1 Single-prompt research skills — [details](single-prompt-skills/README.md)

One well-engineered instruction package (an
[Agent Skill](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills):
a folder with a `SKILL.md`) loaded into an existing agent harness such as
Claude Code, which already owns the loop, the browser/search tools, and the
filesystem. The skill encodes the workflow — clarify, plan, search broadly,
narrow, verify citations, write structured markdown. Cheapest, most
transparent, fully git-versionable; bounded by one context window and the
harness's tools. Maturity: the
[Agent Skills open standard](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)
and [anthropics/skills](https://github.com/anthropics/skills) shipped Oct 2025
and skills are portable across Claude apps, Claude Code, and the API
(vendor docs). No published benchmark scores exist for skill-based research —
a real gap (§6).

### 3.2 Orchestrated multi-agent pipelines — [details](multi-agent-pipelines/README.md)

An orchestrator decomposes the question and spawns parallel worker agents with
isolated context windows; a synthesis step merges findings. Primary source:
[Anthropic's multi-agent Research system](https://www.anthropic.com/engineering/multi-agent-research-system)
— multi-agent Opus 4 + Sonnet 4 subagents beat single-agent Opus 4 by **90.2%**
on their internal research eval [vendor self-reported], token usage alone
explains ~80% of eval variance, and the cost is ~**15×** chat-level tokens.
Open implementation:
[LangChain open_deep_research](https://github.com/langchain-ai/open_deep_research)
(supervisor + parallel researchers; RACE 0.4344, #6 on the DeepResearch Bench
leaderboard at time of its blog post — framework-self-reported against a public
benchmark). Best quality-per-engineering-hour for breadth-heavy questions;
worst cost profile; hardest to debug.

### 3.3 Commercial deep-research products — [details](commercial-products/README.md)

Hosted, RL-trained, end-to-end products:
[OpenAI deep research](https://openai.com/index/introducing-deep-research/)
(o3-based, trained with RL "on real-world tasks requiring browser and Python
tool use"; 26.6% on Humanity's Last Exam [vendor self-reported]),
[Gemini Deep Research](https://gemini.google/overview/deep-research/)
(editable research plan, Workspace grounding, now an
[API agent](https://ai.google.dev/gemini-api/docs/deep-research) at ~$1–7/task),
[Perplexity Deep Research](https://www.perplexity.ai/hub/blog/introducing-perplexity-deep-research)
(free tier; 21.1% HLE, 93.9% SimpleQA [vendor self-reported]), and
[Claude Research with Integrations](https://x.com/AnthropicAI/status/1917972747000692919).
Highest polish and the only systems with research-task RL in the underlying
model; zero transparency, no control over prompts or source policy.

### 3.4 Open-source research frameworks — [details](open-source-frameworks/README.md)

Self-hosted pipelines:
[GPT Researcher](https://github.com/assafelovic/gpt-researcher) (28.4k stars,
Apache-2.0, planner/executor, ~$0.40 per deep-research report per its README),
[STORM/Co-STORM](https://github.com/stanford-oval/storm) (30.1k stars, MIT,
outline-first article generation, NAACL/EMNLP papers),
[Hugging Face Open Deep Research](https://huggingface.co/blog/open-deep-research)
(smolagents CodeAgent; **55.15%** GAIA validation vs OpenAI's 67.36% — and
switching the same agent from code-actions to JSON tool calls dropped it to
33%), [dzhng/deep-research](https://github.com/dzhng/deep-research) (19.4k
stars, MIT, <500 lines, breadth/depth recursive loop), and LangChain ODR
(above). Full transparency and cost control; you bring search APIs and absorb
maintenance variance.

---

## 4. What the best systems share: methodological ingredients

Cross-cutting analysis (each ingredient traced to the primary source that
demonstrates it):

1. **A plan before any search.** Gemini generates "a multi-step research plan
   for you to either revise or approve"
   ([Google](https://blog.google/products/gemini/google-gemini-deep-research/));
   Anthropic's lead agent "develops a strategy" first; LangChain compiles a
   research brief before delegating. The plan is the single highest-leverage
   artifact: it fixes scope, decomposition, and stopping conditions.
2. **Iterative loops with progressive narrowing.** Anthropic's prompt
   principle: start with "short, broad queries, evaluate what's available,
   then progressively narrow focus"
   ([Anthropic](https://www.anthropic.com/engineering/multi-agent-research-system)).
   Perplexity's agent "iteratively searches, reads documents, and reasons
   about what to do next, refining its research plan as it learns"
   ([Perplexity](https://www.perplexity.ai/hub/blog/introducing-perplexity-deep-research)).
   dzhng/deep-research reduces this to two knobs, breadth and depth.
3. **Parallelism with context isolation.** Subagents each get their own
   context window, so total reasoning tokens scale past a single window;
   parallel tool use "cut research time by up to 90%" for complex queries
   ([Anthropic](https://www.anthropic.com/engineering/multi-agent-research-system)).
   LangChain's supervisor delegates "independent sub-topics… with isolated
   context windows"
   ([LangChain](https://blog.langchain.com/open-deep-research/)).
4. **Effort scaling — explicit rules for how hard to try.** Anthropic embeds
   heuristics like "simple fact-finding requires just 1 agent with 3–10 tool
   calls"; without them, early agents "spawn[ed] 50 subagents for simple
   queries." Token budget is the dominant performance variable (80% of
   variance), so spending it proportionally is the core economic decision.
5. **Outline-first, structure-aware writing.**
   [STORM](https://arxiv.org/abs/2402.14207) separates knowledge curation →
   outline generation → article generation → polishing, and its
   perspective-guided questions measurably improve organization and breadth
   (expert-judged, paper-reported).
6. **Citation grounding plus a verification pass.** WebGPT's original training
   objective was answers "with citations"; every 2025+ product links each
   claim to a source; the
   [FACT evaluation framework](https://arxiv.org/abs/2506.11763) makes
   statement–URL support checking a first-class metric, which the best
   pipelines mirror internally as a pre-publication pass.
7. **Rubric-based LLM-as-judge in the development loop.** Anthropic graded
   outputs 0.0–1.0 on factual accuracy, citation accuracy, completeness,
   source quality, and tool efficiency — end-state grading, not step-by-step —
   with humans catching what the judge missed
   ([Anthropic](https://www.anthropic.com/engineering/multi-agent-research-system)).
8. **Agents act in code, not just JSON.** Hugging Face's ablation: the same
   research agent scored 55.15% (GAIA validation) with code actions vs 33%
   with JSON tool calls
   ([Hugging Face](https://huggingface.co/blog/open-deep-research)).
9. **RL on research tasks — the frontier-only ingredient.** OpenAI's deep
   research model was "trained on real-world tasks requiring browser and
   Python tool use, using the same reinforcement learning methods behind
   OpenAI o1" ([OpenAI](https://openai.com/index/introducing-deep-research/));
   the surveys classify RL as one of three optimization families alongside
   prompting and SFT ([arXiv:2512.02038](https://arxiv.org/abs/2512.02038)).
   Everything in items 1–8 is available at the prompt/orchestration level;
   this one is not.

---

## 5. Judging research quality: the evaluation literature

- **Foundational method.** LLM-as-judge is validated at >80% human agreement
  but with known biases — position, verbosity, self-enhancement — so serious
  harnesses randomize order and blind the judge
  ([Zheng et al. 2023](https://arxiv.org/abs/2306.05685)).
- **Report-quality benchmarks.**
  [DeepResearch Bench (arXiv:2506.11763)](https://arxiv.org/abs/2506.11763):
  100 PhD-level tasks across 22 fields, authored by domain experts. Two
  open-sourced frameworks: **RACE** (adaptive, task-specific weighted criteria
  over Comprehensiveness, Insight, Instruction-Following, Readability, scored
  *relative to expert reference reports*) and **FACT** (effective citation
  count + statement–URL citation accuracy). A successor,
  [DeepResearch Bench II (arXiv:2601.08536)](https://arxiv.org/pdf/2601.08536),
  moves toward diagnosis. [DeepScholar-Bench (arXiv:2508.20033)](https://arxiv.org/pdf/2508.20033)
  adds a *live* benchmark for research synthesis to resist contamination.
- **Rubric-per-task grading.**
  [Perplexity's DRACO (July 17, 2026)](https://research.perplexity.ai/articles/evaluating-deep-research-performance-in-the-wild-with-the-draco-benchmark):
  100 tasks, ~40 expert-written binary criteria each (~50% weighted to factual
  accuracy), LLM judge grants each criterion pass/fail. **Conflict-of-interest
  flag:** Perplexity authored the benchmark and reports its own product on
  top; treat rankings as vendor self-reporting, but the *method* (many binary,
  fact-anchored criteria instead of one holistic score) matches where the
  academic literature is converging.
- **Capability vs. report-quality benchmarks.** GAIA, Humanity's Last Exam,
  and BrowseComp measure *finding hard answers*; RACE/DRACO-style suites
  measure *report quality*. The two are not interchangeable — the
  [DRA survey](https://arxiv.org/abs/2506.18096) explicitly criticizes
  "misalignment between evaluation metrics and the practical objectives" of
  research agents.
- **Practitioner consensus.** Anthropic: grade end states, not step-by-step
  trajectories; small eval sets (tens of queries) are enough to steer early
  development; keep a human in the loop for hallucinated answers on unusual
  queries ([Anthropic](https://www.anthropic.com/engineering/multi-agent-research-system)).

---

## 6. What I could not find

- **Neutral head-to-head evaluation of the commercial products.** Every
  headline number (90.2%, 26.6% HLE, 21.1% HLE, 93.9% SimpleQA, DRACO
  rankings) is published by the vendor it favors. Academic leaderboards
  (DeepResearch Bench) cover some products but lag releases.
- **Commercial system internals.** OpenAI and Google do not publish their
  agents' prompts, orchestration, or source-selection policy; Anthropic's post
  is the only first-party architecture disclosure at this depth.
- **Any published benchmark of skill-based (single-prompt-in-harness)
  research** — e.g., Claude Code + research skill scored on DeepResearch
  Bench. Nothing found; this is exactly what a personal harness can measure.
- **Reliable cross-system cost-per-report data.** Only fragments: GPT
  Researcher's ~$0.40 (README), Gemini API's $1–7 estimate (docs), Anthropic's
  15× token multiplier. No controlled comparison.
- **Independent replication of Anthropic's 90.2%** or of the claim that
  multi-agent wins specifically on parallelizable breadth-heavy tasks
  (plausible, widely repeated, unreplicated outside Anthropic).
- **Longitudinal quality studies** — whether these reports actually save
  expert time or change decisions. Marketing anecdotes only.

---

## 7. Recommended steps — solo developer, Claude Code daily, skill-comparison harness in git

You already sit on the two highest-leverage assets: a harness that can run the
same question through multiple variants, and a skill system that is exactly the
"single-prompt research skill" approach. Assemble, don't build:

1. **Make the skill encode §4's ingredients (1, 2, 5, 6).** One
   `SKILL.md` that mandates: a written research brief with scope and stopping
   conditions; broad-then-narrow search; an outline before drafting; a final
   citation-verification pass that rechecks each load-bearing claim against
   its source; and mandatory labeling of secondary sources and vendor
   self-reporting. This is prompt engineering, versioned in git — the
   cheapest tier, and per §4 it captures most non-RL ingredients.
2. **Add subagent parallelism behind an effort-scaling rule (ingredients 3–4).**
   In Claude Code, the skill can dispatch parallel subagents for genuinely
   independent subtopics. Copy Anthropic's guardrails verbatim: explicit
   agent-count rules by query complexity, detailed task descriptions per
   subagent to prevent duplication, and a synthesis step in the lead context.
   Expect ~an-order-of-magnitude token cost when you turn this on
   ([Anthropic](https://www.anthropic.com/engineering/multi-agent-research-system));
   reserve it for breadth-heavy questions.
3. **Wire a judge into the harness (ingredient 7).** Score each run on
   RACE-style dimensions (comprehensiveness, insight, instruction-following,
   readability) plus a FACT-style citation-support check; use many binary,
   fact-anchored criteria per task (DRACO's method) rather than one holistic
   score; blind the judge and swap presentation order to counter the biases in
   [Zheng et al.](https://arxiv.org/abs/2306.05685). Grade end states.
   Twenty test queries is a defensible starting set (Anthropic's practice).
4. **Seed test tasks from the open benchmarks.**
   [DeepResearch Bench](https://deepresearch-bench.github.io/) and
   [DRACO](https://research.perplexity.ai/articles/evaluating-deep-research-performance-in-the-wild-with-the-draco-benchmark)
   are open-sourced; take a handful of tasks in your own domains, plus your
   real questions.
5. **Run one hosted product as the harness's baseline arm.** Gemini's
   [Deep Research API](https://ai.google.dev/gemini-api/docs/deep-research)
   (~$1–3 standard) or OpenAI's
   [`o4-mini-deep-research`](https://developers.openai.com/api/docs/guides/deep-research)
   gives you a frontier RL-trained comparator per question — the one
   ingredient you cannot prompt your way into. Beating or matching it in your
   harness, on your tasks, is the success criterion.
6. **Steal selectively from the frameworks rather than adopting one.**
   STORM's perspective-guided question generation and dzhng's breadth/depth
   knobs port directly into a skill; GPT Researcher is worth running once to
   observe its planner/executor traces. A full framework adds a second
   runtime to maintain for little gain over Claude Code + skills for a solo
   operator.
7. **Track cost per report alongside quality.** Token usage explains most
   performance variance, so your harness should report it per run — otherwise
   every comparison silently rewards the variant that spent more.
