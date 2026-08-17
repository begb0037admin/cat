# MixCheck R3 round 6 — composer stacking fix, app-wide emoji removal, dormant WAV transport found

17 August 2026. Two commits to r3-preview: `0e9dd7c` (composer + emoji) and `5473792` (drag-seek).

**Composer stacking bug.** Kevin's screenshot showed the Hope-rail composer as 4 stacked
full-width cards (textarea, Send, Attach, Clear). Root cause: base `.aichat-compose .send-col`
is `flex-direction:column;min-width:210px` with `.aichat-compose button{width:100%}` — by
design for the wide non-rail composer, but under `#hopeRail`'s 380px column it renders as a
narrow-tall textarea beside three equal-weight full-width button cards. Real headless-Chrome
screenshots (not CSS reading alone) were needed to see it was actually side-by-side, not
literally stacked — Kevin's verbal description didn't match the pixels exactly. Fix: scoped
`#hopeRail .send-col` to `flex-direction:row;flex-wrap:wrap`, Send at `flex-basis:100%` (own
top line, full visual weight), Attach+Clear demoted to small subdued chips sharing a second
line. Scoped entirely under `#hopeRail` — verified the non-rail Conversation-tab composer is
untouched (separate screenshot at 1100px width, rail closed).

**Emoji removal, app-wide.** Landed via Kevin/coordinator escalation mid-round (started as
"remove 📷🖌️ from the rail", ended as "no emoji anywhere in the app, ever, as a written
CLAUDE.md rule"). Scope decision made and disclosed rather than guessed at: only stripped
Unicode U+1F300–U+1FAFF (the true pictographic/colour emoji block) — left the pre-existing
monochrome dingbat convention alone (× delete, ✓ apply, ★/⭐ favourite, ➕/＋ add, ↑/↓ reorder,
✏ edit) since that's an established, disclosed house style predating this pass, not what
Kevin's screenshot flagged. RT_INSTRUCTIONS (the ElevenLabs/Hope voice system prompt,
lines ~11561–11888) was excluded by line range and hand-checked separately — found exactly
one emoji inside it (a clipboard glyph in a tool-call instruction), left untouched and
flagged for Markey per the voice-functionality boundary, not edited. Added the rule as a
hard rule in `aimm/docs/CLAUDE.md` (not README/ROADMAP) since that's the file this repo's
own bootstrap order reads first.

**Big finding, not acted on unilaterally:** the WAV playback transport the coordinator asked
me to build (play/stop, draggable time bar, live-synced spectrum) already exists in full —
`refPlay/refPause/refStopAudio/refSeek/refTogglePlay`, real `AudioBufferSourceNode` +
`audioContext.currentTime` tracking, `requestAnimationFrame`-driven live spectrum during
playback. It's wrapped in `.oz-legacy-hide` / `data-dormant="mixcheck-r5-transport"` from the
R5 Ozone transplant — deliberately hidden, not deleted, not broken. Only real gap: the scrub
bar was click-only, no drag. Added pointerdown/pointermove/pointerup wiring (kept
`window.refScrubClick` for any external caller, dropped the inline `onclick` in favour of the
unified pointer handler). Did NOT un-hide the legacy panel — that's a product/visual decision
for Kevin given this repo's own governed mockup-review process (CLAUDE.md: "No code is
committed to the live app until Kevin has approved every tab's mockup"), flagged as an open
question instead of guessing.

**Confirmed technique — CDP-driven functional verification, not just screenshots.** Screenshot
review can't test drag/seek/playback-position logic. Built a real Chrome DevTools Protocol
driver (Python + `websocket-client`, `pip3 install --quiet websocket-client requests`) against
`chrome --headless=new --remote-debugging-port=N --remote-allow-origins=*` (both flags
required together — CDP over websocket is origin-checked in modern Chrome and silently
403s without `--remote-allow-origins=*`). `DOM.setFileInputFiles` + `Runtime.evaluate` with
`awaitPromise:true` to drive real file loads through the app's own `refLoadFile`, then
synthetic `PointerEvent`s dispatched via `Runtime.evaluate` (not `Input.dispatchMouseEvent`)
to exercise pointerdown/move/up drag handlers — worked reliably, gave exact fill%/elapsed
values back to confirm correctness. Gotcha: headless Chrome's `AudioContext.currentTime`
does not advance in real time without a real audio output device, so playback-duration timing
checks are inconclusive in this environment — seek/drag/load/click all verified fine, but
"does time actually advance while literally playing" needs a real windowed-Chrome check, not
headless.

**Multi-round scope creep, handled by disclosure not silent compliance.** This round grew
through five separate mid-task coordinator messages (composer fix → strip 2 emoji → add a
standing CLAUDE.md rule → also strip emoji from copy → expand to the whole app) while I was
mid-diagnosis. Kept the original ask as the base commit, folded each addition in as instructed
by the coordinator, but drew and stated explicit scope lines (dingbats out, RT_INSTRUCTIONS
out) rather than either refusing to expand or silently doing more than asked.
