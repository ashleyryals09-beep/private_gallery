// --- CONFIG ---
const ACCESS_CODE = "ILTWYHM25"; // <-- change this to your real code

// Elements
const gate = document.getElementById("gate");
const app = document.getElementById("app");
const msg = document.getElementById("msg");
const code = document.getElementById("code");
const unlock = document.getElementById("unlock");
const lockBtn = document.getElementById("lock");
const grid = document.getElementById("grid");

let PHOTO_PATHS = [];

// Load list of photos from photos.json (so you don’t edit this file every time)
async function loadPhotoList() {
  const res = await fetch("photos.json", { cache: "no-store" });
  console.log("photos.json status:", res.status);
  if (!res.ok) throw new Error("Could not load photos.json");
  const data = await res.json();
  if (!Array.isArray(data)) throw new Error("photos.json must be an array of strings");
  PHOTO_PATHS = data;
}

function renderGallery() {
  grid.innerHTML = "";
  for (const src of PHOTO_PATHS) {
    const img = document.createElement("img");
    img.loading = "lazy";
    img.src = src;
    img.alt = "Photo";
    img.addEventListener("click", () => window.open(src, "_blank"));
    grid.appendChild(img);
  }
}

function setUnlocked(on) {
  if (on) {
    gate.classList.add("hidden");
    app.classList.remove("hidden");
    localStorage.setItem("gallery_unlocked", "1");
    renderGallery();
  } else {
    app.classList.add("hidden");
    gate.classList.remove("hidden");
    localStorage.removeItem("gallery_unlocked");
    code.value = "";
  }
}

unlock.addEventListener("click", async () => {
  msg.textContent = "";

  if (code.value !== ACCESS_CODE) {
    msg.textContent = "Wrong code.";
    return;
  }

  try {
    await loadPhotoList();
    setUnlocked(true);
  } catch (e) {
    console.error(e);
    msg.textContent = "Could not load photos.json. Check file name & location.";
  }
});

code.addEventListener("keydown", (e) => {
  if (e.key === "Enter") unlock.click();
});

lockBtn.addEventListener("click", () => setUnlocked(false));

// auto-unlock if previously unlocked on this device
(async function boot() {
  if (localStorage.getItem("gallery_unlocked") === "1") {
    try {
      await loadPhotoList();
      setUnlocked(true);
    } catch (e) {
      console.error(e);
      setUnlocked(false);
    }
  }
})();