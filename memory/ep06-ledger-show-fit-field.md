---
name: ep06-ledger-show-fit-field
description: "PR #13 follow-up: added Show fit field to Claims 024-033 per Kevin's editorial guidance, same branch"
type: decision
---

Follow-up to `memory/ep06-ledger-024-033-empire-corroboration.md` (PR #13). The orchestrating session ran a first-pass triage of Claims 024-033 against Kevin's explicit editorial guidance — "this depends on if we have good content — we are not a political show, as long as it fits our product" — and Kevin approved the triage. Cat's job was purely mechanical: add the resulting `Show fit` field to each claim, matching the ledger's existing bullet-list taxonomy, as an **additional commit to PR #13's existing branch** (`cat/ep06-ledger-empire-corroboration`), not a new PR.

**Result:** commit `e8556be` on that branch, pushed via the GitHub Contents API (PUT with base64-encoded content, `-F content=@file` to dodge Windows/Git-Bash argv length limits — inline `-f content="$(base64 ...)"` failed with "Argument list too long" on a ~93KB payload; writing the base64 to a temp file and passing `@file` to `-F` worked).

**What the field records, per claim:** `Show fit` sits as the last bullet in each of Claims 024-033, after the existing `Caveat` bullet — deliberately additive to the existing verification/status taxonomy, not a replacement for it (a claim can be fully verified and still Background or Cut on show-fit grounds). Four statuses: Featured (024 Crawford, 025 Varoufakis, 027 Kwet, 028 Lehdonvirta, 033 Bremmer — already core, Kevin confirmed), Background — keep the underlying idea/examples, cut the academic-framework jargon from on-air use (026 Durand, 030 Chung & Dietrich, 031 Singh & Reuel), Cut from this episode but entry kept not deleted, flagged for a possible future AI-adoption/national-security episode (032 Belfer FLEX/SMART), and Necessary regardless of tone — counter-case logic, not the political filter (029 Woods).

**One thing flagged rather than fabricated:** Kevin's brief referenced "Kenya/Philippines labor stories already in the ledger" as the pairing rationale for Claim 027 (Kwet, digital colonialism). Checked the live ledger — only a Kenya claim exists (Claim 002); no Philippines/Remotasks/Scale AI claim is actually in the ledger yet. Claim 027's `Show fit` note references Claim 002 directly and flags the Philippines pairing as not-yet-sourced rather than asserting it exists — per the standing rule to never invent data for a section with no confirmed source.

See also: `memory/ep06-ledger-024-033-empire-corroboration.md` for the original claims/PR context.
