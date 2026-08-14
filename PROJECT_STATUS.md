# Project Status

## Snapshot

- Project: Resident Loader
- Active task: Publish a repository-root SillyTavern extension install
- Current phase: Local split verified; publishing next
- Overall status: in progress
- Last updated: 2026-08-14 20:16 Asia/Taipei

## Current Goal

Users paste `https://github.com/Minijinai75/resident-loader` into SillyTavern's extension installer, then import safe `.jrpack.zip` character packs made by Tavern Pet Workshop.

## Success Criteria

- `manifest.json` and prebuilt `dist/` exist at repository root.
- Existing Loader behavior tests remain green after extraction from the website repo.
- The repository can build and produce an offline ZIP.
- GitHub CI passes and the v0.1.1 release asset is downloadable.
- The workshop links to and copies the repository installation URL.

## Current Blockers

- None in code. GitHub CI/public release checks and a real headed SillyTavern installation smoke remain after publishing.

## Next Step

Commit and push v0.1.1, publish its offline ZIP release, then verify installation from the public repository URL.
