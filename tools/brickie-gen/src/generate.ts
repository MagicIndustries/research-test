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
  report: CheckReport;
}

export type Rejection = "duplicate";

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
function shapeKey(text: string, path: string, lib: LibraryIndex): string {
  const model = resolveModel(parseDocument(text, path), lib);
  return model.placements
    .map((p) => {
      const t = translationOf(p.world);
      return `${p.partId}@${t.map((v) => Math.round(v)).join(",")}`;
    })
    .sort()
    .join("|");
}

export interface GenerateOptions {
  checker: BrickieChecker;
  library: LibraryIndex;
  category: Category;
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
  const { text, patterned } = mirrorMpd(src);
  if (shapeKey(text, path, opts.library) === shapeKey(src, path, opts.library)) {
    return { rejected: "duplicate" };
  }
  const report = await opts.checker.checkText(text, path, opts.category);
  return { source: path, operation: "mirror", text, patterned, report };
}

export function isCandidate(r: Candidate | { rejected: Rejection }): r is Candidate {
  return !("rejected" in r);
}
