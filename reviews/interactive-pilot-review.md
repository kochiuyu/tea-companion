# Interactive Tea Companion pilot

Release validation, 5 November 2026. Two tap-first learning activities for complete beginners, in English, Hong Kong Traditional Chinese and Simplified Chinese.

- Repository: https://github.com/kochiuyu/tea-companion
- Baseline: `cb9ac23fd4a32c99c27e2bde4a270a79d60c4c6e`
- Local branch: `pilot/two-cup-label-lab`

## What to try

Use the new homepage links in English, Hong Kong Traditional Chinese or Simplified Chinese.

1. **Two teas. One guess.** Ten entirely on-screen comparisons in two optional sets of five. The first set covers green/black oxidation, matcha/sencha preparation, houjicha/genmaicha, jasmine green/pure chamomile, and ordinary black/ripe Pu-erh. The second set adds Earl Grey/Orange Pekoe, Gyokuro/Genmaicha, white/black handling, Sencha/Longjing, and Assam/English Breakfast. See two named teas, an everyday-language question and a neutral contextual clue. Tap a guess, then read the answer, explanation, practical takeaway, caveat and source links. Specialist words appear only after the guess, with plain definitions. “Not sure? Show me” is always available. After the first five, a complete five-clue summary lets the reader stop or choose “Try five more.” The final screen gathers all ten clues. Returning from the first question of set two reopens the five-clue checkpoint without losing answers. No brewing, timers, equipment or typing.
2. **Tea-label detective.** Read one word on a fictional packet, use its short contextual hint, and choose from three everyday-language meanings. “Not sure? Show me” reveals the explanation without grading uncertainty. “The label does not tell us enough” is a separate substantive answer. Seven labels and 17 clue appearances cover where tea was grown, how it was made, what was added, tea kinds, leaf-piece size, stated ranks and drink preparation. Both accepted readings remain available for Yunnan and milk tea. Feedback includes what the word still does not tell you and a link to the relevant guide section. Previous choices and neutral reveals survive navigation; retry clears only the current word.

The existing physical two-cup exercise remains below the new game as part of the original brewing lesson. All original lessons, technical material, citations and anchors are retained. The legacy `#two-cup-lab` launch anchor now opens the guessing game, keeping pilot links stable. This work is not a fresh scientific fact-check of all older material.

## Design and behavior

- Shared plain JavaScript and scoped CSS, with no account, storage, analytics, framework or external request from either activity.
- Native buttons, labeled question groups with accessible clue descriptions, visible keyboard focus and feedback announcements. Controls have at least 44 px touch targets.
- One guess per round; repeated taps do not alter the first result. Previous revisits preserve answers. Restart resets the game. No score or health/taste prediction.
- Sources stay within the chosen language tree and link to existing lessons. Caveats distinguish processing categories from caffeine rankings and recognize blend variation.
- Readable fallback content remains in the original HTML if JavaScript enhancement fails.
- The detective shows label/word progress, names navigation between labels, and keeps extended limitations in an expandable disclosure. Its three choices stay in a single wrapped column. New source anchors are additive; the original headings are unchanged.

## Verification

- Full official Quarto 1.11.9 render: 105 configured pages.
- Preservation against the immutable baseline: all 210 source pages/includes, 11,883 nonblank original lines, 645 headings and 608 citation definitions retained.
- Rendered links, anchors, duplicate IDs, control targets and byte-exact component assets checked by `test_pilot_preservation.py`.
- Dependency-free game tests cover all ten rounds × three languages × correct/wrong/not-sure outcomes (90 cases), repeat guards, previous-answer retention, five-takeaway checkpoint, optional continuation, ten-takeaway final summary, both restart paths, duplicate initialization, deferred initialization and enhancement failure. Every generated source link resolves to a source page in the correct language. Checks also ensure questions/titles/clues have no specialist terms and no clue names an answer option.
- Detective state tests cover all 153 rendered classification/feedback combinations and all 51 neutral reveal paths across three languages, plus accepted alternatives, retained reveal/choice state, retry, focus, source anchors, initialization and fallback.
- Latest combined ten-question and beginner-detective revision: real-browser/mobile verification is blocked by browser connection timeouts. DOM, source and full-render checks pass. Earlier real-browser checks covered previous revisions and are not treated as verification of the current UI.
- Portable Playwright browser suite is updated and syntax-checked. It was not launched end-to-end in the restricted executor; the real cloud-browser checks were performed separately.

## Remaining review

Physical mobile devices, Safari/Firefox and an actual screen reader are not tested. The latest browser/mobile checks remain outstanding. A static review caught and fixed a low-contrast hover state on secondary comparison-game buttons before release.

## Reproduce

From the repository root:

```sh
quarto render
python reviews/test_pilot_preservation.py
node reviews/test_pilot_compare_dom.cjs
node reviews/test_pilot_detective_dom.cjs
```

The source checker accepts `--source-only` or `--site PATH`. Logic tests use a small mocked DOM and do not replace browser testing. With Node, Playwright and Chromium available, run `node reviews/test_pilot_browser.cjs` for the portable browser suite. It serves `_site` locally; `BASE_URL` can select an existing server.

## Changed surface

Only additive inserts in the three homepages, three brewing lessons and three label guides; shared component assets and Quarto includes; and new validation notes/tests. Existing lessons and non-pilot review files are unchanged.
