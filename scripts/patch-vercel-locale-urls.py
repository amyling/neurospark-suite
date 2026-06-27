"""Append ?locale=en to Leo Suite app Vercel URLs in docs (portfolio home excluded)."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKIP_DIRS = {"_repos", "node_modules", ".git", "growth", "edutech", "robot"}
APP_HOSTS = (
    "leo-suite-edutech-six.vercel.app",
    "leo-suite-robot.vercel.app",
    "leo-suite-growth-swart.vercel.app",
)
EXTS = {".md", ".html", ".ps1"}


def should_touch(path: Path) -> bool:
    return path.suffix.lower() in EXTS


def append_locale(url: str) -> str:
    if "locale=" in url:
        return url
    if "?" in url:
        return f"{url}&locale=en"
    return f"{url}?locale=en"


def patch_text(text: str) -> str:
    pattern = re.compile(
        r"https://(?:" + "|".join(re.escape(h) for h in APP_HOSTS) + r")[^\s\"'<>)]*"
    )

    def repl(match: re.Match[str]) -> str:
        raw = match.group(0).rstrip(".,;)")
        suffix = match.group(0)[len(raw) :]
        return append_locale(raw) + suffix

    return pattern.sub(repl, text)


def main() -> None:
    changed = 0
    for path in ROOT.rglob("*"):
        if not path.is_file() or not should_touch(path):
            continue
        if any(part in SKIP_DIRS for part in path.parts):
            continue
        original = path.read_text(encoding="utf-8")
        updated = patch_text(original)
        if updated != original:
            path.write_text(updated, encoding="utf-8")
            changed += 1
            print(path.relative_to(ROOT))
    print(f"Updated {changed} file(s)")


if __name__ == "__main__":
    main()
