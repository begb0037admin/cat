---
name: pr21-ep06-ep07-content-briefs
description: "PR #21: filled in EP06 and EP07 Content Briefs (Kevin-approved content), resolving each Episode Seed's open approval gate; confirms single-file Contents API PUT is the right tool when replacing a blank placeholder"
metadata:
  node_type: memory
  type: project
  modified: 2026-08-07
---

Kevin approved the Central Question / Thesis / Mechanism / Human Stakes / Skeptical Case / Hope's Landing / Conversation Arc / Avoid content for EP06 ("G-Zero Control") and EP07 ("AI Empires") directly in a task prompt (not drafted by Cat — Kevin supplied the substance, Cat's job was formatting + filing). Result: **PR https://github.com/begb0037admin/ai-news-channel/pull/21** (branch `cat/ep06-ep07-content-briefs` off `main`), open, not yet merged.

**What changed:** `03_Spotify_Podcast/episodes/EP06_G-Zero_Control/editorial/EP06_Content_Brief.md` and `03_Spotify_Podcast/episodes/EP07_AI_Empires/editorial/EP07_Content_Brief.md` — both previously the blank generic `Hope in AI Content Brief` template (identical placeholder content/SHA in both files, confirmed by fetching each first) — now filled in, matching `EP05_Who_Really_Controls_AI/editorial/EP05_Content_Brief.md`'s actual structure exactly (Central Question, Thesis, "The Mechanism, In Order" numbered, Human Stakes, "Skeptical Case (Adam's Job)", "Hope's Landing (Not a Bow)", Conversation Arc numbered, Avoid bullets) rather than the generic template's own section names (Hook/What Changed/Why It Matters/etc — the generic template and EP05's actual shape have diverged, EP05's is the one to follow per the task instruction).

**Path correction worth remembering:** the task described the target paths as `EP06_G-Zero_Control/editorial/EP06_Content_Brief.md` (i.e. relative to `episodes/`), but the real repo path needs the `03_Spotify_Podcast/episodes/` prefix — confirmed via a full recursive tree fetch (`git/trees/main?recursive=true`) before assuming the shorthand path was literal. Worth doing this check any time a task gives an abbreviated episode path.

**Conversation Arcs were not given verbatim — derived from each episode's own "Mechanism, In Order" list**, matching EP05's arc style (recap/frame → skeptic challenge → walk proof points in order → acknowledge tension without resolving → land on human stakes → close tying back to the previous episode). Used the exact "Last time, we asked..." callback lines already drafted in each Episode Seed's "Connection to the previous episode" field (EP06→EP05, EP07→EP06) as the arc's opening beat — those seeds had already done this framing work, no need to invent new callback language.

**Method — plain Contents API PUT per file, not the Git Data API tree/blob method.** Both target files were single, independent edits to already-existing (placeholder) files in different folders — no rename, no cross-file coordination — so the simpler `contents/{path}` PUT (branch param, base64 content, existing file's `sha`) was the right tool, confirmed against `memory/status-handover-pr14-15-staleness-fix.md`'s existing guidance that Contents API PUT is the better default for single-file edits and the tree/blob method is for renames or multi-file-in-one-commit atomicity. Branch created first via `git/refs` POST off `main`'s HEAD sha, then two independent PUTs to that branch, then `gh pr create`.

**Left for a future task, flagged in the PR body:** each Episode Seed's own "Approval status" line still says "draft — awaiting... Content Brief approval" — this PR doesn't update that line (out of scope for "write the two briefs"), so a follow-up should close that loop once Kevin/Hope confirm the merge, and then proceed to each episode's Master Source per `PRODUCTION_PROCESS.md` step 4.

See also: `memory/status-handover-pr14-15-staleness-fix.md` (Contents-API-vs-tree-method guidance this confirms), `memory/ep06-ep07-notebooklm-source-pass-pr18.md` and `memory/pr20-episode-folder-template-sources-research-gitkeep.md` (most recent prior EP06/EP07 pipeline work).
