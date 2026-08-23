import type { Check, Finding } from "../types.js";

/**
 * `~Moved to` is an LDraw FILENAME redirect, not a statement about the part.
 * 3023 redirects to 3023b and 3023 is Plate 1x2, one of the most-produced
 * elements ever made; there are 1,159 such redirects in the current library,
 * covering parts in everyday production.
 *
 * So this is reference hygiene and nothing more. It was a `fail` on the
 * strength of the word "deprecated" in its old name, which was wrong twice
 * over: it is not a defect in the part, and treating it as one made 78 corpus
 * templates fail for something that changes nothing about what gets built.
 * Downgraded to a note.
 *
 * It says nothing about whether an element is still manufactured. That is a
 * separate axis, unanswerable from LDraw, and deliberately NOT checked here:
 * a builder who owns a retired element can use it. See emagineer-core #62.
 */
export const supersededFilename: Check = {
  name: "superseded-filename",
  asserts: "part references use the current LDraw filename",
  run({ placements, isAlias }): Finding[] {
    const bad = [...new Set(placements.filter((p) => isAlias(p.partId)).map((p) => p.partId))];
    if (bad.length === 0) return [];
    return [
      {
        check: "superseded-filename",
        severity: "note",
        message: `uses ${bad.length} superseded LDraw filename${bad.length === 1 ? "" : "s"}: ${bad.join(", ")} — the geometry is unaffected, but the redirect is a courtesy the library may drop`,
        evidence: { superseded: bad },
      },
    ];
  },
};
