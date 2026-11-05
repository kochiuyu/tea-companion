# Illustrated games review

Base: `81b8fc1ba8e83d821e13c5754242f36d63b05663`.

## Changes

- Tea Time Machine: schematic event objects on both comparison cards, the opening screen, the story browser and trip summaries. Mystery dates remain hidden until an answer or reveal.
- Which cup?: identical neutral cup drawings in both answer buttons; no visual answer cue.
- Tea Label Detective: a neutral printed label and magnifier, without category clues.
- Decision game: neutral people with individually countable tokens matching each displayed offer. A higher-specificity forced-colors selected outline fixes a collision with the site theme.
- Study Detective: eight distinct setup diagrams, limited to concepts already in the fictional cases (cups, labels, routine, capsule, people, clock, balloon task and combined ingredients).
- Shared original SVG artwork uses Tea Table's sage, cream and clay palette. Visible captions are localized in English, Traditional Chinese and Simplified Chinese. Redundant SVGs are hidden from assistive technology and cannot receive keyboard focus. Existing adjacent text supplies the cup and token equivalents.
- Set the Tea Table is unchanged. All 215 original QMD lesson/include files and the checked history/study/Table data and Table artwork files are byte-identical to the base archive. Game mechanics, source URLs, claims and original translations are preserved.

## Preview

Run `python reviews/build_figure_preview.py`, then open `reviews/game-figures-preview.html` in a browser. It is self-contained, includes all six games and has a game-language selector. Review-shell headings remain English. It is not included in Quarto's publication list.

For the complete website, run `quarto preview`.

## Validation

- Full `quarto render`: 105 pages completed. Installed Quarto emits existing zh-Hant-HK translation/Abstract warnings; the authored Chinese content is preserved.
- `reviews/test_game_figures_browser.cjs`: passed against both the standalone preview and the rendered site in real Chrome 156 on Windows. Covers all eight historical events, all eight study illustrations, date concealment/reveal/retry, keyboard Enter, neutral comparison images, token counts, text equivalents and 320/390/1200px game layouts in all three locales.
- `reviews/test_study_detective_browser.cjs`: passed, including 72 choices, keyboard, navigation, retention, no-JS cases, responsive layouts, reduced motion and forced colors.
- `reviews/test_decision_game_browser.cjs`: passed, including 27 outcomes, keyboard, summaries, restart/reload, 44px targets, forced colors and no-JS examples. The harness now serves an empty favicon and excludes the explicitly identified Quarto tabset preference from its no-game-storage assertion.
- `reviews/test_pilot_browser.cjs`: all comparison and label gameplay, keyboard, source, layout and no-JS checks completed in all three locales. The overall legacy harness reported failure solely for an automatic `/favicon.ico` 404 from its local server, not a game error. This suite has not been represented as an unqualified pass.
- Existing compare, label-tap, decision, study and Table DOM suites passed. The Time Machine mechanics portion passed; its historical `git show` portion could not run because Git is unavailable in this environment. Direct byte comparison against the downloaded base archive independently verified preservation.

No physical-phone, screen-reader or non-Chromium browser testing was performed. No merge or production deployment was performed.
