## Multi-stem Mix Check — corridor-comparison suppression for an isolated stem (Backlog 22 req 3 refinement)

2026-09-07, on `aimm`, pushed directly to `main` at `4b183d2` (docs/mockups-only,
`docs/mockups/multistem-mixcheck-final.html`, `index.html` untouched). Kevin found a real
architectural gap: soloing/muting down to one stem out of a multi-stem session still compared it
against the full-mix genre corridor ("low end +41 dB over" for a solo bass stem). He offered two
options and chose the simpler one himself: suppress the comparison honestly rather than fabricate a
stem-specific target.

**Detection condition that held up under Codex TP1 review:** `stems.length > 1` (total EVER
loaded, including mismatch-excluded ones) AND `eligibleStems().filter(s=>!effectiveMuted(s)).length
=== 1`. Using `eligibleStems().length` instead of `stems.length` for the "was this a multi-stem
session" half would have misclassified a 2-stem drop where one failed validation as an ordinary
single-file load — a real edge case Codex's plan review (not the diff review) caught before any code
was written, worth the TP1 pass on its own.

**Reusable gotcha: a computed value written into a CSS-hidden element is a silent no-op.** Codex's
TP2 diff review caught this, not the earlier plan review or my own read of the code: this app's
redesigned Spectral Balance band cards convey status via the fill-bar position, so `#ozBand*Tag` is
permanently `display:none` (a real CSS rule already in the file, unrelated to this change) — writing
an honest "N/A — isolated stem" explanation into that tag's `innerHTML` produced literally nothing
visible, just a silent dash. Moving the same explanation into `.oz-band-val` (genuinely on-screen)
fixed it. Lesson: when adding a new user-facing state to an existing rendering function, check
computed CSS on the target element before trusting that setting `.innerHTML`/`.textContent` makes
it visible — grep for `display:none` rules matching that id/class in the same file.

**TP3 technique: drive `window.mcHandleFiles([...])` directly with in-browser-synthesized File
objects (base64 WAV → Uint8Array → File), skip drag/drop simulation entirely.** Far more reliable
than simulating a real file drop event in headless Chrome. Poll `window.__mcAnalysisStale()===false`
to know an async re-analysis has actually landed before reading DOM/state — a fixed sleep produced
flaky reads on the first pass. Real solo/mute button clicks via
`document.querySelector('#mcStemRows button[data-act="solo"][data-i="N"]').click()` — the multi-stem
module already keys off `data-act`/`data-i` DOM attributes, no need for a debug-only test hook.

**Codex sandbox gotcha (adds to the existing scratch-dir note):** `codex exec -s read-only` without
`--skip-git-repo-check` fails immediately with "Not inside a trusted directory" when run inside
`~/codex-scratch` (not a git repo) — always add `--skip-git-repo-check` for a plain scratch-dir
review, not just `-C <dir>`.

**Concurrency reconfirmed:** a stale, unrelated `codex exec` process (a different session's
filename-classification feature review) was still resident in the shared `~/codex-scratch` at the
same time — didn't collide this time since it wrote to a different output filename, but it's a
second live confirmation that this scratch dir is shared across concurrent sessions on this Mac,
same as the aimm local clone itself (see the 2026-09-06 fixqueue-stuck-placeholder entry). Use
distinctive per-task filenames in `~/codex-scratch`, don't assume it's exclusively yours mid-session.
