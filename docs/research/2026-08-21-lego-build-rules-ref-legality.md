# LEGO "legal vs illegal" building techniques — a sourced rules corpus for LDraw/MPD model generation

**Compiled:** 2026-08-21. **Scope:** the LEGO Group's own internal design rules about permissible part-to-part connections, as far as they can be traced to primary material, plus an explicit separation of AFOL community convention from LEGO-Group rule.

### Contents

| § | Contains | Rule IDs |
|---|---|---|
| [0](#0-read-this-first--the-provenance-problem) | Provenance, source tiers, LDU conventions | — |
| [1](#1-hard-illegal--lego-group-internal-rule-primary-sourced) | **Hard-illegal**, from the Berard 2006 deck | `L-01`…`L-12` |
| [1b](#1b-hard-illegal--bricklink-designer-program-first-party-and-current) | **Hard-illegal**, from current BrickLink Designer Program rules | `B-01`…`B-10` |
| [2](#2-discouraged--at-own-risk--explicitly-not-hard-illegal) | **Discouraged / at own risk** | `D-01`…`D-04` |
| [3](#3-legal--but-commonly-and-wrongly-listed-as-illegal) | **Legal but commonly mis-listed as illegal** | `G-01`…`G-03` |
| [4](#4-rules-that-have-changed--the-stale-corpus-hazard) | **Rules that changed over time**, with set numbers | `C-01`…`C-08` |
| [5](#5-what-the-first-party-tooling-actually-enforces) | What LEGO.com, LEGO Ideas and Studio actually enforce | `T-01`…`T-03` |
| [6](#6-contested--could-not-verify--read-this-before-trusting-any-community-list) | **Contested / could not verify** | — |
| [7](#7-grounding-ldd-the-patent-and-published-tolerances) | LDD, the 1958 patent, published tolerances | — |
| [8](#8-implementation-summary-for-the-ldraw-generator) | Implementation summary + verified LDraw part index | — |

### Four things that will surprise you

1. **Collision detection finds exactly one of these rules.** Most are invisible to mesh interference because LDraw idealises away the 0.1–0.2 mm offsets the rules exist to protect. See §8.
2. **The canonical source is obsolete and its author says so.** Jamie Berard, 2017: *"That is not the version we use for inhouse presentations anymore."* The current in-house rule set has never been published.
3. **The best current first-party rule list is not the famous one.** It is the BrickLink Designer Program's "Stressing the elements" section (§1b) — live, enforced, and almost never cited by community lists.
4. **Several premises in the popular account are simply wrong.** LEGO Ideas does *not* reject projects for illegal techniques (§5, T-01/T-02); LDD never had a collision toggle (§7.1); LEGO's published moulding tolerance is 0.005 mm, not the widely-quoted 0.01 mm (§7.3).

---

## 0. Read this first — the provenance problem

There is **exactly one substantial primary document** in public circulation: Jamie Berard's slide deck *Stressing the Elements*, presented August 2006. Everything else in the public "illegal techniques" literature is either (a) derived from that deck, (b) community folklore, or (c) a small number of first-party LEGO/BrickLink pages that acknowledge the rules exist without enumerating them.

Three facts about that deck that most community lists omit:

1. **It is out of date, and its author says so.** At LEGO Fan Media Days in June 2017 Jamie Berard told The Rambling Brick, verbatim: *"It is important that you know, that is is an old version of the presentation. We are aware that it is out 'in the wild' but it has been updated. That is not the version we use for inhouse presentations anymore."* ([The Rambling Brick, 2017-07-29](https://ramblingbrick.com/2017/07/29/stressed-by-the-elements-saturn-v-tiles-plates-and-the-legality-of-connections/)) **The current in-house version has never been published.** Any corpus built from the 2006 deck is, by the author's own statement, stale in unknown places.
2. **Berard has since disowned the word "illegal."** Reported by BrickNerd: the term *"was never meant to be official, and it has become outdated. It should probably be called 'non-standard' or something similar instead."* ([BrickNerd, Oscar Cederwall](https://bricknerd.com/home/illegal-snot-stressful-techniques-for-sideways-building-9-7-23) — *secondary, paraphrasing Berard; I could not find the original first-party statement*).
3. **The deck itself is not a binary.** It has four distinct verdict categories, which community lists routinely collapse into one: `Legal:` / `Illegal:` / `Possibly Legal...But Not Recommended` / `Definitely Illegal!`, plus a `Legal back then...Illegal now` category and an `Illegal builds that made it to market...` category. This document preserves those distinctions.

### Source tiers used below

| Tier | Meaning |
|---|---|
| **P1** | LEGO Group first-party document (the Berard deck; lego.com; bricklink.com) |
| **P2** | Verbatim quote of a named LEGO designer, published by a third party |
| **S** | Secondary — community analysis, clearly labelled as such |
| **F** | Folklore — circulates widely, no traceable primary source |

### The primary document

- **Jamie Berard, *Stressing the Elements*, August 2006.** 35 slides, LEGO Group branded. Mirrors: [hellobricks.com](https://www.hellobricks.com/pdf/jamieberard-brickstress-bf06.pdf), [bramlambrecht.com](https://bramlambrecht.com/tmp/jamieberard-brickstress-bf06.pdf), [casadebricks.com](https://casadebricks.com/wp-content/uploads/2021/05/Stressing-The-Elements.pdf). Indexed by [Swooshable](https://swooshable.com/other-resources/stressing-the-elements). All quotations below are transcribed from the PDF's own text layer and are exact.
  - Note on venue: Swooshable and most secondary sources say "BrickCon 2006"; the PDF filename is `-bf06` and the deck is widely also cited as **BrickFest 2006**. I could not resolve which. The date on slide 1 is "Aug. 06".
  - **Important caveat on my reading of it:** the deck's rules live in *captions*; the *part identities* live in untitled 3D renders with no part numbers. I transcribed every caption verbatim. Where I name a part below, I say whether it came from the caption (certain) or from my reading of the render (marked *[render reading]* — treat as my inference, not as the deck's claim).

### LDraw conventions used throughout

`1 LDU = 0.4 mm` · `1 stud pitch = 20 LDU = 8 mm` · `plate height = 8 LDU = 3.2 mm` · `brick height = 24 LDU = 9.6 mm` · `stud diameter = 12 LDU = 4.8 mm` · `stud height (LDraw idealised) = 4 LDU = 1.6 mm` · `brick wall (LDraw idealised) = 4 LDU = 1.6 mm` (LDU values verified directly from official LDraw part files [3005.dat](https://library.ldraw.org/library/official/parts/3005.dat), [3024.dat](https://library.ldraw.org/library/official/parts/3024.dat), [87087.dat](https://library.ldraw.org/library/official/parts/87087.dat)).

> **Provenance warning on the millimetre column:** the `1 LDU = 0.4 mm` identity and every mm figure above are **LDraw conventions and community measurement, not LEGO Group statements.** LEGO publishes no millimetre dimension for any element — see §7.4, which is a firm negative finding. The LDU values are authoritative for your files; the mm values are not authoritative for anything.

> **The single most important thing for a machine-checking implementation:** LDraw geometry is *idealised*. Several of the real rules below exist precisely because the physical part deviates from the nominal grid by 0.1–0.2 mm — and LDraw snaps those deviations away. A collision test over LDraw coordinates will therefore report **zero interference** for several of the hard-illegal cases. Those rules must be encoded as **part-identity + relative-transform predicates**, not as mesh intersection tests. This is flagged per rule.

---

## 1. HARD-ILLEGAL — LEGO Group internal rule, primary-sourced

### L-01 · `SYSTEM_TECHNIC_HEIGHT_MISMATCH` — System side-studs and Technic holes are not co-planar

**Rule:** A System brick's side stud and a Technic brick's pin hole sit at *different* heights below the top face. Assemblies that assume they are interchangeable are out of system.

**Geometry (verbatim from the deck, slide 2):**
> "The Center Point for the stud on the side of a System brick is **3.92mm** from the top of the brick
> The Center Point for the hole in the side of a classic Technic brick is **3.80mm** from the top of the brick
> The Center Point was moved up in order to accommodate the additional plastic needed around the Technic hole so that a stud can still fit in the bottom of the brick."

So the mismatch is **0.12 mm = 0.30 LDU**.

**Parts:** Technic Brick 1x1 with Hole (**6541**), Technic Brick 1x2 with Hole (**3700**), Technic Brick 1x6 with Holes (**3894**) vs. Brick 1x1 with Stud on 1 Side (**87087**) / Brick 1x1 with Headlight (**4070**).

**Why:** it is a tolerance/"out of system" defect, not a stress defect *on its own* — it becomes a stress defect the moment anything bridges the two (see L-02).

**Source:** P1, Berard 2006 slide 2.

**Machine-checkable as:** **Partly — and NOT by collision.** LDraw places both features at `y = 10 LDU` below the top face: `3700.dat` has `peghole.dat` at `y=10`; `87087.dat` and `4070.dat` both place `stud2a.dat` at `y=10`. The 0.30 LDU real-world difference **does not exist in LDraw at all.** Encode as a part-class predicate: `if a submodel contains both a Technic-hole part and a System side-stud part whose feature axes are coplanar in the model AND any third part connects to both → flag`.

---

### L-02 · `TECHNIC_HOLE_BRIDGED` — a System stud in a Technic hole may not be bridged

**Rule:** One System stud may enter one Technic hole. It becomes illegal the moment any further element connects across the top or the bottom of that pair.

**Verbatim (slide 4, under a picture that the deck labels `Legal:`):**
> "*Technically legal so long as no additional elements are connected across the top or bottom.
> However, this assembly is not recommended."

**Verbatim (slide 12):**
> "When you place an element into a Technic hole, the side of that element will be taller than the attached Technic brick. Because of this, the yellow brick is hitting the red plate."

**Parts:** any Technic brick with a pin hole (3700 / 3894 / 6541) receiving any studded element; the illustration *[render reading]* shows a red plate in the end hole of a blue Technic Brick 1x6 with a yellow Brick 2x2 above fouling it.

**Why:** two compounding faults. (a) The element seated in the hole ends up **0.1 mm proud** of the Technic brick's top face (see L-01), so anything laid across the top is forced onto that high spot; (b) the Technic hole is not a compliant feature — see L-03.

**Source:** P1, Berard 2006 slides 4 and 12. Corroborated S: BrickNerd states the current state of the rule as *"it is ok to attach only single studs into a Technic hole, but only for decoration and not in the main structure. It becomes an illegal technique if you add anything across the top or any additional connections."* ([BrickNerd](https://bricknerd.com/home/illegal-snot-stressful-techniques-for-sideways-building-9-7-23))

**Machine-checkable as:** **Yes, structurally (not geometrically).** Build a connection graph. `for each edge (stud → technic_hole): if degree(studded_part) > 1 in the connection graph → flag`. Equivalently: the part whose stud occupies a Technic hole must be a leaf node.

---

### L-03 · `MULTI_STUD_INTO_TECHNIC_HOLES` — never more than one stud into Technic holes

**Rule:** Exactly one stud into one Technic hole. Two or more is illegal.

**Verbatim (slide 12):**
> "Technic holes are slightly smaller than those of System. You can connect a single stud into a single Technic hole and a child can still take them apart. Any more than that and the resistance becomes too great and there is the potential for elements (and children) being stressed."

**Parts:** *[render reading]* a red Plate 1x4 (3710) with two studs pressed into two holes of a blue Technic Brick 1x8 (3702).

**Why:** clutch force is superlinear in the number of over-tight joints; disassembly force exceeds what a child can apply, and the part can break. BrickNerd adds the mechanism (S): *"the Technic hole is not designed to flex. In the LEGO Technic system, it's the Technic pins that are designed to flex and deform, not the hole. So, when you put a stud into that hole, there is no room for deformation, and there is much more clutch than a regular connection."*

**Source:** P1, Berard 2006 slide 12.

**Machine-checkable as:** **Yes.** `count(stud→technic_hole edges between the same pair of parts) > 1 → flag`. In LDraw terms: a studded part whose studs lie at `y` matching a Technic brick's `peghole` axis, at ≥2 distinct 20 LDU-spaced x positions.

---

### L-04 · `PIN_NOT_IN_CLICK` — every Technic pin must be seated in its detent

**Rule:** A Technic pin (or half-pin) must be pushed fully home so its ridge snaps past the hole's waist. A pin left part-way in is illegal.

**Verbatim (slide 8):**
> "Both ends of a Technic hole are larger than the diameter in the middle. Until it 'snaps' into place, the half-peg is in compression and could be permanently damaged over time. Also, by not being locked into place, the element can easily pop out during play."

**Verbatim (slide 29, *"Illegal builds that made it to market..."*):**
> "**Technic pegs are not in "click"** — This not only stresses the element, but also weakens the build resulting in potential failure during play"

**Parts:** Technic Pin 1/2 (**4274**), Technic Pin (**3673**), Technic Pin with Friction (**2780**), into any Technic hole (`peghole.dat`).

**Why:** sustained radial compression → creep → permanent deformation → loss of clutch; plus the joint can pop apart in play.

**Source:** P1, Berard 2006 slides 8 and 29. Note slide 29 is the deck admitting LEGO shipped this fault itself.

**Machine-checkable as:** **Yes, as a discrete position test.** A pin's axial insertion depth relative to the hole must equal the seated value; any intermediate `x/y/z` offset along the pin axis that is not the detent position → flag. In practice: `|axial_offset| ∈ {0, ±20 LDU seated positions}`; anything else → flag. Most LDraw editors snap to seated positions, so this rarely appears in generated files — but a raw generator can emit it.

---

### L-05 · `PIN_INTO_UNDERSIZED_BORE` — pins must not be forced into non-Technic bores

**Rule:** A Technic pin may only enter a bore designed for it. Pressing it into a smaller System bore (e.g. the bottom tube of a round brick) is illegal.

**Verbatim (slide 10):**
> "Since the diameter inside the red brick is smaller than that of the Technic peg, the black element will always be in compression. There is no opportunity in his scenario for the peg to be in 'click.'"

**Parts:** *[render reading]* a Technic pin driven into the underside of a Brick 1x1 Round (**3062b**) or similar.

**Why:** permanent compression on the pin, and the pin can never reach "click" (L-04).

**Source:** P1, Berard 2006 slide 10.

**Machine-checkable as:** **Yes, with a part-feature table.** Requires an annotation per part of which bores accept a Ø 4.8 mm / Ø 12 LDU pin. `if pin_axis coincides with a bore whose declared class ≠ technic_pinhole → flag`. Not derivable from LDraw meshes alone with any reliability.

---

### L-06 · `CONE_ON_PIN_NO_STOP` — no press-fitting an element that has no travel stop

**Rule:** An element whose bore tapers with no shoulder to stop insertion must not be pressed onto a pin or tube, because there is nothing to limit how far it goes.

**Verbatim (slide 14):**
> "Because there is no stop at the top of the cone, the red element could be pushed in too far. This will stress the pin and inner walls of the yellow brick"

**Parts:** Cone 1x1 (**4589**) pressed onto the underside tube/pin of a Brick 1x2 (**3004**) *[render reading — the deck's "legal" counterpart is a straight-walled round brick]*.

**Why:** unbounded insertion → hoop stress on the receiving brick's inner wall and on the pin.

**Source:** P1, Berard 2006 slide 14.

**Machine-checkable as:** **Not geometrically — requires a part-property table.** Encode a boolean `has_insertion_stop` per bore feature. Then: `if part is pressed onto a pin/tube AND NOT has_insertion_stop → flag`. LDraw will happily render this at the "correct" depth and show no interference.

---

### L-07 · `CLICK_HINGE_OFF_DETENT` — click hinges only at multiples of 22.5°

**Rule:** Click (ratcheting) hinges must rest in a detent. Permitted angles are integer multiples of 22.5°.

**Verbatim (slide 16):**
> "Click hinges must be in 'click.' Approved angles are in multiples of **22.5** degrees. Some LEGO projects require an engineer to determine whether an angle is legal."

**Why:** off-detent the ratchet teeth are held partly overridden — sustained deformation of the teeth, and the joint drifts under load.

**Source:** P1, Berard 2006 slide 16.

**Machine-checkable as:** **Yes, and cleanly.** For any part in the click-hinge family, decompose its transform relative to its partner and assert `rotation_about_hinge_axis mod 22.5° == 0` (within float tolerance). Requires a hinge-family part list and per-part hinge axis. Note this rule does **not** apply to friction/free hinges or to ball joints — do not over-apply it.

---

### L-08 · `PC_ON_PC_SLIDING` — polycarbonate must not slide against polycarbonate

**Rule:** Two polycarbonate elements may connect stud-on-stud, but must never be assembled by sliding one over the other.

**Verbatim (slide 20):**
> "Both of these elements are made of a plastic called polycarbonate. PC reacts with PC to cause a great amount of friction. This is ok for stud on stud connections, but when sliding one PC element over another, there is little hope of a child pulling them apart.
> Most transparent elements are made of PC. PC is also used on other parts where ABS is not strong enough."

**Parts:** *[render reading]* a bar/axle passed through the bore of a trans-yellow cone-shaped element. The rule is material-based, not part-based.

**Why:** PC–PC static friction is high enough that the joint becomes effectively permanent — a playability/safety issue, not a breakage one.

**Source:** P1, Berard 2006 slide 20. **This is the rule community lists most often omit entirely, and it is the one most relevant to a colour-aware generator.**

**Machine-checkable as:** **Yes, if you carry a material table keyed on (part, LDraw colour code).** Predicate: `if material(A)==PC AND material(B)==PC AND connection_type(A,B) ∈ {bar_in_bore, axle_in_bore, sliding_fit} → flag`. Transparent LDraw colours (32–47, 57, 285, 293…) are a good first approximation for PC, but it is an approximation: the deck explicitly says PC is *also* used on opaque parts where ABS is not strong enough, and it does not say which. **This rule cannot be made exact from public data.**

---

### L-09 · `RECEIVER_SMALLER_THAN_CONNECTOR` — the receiving element must not be smaller than what is pushed into it

**Rule:** Any connection where the female feature has smaller nominal dimensions than the male feature is illegal, full stop.

**Verbatim (slide 24, under the heading `Definitely Illegal!`):**
> "All are illegal because the receiving brick has smaller dimensions than the one being connected to it."

**Parts:** *[render reading]* three examples — a red element jammed into a blue panel's recess; a yellow slope wedged into a blue element's cavity; and a stack of plates jammed edge-on into another plate's studs.

**Why:** the entire load is carried by elastic deformation of the receiver's walls → permanent set, splitting.

**Source:** P1, Berard 2006 slides 23–24. This is the deck's most emphatic category — the only one titled "Definitely Illegal!".

**Machine-checkable as:** **This is the one rule that IS a genuine mesh-intersection test.** `if volumetric_overlap(A, B) > tolerance → flag`. Use a small negative tolerance (~0.5 LDU) to absorb LDraw modelling slop. This is also exactly what BrickLink Studio's collision detection and LDD's collision engine catch — so it is the cheapest rule to enforce and the least interesting, because a naive generator produces it constantly and every other rule here is invisible to it.

---

### L-10 · `PLATE_BETWEEN_STUDS` — a plate may not be wedged edge-on between two studs

**Rule:** Wedging a **plate** on edge into the 8 LDU gap between two studs is illegal. (A **tile** in the same position is legal — see G-01. This is the single most-confused pair in the whole corpus.)

**Geometry:** studs are Ø 12 LDU on a 20 LDU pitch, so the clear gap between adjacent studs is exactly `20 − 12 = 8 LDU = 3.2 mm` — **exactly** the nominal plate height. Nominal clearance is therefore **zero**, and the real parts resolve that zero in the plate's favour.

**Why (in Berard's own words, 2017, P2):**
> "There are a few issues with plates: plates are slightly thicker than tiles. So, even if you take a 2×2 plate with a single stud and finger groove, as was used in the LEGO Games (Ed. that is Design ID 87580), it is just a little thicker, to provide strength in accomodating the studs. Also, the height of a stud is slightly greater than the distance between the edge of the plate and the stud, so it cannot completely fit in place."
> — Jamie Berard to The Rambling Brick, LEGO Fan Media Days June 2017 ([source](https://ramblingbrick.com/2017/07/29/stressed-by-the-elements-saturn-v-tiles-plates-and-the-legality-of-connections/))

An independent hobbyist measurement in that same article put the plate's non-studded thickness at **~5.7% (≈0.2 mm) greater than a tile's** (S — explicitly self-described as parallax-limited eyeballing, not micrometry).

BrickNerd's mechanism (S): *"The space between the studs is a bit smaller than the thickness of 1 plate. The studs can't flex, which might cause them to deform and lose clutch power."*

**Parts:** any plate (3024, 3023, 3020, 87580 …) edge-on between two studs of any studded part.

**Source:** P1 Berard 2006 (the deck names it in the `Legal back then...Illegal now` slide, below) + P2 Berard 2017 for the mechanism.

**Machine-checkable as:** **Yes, but ONLY as a part-class predicate — the geometry is identical for tiles and plates in LDraw.** `3070b.dat` (Tile 1x1) and `3024.dat` (Plate 1x1) are both exactly 8 LDU tall in LDraw. Predicate: `if part is rotated 90° about a horizontal axis AND its 8 LDU dimension occupies the 8 LDU inter-stud gap: legal iff part_class == tile, illegal iff part_class == plate`. **A collision checker will pass both.**

---

### L-11 · `SIDE_STUD_BEYOND_ENVELOPE` — nothing may be placed against the face a headlight stud points into

**Rule:** The side stud of the Brick 1x1 with Headlight (**4070**) reaches *exactly* to the brick's nominal 20 LDU envelope. In the physical part it goes slightly past it, because the moulded LEGO wordmark adds height to every stud. Therefore no element may be placed flush against that face.

**Geometry (verified from the official LDraw part file):** `4070.dat` places the side stud as `1 16 0 10 -6 1 0 0 0 0 1 0 1 0 stud2a.dat` — the stud's base is at `z = −6 LDU` (the recess floor) and its tip lands at `z = −10 LDU`, i.e. **precisely coincident with the brick's outer wall plane**. Nominal clearance = **0.000 LDU**. By contrast `87087.dat` (Brick 1x1 with Stud on 1 Side) places its stud at `z = −10` so it protrudes a normal 4 LDU to `z = −14`.

**Why (verbatim, deck slide 6):**
> "The word *LEGO* molded onto the studs of most System elements increases the height of the stud by **0.14mm**. This extra height causes the stud on the blue brick above to touch the side of the yellow one."

0.14 mm = **0.35 LDU**. That is the whole rule: every stud in the system is 0.35 LDU taller than the nominal grid says, so any connection relying on exactly-zero stud clearance interferes.

**This rule is live in 2026.** Former LEGO designer **Tiago Catarino** identified exactly this fault in **[11376 Ford Model T](https://brickset.com/sets/11376-1) (2026)**, at build step 167. Brickset's write-up: *"The problem he found is caused by the fact that stud on the side of a headlight brick sticks out further than the width of a brick. Consequently, they can't be placed next to another element with the stud facing in, but that's exactly what's been done in the Model T… The real problem comes when you attach a plate above them and that's exactly what's been done on this model."* ([Brickset, 16 Feb 2026](https://brickset.com/article/129979/former-lego-designer-finds-illegal-technique-in-new-model); [Brick Fanatics](https://www.brickfanatics.com/lego-designer-ford-model-t-illegal-technique) — both S, reporting Catarino's video). Brickset flags a second instance: **[76324 Spider-Man vs. Oscorp](https://brickset.com/sets/76324-1) (2025)**, where a fez element wider than a brick fouls a wall.

**Source:** P1 for the 0.14 mm constant (deck slide 6). P1 (LDraw official part file) for the 4070 geometry. S for the Model T instance. *My identification of slide 5/6's yellow element as a headlight-type brick is a [render reading] — the caption itself is quoted exactly and stands on its own.*

**Machine-checkable as:** **Yes, and this is the highest-value rule to implement, because collision detection provably cannot find it.** Predicate: inflate every stud by **0.35 LDU** along its axis before testing, then run interference. Equivalently, as a rule: `for any stud whose tip plane is coincident with (clearance < 0.5 LDU of) another part's surface → flag`. Generalise beyond 4070: *any* zero-nominal-clearance stud-to-wall abutment is suspect.

---

### L-12 · `TECHNIC_HALFBEAM_WITH_SYSTEM_PLATE`

**Rule:** Stated only as a bare line in the deck's `Other Considerations...` slide, without illustration or explanation:
> "Technic Half-Beams and System Plates are not friends"

**Parts:** Technic half-beams (Liftarm 1xN Thin, e.g. **32063**, **41677**, **6632**) against System plates.

**Why:** not stated in the deck. A Technic half-beam is 4 LDU thick where a plate is 8 LDU, so stacks of the two do not resolve on the plate grid — but that is **my inference, not the deck's claim.**

**Source:** P1, Berard 2006 slide 26 (single line, no elaboration).

**Machine-checkable as:** **No — the rule as published is too vague to encode.** Flag for human review; do not implement a predicate you cannot justify.

---

## 1b. HARD-ILLEGAL — BrickLink Designer Program, first-party and current

**This is the most important source in this document after the Berard deck, and it is almost entirely absent from community "illegal techniques" lists.** The BrickLink Designer Program submission guidelines contain a section literally titled **"Stressing the elements"** — a deliberate echo of Berard's 2006 title. It is a live, currently-enforced, first-party rule list.

**Source:** [BrickLink Designer Program Guidelines](https://www.bricklink.com/v3/designer-program/guidelines.page?guideline=series-4) (change the `guideline` query param per series). The page is client-rendered; the rule text lives in the JS bundle `https://static2.bricklink.com/_build/js/CrowdGuidelines.build.js`, one content block per series (Series 1–11 plus "2028 Wave 1"). Quotes below are Series 4; Series 10, 11 and 2028 Wave 1 carry identical "Stressing the elements" text. On-page anchors: the accordion headings *Stressing the elements*, *Stability*, *Part usage*, *Size*, *Part selection*, *Stickers*, *Building experience*, *Working models*, *Step Editor Mode*.

> **Terminology note:** the word "illegal" appears **zero times** anywhere in the BDP guidelines (all 11 series + 2028 Wave 1), and zero times in the [BDP Terms of Service](https://www.bricklink.com/v3/designer-program/terms_of_service.page). BrickLink states the rules without the folklore vocabulary.

### B-01 · `BDP_NO_STUD_IN_PINHOLE` — **flat ban, stricter than the 2006 deck**

**Verbatim:** *"Studs cannot be inserted into Technic pin holes."* (Series 1 wording: *"Don't insert a stud into a Technic pinhole or half pinhole."*)

**This directly supersedes D-01 for anyone submitting to BDP.** Berard 2006 permitted one unbridged stud in one Technic hole as "technically legal"; BDP permits **none**. If your generator targets BDP-plausible output, use B-01 and drop the exception.

**Machine-checkable as:** **Yes, cleanly.** `count(stud→technic_pinhole edges) > 0 → flag`. Strictly easier than L-02/L-03 because there is no counting or graph analysis — any such edge fails.

### B-02 · `BDP_NO_BENDING` — only flexible parts may be bent

**Verbatim:** *"Only flexible parts should be bent. Bending any other parts is strictly prohibited."*

**Machine-checkable as:** **Not from a static LDraw file** — LDraw represents parts as rigid transforms, so a bent rigid part usually cannot be expressed at all. It *is* checkable in flex-aware formats (LDCad flexible-part paths, Studio's flex parts): `if a flex path is applied to a part not in the flexible-part class → flag`. In plain LDraw/MPD, bending manifests only as an inter-part interference and collapses into L-09.

### B-03 · `BDP_SNOT_LOGO_CLEARANCE` — **first-party confirmation of the 0.14 mm rule**

**Verbatim:** *"When building horizontally (Studs Not on Top or SNOT), be careful not to interfere with the logo on the stud."*

This is BrickLink/LEGO stating, in current guidance, exactly the constraint Berard quantified in 2006 as 0.14 mm of extra stud height (L-11). **The two independent primary sources agree, twenty years apart.** Treat L-11/B-03 as the single best-evidenced rule in this corpus.

**Machine-checkable as:** as L-11 — inflate every stud by **0.35 LDU** along its axis before interference testing. Note the BDP wording scopes it to SNOT (sideways) building specifically, which is where the fault actually arises.

### B-04 · `BDP_MUST_BE_SEPARABLE` — no construction that cannot be taken apart

**Verbatim:** *"Don't stack large plates on top of each other or create any other construction that can't be taken apart easily. An exception to this rule is certain Technic turntables which are assembled this way to function."* (Current-series wording narrows the first clause to *"large plates (4x, 6x, 8x)"*.)

**Why:** the same disassembly-force logic as L-03. Large plate-on-plate contact area multiplies clutch.

**Machine-checkable as:** **Yes, as a heuristic.** `if two plates share a stud-contact footprint of ≥ N studs with no intervening tile/brick → warn`, with N tuned to the 4x/6x/8x wording. Whitelist the turntable families.

### B-05 · `BDP_NO_FRACTIONAL_ROTATION` — no sub-detent part positioning

**Verbatim (from *Building experience*):** *"Assembling the physical model shouldn't require specialized building skills or techniques that are learned through years of experience. This includes precision alignment of Technic gears, the easing of Technic elements fixed to an axle, advanced sticker placement techniques and the partial or subjective positioning of elements (e.g., the fractional rotation of 1 x 1 elements)."*

**Machine-checkable as:** **Yes, and this one is easy and high-value for a generator.** For any part whose only connection is a single stud (1x1 round parts, cones, single-stud plates), assert its yaw is a multiple of 90° unless it is rotationally symmetric. `if rotation_about_stud_axis mod 90° ≠ 0 for a single-stud-connected part → flag`. Generators love emitting arbitrary yaw here; BDP explicitly forbids it.

### B-06 · `BDP_NO_FLOATING_PARTS` — every element must be connected

**Verbatim (from *Step Editor Mode*):** *"Elements laying side by side with no connection are not allowed."*

**Machine-checkable as:** **Yes, trivially and it should be your first check.** Build the connection graph; assert it has exactly one connected component. This also operationalises Berard's *"Support Everything!"* (D-03).

### B-07 · `BDP_STABILITY` — overlap, alignment, and press-fit assembly

**Verbatim (from *Stability*):**
> "The main issue that comes up is the importance of stability in a model. It's imperative that every measure is taken BEFORE a model is submitted to make sure it's going to stay together."
> "When a model is being physically built, parts shouldn't break, collapse or fall off under normal building pressure."
> "Ideally, the building process should consist of parts being pressed downward on a hard, flat surface. Squeezing bricks together between the fingers or hands is discouraged."
> "There must be enough connecting points to keep parts straight and aligned with the natural planes of the model. Drooping walls or difficulty in aligning studs are signs that the model isn't strong enough."
> "Bricks and plates should overlap whenever possible. Building in stacks may create a certain visual appeal but having a model stay together is more important."

**Machine-checkable as:** **Partly.** *"Bricks and plates should overlap whenever possible"* is a real, computable predicate — detect vertically-aligned seams (two courses whose part boundaries coincide in x/z) and penalise them; this is standard masonry bond checking. *"Pressed downward on a hard, flat surface"* implies every assembly step should be a downward stud insertion, which is checkable against a build order if you generate one. *"Drooping walls"* and *"normal building pressure"* are **not mechanically checkable — require judgement or physical test.**

### B-08 · `BDP_TECHNIC_SMOOTHNESS` — working mechanisms must not stress elements

**Verbatim (from *Working models*):** *"Technic movement must be smooth and stable. Don't use excessive sequences of gears or long, winding power flows or anything that bends or stresses the elements."*

**Machine-checkable as:** **Partly** — gear-train depth is countable if you model the drivetrain graph. "Smooth and stable" is judgement.

### B-09 · Other BDP constraints relevant to a generator (not stress rules, but hard submission limits)

- **Part count:** *"submissions must contain at least 400 parts and no more than 4,000 parts. These are strict limits."*
- **Part economy:** *"Models should be optimized to use the fewest number of parts possible based on the palette. Don't manipulate the part count by using a bunch of small parts instead of larger ones."* — the operational form of Berard's *"Can one brick replace the need for 5?"*
- **Palette:** *"Use only parts found in the current official BrickLink Designer Program palette for the intake period you're submitting for."*
- **Minifigures:** *"Minifigures must be complete. You cannot remove the head, arms, legs, hips, or hands from minifigure torso."*
- **Stickers:** one design per 250 parts, hard cap 25 distinct; *"A single sticker shouldn't span across multiple parts."*; *"Stickers can't be placed on surfaces that curve in multiple directions."*

### B-10 · The actual enforcement mechanism is a physical build, not software

**Verbatim (from *Building experience*):** *"Your model will have to undergo testing and building with physical bricks by the BDP Team."* and *"Try building your model with physical bricks to test for model safety, stability, and building experience."*

Same conclusion as §4's Model Committee note: **the gate is a human building the thing.** No automated checker reproduces it.

---

## 2. DISCOURAGED / AT-OWN-RISK — explicitly *not* hard-illegal

The deck has a dedicated slide title for this tier: **`Possibly Legal...But Not Recommended`**. Treat these as soft constraints with a cost, not as prohibitions.

### D-01 · `STUD_IN_TECHNIC_HOLE_UNBRIDGED` — technically legal, not recommended

**Rule:** A single System stud in a single Technic hole, with nothing bridging it, is *technically legal*. It is still discouraged.

**Verbatim (slide 4):**
> "*Technically legal so long as no additional elements are connected across the top or bottom.
> However, this assembly is not recommended."

**Source:** P1, Berard 2006 slide 4. **Note the deck presents this same assembly under `Illegal:` on slide 3 and then walks it back on slide 4 — community lists that cite slide 3 alone get this wrong.**

**Machine-checkable as:** Yes — it is the complement of L-02. Emit a warning, not an error.

---

### D-02 · `HINGE_PLATE_HEIGHT_MISMATCH` — the classic "out of system" penalty

**Rule:** Connecting two plates via a hinge/bar arrangement that leaves them at different heights is possibly legal but not recommended.

**Verbatim (slide 22, under `Possibly Legal...But Not Recommended`):**
> "Not recommended because the two plates will not be at the same height. This causes the assembly to be 'out of system.' Also, there are other elements in the assortment that can accomplish this legally."

**Parts:** *[render reading]* a blue Plate 2x2 with a bar/pin joining a red plate at a different level.

**Why:** "out of system" — everything downstream of the joint is off-grid, and tolerance accumulates. Note the second clause: **the deck's objection is partly that a legal alternative element exists.** That is a design-quality argument, not a mechanical one.

**Source:** P1, Berard 2006 slide 22.

**Machine-checkable as:** **Yes, as a grid-conformance test, though it will over-fire.** `if a part's origin y is not ≡ 0 (mod 8 LDU) relative to the submodel's datum → warn`. Deliberate half-plate and quarter-stud offsets are legitimate modern technique, so this must be a warning with a low weight, never an error.

---

### D-03 · Design-quality heuristics from `Other Considerations...`

Verbatim, slide 26 in full:
> "Heat Test
> Different Plastics = Different Rules
> Can it be built and played with by a 7 year old?
> Can one brick replace the need for 5?
>  - Reduces Complexity
>  - Adds Strength and Stability
>  - Reduces Tolerance Accumulation
> Technic Half-Beams and System Plates are not friends
> Support Everything!"

**Machine-checkable as:** **"Can one brick replace the need for 5?" is checkable** — detect co-linear runs of same-height, same-colour parts that a single larger part in the assortment could replace, and penalise. **"Support Everything!" is partially checkable** — detect parts with no connection path to the model's ground/datum, or cantilevers over N studs with a single anchor. **"Heat Test", "7 year old", "Different Plastics = Different Rules" are not mechanically checkable — they require judgement.**

**Note "Reduces Tolerance Accumulation":** this is the deck's own statement that error is *cumulative*. A generator that stacks many small parts to reach a dimension is doing something LEGO's own designers are told to avoid, even when every individual connection is legal.

---

### D-04 · `BUILD_COMPLEXITY` — "A Massive Migraine for Design Lab!!"

The deck gives an entire slide (25) this title, showing a dense interlocked SNOT column of blue/yellow/red bricks stamped with a red prohibition sign. **There is no caption and no stated rule.** What it demonstrates is a separate axis from legality: an assembly can be composed entirely of legal connections and still be rejected because it is unbuildable, un-instructable, or impossible to disassemble.

BDP states the same concern as an actual rule (see B-05, B-07, B-10): *"Assembling the physical model shouldn't require specialized building skills or techniques that are learned through years of experience."*

**Machine-checkable as:** **Partly.** Proxies worth computing: (a) maximum number of distinct stud-direction axes within one 2x2x2-stud neighbourhood; (b) parts that must be inserted along an axis blocked by already-placed parts, given a build order; (c) sub-assemblies with no valid insertion order at all. (c) is the rigorous version and is a real solvability check — if no ordering of the parts admits a collision-free straight-line insertion for each, the model cannot be built by hand, whatever its connections say.

---

## 3. LEGAL — but commonly and wrongly listed as illegal

### G-01 · `TILE_BETWEEN_STUDS` — **legal**

**Rule:** A **tile** wedged edge-on between two studs is legal. This is the direct counterpart to L-10 and the community gets it wrong constantly.

**Authority:** Jamie Berard, on the record, 2017 (P2):
> RB: *"So, are you saying tiles slot in easily, and don't put any stress on the studs?"*
> JB: *"That's right"*
> — [The Rambling Brick](https://ramblingbrick.com/2017/07/29/stressed-by-the-elements-saturn-v-tiles-plates-and-the-legality-of-connections/)

**In production:** the printed **trans-clear tile** carrying the American flag in the moon-landing vignette of **[21309 NASA Apollo Saturn V](https://brickset.com/sets/21309-1) (2017)** is wedged between two studs. Historic precedents named in the same article: **617 Cowboys**, **375 Yellow Castle**, and — with a *plate*, hence illegal by modern rules — **697 Stagecoach**.

> **Correction of a widely circulated error:** several summaries describe the Saturn V flag as a *plate* between studs and cite it as LEGO breaking its own rule. It is a **tile**, and it is **legal**. Do not put this in the corpus as a rule violation.

**Machine-checkable as:** Yes — see L-10. `part_class == tile` → allow.

---

### G-02 · `CLIP_ON_TILE` — legal on modern clip mouldings

**Rule:** A modern clip gripping a tile (1 plate thickness) is legal. It was formerly considered illegal on older clip mouldings.

**Source:** S — BrickNerd: *"The tile in the clip on the left is actually considered legal nowadays because the new clip design has more flex."* ([BrickNerd](https://bricknerd.com/home/illegal-snot-stressful-techniques-for-sideways-building-9-7-23)). **I could not trace this to a first-party LEGO statement.**

**Machine-checkable as:** **Yes but mould-version-dependent, which LDraw part IDs do partially encode** (e.g. 4085a/b/c/d vs 15712/60897). Predicate must key on the specific clip variant, not the generic "clip" class. If your part library normalises variants, this rule becomes unimplementable.

---

### G-03 · `FIVE_PLATES_EQUALS_TWO_STUDS` — legal, and exact

Not from the deck, but worth stating because generators need it and because it is sometimes mistrusted: `5 × plate height = 5 × 8 = 40 LDU = 2 × stud pitch`. SNOT sandwiches built on this identity are dimensionally exact, not a tolerance abuse.

**Machine-checkable as:** Trivially — it is arithmetic, not a rule.

---

## 4. RULES THAT HAVE CHANGED — the stale-corpus hazard

This section exists because a rules corpus with stale entries is actively harmful. Everything here is a documented change of verdict.

| # | Technique | Then | Now | Evidence |
|---|---|---|---|---|
| C-01 | **1x2 plate wedged between two studs** | **Legal** — used in **10021 U.S.S. Constellation** ([Brickset, 2003](https://brickset.com/sets/10021-1); the deck's caption: *"Gray 'cannons' are attached by 1x2 plates wedged between two studs."*) | **Illegal** — the deck's own slide is literally titled `Legal back then...Illegal now` (slide 28) | P1, Berard 2006 slide 28. *Note: the deck names the set only by picture; the plaque in the slide photo reads U.S.S. Constellation and Brickset dates 10021 to 2003, not 2004.* |
| C-02 | **Tile wedged between two studs** | Grouped with C-01 by the community after 2006 | **Legal, and always was** — Berard clarified in 2017 that the 2006 deck's "plate" wording was specific and did not extend to tiles | P2, Berard 2017 (quoted at G-01) |
| C-03 | **Clip gripping a tile** | Illegal on older clip mouldings | Legal on current mouldings ("the new clip design has more flex") | S only — BrickNerd. No first-party confirmation found. |
| C-04 | **Stud into a Technic hole** | Berard 2006: one unbridged stud "technically legal…not recommended" | **BDP today bans it outright** (B-01), yet LEGO has shipped *bridged* violations: **[10222](https://brickset.com/sets/10222-1) Winter Village Post Office (2011)** step 34; **[71040](https://brickset.com/sets/71040-1) Disney Castle (2016)** steps 166–168; **[21311](https://brickset.com/sets/21311-1) Voltron (2018)** step 1 | P1 for the BDP ban; S (BrickNerd) for the three instruction-step instances — **I did not verify these against the official instruction PDFs** |
| C-05 | **Headlight-brick side stud abutting a wall** | Illegal per the 0.14 mm rule (2006) | **Still illegal — restated by BDP as "be careful not to interfere with the logo on the stud" — and LEGO violated it in 2026**: [11376](https://brickset.com/sets/11376-1) Ford Model T step 167, called out by ex-designer Tiago Catarino; also [76324](https://brickset.com/sets/76324-1) Spider-Man vs. Oscorp (2025) | P1 (deck + BDP) for the rule; S ([Brickset 2026](https://brickset.com/article/129979/former-lego-designer-finds-illegal-technique-in-new-model)) for the instances |
| C-06 | **Technic pins not in click** | Illegal | Still illegal, but the deck itself shows LEGO shipping it (slide 29, `Illegal builds that made it to market...`) | P1, Berard 2006 slide 29 |
| C-07 | **The whole 2006 rule set** | — | **Superseded by an unpublished in-house revision** some time before June 2017 | P2, Berard 2017 |
| C-08 | **The vocabulary itself** | "illegal" (Berard's own 2006 word) | LEGO's current first-party texts avoid it: BDP says *"Stressing the elements"* and never once writes "illegal" across 11 series of guidelines; Berard reportedly prefers *"non-standard"* | P1 (BDP bundle, zero occurrences) + S (BrickNerd) |

### The governance change the deck documents

Slides 30–31 (`The model that forever changed LEGO...`), verbatim:
> "This model was released as a promotional set for the opening of Legoland Germany. It is suppose to be an Audi TT. In addition to its unorthodox and difficult build, it forces elements into unnatural connections causing them to be permanently damaged. It was packaged with only a single picture and no building instructions.
> As a direct result of this set, all models now produced by the LEGO Group must go through the Design Department. This ensures that nothing gets released without first being approved by a Model Committee. Sometimes lasting up to 2 or 3 days, this review allows representatives from building instructions, senior designers, engineers and the designer sit down together and build the model. The goal is to maintain an 'only the best is good enough' approach to our design process. A final heat test then highlights further weaknesses that must be changed before the set can be launched out onto the market."

The set is **Audi TT Roadster**, a 2002 LEGOLAND Deutschland promotional exclusive, 57 pieces — [Brickset 1359](https://brickset.com/sets/1359-1/Audi-TT-Roadster) / [BrickLink `auditt-1`](https://www.bricklink.com/v2/catalog/catalogitem.page?S=auditt-1). Background: [BrickNerd, "LEGOLAND Bootlegs: The Model That Forever Changed LEGO"](https://bricknerd.com/home/legoland-bootlegs-the-model-that-forever-changed-lego-11-8-21) (S).

**Why this matters for a rules corpus:** the deck is describing a *review process*, not a checklist. The final gate is a **heat test** (thermal cycling to surface stressed joints) and a **multi-day human build review**. Neither is expressible as a predicate over an LDraw file. Any automated legality checker is approximating a process that LEGO itself does not automate.

---

## 5. What the first-party tooling actually enforces

### T-01 · LEGO.com — the only current first-party statement on the vocabulary

Full text of LEGO's own help article, quoted verbatim and in its entirety (P1):

> **Using 'illegal' building techniques in LEGO® Ideas challenges**
> The LEGO Group has internal design rules for connecting LEGO pieces together for stability and to avoid unnecessary stress. These are sometimes call 'illegal' building techniques. You're able to design using 'illegal' techniques in BrickLink Studio if the 'Snap' setting is turned off.
> Unless we say otherwise in specific challenge rules, all building techniques are allowed and won't result in disqualification.

— [lego.com help topics](https://www.lego.com/en-us/service/help-topics/article/using-illegal-building-techniques-in-lego-ideas-challenges) (also [en-ca](https://www.lego.com/en-ca/service/help-topics/article/using-illegal-building-techniques-in-lego-ideas-challenges), [en-fr](https://www.lego.com/en-fr/service/help-topics/article/using-illegal-building-techniques-in-lego-ideas-challenges)). *("sometimes call" is LEGO's typo, reproduced as published.)*

Three things follow, and they matter:
1. LEGO confirms on the record that the internal rules exist and confirms the community's name for them.
2. LEGO **does not enumerate them anywhere public.**
3. **For LEGO Ideas, illegal techniques are explicitly NOT a disqualifier.** Any claim that LEGO Ideas rejects projects for illegal building techniques is contradicted by LEGO's own help page.

### T-02 · LEGO Ideas Rules & Guidelines — a significant *negative* finding

The [LEGO Ideas Rules & Guidelines](https://ideas.lego.com/rules-guidelines) constrain piece count (200–5,000), prohibit new moulds, prohibit *"any modifications, such as glueing or cutting"*, prohibit *"drum-lacquered (metallic), glow-in-the-dark elements, or parts you haven't seen used in a new LEGO set for several years"*, and permit design in *"a digital design app such as BrickLink Studio"*.

**They do not mention illegal building techniques, stress, or structural integrity at all.** A full-text search of the page (footer: "Updated: July 7th, 2026") returns **zero** hits for "illegal", "stress", "structural", "integrity", "sturdy", or "stability". The only statement of review criteria is Chapter 6:

> "…the Review Board considers many different factors when deciding whether to approve a Product Idea and begin developing it into an official LEGO set. Some of these factors include: Existing products on shelves / New products currently in development / Licensing possibilities / **Build quality** / **Feasibility** / Expected demand / And much more"

"Build quality" and "Feasibility" are the only hooks, and they are not defined. **The premise that LEGO Ideas names illegal building techniques as a rejection criterion is not supported by the current guidelines text**, and T-01 says the opposite for Challenges. Claims that specific projects (e.g. the ISS) were rejected for "structural integrity" trace to Brickipedia/Fandom, not to LEGO.

### T-03 · BrickLink Studio — what it actually flags (and what it provably does not)

**Direct answer: Studio does not detect illegal building techniques.** It detects collisions, connectivity, and a conservative stability estimate. Evidence: a sweep of all 123 articles in the [Studio Help Center](https://studiohelp.bricklink.com/) returns **0 hits for "illegal" and 0 hits for "stress"**.

**[Collision](https://studiohelp.bricklink.com/hc/en-us/articles/5412820155927-Collision)** (P1, verbatim):
> "Collision detection allows you to know whether or not parts will fit together. It also prevents you from placing or turning parts in a way that would make them collide."
> "Use Collision Detection as a guide. **Collisions will not always be accurately detected because connections can be more complicated or less rigid in real life**"
> "Collision detection refers to the level of detail set in Edit | Preferences | Appearance | Render quality. When the quality is low, parts display fewer details and collisions are less likely to be detected"
> "Even with Collision detection on, you can still use the keyboard to force parts to move or turn in ways that will make them collide"

Note the second and third quotes: Studio's collision test is **mesh-resolution dependent** and can be **force-overridden**. It maps onto L-09 only, and imperfectly.

**[Stability check](https://studiohelp.bricklink.com/hc/en-us/articles/6501498505111-Stability-check)** (P1, verbatim):
> "Studio can check if your design is stable and if its parts are sufficiently connected to support its weight."
> "The parts that Studio thinks maybe not be sufficiently connected are pink (cautions) and red (warnings)."
> "**Studio is very conservative: it often flags parts that are actually well connected.**"
> "Green zones: the group of parts is stable and can stand in this position on a flat surface. Red zones: the group of parts is unstable."

**[Connectivity check](https://studiohelp.bricklink.com/hc/en-us/articles/6501624386071-Connectivity-check)** (P1) — maps onto B-06.

**[Snap](https://studiohelp.bricklink.com/hc/en-us/articles/5412087360919-Snap)** (P1, verbatim):
> "When you move parts with Snap turned on, selected parts will try to connect to the other parts, as with real bricks."

**This is the crux for anyone reasoning from LEGO's own help text.** T-01 says you can build illegally in Studio "if the 'Snap' setting is turned off" — which implies Snap is a legality enforcer. It is not: Snap is a *placement assist*. It does not flag, warn about, or refuse illegal geometry; it simply declines to help you achieve it. **There is no first-party documentation of any illegal-technique validator in Studio**, and the Step Editor / Instruction Maker documentation describes interface elements only, with no validation checks of any kind.

**BDP tells designers to run these tools by hand** (P1, from BDP *File set-up for BDP*):
> "Turn on the Collision feature by clicking on the icon in the top tool bar until it turns red."
> "Turn on the Snap feature by clicking on the icon in the top tool bar until it turns Blue."
> "Periodically check the model stability. To do this, turn on the Stability feature… Use this tool to check hinge elements and any tall or intricate areas."

**Implication for the generator:** if you validate against Studio, you are validating against L-09 + B-06 + a conservative topple test. That is three of the ~25 rules in this document. Studio is not a legality oracle and does not claim to be.

---

## 6. Contested / could not verify — read this before trusting any community list

Blunt list of things that circulate widely and that I could **not** trace to a primary source.

1. **"BrickCon 2006."** Most sources say BrickCon; the PDF filename (`-bf06`) and several mirrors suggest **BrickFest** 2006. The deck itself says only "Aug. 06". Unresolved.
2. **The current in-house rule set.** Berard confirmed in 2017 that an updated version exists and that the public one is obsolete. **It has never been published, and no one outside LEGO knows what changed.** Everything in §1 above carries this asterisk.
3. **Berard's "non-standard" remark.** Reported by BrickNerd without a link to an original. I could not find the first-party source (interview, AMA, or talk) where he said it. Treat as P2-at-one-remove.
4. **The "0.01 mm / 10 micrometre LEGO manufacturing tolerance" figure — DISPROVEN.** No first-party source. LEGO's own published figure is **0.005 mm (1/200 mm)**. The "0.002 mm" variant is a third, incompatible number in circulation. See §7.3. **Do not repeat 0.01 mm or 0.002 mm.**
5. **Real stud height.** Community references give 1.8 mm; LDraw idealises to 4 LDU = 1.6 mm; Berard's 0.14 mm wordmark addition is relative to an unstated base. **No first-party dimension exists (§7.4).** Do not hard-code a stud height and call it authoritative.
6. **Real brick wall thickness.** Commonly cited as 1.5 mm; LDraw idealises to 4 LDU = 1.6 mm. **No first-party source — LEGO publishes no millimetre dimensions at all (§7.4).**
6b. **"LDD had a collision-detection toggle" / "LDD had a LEGO mode and a Free mode" — both appear to be false**, and the second is a confusion with BrickLink Studio. See §7.1. LDD's Extended theme was a *colour* freedom.
6c. **"A LEGO brick withstands 37,000 assembly cycles" / "3–5 N to separate."** Secondary only, no LEGO source (§7.5).
7. **"Illegal techniques get LEGO Ideas projects rejected."** Contradicted by LEGO's own help article (T-01).
8. **"Roller skate (11253) SNOT is illegal."** BrickNerd's own wording is *"Probably the fact that the lip and the half stud are actually a little bit wider than a stud"* — the author is guessing. **Folklore (F).** Not in the deck.
9. **"Log/palisade bricks (30136, 30137) accepting a Technic axle underneath is illegal."** BrickNerd: *"It does seem to cause a little bit of outward deformation."* Author's observation, not a LEGO rule. **F.**
10. **"Plate forced sideways into an open 1xN brick is illegal."** BrickNerd, mechanism plausible, no LEGO source. **F.**
11. **"Old 4085b clip into a 1x1 anti-stud is illegal."** BrickNerd, no LEGO source. **F.**
12. **"Technic pin ends are stud-sized so you can SNOT off them — illegal."** BrickNerd, no LEGO source. Adjacent to L-04/L-05 but not the same claim. **F.**
13. **Slide 17–18's parts.** The deck's caption is unambiguous — *"The red element is forcing the black element into compression."* — but I could not confidently identify the elements from the render. The black part is a 4-stud body with a central hole and a cylindrical pin projecting from each end, which matches LDraw **4600 "Plate 2x2 with 2 Wheel Pins"**; a green element engages one pin legally and a red element engages the other illegally. **I could not determine what distinguishes the green element from the red one**, which is the entire content of the rule. I have therefore stated L-05 in terms of its mechanism and not its parts. Anyone who tells you which specific parts this slide shows is inferring, as I would be.
14. **Slides 32–33 (`Examples of Legal Builds`, `Unusual, But Legal Builds`).** These have **no captions at all** — pure images. They demonstrate that unusual ≠ illegal, but they cannot be transcribed into rules. Anyone claiming to know what they show is inferring.
15. **Anything about hinge angles other than 22.5° multiples for *click* hinges.** The deck's rule is specific to click hinges. Community lists over-generalise it to all hinges. **Do not apply L-07 to friction hinges, ball joints, or turntables.**
16. **The status of a single stud in a single Technic hole — genuinely contested between two first-party sources.** Berard 2006 (P1): *"technically legal so long as no additional elements are connected across the top or bottom… However, this assembly is not recommended."* BrickLink Designer Program, current (P1): *"Studs cannot be inserted into Technic pin holes."* — no exception offered. Meanwhile LEGO has shipped bridged versions in at least three sets (C-04). **There is no single answer here. Pick the stricter BDP rule for generation and record that you did.**
17. **"LEGO manufacturing tolerance is 0.01 mm / 10 µm."** See §7. Ubiquitous; primary sourcing is weak.
18. **The BDP guidelines are not stably citable by URL.** The page is fully client-rendered — a plain fetch returns an empty shell. The text quoted in §1b came from BrickLink's own JS bundle (`CrowdGuidelines.build.js`), spot-verified against a browser render of the Series 4 page. If you need a reproducible citation, cite the accordion heading on `guidelines.page?guideline=series-4`, not a fragment URL. Per-series text can and does change between series.

---

## 7. Grounding: LDD, the patent, and published tolerances

### 7.1 LEGO Digital Designer — **the premise in the brief is wrong, and this matters**

I set out to document LDD's legality/collision engine and its "LEGO mode vs Free mode" distinction. **Three of the four things commonly attributed to LDD do not exist in its first-party documentation.** Findings are from the shipped help files inside the official LDD 4.3.12 installer (pulled from the [Internet Archive copy](https://archive.org/details/setup-ldd-mac-4-3-11), files `Help/en-manual/en-manual.html` and `engReadMe.html`) plus the [official 4.1 manual PDF](http://www.kramirez.net/Robotica/Material/Presentaciones/LEGODigitalDesign.pdf).

**There is no "LEGO mode" / "Free mode" / "Expert mode".** LDD documents *three operation modes* and *three themes*, which are different axes:
> "LEGO® Digital Designer has three operation modes: 1. Build mode 2. View mode 3. Building guide mode"

**LDD EXTENDED is a colour/palette freedom, not a geometry freedom.** Verbatim:
> "LEGO® Digital Designer EXTENDED — Choose the LDD EXTENDED theme if you want to mix bricks and colors without limitations."
> "LEGO Digital Designer EXTENDED palette — When in the LDD EXTENDED theme, bricks can be colored freely, regardless of their design."

Nothing in the Extended documentation relaxes connection rules.

**There is no "brick collision detection" toggle in LDD.** The word "collision" appears nowhere in the official 4.3 manual or readme; the Preferences list and icon-bar list contain no such option; the official Build-mode toolbar screenshot (`Help/common/01_editmode.png`) shows Select, Clone, Hinge, Hinge Align, Flex, Paint, Hide, Delete and no collision button. At binary level, "collision" occurs in `LDD.exe` only inside the bundled CM Labs *Vortex* physics engine's internal symbols — there is no user-facing UI string for it. **The widely-repeated instruction to "turn off collision detection in LDD's top toolbar" appears to be a confusion with BrickLink Studio, which does have exactly that button.**

**The hinge tool constraints are real and are documented.** Verbatim:
> "Hinge tool (H key). Use the Hinge tool to rotate bricks that are connected with a hinge or a single-stud connection."
> "Pitch, Roll and Yaw angle entry fields — The pitch, roll and yaw angle entry fields allow precise rotation of a joint/hinge **within its defined limits**."
> "The Hinge wheel also lets you rotate in a circular motion and **snap the rotation to 45-degree increments**."
> "Hinge Align tool (Shft+H key). Use the Hinge Align tool to automatically connect two separate connection points."

Note the **45°** snap — *not* Berard's 22.5° (L-07). LDD's UI increment and LEGO's click-hinge rule are different numbers for different things; do not conflate them.

**Conclusion for the corpus:** LDD enforced legality only *implicitly*, through its connectivity model — it simply would not let you make a connection its part definitions did not describe. **It never documented in prose what it permitted or blocked.** There is no LDD rule list to mine. The legality vocabulary lives in BrickLink Studio's Snap/Collision (§5, T-03), not in LDD.

### 7.2 The original patent — US 3,005,282

[Google Patents full text](https://patents.google.com/patent/US3005282A/en). Godtfred Kirk Christiansen, Billund, assignor to Interlego A.G., Zug. Filed 28 July 1958 (Ser. No. 751,387), Danish priority 28 Jan 1958, granted 24 October 1961.

**Critical finding: the patent contains no dimensions and no tolerances, and never uses the words "friction" or "interference fit".** The grip is described as a purely *geometric* clamping effect:

> "the principal object of the invention is to provide improved coupling means for **clamping** such building bricks together in any desired relative position"
> "Each of the secondary projections touches the geometrically projected cross sections of four primary projections. Likewise the geometrically projected cross-section of each primary projection is **tangent to at least one secondary projection and the inner face of at least one of the side or end walls**."
> "The secondary projections may be provided with longitudinal slits 18 … **to increase the clamping effect** of said projections"

Claim 4 is the clearest statement of mechanism:
> "a geometric projection of the peripheries of said primary protuberances normal to the inner face of said bottom wall each being in **tangential contact with said surfaces at three points**, at least one of said points of contact being with the surface of said secondary protuberance, **said tangential contact producing a clamping effect** when a primary protuberance of another such block engages the said surfaces."

Claim 2 is the only quasi-dimensional statement: *"the inside diameter of said tubular projection is equal to the diameter of said cylindrical projections."* (Claims 1–3 were later disclaimed by Interlego A.G., 31 March 1978.)

**Why this grounds the rules:** the patented connection is **three-point tangential contact**. That is a statically determinate, elastically-loaded grip. Every hard-illegal rule in §1 is a case of substituting some *other* contact geometry — an interference fit (L-05, L-09), a two-point pinch with no relief (L-10), a compliance-free bore (L-03), or a sliding friction lock (L-08). Stated that way, "illegal" has a precise meaning: **a connection that is not the patented three-point tangential clamp**. That is a much better mental model for a generator than a list of banned part pairs.

LEGO's own plain-language version of the same idea (P1):
> "The studs get neatly wedged in between the tubes and the sides of every brick making them stick together firmly."
> — [lego.com, "How do LEGO bricks work?"](https://www.lego.com/en-us/service/help-topics/article/how-do-lego-bricks-work)

### 7.3 Published tolerances — **the number everyone quotes is wrong**

**The correct first-party figure is 0.005 mm (5 µm), not 0.01 mm.** Three independent LEGO-published sources agree:

> "**Splitting hairs** - each LEGO brick is moulded to the accuracy of a hair's width (**5my/0.005mm**) to ensure the perfect 'clutch power' that holds LEGO creations together."
> — [LEGO newsroom, May 2022](https://www.lego.com/en-us/aboutus/news/2022/may/brick-by-brick-building-lego-love-for-90-years)

> "Material improvements permit a greater precision in molding, which is now done to an **accuracy of 1/200 mm**."
> — [lego.com History, "Quality in every detail"](https://www.lego.com/en-us/history/articles/d-quality-in-every-detail) (also repeated at ["The LEGO moulding philosophy"](https://www.lego.com/en-us/history/articles/e-the-lego-moulding-philosophy))

`1/200 mm = 0.005 mm = 5 µm`. In LDU: **0.0125 LDU**.

**Blunt correction:** the ubiquitous "0.01 mm / 10 micrometres" and "two thousandths of a millimetre / 0.002 mm" figures have **no first-party source**, and they are not even the same number as each other — secondary write-ups use them interchangeably, which is itself evidence nobody is checking. The 0.002 mm variant is currently being amplified by low-quality SEO/AI-generated manufacturing blogs with no traceable LEGO citation. **Do not put either in the corpus.** Two further caveats on the real figure: it describes *moulding accuracy*, not assembly clearance, and LEGO's History articles frame it as a **1963** achievement following the switch to ABS, not a current published spec.

**Why this matters for the rules:** the tolerances the rules exist to protect (0.12 mm in L-01, 0.14 mm in L-11/B-03, ~0.2 mm in L-10) are **10–40× larger than the moulding tolerance**. These are *design* offsets, not manufacturing scatter. They are deterministic and therefore genuinely machine-checkable — you are not modelling a random variable, you are modelling a known geometric fact that LDraw rounds away.

### 7.4 Element dimensions — **firm negative finding**

**There is no first-party LEGO source for any millimetre dimension of a LEGO element.** Not 4.8 mm stud diameter, not 1.8 mm stud height, not 9.6 mm brick height, not 3.2 mm plate, not 1.5 mm wall, not the 8 mm module. LEGO publishes **ratios and stud counts only**:

> "Meet the 'flat plate'… if you stack three of these on top of each other, they'll be exactly the same size as our regular 1x1 brick."
> — [lego.com, comparing bricks, plates and DUPLO](https://www.lego.com/en-us/service/help-topics/article/comparing-lego-bricks-plates-and-duplo-bricks)

> "Every beam and axle comes with a number telling you the length in studs. Use another LEGO piece to measure by counting how many studs it spans."
> — [lego.com, Technic building tips](https://www.lego.com/en-us/service/help-topics/article/tips-for-building-with-lego-technic-elements)

LEGO's only official dimensional artefact found is a **1:1 printable measuring chart** for Technic beams ([42055_X_Measurements.pdf](https://www.lego.com/cdn/product-assets/product.bi.additional.info.pdf/42055_X_Measurements.pdf), "Please print this document in 100%") — labelled entirely in **stud counts**, with no millimetre figures anywhere.

**Consequence:** every mm value in §0's LDU table comes from the LDraw standard and from community measurement, **not from the LEGO Group**. The `1 LDU = 0.4 mm` identity is an LDraw convention. This does not make it wrong — LDraw is internally consistent and is what your files are actually in — but do not cite LEGO as its source, and do not treat 0.14 mm and 0.4 mm as sharing a common authority.

### 7.5 Clutch power — no published method or threshold

**No first-party figure exists for clutch force or for assembly/disassembly cycle life.** LEGO's [product safety page](https://www.lego.com/en-us/sustainability/product-safety) documents its test battery in detail — bite tests at 22.5 kg, step tests at 15 kg, 1.5 m drop tests — and **clutch cycling is simply not among them**. The nearest first-party acknowledgement that clutch power is a measured acceptance criterion is the recycled-PET prototype release: the prototype *"meets several of their quality, safety and play requirements – including clutch power"* ([lego.com, June 2021](https://www.lego.com/en-us/aboutus/news/2021/june/prototype-lego-brick-recycled-plastic)) — confirming it is tested, publishing neither method nor threshold.

**The widely-quoted "3–5 newtons to pull apart" and "a brick survives 37,000 assembly cycles" figures are secondary only.** No LEGO-authored source was found for either.

### 7.6 Official building guidance for fans — thin, and non-technical

LEGO's fan-facing building guidance is motivational, not structural. There is **no LEGO-published equivalent of the community's legal/illegal connection rules** outside the BDP guidelines in §1b. The closest:

> "…They begin without any instructions, building and making changes as they go. **Once everything lines up and is as sturdy as it can be**, they'll start on the final version."
> — [lego.com, Building tips for Master Builders](https://www.lego.com/en-us/service/help-topics/article/building-tips-for-master-builders)

The Technic article carries the one concrete structural rule, and it is a *clearance* rule — the mirror image of everything else in this document:

> "With all the different beams and axles you'll find in your TECHNIC set **accuracy is key**."
> "**Some Technic pieces need a little space so they can move or turn, so be careful not to push your gears and axles too tightly.**"
> — [lego.com, Technic building tips](https://www.lego.com/en-us/service/help-topics/article/tips-for-building-with-lego-technic-elements)

**Coverage gap, stated plainly:** `education.lego.com` teacher-guide PDFs were **not** swept. If first-party structural/legal building guidance exists anywhere else, that is the remaining place to look.

---

## 8. Implementation summary for the LDraw generator

Ranked by (value × tractability):

| Rule | Predicate type | Collision-detectable? | Confidence |
|---|---|---|---|
| **B-06** no floating parts | connected-component count == 1 | No | **High (P1, current)** — do this first |
| **B-01** no stud in Technic pinhole | edge-type ban | No | **High (P1, current)** — supersedes D-01 |
| **B-05** no fractional rotation of 1x1s | yaw mod 90° for single-stud parts | No | **High (P1, current)** |
| L-09 receiver-smaller-than-connector | mesh intersection | **Yes** | High (P1) |
| **L-11 / B-03** stud-logo clearance | inflate studs 0.35 LDU, then intersect | **No** — this is the point | **Highest — two primary sources, 2006 and current** |
| L-03 multi-stud-into-Technic-holes | connection-graph count | No | High (P1) |
| L-02 Technic-hole-bridged | connection-graph degree | No | High (P1) |
| L-10 plate-between-studs | part-class + orientation | **No** — identical to legal tile in LDraw | High (P1+P2) |
| L-07 click-hinge-off-detent | rotation mod 22.5° | No | High (P1) |
| L-04 pin-not-in-click | discrete axial position | No | High (P1) |
| L-01 System/Technic mismatch | part-class co-occurrence | **No** — 0.30 LDU error absent from LDraw | High (P1) |
| B-07 masonry bond / overlap | coincident vertical seams between courses | No | High (P1, current) |
| B-04 must be separable | large plate-on-plate contact area | No | High (P1, current) |
| B-09 part economy / palette / count | inventory arithmetic | n/a | High (P1, current) |
| L-06 cone-on-pin-no-stop | part-property table | No | Medium (P1, needs data you must build) |
| L-05 pin-into-undersized-bore | part-feature table | No | Medium (P1, needs data you must build) |
| L-08 PC-on-PC sliding | material table (part × colour) | No | Medium (P1 rule, imprecise data) |
| B-08 gear-train depth | drivetrain graph depth | No | Medium (P1, threshold unstated) |
| D-02 out-of-system heights | y ≢ 0 mod 8 LDU | No | Low — over-fires on legitimate offsets |
| B-02 no bending | flex-path part class | n/a in plain LDraw | High rule, unrepresentable in MPD |
| L-12 half-beam vs plate | — | — | **Unimplementable as published** |
| D-03 heat test / 7-year-old / plastics; B-07 "drooping walls"; B-10 physical build | — | — | **Judgement / physical test only** |

**Headline findings for an implementer:**

1. **Collision detection finds one rule.** Of ~20 encodable rules from primary sources, **exactly one (L-09) is a mesh-interference test.** A checker built on collision alone reproduces roughly 5% of the corpus — and BrickLink's own docs warn that even their collision test is resolution-dependent and overridable.
2. **The three cheapest wins are graph-theoretic, not geometric:** B-06 (one connected component), B-01 (no stud→pinhole edges), B-05 (no fractional yaw on single-stud parts). All three are current first-party BDP rules, all three are trivial over an MPD file, and all three are the exact failure modes a naive generator produces.
3. **The 0.35 LDU stud inflation (L-11 / B-03) is the single highest-value non-obvious change.** Two independent primary sources twenty years apart state it, LDraw hides it, and LEGO itself shipped violations of it in 2026.
4. **Everything else needs a part-property database that does not exist.** Insertion stops, bore classes, PC-vs-ABS materials, tile-vs-plate class, click-hinge families and their axes, clip mould variants. The LDraw library carries none of this. Budget for authoring it, or accept that those rules stay unenforced.
5. **Do not over-trust the corpus.** Berard has said on the record that the public rule set is obsolete, and the current one is unpublished. Prefer the BDP guidelines (§1b) for anything current, and treat the 2006 deck (§1) as historically authoritative but possibly stale.

---

### Part index — every LDraw ID cited above, verified against the official library

Each name below was read directly from `https://library.ldraw.org/library/official/parts/<id>.dat` on 2026-08-21 (HTTP 200, first line of the file).

| LDraw ID | Official LDraw name | Appears in |
|---|---|---|
| `3001` | Brick 2 x 4 | reference |
| `3004` | Brick 1 x 2 | L-06 |
| `3005` | Brick 1 x 1 | LDU reference (wall = 4 LDU) |
| `3020` | Plate 2 x 4 | L-10 |
| `3023` | *moved to* `3023b` — Plate 1 x 2 | L-10 |
| `3024` | Plate 1 x 1 | L-10, LDU reference |
| `3062b` | Brick 1 x 1 Round with Hollow Stud | L-05 |
| `3070b` | Tile 1 x 1 with Groove | G-01, L-10 |
| `3673` | Technic Pin | L-04 |
| `3700` | Technic Brick 1 x 2 with Hole | L-01, L-02, B-01 |
| `3702` | Technic Brick 1 x 8 with Holes | L-03 |
| `3710` | Plate 1 x 4 | L-03 |
| `3894` | Technic Brick 1 x 6 with Holes | L-02, L-03 |
| `4070` | Brick 1 x 1 with Headlight | **L-11 / B-03** |
| `4085b` | Plate 1 x 1 with Clip Vertical (Thin U-Clip) | G-02 |
| `4274` | Technic Pin 1/2 | L-04 |
| `4589` | Cone 1 x 1 | L-06 |
| `4600` | Plate 2 x 2 with 2 Wheel Pins | slide 17–18, tentative |
| `6541` | Technic Brick 1 x 1 with Hole | L-01, L-02 |
| `11253` | Minifig Roller Skate | contested #8 |
| `15712` | Tile 1 x 1 with Clip (Thick C-Clip) | G-02 |
| `2780` | Technic Pin with Friction and Slots | L-04 |
| `30136` / `30137` | Brick 1 x 2 Log / Brick 1 x 4 Log | contested #9 |
| `32063` | Technic Beam 6 x 0.5 | L-12 |
| `87087` | Brick 1 x 1 with Stud on 1 Side | L-01, L-11 (contrast case) |
| `87580` | Plate 2 x 2 with Groove with 1 Centre Stud | L-10 (Berard names this design ID explicitly) |
