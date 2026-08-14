# 酒館桌寵

SillyTavern 共用動畫桌寵載入器。安裝一次後，可以匯入[酒館桌寵工坊](https://minijinai75.github.io/tavern-pet-workshop/)產生的 `.jrpack.zip`，再把不同桌寵綁定到角色。

## 用 repo 網址安裝（推薦）

1. 開啟 SillyTavern 的「擴充功能」。
2. 選擇「安裝擴充／Install Extension」。
3. 貼上：

   ```text
   https://github.com/Minijinai75/resident-loader
   ```

4. 完成安裝後重新整理 SillyTavern。
5. 在「擴充功能」欄找到【酒館桌寵】，按「開啟設定」。
6. 用醒目的匯入按鈕選擇 `.jrpack.zip`，再按「綁定目前角色」。

酒館會直接下載這個 repo；根目錄已包含 `manifest.json` 和預先建置的 `dist/`，使用者不需要安裝 Node.js 或自行編譯。

## 已包含

- 安全 data-only 角色包匯入；拒絕 JS、HTML、SVG、假 PNG、危險 ZIP 路徑。
- 每個角色獨立綁定或解除綁定角色包；解除綁定不會刪除角色包與歷史。
- 【酒館桌寵】擴充項目提供設定與桌寵開／關，不另外放浮動畫面入口。
- 沿用目前酒館 API，或選擇酒館已存在的 Connection Profile；Loader 不保存 API Key。
- 桌機／手機大小、透明度、拖曳位置、動畫速度與移動速度。
- 點桌寵可分別開啟「來信紀錄」與「對話番外紀錄」；只有明示按生成才呼叫模型。
- 書信與番外結果保存在各自的 HTML 閱讀頁；依角色＋聊天＋功能隔離，重開仍在。

角色包、圖片、Prompt 覆寫與歷史紀錄都保存在瀏覽器本機 IndexedDB。

## 開發

```text
npm ci
npm test
npm run build
npm run package
```

`dist/` 必須隨版本提交，因為 SillyTavern 的 repo 安裝流程不會在使用者端執行建置。
