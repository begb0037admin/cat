---
name: pr19-backfill-sources-research-ep01-05-ep08
description: "Backfilled sources/research/ (empty, .gitkeep) into EP01-EP05 and EP08 episode folders, PR #19, 7 Aug 2026"
type: decision
---

Follow-up task to the EP06 research-subfolder template change (see `memory/ep06-research-subfolder-template.md`). That PR (#12) made `sources/research/` an 8th standard subfolder in `Prepare-EpisodeFolders.ps1` but only created it live for EP06/EP07 (the split of the original EP06) — it explicitly did not retroactively touch other episodes, and flagged that the next local `.bat` run would need to backfill it. No such local run had happened by 7 Aug 2026.

**What changed (PR https://github.com/begb0037admin/ai-news-channel/pull/19, opened not merged as of 7 Aug 2026):**

Added an empty `sources/research/.gitkeep` to six folders: `EP01_AI_Agents_Now_Build_Themselves`, `EP02_The_Void_Behind_the_AI_Voice`, `EP03_The_Agentic_Age_Is_Here`, `EP04_Is_Claude_A_Weapon`, `EP05_Who_Really_Controls_AI`, and `EP08_AI_Will_Take_These_Jobs_First` (confirmed EP08 was missing it too — it predates the EP06 split and wasn't touched by PR #12, but is a currently-active-numbering episode). `EP06_G-Zero_Control` and `EP07_AI_Empires` were left alone — already populated from PR #12.

**Confirmed technique — batching multiple new-file adds across different folders in one API round trip without a local clone:**
1. Confirm the repo's `.gitkeep` convention first — checked an existing empty subfolder (`EP01.../transcript/.gitkeep`) and found it's the standard "1-byte, single newline" blob, sha `8b137891791fe96927ad78e64b0aad7bded08bdc` (the same well-known git blob hash used across countless repos for an empty-with-newline placeholder file). Because git blobs are content-addressed, this sha already exists in the repo's object database — no need to create a new blob per file, just reference the existing sha in each new tree entry.
2. Get `main`'s HEAD commit sha (`git/refs/heads/main`), then that commit's `tree.sha`.
3. `git/trees` POST with `base_tree` set to that tree sha and a `tree` array of the N new file paths, each `{path, mode: "100644", type: "blob", sha: <the known .gitkeep sha>}` — one call adds all N files at once, across as many different existing folders as needed, without touching anything else in the tree.
4. `git/commits` POST with that new tree sha and `parents: [main HEAD sha]`.
5. `git/refs` POST to create a new branch ref pointing at the new commit (`refs/heads/<branch-name>`).
6. `pulls` POST (`head: <branch-name>`, `base: main`) to open the PR — never push straight to main, per this repo's own governance (PreToolUse approval-gate hooks + PR convention already established for PR #12 onward).

This is faster than one `create_or_update_file` call per folder (which was the fallback the task description offered) when adding several files across several folders at once, and avoids any local clone.

**Flagged, not actioned:** `EPISODE_FOLDER_TEMPLATE/sources/` itself still does not have a `research/` subfolder on GitHub — the PR #12 template change lives in the provisioning script's `$standardFolders` array, not in the template folder's actual GitHub contents. Left out of scope for this task since it wasn't requested, but noted in the PR #19 description as a possible fast-follow.
