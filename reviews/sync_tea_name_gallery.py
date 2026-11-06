"""Generate localizable, progressively enhanced-free tea-name galleries.
Source of truth: data/tea-name-gallery.json. Run from any directory.
The SVGs are original schematic artwork, not identification photographs.
"""
from pathlib import Path
import json, html, re
ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / 'data/tea-name-gallery.json'
LOCALES = ['en','zh-hant-hk','zh-hans']

def sync():
    data = json.loads(DATA.read_text())
    for locale in LOCALES:
        page = ROOT / ('' if locale == 'en' else locale) / 'tea-labels.qmd'
        text = page.read_text()
        prefix = '' if locale == 'en' else '../'
        for group in data['groups']:
            entries = [e for e in data['entries'] if e['group'] == group['id']]
            title, note = group['text'][locale]
            cards = []
            for e in entries:
                loc = e['text'][locale]
                cards.append(f'''  <li><figure class="tea-name-card" data-tea-name="{e['id']}">
    <img src="{prefix}assets/tea-name-illustrations/{loc.get('image', e['id'] + '.svg')}" width="240" height="150" loading="lazy" decoding="async" alt="{html.escape(loc['alt'], quote=True)}">
    <figcaption><strong class="tea-name-title">{html.escape(loc['name'])}</strong><span class="tea-name-kind">{html.escape(loc['kind'])}</span><span class="tea-name-note">{html.escape(loc['note'])}</span></figcaption>
  </figure></li>''')
            map_note = ''
            if 'map_note' in group:
                map_note = '<p class="tea-name-map-key">' + html.escape(group['map_note'][locale]) + '<a href="https://www.naturalearthdata.com/about/terms-of-use/">Natural Earth</a>.</p>\n'
            block = f'''<!-- tea-name-gallery:{group['id']}:start -->
```{{=html}}
<details class="tea-name-gallery" data-tea-name-gallery="{group['id']}" open>
  <summary>{html.escape(title)}</summary>
  <p class="tea-name-intro">{html.escape(note)}</p>
  {map_note}<ul class="tea-name-grid" role="list">
{chr(10).join(cards)}
  </ul>
</details>
```
<!-- tea-name-gallery:{group['id']}:end -->

'''
            pattern = re.compile(r'<!-- tea-name-gallery:'+group['id']+r':start -->.*?<!-- tea-name-gallery:'+group['id']+r':end -->\n\n', re.S)
            text = pattern.sub('', text)
            marker = '<span id="label-'+group['id']+'-names"></span>'
            start = text.index(marker)
            heading_end = text.index('\n\n', text.index('\n## ', start)) + 2
            text = text[:heading_end] + block + text[heading_end:]
        page.write_text(text)

if __name__ == '__main__':
    sync()
    print('Synced 28 cards × 3 languages; existing text remains outside marked blocks.')
