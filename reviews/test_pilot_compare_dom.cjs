#!/usr/bin/env node
'use strict';
/* Dependency-free behavioral regression. This small DOM is not browser QA. */
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm'), assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'assets/tea-compare.js'), 'utf8');
// Source-only CSS regression: this does not inspect browser-computed styles.
const css = fs.readFileSync(path.join(root, 'assets/tea-interactions.css'), 'utf8');
const primaryHoverRules = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
  .filter(([, selector]) => selector.includes('.tea-compare-button') && selector.includes(':hover'));
assert(primaryHoverRules.length > 0, 'Primary button hover rule exists');
for (const [, selector] of primaryHoverRules) {
  assert.match(selector, /:not\(\s*\.tea-compare-option\s*\)/, 'Primary hover excludes answer cards');
  assert.match(selector, /:not\(\s*\.tea-compare-secondary\s*\)/, 'Primary hover excludes secondary buttons to preserve contrast');
}
console.log('Primary hover selector exclusions: PASS (static CSS source check, not browser verification).');
const rounds = JSON.parse(source.match(/const rounds = (\[[\s\S]*?\n\]);/)[1]);
const copy = JSON.parse(source.match(/const copy = (\{[\s\S]*?\n\});/)[1]);
const walk = node => [node, ...node.children.flatMap(walk)];
class Node {
  constructor(tag, text = '') { this.tagName=tag; this._text=text; this.children=[]; this.dataset={}; this.attrs={}; this.events={}; this.disabled=false; this.hidden=false; }
  set textContent(value) { this._text=String(value); this.children=[]; }
  get textContent() { return this._text + this.children.map(n => n.textContent).join(''); }
  append(...nodes) { for (const n of nodes) { if (n.tagName === '#fragment') { this.children.push(...n.children); n.children=[]; } else this.children.push(n); } }
  replaceChildren(...nodes) { this._text=''; this.children=[]; this.append(...nodes); }
  setAttribute(k,v) { this.attrs[k]=String(v); }
  addEventListener(k,fn) { this.events[k]=fn; }
  click() { if (!this.disabled) this.events.click?.(); }
  focus() { this.ownerDocument.activeElement=this; }
}
function fixture(locale, { loading=false, fail=false } = {}) {
  const host=new Node('div'); host.dataset={locale, root:'../..'};
  const fallback=new Node('p','Readable original fallback'); host.append(fallback);
  const errors=[];
  const doc={ readyState:loading?'loading':'complete', activeElement:null,
    querySelectorAll(selector) { assert.equal(selector,'[data-tea-compare]'); return [host]; },
    createElement(tag) { if(fail) throw new Error('Injected construction failure'); const n=new Node(tag); n.ownerDocument=doc; return n; },
    createTextNode(text) { return new Node('#text',text); },
    createDocumentFragment() { return new Node('#fragment'); },
    addEventListener(event,fn) { assert.equal(event,'DOMContentLoaded'); this.boot=fn; }
  };
  const forbidden=() => { throw new Error('Timers/network/storage must not be used'); };
  const context=vm.createContext({document:doc, console:{error:(...args)=>errors.push(args)}, setTimeout:forbidden, setInterval:forbidden, fetch:forbidden, localStorage:new Proxy({}, {get:forbidden})});
  const run=()=>vm.runInContext(source, context); run();
  const query=predicate=>walk(host).filter(predicate);
  const cls=name=>query(n=>(n.className||'').split(' ').includes(name));
  const action=name=>query(n=>n.dataset.action===name)[0];
  return {host, fallback, doc, errors, run, query, cls, action};
}
function verifyLinks(f, locale) {
  const page=path.join(root, locale==='en'?'':locale, 'modules/module-01/03-brewing.qmd');
  for(const link of f.query(n=>n.tagName==='a')) {
    assert(!/^(?:https?:|\/)/.test(link.href), 'Links remain local');
    const target=path.resolve(path.dirname(page), link.href.replace(/\.html$/,'.qmd'));
    assert(fs.existsSync(target), `${locale}: missing source ${target}`);
    assert(target.startsWith(path.join(root,locale==='en'?'':locale)+path.sep), 'Links preserve locale');
  }
}
assert.equal(rounds.length, 10, 'Exactly ten questions');
function verifySummary(f, locale, checkpoint) {
  const summary=f.cls('tea-compare-summary')[0];
  assert(summary, 'Summary replaces question');
  assert.equal(summary.dataset.setSummary, checkpoint?'1':'2');
  assert.equal(f.query(n=>n.tagName==='li').length,checkpoint?5:10);
  assert.equal(f.cls('tea-compare-question').length,0,'No automatic advance from summary');
  assert.equal(f.action('next'),undefined,'Summary does not force next');
  assert.equal(Boolean(f.action('continue')),checkpoint,'Only checkpoint offers optional continuation');
  assert(f.action('restart'));
  assert.equal(f.doc.activeElement,summary.children[0],'Summary heading receives focus');
  for(const round of rounds.slice(0,checkpoint?5:10)) assert(summary.textContent.includes(round[locale].takeaway));
  verifyLinks(f,locale);
}
function verifyReset(f, locale) {
  f.action('restart').click();
  for(let i=0;i<10;i++) {
    assert.equal(f.cls('tea-compare-question')[0].textContent,rounds[i][locale].question);
    assert.equal(f.doc.activeElement,f.cls('tea-compare-question')[0]);
    assert.equal(f.action('next').disabled,true,'Restart clears every answer');
    assert.equal(f.cls('tea-compare-feedback')[0].textContent,'');
    assert.equal(f.cls('tea-compare-option').filter(n=>n.dataset.result).length,0);
    f.action('reveal').click(); f.action('next').click();
    if(i===4) { verifySummary(f,locale,true); f.action('continue').click(); }
  }
  verifySummary(f,locale,false);
}
let combinations=0;
for(const locale of ['en','zh-hant-hk','zh-hans']) {
  const page=fs.readFileSync(path.join(root,locale==='en'?'':locale,'modules/module-01/03-brewing.qmd'),'utf8');
  assert(page.includes(`data-tea-compare data-locale="${locale}" data-root="../.."`));
  assert.match(page, /data-tea-compare[^>]*>\s*<p>[^<]{25,}<\/p>/, 'No-JS fallback is in source');
  for(const mode of ['correct','wrong','unsure']) {
    const f=fixture(locale); const {host,action,cls,query}=f;
    assert.equal(host.dataset.teaCompareReady,'true');
    const firstRoot=host.children[0]; f.run(); assert.equal(host.children[0],firstRoot,'Duplicate init preserves DOM');
    assert.equal(query(n=>['input','textarea','select'].includes(n.tagName)).length,0,'No typing controls');
    const answers=[];
    for(let i=0;i<rounds.length;i++) {
      const round=rounds[i], c=round[locale];
      assert.equal(cls('tea-compare-question')[0].textContent,c.question);
      assert.equal(cls('tea-compare-clue')[0].textContent,`${copy[locale].clue} ${c.context}`);
      assert.equal(cls('tea-compare-pair')[0].attrs['aria-describedby'],cls('tea-compare-clue')[0].id,'Clue is accessible group description');
      const beforeAnswer=[c.title,c.context,c.question].join(' ');
      assert.doesNotMatch(beforeAnswer,/oxid|ferment|enzym|Camellia|microb|氧化|發酵|发酵|酶|窨/iu,'Specialist terms only after reveal');
      for(const name of c.options) assert(!c.context.toLowerCase().includes(name.toLowerCase()),'Clue does not name either choice');
      assert.deepEqual(cls('tea-compare-name').map(n=>n.textContent),c.options);
      assert.equal(action('next').disabled,true,'Cannot continue before reveal');
      const before=cls('tea-compare-question')[0]; action('next').events.click(); assert.equal(cls('tea-compare-question')[0],before,'Handler guards forced next');
      assert.equal(cls('tea-compare-feedback')[0].textContent,'');
      if(i===0) assert.equal(action('previous').hidden,true);
      const guess=mode==='unsure'?null:mode==='correct'?round.correctIndex:1-round.correctIndex;
      if(guess===null) action('reveal').click();
      else { cls('tea-compare-option')[guess].focus(); cls('tea-compare-option')[guess].click(); }
      assert.equal(cls('tea-compare-question')[0],before,'Answer never automatically advances');
      assert.equal(f.doc.activeElement,guess===null?cls('tea-compare-feedback')[0].children[0]:cls('tea-compare-option')[guess],'Reveal focuses result; guess retains focus');
      const feedback=cls('tea-compare-feedback')[0];
      assert.equal(feedback.children[0].textContent,`${guess===round.correctIndex?copy[locale].correct:copy[locale].answer} ${c.options[round.correctIndex]}`);
      for(const text of [c.explanation,c.takeaway,c.caveat]) assert(feedback.textContent.includes(text));
      assert.equal(feedback.attrs['aria-live'],'polite');
      assert.equal(action('next').disabled,false); assert.equal(action('reveal').hidden,true);
      assert.equal(cls('tea-compare-option').filter(n=>n.dataset.result==='correct').length,1);
      assert.equal(cls('tea-compare-option').filter(n=>n.attrs['aria-pressed']==='true').length,guess===null?0:1);
      const answer=feedback.textContent; answers.push(answer);
      cls('tea-compare-option').forEach(n=>n.click()); action('reveal').events.click();
      assert.equal(feedback.textContent,answer,'Repeated guesses ignored');
      verifyLinks(f,locale);
      if(i>0) {
        action('previous').click();
        if(i===5) { verifySummary(f,locale,true); action('continue').click(); }
        else { assert.equal(cls('tea-compare-feedback')[0].textContent,answers[i-1],'Previous preserves answer'); action('next').click(); }
        assert.equal(cls('tea-compare-feedback')[0].textContent,answer,'Returning preserves answer');
        assert.equal(f.doc.activeElement,cls('tea-compare-question')[0]);
      }
      action('next').click(); combinations++;
      if(i===4) { verifySummary(f,locale,true); action('continue').click(); assert.equal(f.doc.activeElement,cls('tea-compare-question')[0]); }
    }
    verifySummary(f,locale,false);
    verifyReset(f,locale);
    assert.equal(f.errors.length,0);
  }
  // Seed all ten answers, then return to checkpoint before restarting.
  // This catches a checkpoint restart that clears only the first set.
  const checkpointReset=fixture(locale);
  for(let i=0;i<10;i++) {
    checkpointReset.action('reveal').click();
    if(i<9) checkpointReset.action('next').click();
    if(i===4) checkpointReset.action('continue').click();
  }
  for(let i=9;i>=5;i--) checkpointReset.action('previous').click();
  verifySummary(checkpointReset,locale,true);
  verifyReset(checkpointReset,locale);
  const delayed=fixture(locale,{loading:true}); assert.equal(delayed.host.children[0],delayed.fallback); delayed.doc.boot(); assert.equal(delayed.host.dataset.teaCompareReady,'true');
  const broken=fixture(locale,{fail:true}); assert.equal(broken.host.children[0],broken.fallback,'Init failure retains fallback'); assert.equal(broken.host.dataset.teaCompareReady,undefined); assert.equal(broken.errors.length,1);
  console.log(`${locale}: all ten rounds × correct/wrong/unsure, repeated guesses, navigation, five-clue checkpoint, ten-clue summary, both restart paths, duplicate init, delayed boot, failure fallback and localized source paths: PASS`);
}
assert.equal(combinations,90);
const unknown=fixture('unknown'); assert.equal(unknown.cls('tea-compare-question')[0].textContent,rounds[0].en.question);
assert.doesNotMatch(source,/\b(?:setInterval|setTimeout)\s*\(/,'No timers');
console.log('90 round/locale/answer combinations passed. Mock DOM only; rendered browser QA is separate.');
