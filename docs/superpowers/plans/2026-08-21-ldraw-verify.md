# ldraw-verify Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a TypeScript verifier that takes an LDraw or MPD model file and returns structured, three-valued findings keyed to the rule IDs in `lego-build-rules.yaml`.

**Architecture:** Three stages — Parse (text → AST), Resolve (AST → flattened `ResolvedModel` IR with world transforms and source provenance), Check (rule registry over the IR). The connection graph is a field on the IR, produced by a recursive walk of the LDCad shadow library. Rules are independent modules registered by ID; rule *metadata* loads from the YAML corpus so the corpus stays the single source of truth.

**Tech Stack:** TypeScript (strict), Node 20+, vitest, yaml, adm-zip. **No LDraw runtime dependency** — the npm LDraw packages are documented decoys (`npm i ldraw` installs 2015 code; three.js `LDrawLoader` has known-dangerous behaviour for this purpose). Everything is parsed from scratch.

**Spec:** `docs/superpowers/specs/2026-08-21-ldraw-verifier-design.md` (in `research-test`). Copy it into the new repo as `docs/design.md` in Task 1.

## Global Constraints

- **Repo:** new standalone repository, default name `ldraw-verify`. Not inside `research-test`.
- **Node:** 20 or later. TypeScript `strict: true`. ES modules (`"type": "module"`).
- **No LDraw npm dependencies.** Permitted runtime deps: `yaml`, `adm-zip`. Dev: `typescript`, `vitest`, `@types/node`.
- **LDU constants are integers throughout:** stud pitch 20, plate height 8, brick height 24, stud height 4, stud radius 6, Technic hole pitch 20, hole axis depth 10.
- **−Y is up.** Models stack upward by *decreasing* Y. Never emit or expect positive Y for a model built from a ground plane at y=0.
- **Matrices are row-major.** In a type-1 line `1 c x y z a b c d e f g h i file`, `(a,b,c)` is the FIRST ROW. `(a,d,g)` is the image of the X axis. Composition is `M_world = M_parent · M_child`.
- **Findings are three-valued** — `pass` | `fail` | `unknown` — plus `unimplemented` for corpus rules with no registered predicate. A rule whose IR dependency is unavailable returns `unknown`, never `pass`.
- **Unknowns never fail the run.** Exit codes: `0` clean · `1` any HARD violation · `2` DISCOURAGED only · `3` tool error.
- **Libraries are fetched and cached, never vendored.** The LDraw parts library is CC BY 4.0; the LDCad shadow library is **CC BY-SA 4.0 and ShareAlike propagates into derived connectivity data**. Derived hotspot artefacts live under `.cache/derived/` with their own `LICENCE.md` and are gitignored.
- **`B-03` (stud inflation) ships disabled.** It must exclude declared mating pairs or it false-positives on every legal stack. It stays unregistered until Task 10 lands.
- **Rule execution policy:** the registry executes only corpus rules whose tier is `HARD` or `DISCOURAGED` **and** which have a registered predicate. `LEGAL`-tier entries (`G-*`) are informational and are reported as `informational`, never executed. `HARD`/`DISCOURAGED` entries with no predicate are reported as `unimplemented`. Nothing is silently skipped.

---

## File Structure

```
ldraw-verify/
  package.json  tsconfig.json  vitest.config.ts  .gitignore  README.md
  docs/design.md                     ← copied from the spec
  rules/lego-build-rules.yaml        ← copied from research-test
  src/
    parse/ast.ts                     ← AST + parse error types
    parse/tokenize.ts                ← one source line → typed line
    parse/document.ts                ← text → LDrawDocument (MPD blocks)
    library/fetch.ts                 ← download + cache the two libraries
    library/index.ts                 ← LibraryIndex: lookup, alias/hidden flags
    resolve/matrix.ts                ← Mat4 helpers, row-major discipline
    resolve/ir.ts                    ← Placement, ResolvedModel types
    resolve/resolve.ts               ← document + library → ResolvedModel
    connect/shadow.ts                ← shadow-file text → SNAP_* metas
    connect/closure.ts               ← recursive reference-closure walk
    connect/hotspots.ts              ← metas → Hotspot[] (incl. grid= expansion)
    connect/graph.ts                 ← hotspot pairing → ConnectionGraph
    rules/types.ts                   ← Finding, Rule, RuleContext, Tier, Status
    rules/registry.ts                ← YAML metadata + predicate registration
    rules/l0-syntax.ts  l1-references.ts  l2-matrix.ts  l3-grid.ts
    rules/l4-connectivity.ts  l5-legality.ts
    report/json.ts  report/human.ts
    verify.ts                        ← the library entry point
    cli.ts
  scripts/omr-precision.ts           ← precision harness (Task 14)
  test/fixtures/legal/  test/fixtures/illegal/
```

Files split by responsibility, not by technical layer: everything that changes when the shadow-meta format changes lives in `connect/`; everything that changes when a rule is re-tiered lives in the YAML.

---

## Task 1: Scaffold and line tokenizer

**Files:**
- Create: `package.json`, `tsconfig.json`, `vitest.config.ts`, `.gitignore`, `README.md`
- Create: `src/parse/ast.ts`, `src/parse/tokenize.ts`
- Create: `docs/design.md` (copy of the spec), `rules/lego-build-rules.yaml` (copy from research-test)
- Test: `test/tokenize.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `tokenizeLine(text: string, line: number): LDrawLine | ParseError`; types `LDrawLine`, `SubfileRef`, `MetaLine`, `GeomLine`, `ParseError`, `Vec3`, `Mat3`.

- [ ] **Step 1: Initialise the repo and install dependencies**

```bash
mkdir ldraw-verify && cd ldraw-verify && git init
npm init -y
npm pkg set type="module" engines.node=">=20"
npm i yaml adm-zip
npm i -D typescript vitest @types/node @types/adm-zip
npx tsc --init --strict --target es2022 --module node16 --moduleResolution node16 --outDir dist --rootDir .
printf 'node_modules/\ndist/\n.cache/\n' > .gitignore
printf 'import { defineConfig } from "vitest/config";\nexport default defineConfig({ test: { include: ["test/**/*.test.ts"] } });\n' > vitest.config.ts
npm pkg set scripts.test="vitest run" scripts.build="tsc"
```

Copy the spec and corpus in (adjust the source path to wherever `research-test` is checked out):

```bash
mkdir -p docs rules
cp ../research-test/docs/superpowers/specs/2026-08-21-ldraw-verifier-design.md docs/design.md
cp ../research-test/docs/research/lego-build-rules.yaml rules/lego-build-rules.yaml
```

- [ ] **Step 2: Write the AST types**

Create `src/parse/ast.ts`:

```typescript
export type Vec3 = readonly [number, number, number];
/** Row-major 3x3: (a,b,c) is the FIRST ROW. */
export type Mat3 = readonly [number, number, number, number, number, number, number, number, number];

export interface SubfileRef {
  kind: "subfile";
  colour: number;
  pos: Vec3;
  mat: Mat3;
  name: string;
  line: number;
}

export interface MetaLine {
  kind: "meta";
  text: string;
  line: number;
}

export interface GeomLine {
  kind: "geom";
  lineType: 2 | 3 | 4 | 5;
  colour: number;
  coords: number[];
  line: number;
}

export type LDrawLine = SubfileRef | MetaLine | GeomLine;

export interface ParseError {
  kind: "error";
  line: number;
  code: string;
  message: string;
}

export interface Block {
  name: string;
  lines: LDrawLine[];
  startLine: number;
}

export interface LDrawDocument {
  path: string;
  blocks: Block[];
  errors: ParseError[];
}

/** Number of numeric coordinates required after the colour, per line type. */
export const GEOM_COORD_COUNT: Record<2 | 3 | 4 | 5, number> = { 2: 6, 3: 9, 4: 12, 5: 12 };
```

- [ ] **Step 3: Write the failing test**

Create `test/tokenize.test.ts`:

```typescript
import { describe, expect, it } from "vitest";
import { tokenizeLine } from "../src/parse/tokenize.js";

describe("tokenizeLine", () => {
  it("parses a type-1 subfile reference with row-major matrix", () => {
    const r = tokenizeLine("1 4 0 -24 0 1 0 0 0 1 0 0 0 1 3001.dat", 7);
    expect(r.kind).toBe("subfile");
    if (r.kind !== "subfile") return;
    expect(r.colour).toBe(4);
    expect(r.pos).toEqual([0, -24, 0]);
    expect(r.mat).toEqual([1, 0, 0, 0, 1, 0, 0, 0, 1]);
    expect(r.name).toBe("3001.dat");
    expect(r.line).toBe(7);
  });

  it("keeps filenames containing spaces intact", () => {
    const r = tokenizeLine("1 16 0 0 0 1 0 0 0 1 0 0 0 1 my sub model.ldr", 1);
    expect(r.kind === "subfile" && r.name).toBe("my sub model.ldr");
  });

  it("rejects a type-1 line with too few tokens", () => {
    const r = tokenizeLine("1 4 0 -24 0 1 0 0 3001.dat", 3);
    expect(r.kind).toBe("error");
    expect(r.kind === "error" && r.code).toBe("L0_TOKEN_COUNT");
  });

  it("rejects non-numeric coordinates", () => {
    const r = tokenizeLine("1 4 x -24 0 1 0 0 0 1 0 0 0 1 3001.dat", 3);
    expect(r.kind).toBe("error");
    expect(r.kind === "error" && r.code).toBe("L0_NON_NUMERIC");
  });

  it("parses a meta line", () => {
    const r = tokenizeLine("0 FILE main.ldr", 1);
    expect(r.kind).toBe("meta");
    expect(r.kind === "meta" && r.text).toBe("FILE main.ldr");
  });

  it("parses a type-3 triangle with 9 coordinates", () => {
    const r = tokenizeLine("3 16 0 0 0 1 0 0 0 0 1", 2);
    expect(r.kind).toBe("geom");
    expect(r.kind === "geom" && r.coords.length).toBe(9);
  });

  it("treats a blank line as an empty meta line", () => {
    expect(tokenizeLine("   ", 9).kind).toBe("meta");
  });
});
```

- [ ] **Step 4: Run test to verify it fails**

Run: `npx vitest run test/tokenize.test.ts`
Expected: FAIL — `Failed to resolve import "../src/parse/tokenize.js"`

- [ ] **Step 5: Write the implementation**

Create `src/parse/tokenize.ts`:

```typescript
import { GEOM_COORD_COUNT, type LDrawLine, type Mat3, type ParseError, type Vec3 } from "./ast.js";

function err(line: number, code: string, message: string): ParseError {
  return { kind: "error", line, code, message };
}

/**
 * Tokenize one source line. Filenames may contain spaces, so a type-1 line is
 * split into exactly 14 leading fields and everything after is the filename.
 */
export function tokenizeLine(text: string, line: number): LDrawLine | ParseError {
  const trimmed = text.trim();
  if (trimmed === "") return { kind: "meta", text: "", line };

  const parts = trimmed.split(/\s+/);
  const lineType = Number(parts[0]);

  if (lineType === 0) {
    return { kind: "meta", text: trimmed.slice(1).trim(), line };
  }

  if (lineType === 1) {
    if (parts.length < 15) {
      return err(line, "L0_TOKEN_COUNT", `type-1 line needs 14 fields then a filename, got ${parts.length}`);
    }
    const nums = parts.slice(1, 14).map(Number);
    if (nums.some((n) => !Number.isFinite(n))) {
      return err(line, "L0_NON_NUMERIC", "non-numeric field in a type-1 line");
    }
    const name = parts.slice(14).join(" ");
    return {
      kind: "subfile",
      colour: nums[0]!,
      pos: [nums[1]!, nums[2]!, nums[3]!] as Vec3,
      mat: nums.slice(4, 13) as unknown as Mat3,
      name,
      line,
    };
  }

  if (lineType === 2 || lineType === 3 || lineType === 4 || lineType === 5) {
    const need = GEOM_COORD_COUNT[lineType];
    const nums = parts.slice(1).map(Number);
    if (nums.length !== need + 1) {
      return err(line, "L0_TOKEN_COUNT", `type-${lineType} line needs ${need + 1} fields, got ${nums.length}`);
    }
    if (nums.some((n) => !Number.isFinite(n))) {
      return err(line, "L0_NON_NUMERIC", `non-numeric field in a type-${lineType} line`);
    }
    return { kind: "geom", lineType, colour: nums[0]!, coords: nums.slice(1), line };
  }

  return err(line, "L0_LINE_TYPE", `unknown line type "${parts[0]}"`);
}
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npx vitest run test/tokenize.test.ts`
Expected: PASS, 7 tests

- [ ] **Step 7: Write the README out-of-scope section**

Create `README.md`. The out-of-scope list is required by the spec's success criterion 6 — a verifier that implies it checks these is worse than one that says it cannot:

```markdown
# ldraw-verify

Verifies LDraw/MPD **model** files against the LEGO build-rules corpus.

## What it does NOT do

- **No structural soundness verdict.** "Will it hold together" is unsolved in the open; there is no zero-tolerance geometric ground truth, because correctly-connected LEGO parts are supposed to interpenetrate.
- **No general collision detection.** Exactly one rule in the corpus (`L-09`) is genuinely an interference test.
- **No aesthetic or craft judgement.**
- **No build-order validation.** `0 STEP` records intent; nothing validates it.
- **No part-availability check.** That needs a BrickLink/Rebrickable inventory join.
- **Does not verify part files.** This tool verifies models.

## Provenance caveat

The `L-*` rules derive from a 2006 presentation its own author has stated is superseded by an unpublished in-house version. The `B-*` rules are current first-party BrickLink Designer Program rules and win where the two disagree.
```

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: scaffold, AST types, and line tokenizer"
```

---

## Task 2: MPD document parsing

> **Correction (2026-08-22, from execution).** The `parseDocument` reference code in Step 3
> below has a **defect**, found by the implementer while executing this task and confirmed by
> review. Its `sawAnyContent` flag is never reset, so after a `0 NOFILE` closes a block the
> *next* `0 FILE` wrongly raises `L0_CONTENT_BEFORE_FILE` — which fails this task's own first
> test. A second, related defect sits in the single-block fallback: it cannot distinguish
> "no `0 FILE` has ever been seen" (the legitimate case for a plain `.ldr`) from "a block was
> opened and then closed", so content orphaned after a `0 NOFILE` is silently absorbed into a
> fabricated block, which can also displace the real main model from `blocks[0]`.
>
> The shipped implementation resolves both with a one-time prescan over the already-tokenised
> lines (`hasAnyFileBlock`), reuses `L0_CONTENT_BEFORE_FILE` when nothing has opened yet, and
> adds `L0_ORPHANED_CONTENT` for content stranded after a `0 NOFILE`. See `src/parse/document.ts`
> in the `ldraw-verify` repository for the working version; treat the block below as the
> historical brief, not as code to copy.

**Files:**
- Create: `src/parse/document.ts`
- Test: `test/document.test.ts`

**Interfaces:**
- Consumes: `tokenizeLine`, `LDrawLine`, `LDrawDocument`, `Block`, `ParseError` from Task 1.
- Produces: `parseDocument(text: string, path: string): LDrawDocument`.

- [ ] **Step 1: Write the failing test**

Create `test/document.test.ts`:

```typescript
import { describe, expect, it } from "vitest";
import { parseDocument } from "../src/parse/document.js";

const MPD = [
  "0 FILE main.ldr",
  "0 Main Model",
  "1 4 0 0 0 1 0 0 0 1 0 0 0 1 wall.ldr",
  "0 NOFILE",
  "0 FILE wall.ldr",
  "1 4 0 -24 0 1 0 0 0 1 0 0 0 1 3001.dat",
].join("\r\n");

describe("parseDocument", () => {
  it("splits MPD blocks into a flat list with the first FILE as main model", () => {
    const doc = parseDocument(MPD, "m.mpd");
    expect(doc.blocks.map((b) => b.name)).toEqual(["main.ldr", "wall.ldr"]);
    expect(doc.errors).toEqual([]);
  });

  it("assigns lines to the block they appear in", () => {
    const doc = parseDocument(MPD, "m.mpd");
    expect(doc.blocks[1]!.lines.filter((l) => l.kind === "subfile")).toHaveLength(1);
  });

  it("treats a file with no FILE meta as a single block named after the path", () => {
    const doc = parseDocument("1 4 0 0 0 1 0 0 0 1 0 0 0 1 3001.dat", "solo.ldr");
    expect(doc.blocks).toHaveLength(1);
    expect(doc.blocks[0]!.name).toBe("solo.ldr");
  });

  it("errors on content before the first FILE in a multi-block file", () => {
    const doc = parseDocument("1 4 0 0 0 1 0 0 0 1 0 0 0 1 a.dat\r\n0 FILE b.ldr\r\n0 FILE c.ldr", "x.mpd");
    expect(doc.errors.some((e) => e.code === "L0_CONTENT_BEFORE_FILE")).toBe(true);
  });

  it("errors on duplicate FILE names", () => {
    const doc = parseDocument("0 FILE a.ldr\r\n0 FILE a.ldr", "x.mpd");
    expect(doc.errors.some((e) => e.code === "L1_DUPLICATE_FILE")).toBe(true);
  });

  it("collects tokenizer errors rather than throwing", () => {
    const doc = parseDocument("0 FILE a.ldr\r\n1 4 0 0 0 bad.dat", "x.mpd");
    expect(doc.errors.some((e) => e.code === "L0_TOKEN_COUNT")).toBe(true);
  });

  it("tolerates LF-only input", () => {
    expect(parseDocument("0 FILE a.ldr\n0 FILE b.ldr", "x.mpd").blocks).toHaveLength(2);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run test/document.test.ts`
Expected: FAIL — cannot resolve `../src/parse/document.js`

- [ ] **Step 3: Write the implementation**

Create `src/parse/document.ts`:

```typescript
import type { Block, LDrawDocument, ParseError } from "./ast.js";
import { tokenizeLine } from "./tokenize.js";

const FILE_META = /^FILE\s+(.+)$/i;
const NOFILE_META = /^NOFILE\s*$/i;

export function parseDocument(text: string, path: string): LDrawDocument {
  const errors: ParseError[] = [];
  const blocks: Block[] = [];
  const seen = new Set<string>();

  let current: Block | null = null;
  let sawAnyContent = false;

  const rawLines = text.split(/\r?\n/);

  for (let i = 0; i < rawLines.length; i++) {
    const lineNo = i + 1;
    const token = tokenizeLine(rawLines[i]!, lineNo);

    if (token.kind === "error") {
      errors.push(token);
      continue;
    }

    if (token.kind === "meta") {
      const fileMatch = FILE_META.exec(token.text);
      if (fileMatch) {
        const name = fileMatch[1]!.trim();
        if (seen.has(name.toLowerCase())) {
          errors.push({ kind: "error", line: lineNo, code: "L1_DUPLICATE_FILE", message: `duplicate 0 FILE name "${name}"` });
        }
        seen.add(name.toLowerCase());
        if (current === null && sawAnyContent) {
          errors.push({
            kind: "error",
            line: lineNo,
            code: "L0_CONTENT_BEFORE_FILE",
            message: "non-comment content appears before the first 0 FILE",
          });
        }
        current = { name, lines: [], startLine: lineNo };
        blocks.push(current);
        continue;
      }
      if (NOFILE_META.test(token.text)) {
        current = null;
        continue;
      }
      if (token.text !== "") sawAnyContent = true;
      current?.lines.push(token);
      continue;
    }

    // subfile or geom
    sawAnyContent = true;
    if (current === null) {
      current = { name: path, lines: [], startLine: lineNo };
      blocks.push(current);
    }
    current.lines.push(token);
  }

  if (blocks.length === 0) blocks.push({ name: path, lines: [], startLine: 1 });

  return { path, blocks, errors };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run test/document.test.ts`
Expected: PASS, 7 tests

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: MPD document parsing with flat block list"
```

---

## Task 3: Matrix module

**Files:**
- Create: `src/resolve/matrix.ts`
- Test: `test/matrix.test.ts`

**Interfaces:**
- Consumes: `Vec3`, `Mat3` from Task 1.
- Produces: `type Mat4` (16 numbers, row-major); `fromLdraw(pos, mat): Mat4`; `multiply(a, b): Mat4`; `applyPoint(m, p): Vec3`; `applyDir(m, v): Vec3`; `determinant3(m): number`; `isOrthonormal(m, eps?): boolean`; `translationOf(m): Vec3`; `IDENTITY4: Mat4`.

- [ ] **Step 1: Write the failing test**

Create `test/matrix.test.ts`:

```typescript
import { describe, expect, it } from "vitest";
import { applyDir, applyPoint, determinant3, fromLdraw, IDENTITY4, isOrthonormal, multiply, translationOf } from "../src/resolve/matrix.js";

// 90 degrees about Y, taken verbatim from LDraw's own reference model car.ldr
const ROT_Y90 = [0, 0, 1, 0, 1, 0, -1, 0, 0] as const;

describe("matrix", () => {
  it("treats (a,b,c) as the first row, so (a,d,g) is the image of X", () => {
    const m = fromLdraw([0, 0, 0], ROT_Y90);
    // X axis maps to (a,d,g) = (0,0,-1)
    expect(applyDir(m, [1, 0, 0]).map(Math.round)).toEqual([0, 0, -1]);
  });

  it("applies translation to a point", () => {
    const m = fromLdraw([10, -24, 30], [1, 0, 0, 0, 1, 0, 0, 0, 1]);
    expect(applyPoint(m, [0, 0, 0])).toEqual([10, -24, 30]);
  });

  it("ignores translation for a direction", () => {
    const m = fromLdraw([10, -24, 30], [1, 0, 0, 0, 1, 0, 0, 0, 1]);
    expect(applyDir(m, [0, -1, 0])).toEqual([0, -1, 0]);
  });

  it("composes parent then child", () => {
    const parent = fromLdraw([0, -24, 0], [1, 0, 0, 0, 1, 0, 0, 0, 1]);
    const child = fromLdraw([20, 0, 0], [1, 0, 0, 0, 1, 0, 0, 0, 1]);
    expect(translationOf(multiply(parent, child))).toEqual([20, -24, 0]);
  });

  it("reports determinant +1 for a proper rotation", () => {
    expect(determinant3(fromLdraw([0, 0, 0], ROT_Y90))).toBeCloseTo(1, 9);
  });

  it("reports determinant -1 for a mirrored placement", () => {
    expect(determinant3(fromLdraw([0, 0, 0], [-1, 0, 0, 0, 1, 0, 0, 0, 1]))).toBeCloseTo(-1, 9);
  });

  it("detects a non-orthonormal (sheared) matrix", () => {
    expect(isOrthonormal(fromLdraw([0, 0, 0], [1, 0.5, 0, 0, 1, 0, 0, 0, 1]))).toBe(false);
    expect(isOrthonormal(fromLdraw([0, 0, 0], ROT_Y90))).toBe(true);
  });

  it("has an identity that leaves points unchanged", () => {
    expect(applyPoint(IDENTITY4, [1, 2, 3])).toEqual([1, 2, 3]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run test/matrix.test.ts`
Expected: FAIL — cannot resolve `../src/resolve/matrix.js`

- [ ] **Step 3: Write the implementation**

Create `src/resolve/matrix.ts`:

```typescript
import type { Mat3, Vec3 } from "../parse/ast.js";

/** Row-major 4x4. Rows 0..2 hold rotation and translation; row 3 is 0,0,0,1. */
export type Mat4 = readonly number[];

export const IDENTITY4: Mat4 = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

export function fromLdraw(pos: Vec3, m: Mat3): Mat4 {
  return [
    m[0], m[1], m[2], pos[0],
    m[3], m[4], m[5], pos[1],
    m[6], m[7], m[8], pos[2],
    0, 0, 0, 1,
  ];
}

export function multiply(a: Mat4, b: Mat4): Mat4 {
  const out = new Array<number>(16).fill(0);
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      let s = 0;
      for (let k = 0; k < 4; k++) s += a[r * 4 + k]! * b[k * 4 + c]!;
      out[r * 4 + c] = s;
    }
  }
  return out;
}

export function applyPoint(m: Mat4, p: Vec3): Vec3 {
  return [
    m[0]! * p[0] + m[1]! * p[1] + m[2]! * p[2] + m[3]!,
    m[4]! * p[0] + m[5]! * p[1] + m[6]! * p[2] + m[7]!,
    m[8]! * p[0] + m[9]! * p[1] + m[10]! * p[2] + m[11]!,
  ];
}

export function applyDir(m: Mat4, v: Vec3): Vec3 {
  return [
    m[0]! * v[0] + m[1]! * v[1] + m[2]! * v[2],
    m[4]! * v[0] + m[5]! * v[1] + m[6]! * v[2],
    m[8]! * v[0] + m[9]! * v[1] + m[10]! * v[2],
  ];
}

export function translationOf(m: Mat4): Vec3 {
  return [m[3]!, m[7]!, m[11]!];
}

export function determinant3(m: Mat4): number {
  const [a, b, c] = [m[0]!, m[1]!, m[2]!];
  const [d, e, f] = [m[4]!, m[5]!, m[6]!];
  const [g, h, i] = [m[8]!, m[9]!, m[10]!];
  return a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
}

/**
 * True when the rotation part is orthonormal. Guards against emitter
 * transposition-with-scale bugs and sheared transforms.
 */
export function isOrthonormal(m: Mat4, eps = 1e-6): boolean {
  const rows: Vec3[] = [
    [m[0]!, m[1]!, m[2]!],
    [m[4]!, m[5]!, m[6]!],
    [m[8]!, m[9]!, m[10]!],
  ];
  for (let i = 0; i < 3; i++) {
    const ri = rows[i]!;
    const norm = Math.hypot(ri[0], ri[1], ri[2]);
    if (Math.abs(norm - 1) > eps) return false;
    for (let j = i + 1; j < 3; j++) {
      const rj = rows[j]!;
      const dot = ri[0] * rj[0] + ri[1] * rj[1] + ri[2] * rj[2];
      if (Math.abs(dot) > eps) return false;
    }
  }
  return true;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run test/matrix.test.ts`
Expected: PASS, 8 tests

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: row-major matrix module with orthonormality check"
```

---

## Task 4: Library acquisition and index

**Files:**
- Create: `src/library/fetch.ts`, `src/library/index.ts`
- Test: `test/library.test.ts`, `test/fixtures/lib/parts/3001.dat`, `test/fixtures/lib/parts/3040.dat`

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: `interface LibraryPart { id: string; description: string; isAlias: boolean; isHidden: boolean; movedTo?: string; path: string }`; `class LibraryIndex` with `static fromDirectory(root: string): Promise<LibraryIndex>`, `get(id: string): LibraryPart | undefined`, `has(id: string): boolean`, `readText(id: string): Promise<string>`, `size: number`; `ensurePartsLibrary(cacheDir: string): Promise<string>`.

**Note on the shadow library.** The parts library is fetched from a stable, verified URL. The **LDCad shadow library is not fetched** — it is CC BY-SA 4.0, ShareAlike propagates, and pinning a mirror URL invites both rot and a licensing mistake. Instead the implementer installs LDCad and points the tool at its `shadow/offLib` directory via `--shadow-dir` or `LDCAD_SHADOW_DIR`. Task 9 consumes that path. Document this in the README.

- [ ] **Step 1: Create the test fixtures**

```bash
mkdir -p test/fixtures/lib/parts
cat > test/fixtures/lib/parts/3001.dat <<'EOF'
0 Brick  2 x  4
0 Name: 3001.dat
0 Author: James Jessiman
0 !LDRAW_ORG Part UPDATE 2004-03
EOF
cat > test/fixtures/lib/parts/3040.dat <<'EOF'
0 ~Moved to 3040b
0 Name: 3040.dat
0 Author: LDraw Parts Team
0 !LDRAW_ORG Part Alias UPDATE 2013-01
EOF
```

- [ ] **Step 2: Write the failing test**

Create `test/library.test.ts`:

```typescript
import { describe, expect, it } from "vitest";
import { LibraryIndex } from "../src/library/index.js";

describe("LibraryIndex", () => {
  it("indexes parts by lowercase filename", async () => {
    const lib = await LibraryIndex.fromDirectory("test/fixtures/lib");
    expect(lib.has("3001.dat")).toBe(true);
    expect(lib.has("3001.DAT")).toBe(true);
    expect(lib.get("3001.dat")!.description).toBe("Brick  2 x  4");
  });

  it("flags ~Moved to aliases and records the target", async () => {
    const lib = await LibraryIndex.fromDirectory("test/fixtures/lib");
    const p = lib.get("3040.dat")!;
    expect(p.isAlias).toBe(true);
    expect(p.movedTo).toBe("3040b");
  });

  it("flags any ~-prefixed description as hidden", async () => {
    const lib = await LibraryIndex.fromDirectory("test/fixtures/lib");
    expect(lib.get("3040.dat")!.isHidden).toBe(true);
    expect(lib.get("3001.dat")!.isHidden).toBe(false);
  });

  it("returns undefined for an unknown part", async () => {
    const lib = await LibraryIndex.fromDirectory("test/fixtures/lib");
    expect(lib.get("9999999.dat")).toBeUndefined();
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run test/library.test.ts`
Expected: FAIL — cannot resolve `../src/library/index.js`

- [ ] **Step 4: Write the index implementation**

Create `src/library/index.ts`:

```typescript
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

export interface LibraryPart {
  id: string;
  description: string;
  isAlias: boolean;
  isHidden: boolean;
  movedTo?: string;
  path: string;
}

const MOVED_TO = /^~Moved to\s+(\S+)/i;

export class LibraryIndex {
  private constructor(private readonly parts: Map<string, LibraryPart>) {}

  static async fromDirectory(root: string): Promise<LibraryIndex> {
    const parts = new Map<string, LibraryPart>();
    for (const sub of ["parts", "p"]) {
      const dir = join(root, sub);
      let names: string[];
      try {
        names = await readdir(dir);
      } catch {
        continue;
      }
      for (const name of names) {
        if (!name.toLowerCase().endsWith(".dat")) continue;
        const path = join(dir, name);
        const head = (await readFile(path, "utf8")).split(/\r?\n/, 1)[0] ?? "";
        const description = head.replace(/^0\s*/, "").trim();
        const moved = MOVED_TO.exec(description);
        parts.set(name.toLowerCase(), {
          id: name,
          description,
          isAlias: moved !== null,
          isHidden: description.startsWith("~"),
          movedTo: moved?.[1],
          path,
        });
      }
    }
    return new LibraryIndex(parts);
  }

  get(id: string): LibraryPart | undefined {
    return this.parts.get(id.toLowerCase());
  }

  has(id: string): boolean {
    return this.parts.has(id.toLowerCase());
  }

  async readText(id: string): Promise<string> {
    const p = this.get(id);
    if (!p) throw new Error(`part not in library: ${id}`);
    return readFile(p.path, "utf8");
  }

  get size(): number {
    return this.parts.size;
  }
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run test/library.test.ts`
Expected: PASS, 4 tests

- [ ] **Step 6: Write the fetch helper**

Create `src/library/fetch.ts`. The URL is the one verified during research (HTTP 200, "Parts Update 2026-07"):

```typescript
import AdmZip from "adm-zip";
import { mkdir, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";

export const PARTS_LIBRARY_URL = "https://library.ldraw.org/library/updates/complete.zip";

async function exists(p: string): Promise<boolean> {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

/**
 * Download and extract the official parts library into `cacheDir`, returning
 * the path to the extracted `ldraw` root. Never vendored into the repo:
 * the library is CC BY 4.0 and is a build-time artifact.
 */
export async function ensurePartsLibrary(cacheDir = ".cache"): Promise<string> {
  const root = join(cacheDir, "ldraw");
  if (await exists(join(root, "parts"))) return root;

  await mkdir(cacheDir, { recursive: true });
  const zipPath = join(cacheDir, "complete.zip");

  if (!(await exists(zipPath))) {
    const res = await fetch(PARTS_LIBRARY_URL);
    if (!res.ok) throw new Error(`parts library download failed: ${res.status} ${res.statusText}`);
    await writeFile(zipPath, Buffer.from(await res.arrayBuffer()));
  }

  new AdmZip(zipPath).extractAllTo(cacheDir, true);
  if (!(await exists(join(root, "parts")))) {
    throw new Error(`extracted archive has no ldraw/parts directory under ${cacheDir}`);
  }
  return root;
}
```

- [ ] **Step 7: Verify the fetch works end to end**

Run: `npx tsx -e "import('./src/library/fetch.js').then(m=>m.ensurePartsLibrary()).then(r=>console.log(r))"`
Expected: prints `.cache/ldraw` after downloading ~145 MB. Then:

Run: `npx tsx -e "import('./src/library/index.js').then(m=>m.LibraryIndex.fromDirectory('.cache/ldraw')).then(l=>console.log(l.size, l.get('3001.dat')?.description))"`
Expected: a count above 24000 and `Brick  2 x  4`

- [ ] **Step 8: Commit**

```bash
git add -A && git commit -m "feat: parts library fetch and index with alias/hidden detection"
```

---

## Task 5: Resolve to the IR

**Files:**
- Create: `src/resolve/ir.ts`, `src/resolve/resolve.ts`
- Test: `test/resolve.test.ts`

**Interfaces:**
- Consumes: `parseDocument`, `LDrawDocument` (Task 2); `Mat4`, `multiply`, `fromLdraw`, `IDENTITY4`, `translationOf` (Task 3); `LibraryIndex` (Task 4).
- Produces: `interface Placement { index: number; partId: string; colour: number; world: Mat4; submodelPath: string[]; file: string; line: number }`; `interface ResolvedModel { document: LDrawDocument; placements: Placement[]; unresolved: UnresolvedRef[]; cycles: string[][]; graph?: ConnectionGraph }`; `interface UnresolvedRef { name: string; file: string; line: number }`; `resolveModel(doc: LDrawDocument, lib: LibraryIndex): ResolvedModel`.

**Deviation from spec, recorded deliberately.** The spec's §3.2 says part origins come from a derived table rather than being computed. That requirement belongs to a *generator*, not this verifier: resolution composes transforms, and shadow hotspots are already expressed in the same part-local frame, so no origin table is needed here. The corresponding rule `E-09` therefore reports as `unimplemented` (its YAML `check` is already `none`). Keeping the table out avoids building an artefact nothing consumes.

- [ ] **Step 1: Write the failing test**

Create `test/resolve.test.ts`:

```typescript
import { describe, expect, it } from "vitest";
import { LibraryIndex } from "../src/library/index.js";
import { parseDocument } from "../src/parse/document.js";
import { translationOf } from "../src/resolve/matrix.js";
import { resolveModel } from "../src/resolve/resolve.js";

const lib = await LibraryIndex.fromDirectory("test/fixtures/lib");

describe("resolveModel", () => {
  it("flattens a single-block model into placements", () => {
    const doc = parseDocument("1 4 0 -24 0 1 0 0 0 1 0 0 0 1 3001.dat", "a.ldr");
    const m = resolveModel(doc, lib);
    expect(m.placements).toHaveLength(1);
    expect(m.placements[0]!.partId).toBe("3001.dat");
    expect(translationOf(m.placements[0]!.world)).toEqual([0, -24, 0]);
  });

  it("composes parent then child transforms through a submodel", () => {
    const doc = parseDocument(
      [
        "0 FILE main.ldr",
        "1 16 0 -24 0 1 0 0 0 1 0 0 0 1 wall.ldr",
        "0 FILE wall.ldr",
        "1 4 20 0 0 1 0 0 0 1 0 0 0 1 3001.dat",
      ].join("\n"),
      "m.mpd",
    );
    const m = resolveModel(doc, lib);
    expect(m.placements).toHaveLength(1);
    expect(translationOf(m.placements[0]!.world)).toEqual([20, -24, 0]);
    expect(m.placements[0]!.submodelPath).toEqual(["main.ldr", "wall.ldr"]);
  });

  it("records source file and line on every placement", () => {
    const doc = parseDocument("0 FILE main.ldr\n1 4 0 0 0 1 0 0 0 1 0 0 0 1 3001.dat", "m.mpd");
    const p = resolveModel(doc, lib).placements[0]!;
    expect(p.file).toBe("main.ldr");
    expect(p.line).toBe(2);
  });

  it("records unresolved references instead of throwing", () => {
    const doc = parseDocument("1 4 0 0 0 1 0 0 0 1 0 0 0 1 nope.dat", "a.ldr");
    const m = resolveModel(doc, lib);
    expect(m.placements).toHaveLength(0);
    expect(m.unresolved.map((u) => u.name)).toEqual(["nope.dat"]);
  });

  it("detects a submodel reference cycle and does not hang", () => {
    const doc = parseDocument(
      ["0 FILE a.ldr", "1 16 0 0 0 1 0 0 0 1 0 0 0 1 b.ldr", "0 FILE b.ldr", "1 16 0 0 0 1 0 0 0 1 0 0 0 1 a.ldr"].join("\n"),
      "m.mpd",
    );
    const m = resolveModel(doc, lib);
    expect(m.cycles.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run test/resolve.test.ts`
Expected: FAIL — cannot resolve `../src/resolve/resolve.js`

- [ ] **Step 3: Write the IR types**

Create `src/resolve/ir.ts`:

```typescript
import type { LDrawDocument } from "../parse/ast.js";
import type { ConnectionGraph } from "../connect/graph.js";
import type { Mat4 } from "./matrix.js";

export interface Placement {
  index: number;
  partId: string;
  colour: number;
  world: Mat4;
  submodelPath: string[];
  file: string;
  line: number;
}

export interface UnresolvedRef {
  name: string;
  file: string;
  line: number;
}

export interface ResolvedModel {
  document: LDrawDocument;
  placements: Placement[];
  unresolved: UnresolvedRef[];
  cycles: string[][];
  graph?: ConnectionGraph;
}
```

- [ ] **Step 4: Write the resolver**

Create `src/resolve/resolve.ts`:

```typescript
import type { Block, LDrawDocument } from "../parse/ast.js";
import type { LibraryIndex } from "../library/index.js";
import type { Placement, ResolvedModel, UnresolvedRef } from "./ir.js";
import { fromLdraw, IDENTITY4, multiply, type Mat4 } from "./matrix.js";

export function resolveModel(doc: LDrawDocument, lib: LibraryIndex): ResolvedModel {
  const byName = new Map<string, Block>();
  for (const b of doc.blocks) byName.set(b.name.toLowerCase(), b);

  const placements: Placement[] = [];
  const unresolved: UnresolvedRef[] = [];
  const cycles: string[][] = [];

  function walk(block: Block, world: Mat4, path: string[], stack: string[]): void {
    for (const line of block.lines) {
      if (line.kind !== "subfile") continue;
      const childWorld = multiply(world, fromLdraw(line.pos, line.mat));
      const key = line.name.toLowerCase();
      const sub = byName.get(key);

      if (sub) {
        if (stack.includes(key)) {
          cycles.push([...stack, key]);
          continue;
        }
        walk(sub, childWorld, [...path, sub.name], [...stack, key]);
        continue;
      }

      if (lib.has(line.name)) {
        placements.push({
          index: placements.length,
          partId: line.name,
          colour: line.colour,
          world: childWorld,
          submodelPath: path,
          file: block.name,
          line: line.line,
        });
        continue;
      }

      unresolved.push({ name: line.name, file: block.name, line: line.line });
    }
  }

  const main = doc.blocks[0];
  if (main) walk(main, IDENTITY4, [main.name], [main.name.toLowerCase()]);

  return { document: doc, placements, unresolved, cycles };
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run test/resolve.test.ts`
Expected: PASS, 5 tests

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: resolve documents to a flattened IR with provenance"
```

---

## Task 6: Findings model and rule registry

**Files:**
- Create: `src/rules/types.ts`, `src/rules/registry.ts`
- Test: `test/registry.test.ts`

**Interfaces:**
- Consumes: `ResolvedModel` (Task 5), `LibraryIndex` (Task 4).
- Produces: types `Tier = "HARD" | "DISCOURAGED" | "STYLE" | "LEGAL"`; `Status = "pass" | "fail" | "unknown" | "unimplemented" | "informational"`; `Location`; `Finding`; `RuleMeta`; `Rule`; `RuleContext`; `VerifyResult`. Functions `loadCorpus(path: string): Promise<Map<string, RuleMeta>>`, `class Registry` with `register(rule: Rule): void`, `run(model, lib): Finding[]`, and `static async create(corpusPath: string): Promise<Registry>`.

- [ ] **Step 1: Write the failing test**

Create `test/registry.test.ts`:

```typescript
import { describe, expect, it } from "vitest";
import { LibraryIndex } from "../src/library/index.js";
import { parseDocument } from "../src/parse/document.js";
import { resolveModel } from "../src/resolve/resolve.js";
import { Registry } from "../src/rules/registry.js";

const lib = await LibraryIndex.fromDirectory("test/fixtures/lib");
const model = resolveModel(parseDocument("1 4 0 0 0 1 0 0 0 1 0 0 0 1 3001.dat", "a.ldr"), lib);

describe("Registry", () => {
  it("loads rule metadata from the corpus", async () => {
    const r = await Registry.create("rules/lego-build-rules.yaml");
    expect(r.meta("B-06")!.tier).toBe("HARD");
    expect(r.meta("B-06")!.name).toBe("NO_FLOATING_PARTS");
  });

  it("reports a HARD corpus rule with no predicate as unimplemented", async () => {
    const r = await Registry.create("rules/lego-build-rules.yaml");
    const f = r.run(model, lib).find((x) => x.ruleId === "L-12");
    expect(f!.status).toBe("unimplemented");
  });

  it("reports LEGAL-tier entries as informational, never executed", async () => {
    const r = await Registry.create("rules/lego-build-rules.yaml");
    const f = r.run(model, lib).find((x) => x.ruleId === "G-01");
    expect(f!.status).toBe("informational");
  });

  it("runs a registered predicate", async () => {
    const r = await Registry.create("rules/lego-build-rules.yaml");
    r.register({
      id: "B-06",
      needs: ["placements"],
      run: () => [{ ruleId: "B-06", tier: "HARD", status: "fail", message: "boom", locations: [] }],
    });
    expect(r.run(model, lib).find((x) => x.ruleId === "B-06")!.status).toBe("fail");
  });

  it("returns unknown when a declared dependency is unavailable", async () => {
    const r = await Registry.create("rules/lego-build-rules.yaml");
    r.register({ id: "B-06", needs: ["graph"], run: () => [] });
    expect(r.run(model, lib).find((x) => x.ruleId === "B-06")!.status).toBe("unknown");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run test/registry.test.ts`
Expected: FAIL — cannot resolve `../src/rules/registry.js`

- [ ] **Step 3: Write the types**

Create `src/rules/types.ts`:

```typescript
import type { LibraryIndex } from "../library/index.js";
import type { Vec3 } from "../parse/ast.js";
import type { ResolvedModel } from "../resolve/ir.js";

export type Tier = "HARD" | "DISCOURAGED" | "STYLE" | "LEGAL";
export type Status = "pass" | "fail" | "unknown" | "unimplemented" | "informational";
export type Need = "placements" | "graph" | "library" | "document";

export interface Location {
  file: string;
  line: number;
  partId?: string;
  world?: Vec3;
}

export interface Finding {
  ruleId: string;
  tier: Tier;
  status: Status;
  message: string;
  locations: Location[];
  evidence?: Record<string, unknown>;
}

export interface RuleMeta {
  id: string;
  name: string;
  tier: Tier;
  statement: string;
  check?: string;
}

export interface RuleContext {
  model: ResolvedModel;
  library: LibraryIndex;
  meta: RuleMeta;
}

export interface Rule {
  id: string;
  needs: Need[];
  run(ctx: RuleContext): Finding[];
}

export interface VerifyResult {
  findings: Finding[];
  coverage: number;
  exitCode: 0 | 1 | 2 | 3;
}
```

- [ ] **Step 4: Write the registry**

Create `src/rules/registry.ts`:

```typescript
import { readFile } from "node:fs/promises";
import { parse } from "yaml";
import type { LibraryIndex } from "../library/index.js";
import type { ResolvedModel } from "../resolve/ir.js";
import type { Finding, Need, Rule, RuleMeta, Tier } from "./types.js";

interface CorpusEntry {
  id: string;
  name?: string;
  tier?: string;
  statement?: string;
  check?: string;
}

export async function loadCorpus(path: string): Promise<Map<string, RuleMeta>> {
  const doc = parse(await readFile(path, "utf8")) as { rules?: CorpusEntry[] };
  const out = new Map<string, RuleMeta>();
  for (const e of doc.rules ?? []) {
    out.set(e.id, {
      id: e.id,
      name: e.name ?? e.id,
      tier: (e.tier ?? "STYLE") as Tier,
      statement: e.statement ?? "",
      check: e.check,
    });
  }
  return out;
}

export class Registry {
  private readonly rules = new Map<string, Rule>();

  private constructor(private readonly corpus: Map<string, RuleMeta>) {}

  static async create(corpusPath: string): Promise<Registry> {
    return new Registry(await loadCorpus(corpusPath));
  }

  meta(id: string): RuleMeta | undefined {
    return this.corpus.get(id);
  }

  register(rule: Rule): void {
    if (!this.corpus.has(rule.id)) throw new Error(`rule ${rule.id} is not in the corpus`);
    this.rules.set(rule.id, rule);
  }

  private available(model: ResolvedModel): Set<Need> {
    const s = new Set<Need>(["placements", "library", "document"]);
    if (model.graph) s.add("graph");
    return s;
  }

  /**
   * Executes HARD and DISCOURAGED rules that have a predicate. Everything else
   * in the corpus is reported with a reason — nothing is silently skipped.
   */
  run(model: ResolvedModel, library: LibraryIndex): Finding[] {
    const have = this.available(model);
    const findings: Finding[] = [];

    for (const meta of this.corpus.values()) {
      if (meta.tier === "LEGAL" || meta.tier === "STYLE") {
        findings.push({ ruleId: meta.id, tier: meta.tier, status: "informational", message: meta.statement, locations: [] });
        continue;
      }

      const rule = this.rules.get(meta.id);
      if (!rule) {
        findings.push({ ruleId: meta.id, tier: meta.tier, status: "unimplemented", message: meta.statement, locations: [] });
        continue;
      }

      const missing = rule.needs.filter((n) => !have.has(n));
      if (missing.length > 0) {
        findings.push({
          ruleId: meta.id,
          tier: meta.tier,
          status: "unknown",
          message: `not evaluated: missing ${missing.join(", ")}`,
          locations: [],
        });
        continue;
      }

      const produced = rule.run({ model, library, meta });
      findings.push(
        ...(produced.length > 0
          ? produced
          : [{ ruleId: meta.id, tier: meta.tier, status: "pass" as const, message: meta.statement, locations: [] }]),
      );
    }

    return findings;
  }
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run test/registry.test.ts`
Expected: PASS, 5 tests

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: three-valued findings and YAML-driven rule registry"
```

---

## Task 7: L0 and L1 rules

**Files:**
- Create: `src/rules/l0-syntax.ts`, `src/rules/l1-references.ts`
- Test: `test/rules-l0-l1.test.ts`

**Interfaces:**
- Consumes: `Rule`, `Finding`, `RuleContext` (Task 6); `ResolvedModel` (Task 5); `LibraryIndex` (Task 4).
- Produces: `l0Rules: Rule[]` covering `E-05` (MPD structure) and `E-03` (model colour); `l1Rules: Rule[]` covering `E-08` (part numbers resolve) and `E-07` (no deprecated parts).

- [ ] **Step 1: Write the failing test**

Create `test/rules-l0-l1.test.ts`:

```typescript
import { describe, expect, it } from "vitest";
import { LibraryIndex } from "../src/library/index.js";
import { parseDocument } from "../src/parse/document.js";
import { resolveModel } from "../src/resolve/resolve.js";
import { l0Rules } from "../src/rules/l0-syntax.js";
import { l1Rules } from "../src/rules/l1-references.js";
import type { Rule, RuleMeta } from "../src/rules/types.js";

const lib = await LibraryIndex.fromDirectory("test/fixtures/lib");
const meta = (id: string): RuleMeta => ({ id, name: id, tier: "HARD", statement: "" });

function fire(rule: Rule, text: string) {
  const model = resolveModel(parseDocument(text, "t.ldr"), lib);
  return rule.run({ model, library: lib, meta: meta(rule.id) });
}

const byId = (rules: Rule[], id: string) => rules.find((r) => r.id === id)!;

describe("L0/L1 rules", () => {
  it("E-03 fails on colour 16 at the top level", () => {
    const f = fire(byId(l0Rules, "E-03"), "1 16 0 0 0 1 0 0 0 1 0 0 0 1 3001.dat");
    expect(f[0]!.status).toBe("fail");
    expect(f[0]!.locations[0]!.line).toBe(1);
  });

  it("E-03 fails on colour 24 at the top level", () => {
    expect(fire(byId(l0Rules, "E-03"), "1 24 0 0 0 1 0 0 0 1 0 0 0 1 3001.dat")[0]!.status).toBe("fail");
  });

  it("E-03 passes on a concrete colour", () => {
    expect(fire(byId(l0Rules, "E-03"), "1 4 0 0 0 1 0 0 0 1 0 0 0 1 3001.dat")).toHaveLength(0);
  });

  it("E-05 fails on content before the first FILE", () => {
    const f = fire(byId(l0Rules, "E-05"), "1 4 0 0 0 1 0 0 0 1 0 0 0 1 3001.dat\n0 FILE a.ldr\n0 FILE b.ldr");
    expect(f[0]!.status).toBe("fail");
  });

  it("E-05 fails on a reference cycle", () => {
    const f = fire(
      byId(l0Rules, "E-05"),
      ["0 FILE a.ldr", "1 16 0 0 0 1 0 0 0 1 0 0 0 1 b.ldr", "0 FILE b.ldr", "1 16 0 0 0 1 0 0 0 1 0 0 0 1 a.ldr"].join("\n"),
    );
    expect(f.some((x) => x.status === "fail")).toBe(true);
  });

  it("E-08 fails on an unresolved part", () => {
    const f = fire(byId(l1Rules, "E-08"), "1 4 0 0 0 1 0 0 0 1 0 0 0 1 nope.dat");
    expect(f[0]!.status).toBe("fail");
    expect(f[0]!.message).toContain("nope.dat");
  });

  it("E-07 fails on a ~Moved to alias and names the target", () => {
    const f = fire(byId(l1Rules, "E-07"), "1 4 0 0 0 1 0 0 0 1 0 0 0 1 3040.dat");
    expect(f[0]!.status).toBe("fail");
    expect(f[0]!.message).toContain("3040b");
  });

  it("E-07 passes on a current part", () => {
    expect(fire(byId(l1Rules, "E-07"), "1 4 0 0 0 1 0 0 0 1 0 0 0 1 3001.dat")).toHaveLength(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run test/rules-l0-l1.test.ts`
Expected: FAIL — cannot resolve `../src/rules/l0-syntax.js`

- [ ] **Step 3: Write the L0 rules**

Create `src/rules/l0-syntax.ts`:

```typescript
import type { Finding, Rule, RuleContext } from "./types.js";

const COLOUR_MAIN = 16;
const COLOUR_EDGE = 24;

const modelColour: Rule = {
  id: "E-03",
  needs: ["document"],
  run({ model, meta }: RuleContext): Finding[] {
    const out: Finding[] = [];
    const main = model.document.blocks[0];
    if (!main) return out;
    for (const line of main.lines) {
      if (line.kind !== "subfile") continue;
      if (line.colour !== COLOUR_MAIN && line.colour !== COLOUR_EDGE) continue;
      out.push({
        ruleId: meta.id,
        tier: meta.tier,
        status: "fail",
        message:
          line.colour === COLOUR_MAIN
            ? "colour 16 on a top-level type-1 line means \"inherit from my caller\"; the main model has no caller and will render as fallback mustard"
            : "colour 24 is for line types 2 and 5 only, never a type-1 line",
        locations: [{ file: main.name, line: line.line, partId: line.name }],
        evidence: { colour: line.colour },
      });
    }
    return out;
  },
};

const mpdStructure: Rule = {
  id: "E-05",
  needs: ["document"],
  run({ model, meta }: RuleContext): Finding[] {
    const out: Finding[] = [];
    for (const e of model.document.errors) {
      if (e.code !== "L0_CONTENT_BEFORE_FILE" && e.code !== "L1_DUPLICATE_FILE") continue;
      out.push({
        ruleId: meta.id,
        tier: meta.tier,
        status: "fail",
        message: e.message,
        locations: [{ file: model.document.path, line: e.line }],
        evidence: { code: e.code },
      });
    }
    for (const cycle of model.cycles) {
      out.push({
        ruleId: meta.id,
        tier: meta.tier,
        status: "fail",
        message: `submodel reference cycle: ${cycle.join(" -> ")}`,
        locations: [{ file: model.document.path, line: 1 }],
        evidence: { cycle },
      });
    }
    return out;
  },
};

export const l0Rules: Rule[] = [modelColour, mpdStructure];
```

- [ ] **Step 4: Write the L1 rules**

Create `src/rules/l1-references.ts`:

```typescript
import type { Finding, Rule, RuleContext } from "./types.js";

const partsResolve: Rule = {
  id: "E-08",
  needs: ["placements", "library"],
  run({ model, meta }: RuleContext): Finding[] {
    return model.unresolved.map((u) => ({
      ruleId: meta.id,
      tier: meta.tier,
      status: "fail" as const,
      message: `part not in the library and not a submodel in this file: ${u.name}`,
      locations: [{ file: u.file, line: u.line, partId: u.name }],
    }));
  },
};

const noDeprecated: Rule = {
  id: "E-07",
  needs: ["placements", "library"],
  run({ model, library, meta }: RuleContext): Finding[] {
    const out: Finding[] = [];
    for (const p of model.placements) {
      const entry = library.get(p.partId);
      if (!entry || (!entry.isAlias && !entry.isHidden)) continue;
      out.push({
        ruleId: meta.id,
        tier: meta.tier,
        status: "fail",
        message: entry.movedTo
          ? `${p.partId} is a "~Moved to" alias; reference ${entry.movedTo} instead`
          : `${p.partId} has a ~-prefixed description and should not be referenced`,
        locations: [{ file: p.file, line: p.line, partId: p.partId }],
        evidence: { movedTo: entry.movedTo, description: entry.description },
      });
    }
    return out;
  },
};

export const l1Rules: Rule[] = [partsResolve, noDeprecated];
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run test/rules-l0-l1.test.ts`
Expected: PASS, 8 tests

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: L0 syntax and L1 reference rules"
```

---

## Task 8: L2 matrix and L3 grid rules

**Files:**
- Create: `src/rules/l2-matrix.ts`, `src/rules/l3-grid.ts`
- Test: `test/rules-l2-l3.test.ts`

**Interfaces:**
- Consumes: `determinant3`, `isOrthonormal`, `translationOf` (Task 3); `Rule` types (Task 6).
- Produces: `l2Rules: Rule[]` covering `E-01`; `l3Rules: Rule[]` covering `E-02` and `E-04`.

- [ ] **Step 1: Write the failing test**

Create `test/rules-l2-l3.test.ts`:

```typescript
import { describe, expect, it } from "vitest";
import { LibraryIndex } from "../src/library/index.js";
import { parseDocument } from "../src/parse/document.js";
import { resolveModel } from "../src/resolve/resolve.js";
import { l2Rules } from "../src/rules/l2-matrix.js";
import { l3Rules } from "../src/rules/l3-grid.js";
import type { Rule, RuleMeta } from "../src/rules/types.js";

const lib = await LibraryIndex.fromDirectory("test/fixtures/lib");
const meta = (id: string, tier: RuleMeta["tier"] = "HARD"): RuleMeta => ({ id, name: id, tier, statement: "" });

function fire(rule: Rule, text: string, tier: RuleMeta["tier"] = "HARD") {
  const model = resolveModel(parseDocument(text, "t.ldr"), lib);
  return rule.run({ model, library: lib, meta: meta(rule.id, tier) });
}

const byId = (rules: Rule[], id: string) => rules.find((r) => r.id === id)!;

describe("L2/L3 rules", () => {
  it("E-01 passes an identity placement", () => {
    expect(fire(byId(l2Rules, "E-01"), "1 4 0 -24 0 1 0 0 0 1 0 0 0 1 3001.dat")).toHaveLength(0);
  });

  it("E-01 fails a sheared matrix", () => {
    const f = fire(byId(l2Rules, "E-01"), "1 4 0 0 0 1 0.5 0 0 1 0 0 0 1 3001.dat");
    expect(f[0]!.status).toBe("fail");
    expect(f[0]!.message).toContain("orthonormal");
  });

  it("E-01 fails a singular matrix", () => {
    const f = fire(byId(l2Rules, "E-01"), "1 4 0 0 0 0 0 0 0 1 0 0 0 1 3001.dat");
    expect(f[0]!.status).toBe("fail");
  });

  it("E-01 reports a mirrored placement without failing it", () => {
    const f = fire(byId(l2Rules, "E-01"), "1 4 0 0 0 -1 0 0 0 1 0 0 0 1 3001.dat");
    expect(f.every((x) => x.status !== "fail")).toBe(true);
  });

  it("E-02 fails a positive Y translation", () => {
    const f = fire(byId(l3Rules, "E-02"), "1 4 0 24 0 1 0 0 0 1 0 0 0 1 3001.dat");
    expect(f[0]!.status).toBe("fail");
    expect(f[0]!.message).toContain("-Y is up");
  });

  it("E-02 fails a Y that is not a multiple of 4", () => {
    expect(fire(byId(l3Rules, "E-02"), "1 4 0 -25 0 1 0 0 0 1 0 0 0 1 3001.dat")[0]!.status).toBe("fail");
  });

  it("E-02 passes a proper stacked brick", () => {
    expect(fire(byId(l3Rules, "E-02"), "1 4 0 -24 0 1 0 0 0 1 0 0 0 1 3001.dat")).toHaveLength(0);
  });

  it("E-04 reports off-grid X/Z as DISCOURAGED, not HARD", () => {
    const f = fire(byId(l3Rules, "E-04"), "1 4 7 -24 0 1 0 0 0 1 0 0 0 1 3001.dat", "DISCOURAGED");
    expect(f[0]!.status).toBe("fail");
    expect(f[0]!.tier).toBe("DISCOURAGED");
  });

  it("E-04 passes a half-stud jumper offset of 10", () => {
    expect(fire(byId(l3Rules, "E-04"), "1 4 10 -24 0 1 0 0 0 1 0 0 0 1 3001.dat", "DISCOURAGED")).toHaveLength(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run test/rules-l2-l3.test.ts`
Expected: FAIL — cannot resolve `../src/rules/l2-matrix.js`

- [ ] **Step 3: Write the L2 rule**

Create `src/rules/l2-matrix.ts`:

```typescript
import { determinant3, isOrthonormal } from "../resolve/matrix.js";
import type { Finding, Rule, RuleContext } from "./types.js";

const EPS = 1e-6;

const matrixSane: Rule = {
  id: "E-01",
  needs: ["placements"],
  run({ model, meta }: RuleContext): Finding[] {
    const out: Finding[] = [];
    for (const p of model.placements) {
      const det = determinant3(p.world);

      if (Math.abs(det) < EPS) {
        out.push({
          ruleId: meta.id,
          tier: meta.tier,
          status: "fail",
          message: "singular matrix: a dimension is scaled to zero",
          locations: [{ file: p.file, line: p.line, partId: p.partId }],
          evidence: { determinant: det },
        });
        continue;
      }

      if (!isOrthonormal(p.world, EPS)) {
        out.push({
          ruleId: meta.id,
          tier: meta.tier,
          status: "fail",
          message:
            "rotation is not orthonormal — the part is sheared or scaled. A common cause is emitting a column-major matrix: (a,b,c) is the FIRST ROW in LDraw",
          locations: [{ file: p.file, line: p.line, partId: p.partId }],
          evidence: { determinant: det },
        });
        continue;
      }

      if (det < 0) {
        out.push({
          ruleId: meta.id,
          tier: meta.tier,
          status: "pass",
          message: "mirrored placement (determinant -1) — legal, but verify it was intentional",
          locations: [{ file: p.file, line: p.line, partId: p.partId }],
          evidence: { determinant: det },
        });
      }
    }
    return out;
  },
};

export const l2Rules: Rule[] = [matrixSane];
```

- [ ] **Step 4: Write the L3 rules**

Create `src/rules/l3-grid.ts`:

```typescript
import { translationOf } from "../resolve/matrix.js";
import type { Finding, Rule, RuleContext } from "./types.js";

const PLATE_QUARTER = 4;
const HALF_STUD = 10;
const TOL = 1e-6;

function isMultiple(v: number, m: number): boolean {
  return Math.abs(v / m - Math.round(v / m)) < TOL;
}

const yAxis: Rule = {
  id: "E-02",
  needs: ["placements"],
  run({ model, meta }: RuleContext): Finding[] {
    const out: Finding[] = [];
    for (const p of model.placements) {
      const [, y] = translationOf(p.world);
      if (y > TOL) {
        out.push({
          ruleId: meta.id,
          tier: meta.tier,
          status: "fail",
          message: `y = ${y}: in LDraw -Y is up, so a model built from a ground plane at y=0 has y <= 0`,
          locations: [{ file: p.file, line: p.line, partId: p.partId }],
          evidence: { y },
        });
        continue;
      }
      if (!isMultiple(y, PLATE_QUARTER)) {
        out.push({
          ruleId: meta.id,
          tier: meta.tier,
          status: "fail",
          message: `y = ${y} is not a multiple of ${PLATE_QUARTER} LDU`,
          locations: [{ file: p.file, line: p.line, partId: p.partId }],
          evidence: { y },
        });
      }
    }
    return out;
  },
};

const xzGrid: Rule = {
  id: "E-04",
  needs: ["placements"],
  run({ model, meta }: RuleContext): Finding[] {
    const out: Finding[] = [];
    for (const p of model.placements) {
      const [x, , z] = translationOf(p.world);
      const bad = [
        ["x", x] as const,
        ["z", z] as const,
      ].filter(([, v]) => !isMultiple(v, HALF_STUD));
      if (bad.length === 0) continue;
      out.push({
        ruleId: meta.id,
        tier: meta.tier,
        status: "fail",
        message: `off-grid placement (${bad.map(([n, v]) => `${n}=${v}`).join(", ")}); grid-aligned values are multiples of ${HALF_STUD} LDU. Legitimate for deliberate SNOT — reported, not blocking`,
        locations: [{ file: p.file, line: p.line, partId: p.partId }],
        evidence: { x, z },
      });
    }
    return out;
  },
};

export const l3Rules: Rule[] = [yAxis, xzGrid];
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run test/rules-l2-l3.test.ts`
Expected: PASS, 9 tests

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: L2 matrix sanity and L3 grid conformance rules"
```

---

## Task 9: Shadow metas and the recursive closure walk

This is the scarce component. **No open-source parser of `!LDCAD SNAP_*` metadata exists in any language**, and the recursive walk is what takes coverage from 15.3% to 81.1% — 65.8% of covered parts get their data only via inherited subparts and primitives, and `3001.dat` has no shadow file of its own.

**Files:**
- Create: `src/connect/shadow.ts`, `src/connect/closure.ts`
- Modify: `src/library/index.ts` — add `relPath` to `LibraryPart` and index `parts/s/`
- Test: `test/shadow.test.ts`

**Interfaces:**
- Consumes: `LibraryIndex` (Task 4); `Mat4`, `multiply`, `fromLdraw`, `IDENTITY4` (Task 3); `tokenizeLine` (Task 1).
- Produces: `interface SnapMeta { type: string; attrs: Record<string, string> }`; `parseSnapMetas(text: string): SnapMeta[]`; `parseAttrs(text: string): Record<string, string>`; `interface ShadowLibrary` with `read(relPath: string): Promise<string | undefined>`; `openShadowLibrary(dir: string): ShadowLibrary`; `interface PlacedMeta { meta: SnapMeta; xform: Mat4 }`; `collectSnapMetas(partId: string, lib: LibraryIndex, shadow: ShadowLibrary): Promise<{ metas: PlacedMeta[]; hadData: boolean }>`.

- [ ] **Step 1: Add `relPath` to the library index**

In `src/library/index.ts`, add `relPath: string;` to the `LibraryPart` interface, extend the directory list, and record the relative path. Replace the `fromDirectory` body's loop header and `parts.set` call with:

```typescript
    for (const sub of ["parts", "p", "parts/s", "p/48", "p/8"]) {
      const dir = join(root, sub);
      let names: string[];
      try {
        names = await readdir(dir);
      } catch {
        continue;
      }
      for (const name of names) {
        if (!name.toLowerCase().endsWith(".dat")) continue;
        const path = join(dir, name);
        const head = (await readFile(path, "utf8")).split(/\r?\n/, 1)[0] ?? "";
        const description = head.replace(/^0\s*/, "").trim();
        const moved = MOVED_TO.exec(description);
        const key = name.toLowerCase();
        if (parts.has(key)) continue; // earlier directories win
        parts.set(key, {
          id: name,
          description,
          isAlias: moved !== null,
          isHidden: description.startsWith("~"),
          movedTo: moved?.[1],
          path,
          relPath: `${sub}/${name}`,
        });
      }
    }
```

Also normalise lookups so that a reference written `s\3001s01.dat` finds `3001s01.dat`. Change `get` to:

```typescript
  get(id: string): LibraryPart | undefined {
    const bare = id.replace(/\\/g, "/").split("/").pop() ?? id;
    return this.parts.get(bare.toLowerCase());
  }
```

Run: `npx vitest run test/library.test.ts`
Expected: PASS, 4 tests (unchanged behaviour)

- [ ] **Step 2: Write the failing test**

Create `test/shadow.test.ts`:

```typescript
import { describe, expect, it } from "vitest";
import { parseAttrs, parseSnapMetas } from "../src/connect/shadow.js";

describe("parseSnapMetas", () => {
  it("extracts a SNAP_CYL meta with its attributes", () => {
    const metas = parseSnapMetas("0 !LDCAD SNAP_CYL [gender=M] [caps=one] [secs=R 6 4] [pos=0 -4 0]");
    expect(metas).toHaveLength(1);
    expect(metas[0]!.type).toBe("SNAP_CYL");
    expect(metas[0]!.attrs.gender).toBe("M");
    expect(metas[0]!.attrs.pos).toBe("0 -4 0");
  });

  it("ignores non-LDCAD meta lines and geometry", () => {
    expect(parseSnapMetas("0 BFC CERTIFY CCW\n4 16 0 0 0 1 0 0 0 1 0 0 0 1")).toHaveLength(0);
  });

  it("captures every snap type it is given", () => {
    const text = ["SNAP_CYL", "SNAP_CLP", "SNAP_FGR", "SNAP_GEN", "SNAP_SPH", "SNAP_INCL", "SNAP_CLEAR"]
      .map((t) => `0 !LDCAD ${t} [id=x]`)
      .join("\n");
    expect(parseSnapMetas(text).map((m) => m.type)).toEqual([
      "SNAP_CYL", "SNAP_CLP", "SNAP_FGR", "SNAP_GEN", "SNAP_SPH", "SNAP_INCL", "SNAP_CLEAR",
    ]);
  });

  it("tolerates spaces around the equals sign", () => {
    expect(parseAttrs("[gender = F] [pos = 0 0 0]").gender).toBe("F");
  });

  it("returns an empty object when there are no attributes", () => {
    expect(parseAttrs("")).toEqual({});
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run test/shadow.test.ts`
Expected: FAIL — cannot resolve `../src/connect/shadow.js`

- [ ] **Step 4: Write the shadow meta parser**

Create `src/connect/shadow.ts`:

```typescript
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export interface SnapMeta {
  type: string;
  attrs: Record<string, string>;
}

const SNAP_LINE = /^0\s+!LDCAD\s+(SNAP_[A-Z]+)\s*(.*)$/;
const ATTR = /\[\s*([A-Za-z_]+)\s*=\s*([^\]]*?)\s*\]/g;

export function parseAttrs(text: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const m of text.matchAll(ATTR)) out[m[1]!.toLowerCase()] = m[2]!.trim();
  return out;
}

export function parseSnapMetas(text: string): SnapMeta[] {
  const out: SnapMeta[] = [];
  for (const raw of text.split(/\r?\n/)) {
    const m = SNAP_LINE.exec(raw.trim());
    if (!m) continue;
    out.push({ type: m[1]!, attrs: parseAttrs(m[2]!) });
  }
  return out;
}

export interface ShadowLibrary {
  read(relPath: string): Promise<string | undefined>;
}

/**
 * The shadow library is NOT fetched or vendored: it is CC BY-SA 4.0 and
 * ShareAlike propagates into derived connectivity data. Point this at an
 * LDCad installation's shadow/offLib directory.
 */
export function openShadowLibrary(dir: string): ShadowLibrary {
  const cache = new Map<string, string | undefined>();
  return {
    async read(relPath: string): Promise<string | undefined> {
      const key = relPath.toLowerCase();
      if (cache.has(key)) return cache.get(key);
      let text: string | undefined;
      try {
        text = await readFile(join(dir, relPath), "utf8");
      } catch {
        text = undefined;
      }
      cache.set(key, text);
      return text;
    },
  };
}
```

- [ ] **Step 5: Write the closure walk**

Create `src/connect/closure.ts`:

```typescript
import type { LibraryIndex } from "../library/index.js";
import { tokenizeLine } from "../parse/tokenize.js";
import { fromLdraw, IDENTITY4, multiply, type Mat4 } from "../resolve/matrix.js";
import { parseSnapMetas, type ShadowLibrary, type SnapMeta } from "./shadow.js";

export interface PlacedMeta {
  meta: SnapMeta;
  xform: Mat4;
}

const MAX_DEPTH = 32;

/**
 * Walk a part's full reference closure, collecting SNAP_* metas from every
 * shadow file encountered and transforming each into the part's own frame.
 *
 * The recursion is mandatory: reading only a part's own shadow file yields
 * 15.3% coverage instead of 81.1%, and 3001.dat has no shadow file at all.
 */
export async function collectSnapMetas(
  partId: string,
  lib: LibraryIndex,
  shadow: ShadowLibrary,
): Promise<{ metas: PlacedMeta[]; hadData: boolean }> {
  const metas: PlacedMeta[] = [];
  let hadData = false;
  const visiting = new Set<string>();

  async function walk(id: string, xform: Mat4, depth: number): Promise<void> {
    if (depth > MAX_DEPTH) return;
    const entry = lib.get(id);
    if (!entry) return;

    const key = entry.relPath.toLowerCase();
    if (visiting.has(key)) return;
    visiting.add(key);

    const shadowText = await shadow.read(entry.relPath);
    if (shadowText !== undefined) {
      const found = parseSnapMetas(shadowText);
      if (found.length > 0) hadData = true;
      for (const meta of found) {
        if (meta.type === "SNAP_CLEAR") {
          metas.length = 0;
          continue;
        }
        metas.push({ meta, xform });
      }
    }

    const partText = await lib.readText(id);
    for (const [i, raw] of partText.split(/\r?\n/).entries()) {
      const token = tokenizeLine(raw, i + 1);
      if (token.kind !== "subfile") continue;
      await walk(token.name, multiply(xform, fromLdraw(token.pos, token.mat)), depth + 1);
    }

    visiting.delete(key);
  }

  await walk(partId, IDENTITY4, 0);
  return { metas, hadData };
}
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npx vitest run test/shadow.test.ts`
Expected: PASS, 5 tests

- [ ] **Step 7: Verify the walk finds data for a real part**

Requires the parts library from Task 4 and an LDCad `shadow/offLib` directory.

Run: `LDCAD_SHADOW_DIR=<path-to>/LDCad/shadow/offLib npx tsx -e "
import {LibraryIndex} from './src/library/index.js';
import {openShadowLibrary} from './src/connect/shadow.js';
import {collectSnapMetas} from './src/connect/closure.js';
const lib = await LibraryIndex.fromDirectory('.cache/ldraw');
const sh = openShadowLibrary(process.env.LDCAD_SHADOW_DIR);
const r = await collectSnapMetas('3001.dat', lib, sh);
console.log('metas', r.metas.length, 'hadData', r.hadData);
"`

Expected: a non-zero meta count and `hadData true`. **If this prints 0, the walk is broken** — `3001.dat` has no shadow file of its own, so a non-zero result here is the proof that inheritance works.

- [ ] **Step 8: Commit**

```bash
git add -A && git commit -m "feat: LDCad snap-meta parser and recursive closure walk"
```

---

## Task 10: Hotspots and the connection graph

**Files:**
- Create: `src/connect/hotspots.ts`, `src/connect/graph.ts`
- Test: `test/hotspots.test.ts`, `test/graph.test.ts`

**Interfaces:**
- Consumes: `PlacedMeta`, `collectSnapMetas` (Task 9); `Placement`, `ResolvedModel` (Task 5); matrix helpers (Task 3).
- Produces: `type Gender = "male" | "female"`; `interface Hotspot { kind: string; gender: Gender; pos: Vec3; axis: Vec3; radius?: number }`; `expandGrid(attrs: Record<string, string>): Vec3[]`; `metasToHotspots(metas: PlacedMeta[]): Hotspot[]`; `interface Edge { a: number; b: number; kind: string; at: Vec3 }`; `interface ConnectionGraph { edges: Edge[]; coverage: { withData: number; total: number; ratio: number }; unknownPlacements: number[]; components: number }`; `buildGraph(model, lib, shadow): Promise<ConnectionGraph>`.

- [ ] **Step 1: Write the failing hotspot test**

Create `test/hotspots.test.ts`:

```typescript
import { describe, expect, it } from "vitest";
import { expandGrid, metasToHotspots } from "../src/connect/hotspots.js";
import { IDENTITY4 } from "../src/resolve/matrix.js";

describe("expandGrid", () => {
  it("expands a 2x4 grid at 20 LDU spacing into 8 offsets", () => {
    expect(expandGrid({ grid: "2 4 20 20" })).toHaveLength(8);
  });

  it("centres an axis marked with C", () => {
    const offs = expandGrid({ grid: "C2 1 20 20" });
    expect(offs.map((o) => o[0]).sort((a, b) => a - b)).toEqual([-10, 10]);
  });

  it("returns a single origin offset when there is no grid attribute", () => {
    expect(expandGrid({})).toEqual([[0, 0, 0]]);
  });
});

describe("metasToHotspots", () => {
  it("reads gender, position and axis from a SNAP_CYL meta", () => {
    const hs = metasToHotspots([
      { meta: { type: "SNAP_CYL", attrs: { gender: "M", pos: "0 -4 0", secs: "R 6 4" } }, xform: IDENTITY4 },
    ]);
    expect(hs).toHaveLength(1);
    expect(hs[0]!.gender).toBe("male");
    expect(hs[0]!.pos).toEqual([0, -4, 0]);
    expect(hs[0]!.axis).toEqual([0, -1, 0]);
  });

  it("expands a gridded meta into one hotspot per grid cell", () => {
    const hs = metasToHotspots([
      { meta: { type: "SNAP_CYL", attrs: { gender: "M", pos: "0 -4 0", grid: "2 4 20 20" } }, xform: IDENTITY4 },
    ]);
    expect(hs).toHaveLength(8);
  });

  it("skips SNAP_INCL and SNAP_CLEAR, which are not themselves connections", () => {
    expect(metasToHotspots([{ meta: { type: "SNAP_INCL", attrs: {} }, xform: IDENTITY4 }])).toHaveLength(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run test/hotspots.test.ts`
Expected: FAIL — cannot resolve `../src/connect/hotspots.js`

- [ ] **Step 3: Write the hotspot extractor**

Create `src/connect/hotspots.ts`:

```typescript
import type { Vec3 } from "../parse/ast.js";
import { applyDir, applyPoint, fromLdraw, type Mat4 } from "../resolve/matrix.js";
import type { PlacedMeta } from "./closure.js";

export type Gender = "male" | "female";

export interface Hotspot {
  kind: string;
  gender: Gender;
  pos: Vec3;
  axis: Vec3;
  radius?: number;
}

const CONNECTING = new Set(["SNAP_CYL", "SNAP_CLP", "SNAP_FGR", "SNAP_SPH", "SNAP_GEN"]);

function numbers(s: string | undefined): number[] {
  if (!s) return [];
  return s.split(/\s+/).map(Number).filter((n) => Number.isFinite(n));
}

/**
 * Expand a `grid=` attribute into local offsets. Syntax is
 * `[C]<nx> [C]<nz> <dx> <dz>`; a `C` prefix centres that axis.
 */
export function expandGrid(attrs: Record<string, string>): Vec3[] {
  const raw = attrs.grid;
  if (!raw) return [[0, 0, 0]];

  const tokens = raw.trim().split(/\s+/);
  if (tokens.length < 4) return [[0, 0, 0]];

  const centredX = tokens[0]!.toUpperCase().startsWith("C");
  const centredZ = tokens[1]!.toUpperCase().startsWith("C");
  const nx = Number(tokens[0]!.replace(/^[Cc]/, ""));
  const nz = Number(tokens[1]!.replace(/^[Cc]/, ""));
  const dx = Number(tokens[2]);
  const dz = Number(tokens[3]);
  if (![nx, nz, dx, dz].every(Number.isFinite)) return [[0, 0, 0]];

  const originX = centredX ? -((nx - 1) * dx) / 2 : 0;
  const originZ = centredZ ? -((nz - 1) * dz) / 2 : 0;

  const out: Vec3[] = [];
  for (let i = 0; i < nx; i++) {
    for (let j = 0; j < nz; j++) out.push([originX + i * dx, 0, originZ + j * dz]);
  }
  return out;
}

export function metasToHotspots(placed: PlacedMeta[]): Hotspot[] {
  const out: Hotspot[] = [];

  for (const { meta, xform } of placed) {
    if (!CONNECTING.has(meta.type)) continue;

    const gender: Gender = (meta.attrs.gender ?? "M").toUpperCase().startsWith("F") ? "female" : "male";
    const pos = numbers(meta.attrs.pos);
    const base: Vec3 = [pos[0] ?? 0, pos[1] ?? 0, pos[2] ?? 0];

    const ori = numbers(meta.attrs.ori);
    const local: Mat4 =
      ori.length === 9
        ? fromLdraw(base, ori as unknown as Parameters<typeof fromLdraw>[1])
        : fromLdraw(base, [1, 0, 0, 0, 1, 0, 0, 0, 1]);

    const secs = numbers(meta.attrs.secs);
    const radius = secs.length >= 2 ? secs[secs.length - 2] : undefined;

    for (const offset of expandGrid(meta.attrs)) {
      const localPos: Vec3 = [base[0] + offset[0], base[1] + offset[1], base[2] + offset[2]];
      out.push({
        kind: meta.type,
        gender,
        pos: applyPoint(xform, localPos),
        axis: applyDir(xform, applyDir(local, [0, -1, 0])),
        radius,
      });
    }
  }

  return out;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run test/hotspots.test.ts`
Expected: PASS, 7 tests

- [ ] **Step 5: Write the failing graph test**

Create `test/graph.test.ts`:

```typescript
import { describe, expect, it } from "vitest";
import { pairHotspots } from "../src/connect/graph.js";
import type { Hotspot } from "../src/connect/hotspots.js";

const male: Hotspot = { kind: "SNAP_CYL", gender: "male", pos: [0, -24, 0], axis: [0, -1, 0], radius: 6 };
const female: Hotspot = { kind: "SNAP_CYL", gender: "female", pos: [0, -24, 0], axis: [0, -1, 0], radius: 6 };

describe("pairHotspots", () => {
  it("pairs a coincident male and female hotspot", () => {
    expect(pairHotspots([male], [female])).toHaveLength(1);
  });

  it("does not pair two males", () => {
    expect(pairHotspots([male], [male])).toHaveLength(0);
  });

  it("does not pair hotspots that are far apart", () => {
    const far = { ...female, pos: [0, -100, 0] as const };
    expect(pairHotspots([male], [far])).toHaveLength(0);
  });

  it("does not pair hotspots whose axes are perpendicular", () => {
    const sideways = { ...female, axis: [1, 0, 0] as const };
    expect(pairHotspots([male], [sideways])).toHaveLength(0);
  });
});
```

- [ ] **Step 6: Run test to verify it fails**

Run: `npx vitest run test/graph.test.ts`
Expected: FAIL — cannot resolve `../src/connect/graph.js`

- [ ] **Step 7: Write the graph builder**

Create `src/connect/graph.ts`:

```typescript
import type { LibraryIndex } from "../library/index.js";
import type { Vec3 } from "../parse/ast.js";
import { applyDir, applyPoint } from "../resolve/matrix.js";
import type { ResolvedModel } from "../resolve/ir.js";
import { collectSnapMetas } from "./closure.js";
import { metasToHotspots, type Hotspot } from "./hotspots.js";
import type { ShadowLibrary } from "./shadow.js";

export interface Edge {
  a: number;
  b: number;
  kind: string;
  at: Vec3;
}

export interface ConnectionGraph {
  edges: Edge[];
  coverage: { withData: number; total: number; ratio: number };
  unknownPlacements: number[];
  components: number;
}

const POS_TOL = 1.0; // LDU
const AXIS_TOL = 0.1; // 1 - |cos| between axes

export function pairHotspots(a: Hotspot[], b: Hotspot[]): Array<[Hotspot, Hotspot]> {
  const out: Array<[Hotspot, Hotspot]> = [];
  for (const x of a) {
    for (const y of b) {
      if (x.gender === y.gender) continue;
      const d = Math.hypot(x.pos[0] - y.pos[0], x.pos[1] - y.pos[1], x.pos[2] - y.pos[2]);
      if (d > POS_TOL) continue;
      const dot = x.axis[0] * y.axis[0] + x.axis[1] * y.axis[1] + x.axis[2] * y.axis[2];
      if (1 - Math.abs(dot) > AXIS_TOL) continue;
      out.push([x, y]);
    }
  }
  return out;
}

function countComponents(n: number, edges: Edge[]): number {
  const parent = Array.from({ length: n }, (_, i) => i);
  const find = (i: number): number => (parent[i] === i ? i : (parent[i] = find(parent[i]!)));
  for (const e of edges) parent[find(e.a)] = find(e.b);
  return new Set(Array.from({ length: n }, (_, i) => find(i))).size;
}

export async function buildGraph(model: ResolvedModel, lib: LibraryIndex, shadow: ShadowLibrary): Promise<ConnectionGraph> {
  const perPlacement: Hotspot[][] = [];
  const unknownPlacements: number[] = [];

  for (const p of model.placements) {
    const { metas, hadData } = await collectSnapMetas(p.partId, lib, shadow);
    if (!hadData) unknownPlacements.push(p.index);
    const local = metasToHotspots(metas);
    perPlacement.push(
      local.map((h) => ({ ...h, pos: applyPoint(p.world, h.pos), axis: applyDir(p.world, h.axis) })),
    );
  }

  const edges: Edge[] = [];
  for (let i = 0; i < perPlacement.length; i++) {
    for (let j = i + 1; j < perPlacement.length; j++) {
      for (const [x] of pairHotspots(perPlacement[i]!, perPlacement[j]!)) {
        edges.push({ a: i, b: j, kind: x.kind, at: x.pos });
      }
    }
  }

  const total = model.placements.length;
  const withData = total - unknownPlacements.length;

  return {
    edges,
    coverage: { withData, total, ratio: total === 0 ? 1 : withData / total },
    unknownPlacements,
    components: countComponents(total, edges),
  };
}
```

- [ ] **Step 8: Run test to verify it passes**

Run: `npx vitest run test/graph.test.ts`
Expected: PASS, 4 tests

- [ ] **Step 9: Record the golden facts from the real library**

Create `test/golden.test.ts`. It is skipped unless `LDCAD_SHADOW_DIR` is set, so CI without a shadow library stays green:

```typescript
import { describe, expect, it } from "vitest";
import { collectSnapMetas } from "../src/connect/closure.js";
import { buildGraph } from "../src/connect/graph.js";
import { metasToHotspots } from "../src/connect/hotspots.js";
import { openShadowLibrary } from "../src/connect/shadow.js";
import { LibraryIndex } from "../src/library/index.js";
import { parseDocument } from "../src/parse/document.js";
import { resolveModel } from "../src/resolve/resolve.js";

const shadowDir = process.env.LDCAD_SHADOW_DIR;

describe.skipIf(!shadowDir)("golden facts", () => {
  it("3001.dat has 8 male stud hotspots on top", async () => {
    const lib = await LibraryIndex.fromDirectory(".cache/ldraw");
    const sh = openShadowLibrary(shadowDir!);
    const { metas } = await collectSnapMetas("3001.dat", lib, sh);
    const males = metasToHotspots(metas).filter((h) => h.gender === "male");
    expect(males).toHaveLength(8);
  });

  it("3001.dat has female hotspots on its underside", async () => {
    const lib = await LibraryIndex.fromDirectory(".cache/ldraw");
    const sh = openShadowLibrary(shadowDir!);
    const { metas } = await collectSnapMetas("3001.dat", lib, sh);
    const females = metasToHotspots(metas).filter((h) => h.gender === "female");
    expect(females.length).toBeGreaterThan(0);
    // Record the exact count once observed, then tighten this to an equality
    // assertion so a regression in the closure walk is caught.
    console.log("3001 female hotspot count:", females.length);
  });

  it("brick-on-brick mates at exactly 24 LDU and forms one component", async () => {
    const lib = await LibraryIndex.fromDirectory(".cache/ldraw");
    const sh = openShadowLibrary(shadowDir!);
    const doc = parseDocument(
      ["1 4 0 -24 0 1 0 0 0 1 0 0 0 1 3001.dat", "1 4 0 -48 0 1 0 0 0 1 0 0 0 1 3001.dat"].join("\n"),
      "stack.ldr",
    );
    const g = await buildGraph(resolveModel(doc, lib), lib, sh);
    expect(g.edges.length).toBeGreaterThan(0);
    expect(g.components).toBe(1);
  });
});
```

- [ ] **Step 10: Run the golden tests against the real library**

Run: `LDCAD_SHADOW_DIR=<path>/LDCad/shadow/offLib npx vitest run test/golden.test.ts`
Expected: PASS. Note the logged female hotspot count, then replace the `toBeGreaterThan(0)` assertion with an equality against that number and re-run.

- [ ] **Step 11: Commit**

```bash
git add -A && git commit -m "feat: hotspot extraction, grid expansion, and connection graph"
```

---

## Task 11: L4 connectivity rules and coverage

**Files:**
- Create: `src/rules/l4-connectivity.ts`
- Test: `test/rules-l4.test.ts`

**Interfaces:**
- Consumes: `ConnectionGraph` (Task 10); `Rule` types (Task 6).
- Produces: `l4Rules: Rule[]` covering `B-06` (no floating parts).

- [ ] **Step 1: Write the failing test**

Create `test/rules-l4.test.ts`:

```typescript
import { describe, expect, it } from "vitest";
import type { ConnectionGraph } from "../src/connect/graph.js";
import { LibraryIndex } from "../src/library/index.js";
import { parseDocument } from "../src/parse/document.js";
import { resolveModel } from "../src/resolve/resolve.js";
import { l4Rules } from "../src/rules/l4-connectivity.js";
import type { RuleMeta } from "../src/rules/types.js";

const lib = await LibraryIndex.fromDirectory("test/fixtures/lib");
const meta: RuleMeta = { id: "B-06", name: "NO_FLOATING_PARTS", tier: "HARD", statement: "" };

function modelWith(graph: ConnectionGraph, n: number) {
  const text = Array.from({ length: n }, (_, i) => `1 4 ${i * 20} -24 0 1 0 0 0 1 0 0 0 1 3001.dat`).join("\n");
  const m = resolveModel(parseDocument(text, "t.ldr"), lib);
  m.graph = graph;
  return m;
}

const graph = (components: number, total: number, withData = total): ConnectionGraph => ({
  edges: [],
  coverage: { withData, total, ratio: total === 0 ? 1 : withData / total },
  unknownPlacements: [],
  components,
});

describe("B-06 no floating parts", () => {
  const rule = l4Rules.find((r) => r.id === "B-06")!;

  it("passes a single connected component", () => {
    expect(rule.run({ model: modelWith(graph(1, 2), 2), library: lib, meta })).toHaveLength(0);
  });

  it("fails when the model has more than one component", () => {
    const f = rule.run({ model: modelWith(graph(3, 3), 3), library: lib, meta });
    expect(f[0]!.status).toBe("fail");
    expect(f[0]!.message).toContain("3");
  });

  it("returns unknown when connectivity coverage is incomplete", () => {
    const f = rule.run({ model: modelWith(graph(2, 4, 2), 4), library: lib, meta });
    expect(f[0]!.status).toBe("unknown");
  });

  it("passes an empty model", () => {
    expect(rule.run({ model: modelWith(graph(0, 0), 0), library: lib, meta })).toHaveLength(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run test/rules-l4.test.ts`
Expected: FAIL — cannot resolve `../src/rules/l4-connectivity.js`

- [ ] **Step 3: Write the rule**

Create `src/rules/l4-connectivity.ts`:

```typescript
import type { Finding, Rule, RuleContext } from "./types.js";

const noFloatingParts: Rule = {
  id: "B-06",
  needs: ["graph", "placements"],
  run({ model, meta }: RuleContext): Finding[] {
    const graph = model.graph;
    if (!graph || graph.coverage.total === 0) return [];

    // Incomplete connectivity data cannot distinguish "not connected" from
    // "we do not know how it connects". Absence of data is never a failure.
    if (graph.coverage.ratio < 1) {
      return [
        {
          ruleId: meta.id,
          tier: meta.tier,
          status: "unknown",
          message: `connectivity data covers ${graph.coverage.withData}/${graph.coverage.total} placements (${Math.round(graph.coverage.ratio * 100)}%); component count is not decidable`,
          locations: graph.unknownPlacements.slice(0, 10).map((i) => {
            const p = model.placements[i]!;
            return { file: p.file, line: p.line, partId: p.partId };
          }),
          evidence: { coverage: graph.coverage, components: graph.components },
        },
      ];
    }

    if (graph.components <= 1) return [];

    return [
      {
        ruleId: meta.id,
        tier: meta.tier,
        status: "fail",
        message: `model has ${graph.components} disconnected components; every element must be connected`,
        locations: [],
        evidence: { components: graph.components },
      },
    ];
  },
};

export const l4Rules: Rule[] = [noFloatingParts];
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run test/rules-l4.test.ts`
Expected: PASS, 4 tests

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: L4 connectivity rules with coverage-aware unknowns"
```

---

## Task 12: L5 legality rules

**Files:**
- Create: `src/rules/l5-legality.ts`, `data/part-classes.json`
- Test: `test/rules-l5.test.ts`

**Interfaces:**
- Consumes: `ConnectionGraph`, `Hotspot` (Task 10); `Rule` types (Task 6); `determinant3` (Task 3).
- Produces: `l5Rules: Rule[]` covering `B-01` (no stud in a Technic pinhole) and `B-05` (no fractional rotation); `TECHNIC_HOLE_PARTS: Set<string>` loaded from `data/part-classes.json`.

**Scope note.** `L-10` (plate wedged between studs) stays **unimplemented** in this task. It needs a tile-vs-plate part class *and* an edge-on orientation test, and — per the research — it is geometrically identical in LDraw to the legal `G-01` tile case. Implementing it badly would produce exactly the kind of false positive the OMR harness in Task 14 exists to catch. Task 15 records it as a pending fixture instead.

- [ ] **Step 1: Create the part-class seed table**

The corpus names these Technic hole-bearing parts under `B-01`, `L-01`, `L-02` and `L-03`. This is the beginning of the part-property database the spec flags as a known gap.

```bash
mkdir -p data
cat > data/part-classes.json <<'EOF'
{
  "_comment": "Seed part-property table. LDraw carries no part-class metadata; this is authored. Extend as rules require it.",
  "technicHole": ["3700.dat", "3701.dat", "3702.dat", "3894.dat", "6541.dat", "32000.dat"]
}
EOF
```

- [ ] **Step 2: Write the failing test**

Create `test/rules-l5.test.ts`:

```typescript
import { describe, expect, it } from "vitest";
import type { ConnectionGraph } from "../src/connect/graph.js";
import { LibraryIndex } from "../src/library/index.js";
import { parseDocument } from "../src/parse/document.js";
import { resolveModel } from "../src/resolve/resolve.js";
import { l5Rules } from "../src/rules/l5-legality.js";
import type { RuleMeta } from "../src/rules/types.js";

const lib = await LibraryIndex.fromDirectory("test/fixtures/lib");
const meta = (id: string): RuleMeta => ({ id, name: id, tier: "HARD", statement: "" });
const byId = (id: string) => l5Rules.find((r) => r.id === id)!;

const emptyGraph = (total: number): ConnectionGraph => ({
  edges: [],
  coverage: { withData: total, total, ratio: 1 },
  unknownPlacements: [],
  components: 1,
});

describe("B-05 no fractional rotation", () => {
  it("passes an axis-aligned placement", () => {
    const model = resolveModel(parseDocument("1 4 0 -24 0 1 0 0 0 1 0 0 0 1 3001.dat", "t.ldr"), lib);
    model.graph = emptyGraph(1);
    model.graph.singleStudParts = new Set([0]);
    expect(byId("B-05").run({ model, library: lib, meta: meta("B-05") })).toHaveLength(0);
  });

  it("fails a 45-degree yaw on a single-stud part", () => {
    const c = Math.SQRT1_2;
    const model = resolveModel(
      parseDocument(`1 4 0 -24 0 ${c} 0 ${c} 0 1 0 ${-c} 0 ${c} 3001.dat`, "t.ldr"),
      lib,
    );
    model.graph = emptyGraph(1);
    model.graph.singleStudParts = new Set([0]);
    const f = byId("B-05").run({ model, library: lib, meta: meta("B-05") });
    expect(f[0]!.status).toBe("fail");
  });

  it("returns unknown when no graph is available", () => {
    const model = resolveModel(parseDocument("1 4 0 -24 0 1 0 0 0 1 0 0 0 1 3001.dat", "t.ldr"), lib);
    expect(byId("B-05").run({ model, library: lib, meta: meta("B-05") })[0]!.status).toBe("unknown");
  });
});

describe("B-01 no stud in a Technic pinhole", () => {
  it("fails an edge from a stud-radius male hotspot into a Technic hole part", () => {
    const model = resolveModel(
      parseDocument(
        ["1 4 0 -24 0 1 0 0 0 1 0 0 0 1 3001.dat", "1 4 0 -48 0 1 0 0 0 1 0 0 0 1 3700.dat"].join("\n"),
        "t.ldr",
      ),
      lib,
    );
    model.graph = { ...emptyGraph(2), edges: [{ a: 0, b: 1, kind: "SNAP_CYL", at: [0, -34, 0], radius: 6 }] };
    const f = byId("B-01").run({ model, library: lib, meta: meta("B-01") });
    expect(f[0]!.status).toBe("fail");
  });

  it("passes when neither end is a Technic hole part", () => {
    const model = resolveModel(
      parseDocument(
        ["1 4 0 -24 0 1 0 0 0 1 0 0 0 1 3001.dat", "1 4 0 -48 0 1 0 0 0 1 0 0 0 1 3001.dat"].join("\n"),
        "t.ldr",
      ),
      lib,
    );
    model.graph = { ...emptyGraph(2), edges: [{ a: 0, b: 1, kind: "SNAP_CYL", at: [0, -34, 0], radius: 6 }] };
    expect(byId("B-01").run({ model, library: lib, meta: meta("B-01") })).toHaveLength(0);
  });
});
```

- [ ] **Step 3: Extend the graph types the test relies on**

In `src/connect/graph.ts`, add `radius?: number;` to `Edge`, and `singleStudParts?: Set<number>;` to `ConnectionGraph`. In `buildGraph`, populate both — replace the edge-pushing loop and the return value with:

```typescript
  const edges: Edge[] = [];
  for (let i = 0; i < perPlacement.length; i++) {
    for (let j = i + 1; j < perPlacement.length; j++) {
      for (const [x] of pairHotspots(perPlacement[i]!, perPlacement[j]!)) {
        edges.push({ a: i, b: j, kind: x.kind, at: x.pos, radius: x.radius });
      }
    }
  }

  const singleStudParts = new Set<number>();
  perPlacement.forEach((hs, i) => {
    if (hs.filter((h) => h.gender === "male").length === 1) singleStudParts.add(i);
  });

  const total = model.placements.length;
  const withData = total - unknownPlacements.length;

  return {
    edges,
    coverage: { withData, total, ratio: total === 0 ? 1 : withData / total },
    unknownPlacements,
    components: countComponents(total, edges),
    singleStudParts,
  };
```

Also add the field to `test/rules-l4.test.ts`'s `graph()` helper if TypeScript complains — it is optional, so it should not.

Run: `npx vitest run test/graph.test.ts test/rules-l4.test.ts`
Expected: PASS, unchanged

- [ ] **Step 4: Run the new test to verify it fails**

Run: `npx vitest run test/rules-l5.test.ts`
Expected: FAIL — cannot resolve `../src/rules/l5-legality.js`

- [ ] **Step 5: Write the rules**

Create `src/rules/l5-legality.ts`:

```typescript
import { readFileSync } from "node:fs";
import type { Finding, Rule, RuleContext } from "./types.js";

const classes = JSON.parse(readFileSync("data/part-classes.json", "utf8")) as { technicHole: string[] };
export const TECHNIC_HOLE_PARTS = new Set(classes.technicHole.map((s) => s.toLowerCase()));

const STUD_RADIUS = 6;
const RADIUS_TOL = 0.5;
const AXIS_TOL = 1e-6;

const noStudInPinhole: Rule = {
  id: "B-01",
  needs: ["graph", "placements"],
  run({ model, meta }: RuleContext): Finding[] {
    const graph = model.graph;
    if (!graph) return [];
    const out: Finding[] = [];

    for (const e of graph.edges) {
      if (e.radius === undefined || Math.abs(e.radius - STUD_RADIUS) > RADIUS_TOL) continue;
      for (const [self, other] of [[e.a, e.b], [e.b, e.a]] as const) {
        const target = model.placements[other];
        const source = model.placements[self];
        if (!target || !source) continue;
        if (!TECHNIC_HOLE_PARTS.has(target.partId.toLowerCase())) continue;
        out.push({
          ruleId: meta.id,
          tier: meta.tier,
          status: "fail",
          message: `stud from ${source.partId} enters a Technic pinhole on ${target.partId}; the BrickLink Designer Program bans this outright`,
          locations: [
            { file: source.file, line: source.line, partId: source.partId },
            { file: target.file, line: target.line, partId: target.partId },
          ],
          evidence: { at: e.at, radius: e.radius },
        });
      }
    }
    return out;
  },
};

const noFractionalRotation: Rule = {
  id: "B-05",
  needs: ["graph", "placements"],
  run({ model, meta }: RuleContext): Finding[] {
    const graph = model.graph;
    if (!graph || !graph.singleStudParts) {
      return [
        {
          ruleId: meta.id,
          tier: meta.tier,
          status: "unknown",
          message: "single-stud parts cannot be identified without connectivity data",
          locations: [],
        },
      ];
    }

    const out: Finding[] = [];
    for (const i of graph.singleStudParts) {
      const p = model.placements[i];
      if (!p) continue;
      const rot = [p.world[0]!, p.world[1]!, p.world[2]!, p.world[4]!, p.world[5]!, p.world[6]!, p.world[8]!, p.world[9]!, p.world[10]!];
      const axisAligned = rot.every((v) => Math.abs(v) < AXIS_TOL || Math.abs(Math.abs(v) - 1) < AXIS_TOL);
      if (axisAligned) continue;
      out.push({
        ruleId: meta.id,
        tier: meta.tier,
        status: "fail",
        message: `${p.partId} is a single-stud part placed at a non-axis-aligned rotation; sub-detent positioning is not permitted`,
        locations: [{ file: p.file, line: p.line, partId: p.partId }],
        evidence: { rotation: rot },
      });
    }
    return out;
  },
};

export const l5Rules: Rule[] = [noStudInPinhole, noFractionalRotation];
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npx vitest run test/rules-l5.test.ts`
Expected: PASS, 5 tests

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: L5 legality rules B-01 and B-05 with a seed part-class table"
```

---

## Task 13: verify entry point, reporters, and CLI

**Files:**
- Create: `src/verify.ts`, `src/report/json.ts`, `src/report/human.ts`, `src/cli.ts`
- Modify: `package.json` — add the `bin` entry
- Test: `test/verify.test.ts`

**Interfaces:**
- Consumes: everything above.
- Produces: `verifyFile(path: string, opts: VerifyOptions): Promise<VerifyResult>`; `interface VerifyOptions { libraryRoot: string; shadowDir?: string; corpusPath?: string }`; `renderJson(r: VerifyResult): string`; `renderHuman(r: VerifyResult): string`; `exitCodeFor(findings: Finding[]): 0 | 1 | 2`.

- [ ] **Step 1: Write the failing test**

Create `test/verify.test.ts`:

```typescript
import { describe, expect, it } from "vitest";
import { exitCodeFor } from "../src/verify.js";
import type { Finding } from "../src/rules/types.js";

const f = (tier: Finding["tier"], status: Finding["status"]): Finding => ({
  ruleId: "X", tier, status, message: "", locations: [],
});

describe("exitCodeFor", () => {
  it("returns 0 when everything passes", () => {
    expect(exitCodeFor([f("HARD", "pass"), f("DISCOURAGED", "pass")])).toBe(0);
  });

  it("returns 1 for any HARD failure", () => {
    expect(exitCodeFor([f("DISCOURAGED", "fail"), f("HARD", "fail")])).toBe(1);
  });

  it("returns 2 for DISCOURAGED failures only", () => {
    expect(exitCodeFor([f("DISCOURAGED", "fail")])).toBe(2);
  });

  it("returns 0 when the only non-passes are unknown or unimplemented", () => {
    expect(exitCodeFor([f("HARD", "unknown"), f("HARD", "unimplemented")])).toBe(0);
  });

  it("ignores informational findings", () => {
    expect(exitCodeFor([f("LEGAL", "informational")])).toBe(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run test/verify.test.ts`
Expected: FAIL — cannot resolve `../src/verify.js`

- [ ] **Step 3: Write the verify entry point**

Create `src/verify.ts`:

```typescript
import { readFile } from "node:fs/promises";
import { buildGraph } from "./connect/graph.js";
import { openShadowLibrary } from "./connect/shadow.js";
import { LibraryIndex } from "./library/index.js";
import { parseDocument } from "./parse/document.js";
import { resolveModel } from "./resolve/resolve.js";
import { l0Rules } from "./rules/l0-syntax.js";
import { l1Rules } from "./rules/l1-references.js";
import { l2Rules } from "./rules/l2-matrix.js";
import { l3Rules } from "./rules/l3-grid.js";
import { l4Rules } from "./rules/l4-connectivity.js";
import { l5Rules } from "./rules/l5-legality.js";
import { Registry } from "./rules/registry.js";
import type { Finding, Tier, VerifyResult } from "./rules/types.js";

export interface VerifyOptions {
  libraryRoot: string;
  shadowDir?: string;
  corpusPath?: string;
}

export function exitCodeFor(findings: Finding[]): 0 | 1 | 2 {
  let discouraged = false;
  for (const f of findings) {
    if (f.status !== "fail") continue;
    if (f.tier === "HARD") return 1;
    if (f.tier === "DISCOURAGED") discouraged = true;
  }
  return discouraged ? 2 : 0;
}

export async function verifyFile(path: string, opts: VerifyOptions): Promise<VerifyResult> {
  const lib = await LibraryIndex.fromDirectory(opts.libraryRoot);
  const doc = parseDocument(await readFile(path, "utf8"), path);
  const model = resolveModel(doc, lib);

  if (opts.shadowDir) {
    model.graph = await buildGraph(model, lib, openShadowLibrary(opts.shadowDir));
  }

  const registry = await Registry.create(opts.corpusPath ?? "rules/lego-build-rules.yaml");
  for (const rule of [...l0Rules, ...l1Rules, ...l2Rules, ...l3Rules, ...l4Rules, ...l5Rules]) {
    registry.register(rule);
  }

  const findings = registry.run(model, lib);
  return { findings, coverage: model.graph?.coverage.ratio ?? 0, exitCode: exitCodeFor(findings) };
}
```

- [ ] **Step 4: Write the reporters**

Create `src/report/json.ts`:

```typescript
import type { VerifyResult } from "../rules/types.js";

export function renderJson(r: VerifyResult): string {
  return JSON.stringify(
    {
      exitCode: r.exitCode,
      connectivityCoverage: r.coverage,
      summary: {
        failed: r.findings.filter((f) => f.status === "fail").length,
        unknown: r.findings.filter((f) => f.status === "unknown").length,
        unimplemented: r.findings.filter((f) => f.status === "unimplemented").length,
      },
      findings: r.findings.filter((f) => f.status !== "informational" && f.status !== "pass"),
    },
    null,
    2,
  );
}
```

Create `src/report/human.ts`:

```typescript
import type { VerifyResult } from "../rules/types.js";

const MARK: Record<string, string> = { fail: "FAIL", unknown: "????", unimplemented: "----", pass: "ok  ", informational: "info" };

export function renderHuman(r: VerifyResult): string {
  const lines: string[] = [];
  for (const f of r.findings) {
    if (f.status === "pass" || f.status === "informational") continue;
    const where = f.locations[0] ? ` ${f.locations[0].file}:${f.locations[0].line}` : "";
    lines.push(`${MARK[f.status]} [${f.tier}] ${f.ruleId}${where} — ${f.message}`);
  }
  const pct = Math.round(r.coverage * 100);
  lines.push("");
  lines.push(`connectivity coverage: ${pct}%${pct < 100 ? "  (rules needing connectivity may report unknown)" : ""}`);
  return lines.join("\n");
}
```

- [ ] **Step 5: Write the CLI**

Create `src/cli.ts`:

```typescript
#!/usr/bin/env node
import { renderHuman } from "./report/human.js";
import { renderJson } from "./report/json.js";
import { verifyFile } from "./verify.js";

function flag(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? undefined : process.argv[i + 1];
}

const file = process.argv[2];
if (!file || file.startsWith("--")) {
  console.error("usage: ldraw-verify <model.ldr|model.mpd> [--library <dir>] [--shadow-dir <dir>] [--json]");
  process.exit(3);
}

try {
  const result = await verifyFile(file, {
    libraryRoot: flag("library") ?? ".cache/ldraw",
    shadowDir: flag("shadow-dir") ?? process.env.LDCAD_SHADOW_DIR,
    corpusPath: flag("rules"),
  });
  if (process.argv.includes("--json")) {
    console.log(renderJson(result));
  } else {
    console.error(renderHuman(result));
  }
  process.exit(result.exitCode);
} catch (err) {
  console.error(`ldraw-verify: ${(err as Error).message}`);
  process.exit(3);
}
```

Register the binary:

```bash
npm pkg set bin.ldraw-verify="dist/cli.js"
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npx vitest run test/verify.test.ts`
Expected: PASS, 5 tests

- [ ] **Step 7: Verify the CLI end to end**

```bash
printf '0 FILE bad.ldr\r\n1 16 7 24 0 1 0 0 0 1 0 0 0 1 3001.dat\r\n' > /tmp/bad.ldr
npm run build && node dist/cli.js /tmp/bad.ldr --json; echo "exit=$?"
```

Expected: JSON listing `E-03` (colour 16 at top level), `E-02` (positive y), `E-04` (x=7 off grid), and `exit=1`.

- [ ] **Step 8: Commit**

```bash
git add -A && git commit -m "feat: verify entry point, JSON and human reporters, CLI"
```

---

## Task 14: OMR precision harness

The idea the whole test strategy rests on: **released LEGO sets contain no illegal techniques by construction, so every HARD finding against an OMR model is a false positive.** This measures precision over a large corpus with no hand labelling.

**Files:**
- Create: `scripts/omr-precision.ts`
- Modify: `package.json` — add the `precision` script
- Test: none (this is a measurement harness, not a unit)

**Interfaces:**
- Consumes: `verifyFile` (Task 13).
- Produces: a report on stdout and `precision-report.json`, with per-rule false-positive counts and the demote/quarantine verdict.

- [ ] **Step 1: Write the harness**

Create `scripts/omr-precision.ts`:

```typescript
import { readdir, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { verifyFile } from "../src/verify.js";

const DEMOTE_AT = 0.01;
const QUARANTINE_AT = 0.05;

const omrDir = process.argv[2];
if (!omrDir) {
  console.error("usage: tsx scripts/omr-precision.ts <dir-of-omr-models>");
  process.exit(3);
}

const files = (await readdir(omrDir)).filter((f) => [".ldr", ".mpd"].includes(extname(f).toLowerCase()));
const hardHits = new Map<string, number>();
const applied = new Map<string, number>();
let scanned = 0;

for (const f of files) {
  let result;
  try {
    result = await verifyFile(join(omrDir, f), {
      libraryRoot: ".cache/ldraw",
      shadowDir: process.env.LDCAD_SHADOW_DIR,
    });
  } catch (err) {
    console.error(`skipped ${f}: ${(err as Error).message}`);
    continue;
  }
  scanned++;
  for (const finding of result.findings) {
    if (finding.tier !== "HARD") continue;
    if (finding.status === "unimplemented" || finding.status === "unknown") continue;
    applied.set(finding.ruleId, (applied.get(finding.ruleId) ?? 0) + 1);
    if (finding.status === "fail") hardHits.set(finding.ruleId, (hardHits.get(finding.ruleId) ?? 0) + 1);
  }
}

const rows = [...applied.keys()].map((ruleId) => {
  const hits = hardHits.get(ruleId) ?? 0;
  const n = applied.get(ruleId) ?? 0;
  const rate = n === 0 ? 0 : hits / n;
  const verdict = rate >= QUARANTINE_AT ? "QUARANTINE" : rate >= DEMOTE_AT ? "DEMOTE" : "keep";
  return { ruleId, falsePositives: hits, applicable: n, rate, verdict };
}).sort((a, b) => b.rate - a.rate);

console.log(`scanned ${scanned}/${files.length} OMR models\n`);
for (const r of rows) {
  console.log(`${r.verdict.padEnd(11)} ${r.ruleId.padEnd(6)} ${r.falsePositives}/${r.applicable}  ${(r.rate * 100).toFixed(2)}%`);
}
await writeFile("precision-report.json", JSON.stringify({ scanned, rows }, null, 2));
```

```bash
npm pkg set scripts.precision="tsx scripts/omr-precision.ts"
```

- [ ] **Step 2: Obtain an OMR corpus**

The OMR is distributed as per-set files from the LDraw Official Model Repository. Download a sample into `.cache/omr/` (the `omr` link is listed on <https://library.ldraw.org/omr>), then:

Run: `LDCAD_SHADOW_DIR=<path> npm run precision -- .cache/omr`

Expected: a per-rule table. **Every HARD rule should read `keep`.** Anything reading `DEMOTE` or `QUARANTINE` is over-firing on legal building and must be fixed or re-tiered before an agent consumes it.

- [ ] **Step 3: Act on the result**

For each rule not reading `keep`, either fix the predicate or change its `tier` in `rules/lego-build-rules.yaml` to `DISCOURAGED`, recording the measured rate in the rule's `note`. Re-run until the table is clean.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: OMR precision harness with automatic demote/quarantine verdicts"
```

---

## Task 15: Recall fixtures

**Files:**
- Create: `test/fixtures/illegal/*.ldr`, `test/fixtures/legal/*.ldr`, `test/recall.test.ts`

**Interfaces:**
- Consumes: `verifyFile` (Task 13).
- Produces: a fixture suite asserting each implemented rule fires on a violating model and stays silent on its legal near-twin.

- [ ] **Step 1: Write the fixtures**

```bash
mkdir -p test/fixtures/illegal test/fixtures/legal

printf '0 FILE t.ldr\r\n1 16 0 -24 0 1 0 0 0 1 0 0 0 1 3001.dat\r\n' > test/fixtures/illegal/e03-colour16.ldr
printf '0 FILE t.ldr\r\n1 4 0 -24 0 1 0 0 0 1 0 0 0 1 3001.dat\r\n'  > test/fixtures/legal/e03-concrete-colour.ldr

printf '0 FILE t.ldr\r\n1 4 0 24 0 1 0 0 0 1 0 0 0 1 3001.dat\r\n'   > test/fixtures/illegal/e02-positive-y.ldr
printf '0 FILE t.ldr\r\n1 4 0 -24 0 1 0 0 0 1 0 0 0 1 3001.dat\r\n'  > test/fixtures/legal/e02-negative-y.ldr

printf '0 FILE t.ldr\r\n1 4 0 -24 0 1 0.5 0 0 1 0 0 0 1 3001.dat\r\n' > test/fixtures/illegal/e01-sheared.ldr
printf '0 FILE t.ldr\r\n1 4 0 -24 0 0 0 1 0 1 0 -1 0 0 3001.dat\r\n'  > test/fixtures/legal/e01-rotated-y90.ldr

printf '0 FILE t.ldr\r\n1 4 0 -24 0 1 0 0 0 1 0 0 0 1 3040.dat\r\n'  > test/fixtures/illegal/e07-moved-alias.ldr
printf '0 FILE t.ldr\r\n1 4 0 -24 0 1 0 0 0 1 0 0 0 1 3040b.dat\r\n' > test/fixtures/legal/e07-current-part.ldr
```

- [ ] **Step 2: Write the recall test**

Create `test/recall.test.ts`:

```typescript
import { describe, expect, it } from "vitest";
import { verifyFile } from "../src/verify.js";

const OPTS = { libraryRoot: ".cache/ldraw", corpusPath: "rules/lego-build-rules.yaml" };

const CASES: Array<{ rule: string; illegal: string; legal: string }> = [
  { rule: "E-03", illegal: "e03-colour16.ldr", legal: "e03-concrete-colour.ldr" },
  { rule: "E-02", illegal: "e02-positive-y.ldr", legal: "e02-negative-y.ldr" },
  { rule: "E-01", illegal: "e01-sheared.ldr", legal: "e01-rotated-y90.ldr" },
  { rule: "E-07", illegal: "e07-moved-alias.ldr", legal: "e07-current-part.ldr" },
];

async function statusOf(path: string, rule: string) {
  const r = await verifyFile(path, OPTS);
  return r.findings.filter((f) => f.ruleId === rule).map((f) => f.status);
}

describe.each(CASES)("$rule", ({ rule, illegal, legal }) => {
  it("fires on the violating fixture", async () => {
    expect(await statusOf(`test/fixtures/illegal/${illegal}`, rule)).toContain("fail");
  });

  it("stays silent on the legal near-twin", async () => {
    expect(await statusOf(`test/fixtures/legal/${legal}`, rule)).not.toContain("fail");
  });
});

// Pending: L-10 (plate wedged between studs) vs G-01 (tile, legal). These are
// geometrically identical in LDraw and differ only by part class, so the pair
// is recorded here as the acceptance test for L-10 whenever it gains a
// predicate. See Task 12's scope note.
describe.todo("L-10 vs G-01 part-class discrimination");
```

- [ ] **Step 3: Run the recall suite**

Run: `npx vitest run test/recall.test.ts`
Expected: PASS, 8 tests. Requires the parts library from Task 4.

- [ ] **Step 4: Run the whole suite**

Run: `npm test`
Expected: all tests pass; `test/golden.test.ts` skips unless `LDCAD_SHADOW_DIR` is set.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "test: recall fixtures with legal near-twins per rule"
```

---

## Self-review notes

Recorded for the implementer, from checking this plan against the spec.

**Spec coverage.** Every numbered spec section maps to a task: §3.1 → Tasks 1–2; §3.2 → Task 5; §3.3 → Tasks 9–10; §3.4 → Task 6; §3.5 → Task 13; §4 → Tasks 6 and 13; §5 → Task 13 (`exitCodeFor`); §6.1 → Task 14; §6.2 → Task 15; §6.3 → Task 10 step 9; §7 → Tasks 4 and 9; §8 → Task 13.

**Two deliberate deviations from the spec**, both flagged in place rather than silently dropped:

1. **No part-origin table** (Task 5). The spec asks for one; a verifier does not need it, because resolution composes transforms and shadow hotspots already share the part-local frame. It is a generator concern. `E-09` therefore reports `unimplemented`, consistent with its `check: none` in the corpus.
2. **The shadow library is not fetched** (Task 4). The spec says both libraries are fetched and cached. Pinning a mirror URL for a CC BY-SA artefact invites both link rot and a licensing mistake, so the shadow library is supplied by the implementer via `--shadow-dir`. The licence intent — never vendored, never redistributed — is preserved and strengthened.

**Not covered by any task, by design.** §6.4 (differential against LDView) is deferred: it duplicates coverage the unit tests already give for L0–L1 and depends on a headless LDView build. Add it if the L0–L1 predicates ever disagree with a real renderer in the field.

**Deferred rules and why.** `B-03` (stud inflation) stays unregistered per the global constraints — it needs mating-pair exclusion, which only becomes possible after Task 10, and it is the rule where the two research streams conflicted. `L-10` needs a tile-vs-plate part class and an orientation test; Task 15 holds its acceptance test as `describe.todo`. `L-05`, `L-06`, `L-08` need the part-property database and report `unimplemented` until it exists. All of these surface in output rather than being silently absent, which is the point of the registry's `unimplemented` status.
