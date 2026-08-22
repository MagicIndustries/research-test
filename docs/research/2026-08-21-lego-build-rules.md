# LEGO build rules as agent constraints — legality, technique, and what a machine can actually check

Research note, 2026-08-21. Compiled for the purpose of **giving an agent a rule corpus while it constructs models in LDraw/MPD**.

**Provenance of claims.** Three parallel research streams, each working from primary sources: the LEGO Group's own material (§1), measured part geometry (§2), and the ratified LDraw specifications (§3). The complete official LDraw Parts Library (`complete.zip`, Parts Update 2026-07) and the LDCad shadow library were **downloaded and measured** rather than quoted — the majority of numeric claims in the reference sections are reproducible from named `.dat` files. Where a claim is community measurement, anecdote or folklore, it is tiered as such and says so.

**This note is the front door.** The detail lives in three reference companions:

| Companion | Contains |
|---|---|
| [`-ref-legality.md`](2026-08-21-lego-build-rules-ref-legality.md) | `L-01`…`L-12` (Berard 2006), `B-01`…`B-10` (BrickLink Designer Program, current), `D-*` discouraged, `G-*` legal-but-mis-listed, `C-*` changed-over-time, contested/folklore |
| [`-ref-technique.md`](2026-08-21-lego-build-rules-ref-technique.md) | ~260 numbered technique rules: dimensional identities, SNOT, angles, circles, structural/load, mosaic |
| [`-ref-ldraw.md`](2026-08-21-lego-build-rules-ref-ldraw.md) | Format spec, coordinate/origin conventions, connectivity metadata, emitter gotchas, validation tooling |

A machine-readable extract is at [`lego-build-rules.yaml`](lego-build-rules.yaml).

---

## TL;DR

1. **Collision detection is the wrong primitive, and this is the single most important finding.** Of roughly twenty encodable rules traceable to primary sources, **exactly one is a mesh-interference test.** The rules are overwhelmingly *graph-theoretic* — about what connects to what, how many studs enter a hole, whether the model is one connected component. An agent gated on collision alone enforces about 5% of the corpus while feeling thorough.

2. **The three cheapest wins are also the exact failure modes a naive generator produces.** No floating parts (one connected component), no stud in a Technic pinhole, no fractional yaw on single-stud parts. All three are current first-party BrickLink Designer Program rules, all three are trivial over an MPD file. Do these before anything clever.

3. **The canonical source is obsolete and its author says so.** Jamie Berard, 2017, on the 2006 *Stressing the Elements* deck: *"That is not the version we use for inhouse presentations anymore."* The current in-house rule set has never been published. Berard has also disowned the word "illegal", preferring "non-standard". **Any corpus built on the 2006 deck is stale in unknown places** — treat it as historically authoritative, and prefer the BDP guidelines for anything current.

4. **The best current first-party rule list is not the famous one.** The BrickLink Designer Program guidelines carry a live, enforced section titled *"Stressing the elements"* — a deliberate echo of Berard — that community lists almost never cite. It is stricter than the 2006 deck in at least one place: it bans studs in Technic pinholes outright, where Berard called that legal-but-not-recommended.

5. **Four premises in the popular account are simply false.** LEGO Ideas does *not* reject projects for illegal techniques — its help page says all building techniques are allowed. LDD never had a collision-detection toggle. BrickLink Studio does not detect illegal techniques (zero hits for "illegal" or "stress" across all 123 help articles; its snapping is a placement assist, not a validator). And the famous 0.01 mm tolerance is wrong — LEGO's published figure is 0.005 mm.

6. **No existing tool validates any of this.** Whatever checking you want, you are writing it. The good news is that the layer that catches most real defects is about a day's work (§4).

7. **Berard's deck is a four-tier vocabulary, not a binary** — `Legal` / `Possibly Legal...But Not Recommended` / `Illegal` / `Definitely Illegal!`, plus explicit `Legal back then...Illegal now` and `Illegal builds that made it to market` categories. Every community list flattens this. The middle tiers are where most interesting technique lives, so flattening them costs the agent its best moves.

8. **LDraw idealises away the very deviations the rules exist to protect.** Several hard-illegal cases have *zero nominal clearance* in LDraw and will report no interference. The headlight brick's side stud sits at exactly the 20 LDU envelope. These must be encoded as part-identity + relative-transform predicates, never as geometry tests.

9. **Slope part names are systematically wrong and will inject real error.** The part called "33°" is actually 26.5651° = atan(½) — a 6.4° discrepancy, roughly 3 LDU per stud of run. An agent reasoning from part names rather than measured geometry will build things that do not close.

10. **Only N = 4 closes exactly.** The stud lattice maps onto itself only at 0°, 90°, 180°, 270°, so a four-fold rosette is the sole exactly-closing radial arrangement. Angular closure and lattice closure are *different tests* and a 16-gon of click hinges passes the first while failing the second.

---

## 1. The severity model to give the agent

Berard's four tiers plus BDP's current rules collapse cleanly into **three** for an agent, and the collapse is worth doing explicitly because the failure modes differ:

| Tier | Meaning | Agent behaviour |
|---|---|---|
| **HARD** | Stresses or damages an element; would not ship in a set | Never emit. Reject and re-plan. |
| **DISCOURAGED** | Works, but out-of-system, fragile, or degrades over time | Emit only with a stated reason; surface it in output. |
| **STYLE** | Craft convention, no formal definition | Advisory heuristic; never a gate. |

Two things this buys you. First, `DISCOURAGED` is where the useful techniques live — collapsing it into `HARD` makes the agent timid and blocks legitimate builds. Second, `STYLE` rules have no ground truth, so gating on them produces confident nonsense.

**Do not encode the folklore.** Around eight widely-repeated "rules" — roller skates, log bricks, certain old clips — trace back only to a single author openly speculating. They are listed in the legality companion as folklore, not laundered into the corpus. Recognise that a rules corpus with stale or invented rules is *worse than none*, because the agent cannot tell which is which.

---

## 2. The conflict the two streams surfaced, and how to resolve it

The legality stream recommends **inflating every stud by 0.35 LDU before interference testing**, to catch stressed connections that have zero nominal clearance in LDraw. Two primary sources twenty years apart support the underlying fact: Berard quantifies the LEGO wordmark as adding 0.14 mm to every stud, and BDP today warns against interfering with the stud logo. LEGO itself shipped a violation of this in 11376 Ford Model T (2026).

The LDraw stream points out, correctly, that **correctly-connected LEGO parts are supposed to interpenetrate.** A stud of radius 6 mates exactly with a tube bore of radius 6. Real parts connect through stress-based plastic deformation, so there is **no zero-tolerance geometric ground truth** — every implementer who has tried has landed on a tuned tolerance with an accepted error trade-off.

Both are right, and the resolution is a scoping rule:

> **Clearance testing is only meaningful between surfaces that are not a declared connection.** Inflate studs and test interference *after* excluding every male↔female hotspot pair that the connectivity data says is mated. Globally, inflation produces false positives on every legal stack; scoped to non-mating surfaces, it catches the class of violation LDraw otherwise hides.

This is why the connectivity extractor (§4, L4) is a prerequisite for the stud-inflation check rather than an independent nicety.

---

## 3. What the agent needs that does not exist

Two hard dependencies, neither of them available off the shelf:

**A connectivity hotspot extractor.** The LDCad shadow library (CC BY-SA 4.0) is the only open connectivity data. Naive file counting suggests 14% coverage; walking each part's full reference closure gives **81.1% effective coverage**, of which only 15.3% comes from a part's own shadow file. A 2×4 brick has no shadow file at all — its data is entirely inherited. **Skip the recursive walk and you get a fifth of the data.** The remaining ~19% must be treated as *unknown* connectivity, not *no* connectivity, or a validator will reject valid models. No open-source parser of `!LDCAD SNAP_*` metas exists in any language; this is ~300 lines done properly and unlocks every structural predicate.

**A part-property database.** Insertion stops, bore classes, polycarbonate-vs-ABS materials, tile-vs-plate class, click-hinge families and their axes, clip mould variants. The LDraw library carries none of it. Several hard-illegal rules are unenforceable without it. Budget for authoring it, or accept those rules stay advisory.

Note the licence asymmetry: the parts library is CC BY 4.0 but the shadow library is **CC BY-SA 4.0**, and ShareAlike propagates into anything derived from it.

---

## 4. The validation stack, layered by cost

| Layer | Checks | Availability |
|---|---|---|
| **L0** Syntax | Line types, token counts, CRLF, numeric fields | LDView headless today |
| **L1** References | Parts resolve, no cycles, no duplicate `0 FILE`, no `~Moved to` aliases | LDView today |
| **L2** Matrix sanity | `det(R) = +1`, `R·Rᵀ = I`, no singular/skewed transforms | LDView + ~20 lines |
| **L3** Grid conformance | X/Z multiples of 10, Y multiples of 4 and ≤ 0, integer coordinates | **~150 lines, write it** |
| **L4** Connectivity | Every part supported, engagement counts, no floating components | **Needs the extractor** |
| **L5** Legality | The `L-*`/`B-*` predicates, mostly graph-theoretic | **Needs L4 + part-property DB** |
| **L6** Structure | "Will it hold together?" | **Unsolved in the open** |

**Build L0–L3 first.** That combination catches essentially every mistake an LLM actually makes when emitting LDraw — matrix transposition, Y-sign, colour 16 at the top level, missing `0 FILE`, invented part numbers, off-grid placement — and it is roughly a day's work with no dependencies beyond the parts library. It will catch more real defects than anything further up the stack.

L6 is genuinely not answerable. The nearest existing things are BrickLink Studio's proprietary stability check and the BrickGPT/StableLego static-equilibrium models, which operate on a 20×20×20 grid with 8 brick types. Generalising to arbitrary LDraw is unsolved.

---

## 5. The emitter gotchas that matter most

These are the mistakes an LLM makes, ordered by frequency. Full tables in the LDraw companion, §10.

- **Matrix transposition.** `(a,b,c)` is the **first row**, not the image of the X axis. three.js and glm store column-major; LDraw wants row-major. Symmetric parts look fine when transposed, which is why the bug survives review — test with an asymmetric part.
- **Y sign.** −Y is up. Stack by *decreasing* Y. A brick resting on the ground has `origin_y = −24`, not 0, because the origin sits on the part's top face. Do not add stud height when stacking; brick-on-brick is exactly 24 LDU.
- **Colour 16 at the top level.** It means "inherit from my caller"; a top-level model has no caller and renders mustard. Models use concrete codes, parts use 16, and colour 24 never appears on a type-1 line.
- **Origin assumptions.** The spec's "centred on the topmost stud group" holds far less often than it reads: measured over a 250-part sample, only 24% have the standard studs-up signature, **43% have their origin off the footprint centre**, and 60% carry non-integer coordinates. Placement must be per-part table-driven, not computed from footprint.

**Packaging trap worth stating outright:** the obvious package names are decoys. `npm i ldraw` installs 2015 code because the `latest` tag was never moved; `cargo add weldr` gets a 2020 crate with no BFC support; PyPI `ldraw` is a 2008 write-only generator by a different author than the one everyone means. The healthy implementations are all git-only and unversioned. Verify publish dates before adopting anything in this ecosystem.

---

## 6. Honest limits

- **The current LEGO rule set is unpublished.** Everything in the `L-*` series carries that asterisk.
- **There is no first-party source for any millimetre dimension of a LEGO element.** This is a firm negative finding, not a gap in searching. Every mm figure in circulation is LDraw convention or community measurement. The LDU values are authoritative for your files; the mm values are authoritative for nothing.
- **LDraw carries none of the real tolerances.** An agent validating only against LDraw coordinates will emit physically illegal models — this is structural, not a bug to fix.
- **Clutch power has no published method or threshold.** The load figures in the technique companion are community measurement, tiered accordingly.
- **One live conflict remains unresolved:** the cheese-slope square sign, where LDraw geometry (0.4 under square) disagrees with measured plastic (over square).
- **Three research leads were dead ends** and are recorded so nobody spends budget on them again: the "ULABTG circle table" does not exist, and neither Holly Webb nor Yoshiya Nakamura returns anything indexed.
- **`education.lego.com` was not swept.**

---

## 7. Recommended next steps

| # | Action | Why |
|---|---|---|
| 1 | Build the **L0–L3 gate** (~150 lines + headless LDView) | Highest defect catch per hour of work; no dependencies |
| 2 | Give the agent the **three-tier severity model** (§1), not a flat rule list | Flattening makes it timid and blocks legal technique |
| 3 | Write the **shadow-library hotspot extractor** (~300 lines, recursive) | Unlocks L4 and L5; does not exist in any language |
| 4 | Feed **measured angles, never part names** | "33°" is 26.5651°; names inject ~3 LDU per stud |
| 5 | Author the **part-property database** incrementally | Gates several hard-illegal rules; nothing else provides it |
| 6 | Re-source the corpus if LEGO publishes a current rule set | The 2006 deck is stale by its author's own statement |

**Connection to existing work in this repo.** The Brickie pipeline renders from `.mpd` with LDraw colour codes ([HANDOVER-brickie-generation-pipeline.md](HANDOVER-brickie-generation-pipeline.md)), so this corpus shares units and part vocabulary with it directly. The `LDConfig.ldr` colour analysis in that note and the geometry work here resolve against the same official library.

---

## 8. Addendum, 2026-08-22 — what building the verifier proved and disproved

The corpus above was assembled from sources. It has since been **implemented and measured against 1,464 real released LEGO sets** from the Official Model Repository, in the `ldraw-verify` repository. That exercise corrected this note in ways worth recording, because several claims here were confidently wrong.

**The headline finding survived and strengthened.** Collision detection really is the wrong primitive: the rules that carried their weight in practice were graph-theoretic and transform-level. Nothing in implementation argued for a geometry-first design.

**But most rules, as originally tiered, rejected almost every valid model.** On first measurement, six of ten implemented rules fired on essentially 100% of real released sets. The tool would have rejected virtually every legitimate build. The cause was consistent and is the most useful lesson here:

> **Several rules encoded a generator *convention* — how a well-behaved emitter ought to write a file — stated as though it were a property every valid model must have.**

Three concrete corrections:

- **"−Y is up, so a model built from a ground plane has y ≤ 0 throughout" is not a validity property.** A real model's origin is arbitrary. Measured: the `y > 0` clause fired on 11 of 24 real sets. Removed.
- **The grid quanta were wrong.** `y mod 4` and `x/z mod 10` reject mainstream first-party construction — a Technic hole axis sits at 10 LDU, which is not a multiple of 4, and ordinary SNOT placements land off the 10 LDU lattice constantly. The true invariant is the gcd of the system's own constants, **2 LDU**. Both rules were demoted to `DISCOURAGED` and re-sourced as derived (`S`), not first-party (`P1`).
- **Referencing a `~Moved to` alias is a cataloguing nit, not a build-legality defect.** Real sets do it in 96% of cases. Demoted.

**A rule cannot detect what this note implied it could.** `E-01` was described as catching a transposed (row-major/column-major) matrix — the commonest generator bug. It cannot, at any tolerance: for a rotation R, Rᵀ = R⁻¹ is itself orthonormal with determinant +1, so a transposed placement is a perfectly well-formed rotation, just the wrong one. Detecting it requires knowing the intended geometry, which a verifier reading one file does not have. The rule was renamed `MATRIX_WELL_FORMED` and the limitation recorded under `not_checkable`.

**Two research claims were independently reproduced from scratch**, which is the strongest evidence in this note:

- Shadow-library connectivity coverage: **15.3% reading each part's own file, 80.1% walking the full reference closure** — matching §3's cited 15.3%/81.1% almost exactly, derived independently.
- A 2×4 brick resolves to **8 stud and 8 anti-stud connection points** despite having no shadow file of its own, proving inheritance works.

**The oracle is weaker than §6.1 of the design claimed, for two reasons found in use.** First, the OMR mixes official-set reproductions with MOCs and alternative builds, and a fan design may legitimately contain illegal techniques — so a hit there is not automatically a false positive. Second, and more subtly, **the corpus spans decades while the rules are current**: `B-01`'s ban on studs in Technic pinholes is enforced by the BrickLink Designer Program today but was permitted when older sets shipped, so a hit on a vintage set may be a correct detection. Even a filtered subset is a *fan reproduction*, not LEGO's own CAD. Treat a residual rate as "false positive **or** reproduction artefact **or** period difference", never as ground truth.

**What the tool cannot do, measured rather than assumed.** It exits nonzero on ~97% of real sets, almost all at the advisory tier; gate on exit 1, which fires on ~25%. `B-06` renders a verdict on only a small fraction of real models, because the ~19% connectivity gap is permanent — the rest are honestly `unknown`. Full figures, sample sizes and per-rule notes live in the corpus file beside each rule.

**Rules changed over time is not a footnote — it is a design constraint.** §4's `C-*` series recorded it; implementation showed it determines whether a measured rate means anything at all.

## 9. Addendum, 2026-08-22 — what running the rules against the whole corpus proved

Section 8 recorded what building the verifier taught. This section records what
*running* it over all 1,464 OMR models taught, which is a different and harsher
test: §8 could still assume a rule meant what its statement said.

**`L-03` was a misreading and has been removed; the corpus is now 46 rules.**
`MULTI_STUD_INTO_TECHNIC_HOLES` was recorded as "never more than one stud into
Technic holes" — a budget of one. The source is making a different point: System
and Technic do not share an edge datum, so System studs driven into Technic
holes do not line up. That is a flat incompatibility, not an allowance. `B-01`
already states the ban flatly and is the rule kept.

What exposed it was building the exemplar pair. Authored to match the statement,
`L-03`'s *legal* twin — a single stud in a Technic hole — fired `B-01`. A flat
ban and a one-stud budget cannot both hold, and the contradiction was in the
corpus rather than the code. **A rule whose legal exemplar trips another rule is
reporting a corpus defect**, and is worth building for that reason alone.

**`B-01` as written had no true positives.** Over 1,464 models it produced 33
findings across 17 sets, and every one was a false positive. Three defects, all
the same shape: an edge carried a value describing *one side* of a connection
without recording which side, so the rule could not ask its actual question.

- *Which part owns the socket.* Asking "is either endpoint a Technic-hole part"
  conflates "has a hole somewhere" with "the hole is what is connected here".
  `caps=none` means an opening with no closed end, which describes a **hollow
  stud** and a round-brick barrel just as it describes a pinhole. Stacking a
  1×1 round brick on a Technic brick makes the round brick the socket; the rule
  blamed the Technic brick's pinhole, ten LDU from the connection. 32 of 33.
- *Which side the radius describes.* The radius fell back between sides, so a
  stud-sized reading could be the hole's. The 33rd finding was a wheel rim whose
  only male connector is its r=38 tyre seat, called a System stud on the
  strength of the pinhole's 6.
- *Evidence split across duplicate edges.* One physical connection can produce
  several edges — a pin in a hole yields three, of which one carries
  `slide=true`. A correctly seated pin therefore read as a stud in a pinhole.

After attributing each value to the side that supplied it, B-01 reports **0
findings across all 1,464 models** while still firing on its illegal exemplar.

**This changes how §6's "honest limits" should be read.** §8 warned that a
residual rate is "false positive **or** reproduction artefact **or** period
difference". B-01 shows a fourth reading that outranks all three: *the rule is
measuring the wrong thing*. Period difference was the plausible explanation here
— B-01 is a current BrickLink rule and the corpus spans decades, so hits on
vintage sets looked like correct detections of once-permitted technique. That
explanation was wrong, and it was comfortable enough to have stopped the
investigation. **Attribute the mechanism before attributing a rate to history.**

**Exemplar geometry cannot be verified by looking at it.** Sixteen of the
hand-authored fixtures were geometrically wrong in a way renders did not reveal:
parts placed at a plate's centre rather than on a stud float 14.1 LDU from any
connection point against a 1 LDU pairing tolerance, and look seated. The
method that works is to read the target part's hotspots, place the mating part
so its hotspot coincides in position *and* axis, then confirm the intended rule
fires. The last step is the gate — for rules whose violation *is* a
misplacement (`E-02`, `E-04`, the wedged part in `G-01`/`L-10`), an automated
"make it connect" pass silently destroys what the fixture exists to demonstrate.

**Duplicate connectivity edges were pervasive, not incidental.** 15.3% of all
edges described a connection already described by another edge. Collapsing them
cut edge count 16.7% while leaving components, coverage and every rule verdict
identical — the redundancy carried no information, but it did split evidence
across edges in a way that defeated at least one rule.

**A rule's tier has to come from its source's own force, not from how checkable
it is.** `B-07` was tiered HARD and implemented as a hard gate. Its source is
the BrickLink Designer Program's *Stability* guidance, which says bricks and
plates "should overlap whenever possible" and concedes in the same sentence
that building in stacks may have visual appeal, weighing that against the model
staying together. This corpus had escalated "should, wherever possible" into
"must". Nothing supports that: a stacked seam makes a wall weaker, never
unbuildable, unlike a stud forced into a pinhole. Demoted to DISCOURAGED, which
took 10 of 244 real sets out of the exit-1 gate — every one of them failed
solely for a bond the source explicitly permits as a trade.

The tell was available before implementation and was missed twice. This note's
own reference companion files the rule as `BDP_STABILITY`, quotes five
stability sentences of which only one is checkable, marks B-07 uncheckable in
its summary table while its prose gives a concrete predicate, and elsewhere
files seam staggering under aesthetic judgement. **A rule renamed away from its
source — `BDP_STABILITY` to `MASONRY_BOND` — loses the context that sets its
tier**, and renaming to whatever clause turned out to be computable is how a
recommendation quietly becomes a law.

**Two axes were doing one field's work.** Every rule carried a `tier` and
nothing else, so the corpus could not distinguish a claim about the physical
build from a claim about the file. `L-10` (a plate wedged between two studs)
and `E-06` (no BFC statements in a model file) are both rules an agent must
follow, but one is about LEGO and the other is about LDraw, and a violation of
each means something completely different — one build cannot exist, the other
renders fine and breaks a file convention. All 46 rules now carry
`domain: physical | file | submission`: 33, 11 and 2 respectively.

The split immediately exposed that **the tier definitions were only ever
written for physical rules.** `HARD` means "stresses or damages an element" —
not a test a malformed matrix can pass or fail, yet seven HARD rules are
file rules. Those tiers had been assigned by analogy the whole time.

It also turned up a third category that is neither: `B-09` (part count,
palette) and `D-04` (build complexity) are BrickLink Designer Program
*submission* rules. Outside that programme they do not apply, and violating one
gets a submission rejected rather than making a model wrong.

**A full tier audit is in `2026-08-22-rule-tier-audit.md`.** Its sharpest
finding: `T-04` and `T-05` are the same kind of thing — a geometric fact about a
part family — tiered LEGAL and HARD respectively. Neither can be violated. 30 of
46 rules are HARD in a corpus where HARD is supposed to mean an element gets
damaged, and the excess is concentrated in the derived `T-*` rules and in
statements that are facts rather than prohibitions. `LEGAL` turns out not to be
a severity at all but a permission, on a different axis, never defined in the
`tiers:` block despite four rules using it.
