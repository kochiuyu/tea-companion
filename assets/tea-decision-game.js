/* Dependency-free teaching examples. No network, money, telemetry or storage. */
(() => {
  'use strict';
  const copy = {
  "en": {
    "title": "Play the decision, then inspect the rules",
    "intro": "Someone proposes a split. Do you accept it? Try three short decisions, then see exactly what the rules change.",
    "badge": "3 decisions · no right or wrong choice",
    "scope": "These are fictional tokens, not money. The offers are written examples, not messages from another player. Each decision starts fresh: nothing is won, paid, saved or added to a score.",
    "round": "Decision {n} of 3",
    "you": "You",
    "other": "Other player",
    "tokens": "tokens",
    "question": "Would you accept this split?",
    "offer": "The proposed split",
    "before": "Read both outcomes, then tap a choice.",
    "accept": "Accept",
    "reject": "Reject",
    "unsure": "Not sure · show both outcomes",
    "acceptOutcome": "Accept: you get {you}; the other player gets {other}.",
    "rejectOutcome": "Reject: you get {you}; the other player gets {other}.",
    "choiceAccept": "You chose to accept.",
    "choiceReject": "You chose to reject.",
    "choiceUnsure": "You looked at both outcomes without choosing.",
    "result": "What happens?",
    "noChoice": "Neither option has been selected. Both possible outcomes are shown below.",
    "comparison": "Both possible outcomes",
    "rules": "Inspect the rules",
    "whoLabel": "Who acts first?",
    "who": "The example starts with an offer from the other player. You respond by accepting or rejecting; you cannot change the offer.",
    "knowsLabel": "What do you know?",
    "knows": "Both possible token outcomes are shown before you choose. There is no hidden random event and no real partner reacting to you.",
    "changedLabel": "What changed?",
    "noticeLabel": "What can this teach?",
    "next": "Next decision →",
    "finish": "See the three decisions →",
    "previous": "← Previous decision",
    "retry": "Try this decision again",
    "done": "Three decisions, three rule checks",
    "doneIntro": "Here is what you chose in these examples. This is not a score or a measure of fairness, trust, or personality.",
    "takeaway": "Before interpreting a choice, check the offer, the response options, and what happens if someone says no. A changed choice does not tell you which motive caused it.",
    "noTea": "Nothing here tests tea, warmth, or any drink. A controlled study with suitable comparisons would be needed to investigate a drink effect.",
    "restart": "Play again",
    "read": "Read the lesson and its sources",
    "source": "Game background and limits",
    "notesTitle": "Where this game comes from",
    "notes": "The first two examples use the accept-or-reject structure of ultimatum bargaining: accepting implements the offered split; rejecting gives both players zero. The third is a teaching variation with a different rejection outcome, not the standard game. The offers are fixed examples, not research results. Real experiments may use real people and payments, so these clicks do not reproduce a study.",
    "citation": "Background: Güth, Schmittberger & Schwarze (1982), cited in this lesson.",
    "fallback": "Without JavaScript, compare the three examples below. In each, you choose whether to accept a proposed split. All numbers are fictional tokens. The other player is part of the example, not a real person.",
    "fallbackEnd": "Neither accepting nor rejecting is marked correct. Notice how the offer or rejection rule changes your options. These examples do not test personality, trustworthiness, or any effect of tea.",
    "scenes": [
      {
        "title": "A small share for you",
        "setup": "The other player proposes 2 tokens for you and 8 for them. You can accept or reject.",
        "changed": "This is the starting rule: accepting carries out the split; rejecting gives both players zero.",
        "notice": "Accepting gives you 2 rather than 0. Rejecting prevents the proposed 2–8 split. Either choice alone leaves your reasons unknown."
      },
      {
        "title": "A different offer",
        "setup": "This time, the other player proposes 5 tokens for you and 5 for them. The rejection rule stays the same.",
        "changed": "Only the offer changed: 2–8 became 5–5. Rejecting still gives both players zero.",
        "notice": "You can compare your response to a small share and an equal share. Two choices still cannot establish why you responded or how you behave elsewhere."
      },
      {
        "title": "A different rule for saying no",
        "setup": "The offer is back to 2 tokens for you and 8 for them. But now rejecting gives each player 1 token from a separate fallback pool.",
        "changed": "Compared with the first decision, the 2–8 offer is the same, but rejection now gives 1–1 instead of 0–0. Unallocated tokens disappear. This is a teaching variation, not the standard ultimatum game.",
        "notice": "The cost of rejecting is different: you give up 1 token rather than 2. You can inspect the effect of a rule without claiming to have measured someone’s motives."
      }
    ]
  },
  "zh-hant-hk": {
    "title": "先作選擇，再看清規則",
    "intro": "對方提出一個分配，你會接受嗎？試三個簡短選擇，再看看規則究竟改變了甚麼。",
    "badge": "3 個選擇 · 沒有標準答案",
    "scope": "這裏只有虛構代幣，不是真錢。提議是預設例子，不是另一位玩家傳來的訊息。每個選擇獨立開始；不會贏錢、付款、儲存選擇或累積分數。",
    "round": "第 {n} 個選擇，共 3 個",
    "you": "你",
    "other": "對方",
    "tokens": "枚代幣",
    "question": "你會接受這個分配嗎？",
    "offer": "對方提出的分配",
    "before": "先看看兩種結果，再點選。",
    "accept": "接受",
    "reject": "拒絕",
    "unsure": "未決定 · 看看兩種結果",
    "acceptOutcome": "接受：你得到 {you} 枚；對方得到 {other} 枚。",
    "rejectOutcome": "拒絕：你得到 {you} 枚；對方得到 {other} 枚。",
    "choiceAccept": "你選擇了接受。",
    "choiceReject": "你選擇了拒絕。",
    "choiceUnsure": "你沒有作出選擇，先看了兩種結果。",
    "result": "結果會怎樣？",
    "noChoice": "你未選擇接受或拒絕。以下列出兩種可能的結果。",
    "comparison": "兩種可能的結果",
    "rules": "看清規則",
    "whoLabel": "誰先行動？",
    "who": "例子先由對方提出分配。你再決定接受或拒絕，不能更改提議。",
    "knowsLabel": "你知道甚麼？",
    "knows": "作出選擇前，兩種代幣分配結果都已列明。沒有隱藏的隨機事件，也沒有真人回應你。",
    "changedLabel": "甚麼變了？",
    "noticeLabel": "可以學到甚麼？",
    "next": "下一個選擇 →",
    "finish": "回看三個選擇 →",
    "previous": "← 上一個選擇",
    "retry": "重新試這個選擇",
    "done": "三個選擇，三次檢查規則",
    "doneIntro": "以下是你在這些例子中的選擇。這不是分數，也不是公平感、信任或性格測試。",
    "takeaway": "解讀一個選擇前，先看提議、可選行動，以及說「不」之後的結果。選擇改變了，不代表我們知道改變的動機。",
    "noTea": "這個遊戲沒有測試茶、溫度或任何飲品。要研究飲品的影響，需要有合適比較條件的受控研究。",
    "restart": "再玩一次",
    "read": "閱讀本節與研究出處",
    "source": "遊戲背景與限制",
    "notesTitle": "這個遊戲從哪裏來？",
    "notes": "首兩個例子採用最後通牒博弈的接受或拒絕結構：接受便按提議分配；拒絕則雙方都得零。第三個例子改了拒絕後的結果，是教學變式，不是標準規則。提議是固定例子，不是研究結果。真實實驗可能涉及真人和金錢，所以點選這些選項不等於重做研究。",
    "citation": "背景：Güth、Schmittberger 與 Schwarze（1982），見本節引文。",
    "fallback": "沒有 JavaScript 也可以比較以下三個例子。每次都由你決定接受或拒絕一個分配。所有數字都是虛構代幣，對方是例子中的角色，不是真人。",
    "fallbackEnd": "接受和拒絕都沒有標準答案。留意提議或拒絕規則如何改變可選結果。這些例子不會測試性格、是否值得信任，或茶的影響。",
    "scenes": [
      {
        "title": "你只得到較少的一份",
        "setup": "對方提出你得 2 枚代幣、對方得 8 枚。你可以接受或拒絕。",
        "changed": "這是起始規則：接受就按提議分配；拒絕則雙方都得零。",
        "notice": "接受讓你得到 2 枚，而不是零。拒絕則阻止這個 2 比 8 的分配。單憑任何一個選擇，都無法知道你的理由。"
      },
      {
        "title": "換一個提議",
        "setup": "這次對方提出各得 5 枚代幣。拒絕後的結果不變。",
        "changed": "只有提議變了：2 比 8 改成 5 比 5。拒絕仍然令雙方都得零。",
        "notice": "可以比較自己對較少份額和平均分配的反應。但兩個選擇仍不足以解釋你的理由，或推斷你在其他場合的行為。"
      },
      {
        "title": "說「不」的規則改了",
        "setup": "提議又回到你得 2 枚、對方得 8 枚。但這次拒絕後，雙方會各從另一個備用代幣池得到 1 枚。",
        "changed": "跟第一個選擇相比，2 比 8 的提議不變，但拒絕由各得零改為各得 1 枚。未分配的代幣會消失。這是教學變式，不是標準最後通牒博弈。",
        "notice": "拒絕的代價變了：你放棄的是 1 枚，而不是 2 枚。可以檢查規則改動的影響，但不能聲稱已量度出一個人的動機。"
      }
    ]
  },
  "zh-hans": {
    "title": "先做选择，再看清规则",
    "intro": "对方提出一个分配，你会接受吗？试三个简短选择，再看看规则究竟改变了什么。",
    "badge": "3 个选择 · 没有标准答案",
    "scope": "这里只有虚构代币，不是真钱。提议是预设例子，不是另一位玩家发来的消息。每个选择独立开始；不会赢钱、付款、保存选择或累积分数。",
    "round": "第 {n} 个选择，共 3 个",
    "you": "你",
    "other": "对方",
    "tokens": "枚代币",
    "question": "你会接受这个分配吗？",
    "offer": "对方提出的分配",
    "before": "先看看两种结果，再点选。",
    "accept": "接受",
    "reject": "拒绝",
    "unsure": "未决定 · 看看两种结果",
    "acceptOutcome": "接受：你得到 {you} 枚；对方得到 {other} 枚。",
    "rejectOutcome": "拒绝：你得到 {you} 枚；对方得到 {other} 枚。",
    "choiceAccept": "你选择了接受。",
    "choiceReject": "你选择了拒绝。",
    "choiceUnsure": "你没有做出选择，先看了两种结果。",
    "result": "结果会怎样？",
    "noChoice": "你还没选择接受或拒绝。以下列出两种可能的结果。",
    "comparison": "两种可能的结果",
    "rules": "看清规则",
    "whoLabel": "谁先行动？",
    "who": "例子先由对方提出分配。你再决定接受或拒绝，不能更改提议。",
    "knowsLabel": "你知道什么？",
    "knows": "做出选择前，两种代币分配结果都已列明。没有隐藏的随机事件，也没有真人回应你。",
    "changedLabel": "什么变了？",
    "noticeLabel": "可以学到什么？",
    "next": "下一个选择 →",
    "finish": "回看三个选择 →",
    "previous": "← 上一个选择",
    "retry": "重新试这个选择",
    "done": "三个选择，三次检查规则",
    "doneIntro": "以下是你在这些例子中的选择。这不是分数，也不是公平感、信任或性格测试。",
    "takeaway": "解读一个选择前，先看提议、可选行动，以及说“不”之后的结果。选择改变了，不代表我们知道改变的动机。",
    "noTea": "这个游戏没有测试茶、温度或任何饮品。要研究饮品的影响，需要有合适比较条件的受控研究。",
    "restart": "再玩一次",
    "read": "阅读本节与研究出处",
    "source": "游戏背景与限制",
    "notesTitle": "这个游戏从哪里来？",
    "notes": "前两个例子采用最后通牒博弈的接受或拒绝结构：接受就按提议分配；拒绝则双方都得零。第三个例子改了拒绝后的结果，是教学变式，不是标准规则。提议是固定例子，不是研究结果。真实实验可能涉及真人和金钱，所以点选这些选项不等于重做研究。",
    "citation": "背景：Güth、Schmittberger 与 Schwarze（1982），见本节引文。",
    "fallback": "没有 JavaScript 也可以比较以下三个例子。每次都由你决定接受或拒绝一个分配。所有数字都是虚构代币，对方是例子中的角色，不是真人。",
    "fallbackEnd": "接受和拒绝都没有标准答案。留意提议或拒绝规则如何改变可选结果。这些例子不会测试性格、是否值得信任，或茶的影响。",
    "scenes": [
      {
        "title": "你只得到较少的一份",
        "setup": "对方提出你得 2 枚代币、对方得 8 枚。你可以接受或拒绝。",
        "changed": "这是起始规则：接受就按提议分配；拒绝则双方都得零。",
        "notice": "接受让你得到 2 枚，而不是零。拒绝则阻止这个 2 比 8 的分配。单凭任何一个选择，都无法知道你的理由。"
      },
      {
        "title": "换一个提议",
        "setup": "这次对方提出各得 5 枚代币。拒绝后的结果不变。",
        "changed": "只有提议变了：2 比 8 改成 5 比 5。拒绝仍然让双方都得零。",
        "notice": "可以比较自己对较少份额和平均分配的反应。但两个选择仍不足以解释你的理由，或推断你在其他场合的行为。"
      },
      {
        "title": "说“不”的规则改了",
        "setup": "提议又回到你得 2 枚、对方得 8 枚。但这次拒绝后，双方会各从另一个备用代币池得到 1 枚。",
        "changed": "跟第一个选择相比，2 比 8 的提议不变，但拒绝由各得零改为各得 1 枚。未分配的代币会消失。这是教学变式，不是标准最后通牒博弈。",
        "notice": "拒绝的代价变了：你放弃的是 1 枚，而不是 2 枚。可以检查规则改动的影响，但不能声称已测量出一个人的动机。"
      }
    ]
  }
};
  const scenes = [
    { accept: [2, 8], reject: [0, 0] },
    { accept: [5, 5], reject: [0, 0] },
    { accept: [2, 8], reject: [1, 1] }
  ];
  let instances = 0;
  const node = (tag, text, className) => {
    const element = document.createElement(tag);
    if (text !== undefined) element.textContent = text;
    if (className) element.className = className;
    return element;
  };
  function mount(host) {
    if (host.dataset.decisionMounted) return;
    const t = copy[host.dataset.locale] || copy.en;
    const id = `tea-decision-${++instances}`;
    let position = 0;
    let choices = Array(scenes.length).fill(null);
    let mode = 'play';
    const root = node('section', undefined, 'tea-decision-game');
    root.setAttribute('aria-label', t.title);
    root.lang = host.dataset.locale === 'zh-hant-hk' ? 'zh-Hant-HK' : (host.dataset.locale === 'zh-hans' ? 'zh-Hans' : 'en');
    root.append(node('p', t.badge, 'tea-decision-badge'), node('p', t.intro));
    const scope = node('p', t.scope, 'tea-decision-scope');
    const stage = node('div', undefined, 'tea-decision-stage');
    const status = node('p', '', 'tea-decision-status');
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    status.setAttribute('aria-atomic', 'true');
    root.append(scope, stage, status);
    const outcome = (index, decision) => {
      const amounts = scenes[index][decision];
      return t[decision + 'Outcome'].replace('{you}', amounts[0]).replace('{other}', amounts[1]);
    };
    const choiceLabel = choice => t['choice' + choice[0].toUpperCase() + choice.slice(1)];
    const button = (text, action, className) => {
      const item = node('button', text, className || 'tea-decision-button');
      item.type = 'button';
      item.dataset.action = action;
      return item;
    };
    const sourceLink = () => {
      const link = node('a', t.source);
      link.href = '#decision-game-notes';
      return link;
    };
    function showFeedback(container, index, choice) {
      container.replaceChildren();
      container.hidden = !choice;
      if (!choice) return;
      container.append(node('h4', t.result), node('p', choiceLabel(choice), 'tea-decision-chosen'));
      const result = node('p', choice === 'unsure' ? t.noChoice : outcome(index, choice), 'tea-decision-result');
      if (choice !== 'unsure') {
        result.dataset.you = scenes[index][choice][0];
        result.dataset.other = scenes[index][choice][1];
      }
      container.append(result, node('h4', t.comparison));
      const list = node('ul');
      list.append(node('li', outcome(index, 'accept')), node('li', outcome(index, 'reject')));
      container.append(list, node('h4', t.rules));
      const rules = node('dl', undefined, 'tea-decision-rules');
      for (const [label, explanation] of [
        [t.whoLabel, t.who], [t.knowsLabel, t.knows],
        [t.changedLabel, t.scenes[index].changed], [t.noticeLabel, t.scenes[index].notice]
      ]) rules.append(node('dt', label), node('dd', explanation));
      container.append(rules, sourceLink());
    }
    function render(focus = false) {
      stage.replaceChildren();
      stage.dataset.mode = mode;
      stage.dataset.round = position;
      status.textContent = '';
      if (mode === 'summary') {
        const heading = node('h3', t.done);
        heading.tabIndex = -1;
        stage.append(heading, node('p', t.doneIntro));
        const list = node('ol', undefined, 'tea-decision-summary');
        choices.forEach((choice, index) => {
          const item = node('li');
          item.append(node('h4', t.scenes[index].title), node('p', choiceLabel(choice)));
          if (choice !== 'unsure') item.append(node('p', outcome(index, choice)));
          item.append(node('p', t.scenes[index].changed));
          list.append(item);
        });
        stage.append(list, node('p', t.takeaway), node('p', t.noTea, 'tea-decision-limit'));
        const actions = node('div', undefined, 'tea-decision-actions');
        actions.append(button(t.restart, 'restart'));
        const read = node('a', t.read, 'tea-decision-button');
        read.href = '#decision-game-notes';
        actions.append(read);
        stage.append(actions);
        if (focus) heading.focus();
        return;
      }
      const index = position;
      stage.append(node('p', t.round.replace('{n}', position + 1), 'tea-decision-progress'));
      const heading = node('h3', t.scenes[index].title);
      heading.tabIndex = -1;
      stage.append(heading, node('p', t.scenes[index].setup));
      const split = node('div', undefined, 'tea-decision-split');
      split.setAttribute('role', 'group');
      split.setAttribute('aria-label', t.offer);
      for (const [i, label] of [t.you, t.other].entries()) {
        const card = node('div', undefined, 'tea-decision-share');
        if (typeof window !== 'undefined' && window.TeaGameFigures) card.append(window.TeaGameFigures.art('tokens', scenes[index].accept[i]));
        card.append(node('span', label), node('strong', `${scenes[index].accept[i]} ${t.tokens}`));
        split.append(card);
      }
      stage.append(split);
      const question = node('h4', t.question);
      question.id = id + '-question';
      const before = node('p', t.before);
      before.id = id + '-before';
      stage.append(question, before);
      const options = node('div', undefined, 'tea-decision-options');
      options.setAttribute('role', 'group');
      options.setAttribute('aria-labelledby', question.id);
      options.setAttribute('aria-describedby', before.id);
      for (const action of ['accept', 'reject']) {
        const control = button('', action);
        control.append(node('strong', t[action]), node('span', outcome(index, action)));
        control.setAttribute('aria-pressed', String(choices[index] === action));
        options.append(control);
      }
      const unsure = button(t.unsure, 'unsure', 'tea-decision-button tea-decision-unsure');
      unsure.setAttribute('aria-pressed', String(choices[index] === 'unsure'));
      stage.append(options, unsure);
      const feedback = node('div', undefined, 'tea-decision-feedback');
      showFeedback(feedback, index, choices[index]);
      stage.append(feedback);
      const actions = node('div', undefined, 'tea-decision-actions');
      const previous = button(t.previous, 'previous');
      previous.disabled = position === 0;
      const retry = button(t.retry, 'retry');
      retry.hidden = !choices[index];
      const next = button(position === scenes.length - 1 ? t.finish : t.next, 'next');
      next.disabled = !choices[index];
      actions.append(previous, retry, next);
      stage.append(actions);
      // One listener lives on a stable root; re-renders do not stack handlers.
      if (focus) heading.focus();
    }
    root.addEventListener('click', event => {
      const target = event.target.closest('button[data-action]');
      if (!target || !root.contains(target) || target.disabled) return;
      const action = target.dataset.action;
      if (action === 'restart') {
        if (mode !== 'summary') return;
        choices = Array(scenes.length).fill(null);
        position = 0;
        mode = 'play';
        render(true);
        return;
      }
      if (mode !== 'play') return;
      if (['accept', 'reject', 'unsure'].includes(action)) {
        choices[position] = action;
        stage.querySelectorAll('[aria-pressed]').forEach(item => item.setAttribute('aria-pressed', String(item.dataset.action === action)));
        showFeedback(stage.querySelector('.tea-decision-feedback'), position, action);
        stage.querySelector('[data-action="retry"]').hidden = false;
        stage.querySelector('[data-action="next"]').disabled = false;
        status.textContent = choiceLabel(action) + ' ' + (action === 'unsure' ? t.noChoice : outcome(position, action)) + ' ' + t.scenes[position].changed;
        // Keep focus on the selected choice so changing a decision is easy.
      } else if (action === 'retry') {
        choices[position] = null;
        render();
        stage.querySelector('[data-action="accept"]').focus();
      } else if (action === 'previous' && position > 0) {
        position--;
        render(true);
      } else if (action === 'next' && choices[position]) {
        if (position < scenes.length - 1) position++;
        else mode = 'summary';
        render(true);
      }
    });
    render();
    host.replaceChildren(root);
    host.dataset.decisionMounted = 'true';
  }
  document.querySelectorAll('[data-tea-decision]').forEach(mount);
})();
