'use strict';
// DOM/state tests only. Real-browser layout and keyboard testing are separate.
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm'), assert = require('node:assert/strict'), cp = require('node:child_process');
const root = path.resolve(__dirname, '..');
const dataSource = fs.readFileSync(path.join(root, 'assets/tea-time-machine-data.js'), 'utf8');
const source = fs.readFileSync(path.join(root, 'assets/tea-time-machine.js'), 'utf8');
const context = { window: {} }; vm.runInNewContext(dataSource, context);
const data = JSON.parse(JSON.stringify(context.window.TeaTimeMachineData));
const locales = ['en', 'zh-hant-hk', 'zh-hans'];
const byId = new Map(data.events.map(e => [e.id, e]));
let focused;
class Node {
  constructor(tag, text = '') { this.tagName = tag; this._text = text; this.children = []; this.dataset = {}; this.attrs = {}; this.events = {}; this.disabled = false; this.hidden = false; }
  set textContent(value) { this._text = String(value); this.children = []; }
  get textContent() { return this._text + this.children.map(c => c.textContent).join(''); }
  get firstElementChild() { return this.children[0]; }
  append(...nodes) { this.children.push(...nodes); }
  replaceChildren(...nodes) { this._text = ''; this.children = nodes; }
  setAttribute(key, value) { this.attrs[key] = String(value); }
  removeAttribute(key) { delete this.attrs[key]; }
  addEventListener(event, fn) { this.events[event] = fn; }
  focus() { focused = this; }
  click() { if (!this.disabled) this.events.click?.(); }
}
const all = (node, match) => [node, ...node.children.flatMap(c => all(c, match))].filter(match);
const seed = value => () => ((value = (Math.imul(value, 1664525) + 1013904223) >>> 0) / 4294967296);
function mount(lang = 'en', rng = seed(42), failAt = Infinity) {
  const host = new Node('div'); host.dataset.locale = lang; host.append(new Node('p', 'Reading fallback'));
  let creates = 0;
  const document = { readyState: 'complete', querySelectorAll: () => [host], createElement: tag => {
    if (++creates === failAt) throw Error('Injected creation error');
    return new Node(tag);
  } };
  const math = Object.create(Math); math.random = rng;
  const ctx = { window: {}, document, Math: math, console: { warn() {} } };
  vm.runInNewContext(dataSource, ctx); vm.runInNewContext(source, ctx);
  const nodes = fn => all(host, fn);
  const api = { host, ctx, nodes, action: a => nodes(n => n.dataset.action === a)[0], panel: () => nodes(n => n.className === 'tea-time-panel')[0], cls: c => nodes(n => n.className === c)[0] };
  api.tap = a => { const b = api.action(a); assert(b, `Missing ${a}`); b.click(); };
  api.index = () => Number(api.panel().dataset.pairIndex);
  api.answer = value => { const b = nodes(n => n.dataset.answer === value)[0]; assert(b); b.click(); };
  return api;
}
assert.equal(data.events.length, 8); assert.equal(byId.size, 8);
assert.equal(data.pairs.length, 10); assert.equal(new Set(data.pairs.map(p => [...p].sort().join('/'))).size, 10);
for (const [key, value] of Object.entries(data.ui)) for (const lang of locales) assert(value[lang]?.length, `${key}/${lang}`);
for (const event of data.events) {
  assert(Number.isInteger(event.start) && event.end >= event.start);
  assert(event.source.startsWith('https://'));
  for (const key of ['date', 'title', 'hint', 'story', 'sourceTitle']) for (const lang of locales) assert(event[key][lang]?.length, `${event.id}/${key}/${lang}`);
}
for (const [x, y] of data.pairs) {
  const a = byId.get(x), b = byId.get(y); assert(a && b);
  assert(a.end < b.start || a.start > b.end, 'Dates must not overlap');
}
assert.equal(byId.get('assam').start, 1839); assert.equal(byId.get('fortune').start, 1848);
assert(byId.get('assam').end < byId.get('fortune').start);
assert.match(byId.get('assam').story.en, /Singpho/);
assert.match(byId.get('fortune').story.en, /existing Indian tea industry/);
assert.equal(byId.get('lu-yu').start, 760); assert.equal(byId.get('lu-yu').end, 780);
assert.match(byId.get('eisai').story.en, /reached Japan earlier/);
assert.equal(byId.get('cutty-sark').start, 1869); assert.match(byId.get('cutty-sark').story.en, /1870/);
assert.match(byId.get('unesco').story.en, /not the birth/);
for (const lang of locales) {
  const app = mount(lang);
  assert.equal(app.host.dataset.teaTimeReady, 'true'); assert.equal(app.panel().dataset.mode, 'welcome');
  assert.equal(app.nodes(n => n.dataset.eventId).length, 8, 'All stories remain browseable');
  app.tap('start'); assert.equal(app.panel().dataset.mode, 'round');
  assert.equal(focused, app.cls('tea-time-progress'));
  assert.equal(app.action('previous').disabled, true); assert.equal(app.action('next').disabled, true);
  const initial = app.index(); app.tap('next'); assert.equal(app.index(), initial);
  assert.equal(app.cls('tea-time-hint').hidden, true);
  app.tap('hint'); assert.equal(app.cls('tea-time-hint').hidden, false); assert.equal(app.action('next').disabled, true);
  assert.equal(app.action('hint').attrs['aria-expanded'], 'true');
  const [candidateId, anchorId] = data.pairs[initial], candidate = byId.get(candidateId), anchor = byId.get(anchorId);
  const correct = candidate.end < anchor.start ? 'earlier' : 'later', wrong = correct === 'earlier' ? 'later' : 'earlier';
  app.answer(wrong); assert(app.cls('tea-time-feedback').textContent.includes(data.ui.rethink[lang]));
  assert(app.cls('tea-time-status').textContent.includes(candidate.story[lang]));
  assert.equal(app.action('next').disabled, false);
  app.answer(correct); assert(app.cls('tea-time-feedback').textContent.includes(data.ui.rethink[lang]), 'Repeated answer cannot replace response');
  app.tap('retry'); assert.equal(app.cls('tea-time-feedback').textContent, ''); assert.equal(app.action('next').disabled, true);
  assert.equal(focused.dataset.answer, 'earlier');
  app.answer(correct); assert(app.cls('tea-time-feedback').textContent.includes(data.ui.correct[lang]));
  const staleNext = app.action('next'); app.tap('next'); const second = app.index(); staleNext.click(); assert.equal(app.index(), second, 'Stale next cannot skip a stop');
  app.tap('previous'); assert.equal(app.index(), initial); assert.equal(app.action('next').disabled, false); assert.equal(app.cls('tea-time-hint').hidden, false);
  app.tap('next');
  const seen = new Set([initial]);
  for (let trip = 0; trip < 2; trip++) {
    const startPosition = trip === 0 ? 1 : 0;
    for (let position = startPosition; position < 5; position++) {
      const index = app.index(); assert(!seen.has(index), 'No duplicate comparisons in two trips'); seen.add(index);
      app.tap('reveal'); assert(app.cls('tea-time-feedback').textContent.includes(data.ui.revealed[lang]));
      assert.equal(focused, app.cls('tea-time-feedback').firstElementChild);
      app.tap('next');
    }
    assert.equal(app.panel().dataset.mode, 'summary'); assert.equal(focused.tagName, 'h4');
    const timelineIds = all(app.panel(), n => n.dataset.eventId).map(n => n.dataset.eventId);
    const dates = timelineIds.map(id => byId.get(id).start); assert.deepEqual(dates, [...dates].sort((a, b) => a - b));
    assert.equal(new Set(timelineIds).size, timelineIds.length);
    app.tap('review'); assert.equal(app.action('next').disabled, false); assert.equal(app.action('previous').disabled, true);
    for (let i = 0; i < 5; i++) app.tap('next');
    if (trip === 0) app.tap('more');
  }
  assert.equal(seen.size, 10); assert(!app.action('more'));
  app.tap('restart'); assert.equal(app.panel().dataset.mode, 'round'); assert.equal(app.action('next').disabled, true); assert.equal(app.cls('tea-time-hint').hidden, true);
  assert.equal(app.cls('tea-time-status').textContent, '');
  const current = app.host.children[0]; vm.runInNewContext(source, app.ctx); assert.equal(app.host.children[0], current, 'Mount is idempotent');
  assert(!app.host.textContent.includes('undefined')); assert(!app.host.textContent.includes('{trip}'));
}
// Randomization is actually variable, without dropping any of the ten pairs.
const firsts = new Set();
for (let i = 1; i < 30; i++) { const app = mount('en', seed(i)); app.tap('start'); firsts.add(app.index()); }
assert(firsts.size > 1);
const fallback = mount('en', seed(1), 3); assert.equal(fallback.host.textContent, 'Reading fallback'); assert(!fallback.host.dataset.teaTimeReady);
assert.equal(mount('unsupported').action('start').textContent, data.ui.start.en);
assert(!/localStorage|sessionStorage|fetch\(|XMLHttpRequest|innerHTML/.test(source));
// Exact preservation outside the marked additive game block.
const base = process.env.TEA_TIME_BASE || '82ac3785b2b5e24d764dd571fbb7aabc8cf87c61';
for (const lang of locales) {
  const relative = `${lang === 'en' ? '' : `${lang}/`}modules/module-03/01-trade-history.qmd`;
  const before = cp.execFileSync('git', ['show', `${base}:${relative}`], { cwd: root, encoding: 'utf8' });
  const current = fs.readFileSync(path.join(root, relative), 'utf8');
  const stripped = current.replace(/\n\n<!-- tea-time-machine:start -->[\s\S]*?<!-- tea-time-machine:end -->\n/, '');
  assert.equal(stripped, before, `${relative}: original reading content changed`);
  assert.equal((current.match(/data-event-id=/g) || []).length, 8);
  for (const event of data.events) assert(current.includes(event.source));
}
console.log('PASS: three languages; ten unique comparisons; hints, reveal, wrong/correct, retry, previous, review, restart, stale clicks, focus contracts, source dates, fallback, randomization and exact original-content preservation.');
