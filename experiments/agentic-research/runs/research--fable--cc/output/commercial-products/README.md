# Approach 3: Commercial Deep-Research Products

*Hosted, end-to-end research agents from OpenAI, Google, Perplexity, and
Anthropic. Part of the [agentic deep research report](../SUMMARY.md).*

All performance figures in this file are **vendor self-reported** unless noted.

## Google Gemini Deep Research

- **Shipped first**: December 11, 2024
  ([Google blog](https://blog.google/products/gemini/google-gemini-deep-research/)).
- **How it works**: generates "a multi-step research plan for you to either
  revise or approve", then browses iteratively — "searching, finding
  interesting pieces of information and then starting a new search based on
  what it's learned" — for ~5–10 minutes before writing a linked-citation
  report. Can ground in Gmail/Drive/Chat and export to Canvas/Audio Overviews
  ([overview page](https://gemini.google/overview/deep-research/),
  [Workspace blog](https://workspace.google.com/blog/ai-and-machine-learning/meet-deep-research-your-new-ai-research-assistant)).
- **API (2026)**: exposed as an agent via the Interactions API — models
  `deep-research-preview-04-2026` and `deep-research-max-preview-04-2026`;
  background + streaming execution, optional collaborative plan review, code
  execution, MCP servers, File Search; estimated **$1–3 per standard task,
  $3–7 comprehensive**; 60-minute cap; no structured output
  ([Gemini API docs](https://ai.google.dev/gemini-api/docs/deep-research)).
- **Distinctive**: the user-editable plan step, Workspace grounding, Google
  Search as retrieval backbone.

## OpenAI deep research

- **Launched** February 2, 2025 in ChatGPT
  ([announcement](https://openai.com/index/introducing-deep-research/)).
- **How it works**: an o3-derived agent "trained on real-world tasks requiring
  browser and Python tool use, using the same reinforcement learning methods
  behind OpenAI o1"; runs 5–30 minutes; synthesizes "hundreds of online
  sources" into a fully cited report. This RL-on-research-tasks training is
  the key differentiator no prompt-level system can copy.
- **Reported results**: **26.6%** on Humanity's Last Exam (new high at the
  time), state of the art on GAIA (same announcement) [vendor self-reported].
- **API**: `o3-deep-research` and `o4-mini-deep-research` via the Responses
  API; requires at least one data source among web search, remote MCP
  servers, or file search over vector stores
  ([API guide](https://developers.openai.com/api/docs/guides/deep-research)).
  Also resold via
  [Azure AI Foundry Agent Service](https://azure.microsoft.com/en-us/blog/introducing-deep-research-in-azure-ai-foundry-agent-service/).

## Perplexity Deep Research

- **Launched** February 14, 2025, **free tier included**
  ([announcement](https://www.perplexity.ai/hub/blog/introducing-perplexity-deep-research)).
- **How it works**: "iteratively searches, reads documents, and reasons about
  what to do next, refining its research plan as it learns"; then synthesizes
  a report. Typically completes in a few minutes — fastest of the majors.
- **Reported results**: **21.1%** HLE, **93.9%** SimpleQA [vendor
  self-reported]. In July 2026 Perplexity published the
  [DRACO benchmark](https://research.perplexity.ai/articles/evaluating-deep-research-performance-in-the-wild-with-the-draco-benchmark)
  on which its own product leads all domains with the lowest latency —
  **treat as vendor self-reporting with a structural conflict of interest**,
  though the benchmark itself is open-sourced.

## Anthropic Claude Research

- **Launched** April 2025; "advanced" mode + Integrations May 2025 — searches
  the web, Google Workspace, and MCP-powered Integrations
  ([Anthropic announcement on X](https://x.com/AnthropicAI/status/1917972747000692919);
  secondary coverage:
  [SiliconANGLE](https://siliconangle.com/2025/05/01/anthropic-updates-claude-new-integrations-feature-upgraded-research-tool/)).
- **Distinctive**: it is the productized orchestrator–worker system whose
  architecture Anthropic published in full
  ([engineering post](https://www.anthropic.com/engineering/multi-agent-research-system))
  — the only commercial deep-research product with a first-party architecture
  disclosure. In 2026 Anthropic extended the direction with
  [Claude Science](https://www.anthropic.com/news/claude-science-ai-workbench),
  a research workbench aimed at scientists.

## Trade-offs (all four)

| Dimension | Assessment |
|---|---|
| Quality | Highest headline scores; only systems whose *models* are RL-trained on research tasks (confirmed for OpenAI; implied elsewhere) |
| Cost | Subscription or per-task API ($1–7 Gemini estimate; OpenAI per-token on deep-research models); cheapest to *start*, priciest at volume |
| Transparency | Lowest: prompts, orchestration, and source policy closed (Anthropic's write-up excepted); reports cite sources but the process is a black box |
| Control | Limited steering (Gemini's editable plan is the notable exception); no custom rubrics, formats only loosely controllable |
| Lock-in | Full — output quality, quotas, and behavior change under your feet with silent model updates |

## Getting going

1. **Zero-cost trial**: Perplexity Deep Research (free tier) for a feel of
   speed/quality; Gemini and ChatGPT deep research on paid consumer plans.
2. **Programmatic / harness use**: Gemini's
   [Deep Research API](https://ai.google.dev/gemini-api/docs/deep-research)
   (`background=True`, poll or stream) or OpenAI's
   [deep research models in the Responses API](https://developers.openai.com/api/docs/guides/deep-research).
   `o4-mini-deep-research` and Gemini standard tier are the economical picks
   for a baseline arm in a comparison harness.
3. Prompt these products with the same research-brief discipline as any agent:
   scope, deliverable format, source-quality constraints — Gemini will show
   you its plan; edit it.

Annotated sources: [resources.md](resources.md).
