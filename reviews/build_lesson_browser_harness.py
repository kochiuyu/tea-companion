#!/usr/bin/env python3
"""Materialize the browser harness inside a local managed-preview folder.
Example: python reviews/build_lesson_browser_harness.py ../tea-illustrations-private-preview/dist/_lesson-qa.html
Remove the generated QA page before packaging the preview. This script never publishes.
"""
import json,sys
from pathlib import Path
root=Path(__file__).resolve().parents[1]
assert len(sys.argv)==2,'Pass the local preview output HTML path'
data=json.loads((root/'data/lesson-illustrations.json').read_text())
template=(root/'reviews/lesson-illustrations-harness.html').read_text()
output=Path(sys.argv[1]).resolve()
output.parent.mkdir(parents=True,exist_ok=True)
output.write_text(template.replace('__DATA__',json.dumps(data,ensure_ascii=False)))
print(output)
