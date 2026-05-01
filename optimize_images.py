import os, base64, re
from PIL import Image

img_dir = r"c:\Users\beine\OneDrive\Desktop\old docs\horrid-wake\images"
html_path = r"c:\Users\beine\OneDrive\Desktop\old docs\horrid-wake\index.html"
chars = ["dennis", "mac", "charlie", "dee", "frank"]
results = {}

for name in chars:
    src = os.path.join(img_dir, f"{name}.jpg")
    webp_out = os.path.join(img_dir, f"{name}.webp")

    orig_size = os.path.getsize(src)

    # Resize to max 800px wide, preserve aspect ratio
    img = Image.open(src)
    w, h = img.size
    if w > 800:
        new_h = int(h * 800 / w)
        img = img.resize((800, new_h), Image.LANCZOS)

    # Convert to WebP at quality 82
    img.save(webp_out, "WEBP", quality=82)

    webp_size = os.path.getsize(webp_out)
    saving_pct = (1 - webp_size / orig_size) * 100

    print(f"{name}: {orig_size/1024:.1f} KB JPG  ->  {webp_size/1024:.1f} KB WebP  ({saving_pct:.1f}% smaller)")

    with open(webp_out, "rb") as f:
        b64 = base64.b64encode(f.read()).decode("ascii")
    results[name] = f"data:image/webp;base64,{b64}"

print("\nAll images encoded. Patching index.html...")

with open(html_path, "r", encoding="utf-8") as f:
    html = f.read()

entries = ", ".join(f'{name}: "{results[name]}"' for name in chars)
new_imgs_block = f"window.CHAR_IMGS = {{ {entries} }};"

html = re.sub(
    r'window\.CHAR_IMGS\s*=\s*\{[^}]*\};',
    new_imgs_block,
    html,
    flags=re.DOTALL
)

with open(html_path, "w", encoding="utf-8", newline="") as f:
    f.write(html)

print("index.html patched.")

with open(html_path, "r", encoding="utf-8") as f:
    verify = f.read()

for name in chars:
    if f'{name}: "data:image/webp;base64,' in verify:
        print(f"  [OK] {name} embedded")
    else:
        print(f"  [FAIL] {name} MISSING")

print(f"\nFinal index.html size: {os.path.getsize(html_path) / (1024*1024):.2f} MB")
