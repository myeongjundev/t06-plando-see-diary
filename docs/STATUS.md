# T06 project status

Updated: 2026-09-02 KST

## 2026-09-02 light/dark toggle

- Header toggle switches the theme manually (D-026). Two states, starting from the
  system preference; the choice persists in `localStorage` (`t06-theme`) and then
  overrides the system. Storage access is wrapped in try/catch for private windows.
- The strict CSP (`script-src 'self'`) rules out the usual inline pre-paint script,
  so `main.tsx` applies the stored choice before the first render and the
  `prefers-color-scheme` block is reduced to `--ground`/`--ink` under
  `:root:not([data-theme])` purely as a pre-mount fallback. The CSP was not changed.
- The dark palette now lives in one block, `:root[data-theme="dark"]`, because JS
  always writes a concrete value. `color-scheme` is set per theme so native date
  inputs follow.
- Verified on the built frontend served by Flask (production shape, port 5055):
  system light with no stored value starts light; the button switches to dark and
  stores `dark`; a reload keeps dark against a light system; the reverse case
  (system dark, stored `light`) also holds. `color-scheme` tracked the theme both
  ways. At 1280px no overflow, toggle at the top right. At 375px no document or
  element overflow, the toggle wraps below the title, and the public warning stays
  fully within the first screen (T06-C82, bottom 294 of 812). Priority still renders
  the literal `high` with `text-transform: none` (T06-C05, C15), the sort rule and
  the signed variance with its evidence counts are unchanged in both themes.
- 53 backend tests, `npm run build` and `git diff --check` passed. Presentation only.

## 2026-09-02 submission source URL correction

- The submitted Source URL pointed at application commit `1d0e0f7`. That tree's
  `docs/SUBMISSION.md` still read "not ready to submit", named an older commit as its
  own source, and carried both T06-C60 judgment lines as placeholders. A reader
  opening the submitted source would have read the placeholders, so T06-C59 and
  T06-C60 were not actually satisfied at the submitted URL.
- Fixed by tagging the submitted commit `t06-submission` and pointing the Source URL
  at the tag. A tag name can be written into the document before the commit exists,
  so the URL and the file it lives in stay consistent; a hash cannot.
- The tagged commit changes documentation only. `frontend/` and `backend/` are
  byte-identical to `1d0e0f7`, the code Render built and is serving as
  `index-Dc4X5YZr.js` and `index-BLGnwQPS.css`.
- Review of the Codex submission work also re-checked its recorded numbers against
  the live API: See `5 / 3 / 0 / 1 / 600 / 390 / -210`, the export's seven record
  counts, the retained `600` plan revision, and the reflection line carried into the
  next plan byte-for-byte. All matched. An earlier local reading of `6 / 601 / -211`
  was the transient state while the script-shaped verification task existed.
- The T06-C60 judgment and rejected-advice lines were raised with the user, who
  confirmed them as written.

## 2026-09-02 public completion verification

- Public Neon data now contains the real safe plan `T06 프로젝트 완주`, five
  linked tasks, three execution logs, three completed tasks, one reflection and
  one next plan carrying the approved improvement line.
- Plan estimate changed from 600 to 540 under the same UUID; revision history
  retained the original 600 and survived refresh.
- Task create/edit/complete/reopen/delete/search/filter/sort behavior was exercised
  on the deployed app. A temporary high-priority `backend`, `test` task was removed,
  leaving the five real tasks unchanged.
- Repeated activation of the first completion control left one completion event;
  See increased once. Three real tasks remain completed after refresh.
- See currently reports task 5, completed 3, overdue 0, blocked 1, estimated 600,
  actual 390 and variance -210. All seven cards exposed their exact source IDs or
  an empty evidence result.
- The approved reflection is `공개 환경의 저장·새로고침·집계 검증 시간을 구현 일정에 미리 포함한다.`
  The linked next plan carries the exact line and both records survived refresh.
- Script-shaped input rendered literally and was deleted after verification.
- `/api/export` returned two plans, one plan revision, seven tasks including two
  soft-deleted verification records, eight tag links, four completion events,
  three execution logs and one reflection. No real export file was committed.
- Working source, Git history, current public HTML/JS/CSS and API responses passed
  the common-secret pattern scan. Backend 53 tests, frontend production build and
  `git diff --check` passed.
- Render serves the same `index-Dc4X5YZr.js` and `index-BLGnwQPS.css` produced by
  application commit `1d0e0f79fe2f8a57d0f5a21e9ae4102bcbb36a38`.
- User approved the final judgment and rejected-advice statements in
  `docs/SUBMISSION.md`.

The user supplied a Chrome Incognito screenshot confirming the product URL,
public warning, source plan and carried next plan. A second Chrome Incognito
screenshot confirmed that the public full-commit source URL opens without
authentication and shows commit `1d0e0f7` with the repository file list. Product,
database health and source URLs returned HTTP 200 in the final check. No submission
verification remains.

학원 PC에서 이어갈 때는 `docs/ACADEMY-HANDOFF.md`를 먼저 읽는다.
최신 main 받기, 새 PC 설치/실행, 완료 작업, 남은 제출 검증과 이어가기 프롬프트를
정리했다. 집 PC의 `tmp/` 검증 스크립트·로컬 DB·환경 설정은 Git에 포함되지 않는다.

## Phase

**COMPLETE — Cards 1–5 implemented, publicly verified and ready to submit**

## Completed

### 2026-09-02 — See metric cards: signed variance and evidence counts

- The variance card renders its sign (`+220분` / `-40분`, ASCII hyphen) and is the only
  metric with a semantic colour: `--crit` when actual exceeded the estimate, `--good`
  when under, neutral at zero. The other six stay neutral, so the light default keeps
  its white-and-blue base and the screen carries one point of colour. Dark palette
  resolves to `#ef8279` / `#4fc3a1`. Decision D-025.
- The tone rules sit after `.metric-card[aria-pressed="true"] strong` at equal
  specificity, so selecting the variance card does not repaint the sign in the accent.
- `근거 기록 보기` replaced by the real counts, named per kind. A single total
  misread against the metric: 막힘 shows `2개` but is backed by 2 tasks and 3 logs, so the
  label reads `근거 할 일 5 · 기록 3` and matches what the drill-down lists.
- Verified against a seeded local database holding the matrix fixture
  (`[5, 3, 1, 2, 300, 260, -40]`) plus a second plan built to produce `+220`:
  both signs and both colours in light and dark, the variance drill-down listing
  exactly 8 records for `할 일 5 · 기록 3` with task/execution IDs visible (T06-C83),
  the value's leading character confirmed as ASCII 45 (T06-C32), and at 375px no
  document or card overflow with every evidence label on one line and card heights equal.
- 53 backend tests passed; `npm run build` (tsc + vite) passed. Presentation only —
  no API, contract, migration or test expectation changed.
- Not committed. Browser-pane screenshots of scrolled content were unreliable in this
  session, so the evidence above is computed-style and layout measurement, not images.

### 2026-09-02 — Plan/Do/See usability follow-up

- Saved plans appear before the optional new-plan form. Empty accounts show the
  first-plan form immediately after loading; saving selects the new plan and
  moves focus to Do. The existing-plan form opens through “새 계획 만들기”.
- One App-owned plan selection drives Do and See. Sticky anchor navigation moves
  between mounted sections, preserving drafts during step navigation. Plan-card
  actions, newly created follow-up plans and existing reflection links select the
  same plan. Changing plans resets task-local state rather than carrying it over.
- Execution forms span the full task card; form/grid children and native inputs
  can shrink. At 320px, datetime fields remain inside their card. Priority badges
  stay on one line, and mobile navigation labels use two consistent lines.
- Build and 53 existing tests pass. Synthetic browser checks cover two plans,
  matching tasks/See metrics, preserved draft during navigation, first-plan save
  and reload, 25-minute execution save/See update, and reflection-to-next-plan
  selection with exact carried improvement. No backend/schema/security change.
- Deployed from main at `92a115672a5a07068f6a97f99c625c9fe2f29eee`.
  Public HTML references `/assets/index-DnSTSqUZ.js` and
  `/assets/index-Dr1DAnWc.css`; new navigation code/styles, sampled fonts, license
  and PostgreSQL health are verified. Real-use records and final submission checks
  remain separate.

- Preliminary five-card material analyzed.
- Conflicts with the broader course overview identified.
- Draft acceptance matrix prepared.
- Conditional Flask architecture drafted.
- Shared Claude–Codex working agreement created.
- Codex skill `t06-diary-workflow` scaffolded.
- Local Git repository initialized on `main`.
- Preparation baseline committed as `303012b429234866e2f79e35568475537a094f2b`.
- Official assignment source saved as `docs/source/T06-OFFICIAL-ASSIGNMENT.md`.
- Official requirements reconciled on 2026-09-01.
- All 44 official acceptance IDs fixed with observable inputs and expectations.
- React + Flask + PostgreSQL architecture activated.
- Initial real-use subject fixed as `T06 프로젝트 완주`, measured in minutes.
- Canonical `contracts/pds-schema-v2.json` created and JSON syntax verified.
- React + Vite and Flask + SQLAlchemy application skeletons created.
- Card 1 plan creation and immutable revision history implemented.
- T06-C04–T06-C08 passed in automated tests and local browser verification.
- Backend: 3 tests passed with 89% coverage; frontend production build passed.
- Card 2 task model, normalized tags, soft deletion, API, and React workflow implemented.
- T06-C09–T06-C20 passed in automated tests.
- Browser verification passed for task creation, content edit, complete, reopen, and search.
- Backend: 7 tests passed with 87% coverage; updated frontend production build passed.
- Card 3 execution logs and database-protected completion events implemented.
- T06-C21–T06-C27 passed locally: UTC persistence, Seoul display, actual minutes,
  exact blocker text, preserved estimates, one event and one completed-count increase.
- Four concurrent requests using independent database connections return one event.
- Replays after reopen do not complete the task again; a new key starts a new cycle.
- React supports execution entry/history and the See completed count with source IDs.
- Browser verification: 13:00–14:30 Seoul, actual 75 minutes, blocker text, estimate
  90 retained; double-click leaves one completion event and completed count 1;
  refresh restores the same execution ID and values, with no console errors/warnings.
- Backend: 31 tests passed, 90% coverage. Frontend production build passed.
- Card 2 → Card 3 migration preserves existing values and repeated upgrade is safe.
- Local `db upgrade` and `db check` passed; PostgreSQL execution remains unverified.
- Card 4: seven See metrics, exact source task/log drill-down, due-date period
  selection, reflection persistence, and next-plan carry-over implemented.
- T06-C28–T06-C33 and T06-C83 passed locally; all earlier regression checks passed.
- Synthetic fixture: 5 tasks, 3 completed, 1 overdue, 2 blocked, estimated 300,
  actual 260, variance -40. Empty aggregates and Seoul midnight boundary passed.
- Browser verified all seven source views, period filtering, reflection creation,
  exact improvement carry-over, empty next-plan aggregates, and refresh persistence.
- Card 4 migration preserves earlier logs/events and repeated upgrade is safe.
- Four concurrent next-plan requests create one linked plan.
- Current backend result: 47 tests passed, 92% coverage; frontend build passed.

## Card 5 local results

- Full JSON export, consistent database snapshot and all-column canonical contract implemented.
- Docker builds React and serves it with non-root Waitress; PostgreSQL is mandatory.
- Local PostgreSQL migrations, repeated upgrade and schema check passed.
- Four concurrent completion requests create one event; four next-plan requests create one plan.
- Web restart preserves all exported IDs, dates, values, units and links.
- Backend: 51 tests passed, 91% coverage. Frontend and Docker production builds passed.
- Browser at port 5173: exact warning visible, script-shaped input rendered literally
  with no corresponding script element, JSON download success status, no console warnings/errors.
- Browser tool blocked port 8000 with ERR_BLOCKED_BY_CLIENT; production HTTP and
  database tests passed, but production browser verification is still unrun.
- Common-secret pattern scan covered working files, frontend bundle and 142 Git
  objects with zero findings after recognizing the existing replace_me placeholder.
- Deployment instructions and submission draft are ready. Local data is synthetic.

## Not started

- Public hosting and private-browser product/full-commit source verification
- Real non-sensitive user entries and live safety checks
- User judgment/rejected-advice statements and final submission

## Render + Neon preparation

- User selected Render Free + Neon Free for approximately three months.
- render.yaml defines one free Docker service; no paid database is provisioned.
- /api/live avoids DB queries during hosting probes; /api/health verifies DB readiness.
- SQLAlchemy pre-ping checks connections reused after database sleep.
- 52 tests passed with 91% coverage; frontend production build passed.
- Render browser shows Sign In; account connection and Neon database creation are pending.
- See docs/RENDER-NEON.md. GCP-SETUP.md is a superseded alternative.

## Next action

Public deployment update: the user created Neon and Render Free. Public URL is
https://t06-plando-see-diary.onrender.com. API liveness/PostgreSQL readiness return
200, but the initial root page returned 404 because the installed package resolved
the frontend path incorrectly. STATIC_DIST is now explicit in Docker; missing
production index.html fails startup. 53 tests and installed-image root/assets
checks pass. Fix 7bb42551308c5d90ab717227982d563e5b9f7a99 was pushed and automatically
deployed. Public /, JS, CSS, /api/live and /api/health now all return 200. Browser
tool access was blocked; ask the user to reload for visual confirmation, then finish
deployed save/refresh/source/export acceptance.

Account setup is complete. Verify public access, cold-start recovery, stored data and JSON.
Obtain real safe records and user judgment text for SUBMISSION.md.
Public app/database connectivity is verified; UI and full acceptance remain pending.

## Design token layer

Accepted follow-up (2026-09-02): user approved adopting the design after the review
fixes. Gothic A1 5.3.0 is bundled through Fontsource at weights 400/500/700/800;
external Google links are removed, Vite emits even small fonts as files to preserve
the existing same-origin CSP, and the OFL license ships under /assets/fonts/.
Evidence labels use stronger light/dark colors; sort rule and source IDs are 13px.
Build and 53 tests pass. Flask serves the built CSS and requested Korean/Latin
fonts with HTTP 200. Dark and forced-light local views retain metrics and IDs;
375px dark/mobile and 1280px views have no document overflow. Both review findings
are resolved. Merged and pushed to main as application commit
`d9b23a077b640a6cf4e02be92c356781f52dc958`. Render now serves the new
`/assets/index-CmX_ZMf7.css`; public Korean/Latin WOFF2 samples and OFL license
return 200, and /api/health confirms PostgreSQL. The CSP remains same-origin.
Earlier design review findings below describe the pre-fix state.

Codex review (2026-09-02, HEAD `2ebb7bb`): adopt after fixing external font/CSP
compatibility and low-contrast evidence labels. Build and 53 tests pass; seeded
dark-theme browser checks preserve the public warning, priority literals, success
criterion, sort rule, execution records and See sources. Main is unchanged; no
merge/deployment performed. Full review handoff: `docs/REVIEW-CSS-TOKEN-LAYER.md`.

Scope: presentation only. No markup, API, contract, or test expectation changed.

- Direction chosen from four sketched candidates: "flow" — Gothic A1, single accent
  `#1B64DA`, Plan/Do/See read as an ordered process. Rejected candidates kept as
  evidence of the comparison.
- `frontend/src/styles.css` rewritten on a token layer: one accent plus three
  semantic colors (`--good` `--warn` `--crit`), three radii, 4px spacing scale,
  four font weights, 150ms transitions, `prefers-reduced-motion` respected.
- Dark palette added under `prefers-color-scheme: dark`; `color-scheme: light dark`
  set so native date inputs follow the theme.
- Gothic A1 is now bundled locally with a fallback stack (supersedes Google Fonts).
- Removed `text-transform: uppercase` from `.priority`. The DOM value was already
  `high`, but the screen rendered `HIGH`; T06-C05 and T06-C15 expect the plan and
  task screens to show `high`, so the literal is now what the viewer reads.
- Removed the `min-height: 48px` hack on `.plan-card > p`, which reserved blank
  space under every success criterion.
- Locked screen elements left intact in position and wording: the public-data
  warning (T06-C82), the sort rule (T06-C20), success criterion text (T06-C06),
  and the source task/execution IDs (T06-C83).

Evidence: `npm run build` passed; `python -m pytest backend/tests -q` passed 53
tests; dev server checked in light and dark at 1280px with computed styles verified
(`.priority` text-transform `none`, tokens resolving, no horizontal overflow).

Remaining design work needs markup changes. Step navigation and the plan-list
empty state landed in `92a1156`; still open are the plan-card estimate-vs-actual
gauge and signed variance plus evidence counts on the See metric cards. Run the
acceptance suite before and after each of those.

Direction rationale, the four sketched candidates, sketch links, the token summary
and the list of screen elements design must not touch are in `docs/DESIGN.md`.
Editable sketch and prototype sources are committed under `design/` with their own
README; they are not built or served, and the 2.5 MB seeded canvases stay ignored.

## Working tree

Branch: `main`

Baseline commit: `303012b429234866e2f79e35568475537a094f2b`

Official requirements commit: `f25841f`

Card 1 implementation commit: `1bb2c42`

Card 1 handoff commit: `1a4ea62`

Card 2 implementation commit: `f2b9c8c`

Card 2 handoff commit: `22a6655`

Remote: https://github.com/myeongjundev/t06-plando-see-diary

Card 3 start commit: `f8e04fd1d9c413ccf6999a9d666f78f6f3e349b2`

Cards 3–5 and Render/Neon preparation were committed and pushed to origin/main as
`150a9052610705dad52274d94d28f674ab07d324`. Account connection and public deployment
remain pending; see `docs/HANDOFF.md`.

Design token layer and review fixes were merged from `design/css-token-layer` into
`main`, pushed, and verified on Render at application commit `d9b23a0`.
