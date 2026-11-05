# Interactive Tea Companion pilot

Release validation, 5 November 2026. The seven-label detective is expanded to fifteen labels and short random rounds. Both activities remain in English, Hong Kong Traditional Chinese and Simplified Chinese.

- Repository: https://github.com/kochiuyu/tea-companion
- Change baseline: `a08bb3fef35023336035eeb1d4c44f94d62559c2` (published pilot).
- Original-material preservation baseline: `cb9ac23fd4a32c99c27e2bde4a270a79d60c4c6e`.
- Release branch: `pilot/random-label-rounds`

## What to try

Use the new homepage links in English, Hong Kong Traditional Chinese or Simplified Chinese.

1. **Two teas. One guess.** Ten entirely on-screen comparisons in two optional sets of five. The first set covers green/black oxidation, matcha/sencha preparation, houjicha/genmaicha, jasmine green/pure chamomile, and ordinary black/ripe Pu-erh. The second set adds Earl Grey/Orange Pekoe, Gyokuro/Genmaicha, white/black handling, Sencha/Longjing, and Assam/English Breakfast. See two named teas, an everyday-language question and a neutral contextual clue. Tap a guess, then read the answer, explanation, practical takeaway, caveat and source links. Specialist words appear only after the guess, with plain definitions. “Not sure? Show me” is always available. After the first five, a complete five-clue summary lets the reader stop or choose “Try five more.” The final screen gathers all ten clues. Returning from the first question of set two reopens the five-clue checkpoint without losing answers. No brewing, timers, equipment or typing.
2. **Tea-label detective.** Five randomly chosen labels, with one featured clue per label. Tap one of three everyday-language meanings or use the ungraded “Not sure? Show me” reveal. After five, a summary provides a natural stopping point. “Try five more” deals unused labels; no label repeats until all fifteen have been used, then “Start a new mix” explicitly reshuffles. A remaining batch shorter than five is handled without repeating labels.

The specific-label picker pauses the round and opens a separate explorer. All fifteen labels and all thirty-three clues can be explored there, including every original clue, explanation and limitation. Returning restores the same round question or summary. The new labels cover jasmine-scented green tea, Houjicha, Genmaicha, Tieguanyin, ripe Pu-erh, Ceylon, Sencha and English Breakfast. One featured clue keeps each round short; other words remain optional.

The existing physical two-cup exercise remains below the new game as part of the original brewing lesson. All original lessons, technical material, citations and anchors are retained. The legacy `#two-cup-lab` launch anchor now opens the guessing game, keeping pilot links stable. This work is not a fresh scientific fact-check of all older material.

## Design and behavior

- Shared plain JavaScript and scoped CSS, with no account, storage, analytics, framework or external request from either activity.
- Native buttons, labeled question groups with accessible clue descriptions, visible keyboard focus and feedback announcements. Controls have at least 44 px touch targets.
- The comparison game keeps the first guess for each question and preserves it on previous revisits. The detective allows trying another meaning or clearing a clue. Neither activity scores the reader or predicts health, taste or mood.
- Sources stay within the chosen language tree and link to existing lessons. Caveats distinguish processing categories from caffeine rankings and recognize blend variation.
- Readable fallback content remains in the original HTML if JavaScript enhancement fails.
- The detective shows round/label progress and a disabled-next explanation before a guess or reveal. The optional explorer shows label/word progress. Native controls, focus management and feedback announcements remain. The three choices wrap in one column. The label pool is shuffled without replacement and does not require an account or persistent storage. Existing source anchors are unchanged.

## Verification

- Full official Quarto 1.11.9 render: 105 configured pages.
- Preservation against the immutable baseline: all 210 source pages/includes, 11,883 nonblank original lines, 645 headings and 608 citation definitions retained.
- Rendered links, anchors, duplicate IDs, control targets and byte-exact component assets checked by `test_pilot_preservation.py`.
- Dependency-free game tests cover all ten rounds × three languages × correct/wrong/not-sure outcomes (90 cases), repeat guards, previous-answer retention, five-takeaway checkpoint, optional continuation, ten-takeaway final summary, both restart paths, duplicate initialization, deferred initialization and enhancement failure. Every generated source link resolves to a source page in the correct language. Checks also ensure questions/titles/clues have no specialist terms and no clue names an answer option.
- Detective state tests cover 297 classification/feedback cases and 99 neutral reveals across three languages. They also cover complete fifteen-label cycles, fixed and seeded random generators, thirteen-label and three-label short-pool fixtures, no-repeat draws, first/last navigation, summaries, explicit reshuffle, stale double clicks, independent explorer state, exact return to a review question or summary, retry, focus, localized source anchors, duplicate/deferred initialization and failure fallback. All original seventeen clue mappings remain tested.
- Latest fifteen-label detective revision: real-browser/mobile verification is blocked by browser connection timeouts. DOM, source and full-render checks pass. Earlier real-browser checks covered previous revisions and are not treated as verification of the current UI.
- Portable Playwright browser suite is updated and syntax-checked. It was not launched end-to-end in the restricted executor. Historical real-browser checks cover earlier pilot revisions only.

## Remaining review

Physical mobile devices, Safari/Firefox and an actual screen reader are not tested. The latest browser/mobile checks remain outstanding. Independent source review found no blocker and confirmed unchanged original labels, coherent translations, scoped responsive CSS and retained scientific caveats. These checks do not establish actual visual or screen-reader behavior.

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

This revision changes only the detective JavaScript/CSS and its validation notes/tests. The published comparison game, lesson text, citations, anchors, homepages and Quarto configuration are unchanged.
