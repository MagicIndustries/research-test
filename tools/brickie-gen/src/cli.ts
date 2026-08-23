import { BrickieChecker, CATEGORIES, type Category } from "brickie-check";
import { LibraryIndex } from "ldraw-verify";
import { mkdir, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";
import { ChiralityIndex, generateMirror, isCandidate } from "./generate.js";

const ESC = "\u001b[";
const RESET = `${ESC}0m`;

function usage(): never {
  console.error(`usage: brickie-gen mirror --category <${CATEGORIES.join("|")}> --out <dir> <file.mpd> [...]

  --library <dir>   LDraw parts library    (default: $LDRAW_DIR or .cache/ldraw)
  --shadow <dir>    LDCad shadow library   (default: $LDCAD_SHADOW_DIR)
  --keep-unclean    write candidates that fail brickie-check as well

Mirrors each source through X=0. A source whose mirror reproduces it is
rejected rather than written: the corpus is 89-98% symmetric, so most parts
have no distinct mirror and generating one would only duplicate the input.`);
  process.exit(2);
}

const argv = process.argv.slice(2);
if (argv[0] !== "mirror") usage();
const flag = (n: string): string | undefined => {
  const i = argv.indexOf(n);
  return i >= 0 ? argv[i + 1] : undefined;
};
const category = flag("--category") as Category | undefined;
const out = flag("--out");
const keepUnclean = argv.includes("--keep-unclean");
const files = argv
  .slice(1)
  .filter((a, i, arr) => !a.startsWith("--") && !["--category", "--out", "--library", "--shadow"].includes(arr[i - 1] ?? ""));

if (!category || !CATEGORIES.includes(category) || !out || files.length === 0) usage();

const libraryRoot = flag("--library") ?? process.env["LDRAW_DIR"] ?? ".cache/ldraw";
const shadow = flag("--shadow") ?? process.env["LDCAD_SHADOW_DIR"];
const library = await LibraryIndex.fromDirectory(libraryRoot);
const chirality = ChiralityIndex.build(library);
const checker = await BrickieChecker.create({ libraryRoot, ...(shadow !== undefined ? { shadowDir: shadow } : {}) });
await mkdir(out, { recursive: true });

let written = 0;
let duplicates = 0;
let unclean = 0;
for (const file of files) {
  const r = await generateMirror(file, { checker, library, category, chirality });
  if (!isCandidate(r)) {
    duplicates++;
    console.log(`${ESC}90mskip${RESET}  ${basename(file)} — ${r.rejected === "identical" ? "mirror reproduces the source" : "mirror changes too little to be a new part"}`);
    continue;
  }
  const fails = r.report.findings.filter((f) => f.severity === "fail");
  const clean = fails.length === 0;
  if (!clean) unclean++;
  if (!clean && !keepUnclean) {
    console.log(`${ESC}31mfail${RESET}  ${basename(file)} — ${fails.map((f) => f.check).join(", ")}`);
    continue;
  }
  const name = basename(file).replace(/\.mpd$/i, "") + "_mirrored.mpd";
  await writeFile(join(out, name), r.text);
  written++;
  const pct = `${(r.changeRatio * 100).toFixed(0)}% changed`;
  const notes: string[] = [];
  if (r.handSwapped.length > 0) notes.push(`${ESC}32mhand-swapped ${r.handSwapped.length}${RESET}`);
  if (r.printsPreserved.length > 0) notes.push(`${ESC}90mprints kept upright: ${r.printsPreserved.length}${RESET}`);
  if (r.handUnresolved.length > 0) notes.push(`${ESC}33mno counterpart: ${r.handUnresolved.join(", ")}${RESET}`);
  const warn = notes.length > 0 ? `  ${notes.join(" · ")}` : "";
  console.log(`${clean ? `${ESC}32mok${RESET}  ` : `${ESC}33mkept${RESET}`}  ${name}  ${ESC}90m${pct}${RESET}${warn}`);
}

console.log(`\n${written} written, ${duplicates} skipped as duplicates, ${unclean} failed the checker`);
process.exit(0);
