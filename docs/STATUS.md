# T06 project status

Updated: 2026-09-02 KST

학원 PC에서 이어갈 때는 `docs/ACADEMY-HANDOFF.md`를 먼저 읽는다.
최신 main 받기, 새 PC 설치/실행, 완료 작업, 남은 제출 검증과 이어가기 프롬프트를
정리했다. 집 PC의 `tmp/` 검증 스크립트·로컬 DB·환경 설정은 Git에 포함되지 않는다.

## Phase

**IMPLEMENTATION — Cards 1–4 complete locally; Card 5 implemented locally, public verification pending**

## Completed

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

Remaining design work needs markup changes and is not started: plan-card
estimate-vs-actual gauge, empty state for `.plan-list`, signed variance and
evidence counts on See metric cards, step navigation in `TaskPanel`. Run the
acceptance suite before and after each of those.

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
