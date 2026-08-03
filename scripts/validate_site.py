#!/usr/bin/env python3
"""Validate the React build and public deployment shell for SOIA Pages."""

from __future__ import annotations

import json
from html.parser import HTMLParser
from pathlib import Path
import re
import sys
from urllib.parse import urlsplit
import xml.etree.ElementTree as ET


ROOT = Path(__file__).resolve().parents[1]
BASE_URL = "https://soia-team.github.io"
REQUIRED_FILES = [
    Path("index.html"),
    Path("404.html"),
    Path("favicon.svg"),
    Path("robots.txt"),
    Path("sitemap.xml"),
    Path(".nojekyll"),
    Path("package.json"),
    Path("soia-site/package.json"),
    Path("soia-site/src/App.tsx"),
    Path("soia-site/src/styles.css"),
    Path("soia-site/src/data/catalog.generated.json"),
    Path("soia-site/THIRD_PARTY_NOTICES.md"),
]
PLACEHOLDERS = ["TODO", "lorem ipsum", "YOUR_", "example.com"]
PRIVATE_TERMS = [
    "第一桶金", "收入目标", "营收目标", "价格实验", "定价实验",
    "获客策略", "转化策略", "lead scoring", "线索评分", "客户名单",
    "内部任务板", "人工权益表", "验证续费", "自动授权",
]


class ShellParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.lang = ""
        self.title = ""
        self.description = ""
        self.stylesheets: list[str] = []
        self.scripts: list[str] = []
        self.links: list[str] = []
        self.in_title = False

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        data = dict(attrs)
        if tag == "html":
            self.lang = data.get("lang", "")
        if tag == "title":
            self.in_title = True
        if tag == "meta" and data.get("name", "").casefold() == "description":
            self.description = (data.get("content") or "").strip()
        if tag == "link" and "stylesheet" in (data.get("rel") or "").casefold():
            self.stylesheets.append(data.get("href") or "")
        if tag == "script" and data.get("src"):
            self.scripts.append(data["src"])
        if tag == "a" and data.get("href"):
            self.links.append(data["href"])

    def handle_endtag(self, tag: str) -> None:
        if tag == "title":
            self.in_title = False

    def handle_data(self, data: str) -> None:
        if self.in_title:
            self.title += data.strip()


def fail(message: str) -> int:
    print(f"[FAIL] {message}")
    return 1


def parse_shell(relative: Path) -> tuple[int, ShellParser | None]:
    path = ROOT / relative
    if not path.exists():
        return fail(f"missing {relative}"), None
    parser = ShellParser()
    parser.feed(path.read_text(encoding="utf-8"))
    status = 0
    if parser.lang != "zh-CN":
        status |= fail(f"{relative}: expected zh-CN shell language, got {parser.lang!r}")
    if not parser.title:
        status |= fail(f"{relative}: missing title")
    if not parser.description:
        status |= fail(f"{relative}: missing meta description")
    if len(parser.stylesheets) != 1 or not parser.stylesheets[0].startswith("/assets/"):
        status |= fail(f"{relative}: expected one generated stylesheet under /assets/")
    if len(parser.scripts) != 1 or not parser.scripts[0].startswith("/assets/"):
        status |= fail(f"{relative}: expected one generated script under /assets/")
    for asset in parser.stylesheets + parser.scripts:
        if not (ROOT / asset.lstrip("/")).exists():
            status |= fail(f"{relative}: missing generated asset {asset}")
    html = (ROOT / relative).read_text(encoding="utf-8").casefold()
    for term in PLACEHOLDERS + PRIVATE_TERMS:
        if term.casefold() in html:
            status |= fail(f"{relative}: prohibited or placeholder text found: {term}")
    return status, parser


def expected_routes() -> set[str]:
    static = {
        "/", "/products/", "/open/", "/open/experts/", "/course/",
        "/services/", "/pricing/", "/docs/", "/blog/", "/showcase/",
        "/spec/", "/about/", "/solutions/knowledge/", "/solutions/content/",
        "/solutions/delivery/",
    }
    catalog = json.loads((ROOT / "soia-site/src/data/catalog.generated.json").read_text(encoding="utf-8"))
    static |= {f"/open/{domain['slug']}/" for domain in catalog["domains"]}
    static |= {f"/open/{skill['domain']}/{skill['slug']}/" for skill in catalog["skills"]}
    static |= {f"/open/experts/{domain['slug']}/" for domain in catalog["domains"]}
    return static | {f"/en{route}" for route in static}


def validate_sitemap() -> int:
    try:
        tree = ET.parse(ROOT / "sitemap.xml")
    except ET.ParseError as error:
        return fail(f"sitemap.xml: invalid XML: {error}")
    namespace = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    actual = {
        urlsplit((node.text or "").strip()).path
        for node in tree.findall("sm:url/sm:loc", namespace)
    }
    expected = expected_routes()
    if actual != expected:
        return fail(f"sitemap.xml: expected {len(expected)} routes, got {len(actual)}")
    return 0


def main() -> int:
    status = 0
    for path in REQUIRED_FILES:
        status |= 0 if (ROOT / path).exists() else fail(f"missing {path}")
    for shell in (Path("index.html"), Path("404.html")):
        shell_status, _ = parse_shell(shell)
        status |= shell_status
    status |= validate_sitemap()
    robots = (ROOT / "robots.txt").read_text(encoding="utf-8")
    if f"Sitemap: {BASE_URL}/sitemap.xml" not in robots:
        status |= fail("robots.txt: missing canonical sitemap URL")
    if status == 0:
        catalog = json.loads((ROOT / "soia-site/src/data/catalog.generated.json").read_text(encoding="utf-8"))
        print(f"[OK] React shell, generated assets, {len(expected_routes())} routes, {catalog['total']} Skills, sitemap and governance files")
    return status


if __name__ == "__main__":
    sys.exit(main())
