# Mirrored brickie parts — generated output, pending review

110 parts produced by `brickie-gen mirror` from the 199 templates in
`emagineer-core`, each reflected through X=0 to give an asymmetric part the
opposite-handed twin it never had.

**These are candidates, not deliverables.** Every one passes `brickie-check`,
but two things the checker cannot see still need a human:

- **14 contain a printed element.** Reflecting the geometry reflects the
  print, and a mirrored print is not a part anyone can buy. Listed below.
- **Chirality is unhandled.** A part with distinct left and right versions
  under separate part numbers needs its counterpart substituted, not just its
  matrix reflected. Nothing detects this yet, so any part could be affected.

Regenerate rather than hand-edit:

```
cd tools/brickie-gen && npm run build
LDCAD_SHADOW_DIR=... node dist/src/cli.js mirror \
  --category Hair --out ../../generated/brickie-mirrored/Hair \
  --library ... /path/to/brickieMpdTemplates/Hair/*.mpd
```

## What "% changed" means

The share of the source's placements the mirror moves, adds or removes. A part
can be 98% mirror-symmetric and still mirror to a technically different model,
so the raw fact of difference says little — anything under 5% is rejected as
too similar to be a new part and does not appear here.

| category | parts |
|---|---|
| Hair | 54 |
| Head | 19 |
| Legs | 28 |
| Body | 9 |

## Needs a print review

| part | printed elements |
|---|---|
| `Head/head_full_long_beard_a_mirrored.mpd` | `98138pz0.dat` |
| `Head/head_full_long_beard_round_glasses_a_mirrored.mpd` | `98138pz0.dat` |
| `Head/head_full_long_beard_square_glasses_a_mirrored.mpd` | `98138pz0.dat` |
| `Head/head_long_beard_a_mirrored.mpd` | `98138pz0.dat` |
| `Head/head_long_beard_moustache_a_mirrored.mpd` | `98138pz0.dat` |
| `Head/head_long_beard_moustache_round_glasses_a_mirrored.mpd` | `98138pz0.dat` |
| `Head/head_long_beard_moustache_square_glasses_a_mirrored.mpd` | `98138pz0.dat` |
| `Head/head_long_beard_round_glasses_a_mirrored.mpd` | `98138pz0.dat` |
| `Head/head_long_beard_rounded_moustache_a_mirrored.mpd` | `98138pz0.dat` |
| `Head/head_long_beard_rounded_moustache_round_glasses_a_mirrored.mpd` | `98138pz0.dat` |
| `Head/head_long_beard_rounded_moustache_square_glasses_a_mirrored.mpd` | `98138pz0.dat` |
| `Head/head_long_beard_square_glasses_a_mirrored.mpd` | `98138pz0.dat` |
| `Head/head_short_beard_a_mirrored.mpd` | `98138pz0.dat` |
| `Head/head_short_beard_round_glasses_a_mirrored.mpd` | `98138pz0.dat` |

## All parts

| part | source | % changed | parts | notes |
|---|---|---|---|---|
| `Body/torso_buttons_right_mirrored.mpd` | `torso_buttons_right.mpd` | 50% | 32 | 1 advisory |
| `Body/torso_shirt_long_tie_mirrored.mpd` | `torso_shirt_long_tie.mpd` | 19% | 31 | — |
| `Body/torso_blouse_collar_mirrored.mpd` | `torso_blouse_collar.mpd` | 14% | 28 | — |
| `Body/torso_open_shirt_vest_mirrored.mpd` | `torso_open_shirt_vest.mpd` | 13% | 32 | — |
| `Body/torso_shirt_vest_mirrored.mpd` | `torso_shirt_vest.mpd` | 12% | 34 | — |
| `Body/torso_shirt_vest_bowtie_mirrored.mpd` | `torso_shirt_vest_bowtie.mpd` | 12% | 34 | — |
| `Body/torso_checkered_mirrored.mpd` | `torso_checkered.mpd` | 11% | 71 | — |
| `Body/torso_open_bottom_shirt_mirrored.mpd` | `torso_open_bottom_shirt.mpd` | 7% | 28 | 2 alias resolved |
| `Body/torso_open_top_shirt_mirrored.mpd` | `torso_open_top_shirt.mpd` | 7% | 28 | 2 alias resolved |
| `Hair/hair_left_part_sweep_left_mirrored.mpd` | `hair_left_part_sweep_left.mpd` | 102% | 39 | 1 alias resolved, 1 advisory |
| `Hair/hair_left_part_sweep_right_mirrored.mpd` | `hair_left_part_sweep_right.mpd` | 102% | 39 | 1 alias resolved, 1 advisory |
| `Hair/hair_left_swept_back_mirrored.mpd` | `hair_left_swept_back.mpd` | 81% | 55 | 1 alias resolved, 1 advisory |
| `Hair/hair_right_swept_back_mirrored.mpd` | `hair_right_swept_back.mpd` | 81% | 55 | 1 alias resolved, 1 advisory |
| `Hair/hair_short_slick_back_left_high_mirrored.mpd` | `hair_short_slick_back_left_high.mpd` | 76% | 56 | 1 alias resolved, 1 advisory |
| `Hair/hair_short_left_sweep_mirrored.mpd` | `hair_short_left_sweep.mpd` | 56% | 30 | 1 alias resolved |
| `Hair/hair_short_right_sweep_mirrored.mpd` | `hair_short_right_sweep.mpd` | 56% | 30 | 1 alias resolved |
| `Hair/hair_short_forward_fringe_left_mirrored.mpd` | `hair_short_forward_fringe_left.mpd` | 49% | 43 | 1 alias resolved |
| `Hair/hair_short_forward_fringe_right_mirrored.mpd` | `hair_short_forward_fringe_right.mpd` | 49% | 43 | 1 alias resolved |
| `Hair/hair_wide_curved_back_both_sides_left_sweep_mirrored.mpd` | `hair_wide_curved_back_both_sides_left_sweep.mpd` | 41% | 57 | 1 alias resolved |
| `Hair/hair_wide_curved_back_both_sides_right_sweep_mirrored.mpd` | `hair_wide_curved_back_both_sides_right_sweep.mpd` | 41% | 57 | 1 alias resolved |
| `Hair/hair_curled_bob_left_fringe_mirrored.mpd` | `hair_curled_bob_left_fringe.mpd` | 36% | 57 | 1 alias resolved |
| `Hair/hair_curled_bob_right_fringe_mirrored.mpd` | `hair_curled_bob_right_fringe.mpd` | 36% | 57 | 1 alias resolved |
| `Hair/hair_short_cowlick_mid_mirrored.mpd` | `hair_short_cowlick_mid.mpd` | 30% | 31 | 1 alias resolved |
| `Hair/hair_neat_short_bob_mirrored.mpd` | `hair_neat_short_bob.mpd` | 26% | 31 | — |
| `Hair/hair_bob_angle_fringe_mirrored.mpd` | `hair_bob_angle_fringe.mpd` | 24% | 34 | — |
| `Hair/hair_curled_bob_left_no_fringe_mirrored.mpd` | `hair_curled_bob_left_no_fringe.mpd` | 22% | 54 | — |
| `Hair/hair_curled_bob_right_no_fringe_mirrored.mpd` | `hair_curled_bob_right_no_fringe.mpd` | 22% | 54 | — |
| `Hair/hair_long_bob_fringe_left_mirrored.mpd` | `hair_long_bob_fringe_left.mpd` | 22% | 57 | 1 alias resolved |
| `Hair/hair_short_left_swept_fringe_mirrored.mpd` | `hair_short_left_swept_fringe.mpd` | 22% | 43 | 1 alias resolved |
| `Hair/hair_short_mid_swept_fringe_mirrored.mpd` | `hair_short_mid_swept_fringe.mpd` | 22% | 43 | 1 alias resolved |
| `Hair/hair_short_tight_swept_fringe_mirrored.mpd` | `hair_short_tight_swept_fringe.mpd` | 22% | 43 | 1 alias resolved |
| `Hair/hair_curled_bob_left_low_fringe_mirrored.mpd` | `hair_curled_bob_left_low_fringe.mpd` | 21% | 58 | — |
| `Hair/hair_curled_bob_right_low_fringe_mirrored.mpd` | `hair_curled_bob_right_low_fringe.mpd` | 21% | 58 | — |
| `Hair/hair_short_curved_widow_peak_mirrored.mpd` | `hair_short_curved_widow_peak.mpd` | 21% | 45 | 1 alias resolved |
| `Hair/hair_short_curved_widow_peak_fringe_mirrored.mpd` | `hair_short_curved_widow_peak_fringe.mpd` | 21% | 45 | 1 alias resolved |
| `Hair/hair_short_forward_fringe_left_curl_mirrored.mpd` | `hair_short_forward_fringe_left_curl.mpd` | 21% | 37 | 1 alias resolved |
| `Hair/hair_short_forward_fringe_midcurl_mirrored.mpd` | `hair_short_forward_fringe_midcurl.mpd` | 21% | 37 | 1 alias resolved |
| `Hair/hair_short_forward_fringe_right_curl_mirrored.mpd` | `hair_short_forward_fringe_right_curl.mpd` | 21% | 37 | 1 alias resolved |
| `Hair/hair_curled_bob_middle_low_fringe_mirrored.mpd` | `hair_curled_bob_middle_low_fringe.mpd` | 20% | 61 | — |
| `Hair/hair_curled_bob_middle_big_fringe_mirrored.mpd` | `hair_curled_bob_middle_big_fringe.mpd` | 18% | 65 | — |
| `Hair/hair_long_bob_low_fringe_left_mirrored.mpd` | `hair_long_bob_low_fringe_left.mpd` | 17% | 59 | — |
| `Hair/hair_long_bob_fringe_right_mirrored.mpd` | `hair_long_bob_fringe_right.mpd` | 16% | 57 | 1 alias resolved |
| `Hair/hair_long_bob_mirrored.mpd` | `hair_long_bob.mpd` | 15% | 55 | — |
| `Hair/hair_mid_back_bun_mirrored.mpd` | `hair_mid_back_bun.mpd` | 15% | 53 | — |
| `Hair/hair_long_bob_wavey_mirrored.mpd` | `hair_long_bob_wavey.mpd` | 14% | 83 | — |
| `Hair/hair_long_bob_wavey_slight_curl_mirrored.mpd` | `hair_long_bob_wavey_slight_curl.mpd` | 14% | 85 | — |
| `Hair/hair_bald_mirrored.mpd` | `hair_bald.mpd` | 13% | 14 | 1 alias resolved, 2 advisory |
| `Hair/hair_short_slick_back_mid_high_mirrored.mpd` | `hair_short_slick_back_mid_high.mpd` | 13% | 58 | 1 alias resolved |
| `Hair/hair_very_long_bob_wavey_mirrored.mpd` | `hair_very_long_bob_wavey.mpd` | 13% | 92 | — |
| `Hair/hair_mullet_mirrored.mpd` | `hair_mullet.mpd` | 11% | 68 | 1 alias resolved |
| `Hair/hair_curly_mirrored.mpd` | `hair_curly.mpd` | 8% | 95 | 1 alias resolved, 1 advisory |
| `Hair/hair_long_bob_flowers_mirrored.mpd` | `hair_long_bob_flowers.mpd` | 7% | 59 | — |
| `Hair/hair_short_mirrored.mpd` | `hair_short.mpd` | 7% | 27 | 1 alias resolved |
| `Hair/hair_short_both_sides_mirrored.mpd` | `hair_short_both_sides.mpd` | 7% | 27 | 1 alias resolved |
| `Hair/hair_short_forward_fringe_mirrored.mpd` | `hair_short_forward_fringe.mpd` | 7% | 27 | 1 alias resolved |
| `Hair/hair_short_slicked_back_no_sideburns_mirrored.mpd` | `hair_short_slicked_back_no_sideburns.mpd` | 7% | 25 | 1 alias resolved |
| `Hair/hair_long_fringe_mirrored.mpd` | `hair_long_fringe.mpd` | 6% | 32 | 1 alias resolved |
| `Hair/hair_mohawk_mirrored.mpd` | `hair_mohawk.mpd` | 6% | 32 | 1 alias resolved |
| `Hair/hair_short_flattop_mirrored.mpd` | `hair_short_flattop.mpd` | 6% | 29 | 1 alias resolved |
| `Hair/hair_short_pointed_widow_peak_mirrored.mpd` | `hair_short_pointed_widow_peak.mpd` | 6% | 34 | 1 alias resolved |
| `Hair/hair_short_slicked_back_mirrored.mpd` | `hair_short_slicked_back.mpd` | 6% | 29 | 1 alias resolved |
| `Hair/hair_short_forward_fringe_curved_mirrored.mpd` | `hair_short_forward_fringe_curved.mpd` | 5% | 36 | 1 alias resolved |
| `Hair/hair_short_forward_fringe_left_right_curl_mirrored.mpd` | `hair_short_forward_fringe_left_right_curl.mpd` | 5% | 38 | 1 alias resolved |
| `Head/head_short_beard_a_mirrored.mpd` | `head_short_beard_a.mpd` | 16% | 25 | printed element |
| `Head/head_full_long_beard_a_mirrored.mpd` | `head_full_long_beard_a.mpd` | 15% | 26 | printed element |
| `Head/head_long_beard_moustache_a_mirrored.mpd` | `head_long_beard_moustache_a.mpd` | 14% | 29 | printed element |
| `Head/head_short_beard_round_glasses_a_mirrored.mpd` | `head_short_beard_round_glasses_a.mpd` | 14% | 29 | printed element |
| `Head/head_short_beard_small_glasses_a_mirrored.mpd` | `head_short_beard_small_glasses_a.mpd` | 14% | 29 | — |
| `Head/head_full_long_beard_round_glasses_a_mirrored.mpd` | `head_full_long_beard_round_glasses_a.mpd` | 13% | 30 | printed element |
| `Head/head_full_long_beard_small_glasses_a_mirrored.mpd` | `head_full_long_beard_small_glasses_a.mpd` | 13% | 30 | — |
| `Head/head_full_long_beard_square_glasses_a_mirrored.mpd` | `head_full_long_beard_square_glasses_a.mpd` | 13% | 30 | printed element |
| `Head/head_long_beard_a_mirrored.mpd` | `head_long_beard_a.mpd` | 13% | 30 | printed element |
| `Head/head_long_beard_rounded_moustache_a_mirrored.mpd` | `head_long_beard_rounded_moustache_a.mpd` | 13% | 30 | printed element |
| `Head/head_long_beard_rounded_moustache_round_glasses_a_mirrored.mpd` | `head_long_beard_rounded_moustache_round_glasses_a.mpd` | 13% | 32 | printed element |
| `Head/head_long_beard_rounded_moustache_square_glasses_a_mirrored.mpd` | `head_long_beard_rounded_moustache_square_glasses_a.mpd` | 13% | 32 | printed element |
| `Head/head_long_beard_moustache_round_glasses_a_mirrored.mpd` | `head_long_beard_moustache_round_glasses_a.mpd` | 12% | 33 | printed element |
| `Head/head_long_beard_moustache_small_glasses_a_mirrored.mpd` | `head_long_beard_moustache_small_glasses_a.mpd` | 12% | 33 | — |
| `Head/head_long_beard_moustache_square_glasses_a_mirrored.mpd` | `head_long_beard_moustache_square_glasses_a.mpd` | 12% | 33 | printed element |
| `Head/head_long_beard_round_glasses_a_mirrored.mpd` | `head_long_beard_round_glasses_a.mpd` | 12% | 34 | printed element |
| `Head/head_long_beard_square_glasses_a_mirrored.mpd` | `head_long_beard_square_glasses_a.mpd` | 12% | 34 | printed element |
| `Head/head_long_beard_rounded_moustache_small_glasses_a_mirrored.mpd` | `head_long_beard_rounded_moustache_small_glasses_a.mpd` | 11% | 35 | — |
| `Head/head_long_beard_small_glasses_a_mirrored.mpd` | `head_long_beard_small_glasses_a.mpd` | 11% | 35 | — |
| `Legs/tall_pants_mirrored.mpd` | `tall_pants.mpd` | 71% | 4 | 1 alias resolved, 1 advisory |
| `Legs/tall_shorts_mirrored.mpd` | `tall_shorts.mpd` | 71% | 4 | 1 alias resolved, 1 advisory |
| `Legs/tall_pants_long_shoes_mirrored.mpd` | `tall_pants_long_shoes.mpd` | 63% | 6 | 1 alias resolved |
| `Legs/plain_pants_mirrored.mpd` | `plain_pants.mpd` | 60% | 4 | 1 alias resolved, 1 advisory |
| `Legs/plain_shorts_mirrored.mpd` | `plain_shorts.mpd` | 60% | 4 | 1 alias resolved, 1 advisory |
| `Legs/dress_side_long_mirrored.mpd` | `dress_side_long.mpd` | 50% | 20 | 3 alias resolved, 1 advisory |
| `Legs/flat_dress_mirrored.mpd` | `flat_dress.mpd` | 50% | 6 | 1 alias resolved |
| `Legs/pants_long_shoes_mirrored.mpd` | `pants_long_shoes.mpd` | 50% | 6 | 1 alias resolved |
| `Legs/pants_rounded_shoes_mirrored.mpd` | `pants_rounded_shoes.mpd` | 50% | 6 | 1 alias resolved |
| `Legs/checkered_skirt_mirrored.mpd` | `checkered_skirt.mpd` | 45% | 16 | 1 alias resolved, 1 advisory |
| `Legs/pants_curved_mirrored.mpd` | `pants_curved.mpd` | 43% | 8 | 1 alias resolved, 1 advisory |
| `Legs/pants_pointed_knees_mirrored.mpd` | `pants_pointed_knees.mpd` | 43% | 8 | 1 alias resolved |
| `Legs/dress_stripped_mirrored.mpd` | `dress_stripped.mpd` | 33% | 12 | 1 alias resolved |
| `Legs/pants_with_boots_mirrored.mpd` | `pants_with_boots.mpd` | 33% | 8 | 1 alias resolved |
| `Legs/short_pants_mirrored.mpd` | `short_pants.mpd` | 33% | 4 | 1 alias resolved, 1 advisory |
| `Legs/pants_front_back_mirrored.mpd` | `pants_front_back.mpd` | 20% | 8 | 1 alias resolved |
| `Legs/dress_long_back_mirrored.mpd` | `dress_long_back.mpd` | 17% | 20 | 3 alias resolved |
| `Legs/pants_knees_mirrored.mpd` | `pants_knees.mpd` | 17% | 10 | 1 alias resolved |
| `Legs/pants_round_knees_mirrored.mpd` | `pants_round_knees.mpd` | 17% | 10 | 1 alias resolved |
| `Legs/pants_square_knees_mirrored.mpd` | `pants_square_knees.mpd` | 17% | 10 | 1 alias resolved |
| `Legs/pleated_skirt_mirrored.mpd` | `pleated_skirt.mpd` | 17% | 10 | 1 alias resolved, 1 advisory |
| `Legs/long_robe_mirrored.mpd` | `long_robe.mpd` | 15% | 11 | 1 alias resolved |
| `Legs/pants_checkered_mirrored.mpd` | `pants_checkered.mpd` | 11% | 16 | 1 alias resolved |
| `Legs/stripe_dress_mirrored.mpd` | `stripe_dress.mpd` | 11% | 16 | 1 alias resolved |
| `Legs/plain_skirt_mirrored.mpd` | `plain_skirt.mpd` | 9% | 20 | 1 alias resolved |
| `Legs/pointed_dress_mirrored.mpd` | `pointed_dress.mpd` | 9% | 20 | 1 alias resolved, 1 advisory |
| `Legs/wide_skirt_mirrored.mpd` | `wide_skirt.mpd` | 9% | 20 | 1 alias resolved, 1 advisory |
| `Legs/pleated_dress_mirrored.mpd` | `pleated_dress.mpd` | 6% | 32 | 1 alias resolved, 1 advisory |
