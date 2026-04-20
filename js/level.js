import { ROWS, COLS, GROUND_ROW, TILE, T, FLAG_COL, SPAWN_X, THEMES, LEVEL_W, VIEW_W } from "./constants.js";
import { state } from "./state.js";
import { syncGameShellTheme } from "./ui.js";

export function palette() {
  return THEMES[state.worldIndex];
}

export function isSolid(t) {
  return (
    t === T.GROUND ||
    t === T.BRICK ||
    t === T.QUESTION ||
    t === T.BLOCK ||
    t === T.STAIR ||
    t === T.PIPE
  );
}

export function buildWorld1_1() {
  const m = Array.from({ length: ROWS }, () => Array(COLS).fill(T.EMPTY));
  const G = GROUND_ROW;

  function fillGround(from, to) {
    for (let c = from; c <= to; c++) {
      if (c < 0 || c >= COLS) continue;
      m[G][c] = T.GROUND;
      m[G + 1][c] = T.GROUND;
      m[G + 2][c] = T.GROUND;
    }
  }

  function carvePit(from, to) {
    for (let c = from; c <= to; c++) {
      if (c < 0 || c >= COLS) continue;
      m[G][c] = T.EMPTY;
      m[G + 1][c] = T.EMPTY;
      m[G + 2][c] = T.EMPTY;
    }
  }

  function brickRect(c0, c1, r0, r1) {
    for (let r = r0; r <= r1; r++) {
      for (let c = c0; c <= c1; c++) {
        if (c >= 0 && c < COLS && r >= 0 && r < ROWS) m[r][c] = T.BRICK;
      }
    }
  }

  function qRow(c0, c1, r) {
    for (let c = c0; c <= c1; c++) {
      if (c >= 0 && c < COLS && r >= 0 && r < ROWS) m[r][c] = T.QUESTION;
    }
  }

  function pipe(c, bodyH) {
    const rBase = G;
    for (let i = 0; i < bodyH; i++) {
      const r = rBase - 1 - i;
      if (r >= 0) {
        m[r][c] = T.PIPE;
        m[r][c + 1] = T.PIPE;
      }
    }
    const rTop = rBase - bodyH;
    if (rTop - 1 >= 0) {
      m[rTop - 1][c] = T.PIPE;
      m[rTop - 1][c + 1] = T.PIPE;
    }
  }

  function stairs(cStart, steps) {
    for (let s = 0; s < steps; s++) {
      const c0 = cStart + s;
      const h = s + 1;
      for (let k = 0; k < h; k++) {
        const r = G - k;
        if (r >= 0 && c0 < COLS) m[r][c0] = T.STAIR;
      }
    }
  }

  fillGround(0, COLS - 1);

  // no pits — decorative coin rows where pits used to be
  qRow(54, 58, G - 3);
  qRow(118, 123, G - 3);
  qRow(172, 177, G - 3);
  qRow(238, 244, G - 3);

  brickRect(14, 16, G - 4, G - 4);
  qRow(10, 10, G - 4);
  qRow(12, 12, G - 4);
  qRow(11, 11, G - 8);

  brickRect(28, 39, G - 4, G - 4);
  qRow(34, 34, G - 8);

  pipe(48, 2);
  pipe(94, 3);
  pipe(132, 4);

  brickRect(156, 158, G - 5, G - 5);
  qRow(160, 162, G - 5);

  brickRect(200, 206, G - 6, G - 6);
  brickRect(214, 220, G - 4, G - 4);

  qRow(248, 248, G - 4);
  brickRect(252, 255, G - 4, G - 4);

  // Approach staircase — 8 steps ending 4 cols before the flag
  stairs(FLAG_COL - 12, 8);

  // Flagpole — 8 tiles tall (flag banner comfortably above ground, not at ceiling)
  for (let k = 0; k < 8; k++) {
    const r = G - 1 - k;
    if (r >= 0) m[r][FLAG_COL] = T.POLE;
  }
  if (G - 9 >= 0) m[G - 9][FLAG_COL] = T.FLAG_TOP;

  // Castle wall after the flag
  for (let k = 0; k < 6; k++) {
    const c = FLAG_COL + 3 + k;
    if (c < COLS) {
      for (let r = G - 5; r <= G; r++) m[r][c] = T.BLOCK;
    }
  }
  // battlements on top of castle
  for (let k = 0; k < 3; k++) {
    const c = FLAG_COL + 3 + k * 2;
    if (c < COLS) m[G - 6][c] = T.BLOCK;
  }

  return m;
}

export function tileCoords(ax, ay, aw, ah) {
  const c0 = Math.max(0, Math.floor(ax / TILE));
  const c1 = Math.min(COLS - 1, Math.floor((ax + aw - 0.001) / TILE));
  const r0 = Math.max(0, Math.floor(ay / TILE));
  const r1 = Math.min(ROWS - 1, Math.floor((ay + ah - 0.001) / TILE));
  return { c0, c1, r0, r1 };
}

export function overlapsSolid(ax, ay, aw, ah) {
  const { c0, c1, r0, r1 } = tileCoords(ax, ay, aw, ah);
  for (let r = r0; r <= r1; r++) {
    for (let c = c0; c <= c1; c++) {
      if (isSolid(state.tiles[r][c])) return true;
    }
  }
  return false;
}

export function loadLevel() {
  state.tiles = buildWorld1_1();
  state.timeLeft = 400;
  state.timeAcc = 0;
  state.levelDone = false;
  state.gameWin = false;
  state.camX = 0;
  state.player.x = SPAWN_X;
  state.player.y = GROUND_ROW * TILE - state.player.h;
  state.player.vx = 0;
  state.player.vy = 0;
  state.player.invuln = 0;
  // Spawn goombas at fixed column positions (on ground)
  const gY = GROUND_ROW * TILE - 16;
  state.goombas = [
    22, 38, 65, 80, 100, 140, 155, 190, 210, 260, 280, 310
  ].map(col => ({ x: col * TILE, y: gY, vx: -0.7, alive: true, squished: false, squishTimer: 0 }));
  state.coinParticles = [];

  // Count available ? blocks so gate can require all to be hit
  let coinCount = 0;
  for (let r = 0; r < state.tiles.length; r++)
    for (let c = 0; c < state.tiles[r].length; c++)
      if (state.tiles[r][c] === 3 /* T.QUESTION */) coinCount++;
  state.totalCoins = coinCount;
  state.levelCoins = 0;

  // Reset NPC / gem progress for the new level
  state.gems = 0;
  state.gemsRequired = 2;
  state.npcsCompleted = [false, false, false, false];
  state.activeNpc = null;
  state.princessRescued = false;

  // Reset Bowser fight
  state.bowser = null;
  state.bowserDefeated = false;
  state.bowserDialogDone = false;
  state.activeBowser = false;
}

export function fullReset() {
  state.worldIndex = 0;
  state.score = 0;
  state.coins = 0;
  state.lives = 3;
  state.gameOver = false;
  state.levelDone = false;
  state.gameWin = false;
  loadLevel();
  syncGameShellTheme();
}

export function advanceAfterClear() {
  if (state.worldIndex < 1) {
    state.worldIndex++;
    loadLevel();
    syncGameShellTheme();
  } else {
    state.gameWin = true;
    state.levelDone = false;
    setTimeout(() => { fullReset(); }, 2000);
  }
}

export function respawn() {
  state.player.x = SPAWN_X;
  state.player.y = GROUND_ROW * TILE - state.player.h;
  state.player.vx = 0;
  state.player.vy = 0;
  state.camX = Math.max(0, Math.min(LEVEL_W - VIEW_W, state.player.x - VIEW_W * 0.35));
}
