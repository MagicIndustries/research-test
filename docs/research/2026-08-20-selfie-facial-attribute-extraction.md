# Extracting facial attributes from a selfie: models, services, and the licensing trap

Research note, 2026-08-20. Question: find a model or service that takes a selfie and returns structured attributes (`hair_colour`, `skin_colour`, `eye_colour`, `wears_glasses`, `head_accessory`, `hair_style`, …), preferring (1) on-device inside a Unity mobile app, failing that (2) self-hosted on infrastructure we control, failing that (3) a third-party API.

**Operating conditions** (these drive most of the conclusions below): a **commercial mobile app**, not a game — Unity is the platform because parts of the app work in 3D space. There is **no frame-rate budget**. The interaction is single-shot: the user takes a selfie or picks a photo from their library, then **waits on a progress state while processing runs**. One image, one result, user attention already parked. **The latency budget is up to 10 seconds** end-to-end — see §3b, which is where that number does real work.

## TL;DR

1. **The technical problem is solved; the licensing problem is not.** Face parsing and facial-attribute classification are mature and small. But **every** major public dataset in this space — CelebA, CelebAMask-HQ, LaPa, Microsoft FaceSynthetics — is **non-commercial research only**, and so is essentially every pretrained face-parsing checkpoint you will find on Hugging Face. This is a commercial app, so most of the obvious off-the-shelf answers are unusable as-is. **This is the finding that constrains the design; everything else is a tractable engineering choice.**

2. **The one commercially-clean on-device foundation is Google's MediaPipe / AI Edge model zoo (Apache-2.0)**, specifically the **Multi-class Selfie Segmenter** (`background, hair, body-skin, face-skin, clothes, others (accessories)`) plus **BlazeFace** for detection. That gets you `hair_colour` and `skin_colour` cleanly via segment-then-quantise-colour. It does *not* give you glasses, hat, eye colour, or hairstyle — those need a classifier you train yourself on licensed or self-collected data.

3. **10 seconds is generous for everything except one option — and it rules that one out.** The specialist on-device pipeline uses maybe 1–2 s of it, so the surplus should be spent on accuracy: native-resolution segmentation, no speed-driven quantisation, test-time augmentation. A server round-trip fits comfortably. **An on-device VLM does not fit** — the best measured 3B-class VLM on a flagship Android phone takes ~21 s end-to-end, more than twice the ceiling (§3b). That reverses the tentative "genuine contender" verdict I reached before the number was known.

4. **Watch cold start and the latency tail, not the mean.** Unity's Inference Engine allocates buffers, compiles GPU kernels and uploads weights on first run — "a one-time delay of several seconds", which would eat a third of your ceiling if it lands inside the measured window. Warm the model up on an earlier screen. And with a hard ceiling, **p99 is the number that matters, not p50** — which is a real argument for on-device, whose latency is predictable, over network paths, whose tails are not.

5. **Recommended build: a small pipeline in Unity, not a single model.** Detect → align → segment → colour-quantise for the colour attributes, plus one multi-head classifier for the categorical ones. Unity's own **Sentis / Inference Engine** package is the natural runtime and already ships a validated Apache-2.0 BlazeFace conversion. On-device remains the default recommendation — but now on **privacy and operating cost**, not speed.

7. **Third-party APIs are a poor fit for this specific attribute list.** AWS Rekognition and Face++ do not return hair colour, skin tone, or eye colour at all. Azure Face does return hair colour and accessories — but the entire Azure Face service is now gated to "Microsoft managed customers and partners", and `hair` is specifically in the *limited* capability set on top of that. Frontier VLM APIs (Claude, GPT) can produce exactly the JSON you want but their usage policies restrict biometric attribute inference.

8. **`eye_colour` is the weakest link** at any tier and should be treated as best-effort or dropped.

9. **`hair_style` is much closer to solved than it first appeared — see §2b.** Microsoft's **Hairmony** (SIGGRAPH Asia 2024) predicts hairstyle from a single image, trained *entirely on synthetic data*, at 87.6% accuracy with an explicit fairness objective. Its 74-label taxonomy decomposes `"long pony tail"` as `Gathered: Ponytail` + `Length: Mid-Back`, and keeps **hair *type*** (curl geometry: straight/wavy/curly/coily) separate from **hair *style*** (arrangement) — a distinction your schema should copy. The datasets are non-commercial under R-UDA, but the taxonomy and the synthetic-training recipe are the genuinely valuable parts, and both are reproducible.

---

## 1. The attribute list, ranked by how hard each one actually is

| Attribute | Difficulty | Best route | Main failure mode |
|---|---|---|---|
| `hair_colour` | Easy | Segment hair region, quantise colour in a perceptual space | White balance / lighting; dyed & multi-tone hair |
| `skin_colour` | Easy technically, **sensitive** | Segment `face-skin`, map to a published scale | Illumination dominates the signal; fairness/ethics |
| `wears_glasses` | Easy | Binary classifier or parsing class | Rimless frames; sunglasses vs. clear |
| `head_accessory` | Easy–moderate | Classifier / parsing class | Open vocabulary ("hat" vs. beanie vs. headscarf) |
| `hair_style` (e.g. `"long pony tail"`) | **Hard** | Custom classifier over a defined taxonomy | No commercial off-the-shelf source; needs labelled data |
| `eye_colour` | **Hard** | High-res iris crop + classifier | Iris is tiny in a selfie; hazel/green poorly separable |

Two notes on the hard ones:

- **Eye colour.** In a typical front-camera selfie the visible iris is on the order of tens of pixels, often partly occluded by eyelid and specular highlight. Even in the well-controlled genomic-prediction literature, blue and brown are predicted well while intermediate colours are not — one study reports classifier accuracy rising from 84.6% to 94.6% simply by *excluding* hazel-eyed participants ([IrisPlex / eye colour ML](https://www.academia.edu/35797944/Genomic_Eye_Color_Classification_using_Machine_Learning)). Expect a usable blue/brown/dark split and unreliable green/hazel/amber. Design the app so a wrong eye colour is cosmetic, not load-bearing. The wait-state does buy you something real here, though: you can afford a high-resolution iris crop and multiple inference passes, which a real-time budget would forbid.
- **Hair style, and why it isn't hair type.** These are two different axes and the literature keeps them apart:
  - **Hair *type*** means curl geometry — straight / wavy / curly / coily. This is the Andre Walker 1A–4C axis, and it's what CelebA's `Straight_Hair` / `Wavy_Hair` flags measure.
  - **Hair *style*** means arrangement — ponytail, bun, braid, updo, parting, bangs. This is what `"long pony tail"` describes.

  You almost certainly want both, and they need separate label sets. See §2b — a published, expert-designed taxonomy already exists that models both, and it decomposes `"long pony tail"` exactly as you'd want.

  Other public options are **Hairstyle30k** (30k images, 64 flat hairstyle classes, from [Learning to Generate and Edit Hairstyles](https://yanweifu.github.io/papers/hairstyle_v_14_weidong.pdf)) and **K-Hairstyle** (~500k high-resolution images with attributes annotated by professional stylists plus segmentation masks — `Basestyle` (31 types), `Length`, `Curl`, `Bang`, `Side`, `Loss`, `Color`, and `Rgb`, the mean RGB of the hair region: [project page](https://psh01087.github.io/K-Hairstyle/) / [ICIP 2021](https://ieeexplore.ieee.org/document/9506557/)). Both are research releases; verify terms before commercial use. Both are superseded for your purpose by Hairmony below. A pragmatic alternative is to derive coarse style from the hair mask geometry (length below jawline, silhouette width, presence of a protruding tail region) rather than classify style directly.

---

## 2. The licensing trap — read this before anything else

This is the finding most likely to change the plan.

| Dataset | Classes relevant to us | Licence |
|---|---|---|
| CelebA (40 binary attributes) | `Eyeglasses`, `Wearing_Hat`, `Blond_Hair`, `Straight_Hair`, `Wavy_Hair`, `Bald`, … | **Non-commercial research only** |
| CelebAMask-HQ (19-class parsing) | `hair`, `hat`, `eye_g`, `skin`, `l_eye`/`r_eye`, … | **Non-commercial research only** |
| LaPa (22k images, 11 classes) | includes hair | **Non-commercial only** |
| Microsoft FaceSynthetics (19 classes, synthetic) | `HAIR(13)`, `GLASSES(16)`, `HEADWEAR(17)` | **Non-commercial research only** |
| EasyPortrait (40k, 9 classes) | face skin, brows, eyes, lips, teeth — **no hair class** | Doesn't cover our attributes anyway |
| **MediaPipe / Google AI Edge models** | `hair`, `face-skin`, `body-skin`, `clothes`, `others (accessories)` | **Apache-2.0 — commercial use OK** |

The CelebA agreement is explicit: *"The CelebA dataset is available for non-commercial research purposes only"* and *"You agree not to reproduce, duplicate, copy, sell, trade, resell or exploit for any commercial purposes, any portion of the images and any portion of derived data"* ([CelebA project page](https://mmlab.ie.cuhk.edu.hk/projects/CelebA.html)). "Derived data" is the operative phrase — it reads onto weights trained from those images.

This propagates to the checkpoints. The most popular face-parsing model on Hugging Face, [`jonathandinu/face-parsing`](https://huggingface.co/jonathandinu/face-parsing) (SegFormer fine-tuned from `nvidia/mit-b5`, 84.6M params, the full 19-class CelebAMask-HQ label set, ONNX and Transformers.js exports available), is licensed **for non-commercial research and educational purposes only**. The widely used BiSeNet re-implementations ([yakhyo/face-parsing](https://github.com/yakhyo/face-parsing), MIT *code*, ResNet-18 ≈43 MB / ResNet-34 ≈82 MB, ONNX export supported) carry a permissive licence on the **code** while the **weights** inherit CelebAMask-HQ's restriction.

The same code-vs-weights split bites on **InsightFace**: the code is MIT, but the pretrained packs (`buffalo_l`, `antelopev2`) are *"for non-commercial research purposes only"*, with commercial use requiring a separate licence ([InsightFace licensing](https://www.insightface.ai/solutions/face-recognition-licensing), [repo](https://github.com/deepinsight/insightface)).

**Practical consequences.** You have three legitimate options for the attributes MediaPipe doesn't cover:
- **(a)** License the data/weights commercially (InsightFace sells this; K-Hairstyle would need a direct approach).
- **(b)** Train on data you own — collect and consent-label your own selfies, or generate synthetic heads. **If the app's 3D side already involves head or avatar assets, this is unusually tractable for you**: a rendered-head generator produces perfectly-labelled glasses/hat/hairstyle variation at scale, in the same engine you already ship. This is precisely the argument Microsoft made in *Fake It Till You Make It* ([paper](https://www.microsoft.com/en-us/research/wp-content/uploads/2021/10/ICCV_2021_FaceSynthetics.pdf)) — face analysis in the wild trained on synthetic data alone.
- **(c)** Use non-commercial assets **only** for a prototype, and treat the licensed/self-trained version as required work before ship.

---

## 2b. Hairmony — the closest thing to a solved `hair_style` problem

Found late, and it reframes the hardest attribute in the request. **[Hairmony: Fairness-aware hairstyle classification](https://arxiv.org/abs/2410.11528)** (Microsoft, SIGGRAPH Asia 2024; [repo](https://github.com/microsoft/hairmony)) predicts a person's hairstyle **from a single image** — the exact shape of your problem, from the same Microsoft group that produced FaceSynthetics.

**What it does.** Trained *exclusively on synthetic data* — 100,000 renders at 512×512 under varied lighting, pose and expression — on a frozen **DINOv2** backbone to bridge the synthetic-to-real gap. Reported **87.6% mean accuracy** with **92.5% mean fairness**, where "fairness" means accuracy differences across demographics are held small by construction rather than measured after the fact. That is a materially better starting point than anything else in this note.

**The taxonomy is the prize.** 18 attributes — 10 global plus 8 local attributes across 8 scalp regions (front, top, crown, nape, left/right side, left/right temple), giving **74 labels per hairstyle**. The relevant ones:

| Attribute | Scope | Values |
|---|---|---|
| **Gathered** | per region | None · Behind-Ear · **Bun** · Buns · **Ponytail** · Ponytails · On&nbsp;Skin · Knot · Knots · Other · Unknown |
| **Length** | per region | Bald · Shaved · Very&nbsp;Short · Short · Ear · Chin · Shoulder · Armpit · Mid-Back · Waist |
| **Hair Type** | per region | Coily · Curly · Wavy · Straight |
| **Strand Styling** | per region | None · Twists · Dreadlocks · Braids · Other |
| **Accessories** | global | None · Headband · Ribbon · Hairnet · Scrunchy · Comb · Clips · Beads |
| **Bangs Style / Length** | global | 8 shapes; above / to / below eyebrows |
| Parting · Hairline shape/position/visibility · Surface · Baby&nbsp;Hair · Direction · Layering · Strand Thickness · Decoration | mixed | — |

**Your example decomposes exactly.** `"long pony tail"` = `Gathered: Ponytail` + `Length: Mid-Back`. Two orthogonal axes, both already defined, both with a fixed vocabulary. And note that **`Hair Type` (curl geometry) is a separate attribute from `Gathered` (arrangement)** — the taxonomy makes precisely the distinction between *type* and *style*, which is confirmation that both belong in your schema as separate fields.

The design goals they state — completeness, fairness, granularity, simplicity, consistency, **objectivity** ("the language refers to physical attributes rather than cultural references"), extensibility — are worth adopting wholesale. Objectivity in particular solves a real problem: it keeps you out of culturally-loaded style naming.

**Licence — and an important distinction.** The repo is under the **Research Use of Data Agreement (R-UDA) v1.0**, which is *stricter and clearer* than CelebA's. §2.1 restricts use to "non-commercial research… you may not use the Data or any Results in any commercial offering", and §5.5 removes any ambiguity: *"Artificial intelligence models trained on Data (and which do not include more than a de minimis portion of Data) are Results."* So **the datasets and anything trained on them are barred from your product.** No interpretation needed — unlike CelebA, R-UDA names the case.

**But the taxonomy is a different artefact from the data.** The datasets live on separate Azure blob storage under R-UDA; the taxonomy is a definition document in the repo. A classification scheme — a list of attribute names and permitted values — is a system rather than a creative work, and systems generally aren't protected by copyright even where a specific written expression is. **This is a question for your counsel, not for me**, but the practical route is clear and is the one Microsoft themselves demonstrate: *adopt the vocabulary, render your own synthetic training data, train your own model.*

**Two further things worth stealing:**
- **Synthetic-only training now has a published result behind it.** My earlier recommendation to render your own data was reasoning by analogy; Hairmony is a measured demonstration on this exact task, at 87.6% accuracy. If the app's 3D side already has head assets, you are closer to reproducing this than most.
- **Their real-world evaluation set ships labels only** — hair taxonomy labels layered on top of [FairFace](https://github.com/joojs/fairface), which users obtain separately. That's a clean pattern for routing around image licensing when you build your own eval set.

## 3. Tier 1 — on-device inside Unity (recommended)

### Runtime options

**Unity Sentis** (package `com.unity.ai.inference`, currently 2.6.x) is the first-party answer. Naming has churned: launched as Sentis in open beta November 2023, renamed **Inference Engine** when Unity AI shipped with Unity 6.2 in August 2025, then reverted to the display name **Sentis** as of package 2.4. Per the [package docs](https://docs.unity3d.com/Packages/com.unity.ai.inference@2.6/manual/index.html) it "supports most models in Open Neural Network Exchange (ONNX) format with an opset version between 7 and 25", runs on CPU or GPU, "supports all Unity runtime platforms", and — usefully here — also ingests **LiteRT (TensorFlow Lite)** and PyTorch exported-program formats, so MediaPipe's `.tflite` models can go in more or less directly. The converter can quantise Float32 → Float16 or Uint8, and models can be serialised to a `.sentis` binary in StreamingAssets so startup skips graph re-parsing.

Unity publishes validated, pre-converted models on Hugging Face under [huggingface.co/unity](https://huggingface.co/unity), including [`unity/inference-engine-blaze-face`](https://huggingface.co/unity/inference-engine-blaze-face) — **Apache-2.0**, BlazeFace converted from TFLite to ONNX via `tf2onnx`, input `(1,128,128,3)`, outputs `(1,896,16)` boxes and `(1,896,1)` scores, with NMS applied through the Sentis functional API and a sample C# script in the repo. There are matching blaze-pose and blaze-hand entries.

**Alternatives worth knowing**, both from Koki Ibukuro (asus4) and both mature:
- [`onnxruntime-unity`](https://github.com/asus4/onnxruntime-unity) — ONNX Runtime 1.26 as a Unity package, with execution providers for CPU, **CoreML** (iOS), **NNAPI** (Android), XNNPACK, CUDA, TensorRT, DirectML; switching backend is a one-line change. Better operator coverage and NPU access than Sentis.
- [`tf-lite-unity-sample`](https://github.com/asus4/tf-lite-unity-sample) — TFLite in Unity with GPU/NNAPI/CoreML delegates; the shortest path if you stay entirely on MediaPipe's `.tflite` artefacts.

Rule of thumb: **Sentis** for first-party support and simplest shipping; **onnxruntime-unity** if you hit an unsupported operator or need NNAPI/CoreML NPU acceleration.

### The pipeline I'd build

1. **Detect + align** — BlazeFace. Speed is irrelevant to you (its paper's 200–1000+ FPS on flagship devices is beside the point in a single-shot flow), but it's small, accurate on selfie-framed faces, and Unity ships an Apache-2.0 conversion — so it costs nothing in download size or licence work. If detection quality on odd inputs matters more than size, a heavier detector is affordable here.
2. **Segment** — MediaPipe **Multi-class Selfie Segmenter**, 256×256 input, categories verbatim: *"0 - background, 1 - hair, 2 - body-skin, 3 - face-skin, 4 - clothes, 5 - others (accessories)"* ([Image segmentation guide](https://developers.google.com/edge/mediapipe/solutions/vision/image_segmenter)). There is also a dedicated **Hair Segmenter** at 512×512 (`0 - background, 1 - hair`) if you want a sharper hair mask. MediaPipe is [Apache-2.0](https://github.com/google-ai-edge/mediapipe/blob/master/LICENSE) and its pretrained models are free for commercial use.

   Google's docs don't publish file sizes, so I measured them from the model CDN (`storage.googleapis.com/mediapipe-models/…`, 2026-08-20):

   | Model | Precision published | Size on disk |
   |---|---|---|
   | `blaze_face_short_range.tflite` | float16 | **224 KB** |
   | `selfie_segmenter.tflite` (2-class) | float16 | **244 KB** |
   | `hair_segmenter.tflite` (512×512) | float32 | **763 KB** |
   | `selfie_multiclass_256x256.tflite` | float32 **only** | **15.6 MB** |
   | `face_landmarker.task` (478 landmarks incl. iris) | float16 | **3.6 MB** |

   Note the asymmetry: the multiclass segmenter is published **only** in float32 — `float16` and `int8` variants return 404 — and at 15.6 MB it dominates the budget. Sentis can quantise it to Float16 or Uint8 at import, which should bring it to roughly 8 MB / 4 MB, but the accuracy cost of that is **unmeasured and needs checking**. If it degrades, the dedicated 763 KB hair segmenter plus a separate skin mask is a much cheaper route to the same two colour attributes.
3. **Colour-quantise** — take the hair and face-skin masks, discard specular highlights and shadowed pixels, convert to a perceptually uniform space (CIELAB), take a robust central estimate, and snap to the app's named palette. For skin, snap to the **Monk Skin Tone scale** — a 10-point open-source scale developed by Ellis Monk and released by Google, explicitly decoupled from race and from UV response, and now the preferred standard in computer vision over Fitzpatrick ([MST overview](https://en.wikipedia.org/wiki/Monk_Skin_Tone_Scale), [Google Research](https://research.google/blog/consensus-and-subjectivity-of-skin-tone-annotation-for-ml-fairness/)). Google also released the **MST-E** dataset (19 subjects across the 10 points) for testing annotation consistency across capture conditions.
4. **Classify the rest** — one small multi-head CNN (MobileNetV3-small class of model, ~10 MB, or ~3 MB at uint8) over the aligned face crop, with heads for `wears_glasses`, `head_accessory`, `hair_style`, plus optionally facial hair and fringe/bangs. **This is the head you must train yourself** on commercially-licensed or self-generated data.
5. **Eye colour (optional)** — crop the iris using the landmarker's iris points, upsample, classify into a deliberately coarse set. Return a confidence and let the app fall back to a default.

### Spend the wait-state on accuracy

With no frame budget and the user already on a progress screen, the usual mobile-inference compromises stop being necessary. Concretely:

- **Run segmentation at native resolution**, not the 256×256 the model ships at. Upsampled masks lose exactly the boundary precision that colour quantisation depends on.
- **Don't quantise for speed.** Quantise only if app download size demands it — and measure the accuracy cost when you do (§9).
- **Use test-time augmentation** on the hard attributes: several crops, a horizontal flip, average the logits. Free accuracy that a real-time budget would rule out.
- **Consider a heavier model wholesale.** A full SegFormer-class parser is entirely affordable in a one-shot flow; the constraint on it is licence (§2), not compute.

The real constraints in this design are **app download size** and **licence**, not latency. On-device inference itself is essentially free.

**The strongest argument for on-device is privacy, and it survives the correction intact.** A selfie that never leaves the handset avoids the entire third-party-processing question in §6, avoids per-image cost, and works offline. What it no longer buys you is a UX advantage — that argument depended on a latency budget you don't have.

---

## 3b. The 10-second budget, allocated

A ceiling of 10 s sounds generous, and for most of the design it is. It is decisive in exactly one place.

### Where the budget goes

| Architecture | Modelled end-to-end | Verdict against 10 s |
|---|---|---|
| Specialist pipeline, on-device | **~1–2 s** | Fits with ~80% headroom |
| Specialist pipeline, self-hosted | **~3–6 s** (upload dominates) | Fits, but network-variable |
| Frontier VLM API | **~3–8 s** | Fits at p50; **tail is the risk** |
| **VLM, on-device** | **~21 s measured** | ✗ **Does not fit** |

The on-device pipeline breakdown — image decode and EXIF handling, detection, segmentation at native resolution, colour quantisation, the attribute head with 8-way test-time augmentation — plausibly totals 1–2 s on a mid-range phone. **These are modelled figures, not measurements** (§9), but they are an order of magnitude inside the ceiling, so the conclusion is robust even if each stage is 3× my estimate.

### The on-device VLM does not fit, and the reason isn't the one you'd guess

This is the finding that the 10-second number produces, and it is measured rather than estimated. A 2025 case study deployed LLaVA-1.5 7B, MobileVLM-3B and Imp-v1.5-3B on a **OnePlus 13R** (Snapdragon 8 Gen 2, Android 15) across three frameworks ([arXiv 2507.08505](https://arxiv.org/pdf/2507.08505)):

| Model · framework | Image encode | Prompt eval | Decode | **Total** |
|---|---|---|---|---|
| MobileVLM-3B · llama.cpp | ~14.1 s | ~2 s | ~1 s | **~21 s** |
| Imp-v1.5-3B · MLC-Imp | ~18 s | — | — | **~25 s** |
| LLaVA-1.5 7B · llama.cpp | 3.1 s | 89 s (605 tok @ 147 ms) | 11.8 s (69 tok @ 172 ms) | **~101 s** |
| LLaVA-1.5 7B · mllm | — | 78 s (19 tok @ 4,153 ms) | 94 s (51 tok @ 1,860 ms) | **~174 s** |

**The fastest configuration anyone achieved was ~21 s — more than double your ceiling.** Two details matter more than the headline:

- **The cost is in the vision stage, not generation.** Visual preprocessing was ~14 s of MobileVLM-3B's 21 s; decoding was ~1 s. So the usual mitigations — shorter JSON output, grammar-constrained decoding, fewer output tokens — **buy you almost nothing**. You cannot prompt-engineer your way under the ceiling.
- **The accelerators sat idle.** The paper reports the Adreno 740 GPU at **0% busy** through llama.cpp's CPU runs, and names NPU/GPU offload of the encoder and attention blocks as the main unrealised lever. So this is a *tooling* limit, not a silicon limit — it may well fall within a couple of years. It has not fallen yet.

Two honest caveats: the Snapdragon 8 Gen 2 is a 2022 part, so a 2026 flagship will do better; and MobileVLM-3B is larger than the ~256M–1B tier you'd actually reach for. A 500M-class model with a small vision tower might land far lower. But the gap is **2×, not 20%**, and the burden of proof sits with the optimistic case. Treat on-device VLM as **unproven against this ceiling** and measure before betting on it (§9).

### Cold start is a real slice of 10 seconds

Unity's Inference Engine must "allocate buffers, compile GPU kernels, and upload weights" on first run, which "can cause a one-time delay of several seconds at startup". Land that inside your measured window and you've spent a third of the budget before any inference happens.

Two mitigations, both cheap: **serialise to a `.sentis` binary in StreamingAssets** so startup skips graph re-parsing, and **run a warm-up inference on an earlier screen** — while the user is framing the shot or picking from their library — so the kernels are compiled before they press the button.

### With a hard ceiling, p99 is the number, not p50

A 10-second commitment is only met if it's met almost always. That reframes the on-device-versus-server choice:

- **On-device latency is predictable.** The distribution is tight; the main tail risk is thermal throttling on a hot device.
- **Network paths have long tails.** Upload of a 1–3 MB photo on a weak connection, an API cold start, a rate-limit retry — any of these can turn a 4-second p50 into a 15-second p99.

If you go server-side, you need an explicit timeout and a fallback plan for the case where the ceiling is about to be breached. If you go on-device, you mostly don't. **This is a stronger argument for on-device than the privacy one is convenient** — and it's the one that survives regardless of how the legal analysis in §6 lands.

### What to do with the surplus

The on-device pipeline leaves ~8 seconds unused. Don't bank it — spend it, in this order:

1. **Native-resolution segmentation** rather than the model's 256×256 default. Direct gain on both colour attributes.
2. **Test-time augmentation** on the categorical attributes: several crops plus a horizontal flip, averaged. Reliable accuracy for pure compute.
3. **A heavier parser** if licence allows — a SegFormer-class model is entirely affordable here.
4. **Quality gating and a retry prompt** for the library-photo cases in §5b, which costs almost nothing and prevents the worst failures.

And still return early when you're done. A 10-second ceiling is permission, not a target.

## 4. Tier 2 — self-hosted (EC2 / GPU hire)

**This tier is more attractive than the stated preference order implies, and the wait-state is why.** A round-trip to your own server costs perhaps a second on a decent connection — invisible inside a progress state the user is already watching. The UX objection to server-side processing largely evaporates when nothing is real-time.

What it buys over on-device:

- **No app-size cost at all.** The 15.6 MB segmenter question below stops mattering.
- **Ship model updates without an app release.** Significant when the `hair_style` classifier will need several iterations to get right.
- **No device fragmentation.** One known hardware target instead of the whole Android range.
- **Arbitrary model size** — including the VLM option in §7 that solves `hair_style` outright.

What it costs: **you are now processing and transmitting face images on your own infrastructure**, which brings the §6 obligations fully into play — consent flow, retention policy, regional data handling, and a much larger BIPA/GDPR surface. That is the whole trade. On-device is legally simpler; server-side is technically better.

Everything in §3 runs server-side unchanged; you additionally unlock models too heavy for a phone:

- The **BiSeNet / SegFormer face-parsing** family at full resolution — the 19-class CelebAMask-HQ label set (`0-background, 1-skin, 2-nose, 3-eye_g, 4-l_eye, 5-r_eye, 6-l_brow, 7-r_brow, 8-l_ear, 9-r_ear, 10-mouth, 11-u_lip, 12-l_lip, 13-hair, 14-hat, 15-ear_r, 16-neck_l, 17-neck, 18-cloth`) is a near-perfect match for the requested attribute list — `eye_g` gives `wears_glasses`, `hat` gives `head_accessory`, `hair` and `skin` give the colours, `l_eye`/`r_eye` give the iris crop. **But see §2: these weights are non-commercial.**
- A **small open-weights VLM** (1–4B class) prompted for structured JSON, which handles open-vocabulary attributes like `"long pony tail"` gracefully and needs no bespoke taxonomy.

The licence position is *not* better on a server than on a phone — non-commercial means non-commercial regardless of where inference happens. What self-hosting buys you is capacity and iteration speed, not permission.

**Two sensible uses.** Either as the **primary inference path**, if you accept the data-handling obligations in exchange for model freedom; or, if you go on-device, as the **labelling and evaluation harness** — generate ground truth with big models, measure the mobile pipeline against it, and distil.

---

## 5. Tier 3 — third-party APIs

Checked against the actual attribute list. Most of them simply do not do what's being asked.

| Service | `hair_colour` | `skin_colour` | `eye_colour` | glasses | headwear | hairstyle |
|---|---|---|---|---|---|---|
| **AWS Rekognition** | ✗ | ✗ | ✗ | ✓ | ✗ | ✗ |
| **Azure AI Face** | ✓ *(gated ×2)* | ✗ | ✗ | ✓ | ✓ | ✗ |
| **Face++** | ✗ | ~ *(skin **status**, not tone)* | ✗ | ✓ *(`glass`)* | ✗ | ✗ |
| **Clarifai** | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| **Sightengine** | ✗ | ✗ | ✗ | ~ *(sunglasses)* | ✗ | ✗ |
| **Frontier VLM APIs** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | 

- **AWS Rekognition `DetectFaces`** returns `DEFAULT, ALL, AGE_RANGE, BEARD, EMOTIONS, EYE_DIRECTION, EYEGLASSES, EYES_OPEN, GENDER, MOUTH_OPEN, MUSTACHE, FACE_OCCLUDED, SMILE, SUNGLASSES` ([API reference](https://docs.aws.amazon.com/rekognition/latest/APIReference/API_DetectFaces.html)). **No hair colour, no skin tone, no eye colour.** Eyeglasses and Sunglasses are booleans with confidence. Note that `FaceOccluded` explicitly returns *false* for "eye glasses, lightly tinted sunglasses, strands of hair" — it is an identity-verification signal, not an accessory detector.
- **Azure AI Face** is the closest match on paper and the worst in practice. It returns **Accessories** (`headwear`, `glasses`, `mask`, each with 0–1 confidence), **Glasses** (`NoGlasses`, `ReadingGlasses`, `Sunglasses`, `SwimmingGoggles`), plus occlusion, blur, exposure, noise, head pose, and 27 landmarks. It also has a `hair` attribute with colour. **Two blockers:** the docs carry a standing caution that *"Face service access is limited based on eligibility and usage criteria… Face service is only available to Microsoft managed customers and partners"*, requiring an [intake form](https://aka.ms/facerecognition); and on top of that, *"The limited capabilities are age, smile, facial hair, hair and makeup"* — so hair colour needs a separate responsible-use justification by email ([concept doc](https://learn.microsoft.com/en-us/azure/ai-services/face/concept-face-detection)). For a consumer app, assume you won't get it.
- **Face++** advertises age, gender, smile intensity, head pose, eye status, emotion, beauty, eye gaze, mouth status, **skin status**, face image quality and blurriness ([attributes page](https://www.faceplusplus.com/attributes/)). "Skin status" is acne/blemish analysis, **not** skin tone. SDK examples confirm a `glass` value in `return_attributes`, so eyeglass detection is there; hair, headwear, eye colour and skin tone are not.
- **Clarifai's** demographics workflow predicts age, gender and "multicultural appearance" across 7 racial groups ([workflow](https://clarifai.com/clarifai/main/workflows/Demographics), [blog](https://www.clarifai.com/blog/new-demographics-workflow)). That is race classification, which is both a different thing from skin tone and a considerably more fraught one — see §6.
- **Sightengine's** face-attribute model returns bounding box, five landmarks, a `minor` score and a `sunglasses` score — and is **deprecated** in favour of their Face Analysis model ([docs](https://sightengine.com/docs/face-attribute-model)).
- **Betaface** is frequently recommended in listicles as the one API with hair colour and hairstyle among 40+ attributes. **Its domain no longer resolves.** `betafaceapi.com` returned SERVFAIL from Google Public DNS (8.8.8.8) *and* Cloudflare (1.1.1.1) on 2026-08-20, and an HTTPS request failed to connect — so this is not a local resolver artefact. Treat Betaface as defunct and disregard the listicles that still recommend it.
- **Frontier VLM APIs** (Claude, GPT-class) are the only third-party option that actually produces the requested schema, including free-form values like `"long pony tail"`, with no training and no taxonomy design. The blocker is policy, not capability — see §6.

---

## 5b. "Or select a photo" is a harder input than "take a selfie"

Worth separating, because the two input paths have different failure modes and the library path is the one that will generate your support tickets.

A camera capture is constrained: one face, roughly centred, roughly frontal, roughly arm's length, current lighting, known orientation. A photo chosen from the library is none of those. Expect **multiple faces** (whose attributes do you return?), **no face at all**, faces at 40 pixels across, heavy filters and beauty-mode smoothing already baked in, screenshots and re-photographed images, aggressive JPEG compression, portrait-mode background blur bleeding into the hair boundary, and **EXIF orientation** that silently rotates the image if you don't honour it.

Practical mitigations, all cheap in a wait-state flow:

- **Gate on face size and quality before running the pipeline.** If the detected face is below a threshold, say so and ask for another photo — a clear rejection beats a confidently wrong result. Azure's own guidance uses a 36×36 pixel minimum detectable face and recommends a quality rating before proceeding; borrow the pattern even if you don't use the service.
- **Handle multiple faces explicitly.** Either pick the largest and say so, or show the crops and let the user choose. Silently picking one is the worst option.
- **Honour EXIF rotation** before inference. This is a classic silent-corruption bug: the model sees a sideways face, detection fails or lands badly, and everything downstream is wrong for no visible reason.
- **Expect worse colour fidelity from library photos.** Filters and auto-enhance shift hue globally, which lands directly on `hair_colour` and `skin_colour` — the two attributes derived from colour rather than shape. White-balance normalisation matters more here than on a fresh capture.
- **The "confirm your details" screen (§8) does double duty** as the catch-all for every one of these cases.

## 6. Legal, policy, and ethical constraints

Four separate constraints, any one of which can sink a design:

**Biometric privacy law.** Illinois BIPA (740 ILCS 14) requires written consent before collecting a face scan, and courts treat facial geometry *extracted from a photograph* as a biometric identifier under the Act. Statutory damages are $1,000 per negligent and $5,000 per reckless/intentional violation plus fees, and BIPA applies based on where the **user** is located, not where the company is ([overview](https://www.recordinglaw.com/us-laws/data-privacy-laws/illinois-data-privacy-laws/biometric-privacy/)). Texas CUBI and a growing list of state laws are similar. Under GDPR, biometric data is Article 9 special-category data **when processed for the purpose of uniquely identifying a natural person** — attribute extraction for avatar generation is arguably outside that trigger, but you need both an Article 6 basis and, if Article 9 bites, a separate Article 9(2) condition ([Art. 9](https://gdpr-info.eu/art-9-gdpr/), [ICO guidance](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/lawful-basis/special-category-data/what-is-special-category-data/)). **On-device processing with no upload and no persistence is by far the cleanest posture here** — it minimises what you collect, transmit, and store.

**Vendor usage policies on VLMs.** Anthropic's usage policy prohibits using its products to *"target or track a person's physical location, emotional state, or communication without their consent, including using our products for facial recognition"*, and has been extended to forbid **analysing biometric data to infer characteristics like race or religious beliefs** ([policy update](https://www.anthropic.com/news/updating-our-usage-policy)). OpenAI prohibits facial recognition databases without data-subject consent and real-time remote biometric identification, and has constrained image-based person analysis, citing the risk of "unsafe assessments" of attributes like gender or emotional state ([usage policies](https://openai.com/policies/usage-policies/)). A consenting user submitting their own selfie for avatar creation is a materially different case from surveillance, but **`skin_colour` inference sits uncomfortably close to the race-inference line** and you should get an explicit read from the vendor before building on it.

**Skin tone specifically.** Use a perceptual scale (Monk), not a race taxonomy. They are different measurements with very different risk profiles, and Clarifai-style "multicultural appearance" outputs are the wrong tool for choosing an avatar's complexion. Also note that under uncontrolled selfie lighting, illumination is often a larger effect than the underlying tone — research on skin tone estimation under diverse lighting is explicit about this ([study](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11122461/)). Budget for white-balance normalisation and expect residual error.

**Label quality.** Even where CelebA-derived labels are legally available to you, they are noisy — the CVPR 2023 workshop paper [*Consistency and Accuracy of CelebA Attribute Values*](https://openaccess.thecvf.com/content/CVPR2023W/VDU/papers/Wu_Consistency_and_Accuracy_of_CelebA_Attribute_Values_CVPRW_2023_paper.pdf) documents substantial inconsistency, particularly in the semi-subjective attributes (`Blond_Hair`, `Straight_Hair`, `Wavy_Hair`) that matter most here. Don't treat CelebA accuracy figures as a proxy for real-world quality.

---

## 7. The VLM question — and the architecture fork

Tempting, because one model would produce the whole JSON including open-vocabulary hairstyle, and it dodges the taxonomy problem entirely.

The small-VLM landscape has moved fast: **SmolVLM-256M** runs under 1 GB of memory ([SmolVLM paper](https://arxiv.org/html/2504.05299v1)); **Moondream2** pairs SigLIP vision features with Phi-1.5 at 1.8B params and targets edge/mobile; Apple's **FastVLM** optimises the vision encoder specifically for on-device latency; Google's on-device Gemma tiers ship with native structured-JSON output. A 1B-class model is demonstrably feasible on a 4 GB iPhone 13.

**With the 10-second ceiling known, this is out** — and I should be explicit that this reverses my previous answer twice. I first dismissed it on latency grounds assuming a real-time budget; when the wait-state was clarified I called it a genuine contender; the measured numbers in §3b now rule it out again, for a reason neither earlier pass had: **the best measured 3B-class VLM on flagship Android hardware takes ~21 s, and ~14 s of that is the vision stage, which prompt engineering cannot shrink.**

The other objections stand and compound:

- **Download size.** A 1–3B VLM is roughly 1–2 GB quantised, against ~20 MB for the specialist pipeline. That means an on-demand download after install, plus a first-run wait.
- **Device fragmentation.** Even if a flagship could be coaxed under 10 s, the low end of the Android range will be several times slower or will OOM. You'd need a capability gate *and* a server fallback — two code paths. And if you must build the server path anyway, the on-device VLM has bought you nothing.
- **Unity plumbing.** Sentis targets CNN-scale graphs; a transformer decoder with a KV cache is off the beaten path with no published Sentis benchmarks. You'd ship llama.cpp, MLC or ExecuTorch as a native plugin — real per-platform maintenance for a path you've just established needs a fallback regardless.

Revisit this if you move the ceiling well past 20 s, or when a framework lands that actually uses the NPU for the vision encoder — §3b notes the GPU sat at 0% throughout the published runs, so the headroom exists and is simply unclaimed.

**Where the VLM decisively wins is `hair_style`.** It handles open-vocabulary description natively — `"long pony tail"` needs no taxonomy, no labelled dataset, and no licence negotiation. Against §2, that is not a small thing: it routes around the single hardest blocker in this entire note.

That leaves **two** viable architectures rather than three, with **the `hair_style` requirement choosing between them**:

| Architecture | `hair_style` solved by | Download | Privacy | Main cost |
|---|---|---|---|---|
| **Specialist, on-device** | Classifier you train yourself | ~20 MB | Best — nothing leaves the device | You must source or generate licensed training data |
| ~~**VLM, on-device**~~ | Free, open-vocabulary | 1–2 GB | Best | **Ruled out — ~21 s measured vs. a 10 s ceiling (§3b)** |
| **VLM, server-side** | Free, open-vocabulary | None | Weakest — you hold face images | Full §6 data-handling obligations; per-image cost |

**And a third option, which the 10-second ceiling makes the clear best value: use a VLM server-side at build time as a labelling engine.** Bulk-label your own consented or synthetic training images with hairstyle and accessory tags, then distil into the small on-device classifier. You get open-vocabulary richness in the *labels* and specialist-model economics at *runtime* — a ~1–2 s on-device inference with 80% of the budget to spare, no 1–2 GB download, no device gate, no face data leaving the handset, and no per-image cost. **This is the recommendation.** The VLM's open-vocabulary strength is exactly what you need for `hair_style`, and it turns out you need it at training time, not at inference time.

---

## 8. Recommendation

**Build the §3 pipeline on Unity Sentis, and decide the `hair_style` architecture separately.** Concretely:

1. **Prototype now, unblocked** — wire BlazeFace (`unity/inference-engine-blaze-face`, Apache-2.0) plus the MediaPipe Multi-class Selfie Segmenter into Unity, and implement colour quantisation for `hair_colour` and `skin_colour`. Both assets are commercially licensed. This validates the hardest engineering risk (Unity inference plumbing) using only clean IP, and delivers two of the six attributes outright.
2. **Make the `hair_style` architecture decision explicitly, using the table in §7.** It is the fork in the road, and the other five attributes don't much care which way you go. Don't let it get decided implicitly by whichever prototype happens to work first.
3. **In parallel, resolve the data question for the remaining attributes** — licensing (InsightFace, K-Hairstyle enquiries), self-collection with consent, or synthetic generation. **Synthetic is now the evidenced play, not just the plausible one**: Hairmony hit 87.6% on this exact task trained on nothing but renders (§2b). If the app's 3D side already has head assets, you are unusually well placed to reproduce that — render heads with known glasses, hat, length and gathering labels for perfect ground truth at zero marginal cost.
4. **Adopt Hairmony's taxonomy rather than inventing one** (§2b). This step was previously the biggest open design problem and is now largely answered: `Gathered` × `Length` × `Hair Type` × `Strand Styling` gives you `"long pony tail"` and everything adjacent, with an expert-designed, fairness-audited vocabulary and an explicit objectivity rule. Keep hair *type* (curl geometry) as a separate field from hair *style* (arrangement) — the taxonomy does, and so should your schema. Confirm the taxonomy-vs-data licence distinction with counsel before relying on it.
5. **Spend the wait-state on accuracy** — native-resolution segmentation, no speed-driven quantisation, test-time augmentation on the hard attributes. These are free wins in this flow and you should take all of them.
6. **Treat `eye_colour` as best-effort** with a coarse palette and a confidence threshold, plus a UI fallback letting the user correct it.
7. **Ship a "confirm your details" screen regardless.** Every attribute above has a real error rate. Letting the user adjust the inferred values converts model error from a correctness problem into a UX detail — and it is a clean consent moment for the privacy story. In a flow where the user is already waiting for a result, a review step costs you almost nothing.
8. **Do the privacy work early** — if the selfie never leaves the device and is discarded after inference, say so prominently. It is both the right posture and a meaningful market position. If you go server-side (§4), this is instead a substantial compliance workstream, and it should be scoped now rather than discovered later.

---

## 9. Open questions / not verified

**Resolved on a second pass:**

- ~~MediaPipe model file sizes~~ — **measured** from the model CDN; table in §3. The multiclass segmenter being float32-only at 15.6 MB is the one number that materially affects the app-size budget.
- ~~Betaface status~~ — **confirmed defunct**; SERVFAIL from two independent public resolvers plus a failed HTTPS connect.
- ~~K-Hairstyle annotation schema~~ — **retrieved**; 11 attribute families listed in §1, and it corroborates the orthogonal-axes label design recommended in §8.

**Still open:**

- **Whether Hairmony's *taxonomy* can be adopted commercially while its *data* cannot** (§2b). R-UDA is unambiguous that the datasets and models trained on them are barred; it is silent on the classification scheme as such, and schemes are generally not copyrightable. **This is now the highest-value open question in the note** — a favourable answer removes most of the `hair_style` design risk. Needs counsel, and possibly just an email to the authors.
- **K-Hairstyle and Hairstyle30k licence terms** — still unstated, access by request. Lower priority now that Hairmony is the better reference for this use case.
- **Face++ full `return_attributes` list.** Still not read from the primary source — `console.faceplusplus.com` serves a client-rendered loading shell that the fetcher can't execute, and the RapidAPI mirror returned no body. §5 reflects their marketing page plus SDK examples, which may lag the API. Face++ is a poor fit regardless, so this is low priority.
- ~~On-device VLM feasibility~~ — **effectively closed by §3b.** ~21 s measured for the fastest 3B-class configuration against a 10 s ceiling, with the cost in the vision stage. Only worth revisiting for a sub-1B model with a small vision tower, or once NPU offload lands.
- **Actual end-to-end timing of the on-device pipeline.** The ~1–2 s in §3b is modelled, not measured. It's an order of magnitude inside the ceiling so the conclusion is safe, but you want the real number before committing to how much test-time augmentation the budget affords.
- **Cold-start cost under Sentis on your device floor.** Unity documents "several seconds" for buffer allocation and kernel compilation, unquantified. It's the one on-device cost that could plausibly threaten a 10 s ceiling, and the mitigation (warm up on an earlier screen) needs to be designed in rather than retrofitted.
- **p99, not p50, if you go server-side.** Upload time on weak connections is the tail risk, and it needs measuring against the ceiling with a timeout and fallback designed for the breach case.
- **Accuracy cost of quantising** the multiclass segmenter to Float16/Uint8 at Sentis import — unmeasured. Relevant only to app download size now, not to speed, so the threshold for accepting it should be higher than it would be in a real-time design.
- **Real-world quality on library photos**, as distinct from fresh captures (§5b). Untested, and likely the larger source of user-visible error.
- **Whether Anthropic/OpenAI would permit** consented, user-initiated selfie attribute extraction for avatar generation is a judgement call on policy text, not a documented carve-out. Worth an explicit vendor enquiry if Tier 3 stays in play.
