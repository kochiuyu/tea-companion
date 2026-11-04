"""Package the validated local preview and a readable review route; never deploy."""
from pathlib import Path
import json,subprocess,zipfile,html,re

ROOT=Path(__file__).resolve().parents[1]
OUT=Path(r'C:\Users\kochi\AppData\Local\Temp\tea-sitewide-delivery')
OUT.mkdir(exist_ok=True)
manifest=json.loads((ROOT/'reviews/coverage-manifest.json').read_text(encoding='utf-8'))
validation=json.loads((ROOT/'reviews/validation-results.json').read_text(encoding='utf-8'))
assert validation['rendered_pages']==105 and not validation['errors'], 'Full successful validation required'
GIT=r'C:\Users\kochi\AppData\Local\GitHubDesktop\app-3.6.5\resources\app\git\cmd\git.exe'
commit=subprocess.check_output([GIT,'rev-parse','HEAD'],cwd=ROOT,text=True).strip()
branch=subprocess.check_output([GIT,'branch','--show-current'],cwd=ROOT,text=True).strip()
guide=(ROOT/'reviews/sitewide-review.md').read_text(encoding='utf-8')
guide+='\n## Build verification\n\n'
guide+=f"Review branch: **{branch}**. Commit: **{commit}**.\n\n"
guide+=f"All **105 pages rendered**. **{validation['internal_links_and_assets_checked']:,}** local links and asset references checked. **{validation['source_pages_preserved']}** source pages passed the original-content retention gate.\n\n"
guide+=f"Fragment warnings: **{len(validation['fragment_warnings'])}**. The package includes the exact validation report.\n\n"
guide+='## Browse the preview\n\n[English homepage](site/index.html) · [香港繁體中文](site/zh-hant-hk/index.html) · [简体中文](site/zh-hans/index.html)\n\n'
guide+='The links in this review open the revised local preview. External references open their original websites. This package is not a live deployment.\n\n'
guide+='For full browser search support, open a terminal in the extracted folder and run `python -m http.server 8000`, then visit `http://localhost:8000/START-HERE.html`. Ordinary page-to-page browsing is also available by opening START-HERE.html directly.\n\n'
guide+='## Complete page inventory\n\n'
for locale,label in [('en','English'),('zh-hant-hk','香港繁體中文'),('zh-hans','简体中文')]:
    guide+='### '+label+'\n\n| Page | Original coverage |\n| --- | --- |\n'
    for item in manifest['files']:
        if item['locale']!=locale: continue
        text=(ROOT/item['path']).read_text(encoding='utf-8')
        title=re.search(r'^title:\s*["\']?(.*?)["\']?\s*$',text,re.M).group(1).strip('"\'')
        link='site/'+str(Path(item['path']).with_suffix('.html')).replace('\\','/')
        guide+=f"| [{title}]({link}) | Retained |\n"
    guide+='\n'
md=OUT/'Review guide.md';md.write_text(guide,encoding='utf-8')
style='''body{font:17px/1.65 system-ui,sans-serif;color:#263326;max-width:1000px;margin:3rem auto;padding:0 1.4rem;background:#fcfdf9}h1,h2,h3{line-height:1.2;color:#36532c}h2{margin-top:2.4rem}a{color:#315b80}table{width:100%;border-collapse:collapse;font-size:.94rem}th,td{text-align:left;vertical-align:top;border-bottom:1px solid #ccd6c6;padding:.65rem}th{background:#edf3e8}code{overflow-wrap:anywhere} @media(max-width:650px){table{display:block;overflow:auto}body{font-size:16px;margin:1.5rem auto}}'''
(OUT/'review.css').write_text(style,encoding='utf-8')
subprocess.run(['quarto','pandoc',str(md),'-o',str(OUT/'START-HERE.html'),'--standalone','--metadata','pagetitle=Tea Companion — Sitewide Review','--css','review.css'],check=True,cwd=OUT)
subprocess.run(['quarto','pandoc',str(md),'-o',str(OUT/'Tea Companion - Review Guide.docx'),'--standalone'],check=True,cwd=OUT)
readme='Tea Companion — offline review\n\nExtract the ZIP, then open START-HERE.html. It links to all 105 revised pages.\nFor full browser search, run python -m http.server 8000 in the extracted folder and open http://localhost:8000/START-HERE.html.\n\nNo changes have been published. The review guide explains preserved content, flagged questions, and validation.\n'
(OUT/'README.txt').write_text(readme,encoding='utf-8')
patch=subprocess.check_output([GIT,'diff',manifest['baseline'],'HEAD','--','*.qmd','styles.css'],cwd=ROOT)
(OUT/'review-changes.patch').write_bytes(patch)
target=OUT/'Tea Companion - Sitewide Review.zip'
with zipfile.ZipFile(target,'w',zipfile.ZIP_DEFLATED) as z:
    for name in ['START-HERE.html','review.css','Review guide.md','Tea Companion - Review Guide.docx','README.txt','review-changes.patch']:
        z.write(OUT/name,name)
    for p in (ROOT/'_site').rglob('*'):
        if p.is_file():z.write(p,'site/'+p.relative_to(ROOT/'_site').as_posix())
    for name in ['sitewide-review.md','sample-coverage-audit.md','coverage-manifest.json','validation-results.json','browser-validation.json']:
        z.write(ROOT/'reviews'/name,'audit/'+name)
with zipfile.ZipFile(target) as z:
    assert z.testzip() is None
    for item in manifest['files']:
        assert 'site/'+str(Path(item['path']).with_suffix('.html')).replace('\\','/') in z.namelist()
print(json.dumps({'file':str(target),'bytes':target.stat().st_size,'pages':105,'zip_integrity':'passed','commit':commit}))
