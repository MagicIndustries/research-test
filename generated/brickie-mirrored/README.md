# Mirrored brickie parts — generated output, pending review

35 parts produced by `brickie-gen mirror` from the 199 templates in
`emagineer-core`, each reflected through X=0. Every one passes `brickie-check`,
and every one is checked against the whole corpus rather than only against the
template it came from.

| category | parts |
|---|---|
| Hair | 29 |
| Body | 3 |
| Legs | 3 |

Of the 199 sources: 147 mirror to something identical, **14 mirror to a part
that already exists elsewhere in the corpus**, 3 fail the checker, and 35
produce something new.

## Candidates are compared against the whole corpus

The corpus already contains hand-authored left/right pairs —
`hair_short_left_sweep` and `hair_short_right_sweep`,
`hair_curled_bob_left_fringe` and its right twin. Mirroring one of those simply
reproduces the other, which is a duplicate of a *different* template and passed
a source-only comparison cleanly. **14 of a previous 49 outputs already existed.**

Names would not have caught it. `torso_open_bottom_shirt` and
`torso_open_top_shirt` are exact mirrors of one another, and nothing in either
name says so.

The closest any part here now sits to an existing template is 5% apart; the
median is 17%.

## Three rules beyond the reflection

**Part ids are carried through untouched.** An earlier version rewrote
`~Moved to` filenames, believing they marked deprecated parts. They mark a
*filename* redirect — `3023` is Plate 1x2, in everyday production — so the
rewrite fixed nothing, and it emitted an id with no extension, which no loader
resolves. Six plates per Legs template vanished from the render while every
check passed. Whether the templates should use current filenames is
emagineer-core #60, not this tool's business.

**Printed elements move without flipping.** Reflecting a printed part reflects
its print, and a mirrored print is not a part anyone can buy. Position mirrors,
orientation does not. **This is why there are no Heads** — a face is largely
symmetric and its printed features now stay upright, so reflecting one
reproduces it.

**Handed parts are swapped for their counterpart.** `29119` and `29120` are
Slope Brick Curved 2x1 with Cutout Right and Left: separate elements, not one
reflected. Counterparts come from swapping "Left" and "Right" in the LDraw
description — 1,936 of the library's 2,235 handed parts (87%) have one findable
that way, and a part with none is reported rather than assumed safe.

## Still needs a human

- **Counterpart matching is name-based**, which `ldraw-verify` issue #8 warns
  about. A chiral part whose description does not name a hand slips past.
- **Nothing judges whether a part looks right.** Every part here is legal and
  in-style by measurement. Reading the renders is what caught the extension
  bug, and noticing the corpus already had left/right pairs is what caught the
  duplicates — both after every automated check had passed.

## Regenerating

```
cd tools/brickie-gen && npm run build
LDCAD_SHADOW_DIR=... node dist/src/cli.js mirror \
  --category Hair --out ../../generated/brickie-mirrored/Hair \
  --library ... /path/to/brickieMpdTemplates/Hair/*.mpd
```

## Parts involving a hand swap

8 of 35.

| part | swap |
|---|---|
| `Hair/hair_left_swept_back_mirrored.mpd` | `29119.dat -> 29120.dat`, `29120.dat -> 29119.dat` |
| `Hair/hair_long_bob_fringe_left_mirrored.mpd` | `29119.dat -> 29120.dat`, `29120.dat -> 29119.dat` |
| `Hair/hair_long_bob_fringe_right_mirrored.mpd` | `29119.dat -> 29120.dat`, `29120.dat -> 29119.dat` |
| `Hair/hair_long_bob_low_fringe_left_mirrored.mpd` | `29119.dat -> 29120.dat`, `29120.dat -> 29119.dat` |
| `Hair/hair_long_bob_mirrored.mpd` | `29119.dat -> 29120.dat`, `29120.dat -> 29119.dat` |
| `Hair/hair_long_bob_wavey_mirrored.mpd` | `29120.dat -> 29119.dat`, `29119.dat -> 29120.dat` |
| `Hair/hair_long_bob_wavey_slight_curl_mirrored.mpd` | `29120.dat -> 29119.dat`, `29119.dat -> 29120.dat` |
| `Hair/hair_right_swept_back_mirrored.mpd` | `29120.dat -> 29119.dat`, `29119.dat -> 29120.dat` |

## All parts

| part | source | % changed | parts | notes |
|---|---|---|---|---|
| `Body/torso_buttons_right_mirrored.mpd` | `torso_buttons_right.mpd` | 50% | 32 | — |
| `Body/torso_shirt_long_tie_mirrored.mpd` | `torso_shirt_long_tie.mpd` | 19% | 31 | — |
| `Body/torso_checkered_mirrored.mpd` | `torso_checkered.mpd` | 11% | 71 | — |
| `Hair/hair_short_slick_back_left_high_mirrored.mpd` | `hair_short_slick_back_left_high.mpd` | 72% | 58 | — |
| `Hair/hair_left_swept_back_mirrored.mpd` | `hair_left_swept_back.mpd` | 70% | 57 | 2 hand swap |
| `Hair/hair_right_swept_back_mirrored.mpd` | `hair_right_swept_back.mpd` | 70% | 57 | 2 hand swap |
| `Hair/hair_short_forward_fringe_left_mirrored.mpd` | `hair_short_forward_fringe_left.mpd` | 44% | 45 | — |
| `Hair/hair_short_forward_fringe_right_mirrored.mpd` | `hair_short_forward_fringe_right.mpd` | 44% | 45 | — |
| `Hair/hair_neat_short_bob_mirrored.mpd` | `hair_neat_short_bob.mpd` | 26% | 31 | — |
| `Hair/hair_bob_angle_fringe_mirrored.mpd` | `hair_bob_angle_fringe.mpd` | 24% | 34 | — |
| `Hair/hair_short_cowlick_mid_mirrored.mpd` | `hair_short_cowlick_mid.mpd` | 24% | 33 | — |
| `Hair/hair_curled_bob_left_low_fringe_mirrored.mpd` | `hair_curled_bob_left_low_fringe.mpd` | 21% | 58 | — |
| `Hair/hair_curled_bob_right_low_fringe_mirrored.mpd` | `hair_curled_bob_right_low_fringe.mpd` | 21% | 58 | — |
| `Hair/hair_curled_bob_middle_low_fringe_mirrored.mpd` | `hair_curled_bob_middle_low_fringe.mpd` | 20% | 61 | — |
| `Hair/hair_curled_bob_middle_big_fringe_mirrored.mpd` | `hair_curled_bob_middle_big_fringe.mpd` | 18% | 65 | — |
| `Hair/hair_short_left_swept_fringe_mirrored.mpd` | `hair_short_left_swept_fringe.mpd` | 18% | 45 | — |
| `Hair/hair_short_mid_swept_fringe_mirrored.mpd` | `hair_short_mid_swept_fringe.mpd` | 18% | 45 | — |
| `Hair/hair_short_tight_swept_fringe_mirrored.mpd` | `hair_short_tight_swept_fringe.mpd` | 18% | 45 | — |
| `Hair/hair_short_curved_widow_peak_mirrored.mpd` | `hair_short_curved_widow_peak.mpd` | 17% | 47 | — |
| `Hair/hair_short_curved_widow_peak_fringe_mirrored.mpd` | `hair_short_curved_widow_peak_fringe.mpd` | 17% | 47 | — |
| `Hair/hair_mid_back_bun_mirrored.mpd` | `hair_mid_back_bun.mpd` | 15% | 53 | — |
| `Hair/hair_short_forward_fringe_midcurl_mirrored.mpd` | `hair_short_forward_fringe_midcurl.mpd` | 15% | 39 | — |
| `Hair/hair_long_bob_fringe_left_mirrored.mpd` | `hair_long_bob_fringe_left.mpd` | 14% | 58 | 2 hand swap |
| `Hair/hair_very_long_bob_wavey_mirrored.mpd` | `hair_very_long_bob_wavey.mpd` | 13% | 92 | — |
| `Hair/hair_long_bob_low_fringe_left_mirrored.mpd` | `hair_long_bob_low_fringe_left.mpd` | 10% | 59 | 2 hand swap |
| `Hair/hair_long_bob_wavey_mirrored.mpd` | `hair_long_bob_wavey.mpd` | 10% | 83 | 2 hand swap |
| `Hair/hair_short_slick_back_mid_high_mirrored.mpd` | `hair_short_slick_back_mid_high.mpd` | 10% | 60 | — |
| `Hair/hair_long_bob_wavey_slight_curl_mirrored.mpd` | `hair_long_bob_wavey_slight_curl.mpd` | 9% | 85 | 2 hand swap |
| `Hair/hair_mullet_mirrored.mpd` | `hair_mullet.mpd` | 9% | 70 | — |
| `Hair/hair_long_bob_mirrored.mpd` | `hair_long_bob.mpd` | 7% | 55 | 2 hand swap |
| `Hair/hair_long_bob_fringe_right_mirrored.mpd` | `hair_long_bob_fringe_right.mpd` | 7% | 58 | 2 hand swap |
| `Hair/hair_curly_mirrored.mpd` | `hair_curly.mpd` | 6% | 97 | — |
| `Legs/dress_side_long_mirrored.mpd` | `dress_side_long.mpd` | 50% | 24 | — |
| `Legs/checkered_skirt_mirrored.mpd` | `checkered_skirt.mpd` | 18% | 22 | — |
| `Legs/dress_long_back_mirrored.mpd` | `dress_long_back.mpd` | 17% | 24 | — |
