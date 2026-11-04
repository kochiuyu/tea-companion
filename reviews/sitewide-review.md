# Tea Companion: sitewide review

## What this revision does

The reading-and-structure pass covers **105 pages: 35 topics in each of English, Hong Kong Traditional Chinese, and Simplified Chinese**. It introduces a concrete question and a short reading activity for each topic, keeps the original main sections, and makes longer introductions and repeated recaps expandable. The opening prompts are written separately for the three editions.

All existing technical content and citations are retained. The two previously revised English sample pages also contain their complete original discussions in expandable sections, alongside the newer material. The original wording is recoverable on the page itself, not only through Git history.

This is an additive editorial pass. Existing scientific explanations, numbers, tables, historical narratives, and references have not been silently rewritten or removed. The new prompts ask readers to observe, compare, trace evidence, or examine a method; they do not introduce new scientific findings.

## Coverage and implementation

- Baseline: `1822d2e8ae2f7b6fa3ac841209027c87df296316`.
- Previous review: `5334419c8c3cfe061aa3797e9ed2261210677b95`.
- **7,803 normalized original content lines** retained in order across all 105 pages.
- **600 original footnote definitions** retained, plus existing numbered reference lists and every original table row.
- **94 introductory/background sections** and **39 recaps** placed in expandable sections.
- Existing footnotes, language links, chapter navigation, heading text, and named anchors retained.
- Both current sample revisions retained as well as the original baseline content.
- A small shared style makes new reading prompts easy to distinguish from the original text.
- Long reference URLs wrap on narrow screens; no reference text is clipped or removed.
- Horizontal separators use equivalent Markdown syntax inside foldouts; three existing language-include directives have their missing space repaired. These are rendering fixes, not changes to the claims.

The check excludes blank lines, YAML metadata, language-include directives, and fenced-div presentation markers when comparing body text; it treats equivalent horizontal-rule syntax alike. It also checks original table rows and footnote definitions literally. Counts describe coverage, not a new certification of factual accuracy.

The reproducible transformation is in `apply_reading_pass.py`; the authored multilingual entry points are in `reading-guides.json`. The per-page inventory and hashes are in `coverage-manifest.json`. `validate_reading_pass.py` independently checks retention and rendered navigation. Machine-readable validation results are recorded alongside this review.

## Items flagged for review, with the text retained

These are questions for editorial review, not deletions or claims that every cited source is wrong.

| Location | What deserves attention | Treatment |
| --- | --- | --- |
| Brewing lesson, original versus newer explanation | The original “early guests / slower EGCG” account and below-80°C ratio discussion are more categorical than the newer discussion of study-specific extraction. | Both accounts and all original citations remain; the original-discussion foldout identifies the need to read them alongside the audit. |
| Brewing lesson, original solubility table | Exact values and the pH 6.5 threshold were not independently established in the earlier sample review. | Exact original values and attributions are restored on the page. They are also itemized in the earlier sample audit. |
| Brewing lesson, Spiro–Jago reference | The original bibliographic entry differs from the verified 1982 paper by those authors cited in the newer discussion. | Original and corrected entries both remain, with the correction explained in the newer footnote. |
| Trade-history lesson, Treaty of Nanking tables | One table assigns the full indemnity to Article VI; another separates Articles IV–VII. | The page already explains this as teaching shorthand versus treaty wording. That explanation and both tables remain together; a future editorial decision can make the shorthand clearer. |
| Trade-history timelines | Several narratives and timelines cover overlapping dates and distinguish Fortune's journeys from earlier Assam developments. | Retained in full. The new reading prompt encourages a separate timeline rather than silently reconciling or deleting dates. |
| Decision-making lesson, numerical effects | The existing RVIP and CRT effect figures are precise; the CRT reference is labeled a “study narrative” in the original source list. | Figures and citations retained. If reviewed further, resolve the exact paper, task, outcome definition, and denominator before interpreting the percentages. |
| Warmth/trust and study-protocol lessons | The text moves between thermal-priming designs, warm pads, and a proposed matched-mug temperature. | All distinctions and caveats retained. Review the original experimental manipulation separately from the site's proposed protocol. |
| Several chapter bridges | Some prose still says “Chapter 4” or “4.4” while linking to a lesson now in Chapter 5. | Existing text and links retained; these wording inconsistencies are logged rather than silently altering the source discussion. |

The same subjects appear in translated editions. They should be reviewed as corresponding passages if the owner later approves factual or bibliographic changes. This pass does not imply that every empirical claim has been independently rechecked.

## A practical review route

Review in short passes rather than reading all 105 pages in one sitting.

1. **Experience:** open Home, Tea basics, Labels, and Kitchen troubleshoot. Check whether the new opening gives you a clear reason to read, and whether you can reach the practical material quickly.
2. **Depth:** open Brewing, Trade history, and Study protocols. Expand the introductory notes, one technical box, and the recap. Confirm that the original numbers, tables, and sources remain accessible.
3. **Language:** inspect the corresponding pages in Traditional and Simplified Chinese. Check the naturalness of the new prompt and the visibility of language navigation.
4. **Coverage:** use the 105-row inventory in the review companion. Each row identifies the topic, language, and preservation result. The repository manifest supplies per-file detail.
5. **Evidence:** use the flagged-items table above for questions that need an explicit editorial decision. The current revision keeps the existing material.

All changes remain on the local `review/homepage-brewing-sample` branch. No push, pull request, merge, or deployment is part of this task.

## Validation scope

The full Quarto 1.9.36 render completed successfully for all **105 pages**. The generated-output check passed **13,533 local links and asset references**, with **no missing targets, missing fragments, duplicate IDs, or broken foldout-control targets**. Source retention passed independently for all 105 pages.

Representative browser checks passed for the English homepage, English plant lesson, Traditional Chinese trade-history lesson, and Simplified Chinese label guide. Desktop (1280 px) and mobile (390 px) layouts had no horizontal page overflow after the reference-wrapping fix, and each checked foldout opened and closed successfully. Screenshots were inspected internally and are not included in the deliverable.

Quarto/Pandoc emits a nonfatal localization warning for the existing `zh-Hant-HK` language setting (missing translation data and an Abstract-label translation). The Traditional Chinese page content renders, but some interface labels can fall back to other/default wording. The locale setting and existing translations have been preserved.

The final handoff reports the full render result and the generated-link checks from `validation-results.json`. External source URLs are retained; they are not treated as newly verified simply because they are present. Full browser-based visual inspection of every page and expert review of every scientific claim are outside this automated check.
