import { TILE, LEVEL_W, LEVEL_H, VIEW_W, FLAG_COL } from "./constants.js";
import { state } from "./state.js";
import { palette, isSolid, tileCoords, overlapsSolid, advanceAfterClear, applyPlayerDamage } from "./level.js";
import { GATE_COL } from "./npcs.js";

export function updateCamera() {
  const target = state.player.x + state.player.w / 2 - VIEW_W * 0.42;
  state.camX += (target - state.camX) * 0.07;
  if (state.camX < 0) state.camX = 0;
  if (state.camX > LEVEL_W - VIEW_W) state.camX = LEVEL_W - VIEW_W;
}

export function updatePlayer() {
  const C = palette();
  const runAccel = 0.22;
  const runMax = C.backdrop === "underground" ? 1.65 : 1.85;
  const friction = 0.86;
  const gravity = C.backdrop === "underground" ? 0.18 : 0.20;
  const jumpSpeed = -8.5;
  const jumpCut = 0.45;

  if (state.player.invuln > 0) state.player.invuln--;

  let input = 0;
  if (state.keys.left) input -= 1;
  if (state.keys.right) input += 1;
  if (input !== 0) state.player.facing = input > 0 ? 1 : -1;

  if (input !== 0) {
    state.player.vx += input * runAccel;
    if (state.player.vx > runMax) state.player.vx = runMax;
    if (state.player.vx < -runMax) state.player.vx = -runMax;
  } else {
    state.player.vx *= friction;
    if (Math.abs(state.player.vx) < 0.04) state.player.vx = 0;
  }

  state.player.coyote = state.player.onGround ? 6 : state.player.coyote - 1;
  if (state.keys.jump && !state.keys.jumpHeld) state.player.jumpBuf = 10;
  state.keys.jumpHeld = state.keys.jump;

  if (state.player.jumpBuf > 0 && state.player.coyote > 0) {
    state.player.vy = jumpSpeed;
    state.player.onGround = false;
    state.player.coyote = 0;
    state.player.jumpBuf = 0;
  }
  state.player.jumpBuf = Math.max(0, state.player.jumpBuf - 1);
  if (!state.keys.jump && state.player.vy < -2) state.player.vy *= jumpCut;

  state.player.vy += gravity;
  if (state.player.vy > 6.0) state.player.vy = 6.0;

  let nx = state.player.x + state.player.vx;
  // Gate wall: block until all gems collected, all enemies dead, all coins hit
  const gateX = GATE_COL * TILE;
  const gateBlocked =
    state.gems < state.gemsRequired ||
    state.goombas.some(g => g.alive) ||
    state.levelCoins < state.totalCoins;
  if (gateBlocked) {
    if (nx + state.player.w > gateX && state.player.x + state.player.w <= gateX) {
      nx = gateX - state.player.w;
      state.player.vx = 0;
    }
  }
  if (overlapsSolid(nx, state.player.y, state.player.w, state.player.h)) {
    if (state.player.vx > 0) {
      nx = Math.floor((nx + state.player.w) / TILE) * TILE - state.player.w - 0.001;
    } else if (state.player.vx < 0) {
      nx = Math.ceil(nx / TILE) * TILE + 0.001;
    }
    state.player.vx = 0;
  }
  state.player.x = nx;
  if (state.player.x < 0) state.player.x = 0;
  if (state.player.x + state.player.w > LEVEL_W) state.player.x = LEVEL_W - state.player.w;

  let ny = state.player.y + state.player.vy;
  state.player.onGround = false;
  if (overlapsSolid(state.player.x, ny, state.player.w, state.player.h)) {
    if (state.player.vy > 0) {
      const { c0, c1, r0, r1 } = tileCoords(state.player.x, ny, state.player.w, state.player.h);
      let topY = Infinity;
      for (let r = r0; r <= r1; r++) {
        for (let c = c0; c <= c1; c++) {
          if (!isSolid(state.tiles[r][c])) continue;
          const ty = r * TILE;
          if (ty < topY) topY = ty;
        }
      }
      if (topY !== Infinity) {
        ny = topY - state.player.h;
        state.player.vy = 0;
        state.player.onGround = true;
      }
    } else if (state.player.vy < 0) {
      const { c0, c1, r0, r1 } = tileCoords(state.player.x, ny, state.player.w, state.player.h);
      let botY = -Infinity;
      for (let r = r0; r <= r1; r++) {
        for (let c = c0; c <= c1; c++) {
          if (!isSolid(state.tiles[r][c])) continue;
          const by = (r + 1) * TILE;
          if (by > botY) botY = by;
        }
      }
      if (botY !== -Infinity) {
        ny = botY;
        state.player.vy = 0;
        // check if any of those tiles are question blocks
        const { c0: qc0, c1: qc1, r0: qr0, r1: qr1 } = tileCoords(state.player.x, ny - 1, state.player.w, state.player.h);
        for (let r = qr0; r <= qr1; r++) {
          for (let c = qc0; c <= qc1; c++) {
            if (state.tiles[r][c] === 3 /* T.QUESTION */) {
              state.tiles[r][c] = 4; // T.BLOCK — spent
              state.coins += 1;
              state.levelCoins += 1;
              state.score += 200;
              state.coinParticles.push({ x: c * TILE + TILE / 2, y: r * TILE, vy: -3.5, life: 40 });
            }
          }
        }
      }
    }
  }
  state.player.y = ny;

  if (state.player.y > LEVEL_H + 64) {
    applyPlayerDamage();
    return;
  }

  if (state.player.onGround && (state.keys.left || state.keys.right)) state.player.anim++;
  else if (!state.player.onGround) state.player.anim++;

  if (!state.levelDone && !state.gameWin && state.player.x > FLAG_COL * TILE + 8 &&
      (state.worldIndex < 1 || state.bowserDefeated)) {
    state.levelDone = true;
    state.score += Math.floor(state.timeLeft) * 50;
    setTimeout(() => { state.levelDone = false; advanceAfterClear(); }, 1200);
  }

  if (!state.gameOver && !state.levelDone && !state.gameWin) {
    state.timeAcc += 1;
    if (state.timeAcc >= 40) {
      state.timeAcc = 0;
      state.timeLeft = Math.max(0, state.timeLeft - 1);
    }
  }
}
