# Project Status

## Snapshot

- Project: Resident Loader
- Active task: Split the compact extension entry, full settings, letter diary, and story board into separate HTML views
- Current phase: v0.3.0 implemented, packaged, and locally verified
- Overall status: ready to publish; waiting for Mini's in-Tavern update smoke after release
- Last updated: 2026-08-14 22:43 Asia/Taipei

## Current Goal

Users install one【酒館桌寵】extension, use a compact extensions-drawer entry, open complete settings in a separate HTML page, and read persistent letters/stories in diary/board pages with TXT export.

## Success Criteria

- `manifest.json` and prebuilt `dist/` exist at repository root.
- Existing Loader behavior tests remain green after extraction from the website repo.
- The repository can build and produce an offline ZIP.
- v0.3.0 tests, committed dist, package, and release asset are verified.
- The workshop links to and copies the repository installation URL.

## Current Blockers

- No release blocker. Mini's real SillyTavern update smoke remains.

## Next Step

Publish v0.3.0, then update the installed extension and exercise compact entry, separate settings, character-card switching, daily bubble, diary/board reading, TXT download, and history reload in real SillyTavern.
