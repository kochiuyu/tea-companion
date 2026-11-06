/* Original lesson schematics, paired with visible localized captions by the host.
 * Objects identify topics, not fixed recipes, measured effects or causal paths. */
(() => {
  'use strict';
  const ns = 'http://www.w3.org/2000/svg';
  const sage = '#b4c1a5', ink = '#466356', clay = '#b67b5b', cream = '#faf5e8';
  function art(kind) {
    const node = (tag, attrs = {}) => {
      const n = document.createElementNS(ns, tag);
      Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, String(v)));
      return n;
    };
    const svg = node('svg', {viewBox:'0 0 240 136', 'aria-hidden':'true', focusable:'false', class:'tea-game-art tea-lesson-art'});
    const add = (tag, attrs) => { const n = node(tag, attrs); svg.append(n); return n; };
    const path = (d, fill = 'none', stroke = ink, width = 3) => add('path', {d, fill, stroke, 'stroke-width':width, 'stroke-linecap':'round', 'stroke-linejoin':'round'});
    const rect = (x,y,width,height,fill = cream,rx = 6) => add('rect',{x,y,width,height,rx,fill,stroke:ink,'stroke-width':2});
    const circle = (cx,cy,r,fill = sage) => add('circle',{cx,cy,r,fill,stroke:ink,'stroke-width':2});
    const leaf = (x,y,fill = sage) => {
      path(`M${x} ${y} Q${x-7} ${y-21} ${x+15} ${y-25} Q${x+23} ${y-5} ${x} ${y} Z`,fill,ink,2);
      path(`M${x-3} ${y+4} L${x+11} ${y-17}`,'none',ink,2);
    };
    const cup = (x,y) => {
      path(`M${x+44} ${y+8} C${x+67} ${y+1} ${x+66} ${y+33} ${x+45} ${y+29}`);
      path(`M${x} ${y} H${x+49} L${x+44} ${y+38} Q${x+25} ${y+49} ${x+5} ${y+38} Z`,cream);
      path(`M${x+6} ${y+9} H${x+43}`,'none',clay,5);
    };
    const clock = (x,y,r) => {
      circle(x,y,r,cream);
      path(`M${x} ${y-r+6} V${y} L${x+9} ${y+5}`,'none',ink,2);
      circle(x,y,2,clay);
    };
    rect(1,1,238,134,'#e8ecdf',16);
    add('ellipse',{cx:120,cy:115,rx:91,ry:9,fill:'#d1dbc6'});
    if (kind === 'processing') {
      // A workshop still life: no arrows or universal processing order.
      leaf(43,65); leaf(63,52); leaf(72,77,clay);
      path('M32 92 Q57 111 91 92','none',ink,2);
      path('M45 88 C39 76 61 75 57 85 C53 96 70 94 72 84','none',ink,3);
      path('M101 61 H151 Q145 84 127 85 Q107 83 101 61 Z',cream);
      path('M151 65 L164 57'); leaf(117,60);
      path('M113 98 Q107 92 113 87 M126 102 Q120 95 126 90 M139 98 Q133 92 139 87','none',clay,3);
      rect(172,76,44,29,cream,4);
      path('M179 83 H209 M179 91 H209 M179 99 H209','none',sage,2);
      leaf(179,76,clay); leaf(196,68);
    } else if (kind === 'brewing') {
      // Leaf portion, temperature and time are controls, without preset values.
      cup(88,68);
      path('M51 95 L69 76','none',ink,5);
      add('ellipse',{cx:72,cy:69,rx:14,ry:10,fill:cream,stroke:ink,'stroke-width':2});
      path('M64 70 L69 64 M72 73 L79 66 M73 64 L78 62','none',sage,3);
      path('M44 31 V62 A10 10 0 1 0 58 62 V31 Q51 21 44 31 Z',cream);
      path('M51 39 V68','none',clay,4); circle(51,69,4,clay);
      path('M59 37 H64 M59 47 H64','none',ink,2);
      rect(180,27,14,7,clay,2); path('M187 34 V40');
      clock(187,65,24); path('M205 44 L210 39','none',ink,4);
      path('M105 53 Q99 45 106 37 M120 53 Q114 45 121 37','none',ink,2);
    } else if (kind === 'body-signals') {
      // Neutral person and observation notebook: neither diagnosis nor benefit.
      path('M37 111 V96 Q38 79 57 76 V64 Q43 56 46 41 Q49 24 67 24 Q86 24 88 43 L96 56 H87 V67 Q87 74 77 73 V81 Q95 87 98 111 Z',cream);
      path('M52 43 Q49 34 58 33 Q62 25 69 31 Q78 28 81 37 Q87 43 79 49 Q73 56 66 51 Q56 56 52 48 Z',sage,ink,2);
      path('M63 34 Q69 39 63 45 M74 36 Q69 42 75 47','none',ink,2);
      rect(121,58,66,54,cream,4); path('M132 59 V111','none',clay,2);
      path('M140 72 H175 M140 83 H171 M140 94 H175','none',sage,3);
      path('M195 107 L204 81 L210 83 L201 109 L195 113 Z',clay,ink,2);
      clock(177,34,19);
    } else if (kind === 'context') {
      // Warmth, repeated preparation and a label, not a social-effect claim.
      rect(31,29,51,67,cream,5);
      path('M41 45 H70 M41 57 H63 M41 69 H70','none',sage,3);
      circle(56,83,4,clay);
      cup(96,66);
      path('M107 51 Q101 43 108 35 M122 51 Q116 43 123 35','none',ink,2);
      path('M179 43 L204 43 L217 56 L204 70 L179 70 Z',cream,ink,2);
      circle(205,56,3,sage);
      path('M187 52 H197 M187 60 H194','none',clay,2);
      path('M181 108 L198 90','none',ink,4);
      add('ellipse',{cx:204,cy:84,rx:12,ry:8,fill:cream,stroke:ink,'stroke-width':2});
      path('M198 85 L203 80 M205 87 L210 81','none',sage,3);
      path('M88 115 H159','none',ink,2);
    } else if (kind === 'stress-observation') {
      // Alarm metaphor alongside study notes, without a physiological result.
      circle(66,36,5,clay);
      path('M43 74 Q50 65 49 53 Q49 38 66 38 Q83 38 83 53 Q82 65 89 74 Z',cream);
      path('M59 80 Q66 89 73 80','none',clay,3);
      path('M37 49 Q31 59 37 67 M95 49 Q101 59 95 67','none',ink,2);
      rect(122,51,67,60,cream,4);
      rect(142,46,27,10,sage,3);
      path('M135 68 H175 M135 81 H166 M135 94 H175','none',sage,3);
      clock(183,31,18);
      path('M201 110 L210 81 L216 83 L207 112 L201 116 Z',clay,ink,2);
    } else if (kind === 'warmth-evidence') {
      // Holding a mug is a study condition, not proof of trust or emotion.
      cup(43,53);
      path('M56 39 Q50 31 57 24 M72 39 Q66 31 73 24','none',ink,2);
      path('M27 111 L36 93 Q32 84 36 75 Q39 71 43 75 L47 85 L68 85 Q75 86 74 91 L53 93 L77 94 Q84 95 81 101 L61 104 L48 116',cream,ink,2);
      path('M38 94 L45 101','none',ink,2);
      rect(139,33,65,77,cream,4);
      path('M171 45 V98 M147 60 H196 M147 79 H196','none',sage,2);
      path('M148 50 H162 M180 50 H195 M148 69 H160 M180 69 H192 M148 89 H162 M180 89 H195','none',ink,2);
      path('M136 27 Q163 14 191 26 M184 20 L191 26 L183 29','none',clay,2);
    } else if (kind === 'reflection') {
      // A quick response and checking work; not a brain-region diagram.
      rect(32,91,69,16,sage,5);
      path('M40 89 Q41 63 66 63 Q91 63 93 89 Z',clay);
      path('M50 73 Q57 67 66 68','none',cream,2);
      path('M66 49 V38 M44 54 L37 46 M89 54 L96 46','none',ink,2);
      rect(128,28,66,84,cream,5);
      rect(139,41,9,9,sage,2);
      path('M155 45 H182 M140 62 H182 M140 73 H175 M140 94 L147 100 L159 85','none',ink,2);
      path('M197 104 L210 61 L217 63 L204 106 L197 112 Z',clay,ink,2);
      path('M208 68 L215 70','none',cream,2);
    } else if (kind === 'social-rules') {
      // Two players inspect shared rules; tokens carry no prescribed payoff.
      circle(47,45,12,cream); circle(192,45,12,cream);
      path('M26 94 V78 Q27 63 47 63 Q67 63 68 78 V94 Z',sage);
      path('M171 94 V78 Q172 63 192 63 Q212 63 213 78 V94 Z',sage);
      rect(87,23,66,49,cream,4);
      path('M98 36 H142 M98 47 H134 M98 58 H142','none',ink,2);
      path('M75 82 H164 L177 112 H62 Z',cream,ink,2);
      path('M119 83 V111','none',sage,2);
      circle(88,98,6,clay); circle(109,103,6,sage);
      circle(136,97,6,sage); circle(155,104,6,clay);
    } else if (kind === 'source-notes') {
      // Reference reading, bookmarks and looking closely, with no source claims.
      path('M27 36 Q59 25 94 39 Q127 25 158 36 V100 Q125 90 94 105 Q62 90 27 100 Z',cream);
      path('M94 39 V105 M39 49 Q60 43 80 50 M39 62 Q60 56 80 63 M39 75 Q60 69 80 76 M106 49 Q126 43 145 49','none',ink,2);
      path('M60 33 L60 59 L67 53 L74 60 L74 34 Z',clay,ink,2);
      rect(160,64,49,48,cream,4);
      path('M169 77 H198 M169 88 H195 M169 99 H198','none',sage,2);
      path('M159 59 L174 75','none',clay,8);
      circle(145,44,20,cream);
      path('M134 38 H154 M134 47 H150','none',sage,3);
    } else {
      cup(90,57);
    }
    return svg;
  }
  window.TeaLessonFigures = {art};
})();
