# Runpod stem-separation feasibility — aimm Backlog 34 (2026-09-21)

Kevin asked whether Runpod could deliver AIMM's not-yet-built stem separation. Investigation only,
nothing built. Full findings pushed to `aimm/docs/RUNPOD-GPU-RESEARCH-BRIEF.md` (findings note
appended, commit `f6b9546`), plus dated entries in `docs/STATUS.md`, `docs/ROADMAP.md` item 34, and
`DASHBOARD.html` card 34 — same session, all four files.

**Substantive findings (durable, worth remembering for any future aimm-backend or Runpod task):**
- Stem separation is NOT built. It's "Option B" inside Backlog 22 (Multi-stem Mix Check), explicitly
  deferred behind Option A (manual stem upload, which shipped 2026-09-07), no scheduled date.
- AIMM's only backend surface as of this check is the `aimm-proxy` Cloudflare Worker — a pure
  API-key relay for Claude + ElevenLabs calls. No storage, no auth, no job queue. Confirmed directly
  against `index.html` (1.2MB, fetched via `raw.githubusercontent.com` since the Contents API silently
  returns no content for files >1MB — `encoding:"none"`, size field still populated, no error, easy to
  miss): zero `BiquadFilterNode`/`OfflineAudioContext`/`AudioWorklet` matches (no real-time DSP at all
  yet, only analysis), zero `R2` matches. This means ARCH-1 (Backend Foundation, the Platform Evolution
  Epic's own stated "gate for all subsequent ARCH stages") is still unbuilt — a fact worth checking
  before proposing ANY server-side/GPU feature for aimm, not just this one.
- Runpod serverless is a plausible, arguably good compute-layer fit for a GPU-bound job like Demucs
  (cheap, pay-per-second, matches AIMM's bursty usage) — but it only ever substitutes for the ARCH-2
  compute step. It does not remove the ARCH-1 gap. Don't let "Runpod could run this" read as "so aimm
  could ship this soon" — the backend prerequisite is the real cost, not the GPU spend.
- Kevin's own local RTX 3070 is already capable of running Demucs — but **this angle was explicitly
  retracted same session**: Kevin clarified AIMM is intended to be monetized, so stem separation must
  work for any user on any computer via the app, not depend on Kevin's own hardware. Do not propose a
  "run it on Kevin's local GPU" workaround for any future AIMM product feature without checking whether
  the same monetization constraint applies — it likely does, for anything user-facing.
- Revised findings pushed same day (commit `525104d`, superseding but not deleting the first pass):
  live GPU pricing (pulled by the coordinator, not by Cat — see tooling facts below) puts RTX 4090
  serverless at $1.10/hr and RTX A5000 serverless at $0.69/hr, both HIGH availability, 24GB VRAM —
  ample for Demucs. Serverless (per-second billing), not a rented "secure" pod, is the right RunPod
  product type for a bursty multi-user feature — don't conflate the two; ai-news-channel's own
  confirmed $0.74/hr figure was a rented pod's on-demand rate, a different product type, not directly
  comparable to the serverless number that actually matters for cost-per-song. At ~1 min inference,
  cost lands around $0.011–$0.018/song — compute is cheap; the backend (auth, R2 upload, job tracking,
  a usage ledger for future monetization) is the real engineering cost, not GPU spend.

**Confirmed tooling facts:**
- The RunPod MCP tools named as available for this session (`runpod-usage`, `runpod-mcp`, `runpodctl`,
  `flash`, `runpod-templates`) never resolved for this Cat subagent — tried `ToolSearch` nine different
  ways total across both passes (tool names, generic terms, `mcp__runpod` prefix guess), all empty.
  Root cause confirmed, not just "unavailable": `claude mcp list` shows the plugin server "✔ Connected"
  at transport level (and RunPod OAuth was already completed once, in a prior `ai-news-channel` session
  per that repo's own `tools/voice-replace/RESUME.md`) — but a direct unauthenticated probe of
  `https://mcp.getrunpod.io/` returns `{"error":"Missing or invalid Authorization header..."}`, i.e. the
  server needs the OAuth bearer token that only the coordinating/top-level session holds; a Bash-shelled
  subagent has no way to present it, and the tool schemas never surface via ToolSearch as a result. This
  is a **subagent tool-allowlist gap, not a missing sign-in** — Cat's own AGENT.md tool grant
  (Agent/SendMessage/ToolSearch/Bash/Read/Write/Edit/Glob/Grep/WebFetch) never included RunPod tools.
  Don't spend more time re-searching for these tools from inside Cat — ask the coordinator (or whichever
  session actually has them granted) to pull live RunPod data instead, same as this session ended up
  doing. Also: **never touch 1Password CLI (`op`) to chase a credential for this** — Kevin's explicit
  instruction, mid-session 2026-09-21, after `op item list` surfaced a `console.runpod.io` 1Password item
  and triggered an unwanted CLI-access prompt; the credential/OAuth question was a dead end regardless,
  since the real gap was tool-grant scope, not a missing key.
- Reconfirms the existing `-f content=@file` vs `-F content=@file` gotcha from PR #22's memory entry —
  this time on a `PUT contents` write (not a blob create): `-f` produced `"content is not valid
  Base64"` on all four files even though the base64 was verified clean (GNU coreutils `base64 -w0`,
  single line, no terminators); switching to `-F` fixed it immediately, no other change. Worth treating
  as a blanket rule for `gh api` + base64 content on this machine: always `-F`, never `-f`, regardless
  of which contents/git endpoint is being called.

## Update — 2026-09-21, later same day (Cat): APPROVED, Kevin: "we will implement this"

Kevin decided to build this same day, after the feasibility research above. Not a proposal anymore —
committed to build. Docs-only status update pushed to `main` @ `ee4159d`: `docs/ROADMAP.md` item 34
(retitled to "AIMM stem separation — cloud backend + RunPod serverless Demucs worker", APPROVED
banner), `DASHBOARD.html` card 34 (badge changed from "Backlog" to "APPROVED — not started", new
dated entry), `docs/STATUS.md` (new top entry), `docs/RUNPOD-GPU-RESEARCH-BRIEF.md` (status line +
appended decision note). All prior research/history text kept, not deleted — same pattern as the
"Proposal A retracted, not deleted" convention already used in this brief.

**Durable facts for whichever session builds this:**
- Priority position is unchanged by the approval — still behind the Hope-intelligence backlog (items
  24/25) in the roadmap queue. Approval ≠ reprioritization; don't assume it jumped the queue without
  Kevin saying so explicitly.
- Per standing process, implementation goes through Codex as lead implementer next, Cat reviews — this
  session did docs only, no code, no pod, no spend. Don't start building index.html/backend code from
  a docs-update task without that explicit handoff.
- The scoped architecture (auth, R2 presigned upload, Worker → RunPod `/run` → D1/KV job tracking,
  result delivery to R2, storage retention, usage ledger from day one, RunPod serverless Demucs worker
  on RTX 4090/A5000) is unchanged by this approval — it's the same plan from the revised findings
  above, just now greenlit rather than proposed.
