# Compound illustrations

Three original static diagrams accompany the existing caffeine, L-theanine, and EGCG subsections in English, Traditional Chinese (Hong Kong), and Simplified Chinese.

- Caffeine: symbolic adenosine-receptor occupancy, without promising energy or replacing sleep.
- L-theanine: study ingredients and an attention task, without promising a benefit.
- EGCG: one catechin in the leaf-to-cup mixture, without depicting a health effect or absorption.

Each figure has localized alt text, a numbered HTML legend, an existing lesson formula, and a visible limitation note. Illustrations are schematic symbols, not molecular structures. They work without JavaScript; legends stack on phones, and visual key numbers are hidden from assistive technology to avoid duplicate speech.

## Checks

- Complete Quarto render: 108 pages.
- All existing content in 213 QMD files is preserved after removing the nine marked additive blocks; 418 other baseline files are unchanged.
- All 11 source footnote definitions in each locale remain intact. Existing prose, citations, clock illustration, tables, games, and other galleries are unchanged.
- All three formulas, English and Chinese captions, and alternatives passed independent content review.
- Text contrast: 6.0–9.5:1 for body, formulas, and caution notes.
- Chromium checks: desktop at 1180px; English/Traditional/Simplified at 320px, 375px, and 768px iframe viewports; all figure assets loaded and no horizontal overflow.
- Copies with all source scripts removed and `script-src 'none'`: illustrations, captions, legends, and cautions remain visible.
- Language navigation, Back/Forward, reload, repeated opening/closing of the existing formulas foldout, and footnote return links pass.
- This is an additive visual change. Existing scientific prose and bibliography were not revised or re-certified.

## Reproduce

```sh
python reviews/draw_compound_art.py
python reviews/sync_compound_illustrations.py
quarto render
python reviews/test_compound_illustrations.py
git diff --check
```

The test checks source preservation, SVG safety, all nine localized figures, rendered assets and footnotes, duplicate IDs, full-build page count, and generator idempotence. No new runtime dependency or JavaScript is introduced. The brewing illustrations merged in PR #51 are preserved byte-for-byte. The only shared configuration change retains both illustration resource and CSS registrations. The compound preservation baseline is the brewing merge commit bd5e45def26652905fedc97a7ef3db2f9a40af72.
