# brickie-gen

A first generator. Makes new brickie parts from existing ones and scores every
candidate with `brickie-check` — the same spec the corpus was measured
against, not a private copy of the rules.

```
brickie-gen mirror --category Hair --out ./new ./Hair/*.mpd
```

## What it does today

One operation: **reflection through X=0**.

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
| Rejected — mirror reproduces the source | **122** |
| **New parts generated** | **77** |
| Clean by `brickie-check` | **73 (95%)** |
| Needing review for a mirrored print | 16 |

| category | new parts |
|---|---|
| Hair | 43 |
| Head | 21 |
| Body | 9 |
| Legs | 3 |
| HeadAccessory | 1 |

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

- **Chirality.** Some parts have distinct left and right versions with their
  own part numbers. Reflecting one produces a shape that needs the *other*
  part, and this tool does not substitute it. Nothing detects this yet.
- **Printed parts.** A mirrored print is not a part anyone can buy. Candidates
  containing one are written but flagged for review — 16 of the 77 — rather
  than silently shipped or silently dropped.
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
