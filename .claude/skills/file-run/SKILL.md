---
name: file-run
description: Retrofit a research run produced outside this repo's wrapper — another harness, CLI, API, or a historical output — into an experiment with reconstructed provenance. Use when the user has research output to file, import, or retrofit into experiments/.
---

File a **run** this repo didn't execute — output from another harness (Codex CLI, Gemini CLI, an API script, a product UI) or a historical run — per [`docs/agents/research-harness.md`](../../../docs/agents/research-harness.md); read it first. The output is evidence: it enters `output/` byte-identical, and provenance wraps around it.

## Steps

1. **Gather provenance from the user**: which experiment; where the output lives; the exact prompt as sent; skill/product, model, harness, provider, settings; date; any usage/cost record (Codex JSONL, Gemini CLI JSON stats, API usage objects all count). Done when: every RUN.md frontmatter field has a value or an honest `unknown`.
2. **Resolve experiment and variant** as in the conventions (create PROMPT.md with the user if the experiment is new; stop and ask if `runs/<variant>/` exists).
3. **File it** on branch `run/<experiment>--<variant>`: RUN.md with the reconstruction described under "Deviations & notes", `skill-snapshot/` holding whatever definition is recoverable — or **skill definition lost** recorded when none is — and the output copied into `output/`. Done when: the copy is verified byte-identical (checksum against the source).
4. **Finalize**: matrix row in PROMPT.md, commit, push, PR titled `run(<experiment>): <variant> (retrofit)`. Done when: the PR is open and its diff contains only this run's files plus the matrix row.
