# Short Tea Museum visits

Changes prepared from the previous publication, `1630fed249450f4f18bb983a1df3b5a668583e66`.

## Design

- Each visit contains three randomly selected exhibits, with a natural stopping point after the third.
- “Explore 3 more displays” draws only from unseen exhibits. All twelve appear over four visits without repeats.
- Review preserves the current visit's answers, hints and option order. A collapsed restored collection keeps all earlier corrections and their sources available without forcing a long gallery into the summary.
- “Browse all 12 corrected labels” remains available at every stage. The complete no-JavaScript reading fallback is unchanged.
- A full restart is offered only after exhausting the collection, clearly labelled as clearing choices. Progress remains page-local: no storage, telemetry or network calls were added.
- English, Traditional Chinese (Hong Kong) and Simplified Chinese interface copy, descriptions and entry links reflect the shorter visits. Historical content, illustrations, explanations and source links are unchanged.

## Verification

Run:

```sh
quarto render
node reviews/test_museum_dom.cjs
python reviews/test_museum_render.py
node reviews/test_time_machine.cjs
node reviews/test_tea_table_dom.cjs
node reviews/test_study_detective.cjs
node reviews/test_decision_game_dom.cjs
git diff --check
```

The museum DOM suite covers every answer path for every exhibit in all three locales, randomized three-display visits, no repeats before exhaustion, cumulative collection history, review, hints, repeated/stale controls, reset, shorter final visits for other collection sizes, missing-data/no-JavaScript fallback and accessible figure contracts. Actual browser interaction remains a separate check.

### Results

Passed the full 108-page Quarto render, museum DOM suite, museum rendered-page/source-anchor/fallback checks, Time Machine source/render tests, Tea Table DOM suite, Study Detective DOM suite, Decision Game DOM suite and `git diff --check`.

Managed Chromium checks passed for keyboard Enter/Space, hints, choosing/revealing an answer, all four random visits (12 unique exhibits), the short summary, keyboard expansion of the cumulative collection, and completion in all three languages. At 375px and 320px frame widths, the pages had no horizontal overflow and all visible game buttons were at least 53px high. Actual screenshots showed readable stacked cards. Focused display/summary headings scroll below the fixed navigation bar. Extension-only metadata errors were present in browser logs; no app error was observed. Screen-reader speech output was not tested.

An independent code/content review found no substantive bugs or lost source content. It prompted more precise page-local progress wording for Back/Forward cache behavior.
