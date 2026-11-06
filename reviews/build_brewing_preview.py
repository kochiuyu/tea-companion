"""Local QA only. Does not register, upload, save or deploy a hosted Site."""
from pathlib import Path
import html,json,shutil,sys
R=Path(__file__).resolve().parents[1];P=Path(sys.argv[1]).resolve()
P.mkdir(exist_ok=True);shutil.copytree(R/'_site',P/'dist',dirs_exist_ok=True)
(P/'.openai').mkdir(exist_ok=True)
(P/'.openai/hosting.json').write_text('{"static":{"directory":"dist"}}\n')
shutil.copyfile(R/'reviews/brewing-gallery-harness.html',P/'dist/_brewing-qa.html')
d=json.loads((R/'data/tea-brewing-illustrations.json').read_text())
cards=''.join('<figure><img src="assets/tea-brewing-illustrations/'+e['id']+'.svg"><figcaption>'+html.escape(e['text']['en']['name'])+'</figcaption></figure>' for e in d['entries'])
(P/'dist/_brewing-art.html').write_text('<!doctype html><html lang="en"><meta charset="utf-8"><title>Brewing illustrations: original art</title><style>body{margin:16px;background:#fffdf7}main{display:grid;grid-template-columns:repeat(3,360px);gap:8px}figure{margin:0}img{display:block;width:360px;height:200px}figcaption{font:15px system-ui;padding:5px 12px}</style><main>'+cards+'</main></html>')
print(P)
