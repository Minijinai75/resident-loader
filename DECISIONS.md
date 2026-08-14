# Decisions

- 2026-08-14: 擴充頁入口採 SillyTavern 原生 `inline-drawer` 結構；展開即自動載入設定，不再保留多餘的設定按鈕。設定面板提供載入／失敗回饋，來信與番外仍由桌寵快捷選單開啟獨立閱讀層。

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
