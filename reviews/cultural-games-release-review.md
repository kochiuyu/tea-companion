# Tea history and culture games: release review

Reviewed 5 November 2026. Baseline: `82ac3785b2b5e24d764dd571fbb7aabc8cf87c61`.

## Scope

Two additive games in English, Hong Kong Traditional Chinese and Simplified Chinese:

- **Tea Time Machine**: eight sourced historical moments and ten earlier/later comparisons across two five-stop trips. Hints, story reveal, retry, previous, review, chronological summary and restart. It distinguishes an event date from the origin of a tradition and chronology from causation.
- **Set the Tea Table**: choose tools, serving rhythm and social focus for three situated portraits from the existing regional-scripts lesson. Original SVG illustrations respond to the choices. Feedback describes each specific portrait rather than assigning authenticity or judging an entire culture.

Twelve existing pages receive bounded additions: six lesson pages, three homepages and three Chapter 3 pages. Six new local game assets and six validation scripts are included. Original text, references, earlier games, global settings and deployment workflow are preserved. Neither game makes network requests, stores answers or uses accounts, scoring or timers.

## Completed local verification

- Quarto 1.11.9 renders all 105 pages successfully.
- `test_cultural_games_integration.py` verifies all 256 original tracked files are preserved; the twelve changed originals contain only additive content. Mounts, anchors, navigation and exact rendered asset bytes pass in all three languages.
- `test_pilot_preservation.py --site _site` verifies the pre-existing text, headings, citations, includes and 14,265 local links/assets.
- Time Machine DOM tests cover all three locales, ten unique comparisons, historical date invariants, hints, both answer paths, reveal, retry, previous, review, summary, restart, stale clicks, focus contracts and fallback. Generated story fallbacks exactly match the data.
- Tea Table DOM tests cover 243 arrangements, incomplete-choice gating, mismatches, feedback invalidation, examples, retained choices, previous/next, reset, restart, stale clicks, missing data and duplicate initialization.
- Existing decision, study-detective, compare and label-game regression suites pass. JavaScript syntax and whitespace checks pass.

## Real-browser verification

- Complete game flows in each of the six game/locale combinations, using native buttons and keyboard Enter/Space. Time Machine covers all ten comparisons in both five-stop trips; Tea Table covers all options, three scenes and summary.
- Eighteen layout checks: both games in each locale at 320, 390 and 1185-pixel frame widths. No horizontal overflow. Minimum observed visible button heights: 49.6 pixels for Time Machine and 47.2 pixels for Tea Table. Desktop and narrow-screen screenshots were inspected.
- With iframe scripts blocked, all six fallback versions remain readable, including eight Time Machine stories and the three Tea Table portraits and source links.
- English homepage game entry and browser Back/Forward navigation pass.

These responsive frames exercise real browser CSS layout, but are not physical-phone or touch-device testing. No physical-device, screen-reader, browser-zoom, forced-colors or cross-browser audit is claimed. Source/render/DOM tests complement rather than replace those audits.

## Reproduce

Run a complete `quarto render`, then the six new validation scripts under `reviews/` (`sync_time_machine_fallbacks.cjs` with `--check`), the existing preservation and game regression scripts, and the browser flows above. The deployment should be checked separately against the merged commit, with served asset hashes and live game interactions.
