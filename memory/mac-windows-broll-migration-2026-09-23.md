# Mac → Windows Shorts/B-roll migration pattern (2026-09-23)

**Task:** copy all LANE2_01 Shorts/B-roll production material from the Mac to a new
local-only Windows folder `D:\Hope in AI\` (B-roll clip library, three YouTube source
downloads, a Flow-clip batch, and a CapCut project), verify every transfer, rewrite the
CapCut project's internal media paths, and record a same-day decision to lift the
scraped-clips copyright-usage restriction. Full detail: `begb0037admin/ai-news-channel`
PR #33, `HANDOVER.md`/`STATUS.md` 2026-09-23 entries.

**Reusable technique — tar-over-ssh beats scp/rsync for Mac→Windows bulk copies.**
Windows Git Bash has `tar` (bsdtar/libarchive) and `ssh`/`scp` but no `rsync`. Mac has
`rsync` but going Mac→Windows still benefits from `tar cf - -C <dir> . | ssh ... | tar xf -`
(or the reverse direction for pull) because it streams without an intermediate zip and
handles filenames with spaces/unicode/em-dashes/curly-quotes correctly without shell
quoting headaches — put the target filenames in a newline-delimited list file, `scp` the
list over, then `tar cf - -T listfile` on the remote side selects exactly those files.

**Gotcha — Windows bsdtar writes macOS xattrs out as `._*` AppleDouble sidecar files.**
Every file with macOS extended attributes (Finder metadata, quarantine flags, etc.)
extracts as TWO files on Windows: the real file plus a `._filename` junk file holding the
resource fork. This roughly doubled the apparent file count after a first extraction
(2,342 files landed vs 1,156 real ones). Always `find <dest> -name '._*' -delete` after
a Mac→Windows tar extraction and re-verify counts against the real (non-`._*`) file set —
the real-file count and byte total should match the source exactly; don't be alarmed by
the inflated raw count before cleanup, and don't skip the cleanup (it's junk, not content).

**Verification pattern that actually caught things:** exact file-count + `stat`-summed
byte-total match (not `du`, which rounds to block size) as the first gate, then SHA-256
spot-checks across a few different subfolders/file types. This is fast enough to do on
every transfer, not just a sample one.

**Dedup pattern for "is this folder actually a superset of that one":** hash every file
in both trees, compare the hash sets, keep only files whose hash doesn't already exist
elsewhere. Watch out for `awk '{print $2}'` truncating filenames with spaces when parsing
`sha256sum` output — use `substr($0,67)` (hash is fixed 64 chars + 2-space separator) or
equivalent, not naive field-splitting, or you'll silently mis-classify space-containing
filenames as unique-looking garbage (`AI`, `Ordered`, `Sam` etc. — the space-truncated
fragments) rather than their real names.

**CapCut draft project relocation — path-rewrite pattern.** A CapCut draft folder
(`.../com.lveditor.draft/<name>/`) is not one JSON file — absolute source-media paths are
duplicated across ~10 files in the tree (`draft_info.json` + its `.bak`/`.tmp` copies,
`draft_agency_config.json`, `draft_meta_info.json`, `matting/*/matting_result.json`,
`Timelines/*/draft_info.json` + `.bak`/`.tmp`/`template.json`, `Timelines/*/attachment/
patch/mini_draft.json`). Don't assume `grep -l` on a guessed subset of filenames finds
them all — do `grep -rl "/Users/<name>\|/Volumes/" <draft-dir>` across the ENTIRE tree
first, then rewrite every match. CapCut's own app-level `Cache/effect/...` references
(fonts, effect binaries) are a separate, sibling `Cache/` folder outside the draft
directory — leave those untouched, they're app-managed and CapCut re-resolves them itself.
After rewriting, regex-extract every remaining path-like string from the rewritten files
and confirm each resolves to a real file on disk — this caught nothing missing here, but
is the actual proof the rewrite worked, not just "no more old paths found."

**Gotcha — a Mac can have the same physical volume mounted at two different `/Volumes/`
paths simultaneously** (here, `/Volumes/MacStore` and the boot volume `~` were the same
device+inode). A CapCut draft referenced source files via `/Volumes/MacStore/Downloads/...`
while the same files were also reachable at `~/Downloads/...` — don't assume a `/Volumes/`
path is a different physical copy requiring separate retrieval; check `stat -f "%d %i"`
against the more obvious path first.

**Judgment call precedent:** when a source folder shared by two unrelated projects is
handed over wholesale ("bring anything not already present"), it's correct to exclude
content that's clearly the *other* project's (here: AIMM "Blow for Blow" tutorial import
material sitting inside a Hope-in-AI Codex output folder) rather than copy it in — flag
the exclusion explicitly in the handover record rather than silently deciding or silently
including.
