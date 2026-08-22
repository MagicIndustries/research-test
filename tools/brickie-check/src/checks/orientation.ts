import { applyDir } from "ldraw-verify";
import { STUDS_UP_RATIO, STUDS_UP_TOLERANCE } from "../spec.js";
import type { Check, Finding } from "../types.js";

/**
 * SNOT is the dominant technique and its share rises up the figure: studs
 * point up in 81% of Legs placements, 73% of Body, 58% of Head, 28% of Hair.
 * A hair piece built like a pair of legs would satisfy every other check here
 * and still be the wrong kind of object.
 *
 * The tolerance is wide (+/- 0.3) on purpose. These are whole-category
 * distributions and one part may legitimately sit well off the mean.
 */
export const orientation: Check = {
  name: "orientation",
  asserts: "the mix of upright and sideways building suits the category",
  run({ category, placements }): Finding[] {
    if (placements.length < 6) return [];
    const up = placements.filter((p) => {
      const d = applyDir(p.world as number[], [0, -1, 0]);
      return (d[1] ?? 0) < -0.99;
    }).length;
    const ratio = up / placements.length;
    const expected = STUDS_UP_RATIO[category];
    if (Math.abs(ratio - expected) <= STUDS_UP_TOLERANCE) return [];
    const tooUpright = ratio > expected;
    return [
      {
        check: "orientation",
        severity: "warn",
        message: `${(ratio * 100).toFixed(0)}% of placements are studs-up; ${category} averages ${(expected * 100).toFixed(0)}% — this is built ${tooUpright ? "more uprightly" : "more sideways"} than the category`,
        evidence: { ratio, expected, tolerance: STUDS_UP_TOLERANCE },
      },
    ];
  },
};
