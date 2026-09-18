(() => {

  /* =========================================
     ASHLEY DANIELLE PORTFOLIO
     =========================================
     
     SECTIONS:
     - Recently Added
     - Photo Gallery
     - Video Gallery

     No photos.json or videos.json required.
     ========================================= */


  /* =========================================
     HERO IMAGE
     ========================================= */

  const HERO_PHOTO = "photo1.jpeg";


  /* =========================================
     ALL PHOTOS
     ========================================= */

  const allPhotos = [

    /* photo1 - photo27 */
    ...Array.from(
      { length: 27 },
      (_, i) => `photo${i + 1}.jpeg`
    ),

    /* photo29 - photo38 */
    ...Array.from(
      { length: 10 },
      (_, i) => `photo${i + 29}.jpeg`
    ),

    /* photo300 - photo317 */
    ...Array.from(
      { length: 18 },
      (_, i) => `photo${i + 300}.jpeg`
    ),


    /* NEW PHOTOS */

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


  /* =========================================
     ALL VIDEOS
     ========================================= */

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

    "0918 (1).mp4",

    "copy_EC7B19D9-F53C-478E-BD0C-8F66A7D330F4.mp4"

  ];


  /* =========================================
     RECENTLY ADDED
     
     Put whatever you want featured at the
     top of your site here.
     ========================================= */

  const recentlyAdded = [

    {
      type: "video",
      file: "0918 (1).mp4"
    },

    {
      type: "video",
      file: "copy_EC7B19D9-F53C-478E-BD0C-8F66A7D330F4.mp4"
    },

    {
      type: "image",
      file: "photo4444.jpg"
    },

    {
      type: "image",
      file: "photo333333.jpeg"
    },

    {
      type: "video",
      file: "video23.mp4"
    },

    {
      type: "video",
      file: "video22.mp4"
    },

    {
      type: "image",
      file: "IMG_0045.jpeg"
    },

    {
      type: "image",
      file: "IMG_0413.jpeg"
    }

  ];


  /* =========================================
     POSSIBLE PHOTO LOCATIONS
     ========================================= */

  const PHOTO_PATHS = [

    "photo/folder/",
    "photo/"

  ];


  /* =========================================
     POSSIBLE VIDEO LOCATIONS
     ========================================= */

  const VIDEO_PATHS = [

    "videos/folder/",
    "videos/",
    ""

  ];


  /* =========================================
     PAGE ELEMENTS
     ========================================= */

  const heroImage =
    document.getElementById("heroImage");

  const recentGrid =
    document.getElementById("recentGrid");

  const photoGrid =
    document.getElementById("photoGrid");

  const videoGrid =
    document.getElementById("videoGrid");

  const recentCount =
    document.getElementById("recentCount");

  const photoCount =
    document.getElementById("photoCount");

  const videoCount =
    document.getElementById("videoCount");

  const modal =
    document.getElementById("modal");

  const modalTitle =
    document.getElementById("modalTitle");

  const modalContent =
    document.getElementById("modalContent");

  const closeBtn =
    document.getElementById("closeBtn");


  /* =========================================
     SAFE FILE URL
     ========================================= */

  function safeFilename(filename) {

    return encodeURIComponent(filename)
      .replace(/%2F/g, "/");

  }


  /* =========================================
     PHOTO FALLBACK LOADER
     ========================================= */

  function loadImageWithFallback(
    img,
    filename,
    onFailure
  ) {

    let index = 0;


    function tryNext() {

      if (index >= PHOTO_PATHS.length) {

        if (onFailure) {
          onFailure();
        }

        return;

      }


      img.src =
        PHOTO_PATHS[index]
        +
        safeFilename(filename);


      index++;

    }


    img.onerror = tryNext;

    tryNext();

  }


  /* =========================================
     HERO IMAGE
     ========================================= */

  if (heroImage) {

    loadImageWithFallback(

      heroImage,

      HERO_PHOTO,

      () => {

        console.warn(
          "Hero image not found:",
          HERO_PHOTO
        );

      }

    );

  }


  /* =========================================
     OPEN PHOTO
     ========================================= */

  function openImage(filename) {

    if (!modal || !modalContent) {
      return;
    }


    modalContent.innerHTML = "";


    if (modalTitle) {
      modalTitle.textContent = "Photo";
    }


    const img =
      document.createElement("img");


    img.alt =
      "Portfolio photo";


    loadImageWithFallback(

      img,

      filename,

      () => {

        modalContent.innerHTML = `
          <div class="error">
            Could not load ${filename}
          </div>
        `;

      }

    );


    modalContent.appendChild(img);


    modal.classList.add("open");


    modal.setAttribute(
      "aria-hidden",
      "false"
    );


    document.body.style.overflow =
      "hidden";

  }


  /* =========================================
     OPEN VIDEO
     ========================================= */

  function openVideo(filename) {

    if (!modal || !modalContent) {
      return;
    }


    modalContent.innerHTML = "";


    if (modalTitle) {
      modalTitle.textContent = "Video";
    }


    const video =
      document.createElement("video");


    video.controls = true;

    video.autoplay = true;

    video.playsInline = true;

    video.preload = "metadata";


    let pathIndex = 0;

    let successfullyLoaded = false;


    function tryNextVideo() {

      if (successfullyLoaded) {
        return;
      }


      if (pathIndex >= VIDEO_PATHS.length) {

        modalContent.innerHTML = `
          <div class="error">
            Could not load ${filename}
          </div>
        `;


        console.warn(
          "Video not found:",
          filename
        );


        return;

      }


      video.src =
        VIDEO_PATHS[pathIndex]
        +
        safeFilename(filename);


      pathIndex++;


      video.load();

    }


    video.addEventListener(
      "loadedmetadata",
      () => {

        successfullyLoaded = true;


        video
          .play()
          .catch(() => {});

      }
    );


    video.addEventListener(
      "error",
      () => {

        if (!successfullyLoaded) {
          tryNextVideo();
        }

      }
    );


    modalContent.appendChild(video);


    modal.classList.add("open");


    modal.setAttribute(
      "aria-hidden",
      "false"
    );


    document.body.style.overflow =
      "hidden";


    tryNextVideo();

  }


  /* =========================================
     CLOSE MODAL
     ========================================= */

  function closeModal() {

    if (!modal) {
      return;
    }


    const video =
      modalContent
        ?.querySelector("video");


    if (video) {

      video.pause();

      video.removeAttribute("src");

      video.load();

    }


    modal.classList.remove("open");


    modal.setAttribute(
      "aria-hidden",
      "true"
    );


    if (modalContent) {

      modalContent.innerHTML = "";

    }


    document.body.style.overflow =
      "";

  }


  /* Close button */

  if (closeBtn) {

    closeBtn.addEventListener(
      "click",
      closeModal
    );

  }


  /* Click black background */

  if (modal) {

    modal.addEventListener(
      "click",
      event => {

        if (event.target === modal) {

          closeModal();

        }

      }
    );

  }


  /* Escape key */

  document.addEventListener(
    "keydown",
    event => {

      if (event.key === "Escape") {

        closeModal();

      }

    }
  );


  /* =========================================
     REGULAR PHOTO CARD
     ========================================= */

  function createPhotoCard(filename) {

    const card =
      document.createElement("div");


    card.className =
      "photo-card";


    const img =
      document.createElement("img");


    img.alt =
      "Portfolio photo";


    img.loading =
      "lazy";


    loadImageWithFallback(

      img,

      filename,

      () => {

        console.warn(
          "Photo not found:",
          filename
        );


        card.remove();

      }

    );


    card.appendChild(img);


    card.addEventListener(
      "click",
      () => {

        openImage(filename);

      }
    );


    return card;

  }


  /* =========================================
     REGULAR VIDEO CARD
     ========================================= */

  function createVideoCard(
    filename,
    index
  ) {

    const card =
      document.createElement("div");


    card.className =
      "video-card";


    const play =
      document.createElement("div");


    play.className =
      "play";


    play.textContent =
      "▶";


    const number =
      document.createElement("div");


    number.className =
      "video-number";


    number.textContent =
      String(index + 1)
        .padStart(2, "0");


    card.appendChild(play);

    card.appendChild(number);


    card.addEventListener(
      "click",
      () => {

        openVideo(filename);

      }
    );


    return card;

  }


  /* =========================================
     RECENT PHOTO CARD
     ========================================= */

  function createRecentImage(filename) {

    const card =
      document.createElement("div");


    card.className =
      "feature-card";


    const img =
      document.createElement("img");


    img.alt =
      "Recently added photo";


    img.loading =
      "lazy";


    loadImageWithFallback(

      img,

      filename,

      () => {

        console.warn(
          "Recent photo not found:",
          filename
        );


        card.remove();

      }

    );


    const badge =
      document.createElement("div");


    badge.className =
      "feature-badge";


    badge.textContent =
      "NEW";


    card.appendChild(img);

    card.appendChild(badge);


    card.addEventListener(
      "click",
      () => {

        openImage(filename);

      }
    );


    return card;

  }


  /* =========================================
     RECENT VIDEO CARD
     ========================================= */

  function createRecentVideo(filename) {

    const card =
      document.createElement("div");


    card.className =
      "feature-card feature-video-card";


    const play =
      document.createElement("div");


    play.className =
      "play";


    play.textContent =
      "▶";


    const badge =
      document.createElement("div");


    badge.className =
      "feature-badge";


    badge.textContent =
      "NEW";


    card.appendChild(play);

    card.appendChild(badge);


    card.addEventListener(
      "click",
      () => {

        openVideo(filename);

      }
    );


    return card;

  }


  /* =========================================
     RECENT CARD ROUTER
     ========================================= */

  function createRecentCard(item) {

    if (item.type === "video") {

      return createRecentVideo(
        item.file
      );

    }


    return createRecentImage(
      item.file
    );

  }


  /* =========================================
     FIND ITEMS USED IN RECENTLY ADDED
     ========================================= */

  const recentPhotoNames =
    new Set(

      recentlyAdded

        .filter(
          item =>
            item.type === "image"
        )

        .map(
          item =>
            item.file
        )

    );


  const recentVideoNames =
    new Set(

      recentlyAdded

        .filter(
          item =>
            item.type === "video"
        )

        .map(
          item =>
            item.file
        )

    );


  /* =========================================
     REMOVE RECENT ITEMS FROM REGULAR GALLERY

     This prevents duplicates.
     ========================================= */

  const regularPhotos =
    allPhotos.filter(

      filename =>
        !recentPhotoNames.has(filename)

    );


  const regularVideos =
    allVideos.filter(

      filename =>
        !recentVideoNames.has(filename)

    );


  /* =========================================
     RENDER RECENTLY ADDED
     ========================================= */

  if (recentGrid) {

    recentGrid.innerHTML = "";


    recentlyAdded.forEach(
      item => {

        recentGrid.appendChild(

          createRecentCard(item)

        );

      }
    );

  }


  if (recentCount) {

    recentCount.textContent =
      `${recentlyAdded.length} NEW`;

  }


  /* =========================================
     RENDER PHOTO GALLERY
     ========================================= */

  if (photoGrid) {

    photoGrid.innerHTML = "";


    regularPhotos.forEach(
      filename => {

        photoGrid.appendChild(

          createPhotoCard(filename)

        );

      }
    );

  }


  if (photoCount) {

    photoCount.textContent =
      `${regularPhotos.length} PHOTOS`;

  }


  /* =========================================
     RENDER VIDEO GALLERY
     ========================================= */

  if (videoGrid) {

    videoGrid.innerHTML = "";


    regularVideos.forEach(
      (
        filename,
        index
      ) => {

        videoGrid.appendChild(

          createVideoCard(
            filename,
            index
          )

        );

      }
    );

  }


  if (videoCount) {

    videoCount.textContent =
      `${regularVideos.length} VIDEOS`;

  }


})();
