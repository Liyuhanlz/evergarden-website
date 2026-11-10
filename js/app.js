(() => {
"use strict";

const { MAKER, ABSTRACT, ICONS, PAGES, REFERENCES, STEPS, HANDS, CROPS, SHOTS } = window.EG;
const T = window.EG_TRANSITIONS;
const $ = (s, root = document) => root.querySelector(s);
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

// Home photo: a random gallery picture, gently swapped for another every few seconds
function homePhoto() {
  const imgs = document.querySelectorAll("#homePhoto img");
  // Shuffle the gallery so every picture shows once before any repeats
  const order = SHOTS.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  let pos = 0, front = 0;
  const src = (k) => `assets/screens/${SHOTS[order[k % order.length]][0]}.jpg`;
  const swap = () => {
    const next = imgs[1 - front];
    next.onload = () => {
      next.classList.remove("off");
      imgs[front].classList.add("off");
      front = 1 - front;
    };
    next.src = src(++pos);
  };
  // First picture appears straight away, with no fade
  imgs[0].src = src(0);
  if (reduceMotion) return;
  setInterval(() => { if (current === "home" && !document.hidden) swap(); }, 6000);
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
  const grid = $("#gallery"), lb = $("#lightbox"), img = $("#lbImg"), cap = $("#lbCap");
  grid.innerHTML = SHOTS.map(([f, c], i) =>
    `<button type="button" class="photo" data-i="${i}" style="--tilt:${[-2, 1.5, -1, 2][i % 4]}deg" aria-label="Open: ${c}">
       <img src="assets/screens/${f}.jpg" alt="${c}" loading="lazy"><span>${c}</span></button>`).join("");

  let idx = 0, opener = null;
  const show = (i) => {
    idx = (i + SHOTS.length) % SHOTS.length;
    img.src = `assets/screens/${SHOTS[idx][0]}.jpg`;
    img.alt = cap.textContent = SHOTS[idx][1];
  };
  const close = () => { lb.hidden = true; if (opener) opener.focus(); };
  grid.addEventListener("click", (e) => {
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
