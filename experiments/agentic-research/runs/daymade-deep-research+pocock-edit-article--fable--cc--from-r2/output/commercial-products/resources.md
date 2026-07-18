# Annotated resources — commercial deep-research products

All URLs live-verified during this run unless noted (AS_OF 2026-07-18). Global citation numbers match `../research-notes/registry.md`. **Every performance number in these sources is vendor self-reported unless marked independent.**

## OpenAI

- **[8] Introducing deep research** — https://openai.com/index/introducing-deep-research/ — Launch post (2025-02-02) that doubles as a changelog: all five dated updates through 2026-02-10 live on this page, plus the HLE/GAIA benchmark tables and a self-disclosed limitations section. The single best page for the OpenAI timeline. *Official; self-reported.*
- **[6] Deep Research System Card** — https://cdn.openai.com/deep-research-system-card.pdf — 2025-02-25. The authoritative definition of "deep research"; RL-on-browsing training disclosure with chain-of-thought LLM graders; prompt-injection risk analysis. *Official.*
- **[9] Deep research API guide** — https://developers.openai.com/api/docs/guides/deep-research — Developer on-ramp: `o3-deep-research` / `o4-mini-deep-research` on the Responses API; data-source requirements; background mode + webhooks; ZDR incompatibility. *Official.*

## Google

- **[5] Try Deep Research and our new experimental model in Gemini** — https://blog.google/products/gemini/google-gemini-deep-research/ — 2024-12-11 launch: the plan-approve-browse-report loop, 1M-token context, Docs export. Historically important as the first shipped "Deep Research." *Official; self-reported.*
- **[10] Deep Research Max: a step change for autonomous research agents** — https://blog.google/innovation-and-ai/models-and-research/gemini-models/next-generation-gemini-deep-research/ — 2026-04-21. Two Gemini 3.1 Pro agents (standard + Max extended test-time compute); MCP tools; FactSet/S&P/PitchBook partnerships; API-first repositioning. Benchmark claims are a chart image with no numbers — flagged as unauditable. *Official; self-reported.*
- **[11] Gemini API: Deep Research Agent** — https://ai.google.dev/gemini-api/docs/deep-research — Developer on-ramp: Interactions API agent IDs `deep-research-preview-04-2026` / `deep-research-max-preview-04-2026`; polling; collaborative plan review. *Official.*

## Perplexity

- **[13] Perplexity launches its own freemium 'deep research' product** — https://techcrunch.com/2025/02/15/perplexity-launches-its-own-freemium-deep-research-product/ — TechCrunch, 2025-02-15. **The only fetchable source this run** — Perplexity's primary blog was blocked via three routes. Freemium positioning, sub-3-minute runs, HLE 21.1% (vendor number relayed). *Journalism (secondary); Low-confidence basis for all Perplexity claims here.*

## Anthropic

- **[12] Claude takes research to new places** — https://www.anthropic.com/news/research — 2025-04-15. Research feature launch: agentic successive search, web + Google Workspace, cited answers; Max/Team/Enterprise early beta. *Official.*
- **[7] How we built our multi-agent research system** — https://www.anthropic.com/engineering/multi-agent-research-system — The architecture disclosure behind the product (see `../multi-agent-pipelines/resources.md` for the full annotation). *Official; self-reported.*
- **[15] Anthropic Launches Claude Science** — https://www.techtimes.com/articles/319439/20260701/anthropic-launches-claude-science-ai-research-workbench-open-all-paid-subscribers.htm — Tech Times, 2026-07-01. Claude Science workbench claim; **snippet-verified only, not confirmed against any Anthropic page — treat as unconfirmed.** *Journalism; Low authority.*

## Independent evaluation

- **[14] Detecting and Correcting Reference Hallucinations in Commercial LLMs and Deep Research Agents** — https://arxiv.org/abs/2604.03173 — 2026-04-03. The key independent audit: 53,090+ URLs across 10 systems; 3–13% hallucinated citation URLs, 5–18% non-resolving; deep-research agents worse than search-augmented LLMs; open-source `urlhealth` tool cuts failures 6–79x. The counterweight to every vendor citation claim. *Academic; independent.*
