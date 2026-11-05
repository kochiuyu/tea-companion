#!/usr/bin/env python3
"""Run after Quarto render. Verifies HTML/assets; does not claim browser coverage."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / '_site'

class Page(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.ids, self.mounts, self.assets, self.events = [], [], [], []
        self.feed(text)

    def handle_starttag(self, tag, values):
        attrs = dict(values)
        if 'id' in attrs:
            self.ids.append(attrs['id'])
        if 'data-tea-time-machine' in attrs:
            self.mounts.append(attrs.get('data-locale'))
        if 'data-event-id' in attrs:
            self.events.append(attrs['data-event-id'])
        if tag in ('script', 'link'):
            url = attrs.get('src', attrs.get('href', ''))
            if 'tea-time-machine' in url:
                self.assets.append(url)

for asset in ('tea-time-machine.js', 'tea-time-machine-data.js', 'tea-time-machine.css'):
    assert (ROOT / 'assets' / asset).read_bytes() == (SITE / 'assets' / asset).read_bytes(), asset

for lang in ('en', 'zh-hant-hk', 'zh-hans'):
    file = SITE / ('' if lang == 'en' else lang) / 'modules/module-03/01-trade-history.html'
    page = Page(file.read_text())
    assert page.mounts == [lang], (lang, page.mounts)
    assert page.ids.count('tea-time-machine') == 1
    assert page.ids.count('tea-time-reading') == 1
    assert len(page.events) == 8 and len(set(page.events)) == 8
    assert len(page.assets) == 3, (lang, page.assets)
    for url in page.assets:
        assert not urlsplit(url).scheme
        assert (file.parent / url).resolve().is_file(), (lang, url)
print('PASS: all three rendered game mounts, anchors, eight-story fallbacks, exact assets and relative resource paths.')
