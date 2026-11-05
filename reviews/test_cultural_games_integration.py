#!/usr/bin/env python3
"""Verify both additive games against the fetched pre-change main commit.
Run after a full `quarto render`. This checks files, not real browser behavior.
"""
from pathlib import Path
from html.parser import HTMLParser
import hashlib
import json
import re
import subprocess
import sys
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
BASELINE = '82ac3785b2b5e24d764dd571fbb7aabc8cf87c61'
errors = []

def git(*args):
    return subprocess.check_output(['git', *args], cwd=ROOT)

def nonblank(s):
    return [line.rstrip() for line in s.splitlines() if line.strip()]

def subsequence(before, after):
    it = iter(after)
    return all(any(old == new for new in it) for old in before)

class Page(HTMLParser):
    def __init__(self, filename):
        super().__init__()
        self.links = []
        self.hosts = []
        self.ids = []
        self.feed(filename.read_text(encoding='utf-8'))
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'a' and 'href' in attrs:
            self.links.append(attrs['href'].removeprefix('./'))
        if 'id' in attrs:
            self.ids.append(attrs['id'])
        for name in ('data-tea-time-machine', 'data-tea-table'):
            if name in attrs:
                self.hosts.append((name, attrs.get('data-locale')))

preserved = 0
changed = []
for name in git('ls-tree', '-r', '--name-only', BASELINE).decode().splitlines():
    path = ROOT / name
    before = git('show', f'{BASELINE}:{name}')
    if not path.is_file():
        errors.append(f'Missing original file: {name}')
        continue
    after = path.read_bytes()
    if after != before:
        changed.append(name)
        if path.suffix != '.qmd' or not subsequence(nonblank(before.decode()), nonblank(after.decode())):
            errors.append(f'Original contents changed or removed: {name}')
    preserved += 1

site = ROOT / '_site'
new_assets = ['tea-time-machine.js', 'tea-time-machine-data.js', 'tea-time-machine.css', 'tea-table-game.js', 'tea-table-data.js', 'tea-table-game.css']
asset_hashes = {}
for name in new_assets:
    source = ROOT / 'assets' / name
    rendered = site / 'assets' / name
    if not rendered.is_file() or source.read_bytes() != rendered.read_bytes():
        errors.append(f'Missing or stale rendered asset: {name}')
    asset_hashes[name] = hashlib.sha256(source.read_bytes()).hexdigest()

for lang in ('en', 'zh-hant-hk', 'zh-hans'):
    folder = site / ('' if lang == 'en' else lang)
    home = Page(folder / 'index.html')
    for href in ('modules/module-03/01-trade-history.html#tea-time-machine', 'modules/module-03/04-regional-scripts.html#set-the-tea-table'):
        wanted = urlsplit(href)
        target = ((folder / wanted.path).resolve(), wanted.fragment)
        destinations = {((folder / urlsplit(link).path).resolve(), urlsplit(link).fragment) for link in home.links if not urlsplit(link).scheme}
        if target not in destinations:
            errors.append(f'{lang}: game not discoverable from home: {href}')
    chapter_folder = folder / 'modules/module-03'
    chapter = Page(chapter_folder / 'index.html')
    destinations = {((chapter_folder / urlsplit(link).path).resolve(), urlsplit(link).fragment) for link in chapter.links if not urlsplit(link).scheme}
    for href in ('01-trade-history.html#tea-time-machine', '04-regional-scripts.html#set-the-tea-table'):
        wanted = urlsplit(href)
        if ((chapter_folder / wanted.path).resolve(), wanted.fragment) not in destinations:
            errors.append(f'{lang}: game not discoverable from chapter: {href}')
    for name, host, anchor in (('modules/module-03/01-trade-history.html', 'data-tea-time-machine', 'tea-time-machine'), ('modules/module-03/04-regional-scripts.html', 'data-tea-table', 'set-the-tea-table')):
        page = Page(folder / name)
        if page.hosts.count((host, lang)) != 1 or anchor not in page.ids:
            errors.append(f'{lang}: missing or duplicate game mount/anchor: {name}')

report = {
    'passed': not errors,
    'baseline': BASELINE,
    'original_files_preserved': preserved,
    'changed_original_files': changed,
    'new_asset_sha256': asset_hashes,
    'languages_checked': ['en', 'zh-hant-hk', 'zh-hans'],
    'errors': errors,
    'limitations': ['Static source/render validation only; not browser, keyboard or visual QA.']
}
print(json.dumps(report, ensure_ascii=False, indent=2))
sys.exit(bool(errors))
