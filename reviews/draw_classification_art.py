"""Original code-native process illustrations. No labels are embedded in the SVGs.
Keep equivalent labels/meaning in localized, selectable HTML alongside each image.
"""
from pathlib import Path
import math, random
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'assets/tea-classification-illustrations'
INK='#466356'; GREEN='#687e50'; DARK='#625442'; PAPER='#faf5e8'; CLAY='#b67b5b'; SAGE='#d1dbc6'; BLUE='#70938b'
def path(d,fill='none',stroke=INK,sw=2):
 return f'<path d="{d}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round"/>'
def ellipse(x,y,rx,ry,fill,stroke='none',sw=2):
 return f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{ry}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>'
def circle(x,y,r,fill,stroke='none',sw=2):return ellipse(x,y,r,r,fill,stroke,sw)
def rect(x,y,w,h,fill,rx=0,stroke=INK):return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" stroke="{stroke}" stroke-width="2"/>'
def group(s,x=0,y=0,k=1,a=0):return f'<g transform="translate({x} {y}) scale({k}) rotate({a})">{s}</g>'
def leaf(x,y,a=0,k=1,fill=GREEN,style='leaf'):
 if style=='leaf':s=path('M-22 0 Q0 -18 23 0 Q0 18 -22 0Z',fill,INK,1.2)+path('M-18 0 L19 0 M-4 0 L1 -7 M5 0 L11 6','none',INK,.9)
 elif style=='twist':s=path('M-24 0 Q-12 -7 -3 -2 Q6 4 13 -1 Q20 -5 24 -1 Q13 7 4 5 Q-4 6 -11 2 Q-19 -2 -24 0Z',fill,INK,1)
 elif style=='fragment':s=path('M-11 0 L-6 -4 2 -3 10 -5 7 2 1 5 -5 3 -9 5Z',fill,INK,.8)+path('M-8 2 L7 -2 M-1 0 L2 3','none','#b7ad8d',.7)
 return group(s,x,y,k,a)
def pile(n=13,style='twist',cx=150,cy=94,rx=72,ry=19,k=.85,fill=DARK,seed=4):
 r=random.Random(seed);s=''
 for i in range(n):
  a=i*2.399;d=math.sqrt((i+.5)/n);x=round(cx+math.cos(a)*d*rx,2);y=round(cy+math.sin(a)*d*ry,2)
  if style=='dust':s+=circle(x,y,r.uniform(.6,1.4),fill)
  elif style=='fannings':s+=group(path('M-2 -1 L1 -2 3 1 0 2 -2 0Z',fill,INK,.5),x,y,r.uniform(.7,1.3),r.randint(0,360))
  elif style=='granules':s+=circle(x,y,r.uniform(2.1,3.8),fill,INK,.7)
  else:s+=leaf(x,y,r.randint(-50,50),k*r.uniform(.8,1.1),fill,style)
 return s
def tray(x=150,y=101,rx=99,ry=29):return ellipse(x,y+6,rx,ry,SAGE)+ellipse(x,y,rx,ry,PAPER,INK)+ellipse(x,y-1,rx-9,ry-6,'#eeebd9','#bfc8b5',1)
def heat():return path('M-24 32 Q-33 21 -24 10 Q-15 -1 -24 -12 M0 32 Q-9 21 0 10 Q9 -1 0 -12 M24 32 Q15 21 24 10 Q33 -1 24 -12','none',CLAY,3)
def air():return path('M-35 0 L13 0 Q25 0 25 -10 Q25 -19 15 -19 M-27 14 L30 14 Q42 14 42 24 M-18 -13 L0 -13','none',BLUE,2.3)
def arrow(x,y):return group(path('M-11 0 L11 0 M5 -6 L11 0 L5 6','none',INK,2),x,y)
def pan():return path('M-58 -5 Q-44 31 0 31 Q44 31 58 -5Z',PAPER)+ellipse(0,-5,58,17,'#dee4cc',INK)+path('M55 -8 L86 -19 L90 -10 L58 2Z',CLAY)+leaf(-20,-9,-15,.6)+leaf(13,-3,20,.65)+leaf(2,-14,-10,.5)
def rollers():return rect(-36,-17,74,36,PAPER,17)+ellipse(-36,1,10,17,CLAY,INK)+ellipse(38,1,10,17,CLAY,INK)+path('M-24 -9 L26 -9 M-24 -1 L26 -1 M-24 7 L26 7','none','#9b9c7b',1.5)
def sprig():return path('M0 25 Q1 2 -3 -21','none',INK,2.2)+leaf(-14,1,-155,.7)+leaf(14,-10,-25,.7)+leaf(-2,-27,-88,.65)
def draw():
 a={}
 a['green']=ellipse(141,136,99,9,SAGE)+group(pan(),140,78)+group(heat(),140,114,.55)
 bundle=path('M-49 15 Q-42 -7 -30 -20 Q-1 -12 28 -22 Q45 -7 52 15 Q39 33 -2 32 Q-34 32 -49 15Z','#dcd5ad')+path('M-30 -20 Q-14 6 22 29 M28 -22 Q10 3 -22 28 M-37 12 Q0 -2 41 12','none','#918966',1.4)
 a['yellow']=ellipse(150,139,119,7,SAGE)+group(pan(),70,91,.58)+arrow(151,92)+group(bundle,225,95,.87)+group(heat(),224,53,.45)
 a['white']=tray(150,108,100,25)+leaf(95,106,-20,.8,'#929b74')+leaf(145,98,15,.85,'#a2a985')+leaf(196,109,-10,.9,'#929b74')+group(air(),139,50,1.12)+path('M64 129 L60 140 M236 129 L240 140','none',INK,2)
 basket=tray(138,101,89,25)+pile(9,'leaf',138,100,61,12,.65,GREEN)
 a['oolong']=basket+path('M43 70 Q64 49 91 55 M48 58 L43 70 L57 69 M203 132 Q222 127 228 112 M215 117 L228 112 L230 125','none',CLAY,2.3)+group(air(),170,49,.65)+leaf(236,77,25,.82)+path('M221 66 Q235 61 250 73 M223 78 Q237 89 251 79','none',CLAY,3)
 a['black']=ellipse(150,136,113,8,SAGE)+group(rollers(),72,83,.7)+leaf(62,111,-25,.65,GREEN,'twist')+arrow(145,95)+tray(222,106,52,19)+pile(8,'twist',222,102,34,9,.55,DARK)+group(air(),218,49,.7)
 heap=path('M34 119 Q58 99 73 73 Q85 52 101 65 Q114 50 130 71 Q146 97 165 119Z','#8e7960')+path('M38 115 Q67 101 78 79 Q93 69 111 78 Q128 88 158 115','none',PAPER,3)+pile(21,'fragment',99,103,40,17,.37,DARK)
 microbes=circle(230,67,39,PAPER,INK)+path('M203 63 L212 58 M218 84 L225 76 M240 46 L250 49','none',CLAY,5)+circle(241,75,4,GREEN)+circle(215,45,3,GREEN)+circle(254,67,3,GREEN)
 a['dark']=ellipse(150,137,118,8,SAGE)+heap+path('M147 79 L186 67','none','#8f9e88',1.5)+microbes
 for key,style,n,k in [('op','twist',8,1),('bop','fragment',20,.85),('fannings','fannings',95,1),('dust','dust',230,1)]:
  a[key]=tray(150,95,105,32)+pile(n,style,150,92,81,22,k,DARK)
 a['orthodox']=group(rollers(),145,52,1)+tray(150,118,92,22)+pile(10,'twist',150,115,65,12,.73,DARK)
 def toothed_roller():
  s=rect(-43,-13,86,26,PAPER,2)
  for y in [-9,-3,3,9]:s+=path(f'M-41 {y} L41 {y}','none','#8f977c',1.5)
  for x in [-43,43]:
   pts=[]
   for i in range(40):
    a=i*math.pi/20;r=1 if i%2==0 else .79;pts.append(f'{x+math.cos(a)*11*r:.2f} {math.sin(a)*16*r:.2f}')
   s+=path('M'+' L'.join(pts)+'Z',CLAY,INK,1.2)+ellipse(x,0,3,5,PAPER,INK,1)
  return s
 a['ctc']=group(toothed_roller(),150,48,.87)+group(toothed_roller(),150,77,.87)+path('M87 42 Q73 58 86 76 M77 72 L86 76 L87 67 M213 82 Q227 66 214 48 M213 57 L214 48 L224 51','none',INK,1.6)+tray(150,124,90,18)+pile(38,'granules',150,122,69,12,1,DARK)
 bag=path('M85 23 L210 23 L220 135 L75 135Z',PAPER)+path('M86 32 L209 32 M78 125 L217 125','none',INK,2)+rect(104,51,86,50,'#e8ecdf',6)+path('M119 65 L174 65 M119 77 L157 77 M119 88 L167 88','none','#8f9e88',2.2)
 a['tiers']=ellipse(150,140,91,7,SAGE)+bag
 a['shade']=path('M42 24 L258 24 L240 57 L60 57Z','#b4c1a5')+path('M62 26 L76 55 M89 26 L103 55 M116 26 L130 55 M143 26 L157 55 M170 26 L184 55 M197 26 L211 55 M224 26 L238 55 M53 40 L248 40','none',INK,1)+path('M48 25 L48 135 M252 25 L252 135','none',INK,3)+ellipse(150,136,108,8,SAGE)+group(sprig(),103,104,.8)+group(sprig(),171,109,.85)
 return {key:f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 160" width="300" height="160"><rect width="300" height="160" rx="12" fill="#e8ecdf"/>{body}</svg>\n' for key,body in a.items()}
def main(check=False):
 OUT.mkdir(exist_ok=True)
 for key,svg in draw().items():
  target=OUT/(key+'.svg')
  if check: assert target.read_text()==svg, f'Stale illustration: {key}'
  else: target.write_text(svg)
 print(('Verified' if check else 'Wrote')+' 14 original classification illustrations.')
if __name__=='__main__':
 import sys;main('--check' in sys.argv)
