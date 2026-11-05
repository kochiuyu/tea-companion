'use strict';
// Build the no-JavaScript reading path from the same translated source as the game.
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const root = path.resolve(__dirname, '..'), context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'assets/tea-time-machine-data.js'), 'utf8'), context);
const { events, ui } = context.window.TeaTimeMachineData;
const escape = value => value.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const labels = {
  en: 'Try it: travel through tea history',
  'zh-hant-hk': '試一試：乘時光機看茶史',
  'zh-hans': '试一试：乘时光机看茶史'
};
const start = '<!-- tea-time-machine:start -->', end = '<!-- tea-time-machine:end -->';
let outdated = false;
for (const lang of Object.keys(labels)) {
  const t = value => escape(value[lang]);
  const prefix = lang === 'en' ? '' : `${lang}/`, assets = lang === 'en' ? '../../assets/' : '../../../assets/';
  const file = path.join(root, `${prefix}modules/module-03/01-trade-history.qmd`);
  const stories = events.map(event => `<li data-event-id="${event.id}"><p class="tea-time-date">${t(event.date)}</p><h5>${t(event.title)}</h5><p>${t(event.story)}</p><p class="tea-time-source">${t(ui.source)}<a href="${escape(event.source)}">${t(event.sourceTitle)}</a>${event.extraSource ? ` · <a href="${escape(event.extraSource)}">${t(event.extraSourceTitle)}</a>` : ''}</p></li>`).join('\n');
  const block = `${start}\n## ${labels[lang]} {#tea-time-machine}\n\n\`\`\`{=html}\n<link rel="stylesheet" href="${assets}tea-time-machine.css">\n<script src="${assets}tea-time-machine-data.js" defer></script>\n<script src="${assets}tea-time-machine.js" defer></script>\n<div data-tea-time-machine data-locale="${lang}">\n<h3>${t(ui.title)}</h3>\n<p>${t(ui.intro)}</p>\n<p>${t(ui.fallback)}</p>\n<details class="tea-time-fallback"><summary>${t(ui.browse)}</summary>\n<ol>\n${stories}\n</ol>\n</details>\n<p>${t(ui.note)}</p>\n</div>\n<span id="tea-time-reading"></span>\n\`\`\`\n${end}\n`;
  const original = fs.readFileSync(file, 'utf8');
  let output;
  if (original.includes(start)) {
    const a = original.indexOf(start), b = original.indexOf(end, a) + end.length;
    output = original.slice(0, a) + block.trimEnd() + original.slice(b);
  } else {
    const marker = '<!-- reader-guide:end -->';
    if (!original.includes(marker)) throw new Error(`Missing insertion point: ${file}`);
    output = original.replace(marker, `${marker}\n\n${block}`);
  }
  if (output !== original) {
    outdated = true;
    if (!process.argv.includes('--check')) fs.writeFileSync(file, output);
  }
}
if (process.argv.includes('--check') && outdated) { console.error('Time Machine fallbacks need syncing.'); process.exit(1); }
console.log(outdated ? 'Time Machine fallbacks generated in all three languages.' : 'Time Machine fallbacks are in sync.');
