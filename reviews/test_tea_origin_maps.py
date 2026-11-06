"""Projection, localization and focused preservation tests for origin-map update."""
import collections,hashlib,importlib.util,json,math,xml.etree.ElementTree as ET
from pathlib import Path
R=Path(__file__).resolve().parents[1];D=json.loads((R/'data/tea-name-gallery.json').read_text());E={e['id']:e for e in D['entries']}
spec=importlib.util.spec_from_file_location('maps',R/'reviews/draw_tea_origin_maps.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
assert list(m.LOCATORS)==['assam','darjeeling','nilgiri','yunnan','ceylon-kenyan']
sha=lambda s:hashlib.sha256(s).hexdigest()
old=json.loads((R/'data/map-data/unchanged-gallery-sha256.json').read_text())
assert len(old)==23
for id,h in old.items():
 assert sha(json.dumps(E[id],sort_keys=True,ensure_ascii=False).encode())==h['content_sha256'],id
 assert sha((R/'assets/tea-name-illustrations'/f'{id}.svg').read_bytes())==h['art_sha256'],id
expected={'assam':[93.3,26.7],'darjeeling':[88.3,27.0],'nilgiri':[76.7,11.4],'yunnan':[101.0,24.5],'ceylon-kenyan':[[80.7,7.0],[36.2,-0.4]]}
checked=0
for id,data in m.LOCATORS.items():
 assert (data['panels'][0]['point'] if 'panels' in data else data['point'])==(expected[id][0] if id=='ceylon-kenyan' else expected[id])
 for lang in m.LANGS:
  loc=E[id]['text'][lang];file=R/'assets/tea-name-illustrations'/loc['image'];tree=ET.fromstring(file.read_text())
  assert tree.attrib['{http://www.w3.org/XML/1998/namespace}lang']==lang
  assert tree.attrib['viewBox']=='0 0 240 150'
  assert not any(e.tag.rsplit('}',1)[-1] in ['script','foreignObject','image','a'] for e in tree.iter())
  assert not any('href' in k or k.startswith('on') for e in tree.iter() for k in e.attrib)
  dots=[e for e in tree.iter() if e.attrib.get('class')=='origin-dot']
  assert len(dots)==(2 if id=='ceylon-kenyan' else 1)
  panels=data.get('panels',[data]);labels=[e.text for e in tree.iter() if e.tag.endswith('text')]
  assert labels==[p['labels'][m.LANGS.index(lang)] for p in panels]
  for i,(dot,p) in enumerate(zip(dots,panels)):
   box=[10+i*115,32,105,108] if id=='ceylon-kenyan' else [12,10,216,130]
   project,b=m.projection(p['bounds'],box);x,y=project(p['point'])
   assert abs(float(dot.attrib['cx'])-x)<.011 and abs(float(dot.attrib['cy'])-y)<.011
   assert [float(dot.attrib['data-longitude']),float(dot.attrib['data-latitude'])]==p['point']
   assert box[0]+7 < x < box[0]+box[2]-7 and box[1]+7<y<box[1]+box[3]-7
  assert (R/'_site'/file.relative_to(R)).read_bytes()==file.read_bytes()
  checked+=1
# Three India maps have the same map extent/projection: west/east and north/south comparisons are meaningful.
a,d,n=(m.LOCATORS[k] for k in ['assam','darjeeling','nilgiri'])
assert a['bounds']==d['bounds']==n['bounds'] and d['point'][0]<a['point'][0] and n['point'][1]<d['point'][1]
assert checked==15
assert len(list((R/'assets/tea-name-illustrations').glob('*.svg')))==38
print(json.dumps({'passed':True,'maps_checked':15,'regional_dots':18,'unchanged_other_gallery_entries':23,'unchanged_other_illustrations':23,'political_boundary_data':False,'same_india_extent':True},indent=2))
