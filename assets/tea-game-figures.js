/* Original schematic artwork. Visible localized captions carry the meaning.
 * No dates, answers, measured effects, historical reconstructions or remote assets. */
(() => {
  'use strict';
  const ns = 'http://www.w3.org/2000/svg';
  const sage = '#b4c1a5', ink = '#466356', clay = '#b67b5b', cream = '#faf5e8';
  const captions = {
    book: ['Tea knowledge in a book', '\u66f8\u4e2d\u7684\u8336\u77e5\u8b58', '\u4e66\u4e2d\u7684\u8336\u77e5\u8bc6'],
    leaf: ['Tea leaves and seeds', '\u8336\u8449\u8207\u8336\u7a2e', '\u8336\u53f6\u4e0e\u8336\u79cd'],
    notice: ['A printed tea notice', '\u5370\u5237\u7684\u8336\u5ee3\u544a', '\u5370\u5237\u7684\u8336\u5e7f\u544a'],
    chest: ['A tea chest beside water', '\u6c34\u908a\u7684\u8336\u7bb1', '\u6c34\u8fb9\u7684\u8336\u7bb1'],
    plant: ['Tea plants and growing knowledge', '\u8336\u6a39\u8207\u683d\u57f9\u77e5\u8b58', '\u8336\u6811\u4e0e\u683d\u57f9\u77e5\u8bc6'],
    ship: ['A sailing ship carrying tea', '\u904b\u8336\u7684\u5e06\u8239', '\u8fd0\u8336\u7684\u5e06\u8239'],
    hands: ['Tea skills shared between people', '\u4eba\u8207\u4eba\u50b3\u627f\u8336\u6280\u85dd', '\u4eba\u4e0e\u4eba\u4f20\u627f\u8336\u6280\u827a'],
    journey: ['Objects tell stories. Which came earlier?', '\u7269\u4ef6\u8aaa\u6545\u4e8b\u3002\u54ea\u4ef6\u4e8b\u66f4\u65e9\uff1f', '\u7269\u4ef6\u8bf4\u6545\u4e8b\u3002\u54ea\u4ef6\u4e8b\u66f4\u65e9\uff1f'],
    label: ['Read the words on the label', '\u7d30\u8b80\u6a19\u7c64\u4e0a\u7684\u6587\u5b57', '\u7ec6\u8bfb\u6807\u7b7e\u4e0a\u7684\u6587\u5b57'],
    'matched-cups': ['Two cups, two different setups', '\u5169\u500b\u676f\u5b50\uff0c\u5169\u7a2e\u4e0d\u540c\u8a2d\u5b9a', '\u4e24\u4e2a\u676f\u5b50\uff0c\u4e24\u79cd\u4e0d\u540c\u8bbe\u5b9a'],
    expectation: ['A cup and its description', '\u676f\u5b50\u8207\u5b83\u7684\u63cf\u8ff0', '\u676f\u5b50\u4e0e\u5b83\u7684\u63cf\u8ff0'],
    withdrawal: ['Caffeine and a change in routine', '\u5496\u5561\u56e0\u8207\u7fd2\u6163\u6539\u8b8a', '\u5496\u5561\u56e0\u4e0e\u4e60\u60ef\u6539\u53d8'],
    dose: ['A capsule and a cup', '\u81a0\u56ca\u8207\u8336\u676f', '\u80f6\u56ca\u4e0e\u8336\u676f'],
    confounding: ['People and their everyday routines', '\u4eba\u5011\u8207\u65e5\u5e38\u7fd2\u6163', '\u4eba\u4eec\u4e0e\u65e5\u5e38\u4e60\u60ef'],
    timing: ['A cup and the passing of time', '\u8336\u676f\u8207\u6642\u9593\u63a8\u79fb', '\u8336\u676f\u4e0e\u65f6\u95f4\u63a8\u79fb'],
    task: ['A virtual balloon task', '\u865b\u64ec\u6c23\u7403\u4efb\u52d9', '\u865a\u62df\u6c14\u7403\u4efb\u52a1'],
    ingredients: ['Ingredients considered together', '\u4e00\u8d77\u8003\u616e\u7684\u6210\u5206', '\u4e00\u8d77\u8003\u8651\u7684\u6210\u5206']
  };
  function art(kind, count) {
    const node = (tag, attrs = {}) => {
      const n = document.createElementNS(ns, tag);
      Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, String(v)));
      return n;
    };
    const svg = node('svg', {viewBox:'0 0 240 136', 'aria-hidden':'true', focusable:'false', class:'tea-game-art'});
    const add = (tag, attrs) => { const n = node(tag, attrs); svg.append(n); return n; };
    const path = (d, fill = 'none', stroke = ink, width = 3) => add('path', {d, fill, stroke, 'stroke-width':width, 'stroke-linecap':'round', 'stroke-linejoin':'round'});
    const rect = (x,y,width,height,fill = cream,rx = 6) => add('rect',{x,y,width,height,rx,fill,stroke:ink,'stroke-width':2});
    const circle = (cx,cy,r,fill = sage) => add('circle',{cx,cy,r,fill,stroke:ink,'stroke-width':2});
    const cup = (x,y) => { path(`M${x+42} ${y+8} C${x+66} ${y+2} ${x+65} ${y+32} ${x+44} ${y+28}`); path(`M${x} ${y} H${x+47} L${x+42} ${y+37} Q${x+23} ${y+47} ${x+5} ${y+37} Z`,cream); path(`M${x+5} ${y+8} H${x+42}`,clay,clay,5); };
    const leaf = (x,y) => { path(`M${x} ${y} Q${x-38} ${y-32} ${x-31} ${y-51} Q${x+3} ${y-50} ${x} ${y}`,sage); path(`M${x} ${y} Q${x+38} ${y-34} ${x+31} ${y-50} Q${x-2} ${y-45} ${x} ${y}`,sage); path(`M${x} ${y-24} V${y+16}`); };
    const person = (x,y) => {circle(x,y,12,cream);path(`M${x-23} ${y+44} V${y+30} Q${x} ${y+9} ${x+23} ${y+30} V${y+44}`,sage);};
    const paper = (x,y) => {rect(x,y,58,71);path(`M${x+11} ${y+17} H${x+45} M${x+11} ${y+28} H${x+45} M${x+11} ${y+39} H${x+33} M${x+11} ${y+51} H${x+40}`);};
    rect(1,1,238,134,'#e8ecdf',16);
    add('ellipse',{cx:120,cy:115,rx:91,ry:9,fill:'#d1dbc6'});
    if (kind === 'book' || kind === 'journey') {
      path('M42 38 Q80 22 120 39 Q160 22 198 38 V101 Q160 85 120 103 Q80 85 42 101 Z',cream);
      path('M120 39 V103 M57 51 Q80 43 103 51 M57 66 Q80 58 103 66 M57 81 Q80 73 103 81');
      leaf(160,81);
    } else if (kind === 'leaf' || kind === 'plant') {
      leaf(112,81);
      if (kind === 'plant') path('M86 96 H140 L134 118 H93 Z',clay);
      else {circle(164,97,6,clay);circle(181,105,6,clay);circle(156,113,5,clay);}
    } else if (kind === 'notice' || kind === 'label' || kind === 'expectation') {
      paper(64,26);
      if (kind === 'label') {circle(151,69,25,'#faf5e8');path('M170 88 L194 112', 'none',clay,9);path('M139 62 H163 M139 74 H158');}
      else cup(148,64);
    } else if (kind === 'chest') {
      rect(64,35,111,66,clay);path('M64 52 H175 M88 35 V101 M151 35 V101');
      path('M28 113 Q40 105 52 113 T100 113 T148 113 T196 113 T220 113');
    } else if (kind === 'ship') {
      path('M49 90 H193 L176 111 H70 Z',clay);path('M116 25 V91 M122 31 L174 78 H122 Z',cream);path('M108 39 L72 78 H108 Z',sage);
      path('M25 119 Q38 111 51 119 T103 119 T155 119 T207 119');
    } else if (kind === 'hands' || kind === 'confounding') {
      person(63,41);person(177,41);cup(96,73);
    } else if (kind === 'tokens') {
      person(53,38);
      for (let i=0;i<count;i++) circle(103+(i%4)*29,55+Math.floor(i/4)*29,10,clay);
    } else if (kind === 'matched-cups') {
      cup(47,64);path('M55 49 Q49 41 56 33 M70 49 Q64 41 71 33');
      path('M147 59 H191 L185 105 H153 Z',cream);path('M153 72 H185');
    } else if (kind === 'dose') {
      rect(50,48,29,58,cream,14);path('M50 77 H79');cup(139,63);
    } else if (kind === 'timing' || kind === 'withdrawal') {
      cup(46,66);
      if (kind === 'timing') {circle(171,68,31,cream);path('M171 47 V68 L188 78');}
      else {rect(141,36,62,65);path('M141 51 H203 M156 29 V42 M188 29 V42');for(let i=0;i<6;i++)circle(155+(i%3)*16,66+Math.floor(i/3)*20,3,sage);}
    } else if (kind === 'task') {
      rect(48,22,144,86);path('M105 108 V118 M135 108 V118 M91 119 H149');
      add('ellipse',{cx:120,cy:55,rx:20,ry:25,fill:clay,stroke:ink,'stroke-width':2});
      path('M120 80 Q113 89 123 98');
    } else if (kind === 'ingredients') {
      rect(57,40,32,66,cream,16);path('M57 73 H89');
      rect(151,40,32,66,cream,16);path('M151 73 H183');
      path('M109 73 H131 M120 62 V84');
    } else {cup(90,57);}
    return svg;
  }
  window.TeaGameFigures = {
    art,
    figure(kind, locale) {
      const figure = document.createElement('figure'); figure.className = 'tea-game-figure';
      const caption = document.createElement('figcaption');
      caption.textContent = captions[kind][['en','zh-hant-hk','zh-hans'].indexOf(locale)] || captions[kind][0];
      figure.append(art(kind), caption); return figure;
    }
  };
})();
