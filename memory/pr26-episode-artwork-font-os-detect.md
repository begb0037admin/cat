---
name: pr26-episode-artwork-font-os-detect
description: "Fixed a real Windows-breaking bug in 03_Spotify_Podcast/tools/episode-artwork/render_episode_template.py: the shared episode_template_config.json had a Mac-only font path saved in it, crashing the Windows launcher; fix makes the script OS-aware instead (PR #26)"
metadata:
  node_type: memory
  type: project
  modified: 2026-08-07
---

Kevin reported a real, verified bug: the episode artwork tool's Windows launcher (`Run Hope Episode Artwork.lnk` → `RunHopeEpisodeArtwork.bat` → `episode_template_studio.py` → `render_episode_template.main()`) would crash with `FileNotFoundError: Impact font not found: /System/Library/Fonts/Supplemental/Impact.ttf`, because `episode_template_config.json` — a config file **shared and rewritten by both** the Windows `.bat` and Mac `.command` launchers — had the macOS Impact font path saved in it explicitly from a prior Mac-context run, and `render_episode_template.py` line 33 defaulted to that same macOS-only path and then raised if the resolved path didn't exist on the current machine.

Fixed as PR https://github.com/begb0037admin/ai-news-channel/pull/26 (`cat/episode-artwork-font-os-detect` → `main`), not yet merged as of this write.

**Fix — `render_episode_template.py`:** added `resolve_font_path(config)`. It trusts `config.get("font")` only if `Path(configured).is_file()` is true *on the current OS* (so a stale path saved by the other platform is silently ignored rather than trusted); otherwise it branches on `platform.system()` — `"Darwin"` → `/System/Library/Fonts/Supplemental/Impact.ttf` (byte-identical to the script's prior unconditional default — this is why the Mac path is trusted-but-untested, see below), `"Windows"` → `Path(os.environ.get("WINDIR", "C:/Windows")) / "Fonts" / "impact.ttf"`. Raises a clear `FileNotFoundError` naming the platform if neither resolves.

**Fix — `episode_template_config.json`:** cleared the hardcoded `"font"` value to `""` so the shared file no longer pins one OS's path for both platforms going forward — the script's own per-OS detection is now the source of truth, not the saved config value. Confirmed by reading `episode_template_studio.py` that it never touches the `"font"` key on save, so the GUI form re-saving the config can't re-pin a path.

**Fix — `README.md`:** the doc claimed `C:/Windows/Fonts/impact.ttf` was the *only* path ("Every text layer uses `C:/Windows/Fonts/impact.ttf`") — corrected to describe both platforms and explain the config field is normally left blank.

**Verification — what was actually tested vs. only reasoned about, per the task's explicit ask to be honest about the split:** Ran the fixed script directly on this Windows machine (Python 3.14.5, Pillow 12.2.0) three ways, all exit code 0, all producing 9 layers + `layer-manifest.json`: (1) config `"font"` blank → auto-resolved to `C:\WINDOWS\Fonts\impact.ttf`; (2) config `"font"` forced to the stale Mac path (reproducing the exact original bug) → correctly fell through to the Windows path instead of crashing; (3) config `"font"` forced to a valid existing Windows override path → respected. **The Mac (Darwin) branch was never run — no Mac available in this environment.** It was verified by code review only: the literal string `/System/Library/Fonts/Supplemental/Impact.ttf` in the new `Darwin` branch is byte-for-byte identical to what was previously the script's unconditional default (old line 33), so if Mac execution worked before this change, it resolves to the identical path now — nothing about Mac behavior was altered, only gated behind a platform check it will always satisfy.

**Process notes for future work on this tool or similar shared-config cross-platform tools in this repo:** the root cause pattern — a single config file read/written by two OS-specific launchers, with one OS's absolute filesystem path saved into it — is a general trap, not specific to fonts. Any future field added to `episode_template_config.json` (or an equivalent config in another tool) that holds an absolute filesystem path should get the same treatment: script-side OS detection as the source of truth, config value trusted only if it verifiably exists on the *current* machine.

**Tooling gotcha reconfirmed:** `gh api --method PUT .../contents/<path> -f content=@file.b64` fails with `"content is not valid Base64"` — must use capital `-F content=@file.b64` (matches the existing `-f` vs `-F` distinction already in `memory/index.json`, reconfirmed here on a fresh case).

See also: `memory/index.json` entry `2026-08-07-episode-artwork-font-path-must-be-os-detected-never-trusted-from-shared-config` (confirmed-fact form of this same lesson).
