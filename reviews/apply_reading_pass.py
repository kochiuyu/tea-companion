"""Reproducible, additive reading pass. Existing prose and sources are retained."""
from pathlib import Path
import re, json, subprocess, hashlib, difflib, io, zipfile

ROOT = Path(__file__).resolve().parents[1]
GIT = r'C:\Users\kochi\AppData\Local\GitHubDesktop\app-3.6.5\resources\app\git\cmd\git.exe'
BASE = '1822d2e8ae2f7b6fa3ac841209027c87df296316'
START = '5334419c8c3cfe061aa3797e9ed2261210677b95'
ARCHIVES = {ref: zipfile.ZipFile(io.BytesIO(subprocess.check_output([GIT,'archive','--format=zip',ref],cwd=ROOT))) for ref in (BASE,START)}
DATA = json.loads((Path(__file__).parent/'reading-guides.json').read_text(encoding='utf-8'))
LOCALES = ['en', 'zh-hant-hk', 'zh-hans']
LABELS = {
 'en': ['A question to start with', 'As you read', 'Earlier introduction and reading notes', 'Recap when you need it', 'Original discussion and sources — retained in full', 'Home', 'Chapter map'],
 'zh-hant-hk': ['由一個問題開始', '閱讀時試一試', '原有導讀與閱讀提示', '需要時重溫', '完整保留的原有討論與來源', '首頁', '章節地圖'],
 'zh-hans': ['从一个问题开始', '阅读时试一试', '原有导读与阅读提示', '需要时重温', '完整保留的原有讨论与来源', '首页', '章节地图']
}

def original(ref, path):
    return ARCHIVES[ref].read(path).decode('utf-8').replace('\r\n','\n')

def body(text):
    text=re.sub(r'^---\n.*?\n---\n','',text,flags=re.S)
    return re.sub(r'\{\{<\s*include\s*[^>]+>\}\}', '', text).strip()

def fold(content, title):
    return '\n<!-- reading-fold:start -->\n:::::::: {.callout-note collapse="true" title="'+title+'"}\n'+content.rstrip()+'\n::::::::\n<!-- reading-fold:end -->\n'

def headings(text):
    # Only top-level H2 sections: headings within existing fenced divs stay put.
    result=[]; stack=[]
    for match in re.finditer(r'^.*(?:\n|$)',text,re.M):
        line=match.group().strip()
        f=re.match(r'^(:{3,})(.*)$',line)
        if f:
            if f[2].strip(): stack.append(len(f[1]))
            elif stack: stack.pop()
        if line.startswith('## ') and not stack:
            result.append((match.start(),line))
    return result

def preserve_sample(text, base, title):
    archival=body(base)
    note='The original text and its citations are preserved below. The coverage audit records apparent contradictions for review; this section has not been silently fact-edited.'
    block='\n<!-- original-coverage:start -->\n'+fold(note+'\n\n'+archival,title)+'\n<!-- original-coverage:end -->\n'
    # Keep footnote definitions after the reading content.
    at=re.search(r'^\[\^[^]]+\]:',text,re.M)
    return text[:at.start()]+block+text[at.start():] if at else text+block

def canonical_lines(text):
    # Ignore only presentation scaffolding and the existing language include.
    out=[]
    for line in body(text).splitlines():
        line=line.strip()
        if not line or re.match(r'^:{3,}',line) or line.startswith('<!--'): continue
        out.append('---' if line=='***' else line)
    return out

def subsequence(needle, haystack):
    it=iter(haystack)
    return all(any(n==h for h in it) for n in needle)

manifest=[]
for locale in LOCALES:
    for rel, translations in DATA.items():
        path=rel if locale=='en' else locale+'/'+rel
        p=ROOT/path
        before=original(START,path)
        base=original(BASE,path)
        labels=LABELS[locale]
        opening,activity=translations[LOCALES.index(locale)]
        if locale=='en' and rel in ['index.qmd','modules/module-01/03-brewing.qmd']:
            after=preserve_sample(before,base,labels[4])
            intro_fold=False; recap_count=0
        else:
            after=before
            # Add a page-specific entry point immediately after the language switch.
            include=re.search(r'\{\{<\s*include\s*[^>]+>\}\}',after)
            if not include: raise ValueError('Missing language switch: '+path)
            at=include.end()
            root_prefix='../'*len(Path(rel).parts[:-1])
            guide='\n\n<!-- reader-guide:start -->\n::: {.reader-guide}\n**'+labels[0]+'**\n\n'+opening+'\n\n**'+labels[1]+':** '+activity+'\n\n['+labels[5]+']('+root_prefix+'index.qmd) · ['+labels[6]+']('+root_prefix+'modules/index.qmd)\n:::\n<!-- reader-guide:end -->\n'
            prefix=after[:at]
            tail=after[at:]
            hs=headings(tail)
            intro_fold=False; recap_count=0
            if hs:
                lead=tail[:hs[0][0]]
                # Keep language-local navigation visible, even when earlier prose is folded.
                nav=re.search(r'::: \{\.zh-door-nav\}.*?\n:::',lead,re.S)
                visible_nav=nav.group()+'\n' if nav else ''
                if nav: lead=lead[:nav.start()]+lead[nav.end():]
                if len(re.findall(r'\S+',lead))>30 or len(lead.strip())>300:
                    tail=visible_nav+fold(lead,labels[2])+tail[hs[0][0]:]
                    intro_fold=True
            after=prefix+guide+tail
            # Parallel editions retain their own wording. Locate a recap by its local heading.
            patterns={'en':r'Story in one minute|Present bias in kitchen language \(one more pass\)|Opaque mugs and the warmth confound \(one more time\)',
                      'zh-hant-hk':r'一分鐘|再講一次|再說一次',
                      'zh-hans':r'一分钟|再讲一次|再说一次'}
            for pos,heading in reversed(headings(after)):
                if not re.search(patterns[locale],heading): continue
                start=after.find('\n',pos)+1
                nexts=[x for x,_ in headings(after) if x>pos]
                end=min(nexts) if nexts else len(after)
                segment=after[start:end]
                # Only fold the uninterrupted prose, not navigation, references or existing boxes.
                boundary=re.search(r'^(:{3,}|---\s*$|\[\^[^]]+\]:)',segment,re.M)
                if boundary: end=start+boundary.start(); segment=after[start:end]
                if len(segment.strip())>40:
                    after=after[:start]+fold(segment,labels[3])+after[end:]
                    recap_count+=1
        # Keep thematic breaks unambiguous to Quarto's YAML extractor inside divs.
        front=re.match(r'^---\n.*?\n---\n',after,re.S)
        assert front, path
        after=after[:front.end()]+re.sub(r'^---[ \t]*$', '***',after[front.end():],flags=re.M)
        after=re.sub(r'(\{\{<\s*include)(?=[./])',r'\1 ',after)
        # A hard preservation gate, not a claim based on word counts.
        assert subsequence(canonical_lines(base),canonical_lines(after)), 'Baseline content lost: '+path
        assert subsequence(canonical_lines(before),canonical_lines(after)), 'Sample content lost: '+path
        p.write_text(after,encoding='utf-8',newline='\n')
        refs=re.findall(r'^\[\^([^]]+)\]:',base,re.M)
        manifest.append({'path':path,'locale':locale,'baseline_body_lines':len(canonical_lines(base)),
                         'baseline_preserved':True,'previous_review_preserved':True,
                         'baseline_footnote_definitions':len(refs),'intro_fold':intro_fold,
                         'recap_folds':recap_count,'source_sha256':hashlib.sha256(after.encode()).hexdigest()})

report={'baseline':BASE,'previous_review':START,'pages':len(manifest),
        'baseline_lines_preserved':sum(x['baseline_body_lines'] for x in manifest),
        'baseline_footnote_definitions':sum(x['baseline_footnote_definitions'] for x in manifest),
        'intro_folds':sum(x['intro_fold'] for x in manifest),'recap_folds':sum(x['recap_folds'] for x in manifest),
        'files':manifest}
(ROOT/'reviews/coverage-manifest.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps({k:v for k,v in report.items() if k!='files'}))
