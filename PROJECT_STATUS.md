# Project Status

## Snapshot

- Project: Resident Loader
- Active task: Reopen for the open ecosystem — fix the 5.1 code review's P0 items (CODE_REVIEW_5.1_260924) before anyone else ships packs
- Current phase: v0.3.2 — P0-1 (profile mode via `ConnectionManagerRequestService.sendRequest`), P0-2 (pack id conflict guard + workshop creator namespace), P2-13 (LICENSE inside the ZIP, version bump) fixed, tested, and committed; awaiting reviewer sign-off
- Overall status: v0.3.2 built and packaged locally (SHA-256 `f81d43c9…3bad1`); GitHub Release v0.3.2 and Mini's in-Tavern smoke still pending
- Last updated: 2026-09-24 01:34 Asia/Taipei

## Current Goal

Users install one【酒館桌寵】extension, use a compact extensions-drawer entry, open complete settings in a separate HTML page, and read persistent letters/stories in diary/board pages with TXT export.

Bound characters can also choose enabled always-on world-info entries independently for daily, letter, and story generation without modifying SillyTavern lorebooks.

## Success Criteria

- `manifest.json` and prebuilt `dist/` exist at repository root.
- Existing Loader behavior tests remain green after extraction from the website repo.
- The repository can build and produce an offline ZIP that carries the AGPL-3.0 LICENSE.
- v0.3.2 tests, committed dist, and package are verified; the v0.3.2 release asset is still to be published.
- The workshop links to and copies the repository installation URL.

## Current Blockers

- GitHub Release v0.3.2 not created yet (Mini); the workshop offline link still points at the v0.3.1 ZIP, which contains no LICENSE.
- Real SillyTavern smoke has not been run since 8/15 (review §五.2); profile mode has never been exercised end-to-end in a real Tavern.

## Next Step

Reviewer (5.1) verifies commits `40d268d`, `496afd0`, and the P2-13 commit; then Mini creates Release v0.3.2 with `releases/resident-loader-v0.3.2.zip`, updates the workshop link, and runs the in-Tavern smoke including one profile-mode generation.
