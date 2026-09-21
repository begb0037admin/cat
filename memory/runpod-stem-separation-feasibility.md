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
- Kevin's own local RTX 3070 is already capable of running Demucs (GPU-bound, MIT-licensed, state of
  the art for stem separation) — worth naming explicitly as a no-cloud alternative whenever a
  GPU-bound aimm job comes up, not just assuming Runpod is needed.

**Confirmed tooling facts:**
- The RunPod MCP tools named as available for this session (`runpod-usage`, `runpod-mcp`, `runpodctl`,
  `flash`, `runpod-templates`) did NOT resolve via `ToolSearch` — tried `"runpod list templates hub
  billing gpu type"`, `"list-public-templates"`, `"runpod"`, `"gpu pod serverless endpoint compute
  catalog"`, all empty. Don't assume a tool named in the MCP-instructions block is actually loaded —
  verify with ToolSearch before planning a task around it. Live Runpod balance/pricing (the research
  brief's own Step 1) is still unverified as a result — flagged honestly in the findings rather than
  guessed.
- Reconfirms the existing `-f content=@file` vs `-F content=@file` gotcha from PR #22's memory entry —
  this time on a `PUT contents` write (not a blob create): `-f` produced `"content is not valid
  Base64"` on all four files even though the base64 was verified clean (GNU coreutils `base64 -w0`,
  single line, no terminators); switching to `-F` fixed it immediately, no other change. Worth treating
  as a blanket rule for `gh api` + base64 content on this machine: always `-F`, never `-f`, regardless
  of which contents/git endpoint is being called.
