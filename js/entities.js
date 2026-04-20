import { GROUND_ROW, TILE, COLS, ROWS, VIEW_W } from "./constants.js";
import { state } from "./state.js";
import { isSolid } from "./level.js";

export function updateCoinParticles() {
  for (const p of state.coinParticles) {
    p.y += p.vy;
    p.vy += 0.22;
    p.life--;
  }
  state.coinParticles = state.coinParticles.filter(p => p.life > 0);
}

export function drawCoinParticles() {
  for (const p of state.coinParticles) {
    const sx = Math.round(p.x - state.camX);
    const sy = Math.round(p.y);
    const alpha = Math.min(1, p.life / 15);
    state.ctx.save();
    state.ctx.globalAlpha = alpha;
    state.ctx.fillStyle = "#ffe040";
    state.ctx.beginPath();
    state.ctx.arc(sx, sy, 5, 0, Math.PI * 2);
    state.ctx.fill();
    state.ctx.fillStyle = "#c89000";
    state.ctx.beginPath();
    state.ctx.arc(sx, sy, 3, 0, Math.PI * 2);
    state.ctx.fill();
    state.ctx.restore();
  }
}

export function updateGoombas() {
  const GW = 16, GH = 16;
  for (const g of state.goombas) {
    if (!g.alive) continue;
    if (g.squished) {
      g.squishTimer--;
      if (g.squishTimer <= 0) g.alive = false;
      continue;
    }

    // gravity
    g.y += 1.8;
    // clamp to ground
    const groundY = GROUND_ROW * TILE - GH;
    if (g.y >= groundY) { g.y = groundY; }

    // horizontal movement + wall/pit reversal
    g.x += g.vx;
    // reverse at solid tile ahead
    const ahead = g.vx < 0 ? g.x - 1 : g.x + GW + 1;
    const midR = Math.floor((g.y + GH * 0.5) / TILE);
    const aheadC = Math.floor(ahead / TILE);
    if (aheadC >= 0 && aheadC < COLS && midR >= 0 && midR < ROWS && isSolid(state.tiles[midR][aheadC])) {
      g.vx = -g.vx;
    }
    // reverse at pit edge
    const footC = Math.floor((g.x + (g.vx < 0 ? 0 : GW)) / TILE);
    const belowR = Math.floor((g.y + GH + 1) / TILE);
    if (belowR >= 0 && belowR < ROWS && footC >= 0 && footC < COLS && !isSolid(state.tiles[belowR][footC])) {
      g.vx = -g.vx;
    }

    // stomp check: player falling onto goomba
    if (state.player.invuln === 0) {
      const px = state.player.x, py = state.player.y, pw = state.player.w, ph = state.player.h;
      const overlapX = px + pw > g.x + 2 && px < g.x + GW - 2;
      const overlapY = py + ph > g.y && py + ph < g.y + GH * 0.7;
      if (overlapX && overlapY && state.player.vy > 0) {
        // stomp
        g.squished = true;
        g.squishTimer = 24;
        state.player.vy = -5;
        state.score += 100;
      } else if (overlapX && py + ph > g.y + 2 && py < g.y + GH) {
        // side hit — flash only, no death
        if (state.player.invuln === 0) {
          state.player.invuln = 90;
        }
      }
    }
  }
}

export function drawGoombas() {
  const GW = 16, GH = 16;
  for (const g of state.goombas) {
    if (!g.alive) continue;
    const sx = Math.round(g.x - state.camX);
    const sy = Math.round(g.y);
    if (sx + GW < 0 || sx > VIEW_W) continue;
    state.ctx.save();
    state.ctx.translate(sx, sy);

    if (g.squished) {
      // flat squished body
      state.ctx.fillStyle = "#5c3008";
      state.ctx.fillRect(0, GH - 5, GW, 5);
      state.ctx.fillStyle = "#8b4513";
      state.ctx.fillRect(1, GH - 8, GW - 2, 4);
      // eyes still visible
      state.ctx.fillStyle = "#fff";
      state.ctx.fillRect(2, GH - 7, 3, 2);
      state.ctx.fillRect(GW - 5, GH - 7, 3, 2);
      state.ctx.fillStyle = "#000";
      state.ctx.fillRect(3, GH - 7, 2, 2);
      state.ctx.fillRect(GW - 4, GH - 7, 2, 2);
      state.ctx.restore();
      continue;
    }

    // feet (animate by world x)
    const step = Math.floor(g.x / 6) % 2;
    state.ctx.fillStyle = "#3a1a00";
    state.ctx.fillRect(1 + step,     GH - 5, 5, 5);
    state.ctx.fillRect(GW - 6 - step, GH - 5, 5, 5);

    // body
    state.ctx.fillStyle = "#8b4513";
    state.ctx.fillRect(2, GH - 13, GW - 4, 9);
    // body highlight
    state.ctx.fillStyle = "#c46020";
    state.ctx.fillRect(3, GH - 12, GW - 6, 3);

    // head (round-ish)
    state.ctx.fillStyle = "#8b4513";
    state.ctx.fillRect(1, 1, GW - 2, GH - 13);
    state.ctx.fillRect(0, 3, GW, GH - 16);
    // head top dark
    state.ctx.fillStyle = "#5c2e08";
    state.ctx.fillRect(2, 0, GW - 4, 3);
    state.ctx.fillRect(0, 2, 2, 2);
    state.ctx.fillRect(GW - 2, 2, 2, 2);

    // eyes white
    state.ctx.fillStyle = "#fff";
    state.ctx.fillRect(2, 4, 4, 4);
    state.ctx.fillRect(GW - 6, 4, 4, 4);
    // pupils (angry, pointing inward)
    state.ctx.fillStyle = "#000";
    state.ctx.fillRect(4, 5, 2, 3);
    state.ctx.fillRect(GW - 6, 5, 2, 3);
    // eyebrow (angry)
    state.ctx.fillStyle = "#3a1a00";
    state.ctx.fillRect(2, 3, 4, 1);
    state.ctx.fillRect(GW - 6, 3, 4, 1);

    state.ctx.restore();
  }
}
