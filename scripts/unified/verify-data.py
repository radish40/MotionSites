from pathlib import Path
import json,hashlib,collections
p=Path(__file__).resolve().parents[2]
read=lambda path:json.loads(path.read_text())
r=read(p/'dist/merge-report.json');meta=read(p/'dist/data/catalog-meta.json');details=read(p/'dist/data/catalog-details.json')
assert len(meta)==len({x['id'] for x in meta})
variants={}
for x in meta:
 d=details[x['id']]
 assert x['variant_count']==len(d['variants'])
 assert set(x['sources'])=={s['key'] for s in d['origins']}
 for v in d['variants']:
  body=(p/'dist/data'/v['text_path']).read_text()
  h=hashlib.sha256(body.replace('\r\n','\n').strip().encode()).hexdigest()
  assert v['id']==h[:16] and body
  variants.setdefault(h,[]).extend(v['sources'])
 for media in d['previews']:
  f=p/'dist'/media
  assert f.is_file(),media
  if f.suffix=='.mp4':assert f.read_bytes()[4:8]==b'ftyp',media
# Every imported source body survives verbatim (apart from line endings/outer whitespace).
for source in r['inputs']:
 assert source['sha256'] in variants
 assert source['source'] in variants[source['sha256']]
assert len(r['inputs'])==317+328+65+67-len(r['excluded'])
assert len(variants)==sum(x['variant_count'] for x in meta)
assert r['summary']['images']+r['summary']['videos']+r['summary']['concepts']==len(meta)
print('PASS: all',len(r['inputs']),'source records preserved across',len(meta),'designs and',len(variants),'unique versions; all preview files present and MP4 headers valid')
