# Design sources

Sketch and prototype sources for the T06 interface. Nothing here ships with the
application — the app is `frontend/`, and these files are never imported, built, or
served. They exist so the design work can be reopened and edited without the chat
session that produced it.

Read `docs/DESIGN.md` first. It carries the direction decision, the tradeoff accepted
for each candidate, and the screen elements design must not touch.

## What is here

    diagnosis.html          Standalone page: what was wrong with the pre-token
                            design, the token spec, and before/after pairs.
                            Open it directly in a browser — no build, no server.

    directions/             The four candidates, one artboard per file.
      Main.dc.html            A · 계측 — instrument
      Journal.dc.html         B · 저널 — journal
      Flow.dc.html            C · 흐름 — flow  ← adopted
      Ops.dc.html             D · 운영 — ops
      canvas.json             Positions, sticky notes, launch view

    prototype/              Direction C, clickable.
      Main.dc.html            Desktop. Step nav switches Plan/Do/See; task
                              checkboxes, search and filter chips all work and
                              the See metrics update with them.
      Mobile.dc.html          390px. Checkboxes and bottom tabs work.
      Components.dc.html      Component sheet: color, type, controls, states.
      canvas.json             Layout

`Main.dc.html` in `directions/` is candidate A, not the adopted one. The canvas
format requires the entry artboard to be named `Main`, and renaming it would break
`canvas.json`. Candidate C is `Flow.dc.html`.

## Editing

A `.dc.html` file is plain HTML with an optional `<script data-dc-script>` logic
class. Open one in an editor and change it like any other HTML file. The
`<script src="./support.js">` line in the head is a placeholder the canvas runtime
replaces at render time — leave it exactly as it is.

To rebuild a browsable canvas, seed a fresh copy with Claude Code's `/design` skill
and publish it. Roughly:

    node <skill>/seed-canvas.mjs \
      --template <skill>/payload.template.html \
      --out plando-see-diary.html \
      --title "플랜두씨 다이어리" \
      --artboard Main.dc.html \
      --artboard Mobile.dc.html \
      --artboard Components.dc.html \
      --canvas canvas.json

The seeded output is about 2.5 MB because the canvas editor is baked into every
published page. It is a build artifact — do not commit it. Only the sources above
belong in Git.

## Published copies

Private artifacts on the author's claude.ai account; they do not open for anyone
else. Links are also listed in `docs/DESIGN.md`.

- Diagnosis — https://claude.ai/code/artifact/a367bc26-6201-4fc1-aba6-4570a1ec262f
- Four directions — https://claude.ai/code/artifact/16ee4040-a2dd-4f66-9a92-79ea8aaee789
- Prototype — https://claude.ai/code/artifact/bbc4719c-5608-474c-a0d0-0d5b5a100ea5

## Data in these files

All values are synthetic and chosen to match the acceptance matrix so the sketches
stay comparable: 5 tasks, 3 completed, 1 overdue, and a negative variance. They are
not stored records and must not be read as evidence of real use — that lives in the
deployed app and in `docs/SUBMISSION.md`.
