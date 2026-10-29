#!/usr/bin/env python3
"""Durable bookkeeping and delivery. Creating fresh sessions stays with the manager."""
import argparse
from collections import Counter
import csv
import fcntl
import datetime
import hashlib
import html
import json
import os
from pathlib import Path
import shutil
import sqlite3
import subprocess
import sys
import urllib.request

ROOT = Path(__file__).resolve().parents[2]
STATE = ROOT / 'docs/gpt-6.1-sol-high'
MANIFEST = STATE / 'manifest.json'
BASE = 'https://tool.luo-xd.com/motionsites-results/'
REPOSITORY = 'https://github.com/radish40/MotionSites'


def execute(command, **kwargs):
    try:
        return subprocess.run([str(x) for x in command], check=True, text=True, capture_output=True, **kwargs).stdout.strip()
    except subprocess.CalledProcessError as error:
        print(error.stderr[-5000:],file=sys.stderr,flush=True)
        raise


def git(*args):
    return execute(['docker','run','--rm','-u','1000:1000','-e','HOME=/home/opc',
        '--entrypoint','git','-v','/etc/passwd:/etc/passwd:ro','-v','/etc/group:/etc/group:ro',
        '-v','/home/opc:/home/opc','alpine/git','-c',f'safe.directory={ROOT}','-C',ROOT,*args])


def load():
    return json.loads(MANIFEST.read_text())


def save(manifest):
    manifest['updated_utc'] = datetime.datetime.now(datetime.timezone.utc).isoformat()
    manifest['scope'] = '380 designs, gallery-default prompt each, isolated fresh sessions, publish + source push + screenshots + group receipts required.'
    temporary = MANIFEST.with_suffix('.next')
    temporary.write_text(json.dumps(manifest, ensure_ascii=False, indent=2)+'\n')
    os.replace(temporary, MANIFEST)
    # Keep the spreadsheet synchronized, including fields discovered during execution.
    fields = list(dict.fromkeys(key for job in manifest['jobs'] for key in job))
    with (STATE/'inventory.csv').open('w',encoding='utf-8-sig',newline='') as stream:
        writer=csv.DictWriter(stream,fieldnames=fields)
        writer.writeheader()
        writer.writerows({k: json.dumps(v,ensure_ascii=False) if isinstance(v,(dict,list)) else v for k,v in j.items()} for j in manifest['jobs'])
    inventory=STATE/'inventory.md'
    if inventory.exists():
        lines=inventory.read_text().splitlines()
        statuses={'not_started':'未开始','queued':'排队','running':'生成中','ready':'待验收','validating':'验收中','publishing':'发布中','complete':'已完成','needs_fix':'待修复','blocked':'阻塞'}
        counts=Counter(j['status'] for j in manifest['jobs'])
        for n,line in enumerate(lines):
            if line.startswith('当前状态：'):
                lines[n]=f'当前状态：已完成 {counts["complete"]}/380；以 manifest.json 和在线索引的最新状态为准。'
            for job in manifest['jobs']:
                if f"| `{job['id']}` |" in line:
                    lines[n]=line.rsplit('|',2)[0]+'| '+statuses.get(job['status'],job['status'])+' |'
                    break
        inventory.write_text('\n'.join(lines)+'\n')


def job_for(manifest, ident):
    return next(j for j in manifest['jobs'] if j['id'] == ident)


def prepare(ident):
    manifest=load(); job=job_for(manifest,ident)
    if job['thread_id']:
        raise RuntimeError('Already assigned to a session; do not create a duplicate')
    output=ROOT/'generated/gpt-6.1-sol-high'/ident
    output.mkdir(parents=True,exist_ok=True)
    body=(ROOT/job['prompt_path']).read_bytes()
    if hashlib.sha256(body).hexdigest()!=job['prompt_sha256']:
        raise RuntimeError('Prompt changed since inventory')
    (output/'PROMPT.md').write_bytes(body)
    template=(ROOT/'scripts/generation/TASK.template.md').read_text()
    (output/'TASK.md').write_text(template.replace('{{TITLE}}',job['title']).replace('{{ID}}',ident).replace('{{OUTPUT}}',str(output)))
    job['output_path']=str(output.relative_to(ROOT)); job['status']='queued'
    save(manifest)
    print(output/'TASK.md')


def register(ident,thread_id):
    manifest=load(); job=job_for(manifest,ident)
    if job['thread_id'] and job['thread_id'] != thread_id:
        raise RuntimeError('Never replace an existing design session')
    db=sqlite3.connect('file:/home/opc/.codex/state_5.sqlite?mode=ro',uri=True)
    config=db.execute('SELECT model,reasoning_effort FROM threads WHERE id=?',(thread_id,)).fetchone()
    if config != ('gpt-6.1-sol','high'):
        raise RuntimeError(f'Unexpected session configuration: {config}')
    job.update(thread_id=thread_id,status='running',started_utc=datetime.datetime.now(datetime.timezone.utc).isoformat(),
               actual_session_config={'model':config[0],'reasoning_effort':config[1]})
    save(manifest)
    print(ident,thread_id,config)


def index():
    manifest=load(); jobs=manifest['jobs']; counts=Counter(j['status'] for j in jobs)
    output=ROOT/'results'; output.mkdir(exist_ok=True)
    esc=lambda value:html.escape(str(value),quote=True)
    cards=[]
    for job in jobs:
        if job['status']!='complete':continue
        ident=job['id']; title=esc(job['title'])
        source=f'{REPOSITORY}/tree/main/{job["output_path"]}'
        prompt=f'{REPOSITORY}/blob/main/{job["prompt_path"]}'
        cards.append(f'<article><a href="{ident}/"><img src="{ident}/preview/desktop.png" alt="{title} 桌面预览" loading="lazy"><h2>{title}</h2></a><p>{esc(job["category"])} · GPT-6.1 Sol High</p><nav><a href="{ident}/">访问网页 ↗</a><a href="{source}">源码</a><a href="{prompt}">原提示词</a><a href="{ident}/preview/mobile.png">手机截图</a></nav></article>')
    active='、'.join(esc(j['title']) for j in jobs if j['status'] in ('running','validating','publishing'))
    doc='''<!doctype html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>MotionSites · GPT-6.1 Sol High 成果索引</title><style>
*{box-sizing:border-box}body{margin:0;background:#f5f5f1;color:#17201b;font:16px/1.6 system-ui,sans-serif}main{max-width:1400px;margin:auto;padding:48px 24px}header{margin-bottom:36px}h1{font-size:clamp(28px,4vw,48px);letter-spacing:-.04em;margin:0}p{color:#59645b}a{color:inherit;text-decoration:none}a:hover{text-decoration:underline}.stats{display:flex;gap:12px;flex-wrap:wrap;margin:24px 0}.stats span{background:white;border:1px solid #dce0d9;border-radius:30px;padding:8px 16px}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,330px),1fr));gap:24px}article{background:white;border:1px solid #dce0d9;border-radius:16px;overflow:hidden}article img{width:100%;aspect-ratio:1.44;object-fit:cover;object-position:top;background:#e6e9e1;display:block}h2{font-size:21px;margin:16px 20px 4px}article p{margin:0 20px 12px;font-size:13px}nav{display:flex;gap:14px;flex-wrap:wrap;padding:0 20px 20px;font-size:13px}footer{margin-top:44px;font-size:13px;color:#59645b}.empty{border:1px dashed #bdc7ba;border-radius:16px;padding:36px}header>a{display:inline-block;margin-bottom:20px}</style></head><body><main><header><a href="/motionsites-preview/">← 提示词画廊</a><h1>MotionSites 生成成果</h1><p>380 个设计 · GPT-6.1 Sol High · 每个设计独立新会话。项目名称与原提示词名称保持一致。</p>'''
    batch=manifest.get('current_batch',{})
    batch_limit=batch.get('through_number')
    if batch_limit:
        batch_done=sum(j['status']=='complete' for j in jobs if j['number']<=batch_limit)
        if batch.get('status')=='paused':
            doc+=f'<p>本轮已暂停：{batch_done} / {batch_limit} 项已交付并通过核验；剩余 {len(jobs)-batch_limit} 项尚未开始。</p>'
        else:
            doc+=f'<p>本轮进度：{batch_done} / {batch_limit}；前 {batch_limit} 项完成后暂停，剩余项目保留。</p>'
    doc+=f'<div class="stats"><span>已完成 {counts["complete"]} / {len(jobs)}</span><span>生成中 {counts["running"]}</span><span>验收 / 发布中 {counts["ready"]+counts["validating"]+counts["publishing"]}</span><span>待修复 / 阻塞 {counts["needs_fix"]+counts["blocked"]}</span></div>'
    if active:doc+=f'<p>当前项目：{active}</p>'
    doc+='</header><section class="grid">'+(''.join(cards) or '<p class="empty">首批项目正在生成与验收，完成后将在这里展示网页和截图。</p>')+'</section>'
    doc+=f'<footer>更新于 {esc(manifest.get("updated_utc",manifest["created_utc"]))} · <a href="progress.json">完整进度</a> · <a href="{REPOSITORY}">项目仓库</a></footer></main></body></html>'
    (output/'index.html').write_text(doc)
    progress={'updated_utc':manifest.get('updated_utc'),'total':len(jobs),'counts':dict(counts),'current_batch':batch,'jobs':[
        {key:job.get(key) for key in ('id','title','category','status','thread_id','source_commit','group_message_id')} |
        {'url':BASE+job['id']+'/' if job['status']=='complete' else None} for job in jobs]}
    (output/'progress.json').write_text(json.dumps(progress,ensure_ascii=False,indent=2)+'\n')
    print(execute(['sudo','-n','python3',ROOT/'scripts/generation/publish.py','index',output]))


def finish(ident, refresh=False):
    manifest=load(); job=job_for(manifest,ident)
    if refresh and job['status']!='complete':raise RuntimeError('Only completed deliveries can refresh their previews')
    if job['status']=='complete' and not refresh:
        notify(ident);return
    if refresh:job['preview_previous_source_commit']=job['source_commit']
    output=ROOT/job['output_path']; result=json.loads((output/'result.json').read_text())
    if result.get('status')!='ready': raise RuntimeError('Worker is not ready')
    if ident=='glitch-pulse' and not job.get('runtime'):
        job['status']='needs_fix';job['validation']='Original prompt requires an Express production service; runtime deployment is pending'
        save(manifest)
        raise RuntimeError(job['validation'])
    if not (output/'dist/index.html').is_file():raise RuntimeError('Missing static build')
    job['status']='validating'; save(manifest)
    print(execute(['sudo','-n','python3',ROOT/'scripts/generation/publish.py',ident,output/'dist']))
    url=BASE+ident+'/'
    report=output/'screenshots';report.mkdir(exist_ok=True)
    if report.resolve().parent!=output.resolve():raise RuntimeError('Screenshot directory must belong to this design')
    if any(p.stat().st_uid!=os.getuid() for p in [report,*report.iterdir()]):
        execute(['sudo','-n','chown','-R','--no-dereference',f'{os.getuid()}:{os.getgid()}',report])
    try:
        print(execute(['docker','run','--rm','-u','1000:1000','--shm-size=256m','-v',f'{ROOT}:/work',
            '--entrypoint','node','louislam/uptime-kuma:2','/work/scripts/generation/check-live.cjs',url,
            '/work/'+str(report.relative_to(ROOT))]))
    except subprocess.CalledProcessError as error:
        job['status']='needs_fix';job['validation']='Live browser check failed; see screenshots/live-check.json';save(manifest)
        print(error.stdout);raise
    dist=output/'dist'
    if dist.resolve().parent!=output.resolve():raise RuntimeError('Build directory must belong to this design')
    if any(p.stat().st_uid!=os.getuid() for p in [dist,*dist.rglob('*')]):
        execute(['sudo','-n','chown','-R','--no-dereference',f'{os.getuid()}:{os.getgid()}',dist])
    public=dist/'preview';public.mkdir(exist_ok=True)
    for name in ('desktop.png','mobile.png','live-check.json'):shutil.copyfile(report/name,public/name)
    job['status']='publishing';save(manifest)
    # Stage only this finished design. Other workers may still be writing their directories.
    candidates=git('ls-files','--cached','--others','--exclude-standard','-z','--',job['output_path']).split('\0')
    oversized=[name for name in candidates if name and (ROOT/name).is_file() and (ROOT/name).stat().st_size>=100*1024*1024]
    if oversized:
        job['status']='needs_fix';job['validation']='Source packaging exceeds GitHub single-file limit: '+', '.join(oversized)
        save(manifest)
        raise RuntimeError(job['validation'])
    git('add','--',job['output_path'])
    if git('diff','--cached','--name-only'):
        git('commit','--quiet','-m',f'feat(generated): implement {job["title"]} with GPT-6.1 Sol High')
    commit=git('rev-parse','HEAD')
    print(git('push','origin','main'))
    remote=git('ls-remote','origin','refs/heads/main').split()[0]
    if remote != commit:raise RuntimeError('Remote HEAD does not match pushed source')
    print(execute(['sudo','-n','python3',ROOT/'scripts/generation/publish.py',ident,output/'dist']))
    for relative in ('','preview/desktop.png','preview/mobile.png'):
        execute(['curl','--fail','--silent','--show-error','--max-time','30','--output','/dev/null',url+relative])
    job.update(status='complete',source_commit=commit,url=url,completed_utc=datetime.datetime.now(datetime.timezone.utc).isoformat(),
               validation='Live desktop/mobile browser checks passed; source pushed and public screenshots verified')
    if refresh:job['preview_refreshed_utc']=datetime.datetime.now(datetime.timezone.utc).isoformat()
    save(manifest);index()
    notify(ident)
    cleanup_dependencies(output)


def refresh(ident):
    finish(ident,refresh=True)


def cleanup_dependencies(output):
    # Completed source and lockfiles are in Git; installed packages can be recreated.
    # Only clean this finished design, never the dependencies of an active worker.
    packages=output/'node_modules'
    try:
        if packages.is_symlink():packages.unlink()
        elif packages.is_dir():shutil.rmtree(packages)
    except OSError as error:
        print('Dependency cleanup deferred:',output.name,str(error),file=sys.stderr)


def notify(ident):
    manifest=load();job=job_for(manifest,ident)
    if job['status']!='complete':raise RuntimeError('Cannot announce an unfinished project')
    if job.get('group_message_id'):print('Already announced',job['group_message_id']);return
    # The relay deduplicates retries by deviceId + requestId.
    token=Path('/home/opc/codex-relay/data/device-token').read_text().strip()
    device=Path('/home/opc/codex-relay/data/group-device-id').read_text().strip()
    count=sum(j['status']=='complete' for j in manifest['jobs'])
    text=f"MotionSites 已完成：{job['title']}\n访问地址：{job['url']}\n源码：{REPOSITORY}/tree/{job['source_commit']}/{job['output_path']}\n已保存桌面和手机截图。模型 GPT-6.1 Sol High，独立新会话生成。\n总进度：{count}/380\n成果索引：{BASE}"
    batch_limit=manifest.get('current_batch',{}).get('through_number')
    if batch_limit:text+=f'\n本轮目标：完成前 {batch_limit} 项后暂停。'
    payload={'deviceId':device,'requestId':'motionsites-complete-'+ident,'text':text}
    req=urllib.request.Request('http://127.0.0.1:8765/codex/api/group/messages',data=json.dumps(payload,ensure_ascii=False).encode(),
        headers={'Authorization':'Bearer '+token,'Content-Type':'application/json'})
    with urllib.request.urlopen(req,timeout=30) as response: receipt=json.load(response)
    job['group_message_id']=receipt['id'];save(manifest)
    print('Group receipt:',receipt['id'])


def checkpoint():
    index()
    git('add','--','docs/gpt-6.1-sol-high','scripts/generation','results')
    if git('diff','--cached','--name-only'):git('commit','--quiet','-m','chore(generation): update batch progress and delivery tooling')
    print(git('push','origin','main'))
    head=git('rev-parse','HEAD');remote=git('ls-remote','origin','refs/heads/main').split()[0]
    if remote!=head:raise RuntimeError('Checkpoint push was not confirmed')
    print('Verified remote main:',head)


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('action',choices=['status','prepare','register','index','finish','refresh','notify','checkpoint'])
    parser.add_argument('args',nargs='*');args=parser.parse_args()
    if args.action=='status':
        manifest=load();print(json.dumps(dict(Counter(j['status'] for j in manifest['jobs'])),ensure_ascii=False))
        for job in manifest['jobs']:
            if job['status']!='not_started':print(job['id'],job['status'],job['thread_id'],job.get('group_message_id',''))
    else:globals()[args.action](*args.args)


if __name__=='__main__':
    lockdir=ROOT/'.work/generation';lockdir.mkdir(parents=True,exist_ok=True)
    with (lockdir/'manager.lock').open('a') as lock:
        fcntl.flock(lock,fcntl.LOCK_EX)
        main()
