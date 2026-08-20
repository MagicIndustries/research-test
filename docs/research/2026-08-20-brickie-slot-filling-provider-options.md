# Replacing OpenAI in the Brickie pipeline: constrained slot-filling, not image analysis

Research note, 2026-08-20. Written against the reframing brief for `emagineer-unity-client` / `emagineer-webservices`. Supersedes the framing of the two earlier notes in this directory, which assumed open-vocabulary attribute extraction. **The frame correction is right and it changes the answer.**

**Corrections to my earlier notes, for the record.** I guessed `head` was a head/face mesh identifier — it is a pre-multiplied facial-hair × glasses label, so **glasses is very much in scope** and my "eye_colour and glasses are gone, good" conclusion was wrong. I also recommended catalogue retrieval speculatively; the brief confirms rendered thumbnails already exist per catalogue entry, which moves that from speculation to a shovel-ready option. And I under-weighted constrained decoding to the point of not mentioning it, which the brief correctly identifies as the primary axis.

---

## 0. Two findings outrank the provider comparison

Answer these before scoring any candidate, because both change what "better" means.

### 0.1 Nothing here is currently falsifiable, and that is itself the recommendation

There is no eval harness, no golden set, no labelled selfies, no provider recorded per transformation, and no user quality signal. **Any claim I make about candidate A beating candidate B on this task is unfalsifiable today, including the claims in this note.** I can compare *capabilities* — constrained decoding, confidence, determinism, data handling — from primary documentation, and I have. I cannot compare *accuracy on Brickie selfies*, and neither can anyone else right now.

The brief asks me to treat "build the measurement first" as a candidate recommendation rather than a caveat. I'll go further: **it is the top recommendation**, it is cheap, and §8 sizes it. Everything else in this note is either capability fact (verifiable now) or a bet you cannot currently settle.

### 0.2 OpenAI's own developer guidance says you should not be doing this without ZDR

This is the finding I'd action first, and it needs a compliance answer, not a research one.

OpenAI's Under-18 API guidance states, verbatim:

> "You should not use OpenAI services to process any personal data of children under 13 or the applicable age of digital consent without first implementing zero data retention in our API."

Brickie is a children's product transmitting selfies of minors to the OpenAI API. Two things follow:

- **ZDR is not a setting you toggle.** Per OpenAI's data controls documentation, abuse-monitoring logs are retained "for up to 30 days" by default, and exclusion is "subject to prior approval by OpenAI and acceptance of additional requirements", obtained through their sales team. Reporting elsewhere indicates it requires an Enterprise Agreement or Microsoft Customer Agreement and a trust-and-safety review. **Check whether you have it. If you don't, the current integration is contrary to OpenAI's stated guidance today** — not as a future risk.
- **"The applicable age of digital consent" is broader than 13.** In the EU it ranges 13–16 by member state; the UK is 13. So this reaches beyond a US under-13 analysis.

Separately, and independently: **the amended COPPA Rule became enforceable on 22 April 2026** — four months ago. It adds **biometric identifiers including facial templates** to the definition of personal information, and requires **separate verifiable parental consent for disclosure to third parties** unless the disclosure is integral to the service. There is a genuine argument that sending the selfie to the analysis provider *is* integral to the service being requested, and that argument may well hold. But it is an argument that should be made deliberately by someone qualified, documented, and revisited — not left implicit.

To be clear about what I am and am not saying: I don't know your users' ages, your consent flow, or whether you hold ZDR. I am saying these are checkable in an afternoon, that one of them is a statement in your provider's own documentation, and that both bear on the architecture decision far more than any accuracy delta between providers.

**This is the strongest argument for on-device processing in the entire analysis, and it is not a quality argument.** On-device eliminates the transfer, which eliminates the third-party disclosure question, the retention question, and the ZDR question simultaneously.

---

## 1. Q1 — Can output be hard-constrained to a closed enum?

The primary axis, and the one with the cleanest answers.

| Candidate | Mechanism | Enum guarantee |
|---|---|---|
| **OpenAI Structured Outputs** (`strict: true`) | Schema compiled to a CFG; invalid tokens masked at each step | **Yes — hard** |
| OpenAI **function calling** (*current implementation*) | Schema as guidance | **No** — ~86% compliance |
| **Gemini** `responseSchema` + `propertyOrdering` | Schema-constrained decoding | **Yes** |
| **Gemini** `response_mime_type: text/x.enum` | Single-enum classification mode | **Yes — and ideal for decomposed sub-slots** |
| Anthropic tool use | Schema as guidance, validated | Not a token-level guarantee |
| **Open models + XGrammar / Outlines / llama.cpp GBNF** | Token-level grammar masking | **Yes — hard** |

**The most actionable finding in this section: you are on the weaker OpenAI path.** The brief says the current implementation uses function calling with `analyze_image`. OpenAI's own comparison puts strict Structured Outputs at **100% schema compliance versus roughly 86% for function calling**. Switching `OpenaiPrompt` to `response_format: {type: "json_schema", json_schema: {..., strict: true}}` against the same `brickie_schema.json` is a small change that **converts enum membership from a hope into a guarantee**, and eliminates an entire class of silent degradation described in §4 of the brief. It is the cheapest quality win available and it requires no provider decision.

Note the limit precisely, because it is easy to over-read: constrained decoding guarantees the value is *a member of the enum*. It does not guarantee it is the *right* member. It converts "confidently wrong AND unparseable" into "confidently wrong but valid" — which is progress, but §4 of the brief is about the second failure mode and constrained decoding does not touch it.

**For open/self-hosted models, grammar-constrained decoding is mature and no longer a performance concern.** XGrammar is the default structured-output backend in vLLM and SGLang, reported at under 40 µs per token for JSON Schema. llama.cpp's GBNF gives the same guarantee locally. So "can it be constrained" does not discriminate against the self-hosted option at all — if anything the open stack offers *more* control, since you can write a grammar that encodes cross-slot constraints a JSON Schema cannot.

---

## 2. Q2 — Per-slot calibrated confidence: the current design asks the wrong question

The schema asks the model to emit a `confidence` integer 0–100 per slot. **Self-reported confidence from LLMs is systematically overconfident.** The literature is consistent: models "consistently exhibit high expressed confidence... typically ranging between 80% and 100%, regardless of their actual accuracy in most cases", and verbalized confidence is "sensitive to how it is elicited", varying with prompt phrasing and response scale.

So the `confidence` column is very likely near-useless as calibrated signal — which, given the brief notes it is **captured on `TransformationFeature` and then dropped** before reaching Unity, has cost nothing so far. That is lucky rather than designed.

**There is a much better signal available, and it is nearly free:**

- **OpenAI** supports `logprobs: true` alongside `response_format: json_schema` on Chat Completions. Because the enum is constrained, the token distribution *is* a distribution over the valid choices. That's a genuine posterior over the 50 head values, not a vibe.
- **Gemini** returns `avgLogprobs` on every response regardless, and `responseLogprobs: true` plus `logprobs: N` yields per-step candidate logprobs.
- **Open models** expose logprobs natively.

**Recommendation:** replace the verbalized `confidence` field with a logprob-derived confidence computed server-side, and **add the confidence column to `BrickieFeature`** so Unity can actually see it. That unlocks concrete product behaviour the brief already contemplates: below a threshold on `legs`, use a deliberate default rather than a guess; below a threshold on any slot, surface the top-2 alternatives on a confirm screen. A calibrated per-slot probability over a closed enum is the single most useful thing this pipeline could start producing.

---

## 3. Q3 — Determinism at temperature 0: nobody offers it

Short answer: **no candidate guarantees it, and the regeneration UX assumption is unsafe.**

- **Gemini**, per Google's own parameter documentation: temperature 0 means responses "are mostly deterministic, but a small amount of variation is still possible"; with a fixed seed the model "makes a best effort", and "deterministic output isn't guaranteed". There is a public issue titled *"Critical Determinism Failure in Gemini API… with Fixed `seed` and `temperature`"*.
- **OpenAI**'s `seed` is documented as best-effort, with `system_fingerprint` signalling backend changes that invalidate reproducibility. Temperature 0 is not a determinism guarantee.
- **Self-hosted open models** are the only class where you can actually pin this — fixed weights, fixed seed, fixed batch composition, greedy decoding. Even then, batching and GPU non-determinism can perturb results; achievable, but it takes deliberate configuration.

**Consequence for the regeneration UX** ("generate → compare → choose"): the design assumes variation comes from a different photo. In practice the same photo may yield different brickies across retries on any hosted provider. That is arguably *fine* — it may even be desirable for a "try again" button — but it should be a decision rather than an accident, and it means you cannot use retry-consistency as a quality signal or a cache key.

**A cheap mitigation regardless of provider:** cache the response keyed on a hash of the image bytes plus schema version. It makes the observable behaviour deterministic to the user, removes duplicate spend, and cuts latency to zero on repeat.

---

## 4. Q4 — Latency in a blocking request

I have no measured p95 for your input distribution, and generic vendor benchmarks won't transfer, because your input is unusual in a way that matters: **`EncodeToJPG(60)` with no resize** means you are uploading a full-sensor-resolution image, base64-encoded, inline in a JSON body. On a modern phone that's plausibly 8–12 MP.

Two observations that don't require measurement:

- **The upload is likely a material fraction of your p95**, and it is entirely under your control. Vision models tile images to a fixed short-side resolution anyway; sending 12 MP buys nothing. **Resizing client-side to roughly 1024–1536 px on the long edge before encoding is a latency win with no accuracy cost**, and it shrinks the base64 payload several-fold. This is worth doing today regardless of provider, and it is a one-line change in the Unity client.
- **With a synchronous blocking call, p99 matters more than p50** — the user is on a loading screen and the tail is what they experience as "broken". Network paths have long tails that on-device inference structurally does not.

Anything more precise needs the harness in §8.

---

## 5. Q5 — Where the images go

Covered in §0.2, and it is the decision driver. Restating the options plainly:

| Option | Images leave device? | Third-party disclosure | Retention |
|---|---|---|---|
| OpenAI (current) | Yes | Yes | 30 days default, unless ZDR approved |
| Gemini | Yes | Yes | Per Google Cloud terms; Vertex offers stronger data controls than the consumer-tier API |
| Self-hosted open model | Yes, to **your** infrastructure | **No** | Yours to define |
| **On-device** | **No** | **None** | **None** |

The middle option deserves more weight than it usually gets in a children's product. **Self-hosting an open VLM on infrastructure you control eliminates the third-party disclosure entirely** while keeping the flexibility of a language model and the zero-shot catalogue-extension property from §6. It converts a COPPA third-party-sharing question into an ordinary data-security question about your own systems. Given that cost is explicitly not the driver here, that trade looks better than it would on most projects.

---

## 6. Q6 — Catalogue-evolution cost (the sleeper axis, and the brief is right about it)

42 parts are currently unreachable from generation — 67 hair pieces against 43 in the enum, 44 torsos against 30, 54 heads against 50. The cost of closing that gap differs by an order of magnitude across candidate classes:

| Class | Cost to add 42 parts | Notes |
|---|---|---|
| **Enum-constrained VLM** (any provider) | **Edit a JSON file** | Zero-shot. Immediate. |
| **Embedding retrieval over thumbnails** | **Render + embed + one index row per part** | No prompt, no retrain; scales indefinitely |
| Fine-tuned VLM | Re-collect, re-label, retrain | Locks the gap open between runs |
| Trained classifier (N-way head) | Re-label, retrain, redeploy | Worst case; also caps N |

**Two candidate classes have essentially zero marginal cost per part, and they're the two I'd build around.** Note that retrieval is *better* than the enum here, not merely equal: the enum still needs a human to keep a JSON file in sync with the Unity catalogue, which is exactly the manual handshake that produced the six drift bugs in §9. Retrieval derives its vocabulary from the catalogue itself, so the two cannot drift apart by construction.

That's a structural argument for retrieval that is independent of accuracy — and it survives even if retrieval turns out to be *less* accurate than a VLM, provided the gap is small.

---

## 7. Q7 — The three sub-problems, scored separately, and the target architecture

### (a) Colour quantisation — 9 of 15 slots

**Do not use a model for this.** Segment region → trim luminance outliers → mean or k-means in CIELAB → nearest neighbour in a 23–31 entry palette. It is deterministic, microseconds, offline, and will beat a VLM naming hex codes from a list. The brief's assessment is correct and I'd put it more strongly: **an LLM is close to the worst available tool for this sub-problem**, because it is the one part of the pipeline with an exact, closed-form answer.

Two refinements worth having:

- **`body_color_2` and `_3` are explicitly "2nd/3rd most visible torso colour"** — that is literally k-means with k=3 ordered by cluster mass. The schema is already shaped for the classical algorithm. An LLM has no reliable way to rank colours by area; a clustering pass computes it exactly.
- **Palette matching should happen in a perceptual space with a perceptual metric** — CIEDE2000 in Lab, not Euclidean RGB. On a 23-entry LEGO palette the difference between those two is visible and will show up as wrong-but-plausible colours.

**What this costs onboard is less than the brief assumes.** Colour quantisation itself needs no ML runtime — it's arithmetic over pixels, plain C#. What it needs is region masks. And a useful amount of that is available from OS-native APIs that ship no weights:

- **iOS**: Vision's `VNGeneratePersonSegmentationRequest` (person mask, iOS 15+) and face-landmark requests — OS-provided, zero app-size cost.
- **Android**: ML Kit Selfie Segmentation, **~4.5 MB**, CPU, 20 FPS+, plus ML Kit Face Detection.

Those give you the face region (→ `skin_color`), the beard region via landmark geometry (→ `facial_hair_color`), and person-versus-background. For separating *hair* from *clothes* from *accessories* you'd still want MediaPipe's multiclass selfie segmenter (15.6 MB) or the dedicated hair segmenter (763 KB) through Sentis or a TFLite plugin. So it is a modest ML-runtime introduction, not the full greenfield build — and **a first increment covering `skin_color` and `facial_hair_color` needs no shipped weights at all.**

### (b) The `head` slot — decompose it

50-way choice = ~13 facial-hair states × 4 glasses variants. **Ask two questions, not one.** Both sub-questions are small, well-posed, and — importantly — sit squarely inside what mainstream face-attribute tooling already does. The brief notes `Transformations::Features` already whitelists `beard, mustache, eyeglasses, sunglasses` in an AWS-Rekognition-shaped schema, so the decomposed form is half-modelled in the repo already.

Three practical notes:

- **Decomposition improves calibration as well as accuracy.** A logprob over 4 glasses options is a far more meaningful confidence number than a logprob over 50 pre-multiplied labels, where probability mass is smeared across near-duplicates that differ only in the other factor.
- **Gemini's `text/x.enum` mode is purpose-built for exactly this** — a single classification returning an unquoted enum member.
- **Beware recombination gaps.** If the product of your two sub-vocabularies is larger than the 50 legal compounds, you need a mapping that handles the illegal combinations deliberately rather than defaulting to `plain`.

### (c) Silhouette matching — the four catalogue slots

This is where a vision model earns its keep, and where I want to be **more cautious than my earlier note was.**

The retrieval case is strong on structure: thumbnails already exist as `ThumbnailAssetReference` per catalogue entry, embeddings are cheap, the index derives from the catalogue so it cannot drift, and adding parts is free (§6). Backbones are permissively licensed — DINOv2 and SigLIP are both Apache-2.0 on repo and weights.

**But I should flag a real risk I did not flag before: the domain gap.** You would be matching a q60 JPEG photograph of a child against a *rendered, stylised, non-photorealistic LEGO part thumbnail*. That is a large cross-domain retrieval problem, and the literature is clear that CLIP-family zero-shot retrieval degrades under exactly this kind of shift — most sharply when the target domain is abstract or non-photographic. SigLIP benchmarks best on average across zero-shot retrieval, so it's the one I'd try first, but **I would not assume zero-shot retrieval works here without testing it.**

Three mitigations, in increasing cost:

1. **Render the thumbnails to narrow the gap** — a lit, posed, photo-like render rather than a flat catalogue icon. Cheap, since you already own the render pipeline.
2. **Query with the segmented region, not the whole photo** — a cropped, background-removed garment region is much closer to a part thumbnail than a full selfie is.
3. **Learn a small projection head** on a few hundred labelled pairs, mapping photo embeddings into thumbnail-embedding space. This retains the zero-marginal-cost property for *new parts* (they just get embedded) while fixing the domain shift once.

**This is the single highest-value experiment to run**, and it is answerable in a few days with the eval set from §8: embed the 43 hair thumbnails, embed 200 labelled selfie crops, measure top-1 and top-5. If top-5 is strong, the confirm-screen UX from §2 makes top-1 weakness survivable.

### The target architecture

| Sub-problem | Slots | Where | Why |
|---|---|---|---|
| Colour quantisation | 9 | **On-device**, classical CV | Exact, instant, no transfer, no model |
| Face attributes (`head`) | 1 (→2 sub-slots) | On-device *or* hosted | Small, well-posed, mature tooling |
| Silhouette matching | 4 | Hosted VLM **or** retrieval — **test both** | Genuinely hard; needs measurement |
| `hair_style` | 1 | Same as silhouette | Same shape of problem |

The seam is one method returning a hash, so this decomposition costs almost nothing architecturally. **And it degrades the privacy problem gracefully**: if colour and face attributes run on-device, the only thing that ever needs to leave the handset is a background-removed garment crop — not a child's face. That is a materially different disclosure to defend than "a selfie of a minor", and it may resolve §0.2 without going fully onboard.

That last point is, I think, the most useful architectural observation in this note.

---

## 8. Q8 — The smallest change that makes this measurable

Ordered by cost. Items 1–3 are days, not weeks, and unblock everything else.

1. **Record the provider, model ID and schema version on `users_transformations`.** The brief lists this as an explicit prerequisite in your own docs. Without it, no comparison is possible even retrospectively.
2. **Persist `confidence` onto `BrickieFeature`** so it survives to the client, and switch it to a logprob-derived value (§2).
3. **Log the raw provider response verbatim**, alongside the normalised output, behind a flag. Most "why did it pick that" questions become answerable offline, and it lets you re-score old requests against new providers without re-calling anything.
4. **Assemble ~200 consented selfies** representative of actual users — device cameras, real lighting, the age range you actually serve.
5. **Human-label only the observable slots.** This is the part most likely to be got wrong: label `legs` as **`not observable`**, not as a guess. The brief is right that an eval which punishes candidates for hallucinating unobservable slots is measuring the wrong thing. Three label states per slot: correct / incorrect / not observable in input.
6. **Report two numbers per slot, never one**: accuracy on observable instances, and *behaviour* on unobservable ones (did it default, refuse, or confidently invent?). A provider that returns a sensible default for `legs` beats one that invents a confident answer, even at identical "accuracy".

**On the unobservable slots specifically** — the brief asks whether a deliberate default beats a guess. Yes, and strongly, for a reason beyond correctness: a default is *stable*. If the model invents leg colours, the same child regenerating gets different trousers each time for no reason they can perceive, which reads as the product being broken. A well-chosen default (or a colour sampled from the observed torso, which at least coheres) is both more honest and more coherent. I'd make `legs_visible` an explicit field and let the client decide.

---

## 9. Free wins available this week, independent of any decision

Every one of these is a small change, none require choosing a provider, and several eliminate silent failures outright:

| Fix | Effect |
|---|---|
| Switch `OpenaiPrompt` to **strict Structured Outputs** | Enum membership guaranteed; ~86% → 100% schema compliance |
| **Resize client-side to ~1024–1536 px** before `EncodeToJPG(60)` | Cuts upload and p95 with no accuracy cost |
| Fix `teeth_square_glasse` → `teeth_square_glasses` | Recovers 1 of 50 head values that can never resolve |
| Add `#CCA373` to server `SKIN_COLORS` | Stops a legal model answer degrading to default yellow |
| Add `CODE 151` to the Unity skin colour config | Stops a legal server output falling back to list-position-zero |
| Move the `n/a` instruction from the confidence field to the **value** field of `facial_hair_color`, and add `n/a` to that enum | Makes a currently unsatisfiable instruction satisfiable |
| Emit `head_accessory_color_2/_3`, or remove the Unity lookup | Resolves a silent one-sided contract |
| Add `confidence` to `BrickieFeature` | Unblocks §2 and the confirm-screen UX |
| **Add a CI check that diffs the schema enums against the Unity catalogue** | Prevents the next six drift bugs |

That last row is the one with compounding value. Five of the six drift bugs in the brief exist because a JSON file and a Unity catalogue are kept in sync by hand. A test that fails when they diverge costs an hour and closes the category permanently.

---

## 10. What I'd actually do

**Now, before choosing anything:**

1. **Answer the ZDR / under-13 question** (§0.2). It may constrain the option space more than any technical finding, and it is a phone call, not a project.
2. **Ship the §9 fixes.** Strict Structured Outputs and the client-side resize are the two with real effect; the rest close silent failures.
3. **Add provider recording and confidence persistence** (§8, items 1–3).

**Next, to make the decision decidable:**

4. **Build the 200-selfie eval set** with three-state labels (§8). Nothing downstream is falsifiable without it.
5. **Run the retrieval experiment** (§7c) — embed thumbnails, embed labelled crops, measure top-1/top-5 for `hair_style`. It's the highest-information experiment available and it's a few days.

**Then, with evidence:**

6. **Move colour quantisation on-device** (§7a). Nine of fifteen slots, exact rather than approximate, and the first increment needs no shipped weights.
7. **Decide the remaining five slots on measured data**, with the hybrid target in §7 as the default hypothesis: keep a hosted model for silhouette matching only, sending a background-removed crop rather than a child's face.

I'd resist a straight provider swap — OpenAI for Gemini — as the first move. `GeminiPrompt` already exists and is proven against the identical schema in the Lemoji path, so wiring it into the brickie path is genuinely cheap and worth doing **as an A/B arm once you can measure**. But doing it *before* measurement just changes which unfalsifiable claim you're relying on.

---

## 11. What remains unfalsifiable, stated plainly

- **Every comparative accuracy claim.** I have capability facts from primary docs, not performance on your data. The §8 harness is the only thing that changes this.
- **Whether zero-shot retrieval clears the domain gap** (§7c). Genuinely unknown; the literature says be cautious; the experiment is cheap.
- **p95/p99 latency for any candidate** on your input distribution.
- **Whether the COPPA "integral to the service" exemption covers the current transfer.** A legal question, not a technical one.
- **Whether decomposing `head` improves accuracy**, as opposed to just calibration. The calibration argument is sound a priori; the accuracy claim needs the harness.
- **On-device model quality for silhouette matching.** No measurement exists, and the earlier note's finding still stands that a 3B-class VLM runs ~21 s on flagship Android — well outside a blocking request.
