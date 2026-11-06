"""Original, text-free SVG vessel studies; localized descriptions live in HTML."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets/tea-brewing-illustrations'
INK = '#384d43'

def path(d, fill='none', stroke=INK, width=2, extra=''):
    return f'<path d="{d}" fill="{fill}" stroke="{stroke}" stroke-width="{width}" stroke-linecap="round" stroke-linejoin="round" {extra}/>'

def ellipse(cx, cy, rx, ry, fill, stroke='none', width=2, extra=''):
    return f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="{fill}" stroke="{stroke}" stroke-width="{width}" {extra}/>'

def leaf(x, y, scale=1, angle=0, color='#687647'):
    return f'<g transform="translate({x} {y}) rotate({angle}) scale({scale})">' + path('M-12 0 Q-4 -9 12 0 Q1 9 -12 0', color, color, 1) + path('M-10 0 Q0 -1 10 0', stroke='#a2a878', width=.8) + '</g>'

def shadow(cx, cy, rx, ry):
    return ellipse(cx, cy, rx, ry, '#576a45', extra='opacity=".10"')

def steam(x, y):
    return path(f'M{x} {y} c-8 -8 9 -13 2 -23', stroke='#b5bdaa', width=2)

def cup(x, y, scale=1, fill='#f8f5e9', tea='#c48d41'):
    return f'<g transform="translate({x} {y}) scale({scale})">' + shadow(0,29,23,5) + path('M-22 0 Q-19 27 -9 28 H9 Q19 25 22 0Z',fill) + ellipse(0,0,22,7,fill,INK) + ellipse(0,1,17,4,tea) + path('M-13 10 Q-10 16 -9 19',stroke='#fffdf7',width=3) + '</g>'

def canvas(body, background='#f0f1e5'):
    return ('<svg xmlns="http://www.w3.org/2000/svg" width="360" height="200" viewBox="0 0 360 200">'
            f'<rect width="360" height="200" fill="{background}"/>'
            '<circle cx="286" cy="41" r="64" fill="#ffffff" opacity=".28"/>'
            '<path d="M22 172H338" stroke="#d5dcc7" stroke-width="1"/>' + body + '</svg>\n')

def mug(x, basket=False):
    b = shadow(x,171,47,7)
    b += path(f'M{x+31} 93 C{x+79} 81 {x+76} 147 {x+35} 141 L{x+35} 129 C{x+60} 134 {x+62} 101 {x+34} 106Z','#dfE6d4')
    b += path(f'M{x-40} 86 L{x-35} 153 Q{x-33} 169 {x} 169 Q{x+33} 169 {x+35} 153 L{x+40} 86Z','#edf0e2')
    b += ellipse(x,86,40,12,'#f9f8ef',INK)
    b += ellipse(x,87,33,8,'#cc9b51')
    b += path(f'M{x-29} 104 L{x-27} 147 Q{x-26} 152 {x-21} 153',stroke='#fffdf7',width=4)
    if basket:
        b += path(f'M{x-23} 87 L{x-19} 126 Q{x} 135 {x+19} 126 L{x+23} 87Z','#e1d7af','#6d7a65',1.5, 'opacity=".9"')
        for yy in [95,103,111,119]:
            b += path(f'M{x-19} {yy} Q{x} {yy+5} {x+19} {yy}',stroke='#839077',width=1)
        for xx in [-12,-4,4,12]:
            b += path(f'M{x+xx} 89 L{x+xx*.8} 127',stroke='#839077',width=1)
        b += ellipse(x,85,24,7,'#e4dfc3','#687662',1.5)
        b += ellipse(x,85,19,4,'#b58f49')
        b += path(f'M{x-23} 85 H{x-47} M{x+23} 85 H{x+47}',stroke=INK,width=3)
        b += leaf(x-5,85,.45,15,'#606747') + leaf(x+8,84,.35,-20,'#606747')
    else:
        b += path(f'M{x-13} 102 L{x-6} 96 H{x+8} L{x+15} 102 L{x+12} 129 Q{x} 132 {x-11} 129Z','#ddcc9d','#777356',1.5)
        b += path(f'M{x-8} 108 H{x+9} M{x-8} 114 H{x+9} M{x-7} 120 H{x+8}',stroke='#b0a078',width=1,extra='stroke-dasharray="2 3"')
        b += path(f'M{x+1} 96 Q{x+8} 68 {x+27} 80 Q{x+41} 86 {x+40} 105',stroke='#777356',width=1.5)
        b += path(f'M{x+31} 106 H{x+49} V125 H{x+31}Z','#b8814b',INK,1.4)
        b += ellipse(x+40,110,1.3,1.3,'#eee4c7')
    return b + steam(x-6,65)

def western():
    b = shadow(153,166,84,10) + shadow(288,173,48,7)
    b += path('M213 75 C283 59 282 151 215 146 L212 132 C257 144 260 80 216 91Z','#e3e7d7')
    b += path('M101 109 C72 108 67 89 54 79 L40 78 Q52 119 101 140Z','#e9ecdf')
    b += path('M40 78 Q46 72 56 79',stroke=INK,width=2.2)
    b += path('M112 68 C91 85 86 113 98 140 Q106 161 160 163 Q215 164 223 137 C236 110 217 78 200 68Z','#f7f5e8')
    b += path('M112 137 Q148 153 213 141',stroke='#cbd4bb',width=6)
    b += path('M116 86 Q103 108 110 126',stroke='white',width=5)
    b += path('M113 68 Q122 48 158 48 Q190 48 200 68Z','#e2e8d4')
    b += ellipse(156,67,46,7,'#e9ecdd',INK)
    b += ellipse(157,44,8,5,'#b6c6a5',INK)
    b += path('M125 84 Q157 94 191 83',stroke='#a5b78e',width=2)
    b += leaf(157,114,.9,-10,'#a7b68e')
    b += cup(275,151,.76) + cup(320,158,.65)
    return b + steam(137,35) + steam(173,33)

def gaiwan():
    b = shadow(179,173,91,9)
    b += ellipse(180,158,88,15,'#d5dfc7',INK)
    b += ellipse(180,155,72,10,'#edf0e2','#a8b89a',1.5)
    b += path('M125 98 Q133 151 162 158 H198 Q227 149 235 98Z','#fbf8ec')
    b += path('M161 155 V164 Q180 169 199 164 V155', '#e1e7d4', INK, 1.5)
    b += ellipse(180,98,55,15,'#fdfbf2',INK)
    b += ellipse(180,99,45,10,'#d2a754')
    b += path('M140 116 Q148 138 160 141',stroke='#e2e8d5',width=5)
    b += '<g transform="rotate(-9 176 61)">'
    b += path('M124 67 Q138 42 179 42 Q215 42 229 67Z','#e8eddc')
    b += ellipse(176,67,55,8,'#f9f8ee',INK)
    b += ellipse(179,39,10,5,'#d5e0c6',INK)
    b += path('M139 58 Q175 48 214 59',stroke='#b5c59f',width=1.5) + '</g>'
    b += path('M130 105 Q178 117 228 105',stroke='#ecd2a0',width=2)
    return b

def little_pot(x, y, scale, clay):
    color, light, edge = ('#b87955','#d7a682','#684738') if clay else ('#f3f4e9','#fffdf4',INK)
    b = f'<g transform="translate({x} {y}) scale({scale})">'
    b += shadow(0,37,61,8)
    b += path('M37 -11 C83 -28 82 38 40 27 L39 17 C66 27 66 -13 40 0Z',color,edge)
    b += path('M-40 6 C-58 4 -61 -13 -72 -14 L-80 -12 Q-72 18 -43 24Z',color,edge)
    b += path('M-33 -19 C-49 -8 -53 21 -32 32 Q0 44 34 30 C55 15 44 -10 30 -19Z',color,edge)
    b += path('M-31 -18 Q-20 -33 0 -33 Q23 -33 31 -18Z',color,edge)
    b += ellipse(0,-18,33,5,light,edge,1.5)
    b += ellipse(0,-36,6,4,color,edge,1.5)
    b += path('M-31 -6 Q-41 8 -31 18',stroke=light,width=3)
    if not clay:
        b += path('M-29 20 Q0 29 29 20',stroke='#9db08b',width=3)
    b += '</g>'
    return b

def gongfu():
    b = '<rect x="37" y="147" width="287" height="23" rx="11" fill="#dce2cf"/>'
    b += little_pot(109,89,.85,True) + little_pot(264,88,.85,False)
    b += cup(82,145,.57,'#cc9370','#bb8744') + cup(126,152,.57,'#cc9370','#bb8744')
    b += cup(241,145,.57) + cup(285,152,.57)
    return b

def grandpa():
    b = shadow(169,173,42,8)
    b += path('M130 58 L138 164 Q169 176 201 164 L210 58Z','#e7eee3',INK,2)
    b += path('M134 88 L140 161 Q169 172 198 161 L207 88Z','#d7cd87','none')
    b += ellipse(170,88,36,9,'#e9dea3','#c1b977',1)
    b += leaf(156,148,.85,26) + leaf(177,158,.9,-18) + leaf(185,136,.65,69) + leaf(152,115,.7,-42) + leaf(182,102,.6,20)
    b += ellipse(170,58,40,12,'#f6f8ef',INK)
    b += ellipse(170,58,32,8,'#e2eadd','#b3c3b0',1)
    b += path('M141 72 L148 155 M198 72 L194 121',stroke='#ffffff',width=4,extra='opacity=".65"')
    b += path('M137 164 Q171 177 201 164',stroke='#a5b99f',width=3)
    b += '<g transform="rotate(-18 273 44)">'
    b += path('M246 24 L293 24 L292 66 Q272 79 250 66Z','#e4e9dc')
    b += path('M291 34 Q317 28 315 49 Q312 62 293 57',stroke=INK,width=7)
    b += path('M291 34 Q317 28 315 49 Q312 62 293 57',stroke='#d9e2cf',width=3)
    b += path('M245 29 L228 36 L251 45', '#e4e9dc')
    b += ellipse(270,24,24,7,'#f7f8ee',INK) + '</g>'
    b += path('M225 52 Q200 44 185 68',stroke='#7da5a4',width=3)
    b += path('M222 58 Q202 52 192 72',stroke='#a4c0bc',width=2)
    b += ellipse(187,75,3,2,'#a4c0bc')
    return b

def matcha():
    b = shadow(143,171,88,9) + shadow(282,169,37,5)
    b += path('M64 108 Q75 162 116 166 H172 Q210 159 222 108Z','#b7c2a0')
    b += path('M116 160 V172 Q145 178 172 172 V160', '#8b9e79', INK, 1.5)
    b += ellipse(143,108,79,25,'#e7e9d8',INK)
    b += ellipse(143,111,65,18,'#82964d','#6e8244',1.5)
    b += path('M93 109 Q113 98 139 102 M153 119 Q178 122 193 111',stroke='#a9bc72',width=3)
    for x,y,r in [(121,108,2.4),(130,115,1.6),(151,108,2.2),(163,114,2),(176,104,1.7),(113,116,1.2),(156,120,1.1),(141,106,1.4)]:
        b += ellipse(x,y,r,r,'#c2d098')
    b += path('M80 131 Q92 150 110 153',stroke='#d9dfc7',width=5)
    b += '<g transform="rotate(13 281 104)">'
    b += path('M270 40 Q281 37 292 40 L292 99 H270Z','#dbbb7e','#796446',1.7)
    b += ellipse(281,40,11,3,'#f0d49c','#796446',1.4)
    b += path('M273 46 V91 M278 45 V91 M285 45 V91 M289 46 V91',stroke='#b48f55',width=1)
    b += path('M269 94 H293 V102 H269Z','#806849','#66513a',1.3)
    b += path('M270 103 Q253 130 251 151 Q281 165 311 151 Q307 126 292 103Z','#ead2a0','#94764b',1.2)
    for offset in [-27,-21,-15,-9,-3,3,9,15,21,27]:
        start=281+offset*.36;end=281+offset
        b += path(f'M{start} 103 Q{281+offset*.85} 126 {end} 150 Q{end+(-2 if offset>0 else 2)} 156 {end+(-5 if offset>0 else 5)} 152',stroke='#957447',width=1.15)
    b += path('M276 104 Q270 132 278 147 Q281 153 285 147 Q292 132 286 104',stroke='#af8a52',width=1.4)
    b += '</g>'
    return b

if __name__ == '__main__':
    OUT.mkdir(parents=True,exist_ok=True)
    drawings = {'mug':mug(91)+mug(253,True),'western-pot':western(),'gaiwan':gaiwan(),'gongfu-kit':gongfu(),'grandpa-style':grandpa(),'matcha-whisk':matcha()}
    for name, body in drawings.items():
        (OUT/(name+'.svg')).write_text(canvas(body),encoding='utf-8')
    print(f'Wrote {len(drawings)} original SVG illustrations.')
