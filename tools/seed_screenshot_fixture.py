# -*- coding: utf-8 -*-
"""README 스크린샷용 합성 자료를 로컬 백엔드에 심는다.

    python tools/seed_screenshot_fixture.py

빈 로컬 데이터베이스에 대고 돌린다. 이미 자료가 있으면 계획이 덧붙으므로,
먼저 backend/instance/t06.db를 지우고 `flask db upgrade`로 새로 만든다.

화면 스크린샷은 AGENTS.md 3번에 따라 합성 자료만 담아야 하므로 운영 DB가 아니라
로컬 SQLite를 대상으로 돌린다. 집계가 날짜에 따라 흔들리지 않도록 마감일을 «오늘»에서
상대적으로 잡는다 — 지연은 오늘보다 이른 미완료 할 일에서만 나온다(D-008, 서울 기준).

목표 집계: 할 일 5 · 완료 3 · 지연 1 · 막힘 2 · 예상 300분 · 실제 260분 · 차이 -40분
"""
import json
import urllib.request
import urllib.error
from datetime import date, timedelta

BASE = "http://127.0.0.1:5055"


def call(method, path, payload=None):
    data = json.dumps(payload).encode("utf-8") if payload is not None else None
    req = urllib.request.Request(
        BASE + path, data=data,
        headers={"Content-Type": "application/json"}, method=method)
    try:
        with urllib.request.urlopen(req) as r:
            return json.load(r) if r.status != 204 else None
    except urllib.error.HTTPError as e:
        raise SystemExit("%s %s -> %s %s" % (method, path, e.code, e.read().decode("utf-8", "replace")))


# 서울 기준 오늘. 로컬이 UTC+09가 아닐 수 있으므로 백엔드가 아니라 여기서 못박지 않고,
# 화면과 같은 규칙(자정 UTC 문자열 연산)으로 만든다.
TODAY = date.today()

d = lambda n: (TODAY + timedelta(days=n)).isoformat()
stamp = lambda n, h, m: "%sT%02d:%02d:00+09:00" % (d(n), h, m)

PLAN = {
    "title": "합성 · 이번 주 학습 계획",
    "startDate": d(-2), "endDate": d(4),
    "priority": "high",
    "successCriterion": "회고 한 줄을 다음 계획으로 넘긴다",
    "estimatedMinutes": 320,
    "carriedImprovement": None,
}

# (내용, 마감 오프셋, 우선순위, 태그, 예상분, 완료?, [(시작h, 분, 막힌 이유)])
TASKS = [
    ("SQLAlchemy 세션 수명 정리", -2, "high", ["backend", "study"], 60, True,
     [(9, 55, "")]),
    ("멱등 키 유니크 제약 실험", -1, "high", ["backend", "test"], 60, True,
     [(14, 70, "재현 조건을 못 잡아 30분 헤맴")]),
    ("집계 쿼리 조인 정리", 0, "medium", ["backend"], 60, True,
     [(10, 45, "")]),
    ("서울 시간대 경계 검토", -1, "medium", ["backend", "study"], 60, False,
     [(16, 50, "자정 경계 예제를 다시 만들어야 했다")]),
    ("회고 문장 다듬기", 2, "low", ["writing"], 60, False,
     [(20, 40, "")]),
]

print("계획 생성…")
plan = call("POST", "/api/plans", PLAN)["plan"]
pid = plan["id"]

for content, due, priority, tags, est, done, logs in TASKS:
    task = call("POST", "/api/plans/%s/tasks" % pid, {
        "content": content, "dueDate": d(due), "priority": priority,
        "tags": tags, "estimatedMinutes": est,
    })["task"]
    tid = task["id"]
    for hour, minutes, blocker in logs:
        call("POST", "/api/tasks/%s/executions" % tid, {
            "startedAt": stamp(due, hour, 0),
            "endedAt": stamp(due, hour + 1, 30),
            "actualMinutes": minutes,
            "blockerReason": blocker,
        })
    if done:
        call("POST", "/api/tasks/%s/complete" % tid, {"idempotencyKey": "seed-%s" % tid})
    print("  할 일:", content, "완료" if done else "진행 중")

# 다른 계획 몇 개 — 「다른 계획 N개」 목록이 비어 보이지 않도록.
for title, s, e, pr, crit, est in [
    ("합성 · 지난 주 학습 계획", -9, -3, "medium", "밀린 항목을 이번 주로 넘긴다", 240),
    ("합성 · 배포 점검", -1, 6, "low", "무중단으로 마이그레이션이 돈다", 120),
    ("합성 · 다음 주 준비", 5, 11, "high", "회고 개선점을 계획에 담는다", 300),
]:
    call("POST", "/api/plans", {
        "title": title, "startDate": d(s), "endDate": d(e), "priority": pr,
        "successCriterion": crit, "estimatedMinutes": est, "carriedImprovement": None,
    })
    print("  다른 계획:", title)

summary = call("GET", "/api/plans/%s/see" % pid)
keys = ["taskCount", "completedCount", "overdueCount", "blockedTaskCount",
        "estimatedMinutes", "actualMinutes", "varianceMinutes"]
print("\n집계:", [summary[k] for k in keys])
print("계획 ID:", pid)
