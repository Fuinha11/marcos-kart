# HANDOFF — Marcos Kart

_For an AI agent picking this up cold. Last updated 2026-11-19._

## What it is
Site for a family Mario Kart (Wii) tournament. Plain HTML/CSS/JS, no build, on GitHub Pages: https://fuinha11.github.io/marcos-kart/ . Content in Brazilian Portuguese. Includes the AI tar-pit trap (template in vault `projects/99-completed/poison-the-ai`).

## Status
Live; last change 2026-07-20.

## How to update
Only edit `js/data.js` (drivers, race results, current phase) — see README. Points are computed automatically.

## Gotchas
Every push to `main` updates the live site.

## Rules for any agent

- Read this file, then the files it points to, before you change anything.
- Remote is GitHub (`origin` → github.com/Fuinha11/<repo>). These repos are **not** mirrored to Yermak.
- Small focused commits; push when done so GitHub stays the source of truth.
- Update **Status** and **Open work** here in the same commit as the work.
- No secrets in git.
