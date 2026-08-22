import {
  LibraryIndex,
  applyDir,
  applyPoint,
  collectSnapMetas,
  metasToHotspots,
  openShadowLibrary,
  parseDocument,
  resolveModel,
} from "ldraw-verify";
import { readFile } from "node:fs/promises";
import { deprecated } from "./checks/deprecated.js";
import { interfaceContract } from "./checks/interfaceContract.js";
import { orientation } from "./checks/orientation.js";
import { orthogonal } from "./checks/orthogonal.js";
import { size } from "./checks/size.js";
import { symmetry } from "./checks/symmetry.js";
import { vocabulary } from "./checks/vocabulary.js";
import type { Category } from "./spec.js";
import type { Check, CheckContext, CheckReport } from "./types.js";

/** A System stud, by its shadow-library radius. */
const STUD_RADIUS = 6;
const STUD_RADIUS_TOL = 0.5;

export const ALL_CHECKS: Check[] = [orthogonal, deprecated, interfaceContract, symmetry, orientation, size, vocabulary];

export interface CheckerOptions {
  libraryRoot: string;
  shadowDir?: string;
}

/**
 * Loads the parts library and shadow library once and checks many parts
 * against them.
 *
 * Built as a reusable object rather than a per-file function for the same
 * reason ldraw-verify's Verifier is: the reference-closure cache is keyed on
 * the library instances, so a fresh pair per part throws it away. Checking the
 * whole 199-template corpus is the normal case here, not the exception.
 */
export class BrickieChecker {
  private constructor(
    private readonly library: LibraryIndex,
    private readonly shadow: ReturnType<typeof openShadowLibrary> | undefined,
  ) {}

  static async create(opts: CheckerOptions): Promise<BrickieChecker> {
    const library = await LibraryIndex.fromDirectory(opts.libraryRoot);
    return new BrickieChecker(library, opts.shadowDir ? openShadowLibrary(opts.shadowDir) : undefined);
  }

  async checkFile(path: string, category: Category): Promise<CheckReport> {
    return this.checkText(await readFile(path, "utf8"), path, category);
  }

  async checkText(text: string, path: string, category: Category): Promise<CheckReport> {
    const model = resolveModel(parseDocument(text, path), this.library);
    const studPlanes = new Set<number>();
    const antiStudPlanes = new Set<number>();
    if (this.shadow) {
      for (const p of model.placements) {
        const hotspots = metasToHotspots((await collectSnapMetas(p.partId, this.library, this.shadow)).metas);
        for (const h of hotspots) {
          if (h.radius === undefined || Math.abs(h.radius - STUD_RADIUS) > STUD_RADIUS_TOL) continue;
          // Only connectors facing up or down define a horizontal interface
          // plane; a sideways stud joins its neighbour on a vertical face.
          const axis = applyDir(p.world, h.axis);
          if (Math.abs(Math.abs(axis[1] ?? 0) - 1) > 0.01) continue;
          const y = Math.round(applyPoint(p.world, h.pos)[1] ?? 0);
          (h.gender === "male" ? studPlanes : antiStudPlanes).add(y);
        }
      }
    }

    const ctx: CheckContext = {
      category,
      placements: model.placements.map((p) => ({ index: p.index, partId: p.partId, world: p.world })),
      studPlanes,
      antiStudPlanes,
      isAlias: (partId) => this.library.get(partId)?.isAlias === true,
    };

    const findings = ALL_CHECKS.flatMap((c) => c.run(ctx));
    return {
      category,
      parts: model.placements.length,
      findings,
      passed: !findings.some((f) => f.severity === "fail"),
    };
  }
}
