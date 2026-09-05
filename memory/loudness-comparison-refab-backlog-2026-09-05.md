# Loudness-comparison + reference-track backlog capture (5 September 2026)

Docs-only task on `aimm`, branch `docs-roadmap-capture-loudness-refab-2026-09-05` @ `e3ec321`
(off `main` @ `61671a3`). `index.html` untouched.

**What happened:** Kevin reported Mix Check's Audio Specs "Classified Genre" seemed stuck on Trap.
Investigating the live `index.html` directly (not assuming) found THREE separate,
confusingly-similar loudness/genre controls on the Mix Check tab, only one of which was actually
broken — worth remembering the shape of this kind of bug report: a vague "X seems wrong" often
maps to a *naming collision between multiple real controls*, not a single bug. Genre pill
(`STATE.genre`) was fine; the header "Target" pill turned out completely non-functional — not just
a hardcode bug (`refPopulateOzTargets()` ~line 16247 hardcodes `li>=-8` for Trap/SoundCloud and a
literal `true` for Spotify/Apple) but BOTH UI surfaces that would ever show its output are already
`hidden`/`data-dormant` in the current R3 layout (`r3-platform-targets` ~2773, `mixcheck-r5-legacy`
~2856/2924) — so the feature is invisible regardless of the calculation bug. The Spectral Balance
panel's own dropdown is also confusingly labelled "Target" but does work (compares against a
synthetic `REF_CORRIDORS` curve, not a real reference track).

Kevin then referenced two external tools (loudnesspenalty.com, iZotope's mixing-reference-tracks
blog post) that reframed direction — captured as Backlog 29 (revive+expand the dormant Platform
Loudness table, status "awaiting a Jules mockup" not "not started") and Backlog 30 (real
reference-track A/B for Spectral Balance, explicitly updates the existing dormant P-B/B-P2 item —
cross-referenced both ways, not duplicated). Both explicitly queued by Kevin BEHIND Hope's
intelligence work (items 24/25) — captured now so the insight isn't lost, not reprioritized ahead.

**Reusable:**
- When a task says "find the next free backlog ID," always grep-count the real
  `<article class="card backlog">` elements in DASHBOARD.html to set `count-backlog`, not
  highest-ID+1 — that badge tracks card COUNT, and it was already drifted (27 actual cards vs a
  stale `21` badge before this session) — safest to recompute it from the actual DOM every time
  rather than trust the existing number even in an unrelated docs pass.
- Codex `codex exec -s read-only --skip-git-repo-check -C <dir> "<prompt>" < /dev/null > out.log 2>&1`
  reliably starts but the interactive turn can run well past 2 minutes on a big multi-file review —
  foreground `codex exec` calls got killed by the tool's own timeout (exit 143) mid-answer twice in
  a row even though the actual analysis work in the transcript was already complete and correct.
  Fix: launch with `(... &)` backgrounded, then poll `ps aux | grep "codex exec"` in a loop tool call
  (not a blocking sleep) until the process exits, then read `out.log` — the final verdict is at the
  very end of the file after all the `exec` tool-call echoes.
- `tidy -errors -quiet` / `xmllint --html --noout` flag pre-existing HTML5-vs-legacy-parser noise
  (`<header>` "not recognized", UTF-8 dash mis-decode) on this file that predates any of this
  session's edits — don't treat those as new bugs; verify by tag-open/close count parity in the
  actual diff region instead (887/887 matched here).
- Three-touchpoint Codex review (pre-check existing IDs/wording, diff review, end-to-end pass) all
  came back clean; TP3 flagged the DASHBOARD.html footer "Last updated" line rewrite as an
  "unlisted" change — that's expected and required per `docs/CLAUDE.md`'s standing DASHBOARD
  hard-sync rule, not scope creep; worth pre-empting this same false-positive flag in a future
  three-touchpoint prompt by explicitly telling Codex the footer line is in-scope.

Branch pushed, not merged (Kevin merges docs commits per repo convention, though docs-only pushes
have historically been low-friction). No PR opened — task didn't ask for one, just branch + commit
reported back.
