'use strict';
// Logic and DOM-contract checks only. Layout/real keyboard behavior need the browser suite.
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm'), assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const dataSource = fs.readFileSync(path.join(root, 'assets/tea-study-detective-data.js'), 'utf8');
const script = fs.readFileSync(path.join(root, 'assets/tea-study-detective.js'), 'utf8');
const fixture = { window: {} }; vm.runInNewContext(dataSource, fixture);
const data = JSON.parse(JSON.stringify(fixture.window.TeaStudyDetectiveData));
const locales = ['en', 'zh-hant-hk', 'zh-hans'];
let focused;
class Node {
  constructor(tag, text = '') { this.tagName=tag; this._text=text; this.children=[]; this.dataset={}; this.attrs={}; this.events={}; this.hidden=false; this.disabled=false; this.open=false; }
  set textContent(value) { this._text=String(value); this.children=[]; }
  get textContent() { return this._text + this.children.map(c => c.textContent).join(''); }
  get firstElementChild() { return this.children[0]; }
  append(...nodes) { this.children.push(...nodes); }
  replaceChildren(...nodes) { this._text=''; this.children=[]; this.append(...nodes); }
  setAttribute(k,v) { this.attrs[k]=String(v); }
  addEventListener(k,fn) { this.events[k]=fn; }
  focus() { focused=this; }
  click() { this.events.click?.(); }
}
const all = (n, fn) => [n,...n.children.flatMap(c => all(c,fn))].filter(fn);
const seeded = seed => () => ((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
function mount(lang='en', random=seeded(42), failAt=Infinity) {
  const host=new Node('div');host.dataset.locale=lang;host.append(new Node('p','Fallback'));
  let creates=0;
  const doc={readyState:'complete',querySelectorAll:()=>[host],createElement:tag=>{if(++creates===failAt)throw Error('Injected render failure');return new Node(tag);}};
  const math=Object.create(Math);math.random=random;
  const ctx={document:doc,window:{},Math:math,console:{warn(){}}};
  vm.runInNewContext(dataSource,ctx);vm.runInNewContext(script,ctx);
  const api={host,ctx, nodes:fn=>all(host,fn), cls:cls=>all(host,n=>n.className===cls)[0], action:a=>all(host,n=>n.dataset.action===a)[0], panel:()=>all(host,n=>n.className==='tea-study-panel')[0]};
  api.tap=a=>{const b=api.action(a);assert(b,`Missing ${a}`);b.click();};
  api.answers=()=>api.nodes(n=>n.dataset.action==='answer');
  api.browse=i=>api.nodes(n=>n.dataset.action==='browse'&&n.dataset.caseIndex===String(i))[0].click();
  api.index=()=>Number(api.panel().dataset.caseIndex);
  return api;
}
assert.equal(data.cases.length,8);assert.equal(new Set(data.cases.map(c=>c.id)).size,8);
for(const [k, v] of Object.entries(data.ui))for(const l of locales)assert(typeof v[l]==='string'&&v[l].length,`${k} ${l}`);
for(const c of data.cases){
 assert.equal(c.options.length,3);assert(Number.isInteger(c.correct)&&c.correct>=0&&c.correct<3);
 for(const l of locales){
  for(const k of ['topic','headline','story','question','explain','takeaway','sourceTitle'])assert(c[k][l]?.length,`${c.id} ${k} ${l}`);
  for(const o of c.options)assert(o[l]?.length);
  assert(fs.existsSync(path.join(root,l==='en'?'':l,c.source.replace('.html','.qmd'))),`${c.id}: source exists for ${l}`);
 }
}
for(const lang of locales){
 const a=mount(lang);assert.equal(a.host.dataset.teaStudyReady,'true');assert.equal(a.panel().dataset.mode,'round');
 assert.equal(a.nodes(n=>['input','select','textarea'].includes(n.tagName)).length,0);
 assert(a.nodes(n=>n.tagName==='details').every(n=>!n.open));
 assert.equal(a.cls('tea-study-status').attrs.role,'status');
 assert.equal(a.answers().length,3);assert(a.action('next').disabled);a.tap('next');assert.equal(a.panel().dataset.mode,'round');
 const initial=a.index();a.tap('reveal');const saved=a.cls('tea-study-feedback').textContent;
 assert.equal(focused.tagName,'h5');assert(!a.action('next').disabled);
 let choices=0;
 for(let i=0;i<8;i++){
  a.browse(i);assert.equal(a.panel().dataset.mode,'explore');assert.equal(focused.tagName,'h4');assert(!a.cls('tea-study-picker').open);
  for(let n=0;n<3;n++){
   const b=a.answers()[n];b.focus();b.click();assert.equal(focused,b);assert.equal(b.attrs['aria-pressed'],'true');
   assert.equal(a.cls('tea-study-feedback').firstElementChild.textContent,data.ui[n===data.cases[i].correct?'fits':'rethink'][lang]);
   assert(a.cls('tea-study-status').textContent.includes(data.cases[i].explain[lang]));choices++;
  }
  const link=all(a.cls('tea-study-feedback'),n=>n.tagName==='a')[0];assert.equal(link.href,data.cases[i].source);
  a.tap('retry');assert.equal(a.cls('tea-study-feedback').textContent,'');assert.equal(focused,a.answers()[0]);assert(a.action('retry').hidden);assert(!a.action('reveal').hidden);
  a.tap('reveal');assert.equal(a.cls('tea-study-feedback').firstElementChild.textContent,data.ui.together[lang]);assert.equal(focused.tagName,'h5');
  const feedback=a.cls('tea-study-feedback').textContent;a.browse((i+1)%8);a.browse(i);assert.equal(a.cls('tea-study-feedback').textContent,feedback,'Explore retains answers');
 }
 a.browse(initial);a.tap('retry');a.tap('return');assert.equal(a.index(),initial);assert.equal(a.cls('tea-study-feedback').textContent,saved,'Explore retry leaves round answer intact');
 const original=a.host.firstElementChild;vm.runInNewContext(script,a.ctx);assert.equal(a.host.firstElementChild,original,'Duplicate init no-op');
 console.log(`${lang}: ${choices} tap choices, 8 reveals/retries, source paths, retention, round isolation, focus contracts and duplicate init PASS`);
}
function cycle(random){
 const a=mount('en',random),seen=[];
 const double=aName=>{const old=a.action(aName);old.click();const before=a.panel();old.click();assert.equal(a.panel(),before,'Stale button cannot skip');};
 for(let batch=0;batch<2;batch++){
  const current=[];
  for(let n=0;n<4;n++){
   const id=a.index();assert(!seen.includes(id));seen.push(id);current.push(id);assert(a.action('next').disabled);
   if(n){double('previous');assert.equal(a.index(),current[n-1]);a.tap('next');assert.equal(a.index(),id);}
   a.tap('reveal');a.tap('retry');assert(a.action('next').disabled);a.tap('next');assert.equal(a.index(),id);a.tap('reveal');double('next');
  }
  assert.equal(a.panel().dataset.mode,'summary');assert.equal(all(a.cls('tea-study-takeaways'),n=>n.tagName==='li').length,4);
  a.browse(0);a.tap('return');assert.equal(a.panel().dataset.mode,'summary');
  a.tap('review');for(const i of current){assert.equal(a.index(),i);assert(!a.action('next').disabled);a.tap('next');}
  assert.equal(a.panel().dataset.mode,'summary');
  if(batch===0)double('more');else double('restart');
 }
 assert.equal(new Set(seen).size,8);assert.equal(a.panel().dataset.mode,'round');assert(a.action('next').disabled);assert.equal(a.cls('tea-study-feedback').textContent,'');return seen;
}
assert.deepEqual(cycle(()=>0),[1,2,3,4,5,6,7,0]);assert.deepEqual(cycle(()=>.999999),[0,1,2,3,4,5,6,7]);assert.deepEqual(cycle(seeded(71)),cycle(seeded(71)));
for(const n of [1,20,35]){const a=mount('en',seeded(1),n);assert.equal(a.host.textContent,'Fallback');assert(!a.host.dataset.teaStudyReady);}
const fallback=mount('unknown');assert.equal(fallback.cls('tea-study').firstElementChild.textContent,data.ui.title.en);
console.log('Eight-case decks, seeded shuffle, RNG boundaries, previous/retry, summary/explore return, exhaustion, fresh reset and render-failure fallback PASS');
