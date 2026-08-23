# brickie-gen

A first generator. Makes new brickie parts from existing ones and scores every
candidate with `brickie-check` — the same spec the corpus was measured
against, not a private copy of the rules.

```
brickie-gen mirror --category Hair --out ./new ./Hair/*.mpd
```

## What it does today

One operation: **reflection through X=0**, with two element-specific rules.

That is the operation the measurements support. Brickies are 89–98%
mirror-symmetric, so the parts worth mirroring are exactly the minority that
lean one way — a swept fringe, an asymmetric collar. Those have no
opposite-handed twin in the corpus, and reflecting one produces a genuinely new
part rather than a duplicate.

Reflection is `M·R·M` with `M = diag(-1,1,1)`, which negates the matrix entries
whose row or column is the X axis but not both. Mirroring positions alone —
the obvious mistake — moves every part to its mirrored place while leaving it
facing the original way, which looks right in a thumbnail and is wrong
everywhere it matters.

The rewrite is textual. These templates carry Studio metas this tool has no
opinion about (`0 CustomBrick`, `0 NumOfBricks:`, `0 STEP`, submodel
structure), and round-tripping them through a model object would quietly drop
whatever it did not understand.

## Results over the corpus

| | |
|---|---|
| Sources | 199 |
| Rejected — mirror reproduces the source, or changes too little | 147 |
| **New parts written** | **49** |
| Failed `brickie-check` | 3 |

| category | new parts |
|---|---|
| Hair | 41 |
| Body | 5 |
| Legs | 3 |
| Head | **0** |
| HeadAccessory | 0 |

## Part ids are carried through untouched

An earlier version rewrote `~Moved to` filenames to their replacement,
believing those marked deprecated parts. They do not — it is an LDraw
*filename* redirect, and `3023` is Plate 1x2, in everyday production.

The rewrite fixed nothing and broke a great deal. The replacement id comes from
a header carrying no extension, so it emitted `3023b`, which no loader
resolves: six plates per Legs template vanished from the render while the line
count, the piece count and every check stayed happy. It was caught by looking
at the pictures. `brickie-check` now has a `resolves` check for it.

It also inflated the yield, because unresolved parts drop out of the resolved
model and made a mirror look different from its source when it was the same
part with holes in it. **Legs fell from 28 apparent new parts to 3.**

## Printed elements move; they do not flip

A printed part belongs at the mirrored location, but reflecting its orientation
reflects the print, and a mirrored print is not a part anyone can buy. Printed
placements have their position mirrored and their orientation left exactly as
it was.

**Head yields zero because of this**, and correctly so. A face is largely
symmetric and its printed features now stay upright, so reflecting one
reproduces the same face. Before the rule, 19 mirrored Heads were produced —
distinct only because their prints had been flipped, which made every one of
them unbuildable.

## Handed parts are swapped, not just reflected

Some elements exist as a left/right pair under separate part numbers. `29119`
and `29120` are Slope Brick Curved 2x1 with Cutout Right and Left. Reflecting
the matrix alone gives a shape no element matches — the right silhouette,
unbuildable. Ten of the 49 parts here involve such a swap; before this, all ten were wrong.

Counterparts are found by swapping "Left" and "Right" in the LDraw description.
Over the placeable library, 2,235 parts name a hand and 1,936 (87%) have a
counterpart findable this way; the rest are mostly minifig limbs with no
opposite-handed element at all. This is name matching, which `ldraw-verify`
issue #8 warns about — so it is used only to **find** a substitution, never to
conclude one is unnecessary. A handed part with no counterpart is reported.

95% against the corpus's own 97% bar — near parity, from the crudest possible
operation. The yield tracks asymmetry exactly as measured: Hair, the least
symmetric category at 89%, produces 43 new parts; Legs, at 98%, produces 3.

## It rejects duplicates by checking, not by guessing

A symmetric part mirrors to itself. Since the corpus is overwhelmingly
symmetric, that is the common case, and a generator that does not notice will
report a large number of new parts that are copies of their inputs.

The first version estimated how asymmetric a source *looked*, reading raw MPD
text. That is submodel-**local** coordinates, and a part symmetric in the
assembled brickie can look thoroughly asymmetric inside one of its own
submodels. The heuristic accepted 172 of 199 sources, and **60% of what it
produced was an exact duplicate of its input** — while every candidate scored
clean, because a duplicate of a valid part is valid.

It now mirrors first and compares the two resolved shapes exactly. The only
question that matters is whether the output is a new part, and that is directly
checkable. The heuristic is gone rather than tuned.

## What it does not do

- **Chirality beyond the 87%.** Counterpart matching is name-based. It reports
  a handed part it cannot resolve rather than guessing, but a part whose
  description does not name a hand while still being chiral would slip through.
- **Judging whether a part looks right.** Everything here is legal and in-style
  by measurement. Whether it is a good hairstyle is not a question this tooling
  can answer.
- **Anything but mirroring.** Recombining two parts, resizing within a
  category envelope, generating from a feature description: none of it.

## Running it

```
npm install && npm run build
LDCAD_SHADOW_DIR=/path/to/ldcad-shadow \
  node dist/src/cli.js mirror --category Hair --out ./new \
  --library /path/to/ldraw /path/to/Hair/*.mpd
```

Candidates failing `brickie-check` are reported and not written, unless
`--keep-unclean`.
