---
name: ep06-research-subfolder-template
description: "EP06 NotebookLM discovery prompts saved permanently; episode-folder template gained an 8th standing subfolder (sources/research/) via PR #12, 6 Aug 2026"
type: decision
---

Follow-up to EP06 evaluation and NotebookLM discovery-prompt drafting (same episode thread as agent a140c7d22d31851b8). Kevin approved Option A explicitly: "nest it in sources/ ... and make it permanent — discovery prompts are conceptually part of sourcing ... it should be baked into the template rather than special-cased for EP06."

**What changed (PR https://github.com/begb0037admin/ai-news-channel/pull/12, opened not merged as of 6 Aug 2026):**

- `03_Spotify_Podcast/tools/episode-sync/Prepare-EpisodeFolders.ps1` — `$standardFolders` array gained `'sources\research'` as an 8th entry (after `'sources'`, before `'transcript'`). No other logic changes were needed: `New-Item -ItemType Directory` creates the nested path, and the existing per-folder `.gitkeep` placeholder check runs independently per array entry, so it "just worked" once the array had the new entry.
- `03_Spotify_Podcast/tools/episode-sync/README.md` — documented the new subfolder under the standard-folders list.
- `03_Spotify_Podcast/episodes/EP06_The_AI_Empire/sources/research/EP06_Research_Discovery_Prompt_Part1.md` and `..._Part2.md` — the full-length (non-trimmed) versions of the two NotebookLM discovery prompts, saved verbatim as the durable repo record. The character-trimmed versions Kevin pasted into NotebookLM itself were NOT what got committed here — only the full versions.

**Important scope boundary respected:** the PR does not retroactively touch other existing episodes' `sources/` folders on GitHub. The script is idempotent and Windows-local-execution-only — the next local run of `Prepare_Episode_Folders.bat` (no-arg mode, which sweeps every `EP##_...` folder plus `EPISODE_FOLDER_TEMPLATE`) will backfill `sources/research/.gitkeep` into all of them. That run has to happen on the Windows machine; it wasn't done as part of this task and should be flagged if asked "did every episode get the new folder" — the template/script did, existing folders on GitHub did not (yet).

**Correction to a prior assumption:** the episode-folder provisioning script was assumed to possibly be local-clone-only (per the general "ai-news-channel's local clone has historically run ahead of GitHub" pattern in Kevin's own memory notes). This is NOT true for this specific script — `Prepare-EpisodeFolders.ps1`, its `.bat` launcher, and its `README.md` are all committed to GitHub main and were read/edited there directly via the Contents API. See `memory/index.json` confirmed-fact entry `2026-08-06-episode-folder-provisioning-script-is-on-github-not-local-only` for the evidence trail.

**Why a PR and not a direct push:** `ai-news-channel` added PreToolUse approval-gate hooks on 6 Aug 2026 (per its own governance incident) requiring explicit approval before any Write/Edit/GitHub-mutating call, and this change affects the standing episode template (every future episode), not just EP06 — both reasons independently pointed at "PR for review, not a direct push to main."
