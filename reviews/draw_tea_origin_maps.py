"""Original locator designs from Natural Earth public-domain physical land.
No political boundaries. Projection: local equirectangular, north-up.
Each dot is a deliberately approximate regional locator, not an estate.
"""
from pathlib import Path
import json, math, html
R=Path(__file__).resolve().parents[1]
D=json.loads((R/'data/map-data/ne_110m_land.geojson').read_text())
OUT=R/'assets/tea-name-illustrations'
LANGS=['en','zh-hant-hk','zh-hans']
LOCATORS={
 'assam': {'point':[93.3,26.7],'bounds':[65,103,4,35],'label_point':[77.4,22.5],'labels':['India','印度','印度']},
 'darjeeling': {'point':[88.3,27.0],'bounds':[65,103,4,35],'label_point':[77.4,22.5],'labels':['India','印度','印度']},
 'nilgiri': {'point':[76.7,11.4],'bounds':[65,103,4,35],'label_point':[77.4,22.5],'labels':['India','印度','印度']},
 'yunnan': {'point':[101.0,24.5],'bounds':[82,123,6,39],'label_point':[109.5,32.0],'labels':['China','中國','中国']},
 'ceylon-kenyan': {'panels':[
  {'point':[80.7,7.0],'bounds':[75,84,4,15],'labels':['Sri Lanka','斯里蘭卡','斯里兰卡']},
  {'point':[36.2,-0.4],'bounds':[29,47,-9,9],'labels':['Kenya','肯雅','肯尼亚']}
 ]}
}
def rings():
 for f in D['features']:
  g=f['geometry'];polys=[g['coordinates']] if g['type']=='Polygon' else g['coordinates']
  for poly in polys:
   for ring in poly:yield ring
RINGS=list(rings())
def clipped_ring(points,b):
 # Sutherland-Hodgman rectangle clipping for land fill only.
 w,e,s,n=b;out=points[:-1] if points[0]==points[-1] else points
 for axis,edge,sign in [(0,w,1),(0,e,-1),(1,s,1),(1,n,-1)]:
  inp=out;out=[]
  if not inp:break
  prev=inp[-1];pi=sign*(prev[axis]-edge)>=0
  for cur in inp:
   ci=sign*(cur[axis]-edge)>=0
   if ci!=pi:
    t=(edge-prev[axis])/(cur[axis]-prev[axis]);pt=[prev[0]+t*(cur[0]-prev[0]),prev[1]+t*(cur[1]-prev[1])];out.append(pt)
   if ci:out.append(cur)
   prev,pi=cur,ci
 return out

def clipped_line(a,b,bounds):
 # Liang-Barsky coastline clipping: never strokes artificial crop boundaries.
 w,e,s,n=bounds;dx=b[0]-a[0];dy=b[1]-a[1];lo,hi=0.,1.
 for p,q in [(-dx,a[0]-w),(dx,e-a[0]),(-dy,a[1]-s),(dy,n-a[1])]:
  if p==0:
   if q<0:return None
  else:
   r=q/p
   if p<0:lo=max(lo,r)
   else:hi=min(hi,r)
   if lo>hi:return None
 return [[a[0]+lo*dx,a[1]+lo*dy],[a[0]+hi*dx,a[1]+hi*dy]]
def projection(bounds,box):
 w,e,s,n=bounds;x,y,width,height=box;c=math.cos(math.radians((s+n)/2));scale=min(width/((e-w)*c),height/(n-s));offx=x+(width-(e-w)*c*scale)/2;offy=y+(height-(n-s)*scale)/2
 project=lambda p:(offx+(p[0]-w)*c*scale,offy+(n-p[1])*scale)
 # Expand the geographic crop to the entire panel rather than treating padding as sea.
 visible=[w-(offx-x)/(c*scale),e+(offx-x)/(c*scale),s-(offy-y)/scale,n+(offy-y)/scale]
 return project,visible
def fmt(p):return f'{p[0]:.2f} {p[1]:.2f}'
def panel(data,box,lang,index,small=False):
 x,y,w,h=box;proj,bounds=projection(data['bounds'],box);fill=[];coast=[]
 for ring in RINGS:
  cr=clipped_ring(ring,bounds)
  if len(cr)>2:fill.append('M'+' L'.join(fmt(proj(p)) for p in cr)+' Z')
  for a,b in zip(ring,ring[1:]):
   line=clipped_line(a,b,bounds)
   if line:coast.append('M'+fmt(proj(line[0]))+' L'+fmt(proj(line[1])))
 id=f'panel-{index}';s=f'<defs><clipPath id="{id}"><rect x="{x}" y="{y}" width="{w}" height="{h}" rx="7"/></clipPath></defs>'
 s+=f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="7" fill="#e7efeb"/>'
 s+=f'<g clip-path="url(#{id})"><path d="{" ".join(fill)}" fill="#d3dcc2" fill-rule="evenodd"/><path d="{" ".join(coast)}" fill="none" stroke="#687d63" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></g>'
 if 'label_point' in data:
  px,py=proj(data['label_point']);s+=f'<text x="{px:.2f}" y="{py:.2f}" fill="#395448" font-family="system-ui,sans-serif" font-size="17" font-weight="600" text-anchor="middle">{html.escape(data["labels"][LANGS.index(lang)])}</text>'
 px,py=proj(data['point']);rr=4.8 if small else 5.8
 s+=f'<circle class="origin-halo" cx="{px:.2f}" cy="{py:.2f}" r="{rr+3}" fill="#faf5e8"/><circle class="origin-dot" data-longitude="{data["point"][0]}" data-latitude="{data["point"][1]}" cx="{px:.2f}" cy="{py:.2f}" r="{rr}" fill="#a75b3c" stroke="#633d2b" stroke-width="1.2"/>'
 s+=f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="7" fill="none" stroke="#a9b9a5" stroke-width="1"/>'
 return s

def draw(id,lang):
 d=LOCATORS[id];s='<rect width="240" height="150" fill="#e8ecdf"/>'
 if 'panels' in d:
  for i,p in enumerate(d['panels']):
   x=10+i*115;s+=f'<text x="{x+52.5}" y="24" text-anchor="middle" font-family="system-ui,sans-serif" font-size="15" font-weight="600" fill="#395448">{html.escape(p["labels"][LANGS.index(lang)])}</text>'
   s+=panel(p,[x,32,105,108],lang,i,True)
 else:s+=panel(d,[12,10,216,130],lang,0)
 return f'<svg xmlns="http://www.w3.org/2000/svg" xml:lang="{lang}" viewBox="0 0 240 150" width="240" height="150">{s}</svg>\n'
def main():
 for id in LOCATORS:
  for lang in LANGS:
   suffix='' if lang=='en' else '.'+lang
   (OUT/f'{id}{suffix}.svg').write_text(draw(id,lang))
 print('Wrote 5 origin locator designs × 3 localized maps; no political boundaries.')
if __name__=='__main__':main()
