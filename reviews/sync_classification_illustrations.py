"""Reproduce the two additive localized guide blocks and static resources."""
from pathlib import Path
import html,json,re,sys
from draw_classification_art import main as draw
R=Path(__file__).resolve().parents[1]
D=json.loads((R/'data/tea-classification-illustrations.json').read_text())
CHECK='--check' in sys.argv
E=html.escape

def image(e,locale,prefix):
 return f'<img src="{prefix}assets/tea-classification-illustrations/{e["id"]}.svg" width="300" height="160" alt="{E(e["alt"][locale],quote=True)}" loading="lazy" decoding="async">'
def card(e,locale,prefix):
 return f'<li><figure class="tea-classification-card" data-tea-classification-card="{e["id"]}">{image(e,locale,prefix)}<figcaption><strong class="tea-classification-name">{E(e["name"][locale])}</strong><span class="tea-classification-note">{E(e["note"][locale])}</span></figcaption></figure></li>'
def grid(entries,locale,prefix,cls):
 return f'<ul class="tea-classification-grid {cls}">'+''.join(card(e,locale,prefix) for e in entries)+'</ul>'
def sources(group,locale):
 return '<p class="tea-classification-sources">'+E(D['source_label'][locale])+' '+' · '.join(f'<a href="{E(s["url"],quote=True)}">{E(s["label"][locale])}</a>' for s in D[group+'_sources'])+'</p>'
def blocks(locale):
 prefix='' if locale=='en' else '../'
 t=lambda key:E(D[key][locale])
 types=f'''<section class="tea-classification-visual" data-tea-classification="types" aria-labelledby="tea-type-visual-title">
<p id="tea-type-visual-title" class="tea-classification-title">{t('type_title')}</p>
<p class="tea-classification-intro">{t('type_intro')}</p>
<p class="tea-classification-root">{t('plant_label')}</p>
{grid(D['types'],locale,prefix,'tea-type-grid')}
<p class="tea-classification-caution">{t('type_note')}</p>
{sources('type',locale)}
</section>'''
 grades=f'''<section class="tea-classification-visual" data-tea-classification="grades" aria-labelledby="tea-grade-visual-title">
<p id="tea-grade-visual-title" class="tea-classification-title">{t('grade_title')}</p>
<p class="tea-classification-intro">{t('grade_intro')}</p>
<div class="tea-grade-block">
<p class="tea-grade-title">{t('size_title')}</p><p class="tea-grade-question">{t('size_question')}</p>
{grid(D['sizes'],locale,prefix,'tea-grade-sizes')}
<p class="tea-classification-caution">{t('size_note')}</p>
</div>
<div class="tea-grade-block">
<p class="tea-grade-title">{t('method_title')}</p>
{grid(D['methods'],locale,prefix,'tea-grade-methods')}
</div>
{grid(D['other'],locale,prefix,'tea-grade-other')}
{sources('grade',locale)}
</section>'''
 return {'types':types,'grades':grades}
def main():
 draw(CHECK)
 for locale in ['en','zh-hant-hk','zh-hans']:
  f=R/('' if locale=='en' else locale)/'tea-labels.qmd';old=f.read_text();new=old
  for key,body in blocks(locale).items():
   marker=f'<!-- tea-classification:{key}:start -->\n```{{=html}}\n{body}\n```\n<!-- tea-classification:{key}:end -->\n\n'
   pattern=rf'<!-- tea-classification:{key}:start -->.*?<!-- tea-classification:{key}:end -->\n\n'
   new=re.sub(pattern,'',new,flags=re.S)
   anchor='type-map' if key=='types' else 'grades'
   heading=re.search(rf'^## .*?\{{#{anchor}\}}\n\n',new,re.M).group(0)
   new=new.replace(heading,heading+marker,1)
  if CHECK:assert old==new, f'Stale guide: {f}'
  else:f.write_text(new)
 f=R/'_quarto.yml';old=f.read_text();new=old
 if '    - assets/tea-classification-illustrations/\n' not in new:new=new.replace('    - assets/lesson-illustrations/\n','    - assets/lesson-illustrations/\n    - assets/tea-classification-illustrations/\n')
 if '      - assets/tea-classification-illustrations.css\n' not in new:new=new.replace('      - assets/tea-lesson-figures.css\n','      - assets/tea-lesson-figures.css\n      - assets/tea-classification-illustrations.css\n')
 if CHECK:assert old==new, 'Stale Quarto resources'
 else:f.write_text(new)
 print('Classification guides verified.' if CHECK else 'Added both visual guides in all three languages.')
if __name__=='__main__':main()
