# Research harness conventions

The single source of truth for how research experiments are filed, run, and compared in this repo. The `run-experiment`, `file-run`, and `compare-runs` skills implement these conventions; edits here change their behaviour. Decided in [Spec the filing conventions](https://github.com/MagicIndustries/research-test/issues/2), informed by [the landscape survey](https://github.com/MagicIndustries/research-test/issues/3).

## Vocabulary

- **Experiment** — one prompt/area of interest, compared across variants. Lives at `experiments/<topic>/`.
- **Run** — one execution of one variant against the experiment's canonical prompt.
- **Variant** — a skill-stack + model + harness + settings combination.
- **Comparison** — a blind-judged evaluation across runs of one experiment.

## Layout

```
experiments/<topic>/
  PROMPT.md                      ← canonical prompt, hypothesis, rubric, variant matrix
  OBSERVATIONS.md                ← dated log, appended by every session (see below)
  runs/<variant>/
    RUN.md                       ← provenance (schema below)
    skill-snapshot/              ← byte-copies of every skill definition the run used
    output/                      ← the run's output, untouched
  comparisons/
    YYYY-MM-DD-<slug>.md
```

## Observations log

Every session that touches an experiment **appends** a dated entry to its `OBSERVATIONS.md`: anomalies, friction, hypothesis drift, cost surprises, judge quirks — anything noticed that the structured files don't capture. Entries are never rewritten, only appended. This log is the raw material the self-improvement loop will eventually mine; an unrecorded observation is lost to it.

## Variant naming grammar

`<skill-stack>--<model>--<harness>` — skill stacks joined with `+`, a settings suffix appended only when non-default. Dates and re-run numbering never appear in directory names; they live in RUN.md.

Examples: `research--fable--cc`, `deep-research+content-engine--opus--cc`, `research--gpt5--codex`, `research--fable--cc--no-web`.

Model tokens are short names (`fable`, `opus`, `sonnet`, `gpt5`, `gemini`); the full model id belongs in RUN.md frontmatter. Harness tokens: `cc` (Claude Code), `codex`, `gemini-cli`, `api`, `manual`.

## Skill stacks and writing skills

A stack (`+`-joined) executes in listed order in one run: upstream stages (research) produce material, downstream stages (writing/document skills) shape the deliverable — e.g. `spartan-deep-research+article-writing--fable--cc`.

- **Every stage** gets its definition snapshotted in `skill-snapshot/`.
- A multi-stage run captures **`intermediate/<n>-<stage>/`** — the output each stage handed to the next — beside the final `output/`. The writing stage's delta is only judgeable if the pre-writing state survives.
- **To compare writing skills**: hold the research stage constant and vary the writing stage (`research+A` vs `research+B` vs bare `research`). Such experiments should override the rubric to weight readability/navigation and instruction-following higher, and add a **stage-fidelity spot-check**: sample ≥5 claims from the final output and verify each exists in the intermediate — a writing stage must shape, never invent.

## Industry skills (vendoring)

Third-party skills are run from an in-repo vendored copy so runs are reproducible and snapshotable:

- Location `.claude/skills/<source>-<name>/` (e.g. `spartan-deep-research`), contents byte-unmodified from upstream, plus a `PROVENANCE.md`: source package/repo, version, date vendored, upstream path or URL.
- The variant's skill token is the vendored name.
- A vendored skill is never edited — an improvement idea becomes one of our own skills and enters as a new variant.

## Skill roster

Research skills (each tested individually):

| Token | Source | Note |
|---|---|---|
| `research` | Matt Pocock engineering set (in-repo) | The minimal baseline/control |
| `spartan-deep-research` | Spartan package v1.27.0 | Single-prompt deep research |
| `daymade-deep-research` | daymade/claude-code-skills @1bdc908 | Lead-agent + parallel subagents, evidence mapping |
| `bio199-deep-research` | 199-biotechnologies @f2f2c0f | 8-phase pipeline with validation scripts; no published license — local testing only |
| `weizhena-deep-research` | Weizhena/Deep-Research-skills @e5479f8 | Whole-repo snapshot: five-skill HITL family + web-search agent; needs per-run wiring before first use |

Writing-stage skills (for stacks):

| Token | Source | Note |
|---|---|---|
| `spartan-article-writing` | Spartan package v1.27.0 | Long-form articles/guides |
| `pocock-writing-fragments` | mattpocock/skills @9603c1c | Explore: mine raw fragments |
| `pocock-writing-beats` | mattpocock/skills @9603c1c | Exploit: assemble beats |
| `pocock-writing-shape` | mattpocock/skills @9603c1c | Exploit: shape into an article |
| `pocock-edit-article` | mattpocock/skills @9603c1c | Revise/tighten an existing draft |

## RUN.md schema

YAML frontmatter + two prose sections. Every field present; unknowns recorded as `unknown`, never omitted.

```markdown
---
experiment: <topic>
variant: <variant directory name>
skills:
  - { name: <skill>, sha: <git sha of the definition used, or lost> }
model: <full model id, e.g. claude-fable-5>
provider: <anthropic | openai | google | ...>
harness: <claude-code | codex-cli | gemini-cli | api | manual>
date: <YYYY-MM-DD run start>
duration: <wall clock, or unknown>
tokens: <total, or unknown>
cost: <currency amount, or unknown>
settings: { }                    # non-defaults only (thinking level, search mode, ...)
status: <running | complete | abandoned>
---

## Prompt as issued

<verbatim, even when identical to PROMPT.md — this is the audit copy>

## Deviations & notes

<anything that differed from the canonical prompt or conventions; retrieval-time caveats; for retrofits, how provenance was reconstructed>
```

`skill-snapshot/` holds byte-copies of each skill's SKILL.md and supporting files as used by the run. A definition that can't be recovered (external product, deleted skill) is recorded in `Deviations & notes` as **skill definition lost** — the reason this rule exists.

Runs of one experiment should happen in the same time window where feasible, and RUN.md's `date` doubles as the retrieval timestamp: later re-runs are judged against a moved web, and the comparison must say so.

## PROMPT.md template

```markdown
# <Experiment title>

## Prompt

<canonical prompt, verbatim — runs copy this exactly>

## Hypothesis

<what this experiment expects to learn>

## Rubric

<default rubric (below) applies unless this section overrides dimensions or weights>

## Variant matrix

| Variant | Status | Run |
|---|---|---|
| research--fable--cc | complete | [RUN.md](runs/research--fable--cc/RUN.md) |
| deep-research--fable--cc | planned | — |

## Status

<free-form log: what has run, what's next>
```

## Default rubric

RACE-style **relative** scoring — runs are scored against each other, not absolutely — on five dimensions: **coverage**, **depth of synthesis**, **instruction-following / actionability**, **readability / navigation**, **citation quality**. Plus a FACT-style **citation spot-check**: sample ≥5 claim–source pairs per report and verify the cited source actually supports the claim. Experiments may override dimensions or weights in PROMPT.md; the default is the cross-experiment baseline.

## Judge protocol (v1)

1. **Blind pack**: copy each run's output to neutral labels (`report-A`, `report-B`, …) with label assignment randomized; strip identity markers and normalize superficial format (harness-specific headers/footers, markdown flavor) — style tells de-blind a judge. Keep the label→variant key out of the judge's context.
2. **Two passes, order-swapped**: the judge scores twice with presentation order reversed, each pass a fresh agent with no memory of the other. Judge **end-state, not process** — different research paths are legitimate.
3. **Aggregate**: disagreements between passes are flagged in the comparison, never silently averaged.
4. **Record the judge**: model id always; while the judge shares a provider with any run under comparison, note the self-preference caveat inline. Verbosity bias: report each output's length beside its scores. (v2, tracked in [Require a cross-provider judge](https://github.com/MagicIndustries/research-test/issues/10): a judge from a provider that produced none of the runs becomes required.)

## Comparison file template

`comparisons/YYYY-MM-DD-<slug>.md`:

```markdown
# <Experiment>: <runs compared>

Judge: <model id> | Protocol: v1 order-swapped blind | Key: report-A = <variant>, ...
Caveats: <self-preference/verbosity notes; retrieval-window gaps>

## Scores

| Dimension | report-A | report-B | Pass agreement |
|---|---|---|---|

## Judge rationale

<per dimension, with pass disagreements flagged>

## Citation spot-check

| Report | Claim | Source | Verdict |
|---|---|---|---|

## Human verdict

<appended by the owner — the judge never fills this in>
```

## Git workflow

Branch + PR per unit, one squash-merge each; skills never commit to main.

- Runs: `run/<experiment>--<variant>`
- Comparisons: `compare/<experiment>`
- A re-run of an existing variant: stop and ask — re-run versioning is deliberately undecided ([map](https://github.com/MagicIndustries/research-test/issues/1), Not yet specified).
