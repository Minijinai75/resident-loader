# Verification

## 2026-08-14

| Command | Result | Notes |
|---|---|---|
| `node --test tests/repository-layout.node.mjs` before implementation | EXPECTED FAIL | Missing root `manifest.json`, then missing prebuilt `dist/index.js` |
| SHA-256 comparison of migrated `src/loader/*.ts` | PASS | All ten source files matched the website repository before cleanup |
| `npm run build` | PASS | Generated `dist/index.js` and `dist/style.css` |
| `node --test tests/repository-layout.node.mjs` | PASS | Root manifest points to existing dist files, new home page, and auto-update |
| `npm test` | PASS | 6 files / 30 tests |
| `npm run package` twice | PASS | Both runs produced SHA-256 `bdb512c679f356e3b3b528ff49dc1fe470e399f656918c5abf4e0458c237bfd5` |
| ZIP content listing | PASS | Exactly `manifest.json`, `README.md`, `dist/index.js`, and `dist/style.css` |
| `validate-extension.js` | PASS | 10 passed / 0 warnings / 0 failures; root topology and auto-update accepted |
| GitHub Actions run `31799793600` | PASS | Independent CI install, tests, build, committed-dist drift check, and package completed |
| Public raw manifest and v0.1.1 release requests | PASS | Both HTTP 200; ZIP 50,600 bytes; SHA-256 matched `bdb512c679f356e3b3b528ff49dc1fe470e399f656918c5abf4e0458c237bfd5` |
| Distillation contract validator after v0.2 flow confirmation | PASS | Hybrid route; 10-section contract accepted |
| `npm test` after v0.2 implementation | PASS | 8 files / 35 tests; drawer entry, no launcher, separate reading views, unbind preservation, and prior behavior all green |
| `npm run package` for v0.2.0 | PASS | Build succeeded; `resident-loader-v0.2.0.zip` SHA-256 `1b6c7ab2f770215617a7c70eeb155e382e02dca32c9ea98d25dc05b6b53ecdb5` |
| `node --test tests/repository-layout.node.mjs` / `validate-extension.js` | PASS | Direct-install topology passed; 10 passed / 0 warnings / 0 failures; manifest display name is「酒館桌寵」 |
| `npm test` after v0.2.1 daily-companion activation | PASS | 8 files / 38 tests; daily settings, safe character-card context, manual UI, and all prior behavior green |
| `npm run package` for v0.2.1 | PASS | Build succeeded; `resident-loader-v0.2.1.zip` SHA-256 `b61a244f1f2a785fa8970fcada528ffaa115d9cbb790513904c8c7279a88b36e` |
| Root topology, extension validator, and hybrid contract validators | PASS | Repository layout passed; extension validation 10/10 with 0 warnings/failures; both contract copies accepted |
| GitHub Actions run `31805997614` | PASS | Independent v0.2.1 CI completed for commit `8155dd0` |
| Public manifest, release page, and v0.2.1 ZIP | PASS | Manifest name/version are `酒館桌寵`/`0.2.1`; ZIP HTTP 200, 53,737 bytes, SHA-256 `b61a244f1f2a785fa8970fcada528ffaa115d9cbb790513904c8c7279a88b36e` |
| Native drawer + settings-click RED/GREEN tests | PASS | 2 files / 5 focused tests; click mounts settings inside `.inline-drawer-content` and loading errors are visible |
| `npm test` after v0.2.2 drawer repair | PASS | 8 files / 40 tests |
| `npm run package` for v0.2.2 | PASS | Build succeeded; `resident-loader-v0.2.2.zip` SHA-256 `13b80388c830a4d1e488686dd4c26ea09aad2c790e85594f1fedc2481a6dbfc0` |
| Root topology and extension validator for v0.2.2 | PASS | Direct-install layout passed; 10 passed / 0 warnings / 0 failures |
| GitHub Actions run `31808691495` | PASS | Independent v0.2.2 CI completed for commit `e443091` |
| Public manifest, dist, and v0.2.2 ZIP | PASS | v0.2.2; native drawer/inline mount present; obsolete action absent; ZIP HTTP 200, 54,561 bytes, matching SHA-256 |
| Compact-entry / separate-pages RED/GREEN suite | PASS | Initial 9 files / 42 tests; no embedded settings, both generation settings live on settings page, reading pages contain no settings, TXT formatting/filenames covered |
| ST 1.18 always-on world-info selection RED/GREEN | PASS | Adapter filters `constant` / `disable`, selection is per feature and per character, and only checked content enters Prompt; full suite 10 files / 44 tests |
| `npm run package` twice for final v0.3.0 | PASS | Both builds produced SHA-256 `0c48e383118160b64728c2abc81f2406d7b85301d08bc611c6dffffdc2f17e90` |
| Root topology / extension validator / hybrid contract validator | PASS | Direct install passed; extension 10/10 with 0 warnings/failures; technical contract passed hybrid route |
| ZIP listing | PASS | Exactly `manifest.json`, `README.md`, `dist/index.js`, and `dist/style.css` |
| Chrome against committed v0.3.0 dist | PASS | Drawer remained compact (173px, no embedded panel); separate settings page had two feature-setting sections; letter diary had TXT action and zero setting controls |
| Chrome mobile QA at 390×844 | PASS | Settings and letter diary stayed within a 374px panel with 8px safe margins; document width remained 390px, settings grid was one column, and all checked actions were at least 48px high |
| `npm test` after mobile polish | PASS | 10 files / 44 tests |
| Final build / topology / extension / hybrid validators | PASS | Build passed; direct-install topology passed; extension 10/10 with 0 warnings/failures; technical contract passed hybrid route |
| `npm run package` twice after mobile polish | PASS | Both runs produced SHA-256 `ea8a78c877d6ca8ec35ccebc91ee1a0e3bdba67eaaa6eb009b44e8f90b750149` |
| GitHub Actions run `31812640285` | PASS | Independent install, tests, build, committed-dist drift check, and package completed for `f4d113d` |
| Refreshed public v0.3.0 ZIP | PASS | HTTP download returned 57,784 bytes and SHA-256 `ea8a78c877d6ca8ec35ccebc91ee1a0e3bdba67eaaa6eb009b44e8f90b750149` |
| Live workshop after Pages run `31811981730` | PASS | v0.3.0 Loader link, row-level size/vertical sync control, and mobile viewport are present |
| Letter/story visual structure TDD | PASS | RED confirmed missing date-rail/letter-sheet and numbered pastel-card structures; focused panel suite then passed 3/3 |
| `npm test` after v0.3.1 reading-page redesign | PASS | 10 files / 44 tests |
| `npm run build` after v0.3.1 reading-page redesign | PASS | TypeScript and Vite production build completed; committed dist regenerated |
| Chrome desktop visual QA at 1100×850 | PASS | Letter feed stayed 680px wide; story feed stayed 720px wide; both panels fit without horizontal overflow |
| Chrome mobile visual QA at 390×844 | PASS | Both pages fit a 374px panel with 8px margins, 390px document width, and 48px minimum buttons; letter columns were 58px + 286px and story notes were 304px wide |
| `npm run package` twice for v0.3.1 | PASS | Both runs produced SHA-256 `e1c6a804df98e6ed1d043067595d92ebb7fecff3af3d182a6c3304ec3cce4df3` |
| GitHub Actions run `31816357745` | PASS | Independent install, 10 files / 44 tests, build, committed-dist drift check, and package completed for `d0e0f2e` |
| Public manifest/dist/v0.3.1 ZIP | PASS | Manifest name/version are【酒館桌寵】/0.3.1; date-rail and four-tone board markers are live; ZIP is 59,435 bytes with matching SHA-256 |
| P0-1 adapter RED/GREEN (26-09-24) | PASS | 12 new tests failed against the old `triggerSlash` path, then passed with `ConnectionManagerRequestService.sendRequest`; five prompt samples (`\|`, multi-line, quotes, `{{macro}}`, trailing backslash) reach `messages[0].content` byte-for-byte |
| P0-2 repository/app RED/GREEN (26-09-24) | PASS | 4 repository tests (idempotent re-import, sprite conflict, manifest conflict with both names, explicit overwrite) + 2 app tests through a real `<input type=file>` change event (decline keeps old pack, confirm replaces) |
| `npm test` after P0-1/P0-2/P2-13 | PASS | 12 files / 62 tests (44 existing + 18 new) |
| `npm run build` after each fix | PASS | tsc + vite build; committed dist regenerated in each commit |
| `npm run package` twice for v0.3.2 | PASS | Both runs produced SHA-256 `f81d43c9058bf87eea2aad5ebd6a298b00f8cf2176b7ed6ae92d06567683bad1`, 72,908 bytes |
| v0.3.2 ZIP extracted with Expand-Archive | PASS | Exactly `LICENSE`, `README.md`, `dist/index.js`, `dist/style.css`, `manifest.json`; extracted LICENSE SHA-256 `0d96a4ff68ad6d4b6f1f30f713b18d5184912ba8dd389f86aa7710db079abcb0` equals the repo LICENSE (AGPL-3.0 text); manifest inside reports 0.3.2 |
| Mini's local SillyTavern version | PASS | `st_status` returned 1.18.0, same as the reference source tree used for the review |

## Pending

- Real headed SillyTavern smoke (never run since 8/15), now including one real profile-mode generation through `ConnectionManagerRequestService.sendRequest` (uses Mini's API quota).
- GitHub Release v0.3.2 with `releases/resident-loader-v0.3.2.zip`, then update the workshop offline link (`tavern-pet-workshop/index.html:286`, README) from v0.3.1 to v0.3.2 — the published v0.3.1 ZIP contains no LICENSE.
