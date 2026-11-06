/* Original schematic museum illustrations, not historical reconstructions.
 * Localized captions identify objects without supplying label answers. */
(() => {
  'use strict';
  const ns = 'http://www.w3.org/2000/svg';
  const ink = '#466356', sage = '#b4c1a5', clay = '#b67b5b', cream = '#faf5e8';
  const captions = {
    'song-powder': ['Tools beside a tea bowl', '茶碗旁的工具', '茶碗旁的工具'],
    'milk-tea-filter': ['Tools at a milk-tea counter', '奶茶櫃位的工具', '奶茶柜台的工具'],
    'nanking-island': ['A document to read carefully', '一份要細讀的文件', '一份要细读的文件']
  };
  function art(id) {
    const node = (tag, attrs = {}) => {
      const element = document.createElementNS(ns, tag);
      Object.entries(attrs).forEach(([key, value]) => element.setAttribute(key, String(value)));
      return element;
    };
    const svg = node('svg', {viewBox: '0 0 240 136', 'aria-hidden': 'true', focusable: 'false', class: 'tea-game-art'});
    const add = (tag, attrs) => { const element = node(tag, attrs); svg.append(element); return element; };
    const path = (d, fill = 'none', stroke = ink, width = 3) => add('path', {d, fill, stroke, 'stroke-width': width, 'stroke-linecap': 'round', 'stroke-linejoin': 'round'});
    add('rect', {x: 1, y: 1, width: 238, height: 134, rx: 16, fill: '#e8ecdf', stroke: ink, 'stroke-width': 2});
    add('ellipse', {cx: 120, cy: 117, rx: 91, ry: 9, fill: '#d1dbc6'});
    if (id === 'song-powder') {
      // Open bowl with a separate schematic whisk; no claim of period accuracy.
      path('M39 72 H150 Q145 110 95 112 Q45 110 39 72 Z', cream);
      add('ellipse', {cx: 94.5, cy: 72, rx: 55.5, ry: 11, fill: sage, stroke: ink, 'stroke-width': 2});
      path('M53 75 Q72 66 89 75 T126 75', 'none', cream, 2);
      path('M82 113 H108');
      path('M177 26 H187 L188 57 H176 Z', clay);
      path('M176 57 Q161 76 157 103 Q181 116 205 103 Q200 76 188 57 Z', cream);
      path('M179 61 Q169 83 168 104 M182 61 V107 M185 61 Q195 83 195 104', 'none', clay, 2);
      path('M174 56 H190', 'none', ink, 4);
    } else if (id === 'milk-tea-filter') {
      // A hanging cloth filter and separate cup, with no textile labels.
      path('M42 38 Q47 62 52 78 Q63 99 78 78 Q84 62 89 38 Z', cream);
      path('M53 43 Q55 65 61 78 M77 43 Q74 65 69 79', 'none', clay, 2);
      add('ellipse', {cx: 65.5, cy: 38, rx: 23.5, ry: 7, fill: sage, stroke: ink, 'stroke-width': 2});
      path('M89 38 H115', 'none', ink, 5);
      path('M65 92 V97', 'none', clay, 3);
      path('M184 67 Q211 63 210 85 Q207 98 186 92');
      path('M132 62 H189 L184 105 Q160 119 137 105 Z', cream);
      add('ellipse', {cx: 160.5, cy: 62, rx: 28.5, ry: 7, fill: clay, stroke: ink, 'stroke-width': 2});
      path('M122 115 H199', 'none', ink, 2);
    } else if (id === 'nanking-island') {
      // Generic document and seal, deliberately without a territorial map.
      path('M67 23 H161 L176 39 V109 H67 Z', cream);
      path('M161 23 V39 H176');
      path('M83 43 H145 M83 56 H157 M83 69 H157 M83 82 H136', 'none', ink, 2);
      add('circle', {cx: 148, cy: 98, r: 12, fill: clay, stroke: ink, 'stroke-width': 2});
      path('M143 109 L139 121 L148 117 L155 122 L154 109', sage, ink, 2);
    }
    return svg;
  }
  window.TeaMuseumFigures = {
    figure(exhibitId, locale) {
      if (!Object.prototype.hasOwnProperty.call(captions, exhibitId)) return null;
      const figure = document.createElement('figure');
      figure.className = 'tea-game-figure';
      const caption = document.createElement('figcaption');
      const index = ['en', 'zh-hant-hk', 'zh-hans'].indexOf(locale);
      caption.textContent = captions[exhibitId][index] || captions[exhibitId][0];
      figure.append(art(exhibitId), caption);
      return figure;
    }
  };
})();
