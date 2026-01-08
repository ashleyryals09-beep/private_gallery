import json, os

PHOTO_DIR = "photo/folder"
VIDEO_DIR = "videos/folder"

def list_files(folder, exts):
  out = []
  for name in os.listdir(folder):
    if any(name.lower().endswith(ext) for ext in exts):
      out.append(name)
  return sorted(out)

photos = list_files(PHOTO_DIR, [".jpg", ".jpeg", ".png", ".webp"])
videos = list_files(VIDEO_DIR, [".mp4", ".mov", ".m4v", ".webm"])

manifest = {
  "photoDir": PHOTO_DIR,
  "videoDir": VIDEO_DIR,
  "photos": photos,
  "videos": videos
}

with open("photos.json", "w") as f:
  json.dump(manifest, f, indent=2)

print(f"photos: {len(photos)} | videos: {len(videos)}")
