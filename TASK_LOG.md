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
- Published: implementation commit `e443091`; GitHub Actions run `31808691495` passed. Public manifest reports `酒館桌寵` v0.2.2; release ZIP returned HTTP 200, 54,561 bytes, and SHA-256 `13b80388c830a4d1e488686dd4c26ea09aad2c790e85594f1fedc2481a6dbfc0`.
- Public dist check: native drawer event and inline-panel mount are present; the obsolete `open-settings` action is absent.
- Remaining: Mini updates/reloads SillyTavern and expands【酒館桌寵】for the real runtime smoke.

## 2026-08-14 22:43

- Product correction: The extensions drawer must never contain the full settings form. It now keeps only five compact actions: settings, pet on, pet off, letter diary, and story board.
- HTML views: Settings opens as a standalone overlay and owns all import/binding/appearance/Prompt/context/profile/generation controls. Letter history is a warm diary page; story history is a message-board page. Reading pages contain dates, generated content, copy/delete actions, and TXT download, but no Prompt or connection settings.
- Binding clarification: Each character card has its own pack binding and settings. `CHAT_CHANGED` unloads the old sprite and loads the next character's binding; an unbound character never inherits the previous pet. Histories remain character + chat + feature scoped.
- RED/GREEN: Updated entry, shell, and panel contracts and added TXT-export tests. Expected failures covered the old inline panel, mixed settings/history pages, and missing export module; all passed after implementation.
- Verification before world-info addition: 9 test files / 42 tests passed; build and deterministic v0.3.0 package passed twice; direct-install topology, hybrid contract, and extension validator 10/10 passed.
- Browser smoke: Real Chrome loaded committed dist. Expanded drawer was 173px tall with no embedded panel; settings opened outside the drawer with both feature-setting sections; letter diary opened with TXT action and zero setting sections.
- Next: Commit/push, publish v0.3.0, verify public manifest/dist/ZIP, and update workshop download link.

## 2026-08-14 22:51

- Added request: When a character card is bound, expose its currently relevant always-on world-info entries as explicit Prompt selections.
- Evidence: Queried Mini's `證據庫/graphify圖_ST-1.18.0`, then verified `public/scripts/world-info.js`: `getSortedEntries()` assembles global/character/chat/persona entries, character lore uses the card's primary and auxiliary books, and entries use `constant` plus `disable` state.
- Boundary: Read-only adapter. It dynamically imports SillyTavern's own `/scripts/world-info.js`, lists only non-empty `constant === true && disable !== true` entries, and never changes world selection or entry state.
- Behavior: Daily, letters, and stories each keep independent `world::uid` checkbox selections in per-character settings. Only checked entries are included in the generated Prompt, with a 16,000-character total safety cap.
- RED/GREEN: Missing adapter, settings fields, Prompt section, and UI checkboxes all failed before implementation. Focused tests passed after implementation; full suite now passes 10 files / 44 tests.
- Package: v0.3.0 built reproducibly twice after the final README update; SHA-256 `0c48e383118160b64728c2abc81f2406d7b85301d08bc611c6dffffdc2f17e90`.

## 2026-08-14 23:03

- Mobile polish: settings, letter diary, and story board headers now wrap cleanly; header actions use the full width, fields stay one-column, content cards use tighter padding, and extension-entry actions become large two-column touch targets with the settings action full width.
- Browser QA: Chrome mobile emulation at 390×844 reported a 390px document width with no horizontal overflow, an 8px safe margin around the 374px panel, a one-column settings grid, and 48px minimum action height. The letter diary also remained inside the viewport with a 48px TXT button.
- Verification: 10 files / 44 tests passed; build, direct-install topology, extension validator 10/10, and hybrid contract validator passed.
- Package: v0.3.0 built reproducibly twice with SHA-256 `ea8a78c877d6ca8ec35ccebc91ee1a0e3bdba67eaaa6eb009b44e8f90b750149`.
- Next: Commit/push, refresh the v0.3.0 release asset, and verify the public ZIP hash.
- Published: commit `f4d113d`; GitHub Actions run `31812640285` passed. The refreshed v0.3.0 public ZIP is 57,784 bytes and matches SHA-256 `ea8a78c877d6ca8ec35ccebc91ee1a0e3bdba67eaaa6eb009b44e8f90b750149`.
- Workshop check: the live site links v0.3.0, exposes the row-level size/vertical sync button, and keeps its mobile viewport setup.
- Remaining: Mini updates/reloads【酒館桌寵】inside real SillyTavern for the runtime smoke.

## 2026-08-14 23:45

- Objective: Redesign the letter page from Mini's clean mobile diary reference and give the conversation-extra board a coordinated, cute-but-muted visual system.
- Design system: Used a flat, personal reading flow with high-contrast text, no external assets, deterministic accents, visible focus, and mobile touch targets.
- RED/GREEN: The panel test first failed for missing month/date rail, letter sheet, board count, post number, and color-tone structure; the focused suite passed after implementation.
- Implementation: Letters now group records by month and place each date beside its paper. Stories now use numbered cards rotating through pink, lavender, mint, and mist-blue accents while keeping generated content, copy, delete, and TXT behavior unchanged.
- Verification: 10 files / 44 tests passed; production build passed. Real Chrome at 1100×850 showed 680px/720px reading columns with no horizontal overflow. At 390×844 both pages stayed inside a 374px panel with 8px safe margins, 390px document width, and 48px minimum buttons. The v0.3.1 package reproduced twice at SHA-256 `e1c6a804df98e6ed1d043067595d92ebb7fecff3af3d182a6c3304ec3cce4df3`.
- Next: Package, commit/push, publish v0.3.1, and verify the public manifest and ZIP.

## 2026-08-15 01:03

- Publication: pushed commit `d0e0f2e`, created release `v0.3.1`, and published `resident-loader-v0.3.1.zip`.
- CI: GitHub Actions run `31816357745` completed install, 10 files / 44 tests, build, committed-dist drift check, and package successfully.
- Public proof: manifest reports【酒館桌寵】v0.3.1; public dist contains the date rail, letter sheet, numbered four-tone board, and mobile CSS. The 59,435-byte release ZIP matches local SHA-256 `e1c6a804df98e6ed1d043067595d92ebb7fecff3af3d182a6c3304ec3cce4df3`.
- Workshop handoff: public workshop now points its offline fallback to v0.3.1 and passed Pages/browser verification.
- Remaining: Mini updates the installed extension and performs the real SillyTavern smoke.

## 2026-09-24 01:34（霽野 5.1 修理班，接 CODE_REVIEW_5.1_260924 工單）

- 範圍：只修審查報告 P0-1、P0-2、P2-13 三案；P1 與其餘 P2 看到不碰；pack schema 不動。每案一顆 commit。
- P0-1（`40d268d`）：profile 模式改走 `getContext().ConnectionManagerRequestService.sendRequest()`（1.18.0 `st-context.js:292`／`scripts/extensions/shared.js:419-487`），不再拼 `/profile-genstream` 指令字串；設定檔清單以 `getSupportedProfiles()`（`shared.js:525`）為準。舊路徑在 globalThis 找 `triggerSlash` 永遠撲空（TavernHelper 只掛 `globalThis.TavernHelper` 一個物件），8/15 出貨至今 profile 模式沒人用得到；就算接通，prompt 裡一個 `|` 就讓 SlashCommandParser 拋錯、換行變字面 `\n`。新測 12 條：五個樣本（`|` 狀態欄／多段換行＋tab／含 `"` 的對話／`{{macro}}` 字面／結尾反斜線＋Windows 路徑）逐字元原樣進 messages；無服務、API 失敗、空回應三條錯誤路徑；清單來源三條。current 模式與 `findApi` 不動（P1-3／P1-4 範圍）。
- P0-2（`496afd0`＋工坊 `3b7465e`）：`repository.putPack` 同 id 內容不同丟 `PackConflictError`（同一筆 readwrite 交易先 get 再決定，錯誤帶兩包的 displayName／creator）、內容相同視為重新匯入、`overwrite: true` 才直接蓋；`app.importPack` 接到衝突用 confirm（建構子可注入）問一次才覆蓋，取消就保留舊包並在狀態列講明。工坊 `createPackId` 改產 `<creatorSlug>.<packSlug>`（作者空白退回純名稱；守酒館端 64 字元、作者段最多 24）。新測 loader 6 條（含兩條真的走 `<input type=file>` change 的整段）＋工坊 5 條。
- P2-13（本 commit）：`scripts/package.mjs` 打包清單加 `LICENSE`（AGPL-3.0 §4）；版本 0.3.1→0.3.2（`manifest.json` 手改，`package.json`／`package-lock.json` 用 `npm version` 同步；README 沒有版本字串）。`npm run package` 兩次同雜湊 `f81d43c9058bf87eea2aad5ebd6a298b00f8cf2176b7ed6ae92d06567683bad1`（72,908 bytes）；用 Expand-Archive 解開實看：五檔 `LICENSE`／`README.md`／`dist/index.js`／`dist/style.css`／`manifest.json`，解出的 LICENSE SHA-256 `0d96a4ff68ad6d4b6f1f30f713b18d5184912ba8dd389f86aa7710db079abcb0` 與 repo 相同，zip 內 manifest 報 0.3.2。
- 驗證：`npm test` 12 檔 62 測綠（原 44＋新 18）、`npm run build` 過、每顆 commit 的 dist 都同步重建。Mini 本機酒館 `st_status` 回 1.18.0，與對照源碼同版。
- 沒做、要 Mini 在場：真酒館燒一次 profile 模式生成（用她的 API 額度）；建 GitHub Release v0.3.2 掛新 ZIP，然後 tavern-pet-workshop 的離線下載連結（`index.html:286`、README）從 v0.3.1 改 v0.3.2——現在公開的 v0.3.1 ZIP 裡沒有 LICENSE。
