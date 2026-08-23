import { BrickieChecker, type Category, type CheckReport } from "brickie-check";
import { LibraryIndex, parseDocument, resolveModel, translationOf } from "ldraw-verify";
import { ChiralityIndex } from "./chirality.js";
import { readFile } from "node:fs/promises";
import { mirrorMpd } from "./mpd.js";

export interface Candidate {
  source: string;
  operation: "mirror";
  text: string;
  /** Parts whose print would be mirrored too -- see `isPatterned`. */
  patterned: string[];
  /** Printed parts moved to the mirrored position with the print left unflipped. */
  printsPreserved: string[];
  /** Handed parts swapped for their opposite-handed counterpart. */
  handSwapped: string[];
  /** Handed parts with no counterpart -- reflected anyway, and possibly wrong. */
  handUnresolved: string[];
  /** Share of the source this mirror changes -- see DEFAULT_MIN_CHANGE. */
  changeRatio: number;
  report: CheckReport;
}

export type Rejection = "identical" | "trivial" | "already-exists";

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
    return `${sameElement(p.partId, lib)}@${t.map((v) => Math.round(v)).join(",")}`;
  });
}

/**
 * A key that is equal for two filenames naming the same physical element.
 *
 * This corpus uses `3023.dat` in 72 templates and `3023b.dat` in 112, and they
 * are the same Plate 1x2 -- LDraw renumbered the file and both names still
 * resolve. Comparing the raw ids makes a mirror look like a new part whenever
 * the source happened to mix them, which inflated the yield by three.
 *
 * Used ONLY for this comparison. The emitted part id is whatever the source
 * had: rewriting filenames in the output fixes nothing and previously broke
 * every Legs render -- see mirrorMpd.
 */
function sameElement(partId: string, lib: LibraryIndex): string {
  const p = lib.get(partId);
  const id = p?.isAlias === true && p.movedTo !== undefined ? p.movedTo : partId;
  return id.toLowerCase().replace(/\.dat$/, "");
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
 * The shapes of every template already in a category, so a candidate can be
 * checked against the whole corpus and not just against the source it came
 * from.
 *
 * This exists because comparing a mirror only to its own source is not enough.
 * The corpus contains hand-authored left/right pairs -- `hair_short_left_sweep`
 * and `hair_short_right_sweep`, `hair_curled_bob_left_fringe` and its right
 * twin -- so mirroring one reproduces the other, which is a duplicate of a
 * DIFFERENT template and passed the source-only test cleanly. 14 of 49 outputs
 * were already in the corpus before this.
 *
 * Names would not have caught it either: `torso_open_bottom_shirt` and
 * `torso_open_top_shirt` are exact mirrors of each other and nothing in either
 * name says so.
 */
export class CorpusIndex {
  private constructor(private readonly shapes: Map<Category, Array<{ name: string; shape: string[] }>>) {}

  static async build(
    dirs: Partial<Record<Category, { dir: string; files: string[] }>>,
    lib: LibraryIndex,
    read: (path: string) => Promise<string>,
  ): Promise<CorpusIndex> {
    const shapes = new Map<Category, Array<{ name: string; shape: string[] }>>();
    for (const [cat, entry] of Object.entries(dirs) as Array<[Category, { dir: string; files: string[] }]>) {
      const list: Array<{ name: string; shape: string[] }> = [];
      for (const f of entry.files) list.push({ name: f, shape: shape(await read(`${entry.dir}/${f}`), f, lib) });
      shapes.set(cat, list);
    }
    return new CorpusIndex(shapes);
  }

  /** The closest existing template to a candidate, and how far apart they are. */
  nearest(category: Category, candidate: string[]): { name: string; ratio: number } | undefined {
    let best: { name: string; ratio: number } | undefined;
    for (const c of this.shapes.get(category) ?? []) {
      const r = changeRatio(candidate, c.shape);
      if (best === undefined || r < best.ratio) best = { name: c.name, ratio: r };
    }
    return best;
  }
}

export interface GenerateOptions {
  checker: BrickieChecker;
  library: LibraryIndex;
  category: Category;
  /** Defaults to DEFAULT_MIN_CHANGE. */
  minChange?: number;
  /** Built once per run; see ChiralityIndex. */
  chirality: ChiralityIndex;
  /** Built once per run; without it a candidate is only compared to its own source. */
  corpus?: CorpusIndex;
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
): Promise<Candidate | { rejected: Rejection; matches?: string }> {
  const src = await readFile(path, "utf8");
  const { text, patterned, printsPreserved, handSwapped, handUnresolved } = mirrorMpd(src, (id) => {
    const counterpart = opts.chirality.counterpart(opts.library, id);
    return {
      handed: opts.chirality.isHanded(opts.library, id),
      ...(counterpart !== undefined ? { counterpart } : {}),
    };
  });
  const ratio = changeRatio(shape(src, path, opts.library), shape(text, path, opts.library));
  if (ratio === 0) return { rejected: "identical" };
  if (ratio < (opts.minChange ?? DEFAULT_MIN_CHANGE)) return { rejected: "trivial" };
  // ...and against everything else in the category, because the corpus already
  // contains hand-authored left/right pairs.
  const nearest = opts.corpus?.nearest(opts.category, shape(text, path, opts.library));
  if (nearest !== undefined && nearest.ratio < (opts.minChange ?? DEFAULT_MIN_CHANGE)) {
    return { rejected: "already-exists", matches: nearest.name };
  }
  const report = await opts.checker.checkText(text, path, opts.category);
  return {
    source: path,
    operation: "mirror",
    text,
    patterned,
    printsPreserved,
    handSwapped,
    handUnresolved,
    changeRatio: ratio,
    report,
  };
}

export { ChiralityIndex } from "./chirality.js";

export function isCandidate(r: Candidate | { rejected: Rejection; matches?: string }): r is Candidate {
  return !("rejected" in r);
}
