import { GROUND_ROW, TILE, COLS, ROWS, VIEW_W } from "./constants.js";
import { state } from "./state.js";
import { isSolid, applyPlayerDamage } from "./level.js";

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
    // reverse at solid tile ahead or map edge
    const ahead = g.vx < 0 ? g.x - 1 : g.x + GW + 1;
    const midR = Math.floor((g.y + GH * 0.5) / TILE);
    const aheadC = Math.floor(ahead / TILE);
    if (aheadC < 0 || aheadC >= COLS || (aheadC >= 0 && aheadC < COLS && midR >= 0 && midR < ROWS && isSolid(state.tiles[midR][aheadC]))) {
      g.vx = -g.vx;
    }
    // reverse at pit edge or map edge
    const footC = Math.floor((g.x + (g.vx < 0 ? 0 : GW)) / TILE);
    const belowR = Math.floor((g.y + GH + 1) / TILE);
    if (footC < 0 || footC >= COLS || (belowR >= 0 && belowR < ROWS && footC >= 0 && footC < COLS && !isSolid(state.tiles[belowR][footC]))) {
      g.vx = -g.vx;
    }

    // stomp check: player falling onto rejection enemy
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
        applyPlayerDamage();
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
      // flattened rejection letter
      state.ctx.fillStyle = "#cfd6df";
      state.ctx.fillRect(1, GH - 8, GW - 2, 6);
      state.ctx.fillStyle = "#ff4b5c";
      state.ctx.fillRect(4, GH - 7, GW - 8, 1);
      state.ctx.fillRect(4, GH - 5, GW - 8, 1);
      state.ctx.restore();
      continue;
    }

    // tiny shadow feet (animate by world x)
    const step = Math.floor(g.x / 6) % 2;
    state.ctx.fillStyle = "#3a1a00";
    state.ctx.fillRect(1 + step, GH - 5, 5, 5);
    state.ctx.fillRect(GW - 6 - step, GH - 5, 5, 5);

    // glitch-bug body
    state.ctx.fillStyle = "#5f2ccf";
    state.ctx.fillRect(2, 3, GW - 4, GH - 8);
    state.ctx.fillStyle = "#7f4dff";
    state.ctx.fillRect(3, 4, GW - 6, 4);
    state.ctx.fillStyle = "#3a1f7f";
    state.ctx.fillRect(4, 10, GW - 8, 2);

    // pixel antennae
    state.ctx.fillStyle = "#a88cff";
    state.ctx.fillRect(4, 1, 2, 3);
    state.ctx.fillRect(GW - 6, 1, 2, 3);
    state.ctx.fillStyle = "#ff5a7a";
    state.ctx.fillRect(4, 0, 2, 1);
    state.ctx.fillRect(GW - 6, 0, 2, 1);

    // eyes + pupils
    state.ctx.fillStyle = "#f2f6ff";
    state.ctx.fillRect(4, 6, 3, 3);
    state.ctx.fillRect(GW - 7, 6, 3, 3);
    state.ctx.fillStyle = "#1a1233";
    state.ctx.fillRect(5, 7, 1, 2);
    state.ctx.fillRect(GW - 6, 7, 1, 2);

    // little "error" glyph
    state.ctx.fillStyle = "#ff5a7a";
    state.ctx.fillRect(7, 11, 2, 1);
    state.ctx.fillRect(9, 10, 1, 3);

    state.ctx.restore();
  }
}
