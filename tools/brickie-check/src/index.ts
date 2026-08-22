/**
 * The library surface. `src/cli.ts` is the command-line entry point; this is
 * what another package gets when it imports `brickie-check`.
 *
 * The generator consumes this: it needs to score its own output against the
 * same spec, and a generator grading itself by a private copy of the rules is
 * worth nothing.
 */
export { BrickieChecker, ALL_CHECKS } from "./check.js";
export * from "./spec.js";
export type { Check, CheckContext, CheckReport, Finding, Severity } from "./types.js";
