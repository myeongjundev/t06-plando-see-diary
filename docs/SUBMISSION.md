# T06 submission draft — not ready to submit

Product URL: pending public deployment.

Source URL: https://github.com/myeongjundev/t06-plando-see-diary/tree/150a9052610705dad52274d94d28f674ab07d324

This is the published Cards 3–5 and Render/Neon preparation commit. Replace it if
later application changes are deployed; verify private-browser access before submission.

## Four verification lines (T06-C59)

Location: [public product URL pending] → See · 돌아보고 이어가기 → user's real plan.

Actions: ① Select the real plan ② Open actual-minutes source records ③ Download the full JSON using “전체 JSON 내려받기”.

Pass appearance: See has non-zero actual minutes equal to its source execution records; one JSON contains the same IDs, values, dates and minute units plus plans, revisions, tasks, tags, completion events and reflections.

Failure appearance: See is zero despite saved real logs, totals/source IDs differ, or the JSON download fails or omits stored records.

## Three judgment lines (T06-C60)

AI work: Implemented the Flask/React Plan→Do→See workflow, transactional duplicate protection, JSON export, Docker/PostgreSQL setup and automated/local checks.

User judgment: [The user must state a design or result they actually reviewed and accepted, with their reason.]

Rejected AI advice and reason: [The user must state an actual rejected suggestion and why; the agent must not invent a rejection.]

## Evidence still needed

- Public product and full-commit source URLs opening in a fresh private browser.
- A real non-sensitive plan, five linked tasks, three actual logs and non-zero See.
- Deployed persistence, refresh, export and security observations.
- User-confirmed judgment and rejection text.

Local evidence is in `HANDOFF.md`; synthetic fixtures are not real-use evidence.
