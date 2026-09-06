# Fix Queue "Analysing…" stuck-placeholder safety net — 6 September 2026

Kevin's live repro (two screenshots: Hope's chat with a full spoken answer, and the Fix Queue
card still stuck on the placeholder) diagnosed correctly on first pass — confirmed via Codex TP1
against the live code before writing anything. Root cause: `MC_FIXMOVES.generate()` in
`index.html` (~line 17606 at the time) has an early-return guard for "no Anthropic key configured
/ nothing queued yet" that skipped the honest fallback text ("Ask Hope to talk through the move…")
the same function's own `finally` block already applies on a failed/unparseable API call — so the
card could get stuck on `MOVE_PENDING` forever with no retry path. Fix: apply the same fallback in
the early-return branch too. One-line-of-reasoning, ~10-line diff.

**The deeper ask (feed Hope's live `propose_mix_move` answer into the Fix Queue card) was
investigated and NOT force-fixed** — `propose_mix_move`'s `bus` argument (master/vocal/808/
drums/fx) and the Fix Queue's `key`/`focusBand` taxonomy (clips/crushed/mono/quiet/muddy/808/
harsh/band-* × low/lowmid/mid/high/broadband) don't correspond 1:1, and `propose_mix_move` has no
`fix_id` argument at all (unlike `mark_fix_applied`, which does). Flagged as a follow-up
UX/tooling decision for Kevin (should `propose_mix_move` gain an optional `fix_id`?) rather than
guessing a fragile mapping. This is a reusable pattern: when a task's "real gap" spans two
independently-evolved taxonomies with no natural correlation key, check for an existing sibling
tool's id-passing convention (here, `mark_fix_applied`'s `fix_id`) before concluding no mapping is
possible — the absence of that same convention on the sibling tool is itself the evidence there's
no clean fix, not just an assumption.

**Bigger lesson — the aimm local clone is a LIVE SHARED working directory across concurrent agent
sessions**, not something safely dedicated to one session's task. Mid-task, a concurrent Markey
session checked out `markey-hopewave-gain-tune-2` in the exact same clone at
`/Users/admin/Documents/Claude/Artifacts/aimm`, which silently moved my HEAD, auto-stashed my
uncommitted work (correctly labeled "not mine"), and later left a second uncommitted Markey edit
(Hope-rail AGC gain live-tune) sitting in the working tree that I had to stash without touching his
branch (to avoid stomping his session if it was still live). Full write-up + the concrete
`git status`/`git reflog` checks to run: see the confirmed-fact entry
(`2026-09-06-aimm-local-clone-is-shared-live-across-concurrent-agent-sessions-checkouts-race` in
`memory/index.json`).

Codex three-touchpoint review (TP1 plan / TP2 diff / TP3 end-to-end) all passed clean on this fix.
Branch `cat-fixqueue-stuck-placeholder-safety-net` pushed off `main` @ `20c9384` (main had moved
since the task brief's `2c98bfd` — Markey's AGC gain fix merged mid-task; re-verified
`git log origin/main` fresh before pushing rather than trusting the brief's SHA). Build
`2026-09-06.4`. ROADMAP.md item 33 / DASHBOARD.html Now-card 33 / STATUS.md top entry all updated
per the hard docs-sync rule. Also recovered an unrelated pending docs edit (Backlog 22 priority
bump) that was sitting uncommitted in the same working tree from an earlier session and got
auto-stashed during the branch-switch chaos — restored it rather than letting it get lost.
