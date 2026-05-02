"""ML classification stub.

Replace `classify_image` with a real model (TF/PyTorch) or remote API call.
For the MVP we use a deterministic heuristic over average image colors so the
end-to-end pipeline works without ML deps.
"""
from __future__ import annotations

from pathlib import Path

try:
    from PIL import Image
except ImportError:  # pragma: no cover
    Image = None


CATEGORIES = ("pothole", "garbage", "lighting", "other")


def classify_image(image_path: str | Path) -> tuple[str, float]:
    """Return (category, confidence) for an image file.

    Heuristic: look at average brightness and dominant color channel.
    Dark + gray  -> pothole
    Greenish     -> garbage
    Very dark    -> lighting
    Otherwise    -> other
    """
    path = Path(image_path)
    if Image is None or not path.exists():
        return "other", 0.0

    try:
        with Image.open(path) as img:
            img = img.convert("RGB").resize((64, 64))
            pixels = list(img.getdata())
    except Exception:
        return "other", 0.0

    n = len(pixels) or 1
    r = sum(p[0] for p in pixels) / n
    g = sum(p[1] for p in pixels) / n
    b = sum(p[2] for p in pixels) / n
    brightness = (r + g + b) / 3

    if brightness < 40:
        return "lighting", 0.72
    if g > r + 10 and g > b + 5:
        return "garbage", 0.68
    if brightness < 90 and abs(r - g) < 15 and abs(g - b) < 15:
        return "pothole", 0.65
    return "other", 0.50
