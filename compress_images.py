"""Compress all large images in the portfolio project."""
import os
import sys
from PIL import Image

ROOT = os.path.dirname(os.path.abspath(__file__))

# Images to compress: (relative_path, max_width, quality)
TARGETS = [
    # portrait - About page avatar
    ("assets/images/portrait-new.png", 600, 85),
    # Project covers
    ("assets/images/research-os.png", 800, 85),
    ("assets/images/knowledge-tarot.png", 800, 85),
    # Firefly gallery (9 photos)
    ("assets/images/firefly/07526b43d77772878c7d9334e13ae84b.jpg", 1200, 80),
    ("assets/images/firefly/1c05264f3149f3bc6c0584a728025bd8.jpg", 1200, 80),
    ("assets/images/firefly/592c397dac318fa6b62eedf4bbf8e850.jpg", 1200, 80),
    ("assets/images/firefly/8117715f65bb89eea1fd9346f7108e20.jpg", 1200, 80),
    ("assets/images/firefly/8a28b2bbfd27aa5272b300297e8b56ed.jpg", 1200, 80),
    ("assets/images/firefly/8c3799d73a2aabaeefb213c0b8e64976.jpg", 1200, 80),
    ("assets/images/firefly/adccfa4676dc26ea770cc85976600eac.jpg", 1200, 80),
    ("assets/images/firefly/b6b2865b569d7365851ce6f53d98dac4.jpg", 1200, 80),
    ("assets/images/firefly/de3b2075aad3ad326179f0b8b21dda44.jpg", 1200, 80),
]

def compress_image(rel_path, max_width, quality):
    path = os.path.join(ROOT, rel_path)
    if not os.path.exists(path):
        print(f"  SKIP (not found): {rel_path}")
        return

    orig_size = os.path.getsize(path)
    img = Image.open(path)

    # Resize if wider than max_width
    if img.width > max_width:
        new_height = int(img.height * max_width / img.width)
        img = img.resize((max_width, new_height), Image.LANCZOS)

    # Convert RGBA to RGB for JPEG (white background)
    if img.mode in ("RGBA", "P"):
        bg = Image.new("RGB", img.size, (255, 255, 255))
        if img.mode == "P":
            img = img.convert("RGBA")
        bg.paste(img, mask=img.split()[-1] if img.mode == "RGBA" else None)
        img = bg

    # Save compressed
    if rel_path.endswith(".jpg") or rel_path.endswith(".jpeg"):
        img.save(path, "JPEG", quality=quality, optimize=True, progressive=True)
    elif rel_path.endswith(".png"):
        # For PNG, save as optimized PNG
        img.save(path, "PNG", optimize=True)

    new_size = os.path.getsize(path)
    saved = (1 - new_size / orig_size) * 100
    print(f"  {rel_path}: {orig_size/1024:.0f}KB -> {new_size/1024:.0f}KB ({saved:.0f}% saved)")

if __name__ == "__main__":
    print("Compressing images...")
    for rel_path, max_w, q in TARGETS:
        compress_image(rel_path, max_w, q)
    print("Done!")
