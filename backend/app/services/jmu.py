"""Jawaab Markup (JMU) compiler.

Deterministically turns scraped HTML into a compact Markdown-like markup that is
small on disk and cheap to render in the Flutter app. Same input always yields
the same output.

Supported JMU forms:
    ## / ###      section / subsection headers (from h2..h6)
    blank line    paragraph separator
    > text        blockquote (Qur'an / hadith / cited passages)
    - item        unordered list item
    1. item       ordered list item
    **bold**      strong / b
    *italic*      em / i
    [text](url)   links

Everything else is unwrapped to its text content; scripts/styles/ads are dropped.
``compile_html`` returns both the JMU string and a plain-text rendering used for
full-text search.
"""
from __future__ import annotations

import re
from dataclasses import dataclass

from bs4 import BeautifulSoup, NavigableString, Tag

_DROP_TAGS = {"script", "style", "ins", "noscript", "iframe", "svg"}
_DROP_CLASSES = {"code-block", "original_source", "ads", "advert"}
_INLINE_WS = re.compile(r"[ \t\r\f\v]+")
_BLANK_LINES = re.compile(r"\n{3,}")


@dataclass(frozen=True)
class CompiledContent:
    jmu: str
    text: str


def _clean_ws(s: str) -> str:
    return _INLINE_WS.sub(" ", s).strip()


def _collapse_ws(s: str) -> str:
    """Collapse internal whitespace runs to a single space, keeping any
    leading/trailing space so inline siblings stay separated."""
    return _INLINE_WS.sub(" ", s.replace("\n", " "))


def _is_dropped(node: Tag) -> bool:
    if node.name in _DROP_TAGS:
        return True
    classes = set(node.get("class") or [])
    return bool(classes & _DROP_CLASSES)


def _render_inline(node) -> str:
    """Inline rendering: text with **bold**, *italic*, [links](url)."""
    if isinstance(node, NavigableString):
        return _collapse_ws(str(node))
    if not isinstance(node, Tag) or _is_dropped(node):
        return ""

    inner = "".join(_render_inline(c) for c in node.children)
    name = node.name
    if name in ("strong", "b"):
        return f"**{inner}**" if inner.strip() else ""
    if name in ("em", "i"):
        return f"*{inner}*" if inner.strip() else ""
    if name == "a":
        href = (node.get("href") or "").strip()
        text = inner.strip()
        if href and text:
            return f"[{text}]({href})"
        return text
    if name == "br":
        return "\n"
    return inner


def _render_block(node, out: list[str]) -> None:
    if isinstance(node, NavigableString):
        text = _clean_ws(str(node))
        if text:
            out.append(text)
        return
    if not isinstance(node, Tag) or _is_dropped(node):
        return

    name = node.name
    if name in ("h2", "h3", "h4", "h5", "h6"):
        level = "##" if name == "h2" else "###"
        text = _clean_ws(_render_inline(node))
        if text:
            out.append(f"{level} {text}")
    elif name == "h1":
        text = _clean_ws(_render_inline(node))
        if text:
            out.append(f"## {text}")
    elif name == "p":
        text = _clean_ws(_render_inline(node))
        if text:
            out.append(text)
    elif name == "blockquote":
        lines = _clean_ws(_render_inline(node)).split("\n")
        quoted = "\n".join(f"> {ln}".rstrip() for ln in lines if ln.strip())
        if quoted:
            out.append(quoted)
    elif name == "ul":
        items = [
            _clean_ws(_render_inline(li))
            for li in node.find_all("li", recursive=False)
        ]
        block = "\n".join(f"- {it}" for it in items if it)
        if block:
            out.append(block)
    elif name == "ol":
        items = [
            _clean_ws(_render_inline(li))
            for li in node.find_all("li", recursive=False)
        ]
        block = "\n".join(f"{i}. {it}" for i, it in enumerate(items, 1) if it)
        if block:
            out.append(block)
    elif name in ("div", "section", "article", "main"):
        # containers: recurse into children as blocks
        for child in node.children:
            _render_block(child, out)
    else:
        # unknown block-ish tag: fall back to its inline text as a paragraph
        text = _clean_ws(_render_inline(node))
        if text:
            out.append(text)


def compile_html(html: str) -> CompiledContent:
    soup = BeautifulSoup(html or "", "lxml")
    root = soup.body or soup

    blocks: list[str] = []
    for child in root.children:
        _render_block(child, blocks)

    jmu = _BLANK_LINES.sub("\n\n", "\n\n".join(b for b in blocks if b).strip())
    text = jmu_to_text(jmu)
    return CompiledContent(jmu=jmu, text=text)


_MARKUP_RE = re.compile(r"\*\*|\*|^#{2,3}\s+|^>\s?|^-\s+|^\d+\.\s+", re.MULTILINE)
_LINK_RE = re.compile(r"\[([^\]]+)\]\([^)]*\)")


def jmu_to_text(jmu: str) -> str:
    """Strip JMU markup down to plain text (for full-text search)."""
    text = _LINK_RE.sub(r"\1", jmu)
    text = _MARKUP_RE.sub("", text)
    return _BLANK_LINES.sub("\n\n", text).strip()
