import type { Check, Finding } from "../types.js";

/**
 * The corpus itself references five deprecated aliases across 220 placements,
 * 208 of them a single part (3023 -> 3023b). A newly authored part has no
 * excuse for adding more: an alias resolves today and will stop resolving when
 * the LDraw library drops it.
 */
export const deprecated: Check = {
  name: "deprecated",
  asserts: "no part reference is a deprecated ~Moved to alias",
  run({ placements, isAlias }): Finding[] {
    const bad = [...new Set(placements.filter((p) => isAlias(p.partId)).map((p) => p.partId))];
    if (bad.length === 0) return [];
    return [
      {
        check: "deprecated",
        severity: "fail",
        message: `references ${bad.length} deprecated part alias${bad.length === 1 ? "" : "es"}: ${bad.join(", ")}`,
        evidence: { aliases: bad },
      },
    ];
  },
};
