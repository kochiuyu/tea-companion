/* A small museum of corrected labels. Progressive enhancement; no storage or network. */
(() => {
  'use strict';
  const data = window.TeaMuseumData;
  const locales = ['en', 'zh-hant-hk', 'zh-hans'];
  if (!data || !Array.isArray(data.exhibits) || !data.exhibits.length) return;
  const copy = {
    title: ['The mixed-up collection', '待修正的展覽', '待修正的展览'],
    intro: ['A short visit: {size} random displays from a collection of {total}. Fix a few labels, then stop or explore more.', '短短一趟參觀：從{total}件館藏隨機選出{size}件。修正幾張說明牌，便可休息或繼續探索。', '短短一趟参观：从{total}件馆藏随机选出{size}件。修正几张说明牌，便可休息或继续探索。'],
    invitation: ['A little curiosity is all you need.', '帶一點好奇心就夠了。', '带一点好奇心就够了。'],
    start: ['Explore {size} displays', '探索{size}件展品', '探索{size}件展品'],
    how: ['Tap a replacement label. No timer, no typing, and hints are welcome.', '點選一張替代說明牌。不限時、不用打字，也可以查看提示。', '点选一张替代说明牌。不限时、不用打字，也可以查看提示。'],
    illustration: ['An imagined museum, with a tea plant, a book and a cup. Illustrations are symbolic, not reconstructions of historical objects.', '想像中的博物館，展出茶樹、書本和茶杯。插圖只作示意，並非歷史文物的重現。', '想象中的博物馆，展出茶树、书本和茶杯。插图只作示意，并非历史文物的重现。'],
    progress: ['Display {n} of {visit}', '第 {n} 件展品，本次共 {visit} 件', '第 {n} 件展品，本次共 {visit} 件'],
    repaired: ['{n} of {visit} labels restored this visit', '本次已修正 {n}／{visit} 張說明牌', '本次已修正 {n}／{visit} 张说明牌'],
    collection: ['Your restored collection · {n} of {total}', '已修正的館藏 · {n}／{total}', '已修正的馆藏 · {n}／{total}'],
    more: ['Explore {next} more displays', '再探索{next}件展品', '再探索{next}件展品'],
    remaining: ['{remaining} displays still to discover. The next visit only picks displays you have not seen yet.', '還有{remaining}件展品等你發現。下一趟只會選出尚未看過的展品。', '还有{remaining}件展品等你发现。下一趟只会选出尚未看过的展品。'],
    saved: ['Your choices stay in this page only and are not saved. Reloading starts a new collection.', '你的選擇只暫留於本頁，不會儲存。重新載入網頁後，館藏進度會重新開始。', '你的选择只暂留于本页，不会保存。重新载入网页后，馆藏进度会重新开始。'],
    mixed: ['Mixed-up label · needs a correction', '有誤的說明牌 · 待修正', '有误的说明牌 · 待修正'],
    fixed: ['Restored label', '修正後的說明牌', '修正后的说明牌'],
    question: ['Which label belongs in the museum?', '哪張說明牌較適合放在博物館？', '哪张说明牌较适合放在博物馆？'],
    hint: ['Give me a clue', '給我一個提示', '给我一个提示'],
    reveal: ['Show me the evidence', '直接看證據', '直接看证据'],
    correct: ['A careful correction.', '這個修正很準確。', '这个修正很准确。'],
    rethink: ['Let’s restore this one together.', '一起修正這張說明牌吧。', '一起修正这张说明牌吧。'],
    revealed: ['Here is the evidence.', '來看看證據。', '来看看证据。'],
    evidence: ['Why this label is better', '這張說明牌為何較準確', '这张说明牌为何较准确'],
    selection: ['Your choice', '你的選擇', '你的选择'],
    answer: ['Supported by the evidence', '有證據支持', '有证据支持'],
    previous: ['Previous display', '上一件展品', '上一件展品'],
    next: ['Next display', '下一件展品', '下一件展品'],
    finish: ['Finish this short visit', '完成這趟短參觀', '完成这趟短参观'],
    summary: ['A good place to pause.', '來到一個可以歇歇腳的地方。', '来到一个可以歇歇脚的地方。'],
    complete: ['The whole collection is restored.', '整個館藏的說明已修正。', '整个馆藏的说明已修正。'],
    summaryIntro: ['You have restored {visit} labels. Your short visit is complete.', '你已修正{visit}張說明牌，完成這趟短參觀。', '你已修正{visit}张说明牌，完成这趟短参观。'],
    completeIntro: ['You have explored all {total} displays, a few at a time. Your restored collection and its sources are below.', '你已一點一點地探索全部{total}件展品。下方可以重看已修正的館藏及其來源。', '你已一点一点地探索全部{total}件展品。下方可以重看已修正的馆藏及其来源。'],
    review: ['Revisit these {visit} displays', '重看本次{visit}件展品', '重看本次{visit}件展品'],
    restart: ['Shuffle the collection and start again', '打亂館藏次序，重新開始', '打乱馆藏次序，重新开始'],
    resetNote: ['Starting again clears your choices and reshuffles all displays and labels.', '重新開始會清除你的選擇，並重新打亂所有展品及選項次序。', '重新开始会清除你的选择，并重新打乱所有展品及选项次序。'],
    browse: ['Prefer to read? Browse all {total} corrected labels', '想直接閱讀？瀏覽{total}張修正後的說明牌', '想直接阅读？浏览{total}张修正后的说明牌'],
    story: ['Read the fuller story', '閱讀完整故事', '阅读完整故事'],
    sources: ['Sources used in the lesson', '本課引用的來源', '本课引用的来源'],
    note: ['A fictional museum, built from this site’s sourced lessons. The mixed-up labels are deliberately incorrect. The corrected labels are short starting points, not the whole history.', '這是一間虛構的博物館，內容根據本站有來源支持的課文。有誤的說明牌是刻意設計的；修正後的短句只是認識歷史的起點。', '这是一间虚构的博物馆，内容根据本站有来源支持的课文。有误的说明牌是刻意设计的；修正后的短句只是认识历史的起点。']
  };
  const shuffle = list => {
    const out = [...list];
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  };
  const el = (tag, text, cls) => {
    const n = document.createElement(tag);
    if (text !== undefined) n.textContent = text;
    if (cls) n.className = cls;
    return n;
  };
  function museumArt(caption) {
    const figure = el('figure', undefined, 'tea-museum-building');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    Object.entries({viewBox:'0 0 600 250', 'aria-hidden':'true', focusable:'false'}).forEach(([k,v]) => svg.setAttribute(k,v));
    const add = (tag, attrs) => {
      const n = document.createElementNS('http://www.w3.org/2000/svg',tag);
      Object.entries(attrs).forEach(([k,v]) => n.setAttribute(k,String(v))); svg.append(n);
    };
    const line = d => add('path',{d,fill:'none',stroke:'#466356','stroke-width':4,'stroke-linecap':'round','stroke-linejoin':'round'});
    add('rect',{x:0,y:0,width:600,height:250,rx:18,fill:'#e8ecdf'});
    add('path',{d:'M70 67 L300 8 L530 67 Z',fill:'#c9d4bc',stroke:'#466356','stroke-width':3});
    add('path',{d:'M67 68 H533 V83 H67 Z M58 223 H542 V238 H58 Z',fill:'#b67b5b',stroke:'#466356','stroke-width':3});
    for (const x of [81,219,357,495]) {
      add('rect',{x,y:83,width:24,height:140,rx:3,fill:'#faf5e8',stroke:'#466356','stroke-width':3});
      line(`M${x-3} 91 H${x+27} M${x-3} 214 H${x+27}`);
    }
    for (const x of [123,261,399]) {
      add('path',{d:`M${x} 164 H${x+78} V188 H${x} Z M${x+10} 188 H${x+68} V221 H${x+10} Z`,fill:'#faf5e8',stroke:'#466356','stroke-width':2});
      line(`M${x+26} 175 H${x+52}`);
    }
    add('path',{d:'M148 147 H176 L172 163 H152 Z',fill:'#b67b5b',stroke:'#466356','stroke-width':2});
    add('path',{d:'M162 144 Q130 131 141 109 Q169 115 162 144 M162 139 Q189 111 176 98 Q152 115 162 139',fill:'#b4c1a5',stroke:'#466356','stroke-width':3});
    line('M162 126 V150');
    add('path',{d:'M274 119 Q288 112 300 121 Q314 112 328 119 V158 Q314 152 300 161 Q288 152 274 158 Z',fill:'#faf5e8',stroke:'#466356','stroke-width':3});
    line('M300 121 V160 M281 129 H292 M308 129 H321 M281 139 H292 M308 139 H321');
    line('M455 131 C482 123 479 156 454 149');
    add('path',{d:'M417 124 H459 L455 153 Q438 164 421 153 Z',fill:'#faf5e8',stroke:'#466356','stroke-width':3});
    line('M422 132 H454 M428 110 Q422 102 430 95 M445 110 Q439 102 447 95');
    figure.append(svg,el('figcaption',caption)); return figure;
  }
  let instances = 0;
  function mount(host) {
    if (host.dataset.museumReady) return;
    const lang = locales.includes(host.dataset.locale) ? host.dataset.locale : 'en';
    const ix = locales.indexOf(lang), visitSize = Math.min(3, data.exhibits.length);
    const t = (key, values = {}) => Object.entries({total:data.exhibits.length, size:visitSize, visit:visit.length, ...values}).reduce((text,[name,value])=>text.replaceAll(`{${name}}`,String(value)),copy[key][ix]);
    const l = item => item[lang];
    const uid = `tea-museum-${++instances}`;
    const figure = exhibit => window.TeaMuseumFigures?.figure(exhibit.id,lang) || window.TeaGameFigures?.figure(exhibit.icon,lang);
    for (const e of data.exhibits) {
      if (!e.choices.some(c => c.id === e.correct) || !e.source[lang]) return;
    }
    let position = 0, mode = 'welcome', generation = 0;
    let answers = new Map(), hints = new Set(), orders;
    let queue = shuffle(data.exhibits), visit = [];
    const remaining = () => queue.filter(e=>!answers.has(e.id));
    const visitCount = () => visit.filter(e=>answers.has(e.id)).length;
    const beginVisit = () => { visit=remaining().slice(0,visitSize);position=0;mode='exhibit';render(true); };
    const setOrders = () => { orders = new Map(data.exhibits.map(e => [e.id,shuffle(e.choices)])); };
    setOrders();
    const textCount = (key,n) => t(key,{n});
    const button = (text,action,fn) => {
      const b = el('button',text,'tea-museum-button'); b.type='button'; b.dataset.action=action; b.addEventListener('click',fn); return b;
    };
    const wrap = el('section',undefined,'tea-museum');
    const title = el('h2',t('title')); title.id=`${uid}-title`; wrap.setAttribute('aria-labelledby',title.id);
    const content = el('div',undefined,'tea-museum-content');
    const status = el('p',undefined,'tea-museum-status');
    status.setAttribute('role','status'); status.setAttribute('aria-live','polite'); status.setAttribute('aria-atomic','true');
    wrap.append(title,el('p',t('intro'),'tea-museum-intro'),content,status);
    function sources(exhibit) {
      const block = el('div',undefined,'tea-museum-sources');
      const a = el('a',l(exhibit.sourceTitle)); a.href=l(exhibit.source); block.append(a);
      if (exhibit.citations.length) {
        const details=el('details'); details.append(el('summary',t('sources')));
        const list=el('ul');
        exhibit.citations.forEach(c => { const li=el('li'), link=el('a',c.title); link.href=c.url; li.append(link); list.append(li); });
        details.append(list); block.append(details);
      }
      return block;
    }
    function gallery(exhibits=data.exhibits) {
      const list=el('ol',undefined,'tea-museum-gallery');
      exhibits.forEach(exhibit => {
        const item=el('li'); item.dataset.galleryId=exhibit.id;
        const heading=el('h4',l(exhibit.title));
        const art=figure(exhibit); if(art)item.append(art);
        item.append(heading,el('p',l(exhibit.choices.find(c=>c.id===exhibit.correct).label),'tea-museum-restored'),el('p',l(exhibit.explanation)),sources(exhibit)); list.append(item);
      }); return list;
    }
    const collection=el('details',undefined,'tea-museum-collection');
    const collectionTitle=el('summary');collection.append(collectionTitle);
    const browse=el('details',undefined,'tea-museum-browse'); browse.append(el('summary',t('browse')),gallery());
    wrap.append(collection,browse,el('p',t('saved'),'tea-museum-note'),el('p',t('note'),'tea-museum-note'));
    function updateCollection() {
      collection.hidden=answers.size===0;
      collectionTitle.textContent=textCount('collection',answers.size);
      collection.replaceChildren(collectionTitle,gallery(queue.filter(e=>answers.has(e.id))));
    }
    function render(focus=false) {
      const turn=++generation, safe=fn=>()=>{if(turn===generation)fn();};
      const panel=el('div',undefined,'tea-museum-panel'); panel.dataset.mode=mode;
      let heading; status.textContent='';
      updateCollection();
      if(mode==='welcome') {
        panel.append(museumArt(t('illustration')),el('h3',t('invitation')),el('p',t('how')),button(t('start'),'start',safe(beginVisit)));
      } else if(mode==='summary') {
        const unseen=remaining().length;
        heading=el('h3',t(unseen?'summary':'complete')); heading.tabIndex=-1;
        panel.append(heading,el('p',t(unseen?'summaryIntro':'completeIntro')),el('p',textCount('repaired',visitCount()),'tea-museum-count'));
        if(unseen)panel.append(el('p',t('remaining',{remaining:unseen})));
        const actions=el('div',undefined,'tea-museum-actions');
        if(unseen)actions.append(button(t('more',{next:Math.min(visitSize,unseen)}),'more',safe(beginVisit)));
        actions.append(button(t('review'),'review',safe(()=>{position=0;mode='exhibit';render(true);})));
        if(!unseen)actions.append(button(t('restart'),'restart',safe(()=>{answers=new Map();hints=new Set();queue=shuffle(data.exhibits);setOrders();beginVisit();})));
        panel.append(actions);
        if(!unseen)panel.append(el('p',t('resetNote'),'tea-museum-note'));
      } else {
        const exhibit=visit[position]; panel.dataset.exhibitId=exhibit.id;
        heading=el('h3',textCount('progress',position+1),'tea-museum-progress'); heading.tabIndex=-1;
        const count=el('p',undefined,'tea-museum-count');
        const progress=el('progress');progress.max=visit.length;progress.setAttribute('aria-label',t('title'));
        panel.append(heading,count,progress);
        const display=el('div',undefined,'tea-museum-display');
        const object=el('div',undefined,'tea-museum-object');
        const art=figure(exhibit); if(art)object.append(art);
        object.append(el('h4',l(exhibit.title)));
        const plaque=el('div',undefined,'tea-museum-plaque'), plaqueTitle=el('p',t('mixed'),'tea-museum-kicker'), plaqueText=el('p',l(exhibit.claim).replace(/^(Mixed-up label: |貼錯的標籤：|贴错的标签：)/,''));
        plaque.append(plaqueTitle,plaqueText);display.append(object,plaque);panel.append(display);
        const field=el('fieldset',undefined,'tea-museum-choices');field.append(el('legend',t('question')));
        const choices=[];
        const hint=el('p',l(exhibit.hint),'tea-museum-hint');hint.id=`${uid}-hint`;
        const feedback=el('div',undefined,'tea-museum-feedback');
        const hintButton=button(t('hint'),'hint',safe(()=>{if(answers.has(exhibit.id))return;hints.add(exhibit.id);hint.hidden=false;hintButton.setAttribute('aria-expanded','true');status.textContent=l(exhibit.hint);}));
        hintButton.setAttribute('aria-controls',hint.id);
        const reveal=button(t('reveal'),'reveal',safe(()=>{if(answers.has(exhibit.id))return;answers.set(exhibit.id,'reveal');update(false);feedback.firstElementChild.focus();}));
        let next;
        function update(announce) {
          const answered=answers.has(exhibit.id), answer=answers.get(exhibit.id);
          choices.forEach(({b,c,tag})=>{
            b.setAttribute('aria-pressed',String(c.id===answer));b.setAttribute('aria-disabled',String(answered));
            b.dataset.correct=String(answered&&c.id===exhibit.correct);
            tag.hidden=!answered||(c.id!==answer&&c.id!==exhibit.correct);
            tag.textContent=c.id===exhibit.correct?t('answer'):t('selection');
          });
          count.textContent=textCount('repaired',visitCount());progress.value=visitCount();updateCollection();
          hint.hidden=!hints.has(exhibit.id);hintButton.setAttribute('aria-expanded',String(!hint.hidden));
          hintButton.hidden=answered;reveal.hidden=answered;next.disabled=!answered;
          plaque.dataset.restored=String(answered);plaqueTitle.textContent=t(answered?'fixed':'mixed');
          plaqueText.textContent=answered?l(exhibit.choices.find(c=>c.id===exhibit.correct).label):l(exhibit.claim).replace(/^(Mixed-up label: |貼錯的標籤：|贴错的标签：)/,'');
          feedback.replaceChildren();status.textContent='';
          if(answered) {
            const label=t(answer==='reveal'?'revealed':answer===exhibit.correct?'correct':'rethink');
            const title=el('h4',label);title.tabIndex=-1;
            feedback.append(title,el('p',t('evidence'),'tea-museum-kicker'),el('p',l(exhibit.explanation)),sources(exhibit));
            if(announce)status.textContent=`${label} ${t('fixed')}: ${plaqueText.textContent} ${l(exhibit.explanation)}`;
          }
        }
        orders.get(exhibit.id).forEach((c,i)=>{
          const b=button(undefined,'answer',safe(()=>{if(answers.has(exhibit.id))return;answers.set(exhibit.id,c.id);update(true);}));b.dataset.answer=c.id;
          const letter=el('span',String.fromCharCode(65+i),'tea-museum-letter');letter.setAttribute('aria-hidden','true');
          const words=el('span',l(c.label)),tag=el('span',undefined,'tea-museum-choice-tag');
          b.append(letter,words,tag);choices.push({b,c,tag});field.append(b);
        });
        const helpers=el('div',undefined,'tea-museum-actions');helpers.append(hintButton,reveal);
        const nav=el('div',undefined,'tea-museum-actions');
        const previous=button(t('previous'),'previous',safe(()=>{if(position>0){position--;render(true);}}));previous.disabled=position===0;
        next=button(t(position===visit.length-1?'finish':'next'),'next',safe(()=>{if(!answers.has(exhibit.id))return;if(position===visit.length-1)mode='summary';else position++;render(true);}));
        nav.append(previous,next);panel.append(field,helpers,hint,feedback,nav);update(false);
      }
      content.replaceChildren(panel);
      if(focus&&heading){heading.focus({preventScroll:true});heading.scrollIntoView({block:'start',behavior:'instant'});}
    }
    render();host.replaceChildren(wrap);host.dataset.museumReady='true';
  }
  const start=()=>document.querySelectorAll('[data-tea-museum]').forEach(host=>{try{mount(host);}catch(error){console.warn('Tea Museum kept its reading fallback.',error);}});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
