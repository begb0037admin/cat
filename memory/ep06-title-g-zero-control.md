---
name: ep06-title-g-zero-control
description: "EP06 retitled to 'G-Zero Control' (PR #15), replacing working title 'Is Anyone Still In Control?'; renamed via Git Data API tree rename, not local clone"
metadata:
  node_type: memory
  type: project
  modified: 2026-08-06
---

Kevin/Hope decided the final title for the split-out EP06 (from PR #14): **"G-Zero Control"** — built off Ian Bremmer's own "G-Zero World" term (already core, Kevin-confirmed content, Claim 019 in the current split ledger, originally Claim 033 in the pre-split 33-claim ledger). Opened as PR #15 (`cat/ep06-title-g-zero-control` → `main`) on `begb0037admin/ai-news-channel`, mechanically small, not yet merged as of this write.

**What changed:** folder rename `03_Spotify_Podcast/episodes/EP06_Is_Anyone_Still_In_Control/` → `EP06_G-Zero_Control/` (all 12 tracked files); title text updated in the episode's own `sources/EP06_Research_Ledger.md` header and `editorial/EP06_Episode_Seed.md` Working title line; `STATUS.md`/`HANDOVER.md` references (PR-state note, pipeline table row, the 2026-08-06 split entry) updated; `EP07_AI_Empires/editorial/EP07_Episode_Seed.md`'s own cross-reference to EP06's title updated too (its "Connection to the previous episode" line named EP06 by the old working title — easy to miss since it's in a different episode's folder). `editorial/EP06_Content_Brief.md`, `sources/EP06_Master_Source.md`, `metadata/EP06_Production_Assets.md` were all still blank templates — checked, nothing to update there.

**Method — folder rename via GitHub Git Data API, no local clone, no per-file Contents API delete+recreate:** fetched the full recursive tree for `main`'s latest commit (`git/trees/{sha}?recursive=1`), filtered blob entries under the old folder prefix, built a new tree via `git/trees` (POST, `base_tree` = old tree sha) with entries `{path: old_path, sha: null}` (delete) paired with `{path: new_path, sha: same_blob_sha}` (add) for every file — for the 2 files needing a text edit too, created a new blob first (`git/blobs` POST with base64 content) and used that sha instead of the original. Then `git/commits` (POST, tree=new tree sha, parents=[old commit sha]), then `git/refs` (POST, new branch ref pointing at the new commit), then `gh pr create`. GitHub's diff view correctly shows this as a rename (green "renamed" label) for the 10 untouched files and a rename+modify for the 2 edited ones. This is the reusable pattern for any future GitHub-only folder rename — much more reliable than trying to reconstruct renames via the Contents API path-by-path, and avoids ever touching a local clone per this repo's GitHub-only governance.

**Also confirmed before starting:** no leftover branch/PR from a prior failed attempt at this task existed (checked `gh pr list --search "G-Zero"` and the full branch list) — this was a clean start, not a resume.

**Left deliberately untouched:** `STATUS.md`/`HANDOVER.md` still say "open PR, not merged" in the surrounding EP06/EP07-split narrative even though PR #14 is in fact merged — that staleness is a separate issue from the title text itself and wasn't part of this task's ask; flagged in the PR body, not fixed.
