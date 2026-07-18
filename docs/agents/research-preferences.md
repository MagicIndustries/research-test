# Owner research preferences

The owner's standing preferences for research output, distilled from their human verdicts on the first two experiments (2026-07-18). **Operative, not archival**: every session drafting an experiment PROMPT.md, briefing a run, judging a comparison, or designing the ultimate research agent applies these. Canonical prompts should *encode* them; rubric weighting should reflect them; deviations are experiment variables to be declared, not accidents.

## Always, for every research request and experiment

- **Citations**: a primary source for every load-bearing claim; owner sources preferred; secondary sources labelled as such; vendor self-reporting and bias flagged; verification status stamped (verified-on-date vs reported).
- **Analysis**: a genuine analysis section — patterns, conflicts between sources, engaged dissent against the output's own recommendation, and an explicit "what I couldn't find" / open-questions treatment. Self-critical, never biased toward any vendor or tool family.
- **Summaries**: Spartan-style presentation preferred — TL;DR up front, then depth. Detail is welcome (longer is fine) but always behind a TL;DR.
- **Concept grounding**: break the concept down and define terms *early*; include background/history — where a term, concept, or body of research originated and how it developed.
- **Structure**: tabular analysis for comparisons; multiple READMEs/intros for multi-file deliverables; per-method subdirectories when collecting resources.
- **Formatting mechanics** (from the agentic-research verdicts, 2026-07-18): prose broken into real paragraphs — a wall of unbroken text fails the owner regardless of content quality; citation and reference lists formatted **one entry per line**, never packed inline into a paragraph; links woven into the flow of the text preferred over numeric `[n]` registries that force reference-hopping; depth is welcome only when the navigation (flow, links, paragraphing) carries the reader through it.
- **Formatting binds on *rendered* markdown, not source text** (writing-stage verdict, 2026-07-18): consecutive source lines without bullets or blank lines render as one paragraph wall — which is how a "one per line" reference list still failed the owner. Reference lists are **bullet lists** (or blank-line separated); any formatting rule is judged by what the reader sees rendered.

## For "how do I do X" research specifically

- **Always include examples**: a getting-going guide for *each* presented alternative, plus a recommended-steps guide tailored to the owner.
- **Getting-started material** in the baseline style: decision guides, profile-based recommendations, concrete trial paths, anti-patterns.

## Audience

- **Default audience is the owner**: solo developer, works in Claude Code daily, notes in Obsidian; open-source/self-hosting vs hosted detail always matters to them.
- The ultimate research skill must support **optionally producing a whole version or a summary aimed at a different specified audience** — tailoring is a parameter, defaulting to the owner.

## Resources

- Prefer **downloaded copies of available resources** (papers, key documents) captured alongside links, so the deliverable is usable offline and survives link rot. (Implementation convention TBD — likely `resources/` beside `output/`; design belongs to the meta-study / ultimate-agent work.)

## Provenance of these preferences

- First verdict: [second-brain comparison](../../experiments/second-brain/comparisons/2026-07-18-research-vs-spartan-deep-research.md) (Human verdict section).
- Second verdict: [second-brain-original comparison](../../experiments/second-brain-original/comparisons/2026-07-18-research-vs-spartan-deep-research.md) (Human verdict section).
- Third verdict: [agentic-research four-way comparison](../../experiments/agentic-research/comparisons/2026-07-18-four-way-launch.md) (Human verdict section) — source of the formatting-mechanics preference; depth explicitly valued but presentation decisive.
- Supporting evidence for *why* these must be prompt/skill-encoded: [prompt-sensitivity analysis](../../analyses/2026-07-18-second-brain-prompt-sensitivity.md) — unrequested qualities silently disappear (audience tailoring), and prompt-level rules protect skills lacking built-in process (citations).
