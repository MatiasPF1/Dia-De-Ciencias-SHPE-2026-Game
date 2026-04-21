import { SPAWN_X, GROUND_ROW, TILE } from "./constants.js";

export const state = {
  /** @type {HTMLCanvasElement | null} */
  canvas: null,
  /** @type {CanvasRenderingContext2D | null} */
  ctx: null,
  /** @type {HTMLImageElement | null} */
  playerSheet: null,

  selectedChar: "mario",
  worldIndex: 0,
  score: 0,
  coins: 0,
  lives: 3,
  timeLeft: 400,
  timeAcc: 0,
  gameOver: false,
  levelDone: false,
  gameWin: false,
  paused: false,
  camX: 0,
  toastMessage: "",
  toastUntil: 0,

  /** @type {{x:number,y:number,vy:number,life:number}[]} */
  coinParticles: [],

  /** @type {{x:number,y:number,vx:number,alive:boolean,squished:boolean,squishTimer:number}[]} */
  goombas: [],

  /** @type {number[][]} */
  tiles: [],

  keys: {
    left: false,
    right: false,
    jump: false,
    jumpHeld: false,
    interact: false,
  },

  // ── NPC / gem state ───────────────────────────────────────────────────
  gems: 0,
  gemsRequired: 2,
  npcsCompleted: [false, false, false, false],
  activeNpc: null,        // index of currently open NPC dialog, or null
  princessRescued: false,

  // ── Level completion tracking ────────────────────────────────────────
  levelCoins: 0,   // ? blocks hit this level
  totalCoins: 0,   // total ? blocks available this level

  // ── Bowser boss fight ─────────────────────────────────────────────────
  /** @type {{ x:number, y:number, vx:number, hp:number, hitTimer:number, alive:boolean } | null} */
  bowser: null,
  bowserDefeated: false,
  bowserDialogDone: false,
  activeBowser: false,

  player: {
    x: SPAWN_X,
    y: GROUND_ROW * TILE - 32,
    w: 22,
    h: 32,
    vx: 0,
    vy: 0,
    onGround: false,
    facing: 1,
    coyote: 0,
    jumpBuf: 0,
    invuln: 0,
    anim: 0,
    health: 3,
  },
};
