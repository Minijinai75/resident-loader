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

## Pending

- GitHub Actions and public release download.
- Real headed SillyTavern install/generation/reload smoke.
