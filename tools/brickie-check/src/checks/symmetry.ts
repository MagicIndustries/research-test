import { translationOf } from "ldraw-verify";
import { CENTRE_LINE_EPS, MIRROR_EPS, MIRROR_SYMMETRY } from "../spec.js";
import type { Check, Finding } from "../types.js";

/**
 * Brickies are mirror-symmetric about X=0 -- 96-98% of off-centre parts have a
 * partner, Hair lowest at 89%. A generator should build one half and reflect
 * it, treating asymmetry as a deliberate exception.
 *
 * Reported as a warning, not a failure. Hair genuinely runs asymmetric (side
 * partings, swept fringes) and the corpus itself never reaches 100%, so a
 * hard gate here would reject hand-authored work.
 */
export const symmetry: Check = {
  name: "symmetry",
  asserts: "off-centre parts have a mirror partner across X=0",
  run({ placements, category }): Finding[] {
    const pts = placements.map((p) => ({ id: p.partId, t: translationOf(p.world as number[]) }));
    const offCentre = pts.filter((p) => Math.abs(p.t[0] ?? 0) >= CENTRE_LINE_EPS);
    if (offCentre.length === 0) return [];
    const paired = offCentre.filter((p) =>
      pts.some(
        (q) =>
          q.id === p.id &&
          Math.abs((q.t[0] ?? 0) + (p.t[0] ?? 0)) < MIRROR_EPS &&
          Math.abs((q.t[1] ?? 0) - (p.t[1] ?? 0)) < MIRROR_EPS &&
          Math.abs((q.t[2] ?? 0) - (p.t[2] ?? 0)) < MIRROR_EPS,
      ),
    ).length;
    const ratio = paired / offCentre.length;
    const expected = MIRROR_SYMMETRY[category];
    // Allow a generous margin below the category mean: this is one part
    // against a whole-corpus statistic.
    if (ratio >= expected - 0.25) return [];
    return [
      {
        check: "symmetry",
        severity: "warn",
        message: `only ${(ratio * 100).toFixed(0)}% of off-centre parts have a mirror partner; ${category} averages ${(expected * 100).toFixed(0)}% in the corpus`,
        evidence: { ratio, expected, offCentre: offCentre.length, paired },
      },
    ];
  },
};
