# Approach 3: Commercial Deep-Research Products

> Part of [The State of the Art in Agentic Deep Research](../SUMMARY.md) | AS_OF: 2026-07-18 | Citation numbers are global — see [../research-notes/registry.md](../research-notes/registry.md)
> All vendor performance figures below are self-reported unless explicitly marked independent.

## OpenAI Deep Research (ChatGPT)

Launched February 2, 2025, on a version of the o3 model optimized for web browsing; runs fully autonomously for roughly 5–30 minutes of multi-step search, analysis, and synthesis (vendor self-described) [15][20]. Initial quotas: 10 queries/month for Plus/Team/Enterprise/Edu, 120 for Pro (self-reported) [15]. February 2026: moved to GPT-5.2, adding site-specific search via connected apps, mid-run source injection, and full-screen reports [16]. API access shipped mid-2025: `o3-deep-research` at $10/$40 per million input/output tokens and `o4-mini-deep-research` at $2/$8, Responses-API-only, with always-on web search adding ~10–30 searches per query (independently exercised and documented by Simon Willison) [21]. Caveat: OpenAI's announcement page blocked direct fetching (HTTP 403); its self-reported benchmark scores could not be re-verified in a full page read [15].

## Google Gemini Deep Research

The first product to carry the name: launched December 11, 2024 in Gemini Advanced, described as an iterative plan-search-read-reason loop with an asynchronous task manager, **user-editable research plans**, and a 1M-token context window (self-reported) [6][17]. Relaunched on Gemini 3 Pro on December 11, 2025 [13]. April 21, 2026: **Deep Research Max** on Gemini 3.1 Pro with extended test-time compute, MCP and file-store access, native chart generation, in paid public preview via the Gemini API Interactions API — with benchmark "leaps" published only as win-rates against Google's own prior version, no absolute scores [14].

## Perplexity Deep Research

Launched February 14, 2025, including a free tier; the launch post claims 21.1% on Humanity's Last Exam and 93.9% on SimpleQA, completing most reports in 2–4 minutes (all self-reported; page 403-blocked, relayed via snippets and commentary) [10][11]. February 2026: Advanced Deep Research for Max subscribers, marketed as state-of-the-art on DRACO — **a benchmark Perplexity itself authored**, with no independent replication found [18].

## Anthropic Claude Research

Launched April 2025; architecture published June 2025: orchestrator–worker with a Claude Opus 4 lead spawning parallel Claude Sonnet 4 subagents, self-reporting +90.2% over single-agent Opus 4 on an internal eval at ~15x chat token cost [5]. Distinctive for publishing its engineering trade-offs and failure modes; see [../multi-agent-pipelines/](../multi-agent-pipelines/README.md).

## Independent evidence (the important part)

- **Citation fabrication:** a UPenn audit (Apr 2026) of ~168k cited URLs found Gemini-2.5-pro-deepresearch fabricated **13.3%** of citation URLs and OpenAI deep research **3.5%**, versus 4.8% pooled for plain search-augmented LLMs; more citations per query did not improve per-citation reliability; a mechanical URL-checking tool cut non-resolving URLs 6–79x [19].
- **Rubric compliance:** ResearchRubrics (Scale AI, Nov 2025) found Gemini and OpenAI Deep Research achieve **under 68%** compliance with expert-written rubrics, failing mostly on implicit context and reasoning over retrieved evidence [48].
- **Category criticism:** independent journalism notes report length itself raises error risk — "targeted search queries with capable reasoning models are often more reliable" than long agentic reports [16].
- **Unaudited:** no independent citation-accuracy audit of Claude Research specifically was found; the UPenn study tested Claude only as a search-augmented LLM [19].

## Evidence of maturity and activity

All four products have shipped continuously for 12–18 months with major model upgrades (o3→GPT-5.2 [16]; Gemini 2.0→3.1 Pro [14]; Opus 4 lead [5]), API surfaces [21][14], and expanding quotas — the strongest activity signal of any approach. But maturity of *operations* is not maturity of *reliability*: the independent audits above post-date most marketing claims and contradict several of them.

## Trade-offs

**For:** zero setup; strongest base models; polished long-report UX; increasingly API-accessible for pipeline embedding [21][14].
**Against:** opaque (internal evals, no inspectable traces, benchmark opacity [14][18]); usage caps and subscription pricing [15]; documented citation-fabrication rates [19]; no control over methodology — you cannot fix what you cannot see; vendor lock-in of the whole research process rather than a component.

**Confidence: High** for launch dates and independent audit numbers; **Medium** for all vendor-quoted benchmark figures (403-blocked primaries, self-reporting).
**Counter-reading:** the marketed premise that agentic deep research is *more* reliable than ordinary search is directly contradicted for citation reliability by the only large independent audit [19].

## Getting going

1. To *use*: any of the four via subscription; Perplexity has a free tier [10]. Compare outputs on a question you know deeply before trusting any of them.
2. To *embed*: OpenAI's deep-research API models ($2–$40/Mtok) [21] or Google's Deep Research Max via the Gemini API (paid preview, MCP-connectable) [14].
3. Whatever you use, run independent verification on outputs: URL-liveness checks and claim-level citation validation — the UPenn tooling approach [19] — since this is where the products measurably fail.

## References (cited here)

[5] Anthropic. "How we built our multi-agent research system". official (self-reported). 2025-06. https://www.anthropic.com/engineering/multi-agent-research-system
[6] Google. "Introducing Gemini 2.0". official. 2024-12. https://blog.google/technology/google-deepmind/google-gemini-ai-update-december-2024/
[10] Perplexity. "Introducing Perplexity Deep Research". official (self-reported; fetch blocked). 2025-02. https://www.perplexity.ai/hub/blog/introducing-perplexity-deep-research
[11] Simon Willison. "Introducing Perplexity Deep Research" (commentary). secondary-industry. 2025-02. https://simonwillison.net/2025/Feb/16/introducing-perplexity-deep-research/
[13] TechCrunch. "Google launched its deepest AI research agent yet". journalism. 2025-12. https://techcrunch.com/2025/12/11/google-launched-its-deepest-ai-research-agent-yet-on-the-same-day-openai-dropped-gpt-5-2/
[14] Google. "Deep Research Max". official (self-reported win-rates). 2026-04. https://blog.google/innovation-and-ai/models-and-research/gemini-models/next-generation-gemini-deep-research/
[15] OpenAI. "Introducing deep research". official (self-reported; fetch blocked). 2025-02. https://openai.com/index/introducing-deep-research/
[16] The Decoder. "OpenAI's Deep Research now runs on GPT-5.2". journalism. 2026-02. https://the-decoder.com/openais-deep-research-now-runs-on-gpt-5-2-and-lets-users-search-specific-websites/
[17] Google. "Try Deep Research and our new experimental model in Gemini". official. 2024-12. https://blog.google/products/gemini/google-gemini-deep-research/
[18] TestingCatalog. "Perplexity launches Advanced Deep Research for Max users". secondary-industry. 2026-02. https://www.testingcatalog.com/perplexity-launches-advanced-deep-research-for-max-users/
[19] Rao, Wong, Callison-Burch (UPenn). "Detecting and Correcting Reference Hallucinations in Commercial LLMs and Deep Research Agents". academic. 2026-04. https://arxiv.org/html/2604.03173v1
[20] TechCrunch. "OpenAI unveils a new ChatGPT agent for 'deep research'". journalism. 2025-02. https://techcrunch.com/2025/02/02/openai-unveils-a-new-chatgpt-agent-for-deep-research/
[21] Simon Willison. "Exploring OpenAI's deep research API model o4-mini-deep-research". community. 2025-07. https://til.simonwillison.net/llms/o4-mini-deep-research
[48] Sharma et al. (Scale AI). "ResearchRubrics". academic. 2025-11. https://arxiv.org/abs/2511.07685
