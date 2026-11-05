'use strict';
// Lightweight DOM regression. Real keyboard/layout checks live in the browser suite.
const fs=require('fs'), vm=require('vm'), assert=require('assert');
class Node {
 constructor(tag,text=''){this.tagName=tag;this._text=text;this.children=[];this.dataset={};this.attrs={};this.events={};this.value='';this.hidden=false;this.open=false;}
 set textContent(s){this._text=String(s);this.children=[];}
 get textContent(){return this._text+this.children.map(c=>c.textContent).join('');}
 append(...nodes){for(const n of nodes){if(n.tagName==='#fragment')this.children.push(...n.children);else this.children.push(n)}}
 replaceChildren(...nodes){this.children=[];this._text='';this.append(...nodes)}
 setAttribute(k,v){this.attrs[k]=String(v)} removeAttribute(k){delete this.attrs[k]}
 addEventListener(k,fn){this.events[k]=fn} focus(){global.focused=this} fire(k){this.events[k]?.()}
}
const find=(root,p)=>[root,...root.children.flatMap(c=>find(c,p))].filter(p);
const source=fs.readFileSync('assets/tea-label-detective.js','utf8');
const accepted=[['origin','particle','type'],['style','type','tier'],['style','preparation'],['blend','type'],[['origin','style'],'type'],['blend','unknown','unknown'],[['preparation','blend'],'style']];
const guides=JSON.parse(source.match(/const guides = (\[[\s\S]*?\n\]);/)[1]);
const titles={en:['That reading fits this label.','Here is a more useful reading of this label.','Let’s read this word together.'],'zh-hant-hk':['這個理解適合這張標籤。','這張標籤可以這樣理解。','一起看看這個詞。'],'zh-hans':['这个理解适合这张标签。','这张标签可以这样理解。','一起看看这个词。']};
let totalChoices=0,totalReveals=0;
for(const locale of ['en','zh-hant-hk','zh-hans']){
 const qmd=fs.readFileSync((locale==='en'?'':locale+'/')+'tea-labels.qmd','utf8');
 const host=new Node('div');host.dataset.locale=locale;host.append(new Node('p','Fallback'));
 const doc={readyState:'complete',querySelectorAll:()=>[host],createElement:t=>new Node(t),createDocumentFragment:()=>new Node('#fragment'),createTextNode:t=>new Node('#text',t)};
 const ctx={document:doc,console};vm.runInNewContext(source,ctx);
 assert.equal(host.dataset.teaDetectiveReady,'true');
 const nodes=t=>find(host,n=>n.tagName===t), cls=c=>find(host,n=>n.className===c);
 const packet=()=>cls('tea-lab-detective-labels')[0].children;
 const category=()=>cls('tea-lab-detective-categories')[0].children;
 const action=name=>find(host,n=>n.dataset.action===name)[0];
 const choosePacket=p=>packet()[p].fire('click');
 const chooseClue=c=>cls('tea-lab-detective-clues')[0].children[c+1].fire('click');
 const selected=()=>category().filter(b=>b.attrs['aria-pressed']==='true').map(b=>b.dataset.category);
 const feedback=()=>cls('tea-lab-detective-feedback')[0];
 const status=()=>cls('tea-lab-detective-status')[0];
 const retry=()=>{action('retry').fire('click');assert.deepEqual(selected(),[]);assert.equal(feedback().textContent,'');assert.equal(status().textContent,'');assert.equal(global.focused,category()[0]);assert(action('retry').hidden);assert(!action('reveal').hidden);};
 assert.equal(nodes('select').length+nodes('input').length+nodes('textarea').length,0);
 assert.equal(packet().length,7);assert.equal(nodes('details').length,2);assert(nodes('details').every(n=>!n.open));
 assert.equal(status().attrs.role,'status');assert.equal(status().attrs['aria-atomic'],'true');
 let checks=0,reveals=0,clueCount=0;
 for(let p=0;p<7;p++){
  choosePacket(p);assert.equal(packet()[p].attrs['aria-pressed'],'true');assert(!cls('tea-lab-detective-picker')[0].open);
  const count=cls('tea-lab-detective-clues')[0].children.length-1;assert.equal(count,accepted[p].length);clueCount+=count;
  for(let c=0;c<count;c++){
   chooseClue(c);assert.equal(global.focused.tagName,'h4');
   const heading=nodes('h4')[0],hint=cls('tea-lab-detective-hint')[0],group=cls('tea-lab-detective-classification')[0];
   assert.equal(group.attrs['aria-labelledby'],heading.id);assert.equal(group.attrs['aria-describedby'],hint.id);
   assert(hint.textContent.includes(guides[p][c].hint[locale]));
   const progress=cls('tea-lab-detective-progress')[0].textContent;
   assert.deepEqual(progress.match(/\d+/g).map(Number),[p+1,7,c+1,count]);
   assert.equal(category().length,3);assert.equal(new Set(category().map(b=>b.dataset.category)).size,3);
   assert.deepEqual(category().map(b=>b.dataset.category),guides[p][c].choices);
   for(const value of [accepted[p][c]].flat())assert(category().some(b=>b.dataset.category===value),'Every accepted meaning is available');
   for(const button of category()){
    button.focus();button.fire('click');assert.equal(global.focused,button,'answer keeps keyboard focus');assert.deepEqual(selected(),[button.dataset.category]);
    const fits=[accepted[p][c]].flat().includes(button.dataset.category);
    assert.equal(feedback().children[0].textContent,titles[locale][fits?0:1]);
    assert(feedback().textContent.length>60&&!feedback().textContent.includes('undefined'));assert(status().textContent.length>60);
    assert(action('reveal').hidden);assert(!action('retry').hidden);
    const links=find(feedback(),n=>n.tagName==='a');assert.equal(links.length,1);assert.equal(links[0].href,guides[p][c].source);
    const anchor=links[0].href.slice(1);assert(qmd.includes(`id="${anchor}"`)||qmd.includes(`#${anchor}}`),'Feedback source anchor exists');checks++;
   }
   retry();action('reveal').fire('click');assert.deepEqual(selected(),[]);assert.equal(feedback().children[0].textContent,titles[locale][2]);assert.equal(global.focused,feedback().children[0]);
   assert(!action('retry').hidden);assert(action('reveal').hidden);assert(status().textContent.startsWith(titles[locale][2]));
   const revealed=feedback().textContent;
   chooseClue((c+1)%count);chooseClue(c);assert.equal(feedback().textContent,revealed);assert.deepEqual(selected(),[]);
   choosePacket((p+1)%7);choosePacket(p);assert.equal(feedback().textContent,revealed);assert.deepEqual(selected(),[]);
   retry();choosePacket((p+1)%7);choosePacket(p);assert.equal(feedback().textContent,'');reveals++;
  }
 }
 assert.equal(clueCount,17);assert.equal(checks,51);assert.equal(reveals,17);totalChoices+=checks;totalReveals+=reveals;
 // Resetting one clue must not reset a different clue, including within a packet.
 choosePacket(0);chooseClue(0);category().find(b=>b.dataset.category==='origin').fire('click');
 chooseClue(1);action('reveal').fire('click');retry();chooseClue(0);assert.deepEqual(selected(),['origin']);
 choosePacket(1);choosePacket(0);assert.deepEqual(selected(),['origin']);retry();
 const nav=()=>cls('tea-lab-detective-actions')[1].children;
 assert.equal(nav()[0].textContent,{en:'← Last label','zh-hant-hk':'← 最後一張標籤','zh-hans':'← 最后一张标签'}[locale]);
 nav()[0].fire('click');assert.equal(packet()[6].attrs['aria-pressed'],'true');
 assert.equal(nav()[1].textContent,{en:'Back to the first label →','zh-hant-hk':'返回第一張標籤 →','zh-hans':'返回第一张标签 →'}[locale]);
 nav()[1].fire('click');assert.equal(packet()[0].attrs['aria-pressed'],'true');assert.deepEqual(selected(),[]);
 const before=host.children[0];vm.runInNewContext(source,ctx);assert.equal(host.children[0],before);
 console.log(locale,checks,'choice cases;',reveals,'neutral reveals; alternatives, sources, accessibility, retention, retry, wrap and duplicate init: PASS');
}
assert.equal(totalChoices,153);assert.equal(totalReveals,51);
for(const failAt of [1,25,40]){
 const host=new Node('div');host.append(new Node('p','Fallback preserved'));let creates=0;
 vm.runInNewContext(source,{document:{readyState:'complete',querySelectorAll:()=>[host],createElement:t=>{if(++creates===failAt)throw Error('simulated');return new Node(t)},createDocumentFragment:()=>new Node('#fragment'),createTextNode:t=>new Node('#text',t)},console:{error:()=>{}}});
 assert(creates>=failAt, 'Injected failure must execute');assert.equal(host.textContent,'Fallback preserved');assert(!host.dataset.teaDetectiveReady);
}
console.log('Detached enhancement failures preserve fallback: PASS');
// Deferred boot, unknown locale fallback, and independent multiple instances.
{
 const hosts=[new Node('div'),new Node('div')];hosts.forEach(h=>h.append(new Node('p','Fallback')));hosts[0].dataset.locale='not-a-locale';hosts[1].dataset.locale='zh-hans';
 let boot;
 const doc={readyState:'loading',addEventListener:(event,fn,options)=>{assert.equal(event,'DOMContentLoaded');assert(options.once);boot=fn},querySelectorAll:()=>hosts,createElement:t=>new Node(t),createDocumentFragment:()=>new Node('#fragment'),createTextNode:t=>new Node('#text',t)};
 vm.runInNewContext(source,{document:doc,console});assert(hosts.every(h=>h.textContent==='Fallback'));boot();
 assert.equal(hosts[0].children[0].lang,'en');assert.equal(hosts[1].children[0].lang,'zh-Hans');
 const ids=hosts.flatMap(h=>find(h,n=>n.id).map(n=>n.id));assert.equal(new Set(ids).size,ids.length);
 const before=hosts.map(h=>h.children[0]);boot();assert(hosts.every((h,i)=>h.children[0]===before[i]));
}
console.log('Deferred boot, locale fallback, multiple instances: PASS');
