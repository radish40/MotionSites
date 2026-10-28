from pathlib import Path
import json,re,hashlib,shutil,collections,urllib.parse,subprocess
ROOT=Path(__file__).resolve().parent
REPO=ROOT.parent.parent
BASE=REPO/'imports/gallery'
FIRST=REPO/'imports/original'
THIRD=REPO/'imports/library'
OUT=REPO/'dist'
REPOS={'gallery':('图文库','https://github.com/zhaosenlin12-creator/MotionSites',BASE),'original':('原始库','https://github.com/xianxian-sensen/motionsites-prompts',FIRST),'library':('文档库','https://github.com/TheSatyam-Singh/motionsites.ai',THIRD)}
read=lambda p:json.loads(p.read_text())
write=lambda p,x:p.write_text(json.dumps(x,ensure_ascii=False,indent=2))
slug=lambda s:re.sub(r'[^a-z0-9]+','-',s.lower()).strip('-')
norm=lambda s:re.sub(r'[^a-z0-9]','',s.lower())
def digest(text):return hashlib.sha256(text.replace('\r\n','\n').strip().encode()).hexdigest()
def origin(key,path):
 label,url,_=REPOS[key]
 return {'key':key,'label':label,'path':path,'url':url+'/blob/main/'+urllib.parse.quote(path,safe='/')}
records=[]; excluded=[]; warnings=[]
base_details=read(BASE/'data/catalog-details.json')
base_index=read(BASE/'data/catalog-text-index.json')
for x in read(BASE/'data/catalog-meta.json'):
 text=(BASE/'data'/base_index[x['id']]).read_text().strip()
 records.append(dict(meta=x.copy(),text=text,source=origin('gallery','data/'+base_index[x['id']]),media=[(REPO/x['local_rel'],x['local_rel'])] if x.get('local_rel') else [],details=base_details.get(x['id'],{})))
for x in read(FIRST/'motionsites_all_prompts.json'):
 records.append(dict(meta=x.copy(),text=x['prompt_text'].strip(),source={**origin('original','motionsites_all_prompts.json'),'record_id':x['id']},media=[],details={}))
for folder in ('prompts','Pro prompts'):
 for p in sorted((THIRD/folder).glob('*.md')):
  raw=p.read_text();title=re.search(r'^#\s+(.+)',raw).group(1).strip()
  field=lambda name: (re.search(r'\*\*'+name+r':\*\*\s*([^\n]+)',raw).group(1).strip() if re.search(r'\*\*'+name+r':\*\*\s*([^\n]+)',raw) else '')
  ident=field('ID');ident=slug(ident) if ident and not ident.isdigit() else slug(title)
  if folder=='prompts':
   section=re.split(r'^## .*Prompt\s*$',raw,flags=re.M)
   assert len(section)==2,p
   body=section[1].strip(); start=re.match(r'```(?:text|plaintext)?\s*\n',body)
   assert start,p
   end=body.rfind('\n```');assert end>start.end(),p
   text=body[start.end():end].strip()
   preview=section[0]
  else:
   text=raw.split('\n---\n',1)[1].strip();preview=''
  if not text or re.search(r'no prompt text|no prompt available',text,re.I):
   excluded.append({'path':str(p.relative_to(THIRD)),'reason':'仓库仅有占位说明，没有提示词正文','text':text});continue
  media=[]
  for rel in re.findall(r'!\[[^\]]*\]\(([^)]+)\)',preview):
   f=(REPO/'assets/library'/urllib.parse.unquote(rel).removeprefix('../assets/')).resolve()
   if rel == '../assets/videos/AI_Automation_Hero_0.mp4':
    warnings.append({'file':str(p.relative_to(THIRD)),'media':rel,'reason':'HLS manifest mislabeled MP4'});continue
   if not f.is_relative_to(REPO/'assets/library') or not f.is_file():
    warnings.append({'file':str(p.relative_to(THIRD)),'media':rel,'reason':'missing'});continue
   # One upstream .mp4 is actually an HLS manifest; do not publish it as playable MP4.
   if f.suffix.lower()=='.mp4' and f.read_bytes()[:7]==b'#EXTM3U':
    warnings.append({'file':str(p.relative_to(THIRD)),'media':rel,'reason':'HLS manifest mislabeled MP4'});continue
   media.append((f,'assets/library/'+f.relative_to(REPO/'assets/library').as_posix()))
  records.append(dict(meta={'id':ident,'title':title,'category':field('Category'),'type':field('Type'),'source_kind':'motionsites'},text=text,source=origin('library',p.relative_to(THIRD).as_posix()),media=media,details={}))
# Conservative identity matching: exact design ID, normalized full title, or exact full body.
parents=list(range(len(records)))
def find(i):
 while parents[i]!=i:parents[i]=parents[parents[i]];i=parents[i]
 return i
def union(a,b):
 a,b=find(a),find(b)
 if a!=b:parents[max(a,b)]=min(a,b)
keys={}
for i,r in enumerate(records):
 tokens=[('id',r['meta']['id']),('title',norm(r['meta']['title']))]
 if len(r['text'])>80:tokens.append(('body',digest(r['text'])))
 for token in tokens:
  if not token[1]:continue
  if token in keys:union(i,keys[token])
  else:keys[token]=i
groups=collections.defaultdict(list)
for i,r in enumerate(records):groups[find(i)].append(r)
OUT.mkdir(exist_ok=True)
(OUT/'data/variants').mkdir(parents=True,exist_ok=True)
shutil.copytree(REPO/'assets',OUT/'assets',dirs_exist_ok=True)
meta=[];details={};index={};search={};audit=[];media_to_copy={};used_ids=set()
for group in groups.values():
 primary=group[0];item={k:v for k,v in primary['meta'].items() if k!='prompt_text'}
 ident=item['id'];assert ident not in used_ids,ident;used_ids.add(ident)
 sources=[];variants={};media=[]
 for r in group:
  o=r['source']
  if o not in sources:sources.append(o)
  h=digest(r['text'])
  if h not in variants:
   path='variants/'+h+'.txt';(OUT/'data'/path).write_text(r['text'])
   variants[h]={'id':h[:16],'text_path':path,'sources':[],'length':len(r['text'])}
  if o not in variants[h]['sources']:variants[h]['sources'].append(o)
  for f,rel in r['media']:
   if rel not in media:
    media.append(rel);media_to_copy[rel]=f
 item['sources']=list(dict.fromkeys(s['key'] for s in sources))
 item['variant_count']=len(variants);item['has_text']=True
 item['aliases']=list(dict.fromkeys(r['meta']['title'] for r in group))
 if media:item['local_rel']=media[0];item['local_kind']=Path(media[0]).suffix.lstrip('.')
 else:item.pop('local_rel',None);item.pop('local_kind',None)
 if not item.get('description'):
  item['description']=next((r['meta']['description'] for r in group if r['meta'].get('description')),'')
 item['category']=item.get('category') or 'Other';item['type']=item.get('type') or 'design'
 # Honor the visual library's category mapping for shared aliases.
 variants=list(variants.values())
 details[ident]={**primary['details'],'variants':variants,'origins':sources,'previews':media}
 # These fields must not overwrite the merged metadata on modal load.
 for k in ('local_kind','local_rel','has_text'):details[ident].pop(k,None)
 index[ident]=variants[0]['text_path']
 search[ident]='\n'.join(dict.fromkeys(r['text'] for r in group)).lower()
 meta.append(item)
 audit.append({'id':ident,'title':item['title'],'input_records':len(group),'versions':len(variants),'sources':sources,'aliases':item['aliases']})
for rel,src in media_to_copy.items():
 dest=OUT/rel;dest.parent.mkdir(parents=True,exist_ok=True)
 if not dest.exists() or dest.stat().st_size!=src.stat().st_size:shutil.copy2(src,dest)
# Keep original visual-library order; appended entries with previews come before text-only entries.
meta.sort(key=lambda x:not bool(x.get('local_rel')))
counts=collections.Counter(x['category'] for x in meta)
images=sum(bool(x.get('local_rel')) and x.get('local_kind') not in ('mp4','webm') for x in meta)
videos=sum(x.get('local_kind') in ('mp4','webm') for x in meta)
lite={'total':len(meta),'complete':len(meta),'versions':sum(x['variant_count'] for x in meta),'images':images,'videos':videos,'concepts':len(meta)-images-videos,'categories':dict(counts),'topCategories':[{'category':k,'count':v} for k,v in counts.most_common(9)],'sourceCounts':{k:sum(k in x['sources'] for x in meta) for k in REPOS}}
for name,data in [('catalog-meta.json',meta),('catalog-lite.json',lite),('catalog-details.json',details),('catalog-text-index.json',index),('catalog-search.json',search)]:write(OUT/'data'/name,data)
(OUT/'licenses').mkdir(exist_ok=True)
for key,(_,_,root) in REPOS.items():shutil.copy2(root/'LICENSE',OUT/'licenses'/(key+'.txt'))
shutil.copy2(BASE/'LICENSE',OUT/'LICENSE')
report={'inputRecords':len(records),'excluded':excluded,'mediaWarnings':warnings,'summary':lite,'groups':audit,'inputs':[{'id':r['meta']['id'],'source':r['source'],'sha256':digest(r['text'])} for r in records],'matching':'Exact ID, normalized full title, or exact full body; versions deduplicated only after trimming outer whitespace and normalizing CRLF.'}
write(REPO/'dist/merge-report.json',report)
print(json.dumps({k:v for k,v in report.items() if k not in ('groups','inputs')},ensure_ascii=False,indent=2))
from ui import build_ui
build_ui(OUT)
