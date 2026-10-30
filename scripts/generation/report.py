#!/usr/bin/env python3
"""Send the persisted batch progress to the owner's existing device group."""
from collections import Counter
import datetime
import json
from pathlib import Path
import subprocess

ROOT = Path(__file__).resolve().parents[2]
MANIFEST = ROOT / 'docs/gpt-6.1-sol-high/manifest.json'


def main():
    manifest = json.loads(MANIFEST.read_text())
    jobs = manifest['jobs']
    counts = Counter(job['status'] for job in jobs)
    active = [job['title'] for job in jobs if job['status'] in ('running', 'ready', 'queued', 'validating', 'publishing')]
    problems = [job['title'] for job in jobs if job['status'] in ('blocked', 'needs_fix')]
    now = datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%d %H:%M UTC')
    text = f'MotionSites 定时进度 · {now}\n'
    text += f"已完成上线并推送源码：{counts['complete']}/{len(jobs)}\n"
    batch_limit=manifest.get('current_batch',{}).get('through_number')
    if batch_limit:
        batch_done=sum(job['status']=='complete' for job in jobs if job['number']<=batch_limit)
        if manifest['current_batch'].get('after_verified_completion')=='complete':
            text += f'当前进度：{batch_done}/{batch_limit}；继续完成全部剩余项目，交付后进行最终核验。\n'
        else:
            text += f'本轮进度：{batch_done}/{batch_limit}；完成前 {batch_limit} 项后暂停，其余保留。\n'
    text += f"生成中：{counts['running']}；排队：{counts['queued']}；验收/发布中：{counts['ready'] + counts['validating'] + counts['publishing']}\n"
    text += f"待修复/阻塞：{counts['needs_fix'] + counts['blocked']}；未开始：{counts['not_started']}\n"
    if active:
        text += '当前项目：' + '、'.join(active[:8]) + '\n'
    if problems:
        text += '待处理：' + '、'.join(problems[:8]) + '\n'
    text += '成果索引：https://tool.luo-xd.com/motionsites-results/\n'
    queue = subprocess.run(['systemctl', 'is-active', 'motionsites-generation.service'], capture_output=True, text=True)
    text += '队列服务：' + ('运行中' if queue.returncode == 0 else '已停止，需管理会话检查') + '\n'
    text += '台账更新：' + manifest.get('updated_utc', manifest['created_utc']) + '\n'
    text += '模型：GPT-6.1 Sol High；每个设计独立新会话，总并发上限 7。'
    result = subprocess.run(['python3', '/home/opc/codex-relay/group.py', '--name',
                             'MotionSites 任务管理', 'send', text], check=True, capture_output=True, text=True)
    receipt = json.loads(result.stdout)
    state = ROOT / '.work/generation'
    state.mkdir(parents=True, exist_ok=True)
    (state / 'last-progress-message.json').write_text(json.dumps({'sent_at': now, **receipt}, ensure_ascii=False) + '\n')
    print(result.stdout.strip())


if __name__ == '__main__':
    main()
