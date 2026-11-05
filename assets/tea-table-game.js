/* Tap-first contextual table builder. No dependencies, network, telemetry or storage. */
(() => {
  'use strict';
  const copy = window.TeaTableCopy;
  if (!copy) return; // The complete static comparison stays readable if data cannot load.
  const el = (tag, cls, text) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const svgEl = (tag, attrs = {}) => {
    const node = document.createElementNS('http://www.w3.org/2000/svg', tag);
    Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, String(value)));
    return node;
  };
  function drawing(group, choice, width = 112, height = 76) {
    const svg = svgEl('svg', {viewBox:'0 0 112 76', width, height, 'aria-hidden':'true', focusable:'false'});
    const shape = (tag, attrs) => { const item = svgEl(tag, attrs); svg.append(item); return item; };
    const line = (d, color = '#466356') => shape('path', {d, fill:'none', stroke:color, 'stroke-width':3, 'stroke-linecap':'round', 'stroke-linejoin':'round'});
    const cup = (x, y, scale = 1, color = '#f7f1df') => {
      const g = svgEl('g', {transform:`translate(${x} ${y}) scale(${scale})`});
      g.append(svgEl('path',{d:'M0 0 Q1 20 15 20 Q29 20 30 0 Z',fill:color,stroke:'#466356','stroke-width':2}),svgEl('ellipse',{cx:15,cy:0,rx:15,ry:4,fill:'#a37340',stroke:'#466356','stroke-width':2}));
      svg.append(g);
    };
    const pot = (x = 7, y = 18) => {
      const g = svgEl('g',{transform:`translate(${x} ${y})`});
      g.append(svgEl('path',{d:'M39 14 Q66 9 59 31 Q56 39 44 33',fill:'none',stroke:'#81513f','stroke-width':6}),svgEl('path',{d:'M12 16 L-5 8 L2 30 L18 37',fill:'#b67b5b',stroke:'#81513f','stroke-width':2}),svgEl('ellipse',{cx:29,cy:27,rx:22,ry:17,fill:'#b67b5b',stroke:'#81513f','stroke-width':2}),svgEl('path',{d:'M10 14 Q29 3 47 14 Z',fill:'#c99670',stroke:'#81513f','stroke-width':2}),svgEl('circle',{cx:29,cy:6,r:4,fill:'#81513f'}));
      svg.append(g);
    };
    if (group === 0) {
      if (choice === 1) {
        shape('path',{d:'M12 15 L46 15 L39 50 Q29 62 20 50 Z',fill:'#d1b995',stroke:'#81513f','stroke-width':2});
        shape('ellipse',{cx:29,cy:15,rx:18,ry:5,fill:'#faf5e8',stroke:'#466356','stroke-width':2});
        line('M46 15 L60 11'); line('M28 27 L25 42 M35 28 L32 44','#b59a71');
        cup(70,36,1,'#f8f5ed');
        shape('path',{d:'M99 40 Q113 39 107 51 Q104 55 98 52',fill:'none',stroke:'#466356','stroke-width':3});
      } else {
        if (choice === 2) shape('rect',{x:3,y:48,width:105,height:20,rx:8,fill:'#b4c1a5'});
        pot(); cup(77,41,0.7); cup(57,55,0.55);
      }
    } else if (group === 1) {
      if (choice === 0) {
        cup(41,26,1); line('M25 34 C17 9 77 4 88 25 M79 20 L89 27 L93 16'); line('M88 43 C93 69 33 71 24 49 M20 59 L23 47 L35 49');
      } else if (choice === 1) {
        cup(4,24,0.8); cup(44,24,0.8); cup(84,24,0.8); line('M9 61 L100 61 M94 56 L101 61 L94 66');
      } else {
        shape('ellipse',{cx:56,cy:59,rx:44,ry:8,fill:'#b4c1a5'}); cup(43,35,0.8); line('M24 14 Q56 1 86 15 M25 14 L32 24 M85 15 L77 24'); line('M54 15 L54 23','#a37340');
      }
    } else {
      if (choice === 0) {
        shape('path',{d:'M8 13 H62 Q70 13 70 21 V40 Q70 48 60 48 H33 L20 58 V48 H16 Q8 48 8 39 Z',fill:'#d4dfc8',stroke:'#466356','stroke-width':2});
        shape('path',{d:'M78 28 H91 Q103 28 103 40 V53 Q103 61 94 61 H90 L96 70 L79 61 H59 Q50 61 50 54 V52',fill:'#f0d6ab',stroke:'#466356','stroke-width':2});
        for (const x of [25,39,53]) shape('circle',{cx:x,cy:30,r:3,fill:'#466356'});
      } else if (choice === 1) {
        shape('rect',{x:8,y:45,width:96,height:21,rx:3,fill:'#c99670'}); line('M8 45 L104 45'); cup(42,21,0.8); line('M19 12 L19 37 M93 12 L93 37');
      } else {
        shape('ellipse',{cx:56,cy:55,rx:46,ry:13,fill:'#b4c1a5'}); cup(41,38,0.8); line('M20 15 L20 28 M14 21 L26 21 M87 11 L87 24 M81 17 L93 17','#a37340');
        line('M52 12 Q47 20 54 25 M62 12 Q57 20 64 25');
      }
    }
    return svg;
  }
  function tableArt(choices, index) {
    const svg = svgEl('svg',{viewBox:'0 0 560 210','aria-hidden':'true',focusable:'false',class:'tea-table-art'});
    svg.append(svgEl('rect',{x:0,y:0,width:560,height:210,rx:20,fill:['#e1e7d6','#e8ded0','#e2e3d5'][index]}));
    if (index === 1) {
      for (let x=0;x<560;x+=40) svg.append(svgEl('path',{d:`M${x} 0 V120`,stroke:'#d3c8b8','stroke-width':1}));
      for (let y=0;y<125;y+=30) svg.append(svgEl('path',{d:`M0 ${y} H560`,stroke:'#d3c8b8','stroke-width':1}));
    } else {
      svg.append(svgEl('circle',{cx:462,cy:49,r:44,fill:'#f8f3df'}),svgEl('path',{d:'M0 115 Q100 45 216 112 T560 95 V210 H0 Z',fill:'#c6d0b8'}));
    }
    svg.append(svgEl('ellipse',{cx:280,cy:161,rx:237,ry:39,fill:'#976d52'}),svgEl('ellipse',{cx:280,cy:150,rx:237,ry:39,fill:'#c99c72'}));
    for (let group=0; group<3; group++) {
      svg.append(svgEl('ellipse',{cx:147+group*135,cy:151,rx:58,ry:16,fill:choices[group] === null ? '#dcb995':'#ead6b1',stroke:'#a67d58','stroke-dasharray': choices[group] === null ? '4 5':'0'}));
      if (choices[group] !== null) {
        const icon = drawing(group,choices[group]); icon.setAttribute('x',91+group*135); icon.setAttribute('y',88); svg.append(icon);
      } else {
        svg.append(svgEl('path',{d:`M${147+group*135} 128 V147 M${138+group*135} 137 H${156+group*135}`,stroke:'#936e50','stroke-width':2,'stroke-linecap':'round'}));
      }
    }
    return svg;
  }
  document.querySelectorAll('[data-tea-table]').forEach((host, instance) => {
    if (host.dataset.mounted === 'true') return;
    const c = copy[host.dataset.locale] || copy.en;
    const state = c.scenes.map(() => ({choices:[null,null,null],checked:false}));
    const game = el('div','tea-table-game');
    const intro = el('div','tea-table-intro');
    intro.append(el('p','tea-table-badge',c.badge),el('p','tea-table-lead',c.intro),el('p','tea-table-scope',c.scope));
    const stage = el('div','tea-table-stage');
    const status = el('p','tea-table-sr'); status.setAttribute('role','status'); status.setAttribute('aria-live','polite'); status.setAttribute('aria-atomic','true');
    game.append(intro,stage,status);
    let current=0, epoch=0, mode='play';
    function link(text,href) { const a=el('a','',text); a.href=href; return a; }
    function button(label,action,callback,cls='') {
      const b=el('button','tea-table-button '+cls,label); b.type='button'; b.dataset.action=action; b.addEventListener('click',callback); return b;
    }
    function sourceLinks(scene) {
      const p=el('p','tea-table-sources'); p.append(el('strong','',c.sources+': '));
      scene.sources.forEach((source,i)=>{if(i)p.append(el('span','',' · '));p.append(link(source.name,source.url));});
      return p;
    }
    function render(focus=false) {
      const version=++epoch;
      const valid=()=>version===epoch;
      stage.replaceChildren(); stage.dataset.scene=String(current); stage.dataset.mode=mode; status.textContent='';
      if (mode==='summary') {
        const heading=el('h3','',c.summary); heading.tabIndex=-1;
        stage.append(heading,el('p','',c.summaryIntro));
        const list=el('div','tea-table-summary');
        c.scenes.forEach((scene,i)=>{
          const card=el('section','tea-table-summary-card'); card.append(el('h4','',scene.title),tableArt(state[i].choices,i));
          const ul=el('ul'); c.groups.forEach((group,j)=>ul.append(el('li','',group+': '+c.options[j][state[i].choices[j]]))); card.append(ul,sourceLinks(scene)); list.append(card);
        });
        stage.append(list,el('p','tea-table-takeaway',c.takeaway));
        const nav=el('div','tea-table-nav');
        nav.append(button(c.previous,'previous',()=>{if(!valid())return;mode='play';current=2;render(true);}),button(c.restart,'restart',()=>{if(!valid())return;state.forEach(s=>{s.choices=[null,null,null];s.checked=false;});current=0;mode='play';render(true);},'tea-table-primary'),link(c.read,'#tea-table-reading'));
        stage.append(nav); if(focus)heading.focus(); return;
      }
      const scene=c.scenes[current], saved=state[current];
      stage.append(el('p','tea-table-progress',c.scene.replace('{n}',String(current+1))));
      const heading=el('h3','',scene.title); heading.tabIndex=-1; stage.append(heading,el('p','tea-table-setup',scene.setup));
      const figure=el('figure','tea-table-figure');
      const art=el('div','tea-table-illustration');
      const caption=el('figcaption',''); caption.append(el('strong','',c.table+' · '+scene.place));
      const inventory=el('ul','tea-table-inventory'); caption.append(inventory); figure.append(art,caption); stage.append(figure,el('p','tea-table-instructions',c.choose));
      const optionGroups=el('div','tea-table-groups');
      const choices=[];
      c.groups.forEach((group,j)=>{
        const block=el('section','tea-table-group');
        const label=el('h4','',String(j+1)+'. '+group); label.id=`tea-table-${instance}-${current}-${j}`;
        const row=el('div','tea-table-options'); row.setAttribute('role','group'); row.setAttribute('aria-labelledby',label.id);
        choices[j]=[];
        c.options[j].forEach((text,k)=>{
          const b=button('',`choose-${j}-${k}`,()=>{
            if(!valid())return;
            const changed=saved.choices[j]!==k;
            if(!changed)return;
            saved.choices[j]=k;saved.checked=false;
            update();status.textContent=c.groups[j]+': '+text+'. '+(saved.choices.every(v=>v!==null)?c.ready:c.pick);
          },'tea-table-choice');
          b.dataset.group=String(j);b.dataset.choice=String(k);b.append(drawing(j,k,84,57),el('span','',text));
          choices[j][k]=b;row.append(b);
        });
        block.append(label,row);optionGroups.append(block);
      });
      stage.append(optionGroups);
      const feedback=el('section','tea-table-feedback'); feedback.id=`tea-table-feedback-${instance}`;
      const controls=el('div','tea-table-controls');
      const check=button(c.check,'check',()=>{if(!valid()||saved.choices.some(v=>v===null))return;saved.checked=true;update();status.textContent=c.feedback+'. '+c.takeaway;},'tea-table-primary');
      check.setAttribute('aria-controls',feedback.id);check.setAttribute('aria-expanded','false');
      const example=button(c.example,'example',()=>{if(!valid())return;saved.choices=[...scene.expected];saved.checked=true;update();status.textContent=c.exampleShown;});
      const reset=button(c.reset,'reset',()=>{if(!valid())return;saved.choices=[null,null,null];saved.checked=false;update();status.textContent=c.pick;choices[0][0].focus();});
      controls.append(check,example,reset);stage.append(controls,feedback);
      const nav=el('div','tea-table-nav');
      const previous=button(c.previous,'previous',()=>{if(!valid()||current===0)return;current--;render(true);});previous.disabled=current===0;
      const next=button(current===2?c.finish:c.next,'next',()=>{if(!valid()||!saved.checked)return;if(current===2)mode='summary';else current++;render(true);},'tea-table-primary');
      nav.append(previous,next,link(c.read,'#tea-table-reading'));stage.append(nav);
      function update() {
        art.replaceChildren(tableArt(saved.choices,current));inventory.replaceChildren();
        c.groups.forEach((group,j)=>{
          inventory.append(el('li','',group+': '+(saved.choices[j]===null?c.empty:c.options[j][saved.choices[j]])));
          choices[j].forEach((b,k)=>b.setAttribute('aria-pressed',String(saved.choices[j]===k)));
        });
        check.disabled=saved.choices.some(v=>v===null);next.disabled=!saved.checked;
        reset.disabled=saved.choices.every(v=>v===null);check.setAttribute('aria-expanded',String(saved.checked));
        feedback.hidden=!saved.checked;feedback.replaceChildren();
        if(saved.checked){
          feedback.append(el('h4','',c.feedback));
          c.groups.forEach((group,j)=>{
            const item=el('div','tea-table-context');item.dataset.matches=String(saved.choices[j]===scene.expected[j]);
            item.append(el('h5','',group),el('p','tea-table-your-choice',c.selected+': '+c.options[j][saved.choices[j]]),el('p','tea-table-match',saved.choices[j]===scene.expected[j]?c.match:c.different),el('p','',c.portrait+': '+c.options[j][scene.expected[j]]+'. '+scene.why[j]));feedback.append(item);
          });
          feedback.append(sourceLinks(scene),link(c.notes,'#tea-table-notes'));
        }
      }
      update();if(focus)heading.focus();
    }
    render();
    host.replaceChildren(game);host.dataset.mounted='true';
  });
})();
