# Two Windows local clones of ai-news-channel consolidated to one — 21 September 2026

Kevin found it confusing that `ai-news-channel` existed as two separate local clones on the
Windows machine: `C:\Users\admin\github\ai-news-channel` (main @ `645727e`) and
`C:\Users\admin\Documents\Codex\Projects\ai-news-channel` (main @ `968c05e`). Verified live
rather than trusting the task brief's "one commit behind" framing: `git merge-base
--is-ancestor` + `git rev-list --count` showed the github clone was actually **23 commits**
ahead, including the entire `tools/voice-replace` pipeline — the Codex\Projects clone hadn't
been touched since 19 Sep.

**Confirmed facts / gotchas:**

- This repo's own governance (`CLAUDE.md`/`GOVERNANCE.md`) explicitly states there is **no
  canonical local working folder** — GitHub is the sole working surface, any local clone is
  transient. An older `HANDOVER.md` entry (~26 Jul) had once designated
  `C:\Users\admin\Documents\Codex\Projects\ai-news-channel` as "canonical local root," but that
  was deliberately removed in a later governance rewrite. Don't trust an old HANDOVER entry's
  canonical-path claim without checking whether a later entry superseded it.
- **Before deleting a "losing" local clone, diff its full tree (not just `git status`) against
  the surviving clone** — `diff -rq --exclude=.git <clone1> <clone2>` — because `.gitignore`
  routinely excludes exactly the large media files a Windows production repo cares about most
  (`*.wav`, `*.mp4`, Waveform/CapCut project files). Here the "losing" clone had a clean git
  working tree but three real gitignored-only files the surviving clone lacked: a 30MB intro
  WAV, two legacy intro/outro MP4s, and an empty template subdirectory — `git status` alone
  would have missed all three, and deleting on git-state alone would have silently lost them.
- **A Desktop shortcut folder's `.lnk` files can hold the stale path in more than one COM
  property independently** — `TargetPath`, `Arguments`, and `WorkingDirectory` are each set and
  must each be checked/replaced separately. An `explorer.exe`-target shortcut (path stored in
  `Arguments`, used for "open this folder" launchers) had its `Arguments` fixed on a first pass
  but its `WorkingDirectory` was missed and only caught by a full regex re-sweep across all
  three properties. Always dump/check all three, not just whichever one seems load-bearing.
- **`HKCU:\...\User Shell Folders\Desktop` can point somewhere other than
  `C:\Users\<user>\Desktop`** (here, OneDrive KFM redirects it to `D:\OneDrive - lelitte.com\
  Desktop`) — meaning a real, non-symlinked `C:\Users\<user>\Desktop` can exist in parallel,
  populated with files (here: a full duplicate 11-shortcut set, dated 2 days prior, same day as
  a "repair Windows paths" commit) that Explorer never shows Kevin. Don't assume the physical
  `C:\Users\<user>\Desktop` folder is empty or irrelevant just because it isn't the live shell
  Desktop — it's real, on disk, and worth checking/fixing too.
- **Deleting a local clone can silently break a script that hardcoded that clone's absolute
  path**, independent of anything Desktop-shortcut related. Found two production `.bat`
  launchers (`Start_Hope_Episode_Editorial.bat`, `Sync_Episodes_To_GitHub.bat`) with a hardcoded
  `$REPO`/`$repo` to the deleted clone's path — grep the *repo's own tracked files* for the
  losing clone's absolute path string, not just Desktop/Documents shortcuts, before considering
  a clone-consolidation task done. Fixed both to self-locate via `%~dp0..\..\..`, matching the
  existing `RunHopeArtworkStudio.bat`/`run.ps1` (`$PSScriptRoot`) convention already used
  elsewhere in this repo — verified the resolution logic in isolation (a standalone `.bat` test)
  before trusting it, rather than only trusting the diff.
- A folder whose own `README.md` is marked **SUPERSEDED** (rejected asset source, "kept as
  historical evidence only") can still accumulate uncommitted raw/source files that were never
  part of the documented deliverable set (here: Canva UI screenshots, intermediate renders,
  dated weeks before the folder was marked rejected). Treat these as a strong signal *not* to
  commit — committing just adds noise to an already-rejected folder — but leave them in place
  (no destructive delete) and flag for the human's own call rather than deciding unilaterally.

confirmed_via: Live `git merge-base`/`git rev-list`/`diff -rq` on both clones, live WScript.Shell
property dumps on 25 shortcuts across 4 directories (`D:\OneDrive - lelitte.com\Desktop\Hope in
AI\`, `C:\Users\admin\Desktop\`, `C:\Users\admin\Documents\Shortcuts\Hope in AI Templates\`,
`C:\Users\admin\Documents\Shortcuts\Quick Links\`), a live HKCU registry read confirming OneDrive
Desktop redirection, and a standalone `.bat`-resolution test (`cmd.exe /c` against an isolated
copy of the fixed path-resolution line). Commits `f012686` (script fix) and `f8892b4`
(HANDOVER/STATUS docs) pushed to `begb0037admin/ai-news-channel` main.
date: 2026-09-21

## Addendum — third clone found and removed (same day, Kevin approved: "yes go ahead and sort it")

- A clone-hunt driven only by Desktop shortcuts and a filename-filtered grep MISSED a third full clone
  (`C:\Users\admin\github\Codex\Projects\ai-news-channel`, plus worktrees) — it surfaced only from a repo-content
  grep. Enumerate clones by `origin` remote URL across every plausible root (`git remote get-url origin` on each dir
  containing `.git`), and run `git worktree list` in each, not just by known paths.
- Worktree `.git` files are pointers (`gitdir: <other clone>/.git/worktrees/<name>`); deleting a parent clone orphans its
  worktrees (`fatal: not a git repository`). Check each worktree's pointer target before deleting anything.
- Before deleting ANY clone, check more than main + working tree: `git log --branches --not --remotes` (unpushed commits on
  any local branch), `git stash list`, `git ls-files --others` AND `--others -i` (untracked plus gitignored). Here that found
  ~6.4 GB of gitignored-only media. I skipped the branch/stash check on the first clone deleted that day — record: not
  proven lossless.
- Consolidate by `mv` (same-volume rename, instant) into the surviving clone under a gitignored recovery folder
  (`99_Archive/recovered-from-...`), byte-compare (`cmp`) anything claimed to be a duplicate first, save an uncommitted
  worktree diff as a patch before `git worktree remove --force`.
- A CRLF-only difference between a worktree and its commit shows as "differs" in `diff -rq`; confirm with
  `diff --strip-trailing-cr` before treating it as real edits.
