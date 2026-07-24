#!/usr/bin/env python3
"""Build X-style summary_large_image mockups for every blog post in catalog.json.

Run after generate-og.mjs so public/og/<slug>.png exists.
Outputs:
  public/previews/cards/<slug>.png
  public/previews/all-blog-link-previews.png
  public/previews/all-blog-link-previews-grid.png
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    print("Pillow required: pip install Pillow", file=sys.stderr)
    sys.exit(1)

ROOT = Path(__file__).resolve().parents[1]
CATALOG = ROOT / "src" / "blog" / "catalog.json"
OG_DIR = ROOT / "public" / "og"
OUT_DIR = ROOT / "public" / "previews"
CARDS_DIR = OUT_DIR / "cards"

FONT_CANDIDATES = [
    "/System/Library/Fonts/Supplemental/Times New Roman Bold.ttf",
    "/System/Library/Fonts/Supplemental/Times New Roman.ttf",
    "/Library/Fonts/Arial.ttf",
    "/System/Library/Fonts/Helvetica.ttc",
]


def load_font(size: int, bold: bool = False) -> ImageFont.ImageFont:
    preferred = []
    for p in FONT_CANDIDATES:
        path = Path(p)
        if not path.exists():
            continue
        name = path.name.lower()
        if bold and "bold" in name:
            preferred.insert(0, path)
        elif not bold and "bold" not in name:
            preferred.insert(0, path)
        else:
            preferred.append(path)
    for path in preferred:
        try:
            return ImageFont.truetype(str(path), size)
        except Exception:
            continue
    return ImageFont.load_default()


def wrap_text(draw: ImageDraw.ImageDraw, text: str, font, max_width: int) -> list[str]:
    words = text.split()
    lines: list[str] = []
    cur = ""
    for w in words:
        trial = (cur + " " + w).strip()
        bbox = draw.textbbox((0, 0), trial, font=font)
        if bbox[2] - bbox[0] <= max_width:
            cur = trial
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


CARD_W = 640
IMG_H = 336
PAD = 20
TEXT_AREA = 168
CARD_H = IMG_H + TEXT_AREA
RADIUS = 18


def make_card(post: dict) -> Image.Image:
    og_path = OG_DIR / f"{post['slug']}.png"
    if not og_path.exists():
        raise FileNotFoundError(f"missing OG art (run og:generate first): {og_path}")

    card = Image.new("RGB", (CARD_W, CARD_H), "#ffffff")
    draw = ImageDraw.Draw(card)

    og = Image.open(og_path).convert("RGB")
    og = og.resize((CARD_W, IMG_H), Image.Resampling.LANCZOS)
    card.paste(og, (0, 0))
    draw.line([(0, IMG_H), (CARD_W, IMG_H)], fill="#e5e5e5", width=1)

    title_font = load_font(22, bold=True)
    desc_font = load_font(15)
    domain_font = load_font(13)
    label_font = load_font(14)

    x = PAD
    y = IMG_H + 16
    max_w = CARD_W - PAD * 2

    for line in wrap_text(draw, post["title"], title_font, max_w)[:2]:
        draw.text((x, y), line, font=title_font, fill="#0a0a0a")
        y += 28
    y += 4

    for line in wrap_text(draw, post["description"], desc_font, max_w)[:3]:
        draw.text((x, y), line, font=desc_font, fill="#555555")
        y += 20
    y += 10

    draw.text((x, min(y, CARD_H - 28)), "leviathan.run", font=domain_font, fill="#888888")

    mask = Image.new("L", (CARD_W, CARD_H), 0)
    ImageDraw.Draw(mask).rounded_rectangle(
        [0, 0, CARD_W - 1, CARD_H - 1], radius=RADIUS, fill=255
    )

    paper = Image.new("RGBA", (CARD_W + 48, CARD_H + 48), (240, 239, 233, 255))
    shadow = Image.new("RGBA", paper.size, (0, 0, 0, 0))
    ImageDraw.Draw(shadow).rounded_rectangle(
        [28, 30, 28 + CARD_W, 30 + CARD_H], radius=RADIUS, fill=(0, 0, 0, 40)
    )
    paper = Image.alpha_composite(paper, shadow)

    card_rgba = card.convert("RGBA")
    card_rgba.putalpha(mask)
    paper.paste(card_rgba, (24, 24), card_rgba)
    ImageDraw.Draw(paper).rounded_rectangle(
        [24, 24, 24 + CARD_W - 1, 24 + CARD_H - 1],
        radius=RADIUS,
        outline=(0, 0, 0, 50),
        width=1,
    )

    final = Image.new("RGB", (paper.width, paper.height + 44), "#f0efe9")
    final.paste(paper.convert("RGB"), (0, 44))
    fd = ImageDraw.Draw(final)
    fd.text(
        (24, 14),
        f"{post.get('dateLabel', post.get('date', ''))}  ·  /blog/{post['slug']}",
        font=label_font,
        fill="#666666",
    )
    return final


def main() -> None:
    posts = json.loads(CATALOG.read_text())
    CARDS_DIR.mkdir(parents=True, exist_ok=True)

    cards: list[tuple[dict, Image.Image]] = []
    for post in posts:
        img = make_card(post)
        out = CARDS_DIR / f"{post['slug']}.png"
        img.save(out, "PNG", optimize=True)
        cards.append((post, img))
        print(f"wrote {out.relative_to(ROOT)} ({img.size[0]}x{img.size[1]})")

    if not cards:
        print("no posts in catalog")
        return

    gap = 28
    widths = [c[1].width for c in cards]
    heights = [c[1].height for c in cards]
    W = max(widths) + 64
    H = sum(heights) + gap * (len(cards) + 1) + 80
    montage = Image.new("RGB", (W, H), "#e8e6df")
    md = ImageDraw.Draw(montage)
    header = load_font(28, bold=True)
    sub = load_font(16)
    md.text((32, 28), "Leviathan blog · X link previews", font=header, fill="#0a0a0a")
    md.text(
        (32, 64),
        "summary_large_image cards as shared on leviathan.run/blog/*",
        font=sub,
        fill="#555555",
    )
    y = 100
    for _, img in cards:
        x = (W - img.width) // 2
        montage.paste(img, (x, y))
        y += img.height + gap
    stack_path = OUT_DIR / "all-blog-link-previews.png"
    montage.save(stack_path, "PNG", optimize=True)
    print(f"wrote {stack_path.relative_to(ROOT)} ({montage.size[0]}x{montage.size[1]})")

    cols = 2
    cell_w = max(widths) + 24
    cell_h = max(heights) + 24
    rows = (len(cards) + cols - 1) // cols
    grid = Image.new("RGB", (cell_w * cols + 40, cell_h * rows + 100), "#e8e6df")
    gd = ImageDraw.Draw(grid)
    gd.text((32, 28), "Leviathan blog · link previews (grid)", font=header, fill="#0a0a0a")
    for i, (_, img) in enumerate(cards):
        r, c = divmod(i, cols)
        x = 20 + c * cell_w + (cell_w - img.width) // 2
        y = 90 + r * cell_h + 8
        grid.paste(img, (x, y))
    grid_path = OUT_DIR / "all-blog-link-previews-grid.png"
    grid.save(grid_path, "PNG", optimize=True)
    print(f"wrote {grid_path.relative_to(ROOT)} ({grid.size[0]}x{grid.size[1]})")


if __name__ == "__main__":
    main()
