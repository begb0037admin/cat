# Audio Specs label-wrap alignment fix — CSS grid column-sharing gotcha

2026-09-04, aimm Mix Check `#mcSpecs` card, branch `mixcheck-audiospecs-label-align` @ `05eb0362`
(pushed, not yet merged). Bug: two `.mc-row` rows in a 2-column CSS grid (`.mc-rows`, `1fr 1fr`)
had a long `.mc-rl` label ("LUFS short-term", "Phase / correlation") wrap to 2 lines while their
row-neighbor stayed 1 line, misaligning that row's dot+value vs the rest of the card.

**The naive fix is wrong and must be re-checked with a real render, not CSS reading alone.**
Adding `white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0` to the *shared*
`.mc-row .mc-rl` class rule (all rows) looked correct on paper and is what Codex's own TP1/TP2
passes suggested too — but a real headless-Chrome render + `scrollWidth`/`clientWidth` DOM
measurement at realistic metric-value widths (not the placeholder "– –" text) showed it regresses
worse than the bug: because a CSS grid column's track width is the max min-content across every
row sharing that column, forcing `min-width:0` on ALL labels either (a) leaves the grid free to
blow the column out past the card's fixed 240px width when one row's un-wrapped label is very long
— clipping/hiding the `.mc-rv` value on the neighbouring rows entirely (real data loss, not just
truncation) — or (b) once the grid is hard-clamped equal via `minmax(0,1fr)`, crushes short labels
like "RMS" down to a single letter + ellipsis, because the ellipsis glyph itself needs several px
and the browser will drop almost the whole word rather than show 1px less than the full string.

**Fix that actually worked:** scope the CSS with `:has()` to just the two affected rows
(`.mc-row:has(#mcCorr)`, `.mc-row:has(#refLufsSt)`) — give only those rows `min-width:0` (so their
own column track can shrink to the real available width instead of forcing a blowout) and only
their `.mc-rl` gets nowrap+ellipsis. Confirmed via the same render+measurement technique: no row
overflows the card, no `.mc-rv` value is ever truncated, and 8 of 9 other rows' labels render
byte-identical (untruncated). One benign, non-regressive side effect: because the column track is
still shared, "Crest factor" (untouched by the new rule) now wraps its own label to 2 lines instead
of fitting on 1 — but that row's total height didn't change (43px before/after, since its RMS
neighbour's *value* was already wrapping to 2 lines pre-fix) so no new misalignment appeared. Codex
TP2 (read-only diff review) correctly caught that the CSS comment overstated "every row unaffected"
without disclosing this — comment was corrected in the same pass, re-verified PASS.

**Reusable takeaways:**
- For any AIMM `.oz-mixcheck`/`.mc-*` two-column metric-row fix, remember `.mc-rows` is a real
  `display:grid` (not just visually two columns) — a CSS change to ONE row's flex-child can change
  the rendered wrapping of a DIFFERENT, untouched row that happens to share its grid column, purely
  through track-width sizing. Always re-check every row in the same column after touching one.
- `white-space:nowrap` + `min-width:0` on a flex child inside a CSS Grid item does NOT, by itself,
  stop the *grid track* from growing to fit that now-un-wrappable content (the classic CSS Grid
  "blowout" bug) — you also need `min-width:0` on the grid item itself (`.mc-row`) or
  `minmax(0,1fr)` on the grid's own `grid-template-columns`, or content will overflow the visual
  container even though the DOM element itself reports a small `clientWidth`.
- `scrollWidth > clientWidth` is only a valid "is this truncated" test for a `white-space:nowrap`
  element. For a normally-wrapping element it just reports the settled wrapped-box width, which can
  make an actually-wrapped 2-line label look "not truncated" — don't trust that check alone; render
  a screenshot and/or check line count / offsetHeight vs single-line height.
- Card real-estate check for `#mcSpecs`: `--mc-rail-w:240px` (root `:root` CSS var) is a hard fixed
  width, NOT responsive to browser window width (confirmed unchanged at both 1600px and 1920px
  headless viewports) — any future Audio Specs layout work should assume ~210px real inner width
  for the 2-column `.mc-rows` grid, not "however wide the window is."
- Headless-render recipe used (Mac, Chrome, no Puppeteer): `chrome --headless=new --dump-dom` with
  an injected `<script>` right before `</body>` that sets realistic sample values (not the "– –"
  placeholder), flips `#eq.active`/`.oz-mixcheck` and asserts dot colours, then appends a `<pre
  id="probeOut">` with computed `scrollWidth`/`clientWidth`/`getBoundingClientRect()` per row — read
  back via a Python regex against the dumped DOM. Faster and more reliable than `--screenshot` +
  visual crop guessing for exact pixel truncation questions (screenshots are still needed for the
  final Kevin-facing evidence, but shouldn't be the only check for a fix like this).

Confirmed via: Codex TP1 (pre-start, `codex exec -s read-only`) CONFIRMED bug + line numbers; TP2
BLOCKERS on pass 1 (CSS comment accuracy) → fixed → PASS on re-check; TP3 end-to-end PASS (no
cascade conflicts, no runtime JS resets the styling, build stamp correct, no unrelated changes).
