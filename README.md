# Resident Loader

SillyTavern 共用動畫桌寵載入器。安裝一次後，可以匯入[酒館桌寵工坊](https://minijinai75.github.io/tavern-pet-workshop/)產生的 `.jrpack.zip`，再把不同桌寵綁定到角色。

## 用 repo 網址安裝（推薦）

1. 開啟 SillyTavern 的「擴充功能」。
2. 選擇「安裝擴充／Install Extension」。
3. 貼上：

   ```text
   https://github.com/Minijinai75/resident-loader
   ```

4. 完成安裝後重新整理 SillyTavern。
5. 點左下角「桌寵」，匯入 `.jrpack.zip`，再按「綁定目前角色」。

酒館會直接下載這個 repo；根目錄已包含 `manifest.json` 和預先建置的 `dist/`，使用者不需要安裝 Node.js 或自行編譯。

## 已包含

- 安全 data-only 角色包匯入；拒絕 JS、HTML、SVG、假 PNG、危險 ZIP 路徑。
- 每個角色獨立綁定角色包、日常／書信／番外 Prompt、API Profile、最近對話樓數與速度設定。
- 沿用目前酒館 API，或選擇酒館已存在的 Connection Profile；Loader 不保存 API Key。
- 桌機／手機大小、透明度、拖曳位置、動畫速度與移動速度。
- 書信與番外結果保存在同一個 Loader 面板；依角色＋聊天＋功能隔離，重開仍在。

角色包、圖片、Prompt 覆寫與歷史紀錄都保存在瀏覽器本機 IndexedDB。

## 開發

```text
npm ci
npm test
npm run build
npm run package
```

`dist/` 必須隨版本提交，因為 SillyTavern 的 repo 安裝流程不會在使用者端執行建置。
