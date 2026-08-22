import { basename } from "node:path";
import { BrickieChecker } from "./check.js";
import { CATEGORIES, type Category } from "./spec.js";

const ESC = "\u001b[";
const COLOUR: Record<string, string> = { fail: `${ESC}31m`, warn: `${ESC}33m`, note: `${ESC}90m` };
const RESET = `${ESC}0m`;

function usage(): never {
  console.error(`usage: brickie-check --category <${CATEGORIES.join("|")}> <file.mpd> [more.mpd ...]

  --library <dir>   LDraw parts library    (default: $LDRAW_DIR or .cache/ldraw)
  --shadow <dir>    LDCad shadow library   (default: $LDCAD_SHADOW_DIR)
  --json            machine-readable output

Without a shadow library the interface check cannot run, and says so rather
than passing silently.`);
  process.exit(2);
}

const argv = process.argv.slice(2);
const flag = (name: string): string | undefined => {
  const i = argv.indexOf(name);
  return i >= 0 ? argv[i + 1] : undefined;
};
const category = flag("--category") as Category | undefined;
const json = argv.includes("--json");
const files = argv.filter(
  (a, i) => !a.startsWith("--") && !["--category", "--library", "--shadow"].includes(argv[i - 1] ?? ""),
);

if (!category || !CATEGORIES.includes(category) || files.length === 0) usage();

const shadow = flag("--shadow") ?? process.env["LDCAD_SHADOW_DIR"];
const checker = await BrickieChecker.create({
  libraryRoot: flag("--library") ?? process.env["LDRAW_DIR"] ?? ".cache/ldraw",
  ...(shadow !== undefined ? { shadowDir: shadow } : {}),
});

let failed = 0;
const reports = [];
for (const file of files) {
  const report = await checker.checkFile(file, category);
  reports.push({ file, ...report });
  if (!report.passed) failed++;
  if (json) continue;
  const mark = report.passed ? `${ESC}32mPASS${RESET}` : `${ESC}31mFAIL${RESET}`;
  console.log(`${mark}  ${basename(file)}  (${category}, ${report.parts} parts)`);
  for (const f of report.findings) {
    console.log(`      ${COLOUR[f.severity]}${f.severity.padEnd(4)}${RESET} ${f.check}: ${f.message}`);
  }
}
if (json) console.log(JSON.stringify(reports, null, 1));
// 0 clean, 1 a part failed, 2 bad invocation -- mirrors ldraw-verify's contract.
process.exit(failed > 0 ? 1 : 0);
