console.log("app.js loaded ✅");

// ---------------------------
// Bring-to-front (z-index)
// ---------------------------
let topZ = 20;

function bringToFront(winEl) {
  topZ += 1;
  winEl.style.zIndex = String(topZ);
}

// ---------------------------
// Open / close windows
// ---------------------------
const openBtns = Array.from(document.querySelectorAll("[data-open]"));
const closeBtns = Array.from(document.querySelectorAll("[data-close]"));

openBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const sel = btn.dataset.open;       // e.g. "#winDigital"
    const win = document.querySelector(sel);
    if (!win) return;

    win.classList.add("is-open");
    win.setAttribute("aria-hidden", "false");
    bringToFront(win);
  });
});

closeBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const sel = btn.dataset.close;      // e.g. "#winDigital"
    const win = document.querySelector(sel);
    if (!win) return;

    win.classList.remove("is-open");
    win.setAttribute("aria-hidden", "true");
  });
});

// Click window anywhere -> bring to front
document.querySelectorAll(".win").forEach((win) => {
  win.addEventListener("mousedown", () => bringToFront(win));
});

// Esc closes the top-most open window (optional simple version)
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  const openWins = Array.from(document.querySelectorAll(".win.is-open"));
  if (!openWins.length) return;

  // close the one with the highest z-index
  openWins.sort((a, b) => (Number(a.style.zIndex || 0) - Number(b.style.zIndex || 0)));
  const top = openWins[openWins.length - 1];
  top.classList.remove("is-open");
  top.setAttribute("aria-hidden", "true");
});

// ---------------------------
// Dragging
// ---------------------------
let dragState = null;

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

document.querySelectorAll(".win").forEach((win) => {
  const handle = win.querySelector("[data-drag-handle]");
  if (!handle) return;

  handle.addEventListener("mousedown", (e) => {
    // Only left click
    if (e.button !== 0) return;

    bringToFront(win);

    const rect = win.getBoundingClientRect();
    dragState = {
      win,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
    };

    // Make sure it doesn't "select" text while dragging
    e.preventDefault();
  });
});

document.addEventListener("mousemove", (e) => {
  if (!dragState) return;

  const { win, offsetX, offsetY } = dragState;

  const maxLeft = window.innerWidth - win.offsetWidth;
  const maxTop = window.innerHeight - win.offsetHeight;

  const left = clamp(e.clientX - offsetX, 0, Math.max(0, maxLeft));
  const top = clamp(e.clientY - offsetY, 0, Math.max(0, maxTop));

  win.style.left = `${left}px`;
  win.style.top = `${top}px`;
});

document.addEventListener("mouseup", () => {
  dragState = null;
});

// ---------------------------
// Fullscreen Image Viewer
// ---------------------------

function openImageViewer(art) {
  const viewer = document.createElement("div");
  viewer.className = "image-viewer";

  viewer.innerHTML = `
    <div class="viewer-backdrop"></div>
    <div class="viewer-content">
      <img src="${art.thumbnail}" alt="${art.title}">
      <p>${art.title}</p>
    </div>
  `;

  viewer.addEventListener("click", () => {
    viewer.remove();
  });

  document.body.appendChild(viewer);
}

// ---------------------------
// Load artworks into grids
// ---------------------------
const DATA_URL = "./data/artworks.json";
const digitalGrid = document.getElementById("digitalGrid");
const paperGrid = document.getElementById("paperGrid");

function makeArtCard(art) {
  const card = document.createElement("div");
  card.className = "art-card";

  card.innerHTML = `
    <div class="art-thumb">
      <img src="${art.thumbnail}" alt="${art.title}" loading="lazy">
    </div>
    <div class="art-caption">${art.title}</div>
  `;

  card.addEventListener("click", () => {
    openImageViewer(art);
  });

  return card;
}

async function loadArtworks() {
  try {
    const res = await fetch(DATA_URL);
    if (!res.ok) throw new Error("Could not load artworks.json");
    const artworks = await res.json();

    const digital = artworks.filter(a => a.type === "digital");
    const paper = artworks.filter(a => a.type === "paper");

    if (digitalGrid) {
      digitalGrid.innerHTML = "";
      digital.forEach(a => digitalGrid.appendChild(makeArtCard(a)));
    }

    if (paperGrid) {
      paperGrid.innerHTML = "";
      paper.forEach(a => paperGrid.appendChild(makeArtCard(a)));
    }
  } catch (err) {
    console.error("Error loading artworks:", err);
  }
}

loadArtworks();
function closeWindow(win) {
  win.classList.add("is-closing");

  const onDone = () => {
    win.classList.remove("is-open", "is-closing", "is-active");
    win.setAttribute("aria-hidden", "true");
    win.removeEventListener("transitionend", onDone);
  };

  win.addEventListener("transitionend", onDone);
}
btn.addEventListener("click", () => {
  const sel = btn.dataset.close;
  const win = document.querySelector(sel);
  if (!win) return;
  closeWindow(win);
});