"""Preservation, accessibility markup, asset safety and complete-build coverage."""
from pathlib import Path
from html.parser import HTMLParser
import collections,hashlib,json,re,subprocess,xml.etree.ElementTree as ET

R=Path(__file__).resolve().parents[1]
BASE='8a5950c4b7e3fd8222902bd03f09984a33513782'
D=json.loads((R/'data/tea-brewing-illustrations.json').read_text())
MARKER=r'<!-- tea-brewing-illustrations:start -->[\s\S]*?<!-- tea-brewing-illustrations:end -->\n\n'
changed={'_quarto.yml','tea-labels.qmd','zh-hant-hk/tea-labels.qmd','zh-hans/tea-labels.qmd'}
qmds=unchanged=0
for name in subprocess.check_output(['git','ls-tree','-r','--name-only',BASE],cwd=R).decode().splitlines():
    old=subprocess.check_output(['git','show',BASE+':'+name],cwd=R)
    new=(R/name).read_bytes()
    if name in changed:
        text=new.decode()
        if name.endswith('.qmd'):
            assert len(re.findall(MARKER,text))==1,name
            text=re.sub(MARKER,'',text)
            qmds+=1
        else:
            text=text.replace('    - assets/tea-brewing-illustrations/\n','').replace('      - assets/tea-brewing-illustrations.css\n','')
        assert text.encode()==old,('Existing content changed',name)
    else:
        assert new==old,('Existing file changed',name)
        unchanged+=1

class Page(HTMLParser):
    def __init__(self,text):
        super().__init__();self.images=[];self.figures=[];self.figure=None;self.caption=False;self.details=[];self.ids=[];self.tables=0;self.feed(text)
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if 'id' in a:self.ids.append(a['id'])
        if tag=='table':self.tables+=1
        if tag=='details' and a.get('class')=='tea-brewing-gallery':self.details.append(a)
        if tag=='figure' and 'data-tea-brewing' in a:self.figure={'id':a['data-tea-brewing'],'images':[],'caption':''};self.figures.append(self.figure)
        if tag=='img' and self.figure is not None:self.figure['images'].append(a)
        if tag=='figcaption' and self.figure is not None:self.caption=True
    def handle_endtag(self,tag):
        if tag=='figure':self.figure=None
        if tag=='figcaption':self.caption=False
    def handle_data(self,text):
        if self.figure is not None and self.caption:self.figure['caption']+=text

locales=['en','zh-hant-hk','zh-hans']
for loc in locales:
    prefix='' if loc=='en' else loc+'/'
    file=R/'_site'/prefix/'tea-labels.html';p=Page(file.read_text())
    assert len(p.ids)==len(set(p.ids)),loc
    assert p.tables==8,(loc,p.tables)
    assert len(p.details)==1 and 'open' in p.details[0]
    assert [f['id'] for f in p.figures]==[e['id'] for e in D['entries']]
    for e,f in zip(D['entries'],p.figures):
        t=e['text'][loc];assert f['caption']==t['name']+t['caption'],(loc,e['id'])
        assert len(f['images'])==1
        im=f['images'][0];assert im['alt']==t['alt'] and len(im['alt'])>10
        assert im['width']=='360' and im['height']=='200' and im['loading']=='lazy' and im['decoding']=='async'
        assert (file.parent/im['src']).resolve().read_bytes()==(R/'assets/tea-brewing-illustrations'/(e['id']+'.svg')).read_bytes()
    # No substitution for older galleries or games.
    html=file.read_text()
    assert html.count('data-tea-name=')==28
    assert html.count('data-tea-classification-card=')==14
    assert 'data-tea-detective' in html

assets=list((R/'assets/tea-brewing-illustrations').glob('*.svg'))
assert len(assets)==6
hashes=set()
for f in assets:
    tree=ET.fromstring(f.read_bytes());assert tree.attrib['viewBox']=='0 0 360 200'
    assert not any(e.tag.rsplit('}',1)[-1] in ['script','foreignObject','image','a','text'] for e in tree.iter())
    assert not any('href' in key or key.startswith('on') for e in tree.iter() for key in e.attrib)
    assert (R/'_site'/f.relative_to(R)).read_bytes()==f.read_bytes()
    hashes.add(hashlib.sha256(f.read_bytes()).hexdigest())
assert len(hashes)==6
assert len(list((R/'_site').rglob('*.html')))==108

# Both generators must be deterministic and rerunnable without duplicate blocks.
paths=[R/name for name in changed]+assets
before={p:p.read_bytes() for p in paths}
subprocess.run(['python','reviews/draw_brewing_art.py'],cwd=R,check=True)
subprocess.run(['python','reviews/sync_brewing_illustrations.py'],cwd=R,check=True)
assert all(p.read_bytes()==content for p,content in before.items()),'Generators are not idempotent'
result={'passed':True,'baseline':BASE,'unchanged_existing_files':unchanged,'additive_localized_pages':qmds,'rendered_pages':108,'original_svg_files':6,'localized_figures':18,'tables_per_label_page':8,'existing_sources_games_and_galleries_preserved':True,'generators_idempotent':True}
(R/'reviews/brewing-browser/source-results.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps(result,indent=2))
