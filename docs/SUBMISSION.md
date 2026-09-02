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
`index-CpPmN_2E.js` and `index-B6MuCkAg.css`, which is what the public app returns.

This is the published app including shared plan selection, Plan/Do/See navigation,
saved plans first, mobile input fixes, bundled fonts, signed variance with explicit
evidence counts, a light/dark toggle, an estimate-vs-actual gauge on the selected
plan card and a step bar that marks the section being read. Both submitted URLs were
verified in Chrome Incognito without authentication.

## 제출 폼에 붙여 넣을 문구

The submission form asks for these two blocks in a fixed shape. Paste them verbatim.

### 재현·통과 확인 4가지

```text
어디로 가나요: https://t06-plando-see-diary.onrender.com → 03 See 회고 → 현재 계획 「T06 프로젝트 완주」
무엇을 하나요(3단계 이내): 1) 상단 «현재 계획»에서 「T06 프로젝트 완주」를 고른다 2) See의 «실제 시간» 카드를 눌러 근거 실행 기록을 연다 3) 화면 아래 「전체 JSON 내려받기」를 누른다
무엇이 보이면 통과: 실제 시간이 390분으로 0이 아니고, 근거로 열린 실행 기록 3건의 합과 같다. 내려받은 JSON에 같은 실행 기록 ID와 분 단위가 있고 계획·수정 이력·할 일·태그·완료 이력·회고가 함께 들어 있다.
안 될 때: 저장된 실행 기록이 있는데 See가 0으로 나오거나, 합계와 근거 기록 ID가 어긋나거나, JSON 내려받기가 실패하거나 저장된 기록을 빠뜨린다.
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
