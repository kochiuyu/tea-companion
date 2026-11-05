#!/usr/bin/env node
'use strict';
/* Dependency-free model/DOM tests. Does not substitute for browser/visual QA.
   Run: node reviews/test_tea_table_dom.cjs */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const data=fs.readFileSync(path.join(root,'assets/tea-table-data.js'),'utf8');
const source=fs.readFileSync(path.join(root,'assets/tea-table-game.js'),'utf8');
const walk = node => [node,...node.children.flatMap(walk)];
const match = (node, selector) => {
  const attrs = [...selector.matchAll(/\[([\w-]+)(?:="([^"]*)")?\]/g)];
  const plain = selector.replace(/\[[^\]]+\]/g,'');
  const tag = plain.match(/^[\w-]+/);
  if (tag && node.tagName !== tag[0]) return false;
  const cls = plain.match(/\.([\w-]+)/);
  if (cls && !node.className.split(/\s+/).includes(cls[1])) return false;
  return attrs.every(([,key,value]) => node.getAttribute(key) !== null && (value === undefined || node.getAttribute(key) === value));
};
class Element {
  constructor(tag, document) { this.tagName=tag;this.ownerDocument=document;this.children=[];this.parent=null;this.dataset={};this.attrs={};this.events={};this.disabled=false;this.hidden=false;this.className='';this._text=''; }
  set textContent(text) {this._text=String(text);this.children.forEach(n=>n.parent=null);this.children=[];}
  get textContent() {return this._text+this.children.map(n=>n.textContent).join('');}
  append(...items) {for(const node of items){node.parent=this;this.children.push(node);}}
  replaceChildren(...items) {this._text='';this.children.forEach(n=>n.parent=null);this.children=[];this.append(...items);}
  setAttribute(key,value) { if(key.startsWith('data-')) this.dataset[key.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]=String(value);else this.attrs[key]=String(value); }
  getAttribute(key) {if(key.startsWith('data-'))return this.dataset[key.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]??null;return this.attrs[key]??null;}
  querySelectorAll(selector) {return this.children.flatMap(walk).filter(n=>match(n,selector));}
  querySelector(selector) {return this.querySelectorAll(selector)[0]||null;}
  contains(node) {return walk(this).includes(node);}
  closest(selector) {for(let n=this;n;n=n.parent)if(match(n,selector))return n;return null;}
  addEventListener(type,fn) {(this.events[type]??=[]).push(fn);}
  focus() {this.ownerDocument.activeElement=this;}
  click() {if(this.disabled)return;const e={target:this};for(let n=this;n;n=n.parent)for(const fn of n.events.click||[])fn(e);}
}

let combinations=0;const results=[];
for(const locale of ['en','zh-hant-hk','zh-hans']){
 const document={activeElement:null,createElement(tag){return new Element(tag,this);},createElementNS(ns,tag){return new Element(tag,this);},querySelectorAll(selector){return match(host,selector)?[host]:host.querySelectorAll(selector);}};
 const host=new Element('div',document);host.dataset.teaTable='';host.dataset.locale=locale;
 const fallback=new Element('p',document);fallback.textContent='Static fallback';host.append(fallback);
 const context=vm.createContext({document,window:{}});
 vm.runInContext(source,context);assert(host.contains(fallback),'Missing data preserves fallback');
 vm.runInContext(data,context);vm.runInContext(source,context);
 const copy=context.window.TeaTableCopy[locale];
 const game=host.querySelector('.tea-table-game');
 const stage=()=>game.querySelector('.tea-table-stage');
 const action=name=>game.querySelector(`[data-action="${name}"]`);
 const feedback=()=>game.querySelector('.tea-table-feedback');
 const mode=()=>stage().dataset.mode;
 const round=()=>Number(stage().dataset.scene);
 const choose=(j,k)=>action(`choose-${j}-${k}`).click();
 assert(!host.contains(fallback));assert.equal(host.dataset.mounted,'true');
 assert(action('check').disabled);assert(action('next').disabled);assert(action('previous').disabled);assert(action('reset').disabled);assert(feedback().hidden);
 for(let i=0;i<3;i++){
   assert.equal(round(),i);
   assert.equal(game.querySelectorAll('button').length,14);
   assert.equal(game.querySelectorAll('[role="group"]').length,3);
   game.querySelectorAll('[role="group"]').forEach(g=>assert(g.getAttribute('aria-labelledby')));
   assert.equal(game.querySelectorAll('[aria-pressed="true"]').length,0);
   action('check').click();action('next').click();assert.equal(round(),i);
   for(let a=0;a<3;a++)for(let b=0;b<3;b++)for(let c=0;c<3;c++){
     choose(0,0);action('reset').click();assert(feedback().hidden);assert(action('next').disabled);
     assert.equal(document.activeElement,action('choose-0-0'));
     choose(0,a);choose(1,b);assert(action('check').disabled);choose(2,c);
     assert(!action('check').disabled);assert(action('next').disabled);
     const selected=action(`choose-2-${c}`);selected.focus();selected.click();assert.equal(document.activeElement,selected);
     assert.equal(game.querySelectorAll('[aria-pressed="true"]').length,3);
     action('check').focus();action('check').click();
     assert(!feedback().hidden);assert(!action('next').disabled);assert.equal(document.activeElement,action('check'));
     assert.equal(action('check').getAttribute('aria-expanded'),'true');
     const contexts=feedback().querySelectorAll('.tea-table-context');assert.equal(contexts.length,3);
     [a,b,c].forEach((v,j)=>{assert.equal(contexts[j].dataset.matches,String(v===i));assert(contexts[j].textContent.includes(copy.options[j][v]));assert(contexts[j].textContent.includes(copy.scenes[i].why[j]));});
     assert(feedback().textContent.includes(copy.scenes[i].sources[0].name));
     assert(game.querySelector('[role="status"]').textContent.length>15);combinations++;
   }
   // Changing a reviewed choice requires reviewing again; focus remains on the card.
   const changer=action('choose-0-0');changer.focus();changer.click();assert.equal(document.activeElement,changer);
   assert(feedback().hidden);assert(action('next').disabled);assert.equal(action('check').getAttribute('aria-expanded'),'false');
   action('example').click();assert(!feedback().hidden);assert(!action('next').disabled);
   assert.equal(feedback().querySelectorAll('[data-matches="true"]').length,3);
   vm.runInContext(source,context);assert.equal(host.querySelector('.tea-table-game'),game,'Second mount preserves state');
   if(i){const saved=feedback().textContent;action('previous').click();assert.equal(round(),i-1);assert(!feedback().hidden);action('next').click();assert.equal(round(),i);assert.equal(feedback().textContent,saved);}
   const next=action('next');next.click();next.click();assert.equal(round(),Math.min(i+1,2),'Stale next cannot skip a scene');
   assert.equal(document.activeElement,stage().querySelector('h3'));
 }
 assert.equal(mode(),'summary');assert.equal(game.querySelectorAll('.tea-table-summary-card').length,3);
 action('previous').click();assert.equal(round(),2);assert.equal(mode(),'play');assert(!feedback().hidden);action('next').click();
 const restart=action('restart');restart.click();restart.click();assert.equal(mode(),'play');assert.equal(round(),0);assert(feedback().hidden);assert.equal(game.querySelectorAll('[aria-pressed="true"]').length,0);
 for(let i=0;i<3;i++){action('example').click();action('next').click();}
 assert.equal(mode(),'summary');
 results.push({locale,combinations:81,navigation:true,keyboardFocusModel:true,restart:true,missingDataFallback:true,duplicateMount:true});
}
assert.equal(combinations,243);
console.log(JSON.stringify({passed:true,combinations,results},null,2));
