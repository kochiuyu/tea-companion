"""Validate content retention and the rendered site's internal links."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import json,re,sys,subprocess,zipfile,io,collections

ROOT=Path(__file__).resolve().parents[1]
GIT=r'C:\Users\kochi\AppData\Local\GitHubDesktop\app-3.6.5\resources\app\git\cmd\git.exe'
manifest=json.loads((ROOT/'reviews/coverage-manifest.json').read_text(encoding='utf-8'))
base=zipfile.ZipFile(io.BytesIO(subprocess.check_output([GIT,'archive','--format=zip',manifest['baseline']],cwd=ROOT)))

def canonical(t):
    t=re.sub(r'^---\n.*?\n---\n','',t,flags=re.S)
    t=re.sub(r'\{\{<\s*include\s*[^>]+>\}\}', '',t)
    return [('---' if s.strip()=='***' else s.strip()) for s in t.splitlines() if s.strip() and not re.match(r'^\s*(?:<!--|:{3,})',s)]

def contains(a,b):
    it=iter(b)
    return all(any(x==y for y in it) for x in a)

errors=[]; preserved=0
for item in manifest['files']:
    p=item['path']; before=base.read(p).decode().replace('\r\n','\n'); now=(ROOT/p).read_text(encoding='utf-8')
    if not contains(canonical(before),canonical(now)): errors.append('Missing original content: '+p)
    else: preserved+=1
    # Every old footnote definition and table row must still be present literally.
    for s in before.splitlines():
        if re.match(r'^\[\^[^]]+\]:|^\|',s) and s not in now:
            errors.append('Missing citation/table row: '+p+' '+s[:80])
    if 'reader-guide:start' not in now and 'original-coverage:start' not in now:
        errors.append('Missing reading pass: '+p)

class Page(HTMLParser):
    def __init__(self,path):
        super().__init__();self.ids=[];self.links=[];self.assets=[];self.classes=[];self.text=[];self.collapse_targets=[]
        self.feed(path.read_text(encoding='utf-8'))
    def handle_starttag(self,tag,attrs):
        d=dict(attrs)
        if 'id' in d:self.ids.append(d['id'])
        if tag=='a' and 'href' in d:self.links.append(d['href'])
        if tag in ['script','img'] and 'src' in d:self.assets.append(d['src'])
        if tag=='link' and 'href' in d:self.assets.append(d['href'])
        self.classes.extend(d.get('class','').split())
        if d.get('data-bs-toggle')=='collapse' and 'data-bs-target' in d:
            self.collapse_targets.append(d['data-bs-target'])
    def handle_data(self,data):self.text.append(data)

source_only='--source-only' in sys.argv
checked=0; rendered=0; warnings=[]; duplicate_ids=[]
if not source_only:
    site=ROOT/'_site'
    pages={}
    for item in manifest['files']:
        rel=str(Path(item['path']).with_suffix('.html')).replace('\\','/')
        p=site/rel
        if not p.exists():errors.append('Missing rendered page: '+rel);continue
        pages[p.resolve()]=Page(p);rendered+=1
    for path,page in pages.items():
        rel=path.relative_to(site.resolve()).as_posix()
        duplicates=[k for k,v in collections.Counter(page.ids).items() if v>1]
        if duplicates: duplicate_ids.append({'page':rel,'ids':duplicates})
        for selector in page.collapse_targets:
            if selector.startswith('#') and selector[1:] not in page.ids:
                errors.append('Missing foldout target: '+rel+' '+selector)
        if 'lang-switcher' not in page.classes: errors.append('Missing language switcher: '+rel)
        if 'reader-guide' not in page.classes and rel not in ['index.html','modules/module-01/03-brewing.html']:
            errors.append('Missing reader guide: '+rel)
        for href in page.links+page.assets:
            u=urlsplit(href)
            if u.scheme or u.netloc or href.startswith('data:'):continue
            target=(site/unquote(u.path.lstrip('/'))) if u.path.startswith('/') else path.parent/unquote(u.path)
            if not u.path:target=path
            if target.is_dir():target=target/'index.html'
            target=target.resolve();checked+=1
            if not target.exists(): errors.append('Missing target: '+rel+' -> '+href);continue
            if u.fragment and target.suffix=='.html':
                dest=pages.get(target)
                if dest is None:dest=Page(target);pages_cache=dest
                if unquote(u.fragment) not in dest.ids:
                    warnings.append('Missing fragment: '+rel+' -> '+href)
        if re.search(r'\{\{<\s*include|<!-- reader-guide:start', '\n'.join(page.text)):
            errors.append('Unexpanded markup: '+rel)
    # Duplicate IDs can make footnotes and foldouts ambiguous and must be reviewed.
    errors.extend('Duplicate IDs: '+d['page']+' '+','.join(d['ids']) for d in duplicate_ids)
report={'source_pages_preserved':preserved,'source_pages_expected':105,'rendered_pages':rendered,
        'internal_links_and_assets_checked':checked,'errors':errors,'fragment_warnings':warnings}
(ROOT/'reviews/validation-results.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(report,ensure_ascii=True))
raise SystemExit(bool(errors))
