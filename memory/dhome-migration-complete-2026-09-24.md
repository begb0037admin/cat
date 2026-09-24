# D: home migration complete (2026-09-24) — CapCut CEF click automation limitation, INI/XML app-config repoint pattern

**Task:** completed the ai-news-channel D: home migration (Phase 2 CapCut/Waveform config
repoint, Phase 3 full launch/render test pass, C: cleanup, PR #34 merge) started overnight in
`memory/dhome-migration-phase1-codex-scarcity-2026-09-23.md` after Codex's 5-hour window reset.

**CapCut's globalSetting is a plain INI-style config, not JSON** —
`AppData\Local\CapCut\User Data\Config\globalSetting`, `[General]` section, CRLF line endings.
Key path settings: `currentCustomDraftPath`, `currentCachePath`, `customMaterialPath`. Editing
these and moving the actual draft folders (not touching each draft's own internal JSON media
references — that's separate, only needed when a draft is actively being re-edited) is enough to
relocate CapCut's whole project home.

**Waveform 14 stores recent-file paths in `Waveform.settings`** (JUCE PropertiesFile XML under
`AppData\Roaming\Tracktion\Waveform\`) — can go stale across repo moves same as anything else;
worth grep/repointing during a repo relocation even though Waveform's actual project files live
in-repo.

**CapCut's CEF-based UI does not respond to synthetic Win32 mouse input** that worked on every
other app tested in the same session (two different Tkinter/ttk Python GUIs responded fine to
`SetCursorPos`+`mouse_event` after a bit of coordinate-offset debugging, and to
`WScript.Shell.SendKeys` Tab+Space navigation once focus was confirmed via a screenshot showing
the dotted focus ring). Tried: `SetForegroundWindow`+`SetCursorPos`+`mouse_event` (single and
double variants), and a `System.Windows.Automation` `InvokePattern` search for a button —
Automation couldn't even enumerate CapCut's UI tree usefully. All silently no-opped (no error,
just no effect) on CapCut specifically. Don't burn much time on this if it recurs — treat it as
a known CapCut/CEF limitation and fall back to indirect evidence (e.g. a real per-project
thumbnail rendering from the repointed path is itself strong evidence the app read that
project's data) rather than forcing full interactive automation.

**Screenshot-based GUI verification recipe that worked reliably (Windows, Git Bash driving
PowerShell):** a small reusable `screenshot.ps1` using
`System.Windows.Forms.SystemInformation]::VirtualScreen` + `Graphics.CopyFromScreen`, called via
`powershell.exe -NoProfile -File ... -OutPath ...`, then read the PNG with the Read tool. Check
`[System.Windows.Forms.SystemInformation]::VirtualScreen` bounds first if multi-monitor is even
a possibility (X/Y offset would break coordinate math) — this machine turned out single-monitor
with a 0,0 origin, but that's not guaranteed elsewhere.

**A tab-counted keyboard-navigation click on a Tkinter/ttk dialog needs the actual displayed
tab order verified by a screenshot (checking for the visible dotted focus ring), not assumed
from reading the source's widget-creation order** — first attempt undercounted by one Tab
(landed on the last combobox, not the button); confirmed via screenshot before retrying,
rather than guessing again blind.

**Codex's own self-report had one false claim, caught by direct re-verification:** it reported
the `Hope in AI - Waveform Projects.lnk` shortcut as "still broken/outdated, points at the old
C: clone" — a live PowerShell COM check showed it already correctly pointed at the D: clone and
resolved. Recorded in HANDOVER.md rather than silently trusted or silently corrected without
a note — this is exactly the kind of claim the standing "verify subagent claims" rule exists for.

confirmed_via: Live PowerShell testing on DESKTOP-MJDJM64 — screenshots at every step, byte/count
verification of moved CapCut drafts, re-grep of both settings files post-edit, live shortcut
COM property reads, `gh pr merge`/`git log` confirming PR #34 merged at `700fd66`.
date: 2026-09-24
