# Backlog 31/32 capture — frequency-solo ear-training + Glossary/Reference tab (6 September 2026)

Docs-only capture on `aimm`, branch `docs-roadmap-capture-freq-solo-2026-09-06` @ `89f9d34`,
pushed, NOT merged (Kevin merges). Two items added mid-session (coordinator sent the second,
Glossary/Reference tab, as a mid-task fold-in after item 31 was already drafted).

**Reusable facts:**
- Confirmed `docs/ROADMAP.md` and `DASHBOARD.html` numbering diverge for the "Multi-stem Mix
  Check" item: ROADMAP.md's own heading has no numeric prefix, but DASHBOARD.html labels the same
  card "22." — a pre-existing mismatch, not something this session caused. Grepping ROADMAP.md for
  `^### [0-9]` or `^## [0-9]\.` alone will miss items that only carry a number in DASHBOARD.html —
  cross-check both files' item numbering before assuming a doc's own numeric headings are complete.
- Item 30 was confirmed as the highest existing backlog ID in both files before this session (via
  direct `gh api` fetch + grep, not memory) — next-free was 31, then 32 for the mid-task addition.
- Codex TP3 (end-to-end, `-s read-only --skip-git-repo-check`) caught two real issues on the first
  pass that TP1/TP2 didn't: (1) item 31 didn't forward-reference the newly-added item 32, (2) item
  32 restated item 31's exact frequency-range numbers instead of just pointing at item 31 — despite
  item 32's own text explicitly saying "don't duplicate this." Cross-reference correctness needs an
  end-to-end re-read after adding a second, related item mid-session — a diff-only review (TP2)
  passed both times because each individual diff looked self-consistent; only reviewing the final
  merged state caught the actual duplication and the missing back-reference.
- WebFetch on the iZotope glossary URL gave a different rough term count (~30 confusing + ~50
  common) than the coordinator's own earlier fetch summary (~40 + ~70) — used the WebFetch-confirmed
  numbers and a wider "~80-110 terms total" framing in the roadmap entry rather than picking one
  source over the other as exact.

No new confirmed-fact `index.json` entry — this is process/gotcha knowledge, prose-tier only.
