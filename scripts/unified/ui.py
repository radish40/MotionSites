from pathlib import Path
import re
ROOT=Path(__file__).parent
BASE=ROOT.parent.parent/'imports/gallery'
def build_ui(out):
 html=(BASE/'index.html').read_text()
 inline=re.findall(r'<script>(.*?)</script>',html,re.S);assert len(inline)==1
 (out/'skeleton.js').write_text(inline[0])
 html=re.sub(r'<script>.*?</script>','<script src="skeleton.js"></script>',html,flags=re.S)
 html=html.replace('MotionSites Prompts</h1>','MotionSites 合集</h1>')
 html=html.replace('>Curated<','>设计条目<').replace('>Full Text<','>提示词版本<').replace('>Animations<','>有预览<').replace('>Videos<','>视频预览<').replace('>Concepts<','>无预览<')
 html=html.replace('<div class="section-meta">','<p id="search-status" role="status" aria-live="polite"></p>\n<div class="section-meta">')
 html=html.replace('<pre', '<pre',1)
 # Add version and provenance controls ahead of the prompt description.
 marker='<p class="summary" id="description"></p>'
 assert marker in html
 html=html.replace(marker,'''<div class="version-panel"><label for="variant-choice" data-i18n="versionLabel">提示词版本</label><select id="variant-choice"></select><div id="variant-sources"></div></div>
        '''+marker)
 # Preview controls sit above the preview, within the same column.
 marker='<div id="preview" class="preview"></div>'
 assert marker in html
 html=html.replace(marker,'''<div class="preview-column"><label for="preview-choice" data-i18n="previewLabel">预览资源</label><select id="preview-choice"></select><div id="preview" class="preview"></div></div>''')
 html=html.replace('</style>',(ROOT/'unified.css').read_text()+'\n</style>')
 html=html.replace('ms_script.js?v=20260831v6','ms_script.js?v=unified-20261028')
 (out/'index.html').write_text(html)
 js=(BASE/'ms_script.js').read_text()
 def replace(old,new):
  nonlocal js
  assert old in js,old[:100]
  js=js.replace(old,new)
 def function(name,next_name,body):
  nonlocal js
  start=js.index(name);end=js.index(next_name,start)
  js=js[:start]+body+'\n\n'+js[end:]
 replace("let LANG =",(ROOT/'i18n.js').read_text()+"\nlet LANG =")
 replace('function renderProgressive(list) {','let renderGeneration = 0;\nfunction renderProgressive(list) {\n  const generation = ++renderGeneration;')
 replace('  function step() {\n    const n = renderBatch','  function step() {\n    if(generation !== renderGeneration) return;\n    const n = renderBatch')
 replace("const cat = esc(x.category || 'Concept');", "const cat = esc(x.local_rel ? (x.category || '') : t('noPreview'));")
 replace("(x.is_free ? t('openAccess') : t('premium'))", "t('placeholderNote')")
 replace("const full = !!(x.prompt_text && x.prompt_text.trim());","const full = !!x.has_text;")
 replace("if (source) list = list.filter((x) => (x.source_kind || 'motionsites') === source);","if (source) list = list.filter(x => (x.sources || []).includes(source));")
 replace("(x.prompt_text || '') + ' ' + (x.source_repo || '')", "(SEARCH_TEXT[x.id] || x.prompt_text || '') + ' ' + (x.aliases || []).join(' ') + ' ' + (x.source_repo || '')")
 replace("x.local_kind === 'jpeg'", "(x.local_kind === 'jpeg' || x.local_kind === 'jpg')")
 replace("x.local_kind === 'mp4'", "(x.local_kind === 'mp4' || x.local_kind === 'webm')")
 replace("x.local_kind !== 'mp4' && x.local_kind !== 'hls'", "x.local_kind !== 'mp4' && x.local_kind !== 'webm' && x.local_kind !== 'hls'")
 replace("    + '<span class=\"dot ' + (x.local_rel ? '' : 'concept') + '\"></span>'", "    + '<span class=\"tag\">' + x.variant_count + ' ' + t('versionsUnit') + '</span>'\n    + '<span class=\"tag\">' + (x.sources || []).map(sourceLabel).join(' · ') + '</span>'\n    + '<span class=\"dot ' + (x.local_rel ? '' : 'concept') + '\"></span>'")
 replace("'stat-text': lite.complete || 0", "'stat-text': lite.versions || 0")
 replace("if (id === 'q') { $(id).addEventListener('input', debounce(render, 120)); }", "if (id === 'q') { $(id).addEventListener('input', debounce(searchAndRender, 120)); }")
 function('async function openItem(id) {','function metaPanelHTML(x)',(ROOT/'modal.js').read_text())
 replace("function closeModal() {\n", "function closeModal() {\n  modalGeneration++;\n")
 replace("$('dlg').addEventListener('close', () => {", "$('dlg').addEventListener('close', () => {\n  modalGeneration++;")
 function('function rebuildSourceOptions() {','// -------- boot', '''function rebuildSourceOptions() {
 const sel=$('source'), previous=sel.value;
 sel.innerHTML='<option value="">'+t('allSources')+'</option>'+['gallery','original','library'].map(key=>'<option value="'+key+'">'+sourceLabel(key)+'</option>').join('');
 sel.value=previous;
}
''')
 # Old translation logic assumed the two old source categories.
 replace("if (source0.options[1]) source0.options[1].textContent = t('sourceMotionsites');", "if (source0.options[1]) source0.options[1].textContent = sourceLabel('gallery');")
 replace("if (source0.options[2]) source0.options[2].textContent = t('sourceCommunity');", "if (source0.options[2]) source0.options[2].textContent = sourceLabel('original');")
 replace('MotionSites Prompts · 动效 UI 提示词资料库','MotionSites 合集 · 设计提示词与预览')
 replace('MotionSites Prompts · A Curated Library of Motion-Driven UI','MotionSites Collection · Design Prompts & Previews')
 replace("20260831v6", "unified-20261028")
 # Load provenance/version logic before boot; it needs to exist before initial render.
 idx=js.index('// -------- boot')
 js=js[:idx]+(ROOT/'search.js').read_text()+'\n'+js[idx:]
 (out/'ms_script.js').write_text(js)
 entry=(ROOT/'entry.js').read_text().replace('MotionSites 图文预览','MotionSites 合集')
 (out/'entry.js').write_text(entry)
