# Task Log

## 2026-08-14 20:16

- Objective: Split Resident Loader from Tavern Pet Workshop into a directly installable GitHub repository.
- RED: `repository-layout.node.mjs` failed first because root `manifest.json`, then prebuilt `dist/index.js`, did not exist.
- Migration: Copied the Loader runtime and six Loader test suites from the website repository; source hashes matched before cleanup.
- Implementation: Added root manifest v0.1.1, direct-install README, independent TypeScript/Vite build, deterministic ZIP packaging, GitHub CI, and committed-dist contract.
- Verification so far: Loader build passed; direct-install topology test passed; 6 files / 30 behavior tests passed.
- Next: package, validate, commit/push, release v0.1.1, update the website, and perform public checks.
- Published: commit `94ef5ef`, CI run `31799793600` passed, and v0.1.1 release ZIP returned HTTP 200 with 50,600 bytes and the expected SHA-256.
- Remaining: real headed SillyTavern install/generation/reload smoke only.

## 2026-08-14 21:23

- Objective: Replace the floating Loader launcher with【酒館桌寵】in the SillyTavern extensions drawer and split persistent letter/conversation-extra archives into pet-click reading pages.
- Product confirmation: manual generation only, no chat-floor insertion, separate archive views, explicit pet on/off, unbind without deletion, exact label「指定連線設定檔案」, prominent pack import, and plain-language speed controls.
- RED: missing entry/menu modules, missing unbind repository method, and old single-panel title all failed before implementation.
- Implementation: added the extension entry, pet two-button quick menu, settings/letters/stories views, safe unbind, hidden file input with prominent trigger, advanced speed sliders, and v0.2.0 committed dist/package.
- Verification: 8 test files / 35 tests passed; build, root topology, 10/10 extension validation, and package passed; package SHA-256 `1b6c7ab2f770215617a7c70eeb155e382e02dca32c9ea98d25dc05b6b53ecdb5`.
- Remaining: commit/push/release and real headed SillyTavern smoke.

## 2026-08-14 21:36

- Gap audit: Mini's approval also covered making the daily-companion Prompt operational; v0.2.0 still only stored that Prompt.
- RED: tests failed for missing daily connection/context settings, missing safe character-card extraction, missing role-card prompt section, and missing manual-generate UI.
- Implementation: v0.2.1 adds manual「讓桌寵說一句」generation, current/profile selection, recent-floor control, safe visible card context (description/personality/scenario only), and a temporary speech bubble. Automatic generation remains off and SEND remains zero.
- Verification: 8 test files / 38 tests passed; build, package, root topology, 10/10 extension validation, and both hybrid contract validators passed. Package SHA-256: `b61a244f1f2a785fa8970fcada528ffaa115d9cbb790513904c8c7279a88b36e`.
- Next: commit/push, v0.2.1 release, public checks, and real headed SillyTavern smoke.
