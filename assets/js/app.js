"use strict";

// New articles live in one place: data/articles.json.
// Render user-supplied data with textContent only, never unsanitized innerHTML.
const ARTICLES_URL = "data/articles.json";
const CATEGORY_STYLE = {
  "情緒照顧": { emoji: "☁️", style: "emotion" },
  "自我接納": { emoji: "🌷", style: "self" },
  "生活練習": { emoji: "🌿", style: "life" }
};

function node(tag, className, text) {
  const result = document.createElement(tag);
  if (className) result.className = className;
  if (text !== undefined) result.textContent = text;
  return result;
}

async function fetchArticles() {
  const response = await fetch(ARTICLES_URL, { cache: "no-cache" });
  if (!response.ok) throw new Error(`無法取得文章：HTTP ${response.status}`);
  const articles = await response.json();
  if (!Array.isArray(articles)) throw new Error("文章資料必須是陣列");
  return articles;
}

function createArticleCard(article) {
  const design = CATEGORY_STYLE[article.category] || { emoji: "♡", style: "emotion" };
  const link = node("a", "article-card");
  link.href = `article.html?slug=${encodeURIComponent(article.slug)}`;
  link.setAttribute("aria-label", `閱讀文章：${article.title}`);
  const artwork = node("div", `article-art article-art-${design.style}`);
  const picture = node("img", "article-artwork");
  picture.src = article.illustration;
  picture.alt = `${article.category}主題手繪插畫`;
  picture.loading = "eager";
  picture.width = 340;
  picture.height = 252;
  artwork.append(picture, node("span", "article-art-sparkle", "✧"));
  const top = node("div", "card-top");
  top.append(node("span", "card-category", article.category), node("span", "card-tiny-heart", "♡"));
  const bottom = node("div", "card-bottom");
  bottom.append(node("span", "", `${article.readMinutes} 分鐘閱讀 · ${article.updated}`), node("span", "card-arrow", "↗"));
  link.append(artwork, top, node("h3", "", article.title), node("p", "", article.summary), bottom);
  return link;
}

const quotes = [
  "你的步伐不需要和任何人一樣。",
  "今天的你，不需要證明什麼也值得被愛。",
  "可以慢一點，人生不只一種速度。",
  "有些日子只要好好度過，就已經足夠。",
  "不是每個問題，都需要今天找到答案。",
  "把留給別人的溫柔，也留一點給自己。"
];
const moodReplies = {
  "開心": "今天有一點亮光呢。願這份開心可以陪你久一點。",
  "平靜": "享受這一刻的安穩，不需要做得更多。",
  "疲憊": "覺得累的時候，休息也算是一件重要的事。",
  "難過": "難過也有它的位置，今天先不急著把它趕走。",
  "焦慮": "心裡有些吵雜也沒關係，可以先看看腳下的地面。"
};

function renderHome() {
  const grid = document.querySelector("#article-grid");
  const resultLabel = document.querySelector("#results-label");
  const searchInput = document.querySelector("#search-input");
  const filterButtons = [...document.querySelectorAll(".filter")];
  const empty = document.querySelector("#empty-state");
  let category = "全部";
  let articles = [];

  function draw() {
    const query = searchInput.value.trim().toLocaleLowerCase("zh-TW");
    const visible = articles.filter(item => {
      const categoryMatches = category === "全部" || item.category === category;
      const haystack = [item.title, item.summary, item.category, ...(item.tags || [])].join(" ").toLocaleLowerCase("zh-TW");
      return categoryMatches && haystack.includes(query);
    });
    grid.replaceChildren(...visible.map(createArticleCard));
    empty.classList.toggle("hidden", visible.length !== 0);
    resultLabel.textContent = `找到 ${visible.length} 篇文章`;
  }
  fetchArticles().then(data => {
    articles = data;
    draw();
  }).catch(error => {
    grid.replaceChildren(node("p", "loading", "文章載入失敗。請以本機網頁伺服器開啟，或確認 data/articles.json 存在。"));
    resultLabel.textContent = "暫時無法讀取文章";
    console.error(error);
  });
  searchInput.addEventListener("input", draw);
  filterButtons.forEach(button => button.addEventListener("click", () => {
    category = button.dataset.category;
    filterButtons.forEach(filter => {
      const isActive = filter === button;
      filter.classList.toggle("active", isActive);
      filter.setAttribute("aria-pressed", String(isActive));
    });
    draw();
  }));
  document.querySelector("#reset-filter").addEventListener("click", () => {
    searchInput.value = "";
    filterButtons[0].click();
    searchInput.focus();
  });

  const feedback = document.querySelector("#mood-feedback");
  const moodButtons = [...document.querySelectorAll(".mood-button")];
  moodButtons.forEach(button => button.addEventListener("click", () => {
    moodButtons.forEach(other => other.setAttribute("aria-pressed", String(other === button)));
    feedback.textContent = moodReplies[button.dataset.mood];
    // Store only in the current browser. No analytics or server requests.
    try { localStorage.setItem("gentle-room-mood", button.dataset.mood); } catch (_) { /* storage optional */ }
  }));
  try {
    const previousMood = localStorage.getItem("gentle-room-mood");
    const found = moodButtons.find(button => button.dataset.mood === previousMood);
    if (found) { found.setAttribute("aria-pressed", "true"); feedback.textContent = moodReplies[previousMood]; }
  } catch (_) { /* storage optional */ }

  let currentQuote = 0;
  document.querySelector("#new-quote").addEventListener("click", () => {
    currentQuote = (currentQuote + 1) % quotes.length;
    document.querySelector("#daily-quote").textContent = quotes[currentQuote];
  });
}

function createSection(section) {
  const wrapper = node("section");
  wrapper.append(node("h2", "", section.heading));
  (section.paragraphs || []).forEach(paragraph => wrapper.append(node("p", "", paragraph)));
  if (section.bullets?.length) {
    const list = node("ul");
    section.bullets.forEach(bullet => list.append(node("li", "", bullet)));
    wrapper.append(list);
  }
  if (section.tip) wrapper.append(node("aside", "article-note", section.tip));
  return wrapper;
}

async function renderArticle() {
  const root = document.querySelector("#article-root");
  const slug = new URLSearchParams(window.location.search).get("slug");
  try {
    const articles = await fetchArticles();
    const article = articles.find(item => item.slug === slug);
    if (!article) throw new Error(`找不到文章 ${slug || "(未提供)"}`);
    document.title = `${article.title}｜心靈療癒室`;
    document.querySelector("#breadcrumb-current").textContent = article.title;
    const content = node("article", "article-shell");
    const meta = node("div", "article-meta");
    meta.append(node("span", "", `${article.readMinutes} 分鐘閱讀`), node("span", "", `更新日期 ${article.updated}`));
    (article.tags || []).forEach(tag => meta.append(node("span", "tag-pill", `#${tag}`)));
    const body = node("div", "article-body");
    article.sections.forEach(section => body.append(createSection(section)));
    const illustration = node("div", "article-heading-art");
    const picture = node("img", "article-heading-picture");
    picture.src = article.illustration;
    picture.alt = `${article.category}主題插畫`;
    picture.width = 340;
    picture.height = 252;
    illustration.append(picture);
    content.append(illustration, node("span", "article-category", article.category), node("h1", "article-title", article.title), node("p", "article-lead", article.summary), meta, body);
    root.replaceChildren(content);
  } catch (error) {
    const panel = node("div", "error-panel");
    panel.append(node("h2", "", "這篇文章暫時無法顯示"), node("p", "", "連結可能不存在，或文章資料載入失敗。請返回文章列表。"));
    const link = node("a", "btn btn-outline", "返回文章列表");
    link.href = "index.html#library";
    panel.append(link);
    root.replaceChildren(panel);
    console.error(error);
  }
}

const steps = [
  { emoji: "👀", label: "LOOK AROUND", title: "找到 5 樣你看得見的東西", text: "慢慢看看身邊，不需要特別的物品，窗框、桌面或一個顏色都可以。" },
  { emoji: "🤲", label: "NOTICE TOUCH", title: "留意 4 種可以感受到的觸感", text: "例如衣服碰到肩膀、腳踩著地板、椅子接住身體，或手中的物品。" },
  { emoji: "🎶", label: "LISTEN GENTLY", title: "聽聽 3 種周圍的聲音", text: "也許是風聲、遠處的車聲、空調，或者很輕的背景聲響。" },
  { emoji: "🌸", label: "SENSE THE AIR", title: "留意 2 種氣味", text: "不需要刻意深呼吸。如果聞不出來，想像兩種你喜歡的氣味也可以。" },
  { emoji: "🍵", label: "COME BACK", title: "留意 1 種味道或口中的感覺", text: "可以想想剛剛喝過的水、嘴裡的感覺，或只是輕輕感受現在。" }
];
function renderPractice() {
  let currentStep = 0;
  const display = document.querySelector("#practice-display");
  const prev = document.querySelector("#practice-prev");
  const next = document.querySelector("#practice-next");
  function draw() {
    const step = steps[currentStep];
    display.replaceChildren(node("span", "practice-icon", step.emoji), node("span", "mini-label", step.label), node("h2", "", step.title), node("p", "", step.text));
    document.querySelector("#practice-step-label").textContent = `第 ${currentStep + 1} 步，共 ${steps.length} 步`;
    const percentage = Math.round(((currentStep + 1) / steps.length) * 100);
    document.querySelector("#practice-progress-label").textContent = `${percentage}%`;
    document.querySelector("#practice-progress-bar").style.width = `${percentage}%`;
    prev.disabled = currentStep === 0;
    next.textContent = currentStep === steps.length - 1 ? "重新開始 ↺" : "下一步 →";
  }
  prev.addEventListener("click", () => { if (currentStep > 0) currentStep -= 1; draw(); });
  next.addEventListener("click", () => { currentStep = (currentStep + 1) % steps.length; draw(); });
  draw();
}

const JOURNAL_KEY = "gentle-room-journal-v1";
function getEntries() {
  try {
    const value = JSON.parse(localStorage.getItem(JOURNAL_KEY) || "[]");
    return Array.isArray(value) ? value : [];
  } catch (_) { return []; }
}
function saveEntries(entries) {
  try { localStorage.setItem(JOURNAL_KEY, JSON.stringify(entries)); return true; }
  catch (_) { return false; }
}
function renderJournal() {
  const form = document.querySelector("#journal-form");
  const list = document.querySelector("#journal-list");
  const status = document.querySelector("#journal-status");
  document.querySelector("#journal-today").textContent = new Intl.DateTimeFormat("zh-TW", { year: "numeric", month: "long", day: "numeric" }).format(new Date());
  function draw() {
    list.replaceChildren();
    const entries = getEntries();
    if (!entries.length) { list.append(node("p", "muted", "還沒有留下日記，從今天開始也很好。")); return; }
    entries.forEach(entry => {
      const card = node("article", "journal-entry");
      const top = node("div", "entry-top");
      const date = new Date(entry.timestamp);
      const prettyDate = Number.isNaN(date.getTime()) ? "過去的日記" : date.toLocaleString("zh-TW", { dateStyle: "medium", timeStyle: "short" });
      top.append(node("span", "", `${entry.mood || "未選心情"} · ${prettyDate}`));
      const del = node("button", "", "刪除");
      del.type = "button";
      del.setAttribute("aria-label", `刪除 ${prettyDate} 的日記`);
      del.addEventListener("click", () => {
        if (!window.confirm("要刪除這篇日記嗎？刪除後無法復原。")) return;
        if (saveEntries(getEntries().filter(item => item.id !== entry.id))) { status.textContent = "已刪除這篇日記。"; draw(); }
        else status.textContent = "刪除失敗：瀏覽器可能禁止儲存。";
      });
      top.append(del);
      card.append(top, node("p", "entry-content", entry.text));
      list.append(card);
    });
  }
  form.addEventListener("submit", event => {
    event.preventDefault();
    const content = document.querySelector("#journal-text").value.trim();
    if (!content) { status.textContent = "可以先寫一句話，再按儲存。"; return; }
    const mood = form.querySelector('input[name="mood"]:checked')?.value || "未選心情";
    const entry = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, timestamp: new Date().toISOString(), mood, text: content };
    if (saveEntries([entry, ...getEntries()].slice(0, 50))) {
      form.reset();
      status.textContent = "已保存在這個瀏覽器裡。謝謝你願意寫下來 ♡";
      draw();
    } else status.textContent = "無法儲存。請確認瀏覽器允許本機網站資料，或空間是否已滿。";
  });
  document.querySelector("#journal-clear").addEventListener("click", () => {
    if (!getEntries().length) { status.textContent = "目前沒有可以清除的日記。"; return; }
    if (!window.confirm("確定要清除所有日記嗎？這個操作無法復原。")) return;
    if (saveEntries([])) { status.textContent = "已清除所有日記。"; draw(); }
    else status.textContent = "清除失敗：瀏覽器可能禁止儲存。";
  });
  draw();
}

function renderGuide() {
  const prompt = "請先閱讀 AGENTS.md，依照相同的資料格式、SVG 插畫規則和溫暖語氣，在網站新增一篇『如何練習設立界線』的文章。請驗證資料並確認首頁搜尋可找到它。";
  const button = document.querySelector("#copy-prompt");
  button.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(prompt); button.textContent = "已複製！♡"; }
    catch (_) { button.textContent = "請手動選取上方文字複製"; }
  });
}

const page = document.body.dataset.page;
if (page === "home") renderHome();
if (page === "article") renderArticle();
if (page === "practice") renderPractice();
if (page === "journal") renderJournal();
if (page === "guide") renderGuide();
