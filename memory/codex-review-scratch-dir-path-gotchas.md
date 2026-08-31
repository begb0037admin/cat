# Codex review from a scratch dir — path gotchas

**When:** 2026-08-31, AIMM server-side-analysis scoping task (Cat).

**Two confirmed gotchas running `codex exec` for the mandatory 3-touchpoint review:**

1. **`codex exec` does NOT inherit a `cd` from a compound Bash command.** It
   starts in the Bash tool's own cwd (here the repo root, or `~/github`). Pass
   `-C <ABS_DIR>` explicitly, or `cd` in a *separate* Bash call first, then run
   codex.

2. **Codex's file discovery (`rg --files`) does not find files placed under the
   Claude Temp scratchpad path**
   (`C:\Users\admin\AppData\Local\Temp\claude\...\scratchpad\`). It reported
   "file not present" for a doc that definitely existed there, twice. Fix:
   stage review inputs in a plain non-temp, non-repo dir — used
   `C:/Users/admin/codex-scratch/aimm-analysis/` and it worked. `-C` that dir,
   reference files by bare name in the prompt, tell it to read with
   `Get-Content -Raw`.

3. Intermittent: even from a good dir, one TP run occasionally still returns
   "files not present" — just re-run the same touchpoint (a tooling glitch, not
   a finding; does not count against the 4-pass cap).

**Working invocation shape:**
`codex exec -C <abs non-temp dir> --disable apps -s read-only --skip-git-repo-check -o <abs out path> "<prompt: review-only, no git/network/package, no project-agent role, read ./FILE with Get-Content>"`

Also still true (agent-commons confirmed fact `2026-08-29-codex-exec-s-read-only-...`):
`-s read-only` is NOT a real sandbox on Kevin's Windows box, and codex can
bootstrap as a project agent if cwd is a trusted repo — hence the explicit
"no project-agent role" line in every prompt and running from a non-repo dir.
