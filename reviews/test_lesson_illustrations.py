#!/usr/bin/env python3
"""Check additive source preservation and every localized static figure after render."""
import json
import re
import subprocess
import xml.etree.ElementTree as ET
from pathlib import Path
from html.parser import HTMLParser

ROOT = Path(__file__).resolve().parents[1]
DATA = json.loads((ROOT / 'data/lesson-illustrations.json').read_text())
BASE = DATA['base_commit']
BLOCK = re.compile(r'\n<!-- lesson-illustration:[a-z-]+:start -->\n[\s\S]*?<!-- lesson-illustration:[a-z-]+:end -->\n')
def git(*args): return subprocess.check_output(['git', *args], cwd=ROOT)
files = git('ls-tree', '-r', '--name-only', BASE).decode().splitlines()
qmd_count = asset_count = 0
reviewed_assets = []
for name in files:
    before = git('show', f'{BASE}:{name}')
    after = (ROOT / name).read_bytes()
    if name.endswith('.qmd'):
        assert BLOCK.sub('', after.decode()).encode() == before, f'Original content changed: {name}'
        qmd_count += 1
    elif name == 'assets/tea-label-detective.js':
        cleaned = after.replace(b"figure('label', locale, activeIndex)", b"figure('label', locale)")
        assert cleaned == before, 'Unrelated Detective change'
        reviewed_assets.append(name)
    elif name == 'assets/tea-game-figures.js':
        cleaned = re.sub(r"    } else if \(kind === 'label' && Number.isInteger\(scenario\)[\s\S]*?(?=    } else if \(kind === 'notice')", '', after.decode())
        cleaned = cleaned.replace('function art(kind, count, scenario)', 'function art(kind, count)')
        cleaned = cleaned.replace('figure(kind, locale, scenario)', 'figure(kind, locale)')
        cleaned = cleaned.replace('art(kind, undefined, scenario)', 'art(kind)')
        assert cleaned.encode() == before, 'Unrelated shared-art change'
        reviewed_assets.append(name)
    elif name.startswith('assets/') or name == 'styles.css':
        assert after == before, f'Existing game/style asset changed: {name}'
        asset_count += 1
    elif name == '_quarto.yml':
        cleaned = after.decode().replace('  resources:\n    - assets/lesson-illustrations/\n', '').replace('      - assets/tea-lesson-figures.css\n', '')
        assert cleaned.encode() == before, 'Unrelated Quarto change'

class Page(HTMLParser):
    def __init__(self, text):
        super().__init__(); self.figures = []; self.current = None; self.caption = False; self.ids=[]; self.feed(text)
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if 'id' in a: self.ids.append(a['id'])
        if tag == 'figure' and 'data-lesson-illustration' in a:
            self.current = {'id': a['data-lesson-illustration'], 'images': [], 'caption': ''}; self.figures.append(self.current)
        if self.current is not None and tag == 'img': self.current['images'].append(a)
        if self.current is not None and tag == 'figcaption': self.caption = True
    def handle_endtag(self, tag):
        if tag == 'figure': self.current = None
        if tag == 'figcaption': self.caption = False
    def handle_data(self, text):
        if self.current is not None and self.caption: self.current['caption'] += text

for key, art in DATA['art'].items():
    filename = Path('assets/lesson-illustrations') / (key + '.svg')
    source = ROOT / filename
    tree = ET.fromstring(source.read_text())
    assert tree.attrib['viewBox'] == '0 0 240 136', key
    assert tree.attrib['width'] == '240' and tree.attrib['height'] == '136'
    assert not any(e.tag.rsplit('}',1)[-1] in ['text','script','foreignObject','image','a'] for e in tree.iter()), key
    assert not any('href' in a or a.startswith('on') for e in tree.iter() for a in e.attrib), key
    assert (ROOT / '_site' / filename).read_bytes() == source.read_bytes(), f'Missing/stale SVG: {key}'
    assert set(art['alt']) == {'en','zh-hant-hk','zh-hans'}
    assert art['alt']['en'] != art['alt']['zh-hans']

count = 0
for placement in DATA['placements']:
    for locale in ['en', 'zh-hant-hk', 'zh-hans']:
        relative = Path('' if locale == 'en' else locale) / placement['page']
        source = (ROOT / relative).read_text()
        assert source.count(f'<!-- lesson-illustration:{placement["id"]}:start -->') == 1
        heading = '\n## ' + placement['heading'][locale] + '\n'
        assert source.split(heading, 1)[1].startswith('\n<!-- lesson-illustration:'), relative
        html_file = ROOT / '_site' / relative.with_suffix('.html')
        page = Page(html_file.read_text())
        assert len(page.figures) == 1, relative
        figure = page.figures[0]
        assert figure['id'] == placement['id']
        assert figure['caption'] == placement['caption'][locale]
        assert len(figure['images']) == 1
        image = figure['images'][0]
        assert image['alt'] == DATA['art'][placement['art']]['alt'][locale]
        assert image['width'] == '240' and image['height'] == '136'
        assert image['loading'] == 'lazy'
        target = (html_file.parent / image['src']).resolve()
        assert target.is_file() and target.is_relative_to((ROOT / '_site').resolve()), target
        assert target.read_bytes() == (ROOT / 'assets/lesson-illustrations' / (placement['art'] + '.svg')).read_bytes()
        assert 'assets/tea-lesson-figures.css' in html_file.read_text()
        count += 1
# All rendered pages retained. Figures don't require any extra runtime script.
assert len(list((ROOT / '_site').rglob('*.html'))) >= 108
print(json.dumps({'passed':True,'baseline':BASE,'preserved_qmds':qmd_count,'unchanged_existing_assets':asset_count,'additive_detective_art_assets':reviewed_assets,'localized_figures':count,'svg_assets':len(DATA['art'])},indent=2))
