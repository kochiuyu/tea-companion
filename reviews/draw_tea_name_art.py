"""Original, deterministic SVG illustrations in Tea Companion's existing palette.
These are code-native schematic drawings, not photographs or an identification key.
"""
from pathlib import Path
import math, random
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'assets/tea-name-illustrations'
OUT.mkdir(exist_ok=True)
INK='#466356'; GREEN='#647849'; DARK='#5c5043'; OLIVE='#8b8c56'; PAPER='#faf5e8'; TERRACOTTA='#b67b5b'
def path(d, fill='none', stroke=INK, sw=1.5, extra=''):
 return f'<path d="{d}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round" {extra}/>'
def ellipse(cx,cy,rx,ry,fill,stroke='none',sw=1.5):
 return f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>'
def circle(x,y,r,fill,stroke='none',sw=1.5):
 return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>'
def rect(x,y,w,h,fill,rx=0,stroke=INK):
 return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" stroke="{stroke}" stroke-width="1.6"/>'
def leaf(x,y,angle=0,scale=1,fill=GREEN,style='flat'):
 if style=='flat':
  p=path('M-23 0 Q-7 -7 22 0 Q3 8 -23 0Z',fill,INK,.8)+path('M-19 0 L18 0','none',INK,.7)
 elif style=='twist':
  p=path('M-23 0 Q-10 -8 -4 -2 Q3 5 10 -1 Q16 -5 23 -2 Q15 6 9 6 Q0 9 -7 3 Q-13 -1 -23 0Z',fill,INK,.8)
 elif style=='needle':
  p=path('M-25 0 Q-1 -2 24 1 Q0 4 -25 0Z',fill,INK,.65)
 elif style=='flake':
  p=path('M-12 -7 L-2 -11 12 -7 15 0 7 8 -6 6 -14 0Z',fill,INK,.8)+path('M-8 2 L7 -4','none',INK,.5)
 elif style=='ball':
  p=path('M-10 -2 Q-8 -10 -2 -8 Q6 -12 10 -5 Q16 1 7 8 Q0 13 -6 7 Q-13 5 -10 -2Z',fill,INK,1)+path('M-5 -4 Q7 -8 6 2 Q2 7 -2 2 Q-4 -2 2 -3','none',INK,.8)
 elif style=='bud':
  p=path('M-22 1 Q0 -9 23 -1 Q7 8 -22 1Z',fill,INK,.8)+path('M-15 0 L17 0','none','#dadac3',2.2)+path('M-12 -2 L-10 -4 M-4 -3 L-1 -5 M6 -3 L8 -5 M-6 3 L-4 5 M5 3 L7 5','none','#ebead8',1)
 return f'<g transform="translate({x} {y}) rotate({angle}) scale({scale})">{p}</g>'
def plate(cx=120,cy=88,rx=90,ry=36):
 return ellipse(cx,cy+7,rx,ry,'#d1dbc6')+ellipse(cx,cy,rx,ry,PAPER,INK)+ellipse(cx,cy-2,rx-10,ry-7,'#f0efdf','#c1c9b6',1)
def pile(style='twist',fill=GREEN,seed=1,cx=120,cy=85,n=11,scale=.75):
 rng=random.Random(seed); s=''
 for i in range(n):
  a=i*2.399; r=math.sqrt((i+.5)/n)
  x=cx+math.cos(a)*r*60; y=cy+math.sin(a)*r*19
  s+=leaf(round(x,1),round(y,1),rng.randint(-60,60),scale*rng.uniform(.8,1.2),fill,style)
 return s
def sample(style='twist',fill=GREEN,seed=1,n=11):return plate()+pile(style,fill,seed,n=n)
def blank_tag():
 return path('M169 47 L208 47 L219 60 L208 73 L169 73Z',PAPER,INK,1.6)+circle(208,60,3,'#d1dbc6',INK,1)+path('M175 39 C175 22 197 22 197 39 C197 47 186 57 186 57 C186 57 175 47 175 39Z',TERRACOTTA,INK)+circle(186,38,4,PAPER,INK,1)
def origin():return plate(98,94,75,28)+pile('twist',DARK,29,92,91,9,.65)+blank_tag()
def blossom():
 s=''
 for i in range(6):
  a=i*math.pi/3; x=190+math.cos(a)*10;y=58+math.sin(a)*10
  s+=f'<ellipse cx="{x:.1f}" cy="{y:.1f}" rx="6" ry="10" fill="{PAPER}" stroke="{INK}" stroke-width="1" transform="rotate({i*60+90} {x:.1f} {y:.1f})"/>'
 return path('M190 77 Q195 86 190 94','none',INK,2)+leaf(198,83,25,.32,GREEN)+s+circle(190,58,4,'#c4a663',INK,1)
def cup(cx=115,cy=75,tea='#b77b46',wide=1):
 return '<g transform="translate('+str(cx)+' '+str(cy)+') scale('+str(wide)+')">'+ellipse(0,40,64,12,PAPER,INK)+path('M40 -5 C76 -12 76 27 42 26 L40 15 C63 17 63 1 42 5Z',PAPER,INK,2)+path('M-44 -12 Q-40 41 0 41 Q40 41 44 -12Z',PAPER,INK,2)+ellipse(0,-12,44,12,PAPER,INK)+ellipse(0,-12,36,7,tea,INK,1)+path('M-28 8 Q-26 25 -15 28','none','#d1dbc6',3)+'</g>'
def main():
 arts={}
 arts['longjing']=sample('flat',GREEN,1,9)
 arts['jasmine-green']=plate(95,92,73,28)+pile('twist',GREEN,4,91,89,9,.62)+blossom()
 arts['gunpowder']=sample('ball',GREEN,4,23)
 arts['tieguanyin']=sample('ball','#7c8956',6,10)
 arts['baozhong']=sample('twist',GREEN,8,8)
 arts['da-hong-pao']=sample('twist',DARK,12,8)
 arts['keemun']=plate()+pile('twist',DARK,13,n=17,scale=.6)
 for id in ['yunnan','assam','darjeeling','ceylon-kenyan','nilgiri']:arts[id]=origin()
 arts['lapsang-souchong']=plate(95,94,73,28)+pile('twist',DARK,14,91,91,9,.65)+path('M176 83 C161 71 192 65 179 49 C167 36 186 30 182 20 M194 89 C183 78 204 70 199 59 M209 66 C199 56 216 47 210 38','none','#7b8a7a',2.3)
 cake=ellipse(87,96,48,22,DARK,INK,2)+ellipse(87,86,48,22,'#84705b',INK,2)+ellipse(87,86,4,2,DARK)
 for i in range(29):
  a=i*2.399; r=math.sqrt((i+.5)/29); x=87+math.cos(a)*r*42; y=86+math.sin(a)*r*18
  cake+=path(f'M{x:.1f} {y:.1f} l5 -2 l3 2','none','#4f4c3c',1)
 arts['puerh-dark']=ellipse(121,117,94,10,'#d1dbc6')+cake+pile('twist',DARK,15,174,99,7,.55)
 arts['white-tea']=plate()+pile('flake','#8a8c68',16,n=6,scale=.85)+leaf(80,91,-25,.85,'#c1c3a6','bud')+leaf(112,75,15,.95,'#c1c3a6','bud')+leaf(149,94,-12,.85,'#c1c3a6','bud')
 arts['yellow-tea']=sample('flat',OLIVE,17,7)+leaf(108,78,22,.8,'#b4b27d','bud')
 arts['sencha']=plate()+pile('needle',GREEN,19,n=20,scale=.85)
 powder=ellipse(68,107,45,16,PAPER,INK)+path('M35 105 Q51 98 58 89 Q64 80 73 90 Q80 95 100 106Z','#7e9b50',INK,1.4)+circle(47,111,1.2,GREEN)+circle(88,112,1.4,GREEN)
 bowl=path('M126 78 Q126 116 171 116 Q216 116 216 78Z',PAPER,INK,2)+ellipse(171,78,45,14,'#839e55',INK,2)+path('M144 76 Q160 68 181 75 Q196 82 201 76 M148 82 Q173 91 192 81','none','#bdce8e',2)+circle(160,74,1.3,PAPER)+circle(181,82,1,PAPER)
 arts['matcha']=ellipse(124,124,94,8,'#d1dbc6')+powder+bowl
 arts['gyokuro']=plate()+pile('needle','#506b42',19,n=20,scale=.85)
 arts['tencha']=sample('flake','#61814c',20,14)
 arts['genmaicha']=plate()+pile('needle',GREEN,21,n=12,scale=.7)
 for i in range(17):
  a=i*2.399;r=math.sqrt((i+.5)/17);x=120+math.cos(a)*r*62;y=86+math.sin(a)*r*21
  arts['genmaicha']+=f'<g transform="translate({x:.1f} {y:.1f}) rotate({i*37%180})">'+ellipse(0,0,5,3,'#cba068','#8b7049',.8)+path('M-2 0 L2 0','none','#886947',.6)+'</g>'
 arts['houjicha']=plate()+pile('twist','#936d48',22,n=9,scale=.8)+path('M78 79 l15 8 M116 102 l17 -7 M143 75 l19 5 M101 71 l9 9','none','#bb9c69',3.6)
 arts['english-breakfast']=plate()+pile('twist',DARK,24,n=10,scale=.7)
 for x,y in [(62,89),(96,71),(111,99),(145,84),(164,97),(136,68)]:arts['english-breakfast']+=circle(x,y,2.3,DARK)
 bergamot=path('M185 46 C170 45 162 60 169 74 C171 88 195 92 204 78 C216 64 204 48 192 48Z','#a3a35e',INK,1.7)+leaf(194,42,-20,.45,GREEN)+path('M185 40 L187 49','none',INK,2)+path('M177 56 Q170 65 176 72','none','#c5c278',2)
 arts['earl-grey']=plate(93,96,73,28)+pile('twist',DARK,25,88,93,9,.62)+bergamot
 cinnamon=path('M164 111 L191 99 L196 106 L169 119Z',TERRACOTTA,'#7a5941',1.4)+path('M169 114 L192 104','none','#7a5941',1.1)+ellipse(168,115,4,3,'#d1a078','#7a5941',1)
 pod=lambda x,y,a: f'<g transform="translate({x} {y}) rotate({a})">'+ellipse(0,0,8,5,'#99a16b',INK,1)+path('M-6 0 Q0 -4 6 0 M-6 0 Q0 4 6 0 M-6 0 L6 0','none',INK,.7)+'</g>'
 arts['masala-chai']=cup(103,71,'#c19a6d',.95)+cinnamon+pod(192,120,-20)+pod(209,112,-55)
 arts['milk-tea']=cup(111,70,'#b78250',1.1)
 boba=ellipse(120,132,52,7,'#d1dbc6')+path('M90 37 L96 124 Q120 134 144 124 L150 37Z','#e8e5ce',INK,2)+path('M93 59 L98 122 Q120 130 142 122 L147 59Z','#c29a70','none')+ellipse(120,59,27,6,'#cfad82',INK,1)+path('M125 69 L137 16 L146 18 L133 72Z','#91a89a',INK,1.5)
 for x,y in [(105,116),(118,121),(134,116),(110,105),(126,107),(137,103),(103,95)]:boba+=circle(x,y,4.5,DARK,'#504e40',1)
 arts['boba']=boba+ellipse(120,37,30,7,'none',INK,2)+path('M98 70 L101 89','none',PAPER,3)
 packet=path('M155 32 L196 32 L201 92 L150 92Z',PAPER,INK,1.7)+path('M155 39 L196 39 M152 85 L200 85','none',INK,1.3)+rect(163,50,25,23,'#e8ecdf',4)
 arts['decaf']=packet+plate(93,102,70,25)+pile('twist',DARK,29,87,99,9,.6)
 assert len(arts)==28
 for id,s in arts.items():
  svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 150" width="240" height="150"><rect width="240" height="150" fill="#e8ecdf"/>'+s+'</svg>\n'
  (OUT/(id+'.svg')).write_text(svg)
 from draw_tea_origin_maps import main as draw_origin_maps
 draw_origin_maps()
 print('Wrote 28 illustrated entries, with localized origin maps.')
if __name__=='__main__':main()
