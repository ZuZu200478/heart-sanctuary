# AGENTS.md — 心靈療癒室開發規範

> **給 AI 程式開發助手的指令**。新增功能或文章前，請完整閱讀本文件。這個網站的目的是建立可長期維護、持續擴充的**可愛手繪插畫風療癒空間**，而不只是完成一次性的網頁。

## 1. 專案目的與讀者

- 網站名稱：**心靈療癒室**（The Gentle Room）。
- 主標語：**給心一個休息的地方**。
- 主要讀者：希望閱讀溫暖文章、記錄日常感受、嘗試簡單放鬆練習的一般使用者。
- 內容定位：一般情緒素養、自我照顧與日常陪伴。**不是心理治療、醫療診斷、危機服務，也不宣稱可以治癒疾病。**
- 技術目標：採用 **原生 HTML、CSS、JavaScript + JSON**，可直接部署於 GitHub Pages，無後端、無付費 API、無額外建置程序。
- 可擴充設計：新增文章只要修改 `data/articles.json`，共用首頁卡片、搜尋、分類及文章模板會自動載入。避免每篇都重寫 HTML。

## 2. 專案檔案結構（不要隨意變更）

```text
heart-sanctuary/
├── AGENTS.md                 # AI 必須遵守的開發規則
├── README.md                 # 人類讀者的執行、部署與作業說明
├── index.html                # 首頁：主視覺、心情選擇、語錄、文章清單
├── article.html              # 共用文章頁：?slug=<文章代碼>
├── practice.html             # 5-4-3-2-1 感官覺察互動頁
├── journal.html              # 心情日記（只存瀏覽器 localStorage）
├── guide.html                # 告訴訪客如何用 AGENTS.md 擴充內容
├── data/
│   └── articles.json         # 唯一的文章資料來源
├── assets/
│   ├── css/style.css         # 全站共用樣式與粉彩設計變數
│   ├── js/app.js             # 所有頁面的共用原生 JavaScript
│   └── illustrations/        # 可編輯本機 SVG 插畫（兔兔、小熊、花草、月亮等）
├── scripts/
│   └── validate_articles.py  # 文章資料格式檢查（Python 標準函式庫）
└── .nojekyll                 # GitHub Pages 靜態檔案標記
```

- 相對路徑一律從 GitHub Pages 專案子路徑可以運作為準，例如 `assets/css/style.css`。不可硬編碼 GitHub 使用者名稱或網域。
- 文章不建立個別 HTML 檔：`article.html?slug=...` 是唯一的文章呈現方式。
- 如需調整目錄，必須同步更新所有 HTML 引用、JavaScript、README、驗證器與本文件。

## 3. 可愛插畫風視覺設計規則（Design System）

1. **風格定位**：可愛、溫柔、親切的「插畫手帳／童話故事書」美感。使用軟邊陰影、圓潤卡片、植物花朵、雲朵、星星、兔子、小熊與茶杯等元素；保留足夠留白，避免太擁擠。
2. **色彩代碼**：全站顏色應優先使用 `assets/css/style.css` 的 `:root` CSS 變數。主色為奶油白 `#fff9f1`、粉紅 `#ffced1`、草綠 `#86a87b`、杏黃 `#ffe6be`、天空藍 `#e2f2f9`；文字使用深奶茶棕 `#71564c` 以確保對比。不可突然改成黑色科技風、螢光色或高飽和漸層。
3. **插畫規範**：插畫均放在 `assets/illustrations/`，使用 SVG 格式並以英文小寫與連字號命名，如 `article-flower.svg`。插畫應以手繪線條、柔和色塊、可愛但不幼稚的形象為主；不得在 SVG 內放外部追蹤、遠端腳本、外部圖片依賴。不得直接將別人的插畫當作自己的作品。
4. **首頁與各頁版型**：首頁有大型窗邊兔兔插畫 `hero-bunny.svg`、心情選擇、茶杯語錄、6 篇示範文章卡片和三大功能入口；內頁保留相同 Header、Footer 與插畫語彙。
5. **文章卡片規範**：每篇文章都要有插畫欄位 `illustration`，僅使用已存在、路徑合法的 `assets/illustrations/*.svg`。新增文章可重複使用現有插畫，但應優先選擇與主題相符者。卡片保持 `.article-card` 結構、粉彩插畫區與一致的摘要及分類樣式。
6. **可擴充原則**：只新增文章時，**不修改網頁版型和 JavaScript**，只在 JSON 新增一個物件並指定插畫路徑。若需要新插畫，先建立 SVG 資產，再在 JSON 引用它，必要時才改 CSS。
7. **響應式**：手機寬度至少 375px 起、平板、桌面均能瀏覽；不得出現橫向捲動或插畫擋住按鈕。圖片加 `alt`、固定 intrinsic dimensions（`width`/`height`）且可自適應。
8. **無障礙與互動**：語意標籤、明確 label、鍵盤可操作按鈕、可見焦點、裝飾性圖片用空 `alt`，尊重 `prefers-reduced-motion`；心情、搜尋、篩選、日記與練習功能必須真的可操作。
9. **文字**：繁體中文（台灣用語），以清晰黑體為主，親切但不使用虛假醫療保證或強迫正向措辭。

## 4. 文章資料契約：`data/articles.json`

這份檔案是 **JSON 陣列**。每篇文章是一個物件，必須包含以下欄位：

| 欄位 | 格式與限制 |
| --- | --- |
| `slug` | 唯一的小寫英數 + `-`，如 `care-for-yourself`；上線後不要隨意修改 |
| `title` | 不可空白的繁體中文標題 |
| `category` | **只能是** `情緒照顧`、`自我接納`、`生活練習` |
| `summary` | 1～2 句溫暖但具體的文章摘要 |
| `tags` | 至少 1 個、不可重複的非空字串陣列 |
| `readMinutes` | 1～30 的整數 |
| `updated` | 實際日期，格式 `YYYY-MM-DD` |
| `illustration` | 本機現有 SVG 路徑，例如 `assets/illustrations/article-flower.svg`；必填 |
| `sections` | 至少 2 個章節，每章有 `heading`，且要有非空 `paragraphs` 或 `bullets` |

`sections` 的章節欄位：
- `heading`：必要的章節名稱。
- `paragraphs`：選填的非空段落陣列。
- `bullets`：選填的非空條列陣列。
- `tip`：選填的提示語。不得包含高風險的個人醫療建議。

範例：

```json
{
  "slug": "a-kind-morning",
  "title": "從溫柔的早晨開始",
  "category": "生活練習",
  "summary": "試著用一個不勉強自己的小儀式開始新的一天。",
  "tags": ["早晨", "照顧自己"],
  "readMinutes": 3,
  "updated": "2026-11-09",
  "illustration": "assets/illustrations/article-garden.svg",
  "sections": [
    {
      "heading": "先給自己一點時間",
      "paragraphs": ["醒來後不用立刻整理完所有待辦事項。"]
    },
    {
      "heading": "試試一個小動作",
      "bullets": ["喝一口水。", "看看窗外的光。"],
      "tip": "選擇讓你舒服的做法就好。"
    }
  ]
}
```

## 5. 文字內容與安全邊界

- 用繁體中文撰寫，語氣溫柔、尊重、具體；**不責備、不強迫正向、不保證「一定會好」**。
- 文章可提供常見的低風險日常活動，如寫日記、休息、觀察周遭環境、與信任的人談談。
- 避免醫療診斷、藥物建議、治療保證、沒有來源的研究數字與心理學結論。
- 涉及持續或嚴重困擾時，提醒可尋求專業協助；若有立即危險，提醒聯絡當地緊急服務。不要將網站描述成緊急危機介入工具。
- 放鬆練習應可跳過、停止，不規定一定要閉眼或深呼吸。
- 新增文章前確認不會留下個人案例、姓名、電話、私人健康紀錄。

## 6. AI 新增文章的**標準操作流程**

1. **讀取規則**：先讀完 `AGENTS.md`、`data/articles.json` 的至少一篇同類文章，再開始修改。
2. **選好類別**：只使用現有三種 `category`；若使用者真的要求新增類別，必須同步更新 `index.html` 篩選按鈕、`app.js` 類別樣式、驗證器和本文件。
3. **準備內容**：標題、摘要、標籤、至少 2 章，避免空泛口號；優先寫出能讓讀者理解與嘗試的小建議。
4. **唯一代碼**：使用語意清楚的 slug，確認不與既有資料重複；不得更動原有 slug。
5. **選擇插畫**：新增的文章一定包含 `illustration`，優先重用現有 `assets/illustrations/` 的 SVG，選一張符合文章主題的；如果需要新插畫，用同一配色與手繪線條規則建立 SVG。
6. **只新增 JSON**：在 `data/articles.json` 陣列增加一筆；除非新插畫或功能需求有變，**不要動 `index.html` / `article.html` / CSS / JS**。
7. **靜態驗證**：執行 `python scripts/validate_articles.py`，若有錯誤先修正。
8. **瀏覽器驗證**：執行 `python -m http.server 8000`，前往 `http://localhost:8000`；確認首頁出現新卡片、關鍵字能找到、分類正確、`article.html?slug=新增代碼` 能打開。
9. **驗收回報**：列出修改檔案、新 slug、測試結果和限制。不要聲稱沒有執行過的測試已通過。

範例指令：

> 請先閱讀 AGENTS.md，新增一篇「如何練習設立界線」的文章。保留現有版型，只更新 data/articles.json，驗證資料格式與文章連結。

## 7. AI 修改功能的規則

- 使用原生 JS 與 HTML，不額外引入框架、套件、CDN 或付費服務。
- 新增 DOM 文字時，使用 `textContent` / `createTextNode`；不得把 JSON 內容直接拼進 `innerHTML`，避免注入攻擊。
- 心情、日記等個人文字只能在使用者自己的瀏覽器 `localStorage` 儲存；**不得提交至 GitHub、送至遠端 API 或寫入網站公開 JSON**。
- 若需要新增需要帳號、跨裝置同步、雲端保存的功能，必須先說明會改變隱私與部署架構，再取得使用者明確同意。
- localStorage 可能被清除或在無痕模式下不可用，介面必須清楚提示，不得宣稱能永久保存或完全保密。
- 既有 URL 必須維持有效；所有頁面共用導覽與頁尾。
- 改動前後檢查頁面互動、手機版與鍵盤操作；不能破壞其他頁面。

## 8. 完成條件（Definition of Done）

- [ ] 所有新文章符合 JSON schema、插畫檔案存在且 slug 唯一。
- [ ] SVG 插畫維持同一色系、檔名與目錄規則，不引用外部資產。
- [ ] `python scripts/validate_articles.py` 通過。
- [ ] 首頁可顯示文章、搜尋、分類、無結果提示。
- [ ] 共用文章頁可讀取正確 slug，錯誤 slug 有友善提示。
- [ ] `practice.html` 的五個步驟可以前後切換。
- [ ] `journal.html` 可在目前瀏覽器儲存與刪除文字，並清楚告知隱私限制。
- [ ] 實際發布到 GitHub Pages 並測試公開網址（未發布時不得聲稱已完成）。
- [ ] 手機版有正常的導覽、沒有橫向溢出。

## 9. 常用指令

```bash
python scripts/validate_articles.py
python -m http.server 8000
# 用瀏覽器開啟 http://localhost:8000
```

**核心原則：規則可重複、內容可延伸、體驗有一致性、隱私與安全優先。**
