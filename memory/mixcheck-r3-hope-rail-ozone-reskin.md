# MixCheck R3 — Hope conversation rail reskinned to Ozone 12 (container/layout only)

17 August 2026. Round 5 (mixcheck-r5-verbatim-transplant-live-build.md) only
reskinned the `#eq` MixCheck tab; Kevin separately flagged the Hope
conversation panel — `#hopeRail`, the persistent chat dock that docks
`.aichat-layout` (bubbles, toolbar, composer) into the right side of every
tab — as still not matching. This round's brief was explicitly
container/layout-CSS-only, with a hard boundary against touching any
ElevenLabs/Realtime/message-dispatch code (Markey's scope).

## What actually worked

**Found the real target by grepping, not guessing.** `#refHopeBox` (the
small "HOPE — ANALYSIS" tip card inside the MixCheck panel, already reskinned
in round 5) is a different element from the reference's "RIGHT: Hope panel"
block (`ozone-redesign-v1.dc.html` lines 208-261) — the real analog is
`#hopeRail` → `.aichat-layout`, which physically relocates between the rail
and the standalone Conversation tab via a small IIFE
(`window.toggleHopeRail`, ~line 14299) that only touches elements by id/class,
never sibling structure — confirmed safe to add new wrapper markup around
`.rail-head`'s children.

**Scoped every override under `#hopeRail`**, not the bare `.aichat-bar`/
`.aichat-msg`/`.aichat-compose` classes, so the same physical node still
renders in its original dark-purple styling when un-docked back into the
Conversation tab — deliberately out of this round's scope (Kevin's ask was
the rail/dock panel specifically).

**Kept every real toolbar control (model picker, web-search toggle,
Snapshot/Import/Attach/Clear buttons) instead of hiding them**, unlike
round 5's MixCheck-tab pattern of hiding no-reference-counterpart elements —
recoloured them to the reference's flat chip language instead. Reasoning:
those controls are the *only* affordance for that functionality anywhere in
the docked rail (no equivalent duplicate elsewhere), so hiding them would be
a real functional loss, not just a cosmetic simplification. Did hide one
purely-decorative element (`.rail-body .section-head`, a redundant
"CONVERSATION" h2 the reference has no equivalent of, when the rail-head
above already names Hope) — CSS `display:none`, not deletion, same
established pattern as prior rounds.

**Left the dormant Quick Prompts block alone and flagged it instead of
reviving it.** The app already has a pre-built, hidden
`data-dormant="aichat-quickprompts"` block that's a near-exact structural
match for the reference's 3 suggested-prompt pill chips — but it has real
`onclick`/`data-prompt` wiring already attached, so dropping its `hidden`
attribute re-activates existing functionality, not a pure layout change.
Pre-styled the chip CSS so it matches instantly if a future round is
explicitly asked to revive it, but did not flip the attribute.

## Bug caught (same class as two prior sessions)

**`.btn.purple`'s `box-shadow: 0 0 0 1px #c084fc inset` survived a
higher-specificity `#hopeRail .aichat-bar button{background:...}` override**
even though the id-scoped rule correctly won on `background`/`color`/
`border` — box-shadow is a separate property, not overridden just because
background was. Fix: explicit `box-shadow:none !important` in the override.
Third confirmed instance of "a more-specific background/color override
doesn't kill an old rule's box-shadow/other untouched properties" across
this epic (see `mixcheck-six-decisions-spectral-ribbon-fix.md` and
`headless-chrome-screenshot-for-ui-approval.md` for the first two) — check
every property individually, don't assume specificity wins the whole rule.

## Live-hosting gotcha: two different "the build" locations

`docs/preview/r3-live/index.html` is a **separate snapshot committed on
`main`** (not the `r3-preview` branch) — added by Kevin directly
(commit `cd47fdf`) as a Pages-hostable copy of the `r3-preview` branch's
`index.html`, since this repo's GitHub Pages source is pinned to `main`'s
root, not `r3-preview`. Confirmed via `git diff <(git show
main:docs/preview/r3-live/index.html) <(git show r3-preview:index.html)` —
byte-identical before this round's edit. **Updating this snapshot means a
real push to `main`** — safe because it's a `docs/preview/` sub-path, not
the repo's own root `index.html` (the actual live app), confirmed via
`git diff --stat` showing only the snapshot path touched. Don't confuse
"don't push r3-preview to main" (the real redesign merge, still pending
sign-off) with "update the docs/preview/ snapshot" (a review-only artifact,
fine to push directly) — they're different files under different rules.

## Verification technique

Reused the established "inject sample messages directly via `innerHTML`,
not by calling internal functions" technique (`aichatRender` etc. may not be
on `window` — didn't check, went straight to direct DOM injection which is
lower-risk anyway) to populate the empty-state transcript for a screenshot,
plus a `window.onerror` → `document.title` handler to check for JS errors.
Got a `Script error. @ 0:0` on both the edited file and the pristine
`433888d` baseline (confirmed via `git stash`) — a pre-existing cross-origin
CDN script error, not caused by this change. Always diff against baseline
before reporting a console error as a new regression.

## Live URLs

- `https://begb0037admin.github.io/aimm/docs/preview/r3-live/index.html` —
  updated snapshot on `main`, confirmed live via `curl` + grep for
  `oz-rail-avatar` after ~20s Pages build lag.
- `r3-preview` branch itself (`raw.githack.com/begb0037admin/aimm/r3-preview/index.html`
  per round 5's convention) also has the same commit — not re-verified live
  this round, the `docs/preview/` snapshot was used instead since it's
  already the established review URL from round 5's handover.
