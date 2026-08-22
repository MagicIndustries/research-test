# Test corpora for `ldraw-verify` — design and assembly protocol

**Date:** 2026-08-22 · **Status:** approved, not yet assembled · **Scope:** phase 1 (verifier corpora) only

Companion to [`2026-08-21-ldraw-verifier-design.md`](2026-08-21-ldraw-verifier-design.md) and the corpus at [`../../research/lego-build-rules.yaml`](../../research/lego-build-rules.yaml).

---

## 1. Why this is the bottleneck

`ldraw-verify` implements **11** of the corpus's rules. **31 more have no predicate.** Not because they are hard to write — because none of them has a labelled example to write a test against. The tool was built test-first throughout; without exemplars, the remaining rules cannot be built at all.

The measurement phase also established that the corpus we do have is a weak oracle, in three separate ways:

- The 1,464 OMR models mix **official-set reproductions with MOCs and alternative builds**. A fan design may legitimately contain an illegal technique, so a violation there is not automatically a false positive.
- The corpus **spans decades while the rules are current**. `B-01`'s ban on studs in Technic pinholes is enforced today but was permitted when older sets shipped — a hit on a vintage set may be a correct detection.
- Even a filtered subset consists of **fan reproductions, not LEGO's own CAD**. A careful reproduction can still differ from what LEGO built.

So a residual rate today means "false positive **or** reproduction artefact **or** period difference". This document is how that becomes three separable things.

---

## 2. Four corpora, four jobs

| Corpus | Job | Size | Provenance | Proves |
|---|---|---|---|---|
| **CANON** | Authoritative illegal exemplars | ~16 pairs | Authored from the Berard 2006 deck | A rule detects the technique at all |
| **INJECTED** | The same violations in realistic context | ~300 | Generated: GOLD + one mutation | Detection survives among legal noise |
| **GOLD** | Verified-faithful official reproductions | 40–80 | OMR, inventory-checked + hand-verified core | A HARD hit here is a genuine false positive |
| **WILD** | Regression and performance | 1,464 | The existing OMR pull, unfiltered | Nothing breaks at scale. **Never an oracle.** |

The split matters because each answers a question the others cannot. CANON gives recall with certainty and no realism. INJECTED gives recall with realism and a certain label. GOLD gives precision with a defensible label. WILD gives coverage with no label at all — and the current tool's numbers come from WILD, which is why they are a lower bound rather than a measurement.

---

## 3. CANON — reproducing the Berard deck

The 2006 presentation *Stressing the Elements* is the only substantial primary document on illegal technique, and it shows each case as a render. Rebuilding each render as a minimal LDraw model produces the closest thing to a first-party labelled set that can exist.

### 3.1 What to build

One **pair** per technique: an `illegal/` model containing exactly one violation, and a `legal/` near-twin differing in exactly one meaningful respect. The near-twin is the more valuable half — it is what distinguishes a rule that reasons about the right thing from one that pattern-matches on shape.

| Rule | Technique | Near-twin differs by |
|---|---|---|
| `L-01` | System side-stud meeting a Technic hole | Using a matched System-to-System connection |
| `L-02` | A stud in a Technic hole, bridged at both ends | Removing the second attachment |
| `L-03` | More than one stud into Technic holes | Reducing to a single stud |
| `L-04` | A Technic pin not seated in its detent | Seating it |
| `L-05` | A pin forced into a non-Technic bore | Using a real pinhole |
| `L-06` | An element press-fitted with no travel stop | A part with a stop |
| `L-07` | A click hinge set off its 22.5° detent | On-detent |
| `L-08` | Polycarbonate sliding against polycarbonate | One side in ABS |
| `L-09` | A connector into a smaller receiver | Matched sizes |
| `L-10` | A **plate** wedged edge-on between studs | The identical geometry with a **tile** (`G-01`) |
| `L-12` | Technic half-beam with a System plate | Full beam |
| `B-01` | A System stud in a Technic pinhole | Stud into an anti-stud |
| `B-02` | A rigid part bent | A flex part bent |
| `B-03` | A part placed against a stud's logo face | Adequate clearance |
| `B-04` | An assembly that cannot be taken apart | Separable equivalent |
| `B-07` | Courses with coincident vertical seams | Running bond |

`L-10`/`G-01` is the canonical pair and should be built first. The two are **geometrically indistinguishable in LDraw** — only part class separates them. A rule that fails both is not reasoning, it is matching shapes.

### 3.2 Construction rules

- **Minimal.** As few parts as make the technique unambiguous — typically 2–6. A reviewer must be able to verify correctness by reading the file.
- **Real parts only**, resolving in the official library. No invented numbers.
- **Exactly one violation** per illegal model. Two violations make a failure ambiguous.
- **CRLF** line endings, per the LDraw specification.
- A `0 // WHY:` comment stating the technique, the rule id, and the deck slide it derives from.
- The pair shares a filename stem: `l10-plate-between-studs.ldr` in both `illegal/` and `legal/`.

### 3.3 Acceptance

A pair is done when the illegal model produces a `fail` for its rule and the legal twin does not — **and** when reverting the rule's predicate makes the illegal case pass. An exemplar that passes against a gutted rule is decoration.

Several of these will be unbuildable until their rule's dependencies exist — `L-05`, `L-06` and `L-08` need a part-property table (bore classes, travel stops, materials) that LDraw does not provide. Build the exemplar anyway and leave the rule `unimplemented`; the exemplar is what makes the missing table concrete.

---

## 4. GOLD — verified official reproductions

### 4.1 Automated inventory cross-check

You already hold Rebrickable set inventories in `emagineer-webservices` (`Lego::SetInventory`, `SetInventoryItem`, `Part`). That makes a real fidelity test possible: **does this model use the parts the set actually contains?**

1. Extract every type-1 reference from the MPD, resolving submodels, producing a `(part_id, colour_code, count)` multiset.
2. **Normalise identifiers.** LDraw and BrickLink numbering usually coincide but not always — LDraw `3070b` is BrickLink `3070`. Each official part file records its BrickLink id in a `0 !KEYWORDS BrickLink <id>` line; use that where present, and record every part where it is absent as an unresolved mapping rather than guessing.
3. Resolve `~Moved to` aliases to their targets before comparing, or an alias-heavy reproduction reads as using the wrong parts.
4. Map LDraw colour codes to the inventory's colour vocabulary via `LDConfig.ldr`.
5. Compare against the set inventory, computing a **fidelity score**: the proportion of inventory parts present at the correct count.

**Tolerances.** Accept these without penalty, because they are properties of reproduction rather than infidelity:

- **Spare parts** — inventories list them; models rarely include them.
- **Mould variants** — the same part in a different mould generation.
- **Printed and sticker parts** — often substituted with the unprinted equivalent.
- **Assembly shortcuts** — a pre-assembled element modelled as its components, or vice versa.

**Penalise** a missing structural part, a part not in the inventory at all, or a count deviation beyond the spare allowance.

### 4.2 Hand-verification protocol

The automated check tells you a model uses the right parts. It cannot tell you they are in the right *places*. A model can score 100% on inventory and still be a poor reproduction. The hand-verified core exists to prove the automated check is sound — and to be the thing you trust when the two disagree.

**Per model, in this order:**

1. **Establish the reference.** Obtain the official instructions for the set (LEGO's own instruction archive, or Rebrickable). Note the release year and total part count. *(2 min)*

2. **Reject early on disqualifiers.** Before spending time, check for:
   - `MOC`, `alternate`, `alternative`, `B-model` in the header, filename or description
   - unofficial or custom part references
   - `0 !LDCAD GENERATED` blocks — flex-path geometry, which caused genuine `E-01` false positives and makes part accounting unreliable
   - a part count deviating from the inventory by more than ~5%
   
   Any of these disqualifies the model from GOLD. Record the reason; it stays in WILD. *(3 min)*

3. **Compare the silhouette.** Render the model and compare against the set's box art or instruction cover from three angles. You are looking for structural divergence — a missing sub-assembly, wrong proportions — not detail. *(5 min)*

4. **Walk three instruction steps.** Pick the first step, a middle step, and the last. For each, locate the corresponding parts in the model and confirm they are placed as the instructions show. This is the step that catches a model built to *look* right by a different construction. *(10–20 min)*

5. **Check submodel structure.** A faithful reproduction usually mirrors the instruction booklet's sub-assemblies as `0 FILE` blocks. A model that is one flat block for a set with distinct sub-assemblies is a reproduction shortcut — not disqualifying, but record it, because it changes what connectivity checks see. *(3 min)*

6. **Record the verdict** in the manifest: `gold`, `gold-with-notes`, or `rejected`, plus the reason, the reviewer, and the date. Never overwrite a previous verdict — append.

**Expected time:** 20–30 minutes for a small set, 45–90 for a medium one.

**Do not hand-verify large sets.** A 5,000-part model cannot be meaningfully checked this way; step 4 alone would take a day and steps 3 and 5 tell you little. Large sets enter GOLD on the automated check alone, flagged as `gold-automated`, and any HARD finding against one is investigated individually rather than counted as a false positive.

### 4.3 Selection matrix — what kind and size of sets

Choose for **coverage of the properties the rules actually exercise**, not for variety's sake. Every model below is confirmed present in the current corpus, with its real part count.

**By size** — part counts span nearly three orders of magnitude, and behaviour differs across that range:

| Band | Parts | Why it matters | Confirmed candidates |
|---|---|---|---|
| Tiny | < 50 | Single-block files with no `0 FILE` at all — exercises the fallback path | `7276-1` (6), `7274-1` (7), `7278-1` |
| Small | 50–300 | Hand-verifiable end to end; the workhorse of the core | `1210-2` (135), `850-1` (216), `41588-1` (241), `7903-1` (270) |
| Medium | 300–1,500 | Submodel nesting becomes real | `10001-1` (872), `8448-1` (1,331), `8880-1` (1,366) |
| Large | 1,500–5,000 | `B-06` component logic and performance | `10182-1` (2,183), `10179-1` (4,545), `42055-1` (4,385) |
| Huge | > 5,000 | Performance ceiling only | `10276-1` (5,433) |

**By era** — because the rules are current and the corpus is not. Aim for at least five models per band:

| Band | Why | Confirmed candidate |
|---|---|---|
| Pre-1985 | Predates most modern rules entirely; `B-01`-class techniques were permitted | `850-1` (1977) |
| 1985–1999 | Technic maturity; the era `B-01` findings cluster in | `8880-1` (1994) |
| 2000–2009 | Modern System; the Berard deck's own period | `10182-1`, `10001-1`, `7903-1` |
| 2010–2019 | Current rules substantially in force | `42055-1`, `41588-1` |
| 2020+ | Fully current | `10276-1` |

**By technique class** — this is the dimension that actually exercises distinct code paths:

| Class | Exercises | Confirmed candidate |
|---|---|---|
| Pure System | Baseline; grid rules with no confounders | `1210-2` |
| Technic-heavy | `B-01`, `L-01`–`L-05`, pin and axle connectivity | `8880-1`, `42055-1` |
| SNOT / modular | `E-02`, `E-04` grid rules, bracket offsets | `10182-1` |
| Curved and sloped | `E-01` tolerance, elliptical slopes, near-miss angles | `10179-1` |
| Minifigure-heavy | Clip and bar connections — the known `SNAP_CLP` gap | `41588-1` |
| Hinged / articulated | `B-05` rotation, hinge detents | `8448-1` |
| **Flex-path** | `0 !LDCAD GENERATED` geometry — **excluded from GOLD**, kept in WILD as a known hazard | **200 models, 13.7% of the corpus** — full inventory in [`../../research/2026-08-22-flex-path-inventory.md`](../../research/2026-08-22-flex-path-inventory.md). Worst: `8466-1` (1,327 parts, 311,435 lines) |

That last row is worth its own note, and it is larger than it first appeared. A full scan found **200 models — 13.7% of the corpus — carrying 1,008 generated blocks and 680,623 inline polygons**: 887 `PATH` configurations (hoses, cables, chains) and 108 `SPRING`. LDCad writes this geometry as *fallback* content and regenerates it whenever endpoints move, so it is a snapshot rather than the model. It is raw polygons with no part identity, invisible to every rule the tool has, and it breaks the inventory cross-check in §4.1 because a hose modelled this way contributes no type-1 references. Excluding 200 models is a real cut to GOLD's size and is taken deliberately: the oracle argument requires that what the verifier sees is what the builder built, and here it is not. Full inventory and reasoning in [`../../research/2026-08-22-flex-path-inventory.md`](../../research/2026-08-22-flex-path-inventory.md).

**Target composition for the hand-verified core: 20 models.** Five tiny-to-small per era band across the three oldest bands, weighted toward small sets so the work is finishable, with at least one from each technique class. That is roughly 12–15 hours of verification — enough to calibrate the automated check without becoming the project.

---

## 5. INJECTED — mutation corpus

Take a GOLD model, apply exactly one mutation, record precisely what changed. The label is certain because we created it, and the context is real because the host model is.

**One mutation operator per rule**, each the minimal edit that introduces the violation:

- `B-01` — retarget a stud connection onto a Technic pinhole
- `B-05` — apply a sub-detent yaw to a single-stud, non-symmetric part
- `B-06` — translate one sub-assembly out of contact
- `E-01` — transpose or shear a placement matrix
- `E-03` — rewrite a top-level colour to 16
- `E-05` — move content before the first `0 FILE`
- `E-07` — substitute a current part with its deprecated alias
- `E-08` — replace a part number with one that does not resolve
- `E-10` — corrupt a line's token count

**Each injection records** the host set, the operator, the exact line changed, the before and after, and the expected rule id. **Acceptance: the verifier must detect every injection.** An undetected injection is a recall gap, reported rather than removed.

Generate roughly 300 — enough that per-rule recall has a meaningful denominator, few enough to run in CI.

**Do not inject into WILD models.** The host must be GOLD, or a "missed" injection may be a model that was already violating.

---

## 6. Manifest, not models

OMR files carry their own licences and injected variants are derivative works. So:

- The repository holds **`corpus-manifest.json`** — per model: set number, source URL, content hash, size band, era band, technique classes, GOLD verdict with reviewer and date, and rejection reason where applicable.
- The models live in `.cache/`, fetched and hash-verified against the manifest.
- CANON models are **authored by us**, so they are committed — they are the only corpus that lives in the repo.
- INJECTED models are **generated on demand** from GOLD plus the recorded operator, never stored. The recipe is the artefact.

This is the boundary that kept the CC BY-SA shadow library clean, applied again.

---

## 7. Sequencing

1. **CANON `L-10`/`G-01` first.** One pair, and it unblocks the rule the whole corpus flagged as the hardest discrimination.
2. **The remaining CANON pairs**, in rule-id order. Each unblocks one of the 31.
3. **The automated inventory cross-check**, run across all 1,464 to produce candidate GOLD.
4. **Hand-verify the 20-model core**, using it to calibrate the cross-check's tolerances.
5. **INJECTED**, once GOLD exists to host it.
6. **Re-measure precision against GOLD alone**, era-filtered. This is the first number in the project that will mean what it says.

---

## 8. Open questions

- **Where GOLD's era data comes from.** Set release year is in the Rebrickable data; confirm it is populated for the sets in the corpus before relying on the era bands.
- **Whether `0 !KEYWORDS BrickLink` coverage is high enough** for the identifier normalisation in §4.1 to work across the whole library, or whether a fallback mapping is needed.
- **Who does the hand-verification.** 12–15 hours is small for a team and large for one person; the protocol assumes a single consistent reviewer, and two reviewers would need a calibration pass on the same three models first.
- **Whether phase 2 (Brickie) needs GOLD at all.** Brickie composes pre-made assemblies into fixed slots rather than inventing geometry, so its failure modes are format and composition, not technique legality. It may need only CANON plus a slot-composition corpus of its own — worth deciding before assembling anything for it.
