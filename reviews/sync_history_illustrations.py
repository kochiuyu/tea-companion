#!/usr/bin/env python3
"""Regenerate only marked history figures; --check verifies without writing."""
import html,json,re,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
DATA=json.loads((ROOT/'data/history-illustrations.json').read_text())
check='--check' in sys.argv
for item in DATA['placements']:
 for locale in ('en','zh-hant-hk','zh-hans'):
  file=ROOT/('' if locale=='en' else locale)/item['page']
  original=file.read_text()
  marker=item['id']
  pattern=re.compile(r'\n<!-- history-illustration:'+re.escape(marker)+r':start -->\n[\s\S]*?<!-- history-illustration:'+re.escape(marker)+r':end -->\n')
  clean=pattern.sub('',original)
  anchor=item['anchor'][locale]+'\n'
  assert clean.count(anchor)==1,(file,anchor)
  asset='../'*len(file.relative_to(ROOT).parts[:-1])+'assets/history-illustrations/'+marker+'.svg'
  block=f'''\n<!-- history-illustration:{marker}:start -->
```{{=html}}
<figure class="tea-history-figure" data-history-illustration="{marker}">
  <img src="{asset}" width="760" height="320" alt="{html.escape(item['alt'][locale],quote=True)}" loading="lazy" decoding="async">
  <figcaption><strong>{html.escape(item['title'][locale])}</strong> {html.escape(item['caption'][locale])}</figcaption>
</figure>
```
<!-- history-illustration:{marker}:end -->
'''
  result=clean.replace(anchor,anchor+block,1)
  if check: assert result==original,f'Outdated history figure: {file} {marker}'
  else: file.write_text(result)
print(('Verified' if check else 'Synced')+' 36 localized history figures.')
