# MixCheck R3 — mockup-05 verbatim transplant (r3-mixcheck-codex, 2026-09-01)

Session: coordinator dispatched Cat to transplant jules `mockups/05-r3-mixcheck-full-layout.html`
(@ `8c2785e`) into `#eq.oz-mixcheck` after Kevin rejected the `70f5515` "pixel-match" render
**twice** as "not identical to mockup 05". Codex was the implementer via `codex exec` write mode.
Result: commit `0e96e77` on `origin/r3-mixcheck-codex`, TP2 clean, gated on Kevin's visual sign-off.

## What the two rejections actually were
`70f5515` (the earlier "comprehensive element-by-element pixel-match") had in fact already ported
the grid / cards / head / banner / Audio Specs / analyser / Fix Queue faithfully. The residual gap
vs mockup 05 was **exactly two element groups**, and Kevin's most recent feedback named them:
1. The transport waveform was the greyscale energy-envelope (HANDOVER §4 "no named sections" LOCK),
   NOT the mockup's coloured INTRO/VERSE/BRIDGE/VERSE section washes + labelled `.secs` ruler +
   amber pips. Kevin's "identical to mockup" directive **supersedes** that §4 lock — he approved a
   mockup that HAS named sections and wants them.
2. Hope rail: "input chat box move down" + "hope panel move down" = the mockup's `.rail` flex
   column (composer pinned bottom via `border-top`, transcript `.body{flex:1;min-height:0}` fills).
Lesson: a **small** transplant diff can be the correct answer. Judge the result by a full-page
render against the mockup, not by diff size. Don't re-transplant regions that already match.

## Fixes that landed
- Waveform: 4 `.seg` washes + `.bars#mcWaveBars` (120 cosmetic bars, ported mockup `segGrad()`/
  `fill()` IIFE, rebuilt at DOMContentLoaded + end of `refLoadFile` + live-stop) + `.played` +
  2 `.pip` + `.secs` ruler (Intro/Verse/Bridge/Verse at 22/30/22/26%). Sections are **fixed
  proportional cosmetic layers** — no segmentation DSP, none implied; the "estimated from energy"
  caption (`#mcWaveCap`) is now `display:none` (mockup has none + copy no longer true).
- **Kept `<canvas id="mcWave">` as a transparent overlay** — `position:absolute;inset:0 0 20px 0;
  opacity:0;pointer-events:auto;z-index:6`. This is a clean pattern: swap a live-engine canvas
  visual for mockup DOM layers while keeping pointer-seek wiring (`wireScrub`) + `MC_WAVE.build/
  draw/markers` calls working with zero engine changes.
- Rail: desktop `@media(min-width:1024px)` block — `#hopeRail{flex-direction:column}`,
  `.rail-body{flex:1;min-height:0;display:flex;flex-direction:column}`, `.aichat-layout` +
  `#aiChatTranscript` set `flex:1;min-height:0;max-height:none` (drops the old `38vh` cap),
  `.aichat-compose{border-top;padding:12px}`. `setRail()` / `aichatSend` / mobile overlay rules
  untouched — this is a permitted container-layout change, not voice/chat behaviour (Markey's).

## Codex `exec` write-mode gotchas (new)
- Write mode = `codex exec --approve-for-me` (routes approvals through the workspace-write sandbox).
  `-s workspace-write` **cannot be combined** with `--approve-for-me` ("cannot be used with").
- `--approve-for-me` **self-commits AND self-pushes** at the end even when the brief says "only edit
  index.html, only this file". It pushed `f78a365` to `origin/r3-mixcheck-codex` before Cat could
  review the diff. Next time: put an explicit HARD STOP in the brief — "do NOT run git add/commit/
  push; leave the working tree dirty for my review." (Recovery here: `git commit --amend` to fix
  the message + fold in the mechanical fix + HANDOVER, then `git push --force-with-lease`.)
- Codex also under-scoped vs the brief on first pass (added class *aliases* + the two missing
  element groups rather than a node-for-node DOM rebuild) — which turned out fine because the DOM
  already matched, but confirm by render, and be ready to re-run with a tighter prompt.
- TP2 that works on this repo: `codex exec -s read-only --skip-git-repo-check -c
  model_reasoning_effort="low" -C <abs repo> "<terse BLOCKERS-ONLY prompt pointing at a
  pre-written diff in C:/Users/admin/codex-scratch/...>" < /dev/null`, ~400s timeout. ~17k tokens,
  "TP2: NO BLOCKERS".

## Render tooling
The full-page CDP driver + a musical-envelope test WAV persist in the shared session scratchpad:
`fullpage.mjs` / `pagev2.mjs` (adapt OUT + names), `envmix.wav`. Serve the working tree with
`python -m http.server 8791 --directory <repo>`, shoot `http://127.0.0.1:8791/index.html`, click
`.tab.oz-tab[data-tab="eq"]`, `DOM.setFileInputFiles` `#refFileInput`, sleep ~11s for analyse.
Deliverables named `page-v2.png` (WAV loaded, Fix Queue default) + `page-v2-empty.png` (no WAV).

## Still-open / residual mockup deviations (for Kevin's visual review — not bugs)
Band-card verdict pills (`#ozBand*Tag` "↓ LOW VS TARGET") — mockup band cards are label/value/bar
only. `#refSpecStatus` "idle · press play" in the analyser header — mockup has none. Genre CLASSIFIED
row keeps a status dot — mockup omits it. Rail keeps Attach/Clear buttons — mockup has one Send pill
(kept deliberately; removing them = behaviour change). Real `MC_WAVE` greyscale/played-wash still
paints on the now-invisible overlay canvas.
