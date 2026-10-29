#!/usr/bin/env python3
"""Cross-check delivery records against Git, HTTPS, session settings and group storage."""
import argparse
from concurrent.futures import ThreadPoolExecutor
import datetime
import hashlib
import json
from pathlib import Path
import sqlite3
import subprocess

import manage


def digest(data):
    return hashlib.sha256(data).hexdigest()


def git_blob(spec):
    command=['docker','run','--rm','-u','1000:1000','--entrypoint','git','-v','/home/opc:/home/opc',
        'alpine/git','-c',f'safe.directory={manage.ROOT}','-C',str(manage.ROOT),'cat-file','blob',spec]
    return subprocess.run(command,check=True,capture_output=True).stdout


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
        # One tree read covers every source filename, including assets needed for rebuilding.
        committed=set(manage.git('ls-tree','-r','--name-only',commit,'--',job['output_path']).splitlines())
        required=[root/'index.html',root/'PROMPT.md',root/'README.md']
        required += [p for p in root.iterdir() if p.is_file() and p.suffix in ('.json','.js','.cjs','.mjs','.ts','.tsx','.css')]
        for directory in ('src','components','public'):
            if (root/directory).is_dir():required += [p for p in (root/directory).rglob('*') if p.is_file()]
        checks['source_files_committed']=all(str(p.relative_to(manage.ROOT)) in committed for p in required)
        checks['committed_prompt_bytes']=digest(git_blob(commit+':'+job['output_path']+'/PROMPT.md'))==job['prompt_sha256']
        # Compare deployed screenshots and HTML to the exact source commit, not just to a local copy.
        for name in ('index.html','preview/desktop.png','preview/mobile.png'):
            local=(root/'dist'/name).read_bytes()
            published=public_file(job['url']+('' if name=='index.html' else name))
            committed_bytes=git_blob(commit+':'+job['output_path']+'/dist/'+name)
            checks['remote_'+name]=digest(local)==digest(published)==digest(committed_bytes)
    except Exception as error:
        proof['error']=str(error)
    proof['passed']=bool(checks) and all(checks.values()) and 'error' not in proof
    return proof


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--require-all',action='store_true',help='Fail unless all 380 designs pass')
    parser.add_argument('--ids',nargs='+',help='Audit only these completed design IDs')
    args=parser.parse_args()
    manifest=manage.load(); done=[j for j in manifest['jobs'] if j['status']=='complete']
    selected=[j for j in done if not args.ids or j['id'] in args.ids]
    remote_head=manage.git('ls-remote','origin','refs/heads/main').split()[0]
    ancestors=set(manage.git('rev-list',remote_head).splitlines())
    titles={j['id']:j['title'] for j in json.loads((manage.ROOT/'data/catalog-meta.json').read_text())}
    sessions=[j['thread_id'] for j in manifest['jobs'] if j.get('thread_id')]
    with ThreadPoolExecutor(max_workers=3) as pool:
        proofs=list(pool.map(lambda j:verify(j,titles,ancestors),selected))
    full_scope=len(selected)==len(done)==len(manifest['jobs'])==380
    all_selected_pass=bool(proofs) and all(p['passed'] for p in proofs) and len(set(sessions))==len(sessions)
    report={'checked_utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'total_designs':len(manifest['jobs']),
        'completed_at_snapshot':len(done),'audited_designs':len(proofs),'remote_main':remote_head,
        'unique_design_sessions':len(set(sessions))==len(sessions),'selected_deliveries_pass':all_selected_pass,
        'full_scope_achieved':full_scope and all_selected_pass,'deliveries':proofs}
    output=manage.ROOT/'.work/generation/latest-delivery-audit.json'
    output.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({k:v for k,v in report.items() if k!='deliveries'},ensure_ascii=False))
    for proof in proofs:
        if not proof['passed']:print(json.dumps(proof,ensure_ascii=False))
    if not all_selected_pass or args.require_all and not report['full_scope_achieved']:raise SystemExit(1)


if __name__=='__main__':main()
