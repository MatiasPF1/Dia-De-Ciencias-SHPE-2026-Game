import { TILE, GROUND_ROW, VIEW_W } from "./constants.js";
import { state } from "./state.js";

// ── NPC column positions (in tile columns) ────────────────────────────────
// Spread across the level: ~col 42, 100, 170, 245
export const NPCS = [
  {
    id: 0,
    col: 42,
    name: "Pixel",
    color: "#4cffaa",
    topic: "print()",
    intro: "Hey there, traveller!\nI am Pixel, the Print Wizard.\nI have been teaching coders the very first spell for centuries.\nAre you ready to learn?",
    teach: "In Python, print() makes the computer speak.\nYou write print() and put your message inside — wrapped in quotes.\nEvery Python program you have ever seen starts with this.",
    example: 'print("Hello, World!")',
    output: "Hello, World!",
    question: 'Use print() to display the text:  Hello, Mario!\n(Type exactly what you would write in Python.)',
    answer: 'print("Hello, Mario!")',
    hint: 'Wrap the text in double quotes inside print().\nLike this pattern:  print("your text here")',
    successMsg: "Brilliant! You just spoke to the computer. That is the first spell every coder learns!",
  },
  {
    id: 1,
    col: 105,
    name: "Varya",
    color: "#6ec0ff",
    topic: "Variables",
    intro: "Welcome, brave traveller!\nI am Varya, keeper of Variables.\nEvery great wizard knows how to store knowledge.\nAnd that is exactly what I teach.",
    teach: "A variable is a named container that holds a value.\nYou create one by writing its name, then =, then the value.\nYou can store text, numbers, or anything you like.",
    example: 'name = "Mario"\nprint(name)',
    output: "Mario",
    question: 'Create a variable called  coins  that holds the number  10\nand then print it.\n(Write both lines, separated by a newline.)',
    answer: 'coins = 10\nprint(coins)',
    hint: 'Line 1: variableName = value   (no quotes for numbers)\nLine 2: print(variableName)',
    successMsg: "Well done! Variables let your program remember things. Every game uses thousands of them!",
  },
  {
    id: 2,
    col: 178,
    name: "Iffy",
    color: "#ffb830",
    topic: "if / else",
    intro: "Greetings, wanderer!\nI am Iffy, master of Decisions.\nI give programs the power to think — to choose their own path.\nListen closely.",
    teach: "An if/else block checks a condition.\nIf the condition is true, the first block of code runs.\nOtherwise, the else block runs instead.\nDon't forget the colon : and 4 spaces of indent!",
    example: 'coins = 5\nif coins > 0:\n    print("Rich!")\nelse:\n    print("Broke!")',
    output: "Rich!",
    question: 'Write an if/else that checks if  lives  is greater than 0.\nIf yes, print "Game on!". If no, print "Game over!".\n(Assume  lives = 3  is already defined above.)',
    answer: 'if lives > 0:\n    print("Game on!")\nelse:\n    print("Game over!")',
    hint: 'Pattern (copy spacing exactly!):\n\nif condition:\n    print("...")\nelse:\n    print("...")\n\nRules:\n• End if: and else: with a colon :\n• Lines INSIDE each block: 4 spaces of indent\n• else: has NO indent — it lines up with if',
    indentNote: '⚠ Indentation: use exactly 4 spaces before each print() that sits inside the if or else block.',
    successMsg: "Excellent! Conditions are the brain of every program. You are thinking like a coder now!",
  },
  {
    id: 3,
    col: 252,
    name: "Funky",
    color: "#ff7eb3",
    topic: "Functions",
    intro: "Yo, coder!\nI am Funky, the Function Wizard.\nI teach the ancient art of giving code a name — so you can call it whenever you want.\nPay attention!",
    teach: "A function is a reusable block of code.\nYou define it with the def keyword, give it a name, then write the code indented inside.\nOnce defined, you call it by name to run it.",
    example: 'def greet(name):\n    print("Hi, " + name)\n\ngreet("Mario")',
    output: "Hi, Mario",
    question: 'Write a function called  jump  that takes no arguments\nand prints "Boing!". Then call it once.',
    answer: 'def jump():\n    print("Boing!")\n\njump()',
    hint: 'Pattern (copy spacing exactly!):\n\ndef functionName():\n    print("...")\n\nfunctionName()\n\nRules:\n• End def ...: with a colon :\n• Line INSIDE the function: 4 spaces of indent\n• The call jump() has NO indent — it is outside\n• Leave one blank line between def block and call',
    indentNote: '⚠ Indentation: use exactly 4 spaces before print() inside the function. The call jump() goes on a new line with no indent.',
    successMsg: "You just wrote your first function! Functions are how you build big programs from small pieces.",
  },
];

// ── Princess position ─────────────────────────────────────────────────────
export const PRINCESS_COL = 358; // just past the flagpole area

// ── Gate column (magic barrier) ───────────────────────────────────────────
export const GATE_COL = 332; // ~21 tiles before flag

const NPC_PROXIMITY = 48; // pixels — how close to trigger [E] bubble

// ── Draw helpers ─────────────────────────────────────────────────────────

function drawWizard(ctx, sx, sy, color, completed) {
  // Body (robe)
  ctx.fillStyle = color;
  ctx.fillRect(sx + 3, sy + 12, 10, 14);
  // Head
  ctx.fillStyle = "#f8d0a0";
  ctx.fillRect(sx + 4, sy + 4, 8, 9);
  // Hat
  ctx.fillStyle = color;
  ctx.fillRect(sx + 3, sy, 10, 5);
  ctx.fillRect(sx + 5, sy - 4, 6, 5);
  // Eyes
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(sx + 5, sy + 7, 2, 2);
  ctx.fillRect(sx + 9, sy + 7, 2, 2);
  // Star on hat
  ctx.fillStyle = "#fff700";
  ctx.fillRect(sx + 7, sy + 1, 2, 2);
  // Feet
  ctx.fillStyle = "#4a3000";
  ctx.fillRect(sx + 4, sy + 24, 3, 3);
  ctx.fillRect(sx + 9, sy + 24, 3, 3);

  if (completed) {
    // Gem above head
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

// ── Draw princess ─────────────────────────────────────────────────────────
export function drawPrincess(ctx) {
  if (state.worldIndex !== 1) return;
  const wx = PRINCESS_COL * TILE;
  const sx = Math.round(wx - state.camX);
  const sy = GROUND_ROW * TILE - 28;
  if (sx + 20 < 0 || sx > VIEW_W) return;

  // Dress
  ctx.fillStyle = "#ff88cc";
  ctx.fillRect(sx + 3, sy + 12, 10, 14);
  // Head
  ctx.fillStyle = "#f8d0a0";
  ctx.fillRect(sx + 4, sy + 4, 8, 9);
  // Crown
  ctx.fillStyle = "#ffd700";
  ctx.fillRect(sx + 4, sy, 8, 4);
  ctx.fillRect(sx + 5, sy - 3, 2, 4);
  ctx.fillRect(sx + 9, sy - 3, 2, 4);
  // Eyes
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(sx + 5, sy + 7, 2, 2);
  ctx.fillRect(sx + 9, sy + 7, 2, 2);
  // Feet
  ctx.fillStyle = "#cc6688";
  ctx.fillRect(sx + 4, sy + 24, 3, 3);
  ctx.fillRect(sx + 9, sy + 24, 3, 3);

  // Name
  ctx.save();
  ctx.font = '500 6px "Press Start 2P", monospace';
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  ctx.fillStyle = "#ff88cc";
  ctx.fillText("Prince", sx + 8, sy - 6);
  ctx.restore();

  if (state.gems >= state.gemsRequired) {
    // Sparkle around prince when rescued
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

// ── Draw magic gate ───────────────────────────────────────────────────────
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

  // Top label — show what's still needed
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
  if (state.gems < state.gemsRequired) label = `gems:${state.gems}/${state.gemsRequired}`;
  else if (enemiesLeft > 0) label = `foes:${enemiesLeft}`;
  else if (coinsLeft > 0) label = `coins:${coinsLeft}`;
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

  // Check princess proximity for win condition (level 2 only)
  if (state.worldIndex === 1 && state.gems >= state.gemsRequired) {
    const dx = Math.abs(state.player.x - PRINCESS_COL * TILE);
    if (dx < NPC_PROXIMITY && state.keys.interact) {
      state.princessRescued = true;
      state.keys.interact = false;
    }
  }
}
