# MixCheck header re-layout — build 2026-09-02.5

2 September 2026, coordinator-dispatched. Post-fix-round follow-up to the R3
Mix Check redesign, on its own branch `mixcheck-header-relayout` off `main`
@ `83802ae`. Built to Jules's `docs/header-relayout-mixcheck-spec.md`. Commit
`51163ed`, `index.html` only (+ HANDOVER/STATUS docs). Not merged — awaiting
Kevin's render review + his ff-only promote.

## What the change was
- Tab strip: deleted the Mix-Check-only `margin-left` indent rule (~1702) so
  the strip spans the full content column (it is a block child of `.app-col`
  which is `align-items:stretch` → already full width, the indent was the only
  thing offsetting it). Padding `6px 3px → 11px 8px`, `.tab-label` `9px → 10.5px`
  (shared rule, all tabs get taller — intended per spec).
- `.header-actions` (Genre/Target/Settings): Mix-Check-scoped **relocation shim**
  — a new IIFE at the end of `<body>` with a `MutationObserver` on `#eq`'s
  `class` attribute. When `#eq` gains `.active` → move the node into
  `#eq .mc-head`; lose `.active` → move back to `.header-top` (last child).
  Idempotent parent check; close any `.cs.open` popover first.
- WAV loader → transport bar: removed
  `#eq.oz-mixcheck #mcTransport:not(:has(#refDzLoaded.visible)){display:none}`
  so the transport card is always visible on Mix Check. The **existing**
  transport shim was changed to relocate the whole `#refDropZone` (parent of
  `#refDzEmpty` + `#refDzLoaded`) instead of just `#refDzLoaded` — keeps
  `wireDropZone()` (binds `#refDropZone`) intact and makes the empty card the
  drop target. Single `#mcInput` + caption (`#mcCtaSub`) + a down-arrow SVG
  moved statically out of `.mc-head` into `#refDropZone`. `placeMcInput()`
  (MutationObserver on `#refDzLoaded.class`) swaps `#mcInput` between the
  empty-state panel and the end of `.ref-transport`, toggling `#mcInputLabel`
  ("Drop / browse WAV" ↔ "Load WAV"). `refLoadFile()`/`refClearFile()` NOT
  edited — the observer does the reconcile.

## Reusable facts
- **raw.githack `.html` interstitial.** `https://raw.githack.com/<user>/<repo>/<branch>/<file>.html`
  serves a one-time "External Content Notice | rawgit.hack" page (title tells
  you), with a `<button>Open the page</button>`. A headless-Chrome render must
  detect `document.title =~ /External Content Notice/` and click that button,
  then wait ~4s for the real nav. After that it serves the actual file. A
  `file://` render of a clean, just-committed working tree is byte-identical to
  what the branch serves, so `file://` is fine for iteration; do the
  raw.githack pass only for the Kevin-facing shots.
- **AIMM tab `data-tab` map** (not the visible labels): `eq`=Mix Check,
  `chain`=Workbench, `library`=Library, `knowledge`=Insight, `snapshots`,
  `settings`, `voice`=Conversation, `marketing`, `community`. `aichat` exists
  in markup but is a retired tab (no strip button).
- **Robust "is Mix Check active" hook** = `MutationObserver` on `#eq`'s `class`
  attribute. There are 4 code paths that toggle `.panel`/`.active`
  (`index.html` ~5128, ~5615, ~6364, and the main tab handler ~6450) — the
  observer catches all of them without touching any. Switching between two
  non-Mix-Check tabs doesn't mutate `#eq`, so the shim correctly no-ops.
- `MC_WAVE.draw()` / `#mcWave` mount is triggered by `refIdleAnimate()`
  (tab click), `refLiveAnimate()` (playback) and `refLoadFile()` — NOT by
  `#mcTransport` becoming visible. Making the empty transport visible is safe.
- Reusable render+probe script: `scratchpad/relayout-render.mjs` — 3 views
  (Mix Check loaded / empty / Workbench), full-page + crops, console-error
  capture, 3-col-bottom probe, `.header-actions` parent assertion per tab,
  shim exercise (leave + return). `RENDER_URL` / `RENDER_PFX` env override.

## Verification
Codex TP2 read-only (`model_reasoning_effort=low`, BLOCKERS-only): VERDICT PASS.
CDP (headless Chrome 1440×): console clean on load / WAV load / playback /
tab-switch away+back; 3-col align — loaded `mcSpecs=mcActions=hopeRail=1334`,
empty `mcSpecs=hopeRail=1214` (`mcActions` `:empty` hidden, by design);
tab-strip right edge == `#mcTransport` right edge == analyser right edge (1020);
other tabs' `.header-actions` still `.closest('.header-top')`.
