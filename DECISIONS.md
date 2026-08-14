# Decisions

- 2026-08-14 22:35（取代 22:08 的展開即載入決定）：擴充頁仍採 SillyTavern 原生 `inline-drawer` 外觀，但內容只放精簡快捷入口，絕不再把完整設定嵌入擴充欄。設定、角色來信日記、對話番外留言板分別以獨立 HTML 層開啟。
- 2026-08-14 22:34：來信閱讀頁採私人日記樣式；番外閱讀頁採留言板樣式。兩頁只呈現累積日期與生成正文，不放 Prompt／Context／連線等設定；各自提供純文字 TXT 下載。
- 2026-08-14 22:35：綁定以 `characterKey` 為角色卡範圍；切換角色／聊天事件會卸載舊桌寵並載入新角色綁定。未綁定角色不沿用上一位桌寵；設定跟角色，歷史再按聊天與功能隔離。

## 2026-08-14 - Dedicated extension repository

- Status: confirmed by Mini
- Decision: Resident Loader lives in `Minijinai75/resident-loader`, separate from `tavern-pet-workshop`.
- Why: SillyTavern can install and update a third-party extension directly from a Git repository URL only when the repository itself is the extension root.
- Packaging: root `manifest.json`; prebuilt `dist/index.js` and `dist/style.css` are committed; source and tests remain in the same repository.
- Website role: Tavern Pet Workshop creates data-only packs and exposes the Loader repository URL plus an offline release fallback.

## Preserved exception - no license selected

- The public repository has no license until Mini explicitly chooses one.

## 2026-08-14 - 【酒館桌寵】v0.2 interaction boundary

- Status: confirmed by Mini at 20:55 Asia/Taipei.
- User-facing name: the manifest, extension drawer entry, and settings title use「酒館桌寵」.
- Entry: no floating Launcher; the SillyTavern extensions drawer exposes settings plus explicit pet on/off actions.
- Pet click: opens a two-button DOM-only menu for letter records and conversation-extra records.
- Generation: browsing never calls a model; only the explicit create button generates, and results never become chat floors.
- Daily companion: manual only in v0.2.1. It includes visible character-card description/personality/scenario plus the configured recent floors, then renders a temporary pet bubble. Automatic calls remain off.
- Binding: unbinding removes only the character-to-pack relation and preserves packs, settings, and generated history.
