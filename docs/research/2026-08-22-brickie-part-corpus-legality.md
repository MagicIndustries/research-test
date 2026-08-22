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

## The interface contract, measured

Where each category joins the next, across 25 composed brickies. None of this
is documented; it is derived from what the corpus does.

| interface | plane (Y) | studs presented by | joins |
|---|---|---|---|
| Body ↔ Legs | **0** | Legs | 382 |
| Body ↔ Head | **−64** | Body | 382 |
| Hair ↔ Head | −94, −114, −134, −144 | Head | **1404** |
| Head ↔ HeadAccessory | **−144** | Head | 320 |
| Hair ↔ HeadAccessory | −152, −160, −168 | mixed | 234 |

**The structural joints are single-plane and directional.** Legs present studs
upward at Y=0 and Body receives them; Body presents studs at Y=−64 and Head
receives them. Every one of the 382 joins in each case lands on exactly one
plane, which makes the contract for a replacement part unambiguous: a new Body
must receive at 0 and present at −64.

**Hair is not a structural joint.** It meets the Head across four planes and
1,404 connections — a surface shell of tiles and slopes laid over the head's
form rather than a part that plugs in. This is the same fact the component
counts showed from the other direction, and it constrains generation: a hair
piece built as one rigid connected lump would be as wrong as legs built as
loose fragments, and no check that only asks "is it connected" sees either
error.

`Hair ↔ HeadAccessory` is the one irregular interface — three planes and mixed
direction, with more distinct part pairs (52) than any other. Treat it as
under-specified rather than as a contract.

## The style conventions, measured

What "in the correct style" means, derived from the 199 templates rather than
described. Six conventions, in descending order of how hard they look.

### Every build is strictly orthogonal

**100% of placements in every category are axis-aligned** (99% for
HeadAccessory, a single exception). Not one part in 6,748 is set at an oblique
angle. Whatever else a generated part does, it does not tilt.

### Every build is mirror-symmetric about X=0

| category | off-centre parts with a mirror partner | parts on the centre line |
|---|---|---|
| Legs | **98%** | 33% |
| HeadAccessory | **98%** | 43% |
| Body | 96% | 38% |
| Head | 96% | 38% |
| Hair | 89% | 15% |

Hair is the least symmetric, which is what you would expect of fringes and side
partings; everything else is near-absolute. A generator should build one half
and reflect it, treating asymmetry as a deliberate exception rather than a
default.

### SNOT is the dominant technique, and it increases up the figure

Proportion of placements whose studs point up:

| category | studs up | next commonest directions |
|---|---|---|
| Legs | **81%** | scattered, 4–6% each |
| Body | 73% | ±X at 10% each |
| Head | 58% | **−Z at 41%** |
| HeadAccessory | 69% | mixed |
| Hair | **28%** | ±X at 24% each, +Z 15% |

Legs are conventional upright building. Hair is predominantly sideways. The
Head's 41% pointing −Z is the face: a large forward-facing SNOT surface on an
upright core.

This is the same gradient the connectivity counts found, arrived at
independently — structure at the bottom, sculpted shell at the top.

### The palette is small and deliberate

**117 distinct parts across 6,748 placements, and 21 of them cover 80%.** That
is 18% of the vocabulary doing four fifths of the work. The character of the
top of that list is the style:

| part | uses | what it is |
|---|---|---|
| `22885` | 690 | Brick 1x2x1.667 with Studs on 1 Side — **a SNOT brick, the single most used part** |
| `3023b` | 554 | Plate 1x2 |
| `3024` | 445 | Plate 1x1 |
| `15068` | 432 | Slope Brick Curved 2x2x0.667 |
| `3020` | 361 | Plate 2x4 |
| `3710` | 361 | Plate 1x4 |
| `11477` | 347 | Slope Brick Curved 2x1 |
| `3069b` | 245 | Tile 1x2 |
| `3941` | 228 | Brick 2x2 Round |
| `2431` | 223 | Tile 1x4 |

Side-stud bricks and plates for the core, curved slopes and tiles for the
surface. That is a sculpting vocabulary, not a building one, and the most-used
part in the whole corpus being a SNOT brick says the same thing as the
orientation table.

### Size is consistent within a category

| category | median parts | range | distinct parts | vertical envelope (Y) |
|---|---|---|---|---|
| Legs | 14 | 6–42 | 34 | 0 … +56 |
| Body | 32 | 26–71 | 36 | −64 … −8 |
| Head | **29** | **21–35** | 31 | −145 … −44 |
| Hair | 47 | 16–97 | 58 | −220 … −34 |
| HeadAccessory | 13 | 8–50 | 54 | −216 … −144 |

Head is the tightest — 53 templates all landing between 21 and 35 parts, which
is a strong constraint on a generated head. Hair is the loosest by a wide
margin. HeadAccessory is the odd one: only 16 templates but 54 distinct parts,
so each accessory is idiosyncratic rather than drawn from a shared kit.

The whole figure spans Y +56 (feet) to −220 (top of hair) — about 276 LDU, or
eleven and a half bricks.

### Colour is a placeholder scheme, not a design choice

Placements carry a small set of codes — 308, 1, 71, 19, 0 dominate — which
`combineBrickieMpd` rewrites per colour region. A generated part must tag its
regions with the same codes, not choose colours.

## What "style" here does not cover

These are structural conventions. They say a generated part must be
orthogonal, mirror-symmetric, SNOT-heavy in proportion to its height, drawn
from a 21-part core vocabulary, and sized to its category. **They do not say
whether the result looks like a person.** Nothing measured here distinguishes a
good caricature from a bad one, and that judgement is the part of the master
builder's job this analysis cannot stand in for.

## Fix available now: one deprecated part

The 226 `E-07` findings come from just five aliases, and one accounts for 95%:

| reference | uses | should be |
|---|---|---|
| `3023.dat` | **208** | `3023b.dat` |
| `43722.dat` | 5 | `43722a.dat` |
| `43723.dat` | 5 | `43723a.dat` |
| `41769.dat` | 1 | `41769a.dat` |
| `41770.dat` | 1 | `41770a.dat` |

A single find-and-replace of `3023` clears the great majority of it.

## What this does not yet tell us

- **The style conventions themselves** — where a Hair *must* present anti-studs to
  meet a Head, the size envelopes, the origin conventions. The gradient above
  says what kind of thing each category is; it does not yet say what a new part
  must satisfy to drop into the same slot.
  — part palette, recurring techniques, typical piece counts. Deferred
  deliberately until legality is settled.
- **Whether any 4 LDU offset is deliberate.** A part held by friction or by a
  neighbour rather than by a stud is a legitimate technique, and this
  measurement cannot tell it apart from an authoring slip. That three quarters
  share one exact offset argues for the slip.

## Method note

Run read-only against `emagineer-core`; nothing in that repo was modified.
Verification used `ldraw-verify` at 13 implemented rules with the LDraw
library cached locally and the LDCad shadow library supplied by path.
