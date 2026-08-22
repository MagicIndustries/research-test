import { isAxisAligned, AXIS_ALIGNED_ENTRY_EPS } from "ldraw-verify";
import type { Check, Finding } from "../types.js";

/**
 * Oblique placement is vanishingly rare in the corpus: 15 placements out of
 * 6,748 (0.2%), spread across 4 templates of 199. Per-category rounding in the
 * first measurement reported this as "100% axis-aligned", which was wrong --
 * running this check over the corpus is what surfaced the four.
 *
 * Kept as a `fail` rather than a warning even so. For a GENERATED part an
 * oblique placement is almost certainly a mistake, and the four hand-authored
 * exceptions (`pants_triangle_knees`, `head_lips_a`, `hair_high_back_bun_small`,
 * `hat_long_brim_floral`) are few enough to review individually.
 */
export const orthogonal: Check = {
  name: "orthogonal",
  asserts: "no part is set at an oblique angle",
  run({ placements }): Finding[] {
    const oblique = placements.filter((p) => !isAxisAligned(p.world as number[], AXIS_ALIGNED_ENTRY_EPS));
    if (oblique.length === 0) return [];
    return [
      {
        check: "orthogonal",
        severity: "fail",
        message: `${oblique.length} of ${placements.length} placements are at an oblique angle; only 0.2% of corpus placements are (15 of 6,748, in 4 templates of 199)`,
        evidence: { oblique: oblique.slice(0, 8).map((p) => ({ index: p.index, partId: p.partId })) },
      },
    ];
  },
};
