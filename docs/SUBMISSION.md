# T06 submission — ready

Product URL: https://t06-plando-see-diary.onrender.com

Source URL: https://github.com/myeongjundev/t06-plando-see-diary/tree/t06-submission

`t06-submission` is a fixed tag on the submitted commit, so the URL resolves to one
immutable tree and stays consistent with this file. An earlier draft pointed at a
raw commit hash, whose copy of this document still read "not ready to submit" and
still held the two judgment placeholders — a reader opening the submitted source
would have read those instead of the finished text. A hash cannot be written into
the document that the commit contains; a tag name can, which is why the URL names
the tag.

The tag tracks the deployed code: Render builds `main` automatically, and the tag is
moved onto the commit Render is serving. At the time of writing that build emits
`index-ap8UgvrT.js` and `index-B_l_OmhI.css`, which is what the public app returns.

This is the published app including shared plan selection, Plan/Do/See navigation,
saved plans first, mobile input fixes, bundled fonts, signed variance with explicit
evidence counts, a light/dark toggle and an estimate-vs-actual gauge on the selected
plan card. Both submitted URLs were verified in Chrome Incognito without
authentication.

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
