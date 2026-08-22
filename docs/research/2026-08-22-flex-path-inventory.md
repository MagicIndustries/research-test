# Flex-path models in the OMR corpus — full inventory

**Date:** 2026-08-22 · **Scope:** all 200 affected models of 1,464

Amends §4.3 of [`2026-08-22-test-corpora-design.md`](2026-08-22-test-corpora-design.md), which named two examples and implied a handful. It is **200** — 13.7% of the corpus.

---

## 1. What these are

LDCad supports *flexible* elements whose shape is not fixed by the part file: hoses, cables, chains, rubber bands, and springs. Their geometry depends on where their endpoints sit, so LDCad computes it and writes the result into the model as **fallback geometry**, wrapped in `0 !LDCAD GENERATED` blocks.

Every block carries LDCad's own warning:

```
0 //This is the fallback LDraw content for above SPRING configuration.
0 // Do not edit, any changes will be lost upon regeneration.
```

Two configuration types occur:

| Type | Blocks | Models | What it is |
|---|---:|---:|---|
| `PATH` | 887 | 190 | Hoses, cables, chains, rubber bands routed along a spline |
| `SPRING` | 108 | 35 | Coil springs and shock absorbers |

Totals: **1,008 generated blocks** containing **680,623 inline triangles and quads**.

## 2. Why this matters to the verifier

**The geometry is a snapshot, not the model.** LDCad regenerates it from the flex configuration whenever endpoints move. Two files that are semantically identical can carry entirely different generated geometry — so any check over that geometry measures the generator's last run, not the build.

**It is raw polygons, not part placements.** The verifier's whole model is a placement graph: parse type-1 references, resolve to an IR, check relationships. Generated blocks are type-3 and type-4 polygon lines. They carry no part identity, no connectivity, no stud. They are invisible to every rule the tool has, and they inflate every count that walks lines rather than placements.

**It already caused a real false positive.** During implementation, `E-01` fired on generated content: a subpart reached through a flex path carried a genuinely non-uniform transform. The fix excluded LDCad-generated blocks explicitly. That was treated as a two-model curiosity; it is a 200-model class.

**It wrecks part accounting.** The inventory cross-check in §4.1 of the corpora spec counts type-1 references. A hose modelled as generated geometry contributes none, so a faithful reproduction reads as missing parts.

**It distorts size.** `8466-1` has 1,327 parts and 311,435 lines — 235 lines per part. The corpus median is 3.3. Any heuristic using file size as a proxy for model size is wrong by two orders of magnitude on these.

## 3. Recommendation

**Exclude all 200 from GOLD.** Not because the models are bad — many are excellent reproductions — but because the oracle argument requires that what the verifier sees is what the builder built, and for flex geometry it is not.

**Keep them in WILD**, and treat them as a deliberate stress class: they are the best available test that the tool ignores non-placement content correctly and does not degrade on files two orders of magnitude larger than their part count suggests.

**Do not inject into them.** A mutation's effect cannot be isolated when regeneration may rewrite unrelated geometry.

**Add a corpus-manifest flag** — `flex: true`, with block count and type — so the exclusion is data rather than a rule someone has to remember.

## 4. Severe — more than 50 lines per part (8 models)

These are the extreme cases. Generated geometry dominates the file.

| Set | Model | Parts | Lines | Lines/part | Blocks | Inline tris | Type |
|---|---|---:|---:|---:|---:|---:|---|
| `8466-1` | 8466 - 8466truck2 | 1,327 | 311,435 | 234.7 | 33 | 116,949 | PATH+SPRING |
| `8448-1` | 8448 - main | 1,331 | 183,705 | 138.0 | 18 | 68,312 | PATH+SPRING |
| `42026-1` | 42026 - main | 147 | 39,889 | 271.4 | 4 | 15,175 | PATH |
| `42058-1` | 42058 - main | 185 | 17,072 | 92.3 | 1 | 6,248 | PATH |
| `8217-1` | 8217 - main | 63 | 8,063 | 128.0 | 3 | 2,544 | PATH |
| `8810-1` | 8810 - main | 84 | 4,515 | 53.8 | 2 | 1,424 | SPRING |
| `8209-1` | 8209 - main | 54 | 4,428 | 82.0 | 2 | 1,424 | SPRING |
| `8203-1` | 8203 - main | 37 | 1,977 | 53.4 | 2 | 604 | PATH |

## 5. Moderate — 10 to 50 lines per part (42 models)

| Set | Model | Parts | Lines | Lines/part | Blocks | Inline tris | Type |
|---|---|---:|---:|---:|---:|---:|---|
| `42083-1` | 42083 - main | 4,382 | 68,718 | 15.7 | 23 | 22,632 | PATH+SPRING |
| `7191-1` | 7191 - main | 1,177 | 52,269 | 44.4 | 2 | 19,009 | PATH |
| `42096-1` | 42096 - main | 2,078 | 49,652 | 23.9 | 17 | 18,587 | PATH+SPRING |
| `42115-1` | 42115 - 0-main | 4,267 | 48,198 | 11.3 | 25 | 18,286 | PATH+SPRING |
| `41075-1` | 41075-1 - main | 810 | 39,790 | 49.1 | 1 | 17,384 | PATH |
| `10283-1` | 10283 - main | 3,032 | 36,039 | 11.9 | 5 | 19,248 | PATH+SPRING |
| `21323-1` | 21323 - main | 2,904 | 30,264 | 10.4 | 4 | 8,237 | PATH |
| `42039-1` | 42039 - 24 Hours Race Car | 1,355 | 27,047 | 20.0 | 12 | 9,633 | PATH+SPRING |
| `42054-1` | 42054 - main | 2,554 | 25,976 | 10.2 | 4 | 8,259 | PATH |
| `10262-1` | 10262 - main | 1,523 | 22,119 | 14.5 | 2 | 7,353 | PATH |
| `42036-1` | 42036 - Street Motorcycle | 470 | 21,981 | 46.8 | 10 | 7,980 | PATH+SPRING |
| `3189-1` | 3189 - main | 791 | 21,916 | 27.7 | 2 | 11,517 | PATH |
| `6765-1` | 6765 - Main model | 444 | 21,404 | 48.2 | 4 | 13,358 | SPRING |
| `42111-1` | 42111 - main | 1,283 | 17,494 | 13.6 | 7 | 4,870 | PATH+SPRING |
| `41015-1` | 41015 - main | 1,139 | 17,433 | 15.3 | 4 | 6,713 | PATH |
| `6919-1` | 6919 - main | 461 | 15,591 | 33.8 | 4 | 5,587 | SPRING |
| `8838-1` | 8838 - main | 409 | 15,484 | 37.9 | 15 | 4,683 | PATH+SPRING |
| `42063-1` | 42063 - main | 1,023 | 15,419 | 15.1 | 6 | 5,133 | PATH+SPRING |
| `42038-1` | 42038 - Arctic Truck | 1,034 | 14,795 | 14.3 | 8 | 4,880 | PATH+SPRING |
| `42029-1` | 42029 - Main | 1,193 | 14,240 | 11.9 | 8 | 3,872 | PATH+SPRING |
| `8063-1` | 8063 - Tractor with Trailer | 1,189 | 12,791 | 10.8 | 7 | 4,737 | PATH |
| `21043-1` | 21043 - main | 611 | 10,259 | 16.8 | 3 | 3,463 | PATH |
| `8283-1` | 8283 - Main | 346 | 9,782 | 28.3 | 4 | 2,928 | PATH |
| `10281-1` | 10281 - main | 710 | 9,071 | 12.8 | 2 | 3,604 | PATH |
| `75878-1` | 75878 - main | 321 | 8,343 | 26.0 | 1 | 6,800 | PATH |
| `21047-1` | 21047 - main | 596 | 7,355 | 12.3 | 3 | 2,676 | PATH |
| `42101-1` | 42101 - main | 199 | 7,203 | 36.2 | 3 | 2,128 | PATH+SPRING |
| `42037-1` | 42037 - Formula Off Roader | 688 | 7,173 | 10.4 | 2 | 2,156 | SPRING |
| `7410-1` | 7410 - main | 164 | 6,070 | 37.0 | 1 | 2,697 | PATH |
| `8256-1` | 8256 - main | 146 | 5,689 | 39.0 | 3 | 2,208 | PATH |
| `8836-1` | 8836 - main | 292 | 5,354 | 18.3 | 4 | 1,504 | PATH+SPRING |
| `4025-1` | 4025 - Fire Boat | 484 | 5,215 | 10.8 | 3 | 1,408 | PATH |
| `8820-1` | 8820 - main | 202 | 4,905 | 24.3 | 2 | 1,474 | SPRING |
| `42044-1` | 42044 - Display Team Jet | 141 | 4,889 | 34.7 | 2 | 1,953 | PATH |
| `8832-1` | 8832-1 - Roadster - main | 242 | 4,716 | 19.5 | 6 | 1,424 | PATH+SPRING |
| `8840-1` | 8840 - main | 226 | 4,669 | 20.7 | 2 | 1,424 | SPRING |
| `6755-1` | 6755 - Sheriff's Lock-Up - Main | 210 | 4,645 | 22.1 | 2 | 1,424 | SPRING |
| `8845-1` | 8845 - Main | 174 | 4,561 | 26.2 | 2 | 1,424 | SPRING |
| `21019-1` | 21019 - The Eiffel Tower | 221 | 2,810 | 12.7 | 1 | 1,024 | PATH |
| `8054-1_Model-A` | 8054 - Universal Building Set with 4.5 | 95 | 2,577 | 27.1 | 3 | 708 | PATH |
| `8218-1` | 8218 - main | 70 | 1,659 | 23.7 | 1 | 512 | PATH |
| `8204-1` | 8204 - main | 43 | 1,626 | 37.8 | 2 | 480 | PATH |

## 6. Mild — 10 or fewer lines per part (150 models)

Still excluded from GOLD: a small amount of generated geometry breaks the oracle argument just as completely as a large amount. Ordered by line count.

| Set | Model | Parts | Lines | Lines/part | Blocks | Inline tris | Type |
|---|---|---:|---:|---:|---:|---:|---|
| `10261-1` | 10261 - main | 4,399 | 43,332 | 9.9 | 5 | 20,581 | PATH |
| `42056-1` | 42056 - main | 3,260 | 29,888 | 9.2 | 19 | 9,432 | PATH+SPRING |
| `42082-1` | 42082 - main | 5,479 | 27,856 | 5.1 | 5 | 7,306 | PATH |
| `10294-1` | 10294 - Titanic - main | 8,632 | 25,011 | 2.9 | 24 | 4,619 | PATH |
| `60216-1` | 60216 - main | 3,615 | 24,441 | 6.8 | 2 | 12,879 | PATH |
| `42055-1` | 42055 - main | 4,385 | 18,963 | 4.3 | 4 | 4,805 | PATH |
| `10297-1` | 10297 - main | 3,611 | 17,943 | 5.0 | 1 | 5,620 | PATH |
| `42100-1` | 42100 - main | 8,655 | 17,815 | 2.1 | 30 | 3,115 | PATH |
| `8110-1` | 8110 - Mercedes-Benz Unimog U 400 | 4,341 | 17,667 | 4.1 | 20 | 4,660 | PATH+SPRING |
| `42043-1` | 42043 - Mercedes-Benz Arocs 3245 | 7,187 | 16,841 | 2.3 | 30 | 2,667 | PATH+SPRING |
| `42131-1` | 42131 - main | 8,650 | 16,155 | 1.9 | 10 | 2,103 | PATH |
| `42042-1` | 42042 - Crawler Crane | 2,920 | 15,747 | 5.4 | 5 | 3,763 | PATH |
| `42125-1` | 42125 - main | 7,207 | 15,150 | 2.1 | 13 | 3,471 | PATH |
| `10243-1` | 10243 - Main model | 2,393 | 14,333 | 6.0 | 1 | 5,472 | PATH |
| `42129-1` | 42129 - main | 4,919 | 14,160 | 2.9 | 8 | 4,056 | PATH |
| `6286-1` | 6286 - main | 3,508 | 12,806 | 3.7 | 7 | 3,738 | PATH |
| `10315-1` | 10315 - main | 1,276 | 12,781 | 10.0 | 3 | 3,704 | PATH |
| `42077-1` | 42077 - main | 1,303 | 11,941 | 9.2 | 6 | 4,187 | PATH |
| `10226-1` | 10226 - main | 1,220 | 11,889 | 9.7 | 26 | 3,120 | PATH+SPRING |
| `8856-1` | 8856 - main | 1,460 | 11,821 | 8.1 | 11 | 3,091 | PATH |
| `6285-1` | 6285 - main | 3,626 | 11,345 | 3.1 | 5 | 2,828 | PATH |
| `8527-1_Tri-bot-Base` | 8527 - main | 1,287 | 10,483 | 8.1 | 6 | 2,845 | PATH |
| `42069-1` | 42069 - main | 3,257 | 10,442 | 3.2 | 5 | 2,614 | PATH+SPRING |
| `21318-1` | 21318 - main | 3,116 | 9,889 | 3.2 | 4 | 1,299 | PATH+SPRING |
| `10179-1` | 10179 - main | 4,545 | 9,811 | 2.2 | 4 | 886 | PATH |
| `42108-1` | 42108 - main | 3,759 | 9,705 | 2.6 | 2 | 813 | PATH |
| `42110-1` | 42110 - main | 3,829 | 9,589 | 2.5 | 4 | 1,620 | PATH |
| `10220-1` | 10220 - Main | 1,968 | 9,570 | 4.9 | 5 | 1,960 | PATH |
| `10252-1` | 10252 - main | 1,301 | 9,005 | 6.9 | 6 | 3,037 | PATH |
| `42076-1` | 42076 - main | 1,150 | 8,859 | 7.7 | 3 | 3,127 | PATH+SPRING |
| `8880-1` | 8880 - main | 1,366 | 8,742 | 6.4 | 3 | 2,234 | PATH+SPRING |
| `75144-1` | 75144 - main | 1,964 | 8,485 | 4.3 | 2 | 1,365 | PATH |
| `42053-1` | 42053 - main | 3,369 | 8,457 | 2.5 | 17 | 1,501 | PATH |
| `51515-1_Blast` | 51515 - main | 6,347 | 7,971 | 1.3 | 12 | 503 | PATH |
| `42078-1` | 42078 - Mack Anthem.mpd | 2,932 | 7,959 | 2.7 | 5 | 1,463 | PATH |
| `42099-1` | 42099 - main | 3,246 | 7,955 | 2.5 | 7 | 1,646 | PATH |
| `42114-1` | 42114 - main | 4,671 | 7,842 | 1.7 | 8 | 793 | PATH |
| `42075-1` | 42075 - main | 938 | 7,627 | 8.1 | 3 | 2,167 | PATH+SPRING |
| `10240-1` | 10240 - subModel-32 | 1,279 | 7,126 | 5.6 | 3 | 1,501 | SPRING |
| `8012-1` | 8012 - main | 4,490 | 7,008 | 1.6 | 12 | 745 | PATH |
| `42070-1` | 42070 - main | 3,189 | 7,002 | 2.2 | 11 | 1,497 | PATH |
| `21052-1` | 21052 - Dubai - main | 765 | 6,974 | 9.1 | 2 | 2,483 | PATH |
| `10278-1` | 10278 - main | 3,131 | 6,946 | 2.2 | 1 | 1,765 | PATH |
| `42050-1` | 42050 - Drag Racer | 1,130 | 6,907 | 6.1 | 13 | 2,116 | PATH |
| `42123-1` | 42123 - main | 3,344 | 6,499 | 1.9 | 4 | 1,025 | PATH |
| `17101-1_Frankie-the-Cat` | 17101-1 - main | 1,711 | 6,438 | 3.8 | 4 | 2,151 | PATH |
| `42124-1` | 42124 - main | 2,312 | 6,295 | 2.7 | 4 | 1,234 | PATH |
| `42113-1` | 42113 - main | 3,006 | 6,171 | 2.1 | 3 | 988 | PATH |
| `10264-1` | 10264 - main | 2,651 | 6,054 | 2.3 | 1 | 154 | PATH |
| `42066-1` | 42066 - main | 1,599 | 5,938 | 3.7 | 3 | 1,870 | PATH |
| `42068-1` | 42068 - main | 1,400 | 5,884 | 4.2 | 2 | 1,975 | PATH |
| `6991-1` | 6991 - Monorail Transport Base | 726 | 5,727 | 7.9 | 3 | 1,400 | PATH |
| `42095-1` | 42095 - main | 704 | 5,715 | 8.1 | 9 | 1,865 | PATH |
| `8285-1` | 8285 - main | 2,736 | 5,630 | 2.1 | 7 | 809 | PATH |
| `42064-1` | 42064 - main | 1,629 | 5,573 | 3.4 | 4 | 2,023 | PATH |
| `8868-1` | 8868-1 - Main | 3,319 | 5,524 | 1.7 | 27 | 749 | PATH |
| `42080-1` | 42080 - main | 2,716 | 5,472 | 2.0 | 17 | 664 | PATH |
| `8002-1` | 8002 - main | 3,734 | 5,289 | 1.4 | 18 | 247 | PATH |
| `75102-1` | 75102 - Poe's X-Wing Fighter - main | 940 | 5,209 | 5.5 | 1 | 2,385 | PATH |
| `8074-1_Crane` | 8074 - main | 859 | 5,078 | 5.9 | 13 | 1,138 | PATH |
| `42109-1` | 42109 - main | 1,475 | 4,875 | 3.3 | 4 | 1,091 | PATH |
| `76161-1` | 76161 - main | 2,383 | 4,836 | 2.0 | 1 | 205 | PATH |
| `4002020-1` | 4002020 - main | 1,057 | 4,690 | 4.4 | 1 | 732 | PATH |
| `42081-1` | 42081 - main | 1,748 | 4,540 | 2.6 | 2 | 759 | PATH |
| `42052-1` | 42052 - Heavy Lift Helicopter | 1,802 | 4,487 | 2.5 | 5 | 893 | PATH |
| `42079-1` | 42079 - main | 709 | 4,313 | 6.1 | 4 | 1,009 | PATH |
| `42112-1` | 42112 - main | 1,809 | 4,268 | 2.4 | 1 | 881 | PATH |
| `42120-1` | 42120 - main | 1,565 | 4,143 | 2.6 | 4 | 604 | PATH |
| `42093-1` | 42093 - main | 712 | 4,129 | 5.8 | 1 | 1,272 | PATH |
| `42092-1` | 42092 - main | 714 | 4,011 | 5.6 | 2 | 1,220 | PATH |
| `31313-1_Spike3r` | 31313 - main | 3,339 | 3,939 | 1.2 | 8 | 79 | PATH |
| `8001-1` | 8001 - main | 3,093 | 3,916 | 1.3 | 8 | 172 | PATH |
| `42057-1` | 42057 - main | 444 | 3,544 | 8.0 | 1 | 1,368 | PATH |
| `10269-1` | 10269 - main | 1,370 | 3,492 | 2.5 | 1 | 520 | PATH |
| `42045-1` | 42045 - Hydroplane Racer | 349 | 3,478 | 10.0 | 1 | 1,281 | PATH |
| `21307-1` | 21307 - main | 965 | 3,475 | 3.6 | 1 | 1,321 | PATH |
| `42107-1` | 42107 - main | 783 | 3,381 | 4.3 | 3 | 722 | PATH |
| `42065-1` | 42065 - main | 1,024 | 3,350 | 3.3 | 7 | 1,194 | PATH |
| `10175-1` | 10175-1 - main | 894 | 3,344 | 3.7 | 3 | 624 | PATH |
| `42121-1` | 42121 - main | 1,215 | 3,208 | 2.6 | 1 | 544 | PATH |
| `8049-1` | 8049 - Tractor with Log Loader | 1,888 | 3,142 | 1.7 | 7 | 0 | PATH |
| `8289-1` | 8289 - Main | 1,004 | 3,133 | 3.1 | 1 | 368 | PATH |
| `6980-1` | 6980 - Galaxy Commander - Main model | 483 | 3,103 | 6.4 | 1 | 792 | PATH |
| `10218-1` | 10218 - main | 2,034 | 2,959 | 1.5 | 1 | 176 | PATH |
| `8851-1` | 8851 - main | 1,328 | 2,921 | 2.2 | 16 | 350 | PATH |
| `5540-1` | 5540 - main | 912 | 2,919 | 3.2 | 8 | 1,323 | PATH |
| `10174-1` | 10174 - main | 1,329 | 2,911 | 2.2 | 5 | 192 | PATH |
| `42122-1` | 42122 - main | 1,312 | 2,884 | 2.2 | 1 | 376 | PATH |
| `75253-1` | 75253 - main | 1,057 | 2,845 | 2.7 | 4 | 399 | PATH |
| `5510-1` | 5510 - main | 1,699 | 2,716 | 1.6 | 1 | 255 | PATH |
| `45300-1_Milo-with-tilt-sensor` | 45300 - main | 578 | 2,680 | 4.6 | 5 | 611 | PATH |
| `42074-1` | 42074 - Racing Yacht.mpd | 534 | 2,610 | 4.9 | 1 | 810 | PATH |
| `42094-1` | 42094 - main | 1,490 | 2,591 | 1.7 | 3 | 248 | PATH |
| `10124-1` | 10124 - Main | 1,588 | 2,567 | 1.6 | 14 | 80 | PATH |
| `8081-1` | 8081 - Main | 624 | 2,500 | 4.0 | 1 | 400 | PATH |
| `42060-1` | 42060 - main | 594 | 2,491 | 4.2 | 1 | 971 | PATH |
| `42040-1` | 42040 - Fire Plane | 822 | 2,379 | 2.9 | 1 | 517 | PATH |
| `10214-1` | 10214 - main | 1,769 | 2,338 | 1.3 | 2 | 0 | PATH |
| `10271-1` | 10271 - main | 1,076 | 2,160 | 2.0 | 1 | 504 | PATH |
| `6208-1` | 6208 - B-Wing Fighter | 457 | 1,971 | 4.3 | 1 | 408 | PATH |
| `42106-1` | 42106 - main | 1,143 | 1,944 | 1.7 | 2 | 140 | PATH |
| `10230-1` | 10230 - main | 1,463 | 1,820 | 1.2 | 2 | 29 | PATH |
| `7347-1` | 7347 - Main | 839 | 1,773 | 2.1 | 1 | 0 | PATH |
| `8416-1` | 8416 - Main | 813 | 1,750 | 2.2 | 8 | 0 | PATH |
| `4404-1` | 4404 - Main | 763 | 1,642 | 2.2 | 4 | 80 | PATH |
| `6542-1` | 6542 - main | 1,096 | 1,641 | 1.5 | 1 | 0 | PATH |
| `8854-1` | 8854 - Main | 982 | 1,530 | 1.6 | 8 | 0 | PATH |
| `7722-1_Combination-with-7865` | 7722 - main | 708 | 1,387 | 2.0 | 1 | 173 | PATH |
| `5533-1` | 5533 - Main | 394 | 1,229 | 3.1 | 1 | 156 | PATH |
| `6085-1` | 6085 - main | 945 | 1,212 | 1.3 | 2 | 0 | PATH |
| `6080-1` | 6080 - main | 872 | 1,197 | 1.4 | 2 | 0 | PATH |
| `42035-1` | 42035 - Mining Truck | 542 | 1,109 | 2.0 | 1 | 220 | PATH |
| `42048-1` | 42048 - Race Kart | 481 | 1,054 | 2.2 | 1 | 195 | PATH |
| `7632-1` | 7632 - Main | 585 | 1,017 | 1.7 | 8 | 0 | PATH |
| `21003-1` | 21003 - Seattle Space Needle | 713 | 1,012 | 1.4 | 1 | 96 | PATH |
| `31049-1` | 31049 - Main | 523 | 961 | 1.8 | 3 | 0 | PATH |
| `42041-1` | 42041 - main | 663 | 864 | 1.3 | 1 | 0 | PATH |
| `6073-1` | 6073 - main | 593 | 800 | 1.3 | 1 | 0 | PATH |
| `8849-1` | 8849 - Main | 506 | 786 | 1.6 | 2 | 0 | PATH |
| `6074-1` | 6074 - main | 579 | 781 | 1.3 | 1 | 0 | PATH |
| `6389-1` | 6389 - main | 595 | 777 | 1.3 | 1 | 0 | PATH |
| `7823-1` | 7823 - main | 482 | 775 | 1.6 | 1 | 0 | PATH |
| `9476-1` | 9476 - The Orc Forge | 580 | 770 | 1.3 | 1 | 0 | PATH |
| `42032-1` | 42032 - Compact Tracked Loader | 259 | 681 | 2.6 | 1 | 97 | PATH |
| `8828-1` | 8828 - main | 190 | 681 | 3.6 | 2 | 48 | PATH |
| `854-1` | 854 - Main | 329 | 675 | 2.1 | 2 | 187 | PATH |
| `6931-1` | 6931 - main | 460 | 674 | 1.5 | 4 | 0 | PATH |
| `6571-1` | 6571 - main | 503 | 672 | 1.3 | 1 | 0 | PATH |
| `6061-1` | 6061 - main | 351 | 522 | 1.5 | 1 | 0 | PATH |
| `6378-1` | 6378 - main | 353 | 485 | 1.4 | 1 | 0 | PATH |
| `3180-1` | 3180 - main | 276 | 473 | 1.7 | 1 | 0 | PATH |
| `8202-1` | 8202 - Bungee Chopper | 358 | 448 | 1.3 | 1 | 0 | PATH |
| `31037-1` | 31037 - Jeep | 337 | 435 | 1.3 | 1 | 0 | PATH |
| `6562-1` | 6562 - main | 285 | 410 | 1.4 | 1 | 0 | PATH |
| `1972-1` | 1972 - main | 222 | 369 | 1.7 | 2 | 0 | PATH |
| `744-1_Factory` | 744-1 - main | 229 | 332 | 1.4 | 1 | 0 | PATH |
| `6825-1` | 6825 - main | 161 | 315 | 2.0 | 2 | 0 | PATH |
| `6049-1` | 6049 - main | 190 | 310 | 1.6 | 1 | 0 | PATH |
| `4015-1` | 4015 - main | 190 | 304 | 1.6 | 1 | 0 | PATH |
| `8259-1` | 8259 - Mini Bulldozer | 145 | 278 | 1.9 | 2 | 0 | PATH |
| `8270-1` | 8270 - Main | 115 | 278 | 2.4 | 2 | 0 | PATH |
| `7813-1` | 7813 - main | 179 | 275 | 1.5 | 1 | 0 | PATH |
| `6480-1` | 6480 - main | 169 | 271 | 1.6 | 1 | 0 | PATH |
| `6657-1` | 6657 - Fire Patrol Copter | 171 | 268 | 1.6 | 2 | 0 | PATH |
| `6531-1` | 6531 - Helicopter | 175 | 267 | 1.5 | 2 | 0 | PATH |
| `6667-1` | 6667 - main | 148 | 246 | 1.7 | 1 | 0 | PATH |
| `7816-1` | 7816 - main | 144 | 235 | 1.6 | 1 | 0 | PATH |
| `6645-1` | 6645 - main | 131 | 233 | 1.8 | 1 | 0 | PATH |
| `6799-1_Carriage` | 6799 - Main model | 88 | 215 | 2.4 | 3 | 0 | PATH |
| `6650-1` | 6650 - Fire and Rescue Van | 53 | 118 | 2.2 | 1 | 0 | PATH |

---

## 7. How this was produced

Scanned every `.mpd` and `.ldr` in the corpus for `!LDCAD GENERATED`, counting blocks, type-1 placements, type-3/4 polygon lines, and extracting the configuration type from LDCad's own fallback comment. Reproducible against `.cache/omr`; no model content is reproduced here beyond identifiers and counts.
