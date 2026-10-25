"""Prepare complete, proportional mark assets from the supplied Praxis source.

This is deterministic background removal and extraction, not logo generation.
The original praxislogo.png is never modified. Requires Pillow and fontTools.
"""
from pathlib import Path
from shutil import copyfile
from PIL import Image, ImageDraw, ImageFont, ImageOps
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "brand"
OUT.mkdir(parents=True, exist_ok=True)
(ROOT / "public" / "images").mkdir(parents=True, exist_ok=True)
(ROOT / "public" / "media" / "screenshots").mkdir(parents=True, exist_ok=True)
(ROOT / "public" / "media" / "videos").mkdir(parents=True, exist_ok=True)
(ROOT / "public" / "media" / "captions").mkdir(parents=True, exist_ok=True)
(ROOT / "fonts").mkdir(exist_ok=True)

source = Image.open(ROOT / "praxislogo.png").convert("RGB")
gray = ImageOps.grayscale(source)
alpha = gray.point(lambda value: max(0, min(255, round((247 - value) / 220 * 255))))
ink_mask = gray.point(lambda value: 255 if value < 100 else 0)

def bounds(region):
    x, y, right, bottom = region
    box = ink_mask.crop(region).getbbox()
    if not box:
        raise ValueError("Supplied mark was not found")
    return (max(x, box[0] + x - 12), max(y, box[1] + y - 12), min(right, box[2] + x + 12), min(bottom, box[3] + y + 12))

boxes = {
    "symbol": bounds((0, 0, source.width, 900)),
    "wordmark": bounds((0, 900, source.width, source.height)),
    "lockup": (0, 0, source.width, source.height),
}

for kind, box in boxes.items():
    for theme, rgb in [("dark", (21, 21, 24)), ("light", (248, 248, 246))]:
        asset = Image.new("RGBA", source.size, rgb + (0,))
        asset.putalpha(alpha)
        asset = asset.crop(box)
        asset.save(OUT / f"praxis-{kind}-{theme}.webp", lossless=True)
        if kind == "lockup" and theme == "dark":
            asset.save(OUT / "praxis-lockup-transparent.png", optimize=True)
    print(f"{kind}: {asset.width} x {asset.height}; source bounds {box}")

symbol = Image.open(OUT / "praxis-symbol-dark.webp")
for size in [180, 192, 512]:
    icon = Image.new("RGBA", (size, size), (248, 248, 245, 0))
    resized = ImageOps.contain(symbol, (int(size * 0.72), int(size * 0.72)), Image.Resampling.LANCZOS)
    icon.alpha_composite(resized, ((size - resized.width) // 2, (size - resized.height) // 2))
    icon.save(OUT / f"icon-{size}.png", optimize=True)
Image.open(OUT / "icon-192.png").save(ROOT / "public" / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])

font_source = ROOT / "node_modules" / "@fontsource-variable" / "manrope"
copyfile(font_source / "files" / "manrope-latin-wght-normal.woff2", ROOT / "fonts" / "manrope-latin-variable.woff2")
copyfile(font_source / "LICENSE", ROOT / "fonts" / "OFL.txt")
font = TTFont(ROOT / "fonts" / "manrope-latin-variable.woff2")
font = instantiateVariableFont(font, {"wght": 550}, inplace=False)
font.flavor = None
ttf = ROOT / "fonts" / "manrope-social.ttf"
font.save(ttf)

social = Image.new("RGB", (1200, 630), (248, 248, 245))
draw = ImageDraw.Draw(social)
wordmark = Image.open(OUT / "praxis-wordmark-dark.webp")
wordmark = ImageOps.contain(wordmark, (160, 28), Image.Resampling.LANCZOS)
social.paste(wordmark, (70, 65), wordmark)
headline = ImageFont.truetype(str(ttf), 79)
small = ImageFont.truetype(str(ttf), 24)
draw.text((64, 191), "Your browser.", font=headline, fill=(24, 24, 28), stroke_width=0)
draw.text((64, 290), "Ready to do more.", font=headline, fill=(107, 76, 218), stroke_width=0)
draw.text((70, 523), "From Xasri", font=small, fill=(85, 85, 95))
mark = ImageOps.contain(symbol, (100, 104), Image.Resampling.LANCZOS)
social.paste(mark, (1020, 475), mark)
social.save(ROOT / "public" / "images" / "social-preview.png", optimize=True)
ttf.unlink()
print("Prepared social preview, favicons, local font, and licence.")
