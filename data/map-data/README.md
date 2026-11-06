# Physical land for tea-origin locators

`ne_110m_land.geojson` is Natural Earth 1:110m physical land, retrieved from:
https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_land.geojson

Natural Earth data is public domain. It may be modified and redistributed:
https://www.naturalearthdata.com/about/terms-of-use/

Only physical land/coastlines are rendered. There are no country, province, territorial-claim or tea-growing boundaries. The artwork is north-up, regionally cropped and simplified; panels do not share one scale. Dot locations are approximate regional locators, not estates or growing-area coverage.

## Approximate anchor checks

Coordinates are latitude, longitude in this list. They are intentionally approximate locators chosen within the region discussed, not precise tea estates or geographic centroids.

- Assam: 26.7, 93.3. Tea Board India: https://www.teaboard.gov.in/TEABOARDCSM/Ng==
- Darjeeling: 27.0, 88.3. Darjeeling district: https://darjeeling.gov.in/demography/
- Nilgiri: 11.4, 76.7. Nilgiris district: https://nilgiris.nic.in/plastic-free-nilgiris/
- Sri Lanka: 7.0, 80.7. Sri Lanka Tea Board: https://srilankateaboard.lk/ceylon-tea/tea-growing-regions/
- Kenya: -0.4, 36.2. Kenya Export Promotion and Branding Agency: https://makeitkenya.go.ke/about-keproba/news-room/opinion/tea-growing-in-kenya-oped
- Yunnan: 24.5, 101.0. Institute of Geographic Sciences and Natural Resources Research, Chinese Academy of Sciences: https://english.igsnrr.cas.cn/ecg/cnmap/202011/t20201119_251702.html

The two Ceylon/Kenyan panels are individually labeled, use different extents/scales, and have no connecting line. Coastlines are generalized by the original 1:110m data and local pixel projection. No source map artwork was copied from tea-board websites.

The vendored GeoJSON retains the source geometry and properties; its trailing blank line was removed for repository whitespace hygiene.
