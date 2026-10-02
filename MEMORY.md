# Cat's Memory Index  Read this at the start 
of every task, before doing anything else. Ea
ch line points at a file under `memory/` — 
read the ones relevant to the task at hand. T
his index is an index, not the content itself
; keep entries here to one line.  Note: this 
is the prose-memory index only. For confirmed
, reusable facts, use `node memory/search.js 
"<topic>"` instead — see `AGENT.md` "Memory
" section for why there are two systems.  - [
Origin session](memory/origin-session.md) —
 how and why Cat exists, founding context, 5 
August 2026 - [Growth plan](memory/growth-pla
n.md) — scope history, the Markey boundary,
 not yet actioned expansions - [EP06 research
 subfolder template](memory/ep06-research-sub
folder-template.md) — sources/research/ mad
e permanent in episode template via PR #12, 6
 August 2026 - [EP06 ledger Claims 024-033](m
emory/ep06-ledger-024-033-empire-corroboratio
n.md) — PR #13, nine new empire/sovereignty
 sources + the Bremmer transcript, DuckDuckGo
 html search fallback for WebFetch, flagged t
he two-part split may not hold - [EP06 ledger
 Show fit field](memory/ep06-ledger-show-fit-
field.md) — PR #13 follow-up commit, editor
ial accessibility filter per Kevin, `gh api -
F content=@file` fixes Windows argv-length li
mit on large base64 pushes - [EP06 split into
 EP06/EP07/EP08](memory/ep06-split-into-ep06-
ep07-ep08-renumber.md) — PR #14, splits the
 33-claim ledger into two episodes per Kevin/
Hope's decision, resolves the open question P
R #13 flagged; verbatim-splitting method, Win
dows git-clone longpaths gotcha - [EP06 title
 G-Zero Control](memory/ep06-title-g-zero-con
trol.md) — PR #15, retitled from working ti
tle 'Is Anyone Still In Control?'; Git Data A
PI folder-rename pattern (no local clone) - [
STATUS/HANDOVER PR #14/#15 staleness fix](mem
ory/status-handover-pr14-15-staleness-fix.md)
 — PR #16, fixed 'open PR, not merged' lang
uage flagged but left in PR #15; check every 
PR number mentioned, not just the flagged one
 - [EP07→EP06 175B-10T claim re-file](memor
y/ep07-to-ep06-175b-10t-refile.md) — PR #17
, resolves the third PR #14 judgment call; co
nfirms `gh api git/blobs -f content=@file` si
lently fails (needs `-F` + base64), and multi
-entry trees need `--input` JSON, not repeate
d `-F tree[][...]` flags - [EP06/EP07 Noteboo
kLM source pass](memory/ep06-ep07-notebooklm-
source-pass-pr18.md) — PR #18, 24 new claim
s from a pasted URL list, closed the long-ope
n Philippines/Claim 027 gap, caught a duplica
te paper and a mislabeled source, `r.jina.ai/
<url>` confirmed as a second WebFetch-blocker
 fallback after DuckDuckGo-HTML got CAPTCHA'd
 - [PR #19 backfill sources/research EP01-05/
EP08](memory/pr19-backfill-sources-research-e
p01-05-ep08.md) — 7 August 2026, plus the t
ree-API batched-.gitkeep-add technique - [PR 
#20 template sources/research/.gitkeep](memor
y/pr20-episode-folder-template-sources-resear
ch-gitkeep.md) — 7 August 2026, closes the 
PR #19-flagged template gap; confirms two dif
ferent `.gitkeep` byte-conventions coexist in
 the repo (template folder = 0-byte, episode 
folders = 1-byte newline) - [PR #21 EP06/EP07
 Content Briefs filled in](memory/pr21-ep06-e
p07-content-briefs.md) — 7 August 2026, Kev
in-approved content filed matching EP05's act
ual structure (not the generic template); Con
versation Arcs derived from each episode's Me
chanism list; resolves each Episode Seed's op
en approval gate - [PR #22 EP06/EP07 Approval
 status + QA report staleness](memory/pr22-ep
06-ep07-approval-status-qa-staleness.md) — 
7 August 2026, closes the Content-Brief half 
of each Episode Seed's approval gate left by 
PR #21; fixes two stale pre-renumber episode-
number QA report labels after re-checking a p
rior "leave alone" note's own premise; new co
nfirmed fact — `gh api -F content=@<(proces
s substitution)` fails on Windows Git Bash, u
se a real temp file - [PR #23 EP07 title The 
Empires of AI](memory/pr23-ep07-title-the-emp
ires-of-ai.md) — 7 August 2026, closes the 
last open item from PR #22; reused EP06's ren
ame method exactly; found and fixed a broken 
EP06 cross-reference in EP07's Research Ledge
r that PR #15 had missed (checked Episode See
d only, not Research Ledger) - [PR #25 EP06/E
P07 Master Source, Chat Chunks, Audio Overvie
w Prompt](memory/pr25-ep06-ep07-master-source
-notebooklm-chunks.md) — 7 August 2026, the
 production step PR #21's Content Briefs unlo
cked; Master Source follows the approved Cont
ent Brief's claim selection over every Featur
ed-tagged ledger claim; EP06 close forces EP0
5 continuity, EP07's doesn't force EP06 conti
nuity - [PR #26 episode-artwork font OS-detec
t](memory/pr26-episode-artwork-font-os-detect
.md) — 7 August 2026, fixed Windows-breakin
g bug where the shared episode_template_confi
g.json had a Mac-only Impact font path saved 
in it; script now auto-detects per platform.s
ystem() instead of trusting the shared config
's saved path - [PR #27 merge, EP08 audio pus
h, Desktop shortcut re-point](memory/pr27-fir
st-session-clone-cleanup.md) — 7 August 202
6, first session actually routed through the 
named Cat agent; canonical-vs-stray clone con
firmed, Mac launcher GUI fix merged, 97MB EP0
8 audio pushed (no LFS, GitHub warns but allo
ws), Desktop alias re-pointed; feature-branch
-after-merge and Finder-alias-resolution gotc
has - [aimm redesign v5/ozone mockups are the
 same design](memory/redesign-v5-ozone-same-d
esign.md) — 16 August 2026, first aimm-scop
e task; the two "unreviewed" 2026-08-04 mocku
ps render the identical Ozone-12 MixCheck des
ign in two export formats, not two directions
 to choose between; also MixCheck-tab-only, d
oesn't touch the stub tabs - [agent-commons m
emory tooling parity fix](memory/agent-common
s-memory-tooling-parity-fix.md) — 16 August
 2026, out-of-scope one-off; added candidate.
js/search.js/CANDIDATE_TEMPLATE.md to agent-c
ommons/memory/, root package.json "type":"mod
ule" gotcha fixed via a directory-scoped over
ride - [Headless Chrome screenshot for UI app
roval](memory/headless-chrome-screenshot-for-
ui-approval.md) — 16 August 2026, aimm MixC
heck v5 session; local chrome.exe --headless 
recipe (Windows file:// path, host-resolver-r
ules, IIFE-not-load-listener injection) plus 
two real gotchas: nested-quote escaping throu
gh bash-heredoc/python/JS silently drops a ba
ckslash, #id-scoped override rules can outran
k existing un-scoped modifier classes - [MixC
heck six decisions — spectral ribbon + box-
shadow leak](memory/mixcheck-six-decisions-sp
ectral-ribbon-fix.md) — 17 August 2026, res
umed killed session; mockup's spectral curve 
is a blurred ribbon-around-the-line (two blur
 passes + band shape), not an area-fill — c
olour-matching alone missed this, a cropped s
creenshot caught it; `.btn.purple`'s box-shad
ow survives a more-specific background overri
de; Windows headless Chrome needs an absolute
 `--user-data-dir` path - [MixCheck R3 round 
2 — computed-style diff](memory/mixcheck-r3
-round2-computed-style-diff.md) — 17 August
 2026, built a real getBoundingClientRect+com
puted-style diff tool instead of a third scre
enshot review; the `.dc` mockup needs a real 
http:// origin (not file://) and breaks under
 a blanket `--host-resolver-rules` flag; foun
d+fixed 3 real layout bugs (header grid colum
ns, tab padding, a real-but-undisclosed meter
-override row) screenshots missed twice; fixe
d the Hope panel's 4-icon set onto real exist
ing functions - [MixCheck R3 round 5 — verb
atim transplant, live build](memory/mixcheck-
r5-verbatim-transplant-live-build.md) — 17 
August 2026, first round to actually push a l
ive non-`main` build (raw.githack.com, no Pag
es-settings risk) instead of a screenshot rev
iew page; caught + fixed a CSS-comment-contai
ning-literal-`*/` bug and a repeat `#id.class
` outranking `.panel{display:none}` bug (same
 class of bug as the day before — check thi
s every time, don't rely on remembering); clo
sure-scoped-function verification technique; 
Codex needs an explicit "don't touch git/netw
ork" prompt in this sandbox or it silently no
-ops - [MixCheck R3 Hope rail Ozone reskin](m
emory/mixcheck-r3-hope-rail-ozone-reskin.md) 
— 17 August 2026, restyled the persistent H
ope chat dock (avatar/name header, bubbles, c
omposer) to match ozone-redesign-v1.dc.html c
ontainer/layout only; docs/preview/r3-live/in
dex.html snapshot lives on main not r3-previe
w, box-shadow-survives-override bug a third t
ime - [MixCheck R3 round 6 — composer stack
ing, app-wide emoji removal, dormant WAV tran
sport](memory/mixcheck-r3-round6.md) — 17 A
ugust 2026, fixed the Hope-rail composer's se
nd-col row/column bug (real screenshots neede
d, not CSS reading), app-wide emoji strip sco
ped to true pictographic U+1F300-1FAFF only (
dingbats + RT_INSTRUCTIONS explicitly exclude
d), and found the full WAV play/stop/scrub tr
ansport already exists dormant behind `.oz-le
gacy-hide` — added drag-to-seek only, flagg
ed un-hiding as Kevin's call; CDP-driven func
tional verification technique (`--remote-allo
w-origins=*` required, synthetic PointerEvent
s via Runtime.evaluate, headless AudioContext
.currentTime doesn't advance in real time) - 
[PR #28 YouTube Shorts production process](me
mory/pr28-youtube-shorts-production-process.m
d) — 24 August 2026, Kevin's direction (fol
lowing Ashley's same-day strategy diagnosis) 
to pivot growth toward YouTube Shorts; five E
P01-EP05 proof-of-concept briefs built from v
erbatim Hope-only closing "Signal" segments; 
EP04 three-speaker attribution gotcha, Hedra 
4:3-vs-9:16 aspect-ratio gap flagged not solv
ed 
- [YouTube Shorts routing + Google Flow p
roof-of-concept](memory/youtube-shorts-routin
g-google-flow-poc.md) — corrected 24 Aug 20
26: Ashley is mandatory upstream gatekeeper (
approves Shorts Opportunity Brief first), Cat
 produces only after; Becky has no role
- [Sh
orts visual rebuild audit](memory/shorts-visu
al-rebuild-audit-2026-08-24.md) — 24 Aug 20
26, partial-alpha-pixel matte-quality check m
ethod, no image-gen/matting tool exists for C
at or in this repo, five-pose requirement has
 no precedent

- [EP01 Short 01 pacing/motion
 spec fold-in](memory/ep01-short01-pacing-spe
c-2026-08-25.md) — 25 August 2026, movie-tr
ailer-pace concept folded into the controllin
g Flow takeover handover; the test for when a
 pacing/edit-style call stays in Cat's lane v
s needs Ashley's sign-off (does it touch word
ing/claim/title/card, or only cut rhythm/b-ro
ll motion/caption typography); citation-mark 
placement must respect the existing "no logo 
or preamble" rule on a Short's opening beat
-
 [Flow prompt pre-flight QA checklist](memory
/flow-prompt-qa-checklist-2026-08-26.md) — 
26 August 2026, standing checklist built from
 EP01 Short 01's five failed/corrected Flow a
ttempts (~40 credits lost); `FLOW_PROMPT_QA_C
HECKLIST.md` in ai-news-channel, pointer adde
d to SHORTS_PRODUCTION_PROCESS.md; confirms t
he shared production branch gets concurrent p
ushes from other sessions — always fetch/re
base before pushing
- [Claims/source-verifica
tion routing correction](memory/flow-prompt-c
laims-routing-correction-2026-08-26.md) — 2
6 August 2026, Ashley owns narration/claims/s
ource accuracy, Cat owns mechanical Flow-prom
pt QA only; stop performing source-verificati
on checks when asked, route the question to A
shley instead
- [Codex review scratch-dir pat
h gotchas](memory/codex-review-scratch-dir-pa
th-gotchas.md) — 31 August 2026, AIMM serve
r-side-analysis scoping session; `codex exec`
 ignores a compound-command `cd` (use `-C`), 
Codex `rg --files` cannot see files under the
 Claude Temp scratchpad (stage review inputs 
in a plain non-repo dir e.g. `~/codex-scratch
/`), intermittent "files not present" just ne
eds a re-run
 - [MixCheck R3 mockup-05 verbat
im transplant](memory/mixcheck-r3-mockup05-tr
ansplant-2026-09-01.md) — 1 September 2026,
 coordinator-dispatched; Kevin rejected the `
70f5515` pixel-match twice, the real gap was 
exactly two element groups (coloured named wa
veform sections superseding the §4 lock; Hop
e-rail composer-at-bottom flex); judge a tran
splant by full-page render not diff size; `co
dex exec --approve-for-me` write mode self-co
mmits+self-pushes (add an explicit no-git HAR
D STOP), and `-s workspace-write` cannot be c
ombined with `--approve-for-me`; transparent 
`opacity:0` overlay canvas keeps pointer-seek
 + engine calls alive while mockup DOM layers
 show

 - [MixCheck header re-layout build 20
26-09-02.5](memory/mixcheck-header-relayout-2
026-09-02.md) — 2 September 2026, coordinat
or-dispatched; tab strip full-width + Genre/T
arget/Settings relocation shim + WAV loader i
nto the transport bar, on branch `mixcheck-he
ader-relayout`. Reusable: raw.githack `.html`
 shows a one-time "Open the page" interstitia
l (headless render must click through); AIMM 
`data-tab` map (eq=Mix Check, chain=Workbench
, knowledge=Insight); MutationObserver on `#e
q`.class is the robust "Mix Check active" hoo
k catching all 4 tab-switch code paths; `MC_W
AVE` mount is not triggered by `#mcTransport`
 visibility. Codex TP2 PASS, console clean, 3
-col align holds.

- [MixCheck Fix Queue "pro
duction line" — item 15 queue side](memory/
mixcheck-fix-production-line-2026-09-02.md) �
�� 2 September 2026, coordinator-dispatched; 
build 2026-09-02.13 on branch `mixcheck-fix-p
roduction-line` (NOT merged). Diagnosis: the 
R3 `MC_FIXQUEUE` advance loop was ALREADY wir
ed (markApplied→pending filter→render pro
motes next + ticks N/M done + emit); the only
 gaps were (1) nothing in the UI called markA
pplied — card had only a dismiss × (which 
doesn't count as "done"), Hope's `mark_fix_ap
plied` tool was the sole trigger, so the queu
e froze if Hope didn't fire it; (2) `emit()` 
passed no payload. Added: "✓ Mark done" but
ton on the up-next card → same markApplied 
path; `emit()` now carries a payload + dispat
ches new `aimm:fix-queue-changed` CustomEvent
 (additive — 8-method contract/item shape/`
aimm:analysis-complete` untouched); idempoten
t markApplied/dismiss; clean N/N-done state. 
Markey owns the Hope-chat side (hand-off in b
ranch HANDOVER.md). Reusable: `item15.mjs` CD
P harness drives analyse→advance; `make_wav
.js` synth → 4-fix queue; Codex TP2 NOT spe
nd-capped this pass.

- [Audio Specs label-al
ign fix — CSS grid column-sharing gotcha](m
emory/audiospecs-label-align-css-grid-gotcha-
2026-09-04.md) — 4 September 2026, branch `
mixcheck-audiospecs-label-align`; a blanket n
owrap-fix on a shared grid-column CSS rule ei
ther blows out the grid track past the card o
r crushes short labels to 1 letter, verified 
via headless-render+DOM-measurement not CSS r
eading; scoped `:has()` fix to just the two a
ffected rows instead

- [Audio Specs label-al
ign v2 + default-tab-on-load](memory/audiospe
cs-align-v2-plus-default-tab-2026-09-05.md) �
�� 5 September 2026, same branch `mixcheck-au
diospecs-label-align` @ `5f74cc9`; the 2026-0
9-04 two-row `:has()` fix didn't generalize (
a third row broke at a narrower width) — re
placed with width-independent `.mc-row{align-
items:flex-start}` + `.mc-d{margin-top:4px}` 
(dot/label/value always start flush with the 
row top regardless of wrapping); bundled DASH
BOARD item 13 (default tab → Mix Check) in 
the same commit, which needed 3 click-gated l
azy-inits (troubleInit/eqGridInit/refIdleAnim
ate) to also fire on cold load or the tab loo
ks active but is half-initialized; `min-width
:0` sprinkled defensively caused text overlap
: not a safe default. Codex TP1/TP2/TP3 all P
ASS.

- [Audio Specs label-wrap STACK fix v3]
(memory/audiospecs-stack-fix-v3-2026-09-05.md
) — 5 September 2026, branch `mixcheck-audi
ospecs-stack-fix` @ `6791954`; v2's dot-align
ment fix held but the wrapping itself was sti
ll broken (labels splitting mid-phrase, value
s separating from their unit) — root cause 
is the Mix Check rail's FIXED 240px width on 
every desktop viewport regardless of monitor 
size, so every `.mc-row` now unconditionally 
stacks dot+label / value instead of trying to
 prevent wrapping; Codex TP1 caught a flex-ba
sis:auto risk, TP2 caught a `*/`-inside-comme
nt bug that would have broken the next CSS ru
le.

- [Narrow-width stacking + default-tab i
nvestigation](memory/narrow-stack-plus-tab-in
vestigation-2026-09-05.md) — 5 September 20
26, branch `mixcheck-audiospecs-narrow-stack`
 @ `f74e1da`; CSS `@container` on `.mc-rows` 
restructures `.mc-row` into a label-row/value
-row grid below 460px so wrapped labels never
 interleave with values (CDP `Emulation.setDe
viceMetricsOverride` needed — headless `--w
indow-size` floors at 500px); separately, exh
austive search + a CDP-`addScriptToEvaluateOn
NewDocument` seeded-localStorage acceptance t
est run against BOTH the branch and the LIVE 
production URL found NO code bug behind the r
eported "default tab reverts for returning us
ers" — real live bytes confirmed correct an
d current; found `docs/preview/r3-live/index.
html` is a frozen Aug-17 snapshot still hardc
oding Conversation active at a different URL,
 flagged as the likely actual explanation rat
her than fabricating a fix.

- [Docs-only roa
dmap capture worktree + onclick quoting gotch
a](memory/docs-capture-worktree-and-onclick-q
uoting-2026-09-05.md) — 5 September 2026, R
OADMAP.md/DASHBOARD.html/STATUS.md backlog ca
pture (items 23-28) kept disjoint from a conc
urrent index.html session via `git worktree a
dd`; Codex TP3 caught a pre-existing broken o
nclick double-quote bug in a DASHBOARD.html C
ontinue button (fixed as a drive-by).

- [Lou
dness-comparison + reference-track backlog ca
pture](memory/loudness-comparison-refab-backl
og-2026-09-05.md) — 5 September 2026, Backl
og 29/30 on `aimm` (branch `docs-roadmap-capt
ure-loudness-refab-2026-09-05` @ `e3ec321`), 
docs-only; found + documented the three-contr
ols loudness/genre confusion, cross-reference
d Backlog 30 into the existing dormant P-B/B-
P2 item instead of duplicating; DASHBOARD cou
nt-backlog badge tracks card COUNT not highes
t-ID+1 — recompute from the DOM; background
ed `codex exec` + polling beats a foreground 
call that gets killed mid-answer past 2 minut
es.

- [Freq-solo ear-training + Glossary/Ref
erence tab capture](memory/freq-solo-glossary
-backlog-2026-09-06.md) — 6 September 2026,
 Backlog 31/32 on `aimm` (branch `docs-roadma
p-capture-freq-solo-2026-09-06` @ `89f9d34`),
 docs-only; ROADMAP.md/DASHBOARD.html numberi
ng mismatch confirmed on the pre-existing "Mu
lti-stem Mix Check" item (unnumbered in ROADM
AP.md, "22." in DASHBOARD.html); Codex TP3 en
d-to-end review caught a missing item-31→32
 forward-reference and duplicated vocabulary-
map content that TP1/TP2 diff-only reviews mi
ssed on each individual add.

- [Fix Queue st
uck-placeholder safety net + shared-clone con
currency incident](memory/fixqueue-stuck-plac
eholder-2026-09-06.md) — 6 September 2026, 
ROADMAP.md item 33 on `aimm` (branch `cat-fix
queue-stuck-placeholder-safety-net` off `main
`@`20c9384`, build `2026-09-06.4`); diagnosis
-confirmed one-line fix (early-return path sk
ipped the honest fallback text a sibling path
 already used); the "no clean 1:1 mapping" ca
ll flagged rather than force-built, using a s
ibling tool's `fix_id` convention as evidence
; separately confirms the aimm local clone is
 a LIVE SHARED working directory across concu
rrent sessions — see the paired confirmed-f
act entry for the exact recovery steps when a
nother session's checkout moves your HEAD or 
leaves uncommitted work in the tree.
- [Multi
-stem Mix Check bug pass 2](memory/multistem-
fixes-2026-09-07.md) — 7 September 2026, wa
veform reveal-before-draw timing pattern, IIF
E-private-state bridging pattern, confirmed H
ope rail text chat is a real Claude API call 
(not scripted)

- [Multi-stem Mix Check corri
dor-comparison suppression (req 3 refinement)
](memory/mixcheck-corridor-suppression-2026-0
9-07.md) — 7 September 2026, `aimm` main @ 
`4b183d2`; suppressed the full-mix genre-corr
idor comparison when a single stem is isolate
d out of a multi-stem session (solo or muted 
down to one), rather than fabricating a stem-
specific target; CSS-hidden-element-write sil
ent-no-op gotcha (Codex TP2 catch), `mcHandle
Files()`-direct + `data-act`/`data-i` button-
click TP3 technique, `--skip-git-repo-check` 
needed for scratch-dir codex reviews, second 
confirmation `~/codex-scratch` is shared acro
ss concurrent sessions.
- [Filename-first ste
m labelling](memory/filename-first-stem-label
ling-2026-09-07.md) — 7 September 2026, `ai
mm` main @ `f740fb1`; try a filename-keyword 
match before the audio-content classifier (Ke
vin's real stems already name the instrument)
, custom lookbehind/lookahead instead of JS `
\b` (which treats `_` as a word char), ambigu
ity grouped by canonical label not by which s
ynonym fired; TP3 drove the real `#refFileInp
ut` → `mcHandleFiles()` → DOM path, not j
ust a unit test; third confirmation `~/codex-
scratch` collides across concurrent sessions 
— use a task-specific subdirectory name.
- 
[LANE2_01 script v2 lock + B-roll routing cor
rection](memory/lane2-01-script-lock-v2-broll
-routing-correction-2026-09-13.md) — 13 Sep
tember 2026, wrote v2 script into canonical b
rief (PR #31), flagged Codex's fresh sourcing
 check disputes two claims, Flow "prominent p
eople" fix (start-frame anchor not invented p
hysical description), B-roll execution belong
s to Codex end to end not Cat
- [Runpod stem-
separation feasibility](memory/runpod-stem-se
paration-feasibility.md) — 21 September 202
6, aimm Backlog 34; stem separation confirmed
 unbuilt (Backlog 22 Option B), ARCH-1 backen
d still unbuilt (index.html >1MB needs raw.gi
thubusercontent fetch not Contents API), Runp
od fits the compute layer only not the backen
d gap, RTX 3070 already viable locally, RunPo
d MCP tools named available did not actually 
load this session, `gh api -F` (not `-f`) nee
ded for base64 content on `PUT contents` too

- [Two local ai-news-channel clones consolida
ted to one](memory/two-local-clones-consolida
ted-2026-09-21.md) — 21 September 2026, Win
dows `github\ai-news-channel` confirmed 23 co
mmits ahead of `Documents\Codex\Projects\ai-n
ews-channel` (deleted); gitignored files can 
exist only in a "losing" clone despite a clea
n git status, always full-tree-diff before de
leting; a shortcut's TargetPath/Arguments/Wor
kingDirectory must each be checked separately
; OneDrive KFM means a real orphaned `C:\User
s\<user>\Desktop` can exist alongside the liv
e redirected one; deleting a clone can break 
a script that hardcoded its path — grep the
 surviving repo's own tracked files, not just
 shortcuts
- [Mac to Windows B-roll/CapCut mi
gration pattern](memory/mac-windows-broll-mig
ration-2026-09-23.md) — 23 September 2026, 
`ai-news-channel` PR #33; tar-over-ssh beats 
scp/rsync for space/unicode filenames, Window
s bsdtar writes macOS xattrs as `._*` AppleDo
uble junk files (delete + recount), CapCut dr
aft path references are spread across ~10 JSO
N files not just `draft_info.json`, a Mac vol
ume can be double-mounted at two `/Volumes/` 
paths for the same inode
 - [D: home migratio
n Phase 1+4 checkpoint, Codex-scarcity fallba
ck](memory/dhome-migration-phase1-codex-scarc
ity-2026-09-23.md) — 23 September 2026, PR 
#34; repo copy + full path repoint + 19 short
cuts done and independently verified, CapCut/
Waveform config + full test pass BLOCKED (bot
h Codex accounts hit quota, scarcity-fallback
 policy invoked); robocopy from Git Bash need
s MSYS_NO_PATHCONV=1, `-s workspace-write` st
ill crashes 0xC0000142 on this desktop
 - [D:
 home migration COMPLETE](memory/dhome-migrat
ion-complete-2026-09-24.md) — 24 September 
2026, PR #34 merged; CapCut CEF UI does not r
espond to synthetic mouse/UIA clicks (use ind
irect evidence), CapCut globalSetting is INI 
not JSON, one Codex self-report claim caught 
false on re-verification
- [LANE2_02/03/04 script review](memory/lane2-02-03-04-review-2026-10-02.md) -- 2 October 2026, LANE2_02 signatory re-check (unchanged), LANE2_03 rewritten for Trump-Xi summit outcome, new LANE2_04 merging accord-candidates 2+3; already-LOCKED status handling, partial-primary-source verification pattern, WebFetch blocked-domain list
