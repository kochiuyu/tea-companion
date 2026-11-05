#!/usr/bin/env node
'use strict';
/* Quarto render first, then: node reviews/test_decision_game_browser.cjs
   Requires Playwright and Chromium. CHROMIUM_EXECUTABLE can choose the browser.
   Serves the actual _site output with a read-only localhost HTTP server.
   Exercises all outcomes, revisit/retry/restart, keyboard and no-JS fallbacks.
   Reports JSON on stdout. SCREENSHOT_DIR optionally saves review PNGs. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '../_site');
const report = { passed: false, browserErrors: [], results: [], outcomes: 0 };
const locales = ['en', 'zh-hant-hk', 'zh-hans'];
const values = [{accept:[2,8],reject:[0,0]},{accept:[5,5],reject:[0,0]},{accept:[2,8],reject:[1,1]}];
const component = fs.readFileSync(path.resolve(__dirname, '../assets/tea-decision-game.js'), 'utf8');
let browser, server;
(async () => {
  assert(fs.existsSync(path.join(root, 'index.html')), 'Render the Quarto site first.');
  server = http.createServer((req, res) => {
    const name = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const file = path.resolve(root, '.' + name);
    if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404); res.end(); return; }
    res.setHeader('Content-Type', ({'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8'})[path.extname(file)] || 'application/octet-stream');
    fs.createReadStream(file).pipe(res);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}/`;
  const launch = { headless: true };
  if (process.env.CHROMIUM_EXECUTABLE) launch.executablePath = process.env.CHROMIUM_EXECUTABLE;
  browser = await chromium.launch(launch);
  for (const locale of locales) {
    const context = await browser.newContext({viewport:{width:1200,height:900}});
    const page = await context.newPage();
    page.on('pageerror', error => report.browserErrors.push({locale, error:error.message}));
    page.on('console', message => { if (message.type() === 'error') report.browserErrors.push({locale, error:message.text()}); });
    const url = base + (locale === 'en' ? '' : locale + '/') + 'modules/module-05/03-trust-games.html';
    await page.goto(url, { waitUntil:'networkidle' });
    const host = page.locator('[data-tea-decision]');
    const game = host.locator('.tea-decision-game');
    await game.waitFor();
    const stage = game.locator('.tea-decision-stage');
    const feedback = game.locator('.tea-decision-feedback');
    const action = name => game.locator(`[data-action="${name}"]`);
    const position = () => stage.getAttribute('data-round');
    assert.equal(await host.getAttribute('data-locale'),locale);
    assert.equal(await host.locator('input, select, textarea').count(),0, 'Tap-first, no forms');
    assert(await action('previous').isDisabled());
    assert(await action('next').isDisabled());
    assert(await feedback.isHidden());
    assert(await action('retry').isHidden());
    assert.equal(await game.locator('.tea-decision-options [aria-pressed="true"]').count(),0);
    assert.equal(await game.locator('.tea-decision-options').getAttribute('aria-labelledby'), await game.locator('h4').getAttribute('id'));
    for (let round = 0; round < 3; round++) {
      assert.equal(await position(), String(round));
      assert(await action('next').isDisabled());
      await action('next').evaluate(el => el.click());
      assert.equal(await position(),String(round),'Unanswered round cannot advance');
      for (const choice of ['accept','reject','unsure']) {
        await action(choice).focus();
        await page.keyboard.press(choice === 'reject' ? 'Space' : 'Enter');
        assert(await action(choice).evaluate(el => el === document.activeElement),'Choice retains focus');
        assert.equal(await game.locator('[aria-pressed="true"]').count(),1);
        assert.equal(await action(choice).getAttribute('aria-pressed'),'true');
        assert(await feedback.isVisible());
        assert(await action('next').isEnabled());
        assert.equal(await feedback.locator('.tea-decision-rules dt').count(),4);
        assert.equal(await feedback.locator('ul li').count(),2,'Both counterfactuals visible');
        const result = feedback.locator('.tea-decision-result');
        if (choice === 'unsure') assert.equal(await result.getAttribute('data-you'),null);
        else {
          assert.equal(await result.getAttribute('data-you'),String(values[round][choice][0]));
          assert.equal(await result.getAttribute('data-other'),String(values[round][choice][1]));
        }
        assert((await game.locator('[role="status"]').textContent()).length > 15);
        const link = feedback.locator('a');
        assert.equal(await link.getAttribute('href'),'#decision-game-notes');
        assert.equal(await page.locator('#decision-game-notes').count(),1);
        report.outcomes++;
      }
      const original = await feedback.textContent();
      if (round) {
        await action('previous').click();
        assert.equal(await position(),String(round-1));
        assert.equal(await action('unsure').getAttribute('aria-pressed'),'true');
        await action('next').click();
        assert.equal(await position(),String(round));
        assert.equal(await feedback.textContent(),original,'Back/next retains each choice');
      }
      await action('retry').click();
      assert.equal(await game.locator('[aria-pressed="true"]').count(),0);
      assert(await feedback.isHidden()); assert(await action('next').isDisabled());
      assert.equal(await game.locator('[role="status"]').textContent(),'');
      assert(await action('accept').evaluate(el => el === document.activeElement));
      await action('unsure').click();
      if (round === 0) {
        const mounted = await game.elementHandle();
        await page.addScriptTag({content:component});
        assert(await mounted.evaluate(el => el.isConnected),'Re-running enhancement preserves mount');
        assert.equal(await host.locator('.tea-decision-game').count(),1);
        assert.equal(await action('unsure').getAttribute('aria-pressed'),'true');
        for (const width of [320,390,768]) {
          await page.setViewportSize({width,height:900});
          assert(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1),`${locale}: no overflow at ${width}px`);
          assert(await game.locator('button:visible').evaluateAll(nodes => nodes.every(n => n.getBoundingClientRect().height >= 44)),'Tap targets at least 44px');
        }
        if (process.env.SCREENSHOT_DIR) {
          fs.mkdirSync(process.env.SCREENSHOT_DIR, {recursive:true});
          await page.setViewportSize({width:390,height:900});
          await game.screenshot({path:path.join(process.env.SCREENSHOT_DIR,`decision-${locale}-mobile.png`)});
        }
        await page.emulateMedia({forcedColors:'active'});
        assert(await action('unsure').isVisible());
        assert.equal(await action('unsure').evaluate(el => getComputedStyle(el).outlineStyle),'solid');
        await page.emulateMedia({forcedColors:'none'});
      }
      // Repeated click on the old control cannot skip a new unanswered decision.
      await action('next').evaluate(el => { el.click(); el.click(); });
      assert(await stage.locator('h3').evaluate(el => el === document.activeElement),'New screen gets heading focus');
    }
    assert.equal(await stage.getAttribute('data-mode'),'summary');
    assert.equal(await game.locator('.tea-decision-summary > li').count(),3);
    assert.equal(await game.locator('.tea-decision-summary [data-you]').count(),0);
    await action('restart').evaluate(el => { el.click(); el.click(); });
    assert.equal(await stage.getAttribute('data-mode'),'play');
    assert.equal(await position(),'0');
    assert(await feedback.isHidden()); assert(await action('next').isDisabled());
    assert(await action('previous').isDisabled());
    // Mixed choices in a second completed run, then verify reload really resets.
    for (const choice of ['accept','reject','unsure']) { await action(choice).click(); await action('next').click(); }
    assert.equal(await stage.getAttribute('data-mode'),'summary');
    const summary = await game.locator('.tea-decision-summary').textContent();
    assert(summary.includes(locale === 'en' ? 'you get 2' : '你得到 2'));
    assert(summary.includes(locale === 'en' ? 'you get 0' : '你得到 0'));
    await page.reload({waitUntil:'networkidle'});
    assert.equal(await stage.getAttribute('data-mode'),'play');
    assert.equal(await position(),'0');
    assert(await feedback.isHidden());
    assert.deepEqual(await page.evaluate(() => [localStorage.length,sessionStorage.length]),[0,0]);
    const ids = await page.locator('[id]').evaluateAll(nodes => nodes.map(n => n.id));
    assert.equal(new Set(ids).size,ids.length,'No duplicate IDs');
    report.results.push(`${locale}: 9 possible outcomes, keyboard, retry/revisit, mixed summary, restart/reload, repeated-click safety, 320/390/768px, 44px targets, forced colors`);
    await context.close();
    const noJS = await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:800}});
    const staticPage = await noJS.newPage();
    await staticPage.goto(url,{waitUntil:'networkidle'});
    assert.equal(await staticPage.locator('[data-tea-decision] ol > li').count(),3,'No-JS retains all three examples');
    assert.equal(await staticPage.locator('#decision-game-notes').count(),1);
    assert.equal(await staticPage.locator('#fn1').count(),1,'Citation target exists');
    assert(await staticPage.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1));
    report.results.push(`${locale}: no-JavaScript complete three-example fallback and source link`);
    await noJS.close();
  }
  assert.deepEqual(report.browserErrors,[]);
  report.passed = true;
})().catch(error => {report.error=error.stack;process.exitCode=1;}).finally(async () => {
  if (browser) await browser.close();
  if (server) await new Promise(resolve => server.close(resolve));
  console.log(JSON.stringify(report,null,2));
});
