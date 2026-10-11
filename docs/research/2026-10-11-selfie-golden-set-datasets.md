# Selfie datasets for a brickie feature-extraction golden set

Research note, 2026-10-11. Question: which datasets of human selfie photographs could seed a **golden set** for benchmarking the brickie pipeline's selfie-to-features step (an LLM reads a selfie and fills the avatar schema), so that model swaps and code changes can be measured over time.

**Operating conditions** (from [the pipeline handover](HANDOVER-brickie-generation-pipeline.md)): a commercial children's mobile app; privacy paramount; the schema is `hair_style`, `hair_color`, `skin_color`, `head` (facial hair × glasses), `head_accessory` + colour, `body` + three colours, `legs` + three colours; recognisability is carried by the four Tier A slots (hair silhouette, hair colour, skin colour, head). Handover §6 states the gap this note addresses: *"There is no eval harness, no golden set, no labelled selfies."*

**Method.** Four parallel research agents, one per slice (selfie-domain and consented sets; attribute-labelled face benchmarks; hair, headwear and skin-tone specialist sets; synthetic and self-built routes plus data-protection texts), each working from primary sources, 51 web searches total, all verification dated 2026-10-11. Every licence quote below was read from the licence file or dataset page itself unless marked *reported*. Downloaded copies of the key licence and taxonomy files are listed in [Appendix B](#appendix-b--local-copies).

---

## TL;DR

1. **No off-the-shelf selfie golden set exists.** Nothing public combines (a) real front-camera selfies, (b) labels that map onto the brickie schema, (c) consent from the people photographed, and (d) terms that let a commercial company benchmark a product against it. Every candidate fails at least two of the four. You will be labelling images yourself whatever you choose; the real decisions are **which images** and **which label vocabulary**.

2. **The licensing wall from the [August attribute note](2026-08-20-selfie-facial-attribute-extraction.md) applies to evaluation data too, and it is sharper than "non-commercial".** Microsoft's R-UDA (Hairmony, FaceSynthetics, DigiFace) bars use "to improve any product or service", which is exactly what a golden set is for. Meta's FACET and Casual Conversations are "evaluation purposes only" on a "non-commercial and research basis". Sony's FHIBE is the one set that *expressly* permits commercial evaluation, but only "to research or evaluate bias". CelebA, FFHQ, UTKFace and CelebV-HQ are "non-commercial research purposes only". Whether a commercial product's internal QA counts as non-commercial research is a question for counsel, not for this note.

3. **The one true selfie dataset is the worst-provenanced.** The UCF Selfie Dataset (46,836 Instagram #selfie scrapes, 36 human-labelled attributes including hair colour, glasses, hat, with "baby", "child", "teenager" age labels) still downloads directly today, carries no licence text on its page, and has no consent. Do not build on it.

4. **Recommended build: a three-tier golden set, with your own consented selfies as the core.**
   - **Core (owned):** 150–300 selfies from staff, friends and families under written consent, including children under parental consent. This is the only route to real children, real front cameras and clean rights. Images stay in private storage; labels live in the repo (the "labels-only" pattern Microsoft used for Hairmony).
   - **Breadth (licence-clean, hand-labelled):** EasyPortrait — 40,000 consented, phone and webcam, head-and-shoulders portraits of 13,705 people, hats and glasses present, released under a share-alike licence with **no non-commercial clause**. Sample 300–500 and label them. Supplement rare attributes (red hair, widow's peak, mullet, flattop, glasses shapes, hats) with self-generated synthetic faces from FLUX.1 schnell (Apache-2.0), labelled by construction and then human-checked.
   - **Fairness slice (legal sign-off needed):** FHIBE for skin-tone- and hair-type-sliced accuracy, framed as the bias evaluation its terms permit; MST-E for calibrating the skin-colour buckets to the Monk scale.

5. **Steal the vocabularies, not the pixels.** Hairmony's hair taxonomy (bangs style, hairline shape including widow's peak, per-region length and direction) and FHIBE's 13-value hair-colour list are the best public label schemes for the Tier A slots. A mapping from both onto the 12 brickie silhouette families is in §6.2.

6. **Two compliance points change the design.** First, the handover's finding that sending minors' selfies to the OpenAI API without zero data retention is contrary to OpenAI's own guidance applies to the golden set as much as to production: benchmark hosted LLMs on the adult and synthetic tiers unless ZDR is confirmed. Second, a `skin_color` label is a colour swatch, not an ethnicity; keep it that way, because a label "revealing racial or ethnic origin" is special-category data under GDPR Article 9 and "sensitive information" under the Australian Privacy Act regardless of whether the photo is biometric.

7. **Measure silhouette family, not the 43-way label, and record visibility.** The handover already established that nine of fifteen slots are unobservable in a selfie and that the 43 hair styles collapse to 12 silhouettes. The golden set's labels should encode those two facts directly, or the benchmark will reward confabulated trouser colours and punish harmless within-family hair swaps.

---

## 1. Terms, and where this problem comes from

**Golden set.** A fixed, human-labelled collection of inputs with agreed correct outputs, held constant across versions so that a change in score means a change in the system rather than in the test. For brickie the inputs are selfies and the outputs are schema values; "correct" for hair style means the right silhouette family, not the exact catalogue part.

**Facial attribute dataset.** A face corpus with per-image labels such as `Blond_Hair` or `Eyeglasses`. The lineage runs from LFW attributes (Kumar et al., 2009, 73 classifier scores on news photos) through CelebA (Liu et al., 2015, 40 human binary attributes on 202,599 celebrity photos), which became the de facto standard and whose "non-commercial research purposes only" agreement set the licensing pattern most later sets copied. The field's second generation, from about 2019, was driven by fairness audits rather than recognition: FairFace (2019, demographic balance), Casual Conversations (2021, paid consenting participants), FACET (2023, Monk skin tone plus hair and accessory labels for bias evaluation), and FHIBE (2025, consent and IRB approval throughout). The shift matters here because the fairness-era sets are the only ones with consent, and their licences are written for *evaluation*, which is what a golden set does.

**Consent provenance.** Whether the people in the images agreed to be in the dataset. Scraped sets (CelebA, FFHQ, FairFace, UCF Selfie, MegaFace) have none; a Creative Commons licence on a Flickr photo is the photographer's copyright grant and, as Wikimedia Commons' own policy puts it, "does not affect any rights belonging to the subject of the photograph".

**Labels-only release.** Publishing annotations without the images, so that each user obtains the images under the source's own terms. Microsoft's Hairmony did this over FairFace. It is also the right pattern for an owned golden set: labels in git, images in access-controlled storage.

**Selfie domain.** Front-camera phone photo, arm's length, head and shoulders, uncontrolled lighting, often wide-angle distortion. Almost no research dataset is actually in this domain; the near misses are EasyPortrait (crowdworkers photographing themselves on phones and webcams), Casual Conversations (participants filming themselves), and the UCF set (real Instagram selfies).

---

## 2. The landscape in one table

Fit is judged against five needs: selfie-like framing, schema-relevant labels, consent, terms that permit a commercial company's internal benchmark, and children. Verification stamps are 2026-10-11 unless noted.

| Dataset | Selfie-like? | Schema labels | Consent | Terms (operative words) | Children | Verdict |
|---|---|---|---|---|---|---|
| **EasyPortrait v2** (SberDevices 2023) | Yes: phone/webcam self-portraits | None (9 segmentation classes, no hair) | Signed | Share-alike "variant of CC BY-SA 4.0"; no NC clause | Not stated | **Best raw image substrate** |
| **FHIBE** (Sony AI 2025) | No: in-the-wild full scenes; 512² face-crop variant exists | Hair type, hairstyle (length × up/down), 13 hair colours, facial hair style + colour, Fitzpatrick skin swatch, masks for headwear, eyewear, upper/lower clothes | Written, paid, IRB | Commercial use allowed but only "to research or evaluate bias"; no incorporation into any dataset or product | No (18–75) | **Fairness slice, with legal sign-off** |
| **UCF Selfie** (2015) | Yes: real Instagram selfies | Hair colour ×4, curly/straight/braid, glasses, sunglasses, hat, age buckets | None (scraped) | No licence on page; README *reportedly* "research purposes" only | Yes | **Avoid** |
| **FACET** (Meta 2023) | No: SA-1B activity photos | Hair colour ×6, hair type ×6, facial hair, hat/cap, headscarf, eyewear, Monk skin tone | None stated | "evaluation purposes only", "non-commercial and research basis" | Not separable (<25 bucket) | Reference labels only |
| **Casual Conversations v2** (Meta 2023) | Close: self-filmed talking-head video | Fitzpatrick + Monk skin tone; self-reported hair colour, hair type, beard, eyewear, hair cover (values unpublished) | Paid, explicit, withdrawable | "Limited"; evaluate-only on attribute labels; full agreement unread | No stated | Skin-tone calibration, if terms allow |
| **Hairmony labels on FairFace** (Microsoft 2024) | No: small Flickr face crops | Finest hair-silhouette labels available (1,823 rows) | None (FairFace is scraped) | R-UDA: "may not use the Data or any Results ... to improve any product or service" | FairFace has 0–2, 3–9 bins | Taxonomy yes, data no |
| **CelebA / CelebAMask-HQ** (CUHK 2015/2019) | No: celebrity press photos | 17 relevant binary attributes; masks for hair, hat, glasses, cloth, skin | None | "non-commercial research purposes only" | Likely some | Avoid for product QA |
| **FFHQ + FFHQ-Features** (NVIDIA / DCGM) | Closest framing of the big sets | Machine-predicted hair colour, glasses, facial hair | None; opt-out | Compilation CC BY-NC-SA 4.0 | Yes | Avoid; labels are predictions anyway |
| **MST-E** (Google 2023) | No: studio | Monk skin tone 1–10, expert-assigned | Model releases | CC BY plus "research, model evaluations, or annotator-training purposes only" | No | Skin bucket calibration only |
| **FaceSynthetics** (Microsoft 2021) | No: synthetic renders | Masks for hair, beard, glasses, headwear, clothing; no categorical labels | n/a | R-UDA (as Hairmony) | Unknown | Schema inspiration only |
| **SFHQ / SFHQ-T2I** (independent) | No: synthetic | None (T2I prompts are a weak prior) | n/a | MIT | Unlabelled, likely present | Permissive synthetic pool for hand-labelling |
| K-Hairstyle, Hairstyle30k, Figaro-1k, LaPa, MAAD-Face, LFW(A), UTKFace, Adience, MeGlass, PA-100K, Market-1501, Fashionpedia, DeepFashion | No | Partial at best | None | Blurred faces, dead hosts, withdrawn images, no licence, or NC | Mixed | Not viable (details §4) |

---

## 3. The viable candidates in detail

### 3.1 EasyPortrait — the image substrate

SberDevices released EasyPortrait v2 in November 2023 ([GitHub](https://github.com/hukenovs/easyportrait), [paper](https://arxiv.org/abs/2304.13509), [Kaggle mirror](https://www.kaggle.com/datasets/kapitanov/easyportrait)): 40,000 images of 13,705 people, most at FullHD, split by person 30k/4k/6k. The capture brief is close to a selfie: "the crowd workers' task was to take a selfie or a photo of themselves in front of the computer", on smartphones, PCs and tablets, in offices, living rooms, kitchens, bedrooms, cars, cafés and outdoors, with "various clothes, hats, headphones, and medical masks" deliberately solicited, across Africa, Asia, India and Europe.

Consent is stated in the paper: "all workers have signed a document on the consent to the photo publication before starting the tasks and have been notified of how the data will be used." The licence is a bespoke document ([PDF in the repo](https://raw.githubusercontent.com/hukenovs/easyportrait/main/license/en_us.pdf); the README's link points at a `master` path that 404s) whose footnote says "This license is not a Creative Commons license. The text of this license is a reworking of a Creative Commons Corporation (Attribution-ShareAlike 4.0) license." It grants a "worldwide, royalty-free, non-sublicensable, non-exclusive, irrevocable license" to reproduce and adapt, imposes share-alike on *distributed* adapted material, expressly excludes publicity and privacy rights, and is governed by the Russian Civil Code. There is no non-commercial restriction. A private evaluation set is not distributed adapted material, so share-alike should not bite, but the Russian-law governing clause and the unseen consent form (supplementary Figure 7) are the two things to put in front of counsel.

What it lacks: any attribute labels. The released classes are background, person, skin, brows, eyes, lips and teeth; hair was planned but never shipped. Ages are not stated. So EasyPortrait is raw material: sample it for attribute diversity, then label.

Downloads are direct from SberCloud (images 91.8 GB, annotations 657 MB; HEAD requests returned 200 on 2026-10-11) or Kaggle.

### 3.2 FHIBE — the labelled, consented benchmark

Sony AI's Fair Human-Centric Image Benchmark ([site](https://fairnessbenchmark.ai.sony/), [data card](https://fairnessbenchmark.ai.sony/data-card), [Nature paper](https://www.nature.com/articles/s41586-025-09716-2), hosted on [Mozilla Data Collective](https://mozilladatacollective.com/organization/cmulqdg9208ufny0726lufsqd)) is 10,318 images of 1,981 people from 81 countries, submitted by the participants themselves from their own devices (785 camera models). Collection ran under IRB approval (WCG Clinical, study 1352290), participants were paid at or above local minimum wage, gave written consent including to identifiable release, and can revoke. Everyone is 18–75.

The annotation vocabulary is the closest public match to the brickie Tier A slots. Verbatim from the supplementary information:

- **Apparent head hair type:** None, Straight, Wavy, Curly, Kinky-coily, Not listed.
- **Head hairstyle:** None, Buzz cut, then Short / Medium / Long each with Up, Half-up, Down, Not listed.
- **Apparent head hair colour(s)** (multi-select): None, Very light blond, Light blond, Blond, Dark blond, Light brown to medium brown, Dark brown/black, Red, Red blond, Gray, White, Not listed.
- **Facial hairstyle** (multi-select): None, Beard, Mustache, Goatee; plus **apparent facial hair colour(s)** on the same 13-value list.
- **Apparent skin tone:** six Fitzpatrick-anchored swatches with RGB values.
- **Segmentation masks** (28 classes) including Face skin, Head hair, Headwear, Eyewear, Upper body clothes, Lower body clothes, Full body clothes, Neckwear.

Glasses and hats are therefore *regions*, not categories: you can test "did the LLM notice glasses" but not "round versus square" without adding labels.

The terms are the crux. §2.1 of the [Dataset Terms of Use](https://fairnessbenchmark.ai.sony/legal/terms-of-use/) grants a licence to "(a) use FHIBE to research or evaluate bias in machine learning and artificial intelligence software, algorithms, or similar technologies ... for commercial, non-commercial, and/or research purposes", and to train only systems "designed specifically to assess fairness or mitigate biases". §2.3 forbids creating derivative works, incorporating FHIBE "into any other program, dataset, or product", and transfer. The acceptable-use policy forbids re-identification and inferring sensitive attributes "except in connection with detecting bias in model". Read plainly: a commercial company may run its extractor over FHIBE and report accuracy *by skin tone, hair type and ancestry subgroup*. Whether a flat overall accuracy number is "evaluating bias" is the question for counsel; the defensible framing is that the brickie benchmark on FHIBE is a fairness audit, which, given §2 of the handover (recognisability is carried by hair and skin), is also the right question to ask of it.

Two practical limits. The images are in-the-wild full scenes (16 body poses, 47 interactions), not selfies, though the 2.79 GB "Face Crop Align" 512×512 variant is a usable head-and-shoulders proxy. And no price is shown on the Mozilla Data Collective pages; registration was not attempted.

### 3.3 Hairmony — the hair vocabulary

Microsoft's Hairmony ([repo](https://github.com/microsoft/hairmony), [paper](https://arxiv.org/abs/2410.11528)) was covered in the August note for its classifier; what matters here is its released **real-image label file**, `fairface_taxonomy.csv` (downloaded 2026-10-11: 1,823 rows, 74 columns; the paper says 1,805), which labels a frontal, single-person, demographically balanced FairFace subset. The observed value distributions are themselves informative about what a selfie population looks like: hair type straight 1,293 / wavy 246 / tightly curled 144 / curly 70 / bald 34; bang style none 1,396 against 427 with a fringe of eight shapes; hairline bell-shaped 568 / straight 333 / receding or M-shaped 241 / widow's peak 105 / bald 40; hair direction swept to the side 16 and gathered up 10 out of 443 labelled.

The licence is the [R-UDA v1.0](https://raw.githubusercontent.com/microsoft/hairmony/main/LICENSE), §2.1: "you may engage in non-commercial research activities (including non-commercial research undertaken by or funded via a commercial entity), but you may not use the Data or any Results in any commercial offering, including as part of a product or service (or to improve any product or service) you use or provide to others." The parenthetical is the sentence that excludes a golden set. The taxonomy itself is a classification scheme published in the repo's README, and the August note's position stands: adopt the vocabulary, not the data.

### 3.4 The synthetic routes

**Pre-made synthetic sets are either R-UDA or unlabelled.** Microsoft's [FaceSynthetics](https://github.com/microsoft/FaceSynthetics) (100,000 renders, 19 mask classes including HAIR, BEARD, GLASSES, HEADWEAR, CLOTHING; built from 512 hairstyles, 142 beards, 36 headwear and 11 eyewear items) and [DigiFace-1M](https://github.com/microsoft/DigiFace1M) are both under the same R-UDA text. [SFHQ](https://github.com/SelfishGene/SFHQ-dataset) (425,000 StyleGAN2 faces) and [SFHQ-T2I](https://github.com/SelfishGene/SFHQ-T2I-dataset) (122,726 faces from FLUX, SDXL and DALL-E 3, with prompts) are MIT, but carry no attribute labels; SFHQ's author notes it "lacks variability in accessories axes such as hats or earphones".

**Generating your own is clean on the open-weights path.** [FLUX.1 schnell](https://huggingface.co/black-forest-labs/FLUX.1-schnell) is Apache-2.0 and "can be used for personal, scientific, and commercial purposes". Stability's [SD3.5 Community License](https://stability.ai/community-license-agreement) gives you the outputs and permits commercial use below USD 1M annual revenue. FLUX.1 dev's non-commercial licence allows "use by commercial or for-profit entities for testing, evaluation, or non-commercial research and development in a non-production environment" but not use that "has impact on end users", which an eval set gating a product arguably has, so prefer schnell. Hosted generators (OpenAI, Google, BFL API, Midjourney) all assign output ownership to you; none forbids photorealistic people or non-sexualised minors in their published terms; Google's Vertex Imagen exposes the choice as a parameter (`personGeneration: allow_all` means "Allow generation of people, including minors"); the BFL API forbids *uploading* images of under-18s, which rules out image-to-image from real children there.

The value of synthetic is coverage, not realism: you can guarantee twenty red-haired widow's-peak subjects in square glasses under a beanie, which no sampled real set will give you. The cost is distribution shift (no front-camera distortion, no bad lighting unless prompted) and the fact that prompt adherence is not a label, so every synthetic image still needs a human check.

### 3.5 Buying consented selfies

Vendor catalogues checked on 2026-10-11: [Appen](https://www.appen.com/data-catalog) lists a US selfie image and video collection (1,403 images, 1,535 videos, 70 participants, 2024) and states that datasets "ship with a spec sheet documenting source, consent, annotation method, known limitations, and license terms" under a "perpetual and non-exclusive" licence "with commercial training rights". [Defined.ai](https://defined.ai/datasets/facial-recognition-8-selfies-per-person) sells 2,743 selfies in sets of up to eight per person under a licence that "excludes commercialization of the Data itself" and gives no consent warranty. Shaip's facial sets are all 18+. [Unidata](https://unidata.pro/datasets/kids-teens-aging.md) lists 17,982 photos of 1,998 children aged 7–15 with **no consent statement on the page**; its Hugging Face samples are CC BY-NC-ND. TrainingData.pro and Datatang were unreachable or Chinese-only. No vendor publishes parental-consent terms; if you buy, the consent instrument and age-verification method belong in the contract.

---

## 4. What was ruled out, and why

- **UCF Selfie Dataset** ([page](https://www.crcv.ucf.edu/research/data-sets/selfie/), [paper](https://www.crcv.ucf.edu/papers/acmmm15/Selfie.pdf)). 85,000 images pulled from selfeed.com, "a real-time update of #selfie on Instagram", filtered to 46,836 single-face selfies. Human-labelled: gender; age baby / child / teenager / youth / middle age / senior; race; face shape; gestures; **hair colour black / blond / brown / red; hair shape curly / straight / braid; accessories glasses, sunglasses, lipstick, hat, earphone**; lighting harsh / dim. No facial hair, no skin tone, no clothing. The 1.1 GB tarball still downloads with no click-through (TLS certificate on the host is broken). No licence text appears on either project page; a Kaggle re-upload quotes the tarball README as "limited only to the research purposes" (*reported*, the README was not read). Scraped minors with no consent and no licence is the worst possible provenance for a children's product.
- **CelebA family** ([CelebA](https://mmlab.ie.cuhk.edu.hk/projects/CelebA.html), [CelebAMask-HQ](https://github.com/switchablenorms/CelebAMask-HQ)). The most relevant binary attributes of any set (Bald, Bangs, Black/Blond/Brown/Gray_Hair, Eyeglasses, Goatee, Mustache, No_Beard, Sideburns, Receding_Hairline, Straight_Hair, Wavy_Hair, Wearing_Hat, Pale_Skin) and masks for hair, hat, glasses, cloth and skin, but "available for non-commercial research purposes only" with an explicit bar on exploiting "any portion of derived data" commercially. Celebrity press photos, no consent.
- **FACET** ([page](https://ai.meta.com/datasets/facet/), [paper](https://arxiv.org/abs/2309.00035)). Human labels from 165 trained raters for hair colour (black, blonde, brown, red/orange, colored, grey), hair type (wavy, curly, straight, coily, dreadlocks, bald), facial hair, hat/cap, headscarf, eyewear and Monk skin tone. "The rights to the licensed images and annotations are granted for evaluation purposes only ... solely on a non-commercial and research basis." The governing "Meta Images Research License Agreement" sits behind a JavaScript-only download page and was not read. Mostly full-body SA-1B activity photos.
- **Casual Conversations v1/v2** ([v1](https://ai.meta.com/datasets/casual-conversations-dataset/), [v2](https://ai.meta.com/datasets/casual-conversations-v2-dataset/)). The best consent story outside FHIBE: paid adult participants who "explicitly provided their consent" and may withdraw. v2 adds Monk and Fitzpatrick skin tone and self-reported hair colour, hair type, beard and eyewear fields, but the field values are unpublished, the data is one-minute video rather than stills, and the licence summary ("You can evaluate models on the provided labels / You cannot train any model with the provided labels") is all that is readable; the full agreement is form-gated. Worth requesting the agreement for the skin-tone slice.
- **FFHQ** ([repo](https://github.com/NVlabs/ffhq-dataset)) and **FFHQ-Features** ([repo](https://github.com/DCGM/ffhq-features-dataset)). Best framing match among the large sets, and FFHQ-Features gives per-image hair colour, glasses, facial hair and accessories, but those are neural-network predictions in the shape of the Microsoft Face API, not ground truth, and the compilation is CC BY-NC-SA 4.0.
- **FairFace** ([repo](https://github.com/joojs/fairface)). CC BY 4.0 and 108,501 faces with age bins down to 0–2, but YFCC-100M Flickr scrapes of unconsenting people including children, with demographic labels only. The CC licence is the photographer's; the subjects never agreed.
- **MAAD-Face** (machine-transferred labels on VGGFace2, whose download links "are no longer available"); **LFW / LFWA** (host no longer resolves; attribute file is classifier scores); **UTKFace** ("non-commercial research purposes only", some links 404); **Adience** (age and gender only); **CelebV-HQ** (video, "non-commercial research purposes only"); **MeGlass** (MegaFace crops, decommissioned source); **K-Hairstyle** (500,000 salon photos with the only per-image hair *colour* label and RGB found anywhere, but faces blurred and no licence); **Hairstyle30k** and **Figaro-1k** (no live download); **LaPa** (non-commercial README contradicting an Apache LICENSE file); **PA-100K**, **Market-1501**, **RAP** (surveillance crops; RAP's official domain now serves gambling TLS certificates, do not visit); **Fashionpedia** (hat and glasses polygons but no colour attribute, and 69% of the validation images are NonCommercial Flickr); **DeepFashion** (non-commercial).
- **Hugging Face and Kaggle "selfie" uploads.** One is breach data (the Tea app leak, do not touch); the rest are vendor marketing samples under CC BY-NC-ND or uploads with no card and no provenance.

---

## 5. Analysis

### 5.1 Patterns

**The four needs are in tension by construction.** Consent costs money, so consented sets are built by companies for fairness audits and licensed for that purpose only (FHIBE, Casual Conversations, MST-E). Rich attribute labels came from the academic recognition era and inherited CelebA's non-commercial template. True selfie framing comes from scraping social media, which forecloses consent. Children appear only in scraped sets or in vendor catalogues that do not state how consent was obtained. No funder has had a reason to produce a consented, attribute-labelled, selfie-framed set that includes children, because no fairness audit or recognition benchmark needs one. A children's avatar product does, which is why the core tier has to be owned.

**Evaluation-only licences are the new normal, and they are not all the same.** Three distinct restrictions appear: a purpose limit (FHIBE: bias evaluation; MST-E: "research, model evaluations, or annotator-training"), a commercial limit (FACET, Casual Conversations: "non-commercial and research basis"), and a product limit (R-UDA: not "to improve any product or service"). Only the first kind plausibly admits a commercial benchmark. Treat "evaluation only" on a dataset page as a prompt to read the clause, not as permission.

**Labels for the hardest slot exist; labels for the easiest do not.** Hair silhouette, the attribute the August note called hard, now has two serious vocabularies (Hairmony's 74-label taxonomy; FHIBE's length × up/down scheme). Hair *colour*, which is a colour-sampling problem once the mask is known, is labelled on consented real faces only in FHIBE, and nowhere else at all except K-Hairstyle's blurred Koreans. Garment colour is labelled nowhere on portraits; Market-1501's eight upper-body colours on surveillance crops is the only vocabulary. For the colour slots the golden set's ground truth will be a swatch picked by a human, or a mask-sampled value, not a borrowed label.

**Minors are a blank in every data card.** FACET, CelebA, FFHQ, FaceSynthetics, SFHQ: none states whether children appear. FairFace, UTKFace, Adience and UCF state that they do, and they are the scraped ones. Only FHIBE and Casual Conversations state that they do not. The field's answer to the children question is to exclude them or not to ask, which is itself a reason the brickie golden set cannot be assembled from public parts.

### 5.2 Conflicts between sources

- **MST-E's licence says three things.** The NeurIPS paper and the page's structured metadata say CC BY; the paper also says "research, model evaluations, or annotator-training purposes only" and "cannot be used to train"; the page body says "should be used only as educational content"; the images carry "Copyright TONL.CO 2022 ALL RIGHTS RESERVED". Use it for calibrating bucket boundaries by eye and cite it; do not redistribute it.
- **LaPa ships an Apache-2.0 LICENSE file under a README that says "non-commercial purposes".** The README is the data owner's statement of intent; the LICENSE file is repository boilerplate. Assume non-commercial.
- **FACET's page says "13 person attributes" in one place and "16" in another**, and omits eyewear from one list while the paper includes it. The paper's appendix is authoritative.
- **Hairmony's CSV has 1,823 rows against the paper's 1,805.** Unexplained; immaterial for vocabulary reuse, material if anyone ever quotes the set size.

### 5.3 Dissent against the recommendation

*"Just use FHIBE and be done."* It is the only set that ticks consent, rich labels and commercial evaluation at once, and a counsel reading that "evaluate bias" covers subgroup-sliced accuracy is reasonable. Against: no children, no selfies, no glasses shape or hat category, and §2.3's bar on incorporating it into "any other dataset" means it can never be *merged* with the owned tier into one golden set; it has to remain a separate, separately reported slice. It also tests the extractor on photographs that look nothing like the app's input, so a good FHIBE score could coexist with bad production behaviour under front-camera distortion and bedroom lighting. FHIBE is a strong second tier, not a substitute for the first.

*"Synthetic is enough; skip real images."* It is cheap, label-complete and privacy-free, and Hairmony showed a hair classifier trained on synthetic alone reaching 87.6% on real faces. Against: that result is about *training*, where diversity transfers; a *benchmark* has to resemble the deployment distribution or it measures the wrong thing, and the handover's whole argument is that the current OpenAI call confabulates on real selfies in ways (invented leg colours, white-balance-driven skin errors) that clean renders will not provoke. Keep synthetic for rare-attribute coverage and for the children question if you decide against collecting real children's images at all, which is a legitimate choice to record in an ADR.

*"An owned set of 200 images is too small to be a benchmark."* For the 43-way hair label, yes. For the twelve silhouette families, four glasses options, a dozen hair-colour buckets and a twelve-step skin ladder, 200–300 images with deliberate stratification is enough to detect the regressions that matter (a model that stops seeing red hair, or starts putting glasses on everyone), which is what a regression golden set is for. Statistical power for fine-grained comparisons between near-equal models comes from the EasyPortrait tier, and ultimately from the in-app "pick me out" telemetry the handover proposes.

### 5.4 What I could not find or verify

- The full text of Meta's licence agreements for FACET and Casual Conversations; both are behind JavaScript-only download forms. Without them, the commercial-evaluation position of both sets is unknown.
- Whether FHIBE on Mozilla Data Collective is free; registration was not attempted. Whether per-attribute accuracy measurement is "evaluating bias" under §2.1(a) is a legal reading.
- The UCF Selfie README's terms (streaming of the 1.1 GB tarball did not complete), and the exact column headers of its annotation file.
- Casual Conversations v2's "physical adornment" and "physical attributes" value lists, and its minimum participant age.
- EasyPortrait subjects' ages, and whether the crowdworker consent form (supplementary Figure 7, not fetched) covers commercial downstream use.
- K-Hairstyle's 31 base-style names and its colour vocabulary (only in a figure), and whether any licence accompanies its archives.
- Whether minors appear in FACET, CelebA, FFHQ, FaceSynthetics, SFHQ or SFHQ-T2I.
- Any dataset at all that labels hair colour on consented real selfies, or garment colour on head-and-shoulders portraits. None was found; I am treating absence of evidence as absence here because four independent slices looked.
- Any avatar product (Bitmoji, Meta Avatars, Ready Player Me) that publishes an evaluation protocol. Meta's AutoGen privacy notice is the only primary statement of *what* is extracted ("estimated facial points" and "predicted facial attributes" including "colour pigment" and "estimated skin tone"); nobody publishes *how well*.

---

## 6. Recommended steps

### 6.1 Assemble the golden set in three tiers

**Tier 1, owned core, 150–300 images.** Collect selfies from staff, friends and families using the app's actual capture path (front camera, `EncodeToJPG(60)`, no resize) so the benchmark sees production artefacts. Stratify deliberately: every one of the twelve silhouette families at least ten times; every hair-colour bucket including red and grey; the full nougat skin ladder; glasses in all four schema options; at least a quarter with hats or headwear; a quarter with facial hair; some with three-tone garments; some three-quarter shots where legs are visible and most where they are not. Children under written parental consent, or, if you decide not to collect children's images, record that decision and cover the gap with Tier 2 synthetic children. The consent form should name the purpose ("internal benchmarking of avatar feature extraction"), state retention and revocation, and say that no identification or face-matching is performed. Images go to access-controlled storage; the repo holds labels, hashes and a manifest.

**Tier 2, breadth, 300–500 real plus 200–400 synthetic.** Sample EasyPortrait for attribute diversity (its metadata has brightness, which helps stratify lighting) and label the sample. Generate the synthetic complement with FLUX.1 schnell self-hosted, one prompt per rare-attribute cell, and human-verify every label; keep the prompt, seed and model hash in the manifest so the images are regenerable. Record the EasyPortrait licence read and the generator terms in the manifest too.

**Tier 3, fairness slice, FHIBE face-crop-align variant.** Pursue only after counsel reads §2.1 and §2.3. Report results sliced by apparent skin tone, hair type and ancestry, never merged into Tiers 1–2, never redistributed. Use MST-E alongside it to check that the `skin_color` ladder's bucket boundaries land sensibly on the Monk scale.

### 6.2 Label vocabulary

Label against the brickie schema, but record one level finer than the schema needs so the labels survive catalogue changes. Suggested mapping of the two best public vocabularies onto the twelve brickie silhouette families (from the handover §3.4):

| Brickie family | Hairmony signal | FHIBE signal |
|---|---|---|
| bald | `hair_type = no_hair_bald`, `hair_length = no_hair_bald / shaved` | hairstyle None / Buzz cut |
| short plain | `hair_length ≤ 1_5_cm`, `bang_style = none`, direction blank | Short, Down |
| short forward fringe | `bang_style ≠ none` with short length | Short with fringe (no FHIBE field; add) |
| short swept | `hair_direction = brushed_swept_to_the_side`, short | Short (no direction field; add) |
| swept back | `hair_direction = brushed_gathered_up`, `bang_style = none` | Short/Medium, Up |
| slicked back | swept back plus `hair_surface_appearance = very_shiny_oiled / wet_look` | as above plus surface (add) |
| widow's peak | `hairline_type = widows_peak` | none; add |
| bob | `hair_length = chin_length`, `layering = single_length`, straight/wavy | Medium, Down |
| long | `hair_length ≥ shoulder_length` | Long, Down / Half-up |
| curly | `hair_type = curly / tightly_curled` dominant over length | Curly / Kinky-coily |
| mullet | short front regions with `hair_length_nape ≥ shoulder` | none; add |
| flattop | `hair_length_top` short, `layering = taper / fade`, pointing_out | none; add |

Hair colour: use FHIBE's 13-value list as the human label and map to the LDraw hair palette from handover §3.3 in code, so palette changes do not invalidate labels. Skin colour: label as the nearest swatch on the twelve-step nougat ladder, with a Monk value as a second column, and never as an ethnicity. Glasses: the schema's four options. Facial hair: FHIBE's beard / mustache / goatee plus colour. Headwear: present or absent, a free-text type, and one colour. Garments: up to three colours by coverage order, and a `legs_visible` flag; label `legs_*` only when true.

Use two independent labellers per image and record agreement; disagreements on Tier A slots go to a third. Inter-annotator agreement is also the ceiling the model can be held to, which matters for eye-level attributes where humans disagree.

### 6.3 Scoring

Score silhouette family, not the 43-way part, and weight by tier: Tier A slots dominate, Tier B counts, Tier C is scored only for *abstention* (a value emitted for a slot the label says is not visible is a confabulation and scores negative). Report per-slot accuracy, confabulation rate, and refusal rate separately, per model and per code version, and persist the provider, model id and prompt hash per run, as handover §6 asks for production. Keep the "does this look like you" and "pick me out" telemetry as the product-truth measures; the golden set is the regression gate in front of them.

### 6.4 Compliance notes for the golden set itself

Verbatim primary texts are in Appendix A. The short form: a photograph is not biometric data under GDPR unless processed "through a specific technical means allowing the unique identification or authentication of a natural person" (Recital 51), and the UK ICO says the same; Illinois BIPA expressly excludes "photographs" and "physical descriptions such as height, weight, hair color, or eye color"; the Australian Privacy Act treats biometric information as sensitive only when "used for the purpose of automated biometric verification or biometric identification". The brickie extractor does none of that, and the golden set should be designed so it never can: no identity matching, no embeddings stored, hashes only. The one label that is sensitive on its own is anything "revealing racial or ethnic origin", which is why `skin_color` stays a swatch and FHIBE's ancestry field stays inside the FHIBE slice.

Children's images in Tier 1 must not be sent to hosted LLM APIs unless the retention position is confirmed; the handover's finding on OpenAI's under-13 guidance applies here. Benchmark hosted models on Tiers 1-adult, 2 and 3, and the on-device path on all tiers.

---

## Appendix A — primary legal texts quoted

- **GDPR Article 4(14)** ([gdpr-info.eu](https://gdpr-info.eu/art-4-gdpr/)): "'biometric data' means personal data resulting from specific technical processing relating to the physical, physiological or behavioural characteristics of a natural person, which allow or confirm the unique identification of that natural person, such as facial images or dactyloscopic data".
- **GDPR Article 9(1)** ([gdpr-info.eu](https://gdpr-info.eu/art-9-gdpr/)): prohibits processing "revealing racial or ethnic origin ... and the processing of genetic data, biometric data for the purpose of uniquely identifying a natural person"; 9(2)(a) lifts it where "the data subject has given explicit consent to the processing of those personal data for one or more specified purposes".
- **GDPR Recital 51** ([gdpr-info.eu](https://gdpr-info.eu/recitals/no-51/)): "The processing of photographs should not systematically be considered to be processing of special categories of personal data as they are covered by the definition of biometric data only when processed through a specific technical means allowing the unique identification or authentication of a natural person."
- **UK ICO, biometric recognition guidance** ([ico.org.uk](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/lawful-basis/special-category-data/what-is-special-category-data/)): "If you process digital photographs of individuals, this is not automatically biometric data ... it only becomes biometric data if you carry out 'specific technical processing'." Page flagged as under review following the Data (Use and Access) Act.
- **Illinois BIPA, 740 ILCS 14/10** ([FindLaw text, current to 2025-01-01](https://codes.findlaw.com/il/chapter-740-civil-liabilities/il-st-sect-740-14-10/)): "'Biometric identifier' means a retina or iris scan, fingerprint, voiceprint, or scan of hand or face geometry. Biometric identifiers do not include writing samples, written signatures, photographs, ... or physical descriptions such as height, weight, hair color, or eye color." §15 requires a public written retention policy and a written release; §20 sets liquidated damages of $1,000 (negligent) or $5,000 (intentional or reckless).
- **Australian Privacy Act 1988 s 6(1)**, as reproduced in the [OAIC APP Guidelines Chapter B](https://www.oaic.gov.au/privacy/australian-privacy-principles/australian-privacy-principles-guidelines/chapter-b-key-concepts) (legislation.gov.au not fetched): sensitive information includes "racial or ethnic origin", "biometric information that is to be used for the purpose of automated biometric verification or biometric identification", and "biometric templates".
- **Wikimedia Commons, photographs of identifiable people** ([commons.wikimedia.org](https://commons.wikimedia.org/wiki/Commons:Photographs_of_identifiable_people)): a free licence "does not affect any rights belonging to the subject of the photograph"; "some subjects are unable to consent, for example minors".

## Appendix B — local copies

Kept in this session's scratchpad for the owner to move into a `resources/` folder if wanted; not committed:

- Microsoft R-UDA v1.0 full text (`ruda.txt`), Hairmony `fairface_taxonomy.csv` (2.27 MB).
- EasyPortrait licence PDF and extracted text; EasyPortrait paper text.
- Casual Conversations v1 and v2 papers and data cards (PDF and text).
- FHIBE data card HTML, Nature supplementary information (two PDFs and text).
- MST-E paper HTML; K-Hairstyle paper text; FaceSynthetics paper text; Fashionpedia validation annotations JSON.

## Appendix C — dataset links

- EasyPortrait: https://github.com/hukenovs/easyportrait · https://arxiv.org/abs/2304.13509
- FHIBE: https://fairnessbenchmark.ai.sony/ · https://www.nature.com/articles/s41586-025-09716-2 · https://fairnessbenchmark.ai.sony/legal/terms-of-use/
- Hairmony: https://github.com/microsoft/hairmony · https://arxiv.org/abs/2410.11528
- FairFace: https://github.com/joojs/fairface
- FACET: https://ai.meta.com/datasets/facet/ · https://arxiv.org/abs/2309.00035
- Casual Conversations: https://ai.meta.com/datasets/casual-conversations-dataset/ · https://ai.meta.com/datasets/casual-conversations-v2-dataset/
- MST-E: https://skintone.google/mste-dataset · https://arxiv.org/abs/2305.09073
- UCF Selfie: https://www.crcv.ucf.edu/research/data-sets/selfie/
- CelebA: https://mmlab.ie.cuhk.edu.hk/projects/CelebA.html · CelebAMask-HQ: https://github.com/switchablenorms/CelebAMask-HQ
- FFHQ: https://github.com/NVlabs/ffhq-dataset · FFHQ-Features: https://github.com/DCGM/ffhq-features-dataset
- FaceSynthetics: https://github.com/microsoft/FaceSynthetics · DigiFace-1M: https://github.com/microsoft/DigiFace1M
- SFHQ: https://github.com/SelfishGene/SFHQ-dataset · SFHQ-T2I: https://github.com/SelfishGene/SFHQ-T2I-dataset
- FLUX.1 schnell: https://huggingface.co/black-forest-labs/FLUX.1-schnell · SD3.5 Community License: https://stability.ai/community-license-agreement
- K-Hairstyle: https://psh01087.github.io/K-Hairstyle/ · MAAD-Face: https://github.com/pterhoer/MAAD-Face · CelebV-HQ: https://github.com/CelebV-HQ/CelebV-HQ
- Vendors: https://www.appen.com/data-catalog · https://defined.ai/datasets/facial-recognition-8-selfies-per-person · https://unidata.pro/datasets/kids-teens-aging.md
