# T06 official acceptance matrix

Status: **FIXED on 2026-09-01 from the official assignment**

Do not delete, weaken, or change an expectation to make the implementation pass.
All automated fixtures use synthetic data. Deployed entries are added manually and
must be real but safe to disclose.

## Card 1 — Plan

| ID | Input or action | Observable expectation |
|---|---|---|
| T06-C04 | Create a plan with `2026-09-01`–`2026-09-07` | Both dates return from the API and appear after refresh. |
| T06-C05 | Save priority `high` | The API and plan screen show `high`. |
| T06-C06 | Save success criterion `44개 검사 통과` | The exact text appears after refresh. |
| T06-C07 | Save estimated time `600` minutes | The API returns `600` with unit `minutes`. |
| T06-C08 | Change estimate from `600` to `540` | Current plan is `540`; revision history retains the prior `600` under the same plan ID. |

## Card 2 — Tasks

| ID | Input or action | Observable expectation |
|---|---|---|
| T06-C09 | Create a task linked to the plan | One task with a UUID and matching `planId` appears. |
| T06-C10 | Change the task content | The same task ID returns the changed content. |
| T06-C11 | Mark an active task complete | Status becomes `completed`. |
| T06-C12 | Reopen the completed task | Status becomes `active`. |
| T06-C13 | Delete one task | That ID is absent while other tasks remain unchanged. |
| T06-C14 | Save due date `2026-09-03` | The same date appears after refresh. |
| T06-C15 | Save priority `high` | The task API and screen show `high`. |
| T06-C16 | Save tags `backend, test` | Both tags appear after refresh. |
| T06-C17 | Save estimate `90` minutes | The API returns `90` with unit `minutes`. |
| T06-C18 | Search for a unique word | Only matching tasks are visible. |
| T06-C19 | Filter by `completed` and `high` | Every visible task satisfies both filters. |
| T06-C20 | Sort two equal-priority tasks | Screen states `priority → due date → created time → ID`; repeated queries return that order. |

## Card 3 — Do

| ID | Input or action | Observable expectation |
|---|---|---|
| T06-C23 | Save start time with Seoul offset | The same instant returns and displays in `Asia/Seoul`. |
| T06-C24 | Save end time after the start | The same instant returns and displays in `Asia/Seoul`. |
| T06-C25 | Save actual time `75` minutes | The API returns `75` with unit `minutes`. |
| T06-C26 | Save blocker `배포 환경 변수 확인` | The exact text appears on the linked task record. |
| T06-C27 | Add an execution log to a task estimated at `90` | The task estimate remains `90`. |
| T06-C21 | Send the same completion key twice | Exactly one completion event exists. |
| T06-C22 | Compare the See completed count before and after that duplicate request | The count increases by exactly one. |

## Card 4 — See

| ID | Input or action | Observable expectation |
|---|---|---|
| T06-C28 | Plan has 5 non-deleted tasks | Task count is `5`. |
| T06-C29 | 3 of those tasks are currently completed | Completed count is `3`. |
| T06-C30 | One active task is due before today and one completed task is also old | Overdue count is `1`; the completed task is not counted. |
| T06-C31 | Two logs on one task and one log on another have blocker text | Blocked-task count is `2`, not `3`. |
| T06-C32 | Estimates total 300 and logs total 260 minutes | Estimated is `300`, actual is `260`, variance is `-40`; an empty plan shows three zeroes. |
| T06-C83 | Click each aggregate card | The UI shows or navigates to the exact source task/log IDs used for it. |
| T06-C33 | Save improvement `작업을 30분 단위로 나눈다` and create the next plan | The new plan contains that exact carried-forward line. |

## Card 5 — persistence, real use, safety, submission

| ID | Input or action | Observable expectation |
|---|---|---|
| T06-C34 | Create plan, task, log, and reflection through the deployed app | All four are present in the server database and API. |
| T06-C35 | Refresh after saving a UUID, date, value, and minute unit | All four return unchanged. |
| T06-C78 | Inspect deployed data | At least one real, non-sensitive personal plan exists. |
| T06-C79 | Inspect that plan | At least five linked real, non-sensitive tasks exist. |
| T06-C80 | Inspect those tasks | At least three linked real, non-sensitive execution logs exist. |
| T06-C81 | Open See | At least one aggregate is non-zero and matches the stored records. |
| T06-C36 | Click export | One JSON file contains plans, revisions, tasks, completion events, logs, and reflections. |
| T06-C82 | Open the first screen | The exact no-login public-data warning is visible. |
| T06-C58 | Scan client bundle, deploy files, responses, console, and Git history | No secret value is present. |
| T06-C57 | Save `<script>window.__xss=1</script>` as text | It renders literally and no script executes. |
| T06-C59 | Read submission verification text | Location, ≤3 actions, pass appearance, and failure appearance are four separate lines. |
| T06-C60 | Read submission judgment text | AI work, user judgment, and rejected AI advice/reason are three separate lines. |
| T06-C01 | Open product and full-commit source URLs in a new private window | Both open without account, login, authentication, invite, password, OAuth, or CAPTCHA. |

## Coverage summary

- Fixed official IDs: 44
- Card 1: 5
- Card 2: 12
- Card 3: 7
- Card 4: 7
- Card 5: 13

