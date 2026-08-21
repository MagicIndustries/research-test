# Section: TECHNIQUE — LEGO master-builder constructive rules, expressed in LDraw units

**Audience:** an AI agent emitting LDraw / MPD. Every rule is stated so it can be checked against emitted geometry.

**Conventions used throughout**

- LDraw axes: **+X right, +Y DOWN, +Z toward viewer**. "Up" is **−Y**. A stud's axis vector is the part matrix applied to `(0,−1,0)`.
- All part origins/positions below are quoted in the part's own LDraw coordinate frame, taken directly from the official part file unless marked otherwise.
- **Verification tier** on every number:
  - `[P-LDRAW]` — read directly out of the official LDraw part/primitive `.dat` in the LDraw Parts Library (complete.zip, 2024–2025 release). Reproducible: fetch `https://library.ldraw.org/library/official/parts/<num>.dat`.
  - `[P-LEGO]` — LEGO's own published dimension/statement.
  - `[SEC]` — secondary technical reference that shows its working.
  - `[DERIVED]` — arithmetic shown inline.
  - `[ANEC]` — community anecdote, no measurement method published.

**Method for every `[P-LDRAW]` number.** The complete official LDraw Parts Library (`https://library.ldraw.org/library/updates/complete.zip`) was downloaded and each cited part was resolved recursively: line-type-1 sub-file references were composed into world transforms, `stud*.dat` / `stud3|4*.dat` primitives were classified as studs / anti-studs and their positions and axes reported; polygons were transformed and grouped by plane and by area-weighted normal to recover face angles, wall thicknesses and outlines. Every figure below can be regenerated from the part file named beside it.

---

## 0. Table of dimensional constants

| # | Constant | LDU | mm | Tier | Evidence |
|---|---|---|---|---|---|
| C1 | 1 LDU | 1 | 0.4 | [P-LDRAW] | LDraw.org file-format spec, "LDraw Units" |
| C2 | Stud pitch (grid module) | 20 | 8.0 | [P-LDRAW] | `3005` Brick 1×1 bbox X[−10..10] |
| C3 | Plate height | 8 | 3.2 | [P-LDRAW] | `3024` Plate 1×1 body Y[0..8] |
| C4 | Brick height | 24 | 9.6 | [P-LDRAW] | `3005` Brick 1×1 body Y[0..24] |
| C5 | Tile height | 8 | 3.2 | [P-LDRAW] | `3070b` Tile 1×1 bbox Y[0..8], no stud |
| C6 | Stud height (protrusion) | 4 | 1.6 | [P-LDRAW] | `p/stud.dat` cylinder y 0 → −4 |
| C7 | Stud outer diameter | 12 | 4.8 | [P-LDRAW] | `p/stud.dat` `4-4cyli` scale 6 → r=6 |
| C8 | Open-stud bore diameter | 8 | 3.2 | [P-LDRAW] | `p/stud2.dat` inner `4-4cyli` scale 4 → r=4 |
| C9 | Anti-stud (underside tube) inner Ø / outer Ø | 12 / 16 | 4.8 / 6.4 | [P-LDRAW] | `p/stud4.dat` r=6 inner, r=8 outer |
| C10 | Small solid anti-stud tube Ø (1×N plates) | 8 | 3.2 | [P-LDRAW] | `p/stud3.dat` `4-4cyli` scale 4 |
| C11 | Technic pin/axle nominal Ø | 12 | 4.8 | [P-LDRAW] | `p/connect.dat` shaft `4-4cyli` scale 6 |
| C12 | Technic pin collar Ø | 16 | 6.4 | [P-LDRAW] | `p/connect.dat` collar scale 8 |
| C13 | Technic hole pitch | 20 | 8.0 | [P-LDRAW] | `3701` holes at x = −20, 0, +20 |
| C14 | Technic hole axis depth below stud-face top | 10 | 4.0 | [P-LDRAW] | `3701` hole cylinders at y = 10 |
| C15 | Technic beam (liftarm) cross-section | 18 × 20 | 7.2 × 8.0 | [P-LDRAW] | `32523` face quad x=9, y=±10 |
| C16 | Technic beam end radius | 9 | 3.6 | [P-LDRAW] | `p/axlebeam.dat` !HELP "cylinder of 9 ldu radious" |
| C17 | Technic beam N-hole overall length | 20N − 2 | — | [DERIVED] | 20(N−1) + 2×9. Beam 3 = 58 ✓, Beam 5 = 98 ✓ (`32523`, `32316` bboxes) |
| C18 | Half-stud offset | 10 | 4.0 | [P-LDRAW] | `3794a` centre stud at x=0 vs grid ±10 |
| C19 | Quarter-stud offset | 5 | 2.0 | [DERIVED] | 20 / 4; no single part yields it — see Rule 3.4 |
| C20 | Half-plate offset | 4 | 1.6 | [P-LDRAW] | `4070` side-stud plane z=−6 vs face z=−10 |
| C21 | Ball-joint ball radius (Constraction) | 12.81 | 5.124 | [P-LDRAW] | `p/axlesphe.dat` !HELP "sphere of 12.81 ldu" |
| C22 | Towball ball radius | 8 | 3.2 | [P-LDRAW] | `p/4-4cyl19sph40.dat` !HELP, `8-8sphe` scale 8 |
| C23 | Technic gear pitch radius for T teeth | 1.25 × T | — | [DERIVED] | 24T gear `3648b` pitch r = 30 LDU; 8T+24T centre distance = 40 = 2 studs |
| C24 | Bracket wall thickness, 1×2 family | 4 | 1.6 | [P-LDRAW] | `99781`/`44728`/`99207` faces at z=−10 and z=−14 |
| C25 | Bracket wall thickness, `3956` 2×2 | 8 | 3.2 | [P-LDRAW] | `3956` faces at z=−20 and z=−28 |

### The four master identities

| ID | Equation | Consequence |
|---|---|---|
| **I1** | `5 × plate = 2 × stud` → `5 × 8 = 40 = 2 × 20` | A 5-plate stack turned 90° is exactly 2 studs. THE enabling identity for SNOT. `[DERIVED from C2, C3]` |
| **I2** | `3 × plate = 1 × brick` → `3 × 8 = 24` | Plate/brick layer interchange. `[DERIVED from C3, C4]` |
| **I3** | `2 × plate + 2 × stud-height = 1 × brick` → `8+8+4+4 = 24` | Why a tile on a plate on a plate reaches brick height. `[DERIVED]` |
| **I4** | `tile + 2 × plate = brick` → `8 + 16 = 24`; `plate + tile = 16 = 2 plates` | A tile occupies exactly one plate height, so `tile` and `plate` are height-interchangeable; the difference is only the 4-LDU stud. `[P-LDRAW C3, C5]` |
| **I5** | `5 × brick = 6 × stud` → `5 × 24 = 120 = 6 × 20` | The "6:5 rule". Five brick courses turned 90° are exactly 6 studs. `[SEC]` https://bricknerd.com/home/snot-basics-geometry-techniques-and-pitfalls-3-18-2021 ; `[DERIVED from C2, C4]` |
| **I6** | `1 stud = 2.5 plates` → `20 = 2.5 × 8` | Restatement of I1; explains why *odd* plate counts never square up. `[SEC]` same source |
| **I7** | `clear gap between adjacent studs = 20 − 12 = 8 LDU` | Equals the bar diameter (C8/C10), which is why bars nest between studs. `[DERIVED from C2, C7]` |

---

## 1. Core dimensional identities

**Rule 1.1 — The 5:2 identity is the only reason SNOT closes.**
`5 × 8 LDU = 40 LDU = 2 × 20 LDU`. A stack of 5 plates rotated 90° about any horizontal axis is exactly 2 studs long. Equivalently: a wall of plates laid on their side presents a 2-stud face for every 5 plates.
Machine-checkable as: for any SNOT sub-assembly rotated ±90°, `(number_of_plates × 8) mod 20 == 0` ⟺ `number_of_plates mod 5 == 0`.
Source: derived from C2/C3, both `[P-LDRAW]`. Secondary statement of the same rule: Didier Enjary, *Unofficial LEGO Advanced Building Techniques Guide* (ULABTG) §SNOT `[SEC]`.

**Rule 1.2 — 3 plates = 1 brick, exactly.**
`3 × 8 = 24 LDU`. There is no residual.
Machine-checkable as: `height_LDU mod 8 == 0` for any studs-up stack; `height_LDU mod 24 == 0` iff expressible in whole bricks.
Source: `3024` body Y[0..8]; `3005` body Y[0..24] `[P-LDRAW]`.

**Rule 1.3 — A tile is exactly one plate tall and carries no stud.**
`3070b` Tile 1×1: bbox Y[0..8], no `stud*.dat` reference above the body. A plate `3024` is Y[−4..8] — 8 LDU of body plus 4 LDU of stud.
Consequence: swapping a plate for a tile removes exactly 4 LDU of *engagement*, not of *height*.
Machine-checkable as: `top_surface_y(tile) == top_surface_y(plate)`; `bbox_height(tile) == 8`, `bbox_height(plate) == 12`.
Source: `[P-LDRAW]` `3070b`, `3024`.

**Rule 1.4 — Half-stud offset = 10 LDU, produced by jumper plates.**
- `3794a` Plate 1×2 with 1 centre stud: single top stud at `(0, 0, 0)`; a normal 1×2 has studs at `(±10, 0, 0)`. Offset = **10 LDU in X**. One solid anti-stud (`stud3`, r=4) at `(0, 4, 0)`.
- `15573` Plate 1×2 with groove, 1 centre stud, *without* understud: stud at `(0,0,0)`; **no anti-stud at all** — it clutches only by the outer tube walls. Weaker than `3794a`.
- `87580` Plate 2×2 with 1 centre stud: stud at `(0,0,0)`, footprint X[−20..20] Z[−20..20]. Offsets the grid by **10 LDU in BOTH X and Z simultaneously**.
Machine-checkable as: a child placed on a jumper has `(x mod 20, z mod 20) == (10, 10)` relative to the parent grid origin for `87580`; `(10, 0)` for `3794a`/`15573`.
Source: `[P-LDRAW]` part files.

**Rule 1.5 — There is no single part that yields a 5-LDU (quarter-stud) offset on the studs-up grid.**
5 LDU is reached only by *combining* an orthogonal SNOT step with a plate thickness, or by using the non-integer offsets of specific parts. The two legitimate routes:
(a) **Plate-in-SNOT**: 8 LDU (plate) laid sideways against a 20-LDU grid gives residues `8, 16, 4, 12, 0` (mod 20) as you stack 1..5 plates — so **4 LDU and 12 LDU are reachable, 5 LDU is not**. `[DERIVED]`
(b) True quarter-stud comes only from parts with intrinsic non-grid geometry (e.g. `4085` clip / bar-in-clip, `2555` tile with clip) and is a *tolerance-consuming* placement, not a clean grid step.
Machine-checkable as: reject any emitted translation with `t mod 20 == 5` unless the connecting parts are on the flex/tolerance whitelist.
Source: `[DERIVED]`; corroborated `[SEC]` by ULABTG's offset tables.

**Rule 1.5a — The offset ladder: 10 / 8 / 4 LDU generators give a 2-LDU ("tenth-stud") lattice.**
`[SEC]` Enjary, ULABTG ch.2 (Jason Railton's exhaustive collection):
- **jumper plate → 10 LDU** ("AZMEP", the half-stud offset)
- **SNOTted plate → 8 LDU**
- **headlight brick `4070` → 4 LDU**
- other SNOT parts → **6 LDU** and 4 LDU
- combinations → **2 LDU (tenth-stud) offsets**
- Technic 1×n bricks allow stud-in SNOT with a **10 LDU lateral offset**
- ⚠ the **1×4×2 fence carries an unexpected −7 LDU offset**
`gcd(10, 8, 4, 6) = 2` → **2 LDU is the finest offset the discrete system reaches; 5 LDU is NOT in the lattice.** `[DERIVED]`
Machine-checkable as: any studs-up offset must satisfy `t mod 2 == 0`; `t mod 20 == 5` requires a continuous-offset joint.

**Rule 1.5b — Continuous (non-lattice) offsets come from exactly three mechanisms.**
`[SEC]` ULABTG ch.2: (a) **bars/arms in clips**; (b) **Technic axles in Technic bricks**; (c) **1×2 tiles, which have no underside tube and slip freely on studs**.
Marakoeschtra's brick-bond wall uses (c) with **5 LDU vertical joints and 4 LDU horizontal joints** — an offset of 5 or 10 LDU per tile.

**Rule 1.6 — Headlight / Erling brick `4070`: side stud is recessed 4 LDU; the back carries a 4-LDU stud pocket.**
Measured from `4070.dat` `[P-LDRAW]`:
- Body: X[−10..10], Y[0..24], Z[−10..10] — a normal 1×1 brick envelope.
- Top stud `stud.dat` at `(0, 0, 0)`.
- **Side stud `stud2a` at `(0, 10, −6)`, axis `(0, 0, −1)`.** Base plane **z = −6**, i.e. **4 LDU inboard of the nominal brick face at z = −10**.
- Front (stud-side) face: recessed to z = −6 for Y[0..20]; flush at z = −10 only for the bottom 4 LDU (Y[20..24]).
- Top surface Y=0 spans only Z[−6..+10] — the front 4 LDU is cut away.
- **Rear pocket**: back face at z = +10 with a recess to **z = +6 (4 LDU deep)**, width X[−6..+6] = **12 LDU = exactly one stud diameter**, extending down to the part bottom (Y[16..24], 8 LDU tall). *A stud fits into it exactly* (stud height 4, Ø12) — this is the "back gap".
- **Side stud axis is at y = 10, i.e. 10 LDU below top / 14 LDU above bottom — NOT centred** (centre would be 12).
  → A 1×1 plate mounted on the side stud spans y ∈ [0, 20]: **flush with the brick's top face, 4 LDU short of its bottom face**. `24 − 20 = 4 LDU` `[DERIVED]`.
Machine-checkable as: `snot_plane(4070) == footprint_face − 4`; `stud_axis_y(4070) == 10`; a SNOT child mounted on it satisfies `child_top_y == parent_top_y` and `parent_bottom_y − child_bottom_y == 4`.

**Rule 1.7 — `87087` (Brick 1×1 with Stud on 1 Side) puts the SNOT plane exactly on the footprint face — 4 LDU proud of `4070`.**
`[P-LDRAW]`: `87087` side stud `stud2a` at `(0, 10, −10)`, axis `(0,0,−1)`; base plane **z = −10** = the brick face. Same y = 10.
`47905` (studs on two opposite sides): studs at `(0,10,−10)` and `(0,10,+10)`.
**Δ(87087, 4070) = 4 LDU** exactly. Substituting one for the other shifts an entire SNOT skin by half a plate.
Machine-checkable as: `snot_plane(87087) == footprint_face`; `snot_plane(4070) − snot_plane(87087) == 4`.

**Rule 1.8 — Bracket family: exact parent→child grid transforms.**
All measured `[P-LDRAW]` from the official part files. Parent frame = the bracket's own origin; the horizontal plate has its top face at y = 0, bottom at y = 8, top studs at y = 0.

| Part | Title | Top studs (parent grid) | Wall outer plane | Wall thickness | Side-stud axes | Child stud-grid transform |
|---|---|---|---|---|---|---|
| `99781` | Bracket 1×2 − 1×2 Down | (±10, 0, 0) | z = −14 | 4 LDU (z −14..−10) | (±10, **10**, −14) | T(0, +10, −14) · Rx(−90°) |
| `44728` | Bracket 1×2 − 2×2 Down | (±10, 0, 0) | z = −14 | 4 LDU | (±10, **10**, −14), (±10, **30**, −14) | T(0, +10, −14) · Rx(−90°) |
| `99207` | Bracket 1×2 − 2×2 Up | (±10, 0, 0) | z = −14 | 4 LDU | (±10, **−2**, −14), (±10, **−22**, −14) | T(0, −2, −14) · Rx(−90°) |
| `2436b` | Bracket 1×2 − 1×4 | (±10, 0, 0) | z = −14 | 4 LDU | (±10, ±30, **10**, −14) — 4 studs at y=10 | T(0, +10, −14) · Rx(−90°) |
| `3956` | Bracket 2×2 − 2×2 Up | *(none — plate has closed top)* | z = −28 | **8 LDU** (z −28..−20) | (±10, **−10**, −28), (±10, **−30**, −28) | T(0, −10, −28) · Rx(−90°) |
| `99780` | Bracket 1×2 − 1×2 Up | (±10, 0, 0) | z = −14 | 4 LDU | (±10, **−2**, −14) | T(0, −2, −14) · Rx(−90°) |
| `93274` | Bracket 1×2 − 2×4 | (±10, 0, 0) | z = −14 | 4 LDU | (±10, ±30, **10**/**30**, −14) — 8 studs | T(0, +10, −14) · Rx(−90°) |
| `36840` | Bracket 1×1 − 1×1 Up | (0, 0, 0) | z = −14 | 4 LDU | (0, **−2**, −14) | T(0, −2, −14) · Rx(−90°) |
| `36841` | Bracket 1×1 − 1×1 Down | (0, 0, 0) | z = −14 | 4 LDU | (0, **10**, −14) | T(0, +10, −14) · Rx(−90°) |
| `2422` | Bracket 2×2 − 1×4 | (±10, 0, ±10) | z = −28 | **8 LDU** | (0, **−10/−30/−50/−70**, −28) | T(0, −10, −28) · Rx(−90°) |
| `18986` | Bracket 1×1 − 1×2 | *(none)* | **z = −17** | **7 LDU** ⚠ | (±10, **10**, −17) | T(0, +10, −17) · Rx(−90°) |
| `99206` | Plate 2×2×⅔, 2 studs on side + 2 raised | (±10, 0, 0) and (±10, **8**, +20) | z = −10 | 0 (studs on the face) | (±10, **6**, −10) | T(0, +6, −10) · Rx(−90°) |

**The family is highly regular — memorise the two constants:**
- **Every 1×N-based bracket: SNOT plane at z = −14 (4 LDU outboard of the footprint edge).**
- **Every "Down" bracket: side-stud axis at y = +10. Every "Up" bracket: side-stud axis at y = −2.**
Exceptions, both `[P-LDRAW]` verified: `2422` and `3956` (2×2-based, wall 8 LDU, plane z = −28); **`18986` has a 7-LDU wall with its plane at z = −17 — it is off-system relative to the rest of the family** ⚠.

> **Part-number corrections to the brief:** `6231` is *Panel 1×1×1 Corner with Rounded Corners*, **not** a bracket. `4133` is *Window 2×4×3 Pane*, **not** a bracket. `3956` is a bracket but is the legacy 8-LDU-wall variant; the modern 2×2−2×2 Up is `35262`. `2436` and `3794` are both `~Moved to` stubs — use `2436b` (rounded corners) / `2436a` (square corners) and `3794a`. `[P-LDRAW]`

**Rule 1.8a — Bracket walls are ENTIRELY OUTBOARD of the parent footprint.**
For the 1×2 family the parent plate footprint ends at z = −10 and the wall occupies z ∈ [−14, −10]. The wall therefore **adds 4 LDU to the model's outline** and does not consume any of the parent's own volume.
Machine-checkable as: `wall_inner_plane == parent_footprint_edge` and `wall_outer_plane == parent_footprint_edge − wall_thickness`.
Source: `[P-LDRAW]` Z-plane extraction of `99781`, `44728`, `99207` → planes at exactly −10 and −14; `3956` → −20 and −28.

**Rule 1.8b — Bracket SNOT faces ARE vertically commensurate with the plate grid; they are NOT commensurate in the normal direction.**
`[DERIVED]` from 1.8:
- Down bracket (`44728`): side studs at y = 10 and 30 → a mounted 2×2 plate spans y ∈ [10−10, 30+10] = **[0, 40]**. Top edge lands exactly on the parent's **top face (y=0)**; total 40 LDU = **5 plates = 2 studs** (identity I1).
- Up bracket (`99207`): side studs at y = −2 and −22 → mounted plate spans y ∈ [−32, +8]. Bottom edge lands exactly on the parent's **bottom face (y=8)**; span again 40 LDU.
- Normal direction: mounted plate occupies z ∈ [−14, −22]. Its outer surface is **12 LDU** beyond the parent footprint edge (−10). `12 mod 8 = 4`, `12 mod 20 = 12` → **not a plate multiple and not a stud multiple**. This is the single most common bracket-SNOT alignment failure.
Machine-checkable as: after a bracket, assert `abs(child_face_offset_from_parent_edge) == 12` and require an explicit compensation element before the wall can rejoin a studs-up wall.

**Rule 1.8c — Two 1×2-family bracket walls back-to-back = exactly 1 plate.**
`4 + 4 = 8 LDU` `[DERIVED from C24]`. And `wall + plate + plate + wall = 4+8+8+4 = 24 = 1 brick`. Use these to return a bracket sandwich to the grid.
Machine-checkable as: `sum(wall_thicknesses + plate_thicknesses) mod 8 == 0`.

**Rule 1.9 — `99206` is the only common "bracket" whose SNOT plane sits ON the footprint face.**
Side studs at z = −10 with the plate footprint edge also at z = −10 `[P-LDRAW]`. Its side-stud axis is at y = 6, and it carries a second, raised stud pair at y = 8 (one plate below the main top face) at z = +20. Treat it as a *three-grid* part.

---

## 2. SNOT as a system

**Rule 2.1 — There are exactly 6 stud orientations. Enumerate them as axis vectors.**
`(0,−1,0)` up, `(0,+1,0)` down, `(+1,0,0)`, `(−1,0,0)`, `(0,0,+1)`, `(0,0,−1)`.
Machine-checkable as: every emitted part's stud axis, computed as `M · (0,−1,0)`, must be one of these 6 unit vectors (within 1e-6) unless the part is on the declared "angled" list.

**Rule 2.2 — Commensurability test for a SNOT interface.**
Let a sub-assembly of thickness `t` LDU be rotated 90°. It returns to the studs-up grid iff `t mod 20 == 0`. With plates only, `t = 8n`, so `8n mod 20 == 0 ⟺ n mod 5 == 0`. With bricks, `t = 24n`, so `24n mod 20 == 0 ⟺ 4n mod 20 == 0 ⟺ n mod 5 == 0` — **5 bricks = 120 LDU = 6 studs** `[DERIVED]`.
Machine-checkable as: `(plate_count*8 + brick_count*24) mod 20 == 0`.

**Rule 2.3 — The standard SNOT sandwich thicknesses (studs-out both faces).**
`[DERIVED]`, all exact:

| Sandwich | LDU | In studs | Notes |
|---|---|---|---|
| plate + plate | 16 | 0.8 | not commensurate |
| plate ×5 | 40 | **2.0** | ✔ closes |
| brick + brick | 48 | 2.4 | not commensurate |
| brick ×5 | 120 | **6.0** | ✔ closes |
| brick + plate ×2 | 40 | **2.0** | ✔ closes (24+8+8) |
| brick ×2 + plate ×2 | 64 | 3.2 | ✖ |
| brick ×3 + plate ×4 | 104 | 5.2 | ✖ |
| brick ×2 + plate ×7 | 104 | 5.2 | ✖ |
| tile + plate ×4 | 40 | **2.0** | ✔ closes (tile = 8) |
| `4070` back-to-back pair | 40 | **2.0** | ✔ 24+24 = 48 minus 2×4 recess = 40 |
| bracket wall ×2 | 8 | 0.4 | = 1 plate exactly |

**Rule 2.4 — What a SNOT alignment error looks like.**
A fractional-LDU or sub-20 residual appears as `Δ = t mod 20 ∈ {4, 8, 12, 16}` for plate stacks. The four canonical failure residuals and their usual fixes:
- `Δ = 4` → insert/remove a `4070` (Rule 1.6) or use a half-plate SNOT shim.
- `Δ = 8` → add or remove one plate.
- `Δ = 12` → add a bracket-wall pair (8) + …; or reverse the direction of a bracket (see 1.8b).
- `Δ = 16` → add 3 plates on the other axis (`24 − 8 = 16`).
Machine-checkable as: at every studs-up ↔ studs-out transition, compute the residual and require it to be 0.
`[DERIVED]`; the same taxonomy appears in ULABTG's SNOT chapter `[SEC]`.

**Rule 2.4a — SNOT-180 (inversion) minimum thicknesses — the catalogue.** `[SEC]` ULABTG ch.2.
"SNOT 180" = reversing stud direction in place (Steve Barile's "knob inversion"). Measured heights of the resulting sandwich:

| Mechanism | Resulting height |
|---|---|
| **Levers / control sticks (`4592`/`4593`) — the thinnest SNOT-180** | **16 LDU** (2 plates) |
| Half pins into Technic plates | **16 LDU**; **18 LDU** if using half-pin studs instead |
| Plate click hinges | **12 LDU** |
| Plain hinges | **24 LDU** (1 brick) |
| Brick click hinges | **28 LDU** |
| Technic pins | **28 LDU**, **34 LDU**, or **50 LDU** depending on arrangement |
| Half pins (bricks) | **48 LDU** (2 bricks) |
| 1×1 plate with clip, stacked both sides — *old thin* clip | **20 LDU** (1 stud) |
| 1×1 plate with clip, stacked both sides — *new thick* clip | **24 LDU** (1 brick) |
| `2×4×2` brick with studs on sides (Santa Fe undercarriage) | **40 LDU** (5 plates — closes, identity I1) |
| other bricks with studs on sides | **20 LDU** |

Machine-checkable as: inversion sandwich height must be one of these values for the chosen mechanism; only **16, 20, 24, 40** are grid-commensurate in at least one axis.
⚠ Technic bricks, liftarms, beams and Clickits are **12 and 20 LDU thick — not multiples of the plate height**.

**Rule 2.5 — Returning to the normal grid.**
The only *rigid* returns are: (a) the 5-plate/2-stud closure (I1); (b) a matched pair of opposing SNOT mounts of identical type; (c) a bracket + inverted bracket pair. Everything else leaves a residual that must be absorbed by clearance, which is only legitimate if the residual is ≤ the tolerance budget in Rule 5.x.

**Rule 2.6 — Vertical stud-axis heights on SNOT bricks are all 10 LDU below the top face.**
`4070`, `87087`, `47905` all at y = 10 `[P-LDRAW]`. Technic brick holes are also at y = 10 (C14). Click-lock hinge axes on brick sides are also at 10 LDU below the top face (`p/clh4.dat` !HELP) `[P-LDRAW]`.
→ **10 LDU below the top face of a brick is LEGO's canonical "side feature" height.** A SNOT child mounted at that height is centred on a 20-LDU cell that starts flush with the brick top and ends 4 LDU short of the brick bottom.
Machine-checkable as: for any 1-brick-tall side-mount, `stud_axis_y − parent_top_y == 10`.

**Rule 2.7 — Plate-side click-hinge and SNOT feature heights.**
`p/clh4.dat` !HELP `[P-LDRAW]`: "Placement on side of bricks … place **10 Ldu below top surface and 6 Ldu off side surface**"; "off side of plates and windscreens … **2 Ldu below top surface and 6 Ldu off side surface**".
`p/clh2.dat`, `clh9`, `clh13` !HELP: "place **1 Ldu below top surface** centered on stud location".
`p/clh6.dat`, `clh6u`, `clh6d` !HELP: "For plates place **2 LDU below top surface**".
Machine-checkable as: hinge pivot axis positions must equal these offsets exactly.

---

## 3. Angles

### 3A. Pythagorean-triple constructions

**Rule 3.1 — A brick-built angle is *exact* only if its tangent is rational AND its hypotenuse is an integer number of studs.**
A hinged panel of length `L` studs rotated by θ lands back on the grid iff `(L·cosθ, L·sinθ)` are both integers × 20 LDU. That requires `(L cosθ, L sinθ, L)` to be a Pythagorean triple.
Machine-checkable as: `round(L*cos(θ)*20) == L*cos(θ)*20` and `round(L*sin(θ)*20) == L*sin(θ)*20` within 1e-9.
`[DERIVED]`; standard statement in ULABTG "Angles" chapter `[SEC]`.

**Rule 3.2 — Exact triple table (LDU).** `[DERIVED]` — arithmetic is `θ = atan(a/b)`, legs `20a` × `20b` LDU, hypotenuse `20c` LDU.

| Triple a-b-c | Legs (LDU) | Hyp (LDU) | Hyp (studs) | θ = atan(a/b) | 90 − θ |
|---|---|---|---|---|---|
| 3-4-5 | 60 × 80 | 100 | 5 | **36.8699°** | **53.1301°** |
| 5-12-13 | 100 × 240 | 260 | 13 | **22.6199°** | **67.3801°** |
| 8-15-17 | 160 × 300 | 340 | 17 | **28.0725°** | **61.9275°** |
| 7-24-25 | 140 × 480 | 500 | 25 | **16.2602°** | **73.7398°** |
| 20-21-29 | 400 × 420 | 580 | 29 | **43.6028°** | **46.3972°** |
| 9-40-41 | 180 × 800 | 820 | 41 | 12.6804° | 77.3196° |
| 12-35-37 | 240 × 700 | 740 | 37 | 18.9246° | 71.0754° |
| 28-45-53 | 560 × 900 | 1060 | 53 | 31.8908° | 58.1092° |
| 33-56-65 | 660 × 1120 | 1300 | 65 | 30.5102° | 59.4898° |
| 16-63-65 | 320 × 1260 | 1300 | 65 | 14.2500° | 75.7500° |
| 11-60-61 | 220 × 1200 | 1220 | 61 | 10.3889° | 79.6111° |
| 36-77-85 | 720 × 1540 | 1700 | 85 | 25.0576° | 64.9424° |
| 48-55-73 | 960 × 1100 | 1460 | 73 | 41.1121° | 48.8879° |

**Rule 3.2a — NEVER write `cos(36.87°)`. Emit the exact rational.**
An LDraw yaw about Y is `1 <c> X Y Z  cosθ 0 sinθ  0 1 0  −sinθ 0 cosθ  part.dat`. For a Pythagorean angle both entries are rational, so the matrix is exact and the assembly closes to the last decimal. `[DERIVED]`

| Angle | cos | sin | terminating? |
|---|---|---|---|
| **36.8699°** | **4/5 = 0.8** | **3/5 = 0.6** | ✔ exact |
| **53.1301°** | **3/5 = 0.6** | **4/5 = 0.8** | ✔ exact |
| **16.2602°** | **24/25 = 0.96** | **7/25 = 0.28** | ✔ exact |
| **73.7398°** | 0.28 | 0.96 | ✔ exact |
| 22.6199° | 12/13 = 0.9230769231 | 5/13 = 0.3846153846 | repeating |
| 67.3801° | 0.3846153846 | 0.9230769231 | repeating |
| 28.0725° | 15/17 = 0.8823529412 | 8/17 = 0.4705882353 | repeating |
| 43.6028° | 21/29 = 0.7241379310 | 20/29 = 0.6896551724 | repeating |
| 31.8908° | 45/53 = 0.8490566038 | 28/53 = 0.5283018868 | repeating |

Transcendental comparators: 15° → 0.9659258263 / 0.2588190451; **22.5° → 0.9238795325 / 0.3826834324**; 30° → 0.8660254038 / 0.5; 45° → 0.7071067812 twice; 67.5° → 0.3826834324 / 0.9238795325.
Machine-checkable as: for any Pythagorean rotation, assert `m[0]² + m[2]² == 1` exactly in rational arithmetic.
⚠ **LDraw's own 5-dp matrices introduce error if you re-derive angles from them**: 22.5° reads back as 22.499808° (−0.000192°); 11.25° as 11.249929°; 120° stored as 0.866 reads back as 120.000728°. 45° and the 3-4-5 family are exact. `[DERIVED]`

**Rule 3.2b — `6044` is a moulded 3-4-5 triangle.**
`6044` `Slope Brick 53 3 x 1 x 3 & 1/3 with Studs on Slope`: base **60 LDU (3 studs)**, height **80 LDU** (= 3 bricks + 1 plate = 3×24 + 8), sloped face **100 LDU (5 studs)** carrying 5 studs. `atan(80/60) = 53.1301°`. `[P-LDRAW]`
Machine-checkable as: this part *is* the triple — use it instead of building one wherever a 3-4-5 at 60×80 LDU is wanted.

**Rule 3.3 — Prefer 3-4-5 and 5-12-13; they are the only two whose hypotenuse (5 and 13 studs) fits in a normal MOC.**
3-4-5 needs a 5-stud hinged arm; 5-12-13 needs 13 studs. 20-21-29 (43.60°) is the standard "close-enough 45°" when a real 45° would leave the two ends off-grid.

**Rule 3.4 — Technic realisation: count HOLES, not studs.**
A Technic beam of `N` holes has hole centres spanning `20(N−1)` LDU and an overall length of `20N − 2` LDU (C17). A 3-4-5 triangle in beams therefore uses beams of **4, 5 and 6 holes** (spans 60, 80, 100 LDU).
Machine-checkable as: `hole_span(beam) == 20 * (holes − 1)`; triangle closes iff `span_a² + span_b² == span_c²` exactly in LDU².
`[P-LDRAW]` `32523` (Beam 3, bbox Z 58), `32316` (Beam 5, bbox Z 98).

**Rule 3.4a — Beam hole-count → beam sizes for each triple.** `[DERIVED]` from 3.4: a leg of `S` studs needs a beam of `S+1` holes.

| Triple | Beams (hole counts) | Pin-centre spans (LDU) |
|---|---|---|
| 3-4-5 | **4, 5, 6** | 60 / 80 / 100 |
| 6-8-10 | 7, 9, 11 | 120 / 160 / 200 |
| 5-12-13 | **6, 13, 14** | 100 / 240 / 260 |
| 8-15-17 | 9, 16, 18 | 160 / 300 / 340 |
| 7-24-25 | 8, 25, 26 | 140 / 480 / 500 |
| 20-21-29 | 21, 22, 30 | 400 / 420 / 580 |
| 12-35-37 | 13, 36, 38 | 240 / 700 / 740 |
| 28-45-53 | 29, 46, 54 | 560 / 900 / 1060 |

**Rule 3.4b — Beam origin convention and the half-thickness variant.** `[P-LDRAW]`
- **Odd-N** beams have a hole ON the origin (`z = 0, ±20, …`); **even-N** beams straddle it (`z = ±10, ±30, …`).
- ⚠ **`41677` (Beam 2 × 0.5) is NOT centred**: holes at `z = 0` and `z = 20`, bbox `z[−9, 29]`, and it is **10 LDU thick** (`y[−5, 5]`) — the "× 0.5" family is half a beam thick.
- Two coplanar beams on 20 LDU pitch leave a **2 LDU (0.8 mm) gap** (20 − 18).
Machine-checkable as: `hole_z ≡ 0 (mod 20)` for odd N, `≡ 10 (mod 20)` for even N; assert `41677` separately.

**Rule 3.4c — ⚠ Studded Technic bricks do NOT all put holes in the stud gaps. The 1×2 is the exception.** `[P-LDRAW]`
- `32000` Technic Brick **1×2**: studs at `x = ±10`, `peghole.dat` at `(±10, 10, ±10)` → **holes directly under the stud centres**.
- `3701` (1×4) and `3894` (1×6): studs at `±10, ±30, (±50)`, holes at `x = 0, ±20, (±40)` → **holes in the stud gaps, offset 10 LDU (half a stud)**.
Machine-checkable as: hole x-positions are `20k` for 1×4/1×6, `20k ± 10` for 1×2. Never assume one rule for the whole family.

**Rule 3.4d — Studded Technic and studless beams share NO vertical lattice.**
Studded Technic stacks on the brick pitch (**24 LDU**); liftarms stack on the hole pitch (**20 LDU**). `[DERIVED]` They realign only every `LCM(20,24) = 120 LDU`; mixing them forces a **4 LDU (1.6 mm) mismatch per layer**.
Similarly **half-beam (10 LDU) vs plate (8 LDU)**: `LCM(10,8) = 40 LDU = 2 studs = 5 plates = 4 half-beams`, with a **2 LDU mismatch per layer** in between. This is precisely Berard's "Technic half-beams and System plates are not friends" (Rule 5.42).
Machine-checkable as: any mixed studded-Technic / liftarm column must have height ≡ 0 (mod 120); any half-beam / plate column must be ≡ 0 (mod 40).

**Rule 3.5 — Technic angle connectors: fixed, exact angles in 22.5° steps.** `[P-LDRAW]` — the angle is in the official LDraw part title.

| Part | Name | Angle |
|---|---|---|
| `32013` | Technic Angle Connector #1 | **0°** — single moulded arm; matrix `−1 0 0 / 0 −1 0 / 0 0 −1` |
| `32034` | Technic Angle Connector #2 | **180°** — arms **strictly collinear** on Z at `x = y = 0` ⚠ |
| `32016` | Technic Angle Connector **#3** | **157.5°** (stored cos/sin 0.92388 / 0.38268) |
| `32192` | Technic Angle Connector **#4** | **135°** (0.70711 / 0.70711) |
| `32015` | Technic Angle Connector #5 | **112.5°** (0.38268 / 0.92388) |
| `32014` | Technic Angle Connector #6 | **90°** |
| `4450` | Technic Angle Connector **7** | **168.75°** (0.98079 / 0.19509) — the 11.25° half-step |

⚠ **Two corrections to the common AFOL mapping**, both `[P-LDRAW]`: `32016` is **#3 (157.5°)**, `32192` is **#4 (135°)** — they are frequently listed swapped. Each file also carries its moulded ID as a comment (`32016.dat` → `0 // 3`; `32192.dat` → `0 // 4`).
⚠ **`32034` (#2) has NO axle offset** — both arm axes are concurrent through the part origin, as in every other member of the family. Do not model it as a dog-leg.

The series is `180 − 22.5k, k = 0..4`, with `4450` inserting an 11.25° half-step. **22.5° is LEGO's canonical Technic angular quantum**; `360/22.5 = 16`, so sixteen `32016` connectors close a regular 16-gon exactly.
Per-arm geometry (identical across the family, subpart `s\32013s01.dat`): axle hole runs **10 → 30 LDU** from the origin along the arm axis; arm cross-section 20 LDU square; central barrel outer radius **9 LDU**, width 20 LDU, bore Ø12 LDU with a 2-LDU-deep Ø16 counterbore each face. `[P-LDRAW]`
Machine-checkable as: any angle-connector rotation must be a multiple of 11.25°; both arm axes must pass through the part origin; mating axles occupy 10–30 LDU.

**Rule 3.5a — Multi-way and cross-block connectors.** `[P-LDRAW]`
- `10288` Angle Connector (3 × 120°): three coplanar arms at **120.0007°**, tips at `(±25.98, 0, −15)` and `(0, 0, 30)`.
- `6611` 4-Way 60°: arms at 0/60/120/180°, verified **59.9993°**; tips `(±30,0,0)`, `(±15, 0, 25.981)`.
- `7329` 3-Way Y-shaped: 180° / 60° / 120°.
- `10197` Hub with 2 Axles at 90°: axle stubs along −Y and −Z, spanning 10 → 30 LDU.
- **Cross blocks all use exactly 20 LDU (1 stud) spacing, twin pins at ±10 LDU**: `6536` (axle X at origin, pin Z at `(0,20,0)`), `32291` (twin pins at `(±10, 20, 0)`), `41678` (axle X through origin, twin pins on **Y** at `(±10, ·, −20)`), `42003`, `32184`, `32557`, `44809` (three mutually perpendicular holes).
- `55615` / `49130` (3×3 Bent 90 with 4 Pins): three pin holes at `(0,−40,0)`, `(0,0,0)`, `(0,0,40)` — note **40 LDU (2-stud) spacing**, corner exactly 90.000°.
⚠ **Not connectors, commonly misfiled**: `32270` = Gear 12 Tooth Double Bevel; `6539` = Transmission Driving Ring; `32209` = Axle 5.5 with Stop.

**Rule 3.5b — The complete set of moulded Technic bend angles.**
`0, 11.25, 22.5, 45, 53.130102, 60, 90, 120, 135, 157.5, 168.75, 180`. **Anything else is a forced connection.** `[P-LDRAW]`
Machine-checkable as: reject any rigid Technic angle not in this set.

### 3B. Slopes and wedges — measured face angles (LDraw geometry, not marketing names)

**Rule 3.6 — The name on the box is not the angle. Use the measured normal.**
All values below computed from the face normal of the largest sloping face in the official `.dat`, `[P-LDRAW]`, method: transform every polygon to part space, take area-weighted distinct normals, `angle = acos(|n_y|)`.

| Part | LDraw title | Measured slope angle | Exact form | rise:run (LDU) |
|---|---|---|---|---|
| `3040b` | Slope Brick 45 2×1 | **45.0000°** | atan(1) | 20 : 20 |
| `3039` | Slope Brick 45 2×2 | **45.0000°** | atan(1) | 20 : 20 |
| `3665a` | Slope Brick 45 2×1 Inverted | **45.0000°** | atan(1) | 20 : 20 |
| `3048b` | Slope Brick 45 2×1 (hip) | **45.0000°** | atan(1) | 20 : 20 |
| `3298` | Slope Brick 33 3×2 | **26.5651°** | atan(1/2) | 20 : 40 |
| `4286` | Slope Brick 33 3×1 | **26.5651°** | atan(1/2) | 20 : 40 |
| `3300` | Slope Brick 33 2×2 Double | **26.5651°** (both faces) | atan(1/2) | 20 : 40 |
| `3747b` | Slope Brick 33 3×2 Inverted | **27.6992°** | atan(0.52496) | ≈ 21 : 40 |
| `54200` | Slope Brick 31 1×1×0.667 ("cheese") | **30.9638°** | atan(3/5) | 12 : 20 |
| `60481a` | Slope Brick 65 2×1×2 | **65.5561°** | atan(11/5) = atan(2.2) | 44 : 20 |
| `3684a` | Slope Brick 75 2×2×3 | **73.6104°** | atan(17/5) = atan(3.4) | 68 : 20 |
| `4460a` | Slope Brick 75 2×1×3 | **73.6104°** | atan(3.4) | 68 : 20 |

**Note the two systematic misnomers** (both `[P-LDRAW]` vs the common catalogue name):
- The "**33°**" family is really **26.5651° = atan(½)**. Error vs 33° = 6.43°.
- The "**75°**" family is really **73.6104° = atan(3.4)**. Error = 1.39°.
- The "**65°**" family is really **65.5561° = atan(2.2)**. Error = 0.56°.
- The "**45°**" family really is exactly 45°.
Machine-checkable as: if an agent needs a true 33°, no stock slope brick supplies it — the nearest exact grid angle is 30.5102° (33-56-65) or 31.8908° (28-45-53).

**Rule 3.7 — Wedge/wing plates give exact PLAN angles, all of form atan(1/n).** `[P-LDRAW]`, measured from the top-face (`Y=0`) edge outline.

| Part | Title | Slant edge Δ(across, along) LDU | Plan angle off the long axis |
|---|---|---|---|
| `43722a` / `43723a` | Wing 2×3 Right / Left | (20, 60) | **18.4349°** = atan(1/3) |
| `41769a` / `41770a` | Wing 2×4 Right / Left | (20, 80) | **14.0362°** = atan(1/4) |
| `51739` | Wing 2×4 (symmetric) | (18.5, 37) | **26.5651°** = atan(1/2) |
| `2419` | Plate 3×6 without Corners | (40, 40) | **45.0000°** |

Machine-checkable as: a wedge-plate run of `k` parts turns the outline by `k × angle`; the outline returns to the grid only if the accumulated `(Δacross, Δalong)` are both multiples of 20.

**Rule 3.7a — THE UNIFYING IDENTITY: every Pythagorean angle is the DOUBLE of a simple `1:m` wedge cut.**
`2·atan(1/m) = atan(2m / (m²−1))`, which is exactly the triple `(m²−1, 2m, m²+1)`. `[DERIVED]`
→ **A mirrored pair of `1:2` wedges gives 53.1301° (3-4-5). A mirrored pair of `1:3` wedges gives 36.8699° (6-8-10).** This is why reflected-wedge builds land on the grid.

| Cut ratio | Angle | Doubled | Generated triple | Example parts |
|---|---|---|---|---|
| 1:1 | 45.0000° | 90° | — | `3040b`, `3039` |
| **1:2** | **26.5651°** | **53.1301°** | **(3,4,5)** | `24299`/`24307`, `65426`/`65429`, `51739`, `3298`, `4286`, `3300` |
| **1:3** | **18.4349°** | **36.8699°** | **(8,6,10)** | `43722a`/`43723a`, `43708`, `54383`/`54384` |
| **1:4** | **14.0362°** | **28.0725°** | **(15,8,17)** | `41769a`/`41770a`, `93541`/`54093`, `3544`, `3545` |
| 1:5 | 11.3099° | 22.6199° | (24,10,26) | `30382` Wedge 2×16 Triple |
| 1:6 | 9.4623° | 18.9246° | (35,12,37) | `78443`/`78444`, `47397`/`47398` |
| 1:7 | 8.1301° | 16.2602° | (48,14,50) | — |
| 1:8 | 7.1250° | 14.2500° | (63,16,65) | — |
| 2:3 | 33.6901° | 67.3801° | — | `22391` Wedge 4×4 Pointed |
| 2:5 | 21.8014° | 43.6028° | (20,21,29) half | `30036` |
| 3:7 | 23.1986° | 46.3972° | (20,21,29) half | `3933`/`3934` |
| 2:7 | 15.9454° | 31.8908° | (28,45,53) half | — |

**And the bonus identity: `atan(1/2) + atan(1/3) = 45.0000000°` exactly** — one 1:2 wedge plus one 1:3 wedge makes a perfect 45° with **zero residual**. `[DERIVED]`
Machine-checkable as: `tan(a+b) = (ta+tb)/(1−ta·tb)`; with `ta=1/2, tb=1/3` the denominator is `1 − 1/6 = 5/6` and the numerator `5/6` → tan = 1 exactly.
`[SEC]` for the part→ratio assignments: https://www.newelementary.com/2025/04/lego-techniques-with-reflected-wedges.html

### 3B′. Bent liftarms — the 3-4-5 is moulded into the Technic system

**Rule 3.7b — ⚠ The LDraw name of a bent liftarm gives the DEVIATION from straight, not the interior corner angle.**
`6629`: arm directions `(0,0,1)` and `(0.8, 0, 0.6)`; `acos(0.6) = 53.130102°` deviation → **interior angle = 180 − 53.1301 = 126.8699°**. `[P-LDRAW]`

**Rule 3.7c — The 53.13° bent-liftarm family stores the 3-4-5 literally as `0.6`/`0.8` — zero rounding error.**
Verbatim from `32348.dat`: `1 16 16 0 72 0.6 0 0.8 0 1 0 -0.8 0 0.6 connhole.dat`. `[P-LDRAW]`

**Rule 3.7d — Bent-liftarm hole generator: `corner + k·(16, 12)` LDU.**
Because `20 × (0.8, 0.6) = (16, 12)` and `16² + 12² = 400 = 20²`, **every hole on the angled arm lands on integer LDU**. `[DERIVED]`

| Part | LDraw description | Deviation | Interior | Holes A / B | Corner at | Angled-arm holes |
|---|---|---|---|---|---|---|
| `6629` | Beam 4×6 Liftarm Bent 53.13 | **53.1301°** | 126.8699° | 6 / 4 | (0,0,100) | (16,112) (32,124) (48,136) |
| `32348` | Beam 4×4 Liftarm Bent 53.13 | **53.1301°** | 126.8699° | 4 / 4 | (0,0,60) | (16,72) (32,84) (48,96) |
| `32271` | Beam 3×7 Liftarm Bent 53.13 | **53.1301°** | 126.8699° | 7 / 3 | (0,0,120) | (16,132) (32,144) |
| `32009` | Beam 3×3.8×7 Bent 45 **Double** | **45.0000° ×2** | 135° ×2 | 7 / 3 | — | see below |
| `32140` | Beam 2×4 Liftarm Bent 90 | 90.0000° | 90° | 4 / 2 | (0,0,60) | (20,0,60) |
| `32526` | Beam 3×5 Bent 90 | 90.0000° | 90° | 5 / 3 | (0,0,80) | (20,0,80) (40,0,80) |
| `32056` | Beam 3×3×0.5 Bent 90 | 90.0000° | 90° | 3 / 3 | (0,0,0) | (20,0,0) (40,0,0) |
| `45803` | Beam 3×7×3 Bent 90 Double Chamfered | 90.0000° | 90° | 4 / 2 @ **40 LDU pitch** | (0,·,120) | (40,·,120) |
| `2477` | Beam 3×5 Bent 90 Alternating Holes | 90.0000° | 90° | 5 / 3 | (0,0,80) | alternating Y/X hole axes |

`32009` detail: arm A on Z at `z = −160 … −40` (7 holes, `x=0`); arm C on X at `x = 40, 60, 80`. Middle segment `(0,0,−40) → (40,0,0)`, Δ = `(40,0,40)`, length **40√2 = 56.5685 LDU**, carrying **no holes**. Both bends exactly 45.0000°; net turn 90°, net lateral offset 40 LDU.
⚠ **Corner holes are modelled with `peghole.dat` + ring primitives, not `beamhole`/`connhole`** — a naive grep under-counts every bent liftarm by exactly one hole.
⚠ Not bent, commonly misfiled: `64179` (Beam 7×5 Open Centre, outer 100 × 140 LDU, holes at `(±40,0,±20)` and `(±40,0,±60)`); `11478` (Beam 5×0.5, straight, holes at `z = 0, ±20, ±40`, `y ±5`).
All `[P-LDRAW]`.

### 3C. Hinges, click detents, turntables, ball joints

**Rule 3.8 — `2429` / `2430` Hinge Plate 1×4 Base/Top rotate about a VERTICAL axis located on a grid CORNER.**
`[P-LDRAW]` `2429.dat`: pivot cylinder `4-4cylo` at `(0, 4, 0)`, radius 4 LDU, axis along +Y. Stud group `stug-1x2` at `(−20, 0, 10)` → studs at `(−30, 0, 10)` and `(−10, 0, 10)`.
→ The pivot sits at `(0, ·, 0)` while the nearest stud is at `(−10, ·, 10)`: the pivot is at **(+10, +10) from a stud centre**, i.e. exactly on a stud-grid *corner*, and the pivot is at **y = 4 = mid-plate height**.
Machine-checkable as: `pivot == stud_centre + (±10, 0, ±10)`; rotation must be about `(0,1,0)` through that point.
Consequence: rotating the top half by θ moves its first stud on a circle of radius `sqrt(10² + 10²) = 14.1421 LDU` about the pivot.

**Rule 3.8a — Hinge pivot axes fall into exactly two classes.** `[P-LDRAW]`

| Part | Pivot axis | Location | Pivot radius |
|---|---|---|---|
| `2429` / `2430` Hinge Plate 1×4 Base/Top | **vertical (Y)** | part origin, `y = 4` (mid-plate) — a grid **corner** point | 4 LDU |
| `3830` / `3831` Hinge Brick 1×4 Top/Base | **vertical (Y)** | part origin, spanning `y = 0..8` | 8 LDU |
| `3937` / `3938` Hinge 1×2 Base/Top | **horizontal (X)** | `y = 10, z = 0` | 2 LDU (knuckle 4 LDU) |
| `6134` Hinge 2×2 Top | **horizontal (X)** | `y = 10, z = 0` | 6 LDU |

**`y = 10` again** — the same canonical side-feature height as `4070`, `87087`, Technic holes and click hinges (Rule 2.6). Four independent part families agree.
Machine-checkable as: horizontal-hinge rotations are `Rx(θ)` about `(·, 10, 0)`; vertical-hinge rotations are `Ry(θ)` about the part origin.

**Rule 3.9 — Free hinges (`2429`/`2430`, `3937`/`3938`, `3830`/`3831`, `6134`) have NO detents; click-lock hinges do.**
`[P-LDRAW]` — `3937` "Hinge 1×2 Base", `3938` "Hinge 1×2 Top", `3830`/`3831` "Hinge Brick 1×4 Top/Base", `6134` "Hinge 2×2 Top" carry no `clh*` (click-lock hinge) primitive; the click-lock family (`44567a`, `44568`, `30540`, `30552`, `30553`, `41678`, `44809`) is built from `p/clh1..clh14.dat`.
Machine-checkable as: `part_references_any(clh*) == has_detents`.

**Rule 3.10 — Click-lock hinge pivot placement is fixed by LDraw's own primitive documentation.** `[P-LDRAW]`, `!HELP` lines:
- Dual-finger on a **brick side** (`clh4`, `clh7`, `clh10`, `clh11`): pivot **10 LDU below the top surface, 6 LDU off the side surface**; the two halves are 180° apart about Z.
- Dual-finger on a **plate/windscreen side**: pivot **2 LDU below the top surface, 6 LDU off the side surface**.
- Single finger **on a plate top** (`clh2`, `clh9`, `clh13`): **1 LDU below the top surface, centred on a stud location**.
- Single finger **on a plate end** (`clh6`, `clh6u`, `clh6d`): **2 LDU below the top surface**.
- Single finger for **crevices/ledges** (`clh8`): **1 LDU below top surface, centred on a stud location** (example part `30369`).
Machine-checkable as: assert the pivot coordinates equal these offsets exactly.

**Rule 3.11 — The click-hinge detent is EXACTLY 22.5°. Proven twice, independently.**

*(a) Geometric proof `[P-LDRAW]`.* Every tooth-crest cylinder in `p/clh4.dat` (`Click Lock Hinge Half Dual Finger`) was located relative to the pivot at `(y = 0, z = 4)`. Crests sit at radius **5.810 LDU** at:
`90.0000°, 112.5046°, 134.9930°, 157.4954°, 180.0000°, 202.5046°, 224.9930°, 247.4954°, 270.0000°`
→ **9 detents at 22.5° spacing.** Valley cylinders at radius **5.750 LDU** sit at `78.7702°, 101.2298°, 123.7315°, 146.2408°, 168.7682°, 191.2318°, …` — exactly the **11.25° midpoints**.

*(b) LEGO-designer statement `[P-LEGO]`.* Jamie Berard, *Stressing the Elements*: "Click hinges must be in 'click.' **Approved angles are in multiples of 22.5 degrees.** Some LEGO projects require an engineer to determine whether an angle is legal."

`clh10` is literally named "Half Dual Finger **7-Position**" and carries 7 crests — at `0, 22.5, 45, 90, 135, 157.5, 180°`: **the 67.5° and 112.5° detents are deliberately omitted**. `clh11` = "Missing Clicks 2 and 4"; `clh7` = "3-Position Type 1".
Machine-checkable as: every click-hinge rotation ∈ `{n × 22.5°}`; for `clh10`-based parts additionally exclude 67.5° and 112.5°.

**Rule 3.11a — Which parts click and which are free.** `[P-LDRAW]` — the test is whether the part references a `clh*` primitive.
**CLICK (22.5° detents):** `44567a` (`clh6` at `(0, 2, −10)`), `44568` (`clh6d` at `(−20, 2, −10)`, `clh6u` at `(20, 2, −10)`), `30540` (two `clh4` at `(26, 10, 0)`, mirrored), plus the `clh1` (bricks) / `clh3` (arms) / `clh8` (crevices) families.
**FREE (continuous friction, no detent):** `2429`/`2430`, `3937`/`3938`, `3830`/`3831`, `6134`.
⚠ Naming trap: **`2429`/`2430` are the 1×4 hinge plates, not 1×2.** The 1×2 *click* plate is `44567a`.
**Use a free hinge, never a click hinge, whenever the target angle is not a multiple of 22.5°.**

**Rule 3.12 — Technic gear meshing / turntable radial law.**
A Technic gear with `T` teeth has pitch radius `1.25·T` LDU; two meshing gears require centre distance `1.25(T₁ + T₂)` LDU. Verified: 24-tooth `3648b` outer bbox 64.78 LDU, pitch Ø 60 LDU = 3 studs; 8T + 24T → `1.25(8+24) = 40 LDU = 2 studs` (the standard Technic gear spacing).
Machine-checkable as: `centre_distance == 1.25*(T1+T2)`; for an integer-stud frame require `1.25(T1+T2) mod 20 == 0` ⟺ `T1+T2 ≡ 0 (mod 16)`.
`[P-LDRAW]` `3648b`; `[DERIVED]` for the law.

**Rule 3.13 — Ball-joint ball radii.** `[P-LDRAW]`
- Constraction/CCBS ball (`32174` socket family, `axlesphe.dat` !HELP): **r = 12.81 LDU** (Ø 25.62 LDU = 10.25 mm).
- Technic towball (`2736` axle towball, `6628` pin towball; `p/4-4cyl19sph40.dat` !HELP with `8-8sphe` scaled 8): **r = 8 LDU** (Ø 16 LDU = 6.4 mm), on a 3.8-LDU-radius neck.
Machine-checkable as: socket centre-to-centre distance for a towball link = link length; ball centre must lie on the socket axis.

**Rule 3.13a — Ball-joint sweep limits are PUBLISHED, and they are anisotropic: ±35° in-plane, ±5° out-of-plane.**
`[P-LDRAW]` — verbatim `!HELP` from `p/joint8socket1.dat` (`Joint-8 Socket with Friction`):
```
0 !HELP it moves +/-35 degrees in the horizontal plane
0 !HELP 1 4 0 0 0 0.819152 0 0.573576 0 -1 0 0.573576 0 -0.819152 joint8ball.dat
0 !HELP it moves 5 degrees from a vertical position
0 !HELP 1 4 0 0 0 0.996195 0 0.087156 0.087156 0 -0.996195 0 1 0 joint8ball.dat
```
`cos35° = 0.819152`, `sin35° = 0.573576`; `cos5° = 0.996195`, `sin5° = 0.087156` — the matrices *are* the extreme poses.
→ **Total sweep: 70° in-plane, 10° out-of-plane.** This is emphatically **not** a spherical joint; treat it as a hinge with a small wobble.
Ball geometry: `joint8ball.dat` = `8-8sphe.dat` scaled 8 → **ball r = 8 LDU (Ø 16 LDU = 6.4 mm)**, neck Ø 8 LDU. Socket cup bbox `x[−10,10] y[−7.75,7.75] z[9,10]`.
Family: `14417` (Plate 1×2 with Ball on Side, ball at `(0,4,−20)`), `14418` (Plate 1×2 with Socket, socket at `(30,4,0)` — 10 LDU beyond the plate end, mid-plate height), `22484` (Bar 2L with Ball, ball at `(0,0,−10)`), `63082`.
Machine-checkable as: `|in-plane angle| ≤ 35°` AND `|out-of-plane angle| ≤ 5°`; reject any pose outside that wedge.

### 3D. Near-miss angles and their residuals

**Rule 3.14 — Quantify the residual before accepting a near-miss.**
For a target angle `θ_t` realised by an exact construction at `θ_a`, the lateral drift after a run of `L` LDU is `d = L · tan|θ_t − θ_a|`. `[DERIVED]`

| Target | Best exact triple | Actual | Error | Drift over 400 LDU (20 studs) |
|---|---|---|---|---|
| 15° | 16-63-65 | 14.2500° | 0.7500° | **5.24 LDU** |
| 22.5° | 5-12-13 | 22.6199° | 0.1199° | **0.84 LDU** |
| 30° | 33-56-65 | 30.5102° | 0.5102° | **3.56 LDU** |
| 45° | 20-21-29 | 43.6028° | 1.3972° | **9.76 LDU** |
| 60° | 56-33-65 | 59.4898° | 0.5102° | **3.56 LDU** |
| 67.5° | 12-5-13 | 67.3801° | 0.1199° | **0.84 LDU** |
| 75° | 63-16-65 | 75.7500° | 0.7500° | **5.24 LDU** |

**22.5° and 67.5° are the cheapest near-misses in the whole system** (0.84 LDU over 20 studs) — which is *why* LEGO chose 22.5° as the Technic angle-connector quantum (Rule 3.5).
Machine-checkable as: `drift = span_LDU * tan(radians(error))`; require `drift <= tolerance_budget` (see Rule 3.14d).

**Rule 3.14e — Better than triples: search LATTICE VECTORS, not Pythagorean triples.**
For a target angle `T` over a span `L` LDU the residual is `‖L·(cos T, sin T) − 20·round(L·(cos T, sin T)/20)‖`. Exhaustive search to 50 studs `[DERIVED]`:

| Target | Best span | Lands on lattice | Realised angle | Angular error | Residual LDU | Residual mm |
|---|---|---|---|---|---|---|
| **22.5°** | **13 studs** | (12, 5) | **22.6199°** | +0.1199° | **0.5439** | 0.2176 |
| **67.5°** | **13 studs** | (5, 12) | **67.3801°** | −0.1199° | **0.5439** | 0.2176 |
| **30°** | **30 studs** | (26, 15) | **29.9816°** | −0.0184° | **0.3848** | 0.1539 |
| 30° | 8 studs | (7, 4) | 29.7449° | −0.2551° | 1.4359 | 0.5744 |
| **60°** | **30 studs** | (15, 26) | **60.0184°** | +0.0184° | **0.3848** | 0.1539 |
| **45°** | **41 studs** | (29, 29) | **45.0000°** | 0 | **0.2439** | 0.0975 |
| 45° | 17 studs | (12, 12) | 45.0000° | 0 | 0.5887 | 0.2355 |
| 45° | 7 studs | (5, 5) | 45.0000° | 0 | 1.4214 | 0.5685 |
| **15°** | **31 studs** | (30, 8) | **14.9314°** | −0.0686° | **1.2193** | 0.4877 |
| 15° | 4 studs | (4, 1) | 14.0362° | −0.9638° | 2.8158 | 1.1263 |
| **75°** | **31 studs** | (8, 30) | **75.0686°** | +0.0686° | **1.2193** | 0.4877 |
| 25° | 85 studs | 36-77-85 | 25.0576° | +0.0576° | 0 (exact triple) | 0 |

**The lattice vector `(26,15)` at 30 studs beats the best 30° triple (33-56-65) by 28×** in angular error. Prefer lattice search whenever the span is available.
**15° has no good exact triple** — the closest are 16-63-65 (14.2500°, −0.75°) and 7-24-25 (16.2602°, +1.26°). Always use a lattice vector or a click hinge for 15°.

**Rule 3.14f — Isosceles near-triples for ~90° corners (hinged walls).**
`(a, a, n)` with `n ≈ a√2`; gap = `(n − a√2) × 20 LDU`. `[DERIVED]`

| Near-triple | True hyp (LDU) | Used (LDU) | Gap LDU | Gap mm | Forced apex | Dev. from 90° |
|---|---|---|---|---|---|---|
| (2,2,3) | 56.5685 | 60 | +3.4315 | +1.373 | 97.1808° | +7.18° ✖ |
| **(5,5,7)** | 141.4214 | 140 | **−1.4214** | −0.569 | 88.8540° | −1.146° |
| **(7,7,10)** | 197.9899 | 200 | **+2.0101** | +0.804 | 91.1694° | +1.169° |
| (8.5,8.5,12) | 240.4163 | 240 | −0.4163 | −0.167 | 89.8017° | −0.198° |
| **(12,12,17)** | 339.4113 | 340 | **+0.5887** | +0.236 | **90.1989°** | **+0.199°** |
| (29,29,41) | 820.2439 | 820 | −0.2439 | −0.098 | 89.9659° | −0.034° |
| (70,70,99) | 1979.8990 | 1980 | +0.1010 | +0.040 | 90.0058° | +0.006° |

**`(12,12,17)` is the workhorse** — 0.59 LDU residual, used in LEGO's own Corner Garage (10264). `(2,2,3)` is unbuildable. `[SEC]` https://bricknerd.com/home/hidden-math-the-numbers-that-make-lego-work-6-10-22
⚠ **The "2-3-4" approximation sometimes quoted is unusable**: `hyp(2,3) = 72.111 LDU`; nearest stud 80 → residual **7.889 LDU (3.16 mm)**. `[DERIVED]`

**Rule 3.14g — Forced-bow arithmetic: if you shorten a 1×N plate's span by `g` LDU, it bows by sagitta `s`.** `[DERIVED]`

| Part | Span | g = 1 LDU | g = 2 LDU | g = 4 LDU |
|---|---|---|---|---|
| 1×4 | 80 | s = 5.45 LDU (2.18 mm) | 7.68 (3.07) | 10.76 (4.30) |
| 1×8 | 160 | s = 7.73 (3.09) | 10.91 (4.36) | 15.36 (6.14) |
| 1×12 | 240 | s = 9.47 (3.79) | 13.38 (5.35) | 18.86 (7.55) |
| 1×16 | 320 | s = 10.94 (4.38) | 15.46 (6.18) | 21.81 (8.73) |

**Even 1 LDU of forced shortening produces multi-LDU visible bow.** Close the triangle geometrically; never force it.
Empirical ceiling `[SEC, inferred]`: triangles that actually appear in official sets cluster below **~0.6 LDU (0.24 mm)** total misfit; above **~1 LDU (0.4 mm)** the assembly will not close without visible bow.

### 3E. Bar-in-clip: the free-rotation escape hatch

**Rule 3.14a — The bar system is Ø 8 LDU and is dimensionally identical to three other bores. This is why it interlocks everywhere.** `[P-LDRAW]`
`48729a` Bar 1.5L: shaft bbox Z[−4..4] → **Ø 8 LDU (3.2 mm)**. Identical to:
- open-stud bore `stud2.dat` inner Ø 8 LDU (C8) → **a bar fits into any hollow stud**;
- solid anti-stud tube `stud3.dat` Ø 8 LDU (C10) → **a bar fits the under-tube of a 1×N plate**;
- `3957a` Antenna 4H shaft.
Machine-checkable as: `bar_diameter == open_stud_bore == 8 LDU`.

**Rule 3.14b — Clip pivot positions.** `[P-LDRAW]`
`4085c` Plate 1×1 with Clip Vertical: `clip2` primitive at `(0, 4, −10)` — **clip axis at the footprint edge (z = −10), at mid-plate height (y = 4)**; the clip body reaches to z = −24, i.e. **14 LDU beyond the footprint edge**.
`2555` / `15712` Tile 1×1 with Clip: bbox Y[−10..8] — clip projects 10 LDU above the tile top.
Machine-checkable as: a bar held in `4085c` lies on the line `x = 0, y = 4, z = −10` rotated about the X axis; **the rotation is continuous (no detent)**, so it is the standard way to obtain an arbitrary angle legally.

**Rule 3.14c — Bar-in-clip is the ONLY legal source of a continuous, arbitrary angle.**
Everything else (hinges with clicks, angle connectors, slopes) is quantised. A bar-in-clip joint has essentially zero angular stiffness, so:
- it must not carry a moment (Rule 5.9);
- it must not be used to *set* a dimension — only to *absorb* one.
Machine-checkable as: any angle not in `{n × 22.5°} ∪ {exact Pythagorean angles} ∪ {part-native slope angles}` must be realised by a bar-in-clip or a free hinge, and that joint must be non-load-bearing.
`[DERIVED]` from 3.5, 3.9, 5.38.

**Rule 3.14d — Flex tolerance budget for "illegal-adjacent" techniques.**
The usable strain per joint is the free play: **0.2 mm = 0.5 LDU** (Rule 5.1). Over a chain of `n` joints the *random* budget is `0.5·√n` LDU; the *systematic* budget is `0.5·n` LDU only if every joint is deliberately biased the same way.
Practical thresholds `[DERIVED]`:
- ≤ 0.25 LDU per joint → invisible, no stress.
- 0.25–0.5 LDU per joint → visible gap, no permanent stress.
- \> 0.5 LDU per joint → elements are in bearing; permanent set / clutch loss (this is what LEGO's illegal-technique list is protecting against, Rule 5.43).
Machine-checkable as: `residual_LDU / joint_count <= 0.5`, and `residual_LDU <= 0.5 * sqrt(joint_count)` for an unbiased chain.

**Rule 3.15 — The classic knowingly-approximate angles.**
- `22.6199°` (5-12-13) used *as* 22.5° — residual 0.12°.
- `36.8699°` / `53.1301°` (3-4-5) used *as* 37° / 53°.
- `26.5651°` (atan ½) — the "two-in-one" angle; produced natively by `3298`/`4286` slopes and by `51739` wing plates, so it is over-supplied by the parts system.
- `18.4349°` (atan ⅓) — native to `43722a` wings.
- `14.0362°` (atan ¼) — native to `41769a` wings.
- `45°` — native to `3040b`, `2419`, and to any 1:1 hinged pair.
`[DERIVED]` + `[P-LDRAW]` for the part angles.

---

## 4. Circles, curves and radial builds

### 4A. Which polygons close exactly

**Rule 4.0 — ★ THE GOVERNING THEOREM: a rigid part rotated by θ maps the stud lattice ℤ² onto itself ONLY for θ ∈ {0°, 90°, 180°, 270°}. Therefore N = 4 is the only exactly-closing N-fold rosette of axis-aligned parts.**
`[DERIVED]` — crystallographic restriction on a *square* lattice. A general lattice permits N ∈ {1, 2, 3, 4, 6}, but N = 3 and N = 6 need `cos θ = ±½ ⇒ sin θ = ±√3/2`, which is irrational and therefore never lands on ℤ².
→ **N = 6, 8, 12, 16, 24, 32, 36, 48 NEVER close exactly.** Every published "circle table" for those values is an approximation, and every one of them must state its residual.
Machine-checkable as: for N ≠ 4, require an explicit residual budget; never assert exact closure.

**Rule 4.0a — Distinguish ANGULAR closure from LATTICE closure. They are different tests and both must pass.**
- *Angular closure* (Rule 4.1): the turns sum to 360° — `M · α ≡ 0 (mod 360°)`.
- *Lattice closure* (Rule 4.0, 4.2a): the arm tips land on stud positions.
A 16-gon of click hinges passes the first and fails the second. `[DERIVED]`

**Rule 4.2a — Exhaustive rosette search: best radius and residual for each N.**
`[DERIVED]`, scanning R = 1…60 studs; error = max over all N arms of the distance from `R·(cos θₖ, sin θₖ)` to the nearest lattice point. Arms anchored by **one** stud (position fixed, free to pivot):

| N | Best R (studs / LDU) | Max error (LDU) | Runners-up |
|---|---|---|---|
| **4** | any R | **0.00 — exact** | every radius |
| **8** | **41 / 820** | **0.24** ✔ | R=58 (0.34), R=17 (0.59) |
| **3, 6, 12** | **30 / 600** | **0.38** ✔ | R=52 (0.67), R=60 (0.77) |
| 5, 10, 20 | 58 / 1160 | 3.57 ✖ | never usable |
| 16 | 55 / 1100 | 3.85 ✖ | never usable |
| 24 | 58 / 1160 | 4.59 ✖ | — |
| 32 | 11 / 220 | 6.27 ✖ | hopeless |
| 36, 48, 60 | — | 7.8–9.3 ✖ | hopeless |

**Headline: an 8-fold rosette closes to 0.24 LDU at R = 41 studs** (41·cos45° = 28.9914 ≈ 29); **a 6- or 12-fold closes to 0.38 LDU at R = 30 studs** (30·cos60° = 15 exactly, 30·sin60° = 25.981 ≈ 26). Both sit inside the 0.5 LDU joint budget (Rule 3.14d).

**Rule 4.2b — Half-stud anchors (jumper plates, 10 LDU lattice) transform N = 6, 8, 12.** `[DERIVED]`

| N | Best R (studs) | Error (LDU) |
|---|---|---|
| **6, 12** | **56** | **0.05** ✔✔ (56·sin60° = 48.4974 ≈ 48.5) |
| 6, 12 | 41 / 15 / 26 / 30 | 0.14 / 0.19 / 0.33 / 0.38 |
| **8** | **29** | **0.17** ✔✔ (29/√2 = 20.506 ≈ 20.5) |
| 8 | 41 / 58 / 12 | 0.24 / 0.34 / 0.42 |
| 16 | 34 | 1.78 ✖ |
| 20, 24 | 29 / 60 | 1.79 / 2.08 ✖ |

**Rule 4.2c — For N ∉ {4}: anchor the 4 cardinal arms on-grid and let the remaining N−4 float on hinges.**
`[DERIVED]` from 4.0–4.2b. Arms anchored by **two** studs (position *and* orientation fixed) admit **only N = 4 at any radius** — the second stud fixes rotation and Rule 4.0 applies.

**Rule 4.2d — Gaussian-integer rosettes: exact arm directions exist, but never in the counts you want.**
The number of lattice directions on `x² + y² = R²` is **always ≡ 4 (mod 8)** → n ∈ {4, 12, 20, 28, 36, …} and **NEVER 8, 16, 24, 32, 40, 48**. `[DERIVED]`, exhaustive to R = 200.
Smallest R per n: n=4 → R=1; **n=12 → R=5 (100 LDU)**; n=20 → R=25 (500 LDU); n=28 → R=125; **n=36 → R=65 (1300 LDU)**.
**R = 65 studs is the densest small exact rosette — 36 exact arm directions**, first-quadrant angles 0, 14.2500 (63,16), 22.6199 (60,25), 30.5102 (56,33), 36.8699 (52,39), 53.1301, 59.4898, 67.3801, 75.7500, 90. ⚠ Spacing is **not uniform** (gaps 5.51°–8.37°) — this is an exact rosette, not a regular one.

**Rule 4.2e — Regular-polygon apothem / circumradius table.** `a = s / (2·tan(180°/N))`, `R = s / (2·sin(180°/N))`. `[DERIVED]`

| N | Central ° | Interior ° | a/s | R/s |
|---|---|---|---|---|
| 4 | 90.0000 | 90.0000 | 0.500000 | 0.707107 |
| 6 | 60.0000 | 120.0000 | 0.866025 | 1.000000 |
| 8 | 45.0000 | 135.0000 | 1.207107 | 1.306563 |
| 12 | 30.0000 | 150.0000 | 1.866025 | 1.931852 |
| 16 | 22.5000 | 157.5000 | 2.513670 | 2.562915 |
| 20 | 18.0000 | 162.0000 | 3.156876 | 3.196227 |
| 24 | 15.0000 | 165.0000 | 3.797877 | 3.830649 |
| 32 | 11.2500 | 168.7500 | 5.076585 | 5.101149 |
| 36 | 10.0000 | 170.0000 | 5.715026 | 5.736857 |
| 48 | 7.5000 | 172.5000 | 7.628526 | 7.644894 |

**Best (N, side) pairs by apothem-to-whole-stud residual** `[DERIVED]`, scanning s = 2, 4, 6, 8 studs:
**N=16 / s=2 → +0.547 LDU** · N=48 / s=8 → +0.564 · **N=8 / s=5 → +0.711** (a = 120.711 vs 120) · N=16 / s=4 → +1.094 · N=20 / s=6 → −1.175.
**Avoid**: N=36/s=2 (+8.60), N=8/s=2 (+8.28), N=24/s=2 (−8.08), N=48/s=4 (−9.72), N=6 and N=12 at s=4 (+9.28).

**Rule 4.2f — A 16-gon on click hinges is ALWAYS exactly +0.0547 studs (+1.094 LDU) too big per 20 LDU of side.**
`[DERIVED]`: apothem/side = 2.513670, not the "nice" 2.5. The slack must be absorbed by hinge play.

**Rule 4.2g — Chain error accumulates LINEARLY, not as √M.**
M segments each carrying angular error δ leave the last vertex off by ≈ **M(M−1)/2 · c · δ** (radians). So the per-joint cap is **δ_max ≈ 2ε / (M(M−1)·c)**. `[DERIVED]`
This is exactly why LEGO's own design guidance lists "reduces tolerance accumulation" as a reason to prefer one large element over five small ones (Rule 5.31).

**Rule 4.2h — Angular slack from a two-stud anchor: `θ_max = asin(ε / L)`.** `[DERIVED]`

| Lever arm L (studs) | ε = 0.25 LDU | ε = 0.5 LDU | ε = 1.0 LDU |
|---|---|---|---|
| 1 | 0.716° | 1.433° | 2.866° |
| 2 | 0.358° | 0.716° | 1.433° |
| 4 | 0.179° | 0.358° | 0.716° |
| 8 | 0.090° | 0.179° | 0.358° |
| 16 | 0.045° | 0.090° | 0.179° |
| 32 | 0.022° | 0.045° | 0.090° |

**Long sub-assemblies have almost no angular freedom** — at 16 studs a 0.5 LDU budget buys only 0.09°.

**Rule 4.1 — ANGULAR closure: an N-fold rosette's turns sum to 360° iff its per-segment angle is realisable by the joint you are using.**
⚠ **This is the weaker of the two tests. Passing it does NOT mean the arms land on the stud grid — see Rule 4.0/4.0a.**
`[DERIVED]`; `angle_per_segment = 360/N`.

| Joint / detent step | N values that close ANGULARLY |
|---|---|
| 90° (square SNOT, plain grid) | 4 — **also closes on the lattice** ✔ |
| 45° (`3040b` slope, 1:1 hinge) | 4, 8 |
| **22.5° (LEGO's click-hinge & Technic-connector quantum, Rules 3.11 / 5.38)** | **4, 8, 16** |
| 30° | 3, 4, 6, 12 |
| 15° (24-tooth turntable ring, Rule 4.7) | 3, 4, 6, 8, 12, 24 |
| 11.25° (`4450` half-step) | 4, 8, 16, 32 |
| 6.4285714° (56-tooth turntable ring, Rule 4.7) | 56 only |
| 2.5714286° (`24121` ×4 = 140-tooth ring, Rule 4.8a) | 140 and its divisors ≥ 3 |

**The practical answer for a click-hinge rosette is N ∈ {4, 8, 16}** — but **only N = 4 also passes the lattice test**. For N = 8 and 16, use the residuals in Rules 4.2a/4.2f and absorb them in joint play.
Machine-checkable as: `(360/N) mod detent_step == 0` **AND** the lattice test of Rule 4.2a.

**Rule 4.2 — Chord length for an N-gon of radius r: `c = 2r·sin(π/N)` LDU.**
`[DERIVED]`. For r = 100 LDU (5 studs): N=4 → 141.421; N=6 → 100.000 (regular hexagon: chord = radius, the only exactly-integer case); N=8 → 76.537; N=12 → 51.764; N=16 → 39.018; N=24 → 26.105.
**N = 6 is the only rosette where the chord equals the radius exactly**, so a hexagonal ring built of arms of length `L` studs has adjacent tips exactly `L` studs apart — the only rosette that is fully integer without a Pythagorean construction.

**Rule 4.3 — Stud-engagement predicate for a part placed on a circle.**
A part rotated by θ and translated to radius r engages the grid only if every one of its stud positions `p_i` satisfies `‖R(θ)p_i + t − nearest_grid_point‖ ≤ ε`, where the practical `ε` is the joint free play: **0.2 mm = 0.5 LDU total, i.e. ±0.25 LDU per stud** (Rule 5.1). LDraw coordinates do not contain this slack, so the check must be explicit.
Machine-checkable as: `max_i(dist(stud_i, grid)) <= 0.25` for a rigid connection; up to ~1 LDU is tolerated if the connection is a single stud that is free to rock, and only if it is not load-bearing.
`[DERIVED]` from `[SEC]` 0.1 mm/side undersize.

**Rule 4.4 — Exact-closure circles from Pythagorean triples.**
Because a 3-4-5 arm places its far end exactly on the grid at 36.8699°, a "circle" of triple-based arms closes exactly only when `k · 36.8699° = 360°` for integer k — which never happens (`360/36.8699 = 9.7642`). **No Pythagorean triple divides 360° exactly.**
`[DERIVED]`. Consequence: brick-built circles are either (a) detent-quantised (4.1), (b) built from natively round parts (4.5–4.7), or (c) closed by absorbing a residual.

### 4B. Native round-part geometry (all `[P-LDRAW]`)

**Rule 4.5 — Round-part diameters are exact stud multiples.**

| Part | Title | Diameter (LDU) | Radius (LDU) |
|---|---|---|---|
| `6141` | Plate 1×1 Round | 20 | 10 |
| `3062b` | Brick 1×1 Round | 20 | 10 |
| `4032a` | Plate 2×2 Round | 40 | 20 |
| `3941` | Brick 2×2 Round | 40 | 20 |
| `4150` | Tile 2×2 Round | 40 | 20 |
| `60474` | Plate 4×4 Round | 80 | 40 |
| `3679` | Turntable 2×2 Plate Top (rotating disc) | 35 | 17.5 |

Machine-checkable as: `round_part_radius == 10 × footprint_studs`.

**Rule 4.6 — ★ MACARONI LAW: a "Corner Round" N×N part is a quarter annulus of exactly 90.000°, with `R_outer = 20N` and `R_inner = 20(N−1)` LDU — wall thickness ALWAYS exactly 20 LDU — and its arc centre sits ON a stud-lattice point at one corner of its N×N footprint.** `[P-LDRAW]`

| Part(s) | Name | Footprint (LDU) | Height | R_inner | R_outer |
|---|---|---|---|---|---|
| `25269` | Tile 1×1 Corner Round | 20×20 | 8 | 0 | **20** |
| `3063a`/`3063b`/`85080` | Brick 2×2 Corner Round (macaroni) | 40×40 | 24 | **20** | **40** |
| `27925`/`7836` | Tile 2×2 Corner Round | 40×40 | 8 | 20 | 40 |
| `5152` | Brick 3×3 Corner Round | 60×60 | 24 | **40** | **60** |
| `79393` | Tile 3×3 Corner Round | 60×60 | 8 | 40 | 60 |
| `2577`/`48092`/`15588` | Brick 4×4 Corner Round | 80×80 | 24 | **60** | **80** |
| `27507`/`3477` | Tile 4×4 Corner Round | 80×80 | 8 | 60 | 80 |
| `58846` | Brick 10×10 Corner Round | 200×200 | 24 | 160 | 200 |

**Rule 4.6a — ★ THE ONLY EXACT NON-TRIVIAL CLOSED RING IN THE SYSTEM.**
Four N×N corner-round parts rotated 90° about their shared lattice arc-centre form a **complete annulus on a 2N×2N stud footprint, outer Ø = 40N LDU, inner Ø = 40(N−1) LDU, with every stud on the grid** — because 90° rotations preserve ℤ² (Rule 4.0). `[DERIVED]` from 4.6.
- 4 × `3063b` → ring on 4×4 studs, outer Ø 80, inner Ø 40 LDU, 8 studs all on-grid
- 4 × `2577` → ring on 8×8 studs, outer Ø 160, inner Ø 120 LDU
- 4 × `25269` → solid disc Ø 40 LDU on 2×2 studs

**This is the single most reliable circle primitive available to an agent.** Everything else is an approximation.
Machine-checkable as: `arc_centre == a stud-lattice point`; `N_parts × 90° == 360°` → exactly 4; all resulting studs satisfy `pos mod 20 == 0`.

`3063b` detail `[P-LDRAW]`: its two studs sit **31.62 LDU from the arc centre, 53.13° apart** — the 3-4-5 angle again. The outer face carries a **stud notch recessed to R = 37.6228 LDU (2.3772 LDU deep)** to clear an adjacent stud.

**Rule 4.7 — Turntable tooth counts and radii.** `[P-LDRAW]`, tooth counts recovered by measuring the angular pitch of the tooth profile.
- **Outer gear ring = 56 teeth → `360/56 = 6.4285714°` per tooth.** Verified on `2855` (Type 1 Top) and `48168` (Type 2 Top): profile at radius **68.4–74.0 LDU**, alternating steps of 1.61° (flank) + 4.82° (gap) = **6.43° pitch**; `360 / 6.4286 = 56.0`.
- **Inner ring = 24 teeth → `360/24 = 15.0000°` per tooth.** Verified on `48452` (Type 2 Base) and `2856` (Type 1 Bottom): profile at radius **32.9–33.0 LDU**, steps `5.62 + 1.88 + 5.62 + 1.88 = 15.00°`.
- `48452` Technic Turntable Type 2 Base: outer r = **68.5 LDU**, inner ring r = 36 LDU.
  → by the gear law (Rule 3.12) a 56T turntable meshes an 8T gear at `1.25(56+8) = 80 LDU = 4 studs`, and a 24T at `1.25(56+24) = 100 LDU = 5 studs` — both exact stud multiples. `[DERIVED]`
- `3680`/`3679` Turntable 2×2 Plate: **free-spinning, no teeth**. Base is a 2×2 plate (40 × 40 × 8 LDU); top disc r = 17.5 LDU with 4 studs at (±10, 0, ±10). Rotation axis = part origin.
- `61485` Turntable Flat Base 4×4, `3403`/`3404` Turntable 4×4: **no gear teeth — continuous free rotation.** ⚠ `61485` *does* carry **48 evenly spaced `2-4cylc` features at exactly 7.5° on radius ≈ 34.43 LDU** (base disc r = 33 LDU); these are **bearing ribs, not detents** — do not model them as click positions.

**Rule 4.7a — General gear/detent law: `degrees per tooth = 360/N`; pitch diameter = `2.5 N` LDU.** `[DERIVED]`
8T → 45.0000° (Ø 20 LDU = 1 stud); 12T → 30.0000°; 16T → 22.5000°; 20T → 18.0000°; 24T → 15.0000° (Ø 60 LDU = 3 studs); 28T → 12.857143°; 36T → 10.0000°; 40T → 9.0000°; **56T → 6.4285714°** (Ø 140 LDU = 7 studs); 60T → 6.0000°.
LEGO gears are module 0.5. Note **16T is the only common gear whose tooth pitch equals the 22.5° system quantum.**

**Rule 4.8 — Arch radii.** `[P-LDRAW]`
- `3659` Arch 1×4: arc radius **20 LDU**, centre at `(0, 28, ±6/±10)`.
- `6005` Arch 1×3×2 with Curved Top: outer radius **40 LDU**, centre at `(−10, 40, −10)` (again a corner point), with 20 LDU fillets.
- `6060` Arch 1×6×3.333: **quarter annulus, R_inner 60.000 / R_outer 80.000 LDU**, wall 20 LDU, 90° sweep; part 20 × 120 × 80 LDU.
- `3659` Arch 1×4 restated precisely: underside is a **true circle R = 20.000 LDU**, centre on the part centreline **4 LDU below the bottom face**, **135.0° sweep**, springing points 36.96 LDU apart, crown 16 LDU above base.
- `6091` Brick 2×1×1.333 Curved Top: quarter circle **R = 20.000 LDU**, centre at `(±10, 20, −10)`, 90° sweep.
- `1871` Brick 1×1×1.333 Round Quarter Dome: R = 20.000 LDU.

**Rule 4.8a — `24121` Technic Gear Ring Quarter 11×11 gives the FINEST discrete rotational joint in the system.**
`[P-LDRAW]`: 35 internal teeth, **20.000 LDU thick** (= one beam), radial extent 173.002 → 209.018 LDU, spans exactly 90.000°.
→ **Four of them close a 140-tooth internal ring: pitch Ø 350 LDU, outer Ø 418 LDU (20.9 studs), angular resolution `360/140 = 2.5714°`.** `[DERIVED]`
Machine-checkable as: rotations on this ring must be multiples of 2.5714286°.

**Rule 4.8b — Measured gear outer diameters (for collision, not meshing).** `[P-LDRAW]`

| Part | Teeth | Pitch Ø (LDU) | Measured outer Ø | Angular step |
|---|---|---|---|---|
| `3647` | 8 | 20 (1 stud) | 24.860 | 45.0000° |
| `4019` | 16 | 40 (2 studs) | 43.280 | **22.5000°** |
| `3648a`/`3648b` | 24 | **60 (3 studs)** | **64.780** | **15.0000°** |
| `3649` | 40 | 100 (5 studs) | 104.700 | 9.0000° |
| `18938`/`18939` | 60 | 150 (7.5 studs) | 153.496 | 6.0000° |

Mesh checks `[DERIVED]`: 8+24 → 40 LDU = 2 studs ✔ · 16+16 → 40 ✔ · 24+40 → 100 = 5 studs ✔.
**The 16-tooth gear's 22.5° step is the ONLY place the gear system and the click-hinge system share a resolution.**

**Rule 4.9 — ⚠ EVERY curved slope is an ELLIPTICAL arc. None of them is circular.** `[P-LDRAW]`

*Method note, because this is easy to get wrong.* `11477`'s only cylinder line is
`1 16 10 24.972 20  0 -20 0  -28.9719 0 -28.9719  -40 0 40  48\1-8cyli.dat`.
The two radial columns are `u = (0, −28.9719, −40)` and `v = (0, −28.9719, +40)`. **Both have norm 49.390 — but `u · v = −760.63 ≠ 0`, so they are not orthogonal** and the transform is a shear, not a scaled rotation. Equal column norms do **not** imply a circle. Solving `MᵀM = [[2439.37, −760.63], [−760.63, 2439.37]]` gives eigenvalues 3200.00 and 1678.74 → **semi-axes √3200 = 56.5685 (= 40√2) and √1678.74 = 40.9724**.

| Part | Title | Semi-axis horiz (Z) | Semi-axis vert (Y) | Arc centre | Run × rise |
|---|---|---|---|---|---|
| `11477` | Slope Curved 2×1 | **56.5685** (= 40√2) | **40.9725** | z = +20, 24.972 below base | 40 × 12 |
| `15068` | Slope Curved 2×2×0.667 | 56.5685 | 40.9725 | z = +20, 24.972 below | 40 × 12 |
| `88930` | Slope Curved 2×4 w/ understuds | 56.5685 | 40.9725 | same | 40 × 12 |
| `93273` | Slope Curved 4×1 Double | 56.5685 | 40.9725 (mirrored pair) | z = 0, 24.972 below | 80 × 12 |
| `50950` | Slope Curved 3×1 | **84.8536** (= 60√2) | **68.2828** (= 40 + 20√2) | z = +30, 68.283 below | 60 × 20 |
| `61678` | Slope Curved 4×1 | **160.0000** | **149.2530** | z = +40, 149.254 below | 80 × 20 |

**Exact facet polylines** `(z, height above base)` — what an agent actually emits and collides against:
- `11477`/`15068`: `(−20, 4.00) → (−1.65, 12.88) → (+20, 16.00)`; tangents 25.83°, 8.19°
- `93273`: `(−40, 4) → (−21.65, 12.88) → (0, 16) → (+21.65, 12.88) → (+40, 4)`
- `50950`: `(−30, 4.00) → (−2.47, 18.80) → (+30, 24.00)`; tangents 28.27°, 9.09°
- `61678`: `(−40, 4.00) → (−21.23, 12.64) → (−1.41, 18.91) → (+19.12, 22.72) → (+40, 24.00)`; tangents 24.72°, 17.55°, 10.50°, 3.52°

**Best-fit circles**, if an agent only needs "a radius": `11477`/`15068` → **R = 68.939 LDU**, max deviation 0.056, sweep 35.263°; `93273` → R = 72.858, dev 0.117, sweep 66.719°; `61678` → **R = 168.971 LDU**, dev 0.020, sweep 28.247°. `[DERIVED]`

**Rule 4.9a — Chains of curved slopes do NOT form a true arc.**
End-tangent differences are **35.263°** (`11477`) and **28.247°** (`61678`) — **neither is a click-hinge detent (22.5°) nor any grid angle**. Concatenating them on the 20 LDU grid yields a scalloped / ogee envelope with period = part length, not a circle.
Machine-checkable as: reject any "circular arc" assembly built from curved slopes. **Use hinge plates for the arc and curved slopes only as skin.**

**Rule 4.10 — Technic radial frames: reachable radii are exactly `20k` LDU from the hub hole.**
Hole pitch is 20 LDU (C13), so a beam spoke puts usable connection points only at integer multiples of 20 LDU from the hub. An N-spoke wheel of tip radius `r = 20k` has adjacent-tip chord `2·20k·sin(π/N)` — integer only for N = 6 (chord = 20k) or N = 4 with a Pythagorean rim. `[DERIVED]`
Machine-checkable as: `spoke_hole_radius mod 20 == 0`.

### 4C. Curved walls

**Rule 4.11 — Hinge-plate arc: per-segment turn is free, but the arc must be anchored at both ends on the grid.**
Using `2429`/`2430` (Rule 3.8) the pivot lies on a grid corner, so a chain of `n` hinge plates each turning θ has its far end at `Σ` of rotated 20-LDU steps. The chain returns to the grid only when the accumulated `(Δx, Δz)` are both multiples of 20 LDU — i.e. a Pythagorean closure (Rule 3.1). For a *free* arc (one end unanchored) any θ is legal.
Machine-checkable as: an arc with two anchored ends must satisfy the Pythagorean closure test; an arc with one free end need not.

**Rule 4.10a — ★ HINGED-ARC MASTER TABLE. `R = (c/2)/sin(θ/2)`, apothem `a = (c/2)/tan(θ/2)`, LDU.** `[DERIVED]`

| Chord c | θ=45° (n=8) | θ=30° (n=12) | θ=22.5° (n=16) | θ=15° (n=24) | θ=11.25° (n=32) |
|---|---|---|---|---|---|
| **20** | R 26.131 / a 24.142 | R 38.637 / a 37.321 | R 51.258 / a 50.273 | R 76.613 / a 75.958 | R 102.023 / a 101.532 |
| **40** | R 52.263 / a 48.284 | R 77.274 / a 74.641 | R 102.517 / a 100.547 | R 153.226 / a 151.915 | R 204.046 / a 203.063 |
| **60** | R 78.394 / a 72.426 | R 115.911 / a 111.962 | R 153.775 / a 150.820 | R 229.839 / a 227.873 | R 306.069 / a 304.595 |
| **80** | R 104.525 / a 96.569 | R 154.548 / a 149.282 | R 205.033 / a 201.094 | R 306.452 / a 303.830 | R 408.092 / a 406.127 |

**Rule 4.10b — The 1×4 hinge-plate ring: chord is FIXED at 40 LDU (2 studs).**
`[P-LDRAW]` `2429`/`2430`: base body X[−40, 0], top X[0, +40], studs at x = ±10 and ±30 → **pivot-to-pivot pitch = 40 LDU**, and **polygon vertices land on plate corners, not on studs**. `[DERIVED]` ring table:

| n plates | θ | R (LDU) | apothem (LDU) | across-flats (studs) |
|---|---|---|---|---|
| 8 | 45° | 52.263 | 48.284 | 4.83 |
| 12 | 30° | 77.274 | 74.641 | 7.46 |
| **16** | 22.5° | 102.517 | **100.547** | **10.05 ≈ 10** ✔ |
| 20 | 18° | 127.849 | 126.275 | 12.63 |
| 24 | 15° | 153.226 | 151.915 | 15.19 |
| **28** | 12.857° | 178.628 | **177.505** | **17.75** |
| **32** | 11.25° | 204.046 | **203.063** | **20.31 ≈ 20** ✔ |
| 48 | 7.5° | 305.796 | 305.141 | 30.51 |
| 72 | 5° | 458.512 | 458.075 | 45.81 |

**Rule 4.10c — ⚠ CORRECTION to the canonical published circle.**
The widely repeated recipe is "14 × Hinge Plate 1×4 = a 28-gon of 2-stud sides, 12.857° per joint, **inner Ø ≈ 18 studs**, grid-locked on all 4 cardinal sides". `[SEC]`
**The true apothem is 177.505 LDU → inner Ø = 17.7505 studs.** The published "18" therefore carries **−4.99 LDU (−2.00 mm) on diameter**, absorbed entirely by hinge play. `[DERIVED]`
Other whole-stud hinge rings that work: **14 studs** (11 plates — odd, so only 2 cardinal contacts) and **23 studs** (18 plates — odd, half-stud offset on one axis, needs jumpers). Rule: `n_plates = D_inner(studs) · π/4`. `[SEC]`

**Rule 4.10d — Click-hinge arcs that DO return to the stud grid.** `[DERIVED]`, chain walked from the origin along +X, endpoint snapped to the 20 LDU lattice, exhaustive to m = 16:

| Turn | Chord | m | Arc | Endpoint (LDU) | Lattice error |
|---|---|---|---|---|---|
| 22.5° | 20 | **4** | **90°** | (60.3, 40.3) → (60, 40) | **0.387 LDU** ✔ |
| 22.5° | 20 | 5 | 112.5° | (60.3, 60.3) → (60, 60) | 0.387 ✔ |
| 22.5° | 20 | **8** | **180°** | (20.0, 100.5) → (20, 100) | **0.547** ✔ |
| 22.5° | 20 | 12 | 270° | (−40.3, 60.3) | 0.387 ✔ |
| 22.5° | 40 | **4** | **90°** | (120.5, 80.5) → (120, 80) | **0.773** |
| 67.5° | 80 | 4 | 270° | (−19.9, 99.9) → (−20, 100) | 0.192 ✔✔ |
| 45° / 90° | any | 8 / 4 | 360° | (0, 0) | **0.000** |

**Everything else in a 22.5° chain misses the grid by > 1 LDU.** With a 40 LDU chord, **no** N-gon has all vertices on the grid except N = 4 (worst-vertex errors: N=6 → 5.36, N=8 → 7.74, N=16 → 10.62, N=24 → 11.80 LDU).
**The 4-segment 90° quarter-arc at 22.5°/20 LDU chord (error 0.387 LDU) is the workhorse curved-wall unit.**

**Rule 4.10e — Corbelled / stacked-plate curves.**
Canonical step is **half a stud (10 LDU) per plate layer (8 LDU)** — the Dresden Frauenkirche roof method. `[SEC]` https://www.holgermatthes.de/bricks/en/offset.php
Resulting slopes `[DERIVED]`: 10/8 → **51.34°**; full stud per plate 20/8 → **68.20°**; full stud per brick 20/24 → **39.81°**.
**Corbel-as-circle**: for a dome of radius R, the correct step at height h is `Δr = Δh · h/√(R²−h²)`. The half-stud-per-plate step is exact only where `h/√(R²−h²) = 1.25`, i.e. **h = 0.7809·R (≈51° up the dome)** — which is why real corbelled domes need a *varying* step. `[DERIVED]`

**Rule 4.10f — Sphere aspect correction: generate an ellipsoid at height:width = 5:6 in bricks (24:20), or 5:2 in plates (8:20).**
`[SEC]` Worked: 36 wide × 30 high in bricks; 20 wide × 50 high in plates.
Lowell Sphere (Bruce Lowell, 2002): **6.8 studs = 136 LDU diameter over a 4×4×4-stud SNOT core, 89 parts**; `Ø = core + 2 × panel thickness`. Bram Lambrecht's Sphere Generator emits LDraw at **0.2-stud (4 LDU) diameter increments**. `[SEC]` https://www.brucelowell.com/lowell-sphere/

**Rule 4.11a — SNIR (Studs Not In a Row): rotate 1×1 elements in place inside the grid cell.**
`[SEC]` ULABTG ch.6, with the geometry restated `[DERIVED]`:
- Stud pitch = 1L = **20 LDU**; **clear gap between adjacent studs = 0.4L = 8 LDU** (20 − 12, from C2 and C7).
- Diagonal of a 1×1 part = √2 L = **28.284 LDU**.
- **SNIR 45**: a 1×1 rotated 45° needs 28.284 LDU of cell, so it overhangs its own cell by 4.14 LDU per side — legal only because neighbours are also rotated.
- **The vertical closure identity**: a stack of *2 plates + 1 tile* = 3 × 8 = **24 LDU**, which equals *tile width (20 LDU) + stud height (4 LDU)*. That is why a 45°-rotated 1×1 column fits vertically with no residual. (Erik Amzallag's technique.)
- **SNIR 27** (Reinhard Beneke): a wall at "about 27°" to the grid, built with the jumper-plate half-stud offset. `[DERIVED]`: the jumper offset is 10 LDU per 20 LDU step → **atan(10/20) = 26.5651°** — the same atan(½) that appears in the `3298` slope and the `51739` wing (Rule 3.15). The three are the same angle.
Machine-checkable as: SNIR column height must satisfy `3 × plate == stud_pitch + stud_height` (24 == 24).

**Rule 4.11b — Mixed cylinder curving: interleave 1×1 round parts between straight 1×2–1×4 runs.**
`[SEC]` ULABTG ch.7 (Eric Brok). The 1×1 round part (`6141`/`3062b`, Ø 20 LDU = exactly the grid pitch, Rule 4.5) acts as a rotation-free hinge in the wall line, so straight segments can fan without the parts fouling. Very part-consuming.
Very-large-radius curves are also obtainable by **stressing a 1×2 wall within the moulding tolerance** — i.e. spending the 0.5 LDU/joint budget of Rule 3.14d. `[SEC]`

**Rule 4.12 — Stacked-plate curve: the maximum legal per-joint offset is one stud minus stud diameter.**
Two plates overlapped by one stud can be offset laterally by at most the clearance in the anti-stud, i.e. essentially 0 for a tube connection. The genuine sliding curve technique uses **1×2 tiles, which have no underside tube at all** (`[P-LDRAW]` `3069b` — no `stud3`/`stud4` reference) and therefore slide freely on studs at **any** offset. This is the mechanism behind continuous 5–10 LDU offsets in curved walls.
`[P-LDRAW]` + `[SEC]` ULABTG ch.2.

---

## 5. Structural and load rules

### 5A. What LDraw does NOT model — read this first

**Rule 5.1 — LDraw geometry is the nominal grid; the real part is undersize by 0.1 mm per side.**
A moulded 2×4 brick `3001` measures **31.8 × 15.8 × 9.6 mm** = 79.5 × 39.5 × 24 LDU, i.e. **0.25 LDU undersize per side**, giving **0.2 mm (0.5 LDU) of free play at every element-to-element joint**. LDraw authors parts at exactly 80 × 40 × 24 LDU.
→ **An LDraw collision check will pass connections that are physically illegal, and will report interference where none exists.** Run legality against the real dimension table, not against LDraw coordinates.
Machine-checkable as: maintain a per-joint clearance budget of 0.5 LDU that LDraw coordinates do not express.
`[SEC]` measured drawing: https://www.bartneck.de/wp-content/uploads/2019/04/lego-2x4-brick-dimensions-measurements-3001.pdf ; https://bricknerd.com/home/snot-basics-geometry-techniques-and-pitfalls-3-18-2021

**Rule 5.2 — Two systematic offsets that LDraw rounds away.**
Jamie Berard (LEGO Design Lab), *Stressing The Elements* `[P-LEGO]`:
- System side-stud centre = **3.92 mm** from the brick top; classic Technic hole centre = **3.80 mm** from the brick top → **0.12 mm (0.3 LDU) mismatch**.
- The moulded LEGO wordmark **adds 0.14 mm (0.35 LDU) to stud height** — a stud is 1.74 mm, not 1.60 mm.
LDraw renders both datums at exactly **y = 10 LDU (4.00 mm)** (`4070`, `87087`, `3701` — all `[P-LDRAW]`), so the mismatch is invisible in the model.
Machine-checkable as: flag any vertical chain that alternates System-side-stud and Technic-hole datums; hard-limit to one occurrence (see Rule 5.14).
Source: https://www.hellobricks.com/pdf/jamieberard-brickstress-bf06.pdf

**Rule 5.3 — Tube OD is not an integer LDU.**
Real tube OD **6.51 mm = 16.28 LDU**; ID 4.8 mm = 12 LDU; tube wall 0.855 mm = 2.14 LDU; brick wall 1.2 mm = 3 LDU. Never snap a tube-derived dimension to the LDU grid.
`[SEC]` measured drawing (as 5.1); `[DERIVED]`: 6.51 / 0.4 = 16.275.

### 5B. Clutch power — numbers

**Rule 5.4 — The stud/tube fit is nominally line-to-line, not an interference fit.**
`[DERIVED]`: tube axis sits at a 4-stud grid intersection; tube-axis→stud-axis = √(4² + 4²) = **5.6569 mm**. Contact needs `r_tube_out + r_stud = 5.6569` → `r_tube_out = 5.6569 − 2.4 = 3.2569` → **OD 6.5137 mm** vs measured 6.51 mm. **Nominal interference ≈ 0.004 mm.** Grip comes from tolerance bias, elastic flexure of the 0.855 mm tube wall, and the logo relief — not from designed interference.
LEGO's own account is qualitative only: studs "get neatly wedged in between the tubes and the sides of every brick" `[P-LEGO]` https://www.lego.com/en-us/history/articles/d-the-stud-and-tube-principle ; patent US 3,005,282 (filed 1958-07-28) claims clamping "between one secondary projection and the inner face of an end or side wall" and optional tube slits "to increase the clamping effect", with **no force figures** `[P-LEGO]` https://patents.google.com/patent/US3005282A/en

**Rule 5.5 — In modern bricks essentially 100 % of clutch is carried by tubes/bars, not side walls.**
`[DERIVED]`: stud axis → inner wall face = 3.9 − 1.2 = **2.7 mm** vs stud radius 2.4 mm → **0.3 mm clearance** (modern 1.2 mm walls). With the historic 1.5–1.6 mm walls: 3.9 − 1.6 = 2.3 mm → **0.1 mm interference**, as the 1958 patent describes.
Consequence: a 1×N brick's grip depends entirely on its internal bars (Ø 8 LDU, axis→stud-axis = 1.6 + 2.4 = 4.0 mm exactly — also line-to-line).
Machine-checkable as: treat 1×N bricks as lower-clutch than ≥2-wide bricks in any load model.

**Rule 5.6 — Engagement length is the stud height only (~1.7 mm = 4.25 LDU). Stacking more plates below adds ZERO grip.**
Clutch is a strictly per-stud quantity; only stud **count** increases it. `[DERIVED from 5.1/5.2]`

**Rule 5.7 — Per-stud capacities (hard-code these).**

| Mode | Per stud | Tier | Basis |
|---|---|---|---|
| Tension, ultimate, ≥2-wide brick | **3.9 N** | academic | StableLego (CMU, arXiv 2402.10711): 0.98 N per contact point × 4 contact points |
| Tension, ultimate, 1×N brick | **2.9 N** | academic | 0.98 N × 3 contact points |
| Tension, **working (use this)** | **1.0 N** | `[DERIVED]` | SF ≈ 4 |
| Shear | **≈ 205–245 N** | `[DERIVED]` | 4.8 mm × 1.7 mm = 8.16 mm² bearing × ABS shear yield 25–30 MPa |
| Compression | **≈ 1060 N** | measured | 2×2 brick crushed at **4240 N** ÷ 4 studs |

Compression : shear : tension ≈ **1060 : 210 : 3.9 ≈ 272 : 54 : 1**.
Compression cross-check `[DERIVED]`: 2×2 bearing area = (15.8² − 13.4²) + (π/4)(6.51² − 4.8²) = 70.1 + 15.2 = **85.3 mm²**; 4240 / 85.3 = **49.7 MPa** = ABS compressive yield. Physically sound. Failure mode was plastic flow, not fracture.
Sources: https://arxiv.org/pdf/2402.10711 `[SEC-academic]`; https://www.bbc.co.uk/news/magazine-20578627 (Open University load-cell test) `[SEC-institutional]`.
**The widely quoted "3–5 N to pull apart" has no traceable primary source** `[ANEC]` — it is numerically reconstructable as 4 × 0.98 N, which is probably why it survives.

**Rule 5.8 — Mass rule: `N_studs ≥ m[g] / 100` working; `N_studs ≥ m[g] / 400` ultimate.**
One stud holds **≈ 100 g working, ≈ 400 g ultimate** in tension. `[DERIVED]`: 3.9 N ÷ 9.81 = 398 g; ÷ 4 ≈ 100 g.
Machine-checkable as: for every hanging sub-assembly, `engaged_stud_count * 100 >= mass_g`.

**Rule 5.9 — Route every load into compression or in-plane shear; never into stud tension.**
This is the direct consequence of the 272 : 1 ratio in 5.7. In practice an assembly peels/rotates long before stud shear yields, so **tension at the peeling edge is always the governing failure**. `[DERIVED]`

### 5C. Cantilevers and stiffness

**Rule 5.10 — Point-load cantilever rule: `P·a ≤ F_w · b²/2`** with `a` = overhang in studs, `b` = anchorage overlap in studs, `F_w = 1.0 N/stud`.
Worked `[DERIVED]`: b = 4 → resisting moment = 1.0 × 16/2 = **8 N·stud = 0.064 N·m**. A 50 g accessory (0.49 N) may hang at `a ≤ 16 studs`. **Doubling `b` quadruples the allowable `a`.**
Self-weight alone is almost never the limit: `b ≥ a·√(w/F)` with w ≈ 0.002–0.010 N/stud → `b ≥ 0.05a`; a 40-stud cantilever needs only 2 studs of hold-down against its own weight. `[DERIVED]`

**Rule 5.11 — Stiffness, not strength, is the real cantilever limit: ≈ 1 mm of droop per stud of span at ~0.5 kg.**
Measured `[SEC]`, 48-stud (381 mm) cantilever, 2 studs × 5 plates section, 0.48 kg tip load:

| Construction | Tip deflection |
|---|---|
| 1×12 bricks + 2×8 plate caps | 50.8 mm |
| 1×N Technic bricks, **no pins** | **38.1 mm** (best) |
| 1×14 Technic bricks **with pins** | 44.5 mm |
| 2×8 plate lamination (5 plates) | 50.8 mm |
| bracket / multi-direction SNOT core | **57.2 mm** (worst) |

https://bricknerd.com/home/beam-me-up-flexing-with-lego-beams-2-19-25

**Rule 5.12 — Apply a compliance factor of 3 (range 2.2–4.8) to any Euler–Bernoulli deflection prediction.**
Measured/predicted ratios: 2.98 / 2.23 / 2.61 / 2.78 / **4.75** (bracket-SNOT core). Cause: every stud joint is a hinge — the section behaves as "a bunch of small beams with little hinges throughout". `[SEC]` same source.

**Rule 5.13 — Plate lamination is NOT stiffer than solid brick courses.**
5-plate lamination and a brick course both deflected 50.8 mm — identical. `[DERIVED from 5.11]`
→ Laminate plates for **seam staggering** and **tolerance re-datuming**, not for stiffness. The common claim "3 plates are stronger than 1 brick" is **disproven** by the only measurement available.

### 5D. Wall bonding

**Rule 5.14 — Never align vertical seams between courses; minimum overlap 2 studs, preferred = half the element length.**
An aligned seam is a plane with zero tensile and zero shear continuity. A `k`-stud lap transmits `k × 3.9 N` ultimate: 2-stud lap = **7.8 N**, 4-stud lap = **15.7 N** — linear in `k`. `[DERIVED]` + `[SEC]` https://brickbuildershandbook.com/basic-lego-techniques/
Machine-checkable as: for every pair of vertically adjacent courses, `min_overlap_studs >= 2` at every seam; assert no seam x-coordinate repeats in consecutive courses.

**Rule 5.15 — Insert a plate course to get a second, independent seam pattern inside the same 24 LDU of wall.**
A plate course is ⅓ of a brick course, so it can be staggered independently. Prefer a plate layer at least every 3 brick courses in any wall that will be lifted or transported. `[DERIVED]`

**Rule 5.16 — Tiles are NOT tension layers; they are deliberate slip planes.**
`3068`/`3069`/`3070` have no top studs → zero tensile and near-zero shear capacity across a tile course. **1×2 tiles have no underside tube at all** (`[P-LDRAW]`: `3069b` carries no `stud3`/`stud4`) and slide freely on studs at any offset — which is exactly how continuous 5–10 LDU horizontal offsets are built.
**Never place a tile course inside a load path. Plates, not tiles, are the splice layer.** `[DERIVED]` + `[SEC]` ULABTG ch.2.

**Rule 5.17 — Mosaic / thin-wall bonding (the closest thing to an industry standard).**
Build the panel **2 studs deep**: odd layers = 2-stud-deep plates; even layers = two rows of 1-stud-deep plates, a front row carrying the image and a **hidden back row of long plates strapping horizontally across the seams**. Without this, a mosaic is a field of vertically aligned joints. `[SEC]` https://bricknerd.com/home/everything-you-want-to-know-about-lego-mosaics-11-12-24

### 5E. Technic frames — the only instrumented dataset

Source for 5.18–5.23: Oton Ribic, "Efficient LEGO structures", *HispaBrick Magazine* 012 pp.45–46 `[SEC — instrumented]` https://www.hispabrickmagazine.com/pdfs/HBM012_EN/HBM012_EN-45-46.pdf

**Rule 5.18 — Studded beams are ~2× stiffer vertically than studless for 1.32× the mass.**
16L studded (4.1 g) vs 15L studless (3.1 g), 25 N at mid-span: vertical **0.8 mm vs 1.5 mm**; horizontal **1.5 mm vs 2.5 mm**. Use studded beams for main skeletons.

**Rule 5.19 — Lap-splice rule: lap ≥ 6L and fill the lap with pins.**
- 4L lap, 2 friction pins → **2.0 mm** (4× weaker than monolithic, and worse than plain studless).
- 8L lap, 4 friction pins → **0.7 mm** — *stiffer than the monolithic 16L beam (0.8 mm)*.
- 8L lap, only 2 pins → **1.5 mm**. **Pin density matters more than lap length alone.**
Machine-checkable as: `lap_length_studs >= 6` and `pins_in_lap >= lap_length/2`.

**Rule 5.20 — Frictionless pins cost ~15 % of joint stiffness** (+0.2 mm on a 0.7 mm baseline). Use `2780` (friction pin) / `6558` (3L friction) in structure; reserve `3673` (frictionless) for motion.

**Rule 5.21 — Triangulate: a 6-beam studless triangular frame is "several times stronger from above" than a 3-beam-plus-plate box frame at ~half the mass**, because almost any external force puts one or more beams into compression.

**Rule 5.22 — Geometry beats member size: "overall structural strength is affected much more by the beam connections than the beams' inherent strengths." All significant forces should act lengthwise along beams.**

**Rule 5.23 — Never let the principal load act parallel to a pin axis** — "horizontal force would easily disconnect the beams".

### 5F. Skeletons, skin, scale thresholds

**Rule 5.24 — Above 1 metre in any dimension, build a steel armature and treat the brick as cladding.**
Bright Bricks (LEGO Certified Professional): an interior steel structure stabilises **every model taller than one metre**; the skin is hollow, built around the steel, and **braced against the steel with 2-stud-wide bricks**; the steel path is routed from cross-sections of the digital model so it stays inside the brick volume. `[SEC — industry practice]` https://www.engineering.com/modeling-the-bones-for-massive-lego-sculptures/
Confirming data points:
- LEGO House "Tree of Creativity": >15 m, **6,316,611 bricks**, 23,500 h, **20 t including the metal frame**, "a large steel pipe that runs up the middle" `[P-LEGO]` https://legohouse.com/en-gb/press-releases/tree-of-creativity
- Full-scale X-wing (LEGO Model Shop, Kladno): **5,335,200 bricks**, ~20,900 kg, 13.4 m long, 13.1 m span, 17,336 h, on a **steel truss frame built to Carlsbad seismic code** `[SEC]` https://newsfeed.time.com/2013/05/23/the-46000-pound-x-wing-how-lego-built-the-worlds-biggest-star-wars-toy/
- Tallest brick structure: 35.05 m, ~550,000 bricks, LEGO Italia, Milan, 2015-06-21 `[P]` https://www.guinnessworldrecords.com/world-records/tallest-structure-built-with-interlocking-plastic-bricks

**Rule 5.25 — Skin/armature anchorage: `≥ 30 studs of tension anchorage per m² of 2-stud-deep plate skin` at working load.**
`[DERIVED]`: a 1 m × 1 m × 2-plate-deep skin ≈ 3.1 kg ≈ 30 N; at F_w = 1.0 N/stud → 30 studs (≥8 at ultimate). Order-of-magnitude only.

**Rule 5.26 — Permanent professional models are glued brick-by-brick, with PVA, for transport — not for standing load.**
Sean Kenney (LCP): large sculptures need **internal steel armatures custom-welded to fit precisely between the LEGO pieces**; everything glued "so they can withstand their own weight, as well as the rigors of shipping and public display"; an unglued prototype is built first and used as the template; up to **50,000 bricks / 9 months** per piece `[P — artist]` https://www.seankenney.com/commissions/
Nathan Sawaya glues each brick as he builds; corrections need hammer and chisel; his stated reason is shipping survival — "LEGO bricks snap together just fine on his sculptures" `[P — artist]`.
Adhesive: water-soluble white PVA (dissolves, peels off). **Never cyanoacrylate** — it permanently attacks the plastic. `[SEC]`

**Rule 5.27 — LEGOLAND Model Shop practice (quantified).**
Outdoor models get a UV clear coat; restoration is sandblasting with crushed walnut shells; "a model will last about **two to three sandblasts** before … the studs are fading and the edges are cornered." Indoor models "last forever." Miniland boats have **welding frames underneath them for support.** Miniland scale **1:20**; brick-built oversized elements at **18×**; smooth models at **25×**. Hard constraint: a model must fit through the Model Shop door or be designed in sections. `[SEC — interview]` https://brickarchitect.com/2025/interview-legoland-california-with-master-model-builder-pj-catalano/

### 5G. Tolerance, thermal, and chain length

**Rule 5.28 — LEGO's own tolerance figure is 1/200 mm = 0.005 mm = 0.0125 LDU.**
"material improvements permit a greater precision in molding, which is now done to an accuracy of **1/200 mm**" `[P-LEGO]` https://www.lego.com/en-us/history/articles/d-quality-in-every-detail
Competing figures, ranked: **0.005 mm** (LEGO's own — use this) > **0.01 mm / 10 µm** (quoted as actual mould precision, stud Ø 4.8 ± 0.01 mm) > **0.002 mm** (Forbes-origin, no LEGO primary behind it). Defect rate quoted at **18 out-of-tolerance parts per 1,000,000 (0.0018 %)** `[SEC/ANEC]`.

**Rule 5.29 — Random tolerance stack-up limit ≈ 100 elements per chained dimension.**
`[DERIVED]`: per-feature σ ≈ 0.01 mm; random accumulation over `n` parts = `0.01·√n`. Reaching **0.1 mm** (half the design gap, first visible misalignment) needs `n = 100`; reaching **0.2 mm** (gap fully consumed → binding) needs `n = 400`.
Machine-checkable as: any uninterrupted chain of >100 elements must be re-datumed — break it with a full-span element or a deliberately free joint.

**Rule 5.30 — SYSTEMATIC offsets accumulate linearly and blow the budget in 2 parts.**
`[DERIVED]`: the System/Technic 0.12 mm mismatch (5.2) → after n = 2, 0.24 mm > the 0.2 mm total gap. This is exactly why Berard's limit is one stud in one Technic hole (5.34). **Never repeat a known systematic offset more than once in a chain.**

**Rule 5.31 — LEGO's own part-count rule: "Can one brick replace the need for 5?"**
Stated benefits: reduces complexity, **adds strength and stability**, **reduces tolerance accumulation**. Always substitute the largest single element that fills a run. `[P-LEGO]` Berard.
Machine-checkable as: no run of `n ≥ 2` collinear identical-footprint parts where a single stock element of length `n` exists.

**Rule 5.32 — Thermal: use α = 9 × 10⁻⁵ /K (worst case 12 × 10⁻⁵ /K) for ABS.**
ΔL = α·L·ΔT → **1 m over 20 K = 1.8 mm; over 40 K = 3.6 mm.** `[DERIVED]`
An **unglued** wall self-accommodates: 0.2 mm free play per joint × 15.6 joints per metre of 1×8 bricks = **3.1 mm of slack** → ΔT up to ≈ **35 K per metre** before joints go into bearing. Longer elements halve that margin.
Against a steel armature (α_steel ≈ 1.2 × 10⁻⁵/K, Δα = 7.8 × 10⁻⁵/K): **1.56 mm per metre per 20 K** → anchor rigidly at intervals ≤ ~1 m for a 40 K swing, or use slotted anchors. For a **glued** skin (zero slack) provide `g = α·s·ΔT`: at s = 2 m, ΔT = 30 K → **5.4 mm ≈ 0.7 stud → round up to a full 1-stud (8 mm) gap every 2 m.** `[DERIVED]`
⚠ **No LEGO or LEGOLAND source describing expansion joints in brick models was found** — this rule is engineering inference, not documented practice.

### 5H. LEGO's own illegal-technique list (with the stress reason)

Primary source for 5.33–5.42: **Jamie Berard (LEGO Design Lab), "Stressing The Elements", BrickFest Aug 2006** `[P-LEGO]` https://www.hellobricks.com/pdf/jamieberard-brickstress-bf06.pdf

**Rule 5.33** — System and Technic are not 100 % compatible: 0.12 mm datum mismatch (see 5.2). Never chain the two datums in the same vertical run.
**Rule 5.34** — **One stud into one Technic hole is the absolute maximum.** "Technic holes are slightly smaller than those of System… any more than that and the resistance becomes too great." Legal only as single-point decoration; illegal when it carries structure or a second connection. Precedents where LEGO used it: 10222 (2011), 71040 (2016), 21311 (2018) `[SEC]`.
**Rule 5.35** — **Technic pins must be "in click."** Both ends of a Technic hole are larger than the middle; until it snaps, the half-peg is in compression and can be permanently damaged, and can pop out in play.
**Rule 5.36** — Never put a Technic peg into a bore smaller than the peg — permanent compression, no possibility of "click".
**Rule 5.37** — Never push an element into an unstopped bore — it can be pushed in too far, stressing the pin and inner walls.
**Rule 5.38** — **Click hinges must be in click; approved angles are multiples of 22.5°.** "Some LEGO projects require an engineer to determine whether an angle is legal."
Machine-checkable as: every click-hinge rotation ∈ `{n × 22.5°}`. *(This also resolves Rule 3.11: the click detent step is 22.5°, so a "7-position" hinge covers 6 × 22.5° = 135°.)*
**Rule 5.39** — Never connect a larger element into a smaller receiving element.
**Rule 5.40** — **Polycarbonate on polycarbonate must never slide.** PC-on-PC generates very high friction; fine for stud-on-stud, but a sliding or press fit between two trans elements cannot be pulled apart by a child. Most transparent elements are PC.
**Rule 5.41** — Anything that leaves an assembly "out of system" is discouraged even where technically legal (e.g. two plates ending at different heights).
**Rule 5.42** — "Technic half-beams and System plates are not friends."

**Rule 5.43 — Community-curated illegal list with part numbers** `[SEC]` https://bricknerd.com/home/illegal-snot-stressful-techniques-for-sideways-building-9-7-23
- **Plate wedged between studs** — clear span between adjacent studs = 8.0 − 4.8 = **3.2 mm = exactly one plate → zero clearance**; "the studs can't flex" → permanent splay and clutch loss. **A tile in the same position is legal** (≈ ½ plate thinner). `[DERIVED]` + `[SEC]`
- Clips (`4085a`/`4085b`) forced open or held closed — permanent set.
- Roller-skate `11253` — lip wider than a stud, outward stress.
- Log bricks `30136`/`30137` with an axle through — outward deformation of the ribs.
- Plate slid into the open side of a 1×N brick — outward stress on the walls.
- Unbraced SNOT relying on a single clip or pin — "unsupported studs and tubes can flex and crack."
- **`4070` headlight brick does not carry the 0.1 mm undersize** — it is full-size and will bind. Combining `4070` with `87087` via a 1×2 plate "causes stress on the elements."
- Lamp holder `4081b` carries a **quarter-plate (2 LDU) offset**.
- **P-LESs** (plate between studs) is dimensionally impossible in theory — studs are "a bit thicker than 4 LDU". Legal fixes: offset the plates so studs alternate, or use tiles (T-LESs). `[SEC]` ULABTG ch.1.

### 5I. Myths — do NOT encode

| Myth | Status |
|---|---|
| "3–5 N to pull apart a stud" | `[ANEC]` no traceable primary; reconstructable as 4 × 0.98 N |
| "0.002 mm manufacturing tolerance" | Forbes-origin; contradicted by LEGO's own 0.005 mm (5.28) |
| "The 5/2 support rule — 2 vertical connections per 5 modules of length" | Misreading of the **5 plates = 2 studs geometry identity** (I1). Has nothing to do with support spacing. Use 5.10–5.12. |
| "3 plates are stronger than 1 brick" | **Disproven** by the only measurement available (5.13) — identical deflection |
| "LEGO uses expansion joints in official models" | No primary or secondary evidence found. 5.32 is inference only. |
| "There is an official cantilever/overhang stud-count rule" | Does not exist; no LEGO or Certified Professional source. Use 5.10. |

---

## 6. Greebling, texture, mosaic

**Rule 6.1 — Surface-level ladder (studs-up). All levels are multiples of 4 LDU.** `[P-LDRAW]`

| Surface treatment | Top surface height above the plate datum |
|---|---|
| Tile (`3070b`) | **0 LDU** (flush with plate top) |
| Plate top face | 0 LDU |
| Plate stud tip (`3024`) | **−4 LDU** (4 LDU proud) |
| Plate + tile | −8 LDU |
| Plate + plate stud tip | −12 LDU |
| Brick top face | −24 LDU |

**Relief resolution on a studs-up surface is therefore 4 LDU (1.6 mm)** — half a plate — using the tile/plate/stud alternation. `[DERIVED]`

**Rule 6.2 — Depth budget for greebles on a SNOT panel.**
A SNOT panel one plate deep gives **8 LDU** of relief before the greeble breaks the back plane; one brick deep gives **24 LDU**. On a bracket-mounted panel (Rule 1.8) subtract the 4 LDU wall. On a headlight-mounted panel (Rule 1.6) you *gain* 4 LDU because the stud plane is recessed.
Machine-checkable as: `max_greeble_depth = panel_depth_LDU − mount_wall_LDU`; assert every greeble's bbox lies inside the panel volume.

**Rule 6.3 — Mosaic pixel geometry: three grids, three aspect ratios.** `[DERIVED from C2, C3, C4]`

| Orientation | Pixel size (LDU) | Aspect ratio | Correction |
|---|---|---|---|
| Studs-up, 1×1 plates/tiles | **20 × 20** | 1 : 1 | none needed |
| Studs-out, plates on edge ("plate-on-side") | **20 × 8** | **2.5 : 1** | use 5 plates per 2 studs to restore square (I1) |
| Bricks on side | **20 × 24** | 1 : 1.2 | 5 bricks = 6 studs restores square (Rule 2.2) |
| Studs-out, 1×1 tiles on a SNOT wall | **20 × 20** | 1 : 1 | none needed |

**Rule 6.3a — ⚠ TERMINOLOGY TRAP: the AFOL literature uses "studs-up" and "studs-out" INVERTED relative to ordinary usage.**
BrickNerd defines **"studs-out"** as the flat mosaic with studs facing the viewer (20 × 20 LDU pixel), and **"studs-up"** as the plate-on-edge column mosaic (20 × 8 LDU pixel). `[SEC]` https://bricknerd.com/home/everything-you-want-to-know-about-lego-mosaics-11-12-24
**An agent parsing AFOL prose must disambiguate by pixel geometry, never by the label.**

**Rule 6.3b — Mosaic resample multipliers.** `k = cell_H / cell_W`; to correct a square-pixel source, scale its height by `1/k`. `[DERIVED]`

| Grid | Cell W × H (LDU) | Aspect W:H | Resample source height × |
|---|---|---|---|
| Flat, studs facing viewer (1×1 tile/plate) | 20 × 20 | 1.0000 : 1 | 1.0000 |
| **Plates on edge / column mosaic** | **20 × 8** | **2.5000 : 1** | **2.5000** |
| **Bricks on edge / column mosaic** | **20 × 24** | **0.8333 : 1** | **0.8333** (5/6) |
| 2×2 bricks studs-up in a wall | 40 × 24 | 1.6667 : 1 | 1.6667 |
| 1×2 tiles on edge | 40 × 8 | 5.0000 : 1 | 5.0000 |

Published worked check `[SEC]` + `[DERIVED]`: for a plate-on-edge mosaic, resize the source to **128 px wide × 320 px tall** → 128 studs × 320 plates = **2560 × 2560 LDU, physically square** (320 × 8 = 2560; 128 × 20 = 2560). ✔

**Rule 6.4 — The two exact mosaic squaring identities.**
`5 plates = 2 studs` (40 = 40) and `5 bricks = 6 studs` (120 = 120). Any studs-out mosaic whose vertical pixel count is a multiple of 5 returns to the horizontal grid exactly. `[DERIVED]`
Machine-checkable as: `(rows × 8) mod 20 == 0` for plate-on-side; `(rows × 24) mod 20 == 0` for brick-on-side.

**Rule 6.5 — Mosaic panels must be 2 studs deep with a hidden strapping layer.**
Odd layers = 2-stud-deep plates; even layers = a front image row plus a **hidden back row of long plates strapping horizontally across the seams**. Without it a mosaic is a field of vertically aligned joints with zero cross-seam capacity (Rule 5.14, 5.17). `[SEC]` https://bricknerd.com/home/everything-you-want-to-know-about-lego-mosaics-11-12-24

**Rule 6.6 — Cheese-slope exact geometry — this corrects the commonly quoted figures.**
`[P-LDRAW]` `54200` Slope 31 1×1×⅔: footprint 20 × 20 LDU, **max height 15.600 LDU**. The largest sloped face has corners `(±10, h=4.000, z=−10)` and `(±10, h=13.600, z=+6)` → **rise 9.600 over run 16.000 = gradient exactly 0.600000 → 30.9638° from horizontal**.
⚠ **The front edge is 4.000 LDU — not 0 and not 3.6.** Extrapolating the slope plane over the full 20 LDU run gives a nominal rear of `4.0 + 0.6×20 = 16.000 LDU`; the modelled apex is flattened to **15.600**.
Same geometry for `50746`; `85984` is the 1×2 version (40 × 15.6 × 20).
It has **no anti-stud** — it sits on one stud and is free to rotate, so it must be captured on at least two sides or tiled over to hold an orientation.

**Rule 6.6a — Cheese-square: two cheese slopes tip-to-tip = 20.0 LDU nominal / 19.6 LDU as modelled.**
`4.0 + 16.0 = 20.0` exact square; the modelled pair is 0.4 LDU under. ⚠ **AFOLs measuring real plastic report ~20.8 LDU — slightly OVER square. The sign disagrees with LDraw.** `[DERIVED]` + `[SEC]`
For LDraw output use 20.0 nominal / 19.6 modelled; for real-world fit assume slight positive interference and **never chain more than ~4–5 cells without a rigid frame**.

**Rule 6.6b — ★ Twelve cheese slopes do NOT make a circle.**
The part is called "30°" but the true face angle is **30.9638°**, so `12 × 30.9638° = 371.5651°` — an **overshoot of 11.5651°**. An exact fit would need `360 / 30.9638 = 11.6265` pieces. `[DERIVED]`, confirmed empirically by builders ("putting 12 of the blunt ends together will create gaps"). `[SEC]` https://bricknerd.com/home/everything-you-want-to-know-about-cheese-slope-mosaics-11-29-22
Cheese slopes give **4 distinct orientations per 20 × 20 LDU cell**; such mosaics are held only by friction, gravity, or a brick-built frame (documented tension failures). Planning is done on hexagonal graph paper. No published herringbone/scale offsets exist — derive them: half-stud course offset 10 LDU, full-cell 20 LDU.

**Rule 6.6c — Relief added by one greeble mounted on a side stud** (measured outward from the host wall face; the 4 LDU stud is swallowed by the element's underside). `[DERIVED]` from `[P-LDRAW]` bboxes:

| Greeble | Relief |
|---|---|
| Tile `3070b` / round tile `98138` | **+8.0 LDU** |
| Plate `3024` / round plate `6141` | **+12.0 LDU** |
| Brick `3005` | **+28.0 LDU** |
| Cheese slope `54200` | **+4.0 LDU** at the thin edge → **+15.6** at the apex |

**Rule 6.6d — ★ NEGATIVE FINDING: no published greeble density figure exists anywhere in the AFOL literature.**
No percent-coverage figure, no greeble-size-to-model-size ratio, no light-bley/dark-bley/black ratio — confirmed across five BrickNerd tag indexes. **Any numeric density rule an agent uses must be invented and labelled as such.**
The qualitative guidance that does exist `[SEC]` https://bricknerd.com/home/achieving-greeble-greatness-3-18-24 : use greebling **sparingly**; **let the eye rest between patches**; **vary the distance between greebles** or the brain reads it as noise; use **two or more distinct greeble size classes** (large placed first, small infilling). Layering doctrine: **smooth armour panels outermost, industrial detail recessed beneath — the greeble plane sits BEHIND the hull plane, not proud of it.** Explicit anti-pattern: "quilt greebling" (checkerboards with orderly boundaries).
Scale reference: **SHIP minimum length = 100 studs = 2000 LDU.** `[SEC]`

**Rule 6.7 — 1×1 round plates (`6141`) and round tiles are rotationally unconstrained.**
Diameter 20 LDU = exactly the grid pitch, so they tile a studs-up field without gaps; they engage on one stud only and add no in-plane restraint. Use them for texture, never for structure. `[P-LDRAW]` + `[DERIVED]`

**Rule 6.4a — ⚠ The LEGO Art canvas is NOT a plate: `65803` is 320 × 320 × 32 LDU.**
`[P-LDRAW]` `65803` "Technic Brick 16 x 16 x 1.333": footprint **320 × 320 LDU (16 studs)**, body **exactly 32.000 LDU thick (4 plates)**, studs +4 → 36 LDU overall. Stud centres from −150 to +150 in 20 LDU steps.
**Do not model the Art canvas as an 8 LDU plate.** An Art-style stack is `32 + 8 = 40 LDU` (canvas + tile), or up to **56 LDU** at 4 relief levels.

**Rule 6.4b — LEGO Art grid dimensions and tile-to-cell ratios.** `[P]` Brickset inventories + `[DERIVED]`.
Standard single-portrait set = **9 canvases → 48 × 48 studs = 2,304 cells = 960 × 960 LDU = 38.4 cm**. Pixel part is the 1×1 round tile (LEGO design 35381 = LDraw `98138`).

| Set | Canvases | Grid (studs) | Cells | Colours | Tiles | Tiles ÷ cells |
|---|---|---|---|---|---|---|
| 31197 Warhol Marilyn | 9 | 48×48 | 2,304 | 7 | 3,154 | 1.369 |
| 31198 The Beatles | 9 | 48×48 | 2,304 | 15 | 2,746 | 1.192 |
| 31199 Iron Man | 9 | 48×48 | 2,304 | 15 | 2,974 | 1.291 |
| 31202 Mickey Mouse | 9 | 48×48 | 2,304 | 9 | 2,461 | **1.068** (min) |
| **31203 World Map** | **40** | **128×80** | **10,240** | 10 | 11,130 | 1.087 |
| 31205 Jim Lee Batman | 9 | 48×48 | 2,304 | 16 | 3,967 | 1.722 |
| 40179 Mosaic Portrait | baseplate | 48×48 | 2,304 | 5 | 4,500 | **1.953** (max) |

World Map check `[DERIVED]`: 8 × 5 canvases = 2560 × 1600 LDU = **102.4 × 64.0 cm**, matching LEGO's "over 40 in × 25 in". ✔
⚠ **`31213` Mona Lisa is NOT a pixel grid** — six plain 16×16 plates (design 91405) plus variable-size tiles and angled wedges.
Colours per Art set range **5–16, median 12**. `40179` is the cleanest published greyscale ramp: **5 colours × exactly 900 tiles = 4,500**. The practical modern achromatic ramp is 4 steps: White / Light Bluish Gray / Dark Bluish Gray / Black.

**Rule 6.4c — Dither-cell law: an n×n dither cell over a k-colour palette yields `n²(k−1) + 1` apparent levels at 1/n the spatial resolution.** `[DERIVED]`
Worked: 2×2 studs (40 × 40 LDU) of black/white → 5 apparent greys.
Published pipeline choices `[P — tool source]` https://github.com/debkbanerji/lego-art-remix: dithering **Floyd-Steinberg, Jarvis-Judice-Ninke, Atkinson, Sierra**, plus "2 Phase" (default); colour distance **Euclidean RGB or CIEDE2000 Lab**; downsampling average / min / max / dual min-max pooling — **min/max pooling preserves 1-stud-wide features that average pooling erases** (critical for line art and greebles).
Relief mode exposes `num-depth-levels`, **min 2, max 4, default 3**, each level one plate → default relief **16 LDU**, max **24 LDU = exactly 1 brick**.

**Rule 6.4d — ★ 1×1 round packing: 78.540% coverage, 21.460% substrate shows.**
`[DERIVED]`: a 20 LDU-Ø round part in a 20 LDU cell covers `π·10² = 314.159` of `400 LDU² = 78.540%`. **Composite the canvas colour at ~21.5% when previewing a round-tile mosaic.**
Orthogonal neighbours are **exactly tangent (gap 0.000 LDU)**; diagonal neighbours are `20√2 = 28.2843` apart → **gap 8.2843 LDU**.

**Rule 6.4e — ⚠ True hexagonal close packing is IMPOSSIBLE on the LEGO grid.**
`[DERIVED]`: hex packing needs a row pitch of `20·(√3/2) = 17.3205 LDU = 2.165 plates` — not on any LEGO grid.
- Row pitch 16 LDU (2 plates) + 10 LDU offset → centre distance `√(10² + 16²) = 18.8680 < 20` → **circles overlap by 1.1320 LDU: geometrically illegal.**
- Row pitch 20 LDU + 10 LDU jumper offset → `22.3607`, gap 2.3607 LDU: **the only clean running-bond packing.**
Density ceiling: hexagonal 90.690% vs square-grid 78.540%.
Machine-checkable as: two 20 LDU-Ø round parts may **never** have centres closer than 20.000 LDU.

**Rule 6.6a — Micro-striping: sub-plate stripe widths and the thin-part table.**
`[SEC]` ULABTG ch.5 (Steve Barile 2002 / James Mathis). Stripes narrower than one plate (8 LDU) require thin parts:

| Thin-part class | Thickness |
|---|---|
| Flags, brackets, fences (most), panels, baseplates | **4 LDU** |
| **Brick hinge tops** | **2 LDU** (the thinnest) |
| Fences | **6 LDU** |

Known build residuals:
- Top-hinge-brick micro-striping: **lowest stripe is 22 LDU, not 24** ⚠.
- SNOT-mounted `2436b` (1×2−1×4) bracket micro-striping: lower stripe **20 LDU**, small front offset, **length must be a multiple of 4L (80 LDU)**.
- SNOT-mounted 1×2−2×2 bracket micro-striping: lower stripe can be as low as **8 LDU**; total height carries a **4 LDU offset**; length must be a multiple of 2L (40 LDU).
Machine-checkable as: for each micro-striping variant, assert the stated length modulus and record the stated residual as a known offset rather than an error.

**Rule 6.6b — Diagonal striping with slopes: use a one-plate (8 LDU) offset; residual gaps are 1.2–3.6 LDU.**
`[SEC]` ULABTG ch.4. Normal and inverted slopes cannot be placed side by side directly (they overlap). Offsetting by **8 LDU** gives gaps varying **3.6 → 1.2 LDU** — "reasonably good". With a **half-stud (10 LDU) offset** instead: 1×2×1 slopes → larger gap; 1×3×1 slopes → gap "negligible"; 1×2×3 slopes → gap large enough to take a **1×4 tile** (a floating tile, or back-anchored with two 2×2 tiles).
Machine-checkable as: adjacent normal/inverted slope pairs must differ in Y by 8 LDU (or in-plane by 10 LDU); flag any direct side-by-side placement as an overlap.

**Rule 6.7a — Brick-built lettering: font heights are quantised by orientation.** `[SEC]` ULABTG ch.3.

| Technique | Cap height | Stroke widths |
|---|---|---|
| Stud-out mosaic | **100 LDU** | bars 20 LDU |
| Stud-out mosaic | 80 LDU | — |
| Stud-out mosaic (lower case / marginal) | 60 LDU | — |
| **Stud-up (plates/bricks stacked normally)** | **40 LDU** | horizontal bars 8 LDU, vertical 20 LDU (letters look bold/wide) |
| SNOTized | 80 LDU | horizontal 20 LDU, vertical 8 LDU |
| **Mathis letters (improved SNOTized)** | **56 LDU** | both bars 8 LDU |

Machine-checkable as: lettering bounding boxes must match one of these heights exactly; below 60 LDU only the stud-up (40) and Mathis (56) methods exist.

**Rule 6.8 — Greebling must not consume the tolerance budget.**
Every greeble that is held by a single stud is a joint with 0.5 LDU of free play (Rule 5.1) and 3.9 N ultimate tension (Rule 5.7). A greeble field is therefore a **cladding**, and its accumulated mass must be carried by the panel's own anchorage, not by the greeble studs (Rule 5.8: `N_studs ≥ m[g]/100`).

---

## 7. GAPS and open questions

| ID | Gap | Status |
|---|---|---|
| **G1** | **LDraw models the Technic beam/liftarm cross-section as 18 × 20 LDU (7.2 × 8.0 mm)**, internally consistent (`axlebeam.dat` !HELP: "cylinder of 9 ldu radious"; `41677` half-beam = 10 LDU). A measured source gives beam thickness **7.4 mm (18.5 LDU)** with 0.1 mm clearance (cailliau.org); other secondary sources say 7.8 mm. LDraw's 18 LDU is within 0.5 LDU of the measured value — safe for layout, **not** safe for tight clearance checks. | **Narrowed, not closed** |
| **G2** | `3747b` (Slope 33 3×2 Inverted) measures **27.6992°**, not the 26.5651° of the non-inverted `3298`. Cause not established — likely a different rise/run in the mould rather than an LDraw error. | Measured, unexplained |
| ~~**G3**~~ | ~~Click-hinge detent step.~~ **CLOSED.** Tooth-crest cylinders in `p/clh4.dat` sit at radius 5.810 LDU at 90 / 112.5046 / 134.9930 / 157.4954 / 180 / 202.5046 / 224.9930 / 247.4954 / 270° — **9 detents at exactly 22.5°**, with valleys at the 11.25° midpoints. Independently matches Berard's LEGO-internal slide. See Rule 3.11. | **Resolved — geometry + LEGO source agree** |
| **G4** | `3956` (Bracket 2×2−2×2 Up) shows **no top studs** in the LDraw file — its horizontal 2×2 is modelled with a closed top and a single `stud4h` tube underneath. Verify against the physical part before relying on the top face. | **Unresolved** |
| **G5** | No first-party LEGO figure for clutch force in newtons exists. The best available is an academic per-contact figure (0.98 N × 4 = 3.9 N/stud). LEGO's `86191`/`86188`/`15137` "test implement" elements prove LEGO measures it internally but no published value was found. | Documented absence |
| **G6** | No LEGO or LEGOLAND source describing **expansion joints** in brick models. Rule 5.32's numbers are engineering inference. | Documented absence |
| **G7** | No official cantilever / overhang stud-count rule exists from LEGO or any Certified Professional. Rules 5.10–5.12 are derived + one single-builder measurement set. | Documented absence |
| **G8** | The real-world offsets in Rule 5.2 (0.12 mm System/Technic, 0.14 mm logo) and the 0.1 mm/side undersize are **absent from LDraw geometry entirely**. Any agent that validates only against LDraw coordinates will emit physically illegal models. | Structural limitation of the format |
| **G9** | Quarter-stud (5 LDU) offsets: `4081b` lamp holder is reported `[SEC]` to carry a 2 LDU (quarter-plate) offset, and a 1×4×2 fence an unexpected −7 LDU offset. Neither verified against LDraw here. | Unverified |
| ~~**G10**~~ | ~~Ball-joint sweep limits.~~ **CLOSED for the Joint-8 family**: `p/joint8socket1.dat` !HELP publishes **±35° in-plane, ±5° out-of-plane** with the extreme matrices. See Rule 3.13a. *Still open:* the CCBS/Constraction socket (`32174`) cone angle, and the towball (`2736`/`6628`) sweep. | **Mostly resolved** |
| ~~**G11**~~ | ~~Turntable tooth counts.~~ **CLOSED by geometry**: outer ring **56 teeth (6.4285714°/tooth)** measured on `2855`/`48168` at r = 68.4–74.0 LDU; inner ring **24 teeth (15.0000°/tooth)** on `48452`/`2856` at r ≈ 33 LDU. Correction issued: `61485`'s 48 features at 7.5° are **bearing ribs, not detents**. See Rule 4.7. | **Resolved** |
| ~~**G12**~~ | ~~Circles/rosette secondary sweep incomplete.~~ **CLOSED** — the circles stream completed and independently re-measured the LDraw library. Its findings forced one correction to this document (Rule 4.9, curved slopes) and are folded in throughout §4 and §6. | **Resolved** |
| **G15** | ⚠ **Two leads in the brief are dead ends.** The commonly cited "**ULABTG circle table**" **does not exist** — ULABTG's 7 chapters contain no circle, rosette, or Pythagorean table; its only round-shape content is the one-page "mixed cylinder curving". Likewise "**Holly Webb**" and "**Yoshiya Nakamura**" LEGO-geometry write-ups return nothing in any indexed form. Treat all three as bad leads; do not spend further budget on them. | **Negative result — confirmed** |
| **G16** | **No published greeble-density figure exists** (percent coverage, greeble-to-model size ratio, colour ratios) — confirmed across five BrickNerd tag indexes. Any density rule must be invented and labelled as such. See Rule 6.6d. | **Documented absence** |
| **G17** | **Plate-overhang / corbel stability limit** and **flex-tube minimum bend radius** — no published numbers found. ⚠ LDraw represents hoses as unconstrained synthesised splines, so an agent can emit physically impossible curves with no geometric warning. | **Documented absence** |
| **G18** | ⚠ **Cheese-square sign conflict**: LDraw models a tip-to-tip pair at 19.6 LDU (0.4 **under** square); builders measuring real plastic report ~20.8 LDU (**over** square). The sign disagrees, so neither value is safe for long runs. See Rule 6.6a. | **Unresolved conflict** |
| **G19** | Sariel / Isogawa Technic large-circle recipes and the Technic panel catalogue for drums and rings were not reached before the search budget ran out. `brick.camp/en/tech/offset-ldu-steps` indexes offsets 1–10 LDU with per-step part lists but is JS-rendered; it has a public GitHub repo and is the best target for a follow-up scrape. | Not researched |
| **G13** | Longer-tail wedge/wing part numbers in Rule 3.7a (`54383`, `3544`, `3545`, `30382`, `47397`, `22391`, `30036`, `3933`) are **named-only**, assigned by cut ratio from a secondary source rather than measured. The four in Rule 3.7 (`43722a`, `41769a`, `51739`, `2419`) and `24307`/`43708` are geometry-verified. | Named, not measured |
| **G14** | Slope-family angles for `60481a` (65°), `3684a`/`4460a` (75°) were measured from LDraw face normals here and cross-checked against Sariel's chart via the angle stream (which lists them at 65°/73°). `3747b`'s 27.6992° (G2) remains the one unexplained outlier. | Cross-checked |

---

## 8. One-page predicate summary for a solver

```
GRID          stud=20  plate=8  brick=24  tile=8  studh=4  studØ=12
IDENTITIES    5*plate == 2*stud (40)      3*plate == 1*brick (24)
              5*brick == 6*stud (120)     tile_height == plate_height
SNOT_CLOSE    (n_plate*8 + n_brick*24) mod 20 == 0
STUD_AXIS     M·(0,-1,0) ∈ {±X, ±Y, ±Z}
JUMPER        3794a/15573: offset (10,0);  87580: offset (10,10)
HEADLIGHT     4070: snot_plane = face - 4 ; stud_axis_y = 10 ; rear pocket 12w × 4deep
SIDE_STUD     87087/47905: snot_plane = face ; stud_axis_y = 10
BRACKET_1x2   wall = 4 LDU outboard ; snot_plane = footprint_edge - 4
              child face offset from parent edge == 12 LDU  (NOT grid-commensurate)
BRACKET_2x2   3956: wall = 8 LDU outboard
ANGLE_EXACT   tan(θ) rational AND hypotenuse integer studs  (Pythagorean)
              3-4-5 = 36.8699/53.1301 ; 5-12-13 = 22.6199/67.3801 ; 20-21-29 = 43.6028
SLOPES        "45" = 45.0000 ; "33" = 26.5651 ; "65" = 65.5561 ; "75" = 73.6104 ; cheese = 30.9638
WEDGE_PLAN    2x3 wing = 18.4349 ; 2x4 wing = 14.0362 ; 51739 = 26.5651 ; 2419 = 45.0000
EXACT_ROT     3-4-5 → cos/sin = 0.8/0.6 (exact) ; 7-24-25 → 0.96/0.28 (exact)
              never write cos(36.87°) — emit the rational
TECHNIC       hole pitch 20 ; hole axis 10 below top
              1x4/1x6 bricks: holes at 20k (offset 10 from studs)
              1x2 brick 32000: holes at ±10 = UNDER the studs  ← exception
              beam N: hole span 20(N-1), length 20N-2, section 18x20 ; "x0.5" = 10 thick
              odd N: hole at z=0 ; even N: z=±10 ; 41677 NOT centred
              studded(24) vs studless(20) realign only every 120 LDU
              half-beam(10) vs plate(8) realign only every 40 LDU
              gear centre dist = 1.25(T1+T2) ; deg/tooth = 360/N
              angle connectors 32013/32034/32016/32192/32015/32014/4450
                = 0/180/157.5/135/112.5/90/168.75 ; all axes concurrent, no offset
              moulded bend set: 0, 11.25, 22.5, 45, 53.130102, 60, 90, 120, 135, 157.5, 168.75, 180
              bent-liftarm holes = corner + k*(16,12)  [53.13° family]
HINGE         click rotations ∈ n*22.5° (9 crests on clh4; clh10 omits 67.5 & 112.5)
              2429/2430 pivot vertical on grid CORNER, y=4 ; 3937/6134 pivot Rx at y=10
              clh on brick side: 10 below top, 6 off face ; on plate side: 2 below top, 6 off
              ball Joint-8: ±35° IN-PLANE, ±5° OUT-OF-PLANE (anisotropic!)
              turntable rings: 56T outer (6.4286°), 24T inner (15°)
              61485 = FREE (its 48 features @7.5° are bearing ribs, not detents)
WEDGE_ID      2*atan(1/m) = triple (m²-1, 2m, m²+1)
              atan(1/2) + atan(1/3) = 45.0000000° exactly
CIRCLES       THEOREM: only θ ∈ {0,90,180,270} maps ℤ² to ℤ² ⇒ N=4 is the ONLY exact rosette
              angular closure ≠ lattice closure — test both
              best approx rosettes: N=8 @ R=41 studs (0.24 LDU) ; N=6/12 @ R=30 (0.38)
              with jumpers: N=6/12 @ R=56 (0.05) ; N=8 @ R=29 (0.17)
              Gaussian-integer arm counts ≡ 4 (mod 8) → never 8,16,24,32,48
              MACARONI LAW: corner-round NxN → R_out=20N, R_in=20(N-1), wall always 20
                4 of them = the ONLY exact closed ring in the System
              hinge-plate ring: chord FIXED 40 LDU ; 28-gon apothem 177.505 (not 18 studs)
              22.5° x4 @ chord 20 → (60,40), error 0.387 LDU ← workhorse quarter-arc
              ALL curved slopes are ELLIPTICAL (11477 semi-axes 56.5685 x 40.9725)
                equal matrix column norms do NOT imply a circle — check orthogonality
              gear ring 24121 x4 = 140 teeth = 2.5714°/tooth, finest rotary joint
MOSAIC        AFOL "studs-up"/"studs-out" are INVERTED — disambiguate by pixel geometry
              Art canvas 65803 = 320x320x32 LDU (4 plates), NOT a plate
              1x1 round covers 78.54% of its cell ; hex packing impossible on the grid
              two 20-LDU-Ø rounds may never be closer than 20.000 LDU
              12 cheese slopes ≠ circle (12 x 30.9638 = 371.57°, over by 11.57°)
NEAR_MISS     prefer LATTICE VECTORS over triples:
              22.5°→13 studs (12,5) res 0.54 ; 30°→30 studs (26,15) res 0.38
              45°→17 studs (12,12) res 0.59 ; 15° has NO good triple
              isosceles ~90°: (12,12,17) res 0.59 ← workhorse ; (2,2,3) unbuildable
              forced bow: 1 LDU shortening on a 1x8 → 7.7 LDU sagitta. Never force.
LOADS         tension/stud: 1.0 N working, 3.9 N ultimate (2.9 N for 1xN)
              shear/stud ≈ 210 N ; compression/stud ≈ 1060 N
              N_studs >= mass_g / 100
              cantilever: P*a <= 1.0 * b^2 / 2   (a, b in studs)
              deflection = 3 × Euler-Bernoulli
BONDING       min seam overlap 2 studs ; no repeated seam x between adjacent courses
              tiles are slip planes — never in a load path
TOLERANCE     0.2 mm (0.5 LDU) free play per joint — NOT in LDraw coords
              max chain 100 elements before re-datum
              never repeat a systematic offset (System/Technic 0.12 mm) more than once
SCALE         any dimension > 1 m ⇒ steel armature, brick becomes cladding
ILLEGAL       ≤1 stud per Technic hole ; pins must click ; no plate wedged between studs
              no PC-on-PC sliding ; no larger element into smaller receiver
```


---

## 9. Sources

**Primary — LDraw**
- LDraw Parts Library, official release (complete.zip): https://library.ldraw.org/library/updates/complete.zip — individual parts at `https://library.ldraw.org/library/official/parts/<num>.dat`, primitives at `.../p/<name>.dat`
- LDraw file-format specification (LDU definition): https://www.ldraw.org/article/218.html
- Primitive `!HELP` metadata used for hinge/stud placement rules: `p/clh2.dat`, `p/clh4.dat`, `p/clh6.dat`, `p/clh6d.dat`, `p/clh7.dat`, `p/clh8.dat`, `p/clh9.dat`, `p/clh10.dat`, `p/clh11.dat`, `p/clh13.dat`, `p/axlebeam.dat`, `p/axlesphe.dat`, `p/4-4cyl19sph40.dat`, `p/joint8socket1.dat` (ball-joint sweep limits), `p/joint8ball.dat`, `p/peghole.dat`, `p/connhole.dat`

**Primary — LEGO**
- Jamie Berard (LEGO Design Lab), *Stressing The Elements*, BrickFest Aug 2006: https://www.hellobricks.com/pdf/jamieberard-brickstress-bf06.pdf
- LEGO — "Quality in every detail" (the 1/200 mm figure): https://www.lego.com/en-us/history/articles/d-quality-in-every-detail
- LEGO — "The stud-and-tube principle": https://www.lego.com/en-us/history/articles/d-the-stud-and-tube-principle
- LEGO — "How do LEGO bricks work?": https://www.lego.com/en-us/service/help-topics/article/how-do-lego-bricks-work
- Patent US 3,005,282 (Godtfred Kirk Christiansen, filed 1958-07-28): https://patents.google.com/patent/US3005282A/en
- LEGO House — Tree of Creativity: https://legohouse.com/en-gb/press-releases/tree-of-creativity
- Guinness World Records — tallest brick structure: https://www.guinnessworldrecords.com/world-records/tallest-structure-built-with-interlocking-plastic-bricks
- Sean Kenney (LEGO Certified Professional), commissions/armature practice: https://www.seankenney.com/commissions/

**Secondary — shows its working**
- Didier Enjary, *Unofficial LEGO Advanced Building Techniques Guide* (ULABTG): https://joncraton.org/media/files/UnofficialLEGOAdvancedBuildingTechniquesGuide.pdf
- Christoph Bartneck, measured 2×4 brick (3001) engineering drawing: https://www.bartneck.de/wp-content/uploads/2019/04/lego-2x4-brick-dimensions-measurements-3001.pdf
- BrickNerd — SNOT basics: geometry, techniques and pitfalls: https://bricknerd.com/home/snot-basics-geometry-techniques-and-pitfalls-3-18-2021
- BrickNerd — Illegal SNOT: stressful techniques for sideways building: https://bricknerd.com/home/illegal-snot-stressful-techniques-for-sideways-building-9-7-23
- BrickNerd — Beam me up: flexing with LEGO beams (cantilever deflection dataset): https://bricknerd.com/home/beam-me-up-flexing-with-lego-beams-2-19-25
- BrickNerd — Everything you want to know about LEGO mosaics: https://bricknerd.com/home/everything-you-want-to-know-about-lego-mosaics-11-12-24
- Oton Ribic, "Efficient LEGO structures", *HispaBrick Magazine* 012 pp.45–46: https://www.hispabrickmagazine.com/pdfs/HBM012_EN/HBM012_EN-45-46.pdf
- StableLego (CMU), arXiv 2402.10711 — per-contact friction capacity: https://arxiv.org/pdf/2402.10711
- Open University brick crush test, via BBC: https://www.bbc.co.uk/news/magazine-20578627
- Brick Architect — LEGO clutch test implements: https://brickarchitect.com/2021/lego-clutch-test-implements-bricks/
- Brick Architect — interview, LEGOLAND California Master Model Builder: https://brickarchitect.com/2025/interview-legoland-california-with-master-model-builder-pj-catalano/
- Engineering.com — modelling the bones for massive LEGO sculptures (Bright Bricks steel armatures): https://www.engineering.com/modeling-the-bones-for-massive-lego-sculptures/
- Brick Builders Handbook — basic techniques (wall bonding): https://brickbuildershandbook.com/basic-lego-techniques/
- Sariel, LEGO Angles Chart (independent part→angle listing; corroborates the "33°"=27° finding): https://angles.sariel.pl/
- New Elementary — Pythagorean triangles, escaping the grid: https://www.newelementary.com/2025/05/lego-pythagorean-triangles-escaping-grid.html
- New Elementary — clip-based Pythagorean triangles: https://www.newelementary.com/2025/07/clip-based-lego-pythagorean-triangles.html
- New Elementary — techniques with reflected wedges (the 1:m doubling identity): https://www.newelementary.com/2025/04/lego-techniques-with-reflected-wedges.html
- New Elementary — "Bravo three one eight" (bar diameter): https://www.newelementary.com/2016/12/bravo-three-one-eight.html
- Hypo-technique 1: LEGO rotation principles and hinged constructions (angle tables): https://www.l3go.bugge.com/articles/technique/Hypotech1.shtml
- BrickNerd — Hidden math: the numbers that make LEGO work (12-12-17 in set 10264): https://bricknerd.com/home/hidden-math-the-numbers-that-make-lego-work-6-10-22
- BrickNerd — Hidden math: the numbers behind LEGO grids and slopes: https://bricknerd.com/home/hidden-math-the-numbers-behind-lego-grids-and-slopes-6-2-25
- BrickNerd — LDU and you: https://bricknerd.com/home/ldu-and-you-the-oldest-new-lego-measurement-unit-2-9-23
- Robert Cailliau, LEGO Dimensions (measured mm, incl. beam thickness): https://www.cailliau.org/en/Alphabetical/L/Lego/Dimensions/More%20Dimensions/
- Brick Builder's Handbook — the math behind LEGO building techniques, vols 1 & 4: https://brickbuildershandbook.com/2022/01/29/the-math-behind-lego-building-techniques-volume-1/
- The LEGO Group — Using 'illegal' building techniques in LEGO Ideas Challenges: https://www.lego.com/en-ca/service/help-topics/article/using-illegal-building-techniques-in-lego-ideas-challenges
- BrickNerd — Hidden math: circles and spheres: https://bricknerd.com/home/hidden-math-the-numbers-behind-lego-circles-and-spheres-11-13-23
- BrickNerd — Everything you want to know about cheese slope mosaics: https://bricknerd.com/home/everything-you-want-to-know-about-cheese-slope-mosaics-11-29-22
- BrickNerd — Achieving greeble greatness: https://bricknerd.com/home/achieving-greeble-greatness-3-18-24
- BrickNerd — From noise to narrative: detail distribution in LEGO MOCs: https://bricknerd.com/home/from-noise-to-narrative-detail-distribution-in-lego-mocs-2-2-26
- Brick Builder's Handbook — Squaring the circle: https://brickbuildershandbook.com/2021/09/05/squaring-the-circle-building-round-shapes-using-lego/
- Brick Builder's Handbook — Math behind LEGO techniques vol.3 (polygon apothem law, Globe 21332): https://brickbuildershandbook.com/2023/08/11/the-math-behind-lego-building-techniques-volume-3/
- Holger Matthes — headlight brick: https://www.holgermatthes.de/bricks/en/lampenstein.php · offset/corbelling: https://www.holgermatthes.de/bricks/en/offset.php · LEGOmetry: https://www.holgermatthes.de/bricks/en/geometry.php
- New Elementary — Nexogon Technic connection (0.05 mm measured clearance): https://www.newelementary.com/2017/04/nexogon-technic-connection.html
- New Elementary — building at angles, escaping the grid (two-layer counter-rotation): https://www.newelementary.com/2025/03/lego-building-at-angles-escaping-grid.html
- Bruce Lowell — the Lowell Sphere: https://www.brucelowell.com/lowell-sphere/
- Neil Webber — Technic triangle geometry: https://neilwebber.com/2015/07/25/lego-technic-triangle-geometry/
- Bill Ward — Brick geometry (BBTB 2018): https://www.brickpile.com/wp-content/uploads/2018/07/brick-geometry-bbtb2018.pdf
- lego-art-remix source (dither kernels, relief levels, pooling): https://github.com/debkbanerji/lego-art-remix
- Brickset inventories — 31197, 31203, 21226, 31213: https://brickset.com/inventories/31203-1
