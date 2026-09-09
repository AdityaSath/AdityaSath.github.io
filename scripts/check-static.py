"""Validate local links, content preservation, and original archive integrity."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import hashlib
import json
import zipfile

ROOT = Path(__file__).resolve().parents[1]

class Page(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.links, self.ids, self.text = [], [], []
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            self.ids.append(attrs['id'])
        for key in ['href', 'src', 'poster', 'data-src']:
            if key in attrs:
                self.links.append(attrs[key])

    def handle_data(self, data):
        self.text.append(data)

def check():
    errors = []
    paths = [ROOT/'index.html', *sorted((ROOT/'html').glob('*.html'))]
    for path in paths:
        page = Page(path.read_text())
        if len(page.ids) != len(set(page.ids)):
            errors.append(f'Duplicate ID: {path}')
        for link in page.links:
            url = urlsplit(link)
            if url.scheme or url.netloc:
                continue
            target = path.parent/unquote(url.path) if url.path else path
            if not target.is_file():
                errors.append(f'{path.name}: missing {link}')
            elif url.fragment and target.suffix == '.html' and url.fragment not in Page(target.read_text()).ids:
                errors.append(f'{path.name}: missing anchor {link}')
    data = json.loads((ROOT/'content/site.json').read_text())
    for path in [ROOT/'index.html', ROOT/'html/index.html']:
        ids = Page(path.read_text()).ids
        expected = ['landing', 'about', 'experience', 'work', 'skills', 'contact']
        if [id for id in ids if id in expected] != expected:
            errors.append(f'{path}: homepage section order changed')
    experience = ' '.join(Page((ROOT/'html/experience.html').read_text()).text)
    for role in data['experience']:
        for text in [role['company'], role['role'], role['location'], role['impact'], *role['bullets'], *role['metrics']]:
            if text not in experience:
                errors.append(f'Experience content missing: {text}')
    for project in data['projects']:
        text = ' '.join(Page((ROOT/f"html/project-{project['slug']}.html").read_text()).text)
        for bullet in project['bullets']:
            if bullet not in text:
                errors.append(f'Project content missing: {project["title"]}: {bullet}')
    def preserved(page_name, values):
        text = ' '.join(Page((ROOT/f'html/{page_name}.html').read_text()).text)
        for value in values:
            if value not in text:
                errors.append(f'{page_name}: content missing: {value}')
    preserved('about', data['about'])
    preserved('skills', [value for group in data['skills'].values() for value in group])
    education = data['education']
    preserved('academics', [education['degree'], education['year'], *education['honors'], *education['activities'], *[course['name'] for course in education['courses']]])
    contact = Page((ROOT/'html/contact.html').read_text())
    for link in ['mailto:'+data['email'], data['github'], data['linkedin'], '../'+data['resume']]:
        if link not in contact.links:
            errors.append(f'Contact link missing: {link}')
    manifest = json.loads((ROOT/'archive/original-site-manifest.json').read_text())
    with zipfile.ZipFile(ROOT/'archive/original-site-2026-09-07.zip') as archive:
        for path, digest in manifest.items():
            if hashlib.sha256(archive.read(path)).hexdigest() != digest:
                errors.append(f'Archive checksum mismatch: {path}')
    iteration = json.loads((ROOT/'archive/iteration-01-manifest.json').read_text())
    with zipfile.ZipFile(ROOT/'archive/iteration-01-2026-09-08.zip') as archive:
        for path, digest in iteration.items():
            if hashlib.sha256(archive.read(path)).hexdigest() != digest:
                errors.append(f'Iteration 1 checksum mismatch: {path}')
    print(f'Checked {len(paths)} pages, {len(data["experience"])} roles, {len(data["projects"])} projects, and {len(manifest)} archived files.')
    if errors:
        print('\n'.join(errors))
        raise SystemExit(1)
    print(f'Local links, anchors, unique IDs, all content categories, homepage order, and both archives pass ({len(iteration)} iteration-1 files).')

if __name__ == '__main__':
    check()
