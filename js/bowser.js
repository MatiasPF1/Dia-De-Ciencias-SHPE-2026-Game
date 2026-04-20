import { TILE, GROUND_ROW, VIEW_W } from "./constants.js";
import { state } from "./state.js";
import { showScreen } from "./ui.js";
import { fullReset } from "./level.js";

// ── Constants ─────────────────────────────────────────────────────────────
export const BOWSER_TRIGGER_COL = 338;
export const BOWSER_SPAWN_COL   = 350;
export const BOWSER_W = 32;
export const BOWSER_H = 32;

// ── Challenge data ────────────────────────────────────────────────────────
export const BOWSER_EVENT = {
  name: "Bowser",
  color: "#ff4400",
  topic: "Final Boss",
  intro:
    "MWAHAHA! You dare enter MY castle?!\n" +
    "I am Bowser, King of Koopas!\n" +
    "Prove your Python powers or be CRUSHED!\n" +
    "Show me what you have learned!",
  challenges: [
    {
      id: "bowser-0",
      question:
        'Challenge 1: Announce yourself!\n' +
        'Write two print() statements:\n' +
        '  Line 1 → print "I am ready!"\n' +
        '  Line 2 → print "Let\'s fight!"',
      answer: 'print("I am ready!")\nprint("Let\'s fight!")',
      hint:
        'Two separate print() lines:\n\nprint("I am ready!")\nprint("Let\'s fight!")\n\nEach message in its own print() call.',
      indentNote: null,
      successMsg: "Not bad, puny coder. But can you THINK like a programmer?!",
    },
    {
      id: "bowser-1",
      question:
        'Challenge 2: One last spell!\n' +
        'Write an if/else that checks if  hp  is greater than 0.\n' +
        'If yes, print "Fight on!". If no, print "Defeated!".\n' +
        '(Assume  hp = 3  is already set above.)',
      answer: 'if hp > 0:\n    print("Fight on!")\nelse:\n    print("Defeated!")',
      hint:
        'Pattern:\n\nif condition:\n    print("...")\nelse:\n    print("...")\n\nRules:\n• End if: and else: with a colon\n• 4 spaces of indent inside each block\n• else: lines up with if (no indent)',
      indentNote: '⚠ Indentation: use exactly 4 spaces before each print() inside the if/else blocks.',
      successMsg: "IMPOSSIBLE! You really DO know Python! Fine… HAVE AT YOU!",
    },
  ],
};

// ── Trigger check ─────────────────────────────────────────────────────────
export function checkBowserTrigger() {
  if (state.worldIndex !== 1) return;
  if (state.bowserDialogDone || state.activeBowser) return;
  if (state.player.x >= BOWSER_TRIGGER_COL * TILE) {
    state.activeBowser = true;
  }
}

// ── Spawn Bowser ──────────────────────────────────────────────────────────
export function spawnBowser() {
  const groundY = GROUND_ROW * TILE - BOWSER_H;
  state.bowser = {
    x: BOWSER_SPAWN_COL * TILE,
    y: groundY,
    vx: -0.8,
    hp: 3,
    hitTimer: 0,
    alive: true,
  };
}

// ── Update Bowser ─────────────────────────────────────────────────────────
export function updateBowser() {
  const b = state.bowser;
  if (!b || !b.alive) return;

  if (b.hitTimer > 0) b.hitTimer--;

  // Chase player
  b.vx = state.player.x < b.x ? -0.8 : 0.8;
  b.x += b.vx;

  // Clamp to level bounds (between gate and right wall)
  const minX = 332 * TILE;
  const maxX = 362 * TILE - BOWSER_W;
  if (b.x < minX) b.x = minX;
  if (b.x > maxX) b.x = maxX;

  // Stomp check: player falling onto Bowser
  const px = state.player.x, py = state.player.y;
  const pw = state.player.w, ph = state.player.h;
  const overlapX = px + pw > b.x + 2 && px < b.x + BOWSER_W - 2;
  const overlapY = py + ph > b.y && py + ph < b.y + BOWSER_H * 0.6;

  if (overlapX && overlapY && state.player.vy > 0) {
    b.hp--;
    b.hitTimer = 50;
    state.player.vy = -6;
    state.score += 500;
    if (b.hp <= 0) {
      b.alive = false;
      state.bowserDefeated = true;
      state.gameWin = true;
      setTimeout(() => {
        showScreen("intro-screen");
        fullReset();
      }, 3500);
    }
  } else if (overlapX && py + ph > b.y + 2 && py < b.y + BOWSER_H) {
    // Side hit — flash only, no death
    if (b.hitTimer === 0 && state.player.invuln === 0) {
      state.player.invuln = 90;
    }
  }
}

// ── Draw Bowser ───────────────────────────────────────────────────────────
export function drawBowser(ctx) {
  const b = state.bowser;
  if (!b || !b.alive) return;

  const sx = Math.round(b.x - state.camX);
  const sy = Math.round(b.y);
  if (sx + BOWSER_W < 0 || sx > VIEW_W) return;

  // Flash when hit
  if (b.hitTimer > 0 && Math.floor(b.hitTimer / 5) % 2 === 0) return;

  ctx.save();
  ctx.translate(sx, sy);

  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.22)";
  ctx.fillRect(2, BOWSER_H - 3, BOWSER_W - 4, 4);

  // Body — dark red shell
  ctx.fillStyle = "#8b1a00";
  ctx.fillRect(4, 10, 24, 20);
  // Body highlight
  ctx.fillStyle = "#cc2200";
  ctx.fillRect(5, 11, 22, 10);

  // Shell spikes (3 small triangles on top)
  ctx.fillStyle = "#e8a000";
  for (let i = 0; i < 3; i++) {
    const spx = 7 + i * 7;
    ctx.beginPath();
    ctx.moveTo(spx, 10);
    ctx.lineTo(spx + 3, 4);
    ctx.lineTo(spx + 6, 10);
    ctx.closePath();
    ctx.fill();
  }

  // Head — greenish brown
  ctx.fillStyle = "#7a5500";
  ctx.fillRect(8, 0, 18, 14);
  // Snout
  ctx.fillStyle = "#9a6600";
  ctx.fillRect(14, 6, 12, 8);
  // Nostrils
  ctx.fillStyle = "#3a1a00";
  ctx.fillRect(15, 8, 2, 2);
  ctx.fillRect(19, 8, 2, 2);

  // Eyes — angry (red pupils)
  ctx.fillStyle = "#ff2200";
  ctx.fillRect(9, 2, 5, 4);
  ctx.fillRect(20, 2, 5, 4);
  // Pupils
  ctx.fillStyle = "#1a0000";
  ctx.fillRect(10, 3, 3, 3);
  ctx.fillRect(21, 3, 3, 3);
  // Angry brows (slant inward)
  ctx.fillStyle = "#1a0000";
  ctx.fillRect(8, 1, 7, 2);
  ctx.fillRect(19, 1, 7, 2);

  // Horns
  ctx.fillStyle = "#e8c000";
  ctx.fillRect(8, -4, 4, 6);
  ctx.fillRect(20, -4, 4, 6);

  // Feet
  ctx.fillStyle = "#5a3800";
  ctx.fillRect(4, 28, 8, 4);
  ctx.fillRect(20, 28, 8, 4);
  // Claws
  ctx.fillStyle = "#c8a000";
  ctx.fillRect(4, 31, 2, 3);
  ctx.fillRect(7, 31, 2, 3);
  ctx.fillRect(20, 31, 2, 3);
  ctx.fillRect(23, 31, 2, 3);

  ctx.restore();

  // ── Hearts (HP) above Bowser ────────────────────────────────────────
  const heartY = sy - 12;
  const heartStartX = sx + BOWSER_W / 2 - (3 * 10) / 2 + 2;
  for (let i = 0; i < 3; i++) {
    const hx = heartStartX + i * 10;
    ctx.save();
    ctx.font = "10px sans-serif";
    ctx.fillStyle = i < b.hp ? "#ff2244" : "#444";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("♥", hx, heartY);
    ctx.restore();
  }

  // ── "BOWSER" label ──────────────────────────────────────────────────
  ctx.save();
  ctx.font = '500 5px "Press Start 2P", monospace';
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  ctx.fillStyle = "#ff4400";
  ctx.fillText("BOWSER", sx + BOWSER_W / 2, sy - 14);
  ctx.restore();
}
