"""Representative desktop/mobile checks using a temporary Playwright installation."""
from pathlib import Path
import sys,json,time
sys.path.insert(0,r'C:\Users\kochi\AppData\Local\Temp\tea-browser-test')
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=Path(r'C:\Users\kochi\AppData\Local\Temp\tea-sitewide-visual-qa')
OUT.mkdir(exist_ok=True)
cases=[
 ('home-desktop','index.html',1280,1000),
 ('lesson-mobile','modules/module-01/01-plants.html',390,900),
 ('traditional-mobile','zh-hant-hk/modules/module-03/01-trade-history.html',390,900),
 ('simplified-desktop','zh-hans/tea-labels.html',1280,1000)]
results=[]
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path=r'C:\Program Files\Google\Chrome\Application\chrome.exe',headless=True)
    for name,rel,width,height in cases:
        page=browser.new_page(viewport={'width':width,'height':height},device_scale_factor=1)
        target=ROOT/'_site'/rel
        assert target.exists(), 'Complete render required'
        page.goto(target.as_uri(),wait_until='load')
        page.evaluate('document.fonts.ready')
        page.wait_for_timeout(250)
        page.screenshot(path=str(OUT/(name+'-emulated.png')))
        dimensions=page.evaluate('({viewport:innerWidth,body:document.body.scrollWidth,document:document.documentElement.scrollWidth})')
        overflow=page.evaluate('''() => Array.from(document.querySelectorAll('body *')).filter(e=>e.getBoundingClientRect().right>innerWidth+2 && e.getBoundingClientRect().width>0).slice(0,12).map(e=>({tag:e.tagName,cls:e.className,width:e.getBoundingClientRect().width,text:e.textContent.slice(0,60)}))''')
        buttons=page.locator('[data-bs-toggle="collapse"][data-bs-target]').filter(visible=True)
        toggled=False
        if buttons.count():
            b=buttons.first; selector=b.get_attribute('data-bs-target')
            b.click()
            page.locator(selector).wait_for(state='visible')
            toggled=True
            b.click()
        results.append({'page':rel,'viewport':width,'dimensions':dimensions,
                        'overflow':overflow,'foldout_open_close':toggled,'screenshot_name':name+'-emulated.png'})
        page.close()
    browser.close()
(ROOT/'reviews/browser-validation.json').write_text(json.dumps(results,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(results,ensure_ascii=True))
