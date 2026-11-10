// Page transitions. Each one animates the incoming screen into place and
// resolves when it's done. Characters ("actors") ride along on the screen's
// edges and are removed afterwards by the router.
window.EG_TRANSITIONS = (() => {
"use strict";

const EASE = "cubic-bezier(.45,0,.3,1)";

function actor(screen, html, style) {
  const a = document.createElement("div");
  a.className = "actor";
  a.setAttribute("aria-hidden", "true");
  a.style.cssText = style;
  a.innerHTML = html;
  screen.appendChild(a);
  return a;
}

const SPROUT = `<img src="assets/art/icons/sprout.png" alt="" style="width:100%;height:100%;object-fit:contain;object-position:bottom">`;

// Jagged grass line drawn across the top edge of the rising page
function grassEdge(color) {
  let d = "M0 26L0 14";
  for (let x = 0; x <= 300; x += 12) d += `L${x + 6} ${x % 24 ? 3 : 7}L${x + 12} ${x % 36 ? 15 : 12}`;
  return `<svg viewBox="0 0 300 26" width="100%" height="26" preserveAspectRatio="none" style="display:block"><path d="${d}L300 26Z" fill="${color}"/></svg>`;
}

// The game: a sprout pops out of the ground, then the whole page rises with it
async function sprout(screen) {
  const color = getComputedStyle(screen).backgroundColor;
  const rig = actor(screen,
    `<div class="pop sprout-pop">
       <div class="sway" style="width:100%;height:100%">${SPROUT}</div>
     </div>
     <div style="position:absolute;left:0;right:0;bottom:0">${grassEdge(color)}</div>`,
    "left:0;right:0;bottom:100%;height:200px");
  const start = "translateY(calc(100% + 26px))";
  screen.style.transform = start;
  await rig.querySelector(".pop").animate(
    [{ transform: "scale(0)" }, { transform: "scale(1.15)", offset: .7 }, { transform: "scale(1)" }],
    { duration: 500, easing: "ease-out" }).finished;
  await screen.animate([{ transform: start }, { transform: "translateY(0)" }],
    { duration: 1200, easing: EASE, fill: "forwards" }).finished;
  screen.getAnimations().forEach((a) => a.cancel());
  screen.style.transform = "";
}

// Home: the cat hangs from a rod on the page's bottom edge and pulls it down.
// Its size comes from --cat-w in the CSS (bigger on PC); the image is 400x585.
async function cat(screen) {
  actor(screen,
    `<div class="rod"></div>
     <img class="kick cat-img" src="assets/art/cat-hang.webp" alt="">`,
    "left:0;right:0;top:100%");
  const w = parseFloat(getComputedStyle(screen).getPropertyValue("--cat-w")) || 110;
  const below = Math.ceil(w * 585 / 400) + 10;
  await screen.animate([{ transform: `translateY(calc(-100% - ${below}px))` }, { transform: "translateY(0)" }],
    { duration: 1250, easing: EASE }).finished;
}

// Placeholder for pages whose own transition isn't designed yet
async function gentle(screen) {
  await screen.animate([{ opacity: 0, transform: "translateY(18px)" }, { opacity: 1, transform: "none" }],
    { duration: 450, easing: "ease-out" }).finished;
}

async function calm(screen) {
  await screen.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 250 }).finished;
}

return { sprout, cat, gentle, calm };
})();
