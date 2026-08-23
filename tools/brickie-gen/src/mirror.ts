/**
 * Reflection of an LDraw model through the X=0 plane.
 *
 * Brickies are 89-98% mirror-symmetric, which means the parts worth mirroring
 * are precisely the ones that are NOT: a side-swept fringe, an asymmetric
 * collar. Those have no opposite-handed twin in the corpus, and reflecting one
 * produces a genuinely new part rather than a duplicate.
 */

/** A type-1 line's 12 numbers: x y z then the row-major 3x3. */
export interface Placement {
  colour: number;
  x: number;
  y: number;
  z: number;
  /** a b c d e f g h i, row-major. */
  m: number[];
  part: string;
}

/**
 * How a placement should be reflected, and why.
 *
 * - `reflect` — position and orientation both mirrored. The ordinary case.
 * - `move-only` — position mirrored, orientation left alone. For a PRINTED
 *   part: the element belongs at the mirrored location, but reflecting its
 *   orientation reflects the print with it, and a mirrored print is not a part
 *   anyone can buy. The print must read the same way it did.
 * - `substitute` — position and orientation mirrored AND the part swapped for
 *   its opposite-handed counterpart, which is a different element under a
 *   different number.
 */
export type MirrorMode = "reflect" | "move-only" | "substitute";

/**
 * Reflect a placement through X=0.
 *
 * The position is trivial. The orientation is `M·R·M` with `M = diag(-1,1,1)`,
 * which negates exactly those entries whose row or column is the X axis, but
 * not both: b, c, d, g. Doing only the position -- the obvious mistake --
 * mirrors where each part sits while leaving every part facing its original
 * way, which reads as correct in a thumbnail and is wrong everywhere it
 * matters.
 *
 * The result has determinant -1. That is a genuine reflection, not a defect:
 * LDraw permits it and `E-01` tests |det| and orthonormality, both of which a
 * reflection satisfies.
 */
export function mirrorPlacement(p: Placement, mode: MirrorMode = "reflect"): Placement {
  // A printed element moves to the mirrored position and keeps facing the way
  // it faced. Reflecting the orientation would reflect the print.
  if (mode === "move-only") return { ...p, x: neg(p.x) };
  const [a, b, c, d, e, f, g, h, i] = p.m as [number, number, number, number, number, number, number, number, number];
  return { ...p, x: neg(p.x), m: [a, neg(b), neg(c), neg(d), e, f, neg(g), h, i] };
}

/**
 * Negation that never yields `-0`. Most entries of an axis-aligned rotation
 * are zero, and `-0` is both meaningless in an LDraw file and a nuisance
 * downstream: it prints as `-0`, and it is not `===` to `0`, so any code
 * comparing matrices sees a difference that is not there.
 */
function neg(v: number): number {
  return v === 0 ? 0 : -v;
}

/**
 * Parts whose appearance is not mirror-safe: anything with a printed or
 * moulded pattern. Reflecting the geometry reflects the print, and a mirrored
 * print is not a part anyone can buy.
 *
 * LDraw's naming carries this: a pattern suffix is `p` or `pz`/`pr` followed
 * by an identifier, e.g. `98138pz0`. Detecting it by name is exactly the sort
 * of thing issue #8 in ldraw-verify warns about, so this is a conservative
 * filter -- it flags candidates for review, it does not decide.
 */
export function isPatterned(partId: string): boolean {
  return /p[a-z]*\d/i.test(partId.replace(/\.dat$/i, "").replace(/^\d+/, ""));
}
