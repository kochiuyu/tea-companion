'use strict';
// Keep the full no-JavaScript reading version in step with the game data.
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..'),ctx={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'assets/tea-museum-data.js'),'utf8'),ctx);
const data=ctx.window.TeaMuseumData;
const count=data.exhibits.length, visitSize=Math.min(3,count);
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const langs=['en','zh-hant-hk','zh-hans'];
const titles=['Tea Museum: Fix the Label','茶博物館：修正展品說明','茶博物馆：修正展品说明'];
const descriptions=[`Explore ${visitSize} random displays per short visit, with ${count} sourced labels to discover.`,`每趟短參觀隨機探索${visitSize}件展品，逐步發現${count}張有來源支持的說明牌。`,`每趟短参观随机探索${visitSize}件展品，逐步发现${count}张有来源支持的说明牌。`];
const notice=[`The interactive museum is loading. If JavaScript is unavailable, all ${count} corrected labels and their sources remain below.`,`互動博物館正在載入。如無法使用JavaScript，下方仍可閱讀${count}張修正後的說明牌及其來源。`,`互动博物馆正在载入。如无法使用JavaScript，下方仍可阅读${count}张修正后的说明牌及其来源。`];
const source=['Full story and references','完整故事與參考資料','完整故事与参考资料'];
const more=['Keep exploring','繼續探索','继续探索'];
const time=['Tea Time Machine','茶時光機','茶时光机'],table=['Set the Tea Table','擺好一張茶桌','摆好一张茶桌'],hub=['History & Culture','歷史與文化','历史与文化'];
for(const [i,lang] of langs.entries()) {
 const prefix=i?'../':'',dir=i?lang+'/':'';
 const language=i?`lang: ${i===1?'zh-Hant-HK':'zh-Hans'}\n`:'';
 const switcher=langs.map((l,j)=>`[${['English','繁體中文（香港）','简体中文'][j]}](${prefix}${j?l+'/':''}tea-museum.qmd)`).join(' · ');
 let body=`---\ntitle: "${titles[i]}"\n${language}description: "${descriptions[i]}"\ntoc: false\n---\n\n${switcher}\n\n\`\`\`{=html}\n<link rel="stylesheet" href="${prefix}assets/tea-museum.css">\n<script src="${prefix}assets/tea-game-figures.js" defer></script>\n<script src="${prefix}assets/tea-museum-figures.js" defer></script>\n<script src="${prefix}assets/tea-museum-data.js" defer></script>\n<script src="${prefix}assets/tea-museum.js" defer></script>\n<div data-tea-museum data-locale="${lang}">\n<div class="tea-museum-fallback">\n<p>${notice[i]}</p>\n`;
 for(const e of data.exhibits) {
  const correct=e.choices.find(c=>c.id===e.correct);
  body+=`<details><summary>${escape(e.title[lang])}</summary>\n<p><strong>${escape(correct.label[lang])}</strong></p>\n<p>${escape(e.explanation[lang])}</p>\n<p><a href="${escape(e.source[lang])}">${source[i]}</a></p>\n`;
  if(e.citations.length)body+='<ul>'+e.citations.map(c=>`<li><a href="${escape(c.url)}">${escape(c.title)}</a></li>`).join('')+'</ul>\n';
  body+='</details>\n';
 }
 body+=`</div>\n</div>\n\`\`\`\n\n## ${more[i]}\n\n[${time[i]}](modules/module-03/01-trade-history.qmd#tea-time-machine) · [${table[i]}](modules/module-03/04-regional-scripts.qmd#set-the-tea-table) · [${hub[i]}](modules/module-03/index.qmd)\n`;
 fs.writeFileSync(path.join(root,dir+'tea-museum.qmd'),body);
}
