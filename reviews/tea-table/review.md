# Set the Tea Table review

Base: main `82ac378` (Merge pull request #44: Add decision and study games).

## Scope

Adds the same game to the existing regional-scripts lesson in English, Hong Kong Traditional Chinese, and Simplified Chinese. The original lesson text and all source footnotes remain byte-for-byte unchanged when the bounded addition is removed. The release also adds direct links from each localized homepage and Chapter 3 page; global settings are unchanged.

Three situated examples are drawn from the existing lesson: an everyday Chaoshan table, a Hong Kong milk-tea counter, and a Taiwan tea-art gathering. Each asks for tools, serving rhythm, and social focus. All 27 arrangements per scene can be explored. Feedback compares the selection with that particular source portrait rather than judging a culture, a person, or authenticity. There are no scores, time limits, persistent storage, requests, or telemetry.

The SVG table is original vector artwork. Symbols summarize tools, rhythm, and social focus; drawings are simplified rather than historical reconstructions. No generated images or external assets are used.

## Navigation contract

- Mount: `[data-tea-table]`, `data-locale`.
- Root: `.tea-table-game`; successful initialization adds `data-mounted="true"` to the host.
- Scene: `.tea-table-stage[data-scene="0"|"1"|"2"][data-mode="play"|"summary"]`.
- Options: `[data-action="choose-GROUP-CHOICE"]`, each zero-based 0–2.
- Actions: check, example, reset, previous, next, restart.
- Game anchor: `#set-the-tea-table`.
- Lesson anchor: `#tea-table-reading`.
- Notes anchor: `#tea-table-notes`.

Homepage labels: Set the Tea Table / 擺好茶席 / 摆好茶席.

## Completed checks

- Both JavaScript files pass `node --check`.
- `node reviews/test_tea_table_dom.cjs`: 243 combinations across all three scenes and locales, including mismatches, all-match examples, disabled incomplete checks, review invalidation after a change, retained prior choices, repeated/stale Next clicks, summary, Previous, reset, restart, duplicate initialization, and missing-data static fallback.
- DOM model checks button grouping, pressed state, visible explanations, source links, polite status, and focus retention/movement. These checks are not a real screen-reader audit.
- All three modified pages render with official Quarto 1.11.9, with XDG_CACHE_HOME set to a writable directory.
- `python reviews/test_tea_table_source.py`: original text preservation, rendered unique anchors, and exact asset copies pass in all three languages.
- Existing decision-game and study-detective DOM checks pass.
- `git diff --check` passes.

## Integrated browser checks

All three locales pass real-browser selection, keyboard Enter/Space, explanation invalidation, example, reset, previous/next, summary and restart checks. At 320, 390 and 1185-pixel frame widths, no horizontal overflow was observed and all visible game buttons were at least 44 pixels high. The script-blocked fallback remains readable in all three locales.

See `../cultural-games-release-review.md` for integrated verification and test limitations. No physical-device or screen-reader audit is claimed.
