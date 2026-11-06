'use strict';
const fs=require('node:fs'), vm=require('node:vm'), assert=require('node:assert/strict');
class Node {
  constructor(tag){this.tag=tag;this.attrs={};this.children=[];this.textContent='';}
  setAttribute(k,v){this.attrs[k]=String(v);}
  append(...nodes){this.children.push(...nodes);}
}
const window={};
vm.runInNewContext(fs.readFileSync('assets/tea-game-figures.js','utf8'),{window,document:{createElement:t=>new Node(t),createElementNS:(_,t)=>new Node(t)}});
const walk=n=>[n,...n.children.flatMap(walk)];
const drawings=[];
for(const locale of ['en','zh-hant-hk','zh-hans']) {
  const signatures=new Set(), monochrome=new Set();
  for(let i=0;i<15;i++) {
    const f=window.TeaGameFigures.figure('label',locale,i), svg=f.children[0];
    assert.equal(svg.attrs['aria-hidden'],'true');assert.equal(svg.attrs.focusable,'false');
    assert.equal(svg.attrs['data-label-art'],String(i));
    assert(f.children[1].textContent.length>0);
    assert(walk(svg).every(n=>!['text','image','foreignObject','a'].includes(n.tag)));
    signatures.add(JSON.stringify(svg.children));
    monochrome.add(JSON.stringify(svg.children,(key,value)=>['fill','stroke'].includes(key)?undefined:value));
    assert.equal(JSON.stringify(f),JSON.stringify(window.TeaGameFigures.figure('label',locale,i)));
    if(locale==='en')drawings.push(svg);
  }
  assert.equal(signatures.size,15);
  assert.equal(monochrome.size,15,'Shapes/patterns remain distinct without color');
  console.log(`${locale}: 15 distinct deterministic neutral SVGs, localized captions and nonfocusable decorative artwork PASS`);
}
assert(!window.TeaGameFigures.figure('label','en').children[0].attrs['data-label-art'],'Legacy label API remains compatible');
assert(fs.readFileSync('assets/tea-label-detective.js','utf8').includes("figure('label', locale, activeIndex)"));
const svg=n=>`<${n.tag} ${Object.entries(n.attrs).map(([k,v])=>`${k}="${v}"`).join(' ')}>${n.children.map(svg).join('')}</${n.tag}>`;
if(process.env.PREVIEW_PATH)fs.writeFileSync(process.env.PREVIEW_PATH,'<!doctype html><meta charset="utf-8"><title>15 practice packages</title><style>body{background:#f8f8f1;font:16px sans-serif}main{display:grid;grid-template-columns:repeat(5,240px);gap:12px}figure{margin:0}figcaption{text-align:center}</style><main>'+drawings.map((n,i)=>`<figure>${svg(n)}<figcaption>${String(i+1).padStart(2,'0')}</figcaption></figure>`).join('')+'</main>');
