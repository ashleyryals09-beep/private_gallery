(() => {

  /* ==========================================
     ASHLEY DANIELLE GALLERY
     No JSON files required
     ========================================== */

  const photoGrid = document.getElementById("photoGrid");
  const videoGrid = document.getElementById("videoGrid");

  const photoCount = document.getElementById("photoCount");
  const videoCount = document.getElementById("videoCount");

  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modalTitle");
  const modalContent = document.getElementById("modalContent");
  const closeBtn = document.getElementById("closeBtn");


  /* ==========================================
     YOUR PHOTO FILENAMES
     ========================================== */

  const photoFiles = [

    // photo1.jpeg through photo27.jpeg
    ...Array.from(
      { length: 27 },
      (_, i) => `photo${i + 1}.jpeg`
    ),

    // photo29.jpeg through photo38.jpeg
    ...Array.from(
      { length: 10 },
      (_, i) => `photo${i + 29}.jpeg`
    ),

    // photo300.jpeg through photo317.jpeg
    ...Array.from(
      { length: 18 },
      (_, i) => `photo${i + 300}.jpeg`
    )

  ];


  /* ==========================================
     YOUR VIDEO FILENAMES
     ========================================== */

  const videoFiles = Array.from(
    { length: 13 },
    (_, i) => `video${i + 1}.mp4`
  );


  /* ==========================================
     POSSIBLE FOLDER LOCATIONS

     Your old JSON says:
     photo/folder/photo1.jpeg

     This script ALSO tries:
     photo/photo1.jpeg

     So either structure can work.
     ========================================== */

  const PHOTO_PATHS = [
    "photo/folder/",
    "photo/"
  ];

  const VIDEO_PATHS = [
    "videos/folder/",
    "videos/",
    ""
  ];


  /* ==========================================
     PHOTO CARDS
     ========================================== */

  function createPhotoCard(filename) {

    const card = document.createElement("div");
    card.className = "card";

    const thumb = document.createElement("div");
    thumb.className = "thumb";

    const img = document.createElement("img");

    img.alt = "";
    img.loading = "lazy";

    let pathIndex = 0;


    // Try first folder location
    img.src = PHOTO_PATHS[pathIndex] + filename;


    // If image isn't there, automatically
    // try the next possible folder
    img.onerror = function () {

      pathIndex++;

      if (pathIndex < PHOTO_PATHS.length) {

        img.src =
          PHOTO_PATHS[pathIndex] +
          filename;

      } else {

        console.warn(
          "Could not find:",
          filename
        );

        card.remove();

      }

    };


    thumb.appendChild(img);


    /* filename label */

    const label = document.createElement("div");

    label.className = "label";

    label.textContent = filename;


    card.appendChild(thumb);
    card.appendChild(label);


    /* Open large image */

    card.addEventListener(
      "click",
      () => {

        openImage(
          img.src,
          filename
        );

      }
    );


    return card;

  }



  /* ==========================================
     VIDEO CARDS
     ========================================== */

  function createVideoCard(filename) {

    const card =
      document.createElement("div");

    card.className =
      "card";


    const thumb =
      document.createElement("div");

    thumb.className =
      "thumb";


    const poster =
      document.createElement("div");

    poster.className =
      "videoPoster";


    poster.innerHTML = `
      <span class="play">▶</span>
    `;


    thumb.appendChild(poster);


    const label =
      document.createElement("div");

    label.className =
      "label";

    label.textContent =
      filename;


    card.appendChild(thumb);
    card.appendChild(label);


    card.addEventListener(
      "click",
      () => {

        openVideo(
          filename
        );

      }
    );


    return card;

  }



  /* ==========================================
     OPEN IMAGE
     ========================================== */

  function openImage(src, title) {

    if (!modal) return;


    modalTitle.textContent =
      title || "Preview";


    modalContent.innerHTML =
      "";


    const img =
      document.createElement("img");


    img.src =
      src;

    img.alt =
      "";


    modalContent.appendChild(img);


    modal.classList.add(
      "open"
    );


    modal.setAttribute(
      "aria-hidden",
      "false"
    );


    document.body.style.overflow =
      "hidden";

  }



  /* ==========================================
     OPEN VIDEO WITH AUTOMATIC PATH FALLBACK
     ========================================== */

  function openVideo(filename) {

    if (!modal) return;


    modalTitle.textContent =
      filename;


    modalContent.innerHTML =
      "";


    const video =
      document.createElement("video");


    video.controls =
      true;

    video.playsInline =
      true;

    video.autoplay =
      true;

    video.preload =
      "metadata";


    let pathIndex =
      0;


    function tryVideo() {

      if (
        pathIndex >=
        VIDEO_PATHS.length
      ) {

        modalContent.innerHTML = `
          <div class="error">
            Could not load ${filename}
          </div>
        `;

        return;

      }


      video.src =
        VIDEO_PATHS[pathIndex] +
        filename;


      video.load();

    }


    video.addEventListener(
      "error",
      () => {

        pathIndex++;

        tryVideo();

      }
    );


    video.addEventListener(
      "loadedmetadata",
      () => {

        video.play()
          .catch(() => {});

      }
    );


    modalContent.appendChild(
      video
    );


    modal.classList.add(
      "open"
    );


    modal.setAttribute(
      "aria-hidden",
      "false"
    );


    document.body.style.overflow =
      "hidden";


    tryVideo();

  }



  /* ==========================================
     CLOSE MODAL
     ========================================== */

  function closeModal() {

    if (!modal) return;


    const video =
      modalContent.querySelector(
        "video"
      );


    if (video) {

      video.pause();

      video.removeAttribute(
        "src"
      );

      video.load();

    }


    modal.classList.remove(
      "open"
    );


    modal.setAttribute(
      "aria-hidden",
      "true"
    );


    modalContent.innerHTML =
      "";


    document.body.style.overflow =
      "";

  }



  /* ==========================================
     CLOSE BUTTON
     ========================================== */

  if (closeBtn) {

    closeBtn.addEventListener(
      "click",
      closeModal
    );

  }



  /* Click dark background to close */

  if (modal) {

    modal.addEventListener(
      "click",
      (event) => {

        if (
          event.target === modal
        ) {

          closeModal();

        }

      }
    );

  }



  /* ESC key closes preview */

  document.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key === "Escape"
      ) {

        closeModal();

      }

    }
  );



  /* ==========================================
     RENDER PHOTOS
     ========================================== */

  photoGrid.innerHTML =
    "";


  photoFiles.forEach(
    filename => {

      photoGrid.appendChild(
        createPhotoCard(filename)
      );

    }
  );


  /* ==========================================
     RENDER VIDEOS
     ========================================== */

  videoGrid.innerHTML =
    "";


  videoFiles.forEach(
    filename => {

      videoGrid.appendChild(
        createVideoCard(filename)
      );

    }
  );



  /* ==========================================
     COUNTS
     ========================================== */

  if (photoCount) {

    photoCount.textContent =
      `${photoFiles.length} PHOTOS`;

  }


  if (videoCount) {

    videoCount.textContent =
      `${videoFiles.length} VIDEOS`;

  }


})();
