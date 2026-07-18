# Second-brain-original: research--fable--cc vs spartan-deep-research--fable--cc

Judge: claude-fable-5 | Protocol: v1 order-swapped blind | Key: report-A = research--fable--cc (11,761 words / 17 files), report-B = spartan-deep-research--fable--cc (9,013 words / 16 files)
Caveats: judge shares provider and model with both runs — self-preference noted per protocol; A is ~30% longer and judges were warned against volume; runs same-day, same retrieval window.

## Scores

| Dimension | Pass 1 (A-first) | Pass 2 (B-first) | Agreement |
|---|---|---|---|
| Coverage | slightly A | slightly A | ✓ exact |
| Depth of synthesis | slightly B | slightly B | ✓ exact |
| Instruction-following / actionability | slightly A | slightly A | ✓ exact |
| Readability / navigation | tie | tie | ✓ exact |
| Citation quality | slightly B | slightly B | ✓ exact |
| **Overall** | **slightly A** | **slightly A** | ✓ exact |

Perfect inter-pass agreement — all five dimensions *and* magnitudes identical across both presentation orders (the sibling experiment's comparison had three magnitude gaps).

## Judge rationale

- **Coverage** (slightly A): A covers a whole family B omits — publishing wikis/digital gardens (Quartz, Obsidian Publish, Wiki.js, MediaWiki), squarely inside the prompt's explicit "wikis" ask — plus Cognee, Open WebUI, and a methodologies directory. B counters with denser per-method resource lists (LightRAG, AppFlowy/AFFiNE/SiYuan, Dendron/Foam, multiple MCP servers, a notebooks curriculum) but its missing publishing layer is the larger gap.
- **Depth of synthesis** (slightly B): B's overview does the analytical work — compilation-vs-retrieval as the central divide, Reor's archival read as a market signal, a criticisms section (model collapse, cognitive offloading), explicit open questions. A is thorough but descriptive; conflicts surface as per-method bullets, not cross-cutting analysis.
- **Instruction-following** (slightly A): A maps the requested deliverable shape almost literally — concept → variations → per-method → per-option tables, plus a standalone getting-started with a decision guide, profile stacks, six weekend trial paths, and anti-patterns. B's equivalents exist but distributed.
- **Readability** (tie): near-identical structures, both cleanly navigable.
- **Citation quality** (slightly B): B stamps verification status per claim ("verified 2026-07-18" vs *reported*), flags vendor benchmarks and content-marketing sources; A cites densely but without verification labeling.

## Citation spot-check

11 live fetches, 2026-07-18: **8 SUPPORTED, 2 PARTIAL, 1 UNSUPPORTED, 0 dead links.**

| Report | Claim/link (short) | Cited source | Verdict |
|---|---|---|---|
| baseline | Karpathy gist: date, layers, operations | karpathy gist | SUPPORTED |
| baseline | Khoj stars/license/clients | github khoj-ai/khoj | SUPPORTED |
| baseline | GraphRAG MIT/stars/v3.1.1 | github microsoft/graphrag | SUPPORTED |
| baseline | mem0 "~41k stars" + AWS claim | github mem0ai/mem0 | **UNSUPPORTED** — live count 61.1k; AWS claim not on cited page |
| baseline | LLBBL post as source of 100-article/400k-word figure | llbbl.blog | PARTIAL — figure not in that source (it's in askglitch.com); misattributed twice |
| baseline | Professor Glitch build guide link | askglitch.com | SUPPORTED |
| spartan | Gist "April 3" + "~16M views on X" | gist + codersera | PARTIAL — date confirmed via X post (gist itself 04-04); views figure absent from cited source |
| spartan | AnythingLLM stars/MIT/MCP | github Mintplex-Labs/anything-llm | SUPPORTED |
| spartan | mem0 61.1k/Apache-2.0/LoCoMo 92.5/ADD-only | github mem0ai/mem0 | SUPPORTED |
| spartan | Reor archived 2026-03-07, read-only | github reorproject/reor | SUPPORTED |
| spartan | obsidian-second-brain v0.12, 44 commands + notebooks repo links | github | SUPPORTED (both) |

The trees' one direct factual conflict (mem0 stars) resolves in spartan's favor — every count spartan stamped "verified" checked out exactly. Consistent with the judges' citation verdict.

## Cost

baseline 95,903 tokens / 12m11s; spartan 98,079 tokens / 11m8s — again near-identical.

## Human verdict

**Owner (2026-07-18)**: **prefers Spartan overall** (clarified in a follow-up — consistent with the sibling comparison's verdict); values the way Spartan presents summaries; liked the baseline's getting-started material. Rather than a single winner, the owner distilled standing requirements from both experiments — citations, analysis, TL;DR-topped summaries, deep dives, audience tailoring, per-alternative getting-going guides plus an owner-tailored steps guide, tabular analysis, multiple READMEs, early term definitions with background/history, downloaded resource copies — now codified as [docs/agents/research-preferences.md](../../../docs/agents/research-preferences.md), to modify future experiments, tailor prompts, and shape the ultimate research agent.
