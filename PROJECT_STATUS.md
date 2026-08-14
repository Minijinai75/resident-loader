# Project Status

## Snapshot

- Project: Resident Loader
- Active task: Redesign the letter diary and conversation-extra board as polished mobile reading pages
- Current phase: v0.3.1 date-rail letters and pastel story cards implemented and locally verified
- Overall status: v0.3.1 implementation is green; packaging and public release remain
- Last updated: 2026-08-14 23:45 Asia/Taipei

## Current Goal

Users install one【酒館桌寵】extension, use a compact extensions-drawer entry, open complete settings in a separate HTML page, and read persistent letters/stories in diary/board pages with TXT export.

Bound characters can also choose enabled always-on world-info entries independently for daily, letter, and story generation without modifying SillyTavern lorebooks.

## Success Criteria

- `manifest.json` and prebuilt `dist/` exist at repository root.
- Existing Loader behavior tests remain green after extraction from the website repo.
- The repository can build and produce an offline ZIP.
- v0.3.1 tests, committed dist, package, and release asset are verified.
- The workshop links to and copies the repository installation URL.

## Current Blockers

- No implementation blocker. v0.3.1 packaging, release, and Mini's real SillyTavern update smoke remain.

## Next Step

Package and publish v0.3.1, then update the installed extension and exercise diary/board reading, TXT download, and history reload in real SillyTavern.
