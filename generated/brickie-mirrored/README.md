# Mirrored brickie parts — generated output, pending review

86 parts produced by `brickie-gen mirror` from the 199 templates in
`emagineer-core`, each reflected through X=0 to give an asymmetric part the
opposite-handed twin it never had. Every one passes `brickie-check`.

| category | parts |
|---|---|
| Hair | 53 |
| Legs | 28 |
| Body | 5 |

## Two things the reflection handles specially

**Printed elements are moved, not flipped.** A printed part belongs at the
mirrored location, but reflecting its orientation reflects the print with it,
and a mirrored print is not a part anyone can buy. Those placements have their
position mirrored and their orientation left exactly as it was, so the print
still reads.

No part in this batch triggers it, and that is a consequence of the rule rather
than a sign it is unused: the printed elements in this corpus are faces, and
faces no longer produce a mirror at all (below).

**This is why there are no mirrored Heads.** A face is largely symmetric and
its printed features now stay upright, so reflecting one reproduces the same
face. That is correct, and it is why the yield dropped from 110 to 86 when the
rule was added — the 19 mirrored Heads the previous run produced were only
distinct because their prints had been flipped, which made them unbuildable.

**Handed parts are swapped for their counterpart.** Some elements exist as a
left/right pair under separate part numbers — `29119` and `29120` are Slope
Brick Curved 2x1 with Cutout Right and Left. Reflecting the matrix alone gives
a shape no element matches: the right silhouette, unbuildable. The generator
substitutes the counterpart. 10 parts here involve a swap.

Counterparts are found by swapping "Left" and "Right" in the LDraw description.
Measured over the placeable library, 2,235 parts name a hand and 1,936 (87%)
have a counterpart findable this way. **A handed part with no counterpart is
reported, never assumed safe** — 0 in this batch.

## Still needs a human

- **The 87% is not 100%.** Counterpart matching is name-based, which is exactly
  what `ldraw-verify` issue #8 warns about. It is used only to find a
  substitution, never to conclude one is unnecessary.
- **Nothing judges whether a part looks right.** Every part here is legal and
  in-style by measurement. Whether it is a good hairstyle is not a question any
  of this tooling can answer.

## What "% changed" means

The share of the source's placements the mirror moves, adds or removes. A part
can be 98% mirror-symmetric and still mirror to a technically different model,
so difference alone says little — anything under 5% is rejected as too similar
to be a new part and does not appear here.

## Regenerating

```
cd tools/brickie-gen && npm run build
LDCAD_SHADOW_DIR=... node dist/src/cli.js mirror \
  --category Hair --out ../../generated/brickie-mirrored/Hair \
  --library ... /path/to/brickieMpdTemplates/Hair/*.mpd
```

## Parts involving a hand swap

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
| `Body/torso_checkered_mirrored.mpd` | `torso_checkered.mpd` | 11% | 71 | — |
| `Body/torso_open_bottom_shirt_mirrored.mpd` | `torso_open_bottom_shirt.mpd` | 7% | 28 | 2 filename updated |
| `Body/torso_open_top_shirt_mirrored.mpd` | `torso_open_top_shirt.mpd` | 7% | 28 | 2 filename updated |
| `Hair/hair_left_part_sweep_left_mirrored.mpd` | `hair_left_part_sweep_left.mpd` | 102% | 39 | 1 filename updated |
| `Hair/hair_left_part_sweep_right_mirrored.mpd` | `hair_left_part_sweep_right.mpd` | 102% | 39 | 1 filename updated |
| `Hair/hair_short_slick_back_left_high_mirrored.mpd` | `hair_short_slick_back_left_high.mpd` | 76% | 56 | 1 filename updated |
| `Hair/hair_left_swept_back_mirrored.mpd` | `hair_left_swept_back.mpd` | 74% | 55 | 2 hand swap, 1 filename updated |
| `Hair/hair_right_swept_back_mirrored.mpd` | `hair_right_swept_back.mpd` | 74% | 55 | 2 hand swap, 1 filename updated |
| `Hair/hair_short_left_sweep_mirrored.mpd` | `hair_short_left_sweep.mpd` | 56% | 30 | 1 filename updated |
| `Hair/hair_short_right_sweep_mirrored.mpd` | `hair_short_right_sweep.mpd` | 56% | 30 | 1 filename updated |
| `Hair/hair_short_forward_fringe_left_mirrored.mpd` | `hair_short_forward_fringe_left.mpd` | 49% | 43 | 1 filename updated |
| `Hair/hair_short_forward_fringe_right_mirrored.mpd` | `hair_short_forward_fringe_right.mpd` | 49% | 43 | 1 filename updated |
| `Hair/hair_curled_bob_left_fringe_mirrored.mpd` | `hair_curled_bob_left_fringe.mpd` | 36% | 57 | 1 filename updated |
| `Hair/hair_curled_bob_right_fringe_mirrored.mpd` | `hair_curled_bob_right_fringe.mpd` | 36% | 57 | 1 filename updated |
| `Hair/hair_wide_curved_back_both_sides_left_sweep_mirrored.mpd` | `hair_wide_curved_back_both_sides_left_sweep.mpd` | 34% | 57 | 2 hand swap, 1 filename updated |
| `Hair/hair_wide_curved_back_both_sides_right_sweep_mirrored.mpd` | `hair_wide_curved_back_both_sides_right_sweep.mpd` | 34% | 57 | 2 hand swap, 1 filename updated |
| `Hair/hair_short_cowlick_mid_mirrored.mpd` | `hair_short_cowlick_mid.mpd` | 30% | 31 | 1 filename updated |
| `Hair/hair_neat_short_bob_mirrored.mpd` | `hair_neat_short_bob.mpd` | 26% | 31 | — |
| `Hair/hair_bob_angle_fringe_mirrored.mpd` | `hair_bob_angle_fringe.mpd` | 24% | 34 | — |
| `Hair/hair_curled_bob_left_no_fringe_mirrored.mpd` | `hair_curled_bob_left_no_fringe.mpd` | 22% | 54 | — |
| `Hair/hair_curled_bob_right_no_fringe_mirrored.mpd` | `hair_curled_bob_right_no_fringe.mpd` | 22% | 54 | — |
| `Hair/hair_short_left_swept_fringe_mirrored.mpd` | `hair_short_left_swept_fringe.mpd` | 22% | 43 | 1 filename updated |
| `Hair/hair_short_mid_swept_fringe_mirrored.mpd` | `hair_short_mid_swept_fringe.mpd` | 22% | 43 | 1 filename updated |
| `Hair/hair_short_tight_swept_fringe_mirrored.mpd` | `hair_short_tight_swept_fringe.mpd` | 22% | 43 | 1 filename updated |
| `Hair/hair_curled_bob_left_low_fringe_mirrored.mpd` | `hair_curled_bob_left_low_fringe.mpd` | 21% | 58 | — |
| `Hair/hair_curled_bob_right_low_fringe_mirrored.mpd` | `hair_curled_bob_right_low_fringe.mpd` | 21% | 58 | — |
| `Hair/hair_short_curved_widow_peak_mirrored.mpd` | `hair_short_curved_widow_peak.mpd` | 21% | 45 | 1 filename updated |
| `Hair/hair_short_curved_widow_peak_fringe_mirrored.mpd` | `hair_short_curved_widow_peak_fringe.mpd` | 21% | 45 | 1 filename updated |
| `Hair/hair_short_forward_fringe_left_curl_mirrored.mpd` | `hair_short_forward_fringe_left_curl.mpd` | 21% | 37 | 1 filename updated |
| `Hair/hair_short_forward_fringe_midcurl_mirrored.mpd` | `hair_short_forward_fringe_midcurl.mpd` | 21% | 37 | 1 filename updated |
| `Hair/hair_short_forward_fringe_right_curl_mirrored.mpd` | `hair_short_forward_fringe_right_curl.mpd` | 21% | 37 | 1 filename updated |
| `Hair/hair_curled_bob_middle_low_fringe_mirrored.mpd` | `hair_curled_bob_middle_low_fringe.mpd` | 20% | 61 | — |
| `Hair/hair_curled_bob_middle_big_fringe_mirrored.mpd` | `hair_curled_bob_middle_big_fringe.mpd` | 18% | 65 | — |
| `Hair/hair_long_bob_fringe_left_mirrored.mpd` | `hair_long_bob_fringe_left.mpd` | 16% | 57 | 2 hand swap, 1 filename updated |
| `Hair/hair_mid_back_bun_mirrored.mpd` | `hair_mid_back_bun.mpd` | 15% | 53 | — |
| `Hair/hair_bald_mirrored.mpd` | `hair_bald.mpd` | 13% | 14 | 1 filename updated |
| `Hair/hair_short_slick_back_mid_high_mirrored.mpd` | `hair_short_slick_back_mid_high.mpd` | 13% | 58 | 1 filename updated |
| `Hair/hair_very_long_bob_wavey_mirrored.mpd` | `hair_very_long_bob_wavey.mpd` | 13% | 92 | — |
| `Hair/hair_mullet_mirrored.mpd` | `hair_mullet.mpd` | 11% | 68 | 1 filename updated |
| `Hair/hair_long_bob_low_fringe_left_mirrored.mpd` | `hair_long_bob_low_fringe_left.mpd` | 10% | 59 | 2 hand swap |
| `Hair/hair_long_bob_wavey_mirrored.mpd` | `hair_long_bob_wavey.mpd` | 10% | 83 | 2 hand swap |
| `Hair/hair_long_bob_fringe_right_mirrored.mpd` | `hair_long_bob_fringe_right.mpd` | 9% | 57 | 2 hand swap, 1 filename updated |
| `Hair/hair_long_bob_wavey_slight_curl_mirrored.mpd` | `hair_long_bob_wavey_slight_curl.mpd` | 9% | 85 | 2 hand swap |
| `Hair/hair_curly_mirrored.mpd` | `hair_curly.mpd` | 8% | 95 | 1 filename updated |
| `Hair/hair_long_bob_mirrored.mpd` | `hair_long_bob.mpd` | 7% | 55 | 2 hand swap |
| `Hair/hair_short_mirrored.mpd` | `hair_short.mpd` | 7% | 27 | 1 filename updated |
| `Hair/hair_short_both_sides_mirrored.mpd` | `hair_short_both_sides.mpd` | 7% | 27 | 1 filename updated |
| `Hair/hair_short_forward_fringe_mirrored.mpd` | `hair_short_forward_fringe.mpd` | 7% | 27 | 1 filename updated |
| `Hair/hair_short_slicked_back_no_sideburns_mirrored.mpd` | `hair_short_slicked_back_no_sideburns.mpd` | 7% | 25 | 1 filename updated |
| `Hair/hair_long_fringe_mirrored.mpd` | `hair_long_fringe.mpd` | 6% | 32 | 1 filename updated |
| `Hair/hair_mohawk_mirrored.mpd` | `hair_mohawk.mpd` | 6% | 32 | 1 filename updated |
| `Hair/hair_short_flattop_mirrored.mpd` | `hair_short_flattop.mpd` | 6% | 29 | 1 filename updated |
| `Hair/hair_short_pointed_widow_peak_mirrored.mpd` | `hair_short_pointed_widow_peak.mpd` | 6% | 34 | 1 filename updated |
| `Hair/hair_short_slicked_back_mirrored.mpd` | `hair_short_slicked_back.mpd` | 6% | 29 | 1 filename updated |
| `Hair/hair_short_forward_fringe_curved_mirrored.mpd` | `hair_short_forward_fringe_curved.mpd` | 5% | 36 | 1 filename updated |
| `Hair/hair_short_forward_fringe_left_right_curl_mirrored.mpd` | `hair_short_forward_fringe_left_right_curl.mpd` | 5% | 38 | 1 filename updated |
| `Legs/tall_pants_mirrored.mpd` | `tall_pants.mpd` | 71% | 4 | 1 filename updated |
| `Legs/tall_shorts_mirrored.mpd` | `tall_shorts.mpd` | 71% | 4 | 1 filename updated |
| `Legs/tall_pants_long_shoes_mirrored.mpd` | `tall_pants_long_shoes.mpd` | 63% | 6 | 1 filename updated |
| `Legs/plain_pants_mirrored.mpd` | `plain_pants.mpd` | 60% | 4 | 1 filename updated |
| `Legs/plain_shorts_mirrored.mpd` | `plain_shorts.mpd` | 60% | 4 | 1 filename updated |
| `Legs/dress_side_long_mirrored.mpd` | `dress_side_long.mpd` | 50% | 20 | 3 filename updated |
| `Legs/flat_dress_mirrored.mpd` | `flat_dress.mpd` | 50% | 6 | 1 filename updated |
| `Legs/pants_long_shoes_mirrored.mpd` | `pants_long_shoes.mpd` | 50% | 6 | 1 filename updated |
| `Legs/pants_rounded_shoes_mirrored.mpd` | `pants_rounded_shoes.mpd` | 50% | 6 | 1 filename updated |
| `Legs/checkered_skirt_mirrored.mpd` | `checkered_skirt.mpd` | 45% | 16 | 1 filename updated |
| `Legs/pants_curved_mirrored.mpd` | `pants_curved.mpd` | 43% | 8 | 1 filename updated |
| `Legs/pants_pointed_knees_mirrored.mpd` | `pants_pointed_knees.mpd` | 43% | 8 | 1 filename updated |
| `Legs/dress_stripped_mirrored.mpd` | `dress_stripped.mpd` | 33% | 12 | 1 filename updated |
| `Legs/pants_with_boots_mirrored.mpd` | `pants_with_boots.mpd` | 33% | 8 | 1 filename updated |
| `Legs/short_pants_mirrored.mpd` | `short_pants.mpd` | 33% | 4 | 1 filename updated |
| `Legs/pants_front_back_mirrored.mpd` | `pants_front_back.mpd` | 20% | 8 | 1 filename updated |
| `Legs/dress_long_back_mirrored.mpd` | `dress_long_back.mpd` | 17% | 20 | 3 filename updated |
| `Legs/pants_knees_mirrored.mpd` | `pants_knees.mpd` | 17% | 10 | 1 filename updated |
| `Legs/pants_round_knees_mirrored.mpd` | `pants_round_knees.mpd` | 17% | 10 | 1 filename updated |
| `Legs/pants_square_knees_mirrored.mpd` | `pants_square_knees.mpd` | 17% | 10 | 1 filename updated |
| `Legs/pleated_skirt_mirrored.mpd` | `pleated_skirt.mpd` | 17% | 10 | 1 filename updated |
| `Legs/long_robe_mirrored.mpd` | `long_robe.mpd` | 15% | 11 | 1 filename updated |
| `Legs/pants_checkered_mirrored.mpd` | `pants_checkered.mpd` | 11% | 16 | 1 filename updated |
| `Legs/stripe_dress_mirrored.mpd` | `stripe_dress.mpd` | 11% | 16 | 1 filename updated |
| `Legs/plain_skirt_mirrored.mpd` | `plain_skirt.mpd` | 9% | 20 | 1 filename updated |
| `Legs/pointed_dress_mirrored.mpd` | `pointed_dress.mpd` | 9% | 20 | 1 filename updated |
| `Legs/wide_skirt_mirrored.mpd` | `wide_skirt.mpd` | 9% | 20 | 1 filename updated |
| `Legs/pleated_dress_mirrored.mpd` | `pleated_dress.mpd` | 6% | 32 | 1 filename updated |
