# Mirrored brickie parts — generated output, pending review

10 parts from 199 templates. Every one passes `brickie-check`, differs
materially from its own source, and is not a near-duplicate of anything already
in the corpus or of another part in this batch.

| category | parts |
|---|---|
| Hair | 4 |
| Body | 3 |
| Legs | 3 |

## Why only 10 from 199

| outcome | count |
|---|---|
| mirror reproduces the source exactly | 147 |
| mirror reproduces a **different existing template** | 14 |
| mirror is **too similar** to an existing part | 26 |
| fails `brickie-check` | 2 |
| **new** | **10** |

The corpus is 89–98% mirror-symmetric, so most parts mirror to themselves. Of
what remains, most duplicates something already there — the corpus contains
hand-authored left/right pairs, and mirroring one just makes the other.

## Duplicates are caught three ways, and each was needed

**Against its own source**, by exact placement — catches a symmetric part
mirroring to itself.

**Against every other template, by exact placement** — catches
`hair_short_left_sweep` mirroring into `hair_short_right_sweep`. Names would
not have found it: `torso_open_bottom_shirt` and `torso_open_top_shirt` are
exact mirrors and neither name says so.

**Against every other template, by silhouette** — catches pairs that *look*
like mirrors but were hand-built differently. `hair_left_swept_back` and
`hair_right_swept_back` share no part-at-position at all, yet overlap 83% by
geometry. Only a shape comparison sees that.

Silhouette overlap is measured on a 20 LDU occupancy grid, excluding the
candidate's own source — a mirror always overlaps its source heavily and that
is inherent, not evidence of duplication. The threshold is **0.80**, which is
what `hair_left_swept_back` mirrored measures against the existing
`hair_right_swept_back`: a case a human identified from the gallery. Yield
against threshold: 0.70 → 6, 0.75 → 8, **0.80 → 10**, 0.85 → 14, 0.90 → 20,
off → 35. There is no natural break, so `--max-similarity` moves it.

Accepted candidates are folded back into the comparison, so two sources cannot
mirror to near-identical results — `hair_bob_angle_fringe` and
`hair_neat_short_bob` mirrored overlap each other at 0.94 while each sits clear
of anything pre-existing.

## Three rules beyond the reflection

**Part ids are carried through untouched.** Rewriting `~Moved to` filenames
fixed nothing and emitted ids with no extension, gutting every Legs render.

**Printed elements move without flipping**, so the print still reads. This is
why there are no Heads: a face is largely symmetric and its printed features
stay upright, so reflecting one reproduces it.

**Handed parts are swapped for their counterpart.** `29119`/`29120` are Slope
Brick Curved 2x1 with Cutout Right and Left — separate elements, not one
reflected.

## Still needs a human

Nothing here judges whether a part looks right. Every duplicate class above was
found by someone reading the output and asking a question, after every
automated check had passed.


## All parts

| part | source | % changed | parts |
|---|---|---|---|
| `Body/torso_buttons_right_mirrored.mpd` | `torso_buttons_right.mpd` | 50% | 32 |
| `Body/torso_shirt_long_tie_mirrored.mpd` | `torso_shirt_long_tie.mpd` | 19% | 31 |
| `Body/torso_checkered_mirrored.mpd` | `torso_checkered.mpd` | 11% | 71 |
| `Hair/hair_bob_angle_fringe_mirrored.mpd` | `hair_bob_angle_fringe.mpd` | 24% | 34 |
| `Hair/hair_mid_back_bun_mirrored.mpd` | `hair_mid_back_bun.mpd` | 15% | 53 |
| `Hair/hair_very_long_bob_wavey_mirrored.mpd` | `hair_very_long_bob_wavey.mpd` | 13% | 92 |
| `Hair/hair_curly_mirrored.mpd` | `hair_curly.mpd` | 6% | 97 |
| `Legs/dress_side_long_mirrored.mpd` | `dress_side_long.mpd` | 50% | 24 |
| `Legs/checkered_skirt_mirrored.mpd` | `checkered_skirt.mpd` | 18% | 22 |
| `Legs/dress_long_back_mirrored.mpd` | `dress_long_back.mpd` | 17% | 24 |
