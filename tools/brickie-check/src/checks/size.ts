import { translationOf } from "ldraw-verify";
import { ENVELOPE_Y, PIECE_COUNTS } from "../spec.js";
import type { Check, Finding } from "../types.js";

/** How far outside the observed vertical envelope is worth remarking on, in LDU. */
const ENVELOPE_SLACK = 20;

/**
 * Piece count and vertical extent against what the corpus does for this
 * category. Both advisory: the ranges are observed, not prescribed, and a part
 * outside them is unusual rather than wrong. Head is the one worth attending
 * to -- 53 templates all landing between 21 and 35 parts is a real constraint.
 */
export const size: Check = {
  name: "size",
  asserts: "piece count and vertical extent are typical for the category",
  run({ category, placements }): Finding[] {
    const out: Finding[] = [];
    const range = PIECE_COUNTS[category];
    const n = placements.length;
    if (n < range.min || n > range.max) {
      out.push({
        check: "size",
        severity: "warn",
        message: `${n} parts; ${category} in the corpus runs ${range.min}-${range.max} (median ${range.median})`,
        evidence: { parts: n, ...range },
      });
    }
    const ys = placements.map((p) => translationOf(p.world as number[])[1] ?? 0);
    if (ys.length > 0) {
      const lo = Math.min(...ys);
      const hi = Math.max(...ys);
      const env = ENVELOPE_Y[category];
      if (lo < env.from - ENVELOPE_SLACK || hi > env.to + ENVELOPE_SLACK) {
        out.push({
          check: "size",
          severity: "warn",
          message: `occupies Y ${lo.toFixed(0)}..${hi.toFixed(0)}; ${category} in the corpus occupies ${env.from}..${env.to}`,
          evidence: { observed: [lo, hi], corpus: [env.from, env.to] },
        });
      }
    }
    return out;
  },
};
