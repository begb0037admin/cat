# MixCheck R3 round 5 — verbatim transplant, live build, one caught bug

17 August 2026. Round 4's independent review found rounds 1-3 never produced
a real committed build — every "build" panel in the review pages was a
baked screenshot, and `aimm/index.html` had never been committed with any
redesign changes. Kevin's round-5 brief supplied the literal reference
markup/CSS/canvas-JS pasted directly into the task, with an explicit
instruction: transplant it verbatim into `#eq`, wire real data in, don't
re-derive from a screenshot again.

## What actually worked

**Started fresh from `index.original.html` in the `aimm` scratch folder**
(pristine pre-round-1 copy), not the abandoned round 1-4 WIP file also
sitting in that folder (`aimm/index.html`, 15798 lines vs original's
15138). Confirmed `index.original.html` is byte-identical (mod CRLF) to
`aimm-repo/index.html` on `main` via `diff --strip-trailing-cr` — i.e. the
scratch "original" and the real committed `main` were the same starting
point. Worked directly on `aimm-repo/index.html` (the real git clone)
rather than copying files around.

**Verified the reference file before trusting it.** Kevin's pasted markup
had `position:absolute;left:...;top:...` on some elements that the flow-
layout version in the task text didn't — read `docs/mockups/ozone-redesign-
v1.dc.html` directly and confirmed it's a browser-computed-style snapshot
(the assistant who pasted it into the brief had normalized it back to flow
layout for readability, and said so). Structurally identical once you
account for that. Don't skip this check — the round-4 brief's whole point
was "verify against the live thing, not a description of it."

**Reused real element ids inside the new markup instead of writing new
binding code.** The pre-existing BS.1770-4 engine's `refPopulate()`/
`refEvalPills()` write into specific ids (`refLufsInt`, `refTruePeakTag`,
`mip-clips`, etc.) via `document.getElementById(id).textContent=...`. Giving
the *new* reference-shaped markup those exact same ids meant the real
analysis engine needed zero rewiring — it just started painting into the
new shell. Much lower-risk than writing parallel update logic.

**Hid real functionality with no reference counterpart via a new
`.oz-legacy-hide{display:none!important}` class, not deletion.** Manual
meter overrides, the loaded-file transport view, the live-input device
picker, the real Tonal-Balance FFT spectral card, the Troubleshooter grid,
both full data tables — all still in the DOM, still wired, just invisible.
Same established pattern prior rounds used (dormant-wrap), just a class
instead of the `hidden` attribute since these needed CSS-only hiding
without breaking existing `.classList.add('visible')` toggle calls.

**Ported the reference's canvas animation verbatim, per the brief's own
explicit split:** the reference's Spectral Balance canvas is a stylised,
non-data-driven wave animation (sin/kick/bass/shimmer maths), not real FFT.
The brief separately asked for real data in the LOW/MID/HIGH boxes below
it. Ported the canvas math unchanged; wrote a *new* small function
(`ozBandDelta`) reusing the existing `corridorAt()`/`refActiveCorridor()`
helpers to get real corridor-delta numbers for those boxes. Don't try to
make the decorative canvas itself data-driven when the brief didn't ask for
that — re-deriving "what the curve should look like" from a screenshot is
exactly the failure mode rounds 1-4 got shamed for.

## Bugs actually caught (both by rendering, not by reading the code)

1. **A CSS comment containing a literal `*/` inside prose
   (`.ref-*/.card/.symptom-grid`) silently truncated the comment early.**
   Everything from that point until the next `}` got swallowed as one giant
   invalid selector, which dropped ~35 rules including
   `.oz-legacy-hide{display:none!important}` — with ZERO console error,
   because CSS parsers recover silently. Confirmed via
   `document.styleSheets[0].cssRules` in headless Chrome (the rule simply
   wasn't registered) after a `getComputedStyle` check showed `display:
   block` where it should've been `none`. **Never write a CSS comment
   containing the literal two-character sequence `*/` anywhere in the prose
   — even mid-sentence, even meaning something totally unrelated to code.**
2. **`#eq.oz-mixcheck{display:grid}` was more specific than the base
   `.panel{display:none}` rule, so MixCheck rendered on every tab regardless
   of `.active`.** This is the SECOND time this exact class of bug has hit
   a Cat MixCheck session — see `headless-chrome-screenshot-for-ui-
   approval.md`'s "id-scoped override rules can outrank existing un-scoped
   modifier classes" from the day before. **Standing rule now: any new
   `#id.class{display:...}` rule touching a tab-panel's root element must
   be written as `#id.class.active{display:...}` from the start, never
   bare — check this specifically, every time, don't rely on remembering
   it from last time.**

Both were caught by actually rendering the file (headless Chrome
screenshot of the *default* landing tab, not just the target tab) and
comparing — confirms the round-4 brief's core thesis that self-report
without a live render misses real gaps.

## Live-build hosting without touching GitHub Pages settings

Pushed to a new branch (`r3-preview`), then used
`https://raw.githack.com/<owner>/<repo>/<branch>/<path>` as the live URL —
proxies `raw.githubusercontent.com` content with real `text/html` MIME (the
direct `raw.githubusercontent.com` URL serves `text/plain`, so a browser
just shows source text, not a render — confirmed both ways with a headless
screenshot). Githack shows a one-time "Open the page" anti-abuse splash on
first visit to a repo/branch; there's no header-only bypass, a human click
is required. This avoids ever touching the repo's actual Pages source
(which only serves one branch — `main` — and switching it would take the
real production site offline while testing). Good default answer to
"host a non-main branch live" without repo-settings risk.

## Verification technique for functions defined inside a closure

The BS.1770-4 engine's update functions (`refPopulate`, `refEvalPills`)
are private to a `(function(){...})()` IIFE, not on `window`. To verify the
new markup's ids actually receive real data (not just "doesn't crash"),
patched a *test-only* copy of the file to add
`window.refPopulate=refPopulate;window.refEvalPills=refEvalPills;` right
before the IIFE's closing `})();`, then called them from an injected
`<script>` after page load. Never do this to the shipped file — it's a
verification scaffold only, thrown away after the screenshot.

## Codex review in this sandbox

`codex exec -s read-only` on the first attempt tried to fetch
`agent-commons`' `MEMORY.md`/`SESSION_PROTOCOL.md` over what looked like a
local proxy (`127.0.0.1:9`, refused) and separately tried to `git apply` the
diff file I'd pointed it at rather than just reading it — produced nothing
useful. A second attempt with explicit "don't touch git, don't fetch any
URL, just read this file" instructions worked properly — it read the diff,
grepped for function-definition/call-order consistency itself via
PowerShell, and returned a real (if minimal) "no further issues found."
Lesson: don't trust a first Codex non-finding in this environment at face
value if its own tool-call log shows it never actually opened the file —
re-prompt more explicitly rather than reporting the empty result as real
signal.
