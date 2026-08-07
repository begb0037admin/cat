# PR #27 merge, EP08 audio push, Desktop shortcut re-point — Cat's first real session, 7 August 2026

Cat's `AGENT.md` existed as of 5 Aug but this was the first task actually routed through the named
agent (everything on 7 Aug up to PR #26 ran through the generic default Claude Code session instead,
per the handoff). Confirms the routing is now live.

## What happened

1. Inherited a handoff from the default session: PR #26 (episode-artwork font OS-detect) already
   merged; PR #27 (Mac launcher GUI fix) open and unreviewed; two local clones of `ai-news-channel`
   in play, one canonical, one stray; untracked EP08 audio never pushed; Desktop shortcut pointing at
   the wrong clone.
2. Did not trust the handoff at face value — re-verified every claim live before contacting Kevin:
   `git remote -v`/`git status`/`git rev-list --left-right --count` at both clone paths, `gh pr view 27`
   for mergeable state, and resolved the actual Desktop alias target via
   `osascript -e 'tell application "Finder" to get POSIX path of (original item of (alias file ...))'`
   rather than assuming from the handoff's description.
3. Kevin approved all three items via a relayed message from the coordinator (his own word was
   "approed" — coordinator read it as "approved" and labelled the message as relayed, correctly, per
   the `feedback_relayed_approval_labeling` convention in Kevin's cross-agent memory). Treated the
   relay as covering exactly the three named items, nothing broader.
4. Executed: `gh pr merge 27 --merge`; committed EP08 audio+WORKFLOW.md on the feature branch first
   (mistake — that branch was already merged and about to go stale), caught it, cherry-picked the
   commit onto `main` directly and pushed from there instead; re-pointed the Desktop alias.

## Confirmed facts / gotchas worth remembering

- **A feature branch is dead weight the moment its PR merges — don't keep committing to it.** Committed
  the EP08 audio to `cat/episode-artwork-mac-launch-gui` out of habit (it was the checked-out branch)
  right after merging its PR. Caught it before pushing: checked out `main`, pulled, `git cherry-pick`
  the commit across, pushed `main` directly. For any future local-clone commit after a PR merge,
  check out `main` first, don't just commit to whatever branch happens to be checked out.
- **`git branch -D` / `git push origin --delete` on a merged branch gets blocked by the auto-mode
  classifier as a destructive git op**, even for a branch that's already merged and safe to delete.
  Not worth fighting — leave the stale branch, it's harmless, don't try workarounds.
- **Resolving a macOS Finder alias's real target via AppleScript**: `get POSIX path of (original item
  of (alias file (POSIX file "<path>" as alias)))` — this often throws error -1728 ("Can't get POSIX
  path of document file...") when the target is a `.command` file, but the error text itself contains
  the full resolved folder hierarchy ("folder X of folder Y of disk Z"), which is enough to confirm the
  real target without needing a clean success. Use the error text, don't treat the error as a failure
  to get the answer.
- **`osascript ... make new alias file ... then set name of newAlias to "X"`** can leave two alias
  files on Desktop — one under the target's original filename, one under the requested new name —
  if Finder doesn't fully complete the rename atomically. Always `ls` the Desktop afterward and remove
  the duplicate; don't assume `set name` fully replaced the auto-generated one.
- **GitHub accepts a 67.69MB raw audio file (`.m4a`) via plain `git push` with only a warning**, not a
  hard block — this repo has no git-lfs configured, and that's consistent with existing convention
  (EP01/EP02/EP05 already commit raw audio directly). Don't treat GitHub's LFS warning as an error to
  fix; it's advisory only, matches how this repo already works.

## Still open / not this session's job

- `~/Projects/ai-news-channel` (the stray clone) — left alone per Kevin's explicit instruction, still
  has an uncommitted, unpushed EP04 font-render-artifact diff. Not cleaned up. Ask again if it becomes
  relevant.
