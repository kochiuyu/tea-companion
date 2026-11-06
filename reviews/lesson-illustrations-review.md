# Reading-page illustrations review

Base: `28d00d57d0fd3e38d540ac60ba231d26b894e3ab` (shorter museum release preserved for this publication).

## What changed

- 35 reading pages in each language, 105 placements total, across the home page, practical tea guides and all five chapters.
- Eleven game/museum illustrations reused for corresponding subjects: plant, label, capsule/cup, clock, ship, notice, description/cup, balloon task, visibly different cups, bowl/whisk, and milk-tea filter.
- Nine new original SVGs in the established sage/cream/clay style: processing workshop motifs, brewing controls, a person/observation notebook/clock, warmth/preparation/expectation cues, stress observations, warmth comparison notes, quick response/checking, social-game rules, and reference reading.
- Localized captions and image alternatives in English, Hong Kong Traditional Chinese and Simplified Chinese.
- Reading figures are static SVG images: no extra runtime script, animation, remote assets or new dependency. Twenty static SVG files; the Detective additionally renders fifteen neutral package variants. Explicit dimensions reserve layout space and lazy loading avoids loading below-fold images too early.
- Wide layouts place text beside art; narrow layouts stack them. Caption contrast is approximately 7.79:1. Print and forced-color styles are included.
- All original text, detailed foldouts, claims, citations, sources and game logic remain unchanged. The shared art renderer has one additive neutral package branch, and the Detective passes its stable label identity to that branch. Historical illustrations explicitly remain schematic; body illustrations show no measured or promised effect. The two visibly different cups are described as an unmatched comparison, not proper matched controls.

## Rebuild

1. `node reviews/sync_lesson_illustrations.cjs` regenerates the SVG files and marked QMD blocks from `data/lesson-illustrations.json`.
2. `node reviews/sync_lesson_illustrations.cjs --check` verifies reproducibility without changing files.
3. `quarto render` builds all 108 pages.
4. `python reviews/test_lesson_illustrations.py` checks source preservation and the rendered figures.
5. `python reviews/build_lesson_illustration_preview.py` creates a local full-site review folder, with `illustration-review.html` in all three languages. It does not upload or deploy anything.

## Verified

- Full Quarto render: all 108 pages completed.
- All 213 original tracked QMD files are byte-identical to the base after removing only the newly added marked figure blocks.
- 23 original assets/styles are unchanged. Narrow reverse-patch checks verify the only changes to the two Detective-related assets are the new art branch/API and its single call site. Existing config differs only by the static SVG resource and CSS entries.
- All 105 rendered figures have the expected localized caption/alt, valid relative image path and explicit dimensions. All 20 SVGs are well-formed, copied byte-for-byte to the rendered site, and contain no script, text, links, external images or event handlers.
- Existing comparison, label-detective, label-tap, decision, study-detective, Tea Table and Museum DOM suites pass. Time Machine passes through the new compatibility wrapper, which strips only the new illustration blocks in memory for its older preservation assertion.
- All nine new illustrations rasterized with sharp and visually inspected. This checks the artwork pixels, not browser layout.
- Independent source/caption review found no blocking accuracy issue. Its minor brewing-alt wording suggestion was applied before the final render.

## Expanded browser verification and private preview

The official managed Sites preview was used for browser QA. Direct Chromium launch remains restricted by `process_singleton_posix.cc:297: socket() failed: Operation not permitted (1)`; no further retries were needed.

- **264 reading-layout cases passed:** all 105 localized pages at 320px with scripts disabled, all 105 at 1280px with scripts enabled, and nine original-art topics in all three languages at 390px and 768px.
- **135 Detective cases passed:** all 15 packages in all three languages at 320, 390 and 1280px. Each stays stable across clue changes, reveal and retry, while the scenario artwork remains distinct and answer-neutral. Game and figure bounds, decorative SVG accessibility, visible localized captions and retry focus passed.
- **39 review links passed:** twelve illustrated lesson cards and the Detective link in each language lead to valid targets. JS-off Detective fallbacks passed in all three languages.
- Actual keyboard selection, reveal and retry passed in English, Traditional Chinese and Simplified Chinese. Desktop Detective and phone-width Traditional Chinese warmth artwork were visually inspected.
- Gallery review caught an inline-SVG/live-preview parsing problem. The review gallery now uses static SVG image files; all twelve cards and links were retested. The actual game's JavaScript-rendered SVGs worked throughout.
- Source/caption review found no blocking accuracy issue. Every original sourced passage remains intact.
- No physical-phone, screen-reader, non-Chromium, print-output or forced-color browser testing was performed. Print and forced-color CSS exist but were not visually verified.

## Publication scope

This release adds reading-page illustrations and varied Tea-label Detective packaging. All museum pages, museum artwork and museum behavior are unchanged.

Browser tests used the full rendered site through a local managed preview. All 170 rendered output files matched the reviewed preview artifact byte for byte. The test-only review galleries and QA harness pages are not included in the live website.

Legacy feature tests whose filename allowlists freeze earlier feature baselines are not used as the additive-source preservation oracle. The comprehensive baseline audit and existing game DOM regression suites pass, with the Time Machine wrapper stripping only new figure blocks for its historical assertion.
