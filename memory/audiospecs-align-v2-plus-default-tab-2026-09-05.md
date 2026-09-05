# Audio Specs label-align fix v2 (align-items:flex-start) + default-tab-on-load, bundled

2026-09-05, aimm Mix Check `#mcSpecs` card, branch `mixcheck-audiospecs-label-align` @ `5f74cc9`
(pushed, not yet merged). Follow-up to the 2026-09-04 two-row `:has()` fix (see
`audiospecs-label-align-css-grid-gotcha-2026-09-04.md`) — Kevin found a THIRD row (True peak vs
Headroom) breaking the same way at a narrower window, proving the two-row scope didn't generalize.

**Real root cause, found via headless-Chrome render + getBoundingClientRect diffing (not CSS
reading):** `.mc-row` used `align-items:center`. Two `.mc-row`s sharing a grid row get
`align-self:stretch`-ed by CSS Grid to the *same* box height (the taller row-partner's height,
whichever one wraps). But `align-items:center` then centres each row's OWN content (dot+label+value)
within that shared box height *independently* — a row whose own label is now 2 lines centres its
dot/value against ITS content's height, which happens to equal the shared box height, so it looks
fine in isolation; a single-line row-partner ALSO gets stretched to that same taller height and also
centres its (shorter) content within it. In most cases both end up centred at the same absolute
y-coordinate (this is why a synthetic headless test with placeholder values initially found NO
misalignment at all — the grid-stretch mechanic quietly saves it most of the time). The failure only
shows up with specific real value/label-length combinations at specific widths — not reliably
reproducible with arbitrary "realistic-looking" sample values, which makes this class of bug
deceptively hard to catch with a single synthetic test. **Fix (width-independent, no wrap-prevention
needed): switch `.mc-row` to `align-items:flex-start`, add `.mc-d{margin-top:4px}` to visually centre
the dot on the first text line.** Now every row's dot+label+value start flush with the row's top edge
regardless of content height — wrapping becomes cosmetically harmless (grows downward only) instead
of something to prevent. This removes the entire class of bug, not just the specific rows caught so
far. Confirmed via render+measurement at 8 widths (1920/1600/1366/1280/1024/900/700/375px, spanning
both the desktop 240px-fixed-rail layout and the <1024px mobile full-width `#mcSpecs` layout): every
row-partner pair's dot top-edge is pixel-identical (diff 0.0) at every width, no `.mc-rv` value ever
clipped.

**Gotcha found while implementing:** adding `min-width:0` to `.mc-rl`/`.mc-rv` (trying to be extra
safe against grid blowout, learned from the 2026-09-04 memory) actually caused visible horizontal
text overlap between label and value once `align-items` changed to `flex-start` — with `min-width:0`
the flex items can shrink below their own longest-word width, so text overflows its own box
horizontally into the neighbour's space (looks like "RMS−14.2 dB" glued together). Removing the
unnecessary `min-width:0` (not needed at all with this approach — nothing here forces nowrap, so
there's no blowout risk to guard against) fixed it. Lesson: `min-width:0` is a real fix for a REAL
blowout risk (nowrap-forcing scenarios), not a defensive default to sprinkle everywhere — it has its
own regression mode (text overlap) when the actual failure mode isn't a blowout.

**Bundled in the same commit (Kevin's instruction, both delivered together on one branch):**
DASHBOARD.html Now item 13 — Mix Check should be the default tab on cold load, not Conversation.
The dashboard's own item-13 body text had already flagged the real risk correctly: "the Mix Check
engine lazy-inits on first click, so switching the default also needs an on-load init check." Found
3 real `.tab[data-tab="eq"]` click-gated lazy-inits via grep: `troubleInit` (Troubleshooter),
`eqGridInit` (Mastering Reference drag-grid), `refIdleAnimate` (paints `#specCanvas` corridor +
`#mcWave` — canvas has zero size while its panel is `display:none`, so this literally cannot run
before the panel becomes visible). Simply hardcoding the `active` class on `#eq`/its tab button
without ALSO firing these three once on cold load would have shipped a Mix Check tab that LOOKS
active but has an unpainted spectral corridor and no working Troubleshooter/Mastering-Reference drag
until the user manually clicks away and back. Fix: added one guarded one-liner next to each existing
click-listener (`if (eqTabBtn && eqTabBtn.classList.contains('active')) setTimeout(fn, 0/60)`) — all
three functions are independently idempotent (`troubleInit`/`eqGridInit` both check their own
`initialized` flag first; `refIdleAnimate` just redraws) so firing them an extra time from a later
real click is harmless. Verified via headless render: `#specCanvas` sized 854×200 and non-blank after
cold load with zero JS errors, `TROUBLE_SECTION.isInitialized()` and `EQGRID.initialized` both true.
**Also found: the `.header-actions` (Genre/Target/Settings) relocation shim near end-of-body already
runs unconditionally once at script-execution time (not only via its MutationObserver on `#eq`'s
class) — so it needed no change; a genuinely different pattern from the 3 lazy-inits above (delayed
DOM query gated purely on a live class check at call time, not a one-time click-only event).** Always
check whether a "reacts to `#eq.active`" pattern is genuinely click-only before assuming it needs the
same on-load-fire treatment — some already self-check current state at execution time.

Codex three-touchpoint review: TP1 (read-only, before implementing, given the chosen approach and
the 2026-09-04 memory's rejected-approaches as context) CONFIRMED the flex-start mechanism generalizes
via CSS Grid's default `align-self:stretch`. TP2 (diff review, after implementing both fixes) PASS.
TP3 (full end-to-end, final gate) PASS — no `.mc-row`/`.mc-d` cascade conflicts elsewhere in the
~9000-line stylesheet, lazy-init guards verified idempotent by reading the actual function bodies, no
voice/chat code touched, AIMM_BUILD format and DASHBOARD.html badge/card-meta conventions consistent.

Reusable takeaways:
- For `.mc-row`-style dot+label+value alignment problems in this card, prefer `align-items:flex-start`
  + a small `margin-top` on the dot over any wrap-prevention approach — it's genuinely width-
  independent and removes the whole bug class instead of chasing individual rows.
- A synthetic headless-render test with "realistic-looking" placeholder values can fail to reproduce
  a real align-items:center + CSS-Grid-stretch misalignment bug even when the underlying CSS is
  identical to the reported-broken state — because the grid-stretch mechanic coincidentally saves
  alignment in many value/width combinations. Don't conclude "bug not reproducible, ship as is" from
  one synthetic pass; if the report is credible and specific (two named rows), trust it and look for
  the general mechanism rather than the specific numbers.
- `min-width:0` is not a safe default to add pre-emptively "just in case" of grid blowout — it has
  its own failure mode (text overflow/overlap into a sibling flex item) when the layout doesn't
  actually need it.
- Before hardcoding a different default-active tab in `index.html`, grep for
  `.tab[data-tab="<id>"]` click listeners — any of them gating a real init (canvas paint, drag-grid
  setup, tile-section boot) needs a "fire once if already active on cold load" companion line, or the
  new default tab will look active but be functionally half-initialized until the user manually
  clicks away and back.
