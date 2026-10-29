from pathlib import Path
import json, re, shutil
r = json.loads(Path('screenshots/browser-checks.json').read_text())
checks = {}
for name in ['desktop', 'mobile']:
    a = r[name]
    assert not a['overflow'] and a['fontLoaded'] and not a['scriptErrors'] and not a['httpErrors'] and a['animationChangesTransform']
    assert len(a['videos']) == 10 and all(v['readyState'] >= 2 and not v['paused'] and v['error'] is None and v['currentTime'] > 0 for v in a['videos'])
    checks[name] = {'viewport': a['viewport'], 'status': 'passed', 'script_errors': 0, 'http_errors': 0, 'layout_overflow': False, 'videos_playing': 10, 'jetbrains_mono_loaded': True, 'animation_changes_transform': True, 'screenshot': f'screenshots/{name}.png', 'media_request_aborts': sum(x['error'] == 'net::ERR_ABORTED' for x in a['failedRequests'])}
for k in ['fullWrapMatchesStart', 'allTransformsFinite', 'tiltResponds', 'tiltReturnsToCenter']:
    assert r['cycle'][k]
p = Path('PROMPT.md').read_text()
assert Path('src/App.tsx').read_text().strip() == re.sub(r'^\d+: ?', '', p[p.index('import React,'):], flags=re.M).strip()
assert Path('dist/index.html').is_file()
checks['production_build'] = {'status': 'passed', 'command': 'npm run build', 'typescript': 'passed', 'vite': 'passed', 'artifact': 'dist/index.html', 'base': '/motionsites-results/animated-cards/'}
checks['source_fidelity'] = {'status': 'passed', 'description': 'App.tsx exactly matches prompt after removing copied line-number prefixes.'}
checks['carousel_cycle'] = {k: v for k, v in r['cycle'].items() if isinstance(v, (bool, int))}
result = {
    'title': 'Animated Cards', 'id': 'animated-cards', 'status': 'ready',
    'build_command': 'docker run --rm -u 1000:1000 -e HOME=/tmp -v "$PWD:/work" -w /work --entrypoint sh louislam/uptime-kuma:2 -c \'npm ci && npm run build\'',
    'checks': checks,
    'asset_issues': [
        {'asset': 'JetBrains Mono', 'status': 'resolved', 'detail': 'Initial Google Fonts browser check did not load the font. Bundled original weights 300/400/500 locally with OFL license. Final browser checks verify active weights 300 and 500 loaded.'},
        {'asset': 'CloudFront videos', 'status': 'working_external_dependency', 'detail': 'All five active original MP4 URLs play on front and back. Chromium aborted some buffering/range requests; no media errors or HTTP failures occurred. Internet access remains required.'}
    ],
    'notes': [
        'Ready for review; not deployed or published.',
        'React, TypeScript, Tailwind CSS v4 and requestAnimationFrame; no animation library.',
        'Explicit source code takes precedence over horizontal wording: supplied carousel rotates vertically about X.',
        'Supplied embedded SVG spells wavebank; JWT comment preserved as provided.',
        'Prompt contains no actual index.css block; added Tailwind integration, font faces, xs breakpoint and black viewport defaults.',
        'Browser checks used Chromium in the existing Docker image. Full-cycle logic tested with controlled animation callbacks, not a sustained 60 fps performance benchmark.',
        'Screenshots and detailed browser evidence are in screenshots/. README.md includes build, run, verification and limitations.',
        'All work confined to this project. No agents, other design sessions, pushes, deployments or messages to others.'
    ]
}
Path('result.json').write_text(json.dumps(result, indent=2) + '\n')
print('All final assertions passed; result.json status ready.')
