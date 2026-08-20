# Brickies on-device: recognisability, not accuracy

Research note, 2026-08-20. Third pass, and the first written against **the actual `brickie_schema.json`** rather than a description of it. Supersedes the framing of the earlier notes in this directory.

**What changed.** The goal is an *approximate LEGO caricature that feels immediately recognisable*, not a correct classification. Privacy is paramount and on-device is the default, with hosted and third-party as opt-in tiers and a remote fallback for incapable devices. Parts are colourisable and new ones are being made. Given that, I read the schema and analysed it, and **most of the highest-value findings are in your own data rather than in the model landscape.** Several are fixable this week with no model at all.

---

## TL;DR

1. **Recognisability is carried by four things, not fifteen.** The face-perception literature is consistent that the external hairline is "a powerful frame of reference for the perceptual assessment of individuals' appearances", and that internal and external features are encoded holistically. For a LEGO caricature that means **hair silhouette, hair colour, skin tone, and the glasses/facial-hair combination** carry nearly all of "that's me". Torso and legs carry almost none. Rank the pipeline accordingly — currently all 15 slots get equal engineering attention and 9 of them barely matter.

2. **Your colour matching will be wrong in a specific, fixable way.** Nearest-neighbour by ΔE crosses hue families. Tested against your actual `body_color` palette: **forest green → near-black** (ΔE 35) *even though two greens exist in the palette*; **purple → blue** (ΔE 31) *even though purple exists*; maroon → coral (ΔE 44); mid-brown → grey (ΔE 35). Match **hue family first, then lightness within family**. Zero cost, visibly better output. §3.1.

3. **Only 14 of the 31 `skin_color` entries are plausible skin tones.** The other 17 include LEGO yellow, white, two greys and several bright oranges. Auto-matching across all 31 lets a pale user land on `#F4F4F4` white or `#C8C8C8` grey, and a warm-lit user on `#FA9C1C` orange. **Restrict automatic matching to the plausible subset; keep the rest as deliberate style choices.** §3.2.

4. **43 hair styles collapse to 12 silhouette families**, and two families (bob, short-forward-fringe) account for 20 of the 43. You do not need to distinguish `short_forward_fringe_left_curl` from `short_forward_fringe_left` — nobody will see it. **Classify the family, then pick within it.** A 12-way silhouette decision from a hair mask is dramatically more tractable on-device than a 43-way one, and captures nearly all the recognisability. §3.4.

5. **The hair catalogue cannot represent several large populations at all.** Zero entries for ponytail, bun, braids, updo, dreadlocks, twists, afro or coily hair; a single `curly` covers all texture; effectively no long hair. **No model can fix this — it's a parts problem**, and it caps achievable recognisability for those users at zero regardless of pipeline quality. This is the highest-value place to spend new-part budget. §3.6.

6. **`head` is 15 bases × 4 glasses with 10 combinations missing** — including, notably, that `long_beard` has *no* no-glasses variant. Decompose the slot into two questions, but you must handle the 10 illegal recombinations deliberately. Full list in §3.5.

7. **On-device is achievable for the identity-carrying slots today**, largely without shipping model weights: OS-native face landmarks and person segmentation on both platforms, plus MediaPipe's 763 KB hair segmenter. The hard remainder is silhouette-family classification, which is where a small trained model or a hosted tier earns its place. §4.

8. **Measure recognisability, not slot accuracy.** "Does this look like you?" and a pick-your-friend-from-five test tell you what you actually care about. Per-slot accuracy would mark down a brickie that's instantly recognisable but has the wrong trousers. §7.

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

### 3.1 Nearest-ΔE colour matching crosses hue families

I converted the `body_color` palette to CIELAB and matched common real-world garment colours against it:

| Real colour | Nearest LEGO entry | ΔE | Problem |
|---|---|---|---|
| maroon | `#F06D61` coral | 43.9 | Dark red → salmon pink |
| mid brown | `#8A928D` grey | 35.4 | No brown in palette at all |
| **forest green** | `#1B2A34` near-black | **35.2** | **Palette has two greens** |
| **purple** | `#1E5AA8` blue | **31.0** | **Palette has `#8A12A8` purple** |
| olive/khaki | `#8A928D` grey | 30.4 | No olive |
| tan/beige | `#C8C8C8` light grey | 28.6 | No tan |
| mustard | `#FCAC00` orange | 23.9 | Acceptable |
| navy / black / charcoal | `#1B2A34` | 10–12 | Good |
| white / cream | `#F4F4F4` | 4–12 | Good |

Two distinct problems, with different fixes.

**Problem A — the metric picks the wrong family.** Forest green and purple both have correct-hue entries available and the distance metric doesn't choose them, because dark low-chroma colours sit closer to the dark neutral in Lab than to their own saturated hue. **Fix: two-stage matching.** Classify the source colour into a hue family (red / orange / yellow / green / cyan / blue / purple / magenta / neutral), then choose within that family by lightness. Fall back to the neutral ramp only when chroma is genuinely low. This is a few dozen lines and it fixes the two worst cases outright.

**Problem B — the palette genuinely lacks common clothing colours.** There is no brown, tan, beige, olive or maroon in the 23-colour garment palette, and no true black (`#1B2A34` is a very dark blue-grey). Those are among the most common real-world clothing colours. No algorithm fixes this. If garment colour matters to you, **the cheapest high-value palette additions are brown, tan/beige, and olive.** If it doesn't matter much — and per §2 it's Tier B — then accept it and let the hue-family rule keep the errors sane.

### 3.2 The skin palette needs partitioning before it's used for matching

Of 31 `skin_color` entries, I classify **14 as plausible skin tones** and **17 as not**:

`#1B2A34`, `#352100`, `#BCB4A5`, `#C65127`, `#C8C8C8`, `#D67923`, `#D7BA8C`, `#D86D2C`, `#F4F4F4`, `#F58624`, `#F6A9BB`, `#FA9C1C`, `#FAC80A`, `#FCAC00`, `#FECCCF`, `#FFD67F`, `#FFEC6C`

That set includes classic LEGO yellow, white, two greys, several bright oranges and two pinks. They clearly belong in the palette as *stylistic* options — but if automatic matching can reach them, then under warm indoor light a real skin tone can land on `#FA9C1C` bright orange, and a very pale user under a bright window can land on `#F4F4F4` white.

**Fix: split the enum into `skin_auto` (the plausible 14) and `skin_style` (the rest).** Match automatically only into the first; expose the second in the editor. This is a one-line change to the matching set and removes a whole class of alarming output. *(My 14/17 split is heuristic — hue 20–75°, moderate chroma, mid lightness. Sanity-check it by eye before adopting; it's a starting point, not an authority.)*

### 3.3 There is no ginger in the hair palette

Of 28 `hair_color` entries, only **7 are natural-ish**: `#1B2A34` (black), `#645A4C` (dark grey-brown), `#764D3B` (brown), `#8A928D` (grey), `#C8C8C8` (light grey), `#DEAC66` (dark blonde), `#DFC176` (blonde). The remaining 21 are fantasy colours.

Matching real hair colours into the natural subset:

| Real | Match | ΔE |
|---|---|---|
| jet black | `#1B2A34` | 14.6 |
| platinum | `#C8C8C8` | 13.3 |
| ginger / auburn | `#764D3B` brown | 17.6 |
| copper red | `#764D3B` brown | **30.1** |

**Redheads become brunettes.** Globally that's a small population; in Ireland and Scotland it's roughly a tenth of users, and it's a highly distinctive feature — exactly the kind the caricature literature says you should be *exaggerating*, not erasing. **One additional palette entry around `#A0522D`–`#B5651D` would fix it**, and hair colour is Tier A. Best value-per-effort item in this note.

Also note the natural ramp has no light/ash brown between `#764D3B` and `#DEAC66`, so mid-brown hair jumps to blonde or dark brown. Less severe, but a second candidate addition.

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
5. *(Colour)* **ginger/auburn** per §3.3.

By contrast, an eleventh short-forward-fringe variant adds nearly nothing — §3.4 shows you already have ten and users can't distinguish them.

### 3.7 Smaller schema bugs

- `facial_hair_color` — the "return `n/a` if no facial hair" instruction is attached to the **confidence** field, and `n/a` is **not** in the value enum (28 colours, no `n/a`). `head_accessory_color` gets this right (24 = 23 + `n/a`). **Fix: add `n/a` to the `facial_hair_color` value enum and move the instruction to the value field.**
- `head_accessory.confidence` description reads "The confidence level of the **body** prediction" — copy-paste.
- **A dress spans `body` and `legs`.** `dress_large_sleeves*` in `body` and `plain_dress`/`stripe_dress`/etc. in `legs` must agree; nothing in the schema enforces it, and independent slot-filling can produce a dress top with trousers. Enforce in the normaliser.

---

## 4. The on-device pipeline

Ordered by the Tier A/B/C ranking, not by slot order.

**Stage 1 — face and regions.** Available with little or no shipped weight:

| Capability | iOS | Android |
|---|---|---|
| Face detect + landmarks | Vision (OS) | ML Kit Face Detection |
| Person / background | Vision person segmentation (OS, iOS 15+) | ML Kit Selfie Segmentation (~4.5 MB) |
| Hair mask | MediaPipe hair segmenter (763 KB) | same |

The hair segmenter is the one real model, and it is small. It descends from Google's *Real-time Hair Segmentation and Recoloring on Mobile GPUs* work, so it is designed for exactly this budget.

**Stage 2 — Tier A slots.**

- `skin_color` — sample the cheek/forehead regions from face landmarks, avoiding specular highlights and shadow, average in Lab, match into the **plausible-14 subset** (§3.2) with hue-family matching (§3.1) and modest caricature exaggeration (§2).
- `hair_color` — hair mask minus highlights, match into the **natural-7 subset** (§3.3) unless chroma is high enough to indicate genuinely dyed hair, in which case open up the fantasy set. That conditional is worth having: it means dyed hair, which is highly distinctive, gets represented rather than flattened to brown.
- `hair_style` — **silhouette family from mask geometry** (§3.4), then a representative or a cheap within-family refinement.
- `head` — glasses (4-way) and facial hair (15-way) as two small classifications, then the legality map from §3.5. Glasses detection is well-trodden; facial-hair presence can be bootstrapped from the landmark-defined beard region minus the face-skin mask, which needs no classifier at all for presence, only for style.

**Stage 3 — Tier B.** `body_color` from the torso region below the face box, k-means k=3, hue-family matched. `head_accessory` presence from whether the hair mask is truncated by a non-hair region above the hairline.

**Stage 4 — Tier C.** Defaults. `legs` and its three colours are not observable in a selfie; pick a sensible default, or derive `legs_color` from the torso colour so the figure at least coheres. **Do not guess.** A stable default beats a random one — if it varies between regenerations of the same photo, the user reads it as the product being broken.

---

## 5. Tiering, and where the face goes

Your stated preference maps cleanly onto the slot ranking:

| Tier | What runs | What leaves the device |
|---|---|---|
| **Default — on-device** | Everything in §4 | **Nothing** |
| **Opt-in — your hosted service** | Better silhouette/garment models | Ideally a **background-removed hair-and-shoulders crop**, not a raw selfie |
| **Opt-in — third party** | Highest accuracy, extra features | Same crop, with explicit consent |
| **Fallback — incapable device** | Remote equivalent of §4 | Crop, with the same consent path |

Two points worth building in from the start.

**Send crops, never the original.** Even in the hosted tiers, what the silhouette model needs is a masked hair region or a torso crop — not a photograph of a face. That is a materially smaller disclosure to describe to a user or a regulator, and it costs nothing since you're already computing the masks on-device.

**Make the tier visible and reversible.** "Better results if you let us process this on our server" is a reasonable offer; it's only reasonable if the default is genuinely on-device and the choice is remembered and revocable.

---

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

1. **Hue-family colour matching** (§3.1) — fixes forest-green-to-black and purple-to-blue outright.
2. **Restrict skin matching to the plausible subset** (§3.2).
3. **Fix `teeth_square_glasse`**, add `n/a` to `facial_hair_color`, fix the `head_accessory.confidence` description, add the dress consistency rule (§3.5, §3.7).
4. **Add a ginger/auburn hair colour** (§3.3).

**Next:**

5. **Build the pick-me-out measurement** (§7) before changing the pipeline, so improvements are visible.
6. **On-device Tier A prototype** — landmarks, hair mask, colour extraction, silhouette family. This is the whole privacy win and most of the recognisability.
7. **Commission parts against the §3.6 priority list**, in parallel — it's lead-time-bound and it caps everything else.

**Then:**

8. Hosted tier for silhouette refinement, taking crops rather than selfies.
9. Third-party opt-in only if measurement shows it clears the on-device path by enough to be worth the disclosure.

---

## 9. Open questions and caveats

- **My 14/17 skin split and 7/21 hair split are heuristic**, computed from hue and chroma bounds. They're a starting point; check them by eye.
- **Whether silhouette family is recoverable from mask geometry alone** is untested. I believe several families separate on simple descriptors, but `bob` vs `short_swept` may not. Worth a quick experiment on a handful of photos before committing.
- **No measured recognisability baseline exists**, so I can't say how good the current pipeline is or how much any of this improves it. §7 fixes that and should come first.
- **The caricature-exaggeration lever is a hypothesis here**, well-supported in the perception literature but untested on LEGO caricatures specifically. Try it as an A/B once §7 exists — and keep the exaggeration modest, since the same literature shows it reverses beyond a point.
- **I haven't looked at the Lemoji catalogue**, only reasoned about it from your description. If its vocabulary differs from the Brickie schema, §6 needs revisiting.
