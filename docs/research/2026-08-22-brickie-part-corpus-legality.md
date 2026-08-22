# The brickie part corpus, measured against the build rules

199 hand-authored brickie part templates from `emagineer-core`
(`packages/domain/assets/brickieMpdTemplates`), run through `ldraw-verify`.

They matter because they are simultaneously the **style spec**, the **interface
spec** and the **quality bar** for any generator that stands in for the master
builder. None of the three is written down; all three are implicit in the
corpus. This is the first measurement of it.

## Headline

| | |
|---|---|
| Templates | **199** — Body 32, Hair 67, Head 53, HeadAccessory 16, Legs 31 |
| Parsed and resolved | **199**, zero errors |
| Placements | 6,748 |
| Connectivity coverage | **99.5%** |
| Exit 1 (a HARD rule fires) | 59 (30%) |
| Rules firing | E-04: 4,859 · E-02: 4,752 · E-07: 226 · B-06: 58 · B-05: 1 |

Every template is a well-formed LDraw file referencing resolvable official
parts. Nothing here is broken in the way a generator bug would break it.

## The 30% HARD failure rate is an artefact of the test, not a defect

`B-06` (no floating parts) drove all 59 exit-1 templates, and 80% of templates
resolve into more than one connected component. That looked alarming. It is
measurement error, and the error is mine: **a part template is a sub-assembly,
and connectivity is only meaningful after composition.**

Merging one Head template with one Hair template — nothing else changed, no
repositioning, they already share a coordinate frame:

| | parts | components | lone parts |
|---|---|---|---|
| Head alone | 22 | 4 | 2 |
| Hair alone | 16 | **13** | 10 |
| **Head + Hair merged** | 38 | **3** | 2 |

Seventeen components collapse to three. The hair's thirteen fragments were
never floating; they attach to the head, which is not in the hair file.

**Consequence for the generator: never run a connectivity rule against an
isolated part.** Run it against the composed brickie. A generated hair piece
that scores badly in isolation may be perfectly correct.

## The category gradient is the interface structure, measured

| category | mean parts | mean components | fully connected | lone parts |
|---|---|---|---|---|
| Legs | 16 | **1.2** | 28/31 | 5 |
| Body | 34 | 3.2 | 5/32 | 19 |
| HeadAccessory | 18 | 3.4 | 6/16 | 30 |
| Head | 28 | 4.7 | 0/53 | 135 |
| Hair | 50 | **16.8** | 0/67 | 583 |

This is not noise — it is a clean gradient describing what each category *is*:

- **Legs are free-standing structure.** They hold together alone (1.2
  components, 28 of 31 fully connected). They are the base the brickie stands on.
- **Hair is a surface shell.** Tiles and slopes laid over the head's form,
  attaching downward to it rather than sideways to each other. Sixteen-plus
  fragments is the normal, correct shape of a hair piece.
- **Head and Body sit between**, part structure and part shell.

A generator must produce the right *kind* of thing per category. A hair piece
built as one rigid connected lump would be as wrong as legs built as loose
shell fragments, and neither error is visible to a rule that only asks "is it
connected".

The lone parts are overwhelmingly tiles and slopes — 3069b (132), 2431 (124),
98138pz0 (86), 3070b (84), 14719 (70), 85984 (66), 54200 (64). Surface pieces,
as the shell reading predicts.

## E-02 and E-04 should be scoped off this content

Together they account for 9,611 of the 9,896 findings — 97%. Both are
DISCOURAGED, and both fire because these templates come out of BrickLink Studio
with free positioning: coordinates like `-21.5004`, `4.3476`, `31.5001`, and
rotation entries of `1.000004` rather than `1`.

This is the third time in this work that a rule encoding a *generator
convention* has been mistaken for one encoding validity. E-02 and E-04 describe
how a tidy generator ought to emit; they do not describe whether a build is
sound. Against hand-authored, in-style, presumably-good content they produce
almost ten thousand findings and no information.

**Do not gate generated brickies on E-02 or E-04.** Report them at most as
advisory, or scope them off brickie content entirely.

## What is genuinely actionable

**E-07, 226 findings: templates referencing deprecated part aliases**
(`~Moved to`). These are real, cheap to fix, and will silently degrade as the
LDraw library moves on. Worth a pass over the corpus independent of any
generator work.

**B-05, 1 finding:** a single sub-detent rotation. Worth a look as a one-off.

## Composed brickies: a single systematic 4 LDU offset

Forty full brickies were composed — one template from each of the five
categories, overlaid at identity, which is geometrically what
`combineBrickieMpd` does (every category root is emitted as an
`identityReferenceLine`, so all five are authored in one shared world frame).

| | |
|---|---|
| Mean parts | 151 |
| Mean components | **8.1** (min 3, max 19) |
| Mean lone parts | 5.5 |
| Fully connected | **0 of 40** |
| Coverage | 99.1% |

Composition removes most of the fragmentation — hair alone averages 16.8
components — but no composed brickie reaches one piece. Breaking the residue
down:

- **~27% of lone parts have no shadow data at all**, so they can never pair.
  These are sculpted and curved bricks like `5907` (Brick 2x1x1.667 with Curved
  Top). A verifier blind spot, not a build defect, and not fixable from this
  side.
- **Of those that do have data, 83% sit a single-axis offset from a valid
  connection, and 75% of them are offset by exactly 4.00 LDU — one stud
  height.** The gap histogram is dominated by a single value: 4.00 appears 42
  times out of 53.

That is one systematic cause, not scattered inaccuracy.

### The control that makes this trustworthy

The same measurement, run over real official sets from the OMR corpus:

| | single-axis offset | **exactly 4 LDU** | commonest gaps |
|---|---|---|---|
| Brickie corpus | 83% | **75%** | 4.00 (42 of 53) |
| Real official sets | 50% | **8%** | 8.00, 4.00, 10.00 |

Real sets do not show the pattern. So the 4 LDU offset is **a property of the
brickie templates, not of the verifier's pairing convention** — which was the
alternative explanation, and a live one given that this project has already
found two cases where physically-correct seating leaves LDCad hotspots a fixed
distance apart (see the `L-01` and `L-04` exemplar notes).

### What it probably is, and why it matters

A surface tile placed flush against a face rather than on top of the stud that
should carry it is exactly 4 LDU out, and renders identically. These templates
were authored in Studio with free positioning, so nothing forced them to snap.

For the generator this is the single most useful thing measured so far: **three
quarters of the corpus's residual illegality is one repeatable offset**, which
is detectable, quantifiable, and probably fixable by a snap pass. It is also
the convention a generated part must get right, and getting it wrong is
invisible in a render.

Whether the corpus should be corrected or the connection treated as legitimate
is a decision for whoever owns the assets. Either way it is one rule, not 199
broken parts.

## What this does not yet tell us

- **The interface contract itself** — where a Hair *must* present anti-studs to
  meet a Head, the size envelopes, the origin conventions. The gradient above
  says what kind of thing each category is; it does not yet say what a new part
  must satisfy to drop into the same slot.
- **The style conventions** — part palette, recurring techniques, typical piece
  counts. Deferred deliberately until legality is settled.

## Method note

Run read-only against `emagineer-core`; nothing in that repo was modified.
Verification used `ldraw-verify` at 13 implemented rules with the LDraw
library cached locally and the LDCad shadow library supplied by path.
