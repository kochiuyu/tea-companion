'use strict';
// Actual Chromium: render first, or FIGURE_PREVIEW=1 for the standalone preview.
// Requires Playwright; CHROMIUM_EXECUTABLE may select an installed browser.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright');
const preview=process.env.FIGURE_PREVIEW==='1';
const root=path.resolve(__dirname,preview?'..':'../_site');
const report={passed:false,preview,locales:[],errors:[]};
let server,browser;
(async()=>{
 server=http.createServer((req,res)=>{
  const file=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);
  if(!file.startsWith(root+path.sep)||!fs.existsSync(file)){res.writeHead(404);res.end();return;}
  res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8'})[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res);
 });
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const base=`http://127.0.0.1:${server.address().port}/`;
 browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_EXECUTABLE?{executablePath:process.env.CHROMIUM_EXECUTABLE}:{})});
 for(const lang of ['en','zh-hant-hk','zh-hans']){
  const page=await browser.newPage({viewport:{width:390,height:844}});
  page.on('pageerror',e=>report.errors.push(`${lang}: ${e.message}`));
  const visit=async route=>page.goto(base+(preview?'reviews/game-figures-preview.html?lang='+lang:(lang==='en'?'':lang+'/')+route));
  const checkLayout=async host=>{
   for(const width of [320,390,1200]){
    await page.setViewportSize({width,height:900});
    assert(await host.evaluate(e=>e.scrollWidth<=e.clientWidth+2),'No game overflow at '+width);
    const arts=host.locator('svg.tea-game-art');
    for(let i=0;i<await arts.count();i++){
     const a=arts.nth(i); if(!await a.isVisible())continue;
     assert.equal(await a.getAttribute('aria-hidden'),'true');assert.equal(await a.getAttribute('focusable'),'false');
     const box=await a.boundingBox();assert(box.width>0&&box.x>=0&&box.x+box.width<=width+1);
    }
   }
  };
  await visit('modules/module-03/01-trade-history.html');
  let host=page.locator('[data-tea-time-machine]');await host.locator('[data-action="start"]').click();
  const events=await page.evaluate(()=>window.TeaTimeMachineData.events);
  const seen=new Set();
  for(let trip=0;trip<2;trip++){
   for(let stop=0;stop<5;stop++){
    assert.equal(await host.locator('.tea-time-card svg').count(),2);
    const panel=host.locator('.tea-time-panel');
    const index=Number(await panel.getAttribute('data-pair-index'));
    const pair=await page.evaluate(i=>window.TeaTimeMachineData.pairs[i],index);
    seen.add(pair[0]);seen.add(pair[1]);
    assert.equal(await host.locator('.tea-time-mystery .tea-time-date').textContent(),'?');
    assert(!/\d/.test(await host.locator('.tea-time-mystery .tea-game-figure').textContent()),'Art must not disclose dates');
    if(stop===0&&trip===0){
     await checkLayout(host);
     if(process.env.SCREENSHOT_DIR){fs.mkdirSync(process.env.SCREENSHOT_DIR,{recursive:true});await host.screenshot({path:path.join(process.env.SCREENSHOT_DIR,`time-${lang}.png`)});}
    }
    const answer=host.locator('[data-answer="earlier"]');await answer.focus();await page.keyboard.press('Enter');
    assert.notEqual(await host.locator('.tea-time-mystery .tea-time-date').textContent(),'?');
    await host.locator('[data-action="retry"]').click();assert.equal(await host.locator('.tea-time-mystery .tea-time-date').textContent(),'?');
    await host.locator('[data-action="reveal"]').click();await host.locator('[data-action="next"]').click();
   }
   assert(await host.locator('.tea-time-panel .tea-time-timeline svg').count()>0);
   if(trip===0)await host.locator('[data-action="more"]').click();
  }
  assert.equal(seen.size,events.length);
  await visit('modules/module-01/03-brewing.html');host=page.locator('[data-tea-compare]');
  assert.equal(await host.locator('.tea-compare-option svg').count(),2);
  const cups=await host.locator('.tea-compare-option svg').evaluateAll(es=>es.map(e=>e.outerHTML));assert.equal(cups[0],cups[1],'Cup art is answer-neutral');
  await checkLayout(host);await host.locator('[data-answer="0"]').click();assert(await host.locator('[data-action="next"]').isEnabled());
  await visit('tea-labels.html');host=page.locator('[data-tea-detective]');assert.equal(await host.locator('.tea-game-figure svg').count(),1);await checkLayout(host);
  await visit('modules/module-05/03-trust-games.html');host=page.locator('[data-tea-decision]');
  for(let i=0;i<3;i++){
   const shares=host.locator('.tea-decision-share');
   for(let j=0;j<2;j++){
    const n=Number((await shares.nth(j).locator('strong').textContent()).match(/\d+/)[0]);
    assert.equal(await shares.nth(j).locator('circle[fill="#b67b5b"]').count(),n,'Countable tokens match visible text');
   }
   await checkLayout(host);await host.locator('[data-action="accept"]').click();await host.locator('[data-action="next"]').click();
  }
  await visit('tea-reading-studies.html');host=page.locator('[data-tea-study-detective]');
  const drawings=new Set();
  for(let i=0;i<8;i++){
   const picker=host.locator('.tea-study-picker');if(!await picker.evaluate(e=>e.open))await picker.locator('summary').click();
   await picker.locator(`[data-case-index="${i}"]`).click();
   const fig=host.locator('.tea-game-figure');assert.equal(await fig.count(),1);assert((await fig.locator('figcaption').textContent()).length>4);
   drawings.add(await fig.locator('svg').evaluate(e=>e.outerHTML));
   if(lang!=='en')assert(/[\u3400-\u9fff]/.test(await fig.textContent()),'Localized text equivalent');
   await host.locator('[data-answer="0"]').click();await checkLayout(host);
  }
  assert.equal(drawings.size,8);
  await visit('modules/module-03/04-regional-scripts.html');host=page.locator('[data-tea-table]');assert(await host.locator('svg').count()>0);await host.locator('[data-action="example"]').click();assert(await host.locator('[data-action="next"]').isEnabled());
  report.locales.push({lang,events:seen.size,studyFigures:drawings.size,widths:[320,390,1200],tokens:true,keyboard:true});await page.close();
 }
 assert.deepEqual(report.errors,[]);report.passed=true;
})().catch(e=>{report.errors.push(e.stack);process.exitCode=1;}).finally(async()=>{if(browser)await browser.close();if(server)await new Promise(r=>server.close(r));console.log(JSON.stringify(report,null,2));});
