# Cat

Kevin Lelitte's dedicated agent for general product engineering on `aimm` (AI Mix Masters) and `ai-news-channel` (Hope in AI). Born 5 August 2026, built from `begb0037admin/agent-template` — same file layout, same working method, same discipline as Adam, Lauren, Drew, Markey, and Matthew before it.

**Cat was named before this repo existed.** `begb0037admin/markey`'s own `AGENT.md`, built two days earlier, already referred to "Cat" as the owner of `aimm`'s general product engineering and `ai-news-channel` — this repo is that reservation made real.

**Everything about Cat lives here, in GitHub, deliberately — not only on any one machine.** This repo is the source of truth for who Cat is and what they've learned. A local file is required for Claude Code to invoke Cat as a subagent, but that file is a synced copy of `AGENT.md` below.

## What's here

| File | Purpose |
|---|---|
| `AGENT.md` | Cat's current persona — scope, working method, non-negotiables. Mirrored to the local Claude Code agent file. |
| `MEMORY.md` | Index of prose lessons Cat has learned. Read at the start of every task. |
| `memory/*.md` | Individual prose entries — decisions, gotchas — written at the end of a task. |
| `memory/index.json` + `memory/search.js` + `memory/candidate.js` + `memory/CANDIDATE_TEMPLATE.md` | Confirmed-fact memory (BM25-style search, judgment-gated writes) — the brief-converge pattern, reused via `agent-template`. |

## Scope — the Markey boundary, not a small-start boundary

Unlike most of Kevin's agents, Cat doesn't start narrow within one repo — it starts with two full repos (`aimm`'s general product, all of `ai-news-channel`) minus one carved-out feature (`aimm`'s embedded voice/chat code, which stays Markey's). See `AGENT.md`'s Scope section for the exact line, and `memory/growth-plan.md` for how that boundary was set at founding.

## How Cat actually works

1. **Bootstrap** — reads `MEMORY.md` + relevant `memory/*.md`, runs `node memory/search.js` for confirmed facts, checks `agent-commons` for cross-cutting lessons, then reads the domain's own live source of truth — for `aimm` specifically, that means `docs/CLAUDE.md`/`docs/STATUS.md`/`docs/ROADMAP.md`/`docs/HANDOVER.md`, never the superseded root-level files of the same names.
2. **Work** — following the non-negotiables in `AGENT.md`: verify against live systems, GitHub-only writes for Cat's own artifacts, show significant changes before pushing, never touch Markey's voice/chat feature code.
3. **Compound** — before finishing, Cat writes anything worth remembering back to `memory/` — prose for one-offs, a `candidate.js`-added confirmed fact for anything reusable and provable, and up to `agent-commons` too if it's cross-cutting. This is what makes Cat's knowledge compound across sessions instead of resetting every time.
