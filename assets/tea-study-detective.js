/* Progressive enhancement. Existing lessons and no-JS cases remain available.
 * Choices are in-memory only; no accounts, analytics, storage or network calls.
 */
(() => {
  'use strict';
  const data = window.TeaStudyDetectiveData;
  if (!data || !Array.isArray(data.cases) || data.cases.length !== 8) return;
  const { cases, ui } = data;
  const locales = ['en', 'zh-hant-hk', 'zh-hans'];
  let instance = 0;
  function shuffle() {
    const order = cases.map((_, i) => i);
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    return order;
  }
  function mount(host) {
    if (host.dataset.teaStudyReady) return;
    const lang = locales.includes(host.dataset.locale) ? host.dataset.locale : 'en';
    const t = value => value[lang];
    const id = `tea-study-${++instance}`;
    let deck = shuffle(), batch = 0, position = 0, mode = 'round', explorer = 0;
    let returnMode = 'round', answers = new Map(), explored = new Map(), generation = 0;
    const el = (tag, text, cls) => {
      const node = document.createElement(tag);
      if (text !== undefined) node.textContent = text;
      if (cls) node.className = cls;
      return node;
    };
    const button = (text, action, fn) => {
      const b = el('button', text, 'tea-study-button');
      b.type = 'button';
      b.dataset.action = action;
      b.addEventListener('click', fn);
      return b;
    };
    const wrap = el('section', undefined, 'tea-study');
    const title = el('h3', t(ui.title)); title.id = `${id}-title`;
    wrap.setAttribute('aria-labelledby', title.id);
    wrap.append(title, el('p', t(ui.intro)));
    const about = el('details', undefined, 'tea-study-about');
    about.append(el('summary', t(ui.about)), el('p', t(ui.disclosure)));
    wrap.append(about);
    const picker = el('details', undefined, 'tea-study-picker');
    const pickerButtons = el('div', undefined, 'tea-study-picker-buttons');
    picker.append(el('summary', t(ui.browse)), pickerButtons);
    cases.forEach((c, i) => {
      const b = button(t(c.topic), 'browse', () => {
        if (mode !== 'explore') returnMode = mode;
        mode = 'explore'; explorer = i; picker.open = false; render(true);
      });
      b.dataset.caseIndex = String(i); pickerButtons.append(b);
    });
    wrap.append(picker);
    const content = el('div', undefined, 'tea-study-content');
    const status = el('div', undefined, 'tea-study-status');
    status.setAttribute('role', 'status'); status.setAttribute('aria-live', 'polite'); status.setAttribute('aria-atomic', 'true');
    wrap.append(content, status);
    function source(c) {
      const p = el('p', t(ui.lesson), 'tea-study-source');
      const a = el('a', t(c.sourceTitle)); a.href = c.source;
      p.append(a); return p;
    }
    function render(moveFocus = false) {
      const turn = ++generation;
      status.textContent = '';
      const panel = el('div', undefined, 'tea-study-panel'); panel.dataset.mode = mode;
      const safe = fn => () => { if (generation === turn) fn(); };
      let heading;
      if (mode === 'summary') {
        heading = el('h4', t(ui.summary)); heading.tabIndex = -1;
        panel.append(heading, el('p', t(ui.summaryIntro)));
        const list = el('ol', undefined, 'tea-study-takeaways');
        deck.slice(batch, batch + 4).forEach(index => {
          const c = cases[index]; const item = el('li');
          item.append(el('strong', t(c.topic)), el('p', t(c.takeaway)), source(c)); list.append(item);
        });
        panel.append(list);
        const actions = el('div', undefined, 'tea-study-actions');
        actions.append(button(t(ui.review), 'review', safe(() => { position = 0; mode = 'round'; render(true); })));
        if (batch + 4 < deck.length) {
          actions.append(button(t(ui.more), 'more', safe(() => { batch += 4; position = 0; mode = 'round'; render(true); })));
        } else {
          panel.append(el('p', t(ui.done)));
          actions.append(button(t(ui.restart), 'restart', safe(() => {
            deck = shuffle(); batch = 0; position = 0; answers = new Map(); explored = new Map(); mode = 'round'; render(true);
          })));
          panel.append(el('p', t(ui.clear), 'tea-study-note'));
        }
        panel.append(actions);
      } else {
        const index = mode === 'explore' ? explorer : deck[batch + position];
        const c = cases[index]; const state = mode === 'explore' ? explored : answers;
        panel.dataset.caseIndex = String(index);
        panel.append(el('p', mode === 'explore' ? t(ui.exploring) : t(ui.progress).replace('{n}', position + 1).replace('{total}', 4), 'tea-study-progress'));
        heading = el('h4', t(c.topic)); heading.tabIndex = -1;
        panel.append(heading);
        const story = el('div', undefined, 'tea-study-case');
        story.append(el('p', t(ui.invented), 'tea-study-note'), el('p', t(c.headline), 'tea-study-headline'), el('p', t(c.story)));
        if (window.TeaGameFigures) story.append(window.TeaGameFigures.figure(c.id, lang));
        panel.append(story);
        const question = el('p', t(c.question), 'tea-study-question'); question.id = `${id}-question`;
        panel.append(question);
        const field = el('fieldset', undefined, 'tea-study-choices');
        field.setAttribute('aria-describedby', question.id);
        field.append(el('legend', t(ui.choose)));
        const choices = [];
        const feedback = el('div', undefined, 'tea-study-feedback');
        const actions = el('div', undefined, 'tea-study-actions');
        let next;
        const retry = button(t(ui.retry), 'retry', safe(() => {
          state.delete(index); update(false); choices[0].focus();
        }));
        function update(announce) {
          const value = state.get(index);
          const answered = state.has(index);
          choices.forEach((b, i) => b.setAttribute('aria-pressed', String(value === i)));
          feedback.replaceChildren();
          retry.hidden = !answered; unsure.hidden = answered;
          if (next) next.disabled = !answered;
          if (answered) {
            const label = value === null ? ui.together : value === c.correct ? ui.fits : ui.rethink;
            feedback.append(el('h5', t(label)), el('p', t(c.explain)), el('p', t(c.takeaway), 'tea-study-takeaway'), source(c));
            status.textContent = announce ? `${t(label)} ${t(c.explain)} ${t(c.takeaway)}` : '';
          } else status.textContent = '';
        }
        c.options.forEach((option, i) => {
          const b = button(t(option), 'answer', safe(() => { state.set(index, i); update(true); }));
          b.dataset.answer = String(i); choices.push(b); field.append(b);
        });
        const unsure = button(t(ui.unsure), 'reveal', safe(() => {
          state.set(index, null); update(false);
          const explanationTitle = feedback.firstElementChild;
          explanationTitle.tabIndex = -1; explanationTitle.focus();
        }));
        panel.append(field, unsure, feedback, retry);
        if (mode === 'explore') {
          actions.append(button(t(ui.return), 'return', safe(() => { mode = returnMode; render(true); })));
        } else {
          const prev = button(t(ui.prev), 'previous', safe(() => { if (position > 0) { position--; render(true); } }));
          prev.disabled = position === 0;
          next = button(t(position === 3 ? ui.finish : ui.next), 'next', safe(() => {
            if (!state.has(index)) return;
            if (position === 3) mode = 'summary'; else position++;
            render(true);
          }));
          actions.append(prev, next);
        }
        panel.append(actions); update(false);
      }
      content.replaceChildren(panel);
      if (moveFocus) heading.focus();
    }
    render(); // Build a complete detached UI before removing the fallback.
    host.replaceChildren(wrap);
    host.dataset.teaStudyReady = 'true';
  }
  function start() {
    document.querySelectorAll('[data-tea-study-detective]').forEach(host => {
      try { mount(host); } catch (error) { console.warn('Tea study detective kept its reading fallback.', error); }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
