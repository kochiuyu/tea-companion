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
# Freeze the publication immediately before the short-visit change. This keeps
# the museum check independent of older illustrated-lesson release baselines.
baseline='1630fed249450f4f18bb983a1df3b5a668583e66'
entry_pages={prefix+name for prefix in ['', 'zh-hant-hk/', 'zh-hans/'] for name in ['index.qmd', 'modules/module-03/index.qmd']}
museum_pages={prefix+'tea-museum.qmd' for prefix in ['', 'zh-hant-hk/', 'zh-hans/']}
allowed=entry_pages|museum_pages|{
    'assets/tea-museum.js', 'assets/tea-museum.css',
    'reviews/sync_museum_pages.cjs', 'reviews/test_museum_dom.cjs',
    'reviews/test_museum_render.py', 'reviews/short-museum-visits-review.md'
}
changed=subprocess.check_output(['git','diff','--name-only',baseline,'--'],cwd=root,text=True).splitlines()
assert set(changed)<=allowed,changed
original_files=subprocess.check_output(['git','ls-tree','-r','--name-only',baseline],cwd=root,text=True).splitlines()
for name in original_files:
    if not name.endswith('.qmd'):continue
    before=subprocess.check_output(['git','show',baseline+':'+name],cwd=root,text=True)
    after=(root/name).read_text()
    def normalize(text):
        if name in entry_pages:
            return re.sub(r'\n\[([^\n]+)\]\((?:\.\./\.\./)?tea-museum.qmd\)[^\n]*\n','',text)
        if name in museum_pages:
            return re.sub(r'^description:.*$','',text,flags=re.M)
        return text
    assert normalize(after)==normalize(before),('Existing content changed',name)
for name in ['tea-museum.js','tea-museum.css','tea-museum-data.js','tea-museum-figures.js']:
    assert (root/'assets'/name).read_bytes()==(root/'_site/assets'/name).read_bytes(),('Stale rendered asset',name)
print(json.dumps({'passed':True,'locales':langs,'exhibits':total,'preservation_baseline':baseline,'existing_lesson_content':'unchanged','fallback_and_sources':'passed','rendered_assets':'exact'},indent=2))
