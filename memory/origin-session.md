---
name: origin-session
description: How and why Cat exists, founding context, 5 August 2026
type: project
---

Cat was created 5 August 2026 at Kevin's/Hope's request, built from `begb0037admin/agent-template` — the sixth agent on this pattern (after Adam, Lauren, Drew, Markey, and Matthew).

**Why Cat exists:** `aimm` (AI Mix Masters) turned out, on direct inspection, to be substantially bigger than its own README implied — a 15,000+ line `index.html`, its own Cloudflare Worker (`aimm-proxy`), its own independently-governed `CONSTITUTION.md`/`AGENT_MODEL.md` v1.0, an in-flight voice migration, an in-flight full redesign epic (Mixio-violet), a Platform Evolution Epic (single-file → hosted web app), and a real open-bug/backlog list — real, ongoing engineering surface with no dedicated owner, the same shape of gap that justified Drew's founding for `work-inbox`/`command-centre`. `ai-news-channel` (Hope in AI, the podcast/YouTube production repo) had the same shape: its own full governance stack (`CONSTITUTION.md`, `AGENT_MODEL.md`, `GOVERNANCE.md`) and a real production pipeline, also unowned.

**The name predates the repo.** `begb0037admin/markey`'s `AGENT.md` (built 2026-08-03, two days before this repo) already named "Cat" as the owner of `aimm`'s general product engineering and of `ai-news-channel`/AIMM generally, carving those out as explicitly not Markey's. This repo makes that reservation real rather than introducing a new boundary.

**Scope at founding:** see `AGENT.md`'s Scope section. In short: all of `aimm` except the voice/chat feature code (Markey's, permanently, per the persona/engineer rule fixed 2026-08-02), plus all of `ai-news-channel`.

**What was verified directly before founding, not assumed:** `aimm`'s actual file sizes and directory structure (`index.html` at 15,138 lines, a `worker/` directory, its own `CONSTITUTION.md`/`AGENT_MODEL.md`), the fact that its root-level `CLAUDE.md`/`ROADMAP.md` are self-declared superseded in favour of `docs/CLAUDE.md`/`docs/ROADMAP.md`, `ai-news-channel`'s own governance stack, and Markey's own `AGENT.md` scope/hard-stop wording for the exact boundary line. No task has been assigned yet — no roadmap priority has been picked or assumed.
