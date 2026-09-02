# T06 submission draft — private-browser confirmation pending

Product URL: https://t06-plando-see-diary.onrender.com

Source URL: https://github.com/myeongjundev/t06-plando-see-diary/tree/1d0e0f79fe2f8a57d0f5a21e9ae4102bcbb36a38

This is the published app including shared plan selection, Plan/Do/See navigation,
saved plans first, mobile input fixes, bundled fonts, signed variance and explicit
evidence counts. Replace it if later application changes are deployed; verify
private-browser access before submission.

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

## Evidence still needed

- Open the full-commit source URL in a fresh private browser without authentication
  and record the final confirmation before submission.

Local evidence is in `HANDOFF.md`; synthetic fixtures are not real-use evidence.
