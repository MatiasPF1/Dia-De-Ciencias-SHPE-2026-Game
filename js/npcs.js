import { TILE, GROUND_ROW, VIEW_W } from "./constants.js";
import { state } from "./state.js";

// ── NPC column positions (in tile columns) ────────────────────────────────
// Spread across the level: ~col 42, 100, 170, 245
export const NPCS = [
  {
    id: 0,
    col: 42,
    name: "Prof. Pixel",
    color: "#4cffaa",
    topic: "print()",
    intro: "Hey intern!\nI am Prof. Pixel from CS 101.\nLet's level up your first coding move.\nReady to start your journey?",
    teach: "In Python, print() makes the computer speak.\nType print() and put your message in quotes.\nIt is the first move in almost every coding path.",
    example: 'print("Hello, World!")',
    output: "Hello, World!",
    question: 'Use print() to display the text:  Hello, Recruiter!\n(Type exactly what you would write in Python.)',
    answer: 'print("Hello, Recruiter!")',
    hint: 'Wrap the text in double quotes inside print().\nLike this pattern:  print("your text here")',
    successMsg: "Clean output! You just earned your first career XP.",
  },
  {
    id: 1,
    col: 105,
    name: "Dev Varya",
    color: "#6ec0ff",
    topic: "Variables",
    intro: "Welcome to bootcamp!\nI am Dev Varya, keeper of Variables.\nEvery engineer needs to store data clearly.\nThat is your next upgrade.",
    teach: "A variable is a named container that holds a value.\nYou create one by writing its name, then =, then the value.\nYou can store text, numbers, or anything you like.",
    example: 'name = "Alex"\nprint(name)',
    output: "Alex",
    question: 'Create a variable called  xp  that holds the number  10\nand then print it.\n(Write both lines, separated by a newline.)',
    answer: 'xp = 10\nprint(xp)',
    hint: 'Line 1: variableName = value   (no quotes for numbers)\nLine 2: print(variableName)',
    successMsg: "Nice! Variables power dashboards, apps, and your future paycheck.",
  },
  {
    id: 2,
    col: 178,
    name: "Coach Iffy",
    color: "#ffb830",
    topic: "if / else",
    intro: "Greetings, candidate!\nI am Coach Iffy, master of Decisions.\nI teach code how to choose smart paths.\nInterview systems love this.",
    teach: "An if/else block checks a condition.\nIf the condition is true, the first block of code runs.\nOtherwise, the else block runs instead.\nDon't forget the colon : and 4 spaces of indent!",
    example: 'offers = 1\nif offers > 0:\n    print("Hired!")\nelse:\n    print("Keep applying!")',
    output: "Hired!",
    question: 'Write an if/else that checks if  interviews  is greater than 0.\nIf yes, print "Game on!". If no, print "Back to Indeed.". \n(Assume  interviews = 3  is already defined above.)',
    answer: 'if interviews > 0:\n    print("Game on!")\nelse:\n    print("Back to Indeed.")',
    hint: 'Pattern (copy spacing exactly!):\n\nif condition:\n    print("...")\nelse:\n    print("...")\n\nRules:\n• End if: and else: with a colon :\n• Lines INSIDE each block: 4 spaces of indent\n• else: has NO indent — it lines up with if',
    indentNote: '⚠ Indentation: use exactly 4 spaces before each print() that sits inside the if or else block.',
    successMsg: "Excellent! Conditional logic is interview gold.",
  },
  {
    id: 3,
    col: 252,
    name: "Mentor Funky",
    color: "#ff7eb3",
    topic: "Functions",
    intro: "Yo, future engineer!\nI am Mentor Funky.\nFunctions keep your code reusable and clean.\nLet's build like a pro.",
    teach: "A function is a reusable block of code.\nYou define it with the def keyword, give it a name, then write the code indented inside.\nOnce defined, you call it by name to run it.",
    example: 'def greet(name):\n    print("Hi, " + name)\n\ngreet("Hiring Manager")',
    output: "Hi, Hiring Manager",
    question: 'Write a function called  jump  that takes no arguments\nand prints "Boing!". Then call it once.',
    answer: 'def jump():\n    print("Boing!")\n\njump()',
    hint: 'Pattern (copy spacing exactly!):\n\ndef functionName():\n    print("...")\n\nfunctionName()\n\nRules:\n• End def ...: with a colon :\n• Line INSIDE the function: 4 spaces of indent\n• The call jump() has NO indent — it is outside\n• Leave one blank line between def block and call',
    indentNote: '⚠ Indentation: use exactly 4 spaces before print() inside the function. The call jump() goes on a new line with no indent.',
    successMsg: "Function unlocked! You are building real engineer habits now.",
  },
];

// ── Princess position ─────────────────────────────────────────────────────
export const PRINCESS_COL = 358; // hiring manager office entrance

// ── Gate column (magic barrier) ───────────────────────────────────────────
export const GATE_COL = 332; // interview gate before HQ

const NPC_PROXIMITY = 48; // pixels — how close to trigger [E] bubble

// ── Draw helpers ─────────────────────────────────────────────────────────

function drawWizard(ctx, sx, sy, color, completed) {
  // Body (hoodie)
  ctx.fillStyle = color;
  ctx.fillRect(sx + 3, sy + 12, 10, 14);
  // Head
  ctx.fillStyle = "#f8d0a0";
  ctx.fillRect(sx + 4, sy + 4, 8, 9);
  // Beanie
  ctx.fillStyle = color;
  ctx.fillRect(sx + 3, sy, 10, 5);
  ctx.fillRect(sx + 5, sy - 4, 6, 5);
  // Eyes
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(sx + 5, sy + 7, 2, 2);
  ctx.fillRect(sx + 9, sy + 7, 2, 2);
  // Badge on hoodie
  ctx.fillStyle = "#66e0ff";
  ctx.fillRect(sx + 7, sy + 16, 2, 2);
  // Feet
  ctx.fillStyle = "#4a3000";
  ctx.fillRect(sx + 4, sy + 24, 3, 3);
  ctx.fillRect(sx + 9, sy + 24, 3, 3);

  if (completed) {
    // Certification badge above head
    ctx.fillStyle = "#40ff90";
    ctx.fillRect(sx + 6, sy - 10, 5, 5);
    ctx.fillStyle = "#fff";
    ctx.fillRect(sx + 7, sy - 9, 2, 2);
  }
}

function drawEBubble(ctx, sx, sy, pulse) {
  const alpha = 0.75 + Math.sin(pulse) * 0.25;
  ctx.save();
  ctx.globalAlpha = alpha;
  // Bubble background
  ctx.fillStyle = "#1a1a2e";
  ctx.strokeStyle = "#ffdd00";
  ctx.lineWidth = 1;
  ctx.fillRect(sx - 2, sy - 18, 20, 13);
  ctx.strokeRect(sx - 2, sy - 18, 20, 13);
  // [E] text
  ctx.globalAlpha = alpha;
  ctx.fillStyle = "#ffdd00";
  ctx.font = '700 7px "Press Start 2P", monospace';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("[E]", sx + 8, sy - 12);
  ctx.restore();
}

function drawNameLabel(ctx, sx, sy, name, color) {
  ctx.save();
  ctx.font = '500 6px "Press Start 2P", monospace';
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  ctx.fillStyle = color;
  ctx.fillText(name, sx + 8, sy - 2);
  ctx.restore();
}

// ── Draw hiring manager office target ─────────────────────────────────────
export function drawPrincess(ctx) {
  if (state.worldIndex !== 1) return;
  const wx = PRINCESS_COL * TILE;
  const sx = Math.round(wx - state.camX);
  const sy = GROUND_ROW * TILE - 28;
  if (sx + 20 < 0 || sx > VIEW_W) return;

  // Office tower body
  ctx.fillStyle = "#6a88aa";
  ctx.fillRect(sx - 2, sy + 6, 20, 22);
  // Windows
  ctx.fillStyle = "#bde3ff";
  ctx.fillRect(sx + 1, sy + 9, 4, 4);
  ctx.fillRect(sx + 7, sy + 9, 4, 4);
  ctx.fillRect(sx + 13, sy + 9, 3, 4);
  ctx.fillRect(sx + 1, sy + 15, 4, 4);
  ctx.fillRect(sx + 7, sy + 15, 4, 4);
  ctx.fillRect(sx + 13, sy + 15, 3, 4);
  // Offer letter icon
  ctx.fillStyle = "#f8d0a0";
  ctx.fillRect(sx + 5, sy - 4, 8, 8);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(sx + 6, sy - 3, 6, 6);
  ctx.fillStyle = "#3a4a5a";
  ctx.fillRect(sx + 7, sy - 1, 4, 1);
  ctx.fillRect(sx + 7, sy + 1, 4, 1);

  // Name
  ctx.save();
  ctx.font = '500 6px "Press Start 2P", monospace';
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  ctx.fillStyle = "#8fd3ff";
  ctx.fillText("HQ", sx + 8, sy - 8);
  ctx.restore();

  if (state.gems >= state.gemsRequired) {
    // Sparkle around offer letter when requirements are met
    const t = Date.now() / 300;
    for (let i = 0; i < 4; i++) {
      const angle = t + (i * Math.PI) / 2;
      const px2 = sx + 8 + Math.cos(angle) * 14;
      const py2 = sy + 12 + Math.sin(angle) * 10;
      ctx.fillStyle = "#ffd700";
      ctx.fillRect(Math.round(px2), Math.round(py2), 2, 2);
    }
  }
}

// ── Draw interview gate ────────────────────────────────────────────────────
export function drawGate(ctx) {
  const gateBlocked =
    state.gems < state.gemsRequired ||
    state.goombas.some(g => g.alive) ||
    state.levelCoins < state.totalCoins;
  if (!gateBlocked) return;
  const wx = GATE_COL * TILE;
  const sx = Math.round(wx - state.camX);
  if (sx + 16 < 0 || sx > VIEW_W) return;

  const t = Date.now() / 500;
  const groundY = GROUND_ROW * TILE;

  for (let y = 0; y < groundY; y += 4) {
    const alpha = 0.4 + Math.sin(t + y * 0.08) * 0.3;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "#9040ff";
    ctx.fillRect(sx, y, 4, 4);
    ctx.restore();
  }

  // Top label — show remaining requirements
  ctx.save();
  const labelAlpha = 0.7 + Math.sin(t) * 0.3;
  ctx.globalAlpha = labelAlpha;
  ctx.font = '500 5px "Press Start 2P", monospace';
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  ctx.fillStyle = "#cc88ff";
  const enemiesLeft = state.goombas.filter(g => g.alive).length;
  const coinsLeft = state.totalCoins - state.levelCoins;
  let label;
  if (state.gems < state.gemsRequired) label = `badges:${state.gems}/${state.gemsRequired}`;
  else if (enemiesLeft > 0) label = `issues:${enemiesLeft}`;
  else if (coinsLeft > 0) label = `xp:${coinsLeft}`;
  else label = "open!";
  ctx.fillText(label, sx + 2, groundY - 4);
  ctx.restore();
}

// ── Draw all NPCs ─────────────────────────────────────────────────────────
export function drawNpcs(ctx) {
  const pulse = Date.now() / 400;
  const base = state.worldIndex * 2;
  for (const npc of [NPCS[base], NPCS[base + 1]]) {
    if (!npc) continue;
    const wx = npc.col * TILE;
    const sx = Math.round(wx - state.camX);
    const sy = GROUND_ROW * TILE - 28;
    if (sx + 20 < -20 || sx > VIEW_W + 20) continue;

    const completed = state.npcsCompleted[npc.id];
    drawWizard(ctx, sx, sy, npc.color, completed);
    drawNameLabel(ctx, sx, sy, npc.name, npc.color);

    if (!completed) {
      const dx = Math.abs(state.player.x - wx);
      if (dx < NPC_PROXIMITY) {
        drawEBubble(ctx, sx, sy, pulse);
      }
    }
  }
}

// ── Interaction check ─────────────────────────────────────────────────────
export function checkNpcInteraction() {
  if (state.activeNpc !== null) return; // dialog already open
  const base = state.worldIndex * 2;
  for (const npc of [NPCS[base], NPCS[base + 1]]) {
    if (!npc) continue;
    if (state.npcsCompleted[npc.id]) continue;
    const dx = Math.abs(state.player.x - npc.col * TILE);
    if (dx < NPC_PROXIMITY && state.keys.interact) {
      state.activeNpc = npc.id;
      state.keys.interact = false;
      return;
    }
  }

  // Check HQ proximity for end-goal interaction (level 2 only)
  if (state.worldIndex === 1 && state.gems >= state.gemsRequired) {
    const dx = Math.abs(state.player.x - PRINCESS_COL * TILE);
    if (dx < NPC_PROXIMITY && state.keys.interact) {
      state.princessRescued = true;
      state.keys.interact = false;
    }
  }
}
