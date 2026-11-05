#!/usr/bin/env python3
"""Additive-source and rendered-anchor checks. Render the three lesson pages first."""
from pathlib import Path
import re, subprocess, json
root=Path(__file__).resolve().parents[1]
rows=[]
for locale in ['', 'zh-hant-hk/', 'zh-hans/']:
    file=locale+'modules/module-03/04-regional-scripts.qmd'
    old=subprocess.check_output(['git','show','82ac378:'+file],cwd=root,text=True)
    new=(root/file).read_text()
    stripped=re.sub(r'<!-- tea-table:start -->.*?<!-- tea-table:end -->\n\n','',new,flags=re.S)
    assert stripped==old,file+' original content changed'
    out=root/'_site'/file.replace('.qmd','.html')
    html=out.read_text()
    for anchor in ['set-the-tea-table','tea-table-reading','tea-table-notes']:
        assert len(re.findall(r'\sid="'+anchor+'"',html))==1,(file,anchor)
    assert 'data-tea-table' in html
    for asset in ['tea-table-data.js','tea-table-game.js','tea-table-game.css']:
        assert (root/'_site/assets'/asset).read_bytes()==(root/'assets'/asset).read_bytes(),asset
    rows.append({'locale':locale or 'en','original_unchanged':True,'rendered':True,'anchors':True})
print(json.dumps({'passed':True,'pages':rows},ensure_ascii=False,indent=2))
