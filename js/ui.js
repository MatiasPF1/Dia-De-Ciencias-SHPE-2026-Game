import { THEMES } from "./constants.js";
import { state } from "./state.js";

export function setHudDom() {
  const th = THEMES[state.worldIndex];
  const who = state.selectedChar === "luigi" ? "SAM" : "ALEX";
  const $ = (id) => document.getElementById(id);
  const n = $("hud-ovl-name");
  const sc = $("hud-ovl-score");
  const lv = $("hud-ovl-lives");
  const wo = $("hud-ovl-world");
  const co = $("hud-ovl-coins");
  const ti = $("hud-ovl-time");
  if (n) n.textContent = who;
  if (sc) sc.textContent = String(state.score).padStart(6, "0");
  if (lv) lv.textContent = "♥".repeat(state.player.health);
  if (wo) wo.textContent = th.label;
  if (co) co.textContent = String(state.coins);
  if (ti) ti.textContent = String(Math.floor(state.timeLeft));
  const ge = $("hud-ovl-gems");
  if (ge) ge.textContent = `◆ ${state.gems} / ${state.gemsRequired}`;

  const modal = $("game-modal");
  const mt = $("modal-title");
  if (modal && mt) {
    if (state.toastUntil > Date.now() && state.toastMessage) {
      mt.textContent = state.gameOver ? `GAME OVER\n${state.toastMessage}` : state.toastMessage;
      mt.style.whiteSpace = state.gameOver ? "pre-line" : "normal";
      modal.hidden = false;
    } else {
      modal.hidden = true;
    }
  }
}

export function showScreen(id) {
  document.querySelectorAll(".screen").forEach((el) => {
    el.classList.remove("active");
    el.hidden = true;
  });
  const next = document.getElementById(id);
  if (next) {
    next.hidden = false;
    next.classList.add("active");
  }
}

export function showVictoryScreen() {
  // Populate victory stats
  const scoreEl = document.getElementById("victory-score");
  const badgesEl = document.getElementById("victory-badges");
  const xpEl = document.getElementById("victory-xp");

  if (scoreEl) scoreEl.textContent = String(state.score).padStart(6, "0");
  if (badgesEl) badgesEl.textContent = `${state.gems} / ${state.gemsRequired}`;
  if (xpEl) xpEl.textContent = String(state.coins);

  showScreen("victory-screen");
}

export function syncGameShellTheme() {
  const shell = document.querySelector(".game-shell");
  if (!shell) return;
  shell.dataset.world = String(state.worldIndex + 1);
}
