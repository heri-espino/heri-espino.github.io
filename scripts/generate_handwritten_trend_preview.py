#!/usr/bin/env python3
"""Render the public handwritten trend-estimation notebook's first page.

Usage:
    python -m pip install pymupdf Pillow
    python scripts/generate_handwritten_trend_preview.py
"""
from pathlib import Path
from PIL import Image
import fitz

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "notes" / "notes on trend estimation.pdf"
TARGET = ROOT / "assets/img/portfolio/handwritten-trend-first-page.webp"

with fitz.open(SOURCE) as pdf:
    if not len(pdf):
        raise ValueError(f"No pages in {SOURCE}")
    page = pdf.load_page(0)
    pixmap = page.get_pixmap(matrix=fitz.Matrix(1.6, 1.6), alpha=False)
    image = Image.frombytes("RGB", (pixmap.width, pixmap.height), pixmap.samples)

image.thumbnail((1050, 1500))
TARGET.parent.mkdir(parents=True, exist_ok=True)
image.save(TARGET, "WEBP", quality=80, method=6)
print(f"Rendered PDF page 1 to {TARGET.relative_to(ROOT)}: {image.size}")
