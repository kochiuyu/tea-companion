"""Draw three original static teaching schematics. Tokens are symbols, not structures."""
from pathlib import Path
R=Path(__file__).resolve().parents[1]
OUT=R/'assets/tea-compound-illustrations'
OUT.mkdir(exist_ok=True)
ink='#294b43'
def path(d,fill='none',stroke=ink,w=3,extra=''):
    return f'<path d="{d}" fill="{fill}" stroke="{stroke}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round" {extra}/>'
def circle(x,y,r,fill,stroke='none',w=2,extra=''):
    return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{fill}" stroke="{stroke}" stroke-width="{w}" {extra}/>'
def rect(x,y,w,h,fill,rx=0,stroke='none',sw=2,extra=''):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" {extra}/>'
def ellipse(x,y,rx,ry,fill,extra=''):
    return f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{ry}" fill="{fill}" {extra}/>'
def num(n,x,y,fill=ink):
    # Numerals intentionally shared across locales. The matching legend is real HTML.
    return circle(x,y,25,fill)+f'<text x="{x}" y="{y+10}" text-anchor="middle" fill="#fffdf7" font-family="Arial, sans-serif" font-size="29" font-weight="700">{n}</text>'
def leaf(x,y,s=1,angle=0):
    return f'<g transform="translate({x} {y}) rotate({angle}) scale({s})">'+path('M0 0 C-50 -8 -78 -60 -62 -110 C-10 -92 25 -54 0 0Z','#7eaa80',ink,2)+path('M0 0 L-53 -92 M-15 -27 L-43 -40 M-25 -45 L-16 -66 M-36 -64 L-57 -74',w=1.5)+'</g>'
def svg(name,bg,art):
    # Descriptive localized alternatives are supplied on each embedding <img>.
    body=f'<svg xmlns="http://www.w3.org/2000/svg" width="720" height="340" viewBox="0 0 720 340">'+rect(0,0,720,340,bg)+circle(670,20,180,'#ffffff',extra='opacity=".28"')+path('M28 303 H692',stroke='#cfd9cc',w=1)+art+'</svg>\n'
    (OUT/(name+'.svg')).write_text(body)
# Caffeine: receptor occupancy; the unbound adenosine token is not destroyed.
s=''
s+=ellipse(355,279,214,17,'#d8dfd1')
s+=rect(110,207,490,62,'#c6d7c7',31)
s+=path('M110 224 H600 M110 252 H600',stroke='#9ab69e',w=2)
# Receptor inset rises from membrane. Pocket fits one symbolic token.
s+=path('M263 253 V151 Q263 123 292 123 H309 V153 Q309 188 350 188 Q391 188 391 153 V123 H408 Q437 123 437 151 V253Z','#f8f5e7',ink,3.5)
s+=path('M282 242 V155 Q282 143 293 143 M418 242 V155 Q418 143 407 143',stroke='#b8c9b4',w=3)
# Caffeine: ochre hexagon in pocket.
s+=path('M350 98 L380 115 V150 L350 169 L320 150 V115Z','#dfb45e',ink,3)
s+=path('M331 127 L350 116 L369 127 M350 154 V136',stroke='#f9e8bc',w=3)
s+=num(1,405,80)
s+=path('M388 99 L372 112',stroke=ink,w=1.5)
# Adenosine: distinct round token and unsuccessful approach ending before occupied site.
s+=circle(153,110,37,'#96b8a2',ink,3)
s+=circle(153,110,18,'#dceadd',ink,2)
s+=num(2,110,64)
s+=path('M122 77 L136 89',w=1.5)
s+=path('M198 112 C237 105 271 104 295 119',stroke='#65897a',w=3,extra='stroke-dasharray="5 8"')
s+=path('M290 107 L299 124 L282 128',stroke='#65897a',w=2)
s+=path('M301 105 L301 138',stroke='#9f624d',w=4)
s+=num(3,508,172)
s+=path('M493 180 L437 201',w=1.5)
# Quiet botanical context, separate from the mechanism.
s+=leaf(641,276,.51,25)+leaf(649,279,.4,72)
svg('caffeine','#f5eedc',s)
# Theanine: paired study ingredients and an attention task; no guaranteed result.
s=''
s+=ellipse(211,282,151,13,'#d6e0d8')+ellipse(555,290,112,10,'#d6e0d8')
s+='<g transform="rotate(-7 145 170)">'+rect(69,76,149,191,'#fffdf7',15,ink,2.5)+rect(89,95,75,7,'#b4c7b9',3)+rect(89,111,104,5,'#dce4d9',2)
s+=path('M145 144 L174 160 L174 194 L145 210 L116 194 L116 160Z','#8fb8aa',ink,2.5)+circle(145,177,13,'#e7f0e7',ink,1.5)
s+=path('M99 236 H187',stroke='#b6c9bc',w=2)+'</g>'
s+=num(1,70,65)
s+='<g transform="rotate(7 301 175)">'+rect(242,114,117,152,'#fffdf7',12,ink,2.5)+rect(260,131,77,6,'#cfc8af',3)
s+=path('M301 158 L326 172 V201 L301 216 L276 201 V172Z','#dfb45e',ink,2.5)+path('M284 181 L301 171 L318 181',stroke='#f9e8bc',w=2.5)
s+=path('M267 242 H334',stroke='#cfc8af',w=2)+'</g>'
s+=num(2,348,102)
s+=path('M220 175 V197 M209 186 H231',stroke='#6b897c',w=3)
s+=path('M381 187 C414 187 428 183 448 174',stroke='#6b897c',w=3,extra='stroke-dasharray="4 8"')
s+=path('M438 168 L452 173 L445 186',stroke='#6b897c',w=2)
# Clipboard with shapes to be discriminated, not ticks/correct answers.
s+='<g transform="rotate(4 551 173)">'+rect(461,68,180,213,'#f9fbf4',13,ink,3)+rect(505,55,92,26,'#b3c9b8',8,ink,2)
s+=rect(480,98,92,7,'#a7bcae',3)+rect(480,114,140,4,'#d3ded1',2)
for row in range(3):
 for col in range(3):
  x=499+col*48;y=145+row*45
  if (row+col)%3==0:s+=circle(x,y,10,'#e3b967',ink,1.6)
  elif (row+col)%3==1:s+=path(f'M{x} {y-11} L{x+11} {y} L{x} {y+11} L{x-11} {y}Z','#8fb8aa',ink,1.6)
  else:s+=rect(x-9,y-9,18,18,'#fffdf7',3,ink,1.6)
s+='</g>'+num(3,659,69)
s+=path('M645 79 L631 90',w=1.5)
s+='<g transform="rotate(24 657 226)">'+rect(653,157,8,101,'#ddad5a',3,ink,1.5)+path('M653 259 L657 273 L661 259Z','#f9edd0',ink,1.5)+'</g>'
svg('l-theanine','#eaf1e8',s)
# EGCG: leaf and brewed mixture, with an explicitly symbolic magnified marker.
s=''
s+=ellipse(169,282,94,11,'#d0dfc8')+ellipse(526,284,131,13,'#d0dfc8')
s+=path('M121 269 C151 241 174 207 181 163',stroke='#557a58',w=5)
s+=leaf(177,209,1.3,3)+leaf(150,244,.86,-65)+leaf(181,186,.67,88)
s+=num(1,91,79)+path('M106 88 L129 106',w=1.5)
# Pour/extraction direction does not point to any body or blood symbol.
s+=path('M246 225 C298 254 347 261 398 242',stroke='#6b897c',w=3,extra='stroke-dasharray="5 8"')
s+=path('M386 236 L402 241 L393 253',stroke='#6b897c',w=2)
# Tea cup, amber mixture.
s+=path('M580 181 H602 C643 182 645 236 604 237 H584',fill='none',stroke=ink,w=10)
s+=path('M580 181 H602 C643 182 645 236 604 237 H584',fill='none',stroke='#fbf8eb',w=5)
s+=path('M435 174 L446 244 Q451 272 514 274 Q575 272 582 244 L594 174Z','#f9f7e9',ink,3)
s+=ellipse(514,175,80,22,'#fffdf5',extra='stroke="'+ink+'" stroke-width="3"')
s+=ellipse(514,176,69,15,'#d3a758')
s+=path('M460 209 Q463 243 483 251',stroke='#e0e4d1',w=5)
s+=path('M499 144 C489 130 508 119 499 105 M527 143 C517 128 536 116 528 101',stroke='#92a48c',w=2)
s+=num(2,640,276)+path('M624 275 L581 260',w=1.5)
# Magnifier and repeated symbolic EGCG token.
s+=path('M401 156 L443 200',stroke=ink,w=13)+path('M401 156 L443 200',stroke='#a7c2a3',w=7)
s+=circle(355,105,69,'#f8fbef',ink,4)+circle(355,105,57,'#e5efda','#a9c29d',1.5)
s+=path('M355 70 L386 88 V123 L355 141 L324 123 V88Z','#90b984',ink,2.5)
s+=path('M339 102 L355 93 L371 102 L355 115Z','#e5f0d7',ink,1.7)
s+=num(3,420,44)+path('M406 54 L393 68',w=1.5)
s+=path('M511 169 L517 173 V180 L511 184 L505 180 V173Z','#7d9c60',ink,1.3)
svg('egcg','#edf1df',s)
print('Drew three original teaching schematics.')
