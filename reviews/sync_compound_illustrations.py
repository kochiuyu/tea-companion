"""Insert three additive, localized teaching figures; leave existing prose untouched."""
from pathlib import Path
import json,re,html
R=Path(__file__).resolve().parents[1]
D=json.loads((R/'data/tea-compound-illustrations.json').read_text())
esc=lambda t:html.escape(t,quote=True)
pattern=r'\n<!-- tea-compound-illustration:([a-z-]+):start -->\n[\s\S]*?<!-- tea-compound-illustration:\1:end -->\n'
for locale in ['en','zh-hant-hk','zh-hans']:
    prefix=Path('') if locale=='en' else Path(locale)
    filename=R/prefix/D['page']
    text=re.sub(pattern,'',filename.read_text())
    asset_prefix='../../' if locale=='en' else '../../../'
    for entry in D['entries']:
        t=entry['text'][locale];id=entry['id']
        heading='## '+entry['headings'][locale]+'\n'
        assert text.count(heading)==1,(locale,heading)
        legend='\n'.join(f'      <li><span class="tea-compound-key" aria-hidden="true">{i}</span><strong>{esc(a)}</strong><span>{esc(b)}</span></li>' for i,(a,b) in enumerate(t['legend'],1))
        block=f'''\n<!-- tea-compound-illustration:{id}:start -->
```{{=html}}
<figure class="tea-compound-figure" data-tea-compound="{id}">
  <img src="{asset_prefix}assets/tea-compound-illustrations/{id}.svg" width="720" height="340" alt="{esc(t['alt'])}" loading="lazy" decoding="async">
  <figcaption>
    <div class="tea-compound-heading"><strong>{esc(t['title'])}</strong><span class="tea-compound-formula">{esc(entry['formula'])}</span></div>
    <ol class="tea-compound-legend" role="list">
{legend}
    </ol>
    <p class="tea-compound-note">{esc(t['note'])}</p>
  </figcaption>
</figure>
```
<!-- tea-compound-illustration:{id}:end -->
'''
        text=text.replace(heading,heading+block)
    filename.write_text(text)
q=R/'_quarto.yml';text=q.read_text()
for line,anchor in [('    - assets/tea-compound-illustrations/\n','  resources:\n'),('      - assets/tea-compound-illustrations.css\n','    css:\n')]:
    if line not in text:text=text.replace(anchor,anchor+line)
q.write_text(text)
print('Synced 9 localized figures across 3 pages.')
