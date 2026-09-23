# Project Status

## Snapshot

- Project: Resident Loader
- Active task: Reopen for the open ecosystem — fix the 5.1 code review's P0 items (CODE_REVIEW_5.1_260924) before anyone else ships packs
- Current phase: v0.3.2 — P0-1 (profile mode via `ConnectionManagerRequestService.sendRequest`), P0-2 (pack id conflict guard + workshop creator namespace), P2-13 (LICENSE inside the ZIP, version bump), P2-14 (`.gitattributes` LF, CRLF-free sourcemap) and the reviewer's three residue items fixed, tested, committed, pushed; CI green at `7ac8a0a` (run `35898464429`)
- Overall status: v0.3.2 reproducible on Windows and Linux — local ×2 and CI all produce SHA-256 `2ba7f90ca8bf827417ebf4365e74935e30b6d40ed83bd95b2012d37c77ca2621` (72,854 bytes). GitHub Release v0.3.2 and Mini's in-Tavern smoke still pending
- Last updated: 2026-09-24 01:53 Asia/Taipei

## Current Goal

Users install one【酒館桌寵】extension, use a compact extensions-drawer entry, open complete settings in a separate HTML page, and read persistent letters/stories in diary/board pages with TXT export.

Bound characters can also choose enabled always-on world-info entries independently for daily, letter, and story generation without modifying SillyTavern lorebooks.

## Success Criteria

- `manifest.json` and prebuilt `dist/` exist at repository root.
- Existing Loader behavior tests remain green after extraction from the website repo.
- The repository can build and produce an offline ZIP that carries the AGPL-3.0 LICENSE, with the same hash on Windows and on CI.
- v0.3.2 tests, committed dist, CI, and package are verified; the v0.3.2 release asset is still to be published.
- The workshop links to and copies the repository installation URL.

## Current Blockers

- GitHub Release v0.3.2 not created yet (Mini) — publish the `2ba7f90c…` build, never the superseded `f81d43c9…` one from `aa9c368`; the workshop offline link still points at the v0.3.1 ZIP, which contains no LICENSE.
- Real SillyTavern smoke has not been run since 8/15 (review §五.2); profile mode has never been exercised end-to-end in a real Tavern. Reviewer's one-liner for the console: `SillyTavern.getContext().ConnectionManagerRequestService`.

## Next Step

Mini creates Release v0.3.2 with `releases/resident-loader-v0.3.2.zip` (SHA-256 `2ba7f90c…2621`), updates the workshop link, and runs the in-Tavern smoke including one profile-mode generation. Reviewer's verdict: P0-1, P0-2, workshop namespace received; P2-13 received once CI went green (`7ac8a0a`).
