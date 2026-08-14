# Project Status

## Snapshot

- Project: Resident Loader
- Active task: Split the compact extension entry, full settings, letter diary, and story board into separate HTML views
- Current phase: v0.3.0 plus read-only world-info selection and mobile page polish implemented, packaged, and locally verified
- Overall status: mobile-polished v0.3.0 published and publicly verified; waiting for Mini's in-Tavern update smoke
- Last updated: 2026-08-14 23:05 Asia/Taipei

## Current Goal

Users install one【酒館桌寵】extension, use a compact extensions-drawer entry, open complete settings in a separate HTML page, and read persistent letters/stories in diary/board pages with TXT export.

Bound characters can also choose enabled always-on world-info entries independently for daily, letter, and story generation without modifying SillyTavern lorebooks.

## Success Criteria

- `manifest.json` and prebuilt `dist/` exist at repository root.
- Existing Loader behavior tests remain green after extraction from the website repo.
- The repository can build and produce an offline ZIP.
- v0.3.0 tests, committed dist, package, and release asset are verified.
- The workshop links to and copies the repository installation URL.

## Current Blockers

- No release blocker. Mini's real SillyTavern update smoke remains.

## Next Step

Update the installed extension and exercise compact entry, separate settings, character-card switching, daily bubble, diary/board reading, TXT download, and history reload in real SillyTavern.
