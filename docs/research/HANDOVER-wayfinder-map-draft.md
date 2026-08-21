# Wayfinder map draft — Brickie generation pipeline

**Draft for review. Nothing here has been created.** Companion to [HANDOVER-brickie-generation-pipeline.md](HANDOVER-brickie-generation-pipeline.md).

**Where things go.** The map lives in **`emagineer-tech/emagineer-unity-client`**, because the destination — an on-device generation pipeline — lands there, and that is where the genuine fog is. The `emagineer-webservices` items are already-decided data and normalisation fixes; they are **plain work issues in that repo**, not map tickets, because wayfinder produces decisions and these have no decision left in them.

**Why so many pre-closed tickets.** Wayfinder charts fog, and the research has already removed most of it. A decision must live in a ticket, so settled findings are created, given a resolution comment, and closed immediately — which seeds *Decisions so far* with a real route. If they were left open as `wayfinder:research`, the charting pass would fire `/research` subagents at questions that are already answered.

---

## 1. The map issue

**Title:** `Brickie generation pipeline — on-device first`
**Label:** `wayfinder:map`

```markdown
## Destination

A Brickie generation pipeline that runs **on-device by default**, produces an approximate LEGO caricature that feels immediately recognisable, and sends nothing off the handset unless the user opts in. Reaching the end of this map means every decision below is resolved and the build can be specified without further charting.

## Notes

**Domain.** A photo (selfie or library pick) is analysed into the 15 slots of `brickie_schema.json`, normalised to LEGO parts and LDraw colour codes, and assembled into a Brickie. Lemojis are the digital-only sibling and share the pipeline. Server side lives in `emagineer-tech/emagineer-webservices`; the schema, the `Normalize` maps and the hosted tiers are there.

**Standing constraints.**
- Privacy is paramount. On-device is the default; our hosted service is the second tier, third-party a third, all opt-in. A remote fallback exists for incapable devices.
- This is a **children's product**. See "The ZDR and under-13 position" — it may constrain the option space more than any technical finding.
- Latency ceiling is **10 seconds**, single-shot with a progress state. No frame-rate budget.
- The bar is **approximate caricature with reasonable accuracy**, not photorealism or correct classification.
- Cost is not the driver.

**Read first.** `docs/research/HANDOVER-brickie-generation-pipeline.md` — the consolidated research this map is built on. Every closed ticket below points into it by section.

**Skills every session should consult.** `/grilling` and `/domain-modeling` per the wayfinder default. GitNexus impact analysis before editing any symbol, per `AGENTS.md`.

**Related work in another repo.** The already-decided schema, palette and normalisation fixes are tracked as plain issues in `emagineer-tech/emagineer-webservices` under the label `brickie-pipeline`. They are prerequisites, not steps on this route.

## Decisions so far

- **Which slots actually carry recognisability** — four of fifteen do; the other nine are furniture and deliberate defaults are correct for them. §2
- **Whether colour quantisation needs a model** — it does not; classical CV covers nine of the fifteen slots exactly. §4.3
- **Whether an on-device VLM can meet the 10-second ceiling** — it cannot, by roughly 2×, and the cost is in the vision stage where prompting cannot help. §4.4
- **How far the colour palette can expand, and to what** — to the full LEGO range; the specific additions are named and every gap closes. §3.1–§3.3
- **How many distinct hair silhouettes the catalogue really has** — twelve, not forty-three, which is what makes on-device classification tractable. §3.4
- **Which public datasets and checkpoints we can legally ship** — almost none; the recommended path avoids them entirely. §4.6
- **What leaves the device in the hosted tiers** — a background-removed crop, never the original photograph. §4.7
- **Whether per-slot accuracy is the right quality metric** — it is not; recognisability is. §6

## Out of scope

_(empty — nothing ruled out yet)_

## Not yet specified

- How the Lemoji catalogue differs from the Brickie one, and whether that changes the shared pipeline. Depends on "Lemoji-first as a de-risking route".
- Whether the pipeline should eventually generate parts rather than select them.
- Anything about physical fulfilment beyond the digital-versus-buildable question below.
```

---

## 2. Pre-resolved tickets — create, comment, close

Each of these is created as a child of the map with label `wayfinder:task`, given its resolution as a comment, then closed. Body format is `Part of #<map>` followed by the question.

| Title | Question in the body | Resolution comment (gist) |
|---|---|---|
| **Which slots actually carry recognisability** | All fifteen slots currently receive equal engineering attention. Do they contribute equally to a Brickie feeling like the user? | No. The outer hairline dominates identification, and internal geometry is fixed by the medium. Tier A is `hair_style`, `hair_color`, `skin_color`, `head`; Tier B is `body_color` and `head_accessory`; the remaining nine are Tier C furniture, largely unobservable in a selfie, where a stable deliberate default beats a guess. Effort should be roughly inverse to the current uniform treatment. Detail: handover §2. |
| **Whether colour quantisation needs a model** | Nine of fifteen slots are colours. Should a model produce them? | No. Segment region → trim luminance outliers → cluster in CIELAB → nearest palette entry. Deterministic, microseconds, offline, no licence exposure. `_color_2`/`_color_3` are defined as "2nd/3rd most visible", which is k-means ordered by cluster mass — the schema is already shaped for the classical algorithm. An LLM naming hex codes from a list is close to the worst available tool here. Detail: handover §4.3. |
| **Whether an on-device VLM can meet the 10-second ceiling** | A single VLM could fill the whole schema. Can one run on-device inside 10 s? | No, by roughly 2×. A published OnePlus 13R study measured ~21 s end-to-end for the fastest 3B-class VLM, of which ~14 s was visual preprocessing — so shorter prompts and constrained decoding do not help. With a 1–2 GB download and low-end Android OOM it fails on three axes. Revisit only when a framework uses the NPU for the vision encoder; the same study found the GPU at 0% busy. Detail: handover §4.4. |
| **How far the colour palette can expand, and to what** | The current palettes are 23/28/31 hand-picked entries and miss common real-world colours. What is actually available? | The full LEGO range — 85 usable plain solids from `LDConfig.ldr`. Eight garment additions and five hair additions collapse every serious mismatch from ΔE 30–44 down to 7–17, and `Dark_Orange` (CODE 484) solves the redhead problem outright. A 12-step official nougat ladder replaces the skin auto-match set. Three current `skin_color` hexes are not official LDraw colours at all, which is the root cause of the known `#CCA373` mapping gap. Detail: handover §3.1–§3.3. Work tracked in webservices. |
| **How many distinct hair silhouettes the catalogue really has** | `hair_style` has 43 values. Does the pipeline need to distinguish all of them? | No — they collapse to 12 silhouette families, with bob and short-forward-fringe accounting for 20 of the 43. Nobody perceives the difference between `short_forward_fringe_left_curl` and `short_forward_fringe_left`; everybody perceives `bob` versus `slicked_back`. A 12-way decision from a binary hair mask is tractable on-device where a 43-way one is not. Get the family right, pick a representative within it for v1. Detail: handover §3.4. |
| **Which public datasets and checkpoints we can legally ship** | Can we use the standard face/human parsing models? | Almost none. CelebA, CelebAMask-HQ, LaPa, FaceSynthetics, Meta Sapiens and LIP are all non-commercial research only, and CelebA extends its restriction to "derived data", which reads onto weights. The clothing side is worse because the tags mislead — the most-downloaded clothing segmenter declares a permissive licence over a dataset with no licence field at all. Read the `datasets:` field before the `license:` field. This does not constrain the recommended path: MediaPipe, DINOv2 and SigLIP are Apache-2.0, and training on renders of our own parts avoids the question entirely. Detail: handover §4.6. |
| **What leaves the device in the hosted tiers** | When a user opts into hosted or third-party processing, what do we send? | A background-removed hair or torso crop, never the original photograph. A silhouette model does not need a picture of a child's face, and the masks are already computed on-device so the crop is free. This is a materially smaller disclosure to defend, and it matters more than usual given COPPA's treatment of facial templates. Detail: handover §4.7. |
| **Whether per-slot accuracy is the right quality metric** | How do we tell whether a change improved anything? | Not by per-slot accuracy — it would mark down an instantly-recognisable Brickie for the wrong trousers, and mark up an unrecognisable one for getting nine Tier C slots right. Measure recognisability directly. The design of that measurement is still open; see "Design the recognisability measurement". Detail: handover §6. |

---

## 3. Open tickets — the actual frontier

| # | Title | Type | Body |
|---|---|---|---|
| 1 | **The ZDR and under-13 position** | `wayfinder:task` | OpenAI's Under-18 API guidance says we should not process personal data of children under 13, or under the applicable age of digital consent, without zero data retention. ZDR requires prior approval and additional terms. Separately, the amended COPPA Rule (enforceable 22 April 2026) treats facial templates as personal information and requires separate parental consent for third-party disclosure absent an "integral to the service" argument. **Do we hold ZDR? Does the exemption apply?** Needs a qualified answer, not a technical one. This may constrain the option space more than any other ticket — resolve it first. Handover §5. |
| 2 | **Design the recognisability measurement** | `wayfinder:prototype` | Nothing downstream is falsifiable without this. Proposal: a pick-me-out test — show a user their Brickie alongside four generated from other people, and see whether their friend can pick it. Measures the product goal directly, needs no labelled corpus, improves as the catalogue grows, and works as an in-app mechanic rather than a chore. Decide the design, what signal we keep, and whether a 1–5 "does this look like you?" runs alongside it. Handover §6. |
| 3 | **Which silhouette approach** | `wayfinder:prototype` | Three viable options: geometric descriptors from the hair mask (ship-first, near-zero cost), a classifier trained on renders of our own parts (the target — we own the assets, and Hairmony reached 87.6% on this exact task trained on synthetic renders alone), or embedding retrieval over part thumbnails (best scaling — one index row per new part — but a real render-to-photo domain gap). **Run the experiment before committing**: descriptors on a handful of photos, and a retrieval top-1/top-5 measurement. A few days. Handover §4.4. |
| 4 | **Digital-only or physically buildable** | `wayfinder:grilling` | If Brickies render from `.mpd` with colour codes rewritten, any LDraw colour is free and the palette expansion is unconstrained. If a Brickie should be physically buildable, a colour only counts when that specific part is actually moulded in it — a far tighter constraint that varies part by part. Decide explicitly what we are promising, because it bounds the colour work and the parts roadmap. Handover §9. |
| 5 | **Factor the hair_style vocabulary, or keep it flat** | `wayfinder:grilling` | 43 flat values that collapse to 12 families. Hairmony's taxonomy is factored instead — gathered × length × texture, per scalp region. A factored vocabulary is easier to cover with parts, easier to classify, and easier to extend. Changing it affects what gets commissioned and how the classifier is shaped, so decide before ordering parts. Handover §3.4, §4.4. |
| 6 | **Which ML runtime, and what app-size budget** | `wayfinder:task` | OS-native only (Vision / ML Kit, ships no weights), Unity Sentis (first-party, ingests LiteRT so MediaPipe drops in, several-second cold start to warm off the critical path), or `onnxruntime-unity` (better op coverage, NPU access). They compose. Recommended stack is ~15 MB. Decide the runtime and the size budget. Handover §4.1–§4.2. |
| 7 | **Tier and consent UX** | `wayfinder:grilling` | How the on-device default, the hosted opt-in, the third-party opt-in and the incapable-device fallback are presented, remembered and revoked. "Better results if you let us process this on our server" is a fair offer only if the default is genuinely on-device and the choice is reversible. Interacts with the ZDR ticket. Handover §4.7, §5. |
| 8 | **Parts roadmap priority** | `wayfinder:task` | The hair catalogue has no ponytail, bun, braid, updo, dreadlocks, twists, afro or coily option, and effectively no long hair; a single `curly` covers every texture. No model fixes this, and it caps recognisability at zero for affected users. Proposed order by users-unlocked per part: textured/coily (2–3 volumes), tied-back (ponytail, bun), long loose (2–3 lengths), braids and locs. Lead-time-bound, so start it in parallel with everything else. Handover §3.6. |
| 9 | **Lemoji-first as a de-risking route** | `wayfinder:grilling` | Lemoji parts are meshes rather than moulded bricks, so the coverage gaps above are far cheaper to close there. Proving the pipeline on Lemojis while Brickie parts are commissioned is a plausible sequencing tactic. Needs someone who knows the Lemoji catalogue — it has not been examined. Handover §D7, §9. |
| 10 | **What happens to the 42 unreachable parts** | `wayfinder:task` | The Unity catalogue is larger than the enums — 67 hair pieces vs 43, 44 torsos vs 30, 54 heads vs 50. 42 parts can be picked manually but never generated. Extend the enums, or accept manual-pick-only? Note that embedding retrieval would close this by construction, so this interacts with "Which silhouette approach". Handover §3.7. |

**Suggested frontier order.** *The ZDR and under-13 position* first — it is a phone call and it may constrain everything. Then *Design the recognisability measurement*, because nothing else is falsifiable without it. Then *Which silhouette approach* and *Digital-only or physically buildable* in parallel. *Parts roadmap priority* should start immediately regardless, being lead-time-bound.

---

## 4. Plain work issues — not map tickets

Already decided. Label `brickie-pipeline` in each repo.

**`emagineer-tech/emagineer-webservices`** — W1–W13 in handover §7: the eight garment colours, five hair colours, the nougat ladder, the three non-LDraw hexes, `teeth_square_glasse`, the `facial_hair_color` `n/a` fix, the `head_accessory.confidence` description, dress consistency in `Normalize`, CIEDE2000 matching, strict Structured Outputs, provider recording, the `confidence` column, and the `head` legality map.

**`emagineer-tech/emagineer-unity-client`** — U1–U4 in handover §7: client-side resize before `EncodeToJPG(60)`, the missing skin colour codes in `BrickieColorVariantsConfig`, the one-sided `head_accessory_color_2/_3` contract, and a CI check diffing schema enums against the Unity catalogue.

That last one is the compounding item — five of the six drift faults exist because a JSON file and a Unity catalogue are kept in sync by hand.

---

## 5. Creating it

Both repos use GitHub via `gh`, per their `docs/agents/issue-tracker.md`. Order matters: the map needs an id before children can reference it, and blocking edges are wired in a second pass.

1. Copy `HANDOVER-brickie-generation-pipeline.md` into `emagineer-unity-client/docs/research/` on a branch, and the schema-specific sections into `emagineer-webservices` too. PR both.
2. Create the map issue with `wayfinder:map` and the body from §1.
3. Create the eight pre-resolved tickets as sub-issues, comment each resolution, close each.
4. Create the ten open tickets as sub-issues, then wire blocking in a second pass.
5. Fill *Decisions so far* with links to the closed tickets, referring to each by name.
6. Create the work issues in both repos under `brickie-pipeline`.

Then `cd` into `emagineer-unity-client` and invoke `/wayfinder` with the map URL to start working the frontier.
