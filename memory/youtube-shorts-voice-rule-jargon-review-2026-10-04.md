# YouTube Shorts voice-rule jargon review — 4 October 2026

Kevin wrote a standing voice rule (`04_YouTube_Channel/docs/YOUTUBE_SHORTS_VOICE.md`,
commit `0e20e08`): "explain it like you're 10" — any term needing tech literacy
("AI agent," "model," "fine-tuned," "inference") must be defined in plain words in
the same breath it's used, or cut and described instead. He found the gap himself
on the one published Short (LANE2_01): "nobody told them to" implies agent autonomy
but never states plainly what an AI agent actually is.

## What this task actually required — three different treatment tiers by publish status

- **Published** (LANE2_01, `04_YouTube_Channel/shorts/LANE2_01_AI_Agents_Went_Rogue.md`,
  section 4 v2): propose text only, do not touch the file. Drafted a one-clause
  insertion into the hook line, marked clearly NOT APPLIED, for Kevin's own
  later-turn approval.
- **Drafted, not yet locked** (LANE2_02/03/09): may edit directly, minimal
  inserted clauses only, note exactly what changed and why. Found a real gap in
  LANE2_02 ("a swarm of AI agents" used with zero definition, twice, right in the
  hook) — fixed with a single inserted clause. LANE2_03 and LANE2_09 had NO gap
  under this specific rule: neither script's spoken narration uses "agent,"
  "model," "fine-tuned," or "inference" at all — they're built entirely from
  already-plain institutional/political language (accord, regulator, auditor,
  board, "human control," "no brakes"). Don't force an edit where the rule
  genuinely doesn't apply — not every script needs a change.
- **Unreviewed research batch, not yet decided whether to produce** (LANE2_04-08):
  flag only, no edits. Found two genuine flags: LANE2_04 uses "an OpenAI agent"
  in the script before its plain-language clarification lands two sentences
  later (borderline — the explanation does arrive, just not "in the same
  breath"); LANE2_08 uses "AI compute" unexplained in the payoff line. LANE2_05,
  06, 07 pass as written (06's "superintelligent AI" is arguably borderline too —
  flagged but judged acceptable since the next clause immediately describes the
  behaviour in plain terms rather than naming the abstraction).

## Reusable pattern for future voice-rule reviews

Check every sentence of the *spoken script only* (not Sources/Fact notes, which
aren't narrated) against the rule's named-example term list (agent, model,
fine-tuned, inference) plus any clearly equivalent jargon (compute, swarm used
as a pure-count noun without the "many AI programs" gloss, superintelligence).
A term followed immediately by a plain-language description of what it *does*
often satisfies the rule even without naming the gloss explicitly — judge by
whether a literal 10-year-old would get the surprise, not by a strict
word-for-word definition requirement.

## Local clone state note (separate finding, flagged for whoever next touches
D:\ migration follow-up)

HANDOVER.md's 2026-09-24 entries say `C:\Users\admin\github\ai-news-channel` was
deleted and `D:\Hope in AI\ai-news-channel` is the sole clone. As of 4 Oct 2026,
**both exist** — `C:\Users\admin\github\ai-news-channel` is back, on `main`,
clean, exactly matching `origin/main`. `D:\Hope in AI\ai-news-channel` is on a
stale feature branch (`cat/youtube-growth-plan-27sep`), 12 commits behind
`origin/main`, with uncommitted changes. Used the C: clone for this task since
it's the one that actually matches origin. Not resolved or investigated further
— flagged only, per this agent's standing git-sync-surfacing rule.
