document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* =====================================================
     PRIVATE GALLERY
     Sections: Recently Added, Photos, Videos
     No photos.json or videos.json required.
     ===================================================== */

  const HERO_PHOTO = "IMG_1040.jpg";

  const allPhotos = [
    ...Array.from({ length: 27 }, (_, i) => `photo${i + 1}.jpeg`),
    ...Array.from({ length: 10 }, (_, i) => `photo${i + 29}.jpeg`),
    ...Array.from({ length: 18 }, (_, i) => `photo${i + 300}.jpeg`),
    "IMG_0045.jpeg",
    "IMG_0413.jpeg",
    "IMG_0607.jpeg",
    "IMG_0824.jpeg",
    "IMG_0833.jpeg",
    "IMG_1040.jpg",
    "IMG_1444.jpeg",
    "IMG_1512.jpeg",
    "IMG_1687.jpeg",
    "IMG_3612.jpeg",
    "Unknown-6.jpg",
    "photo4444.jpg",
    "photo333333.jpeg"
  ];

  const allVideos = [
    "video1.mp4",
    "video2.mp4",
    "video3.mp4",
    "video4.mp4",
    "video5.mp4",
    "video6.mp4",
    "video7.mp4",
    "video8.mp4",
    "video9.mp4",
    "video10.mp4",
    "video11.mp4",
    "video12.mp4",
    "video13.mp4",
    "video20.mp4",
    "video21.mp4",
    "video22.mp4",
    "video23.mp4",
   
  ];

  /* Change only this list when you want to change Recently Added. */
  const recentlyAdded = [
    { type: "image", file: "photo4444.jpg" },
    { type: "image", file: "photo333333.jpeg" },
    { type: "video", file: "video23.mp4" },
    { type: "video", file: "video22.mp4" },
    { type: "image", file: "IMG_0045.jpeg" },
    { type: "image", file: "IMG_0413.jpeg" }
  ];

  /* Your older repo structure used /folder/. The second path supports
     files placed directly inside photo/ and videos/. */
  const PHOTO_PATHS = ["photo/folder/", "photo/"];
  const VIDEO_PATHS = ["videos/folder/", "videos/", ""];

  const heroImage = document.getElementById("heroImage");
  const recentGrid = document.getElementById("recentGrid");
  const photoGrid = document.getElementById("photoGrid");
  const videoGrid = document.getElementById("videoGrid");
  const recentCount = document.getElementById("recentCount");
  const photoCount = document.getElementById("photoCount");
  const videoCount = document.getElementById("videoCount");
  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modalTitle");
  const modalContent = document.getElementById("modalContent");
  const closeBtn = document.getElementById("closeBtn");

  function encoded(filename) {
    return encodeURIComponent(filename);
  }

  function tryImagePaths(img, filename, onFailure) {
    let i = 0;

    function next() {
      if (i >= PHOTO_PATHS.length) {
        img.onerror = null;
        if (onFailure) onFailure();
        return;
      }
      img.src = PHOTO_PATHS[i++] + encoded(filename);
    }

    img.onerror = next;
    next();
  }

  function openModal() {
    if (!modal) return;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    if (!modal) return;

    const playingVideo = modalContent ? modalContent.querySelector("video") : null;
    if (playingVideo) {
      playingVideo.pause();
      playingVideo.removeAttribute("src");
      playingVideo.load();
    }

    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    if (modalContent) modalContent.innerHTML = "";
    document.body.style.overflow = "";
  }

  function openImage(filename) {
    if (!modalContent) return;
    modalContent.innerHTML = "";
    if (modalTitle) modalTitle.textContent = "PHOTO";

    const img = document.createElement("img");
    img.alt = "Portfolio photo";
    tryImagePaths(img, filename, () => {
      modalContent.innerHTML = `<div class="error">Could not load ${filename}</div>`;
    });

    modalContent.appendChild(img);
    openModal();
  }

  function openVideo(filename) {
    if (!modalContent) return;
    modalContent.innerHTML = "";
    if (modalTitle) modalTitle.textContent = "VIDEO";

    const video = document.createElement("video");
    video.controls = true;
    video.autoplay = true;
    video.playsInline = true;
    video.preload = "metadata";

    let i = 0;
    let loaded = false;

    function next() {
      if (loaded) return;
      if (i >= VIDEO_PATHS.length) {
        modalContent.innerHTML = `<div class="error">Could not load ${filename}</div>`;
        return;
      }
      video.src = VIDEO_PATHS[i++] + encoded(filename);
      video.load();
    }

    video.addEventListener("loadedmetadata", () => {
      loaded = true;
      video.play().catch(() => {});
    });

    video.addEventListener("error", () => {
      if (!loaded) next();
    });

    modalContent.appendChild(video);
    openModal();
    next();
  }

  function createPhotoCard(filename) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "photo-card";
    card.setAttribute("aria-label", "Open photo");

    const img = document.createElement("img");
    img.alt = "Portfolio photo";
    img.loading = "lazy";

    tryImagePaths(img, filename, () => card.remove());
    card.appendChild(img);
    card.addEventListener("click", () => openImage(filename));
    return card;
  }

  function createVideoCard(filename, index) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "video-card";
    card.setAttribute("aria-label", `Play video ${index + 1}`);

    const play = document.createElement("span");
    play.className = "play";
    play.textContent = "▶";

    const number = document.createElement("span");
    number.className = "video-number";
    number.textContent = String(index + 1).padStart(2, "0");

    card.append(play, number);
    card.addEventListener("click", () => openVideo(filename));
    return card;
  }

  function createRecentCard(item) {
    if (item.type === "video") {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "feature-card feature-video-card";
      card.setAttribute("aria-label", "Play recently added video");

      const play = document.createElement("span");
      play.className = "play";
      play.textContent = "▶";

      const badge = document.createElement("span");
      badge.className = "feature-badge";
      badge.textContent = "NEW";

      card.append(play, badge);
      card.addEventListener("click", () => openVideo(item.file));
      return card;
    }

    const card = document.createElement("button");
    card.type = "button";
    card.className = "feature-card";
    card.setAttribute("aria-label", "Open recently added photo");

    const img = document.createElement("img");
    img.alt = "Recently added photo";
    img.loading = "lazy";
    tryImagePaths(img, item.file, () => card.remove());

    const badge = document.createElement("span");
    badge.className = "feature-badge";
    badge.textContent = "NEW";

    card.append(img, badge);
    card.addEventListener("click", () => openImage(item.file));
    return card;
  }

  try {
    if (!recentGrid || !photoGrid || !videoGrid) {
      throw new Error("Gallery containers are missing from index.html.");
    }

    if (heroImage) {
      tryImagePaths(heroImage, HERO_PHOTO, () => {
        heroImage.style.display = "none";
      });
    }

    const recentPhotoNames = new Set(
      recentlyAdded.filter(item => item.type === "image").map(item => item.file)
    );
    const recentVideoNames = new Set(
      recentlyAdded.filter(item => item.type === "video").map(item => item.file)
    );

    const regularPhotos = allPhotos.filter(name => !recentPhotoNames.has(name));
    const regularVideos = allVideos.filter(name => !recentVideoNames.has(name));

    recentGrid.replaceChildren(...recentlyAdded.map(createRecentCard));
    photoGrid.replaceChildren(...regularPhotos.map(createPhotoCard));
    videoGrid.replaceChildren(...regularVideos.map(createVideoCard));

    if (recentCount) recentCount.textContent = `${recentlyAdded.length} NEW`;
    if (photoCount) photoCount.textContent = `${regularPhotos.length} PHOTOS`;
    if (videoCount) videoCount.textContent = `${regularVideos.length} VIDEOS`;

    document.documentElement.classList.add("gallery-ready");
    console.log("Private Gallery loaded", {
      recent: recentlyAdded.length,
      photos: regularPhotos.length,
      videos: regularVideos.length
    });
  } catch (error) {
    console.error("Gallery error:", error);
    if (recentGrid) {
      recentGrid.innerHTML = `<div class="error">Gallery error: ${error.message}</div>`;
    }
  }

  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (modal) {
    modal.addEventListener("click", event => {
      if (event.target === modal) closeModal();
    });
  }
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeModal();
  });
});
