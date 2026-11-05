/* Progressive enhancement, entirely in memory. No storage or network requests. */
(() => {
  'use strict';
  const data = window.TeaTimeMachineData;
  if (!data || !Array.isArray(data.events) || !Array.isArray(data.pairs)) return;
  const locales = ['en', 'zh-hant-hk', 'zh-hans'];
  const byId = new Map(data.events.map(event => [event.id, event]));
  if (data.pairs.length !== 10 || data.pairs.some(([a, b]) => {
    const x = byId.get(a), y = byId.get(b);
    return !x || !y || !(x.end < y.start || x.start > y.end);
  })) return;
  let instance = 0;
  const shuffled = () => {
    const deck = data.pairs.map((_, i) => i);
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  };
  function mount(host) {
    if (host.dataset.teaTimeReady) return;
    const lang = locales.includes(host.dataset.locale) ? host.dataset.locale : 'en';
    const t = value => value[lang];
    const ui = data.ui, id = `tea-time-${++instance}`;
    let deck = shuffled(), batch = 0, position = 0, mode = 'welcome', generation = 0;
    let answers = new Map(), hints = new Set();
    const el = (tag, text, cls) => {
      const node = document.createElement(tag);
      if (text !== undefined) node.textContent = text;
      if (cls) node.className = cls;
      return node;
    };
    const button = (text, action, fn) => {
      const b = el('button', text, 'tea-time-button');
      b.type = 'button'; b.dataset.action = action; b.addEventListener('click', fn);
      return b;
    };
    const wrap = el('section', undefined, 'tea-time');
    const title = el('h3', t(ui.title)); title.id = `${id}-title`;
    wrap.setAttribute('aria-labelledby', title.id);
    wrap.append(title, el('p', t(ui.intro), 'tea-time-intro'));
    const content = el('div', undefined, 'tea-time-content');
    const status = el('p', undefined, 'tea-time-status');
    status.setAttribute('role', 'status'); status.setAttribute('aria-live', 'polite'); status.setAttribute('aria-atomic', 'true');
    wrap.append(content, status);
    function sources(event) {
      const p = el('p', t(ui.source), 'tea-time-source');
      const link = el('a', t(event.sourceTitle)); link.href = event.source; p.append(link);
      if (event.extraSource) {
        const more = el('a', t(event.extraSourceTitle)); more.href = event.extraSource;
        p.append(el('span', ' · '), more);
      }
      return p;
    }
    function timeline(events) {
      const list = el('ol', undefined, 'tea-time-timeline');
      [...events].sort((a, b) => a.start - b.start).forEach(event => {
        const item = el('li'); item.dataset.eventId = event.id;
        item.append(el('p', t(event.date), 'tea-time-date'), el('h5', t(event.title)), el('p', t(event.story)), sources(event));
        list.append(item);
      });
      return list;
    }
    const allStories = el('details', undefined, 'tea-time-stories');
    allStories.append(el('summary', t(ui.browse)), timeline(data.events));
    wrap.append(allStories, el('p', t(ui.note), 'tea-time-note'));
    function render(moveFocus = false) {
      const turn = ++generation;
      const safe = fn => () => { if (generation === turn) fn(); };
      status.textContent = '';
      const panel = el('div', undefined, 'tea-time-panel'); panel.dataset.mode = mode;
      let heading;
      if (mode === 'welcome') {
        panel.append(button(t(ui.start), 'start', safe(() => { mode = 'round'; render(true); })));
      } else if (mode === 'summary') {
        heading = el('h4', t(ui.summary)); heading.tabIndex = -1;
        panel.append(heading, el('p', t(ui.summaryIntro)));
        const seen = new Set(deck.slice(batch, batch + 5).flatMap(i => data.pairs[i]));
        panel.append(timeline([...seen].map(eventId => byId.get(eventId))));
        const actions = el('div', undefined, 'tea-time-actions');
        actions.append(button(t(ui.review), 'review', safe(() => { position = 0; mode = 'round'; render(true); })));
        if (batch + 5 < deck.length) {
          actions.append(button(t(ui.more), 'more', safe(() => { batch += 5; position = 0; mode = 'round'; render(true); })));
        } else {
          panel.append(el('p', t(ui.done)));
          actions.append(button(t(ui.restart), 'restart', safe(() => {
            deck = shuffled(); batch = 0; position = 0; answers = new Map(); hints = new Set(); mode = 'round'; render(true);
          })));
          panel.append(el('p', t(ui.clear), 'tea-time-note'));
        }
        panel.append(actions);
        const lesson = el('a', t(ui.lesson), 'tea-time-lesson'); lesson.href = '#tea-time-reading'; panel.append(lesson);
      } else {
        const pairIndex = deck[batch + position];
        const [candidateId, anchorId] = data.pairs[pairIndex];
        const candidate = byId.get(candidateId), anchor = byId.get(anchorId);
        const correct = candidate.end < anchor.start ? 'earlier' : 'later';
        panel.dataset.pairIndex = String(pairIndex);
        const progressText = t(ui.progress).replace('{trip}', batch / 5 + 1).replace('{n}', position + 1);
        heading = el('h4', progressText, 'tea-time-progress'); heading.tabIndex = -1;
        const progress = el('progress'); progress.max = 5; progress.value = position + 1;
        progress.setAttribute('aria-label', progressText);
        panel.append(heading, progress);
        const cards = el('div', undefined, 'tea-time-cards');
        const known = el('div', undefined, 'tea-time-card tea-time-anchor');
        known.append(el('p', t(ui.known), 'tea-time-kicker'), el('p', t(anchor.date), 'tea-time-date'), el('h5', t(anchor.title)));
        const mystery = el('div', undefined, 'tea-time-card tea-time-mystery');
        const questionMark = el('p', '?', 'tea-time-date'); questionMark.setAttribute('aria-hidden', 'true');
        mystery.append(el('p', t(ui.mystery), 'tea-time-kicker'), questionMark, el('h5', t(candidate.title)));
        cards.append(known, mystery); panel.append(cards);
        const field = el('fieldset', undefined, 'tea-time-choices');
        field.append(el('legend', t(ui.question)));
        const choices = [];
        const helpers = el('div', undefined, 'tea-time-helpers');
        const hint = el('p', t(candidate.hint), 'tea-time-hint'); hint.id = `${id}-hint`;
        const feedback = el('div', undefined, 'tea-time-feedback');
        const navigation = el('div', undefined, 'tea-time-actions');
        let next;
        const retry = button(t(ui.retry), 'retry', safe(() => { answers.delete(pairIndex); update(false); choices[0].focus(); }));
        const hintButton = button(t(ui.hint), 'hint', safe(() => {
          if (answers.has(pairIndex)) return;
          hints.add(pairIndex); hint.hidden = false; hintButton.setAttribute('aria-expanded', 'true'); status.textContent = t(candidate.hint);
        }));
        hintButton.setAttribute('aria-controls', hint.id);
        const reveal = button(t(ui.reveal), 'reveal', safe(() => {
          if (answers.has(pairIndex)) return;
          answers.set(pairIndex, 'reveal'); update(false);
          feedback.firstElementChild.focus();
        }));
        function update(announce) {
          const answered = answers.has(pairIndex), answer = answers.get(pairIndex);
          choices.forEach(b => {
            b.setAttribute('aria-pressed', String(b.dataset.answer === answer));
            b.setAttribute('aria-disabled', String(answered));
          });
          hint.hidden = !hints.has(pairIndex); hintButton.setAttribute('aria-expanded', String(!hint.hidden));
          hintButton.hidden = answered; reveal.hidden = answered; retry.hidden = !answered;
          if (next) next.disabled = !answered;
          feedback.replaceChildren(); status.textContent = '';
          if (answered) {
            questionMark.textContent = t(candidate.date); questionMark.removeAttribute('aria-hidden');
            const label = answer === 'reveal' ? ui.revealed : answer === correct ? ui.correct : ui.rethink;
            const result = t(correct === 'earlier' ? ui.before : ui.after).replace('{event}', t(candidate.title)).replace('{anchor}', t(anchor.title));
            const feedbackTitle = el('h5', t(label)); feedbackTitle.tabIndex = -1;
            feedback.append(feedbackTitle, el('p', result, 'tea-time-order'), el('p', t(candidate.story)), sources(candidate));
            if (announce) status.textContent = `${t(label)} ${result} ${t(candidate.date)}. ${t(candidate.story)}`;
          } else {
            questionMark.textContent = '?'; questionMark.setAttribute('aria-hidden', 'true');
          }
        }
        ['earlier', 'later'].forEach(answer => {
          const b = button(t(ui[answer]), 'answer', safe(() => {
            if (answers.has(pairIndex)) return;
            answers.set(pairIndex, answer); update(true);
          }));
          b.dataset.answer = answer; choices.push(b); field.append(b);
        });
        helpers.append(hintButton, reveal);
        const previous = button(t(ui.previous), 'previous', safe(() => {
          if (position > 0) { position--; render(true); }
        })); previous.disabled = position === 0;
        next = button(t(position === 4 ? ui.finish : ui.next), 'next', safe(() => {
          if (!answers.has(pairIndex)) return;
          if (position === 4) mode = 'summary'; else position++;
          render(true);
        }));
        navigation.append(previous, next);
        panel.append(field, helpers, hint, feedback, retry, navigation); update(false);
      }
      content.replaceChildren(panel);
      if (moveFocus && heading) heading.focus();
    }
    render(); // Keep the complete reading fallback unless the first render succeeds.
    host.replaceChildren(wrap); host.dataset.teaTimeReady = 'true';
  }
  function start() {
    document.querySelectorAll('[data-tea-time-machine]').forEach(host => {
      try { mount(host); } catch (error) { console.warn('Tea Time Machine kept its reading fallback.', error); }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
