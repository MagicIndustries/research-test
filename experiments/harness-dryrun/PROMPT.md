# Harness dry-run

Throwaway experiment validating the run-experiment, file-run, and compare-runs skills ([Build the harness skills](https://github.com/MagicIndustries/research-test/issues/4)). Deleted once the dry-run passes; not real research.

## Prompt

What is the current Node.js LTS release line, and what is its scheduled end-of-life date? Answer in at most two short paragraphs, citing the official Node.js release schedule as the source.

## Hypothesis

None — this experiment exists to prove the harness mechanics file runs and comparisons correctly.

## Rubric

Default rubric (docs/agents/research-harness.md), citation spot-check reduced to the claims available in these deliberately tiny outputs.

## Variant matrix

| Variant | Status | Run |
|---|---|---|
| research--fable--cc | complete | [RUN.md](runs/research--fable--cc/RUN.md) |
| freeform--fable--manual | complete | [RUN.md](runs/freeform--fable--manual/RUN.md) |

## Status

Both runs complete; compared in [2026-07-18-research-vs-freeform](comparisons/2026-07-18-research-vs-freeform.md). Dry-run passed — experiment slated for deletion.
