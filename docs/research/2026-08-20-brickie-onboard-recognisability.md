# Brickies on-device: recognisability, not accuracy

Research note, 2026-08-20. Third pass, and the first written against **the actual `brickie_schema.json`** rather than a description of it. Supersedes the framing of the earlier notes in this directory.

**Update, 2026-08-20 (rev 2): the palette may be expanded to any colour in the LEGO range.** That lifts the hardest constraint in the first version of this note. I've re-run the analysis against the authoritative [LDraw `LDConfig.ldr`](https://github.com/ctiller/ldraw/blob/master/LDConfig.ldr) — 191 defined colours, **85 usable plain solid colours** after excluding transparent, chrome, pearlescent, rubber, metallic and glitter finishes, plus LDraw's two meta-colours (`CODE 16` Main_Colour and `CODE 24` Edge_Colour, which are not real part colours). §3.1–§3.3 are rewritten with specific colours to add. §3.6, the hair-parts gap, is unchanged and is now clearly the binding constraint.

**What changed.** The goal is an *approximate LEGO caricature that feels immediately recognisable*, not a correct classification. Privacy is paramount and on-device is the default, with hosted and third-party as opt-in tiers and a remote fallback for incapable devices. Parts are colourisable and new ones are being made. Given that, I read the schema and analysed it, and **most of the highest-value findings are in your own data rather than in the model landscape.** Several are fixable this week with no model at all.

---

## TL;DR

1. **Recognisability is carried by four things, not fifteen.** The face-perception literature is consistent that the external hairline is "a powerful frame of reference for the perceptual assessment of individuals' appearances", and that internal and external features are encoded holistically. For a LEGO caricature that means **hair silhouette, hair colour, skin tone, and the glasses/facial-hair combination** carry nearly all of "that's me". Torso and legs carry almost none. Rank the pipeline accordingly — currently all 15 slots get equal engineering attention and 9 of them barely matter.

2. **Expanding the palette fixes the colour problem outright — here are the colours.** The current 23-entry garment palette maps maroon → coral (ΔE 44), mid-brown → grey (ΔE 35), forest green → near-black (ΔE 35), olive → grey (ΔE 30). **Eight additions from the official LEGO range collapse every one of those to ΔE 7–17.** Specific LDraw codes in §3.1. This is a data change, not an algorithm change, and it is the single highest-value edit available.

3. **There is a clean 12-step LEGO skin ladder available** — `Light_Nougat` at L\* 85 down to `Brown` at L\* 25, all official colours (§3.2). Adopt it as the auto-match set and keep the current stylistic entries (LEGO yellow, white, greys, bright oranges) as deliberate user choices. Today those stylistic entries are reachable by automatic matching, so a pale user can land on white and a warm-lit user on bright orange.

3b. **Three `skin_color` hexes are not official LDraw colours at all** — `#D7BA8C`, `#CCA373`, `#C65127`. That explains the known `#CCA373` mapping bug and finds two more instances of it. §3.2.

4. **Ginger is one palette entry away.** `Dark_Orange` (CODE 484, `#91501C`) takes ginger/auburn from ΔE 17.6 to 8.9, and `Dark_Nougat` (CODE 128, `#AD6140`) takes copper red from 30.1 to 11.0. Five hair additions in total (§3.3). Hair colour is a Tier A identity slot, so this is the best value-per-effort item in the note.

5. **43 hair styles collapse to 12 silhouette families**, and two families (bob, short-forward-fringe) account for 20 of the 43. You do not need to distinguish `short_forward_fringe_left_curl` from `short_forward_fringe_left` — nobody will see it. **Classify the family, then pick within it.** A 12-way silhouette decision from a hair mask is dramatically more tractable on-device than a 43-way one, and captures nearly all the recognisability. §3.4.

6. **The hair catalogue cannot represent several large populations at all.** Zero entries for ponytail, bun, braids, updo, dreadlocks, twists, afro or coily hair; a single `curly` covers all texture; effectively no long hair. **No model can fix this — it's a parts problem**, and it caps achievable recognisability for those users at zero regardless of pipeline quality. This is the highest-value place to spend new-part budget. §3.6.

7. **`head` is 15 bases × 4 glasses with 10 combinations missing** — including, notably, that `long_beard` has *no* no-glasses variant. Decompose the slot into two questions, but you must handle the 10 illegal recombinations deliberately. Full list in §3.5.

8. **The whole identity-carrying pipeline fits on-device in under 15 MB.** Face landmarker (3.6 MB) + MediaPipe hair segmenter (763 KB) + a small attribute model, all Apache-2.0, running in well under a second. Colours need no model at all. Options and trade-offs per stage in **§4**; the recommended architecture and tiering in **§5**.

9. **Train the hard classifier on renders of your own parts.** You own 43 hair pieces, 30 torsos and 31 leg pieces as 3D assets — render them across pose, lighting and skin tone and you have unlimited perfectly-labelled data for your exact vocabulary, with no third-party dataset and no licence question. Microsoft's Hairmony did precisely this for hairstyle-from-one-image and reached 87.6% trained on synthetic renders alone. **This is the strongest idea in the note** (§4.4).

10. **On-device VLMs are ruled out**, and it's measured rather than assumed: ~21 s for the fastest 3B-class model on flagship Android, ~14 s of it in vision preprocessing that prompt engineering can't shrink, on top of a 1–2 GB download (§4.4).

11. **Measure recognisability, not slot accuracy.** "Does this look like you?" and a pick-your-friend-from-five test tell you what you actually care about. Per-slot accuracy would mark down a brickie that's instantly recognisable but has the wrong trousers. §7.

---

## 1. What the goal change implies

"Approximate caricature, reasonable accuracy, audience understands the limits of LEGO" is a much weaker requirement than the one I was designing against, and it unlocks options:

- **Small on-device models become viable.** I previously worried about classifier accuracy. At this bar, a model that gets the hair *family* right and the fringe direction wrong is a success.
- **Deliberate defaults become respectable.** For unobservable slots, a sensible fixed default is not a failure mode, it's the correct answer.
- **Exaggeration is available as a tool.** This is the interesting one — see §2.

What it does *not* weaken: the identity-carrying slots. A brickie with the wrong hair colour or wrong skin tone is not "approximately right", it's someone else. **The tolerance is uneven across slots, and that unevenness is the main thing the architecture should exploit.**

---

## 2. Recognisability is a small number of features — and caricature helps

Two findings from the face-perception literature are directly useful:

**External features dominate.** The outer hairline provides "a powerful frame of reference for the perceptual assessment of individuals' appearances", and internal and external features are stored holistically such that changing one disrupts processing of the others. In a LEGO minifig — where internal facial geometry is fixed by the medium — **the hair silhouette is doing most of the identification work.**

**Caricature improves recognition, within limits.** Exaggerating distinctive deviations from the average makes faces *more* recognisable, with reported verification improvements around 30% for unfamiliar faces — but "above a certain rate of exaggeration, caricature verification is actually hindered".

This suggests a design lever you're not currently using, and it costs nothing:

> **Push distinctive attributes away from the population mean rather than to the nearest palette entry.** If someone's hair is unusually light or dark for the population, bias the palette choice one step toward the extreme rather than taking the ΔE-nearest colour. Same for skin tone at the ends of the range. Modest exaggeration — one step, not three.

That is a deliberate, literature-backed departure from "closest match", and it directly serves "immediately recognisable" over "technically accurate". It also happens to suit LEGO, which is a saturated, exaggerated medium already.

**The resulting slot ranking:**

| Tier | Slots | Why |
|---|---|---|
| **A — identity** | `hair_style` (family), `hair_color`, `skin_color`, `head` | Carries "that's me". Get these right or nothing else matters. |
| **B — context** | `body_color`, `head_accessory` + colour | Noticed, contributes to likeness, cheap to get roughly right. |
| **C — furniture** | `body`, `legs`, `legs_color`×3, `body_color_2/_3` | Largely unobservable in a selfie; defaults are fine. |

Nine of the fifteen slots are Tier C. **Engineering effort should be roughly inverse to the current uniform treatment.**

---

## 3. Findings from your schema

All of the following are from analysing `brickie_schema.json` directly.

### 3.1 The garment palette: eight colours to add

The 23-entry `body_color` / `legs_color` palette lacks most common real-world clothing colours. With the full LEGO range available, every gap closes. Distances are CIE76 ΔE in Lab against the real-world colour.

| Real colour | Current best | ΔE now | Recommended addition | ΔE after |
|---|---|---|---|---|
| maroon | `#F06D61` Salmon | **43.9** | **CODE 320 `Dark_Red` `#720012`** | 15.7 |
| mid brown | `#8A928D` Light Grey | **35.4** | **CODE 86 `Medium_Brown` `#7B5D41`** | **7.8** |
| forest green | `#1B2A34` Black | **35.2** | **CODE 288 `Dark_Green` `#00451A`** | **7.8** |
| olive / khaki | `#8A928D` Light Grey | **30.4** | **CODE 330 `Olive_Green` `#77774E`** | **6.9** |
| purple | `#1E5AA8` Blue | **31.0** | **CODE 22 `Purple` `#671F81`** | 16.7 |
| tan / beige | `#C8C8C8` | **28.6** | **CODE 19 `Tan` `#B0A06F`** | **8.3** |
| dusty pink | `#8A928D` Light Grey | 27.2 | CODE 13 `Pink` `#F6A9BB` | 17.6 |
| teal | `#8A928D` Light Grey | 25.0 | CODE 378 `Sand_Green` `#708E7C` | 19.4 |

**Three honest limits.** *Mustard* doesn't improve — LEGO has no true mustard, and `Bright_Light_Orange` at ΔE 23.9 remains the best available. *Denim blue* stays around ΔE 18; there is no denim in the LEGO range. *Purple* and *maroon* improve a lot but remain in the mid-teens, because LEGO's purple and dark red are both more saturated than the real garment colours. These are genuine medium limits, and per §2 garment colour is Tier B, so they're acceptable.

**Correction to rev 1 of this note.** I wrote that the palette had "no true black". That was wrong in the way that matters: **`#1B2A34` *is* LEGO Black, `CODE 0`.** It's a very dark desaturated blue rather than `#000000`, but it is the correct and only answer for black clothing, and black/charcoal/navy already match well (ΔE 10–12).

**On the matching algorithm.** Rev 1 recommended hue-family-first matching to stop ΔE crossing hue families — forest green landing on black despite two greens existing. **A denser palette fixes that more decisively than the algorithm does**, so I'm demoting that recommendation: with the additions above, plain nearest-neighbour gets forest green right. Keep a hue-family guard for the dark, low-chroma region where Lab distance still misbehaves, and prefer **CIEDE2000 over CIE76** — but the palette edit is the primary fix and the algorithm change is now a secondary refinement.

### 3.2 Skin: adopt the official LEGO nougat ladder

The LEGO range contains a clean, evenly-spaced skin ramp. Ordered light to dark:

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

**Use this as the automatic-match set.** It spans L\* 25–85 with reasonably even steps, which is what a skin matcher needs. Keep the current stylistic entries — LEGO yellow `#FAC80A`, white, the greys, the bright oranges, the pinks — as **user-selectable style choices**, not as automatic targets. Today they are reachable automatically, which is how a pale user under a bright window lands on white and a warm-lit user on bright orange.

**Three entries are not official LDraw colours.** `#D7BA8C`, `#CCA373` and `#C65127` do not appear in `LDConfig.ldr`, so they cannot map to a `CODE N`. This explains the known `#CCA373` bug — the server's `SKIN_COLORS` map has no entry because **there is no official colour to map it to** — and identifies two more instances of the same problem. Nearest official equivalents: `#D7BA8C` → CODE 19 `Tan`, `#CCA373` → CODE 19 `Tan`, `#C65127` → CODE 366 `Earth_Orange`. Better still, drop all three in favour of the ladder above.

### 3.3 Hair: five additions, and ginger is solved

Only 7 of the current 28 `hair_color` entries are natural. The LEGO range covers the natural spectrum properly.

| Real hair | Current best | ΔE now | Recommended addition | ΔE after |
|---|---|---|---|---|
| ginger / auburn | `#764D3B` brown | 17.6 | **CODE 484 `Dark_Orange` `#91501C`** | **8.9** |
| copper red | `#764D3B` brown | **30.1** | **CODE 128 `Dark_Nougat` `#AD6140`** | **11.0** |
| dark brown | `#1B2A34` black | 20.5 | **CODE 6 `Brown` `#543324`** | 11.0 |
| light brown | — | 13.9 | **CODE 86 `Medium_Brown` `#7B5D41`** | **6.3** |
| dark blonde | — | 18.1 | **CODE 84 `Medium_Nougat` `#AA7D55`** | **9.6** |
| jet black · blonde · platinum · grey | already fine | 5.7–14.6 | — | — |

**The redhead problem is one colour.** `Dark_Orange` alone takes ginger from "becomes a brunette" to a good match. Given that hair colour is Tier A and red hair is highly distinctive — exactly the kind of feature §2 says to *exaggerate* rather than erase — this is the best single edit in the whole note.

The five additions also fill the gap between `#764D3B` brown and `#DEAC66` blonde, so mid-brown hair no longer has to jump to one extreme. Apply the same set to `facial_hair_color`, which shares the problem.

**Note the overlap.** `Medium_Brown` (86), `Medium_Nougat` (84), `Dark_Nougat` (128) and `Dark_Orange` (484) appear in both the skin ladder and the hair additions. That is expected — hair and skin occupy neighbouring regions of colour space — and it means the total number of *new* codes to introduce across all slots is smaller than the per-slot lists suggest.

### 3.4 43 hair styles are really 12 silhouettes

| Family | Count | Examples |
|---|---|---|
| bob | 10 | `curled_bob_left_fringe`, `curled_bob_middle_big_fringe`, … |
| short forward fringe | 10 | `short_forward_fringe`, `…_centre_part`, `…_left_curl`, … |
| short swept | 5 | `short_left_sweep`, `short_mid_swept_fringe`, … |
| swept back | 4 | `left_swept_back`, `wide_curved_back_both_sides_left_sweep`, … |
| slicked back | 4 | `short_slicked_back`, `short_slick_back_mid_high`, … |
| widow's peak | 3 | `short_curved_widow_peak`, `short_pointed_widow_peak`, … |
| short plain | 2 | `short`, `short_both_sides` |
| bald · curly · long · mullet · flattop | 1 each | |

**This is the single most useful structural fact for on-device work.** A 43-way fine-grained classification from a q60 selfie is hard. A **12-way silhouette-family decision from a binary hair mask is not** — length relative to the face box, width, symmetry, whether the forehead is covered, whether the outline is smooth or textured. Several of these are computable from mask geometry with no classifier at all.

**Recommended: coarse-to-fine.** Family from mask geometry (cheap, on-device, robust). Within-family choice by a secondary signal — parting side from mask asymmetry, fringe presence from forehead coverage — or simply a fixed representative per family for v1. A user will notice `bob` vs `slicked_back`. They will not notice which of ten fringe variants you picked.

### 3.5 `head` decomposes 15 × 4, with 10 holes

15 facial bases × 4 glasses states = 60 possible; 50 exist. The missing ones:

| Base | Missing glasses variants |
|---|---|
| `teeth` | none, small_glasses, square_glasses |
| `teeth_square_glasse` *(typo — should be `teeth_square_glasses`)* | round, small, square |
| `long_beard` | **none** |
| `flat_beard` | small_glasses |
| `open_mouth` | small_glasses |
| `small_beard` | small_glasses |

Two things worth acting on. **`long_beard` has no no-glasses variant** — a long-bearded user without glasses cannot be represented correctly and will be given glasses or degraded to `plain`. That looks like a missing part rather than an intentional choice. And **`teeth_square_glasse` is a typo** that makes one of 50 values permanently unresolvable; the `teeth` base is nearly unreachable as a result.

Decomposing into (facial hair × glasses) is right — it makes both sub-questions small, and turns a smeared 50-way probability into two sharp ones. But you need an explicit legality map for the 10 holes, choosing the nearest legal neighbour rather than falling through to `plain`.

### 3.6 The hair catalogue cannot represent large populations

Searching all 43 `hair_style` values: **ponytail, bun, braid, updo, dreadlocks, twists, afro, coily, pigtails — all absent.** A single `curly` covers every texture from wavy to 4C. There is effectively no long hair (`long_fringe` and `long_bob_flowers` are the only candidates).

For a product whose stated aim is *immediately recognisable*, this is the binding constraint, and it is upstream of every technical decision in this note. A user with an afro, or with hair tied back — an extremely common everyday style — gets an unrecognisable brickie **no matter how good the pipeline is.**

Since you're commissioning parts, here's where I'd put the budget, ordered by users-unlocked per part:

1. **Textured / coily hair, 2–3 volumes.** Currently one `curly` for the entire range. Largest affected population and the most visually distinctive gap.
2. **Tied-back: ponytail and bun.** Very common daily styles across a large fraction of users; currently unrepresentable.
3. **Long loose hair, 2–3 lengths.** Straight and wavy, past shoulders.
4. **Braids and locs.**
And note the colour additions in §3.1–§3.3 are **not** parts work — they're a data edit, available immediately and independent of any moulding lead time.

By contrast, an eleventh short-forward-fringe variant adds nearly nothing — §3.4 shows you already have ten and users can't distinguish them.

### 3.7 Smaller schema bugs

- `facial_hair_color` — the "return `n/a` if no facial hair" instruction is attached to the **confidence** field, and `n/a` is **not** in the value enum (28 colours, no `n/a`). `head_accessory_color` gets this right (24 = 23 + `n/a`). **Fix: add `n/a` to the `facial_hair_color` value enum and move the instruction to the value field.**
- `head_accessory.confidence` description reads "The confidence level of the **body** prediction" — copy-paste.
- **A dress spans `body` and `legs`.** `dress_large_sleeves*` in `body` and `plain_dress`/`stripe_dress`/etc. in `legs` must agree; nothing in the schema enforces it, and independent slot-filling can produce a dress top with trousers. Enforce in the normaliser.

---

## 4. The options, stage by stage

The pipeline is four stages, and each has a genuine choice attached. This section is the candidate landscape; §5 is the recommendation.

### 4.1 Where inference runs inside Unity

| Option | What it gives | Cost / caveat |
|---|---|---|
| **OS-native** — Apple Vision, Android ML Kit | Face detect + landmarks, person segmentation. **Ships no weights.** iOS Vision is OS-provided; ML Kit selfie segmentation adds ~4.5 MB | Two platform code paths; capability differs between them; no custom models |
| **Unity Sentis** (`com.unity.ai.inference` 2.6.x) | First-party, ONNX opset 7–25, **also ingests LiteRT/TFLite** so MediaPipe artefacts drop in directly. Quantises to Float16/Uint8 at import. All Unity runtime platforms | Cold start is "a one-time delay of several seconds" for buffer allocation and kernel compilation — warm up on an earlier screen. CNN-scale graphs only |
| **`onnxruntime-unity`** (asus4) | ONNX Runtime 1.26 with CoreML, NNAPI, XNNPACK execution providers — better operator coverage and NPU access than Sentis; backend swap is one line | Third-party package to maintain |
| **TFLite Unity plugin** (asus4) | Shortest path if you stay entirely on MediaPipe `.tflite` with GPU/NNAPI/CoreML delegates | Third-party; no ONNX path |

**These compose rather than compete.** The sensible build uses OS-native for what it covers free, and one ML runtime for the rest.

### 4.2 Getting the regions

Every option here is Apache-2.0 and commercially clean. Sizes measured from Google's model CDN:

| Model | Gives | Size |
|---|---|---|
| `blaze_face_short_range.tflite` | Face detection. Its paper reports 200–1000+ FPS on flagship devices — free at this budget | **224 KB** |
| `face_landmarker.task` | 478 landmarks incl. iris — defines the beard region and cheek sampling points | **3.6 MB** |
| `hair_segmenter.tflite` | Binary hair mask at 512×512 | **763 KB** |
| `selfie_segmenter.tflite` | Person / background | **244 KB** |
| `selfie_multiclass_256x256.tflite` | `hair · body-skin · face-skin · clothes · accessories` | **15.6 MB**, float32 only |
| `pose_landmarker_lite.task` | 33 body landmarks incl. hips | **5.5 MB** |

Note the asymmetry: the multiclass segmenter is published **float32 only** (the `float16` and `int8` URLs 404) and at 15.6 MB dominates the budget. Since you only need hair, face-skin and clothes — and the face landmarker already gives you the face region — **the 763 KB hair segmenter plus landmark geometry reaches the same place for 5% of the download.** Start there.

### 4.3 Colour — settled, no model

Segment region → trim luminance outliers → cluster in CIELAB → nearest entry in the expanded palette (§3.1–§3.3) → modest caricature exaggeration (§2). Deterministic, microseconds, offline, no licence exposure. **Nine of the fifteen slots need no model at all.** An LLM naming hex codes from a list is close to the worst available tool for the one part of this pipeline with an exact closed-form answer.

### 4.4 The hard one: hair silhouette and garment style

This is the only genuinely difficult stage, and where the options actually diverge. Scored against what matters here — recognisability, privacy, and what it costs to add parts, since your catalogue is growing.

| # | Option | Recognisability | App size | Privacy | Cost to add a part | Verdict |
|---|---|---|---|---|---|---|
| **A** | **Geometric descriptors** from the hair mask — length vs face box, width, symmetry, forehead coverage, outline roughness → 12 families (§3.4) | Moderate; should separate most families | ~0 | Perfect | Retune thresholds | **Ship first** — cheapest thing that could work |
| **B** | **Classifier trained on your own rendered parts** | Good | ~3–10 MB | Perfect | Re-render + retrain | **The target** — see below |
| **C** | **Embedding retrieval** over rendered part thumbnails (DINOv2 / SigLIP, both Apache-2.0) | Unproven here — see caveat | ~25–90 MB | Perfect | **One index row** | Best scaling; test it |
| **D** | **Hosted VLM on your infrastructure** | Good | 0 | Crop leaves device | Edit an enum | Opt-in tier |
| **E** | **Third-party API** | Best today | 0 | Face or crop leaves device | Edit an enum | Opt-in only |
| **F** | ~~On-device VLM~~ | — | 1–2 GB | Perfect | Edit an enum | **Ruled out** |

**Why F is out.** A published case study on a OnePlus 13R (Snapdragon 8 Gen 2) measured **~21 s end-to-end for the fastest 3B-class VLM** — and ~14 s of that was visual preprocessing, not generation, so shorter prompts and constrained decoding don't help. Add a 1–2 GB download and low-end Android OOM behaviour and it fails on three axes at once. Worth revisiting only when a framework lands that uses the NPU for the vision encoder; the same study found the GPU sat at 0% throughout.

**Why B is the target, and it's the strongest idea in this note.** You already own 43 hair parts, 30 torsos, 31 leg pieces **as 3D assets**. Render them onto synthetic heads across pose, lighting and skin tone, and you have unlimited perfectly-labelled training data for your exact vocabulary — no third-party dataset, no licence question, no labelling cost. This isn't speculative: Microsoft's **Hairmony** (SIGGRAPH Asia 2024) predicts hairstyle from a single image trained *exclusively* on 100k synthetic renders, reaching 87.6% mean accuracy with an explicit fairness objective. Same problem, same method, published numbers.

Two things to borrow rather than use directly — Hairmony's data and weights are R-UDA licensed, which explicitly extends non-commercial terms to models trained on them:
- **Its taxonomy structure.** Gathered × Length × Hair Type × Strand Styling, per scalp region. Your `hair_style` enum is a flat list of 43; theirs is orthogonal axes. If you're commissioning parts anyway (§3.6), a factored vocabulary is easier to cover and easier to classify.
- **Its recipe.** Frozen self-supervised backbone (they used DINOv2, Apache-2.0) plus synthetic-only training, which is what bridges render-to-photo.

**The caveat on C.** Retrieval is structurally lovely — the index derives from the catalogue so the two can't drift apart, and a new part costs one row rather than a retraining run. But you'd be matching a q60 photo of a person against a *stylised, non-photorealistic LEGO render*, and CLIP-family zero-shot retrieval is documented to degrade sharply on exactly that domain shift. SigLIP benchmarks best on average, so try it first. **Don't assume zero-shot works — it's a few days to find out**, and if top-5 is strong the confirm-screen UX (§7) makes top-1 weakness survivable.

### 4.5 Face attributes — the `head` slot

Decompose into **glasses (4-way)** and **facial hair (15-way)**, then apply the legality map for the 10 missing combinations (§3.5). Three routes:

- **Facial-hair *presence* needs no classifier.** Take the landmark-defined jaw/chin/upper-lip polygon, subtract what the segmenter labels face-skin, threshold the remaining area. That also gives you the region to sample `facial_hair_color` from, and a genuine "clean-shaven" signal rather than a guessed colour.
- **Glasses** is a small, well-trodden binary-plus-shape classification; a few-MB model, or the same synthetic-render trick using your own head parts.
- **Style within facial hair** is the part that benefits most from option B.

Decomposition also improves *calibration*, not just accuracy: a probability over 4 glasses options means something, where a probability over 50 pre-multiplied labels smears mass across near-duplicates differing only in the other factor.

### 4.6 What the licence wall rules out

Worth stating so nobody reaches for it later. Almost every public face/human parsing dataset and checkpoint is **non-commercial research only** — CelebA, CelebAMask-HQ, LaPa, Microsoft FaceSynthetics, Meta Sapiens (CC-BY-NC-4.0), LIP, and the popular Hugging Face face-parsing models trained on them. CelebA extends its restriction explicitly to "derived data", which reads onto weights.

The trap is worse on the clothing side, where the tags mislead: `segformer_b2_clothes` gets ~408k downloads a month, declares `license: other`, and is trained on an ATR re-upload with **no licence field at all**, while two sibling models on the same data declare MIT. **On Hugging Face, read the `datasets:` field before the `license:` field.**

**None of this constrains the recommended path**, because MediaPipe is Apache-2.0, DINOv2 and SigLIP are Apache-2.0, and option B trains on renders you own.

---

## 5. The recommended architecture

**On-device by default, everything above; hosted only for refinement; third-party only on explicit opt-in.**

| Stage | Slots | What runs | Where |
|---|---|---|---|
| 1 · Detect + landmark | — | Vision / ML Kit, or BlazeFace + face landmarker | **Device** |
| 2 · Hair mask | — | MediaPipe hair segmenter (763 KB) | **Device** |
| 3 · Colours | `skin_color`, `hair_color`, `facial_hair_color`, `body_color`×3, `legs_color`×3 | Cluster + palette match + exaggeration | **Device**, no model |
| 4 · Silhouette family | `hair_style` | Option A now → option B next | **Device** |
| 5 · Face attributes | `head` | Geometry for presence, small classifier for style | **Device** |
| 6 · Garment style | `body`, `legs` | Default; refine later | **Device** / hosted |

Rough budget: face landmarker 3.6 MB + hair segmenter 763 KB + a ~3–10 MB attribute model ≈ **under 15 MB**, running in well under a second. **Latency is not a constraint here** — the earlier finding that a wait-state is a large budget still holds, so spend it on native-resolution segmentation and test-time augmentation rather than banking it.

### The tiers

| Tier | Runs | Leaves the device |
|---|---|---|
| **Default — on-device** | Stages 1–6 above | **Nothing** |
| **Opt-in — your hosted service** | Better silhouette/garment models, higher-res parsing | A **background-removed hair or torso crop** |
| **Opt-in — third party** | Highest accuracy, extra detection | Same crop, explicit consent |
| **Fallback — incapable device** | Remote equivalent of stages 1–6 | Same crop, same consent path |

**Send crops, never the original.** Even in the hosted tiers, a silhouette model needs a masked hair region or a torso crop — not a photograph of a face. That is a materially smaller thing to describe to a user or a regulator, and it costs nothing because the masks are already computed on-device. It also matters more than usual here: this is a product used by children, and the amended COPPA Rule (enforceable since 22 April 2026) treats facial templates as personal information and requires separate parental consent for third-party disclosure absent an "integral to the service" argument.

**Make the tier visible and reversible.** "Better results if you let us process this on our server" is a fair offer — but only if the default is genuinely on-device and the choice is remembered and revocable.

### If the hosted tiers use an LLM

Two things that are cheap and materially improve reliability:

- **Constrain the output.** Your enums are closed, so use hard constraint rather than prompting and hoping. OpenAI's strict Structured Outputs compiles the schema to a grammar and masks invalid tokens (100% schema compliance versus ~86% for function calling); Gemini's `responseSchema` and `text/x.enum` do the same; XGrammar and llama.cpp GBNF give it for open models you host yourself. This guarantees enum *membership* — not that the member is right, but it removes a whole class of repair.
- **Take confidence from logprobs, not from the model's own number.** Self-reported LLM confidence is systematically overconfident, clustering at 80–100% regardless of actual accuracy. Over a constrained enum, the token distribution *is* a distribution over the valid choices — a real posterior, and exactly what the confirm screen in §7 needs.

## 6. Lemojis

Everything above transfers, with one simplification: Lemojis are digital-only, so the parts are not constrained by physical LEGO manufacture. That means **the Lemoji catalogue can close the §3.6 coverage gaps far more cheaply than the Brickie one** — a ponytail or an afro is a mesh, not a moulded part.

Worth considering as a sequencing tactic: **prove the pipeline on Lemojis first.** Same photo, same features, same normalisation, but the vocabulary gaps that currently cap recognisability are yours to fix in software. It de-risks the pipeline while the Brickie parts are being made.

---

## 7. Measure recognisability, not slot accuracy

Per-slot accuracy is the wrong metric here — it would mark down an instantly-recognisable brickie for having the wrong trousers, and mark up an unrecognisable one for getting nine Tier C slots right.

Two cheap measures that track the actual goal:

1. **"Does this look like you?" 1–5, on generation.** Pure telemetry, gates nothing. Segment it by the Tier A slots so you can see whether failures correlate with, say, hair family.
2. **The pick-me-out test.** Show a user their brickie alongside four others generated from different people; can *their friend* pick it? That is a direct, quantitative measure of recognisability, it needs no ground-truth labelling, and it's a fun in-app mechanic in its own right rather than a chore.

The second is the one I'd build. It measures the actual product goal, requires no labelled corpus, and improves as the parts catalogue grows.

**Also record which tier and which model version served each generation.** Without that, no comparison between the on-device path and the hosted tiers is possible even retrospectively.

---

## 8. Sequencing

**This week, no models involved:**

1. **Add the 8 garment colours and 5 hair colours** (§3.1, §3.3). A data edit against the official LEGO range; collapses the worst mismatches from ΔE 30–44 to 7–17 and solves the redhead problem.
2. **Replace the skin auto-match set with the 12-step nougat ladder** (§3.2), and move the stylistic entries to user-selectable only.
3. **Drop or remap the three non-LDraw skin hexes** `#D7BA8C`, `#CCA373`, `#C65127` (§3.2) — this closes a known mapping bug and two undiscovered ones.
4. **Fix `teeth_square_glasse`**, add `n/a` to `facial_hair_color`, fix the `head_accessory.confidence` description, add the dress consistency rule (§3.5, §3.7).
5. **Switch the matcher to CIEDE2000** with a hue-family guard for dark low-chroma colours (§3.1) — now a refinement rather than the primary fix.

**Next:**

5. **Build the pick-me-out measurement** (§7) before changing the pipeline, so improvements are visible.
6. **On-device Tier A prototype** — landmarks, hair mask, colour extraction, silhouette family via geometric descriptors (§4.4 option A). This is the whole privacy win and most of the recognisability, in under 15 MB.
6b. **Then the synthetic-render training set** (§4.4 option B) for hair family and facial-hair style — the step that takes it from "roughly right" to "reliably right", using only assets you already own.
6c. **Test embedding retrieval in parallel** (§4.4 option C). A few days, and if it works it's the only option whose cost per new part is a single index row.
7. **Commission parts against the §3.6 priority list**, in parallel — it's lead-time-bound and it caps everything else.

**Then:**

8. Hosted tier for silhouette refinement, taking crops rather than selfies.
9. Third-party opt-in only if measurement shows it clears the on-device path by enough to be worth the disclosure.

---

## 9. Open questions and caveats

- **The skin ladder and hair additions are computed, not art-directed.** They come from Lab distances against representative real-world colours, using the official `LDConfig.ldr` values. Have someone look at them rendered on an actual brickie before adopting — colour reads differently on a small glossy stud than it does in a table.
- **Physical versus digital matters for the palette expansion.** If brickies are rendered from `.mpd` with colour codes rewritten, any LDraw colour is free. If you ever want a brickie to be *physically buildable*, then a colour is only usable when the specific part is actually moulded in it — which is a much tighter constraint than the 85-colour range, and varies part by part. Worth deciding explicitly which of those you're promising.
- **Whether silhouette family is recoverable from mask geometry alone** is untested. I believe several families separate on simple descriptors, but `bob` vs `short_swept` may not. Worth a quick experiment on a handful of photos before committing.
- **No measured recognisability baseline exists**, so I can't say how good the current pipeline is or how much any of this improves it. §7 fixes that and should come first.
- **The caricature-exaggeration lever is a hypothesis here**, well-supported in the perception literature but untested on LEGO caricatures specifically. Try it as an A/B once §7 exists — and keep the exaggeration modest, since the same literature shows it reverses beyond a point.
- **I haven't looked at the Lemoji catalogue**, only reasoned about it from your description. If its vocabulary differs from the Brickie schema, §6 needs revisiting.
