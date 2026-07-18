# Approach 4: Open-Source Research Frameworks

*Self-hosted deep-research pipelines. Part of the
[agentic deep research report](../SUMMARY.md).*

Repo statistics read directly from GitHub on 2026-07-18.

## The major frameworks

### GPT Researcher — the incumbent

[assafelovic/gpt-researcher](https://github.com/assafelovic/gpt-researcher) —
**28.4k stars, Apache-2.0, v3.5.1 released June 23, 2026** (active).
Planner/executor architecture predating the commercial products: planner
agents generate research questions, execution agents gather per-question,
a publisher aggregates "over 20 sources" into a cited report. Its recursive
"Deep Research" mode runs ~5 minutes and ~**$0.40 per report** (README figure,
o3-mini pricing). MCP data sources, local-document research, LangGraph/AG2
multi-agent report team, Docker. Its site claims a #1 rank on CMU's
DeepResearchGym [project self-reported].

### STORM / Co-STORM — the academically validated one

[stanford-oval/storm](https://github.com/stanford-oval/storm) — **30.1k stars,
MIT**; papers at NAACL 2024
([arXiv:2402.14207](https://arxiv.org/abs/2402.14207)) and EMNLP 2024
(Co-STORM, [arXiv:2408.15232](https://arxiv.org/abs/2408.15232)). Pipeline:
knowledge curation → outline generation → article generation → polishing, with
*perspective-guided question asking* — simulated conversations between
persona'd writers and a grounded expert. Expert judges rated STORM articles
+25 absolute points on organization and +10 on breadth vs an RAG baseline
(paper-reported). Development has slowed (last release v1.1.0, Jan 2025) —
treat as a methods source more than a live product.

### Hugging Face Open Deep Research — the transparent reproduction

[smolagents open_deep_research example](https://github.com/huggingface/smolagents/tree/main/examples/open_deep_research)
— built in a 24-hour sprint after OpenAI's launch
([HF blog, Feb 2025](https://huggingface.co/blog/open-deep-research)).
Scored **55.15%** on GAIA validation vs OpenAI deep research's 67.36% and the
prior open SOTA (Magentic-One) ~46%. Its headline ablation: expressing agent
actions **in code instead of JSON tool calls** is worth 55.15% → 33% — the
single clearest public architecture experiment in this space. Ships a
text-based browser (adapted from Microsoft's Magentic-One) and a multi-format
text inspector.

### dzhng/deep-research — the minimal loop

[dzhng/deep-research](https://github.com/dzhng/deep-research) — **19.4k stars,
MIT, TypeScript, <500 lines** by design. Two parameters: **breadth** (queries
per iteration, 3–10) and **depth** (recursion levels, 1–5). Each cycle:
generate SERP queries → extract learnings → spawn follow-up directions →
recurse → compile a markdown report with sources. The best codebase to *read*
to understand the core loop in one sitting.

### LangChain open_deep_research — the benchmarked multi-agent one

Covered in [multi-agent-pipelines/](../multi-agent-pipelines/README.md):
supervisor + parallel researchers, RACE 0.4344, #6 on
[DeepResearch Bench](https://deepresearch-bench.github.io/) at post time.

### Ecosystem watchlists

Curated lists tracking dozens more (II-Researcher, node-DeepResearch, etc.):
[DavidZWZ/Awesome-Deep-Research](https://github.com/DavidZWZ/Awesome-Deep-Research)
and [scienceaix/deepresearch](https://github.com/scienceaix/deepresearch).

## Trade-offs

| Dimension | Assessment |
|---|---|
| Quality | Best open results trail frontier products (GAIA 55 vs 67; DeepResearch Bench top slots held by products) but are respectable and improving |
| Cost | Fully controllable — choose models, cap iterations; ~$0.40/report is achievable (GPT Researcher README); you also pay for search APIs (Tavily/SerpAPI etc.) |
| Transparency | Total: prompts, loops, and source policies are code you can read and patch |
| Maintenance | The real tax: fast-moving deps, variable project health (STORM slowing; GPT Researcher active), self-hosted search keys |
| Fit for a solo dev | Better as a parts bin than a platform if you already live in an agent harness — see [SUMMARY.md §7](../SUMMARY.md) |

## Getting going

1. **Understand the loop**: read dzhng/deep-research's source (one sitting).
2. **Run one report**: GPT Researcher via Docker or pip with an OpenAI +
   Tavily key; inspect the intermediate questions and per-question summaries
   it writes.
3. **Study the strongest ablation**: the
   [HF blog](https://huggingface.co/blog/open-deep-research) on code-actions
   vs JSON — it should influence any agent you build.
4. **Mine STORM** for its question-generation and outline prompts rather than
   deploying it.
5. **Benchmark** whatever you assemble against
   [DeepResearch Bench](https://deepresearch-bench.github.io/) tasks with its
   open RACE/FACT evaluators.

Annotated sources: [resources.md](resources.md).
