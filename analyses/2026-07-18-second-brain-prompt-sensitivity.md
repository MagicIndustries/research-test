# Prompt sensitivity: second-brain vs second-brain-original

Cross-experiment analysis for [Re-run second-brain with the original prompt and analyze prompt sensitivity](https://github.com/MagicIndustries/research-test/issues/15). Same two variants (`research--fable--cc`, `spartan-deep-research--fable--cc`), same model, same harness, same day and retrieval window — the only variable is the prompt. Written by the harness orchestrator (claude-fable-5), not a blind judge; the per-experiment blind comparisons are the inputs.

## The two prompts

- **[second-brain](../experiments/second-brain/PROMPT.md)** (drafted fresh, "question-first"): names analytical asks — method families, *evidence of maturity*, trade-offs on four named axes, convergence — plus a **named audience** (solo dev, Claude Code, Obsidian) and an **explicit citation rule** ("cite a primary source for every load-bearing claim"). Single implied deliverable.
- **[second-brain-original](../experiments/second-brain-original/PROMPT.md)** (the owner's original, "structure-first"): names the *deliverable* — resource sets per method (github/code/articles/tutorials/videos), documentation per method, a detailed summary, subdirectories — with the aim of comprehensiveness and trialability. No audience. No citation rule ("research, links" only). Explicit file layout.

## Outcomes side by side

| | second-brain (question-first) | second-brain-original (structure-first) |
|---|---|---|
| baseline output | 3,170 words, 1 file | 11,761 words, 17 files |
| spartan output | 4,034 words, 1 file | 9,013 words, 16 files |
| baseline cost | 90,493 tok / 9m29s | 95,903 tok / 12m11s |
| spartan cost | 93,315 tok / 8m32s | 98,079 tok / 11m8s |
| judges overall | slightly baseline (both passes) | slightly baseline (both passes) |
| synthesis dimension | spartan, both passes | spartan, both passes |
| citation dimension | baseline, both passes | **spartan**, both passes |
| inter-pass agreement | directions ✓, 3 magnitude gaps | exact, all five dimensions |
| spot-check | 9/12 SUPPORTED, 3 PARTIAL, 0 UNSUPPORTED | 8/11 SUPPORTED, 2 PARTIAL, **1 UNSUPPORTED** (baseline) |
| human verdict | spartan preferred | (pending) |

## Findings — what the prompt caused

1. **Volume is a prompt variable, not a skill variable.** The structure-first prompt produced ~3× the words and ~17× the files for ~5% more tokens and ~25% more wall time. Skill choice never moved word count more than ~30%; the prompt moved it ~200%. Deliverable-shape instructions are close to free leverage on output size — the tokens went into breadth instead of per-claim depth.

2. **The prompt inverted the length relationship between skills.** Question-first: spartan wrote more (its report structure adds Analysis/Open Questions sections the prompt didn't request). Structure-first: baseline wrote more (the minimal skill expands to fill whatever structure is requested), while spartan's fixed report discipline acted as a *compressor*. A skill with strong output opinions resists prompt-induced sprawl; a thin skill amplifies it.

3. **Skill fingerprints survive prompt changes — process beats phrasing.** Across both prompts, in all four judge passes: spartan wins depth of synthesis (verification, self-criticism, open questions), baseline wins literal instruction-following. Spartan's analysis sections appeared even when nothing in the prompt asked for analysis, because its *skill* demands them. What a skill's process mandates gets done regardless of the prompt; what neither mandates (audience tailoring, below) silently disappears.

4. **Dropping the explicit citation rule degraded factual hygiene — asymmetrically.** With the rule (question-first): 0 unsupported claims in 12, and the *baseline* had the stricter sourcing (its one blemish an attribution slip). Without it: the baseline shipped a stale star count off by 20k plus a figure twice attributed to a source that doesn't contain it (1 UNSUPPORTED, 1 PARTIAL), and *lost* the citation dimension it had won — while spartan degraded only mildly (an unverifiable virality number), because verification lives in its skill, not the prompt. **Prompt-level citation demands mostly protect the skill that lacks a verification step.**

5. **No audience, no tailoring.** The question-first prompt's named audience produced the tailored recommendations and reasoned skip-list the owner explicitly valued in their human verdict. The original prompt names no audience and neither variant invented one — generic "choose your path" guides appeared instead. Wanted tailoring must be asked for; no skill supplied it unprompted.

6. **Bigger, more-structured artifacts judged more stably.** Question-first comparison: three magnitude disagreements between passes. Structure-first: perfect agreement on all five dimensions and magnitudes. Multi-file deliverables with self-announcing structure appear to give judges more anchor points; single essays leave more room for order effects.

## Hypothesis scorecard (from second-brain-original's PROMPT.md)

- Broader resource collection, more files: **confirmed.**
- No audience tailoring: **confirmed.**
- Coverage-as-breadth higher: **confirmed** (~120 curated links per tree).
- Weaker critical synthesis from both: **partial** — baseline yes; spartan's skill injected analysis anyway (finding 3).
- Smaller gap between skills: **wrong** — the dimensional gap persisted and citation *widened* (finding 4).
- Citation quality flatter: **wrong** — it diverged, in the opposite direction from the sibling experiment.

## Implication for the "ideal" prompt

The two prompts' strengths are complementary, mapping directly onto the owner's stated preferences: take the question-first prompt's analytical asks, named audience, and explicit citation rule, and add the structure-first prompt's deliverable spec (per-method subdirectories, resource files, getting-started paths, TL;DR-topped summary). Volume is cheap (finding 1); hygiene and tailoring are not (findings 4–5) — spend prompt words on the latter. A candidate merged prompt belongs in the meta-study experiment ([Design and fire the meta-study experiment](https://github.com/MagicIndustries/research-test/issues/7)).
