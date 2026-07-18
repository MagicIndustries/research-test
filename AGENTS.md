# research-test

## Agent skills

### Issue tracker

Issues are tracked in GitHub Issues for `MagicIndustries/research-test`, via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Default vocabulary — the five canonical triage labels, used as-is. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context — one `CONTEXT.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.

### Research harness

This repo compares research skills/models as filed experiments under `experiments/`. Conventions (layout, RUN.md provenance, rubric, judge protocol, git flow): `docs/agents/research-harness.md`. Skills: `run-experiment` (execute + file a variant run), `file-run` (retrofit an outside run), `compare-runs` (blind-judged comparison).
