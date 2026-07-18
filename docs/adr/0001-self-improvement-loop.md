# The self-improvement loop: propose-only, preferences-anchored, harness-validated

Status: accepted 2026-07-18 · Charter for the follow-on map that builds the automated loop ([Design the self-improvement loop on paper](https://github.com/MagicIndustries/research-test/issues/8)); the manual precedent it formalizes is the 2026-07-18 verdict→preferences-codification cycle.

**Decision.** The harness improves through an event-driven loop with five fixed properties:

1. **Trigger — after every comparison.** Once a comparison's human verdict lands, the comparing session runs one loop step: append the comparison to the ledger, mine ledger + observations, then either propose changes or record "no change warranted". No daemon, no schedule.
2. **Authority — propose-only.** The loop appends data freely (`analyses/LEDGER.md`, OBSERVATIONS.md) but every behavioral change — prompt templates, rubric weights, skill defaults, `research-preferences.md` — lands as a PR the owner merges. The merge is the approval gate; nothing self-modifies.
3. **Yardstick — preferences-anchored.** Improvement = outputs better satisfying `docs/agents/research-preferences.md`, measured by rubric scores on owner-weighted dimensions plus citation spot-check pass rate. Rejected: human-verdict-only (blocks on the owner), external benchmarks (optimize someone else's taste).
4. **Judge audit — disagreement obliges a proposal.** The owner's verdict is always ground truth; judge–human overall agreement is the meta-metric (0/2 at time of writing — judges pick baseline, owner picks Spartan; overall verdicts are kept by owner ruling). Each disagreement obliges the next loop iteration to propose a rubric reweighting, a judge-briefing change, or an argued case that the gap is legitimate taste. The cross-provider judge (#10) supplies the independent second opinion.
5. **Validation — A/B through the harness.** A proposed behavioral change earns adoption only by running as a new variant against the incumbent, blind-compared under the standard protocol, and winning on the yardstick. The harness validates its own improvements.

**Consequences.** Learning is bounded by comparison frequency (acceptable: evidence-paced beats schedule-paced); every adopted change carries experiment evidence; the ledger and the loop-step wiring in `compare-runs` are in scope now as data conventions — the automation that *executes* proposals belongs to the follow-on map.
