# Combined illustrated release

This release combines three approved additive features against PR #49:

- Twelve history scenes in 36 localized placements across the five Chapter 3 pages.
- Twenty-eight illustrated tea-name entries, including five origin locator designs in three languages. Maps use Natural Earth physical land, approximate dots and no political borders.
- Two classification and grade-language guides: 14 illustrations and 42 localized cards.

English, Hong Kong Traditional Chinese and Simplified Chinese are supported throughout. Original prose, tables, headings, citations and game assets are unchanged. The artwork is representative rather than diagnostic. Names, processing, geographical origin and grade-language roles remain distinct; black tea is 紅茶/红茶, dark tea is 黑茶. Original statements are preserved rather than silently rewritten.

## Verification

Run from the repository root:

1. `python reviews/sync_history_illustrations.py --check`
2. `python reviews/sync_classification_illustrations.py --check`
3. `quarto render`
4. `python reviews/test_combined_illustrations.py`
5. `python reviews/test_tea_origin_maps.py`
6. `node reviews/test_time_machine_with_history_figures.cjs`

The combined preservation test strips only the three expressly marked feature-block families and requires all 213 prior QMDs to reproduce baseline `9a2cba35fb4173270dd02948bb60c006a7a76556` exactly. All 107 other preexisting files remain unchanged; only the six resource/stylesheet entries are excepted. It checks all 162 localized figure placements, all 64 new feature SVG files, original tables, sources, safe XML, duplicate IDs and the full 108-page build.

The existing comparison, label detective/tap, decision, study, Tea Table and Museum state suites also apply. Browser verification covers the final combined pages across all three languages and narrow/wide viewports; state tests are not a substitute for real-browser checks.

Map data provenance and licensing: `data/map-data/README.md`. Preview-only gallery pages, QA harnesses, screenshots, deployment metadata and generated `_site` output are intentionally not part of the public source change.

Final combined QA passed: 72 real-browser layout cases across 18 affected pages (320, 390 and 1280 pixels, plus JavaScript-disabled 320-pixel cases), with every figure image and caption available and no document/card/caption overflow. Keyboard gallery toggles, Detective reveal/retry and Time Machine start/hint/reveal/retry passed in all three languages, including restored focus. Desktop classification and mobile type/grade layouts were visually inspected.

An independent comparison to the approved preview confirmed exact retained text, headings, tables, citations and script tags on all 108 pages, all 64 feature SVGs unchanged, all 267 existing/new image placements and local links resolved, and all 790 search targets retained. Classification wrappers are normalized by the fresh Quarto render; their content and responsive appearance are preserved.
