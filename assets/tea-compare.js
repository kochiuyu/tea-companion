/* Shared, dependency-free on-screen comparison game. No storage or network calls. */
(() => {
  'use strict';
  const rounds = [
  {
    "id": "oxidation",
    "correctIndex": 1,
    "source": "modules/module-01/02-processing.html",
    "en": {
      "title": "How leaves change",
      "options": [
        "Green tea",
        "Black tea"
      ],
      "question": "Which tea is usually allowed to darken more in the air before drying?",
      "explanation": "Black tea. This change is called oxidation: substances in the leaf react with oxygen in the air. Enzymes, natural helpers inside the leaf, help the reaction along. Green tea is heated early to limit it.",
      "caveat": "This is a processing difference, not proof that one tea has more caffeine or is healthier.",
      "sourceLabel": "Why green and black differ",
      "takeaway": "Use green and black as clues to processing, not as a caffeine ranking.",
      "context": "Picked leaves can change colour in the air. Tea makers can let this happen or use heat to limit it."
    },
    "zh-hant-hk": {
      "title": "茶葉怎樣變色？",
      "options": [
        "綠茶",
        "紅茶"
      ],
      "question": "哪一種茶在乾燥前，通常會讓茶葉接觸空氣、變色較多？",
      "explanation": "紅茶。這個變化叫「氧化」：茶葉中的成分與空氣中的氧氣反應。茶葉內天然存在的酶，會幫助這個反應進行。綠茶則會較早加熱，限制這個變化。",
      "caveat": "這是製作方法的分別，不能證明哪一種咖啡因較多，或哪一種較健康。",
      "sourceLabel": "綠茶與紅茶為何不同",
      "takeaway": "看到綠茶、紅茶，可先想到製作方法，不要當成咖啡因排行榜。",
      "context": "採下的茶葉接觸空氣後，顏色可以改變。製茶時，可以讓它繼續變化，也可以用加熱限制它。"
    },
    "zh-hans": {
      "title": "茶叶怎样变色？",
      "options": [
        "绿茶",
        "红茶"
      ],
      "question": "哪一种茶在干燥前，通常会让茶叶接触空气、变色更多？",
      "explanation": "红茶。这个变化叫“氧化”：茶叶中的成分与空气中的氧气反应。茶叶内天然存在的酶，会帮助这个反应进行。绿茶则会较早加热，限制这个变化。",
      "caveat": "这是制作方法的区别，不能证明哪一种咖啡因更多，或哪一种更健康。",
      "sourceLabel": "绿茶与红茶为何不同",
      "takeaway": "看到绿茶、红茶，可先想到制作方法，不要当成咖啡因排行榜。",
      "context": "采下的茶叶接触空气后，颜色可以改变。制茶时，可以让它继续变化，也可以用加热限制它。"
    }
  },
  {
    "id": "whole-leaf",
    "correctIndex": 0,
    "source": "tea-labels.html",
    "en": {
      "title": "What goes into the cup?",
      "options": [
        "Matcha",
        "Sencha"
      ],
      "question": "With which tea do you usually drink the powdered leaf itself?",
      "explanation": "Matcha. It is green tea ground into a fine powder and mixed into water, traditionally with a whisk. With sencha, you usually soak the leaves in water, then leave them behind. This is called steeping.",
      "caveat": "Both are green teas. Drinking leaf powder does not by itself tell you the caffeine dose; the amount used still matters.",
      "sourceLabel": "Japanese tea names",
      "takeaway": "Check whether a tea is a powder to whisk or leaves to steep before choosing how to prepare it.",
      "context": "Some teas are made by soaking leaves in water. Others are made by stirring in a fine powder."
    },
    "zh-hant-hk": {
      "title": "喝進去的是甚麼？",
      "options": [
        "抹茶",
        "煎茶"
      ],
      "question": "喝哪一種茶時，通常會連茶葉磨成的粉一齊喝？",
      "explanation": "抹茶。它是磨成細粉的綠茶，傳統上用茶筅，也就是專門打茶的小竹刷，把茶粉攪進水裏。煎茶則通常用水浸泡，茶葉不喝下去。",
      "caveat": "兩者都是綠茶。喝下茶葉粉，不代表能直接知道咖啡因份量；用了多少茶仍然重要。",
      "sourceLabel": "日本茶名稱",
      "takeaway": "買茶前先分清楚：是要攪開的茶粉，還是要浸泡的茶葉？",
      "context": "有些茶把茶葉浸在水裏，有些則把細細的茶粉攪進水裏。"
    },
    "zh-hans": {
      "title": "喝进去的是什么？",
      "options": [
        "抹茶",
        "煎茶"
      ],
      "question": "喝哪一种茶时，通常会连茶叶磨成的粉一起喝？",
      "explanation": "抹茶。它是磨成细粉的绿茶，传统上用茶筅，也就是专门打茶的小竹刷，把茶粉搅进水里。煎茶则通常用水浸泡，茶叶不喝下去。",
      "caveat": "两者都是绿茶。喝下茶叶粉，不代表能直接知道咖啡因含量；用了多少茶仍然重要。",
      "sourceLabel": "日本茶名称",
      "takeaway": "买茶前先分清楚：是要搅开的茶粉，还是要浸泡的茶叶？",
      "context": "有些茶把茶叶泡在水里，有些则把细细的茶粉搅进水里。"
    }
  },
  {
    "id": "roasted-rice",
    "correctIndex": 1,
    "source": "tea-labels.html",
    "en": {
      "title": "Where does the toasted smell come from?",
      "options": [
        "Houjicha",
        "Genmaicha"
      ],
      "question": "Which tea usually has roasted rice mixed in?",
      "explanation": "Genmaicha. It usually combines green tea with roasted rice. Houjicha is Japanese green tea whose leaves or stems have been roasted, meaning heated to develop a toasted smell and taste. Its name does not mean rice was added.",
      "caveat": "Blends can combine these ingredients in different ways. Check the ingredient list on the actual packet.",
      "sourceLabel": "Roasted tea and rice blends",
      "takeaway": "A roasted aroma does not tell you whether rice is included; the name and ingredients help.",
      "context": "A toasted smell can come from heating the tea leaves or from adding toasted ingredients."
    },
    "zh-hant-hk": {
      "title": "香味從哪裏來？",
      "options": [
        "焙茶",
        "玄米茶"
      ],
      "question": "哪一種茶通常會加入炒香的米？",
      "explanation": "玄米茶。通常是綠茶配炒米。焙茶則是把日本綠茶的葉或茶梗烘焙，也就是加熱，帶出像烤過食物的香味。這個名稱本身不表示加了米。",
      "caveat": "不同配方可以混合這些材料。買茶時，仍要看看包裝上的成分表。",
      "sourceLabel": "焙茶與炒米配方",
      "takeaway": "有烘香不一定有米；茶名和成分表可以幫你分辨。",
      "context": "把茶葉烘熱，或加入炒香的材料，都可以帶來像烤過食物的香味。"
    },
    "zh-hans": {
      "title": "香味从哪里来？",
      "options": [
        "焙茶",
        "玄米茶"
      ],
      "question": "哪一种茶通常会加入炒香的米？",
      "explanation": "玄米茶。通常是绿茶配炒米。焙茶则是把日本绿茶的叶或茶梗烘焙，也就是加热，带出像烤过食物的香味。这个名称本身不表示加了米。",
      "caveat": "不同配方可以混合这些材料。买茶时，仍要看看包装上的配料表。",
      "sourceLabel": "焙茶与炒米配方",
      "takeaway": "有烘香不一定有米；茶名和配料表可以帮你分辨。",
      "context": "把茶叶烘热，或加入炒香的材料，都可以带来像烤过食物的香味。"
    }
  },
  {
    "id": "tea-or-herbal",
    "correctIndex": 0,
    "source": "tea-basics.html",
    "en": {
      "title": "Leaves or flowers?",
      "options": [
        "Jasmine green tea",
        "Pure chamomile flower tea"
      ],
      "question": "Which drink contains leaves from the tea bush?",
      "explanation": "Jasmine green tea. Its green-tea leaves come from the tea bush, whose scientific name is Camellia sinensis, and take on the scent of jasmine flowers. Pure chamomile is made with flowers from a different plant. Soaking those flowers in water makes a herbal infusion.",
      "caveat": "This comparison assumes pure chamomile. A chamomile blend may also contain tea leaves, so check its ingredients.",
      "sourceLabel": "Tea plant or herbal infusion",
      "takeaway": "A flower on the label does not tell you whether the drink has a tea-leaf base.",
      "context": "Drinks called “tea” can be made with tea leaves, flowers or other plants."
    },
    "zh-hant-hk": {
      "title": "茶葉還是花？",
      "options": [
        "茉莉綠茶",
        "純洋甘菊花草茶"
      ],
      "question": "哪一杯含有茶樹的葉子？",
      "explanation": "茉莉綠茶。它用茶樹的葉子製成綠茶，再讓茶葉吸收茉莉花香。茶樹的學名是 Camellia sinensis。純洋甘菊花草茶用的是另一種植物的花，不是茶樹的葉子。",
      "caveat": "這裏比較的是純洋甘菊。有些洋甘菊配方也會加入茶葉，要看清楚成分。",
      "sourceLabel": "茶樹茶與花草茶",
      "takeaway": "標籤上有花，不代表沒有茶葉；先看看飲品的底子。",
      "context": "名字有「茶」的飲品，可以用茶葉、花，或其他植物沖泡。"
    },
    "zh-hans": {
      "title": "茶叶还是花？",
      "options": [
        "茉莉绿茶",
        "纯洋甘菊花草茶"
      ],
      "question": "哪一杯含有茶树的叶子？",
      "explanation": "茉莉绿茶。它用茶树的叶子制成绿茶，再让茶叶吸收茉莉花香。茶树的学名是 Camellia sinensis。纯洋甘菊花草茶用的是另一种植物的花，不是茶树的叶子。",
      "caveat": "这里比较的是纯洋甘菊。有些洋甘菊配方也会加入茶叶，要看清楚配料。",
      "sourceLabel": "茶树茶与花草茶",
      "takeaway": "标签上有花，不代表没有茶叶；先看看饮品的底子。",
      "context": "名字有“茶”的饮品，可以用茶叶、花，或其他植物冲泡。"
    },
    "additionalSource": "tea-labels.html"
  },
  {
    "id": "microbes",
    "correctIndex": 1,
    "source": "modules/module-01/02-processing.html",
    "en": {
      "title": "Tiny helpers",
      "options": [
        "Black tea",
        "Ripe Pu-erh tea"
      ],
      "question": "Which tea gets help from tiny living things as it is made?",
      "explanation": "Ripe Pu-erh. Microbes, living things too small to see without magnification, help change the leaves. This is called microbial fermentation. Ordinary black tea mainly changes through oxidation: leaf substances react with oxygen, helped by enzymes, natural helpers inside the leaf.",
      "caveat": "Raw and ripe Pu-erh follow different methods. “Fermented” on its own does not describe every tea-making process.",
      "sourceLabel": "Oxidation and fermentation",
      "takeaway": "When a seller says “fermented,” ask which process they mean.",
      "context": "Bread and yoghurt are made with help from tiny living things. Some teas are too."
    },
    "zh-hant-hk": {
      "title": "看不見的小幫手",
      "options": [
        "紅茶",
        "普洱熟茶"
      ],
      "question": "製作哪一種茶時，會依靠肉眼看不見的小生物，幫助茶葉變化？",
      "explanation": "普洱熟茶。這些肉眼看不見的小生物叫「微生物」，它們幫助茶葉變化，這叫「微生物發酵」。一般紅茶則主要靠「氧化」：茶葉中的成分與氧氣反應，由葉內天然存在的酶幫助反應進行。",
      "caveat": "普洱生茶與熟茶的做法不同。單看「發酵」二字，不能知道所有製茶過程。",
      "sourceLabel": "氧化與發酵",
      "takeaway": "店家說「發酵」時，可以追問：指的是哪一種製作過程？",
      "context": "製作麵包和乳酪時，會用到細小生物的幫忙。有些茶也是。"
    },
    "zh-hans": {
      "title": "看不见的小帮手",
      "options": [
        "红茶",
        "普洱熟茶"
      ],
      "question": "制作哪一种茶时，会依靠肉眼看不见的小生物，帮助茶叶变化？",
      "explanation": "普洱熟茶。这些肉眼看不见的小生物叫“微生物”，它们帮助茶叶变化，这叫“微生物发酵”。一般红茶则主要靠“氧化”：茶叶中的成分与氧气反应，由叶内天然存在的酶帮助反应进行。",
      "caveat": "普洱生茶与熟茶的做法不同。单看“发酵”二字，不能知道所有制茶过程。",
      "sourceLabel": "氧化与发酵",
      "takeaway": "商家说“发酵”时，可以追问：指的是哪一种制作过程？",
      "context": "制作面包和酸奶时，会用到微小生物的帮助。有些茶也是。"
    },
    "additionalSource": "tea-labels.html"
  },
  {
    "id": "citrus-name",
    "correctIndex": 0,
    "source": "tea-labels.html",
    "en": {
      "title": "A fruity-sounding name",
      "options": [
        "Earl Grey",
        "Orange Pekoe"
      ],
      "question": "Which name usually means tea with a citrus flavour added?",
      "context": "A tea name can describe an added flavour, but it can also describe the size of the leaves.",
      "explanation": "Earl Grey. It is usually black tea flavoured with bergamot, a citrus fruit. Orange Pekoe is a leaf-size term used in the black-tea trade; the word “Orange” does not mean orange flavour was added.",
      "caveat": "Names do different jobs: a tea could carry both a flavour name and a leaf-size label. Check the ingredients for the actual recipe.",
      "sourceLabel": "Flavour names and leaf-size labels",
      "takeaway": "A fruity-sounding tea name is not an ingredient list."
    },
    "zh-hant-hk": {
      "title": "茶名有水果的意思嗎？",
      "options": [
        "伯爵茶",
        "橙白毫（Orange Pekoe）"
      ],
      "question": "哪個名稱通常表示茶加入了柑橘香味？",
      "context": "茶名可以說明加了甚麼香味，也可以說明茶葉的大小。",
      "explanation": "伯爵茶。它通常是加入佛手柑香味的紅茶，佛手柑是一種柑橘。橙白毫則是紅茶貿易中描述茶葉大小的用語；名稱裏有「橙」，不代表加入了橙味。",
      "caveat": "不同名稱可以各有用途：同一款茶可以同時有香味名稱和茶葉大小標示。實際配方仍要看成分表。",
      "sourceLabel": "香味名稱與茶葉大小標示",
      "takeaway": "茶名有水果的字眼，不代表加了那種水果味。"
    },
    "zh-hans": {
      "title": "茶名有水果的意思吗？",
      "options": [
        "伯爵茶",
        "橙白毫（Orange Pekoe）"
      ],
      "question": "哪个名称通常表示茶加入了柑橘香味？",
      "context": "茶名可以说明加了什么香味，也可以说明茶叶的大小。",
      "explanation": "伯爵茶。它通常是加入佛手柑香味的红茶，佛手柑是一种柑橘。橙白毫则是红茶贸易中描述茶叶大小的用语；名称里有“橙”，不代表加入了橙味。",
      "caveat": "不同名称可以各有用途：同一款茶可以同时有香味名称和茶叶大小标示。实际配方仍要看配料表。",
      "sourceLabel": "香味名称与茶叶大小标示",
      "takeaway": "茶名有水果的字眼，不代表加了那种水果味。"
    }
  },
  {
    "id": "shade-name",
    "correctIndex": 1,
    "source": "tea-labels.html",
    "en": {
      "title": "Before the leaves are picked",
      "options": [
        "Genmaicha",
        "Gyokuro"
      ],
      "question": "Which name tells you the leaves were sheltered from the sun before picking?",
      "context": "Tea names can tell you about life in the garden or about ingredients mixed in later.",
      "explanation": "Gyokuro. It is a Japanese green-tea style made with shaded leaves, which you steep in water rather than whisk as powder. Genmaicha describes a mixture of green tea and roasted rice, rather than a particular shade-growing method.",
      "caveat": "A growing method and a blend recipe are different clues. The word genmaicha alone does not tell you every growing condition of its tea leaves.",
      "sourceLabel": "Japanese growing and blend names",
      "takeaway": "Separate how the leaves were grown from what was mixed into the tea."
    },
    "zh-hant-hk": {
      "title": "採茶之前的故事",
      "options": [
        "玄米茶",
        "玉露"
      ],
      "question": "哪個茶名表示採茶前，茶葉曾被遮擋陽光？",
      "context": "茶名可以說明茶葉在茶園裏怎樣生長，也可以說明後來混入了甚麼材料。",
      "explanation": "玉露。這種日本綠茶用遮蔭種植的茶葉製作，喝時浸泡茶葉，不是把茶粉攪進水裏。玄米茶則指綠茶配炒米，名稱說的是配方，不是某一種遮蔭種植方法。",
      "caveat": "種植方法和混合配方是兩回事。單看「玄米茶」這個名字，不能知道茶葉生長時的所有條件。",
      "sourceLabel": "日本茶的種植與配方名稱",
      "takeaway": "先分清楚：名稱說的是怎樣種茶，還是茶裏加了甚麼？"
    },
    "zh-hans": {
      "title": "采茶之前的故事",
      "options": [
        "玄米茶",
        "玉露"
      ],
      "question": "哪个茶名表示采茶前，茶叶曾被遮挡阳光？",
      "context": "茶名可以说明茶叶在茶园里怎样生长，也可以说明后来混入了什么材料。",
      "explanation": "玉露。这种日本绿茶用遮荫种植的茶叶制作，喝时浸泡茶叶，不是把茶粉搅进水里。玄米茶则指绿茶配炒米，名称说的是配方，不是某一种遮荫种植方法。",
      "caveat": "种植方法和混合配方是两回事。单看“玄米茶”这个名字，不能知道茶叶生长时的所有条件。",
      "sourceLabel": "日本茶的种植与配方名称",
      "takeaway": "先分清楚：名称说的是怎样种茶，还是茶里加了什么？"
    }
  },
  {
    "id": "gentle-handling",
    "correctIndex": 0,
    "source": "modules/module-01/02-processing.html",
    "en": {
      "title": "A lighter touch",
      "options": [
        "White tea",
        "Black tea"
      ],
      "question": "Which tea is usually made with less rolling or crushing of the leaves?",
      "context": "Tea makers can leave leaves mostly intact or roll and crush them as part of making tea.",
      "explanation": "White tea. Its usual route is to let the leaves lose moisture, then dry them, with little rolling. That first moisture-loss step is called withering. Black tea usually includes rolling or crushing before the leaves darken through reactions with air.",
      "caveat": "This is a usual processing pattern, not a promise that white tea has less caffeine or is healthier.",
      "sourceLabel": "How white and black teas are handled",
      "takeaway": "Less handling describes a making method, not a health ranking."
    },
    "zh-hant-hk": {
      "title": "少揉一點的做法",
      "options": [
        "白茶",
        "紅茶"
      ],
      "question": "製作哪一種茶時，通常較少揉搓或壓碎茶葉？",
      "context": "製茶時，可以讓茶葉保持較完整，也可以把茶葉揉搓或壓碎。",
      "explanation": "白茶。常見做法是先讓茶葉失去一些水分，再乾燥，較少揉捻。前面失去水分的步驟叫「萎凋」。紅茶通常會先揉捻或壓碎，然後讓茶葉與空氣反應、顏色變深。",
      "caveat": "這是常見製作方式，不代表白茶一定較少咖啡因，或較健康。",
      "sourceLabel": "白茶與紅茶怎樣處理茶葉",
      "takeaway": "處理步驟較少，是製作方法的描述，不是健康排名。"
    },
    "zh-hans": {
      "title": "少揉一点的做法",
      "options": [
        "白茶",
        "红茶"
      ],
      "question": "制作哪一种茶时，通常较少揉搓或压碎茶叶？",
      "context": "制茶时，可以让茶叶保持较完整，也可以把茶叶揉搓或压碎。",
      "explanation": "白茶。常见做法是先让茶叶失去一些水分，再干燥，较少揉捻。前面失去水分的步骤叫“萎凋”。红茶通常会先揉捻或压碎，然后让茶叶与空气反应、颜色变深。",
      "caveat": "这是常见制作方式，不代表白茶一定更少咖啡因，或更健康。",
      "sourceLabel": "白茶与红茶怎样处理茶叶",
      "takeaway": "处理步骤较少，是制作方法的描述，不是健康排名。"
    }
  },
  {
    "id": "steam-or-pan",
    "correctIndex": 1,
    "source": "tea-labels.html",
    "en": {
      "title": "Steam or a hot pan?",
      "options": [
        "Longjing / Dragon Well",
        "Sencha"
      ],
      "question": "Which green tea is usually heated with steam early in its making?",
      "context": "Steam and a hot pan are two ways to heat freshly picked leaves and limit their darkening.",
      "explanation": "Sencha. Its leaves are usually steamed, then rolled and dried. Longjing is a Chinese green-tea style made using a hot pan. Both use early heat to limit oxidation, the change caused when substances in the leaves react with air.",
      "caveat": "These are the usual methods for these two styles, not a rule for every tea made in Japan or China.",
      "sourceLabel": "Sencha and Longjing methods",
      "takeaway": "Two teas can both be green tea while using different kinds of heat."
    },
    "zh-hant-hk": {
      "title": "蒸氣還是熱鍋？",
      "options": [
        "龍井",
        "煎茶"
      ],
      "question": "哪一種綠茶在製作初期，通常會用蒸氣加熱？",
      "context": "蒸氣和熱鍋都可以加熱剛採下的茶葉，限制茶葉變色。",
      "explanation": "煎茶。茶葉通常先蒸，再揉捻和乾燥。龍井則是用熱鍋炒製的中國綠茶。兩者都利用較早加熱來限制「氧化」，也就是茶葉中的成分與空氣反應所產生的變化。",
      "caveat": "這是這兩款茶的常見做法，不是所有日本茶或中國茶都一定這樣製作。",
      "sourceLabel": "煎茶與龍井的製法",
      "takeaway": "同樣是綠茶，也可以用不同方式加熱茶葉。"
    },
    "zh-hans": {
      "title": "蒸汽还是热锅？",
      "options": [
        "龙井",
        "煎茶"
      ],
      "question": "哪一种绿茶在制作初期，通常会用蒸汽加热？",
      "context": "蒸汽和热锅都可以加热刚采下的茶叶，限制茶叶变色。",
      "explanation": "煎茶。茶叶通常先蒸，再揉捻和干燥。龙井则是用热锅炒制的中国绿茶。两者都利用较早加热来限制“氧化”，也就是茶叶中的成分与空气反应所产生的变化。",
      "caveat": "这是这两款茶的常见做法，不是所有日本茶或中国茶都一定这样制作。",
      "sourceLabel": "煎茶与龙井的制法",
      "takeaway": "同样是绿茶，也可以用不同方式加热茶叶。"
    }
  },
  {
    "id": "place-or-blend",
    "correctIndex": 0,
    "source": "tea-labels.html",
    "en": {
      "title": "A place or a recipe?",
      "options": [
        "Assam",
        "English Breakfast"
      ],
      "question": "Which name tells you a region where the tea was grown?",
      "context": "A name on a tea box may point to a growing region or to a recipe made by mixing teas.",
      "explanation": "Assam. On a tea label, it points to Assam in northeast India. English Breakfast is usually a blend of black teas, which may include Assam tea. Its recipe can differ from one brand to another.",
      "caveat": "An origin name does not by itself identify a single garden or guarantee one taste. Read the rest of the label too.",
      "sourceLabel": "Origin names and breakfast blends",
      "takeaway": "Treat the growing place and the blend recipe as two separate clues."
    },
    "zh-hant-hk": {
      "title": "地方還是配方？",
      "options": [
        "阿薩姆",
        "英式早餐茶"
      ],
      "question": "哪個名稱告訴你茶葉生長的地區？",
      "context": "茶盒上的名字，可以指種茶的地區，也可以指把不同茶葉混合的配方。",
      "explanation": "阿薩姆。茶標籤上的這個名字，指向印度東北部的阿薩姆地區。英式早餐茶通常是混合不同紅茶的配方，可以包括阿薩姆茶；不同品牌的配方也可以不同。",
      "caveat": "單靠產地名，不能知道是哪一個茶園，也不能保證只有一種味道。還要看看標籤上的其他資料。",
      "sourceLabel": "產地名稱與早餐茶配方",
      "takeaway": "把茶葉來自哪裏，和配方怎樣混合，分開來看。"
    },
    "zh-hans": {
      "title": "地方还是配方？",
      "options": [
        "阿萨姆",
        "英式早餐茶"
      ],
      "question": "哪个名称告诉你茶叶生长的地区？",
      "context": "茶盒上的名字，可以指种茶的地区，也可以指把不同茶叶混合的配方。",
      "explanation": "阿萨姆。茶标签上的这个名字，指向印度东北部的阿萨姆地区。英式早餐茶通常是混合不同红茶的配方，可以包括阿萨姆茶；不同品牌的配方也可以不同。",
      "caveat": "单靠产地名，不能知道是哪一个茶园，也不能保证只有一种味道。还要看看标签上的其他信息。",
      "sourceLabel": "产地名称与早餐茶配方",
      "takeaway": "把茶叶来自哪里，和配方怎样混合，分开来看。"
    }
  }
];
  const copy = {
  "en": {
    "eyebrow": "A little tea intuition",
    "title": "Two teas. One guess.",
    "intro": "Two short sets of five. No tea knowledge needed: use the clue and take a guess. Stop after one set, or try both.",
    "guess": "Tap your guess",
    "unsure": "Not sure? Show me",
    "correct": "That’s it:",
    "answer": "The answer is",
    "answerMark": "Answer",
    "yourGuess": "Your guess",
    "takeaway": "Keep this clue:",
    "caveat": "A little nuance:",
    "sources": "Read why:",
    "more": "More on tea names",
    "next": "Next pair →",
    "previous": "← Previous pair",
    "finish": "See what you learned →",
    "restart": "Start again",
    "round": "Round",
    "of": "of",
    "doneTitle": "Both sets complete. Ten clues, ready to use.",
    "doneIntro": "You have explored ten useful differences. Keep these clues for your next menu, tea packet or cup.",
    "notice": "No tea, timer or typing needed. This game explains tea categories; it does not predict caffeine, health effects or how every cup will taste.",
    "clue": "A clue:",
    "progress": "Set {set} of 2 · Question {round} of 5",
    "checkpoint": "See your five clues →",
    "breakTitle": "One set complete. Five clues to take with you.",
    "breakIntro": "That is a complete little tea adventure. You can stop here, or try five more whenever you feel like it.",
    "continueSet": "Try five more →",
    "backSet": "← Back to your first five clues"
  },
  "zh-hant-hk": {
    "eyebrow": "培養一點識茶直覺",
    "title": "兩款茶，猜一猜。",
    "intro": "兩組小遊戲，每組五題。不用先懂茶，看看提示就可以猜。玩一組便可停下，也可以兩組都試。",
    "guess": "點選你的猜測",
    "unsure": "不確定？看看答案",
    "correct": "猜中了：",
    "answer": "答案是",
    "answerMark": "答案",
    "yourGuess": "你的猜測",
    "takeaway": "記住這個線索：",
    "caveat": "再留意一點：",
    "sources": "看看原因：",
    "more": "更多茶名知識",
    "next": "下一題 →",
    "previous": "← 上一題",
    "finish": "看看學到了甚麼 →",
    "restart": "由頭再玩",
    "round": "第",
    "of": "／",
    "doneTitle": "兩組都完成了！十個線索，下次喝茶就用得上。",
    "doneIntro": "你已探索十個實用分別。下次看茶單、讀包裝或沖茶時，可以帶着這些線索。",
    "notice": "不用準備茶、計時器或打字。遊戲解釋茶的分類，並不預測咖啡因、健康效果或每一杯的味道。",
    "clue": "小提示：",
    "progress": "第 {set} 組 · 第 {round} 題／5 題",
    "checkpoint": "看看這五個線索 →",
    "breakTitle": "第一組完成！帶走這五個線索。",
    "breakIntro": "這已是一次完整的小探索。你可以在這裏停下，想繼續時再試五題。",
    "continueSet": "再試五題 →",
    "backSet": "← 返回前五個線索"
  },
  "zh-hans": {
    "eyebrow": "培养一点识茶直觉",
    "title": "两款茶，猜一猜。",
    "intro": "两组小游戏，每组五题。不用先懂茶，看看提示就可以猜。玩一组就可以停下，也可以两组都试。",
    "guess": "点选你的猜测",
    "unsure": "不确定？看看答案",
    "correct": "猜中了：",
    "answer": "答案是",
    "answerMark": "答案",
    "yourGuess": "你的猜测",
    "takeaway": "记住这个线索：",
    "caveat": "再留意一点：",
    "sources": "看看原因：",
    "more": "更多茶名知识",
    "next": "下一题 →",
    "previous": "← 上一题",
    "finish": "看看学到了什么 →",
    "restart": "从头再玩",
    "round": "第",
    "of": "／",
    "doneTitle": "两组都完成了！十个线索，下次喝茶就用得上。",
    "doneIntro": "你已探索十个实用区别。下次看茶单、读包装或泡茶时，可以带着这些线索。",
    "notice": "不用准备茶、计时器或打字。游戏解释茶的分类，并不预测咖啡因、健康效果或每一杯的味道。",
    "clue": "小提示：",
    "progress": "第 {set} 组 · 第 {round} 题／5 题",
    "checkpoint": "看看这五个线索 →",
    "breakTitle": "第一组完成！带走这五个线索。",
    "breakIntro": "这已经是一次完整的小探索。你可以在这里停下，想继续时再试五题。",
    "continueSet": "再试五题 →",
    "backSet": "← 返回前五个线索"
  }
};
  function init(host, instance) {
    if (host.dataset.teaCompareReady) return;
    const locale = copy[host.dataset.locale] ? host.dataset.locale : 'en';
    const t = copy[locale], prefix = `tea-compare-${instance}`;
    const el = (tag, text, cls) => { const node = document.createElement(tag); if (text) node.textContent = text; if (cls) node.className = cls; return node; };
    const button = (label, action, cls = '') => { const b = el('button', label, `tea-compare-button ${cls}`); b.type = 'button'; b.addEventListener('click', action); return b; };
    const link = (label, path) => { const a = el('a', label); a.href = `${host.dataset.root || '../..'}/${path}`; return a; };
    const root = el('section', '', 'tea-compare');
    const heading = el('h3', t.title); heading.id = `${prefix}-title`; root.setAttribute('aria-labelledby', heading.id);
    root.append(el('p', t.eyebrow, 'tea-compare-eyebrow'), heading, el('p', t.intro, 'tea-compare-intro'));
    const panel = el('div'); root.append(panel, el('p', t.notice, 'tea-compare-notice'));
    let current = 0;
    const guesses = rounds.map(() => undefined);
    function showRound(moveFocus = false) {
      const round = rounds[current], content = round[locale], fragment = document.createDocumentFragment();
      const setIndex = Math.floor(current / 5), atSetEnd = (current + 1) % 5 === 0;
      const position = t.progress.replace('{set}', String(setIndex + 1)).replace('{round}', String(current % 5 + 1));
      const progress = el('p', `${position} · ${content.title}`, 'tea-compare-progress');
      const question = el('h4', content.question, 'tea-compare-question'); question.id = `${prefix}-question`; question.tabIndex = -1;
      const clue = el('p', `${t.clue} ${content.context}`, 'tea-compare-clue'); clue.id = `${prefix}-clue`;
      const pair = el('div', '', 'tea-compare-pair'); pair.setAttribute('role', 'group'); pair.setAttribute('aria-labelledby', question.id); pair.setAttribute('aria-describedby', clue.id);
      const cards = content.options.map((name, index) => {
        const card = button('', () => reveal(index), 'tea-compare-option'); card.dataset.answer = String(index);
        if (typeof window !== 'undefined' && window.TeaGameFigures) card.append(window.TeaGameFigures.art('cup'));
        card.append(el('span', index ? 'B' : 'A', 'tea-compare-letter'), el('span', name, 'tea-compare-name'));
        const mark = el('span', t.guess, 'tea-compare-mark'); card.append(mark); pair.append(card);
        return { card, mark };
      });
      const unsure = button(t.unsure, () => reveal(null), 'tea-compare-secondary'); unsure.dataset.action = 'reveal';
      const feedback = el('div', '', 'tea-compare-feedback'); feedback.setAttribute('role', 'status'); feedback.setAttribute('aria-live', 'polite'); feedback.setAttribute('aria-atomic', 'true');
      const actions = el('div', '', 'tea-compare-actions');
      const previous = button(current === 5 ? t.backSet : t.previous, () => { if (current === 5) showSummary(0); else if (current > 0) { current--; showRound(true); } }, 'tea-compare-secondary'); previous.dataset.action = 'previous'; previous.hidden = current === 0;
      const nextLabel = atSetEnd ? (setIndex === 0 ? t.checkpoint : t.finish) : t.next;
      const next = button(nextLabel, () => { if (guesses[current] === undefined) return; if (atSetEnd) showSummary(setIndex); else { current++; showRound(true); } }); next.dataset.action = 'next'; next.disabled = guesses[current] === undefined;
      actions.append(previous, next); fragment.append(progress, question, clue, pair, unsure, feedback, actions); panel.replaceChildren(fragment); panel.dataset.round = round.id;
      function paintAnswer() {
        const guess = guesses[current];
        cards.forEach(({card, mark}, index) => {
          card.setAttribute('aria-disabled', 'true'); card.setAttribute('aria-pressed', String(guess === index));
          card.dataset.result = index === round.correctIndex ? 'correct' : guess === index ? 'incorrect' : '';
          mark.textContent = [guess === index ? t.yourGuess : '', index === round.correctIndex ? t.answerMark : ''].filter(Boolean).join(' · ');
        });
        unsure.hidden = true; next.disabled = false;
        const title = el('h5', `${guess === round.correctIndex ? t.correct : t.answer} ${content.options[round.correctIndex]}`); title.tabIndex = -1;
        const sources = el('p', `${t.sources} `); sources.append(link(content.sourceLabel, round.source));
        if (round.additionalSource) sources.append(document.createTextNode(' · '), link(t.more, round.additionalSource));
        feedback.replaceChildren(title, el('p', content.explanation), el('p', `${t.takeaway} ${content.takeaway}`, 'tea-compare-takeaway'), el('p', `${t.caveat} ${content.caveat}`), sources);
        return title;
      }
      function reveal(guess) { if (guesses[current] !== undefined) return; guesses[current] = guess; const resultHeading = paintAnswer(); if (guess === null) resultHeading.focus(); }
      if (guesses[current] !== undefined) paintAnswer();
      if (moveFocus) question.focus();
    }
    function showSummary(setIndex) {
      const isBreak = setIndex === 0;
      const summary = el('div', '', 'tea-compare-summary'); summary.dataset.setSummary = String(setIndex + 1);
      const title = el('h4', isBreak ? t.breakTitle : t.doneTitle); title.tabIndex = -1;
      const list = el('ol');
      rounds.slice(0, isBreak ? 5 : rounds.length).forEach(round => { const c = round[locale], item = el('li', c.takeaway + ' '); item.append(link(c.sourceLabel, round.source)); list.append(item); });
      const actions = el('div', '', 'tea-compare-actions');
      if (isBreak) { const continueButton = button(t.continueSet, () => { current = 5; showRound(true); }); continueButton.dataset.action = 'continue'; actions.append(continueButton); }
      const restart = button(t.restart, () => { guesses.fill(undefined); current = 0; showRound(true); }, isBreak ? 'tea-compare-secondary' : ''); restart.dataset.action = 'restart'; actions.append(restart);
      summary.append(title, el('p', isBreak ? t.breakIntro : t.doneIntro), list, actions); panel.replaceChildren(summary); panel.dataset.round = isBreak ? 'checkpoint' : 'summary'; title.focus();
    }
    showRound(); host.replaceChildren(root); host.dataset.teaCompareReady = 'true';
  }
  const boot = () => document.querySelectorAll('[data-tea-compare]').forEach((host, index) => {
    try { init(host, index); } catch (error) { console.error('Tea comparison game could not initialize.', error); }
  });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
