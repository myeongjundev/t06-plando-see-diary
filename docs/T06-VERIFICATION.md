# T06 확인 파일 — 완주 체크리스트와 통과 기준

과제 결과를 확인하기 위한 문서입니다. 과제 원문의 완주 체크리스트 다섯 항목과,
공식 과제에서 뽑아 고정한 통과 기준 44개가 각각 어떻게 확인됐는지 적었습니다.

| | |
|---|---|
| 결과물 | https://t06-plando-see-diary.onrender.com |
| 소스 | 제출한 고정 commit URL |
| 기준 원본 | `docs/T06-ACCEPTANCE-MATRIX.md` (이 문서가 생성되는 근거) |
| 작성 | 2026-09-02 |

**통과시키려고 기대값을 낮추지 않는 것**을 규칙으로 두었습니다. 기준은 공식 과제를
받은 2026-09-01에 확정했고 이후 문구를 바꾸지 않았습니다.

## 1. 완주 체크리스트 (과제 원문)

| 항목 | 확인 |
|---|---|
| 계획 → 실제로 한 일 → 돌아보기가 서버 데이터베이스로 이어집니다 | Neon PostgreSQL에 저장. 새로고침 뒤에도 ID·날짜·값·분 단위 유지 (T06-C34, C35) |
| 내가 실제로 세운 계획과 할 일과 실행 기록이 들어 있습니다 | 공개 앱에 실제 계획 1개, 연결된 할 일 5개, 실행 기록 3건 (T06-C78–C80) |
| 집계 숫자를 눌러 그 숫자가 나온 기록으로 갈 수 있습니다 | 일곱 집계 카드 모두 근거 할 일·실행 기록 ID를 드러냅니다 (T06-C83) |
| 아직 로그인이 없다는 안내가 첫 화면에 적혀 있습니다 | 첫 화면 상단 고정. 문구를 바꾸지 않습니다 (T06-C82) |
| 최종 소스, 스크립트 삽입, 비밀값 노출, 외부 공개 여부를 확인했습니다 | 고정 commit URL 제출, 스크립트 문자열은 글자로 렌더링, 비밀값 스캔 0건, 비로그인 접근 확인 (T06-C01, C57, C58) |

## 2. 고정 통과 기준 44개

`확인` 열은 어떻게 확인했는지입니다. 자동 검사는 실행하면 재현되고,
배포본 관찰은 공개 앱에서 직접 본 것입니다. API 수준 검사가 화면을 검증하지
못하는 항목은 그 사실을 따로 적었습니다.

`입력 또는 행동`과 `통과 기준` 두 열은 2026-09-01에 확정한 문구 그대로입니다.
옮기는 과정에서 뜻이 흔들리는 것을 막으려고 번역하지 않았습니다. 이 문서는
`docs/T06-ACCEPTANCE-MATRIX.md`를 파싱해 생성하므로 기준과 어긋날 수 없습니다.

### Card 1 — Plan

| ID | 입력 또는 행동 | 통과 기준 | 확인 |
|---|---|---|---|
| T06-C04 | Create a plan with `2026-09-01`–`2026-09-07` | Both dates return from the API and appear after refresh. | 자동 검사 · `test_t06_c04_to_c07_plan_fields_are_persisted` |
| T06-C05 | Save priority `high` | The API and plan screen show `high`. | 자동 검사 · `test_t06_c04_to_c07_plan_fields_are_persisted` (API) · 화면의 `high` 리터럴은 눈으로 확인 |
| T06-C06 | Save success criterion `44개 검사 통과` | The exact text appears after refresh. | 자동 검사 · `test_t06_c04_to_c07_plan_fields_are_persisted` |
| T06-C07 | Save estimated time `600` minutes | The API returns `600` with unit `minutes`. | 자동 검사 · `test_t06_c04_to_c07_plan_fields_are_persisted` |
| T06-C08 | Change estimate from `600` to `540` | Current plan is `540`; revision history retains the prior `600` under the same plan ID. | 자동 검사 · `test_t06_c08_edit_preserves_previous_plan_under_same_id` |

### Card 2 — Tasks

| ID | 입력 또는 행동 | 통과 기준 | 확인 |
|---|---|---|---|
| T06-C09 | Create a task linked to the plan | One task with a UUID and matching `planId` appears. | 자동 검사 · `test_t06_c09_and_c14_to_c17_create_task_fields` |
| T06-C10 | Change the task content | The same task ID returns the changed content. | 자동 검사 · `test_t06_c10_to_c13_edit_complete_reopen_and_delete` |
| T06-C11 | Mark an active task complete | Status becomes `completed`. | 자동 검사 · `test_t06_c10_to_c13_edit_complete_reopen_and_delete` |
| T06-C12 | Reopen the completed task | Status becomes `active`. | 자동 검사 · `test_t06_c10_to_c13_edit_complete_reopen_and_delete` |
| T06-C13 | Delete one task | That ID is absent while other tasks remain unchanged. | 자동 검사 · `test_t06_c10_to_c13_edit_complete_reopen_and_delete` |
| T06-C14 | Save due date `2026-09-03` | The same date appears after refresh. | 자동 검사 · `test_t06_c09_and_c14_to_c17_create_task_fields` |
| T06-C15 | Save priority `high` | The task API and screen show `high`. | 자동 검사 · `test_t06_c09_and_c14_to_c17_create_task_fields` (API) · 화면의 `high` 리터럴은 눈으로 확인 |
| T06-C16 | Save tags `backend, test` | Both tags appear after refresh. | 자동 검사 · `test_t06_c09_and_c14_to_c17_create_task_fields` |
| T06-C17 | Save estimate `90` minutes | The API returns `90` with unit `minutes`. | 자동 검사 · `test_t06_c09_and_c14_to_c17_create_task_fields` |
| T06-C18 | Search for a unique word | Only matching tasks are visible. | 자동 검사 · `test_t06_c18_search_and_c19_combined_filters` |
| T06-C19 | Filter by `completed` and `high` | Every visible task satisfies both filters. | 자동 검사 · `test_t06_c18_search_and_c19_combined_filters` |
| T06-C20 | Sort two equal-priority tasks | Screen states `priority → due date → created time → ID`; repeated queries return that order. | 자동 검사 · `test_t06_c20_sort_is_declared_and_deterministic` · 화면의 정렬 기준 문구는 눈으로 확인 |

### Card 3 — Do

| ID | 입력 또는 행동 | 통과 기준 | 확인 |
|---|---|---|---|
| T06-C23 | Save start time with Seoul offset | The same instant returns and displays in `Asia/Seoul`. | 자동 검사 · `test_t06_c23_to_c27_persist_log_without_changing_estimates` |
| T06-C24 | Save end time after the start | The same instant returns and displays in `Asia/Seoul`. | 자동 검사 · `test_t06_c23_to_c27_persist_log_without_changing_estimates` |
| T06-C25 | Save actual time `75` minutes | The API returns `75` with unit `minutes`. | 자동 검사 · `test_t06_c23_to_c27_persist_log_without_changing_estimates` |
| T06-C26 | Save blocker `배포 환경 변수 확인` | The exact text appears on the linked task record. | 자동 검사 · `test_t06_c23_to_c27_persist_log_without_changing_estimates` |
| T06-C27 | Add an execution log to a task estimated at `90` | The task estimate remains `90`. | 자동 검사 · `test_t06_c23_to_c27_persist_log_without_changing_estimates` |
| T06-C21 | Send the same completion key twice | Exactly one completion event exists. | 자동 검사 · `test_t06_c21_c22_duplicate_completion_and_see_count` · `test_concurrent_duplicate_requests` · `test_database_rejects_duplicate_completion_key` |
| T06-C22 | Compare the See completed count before and after that duplicate request | The count increases by exactly one. | 자동 검사 · `test_t06_c21_c22_duplicate_completion_and_see_count` · `test_concurrent_duplicate_requests` · `test_database_rejects_duplicate_completion_key` |

### Card 4 — See

| ID | 입력 또는 행동 | 통과 기준 | 확인 |
|---|---|---|---|
| T06-C28 | Plan has 5 non-deleted tasks | Task count is `5`. | 자동 검사 · `test_t06_c28_to_c32_and_c83_exact_metrics_and_sources` |
| T06-C29 | 3 of those tasks are currently completed | Completed count is `3`. | 자동 검사 · `test_t06_c28_to_c32_and_c83_exact_metrics_and_sources` |
| T06-C30 | One active task is due before today and one completed task is also old | Overdue count is `1`; the completed task is not counted. | 자동 검사 · `test_t06_c28_to_c32_and_c83_exact_metrics_and_sources` · `test_seoul_midnight_overdue_boundary` |
| T06-C31 | Two logs on one task and one log on another have blocker text | Blocked-task count is `2`, not `3`. | 자동 검사 · `test_t06_c28_to_c32_and_c83_exact_metrics_and_sources` |
| T06-C32 | Estimates total 300 and logs total 260 minutes | Estimated is `300`, actual is `260`, variance is `-40`; an empty plan shows three zeroes. | 자동 검사 · `test_t06_c28_to_c32_and_c83_exact_metrics_and_sources` |
| T06-C83 | Click each aggregate card | The UI shows or navigates to the exact source task/log IDs used for it. | 자동 검사 · `test_t06_c28_to_c32_and_c83_exact_metrics_and_sources` (근거 ID) · 카드 클릭 동작은 눈으로 확인 |
| T06-C33 | Save improvement `작업을 30분 단위로 나눈다` and create the next plan | The new plan contains that exact carried-forward line. | 자동 검사 · `test_t06_c33_reflection_carries_exact_line_and_retries_reuse_plan` |

### Card 5 — persistence, real use, safety, submission

| ID | 입력 또는 행동 | 통과 기준 | 확인 |
|---|---|---|---|
| T06-C34 | Create plan, task, log, and reflection through the deployed app | All four are present in the server database and API. | 배포본 관찰 · 배포본에 저장 후 새로고침. Neon PostgreSQL에 남고 ID·날짜·값·분 단위가 그대로 |
| T06-C35 | Refresh after saving a UUID, date, value, and minute unit | All four return unchanged. | 배포본 관찰 · 배포본에 저장 후 새로고침. Neon PostgreSQL에 남고 ID·날짜·값·분 단위가 그대로 |
| T06-C78 | Inspect deployed data | At least one real, non-sensitive personal plan exists. | 배포본 관찰 · 공개 앱에 실제 계획 존재 (`/api/plans`) |
| T06-C79 | Inspect that plan | At least five linked real, non-sensitive tasks exist. | 배포본 관찰 · 그 계획에 연결된 할 일 5개 (`/api/plans/<id>/see` taskCount 5) |
| T06-C80 | Inspect those tasks | At least three linked real, non-sensitive execution logs exist. | 배포본 관찰 · 연결된 실행 기록 3건 (`records.executions` 3) |
| T06-C81 | Open See | At least one aggregate is non-zero and matches the stored records. | 배포본 관찰 · See 집계 `[5, 3, 0, 1, 600, 390, -210]` — 0이 아니고 근거 기록과 일치 |
| T06-C36 | Click export | One JSON file contains plans, revisions, tasks, completion events, logs, and reflections. | 자동 검사 · `test_t06_c36_complete_export_retains_deleted_history_and_links` · 배포본에서 실제 내려받아 대조 |
| T06-C82 | Open the first screen | The exact no-login public-data warning is visible. | 배포본 화면 · 첫 화면 상단 고정. 배포 번들에서 문구 존재 확인 |
| T06-C58 | Scan client bundle, deploy files, responses, console, and Git history | No secret value is present. | 도구 스캔 · `backend/scripts/audit_secrets.py` — 워킹트리·프런트 빌드·Git 이력 전체, 0건 |
| T06-C57 | Save `<script>window.__xss=1</script>` as text | It renders literally and no script executes. | 배포본 관찰 · `<script>window.__xss=1</script>`를 저장 → 글자 그대로 렌더링, 스크립트 미실행. 확인 후 삭제 |
| T06-C59 | Read submission verification text | Location, ≤3 actions, pass appearance, and failure appearance are four separate lines. | 제출문 · 본 문서와 `docs/SUBMISSION.md`의 확인 4줄 |
| T06-C60 | Read submission judgment text | AI work, user judgment, and rejected AI advice/reason are three separate lines. | 제출문 · `docs/SUBMISSION.md`의 판단 3줄 |
| T06-C01 | Open product and full-commit source URLs in a new private window | Both open without account, login, authentication, invite, password, OAuth, or CAPTCHA. | 배포본 관찰 · 제품·소스 URL 모두 비로그인 HTTP 200. 시크릿 창에서도 확인 |

## 3. 자동 검사 실행 결과

```
backend/.venv/Scripts/python.exe -m pytest backend/tests --cov=backend/app
→ 53 passed,  커버리지 92%

npm --prefix frontend run build
→ 통과 (tsc + vite)

backend/.venv/Scripts/python.exe backend/scripts/audit_secrets.py
→ 워킹트리·프런트 빌드·Git 이력 전체 스캔, 0건
```

위 표에 이름이 나온 검사 외에, ID에 직접 대응하지는 않지만 같은 규칙을 지키는
검사가 더 있습니다. 동시 요청에서의 완료 유일성, 잘못된 입력의 원자성,
서울 자정 경계, 빈 집계, 마이그레이션 값 보존과 반복 안전성, 운영 설정의
PostgreSQL 강제와 CSP, 호스팅 프로브가 데이터베이스를 깨우지 않는 것 등입니다.

## 4. 확인 갈래 요약

| 갈래 | 항목 수 |
|---|---|
| 자동 검사 | 32 |
| 배포본 관찰 | 8 |
| 배포본 화면 | 1 |
| 도구 스캔 | 1 |
| 제출문 | 2 |
| **합계** | **44** |

## 5. 직접 확인하는 방법

공개 앱에서 세 단계로 핵심을 확인할 수 있습니다.

1. https://t06-plando-see-diary.onrender.com 을 열고 `03 See 회고`로 이동
2. `실제 시간` 카드를 눌러 근거 실행 기록과 ID를 확인
3. `전체 JSON 내려받기`로 같은 값이 저장돼 있는지 대조

무료 호스팅이라 한동안 접속이 없으면 첫 응답이 30초쯤 걸릴 수 있습니다.
