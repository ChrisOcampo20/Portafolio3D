# Plan

1. [done] Inspect the app's build configuration — package.json already includes TypeScript and the repository has a pnpm lockfile.
2. [blocked] Make local dependencies available to the build — Craft's command runner requires approval that this session's policy denies; local shell cannot enter the workspace, and pnpm is unavailable.
3. [blocked] Rebuild and run rebuild_check — The latest rebuild_check still fails because the local tsc executable is unavailable.
4. [done] Restore Craft's original mode — Deep mode is back to false.
