# Brickie generation pipeline — research handover

**Status:** consolidated handover, 2026-08-20. Supersedes all other notes in this directory.
**Scope:** replacing the OpenAI call in Brickie generation with an on-device-first pipeline, and what the schema itself is costing.
**Repos affected:** `emagineer-unity-client` (pipeline, parts, measurement), `emagineer-webservices` (schema, palettes, normalisation, hosted tiers).

**How to read this.** §1–§6 are findings and recommendations. §7 lists work that is **already decided** — plain work issues, split by repo. §8 lists the **open decisions** — these are the wayfinder tickets. §9 states what is not verified, including by me.

**Provenance of claims.** Schema analysis (§3) is computed directly from `app/assets/javascripts/brickie_schema.json` and the authoritative LDraw `LDConfig.ldr`. Model sizes are measured from Google's model CDN. Latency and licence claims are from primary vendor documentation. **No claim about comparative accuracy on real Brickie selfies is verified — no eval harness exists (§6).**

---

## 1. Operating conditions

A commercial mobile app, not a game. Unity is the platform because parts of the app work in 3D space. **No frame-rate budget**; the latency ceiling is **10 seconds** on a single-shot flow — the user captures or picks a photo, then waits on a progress state.

**Privacy is paramount.** On-device is the default. Own hosted service is an acceptable second tier, third-party API a third, and there must be a remote fallback for devices that can't run the pipeline. This is a children's product, which raises the stakes considerably (§5).

**The goal is an approximate LEGO caricature that feels immediately recognisable** — not a correct classification, and not photorealism. The audience understands both the limits of representation in bricks and that the product is early. Parts are colourisable and more are being commissioned.

**Input reality:** the client currently encodes with `EncodeToJPG(60)` and **no resize**, base64'd inline. That's a full-sensor image, plausibly 8–12 MP.

---

## 2. Recognisability is carried by four slots, not fifteen

The face-perception literature is consistent that the outer hairline provides "a powerful frame of reference for the perceptual assessment of individuals' appearances", and that internal and external features are encoded holistically. In a minifig — where internal facial geometry is fixed by the medium — **the hair silhouette does most of the identification work.**

| Tier | Slots | Why |
|---|---|---|
| **A — identity** | `hair_style`, `hair_color`, `skin_color`, `head` | Carries "that's me". Get these right or nothing else matters. |
| **B — context** | `body_color`, `head_accessory` + colour | Noticed, adds to likeness, cheap to get roughly right. |
| **C — furniture** | `body`, `legs`, `legs_color`×3, `body_color_2/_3` | Largely unobservable in a selfie. Deliberate defaults are the correct answer. |

**Nine of fifteen slots are Tier C.** Engineering effort should be roughly inverse to the current uniform treatment.

**A free lever worth trying: modest caricature exaggeration.** Exaggerating distinctive deviations from the population mean *improves* recognition — reported verification gains around 30% for unfamiliar faces — but reverses above a certain rate. So push an unusually light or dark attribute **one step** toward the extreme rather than taking the nearest palette match. It suits LEGO, which is already a saturated, exaggerated medium. Treat as a hypothesis to A/B once §6 exists.

**On unobservable slots:** a stable, well-chosen default beats a guess, and not only for correctness. If the model invents leg colours, the same child regenerating gets different trousers each time for no perceptible reason, which reads as the product being broken. Make `legs_visible` explicit and let the client decide.

---

## 3. What the schema itself is costing

All computed from the schema file and `LDConfig.ldr` (191 defined colours; **85 usable plain solids** after excluding transparent, chrome, pearlescent, rubber, metallic and glitter finishes, plus LDraw's two meta-colours `CODE 16` Main_Colour and `CODE 24` Edge_Colour, which are not real part colours).

### 3.1 Garment palette — eight colours to add

The 23-entry `body_color` / `legs_color` palette lacks most common clothing colours. ΔE is CIE76 in Lab against the real-world colour.

| Real colour | Current best | ΔE now | Add | ΔE after |
|---|---|---|---|---|
| maroon | `#F06D61` Salmon | 43.9 | **CODE 320 `Dark_Red` `#720012`** | 15.7 |
| mid brown | `#8A928D` Light Grey | 35.4 | **CODE 86 `Medium_Brown` `#7B5D41`** | **7.8** |
| forest green | `#1B2A34` Black | 35.2 | **CODE 288 `Dark_Green` `#00451A`** | **7.8** |
| olive / khaki | `#8A928D` Light Grey | 30.4 | **CODE 330 `Olive_Green` `#77774E`** | **6.9** |
| purple | `#1E5AA8` Blue | 31.0 | **CODE 22 `Purple` `#671F81`** | 16.7 |
| tan / beige | `#C8C8C8` | 28.6 | **CODE 19 `Tan` `#B0A06F`** | **8.3** |
| dusty pink | `#8A928D` Light Grey | 27.2 | CODE 13 `Pink` `#F6A9BB` | 17.6 |
| teal | `#8A928D` Light Grey | 25.0 | CODE 378 `Sand_Green` `#708E7C` | 19.4 |

**Genuine limits that remain.** Mustard doesn't improve — LEGO has no true mustard. Denim blue stays around ΔE 18; there is no denim in the range. Purple and maroon improve a lot but stay mid-teens, because LEGO's versions are more saturated than the real garment colours. Garment colour is Tier B, so these are acceptable.

**`#1B2A34` is LEGO Black (`CODE 0`).** A very dark desaturated blue rather than `#000000`, but it is the correct answer for black clothing, and black/charcoal/navy already match well at ΔE 10–12.

**Matching algorithm.** Use **CIEDE2000**, not CIE76. Keep a hue-family guard for the dark, low-chroma region where Lab distance misbehaves (it is what sends forest green to black on the current sparse palette). With the additions above the palette is dense enough that plain nearest-neighbour largely behaves, so the guard is a refinement rather than the primary fix.

### 3.2 Skin — adopt the official nougat ladder

The LEGO range has a clean, evenly-spaced skin ramp. Use this as the **automatic-match set**:

| CODE | Name | Hex | L\* |
|---|---|---|---|
| 78 | `Light_Nougat` | `#FFC995` | 84.6 |
| 68 | `Very_Light_Orange` | `#FDC383` | 82.7 |
| 100 | `Light_Salmon` | `#F9B7A5` | 80.0 |
| 125 | `Light_Orange` | `#F9A777` | 75.5 |
| 509 | `Fabuland_Orange` | `#CF8A47` | 63.3 |
| 92 | `Nougat` | `#BB805A` | 58.7 |
| 84 | `Medium_Nougat` | `#AA7D55` | 56.0 |
| 128 | `Dark_Nougat` | `#AD6140` | 49.3 |
| 86 | `Medium_Brown` | `#7B5D41` | 41.9 |
| 484 | `Dark_Orange` | `#91501C` | 41.0 |
| 70 | `Reddish_Brown` | `#5F3109` | 25.7 |
| 6 | `Brown` | `#543324` | 24.9 |

Keep the current stylistic entries — LEGO yellow `#FAC80A`, white, the greys, the bright oranges, the pinks — as **user-selectable choices only**. Today they are reachable by automatic matching, which is how a pale user under a bright window lands on white and a warm-lit user on bright orange.

**Three `skin_color` hexes are not official LDraw colours** and therefore cannot map to a `CODE N`: `#D7BA8C`, `#CCA373`, `#C65127`. This is the root cause of the known `#CCA373` gap in the server's `SKIN_COLORS` map — there is no official colour to map it to — and two more instances of the same fault. Drop all three in favour of the ladder above.

### 3.3 Hair — five colours to add; ginger is solved

Only 7 of the current 28 `hair_color` entries are natural.

| Real hair | Current best | ΔE now | Add | ΔE after |
|---|---|---|---|---|
| ginger / auburn | `#764D3B` brown | 17.6 | **CODE 484 `Dark_Orange` `#91501C`** | **8.9** |
| copper red | `#764D3B` brown | 30.1 | **CODE 128 `Dark_Nougat` `#AD6140`** | **11.0** |
| dark brown | `#1B2A34` black | 20.5 | **CODE 6 `Brown` `#543324`** | 11.0 |
| light brown | — | 13.9 | **CODE 86 `Medium_Brown` `#7B5D41`** | **6.3** |
| dark blonde | — | 18.1 | **CODE 84 `Medium_Nougat` `#AA7D55`** | **9.6** |

Jet black, blonde, platinum and grey are already fine (ΔE 5.7–14.6).

**The redhead problem is one colour.** `Dark_Orange` alone takes ginger from "becomes a brunette" to a good match. Hair colour is Tier A and red hair is highly distinctive — exactly what §2 says to exaggerate rather than erase. Apply the same five to `facial_hair_color`, which shares the problem. Four of these codes also appear in the skin ladder, so the total count of new codes across all slots is smaller than the per-slot lists suggest.

**Conditional worth building in:** match hair colour into the natural set *unless* chroma is high enough to indicate genuinely dyed hair, then open up the fantasy set. Dyed hair is highly distinctive and flattening it to brown erases the feature that makes someone recognisable.

### 3.4 43 hair styles are really 12 silhouettes

| Family | Count |
|---|---|
| bob | 10 |
| short forward fringe | 10 |
| short swept | 5 |
| swept back | 4 |
| slicked back | 4 |
| widow's peak | 3 |
| short plain | 2 |
| bald · curly · long · mullet · flattop | 1 each |

**The most useful structural fact for on-device work.** A 43-way fine-grained classification from a q60 selfie is hard; a **12-way silhouette decision from a binary hair mask is not** — length relative to the face box, width, symmetry, forehead coverage, outline roughness. Several are computable from mask geometry with no classifier at all. Nobody sees the difference between `short_forward_fringe_left_curl` and `short_forward_fringe_left`; everybody sees `bob` versus `slicked_back`. Get the family right and pick a representative within it for v1.

### 3.5 `head` is 15 bases × 4 glasses, with 10 holes

| Base | Missing glasses variants |
|---|---|
| `teeth` | none, small_glasses, square_glasses |
| `teeth_square_glasse` *(typo — should be `teeth_square_glasses`)* | round, small, square |
| `long_beard` | **none** |
| `flat_beard` | small_glasses |
| `open_mouth` | small_glasses |
| `small_beard` | small_glasses |

Two things to act on. **`long_beard` has no no-glasses variant** — a long-bearded user without glasses cannot be represented and will be given glasses or degraded to `plain`; that looks like a missing part rather than a decision. And **`teeth_square_glasse` is a typo** that makes one of 50 values permanently unresolvable, leaving the `teeth` base nearly unreachable.

Decompose the slot into glasses (4-way) and facial hair (15-way), with an **explicit legality map** for the 10 holes choosing the nearest legal neighbour rather than falling through to `plain`. Decomposition also improves calibration: a probability over 4 glasses options means something, where one over 50 pre-multiplied labels smears mass across near-duplicates differing only in the other factor.

### 3.6 The hair catalogue cannot represent large populations

Searching all 43 `hair_style` values: **ponytail, bun, braid, updo, dreadlocks, twists, afro, coily, pigtails — all absent.** A single `curly` covers every texture from wavy to 4C. There is effectively no long hair.

**This is upstream of every technical decision here and no model fixes it.** A user with an afro, or with hair tied back, gets an unrecognisable Brickie regardless of pipeline quality. Priority for new parts, by users-unlocked per part:

1. **Textured / coily hair, 2–3 volumes.** Largest affected population, most distinctive gap.
2. **Tied back — ponytail and bun.** Very common daily styles, currently unrepresentable.
3. **Long loose hair, 2–3 lengths**, straight and wavy.
4. **Braids and locs.**

An eleventh short-forward-fringe variant adds nearly nothing. The colour additions in §3.1–§3.3 are **not** parts work — they are a data edit, available immediately, independent of moulding lead time.

### 3.7 Smaller schema faults

- `facial_hair_color` — the "return `n/a` if no facial hair" instruction is attached to the **confidence** field, and `n/a` is **not** in the value enum. `head_accessory_color` gets this right (24 = 23 + `n/a`). Add `n/a` to the value enum and move the instruction.
- `head_accessory.confidence` description reads "the confidence level of the **body** prediction" — copy-paste.
- **A dress spans `body` and `legs`** (`dress_large_sleeves*` in one, `plain_dress`/`stripe_dress`/etc. in the other) with nothing enforcing agreement. Independent slot-filling can produce a dress top with trousers. Enforce in the normaliser.
- **The catalogue is larger than the enums** — 67 hair pieces vs 43, 44 torsos vs 30, 54 heads vs 50. 42 parts are reachable by manual pick but not by generation.

---

## 4. Options and the recommended architecture

### 4.1 Where inference runs in Unity

| Option | Gives | Cost / caveat |
|---|---|---|
| **OS-native** — Apple Vision, ML Kit | Face detect + landmarks, person segmentation. **Ships no weights** — Vision is OS-provided; ML Kit selfie segmentation adds ~4.5 MB | Two platform paths; capabilities differ; no custom models |
| **Unity Sentis** (`com.unity.ai.inference` 2.6.x) | First-party. ONNX opset 7–25, **also ingests LiteRT/TFLite** so MediaPipe artefacts drop in directly. Quantises to fp16/uint8 at import. All Unity platforms | Cold start is "a one-time delay of several seconds" for buffer allocation and kernel compilation. CNN-scale graphs only |
| **`onnxruntime-unity`** | ORT 1.26 with CoreML / NNAPI / XNNPACK providers — better op coverage and NPU access; backend swap is one line | Third-party package to maintain |
| **TFLite Unity plugin** | Shortest path if staying entirely on MediaPipe `.tflite` | Third-party; no ONNX path |

These compose rather than compete. **Warm the model up on an earlier screen** — inside a 10 s ceiling, a several-second cold start is a third of the budget; on the previous screen it is free.

### 4.2 Region models — all Apache-2.0, sizes measured from Google's CDN

| Model | Gives | Size |
|---|---|---|
| `blaze_face_short_range.tflite` | Face detection (200–1000+ FPS on flagships) | **224 KB** |
| `hair_segmenter.tflite` | Binary hair mask at 512×512 | **763 KB** |
| `selfie_segmenter.tflite` | Person / background | 244 KB |
| `face_landmarker.task` | 478 landmarks — beard region, cheek sampling | 3.6 MB |
| `pose_landmarker_lite.task` | 33 body landmarks incl. hips | 5.5 MB |
| `selfie_multiclass_256x256.tflite` | hair · body-skin · face-skin · clothes · accessories | 15.6 MB, **float32 only** |

The multiclass segmenter is published float32 only (fp16 and int8 URLs 404) and dominates the budget. Since the face landmarker already gives the face region, **the 763 KB hair segmenter plus landmark geometry reaches the same place for 5% of the download.** Start there.

### 4.3 Colour — no model required

Segment region → trim luminance outliers (top and bottom few percent by luminance are lighting, not material) → cluster in CIELAB → nearest entry in the expanded palette → modest exaggeration. For garments, k-means at k=3 ordered by cluster mass gives `_color`, `_color_2`, `_color_3` exactly as the schema defines them ("2nd/3rd most visible"). **Nine of fifteen slots need no model at all**, and this is the one part of the pipeline with an exact closed-form answer — an LLM naming hex codes from a list is close to the worst available tool for it.

### 4.4 Silhouette and style — the only hard stage

| | Option | Recognisability | App size | Privacy | Cost / new part | Verdict |
|---|---|---|---|---|---|---|
| **A** | Geometric descriptors from the hair mask → 12 families | Moderate | ~0 | Perfect | Retune thresholds | **Ship first** |
| **B** | Classifier trained on renders of our own parts | Good | 3–10 MB | Perfect | Re-render + retrain | **The target** |
| **C** | Embedding retrieval over part thumbnails (DINOv2 / SigLIP, both Apache-2.0) | Unproven here | 25–90 MB | Perfect | **One index row** | Test it |
| **D** | Hosted VLM on our infrastructure | Good | 0 | Crop leaves device | Edit an enum | Opt-in tier |
| **E** | Third-party API | Best today | 0 | Crop leaves device | Edit an enum | Opt-in only |
| **F** | ~~On-device VLM~~ | — | 1–2 GB | Perfect | Edit an enum | **Ruled out** |

**Why B is the target.** We already own 43 hair parts, 30 torsos and 31 leg pieces **as 3D assets**. Rendering them across pose, lighting and skin tone yields unlimited perfectly-labelled training data for our exact vocabulary — no third-party dataset, no licence question, no labelling cost. Microsoft's **Hairmony** (SIGGRAPH Asia 2024) predicts hairstyle from a single image trained *exclusively* on 100k synthetic renders, at 87.6% mean accuracy with an explicit fairness objective. Same problem, same method, published numbers. Borrow the recipe — frozen self-supervised backbone (they used DINOv2, Apache-2.0) plus synthetic-only training — and the idea of a **factored** taxonomy (gathered × length × texture) rather than a flat list of 43. Their data and weights are R-UDA licensed and non-commercial, so use our own renders, not theirs.

**Why F is ruled out.** A published case study on a OnePlus 13R (Snapdragon 8 Gen 2) measured **~21 s end-to-end for the fastest 3B-class VLM** — of which ~14 s was visual preprocessing, not generation, so shorter prompts and constrained decoding do not help. With a 1–2 GB download and low-end Android OOM behaviour it fails on three axes against a 10 s ceiling. Revisit only when a framework uses the NPU for the vision encoder; the same study found the GPU at 0% busy throughout.

**The caveat on C.** Retrieval is structurally attractive — the index derives from the catalogue so the two cannot drift apart, and a new part costs one row rather than a retraining run. But it means matching a q60 photo against a *stylised, non-photorealistic LEGO render*, and CLIP-family zero-shot retrieval degrades sharply on exactly that domain shift. SigLIP benchmarks best on average, so try it first. **Do not assume zero-shot works** — it is a few days to find out, and if top-5 is strong the confirm screen makes top-1 weakness survivable.

### 4.5 Face attributes

**Facial-hair *presence* needs no classifier.** Take the landmark-defined jaw/chin/upper-lip polygon, subtract what the segmenter labels face-skin, threshold the remaining area. That also gives the region to sample `facial_hair_color` from, and a genuine clean-shaven signal rather than a guessed colour. Glasses is a small binary-plus-shape classification; style within facial hair benefits most from option B.

### 4.6 What the licence wall rules out

Almost every public face and human-parsing dataset is **non-commercial research only**: CelebA, CelebAMask-HQ, LaPa, Microsoft FaceSynthetics, Meta Sapiens (CC-BY-NC-4.0), LIP, and the popular Hugging Face models trained on them. CelebA extends its restriction explicitly to "derived data", which reads onto weights.

Worse on the clothing side, where the tags mislead: `segformer_b2_clothes` gets ~408k downloads a month, declares `license: other`, and is trained on an ATR re-upload with **no licence field at all**, while sibling models on the same data declare MIT. **On Hugging Face, read the `datasets:` field before the `license:` field** — the licence that binds is the most restrictive one anywhere up the chain.

**None of this constrains the recommended path**: MediaPipe, DINOv2 and SigLIP are Apache-2.0, and option B trains on renders we own.

### 4.7 The architecture

| Stage | Slots | What runs | Where |
|---|---|---|---|
| 1 · Detect + landmark | — | Vision / ML Kit, or BlazeFace + face landmarker | **Device** |
| 2 · Hair mask | — | MediaPipe hair segmenter (763 KB) | **Device** |
| 3 · Colours | 9 slots | Cluster + palette match + exaggeration | **Device**, no model |
| 4 · Silhouette family | `hair_style` | Option A now → option B next | **Device** |
| 5 · Face attributes | `head` | Geometry for presence, small classifier for style | **Device** |
| 6 · Garment style | `body`, `legs` | Default; refine later | **Device** / hosted |

**Under 15 MB total, well under a second.** Latency is not the constraint — spend the 10 s budget on native-resolution segmentation and test-time augmentation rather than banking it. The constraints are app download size and licence.

| Tier | Runs | Leaves the device |
|---|---|---|
| **Default — on-device** | Stages 1–6 | **Nothing** |
| Opt-in — our hosted service | Better silhouette / garment models | Background-removed crop |
| Opt-in — third party | Highest accuracy, extra detection | Same crop, explicit consent |
| Fallback — incapable device | Remote equivalent of 1–6 | Same crop, same consent path |

**Send crops, never the original.** Even in the hosted tiers, a silhouette model needs a masked hair region or a torso crop — not a photograph of a child's face. That is a materially smaller disclosure to defend, and it is free because the masks are already computed on-device. Make the tier visible, remembered and revocable.

**If a hosted tier uses an LLM:** constrain the output against the closed enums rather than prompting and hoping. OpenAI's strict Structured Outputs compiles the schema to a grammar and masks invalid tokens — **100% schema compliance versus ~86% for function calling**, which is what the current integration uses. Gemini's `responseSchema` and `text/x.enum` do the same; XGrammar and llama.cpp GBNF give it for self-hosted open models. And **take confidence from logprobs, not the model's self-reported number** — verbalized LLM confidence clusters at 80–100% regardless of actual accuracy, whereas over a constrained enum the token distribution is a real posterior over the valid choices.

---

## 5. Compliance — check this first

**OpenAI's Under-18 API guidance states, verbatim:**

> "You should not use OpenAI services to process any personal data of children under 13 or the applicable age of digital consent without first implementing zero data retention in our API."

Brickie is a children's product transmitting selfies of minors to the OpenAI API. **ZDR is not a setting.** Abuse-monitoring logs are retained "for up to 30 days" by default, and exclusion is "subject to prior approval by OpenAI and acceptance of additional requirements", obtained through their sales team; reporting indicates it requires an Enterprise Agreement and a trust-and-safety review. **Confirm whether we hold it. If not, the current integration is contrary to OpenAI's stated guidance today** — a present state, not a future risk. Note "the applicable age of digital consent" reaches beyond 13 — 13–16 across EU member states.

**Separately:** the amended COPPA Rule became enforceable **22 April 2026**. It adds biometric identifiers *including facial templates* to the definition of personal information, and requires separate verifiable parental consent for disclosure to third parties unless the disclosure is integral to the service. There is a real argument that the analysis call *is* integral to the service being requested — but it should be made deliberately by someone qualified, documented, and revisited.

**On-device processing eliminates the transfer, and with it the third-party disclosure question, the retention question and the ZDR question simultaneously.** This is the strongest argument for the onboard path and it is not a quality argument.

---

## 6. Measurement — nothing is currently falsifiable

There is no eval harness, no golden set, no labelled selfies, no provider recorded per generation, and no user quality signal. **Any claim that approach A beats approach B on real Brickie selfies is unfalsifiable today, including the recommendations above.** Capability facts are verifiable from primary documentation; accuracy on our data is not.

Per-slot accuracy is also the wrong metric — it would mark down an instantly-recognisable Brickie for having the wrong trousers and mark up an unrecognisable one for getting nine Tier C slots right.

**Build instead:**

1. **The pick-me-out test.** Show a user their Brickie alongside four generated from other people — can their friend pick it? It measures the actual product goal, needs no labelled corpus, improves as the catalogue grows, and is a fun in-app mechanic rather than a chore. This is the one I would build.
2. **A 1–5 "does this look like you?"** on generation, pure telemetry, segmented by the Tier A slots so failures can be correlated with hair family.
3. **Record tier, provider and model version per generation.** Without this, no comparison between the on-device path and the hosted tiers is possible even retrospectively.
4. **Persist `confidence` to `BrickieFeature`.** It is captured on `TransformationFeature` and then dropped, so the client never sees it. Add the column and switch the value to a logprob-derived one.

---

## 7. Already decided — work issues, by repo

Nothing in this section needs a decision. These are work items.

### `emagineer-webservices`

| # | Change |
|---|---|
| W1 | Add the 8 garment colours (§3.1) to `body_color`, `body_color_2/_3`, `legs_color`, `legs_color_2/_3` |
| W2 | Add the 5 hair colours (§3.3) to `hair_color` and `facial_hair_color` |
| W3 | Replace the `skin_color` auto-match set with the 12-step nougat ladder (§3.2); move stylistic entries to user-selectable only |
| W4 | Drop or remap the three non-LDraw skin hexes `#D7BA8C`, `#CCA373`, `#C65127` (§3.2) — closes the known mapping gap and two undiscovered ones |
| W5 | Fix `teeth_square_glasse` → `teeth_square_glasses` (§3.5) |
| W6 | Add `n/a` to the `facial_hair_color` **value** enum and move the instruction off the confidence field (§3.7) |
| W7 | Fix the `head_accessory.confidence` description (§3.7) |
| W8 | Enforce dress consistency between `body` and `legs` in `Normalize` (§3.7) |
| W9 | Switch colour matching to CIEDE2000 with a hue-family guard for dark low-chroma colours (§3.1) |
| W10 | Switch `OpenaiPrompt` from function calling to strict Structured Outputs (§4.7) |
| W11 | Record provider, model ID and schema version on `users_transformations` (§6) |
| W12 | Add a `confidence` column to `BrickieFeature` and populate from logprobs (§6) |
| W13 | Add a legality map for the 10 missing `head` combinations, choosing nearest legal neighbour over `plain` (§3.5) |

### `emagineer-unity-client`

| # | Change |
|---|---|
| U1 | Resize to ~1024–1536 px on the long edge before `EncodeToJPG(60)` — latency win at no accuracy cost (§1) |
| U2 | Add `CODE 151` and any other server-emitted skin codes missing from `BrickieColorVariantsConfig` |
| U3 | Emit or remove the `head_accessory_color_2/_3` lookup — currently a one-sided contract |
| U4 | Add a CI check diffing schema enums against the Unity catalogue — five of the six drift faults exist because a JSON file and a catalogue are synced by hand |

### Either repo

| # | Change |
|---|---|
| X1 | Commission parts against the §3.6 priority list — lead-time-bound, and it caps everything else |

---

## 8. Open decisions — wayfinder tickets

These are genuinely unresolved and each resolution is a decision, not a build slice.

| # | Decision | Type |
|---|---|---|
| D1 | **Which silhouette approach.** Ship A, then B or C? Needs the §4.4 experiment — geometric descriptors on a handful of photos, and a retrieval top-1/top-5 measurement — before committing | `prototype` |
| D2 | **Do we factor the `hair_style` vocabulary** into orthogonal axes (gathered × length × texture, Hairmony-style) or keep a flat list? Affects what parts get commissioned and how the classifier is shaped | `grilling` |
| D3 | **Physical or digital?** If Brickies render from `.mpd` with colour codes rewritten, any LDraw colour is free. If a Brickie should be *physically buildable*, a colour only counts when that part is actually moulded in it — far tighter, and it varies part by part. Decide explicitly what we are promising | `grilling` |
| D4 | **Which ML runtime**, and what app-size budget do we accept? OS-native only, Sentis, or `onnxruntime-unity` (§4.1) | `task` |
| D5 | **Tier and consent UX** — how the on-device default, the hosted opt-in and the fallback are presented, remembered and revoked (§4.7, §5) | `grilling` |
| D6 | **The ZDR / under-13 position** (§5). Do we hold ZDR? Does the "integral to the service" argument apply? Needs a qualified answer, not a technical one | `task` |
| D7 | **Lemoji-first sequencing?** Lemoji parts are meshes, not moulded bricks, so the §3.6 coverage gaps are far cheaper to close there. Proving the pipeline on Lemojis while Brickie parts are made is a plausible de-risking tactic | `grilling` |
| D8 | **Measurement design** — the pick-me-out test as a mechanic, and what we do with the signal (§6) | `prototype` |
| D9 | **What happens to the 42 unreachable parts** — extend the enums, or accept manual-pick-only? (§3.7) | `task` |

Suggested order: **D6 first** (it may constrain the option space and is a phone call), then **D8** (nothing downstream is measurable without it), then **D1** and **D3** in parallel.

---

## 9. Not verified

- **Every comparative accuracy claim.** Capability facts from primary docs are not performance on our data. §6 is the only thing that changes this.
- **Whether silhouette family is recoverable from mask geometry alone.** Several families should separate on simple descriptors; `bob` versus `short_swept` may not. Untested.
- **Whether zero-shot retrieval clears the render-to-photo domain gap** (§4.4).
- **End-to-end timing and cold-start cost** under any runtime on our device floor.
- **The exaggeration lever** (§2) is well-supported in perception research but untested on LEGO caricatures specifically.
- **The skin ladder and hair additions are computed, not art-directed.** Lab distances against representative real-world colours using official `LDConfig.ldr` values. Have someone view them rendered on an actual Brickie — colour reads differently on a small glossy stud than in a table.
- **Whether COPPA's "integral to the service" exemption covers the current transfer.** A legal question.
- **The Lemoji catalogue** has not been examined; §D7 reasons from description only.
