(() => {

  /* =========================================
     ASHLEY DANIELLE PORTFOLIO
     =========================================

     IMPORTANT:

     This website does NOT use photos.json
     or videos.json.

     To change what appears in Recently Added
     or Special Edition, edit the lists below.
     ========================================= */


  /* =========================================
     HERO IMAGE
     ========================================= */

  const HERO_PHOTO = "photo1.jpeg";


  /* =========================================
     ALL PHOTO FILES

     Current files based on your collection.
     photo28.jpeg was NOT in your original list.
     ========================================= */

  const allPhotos = [

    ...Array.from(
      { length: 27 },
      (_, i) => `photo${i + 1}.jpeg`
    ),

    ...Array.from(
      { length: 10 },
      (_, i) => `photo${i + 29}.jpeg`
    ),

    ...Array.from(
      { length: 18 },
      (_, i) => `photo${i + 300}.jpeg`
    )

  ];



  /* =========================================
     ALL VIDEO FILES
     ========================================= */

  const allVideos = Array.from(
    { length: 13 },
    (_, i) => `video${i + 1}.mp4`
  );



  /* =========================================
     RECENTLY ADDED

     Put the newest content here.

     type can be:
     "image"
     or
     "video"
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
      type: "video",
      file: "video13.mp4"
    },

    {
      type: "image",
      file: "photo315.jpeg"
    }

  ];



  /* =========================================
     SPECIAL / EXCLUSIVE

     These will NOT also appear in the
     normal photo/video gallery.
     ========================================= */

 



  /* =========================================
     POSSIBLE FOLDER LOCATIONS

     Your old JSON showed:
     photo/folder/photo1.jpeg

     But this also supports:
     photo/photo1.jpeg

     Videos support:
     videos/folder/video1.mp4
     videos/video1.mp4
     ========================================= */

  const PHOTO_PATHS = [

    "photo/folder/",

    "photo/"

  ];


  const VIDEO_PATHS = [

    "videos/folder/",

    "videos/",

    ""

  ];



  /* =========================================
     DOM ELEMENTS
     ========================================= */

  const heroImage =
    document.getElementById("heroImage");


  const recentGrid =
    document.getElementById("recentGrid");


  const specialGrid =
    document.getElementById("specialGrid");


  const photoGrid =
    document.getElementById("photoGrid");


  const videoGrid =
    document.getElementById("videoGrid");


  const recentCount =
    document.getElementById("recentCount");


  const specialCount =
    document.getElementById("specialCount");


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
     IMAGE FALLBACK LOADER

     Automatically tries both:

     photo/folder/
     photo/
     ========================================= */

  function loadImageWithFallback(
    img,
    filename,
    onFailure
  ) {

    let index = 0;


    function tryNext() {

      if (
        index >=
        PHOTO_PATHS.length
      ) {

        if (onFailure) {

          onFailure();

        }

        return;

      }


      img.src =
        PHOTO_PATHS[index]
        +
        filename;


      index++;

    }


    img.onerror = tryNext;


    tryNext();

  }



  /* =========================================
     HERO
     ========================================= */

  if (heroImage) {

    loadImageWithFallback(
      heroImage,
      HERO_PHOTO,
      () => {

        console.warn(
          "Hero image could not be found."
        );

      }
    );

  }



  /* =========================================
     OPEN IMAGE
     ========================================= */

  function openImage(
    filename
  ) {

    if (
      !modal ||
      !modalContent
    ) {

      return;

    }


    modalContent.innerHTML =
      "";


    modalTitle.textContent =
      filename;


    const img =
      document.createElement("img");


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


    modalContent.appendChild(
      img
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

  }



  /* =========================================
     OPEN VIDEO
     ========================================= */

  function openVideo(
    filename
  ) {

    if (
      !modal ||
      !modalContent
    ) {

      return;

    }


    modalContent.innerHTML =
      "";


    modalTitle.textContent =
      filename;


    const video =
      document.createElement("video");


    video.controls =
      true;


    video.autoplay =
      true;


    video.playsInline =
      true;


    video.preload =
      "metadata";


    let index =
      0;


    function tryNextVideo() {

      if (
        index >=
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
        VIDEO_PATHS[index]
        +
        filename;


      index++;


      video.load();

    }


    video.addEventListener(
      "error",
      tryNextVideo
    );


    video.addEventListener(
      "loadedmetadata",
      () => {

        video
          .play()
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


    if (modalContent) {

      modalContent.innerHTML =
        "";

    }


    document.body.style.overflow =
      "";

  }



  if (closeBtn) {

    closeBtn.addEventListener(
      "click",
      closeModal
    );

  }



  if (modal) {

    modal.addEventListener(
      "click",
      event => {

        if (
          event.target ===
          modal
        ) {

          closeModal();

        }

      }
    );

  }



  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key ===
        "Escape"
      ) {

        closeModal();

      }

    }
  );



  /* =========================================
     NORMAL PHOTO CARD
     ========================================= */

  function createPhotoCard(
    filename
  ) {

    const card =
      document.createElement("div");


    card.className =
      "photo-card";


    const img =
      document.createElement("img");


    img.alt =
      "";


    img.loading =
      "lazy";


    loadImageWithFallback(
      img,
      filename,
      () => {

        card.remove();

      }
    );


    card.appendChild(
      img
    );


    card.addEventListener(
      "click",
      () => {

        openImage(
          filename
        );

      }
    );


    return card;

  }



  /* =========================================
     NORMAL VIDEO CARD
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


    card.appendChild(
      play
    );


    card.appendChild(
      number
    );


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



  /* =========================================
     FEATURE IMAGE CARD
     ========================================= */

  function createFeatureImage(
    filename,
    badge
  ) {

    const card =
      document.createElement("div");


    card.className =
      "feature-card";


    const img =
      document.createElement("img");


    img.alt =
      "";


    img.loading =
      "lazy";


    loadImageWithFallback(
      img,
      filename,
      () => {

        card.remove();

      }
    );


    const badgeElement =
      document.createElement("div");


    badgeElement.className =
      "feature-badge";


    badgeElement.textContent =
      badge;


    card.appendChild(
      img
    );


    card.appendChild(
      badgeElement
    );


    card.addEventListener(
      "click",
      () => {

        openImage(
          filename
        );

      }
    );


    return card;

  }



  /* =========================================
     FEATURE VIDEO CARD
     ========================================= */

  function createFeatureVideo(
    filename,
    badge
  ) {

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


    const badgeElement =
      document.createElement("div");


    badgeElement.className =
      "feature-badge";


    badgeElement.textContent =
      badge;


    card.appendChild(
      play
    );


    card.appendChild(
      badgeElement
    );


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



  /* =========================================
     FEATURE CARD ROUTER
     ========================================= */

  function createFeatureCard(
    item,
    badge
  ) {

    if (
      item.type ===
      "video"
    ) {

      return createFeatureVideo(
        item.file,
        badge
      );

    }


    return createFeatureImage(
      item.file,
      badge
    );

  }



  /* =========================================
     KEEP SPECIAL + RECENT ITEMS
     OUT OF REGULAR GALLERIES
     ========================================= */

  const featuredPhotoNames =
    new Set(

      [
        ...recentlyAdded,
        ...specialContent
      ]

        .filter(
          item =>
            item.type ===
            "image"
        )

        .map(
          item =>
            item.file
        )

    );


  const featuredVideoNames =
    new Set(

      [
        ...recentlyAdded,
        ...specialContent
      ]

        .filter(
          item =>
            item.type ===
            "video"
        )

        .map(
          item =>
            item.file
        )

    );



  const regularPhotos =
    allPhotos.filter(
      filename =>
        !featuredPhotoNames
          .has(filename)
    );


  const regularVideos =
    allVideos.filter(
      filename =>
        !featuredVideoNames
          .has(filename)
    );



  /* =========================================
     RENDER RECENTLY ADDED
     ========================================= */

  if (recentGrid) {

    recentGrid.innerHTML =
      "";


    recentlyAdded.forEach(
      item => {

        recentGrid.appendChild(

          createFeatureCard(
            item,
            "NEW"
          )

        );

      }
    );

  }



  if (recentCount) {

    recentCount.textContent =
      `${recentlyAdded.length} NEW`;

  }



  /* =========================================
     RENDER SPECIAL
     ========================================= */

  if (specialGrid) {

    specialGrid.innerHTML =
      "";


    specialContent.forEach(
      item => {

        specialGrid.appendChild(

          createFeatureCard(
            item,
            "EXCLUSIVE"
          )

        );

      }
    );

  }



  if (specialCount) {

    specialCount.textContent =
      `${specialContent.length} EXCLUSIVE`;

  }



  /* =========================================
     RENDER NORMAL PHOTOS
     ========================================= */

  if (photoGrid) {

    photoGrid.innerHTML =
      "";


    regularPhotos.forEach(
      filename => {

        photoGrid.appendChild(

          createPhotoCard(
            filename
          )

        );

      }
    );

  }



  if (photoCount) {

    photoCount.textContent =
      `${regularPhotos.length} PHOTOS`;

  }



  /* =========================================
     RENDER NORMAL VIDEOS
     ========================================= */

  if (videoGrid) {

    videoGrid.innerHTML =
      "";


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
