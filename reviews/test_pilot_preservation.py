#!/usr/bin/env python3
"""Read-only, standard-library checks for the additive interaction pilot.

Run from any directory:
  python reviews/test_pilot_preservation.py --source-only
  quarto render
  python reviews/test_pilot_preservation.py --site _site

JSON goes to stdout only; exit status is nonzero on failure. No historical
review report is overwritten. Full mode inspects an existing render, not browser
execution or external URLs. Run it after a fresh full Quarto render. Optional
--required-asset PATH flags supplement automatically discovered new JS/CSS.
"""
import argparse
from collections import Counter
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import subprocess
import sys
from urllib.parse import unquote, urlsplit

BASELINE = 'cb9ac23fd4a32c99c27e2bde4a270a79d60c4c6e'
ROOT = Path(__file__).resolve().parents[1]


def git(*args):
    return subprocess.check_output(['git', *args], cwd=ROOT).decode('utf-8')


def lines(text):
    # Preserve exact wording/indentation; allow only blank and trailing spaces.
    return [line.rstrip() for line in text.splitlines() if line.strip()]


def missing_subsequence(before, after):
    cursor = 0
    for number, wanted in enumerate(before, 1):
        while cursor < len(after) and after[cursor] != wanted:
            cursor += 1
        if cursor == len(after):
            return {'nonblank_line': number, 'text': wanted[:200]}
        cursor += 1
    return None


def render_paths(config):
    # Deliberately handle the project's explicit render list without PyYAML.
    section = re.search(r'^  render:\s*\n((?:[ \t]+.*\n|\n)*)', config, re.M)
    if not section:
        raise ValueError('No explicit project.render list found')
    return re.findall(r'^    - [\"\']?([^\n\"\']+\.qmd)[\"\']?\s*$', section[1], re.M)


def anchors(text):
    return re.findall(r'\{[^}\n]*#([\w:.-]+)[^}\n]*\}|\bid=[\"\']([^\"\']+)[\"\']', text)


class Page(HTMLParser):
    def __init__(self, path):
        super().__init__(convert_charrefs=True)
        self.ids = []
        self.references = []
        self.control_targets = []
        self.feed(path.read_text(encoding='utf-8'))

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if attrs.get('id'):
            self.ids.append(attrs['id'])
        if tag == 'a' and attrs.get('name'):
            self.ids.append(attrs['name'])
        for attr in ('href', 'src', 'poster'):
            if attrs.get(attr) is not None:
                self.references.append(attrs[attr])
        if attrs.get('data-bs-target', '').startswith('#'):
            self.control_targets.append(attrs['data-bs-target'][1:])
        self.control_targets.extend(attrs.get('aria-controls', '').split())

    handle_startendtag = handle_starttag


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source-only', action='store_true')
    parser.add_argument('--site', default='_site', help='Rendered tree, relative to repository or absolute')
    parser.add_argument('--required-asset', action='append', default=[])
    args = parser.parse_args()
    report = {'baseline': BASELINE, 'mode': 'source-only' if args.source_only else 'rendered-site',
              'errors': [], 'limitations': ['External URLs and JavaScript behavior are not tested.']}
    errors = report['errors']

    def error(check, path, **details):
        errors.append({'check': check, 'path': path, **details})

    baseline_files = git('ls-tree', '-r', '--name-only', BASELINE).splitlines()
    baseline_pages = [p for p in baseline_files if p.endswith('.qmd')]
    baseline_config = git('show', BASELINE + ':_quarto.yml')
    old_render = render_paths(baseline_config)
    now_render = render_paths((ROOT / '_quarto.yml').read_text(encoding='utf-8'))
    if old_render != now_render:
        error('render_list_changed', '_quarto.yml', removed=sorted(set(old_render)-set(now_render)),
              added=sorted(set(now_render)-set(old_render)), order_changed=sorted(old_render)==sorted(now_render))
    report['source_files_expected'] = len(baseline_pages)
    report['render_pages_expected'] = len(old_render)
    report['source_includes_expected'] = sum(p.startswith('_includes/') for p in baseline_pages)
    report['source_files_preserved'] = 0
    report['baseline_nonblank_lines'] = 0
    report['baseline_headings'] = 0
    report['baseline_citation_definitions'] = 0
    changed = []
    old_anchors = {}
    for rel in baseline_pages:
        before = git('show', BASELINE + ':' + rel)
        file = ROOT / rel
        if not file.is_file():
            error('source_missing', rel)
            continue
        after = file.read_text(encoding='utf-8')
        if before != after:
            changed.append(rel)
        old_lines = lines(before)
        report['baseline_nonblank_lines'] += len(old_lines)
        report['baseline_headings'] += len(re.findall(r'^#{1,6} ', before, re.M))
        report['baseline_citation_definitions'] += len(re.findall(r'^\[\^[^]]+\]:', before, re.M))
        missing = missing_subsequence(old_lines, lines(after))
        if missing:
            error('original_line_missing_or_reordered', rel, **missing)
        else:
            report['source_files_preserved'] += 1
        old_anchors[rel] = [a or b for a, b in anchors(before)]
        removed = Counter(old_anchors[rel]) - Counter(a or b for a, b in anchors(after))
        if removed:
            error('explicit_anchor_removed', rel, anchors=list(removed.elements()))
        # Independently expose heading/citation failures rather than hiding them
        # behind the first changed source line.
        for name, pattern in [('heading', r'^#{1,6} .+$'), ('citation', r'^\[\^[^]]+\]:.*$')]:
            missing_items = Counter(re.findall(pattern, before, re.M)) - Counter(re.findall(pattern, after, re.M))
            if missing_items:
                error(name + '_removed', rel, items=list(missing_items.elements()))
    report['changed_pages'] = changed

    new_assets = sorted({p.relative_to(ROOT).as_posix() for p in (ROOT / 'assets').rglob('*')
                         if p.is_file() and p.suffix in {'.js', '.css'}
                         and p.relative_to(ROOT).as_posix() not in baseline_files} | set(args.required_asset))
    report['new_assets'] = new_assets
    for rel in new_assets:
        if not (ROOT / rel).is_file():
            error('required_source_asset_missing', rel)
    if args.source_only:
        report['rendered_checks'] = 'not run'
    else:
        site = (ROOT / args.site).resolve()
        report['site'] = str(site)
        pages = {}
        for rel in old_render:
            rendered = Path(rel).with_suffix('.html')
            path = site / rendered
            if not path.is_file():
                error('rendered_page_missing', rendered.as_posix())
            else:
                pages[path] = Page(path)
        report['rendered_pages'] = len(pages)
        # Include any additional HTML target in link checking, not just known pages.
        for path in site.rglob('*.html') if site.is_dir() else []:
            if path not in pages:
                pages[path] = Page(path)
        references = set()
        checked = 0
        for path, page in pages.items():
            rel = path.relative_to(site).as_posix()
            duplicates = [key for key, count in Counter(page.ids).items() if count > 1]
            if duplicates:
                error('duplicate_dom_ids', rel, ids=duplicates)
            for target in page.control_targets:
                if target not in page.ids:
                    error('control_target_missing', rel, target=target)
            source_rel = str(Path(rel).with_suffix('.qmd'))
            for anchor in old_anchors.get(source_rel, []):
                if anchor not in page.ids:
                    error('original_anchor_not_rendered', rel, anchor=anchor)
            for href in page.references:
                parsed = urlsplit(href)
                if parsed.scheme or parsed.netloc:
                    continue
                target = (site / unquote(parsed.path).lstrip('/')) if parsed.path.startswith('/') else path.parent / unquote(parsed.path)
                if not parsed.path:
                    target = path
                if target.is_dir():
                    target = target / 'index.html'
                target = target.resolve()
                checked += 1
                references.add(target)
                if not target.is_relative_to(site):
                    error('link_escapes_rendered_tree', rel, reference=href)
                elif not target.is_file():
                    error('local_target_missing', rel, reference=href)
                elif parsed.fragment and target.suffix == '.html':
                    destination = pages.get(target)
                    if destination is None:
                        destination = Page(target)
                    if unquote(parsed.fragment) not in destination.ids:
                        error('fragment_missing', rel, reference=href)
        report['internal_links_and_assets_checked'] = checked
        for rel in new_assets:
            asset = site / rel
            if not asset.is_file():
                error('new_asset_not_rendered', rel)
            elif asset.read_bytes() != (ROOT / rel).read_bytes():
                error('rendered_asset_stale_or_changed', rel)
            if asset.resolve() not in references:
                error('new_asset_not_referenced_by_html', rel)
    report['passed'] = not errors
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return int(bool(errors))


if __name__ == '__main__':
    try:
        sys.exit(main())
    except (OSError, subprocess.CalledProcessError, ValueError) as exc:
        print(json.dumps({'passed': False, 'errors': [{'check': 'test_setup', 'detail': str(exc)}]}))
        sys.exit(2)
