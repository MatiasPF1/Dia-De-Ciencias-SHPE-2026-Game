export const VIEW_W = 512;
export const VIEW_H = 384;
export const TILE = 16;
export const ROWS = 24;
export const COLS = 368;
export const GROUND_ROW = 21;
export const LEVEL_W = COLS * TILE;
export const LEVEL_H = ROWS * TILE;
export const FLAG_COL = COLS - 12;
export const SPAWN_X = 48;

export const PLAYER = {
  marioHat: "#4da3ff",
  luigiHat: "#7bd86a",
  overall: "#4f6b8a",
  overallDark: "#34485f",
  glove: "#f8f8f8",
  skin: "#f8b868",
  hair: "#2f2a28",
  shoe: "#2f2a28",
  backpack: "#3a2f6b",
  backpackDark: "#251d45",
  hoodie: "#6f8fb2",
  hoodieDark: "#4b6888",
};

/** @type {{ label: string; skyTop: string; skyBot: string; hillNear: string; hillNearDark: string; hillFar: string; hillFarDark: string; bush: string; bushDark: string; cloud: string; cloudEdge: string; groundTop: string; groundFill: string; groundDark: string; grassStripe: string; brickHi: string; brickMid: string; brickLo: string; brickMortar: string; qFill: string; qEdge: string; qHi: string; blockMetal: string; blockMetalDark: string; pipe: string; pipeDark: string; pipeLight: string; pole: string; poleDark: string; poleLight: string; flag: string; flagStripe: string; pitColor: string; pitLine: string; hudBar: string; hudBorder: string; hudText: string; hudShadow: string; backdrop: "overworld" | "underground" | "athletic" }[]} */
export const THEMES = [
  {
    label: "Campus",
    skyTop: "#87CEEB", // Sky blue
    skyBot: "#E0F6FF", // Light sky blue
    hillNear: "#708090", // Slate gray (buildings)
    hillNearDark: "#2F4F4F", // Dark slate gray
    hillFar: "#A9A9A9", // Dark gray (distant buildings)
    hillFarDark: "#696969", // Dim gray
    bush: "#32CD32", // Lime green (trees/park areas)
    bushDark: "#228B22", // Forest green
    cloud: "#FFFFFF", // White clouds
    cloudEdge: "#F0F8FF", // Alice blue
    groundTop: "#696969", // Dim gray (concrete)
    groundFill: "#D3D3D3", // Light gray (sidewalk)
    groundDark: "#A9A9A9", // Dark gray
    grassStripe: "#228B22", // Forest green (grass patches)
    brickHi: "#CD853F", // Peru (building bricks)
    brickMid: "#A0522D", // Sienna
    brickLo: "#8B4513", // Saddle brown
    brickMortar: "#696969", // Dim gray
    qFill: "#FFD700", // Gold (question blocks)
    qEdge: "#FFA500", // Orange
    qHi: "#FFFF00", // Yellow
    blockMetal: "#C0C0C0", // Silver (metal blocks)
    blockMetalDark: "#808080", // Gray
    pipe: "#228B22", // Forest green (park pipes)
    pipeDark: "#006400", // Dark green
    pipeLight: "#90EE90", // Light green
    pole: "#8B4513", // Saddle brown (street lamps)
    poleDark: "#654321", // Dark brown
    poleLight: "#D2691E", // Chocolate
    flag: "#FFFFFF", // White
    flagStripe: "#DC143C", // Crimson (flag stripes)
    pitColor: "#2F4F4F", // Dark slate gray
    pitLine: "#FF6347", // Tomato
    hudBar: "#2F4F4F", // Dark slate gray
    hudBorder: "#FFD700", // Gold
    hudText: "#FFFFFF", // White
    hudShadow: "#000000", // Black
    backdrop: "overworld",
  },
  {
    label: "Interview Prep",
    skyTop: "#E6F3FF", // Very light blue (office ceiling)
    skyBot: "#B3D9FF", // Light blue
    hillNear: "#F5F5F5", // White smoke (walls)
    hillNearDark: "#D3D3D3", // Light gray
    hillFar: "#E8E8E8", // Very light gray (distant walls)
    hillFarDark: "#BEBEBE", // Gray
    bush: "#4169E1", // Royal blue (office chairs/tables)
    bushDark: "#0000CD", // Medium blue
    cloud: "#F0F8FF", // Alice blue (office lights)
    cloudEdge: "#E6E6FA", // Lavender
    groundTop: "#F5F5DC", // Beige (carpet)
    groundFill: "#FFFACD", // Lemon chiffon
    groundDark: "#F0E68C", // Khaki
    grassStripe: "#32CD32", // Lime green (plants)
    brickHi: "#DDA0DD", // Plum (office partitions)
    brickMid: "#BA55D3", // Medium orchid
    brickLo: "#8A2BE2", // Blue violet
    brickMortar: "#9370DB", // Medium purple
    qFill: "#00CED1", // Dark turquoise (learning materials)
    qEdge: "#20B2AA", // Light sea green
    qHi: "#40E0D0", // Turquoise
    blockMetal: "#C0C0C0", // Silver (computers)
    blockMetalDark: "#A9A9A9", // Dark gray
    pipe: "#FF6347", // Tomato (cables)
    pipeDark: "#DC143C", // Crimson
    pipeLight: "#FF7F50", // Coral
    pole: "#8B4513", // Saddle brown (desks)
    poleDark: "#654321", // Dark brown
    poleLight: "#D2691E", // Chocolate
    flag: "#FFFFFF", // White (paper)
    flagStripe: "#000080", // Navy (text)
    pitColor: "#2F4F4F", // Dark slate gray (shadows)
    pitLine: "#FF4500", // Orange red
    hudBar: "#191970", // Midnight blue
    hudBorder: "#00BFFF", // Deep sky blue
    hudText: "#E0FFFF", // Light cyan
    hudShadow: "#000000", // Black
    backdrop: "underground",
  },
  {
    label: "Company HQ",
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
    pitColor: "#4c1212",
    pitLine: "#ff7f50",
    hudBar: "#281808",
    hudBorder: "#f8a848",
    hudText: "#ffe8c0",
    hudShadow: "#000000",
    backdrop: "athletic",
  },
];

export const T = {
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
