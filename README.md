# ✿ 心靈療癒室 — The Gentle Room

> **給心一個休息的地方。**

這是一個使用原生 HTML / CSS / JavaScript 製作的繁體中文靜態網站，採用**粉彩手繪插畫、兔兔與小熊、花草、月亮與可愛手帳卡片**，提供療癒文章、心情選擇、鼓勵語錄、5-4-3-2-1 感官練習，以及只存在本機瀏覽器的心情日記。

## 這份作業想證明什麼？

這次作業的核心是 **AGENTS.md**：讓 AI 開發助手讀完規則後，不需要每次重寫網站，就能依照統一的資料格式、安全語氣、設計色彩與驗證流程持續增加文章。

### 網站功能

- **首頁 `index.html`**：兔兔與小熊插畫主視覺、當下心情選擇、可切換鼓勵語錄、插畫文章卡片搜尋與分類。
- **文章頁 `article.html`**：共用版型，從 JSON 依 slug 讀取文章。
- **放鬆練習 `practice.html`**：5-4-3-2-1 感官覺察互動，隨時可停止。
- **心情日記 `journal.html`**：瀏覽器 localStorage 儲存、查看、刪除，最多保留 50 篇。
- **擴充指南 `guide.html`**：介紹 AI 如何透過 AGENTS.md 新增文章。

- **插畫 `assets/illustrations/`**：14 張本機 SVG，包含主視覺、文章封面與各頁貼紙，可直接修改。

## 1. 本機執行

先在電腦安裝 Python 3，進入專案資料夾後輸入：

```bash
python scripts/validate_articles.py
python -m http.server 8000
```

在瀏覽器輸入：<http://localhost:8000>

> **請不要直接雙擊 `index.html`。** 網站以 `fetch()` 讀取本機 JSON，直接使用 `file://` 可能被瀏覽器阻擋。

## 2. GitHub 上傳與 Pages 公開

1. 登入 GitHub，按 **New repository**，建議命名 `heart-sanctuary`，選 **Public**。
2. 使用 **Add file → Upload files**，將 **解壓縮後 `heart-sanctuary` 資料夾內所有檔案與子資料夾** 上傳。不要只上傳 `.zip`；確認 `index.html` 位於 Repository 根目錄。
3. 進入 Repository **Settings → Pages**，將 Source 設為 **Deploy from a branch**、Branch 選 `main`、Folder 選 `/(root)`，按 **Save**。
4. 部署完成後按 **Visit site** 確認網站能載入文章。
5. 若使用者名稱為 `YOURNAME`、Repository 為 `heart-sanctuary`，網址通常為：
   - Repository：`https://github.com/YOURNAME/heart-sanctuary`
   - 網站：`https://YOURNAME.github.io/heart-sanctuary/`

## 3. 新增一篇文章（作業重點）

請 AI 先讀 `AGENTS.md`，再讀一篇 `data/articles.json` 範例，最後新增同格式 JSON 物件。

**示範提示詞：**

> 請先閱讀 AGENTS.md，並依照現有規則新增一篇「放下比較心」的療癒文章。只修改 data/articles.json，並從 assets/illustrations/ 選擇適合的 illustration 插畫路徑，不要重新設計 HTML。完成後執行 python scripts/validate_articles.py，確認首頁搜尋與分類可以找到新文章。

新增後不用另建 HTML：首頁卡片和文章頁都由 `assets/js/app.js` 自動產生，插畫依每篇文章的 `illustration` 欄位套用。

**圖像規則：** 新增文章必填 `illustration`，例如 `"illustration": "assets/illustrations/article-flower.svg"`。請確保檔案存在，並執行驗證程式。

## 4. 隱私與注意事項

- 日記與目前選擇的心情保存在使用者當下瀏覽器 **localStorage**，沒有遠端伺服器或追蹤程式；不要在共用電腦記錄敏感文字。
- localStorage **不是加密保管箱或雲端備份**。清除瀏覽器網站資料、換裝置或使用某些無痕模式時可能遺失。
- 本站不提供醫療診斷或心理治療，也不適合作為緊急求助管道。有立即危險時，應直接尋求當地緊急服務及可信任的人員協助。

## 5. 繳交作業的範例文字

**主題：心靈療癒室 — 給心一個休息的地方**

**專案簡介：** 本網站以奶油白、粉彩與可愛手繪插畫風格提供療癒文章、心情紀錄與感官覺察練習，協助使用者以自己的步調進行情緒整理。

**GitHub Repository：** （上傳後填入真實連結）

**公開網站連結：** （GitHub Pages 啟用後填入真實連結）

**AGENTS.md：** （填入 Repository 中的 `AGENTS.md` 檔案網址）

**擴充說明：** 我在 `AGENTS.md` 規範粉彩設計系統、SVG 插畫命名與使用方式、頁面結構、文章欄位、語氣、隱私原則與驗證步驟。日後需要新增療癒文章時，AI 只要按照規則更新 `data/articles.json`，首頁搜尋與分類以及共用文章頁便能自動展示新內容，無須重新製作網頁，也能維持設計一致性。

---

Made for a classroom project. 本專案提供一般自我照顧資訊，不取代專業服務。
