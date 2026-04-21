import { TILE, VIEW_W, VIEW_H, GROUND_ROW, COLS, ROWS, PLAYER, FLAG_COL } from "./constants.js";
import { state } from "./state.js";
import { palette, isSolid, tileCoords } from "./level.js";
import { drawGoombas, drawCoinParticles } from "./entities.js";
import { drawNpcs, drawGate, drawPrincess } from "./npcs.js";
import { drawBowser } from "./bowser.js";

export function drawGroundTile(sx, sy, C) {
  // World 1: city street asphalt
  if (C.backdrop === "overworld") {
    state.ctx.fillStyle = "#2d333b";
    state.ctx.fillRect(sx, sy, TILE, TILE);
    state.ctx.fillStyle = "#3a424d";
    state.ctx.fillRect(sx + 1, sy + 1, TILE - 2, TILE - 2);
    state.ctx.fillStyle = "#20262e";
    state.ctx.fillRect(sx, sy + TILE - 4, TILE, 4);
    state.ctx.fillStyle = "#5a6472";
    state.ctx.fillRect(sx + 3, sy + 5, 2, 2);
    state.ctx.fillRect(sx + 10, sy + 10, 2, 2);
    // dashed lane stripe on top row
    if ((Math.floor((sx + state.camX) / TILE) % 4) < 2) {
      state.ctx.fillStyle = "#f8e27a";
      state.ctx.fillRect(sx + 2, sy + 1, TILE - 4, 2);
    }
    return;
  }

  // World 2: office floor tiles
  if (C.backdrop === "underground") {
    state.ctx.fillStyle = "#c9d1db";
    state.ctx.fillRect(sx, sy, TILE, TILE);
    state.ctx.fillStyle = "#d8e0e9";
    state.ctx.fillRect(sx + 1, sy + 1, TILE - 2, TILE - 2);
    state.ctx.fillStyle = "#a8b3c0";
    state.ctx.fillRect(sx, sy, TILE, 1);
    state.ctx.fillRect(sx, sy + TILE - 1, TILE, 1);
    state.ctx.fillStyle = "#b7c2ce";
    state.ctx.fillRect(sx + TILE - 1, sy, 1, TILE);
    return;
  }

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
  if (C.backdrop === "overworld") {
    // City sidewalk bench
    state.ctx.fillStyle = "#4a5568";
    state.ctx.fillRect(sx, sy + 8, TILE, TILE - 8); // bench seat
    state.ctx.fillStyle = "#718096";
    state.ctx.fillRect(sx + 1, sy + 9, TILE - 2, TILE - 10);
    // Legs
    state.ctx.fillStyle = "#2d3748";
    state.ctx.fillRect(sx + 2, sy + 14, 2, 2);
    state.ctx.fillRect(sx + 12, sy + 14, 2, 2);
    return;
  }
  if (C.backdrop === "underground") {
    // Office chair
    state.ctx.fillStyle = "#2d3748";
    state.ctx.fillRect(sx + 4, sy + 10, 8, 6); // seat
    state.ctx.fillStyle = "#4a5568";
    state.ctx.fillRect(sx + 5, sy + 11, 6, 4);
    // Back
    state.ctx.fillRect(sx + 6, sy + 4, 4, 8);
    // Legs
    state.ctx.fillStyle = "#1a202c";
    state.ctx.fillRect(sx + 3, sy + 14, 2, 2);
    state.ctx.fillRect(sx + 11, sy + 14, 2, 2);
    return;
  }
  // Default brick
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
  state.ctx.font = '700 8px "DM Sans", system-ui, sans-serif';
  state.ctx.textAlign = "center";
  state.ctx.textBaseline = "middle";
  state.ctx.fillText("XP", sx + TILE / 2, sy + TILE / 2 + 1);
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
  if (C.backdrop === "overworld") {
    // City building
    state.ctx.fillStyle = "#4a5568";
    state.ctx.fillRect(sx, sy, TILE, TILE);
    state.ctx.fillStyle = "#718096";
    state.ctx.fillRect(sx + 1, sy + 1, TILE - 2, TILE - 2);
    // Windows
    state.ctx.fillStyle = "#2d3748";
    state.ctx.fillRect(sx + 2, sy + 2, 4, 4);
    state.ctx.fillRect(sx + 8, sy + 2, 4, 4);
    state.ctx.fillRect(sx + 2, sy + 8, 4, 4);
    state.ctx.fillRect(sx + 8, sy + 8, 4, 4);
    return;
  }
  if (C.backdrop === "underground") {
    // Office desk
    state.ctx.fillStyle = "#8b4513";
    state.ctx.fillRect(sx, sy + 8, TILE, TILE - 8); // desk top
    state.ctx.fillStyle = "#a0522d";
    state.ctx.fillRect(sx + 1, sy + 9, TILE - 2, TILE - 10);
    // Legs
    state.ctx.fillStyle = "#654321";
    state.ctx.fillRect(sx + 2, sy + 14, 2, 2);
    state.ctx.fillRect(sx + 12, sy + 14, 2, 2);
    return;
  }
  // Default pipe
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
    // Office interior wall + ceiling light strip
    state.ctx.fillStyle = "#eef3f8";
    state.ctx.fillRect(0, 0, VIEW_W, gy - 6);
    state.ctx.fillStyle = "#d6e0ea";
    state.ctx.fillRect(0, 0, VIEW_W, 16);
    for (let i = 0; i < VIEW_W; i += 40) {
      state.ctx.fillStyle = "#f8fbff";
      state.ctx.fillRect(i + 6, 4, 22, 6);
    }

    // Cubicles (parallax scroll)
    const cubicleScroll = state.camX * 0.42;
    for (let i = -2; i < 12; i++) {
      const bx = Math.floor(i * 86 - (cubicleScroll % 86));
      const y = gy - 42;
      state.ctx.fillStyle = "#8da1b6";
      state.ctx.fillRect(bx, y, 58, 28); // back wall
      state.ctx.fillStyle = "#73879c";
      state.ctx.fillRect(bx + 2, y + 2, 54, 24);
      state.ctx.fillStyle = "#5d7083";
      state.ctx.fillRect(bx + 6, y + 18, 16, 2); // desk
      state.ctx.fillRect(bx + 30, y + 8, 10, 7); // monitor
      state.ctx.fillStyle = "#c5f0ff";
      state.ctx.fillRect(bx + 31, y + 9, 8, 5);
      state.ctx.fillStyle = "#3a4e63";
      state.ctx.fillRect(bx + 34, y + 15, 2, 3);
    }
    return;
  }

  // City skyline layers (far to near)
  const farScroll = state.camX * 0.12;
  const midScroll = state.camX * 0.28;
  const nearScroll = state.camX * 0.45;

  // Far city silhouettes
  state.ctx.fillStyle = "rgba(33, 48, 78, 0.55)";
  for (let i = -2; i < 12; i++) {
    const bx = Math.floor(i * 90 - (farScroll % 90));
    const h = 60 + (i % 4) * 12;
    state.ctx.fillRect(bx, gy - h - 26, 62, h);
  }

  // Mid city blocks
  state.ctx.fillStyle = "rgba(46, 68, 104, 0.72)";
  for (let i = -2; i < 11; i++) {
    const bx = Math.floor(i * 110 - (midScroll % 110));
    const h = 76 + (i % 5) * 14;
    state.ctx.fillRect(bx + 8, gy - h - 18, 70, h);
  }

  // Near skyline + windows
  for (let i = -2; i < 10; i++) {
    const bx = Math.floor(i * 126 - (nearScroll % 126));
    const h = 90 + (i % 3) * 18;
    state.ctx.fillStyle = "rgba(58, 83, 126, 0.88)";
    state.ctx.fillRect(bx + 10, gy - h - 8, 84, h);

    // Windows
    state.ctx.fillStyle = "rgba(190, 225, 255, 0.35)";
    for (let wy = gy - h + 6; wy < gy - 14; wy += 10) {
      for (let wx = bx + 18; wx < bx + 84; wx += 12) {
        state.ctx.fillRect(wx, wy - 8, 4, 4);
      }
    }
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

function drawStreetLamps() {
  if (state.worldIndex !== 0) return;
  const startCol = Math.max(0, Math.floor(state.camX / TILE) - 20);
  const endCol = Math.min(COLS - 1, Math.ceil((state.camX + VIEW_W) / TILE) + 20);
  for (let c = startCol; c <= endCol; c += 20) {
    const sx = c * TILE - state.camX;
    const baseY = GROUND_ROW * TILE;
    state.ctx.fillStyle = "#1f2732";
    state.ctx.fillRect(sx + 6, baseY - 46, 3, 46); // post
    state.ctx.fillRect(sx + 7, baseY - 46, 13, 2); // arm
    state.ctx.fillStyle = "#ffe79a";
    state.ctx.fillRect(sx + 17, baseY - 44, 4, 5); // lamp
    state.ctx.fillStyle = "rgba(255, 235, 150, 0.16)";
    state.ctx.fillRect(sx + 10, baseY - 38, 16, 14); // glow
  }
}

function drawBuildingEntrance() {
  if (state.worldIndex !== 0) return;
  const wx = (FLAG_COL + 4) * TILE;
  const sx = Math.round(wx - state.camX);
  const by = GROUND_ROW * TILE;
  if (sx > VIEW_W + 80 || sx < -120) return;

  // Building facade overlay at level end
  state.ctx.fillStyle = "#5f738e";
  state.ctx.fillRect(sx - 10, by - 96, 84, 96);
  state.ctx.fillStyle = "#7590b0";
  state.ctx.fillRect(sx - 8, by - 94, 80, 92);
  state.ctx.fillStyle = "#bfe8ff";
  for (let y = by - 88; y < by - 26; y += 12) {
    state.ctx.fillRect(sx + 2, y, 10, 6);
    state.ctx.fillRect(sx + 18, y, 10, 6);
    state.ctx.fillRect(sx + 44, y, 10, 6);
    state.ctx.fillRect(sx + 60, y, 10, 6);
  }
  // Doorway (entering building)
  state.ctx.fillStyle = "#233347";
  state.ctx.fillRect(sx + 29, by - 30, 18, 30);
  state.ctx.fillStyle = "#314a66";
  state.ctx.fillRect(sx + 31, by - 28, 14, 26);
  state.ctx.fillStyle = "#dff6ff";
  state.ctx.fillRect(sx + 33, by - 24, 10, 16);
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
    state.ctx.fillRect(2 + walk, h - 7, 6, 7);
    state.ctx.fillRect(w - 8 - walk, h - 7, 6, 7);
    state.ctx.fillRect(1 + walk, h - 4, 8, 4);
    state.ctx.fillRect(w - 9 - walk, h - 4, 8, 4);
  } else {
    state.ctx.fillRect(3, h - 6, 5, 6);
    state.ctx.fillRect(w - 8, h - 6, 5, 6);
    state.ctx.fillRect(2, h - 3, 7, 3);
    state.ctx.fillRect(w - 9, h - 3, 7, 3);
  }

  // ── backpack (behind torso) ──
  state.ctx.fillStyle = S.backpackDark || "#251d45";
  state.ctx.fillRect(1, Math.round(h * 0.34), 5, Math.round(h * 0.42));
  state.ctx.fillStyle = S.backpack || "#3a2f6b";
  state.ctx.fillRect(2, Math.round(h * 0.35), 4, Math.round(h * 0.40));

  // ── hoodie / torso ──
  const ovY = Math.round(h * 0.46);
  const ovH = h - ovY - 7;
  state.ctx.fillStyle = S.hoodie || S.overall;
  state.ctx.fillRect(3, ovY, w - 6, ovH);
  state.ctx.fillStyle = S.hoodieDark || S.overallDark;
  state.ctx.fillRect(3, ovY, 2, ovH);
  state.ctx.fillRect(w - 5, ovY, 2, ovH);
  state.ctx.fillStyle = "#c7d7eb";
  state.ctx.fillRect(8, ovY + 3, 5, 2);
  state.ctx.fillRect(9, ovY + 6, 3, 2);

  // ── shirt / arms ──
  state.ctx.fillStyle = S.skin;
  state.ctx.fillRect(3, Math.round(h * 0.32), w - 6, Math.round(h * 0.15));
  const armY = Math.round(h * 0.33);
  state.ctx.fillStyle = S.skin;
  if (!isAir) {
    state.ctx.fillRect(0, armY + walk, 3, 8);
    state.ctx.fillRect(w - 3, armY - walk, 3, 8);
  } else {
    state.ctx.fillRect(0, armY - 3, 3, 8);
    state.ctx.fillRect(w - 3, armY - 3, 3, 8);
  }
  state.ctx.fillStyle = S.glove;
  if (!isAir) {
    state.ctx.fillRect(-1, armY + 5 + walk, 5, 5);
    state.ctx.fillRect(w - 4, armY + 5 - walk, 5, 5);
  } else {
    state.ctx.fillRect(-2, armY + 2, 5, 5);
    state.ctx.fillRect(w - 3, armY + 2, 5, 5);
  }

  // ── head / face ──
  const headY = 3;
  const headH = Math.round(h * 0.32) - headY;
  state.ctx.fillStyle = S.skin;
  state.ctx.fillRect(3, headY + 6, w - 6, headH - 2);

  state.ctx.fillStyle = S.hair;
  state.ctx.fillRect(4, headY + headH - 1, 4, 3);
  state.ctx.fillRect(w - 8, headY + headH - 1, 4, 3);
  state.ctx.fillRect(5, headY + headH + 1, w - 10, 2);

  state.ctx.fillStyle = "#141414";
  const eyeY = headY + Math.round(headH * 0.45);
  state.ctx.fillRect(w - 7, eyeY, 3, 3);
  state.ctx.fillStyle = "rgba(255,255,255,0.9)";
  state.ctx.fillRect(w - 6, eyeY, 2, 2);

  // ── propeller hat ──
  const hatHi = hat === S.luigiHat ? "#8ef07a" : "#ff7060";
  const hatDark = hat === S.luigiHat ? "#1a5010" : "#780810";
  state.ctx.fillStyle = hatDark;
  state.ctx.fillRect(1, headY + 6, w - 2, 2);
  state.ctx.fillStyle = hat;
  state.ctx.fillRect(2, headY + 5, w - 4, 2);
  state.ctx.fillStyle = hat;
  state.ctx.fillRect(3, headY, w - 3, 7);
  state.ctx.fillStyle = hatHi;
  state.ctx.fillRect(4, headY + 1, w - 5, 2);
  state.ctx.fillStyle = S.hair;
  state.ctx.fillRect(3, headY + 7, 3, 2);

  // Propeller stem
  state.ctx.fillStyle = "#3b3b3b";
  state.ctx.fillRect(10, headY - 5, 2, 5);
  // Propeller blades
  state.ctx.fillStyle = "#67d5ff";
  state.ctx.fillRect(6, headY - 7, 5, 2);
  state.ctx.fillStyle = "#ff6b6b";
  state.ctx.fillRect(11, headY - 7, 5, 2);

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
  drawStreetLamps();
  drawBuildingEntrance();
  drawGate(state.ctx);
  drawNpcs(state.ctx);
  drawPrincess(state.ctx);
  drawGoombas();
  drawBowser(state.ctx);
  drawCoinParticles();
  drawPlayer();
}
