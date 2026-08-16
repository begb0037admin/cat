# MixCheck six-decisions pass — spectral ribbon fix + CSS box-shadow leak (17 August 2026)

Continuation of a prior Cat session that was killed mid-task (last visible
action: `refPopulate` platform-targets checkmarks). All prior work survived
as local scratch files and was reused, not rebuilt from zero — confirmed via
`node -c`-equivalent checks (no JS exceptions on load) and direct grep of the
existing `#eq .oz-*` DOM/CSS against Kevin's six explicit decisions (header
chrome, Hope-panel restyle, hidden manual overrides, 4-zone Spectral Balance
+ LOW/MID/HIGH boxes, Hope→Spectral→Mix-Issues order, hidden
Troubleshooter/tables). All six were already implemented in the inherited
scratch `index.html` — the session's real work was verification + two
genuine fidelity fixes found by direct render comparison, not by trusting
the prior session's own screenshots.

## Confirmed fact 1 — the mockup's spectral curve is a blurred "ribbon" around the line, not an area-fill

`docs/mockups/ozone-redesign-v1.dc.html`'s canvas `draw()` never fills from
the curve down to the bottom of the canvas. It builds a closed band shape
(`bandPts` = top path + reversed bottom path, roughly `h*0.1`-ish half
thickness) and fills that band with two passes: `ctx.filter='blur(4px)'` +
flat `rgba(90,169,230,.35)`, then `ctx.filter='blur(1px)'` + clip + a
vertical linear gradient across the *whole canvas height* (not the band).
Only after that does it stroke the actual line (blurred glow pass + crisp
`#f2fbff` pass on top). The inherited `refDrawCanvas()` in `index.html` was
doing a plain area-chart fill (curve → clip → gradient → fill to bottom),
which reads completely differently on screen (flat gradient wedge vs a
glowing ribbon that hugs the line) even though the colour stops were
copied correctly. Screenshotting and cropping just the chart region side by
side against `mockup_render.png` made this obvious in under a minute — the
colour-hex-matching alone did not catch it. Fixed by reproducing the same
band-shape + two-blur-pass technique, keeping the line's actual Y position
100% driven by real analysis data (`pts`/`corr`/`offset`) and treating only
the band's half-thickness as a stylistic constant (same category as the
mockup's own hardcoded `BAR_THICK`). Confirmed via Codex touchpoint (GO) and
a fresh headless-Chrome crop comparison.

**Generalisable lesson:** when a mockup's canvas/SVG art has a distinctive
"glow" or "band" treatment, don't assume matching the colour stops is
enough — read the actual draw/paint call sequence (blur passes, what shape
is filled vs stroked, in what order) and reproduce the *technique*, not just
the palette. A side-by-side cropped screenshot catches this in seconds;
reading the CSS/JS in isolation does not.

## Confirmed fact 2 — `.btn.purple`'s `box-shadow` survives a more-specific `background` override

The Hope rail's icon-button row reused the app's pre-existing
`.btn.purple{background:#a855f7;...;box-shadow:0 0 0 1px #c084fc inset}`
class on two of three buttons (`#aiChatToJournal`, `#aiChatImportPlugins`).
A new rule `.rail-body .aichat-bar button{background:#232629;...}` has
higher specificity (0,2,1 vs 0,2,0) and correctly overrode the `background`,
but declared no `box-shadow`, so `.btn.purple`'s `box-shadow:...inset` kept
rendering — producing two buttons with a dark fill but a leftover purple
ring/border, inconsistent with the third (plain grey) button and with the
mockup's uniform icon row. Fix: add `box-shadow:none !important` (plus a
`:hover` variant) to the more-specific override rule. **Lesson: when
overriding a "themed" button class (anything with its own `box-shadow`,
`text-shadow`, or `filter`), check computed style for ALL box properties,
not just the ones your new rule explicitly sets — background-only
overrides can leave a decorative box-shadow ring behind as an orphaned
visual artifact.** This is a different failure mode from the
already-recorded "#id-scoped rule outranking an un-scoped modifier class"
gotcha (see `headless-chrome-screenshot-for-ui-approval.md`) — that one was
about *which* rule wins; this one is about a *partial* override leaving
some properties from the losing rule's declaration block still active
(box-shadow isn't a shorthand that background resets).

## Process confirmation — Windows headless Chrome CDP needs absolute `--user-data-dir`

`chrome.exe --headless=new --remote-debugging-port=<p> --user-data-dir="./relative/path" ...` launched via the Bash tool's `run_in_background` silently exits (code 21, no log output) on this Windows machine when
`--user-data-dir` is a relative path — this environment resets cwd between
Bash calls (documented elsewhere), so a relative path resolves against the
wrong directory or fails outright. Always pass an absolute Windows path
(`C:/Users/...`) to `--user-data-dir` for headless Chrome launches here.
Confirmed working: `chrome.exe --headless=new --remote-debugging-port=9444
--user-data-dir="C:/Users/.../chrome_profile_xyz" --window-size=1700,1200
--no-first-run --no-default-browser-check --disable-gpu about:blank`,
verified via `curl http://localhost:<port>/json/version`.

## Outcome

All six decisions verified implemented and both fidelity fixes applied in
the scratch copy only (`.../scratchpad/aimm/index.html`). Codex read-only
touchpoint returned GO. Confirmed zero overlap with any
`ELEVENLABS`/`REALTIME VOICE`/`elStart`/`elEnd`/`rtStart`/`rtEnd` markers
(Markey's voice code) for every edit made this session. **Not pushed to
GitHub** — per explicit instruction, this pass ends at Kevin's screenshot
review, same gate as the prior session's structural rebuild.
