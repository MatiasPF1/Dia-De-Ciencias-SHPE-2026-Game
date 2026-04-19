(function () {
  "use strict";

  const VIEW_W = 512;
  const VIEW_H = 384;
  const TILE = 16;
  const ROWS = 24;
  const COLS = 368;
  const GROUND_ROW = 21;
  const LEVEL_W = COLS * TILE;
  const LEVEL_H = ROWS * TILE;

  const PLAYER = {
    marioHat: "#e01828",
    luigiHat: "#40c030",
    overall: "#2040c8",
    overallDark: "#102878",
    glove: "#f8f8f8",
    skin: "#f8b868",
    hair: "#604018",
    shoe: "#604018",
  };

  /** @type {{ label: string; skyTop: string; skyBot: string; hillNear: string; hillNearDark: string; hillFar: string; hillFarDark: string; bush: string; bushDark: string; cloud: string; cloudEdge: string; groundTop: string; groundFill: string; groundDark: string; grassStripe: string; brickHi: string; brickMid: string; brickLo: string; brickMortar: string; qFill: string; qEdge: string; qHi: string; blockMetal: string; blockMetalDark: string; pipe: string; pipeDark: string; pipeLight: string; pole: string; poleDark: string; poleLight: string; flag: string; flagStripe: string; pitColor: string; pitLine: string; hudBar: string; hudBorder: string; hudText: string; hudShadow: string; backdrop: "overworld" | "underground" | "athletic" }[]} */
  const THEMES = [
    {
      label: "1-1",
      skyTop: "#5c94fc",
      skyBot: "#c8e8ff",
      hillNear: "#00b000",
      hillNearDark: "#006800",
      hillFar: "#20d020",
      hillFarDark: "#009010",
      bush: "#00c020",
      bushDark: "#007810",
      cloud: "#f8fcff",
      cloudEdge: "#b8d0f0",
      groundTop: "#c86818",
      groundFill: "#fc9838",
      groundDark: "#884010",
      grassStripe: "#208028",
      brickHi: "#fc9838",
      brickMid: "#d06008",
      brickLo: "#883008",
      brickMortar: "#401808",
      qFill: "#f8c020",
      qEdge: "#c08000",
      qHi: "#fff070",
      blockMetal: "#b8b8d8",
      blockMetalDark: "#585868",
      pipe: "#00c800",
      pipeDark: "#007800",
      pipeLight: "#b8f8a0",
      pole: "#40a018",
      poleDark: "#205008",
      poleLight: "#68c838",
      flag: "#f8f8f8",
      flagStripe: "#e01828",
      pitColor: "#181820",
      pitLine: "#303040",
      hudBar: "#201810",
      hudBorder: "#f8d868",
      hudText: "#fff8c8",
      hudShadow: "#000000",
      backdrop: "overworld",
    },
    {
      label: "1-2",
      skyTop: "#080618",
      skyBot: "#282040",
      hillNear: "#504038",
      hillNearDark: "#302820",
      hillFar: "#383028",
      hillFarDark: "#201810",
      bush: "#685848",
      bushDark: "#403028",
      cloud: "#484058",
      cloudEdge: "#302838",
      groundTop: "#786058",
      groundFill: "#a89078",
      groundDark: "#483830",
      grassStripe: "#506848",
      brickHi: "#c8a878",
      brickMid: "#886848",
      brickLo: "#584028",
      brickMortar: "#301810",
      qFill: "#f0a818",
      qEdge: "#a07010",
      qHi: "#ffd850",
      blockMetal: "#9090a0",
      blockMetalDark: "#484858",
      pipe: "#00a800",
      pipeDark: "#005000",
      pipeLight: "#78b060",
      pole: "#509030",
      poleDark: "#285018",
      poleLight: "#70b848",
      flag: "#f0f0f0",
      flagStripe: "#e83030",
      pitColor: "#040408",
      pitLine: "#101018",
      hudBar: "#100818",
      hudBorder: "#b898f8",
      hudText: "#e8d8ff",
      hudShadow: "#000000",
      backdrop: "underground",
    },
    {
      label: "1-3",
      skyTop: "#4070c8",
      skyBot: "#98d0f8",
      hillNear: "#689028",
      hillNearDark: "#405018",
      hillFar: "#88b038",
      hillFarDark: "#507020",
      bush: "#78a030",
      bushDark: "#486018",
      cloud: "#f8faf8",
      cloudEdge: "#c0d8e8",
      groundTop: "#e88828",
      groundFill: "#f8b050",
      groundDark: "#a85818",
      grassStripe: "#489028",
      brickHi: "#f8a038",
      brickMid: "#d07018",
      brickLo: "#904010",
      brickMortar: "#502010",
      qFill: "#ffd820",
      qEdge: "#d09810",
      qHi: "#fff898",
      blockMetal: "#c0b8d8",
      blockMetalDark: "#686078",
      pipe: "#00c018",
      pipeDark: "#006010",
      pipeLight: "#a0e878",
      pole: "#489020",
      poleDark: "#285010",
      poleLight: "#68c040",
      flag: "#ffffff",
      flagStripe: "#f01828",
      pitColor: "#181008",
      pitLine: "#302018",
      hudBar: "#281808",
      hudBorder: "#f8a848",
      hudText: "#ffe8c0",
      hudShadow: "#000000",
      backdrop: "athletic",
    },
  ];

  function palette() {
    return THEMES[worldIndex];
  }

  /** @type {HTMLCanvasElement | null} */
  let canvas = null;
  /** @type {CanvasRenderingContext2D | null} */
  let ctx = null;
  /** @type {HTMLImageElement | null} */
  let playerSheet = null;

  let selectedChar = "mario";
  let worldIndex = 0;
  let score = 0;
  let coins = 0;
  let lives = 3;
  let timeLeft = 400;
  let timeAcc = 0;
  let gameOver = false;
  let levelDone = false;
  let gameWin = false;
  let paused = false;
  let camX = 0;

  /** @type {{x:number,y:number,vy:number,life:number}[]} */
  let coinParticles = [];

  /** @type {{x:number,y:number,vx:number,alive:boolean,squished:boolean,squishTimer:number}[]} */
  let goombas = [];

  /** @type {number[][]} */
  let tiles = [];

  const keys = {
    left: false,
    right: false,
    jump: false,
    jumpHeld: false,
  };

  const FLAG_COL = COLS - 12;
  const SPAWN_X = 48;

  const player = {
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
  };

  const T = {
    EMPTY: 0,
    GROUND: 1,
    BRICK: 2,
    QUESTION: 3,
    BLOCK: 4,
    STAIR: 5,
    POLE: 6,
    FLAG_TOP: 7,
    PIPE: 8,
  };

  function isSolid(t) {
    return (
      t === T.GROUND ||
      t === T.BRICK ||
      t === T.QUESTION ||
      t === T.BLOCK ||
      t === T.STAIR ||
      t === T.PIPE
    );
  }

  function buildWorld1_1() {
    const m = Array.from({ length: ROWS }, () => Array(COLS).fill(T.EMPTY));
    const G = GROUND_ROW;

    function fillGround(from, to) {
      for (let c = from; c <= to; c++) {
        if (c < 0 || c >= COLS) continue;
        m[G][c] = T.GROUND;
        m[G + 1][c] = T.GROUND;
        m[G + 2][c] = T.GROUND;
      }
    }

    function carvePit(from, to) {
      for (let c = from; c <= to; c++) {
        if (c < 0 || c >= COLS) continue;
        m[G][c] = T.EMPTY;
        m[G + 1][c] = T.EMPTY;
        m[G + 2][c] = T.EMPTY;
      }
    }

    function brickRect(c0, c1, r0, r1) {
      for (let r = r0; r <= r1; r++) {
        for (let c = c0; c <= c1; c++) {
          if (c >= 0 && c < COLS && r >= 0 && r < ROWS) m[r][c] = T.BRICK;
        }
      }
    }

    function qRow(c0, c1, r) {
      for (let c = c0; c <= c1; c++) {
        if (c >= 0 && c < COLS && r >= 0 && r < ROWS) m[r][c] = T.QUESTION;
      }
    }

    function pipe(c, bodyH) {
      const rBase = G;
      for (let i = 0; i < bodyH; i++) {
        const r = rBase - 1 - i;
        if (r >= 0) {
          m[r][c] = T.PIPE;
          m[r][c + 1] = T.PIPE;
        }
      }
      const rTop = rBase - bodyH;
      if (rTop - 1 >= 0) {
        m[rTop - 1][c] = T.PIPE;
        m[rTop - 1][c + 1] = T.PIPE;
      }
    }

    function stairs(cStart, steps) {
      for (let s = 0; s < steps; s++) {
        const c0 = cStart + s;
        const h = s + 1;
        for (let k = 0; k < h; k++) {
          const r = G - k;
          if (r >= 0 && c0 < COLS) m[r][c0] = T.STAIR;
        }
      }
    }

    fillGround(0, COLS - 1);

    // no pits — decorative coin rows where pits used to be
    qRow(54, 58, G - 3);
    qRow(118, 123, G - 3);
    qRow(172, 177, G - 3);
    qRow(238, 244, G - 3);

    brickRect(14, 16, G - 4, G - 4);
    qRow(10, 10, G - 4);
    qRow(12, 12, G - 4);
    qRow(11, 11, G - 8);

    brickRect(28, 39, G - 4, G - 4);
    qRow(34, 34, G - 8);

    pipe(48, 2);
    pipe(94, 3);
    pipe(132, 4);

    brickRect(156, 158, G - 5, G - 5);
    qRow(160, 162, G - 5);

    brickRect(200, 206, G - 6, G - 6);
    brickRect(214, 220, G - 4, G - 4);

    qRow(248, 248, G - 4);
    brickRect(252, 255, G - 4, G - 4);

    // Approach staircase — 8 steps ending 4 cols before the flag
    stairs(FLAG_COL - 12, 8);

    // Flagpole — 8 tiles tall (flag banner comfortably above ground, not at ceiling)
    for (let k = 0; k < 8; k++) {
      const r = G - 1 - k;
      if (r >= 0) m[r][FLAG_COL] = T.POLE;
    }
    if (G - 9 >= 0) m[G - 9][FLAG_COL] = T.FLAG_TOP;

    // Castle wall after the flag
    for (let k = 0; k < 6; k++) {
      const c = FLAG_COL + 3 + k;
      if (c < COLS) {
        for (let r = G - 5; r <= G; r++) m[r][c] = T.BLOCK;
      }
    }
    // battlements on top of castle
    for (let k = 0; k < 3; k++) {
      const c = FLAG_COL + 3 + k * 2;
      if (c < COLS) m[G - 6][c] = T.BLOCK;
    }

    return m;
  }

  function tileCoords(ax, ay, aw, ah) {
    const c0 = Math.max(0, Math.floor(ax / TILE));
    const c1 = Math.min(COLS - 1, Math.floor((ax + aw - 0.001) / TILE));
    const r0 = Math.max(0, Math.floor(ay / TILE));
    const r1 = Math.min(ROWS - 1, Math.floor((ay + ah - 0.001) / TILE));
    return { c0, c1, r0, r1 };
  }

  function overlapsSolid(ax, ay, aw, ah) {
    const { c0, c1, r0, r1 } = tileCoords(ax, ay, aw, ah);
    for (let r = r0; r <= r1; r++) {
      for (let c = c0; c <= c1; c++) {
        if (isSolid(tiles[r][c])) return true;
      }
    }
    return false;
  }

  function loadLevel() {
    tiles = buildWorld1_1();
    timeLeft = 400;
    timeAcc = 0;
    levelDone = false;
    gameWin = false;
    camX = 0;
    player.x = SPAWN_X;
    player.y = GROUND_ROW * TILE - player.h;
    player.vx = 0;
    player.vy = 0;
    player.invuln = 0;
    // Spawn goombas at fixed column positions (on ground)
    const gY = GROUND_ROW * TILE - 16;
    goombas = [
      22, 38, 65, 80, 100, 140, 155, 190, 210, 260, 280, 310
    ].map(col => ({ x: col * TILE, y: gY, vx: -0.7, alive: true, squished: false, squishTimer: 0 }));
    coinParticles = [];
  }

  function fullReset() {
    worldIndex = 0;
    score = 0;
    coins = 0;
    lives = 3;
    gameOver = false;
    levelDone = false;
    gameWin = false;
    loadLevel();
    syncGameShellTheme();
  }

  function advanceAfterClear() {
    if (worldIndex < THEMES.length - 1) {
      worldIndex++;
      loadLevel();
      syncGameShellTheme();
    } else {
      gameWin = true;
      levelDone = false;
      setTimeout(() => { fullReset(); }, 2000);
    }
  }

  function respawn() {
    player.x = SPAWN_X;
    player.y = GROUND_ROW * TILE - player.h;
    player.vx = 0;
    player.vy = 0;
    camX = Math.max(0, Math.min(LEVEL_W - VIEW_W, player.x - VIEW_W * 0.35));
  }

  function updateCamera() {
    const target = player.x + player.w / 2 - VIEW_W * 0.42;
    camX += (target - camX) * 0.07;
    if (camX < 0) camX = 0;
    if (camX > LEVEL_W - VIEW_W) camX = LEVEL_W - VIEW_W;
  }

  function updatePlayer() {
    const C = palette();
    const runAccel = 0.22;
    const runMax = C.backdrop === "underground" ? 1.65 : 1.85;
    const friction = 0.86;
    const gravity = C.backdrop === "underground" ? 0.18 : 0.20;
    const jumpSpeed = -8.5;
    const jumpCut = 0.45;

    if (player.invuln > 0) player.invuln--;

    let input = 0;
    if (keys.left) input -= 1;
    if (keys.right) input += 1;
    if (input !== 0) player.facing = input > 0 ? 1 : -1;

    if (input !== 0) {
      player.vx += input * runAccel;
      if (player.vx > runMax) player.vx = runMax;
      if (player.vx < -runMax) player.vx = -runMax;
    } else {
      player.vx *= friction;
      if (Math.abs(player.vx) < 0.04) player.vx = 0;
    }

    player.coyote = player.onGround ? 6 : player.coyote - 1;
    if (keys.jump && !keys.jumpHeld) player.jumpBuf = 10;
    keys.jumpHeld = keys.jump;

    if (player.jumpBuf > 0 && player.coyote > 0) {
      player.vy = jumpSpeed;
      player.onGround = false;
      player.coyote = 0;
      player.jumpBuf = 0;
    }
    player.jumpBuf = Math.max(0, player.jumpBuf - 1);
    if (!keys.jump && player.vy < -2) player.vy *= jumpCut;

    player.vy += gravity;
    if (player.vy > 6.0) player.vy = 6.0;

    let nx = player.x + player.vx;
    if (overlapsSolid(nx, player.y, player.w, player.h)) {
      if (player.vx > 0) {
        nx = Math.floor((nx + player.w) / TILE) * TILE - player.w - 0.001;
      } else if (player.vx < 0) {
        nx = Math.ceil(nx / TILE) * TILE + 0.001;
      }
      player.vx = 0;
    }
    player.x = nx;
    if (player.x < 0) player.x = 0;
    if (player.x + player.w > LEVEL_W) player.x = LEVEL_W - player.w;

    let ny = player.y + player.vy;
    player.onGround = false;
    if (overlapsSolid(player.x, ny, player.w, player.h)) {
      if (player.vy > 0) {
        const { c0, c1, r0, r1 } = tileCoords(player.x, ny, player.w, player.h);
        let topY = Infinity;
        for (let r = r0; r <= r1; r++) {
          for (let c = c0; c <= c1; c++) {
            if (!isSolid(tiles[r][c])) continue;
            const ty = r * TILE;
            if (ty < topY) topY = ty;
          }
        }
        if (topY !== Infinity) {
          ny = topY - player.h;
          player.vy = 0;
          player.onGround = true;
        }
      } else if (player.vy < 0) {
        const { c0, c1, r0, r1 } = tileCoords(player.x, ny, player.w, player.h);
        let botY = -Infinity;
        for (let r = r0; r <= r1; r++) {
          for (let c = c0; c <= c1; c++) {
            if (!isSolid(tiles[r][c])) continue;
            const by = (r + 1) * TILE;
            if (by > botY) botY = by;
          }
        }
        if (botY !== -Infinity) {
          ny = botY;
          player.vy = 0;
          // check if any of those tiles are question blocks
          const { c0: qc0, c1: qc1, r0: qr0, r1: qr1 } = tileCoords(player.x, ny - 1, player.w, player.h);
          for (let r = qr0; r <= qr1; r++) {
            for (let c = qc0; c <= qc1; c++) {
              if (tiles[r][c] === T.QUESTION) {
                tiles[r][c] = T.BLOCK; // spent
                coins += 1;
                score += 200;
                coinParticles.push({ x: c * TILE + TILE / 2, y: r * TILE, vy: -3.5, life: 40 });
              }
            }
          }
        }
      }
    }
    player.y = ny;

    if (player.y > LEVEL_H + 64) {
      player.invuln = 60;
      respawn();
    }

    if (player.onGround && (keys.left || keys.right)) player.anim++;
    else if (!player.onGround) player.anim++;

    if (!levelDone && !gameWin && player.x > FLAG_COL * TILE + 8) {
      levelDone = true;
      score += Math.floor(timeLeft) * 50;
      setTimeout(() => { levelDone = false; advanceAfterClear(); }, 1200);
    }

    if (!gameOver && !levelDone && !gameWin) {
      timeAcc += 1;
      if (timeAcc >= 40) {
        timeAcc = 0;
        timeLeft = Math.max(0, timeLeft - 1);
      }
    }
  }

  function updateCoinParticles() {
    for (const p of coinParticles) {
      p.y += p.vy;
      p.vy += 0.22;
      p.life--;
    }
    coinParticles = coinParticles.filter(p => p.life > 0);
  }

  function drawCoinParticles() {
    for (const p of coinParticles) {
      const sx = Math.round(p.x - camX);
      const sy = Math.round(p.y);
      const alpha = Math.min(1, p.life / 15);
      ctx.save();
      ctx.globalAlpha = alpha;
      // coin circle
      ctx.fillStyle = "#ffe040";
      ctx.beginPath();
      ctx.arc(sx, sy, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#c89000";
      ctx.beginPath();
      ctx.arc(sx, sy, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function updateGoombas() {
    const GW = 16, GH = 16;
    for (const g of goombas) {
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
      if (aheadC >= 0 && aheadC < COLS && midR >= 0 && midR < ROWS && isSolid(tiles[midR][aheadC])) {
        g.vx = -g.vx;
      }
      // reverse at pit edge
      const footC = Math.floor((g.x + (g.vx < 0 ? 0 : GW)) / TILE);
      const belowR = Math.floor((g.y + GH + 1) / TILE);
      if (belowR >= 0 && belowR < ROWS && footC >= 0 && footC < COLS && !isSolid(tiles[belowR][footC])) {
        g.vx = -g.vx;
      }

      // stomp check: player falling onto goomba
      if (player.invuln === 0) {
        const px = player.x, py = player.y, pw = player.w, ph = player.h;
        const overlapX = px + pw > g.x + 2 && px < g.x + GW - 2;
        const overlapY = py + ph > g.y && py + ph < g.y + GH * 0.7;
        if (overlapX && overlapY && player.vy > 0) {
          // stomp
          g.squished = true;
          g.squishTimer = 24;
          player.vy = -5;
          score += 100;
        } else if (overlapX && py + ph > g.y + 2 && py < g.y + GH) {
          // side hit — flash only, no death
          if (player.invuln === 0) {
            player.invuln = 90;
          }
        }
      }
    }
  }

  function drawGoombas() {
    const GW = 16, GH = 16;
    for (const g of goombas) {
      if (!g.alive) continue;
      const sx = Math.round(g.x - camX);
      const sy = Math.round(g.y);
      if (sx + GW < 0 || sx > VIEW_W) continue;
      ctx.save();
      ctx.translate(sx, sy);

      if (g.squished) {
        // flat squished body
        ctx.fillStyle = "#5c3008";
        ctx.fillRect(0, GH - 5, GW, 5);
        ctx.fillStyle = "#8b4513";
        ctx.fillRect(1, GH - 8, GW - 2, 4);
        // eyes still visible
        ctx.fillStyle = "#fff";
        ctx.fillRect(2, GH - 7, 3, 2);
        ctx.fillRect(GW - 5, GH - 7, 3, 2);
        ctx.fillStyle = "#000";
        ctx.fillRect(3, GH - 7, 2, 2);
        ctx.fillRect(GW - 4, GH - 7, 2, 2);
        ctx.restore();
        continue;
      }

      // feet (animate by world x)
      const step = Math.floor(g.x / 6) % 2;
      ctx.fillStyle = "#3a1a00";
      ctx.fillRect(1 + step,     GH - 5, 5, 5);
      ctx.fillRect(GW - 6 - step, GH - 5, 5, 5);

      // body
      ctx.fillStyle = "#8b4513";
      ctx.fillRect(2, GH - 13, GW - 4, 9);
      // body highlight
      ctx.fillStyle = "#c46020";
      ctx.fillRect(3, GH - 12, GW - 6, 3);

      // head (round-ish)
      ctx.fillStyle = "#8b4513";
      ctx.fillRect(1, 1, GW - 2, GH - 13);
      ctx.fillRect(0, 3, GW, GH - 16);
      // head top dark
      ctx.fillStyle = "#5c2e08";
      ctx.fillRect(2, 0, GW - 4, 3);
      ctx.fillRect(0, 2, 2, 2);
      ctx.fillRect(GW - 2, 2, 2, 2);

      // eyes white
      ctx.fillStyle = "#fff";
      ctx.fillRect(2, 4, 4, 4);
      ctx.fillRect(GW - 6, 4, 4, 4);
      // pupils (angry, pointing inward)
      ctx.fillStyle = "#000";
      ctx.fillRect(4, 5, 2, 3);
      ctx.fillRect(GW - 6, 5, 2, 3);
      // eyebrow (angry)
      ctx.fillStyle = "#3a1a00";
      ctx.fillRect(2, 3, 4, 1);
      ctx.fillRect(GW - 6, 3, 4, 1);

      ctx.restore();
    }
  }
  function drawPlumberModern(px, py, facing, frame, hat) {
    const screenX = px - camX;
    const w = player.w;
    const h = player.h;
    ctx.save();
    ctx.translate(
      Math.round(screenX) + (facing < 0 ? w : 0),
      Math.round(py)
    );
    ctx.scale(facing < 0 ? -1 : 1, 1);
    ctx.imageSmoothingEnabled = false;

    const S = PLAYER;
    const isAir = frame === 3;
    const walk = frame % 2;

    // ── boots ──
    ctx.fillStyle = S.shoe;
    if (!isAir) {
      // grounded: feet slightly staggered
      ctx.fillRect(2 + walk,     h - 7, 6, 7);
      ctx.fillRect(w - 8 - walk, h - 7, 6, 7);
      // boot toe
      ctx.fillRect(1 + walk,     h - 4, 8, 4);
      ctx.fillRect(w - 9 - walk, h - 4, 8, 4);
    } else {
      // airborne: feet tucked
      ctx.fillRect(3,     h - 6, 5, 6);
      ctx.fillRect(w - 8, h - 6, 5, 6);
      ctx.fillRect(2,     h - 3, 7, 3);
      ctx.fillRect(w - 9, h - 3, 7, 3);
    }

    // ── overalls ──
    const ovY = Math.round(h * 0.46);
    const ovH = h - ovY - 7;
    ctx.fillStyle = S.overall;
    ctx.fillRect(3, ovY, w - 6, ovH);
    // bib highlight
    ctx.fillStyle = S.overallDark;
    ctx.fillRect(3, ovY, 2, ovH);
    ctx.fillRect(w - 5, ovY, 2, ovH);
    // suspender buttons
    ctx.fillStyle = "#ffd23c";
    ctx.fillRect(5, ovY + 2, 2, 2);
    ctx.fillRect(w - 7, ovY + 2, 2, 2);

    // ── shirt / arms ──
    ctx.fillStyle = S.skin;
    // torso peek
    ctx.fillRect(3, Math.round(h * 0.32), w - 6, Math.round(h * 0.15));
    // arms
    const armY = Math.round(h * 0.33);
    ctx.fillStyle = S.skin;
    if (!isAir) {
      ctx.fillRect(0,     armY + walk,     3, 8);
      ctx.fillRect(w - 3, armY - walk,     3, 8);
    } else {
      ctx.fillRect(0,     armY - 3, 3, 8);
      ctx.fillRect(w - 3, armY - 3, 3, 8);
    }
    // gloves
    ctx.fillStyle = S.glove;
    if (!isAir) {
      ctx.fillRect(-1,    armY + 5 + walk,  5, 5);
      ctx.fillRect(w - 4, armY + 5 - walk,  5, 5);
    } else {
      ctx.fillRect(-2,    armY + 2, 5, 5);
      ctx.fillRect(w - 3, armY + 2, 5, 5);
    }

    // ── head / face ──
    const headY = 3;
    const headH = Math.round(h * 0.32) - headY;
    ctx.fillStyle = S.skin;
    ctx.fillRect(3, headY + 6, w - 6, headH - 2);

    // mustache
    ctx.fillStyle = S.hair;
    ctx.fillRect(4,     headY + headH - 1, 4, 3);
    ctx.fillRect(w - 8, headY + headH - 1, 4, 3);
    ctx.fillRect(5,     headY + headH + 1, w - 10, 2);

    // eyes
    ctx.fillStyle = "#141414";
    const eyeY = headY + Math.round(headH * 0.45);
    ctx.fillRect(w - 7, eyeY, 3, 3);
    // whites
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.fillRect(w - 6, eyeY, 2, 2);

    // ── hat ──
    const hatHi  = hat === S.luigiHat ? "#8ef07a" : "#ff7060";
    const hatDark = hat === S.luigiHat ? "#1a5010" : "#780810";
    // brim
    ctx.fillStyle = hatDark;
    ctx.fillRect(1, headY + 6, w - 2, 2);
    ctx.fillStyle = hat;
    ctx.fillRect(2, headY + 5, w - 4, 2);
    // crown
    ctx.fillStyle = hat;
    ctx.fillRect(3, headY,     w - 3, 7);
    // highlight strip
    ctx.fillStyle = hatHi;
    ctx.fillRect(4, headY + 1, w - 5, 2);
    // hair under brim
    ctx.fillStyle = S.hair;
    ctx.fillRect(3,     headY + 7, 3, 2);

    ctx.restore();
  }

  function drawPlayerSheet(f) {
    if (!playerSheet || !ctx) return false;
    const nw = playerSheet.naturalWidth;
    const nh = playerSheet.naturalHeight;
    if (nw < 32 || nh < 16) return false;
    const fw = Math.floor(nw / 4);
    const twoRows = nh * 2 > nw;
    const fh = twoRows ? Math.floor(nh / 2) : nh;
    const row = twoRows && selectedChar === "luigi" ? 1 : 0;
    if (f < 0 || f > 3) f = 0;
    const sx = f * fw;
    const sy = row * fh;
    const destW = player.w;
    const destH = player.h;
    const px = player.x - camX;
    const py = player.y;
    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    if (player.facing < 0) {
      ctx.translate(px + destW, py);
      ctx.scale(-1, 1);
      ctx.drawImage(playerSheet, sx, sy, fw, fh, 0, 0, destW, destH);
    } else {
      ctx.drawImage(playerSheet, sx, sy, fw, fh, px, py, destW, destH);
    }
    ctx.restore();
    return true;
  }

  function drawPlayer() {
    if (player.invuln > 0 && Math.floor(player.invuln / 4) % 2 === 0) return;
    const hat = selectedChar === "luigi" ? PLAYER.luigiHat : PLAYER.marioHat;
    let fr = 0;
    if (!player.onGround) fr = 3;
    else if (keys.left || keys.right)
      fr = 1 + (Math.floor(player.anim / 8) % 2);
    if (drawPlayerSheet(fr)) return;
    drawPlumberModern(player.x, player.y, player.facing, fr, hat);
  }

  function drawGroundTile(sx, sy, C) {
    ctx.fillStyle = C.groundDark;
    ctx.fillRect(sx, sy, TILE, TILE);
    ctx.fillStyle = C.groundFill;
    ctx.fillRect(sx + 1, sy + 1, TILE - 2, TILE - 2);
    ctx.fillStyle = C.groundTop;
    ctx.fillRect(sx, sy, TILE, 4);
    ctx.fillStyle = C.grassStripe;
    ctx.fillRect(sx, sy, TILE, 2);
    ctx.fillStyle = C.brickMortar;
    ctx.fillRect(sx + 4, sy + 8, 8, 2);
    ctx.fillRect(sx + 4, sy + 14, 8, 2);
  }

  function drawBrickTile(sx, sy, C) {
    ctx.fillStyle = C.brickMortar;
    ctx.fillRect(sx, sy, TILE, TILE);
    ctx.fillStyle = C.brickLo;
    ctx.fillRect(sx + 1, sy + 1, TILE - 2, TILE - 2);
    ctx.fillStyle = C.brickMid;
    ctx.fillRect(sx + 2, sy + 2, TILE - 4, TILE - 4);
    ctx.fillStyle = C.brickHi;
    ctx.fillRect(sx + 2, sy + 2, TILE - 4, 3);
    ctx.fillRect(sx + 2, sy + 2, 3, TILE - 4);
    ctx.fillStyle = C.brickLo;
    ctx.fillRect(sx + TILE / 2, sy + 4, 2, TILE - 8);
    ctx.fillRect(sx + 4, sy + TILE / 2, TILE - 8, 2);
  }

  function drawQuestionTile(sx, sy, C) {
    ctx.fillStyle = C.qEdge;
    ctx.fillRect(sx, sy, TILE, TILE);
    ctx.fillStyle = C.qFill;
    ctx.fillRect(sx + 2, sy + 2, TILE - 4, TILE - 4);
    ctx.fillStyle = C.qHi;
    ctx.fillRect(sx + 3, sy + 3, TILE - 6, 4);
    ctx.fillRect(sx + 3, sy + 3, 4, TILE - 6);
    ctx.fillStyle = "#784000";
    ctx.font = '600 11px "DM Sans", system-ui, sans-serif';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("?", sx + TILE / 2, sy + TILE / 2 + 1);
  }

  function drawMetalTile(sx, sy, C) {
    ctx.fillStyle = C.blockMetalDark;
    ctx.fillRect(sx, sy, TILE, TILE);
    ctx.fillStyle = C.blockMetal;
    ctx.fillRect(sx + 1, sy + 1, TILE - 2, TILE - 2);
    ctx.fillStyle = C.blockMetalDark;
    ctx.fillRect(sx + 3, sy + 3, TILE - 6, 2);
    ctx.fillRect(sx + 3, sy + 7, TILE - 6, 2);
  }

  function drawStairTile(sx, sy, C) {
    drawBrickTile(sx, sy, C);
  }

  function drawPoleTile(sx, sy, C) {
    ctx.fillStyle = C.poleDark;
    ctx.fillRect(sx + 5, sy, 6, TILE);
    ctx.fillStyle = C.pole;
    ctx.fillRect(sx + 6, sy, 4, TILE);
    ctx.fillStyle = C.poleLight;
    ctx.fillRect(sx + 6, sy, 1, TILE);
  }

  function drawPipeTile(sx, sy, C) {
    ctx.fillStyle = C.pipeDark;
    ctx.fillRect(sx, sy, TILE, TILE);
    ctx.fillStyle = C.pipe;
    ctx.fillRect(sx + 2, sy, TILE - 4, TILE);
    ctx.fillStyle = C.pipeLight;
    ctx.fillRect(sx + 2, sy, 3, TILE);
    ctx.fillStyle = C.pipeDark;
    ctx.fillRect(sx + 3, sy + TILE - 4, TILE - 6, 3);
  }

  function drawFlagTop(sx, sy, C) {
    drawPoleTile(sx, sy, C);
    ctx.fillStyle = C.flag;
    ctx.beginPath();
    ctx.moveTo(sx + 12, sy + 2);
    ctx.lineTo(sx + 28, sy + 8);
    ctx.lineTo(sx + 12, sy + 14);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = C.flagStripe;
    ctx.fillRect(sx + 12, sy + 5, 10, 3);
  }

  function drawParallaxBackdrop(C) {
    const g = ctx.createLinearGradient(0, 0, 0, VIEW_H);
    g.addColorStop(0, C.skyTop);
    g.addColorStop(1, C.skyBot);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);

    const gy = GROUND_ROW * TILE;

    if (C.backdrop === "underground") {
      const scroll = (camX * 0.15) % 32;
      for (let y = 0; y < 56; y += 16) {
        for (let x = -32 - scroll; x < VIEW_W + 32; x += 16) {
          drawBrickTile(x, y, C);
        }
      }
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      ctx.fillRect(0, 56, VIEW_W, gy - 56);
      for (let i = 0; i < 40; i++) {
        const rx = ((i * 47 + camX * 0.05) % VIEW_W) | 0;
        const ry = 60 + ((i * 31) % (gy - 80));
        ctx.fillStyle = "rgba(255,200,120,0.04)";
        ctx.fillRect(rx, ry, 2, 2);
      }
      return;
    }

    const px = camX * 0.22;
    ctx.fillStyle = C.hillFar;
    for (let i = -1; i < 8; i++) {
      const bx = ((i * 180 - (px % 180)) | 0) - 40;
      ctx.beginPath();
      ctx.ellipse(bx + 90, gy + 36, 110, 70, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = C.hillFarDark;
    for (let i = -1; i < 8; i++) {
      const bx = ((i * 180 - (px % 180)) | 0) - 40;
      ctx.beginPath();
      ctx.ellipse(bx + 100, gy + 48, 90, 55, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    const px2 = camX * 0.45;
    ctx.fillStyle = C.hillNear;
    for (let i = -1; i < 6; i++) {
      const bx = ((i * 260 - (px2 % 260)) | 0) - 60;
      ctx.beginPath();
      ctx.ellipse(bx + 120, gy + 22, 130, 85, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = C.hillNearDark;
    for (let i = -1; i < 6; i++) {
      const bx = ((i * 260 - (px2 % 260)) | 0) - 60;
      ctx.beginPath();
      ctx.ellipse(bx + 135, gy + 36, 100, 62, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    const cx = camX * 0.65;
    for (let i = -1; i < 10; i++) {
      const bx = Math.floor(i * 140 - (cx % 140));
      ctx.fillStyle = C.bushDark;
      ctx.fillRect(bx + 20, gy - 18, 36, 18);
      ctx.fillStyle = C.bush;
      ctx.fillRect(bx + 22, gy - 20, 32, 20);
    }

    if (C.backdrop === "athletic") {
      ctx.fillStyle = "rgba(255,220,160,0.12)";
      ctx.fillRect(0, 0, VIEW_W, VIEW_H * 0.45);
    }

    const cloudOff = camX * 0.08;
    for (let i = -1; i < 6; i++) {
      const bx = Math.floor(i * 200 - (cloudOff % 200));
      const cy = 40 + (i % 3) * 28;
      ctx.fillStyle = C.cloudEdge;
      ctx.fillRect(bx + 30, cy, 48, 18);
      ctx.fillRect(bx + 44, cy - 10, 40, 16);
      ctx.fillStyle = C.cloud;
      ctx.fillRect(bx + 32, cy + 2, 44, 14);
      ctx.fillRect(bx + 46, cy - 8, 36, 12);
    }
  }

  function drawWorld(C) {
    const c0 = Math.max(0, Math.floor(camX / TILE) - 1);
    const c1 = Math.min(COLS - 1, Math.ceil((camX + VIEW_W) / TILE) + 1);
    for (let r = 0; r < ROWS; r++) {
      for (let c = c0; c <= c1; c++) {
        const t = tiles[r][c];
        if (t === T.EMPTY) continue;
        const sx = c * TILE - camX;
        const sy = r * TILE;
        if (sx > VIEW_W + TILE || sx < -TILE) continue;
        switch (t) {
          case T.GROUND:
            drawGroundTile(sx, sy, C);
            break;
          case T.BRICK:
            drawBrickTile(sx, sy, C);
            break;
          case T.QUESTION:
            drawQuestionTile(sx, sy, C);
            break;
          case T.BLOCK:
            drawMetalTile(sx, sy, C);
            break;
          case T.STAIR:
            drawStairTile(sx, sy, C);
            break;
          case T.POLE:
            drawPoleTile(sx, sy, C);
            break;
          case T.FLAG_TOP:
            drawFlagTop(sx, sy, C);
            break;
          case T.PIPE:
            drawPipeTile(sx, sy, C);
            break;
          default:
            break;
        }
      }
    }
  }

  function draw() {
    if (!ctx) return;
    const C = palette();
    drawParallaxBackdrop(C);
    drawWorld(C);
    drawGoombas();
    drawCoinParticles();
    drawPlayer();
  }

  function setHudDom() {
    const th = THEMES[worldIndex];
    const who = selectedChar === "luigi" ? "LUIGI" : "MARIO";
    const $ = (id) => document.getElementById(id);
    const n = $("hud-ovl-name");
    const sc = $("hud-ovl-score");
    const lv = $("hud-ovl-lives");
    const wo = $("hud-ovl-world");
    const co = $("hud-ovl-coins");
    const ti = $("hud-ovl-time");
    if (n) n.textContent = who;
    if (sc) sc.textContent = String(score).padStart(6, "0");
    if (lv) lv.textContent = "× " + lives;
    if (wo) wo.textContent = th.label;
    if (co) co.textContent = String(coins);
    if (ti) ti.textContent = String(Math.floor(timeLeft));

    const modal = $("game-modal");
    const mt = $("modal-title");
    const ms = $("modal-sub");
    if (modal && mt) {
      modal.hidden = true;
    }
  }

  function tick() {
    const gameEl = document.getElementById("game-screen");
    if (!ctx || !gameEl || gameEl.hidden) return;
    if (paused) return;

    if (!gameOver && !gameWin) {
      updatePlayer();
      updateCamera();
      updateGoombas();
      updateCoinParticles();
    }
    draw();
  }

  function loop() {
    tick();
    setHudDom();
    requestAnimationFrame(loop);
  }

  function bindKeys() {
    window.addEventListener("keydown", (e) => {
      if (e.code === "ArrowLeft" || e.code === "KeyA") keys.left = true;
      if (e.code === "ArrowRight" || e.code === "KeyD") keys.right = true;
      if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW") {
        e.preventDefault();
        keys.jump = true;
      }
    });
    window.addEventListener("keyup", (e) => {
      if (e.code === "ArrowLeft" || e.code === "KeyA") keys.left = false;
      if (e.code === "ArrowRight" || e.code === "KeyD") keys.right = false;
      if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW")
        keys.jump = false;
    });
  }

  function showScreen(id) {
    document.querySelectorAll(".screen").forEach((el) => {
      el.classList.remove("active");
      el.hidden = true;
    });
    const next = document.getElementById(id);
    if (next) {
      next.hidden = false;
      next.classList.add("active");
    }
  }

  function syncGameShellTheme() {
    const shell = document.querySelector(".game-shell");
    if (!shell) return;
    shell.dataset.world = String(worldIndex + 1);
  }

  function initDom() {
    canvas = document.getElementById("game-canvas");
    ctx = canvas ? canvas.getContext("2d") : null;
    if (ctx) ctx.imageSmoothingEnabled = false;

    function loadPlayerArt() {
      const paths = ["assets/mario-character.png", "assets/mario-sheet.png"];
      function attempt(i) {
        if (i >= paths.length) {
          playerSheet = null;
          return;
        }
        const img = new Image();
        img.decoding = "async";
        img.onload = () => {
          playerSheet = img;
        };
        img.onerror = () => attempt(i + 1);
        img.src = new URL(paths[i], document.baseURI).href;
      }
      attempt(0);
    }
    loadPlayerArt();

    document.getElementById("btn-play")?.addEventListener("click", () => {
      // Update character name in story screen
      const nameEl = document.getElementById("story-char-name");
      if (nameEl) nameEl.textContent = selectedChar === "luigi" ? "Luigi" : "Mario";
      showScreen("story-screen");

      function startGame() {
        showScreen("game-screen");
        fullReset();
        paused = false;
        document.removeEventListener("keydown", onStoryKey);
        document.getElementById("story-screen")?.removeEventListener("click", startGame);
      }
      function onStoryKey(e) {
        if (e.code === "Enter" || e.code === "Space") { e.preventDefault(); startGame(); }
      }
      document.addEventListener("keydown", onStoryKey);
      document.getElementById("story-screen")?.addEventListener("click", startGame);
    });

    document.getElementById("btn-char")?.addEventListener("click", () => {
      showScreen("char-screen");
    });

    document.getElementById("char-back")?.addEventListener("click", () => {
      showScreen("intro-screen");
    });

    document.querySelectorAll(".char-card").forEach((btn) => {
      btn.addEventListener("click", () => {
        const c = btn.getAttribute("data-char");
        if (c === "mario" || c === "luigi") selectedChar = c;
        showScreen("intro-screen");
      });
    });

    document.getElementById("btn-quit")?.addEventListener("click", () => {
      paused = true;
      showScreen("intro-screen");
    });

    bindKeys();
    if (ctx) requestAnimationFrame(loop);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initDom);
  } else {
    initDom();
  }
})();
