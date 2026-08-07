---
name: status-handover-pr14-15-staleness-fix
description: "PR #16: fixed STATUS.md/HANDOVER.md stale 'PR #14 open, not merged' language flagged (but deliberately left) in PR #15's body"
metadata:
  node_type: memory
  type: project
  modified: 2026-08-07
---

Direct follow-up to `memory/ep06-title-g-zero-control.md`'s own "Left deliberately untouched" note: `STATUS.md`/`HANDOVER.md` still said "open PR, not merged" about the EP06/EP07 split throughout, even though PR #14 (the split itself) had merged 2026-08-06 — flagged in PR #15's body, not fixed there since it was out of scope for that task. Kevin asked for it fixed as a direct follow-up. Result: **PR https://github.com/begb0037admin/ai-news-channel/pull/16**, merged status TBD as of this write.

**What was actually stale, confirmed live before editing (`gh pr view <n> --json state,mergedAt`):** not just PR #14 (merged 2026-08-06T20:18:27Z) — PR #11 (merged 2026-08-06T12:02:04Z) also still had "still open, still draft, nothing has merged" language in `HANDOVER.md`, missed by the PR #15 pass because it wasn't the specific thing flagged. Worth the extra `gh pr view` calls to check every PR number mentioned in the surrounding text, not just the one named in the ask — staleness compounds in a living-log doc where multiple entries reference the same PRs at different points in their lifecycle.

**Method — no local clone, small multi-file text edit via Git Data API:** fetched both files via Contents API, edited locally (Edit tool) in the scratchpad, then pushed via the same Git Data API pattern as the earlier folder-rename task (`git/blobs` → `git/trees` with `base_tree` = current main tree sha → `git/commits` → `git/refs` new branch → `gh pr create`). For a same-name, same-path text-only edit (no rename) this is more machinery than needed — the Contents API's per-file PUT (get current sha, PUT new content) would have worked with fewer calls. Used the tree method anyway for consistency with the established pattern and because two files needed updating in one atomic commit. Note for next time: **a plain text edit to 1-2 existing files, no renames, is a case where the simpler Contents API PUT is the better default** — reserve the full tree-rebuild method for renames/moves or larger batches.

**Editorial judgment call, flagged in the PR body, not just silently done:** while fixing the flagged staleness, also caught and fixed an *unrelated* ambiguity in `STATUS.md`'s Known Open Items — a bullet about a local-only `EP06_Opportunity_Leaderboard` PDF that, read plainly, could be misread as referring to the *current* EP06 (G-Zero Control) when it's actually tied to the jobs episode's old EP06 number (now EP08). This wasn't explicitly asked for but fell under the task's step 3 ("check for other stale references... fix those too if found") — included it, called it out explicitly in the PR body rather than burying it in an unrelated-looking diff line.

See also: `memory/ep06-split-into-ep06-ep07-ep08-renumber.md` and `memory/ep06-title-g-zero-control.md` for the full history this doc-fix follows up on.
