# Design branch review — 2026-09-02

Resolution: the user approved adoption and both P2 findings below are fixed in
the follow-up. Gothic A1 is bundled with no external or data font URLs, retaining
the existing CSP. Evidence text is now 13px with contrast at least 4.63:1 on the
checked light surfaces and 6.46:1 on dark surfaces. Build and 53 tests pass;
Flask HTTP font delivery and dark/forced-light browser checks pass. The numbered
sections below preserve the original review; current handoff is `HANDOFF.md`.

## 1. Goal

Review `design/css-token-layer` at `2ebb7bb` against `main` at `929fb43`
for suitability for T06. User requested review, not merge or deployment.

## 2. Current state

Recommendation: adopt after the two presentation issues below are resolved.
The unified accent, spacing, smaller headings and dark palette make the form-heavy
interface more consistent. No TSX, API, database, contract or acceptance expectation
changed in this branch. The user reports the existing public app renders correctly.

### P2 — External font is incompatible with production CSP

`frontend/index.html:9–12` adds a stylesheet from fonts.googleapis.com. The actual
Flask response sends `style-src 'self'` and `default-src 'self'`, with no external
font allowance (`backend/app/__init__.py:49–52`). Consequently the deployment cannot
load the requested Gothic A1 stylesheet/font; Vite-only verification does not cover
this constraint. Use bundled font files served under `/assets/` with same-origin
CSS, or deliberately use the system fallback and remove the external links.
Keep the existing security policy intact when choosing the bundled-font approach.

### P2 — Required evidence text becomes difficult to read

`--ink-3` is used for the sort rule, source IDs and metric source prompts.
Source IDs are reduced to 11px; the sort rule is 12px. Calculated foreground/background
contrast is 3.04:1 for light `#8b95a1` on white, 4.08:1 for dark `#717c8a` on
`#171b21`, and 3.77:1 on dark `#1d222a`. The dark screen visibly de-emphasizes these
small labels. Use a stronger text token for required evidence and increase source
IDs to at least 12–13px. These records remain reachable; this finding concerns
readability, not a missing C83 feature or a claim that the assignment mandates WCAG.

## 3. Run commands

From the repository: `npm --prefix frontend run build` and
`backend/.venv/Scripts/python.exe -m pytest backend/tests -q`.
An ignored temporary script `tmp/review_design_server.py` serves the built frontend
with the real Flask headers and isolated synthetic SQLite data on localhost:5173.
The in-memory fixture uses a single-threaded server; concurrent access through a
shared in-memory connection produced a transient lookup failure during initial
inspection, resolved by serializing this review harness. This is not attributed
to the CSS branch and does not validate PostgreSQL concurrency.

## 4. Passed acceptance IDs

- Frontend build passed; existing backend suite passed all 53 tests.
- Browser spot checks: exact C82 public warning, C05/C15 literal `high`, C06 stored
  success criterion, C20 sort text, and C83 source task/execution IDs remain present.
- Synthetic See shows 5 tasks, 1 completed, 4 overdue, 3 blocked, 300 estimated
  minutes, 150 actual minutes and -150 variance. Variance opens its source records.
- Opening Do shows the stored execution record after the fixture correction.
- Basic layout has no horizontal document overflow at 1280px and 375px.

These are targeted review observations, not certification of all 44 expectations.

## 5. Failed or unrun acceptance IDs

The two presentation findings above remain open. Browser inspection used the
current dark theme; light contrast was calculated from CSS, not visually rechecked.
At 375px an expanded datetime input extends beyond its task card, though within
the document; not established as introduced by this branch, so not a new finding.
No public deployment, save/refresh/export round-trip, or actual-use verification
was performed in this review. Existing get_engine deprecation warnings remain.

## 6. Next action

Fix font delivery and required-evidence contrast in this branch, then recheck the
built app under Flask in light/dark themes. Merge only when the user requests it.
Keep remaining actual-use and submission checks in scope for final T06 completion.

## 7. Do not change

Preserve all 44 fixed expectations, exact public warning, source evidence, units,
IDs, dates, completion idempotency and authentication-free T06 behavior. Synthetic
review records must remain local. Do not weaken CSP merely to suppress font errors.

## 8. Changed files

This review adds this report and a status note only. Application files unchanged.
Temporary local harness is ignored; no production data or credentials used.

## 9. Git state

Reviewed HEAD: `2ebb7bb`, branch `design/css-token-layer`. Main remains `929fb43`.
No merge, commit, push or deployment performed. Uncommitted review files:
`docs/STATUS.md`, `docs/process/REVIEW-CSS-TOKEN-LAYER.md`.
