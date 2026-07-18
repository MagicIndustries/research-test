# P7 Verification

Date: 2026-07-18

## 1. Registry cross-check

Extracted every `[n]` token from all 10 deliverable files (README.md, summary.md, 4× approach README.md, 4× resources.md): the set used is exactly [1]–[55], with no gaps referenced out of range and no number absent from the approved registry. Dropped-source resurrection check: trivially passes (0 sources dropped).

## 2. Claim spot-checks (traced to task notes)

| # | Claim in report | Trace | Result |
|---|---|---|---|
| 1 | WebGPT answers preferred 56% vs human demonstrators [2] | task-a Findings #2 | ✓ |
| 2 | OpenAI quotas 25/250/5 + dated update log [8] | task-b Findings #24/Deep Read [1] + independent lead-agent live fetch of the same page | ✓ |
| 3 | DeerFlow 77,320 stars, 2.0 repositioning [18][27] | task-c Findings #29 / Deep Read [12] | ✓ |
| 4 | Human inter-annotator agreement 68.78%; judge migration Gemini-2.5-Pro→GPT-5.5 [43] | task-e Findings #28 / Deep Read [4]/[5] | ✓ |
| 5 | 3–13% hallucinated citation URLs; 5–18% non-resolving; agents worse than search-LLMs [14] | task-b Findings #32 / Deep Read [9] | ✓ |
| 6 | RACE four dimensions; FACT statement-URL verification [42][43] | task-e Findings #26/#27 | ✓ |

## 3. Live URL re-verification (lead agent, this session)

- https://arxiv.org/abs/2604.03173 → HTTP 200 ✓
- https://techcrunch.com/2025/02/15/perplexity-launches-its-own-freemium-deep-research-product/ → HTTP 200 ✓
- https://api.github.com/repos/Ayanami0730/deep_research_bench → exists, pushed 2026-05-11 (consistent with registry As Of 2026-05) ✓
- https://www.anthropic.com/engineering/multi-agent-research-system → HTTP 200; the `/built-multi-agent-research-system` variant 307-redirects to it (canonicalization verified) ✓
- GitHub star counts independently re-verified via API for anthropics/skills (162,240), mvanhorn/last30days-skill (52,585), 199-biotechnologies/claude-deep-research-skill (939) ✓
- https://openai.com/index/introducing-deep-research/ fetched live by lead agent (content matches task-b's citation of launch text and dated updates) ✓

## 4. Violations found and fixed

None at P7 (the GAIA-comparability, staleness, and selection-bias issues were caught and fixed at P6 — see counter-review.md).

## 5. Source concentration check

Most-cited source is [7] (Anthropic multi-agent post), cited across summary §1/§2/§4/§5/§7/§8 and two subdirectories — appropriate, as it is the canonical primary source for the orchestrator–worker pattern; its load-bearing numbers are flagged vendor-self-reported at every use. No section rests on [7] alone for a contested conclusion (Cognition [38] and the token-confound are co-presented). Pass.
