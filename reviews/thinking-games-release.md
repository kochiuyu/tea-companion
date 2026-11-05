# Decision and study games

Additive games for English, Traditional Chinese (Hong Kong), and Simplified Chinese, linked from each home page.

- The decision game presents three fictional token splits, shows accept/reject outcomes, and explains how changing the offer or rejection rule changes the task. Choices are not scored or treated as personality evidence.
- The study detective presents eight explicitly fictional studies in two shuffled four-case rounds, with independent exploration, neutral reveals, explanations and links to the existing lessons.
- Both use native buttons and scoped styles, provide no-JavaScript explanations, and make no network, analytics or storage calls.
- Existing lessons, citations, games, configuration and render list are preserved.

## Verification before release

Full Quarto render: 105 pages. Preservation checks retained all 210 original QMD sources/includes, 645 headings and 608 citations from the original content baseline. All 244 tracked files from main `ed498b26758c320135a7ae43c4b69dd33eee268b` remain present; the nine changed original pages contain additions only. Static checking passed 14,229 internal links and asset references.

Decision tests cover 27 localized outcomes and 81 summaries. Study tests cover 72 choices, 24 reveals/retries, shuffle/deck boundaries, independent exploration, state retention, navigation, reset and initialization failures. The existing guessing-game and label-detective regressions pass unchanged. Static fallbacks match the study data. JavaScript syntax and patch whitespace checks pass.

These are mock-DOM and static checks, not a real-browser accessibility or visual audit. Browser preview was unavailable before release, so mobile layout, actual keyboard behavior, forced-colors behavior and screenshots were not verified. Real-browser regression scripts are included for a supported browser environment.

## Reproduce

```sh
quarto render
python reviews/test_pilot_preservation.py --site _site
python reviews/test_game_integration.py
node reviews/test_decision_game_dom.cjs
node reviews/test_study_detective.cjs
node reviews/sync_study_fallbacks.cjs --check
node reviews/test_pilot_compare_dom.cjs
node reviews/test_pilot_detective_dom.cjs
```

With Playwright and a working Chromium installation, run `node reviews/test_decision_game_browser.cjs` and `node reviews/test_study_detective_browser.cjs`. `CHROMIUM_EXECUTABLE` may select an installed Chromium.
