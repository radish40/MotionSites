#!/usr/bin/env python3
"""Bounded durable queue: one fresh Codex session per design, never reuse for another."""
import contextlib
import fcntl
import json
import os
from pathlib import Path
import sqlite3
import subprocess
import time
import traceback

import manage

ROOT=manage.ROOT
RUNTIME=ROOT/'.work/generation'
MAX_WORKERS=5  # Five queue workers, one reserved repair slot, and the management conversation: at most seven.
BATCH_STOP_NUMBER=380  # User resumed the remaining designs after the verified 200-item pause.
OWNER_THREAD='01a185a9-9c17-7bf1-813d-c0d86c818e53'


@contextlib.contextmanager
def state_lock():
    with (RUNTIME/'manager.lock').open('a') as lock:
        fcntl.flock(lock,fcntl.LOCK_EX)
        yield


def alive(pid):
    if not pid:return False
    try:
        data=Path(f'/proc/{pid}/stat').read_text()
        return data.split(') ',1)[1].split()[0]!='Z'
    except FileNotFoundError:return False


def event_lines(path):
    if not path.exists():return []
    events=[]
    for line in path.read_text(errors='replace').splitlines():
        try:events.append(json.loads(line))
        except json.JSONDecodeError:pass  # A live writer may have an incomplete last line.
    return events


def synchronize():
    active=[]
    db=sqlite3.connect('file:/home/opc/.codex/state_5.sqlite?mode=ro',uri=True)
    with state_lock():
        manifest=manage.load()
        for job in manifest['jobs']:
            if job['status'] in ('not_started','complete'):continue
            events=event_lines(RUNTIME/job['id']/'events.jsonl')
            if not job.get('thread_id'):
                start=next((e for e in events if e.get('type')=='thread.started'),None)
                if start:job['thread_id']=start['thread_id']
            if job['status']=='queued' and not alive(job.get('process_id')):
                continue  # A scheduled same-session retry must not consume its old terminal event.
            terminal=False
            if job.get('thread_id'):
                row=db.execute('SELECT model,reasoning_effort,rollout_path FROM threads WHERE id=?',(job['thread_id'],)).fetchone()
                if row:
                    job['actual_session_config']={'model':row[0],'reasoning_effort':row[1]}
                    if tuple(row[:2])!=('gpt-6.1-sol','high'):
                        job['status']='blocked';job['notes']='Unexpected actual model configuration';continue
                    history=event_lines(Path(row[2]))
                    turns=[e['payload']['type'] for e in history if e.get('type')=='event_msg' and e.get('payload',{}).get('type') in ('task_started','task_complete','turn_aborted')]
                    terminal=bool(turns and turns[-1] in ('task_complete','turn_aborted'))
            # Exec logs and a live PID are independent evidence if session transport is unavailable.
            if events and events[-1].get('type') in ('turn.completed','turn.failed'):terminal=True
            process_live=alive(job.get('process_id'))
            if process_live:
                active.append(job['id'])
                terminal=False
            elif job.get('process_id') and not process_live:
                terminal=True
            elif not terminal and job['status']=='running':
                # An MCP session can run without a CLI PID. Keep the slot until a terminal event is observed.
                active.append(job['id'])
            if terminal:
                job['worker_state']='terminal'
                if job['status'] in ('running','queued'):
                    result_path=ROOT/job['output_path']/'result.json'
                    if result_path.exists():
                        result=json.loads(result_path.read_text())
                        job['status']='ready' if result.get('status')=='ready' else 'blocked'
                        if job['status']=='blocked':job['notes']=json.dumps(result.get('asset_issues',result.get('notes',[])),ensure_ascii=False)[:3000]
                    else:
                        job['status']='needs_fix';job['notes']='Session ended without result.json; inspect existing session before retrying'
        manage.save(manifest)
    db.close()
    return active


def launch(ident, resume=False):
    with state_lock():
        if manage.job_for(manage.load(),ident)['number']>BATCH_STOP_NUMBER:
            raise RuntimeError('Design is beyond the user-requested batch limit')
        if not resume:manage.prepare(ident)
        manifest=manage.load();job=manage.job_for(manifest,ident)
        work=ROOT/job['output_path'];logs=RUNTIME/ident;logs.mkdir(exist_ok=True)
        # Refuse to start over if a previous process already emitted a session id.
        if not resume and (logs/'events.jsonl').exists() and (logs/'events.jsonl').stat().st_size:
            raise RuntimeError('Existing launch evidence; inspect it instead of duplicating the session')
        prompt=(f'User authorized a fresh isolated session for only {job["title"]}. '
            'Read TASK.md and PROMPT.md fully in your current directory; implement only this design. '
            'Do not read other designs, spawn agents, create other sessions, deploy, push, or send messages. '
            'Write only inside this project. Complete the real build, browser checks, screenshots, README.md and result.json. '
            'Use the exact prompt requirements, including its stack and assets. Model gpt-6.1-sol, reasoning high.')
        command=['/home/opc/.local/bin/codex','--no-daemon','-a','never','exec','-s','danger-full-access',
            '--skip-git-repo-check','-C',str(work),'--model','gpt-6.1-sol','-c','model_reasoning_effort="high"',
            '-c','features.enable_request_compression=false',
            '-c','model_providers.OpenAI.http_headers={"Accept-Encoding"="identity"}',
            '--json','-o',str(logs/'final.txt')]
        if resume:
            command+=['resume',job['thread_id'],'Continue only this original design session after its previous turn ended. Inspect your existing files and finish the remaining work. '+prompt]
        else:command.append(prompt)
        with (logs/'events.jsonl').open('a') as stdout,(logs/'stderr.log').open('a') as stderr:
            process=subprocess.Popen(command,stdin=subprocess.DEVNULL,stdout=stdout,stderr=stderr,start_new_session=True)
        job.update(status='running',process_id=process.pid,launch_method='isolated_codex_exec',started_utc=manage.datetime.datetime.now(manage.datetime.timezone.utc).isoformat())
        job['worker_state']='running'
        manage.save(manifest)
        print('Launched',ident,'pid',process.pid,flush=True)


def owner_active():
    db=sqlite3.connect('file:/home/opc/.codex/goals_1.sqlite?mode=ro',uri=True)
    row=db.execute('SELECT status FROM thread_goals WHERE thread_id=?',(OWNER_THREAD,)).fetchone();db.close()
    return row is not None and row[0]=='active'


def cycle():
    active=synchronize()
    manifest=manage.load()
    # Fill only confirmed available slots; no overlapping generation for one design.
    for job in manifest['jobs']:
        if job['number']>BATCH_STOP_NUMBER:continue
        if len(active)>=MAX_WORKERS:break
        if job['status']=='queued' and job.get('thread_id'):
            launch(job['id'],resume=True);active.append(job['id']);continue
        if job['status']=='not_started' or (job['status']=='queued' and not job.get('thread_id') and not job.get('process_id')):
            launch(job['id']);active.append(job['id'])
    manifest=manage.load()
    for job in manifest['jobs']:
        if job['number']>BATCH_STOP_NUMBER:continue
        if job['status'] in ('ready','validating','publishing'):
            if job.get('delivery_hold'):continue
            logs=RUNTIME/job['id'];logs.mkdir(exist_ok=True)
            # Persistent delivery failures require investigation, not an unbounded retry loop.
            if job.get('delivery_failures',0)>=3:continue
            with (logs/'delivery.log').open('a') as log:
                result=subprocess.run(['python3','-u',str(ROOT/'scripts/generation/manage.py'),'finish',job['id']],stdout=log,stderr=subprocess.STDOUT)
            if result.returncode:
                with state_lock():
                    current=manage.load();record=manage.job_for(current,job['id'])
                    record['delivery_failures']=record.get('delivery_failures',0)+1
                    record['notes']='Delivery failed; inspect private delivery.log and public browser report'
                    manage.save(current)
                print('Delivery needs investigation:',job['id'],flush=True)
            else:print('Delivered:',job['id'],flush=True)
        elif job['status']=='complete' and not job.get('group_message_id'):
            subprocess.run(['python3',str(ROOT/'scripts/generation/manage.py'),'notify',job['id']],check=True)
    # Persist public progress after this batch; source delivery already pushes each completed design.
    subprocess.run(['python3',str(ROOT/'scripts/generation/manage.py'),'checkpoint'],check=True)
    print('Cycle complete; active workers:',active,flush=True)


def main():
    RUNTIME.mkdir(parents=True,exist_ok=True)
    if not os.environ.get('OPENAI_API_KEY'):
        raise RuntimeError('Provider credential missing; refuse to consume queue slots')
    with (RUNTIME/'dispatcher.lock').open('a') as lock:
        fcntl.flock(lock,fcntl.LOCK_EX|fcntl.LOCK_NB)
        while owner_active():
            try:cycle()
            except Exception:traceback.print_exc()
            batch=[job for job in manage.load()['jobs'] if job['number']<=BATCH_STOP_NUMBER]
            if len(batch)==BATCH_STOP_NUMBER and all(job['status']=='complete' and job.get('group_message_id') for job in batch):
                print(f'First {BATCH_STOP_NUMBER} deliveries finished; queue stopped for final management verification.',flush=True)
                return
            time.sleep(45)
        print('Owner goal is no longer active; no additional jobs will be launched.',flush=True)


if __name__=='__main__':main()
