#!/usr/bin/env python3
"""Validate the content contract in AGENTS.md, using the Python standard library."""
import datetime
import json
import re
import sys
from pathlib import Path

PATH = Path(__file__).resolve().parents[1] / "data" / "articles.json"
CATEGORIES = {"情緒照顧", "自我接納", "生活練習"}
REQUIRED = {"slug", "title", "category", "summary", "tags", "readMinutes", "updated", "sections", "illustration"}

def nonempty(value):
    return isinstance(value, str) and bool(value.strip())

def fail(errors, where, message):
    errors.append(f"{where}：{message}")

def main():
    try:
        data = json.loads(PATH.read_text(encoding="utf-8"))
    except (OSError, UnicodeError, json.JSONDecodeError) as exc:
        print("❌ 無法載入文章 JSON：", exc)
        return 1
    errors = []
    if not isinstance(data, list):
        print("❌ 最外層必須是 JSON 陣列")
        return 1
    slugs = set()
    for pos, item in enumerate(data, 1):
        tag = f"文章 {pos}"
        if not isinstance(item, dict):
            fail(errors, tag, "必須是物件")
            continue
        missing = REQUIRED - item.keys()
        if missing:
            fail(errors, tag, "缺少欄位 " + ", ".join(sorted(missing)))
            continue
        illustration = item["illustration"]
        if (not isinstance(illustration, str)
            or re.fullmatch(r"assets/illustrations/[a-z0-9-]+\.svg", illustration) is None
            or not (PATH.parents[1] / illustration).is_file()):
            fail(errors, tag, "illustration 須指向現有的 assets/illustrations/*.svg")
        slug = item["slug"]
        if not nonempty(slug) or re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", slug) is None:
            fail(errors, tag, "slug 必須為小寫英數與連字號")
        elif slug in slugs:
            fail(errors, tag, f"slug 重複：{slug}")
        else:
            slugs.add(slug)
        for key in ("title", "summary"):
            if not nonempty(item[key]):
                fail(errors, tag, f"{key} 不可空白")
        if item["category"] not in CATEGORIES:
            fail(errors, tag, "不支援的 category")
        tags = item["tags"]
        if not isinstance(tags, list) or not tags or not all(nonempty(t) for t in tags):
            fail(errors, tag, "tags 至少一個非空字串")
        elif len(tags) != len(set(tags)):
            fail(errors, tag, "tags 不可重複")
        minutes = item["readMinutes"]
        if type(minutes) is not int or not 1 <= minutes <= 30:
            fail(errors, tag, "readMinutes 必須是 1～30 的整數")
        date = item["updated"]
        try:
            if not isinstance(date, str) or not re.fullmatch(r"\d{4}-\d{2}-\d{2}", date):
                raise ValueError()
            datetime.date.fromisoformat(date)
        except ValueError:
            fail(errors, tag, "updated 須為真實 YYYY-MM-DD 日期")
        sections = item["sections"]
        if not isinstance(sections, list) or len(sections) < 2:
            fail(errors, tag, "sections 至少兩個章節")
            continue
        for n, section in enumerate(sections, 1):
            sub = f"{tag} 的章節 {n}"
            if not isinstance(section, dict) or not nonempty(section.get("heading")):
                fail(errors, sub, "缺少非空 heading")
                continue
            paragraphs = section.get("paragraphs", [])
            bullets = section.get("bullets", [])
            if any(not isinstance(a, list) or not all(nonempty(t) for t in a) for a in (paragraphs, bullets)):
                fail(errors, sub, "paragraphs / bullets 須為非空字串陣列")
            if not paragraphs and not bullets:
                fail(errors, sub, "至少提供 paragraphs 或 bullets")
            if "tip" in section and not nonempty(section["tip"]):
                fail(errors, sub, "tip 若有提供就不得為空")
    if errors:
        print(f"❌ 共 {len(errors)} 項錯誤：")
        for error in errors:
            print(" -", error)
        return 1
    print(f"✅ 資料格式驗證成功：{len(data)} 篇文章、{len(slugs)} 個唯一 slug。")
    print("提醒：這項檢查只驗證資料格式，不等同完整瀏覽器互動測試。")
    return 0

if __name__ == "__main__":
    sys.exit(main())
