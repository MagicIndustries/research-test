# LDraw / MPD — Format & Geometric Conventions Reference

Scope: what an agent needs to *emit* valid, correctly-oriented LDraw models, and what can be
*checked* mechanically. Primary sources only; every claim carries a URL. Numbers marked
**(measured)** were computed directly from the official library (`complete.zip`, Parts Update
2026-07) and the LDCad shadow library rather than taken from documentation.

---

## TL;DR — the card

```
1 <colour> x y z a b c d e f g h i <file.dat>     ← 15 tokens then a filename
                └ translation
                       └ 3x3 ROW-MAJOR: (a,b,c) is the FIRST ROW; p' = R·p + T
                         (a,d,g) is where the X axis goes. Transpose if your
                         library is column-major (three.js, glm, numpy flatten).
```

- **−Y is UP.** Stack upward by *decreasing* Y: `y −= 24` per brick, `y −= 8` per plate.
- **Part origin sits on the part's TOP face**; the body hangs down into +Y. A brick on the ground
  has `origin_y = −24`, not 0.
- **20** LDU stud pitch · **24** brick height · **8** plate height · **4** stud height ·
  **6** stud radius · 1 LDU = 0.4 mm.
- **Models use concrete colour codes on type-1 lines. Parts use 16.** Never 24 on a type-1 line.
- **Emit no BFC statements in a model.** They are for part files.
- **`0 STEP` is official. `0 ROTSTEP`, `!LPUB`, `!LEOCAD`, `!LDCAD` are tool extensions.**
- MPD: first `0 FILE` block is the main model; blocks are a **flat list**, nesting is by reference.
- Canonical rotations, all det = +1 and all used verbatim in LDraw's own reference model:
  `1 0 0 0 1 0 0 0 1` (identity) · `0 0 1 0 1 0 -1 0 0` (90° about Y) · `-1 0 0 0 1 0 0 0 -1` (180°).
- **Placement:** for a part `W×D` studs on lattice columns `i₀…`, `j₀…`, resting at height `k` plate
  layers: `origin = (20·i₀ + 10·(W−1), −(8·k + h), 20·j₀ + 10·(D−1))`.
  ⚠ Only valid for fully-studded rectangular parts — **43 % of the library has its origin off the
  footprint centre (measured)**.
- **There is no official connectivity standard.** The LDCad shadow library (CC BY-SA 4.0) is the
  only open one; **81 % effective coverage (measured)**, and *only* if you walk inherited subparts.
- **Nothing open-source does real collision detection.** Correctly-connected parts are *supposed*
  to interpenetrate.

Sections 10 (gotchas), 11 (predicate layers) and 12 (what's actually checkable) are the operational
payload; 1–9 are the reference.

---

**Canonical spec inventory** (LDraw.org Standards Board, [docs index](https://ldraw.org/docs-main.html)):

| Document | Status | URL |
|---|---|---|
| LDraw File Format Specification 1.0.2 (29-Apr-2012) | Official | https://www.ldraw.org/article/218.html |
| Colour Definition (`!COLOUR`) Language Extension (rev. 01-Apr-2025) | Official | https://www.ldraw.org/article/299.html |
| Back Face Culling (BFC) Language Extension (09-Nov-2006) | Official | https://www.ldraw.org/article/415.html |
| Texture Mapping (`!TEXMAP`) | Official | https://www.ldraw.org/texmap-spec.html |
| `!CATEGORY` / `!KEYWORDS` | Official | https://www.ldraw.org/article/340.html |
| MPD + Image Embedding (`!DATA`), Revision 2, 26-May-2020 | Official | https://www.ldraw.org/article/47.html |
| Official Library Header Specification (21-Feb-2025) | Official | https://www.ldraw.org/article/398.html |
| Official Parts Library Specifications | Official | https://www.ldraw.org/article/512.html |
| Official Model Repository (OMR) Specification | Official | https://www.ldraw.org/article/593.html |

Anything **not** in that table (`ROTSTEP`, `!LPUB`, `!LEOCAD`, `!LDCAD`, `BUFEXCHG`, `SYNTH`, `GHOST`)
is a **tool extension**, not a standard. See §7.

**Obtaining the library** (needed for any validation that resolves part numbers):

| Artefact | URL |
|---|---|
| Complete official library (`complete.zip`, ~145 MB, "Parts Update 2026-07") | <https://library.ldraw.org/library/updates/complete.zip> |
| Monthly delta archive | `https://library.ldraw.org/library/updates/lcad<YYMM>.zip` |
| Single raw part file | `https://library.ldraw.org/library/official/parts/<num>.dat` |
| Single raw primitive | `https://library.ldraw.org/library/official/p/<name>.dat` |
| Colour table | <https://library.ldraw.org/library/official/LDConfig.ldr> |
| Update index | <https://library.ldraw.org/updates?latest> |

Contents of `complete.zip` as measured (2026-07): `ldraw/parts/` **24 593** files
(19 477 `!LDRAW_ORG Part` + 5 114 `Shortcut`), `ldraw/parts/s/` 9 179 subparts, `ldraw/p/` 1 782
primitives, `ldraw/p/48/` 926 hi-res, `ldraw/p/8/` 127 lo-res, `ldraw/models/` 144 (including the
reference model `car.ldr`, see §4.5), plus `LDConfig.ldr`, `LDCfgalt.ldr`, `LDConfig_TLG.ldr`.
No `parts.lst` index is shipped — `mklist.exe` (Windows-only, included) generates it; on other
platforms just walk the directory.

BFC statement counts across `ldraw/parts/*.dat`: `0 BFC CERTIFY CCW` × 24 518,
`0 BFC CERTIFY CW` × 74, `0 BFC INVERTNEXT` × 20 538, `0 BFC NOCLIP` × 487, `0 BFC CLIP` × 202.
**No official part is `NOCERTIFY`** — CCW certification is effectively universal.

---

## 1. File format — line types 0–5

Source: <https://www.ldraw.org/article/218.html> (File Format 1.0.2, 29-Apr-2012).

A file is a sequence of lines. The **first token** is the line type. Fields are separated by
"whitespace" = "one or more spaces (#32), tabs (#9), or combination thereof". Empty lines have no
effect. The spec requires DOS/Windows line endings: *"All lines in the file must use the standard
DOS/Windows line termination of `<CR><LF>`."* (In practice every parser accepts `\n`; emit `\r\n`
if you want to be strictly conforming.)

| Type | Syntax | Meaning |
|---|---|---|
| 0 | `0 // <comment>` (preferred) or `0 <comment>` (deprecated) or `0 <META> …` | Comment or META command |
| 1 | `1 <colour> x y z a b c d e f g h i <file>` | Sub-file reference (part / primitive / submodel) |
| 2 | `2 <colour> x1 y1 z1 x2 y2 z2` | Line (edge) between 2 points |
| 3 | `3 <colour> x1 y1 z1 x2 y2 z2 x3 y3 z3` | Filled triangle |
| 4 | `4 <colour> x1 y1 z1 … x4 y4 z4` | Filled quadrilateral |
| 5 | `5 <colour> x1 y1 z1 x2 y2 z2 x3 y3 z3 x4 y4 z4` | Optional (conditional) line: first 2 points are the edge, last 2 are control points |

Type 4 quads: *"The points of the quadrilateral must be declared in either a clockwise (CW) or
counter-clockwise (CCW) order."* Both are legal if consistent; "bow-tie" (self-intersecting)
quads are invalid.

**A model file that an agent emits will contain type-1 lines and almost nothing else.**
Types 2–5 are part-authoring geometry. Do not emit raw triangles in a model.

### 1.1 The type-1 line: exact column order

```
1  <colour>  x y z  a b c d e f g h i  <file>
│     │       │           │              └── filename of referenced file, e.g. 3001.dat
│     │       │           └───────────────── 9 rotation/scale values, ROW-MAJOR
│     │       └───────────────────────────── translation (position of sub-file origin)
│     └───────────────────────────────────── colour code (see §6)
└─────────────────────────────────────────── line type
```

That is 15 tokens between the leading `1` and the filename: **1 colour + 3 translation + 9 matrix**.

### 1.2 Matrix layout and multiplication order — READ THIS TWICE

The spec gives the transform explicitly as:

> `u' = a*u + b*v + c*w + x`
> `v' = d*u + e*v + f*w + y`
> `w' = g*u + h*v + i*w + z`

So the nine values are **row-major** in the sense that `(a b c)` is the **first row** of the 3×3
rotation matrix:

```
      ┌ a b c ┐        ┌ x ┐
  R = │ d e f │    T = │ y │        p' = R·p + T
      └ g h i ┘        └ z ┘
```

The spec presents the 4×4 form two ways and says they are equivalent — this is the source of
essentially all agent errors:

```
 / a d g 0 \        / a b c x \
 | b e h 0 |   or   | d e f y |
 | c f i 0 |        | g h i z |
 \ x y z 1 /        \ 0 0 0 1 /
   row-vector          column-vector
   convention          convention
   (p' = p·M)          (p' = M·p)
```

**Operational rule for an emitter:** write `a b c d e f g h i` such that the *first three numbers
are the first row* of the 3×3 that satisfies `p' = R·p + T` with `p` a column vector. Equivalently,
`(a, d, g)` is the image of the unit X axis, `(b, e, h)` is the image of unit Y, `(c, f, i)` is the
image of unit Z. If you build the matrix by writing down where the axes go, you are writing
**columns**, and you must transpose before serialising.

**Nesting / composition.** A reference inside a referenced file composes as
`M_world = M_parent · M_child` (column-vector convention), i.e. the outer transform is applied
*after* (on the left of) the inner one. Translation composes as
`T_world = R_parent·T_child + T_parent`.

**Identity (no rotation):**
```
1 16 0 0 0 1 0 0 0 1 0 0 0 1 3001.dat
```

**90° about the vertical (Y) axis**, right-handed:
`a b c d e f g h i = 0 0 1 0 1 0 -1 0 0` (det = +1). The opposite direction is `0 0 -1 0 1 0 1 0 0`.
For 180°: `-1 0 0 0 1 0 0 0 -1`.

Scaling and shearing are legal in the matrix (parts are built from unit primitives scaled by the
matrix — see `stud.dat` below), but **models should only ever use pure rotations** for real parts.
A negative determinant mirrors the part; see §5 (BFC) and the gotchas.

---

## 2. MPD — Multi-Part Document

Source: <https://www.ldraw.org/article/47.html> — *"Multi-Part Document (MPD) and Image Embedding
(!DATA) Language Extension"*, Revision 2, 26-May-2020, **ratified official** LDraw.org document.

> "MPD files or 'Multi-Part Documents' are a way to combine several LDraw and encoded binary files
> into one consolidated source."

### 2.1 Statements

| Statement | Syntax | Notes |
|---|---|---|
| `0 FILE` | `0 FILE <filename>` | Begins an LDraw code block named `<filename>` |
| `0 NOFILE` | `0 NOFILE` | No parameters. Ends a block. |
| `0 !DATA` | `0 !DATA <filename>` | Begins a base64 binary block (images/textures) |
| `0 !:` | `0 !: <base64 string>` | One chunk of base64; max line length 80 chars (60 bytes), lengths multiples of 4 |

### 2.2 Rules

- **The first block is the main model.** *"The first block in the MPD is treated as the 'main
  model' — all other files in the MPD will only be rendered if they are referenced by the main
  model, directly or indirectly."* It is *recommended but not required* that the first entry be a
  `0 FILE` block.
- Text appearing **before** the first `0 FILE` / `0 !DATA` is discarded; non-comment code before the
  first block is an **error**.
- `0 NOFILE` is *"only required if the file's contents are followed by non-LDraw content"* (e.g. a
  forum signature). A new `0 FILE` implicitly terminates the previous block. After `0 NOFILE`,
  parsers *"must ignore all content until a new `0 FILE` or `0 !DATA` is found."*
- **Blocks do not nest textually.** They are a flat list. "Nesting" of submodels is purely by
  reference: a type-1 line in block A whose `<file>` matches the `0 FILE` name of block B.
- **Name resolution:** a type-1 filename is matched against the MPD's own `0 FILE` names first,
  then against the parts library. The spec warns: *"There are no clear scoping or namespace rules
  on MPD files,"* so identically-named blocks (or a block named the same as a library part) may
  conflict unpredictably. **Give submodels distinctive names that cannot collide with a part
  number.**
- The MPD spec itself *"makes no mention of `!LDRAW_ORG` directives, header requirements, or
  nesting rules within blocks."* Header expectations come from the OMR spec instead (§7).

### 2.3 Minimal conforming MPD skeleton

```
0 FILE main.ldr
0 My Model
0 Name: main.ldr
0 Author: Some Agent
0 !LDRAW_ORG Unofficial_Model
0 !LICENSE Licensed under CC BY 4.0 : see CAreadme.txt
1 4 0 -24 0 1 0 0 0 1 0 0 0 1 3001.dat
1 4 0 -48 0 1 0 0 0 1 0 0 0 1 wing.ldr
0 STEP
0 NOFILE
0 FILE wing.ldr
0 Wing
0 Name: wing.ldr
0 Author: Some Agent
0 !LDRAW_ORG Unofficial_Model
0 !LICENSE Licensed under CC BY 4.0 : see CAreadme.txt
1 15 0 0 0 1 0 0 0 1 0 0 0 1 3024.dat
0 NOFILE
```

Extension convention: `.mpd` for multi-block files, `.ldr` for single-model files. A single-model
`.ldr` needs no `0 FILE` at all. (A `.ldr` file *may* still contain `0 FILE` blocks; tools treat
the two extensions interchangeably in practice.)

---

## 3. Coordinate system and part-origin conventions

### 3.1 Axes

> *"LDraw uses a right-handed co-ordinate system where -Y is 'up'."*
> — <https://www.ldraw.org/article/218.html>

Consequences an emitter must internalise:

- **+Y is DOWN.** Gravity is +Y. Stacking a brick on another brick makes Y *more negative*.
- The system is right-handed in the usual (X, Y, Z) sense; it is only the *labelling of "up"* that
  is inverted relative to most 3D engines. So a right-handed rotation about +Y, when viewed from
  above (i.e. looking along +Y), appears **clockwise**, not counter-clockwise.
- X and Z are the two horizontal ("ground plane") axes. The stud grid lives in X–Z.

### 3.2 LDU

> "1 brick width/depth = 20 LDU; 1 brick height = 24 LDU; 1 plate height = 8 LDU;
> 1 LDU ≈ 0.4 mm" — <https://www.ldraw.org/article/218.html>

The 0.4 mm figure is a stated approximation but is exact against real LEGO nominal dimensions:
stud pitch 8.0 mm = 20 LDU, brick height 9.6 mm = 24 LDU, plate height 3.2 mm = 8 LDU.

### 3.3 Part origin convention

Source: LDraw.org Official Parts Library Standards — General,
<https://library.ldraw.org/documentation/ldraworg-official-parts-library-standards/general>

> "For parts with studs, the origin of the parts will be the centered on the top most stud group.
> The bottom of studs should lie on the x-z plane (i.e. the bottom of the studs should be at y=0)"

> "In general, parts that have studs should be oriented such that the top studs point up (-y) and
> the bottom tubes point down (+y)."

> "For hinge or hinge like parts, the origin should be at the rotation point"

> "The individual studs on a part should be rotated such that the stud logo appears as it would on
> the real part." / "Subparts that use studs should not be mirrored as this would cause the logo to
> appear mirrored."

So for a normal studded brick/plate: **the origin sits at the centre of the part's top surface**,
the body extends *downward* into +Y, and the studs poke *upward* into −Y from y = 0.

### 3.4 Verified against the actual official library

Files retrieved from `https://library.ldraw.org/library/official/…` (raw `.dat` are fetchable at
`https://library.ldraw.org/library/official/parts/<num>.dat` and
`https://library.ldraw.org/library/official/p/<prim>.dat`).

**`3001.dat` — Brick 2 x 4** (<https://library.ldraw.org/library/official/parts/3001.dat>):
```
0 BFC CERTIFY CCW
1 16 0 0 0 1 0 0 0 1 0 0 0 1 s\3001s01.dat
4 16 -40 0 -20 -40 24 -20 40 24 -20 40 0 -20
4 16 40 0 20 40 24 20 -40 24 20 -40 0 20
```
Body occupies **x ∈ [−40, 40], y ∈ [0, 24], z ∈ [−20, 20]**. 4 studs × 20 = 80 in X, 2 × 20 = 40 in Z,
height 24 downward. Origin = centre of top face.

Its subpart `s/3001s01.dat` (<https://library.ldraw.org/library/official/parts/s/3001s01.dat>) gives
the connection geometry directly:
```
1 16  20 4 0  1 0 0 0 -5 0 0 0 1 stud4.dat      ← underside tube, x=+20
1 16   0 4 0  1 0 0 0 -5 0 0 0 1 stud4.dat      ← underside tube, x=0
1 16 -20 4 0  1 0 0 0 -5 0 0 0 1 stud4.dat      ← underside tube, x=-20
1 16  30 0  10 1 0 0 0 1 0 0 0 1 stud.dat       ← top studs …
1 16  10 0  10 1 0 0 0 1 0 0 0 1 stud.dat
1 16 -10 0  10 1 0 0 0 1 0 0 0 1 stud.dat
1 16 -30 0  10 1 0 0 0 1 0 0 0 1 stud.dat
1 16  30 0 -10 1 0 0 0 1 0 0 0 1 stud.dat
… (8 studs total)
```
**Top stud centres: x ∈ {−30, −10, 10, 30}, z ∈ {−10, 10}, y = 0.**
**Underside tube centres: x ∈ {−20, 0, 20}, z = 0, spanning y = 4 → 24.**
This is the exact ground truth for stud/anti-stud connectivity of a 2×4.

**`3005.dat` — Brick 1 x 1**: `4 16 -10 24 -10 10 24 -10 10 0 -10 -10 0 -10` → x,z ∈ [−10, 10],
y ∈ [0, 24].

**`3024.dat` — Plate 1 x 1**: `4 16 -10 8 -10 10 8 -10 10 0 -10 -10 0 -10` → y ∈ [0, 8]. Plate = 8 LDU.

**`3070b.dat` — Tile 1 x 1 with Groove**: `4 16 -10 0 10 -10 0 -10 10 0 -10 10 0 10` → the top face
is at **y = 0** and the body runs y ∈ [0, 8]. A tile has no studs, and its origin is still on its
**top** surface, coplanar with where a plate's studs would sit. This matters: **a tile and a plate
placed at the same origin have their top surfaces at the same Y**; the tile is simply missing the
4 LDU of stud above it.

**`p/stud.dat` — the stud primitive** (<https://library.ldraw.org/library/official/p/stud.dat>):
```
1 16 0 0 0 6 0 0 0  1 0 0 0 6 4-4edge.dat
1 16 0 -4 0 6 0 0 0 1 0 0 0 6 4-4edge.dat
1 16 0 0 0 6 0 0 0 -4 0 0 0 6 4-4cyli.dat
1 16 0 -4 0 6 0 0 0 1 0 0 0 6 4-4disc.dat
```
**Stud radius 6 LDU (diameter 12), height 4 LDU, occupying y ∈ [−4, 0]** — i.e. 4 LDU *above* the
part origin plane, since −Y is up.

**`32523.dat` — Technic Beam 3**: `4 16 9 10 20 9 -10 20 9 -10 -20 9 10 -20` → the beam is
**centred on its middle pin hole**: y ∈ [−10, 10] (20 LDU thick, one brick-width module), holes at
z ∈ {−20, 0, 20}. Technic beams do **not** follow the studs-on-top origin rule; their origin is the
centre of the central hole, and the beam is 20 LDU wide with the axis of the holes along X.

**`3700.dat` — Technic Brick 1 x 2 with Hole**: pin holes at `1 16 0 10 ±10 … peghole.dat`; studs at
`1 16 ±10 0 0 … stud2.dat`. So for a **Technic brick** (studs-on-top origin), the pin hole axis sits
at **y = +10**, i.e. 10 LDU below the top surface / 14 LDU above the bottom. For a **Technic beam**
(hole-centred origin) the same feature is at y = 0. This 10-vs-0 difference is a classic
mixed-system alignment bug.

### 3.5 Measured bounding boxes (whole library, flattened)

Computed by recursively expanding every type-1 line of the official library
(`complete.zip`, Parts Update 2026-07, <https://library.ldraw.org/library/updates/complete.zip>)
and composing transforms as `M_world = M_parent · M_child`:

```
3005.dat   x[ -10,  10] y[ -4,  24] z[ -10,  10]   Brick  1 x  1
3004.dat   x[ -20,  20] y[ -4,  24] z[ -10,  10]   Brick  1 x  2
3003.dat   x[ -20,  20] y[ -4,  24] z[ -20,  20]   Brick  2 x  2
3001.dat   x[ -40,  40] y[ -4,  24] z[ -20,  20]   Brick  2 x  4
2456.dat   x[ -60,  60] y[ -4,  24] z[ -20,  20]   Brick  2 x  6
3024.dat   x[ -10,  10] y[ -4,   8] z[ -10,  10]   Plate  1 x  1
3710.dat   x[ -40,  40] y[ -4,   8] z[ -10,  10]   Plate  1 x  4
3020.dat   x[ -40,  40] y[ -4,   8] z[ -20,  20]   Plate  2 x  4
3070b.dat  x[ -10,  10] y[  0,   8] z[ -10,  10]   Tile  1 x  1 with Groove
3068b.dat  x[ -20,  20] y[  0,   8] z[ -20,  20]   Tile  2 x  2 with Groove
3700.dat   x[ -20,  20] y[ -4,  24] z[ -10,  10]   Technic Brick  1 x  2 with Hole
32523.dat  x[  -9,   9] y[-10,  10] z[ -29,  29]   Technic Beam  3
3626b.dat  x[ -13,  13] y[ -4,  24] z[ -13,  13]   Minifig Head with Blocked Hollow Stud
3040b.dat  x[ -10,  10] y[ -4,  24] z[ -30,  10]   Slope Brick 45  2 x  1      ← ASYMMETRIC
30363.dat  x[ -20,  20] y[ -4,  24] z[ -70,  10]   Slope Brick 18  4 x  2      ← ASYMMETRIC
```

Three things fall out that contradict naive assumptions:

1. **Studded parts have `y_min = −4`, not 0.** The bounding box includes the studs. The *body* top
   is at y = 0; the studs occupy `[−4, 0]`. Tiles have `y_min = 0` because they have no studs. If
   you use bounding boxes for collision you will get a false positive on every stacked pair.
2. **The origin is NOT the centroid of the footprint for non-rectangular parts.** `3040b.dat`
   (Slope Brick 45 2×1) has exactly **one** stud, located at the origin `(0, 0, 0)`, and its body
   spans `z ∈ [−30, 10]` — the footprint centre is at z = −10, offset a full half-stud-pitch from
   the origin. The spec rule is *"centered on the top most stud group"*
   (<https://library.ldraw.org/documentation/ldraworg-official-parts-library-standards/general>),
   and for a slope the topmost stud group is the single high row, not the whole footprint. **The
   `origin = 20·i₀ + 10·(W−1)` formula in §4.3 is only valid for parts whose entire top surface is
   studded.** For slopes, wedges, brackets, and most non-rectangular parts you must derive the
   offset per part.
3. **Technic beams are 18 LDU thick, not 20** (`32523.dat`: x ∈ [−9, 9]), and 58 long for a nominal
   3-module (z ∈ [−29, 29] vs 3 × 20 = 60) — 1 LDU of clearance at each face. The *pitch* is still
   20; the *solid* is smaller. Bounding-box collision on beams will therefore under-report.

### 3.6 How general are these conventions? (250-part random sample)

Flattened bounding boxes for a random sample of 250 files from `ldraw/parts/`, excluding
`~`-prefixed hidden parts (221 usable):

| Property | Share |
|---|---|
| `y_min == −4` (studs on top, standard studs-up part) | 24 % |
| `y_min == 0` (no top studs — tiles, and parts oriented some other way) | 9 % |
| `y_min` something else | **68 %** |
| Origin **not** at the footprint centre in X/Z | **43 %** |
| Bounding box has **non-integer** LDU coordinates | **60 %** |

Read this as a warning, not a contradiction. The "studs up, origin on the top face, integer grid"
picture is exact for the rectangular System bricks/plates/tiles an emitter will mostly use — but
it describes a **minority of the library**. Minifig parts, wheels, Technic, curved slopes, bars and
clips follow their own conventions. **Do not compute placements from assumed dimensions for any
part outside the verified table in §4.6** — measure the actual `.dat`, or use connectivity data
(§8).

**Origin cheat-sheet:**

| Part family | Origin location | Body extent in Y |
|---|---|---|
| Brick (studs up) | centre of top face, studs above | `[0, +24]` |
| Plate | centre of top face | `[0, +8]` |
| Tile | centre of top face (no studs) | `[0, +8]` |
| Baseplate | centre of top face | `[0, +4]` typically |
| Technic brick | centre of top face (studded rule); hole axis at y=+10 | `[0, +24]` |
| Technic beam (studless) | centre of the central pin hole | `[-10, +10]` |
| Hinge / rotating part | at the rotation point | varies |

---

## 4. LDU grid arithmetic for an emitter

### 4.1 Constants

```
STUD_PITCH   = 20   LDU   (X and Z)
PLATE_H      =  8   LDU   (Y)
BRICK_H      = 24   LDU   = 3 × PLATE_H
STUD_H       =  4   LDU   (protrudes into -Y)
STUD_RADIUS  =  6   LDU   (diameter 12)
1 LDU        =  0.4 mm
```

Measured from the official primitives (`https://library.ldraw.org/library/official/p/<name>.dat`):

| Primitive | Description line | Geometry |
|---|---|---|
| `stud.dat` | `Stud` | solid stud, r = 6, y ∈ [−4, 0] |
| `stud2.dat` | `Stud Open` | hollow stud, inner r = 4, outer r = 6, y ∈ [−4, 0] |
| `stud3.dat` | `Stud Tube Solid` | solid underside tube |
| `stud4.dat` | `Stud Tube Open` | underside tube, **inner r = 6, outer r = 8** |
| `peghole.dat` | `Peg Hole End` | Technic pin hole: bore r = 6, outer boss r = 8, depth 2 |
| `axlehole.dat` | `Technic Axle Hole Closed` | cross-axle bore, circumscribed r = 6 |

Two facts that fall out and matter for a connectivity/collision predicate:
- **A stud (r = 6) mates exactly with the bore of an open stud tube (inner r = 6).** The
  stud↔anti-stud fit is an exact-radius fit in LDraw's idealised geometry, so a collision test with
  zero tolerance will report every legitimate connection as an interference. Any geometric checker
  must shrink parts or special-case the stud/tube pair.
- **A Technic pin hole bore is r = 6**, the same as a stud — pin holes and studs are the same
  nominal diameter (12 LDU / 4.8 mm).

### 4.2 Sign conventions

- Ground plane: **y = 0**, and the world extends upward into **negative Y**.
- A part whose origin is on its top face and whose body is `[0, h]` sits **on** a surface at
  height `y = Y_surface` when `origin_y = Y_surface − h`. (Because the body hangs *down* from the
  origin into +Y.)
- **Going up one plate: `y -= 8`. Going up one brick: `y -= 24`.**
- Stud tops are at `origin_y − 4`, but you do **not** account for the stud when stacking: a brick
  placed on a brick has its bottom flush with the lower brick's top face; the stud is swallowed by
  the anti-stud recess.

### 4.3 Stud-grid ↔ LDU mapping

Define an integer stud lattice `(i, j)` with **stud centres at `x = 20·i`, `z = 20·j`**.
A part `W` studs wide in X and `D` studs deep in Z, occupying stud columns
`i ∈ [i₀, i₀+W−1]`, `j ∈ [j₀, j₀+D−1]`, has origin:

```
origin_x = 20·i₀ + 10·(W − 1)
origin_z = 20·j₀ + 10·(D − 1)
```

Equivalently: the origin is the **centroid of the occupied stud columns**. For even W the origin
lands halfway between two lattice lines (a multiple of 20 plus 10); for odd W it lands on a
lattice line.

Layer index `k` counting plate layers upward from the ground (k = 0 is the bottom layer):
```
origin_y = −(8·k + h)      where h = part body height (8 for a plate/tile, 24 for a brick)
```

### 4.4 Worked example — 2×4 brick

Goal: a **red (colour 4) 2×4 brick** occupying stud columns `i = 0..3`, `j = 0..1`, resting on the
ground plane, long axis along X.

- `W = 4, D = 2, i₀ = 0, j₀ = 0`
- `origin_x = 20·0 + 10·(4−1) = 30`
- `origin_z = 20·0 + 10·(2−1) = 10`
- Ground layer, brick body 24 tall → `origin_y = −24`

```
1 4 30 -24 10 1 0 0 0 1 0 0 0 1 3001.dat
```
Check: body spans x ∈ [30−40, 30+40] = [−10, 70]; stud centres land at x = 0, 20, 40, 60 ✓
(= 20·i for i = 0..3), z ∈ [10−20, 10+20] = [−10, 30], stud centres at z = 0, 20 ✓,
y ∈ [−24, 0] ✓ (top at −24, bottom on the ground).

**Same brick rotated 90° (long axis along Z)**, occupying `i = 0..1`, `j = 0..3`:
```
origin_x = 20·0 + 10·(2−1) = 10
origin_z = 20·0 + 10·(4−1) = 30
1 4 10 -24 30 0 0 1 0 1 0 -1 0 0 3001.dat
```
(The part's own local footprint is still 80×40; the matrix swaps its X and Z extents.)

**Stack a second 2×4 directly on top:** same X/Z, `origin_y = −48`.
```
1 14 30 -48 10 1 0 0 0 1 0 0 0 1 3001.dat
```

**Put a 1×1 plate (3024) on top of that brick**, on stud column `(i,j) = (1,0)`:
```
origin_x = 20·1 + 10·(1−1) = 20 ; origin_z = 0 ; origin_y = −48 − 8 = −56
1 15 20 -56 0 1 0 0 0 1 0 0 0 1 3024.dat
```

**Half-stud offsets** (jumper plates, SNOT) land on multiples of 10, not 20. Anything landing on a
non-multiple of 10 in X/Z, or a non-multiple of 4 in Y, is almost certainly a bug — see §10.

### 4.5 The official reference model — every convention in one file

`models/car.ldr`, shipped inside `complete.zip`, authored by James Jessiman (LDraw's creator). It
is the canonical "this is what a model file looks like" artefact:

```
0 Example Car for Demonstration of LDRAW Library
0 Name: car.ldr
0 Author: James Jessiman

0 // This file demonstrates how you can assemble a model from part files.
0 // Each line starting with "1" adds one part. It states its color, position and orientation.
0 // Each line reading "0 STEP" begins another step in building the model.

1 0 0 0 -90  1 0 0 0 1 0 0 0  1 4315.dat
1 7 0 0 -60  1 0 0 0 1 0 0 0  1 4600.dat
1 0 0 0   0  1 0 0 0 1 0 0 0  1 3031.dat
1 7 0 0  60  1 0 0 0 1 0 0 0  1 4600.dat
1 0 0 0  90 -1 0 0 0 1 0 0 0 -1 4315.dat

0 STEP

1 46  30 -8 -90  1 0 0 0 1 0  0 0 1 3024.dat
1 46 -30 -8 -90  1 0 0 0 1 0  0 0 1 3024.dat
1  4   0 -8 -60  0 0 1 0 1 0 -1 0 0 3020.dat
…
```

Observations, all confirming the rules above:
- **No `0 FILE`** — a single-model `.ldr` doesn't need one.
- **No `0 !LDRAW_ORG` / `0 !LICENSE`.** This file predates the OMR spec. Real-world LDraw files
  routinely lack the full header; a *parser* must tolerate that, even though an *emitter* should
  include it.
- **Every type-1 line uses a concrete colour** (0 black, 7 grey, 46 trans-yellow, 4 red, 1 blue).
  **Colour 16 appears nowhere.**
- **Every Y value is 0 or negative** as the model builds upward: the distribution across all
  type-1 lines is `y ∈ {−96, −88, −40, −32, −24, −22, −16, −8, 0, 6}` — i.e. going up = more
  negative, exactly one row at +6 (parts hanging below the chassis).
- **Only three distinct matrices appear**, and they are exactly the canonical ones from §1.2:
  `1 0 0 0 1 0 0 0 1` (identity), `-1 0 0 0 1 0 0 0 -1` (180° about Y, det = +1),
  `0 0 1 0 1 0 -1 0 0` (90° about Y, det = +1).
- **`0 STEP` separates build steps**; no `ROTSTEP`, no tool metas.

An agent that emits files structurally identical to `car.ldr` will be correct.

### 4.6 Verified common part numbers

Each description below is the literal first line of the official `.dat`, fetched from
`https://library.ldraw.org/library/official/parts/<n>.dat`. A 404 from that URL is a reliable
signal that a guessed part number is wrong.

| File | Description (from the file) | W×D studs | Body height |
|---|---|---|---|
| `3005.dat` | `Brick  1 x  1` | 1×1 | 24 |
| `3004.dat` | `Brick  1 x  2` | 1×2 | 24 |
| `3622.dat` | `Brick  1 x  3` | 1×3 | 24 |
| `3009.dat` | `Brick  1 x  6` | 1×6 | 24 |
| `3003.dat` | `Brick  2 x  2` | 2×2 | 24 |
| `3002.dat` | `Brick  2 x  3` | 2×3 | 24 |
| `3001.dat` | `Brick  2 x  4` | 2×4 | 24 |
| `2456.dat` | `Brick  2 x  6` | 2×6 | 24 |
| `3024.dat` | `Plate  1 x  1` | 1×1 | 8 |
| `3710.dat` | `Plate  1 x  4` | 1×4 | 8 |
| `3020.dat` | `Plate  2 x  4` | 2×4 | 8 |
| `3070b.dat` | `Tile  1 x  1 with Groove` | 1×1 | 8 |
| `3068b.dat` | `Tile  2 x  2 with Groove` | 2×2 | 8 |
| `3700.dat` | `Technic Brick  1 x  2 with Hole` | 1×2 | 24 (hole axis at y=+10) |
| `32523.dat` | `Technic Beam  3` | — | 20 (hole-centred origin) |
| `3040.dat` | `~Moved to 3040b` — **deprecated alias**, use `3040b.dat` | — | — |

Note the LDraw-vs-BrickLink numbering divergence: LDraw `3070b` records
`0 !KEYWORDS BrickLink 3070` in its header.

---

## 5. BFC — Back Face Culling

Source: <https://www.ldraw.org/article/415.html> (ratified 09-Nov-2006).

Permissible statements (all **case-sensitive, uppercase**):
```
0 BFC NOCERTIFY
0 BFC CERTIFY
0 BFC CERTIFY CW
0 BFC CERTIFY CCW
0 BFC CW
0 BFC CCW
0 BFC CLIP
0 BFC CLIP CW
0 BFC CLIP CCW
0 BFC NOCLIP
0 BFC INVERTNEXT
```

- **Default winding is CCW.** `0 BFC CERTIFY` alone ⇒ CCW.
- A file with **no** BFC statement defaults to `0 BFC NOCERTIFY` — BFC processing off.
- `0 BFC CERTIFY` must appear **before the first operational (non-comment) line**.
- Inheritance: *"a file is only treated as being BFC-compliant if it and all of its superfiles are
  compliant"* — **except** part files, which may be treated as certified regardless of the caller,
  because parts are *"complex closed solids"* that never require inversion.
- `0 BFC INVERTNEXT` inverts the winding of the **immediately following type-1 line only**. It
  *"may only be used immediately before a subfile command line"* and *"should never be used before
  a part."*
- **Negative-determinant matrices**: when the orientation matrix determinant is negative the
  renderer must *"switch the expected winding of the polygon vertices"* automatically.
  `INVERTNEXT` is applied **in addition to** that automatic inversion, so the two *"effectively
  cancel each other out."*

### When a generating agent must care

**Almost never, if you are emitting model files.** A model made of type-1 references to official
parts inherits each part's own certification, and the part-file exemption means those parts render
correctly whether or not your model file says anything about BFC. Practical guidance:

- **Emitting a model (.ldr/.mpd of type-1 part references): omit all BFC statements.** Do not emit
  `0 BFC CERTIFY CCW` in a model — it is meaningless there and, if you also emit raw polygons with
  inconsistent winding, actively harmful.
- **Emitting a part file (types 2–5 geometry): BFC is mandatory** for the official library. Official
  parts carry `0 BFC CERTIFY CCW` in the header (verified on `3001.dat`, `3024.dat`, `3070b.dat`,
  `32523.dat`, `p/stud.dat`).
- **Never emit `INVERTNEXT` in a model.**
- If you emit a **mirrored** part placement (negative-determinant matrix) it will render correctly
  as far as BFC goes, but see the parts-library rule that studs must not be mirrored (§3.3) — a
  mirrored stud shows a mirrored logo.

---

## 6. Colour

Sources: <https://www.ldraw.org/article/218.html> (colour semantics),
<https://www.ldraw.org/article/299.html> (`!COLOUR` extension),
`LDConfig.ldr` itself (<https://library.ldraw.org/library/official/LDConfig.ldr>).

### 6.1 LDConfig.ldr

The official colour table is a `0 !LDRAW_ORG Configuration` file shipped with the library. Each
colour is one line:

```
0 !COLOUR name CODE x VALUE v EDGE e [ALPHA a] [LUMINANCE l] [ <finish> ]
```
- `CODE x` — LDraw colour code (0–511 for compatibility)
- `VALUE v` — 24-bit RGB, hex, `#` or `0x` prefixed
- `EDGE e` — contrasting edge colour (a code or an RGB value)
- `ALPHA a` — 0–255; standard transparent colours use 128
- `LUMINANCE l` — 0–255 for glow
- `<finish>` — one of `CHROME | PEARLESCENT | RUBBER | MATTE_METALLIC | METAL | MATERIAL`;
  `MATERIAL` further takes `GLITTER | SPECKLE | FABRIC` (`FABRIC` → `VELVET|CANVAS|STRING|FUR`)

Real lines from the shipped file (current header: `0 !LDRAW_ORG Configuration UPDATE 2026-05-29`):
```
0 !COLOUR Trans_Clear   CODE  47  VALUE #FCFCFC  EDGE #C9C9C9  ALPHA 128
0 !COLOUR Main_Colour   CODE  16  VALUE #FFFF80  EDGE #333333
0 !COLOUR Edge_Colour   CODE  24  VALUE #7F7F7F  EDGE #333333
```

Common codes an emitter will actually use: `0` Black, `1` Blue, `2` Green, `4` Red, `14` Yellow,
`15` White, `71` Light_Bluish_Gray, `72` Dark_Bluish_Gray, `70` Reddish_Brown, `47` Trans_Clear.
Always resolve names from the shipped `LDConfig.ldr` rather than from memory.

### 6.2 Colour 16 and 24

From <https://www.ldraw.org/article/218.html>:

> **16 (Main Colour):** "When a sub-file is referenced by another file all the colour 16 command
> lines are displayed using the colour of the line that referenced it."
>
> **24 (Complement Colour):** "When a sub-file is referenced by another file all the colour 24
> command lines are displayed using the complement colour of the line that referenced it."

Additional stated rules:
- Colour 24 is for **line types 2 and 5 only**: *"Use of colour 24 for line types other than 2 and 5
  is strongly discouraged."*
- Type-1 lines *"should never use the colour 24"* — the complement of a complement is undefined.

### 6.3 The rule an emitter needs

| Context | Colour to use on a type-1 line |
|---|---|
| **Model file**, referencing a real part | A **concrete** code (4, 15, 71, …). This is where the part's actual colour is decided. |
| **Model file**, referencing a **submodel** | Concrete code if the whole submodel should take one colour; otherwise **16**, and let the submodel's own lines carry concrete colours. Using 16 at the top level of a model means "inherit from my caller" — and the top-level model has no caller, so it renders as the fallback `#FFFF80` mustard yellow. |
| **Part file**, referencing a subpart/primitive | **16** — so the part inherits the model's colour. Verified: `3001.dat` uses `1 16 … s\3001s01.dat`. |
| **Part file**, hard-coded colour detail (e.g. a printed element) | Concrete code. |
| Any file, type 2/5 edge lines | **24** |

**Top-level rule of thumb: a model's type-1 lines take real colour codes; a part's take 16.**

### 6.4 Direct / extended colours

> "Direct colour numbers represent RGB values as `0x2RRGGBB`, where RRGGBB is the exact RGB value in
> hexadecimal notation." Example: `0x2008000` = dark green (0, 128, 0). *All hex letters must be
> uppercase.* — <https://www.ldraw.org/article/218.html>

Direct colours are legal but **discouraged for generated models** — they bypass the palette, break
parts lists / BOM generation in LPub and Studio, and correspond to no real LEGO element.

---

## 7. Header & meta conventions for MODEL files

### 7.1 Official model header (OMR spec)

Source: <https://www.ldraw.org/article/593.html>. Required order:

```
0 FILE <Filename>.ldr
0 <Individual filename>                          ← the description line
0 Name: <Filename>.ldr
0 Author: <Author Name> [Username]
0 !LDRAW_ORG Model                               ← or Unofficial_Model
0 !LICENSE Licensed under CC BY 4.0 : see CAreadme.txt
0 !THEME <Theme name>                            ← optional
0 !KEYWORDS words, more words, …                 ← optional
0 !HISTORY YYYY-MM-DD [Username] Free text       ← optional
```

Everything above `!THEME` is **required**; `!THEME`, `!KEYWORDS`, `!HISTORY` are optional.
`!LDRAW_ORG` for a model is `Model` or `Unofficial_Model` (an agent-generated model should say
**`Unofficial_Model`**).

OMR MPD naming: `<Set Number>[-<Qualifier>] - <Set Name>[ - <Sub Model Name>]`, and subfiles
`<Set Number>[-<Qualifier>] - <Individual filename>`. (Only relevant if targeting the OMR itself.)

The OMR spec says **nothing** about STEP or ROTSTEP.

### 7.2 Header spec for part files (different — don't mix them up)

Source: <https://www.ldraw.org/article/398.html> (21-Feb-2025). Order:
`0 PartDescription` / `0 Name: Filename.dat` / `0 Author: RealName [UserName]` /
`0 !LDRAW_ORG <type> <ORIGINAL|UPDATE YYYY-RR>` / `0 !LICENSE …` / optional metas / geometry.

Valid `!LDRAW_ORG` types: `Part | Subpart | Primitive | 8_Primitive | 48_Primitive | Shortcut`
(+ `Unofficial_` prefixed variants), with optional qualifiers `Alias`, `Physical_Colour`
(deprecated), `Flexible_Section`. Valid `!LICENSE` strings:
`"Licensed under CC BY 4.0 : see CAreadme.txt"`,
`"Licensed under CC BY 2.0 and CC BY 4.0 : see CAreadme.txt"`,
`"Redistributable under CCAL version 2.0 : see CAreadme.txt"` (deprecated),
`"Not redistributable : see NonCAreadme.txt"`.
Other optional metas: `0 !HELP`, `0 !CATEGORY`, `0 !KEYWORDS`, `0 !CMDLINE`, `0 !HISTORY`,
`0 BFC …` (required for official parts), `0 !PREVIEW <colour> x y z a b c d e f g h i`.

### 7.3 Official vs tool extension — the classification table

| Meta | Status | Defined by |
|---|---|---|
| `0 STEP` | **Official** — "Marks the end of a building step" | [File Format Spec](https://www.ldraw.org/article/218.html) |
| `0 WRITE` / `0 PRINT`, `0 CLEAR`, `0 PAUSE`, `0 SAVE` | **Official** (legacy LDraw DOS viewer commands; inert in modern tools) | [File Format Spec](https://www.ldraw.org/article/218.html) |
| `0 !LDRAW_ORG` | **Official** | [218](https://www.ldraw.org/article/218.html), [398](https://www.ldraw.org/article/398.html) |
| `0 !LICENSE`, `0 !HELP`, `0 !CMDLINE`, `0 !HISTORY` | **Official** (Header Spec, not the File Format Spec) | [398](https://www.ldraw.org/article/398.html) |
| `0 !CATEGORY`, `0 !KEYWORDS` | **Official** language extension | [340](https://www.ldraw.org/article/340.html) |
| `0 BFC …` | **Official** language extension | [415](https://www.ldraw.org/article/415.html) |
| `0 !COLOUR …` | **Official** language extension | [299](https://www.ldraw.org/article/299.html) |
| `0 !TEXMAP …` | **Official** language extension | [texmap-spec](https://www.ldraw.org/texmap-spec.html) |
| `0 FILE`, `0 NOFILE`, `0 !DATA`, `0 !:` | **Official** language extension | [47](https://www.ldraw.org/article/47.html) |
| `0 !THEME` | **Official** (OMR only) | [593](https://www.ldraw.org/article/593.html) |
| **`0 ROTSTEP`** | **Tool extension (MLCad)** — *not* an LDraw standard | [wiki: unofficial metas](https://wiki.ldraw.org/index.php?title=List_of_Known_Unofficial_META_Commands) |
| `0 BUFEXCHG`, `0 GHOST`, `0 MLCAD …`, `0 ROTATION CENTER/CONFIG/AXLE` | Tool extension (MLCad) | [same](https://wiki.ldraw.org/index.php?title=List_of_Known_Unofficial_META_Commands) |
| `0 !LPUB …` / `0 LPUB …` | Tool extension (LPub / LPub3D) | [same](https://wiki.ldraw.org/index.php?title=List_of_Known_Unofficial_META_Commands) |
| `0 SYNTH …` | Tool extension (LSynth) | [same](https://wiki.ldraw.org/index.php?title=List_of_Known_Unofficial_META_Commands) |
| `0 !LEOCAD …` | Tool extension (LeoCAD) | [leocad.org/docs/meta.html](https://www.leocad.org/docs/meta.html) |
| `0 !LDCAD …` | Tool extension (LDCad) | see §8 |
| `0 L3P …`, LDLite `COLOR/TRANSLATE/ROTATE/…` | Tool extension (L3P, LDLite) | [same](https://wiki.ldraw.org/index.php?title=List_of_Known_Unofficial_META_Commands) |

### 7.4 `0 ROTSTEP` syntax (since agents will be asked for it)

```
0 ROTSTEP <x-angle> <y-angle> <z-angle> [ REL | ADD | ABS ]
0 ROTSTEP END
```
`ABS` = absolute rotation, `REL` = relative to the default view matrix, `ADD` = additive to the
current rotation, `END` = terminate the rotation state. Semantics differ between tools: MLCad
treats a `ROTSTEP` as a step boundary in its own right, whereas LPub3D uses `ROTSTEP` only to set
orientation and requires a paired `0 STEP` to actually break the step.
(<https://wiki.ldraw.org/index.php?title=List_of_Known_Unofficial_META_Commands>,
<https://trevorsandy.github.io/lpub3d/>)

### 7.4a `!TEXMAP` (official, but rarely needed by a model emitter)

Ratified 01-Aug-2020, <https://www.ldraw.org/texmap-spec.html>:
```
0 !TEXMAP (START | NEXT) <PLANAR|CYLINDRICAL|SPHERICAL> <params> <pngfile> [GLOSSMAP <pngfile>]
0 !: <textured geometry>
0 !TEXMAP FALLBACK
<untextured fallback geometry>
0 !TEXMAP END
```
Parameter counts: `PLANAR` 9, `CYLINDRICAL` 10, `SPHERICAL` 11. The `0 !:` prefix marks geometry
*"that will be ignored by renderers that do not support the !TEXMAP meta-statement."*
Applies to both part and model files, but an agent emitting a model of stock parts will never need
it (stickers and prints are baked into the part files). Note the `0 !:` prefix is shared with the
MPD `!DATA` base64 syntax — disambiguated by the enclosing block.

### 7.5 LeoCAD metas (<https://www.leocad.org/docs/meta.html>)

```
0 !LEOCAD MODEL NAME <name>
0 !LEOCAD MODEL AUTHOR <name>
0 !LEOCAD MODEL DESCRIPTION <description>
0 !LEOCAD MODEL BACKGROUND COLOR <r g b>
0 !LEOCAD MODEL BACKGROUND GRADIENT <r1 g1 b1 r2 g2 b2>
0 !LEOCAD MODEL BACKGROUND IMAGE [TILE] NAME <filename>
0 !LEOCAD PIECE STEP_HIDE <step>
0 !LEOCAD PIECE HIDDEN
0 !LEOCAD PIECE POSITION_KEY <time x y z>
0 !LEOCAD PIECE ROTATION_KEY <time a b c d e f g h i>
0 !LEOCAD PIECE PIVOT <x y z a b c d e f g h i>
0 !LEOCAD GROUP BEGIN <name>
0 !LEOCAD GROUP END
0 !LEOCAD CAMERA {HIDDEN|ORTHOGRAPHIC|FOV <a>|ZNEAR <d>|ZFAR <d>|POSITION <x y z>|
                  TARGET_POSITION <x y z>|UP_VECTOR <x y z>|NAME <name>| …_KEY <time …>}
```
Note `PIECE ROTATION_KEY` and `PIECE PIVOT` reuse the **same 9-value `a…i` ordering** as a type-1
line. Camera commands may be grouped on one line.

**Recommendation for a generating agent: emit none of these.** A plain MPD with official headers,
concrete colours, `0 STEP` boundaries and nothing else opens correctly in LDView, LeoCAD, LDCad,
LPub3D and Studio.

---

## 8. Connectivity and collision metadata

**Headline finding: there is no official LDraw connectivity standard.** The
[LDraw.org documentation index](https://ldraw.org/docs-main.html) lists no connectivity
specification, and the LDraw.org forum thread "Part Connectivity" (Miguel Reizinho / Roland Melkert,
1–5 Aug 2021, <https://forums.ldraw.org/thread-24765.html>) confirms it: the only two systems in
existence are **LDCad's shadow library** (`0 !LDCAD SNAP_*` metas, human-readable, community-
maintained by LDCad's author Roland Melkert) and **BrickLink Studio's** connectivity data
(proprietary and, per that thread, *"non-human-readable"*, authored via Studio's Part Designer).
The thread records that **no direct import mechanism exists between the two**.

### 8.1 LDCad shadow library — what it is

Primary sources: <https://www.melkert.net/LDCad/tech/shadowLib>,
<https://www.melkert.net/LDCad/tech/meta>, and the canonical repo
<https://github.com/RolandMelkert/LDCadShadowLibrary>.

A shadow library is *"a collection of LDraw (part) files organized identical to an official LDraw
library release."* When bound to a library location, *"if `3001.dat` is loaded from the official
library's parts folder LDCad will check if there's also a `3001.dat` inside the shadow location's
parts folder, if so it will also load that file"* and merge the metas into the in-memory part.
The repo's `CONTRIBUTING.md` states the merge rule exactly: **"LDCad will combine the LDraw.org and
shadow content of the same name during loading before processing it as a single text file."**

**Parser model: concatenate `official/<path>` + `shadow/<path>`, then parse once.** The snap metas
then live in that part file's own coordinate system.

Why it exists (repo README): *"the LDraw format currently doesn't provide needed information for
accurate part snapping and mirroring (while keeping valid model level matrices)."*

**Layout and packaging**

| Path | Contents |
|---|---|
| `<install>/seeds/shadow.sf` | Seed zip shipped with LDCad |
| `<userdata>/shadow/offLib/offLibShadow.csl` | The default library. `.csl` = "Compressed Shadow Library == plain zip file" |
| repo `/p/` | 87 `.dat` (mirrors LDraw `p/`) |
| repo `/parts/` | 3 333 `.dat` |
| repo `/parts/s/` | 831 `.dat` |
| | **4 251 files total.** No `p/48/` hi-res tree. |

Binding is via LDCad Prefs → LDraw → Search (library) paths, shadow column (folder or `.csl`/zip).

**License: CC BY-SA 4.0** (<https://github.com/RolandMelkert/LDCadShadowLibrary/blob/main/LICENSE.md>);
every file carries `0 !LICENSE CC BY-SA 4.0, see LICENSE.md`. Note this is **stricter than the
LDraw parts library itself** (CC BY 4.0) — the ShareAlike obligation propagates to derived
connectivity datasets. LDCad the application is closed-source and *"completely free for personal
(non commercial) and educational use"* (<https://www.melkert.net/LDCad/download>); current release
1.7 Beta 2b.

Raw machine-readable access:
`https://raw.githubusercontent.com/RolandMelkert/LDCadShadowLibrary/main/{p,parts,parts/s}/<name>.dat`.
A third-party mirror exists at <https://github.com/MilanV/ldraw-shadow-offLib> but declares **no
license** — prefer the canonical repo.

**Inheritance is the key architectural fact.** `CONTRIBUTING.md`: *"It is always best to add
information to files high in the recursion tree. This way other (future) parts might inherit the
same information without having to define them again. […] When working with `3001.dat` (2x4 brick)
you'll see all of its shadow information comes from the `s\3001s01.dat` file."* Consequently
**`3001.dat` has no shadow file at all** — snap info propagates up the type-1 chain, each parent
applying its own matrix. `p/stud.dat` carries one male cylinder, and every part referencing it
inherits a stud.

Anatomy of a shadow file (`parts/3701.dat`, Technic Brick 1×4 with Holes):
```
0 LDCad shadow info for "Technic Brick  1 x  4 with Holes"
0 Author: LDCad Shadow Library
0 !LICENSE CC BY-SA 4.0, see LICENSE.md
0 !HISTORY 2013-11-25 {Roland Melkert} Initial info for 3701.dat

0 //Peg holes
0 !LDCAD SNAP_INCL [ref=connhole.dat] [pos=0 10 0] [ori=1 0 0 0 0 1 0 -1 0] [grid=C 3 1 20 0]
0 //Antistuds
0 !LDCAD SNAP_CYL [gender=F] [caps=one] [secs=S 6 4] [pos=0 24 0] [grid=C 4 1 20 0]
```
Two lines cover the whole part. Contribution rule: *"Besides a subset of header metas only LDCad
SNAP, MIRROR and HINTS metas are allowed."*

**Meta frequency across the current library:**

| Meta | Lines |
|---|---:|
| `SNAP_CYL` | 6 647 |
| `SNAP_INCL` | 503 |
| `MIRROR_INFO` | 483 |
| `SNAP_FGR` | 335 |
| `SNAP_CLEAR` | 331 |
| `SNAP_GEN` | 328 |
| `SNAP_CLP` | 160 |
| `HINTS` | 13 |
| `SNAP_SPH` | **0** (deprecated) |

### 8.2 `0 !LDCAD` generic grammar

- Line starts `0 !LDCAD`, then one keyword, then optional `[option=value]` parameters space-separated.
- Values may not contain `[` or `]`, so `\[([^=\]]+)=([^\]]*)\]` is a safe scan.
- **Property names are case-insensitive in practice** — the library contains both `[id=axleHole]`
  (74×) and `[ID=axleHole]` (109×).
- **Array values are separated by runs of whitespace**, e.g. `[secs=R 8 2   R 6 16   R 8 2]`.
  Split on `\s+`, not a single space.
- The `] [` separator space is sometimes omitted (`[group=techBallJnt][match=size]`). Tolerate it.
- An empty parameter list is legal: `0 !LDCAD SNAP_CLEAR `, `0 !LDCAD HINTS `.
- Floats always use `.` as decimal separator regardless of OS locale.

**`pos=` is a plain LDU vector** in the containing file's coordinate system. No snap property is
ever in mm or %.

**`ori=` uses exactly the same 9-value row order as the trailing nine numbers of a type-1 line**
— the LDCad docs type it as *"Orientation matrix in the same order as the last nine numbers of a
LDraw matrix."* Applied as `p' = ori·p + pos`.

**Rest direction — the convention that makes everything legible.** `CONTRIBUTING.md`:
**"All info points into the negative Y-axis when at rest."** The canonical alternates it tabulates:
```
Neg Y (base)  1 0 0 0 1 0 0 0 1
Pos Y         1 0 0 0 -1 0 0 0 -1
Neg X         0 1 0 -1 0 0 0 0 1
Pos X         0 -1 0 1 0 0 0 0 1
Neg Z         1 0 0 0 0 -1 0 1 0
Pos Z         1 0 0 0 0 1 0 -1 0
```
Each was verified by computing `M·(0,−1,0)` under row-major interpretation — all six produce the
labelled axis, independently confirming both the ordering and the local−Y hotspot axis.

Precision warning from the repo: *"Use plenty of digits for sin/cos values, or it WILL affect
snapping precision in the y direction of the info. for example: 45 deg sin: 0.70710678, 60 deg
sin: 0.86602544"*.

### 8.3 `SNAP_CYL` — the workhorse (holes, pins, studs, anti-studs)

*"The cylinder meta is the main workhorse among the snap info metas."*
```
0 !LDCAD SNAP_CYL [id=connhole] [gender=F] [caps=none] [secs=R 8 2 R 6 16 R 8 2] [center=true] [slide=true] [pos=0 0 0] [ori=1 0 0 0 1 0 0 0 1]
```

| Property | Type | Default | Meaning |
|---|---|---|---|
| `id`/`ID` | string | — | Identifier that `SNAP_CLEAR` can target |
| `group` | string | — | *"limit potential matches to only snap info having the same group string"* |
| `pos` | vector | `0 0 0` | LDU position in containing file's frame |
| `ori` | 3×3 | identity | Row-major, as a type-1 line's last nine |
| `gender` | enum | `male` | `M` = pen/pin/stud, `F` = hole/anti-stud |
| `secs` | array | — | Section profile, see below |
| `caps` | enum | `one` | End caps, see below |
| `grid` | array | — | Repeat pattern, see §8.7 |
| `center` | bool | `false` | *"Center align Y size"* — recentre the section stack on `pos` |
| `slide` | bool | `false` | *"…'smooth' enough to make sliding of matching parts possible"*. If either side sets it, sliding is allowed; otherwise it just snaps. Recommended for clips/bushes/gears, **not** studs |
| `scale` | enum | `none` | Inheritance gate under scaled refs: `none` / `YOnly` / `ROnly` / `YandR` |
| `mirror` | enum | **`cor`** | Inheritance under mirrored refs: `none` / `cor` / `corX` / `corY` / `corZ` |

**`secs=` — section profile.** *"blocks of: `shapeVariant radius length`"*, stacked from the
hotspot origin along local **−Y** in written order.

| Token | Meaning | Count in library |
|---|---|---:|
| `R` | Round | 6 693 |
| `A` | Axle (Technic cross profile) | 407 |
| `S` | Square | 1 366 |
| `_L` | *"Flexible radius wise extension to the previous block"* (compressible pin tip) | 107 |
| `L_` | *"Same as `_L` but as an extension to the next section"* | 22 |

Documented examples: *"a plain stud can be described using a single block: `R 8 4` while a technic
beam hole needs three: `R 8 2 R 6 16 R 8 2`."* Real `_L` use, `p/connect.dat`:
`[secs=R 8 2   R 6 16   _L 6.25 2]` — a 6.25 lip on a 6-radius pin.

**`caps=`** (verbatim from the LDCad reference):

| Value | Meaning |
|---|---|
| `none` | *"open ended. e.g. a male axle or female beam hole"* |
| `one` | *"one closed ending, which one depends on the gender. For male shapes it will be A (bottom) and for female shapes it will be B (top)"* |
| `two` | *"closed (blocked) at both sides"* |
| `A` | *"The bottom is closed / blocked. e.g. a stud."* |
| `B` | *"The top is closed / blocked. e.g. an anti stud."* |

Since sections run from the origin along local −Y, **`A` = the origin end, `B` = the far end**.
Check: a stud (`caps=one`, male ⇒ A) is closed at its base where it joins the brick ✓; an anti-stud
(`caps=one`, female ⇒ B) is closed at the far end = the brick's ceiling ✓.
Library distribution: `one` 5 032, `none` 1 120, `two` 432, `B` 46, `A` 24.

**`scale=`** — *"Defines how scaled references to the master (official) part should be handled
information inheritance wise."* `none` (don't inherit if scaled), `YOnly`, `ROnly` (radius only),
`YandR`. Only 23 uses library-wide. Example, `p/axle.dat`:
`0 !LDCAD SNAP_CYL [id=axle] [gender=M] [caps=none] [secs=A 6 1] [slide=true] [pos=0 1 0] [scale=YOnly]`
— a unit-length axle stub that stretches with the primitive.

**`mirror=`** — the web docs list only `none` and `cor` (*"corrected by flipping one of the radius
axes"*); the shipping binary supports `cor` / `corX` / `corY` / `corZ`, and `corZ` is in live use
(`parts/s/4181s00.dat`).

### 8.4 `SNAP_CLEAR` — drop inherited info

*"used to flush all or part of the inherited snap information gathered for the current part file so
far."*
```
0 !LDCAD SNAP_CLEAR              ← clears everything from this point on
0 !LDCAD SNAP_CLEAR [id=axleHole]  ← clears only info with that id
```
*"Leave it empty to clear all information for the current part."* Crucially it is **positional** —
LDCad's own UI describes it as discarding *"from this point in the source on"* — so a parser must
apply it in line order during the merged-file walk. 212 of 331 uses are the bare form.

The canonical `id` vocabulary (28 ids, enumerated in `CONTRIBUTING.md`) includes `aStud`, `axle`,
`axleHole`, `axleHole2`, `axleHole3`, `axleHoleDuplo`, `conn4`, `connhole`, `connhol3`, `dupStud`,
`elecHole`, `elecPin`, `elecSck`, `flexEnd`, `flexSeg`, `fpin10`, `fpin11`, `pin8`, `stud2`,
`stud3`, `studC`, `studDuplo`, `studO`, `wpAxHole`.

### 8.5 `SNAP_INCL` — include another shadow file's info

*"used to add the information from another shadow library file to this part too. **This is done
non recursively.**"*
```
0 !LDCAD SNAP_INCL [ref=connhole.dat] [pos=-50 10 0] [ori=0 -1 0 0 0 -1 1 0 0] [grid=C 1 C 3 20 20]
```
`ref` *"Must only use local part references."* Circular includes are detected and rejected.
**The documented `scale=` property was removed** in LDCad 1.5 Beta 1 and appears 0 times in the
current library — ignore it. Note also that `SNAP_INCL`'s grid semantics changed in 1.5 Beta 1 in a
**backwards-incompatible** way.

A shadow file may consist of nothing but an include (`parts/60475b.dat`:
`0 !LDCAD SNAP_INCL [ref=60475a.dat]`).

### 8.6 `SNAP_CLP`, `SNAP_FGR`, `SNAP_GEN`, `SNAP_SPH`

**`SNAP_CLP` — clips.** *"Clips are always of the female gender and will be tested against male
cylinder shapes."*
```
0 !LDCAD SNAP_CLP [radius=4] [length=8] [pos=0 0 0] [ori=1 0 0 0 1 0 0 0 1] [center=true]
```
Properties: `ID`, `pos`, `ori`, `radius` (float, default 4.0, *"Inner radius of the clip while in
rest"*), `length` (float, default 8.0), `center`, `slide`, `scale`, `mirror` (**default `none`**,
unlike `SNAP_CYL`'s `cor`). **No `gender`, no `group`, no `grid`.**

**`SNAP_FGR` — interlocking fingers (hinges).** *"finger shapes will only be tested among
themselves."*
```
0 !LDCAD SNAP_FGR [group=lckHng] [genderOfs=M] [seq=4.5 8 4.5] [radius=6] [center=true] [pos=-30 10 0] [ori=1 0 0 0 0 1 0 -1 0]
```
`genderOfs` = *"the gender of the **first** finger"* (`M`/`F`, default male); `seq` = *"the width of
each finger by a sequence of floats"*, alternating M/F/M/F… from `genderOfs`, laid along the local
Y axis; `radius` = *"Outer radius of the finger (tip)"*. So `genderOfs=M seq=4.5 8 4.5` is
M(4.5) F(8) M(4.5), mating with an `genderOfs=F` partner of the same sequence.
Library-wide `genderOfs`: `M` 227, `F` 108. Values carry up to 2 decimals.

**`SNAP_GEN` — generic/odd shapes** (electric plugs, window glass, ball joints).
*"Matching is done only among generic metas themselves based on the group name alone. But the
bounding information will influence the best candidate selection."*
```
0 !LDCAD SNAP_GEN [group=nxtc] [gender=M] [pos=0 -1.5 1.5] [ori=1 0 0 0 0 1 0 -1 0] [bounding=box 12.5 16.5 8]
```
`bounding=` kinds: `pnt` (no values), `box x y z` (103×), `cube halfsize` (2×), `cyl r len` (43×),
`sph r` (184×). Two properties are **undocumented on the web** but live in the data:
`match=` (`size` 112×, `group` 26×) and `placement=` (`free` 125×, UI label *"Retain
orientation"*). Canonical ball-joint recipe from `CONTRIBUTING.md`:
```
0 !LDCAD SNAP_GEN [gender=M] [bounding=sph 12.7] [group=techBallJnt][match=size] [placement=free]
0 !LDCAD SNAP_GEN [gender=F] [bounding=sph 12.7] [group=techBallJnt][match=size] [placement=free]
```
`CONTRIBUTING.md` also enumerates the complete `group` vocabulary (~180 names: `bikeWheel`, `boat`,
`clkRot`, `door`, `elec`, `hgBrA/B/C`, `hgPlA/B`, `lckHng`, `nxtc`, `pfc`, `techBallJnt`,
`traintrk`, `uniJnt`, `winTrain`, …), including an encoded `rim<AA>-<BB>` family for tyre/wheel fit.

**`SNAP_SPH` — deprecated.** The docs themselves say *"This meta will be replaced by the generic
meta in LDCad 1.5"*. Native support was removed in 1.5 Beta 1: *"SNAP_SPH will still be read though,
but it will be automatically upgraded to SNAP_GEN."* It occurs **0 times** in the current library.
Map it to `SNAP_GEN [bounding=sph <radius>] [match=size] [placement=free]`.

### 8.7 `grid=` — repeating snap points (exact semantics)

*"Defines a grid pattern to use for multiple placement of this cylindrical shape. **The grid uses
the orientation stated in the `ori` parameter.** […] `Xcnt Zcnt Xstep Zstep` […] Optionally each
count value can be preceded by a **`C` character indicating the grid should be centered on that
axis. If no C is given the axis will add to the `pos` parameter.**"*

Two arities exist, distinguished by counting numeric tokens (the 3-axis form was added in LDCad 1.5
and is undocumented on the web):

| Numeric tokens | Form |
|---|---|
| 4 | `[C] Xcnt [C] Zcnt  Xstep Zstep` |
| 6 | `[C] Xcnt [C] Ycnt [C] Zcnt  Xstep Ystep Zstep` |

Placement formula, per axis *a* with count *nₐ*, step *sₐ*, centred flag *cₐ*:
```
offset_a(i) = c_a ? (i − (n_a − 1)/2) · s_a      // centred
                  : i · s_a                       // added to pos
world_pos = pos + ori · (offset_X, offset_Y, offset_Z)
world_ori = ori
```

**Verified twice against official geometry:**
1. `parts/s/3001s01.dat` shadow: `[secs=R 6 20] [pos=0 24 0] [grid=C 4 C 2 20 20]`
   → X: `(i−1.5)·20` = −30, −10, +10, +30; Z: `(j−0.5)·20` = −10, +10. The official
   `s/3001s01.dat` places its eight `stud.dat` refs at exactly those coordinates. ✓ (both parities)
2. `parts/18975.dat` shadow: `[ref=connhole.dat] [pos=0 10 0] [ori=0 -1 0 1 0 0 0 0 1] [grid=1 C 2 1 0 60 0]`
   → local offsets Y = ±30; rotating by `ori` gives world X = ∓30. The official `18975.dat` puts
   its two pin-hole clusters at exactly x = ±30, y = 10, axis along X. ✓ **If offsets were applied
   in world space instead, the pair would land on Y — so the grid really is local-frame-then-rotate.**

Idiom: a count of `1` with step `0` means "no repeat on this axis" (`grid=C 4 1 20 0`).

Observed token-pattern distribution across all 3 421 `grid=` values: `C n n s s` 1 343,
`C n C n s s` 1 330, `n C n s s` 423, `n n s s` 232, plus 93 six-number forms.

### 8.8 Worked example — how "these two parts connect at this offset" falls out

**The 2×4 brick.** `3001.dat` has **no shadow file**. Its entire connectivity is inherited:

```
p/stud.dat (shadow, complete file):
  0 !LDCAD SNAP_CYL [ID=studC] [gender=M] [caps=one] [secs=R 6 4]

parts/s/3001s01.dat (shadow, complete file):
  0 //Bottom stud holes
  0 !LDCAD SNAP_CYL [gender=F] [caps=one] [secs=R 6 20] [pos=0 24 0] [grid=C 4 C 2 20 20]
```
Eight male hotspots arrive via the eight official `stud.dat` references at `(±10/±30, 0, ±10)`;
eight female hotspots come from the one gridded line at `(±10/±30, 24, ±10)`.

Bringing a male frame of brick A into coincidence with a female frame of brick B:
```
T_B = T_A + (30, 0, 10) − (30, 24, 10) = T_A + (0, −24, 0)
```
**−24 LDU in Y — exactly one brick height, straight up.** ✓ Cross-check on the section stacks: the
male `R 6 4` runs y = 0 → −4 (closed at A = its base); the female `R 6 20` runs y = 24 → 4 (open at
A = the underside, closed at B = the ceiling). Coincident frames put the stud base at the cavity
mouth with the tip 4 LDU into a 20 LDU cavity — physically correct, and it explains why `caps=one`
resolves gender-dependently.

**Two traps this example exposes:**
- The shadow for the inner-tube primitive `p/stud4.dat` is **deliberately commented out**:
  `0 //NOTE: Needs multi matching feature to prevent unwanted snapping when combined with e.g.
  plates.` The anti-studs are declared once at the `3001s01` level instead. Naive inheritance from
  primitives would double-count.
- `3024.dat` (1×1 plate) was refactored to use `s\3024s01.dat` in 2022, and **both** the top-level
  and the subpart shadow now declare the same female cylinder at the same world position — a naive
  union yields two coincident hotspots. **De-duplicate coincident identical hotspots** (same gender,
  pos, ori, secs).

### 8.8a Other `!LDCAD` metas a parser must tolerate

Full keyword set the 1.7 binary recognises: `MARKER CONTENT SNAP_CLEAR SNAP_CYL SNAP_CLP SNAP_SPH
SNAP_FGR SNAP_GEN SNAP_INCL GENERATED MIRROR_INFO HINTS PATH_POINT PATH_SKIN PATH_CAP PATH_ANCHOR
PATH_LENGTH SPRING_POINT SPRING_SECTION SPRING_CAP SPRING_ANCHOR GROUP_DEF GROUP_NXT GROUP_OBJ`
plus `SCRIPT`.

- **`MIRROR_INFO`** (483×, undocumented on the web) — `[baseFlip=X|Y|Z]`, `[counterPart=self|auto|<file>.dat]`,
  `[posCor=<vector>]`, `[oriCor=<3x3>]`, `[inheritable=true]`. Governs how a part mirrors. When
  several are present, **the last one wins**.
- **`HINTS`** (13×, undocumented) — `[binOri=<3x3>]` (part-bin thumbnail orientation),
  `[fakeSeam=no]`. Not connectivity; skip cleanly.
- **`GROUP_DEF` / `GROUP_NXT` / `GROUP_OBJ`** — LDCad's grouping. `GROUP_DEF` takes
  `[topLevel=<bool>] [LID=<int>] [GID=<string>] [name=<string>] [center=<vector>]`;
  `GROUP_NXT [ids=<int list>] [nrs=<int list>]` attaches **the following line** to groups.
  Comma-separated lists.
- **`SCRIPT [source=<file>.lua]`**, **`CONTENT [type=path|spring] …`**, **`GENERATED [generator=] [master=]`**.
- **Flexible-part path metas**: `PATH_POINT [type=bezier|circle] [posOri=] [prevCPDist=25.0]
  [nextCPDist=25.0] [cirR=25.0] [cirDir=xyCW|xyCCW|zyCW|zyCCW] …`, `PATH_CAP`, `PATH_ANCHOR`,
  `PATH_SKIN`, `PATH_LENGTH`; **spring metas** `SPRING_POINT`, `SPRING_CAP`, `SPRING_ANCHOR`,
  `SPRING_SECTION`. None appear in the shadow library (the contribution rules forbid them there).

### 8.8b Standardisation status of snap metas

There **is** a draft: <https://wiki.ldraw.org/wiki/Part_Snapping_Language_Extension>, *"Maintained
by: The LDraw.org Standards Committee, Writer: Roland Melkert, Orion Pobursky, Revision: 1,
XX-XXX-XXXX"*, carrying the explicit note **"Author's Note: This is an unofficial specification,
not yet ratified by the LSC."**

Two warnings for anyone tempted to implement it instead:
1. It is a near-verbatim copy of the (stale) melkert.net text — no `MIRROR_INFO`, no `HINTS`, no
   3-axis `grid`, no `match`/`placement`; it still lists the removed `SNAP_INCL [scale=]` and omits
   `SNAP_SPH`.
2. **It proposes a different prefix**: every example is `0 !SNAP_CYL […]`, not
   `0 !LDCAD SNAP_CYL […]`. **No file in the shipping library uses that form.** Parse
   `0 !LDCAD <KEYWORD>`; optionally tolerate bare `0 !SNAP_*` for forward compatibility.

**No open-source parser of `!LDCAD SNAP_*` metas was found.** (`pixeljetstream/ldrawloader` is a
mesh loader with no shadow/snap handling.) You will be writing this from scratch.

### 8.8c Shadow-library parser checklist

1. Tokenise `^0 !LDCAD\s+(\w+)`, then scan `\[([^=\]]+)=([^\]]*)\]`. Property names
   case-insensitive; tolerate `][` with no space, a trailing space, and zero properties.
2. Split array values on `\s+`.
3. Concatenate official + shadow content per file, then parse once, **in order**.
4. Accumulate type-1 matrices; each hotspot is `(M·pos, M·ori)`; hotspot axis is local **−Y**.
5. `ori` is row-major, same ordering as a type-1 line's last nine numbers. `pos` is LDU.
6. `grid`: 4 numeric tokens ⇒ X/Z, 6 ⇒ X/Y/Z. `C` centres that axis. Offsets applied in the `ori`
   local frame, **then** rotated.
7. `secs`: repeating `<R|A|S|_L|L_> <radius> <length>` triples, stacked from origin along −Y;
   `center=true` recentres. Reject `_L` first / `L_` last.
8. `caps`: `A` = origin end, `B` = far end; `one` ⇒ A for male, B for female.
9. `SNAP_CLEAR` is positional. `SNAP_INCL` is non-recursive and cycle-checked. Honour
   `scale=` / `mirror=` inheritance gates.
10. Upgrade `SNAP_SPH` → `SNAP_GEN [bounding=sph r] [match=size] [placement=free]`.
11. Accept and ignore `MIRROR_INFO`, `HINTS`, `MARKER`, `SCRIPT`, `CONTENT`, `GENERATED`,
    `GROUP_*`, `PATH_*`, `SPRING_*`.
12. De-duplicate coincident identical hotspots.

### 8.8d Measured coverage of the shadow library

Nobody publishes a coverage figure, so this was measured directly: clone the shadow repo
(verified 87 `p/`, 3 333 `parts/`, 831 `parts/s/` — and confirmed **no `parts/3001.dat`**, exactly
as `CONTRIBUTING.md` claims), then for a random sample of 600 files from the official
`ldraw/parts/` (503 after excluding `~`-hidden parts), walk each part's full type-1 reference
closure and ask whether **any** file in that closure has a shadow file containing a `!LDCAD SNAP_*`
line:

| Result | Share |
|---|---|
| Part has its **own** shadow file with snap metas | 15.3 % |
| Part has snap data **only via inherited subfiles/primitives** | 65.8 % |
| **No snap data anywhere in the reference closure** | **18.9 %** |
| **Effective coverage** | **81.1 %** |

Two conclusions:
- The naive ratio (3 333 shadow files / 24 593 parts ≈ 14 %) badly understates reality. Inheritance
  through primitives and subparts does the heavy lifting — **you must implement the recursive
  inheritance walk or you get 15 % coverage instead of 81 %.**
- ~19 % of non-hidden official parts have **no connectivity data at all**, and there is no manifest
  saying which. Treat "no hotspots" as **"unknown"**, never as "no connections" — a validator that
  fails a model because a part reported no connection points will produce false negatives on a
  fifth of the library.

### 8.8e End-to-end proof: a ~60-line shadow-aware hotspot extractor

Merging official + shadow text, recursing type-1 references, and expanding `grid=` per §8.7
reproduces correct connection points immediately:

```
=== 3001.dat  (2x4 brick, 16 SNAP_CYL hotspots)
   M: (±30, 0, ±10), (±10, 0, ±10)          ← 8 studs on top
   F: (±30, 24, ±10), (±10, 24, ±10)        ← 8 anti-studs on the bottom
=== 3024.dat  (1x1 plate)
   M: (0, 0, 0)          F: (0, 8, 0)
=== 3701.dat  (Technic Brick 1x4 with Holes)
   M: (−30, 0, 0), (−10, 0, 0), (10, 0, 0), (30, 0, 0)
   F: (−30, 24, 0), (−10, 24, 0), (10, 24, 0), (30, 24, 0)   ← anti-studs
      (−30, −4, 0), (−10, −4, 0), (10, −4, 0), (30, −4, 0)   ← hollow-stud bores
```

The `M` set of one brick minus the `F` set of another gives the legal placement offsets directly.
For 3001-on-3001, `T_B = T_A + (0, −24, 0)` — one brick height straight up.

**Note 3701 yields female hotspots at y = −4 as well as y = +24.** Those are the bores of its
*open* studs. `p/stud2.dat`'s shadow file carries **two** cylinders:
```
0 !LDCAD SNAP_CYL [ID=studO] [gender=M] [caps=one] [secs=R 6 4]
0 !LDCAD SNAP_CYL [ID=studO] [gender=F] [caps=one] [secs=R 4 4] [pos=0 -4 0] [ori=1 0 0 0 -1 0 0 0 -1]
```
— a male r=6 stud and a female r=4 bore pointing the other way (that `ori` is the tabulated "Pos Y"
rest orientation from §8.2). **This exactly cross-validates the independent geometry measurement in
§4.1**, which found `stud2.dat` to be a hollow stud with inner r = 4 and outer r = 6. Two entirely
separate sources agreeing to the LDU is a good confidence signal for the whole model. A naive
"female = underside" assumption would miss these — a bar or round pin legitimately fits into an
open stud.

**Honest caveat on this demo:** it implements only `SNAP_CYL` + `grid=`. It therefore **misses
3701's three Technic pin holes**, which arrive via `SNAP_INCL [ref=connhole.dat]`. A real extractor
needs the full checklist in §8.8c.

### 8.9 BrickLink Studio 2.0

**Headline: three files per part** — the LDraw-derived geometry (`.dat`), a **binary** connectivity
file (`.conn`), and a **plain-text** collision file (`.col`). There is **no SQLite database, no XML,
and no monolithic connectivity DB**, and **BrickLink has published no specification for either
format**. The only descriptions in existence are LDraw-forum reverse-engineering threads.

**On-disk locations** (custom-parts path is official; subfolder names are community-documented):

| Platform | Path |
|---|---|
| Windows built-in | `C:\Program Files\Studio 2.0\ldraw\parts`, `…\ldraw\UnOfficial\parts`, `…\data` |
| macOS built-in | `/Applications/Studio 2.0/ldraw/…` with sibling `connectivity/` and `collider/` |
| Windows user | `C:\Users\{User}\AppData\Local\Stud.io\` ([official](https://studiohelp.bricklink.com/hc/en-us/articles/20413029505815-Failed-to-initialize-PartDesigner)) |
| macOS user | `~/.local/share/Stud.io` ([official](https://studiohelp.bricklink.com/hc/en-us/articles/20413029505815-Failed-to-initialize-PartDesigner)) — **not** `~/Library/Application Support` |
| | `CustomParts/` splits into `parts/` (`.dat`), `connectivity/` (`.conn`), `collider/` (`.col`) |

`data/StudioPartDefinition2.txt` is a TSV part-definition table
(<https://forums.ldraw.org/thread-28022-post-52944.html>).
`.io` model files are ZIP archives encrypted with the password `soho0909`
(<https://wiki.ldraw.org/wiki/Category:BrickLink_Studio>).

**`.col` — collision, plain text and trivially parseable.** Reverse-engineered by Gabriel Läufer,
<https://forums.ldraw.org/thread-28518.html>. One line per collision box, space-separated:
`9` (constant) · `0` (constant) · 3×3 rotation matrix · `X Y Z` position · `W H L` dimensions.
**Only axis-aligned boxes** — no cylinders, spheres or convex hulls; complex shapes are unions of
boxes. Boxes are deliberately **slightly smaller than the real geometry**, and collision fires only
when overlap exceeds a threshold — the same tolerance trick §4.1 says any checker needs.

**`.conn` — connectivity, binary and undocumented.** Definitive thread:
<https://forums.ldraw.org/thread-28521.html>. `.conn` files shadow the part file by basename.
Orion Pobursky: *"I found them. It's a binary format which is a bummer."*
(<https://forums.ldraw.org/thread-26535.html>). **However, PartDesigner's native `.part` files are
TEXT and are compiled into the binary `.conn` on export.** The text meta is `PE_CONN`:
```
0 PE_CONN 3 23 1.000000 0.000000 0.000000 0.000000 1.000000 0.000000
0.000000 0.000000 1.000000 0.000000 0.000000 0.000000 1 2 0:0,0:0,0:0,0:0,0:0,0:0
```
Decoded (partially) as: group/type ID · element ID · 3×3 matrix · XYZ · lateral size in **half-stud**
units · a `[Z+1][X+1]` geometry descriptor array. Connection type IDs are **paired male/female,
usually one apart**: technic pinhole `2` / pin `3`; axlehole `6` / axle `7` (axle-with-stop `9`);
round hole `10` / bar `11`; clip `12` / bar `13`. PartDesigner's UI exposes **43 selectable
connectivity elements**; **no complete public enumeration exists**. Note also a unit mismatch:
*".conn uses LDU but .part uses stud"*.

PartDesigner ships a **`Primitives` folder of `.part` files** covering the standard connectivities —
the closest thing to a machine-readable catalogue of Studio's connection types.

**Official Studio feature docs** (<https://studiohelp.bricklink.com>):
- [Collision](https://studiohelp.bricklink.com/hc/en-us/articles/5412820155927-Collision):
  *"Collision detection allows you to know whether or not parts will fit together."* Documented
  caveats matter: *"Collisions will not always be accurately detected because connections can be
  more complicated or less rigid in real life"*, and **accuracy depends on
  `Preferences | Appearance | Render quality`** — lower quality reduces collision sensitivity.
  Keyboard controls can still force parts into overlap.
- [Snap](https://studiohelp.bricklink.com/hc/en-us/articles/5412087360919-Snap): *"Compatible
  connectors will be attracted together when moving parts."* **Snapping ignores hidden parts when
  calculating connection points.**
- [Connectivity check](https://studiohelp.bricklink.com/hc/en-us/articles/6501624386071-Connectivity-check):
  colours connected groups — main group transparent, others pink. Slight misalignment produces
  false disconnections.
- [Stability check](https://studiohelp.bricklink.com/hc/en-us/articles/6501498505111-Stability-check):
  whether parts are sufficiently connected to support the design's weight. This is the consumer of
  the connectivity graph — and the closest existing thing to an automated "will this build stand up"
  check.

**Practical consequence:** dropping raw LDraw `.dat` files into Studio gives geometry with **no
connectivity** — parts render but don't snap. Philippe Hurbain's parts packs
(<https://www.philohome.com/studio/packs.htm>) are LDraw parts hand-edited in PartDesigner to add
connectivity and collision.

### 8.10 LeoCAD — no collision, no connectivity

**Collision: none.** A code search for `collision` across `leozide/leocad` returns **0 results**.
The only request, [#184 "Collision detection between parts using libccd"](https://github.com/leozide/leocad/issues/184)
(2018), was **closed unimplemented in 2021** — contributor note: *"LDraw parts are not convex and
their bounding boxes are expected to overlap."*

**Connectivity: none.** Maintainer Leonardo Zide on
[#563](https://github.com/leozide/leocad/issues/563): *"It would be nice to detect studs and try to
match them but this is a big task"* (2020) and *"This is probably the most requested feature, it's
just a ton of work to maintain a database of connections"* (2021). Contributor on
[#253](https://github.com/leozide/leocad/issues/253): *"Smart snapping does not exist in leocad."*

**What LeoCAD calls "snap" is a pure arithmetic grid quantiser** — `lcModel::SnapPosition()` divides
by the snap value and rounds; no geometry, stud or neighbour lookup. The hard-coded tables (source
only, **undocumented in user docs**):
- Move XY (LDU): 0, 1, 5, 8, **10 (default)**, 20, 40, 60, 80, 160
- Move Z (LDU): 0, 1, 5, **8 (default)**, 10, 20, 24, 48, 96, 192
- Angle (°): 0, 1, 5, 15, 22.5, **30 (default)**, 45, 60, 90, 180

**Sole exception: train tracks.** LeoCAD 25.09 added a Train Track Layout Editor with genuine typed
connection points (`lcTrainTrackConnection`, `CanConnectTo()`, `AreConnectionsCompatible()` in
[`common/lc_traintrack.h`](https://github.com/leozide/leocad/blob/master/common/lc_traintrack.h)) —
hard-coded and track-specific, not a general engine.

Repo active (last push 2026-08-16, ~2 842 stars, 228 open issues); last release v25.09 (2025-09-02).

### 8.11 LDView — format validation, zero interference analysis

LDView *"is a real-time 3D viewer"* (<https://tcobbs.github.io/ldview/>). Code search for
`collision` returns 0 results; it never moves a part, so there is nothing to collide. Current
release **4.7, 21 Feb 2026**.

**Documentation trap:** the command-line reference is **not on the website** —
`tcobbs.github.io/ldview/Help.html` 404s. It exists only in the shipped/in-repo help file,
<https://github.com/tcobbs/ldview/blob/master/Help.html>.

**`-CheckPartTracker` is a network-fetch policy switch, not a validator.** It is *"Equivalent to the
'Automatically check LDraw.org for missing parts' check box"*; default **On**; on a missing file it
queries the LDraw.org Parts Tracker and auto-downloads. It is what makes error 15 fire.

**What LDView actually checks** — the Errors & Warnings window, 17 individually-toggleable
categories (`ShowErrors/LDLError00`–`16`):

| # | Category | Catches |
|---|---|---|
| 00 | General Error | rare shouldn't-happen cases |
| 01 | Parse Error | invalid line in the model file |
| 02 | File Not Found | unresolvable sub-file reference |
| 03 | Singular Matrix | a reference scaled to zero in one dimension |
| 04 | Non-uniform transform | part stretched/skewed |
| 05 | Non-flat quad | with "a reasonable amount of leeway" |
| 06 | Concave quad | *"not technically an error… bad form"* |
| 07 | Bad vertex sequence | bow-tie winding (exempt in BFC-certified regions) |
| 08 | Identical vertices | *(in the settings table but omitted from the prose error list)* |
| 09 | Co-linear points | quad that should be a triangle/line |
| 10 | BFC Warning | unusual but valid BFC info |
| 11 | BFC Error | invalid BFC info |
| 12 | **MPD Error** | **invalid multi-part DAT structure** |
| 13 | Whitespace | sub-model filename contains whitespace |
| 14 | Part renamed | `~Moved to` a new number |
| 15 | Unofficial part used | on the Parts Tracker, not the main library |
| 16 | **Model loop** | **sub-model references an ancestor** |

**Every one is a file-format / polygon-sanity check.** None looks at whether two parts occupy the
same space or connect legally. But #01, #02, #03, #04, #12, #14, #15, #16 map almost exactly onto
the L0–L2 predicates of §11 — **LDView is a usable off-the-shelf L0–L2 validator.**

Also relevant: `BFC` (default On), `RedBackFaces` / `GreenFrontFaces` (both Off; *"mainly useful for
part authors… to correctly specify which direction faces should face in order to BFC certify"*),
`AllowPrimitiveSubstitution` (On), `CurveQuality` (1–12, default 2), `HiResPrimitives` (Off),
`LDrawDir`, `LDrawZip` (new in 4.6), `ExtraSearchDirs/Dir001`–`Dir999`. MPD sub-model selection uses
`LDView 8464.mpd:engine.ldr`. Headless output: `-SaveSnapshot=`, `-SaveSnapshots=1`,
`-SaveSnapshotsList=`, `-ExportFile=` (.pov/.stl/.3ds), `-SaveZMap=1`. Verbosity `-q`, `-qq`, `-v`.
177 settings total.

### 8.12 Open datasets encoding connection points per part

**The central fact: official LDraw has zero connectivity.** Verified against both
[article 512](https://www.ldraw.org/article/512.html) and
[article 398](https://www.ldraw.org/article/398.html) — the header vocabulary is `!LDRAW_ORG`,
`!LICENSE`, `!HELP`, `!CATEGORY`, `!KEYWORDS`, `!CMDLINE`, `!HISTORY`, `BFC`. **No field for studs,
anti-studs, pin holes, axle holes, clips or mating rules.** Every connectivity-aware tool supplies
this layer itself.

| Dataset / project | Representation | Connectivity | Licence / availability |
|---|---|---|---|
| **LDCad shadow library** | LDraw metas on real parts | **Typed male/female hotspots**, full geometry | **CC BY-SA 4.0**, open, 81 % effective coverage (§8.8d) — *the* answer |
| **LTRON / Break-and-Make** (ECCV 2022, [arXiv:2207.13738](https://arxiv.org/abs/2207.13738), [repo](https://github.com/aaronwalsman/ltron)) | Real LDraw parts | **Derives connection points from LDCad metadata** — *"We use part metadata from the LDCAD software package in order to detect these connection points on bricks."* Studs, anti-studs, technic pins, axles, clips, poles, ball/socket, each with polarity | **MIT.** 1 727 OMR models, 1 790 brick shapes. **The easiest existing route to a machine-readable LDraw connection-point table.** |
| **BrickNet** (CVPR 2026, [arXiv:2604.22984](https://arxiv.org/abs/2604.22984), [repo](https://github.com/kulits/BrickNet)) | Graph program; connectivity spanning trees | 5 connector families with DoF: **Stud** (1 yaw), **Hinge** (1 rot + flip), **Axle** (rot + flip + slide), **Ball** (3 rot), **Fixed** (none) | **Code MIT; pip package ships the part vocabulary, connector labels and alias table.** 9 743 unique part types, 40.5 M brick instances — but **the graph dataset is Google-Form gated, research-only** |
| **BrickGPT / LegoGPT** ([arXiv:2505.05469](https://arxiv.org/abs/2505.05469)) | `"{h}x{w} ({x},{y},{z})"` text tokens on a **20×20×20 stud grid, 8 brick types** | **Implicit** — adjacency + voxel intersection; stability via Gurobi static equilibrium | **MIT**, [StableText2Brick](https://huggingface.co/datasets/AvaLovelace/StableText2Brick), 47 389 rows |
| **StableLego** ([arXiv:2402.10711](https://arxiv.org/abs/2402.10711), CMU) | 20³ voxel + `task_graph.json` | **Contact-point force model** — 3–4 contact points per knob, typed forces with action–reaction pairs. But the task graph stores **poses, not an edge list** | **MIT**, 50 k+ objects / 55 ShapeNet categories, **includes invalid designs** |
| **Brick-by-Brick** (NeurIPS 2021) | Directed graph, node `(x,y,z,dir) ∈ ℤ⁴`, 92-offset action table | Genuine contact graph | MIT, but **2×4 bricks only, code only, no dataset** |
| **MEPNet** (ECCV 2022, Stanford) | LDraw parts + voxels | Explicit stud/anti-stud matching **as a method**, not an exported table | MIT, 72 brick types |
| **three.js `LDrawLoader`** | Mesh | **None** — parses only `!LDRAW_ORG`, `!COLOUR`, `!CATEGORY`, `!KEYWORDS`; does not even parse `!LDCAD` metas | Confirmed dead end |
| `ldraw-connectivity` | **Does not exist** — 404 | Dead lead |
| **brickhub.org** | `.ldr` model host; `LDraw2Studio`/`Studio2LDraw` converters handle **textures only, not `.conn`/`.col`** | None | Not a connectivity source |
| **pybricks/ldraw** | A git mirror of the LDraw parts library | None | Not relevant |

**Part dimensions in studs — thin.** **Rebrickable carries no dimension data at all**: `parts.csv`
is `part_num, name, part_cat_id, part_material`; dimensions appear only as free text inside `name`
("Brick 2 x 4"), regex-parseable for common rectangular parts and unreliable on the long tail
(<https://rebrickable.com/help/lego-database/>). **BrickLink** exposes `dim_x/dim_y/dim_z` via its
OAuth API, but its own docs describe *both* stud dimensions and cm packing dimensions
(<https://www.bricklink.com/help.asp?helpID=2510>), and which the API returns could not be confirmed
without a live key — **verify before relying on it**. Everything else (Brick Architect, Brick Owl,
BrickGun) is browsable pages and PDFs. **Deriving dimensions from LDraw bounding boxes ÷ 20 LDU is
the realistic path** (§3.5/§4.6).

**Also note** for the stud-scanning approach of §8.9: the LDraw wiki endorses it — *"Software which
renders a part can easily identify studs at runtime, simply by their filename as a primitive"*
(<https://wiki.ldraw.org/wiki/Studs_with_Logos>) — but warns you must also expand **stud groups
`stugN-XxZ.dat`**; counting `stud.dat` references alone under-counts.

### 8.13 Fallback: deriving connectivity from primitive usage alone (measured)

If the CC BY-SA licence of the shadow library is a problem, or you need the ~19 % it doesn't cover:

If neither shadow library nor Studio data is usable, **male** connection points can be recovered
directly from the official library by recursively expanding type-1 lines and recording the world
position of every reference to a known stud primitive. Measured against
`complete.zip` (Parts Update 2026-07):

```
3001.dat  Brick 2 x 4
  STUD ×8  (±30, 0, ±10), (±10, 0, ±10)
  TUBE ×3  (−20, 4, 0), (0, 4, 0), (20, 4, 0)
3020.dat  Plate 2 x 4
  STUD ×8  same X/Z as 3001;  TUBE ×3  same
3003.dat  Brick 2 x 2
  STUD ×4  (±10, 0, ±10);    TUBE ×1  (0, 4, 0)
3004.dat  Brick 1 x 2
  STUD ×2  (±10, 0, 0);      TUBE ×1  (0, 4, 0)
3070b.dat Tile 1 x 1 with Groove       STUD ×0   TUBE ×0
3068b.dat Tile 2 x 2 with Groove       STUD ×0   TUBE ×1 (0, 4, 0)
3040b.dat Slope Brick 45 2 x 1         STUD ×1  (0, 0, 0)   TUBE ×0
3794a.dat Plate 1x2 w/ 1 Centre Stud   STUD ×1  (0, 0, 0)   TUBE ×1 (0, 4, 0)
15573.dat Plate 1x2 w/ 1 Centre Stud, without Understud
                                        STUD ×1  (0, 0, 0)   TUBE ×0
```

**This works well for studs and badly for anti-studs.** Two hard limitations, both measured:

1. **Tube primitives are not the female connection points.** `3005.dat` (Brick 1×1) and
   `3024.dat` (Plate 1×1) contain **zero** tube primitives, yet both obviously accept a stud
   underneath. The `stud3/stud4` tubes only appear *between* studs on parts ≥ 2 studs in one
   dimension; the actual female receptacle of a 1×1 is the hollow box underside itself, which has
   no marker primitive at all. So "female positions = tube primitive positions" is wrong. In
   practice a heuristic like *"a studs-up part has a female receptacle at (stud_x, body_bottom,
   stud_z) for every stud position"* is closer, but it is a heuristic, not data.
2. **The stud primitive namespace is large and irregular.** The library ships **80** `p/stud*.dat`
   primitives (`stud.dat`, `stud2.dat` "Stud Open", `stud2a.dat`, `stud3.dat`/`stud4.dat` tubes,
   `stud4f1n`…`stud4f5n` filleted tubes, `stud6` for round 2×2, `studp01`, `stud-logo1..5`
   logo variants, `studel`, `studx`, `studh/studhl/studhr`, `stud5` Scala, …). Reference counts
   across `parts/` + `parts/s/`: `stud.dat` 15 362, `stud4.dat` 4 991, `stud2.dat` 1 844,
   `stud3.dat` 1 726, `stud2a.dat` 1 308, `studp01.dat` 1 273. You need a **hand-curated
   primitive → connection-type table**, and it will never be complete.
   Only **2 620 of 24 591** files in `parts/` reference a stud primitive at the top level — the rest
   go through `parts/s/` subparts, so **recursion through subfiles is mandatory**.

Additionally this approach recovers **nothing** about Technic pins/axles, clips, bars, hinges,
ball joints, or SNOT brackets, which is precisely where LDCad's `SNAP_CYL` / `SNAP_FGR` /
`SNAP_SPH` families earn their keep.

## 9. Validation tooling

**Headline: validation and parsing are almost entirely disjoint in this ecosystem.** The tools that
validate well (LDView, LDPartEditor, DATHeader, the Parts Tracker) are C++/Java/.NET applications
aimed at *part authors*. The libraries that parse well (three.js, `ldr_tools`, `ldraw.rs`,
ExportLDraw) validate essentially nothing. **There is no maintained library in any scripting
language that does both.**

### 9.0 Things that do not exist — stop looking

`LDLint` · `ldraw-parser` (npm) · `@lego/ldraw` · `ldraw-loader` · `parse-ldraw` ·
`ldraw-tools` / `ldraw-py` / `ldrawpy` / `pyldraw2` / `bricksnpieces` (all 404 on PyPI) ·
`rienafairefr/pyldraw` (it's `rienafairefr/python-ldraw`) · `segfault87/ldraw-rs` (it's `ldraw.rs`) ·
`ldraw-connectivity` · a Godot LDraw importer · a maintained .NET LDraw library · **a standalone BFC
validator** · **any open geometric collision checker for LDraw**.

**`LDCheck` is effectively dead** — Santeri Piippo's 2020 tool was distributed from `hecknology.net`,
which now fails TLS entirely; no GitHub mirror; not listed among LDraw.org's Part Author Tools.

**`pylddlib` is LEGO Digital Designer, not LDraw** — it reads `.lxf`/`.lxfml` and LDD's `db.lif`.
No LDraw line types, no MPD, no BFC. LDD was discontinued by LEGO in 2022.

### 9.1 The normative ruleset: Parts Tracker submit validation

<https://library.ldraw.org/documentation/policies-and-procedures/parts-tracker-submit-validation-checks-and-automatic-corrections>
(ratified, official). **Closed, server-side, no public API** — you cannot run it locally or in CI.
But it is the best available *specification* for anyone writing their own validator.

Rejection-level checks include: header field presence/validity; `0 BFC CERTIFY CCW` required in the
header; filename charset and directory-vs-type agreement; **any number in types 1–5 exceeding 5
decimal places**; leading/trailing zeros; **type 2/5 not colour 24**; **type 1/3/4 that is colour
24**; identical vertices; **singular matrix on a type 1**; collinear vertices on types 3/4/5;
**type 4 exceeding 3° planar deviation**; type 4 that is concave or bowtie.
It also applies **silent automatic corrections**: UTF-8 repair, whitespace normalisation,
`Unofficial_` prefix insertion, and **reordering of out-of-order header commands**.

The human-facing catalogue is
<https://www.ldraw.org/docs-main/ldraw-org-quick-reference-guides/common-error-check-messages.html>
(items 1–81 with HOLD/WARNING verdicts), including `Loop in reference found` (15),
`Lines do not end with <CR><LF>` (47), `First line after BFC INVERTNEXT isn't linetype 1` (51),
`T-Junction detected` (59), `Mirrored studs detected` (73), `Overlapping triangle found` (77).

### 9.2 The tool comparison

| Tool | Kind | Maintained? | Headless / CI | Validates |
|---|---|---|---|---|
| **LDView** ([repo](https://github.com/tcobbs/ldview), GPL-2.0) | C++ viewer + `LDLoader` library | ✅ **excellent** — last commit 2026-08-20, v4.7 2026-02-23 | ✅ dedicated OSMesa/EGL binary `ldview` (lowercase), DEB/RPM published | **Richest taxonomy runnable headlessly** — 18 error types (§8.11), incl. model loops, MPD duplicate-FILE, singular matrix, non-uniform transform, 10 distinct BFC ordering conditions |
| **LDPartEditor** ([repo](https://github.com/nilsschmidt1337/ldparteditor), MIT, Java) | Part authoring GUI | ✅ **healthiest in the space** — v1.9.04, 2026-07-15, releases every 6–10 weeks | ❌ **GUI only.** `main()` takes one arg: a file to open | **Deepest live checker.** Collinear/concave/coplanar/hourglass quads, identical vertices/control points, duplicated lines, singular matrix, recursive file reference, `~Moved to` refs, whitespace/case/slash in filenames, flat-subfile scaling, colour-vs-linetype, ~30 header placement rules, MLCAD BFC relicts. Separate **TJunctionFinder**, **Surface Overlap Finder**, **Unificator**, **PartReview** (4-view incl. BFC) |
| **DATHeader** ([site](https://ldraw.heidemann.org/index.php?page=datheader), GPL) | .NET part checker | ❌ **v3.0.24.0, 2020-11-01** | ✅ **`/r` headless reviewer mode**, `/c` autocorrect, `/l` whole-library | The only **headless, batch, officially-endorsed** part validator. Windows-only, **does not run under Mono** |
| **`pyldraw3`** ([GitHub](https://github.com/hbmartin/pyldraw3), [PyPI](https://pypi.org/project/pyldraw3/)) | Python library | ⚠️ v1.7.0 2026-08-19, but **created 2025-07-22, 1★, single maintainer** | ✅ pip-installable | **Best MPD validation anywhere**: structured `Diagnostic(severity, code, message)` with `mpd.misplaced_nofile`, `mpd.content_after_nofile`, `mpd.duplicate_section`, `mpd.unresolved_submodel`, `mpd.cycle`, `model.singular_matrix`, `model.non_orthonormal_matrix`, `model.unknown_part/colour`, `part.reference_cycle`. **Zero BFC semantics** |
| **buildinginstructions.js** ([repo](https://github.com/LasseD/buildinginstructions.js), Unlicense) | JS renderer | ✅ last commits 2026-08-15 | n/a | **Powers LDraw.org's own [Model Viewer](https://library.ldraw.org/model-viewer)** and brickhub.org. Full types 0–5, real `0 NOFILE` handling, full BFC + a **BFC debug-visualisation module**, `!TEXMAP`, `0 !DATA`, `onError`/`onWarning` callbacks, and **`js/LDROMR.js` — the only maintained open OMR compliance checker**. **Not on npm**; you vendor it |
| **three.js `LDrawLoader`** ([source](https://github.com/mrdoob/three.js/blob/dev/examples/jsm/loaders/LDrawLoader.js)) | JS loader | ✅ ships in `three` | n/a | **Renders well, validates almost nothing.** See §9.3 |
| **`ldr_tools`** (Rust, [repo](https://github.com/ScanMountGoat/ldr_tools_blender)) | Rust lib + PyO3 | ✅ 2026-07-11 | library | Types 1–5, MPD `FILE`/`NOFILE`, **full BFC** (`BfcCommand` enum, `Winding` type). Parse errors only. **Not on crates.io** |
| **`ldraw.rs`** ([repo](https://github.com/segfault87/ldraw.rs)) | Rust lib | ✅ 2026-04-11, 131★ | library | Types 1–5, `MultipartDocument`, **full BFC** correctly separating file-level certification from line-level statements, typed `ParseError` variants wrapped in `DocumentParseError{line_number, error}`. **Not on crates.io** |
| **`weldr`** ([crates.io](https://crates.io/crates/weldr)) | Rust lib | ⚠️ **crate 0.3.1 = 2020-12-12**; repo 2024 | library | **`cargo add weldr` gets you a 2020 crate with ZERO BFC support and no MPD.** MPD landed in git 2023 and was never released |
| **ExportLDraw** ([repo](https://github.com/cuddlyogre/ExportLDraw), GPL-2.0) | Blender addon | ✅ 2025-10-04 | Blender-bound | **Best BFC implementation in Python** — `meta_bfc()` handles CERTIFY/NOCERTIFY, CW/CCW with accumulated inversion, CLIP/NOCLIP, INVERTNEXT, **and the determinant-sign rule**. Also `!TEXMAP` + Studio's `PE_TEX_*`. Validates nothing |
| **ImportLDraw** ([repo](https://github.com/TobyLobster/ImportLDraw)) | Blender addon | ✅ v1.2.3 2026-04-08, 370★ | Blender-bound | Full BFC. **No type 5.** Validates nothing |
| **MPDCenter** ([site](https://ldraw.heidemann.org/index.php?page=mpdcenter)) | .NET | ❌ **v2.5.1.0, 2019-01-01** | GUI | OMR conformity (formal), unresolved references, bulk header editing. **Its own known-issues list says it HANGS on reference loops** |
| **LDInspector** | Java | ⚠️ *"pre-alpha… very time consuming"* per its own wiki | CLI exists (`java ldinsp.tools.LDITFileCheckerCollision`) | **Has real collision detection** — but no public source repo, no stated licence, not on LDraw.org's tools page |
| **`ffollett/ldraw-validator`** | Python, 2★ | 2026-02-19 | CLI | **Parses types 0 and 1 only**; its "narrow phase" is *another* axis-aligned overlap test with `epsilon = 0.05`. **No mesh, no hull, no triangle test anywhere** |
| **`domdfcoding/ldr-lint`** | Python, v0.0.0 | 2026-07-06 | — | Despite the name it is a **formatter**, not a linter |
| **`ldraw` (npm)** | JS | ❌ **`latest` tag points at a 2015 publish** | — | A trap: matches BFC by exact full-line string equality, no MPD, fetches parts over plain `http://` |

### 9.3 three.js `LDrawLoader` — what it does and the dangerous part

- **MPD: partial.** `0 FILE` handled; **`0 NOFILE` not implemented at all** (zero occurrences) —
  content after a `NOFILE` is silently attributed to the preceding file. Split is a case-sensitive
  `line.startsWith('0 FILE ')`.
- **Line types 1–5, including type 5** — but conditional lines require
  `loader.setConditionalLineMaterial(...)` or it **throws**.
- **BFC: reads and applies correctly, reports nothing.** Handles CERTIFY/NOCERTIFY/CW/CCW/
  INVERTNEXT/CLIP/NOCLIP, normalises winding to CCW, and at merge time applies
  `matrix.determinant() < 0` XOR `inverted`. **The only BFC diagnostic in 2 510 lines is a
  `console.warn` for an unrecognised token.**
- **Colour 16/24: correct.** `colorCode === '16' ? parentColor : own`, and for edges
  `lineColorCode = colorCode === '16' ? '24' : colorCode`.
- **Smoothing: the best-engineered part.** Treats **type-2 line segments as hard-edge markers**,
  hashing edges into a `hardEdges` set and refusing to smooth across them.
- ⚠️ **`getVector()` is three bare `parseFloat` calls with no `isNaN` guard.** A truncated line, a
  comma decimal separator, or a stray token produces **silent NaN vertices** that reach GPU buffers
  and render as an invisible or exploded mesh **with no console output at all**. If you build on it,
  validate coordinates yourself before handing them over.
- `!TEXMAP` and `!DATA`: not implemented. Non-planar/concave quads, collinear points, coincident
  vertices, singular matrices: **none checked**.

### 9.4 LDView headless in CI — the recipe, and two sharp caveats

LDView ships a **dedicated OSMesa/EGL command-line binary**, lowercase `ldview`, distinct from the
GUI `LDView`. Its man page: *"command line version of LDView using OSMesa to run on server without
X11."* No `xvfb` needed. DEB/RPM published on
<https://tcobbs.github.io/ldview/Downloads.html>.

**Caveat 1 — the exit code is worthless.** `main()` ends with an unconditional `return 0;` and the
return value of `doCommandLine()` is discarded. **LDView always exits 0 regardless of how many
errors the model contains.** Any gate must parse stdout.

**Caveat 2 — you must render to get diagnostics.** The console alert handler is instantiated
*inside* `doCommandLine()`, which only runs when a snapshot or export is requested. There is **no
"check only" mode**.

The output is consistently parseable:
```
<Level>: <message>          # Level ∈ CriticalError | Error | Warning
File: <filename>
Line #<n>: <the raw file line>
    <extra info, indented 4 spaces>
```
Verbosity: default 1 = critical + errors; **`-v`** = 2 adds warnings; `-q` = critical only;
`-qq` = silent. On Windows invoke `LDView.com`, not `.exe`, for console output.

```bash
ldview model.mpd -SaveSnapshot=/tmp/out.png -v -CheckPartTracker=0 2>&1 | tee diag.txt
grep -qE '^(Error|CriticalError):' diag.txt && exit 1
```

**This is the most capable open-source LDraw validator runnable in CI today** — it just needs
wrapping. Note `-CheckPartTracker=0` disables the network fetch; leave it on only if you want the
`Unofficial part used` warning, which **requires network access and does not fire for locally-present
unofficial parts.**

### 9.5 BFC validation specifically

| Tool | Meta-syntax checks | Determinant handling | **Geometric winding correctness** | Headless |
|---|---|---|---|---|
| LDView | ✅ 10 distinct conditions | ✅ | ❌ **visual only** (`-BFC=1 -RedBackFaces=1 -GreenFrontFaces=1`) | ✅ (must render) |
| LDPartEditor | ✅ deepest, incl. flat-subfile INVERTNEXT + MLCAD relicts | ✅ | ❌ visual (BFC view) | ❌ |
| DATHeader | ✅ | partial | ❌ | ✅ `/r` |
| Parts Tracker | ✅ requires `0 BFC CERTIFY CCW` | via singular-matrix check | ❌ | ❌ server-side |
| ExportLDraw / ldr_tools / ldraw.rs / buildinginstructions.js / three.js | apply correctly | ✅ | ❌ | they render, not report |
| weldr (crates.io) | ❌ none at all | n/a | ❌ | n/a |

**No tool anywhere verifies that BFC winding is *geometrically* correct** — that your mesh is a
consistently-oriented manifold with outward normals. Every tool checks meta-command syntax and
ordering; orientation correctness is a **human eyeball job** against red/green face rendering.

### 9.6 Collision / interference checking — the honest state

**Nothing open-source does true geometric collision detection on LDraw models.**

| Tool | Geometric collision? | Notes |
|---|---|---|
| **BrickLink Studio** | ⚠️ **bounding boxes, not meshes** | Hand-authored per-part `.col` AABBs (§8.9). Precision is coupled to render quality. Proprietary |
| **LeoCAD** | ❌ | Code search for "collision" → 0 results; [issue #184](https://github.com/leozide/leocad/issues/184) closed unimplemented |
| **LDCad** (native) | ❌ | Snapping only; its [features page](https://www.melkert.net/LDCad/features) says "basic part snapping" |
| **LDCad Lua script** (Frenz) | ✅ real triangle–triangle | **O(n²); ~15 parts = 32 ms; maxes out at ~40 parts** within the 250 ms macro timeout. Beta |
| **LDInspector** | ✅ same algorithm, has a CLI | *"pre-alpha… very time consuming"*; no repo, no licence |
| **Mecabricks** | ❌ | Commonly assumed to have it; it's an open [feature request](https://mecabricks.com/en/forum/topic/70966) |
| **`ffollett/ldraw-validator`** | ❌ AABB only | Source-verified: no mesh, no hull, no triangle test |
| **SimStudio** | ✅ hand-curated compound colliders | No licence declared; Technic palette only. Independently reinvented Studio's `.col` approach |

The crux, from a LeoCAD contributor on #184 — and it explains why every naive approach fails:

> **"LDraw parts are not convex and their bounding boxes are expected to overlap."**

Worse: **correctly-connected LEGO parts are *supposed* to interpenetrate**, at their bounding boxes
and slightly at their meshes.

**Nobody voxelises LDraw parts to check overlap.** Every LEGO voxel repo runs the opposite direction
— voxels *in*, LDraw *out* (mosaic/sculpture generation), where bricks are grid cells by
construction and overlap is impossible. And the grid assumption breaks exactly where you most need
collision detection: SNOT, hinges at non-90° angles, Technic pin/axle assemblies.

**No existing repo combines an LDraw loader with trimesh, python-fcl/FCL, Open3D, PyBullet, or
CoACD.** Searches for `ldraw+trimesh`, `ldraw+pybullet`, `ldraw+fcl` return **zero results.** This
is a genuine unclaimed integration.

**The only documented working method** is [BrickNet (CVPR 2026)](https://arxiv.org/abs/2604.22984):
render the library as **watertight meshes**, apply modified PFPOffset to **inset all part-mesh faces
by 0.25 LDU (0.1 mm)**, *then* run standard collision detection. Its findings:
- **Standard convex decomposition is unsuitable** — non-convex geometry plus non-watertight sources.
  (So: don't reach for CoACD.)
- *Real parts connect through stress-based plastic deformation, so **even correctly-connected parts
  have some inherent collision**.* **There is no zero-tolerance ground truth.**
- Even its own connectivity annotation needed **manual review**, conceding "many edge cases exist".

Three warnings if you attempt it: (1) skip convex decomposition; (2) **you must inset the meshes** —
raw mesh collision on raw LDraw geometry reports a collision on *every correct connection*;
(3) budget for a BVH broad-phase and a persistent per-part cache — the O(n²) approach died at 40
parts. Best LDraw→mesh half: [`ldr_tools_blender`](https://github.com/ScanMountGoat/ldr_tools_blender)
(Rust + PyO3).

### 9.7 MPD structure validation

The MPD spec's load-bearing admission — *"there are no clear scoping or namespace rules on MPD
files"* — means **"valid MPD" is partly undefined at the standard level**: no guidance on case
sensitivity, duplicate filenames, or namespace collision resolution.

| Capability | Best tool |
|---|---|
| Sub-model references resolve | **LDView** (`LDLEFileNotFound`), **pyldraw3** (`mpd.unresolved_submodel`), MPDCenter |
| **Reference cycles** | **LDView** (`LDLEModelLoop`, direct *and* indirect), **LDPartEditor**, **DATHeader**, **pyldraw3** — note **MPDCenter explicitly hangs on loops** |
| **Duplicate `0 FILE` names** | **LDView** — this is its *only* `LDLEMPDError`: "MPD sub-file already loaded: ignoring". Also pyldraw3 |
| **`0 NOFILE` semantics** | **pyldraw3**, **buildinginstructions.js**, **ldr_tools** — **three.js ignores `NOFILE` entirely**; `ldrawloader` splits only on the `.mpd` extension |
| Header completeness | **Parts Tracker** (exhaustive), **DATHeader**, **LDPartEditor** |
| **OMR compliance** | **`LDROMR.js`** in buildinginstructions.js (Unlicense, active) — the only maintained open OMR checker; MPDCenter (2019, Windows) |

**No single tool covers all of it.** LDView + pyldraw3 together get closest, and each is missing what
the other has: LDView has no `NOFILE` semantics reporting, pyldraw3 has no BFC.

## 10. Gotchas for a generating agent

Ordered roughly by how often an LLM gets them wrong.

### 10.1 Matrix order / transposition

| ✗ Wrong | ✓ Correct |
|---|---|
| Treating `a b c d e f g h i` as **column-major** (i.e. `(a,b,c)` = image of X axis) | `(a,b,c)` is the **first row**. `(a,d,g)` is the image of the X axis. Spec: `u' = a*u + b*v + c*w + x`. <https://www.ldraw.org/article/218.html> |
| Emitting `1 16 x y z <9 numbers> file` where the 9 numbers came from a column-major library (numpy `.flatten()` of a column-built matrix, glm/three.js `Matrix4.elements`) | Transpose first. three.js and glm store **column-major**; LDraw wants row-major. |
| Putting the translation **after** the rotation values | Order is `colour, x, y, z, a…i, file`. Translation comes **first**. |
| Composing nested transforms as `M_child · M_parent` | `M_world = M_parent · M_child` (column-vector convention). Position: `T_world = R_parent·T_child + T_parent`. |

Symmetric parts (2×4 brick at 180°) will *look* fine under a transposed matrix, which is why this
bug survives review. Test with an asymmetric part (a slope, a 1×2 jumper) or check
`det(R) == +1` **and** `R·Rᵀ == I`.

### 10.2 Y sign

| ✗ Wrong | ✓ Correct |
|---|---|
| Stacking upward by **increasing** Y | **−Y is up.** Stack upward by *decreasing* Y: `y -= 24` per brick, `y -= 8` per plate. <https://www.ldraw.org/article/218.html> |
| Placing a brick sitting on the ground at `y = 0` | The origin is on the part's **top** face and the body hangs down into +Y. A brick resting on `y=0` has `origin_y = −24`; a plate has `origin_y = −8`. |
| Adding the 4 LDU stud height when stacking | Don't. The stud is swallowed by the anti-stud. Brick-on-brick is exactly 24 LDU. |
| Emitting positive Y for "up" then "fixing" it by rotating 180° about X | That mirrors the part's handedness relative to the model and puts studs on the bottom. Just use negative Y. |

### 10.3 Colour

| ✗ Wrong | ✓ Correct |
|---|---|
| Using **16** on type-1 lines in a **model** | Colour 16 means "inherit from my caller". The top-level model has no caller ⇒ renders as the fallback `#FFFF80` mustard. Use a concrete code (4, 15, 71…). |
| Using a concrete code on type-1 lines inside a **part** file | Parts use **16** so the model can colour them. Verified in `3001.dat`: `1 16 … s\3001s01.dat`. |
| Using **24** on a type-1 line | *"Type 1 lines should never use colour 24."* 24 is for line types 2 and 5 only. <https://www.ldraw.org/article/218.html> |
| Inventing colour codes from memory | Resolve against the shipped `LDConfig.ldr`. <https://library.ldraw.org/library/official/LDConfig.ldr> |
| Emitting `0x2RRGGBB` direct colours for convenience | Legal but breaks BOM/parts-list generation and maps to no real element. Use palette codes. |
| Lowercase hex in a direct colour | *"All hex letters must be uppercase."* |

### 10.4 MPD structure

| ✗ Wrong | ✓ Correct |
|---|---|
| Putting the main model **last** | *"The first block in the MPD is treated as the 'main model'."* Put it first. <https://www.ldraw.org/article/47.html> |
| Emitting geometry or type-1 lines **before** the first `0 FILE` | *"non-comment code before the first block constitutes an error."* |
| Omitting `0 FILE` on the first block of a multi-block file | Recommended (not strictly required) to always open with `0 FILE`. Just always emit it. |
| Assuming `0 NOFILE` is mandatory after every block | It is *"only required if the file's contents are followed by non-LDraw content."* A new `0 FILE` implicitly closes the previous block. Emitting it anyway is harmless and clearer. |
| Trying to **nest** `0 FILE` blocks textually | Blocks are a flat list. Nesting is by *reference* only: a type-1 line naming another block's `0 FILE` name. |
| Referencing a submodel by a name that doesn't exactly match its `0 FILE` line | Names must match exactly, including the extension. Mismatch ⇒ the tool silently searches the parts library and renders nothing (or an unrelated part). |
| Naming a submodel `3001.ldr` or anything resembling a part number | *"There are no clear scoping or namespace rules on MPD files."* Collisions with library parts are undefined behaviour. Use distinctive names. |
| Mixing `/` and `\` in filenames | Official parts use `\` for subdirectories (`s\3001s01.dat`). In a **model**, reference parts by **bare filename** (`3001.dat`) with no path at all. |

### 10.5 Submodel origin drift

| ✗ Wrong | ✓ Correct |
|---|---|
| Building a submodel with its parts at arbitrary absolute coordinates copied from the main model, then referencing it at `0 0 0` | A submodel is a coordinate frame. Author it around a deliberate, documented local origin (e.g. the centre-top of its bottom-left stud column), then place it with an explicit translation. |
| Placing a submodel at a translation that is not a multiple of 10 (X/Z) or 4 (Y) | Unless the submodel is deliberately offset (jumper plate, SNOT), grid-aligned placements land on multiples of 10 in X/Z and multiples of 4 in Y — usually 20 and 8. |
| Accumulating float error through nested submodels | Emit integers. Every canonical placement in a studs-up model is an integer LDU value. If you produce `19.999999`, you have a bug. |
| Applying a rotation to a submodel without recomputing its footprint | Rotating a submodel about its own origin moves every child; the occupied stud columns change. Re-derive the footprint from `R·(local extent) + T`. |

### 10.6 BFC

| ✗ Wrong | ✓ Correct |
|---|---|
| Emitting `0 BFC CERTIFY CCW` in a **model** file | Meaningless for a file of type-1 part references, and harmful if you also emit polygons. Omit BFC from models entirely. <https://www.ldraw.org/article/415.html> |
| Emitting `0 BFC INVERTNEXT` in a model | *"should never be used before a part."* |
| Writing `0 bfc certify ccw` | BFC statements are **case-sensitive uppercase**. |
| Manually inverting winding to compensate for a mirrored (negative-determinant) placement | The renderer flips winding automatically for negative determinants. Don't double-correct. |
| Omitting `0 BFC CERTIFY CCW` from a generated **part** file | Required for the official library; every official part has it. |

### 10.7 Headers and metas

| ✗ Wrong | ✓ Correct |
|---|---|
| `0 !LDRAW_ORG Model` on an agent-generated file | Use `Unofficial_Model` unless it has actually been accepted into the OMR. <https://www.ldraw.org/article/593.html> |
| Using the **part** header order in a model (or vice-versa) | Model: `0 FILE` → description → `Name:` → `Author:` → `!LDRAW_ORG` → `!LICENSE`. Part: description → `Name:` → `Author:` → `!LDRAW_ORG` → `!LICENSE`. Note the model form has `0 FILE` *first*. |
| Emitting `0 ROTSTEP`, `0 !LPUB …`, `0 !LEOCAD …` in a general-purpose model | These are **tool extensions**, not standards, with tool-dependent semantics. Emit only `0 STEP`. |
| Assuming `0 STEP` is a tool extension | `0 STEP` **is** official — *"Marks the end of a building step."* <https://www.ldraw.org/article/218.html> |
| Free-form comments as `0 some text` | Preferred form is `0 // some text`; the bare form is deprecated. **Exception:** the header description line is a bare `0 <description>` by spec. |
| Unix line endings | Spec requires `<CR><LF>`. Every real parser tolerates `\n`, but emit `\r\n` for strict conformance. |

### 10.8 Part-number and library mistakes

| ✗ Wrong | ✓ Correct |
|---|---|
| Inventing part numbers (`3002.dat` for a 2×3 brick — actually correct, but `3003.dat` for 2×2 is also correct and `3004` is 1×2; agents guess wrong constantly) | Resolve against the real library index. Raw files are at `https://library.ldraw.org/library/official/parts/<num>.dat`; a 404 means the number is wrong or unofficial. |
| Using a BrickLink/Rebrickable ID as an LDraw filename | They usually coincide but not always (e.g. LDraw `3070b` vs BrickLink `3070`, recorded in the part's `0 !KEYWORDS BrickLink 3070`). |
| Referencing a `~Moved to …` alias part | e.g. `3040.dat` is `0 ~Moved to 3040b`. It renders, but is deprecated. Use the target. **1 159** of the 24 591 files in `parts/` are `~Moved to` aliases and **3 900** have a `~`-prefixed (hidden/obsolete) description — ~16 % of the directory is stuff you should not reference. Reject any part whose description line starts with `0 ~`. |
| Omitting the `.dat` extension | Required. |
| Assuming a Technic beam and a Technic brick align at the same Y | Beam origin = central hole centre; brick hole axis = `y + 10`. Verified in `32523.dat` vs `3700.dat`. |

### 10.9 Connectivity reasoning

| ✗ Wrong | ✓ Correct |
|---|---|
| Treating "part has no connectivity data" as "part has no connection points" | ~19 % of non-hidden official parts have **no shadow data anywhere in their reference closure** (§8.8d). Treat absence as **unknown**. |
| Reading only the part's own shadow file | 65.8 % of covered parts get their data **only** via inherited subparts/primitives. `3001.dat` has **no shadow file at all**. Recursion is mandatory. |
| Assuming female connections are always on the underside | `stud2.dat` (Stud Open) carries a female bore pointing **downward from the top of the stud**. Open studs, round bricks and Technic holes all have female connections elsewhere. |
| Assuming the LDCad snap spec is an LDraw standard | It is **explicitly unratified** (<https://wiki.ldraw.org/wiki/Part_Snapping_Language_Extension>), and the draft even proposes a *different prefix* (`0 !SNAP_CYL`) from the one every real file uses (`0 !LDCAD SNAP_CYL`). |
| Redistributing derived connectivity data under CC BY | The shadow library is **CC BY-SA 4.0** — stricter than the LDraw parts library's CC BY 4.0. ShareAlike propagates. |
| Doing zero-tolerance bounding-box collision | A stud (r = 6) mates *exactly* with a tube bore (r = 6), and studded parts' bounding boxes include the studs (`y_min = −4`). Every legal stack reports a collision. Studio deliberately makes its `.col` boxes **smaller than the real geometry** and uses an overlap threshold — do the same. |

### 10.10 Quick self-check an emitter can run on its own output

1. Every type-1 line has exactly **15** numeric tokens plus a filename.
2. `det(R) ≈ +1` and `R·Rᵀ ≈ I` for every placement of a real part (unless deliberately mirrored).
3. All `a…i` values ∈ {−1, 0, 1} for axis-aligned models.
4. All Y translations are ≤ 0 for a model built up from a ground plane at y=0, and are multiples of 4.
5. All X/Z translations are multiples of 10.
6. No colour 16 or 24 on a type-1 line in the top-level model.
7. Every type-1 filename either matches a `0 FILE` in this MPD or exists in the parts library.
8. The reference graph is acyclic and every block is reachable from the first block.

## 11. Expressing build rules as predicates over an LDraw file

The useful intermediate representation is not the raw file but a **flattened placement list**:
recursively expand every type-1 line through submodels, composing transforms, until you have a list
of `(part_number, colour, R, T)` tuples in world coordinates, plus, for each, the part's own
bounding box and stud/anti-stud positions in part-local coordinates.

```
Placement := (part: str, colour: int, R: 3x3, T: vec3)
flatten(block, R_acc, T_acc):
    for each type-1 line (c, t, r, f):
        R' = R_acc · r ;  T' = R_acc · t + T_acc
        if f names an MPD block:  flatten(that block, R', T')
        else:                     emit Placement(f, resolve_colour(c, inherited), R', T')
```

Layers of predicate, in increasing order of how hard they are to implement:

| Layer | Predicate examples | What it needs |
|---|---|---|
| **L0 Syntactic** | token counts, numeric parseability, valid line types, `0 FILE` present, no code before first block | Nothing but a line parser |
| **L1 Referential** | every referenced filename resolves; reference graph acyclic; no unreachable blocks; part numbers exist in the library; no `~Moved to` aliases | A library index (directory listing or 404 probe) |
| **L2 Transform** | `det(R)=+1`; `R·Rᵀ=I`; `R` entries ∈ {−1,0,1} for studs-up models; no scaling | Flattened placements |
| **L3 Grid** | X,Z translations ≡ 0 mod 10; Y ≡ 0 mod 4; no part floats above `y=0`; every part's bottom face coincides with some other part's top face or the ground | Flattened placements + per-part body height |
| **L4 Support / connection** | every part above the ground rests on ≥1 stud; a part's anti-studs align with studs below; count of engaged studs ≥ threshold; no part supported only by friction | Per-part **stud and anti-stud positions** — the missing dataset (§8) |
| **L5 Volumetric collision** | no two parts' solid volumes interpenetrate | Per-part meshes + a collision library, with stud/tube tolerance handling (§4.1) |
| **L6 Structural / aesthetic** | "avoid unsupported overhangs > n studs", "stagger seams between courses", "no exposed studs on a finished surface", "colour blocking is consistent" | Bespoke logic; L4 plus domain rules |

L0–L3 are cheap, deterministic, and catch the overwhelming majority of LLM emission errors.
L4 is where the real "does this build?" question lives and is gated on connectivity data.
L5 is expensive and, without tolerance handling, produces false positives on every legal stud.
L6 is not mechanically checkable in general.

## 12. What can actually be validated automatically — honest assessment

Three buckets: **works today off the shelf**, **you would have to write it (and it's tractable)**,
and **not mechanically checkable**.

### 12.1 Works today, off the shelf

| Rule | Tool | Confidence |
|---|---|---|
| File parses; every line is a valid type with the right token count | LDView (`Parse error`), pyldraw3 (`parse.invalid_line`) | **High** |
| Every referenced part/submodel resolves | LDView (`File not found`), pyldraw3 (`mpd.unresolved_submodel`) | **High** |
| No reference cycles (direct or indirect) | LDView (`Model loop`), LDPartEditor, DATHeader, pyldraw3 | **High** |
| No duplicate `0 FILE` names in an MPD | LDView (`MPD error`) — its *only* MPD check | **High** |
| `0 NOFILE` placement / content-after-NOFILE | pyldraw3, buildinginstructions.js | **Medium** — pyldraw3 is one month old, 1★ |
| Matrix is singular (a dimension scaled to zero) | LDView (`Singular matrix`), pyldraw3 (`model.singular_matrix`) | **High** |
| Part transformed non-uniformly / stretched / skewed | LDView (`Part transformed non-uniformly`) | **High** |
| Matrix not orthonormal (i.e. an emitter transposition or scale bug) | pyldraw3 (`model.non_orthonormal_matrix`) | **Medium** |
| Colour code exists in LDConfig; dithered/legacy colours | pyldraw3, LDPartEditor, DATHeader | **High** |
| Colour-vs-linetype legality (24 on type 1, non-24 on type 2/5) | LDPartEditor, DATHeader, Parts Tracker | **High** — *part files only* |
| `~Moved to` / deprecated part referenced | LDView (`Part renamed`), LDPartEditor | **High** |
| Sub-model filename contains whitespace / wrong slash / wrong case | LDView, LDPartEditor | **High** |
| Model header completeness / OMR compliance | `LDROMR.js`; MPDCenter (2019) | **Medium** |
| BFC meta-command syntax and ordering | LDView (10 conditions), LDPartEditor, DATHeader | **High** — *syntax only* |
| Part-file geometry hygiene (collinear/identical vertices, concave/bowtie/non-planar quads, T-junctions, overlapping triangles) | LDPartEditor, DATHeader `/r`, LDView | **High** — but **irrelevant to a model emitter**, which produces no polygons |

**The practical CI stack today** is: LDView OSMesa headless with stdout parsing (§9.4) for L0–L2,
plus a ~150-line homegrown script for the L3 grid predicates. That combination catches essentially
every mistake in §10.1–10.8.

I built exactly that script while writing this and ran it against a hand-emitted test model
(`tower.ldr`): it flags non-CRLF line endings, wrong token counts, non-numeric fields,
`det(R) ≠ +1`, colour 16/24 at the top level, X/Z off the 10-LDU grid, Y off the 4-LDU grid,
positive Y, unresolved references, and `~`-hidden parts. **All of L0–L3 is roughly a day's work
and has no dependencies beyond the parts library.**

### 12.2 Would have to be written — but tractable

| Rule | Why it isn't available | Effort |
|---|---|---|
| **Full L3 grid conformance** (multiples of 10/4, no floating parts, bottoms coincide with tops) | Nobody has written it; it is model-specific and trivially expressible | **Low** — ~150 lines |
| **Stud-grid occupancy / support checking** ("every part rests on ≥1 stud") | Requires per-part stud + anti-stud positions in world coordinates | **Low–Medium** given shadow data — the §8.8e extractor took ~60 lines |
| **Connection engagement counts** ("this part is held by only 1 stud") | Same input; then pair male↔female hotspots at coincident frames | **Medium** — needs the full §8.8c checklist (`SNAP_INCL`, `SNAP_CLEAR` positioning, gender/group matching, de-duplication) |
| **A reusable LDraw→connection-point dataset** | Doesn't exist as a first-class artifact. **No open-source parser of `!LDCAD SNAP_*` metas exists at all** | **Medium** — or start from [LTRON](https://github.com/aaronwalsman/ltron) (MIT), which already derives connection points from LDCad metadata |
| **Geometric collision detection** | See §9.6. No open tool; the only documented working recipe is BrickNet's inset-mesh approach | **High** — mesh pipeline + FCL + a calibrated tolerance + a labelled corpus |
| **Geometric BFC correctness** (outward-facing normals, consistent manifold) | No tool anywhere does this | **High**, and only matters if generating *parts* |
| **Parts Tracker rule conformance, locally** | The ruleset is published (§9.1) but the implementation is server-side and closed | **Medium** — the published check list is effectively a free spec |

**The single highest-leverage thing to build** is the shadow-library hotspot extractor (§8.8c/§8.8e).
It unlocks every L4 predicate, is ~300 lines done properly, and there is currently **no open
implementation in any language**.

### 12.3 Not mechanically checkable — be honest about these

- **"Is this model structurally sound?"** The nearest thing that exists is BrickLink Studio's
  proprietary [Stability check](https://studiohelp.bricklink.com/hc/en-us/articles/6501498505111-Stability-check),
  and BrickGPT/StableLego's Gurobi static-equilibrium models — which operate on a **20×20×20 grid
  with 8 brick types**, not arbitrary LDraw. Generalising to real parts is unsolved.
- **"Does this look like the thing it's supposed to be?"** No.
- **"Is this good building technique?"** Seam staggering, avoiding illegal connections, colour
  blocking, greebling density, "don't leave studs showing on a finished surface" — these are
  aesthetic/craft conventions with no formal definition. Expressible as heuristics over a flattened
  placement list, never as ground truth.
- **"Would this actually clutch together / hold?"** Clutch power depends on plastic deformation and
  tolerance stack-up. BrickNet's finding is decisive: *real parts connect through stress-based
  plastic deformation, so even correctly-connected parts have some inherent collision.* **There is
  no zero-tolerance geometric ground truth**, so every implementer (Frenz, Melkert, BrickLink,
  BrickNet) has landed on a tuned tolerance with an accepted false-positive/false-negative
  trade-off. Any collision checker you build inherits that.
- **"Is this buildable in the real world in this order?"** Requires reasoning about assembly
  sequence, hand access, and sub-assembly rigidity. `0 STEP` records an *intent*; nothing validates
  it.
- **"Is this part actually available in this colour?"** Needs a Rebrickable/BrickLink inventory
  join, not an LDraw check. And Rebrickable carries **no dimension data at all** — its `parts.csv`
  is four columns (§8.12).

### 12.4 The three structural gaps in the ecosystem

1. **The official standard has no connectivity, and the de-facto one is unratified.** The
   [Part Snapping Language Extension](https://wiki.ldraw.org/wiki/Part_Snapping_Language_Extension)
   says so explicitly, is stale relative to the shipping implementation, and even proposes a
   *different meta prefix* from the one every real file uses. The working system is maintained by
   essentially one developer.
2. **The specs are old and the tools are older.** File Format 1.0.2 is from **2012**; BFC from
   **2006**; the only headless official validator (DATHeader) from **2020**, Windows-only and
   Mono-broken; MPDCenter from **2019** and it hangs on reference loops. Meanwhile the *best*
   validator (LDView) always exits 0 and requires rendering to emit diagnostics.
3. **Packaging is a minefield.** `npm i ldraw` installs 2015 code because the `latest` tag was never
   moved. `cargo add weldr` installs a 2020 crate with zero BFC support. PyPI `ldraw` is a 2008
   write-only generator by a different author from the one everyone means. **Verify publish dates
   before adopting anything in this ecosystem** — the healthy implementations (`ldr_tools`,
   `ldraw.rs`, buildinginstructions.js) are all **git-only and unversioned**.

### 12.5 Bottom line for a generating agent

The overwhelming majority of what an LLM gets wrong when emitting LDraw — matrix transposition,
Y-sign, colour 16 at the top level, missing `0 FILE`, bad part numbers, off-grid placement — is
**cheaply and deterministically checkable today**, with LDView plus ~150 lines of your own code.
Build that gate first; it will catch more real defects than anything further up the stack.

The genuinely hard question — *"will this build, and will it hold together?"* — is **not answerable
off the shelf**, and only partially answerable at all. The best available path is the LDCad shadow
library (CC BY-SA 4.0, 81 % effective coverage) consumed through a hotspot extractor you write
yourself, giving stud-level support and engagement checks. True collision detection remains
unsolved in the open, and "good building" remains a human judgement.
