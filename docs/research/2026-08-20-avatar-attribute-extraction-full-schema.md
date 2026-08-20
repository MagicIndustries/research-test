# Extracting a full avatar schema from a photo: what the field list changes

> **Superseded.** This note is kept for provenance only. The current, consolidated position is [HANDOVER-brickie-generation-pipeline.md](HANDOVER-brickie-generation-pipeline.md), which resolves the contradictions between these notes and folds in later corrections.

Research note, 2026-08-20. Companion to [the facial-attribute note](2026-08-20-selfie-facial-attribute-extraction.md), which assumed a face-only schema. The **actual** production schema is wider and the widening changes the recommended architecture.

**The schema currently extracted by asking OpenAI to analyse the image:**

```
body, body_color, body_color_2, body_color_3,
facial_hair_color,
head, head_accessory, head_accessory_color,
hair_color, hair_style,
legs, legs_color, legs_color_2, legs_color_3,
skin_color
```

**Operating conditions** (unchanged): commercial Unity mobile app, not a game; 3D in places; no frame-rate budget; single-shot — user captures or picks a photo, then waits; **10 second ceiling**; preference on-device > self-hosted > third-party API.

---

## TL;DR

1. **This is not an attribute-classification schema. It's an avatar asset-and-tint schema** — and that reframing makes the problem substantially easier. Four categorical slots (`body`, `legs`, `head`, `head_accessory`) that map onto *your own asset catalogue*, plus colour slots that are palette extraction. Three colours per garment (`_color`, `_color_2`, `_color_3`) is the signature of a multi-tint material system, not of a classifier.

2. **That reframing routes around the licence wall almost entirely.** If the categorical slots are retrieval against a catalogue you own, you don't need anyone's labelled human data. Render your catalogue, embed it with an Apache-2.0 backbone, embed the segmented photo region, nearest-neighbour. No CelebA, no LIP, no ATR, no Sapiens.

3. **A selfie cannot show legs, and an LLM asked for `legs_color` will answer anyway.** This is the most important practical finding in this note and it applies to your *current* system. A vision LLM given a head-and-shoulders photo and a schema containing `legs_color_3` will confabulate a plausible value rather than decline. A segmentation pipeline returns "not visible" instead. See §2.

4. **Body-versus-legs needs no human-parsing dataset.** MediaPipe gives you one `clothes` class, not upper and lower — but it also gives you 33 pose landmarks including hips, under the same Apache-2.0 licence. Split the clothes mask on the hip line. That is the whole trick, and it removes the only remaining reason to touch LIP, ATR or Sapiens.

5. **In this field, ontologies travel and pixels don't.** Hairmony's hairstyle taxonomy, Fashionpedia's apparel ontology (**CC BY 4.0**, commercial use permitted), and the Monk Skin Tone scale are all reusable. The image corpora and the weights trained on them almost never are. Build on the vocabularies, not the checkpoints.

6. **Do not trust Hugging Face licence tags.** `segformer_b2_clothes` has ~408,000 downloads a month, declares `license: other`, and is trained on a re-upload of ATR that declares **no licence at all**. Two sibling models trained on the same data declare **MIT**. An uploader can only grant what they hold. See §5.

7. **The two weakest attributes from the earlier note are gone.** No `eye_color`, no `wears_glasses`. Everything in this schema is either a colour (easy) or a catalogue lookup (tractable). `facial_hair_color` is the one genuinely awkward addition, and §6 has a licence-clean way to get it.

---

## 1. Reading the schema

The field names carry more design information than they might appear to.

| Pattern | What it implies |
|---|---|
| `body`, `legs`, `head`, `head_accessory` | Categorical **slots**. Almost certainly asset identifiers or category labels from a fixed catalogue, not free text. |
| `body_color` ×3, `legs_color` ×3 | **Three tint channels per garment** — primary/secondary/tertiary. This is a material-tinting convention, and it means the target is a *palette*, not a colour name. |
| `head_accessory_color` ×1 | One tint. Accessories get a simpler material. |
| `hair_color`, `facial_hair_color`, `skin_color` | Single colours on **body regions** rather than garments. |
| `hair_style` | The only genuinely open-vocabulary field. Covered in the companion note (§2b there) — Hairmony's taxonomy decomposes it. |

Two consequences:

**Colour slots want clustering, not classification.** Asking a model "what colour is the shirt" throws away information when the shirt has three colours. Running k-means with k=3 over the segmented garment region in a perceptually uniform space (CIELAB) gives you exactly three tints, ordered by pixel coverage, which is what the schema is shaped to receive. This is arithmetic — no model, no licence, no training data.

**Categorical slots want retrieval, not classification.** A classifier must be retrained whenever you add an asset. An embedding-plus-nearest-neighbour lookup does not: you render the new asset, embed it, add one row to the index. Given that a game-adjacent app's catalogue grows continuously, retrieval is the right structure almost regardless of accuracy considerations.

**One field I can't interpret confidently: `head`.** It sits alongside `head_accessory`, so it isn't headwear. It could be head/face mesh shape, a skin-tone-linked head asset, or a face-shape category. I've assumed *"an asset identifier for the head/face mesh"* throughout. If it means something else — face shape descriptor, for instance — tell me and §6 changes for that row only.

---

## 2. The visibility problem — and why it matters most right now

**A head-and-shoulders selfie contains no legs.** The schema has four leg fields. Something has to give, and it's worth knowing what currently gives.

Vision LLMs are strongly disposed to complete a schema they've been handed. Given a portrait crop and asked for `legs_color_2`, the overwhelmingly likely behaviour is a plausible invented value — not a refusal, not a null. The output is well-formed JSON, so nothing downstream flags it. **This is a silent data-quality failure, and it is invisible in exactly the way that makes it dangerous: the pipeline looks like it's working.**

Three things worth doing regardless of which architecture you land on:

- **Audit your current output.** Take a set of portrait-cropped photos where legs are definitively not visible, run your existing OpenAI extraction, and look at what comes back in the four leg fields. If they're populated with confident values, you have quantified the problem in an afternoon. If they're null or refused, that's genuinely good news and worth knowing too.
- **Add explicit visibility flags to the schema.** `legs_visible: false` is worth more than a guessed `legs_color`. It lets the app fall back to a default or ask the user, rather than dressing an avatar from a hallucination.
- **Decide the product answer.** Either require a full-body or three-quarter photo for the leg fields, or accept defaults for what isn't visible and say so in the UI. Both are fine; silently guessing is not.

**A segmentation-based pipeline gets this right for free.** If there is no lower-clothes region below the hip line, there is no mask, and the field is genuinely absent rather than invented. That is a real architectural advantage over the LLM approach, independent of accuracy on the fields that *are* visible.

The same logic applies more mildly to `facial_hair_color` on a clean-shaven subject, and to `head_accessory_color` when there's no accessory. In each case "absent" is a meaningful answer that a schema-completing LLM is reluctant to give.

---

## 3. The recommended architecture

Four stages. Every component is Apache-2.0 or your own.

**Stage 1 — Detect and segment.** MediaPipe, all Apache-2.0, all measured off Google's model CDN on 2026-08-20:

| Model | Purpose | Size |
|---|---|---|
| `blaze_face_short_range.tflite` | Face detection / alignment | 224 KB |
| `selfie_multiclass_256x256.tflite` | `background · hair · body-skin · face-skin · clothes · accessories` | 15.6 MB |
| `hair_segmenter.tflite` | Sharper hair mask, 512×512 | 763 KB |
| `face_landmarker.task` | 478 landmarks, for the facial-hair region | 3.6 MB |
| `pose_landmarker_lite.task` | 33 body landmarks incl. hips | 5.5 MB |
| `pose_landmarker_full.task` | Same, more accurate | 9.0 MB |

**Stage 2 — Split clothes into body and legs geometrically.** The multiclass segmenter emits a single `clothes` class. The pose landmarker gives you left and right hip landmarks. Take the hip line, and partition the clothes mask above and below it: above is `body`, below is `legs`. Refine with the knee and shoulder landmarks if you want a cleaner cut, and use the presence or absence of hip landmarks in frame as your visibility flag from §2.

This is the load-bearing trick in this note. It replaces the entire category of human-parsing models — SCHP, Graphonomy, Sapiens, the ATR-derived SegFormers — all of which carry licence problems (§5), with two Apache-2.0 models and some geometry.

**Stage 3 — Colours by clustering.** For each region mask (upper clothes, lower clothes, hair, face-skin, accessory, facial hair):

1. Drop specular highlights and deep shadow — the top and bottom few percent by luminance — since both are lighting, not material.
2. Convert to CIELAB.
3. k-means, k=3 for garments and k=1 for single-colour fields.
4. Order clusters by pixel coverage → `_color`, `_color_2`, `_color_3`.
5. Snap to your palette. For `skin_color`, snap to the **Monk Skin Tone scale** — a 10-point open scale explicitly decoupled from race, now preferred over Fitzpatrick in computer vision.

No model, no training data, no licence exposure. Handle white balance first; under uncontrolled lighting, illumination is often a larger effect than the material colour.

**Stage 4 — Categorical slots by catalogue retrieval.** This is the part that removes the licence problem:

1. Render every asset in your catalogue from a few canonical angles — you already have the assets and the 3D pipeline.
2. Embed each render with **DINOv2** (Apache-2.0) or **SigLIP** (Apache-2.0). Both are permissively licensed on the repo *and* the weights.
3. Store the embeddings. This is your index, and it is small.
4. At runtime, embed the masked photo region and take the nearest neighbour.

**Why this is the right structure here**, beyond licensing: adding an asset is one embedding and one index row, not a retraining run. You get a similarity score for free, which is a natural confidence signal for the "confirm your look" screen. And it degrades gracefully — an unfamiliar garment returns the closest thing you actually own, which is exactly what an avatar system needs, rather than a confident wrong class.

**`hair_style` is the exception** and should stay a classifier over Hairmony's taxonomy — see the companion note. Style is a property of the hair's arrangement rather than a catalogue item, so retrieval fits it less well.

---

## 4. Field-by-field

| Field | Route | Difficulty | Note |
|---|---|---|---|
| `skin_color` | face-skin mask → Lab → Monk scale | Easy | Lighting dominates; normalise white balance |
| `hair_color` | hair mask → Lab → k=1 | Easy | Use the 763 KB dedicated hair segmenter |
| `body_color` ×3 | upper-clothes mask → k-means k=3 | Easy | Order by coverage |
| `legs_color` ×3 | lower-clothes mask → k-means k=3 | Easy | **Gate on visibility** |
| `head_accessory_color` | accessory mask → k=1 | Easy | Absent when no accessory |
| `facial_hair_color` | see §6 | Moderate | No commercially-clean beard mask exists |
| `body` | upper-clothes mask → DINOv2 retrieval | Moderate | Needs your catalogue rendered |
| `legs` | lower-clothes mask → DINOv2 retrieval | Moderate | **Gate on visibility** |
| `head_accessory` | accessory mask → retrieval | Moderate | Small catalogue, should be reliable |
| `head` | *definition unclear* | ? | Assumed head/face mesh asset → retrieval |
| `hair_style` | Hairmony taxonomy classifier | Moderate | See companion note §2b |

---

## 5. The licence chain, extended to clothing

The companion note established that face datasets are almost uniformly non-commercial. The clothing and human-parsing side is the same, with an additional hazard: **the licence tags are actively misleading.**

| Asset | Covers | Stated licence | Real position |
|---|---|---|---|
| **MediaPipe models** | hair, skin, clothes, accessories, pose | Apache-2.0 | **Clean — use these** |
| **DINOv2 / SigLIP** | embeddings | Apache-2.0 | **Clean** |
| **Fashionpedia ontology** | 27 apparel categories, 19 parts, 294 attributes | **CC BY 4.0** | **Clean for the ontology** — images are not theirs |
| LIP (Look Into Person) | 20 classes incl. upper-clothes, pants, skirt | Non-commercial | Barred |
| Meta **Sapiens** | 28 body-part classes | **CC-BY-NC-4.0** | Barred; commercial licence by arrangement |
| ATR / HumanParsing-Dataset | 18 classes | **None stated** | Ambiguous — see below |
| `segformer_b2_clothes` | ATR-derived, ~408k downloads/mo | `other` | **Chain is broken** |
| `segformer_b3/b0_clothes` | same data | **`mit`** | **Chain is broken** |
| SCHP (code) | human parsing | MIT *code* | Weights inherit LIP's restriction |

**On the SegFormer clothes models.** These are the most-used clothing segmenters on Hugging Face by a wide margin. The chain is: original **ATR** dataset ([lemondan/HumanParsing-Dataset](https://github.com/lemondan/HumanParsing-Dataset)) states no formal licence at all — only *"Please cite our two papers if you use this dataset for academic and commercial research"*, which gestures at permission without granting it. It was re-uploaded to Hugging Face as `mattmdjaga/human_parsing_dataset` with **no licence field**. Models trained on that re-upload then declare `other` and `mit`.

An uploader cannot grant rights they don't hold. The MIT tag on those weights is an assertion, not a licence audit, and it is exactly the kind of thing that looks fine until someone does diligence on your app. **The general lesson: on Hugging Face, read the `datasets:` field before the `license:` field.** The licence that binds you is the most restrictive one anywhere up the chain.

The good news is that §3's architecture doesn't need any of the barred rows.

**On Fashionpedia**, worth being precise because it's the one genuinely permissive dataset here. Its terms split the two halves cleanly: the **annotations and ontology are CC BY 4.0**, so commercial use with attribution is fine. But *"Fashionpedia does not own the copyright of the images. Use of the images must abide by the Terms of use of Flickr, Unsplash, Burst by Shopify, Freestocks, Kaboompics, and Pexels."* Most of those sources are permissive; **Flickr is the risky subset**, since per-image terms there range from CC0 to all-rights-reserved. So: use the ontology freely, and treat the image corpus as requiring per-source diligence you probably don't need to do at all.

---

## 6. `facial_hair_color` — the one awkward field

There is no commercially-licensed beard segmentation model. MediaPipe has no beard class. CelebAMask-HQ's 19 classes don't include one. Microsoft's FaceSynthetics *does* have `BEARD(14)` — and is non-commercial.

**Derive it geometrically instead.** The face landmarker gives you 478 points, which defines the jaw, chin and upper-lip regions precisely. Within that beard zone:

1. Take the pixels inside the jaw/chin/upper-lip polygon.
2. Subtract everything the multiclass segmenter labels `face-skin`.
3. What remains inside the zone is facial hair — plus some shadow, which the luminance trim in §3 already removes.
4. If the remaining area is below a threshold, the subject is clean-shaven: return absent, not a colour.
5. Otherwise, cluster as normal.

This is licence-clean, needs no training data, and gives you a *presence* signal as a by-product — which you may want as a field in its own right, since `facial_hair_color` on a clean-shaven face is the same confabulation trap as `legs_color` on a portrait.

**Don't substitute hair colour as a proxy.** Beard and scalp hair colour diverge often enough — greying happens at different rates — that it would be a visible error on a meaningful fraction of users.

---

## 7. If you stay on OpenAI

You're on a third-party vision API today, and there are reasons that might remain the right call — it works now, it handles open-vocabulary values, and it needs no ML engineering. Four things to weigh:

**Policy.** OpenAI's usage policies restrict facial-recognition and biometric-identification use cases, and have constrained image-based person analysis, citing the risk of unsafe assessments of attributes like gender or emotional state. `skin_color` inference from a face is the field that sits closest to that line. A consenting user submitting their own photo for avatar creation is materially different from surveillance — but it's worth an explicit read from the vendor rather than an assumption, particularly since this is a shipping commercial product.

**The confabulation problem in §2 is a property of the LLM approach**, and prompt engineering only partly mitigates it. Explicitly instructing "return null for anything not visible in the image" helps and is worth doing today, but it is a request rather than a guarantee. Adding visibility flags to the schema and validating them is more robust.

**Cost and latency scale per image**, where the on-device pipeline is a fixed download and free at runtime. At the 10-second ceiling, a frontier vision API typically fits at p50 — but with a hard ceiling, **p99 is the number that matters**, and network paths have long tails that on-device inference doesn't.

**Privacy.** Every photo leaves the device. That brings the full biometric-privacy surface into play — BIPA treats facial geometry extracted from a photograph as a biometric identifier, applies based on where your *user* is, and carries $1,000–5,000 per-violation statutory damages. On-device processing with no upload substantially reduces that exposure.

**A sensible middle path:** keep OpenAI as the *labelling engine* and move inference on-device. Use it to bulk-label your own rendered catalogue and any consented photos, distil into the small pipeline in §3, and stop sending user photos anywhere. You keep the open-vocabulary strength where it's cheap — at build time — and pay specialist economics at runtime.

---

## 8. What I'd do

1. **Run the §2 audit this week.** Portrait-cropped photos through your current extraction, look at the leg fields. It's an afternoon and it sizes a problem you may not know you have.
2. **Add visibility flags to the schema** regardless of architecture. `*_visible: bool` per region.
3. **Prototype the geometry**, not the models: MediaPipe multiclass segmenter + pose landmarker in Unity, hip-line split, k-means palette extraction. This delivers **nine of the fifteen fields** — every colour field — with nothing but Apache-2.0 assets and arithmetic. It's also the cheapest way to validate the Unity inference plumbing.
4. **Then build the retrieval index** for `body`, `legs`, `head`, `head_accessory` from your own rendered catalogue with DINOv2. No third-party labelled data required.
5. **`hair_style` last**, using Hairmony's taxonomy — it's the only field needing a trained classifier, and the companion note covers it.
6. **Keep the "confirm your look" screen.** With retrieval you get similarity scores, so you can surface the two or three closest catalogue matches per slot and let the user pick. That turns your weakest signal into a feature.

---

## 9. Open questions

- **What is `head`?** The one field I couldn't interpret. Assumed head/face mesh asset ID. If it's a face-shape descriptor, that row changes.
- **What vocabulary do `body` and `legs` currently take?** If they're free-text garment descriptions from the LLM rather than catalogue IDs, the retrieval recommendation still holds but you'd need a mapping layer — and it's worth asking whether free text was ever the right target.
- **What does your current system return for non-visible regions?** §2's audit answers this and it materially affects priority.
- **Does your catalogue exist as renderable 3D assets today?** The whole retrieval approach assumes yes. If assets are 2D sprites, embed those instead — the method is unchanged.
- **Fashionpedia ontology adoption** — CC BY 4.0 with attribution. Straightforward, but confirm the attribution requirement is compatible with where it'd surface in your app.
- **Whether OpenAI's policies permit this use** — a judgement call on policy text, not a documented carve-out, and worth an explicit vendor enquiry given it's a shipping product.
- **Accuracy of the hip-line split** on seated, cropped, or unusually-posed subjects. The geometry is sound for standing figures; edge cases need measuring.
