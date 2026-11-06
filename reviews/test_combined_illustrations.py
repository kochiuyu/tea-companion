"""Combined illustration release: preserve all existing source and validate final pages."""
from pathlib import Path
from html.parser import HTMLParser
import collections,json,re,subprocess,xml.etree.ElementTree as ET
R=Path(__file__).resolve().parents[1];BASE='9a2cba35fb4173270dd02948bb60c006a7a76556'
H=json.loads((R/'data/history-illustrations.json').read_text())
N=json.loads((R/'data/tea-name-gallery.json').read_text())
C=json.loads((R/'data/tea-classification-illustrations.json').read_text())
class_entries=sum([C[k] for k in ['types','sizes','methods','other']],[])
def stripped(s):
 s=re.sub(r'\n<!-- history-illustration:([a-z-]+):start -->\n[\s\S]*?<!-- history-illustration:\1:end -->\n','',s)
 s=re.sub(r'<!-- tea-name-gallery:([a-z]+):start -->[\s\S]*?<!-- tea-name-gallery:\1:end -->\n\n','',s)
 return re.sub(r'<!-- tea-classification:(types|grades):start -->[\s\S]*?<!-- tea-classification:\1:end -->\n\n','',s)
files=subprocess.check_output(['git','ls-tree','-r','--name-only',BASE],cwd=R).decode().splitlines();qmds=unchanged=0
for name in files:
 old=subprocess.check_output(['git','show',BASE+':'+name],cwd=R);new=(R/name).read_bytes()
 if name.endswith('.qmd'):assert stripped(new.decode()).encode()==old,name;qmds+=1
 elif name=='_quarto.yml':
  s=new.decode()
  for directory,style in [('history-illustrations','tea-history-figures'),('tea-name-illustrations','tea-name-gallery'),('tea-classification-illustrations','tea-classification-illustrations')]:s=s.replace('    - assets/'+directory+'/\n','').replace('      - assets/'+style+'.css\n','')
  assert s.encode()==old,'Only the six explicit resource/style additions are allowed'
 else:assert new==old,name;unchanged+=1
class Page(HTMLParser):
 def __init__(self,s):
  super().__init__();self.figures=[];self.figure=None;self.caption=False;self.ids=[];self.tables=0;self.regions=[];self.feed(s)
 def handle_starttag(self,t,attrs):
  a=dict(attrs)
  if 'id' in a:self.ids.append(a['id'])
  if t=='table':self.tables+=1
  if 'data-tea-classification' in a:self.regions.append(a)
  keys=['data-history-illustration','data-tea-name','data-tea-classification-card']
  if t=='figure' and any(k in a for k in keys):self.figure={'attrs':a,'images':[],'caption':''};self.figures.append(self.figure)
  if self.figure is not None and t=='img':self.figure['images'].append(a)
  if self.figure is not None and t=='figcaption':self.caption=True
 def handle_endtag(self,t):
  if t=='figure':self.figure=None
  if t=='figcaption':self.caption=False
 def handle_data(self,s):
  if self.figure is not None and self.caption:self.figure['caption']+=s
counts=collections.Counter()
def verify(page,attr,id,alt,caption,asset,width,height):
 matches=[f for f in page.figures if f['attrs'].get(attr)==id];assert len(matches)==1,(attr,id)
 f=matches[0];assert f['caption']==caption,(id,f['caption'],caption);assert len(f['images'])==1
 im=f['images'][0];assert im['alt']==alt and alt.strip()
 assert im['width']==str(width) and im['height']==str(height) and im['loading']=='lazy' and im['decoding']=='async'
 assert (file.parent/im['src']).resolve().read_bytes()==(R/asset).read_bytes(),asset
 counts[attr]+=1
for loc in ['en','zh-hant-hk','zh-hans']:
 prefix='' if loc=='en' else loc+'/'
 file=R/'_site'/prefix/'tea-labels.html';p=Page(file.read_text())
 assert p.tables==8 and len(p.ids)==len(set(p.ids))
 assert len(p.figures)==42 and [a['data-tea-classification'] for a in p.regions]==['types','grades']
 for e in N['entries']:
  l=e['text'][loc];verify(p,'data-tea-name',e['id'],l['alt'],l['name']+l['kind']+l['note'],'assets/tea-name-illustrations/'+l.get('image',e['id']+'.svg'),240,150)
 for e in class_entries:verify(p,'data-tea-classification-card',e['id'],e['alt'][loc],e['name'][loc]+e['note'][loc],'assets/tea-classification-illustrations/'+e['id']+'.svg',300,160)
 for group in ['type_sources','grade_sources']:
  for source in C[group]:assert f'href="{source["url"]}"' in file.read_text()
 for e in H['placements']:
  file=R/'_site'/prefix/e['page'].replace('.qmd','.html');p=Page(file.read_text());assert len(p.ids)==len(set(p.ids))
  verify(p,'data-history-illustration',e['id'],e['alt'][loc],e['title'][loc]+' '+e['caption'][loc],'assets/history-illustrations/'+e['id']+'.svg',760,320)
assets=[]
for d,n in [('history-illustrations',12),('tea-name-illustrations',38),('tea-classification-illustrations',14)]:
 paths=list((R/'assets'/d).glob('*.svg'));assert len(paths)==n
 for f in paths:
  tree=ET.fromstring(f.read_bytes());assert not any(e.tag.rsplit('}',1)[-1] in ['script','foreignObject','image','a'] for e in tree.iter())
  assert not any('href' in k or k.startswith('on') for e in tree.iter() for k in e.attrib)
  assert (R/'_site'/f.relative_to(R)).read_bytes()==f.read_bytes();assets.append(f)
assert len(list((R/'_site').rglob('*.html')))==108
assert counts=={'data-tea-name':84,'data-tea-classification-card':42,'data-history-illustration':36}
print(json.dumps({'passed':True,'baseline':BASE,'preserved_qmds':qmds,'unchanged_existing_other_files':unchanged,'rendered_pages':108,'feature_svg_files':len(assets),'localized_figures':dict(counts),'unchanged_existing_game_assets':True},indent=2))
