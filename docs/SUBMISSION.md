# T06 submission — ready

Product URL: https://t06-plando-see-diary.onrender.com

Source URL: the full-hash commit URL for the commit that `t06-submission` tags,
`https://github.com/myeongjundev/t06-plando-see-diary/commit/<40-hex>`.

The submission form requires a fixed HTTPS URL containing a 40- or 64-character
lowercase full commit hash, and explicitly rejects a branch or a repository landing
page. A tag name does not satisfy that, so the hash form is what gets submitted; the
`t06-submission` tag is kept as a readable pointer to the same commit and is what the
rest of these documents refer to. The hash itself is deliberately not written into
this file: it would change the moment this file is edited.

The tag tracks the deployed code: Render builds `main` automatically, and the tag is
moved onto the commit Render is serving. At the time of writing that build emits
`index-MZVl8FZ4.js` and `index-CGU0rIJc.css`, which is what the public app returns.

This is the published app including shared plan selection, Plan/Do/See navigation,
saved plans first, mobile input fixes, bundled fonts, signed variance with explicit
evidence counts, a light/dark toggle, an estimate-vs-actual gauge on the selected
plan card and a step bar that marks the section being read. It also carries the
2026-09-02 pass: the plan list is sorted rather than filtered by priority, both task
lists and the plan list share one 19rem ceiling, completed rows are filled instead of
struck through, every date, time and dropdown control is drawn from the token layer
rather than by the browser, and the plan gauge stands on a fixed baseline. Both
submitted URLs were verified in Chrome Incognito without authentication.

## 제출 폼에 붙여 넣을 문구

The submission form asks for these two blocks in a fixed shape. Paste them verbatim.

### 재현·통과 확인 4가지

```text
어디로 가나요: https://t06-plando-see-diary.onrender.com — 열면 상단 «현재 계획»에 「T06 프로젝트 완주」가 이미 선택돼 있습니다. 무료 호스팅이라 한동안 접속이 없었으면 첫 화면이 뜨기까지 30초쯤 걸릴 수 있습니다.
무엇을 하나요(3단계 이내): 1) 상단 「03 See 회고」를 눌러 이동한다 2) «실제 시간 390분» 카드를 눌러 근거 실행 기록을 펼친다 3) 화면 아래 「전체 JSON 내려받기」를 누른다
무엇이 보이면 통과: 2)에서 펼쳐진 실행 기록이 3건이고 각각 60분·240분·90분이라 합이 화면의 390분과 같습니다. 기록마다 실행 ID와 할 일 ID가 함께 보입니다. 3)에서 받은 JSON에 plans·planRevisions·tasks·taskTags·completionEvents·executionLogs·reflections가 모두 있고, executionLogs의 세 값이 화면에서 본 60·240·90과 같습니다.
안 될 때: 30초를 기다려도 첫 화면이 비어 있거나, 실제 시간이 0분이거나, 카드를 눌러도 근거 기록이 열리지 않거나, 화면의 390분과 JSON의 executionLogs 합이 어긋나거나, 내려받기가 실패합니다.
```

### AI와 내 판단 3줄

```text
AI에게 맡긴 일: Flask와 React의 Plan→Do→See 흐름 구현, 중복 완료 방지, JSON 내보내기, Docker와 PostgreSQL 배포, 자동 검사와 공개 검증.
내가 판단한 일: Render Free와 Neon PostgreSQL 조합을 골랐고, 디자인과 Plan·Do·See 사용 흐름을 직접 검토한 뒤 공개 검증 결과를 기준으로 채택했다.
AI 말을 안 들은 일: 집계 숫자를 자연어로 풀어 주는 기능은 넣지 않았다. 음수 차이를 무조건 «시간을 아꼈다»로 읽히게 만드는데, 미완료 때문에 적게 걸린 경우와 구분되지 않기 때문이다.
```

## Four verification lines (T06-C59)

Location: https://t06-plando-see-diary.onrender.com → See · 돌아보고 이어가기 → `T06 프로젝트 완주`.

Actions: ① Select the real plan ② Open actual-minutes source records ③ Download the full JSON using “전체 JSON 내려받기”.

Pass appearance: See has non-zero actual minutes equal to its source execution records; one JSON contains the same IDs, values, dates and minute units plus plans, revisions, tasks, tags, completion events and reflections.

Failure appearance: See is zero despite saved real logs, totals/source IDs differ, or the JSON download fails or omits stored records.

## Three judgment lines (T06-C60)

AI work: Flask/React Plan→Do→See 흐름, 중복 완료 방지, JSON 내보내기, Docker/PostgreSQL 배포와 자동·공개 검증을 맡겼다.

User judgment: Render Free와 Neon PostgreSQL 조합을 선택하고, 디자인과 Plan·Do·See 사용 흐름을 직접 검토한 뒤 공개 검증 결과를 기준으로 채택했다.

Rejected AI advice and reason: 집계 숫자를 자연어로 해석해 주는 기능은 음수 차이를 무조건 시간 절약으로 오해할 수 있어 이번 과제에서는 추가하지 않았다.

## Evidence completed

- A user-provided Chrome Incognito screenshot confirms the product URL opens
  without authentication and displays the public warning, source plan and carried
  next plan.
- A second Chrome Incognito screenshot confirms the public full-commit source URL
  opens without authentication and displays the fixed commit and repository files.
- Public app has one real source plan, five linked tasks, three execution logs,
  three completed tasks, one reflection and one carried next plan.
- Refresh preserved UUIDs, dates, values and minute units in Neon PostgreSQL.
- See shows task 5, completed 3, blocked 1, estimated 600, actual 390 and
  variance -210 with exact source task/log IDs.
- Export contains plans, one plan revision, tasks including deletion history,
  tags, completion events, execution logs and a reflection.
- Script-shaped input rendered literally and was removed after the check.
- Source, Git history, public client assets and API responses passed the
  common-secret pattern scan.
- User confirmed the judgment and rejected-advice lines above.

Local evidence is in `HANDOFF.md`; synthetic fixtures are not real-use evidence.
