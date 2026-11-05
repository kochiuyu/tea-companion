#!/usr/bin/env node
'use strict';
// Keep the no-JavaScript practice cases synchronized with the authored game data.
// `node reviews/sync_study_fallbacks.cjs --check` is read-only.
// `node reviews/sync_study_fallbacks.cjs --write` replaces only the marked block.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),ctx={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'assets/tea-study-detective-data.js'),'utf8'),ctx);
const {cases,ui}=ctx.window.TeaStudyDetectiveData;
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#x27;');
let changed=false;
for(const lang of ['en','zh-hant-hk','zh-hans']){
 const prefix=lang==='en'?'':'../',file=path.join(root,lang==='en'?'':lang,'tea-reading-studies.qmd');
 const lines=['<!-- study-detective:start -->',`## ${ui.title[lang]} {#study-detective}`,'','```{=html}',`<link rel="stylesheet" href="${prefix}assets/tea-study-detective.css">`,`<script src="${prefix}assets/tea-study-detective-data.js" defer></script>`,`<script src="${prefix}assets/tea-study-detective.js" defer></script>`,`<div data-tea-study-detective data-locale="${lang}">`,`<p>${ui.nojs[lang]}</p>`,`<p>${ui.disclosure[lang]}</p>`];
 for(const c of cases){const e=v=>escape(v[lang]);lines.push(`<details class="tea-study-fallback"><summary>${e(c.topic)}</summary>`,`<p><strong>${e(c.headline)}</strong></p>`,`<p>${e(c.story)}</p>`,`<p>${e(c.question)}</p>`,'<ol>',...c.options.map(o=>`<li>${e(o)}</li>`),'</ol>',`<details><summary>${ui.answer[lang]}</summary><p><strong>${e(c.options[c.correct])}</strong></p><p>${e(c.explain)}</p><p><a href="${c.source}">${e(c.sourceTitle)}</a></p></details></details>`);}
 lines.push('</div>','```','<!-- study-detective:end -->');
 const source=fs.readFileSync(file,'utf8'),pattern=/<!-- study-detective:start -->[\s\S]*?<!-- study-detective:end -->/;
 if(!pattern.test(source))throw Error(`Missing fallback markers: ${file}`);
 const next=source.replace(pattern,()=>lines.join('\n'));
 if(next!==source){changed=true;if(process.argv.includes('--write'))fs.writeFileSync(file,next);else console.error(`${lang}: fallback is out of sync`);}
}
if(changed&&!process.argv.includes('--write'))process.exitCode=1;
else console.log(changed?'Study-game fallbacks updated.':'All three no-JavaScript fallbacks match the authored cases.');
