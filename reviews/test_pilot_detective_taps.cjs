'use strict';
// Lightweight fake-DOM regression only. Keyboard/layout require the browser suite.
const fs=require('fs'), vm=require('vm'), assert=require('node:assert/strict');
class Node {
 constructor(tag,text=''){this.tagName=tag;this._text=text;this.children=[];this.dataset={};this.attrs={};this.events={};this.value='';this.hidden=false;this.open=false;this.disabled=false;}
 set textContent(s){this._text=String(s);this.children=[];}
 get textContent(){return this._text+this.children.map(c=>c.textContent).join('');}
 append(...nodes){for(const n of nodes){if(n.tagName==='#fragment')this.children.push(...n.children);else this.children.push(n)}}
 replaceChildren(...nodes){this.children=[];this._text='';this.append(...nodes)}
 setAttribute(k,v){this.attrs[k]=String(v)} removeAttribute(k){delete this.attrs[k]}
 addEventListener(k,fn){this.events[k]=fn} focus(){global.focused=this} fire(k){this.events[k]?.()}
}
const find=(root,p)=>[root,...root.children.flatMap(c=>find(c,p))].filter(p);
const source=fs.readFileSync('assets/tea-label-detective.js','utf8');
// Read authored fixture data, not private runtime/deck state.
const fixtureContext={};
vm.runInNewContext(source.slice(0,source.indexOf('  let instance = 0;'))+'globalThis.fixture=JSON.stringify({labels,guides});})();',fixtureContext);
const {labels,guides}=JSON.parse(fixtureContext.fixture);
assert.equal(labels.length,15);assert.equal(guides.length,15);
const originalAccepted=[['origin','particle','type'],['style','type','tier'],['style','preparation'],['blend','type'],[['origin','style'],'type'],['blend','unknown','unknown'],[['preparation','blend'],'style']];
assert.deepEqual(labels.slice(0,7).map(l=>l.clues.map(c=>c.answers)),originalAccepted.map(l=>l.map(c=>[c].flat())),'Original 17 classifications remain unchanged');
const featured=[1,2,0,0,0,2,1,...Array(8).fill(0)];
const titles={en:['That reading fits this label.','Here is a more useful reading of this label.','Let’s read this word together.'],'zh-hant-hk':['這個理解適合這張標籤。','這張標籤可以這樣理解。','一起看看這個詞。'],'zh-hans':['这个理解适合这张标签。','这张标签可以这样理解。','一起看看这个词。']};
const seeded=seed=>()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
function mount(locale='en',random=seeded(42),script=source,hosts){
 hosts ||= [new Node('div')];hosts.forEach(h=>{h.dataset.locale ||= locale;h.append(new Node('p','Fallback'));});
 const doc={readyState:'complete',querySelectorAll:()=>hosts,createElement:t=>new Node(t),createDocumentFragment:()=>new Node('#fragment'),createTextNode:t=>new Node('#text',t)};
 const math=Object.create(Math);math.random=random;const ctx={document:doc,console,Math:math};vm.runInNewContext(script,ctx);
 const api=host=>{
  const cls=c=>find(host,n=>n.className===c), action=name=>find(host,n=>n.dataset.action===name)[0];
  return {host,cls,action,panel:()=>cls('tea-lab-detective-panel')[0],category:()=>cls('tea-lab-detective-categories')[0]?.children||[],feedback:()=>cls('tea-lab-detective-feedback')[0],status:()=>cls('tea-lab-detective-status')[0],packet:p=>cls('tea-lab-detective-labels')[0].children[p].fire('click'),clue:c=>cls('tea-lab-detective-clues')[0].children[c+1].fire('click'),tap:name=>{assert(action(name),`Missing ${name}`);action(name).fire('click');},selected:()=>find(host,n=>n.dataset.category&&n.attrs['aria-pressed']==='true').map(n=>n.dataset.category),position:()=>[Number(cls('tea-lab-detective-panel')[0].dataset.labelIndex),Number(cls('tea-lab-detective-panel')[0].dataset.clueIndex)]};
 };return {apis:hosts.map(api),ctx};
}
for(const locale of Object.keys(titles)){
 const {apis:[a],ctx}=mount(locale);const qmd=fs.readFileSync((locale==='en'?'':locale+'/')+'tea-labels.qmd','utf8');
 assert.equal(a.host.dataset.teaDetectiveReady,'true');assert.equal(a.panel().dataset.mode,'round');
 assert.equal(find(a.host,n=>['input','select','textarea'].includes(n.tagName)).length,0);
 assert.equal(a.cls('tea-lab-detective-labels')[0].children.length,15);
 assert(find(a.host,n=>n.tagName==='details').every(n=>!n.open));
 assert.equal(a.status().attrs.role,'status');assert.equal(a.status().attrs['aria-atomic'],'true');
 const initial=a.position();assert.equal(initial[1],featured[initial[0]]);assert(a.action('round-next').disabled);
 assert.equal(a.action('round-next').textContent,{en:'Next label →','zh-hant-hk':'下一張標籤 →','zh-hans':'下一张标签 →'}[locale]);
 assert.equal(a.action('round-prev').textContent,{en:'← Previous label','zh-hant-hk':'← 上一張標籤','zh-hans':'← 上一张标签'}[locale]);
 assert(a.action('round-prev').disabled);a.tap('round-prev');assert.deepEqual(a.position(),initial);
 a.tap('explore-label');assert.equal(a.panel().dataset.mode,'explore');assert.deepEqual(a.position(),initial);a.tap('return-round');assert.deepEqual(a.position(),initial);
 a.tap('round-next');assert.deepEqual(a.position(),initial,'Disabled next handler cannot skip');
 a.tap('reveal');const roundFeedback=a.feedback().textContent;
 let checks=0,reveals=0;
 for(let p=0;p<labels.length;p++){
  a.packet(p);assert.equal(a.panel().dataset.mode,'explore');assert(!a.cls('tea-lab-detective-picker')[0].open);
  assert.equal(a.cls('tea-lab-detective-clues')[0].children.length-1,labels[p].clues.length);
  for(let c=0;c<labels[p].clues.length;c++){
   a.clue(c);assert.deepEqual(a.position(),[p,c]);assert.equal(global.focused.tagName,'h4');
   const heading=find(a.host,n=>n.tagName==='h4')[0],hint=a.cls('tea-lab-detective-hint')[0],group=a.cls('tea-lab-detective-classification')[0];
   assert.equal(group.attrs['aria-labelledby'],heading.id);assert.equal(group.attrs['aria-describedby'],hint.id);assert(hint.textContent.includes(guides[p][c].hint[locale]));
   assert.deepEqual(a.category().map(b=>b.dataset.category),guides[p][c].choices);
   for(const value of labels[p].clues[c].answers)assert(a.category().some(b=>b.dataset.category===value));
   for(const b of a.category()){
    b.focus();b.fire('click');assert.equal(global.focused,b);assert.deepEqual(a.selected(),[b.dataset.category]);
    assert.equal(a.feedback().children[0].textContent,titles[locale][labels[p].clues[c].answers.includes(b.dataset.category)?0:1]);
    assert(!a.feedback().textContent.includes('undefined'));assert(a.status().textContent.length>60);
    const links=find(a.feedback(),n=>n.tagName==='a');assert.equal(links.length,1);assert.equal(links[0].href,guides[p][c].source);
    const anchor=links[0].href.slice(1);assert(qmd.includes(`id="${anchor}"`)||qmd.includes(`#${anchor}}`),anchor);checks++;
   }
   a.tap('retry');assert.deepEqual(a.selected(),[]);assert.equal(a.feedback().textContent,'');assert.equal(a.status().textContent,'');assert.equal(global.focused,a.category()[0]);
   a.tap('reveal');assert.equal(a.feedback().children[0].textContent,titles[locale][2]);assert.equal(global.focused,a.feedback().children[0]);assert.deepEqual(a.selected(),[]);
   const revealed=a.feedback().textContent;a.clue((c+1)%labels[p].clues.length);a.clue(c);assert.equal(a.feedback().textContent,revealed);
   a.packet((p+1)%labels.length);a.packet(p);assert.equal(a.feedback().textContent,revealed);
   a.tap('retry');a.packet((p+1)%labels.length);a.packet(p);assert.equal(a.feedback().textContent,'');reveals++;
  }
 }
 assert.equal(reveals,33);assert.equal(checks,99);
 a.packet(0);a.clue(0);a.category().find(b=>b.dataset.category==='origin').fire('click');a.clue(1);a.tap('reveal');a.tap('retry');a.clue(0);assert.deepEqual(a.selected(),['origin']);
 a.tap('explore-prev');assert.deepEqual(a.position(),[14,labels[14].clues.length-1]);a.tap('explore-next');assert.deepEqual(a.position(),[0,0]);assert.deepEqual(a.selected(),['origin']);
 a.tap('return-round');assert.equal(a.panel().dataset.mode,'round');assert.deepEqual(a.position(),initial);assert.equal(a.feedback().textContent,roundFeedback,'Explore retry does not alter round answer');
 const before=a.host.children[0];vm.runInNewContext(source,ctx);assert.equal(a.host.children[0],before);
 console.log(`${locale}: ${checks} choices, ${reveals} reveals, all original alternatives, sources, retention/retry, explore isolation and duplicate init: PASS (fake DOM)`);
}
function cycle(random,pool=15,locale='en'){
 const script=pool===15?source:source.replace('  let instance = 0;',`  labels.splice(${pool}); guides.splice(${pool});\n  let instance = 0;`);
 const {apis:[a]}=mount(locale,random,script);const seen=[];
 const doubleTap=name=>{const b=a.action(name);b.fire('click');const position=a.position(),mode=a.panel().dataset.mode;b.fire('click');assert.deepEqual(a.position(),position,`Stale ${name} must not skip`);assert.equal(a.panel().dataset.mode,mode);};
 while(seen.length<pool){
  const batch=[];const size=Math.min(5,pool-seen.length);
  for(let i=0;i<size;i++){
   assert.equal(a.panel().dataset.mode,'round');const current=a.position();assert.equal(current[1],featured[current[0]]);assert(!seen.includes(current[0]));batch.push(current[0]);seen.push(current[0]);
   assert(a.action('round-next').disabled);a.tap('round-next');assert.deepEqual(a.position(),current);
   if(i){doubleTap('round-prev');assert.equal(a.position()[0],batch[i-1]);assert(!a.action('round-next').disabled);a.tap('round-next');assert.deepEqual(a.position(),current);}
   if(i%2)a.category()[0].fire('click');else a.tap('reveal');assert(!a.action('round-next').disabled);
   a.tap('retry');assert(a.action('round-next').disabled);a.tap('reveal');
   a.packet(current[0]);assert.equal(a.panel().dataset.mode,'explore');a.tap('return-round');assert.deepEqual(a.position(),current);assert(!a.action('round-next').disabled);
   doubleTap('round-next');
  }
  assert.equal(a.panel().dataset.mode,'summary');const summary=a.cls('tea-lab-detective-summary')[0];assert(summary);assert.equal(find(summary,n=>n.tagName==='li').length,size);
  for(const p of batch)assert(summary.textContent.includes(labels[p].clues[featured[p]].why[locale]),'Summary teaches each featured reading');
  a.tap('review-round');a.tap('explore-label');a.tap('return-round');assert.equal(a.panel().dataset.mode,'round','Review exploration returns to review, not summary');for(const p of batch){assert.equal(a.position()[0],p);assert(!a.action('round-next').disabled);a.tap('round-next');}assert.equal(a.panel().dataset.mode,'summary');
  assert(!a.action('round-next'));assert(!a.action('more')=== (seen.length===pool));assert(!a.action('reshuffle')=== (seen.length<pool));
  a.packet(0);a.tap('return-round');assert.equal(a.panel().dataset.mode,'summary','Return retains summary');
  if(seen.length<pool)doubleTap('more');
 }
 assert.equal(new Set(seen).size,pool);doubleTap('reshuffle');assert.equal(a.panel().dataset.mode,'round');assert(a.action('round-next').disabled);assert.equal(a.feedback().textContent,'');
 return seen;
}
const zero=cycle(()=>0),high=cycle(()=>0.999999999),seed=cycle(seeded(12345));
assert.deepEqual(zero,[...Array.from({length:14},(_,i)=>i+1),0],'Fisher–Yates zero boundary');
assert.deepEqual(high,Array.from({length:15},(_,i)=>i),'Fisher–Yates near-one boundary');
assert.deepEqual(seed,cycle(seeded(12345)),'Seeded deck reproducible');assert.notDeepEqual(seed,high);cycle(seeded(9),13);cycle(seeded(7),3);cycle(seeded(14),15,'zh-hant-hk');cycle(seeded(21),15,'zh-hans');
console.log('Full 15-label decks, RNG boundaries, seed repeatability, previous/retry, summary return, explicit exhaustion and short rounds: PASS (fake DOM)');
for(const failAt of [1,25,40]){
 const host=new Node('div');host.append(new Node('p','Fallback preserved'));let creates=0;
 vm.runInNewContext(source,{document:{readyState:'complete',querySelectorAll:()=>[host],createElement:t=>{if(++creates===failAt)throw Error('simulated');return new Node(t)},createDocumentFragment:()=>new Node('#fragment'),createTextNode:t=>new Node('#text',t)},console:{error:()=>{}}});
 assert(creates>=failAt);assert.equal(host.textContent,'Fallback preserved');assert(!host.dataset.teaDetectiveReady);
}
{
 const hosts=[new Node('div'),new Node('div')];hosts[0].dataset.locale='invalid';hosts[1].dataset.locale='zh-hans';
 const {apis:[a,b]}=mount('en',seeded(12),source,hosts);assert.equal(hosts[0].children[0].lang,'en');assert.equal(hosts[1].children[0].lang,'zh-Hans');
 const ids=hosts.flatMap(h=>find(h,n=>n.id).map(n=>n.id));assert.equal(new Set(ids).size,ids.length);
 const pos=b.position();a.tap('reveal');a.tap('round-next');assert.deepEqual(b.position(),pos);assert.equal(b.feedback().textContent,'');assert(b.action('round-next').disabled);
}
{
 const host=new Node('div');host.append(new Node('p','Fallback'));let boot;
 vm.runInNewContext(source,{document:{readyState:'loading',addEventListener:(event,fn,options)=>{assert.equal(event,'DOMContentLoaded');assert(options.once);boot=fn},querySelectorAll:()=>[host],createElement:t=>new Node(t),createDocumentFragment:()=>new Node('#fragment'),createTextNode:t=>new Node('#text',t)},console});
 assert.equal(host.textContent,'Fallback');boot();assert.equal(host.dataset.teaDetectiveReady,'true');const before=host.children[0];boot();assert.equal(host.children[0],before);
}
console.log('Detached enhancement failure, deferred boot, locale fallback, independent instances: PASS (fake DOM, not browser)');
