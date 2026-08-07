# Cat's Memory Index

Read this at the start of every task, before doing anything else. Each line points at a file under `memory/` — read the ones relevant to the task at hand. This index is an index, not the content itself; keep entries here to one line.

Note: this is the prose-memory index only. For confirmed, reusable facts, use `node memory/search.js "<topic>"` instead — see `AGENT.md` "Memory" section for why there are two systems.

- [Origin session](memory/origin-session.md) — how and why Cat exists, founding context, 5 August 2026
- [Growth plan](memory/growth-plan.md) — scope history, the Markey boundary, not yet actioned expansions
- [EP06 research subfolder template](memory/ep06-research-subfolder-template.md) — sources/research/ made permanent in episode template via PR #12, 6 August 2026
- [EP06 ledger Claims 024-033](memory/ep06-ledger-024-033-empire-corroboration.md) — PR #13, nine new empire/sovereignty sources + the Bremmer transcript, DuckDuckGo html search fallback for WebFetch, flagged the two-part split may not hold
- [EP06 ledger Show fit field](memory/ep06-ledger-show-fit-field.md) — PR #13 follow-up commit, editorial accessibility filter per Kevin, `gh api -F content=@file` fixes Windows argv-length limit on large base64 pushes
- [EP06 split into EP06/EP07/EP08](memory/ep06-split-into-ep06-ep07-ep08-renumber.md) — PR #14, splits the 33-claim ledger into two episodes per Kevin/Hope's decision, resolves the open question PR #13 flagged; verbatim-splitting method, Windows git-clone longpaths gotcha
- [EP06 title G-Zero Control](memory/ep06-title-g-zero-control.md) — PR #15, retitled from working title 'Is Anyone Still In Control?'; Git Data API folder-rename pattern (no local clone)
- [STATUS/HANDOVER PR #14/#15 staleness fix](memory/status-handover-pr14-15-staleness-fix.md) — PR #16, fixed 'open PR, not merged' language flagged but left in PR #15; check every PR number mentioned, not just the flagged one
- [EP07→EP06 175B-10T claim re-file](memory/ep07-to-ep06-175b-10t-refile.md) — PR #17, resolves the third PR #14 judgment call; confirms `gh api git/blobs -f content=@file` silently fails (needs `-F` + base64), and multi-entry trees need `--input` JSON, not repeated `-F tree[][...]` flags
- [EP06/EP07 NotebookLM source pass](memory/ep06-ep07-notebooklm-source-pass-pr18.md) — PR #18, 24 new claims from a pasted URL list, closed the long-open Philippines/Claim 027 gap, caught a duplicate paper and a mislabeled source, `r.jina.ai/<url>` confirmed as a second WebFetch-blocker fallback after DuckDuckGo-HTML got CAPTCHA'd
- [PR #19 backfill sources/research EP01-05/EP08](memory/pr19-backfill-sources-research-ep01-05-ep08.md) — 7 August 2026, plus the tree-API batched-.gitkeep-add technique
- [PR #20 template sources/research/.gitkeep](memory/pr20-episode-folder-template-sources-research-gitkeep.md) — 7 August 2026, closes the PR #19-flagged template gap; confirms two different `.gitkeep` byte-conventions coexist in the repo (template folder = 0-byte, episode folders = 1-byte newline)
- [PR #21 EP06/EP07 Content Briefs filled in](memory/pr21-ep06-ep07-content-briefs.md) — 7 August 2026, Kevin-approved content filed matching EP05's actual structure (not the generic template); Conversation Arcs derived from each episode's Mechanism list; resolves each Episode Seed's open approval gate
- [PR #22 EP06/EP07 Approval status + QA report staleness](memory/pr22-ep06-ep07-approval-status-qa-staleness.md) — 7 August 2026, closes the Content-Brief half of each Episode Seed's approval gate left by PR #21; fixes two stale pre-renumber episode-number QA report labels after re-checking a prior "leave alone" note's own premise; new confirmed fact — `gh api -F content=@<(process substitution)` fails on Windows Git Bash, use a real temp file
- [PR #23 EP07 title The Empires of AI](memory/pr23-ep07-title-the-empires-of-ai.md) — 7 August 2026, closes the last open item from PR #22; reused EP06's rename method exactly; found and fixed a broken EP06 cross-reference in EP07's Research Ledger that PR #15 had missed (checked Episode Seed only, not Research Ledger)
