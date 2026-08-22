import { CORE_VOCABULARY } from "../spec.js";
import type { Check, Finding } from "../types.js";

/** Share of placements that must come from the core vocabulary before it is worth remarking on. */
const CORE_SHARE_FLOOR = 0.4;

/**
 * The corpus uses 117 distinct parts and 21 of them cover 80% of placements.
 * A part built mostly from elements the corpus never uses may be perfectly
 * legal and still not look like a brickie.
 *
 * Advisory throughout. The 21-part core is a description of what the corpus
 * reaches for, not a permitted list, and a new part introducing a new element
 * is exactly what "add to our collection" means.
 */
export const vocabulary: Check = {
  name: "vocabulary",
  asserts: "the part draws mainly on the corpus's core vocabulary",
  run({ placements }): Finding[] {
    if (placements.length === 0) return [];
    const core = placements.filter((p) => CORE_VOCABULARY.has(p.partId.toLowerCase())).length;
    const share = core / placements.length;
    if (share >= CORE_SHARE_FLOOR) return [];
    const outside = [...new Set(placements.filter((p) => !CORE_VOCABULARY.has(p.partId.toLowerCase())).map((p) => p.partId))];
    return [
      {
        check: "vocabulary",
        severity: "note",
        message: `${(share * 100).toFixed(0)}% of placements come from the 21-part core vocabulary; corpus parts are typically well above ${(CORE_SHARE_FLOOR * 100).toFixed(0)}%`,
        evidence: { share, outsideCore: outside.slice(0, 12) },
      },
    ];
  },
};
