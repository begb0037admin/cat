---
name: mixcheck-r3-round2-computed-style-diff
description: "17 August 2026, MixCheck R3 round 2: built a real computed-style diff tool instead of a third screenshot review; found and fixed 3 real layout bugs screenshots had missed twice; fixed the Hope panel icon set"
type: fact
---

Follow-up to `mixcheck-six-decisions-spectral-ribbon-fix.md` and the two prior
MixCheck R3 review rounds. Kevin's independent pass on round 2 (v2 review
page) found the Hope panel icon set still wrong and couldn't confirm
spacing/column-layout fidelity from a screenshot — two rounds of "here's a
screenshot, looks close" had already missed real gaps, so this round's
instruction was explicit: stop reviewing by eye, build a numeric
computed-style diff tool (headless-render both the reference and the build,
hand-map ~30 element pairs across the whole MixCheck screen + Hope rail,
diff `getBoundingClientRect()` + computed margin/padding/gap/border-radius/
font-size/line-height, output a mismatch-only table) and iterate against it
until clean.

## Confirmed fact — the reference mockup needs a real HTTP origin, not file://, and breaks under a blanket host-resolver-rules flag

`docs/mockups/ozone-redesign-v1.dc.html` is a Claude-Artifact "dc" component.
Its own `support.js` runtime does `fetch(location.href)` internally (to
re-read its raw source, since the browser-parsed `innerHTML` of the `<x-dc>`
custom element gets mangled). Two things silently break this:

1. **`file://` origin.** Chrome's `fetch()` from a `file://` document can't
   fetch another `file://` URL by default (no explicit error state visible
   in a screenshot — the element just never gets defined, `<x-dc>` stays
   `display:none` forever, `customElements.get('x-dc')` returns undefined).
   Every child element still exists in the DOM (so `getComputedStyle` returns
   real values) but every `getBoundingClientRect()` comes back `{0,0,0,0}` —
   that split (real computed style, zero rect) is the actual tell.
2. **A blanket `--host-resolver-rules="MAP * 0.0.0.0"` Chrome launch flag**
   (used in the prior session's headless-Chrome recipe to kill slow/blocked
   CDN lookups) maps `localhost` too, so switching to a local HTTP server to
   dodge problem #1 fails with `ERR_ADDRESS_INVALID` unless that flag is
   dropped from the Chrome launch entirely for this kind of session.

Fix: serve both the reference and the build over a real `python3 -m
http.server <port>` rooted at the scratch directory, and launch headless
Chrome with **no** `--host-resolver-rules` flag. Once rendered this way,
`support.js` replaces `<x-dc>` with `#dc-root > div.sc-host > div` holding
the real rendered content — that's the correct root selector for building
element-pair mappings, not `x-dc > div` (which only matches the pre-render
placeholder). Confirmed via a live DOM probe before writing selectors, not
assumed from reading the file.

## Confirmed fact — three real, independently-fixable layout bugs the diff tool found (screenshots had missed both times)

1. **Header grid columns.** `.oz-header-wrap` used a 2-column
   `grid-template-columns:minmax(0,1fr) 220px`, unrelated to the reference's
   own 3-column `236px 1.7fr 320px` header grid. Made `.header-top` stretch
   to ~1111px (should be a fixed 236px, aligned with the left rail) and
   `.rt-status-strip` sit at a fixed 220px instead of 320px. Fixed by
   copying the reference's exact column template and moving
   `.rt-status-strip` to `grid-column:3`.
2. **Tab button padding.** Ozone tab-strip padding was `6px 14px`; reference
   is `6px 16px`. Small (2px/side) but real and cheap to fix.
3. **A real, previously-undisclosed feature bumping card height.** Each of
   the 4 left-rail meter cards carries a real "Manual override" input row
   (`.meter-override`) adding ~28px of height the reference design doesn't
   have. Not the same item as the already-accepted "real meter sub-labels"
   gap from the v1/v2 review pages — a genuinely new finding. Hidden via the
   same established `#eq`-scoped CSS-only pattern already used for the
   Troubleshooter grid and the two comparison tables (not deleted — real
   feature, real wiring, still reachable by dropping one rule).

Also fixed: a stray `#eq .oz-targets-table tr:first-child td{border-top:0}`
override the reference doesn't have (its first row is bordered same as the
rest); and a global `body{line-height:1.5}` reset leaking into every Ozone
text element where the reference relies on the browser default `normal` —
fixed once with a 3-selector scoped reset (`.oz-header-wrap, #eq,
#hopeRail{line-height:normal}`) rather than patching each element.

## Confirmed fact — most remaining deltas after those fixes are architectural, not bugs, and needed explicit per-property acceptance to reach a clean table

The final mismatch table only comes back empty once ~60 rows are excluded
via an explicit, reasoned allowlist (`diff_pairs.js` `ACCEPTED_DIFFS`) — not
by loosening tolerance. Four repeating root causes covered nearly all of
them:

- **Persistent-rail width reservation.** The Hope rail is a real docked
  sidebar reserving 320+2px of page width via `body.rail-open{padding-
  right:322px}` (Kevin, 2026-06-11: "keep this static on every page"). The
  reference fakes its 3rd column with an absolutely-positioned overlay that
  reserves no real width. This alone explains most `rect.w` deltas on every
  center-column element.
- **Real vs fixed sample content.** The reference hardcodes a handful of
  sample bubbles/readings; the build renders a real WAV analysis or a real
  (differently-sized) conversation. Same category as the already-accepted
  "real meter sub-labels" item — just showing up as a height delta instead
  of a screenshot difference this time.
- **Absolute-overlay export vs real flow.** The reference's Hope-Analysis
  bar, Mix Issues bar, and Spectral Balance card are `position:absolute` in
  the static export (a `.dc` artifact quirk — baked left/top only, real
  document position is inert). Their margin/padding-adjacent-to-siblings
  values aren't meaningfully comparable against a real flexbox column.
- **Padding split across sibling boxes.** The reference puts one 14px
  padding on a single outer Hope-panel box; the build's rail has the head
  row and the body as *siblings* (required so `.aichat-layout` can be
  physically relocated into `#hopeRailBody` — see the HOPE RAIL comment in
  `index.html`), so each pads itself independently. Net visual inset ends
  up close (10px vs 14px) but every individual padding/margin/height number
  differs.

**Generalisable lesson:** once you have a real numeric diff, "make the
table empty" only via genuine fixes is the wrong bar for elements that are
real-content-driven or genuinely differently-architected (docked rail vs
static overlay). The right bar is: fix every case with a clear right
answer, then explicitly name and justify every remaining case rather than
loosening the comparison tolerance to hide them — an unexplained tolerance
bump would silently mask a future real regression in the same property.

## Confirmed fact — the Hope panel icon-set fix, mapped real functions onto real reference icons instead of inventing a 4th

Reference shows 4 icons (bookmark/save, download, image, search — read from
`docs/mockups/ozone-redesign-v1.dc.html` lines 222-225, exact SVG paths).
Build showed 3 unrelated emoji icons (document/sparkle/trash). Fix mapped
each REAL existing feature to its closest reference slot rather than
padding: `#aiChatToJournal` (save-to-Snapshot) → bookmark/save,
`#aiChatImportPlugins` (parse-and-add-to-library) → download,
`#aiChatImageBtn` (real Attach-screenshot button, physically moved out of
the composer's send-col into this row) → image, and a **new** button
(`#aiChatWebSearchToggleBtn`) driving the pre-existing `#aiChatWebSearch`
checkbox (same checked state, same `onchange` persistence handler — no new
feature, just a second real affordance for an existing one) → search.
`#aiChatClear` (Clear chat) has no real match among the reference's 4 and
was hidden from this row only (still fully functional on the classic,
non-rail Conversation surface) rather than force-mapped onto a mismatched
icon — the exact judgment call the brief asked for when a real 4th action
doesn't cleanly exist. Icon glyphs themselves were switched from CSS
`content:'<emoji>'` to `content:url("data:image/svg+xml,...")` using the
reference's own SVG paths verbatim, for an exact visual match rather than
an emoji approximation.

## Outcome

Mismatch table came back empty (only explicitly-accepted architectural
rows remain) after 3 rounds of fix → re-run. Confirmed zero overlap with
any `ELEVENLABS`/`REALTIME VOICE`/`elStart`/`elEnd`/`rtStart`/`rtEnd`/
`TOOL_DEFS` markers via a full diff against the session-start baseline.
Not pushed to GitHub — same gate as both prior rounds, ends at Kevin's
review.
