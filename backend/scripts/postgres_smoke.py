"""Synthetic, localhost-only HTTP check. Run once, restart web, then --verify."""
import argparse
import json
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from urllib.request import Request, urlopen

from jsonschema import Draft202012Validator, FormatChecker

ROOT = Path(__file__).resolve().parents[2]
STATE = ROOT / 'tmp/postgres-smoke.json'
BASE = 'http://127.0.0.1:8000'


def api(path, body=None, method=None):
    request = Request(BASE + '/api' + path, data=None if body is None else json.dumps(body).encode(),
                      headers={'Content-Type': 'application/json'}, method=method)
    with urlopen(request, timeout=20) as response:
        return json.load(response)


def snapshot():
    data = api('/export')
    schema = json.loads((ROOT / 'contracts/pds-schema-v2.json').read_text(encoding='utf-8'))
    Draft202012Validator(schema, format_checker=FormatChecker()).validate(data)
    del data['exportedAt']
    return data


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--verify', action='store_true')
    args = parser.parse_args()
    assert api('/health')['database'] == 'postgresql'
    if args.verify:
        assert snapshot() == json.loads(STATE.read_text(encoding='utf-8'))
        print('PASS: all IDs, dates, values, units and links survived the server restart.')
        return
    plan_body = {'title': '합성 PostgreSQL 검증', 'startDate': '2026-09-01', 'endDate': '2026-09-07',
                 'priority': 'high', 'successCriterion': '합성 검증 통과', 'estimatedMinutes': 300}
    plan = api('/plans', plan_body)['plan']
    api('/plans/' + plan['id'], {**plan_body, 'title': '합성 PostgreSQL 검증 · 수정'}, 'PATCH')
    tasks = [api(f"/plans/{plan['id']}/tasks", {'content': '<script>window.__xss=1</script>' if i == 0 else f'합성 작업 {i}',
             'dueDate': '2026-09-01', 'priority': 'high', 'estimatedMinutes': 60, 'tags': ['synthetic']})['task'] for i in range(5)]
    with ThreadPoolExecutor(max_workers=4) as pool:
        events = list(pool.map(lambda _: api(f"/tasks/{tasks[0]['id']}/complete", {'idempotencyKey': 'postgres-smoke-key'}), range(4)))
    assert len({json.dumps(event['completionEvent'], sort_keys=True) for event in events}) == 1
    for task in tasks[:3]:
        api(f"/tasks/{task['id']}/executions", {'startedAt': '2026-09-01T13:00:00+09:00',
            'endedAt': '2026-09-01T14:00:00+09:00', 'actualMinutes': 50, 'blockerReason': '합성 장애 사유'})
    reflection = api(f"/plans/{plan['id']}/reflections", {'periodStart': '2026-09-01',
                     'periodEnd': '2026-09-07', 'improvement': '합성 개선 한 줄'})['reflection']
    with ThreadPoolExecutor(max_workers=4) as pool:
        plans = list(pool.map(lambda _: api(f"/reflections/{reflection['id']}/next-plan", {**plan_body, 'title': '합성 다음 계획'}), range(4)))
    assert len({p['plan']['id'] for p in plans}) == 1
    see = api(f"/plans/{plan['id']}/see")
    assert [see[k] for k in ['taskCount', 'completedCount', 'blockedTaskCount', 'estimatedMinutes', 'actualMinutes', 'varianceMinutes']] == [5, 1, 3, 300, 150, -150]
    STATE.parent.mkdir(exist_ok=True)
    STATE.write_text(json.dumps(snapshot(), ensure_ascii=False), encoding='utf-8')
    print('PASS: PostgreSQL save, revision, 4-way completion/next-plan races, See and full JSON schema.')
    print('Restart web and rerun with --verify. Synthetic snapshot is ignored under tmp/.')


if __name__ == '__main__':
    main()
