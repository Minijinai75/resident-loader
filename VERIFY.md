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

## Pending

- Real headed SillyTavern install/generation/reload smoke.
