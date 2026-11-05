# Tea Time Machine implementation review

Base: `82ac3785b2b5e24d764dd571fbb7aabc8cf87c61` (public main, 5 November 2026).

## Scope

- Eight historical moments, ten distinct earlier/later comparisons, shuffled without repetition across two five-stop trips.
- English, Hong Kong Traditional Chinese and Simplified Chinese. UI, hints, stories, feedback, navigation and fallback are translated.
- Hints, direct reveal, previous/retry, review, another five comparisons and fresh shuffle. No score, timer, storage, accounts or network calls.
- Keyboard-native buttons, visible focus, focus management between stops, polite response announcements, labelled controls, minimum 44px buttons and narrow-screen stacking.
- Full story/source fallback generated from the same data as the interactive UI. The existing lesson remains byte-for-byte unchanged outside a marked inserted block.
- Added to each language's `modules/module-03/01-trade-history.qmd`, at `#tea-time-machine`. `#tea-time-reading` returns to the original reading content. Each localized homepage and Chapter 3 page links directly to the game.

## Historical source audit, 5 November 2026

Only the named event is dated. Chronology is not presented as proof of causation, and these selected signposts are not a comprehensive world history.

1. **Lu Yu, c. 760–780**: [Marc Jason Gilbert, Education About Asia, Chinese Tea in World History](https://www.educationaboutasia.org/article/id/861/print/) gives 760–780. Other sources assign different specific years, so the game displays an approximate range, not an invented exact year. All compared events are outside that range.
2. **Eisai's return, 1191**: [Five College Center for East Asian Studies](https://www.fivecolleges.edu/community/center-east-asian-studies/japanese-tea-ceremony/history-tea) supports the journey and tea seeds. Gilbert's article supports the earlier exchanges with Japan. The game explicitly rejects treating Eisai as the beginning of all Japanese tea culture.
3. **London newspaper advertisement, 1658**: [Museum of English Rural Life, University of Reading](https://merl.reading.ac.uk/explore/online-exhibitions/tea-culture-in-our-collections/) identifies the September 1658 advertisement in Mercurius Politicus. The game does not repeat another source's erroneous attribution to The London Gazette. Historical health marketing is distinguished from medical evidence.
4. **Boston Tea Party, 16 December 1773**: [U.S. National Park Service timeline](https://www.nps.gov/articles/000/boston-tea-party-in-real-time.htm) supports the date and 342 chests. The story gives trade, tax and political context without reducing the wider conflict to tea alone.
5. **Assam tea auction, 10 January 1839**: [KKHSOU Tea World, Lesson 7](https://www.kkhsou.ac.in/web/teaworld/page-details-part.php?page=9d34bb5c4a06966fcf6ceb4bf) distinguishes the eight chests shipped in 1838 from the 1839 auction and records Singpho knowledge and production. The game credits this pre-existing knowledge and explicitly puts the auction before Fortune.
6. **Fortune mission starts, 1848**: [Royal Botanic Gardens, Kew](https://www.kew.org/read-and-watch/the-history-of-tea-from-china-to-india) supports the commission and subsequent transfer of plants and know-how. The game dates the beginning of the mission, not every transfer, and does not say Fortune first introduced tea to India.
7. **Cutty Sark launch, 22 November 1869**: [National Maritime Museum Cornwall](https://nmmc.co.uk/2019/11/150-years-of-the-cutty-sark/) distinguishes launch from the 1870 maiden voyage. The distinction is part of the story.
8. **UNESCO inscription, 2022**: [UNESCO element 01884](https://ich.unesco.org/en/RL/traditional-tea-processing-techniques-and-associated-social-practices-in-china-01884) and [Committee decision 17.COM 7.b.2](https://ich.unesco.org/en/Decisions/17.COM/7.b.2) identify the inscription. Verified through indexed UNESCO records and [UNESCO's 2022 annual report](https://articles.unesco.org/sites/default/files/medias/fichiers/2023/04/UNESCO%20Beijing%20Office%20Annual%20Report%202022.pdf); direct HTML requests encountered an anti-bot page during source checking. The game makes clear that recognition does not date the traditions' birth or rank tea cultures.

## Verification

Passed:

- `node --check assets/tea-time-machine-data.js`
- `node --check assets/tea-time-machine.js`
- `node reviews/test_time_machine.cjs`: all three locales; ten unique comparisons across two trips; earlier/later date correctness; approximate-date non-overlap; hints; wrong/correct answers; reveal; repeated clicks; stale next button; back; retry; review; restart; focus and announcement contracts; initialization failure; unsupported-locale fallback; randomization; source-date invariants; original-content preservation.
- `node reviews/sync_time_machine_fallbacks.cjs --check`: generated fallback matches current translated data.

The complete 105-page Quarto 1.11.9 render and `python3 reviews/test_time_machine_render.py` pass. All three locales also pass real-browser game flows, Enter/Space controls, responsive frame checks and script-blocked reading fallback checks. See `cultural-games-release-review.md` for the integrated evidence and remaining test limitations.

## Suggested browser checks

- Start each locale; use hint, choose earlier/later, reveal, retry and previous; finish five stops and open the timeline.
- Verify another five comparisons and review/restart, without duplicate/skipped stops after fast clicks.
- Tab/Enter through controls; confirm focus lands at a new stop/summary and at the explanation after direct reveal.
- At 320px and 390px widths, inspect cards, long Chinese labels, sources and summary; no horizontal page overflow.
- Check keyboard focus visibility, 200% zoom, no-JS fallback, language switching and original footnotes/foldouts.
- Compare served asset hashes and rendered anchors after publishing the integrated commit.
