"""Regenerate images/thumb_site.gif (project #1's preview) from a real
screenshot of index.html, so the thumbnail always matches the current design.

Needs Firefox and Pillow:

    pip install pillow
    python tools/make_thumbnail.py            # uses `firefox` on PATH
    FIREFOX=/path/to/firefox python tools/make_thumbnail.py
"""

import os
import re
import shutil
import subprocess
import tempfile

from PIL import Image

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
OUT = os.path.join(ROOT, "images", "thumb_site.gif")

WINDOW = (1280, 1000)
CROP = (40, 0, 1240, 733)  # page area to keep; same 180:110 shape as the thumbnail
THUMB = (180, 110)


def snapshot_html():
    """index.html with the marquee frozen in place - a screenshot is taken
    before it has scrolled into view, which would leave the bar empty."""
    with open(os.path.join(ROOT, "index.html"), encoding="utf-8") as f:
        html = f.read()
    return re.sub(r"<marquee[^>]*>(.*?)</marquee>",
                  lambda m: '<div align="center">' + " ".join(m.group(1).split()) + "</div>",
                  html, flags=re.S)


def main():
    firefox = os.environ.get("FIREFOX") or shutil.which("firefox")
    if not firefox:
        raise SystemExit("Firefox not found: put it on PATH or set FIREFOX=/path/to/firefox")

    # The copy has to sit next to index.html so its relative image/script paths work.
    page = os.path.join(ROOT, ".thumbnail-snapshot.html")
    with tempfile.TemporaryDirectory() as tmp:
        try:
            with open(page, "w", encoding="utf-8") as f:
                f.write(snapshot_html())
            shot = os.path.join(tmp, "page.png")
            subprocess.run([firefox, "--headless", "--no-remote", "--profile", tmp,
                            "--window-size=%d,%d" % WINDOW, "--screenshot", shot,
                            "file://" + page], check=True, timeout=120,
                           stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            img = Image.open(shot).convert("RGB")
        finally:
            if os.path.exists(page):
                os.remove(page)

    thumb = img.crop(CROP).resize(THUMB, Image.LANCZOS)
    thumb.quantize(colors=128, method=Image.Quantize.MEDIANCUT).save(OUT)
    print("wrote", os.path.relpath(OUT, ROOT))


if __name__ == "__main__":
    main()
