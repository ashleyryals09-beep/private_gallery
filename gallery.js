(async function () {
  const photoGrid = document.getElementById("photoGrid");
  const videoGrid = document.getElementById("videoGrid");
  const photoCount = document.getElementById("photoCount");
  const videoCount = document.getElementById("videoCount");

  function showError(whereEl, msg) {
    if (!whereEl) return;
    whereEl.innerHTML = `<div class="error">${msg}</div>`;
  }

  if (!photoGrid || !videoGrid) {
    console.error("Missing #photoGrid or #videoGrid in index.html");
    return;
  }

  // ---------- Modal (optional) ----------
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

  // ---------- UI cards ----------
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

  // ---------- Load JSON helpers ----------
  async function fetchJson(path) {
    const res = await fetch(path, { cache: "no-store" });
    if (!res.ok) throw new Error(`${path} HTTP ${res.status}`);
    return res.json();
  }

  async function urlWorks(url) {
    // HEAD is fast, but some hosts can be picky — fallback to GET for images if needed.
    try {
      const r = await fetch(url, { method: "HEAD", cache: "no-store" });
      if (r.ok) return true;
    } catch (_) {}

    // Lightweight fallback: try GET but don’t keep the body
    try {
      const r = await fetch(url, { method: "GET", cache: "no-store" });
      return r.ok;
    } catch (_) {
      return false;
    }
  }

  function tryMapPath(p, variant) {
    // variant: "addFolder" or "removeFolder"
    if (variant === "addFolder") {
      if (p.startsWith("photo/") && !p.startsWith("photo/folder/")) {
        return p.replace(/^photo\//, "photo/folder/");
      }
      if (p.startsWith("videos/") && !p.startsWith("videos/folder/")) {
        return p.replace(/^videos\//, "videos/folder/");
      }
    } else if (variant === "removeFolder") {
      if (p.startsWith("photo/folder/")) {
        return p.replace(/^photo\/folder\//, "photo/");
      }
      if (p.startsWith("videos/folder/")) {
        return p.replace(/^videos\/folder\//, "videos/");
      }
    }
    return p;
  }

  async function resolvePaths(list, kind) {
    // kind is "photo" or "video" (used for logging only)
    if (!Array.isArray(list) || list.length === 0) return [];

    const sample = String(list[0]).trim();
    if (!sample) return list;

    // Test the sample "as-is"
    if (await urlWorks(sample)) return list;

    // If it fails, try adding "/folder/"
    const addFolderSample = tryMapPath(sample, "addFolder");
    if (addFolderSample !== sample && (await urlWorks(addFolderSample))) {
      return list.map((p) => tryMapPath(String(p).trim(), "addFolder"));
    }

    // Try removing "/folder/" if it exists
    const removeFolderSample = tryMapPath(sample, "removeFolder");
    if (removeFolderSample !== sample && (await urlWorks(removeFolderSample))) {
      return list.map((p) => tryMapPath(String(p).trim(), "removeFolder"));
    }

    console.warn(`Could not resolve ${kind} path style. Leaving as-is. Sample:`, sample);
    return list;
  }

  // ---------- Load photos + videos ----------
  let photos = [];
  let videos = [];

  try {
    const pData = await fetchJson("photos.json");
    photos = Array.isArray(pData) ? pData : (pData.photos || []);
  } catch (e) {
    console.error(e);
    showError(photoGrid, "Could not load photos.json (check filename + GitHub Pages URL).");
    return;
  }

  try {
    const vData = await fetchJson("videos.json");
    videos = Array.isArray(vData) ? vData : (vData.videos || []);
  } catch (e) {
    // videos.json optional — don’t hard-fail
    console.warn("videos.json not found or unreadable:", e);
    videos = [];
  }

  photos = await resolvePaths(photos, "photo");
  videos = await resolvePaths(videos, "video");

  // ---------- Render ----------
  photoGrid.innerHTML = "";
  videoGrid.innerHTML = "";

  if (photoCount) photoCount.textContent = `${photos.length}`;
  if (videoCount) videoCount.textContent = `${videos.length}`;

  if (photos.length === 0) {
    showError(photoGrid, "No photos found in photos.json (or paths are wrong).");
  } else {
    for (const p of photos) {
      const src = String(p).trim();
      if (!src) continue;
      const title = src.split("/").pop();
      photoGrid.appendChild(makeCard({ type: "image", src, title }));
    }
  }

  if (videos.length === 0) {
    // Optional: leave empty, or show a message
    // showError(videoGrid, "No videos found (add videos.json).");
  } else {
    for (const v of videos) {
      const src = String(v).trim();
      if (!src) continue;
      const title = src.split("/").pop();
      videoGrid.appendChild(makeCard({ type: "video", src, title }));
    }
  }
})();
