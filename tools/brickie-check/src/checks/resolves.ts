import type { Check, Finding } from "../types.js";

/**
 * Every part reference resolves to a real file in the parts library.
 *
 * This check exists because its absence let a generator ship broken parts. A
 * substitution emitted `3023b` instead of `3023b.dat` -- the replacement id
 * came from a `~Moved to 3023b` header, which carries no extension -- and no
 * loader resolves it. Six plates per Legs template vanished from the render
 * while the line count, the piece count and every other check stayed happy.
 *
 * It was caught by someone looking at the pictures and noticing legs with no
 * legs in them. That is the failure mode this whole checker exists to prevent,
 * so it is a `fail`, and it is first: nothing else it reports means anything if
 * the model does not fully load. `ldraw-verify` has the same check as E-08.
 */
export const resolves: Check = {
  name: "resolves",
  asserts: "every part reference resolves in the library",
  run({ unresolved }): Finding[] {
    if (unresolved.length === 0) return [];
    const names = [...new Set(unresolved)];
    return [
      {
        check: "resolves",
        severity: "fail",
        message: `${names.length} part reference${names.length === 1 ? "" : "s"} do not resolve in the library: ${names.slice(0, 6).join(", ")}${names.length > 6 ? ` (+${names.length - 6} more)` : ""} — these will not render and will not build`,
        evidence: { unresolved: names },
      },
    ];
  },
};
