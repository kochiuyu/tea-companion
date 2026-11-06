'use strict';
// Real Chromium coverage of neutral scenario artwork, independent of Quarto.
const { chromium } = require('playwright');
const fs = require('node:fs');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({headless:true, executablePath:process.env.CHROMIUM_EXECUTABLE || '/usr/bin/chromium'});
  try {
    for (const locale of ['en','zh-hant-hk','zh-hans']) {
      const page = await browser.newPage({viewport:{width:320,height:900}});
      const errors = []; page.on('pageerror', e => errors.push(e.message));
      await page.setContent(`<style>body{margin:8px}${fs.readFileSync('assets/tea-label-detective.css','utf8')}${fs.readFileSync('assets/tea-game-figures.css','utf8')}</style><div data-tea-detective data-locale="${locale}"><p>Readable fallback</p></div>`);
      await page.addScriptTag({path:'assets/tea-game-figures.js'});
      await page.addScriptTag({path:'assets/tea-label-detective.js'});
      const arts = new Set();
      for (let index=0;index<15;index++) {
        await page.locator('.tea-lab-detective-picker summary').click();
        const button = page.locator(`button[data-label-index="${index}"]`);
        await button.focus(); await page.keyboard.press('Enter');
        const svg = page.locator('svg.tea-game-art');
        assert.equal(await svg.getAttribute('data-label-art'),String(index));
        assert.equal(await svg.getAttribute('aria-hidden'),'true');
        assert.equal(await svg.getAttribute('focusable'),'false');
        assert.equal(await svg.locator('text,image,a,foreignObject').count(),0);
        const drawing = await svg.innerHTML(); arts.add(drawing);
        await page.locator('.tea-lab-detective-clues button').last().click();
        assert.equal(await svg.innerHTML(),drawing,'Same scenario remains stable across clues');
        await page.locator('[data-action="reveal"]').click();
        await page.locator('[data-action="retry"]').click();
        assert.equal(await svg.innerHTML(),drawing,'No answer-dependent artwork');
        assert(await page.locator('.tea-lab-detective-categories button').first().evaluate(e=>e===document.activeElement));
        assert(await page.locator('.tea-lab-detective').evaluate(e=>e.scrollWidth<=e.clientWidth+1));
      }
      assert.equal(arts.size,15,'Every scenario has a distinct drawing');
      for(const width of [390,1200]) {
        await page.setViewportSize({width,height:900});
        assert(await page.locator('.tea-lab-detective').evaluate(e=>e.scrollWidth<=e.clientWidth+1));
      }
      assert.deepEqual(errors,[]);
      console.log(`${locale}: 15 distinct stable illustrations; keyboard selection/retry, SVG a11y, responsive layout PASS`);
      await page.close();
    }
    const page = await browser.newPage();
    await page.setContent('<style>body{background:#f8f8f1;font:16px sans-serif}main{display:grid;grid-template-columns:repeat(5,240px);gap:12px}figure{margin:0}figcaption{text-align:center}</style><main></main>');
    await page.addScriptTag({path:'assets/tea-game-figures.js'});
    await page.evaluate(()=>{for(let i=0;i<15;i++){const f=TeaGameFigures.figure('label','en',i);f.querySelector('figcaption').textContent=String(i+1).padStart(2,'0');document.querySelector('main').append(f)}});
    await page.setViewportSize({width:1280,height:540});
    if(process.env.SCREENSHOT_PATH) await page.screenshot({path:process.env.SCREENSHOT_PATH});
    await page.close();
  } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exitCode=1});
