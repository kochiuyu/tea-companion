"""Build an offline, single-file review preview from the actual game assets.
Run from the repository root: python reviews/build_figure_preview.py
Output is a review artifact, not part of the Quarto publication list.
"""
from pathlib import Path

root = Path(__file__).resolve().parents[1]
styles = ['tea-interactions', 'tea-label-detective', 'tea-decision-game',
          'tea-study-detective', 'tea-time-machine', 'tea-table-game', 'tea-game-figures']
scripts = ['tea-game-figures', 'tea-compare', 'tea-label-detective', 'tea-decision-game',
           'tea-study-detective-data', 'tea-study-detective', 'tea-time-machine-data',
           'tea-time-machine', 'tea-table-data', 'tea-table-game']
games = [('time', 'Tea Time Machine', 'tea-time-machine', 'modules/module-03/01-trade-history.html'),
         ('compare', 'Which cup?', 'tea-compare', 'modules/module-01/03-brewing.html'),
         ('labels', 'Tea Label Detective', 'tea-detective', 'tea-labels.html'),
         ('decisions', 'Decision game', 'tea-decision', 'modules/module-05/03-trust-games.html'),
         ('studies', 'Study Detective', 'tea-study-detective', 'tea-reading-studies.html'),
         ('table', 'Set the Tea Table (unchanged)', 'tea-table', 'modules/module-03/04-regional-scripts.html')]
html = ['<!doctype html><html lang="en"><meta charset="utf-8">',
        '<meta name="viewport" content="width=device-width,initial-scale=1">',
        '<title>Tea Companion - illustration review</title><style>',
        'body{font:17px/1.55 system-ui,sans-serif;background:#faf8f1;color:#263d32;margin:auto;padding:24px;max-width:1000px}h1,h2{line-height:1.2}a{color:#245c47}nav{display:flex;flex-wrap:wrap;gap:16px;margin:20px 0}main>section{margin:48px 0}select{font:inherit;padding:8px}button{font:inherit}*,*:before,*:after{box-sizing:border-box}',
        *[(root / 'assets' / (name + '.css')).read_text(encoding='utf8') for name in styles],
        '</style><header><h1>Tea Companion: illustrated games</h1>',
        '<p>Review preview. Illustrations are schematic; the existing stories and game rules are unchanged.</p>',
        '<label for="locale">Game language </label><select id="locale"><option value="en">English</option><option value="zh-hant-hk">Traditional Chinese</option><option value="zh-hans">Simplified Chinese</option></select><nav>',
        *[f'<a href="#{key}">{title}</a>' for key,title,_,_ in games],
        '</nav></header><main>']
for key,title,attribute,path in games:
    html.append(f'<section id="{key}"><h2>{title}</h2><div data-{attribute} data-locale="en" data-root="https://kochiuyu.github.io/tea-companion"></div><p><a href="https://kochiuyu.github.io/tea-companion/{path}">Full lesson on the current live site</a></p></section>')
html.append('''</main><script>
const requestedLang = new URLSearchParams(location.hash.slice(1)).get('lang') || new URLSearchParams(location.search).get('lang');
const lang = ['en','zh-hant-hk','zh-hans'].includes(requestedLang) ? requestedLang : 'en';
document.querySelectorAll('[data-locale]').forEach(e => {e.dataset.locale=lang; e.lang=lang; e.dataset.root='https://kochiuyu.github.io/tea-companion'+(lang==='en'?'':'/'+lang);});
document.querySelector('#locale').value=lang;
document.querySelector('#locale').onchange=e=>{location.hash='lang='+e.target.value;location.reload();};
</script>''')
for name in scripts:
    html.append('<script>\n' + (root / 'assets' / (name + '.js')).read_text(encoding='utf8') + '\n</script>')
html.append('</html>')
out = root / 'reviews/game-figures-preview.html'
out.write_text('\n'.join(html), encoding='utf8')
print(out)
