#!/usr/bin/env python3
"""Generate OG image, favicons, and Mac app icon from the TinyNudge cursor glyph."""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
MAC = ROOT / "mac"
BG = (7, 8, 12, 255)
MINT = (92, 255, 193, 255)
MUTED = (139, 148, 143, 255)
WHITE = (238, 244, 241, 255)


def cursor_path(draw: ImageDraw.ImageDraw, ox: float, oy: float, scale: float) -> None:
    pts = [
        (18, 16),
        (40, 30),
        (30, 32),
        (36, 46),
        (30, 49),
        (24, 35),
        (18, 44),
        (18, 16),
    ]
    scaled = [(ox + x * scale, oy + y * scale) for x, y in pts]
    draw.polygon(scaled, fill=MINT)


def rounded_rect(draw: ImageDraw.ImageDraw, box, radius, fill) -> None:
    draw.rounded_rectangle(box, radius=radius, fill=fill)


def load_font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = [
        "/System/Library/Fonts/Supplemental/Georgia Italic.ttf" if not bold else "/System/Library/Fonts/Supplemental/Georgia Bold.ttf",
        "/System/Library/Fonts/Supplemental/Georgia.ttf",
        "/Library/Fonts/Arial.ttf",
    ]
    for path in candidates:
        try:
            return ImageFont.truetype(path, size=size)
        except OSError:
            continue
    return ImageFont.load_default()


def make_og() -> None:
    img = Image.new("RGBA", (1200, 630), BG)
    draw = ImageDraw.Draw(img)
    for i in range(0, 1200, 56):
        draw.line([(i, 0), (i, 630)], fill=(92, 255, 193, 12), width=1)
    for i in range(0, 630, 56):
        draw.line([(0, i), (1200, i)], fill=(92, 255, 193, 12), width=1)
    rounded_rect(draw, (70, 150, 250, 330), 36, (18, 20, 28, 255))
    cursor_path(draw, 88, 168, 2.6)
    title = load_font(72)
    sub = load_font(28)
    draw.text((300, 175), "TinyNudge", font=title, fill=WHITE)
    draw.text((300, 270), "Free online mouse jiggler", font=sub, fill=MINT)
    draw.text((300, 320), "Keep the screen awake. Mac app moves the real pointer.", font=sub, fill=MUTED)
    draw.text((300, 430), "mousejiggle.app", font=sub, fill=MUTED)
    img.convert("RGB").save(ASSETS / "og.png", "PNG", optimize=True)


def make_icon(size: int, path: Path, radius_ratio: float = 0.22) -> None:
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    pad = int(size * 0.02)
    rounded_rect(draw, (pad, pad, size - pad, size - pad), int(size * radius_ratio), BG)
    scale = size / 64
    cursor_path(draw, 0, 0, scale)
    img.save(path, "PNG", optimize=True)


def make_icns() -> None:
    iconset = MAC / "TinyNudge.iconset"
    iconset.mkdir(exist_ok=True)
    mapping = [
        (16, "icon_16x16.png"),
        (32, "icon_16x16@2x.png"),
        (32, "icon_32x32.png"),
        (64, "icon_32x32@2x.png"),
        (128, "icon_128x128.png"),
        (256, "icon_128x128@2x.png"),
        (256, "icon_256x256.png"),
        (512, "icon_256x256@2x.png"),
        (512, "icon_512x512.png"),
        (1024, "icon_512x512@2x.png"),
    ]
    for px, name in mapping:
        make_icon(px, iconset / name, radius_ratio=0.22)
    # iconutil is invoked by the caller / build.sh


def main() -> None:
    ASSETS.mkdir(exist_ok=True)
    make_og()
    make_icon(180, ASSETS / "apple-touch-icon.png")
    make_icon(32, ASSETS / "favicon-32.png", radius_ratio=0.22)
    make_icns()
    print("Wrote assets and mac/TinyNudge.iconset")


if __name__ == "__main__":
    main()
