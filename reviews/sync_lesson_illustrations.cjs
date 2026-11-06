'use strict';
// Export existing game artwork for reading pages. Static images and captions work
// without JavaScript and in print. Run from any directory; --check never writes.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'data/lesson-illustrations.json'), 'utf8'));
const check = process.argv.includes('--check');
const locales = ['en', 'zh-hant-hk', 'zh-hans'];
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
class Element {
  constructor(tag) { this.tag = tag; this.attrs = {}; this.children = []; this.textContent = ''; }
  setAttribute(key, value) { this.attrs[key] = String(value); }
  append(...children) { this.children.push(...children); }
  get outerHTML() { return `<${this.tag}${Object.entries(this.attrs).map(([k,v]) => ` ${k}="${escape(v)}"`).join('')}>${escape(this.textContent)}${this.children.map(c => c.outerHTML).join('')}</${this.tag}>`; }
}
const context = { window: {}, document: { createElement: tag => new Element(tag), createElementNS: (_, tag) => new Element(tag) } };
for (const name of ['tea-game-figures', 'tea-museum-figures', 'tea-lesson-figures']) {
  vm.runInNewContext(fs.readFileSync(path.join(root, `assets/${name}.js`), 'utf8'), context);
}
function output(relative, content) {
  const file = path.join(root, relative);
  if (check) assert.equal(fs.readFileSync(file, 'utf8'), content, `Regenerate ${relative}`);
  else { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, content); }
}
for (const [id, item] of Object.entries(manifest.art)) {
  const svg = item.source === 'game' ? context.window.TeaGameFigures.art(item.kind)
    : item.source === 'museum' ? context.window.TeaMuseumFigures.figure(item.kind, 'en').children[0]
    : context.window.TeaLessonFigures.art(item.kind);
  assert(svg && svg.tag === 'svg', id);
  // The page's localized img alt supplies the accessible equivalent.
  delete svg.attrs['aria-hidden']; delete svg.attrs.focusable; delete svg.attrs.class;
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  svg.setAttribute('width', '240'); svg.setAttribute('height', '136');
  output(`assets/lesson-illustrations/${id}.svg`, svg.outerHTML + '\n');
}
const begin = '<!-- lesson-illustration:';
const existing = /\n<!-- lesson-illustration:[a-z-]+:start -->\n[\s\S]*?<!-- lesson-illustration:[a-z-]+:end -->\n/g;
const files = new Map();
for (const placement of manifest.placements) for (const locale of locales) {
  const file = path.join(locale === 'en' ? '' : locale, placement.page);
  if (!files.has(file)) files.set(file, fs.readFileSync(path.join(root, file), 'utf8').replace(existing, ''));
  const heading = `\n## ${placement.heading[locale]}\n`;
  let source = files.get(file);
  assert.equal(source.split(heading).length, 2, `Heading must be unique: ${file} ${heading}`);
  const src = path.relative(path.dirname(file), `assets/lesson-illustrations/${placement.art}.svg`).split(path.sep).join('/');
  const alt = manifest.art[placement.art].alt[locale];
  const caption = placement.caption[locale];
  assert(alt && caption, `${placement.id}/${locale}`);
  const block = `\n${begin}${placement.id}:start -->\n\`\`\`{=html}\n<figure class="tea-lesson-figure" data-lesson-illustration="${placement.id}">\n  <img src="${src}" width="240" height="136" alt="${escape(alt)}" loading="lazy" decoding="async">\n  <figcaption>${escape(caption)}</figcaption>\n</figure>\n\`\`\`\n<!-- lesson-illustration:${placement.id}:end -->\n`;
  files.set(file, source.replace(heading, heading + block));
}
for (const [file, source] of files) output(file, source);
console.log(`${check ? 'Verified' : 'Generated'} ${Object.keys(manifest.art).length} SVGs and ${manifest.placements.length * locales.length} localized reading figures.`);
