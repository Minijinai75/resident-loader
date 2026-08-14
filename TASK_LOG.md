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
- Published: implementation commit `8155dd0`; GitHub Actions run `31805997614` passed; v0.2.1 release asset returned HTTP 200, 53,737 bytes, and the expected SHA-256. Public manifest reports `display_name: 酒館桌寵` and version `0.2.1`.
- Remaining: real headed SillyTavern smoke only.

## 2026-08-14 22:08

- Report: the extension entry should use SillyTavern's collapsible presentation, and clicking「開啟設定」appeared to do nothing after updating.
- Reference: distilled the public Chat Completion Tabs implementation: `inline-drawer` root, `inline-drawer-toggle inline-drawer-header`, `inline-drawer-content`, native icon classes, and explicit open-class toggling.
- RED: native-drawer structure/toggle tests failed; the settings click test also reproduced no panel after an immediate event-loop turn.
- Root cause: the entry was a custom static card and launched a detached asynchronous body modal with no loading or failure feedback; it did not participate in the drawer's visible content flow.
- Fix: v0.2.2 removes the redundant settings button; expanding the native drawer automatically mounts settings inside it, shows immediate loading/failure text, and keeps letter/story readers as body overlays.
- Verification: focused drawer/settings-click tests passed; full suite passed (8 files / 40 tests); package, direct-install topology, and extension validation 10/10 passed. ZIP SHA-256: `13b80388c830a4d1e488686dd4c26ea09aad2c790e85594f1fedc2481a6dbfc0`.
- Next: commit/push, release/public verification, then Mini updates once more.
