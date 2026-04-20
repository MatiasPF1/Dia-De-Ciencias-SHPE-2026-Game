import { TILE, VIEW_W, VIEW_H, GROUND_ROW, COLS, ROWS, PLAYER } from "./constants.js";
import { state } from "./state.js";
import { palette, isSolid, tileCoords } from "./level.js";
import { drawGoombas, drawCoinParticles } from "./entities.js";
import { drawNpcs, drawGate, drawPrincess } from "./npcs.js";
import { drawBowser } from "./bowser.js";

export function drawGroundTile(sx, sy, C) {
  state.ctx.fillStyle = C.groundDark;
  state.ctx.fillRect(sx, sy, TILE, TILE);
  state.ctx.fillStyle = C.groundFill;
  state.ctx.fillRect(sx + 1, sy + 1, TILE - 2, TILE - 2);
  state.ctx.fillStyle = C.groundTop;
  state.ctx.fillRect(sx, sy, TILE, 4);
  state.ctx.fillStyle = C.grassStripe;
  state.ctx.fillRect(sx, sy, TILE, 2);
  state.ctx.fillStyle = C.brickMortar;
  state.ctx.fillRect(sx + 4, sy + 8, 8, 2);
  state.ctx.fillRect(sx + 4, sy + 14, 8, 2);
}

export function drawBrickTile(sx, sy, C) {
  state.ctx.fillStyle = C.brickMortar;
  state.ctx.fillRect(sx, sy, TILE, TILE);
  state.ctx.fillStyle = C.brickLo;
  state.ctx.fillRect(sx + 1, sy + 1, TILE - 2, TILE - 2);
  state.ctx.fillStyle = C.brickMid;
  state.ctx.fillRect(sx + 2, sy + 2, TILE - 4, TILE - 4);
  state.ctx.fillStyle = C.brickHi;
  state.ctx.fillRect(sx + 2, sy + 2, TILE - 4, 3);
  state.ctx.fillRect(sx + 2, sy + 2, 3, TILE - 4);
  state.ctx.fillStyle = C.brickLo;
  state.ctx.fillRect(sx + TILE / 2, sy + 4, 2, TILE - 8);
  state.ctx.fillRect(sx + 4, sy + TILE / 2, TILE - 8, 2);
}

export function drawQuestionTile(sx, sy, C) {
  state.ctx.fillStyle = C.qEdge;
  state.ctx.fillRect(sx, sy, TILE, TILE);
  state.ctx.fillStyle = C.qFill;
  state.ctx.fillRect(sx + 2, sy + 2, TILE - 4, TILE - 4);
  state.ctx.fillStyle = C.qHi;
  state.ctx.fillRect(sx + 3, sy + 3, TILE - 6, 4);
  state.ctx.fillRect(sx + 3, sy + 3, 4, TILE - 6);
  state.ctx.fillStyle = "#784000";
  state.ctx.font = '600 11px "DM Sans", system-ui, sans-serif';
  state.ctx.textAlign = "center";
  state.ctx.textBaseline = "middle";
  state.ctx.fillText("?", sx + TILE / 2, sy + TILE / 2 + 1);
}

export function drawMetalTile(sx, sy, C) {
  state.ctx.fillStyle = C.blockMetalDark;
  state.ctx.fillRect(sx, sy, TILE, TILE);
  state.ctx.fillStyle = C.blockMetal;
  state.ctx.fillRect(sx + 1, sy + 1, TILE - 2, TILE - 2);
  state.ctx.fillStyle = C.blockMetalDark;
  state.ctx.fillRect(sx + 3, sy + 3, TILE - 6, 2);
  state.ctx.fillRect(sx + 3, sy + 7, TILE - 6, 2);
}

export function drawStairTile(sx, sy, C) {
  drawBrickTile(sx, sy, C);
}

export function drawPoleTile(sx, sy, C) {
  state.ctx.fillStyle = C.poleDark;
  state.ctx.fillRect(sx + 5, sy, 6, TILE);
  state.ctx.fillStyle = C.pole;
  state.ctx.fillRect(sx + 6, sy, 4, TILE);
  state.ctx.fillStyle = C.poleLight;
  state.ctx.fillRect(sx + 6, sy, 1, TILE);
}

export function drawPipeTile(sx, sy, C) {
  state.ctx.fillStyle = C.pipeDark;
  state.ctx.fillRect(sx, sy, TILE, TILE);
  state.ctx.fillStyle = C.pipe;
  state.ctx.fillRect(sx + 2, sy, TILE - 4, TILE);
  state.ctx.fillStyle = C.pipeLight;
  state.ctx.fillRect(sx + 2, sy, 3, TILE);
  state.ctx.fillStyle = C.pipeDark;
  state.ctx.fillRect(sx + 3, sy + TILE - 4, TILE - 6, 3);
}

export function drawFlagTop(sx, sy, C) {
  drawPoleTile(sx, sy, C);
  state.ctx.fillStyle = C.flag;
  state.ctx.beginPath();
  state.ctx.moveTo(sx + 12, sy + 2);
  state.ctx.lineTo(sx + 28, sy + 8);
  state.ctx.lineTo(sx + 12, sy + 14);
  state.ctx.closePath();
  state.ctx.fill();
  state.ctx.fillStyle = C.flagStripe;
  state.ctx.fillRect(sx + 12, sy + 5, 10, 3);
}

export function drawParallaxBackdrop(C) {
  const g = state.ctx.createLinearGradient(0, 0, 0, VIEW_H);
  g.addColorStop(0, C.skyTop);
  g.addColorStop(1, C.skyBot);
  state.ctx.fillStyle = g;
  state.ctx.fillRect(0, 0, VIEW_W, VIEW_H);

  const gy = GROUND_ROW * TILE;

  if (C.backdrop === "underground") {
    const scroll = (state.camX * 0.15) % 32;
    for (let y = 0; y < 56; y += 16) {
      for (let x = -32 - scroll; x < VIEW_W + 32; x += 16) {
        drawBrickTile(x, y, C);
      }
    }
    state.ctx.fillStyle = "rgba(0,0,0,0.35)";
    state.ctx.fillRect(0, 56, VIEW_W, gy - 56);
    for (let i = 0; i < 40; i++) {
      const rx = ((i * 47 + state.camX * 0.05) % VIEW_W) | 0;
      const ry = 60 + ((i * 31) % (gy - 80));
      state.ctx.fillStyle = "rgba(255,200,120,0.04)";
      state.ctx.fillRect(rx, ry, 2, 2);
    }
    return;
  }

  const px = state.camX * 0.22;
  state.ctx.fillStyle = C.hillFar;
  for (let i = -1; i < 8; i++) {
    const bx = ((i * 180 - (px % 180)) | 0) - 40;
    state.ctx.beginPath();
    state.ctx.ellipse(bx + 90, gy + 36, 110, 70, 0, 0, Math.PI * 2);
    state.ctx.fill();
  }
  state.ctx.fillStyle = C.hillFarDark;
  for (let i = -1; i < 8; i++) {
    const bx = ((i * 180 - (px % 180)) | 0) - 40;
    state.ctx.beginPath();
    state.ctx.ellipse(bx + 100, gy + 48, 90, 55, 0, 0, Math.PI * 2);
    state.ctx.fill();
  }

  const px2 = state.camX * 0.45;
  state.ctx.fillStyle = C.hillNear;
  for (let i = -1; i < 6; i++) {
    const bx = ((i * 260 - (px2 % 260)) | 0) - 60;
    state.ctx.beginPath();
    state.ctx.ellipse(bx + 120, gy + 22, 130, 85, 0, 0, Math.PI * 2);
    state.ctx.fill();
  }
  state.ctx.fillStyle = C.hillNearDark;
  for (let i = -1; i < 6; i++) {
    const bx = ((i * 260 - (px2 % 260)) | 0) - 60;
    state.ctx.beginPath();
    state.ctx.ellipse(bx + 135, gy + 36, 100, 62, 0, 0, Math.PI * 2);
    state.ctx.fill();
  }

  const cx = state.camX * 0.65;
  for (let i = -1; i < 10; i++) {
    const bx = Math.floor(i * 140 - (cx % 140));
    state.ctx.fillStyle = C.bushDark;
    state.ctx.fillRect(bx + 20, gy - 18, 36, 18);
    state.ctx.fillStyle = C.bush;
    state.ctx.fillRect(bx + 22, gy - 20, 32, 20);
  }

  if (C.backdrop === "athletic") {
    state.ctx.fillStyle = "rgba(255,220,160,0.12)";
    state.ctx.fillRect(0, 0, VIEW_W, VIEW_H * 0.45);
  }

  const cloudOff = state.camX * 0.08;
  for (let i = -1; i < 6; i++) {
    const bx = Math.floor(i * 200 - (cloudOff % 200));
    const cy = 40 + (i % 3) * 28;
    state.ctx.fillStyle = C.cloudEdge;
    state.ctx.fillRect(bx + 30, cy, 48, 18);
    state.ctx.fillRect(bx + 44, cy - 10, 40, 16);
    state.ctx.fillStyle = C.cloud;
    state.ctx.fillRect(bx + 32, cy + 2, 44, 14);
    state.ctx.fillRect(bx + 46, cy - 8, 36, 12);
  }
}

export function drawWorld(C) {
  const c0 = Math.max(0, Math.floor(state.camX / TILE) - 1);
  const c1 = Math.min(COLS - 1, Math.ceil((state.camX + VIEW_W) / TILE) + 1);
  for (let r = 0; r < ROWS; r++) {
    for (let c = c0; c <= c1; c++) {
      const t = state.tiles[r][c];
      if (t === 0 /* T.EMPTY */) continue;
      const sx = c * TILE - state.camX;
      const sy = r * TILE;
      if (sx > VIEW_W + TILE || sx < -TILE) continue;
      switch (t) {
        case 1: drawGroundTile(sx, sy, C); break;  // T.GROUND
        case 2: drawBrickTile(sx, sy, C); break;   // T.BRICK
        case 3: drawQuestionTile(sx, sy, C); break; // T.QUESTION
        case 4: drawMetalTile(sx, sy, C); break;   // T.BLOCK
        case 5: drawStairTile(sx, sy, C); break;   // T.STAIR
        case 6: drawPoleTile(sx, sy, C); break;    // T.POLE
        case 7: drawFlagTop(sx, sy, C); break;     // T.FLAG_TOP
        case 8: drawPipeTile(sx, sy, C); break;    // T.PIPE
        default: break;
      }
    }
  }
}

export function drawPlumberModern(px, py, facing, frame, hat) {
  const screenX = px - state.camX;
  const w = state.player.w;
  const h = state.player.h;
  state.ctx.save();
  state.ctx.translate(
    Math.round(screenX) + (facing < 0 ? w : 0),
    Math.round(py)
  );
  state.ctx.scale(facing < 0 ? -1 : 1, 1);
  state.ctx.imageSmoothingEnabled = false;

  const S = PLAYER;
  const isAir = frame === 3;
  const walk = frame % 2;

  // ── boots ──
  state.ctx.fillStyle = S.shoe;
  if (!isAir) {
    state.ctx.fillRect(2 + walk,     h - 7, 6, 7);
    state.ctx.fillRect(w - 8 - walk, h - 7, 6, 7);
    state.ctx.fillRect(1 + walk,     h - 4, 8, 4);
    state.ctx.fillRect(w - 9 - walk, h - 4, 8, 4);
  } else {
    state.ctx.fillRect(3,     h - 6, 5, 6);
    state.ctx.fillRect(w - 8, h - 6, 5, 6);
    state.ctx.fillRect(2,     h - 3, 7, 3);
    state.ctx.fillRect(w - 9, h - 3, 7, 3);
  }

  // ── overalls ──
  const ovY = Math.round(h * 0.46);
  const ovH = h - ovY - 7;
  state.ctx.fillStyle = S.overall;
  state.ctx.fillRect(3, ovY, w - 6, ovH);
  state.ctx.fillStyle = S.overallDark;
  state.ctx.fillRect(3, ovY, 2, ovH);
  state.ctx.fillRect(w - 5, ovY, 2, ovH);
  state.ctx.fillStyle = "#ffd23c";
  state.ctx.fillRect(5, ovY + 2, 2, 2);
  state.ctx.fillRect(w - 7, ovY + 2, 2, 2);

  // ── shirt / arms ──
  state.ctx.fillStyle = S.skin;
  state.ctx.fillRect(3, Math.round(h * 0.32), w - 6, Math.round(h * 0.15));
  const armY = Math.round(h * 0.33);
  state.ctx.fillStyle = S.skin;
  if (!isAir) {
    state.ctx.fillRect(0,     armY + walk,     3, 8);
    state.ctx.fillRect(w - 3, armY - walk,     3, 8);
  } else {
    state.ctx.fillRect(0,     armY - 3, 3, 8);
    state.ctx.fillRect(w - 3, armY - 3, 3, 8);
  }
  state.ctx.fillStyle = S.glove;
  if (!isAir) {
    state.ctx.fillRect(-1,    armY + 5 + walk,  5, 5);
    state.ctx.fillRect(w - 4, armY + 5 - walk,  5, 5);
  } else {
    state.ctx.fillRect(-2,    armY + 2, 5, 5);
    state.ctx.fillRect(w - 3, armY + 2, 5, 5);
  }

  // ── head / face ──
  const headY = 3;
  const headH = Math.round(h * 0.32) - headY;
  state.ctx.fillStyle = S.skin;
  state.ctx.fillRect(3, headY + 6, w - 6, headH - 2);

  state.ctx.fillStyle = S.hair;
  state.ctx.fillRect(4,     headY + headH - 1, 4, 3);
  state.ctx.fillRect(w - 8, headY + headH - 1, 4, 3);
  state.ctx.fillRect(5,     headY + headH + 1, w - 10, 2);

  state.ctx.fillStyle = "#141414";
  const eyeY = headY + Math.round(headH * 0.45);
  state.ctx.fillRect(w - 7, eyeY, 3, 3);
  state.ctx.fillStyle = "rgba(255,255,255,0.9)";
  state.ctx.fillRect(w - 6, eyeY, 2, 2);

  // ── hat ──
  const hatHi  = hat === S.luigiHat ? "#8ef07a" : "#ff7060";
  const hatDark = hat === S.luigiHat ? "#1a5010" : "#780810";
  state.ctx.fillStyle = hatDark;
  state.ctx.fillRect(1, headY + 6, w - 2, 2);
  state.ctx.fillStyle = hat;
  state.ctx.fillRect(2, headY + 5, w - 4, 2);
  state.ctx.fillStyle = hat;
  state.ctx.fillRect(3, headY,     w - 3, 7);
  state.ctx.fillStyle = hatHi;
  state.ctx.fillRect(4, headY + 1, w - 5, 2);
  state.ctx.fillStyle = S.hair;
  state.ctx.fillRect(3,     headY + 7, 3, 2);

  state.ctx.restore();
}

export function drawPlayerSheet(f) {
  if (!state.playerSheet || !state.ctx) return false;
  const nw = state.playerSheet.naturalWidth;
  const nh = state.playerSheet.naturalHeight;
  if (nw < 32 || nh < 16) return false;
  const fw = Math.floor(nw / 4);
  const twoRows = nh * 2 > nw;
  const fh = twoRows ? Math.floor(nh / 2) : nh;
  const row = twoRows && state.selectedChar === "luigi" ? 1 : 0;
  if (f < 0 || f > 3) f = 0;
  const sx = f * fw;
  const sy = row * fh;
  const destW = state.player.w;
  const destH = state.player.h;
  const px = state.player.x - state.camX;
  const py = state.player.y;
  state.ctx.save();
  state.ctx.imageSmoothingEnabled = true;
  state.ctx.imageSmoothingQuality = "high";
  if (state.player.facing < 0) {
    state.ctx.translate(px + destW, py);
    state.ctx.scale(-1, 1);
    state.ctx.drawImage(state.playerSheet, sx, sy, fw, fh, 0, 0, destW, destH);
  } else {
    state.ctx.drawImage(state.playerSheet, sx, sy, fw, fh, px, py, destW, destH);
  }
  state.ctx.restore();
  return true;
}

export function drawPlayer() {
  if (state.player.invuln > 0 && Math.floor(state.player.invuln / 4) % 2 === 0) return;
  const hat = state.selectedChar === "luigi" ? PLAYER.luigiHat : PLAYER.marioHat;
  let fr = 0;
  if (!state.player.onGround) fr = 3;
  else if (state.keys.left || state.keys.right)
    fr = 1 + (Math.floor(state.player.anim / 8) % 2);
  if (drawPlayerSheet(fr)) return;
  drawPlumberModern(state.player.x, state.player.y, state.player.facing, fr, hat);
}

export function draw() {
  if (!state.ctx) return;
  const C = palette();
  drawParallaxBackdrop(C);
  drawWorld(C);
  drawGate(state.ctx);
  drawNpcs(state.ctx);
  drawPrincess(state.ctx);
  drawGoombas();
  drawBowser(state.ctx);
  drawCoinParticles();
  drawPlayer();
}
