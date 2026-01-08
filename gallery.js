(async function () {
  const photoGrid = document.getElementById("photoGrid");
  const videoGrid = document.getElementById("videoGrid");
  const photoCount = document.getElementById("photoCount");
  const videoCount = document.getElementById("videoCount");

  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modalTitle");
  const modalContent = document.getElementById("modalContent");
  const closeBtn = document.getElementById("closeBtn");

  function joinPath(dir, file) {
    return `${dir.replace(/\/$/, "")}/${file}`;
  }

  function makeCard({ type, src, title }) {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.type = type;
    card.dataset.src = src;
    card.dataset.title = title;

    // Thumbnail:
    // - For photos: use the photo itself (simple)
    // - For videos: show a generic "play" poster box (no auto thumbnail extraction)
    const thumb = document.createElement("div");
    thumb.className = "thumb";

    if (type === "image") {
      const img = document.createElement("img");
      img.loading = "lazy";
      img.src = src;
      img.alt = title;
      thumb.appendChild(img);
    } else {
      const poster = document.createElement("div");
      poster.className = "videoPoster";
      poster.innerHTML = `<span class="play">▶</span>`;
      thumb.appendChild(poster);
    }

    const label = document.createElement("div");
    label.className = "label";
    label.textContent = title;

    card.appendChild(thumb);
    card.appendChild(label);

    card.addEventListener("click", () => openModal(type, src, title));
    return card;
  }

  function openModal(type, src, title) {
    modalTitle.textContent = title || "Preview";
    modalContent.innerHTML = "";

    if (type === "image") {
      const img = document.createElement("img");
      img.src = src;
      img.alt = title || "Image";
      modalContent.appendChild(img);
    } else {
      const video = document.createElement("video");
      video.src = src;
      video.controls = true;
      video.playsInline = true;
      video.preload = "metadata";
      modalContent.appendChild(video);
      video.play().catch(() => {});
    }

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
  }

  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    modalContent.innerHTML = "";
  }

  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  // Load manifest
  let manifest;
  try {
    const res = await fetch("photos.json", { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to load photos.json (${res.status})`);
    manifest = await res.json();
  } catch (err) {
    console.error(err);
    photoGrid.innerHTML = `<div class="error">Could not load photos.json</div>`;
    return;
  }

  const photoDir = manifest.photoDir || "photo/folder";
  const videoDir = manifest.videoDir || "videos/folder";

  const photos = Array.isArray(manifest.photos) ? manifest.photos : [];
  const videos = Array.isArray(manifest.videos) ? manifest.videos : [];

  // Optional: de-dupe by "basename" (photo300.jpg vs photo300.jpeg)
  // Prefers .jpeg over .jpg over .JPG etc.
  function dedupeByBasename(files) {
    const pref = ["jpeg", "jpg", "png", "webp", "gif"];
    const map = new Map();
    for (const f of files) {
      const parts = f.split(".");
      if (parts.length < 2) continue;
      const ext = parts.pop();
      const base = parts.join(".");
      const extLower = ext.toLowerCase();
      const rank = pref.indexOf(extLower);
      const current = map.get(base);
      if (!current) {
        map.set(base, { file: f, rank: rank === -1 ? 999 : rank });
      } else {
        const newRank = rank === -1 ? 999 : rank;
        if (newRank < current.rank) {
          map.set(base, { file: f, rank: newRank });
        }
      }
    }
    return [...map.values()].map(x => x.file);
  }

  const finalPhotos = dedupeByBasename(photos);

  // Render
  photoCount.textContent = `${finalPhotos.length}`;
  videoCount.textContent = `${videos.length}`;

  for (const f of finalPhotos) {
    const src = joinPath(photoDir, f);
    photoGrid.appendChild(makeCard({ type: "image", src, title: f }));
  }

  for (const f of videos) {
    const src = joinPath(videoDir, f);
    videoGrid.appendChild(makeCard({ type: "video", src, title: f }));
  }
})();
