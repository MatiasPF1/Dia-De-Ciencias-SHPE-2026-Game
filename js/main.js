import { state } from "./state.js";
import { fullReset } from "./level.js";
import { updatePlayer, updateCamera } from "./physics.js";
import { updateGoombas, updateCoinParticles } from "./entities.js";
import { draw } from "./renderer.js";
import { setHudDom, showScreen } from "./ui.js";
import { checkNpcInteraction } from "./npcs.js";
import { openDialog, closeDialog, openBowserDialog } from "./dialog.js";
import { checkBowserTrigger, updateBowser } from "./bowser.js";

function tick() {
  const gameEl = document.getElementById("game-screen");
  if (!state.ctx || !gameEl || gameEl.hidden) return;
  if (state.paused) return;

  // While a dialog is open, skip physics (dialog handles its own events)
  if (state.activeNpc !== null || state.activeBowser) {
    draw();
    return;
  }

  if (!state.gameOver && !state.gameWin) {
    updatePlayer();
    updateCamera();
    updateGoombas();
    updateBowser();
    updateCoinParticles();
    checkNpcInteraction();
    checkBowserTrigger();
    // Open dialog if interaction just triggered
    if (state.activeNpc !== null) {
      openDialog(state.activeNpc);
    }
    if (state.activeBowser && !state.bowserDialogDone &&
      document.getElementById("npc-dialog")?.hidden !== false) {
      openBowserDialog();
    }
  }
  draw();
}

function loop() {
  tick();
  setHudDom();
  requestAnimationFrame(loop);
}

function bindKeys() {
  window.addEventListener("keydown", (e) => {
    const tag = document.activeElement?.tagName;
    const typing = tag === "INPUT" || tag === "TEXTAREA";

    if (!typing) {
      if (e.code === "ArrowLeft" || e.code === "KeyA") state.keys.left = true;
      if (e.code === "ArrowRight" || e.code === "KeyD") state.keys.right = true;
      if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW") {
        if (state.activeNpc !== null || state.activeBowser) { e.preventDefault(); return; }
        e.preventDefault();
        state.keys.jump = true;
      }
    }

    if (e.code === "KeyE") {
      if (typing) return;
      if (state.activeNpc !== null || state.activeBowser) {
        closeDialog();
      } else {
        state.keys.interact = true;
      }
    }
  });
  window.addEventListener("keyup", (e) => {
    if (e.code === "ArrowLeft" || e.code === "KeyA") state.keys.left = false;
    if (e.code === "ArrowRight" || e.code === "KeyD") state.keys.right = false;
    if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW")
      state.keys.jump = false;
    if (e.code === "KeyE") state.keys.interact = false;
  });
}

function runStoryReveal(onAllVisible) {
  const lines = Array.from(
    document.querySelectorAll("#story-screen .story-line, #story-screen .story-prompt")
  );
  lines.forEach((el) => el.classList.remove("story-line--visible"));
  lines.forEach((el, i) => {
    const delay = i * 1400;
    setTimeout(() => {
      el.classList.add("story-line--visible");
      if (i === lines.length - 1 && onAllVisible) onAllVisible();
    }, delay);
  });
}

function initDom() {
  state.canvas = document.getElementById("game-canvas");
  state.ctx = state.canvas ? state.canvas.getContext("2d") : null;
  if (state.ctx) state.ctx.imageSmoothingEnabled = false;

  function loadPlayerArt() {
    const paths = ["assets/student-character.png", "assets/mario-character.png", "assets/mario-sheet.png"];
    function attempt(i) {
      if (i >= paths.length) {
        state.playerSheet = null;
        return;
      }
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        state.playerSheet = img;
      };
      img.onerror = () => attempt(i + 1);
      img.src = new URL(paths[i], document.baseURI).href;
    }
    attempt(0);
  }
  loadPlayerArt();

  document.getElementById("btn-play")?.addEventListener("click", () => {
    const nameEl = document.getElementById("story-char-name");
    if (nameEl) nameEl.textContent = state.selectedChar === "luigi" ? "Sam" : "Alex";
    showScreen("story-screen");
    runStoryReveal(() => {
      // Only register start controls after all lines have appeared
      function startGame() {
        showScreen("game-screen");
        fullReset();
        state.paused = false;
        document.getElementById("bg-music")?.play().catch(() => { });
        document.removeEventListener("keydown", onStoryKey);
        document.getElementById("story-screen")?.removeEventListener("click", startGame);
      }
      function onStoryKey(e) {
        if (e.code === "Enter" || e.code === "Space") { e.preventDefault(); startGame(); }
      }
      document.addEventListener("keydown", onStoryKey);
      document.getElementById("story-screen")?.addEventListener("click", startGame);
    });
  });

  document.getElementById("btn-char")?.addEventListener("click", () => {
    showScreen("char-screen");
  });

  document.getElementById("char-back")?.addEventListener("click", () => {
    showScreen("intro-screen");
  });

  document.querySelectorAll(".char-card").forEach((btn) => {
    btn.addEventListener("click", () => {
      const c = btn.getAttribute("data-char");
      if (c === "mario" || c === "luigi") state.selectedChar = c;
      showScreen("intro-screen");
    });
  });

  document.getElementById("btn-quit")?.addEventListener("click", () => {
    state.paused = true;
    document.getElementById("bg-music")?.pause();
    document.getElementById("intense-music")?.pause();
    showScreen("intro-screen");
  });

  document.getElementById("btn-victory-back")?.addEventListener("click", () => {
    fullReset();
    showScreen("intro-screen");
  });

  bindKeys();
  if (state.ctx) requestAnimationFrame(loop);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initDom);
} else {
  initDom();
}
