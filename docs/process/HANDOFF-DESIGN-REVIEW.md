# T06 handoff · design token layer review

## 1. Goal

Review objective, not a card. Confirm that the presentation-only change on branch
`design/css-token-layer` is safe to merge into `main`, specifically that it does not
weaken, hide, or reword any fixed acceptance expectation.

No acceptance ID is added or claimed by this branch. Visual design is not a graded
requirement in `docs/source/T06-OFFICIAL-ASSIGNMENT.md`; this work exists for
submission evidence quality, so any regression it causes is a net loss.

## 2. Current state

Phase unchanged: Cards 1–5 implemented, public verification still pending per
`docs/process/HANDOFF.md`. This branch touches presentation only.

`frontend/src/styles.css` is rewritten on a CSS custom-property token layer. Every
selector that existed before still exists; no class name was added, renamed, or
removed, and no `.tsx` file was touched. `frontend/index.html` gains a Google Fonts
link for Gothic A1. A dark palette is added under `prefers-color-scheme: dark`.

Direction was chosen from four sketched candidates ("flow": single accent `#1B64DA`,
Gothic A1, Plan/Do/See read as an ordered process).

Versions unchanged: React 19.2, Vite 8.2, TypeScript 7.0, Flask + SQLAlchemy backend.

## 3. Run commands

Working directory: repository root.

Frontend build:

    cd frontend
    npm run build

Backend acceptance suite:

    backend/.venv/Scripts/python.exe -m pytest backend/tests -q

Dev server (frontend only; API calls 502 without the backend, which is expected):

    npm --prefix frontend run dev -- --port 5180

## 4. Passed acceptance IDs

Executed and observed:

- Full backend suite: 53 tests passed. This covers the automated subset of the 44
  official IDs. The suite is API-level; it contains no DOM, class-name, or selector
  assertions, so it cannot detect a presentation regression by itself.
- Frontend production build passed (`tsc -b && vite build`), so the stylesheet parses.
- T06-C82 — the public-data warning renders on the first screen with its exact
  wording, observed at 1280px in light mode.
- T06-C05 / T06-C15 wording — `.priority` computed `text-transform` is now `none`
  and the badge renders the literal `high`. Before this branch the rule was
  `uppercase`, so the DOM held `high` while the screen showed `HIGH`. This is the one
  behavioral change in the branch and it moves toward the expectation, not away.

Also verified by computed style: tokens resolve in both themes, Gothic A1 loads
(`document.fonts.check` true), `document.documentElement.scrollWidth` 1265 at
`innerWidth` 1280 so the body does not scroll sideways.

## 5. Failed or unrun acceptance IDs

No failures. Not re-run in a browser against real data:

- T06-C06 — success criterion exact text. The `min-height: 48px` hack was removed
  from `.plan-card > p`, which is the element that carries it. Structure is
  unchanged, but this was not observed with a stored plan.
- T06-C20 — the sort rule string in `.sort-rule`. The rule is restyled, not removed;
  not observed on screen.
- T06-C83 — source task and execution IDs. `.execution-list small` and
  `.source-records small` are now `display: block` at 11px in `--ink-3`. Legible, but
  smaller and lower-contrast than before; worth a reviewer's eye.
- T06-C30 / T06-C32 — See metric cards and variance sign were checked only by
  injecting markup into the DOM to read computed styles, not with real aggregates.

Cause is the same for all four: the backend was not running during verification, so
no plan, task, execution, or reflection rendered.

## 6. Next action

Smallest safe step: run the backend against a seeded database, load the app, and
confirm the four unrun items above on screen in both themes. Then merge to `main`;
Render deploys from `main`, so the public app does not change until then.

## 7. Do not change

Locked screen elements. This branch keeps all of them and a review should confirm it:

- The public-data warning text, verbatim, on the first screen (T06-C82).
- `high` / `medium` / `low` as literals on the plan and task screens (T06-C05, C15).
  Do not reintroduce `text-transform` on `.priority` and do not translate the value.
- The success criterion string, exact (T06-C06).
- The sort rule `priority → due date → created time → ID` on screen (T06-C20).
- Source task and execution IDs reachable from each aggregate (T06-C83).
- Variance rendered with an ASCII hyphen for negatives (T06-C32).

Out of scope for this branch: any `.tsx` change, authentication, API or contract
changes, and the four remaining design items in section 6 of `docs/STATUS.md`.

## 8. Changed files

- `frontend/src/styles.css` — the token layer. Colors reduced to one accent plus
  three semantic roles, radii to three, spacing to a 4px scale, weights to four,
  transitions added at 150ms with `prefers-reduced-motion` honored, dark palette
  added. Two substantive edits beyond restyling: `text-transform` removed from
  `.priority`, and `min-height` removed from `.plan-card > p`.
- `frontend/index.html` — Gothic A1 from Google Fonts, with `preconnect` and a
  fallback stack in the CSS. Adds a third-party font host to the public app; if that
  dependency is unwanted, self-hosting the OFL files is the alternative.
- `docs/STATUS.md` — required by `AGENTS.md` rule 7.

## 9. Git state

- Start commit: `929fb43` (`main`, unchanged).
- End commit: `100ed9b` on `design/css-token-layer`, pushed to origin.
- Remote branch: `origin/design/css-token-layer`.
- PR not opened.
- Uncommitted paths: `docs/process/HANDOFF-DESIGN-REVIEW.md` (this file).
- `main` is untouched, so the deployed app at
  https://t06-plando-see-diary.onrender.com still serves the previous design.

## 10. Review questions

Specific things worth a second opinion:

1. Does any fixed expectation in `docs/T06-ACCEPTANCE-MATRIX.md` depend on a visual
   property this branch changed? Section 7 is the list I believe is complete.
2. Dark palette contrast. `--ink-3` `#717c8a` on `--surface` `#171b21` carries the
   evidence IDs and the sort rule. Is that legible enough for those two roles?
3. Selector specificity. The old sheet had flat single-class rules; the new one adds
   compound rules such as `.actions button.danger.solid:hover:not(:disabled)` and
   `.task-row.completed .status-button`. Any cascade collision?
4. Is a Google Fonts dependency acceptable for a public assignment deliverable, or
   should the faces be self-hosted?
