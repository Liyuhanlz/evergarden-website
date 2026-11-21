(() => {
"use strict";

const { MAKER, ABSTRACT, ICONS, PAGES, REFERENCES, STEPS, HANDS, CROPS, CLIPS, SHOTS } = window.EG;
const T = window.EG_TRANSITIONS;
const $ = (s, root = document) => root.querySelector(s);
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Everything in the Gallery, clips first: used by the Gallery page and the home photo
const GALLERY = [
  ...CLIPS.map(([n, c]) => ({ video: `assets/clips/clip-${n}.mp4`, poster: `assets/clips/clip-${n}.jpg`, cap: c })),
  ...SHOTS.map(([f, c]) => ({ src: `assets/screens/${f}.jpg`, cap: c })),
];

// ---------------------------------------------------------------------
//  Home: wobbly title letters and the slanted menu
// ---------------------------------------------------------------------
function home() {
  const title = $("#title");
  const colors = ["#3B6D11", "#7CC46B", "#2F4A2B"];
  title.setAttribute("aria-label", title.textContent);
  title.innerHTML = [...title.textContent].map((c, i) =>
    `<span aria-hidden="true" style="color:${colors[i % 3]};transform:rotate(${i % 2 ? 6 : -5}deg) translateY(${i % 3 ? 2 : -2}px)">${c}</span>`).join("");

  // Staggered left offsets; on phones the buttons also stretch to the right edge (see .mi in the CSS)
  const offsets = [0, 22, 8, 30, 4, 18, 12];
  $("#menu").innerHTML = PAGES.map((p, i) =>
    `<a class="mi" href="#/${p.route}" style="--bg:${p.color};--off:${offsets[i % offsets.length]}px;--tilt:${i % 2 ? 3 : -3}deg">
       <span class="mi-face"><img src="${ICONS[p.icon]}" alt="">${p.label}</span></a>`).join("");

  document.querySelectorAll("img[data-icon]").forEach((img) => { img.src = ICONS[img.dataset.icon]; });
  homePhoto();
}

// Home photo: shows only what's in the Gallery (clips and screenshots), in shuffled order,
// fading to the next one every few seconds. Adding to CLIPS or SHOTS updates both places.
function homePhoto() {
  const box = $("#homePhoto");
  const order = GALLERY.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  let pos = 0, cur = null;

  // Build the element for one gallery item: a looping clip, or a still picture.
  // With reduced motion a clip shows its still poster instead of playing.
  const make = (it) => {
    let el;
    if (it.video && !reduceMotion) {
      el = document.createElement("video");
      Object.assign(el, { muted: true, loop: true, playsInline: true, autoplay: true, poster: it.poster, src: it.video });
      el.setAttribute("muted", "");
    } else {
      el = document.createElement("img");
      el.src = it.video ? it.poster : it.src;
      el.alt = "";
    }
    return el;
  };

  let pending = false;
  const showNext = (fade) => {
    if (pending) return;   // still waiting for the last one to load
    const el = make(GALLERY[order[pos++ % order.length]]);
    if (fade) el.classList.add("off");
    box.appendChild(el);
    pending = fade;
    el.addEventListener("error", () => { pending = false; if (el !== cur) el.remove(); }, { once: true });
    const reveal = () => {
      pending = false;
      el.classList.remove("off");
      const old = cur;
      cur = el;
      if (old && old !== el) {
        old.classList.add("off");
        setTimeout(() => old.remove(), 1300);   // after the 1.2s fade
      }
    };
    if (!fade) { reveal(); return; }
    if (el.tagName === "VIDEO") el.addEventListener("loadeddata", reveal, { once: true });
    else el.onload = reveal;
  };

  box.replaceChildren();
  showNext(false);
  if (reduceMotion) return;
  setInterval(() => {
    const onHome = current === "home" && !document.hidden;
    if (cur && cur.tagName === "VIDEO") onHome ? cur.play().catch(() => {}) : cur.pause();
    if (onHome) showNext(true);
  }, 6000);
}

function popInMenu(delay = 0) {
  document.querySelectorAll("#menu .mi").forEach((m, i) => {
    m.classList.remove("in");
    void m.offsetWidth;
    m.style.animationDelay = `${delay + i * 0.08}s`;
    m.classList.add("in");
  });
}

// ---------------------------------------------------------------------
//  Router: #/game, #/play ... with a transition per page
// ---------------------------------------------------------------------
const screens = {};
document.querySelectorAll(".screen").forEach((s) => { screens[s.dataset.route] = s; });
let current = null, busy = false, pending = null;

const routeFromHash = () => {
  const r = location.hash.replace(/^#\/?/, "");
  return screens[r] ? r : "home";
};

function transitionFor(route) {
  if (reduceMotion) return T.calm;
  if (route === "home") return T.cat;
  const page = PAGES.find((p) => p.route === route);
  return T[page && page.transition] || T.gentle;
}

async function go(route) {
  if (route === current) return;
  if (busy) { pending = route; return; }
  const next = screens[route], prev = screens[current];
  busy = true;
  next.hidden = false;
  $(".scroll", next).scrollTop = 0;
  next.style.zIndex = 2;
  if (prev) prev.style.zIndex = 1;
  if (route === "home") popInMenu(reduceMotion ? 0 : 0.6);
  if (prev) await transitionFor(route)(next);
  next.querySelectorAll(":scope > .actor").forEach((a) => a.remove());
  if (prev) { prev.hidden = true; prev.style.zIndex = ""; }
  next.style.zIndex = "";
  current = route;
  document.title = route === "home" ? "Evergarden" : `${PAGES.find((p) => p.route === route).label} · Evergarden`;
  const heading = $("h1, h2", next);
  heading.setAttribute("tabindex", "-1");
  if (prev) heading.focus({ preventScroll: true });
  busy = false;
  if (pending) { const p = pending; pending = null; go(p); }
}

// ---------------------------------------------------------------------
//  How it plays: step picker and controller list
// ---------------------------------------------------------------------
function play() {
  const box = $("#steps"), img = $("#stepImg"), text = $("#stepText");
  let cur = -1;
  box.innerHTML = STEPS.map(([n], i) => `<button type="button" role="tab" aria-selected="false" style="--tilt:${i % 2 ? 2 : -2}deg">${n}</button>`).join("");
  const show = (i) => {
    if (i === cur) return;
    cur = i;
    box.querySelectorAll("button").forEach((b, j) => b.setAttribute("aria-selected", String(j === i)));
    text.innerHTML = STEPS[i][2];
    img.alt = `${STEPS[i][0]} in Evergarden`;
    img.src = `assets/screens/${STEPS[i][1]}.jpg`;
  };
  box.addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) show([...box.children].indexOf(b)); });
  STEPS.forEach(([, f]) => { new Image().src = `assets/screens/${f}.jpg`; });
  show(0);

  $("#hands").innerHTML = HANDS.map((h) =>
    `<article class="card hand"><h4>${h.hand}</h4><dl>${h.keys.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("")}</dl></article>`).join("");
}

// ---------------------------------------------------------------------
//  Fun facts: the magnifying-glass page for each crop
// ---------------------------------------------------------------------
function facts() {
  const chips = $("#chips");
  let crop = CROPS[0], fact = 0;

  chips.innerHTML = CROPS.map((c) =>
    `<button type="button" class="chip" role="tab" data-id="${c.id}" aria-selected="false"><img src="assets/art/icons/${c.icon}.png" alt="">${c.name}</button>`).join("");

  function render() {
    $("#fName").textContent = crop.name;
    $("#fIcon").src = `assets/art/icons/${crop.icon}.png`;
    $("#fAbout").textContent = crop.about;
    $("#fFact").textContent = crop.facts[fact];
    $("#fReal").textContent = crop.real;
    let game = `Ready after ${crop.days} watered ${crop.days > 1 ? "days" : "day"}, with ${crop.yield} per harvest.`;
    if (crop.regrow) game += ` Grows back for up to ${crop.regrow} harvests.`;
    $("#fGame").textContent = game;
    chips.querySelectorAll(".chip").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.id === crop.id)));
  }

  chips.addEventListener("click", (e) => {
    const b = e.target.closest(".chip");
    if (!b || b.dataset.id === crop.id) return;
    crop = CROPS.find((c) => c.id === b.dataset.id);
    fact = 0;
    const card = $("#fact");
    card.classList.remove("swap"); void card.offsetWidth; card.classList.add("swap");
    render();
  });
  $("#nextFact").addEventListener("click", () => { fact = (fact + 1) % crop.facts.length; render(); });

  render();
}

// ---------------------------------------------------------------------
//  Gallery grid and lightbox
// ---------------------------------------------------------------------
function gallery() {
  const lb = $("#lightbox"), img = $("#lbImg"), vid = $("#lbVid"), cap = $("#lbCap");
  const items = GALLERY;
  const tilt = (i) => [-2, 1.5, -1, 2][i % 4];

  $("#clips").innerHTML = items.filter((it) => it.video).map((it, i) =>
    `<button type="button" class="photo clip" data-i="${i}" style="--tilt:${tilt(i)}deg" aria-label="Play bigger: ${it.cap}">
       <video src="${it.video}" poster="${it.poster}" muted loop playsinline preload="none" aria-hidden="true"></video><span>${it.cap}</span></button>`).join("");
  $("#gallery").innerHTML = items.map((it, i) => it.video ? "" :
    `<button type="button" class="photo" data-i="${i}" style="--tilt:${tilt(i)}deg" aria-label="Open: ${it.cap}">
       <img src="${it.src}" alt="${it.cap}" loading="lazy"><span>${it.cap}</span></button>`).join("");

  // Clips play like GIFs, but only while they're on screen (and never with reduced motion)
  if (!reduceMotion && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      const v = e.target;
      if (e.isIntersecting) v.play().catch(() => {}); else v.pause();
    }), { threshold: 0.4 });
    document.querySelectorAll("#clips video").forEach((v) => io.observe(v));
  }

  let idx = 0, opener = null;
  const show = (i) => {
    idx = (i + items.length) % items.length;
    const it = items[idx];
    cap.textContent = it.cap;
    if (it.video) {
      img.hidden = true; vid.hidden = false;
      vid.poster = it.poster; vid.src = it.video;
      vid.setAttribute("aria-label", it.cap);
      vid.play().catch(() => {});
    } else {
      vid.pause(); vid.removeAttribute("src"); vid.load(); vid.hidden = true;
      img.hidden = false; img.src = it.src; img.alt = it.cap;
    }
  };
  const close = () => {
    lb.hidden = true;
    vid.pause();
    if (opener) opener.focus();
  };
  document.querySelector('[data-route="gallery"]').addEventListener("click", (e) => {
    const b = e.target.closest(".photo");
    if (!b) return;
    opener = b; show(+b.dataset.i); lb.hidden = false; $("#lbClose").focus();
  });
  $("#lbClose").addEventListener("click", close);
  $("#lbPrev").addEventListener("click", () => show(idx - 1));
  $("#lbNext").addEventListener("click", () => show(idx + 1));
  lb.addEventListener("click", (e) => { if (e.target === lb) close(); });
  document.addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") show(idx + 1);
    if (e.key === "ArrowLeft") show(idx - 1);
  });
}

// ---------------------------------------------------------------------
//  Meet the maker
// ---------------------------------------------------------------------
function maker() {
  $("#makerName").textContent = MAKER.name;
  $("#makerRole").textContent = MAKER.role;
  $("#makerBio").textContent = MAKER.bio;
  $("#makerAwards").innerHTML = MAKER.awards.map((a) => `<li>${a}</li>`).join("");
  $("#makerLinks").innerHTML = MAKER.links.map((l, i) => l.href
    ? `<a class="pill${i ? " ghost" : ""}" href="${l.href}" target="_blank" rel="noopener">${l.label}</a>`
    : `<span class="pill todo">${l.label} (link coming soon)</span>`).join("");
}

// References: APA list, grouped, with hanging indents
function refs() {
  $("#refs").innerHTML = REFERENCES.map((g) =>
    `<article class="card refs"><h3>${g.group}</h3><ul>${g.items.map((r) =>
      `<li>${r.html} <a href="${r.url}" target="_blank" rel="noopener">${r.url}</a>${r.note ? `<span class="ref-note">${r.note}</span>` : ""}</li>`).join("")}</ul></article>`).join("");
}

// Behind the build: the project abstract
function build() {
  $("#abstractText").innerHTML = ABSTRACT.text.map((p) => `<p>${p}</p>`).join("");
  $("#keywords").innerHTML = ABSTRACT.keywords.map((k) => `<li>${k}</li>`).join("");
}

home();
play();
build();
refs();
facts();
gallery();
maker();
window.addEventListener("hashchange", () => go(routeFromHash()));
go(routeFromHash()).then(() => { if (current === "home") popInMenu(); });
})();
