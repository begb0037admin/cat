---
name: pr28-youtube-shorts-production-process
description: "PR #28, 24 Aug 2026 — built the YouTube Shorts production process + five EP01-EP05 proof-of-concept briefs, at Kevin's direct instruction following Ashley's same-day strategy diagnosis"
type: project
---

Kevin directed a pivot of Hope in AI's growth effort toward YouTube, starting with Shorts, with a repeatable process analogous to the Spotify episode pipeline. This resolves the exact gating decision Ashley's `hope-in-ai-growth-agent` strategy diagnosis (`growth-briefs/2026-08-24-strategy-diagnosis-spotify-youtube.md`, same day) had flagged: "producing genuine Shorts is new production work Cat doesn't currently have built, so this needs your and Hope's sign-off on scope before Cat builds anything." Kevin's task instruction in this session *is* that sign-off — no separate confirmation step was needed before starting.

**What was built**, on branch `cat/youtube-shorts-production-process`, PR #28 (https://github.com/begb0037admin/ai-news-channel/pull/28), not yet merged:

- `04_YouTube_Channel/docs/SHORTS_PRODUCTION_PROCESS.md` and `SHORTS_BRIEF_TEMPLATE.md` — the process. Core design call: a Short is always built from Hope's own **solo closing "Signal Takeaway" segment** (the standing closing template in `02_Templates/Hope_in_AI_Show_Bible.md`) from an already-published episode — verbatim only, never paraphrased, matching the anti-slop evidence discipline used for full episodes. This is what makes the whole thing genuinely zero-new-research: no new Research Ledger, no new Content Brief, no new Master Source needed, because nothing new is being claimed.
- `04_YouTube_Channel/shorts/EP0[1-5]_Short01_*.md` — five ready-to-generate briefs. Each script was hand-extracted from that episode's own `03_Spotify_Podcast/episodes/EP0X.../transcript/*.docx.md`, keeping only Speaker 1 (Hope)'s consecutive lines.

**Reusable technique confirmed:** every one of these five episodes' closing "Signal" segments is Hope solo (Speaker 1), self-contained, and thesis-encapsulating by construction — the Show Bible's own closing template guarantees this. Scanning transcript tails for the Signal Takeaway is a fast, reliable way to find Shorts-ready material in any future episode without reading the whole transcript.

**Real gotcha caught, not assumed away:** EP04's transcript has *three* speakers (Speaker1/2/3), not the usual two — its single strongest line ("Whoever gets to decide that something counts as a weapon holds real power...") belongs to Speaker 3, not Hope (Speaker 1). Don't assume Speaker 1 is always the only source of good lines, or that "Speaker 1 = Hope" holds without checking per-episode — it held for all five here, but EP04 specifically has extra speakers in the mix and needed the attribution checked line-by-line near the closing segment.

**Aspect-ratio gap, flagged not solved:** `CHARACTER_SHEET.md`'s locked Hedra settings are "4:3 · 720p" (landscape) — there is no existing precedent in this repo for 9:16 vertical Hedra/Flow output. Every brief tells Kevin to check Hedra's own UI for a portrait option first, with a CapCut crop-to-fill fallback documented. Whoever next actually generates one of these should record which option Hedra actually offered, so future Shorts briefs don't have to re-ask this.

**Not done:** no Hedra/Flow/CapCut generation happened — Cat has no access to those manual tools, by design (`AGENT.md`'s own non-negotiables). All five briefs are drafts only; every Publish Brief section explicitly records "Not yet given" for publish approval.
