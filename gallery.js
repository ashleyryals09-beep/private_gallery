(async function () {
  const photoGrid = document.getElementById("photoGrid");
  const videoGrid = document.getElementById("videoGrid");
  const photoCount = document.getElementById("photoCount");
  const videoCount = document.getElementById("videoCount");

  // If your HTML doesn't have these IDs, nothing will render.
  if (!photoGrid || !videoGrid) {
    console.error("Missing #photoGrid or #videoGrid in index.html");
    return;
  }

  // Basic card builder
  function makeCard({ type, src, title }) {
    const card = document.createElement("div");
    card.className = "card";

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

  // Modal (optional; if you don’t have it in HTML, it will still show grids)
  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modalTitle");
  const modalContent = document.getElementById("modalContent");
  const closeBtn = document.getElementById("closeBtn");

  function openModal(type, src, title) {
    if (!modal || !modalTitle || !modalContent) return;

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
  }

  function closeModal() {
    if (!modal || !modalContent) return;
    modal.classList.remove("open");
    modalContent.innerHTML = "";
  }

  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // ---- Load JSON ----
  async function fetchJson(path) {
    const res = await fetch(path, { cache: "no-store" });
    if (!res.ok) throw new Error(`${path} HTTP ${res.status}`);
    return res.json();
  }

  let data;
  try {
    data = await fetchJson("photos.json");
  } catch (e) {
    console.error("Failed to load photos.json:", e);
    photoGrid.innerHTML = `<div class="error">Could not load photos.json</div>`;
    return;
  }

  // Support BOTH formats:
  // 1) Array: ["photo/photo1.jpeg", ...]
  // 2) Manifest: { photos: [...], videos: [...] }
  let photos = [];
  let videos = [];

  if (Array.isArray(data)) {
    photos = data;
  } else {
    photos = Array.isArray(data.photos) ? data.photos : [];
    videos = Array.isArray(data.videos) ? data.videos : [];
  }

  // If you keep videos separate, try loading videos.json too (optional)
  if (videos.length === 0) {
    try {
      const v = await fetchJson("videos.json");
      if (Array.isArray(v)) videos = v;
    } catch (_) {
      // ok if videos.json doesn't exist yet
    }
  }

  // ---- Auto-fix your folder paths ----
  // Your repo has: photo/folder/* and videos/folder/*
  // Your JSON currently has: photo/photo1.jpeg etc.
  function fixPath(p) {
    // normalize slashes and trim
    p = String(p || "").trim();
    if (!p) return p;

    // photo paths
    if (p.startsWith("photo/") && !p.startsWith("photo/folder/")) {
      p = p.replace(/^photo\//, "photo/folder/");
    }

    // video paths
    if (p.startsWith("videos/") && !p.startsWith("videos/folder/")) {
      p = p.replace(/^videos\//, "videos/folder/");
    }

    return p;
  }

  photos = photos.map(fixPath);
  videos = videos.map(fixPath);

  // ---- Render ----
  photoGrid.innerHTML = "";
  videoGrid.innerHTML = "";

  if (photoCount) photoCount.textContent = `${photos.length}`;
  if (videoCount) videoCount.textContent = `${videos.length}`;

  for (const p of photos) {
    const title = p.split("/").pop();
    photoGrid.appendChild(makeCard({ type: "image", src: p, title }));
  }

  for (const v of videos) {
    const title = v.split("/").pop();
    videoGrid.appendChild(makeCard({ type: "video", src: v, title }));
  }
})();
