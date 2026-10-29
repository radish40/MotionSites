#!/usr/bin/env python3
"""Cross-check delivery records against Git, HTTPS, session settings and group storage."""
import argparse
from concurrent.futures import ThreadPoolExecutor
import datetime
import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path
import sqlite3
import subprocess

import manage


class IndexCards(HTMLParser):
    def __init__(self):
        super().__init__();self.cards=[];self.current=None;self.heading=False

    def handle_starttag(self,tag,attrs):
        attrs=dict(attrs)
        if tag=='article':self.current={'title':'','href':None,'preview':None}
        elif self.current is not None:
            if tag=='h2':self.heading=True
            if tag=='a' and self.current['href'] is None:self.current['href']=attrs.get('href')
            if tag=='img':self.current['preview']=attrs.get('src')

    def handle_endtag(self,tag):
        if tag=='h2':self.heading=False
        if tag=='article' and self.current is not None:self.cards.append(self.current);self.current=None

    def handle_data(self,data):
        if self.heading and self.current is not None:self.current['title']+=data


def digest(data):
    return hashlib.sha256(data).hexdigest()


def object_id(data):
    return hashlib.sha1(b'blob '+str(len(data)).encode()+b'\0'+data).hexdigest()


def public_file(url):
    return subprocess.run(['curl','--fail','--silent','--show-error','--retry','1','--max-time','30',url],
                          check=True,capture_output=True).stdout


def verify(job, titles, ancestors):
    proof={'id':job['id'],'title':job['title'],'source_commit':job.get('source_commit'),
           'thread_id':job.get('thread_id'),'group_message_id':job.get('group_message_id'),'checks':{}}
    checks=proof['checks']; root=manage.ROOT/job['output_path']; commit=job['source_commit']
    try:
        checks['exact_title']=job['title']==titles[job['id']]
        checks['prompt_snapshot']=digest((root/'PROMPT.md').read_bytes())==job['prompt_sha256']
        checks['source_is_on_remote_main']=commit in ancestors
        db=sqlite3.connect('file:/home/opc/.codex/state_5.sqlite?mode=ro',uri=True)
        checks['actual_model_settings']=db.execute('SELECT model,reasoning_effort FROM threads WHERE id=?',
            (job['thread_id'],)).fetchone()==('gpt-6.1-sol','high')
        checks['no_delegated_contexts']=db.execute('SELECT COUNT(*) FROM thread_spawn_edges WHERE parent_thread_id=?',
            (job['thread_id'],)).fetchone()[0]==0
        db.close()
        group=sqlite3.connect('file:/home/opc/codex-relay/data/relay.sqlite3?mode=ro',uri=True)
        message=group.execute('SELECT text,request_id FROM group_messages WHERE id=?',(job['group_message_id'],)).fetchone()
        checks['actual_group_message']=bool(message and job['title'] in message[0] and job['url'] in message[0]
            and message[1]=='motionsites-complete-'+job['id'])
        group.close()
        report=json.loads((root/'screenshots/live-check.json').read_text())
        checks['desktop_mobile_browser_report']=report['passed'] and {r['viewport'] for r in report['results']}=={'desktop','mobile'}
        runtime=job.get('runtime')
        if runtime:
            state=json.loads(subprocess.run(['docker','inspect',runtime['container']],
                check=True,capture_output=True,text=True).stdout)[0]
            checks['runtime_healthy']=state['State']['Running'] and state['State'].get('Health',{}).get('Status')=='healthy'
            checks['runtime_restart_policy']=state['HostConfig']['RestartPolicy']['Name']=='unless-stopped'
            checks['runtime_image']=state['Config']['Image']==runtime['image']
            checks['runtime_production_environment']='NODE_ENV=production' in state['Config']['Env']
            if runtime.get('command'):checks['runtime_command']=state['Config']['Cmd']==runtime['command']
            server_file=runtime.get('server_file','dist/server.cjs')
            bundled=subprocess.run(['docker','exec',runtime['container'],'node','-e',
                "process.stdout.write(require('node:crypto').createHash('sha256').update(require('node:fs').readFileSync(process.argv[1])).digest('hex'))",server_file],
                check=True,capture_output=True,text=True).stdout
            checks['runtime_matches_build']=bundled==digest((root/server_file).read_bytes())
            for number,query in enumerate(runtime.get('api_queries',['']) if runtime.get('api_path') else []):
                payload=json.loads(public_file('https://tool.luo-xd.com'+runtime['api_path']+query))
                checks[f'runtime_api_{number}']=payload.get('success') is True and payload.get('url','').startswith('https://') and '.mp4' in payload['url']
        # One tree read covers every source filename, including assets needed for rebuilding.
        committed={}
        for record in manage.git('ls-tree','-r','-z',commit,'--',job['output_path']).split('\0'):
            if record:
                header,name=record.split('\t',1)
                committed[name]=header.split()[2]
        reconstructed=set()
        chunk_manifest=root/'asset-chunks/manifest.json'
        if chunk_manifest.is_file():
            package=json.loads(chunk_manifest.read_text())
            valid=package.get('version')==1 and bool(package.get('assets'))
            for asset in package.get('assets',[]):
                original=root/asset['path']
                if not original.resolve().is_relative_to((root/'public').resolve()):
                    raise ValueError('Reconstructed asset outside project public directory')
                combined=hashlib.sha256();total=0
                valid=valid and bool(asset.get('chunks'))
                for chunk in asset.get('chunks',[]):
                    part=root/chunk['path']
                    if not part.resolve().is_relative_to((root/'asset-chunks').resolve()):
                        raise ValueError('Source chunk outside project asset-chunks directory')
                    data=part.read_bytes();combined.update(data);total+=len(data)
                    valid=valid and len(data)==chunk['bytes'] and len(data)<50*1024*1024 and digest(data)==chunk['sha256']
                    valid=valid and object_id(data)==committed.get(str(part.relative_to(manage.ROOT)))
                valid=valid and total==asset['bytes'] and combined.hexdigest()==asset['sha256']
                valid=valid and original.stat().st_size==total and digest(original.read_bytes())==asset['sha256']
                reconstructed.add(original)
            checks['lossless_assets_reproducible_from_committed_chunks']=valid
        required=[root/'PROMPT.md',root/'README.md']
        required += [p for p in root.iterdir() if p.is_file() and p.suffix in ('.html','.json','.js','.jsx','.cjs','.mjs','.ts','.tsx','.css')]
        for directory in ('src','app','pages','components','public','assets','asset-chunks','scripts','lib','hooks','styles'):
            if (root/directory).is_dir():required += [p for p in (root/directory).rglob('*') if p.is_file()
                and not any(part in ('venv','.venv','__pycache__') for part in p.relative_to(root).parts)
                and p.relative_to(root).parts[:3]!=('scripts','repair','vendor')
                and p.suffix not in ('.whl','.pyc')]
        # These exact originals are rebuilt from fully committed, hash-verified chunks.
        required=[p for p in required if p not in reconstructed]
        checks['source_files_committed']=all(str(p.relative_to(manage.ROOT)) in committed for p in required)
        checks['committed_source_bytes']=all(object_id(p.read_bytes())==committed.get(str(p.relative_to(manage.ROOT))) for p in required)
        # Source must be committed. Build artifacts may legitimately be ignored by a project.
        # Screenshots are committed independently of dist/ and must match their public copies.
        for name in ('index.html','preview/desktop.png','preview/mobile.png'):
            local=(root/'dist'/name).read_bytes()
            published=public_file(job['url']+('' if name=='index.html' else name))
            checks['remote_'+name]=digest(local)==digest(published)
            if name!='index.html':
                path=job['output_path']+'/screenshots/'+name.split('/')[-1]
                checks['committed_'+name]=object_id(published)==committed.get(path)
            elif job['output_path']+'/dist/index.html' in committed:
                checks['committed_dist_html']=object_id(published)==committed[job['output_path']+'/dist/index.html']
    except Exception as error:
        proof['error']=str(error)
    proof['passed']=bool(checks) and all(checks.values()) and 'error' not in proof
    return proof


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--require-all',action='store_true',help='Fail unless all 380 designs pass')
    parser.add_argument('--ids',nargs='+',help='Audit only these completed design IDs')
    parser.add_argument('--through',type=int,help='Require delivery of the first N designs and no work beyond that boundary')
    args=parser.parse_args()
    if args.through is not None and (not 1<=args.through<=380 or args.ids):
        parser.error('--through requires 1..380 and cannot be combined with --ids')
    manifest=manage.load(); done=[j for j in manifest['jobs'] if j['status']=='complete']
    if args.ids:
        missing=set(args.ids)-{j['id'] for j in done}
        if missing:parser.error('Requested designs are not completed: '+', '.join(sorted(missing)))
    selected=[j for j in done if (not args.ids or j['id'] in args.ids) and (args.through is None or j['number']<=args.through)]
    remote_head=manage.git('ls-remote','origin','refs/heads/main').split()[0]
    ancestors=set(manage.git('rev-list',remote_head).splitlines())
    titles={j['id']:j['title'] for j in json.loads((manage.ROOT/'data/catalog-meta.json').read_text())}
    sessions=[j['thread_id'] for j in manifest['jobs'] if j.get('thread_id')]
    with ThreadPoolExecutor(max_workers=3) as pool:
        proofs=list(pool.map(lambda j:verify(j,titles,ancestors),selected))
    cards=IndexCards();cards.feed(public_file(manage.BASE).decode())
    indexed={card['href']:card for card in cards.cards}
    index_matches=all(indexed.get(j['id']+'/')=={'title':j['title'],'href':j['id']+'/',
        'preview':j['id']+'/preview/desktop.png'} for j in selected)
    full_scope=len(selected)==len(done)==len(manifest['jobs'])==380
    all_selected_pass=bool(proofs) and all(p['passed'] for p in proofs) and len(set(sessions))==len(sessions) and index_matches
    batch_scope=None
    if args.through is not None:
        batch_scope=(all_selected_pass and len(selected)==len(done)==len(cards.cards)==args.through
            and {j['number'] for j in selected}==set(range(1,args.through+1))
            and all(j['status']=='not_started' for j in manifest['jobs'] if j['number']>args.through))
    report={'checked_utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'total_designs':len(manifest['jobs']),
        'completed_at_snapshot':len(done),'audited_designs':len(proofs),'remote_main':remote_head,
        'unique_design_sessions':len(set(sessions))==len(sessions),'selected_deliveries_pass':all_selected_pass,
        'public_index_matches_names_links_and_previews':index_matches,'public_index_cards':len(cards.cards),
        'full_scope_achieved':full_scope and all_selected_pass,
        'requested_batch_limit':args.through,'requested_batch_scope_achieved':batch_scope,'deliveries':proofs}
    output=manage.ROOT/'.work/generation/latest-delivery-audit.json'
    output.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({k:v for k,v in report.items() if k!='deliveries'},ensure_ascii=False))
    for proof in proofs:
        if not proof['passed']:print(json.dumps(proof,ensure_ascii=False))
    if not all_selected_pass or args.require_all and not report['full_scope_achieved'] or args.through is not None and not batch_scope:raise SystemExit(1)


if __name__=='__main__':main()
