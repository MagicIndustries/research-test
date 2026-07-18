# P4 Evidence-Mapped Outline

Deliverable layout (per prompt's format contract):
- README.md — index
- summary.md — main summary (TL;DR first)
- single-prompt-skills/{README.md,resources.md}
- multi-agent-pipelines/{README.md,resources.md}
- commercial-products/{README.md,resources.md}
- open-source-frameworks/{README.md,resources.md}
- research-notes/ — evidence trail (task notes, registry, this outline, counter-review, execution log)

## summary.md

### 0. TL;DR
Sources: synthesis of all. No new claims — each mirrored in body.

### 1. Key terms
Sources: [6] deep research def; [7] research agent + orchestrator–worker defs; [4][39] LLM-as-judge.
Recency: definitions stable 2023–2026.

### 2. Background: where deep research came from
Sources: [1] RAG 2020 → [2] WebGPT 2021 → [3] ReAct 2022 → [5] Gemini DR Dec 2024 → [8] OpenAI Feb 2025 → [13] Perplexity Feb 2025 → [12][7] Anthropic Apr–Jun 2025 → [10] Deep Research Max Apr 2026.
Counter-claim: browsing-research loop predates products by 3 years (WebGPT) [2]; "invention" claims contestable (task-a gap).
Confidence: High (primary-source dated chain).

### 3. The four approaches (map + trade-off table)
Sources: pointers into the four subdirectory docs; cross-cutting: [25] hosted-vs-open framing, [7] vs [38] architecture dispute, [26] GAIA 55 vs 67 open-vs-hosted gap.

### 4. Shared methodological ingredients
Sources: [7] decomposition/effort-scaling/citation-pass/parallelism; [34] compaction/note-taking/just-in-time retrieval; [25] brief compression + context isolation; [31] progressive disclosure; [36] community convergence (effort modes, disk-persisted sources, validation loops); [24] perspective-guided questioning; [21] recursive breadth/depth.
Confidence: High for "these are the stated methods"; Medium for "these cause quality" (no controlled comparisons — flag).

### 5. Evaluation: judging research quality
Sources: [4] judge foundations + biases; [39][40][41] reliability limits; [42][43] RACE/FACT, 68.78% human ceiling, judge migration; [44] frozen-web answer-verifiable camp; [45][46][47] short-answer benchmarks don't measure reports; [14] citation hallucination 3–13%; [7] Anthropic's practical rubric judge.
Counter-claims: JUDGE-BENCH task-conditionality [41]; noisy human ceiling [43].
Confidence: High.

### 6. What we could not find
Sources: task gaps — no independent replication of vendor benchmarks (task-b gap); no head-to-head 2026 OSS benchmark (task-c gap); no independent single-agent-vs-multi-agent comparison (task-d gap); no audited per-product citation-accuracy figures (task-e gap); Perplexity primary blog unfetchable (task-b gap); Claude Science snippet-only [15].

### 7. Key controversies (P6 output)
- Multi-agent vs single-agent context engineering [7][38] + token-spend confound [7].
- Vendor "verifiable citations" vs 3–13% hallucinated URLs [8][10][14].
- LLM judges vs human judgment for long reports [41][43].

### 8. Recommended steps for the solo Claude Code developer
Sources: [48][49][50] native surface; [36][51] reusable skills; [52][53] search MCP; [54][55] judge harness; [7][34] method ingredients to port; [9][11] hosted APIs as baselines.
Tailoring: user already runs a skill-comparison harness in git (from prompt).

### 9. Disclosure & method
AFK auto-approval; degraded retrieval path (execution-log.md); AS_OF 2026-07-18.

### References
Registry subset actually cited.

## Subdirectory docs

### single-prompt-skills/ 
[30][31][48] mechanism; [32] repo evidence; [36][37][51] community skills; getting-going; trade-offs (cheap, transparent, single-context limits [34]); maturity: Oct 2025 launch, 162k stars [32].

### multi-agent-pipelines/
[7] canonical pipeline + prompt principles; [33] workflows-vs-agents; [35] LangChain patterns; [25] supervisor design; [38] counter-case; trade-offs 15x tokens [7]; getting-going.

### commercial-products/
[8][9] OpenAI; [5][10][11] Google; [13] Perplexity (secondary-only flag); [12][15] Anthropic; [6] system card; [14] independent citation audit; per-product getting-going; all benchmark numbers flagged vendor self-reported.

### open-source-frameworks/
[16–29] repo metadata + architectures; [23] Tongyi; [26] GAIA gap; DeerFlow reclassification counter-claim [18][27]; getting-going per framework; trade-offs.
