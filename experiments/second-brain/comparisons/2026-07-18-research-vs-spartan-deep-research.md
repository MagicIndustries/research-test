# Second-brain: research--fable--cc vs spartan-deep-research--fable--cc

Judge: claude-fable-5 | Protocol: v1 order-swapped blind | Key: report-A = research--fable--cc (3,163 words), report-B = spartan-deep-research--fable--cc (4,026 words)
Caveats: judge shares provider and model with both runs — self-preference bias noted per protocol ([Require a cross-provider judge](https://github.com/MagicIndustries/research-test/issues/10) is the fix); B is ~27% longer, and judges were explicitly warned against volume; runs 43 minutes apart, same retrieval window.

## Scores

| Dimension | Pass 1 (A-first) | Pass 2 (B-first) | Agreement |
|---|---|---|---|
| Coverage | tie | slightly A | direction ✓, magnitude flagged |
| Depth of synthesis | **strongly B** | slightly B | direction ✓, magnitude flagged |
| Instruction-following / actionability | slightly A | slightly A | ✓ exact |
| Readability / navigation | tie | tie | ✓ exact |
| Citation quality | **strongly A** | slightly A | direction ✓, magnitude flagged |
| **Overall** | **slightly A** | **slightly A** | ✓ exact |

No directional disagreements across either pass — order effects did not flip any dimension. Three magnitude gaps (coverage, synthesis, citation) are recorded above, not averaged.

## Judge rationale

- **Coverage** (tie → slightly A): both hit every prompt element; A's extras (live star counts and push dates, dormancy flags, capture pipelines, spaced repetition, a trade-off table on exactly the four asked axes) roughly cancel or slightly beat B's (hosted-app breadth: Reflect, Capacities, Tana, Zep; NotebookLM detail; Microsoft Recall).
- **Depth of synthesis** (B, both passes — the one dimension B wins): B surfaces source conflicts (Screenpipe marketing vs its own repo, a misdated Obsidian announcement, mutually inconsistent vendor benchmarks), engages substantive dissent against the pattern it recommends (silent corruption, the un-internalized-wiki objection) and resolves it into a two-tier design, and names what it could not find. A recommends its central family nearly uncritically.
- **Instruction-following / actionability** (slightly A, both passes): A answers more literally — per-family "how LLMs changed it" subsections, the four-axis trade-off ledger, per-step "why first" rationale, a reasoned skip-list. B's git-init-before-agent-writes opening step was noted as the safer practical call.
- **Readability** (tie, both passes): A tighter per word with scannable tables; B compensates with TL;DR and numbered cross-referenced findings.
- **Citation quality** (A, both passes): A ties nearly every load-bearing claim to the source that owns it; B repeatedly cites SEO aggregators for load-bearing specifics — while earning credit for *labeling* secondary sources and flagging vendor self-reporting.

## Citation spot-check

12 claims sampled (6 per report), each fetched live 2026-07-18: **9 SUPPORTED, 3 PARTIAL, 0 UNSUPPORTED, 0 dead links**. Both reports' most aggressive claims — obscure dates, star counts, shutdown minutiae — verified exactly.

| Report | Claim (short) | Cited source | Verdict |
|---|---|---|---|
| baseline | Karpathy gist: date, layers, quote, stars | karpathy gist | SUPPORTED |
| baseline | Obsidian CLI quotes | obsidian.md/cli | SUPPORTED |
| baseline | AAIF founding: date, members, 97M downloads + 10k servers "per LF" | LF press release | PARTIAL — 97M figure is from the co-cited Anthropic announcement, misattributed to LF |
| baseline | Claude Code auto-memory mechanics | code.claude.com docs | SUPPORTED |
| baseline | Limitless shutdown: dates, 7 jurisdictions, export window | limitless.ai | SUPPORTED |
| baseline | Notion AI tiers and zero-retention | notion.com/pricing | SUPPORTED |
| spartan | Obsidian pricing: free work use, Sync $5, Publish $10 | obsidian.md/pricing | SUPPORTED |
| spartan | Karpathy wiki ~100 articles/~400k words, 10–15 pages per ingest | karpathy gist | PARTIAL — 10–15 is in the gist; 100/400k figures are not, though attributed to it |
| spartan | NotebookLM tier caps | elephas.app | PARTIAL — numbers match but the $19.99 tier is misnamed "Plus"; the source's actual Plus tier contradicts the label |
| spartan | Limitless/Meta acquisition: date, terms, $33M funding | TechCrunch | SUPPORTED |
| spartan | Screenpipe repo vs marketing conflict | github.com/mediar-ai/screenpipe | SUPPORTED |
| spartan | Mem0 self-reported benchmark scores | mem0.ai blog | SUPPORTED |

Citation hygiene: baseline 5/6 clean (one misattribution between co-cited sources); spartan 4/6 clean (one secondary figure attributed to a primary, one tier-name error its own source contradicts). Consistent with the judges' citation verdict.

## Cost

Near-identical: baseline 90,493 tokens / 9m29s; spartan 93,315 tokens / 8m32s. The hypothesis's "meaningfully higher cost" clause is falsified at this scale — whatever quality differences exist came essentially free.

## Human verdict

**Owner (2026-07-18): prefers the Spartan result overall** — disagreeing with both judge passes' "slightly A".

> Overall I found spartan's output easier to understand. I like the "what I didn't find" section, and open questions; I thought the citations were done better. I liked the bit tailored to me in both, but the baseline's explanation of why some things should be skipped was important. I liked the analysis section and the general flow of spartan's output. All up I prefer the spartan result.

Owner's per-dimension notes, kept as criteria for the future own-research-agent effort:

- **Coverage**: keep A's repository extras (stars, dormancy); open-source/self-hosting vs hosted detail is always important to the owner.
- **Depth of synthesis**: prefer breadth of data *and* analysis; strongly values the agent being self-critical of its own results and unbiased toward its own family of tools/vendors.
- **Instruction-following / actionability**: follow instructions and give "why" rationale — but also make reasonable expansions from interpreted intent, with safety so things aren't lost.
- **Readability**: the longer, more detailed approach — but always with a TL;DR.
- **Citation quality**: everything sourced; owner sources preferred, secondary sources labelled as such, vendor/bias reporting flagged.
