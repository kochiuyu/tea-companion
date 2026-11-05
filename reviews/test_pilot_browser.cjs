#!/usr/bin/env node
'use strict';
/* Reproducible browser regression, separate from the preservation checker.
 * Prerequisites: Node >=18, npm package playwright and its Chromium browser.
 * Render first: quarto render
 * Run: node reviews/test_pilot_browser.cjs
 * Optional: BASE_URL=http://127.0.0.1:8000/ CHROMIUM_EXECUTABLE=/path/to/chromium
 * With no BASE_URL, a read-only builtin HTTP server serves ../_site on localhost.
 * Tests use actual rendered HTML/assets, not mocked implementation functions.
 * All 17 label clues and alternatives, retention/retry, and the ten-round, two-set game
 * cover correct/wrong/unsure guesses, keyboard focus, beginner clues, sources,
 * previous/restart, narrow layouts and no-JavaScript fallbacks.
 * JSON goes to stdout; historical reports and generated site remain untouched.
 * This script was syntax-checked in the restricted executor, not launched there.
 */
const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '../_site');
const locales = ['en', 'zh-hant-hk', 'zh-hans'];
const fits = ['That reading fits this label.', '這個理解適合這張標籤。', '这个理解适合这张标签。'];
const report = { passed: false, method: 'Actual rendered site in Chromium', results: [], errors: [], browserErrors: [], timerMethods: {} };
let server, browser;

async function serve() {
  assert(fs.existsSync(path.join(root, 'index.html')), 'Run quarto render before the browser suite');
  server = http.createServer((req, res) => {
    try {
      const name = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      let file = path.resolve(root, '.' + name);
      if (file !== root && !file.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return; }
      if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
      if (!fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404); res.end(); return; }
      const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2' };
      res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' });
      fs.createReadStream(file).pipe(res);
    } catch { res.writeHead(400); res.end(); }
  });
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
  return `http://127.0.0.1:${server.address().port}/`;
}
function observe(page, scope) {
  const add = (message, source = '') => {
    if (/^(chrome|moz)-extension:\/\//.test(source)) return;
    report.browserErrors.push({ scope, message, source });
  };
  page.on('pageerror', error => add(error.message, error.stack || ''));
  page.on('console', message => { if (message.type() === 'error') add(message.text(), message.location().url); });
}
async function responsive(page, scope) {
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 });
    const size = await page.evaluate(() => ({ width: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }));
    assert(size.scroll <= size.width + 1, `${scope}: overflow at ${width}px (${size.scroll})`);
  }
  report.results.push(`${scope}: 320/390px no horizontal overflow`);
}
async function detective(page, url, localeIndex) {
  const locale = locales[localeIndex];
  const component = fs.readFileSync(path.resolve(__dirname, '../assets/tea-label-detective.js'), 'utf8');
  const fixtureContext = {};
  require('node:vm').runInNewContext(component.slice(0,component.indexOf('  let instance = 0;')) + 'globalThis.fixture=JSON.stringify({labels,guides});})();', fixtureContext);
  const {labels,guides}=JSON.parse(fixtureContext.fixture);
  const accepted=labels.map(label=>label.clues.map(clue=>clue.answers));
  const featured=[1,2,0,0,0,2,1,...Array(8).fill(0)];
  assert.equal(labels.length,15);
  const rethink = ['Here is a more useful reading of this label.','這張標籤可以這樣理解。','这张标签可以这样理解。'][localeIndex];
  const neutral = ['Let’s read this word together.','一起看看這個詞。','一起看看这个词。'][localeIndex];
  await page.goto(url, { waitUntil: 'networkidle' });
  const host = page.locator('[data-tea-detective]');
  await host.locator('.tea-lab-detective').waitFor();
  assert.equal(await host.getAttribute('data-locale'), locale);
  const picker = host.locator('.tea-lab-detective-picker');
  const packet = async index => {
    if (!await picker.evaluate(el => el.open)) await picker.locator('summary').click();
    await picker.locator(`[data-label-index="${index}"]`).click();
    assert.equal(await picker.evaluate(el => el.open), false, 'Label picker closes after choosing');
  };
  const clue = index => host.locator('.tea-lab-detective-clues button').nth(index).click();
  const answers = host.locator('.tea-lab-detective-categories button');
  const answer = value => host.locator(`.tea-lab-detective-categories [data-category="${value}"]`);
  const selected = host.locator('.tea-lab-detective-categories [aria-pressed="true"]');
  const action = value => host.locator(`[data-action="${value}"]`);
  const feedback = host.locator('.tea-lab-detective-feedback');
  const title = feedback.locator('h5');
  const retry = async () => {
    await action('retry').click();
    assert.equal(await selected.count(), 0); assert.equal(await feedback.textContent(), '');
    assert(await answers.first().evaluate(el => document.activeElement === el), 'Retry focuses first choice');
    assert(await action('retry').isHidden()); assert(await action('reveal').isVisible());
    assert.equal(await host.locator('.tea-lab-detective-status').textContent(), '');
  };
  assert.equal(await host.locator('select, input, textarea').count(), 0, 'No typing or dropdowns');
  assert.equal(await picker.evaluate(el => el.open), false);
  assert.equal(await host.locator('.tea-lab-detective-about').evaluate(el => el.open), false);
  assert.equal(await picker.locator('[data-label-index]').count(), labels.length);
  const panel=host.locator('.tea-lab-detective-panel');
  const position=()=>panel.evaluate(el=>[Number(el.dataset.labelIndex),Number(el.dataset.clueIndex)]);
  const initial=await position();
  assert.equal(await panel.getAttribute('data-mode'),'round');
  assert.equal(initial[1],featured[initial[0]]);
  assert(await action('round-next').isDisabled());
  assert(await action('round-prev').isDisabled());
  await action('explore-label').click();assert.deepEqual(await position(),initial);
  await action('return-round').click();assert.deepEqual(await position(),initial);
  assert.equal(await selected.count(), 0); assert.equal(await feedback.textContent(), '');
  assert(await action('retry').isHidden());
  await action('reveal').click();
  const originalRoundFeedback=await feedback.textContent();
  let count = 0, reveals = 0;
  for (let p = 0; p < accepted.length; p++) {
    await packet(p);
    assert.equal(await panel.getAttribute('data-mode'),'explore');
    assert.equal(await host.locator('.tea-lab-detective-clues button').count(), accepted[p].length);
    for (let c = 0; c < accepted[p].length; c++) {
      await clue(c);
      assert(await host.locator('h4').evaluate(el => document.activeElement === el));
      assert.equal(await answers.count(), 3);
      assert.deepEqual(await answers.evaluateAll(nodes => nodes.map(n => n.dataset.category)), guides[p][c].choices);
      for (const value of [accepted[p][c]].flat()) assert.equal(await answer(value).count(), 1, 'Accepted alternatives remain available');
      const question = host.locator('h4'), hint = host.locator('.tea-lab-detective-hint'), group = host.locator('.tea-lab-detective-classification');
      assert.equal(await group.getAttribute('aria-labelledby'), await question.getAttribute('id'));
      assert.equal(await group.getAttribute('aria-describedby'), await hint.getAttribute('id'));
      assert((await hint.textContent()).includes(guides[p][c].hint[locale]));
      assert.deepEqual(await position(),[p,c]);
      for (const value of guides[p][c].choices) {
        await answer(value).focus(); await page.keyboard.press('Enter');
        assert(await answer(value).evaluate(el => document.activeElement === el), 'Answer retains focus');
        assert.equal(await title.textContent(), [accepted[p][c]].flat().includes(value) ? fits[localeIndex] : rethink);
        assert.equal(await selected.count(), 1); assert.equal(await selected.getAttribute('data-category'), value);
        assert.equal(await feedback.locator('p').count(), 4, 'Meaning, rationale, limit and source');
        const link = feedback.locator('a'); assert.equal(await link.count(), 1);
        assert.equal(await link.getAttribute('href'), guides[p][c].source);
        assert.equal(await page.locator(guides[p][c].source).count(), 1, 'Specific source exists in rendered locale');
        assert(await action('retry').isVisible()); assert(await action('reveal').isHidden());
        count++;
      }
      await retry(); await action('reveal').click();
      assert.equal(await title.textContent(), neutral); assert.equal(await selected.count(), 0, 'Unsure is not a classification');
      assert(await title.evaluate(el => document.activeElement === el), 'Reveal focuses neutral explanation');
      assert((await host.locator('.tea-lab-detective-status').textContent()).startsWith(neutral));
      const revealed = await feedback.textContent();
      await clue((c+1)%accepted[p].length); await clue(c);
      assert.equal(await feedback.textContent(), revealed);
      await packet((p+1)%labels.length); await packet(p);
      assert.equal(await feedback.textContent(), revealed); assert.equal(await selected.count(), 0);
      await retry(); await packet((p+1)%labels.length); await packet(p);
      assert.equal(await feedback.textContent(), '');
      reveals++;
    }
  }
  assert.equal(count, 99); assert.equal(reveals, 33);
  await packet(0); await clue(0); await answer('origin').click();
  await clue(1); await action('reveal').click(); await retry();
  await clue(0); assert.equal(await selected.getAttribute('data-category'), 'origin', 'Retry clears only current clue');
  await packet(1); await packet(0); assert.equal(await selected.getAttribute('data-category'), 'origin');
  await retry();
  assert.equal(await action('explore-prev').textContent(), ['← Last label','← 最後一張標籤','← 最后一张标签'][localeIndex]);
  await action('explore-prev').click();
  assert.deepEqual(await position(),[14,labels[14].clues.length-1]);
  assert.equal(await action('explore-next').textContent(), ['Back to the first label →','返回第一張標籤 →','返回第一张标签 →'][localeIndex]);
  await action('explore-next').click();
  assert.deepEqual(await position(),[0,0]);
  // Running enhancement twice must preserve the same mounted nodes and state.
  await answer('origin').click();
  const mounted = await host.locator('.tea-lab-detective').elementHandle();
  await page.addScriptTag({content: component});
  assert(await mounted.evaluate(el => el.isConnected)); assert.equal(await selected.getAttribute('data-category'), 'origin');
  await action('return-round').click();
  assert.deepEqual(await position(),initial);
  assert.equal(await feedback.textContent(),originalRoundFeedback,'Explore does not change round answers');
  const seen=[];
  for(let batch=0;batch<3;batch++){
    const currentBatch=[];
    for(let i=0;i<5;i++){
      assert.equal(await panel.getAttribute('data-mode'),'round');
      const current=await position();
      assert(!seen.includes(current[0]),'No label repeats until pool exhausted');
      assert.equal(current[1],featured[current[0]]);seen.push(current[0]);currentBatch.push(current[0]);
      if(batch||i){
        assert(await action('round-next').isDisabled());
        await action('round-next').evaluate(el=>el.click());
        assert.deepEqual(await position(),current,'Cannot skip unanswered label');
      }
      if(i){
        await action('round-prev').evaluate(el=>{el.click();el.click();});assert.equal((await position())[0],currentBatch[i-1]);
        assert(await action('round-next').isEnabled());await action('round-next').click();assert.deepEqual(await position(),current);
      }
      if(!batch&&!i) await retry();
      if(i%2) {await answers.first().focus();await page.keyboard.press('Enter');}
      else await action('reveal').click();
      assert(await action('round-next').isEnabled());
      const saved=await feedback.textContent();
      await packet(current[0]);await action('return-round').click();
      assert.deepEqual(await position(),current);assert.equal(await feedback.textContent(),saved);
      await action('round-next').evaluate(el=>{el.click();el.click();});
    }
    assert.equal(await panel.getAttribute('data-mode'),'summary');
    const summary=host.locator('.tea-lab-detective-summary');assert.equal(await summary.locator('li').count(),5);
    for(const p of currentBatch) assert((await summary.textContent()).includes(labels[p].clues[featured[p]].why[locale]));
    assert.equal(await action('round-next').count(),0);
    assert.equal(await action('more').count(),batch<2?1:0);assert.equal(await action('reshuffle').count(),batch===2?1:0);
    await responsive(page, `${locale} detective summary ${batch+1}`);
    await packet(0);await action('return-round').click();assert.equal(await panel.getAttribute('data-mode'),'summary');
    await action('review-round').click();await action('explore-label').click();await action('return-round').click();
    assert.equal(await panel.getAttribute('data-mode'),'round');
    for(const p of currentBatch){assert.equal((await position())[0],p);assert(await action('round-next').isEnabled());await action('round-next').click();}
    assert.equal(await panel.getAttribute('data-mode'),'summary');
    if(batch<2) await action('more').evaluate(el=>{el.click();el.click();});
  }
  assert.equal(new Set(seen).size,15);
  await action('reshuffle').evaluate(el=>{el.click();el.click();});assert.equal(await panel.getAttribute('data-mode'),'round');
  assert(await action('round-next').isDisabled());assert.equal(await feedback.textContent(),'');
  await responsive(page, `${locale} detective`);
  report.results.push(`${locale}: 99 choice cases, 33 reveals, original alternatives, sources, focus, independent explore retention, full 15-label random cycle, three summaries and explicit reshuffle`);
}
async function cups(page, url, locale) {
  await page.goto(url, { waitUntil: 'networkidle' });
  const host = page.locator('[data-tea-compare]');
  await host.locator('.tea-compare').waitFor();
  assert.equal(await host.getAttribute('data-locale'), locale);
  const action = name => host.locator(`[data-action="${name}"]`);
  const cards = host.locator('.tea-compare-option');
  const feedback = host.locator('.tea-compare-feedback');
  const gameSource = fs.readFileSync(path.resolve(__dirname, '../assets/tea-compare.js'), 'utf8');
  const rounds = JSON.parse(gameSource.match(/const rounds = (\[[\s\S]*?\n\]);/)[1]);
  assert.equal(rounds.length, 10);
  const correct = rounds.map(round => round.correctIndex);
  async function summary(checkpoint) {
    const panel=host.locator('.tea-compare-summary');
    assert.equal(await panel.getAttribute('data-set-summary'),checkpoint?'1':'2');
    assert.equal(await panel.locator('li').count(),checkpoint?5:10);
    assert.equal(await cards.count(),0,'Summary remains a stopping point');
    assert.equal(await action('next').count(),0,'No forced next from summary');
    assert.equal(await action('continue').count(),checkpoint?1:0);
    assert.equal(await action('restart').count(),1);
    assert(await panel.locator('h4').evaluate(el=>el===document.activeElement));
    const text=await panel.textContent();
    for(const round of rounds.slice(0,checkpoint?5:10)) assert(text.includes(round[locale].takeaway));
    await responsive(page, `${locale} comparison ${checkpoint?'checkpoint':'final summary'}`);
  }
  async function verifyReset() {
    await action('restart').click();
    for(let round=0;round<10;round++) {
      assert.equal(await host.locator('.tea-compare-question').textContent(),rounds[round][locale].question);
      assert(await host.locator('.tea-compare-question').evaluate(el=>el===document.activeElement));
      assert(await action('next').isDisabled(),'Restart clears all ten answers');
      assert.equal(await feedback.textContent(),'');
      assert.equal(await host.locator('.tea-compare-option[data-result="correct"]').count(),0);
      await action('reveal').click(); await action('next').click();
      if(round===4) { await summary(true); await action('continue').click(); }
    }
    await summary(false);
  }
  assert.equal(await host.locator('input, textarea, select').count(), 0, 'No typing or setup controls');
  for (const mode of ['correct', 'wrong', 'unsure']) {
    const retained = [];
    for (let round = 0; round < 10; round++) {
      assert.equal(await cards.count(), 2, 'Two teas in each comparison');
      assert((await host.locator('.tea-compare-question').textContent()).trim().length > 5);
      const clue=host.locator('.tea-compare-clue');
      assert((await clue.textContent()).trim().length>15);
      for(const name of rounds[round][locale].options) assert(!(await clue.textContent()).toLowerCase().includes(name.toLowerCase()),'Clue does not name either option');
      assert.equal(await host.locator('.tea-compare-pair').getAttribute('aria-describedby'),await clue.getAttribute('id'));
      assert.doesNotMatch(await host.locator('.tea-compare-progress,.tea-compare-question,.tea-compare-clue').allTextContents().then(x=>x.join(' ')),/oxid|ferment|enzym|Camellia|microb|氧化|發酵|发酵|酶|窨/iu);
      assert(await action('next').isDisabled(), 'Next requires an answer');
      assert.equal(await feedback.textContent(), '');
      const questionBefore=await host.locator('.tea-compare-question').textContent();
      if (mode === 'unsure') {
        await action('reveal').click();
        assert(await feedback.locator('h5').evaluate(el=>el===document.activeElement),'Not sure focuses answer');
      }
      else {
        const guess = mode === 'correct' ? correct[round] : 1 - correct[round];
        await cards.nth(guess).focus(); await page.keyboard.press('Enter');
        assert(await cards.nth(guess).evaluate(el => document.activeElement === el), 'Answer retains keyboard focus');
      }
      assert.equal(await host.locator('.tea-compare-question').textContent(),questionBefore,'Answer does not automatically advance');
      assert.equal(await host.locator('.tea-compare-option[data-result="correct"]').getAttribute('data-answer'), String(correct[round]));
      assert.equal(await host.locator('.tea-compare-option[aria-pressed="true"]').count(), mode === 'unsure' ? 0 : 1);
      assert.equal(await host.locator('.tea-compare-option[data-result="incorrect"]').count(), mode === 'wrong' ? 1 : 0);
      assert.equal(await feedback.locator('h5').count(), 1);
      assert.equal(await feedback.locator('p').count(), 4, 'Explanation, takeaway, caveat and sources');
      assert(await action('next').isEnabled());
      const answer = await feedback.textContent(); retained.push(answer);
      // Force DOM click because aria-disabled cards deliberately guard repeats.
      await cards.evaluateAll(nodes => nodes.forEach(n => n.click()));
      assert.equal(await feedback.textContent(), answer, 'Repeated guesses ignored');
      for (const link of await feedback.locator('a').all()) {
        const href = await link.evaluate(el => el.href);
        const expected = new URL(locale === 'en' ? '/' : `/${locale}/`, url);
        assert(new URL(href).pathname.startsWith(expected.pathname), 'Source preserves locale');
        const response = await page.request.get(href); assert(response.ok(), `Source exists: ${href}`);
      }
      if (round > 0) {
        await action('previous').click();
        if(round===5) { await summary(true); await action('continue').click(); }
        else { assert.equal(await feedback.textContent(), retained[round - 1]); await action('next').click(); }
        assert.equal(await feedback.textContent(), answer);
        assert(await host.locator('.tea-compare-question').evaluate(el => el === document.activeElement), 'Navigation focuses question');
      }
      await responsive(page, `${locale} comparison ${mode} round ${round + 1}`);
      await action('next').click();
      if(round===4) { await summary(true); await action('continue').click(); }
    }
    await summary(false);
    await verifyReset();
    await action('restart').click();
  }
  // Populate every answer before checking that checkpoint restart clears both sets.
  for(let round=0;round<10;round++) {
    await action('reveal').click();
    if(round<9) await action('next').click();
    if(round===4) await action('continue').click();
  }
  for(let round=9;round>=5;round--) await action('previous').click();
  await summary(true); await verifyReset();
  report.results.push(`${locale}: ten pairs × correct/wrong/unsure, keyboard, repeated guesses, retained navigation, source links, optional five-clue checkpoint, ten final takeaways, both restart paths clearing all answers and no text inputs`);
}
async function fallback(context, base, prefix, locale) {
  const page = await context.newPage(); observe(page, `${locale} no-JS`);
  for (const [file, selector, anchor] of [['tea-labels.html', '[data-tea-detective]', '#type-map'], ['modules/module-01/03-brewing.html', '[data-tea-compare]', '#two-cup-lab']]) {
    await page.goto(new URL(prefix + file, base).href);
    assert((await page.locator(selector).innerText()).trim().length > 25, 'Readable no-JS instructions');
    assert.equal(await page.locator(`${selector} button`).count(), 0);
    assert.equal(await page.locator(anchor).count(), 1, 'Original lesson remains reachable');
    await responsive(page, `${locale} no-JS ${file}`);
  }
  await page.close(); report.results.push(`${locale}: both no-JS fallbacks remain readable`);
}
(async () => {
  try {
    const base = process.env.BASE_URL ? process.env.BASE_URL.replace(/\/?$/, '/') : await serve();
    browser = await chromium.launch({ headless: true, ...(process.env.CHROMIUM_EXECUTABLE ? { executablePath: process.env.CHROMIUM_EXECUTABLE } : {}) });
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, acceptDownloads: true });
    const noJS = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
    for (let i = 0; i < locales.length; i++) {
      const locale = locales[i], prefix = locale === 'en' ? '' : locale + '/';
      const labelPage = await context.newPage(); observe(labelPage, `${locale} detective`);
      await labelPage.goto(new URL(prefix + 'index.html', base).href, { waitUntil: 'networkidle' });
      for (const target of ['modules/module-01/03-brewing.html#two-cup-lab', 'tea-labels.html#label-detective']) {
        const link = labelPage.locator(`.tea-pilot-link a[href$="${target}"]`);
        assert.equal(await link.count(), 1, 'Homepage launch link');
        assert.equal(await link.evaluate(el => el.href), new URL(prefix + target, base).href, 'Launch preserves locale');
      }
      await responsive(labelPage, `${locale} homepage`);
      await detective(labelPage, new URL(prefix + 'tea-labels.html', base).href, i); await labelPage.close();
      const cupPage = await context.newPage(); observe(cupPage, `${locale} cups`);
      await cups(cupPage, new URL(prefix + 'modules/module-01/03-brewing.html', base).href, locale); await cupPage.close();
      await fallback(noJS, base, prefix, locale);
    }
    assert.equal(report.browserErrors.length, 0, JSON.stringify(report.browserErrors));
    report.passed = true;
  } catch (error) {
    report.errors.push({ message: error.message, stack: error.stack });
  } finally {
    if (browser) await browser.close();
    if (server) await new Promise(resolve => server.close(resolve));
    console.log(JSON.stringify(report, null, 2));
    process.exitCode = report.passed ? 0 : 1;
  }
})();
