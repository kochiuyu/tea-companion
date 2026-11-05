#!/usr/bin/env node
'use strict';
// Real browser regression. Run after `quarto render`.
// Requires Playwright and Chromium. BASE_URL optionally points at an already served _site.
// CHROMIUM_EXECUTABLE optionally supplies the installed browser path.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http'),vm=require('node:vm');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'../_site');
const fixture={window:{}};vm.runInNewContext(fs.readFileSync(path.resolve(__dirname,'../assets/tea-study-detective-data.js'),'utf8'),fixture);
const {cases,ui}=fixture.window.TeaStudyDetectiveData;
let server,browser;
const report={passed:false,results:[],errors:[],browserErrors:[]};
async function serve(){
 server=http.createServer((req,res)=>{try{
  let filename=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
  if(filename!==root&&!filename.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
  if(fs.existsSync(filename)&&fs.statSync(filename).isDirectory())filename=path.join(filename,'index.html');
  if(!fs.existsSync(filename)){res.writeHead(404);res.end();return;}
  res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json'})[path.extname(filename)]||'application/octet-stream');fs.createReadStream(filename).pipe(res);
 }catch{res.writeHead(400);res.end();}});
 await new Promise((r,j)=>{server.once('error',j);server.listen(0,'127.0.0.1',r);});return `http://127.0.0.1:${server.address().port}/`;
}
(async()=>{
 const base=process.env.BASE_URL||await serve();
 browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_EXECUTABLE?{executablePath:process.env.CHROMIUM_EXECUTABLE}:{})});
 for(const lang of ['en','zh-hant-hk','zh-hans']){
  const page=await browser.newPage({viewport:{width:390,height:844}});
  page.on('pageerror',e=>report.browserErrors.push(`${lang}: ${e.message}`));
  await page.goto(base+(lang==='en'?'':lang+'/')+'tea-reading-studies.html',{waitUntil:'networkidle'});
  const host=page.locator('[data-tea-study-detective]');await host.locator('.tea-study').waitFor();
  assert.equal(await host.getAttribute('data-tea-study-ready'),'true');assert.equal(await host.locator('input,select,textarea').count(),0);
  const action=n=>host.locator(`[data-action="${n}"]`),panel=host.locator('.tea-study-panel'),feedback=host.locator('.tea-study-feedback');
  const browse=async n=>{const p=host.locator('.tea-study-picker');if(!await p.evaluate(e=>e.open))await p.locator('summary').click();await p.locator(`[data-case-index="${n}"]`).click();assert(!await p.evaluate(e=>e.open));};
  let choiceChecks=0;
  for(let n=0;n<cases.length;n++){
   await browse(n);assert.equal(await panel.getAttribute('data-mode'),'explore');assert(await panel.locator('h4').evaluate(e=>document.activeElement===e));
   for(let choice=0;choice<3;choice++){
    const b=host.locator(`[data-answer="${choice}"]`);await b.click();assert.equal(await b.getAttribute('aria-pressed'),'true');assert(await b.evaluate(e=>document.activeElement===e));
    assert.equal(await feedback.locator('h5').textContent(),ui[choice===cases[n].correct?'fits':'rethink'][lang]);
    assert((await feedback.textContent()).includes(cases[n].explain[lang]));choiceChecks++;
   }
   const href=await feedback.locator('a').getAttribute('href');assert.equal(href,cases[n].source);assert.equal((await page.request.get(new URL(href,page.url()).href)).status(),200);
   await action('retry').click();assert.equal(await feedback.textContent(),'');assert(await host.locator('[data-answer="0"]').evaluate(e=>document.activeElement===e));
   await page.keyboard.press('Enter');assert((await feedback.textContent()).length>80);
   await action('retry').click();await page.keyboard.press('Space');assert((await feedback.textContent()).length>80);
   await action('retry').click();await action('reveal').click();assert(await feedback.locator('h5').evaluate(e=>document.activeElement===e));assert.equal(await feedback.locator('h5').textContent(),ui.together[lang]);
   const saved=await feedback.textContent();await browse((n+1)%8);await browse(n);assert.equal(await feedback.textContent(),saved);
  }
  await action('return').click();assert.equal(await panel.getAttribute('data-mode'),'round');assert(await action('next').isDisabled());
  const seen=[];
  for(let batch=0;batch<2;batch++){
   for(let n=0;n<4;n++){
    const index=Number(await panel.getAttribute('data-case-index'));assert(!seen.includes(index));seen.push(index);
    await action('reveal').click();assert(!await action('next').isDisabled());await action('next').click();
   }
   assert.equal(await panel.getAttribute('data-mode'),'summary');assert.equal(await panel.locator('li').count(),4);await browse(0);await action('return').click();assert.equal(await panel.getAttribute('data-mode'),'summary');
   if(batch===0)await action('more').click();else await action('restart').click();
  }
  assert.equal(new Set(seen).size,8);assert(await action('next').isDisabled());
  for(const width of [320,390,1280]){
   await page.setViewportSize({width,height:900});
   const size=await page.evaluate(()=>({client:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}));assert(size.scroll<=size.client+1,`${lang}: horizontal overflow at ${width}`);
   for(const b of await host.locator('button:visible').all())assert((await b.boundingBox()).height>=44,`${lang}: small target`);
  }
  await page.emulateMedia({reducedMotion:'reduce',forcedColors:'active'});await host.locator('[data-answer="0"]').click();assert.equal(await host.locator('[aria-pressed="true"]').count(),1);
  report.results.push(`${lang}: ${choiceChecks} choices; keyboard Enter/Space; focus; sources; retry/retention; 8-case rounds; reset; 320/390/1280px; reduced motion and forced colors`);
  await page.close();
  const context=await browser.newContext({javaScriptEnabled:false});const fallback=await context.newPage();await fallback.goto(base+(lang==='en'?'':lang+'/')+'tea-reading-studies.html');
  const cards=fallback.locator('.tea-study-fallback');assert.equal(await cards.count(),8);await cards.first().locator('summary').first().click();await cards.first().locator('details summary').click();assert(await cards.first().locator('details p').first().isVisible());
  report.results.push(`${lang}: all 8 no-JavaScript cases and explanations usable`);await context.close();
 }
 assert.equal(report.browserErrors.length,0);report.passed=true;
})().catch(e=>{report.errors.push(e.stack||String(e));process.exitCode=1;}).finally(async()=>{await browser?.close();if(server)await new Promise(r=>server.close(r));console.log(JSON.stringify(report,null,2));});
