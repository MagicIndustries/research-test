import type { Category } from "./spec.js";

/**
 * How much a finding should weigh. Deliberately three levels, not the
 * verifier's tier vocabulary: this checker asks a different question ("is this
 * a brickie part?") and borrowing HARD/DISCOURAGED would imply the answers
 * mean the same thing.
 */
export type Severity = "fail" | "warn" | "note";

export interface Finding {
  check: string;
  severity: Severity;
  message: string;
  /** Numbers behind the claim, so a caller can re-judge without re-running. */
  evidence?: Record<string, unknown>;
}

export interface CheckContext {
  category: Category;
  /** Placement world matrices and part ids, from ldraw-verify's resolver. */
  placements: ReadonlyArray<{ index: number; partId: string; world: readonly number[] }>;
  /**
   * World Y of every plane at which this part presents studs, and of every
   * plane at which it presents anti-studs to receive them.
   *
   * Both are needed because an interface is directional: Legs PRESENT studs at
   * Y=0 and Body RECEIVES them there. Checking only stud planes -- which is
   * all `studFootprints` records -- silently fails every receiving side of
   * every contract.
   */
  studPlanes: ReadonlySet<number>;
  antiStudPlanes: ReadonlySet<number>;
  /** True when the part id resolves to a superseded `~Moved to` filename. */
  isAlias: (partId: string) => boolean;
  /** Part references the resolver could not find in the library. */
  unresolved: string[];
}

export interface Check {
  name: string;
  /** One line on what this check asserts, shown in the report. */
  asserts: string;
  run(ctx: CheckContext): Finding[];
}

export interface CheckReport {
  category: Category;
  parts: number;
  findings: Finding[];
  /** fail > 0 → not a valid brickie part. */
  passed: boolean;
}
