# Multi-stem Mix Check — bug pass 2 (5 fixes), 7 September 2026

Branch: pushed directly to `main` on `begb0037admin/aimm` at commit `5b0b156` (docs/mockups-only,
`docs/mockups/multistem-mixcheck-final.html`, `index.html` untouched). Full writeup in that commit's
`docs/STATUS.md` entry. Dispatched by Jules; two extra requirements folded in mid-task via agent
messages from Jules (draw-on-load timing, colour scheme, Hope stem awareness) — all landed in one
push since house rules for this mockup line are "push when done", not per-requirement.

**Reusable pattern: reveal-before-draw timing bug.** A canvas inside a container that only becomes
visible (`display:none` → `.visible`) via an ASYNC code path (here: `refLoadFile()`, invoked later by
an analysis pipeline) will silently fail to draw if a SYNCHRONOUS caller draws to it before that
reveal lands — `canvas.clientWidth/clientHeight` read `0` at that exact moment, and a
`if(!cw||!ch) return;` guard (a completely reasonable guard in isolation) becomes a permanent
no-op with no natural retry. Diagnosis method that actually found it: temporary `console.log` probes
inside the draw function logging `cv.clientWidth/clientHeight` at the exact call site, PLUS a live
ancestor-chain dump (`el.parentElement` walk logging `computed display` at each level) at the moment
the early-return fires — this pinpointed the exact ancestor (`#refDzLoaded`) still `display:none`
in one call. A `setInterval` polling probe from outside missed the actual synchronous instant (5ms
granularity was too coarse — the reveal apparently happens ~300ms later, well after the bad draw).
Fix pattern: make the "become visible" reveal a small shared exported function
(`window.__mcRevealTransport()`), called SYNCHRONOUSLY by the fast/synchronous path before it draws,
not only by the slow/async path.

**Confirmed fact: Hope's rail text chat in this app is a REAL Claude API call, not scripted text.**
`aichatSend()` POSTs to `api.anthropic.com/v1/messages` with a system prompt built from
`buildMixCheckContextBlock()` + `buildLibraryDigest()` + others — this is a genuinely separate
surface from Markey's ElevenLabs voice/chat feature (search `AI CHAT` section vs `REALTIME VOICE`/
`ELEVENLABS` sections in the real `index.html`; this mockup mirrors the same split). A relayed
instruction from another agent claimed this was "scripted/fake text" — that was wrong for THIS
specific chat surface; always verify by grepping for the actual `fetch(...)` call before accepting
a "this is scripted" premise. `buildMixCheckContextBlock()`'s own comment says it feeds BOTH
`elStart`'s voice instructions AND `aichatSend`'s text-chat context — so editing it is in-scope
content/context work for Cat, not new ElevenLabs wiring, as long as the change is just string
content, not `RT_INSTRUCTIONS`/`TOOL_DEFS`/session-config plumbing.

**Reusable pattern: bridging an IIFE-private array to outside code.** The multi-stem module wraps
its whole `stems` array in a private closure (`(function(){ 'use strict'; let stems=[]; ... })()`).
To let code OUTSIDE that closure (Hope's context builder, elsewhere in the file) see live stem
state, added a real (non-debug) accessor function assigned to `window.__mcStemsForHope()` inside the
closure, returning a plain derived snapshot array — cheap, safe, and doesn't leak the mutable array
itself. The file already had a similar `window.__mcDebug` object for TP3 test-harness use; this is
the same pattern used for real (non-test) cross-closure communication.

**Codex TP2 catches real logic bugs a TP1 plan-review can't.** This pass's TP2 (diff review) found
two genuine follow-on bugs in code I'd just written and verified worked mechanically: (a) a stale-
analysis-numbers exposure window (fixed with an `analysisSeq` vs `lastCompletedAnalysisSeq`
generation tracker), (b) a misleading `[SOLO, muted]` display for a stem that's actually audible
(solo overrides mute) — both would have shipped invisible to a human reviewer skimming the diff for
"does this look reasonable" rather than tracing every state-transition path. Worth the extra TP2
round even when TP1 already approved the plan.

**Playwright headless-Chrome setup that worked cleanly on this Mac:** `npm install playwright` in a
throwaway scratch dir + `npx playwright install chromium` (silent, ~30s, no flags needed) — no prior
Playwright install existed on this machine. Synthetic WAV stems for testing: a ~15-line pure-Python
sine-wave WAV writer (stdlib `struct`+`math`, no numpy) was enough to produce 6 distinguishable
stereo stems that the app's own `classifyStem()` sorted into "Bass"/"Vocals" duplicate-category
groups on the first attempt (60Hz/90Hz sines → Bass, 220-800Hz → Vocals) — no need to reverse-engineer
the classifier's thresholds, real-ish frequency choices land naturally.
