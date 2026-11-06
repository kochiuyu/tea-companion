# Tea Museum: Fix the Label

Baseline: `143dc71ba0d5d14116b5d3daf24aa3ed0eb5f117` (the illustrated-games release).

## Scope

Twelve illustrated displays in English, Traditional Chinese (Hong Kong), and Simplified Chinese:

1. Fortune and pre-existing Assam tea knowledge.
2. Lu Yu's cake tea and boiling method.
3. Song powdered, whisked tea in the practices discussed by the lesson.
4. Hong Kong Island in Article III of the Treaty of Nanking.
5. The cotton strainer behind Hong Kong milk tea's nickname.
6. UNESCO's 2022 recognition of older living traditions.
7. Eisai as part of an earlier history of exchange.
8. A 1658 advertisement as marketing evidence, not medical proof.
9. Cheaper Company tea alongside disputes over taxation, trade and authority.
10. Cutty Sark's 1869 launch versus its 1870 first voyage.
11. Green and black tea as different processing of the same species.
12. Chaoshan gongfu tea in varied everyday, refined and tea-house settings.

Every display links to an existing fuller lesson and its sources. Illustrations are original schematics, not reconstructions of artifacts. The mixed-up labels are explicitly marked as incorrect game prompts. Corrections retain the missing people, processes and historical context rather than replace one origin myth with another.

## Interaction and accessibility

Native buttons support tap, Enter and Space. Choices shuffle on a fresh visit. Hints and direct evidence reveals require no prior knowledge. Previous/next retain answers; repeat and stale clicks cannot change later displays. A gallery collects the restored labels. No timer, score, typing, storage, telemetry or game network requests.

Localized captions carry the meaning of decorative SVGs. Feedback is announced politely, new display headings receive focus, and controls have a minimum 48px height. All twelve corrected labels and sources remain available when JavaScript does not load.

## Reproduce the checks

```sh
quarto render
node reviews/test_museum_dom.cjs
python reviews/test_museum_render.py
node reviews/test_time_machine.cjs
node reviews/test_tea_table_dom.cjs
node reviews/test_study_detective.cjs
node reviews/test_decision_game_dom.cjs
python reviews/test_time_machine_render.py
git diff --check
```

The museum DOM suite tests every answer path for all twelve exhibits and all three locales, plus hint/reveal, navigation, review/reset, fallback preservation, repeat mounting, shuffle and figure captions. The rendered suite checks all source paths and section anchors, exact fallback content, locale links and preservation against the stated baseline.

`reviews/test_cultural_games_integration.py` is an older release-specific audit fixed to `82ac378`. It reports differences already merged in the illustrated-games release and is not a current-main preservation baseline. No existing game assets or original lesson text are modified here.

## Content maintenance

Edit `assets/tea-museum-data.js`, then run `node reviews/sync_museum_pages.cjs` to regenerate the three complete reading fallbacks. Exhibit counts in interface copy and generated descriptions derive from the data. Update the explicit expected exhibit count in the tests when intentionally changing the collection size.
