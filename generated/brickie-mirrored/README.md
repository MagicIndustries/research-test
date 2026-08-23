# Mirrored brickie parts — generated output, pending review

49 parts produced by `brickie-gen mirror` from the 199 templates in
`emagineer-core`, each reflected through X=0 to give an asymmetric part the
opposite-handed twin it never had. Every one passes `brickie-check`.

| category | parts |
|---|---|
| Hair | 41 |
| Body | 5 |
| Legs | 3 |

Hair dominates because it is the least mirror-symmetric category, at 89%
against 96–98% everywhere else. Head yields nothing, and Legs almost nothing —
both correctly, for reasons below.

## Three rules beyond the reflection

**Part ids are carried through untouched.** An earlier version rewrote
`~Moved to` filenames to their replacement, believing those marked deprecated
parts. They do not: `~Moved to` is an LDraw *filename* redirect and `3023` is
Plate 1x2, in everyday production. The rewrite fixed nothing and broke a great
deal — the replacement id comes from a header carrying no extension, so it
emitted `3023b`, which no loader resolves, and six plates per Legs template
vanished from the render.

Whether the source templates should use current filenames is a question for the
templates (emagineer-core #60), not something this tool answers silently while
doing something else.

**Printed elements move without flipping.** A printed part belongs at the
mirrored location, but reflecting its orientation reflects the print, and a
mirrored print is not a part anyone can buy. Position mirrors; orientation is
left alone. **This is why there are no Heads** — a face is largely symmetric
and its printed features now stay upright, so reflecting one reproduces it.

**Handed parts are swapped for their counterpart.** `29119` and `29120` are
Slope Brick Curved 2x1 with Cutout Right and Left — separate elements, not one
reflected. Reflecting the matrix alone gives the right silhouette made of a
part that does not exist.

Counterparts come from swapping "Left" and "Right" in the LDraw description:
2,235 placeable parts name a hand and 1,936 (87%) have one findable this way.
A handed part with no counterpart is reported, never assumed safe — none here.

## Still needs a human

- **Counterpart matching is name-based**, which `ldraw-verify` issue #8 warns
  about. A chiral part whose description does not name a hand would slip past.
- **Nothing judges whether a part looks right.** Every part here is legal and
  in-style by measurement. Whether it is a good hairstyle is not a question
  this tooling can answer — and reading the renders is what caught the
  extension bug above, after every automated check had passed it.

## What "% changed" means

The share of the source's placements the mirror moves, adds or removes,
comparing elements rather than filenames: this corpus uses `3023.dat` in 72
templates and `3023b.dat` in 112 for the same Plate 1x2, and treating those as
different parts inflates the count. A part can be 98% mirror-symmetric and
still mirror to a technically different model, so anything changing under 5% is
rejected as too similar to be a new part.

## Regenerating

```
cd tools/brickie-gen && npm run build
LDCAD_SHADOW_DIR=... node dist/src/cli.js mirror \
  --category Hair --out ../../generated/brickie-mirrored/Hair \
  --library ... /path/to/brickieMpdTemplates/Hair/*.mpd
```

## Parts involving a hand swap

10 of 49.

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
| `Hair/hair_wide_curved_back_both_sides_left_sweep_mirrored.mpd` | `29119.dat -> 29120.dat`, `29120.dat -> 29119.dat` |
| `Hair/hair_wide_curved_back_both_sides_right_sweep_mirrored.mpd` | `29119.dat -> 29120.dat`, `29120.dat -> 29119.dat` |

## All parts

| part | source | % changed | parts | notes |
|---|---|---|---|---|
| `Body/torso_buttons_right_mirrored.mpd` | `torso_buttons_right.mpd` | 50% | 32 | — |
| `Body/torso_shirt_long_tie_mirrored.mpd` | `torso_shirt_long_tie.mpd` | 19% | 31 | — |
| `Body/torso_open_bottom_shirt_mirrored.mpd` | `torso_open_bottom_shirt.mpd` | 13% | 30 | — |
| `Body/torso_open_top_shirt_mirrored.mpd` | `torso_open_top_shirt.mpd` | 13% | 30 | — |
| `Body/torso_checkered_mirrored.mpd` | `torso_checkered.mpd` | 11% | 71 | — |
| `Hair/hair_left_part_sweep_left_mirrored.mpd` | `hair_left_part_sweep_left.mpd` | 98% | 41 | — |
| `Hair/hair_left_part_sweep_right_mirrored.mpd` | `hair_left_part_sweep_right.mpd` | 98% | 41 | — |
| `Hair/hair_short_slick_back_left_high_mirrored.mpd` | `hair_short_slick_back_left_high.mpd` | 72% | 58 | — |
| `Hair/hair_left_swept_back_mirrored.mpd` | `hair_left_swept_back.mpd` | 70% | 57 | 2 hand swap |
| `Hair/hair_right_swept_back_mirrored.mpd` | `hair_right_swept_back.mpd` | 70% | 57 | 2 hand swap |
| `Hair/hair_short_left_sweep_mirrored.mpd` | `hair_short_left_sweep.mpd` | 50% | 32 | — |
| `Hair/hair_short_right_sweep_mirrored.mpd` | `hair_short_right_sweep.mpd` | 50% | 32 | — |
| `Hair/hair_short_forward_fringe_left_mirrored.mpd` | `hair_short_forward_fringe_left.mpd` | 44% | 45 | — |
| `Hair/hair_short_forward_fringe_right_mirrored.mpd` | `hair_short_forward_fringe_right.mpd` | 44% | 45 | — |
| `Hair/hair_curled_bob_left_fringe_mirrored.mpd` | `hair_curled_bob_left_fringe.mpd` | 38% | 58 | — |
| `Hair/hair_curled_bob_right_fringe_mirrored.mpd` | `hair_curled_bob_right_fringe.mpd` | 38% | 58 | — |
| `Hair/hair_wide_curved_back_both_sides_left_sweep_mirrored.mpd` | `hair_wide_curved_back_both_sides_left_sweep.mpd` | 31% | 59 | 2 hand swap |
| `Hair/hair_wide_curved_back_both_sides_right_sweep_mirrored.mpd` | `hair_wide_curved_back_both_sides_right_sweep.mpd` | 31% | 59 | 2 hand swap |
| `Hair/hair_neat_short_bob_mirrored.mpd` | `hair_neat_short_bob.mpd` | 26% | 31 | — |
| `Hair/hair_bob_angle_fringe_mirrored.mpd` | `hair_bob_angle_fringe.mpd` | 24% | 34 | — |
| `Hair/hair_short_cowlick_mid_mirrored.mpd` | `hair_short_cowlick_mid.mpd` | 24% | 33 | — |
| `Hair/hair_curled_bob_left_no_fringe_mirrored.mpd` | `hair_curled_bob_left_no_fringe.mpd` | 22% | 54 | — |
| `Hair/hair_curled_bob_right_no_fringe_mirrored.mpd` | `hair_curled_bob_right_no_fringe.mpd` | 22% | 54 | — |
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
| `Hair/hair_short_forward_fringe_left_curl_mirrored.mpd` | `hair_short_forward_fringe_left_curl.mpd` | 15% | 39 | — |
| `Hair/hair_short_forward_fringe_midcurl_mirrored.mpd` | `hair_short_forward_fringe_midcurl.mpd` | 15% | 39 | — |
| `Hair/hair_short_forward_fringe_right_curl_mirrored.mpd` | `hair_short_forward_fringe_right_curl.mpd` | 15% | 39 | — |
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
