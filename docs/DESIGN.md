# T06 design record

Updated: 2026-09-02 KST

Why this file exists: `docs/STATUS.md` records what was built and verified, and
`docs/DECISIONS.md` records the ruling. Neither records *why this direction and not
the other three*, and neither holds the links to the sketches. That reasoning is the
part a reviewer asks about, so it lives here.

Design is not a graded requirement. The official assignment
(`docs/source/T06-OFFICIAL-ASSIGNMENT.md`) never mentions UI, visual quality, or
design, and none of the 44 fixed IDs in `docs/T06-ACCEPTANCE-MATRIX.md` cover it.
This work exists because the assignment's "남길 것" list is entirely screenshots —
the plan screen, the See screen, the public-warning screen — so screen quality
carries the submission evidence. It buys nothing on the matrix, which means any
regression it causes is a pure loss. Treat every design change as presentation-only
until proven otherwise.

## Direction decision

Four candidates were sketched with identical content (the matrix's own numbers: 5
tasks, 3 completed, 1 overdue, 300 estimated, 260 actual, −40 variance) so only
character differed. The brief pulled two ways: "대중적이고 사용자 친화적" against a
tool a working engineer would respect. The four candidates map that tension.

| Candidate | Character | Cost |
|---|---|---|
| A · 계측 | Monospace figures, variance as a bar against a baseline. Reads as an instrument. | Coldest. Furthest from the "친화적" half of the brief. |
| B · 저널 | Serif, sentences before numbers: "40분 덜 걸렸습니다". | Warmest, but weakens the impression that this project handles a server database and aggregation. |
| **C · 흐름** | **Plan → Do → See as an ordered process; bright, familiar, one blue accent.** | **Familiar enough that personal judgment is less visible. Mitigated by shipping the token sheet as evidence of system thinking.** |
| D · 운영 | Dark control-room board, variance promoted to a top-line KPI. | Highest density and expertise, but loses the diary and intimidates a first-time visitor. |

**C was chosen.** The deciding argument: the app's own concept is a three-step loop,
and the previous design buried it in a single long scroll with no wayfinding. C is
the only candidate where the structure of the screen states the structure of the
product. The familiarity cost is real and is answered by the component sheet, not by
decoration.

SKT brand colors, logo, and typography were deliberately not used. Copying another
company's identity is weak as coursework and weaker as portfolio material.

## Sketches

Private artifacts on the author's claude.ai account; they do not open for anyone
else. Export to PNG/PDF from each page if a copy needs to travel.

- Diagnosis of the pre-token design, with the token spec and before/after pairs —
  https://claude.ai/code/artifact/a367bc26-6201-4fc1-aba6-4570a1ec262f
- Four direction candidates, the comparison above rendered —
  https://claude.ai/code/artifact/16ee4040-a2dd-4f66-9a92-79ea8aaee789
- Clickable prototype of direction C: desktop, mobile, and the component sheet —
  https://claude.ai/code/artifact/bbc4719c-5608-474c-a0d0-0d5b5a100ea5

Editable sources for all three are committed under `design/`; see `design/README.md`.

Keep the rejected candidates. A reviewer asking "why this design" is answered far
better by four options and a stated tradeoff than by one finished screen.

## Token layer

`frontend/src/styles.css` is the source of truth; the `:root` block at the top is
the whole system. Summary only:

- One accent (`--accent`), three semantic roles (`--good` `--warn` `--crit`).
  Semantic color means state, never decoration.
- Three radii (12px control / 18px card / 999px pill), a 4px spacing scale, four
  font weights (400 body / 500 secondary / 700 label / 800 heading).
- Gothic A1, bundled locally through Fontsource 5.3.0 with the OFL under
  `frontend/public/assets/fonts/`. Google Fonts was used first and then removed —
  the deployment runs a strict same-origin CSP (D-023).
- Dark palette under `prefers-color-scheme: dark`, plus `color-scheme: light dark`
  so native date inputs follow the theme. All 150ms transitions honor
  `prefers-reduced-motion`.

The problems this replaced, for anyone tempted to reintroduce them: eight radii,
three greens and three oranges with no token, `font-weight: 800` on labels and
buttons and summaries alike, thirteen arbitrary spacing values, an 82px heading with
Latin letter-spacing crushing Korean glyphs, and no `transition` or `:hover` anywhere
in the file.

## Screen elements design must not touch

Restyle freely; do not reword, hide, shrink out of legibility, or move off the first
screen. Full expectations in `docs/T06-ACCEPTANCE-MATRIX.md`.

| Element | IDs | Constraint |
|---|---|---|
| Public-data warning | T06-C82 | Exact wording, on the first screen. |
| Priority value | T06-C05, C15 | Renders the literal `high` / `medium` / `low`. No `text-transform`, no translation to 높음. |
| Success criterion | T06-C06 | Exact string. A label must be a separate element, never prefixed into the same text node. |
| Sort rule | T06-C20 | `priority → due date → created time → ID` stays on screen. |
| Aggregate sources | T06-C83 | Every metric stays clickable and reveals the exact task/execution IDs. |
| Variance | T06-C32 | Negative values use an ASCII hyphen, not U+2212. |

One earlier bug worth remembering: `.priority` carried `text-transform: uppercase`,
so the DOM held `high` while the screen showed `HIGH`. An API-level test cannot catch
that class of defect — the acceptance suite is entirely API-level and asserts nothing
about the DOM, so presentation regressions must be caught by eye.

## Done

Through `113d02f`:

- Token layer applied, fonts bundled, evidence labels raised to 13px with stronger
  light/dark contrast (D-023).
- Plan/Do/See step navigation, saved plans first, App-owned plan selection, sections
  kept mounted across steps (D-024).
- Empty state for the plan list.
- Light/dark toggle in the header (D-026). Two states, initialised from the system
  preference; the choice is stored in `localStorage` under `t06-theme` and then wins
  over the system until cleared. Wrapped in try/catch so a private window that
  refuses storage still toggles for the session.
  The deployment's CSP is `script-src 'self'`, so the usual inline pre-paint script
  is not available. `main.tsx` applies the stored choice before the first render;
  until that module runs, only the body background is visible, and a reduced
  `prefers-color-scheme` block sets just `--ground` and `--ink` under
  `:root:not([data-theme])` so a dark-system visitor does not get a white flash.
  Because JS always writes a concrete `light`/`dark`, the dark palette lives in one
  block (`:root[data-theme="dark"]`) instead of being duplicated across a media
  query and an attribute selector. `color-scheme` is set per theme so native date
  inputs follow.
- Step bar marks the section being read (D-028). The user asked whether the T05
  floating section rail (`t05-ai-handoff`, `src/components/SectionRail.jsx`) belonged
  here. It does not: that rail carries a long single page with six sections and no
  other navigation, while T06 has three sections and a sticky bar that also holds the
  plan picker. A rail would duplicate navigation and add a second thing competing
  with the public warning for the first screen. What transferred is the scroll spy —
  the three links were identical and `aria-current` appeared nowhere in the codebase.
  Now the active link takes `aria-current="step"` and a filled accent background.
  The T05 implementation captures its section elements once. Copied straight across
  that is a bug here: `TaskPanel` is keyed on the plan id and remounts when the plan
  changes, so the captured `#do-step` becomes a detached node whose
  `getBoundingClientRect()` returns zeros, pinning that step as permanently active.
  The elements are looked up on every measurement instead.
- Plan-card estimate-vs-actual gauge (D-027). Tick at the estimate, fill at the
  actual, on the selected plan card only. Under fills short of the tick in `--good`,
  over runs past it in `--crit`, matching the See variance rule.
  Two things needed care. The tick vanished when the fill ran past it — it read as a
  seam in the bar — so it carries a `--surface` halo and stands proud of the track.
  And the card already showed a "N분 예상" line that is the *plan's* estimate, while
  the gauge compares the *sum of task estimates* the See screen uses (D-014); those
  are different numbers, so both are now named (`계획 예상` and `할 일 예상`)
  rather than left to look like a contradiction.
  The gauge is on the selected card only because actual minutes come from
  `/api/plans/<id>/see`, one call per plan; drawing it on every card would fan out a
  request per plan on a free tier for every first paint.
- See metric cards carry a signed variance and a per-kind evidence count (D-025).
  `varianceMinutes` is the only metric whose sign means something, so it is the only
  one that takes a semantic colour: `--crit` when actual exceeded the estimate,
  `--good` when it came in under, neutral at zero. The other six stay `--ink`, which
  keeps the white-and-blue base and puts one point of colour on the screen.
  The tone rules sit after `.metric-card[aria-pressed="true"] strong` at equal
  specificity, so selecting the card does not repaint the sign in the accent.
  `근거 기록 보기` became the real count. A single total misread: 막힘 shows `2개`
  but is backed by 2 tasks and 3 logs, so the label names each kind —
  `근거 할 일 5 · 기록 3`, which is exactly what the drill-down then lists.

## Remaining

Nothing open. Both items from the token-layer plan have shipped.

## Resuming

    git pull
    cd frontend && npm install && npm run build
    npm --prefix frontend run dev -- --port 5180

The dev server alone shows the layout but every API call returns 502; plan cards and
See metrics stay empty. Start the backend against a seeded database before judging
anything data-driven — that gap is why four expectations went unverified during the
token-layer work (`docs/HANDOFF-DESIGN-REVIEW.md` section 5).

Related: `docs/REVIEW-CSS-TOKEN-LAYER.md` (Codex review of the token layer),
`docs/HANDOFF-DESIGN-REVIEW.md` (what was and was not verified), D-023 and D-024 in
`docs/DECISIONS.md`.
