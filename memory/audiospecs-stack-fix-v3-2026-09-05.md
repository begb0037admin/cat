# Audio Specs label-wrap STACK fix v3 (always stack dot+label / value) — 2026-09-05

Branch `mixcheck-audiospecs-stack-fix` @ `6791954` (pushed, not yet merged), build `2026-09-05.2`.
Fresh branch off the merged v2 dot-alignment fix (`audiospecs-align-v2-plus-default-tab-2026-09-05.md`)
— v2 fixed dot alignment but Kevin's follow-up screenshot showed the wrapping ITSELF was still
broken: labels splitting mid-phrase ("True"/"peak") with the value crammed onto the label's first
line, and values separating from their unit across a line break ("1.0" / "dB").

**Key structural fact that made this a "for every screen size" bug, not a "narrow window" bug:**
`#eq.oz-mixcheck .oz-rail` (which holds `#mcSpecs`) is a FIXED 240px column (`--mc-rail-w`) on every
desktop viewport ≥1024px, regardless of monitor size — a 27" or 40" screen hits the exact same
~100px-per-`.mc-rows`-column squeeze as a narrow laptop window. There is no "wide enough" desktop
case to special-case around; only the <1024px mobile mode (where `#mcSpecs` becomes the full fluid
content width) genuinely varies with window width. Confirmed via headless-Chrome render at 1366px
(a completely ordinary laptop width, nothing exotic) reproducing the bug pixel-for-pixel identically
to 1920/2560/3440px — same failure, because the rail's absolute width never changes above 1024px.

**Fix: make every `.mc-row` unconditionally stack** (dot+label on flex line 1, the FULL value with
its unit forced onto its own line below) instead of trying to prevent wrapping or special-case which
rows are "too long". This generalizes the one row Kevin pointed at as already correct ("Stereo
width": label wraps freely, value/widget sits on its own row below) to every row, rather than only
stacking whichever rows happen to overflow at whatever width gets tested next.

Mechanism (`.mc-row{display:flex;flex-wrap:wrap;...}`):
- `.mc-rl{flex:1 1 0;min-width:0}` — flex-**basis:0** (not `auto`) is load-bearing. `auto` sizes from
  the label's own intrinsic content width; a sufficiently long label can get pushed onto its own
  fresh flex-wrap line before ever shrinking, which defeats "dot+label share line 1" — Codex TP1
  caught this in the plan-review pass before it shipped. `basis:0` always starts at zero and grows
  via `flex-grow` to fill line 1's remaining space, so it reliably stays beside the dot.
- `.mc-rv{flex:0 0 calc(100% - 10px);margin-left:10px;white-space:nowrap}` — a flex-basis of ~100%
  of the row's own width is *always* wider than whatever's left on line 1 after the dot+label, so it
  is unconditionally forced onto a fresh line — no width threshold to tune, no card-width
  special-casing, works identically at 320px and 3440px. `white-space:nowrap` (added per Codex TP1)
  makes "never separate a value from its unit" an absolute guarantee rather than one that merely
  happens to hold for today's value strings.
- The 10px indent (not the `.mc-sw` stereo-width-widget's 15px) is a deliberate, purely cosmetic
  choice to buy a few extra px of width headroom for the value text — not required to visually match
  the widget below it.

**Real value-string safety margin, measured (not guessed) via a hidden-span `getBoundingClientRect`
probe against the actual `.mc-rv` computed font (JetBrains Mono 11px) in the live page:** worst real
case across every `MC_SPECS.populate*`/`refPopulate` value format is the stereo-width "balanced"
qualifier, e.g. `"42% balanced"` at 79.5px, against ~89px available inside even the narrowest
(240px fixed-rail) column — comfortable margin. `"100% balanced"` (86px, would have failed) is an
**impossible** combination: the code's own qualifier logic (`sw>42 ? 'wide' : 'balanced'`) means
anything above 42% always renders the shorter word "wide" instead. Don't stress-test with synthetic
strings that can't actually occur — check the real formatting code first (grep `set('mcWidth'` /
`set('mcSampleRate'` etc.) or you'll chase a fix for a bug that isn't reachable, and burn CSS budget
protecting against it.

**Test harness (reusable):** Playwright + headless Chromium, force-populated `#mcSpecs` row
`textContent` via `page.evaluate` with real-format strings (no need to load an actual WAV/run
analysis), then at each of 16 widths (320 through 3440px) used `Range.getClientRects()` on each
`.mc-rl`/`.mc-rv` to count visual lines and check for vertical-band overlap between a label's line
rects and a value's line rects (the actual, precise definition of "label splits with value wedged
in"). This is far more reliable than eyeballing screenshots — catches the exact failure mode
requested, at every width, automatically. Also checked `scrollWidth>clientWidth` for clipping and
paired-row `dotTop` for alignment (same rig as the v2 fix, extended). Old code: 199 failures across
the 16-width matrix on first run. Fixed code: 0 failures, confirmed three times (after TP1 fixes,
after TP2's comment-bug fix, and final).

**Gotcha caught by Codex TP2 (diff review), not by me:** an inline CSS comment contained a literal
`*/` inside prose (`"...MC_SPECS.populate*/refPopulate fits..."`), which terminates a CSS comment
early — it would have silently broken the `.mc-rv.mc-muted` rule immediately following it in the
stylesheet. A pure syntax-level bug hiding inside documentation prose, invisible to visual/behavioural
testing (the app still "worked", just with the wrong muted-value styling). Lesson: when writing long
inline CSS comments that reference code identifiers containing `*` (e.g. `populate*` as a
glob-ish shorthand for a function-name family), either avoid a following `/` entirely or restructure
the sentence — grep for `*/` inside any newly-added comment prose before treating a CSS diff as done,
the browser gives no warning when a comment closes early.

**Codex three-touchpoint review:** TP1 (plan) GO WITH FIXES — caught the `flex:1 1 auto` risk (fixed
to `flex:1 1 0`) and suggested the `white-space:nowrap` backstop (added). TP2 (diff) GO WITH FIXES —
caught the stray `*/`-in-comment bug (fixed). TP3 (end-to-end, after both fixes + a fresh harness
re-run showing `ALL CHECKS PASSED`) — GO.

Reusable takeaways:
- When a "narrow width" bug report comes in on a card living inside a **fixed-width** rail column
  (check for a `--*-rail-w`-style CSS var before assuming responsive breakpoints are the relevant
  axis), the bug is very likely present at EVERY desktop viewport, not just literally-narrow browser
  windows — test a normal laptop width (1366px) and a big monitor width (2560/3440px) side by side to
  confirm before designing a breakpoint-based fix; a breakpoint fix for a fixed-width problem is the
  wrong shape of solution.
- "Always stack" (unconditional, no threshold) beats "prevent wrapping" or "special-case the long
  rows" as a fix shape when the available width for a `dot+label+value` row cluster is reliably tight
  — it removes the whole bug class the way v2's `align-items:flex-start` did for dot-alignment,
  rather than chasing whichever specific labels the next screenshot happens to catch.
- `flex-basis:auto` vs `flex-basis:0` matters for "does this flex item ever get pushed to its own
  wrap line before shrinking" — `auto` sizes from content and can wrap-away intact; `0` always starts
  from nothing and grows to fill available space, keeping it anchored beside a fixed-size sibling
  (like a dot) on the same flex line.
- Before writing a worst-case test string, read the actual formatting code (the `set('someId', ...)`
  call site) rather than inventing a plausible-looking one — an invented worst case can be either
  unrealistically harsh (wasting fix effort on an unreachable case) or, worse, miss a real
  reachable-but-non-obvious worst case the code's own branching logic would actually produce.
