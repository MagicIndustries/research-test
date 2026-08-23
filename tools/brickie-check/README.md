# brickie-check

Checks a brickie part against the conventions measured from the 199-template
corpus. Separate from `ldraw-verify`, which it depends on: that tool answers
"is this a legal LEGO build?", this one answers "is this a brickie part?".

```
brickie-check --category Head path/to/part.mpd
```

## Why it exists

Any generator standing in for the master builder needs a fitness function.
Without one you can only judge generated parts by looking at them, and the
whole brickie corpus study showed that looking at them is unreliable — a part
4 LDU out of position renders identically to one that is correct.

## What it checks

Every threshold comes from measurement, not taste. See
`docs/research/2026-08-22-brickie-part-corpus-legality.md` for the method and
`src/spec.ts` for the numbers with their provenance.

| check | severity | asserts |
|---|---|---|
| `orthogonal` | fail | nothing is set at an oblique angle |
| `superseded-filename` | note | part references use the current LDraw filename |
| `interface` | fail | studs and anti-studs on the category's contracted planes |
| `symmetry` | warn | off-centre parts have a mirror partner across X=0 |
| `orientation` | warn | the upright/sideways mix suits the category |
| `size` | warn | piece count and vertical extent are typical |
| `vocabulary` | note | the part draws mainly on the corpus's core 21 parts |

The interface check is **directional**: Legs *present* studs at Y=0 and Body
*receives* them there, so the receiving side is checked for anti-studs. An
earlier version checked stud planes on both sides and silently failed every
receiving contract.

Hair has no contractual plane, deliberately. It meets the Head across four
planes and 1,404 connections — a surface shell rather than a part that plugs
in — so asserting a plane would invent a contract the corpus does not have.

## Calibration

Run over the corpus it was derived from:

| | |
|---|---|
| Templates | 199 |
| **Pass** | **193 (97%)** |

The checker agrees with the hand-authored corpus 97% of the time, which is the
bar a generated part should be held to.

This read 58% until `superseded-filename` was corrected. It was a `fail` named
`deprecated`, and it fires on 78 templates that reference `3023.dat` — a file
LDraw redirects to `3023b.dat`. That is a **filename** redirect: `3023` is
Plate 1x2, in everyday production, and 1,159 such redirects exist in the
current library. Failing a part for it was wrong twice over — it is not a
defect in the part, and it changes nothing about what gets built. It is a note
now. See emagineer-core #60 and #62.

**Nothing here checks whether an element is still manufactured.** That is a
separate axis, unanswerable from LDraw, and deliberately absent: a builder who
owns a retired element can use it, so rejecting one would be wrong.

The six remaining disagreements are genuine oddities worth a look rather than
checker bugs: four templates containing oblique placements, and three missing
an interface plane.

Building this is also what corrected the corpus study's claim that placements
are "100% axis-aligned". They are 99.8% — 15 placements of 6,748, in 4
templates. Per-category rounding had hidden them.

## Running it

```
npm install && npm run build
LDCAD_SHADOW_DIR=/path/to/ldcad-shadow \
  node dist/src/cli.js --category Hair --library /path/to/ldraw part.mpd
```

Exit 0 clean, 1 if a part failed, 2 on bad invocation. `--json` for machine
output. Without a shadow library the interface check reports that it could not
run rather than passing silently.

The LDCad shadow library is CC BY-SA 4.0 and is never vendored — supply it by
path.
