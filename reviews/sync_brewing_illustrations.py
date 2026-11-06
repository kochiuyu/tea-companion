"""Insert only the marked brewing gallery; preserve all existing prose and tables."""
from pathlib import Path
from html import escape
import json,re

ROOT=Path(__file__).resolve().parents[1]
DATA=json.loads((ROOT/'data/tea-brewing-illustrations.json').read_text())
MARKER=r'<!-- tea-brewing-illustrations:start -->[\s\S]*?<!-- tea-brewing-illustrations:end -->\n\n'
HEADINGS={'en':'## Thin strip: teapots and brewing methods','zh-hant-hk':'## 薄帶：茶壺與沖泡方法','zh-hans':'## 薄带：茶壶与冲泡方法'}

def gallery(locale):
    prefix='' if locale=='en' else '../'
    rows=['<!-- tea-brewing-illustrations:start -->','```{=html}',
          '<details class="tea-brewing-gallery" open>',
          '<summary>'+escape(DATA['summary'][locale])+'</summary>',
          '<p class="tea-brewing-intro">'+escape(DATA['intro'][locale])+'</p>',
          '<ul class="tea-brewing-grid">']
    for entry in DATA['entries']:
        t=entry['text'][locale]
        rows.append('<li><figure class="tea-brewing-card" data-tea-brewing="'+entry['id']+'">'
                    '<img src="'+prefix+'assets/tea-brewing-illustrations/'+entry['id']+'.svg" '
                    'width="360" height="200" alt="'+escape(t['alt'],quote=True)+'" loading="lazy" decoding="async">'
                    '<figcaption><strong class="tea-brewing-name">'+escape(t['name'])+'</strong>'
                    '<span class="tea-brewing-note">'+escape(t['caption'])+'</span></figcaption></figure></li>')
    rows+=['</ul>','</details>','```','<!-- tea-brewing-illustrations:end -->','','']
    return '\n'.join(rows)

for locale,heading in HEADINGS.items():
    file=ROOT/('tea-labels.qmd' if locale=='en' else locale+'/tea-labels.qmd')
    content=re.sub(MARKER,'',file.read_text())
    start=content.index(heading)
    table=content.index('\n| ',start)+1
    content=content[:table]+gallery(locale)+content[table:]
    file.write_text(content)

config=ROOT/'_quarto.yml';text=config.read_text()
resource='    - assets/tea-brewing-illustrations/\n'
style='      - assets/tea-brewing-illustrations.css\n'
if resource not in text:text=text.replace('  resources:\n','  resources:\n'+resource,1)
if style not in text:text=text.replace('    css:\n','    css:\n'+style,1)
config.write_text(text)
print('Synced six static illustrations in each of three locales.')
