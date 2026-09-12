"""
Builds this project in one of two modes:

  site      (default) -- the real, multi-file static website: index.html
            references styles.css, roadmap-data.js and app.js as separate
            files. This is what gets committed to the repo / deployed to
            Vercel / downloaded as a project.

  artifact  -- a single self-contained HTML file with everything inlined
            (CSS in <style>, data in a JSON <script>, app logic in <script>).
            Needed only because Claude's Artifact publisher requires one
            self-contained file; not part of the git repo.

Usage:
    python3 build.py site
    python3 build.py artifact [output_path]
"""
import json, os, sys, subprocess, shutil, tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)  # repo root

# Known-good fallback location for a pre-installed tailwindcss CLI binary in
# this build sandbox (bundled as a transitive dependency of another global
# npm package). A real deployment/CI environment should instead run
# `npm install` here (see package.json) so `node_modules/.bin/tailwindcss`
# exists locally — that path is always tried first. This fallback exists
# purely so this repo's own build still works in environments where
# `npm install` cannot reach the registry.
_FALLBACK_TAILWIND_BINS = [
    '/home/claude/.npm-global/lib/node_modules/@mermaid-js/mermaid-cli/node_modules/.bin/tailwindcss',
]


def read(name):
    with open(os.path.join(HERE, name), 'r', encoding='utf-8') as f:
        return f.read()


def _find_tailwind_bin():
    local_bin = os.path.join(HERE, 'node_modules', '.bin', 'tailwindcss')
    if os.path.isfile(local_bin):
        return local_bin
    which = shutil.which('tailwindcss')
    if which:
        return which
    for candidate in _FALLBACK_TAILWIND_BINS:
        if os.path.isfile(candidate):
            return candidate
    return None


def compile_tailwind():
    """
    Compiles tailwind.input.css (the bare @tailwind directives) against
    tailwind.config.js, scanning template.html + app.js for every utility
    class actually used (including ones app.js assembles at runtime from
    literal string fragments), then purges anything unused and minifies.
    Replaces the old <script src="cdn.tailwindcss.com"> runtime-JIT approach
    (see BUILD.md) with a static bundle shipped alongside the site.

    The hand-written custom CSS in styles.css (glass panels, accordions,
    toasts, keyframes not expressible as pure utilities, etc.) is NOT run
    through Tailwind at all — it's plain valid CSS already, so it's simply
    concatenated after the compiled utilities, unmodified.
    """
    tw_bin = _find_tailwind_bin()
    if not tw_bin:
        raise RuntimeError(
            'Could not find a tailwindcss CLI binary. Run `npm install` in '
            'src/ first (see package.json), or point _FALLBACK_TAILWIND_BINS '
            'in build.py at a working install.'
        )
    with tempfile.NamedTemporaryFile(suffix='.css', delete=False) as tmp:
        tmp_out = tmp.name
    try:
        result = subprocess.run(
            [tw_bin,
             '-i', os.path.join(HERE, 'tailwind.input.css'),
             '-o', tmp_out,
             '-c', os.path.join(HERE, 'tailwind.config.js'),
             '--minify'],
            cwd=HERE, capture_output=True, text=True, timeout=120
        )
        if result.returncode != 0:
            raise RuntimeError('tailwindcss CLI failed:\n' + result.stdout + result.stderr)
        with open(tmp_out, 'r', encoding='utf-8') as f:
            compiled = f.read()
    finally:
        try: os.unlink(tmp_out)
        except OSError: pass

    custom = read('styles.css')
    return (
        '/* Compiled by Tailwind CLI from tailwind.input.css + tailwind.config.js — see package.json "build:css" */\n' +
        compiled +
        '\n/* ---- hand-written custom CSS (styles.css) — not processed by Tailwind, appended as-is ---- */\n' +
        custom
    )


def split_by_month():
    """
    Splits roadmap_data.json into (a) tiny always-eager metadata (months
    summary incl. per-month dayRange/dayCount, phaseNames) and (b) a
    days-by-month map, for the "site" build's code-splitting pipeline: Month
    1 ships inline for fast first paint, Months 2-6 ship as separate JSON
    chunk files fetched in the background right after initial render (see
    app.js's loadRemainingMonths() and BUILD.md).
    """
    data = json.loads(read('roadmap_data.json'))
    meta = {'months': data['months'], 'phaseNames': data['phaseNames'], 'totalDays': data['totalDays']}
    by_month = {}
    for d in data['days']:
        by_month.setdefault(d['m'], []).append(d)
    return meta, by_month


def build_site():
    template = read('template.html')
    css = compile_tailwind()
    app_js = read('app.js')
    meta, by_month = split_by_month()

    html = (template
            .replace('__STYLE_TAG__', '<link rel="stylesheet" href="styles.css">')
            .replace('__DATA_TAG__', '<script src="roadmap-data.js"></script>')
            .replace('__SCRIPT_TAG__', '<script src="app.js"></script>'))

    with open(os.path.join(ROOT, 'index.html'), 'w', encoding='utf-8') as f:
        f.write(html)
    with open(os.path.join(ROOT, 'styles.css'), 'w', encoding='utf-8') as f:
        f.write(css)
    with open(os.path.join(ROOT, 'app.js'), 'w', encoding='utf-8') as f:
        f.write(app_js)

    # Eager payload: metadata (all 6 months' headline stats, so the month
    # strip/progress bars are correct immediately) + Month 1's full day data
    # inline (so Month 1 is interactive with zero extra network round-trips —
    # it's the month every new user actually lands on).
    meta_json = json.dumps(meta, ensure_ascii=False)
    month1_json = json.dumps(by_month.get(1, []), ensure_ascii=False)
    assert '</script' not in meta_json.lower() and '</script' not in month1_json.lower()
    with open(os.path.join(ROOT, 'roadmap-data.js'), 'w', encoding='utf-8') as f:
        f.write('window.ROADMAP_META = ' + meta_json + ';\n')
        f.write('window.ROADMAP_MONTH1_DAYS = ' + month1_json + ';\n')

    # Lazy chunks: Months 2-6, each its own small JSON file, fetched with
    # `fetch()` shortly after first render (not blocking initial paint/FCP).
    data_dir = os.path.join(ROOT, 'data')
    os.makedirs(data_dir, exist_ok=True)
    chunk_sizes = []
    for m in range(2, 7):
        chunk_json = json.dumps({'days': by_month.get(m, [])}, ensure_ascii=False)
        assert '</script' not in chunk_json.lower()
        chunk_path = os.path.join(data_dir, 'month-' + str(m) + '.json')
        with open(chunk_path, 'w', encoding='utf-8') as f:
            f.write(chunk_json)
        chunk_sizes.append(('data/month-' + str(m) + '.json', os.path.getsize(chunk_path)))

    for name in ('index.html', 'styles.css', 'app.js', 'roadmap-data.js'):
        print('  ' + name, '-', os.path.getsize(os.path.join(ROOT, name)), 'bytes')
    for name, size in chunk_sizes:
        print('  ' + name, '-', size, 'bytes (lazy)')


def build_artifact(out_path):
    template = read('template.html')
    css = compile_tailwind()
    app_js = read('app.js')
    roadmap_json = read('roadmap_data.json')

    assert '</script' not in roadmap_json.lower()
    assert '</script' not in app_js.lower()

    html = (template
            .replace('__STYLE_TAG__', '<style>\n' + css + '\n</style>')
            .replace('__DATA_TAG__', '<script type="application/json" id="roadmap-data">' + roadmap_json + '</script>')
            .replace('__SCRIPT_TAG__', '<script>\n' + app_js + '\n</script>'))

    os.makedirs(os.path.dirname(out_path), exist_ok=True) if os.path.dirname(out_path) else None
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(html)
    print('  ' + out_path, '-', os.path.getsize(out_path), 'bytes')


if __name__ == '__main__':
    mode = sys.argv[1] if len(sys.argv) > 1 else 'site'
    if mode == 'site':
        print('Building multi-file site into', ROOT)
        build_site()
    elif mode == 'artifact':
        out = sys.argv[2] if len(sys.argv) > 2 else os.path.join(ROOT, '..', 'ielts-roadmap-artifact.html')
        out = os.path.abspath(out)
        print('Building single-file artifact ->', out)
        build_artifact(out)
    else:
        print('Unknown mode:', mode, '(use "site" or "artifact")')
        sys.exit(1)
