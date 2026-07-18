# Agentic research (the meta-study)

The map's meta-study ([Design and fire the meta-study experiment](https://github.com/MagicIndustries/research-test/issues/7)): researching research itself, with the harness's own future improvement as the consumer of the findings. The canonical prompt is the "merged ideal" from the [prompt-sensitivity analysis](../../analyses/2026-07-18-second-brain-prompt-sensitivity.md) — question-first analytical asks + named audience + citation rules + structure spec — encoding [the owner's preferences](../../docs/agents/research-preferences.md) as the conventions require.

## Prompt

Research the current state of the art in agentic deep research — the methods, skills, prompts, and tools that make LLM agents produce excellent research reports. Define the key terms early (deep research, research agent, orchestrator–worker, LLM-as-judge) and give the background: where automated deep research came from and how it has developed. Map the major approaches — single-prompt research skills, orchestrated multi-agent pipelines, commercial deep-research products (OpenAI, Google, Perplexity), and open-source research frameworks — and for each: how it works, evidence of maturity and activity, trade-offs (quality, cost, transparency, open-source vs hosted), and a getting-going guide. Include an analysis of what methodological ingredients the best systems share, what the evaluation literature says about judging research quality, and what you could not find. Conclude with a recommended-steps guide tailored to a solo developer who works in Claude Code daily and runs a skill-comparison harness in a git repo, aiming to assemble the best research capability from existing parts. Start the main summary with a TL;DR. Cite a primary source for every load-bearing claim; label secondary sources as such; flag vendor self-reporting. Deliver as markdown files: a top-level README index, the main summary, and one subdirectory per approach holding its documentation and an annotated resources file (repos, papers, articles, videos).

## Hypothesis

Dimension predictions (per the harness's learnings so far): (1) daymade's orchestrated pipeline wins depth of synthesis and methodology coverage over the single-prompt skills; (2) the model contrast (spartan on sonnet vs fable) moves citation/verification quality more than structure or coverage; (3) all variants produce TL;DRs, early definitions, and owner tailoring because the prompt now demands them — the qualities that silently vanished in second-brain-original should not vanish here; (4) token cost stays within ±20% across skills (cost differences track model, not skill).

## Rubric

Default rubric. Weighting note for the human verdict: the owner weights depth of synthesis and self-criticism highest (see research-preferences.md); judges still report all dimensions plus overall per protocol.

## Variant matrix

| Variant | Status | Run |
|---|---|---|
| research--fable--cc | running | — |
| spartan-deep-research--fable--cc | running | — |
| daymade-deep-research--fable--cc | running | — |
| spartan-deep-research--sonnet--cc | complete | [RUN.md](runs/spartan-deep-research--sonnet--cc/RUN.md) |
| bio199-deep-research--fable--cc | later (needs Python setup) | — |
| weizhena-deep-research--fable--cc | later (needs wiring) | — |

## Status

Charted 2026-07-18; four launch runs fired in parallel, same retrieval window.
