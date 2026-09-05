# Docs-only roadmap capture while another session has a dirty local index.html (2026-09-05)

**Context:** dispatched to do a docs-only ROADMAP.md/DASHBOARD.html/STATUS.md backlog capture on
aimm, explicitly told to stay disjoint from a concurrent index.html fix another Cat session was
running. The shared local clone at `/Users/admin/Documents/Claude/Artifacts/aimm` had an unstaged
`index.html` modification mid-session (later confirmed to be Markey's live `hopeRailStatusTxt`
work, then the local `main` branch itself changed to `hope-rail-empty-greeting` between my checks —
concurrent sessions really do mutate the shared clone's working tree and current branch under you).

**Fix: use `git worktree add <path> -b <branch> origin/main`** instead of `git checkout -b` in the
shared clone. This gives a fully isolated working directory + index on a fresh branch off
`origin/main`, so a dirty/foreign `index.html` in the main worktree can never block the checkout or
leak into your branch. Clean up after with `git worktree remove <path>` — do NOT `git checkout` or
`git stash` in the shared clone to "make room," since that's someone else's in-progress edit.

**Reusable Codex-review catch:** `DASHBOARD.html`'s `card-continue` buttons use
`onclick="continueInCowork(\`...\`)"` — a double-quoted HTML attribute wrapping a JS template
literal. Any literal `"` inside the backtick string (e.g. quoting an item name like
`"Multi-stem Mix Check"`) terminates the HTML attribute early, since HTML parsing doesn't know
about JS nesting. This bug already existed pre-2026-09-05 (item 22's button) and Codex TP3 caught
it as a blocker even though it wasn't introduced by my diff — worth a drive-by fix when adjacent
code is touched. When adding new `card-continue` buttons, never wrap an item/section name in
double quotes inside the template literal — use no quotes or single quotes instead.

**Codex touchpoint timing:** each `codex exec -s read-only` review pass in this session took
2-5 minutes and reliably blew past the 120s foreground timeout, moving to background every time.
Plan for `run_in_background`-style waiting (a genuine blocking `until ! kill -0 <pid>` loop) on
every touchpoint call for a docs-review-sized diff, not just large code diffs.
