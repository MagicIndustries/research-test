# Second brain — original prompt

Sibling of [second-brain](../second-brain/PROMPT.md), created for [Re-run second-brain with the original prompt and analyze prompt sensitivity](https://github.com/MagicIndustries/research-test/issues/15): the owner's original pre-harness prompt, re-run under the harness with the same variants so the two experiments differ only in prompt. Deliverable includes a cross-experiment prompt-sensitivity analysis.

## Prompt

do a deep dive on second brain creation using llms, knowledge graphs, wikis etc. Find out the most current and most popular techniques, create a set of resources for each including github links, code, articles, tutorials, video links etc. Create documentation for each and create a detailed summary that goes over the concept and its variations in depth then summarizes the main details of each alternative methods, then summarizes each alternative option (git repos, tools, etc). The aim is to have a comprehensive overview of all current methods and options for getting started, a deep understanding of how to build a second brain in the variuous ways, and all the research, links, instructions and such that I  would need to follow up and trial any of the options. create everything in markdown files in the subdirectory secondBrain and collect resources for different methods under their own subdirectories within secondBrain

## Hypothesis

The original prompt specifies deliverable *structure* (files, subdirectories, resource collections) where the harness prompt specified analytical *questions* (trade-offs, convergence, tailored recommendations). Expect: broader resource collection and more files from both variants; weaker critical synthesis (nothing asks for it); no audience tailoring (no audience is named); and a smaller gap between the two skills, since filing instructions dominate over method. Dimension predictions: citation quality flatter, synthesis lower for both, coverage-as-breadth higher.

## Rubric

Default rubric (docs/agents/research-harness.md), no overrides. Note for judges: the prompt's explicit asks differ from the sibling experiment — instruction-following is judged against *this* prompt (structure, resources, per-method subdirectories), not the sibling's.

## Variant matrix

| Variant | Status | Run |
|---|---|---|
| research--fable--cc | complete | [RUN.md](runs/research--fable--cc/RUN.md) |
| spartan-deep-research--fable--cc | planned | — |

## Status

Charted 2026-07-18; both runs firing same-day (also same-day as the sibling experiment's runs — cross-experiment comparison shares the retrieval window).
