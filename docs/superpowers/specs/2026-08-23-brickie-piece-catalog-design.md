# Brickie piece catalog — design

**Status:** proposed. No code written.
**Home:** `emagineer-core`, alongside the existing `catalog*` domain.

A canonical catalog of brickie pieces, the relationships between them, and an
interface for reviewing and validating both.

---

## Why

Everything measured about the brickie corpus so far has been recomputed from
files each time it was needed: silhouette overlap, mirror symmetry, stud
planes, interface contracts, duplicate detection. Those are queries. As files
they are a seven-minute script that gets rewritten for every new question.

And every duplicate problem found in generation was a **missing relationship**:

- `hair_left_swept_back` ↔ `hair_right_swept_back` — a mirror pair, undeclared,
  so the generator produced both mirrors as "new"
- `torso_open_bottom_shirt` ↔ `torso_open_top_shirt` — exact mirrors, and
  **nothing in either name says so**
- `29119` ↔ `29120` — a chiral element pair, inferred by string-matching
  "Left"/"Right", which works 87% of the time
- `3023` ↔ `3023b` — the same element under two filenames

Of 199 mirror candidates, **40 were rejected as duplicates of relationships
that could simply have been looked up.** The generator rediscovers them every
run, using a similarity threshold nobody can fully defend.

---

## Decision: the database is canonical, files become an export

Recommended, with one condition (below). Reasons:

- **Calculations become queries.** A silhouette signature computed once and
  indexed turns O(n²) file parsing into a join. Relationship rules have to run
  across the whole catalog whenever anything changes; that is only tractable
  over rows.
- **Generated pieces get real provenance.** The 10 mirrored parts currently
  exist as files in a directory with their origin encoded in a filename suffix.
- **Edits become atomic and versioned**, which a review workflow requires.

### The condition: a piece is not a list of placements

Measured over the 199 templates: **7,482 placement lines against 12,214
others — 62% of the content is not placements.**

| line kind | count |
|---|---|
| type-1 placements | 7,482 |
| `0 STEP` | **4,418** |
| `0 FILE` / `0 NOFILE` submodel blocks | 975 each |
| `0 Name:` / `0 Author:` | 975 each |
| `0 CustomBrick`, `0 FlexibleBrickControlPointUnitLength`, `0 NumOfBricks:` | ~975 each |

The 4,418 `0 STEP` lines are **build order** — the assembly instructions. A
schema that models placements and drops the rest cannot produce a buildable
output, and would discard author intent invisibly.

This is not hypothetical. The mirror generator does **textual** rewriting
specifically because round-tripping through a model object silently drops
whatever the model does not understand.

### The gate: prove losslessness before flipping canonicality

**Export must reproduce the source for every unmodified piece, across 100% of
the corpus, before the database becomes the source of truth.** Files stay
canonical until that test passes.

This costs nothing and converts an irreversible migration into a reversible
one.

### What the transition stores, and why it is deletable

Two different questions need answering while files are still being edited, and
they need different things:

- **"Has this file changed since we imported it?"** — a checksum of the source,
  per piece. Detects drift between the tree and the catalog. Needed regardless.
- **"Does our export reproduce the original?"** — needs the original itself.

So store both: a checksum, and a write-once `sourceSnapshot` captured at
import. The whole template tree is 717 KB across 199 pieces, mean 3.6 KB, so
storage is not a consideration.

The snapshot lets the round-trip test run **from the database alone** — in CI,
and after the template tree stops being maintained — and lets the review
interface show *how* an export differs rather than only that it does.

**Its real cost is not bytes but discipline.** A stored source text is an
escape hatch: the first time the schema fails to model something, the tempting
fix is to read it from the snapshot, and that defers ever finishing the schema.
That is the same shape as the alias rewrite that broke every Legs render — a
shortcut that looks harmless and hides the actual problem.

So: application code must never read it. Only the round-trip test and the diff
view touch it, and it moves to an archive table or is dropped at the flip.

The gate disarms its own risk. **If the round-trip test passes on 100% of the
corpus, the schema provably represents everything, and nothing needs the
snapshot.** Passing is the licence to delete it — and reluctance to delete it
is evidence the schema is not finished.

---

## Schema

Following `catalogElement` and `catalogColourLink` conventions — `serial` ids,
`audit`, foreign keys by `_id` suffix.

### `brickiePiece`

One row per piece. Category, name, provenance (hand-authored or which
generator run produced it), lifecycle status (candidate, published, retired),
and the source text during transition.

### `brickiePieceBlock`

One row per `0 FILE` block, ordered, with its name, author and metas. Preserves
submodel nesting, which is how a piece is actually structured — the top-level
block holds only references to its sub-blocks.

### `brickiePiecePlacement`

One row per type-1 line: block, ordinal, colour code, part reference, and the
3×4 transform as twelve numeric columns. Ordinal matters — export order must be
reproducible.

### `brickiePieceStep`

Build-step boundaries within a block. Cannot be derived from placements.

### `brickiePieceSignature`

Derived, refreshed by job, never authored: part count, stud planes,
anti-stud planes, bounding envelope, occupancy signature at 20 LDU, symmetry
ratio, orientation mix. This is what relationship rules and the review filters
query. Keeping it in its own table makes clear it is a cache, and lets it be
rebuilt without touching authored data.

### `brickiePieceFinding`

One row per `brickie-check` finding, refreshed with the signature. Drives the
"issues" facet in the review queue.

---

## Relationships

### The model: inferred versus asserted

Two kinds of edge, deliberately separate rows:

- **Inferred** — produced by a deterministic, executable rule. Carries the rule
  id and version. Re-runnable, and **withdrawn automatically when the rule no
  longer holds**.
- **Asserted** — created by a human, with greater context than any rule has.

A human assertion and a rule inference about the same pair are **two rows**,
not one row overwritten. That is the `catalogColourLink` pattern, whose own
documentation makes the case: two sources agreeing are two rows, because
collapsing them destroys the only signal distinguishing them.

**A human assertion always wins, and always survives a rule re-run.** A rule
that contradicts a standing human edge does not overwrite it; it raises a
conflict for review.

**Suggestions are a third state**: rule output below the confidence needed to
operate on, surfaced in the interface for a human to accept or dismiss. The
similarity threshold that currently decides whether a generated part is novel
belongs here — as a suggestion, never as an operating relationship.

### Vocabulary

| relationship | arity | symmetry | typically |
|---|---|---|---|
| `mirror-of` | binary | symmetric | **inferred** — provable from geometry and colour |
| `chiral-pair` | binary | symmetric | inferred from the element pair used |
| `same-element-as` | binary | symmetric | inferred — filename aliases, e.g. `3023`/`3023b` |
| `variant-of` | n-ary | symmetric within a set | asserted — "these are the same design at different lengths" |
| `alternative-to` | n-ary | symmetric within a set | asserted — interchangeable in a slot |
| `supersedes` | binary | **directed** | asserted, or inferred from a generator run |

`variant-of` and `alternative-to` are the cases behind "select more than two if
the relationship supports it": they describe a *set*, so the interface must let
a reviewer put three or more pieces into one group.

`supersedes` is what ships a corrected piece to the Unity client without a
release: the client-side identifier stays stable while the geometry served
changes.

### Rules must be versioned

An inferred edge records which rule and which version produced it. When a rule
changes, its edges are recomputed; edges the new version no longer produces are
withdrawn, and any that contradict a human assertion surface as conflicts. A
rule that cannot be re-run is not a rule, it is a one-off import.

---

## Review interface

In `@app/hub`, the internal-tooling SPA.

**Single reviewer.** No multi-user review state, no assignment, no
concurrent-edit resolution. Decided rather than deferred: those are real
machinery and nothing about the current volume justifies them. Revisit when a
second reviewer exists.

### The queue

A list of pieces, filterable and sortable by age, category, lifecycle status,
open findings from `brickie-check`, relationship count, and "has unreviewed
suggestions". The default view is new candidates with suggestions outstanding.

### Compare

Select two pieces from thumbnails and view them side by side — static renders
by default, rotatable 3D on demand. The 3D viewer already exists in prototype
form and reads a compressed mesh payload.

The driving case is **original versus fixed**: the same piece before and after
a correction, where the difference is often invisible in a single render. The
4 LDU offset is exactly this — a part one stud height out of position renders
identically to a correct one, which is why the defect survived authoring.

Where a relationship is directed, the interface must make clear which piece is
which; `supersedes` shown without direction is worse than not shown.

### Assert

From a comparison, apply a relationship. Where the relationship is n-ary, the
selection extends beyond two. Rule-inferred edges are shown as already present
and can be overridden; suggestions are shown as pending with accept and dismiss.

---

## Migration sequencing

1. **Import** the 199 templates into the schema. Nothing changes; files remain
   canonical.
2. **Round-trip test** over the whole corpus. Iterate the schema until export
   reproduces every source. *This is the gate.*
3. **Signatures and findings**, computed from the imported data, validated
   against the numbers already measured from files.
4. **Rules**, producing inferred edges — starting with `mirror-of`, which is
   provable, and `same-element-as`, which is a lookup.
5. **Review interface** over the resulting data.
6. **Flip canonicality**; MPD becomes an export. Only after 2 has held.

Steps 1–4 are useful on their own and reversible. Nothing before step 6 risks
the existing pipeline.

---

## Out of scope

- **Whether a piece looks right.** Nothing here judges aesthetics. Every
  duplicate class found so far was caught by a human reading output after
  automated checks had passed, and the review queue exists because that
  remains true.
- **Retiring the legacy system.** The Unity client keeps consuming MPD;
  `supersedes` is what lets corrections reach it before any switch.
- **Part availability.** Whether an element is still manufactured is a separate
  axis needing an external join — see emagineer-core #62.
