"""Validate additive integration, fallback parity, and rendered local targets."""
from pathlib import Path
from urllib.parse import urlsplit,unquote
from html.parser import HTMLParser
from html import unescape
import subprocess,json,re
root=Path(__file__).resolve().parents[1]
class Page(HTMLParser):
    def __init__(self,text):
        super().__init__();self.ids=set();self.links=[];self.scripts=[];self.details=0;self.feed(text)
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if 'id' in a:self.ids.add(a['id'])
        if tag=='a' and 'href' in a:self.links.append(a['href'])
        if tag=='script' and 'src' in a:self.scripts.append(a['src'])
        if tag=='details':self.details+=1
raw=subprocess.check_output(['node','-e',"const fs=require('fs'),vm=require('vm'),ctx={window:{}};vm.runInNewContext(fs.readFileSync('assets/tea-museum-data.js','utf8'),ctx);console.log(JSON.stringify(ctx.window.TeaMuseumData))"],cwd=root,text=True)
data=json.loads(raw)
total=len(data['exhibits'])
assert total==12,('Expected twelve exhibits',total)
langs=['en','zh-hant-hk','zh-hans']
for lang in langs:
    prefix='' if lang=='en' else lang+'/'
    p=root/'_site'/prefix/'tea-museum.html';text=p.read_text();page=Page(text)
    assert page.details==total,(lang,page.details,total)
    assert f'data-locale="{lang}"' in text
    for e in data['exhibits']:
        fallback=(root/prefix/'tea-museum.qmd').read_text()
        for value in [e['title'][lang],e['explanation'][lang],next(c['label'][lang] for c in e['choices'] if c['id']==e['correct'])]:
            assert value in unescape(fallback),(lang,e['id'],'Missing fallback content')
            assert value in unescape(text),(lang,e['id'],'Missing rendered fallback content')
        assert e['source'][lang] in fallback
        for citation in e['citations']:
            assert citation['url'] in unescape(fallback),(lang,e['id'],'Missing fallback citation')
        u=urlsplit(e['source'][lang]);target=p.parent/unquote(u.path)
        assert target.exists(),target
        if u.fragment:assert unquote(u.fragment) in Page(target.read_text()).ids,(target,u.fragment)
    for href in page.links+page.scripts:
        u=urlsplit(href)
        if u.scheme or u.netloc or not u.path or u.path.startswith('data:'):continue
        target=(root/'_site'/u.path.lstrip('/')) if u.path.startswith('/') else p.parent/unquote(u.path)
        assert target.exists(),(p,href)
    for rel in ['index.html','modules/module-03/index.html']:
        assert 'tea-museum.html' in (root/'_site'/prefix/rel).read_text()
# Freeze the pre-museum baseline so this still verifies preservation after commit.
# Do not use the older 82ac378 baseline used by legacy, unrelated review scripts.
baseline='143dc71ba0d5d14116b5d3daf24aa3ed0eb5f117'
changed=subprocess.check_output(['git','diff','--name-only','--diff-filter=CDMRTUXB',baseline,'--'],cwd=root,text=True).splitlines()
allowed={'_quarto.yml'}|{prefix+name for prefix in ['','zh-hant-hk/','zh-hans/'] for name in ['index.qmd','modules/module-03/index.qmd']}
assert set(changed)<=allowed,changed
for p in changed:
    if p=='_quarto.yml':continue
    before=subprocess.check_output(['git','show',baseline+':'+p],cwd=root,text=True)
    after=(root/p).read_text()
    cleaned=re.sub(r'\n\[([^\n]+)\]\((?:\.\./\.\./)?tea-museum.qmd\)[^\n]*\n','',after)
    assert cleaned==before,('Existing content changed',p)
print(json.dumps({'passed':True,'locales':langs,'exhibits':total,'preservation_baseline':baseline,'existing_lesson_content':'unchanged','fallback_and_sources':'passed'},indent=2))
