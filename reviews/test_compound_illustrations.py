"""Assert byte-for-byte source preservation and fully rendered localized figure coverage."""
from pathlib import Path
from html.parser import HTMLParser
import json,subprocess,re,xml.etree.ElementTree as ET,hashlib
R=Path(__file__).resolve().parents[1]
D=json.loads((R/'data/tea-compound-illustrations.json').read_text());BASE=D['base_commit']
BLOCK=r'\n<!-- tea-compound-illustration:([a-z-]+):start -->\n[\s\S]*?<!-- tea-compound-illustration:\1:end -->\n'
locales=['en','zh-hant-hk','zh-hans']
pages=[('' if loc=='en' else loc+'/')+D['page'] for loc in locales]
preserved=0;qmds=0
for name in subprocess.check_output(['git','ls-tree','-r','--name-only',BASE],cwd=R).decode().splitlines():
    old=subprocess.check_output(['git','show',BASE+':'+name],cwd=R)
    new=(R/name).read_bytes()
    if name in pages:
        assert len(re.findall(BLOCK,new.decode()))==3,name
        assert re.sub(BLOCK,'',new.decode()).encode()==old,('Changed existing prose/citations',name)
    elif name=='_quarto.yml':
        clean=new.decode().replace('    - assets/tea-compound-illustrations/\n','').replace('      - assets/tea-compound-illustrations.css\n','')
        assert clean.encode()==old,'Unrelated Quarto edit'
    else:
        assert old==new,('Existing file modified',name)
        preserved+=1
    if name.endswith('.qmd'):qmds+=1
class Page(HTMLParser):
    def __init__(self,s):
        super().__init__();self.figures=[];self.current=None;self.ids=[];self.feed(s)
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if 'id' in a:self.ids.append(a['id'])
        if tag=='figure' and 'data-tea-compound' in a:
            self.current={'id':a['data-tea-compound'],'images':[],'text':''};self.figures.append(self.current)
        if self.current is not None and tag=='img':self.current['images'].append(a)
    def handle_data(self,s):
        if self.current is not None:self.current['text']+=s
    def handle_endtag(self,tag):
        if tag=='figure':self.current=None
for loc,p in zip(locales,pages):
    f=R/'_site'/p.replace('.qmd','.html');s=f.read_text();page=Page(s)
    assert len(page.ids)==len(set(page.ids)),('Duplicate ids',loc)
    assert [f['id'] for f in page.figures]==[e['id'] for e in D['entries']]
    source=(R/p).read_text()
    expected=len(re.findall(r'\[\^\d+\](?!:)', source))
    assert sum(id.startswith('fn') and id[2:].isdigit() for id in page.ids)==expected
    assert len(re.findall(r'^\[\^\d+\]:',source,re.M))==11
    assert 'data-lesson-illustration="compound-clocks"' in s
    assert 'tea-compound-illustrations.css' in s
    for e,figure in zip(D['entries'],page.figures):
        t=e['text'][loc];im=figure['images'][0]
        assert len(figure['images'])==1
        assert im['alt']==t['alt'] and im['width']=='720' and im['height']=='340'
        assert im['loading']=='lazy' and im['decoding']=='async'
        assert (f.parent/im['src']).resolve().read_bytes()==(R/'assets/tea-compound-illustrations'/(e['id']+'.svg')).read_bytes()
        for text in [t['title'],t['note'],e['formula']]+[x for pair in t['legend'] for x in pair]:assert text in figure['text'],(loc,text)
assets=list((R/'assets/tea-compound-illustrations').glob('*.svg'))
assert len(assets)==3
for f in assets:
    root=ET.fromstring(f.read_text());assert root.attrib['viewBox']=='0 0 720 340'
    assert not any(e.tag.rsplit('}',1)[-1] in ['script','foreignObject','image','a','animate','animateTransform'] for e in root.iter())
    assert not any('href' in key or key.startswith('on') for e in root.iter() for key in e.attrib)
    assert [e.text for e in root.iter() if e.tag.endswith('}text')]==['1','2','3']
    assert (R/'_site'/f.relative_to(R)).read_bytes()==f.read_bytes()
assert len({hashlib.sha256(f.read_bytes()).hexdigest() for f in assets})==3
assert len(list((R/'_site').rglob('*.html')))==108
# Generated markup and artwork can be rerun safely.
paths=[R/p for p in pages]+[R/'_quarto.yml']+assets
before={p:p.read_bytes() for p in paths}
subprocess.run(['python','reviews/draw_compound_art.py'],cwd=R,check=True)
subprocess.run(['python','reviews/sync_compound_illustrations.py'],cwd=R,check=True)
assert all(p.read_bytes()==v for p,v in before.items()),'Generator is not idempotent'
result={'passed':True,'base_commit':BASE,'preserved_qmds':qmds,'existing_unmodified_files':preserved,'rendered_pages':108,'original_static_svgs':3,'localized_figures':9,'localized_legend_items':27,'existing_footnotes_per_lesson':11,'all_existing_prose_citations_sources_games_preserved':True,'generators_idempotent':True}
(R/'reviews/compound-browser').mkdir(exist_ok=True)
(R/'reviews/compound-browser/source-results.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps(result,indent=2))
