import { CATEGORY_INTERFACES } from "../spec.js";
import type { Check, Finding } from "../types.js";

/** How close a stud plane must be to the contracted plane, in LDU. */
const PLANE_EPS = 2;

/**
 * A part has to meet its neighbours where they expect it. The structural
 * joints are single-plane and directional: Legs present studs at Y=0 and Body
 * receives them; Body presents at Y=-64 and Head receives them; Head presents
 * at Y=-144 for a HeadAccessory. All 382 joins in each case land on one plane.
 *
 * Hair has no entry, deliberately. It meets the Head across four planes and
 * 1,404 connections -- a surface shell, not a part that plugs in -- so there
 * is no plane a hair piece must hit and asserting one would be inventing a
 * contract the corpus does not have.
 */
export const interfaceContract: Check = {
  name: "interface",
  asserts: "the part presents or receives studs at its category's interface planes",
  run({ category, studPlanes, antiStudPlanes }): Finding[] {
    const contracts = CATEGORY_INTERFACES[category];
    if (contracts.length === 0) return [];
    if (studPlanes.size === 0 && antiStudPlanes.size === 0) {
      return [
        {
          check: "interface",
          severity: "note",
          message: "no connection data resolved, so the interface planes could not be checked",
        },
      ];
    }

    const out: Finding[] = [];
    for (const c of contracts.filter((x) => x.contractual)) {
      // Directional: the presenting side needs studs on the plane, the
      // receiving side needs anti-studs there to take them.
      const planes = [...(c.presents ? studPlanes : antiStudPlanes)];
      if (planes.some((p) => Math.abs(p - c.plane) <= PLANE_EPS)) continue;
      const nearest = planes.sort((a, b) => Math.abs(a - c.plane) - Math.abs(b - c.plane))[0];
      const what = c.presents ? "studs" : "anti-studs";
      out.push({
        check: "interface",
        severity: "fail",
        message: `no ${what} on the Y=${c.plane} plane where ${category} ${c.presents ? "presents studs to" : "receives studs from"} ${c.neighbour}${nearest === undefined ? "" : `; nearest ${what} plane is Y=${nearest}`}`,
        evidence: { expectedPlane: c.plane, nearestPlane: nearest, neighbour: c.neighbour, presents: c.presents },
      });
    }
    return out;
  },
};
