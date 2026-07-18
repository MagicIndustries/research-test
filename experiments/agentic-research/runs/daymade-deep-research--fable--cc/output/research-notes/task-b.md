---
task_id: b
role: Commercial Product Analyst
status: complete
sources_found: 10
---

## Sources

[1] Introducing deep research | OpenAI | https://openai.com/index/introducing-deep-research/ | Source-Type: official | As Of: 2025-02 | Authority: 9/10
[2] OpenAI's Deep Research now runs on GPT-5.2 and lets users search specific websites | https://the-decoder.com/openais-deep-research-now-runs-on-gpt-5-2-and-lets-users-search-specific-websites/ | Source-Type: journalism | As Of: 2026-02 | Authority: 7/10
[3] How we built our multi-agent research system | Anthropic | https://www.anthropic.com/engineering/multi-agent-research-system | Source-Type: official | As Of: 2025-06 | Authority: 9/10
[4] Deep Research Max: a step change for autonomous research agents | Google | https://blog.google/innovation-and-ai/models-and-research/gemini-models/next-generation-gemini-deep-research/ | Source-Type: official | As Of: 2026-04 | Authority: 9/10
[5] Try Deep Research and our new experimental model in Gemini | Google | https://blog.google/products/gemini/google-gemini-deep-research/ | Source-Type: official | As Of: 2024-12 | Authority: 9/10
[6] Introducing Perplexity Deep Research | https://www.perplexity.ai/hub/blog/introducing-perplexity-deep-research | Source-Type: official | As Of: 2025-02 | Authority: 9/10
[7] Perplexity launches Advanced Deep Research for Max users | https://www.testingcatalog.com/perplexity-launches-advanced-deep-research-for-max-users/ | Source-Type: secondary-industry | As Of: 2026-02 | Authority: 6/10
[8] Detecting and Correcting Reference Hallucinations in Commercial LLMs and Deep Research Agents (Rao, Wong, Callison-Burch, UPenn) | https://arxiv.org/html/2604.03173v1 | Source-Type: academic | As Of: 2026-04 | Authority: 8/10
[9] OpenAI unveils a new ChatGPT agent for 'deep research' | TechCrunch | https://techcrunch.com/2025/02/02/openai-unveils-a-new-chatgpt-agent-for-deep-research/ | Source-Type: journalism | As Of: 2025-02 | Authority: 7/10
[10] Exploring OpenAI's deep research API model o4-mini-deep-research | Simon Willison | https://til.simonwillison.net/llms/o4-mini-deep-research | Source-Type: community | As Of: 2025-07 | Authority: 7/10

## Findings

- OpenAI Deep Research launched February 2, 2025, powered by a version of the o3 model optimized for web browsing that runs fully autonomously for roughly 5-30 minutes across multi-step search, analysis, and synthesis (vendor self-reported architecture). [1]
- OpenAI initially allotted 10 deep research queries/month to Plus/Team/Enterprise/Edu subscribers and 120/month to Pro users (vendor self-reported availability). [1]
- In February 2026 OpenAI moved Deep Research from o3/o4-mini to GPT-5.2, added site-specific search via connected apps, real-time progress with mid-run source injection, and full-screen report output. [2]
- OpenAI exposed Deep Research via API in mid-2025 as o3-deep-research ($10/$40 per M input/output tokens) and o4-mini-deep-research ($2/$8), Responses-API-only with always-on web search adding ~10-30 searches per query. [10]
- Google launched Gemini Deep Research December 2024 in Gemini Advanced, describing an iterative plan-search-read-reason loop with a novel asynchronous task manager, user-editable research plans, and a 1M-token context window (vendor self-reported). [5]
- On April 21, 2026 Google announced Deep Research Max, built on Gemini 3.1 Pro with extended test-time compute, MCP/file-store access, and native chart generation, in paid public preview via the Gemini API Interactions API (benchmark "leap" claims are vendor self-reported win-rates without published absolute scores). [4]
- Perplexity Deep Research launched February 14, 2025 including a free tier, claiming 21.1% on Humanity's Last Exam and 93.9% on SimpleQA (vendor self-reported). [6]
- In February 2026 Perplexity shipped Advanced Deep Research for Max subscribers (Pro rollout following) alongside its own DRACO benchmark, on which it claims state-of-the-art accuracy — a benchmark it authored itself, so treat leadership claims as vendor self-reported. [7]
- Anthropic launched Claude's Research feature in April 2025 and detailed its architecture in June 2025: an orchestrator-worker design where a Claude Opus 4 lead agent spawns parallel Claude Sonnet 4 subagents for dynamic search. [3]
- Anthropic claims the multi-agent system beat single-agent Opus 4 by 90.2% on an internal research eval (vendor self-reported, internal, unverifiable), while conceding multi-agent runs consume ~15x the tokens of a chat and fit poorly for interdependent tasks like coding. [3]
- An independent UPenn audit (April 2026) of ~168k cited URLs found Gemini-2.5-pro-deepresearch fabricated 13.3% of citation URLs and OpenAI deep research 3.5%, versus 4.8% pooled for plain search-augmented LLMs, and found more citations per query does not improve per-citation reliability. [8]
- Independent journalism notes deep research outputs' length raises error risk and that "targeted search queries with capable reasoning models are often more reliable" than long agentic reports, a standing verbosity/reliability criticism of the category. [2]

## Deep Read Notes

### Source [3]: How we built our multi-agent research system (Anthropic)
Key data: Published June 13, 2025; Opus 4 lead + Sonnet 4 subagents; +90.2% vs single-agent on internal eval; ~4x tokens vs chat single-agent, ~15x for multi-agent.
Key insight: Only vendor to publish an engineering-level account of the orchestrator-worker pattern, including where it fails (shared-context/interdependent tasks, no async execution yet).
Useful for: Claude Research architecture and the cost/benefit trade-off of multi-agent research.

### Source [4]: Deep Research Max (Google)
Key data: Announced April 21, 2026; Gemini 3.1 Pro base; two variants (interactive Deep Research vs asynchronous Max); paid public preview via Gemini API Interactions API; MCP + multimodal inputs.
Key insight: Shows 2026 trajectory toward API-first, MCP-connected research agents; benchmark claims given only as win-rates vs Google's own Dec 2025 version, no absolute scores.
Useful for: Gemini 2026 status, API availability, and flagging vendor benchmark opacity.

### Source [2]: The Decoder on GPT-5.2 Deep Research upgrade
Key data: February 10, 2026; upgrade path o3/o4-mini -> GPT-5.2; site-specific search via connected apps; interruptible runs.
Key insight: Documents the model-version churn of the product post-launch and repeats the core criticism that longer reports carry higher hallucination risk than targeted search.
Useful for: OpenAI 2026 status and independent framing of reliability limits.

### Source [8]: Reference Hallucinations in Commercial LLMs and Deep Research Agents (arXiv 2604.03173)
Key data: April 3, 2026; DRBench (53,090 URLs) + ExpertQA (168,021 URLs); hallucinated-URL rates: Gemini deepresearch 13.3%, OpenAI deepresearch 3.5%, search-augmented LLMs 4.8% pooled; open-source urlhealth tool cut non-resolving URLs 6-79x.
Key insight: The only large-scale independent measurement here, and it directly contradicts the assumption that agentic deep research is more citation-reliable than simple search-augmented answering (at least for Gemini).
Useful for: Third-party assessment of hallucinated citations across vendors.

## Gaps

- Could not fetch the official OpenAI and Perplexity announcement pages directly (HTTP 403); their benchmark figures (e.g., Perplexity's 21.1% HLE) were relayed via search-result snippets of those pages, and OpenAI's exact self-reported HLE/GAIA scores could not be re-verified in a full page read.
- No independent, third-party citation-accuracy audit of Claude Research specifically was found — the UPenn study tested Claude only as a search-augmented LLM, not as the Research agent — so Anthropic's 90.2% internal-eval claim has no external check.
- Vendor BrowseComp scores for these products were not confirmed in any fetched source, despite the benchmark being commonly referenced in commentary.
- Counter-claim candidate: vendors market deep research agents as more reliable than ordinary chat search, but the UPenn audit found deep research agents (pooled) fabricate citations at a higher rate than plain search-augmented LLMs, and Anthropic's own data suggests measured gains may partly reflect ~15x greater token expenditure rather than architectural superiority.
- Perplexity's DRACO and WANDR "state-of-the-art" claims are on benchmarks Perplexity itself authored, a methodological conflict of interest with no independent replication found.

## END
