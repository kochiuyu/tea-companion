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
for(const lang of locales){
 const app=mount(lang);assert.equal(app.host.dataset.museumReady,'true');assert.equal(app.panel().dataset.mode,'welcome');
 assert.equal(app.nodes(n=>n.dataset.galleryId).length,total);assert.equal(app.cls('tea-museum-browse').hidden,false);
 assert(app.host.textContent.includes(`${total} displays.`)||app.host.textContent.includes(`${total}件展品`),'Welcome uses expanded count');assert(app.cls('tea-museum-browse').firstElementChild.textContent.includes(String(total)),'Browse uses expanded count');
 const staleStart=app.action('start');app.tap('start');assert.equal(app.panel().dataset.mode,'exhibit');assert.equal(focused,app.cls('tea-museum-progress'));
 staleStart.click();assert.equal(app.panel().dataset.exhibitId,data.exhibits[0].id);
 const seen=new Set(),orders=new Map();let staleAnswer,staleReveal;
 for(let i=0;i<total;i++){
  const e=data.exhibits[i];assert(app.cls('tea-museum-progress').textContent.includes(String(total)),'Progress uses expanded count');assert.equal(app.panel().dataset.exhibitId,e.id);seen.add(e.id);
  if(i>0){staleAnswer.click();staleReveal.click();assert.equal(app.cls('tea-museum-feedback').textContent,'','Stale answers cannot answer the new display');assert.equal(app.action('next').disabled,true);}
  const order=app.order();orders.set(e.id,order);assert.deepEqual([...order].sort(),e.choices.map(c=>c.id).sort());
  assert.equal(app.action('next').disabled,true);app.tap('next');assert.equal(app.panel().dataset.exhibitId,e.id);
  assert.equal(app.action('previous').disabled,i===0);assert.equal(app.cls('tea-museum-hint').hidden,true);
  app.tap('hint');assert.equal(app.cls('tea-museum-hint').hidden,false);assert.equal(app.action('hint').attrs['aria-expanded'],'true');assert.equal(app.cls('tea-museum-status').textContent,e.hint[lang]);
  const oldAnswer=app.action('answer'),oldReveal=app.action('reveal');
  if(i%3===0){const wrong=e.choices.find(c=>c.id!==e.correct).id;app.answer(wrong);assert.equal(app.nodes(n=>n.dataset.answer===wrong)[0].attrs['aria-pressed'],'true');}
  else if(i%3===1){app.answer(e.correct);assert.equal(app.nodes(n=>n.dataset.answer===e.correct)[0].attrs['aria-pressed'],'true');}
  else {app.tap('reveal');assert.equal(focused,app.cls('tea-museum-feedback').firstElementChild);}
  const feedback=app.cls('tea-museum-feedback').textContent;
  assert(feedback.includes(e.explanation[lang]));assert.equal(app.cls('tea-museum-plaque').dataset.restored,'true');assert.equal(app.action('next').disabled,false);
  const pressed=app.nodes(n=>n.dataset.action==='answer').map(n=>n.attrs['aria-pressed']);
  app.answer(e.correct);oldAnswer.click();oldReveal.click();assert.equal(app.cls('tea-museum-feedback').textContent,feedback);assert.deepEqual(app.nodes(n=>n.dataset.action==='answer').map(n=>n.attrs['aria-pressed']),pressed);
  for(const b of app.nodes(n=>n.dataset.action==='answer'))assert.equal(b.attrs['aria-disabled'],'true');
  if(i>0){const id=app.panel().dataset.exhibitId;staleAnswer.click();staleReveal.click();assert.equal(app.panel().dataset.exhibitId,id);assert.equal(app.cls('tea-museum-feedback').textContent,feedback);}
  const staleNext=app.action('next');staleAnswer=oldAnswer;staleReveal=oldReveal;
  app.tap('next');const after=app.panel();staleNext.click();assert.equal(app.panel(),after,'Removed next button cannot skip a display');
  if(i<total-1){app.tap('previous');assert.equal(app.panel().dataset.exhibitId,e.id);assert.deepEqual(app.order(),order);assert.equal(app.cls('tea-museum-hint').hidden,false);assert.equal(app.cls('tea-museum-feedback').textContent,feedback);assert.deepEqual(app.nodes(n=>n.dataset.action==='answer').map(n=>n.attrs['aria-pressed']),pressed);app.tap('next');}
 }
 assert.equal(seen.size,total);assert.equal(app.panel().dataset.mode,'summary');assert.equal(app.cls('tea-museum-browse').hidden,true);
 assert(app.panel().textContent.includes(String(total)),'Summary uses expanded count');
 const gallery=all(app.panel(),n=>n.dataset.galleryId);assert.deepEqual(gallery.map(n=>n.dataset.galleryId),data.exhibits.map(e=>e.id));
 for(const e of data.exhibits)assert(gallery.find(n=>n.dataset.galleryId===e.id).textContent.includes(e.explanation[lang]));
 app.tap('review');assert.equal(app.cls('tea-museum-browse').hidden,false);
 for(const e of data.exhibits){assert.equal(app.panel().dataset.exhibitId,e.id);assert.deepEqual(app.order(),orders.get(e.id));assert.equal(app.action('next').disabled,false);app.tap('next');}
 const staleReview=app.action('review');app.tap('restart');assert.equal(app.panel().dataset.exhibitId,data.exhibits[0].id);assert.equal(app.action('next').disabled,true);assert.equal(app.cls('tea-museum-feedback').textContent,'');assert.equal(app.cls('tea-museum-hint').hidden,true);
 staleReview.click();assert.equal(app.action('next').disabled,true);staleAnswer.click();staleReveal.click();assert.equal(app.action('next').disabled,true);
 let reshuffled=false;for(const e of data.exhibits){assert.equal(app.panel().dataset.exhibitId,e.id);assert.equal(app.action('next').disabled,true,'Reset clears every answer');assert.equal(app.cls('tea-museum-hint').hidden,true,'Reset clears every hint');if(app.order().join(',')!==orders.get(e.id).join(','))reshuffled=true;app.tap('reveal');app.tap('next');}assert(reshuffled,'Fresh visit regenerates choice ordering');
 assert.equal(app.cls('tea-museum-status').textContent,'');assert(!app.host.textContent.includes('undefined'));assert(!app.host.textContent.includes('{total}'));
 const mounted=app.host.children[0];vm.runInNewContext(uiJS,app.ctx);assert.equal(app.host.children[0],mounted,'Idempotent mount');
 for(const e of data.exhibits){
  const art=locale=>app.ctx.window.TeaMuseumFigures.figure(e.id,locale)||app.ctx.window.TeaGameFigures.figure(e.icon,locale);
  const figure=art(lang);assert.equal(figure.className,'tea-game-figure');const svg=figure.children[0];assert.equal(svg.attrs['aria-hidden'],'true');assert.equal(svg.attrs.focusable,'false');assert.equal(svg.attrs.class,'tea-game-art');assert(figure.children[1].textContent.trim());assert.equal(all(svg,n=>n.tagName==='text').length,0);
  if(lang!=='en')assert.notEqual(figure.children[1].textContent,art('en').children[1].textContent);
 }
 assert.equal(app.ctx.window.TeaMuseumFigures.figure('unsupported',lang),null);
}
// Exercise every answer path on every exhibit, rather than rotating paths across exhibits.
const headings={correct:['A careful correction.','這個修正很準確。','这个修正很准确。'],wrong:['Let’s restore this one together.','一起修正這張說明牌吧。','一起修正这张说明牌吧。'],reveal:['Here is the evidence.','來看看證據。','来看看证据。']};
for(const [li,lang] of locales.entries())for(const mode of ['correct','wrong','reveal']){
 const app=mount(lang);app.tap('start');
 for(const e of data.exhibits){
  const choice=mode==='correct'?e.correct:e.choices.find(c=>c.id!==e.correct).id;
  if(mode==='reveal')app.tap('reveal');else app.answer(choice);
  assert.equal(app.cls('tea-museum-feedback').firstElementChild.textContent,headings[mode][li],`${e.id}/${lang}/${mode}`);
  assert(app.cls('tea-museum-plaque').textContent.includes(e.choices.find(c=>c.id===e.correct).label[lang]));
  for(const b of app.nodes(n=>n.dataset.action==='answer')){
   assert.equal(b.dataset.correct,String(b.dataset.answer===e.correct));
   assert.equal(b.attrs['aria-pressed'],String(mode!=='reveal'&&b.dataset.answer===choice));
  }
  app.tap('next');
 }
 assert.equal(app.panel().dataset.mode,'summary');
}
const orders=new Set();for(let n=1;n<30;n++){const a=mount('en',{seed:n});a.tap('start');orders.add(a.order().join(','));}assert(orders.size>1,'Choices genuinely shuffle across seeds');
for(const options of [{noJS:true},{noData:true},{invalidData:true},{failAt:3},{failAt:100}]){const a=mount('en',options);assert.equal(a.host.textContent,'Reading fallback');assert(!a.host.dataset.museumReady);}
const unsupported=mount('unsupported');assert.equal(unsupported.action('start').textContent,'Enter the museum');
assert(!/localStorage|sessionStorage|fetch\(|XMLHttpRequest|innerHTML/.test(uiJS));
console.log('PASS: twelve exhibits × three locales × every answer path; schema and lesson files; hint/reveal; wrong/correct and repeated answers; stale controls; preserved choices; both galleries; revisit/reset; fallback and idempotence; randomized choices; localized accessible original art.');
