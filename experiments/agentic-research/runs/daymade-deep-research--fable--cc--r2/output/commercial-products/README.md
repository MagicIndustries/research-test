# Approach 3: Commercial Deep-Research Products

> Hosted, turnkey research agents from OpenAI, Google, Perplexity, and Anthropic. Highest polish and lowest setup cost; least transparency, and every performance number is vendor self-reported.

**Confidence: High** for timelines, features, and developer entry points (primary vendor sources, live-fetched); **Medium-Low** for quality claims (no independent benchmark replication found); **Low** for the Perplexity section (primary blog unfetchable — secondary source only) and for Claude Science (snippet-verified only).

## OpenAI Deep Research

**How it works.** Launched in ChatGPT on February 2, 2025 for Pro users (100 queries/month), powered by a version of o3 optimized for web browsing and data analysis, trained with reinforcement learning on browsing and Python tool-use tasks; runs take 5–30 minutes [8]. The system card (2025-02-25) defines deep research as "a new agentic capability that conducts multi-step research on the internet for complex tasks" and discloses that during training, responses were graded against ground truth or rubrics by a chain-of-thought model — an LLM-as-judge inside the RL loop [6].

**Evolution** (dated updates on the launch page itself) [8]: Feb 25, 2025 — all Plus users; Apr 24, 2025 — lightweight o4-mini version, quotas of 25/month (Plus/Team/Enterprise/Edu), 250 (Pro), 5 (Free); Jul 17, 2025 — visual-browser "agent mode" via ChatGPT agent; Feb 10, 2026 — MCP/app connections, trusted-site restriction, interruptible runs with real-time progress.

**Claimed results (vendor self-reported):** 26.6% on Humanity's Last Exam (vs 3.3% for GPT-4o) and GAIA 67.36 pass@1 / 72.57 cons@64 [8]. OpenAI itself discloses limitations: hallucinated facts, incorrect inferences, rumor-vs-authority confusion, weak confidence calibration, citation formatting errors — with rates assessed only by internal evaluations [8]. The system card flags **prompt injection** via browsed pages as a defining risk class [6].

**Getting going.** ChatGPT: pick "deep research" in the tools menu. API: Responses API with `o3-deep-research` or `o4-mini-deep-research`; at least one data source required (web search, remote MCP, or file search over vector stores); code interpreter optional; background mode + webhooks advised (background mode is incompatible with Zero Data Retention) [9].

## Google Gemini Deep Research

**How it works.** Launched December 11, 2024 for Gemini Advanced as Gemini's first agentic feature: it drafts a user-approvable multi-step research plan, browses iteratively using Google search plus a 1M-token context window, and exports cited reports to Google Docs [5].

**Evolution.** A developer-facing Deep Research agent shipped via the Interactions API in December 2025; on April 21, 2026 Google released two Gemini 3.1 Pro-based agents — **Deep Research** (low latency) and **Deep Research Max** (extended test-time compute for overnight jobs) — with remote MCP support, native charts, collaborative planning, a web-off mode for private-data-only research, and MCP-server partnerships with FactSet, S&P Global, and PitchBook; public preview on paid Gemini API tiers [10]. Google claims "a leap in performance across industry-standard benchmarks" and "rigorous factuality" — presented as a chart image with no numeric table, so **vendor self-reported and hard to audit** [10]. Google is repositioning deep research from a consumer chat feature into an API-first pipeline primitive (the same infrastructure powers the Gemini app, NotebookLM, Search AI Mode, and Google Finance) [10].

**Getting going.** Gemini app for the consumer feature [5]. API: `client.interactions.create(agent="deep-research-preview-04-2026")` (or `deep-research-max-preview-04-2026`), poll the interaction to completion, optionally enable collaborative plan review via multi-turn interactions [11].

## Perplexity Deep Research

**Secondary source only** — Perplexity's own announcement was unfetchable through three routes this run (Cloudflare challenge, reader-proxy domain block, archive block), so all claims are relayed through TechCrunch [13]. Launched February 14, 2025 as the only freemium option: free with a limited daily query count, unlimited for Pro; most reports complete in under 3 minutes; claimed 21.1% on Humanity's Last Exam (vendor number relayed by journalism) [13]. Exact free-tier caps and any deep-research API could not be confirmed, and these February 2025 details are likely stale by AS_OF 2026-07-18. **Confidence: Low.**

## Anthropic Claude Research

**How it works.** The Research feature launched April 15, 2025 in early beta for Max, Team, and Enterprise plans (US, Japan, Brazil): Claude agentically runs successive, self-refining searches across the web and Google Workspace and returns cited answers [12]. Anthropic's engineering blog discloses the architecture in unusual detail — a lead agent (Claude Opus 4) spawning parallel Claude Sonnet 4 search subagents — and reports a 90.2% improvement over single-agent Opus 4 on an internal eval (vendor self-reported) [7]. See `../multi-agent-pipelines/` for the full method.

**Mid-2026 state is under-documented in primary sources:** a July 1, 2026 "Claude Science" research-workbench launch (multi-agent orchestration, all paid subscribers) surfaced only as a journalism snippet and was not verified against an Anthropic announcement [15] — treat as unconfirmed. No Anthropic deep-research API model comparable to `o3-deep-research` was found (task-b gap).

**Getting going.** Research toggle in Claude apps on eligible plans [12]; or build the equivalent in Claude Code (see `../multi-agent-pipelines/` and the main summary's recommended steps).

## Independent evidence on limitations (applies to all vendors)

An April 2026 academic audit of 53,090+ citation URLs found **3–13% of citation URLs produced by commercial LLMs and deep-research agents are hallucinated** (likely never existed) and 5–18% fail to resolve, with deep-research agents hallucinating URLs at *higher* rates than plain search-augmented LLMs — directly tempering vendor claims of "fully documented," verifiable citations [14]. The same study shows an agentic self-correction tool (`urlhealth`) cuts non-resolving citations 6–79x, suggesting the failure is correctable with tooling rather than intrinsic [14].

## Trade-offs

| Dimension | Assessment |
|---|---|
| Quality | Highest headline benchmarks, but all self-reported; independent audit shows citation reliability is materially worse than marketed [14] |
| Cost | Subscription tiers (free tastes to $200/mo-class Pro plans) or per-token API; zero engineering time |
| Transparency | Lowest — prompts, source selection, and synthesis logic are closed; OpenAI's system card and Anthropic's engineering blog are partial exceptions [6][7] |
| Control | Improving: both OpenAI and Google now support restricting sources / MCP data feeds [8][10] |
| Reproducibility | Poor for a harness: models and pipelines change under you without notice (see the dated-update logs [8][10]) |

## References

[5] Google — Try Deep Research in Gemini — https://blog.google/products/gemini/google-gemini-deep-research/ (official; vendor self-reporting)
[6] OpenAI — Deep Research System Card — https://cdn.openai.com/deep-research-system-card.pdf (official)
[7] Anthropic — How we built our multi-agent research system — https://www.anthropic.com/engineering/multi-agent-research-system (official; vendor self-reporting)
[8] OpenAI — Introducing deep research — https://openai.com/index/introducing-deep-research/ (official; vendor self-reporting)
[9] OpenAI — Deep research API guide — https://developers.openai.com/api/docs/guides/deep-research (official)
[10] Google — Deep Research Max — https://blog.google/innovation-and-ai/models-and-research/gemini-models/next-generation-gemini-deep-research/ (official; vendor self-reporting)
[11] Google — Gemini API: Deep Research Agent — https://ai.google.dev/gemini-api/docs/deep-research (official)
[12] Anthropic — Claude takes research to new places — https://www.anthropic.com/news/research (official)
[13] TechCrunch — Perplexity launches deep research — https://techcrunch.com/2025/02/15/perplexity-launches-its-own-freemium-deep-research-product/ (journalism; relays vendor claims)
[14] arXiv 2604.03173 — Detecting and Correcting Reference Hallucinations — https://arxiv.org/abs/2604.03173 (academic; independent)
[15] Tech Times — Anthropic Launches Claude Science — https://www.techtimes.com/articles/319439/20260701/anthropic-launches-claude-science-ai-research-workbench-open-all-paid-subscribers.htm (journalism; snippet-verified only — Low confidence)
