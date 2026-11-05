/* Dates describe the named events, not the invention of tea or whole traditions.
 * See reviews/tea-time-machine-review.md for the source audit. */
(() => {
  'use strict';
  const l = (en, hant, hans) => ({ en, 'zh-hant-hk': hant, 'zh-hans': hans });
  window.TeaTimeMachineData = {
    events: [
      {
        id: 'lu-yu', start: 760, end: 780, icon: 'book',
        date: l('c. 760–780', '約760–780年', '约760–780年'),
        title: l('Lu Yu writes The Classic of Tea', '陸羽寫《茶經》', '陆羽写《茶经》'),
        hint: l('Think Tang-dynasty China, many centuries before European tea trading ships.', '想想唐代中國：比歐洲運茶商船早了許多個世紀。', '想想唐代中国：比欧洲运茶商船早了许多个世纪。'),
        story: l('Lu Yu gathered knowledge about tea and its preparation in Tang-dynasty China. The work is dated approximately, here to 760–780. This is a landmark in tea writing, not the moment people first drank tea.', '陸羽在唐代中國整理了茶與製茶、飲茶的知識。《茶經》的成書時間並非精確日期，這裏採用約760至780年。這是茶書的重要里程碑，不是人類開始飲茶的時刻。', '陆羽在唐代中国整理了茶与制茶、饮茶的知识。《茶经》的成书时间并非精确日期，这里采用约760至780年。这是茶书的重要里程碑，不是人类开始饮茶的时刻。'),
        source: 'https://www.educationaboutasia.org/article/id/861/print/',
        sourceTitle: l('Education About Asia: Chinese Tea in World History', '《Education About Asia》：世界史中的中國茶', '《Education About Asia》：世界史中的中国茶')
      },
      {
        id: 'eisai', start: 1191, end: 1191, icon: 'leaf',
        date: l('1191', '1191年', '1191年'),
        title: l('Eisai returns to Japan with tea seeds', '榮西帶茶種返回日本', '荣西带茶种返回日本'),
        hint: l('Think medieval travel between Song China and Japan, rather than the age of Atlantic tea protests.', '想想宋代中國與日本之間的往來，還未到大西洋兩岸因茶而起抗議的年代。', '想想宋代中国与日本之间的往来，还未到大西洋两岸因茶而起抗议的年代。'),
        story: l('The monk Eisai returned from China with tea seeds and tea knowledge in 1191. Tea had reached Japan earlier. His journey was one step in a long exchange, not the invention of Japanese tea culture.', '僧人榮西在1191年從中國帶回茶種與飲茶知識。茶在此之前已傳到日本。他的旅程是長期交流的一環，並非日本茶文化的起點。', '僧人荣西在1191年从中国带回茶种与饮茶知识。茶在此之前已传到日本。他的旅程是长期交流的一环，并非日本茶文化的起点。'),
        source: 'https://www.fivecolleges.edu/community/center-east-asian-studies/japanese-tea-ceremony/history-tea',
        sourceTitle: l('Five College Center for East Asian Studies: History of Tea', '五校聯盟東亞研究中心：茶的歷史', '五校联盟东亚研究中心：茶的历史'),
        extraSource: 'https://www.educationaboutasia.org/article/id/861/print/',
        extraSourceTitle: l('Earlier tea exchanges with Japan', '更早的日本茶交流', '更早的日本茶交流')
      },
      {
        id: 'london-ad', start: 1658, end: 1658, icon: 'notice',
        date: l('1658', '1658年', '1658年'),
        title: l('A London newspaper advertises tea', '倫敦報章刊登茶廣告', '伦敦报纸刊登茶广告'),
        hint: l('This is a seventeenth-century coffee-house story. Tea advertisements are older than the Boston Tea Party.', '這是十七世紀咖啡館的故事。茶廣告比波士頓傾茶事件更早出現。', '这是十七世纪咖啡馆的故事。茶广告比波士顿倾茶事件更早出现。'),
        story: l('A September 1658 advertisement in Mercurius Politicus promoted tea in London. Its health promises show how tea was marketed; an old advertisement is not medical evidence. This date marks an advert, not tea’s first arrival in Europe.', '1658年9月，《Mercurius Politicus》在倫敦刊登茶廣告。廣告的健康承諾反映當時的推銷方式，不能當作醫學證據。這個日期指的是一則廣告，不是茶首次抵達歐洲。', '1658年9月，《Mercurius Politicus》在伦敦刊登茶广告。广告的健康承诺反映当时的推销方式，不能当作医学证据。这个日期指的是一则广告，不是茶首次抵达欧洲。'),
        source: 'https://merl.reading.ac.uk/explore/online-exhibitions/tea-culture-in-our-collections/',
        sourceTitle: l('Museum of English Rural Life: Tea culture in our collections', '英國鄉村生活博物館：館藏中的茶文化', '英国乡村生活博物馆：馆藏中的茶文化')
      },
      {
        id: 'boston', start: 1773, end: 1773, icon: 'chest',
        date: l('16 December 1773', '1773年12月16日', '1773年12月16日'),
        title: l('Tea is destroyed in Boston Harbor', '波士頓港的茶被倒入海中', '波士顿港的茶被倒入海中'),
        hint: l('Think eighteenth-century disputes over British taxation in the American colonies.', '想想十八世紀美洲殖民地與英國之間的稅務爭議。', '想想十八世纪美洲殖民地与英国之间的税务争议。'),
        story: l('Protesters destroyed 342 chests of East India Company tea in Boston Harbor. The event became known as the Boston Tea Party. Tea was caught up in disputes over taxation, trade and political power, not just taste.', '抗議者把東印度公司的342箱茶倒入波士頓港，這件事後來被稱為波士頓傾茶事件。茶牽涉的是稅制、貿易與政治權力的爭議，不只是口味。', '抗议者把东印度公司的342箱茶倒入波士顿港，这件事后来被称为波士顿倾茶事件。茶牵涉的是税制、贸易与政治权力的争议，不只是口味。'),
        source: 'https://www.nps.gov/articles/000/boston-tea-party-in-real-time.htm',
        sourceTitle: l('U.S. National Park Service: Boston Tea Party Timeline', '美國國家公園管理局：波士頓傾茶事件時間線', '美国国家公园管理局：波士顿倾茶事件时间线')
      },
      {
        id: 'assam', start: 1839, end: 1839, icon: 'leaf',
        date: l('10 January 1839', '1839年1月10日', '1839年1月10日'),
        title: l('Assam tea is auctioned in London', '阿薩姆茶在倫敦拍賣', '阿萨姆茶在伦敦拍卖'),
        hint: l('Assam tea was already being made before Fortune’s mission. Singpho communities had their own tea knowledge.', '在福鈞出發前，阿薩姆已經製茶。景頗（Singpho）社群本來就有自己的茶知識。', '在福钧出发前，阿萨姆已经制茶。景颇（Singpho）社群本来就有自己的茶知识。'),
        story: l('Eight chests shipped from Assam in 1838 were auctioned in London in January 1839. Singpho communities already knew, made and drank local tea. This commercial milestone came before Fortune’s 1848 mission; neither event was the beginning of tea in India.', '1838年從阿薩姆運出的八箱茶，在1839年1月於倫敦拍賣。景頗社群早已認識、製作和飲用當地茶。這個商業里程碑比福鈞1848年的任務更早；兩者都不是印度茶的起點。', '1838年从阿萨姆运出的八箱茶，在1839年1月于伦敦拍卖。景颇社群早已认识、制作和饮用当地茶。这个商业里程碑比福钧1848年的任务更早；两者都不是印度茶的起点。'),
        source: 'https://www.kkhsou.ac.in/web/teaworld/page-details-part.php?page=9d34bb5c4a06966fcf6ceb4bf',
        sourceTitle: l('KKHSOU Tea World: Assam tea, Lesson 7', 'KKHSOU Tea World：阿薩姆茶，第七課', 'KKHSOU Tea World：阿萨姆茶，第七课')
      },
      {
        id: 'fortune', start: 1848, end: 1848, icon: 'plant',
        date: l('1848', '1848年', '1848年'),
        title: l('Fortune begins his tea mission to China', '福鈞展開赴華取茶任務', '福钧展开赴华取茶任务'),
        hint: l('By this nineteenth-century mission, tea from Assam had already reached a London auction.', '到這次十九世紀的任務展開時，阿薩姆茶早已在倫敦拍賣。', '到这次十九世纪的任务展开时，阿萨姆茶早已在伦敦拍卖。'),
        story: l('The East India Company sent Robert Fortune to China in 1848 to obtain plants and tea-making knowledge for British-run Indian plantations. The transfers unfolded over several years. They built on Chinese expertise and an existing Indian tea industry, rather than introducing tea to an empty landscape.', '東印度公司在1848年派福鈞到中國，為英國管理的印度茶園取得茶種、茶苗與製茶知識。轉移工作延續了數年，依靠中國技藝，也發生在印度已有茶業的背景下，並非把茶帶到一片原本沒有茶的土地。', '东印度公司在1848年派福钧到中国，为英国管理的印度茶园取得茶种、茶苗与制茶知识。转移工作延续了数年，依靠中国技艺，也发生在印度已有茶业的背景下，并非把茶带到一片原本没有茶的土地。'),
        source: 'https://www.kew.org/read-and-watch/the-history-of-tea-from-china-to-india',
        sourceTitle: l('Royal Botanic Gardens, Kew: From China to India', '英國皇家植物園邱園：從中國到印度', '英国皇家植物园邱园：从中国到印度')
      },
      {
        id: 'cutty-sark', start: 1869, end: 1869, icon: 'ship',
        date: l('22 November 1869', '1869年11月22日', '1869年11月22日'),
        title: l('The tea clipper Cutty Sark is launched', '運茶快帆船卡蒂薩克號下水', '运茶快帆船卡蒂萨克号下水'),
        hint: l('This fast sailing ship belongs to the later nineteenth century, after Fortune’s mission began.', '這艘快速帆船屬於十九世紀後期，比福鈞任務的開始更晚。', '这艘快速帆船属于十九世纪后期，比福钧任务的开始更晚。'),
        story: l('Cutty Sark was launched in Scotland in 1869, designed for the tea trade between China and Britain. Its first voyage followed in 1870. Launching a ship and carrying its first cargo are different events, so check which date a timeline names.', '卡蒂薩克號在1869年於蘇格蘭下水，設計用途是中國與英國之間的茶葉運輸。首航則在1870年。下水與首次載貨是不同事件，看時間線時要留意日期指的是哪一步。', '卡蒂萨克号在1869年于苏格兰下水，设计用途是中国与英国之间的茶叶运输。首航则在1870年。下水与首次载货是不同事件，看时间线时要留意日期指的是哪一步。'),
        source: 'https://nmmc.co.uk/2019/11/150-years-of-the-cutty-sark/',
        sourceTitle: l('National Maritime Museum Cornwall: 150 Years of Cutty Sark', '康沃爾國家海事博物館：卡蒂薩克號150年', '康沃尔国家海事博物馆：卡蒂萨克号150年')
      },
      {
        id: 'unesco', start: 2022, end: 2022, icon: 'hands',
        date: l('2022', '2022年', '2022年'),
        title: l('Chinese tea practices enter UNESCO’s heritage list', '中國茶技藝與習俗列入聯合國教科文組織非遺名錄', '中国茶技艺与习俗列入联合国教科文组织非遗名录'),
        hint: l('This is twenty-first-century recognition of much older living knowledge and social practices.', '這是二十一世紀對古老而仍在傳承的知識與生活習俗的認可。', '这是二十一世纪对古老而仍在传承的知识与生活习俗的认可。'),
        story: l('UNESCO inscribed traditional tea processing techniques and associated social practices in China in 2022. The recognition concerns skills and shared practices. It dates an inscription, not the birth of those traditions or a ranking of tea cultures.', '聯合國教科文組織在2022年把「中國傳統製茶技藝及其相關習俗」列入人類非物質文化遺產代表作名錄。認可的是技藝與共同實踐。這是列入名錄的年份，不是傳統誕生的年份，也不是茶文化排名。', '联合国教科文组织在2022年把“中国传统制茶技艺及其相关习俗”列入人类非物质文化遗产代表作名录。认可的是技艺与共同实践。这是列入名录的年份，不是传统诞生的年份，也不是茶文化排名。'),
        source: 'https://ich.unesco.org/en/RL/traditional-tea-processing-techniques-and-associated-social-practices-in-china-01884',
        sourceTitle: l('UNESCO: Traditional tea processing techniques and social practices', '聯合國教科文組織：傳統製茶技藝及相關習俗', '联合国教科文组织：传统制茶技艺及相关习俗')
      }
    ],
    // Only non-overlapping dates are compared. Each unordered pair appears once.
    pairs: [['lu-yu','eisai'], ['london-ad','lu-yu'], ['boston','london-ad'], ['eisai','boston'], ['assam','fortune'], ['fortune','boston'], ['cutty-sark','fortune'], ['assam','cutty-sark'], ['unesco','cutty-sark'], ['london-ad','unesco']],
    ui: {
      title: l('Tea Time Machine', '茶葉時光機', '茶叶时光机'),
      intro: l('Five stops, two buttons, one story at a time. Did the mystery event happen earlier or later than the dated card? No dates to memorise: use a hint or reveal the story whenever you like.', '五個站、兩個按鈕，每次認識一個故事。神秘事件比已標日期的卡片更早，還是更晚？不用背年份，隨時可以看提示或揭開故事。', '五个站、两个按钮，每次认识一个故事。神秘事件比已标日期的卡片更早，还是更晚？不用背年份，随时可以看提示或揭开故事。'),
      note: l('A few signposts, not a complete world history. Earlier does not mean “caused.” Dates are CE; approximate dates are marked. No score, timer or saved answers.', '這只是幾個路標，不是完整的世界茶史。先發生不等於造成後來的事。年份均為公元，約數會標明。不計分、不計時，也不儲存答案。', '这只是几个路标，不是完整的世界茶史。先发生不等于造成后来的事。年份均为公元，约数会标明。不计分、不计时，也不储存答案。'),
      start: l('Start a five-stop trip', '開始五站旅程', '开始五站旅程'),
      progress: l('Trip {trip} · Stop {n} of 5', '第{trip}段旅程 · 第{n}站，共5站', '第{trip}段旅程 · 第{n}站，共5站'),
      known: l('Your time anchor', '時間參考點', '时间参考点'),
      mystery: l('Place this event', '這件事在哪個時候？', '这件事在哪个时候？'),
      question: l('Did this event happen earlier or later than the time anchor?', '這件事比時間參考點更早，還是更晚？', '这件事比时间参考点更早，还是更晚？'),
      earlier: l('Earlier', '更早', '更早'),
      later: l('Later', '更晚', '更晚'),
      hint: l('Give me a hint', '給我一個提示', '给我一个提示'),
      reveal: l('Show me the story', '直接看故事', '直接看故事'),
      correct: l('Yes, that is the order.', '對，次序就是這樣。', '对，次序就是这样。'),
      rethink: l('A useful surprise. Here is the order.', '這個答案有點意外？一起看看次序。', '这个答案有点意外？一起看看次序。'),
      revealed: l('Let’s place it together.', '一起把它放進時間線。', '一起把它放进时间线。'),
      before: l('“{event}” happened earlier than “{anchor}”.', '「{event}」比「{anchor}」更早。', '“{event}”比“{anchor}”更早。'),
      after: l('“{event}” happened later than “{anchor}”.', '「{event}」比「{anchor}」更晚。', '“{event}”比“{anchor}”更晚。'),
      source: l('Read the source: ', '查看來源：', '查看来源：'),
      previous: l('Previous stop', '上一站', '上一站'),
      next: l('Next stop', '下一站', '下一站'),
      finish: l('See my timeline', '看看我的時間線', '看看我的时间线'),
      retry: l('Try this pair again', '再試這一組', '再试这一组'),
      summary: l('Your five-stop timeline', '你的五站時間線', '你的五站时间线'),
      summaryIntro: l('Here are the events from this trip, from earlier to later. The dates help place the stories; they do not explain everything that happened between them.', '這段旅程遇到的事件，已按先後排列。日期幫助定位故事，卻不能解釋兩件事之間發生的一切。', '这段旅程遇到的事件，已按先后排列。日期帮助定位故事，却不能解释两件事之间发生的一切。'),
      more: l('Take five different comparisons', '再玩五組不重複的比較', '再玩五组不重复的比较'),
      review: l('Revisit this trip', '重看這段旅程', '重看这段旅程'),
      done: l('You have explored all ten comparisons. Keep a story, not a score.', '十組比較都走過了。記住一個故事就好，不用記分數。', '十组比较都走过了。记住一个故事就好，不用记分数。'),
      restart: l('Shuffle a new journey', '重新打亂，開始新旅程', '重新打乱，开始新旅程'),
      clear: l('A new journey clears these answers. Reloading the page also starts fresh.', '新旅程會清除這次的答案；重新載入網頁也會重新開始。', '新旅程会清除这次的答案；重新载入网页也会重新开始。'),
      browse: l('Read all eight stories and sources', '閱讀全部八個故事與來源', '阅读全部八个故事与来源'),
      fallback: l('You can read the full timeline below even if the interactive game is unavailable.', '即使互動遊戲無法載入，你仍可閱讀下面的完整時間線。', '即使互动游戏无法载入，你仍可阅读下面的完整时间线。'),
      lesson: l('Continue into the trade story', '繼續閱讀茶葉貿易的故事', '继续阅读茶叶贸易的故事')
    }
  };
})();
