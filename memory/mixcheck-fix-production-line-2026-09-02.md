# Mix Check Fix Queue "production line" — board item 15 queue side (build 2026-09-02.13)

**2 September 2026, coordinator-dispatched.** Branch `mixcheck-fix-production-line` off `main`
`e6f4edd`, commit `bc16d9c` + HANDOVER `ac2cd9c`, `index.html` only, NOT merged. Render:
`https://raw.githack.com/begb0037admin/aimm/mixcheck-fix-production-line/index.html`.

## The diagnosis that mattered

The R3 `MC_FIXQUEUE` engine (index.html ~line 16634, `window.mcFixQueue` at ~17044) was **already
correctly wired** for the advance loop: `markApplied(id)` adds to an `applied` Set, `pending()`
filters applied+dismissed, `current()`/the up-next card = `pending()[0]`, `render()` promotes the
next fix and ticks "N / M done" (`done=applied.size`, `total=items.length`), `emit()` fires
`onChange`. **The only real gaps:**
1. **Nothing in the UI ever called `markApplied`.** The card had only a dismiss `×` (which does NOT
   count toward "done"). The sole `markApplied` trigger was Hope's `mark_fix_applied` tool. So if
   Hope didn't fire it, the queue was frozen — exactly Kevin's "cards don't drop off" complaint.
2. `emit()` was `cbs.forEach(fn=>fn())` — zero-arg, no payload for a subscriber to pick up the new
   current fix from.

Lesson: for a "restore-and-wire" task, read the engine end-to-end first and write down what
actually works — most of item 15's machinery was fine; the fix was ~55 lines (a button + a payload
+ an idempotency guard + a nicer empty state), not a rebuild.

## What was added (queue side only — Hope chat behaviour is Markey's)

- **"✓ Mark done" button** on the up-next card (`.mcq-done`, `data-act="done"` in `.mcq-acts`);
  `wire()` maps it to `MC_FIXQUEUE.markApplied(id)` — same path as Hope's tool. `✓` is the
  docs/CLAUDE.md-allowed glyph (colourful emoji banned; `✓`/`×`/`★` etc. allowed).
- **`emit(reason, prevId)`** builds `changePayload()` → `{reason, previousId, current, currentId,
  done, dismissed, total, remaining, complete, analysisRev}`, passes it to every `onChange`
  subscriber AND dispatches a **new** `window` CustomEvent **`aimm:fix-queue-changed`** with the
  same `detail`. Additive — 8-method contract, item shape, `aimm:analysis-complete` all untouched;
  zero-arg `onChange` callbacks still work.
- `markApplied`/`dismiss` idempotent (return `true`, no re-render/re-emit on an already-terminal id).
- Clean 3-variant "all done" message replacing the generic `mcq-empty` line.

## Reusable

- The scratchpad CDP harness (`item15.mjs`, adapted from `item14.mjs` + `render_one.mjs`) drives a
  full analyse→advance flow: serve repo over local HTTP, `refLoadFile(new File([bytes],'x.wav'))`
  with `make_wav.js`'s synth trap WAV → 4-fix queue, then click `#mcActions .mcq-done` and read
  `window.mcFixQueue` + a `window.__fqEvents` array wired to the new event.
- `make_wav.js`'s bass-hot synth (tanh soft-clip, low-mid dip, air lift) reliably yields a
  multi-fix queue: band-low + band-high + 2 more at Target=Trap.
- **3-col bottom-align** (`#mcSpecs`=`#mcActions`=`#hopeRail`): measure it in the LOADED
  active-queue state (1048 flush at 1920 here) — that's the state every prior item-18/20 handover
  used. The all-done state renders `#mcActions` short (910 vs 953); that's pre-existing (old empty
  message did the same), not a regression.
- **Codex TP2 not spend-capped this pass** (unlike item 20). `codex exec --sandbox read-only
  --skip-git-repo-check "<prompt>"` from the repo dir; needs >2min so run it to a file with a long
  Bash timeout, output can be ~500KB (it explores) — read the tail for the verdict.

## MARKEY hand-off (his to build)

Full section in the branch `docs/HANDOVER.md` top entry: listen on `aimm:fix-queue-changed` OR the
now-payloaded `onChange`; call `window.mcFixQueue.markApplied(window.mcFixQueue.current().id)` on
"done"; the card's progress number for the current fix = `'#' + String(detail.done+1).padStart(2,'0')`
(item `id` is the internal build rank, never renumbered); P2b = don't re-enter `markApplied` from
inside an `onChange` handler; P3 = `RT_INSTRUCTIONS` still says manual ticking is "deliberately
absent" — reconcile with the new button.
