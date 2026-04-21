import { TILE, GROUND_ROW, VIEW_W } from "./constants.js";
import { state } from "./state.js";
import { showScreen } from "./ui.js";
import { fullReset, applyPlayerDamage } from "./level.js";

// ── Constants ─────────────────────────────────────────────────────────────
export const BOWSER_TRIGGER_COL = 338;
export const BOWSER_SPAWN_COL = 350;
export const BOWSER_W = 32;
export const BOWSER_H = 32;

// ── Challenge data ────────────────────────────────────────────────────────
export const BOWSER_EVENT = {
  name: "Interviewer Boss",
  color: "#ff4400",
  topic: "Final Interview",
  intro:
    "So, you made it to HQ.\n" +
    "I am the Hiring Manager.\n" +
    "Pass this final interview or get auto-rejected.\n" +
    "Show me what you learned!",
  challenges: [
    {
      id: "bowser-0",
      question:
        'Challenge 1: Introduce yourself!\n' +
        'Write two print() statements:\n' +
        '  Line 1 → print "I am ready!"\n' +
        '  Line 2 → print "Ready to ship code!"',
      answer: 'print("I am ready!")\nprint("Ready to ship code!")',
      hint:
        'Two separate print() lines:\n\nprint("I am ready!")\nprint("Ready to ship code!")\n\nEach message in its own print() call.',
      indentNote: null,
      successMsg: "Solid opener. Now show decision-making under pressure.",
    },
    {
      id: "bowser-1",
      question:
        'Challenge 2: One last check!\n' +
        'Write an if/else that checks if  hp  is greater than 0.\n' +
        'If yes, print "Ship it!". If no, print "Rejected.". \n' +
        '(Assume  hp = 3  is already set above.)',
      answer: 'if hp > 0:\n    print("Ship it!")\nelse:\n    print("Rejected.")',
      hint:
        'Pattern:\n\nif condition:\n    print("...")\nelse:\n    print("...")\n\nRules:\n• End if: and else: with a colon\n• 4 spaces of indent inside each block\n• else: lines up with if (no indent)',
      indentNote: '⚠ Indentation: use exactly 4 spaces before each print() inside the if/else blocks.',
      successMsg: "Impressive. Final round unlocked.",
    },
  ],
};

const WIN_MESSAGES = [
  "Offer secured.",
  "You got hired.",
  "Welcome to the tech industry.",
  "Salary unlocked.",
  "Software Engineer Achieved.",
];

function randomFrom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

// ── Trigger check ─────────────────────────────────────────────────────────
export function checkBowserTrigger() {
  if (state.worldIndex !== 1) return;
  if (state.bowserDialogDone || state.activeBowser) return;
  if (state.player.x >= BOWSER_TRIGGER_COL * TILE) {
    state.activeBowser = true;
    // Switch to intense music
    const bgMusic = document.getElementById("bg-music");
    const intenseMusic = document.getElementById("intense-music");
    if (bgMusic) bgMusic.pause();
    if (intenseMusic) intenseMusic.play().catch(() => { });
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
      state.toastMessage = randomFrom(WIN_MESSAGES);
      state.toastUntil = Date.now() + 3200;
      // Switch back to normal music
      const bgMusic = document.getElementById("bg-music");
      const intenseMusic = document.getElementById("intense-music");
      if (intenseMusic) intenseMusic.pause();
      if (bgMusic) bgMusic.play().catch(() => { });
      setTimeout(() => {
        showVictoryScreen();
      }, 3500);
    }
  } else if (overlapX && py + ph > b.y + 2 && py < b.y + BOWSER_H) {
    if (b.hitTimer === 0) applyPlayerDamage();
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

  // Body — suit jacket (dark blue)
  ctx.fillStyle = "#1a1a4a";
  ctx.fillRect(4, 10, 24, 20);
  // Shirt (white)
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(6, 12, 20, 8);
  // Tie (red)
  ctx.fillStyle = "#cc0000";
  ctx.fillRect(14, 12, 4, 12);

  // Head — skin tone
  ctx.fillStyle = "#f5deb3";
  ctx.fillRect(8, 0, 16, 12);
  // Hair (dark)
  ctx.fillStyle = "#2a2a2a";
  ctx.fillRect(8, 0, 16, 4);

  // Eyes — stern (black)
  ctx.fillStyle = "#000000";
  ctx.fillRect(10, 4, 3, 3);
  ctx.fillRect(19, 4, 3, 3);
  // Eyebrows (thick, angry)
  ctx.fillStyle = "#2a2a2a";
  ctx.fillRect(9, 2, 5, 2);
  ctx.fillRect(18, 2, 5, 2);

  // Mouth — frowning
  ctx.fillStyle = "#000000";
  ctx.fillRect(14, 8, 4, 2);

  // Arms (suit sleeves)
  ctx.fillStyle = "#1a1a4a";
  ctx.fillRect(0, 12, 6, 8);
  ctx.fillRect(26, 12, 6, 8);

  // Legs (pants)
  ctx.fillStyle = "#000033";
  ctx.fillRect(8, 28, 6, 4);
  ctx.fillRect(18, 28, 6, 4);

  // Shoes
  ctx.fillStyle = "#333333";
  ctx.fillRect(6, 30, 8, 2);
  ctx.fillRect(18, 30, 8, 2);

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

  // ── Boss label ───────────────────────────────────────────────────────
  ctx.save();
  ctx.font = '500 5px "Press Start 2P", monospace';
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  ctx.fillStyle = "#ff4400";
  ctx.fillText("INTERVIEWER", sx + BOWSER_W / 2, sy - 14);
  ctx.restore();
}
