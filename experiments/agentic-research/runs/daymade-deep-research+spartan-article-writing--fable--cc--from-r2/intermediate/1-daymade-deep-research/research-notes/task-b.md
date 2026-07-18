---
task_id: b
role: Product Analyst
status: complete
sources_found: 10
---

## Sources

[1] Introducing deep research (OpenAI) | https://openai.com/index/introducing-deep-research/ | Source-Type: official | As Of: 2026-02 | Authority: 9/10
[2] Deep research | OpenAI API guide | https://developers.openai.com/api/docs/guides/deep-research | Source-Type: official | As Of: 2026-07 | Authority: 9/10
[3] Try Deep Research and our new experimental model in Gemini (Google) | https://blog.google/products-and-platforms/products/gemini/google-gemini-deep-research/ | Source-Type: official | As Of: 2024-12 | Authority: 9/10
[4] Deep Research Max: a step change for autonomous research agents (Google) | https://blog.google/innovation-and-ai/models-and-research/gemini-models/next-generation-gemini-deep-research/ | Source-Type: official | As Of: 2026-04 | Authority: 9/10
[5] Gemini Deep Research Agent — Gemini API docs | https://ai.google.dev/gemini-api/docs/deep-research | Source-Type: official | As Of: 2026 | Authority: 9/10
[6] Claude takes research to new places (Anthropic) | https://www.anthropic.com/news/research | Source-Type: official | As Of: 2025-04 | Authority: 9/10
[7] How we built our multi-agent research system (Anthropic engineering) | https://www.anthropic.com/engineering/multi-agent-research-system | Source-Type: official | As Of: 2025 | Authority: 8/10
[8] Perplexity launches its own freemium 'deep research' product (TechCrunch) | https://techcrunch.com/2025/02/15/perplexity-launches-its-own-freemium-deep-research-product/ | Source-Type: journalism | As Of: 2025-02 | Authority: 7/10
[9] Detecting and Correcting Reference Hallucinations in Commercial LLMs and Deep Research Agents (arXiv 2604.03173) | https://arxiv.org/abs/2604.03173 | Source-Type: academic | As Of: 2026-04 | Authority: 8/10
[10] Anthropic Launches Claude Science: AI Research Workbench Open To All Paid Subscribers (Tech Times; located via live search, snippet only) | https://www.techtimes.com/articles/319439/20260701/anthropic-launches-claude-science-ai-research-workbench-open-all-paid-subscribers.htm | Source-Type: journalism | As Of: 2026-07 | Authority: 5/10

## Findings

- OpenAI deep research launched in ChatGPT on Feb 2, 2025 for Pro users (100 queries/month), powered by a version of the o3 model optimized for web browsing and data analysis, trained with reinforcement learning on browser and Python tool-use tasks; runs take 5-30 minutes. [1]
- OpenAI's dated evolution: Feb 25, 2025 all Plus users; Apr 24, 2025 lightweight o4-mini version with new quotas (Plus/Team/Enterprise/Edu 25 queries/month, Pro 250, Free 5); Jul 17, 2025 visual-browser "agent mode" via ChatGPT agent; Feb 10, 2026 MCP/app connections, trusted-site restriction, and interruptible real-time progress. [1]
- OpenAI claims 26.6% on Humanity's Last Exam and a GAIA state-of-the-art of 67.36 pass@1 / 72.57 cons@64 for the model powering deep research (vendor self-reported); it also self-discloses limitations including hallucinated facts, incorrect inferences, weak confidence calibration, and citation formatting errors. [1]
- Developers access OpenAI deep research via the Responses API with model `o3-deep-research` or `o4-mini-deep-research`, must include at least one data source (web search, remote MCP, or file search over vector stores), can add code interpreter, and are advised to use background mode with webhooks (background mode is incompatible with Zero Data Retention). [2]
- Google's Gemini Deep Research launched Dec 11, 2024 for Gemini Advanced subscribers as Gemini's first agentic feature: it drafts a user-approvable multi-step research plan, browses iteratively using Google's search expertise plus a 1M-token context window, and exports cited reports to Google Docs. [3]
- Google's evolution: a Deep Research agent for developers shipped via the Interactions API in December 2025, and on Apr 21, 2026 Google released two Gemini 3.1 Pro-based agents — Deep Research (low latency) and Deep Research Max (extended test-time compute) — with remote MCP support, native charts/infographics, collaborative planning, and multimodal grounding, in public preview on paid Gemini API tiers; Google claims "a leap in performance across industry-standard benchmarks" and "rigorous factuality" (vendor self-reported, chart not independently verified). [4]
- A developer starts with Gemini Deep Research by calling `client.interactions.create(agent="deep-research-preview-04-2026")` (or `deep-research-max-preview-04-2026`) in the Interactions API, polling the interaction until completed, optionally enabling collaborative plan review via multi-turn interactions. [5]
- Anthropic's Research feature launched Apr 15, 2025 in early beta for Max, Team, and Enterprise plans (US, Japan, Brazil): Claude agentically runs successive, self-refining searches across the web and Google Workspace and returns cited answers in minutes; Anthropic's engineering blog discloses the architecture as a lead agent (Claude Opus 4) spawning parallel Claude Sonnet 4 search subagents, which it says beat single-agent Opus 4 by 90.2% on an internal research eval (vendor self-reported, internal benchmark). [6][7]
- Perplexity Deep Research launched Feb 14, 2025 as the only freemium option — free with a limited daily query count, unlimited for Pro subscribers — completing most reports in under 3 minutes; Perplexity claimed 21.1% on Humanity's Last Exam (vendor self-reported, relayed by TechCrunch) versus OpenAI Deep Research's 26.6%. [8]
- An April 2026 academic study of 53,090+ citation URLs found 3-13% of citation URLs from commercial LLMs and deep research agents are hallucinated (no Wayback Machine record, likely never existed) and 5-18% non-resolving overall, with deep research agents hallucinating URLs at HIGHER rates than search-augmented LLMs — directly tempering vendor claims of "fully documented," easily verifiable citations. [9]

## Deep Read Notes

### Source [1]: Introducing deep research (OpenAI)
Key data: Launch Feb 2, 2025 (Pro, 100 queries/mo); o3-based browsing/analysis model trained via RL on real-world tool-use tasks; HLE 26.6% (vs GPT-4o 3.3%), GAIA 67.36 pass@1 / 72.57 cons@64 (all vendor self-reported); 5-30 min runs; dated update log: Feb 5, 2025 (UK/CH/EEA Pro), Feb 25, 2025 (all Plus), Apr 24, 2025 (o4-mini lightweight + quotas 25/250/5), Jul 17, 2025 (ChatGPT agent visual browser), Feb 10, 2026 (MCP connections, trusted-source restriction, interruptible runs).
Key insight: OpenAI itself documents hallucination, rumor-vs-authority confusion, and poor confidence calibration as launch limitations "at a notably lower rate than existing ChatGPT models, according to internal evaluations" — i.e., even the limitation framing is vendor self-assessed.
Useful for: canonical OpenAI timeline, pricing tiers/quotas, benchmark table, vendor-admitted limitations.

### Source [4]: Deep Research Max (Google, Apr 21, 2026)
Key data: Two agents on Gemini 3.1 Pro — Deep Research (replaces Dec 2025 Interactions API preview; lower latency/cost) and Deep Research Max (extended test-time compute for exhaustive overnight jobs); features: arbitrary remote MCP tools, native HTML/Nano Banana charts, collaborative planning, web-off mode for private-data-only research, real-time thought streaming; partnerships with FactSet, S&P Global, PitchBook on MCP server designs; same infrastructure powers Gemini App, NotebookLM, Google Search AI Mode, and Google Finance; public preview on paid Gemini API tiers, Google Cloud "soon."
Key insight: Google is repositioning deep research from a consumer chat feature into an API-first enterprise pipeline primitive ("first step in complex, agentic pipelines"); benchmark claims are presented only as an image/chart with no numeric table in the post body (vendor self-reported and hard to audit).
Useful for: mid-2026 state of Gemini offering, developer entry point, Google vs OpenAI API convergence on MCP + background research jobs.

### Source [9]: Detecting and Correcting Reference Hallucinations (arXiv 2604.03173, Apr 3, 2026)
Key data: 10 models/agents on DRBench (53,090 URLs) and 3 models on ExpertQA (168,021 URLs, 32 fields); 3-13% of citation URLs hallucinated, 5-18% non-resolving; domain spread 5.4% (Business) to 11.4% (Theology); some models fabricate every non-resolving URL; open-source `urlhealth` tool cuts non-resolving citations 6-79x to under 1% in agentic self-correction.
Key insight: Deep research agents produce more citations per query than search-augmented LLMs but hallucinate URLs at higher rates — an independent, quantified counterweight to every vendor's "cited and verifiable" pitch, and evidence the failure is correctable with tooling rather than intrinsic.
Useful for: the independent-limitations section; the strongest counter-claim evidence found in this task.

## Gaps

- Perplexity's primary announcement (perplexity.ai/hub/blog/introducing-perplexity-deep-research) is confirmed to exist via live search but was unfetchable in this session (Cloudflare challenge on direct fetch; r.jina.ai abuse-block on the perplexity.ai domain; web.archive.org also blocked via r.jina.ai) — all Perplexity claims here are relayed through TechCrunch [8]. Also could not confirm Perplexity's exact free-tier daily query cap or any Perplexity deep-research API.
- No independent replication of any vendor benchmark was found: OpenAI's HLE 26.6%/GAIA numbers [1], Perplexity's HLE 21.1% [8], Google's "leap in performance" chart [4], and Anthropic's 90.2% internal-eval improvement [7] are all vendor self-reported.
- Counter-claim candidate: arXiv 2604.03173 [9] finds deep research agents hallucinate citation URLs at higher rates than plain search-augmented LLMs (3-13% fabricated, 5-18% non-resolving), directly contradicting vendor marketing that deep research outputs are "fully documented, with clear citations... easy to reference and verify" (OpenAI [1]) and deliver "rigorous factuality" (Google [4]).
- Anthropic's mid-2026 research-product state is under-documented in fetched primary sources: the July 1, 2026 "Claude Science" workbench launch (multi-agent orchestration, all paid subscribers) surfaced only as a live search snippet from Tech Times [10] and was not verified against an Anthropic announcement page in this session; no Anthropic-branded deep-research API model comparable to o3-deep-research was found.

## END
