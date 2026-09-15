# Where LEGO set enrichment data can actually be sourced from

Research for [issue #58](https://github.com/MagicIndustries/research-test/issues/58). Every fetch, query and page read below happened on **2026-09-15** unless a different date is given. The brief's "already established" facts (Brickset, Brick Owl, BrickLink, LEGO GraphQL, Rebrickable) are taken as given and not re-measured. Where this report adds to them, it says so.

## TL;DR

| Field | Answer |
|---|---|
| **Retired** | **Brickset `exitDate` for 2008 onwards. For 2007 and earlier, infer "retired" and label it as inferred.** Every retirement signal found traces back to LEGO.com. LEGO.com is closed to automated reads without permission, and every other tracker is either derived from Brickset or bans robots. The pre-2008 inference is safe: LEGO.com's US product sitemap lists **no set older than 2017**. Store it as `retired` with `basis: inferred_from_release_year` and a null exit date. Never invent a date. |
| **Description** | **No source is both complete and licensable.** Official blurbs are LEGO's copyright wherever they appear, including the ~92% of 2023 Brickipedia pages that quote them. The only text we may reuse at scale is Brickipedia's own community prose (CC BY-SA 3.0, via Fandom's published dump), and it gets thin before 2000. Ask LEGO for product copy. Otherwise write a factual blurb from structured fields and label it as generated. **Drop "official description" for pre-2000 sets.** |
| **Edition / version** | **No source has this field, and Brickset's `numberVariant` does not mean edition.** The `-2` suffix tells apart different products that share a number. Model editions as relationships instead: *remake of*, *reissue of*, *same-number variant*. Seed them from Brickset `notes` (e.g. 10305 → "Re-imagined version of 6080-1") and Brickipedia, then curate by hand. |
| **Age range** | **LEGO GraphQL, then Brickset `ageRange`, then the Brickipedia `Ages` infobox, then null.** Pre-1999 ages are scarce in every source (5–9 of 50 Brickipedia pages per sampled year). Show "unknown" rather than `18+`. |
| **Extras** | Set category/type (so books, gear and keychains stay out of the "retired" filter), sales channel, launch and exit dates, RRP by region, barcodes, regional names, cross-IDs, and per-field provenance with licence. |

**Permission asks (in priority order):**

1. **LEGO**: extend the existing GraphQL permission to cover product status and copy.
2. **Brickset**: a production cap, plus explicit store-and-redisplay rights.
3. **Brick Owl**: sharpen the request already in flight.
4. **Brickipedia admins**: regenerate the XML dump.

**Needs a human or legal decision:**

- Is the product commercial?
- Is it a "collection tracking tool" (which Brick Owl's API bans)?
- Does Fandom's anti-robot clause govern CC BY-SA text?
- What do ODbL share-alike and CC BY-SA share-alike oblige us to do?
- LEGO's "No AI" clause applies if LLMs ever touch LEGO copy.

---

## 1. How to read this report

Every claim carries a tag:

- **[M] measured**: I fetched, queried or counted it on 2026-09-15.
- **[D] documented**: a primary source says so, but I did not test it.
- **[I] inferred**: my reasoning from measured or documented facts.

A documented rate limit is not a measured one. A sample count is exact for that sample only, not for the catalogue.

**How the measuring was done.** Scripted reads used `curl` or Python with a self-identifying User-Agent, at 1 request per second or slower. robots.txt was checked before fetching anything a crawler would touch. No dataset files were downloaded; dumps were checked with `HEAD` requests only. No API keys were used.

Cloudflare blocked `curl` on some documentation and terms pages, so six of them were read once in a real browser: BrickEconomy's API reference and Terms of Service, Rebrickable's numbering help, BrickLink's API terms, and Fandom's Terms of Use and licensing page. One Brick Owl set page was viewed the same way. That browser carried an existing Brick Owl login; nothing was clicked or changed.

## 2. Terms, defined early

- **Retired.** LEGO has stopped selling the set first-party. Retailers may hold stock for months afterwards, so "retired" does not mean "unobtainable".
- **Exit date.** When LEGO stops (or plans to stop) selling a set. Brickset's `exitDate` is sourced from LEGO.com: the site owner says its retiring-soon lists come "based on the information we acquire from LEGO.com" ([Brickset, 2023](https://brickset.com/article/98118/lists-of-sets-retiring-soon)) [D]. An exit date can lie in the future (a planned retirement), and LEGO sometimes moves it. So `retired` means `exitDate < today`, re-checked on every refresh [I].
- **Availability / sales channel.** Brickset's `availability` field (Retail, LEGO exclusive, Promotional…). It describes **where** a set is sold, not **whether** it still is (established in the brief). This report calls it *sales channel* to avoid the name clash.
- **Last chance / retiring soon.** LEGO.com's own pre-retirement merchandising. The en-US category sitemap contains `categories/last-chance-to-buy`, `categories/hard-to-find` and `categories/vip-last-chance-sets` [M].
- **Set number suffix (`-1`, `-2`).** A fan convention, not a LEGO one. Rebrickable explains that in the past LEGO reused the same set number for different sets, "forcing fans to invent a suffix" ([Rebrickable help, last modified 2026-03-01](https://rebrickable.com/help/sets-types/)) [D]. Brickset's `numberVariant` is the same idea [I]. **It separates different products. It does not mean "edition".**
- **Edition / version**, as the brief intends it ("2022 edition of set 6080"), covers three distinct relationships:
  - a **remake or re-imagining** under a new number: 10305 Lion Knights' Castle (2022) re-imagines 6080 King's Castle (1984);
  - a **reissue** of the same model under a new or suffixed number: Brickipedia has pages such as "4496 Fun with Building Tub - Reissue" [M];
  - a **same-number variant**: the `-2` case above.

  None of the three is a scalar field in any source examined.
- **Acquisition terms vs use terms.** How we may *fetch* (robots.txt, anti-scraping clauses, API terms) is separate from what we may *do* with the result (copyright, database licences, redisplay terms). Both bind. Where robots.txt says yes and the terms say no, this report treats the terms as controlling.

## 3. Source-by-field matrix

"Viable" means usable at catalogue scale without breaching acquisition terms, once any listed permission is granted. Coverage is by era where it varies by era.

### 3.1 Retired / exit date

| Source | Coverage | Acquisition cost | Terms position |
|---|---|---|---|
| **Brickset API `exitDate`** | 90% for 2023, 39% for 1999; tracking starts ~2008 (brief, measured with key). 2008–2022 not measured. | ~100 `getSets` calls for the whole catalogue (brief). Refreshes via the `updatedSince` parameter [D]. | Key cap starts at 100 calls/day; a production cap is granted on request. "Cannot be used to create 'copycat' websites" ([web services page](https://brickset.com/article/52666/brickset-web-services)) [D]. No storage or redisplay terms found; `/about/terms` returns 404 [M]. **Permission ask.** |
| **Brickset `LEGOCom.{US,UK,CA,DE}.dateLastAvailable`** | Unmeasured. Documented class fields ([API v3 docs](https://brickset.com/article/52664/api-version-3-documentation)) [D]. | Same calls as above. | Same as above. |
| **LEGO.com product pages / "last chance" listings** | Upstream truth. The en-US product sitemap has 2,634 URLs; oldest numbers per range are 75192, 21034, 10280 [M]. | ~2,634 pages ≈ 45 min at 1 req/s [I]. Product pages return **403** to a declared non-browser client [M]. | ToS bars copying for "public or commercial purposes" without written permission, has a "No AI" clause, and reserves text-and-data-mining rights ([Terms of Use, modified 2026-02-27](https://www.lego.com/en-us/legal/terms-of-use)) [M]. **Permission ask.** |
| **BrickEconomy API `retired`, `retired_date`** | Unknown. | One set per request, **100/day**: 28,400 sets ≈ 284 days [D/I]. | Needs a Premium membership. Personal licence only. ToS bans robots even though robots.txt allows everything. **Not viable without a licence.** |
| **Brick Insights** | Its set data is Brickset's ([FAQ](https://brickinsights.com/faq)) [M]. | n/a | Derivative. No independent value. |
| **Brickipedia (Fandom)** | No retirement field in `Template:Set` [M]. 0 of 400 sampled pages contain "retire" or "discontinu" [M]. | n/a | Not a source for this field. |
| **Wikidata** | 3 items have a discontinuation date (P2669) [M]. | 1 SPARQL query. | CC0. Coverage is effectively nil. |
| **Stonewars / Promobricks / Brick Fanatics retiring lists** | Current and next year only; articles, not data. | Scraping. | Copyright plus robots restrictions (see §4.9). Human spot-checks only. |
| **Retailers** | Their own stock only. | Scraping. | Terms ban it (see §4.10). **Unusable.** |
| **Inference from release year** | All sets ≤2007 (and a calibrated slice of 2008+). | Zero calls. | No terms issue. **Must be flagged as inferred.** |

### 3.2 Description

| Source | Coverage | Acquisition cost | Terms position |
|---|---|---|---|
| **LEGO.com product copy** | Sets in the LEGO.com window only (~2017 onwards, per the sitemap) [M/I]. | ~2,634 pages; 403 wall [M]. | LEGO copyright. Commercial reuse needs written permission. The No-AI clause also bars feeding it to LLMs [M]. **Permission ask.** |
| **Brickipedia "LEGO.com Description" sections** | Sampled pages quoting LEGO copy: 2023 46/50, 2018 30/50, 2012 24/50, 2005 19/50, 1999 4/50, 1992 0/50, 1985 1/50, 1978 0/50 [M]. | Dump (one file) or API (~340 requests) [I]. | **This is LEGO's text quoted on a wiki. The wiki's CC BY-SA licence cannot license it** [I]. Treat as not usable. |
| **Brickipedia community prose** (intro, "Description", "Notes") | Almost every set page has an intro sentence. A dedicated `== Description ==` section appears on 1–18 of 50 pages per sampled year [M]. Pre-2000 pages are often stubs [M]. | Dump: 59.7 MB, Last-Modified 2024-09-13 [M]. Or API. | Text is CC BY-SA 3.0 ([Fandom licensing](https://www.fandom.com/licensing)) [M]. Fandom ToS bans robots and scraping except as the licensing page permits [M]. Attribution and share-alike apply. **Human decision** (see §8). |
| **Brick Owl catalogue `description`** | Unknown. The field exists in the Catalog Edit API; the bulk dump's field list is not published [M]. One set page (10305) showed no description text [M, n=1]. | 1 bulk call per day once approved [D]. | Catalogue text is **ODbL 1.0** ([Brick Owl terms](https://www.brickowl.com/terms)) [M]. The API "is not available for collection tracking tools" ([API docs](https://www.brickowl.com/api_docs)) [M]. **Request in flight; human decision.** |
| **Brickset `extendedData.description`** | Documented in the API class definition [D]. The brief measured that `extendedData` returns notes and tags but **not** a description. **Conflict** (§8). | Same calls as `getSets`. | As Brickset above. **Ask.** |
| **Kaggle `mterzolo/lego-sets`** | 2018 snapshot of LEGO.com scraped across locales ([dataset](https://www.kaggle.com/datasets/mterzolo/lego-sets)) [M: description card]. | One download. | Labelled CC0 but made of scraped LEGO copy. **Licence laundering; unusable.** |
| **Generated from structured fields** | 100% of sets with name, theme, pieces and minifigs. | LLM or template cost. | Our own text. Must not take LEGO copy as input (No-AI clause) [I]. |

### 3.3 Edition / version

| Source | What it actually carries | Coverage | Terms |
|---|---|---|---|
| **Rebrickable set_num suffix** (already held) | Same-number disambiguation | Complete | Already ingested. |
| **Brickset `numberVariant`** | Same as above. **Not edition.** | Complete for Brickset's ~23,506 items [M: site statistic] | As Brickset. |
| **Brickset `notes`** (ingestion already decided) | Free text. For 10305 it reads "Re-imagined version of 6080-1" [M, n=1]. | Unmeasured. Needs a regex pass once ingested. | As Brickset. |
| **Brickset `tags`** (`tag` is a documented `getSets` filter) | Possibly remake or reissue tags | Unmeasured. `*/tag-` pages are robots-disallowed [M], so API only. | As Brickset. |
| **Brickipedia `Set header` fields** `setwithsamenumber`, `before`, `after` | Same-number siblings and numeric neighbours | `setwithsamenumber` filled on 31/50 of 1978 pages, 7/50 of 1985, 0/50 from 2012 on [M, regex-based]. So number reuse is a pre-1990 phenomenon [I]. | CC BY-SA. Acquisition as §4.5. |
| **Brickipedia prose and "Reissue" titles** | Remake and reissue relationships in prose | Unmeasured. Search found reissue-titled pages [M]. | CC BY-SA. |
| **Wikidata P144 "based on", P155/P156 "follows / followed by"** | Relationships | 5 and 3 items respectively [M] | CC0. Nil coverage. |

### 3.4 Age range

| Source | Coverage | Cost | Terms |
|---|---|---|---|
| **LEGO GraphQL** (brief) | 2000+; pre-2000 returns nothing | Crawl already planned | Explicit permission held. |
| **Brickset `ageRange`** (brief) | 86% for 2023, 11% for 1999 | Same ~100 calls | As Brickset. |
| **Brickipedia `Ages` infobox** | 2023 50/50, 2018 48/50, 2012 45/50, 2005 37/50, 1999 24/50, 1992 5/50, 1985 9/50, 1978 6/50 [M] | Dump or API | Ages are facts; copyright does not attach [I]. Acquisition terms still apply. |
| **Wikidata P2899 minimum age** | 2 items [M] | — | Nil. |

### 3.5 Coverage by era at a glance

The Brickipedia figures come from a random sample of 50 set pages per year category, drawn via the MediaWiki API [M]. Brickset figures are from the brief. The Brickipedia sample has **no retirement column** because the wiki has no retirement field.

| Year | Brickipedia pages in year category | Ages | Quoted LEGO.com copy | `== Description ==` section | Price in infobox | Brickset exitDate | Brickset ageRange |
|---|---|---|---|---|---|---|---|
| 1978 | 90 | 12% | 0% | 30% | 8% | — | — |
| 1985 | 159 | 18% | 2% | 10% | 10% | — | — |
| 1992 | 150 | 10% | 0% | 14% | 22% | — | — |
| 1999 | 359 | 48% | 8% | 28% | 48% | 39% | 11% |
| 2005 | 307 | 74% | 38% | 36% | 60% | — | — |
| 2012 | 416 | 90% | 48% | 36% | 54% | — | — |
| 2018 | 495 | 96% | 60% | 30% | 56% | — | — |
| 2023 | 514 | 100% | 92% | 2% | 88% | 90% | 86% |

The 83 Brickipedia year categories sum to **16,887** page memberships [M], against the catalogue's ~28,400 sets. The two denominators are not like-for-like: Rebrickable also lists books, gear and keychains, and some wiki pages sit in two year categories [I].

## 4. Source by source

### 4.1 LEGO.com and the LEGO Group (the upstream)

**What exists.** The robots.txt has no `Disallow` covering `/product/`, and it lists product sitemaps ([robots.txt](https://www.lego.com/robots.txt)) [M]. The en-US product sitemap holds 2,634 URLs [M]:

- 1,676 with 5-digit numbers;
- 117 with 6-digit numbers;
- 841 with 7-digit numbers (mostly gear and 500xxxx items).

The lowest number in each set range is 10280, 11023, 21034, 30325, 31058, 40173, 42115, 60205, 71043 and 75192 [M]. There are **no 4-digit numbers and nothing below 10280 in the 10xxx range** [M].

The sitemap includes recently retired products: 10305 and 10312, both exiting 2025-12-31, are present. Longer-retired ones are not: 10236 and 10255 are absent [M]. So the sitemap is a "current plus recently retired" window, and presence in it does not mean a set is available [I].

**Acquisition.** Product pages returned **HTTP 403** to `curl` with an honest User-Agent, and to WebFetch [M]. I did not try to get past it.

The Terms of Use ([last modified 2026-02-27](https://www.lego.com/en-us/legal/terms-of-use)) [M]:

- allow download "for non-commercial, home personal use only";
- forbid copying the site's text and images "for public or commercial purposes, without written permission from LEGO System A/S";
- state "We do not consent to this Site being used or downloaded by any third parties for the purposes of developing, training, or operating artificial intelligence";
- reserve text-and-data-mining rights under Article 4 of the EU DSM Directive.

**Use.** The [Fair Play policy](https://www.lego.com/en-us/legal/notices-and-policies/fair-play) [M] is written for "non-commercial purposes". It permits trademark references with a disclaimer. It tolerates "limited extracts" of catalogues and instructions "in unaltered form for non-commercial purposes".

**Position.** LEGO.com is the source every retirement tracker ultimately depends on, and it is closed to us without permission. We already hold a LEGO permission (GraphQL, 1 req/s). **Extending that relationship is the highest-value ask in this report** [I].

### 4.2 Brickset

Beyond the brief:

- **Fields not yet mentioned** ([API v3 docs](https://brickset.com/article/52664/api-version-3-documentation)) [D]:
  - `LEGOCom` holds US, UK, CA and DE sub-objects, each with `retailPrice`, `dateFirstAvailable` and `dateLastAvailable`;
  - `barcode` holds EAN and UPC;
  - `itemNumbers` holds NA and EU codes;
  - `extendedData` is documented as containing `notes`, `tags` **and `description`**;
  - `getSets` accepts `updatedSince` (yyyy-mm-dd), which makes daily incremental refresh cheap.
- **Terms.** The only usage terms found are on the [web services page](https://brickset.com/article/52666/brickset-web-services) [M]:
  - a cap of 100 `getSets` calls a day to start, with a higher cap "once we're happy with your usage";
  - the API "cannot be used to create 'copycat' websites", with keys revocable.

  The page source contains a **commented-out** notice that key issuing was suspended "while we audit their use… by Q3 2026" [M]. It is not displayed, but it shows Brickset is actively auditing keys. No terms-of-use page exists at `/about/terms` or `/terms` (both return a Page-not-found body) [M]. The footer claims copyright in "all content not covered by The LEGO Group's copyright" [M]. **Storage and redisplay rights are therefore unstated. Ask.**
- **robots.txt** now also disallows `/search`, `/parts`, `/news`, `/reviews`, `*/list-`, `*/tag-`, `*/query-` and `/export`, beyond the `*/page-` rule recorded in the brief ([robots.txt](https://brickset.com/robots.txt)) [M]. Don't crawl; use the API.
- **Set page 10305** (one public page, robots-allowed) [M] shows:
  - Launch/exit "03 Aug 22 - 31 Dec 25";
  - notes "Re-imagined version of 6080-1";
  - three named designers;
  - NA and EU item numbers;
  - UPC and EAN barcodes;
  - packaging size.

  **Designers do not appear in the documented API `sets` class** [D]. They may be web-only.
- **Size.** 23,506 items in the database (site statistic) [M].
- **Historic catalogues.** Brickset's [library](https://brickset.com/library/catalogues) indexes about 173 catalogue scans from 1966 to 2015, most of them pre-2000 (e.g. 10 for 1992, 1 for 2007) [M]. These are PDF image scans of LEGO-copyrighted material (§4.12).

### 4.3 Brick Owl

**Documented but untested in the brief. What the public docs actually say** ([API docs](https://www.brickowl.com/api_docs)) [M]:

- **Bulk dump.** `catalog/bulk` is marked "Catalog Approval required". It is "updated once per day", "rate limited to once per minute", with a quota of 20 requests a day. Types are `catalog_part`, `catalog_minifigure`, `catalog_set`, `catalog_gear`, `catalog_sticker`, `catalog_instructions`, `catalog_packaging` and `catalog_minibuild`. **The docs do not list the fields a bulk record contains**, so the brief's open question cannot be closed from public docs. It needs an approved call.
- **Other endpoints.** `catalog/list` has a quota of 100 a day and returns names only "for accounts with catalog permission". `catalog/lookup` has a quota of 1,000 a day.
- **Catalog Edit fields** (the source of the brief's field list) include `base_name`, `description`, `first_available`, dimensions, weight and ASIN.
- **API restrictions:**
  - "This API is primarily intended for stores… **The API is not available for collection tracking tools.**" Access to restricted paths requires stating "the intended purpose, what data will be used, and where and how the data will be displayed".
  - "The API may not be used by a marketplace."
  - "Any catalog and pricing data that is displayed, must be attributed back to Brick Owl with a link."
  - "There is no license available for the use of images."
- **Site terms** ([terms](https://www.brickowl.com/terms)) [M]:
  - "You must not use tools to scrape data from the Brick Owl website, other than through the API." This overrides robots.txt's permission for catalogue pages.
  - "The textual data only contained within the Brick Owl Catalog is made available under the **Open Database License**."

**Position.** Brick Owl's use terms are the most permissive of any curated source: ODbL is a real open licence. Acquisition, though, is gated twice: by catalog approval, and by a purpose clause that a "which retired sets do I have the pieces for" app may trip. **Human decision**, and it belongs in the permission request.

### 4.4 BrickLink

The open IP question in the brief has a documented answer. The [API Terms of Use (last updated 1 Feb 2023)](https://www.bricklink.com/v3/terms_of_use_api.page) [M] say:

- the API is for "Registered sellers";
- licensees may not "Cache or store any Content… other than for reasonable periods in order to provide the service to BrickLink Members";
- licensees may not display item content "more than six hours older" than the website's;
- the default quota is 5,000 calls a day.

**Catalogue-scale reads stored in our catalogue are not permitted under these terms** [I, from the documented text]. BrickLink also carries none of the four fields beyond a release year [I]. **Not worth a permission request for these fields.** One LEGO-group conversation (BrickLink is LEGO-owned, per the same page) could raise it if ever needed. `catalogList.asp` returned HTTP 202 with an empty body to `curl` [M].

### 4.5 Brickipedia (LEGO Fandom wiki)

**Where it lives.** `lego.fandom.com` redirects to `brickipedia.fandom.com`. It runs MediaWiki 1.43.9 with 43,197 articles and 100 active users, and the API reports the licence as "CC-BY-SA" ([siteinfo API](https://brickipedia.fandom.com/api.php?action=query&meta=siteinfo&siprop=statistics%7Crightsinfo&format=json)) [M].

**brickipedia.org is not Brickipedia.** It is "T3-Brickipedia", with 3 articles, ~70,000 pages and 17,785 "active users": a spam-filled shell [M].

**Structure.** `Template:Set` takes `Ages`, `Pieces`, `Price`, `Released`, `Image`, `Instructions`, `Type` and booklet parameters. It has **no retirement parameter** [M]. The `Set header` template adds `setwithsamenumber`, `before` and `after`. Official copy is wrapped in a `{{QuoteLEGO.com}}` template with the source URL, as on 10305 [M]. That wrapping makes it mechanically separable.

**Acquisition:**

- The MediaWiki API answered normally [M].
- Ordinary page URLs (`Special:Statistics`) and **robots.txt itself** returned a Cloudflare 403 [M]. I could not read Fandom's robots rules.
- A Fandom-published XML dump exists: `lego_pages_current.xml.7z` is 59,671,348 bytes, Last-Modified 2024-09-13, and a full-history `.7z` is 179,558,879 bytes with the same date (HEAD only; [S3](https://s3.amazonaws.com/wikia_xml_dumps/l/le/lego_pages_current.xml.7z)) [M].
- Fandom documents that dumps are listed on Special:Statistics and that only community admins can request a refresh, once every seven days ([Fandom support](https://support.fandom.com/hc/en-us/articles/360026387674-Where-can-I-find-database-dumps)) [D].

**Terms.** The [Fandom Terms of Use (revised 2025-12-19)](https://www.fandom.com/terms-of-use) [M] bar using "any robot, spider, site search and/or retrieval application, or other device to scrape, extract, retrieve or index any portion of the content". The exception is "use of text content… as permitted as set forth at our licensing page". The [licensing page](https://www.fandom.com/licensing) [M] puts wiki text under CC BY-SA 3.0 Unported.

**Position.** The dump is the cleanest acquisition route: Fandom publishes it, so nothing is crawled [I]. It is two years stale. Whether reading via the API sits inside the ToS exception is a question for a lawyer, not an engineer.

### 4.6 BrickEconomy

- **API** ([reference](https://www.brickeconomy.com/api-reference)) [M, read in browser]:
  - one set per request ("doesn't support bulk");
  - "standard rate limit is 100 requests per day", "aligned with the Premium membership's license terms";
  - returns `retired` (boolean), `retired_date`, `released_date`, `availability`, retail prices, EAN/UPC and valuations;
  - has **no description, age or edition fields**.
- **ToS** ([updated 07/10/2026](https://www.brickeconomy.com/legal-terms-of-service)) [M, read in browser]:
  - grants a "personal license… for personal or, informational purposes only";
  - its "Web robots & spiders" clause prohibits robots "or manual processes to monitor or copy our web pages… without our explicit written consent".
- **robots.txt** allows every agent, including ClaudeBot and GPTBot ([robots.txt](https://www.brickeconomy.com/robots.txt)) [M]. **robots.txt is not permission here.** The ToS forbids what robots allows.
- **Position.** Not viable at 28,400 sets (≈284 days of quota, under a personal licence) [I]. Its retirement data's provenance is undocumented; it probably shares LEGO.com as its root [I, unverified]. Only worth a paid-licence conversation if an independent cross-check of Brickset becomes necessary.

### 4.7 Brick Insights, BrickPicker, brickmerge

- **Brick Insights** is a review aggregator. "All set data is used from [Brickset], imported daily via their API" ([FAQ](https://brickinsights.com/faq)) [M]. The site footer links an "Export" at `/api/sets/export`, but robots.txt disallows `/api/` [M]. Not fetched. It is derivative of Brickset, so it adds nothing for our fields.
- **BrickPicker** returned "Your request was blocked" (HTTP 403) [M]. Its robots.txt disallows ClaudeBot and GPTBot entirely, and `/api/` for everyone [M]. Not assessed further.
- **brickmerge.de** (a German price comparison) sets `Crawl-delay: 5` and disallows only alarm, chart, login and affiliate paths ([robots.txt](https://www.brickmerge.de/robots.txt)) [M]. Whether it carries exit dates was not verified.

### 4.8 Wikidata

Measured through the [public SPARQL endpoint](https://query.wikidata.org/):

- **23** items carry P6187 "LEGO set ID". All are instances of Q6518582 "Lego set".
- Property usage on those items: publication date 21, Fandom article ID 12, GTIN 8, discontinuation date **3**, minimum age **2**, "based on" 5.
- Only 11 items across Wikidata link a `lego:` Fandom article.

**Wikidata is not a source.** It covers under 0.1% of the catalogue [I]. It is CC0, so a later contribution back would be possible.

### 4.9 News and community sites

None of these publishes structured or bulk data. All are prose.

- **Stonewars.** Its robots.txt carries Cloudflare content signals `search=yes, ai-train=no, use=reference`, blocks ClaudeBot, GPTBot and CCBot, and cites EU DSM Article 4 ([robots.txt](https://www.stonewars.de/robots.txt)) [M]. The Impressum limits downloads and copies to private, non-commercial use ([Impressum](https://www.stonewars.de/impressum/)) [M]. Retiring-set lists appear as articles, e.g. [stonewars.com/retiring-2026](https://stonewars.com/retiring-2026/) (secondary).
- **Promobricks.** robots.txt returned 403 [M]. Could not assess.
- **Brick Fanatics.** robots.txt allows all but `/tag/` [M]. The terms page returned 403 [M]. Its retiring list is an article ([secondary](https://www.brickfanatics.com/every-lego-set-retiring-this-year-and-beyond)).
- **Eurobricks.** robots.txt allows `/forum/` with `Content-Signal: ai-train=no, search=yes, ai-input=no, use=reference` [M]. The [registration terms](https://www.eurobricks.com/forum/terms/) contain no automated-access clause [M]. Forum prose only.
- **Reddit.** robots.txt is `Disallow: /` for all agents and points to its Public Content Policy ([robots.txt](https://www.reddit.com/robots.txt)) [M]. Unstructured, and closed to crawling.

These are fine for a human checking this year's retirements. They are not data sources [I]. Their retirement lists are themselves fed by LEGO announcements and retailer leaks (secondary, [Brick Fanatics](https://www.brickfanatics.com/every-lego-set-retiring-this-year-and-beyond)).

### 4.10 Retailers: unusable

Stated plainly: **no retailer catalogue is usable for these fields.** robots.txt mostly permits product pages (Amazon, Target, Walmart, Zavvi, Smyths, Toys"R"Us all checked) [M]. The terms forbid the automated collection that catalogue-scale use would need:

- **Amazon Conditions of Use** ([updated 2026-08-14](https://www.amazon.com/gp/help/customer/display.html?nodeId=508088)) [M] exclude "any collection and use of any product listings, descriptions, or prices" and "any use of data mining, robots, or similar data gathering and extraction tools". Amazon's affiliate API (PA-API 5) was deprecated on 2026-04-30 and retired on 2026-05-15 in favour of the Associates-only Creators API ([Amazon Associates](https://affiliate-program.amazon.com/creatorsapi/docs/en-us/paapiv5-deprecation)) [D]. That route is tied to affiliate linking.
- **Walmart Terms of Use** [M] prohibit using "any robot, spider… to retrieve, index, 'scrape,' 'data mine'".

Even with permission the data is wrong for us:

- a retailer's description is usually LEGO's copy, so it carries LEGO's rights [I];
- absence from stock means "not stocked", not "retired" (as the brief notes).

### 4.11 Open datasets

Every dataset found is either a Rebrickable re-dump, a Brickset API re-dump, or a LEGO.com scrape. Several carry licences their authors had no right to grant. All metadata below was read through the Kaggle and Hugging Face APIs [M]; no files were downloaded.

| Dataset | Provenance (from its card) | Last updated | Licence label | Verdict |
|---|---|---|---|---|
| [rtatman/lego-database](https://www.kaggle.com/datasets/rtatman/lego-database) | Rebrickable | 2017-07-14 | CC0 | Stale re-dump |
| [iamjcmc/lego-database-2025](https://www.kaggle.com/datasets/iamjcmc/lego-database-2025) | Rebrickable, Oct 2025 | 2025-10-30 | CC0 | Re-dump; adds nothing |
| [jkraak/lego-sets-and-themes-database](https://www.kaggle.com/datasets/jkraak/lego-sets-and-themes-database) | Rebrickable | 2023-08-23 | CC0 | Re-dump |
| [alexracape/lego-sets-and-prices-over-time](https://www.kaggle.com/datasets/alexracape/lego-sets-and-prices-over-time) | Brickset API + BrickLink API, 2023-05-10 | 2023-11-09 | MIT | Brickset re-dump under a licence Brickset never granted |
| [mterzolo/lego-sets](https://www.kaggle.com/datasets/mterzolo/lego-sets) | "scraped… from Lego's website" | 2018-05-18 | CC0 | LEGO copy, laundered |
| [alessiasimone/lego-sets-and-price-1955-2023](https://www.kaggle.com/datasets/alessiasimone/lego-sets-and-price-1955-2023) | Rebrickable + mterzolo | 2023-11-17 | CC0 | Derivative of both |
| [Maven Analytics "LEGO Sets"](https://mavenanalytics.io/data-playground/lego-sets) | "Source: Brickset" | — | "Public Domain" | Laundered |
| Data in Brief 2024, [PMC10828600](https://pmc.ncbi.nlm.nih.gov/articles/PMC10828600/) (DOI 10.34808/s25h-sx91) | Brickset API + LEGO.com scrape + promoklocki.pl | Data to June 2023 | CC BY | Academic. Has `dateLastAvailable` per region (Brickset's). Frozen and legally tangled [D]. |
| Hugging Face search "lego", "lego sets", "brickset" | Robotics, images, one OMR + Rebrickable set | — | — | Nothing relevant [M] |
| GitHub | API clients (e.g. [jbryer/brickset](https://github.com/jbryer/brickset)) and BrickEconomy scrapers | — | — | No curated retirement dataset [M] |

Freshness is not the main problem. Provenance is: none of these can hand over rights its source did not give [I].

### 4.12 LEGO catalogues (historic)

Catalogue appearances are the only primary-ish evidence of **when a pre-2008 set was on sale**. Brickipedia cites them; Brickset hosts about 173 scans [M]. Using them at scale would mean reading image PDFs of LEGO-copyrighted catalogues. Fair Play tolerates only "limited extracts… for non-commercial purposes" [M].

**Worth it only for spot-checking the pre-2008 inference, not as a pipeline** [I]. BrickLink's catalogue items are reported to list the sets pictured in each catalogue (secondary search summary); that is unverified, and BrickLink's API terms forbid storing it anyway.

## 5. Recommendations per field

### 5.1 Retired

**Recommend:** Brickset `exitDate` as the asserted signal, re-checked daily with `updatedSince`, and an explicit inference for everything Brickset cannot date.

**Is pre-2008 inference safe? Yes, with a flag.** The evidence:

1. **LEGO.com carries nothing old.** Its en-US product sitemap has no set number below the ranges that started in the 2010s: lowest 10280, 21034, 75192, and no 4-digit numbers [M]. It does include recently retired sets [M]. So its window reaches back a few years past retirement and no further [I].
2. **Brickset's retirement tracking starts around 2008** (brief). The sets it cannot date are the old ones, exactly where retirement is least in doubt.
3. **Selling a set for 19+ years would be extraordinary.** The longest-lived sets still on LEGO.com date from 2017 (75192, 21034) [M].

**Residual risks** [I]:

- **LEGO Education products** sold through education channels for many years. The LEGO.com sitemap does not cover that channel (only 4 45xxx products appear) [M].
- **Non-set items.** Rebrickable's catalogue includes books, gear and keychains, for which "retired" is meaningless.
- **Wrong or reused years.** A catalogue year could be wrong, or a reused number could attach an old year to a newer product. Rebrickable's per-variant year makes the second unlikely.

None of these is large. All of them are reasons to say "inferred" rather than "asserted".

**How to represent it.** Keep status, basis and date apart:

| Column | Values |
|---|---|
| `retirement_status` | `available` · `retiring` (exit date in the future) · `retired` · `unknown` |
| `retirement_basis` | `source_exit_date` (Brickset) · `source_status` (LEGO, if permission lands) · `inferred_release_year` · `inferred_absent_from_lego` |
| `exit_date` | Date or **null**. Never synthesise 31 December of the release year. |
| `exit_date_source` | `brickset` · `lego` · null |
| `retirement_as_of` | Date of last check |

The user-facing filter "retired" can include both asserted and inferred sets; for 1995 sets that is the honest answer. Display should differ slightly: "Retired" versus "Retired (before 2008)", with no fabricated date.

**Rules for 2008+ sets with no `exitDate`** [I]:

- Mark `unknown` while the set is plausibly current.
- Promote to `retired / inferred_absent_from_lego` only when the release year is at least ~9–10 years back **and** the number is absent from the LEGO.com sitemap. The 9–10 years comes from 75192 and 21034 still being listed.
- Calibrate the threshold against Brickset's own `launchDate` → `exitDate` distribution once ingested. That is a query against data we will hold, not new research.

**Rejected:** BrickEconomy (licence and quota), community lists (not data), retailers (unusable), Wikidata (empty).

### 5.2 Description

**Recommend a tiered field with mandatory provenance, and drop "official description" for pre-2000 sets.**

1. **LEGO product copy, only if LEGO grants it in writing.** It covers sets inside LEGO.com's window (roughly 2017 onwards) [I].
2. **Brickipedia community prose** from the Fandom dump, with `{{QuoteLEGO.com}}` blocks stripped. It is CC BY-SA 3.0: store an attribution string and page URL per row, and get a human decision on what share-alike obliges (§8). Pre-2000 pages are often a single sentence [M]. That is still more than any other source.
3. **Generated factual blurb** from structured fields: name, theme, year, pieces, minifigs, and relationships such as "re-imagines 6080 King's Castle". Label it `generated`. Its **inputs must exclude LEGO copy**, because of the LEGO No-AI clause and the TDM reservation [M].
4. **Brick Owl description, only if** the bulk dump turns out to contain it with real coverage **and** the purpose clause clears. Check whether its text is copied from LEGO before relying on ODbL [I].

**Do not use:** Brickipedia's quoted LEGO copy, Kaggle scrapes, retailer copy. Brickset's `extendedData.description` stays pending until the conflict in §8 is resolved.

### 5.3 Edition / version

**Recommend: drop "edition" as a scalar field. Replace it with a small relationship table.**

The table is `set_relationship(from_set, to_set, kind, source, confidence)`, with `kind ∈ {remake_of, reissue_of, same_number_variant}`.

- **`same_number_variant`**: free and complete from Rebrickable suffixes (already held).
- **`remake_of` / `reissue_of`**: seed from a regex pass over Brickset `notes`, which will be ingested anyway (patterns such as *version of NNNN-N*, *re-release*, *reissue*, *remake*). Then add Brickipedia prose and "Reissue" titles. Review by hand; the volume is small [I].
- **Check with the held key:** whether Brickset `tags` include a remake or re-release tag (`getSets` accepts a `tag` filter) [D, untested].

The UI phrase "2022 edition of set 6080" should become "Re-imagining of 6080 King's Castle (1984)". **10305 is not numbered 6080** [M], so "edition of 6080" would mislead.

### 5.4 Age range

**Recommend:** LEGO GraphQL (2000+), then Brickset `ageRange`, then the Brickipedia `Ages` parameter (it lifts 1999 from Brickset's 11% to about half) [M], then **null, shown as "Age not recorded"**.

- Store min and max separately; Brickipedia has ranges such as "8-12" for 6080 [M].
- Tag each value with its source.
- Remove the hardcoded `18+` outright. It is wrong for the large majority of sets [I].

## 6. Permission asks worth making

| # | Who | Ask for exactly | Why it's worth it |
|---|---|---|---|
| 1 | **LEGO Group**, via the contact behind the existing GraphQL permission | (a) Permission to read LEGO.com product data (availability status incl. "retired" / "last chance", age, product description) at 1 req/s, **or** a product feed. (b) Written permission to **display** product descriptions in our app, with the wording of any required notice. (c) Clarity on whether our use touches the "No AI" clause, e.g. if descriptions are summarised by an LLM. (d) Confirmation that "retired" status shown in-app may cite LEGO as source. | The only upstream for retirement and official copy. Every other tracker depends on it. An existing relationship lowers the cost of asking. |
| 2 | **Brickset** (Huw, via the "Contact us" form in the site footer) | (a) A production `getSets` cap: one-off ~100 calls, then a daily `updatedSince` sync. (b) Explicit permission to **store and redisplay** `exitDate`, `launchDate`, `ageRange`, `availability`, `LEGOCom` dates, `notes`, `tags`, barcodes and item numbers in a commercial app, with the attribution form they want. (c) Confirmation we are not a "copycat website". (d) Whether `extendedData.description` is populated and licensable. | Best 2008+ retirement source. Brickset's terms are silent on storage, and it is auditing keys now [M]. |
| 3 | **Brick Owl** (request already in progress; sharpen it) | (a) `catalog/bulk` approval for `catalog_set`. (b) The **field list** of a set bulk record: is `description` there, how populated, and is it copied from LEGO? (c) A ruling that our app is not a "collection tracking tool" or marketplace under the API terms, disclosing honestly that users check whether they own a set's pieces. (d) The exact ODbL attribution form. | ODbL is the only genuinely open licence among curated sources. The purpose clause could sink it, so ask before building. |
| 4 | **Brickipedia admins** ([Brickipedia](https://brickipedia.fandom.com/)) | Request a fresh database dump via Special:Statistics (admins only, every 7 days max) [D]. Optionally, their view on bot-rate API reads. | Turns a two-year-old dump into a current one, with no crawling. |
| 5 | *(low priority)* **BrickEconomy** | A bulk licence for `retired_date` / `released_date`, only if an independent Brickset cross-check is wanted. | Its terms say to contact them for permission. But independence is doubtful (§8), and it likely costs money. |

**Not worth asking:** BrickLink (no target fields; terms forbid storing), retailers, Reddit, community blogs, Brick Insights (it is Brickset).

## 7. Things we didn't ask for but should carry

All [I] unless marked otherwise.

- **Set category / type.** Brickset `category` or Rebrickable set type. It keeps books, gear, keychains and B-models out of retirement and age filters. Without it, "retired sets" will be full of 1990s keychains.
- **Sales channel.** Brickset `availability`, renamed. "LEGO exclusive", "Promotional" and "Gift with purchase" matter to hunters: GWPs were never sold, so "retired" reads oddly for them.
- **Launch and exit dates as dates**, not just a boolean. They enable "retired in 2024" views and calibrate the inference in §5.1.
- **RRP by region.** Brickset `LEGOCom.*.retailPrice` [D], and Brickipedia `Price` for pre-2008 sets (8–48% of pre-2000 samples) [M]. Useful context for retired-set hunters.
- **Barcodes (EAN/UPC) and LEGO item numbers (NA/EU).** Brickset [D, M on 10305]. They enable scan-to-identify and disambiguate regional SKUs.
- **Regional and alternative names.** 6080 was "Castle Lion" in the UK and "Lion Crest Castle" in Canada and Australia (Brickipedia) [M]. Search quality depends on this.
- **Remake / reissue relationships** (§5.3). They are also a discovery feature: "see the 2022 re-imagining".
- **Cross-IDs.** Brickset setID, Brick Owl BOID, BrickLink item number, Brickipedia page title, Wikidata QID. They are cheap to hold and make every future enrichment a join, not a search.
- **Instructions availability.** LEGO GraphQL plus Brickset `instructionsCount`, since users "build from the instructions" (brief).
- **Designers.** Brickset shows them on set pages [M]. Web-only as far as the API docs show [D], so ask before relying on them.
- **Per-field provenance, as-of date and licence obligation.** Mixing CC BY-SA text, ODbL data and permissioned LEGO data means attribution and share-alike duties differ **per column**. The schema should record this, not a README.

## 8. Analysis

### Conflicts between sources

**Brickset's docs versus Brickset's API.** The v3 documentation lists `description` inside `extendedData` and says `extendedData` "retrieve[s] the full data set, including tags, description and notes" [D]. The brief measured that it returns notes and tags only. Possible explanations [I]:

- the field exists but is null;
- it is withheld from some keys;
- it is legacy.

Resolve by checking raw JSON from one call with the held key, looking for `"description": null` against the key being absent.

**robots.txt versus terms, three times over.**

- BrickEconomy's robots.txt welcomes every bot including ClaudeBot; its ToS bans robots and "manual processes" [M].
- Brick Owl's robots.txt permits catalogue pages; its terms ban scraping outside the API [M].
- LEGO's robots.txt permits `/product/`; its ToS bars commercial copying, and its edge returns 403 [M].

This is the brief's "acquisition terms bind independently" lesson in the wild. robots.txt tells a crawler where it may go technically, never whether the terms allow it.

**Wiki licence versus wiki content.** Brickipedia is CC BY-SA, yet its most description-like content on modern pages is LEGO's copy in a quote template [M]. A naive ingestion of "the description section" would import LEGO's copyright under a licence LEGO never granted [I].

**Retirement sources are not independent.** Brickset gets exit data from LEGO.com [D]. Brick Insights gets its set data from Brickset [M]. The Data in Brief dataset is Brickset plus a LEGO.com scrape [D]. Community retiring lists mirror LEGO and retailer leaks (secondary). Cross-checking Brickset against these is mostly checking LEGO against LEGO. Agreement between them is weak evidence of correctness [I].

### Dissent against this report's recommendations

**"Just don't infer; show pre-2008 as unknown."** Showing "unknown" for a 1985 castle is technically humble and practically wrong. The brief is explicit that people *filter* for retired sets, so an "unknown" 1985 set silently disappears from the results they want. The case for inference is strong for pre-2008. The case weakens quickly for 2008–2016 gaps, which is why §5.1 treats them separately.

**"Drop description entirely."** This is defensible. Generated blurbs risk sounding like the marketing copy we can't use, and Brickipedia's pre-2000 prose is thin. The counter is that a factual one-liner assembled from our own data ("664-piece Castle set from 1984 with 12 minifigures; re-imagined in 2022 as 10305") is useful, carries no rights problem, and is honest about what it is. If the owner values authentic LEGO voice above coverage, the honest answer is "LEGO copy for ~2017+ if permitted, nothing otherwise".

**"Brick Owl's ODbL makes it the best description source; build on it now."** Not yet. Coverage is unmeasured (n=1 page showed nothing). The purpose clause is unresolved. ODbL cannot relicense text that Brick Owl contributors copied from LEGO. Wait for the approval call.

**"Brickipedia via the API is obviously fine because the text is CC BY-SA."** Possibly. But Fandom's ToS robot clause is broad, and its exception is phrased around *use* of text, not *retrieval*. The dump sidesteps this.

### Self-criticism

- **Brickipedia sample size.** 50 random pages per year for 8 years is directional, not exact. With n=50 a 48% estimate has a 95% interval of roughly ±14 points. The field detection is regex over wikitext and may miss unusual formatting. The `setwithsamenumber` count could over-count on odd template layouts. The "median prose characters" figure I computed was too crude to report and is omitted.
- **One locale.** The LEGO.com inference rests on the en-US sitemap alone. Another locale, or LEGO Education's separate channel, could list older products.
- **Things I did not measure:**
  - Brickset exit-date coverage for 2008–2022; the brief's two points are all there is. The threshold advice in §5.1 depends on it.
  - Brick Owl description coverage; it rests on one page, in a browser, and may have failed to render a lazy-loaded tab.
- **Browser use.** Several terms and documentation pages were read through a browser session because Cloudflare blocked scripted clients. That is reading, not scraping, but it is disclosed. The Brick Owl view happened to carry an existing login.
- **Datasets not opened.** Column-level claims about datasets come from their cards, not their files. That was a choice to avoid unapproved downloads.

## 9. What I couldn't find or verify

1. **Brick Owl bulk dump field list.** Not in the public API docs [M]. Needs the approval call.
2. **Fandom's robots.txt.** Cloudflare 403 to scripted clients [M]. Unread.
3. **Brickset data-use terms beyond the "copycat" line.** No terms page exists [M].
4. **Brickset exit-date coverage for 2008–2022**, and whether `tags` encode remakes.
5. **Whether `extendedData.description` is ever populated** (§8).
6. **LEGO.com product page structure** (status labels, description markup). Blocked by the 403 [M]; anything said about its internal endpoint would be secondary hearsay.
7. **BrickEconomy's retirement coverage and provenance.** Needs a key, and its pages are ToS-barred.
8. **Promobricks and Brick Fanatics terms**, and **BrickPicker in general.** 403 responses [M].
9. **Whether brickmerge.de carries exit dates.**
10. **LEGO Education's catalogue**, and whether any pre-2008 education set is still sold. This is the main residual risk to the pre-2008 inference.
11. **BrickLink catalogue-item inventories** (sets pictured per catalogue). Secondary search summary only.
12. **A Brickset methodology note for historic (pre-2008) exit dates.** None found.

---

## Sources

All accessed 2026-09-15.

**LEGO**

- LEGO.com Terms of Use (modified 2026-02-27): https://www.lego.com/en-us/legal/terms-of-use
- LEGO Fair Play policy: https://www.lego.com/en-us/legal/notices-and-policies/fair-play
- LEGO.com robots.txt: https://www.lego.com/robots.txt
- LEGO.com en-US product sitemap: https://www.lego.com/sitemap-productPage-en-US0.xml
- LEGO.com legal sitemap: https://www.lego.com/en-us/legal/sitemap.xml

**Brickset**

- API v3 documentation: https://brickset.com/article/52664/api-version-3-documentation
- Web services and key terms: https://brickset.com/article/52666/brickset-web-services
- "Lists of sets retiring soon" (2023, owner post): https://brickset.com/article/98118/lists-of-sets-retiring-soon
- robots.txt: https://brickset.com/robots.txt
- Set 10305 page: https://brickset.com/sets/10305-1
- Catalogue library: https://brickset.com/library/catalogues

**Rebrickable**

- Set types and numbering: https://rebrickable.com/help/sets-types/

**Brick Owl**

- API documentation: https://www.brickowl.com/api_docs
- Terms (API section; catalogue ODbL): https://www.brickowl.com/terms
- robots.txt: https://www.brickowl.com/robots.txt

**BrickLink**

- API Terms of Use (updated 2023-02-01): https://www.bricklink.com/v3/terms_of_use_api.page
- robots.txt: https://www.bricklink.com/robots.txt

**Brickipedia and Fandom**

- MediaWiki API: https://brickipedia.fandom.com/api.php
- Fandom Terms of Use (revised 2025-12-19): https://www.fandom.com/terms-of-use
- Fandom licensing: https://www.fandom.com/licensing
- Fandom support, database dumps: https://support.fandom.com/hc/en-us/articles/360026387674-Where-can-I-find-database-dumps
- Brickipedia current-pages dump (HEAD only): https://s3.amazonaws.com/wikia_xml_dumps/l/le/lego_pages_current.xml.7z
- T3-Brickipedia (not Brickipedia): https://brickipedia.org/api.php

**Wikidata**

- SPARQL endpoint: https://query.wikidata.org/
- Property P6187, LEGO set ID: https://www.wikidata.org/wiki/Property:P6187

**Price trackers and aggregators**

- BrickEconomy API reference: https://www.brickeconomy.com/api-reference
- BrickEconomy Terms of Service (updated 2026-07-10): https://www.brickeconomy.com/legal-terms-of-service
- BrickEconomy robots.txt: https://www.brickeconomy.com/robots.txt
- Brick Insights FAQ: https://brickinsights.com/faq
- Brick Insights robots.txt: https://brickinsights.com/robots.txt
- BrickPicker robots.txt: https://www.brickpicker.com/robots.txt
- brickmerge robots.txt: https://www.brickmerge.de/robots.txt

**News and community**

- Stonewars robots.txt: https://www.stonewars.de/robots.txt
- Stonewars Impressum: https://www.stonewars.de/impressum/
- Stonewars retiring 2026 list (secondary): https://stonewars.com/retiring-2026/
- Brick Fanatics retiring list (secondary): https://www.brickfanatics.com/every-lego-set-retiring-this-year-and-beyond
- Eurobricks robots.txt: https://www.eurobricks.com/robots.txt
- Eurobricks registration terms: https://www.eurobricks.com/forum/terms/
- Reddit robots.txt: https://www.reddit.com/robots.txt

**Retailers**

- Amazon Conditions of Use (updated 2026-08-14): https://www.amazon.com/gp/help/customer/display.html?nodeId=508088
- Amazon PA-API deprecation notice: https://affiliate-program.amazon.com/creatorsapi/docs/en-us/paapiv5-deprecation
- Walmart Terms of Use: https://www.walmart.com/help/article/walmart-com-terms-of-use/3b75080af40340d6bbd596f116fae5a0
- Amazon robots.txt: https://www.amazon.com/robots.txt
- Target robots.txt: https://www.target.com/robots.txt
- Walmart robots.txt: https://www.walmart.com/robots.txt
- Zavvi robots.txt: https://www.zavvi.com/robots.txt

**Open datasets**

- Data in Brief LEGO dataset (2024): https://pmc.ncbi.nlm.nih.gov/articles/PMC10828600/
- Kaggle: https://www.kaggle.com/datasets/rtatman/lego-database
- Kaggle: https://www.kaggle.com/datasets/iamjcmc/lego-database-2025
- Kaggle: https://www.kaggle.com/datasets/jkraak/lego-sets-and-themes-database
- Kaggle: https://www.kaggle.com/datasets/alexracape/lego-sets-and-prices-over-time
- Kaggle: https://www.kaggle.com/datasets/mterzolo/lego-sets
- Kaggle: https://www.kaggle.com/datasets/alessiasimone/lego-sets-and-price-1955-2023
- Maven Analytics LEGO Sets: https://mavenanalytics.io/data-playground/lego-sets
- Hugging Face dataset search API: https://huggingface.co/api/datasets?search=lego
