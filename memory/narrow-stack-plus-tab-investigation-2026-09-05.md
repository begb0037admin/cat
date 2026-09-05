# Audio Specs narrow-width stacking fix + default-tab-regression investigation (no code bug found)

2026-09-05, aimm Mix Check `#mcSpecs` card. Two follow-ups to the same-day dot-alignment session.

## 1. Narrow-width label/value stacking — branch `mixcheck-audiospecs-narrow-stack` @ `f74e1da`

The merged `align-items:flex-start` dot-alignment fix (see
`audiospecs-align-v2-plus-default-tab-2026-09-05.md`) held DOT alignment but not READABILITY: at
narrow `#mcSpecs` widths a wrapped label still sat side-by-side (flex row) with its value, so label
word 1 + the whole value landed on line 1, label word 2 alone on line 2 below — reads as broken.
Reproduced exactly at a 320px viewport (296px card, matching Kevin's screenshot description of
"roughly 300-320px").

**Fix:** `.mc-rows` gets `container-type:inline-size;container-name:mc-rows`. A
`@container mc-rows (max-width:460px)` rule restructures `.mc-row` from a flex row into a CSS grid
(`grid-template-areas:"dot label" "dot value"`) — dot spans both rows pinned to the top via
`align-self:start`, label gets its own row free to wrap to N lines, value gets a SEPARATE row below
with `white-space:nowrap` + ellipsis fallback (safe here, unlike the 2026-09-04 rejected attempt,
because the value's grid column is `minmax(0,1fr)` capped to its own row — it can't blow out the
outer `.mc-rows` 2-column track). Threshold (460px on the `.mc-rows` container, NOT viewport) found
via CDP-driven real-width tests, not media-query guesses: inline mode confirmed clean down to a 420px
container; stacked gated at 460px for headroom. **The fixed 240px desktop rail is ALWAYS in stacked
mode — it was never actually a "wide" case**, since `.mc-rows` inner width there is only ~212px.

**Reusable technique — headless Chrome's `--window-size` floors at 500px, CDP does not.** Confirmed:
`--headless=new --window-size=320,700` silently clamps to `window.innerWidth===500` regardless of the
requested value (tested 340/320/300/280, all landed at 500). An `<iframe>` trick to sandbox a narrower
inner viewport also failed (`--dump-dom` doesn't descend into iframes, and file:// cross-frame is
flaky even with `--allow-file-access-from-files`). What actually works: launch
`--headless=new --remote-debugging-port=9333 "--remote-allow-origins=*"`, connect via
`websocket-client` (Python) to the tab's `webSocketDebuggerUrl`, and call
`Emulation.setDeviceMetricsOverride({width:<any value>, height, deviceScaleFactor, mobile:false})`
BEFORE `Page.navigate` — this genuinely renders at the requested width, confirmed working down to
200px. `Page.captureScreenshot` off the same CDP session gives real screenshots at that exact width.

**Verified:** 19 widths (200–1920px) via CDP + `getBoundingClientRect`: zero rows show label/value
interleaving or a value split across lines at ANY width, dot-row alignment (0.0px diff) holds
including exactly at the inline/stacked mode transition (~510-520px viewport), no card or row ever
overflows (`scrollWidth<=clientWidth`). Codex TP1 CONFIRMED the container-query mechanism; TP2 found
two real comment-accuracy issues on first pass (a stale "no row special-cased"/"never clipped" claim
that now contradicts the new nowrap/ellipsis rule; imprecise "full width" language when it's really
"full content-column width") — both fixed, re-verified PASS; TP3 end-to-end PASS.

## 2. Default-tab-on-load "still shows Conversation for returning users" — investigated, no code bug

Coordinator relayed a claim (via Kevin) that build 2026-09-05.1's Mix-Check-as-default-tab fix
doesn't work for real users with existing localStorage, only for fresh profiles, and asked me to find
"whatever persists/restores the last active tab" in `index.html`.

**Exhaustive search found no such mechanism.** Enumerated every `localStorage.setItem/getItem` call
in the file (both literal-string keys via grep, and the handful of JS-variable-named keys read
manually: `STORAGE_KEY`='trapMasterState_v1', `AICHAT_HISTORY_KEY`, `EL_LAST_CALL_KEY`,
`FLOAT_MIC_POS_KEY`, `aimmTabOrder_v1`, `hopeRoadmapCaptures_v1`) — none of them read a "last active
tab" value or call `.classList.add('active')`/`.click()` on a tab unconditionally at load.
`aimmTabOrder_v1`'s replay function (`aimmReplayTabOrder`) only reorders the tab BUTTONS in the DOM
via `appendChild` (visual position), never touches `active` classes. The only places that
programmatically switch tabs are explicit user-action handlers (recall pill click, ask-Hope-handoff,
genre-picker-apply, `switch_tab` client tool) — none run at page load.

**Acceptance test built and run twice, both passed cleanly (Mix Check stayed active):**
1. Inline same-document seed (localStorage set via a `<script>` right after `<body>`, before the
   page's own scripts run) with `trapMasterState_v1` (chain/genre/journal/etc.), `aimmTabOrder_v1`
   with `'voice'` first, `FLOAT_MIC_POS_KEY`.
2. A more rigorous version using CDP's `Page.addScriptToEvaluateOnNewDocument` (genuinely runs BEFORE
   ANY page script, the most faithful simulation of a real returning-user's persisted state) with a
   fuller seed: chain/favorites/symptoms/journal-with-favourite/knowledge/profileFacts,
   `aimmTabOrder_v1` with voice first, float-mic position, `trapMasterAiChatHistory_v2`,
   `aiMixMastersElevenKey_v1`, `aiMixMastersLastCall_v2`. Run against BOTH the local branch AND
   **directly against the live production URL** (`https://begb0037admin.github.io/aimm/`) — both came
   back `activeTabDataTab:"eq"`, confirming the deployed app is unaffected by any realistic persisted
   state.

**Also directly confirmed the live deploy is correct and current:** `curl -sI` on the live URL showed
`cache-control:max-age=600` (10 min — not a plausible "months of staleness" cache) and
`last-modified` matching the merge time; fetched the live bytes and diffed them byte-identical against
`origin/main`. No stale-CDN-cache theory holds up either.

**Real, concrete, and much more likely candidate found instead:** `docs/preview/r3-live/index.html`
is a FROZEN snapshot from build `2026-08-17.3` (last touched 2026-08-17, per
`mixcheck-r5-verbatim-transplant-live-build.md` — built specifically to give Kevin a stable non-`main`
"live" review URL via raw.githack/GitHub Pages during the R3 mockup round, deliberately NOT synced
going forward). This frozen file still literally hardcodes `class="tab oz-tab voice-tab active"` on
Conversation and has no Mix Check default fix at all — served at
`https://begb0037admin.github.io/aimm/docs/preview/r3-live/index.html`, a DIFFERENT URL from the real
app root. If Kevin has this URL bookmarked/muscle-memoried from the R3 review period (plausible: it
was built explicitly as "the" live link to check during that round) rather than the actual root
`https://begb0037admin.github.io/aimm/`, every visit there will show Conversation as active forever,
completely independent of any real-app fix — and would exactly explain "works in a fresh profile,
fails for a returning user" if the returning-user test used a bookmark/habit and the fresh-profile
test used a freshly-typed root URL. Flagged to the coordinator/Kevin rather than "fixed" — it's an
intentional historical snapshot, not a bug, and I can't confirm which URL Kevin actually used without
him telling me.

**Reusable takeaways:**
- Before accepting a "returning user only" bug report as a code-level persistence bug, rule out
  MULTIPLE-URL confusion first (frozen preview/snapshot pages living in the same repo/site under a
  different path) — it's cheap to check (`grep` the repo for other `index.html`-named files serving
  old builds) and can fully explain a "some users, not others" pattern with zero code changes needed.
- `Page.addScriptToEvaluateOnNewDocument` (CDP) is the correct way to seed localStorage before a
  page's own scripts run, for a genuine "does persisted state change first-load behavior" test — a
  same-document inline `<script>` seed placed early in `<body>` is a reasonable approximation but CDP's
  mechanism is more faithful and worth using when the stakes are "prove a negative."
- Always verify the LIVE deployed bytes directly (`curl`/CDP-fetch, diff against the branch) before
  concluding "the fix isn't really live" vs. "the fix is live but something else is wrong" — this
  determined the entire direction of the investigation.
