import { BrickieChecker, type Category, type CheckReport } from "brickie-check";
import { LibraryIndex, parseDocument, resolveModel, translationOf } from "ldraw-verify";
import { readFile } from "node:fs/promises";
import { mirrorMpd } from "./mpd.js";

export interface Candidate {
  source: string;
  operation: "mirror";
  text: string;
  /** Parts whose print would be mirrored too -- see `isPatterned`. */
  patterned: string[];
  /** Deprecated aliases the generator replaced on the way through. */
  aliasesResolved: string[];
  /** Share of the source this mirror changes -- see DEFAULT_MIN_CHANGE. */
  changeRatio: number;
  report: CheckReport;
}

export type Rejection = "identical" | "trivial";

/**
 * Least share of a model the mirror must change to count as a new part.
 *
 * Measured distribution over the 199 templates: 76 mirror to something exactly
 * identical, 8 change under 5%, then 52 change 5-15%, 38 change 15-40% and 25
 * change 40% or more. There is no natural gap, so this is a judgement, not a
 * discovery -- 5% excludes the cases that differ by one or two plates while
 * keeping everything with a visibly different silhouette.
 *
 * A part can be 98% mirror-symmetric and still mirror to a technically
 * different model, which is why "is the output different?" is not on its own a
 * useful question. Legs are 98% symmetric and their median mirror changes 20%
 * of the model; Body, Head and HeadAccessory medians are 0%.
 */
export const DEFAULT_MIN_CHANGE = 0.05;

/**
 * A model's placements as a set of part-at-position keys, resolved into world
 * space and order-independent.
 *
 * World space is the whole point. An earlier version of this module judged
 * asymmetry from the raw MPD text, which is submodel-LOCAL coordinates -- a
 * part symmetric in the assembled brickie can look thoroughly asymmetric
 * inside one of its own submodels. That heuristic accepted 172 of 199 sources
 * as worth mirroring, and 60% of what it produced was an exact duplicate of
 * its input.
 */
function shape(text: string, path: string, lib: LibraryIndex): string[] {
  const model = resolveModel(parseDocument(text, path), lib);
  return model.placements.map((p) => {
    const t = translationOf(p.world);
    return `${canonical(p.partId, lib)}@${t.map((v) => Math.round(v)).join(",")}`;
  });
}

/** Share of the source's placements that the mirror moves, adds or removes. */
function changeRatio(a: string[], b: string[]): number {
  if (a.length === 0) return 0;
  const count = (xs: string[]) => xs.reduce((m, k) => m.set(k, (m.get(k) ?? 0) + 1), new Map<string, number>());
  const [ca, cb] = [count(a), count(b)];
  let diff = 0;
  for (const k of new Set([...a, ...b])) diff += Math.abs((ca.get(k) ?? 0) - (cb.get(k) ?? 0));
  return diff / a.length;
}

/**
 * A part id with any deprecated alias resolved to the part it moved to.
 *
 * Both sides of the duplicate comparison must be canonicalised or the
 * comparison measures the wrong thing. The generator rewrites `3023` to
 * `3023b` on the way through, so a mirrored part differs from its source on
 * that substitution alone -- and comparing raw ids made every candidate look
 * new. That took the yield from 77 to 118 with no extra parts in it.
 */
function canonical(partId: string, lib: LibraryIndex): string {
  const p = lib.get(partId);
  const id = p?.isAlias === true && p.movedTo !== undefined ? p.movedTo : partId;
  // `movedTo` comes from the "~Moved to 3023b" header, which carries no
  // extension, while a placement's part id does. Comparing them raw left every
  // alias-bearing source looking different from its own mirror -- Legs went
  // from 28 duplicates detected to 1, and the yield inflated from 77 to 123.
  return id.toLowerCase().replace(/\.dat$/, "");
}

export interface GenerateOptions {
  checker: BrickieChecker;
  library: LibraryIndex;
  category: Category;
  /** Defaults to DEFAULT_MIN_CHANGE. */
  minChange?: number;
}

/**
 * Mirror one source part through X=0 and score the result.
 *
 * Returns a rejection rather than a candidate when the mirror reproduces its
 * source, which happens whenever the source is already symmetric -- and the
 * corpus is 89-98% symmetric, so it is the common case rather than an edge
 * one. The test is an exact comparison of the two resolved shapes, not an
 * estimate of how asymmetric the input looked: the only question that matters
 * is whether the output is a new part, and that is directly checkable.
 *
 * Scoring is delegated to `brickie-check`, the same spec the corpus was
 * measured against. A generator marking its own homework is worth nothing.
 */
export async function generateMirror(
  path: string,
  opts: GenerateOptions,
): Promise<Candidate | { rejected: Rejection }> {
  const src = await readFile(path, "utf8");
  const { text, patterned, aliasesResolved } = mirrorMpd(src, (id) => {
    const p = opts.library.get(id);
    return p?.isAlias === true ? p.movedTo : undefined;
  });
  const ratio = changeRatio(shape(src, path, opts.library), shape(text, path, opts.library));
  if (ratio === 0) return { rejected: "identical" };
  if (ratio < (opts.minChange ?? DEFAULT_MIN_CHANGE)) return { rejected: "trivial" };
  const report = await opts.checker.checkText(text, path, opts.category);
  return { source: path, operation: "mirror", text, patterned, aliasesResolved, changeRatio: ratio, report };
}

export function isCandidate(r: Candidate | { rejected: Rejection }): r is Candidate {
  return !("rejected" in r);
}
