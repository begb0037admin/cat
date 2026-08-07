---
name: pr20-episode-folder-template-sources-research-gitkeep
description: "Closed the PR #19-flagged gap: EPISODE_FOLDER_TEMPLATE/sources/research/.gitkeep added, PR #20, 7 Aug 2026"
type: decision
---

Fast-follow to PR #19 (see `memory/pr19-backfill-sources-research-ep01-05-ep08.md`). That PR backfilled `sources/research/.gitkeep` into six live episode folders but explicitly left `EPISODE_FOLDER_TEMPLATE/sources/` itself untouched, flagging it as a possible fast-follow — the PR #12 template change only ever lived in `Prepare-EpisodeFolders.ps1`'s `$standardFolders` array, never in the template folder's actual GitHub contents.

**What changed (PR https://github.com/begb0037admin/ai-news-channel/pull/20, opened not merged as of 7 Aug 2026):**

Added `03_Spotify_Podcast/episodes/EPISODE_FOLDER_TEMPLATE/sources/research/.gitkeep` on a new branch (`fix/episode-template-sources-research-gitkeep`), via `gh api .../contents/... -X PUT` (single-file create, not the tree-batch technique — only one file this time). Opened as a PR against `main`, no direct push, per this repo's approval-gate governance.

**Confirmed a real inconsistency in this repo's `.gitkeep` convention — worth knowing before touching either family of file again:**
- Inside `EPISODE_FOLDER_TEMPLATE/` itself, the existing `.gitkeep` files (`artwork/.gitkeep`, `transcript/.gitkeep`) are **truly empty, 0-byte files** — blob sha `e69de29bb2d1d6434b8b29ae775ad8c2e48c5391` (the well-known git empty-blob hash). Confirmed by reading both directly via the Contents API before adding the new one, and the new `research/.gitkeep` landed on the identical sha by PUTting empty content — content-addressing did the consistency-check for free.
- Inside individual episode folders (e.g. EP01's `transcript/.gitkeep`), PR #19's memory note recorded a **different** sha, `8b137891791fe96927ad78e64b0aad7bded08bdc` — a 1-byte file containing a single newline.
- So the template folder and the provisioned episode folders do NOT use byte-identical `.gitkeep` placeholders. Not a functional problem (both are empty-for-git-tracking purposes), but if a future task diffs or scripts against `.gitkeep` shas across the repo, don't assume one sha applies everywhere — check the specific folder family first, same as this task did.

**Scope note:** did not touch `Prepare-EpisodeFolders.ps1` (already correct since PR #12) or attempt to reconcile the two `.gitkeep` byte-conventions — out of scope for what was asked, flagging only.
