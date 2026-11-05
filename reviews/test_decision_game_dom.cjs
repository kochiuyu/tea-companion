#!/usr/bin/env node
'use strict';
/* Dependency-free behavior checks with a minimal DOM shim. This is not a browser,
 * accessibility audit, or visual verification. Run: node reviews/test_decision_game_dom.cjs */
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm'), assert = require('node:assert/strict');
const root = path.resolve(__dirname,'..');
const source = fs.readFileSync(path.join(root,'assets/tea-decision-game.js'),'utf8');
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
const results=[];let outcomes=0,summaries=0;
for(const locale of ['en','zh-hant-hk','zh-hans']) {
  const document={activeElement:null,createElement(tag){return new Element(tag,this);},querySelectorAll(selector){return match(host,selector)?[host]:host.querySelectorAll(selector);}};
  const host=new Element('div',document);host.dataset.teaDecision='';host.dataset.locale=locale;
  const context=vm.createContext({document});vm.runInContext(source,context);
  const game=host.querySelector('.tea-decision-game');
  const stage=()=>game.querySelector('.tea-decision-stage');
  const action=name=>game.querySelector(`[data-action="${name}"]`);
  const feedback=()=>game.querySelector('.tea-decision-feedback');
  const position=()=>Number(stage().dataset.round);
  const state=()=>stage().dataset.mode;
  const values=[{accept:[2,8],reject:[0,0]},{accept:[5,5],reject:[0,0]},{accept:[2,8],reject:[1,1]}];
  assert(action('previous').disabled);assert(action('next').disabled);assert(feedback().hidden);
  for(let round=0;round<3;round++) {
    assert.equal(position(),round);action('next').click();assert.equal(position(),round);
    for(const choice of ['accept','reject','unsure']) {
      const control=action(choice);control.focus();control.click();
      assert.equal(document.activeElement,control);assert.equal(control.getAttribute('aria-pressed'),'true');
      assert.equal(game.querySelectorAll('[aria-pressed="true"]').length,1);
      assert(!feedback().hidden);assert(!action('next').disabled);
      assert.equal(feedback().querySelectorAll('dt').length,4);
      const result=feedback().querySelector('.tea-decision-result');
      if(choice==='unsure')assert.equal(result.dataset.you,undefined);
      else assert.deepEqual([result.dataset.you,result.dataset.other],values[round][choice]);
      assert.equal(feedback().querySelector('a').href,'#decision-game-notes');
      assert(game.querySelector('[role="status"]').textContent.length>15);
      outcomes++;
    }
    const saved=feedback().textContent;
    if(round){action('previous').click();assert.equal(position(),round-1);assert.equal(action('unsure').getAttribute('aria-pressed'),'true');action('next').click();assert.equal(position(),round);assert.equal(feedback().textContent,saved);}
    action('retry').click();assert(feedback().hidden);assert(action('next').disabled);
    assert.equal(document.activeElement,action('accept'));assert.equal(game.querySelector('[role="status"]').textContent,'');
    action('unsure').click();
    vm.runInContext(source,context);assert.equal(host.querySelector('.tea-decision-game'),game,'Second mount preserves state');
    assert.equal(action('unsure').getAttribute('aria-pressed'),'true');
    const next=action('next');next.click();next.click();
    assert.equal(position(),Math.min(round+1,2),'Stale next cannot double-advance');
    assert.equal(document.activeElement,stage().querySelector('h3'));
  }
  assert.equal(state(),'summary');assert.equal(game.querySelector('.tea-decision-summary').children.length,3);
  for(const a of ['accept','reject','unsure'])for(const b of ['accept','reject','unsure'])for(const c of ['accept','reject','unsure']) {
    const restart=action('restart');restart.click();restart.click();
    assert.equal(state(),'play');assert.equal(position(),0);assert(feedback().hidden);assert(action('next').disabled);
    const chosen=[];
    for(const value of [a,b,c]) {action(value).click();chosen.push(feedback().querySelector('.tea-decision-chosen').textContent);action('next').click();}
    assert.equal(state(),'summary');
    const items=game.querySelector('.tea-decision-summary').children;
    assert.equal(items.length,3);
    items.forEach((item,i)=>assert(item.textContent.includes(chosen[i])));
    summaries++;
  }
  results.push(`${locale}: all outcomes, neutral unsure, focus, back/retry, no-skip guards, repeat mount, stale controls and all 27 summary combinations passed`);
}
assert(!/\b(?:fetch|XMLHttpRequest|localStorage|sessionStorage|WebSocket)\b/.test(source),'No network/storage API');
console.log(JSON.stringify({passed:true,method:'Minimal DOM shim; not a browser or visual audit',outcomes,summaries,results},null,2));
