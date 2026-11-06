'use strict';
// Independent DOM/state checks. Browser geometry and actual keyboard behavior are separate.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'), read=name=>fs.readFileSync(path.join(root,'assets',name),'utf8');
const dataJS=read('tea-museum-data.js'),uiJS=read('tea-museum.js'),figJS=read('tea-museum-figures.js'),sharedJS=read('tea-game-figures.js');
const locales=['en','zh-hant-hk','zh-hans'];let focused;
class Node {
 constructor(tag,text=''){this.tagName=tag;this._text=text;this.children=[];this.dataset={};this.attrs={};this.events={};this.hidden=false;this.disabled=false;}
 set textContent(value){this._text=String(value);this.children=[];}
 get textContent(){return this._text+this.children.map(n=>n.textContent).join('');}
 get firstElementChild(){return this.children[0];}
 append(...nodes){this.children.push(...nodes);}
 replaceChildren(...nodes){this._text='';this.children=nodes;}
 setAttribute(k,v){this.attrs[k]=String(v);}
 removeAttribute(k){delete this.attrs[k];}
 addEventListener(k,fn){this.events[k]=fn;}
 focus(){focused=this;}
 scrollIntoView(options){this.scrollOptions=options;}
 click(){if(!this.disabled)this.events.click?.();}
}
const all=(n,fn)=>[n,...n.children.flatMap(c=>all(c,fn))].filter(fn);
const seed=value=>()=>((value=(Math.imul(value,1664525)+1013904223)>>>0)/4294967296);
function mount(locale='en',options={}){
 const host=new Node('div');host.dataset.locale=locale;host.append(new Node('p','Reading fallback'));
 let creates=0;const create=tag=>{if(++creates===options.failAt)throw Error('Injected creation error');return new Node(tag);};
 const document={readyState:'complete',querySelectorAll:()=>[host],createElement:create,createElementNS:(ns,tag)=>create(tag)};
 const math=Object.create(Math);math.random=seed(options.seed||42);
 const ctx={window:{},document,Math:math,console:{warn(){}}};
 if(!options.noData)vm.runInNewContext(dataJS,ctx);
 if(options.count)ctx.window.TeaMuseumData.exhibits=ctx.window.TeaMuseumData.exhibits.slice(0,options.count);
 if(options.invalidData)ctx.window.TeaMuseumData.exhibits[0].correct='missing';
 vm.runInNewContext(sharedJS,ctx);vm.runInNewContext(figJS,ctx);
 if(!options.noJS)vm.runInNewContext(uiJS,ctx);
 const nodes=fn=>all(host,fn),cls=c=>nodes(n=>n.className===c)[0];
 const app={host,ctx,nodes,cls,panel:()=>cls('tea-museum-panel')};
 app.action=a=>all(app.panel(),n=>n.dataset.action===a)[0];
 app.tap=a=>{assert(app.action(a),`Missing ${a}`);app.action(a).click();};
 app.answer=id=>{const b=app.nodes(n=>n.dataset.answer===id)[0];assert(b);b.click();};
 app.order=()=>all(app.panel(),n=>n.dataset.action==='answer').map(n=>n.dataset.answer);
 return app;
}
const ctx={window:{}};vm.runInNewContext(dataJS,ctx);const data=JSON.parse(JSON.stringify(ctx.window.TeaMuseumData));
const total=data.exhibits.length;assert.equal(total,12,'Expanded museum must have twelve exhibits');assert.equal(new Set(data.exhibits.map(e=>e.id)).size,total);
for(const e of data.exhibits){
 assert.equal(e.choices.length,3);assert.equal(new Set(e.choices.map(c=>c.id)).size,3);assert.equal(e.choices.filter(c=>c.id===e.correct).length,1);
 for(const lang of locales){
  for(const key of ['title','claim','hint','explanation','source','sourceTitle'])assert(e[key][lang]?.trim(),`${e.id}/${key}/${lang}`);
  for(const c of e.choices)assert(c.label[lang]?.trim());
  assert.match(e.source[lang],/^modules\/module-\d{2}\/[\w-]+\.html(?:#[^\s]+)?$/);
  const file=e.source[lang].split('#')[0].replace(/\.html$/,'.qmd');assert(fs.existsSync(path.join(root,lang==='en'?'':lang,file)),file);
 }
 assert(Array.isArray(e.citations));for(const citation of e.citations){assert(citation.title.trim());assert.equal(new URL(citation.url).protocol,'https:');}
}
const exhibitFor=app=>data.exhibits.find(e=>e.id===app.panel().dataset.exhibitId);
const galleryIds=node=>all(node,n=>n.dataset.galleryId).map(n=>n.dataset.galleryId);
const progress=app=>app.nodes(n=>n.tagName==='progress')[0];
for(const lang of locales){
 const app=mount(lang);assert.equal(app.host.dataset.museumReady,'true');assert.equal(app.panel().dataset.mode,'welcome');
 assert.equal(galleryIds(app.cls('tea-museum-browse')).length,total);assert.equal(app.cls('tea-museum-browse').hidden,false);
 assert.equal(app.cls('tea-museum-collection').hidden,true);assert(!app.cls('tea-museum-browse').open);
 assert(app.action('start').textContent.includes('3'));assert(app.cls('tea-museum-intro').textContent.includes('12'));
 const staleStart=app.action('start');app.tap('start');const first=app.panel();staleStart.click();assert.equal(app.panel(),first);
 assert.equal(focused,app.cls('tea-museum-progress'));assert.equal(focused.scrollOptions.block,'start');assert.equal(focused.scrollOptions.behavior,'instant');
 const seen=new Set(),orders=new Map(),feedbackById=new Map(),pressedById=new Map();
 let staleAnswer,staleReveal,staleMore;
 for(let visit=0;visit<4;visit++){
  const ids=[];
  for(let i=0;i<3;i++){
   const e=exhibitFor(app);assert(e);assert(!seen.has(e.id),'No repeats before exhausting the collection');seen.add(e.id);ids.push(e.id);
   assert.equal(progress(app).max,3);assert.equal(progress(app).value,i);assert.equal(app.action('previous').disabled,i===0);
   assert(app.cls('tea-museum-progress').textContent.includes('3'));assert.equal(app.action('next').disabled,true);
   if(staleAnswer){staleAnswer.click();staleReveal.click();assert.equal(app.action('next').disabled,true);}
   const order=app.order();orders.set(e.id,order);assert.deepEqual([...order].sort(),e.choices.map(c=>c.id).sort());
   app.tap('next');assert.equal(app.panel().dataset.exhibitId,e.id);
   assert.equal(app.cls('tea-museum-hint').hidden,true);app.tap('hint');assert.equal(app.cls('tea-museum-hint').hidden,false);
   assert.equal(app.action('hint').attrs['aria-expanded'],'true');assert.equal(app.cls('tea-museum-status').textContent,e.hint[lang]);
   const oldAnswer=app.action('answer'),oldReveal=app.action('reveal');
   if(i===0)app.answer(e.choices.find(c=>c.id!==e.correct).id);
   else if(i===1)app.answer(e.correct);
   else {app.tap('reveal');assert.equal(focused,app.cls('tea-museum-feedback').firstElementChild);}
   const feedback=app.cls('tea-museum-feedback').textContent;feedbackById.set(e.id,feedback);
   assert(feedback.includes(e.explanation[lang]));assert.equal(app.cls('tea-museum-plaque').dataset.restored,'true');assert.equal(progress(app).value,i+1);
   assert.equal(app.cls('tea-museum-collection').hidden,false);assert.equal(galleryIds(app.cls('tea-museum-collection')).length,seen.size);
   assert.deepEqual(new Set(galleryIds(app.cls('tea-museum-collection'))),seen,'Previous visits stay in the collection');
   assert(!app.cls('tea-museum-collection').open,'History does not force a long gallery open');
   const pressed=app.nodes(n=>n.dataset.action==='answer').map(n=>n.attrs['aria-pressed']);pressedById.set(e.id,pressed);
   app.answer(e.correct);oldAnswer.click();oldReveal.click();assert.equal(app.cls('tea-museum-feedback').textContent,feedback);
   assert.deepEqual(app.nodes(n=>n.dataset.action==='answer').map(n=>n.attrs['aria-pressed']),pressed);
   for(const b of app.nodes(n=>n.dataset.action==='answer'))assert.equal(b.attrs['aria-disabled'],'true');
   const staleNext=app.action('next');staleAnswer=oldAnswer;staleReveal=oldReveal;
   app.tap('next');const after=app.panel();staleNext.click();assert.equal(app.panel(),after,'Stale next cannot skip');
   if(i<2){app.tap('previous');assert.equal(app.panel().dataset.exhibitId,e.id);assert.deepEqual(app.order(),order);assert.equal(app.cls('tea-museum-feedback').textContent,feedback);assert.equal(app.cls('tea-museum-hint').hidden,false);app.tap('next');}
  }
  assert.equal(app.panel().dataset.mode,'summary');assert.equal(galleryIds(app.panel()).length,0,'Summary is a short stopping point');
  assert.equal(app.cls('tea-museum-browse').hidden,false,'Full reading collection remains available');
  const staleReview=app.action('review');app.tap('review');
  for(const id of ids){
   assert.equal(app.panel().dataset.exhibitId,id);assert.deepEqual(app.order(),orders.get(id));assert.equal(app.action('next').disabled,false);
   assert.equal(app.cls('tea-museum-feedback').textContent,feedbackById.get(id));assert.deepEqual(app.nodes(n=>n.dataset.action==='answer').map(n=>n.attrs['aria-pressed']),pressedById.get(id));app.tap('next');
  }
  if(visit<3){
   assert(app.action('more'));assert(!app.action('restart'),'Next visit cannot clear history');
   staleMore=app.action('more');app.tap('more');const nextVisit=app.panel();staleMore.click();staleReview.click();assert.equal(app.panel(),nextVisit);
  }else{assert(!app.action('more'));assert(app.action('restart'));}
 }
 assert.equal(seen.size,total);assert.deepEqual(new Set(galleryIds(app.cls('tea-museum-collection'))),seen);
 for(const e of data.exhibits)assert(app.cls('tea-museum-collection').textContent.includes(e.explanation[lang]));
 const staleReview=app.action('review');app.tap('restart');assert.equal(app.action('next').disabled,true);assert.equal(progress(app).value,0);
 assert.equal(app.cls('tea-museum-collection').hidden,true);assert.equal(galleryIds(app.cls('tea-museum-collection')).length,0);
 staleReview.click();staleMore.click();staleAnswer.click();staleReveal.click();assert.equal(app.action('next').disabled,true);
 const resetSeen=new Set();let changedOrders=false;
 for(let i=0;i<total;i++){
  const e=exhibitFor(app);assert(!resetSeen.has(e.id));resetSeen.add(e.id);assert.equal(app.action('next').disabled,true);assert.equal(app.cls('tea-museum-hint').hidden,true);
  if(app.order().join(',')!==orders.get(e.id).join(','))changedOrders=true;
  app.tap('reveal');app.tap('next');if(i%3===2&&i<total-1)app.tap('more');
 }
 assert(changedOrders,'Reset regenerates choices');assert.equal(app.cls('tea-museum-status').textContent,'');
 assert(!app.host.textContent.includes('undefined'));assert(!/\{(?:total|visit|next|remaining|n|size)\}/.test(app.host.textContent));
 const mounted=app.host.children[0];vm.runInNewContext(uiJS,app.ctx);assert.equal(app.host.children[0],mounted);
 for(const e of data.exhibits){
  const art=locale=>app.ctx.window.TeaMuseumFigures.figure(e.id,locale)||app.ctx.window.TeaGameFigures.figure(e.icon,locale);
  const figure=art(lang),svg=figure.children[0];assert.equal(figure.className,'tea-game-figure');assert.equal(svg.attrs['aria-hidden'],'true');assert.equal(svg.attrs.focusable,'false');assert(figure.children[1].textContent.trim());assert.equal(all(svg,n=>n.tagName==='text').length,0);
  if(lang!=='en')assert.notEqual(figure.children[1].textContent,art('en').children[1].textContent);
 }
}
// Every answer path across every exhibit and locale, through all four short visits.
const headings={correct:['A careful correction.','這個修正很準確。','这个修正很准确。'],wrong:['Let’s restore this one together.','一起修正這張說明牌吧。','一起修正这张说明牌吧。'],reveal:['Here is the evidence.','來看看證據。','来看看证据。']};
for(const [li,lang] of locales.entries())for(const mode of ['correct','wrong','reveal']){
 const app=mount(lang);app.tap('start');const ids=new Set();
 for(let i=0;i<total;i++){
  const e=exhibitFor(app);assert(!ids.has(e.id));ids.add(e.id);const choice=mode==='correct'?e.correct:e.choices.find(c=>c.id!==e.correct).id;
  if(mode==='reveal')app.tap('reveal');else app.answer(choice);
  assert.equal(app.cls('tea-museum-feedback').firstElementChild.textContent,headings[mode][li],`${e.id}/${lang}/${mode}`);
  assert(app.cls('tea-museum-plaque').textContent.includes(e.choices.find(c=>c.id===e.correct).label[lang]));
  for(const b of app.nodes(n=>n.dataset.action==='answer')){assert.equal(b.dataset.correct,String(b.dataset.answer===e.correct));assert.equal(b.attrs['aria-pressed'],String(mode!=='reveal'&&b.dataset.answer===choice));}
  app.tap('next');if(i%3===2&&i<total-1)app.tap('more');
 }
 assert.equal(app.panel().dataset.mode,'summary');assert.equal(ids.size,total);
}
// A future collection size need not divide by three; the final visit is shorter.
for(const count of [1,2,4,5,7,11]){
 const app=mount('en',{count});app.tap('start');const seen=new Set();
 for(let i=0;i<count;i++){
  assert.equal(progress(app).max,Math.min(3,count-Math.floor(i/3)*3));const id=app.panel().dataset.exhibitId;assert(!seen.has(id));seen.add(id);
  app.tap('reveal');app.tap('next');if(i%3===2&&i<count-1)app.tap('more');
 }
 assert.equal(app.panel().dataset.mode,'summary');assert(!app.action('more'));assert(app.action('restart'));
}
const orders=new Set(),firstVisits=new Set();
for(let n=1;n<30;n++){
 const a=mount('en',{seed:n});a.tap('start');orders.add(a.order().join(','));const ids=[];
 for(let i=0;i<3;i++){ids.push(a.panel().dataset.exhibitId);a.tap('reveal');a.tap('next');}firstVisits.add(ids.join(','));
}
assert(orders.size>1);assert(firstVisits.size>1,'Exhibits genuinely vary between visits');
for(const options of [{noJS:true},{noData:true},{invalidData:true},{failAt:3},{failAt:100}]){const a=mount('en',options);assert.equal(a.host.textContent,'Reading fallback');assert(!a.host.dataset.museumReady);}
const unsupported=mount('unsupported');assert.equal(unsupported.action('start').textContent,'Explore 3 displays');
assert(!/localStorage|sessionStorage|fetch\(|XMLHttpRequest|innerHTML/.test(uiJS));
console.log('PASS: 12 exhibits × 3 locales × every answer path; 3-display randomized visits; no repeats until exhausted; short summaries; cumulative collapsed history; all-label reading gallery; preserved choices and hints; stale and repeated controls; reset; partial visits; fallback; localized accessible figures.');
