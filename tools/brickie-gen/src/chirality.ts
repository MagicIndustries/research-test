import type { LibraryIndex } from "ldraw-verify";

const HAND = /\b(left|right)\b/i;
const normalise = (d: string): string => d.trim().replace(/\s+/g, " ").toLowerCase();
const swapHand = (d: string): string => d.replace(/\b(left|right)\b/gi, (m) => (/left/i.test(m) ? "Right" : "Left"));

/**
 * Finds the opposite-handed version of a part.
 *
 * Some elements exist as a left/right pair under separate part numbers -- a
 * Wing 2x4 Right is 41769a and its mirror is 41770a, a different part, not the
 * same part reflected. Reflecting the matrix alone produces a shape that no
 * element matches: it renders as the correct silhouette and cannot be built.
 *
 * The counterpart is found by swapping "Left" and "Right" in the description
 * and looking for a part with the result. Measured over the placeable library:
 * 2,235 parts name a hand and 1,936 of them (87%) have a counterpart found this
 * way. The remaining 299 are mostly minifig limbs and figure torsos with no
 * opposite-handed element at all.
 *
 * This is name matching, which `ldraw-verify` issue #8 warns about for good
 * reason -- so it is used only to FIND a substitution, never to decide that one
 * is unnecessary. A handed part with no counterpart is reported, not assumed
 * safe.
 */
export class ChiralityIndex {
  private constructor(private readonly byDescription: Map<string, string>) {}

  static build(lib: LibraryIndex): ChiralityIndex {
    const byDescription = new Map<string, string>();
    for (const p of lib.all()) {
      if (p.isPrimitive || p.isAlias || p.isHidden) continue;
      byDescription.set(normalise(p.description), p.id);
    }
    return new ChiralityIndex(byDescription);
  }

  /** True when the part's description names a hand, so reflecting it needs care. */
  isHanded(lib: LibraryIndex, partId: string): boolean {
    const d = lib.get(partId)?.description;
    return d !== undefined && HAND.test(d);
  }

  /** The opposite-handed part id, or undefined if the library has none. */
  counterpart(lib: LibraryIndex, partId: string): string | undefined {
    const d = lib.get(partId)?.description;
    if (d === undefined || !HAND.test(d)) return undefined;
    const other = this.byDescription.get(normalise(swapHand(d)));
    return other !== undefined && other.toLowerCase() !== partId.toLowerCase() ? other : undefined;
  }
}
