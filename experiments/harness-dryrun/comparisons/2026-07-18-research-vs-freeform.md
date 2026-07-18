# Harness dry-run: research--fable--cc vs freeform--fable--manual

Judge: claude-fable-5 | Protocol: v1 order-swapped blind | Key: report-A = freeform--fable--manual (82 words), report-B = research--fable--cc (84 words)
Caveats: judge shares a provider (and here, a model) with both runs — self-preference bias cannot differentiate them but is noted per protocol; lengths near-identical, so verbosity bias moot; both runs same-day, no retrieval-window gap.

## Scores

| Dimension | report-A | report-B | Pass agreement |
|---|---|---|---|
| Coverage | — | strongly B | ✓ both passes |
| Depth of synthesis | — | slightly B | ✓ both passes |
| Instruction-following / actionability | — | strongly B | ✓ both passes |
| Readability / navigation | tie | tie | ✓ both passes |
| Citation quality | — | strongly B | ✓ both passes |

## Judge rationale

Both passes, independently and in both presentation orders, reached identical verdicts — no position effects observed.

- **Coverage** (strongly B): B gives exact Active LTS start / Maintenance transition / EOL dates, the "Krypton" codename, and the adjacent v22 Maintenance and v26 Current lines; A gives the headline line with month-level dates only.
- **Depth of synthesis** (slightly B): B synthesizes two official sources into the full release ladder; A's policy context (12 months Active, 30 months total) explains *why* the EOL lands where it does, partially offsetting thinner facts.
- **Instruction-following / actionability** (strongly B): A concedes its dates were "written from working knowledge without re-fetching the schedule", pushing verification onto the reader; B answers definitively as asked.
- **Readability** (tie): two clean paragraphs each; nothing to navigate at this length.
- **Citation quality** (strongly B): B ties claims to the schedule repo, schedule.json, and the previous-releases page; A's single repo citation is nominal since the source wasn't consulted.

## Citation spot-check

Verified 2026-07-18 against `https://raw.githubusercontent.com/nodejs/Release/main/schedule.json`.

| Report | Claim | Source | Verdict |
|---|---|---|---|
| B (research) | v24 entered Active LTS 2025-10-28 | schedule.json | ✓ supported |
| B (research) | v24 → Maintenance 2026-10-20 | schedule.json | ✓ supported |
| B (research) | v24 EOL 2028-04-30 | schedule.json | ✓ supported |
| B (research) | v22 in Maintenance, EOL 2027-04-30 | schedule.json | ✓ supported |
| B (research) | v26 is Current (non-LTS) | schedule.json (v26 LTS starts 2026-10-28) | ✓ supported |
| A (freeform) | Node 24 entered Active LTS late Oct 2025 | schedule.json (2025-10-28) | ✓ supported |
| A (freeform) | EOL April 2028 | schedule.json (2028-04-30) | ✓ supported |
| A (freeform) | LTS lines end 30 months after LTS start | schedule.json (v24: 2025-10-28 → 2028-04-30) | ✓ supported |

All dated claims in both reports verify — the freeform run's self-flagged "unverified" dates happened to be correct; its citation-quality penalty stands because correctness was luck, not sourcing.

## Human verdict

<appended by the owner — the judge never fills this in>
