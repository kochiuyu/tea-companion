/* Tea-label detective: progressive enhancement, no network/storage/account.
 * Embed a host with data-tea-detective and data-locale="en|zh-hant-hk|zh-hans".
 * Load this script with defer and tea-label-detective.css. Fallback content is
 * replaced only after the detached interface has rendered successfully.
 * Teaching claims follow tea-labels.qmd and its two localized equivalents.
 * These invented labels illustrate usual meanings, not product verification.
 */
(() => {
  'use strict';
  const tr = (en, hk, cn) => ({ en, 'zh-hant-hk': hk, 'zh-hans': cn });
  const categories = {
  "origin": {
    "en": "Where the tea was grown",
    "zh-hant-hk": "茶在哪裏種植",
    "zh-hans": "茶在哪里种植"
  },
  "style": {
    "en": "A named way of making or treating tea leaves",
    "zh-hant-hk": "茶葉的特定製作或處理做法",
    "zh-hans": "茶叶的特定制作或处理做法"
  },
  "blend": {
    "en": "What is mixed or added",
    "zh-hant-hk": "混合或加入了甚麼",
    "zh-hans": "混合或加入了什么"
  },
  "type": {
    "en": "The kind of tea (green, black…)",
    "zh-hant-hk": "茶的種類（如綠茶、紅茶）",
    "zh-hans": "茶的种类（如绿茶、红茶）"
  },
  "particle": {
    "en": "The size of the leaf pieces",
    "zh-hant-hk": "茶葉碎片的大小",
    "zh-hans": "茶叶碎片的大小"
  },
  "tier": {
    "en": "A stated quality rank",
    "zh-hant-hk": "標明的品質等級",
    "zh-hans": "标明的品质等级"
  },
  "preparation": {
    "en": "How the drink is made or served",
    "zh-hant-hk": "飲品怎樣沖調或飲用",
    "zh-hans": "饮品怎样冲调或饮用"
  },
  "unknown": {
    "en": "The label does not tell us enough",
    "zh-hant-hk": "標籤提供的資料不足",
    "zh-hans": "标签提供的信息不足"
  }
};
  const ui = {
    title: tr('Tea-label detective', '茶標籤偵探', '茶标签侦探'),
    intro: tr('Tap a clue, then tap what it means to see an explanation. No typing or score.', '點選一個詞，再點選它的意思，即可看解說。不用輸入，不計分。', '点选一个词，再点选它的意思，即可看解说。不用输入，不计分。'),
    disclosure: tr('All labels are invented for practice. Meanings depend on context; more than one answer can fit. These words cannot establish caffeine content, health effects, or how a drink will make you feel.', '所有標籤均為練習而虛構。詞義視乎上下文，有時不止一種分類合理。不能憑這些詞判定咖啡因含量、健康功效或飲後感受。', '所有标签均为练习而虚构。词义取决于上下文，有时不止一种分类合理。不能凭这些词判定咖啡因含量、健康功效或饮后感受。'),
    choose: tr('Try another label (7 to explore)', '試另一張標籤（共七張）', '试另一张标签（共七张）'),
    clues: tr('1. Tap a clue', '1. 點選一個詞', '1. 点选一个词'),
    classify: tr('2. What does it tell you? Tap an answer', '2. 它說明甚麼？點選答案', '2. 它说明什么？点选答案'),
    placeholder: tr('Choose a classification…', '選擇分類…', '选择分类…'),
    check: tr('Explore this answer', '看看這個答案', '看看这个答案'),
    retry: tr('Try this clue again', '再試這個詞', '再试这个词'),
    next: tr('Next clue →', '下一個詞 →', '下一个词 →'),
    previous: tr('← Previous clue', '← 上一個詞', '← 上一个词'),
    match: tr('That reading fits this label.', '這個理解適合這張標籤。', '这个理解适合这张标签。'),
    rethink: tr('A different reading fits this context better.', '在這個上下文，另一種理解更合適。', '在这个上下文，另一种理解更合适。'),
    accepted: tr('Readings that fit: ', '合理的分類：', '合理的分类：'),
    limits: tr('What you cannot infer', '不能由此推斷', '不能由此推断'),
    selectFirst: tr('Choose a classification first. “Not enough information” is also an answer.', '請先選分類。「資料不足」也是一個答案。', '请先选分类。“信息不足”也是一个答案。'),
    saved: tr('Your choices stay here while this page is open. Switching labels does not erase them.', '只要這頁仍開着，就會保留你的選擇；切換標籤不會清除答案。', '只要这页仍开着，就会保留你的选择；切换标签不会清除答案。'),
    selected: tr('Selected clue: ', '所選的詞：', '所选的词：'),
    references: tr('Read the lesson: ', '閱讀課文：', '阅读课文：'),
    map: tr('Six tea types', '六大茶類', '六大茶类'),
    grades: tr('Grade languages', '等級用語', '等级用语')
  };
  Object.assign(ui, {
  "intro": {
    "en": "What can this packet actually tell you? Try one word at a time, with three possible meanings. No tea knowledge or typing needed.",
    "zh-hant-hk": "這張包裝實際告訴了你甚麼？每次看一個詞，從三個意思中選一個。不用先懂茶，也不用打字。",
    "zh-hans": "这张包装实际告诉了你什么？每次看一个词，从三个意思中选一个。不用先懂茶，也不用打字。"
  },
  "shortDisclosure": {
    "en": "Practice labels, not real products. Some words can have more than one useful meaning.",
    "zh-hant-hk": "這些是練習標籤，不是真實商品。有些詞可以有不止一種合理意思。",
    "zh-hans": "这些是练习标签，不是真实商品。有些词可以有不止一种合理意思。"
  },
  "about": {
    "en": "About these examples",
    "zh-hant-hk": "關於這些例子",
    "zh-hans": "关于这些例子"
  },
  "clues": {
    "en": "Words on this label · tap to switch",
    "zh-hant-hk": "標籤上的詞 · 點選可切換",
    "zh-hans": "标签上的词 · 点选可切换"
  },
  "classify": {
    "en": "Choose the meaning that fits here",
    "zh-hant-hk": "選一個適合這裏的意思",
    "zh-hans": "选一个适合这里的意思"
  },
  "question": {
    "en": "What does “{word}” tell us on this label?",
    "zh-hant-hk": "這張標籤上的「{word}」告訴了我們甚麼？",
    "zh-hans": "这张标签上的“{word}”告诉了我们什么？"
  },
  "progress": {
    "en": "Label {label} of 7 · Word {word} of {count}",
    "zh-hant-hk": "第 {label} 張／7 張 · 第 {word} 個詞／{count} 個",
    "zh-hans": "第 {label} 张／7 张 · 第 {word} 个词／{count} 个"
  },
  "hint": {
    "en": "Look closely: ",
    "zh-hant-hk": "看看線索：",
    "zh-hans": "看看线索："
  },
  "unsure": {
    "en": "Not sure? Show me",
    "zh-hant-hk": "不確定？看看解說",
    "zh-hans": "不确定？看看解说"
  },
  "revealed": {
    "en": "Let’s read this word together.",
    "zh-hant-hk": "一起看看這個詞。",
    "zh-hans": "一起看看这个词。"
  },
  "rethink": {
    "en": "Here is a more useful reading of this label.",
    "zh-hant-hk": "這張標籤可以這樣理解。",
    "zh-hans": "这张标签可以这样理解。"
  },
  "accepted": {
    "en": "Useful meaning: ",
    "zh-hant-hk": "有用的意思：",
    "zh-hans": "有用的意思："
  },
  "limits": {
    "en": "What this still does not tell you",
    "zh-hant-hk": "它仍然沒有告訴你甚麼",
    "zh-hans": "它仍然没有告诉你什么"
  },
  "readMore": {
    "en": "Read the relevant guide section →",
    "zh-hant-hk": "閱讀相關導讀 →",
    "zh-hans": "阅读相关导读 →"
  },
  "nextLabel": {
    "en": "Next label →",
    "zh-hant-hk": "下一張標籤 →",
    "zh-hans": "下一张标签 →"
  },
  "previousLabel": {
    "en": "← Previous label",
    "zh-hant-hk": "← 上一張標籤",
    "zh-hans": "← 上一张标签"
  },
  "firstLabel": {
    "en": "Back to the first label →",
    "zh-hant-hk": "返回第一張標籤 →",
    "zh-hans": "返回第一张标签 →"
  },
  "lastLabel": {
    "en": "← Last label",
    "zh-hant-hk": "← 最後一張標籤",
    "zh-hans": "← 最后一张标签"
  },
  "uncertainty": {
    "en": "“Not sure?” means you want help. “The label does not tell us enough” means the packet is missing information.",
    "zh-hant-hk": "「不確定？」是想看看解說；「標籤資料不足」則表示包裝本身沒有交代清楚。",
    "zh-hans": "“不确定？”是想看看解说；“标签信息不足”则表示包装本身没有交代清楚。"
  }
});
  const clue = (word, answers, why, limit) => ({ word, answers, why, limit });
  const typeLimit = tr('A type name does not specify the leaf dose, brewing method, or measured contents of your cup.', '茶類名不會告訴你茶葉用量、沖泡方法或杯中成分的實測含量。', '茶类名不会告诉你茶叶用量、冲泡方法或杯中成分的实测含量。');
  const black = clue(tr('Black tea', '紅茶', '红茶'), ['type'], tr('Black is one of the six manufactured tea types. In Chinese this is 紅茶, not 黑茶 (dark tea).', '紅茶是六大成品茶類之一，英文是 black tea；不要跟黑茶（dark tea）混淆。', '红茶是六大成品茶类之一，英文是 black tea；不要跟黑茶（dark tea）混淆。'), typeLimit);
  const green = clue(tr('Green tea', '綠茶', '绿茶'), ['type'], tr('Green is a manufactured type. It can contain many named styles, including Longjing and gyokuro.', '綠茶是成品茶類，包含龍井、玉露等多種做法。', '绿茶是成品茶类，包含龙井、玉露等多种做法。'), typeLimit);
  const labels = [
    { name: tr('01 · Assam breakfast packet', '01 · 阿薩姆早餐茶包裝', '01 · 阿萨姆早餐茶包装'), context: tr('Fictional packet: Assam · BOP · Black tea. No estate or harvest is listed.', '虛構包裝：阿薩姆 · BOP · 紅茶。未列茶園或採收資料。', '虚构包装：阿萨姆 · BOP · 红茶。未列茶园或采收信息。'), clues: [
      clue(tr('Assam', '阿薩姆', '阿萨姆'), ['origin'], tr('Here Assam names a region in northeast India. The separate “black tea” wording supplies the type.', '這裏的阿薩姆指印度東北部的地區；旁邊的「紅茶」才寫出茶類。', '这里的阿萨姆指印度东北部的地区；旁边的“红茶”才写出茶类。'), tr('The place word alone cannot identify an estate, harvest, cultivar, or verify origin.', '單憑地名不能辨認茶園、採收批次、品種，也不能核實產地。', '单凭地名不能辨认茶园、采收批次、品种，也不能核实产地。')),
      clue(tr('BOP', 'BOP', 'BOP'), ['particle'], tr('Broken Orange Pekoe is particle / leaf-size language in black-tea trade, not a universal quality score.', '碎橙白毫是紅茶貿易中的葉碎／大小用語，不是全球通用的品質分數。', '碎橙白毫是红茶贸易中的叶碎／大小用语，不是全球通用的品质分数。'), tr('BOP does not prove better or worse taste than OP and does not mean orange flavor.', 'BOP 不能證明比 OP 好喝或難喝，也不代表橙味。', 'BOP 不能证明比 OP 好喝或难喝，也不代表橙味。')), black
    ] },
    { name: tr('02 · Longjing gift packet', '02 · 龍井禮品包裝', '02 · 龙井礼品包装'), context: tr('Fictional packet: Longjing · Green tea · 特級. No grading standard or exact origin is given.', '虛構包裝：龍井 · 綠茶 · 特級。未提供分級標準或確切產地。', '虚构包装：龙井 · 绿茶 · 特级。未提供分级标准或确切产地。'), clues: [
      clue(tr('Longjing', '龍井', '龙井'), ['style'], tr('Here we read Longjing as a named way of making Chinese green tea, usually heating leaves in a pan. The name also has place associations, but this packet alone cannot prove where it was grown.', '這裏把龍井理解為一種中國綠茶的做法名，通常用熱鍋加熱茶葉。這個名字也有地方上的聯繫，但單靠這張包裝不能核實茶葉在哪裏種植。', '这里把龙井理解为一种中国绿茶的做法名，通常用热锅加热茶叶。这个名字也有地方上的联系，但单靠这张包装不能核实茶叶在哪里种植。'), tr('The name on this fictional packet cannot authenticate a protected origin or a particular producer.', '虛構包裝上的名字不能證實受保護產地或特定生產者。', '虚构包装上的名字不能证实受保护产地或特定生产者。')), green,
      clue(tr('特級', '特級', '特级'), ['tier'], tr('On some Chinese packets this is a quality-tier label. Its meaning depends on the producer or applicable grading system.', '在部分中文包裝上，這是品質檔次標籤；意思取決於生產者或適用的分級系統。', '在部分中文包装上，这是品质档次标签；意思取决于生产者或适用的分级系统。'), tr('Without the relevant standard, it cannot be compared with other producers or converted into OP / BOP.', '沒有相關標準，就不能跨生產者比較，更不能換算成 OP／BOP。', '没有相关标准，就不能跨生产者比较，更不能换算成 OP／BOP。'))
    ] },
    { name: tr('03 · Gyokuro leaf packet', '03 · 玉露茶葉包裝', '03 · 玉露茶叶包装'), context: tr('Fictional packet: Gyokuro · Green tea. Directions: steep the leaves, then strain.', '虛構包裝：玉露 · 綠茶。說明：浸泡茶葉，然後濾出茶湯。', '虚构包装：玉露 · 绿茶。说明：浸泡茶叶，然后滤出茶汤。'), clues: [
      clue(tr('Gyokuro', '玉露', '玉露'), ['style'], tr('Gyokuro names a shaded Japanese green-tea style; it is steeped leaf, not whisked matcha powder.', '玉露是日本遮蔭綠茶的做法名；泡的是茶葉，不是攪拌抹茶粉。', '玉露是日本遮荫绿茶的做法名；泡的是茶叶，不是搅拌抹茶粉。'), tr('It is not an OP particle grade and cannot give a measured theanine or caffeine amount.', '它不是 OP 顆粒等級，也不能提供茶氨酸或咖啡因的實測含量。', '它不是 OP 颗粒等级，也不能提供茶氨酸或咖啡因的实测含量。')),
      clue(tr('Steep, then strain', '浸泡後濾出', '浸泡后滤出'), ['preparation'], tr('This tells you how to prepare the drink, rather than where or how the tea was manufactured.', '這句說的是怎樣沖泡，不是產地或工廠怎樣製茶。', '这句说的是怎样冲泡，不是产地或工厂怎样制茶。'), tr('There is no time, temperature, or leaf-to-water ratio here, so it is not a complete brewing recipe.', '這裏沒有時間、水溫或茶水比例，並不是完整的沖泡配方。', '这里没有时间、水温或茶水比例，并不是完整的冲泡配方。'))
    ] },
    { name: tr('04 · Earl Grey tin', '04 · 伯爵茶罐', '04 · 伯爵茶罐'), context: tr('Fictional tin: Earl Grey · Black tea. Ingredients: black tea, bergamot flavor.', '虛構茶罐：伯爵茶 · 紅茶。成分：紅茶、佛手柑香料。', '虚构茶罐：伯爵茶 · 红茶。成分：红茶、佛手柑香料。'), clues: [
      clue(tr('Earl Grey', '伯爵茶', '伯爵茶'), ['blend'], tr('Earl Grey usually means tea flavored with bergamot. This ingredient list explicitly gives a black-tea base.', '伯爵茶通常指加了佛手柑香的茶；這張成分表明確寫出以紅茶為底。', '伯爵茶通常指加了佛手柑香的茶；这张成分表明确写出以红茶为底。'), tr('The name does not identify one fixed recipe, the source of the flavor, or the tea origin.', '這個名字不代表固定配方，也不能確認香料來源或茶葉產地。', '这个名字不代表固定配方，也不能确认香料来源或茶叶产地。')), black
    ] },
    { name: tr('05 · Yunnan shelf card', '05 · 雲南貨架卡', '05 · 云南货架卡'), context: tr('Fictional shelf card: Yunnan · Black tea. Nothing else is printed.', '虛構貨架卡：雲南 · 紅茶。沒有其他資料。', '虚构货架卡：云南 · 红茶。没有其他信息。'), clues: [
      clue(tr('Yunnan', '雲南', '云南'), ['origin', 'style'], tr('Origin is the clearest reading: Yunnan is a place. In black-tea trade it can also act as a style label, so both readings fit this sparse card.', '最直接的理解是產地，因為雲南是地名。但在紅茶貿易中也可用作風格／做法標籤，所以這張簡略卡容許兩種理解。', '最直接的理解是产地，因为云南是地名。但在红茶贸易中也可用作风格／做法标签，所以这张简略卡允许两种理解。'), tr('The wording does not verify provenance or mean that all Yunnan tea is black tea. Ask for producer and processing details.', '這些字不能核實來源，也不表示所有雲南茶都是紅茶；需要生產者和加工資料。', '这些字不能核实来源，也不表示所有云南茶都是红茶；需要生产者和加工信息。')), black
    ] },
    { name: tr('06 · Mystery house blend', '06 · 神秘自家拼配', '06 · 神秘自家拼配'), context: tr('Fictional packet: House blend · Gold · Evening calm. No ingredients, origin, or processing information.', '虛構包裝：自家拼配 · 金選 · 晚間寧靜。沒有成分、產地或加工資料。', '虚构包装：自家拼配 · 金选 · 晚间宁静。没有成分、产地或加工信息。'), clues: [
      clue(tr('House blend', '自家拼配', '自家拼配'), ['blend'], tr('“Blend” indicates a recipe or mixture, but the contents have not been disclosed.', '「拼配」表示配方或混合物，但未有公開成分。', '“拼配”表示配方或混合物，但没有公开成分。'), tr('You cannot tell whether it contains tea leaf, herbs, or both. Ask for the ingredient list.', '不能判斷它含茶葉、花草，還是兩者都有；需要成分表。', '不能判断它含茶叶、花草，还是两者都有；需要成分表。')),
      clue(tr('Gold', '金選', '金选'), ['unknown'], tr('There is no defined grading system here. A decorative sales word is not enough to establish a quality tier or tea type.', '這裏沒有明確的分級系統；宣傳用語不足以確定品質檔次或茶類。', '这里没有明确的分级系统；宣传用语不足以确定品质档次或茶类。'), tr('Ask which standard, if any, defines this term. Do not translate it into OP, BOP, or 特級.', '要問這個詞是否由某項標準界定；不要把它換成 OP、BOP 或特級。', '要问这个词是否由某项标准界定；不要把它换成 OP、BOP 或特级。')),
      clue(tr('Evening calm', '晚間寧靜', '晚间宁静'), ['unknown'], tr('This is a mood-themed name, not evidence of ingredients, processing, or an effect on sleep.', '這是以心情為題的名字，不是成分、加工或睡眠效果的證據。', '这是以心情为题的名字，不是成分、加工或睡眠效果的证据。'), tr('You cannot infer that it is caffeine-free, sedating, or suitable for a particular person.', '不能由此推斷它無咖啡因、有鎮靜作用或適合某個人。', '不能由此推断它无咖啡因、有镇静作用或适合某个人。'))
    ] },
    { name: tr('07 · Cafe counter card', '07 · 咖啡店櫃枱卡', '07 · 咖啡馆柜台卡'), context: tr('Fictional menu: Hong Kong–style milk tea · Decaf. No recipe or test information is provided.', '虛構餐牌：港式奶茶 · 低因。未提供配方或檢測資料。', '虚构菜单：港式奶茶 · 低因。未提供配方或检测信息。'), clues: [
      clue(tr('Hong Kong–style milk tea', '港式奶茶', '港式奶茶'), ['preparation', 'blend'], tr('This is a serving / recipe tradition, usually strong black tea with milk. “Recipe” is also a useful classification; it is not a manufactured tea type.', '這是飲用／配方傳統，通常是濃紅茶加奶。「配方」也是合理分類；它不是成品茶類。', '这是饮用／配方传统，通常是浓红茶加奶。“配方”也是合理分类；它不是成品茶类。'), tr('The words do not give milk type, sweetness, blend proportions, or the exact cafe recipe.', '這些字沒有交代奶的種類、甜度、拼配比例或店家的確切配方。', '这些字没有交代奶的种类、甜度、拼配比例或店家的确切配方。')),
      clue(tr('Decaf', '低因', '低因'), ['style'], tr('Among these choices, processing fits: decaf describes treatment to reduce caffeine. It is not one of the six manufactured tea types.', '在這些選項中，「工序」最合適：低因指經處理以減少咖啡因，不是六大成品茶類之一。', '在这些选项中，“工序”最合适：低因指经处理以减少咖啡因，不是六大成品茶类之一。'), tr('Reduced does not mean zero. The word cannot supply a residual amount or show which decaffeination method was used.', '減少不等於零。這個詞不能告訴你剩餘含量或採用哪種去咖啡因方法。', '减少不等于零。这个词不能告诉你剩余含量或采用哪种去咖啡因方法。'))
    ] }
  ];

  const guides = [
  [
    {
      "choices": [
        "origin",
        "type",
        "blend"
      ],
      "hint": {
        "en": "Read this alongside the separate “Black tea” wording.",
        "zh-hant-hk": "把這個詞和旁邊獨立寫出的「紅茶」一起看。",
        "zh-hans": "把这个词和旁边单独写出的“红茶”一起看。"
      },
      "source": "#label-western-names"
    },
    {
      "choices": [
        "tier",
        "particle",
        "blend"
      ],
      "hint": {
        "en": "These letters appear beside the tea name.",
        "zh-hant-hk": "這幾個字母印在茶名旁邊。",
        "zh-hans": "这几个字母印在茶名旁边。"
      },
      "source": "#grades"
    },
    {
      "choices": [
        "origin",
        "type",
        "preparation"
      ],
      "hint": {
        "en": "The packet also says “Assam” and “BOP.” Consider each clue separately.",
        "zh-hant-hk": "包裝也寫了「阿薩姆」和「BOP」。逐個詞看看。",
        "zh-hans": "包装也写了“阿萨姆”和“BOP”。逐个词看看。"
      },
      "source": "#type-map"
    }
  ],
  [
    {
      "choices": [
        "origin",
        "style",
        "type"
      ],
      "hint": {
        "en": "The packet also says “Green tea.”",
        "zh-hant-hk": "包裝上也寫了「綠茶」。",
        "zh-hans": "包装上也写了“绿茶”。"
      },
      "source": "#label-chinese-names"
    },
    {
      "choices": [
        "type",
        "preparation",
        "origin"
      ],
      "hint": {
        "en": "Read this alongside “Longjing” on the same packet.",
        "zh-hant-hk": "把這個詞和同一包裝上的「龍井」一起看。",
        "zh-hans": "把这个词和同一包装上的“龙井”一起看。"
      },
      "source": "#type-map"
    },
    {
      "choices": [
        "unknown",
        "tier",
        "particle"
      ],
      "hint": {
        "en": "No standard for judging this claim is printed.",
        "zh-hant-hk": "包裝沒有印出判斷這項說法的標準。",
        "zh-hans": "包装没有印出判断这项说法的标准。"
      },
      "source": "#grades"
    }
  ],
  [
    {
      "choices": [
        "type",
        "origin",
        "style"
      ],
      "hint": {
        "en": "The packet also says “Green tea” and gives directions below.",
        "zh-hant-hk": "包裝也寫了「綠茶」，下面還有說明。",
        "zh-hans": "包装也写了“绿茶”，下面还有说明。"
      },
      "source": "#label-japanese-names"
    },
    {
      "choices": [
        "preparation",
        "blend",
        "style"
      ],
      "hint": {
        "en": "Look at where these words appear on the packet: after “Directions.”",
        "zh-hant-hk": "看看這句在包裝上的位置：它寫在「說明」之後。",
        "zh-hans": "看看这句在包装上的位置：它写在“说明”之后。"
      },
      "source": "#label-japanese-names"
    }
  ],
  [
    {
      "choices": [
        "type",
        "blend",
        "origin"
      ],
      "hint": {
        "en": "Check the ingredients printed on the tin.",
        "zh-hant-hk": "看看茶罐上印的成分。",
        "zh-hans": "看看茶罐上印的成分。"
      },
      "source": "#label-western-names"
    },
    {
      "choices": [
        "origin",
        "type",
        "preparation"
      ],
      "hint": {
        "en": "These words appear both on the tin and in its ingredient list.",
        "zh-hant-hk": "茶罐上和成分表內都有這個詞。",
        "zh-hans": "茶罐上和成分表内都有这个词。"
      },
      "source": "#type-map"
    }
  ],
  [
    {
      "choices": [
        "style",
        "type",
        "origin"
      ],
      "hint": {
        "en": "The card has only two terms. A name may do more than one job.",
        "zh-hant-hk": "卡上只有兩個詞。一個名字可以有不止一種作用。",
        "zh-hans": "卡上只有两个词。一个名字可以有不止一种作用。"
      },
      "source": "#label-chinese-names"
    },
    {
      "choices": [
        "origin",
        "type",
        "preparation"
      ],
      "hint": {
        "en": "The card pairs this with “Yunnan,” without further details.",
        "zh-hant-hk": "卡上把這個詞和「雲南」放在一起，沒有其他詳情。",
        "zh-hans": "卡上把这个词和“云南”放在一起，没有其他详情。"
      },
      "source": "#type-map"
    }
  ],
  [
    {
      "choices": [
        "origin",
        "blend",
        "type"
      ],
      "hint": {
        "en": "Read the whole packet. What details are missing?",
        "zh-hant-hk": "看看整張包裝。還欠哪些資料？",
        "zh-hans": "看看整张包装。还缺哪些信息？"
      },
      "source": "#label-reading"
    },
    {
      "choices": [
        "tier",
        "unknown",
        "particle"
      ],
      "hint": {
        "en": "No ingredients or supporting details are given.",
        "zh-hant-hk": "包裝沒有提供成分或支持這項說法的詳情。",
        "zh-hans": "包装没有提供成分或支持这项说法的详情。"
      },
      "source": "#grades"
    },
    {
      "choices": [
        "preparation",
        "blend",
        "unknown"
      ],
      "hint": {
        "en": "No ingredients or supporting details are given.",
        "zh-hant-hk": "包裝沒有提供成分或支持這項說法的詳情。",
        "zh-hans": "包装没有提供成分或支持这项说法的详情。"
      },
      "source": "#label-reading"
    }
  ],
  [
    {
      "choices": [
        "blend",
        "type",
        "preparation"
      ],
      "hint": {
        "en": "This is a cafe menu, with no recipe or test details.",
        "zh-hant-hk": "這是咖啡店的餐牌，沒有配方或檢測詳情。",
        "zh-hans": "这是咖啡馆的菜单，没有配方或检测详情。"
      },
      "source": "#label-western-names"
    },
    {
      "choices": [
        "unknown",
        "style",
        "type"
      ],
      "hint": {
        "en": "This is a cafe menu, with no recipe or test details.",
        "zh-hant-hk": "這是咖啡店的餐牌，沒有配方或檢測詳情。",
        "zh-hans": "这是咖啡馆的菜单，没有配方或检测详情。"
      },
      "source": "#label-western-names"
    }
  ]
];

  let instance = 0;
  function mount(host) {
    if (host.dataset.teaDetectiveReady) return;
    const locale = Object.hasOwn(categories.origin, host.dataset.locale) ? host.dataset.locale : 'en';
    const t = value => value[locale];
    const id = `tea-detective-${++instance}`;
    let labelIndex = 0;
    const positions = labels.map(() => 0);
    const answers = labels.map(label => label.clues.map(() => ({ choice: '', checked: false })));
    const el = (tag, text, className) => {
      const node = document.createElement(tag);
      if (text !== undefined) node.textContent = text;
      if (className) node.className = className;
      return node;
    };
    const button = (text, handler) => {
      const node = el('button', text, 'tea-lab-button');
      node.type = 'button';
      node.addEventListener('click', handler);
      return node;
    };
    const root = el('section', undefined, 'tea-lab-detective');
    root.lang = locale === 'zh-hant-hk' ? 'zh-Hant-HK' : locale === 'zh-hans' ? 'zh-Hans' : 'en';
    const title = el('h3', t(ui.title));
    title.id = `${id}-title`;
    root.setAttribute('aria-labelledby', title.id);
    root.append(title, el('p', t(ui.intro)), el('p', t(ui.shortDisclosure), 'tea-lab-detective-note'));
    const picker = el('details', undefined, 'tea-lab-detective-picker');
    picker.append(el('summary', t(ui.choose)));
    const labelChoices = el('div', undefined, 'tea-lab-detective-labels');
    const labelButtons = labels.map((item, index) => {
      const choice = button(t(item.name), () => {
        labelIndex = index;
        picker.open = false;
        render(true);
      });
      choice.dataset.labelIndex = String(index);
      labelChoices.append(choice);
      return choice;
    });
    picker.append(labelChoices);
    const panel = el('div', undefined, 'tea-lab-detective-panel');
    // The persistent live region announces feedback after each answer tap.
    const status = el('p', '', 'tea-lab-detective-status');
    status.setAttribute('role', 'status');
    status.setAttribute('aria-atomic', 'true');
    root.append(picker, panel, status);
    const about = el('details', undefined, 'tea-lab-detective-about');
    about.append(el('summary', t(ui.about)), el('p', t(ui.disclosure)), el('p', t(ui.uncertainty)), el('p', t(ui.saved)));
    root.append(about);
    const references = el('p', t(ui.references), 'tea-lab-detective-note');
    [['#type-map', ui.map], ['#grades', ui.grades]].forEach(([href, text], index) => {
      if (index) references.append(document.createTextNode(' · '));
      const link = el('a', t(text));
      link.href = href;
      references.append(link);
    });
    root.append(references);

    function render(moveFocus) {
      status.textContent = '';
      labelButtons.forEach((choice, index) => choice.setAttribute('aria-pressed', String(index === labelIndex)));
      const packet = labels[labelIndex];
      const clueIndex = positions[labelIndex];
      const current = packet.clues[clueIndex];
      const state = answers[labelIndex][clueIndex];
      const support = guides[labelIndex][clueIndex];
      const content = document.createDocumentFragment();
      const progress = t(ui.progress).replace('{label}', String(labelIndex + 1)).replace('{word}', String(clueIndex + 1)).replace('{count}', String(packet.clues.length));
      content.append(el('p', progress, 'tea-lab-detective-progress'), el('p', t(packet.context), 'tea-lab-detective-packet'));
      const clues = el('fieldset', undefined, 'tea-lab-detective-clues');
      clues.append(el('legend', t(ui.clues)));
      packet.clues.forEach((item, index) => {
        const choice = button(t(item.word), () => { positions[labelIndex] = index; render(true); });
        choice.setAttribute('aria-pressed', String(index === clueIndex));
        clues.append(choice);
      });
      content.append(clues);
      const heading = el('h4', t(ui.question).replace('{word}', t(current.word)));
      heading.id = `${id}-question`;
      heading.tabIndex = -1;
      const hint = el('p', t(ui.hint) + t(support.hint), 'tea-lab-detective-hint'); hint.id = `${id}-hint`;
      content.append(heading, hint);
      const classification = el('fieldset', undefined, 'tea-lab-detective-classification');
      classification.append(el('legend', t(ui.classify)));
      classification.setAttribute('aria-labelledby', heading.id); classification.setAttribute('aria-describedby', hint.id);
      const categoryChoices = el('div', undefined, 'tea-lab-detective-categories');
      const categoryButtons = support.choices.map(value => {
        const text = categories[value];
        const choice = button(t(text), () => {
          state.choice = value;
          state.checked = true;
          categoryButtons.forEach(item => item.setAttribute('aria-pressed', String(item.dataset.category === value)));
          showFeedback();
          status.textContent = announcement();
        });
        choice.dataset.category = value;
        choice.setAttribute('aria-pressed', String(state.choice === value));
        categoryChoices.append(choice);
        return choice;
      });
      classification.append(categoryChoices);
      const feedback = el('div', undefined, 'tea-lab-detective-feedback');
      feedback.id = `${id}-feedback`;
      function announcement() {
        const title = !state.choice ? ui.revealed : current.answers.includes(state.choice) ? ui.match : ui.rethink;
        return [t(title), t(ui.accepted), current.answers.map(key => t(categories[key])).join(' / '), t(current.why), t(ui.limits), t(current.limit)].join(' ');
      }
      function showFeedback() {
        feedback.replaceChildren();
        retry.hidden = !state.checked; reveal.hidden = state.checked;
        if (!state.checked) return null;
        const title = el('h5', t(!state.choice ? ui.revealed : current.answers.includes(state.choice) ? ui.match : ui.rethink)); title.tabIndex = -1;
        const source = el('a', t(ui.readMore)); source.href = support.source;
        const sourceLine = el('p'); sourceLine.append(source);
        feedback.append(title, el('p', t(ui.accepted) + current.answers.map(key => t(categories[key])).join(' / ')),
          el('p', t(current.why)), el('strong', t(ui.limits)), el('p', t(current.limit)), sourceLine);
        return title;
      }
      const actions = el('div', undefined, 'tea-lab-detective-actions');
      const reveal = button(t(ui.unsure), () => {
        state.choice = ''; state.checked = true;
        categoryButtons.forEach(choice => choice.setAttribute('aria-pressed', 'false'));
        const title = showFeedback(); status.textContent = announcement(); if (title) title.focus();
      }); reveal.dataset.action = 'reveal';
      const retry = button(t(ui.retry), () => {
        state.choice = ''; state.checked = false;
        categoryButtons.forEach(choice => choice.setAttribute('aria-pressed', 'false'));
        status.textContent = ''; showFeedback(); categoryButtons[0].focus();
      }); retry.dataset.action = 'retry'; retry.hidden = !state.checked;
      actions.append(reveal, retry);
      content.append(classification, feedback, actions);
      const navigation = el('div', undefined, 'tea-lab-detective-actions');
      function step(direction) {
        let next = positions[labelIndex] + direction;
        if (next >= labels[labelIndex].clues.length) {
          labelIndex = (labelIndex + 1) % labels.length;
          next = 0;
        } else if (next < 0) {
          labelIndex = (labelIndex - 1 + labels.length) % labels.length;
          next = labels[labelIndex].clues.length - 1;
        }
        positions[labelIndex] = next;
        render(true);
      }
      const previousText = clueIndex > 0 ? ui.previous : labelIndex > 0 ? ui.previousLabel : ui.lastLabel;
      const nextText = clueIndex < packet.clues.length - 1 ? ui.next : labelIndex < labels.length - 1 ? ui.nextLabel : ui.firstLabel;
      navigation.append(button(t(previousText), () => step(-1)), button(t(nextText), () => step(1)));
      content.append(navigation);
      panel.replaceChildren(content);
      showFeedback();
      if (moveFocus) heading.focus();
    }
    render(false);
    host.replaceChildren(root);
    host.dataset.teaDetectiveReady = 'true';
  }
  function init() {
    document.querySelectorAll('[data-tea-detective]').forEach(host => {
      try { mount(host); } catch (error) {
        // Leave readable fallback content in place if enhancement fails.
        console.error('Tea-label detective could not initialize.', error);
      }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
