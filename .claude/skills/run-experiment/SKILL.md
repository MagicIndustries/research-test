---
name: run-experiment
description: Execute one variant run of a research experiment and file it with full provenance. Use when the user wants to run an experiment variant, start a filed research run, or add a run to an experiment under experiments/.
---

Execute one **run** of one **variant** against an experiment's canonical prompt, filed per [`docs/agents/research-harness.md`](../../../docs/agents/research-harness.md) — read it first; it owns the layout, variant grammar, RUN.md schema, and git workflow this skill applies.

## Steps

1. **Resolve the experiment.** Locate `experiments/<topic>/PROMPT.md`. If it doesn't exist, draft it from the conventions template with the user — the canonical prompt is theirs to confirm — and only proceed once it exists. Done when: PROMPT.md exists and you have its Prompt section verbatim.
2. **Derive the variant name** from the grammar (skill stack, model, harness, settings suffix only when non-default). If `runs/<variant>/` already exists, this is a re-run: append the `--r<N>` suffix per the grammar (next unused N) and record what changed in RUN.md's Deviations. Done when: the variant directory name is fixed and unoccupied.
3. **Open the run branch** `run/<experiment>--<variant>` from up-to-date main.
4. **File provenance before executing**: create `runs/<variant>/RUN.md` (schema in conventions; `status: running`; prompt copied verbatim into "Prompt as issued") and `skill-snapshot/` with byte-copies of every skill definition in the stack. Done when: every frontmatter field is present (`unknown` where unavoidable) and every skill in the stack has its files snapshotted or is recorded as **skill definition lost**.
5. **Execute the stack** against the canonical prompt exactly as written — no edits, no additions. **One variant per session** (per conventions): this session runs only this variant — never launch sibling variants as subagents alongside it; the session-wide WebSearch quota is this run's alone, and quota exhaustion mid-run goes in Deviations. Direct output into `runs/<variant>/output/`; if the stack wrote elsewhere, move the files unmodified. Done when: `output/` holds the run's complete output, byte-identical to what the stack produced.
6. **Finalize**: update RUN.md (`status: complete`, duration/tokens/cost as capturable, deviations noted), add the variant's row to PROMPT.md's matrix, and append a dated entry to the experiment's `OBSERVATIONS.md` — anything noticed that the structured files don't capture. Commit, push, open a PR titled `run(<experiment>): <variant>`. Done when: the PR is open and its diff contains only this run's files, the matrix row, and the observations entry.
