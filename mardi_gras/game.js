/* ============================================================
   TEDDY'S MARDI GRAS BALL
   A retro NES-style Mardi Gras game
   ============================================================ */

// ============================================================
// SECTION 1: CONSTANTS & CONFIGURATION
// ============================================================

const CANVAS_WIDTH = 256;
const CANVAS_HEIGHT = 240;
const HUD_HEIGHT = 22;
const PLAY_TOP = HUD_HEIGHT;
const PLAY_BOTTOM = CANVAS_HEIGHT;

// Road zone boundaries
const HOUSE_LEFT_START = 0;
const HOUSE_LEFT_END = 39;
const SIDEWALK_LEFT_START = 40;
const SIDEWALK_LEFT_END = 55;
const ROAD_LEFT = 56;
const ROAD_RIGHT = 199;
const SIDEWALK_RIGHT_START = 200;
const SIDEWALK_RIGHT_END = 215;
const HOUSE_RIGHT_START = 216;
const HOUSE_RIGHT_END = 255;

const ROAD_CENTER = Math.floor((ROAD_LEFT + ROAD_RIGHT) / 2);

const TEDDY_SPEED = 60;
const BEAD_SPEED = 100;
const BEAD_COOLDOWN = 0.3;
const INVINCIBLE_DURATION = 2.0;
const LEVEL_COMPLETE_DELAY = 3.0;

const COLORS = {
  purple: '#7B2D8B',
  purpleDark: '#4A1A54',
  purpleLight: '#A855C8',
  green: '#18A558',
  greenDark: '#0D6B38',
  greenLight: '#3DD87A',
  gold: '#FFD700',
  goldDark: '#B8960C',
  goldLight: '#FFE94A',
  black: '#000000',
  white: '#FFFFFF',
  brown: '#8B4513',
  brownLight: '#D2A66A',
  brownDark: '#5C2D0E',
  skin: '#FFD6A5',
  skinDark: '#E8B87A',
  red: '#E63946',
  blue: '#457B9D',
  gray: '#808080',
  grayLight: '#B0B0B0',
  grayDark: '#505050',
  asphalt: '#3C3C3C',
  asphaltLight: '#4A4A4A',
  sidewalk: '#C8B896',
  sidewalkDark: '#B0A080',
  grassGreen: '#2D8B2D',
  grassLight: '#3EA83E',
  houseYellow: '#FFF4B8',
  housePink: '#FFB6C1',
  houseBlue: '#B0D4F1',
  houseWhite: '#F0EDE6',
};

const LEVEL_CONFIGS = {
  1: {
    name: 'MAGAZINE ST',
    targetScore: 10,
    scrollSpeed: 35,
    levelLength: 3000,
    spawnRates: {
      kid: { interval: 1.5, variance: 0.5 },
      tree: { interval: 3.0, variance: 1.0 },
      house: { interval: 2.5, variance: 0.8 },
      pothole: { interval: 5.0, variance: 2.0 },
      enemyFloat: { interval: 0, variance: 0 },
      pedestrian: { interval: 0, variance: 0 },
    },
  },
  2: {
    name: 'ST CHARLES AVE',
    targetScore: 20,
    scrollSpeed: 45,
    levelLength: 4000,
    spawnRates: {
      kid: { interval: 1.2, variance: 0.4 },
      tree: { interval: 2.5, variance: 0.8 },
      house: { interval: 2.2, variance: 0.7 },
      pothole: { interval: 3.5, variance: 1.5 },
      enemyFloat: { interval: 6.0, variance: 2.0 },
      pedestrian: { interval: 8.0, variance: 3.0 },
    },
  },
  3: {
    name: 'CANAL ST',
    targetScore: 30,
    scrollSpeed: 55,
    levelLength: 5000,
    spawnRates: {
      kid: { interval: 1.0, variance: 0.3 },
      tree: { interval: 2.0, variance: 0.5 },
      house: { interval: 2.0, variance: 0.6 },
      pothole: { interval: 2.5, variance: 1.0 },
      enemyFloat: { interval: 4.0, variance: 1.5 },
      pedestrian: { interval: 5.0, variance: 2.0 },
    },
  },
};

var STORY_TEXTS = {
  1: "Teddy, the King of Carnival, was heading down St. Charles Avenue ready to share the spirit of Mardi Gras--and lots of beads--with the people of New Orleans.",
  2: "New Orleans' Mayor Heart Girl has some tips for a safe Mardi Gras. Teddy, be sure to avoid potholes, pedestrians, and other floats. And make sure not to get any beads caught in oak trees or throw them through anyone's window. And remember... have fun.",
  3: "As the parade was about to end, Teddy saw his baby brother, Key Paw. 'Catch baby bro!' he said, throwing Key Paw the last of his beads. It was the best Mardi Gras ever!"
};

// ============================================================
// SECTION 2: PIXEL FONT
// ============================================================

const FONT_CHARS = {
  'A': [0x4,0xA,0x11,0x1F,0x11,0x11],
  'B': [0x1E,0x11,0x1E,0x11,0x11,0x1E],
  'C': [0xE,0x11,0x10,0x10,0x11,0xE],
  'D': [0x1E,0x11,0x11,0x11,0x11,0x1E],
  'E': [0x1F,0x10,0x1E,0x10,0x10,0x1F],
  'F': [0x1F,0x10,0x1E,0x10,0x10,0x10],
  'G': [0xE,0x11,0x10,0x17,0x11,0xE],
  'H': [0x11,0x11,0x1F,0x11,0x11,0x11],
  'I': [0xE,0x4,0x4,0x4,0x4,0xE],
  'J': [0x1F,0x2,0x2,0x2,0x12,0xC],
  'K': [0x11,0x12,0x1C,0x12,0x11,0x11],
  'L': [0x10,0x10,0x10,0x10,0x10,0x1F],
  'M': [0x11,0x1B,0x15,0x11,0x11,0x11],
  'N': [0x11,0x19,0x15,0x13,0x11,0x11],
  'O': [0xE,0x11,0x11,0x11,0x11,0xE],
  'P': [0x1E,0x11,0x11,0x1E,0x10,0x10],
  'Q': [0xE,0x11,0x11,0x15,0x12,0xD],
  'R': [0x1E,0x11,0x11,0x1E,0x12,0x11],
  'S': [0xF,0x10,0xE,0x1,0x1,0x1E],
  'T': [0x1F,0x4,0x4,0x4,0x4,0x4],
  'U': [0x11,0x11,0x11,0x11,0x11,0xE],
  'V': [0x11,0x11,0x11,0xA,0xA,0x4],
  'W': [0x11,0x11,0x11,0x15,0x1B,0x11],
  'X': [0x11,0xA,0x4,0x4,0xA,0x11],
  'Y': [0x11,0xA,0x4,0x4,0x4,0x4],
  'Z': [0x1F,0x1,0x2,0x4,0x8,0x1F],
  '0': [0xE,0x13,0x15,0x19,0x11,0xE],
  '1': [0x4,0xC,0x4,0x4,0x4,0xE],
  '2': [0xE,0x11,0x2,0x4,0x8,0x1F],
  '3': [0x1F,0x2,0x4,0x2,0x11,0xE],
  '4': [0x2,0x6,0xA,0x12,0x1F,0x2],
  '5': [0x1F,0x10,0x1E,0x1,0x11,0xE],
  '6': [0x6,0x8,0x1E,0x11,0x11,0xE],
  '7': [0x1F,0x1,0x2,0x4,0x4,0x4],
  '8': [0xE,0x11,0xE,0x11,0x11,0xE],
  '9': [0xE,0x11,0x11,0xF,0x2,0xC],
  '/': [0x1,0x2,0x4,0x4,0x8,0x10],
  ':': [0x0,0x4,0x0,0x0,0x4,0x0],
  '.': [0x0,0x0,0x0,0x0,0x0,0x4],
  '!': [0x4,0x4,0x4,0x4,0x0,0x4],
  '?': [0xE,0x11,0x2,0x4,0x0,0x4],
  '+': [0x0,0x4,0xE,0x4,0x0,0x0],
  '-': [0x0,0x0,0xE,0x0,0x0,0x0],
  ' ': [0x0,0x0,0x0,0x0,0x0,0x0],
  "'": [0x4,0x4,0x0,0x0,0x0,0x0],
  ',': [0x0,0x0,0x0,0x0,0x4,0x8],
  '*': [0x0,0xA,0x4,0xA,0x0,0x0],
};

function drawText(ctx, text, x, y, color, scale) {
  const s = scale || 1;
  ctx.fillStyle = color;
  const chars = text.toUpperCase().split('');
  let cursorX = x;
  for (let c = 0; c < chars.length; c++) {
    const charData = FONT_CHARS[chars[c]];
    if (charData) {
      for (let row = 0; row < 6; row++) {
        const bits = charData[row];
        for (let col = 0; col < 5; col++) {
          if (bits & (1 << (4 - col))) {
            ctx.fillRect(
              Math.floor(cursorX + col * s),
              Math.floor(y + row * s),
              s, s
            );
          }
        }
      }
    }
    cursorX += 6 * s;
  }
}

function getTextWidth(text, scale) {
  const s = scale || 1;
  return text.length * 6 * s;
}

function drawWrappedText(ctx, text, x, maxWidth, y, color, scale, maxChars) {
  var s = scale || 1;
  var charW = 6 * s;
  var lineHeight = 8 * s;
  var charsPerLine = Math.floor(maxWidth / charW);
  var displayText = text.substring(0, maxChars);
  var words = displayText.split(' ');
  var lines = [];
  var currentLine = '';

  for (var i = 0; i < words.length; i++) {
    var testLine = currentLine.length === 0 ? words[i] : currentLine + ' ' + words[i];
    if (testLine.length > charsPerLine && currentLine.length > 0) {
      lines.push(currentLine);
      currentLine = words[i];
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine.length > 0) lines.push(currentLine);

  for (var li = 0; li < lines.length; li++) {
    drawText(ctx, lines[li], x, y + li * lineHeight, color, s);
  }
  return lines.length;
}

// ============================================================
// SECTION 3: SPRITE DATA
// ============================================================

// Teddy on Float: 32x32
// Bottom half = float, top half = teddy bear
const TEDDY_PALETTE = [
  null,              // 0 = transparent
  '#5C2D0E',        // 1 = dark brown outline
  '#B87333',        // 2 = brown fur
  '#D4943A',        // 3 = light brown fur
  '#000000',        // 4 = eyes/nose
  '#E63946',        // 5 = mouth/cheeks
  '#FFD700',        // 6 = gold (crown/float)
  '#7B2D8B',        // 7 = purple (float)
  '#18A558',        // 8 = green (float)
  '#4A1A54',        // 9 = purple dark
  '#0D6B38',        // 10 = green dark
  '#B8960C',        // 11 = gold dark
  '#808080',        // 12 = gray (wheels)
  '#FFFFFF',        // 13 = white (eyes)
  '#FFB6C1',        // 14 = pink cheeks
];

const TEDDY_IDLE = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,6,6,6,6,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,6,11,6,6,6,11,6,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,1,1,0,0,6,6,6,6,6,0,0,1,1,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,1,2,2,1,0,0,0,0,0,0,0,1,2,2,1,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,1,2,2,2,3,3,3,3,2,2,2,1,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,1,2,3,3,3,3,3,3,3,3,2,1,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,1,2,13,4,3,3,3,4,13,2,2,1,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,1,2,3,3,3,4,3,3,3,3,2,1,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,1,2,3,14,5,3,3,5,14,3,2,1,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,1,2,3,3,3,5,5,3,3,3,2,1,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,1,2,3,3,3,3,3,2,2,1,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,1,2,2,2,2,2,2,2,2,2,2,1,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,1,2,3,2,2,2,2,2,2,2,3,2,2,1,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,1,3,2,2,2,2,2,2,2,3,1,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,1,1,2,2,2,2,2,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,0,0,0],
  [0,0,0,6,11,6,11,6,11,6,11,6,11,6,11,6,11,6,11,6,11,6,11,6,11,6,11,6,6,0,0,0],
  [0,0,0,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,0,0,0],
  [0,0,0,7,9,7,9,7,9,7,9,7,9,7,9,7,9,7,9,7,9,7,9,7,9,7,9,7,7,0,0,0],
  [0,0,0,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,0,0,0],
  [0,0,0,8,10,8,10,8,10,8,10,8,10,8,10,8,10,8,10,8,10,8,10,8,10,8,10,8,8,0,0,0],
  [0,0,0,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,0,0,0],
  [0,0,0,9,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,9,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,12,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,12,12,0,0,0,0,0],
  [0,0,0,12,12,12,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,12,12,12,12,0,0,0,0],
  [0,0,0,12,12,12,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,12,12,12,12,0,0,0,0],
  [0,0,0,0,12,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,12,12,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

const TEDDY_THROW_LEFT = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,6,6,6,6,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,6,11,6,6,6,11,6,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,1,1,0,0,6,6,6,6,6,0,0,1,1,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,1,2,2,1,0,0,0,0,0,0,0,1,2,2,1,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,1,2,2,2,3,3,3,3,2,2,2,1,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,1,2,3,3,3,3,3,3,3,3,2,1,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,1,2,13,4,3,3,3,4,13,2,2,1,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,1,2,3,3,3,4,3,3,3,3,2,1,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,1,2,3,14,5,3,3,5,14,3,2,1,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,1,2,3,3,3,5,5,3,3,3,2,1,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,1,2,3,3,3,3,3,2,2,1,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,2,2,1,2,2,2,2,2,2,2,2,2,2,1,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,1,2,3,2,2,3,2,2,2,2,2,2,2,3,2,2,1,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,1,0,1,3,2,2,2,2,2,2,2,3,1,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,1,1,2,2,2,2,2,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,0,0,0],
  [0,0,0,6,11,6,11,6,11,6,11,6,11,6,11,6,11,6,11,6,11,6,11,6,11,6,11,6,6,0,0,0],
  [0,0,0,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,0,0,0],
  [0,0,0,7,9,7,9,7,9,7,9,7,9,7,9,7,9,7,9,7,9,7,9,7,9,7,9,7,7,0,0,0],
  [0,0,0,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,0,0,0],
  [0,0,0,8,10,8,10,8,10,8,10,8,10,8,10,8,10,8,10,8,10,8,10,8,10,8,10,8,8,0,0,0],
  [0,0,0,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,0,0,0],
  [0,0,0,9,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,9,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,12,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,12,12,0,0,0,0,0],
  [0,0,0,12,12,12,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,12,12,12,12,0,0,0,0],
  [0,0,0,12,12,12,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,12,12,12,12,0,0,0,0],
  [0,0,0,0,12,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,12,12,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

const TEDDY_THROW_RIGHT = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,6,6,6,6,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,6,11,6,6,6,11,6,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,1,1,0,0,6,6,6,6,6,0,0,1,1,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,1,2,2,1,0,0,0,0,0,0,0,1,2,2,1,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,1,2,2,2,3,3,3,3,2,2,2,1,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,1,2,3,3,3,3,3,3,3,3,2,1,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,1,2,13,4,3,3,3,4,13,2,2,1,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,1,2,3,3,3,4,3,3,3,3,2,1,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,1,2,3,14,5,3,3,5,14,3,2,1,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,1,2,3,3,3,5,5,3,3,3,2,1,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,1,2,3,3,3,3,3,2,2,1,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,1,2,2,2,2,2,2,2,2,2,1,2,2,1,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,1,2,3,2,2,2,2,2,2,2,2,3,2,3,2,1,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,1,3,2,2,2,2,2,2,2,3,1,0,1,1,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,1,1,2,2,2,2,2,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,0,0,0],
  [0,0,0,6,11,6,11,6,11,6,11,6,11,6,11,6,11,6,11,6,11,6,11,6,11,6,11,6,6,0,0,0],
  [0,0,0,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,0,0,0],
  [0,0,0,7,9,7,9,7,9,7,9,7,9,7,9,7,9,7,9,7,9,7,9,7,9,7,9,7,7,0,0,0],
  [0,0,0,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,0,0,0],
  [0,0,0,8,10,8,10,8,10,8,10,8,10,8,10,8,10,8,10,8,10,8,10,8,10,8,10,8,8,0,0,0],
  [0,0,0,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,0,0,0],
  [0,0,0,9,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,9,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,12,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,12,12,0,0,0,0,0],
  [0,0,0,12,12,12,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,12,12,12,12,0,0,0,0],
  [0,0,0,12,12,12,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,12,12,12,12,0,0,0,0],
  [0,0,0,0,12,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,12,12,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

const TEDDY_FRAMES = [TEDDY_IDLE, TEDDY_THROW_LEFT, TEDDY_THROW_RIGHT];

// Teddy with a frown (inverted U mouth) — used when level is failed
const TEDDY_FROWN = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,6,6,6,6,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,6,11,6,6,6,11,6,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,1,1,0,0,6,6,6,6,6,0,0,1,1,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,1,2,2,1,0,0,0,0,0,0,0,1,2,2,1,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,1,2,2,2,3,3,3,3,2,2,2,1,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,1,2,3,3,3,3,3,3,3,3,2,1,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,1,2,13,4,3,3,3,4,13,2,2,1,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,1,2,3,3,3,4,3,3,3,3,2,1,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,1,2,3,14,3,5,5,3,14,3,2,1,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,1,2,3,3,5,3,3,5,3,3,2,1,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,1,2,3,3,3,3,3,2,2,1,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,1,2,2,2,2,2,2,2,2,2,2,1,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,1,2,3,2,2,2,2,2,2,2,3,2,2,1,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,1,3,2,2,2,2,2,2,2,3,1,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,1,1,2,2,2,2,2,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,0,0,0],
  [0,0,0,6,11,6,11,6,11,6,11,6,11,6,11,6,11,6,11,6,11,6,11,6,11,6,11,6,6,0,0,0],
  [0,0,0,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,0,0,0],
  [0,0,0,7,9,7,9,7,9,7,9,7,9,7,9,7,9,7,9,7,9,7,9,7,9,7,9,7,7,0,0,0],
  [0,0,0,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,0,0,0],
  [0,0,0,8,10,8,10,8,10,8,10,8,10,8,10,8,10,8,10,8,10,8,10,8,10,8,10,8,8,0,0,0],
  [0,0,0,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,0,0,0],
  [0,0,0,9,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,9,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,12,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,12,12,0,0,0,0,0],
  [0,0,0,12,12,12,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,12,12,12,12,0,0,0,0],
  [0,0,0,12,12,12,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,12,12,12,12,0,0,0,0],
  [0,0,0,0,12,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,12,12,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

// Kid sprite: 8x14, multiple variants generated procedurally
const KID_HAIR_COLORS = ['#F4D03F', '#8B4513', '#1A1A1A', '#C0392B'];
const KID_SHIRT_COLORS = [COLORS.purple, COLORS.green, COLORS.gold];

// Tree sprite: 16x24
const TREE_PIXELS = [
  [0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0],
  [0,0,0,0,0,1,2,2,2,2,1,0,0,0,0,0],
  [0,0,0,0,1,2,3,2,3,2,2,1,0,0,0,0],
  [0,0,0,1,2,2,2,3,2,3,2,2,1,0,0,0],
  [0,0,1,2,3,2,2,2,2,2,3,2,2,1,0,0],
  [0,1,2,2,2,3,2,3,2,2,2,2,3,2,1,0],
  [1,2,3,2,2,2,2,2,3,2,2,3,2,2,2,1],
  [1,2,2,2,3,2,3,2,2,2,3,2,2,3,2,1],
  [0,1,2,3,2,2,2,2,2,3,2,2,2,2,1,0],
  [0,1,2,2,2,2,3,2,2,2,2,3,2,2,1,0],
  [0,0,1,2,2,3,2,2,3,2,2,2,2,1,0,0],
  [0,0,1,2,3,2,2,2,2,2,3,2,2,1,0,0],
  [0,0,0,1,2,2,2,3,2,2,2,2,1,0,0,0],
  [0,0,0,1,2,2,3,2,2,3,2,2,1,0,0,0],
  [0,0,0,0,1,2,2,2,2,2,2,1,0,0,0,0],
  [0,0,0,0,0,1,1,2,2,1,1,0,0,0,0,0],
  [0,0,0,0,0,0,0,4,4,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,4,4,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,4,4,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,4,4,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,4,4,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,4,4,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,4,4,4,4,0,0,0,0,0,0],
  [0,0,0,0,0,0,4,4,4,4,0,0,0,0,0,0],
];

const TREE_PALETTE = [null, '#1A3D1A', '#2D8B2D', '#3EA83E', '#6B3A1F'];

// Pothole: 16x8
const POTHOLE_PIXELS = [
  [0,0,0,0,0,3,3,3,3,3,3,0,0,0,0,0],
  [0,0,0,3,3,2,2,2,2,2,2,3,3,0,0,0],
  [0,0,3,2,2,1,1,1,1,1,2,2,2,3,0,0],
  [0,3,2,1,1,1,1,1,1,1,1,1,2,2,3,0],
  [0,3,2,1,1,1,1,1,1,1,1,1,2,2,3,0],
  [0,0,3,2,2,1,1,1,1,1,2,2,2,3,0,0],
  [0,0,0,3,3,2,2,2,2,2,2,3,3,0,0,0],
  [0,0,0,0,0,3,3,3,3,3,3,0,0,0,0,0],
];

const POTHOLE_PALETTE = [null, '#1A1A1A', '#2C2C2C', '#4A4A4A'];

// Bead: 4x4
const BEAD_COLORS = [COLORS.purple, COLORS.green, COLORS.gold];

// ============================================================
// SECTION 4: RENDERING FUNCTIONS
// ============================================================

function drawSpriteFromPalette(ctx, pixels, palette, x, y) {
  for (let row = 0; row < pixels.length; row++) {
    for (let col = 0; col < pixels[row].length; col++) {
      const idx = pixels[row][col];
      if (idx === 0) continue;
      ctx.fillStyle = palette[idx];
      ctx.fillRect(Math.floor(x + col), Math.floor(y + row), 1, 1);
    }
  }
}

function drawSpriteFromColors(ctx, pixels, x, y) {
  for (let row = 0; row < pixels.length; row++) {
    for (let col = 0; col < pixels[row].length; col++) {
      const color = pixels[row][col];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(Math.floor(x + col), Math.floor(y + row), 1, 1);
    }
  }
}

function drawTeddy(ctx, teddy) {
  const frameIndex = teddy.throwFrame || 0;
  const pixels = TEDDY_FRAMES[frameIndex];
  drawSpriteFromPalette(ctx, pixels, TEDDY_PALETTE, teddy.x, teddy.y);
}

function createKidPixels(hairColor, shirtColor, facingRight) {
  const H = hairColor;
  const S = shirtColor;
  const SK = COLORS.skin;
  const SD = COLORS.skinDark;
  const B = COLORS.black;
  const W = COLORS.white;
  const _ = null;

  if (facingRight) {
    return [
      [_,_,H,H,H,H,_,_],
      [_,H,H,H,H,H,H,_],
      [_,SK,SK,SK,SK,SK,_,_],
      [_,SK,B,SK,B,SK,_,_],
      [_,SK,SK,SK,SK,SK,_,_],
      [_,_,SK,SD,SK,_,_,_],
      [SK,S,S,S,S,S,S,_],
      [_,S,S,S,S,S,_,SK],
      [_,S,S,S,S,S,_,_],
      [_,_,S,S,S,_,_,_],
      [_,_,B,_,B,_,_,_],
      [_,_,B,_,B,_,_,_],
    ];
  }
  return [
    [_,_,H,H,H,H,_,_],
    [_,H,H,H,H,H,H,_],
    [_,_,SK,SK,SK,SK,SK,_],
    [_,_,SK,B,SK,B,SK,_],
    [_,_,SK,SK,SK,SK,SK,_],
    [_,_,_,SK,SD,SK,_,_],
    [_,S,S,S,S,S,S,SK],
    [SK,_,S,S,S,S,S,_],
    [_,_,S,S,S,S,S,_],
    [_,_,_,S,S,S,_,_],
    [_,_,_,B,_,B,_,_],
    [_,_,_,B,_,B,_,_],
  ];
}

function drawKid(ctx, kid) {
  const hairColor = KID_HAIR_COLORS[kid.variant % KID_HAIR_COLORS.length];
  const shirtColor = KID_SHIRT_COLORS[kid.shirtVariant % KID_SHIRT_COLORS.length];
  const facingRight = kid.side === 'left';
  const pixels = createKidPixels(hairColor, shirtColor, facingRight);

  // Bounce animation
  const bounceY = kid.animFrame === 1 ? -1 : 0;
  drawSpriteFromColors(ctx, pixels, kid.x, kid.y + bounceY);

  // Draw raised hands if in catching pose
  if (!kid.hit) {
    ctx.fillStyle = COLORS.skin;
    if (facingRight) {
      ctx.fillRect(Math.floor(kid.x + 7), Math.floor(kid.y + 4 + bounceY), 1, 1);
    } else {
      ctx.fillRect(Math.floor(kid.x), Math.floor(kid.y + 4 + bounceY), 1, 1);
    }
  }
}

function drawTree(ctx, tree) {
  drawSpriteFromPalette(ctx, TREE_PIXELS, TREE_PALETTE, tree.x, tree.y);
}

function drawHouse(ctx, house) {
  const baseColors = [COLORS.houseYellow, COLORS.housePink, COLORS.houseBlue, COLORS.houseWhite];
  const baseColor = baseColors[house.variant % baseColors.length];
  const roofColor = COLORS.brownDark;
  const doorColor = COLORS.brown;
  const windowColor = '#1A2A3A';
  const frameColor = COLORS.white;
  const hx = Math.floor(house.x);
  const hy = Math.floor(house.y);

  // Roof triangle
  ctx.fillStyle = roofColor;
  for (let i = 0; i < 8; i++) {
    const left = 16 - (i * 2) - 2;
    const right = 16 + (i * 2) + 2;
    ctx.fillRect(hx + left, hy + i, right - left, 1);
  }

  // Body
  ctx.fillStyle = baseColor;
  ctx.fillRect(hx + 2, hy + 8, 32, 22);

  // Outline
  ctx.fillStyle = COLORS.brownDark;
  ctx.fillRect(hx + 2, hy + 8, 32, 1);
  ctx.fillRect(hx + 2, hy + 29, 32, 1);
  ctx.fillRect(hx + 2, hy + 8, 1, 22);
  ctx.fillRect(hx + 33, hy + 8, 1, 22);

  // Windows (these are the target zones)
  ctx.fillStyle = windowColor;
  ctx.fillRect(hx + 6, hy + 12, 8, 8);
  ctx.fillRect(hx + 22, hy + 12, 8, 8);

  // Window panes
  ctx.fillStyle = frameColor;
  ctx.fillRect(hx + 10, hy + 12, 1, 8);
  ctx.fillRect(hx + 6, hy + 16, 8, 1);
  ctx.fillRect(hx + 26, hy + 12, 1, 8);
  ctx.fillRect(hx + 22, hy + 16, 8, 1);

  // Door
  ctx.fillStyle = doorColor;
  ctx.fillRect(hx + 14, hy + 21, 6, 9);

  // Flash red on window hit
  if (house.hitTimer > 0) {
    ctx.fillStyle = 'rgba(230, 57, 70, 0.6)';
    ctx.fillRect(hx + 6, hy + 12, 8, 8);
    ctx.fillRect(hx + 22, hy + 12, 8, 8);
  }
}

function drawPothole(ctx, pothole) {
  drawSpriteFromPalette(ctx, POTHOLE_PIXELS, POTHOLE_PALETTE, pothole.x, pothole.y);
}

function drawEnemyFloat(ctx, ef) {
  var bobY = Math.sin(ef.animTimer * 3) * 1;
  var ex = Math.floor(ef.x);
  var ey = Math.floor(ef.y + bobY);

  // Float body - purple/green/gold stripes (matches Teddy's float)
  ctx.fillStyle = COLORS.gold;
  ctx.fillRect(ex + 2, ey, 28, 1); // gold trim top
  ctx.fillStyle = COLORS.purple;
  ctx.fillRect(ex + 2, ey + 1, 28, 4);
  ctx.fillStyle = COLORS.green;
  ctx.fillRect(ex + 2, ey + 5, 28, 4);
  ctx.fillStyle = COLORS.purple;
  ctx.fillRect(ex + 2, ey + 9, 28, 5);
  ctx.fillStyle = COLORS.gold;
  ctx.fillRect(ex + 2, ey + 14, 28, 1); // gold trim bottom

  // Wheels with spoke animation
  var spokeFrame = Math.floor(ef.animTimer * 5) % 2;
  ctx.fillStyle = COLORS.gray;
  ctx.fillRect(ex + 4, ey + 15, 4, 4);
  ctx.fillRect(ex + 24, ey + 15, 4, 4);
  // Spoke dots
  ctx.fillStyle = COLORS.grayDark;
  if (spokeFrame === 0) {
    ctx.fillRect(ex + 5, ey + 16, 1, 1);
    ctx.fillRect(ex + 25, ey + 16, 1, 1);
  } else {
    ctx.fillRect(ex + 6, ey + 17, 1, 1);
    ctx.fillRect(ex + 26, ey + 17, 1, 1);
  }

  // White kitty cat on top (10x12)
  var kx = ex + 11;
  var ky = ey - 12;

  // Ears (pointed triangles)
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(kx + 1, ky, 2, 2);     // left ear
  ctx.fillRect(kx + 7, ky, 2, 2);     // right ear
  ctx.fillStyle = '#FFB6C1';           // pink inner ear
  ctx.fillRect(kx + 1, ky + 1, 1, 1);
  ctx.fillRect(kx + 8, ky + 1, 1, 1);

  // Head
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(kx + 1, ky + 2, 8, 5); // face block
  ctx.fillRect(kx + 2, ky + 2, 6, 6); // slightly taller center

  // Light gray outline around head
  ctx.fillStyle = '#D0D0D0';
  ctx.fillRect(kx + 0, ky + 3, 1, 3);
  ctx.fillRect(kx + 9, ky + 3, 1, 3);

  // Eyes (black dots)
  ctx.fillStyle = '#000000';
  ctx.fillRect(kx + 3, ky + 3, 1, 1);
  ctx.fillRect(kx + 6, ky + 3, 1, 1);

  // Tiny pink nose
  ctx.fillStyle = '#FFB6C1';
  ctx.fillRect(kx + 4, ky + 4, 2, 1);

  // Small smile
  ctx.fillStyle = '#000000';
  ctx.fillRect(kx + 4, ky + 5, 1, 1);
  ctx.fillRect(kx + 5, ky + 5, 1, 1);

  // Body
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(kx + 2, ky + 8, 6, 4);
  // Gray outline on body
  ctx.fillStyle = '#D0D0D0';
  ctx.fillRect(kx + 1, ky + 8, 1, 4);
  ctx.fillRect(kx + 8, ky + 8, 1, 4);

  // Red rose held to the side (right side)
  // Stem
  ctx.fillStyle = '#18A558';
  ctx.fillRect(kx + 9, ky + 6, 1, 4);
  // Rose bloom
  ctx.fillStyle = '#E63946';
  ctx.fillRect(kx + 8, ky + 4, 3, 2);
  ctx.fillRect(kx + 9, ky + 3, 1, 1);
}

function drawPedestrian(ctx, ped) {
  const px = Math.floor(ped.x);
  const py = Math.floor(ped.y);
  const outfitColors = [COLORS.purple, COLORS.green, COLORS.gold];
  const outfit = outfitColors[ped.variant % outfitColors.length];

  // Head
  ctx.fillStyle = COLORS.skin;
  ctx.fillRect(px + 3, py, 4, 4);
  ctx.fillStyle = COLORS.black;
  ctx.fillRect(px + 4, py + 1, 1, 1);
  ctx.fillRect(px + 6, py + 1, 1, 1);

  // Body
  ctx.fillStyle = outfit;
  ctx.fillRect(px + 2, py + 4, 6, 6);

  // Legs - simple walking animation
  ctx.fillStyle = COLORS.blue;
  if (ped.animFrame === 0) {
    ctx.fillRect(px + 3, py + 10, 2, 4);
    ctx.fillRect(px + 6, py + 10, 2, 4);
  } else {
    ctx.fillRect(px + 2, py + 10, 2, 4);
    ctx.fillRect(px + 7, py + 10, 2, 4);
  }
}

function drawBead(ctx, bead) {
  const color = BEAD_COLORS[bead.colorIndex % BEAD_COLORS.length];
  const bx = Math.floor(bead.x);
  const by = Math.floor(bead.y);

  ctx.fillStyle = color;
  ctx.fillRect(bx + 1, by, 2, 1);
  ctx.fillRect(bx, by + 1, 4, 2);
  ctx.fillRect(bx + 1, by + 3, 2, 1);

  // Sparkle
  if (bead.sparkle) {
    ctx.fillStyle = COLORS.white;
    ctx.fillRect(bx + 1, by + 1, 1, 1);
  }
}

function drawBeadPowerup(ctx, pu) {
  var px = Math.floor(pu.x);
  var py = Math.floor(pu.y);
  var flash = Math.floor(pu.animTimer * 4) % 2 === 0;

  // Left bead (purple)
  ctx.fillStyle = flash ? COLORS.purpleLight : COLORS.purple;
  ctx.fillRect(px + 1, py, 2, 1);
  ctx.fillRect(px, py + 1, 4, 2);
  ctx.fillRect(px + 1, py + 3, 2, 1);

  // Right bead (green)
  ctx.fillStyle = flash ? COLORS.greenLight : COLORS.green;
  ctx.fillRect(px + 7, py, 2, 1);
  ctx.fillRect(px + 6, py + 1, 4, 2);
  ctx.fillRect(px + 7, py + 3, 2, 1);

  // Sparkle highlight
  ctx.fillStyle = COLORS.white;
  ctx.fillRect(px + 1, py + 1, 1, 1);
  ctx.fillRect(px + 7, py + 1, 1, 1);

  // "+10" text above
  if (flash) {
    drawText(ctx, '+10', px - 1, py - 7, COLORS.gold, 1);
  }
}

function drawRoad(ctx, scrollOffset) {
  // Grass areas
  ctx.fillStyle = COLORS.grassGreen;
  ctx.fillRect(HOUSE_LEFT_START, PLAY_TOP, HOUSE_LEFT_END + 1, CANVAS_HEIGHT - PLAY_TOP);
  ctx.fillRect(HOUSE_RIGHT_START, PLAY_TOP, CANVAS_WIDTH - HOUSE_RIGHT_START, CANVAS_HEIGHT - PLAY_TOP);

  // Lighter grass patches
  ctx.fillStyle = COLORS.grassLight;
  const grassOffset = scrollOffset % 16;
  for (let y = PLAY_TOP - grassOffset; y < CANVAS_HEIGHT; y += 16) {
    for (let x = 0; x < 40; x += 8) {
      if ((x + y) % 16 === 0) {
        ctx.fillRect(x + 2, Math.floor(y) + 2, 3, 3);
        ctx.fillRect(HOUSE_RIGHT_START + x + 2, Math.floor(y) + 2, 3, 3);
      }
    }
  }

  // Sidewalks
  ctx.fillStyle = COLORS.sidewalk;
  ctx.fillRect(SIDEWALK_LEFT_START, PLAY_TOP, 16, CANVAS_HEIGHT - PLAY_TOP);
  ctx.fillRect(SIDEWALK_RIGHT_START, PLAY_TOP, 16, CANVAS_HEIGHT - PLAY_TOP);

  // Sidewalk detail lines
  ctx.fillStyle = COLORS.sidewalkDark;
  const sideOffset = scrollOffset % 20;
  for (let y = PLAY_TOP - sideOffset; y < CANVAS_HEIGHT; y += 20) {
    ctx.fillRect(SIDEWALK_LEFT_START, Math.floor(y), 16, 1);
    ctx.fillRect(SIDEWALK_RIGHT_START, Math.floor(y), 16, 1);
  }

  // Road
  ctx.fillStyle = COLORS.asphalt;
  ctx.fillRect(ROAD_LEFT, PLAY_TOP, ROAD_RIGHT - ROAD_LEFT + 1, CANVAS_HEIGHT - PLAY_TOP);

  // Road edge lines
  ctx.fillStyle = COLORS.white;
  ctx.fillRect(ROAD_LEFT, PLAY_TOP, 1, CANVAS_HEIGHT - PLAY_TOP);
  ctx.fillRect(ROAD_RIGHT, PLAY_TOP, 1, CANVAS_HEIGHT - PLAY_TOP);

  // Center dashed line
  ctx.fillStyle = COLORS.gold;
  const dashLen = 8;
  const gapLen = 8;
  const totalCycle = dashLen + gapLen;
  const centerOffset = scrollOffset % totalCycle;
  for (let y = PLAY_TOP - centerOffset; y < CANVAS_HEIGHT; y += totalCycle) {
    const drawY = Math.max(Math.floor(y), PLAY_TOP);
    const drawH = Math.min(dashLen, CANVAS_HEIGHT - drawY);
    if (drawH > 0 && y + dashLen > PLAY_TOP) {
      ctx.fillRect(ROAD_CENTER, drawY, 2, drawH);
    }
  }
}

function drawTeddyHead(ctx, x, y, color) {
  ctx.fillStyle = color;
  // Simple 7x7 teddy head icon
  ctx.fillRect(x + 0, y + 0, 2, 2); // left ear
  ctx.fillRect(x + 5, y + 0, 2, 2); // right ear
  ctx.fillRect(x + 1, y + 2, 5, 5); // face
  ctx.fillRect(x + 0, y + 3, 7, 3); // wider middle
}

function drawHUD(ctx, state) {
  // HUD background
  ctx.fillStyle = '#1A0A2E';
  ctx.fillRect(0, 0, CANVAS_WIDTH, HUD_HEIGHT);

  // Gold border line
  ctx.fillStyle = COLORS.gold;
  ctx.fillRect(0, 15, CANVAS_WIDTH, 1);

  // Score
  const scoreStr = String(state.score).padStart(3, '0');
  const targetStr = String(state.targetScore).padStart(3, '0');
  drawText(ctx, scoreStr + '/' + targetStr, 2, 4, COLORS.gold, 1);

  // Beads remaining
  var beadStr = String(state.beadsRemaining);
  // Small bead icon
  ctx.fillStyle = COLORS.purple;
  ctx.fillRect(70, 5, 3, 3);
  ctx.fillStyle = COLORS.white;
  ctx.fillRect(71, 6, 1, 1);
  var beadColor = state.beadsRemaining > 0 ? COLORS.white : COLORS.red;
  drawText(ctx, beadStr, 75, 4, beadColor, 1);

  // Hearts (hit points)
  const heartX = 110;
  for (let i = 0; i < 3; i++) {
    if (i < state.hearts) {
      drawHeart(ctx, heartX + i * 10, 3, COLORS.red);
    } else {
      drawHeart(ctx, heartX + i * 10, 3, COLORS.grayDark);
    }
  }

  // Lives as teddy head icons
  const livesX = 170;
  for (let i = 0; i < 3; i++) {
    if (i < state.lives) {
      drawTeddyHead(ctx, livesX + i * 10, 3, '#B87333');
    } else {
      drawTeddyHead(ctx, livesX + i * 10, 3, COLORS.grayDark);
    }
  }

  // Level
  drawText(ctx, 'LV' + state.level, 220, 4, COLORS.greenLight, 1);

  // Progress bar (3px tall at bottom of HUD)
  var levelConfig = LEVEL_CONFIGS[state.level];
  var progress = Math.min(state.scrollDistance / levelConfig.levelLength, 1);
  var barY = 17;
  var barH = 3;
  // Background
  ctx.fillStyle = '#2A1040';
  ctx.fillRect(0, barY, CANVAS_WIDTH, barH);
  // Fill
  ctx.fillStyle = COLORS.gold;
  var fillW = Math.floor(progress * CANVAS_WIDTH);
  ctx.fillRect(0, barY, fillW, barH);
  // Finish marker at right end
  ctx.fillStyle = COLORS.white;
  ctx.fillRect(CANVAS_WIDTH - 2, barY, 2, barH);
  // Border below progress bar
  ctx.fillStyle = COLORS.gold;
  ctx.fillRect(0, barY + barH, CANVAS_WIDTH, 1);
}

function drawHeart(ctx, x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x + 1, y, 2, 1);
  ctx.fillRect(x + 5, y, 2, 1);
  ctx.fillRect(x, y + 1, 4, 1);
  ctx.fillRect(x + 4, y + 1, 4, 1);
  ctx.fillRect(x, y + 2, 8, 1);
  ctx.fillRect(x + 1, y + 3, 6, 1);
  ctx.fillRect(x + 2, y + 4, 4, 1);
  ctx.fillRect(x + 3, y + 5, 2, 1);
}

function drawFinishLine(ctx, y) {
  var lineY = Math.floor(y);
  // Checkered pattern across road (purple/green/gold)
  var checkColors = [COLORS.purple, COLORS.green, COLORS.gold];
  for (var cx = ROAD_LEFT; cx < ROAD_RIGHT; cx += 4) {
    for (var cy = 0; cy < 8; cy += 4) {
      var ci = ((cx / 4) + (cy / 4)) % 3;
      ctx.fillStyle = checkColors[ci];
      ctx.fillRect(cx, lineY + cy, 4, 4);
    }
  }
  // "FINISH" text centered above line
  var finishText = 'FINISH';
  var fw = getTextWidth(finishText, 1);
  var textX = Math.floor((ROAD_LEFT + ROAD_RIGHT - fw) / 2);
  // Text background
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(textX - 2, lineY - 10, fw + 4, 9);
  drawText(ctx, finishText, textX, lineY - 9, COLORS.gold, 1);
  // Decorative side markers (fleur-de-lis style dots)
  ctx.fillStyle = COLORS.gold;
  ctx.fillRect(ROAD_LEFT + 2, lineY - 2, 3, 3);
  ctx.fillRect(ROAD_RIGHT - 5, lineY - 2, 3, 3);
  ctx.fillStyle = COLORS.purple;
  ctx.fillRect(ROAD_LEFT + 2, lineY + 9, 3, 3);
  ctx.fillRect(ROAD_RIGHT - 5, lineY + 9, 3, 3);
}

function drawFloatingTexts(ctx, floatingTexts) {
  for (let i = 0; i < floatingTexts.length; i++) {
    const ft = floatingTexts[i];
    const alpha = Math.max(0, 1 - ft.timer / ft.duration);
    ctx.globalAlpha = alpha;
    const color = ft.points > 0 ? COLORS.gold : COLORS.red;
    const txt = ft.points > 0 ? '+' + ft.points : '' + ft.points;
    drawText(ctx, txt, ft.x, ft.y - (ft.timer * 20), color, 1);
  }
  ctx.globalAlpha = 1;
}

function drawParticles(ctx, particles) {
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    const alpha = Math.max(0, 1 - p.timer / p.duration);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;
    ctx.fillRect(Math.floor(p.x), Math.floor(p.y), 2, 2);
  }
  ctx.globalAlpha = 1;
}

// ============================================================
// SECTION 5: ENTITY FACTORY FUNCTIONS
// ============================================================

function createTeddy() {
  return {
    x: ROAD_CENTER - 16,
    y: 180,
    w: 32,
    h: 32,
    throwFrame: 0,
    throwTimer: 0,
  };
}

function createKid(side) {
  const xBase = side === 'left'
    ? SIDEWALK_LEFT_START + 4
    : SIDEWALK_RIGHT_START + 4;
  return {
    type: 'kid',
    x: xBase,
    y: -14,
    w: 8,
    h: 12,
    side: side,
    variant: Math.floor(Math.random() * KID_HAIR_COLORS.length),
    shirtVariant: Math.floor(Math.random() * KID_SHIRT_COLORS.length),
    animFrame: 0,
    animTimer: 0,
    hit: false,
  };
}

function createTree(side) {
  const xBase = side === 'left'
    ? HOUSE_LEFT_START + Math.floor(Math.random() * 20)
    : HOUSE_RIGHT_START + Math.floor(Math.random() * 20);
  return {
    type: 'tree',
    x: xBase,
    y: -24,
    w: 16,
    h: 24,
    side: side,
    hit: false,
  };
}

function createHouse(side) {
  const xBase = side === 'left' ? 0 : HOUSE_RIGHT_START;
  return {
    type: 'house',
    x: xBase,
    y: -32,
    w: 36,
    h: 30,
    side: side,
    variant: Math.floor(Math.random() * 4),
    hitTimer: 0,
  };
}

function createPothole() {
  return {
    type: 'pothole',
    x: ROAD_LEFT + 8 + Math.floor(Math.random() * (ROAD_RIGHT - ROAD_LEFT - 24)),
    y: -8,
    w: 16,
    h: 8,
  };
}

function createEnemyFloat() {
  return {
    type: 'enemyFloat',
    x: ROAD_LEFT + 8 + Math.floor(Math.random() * (ROAD_RIGHT - ROAD_LEFT - 40)),
    y: -20,
    w: 32,
    h: 19,
    animTimer: Math.random() * 6,
    animFrame: 0,
    swayOffset: 0,
    baseX: 0,
  };
}

function createPedestrian() {
  const side = Math.random() < 0.5 ? 'left' : 'right';
  return {
    type: 'pedestrian',
    x: side === 'left' ? SIDEWALK_LEFT_START : SIDEWALK_RIGHT_END,
    y: -16,
    w: 10,
    h: 14,
    side: side,
    direction: side === 'left' ? 1 : -1,
    speed: 20 + Math.random() * 15,
    variant: Math.floor(Math.random() * 3),
    animFrame: 0,
    animTimer: 0,
  };
}

function createBeadPowerup() {
  return {
    type: 'beadPowerup',
    x: ROAD_LEFT + 10 + Math.floor(Math.random() * (ROAD_RIGHT - ROAD_LEFT - 28)),
    y: -10,
    w: 10,
    h: 6,
    animTimer: Math.random() * 6,
  };
}

function createBead(teddyX, teddyY, direction, colorIndex) {
  return {
    type: 'bead',
    x: direction === 'left' ? teddyX : teddyX + 28,
    y: teddyY + 12,
    w: 4,
    h: 4,
    direction: direction,
    colorIndex: colorIndex,
    sparkle: false,
    sparkleTimer: 0,
  };
}

function createFloatingText(x, y, points) {
  return {
    x: x,
    y: y,
    points: points,
    timer: 0,
    duration: 0.8,
  };
}

function createParticle(x, y, color) {
  const angle = Math.random() * Math.PI * 2;
  const speed = 30 + Math.random() * 40;
  return {
    x: x,
    y: y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    color: color,
    timer: 0,
    duration: 0.5,
  };
}

// ============================================================
// SECTION 6: GAME STATE MANAGEMENT
// ============================================================

function createInitialState() {
  return {
    screen: 'title',
    level: 1,
    lives: 3,
    hearts: 3,
    score: 0,
    targetScore: LEVEL_CONFIGS[1].targetScore,
    scrollDistance: 0,
    scrollSpeed: LEVEL_CONFIGS[1].scrollSpeed,
    scrollOffset: 0,
    teddy: createTeddy(),
    beads: [],
    kids: [],
    trees: [],
    houses: [],
    potholes: [],
    enemyFloats: [],
    pedestrians: [],
    beadPowerups: [],
    floatingTexts: [],
    particles: [],
    beadPowerupTimer: 3.0,
    input: {
      left: false, right: false, up: false, down: false,
      beadLeft: false, beadRight: false,
      beadLeftPressed: false, beadRightPressed: false,
      enter: false, enterPressed: false,
    },
    beadCooldown: 0,
    beadColorIndex: 0,
    beadsRemaining: LEVEL_CONFIGS[1].targetScore * 2,
    invincibleTimer: 0,
    shakeTimer: 0,
    shakeX: 0,
    shakeY: 0,
    levelCompleteTimer: 0,
    levelFailedTimer: 0,
    levelEndTimer: 0,
    levelEndPhase: 'freeze',
    levelEndPassed: false,
    titleAnimTimer: 0,
    spawnTimers: {
      kid: 1.0,
      tree: 2.0,
      house: 1.5,
      pothole: 3.0,
      enemyFloat: 5.0,
      pedestrian: 6.0,
    },
    lastTimestamp: 0,
    paused: false,
    storyScreen: 0,
    storyTimer: 0,
    storyFadeTimer: 0,
    storyPhase: 'fadeIn',
    storyCharIndex: 0,
    storyImages: {},
  };
}

function resetLevelState(state) {
  const config = LEVEL_CONFIGS[state.level];
  state.score = 0;
  state.hearts = 3;
  state.targetScore = config.targetScore;
  state.scrollSpeed = config.scrollSpeed;
  state.scrollDistance = 0;
  state.scrollOffset = 0;
  state.teddy = createTeddy();
  state.beads = [];
  state.kids = [];
  state.trees = [];
  state.houses = [];
  state.potholes = [];
  state.enemyFloats = [];
  state.pedestrians = [];
  state.beadPowerups = [];
  state.floatingTexts = [];
  state.particles = [];
  state.beadPowerupTimer = 3.0;
  state.beadCooldown = 0;
  state.beadsRemaining = config.targetScore * 2;
  state.invincibleTimer = 0;
  state.shakeTimer = 0;
  state.shakeX = 0;
  state.shakeY = 0;
  state.spawnTimers = {
    kid: 1.0,
    tree: 2.0,
    house: 1.5,
    pothole: 3.0,
    enemyFloat: 5.0,
    pedestrian: 6.0,
  };
}

// ============================================================
// SECTION 7: INPUT HANDLING
// ============================================================

function setupKeyboard(inputState) {
  document.addEventListener('keydown', function(e) {
    switch (e.code) {
      case 'ArrowLeft':  inputState.left = true; e.preventDefault(); break;
      case 'ArrowRight': inputState.right = true; e.preventDefault(); break;
      case 'ArrowUp':    inputState.up = true; e.preventDefault(); break;
      case 'ArrowDown':  inputState.down = true; e.preventDefault(); break;
      case 'KeyZ':
        if (!inputState.beadLeft) inputState.beadLeftPressed = true;
        inputState.beadLeft = true;
        break;
      case 'KeyX':
        if (!inputState.beadRight) inputState.beadRightPressed = true;
        inputState.beadRight = true;
        break;
      case 'Enter':
        if (!inputState.enter) inputState.enterPressed = true;
        inputState.enter = true;
        e.preventDefault();
        break;
      case 'KeyP':
        inputState.pausePressed = true;
        break;
    }
  });

  document.addEventListener('keyup', function(e) {
    switch (e.code) {
      case 'ArrowLeft':  inputState.left = false; break;
      case 'ArrowRight': inputState.right = false; break;
      case 'ArrowUp':    inputState.up = false; break;
      case 'ArrowDown':  inputState.down = false; break;
      case 'KeyZ':       inputState.beadLeft = false; break;
      case 'KeyX':       inputState.beadRight = false; break;
      case 'Enter':      inputState.enter = false; break;
    }
  });
}

function setupTouchControls(inputState) {
  const dpad = document.getElementById('dpad');
  const btnA = document.getElementById('btn-a');
  const btnB = document.getElementById('btn-b');

  if (!dpad || !btnA || !btnB) return;

  // D-pad handling - use Touch API for reliable slide-to-change-direction
  var activeDpadTouchId = null;

  function handleDpadTouch(touch) {
    var rect = dpad.getBoundingClientRect();
    var cx = rect.left + rect.width / 2;
    var cy = rect.top + rect.height / 2;
    var dx = touch.clientX - cx;
    var dy = touch.clientY - cy;
    var dist = Math.sqrt(dx * dx + dy * dy);
    var maxDist = rect.width / 2;

    resetDpadInput(inputState);

    if (dist < maxDist * 0.15 || dist > maxDist * 1.5) return;

    var angle = Math.atan2(dy, dx) * (180 / Math.PI);
    if (angle > -22.5 && angle <= 22.5) { inputState.right = true; }
    else if (angle > 22.5 && angle <= 67.5) { inputState.right = true; inputState.down = true; }
    else if (angle > 67.5 && angle <= 112.5) { inputState.down = true; }
    else if (angle > 112.5 && angle <= 157.5) { inputState.left = true; inputState.down = true; }
    else if (angle > 157.5 || angle <= -157.5) { inputState.left = true; }
    else if (angle > -157.5 && angle <= -112.5) { inputState.left = true; inputState.up = true; }
    else if (angle > -112.5 && angle <= -67.5) { inputState.up = true; }
    else if (angle > -67.5 && angle <= -22.5) { inputState.right = true; inputState.up = true; }
  }

  dpad.addEventListener('touchstart', function(e) {
    e.preventDefault();
    if (activeDpadTouchId === null) {
      var touch = e.changedTouches[0];
      activeDpadTouchId = touch.identifier;
      handleDpadTouch(touch);
    }
  }, { passive: false });

  dpad.addEventListener('touchmove', function(e) {
    e.preventDefault();
    for (var i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === activeDpadTouchId) {
        handleDpadTouch(e.changedTouches[i]);
        break;
      }
    }
  }, { passive: false });

  dpad.addEventListener('touchend', function(e) {
    for (var i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === activeDpadTouchId) {
        activeDpadTouchId = null;
        resetDpadInput(inputState);
        break;
      }
    }
  }, { passive: false });

  dpad.addEventListener('touchcancel', function(e) {
    for (var i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === activeDpadTouchId) {
        activeDpadTouchId = null;
        resetDpadInput(inputState);
        break;
      }
    }
  }, { passive: false });

  // Action buttons
  btnA.addEventListener('pointerdown', function(e) {
    e.preventDefault();
    inputState.beadLeft = true;
    inputState.beadLeftPressed = true;
  });
  btnA.addEventListener('pointerup', function() { inputState.beadLeft = false; });
  btnA.addEventListener('pointercancel', function() { inputState.beadLeft = false; });
  btnA.addEventListener('pointerleave', function() { inputState.beadLeft = false; });

  btnB.addEventListener('pointerdown', function(e) {
    e.preventDefault();
    inputState.beadRight = true;
    inputState.beadRightPressed = true;
  });
  btnB.addEventListener('pointerup', function() { inputState.beadRight = false; });
  btnB.addEventListener('pointercancel', function() { inputState.beadRight = false; });
  btnB.addEventListener('pointerleave', function() { inputState.beadRight = false; });

  // Canvas tap for start screen
  var canvas = document.getElementById('game-canvas');
  canvas.addEventListener('pointerdown', function(e) {
    e.preventDefault();
    inputState.enterPressed = true;
    inputState.enter = true;
  });
  canvas.addEventListener('pointerup', function() {
    inputState.enter = false;
  });
}

function resetDpadInput(inputState) {
  inputState.left = false;
  inputState.right = false;
  inputState.up = false;
  inputState.down = false;
}

function clearPressedFlags(inputState) {
  inputState.beadLeftPressed = false;
  inputState.beadRightPressed = false;
  inputState.enterPressed = false;
  inputState.pausePressed = false;
}

// ============================================================
// SECTION 8: MOVEMENT & PHYSICS (Pure-ish)
// ============================================================

function computeTeddyPosition(teddy, input, dt) {
  var dx = 0;
  var dy = 0;
  if (input.left) dx -= 1;
  if (input.right) dx += 1;
  if (input.up) dy -= 1;
  if (input.down) dy += 1;

  // Normalize diagonal
  if (dx !== 0 && dy !== 0) {
    dx *= 0.707;
    dy *= 0.707;
  }

  var newX = teddy.x + dx * TEDDY_SPEED * dt;
  var newY = teddy.y + dy * TEDDY_SPEED * dt;

  // Clamp to road bounds
  newX = Math.max(ROAD_LEFT + 2, Math.min(newX, ROAD_RIGHT - teddy.w + 2));
  newY = Math.max(PLAY_TOP + 2, Math.min(newY, PLAY_BOTTOM - teddy.h - 2));

  return { x: newX, y: newY };
}

function computeBeadPosition(bead, dt) {
  var speed = bead.direction === 'left' ? -BEAD_SPEED : BEAD_SPEED;
  return {
    x: bead.x + speed * dt,
    y: bead.y,
  };
}

function scrollEntityY(entity, scrollSpeed, dt) {
  return entity.y + scrollSpeed * dt;
}

function isOffScreen(entity) {
  return entity.y > CANVAS_HEIGHT + 10 || entity.y < -60;
}

function isBeadOffScreen(bead) {
  return bead.x < HOUSE_LEFT_START - 5 || bead.x > HOUSE_RIGHT_END + 5;
}

// ============================================================
// SECTION 9: COLLISION DETECTION
// ============================================================

function checkAABB(ax, ay, aw, ah, bx, by, bw, bh) {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

function getTeddyHitbox(teddy) {
  return {
    x: teddy.x + 6,
    y: teddy.y + 6,
    w: 20,
    h: 20,
  };
}

function getEntityHitbox(entity) {
  switch (entity.type) {
    case 'pothole':
      return { x: entity.x + 2, y: entity.y + 1, w: 12, h: 6 };
    case 'enemyFloat':
      return { x: entity.x + 2, y: entity.y + 2, w: 28, h: 15 };
    case 'pedestrian':
      return { x: entity.x + 2, y: entity.y + 2, w: 6, h: 12 };
    case 'kid':
      return { x: entity.x + 1, y: entity.y + 1, w: 6, h: 10 };
    case 'tree':
      return { x: entity.x + 1, y: entity.y + 1, w: 14, h: 14 };
    case 'house':
      // Hit zone is the windows area
      return { x: entity.x + 4, y: entity.y + 10, w: 30, h: 12 };
    default:
      return { x: entity.x, y: entity.y, w: entity.w, h: entity.h };
  }
}

function checkTeddyVsObstacles(teddy, potholes, enemyFloats, pedestrians) {
  var th = getTeddyHitbox(teddy);
  var allObstacles = potholes.concat(enemyFloats).concat(pedestrians);

  for (var i = 0; i < allObstacles.length; i++) {
    var obs = allObstacles[i];
    var oh = getEntityHitbox(obs);
    if (checkAABB(th.x, th.y, th.w, th.h, oh.x, oh.y, oh.w, oh.h)) {
      return { collision: true, entity: obs };
    }
  }
  return { collision: false, entity: null };
}

function checkBeadVsTargets(beads, kids, trees, houses) {
  var results = [];

  for (var bi = 0; bi < beads.length; bi++) {
    var bead = beads[bi];
    var bx = bead.x;
    var by = bead.y;
    var beadHit = false;

    // Check kids first (+1 point, priority target)
    for (var ki = 0; ki < kids.length; ki++) {
      var kid = kids[ki];
      if (kid.hit) continue;
      var kh = getEntityHitbox(kid);
      if (checkAABB(bx, by, 4, 4, kh.x, kh.y, kh.w, kh.h)) {
        results.push({ beadIndex: bi, targetType: 'kid', targetIndex: ki, points: 1 });
        beadHit = true;
        break;
      }
    }
    if (beadHit) continue;

    // Check trees (-1 point)
    for (var ti = 0; ti < trees.length; ti++) {
      var tree = trees[ti];
      if (tree.hit) continue;
      var trh = getEntityHitbox(tree);
      if (checkAABB(bx, by, 4, 4, trh.x, trh.y, trh.w, trh.h)) {
        results.push({ beadIndex: bi, targetType: 'tree', targetIndex: ti, points: -1 });
        beadHit = true;
        break;
      }
    }
    if (beadHit) continue;

    // Check houses (-1 point)
    for (var hi = 0; hi < houses.length; hi++) {
      var house = houses[hi];
      var hh = getEntityHitbox(house);
      if (checkAABB(bx, by, 4, 4, hh.x, hh.y, hh.w, hh.h)) {
        results.push({ beadIndex: bi, targetType: 'house', targetIndex: hi, points: -1 });
        break;
      }
    }
  }

  return results;
}

// ============================================================
// SECTION 10: SPAWNING SYSTEM
// ============================================================

function updateSpawnTimer(currentTimer, dt) {
  return currentTimer - dt;
}

function getNextSpawnInterval(baseInterval, variance) {
  return baseInterval + (Math.random() * 2 - 1) * variance;
}

function wouldOverlapSideProp(newY, newH, side, trees, houses) {
  // Check against all trees on the same side
  for (var i = 0; i < trees.length; i++) {
    if (trees[i].side === side) {
      if (newY < trees[i].y + trees[i].h && newY + newH > trees[i].y) return true;
    }
  }
  // Check against all houses on the same side
  for (var j = 0; j < houses.length; j++) {
    if (houses[j].side === side) {
      if (newY < houses[j].y + houses[j].h && newY + newH > houses[j].y) return true;
    }
  }
  return false;
}

function spawnEntities(state, dt) {
  var config = LEVEL_CONFIGS[state.level];
  var rates = config.spawnRates;

  var entityTypes = ['kid', 'tree', 'house', 'pothole', 'enemyFloat', 'pedestrian'];

  for (var i = 0; i < entityTypes.length; i++) {
    var type = entityTypes[i];
    var rate = rates[type];
    if (rate.interval <= 0) continue;

    state.spawnTimers[type] = updateSpawnTimer(state.spawnTimers[type], dt);

    if (state.spawnTimers[type] <= 0) {
      state.spawnTimers[type] = getNextSpawnInterval(rate.interval, rate.variance);
      var side = Math.random() < 0.5 ? 'left' : 'right';

      switch (type) {
        case 'kid':
          state.kids.push(createKid(side));
          break;
        case 'tree':
          if (!wouldOverlapSideProp(-24, 24, side, state.trees, state.houses)) {
            state.trees.push(createTree(side));
          }
          break;
        case 'house':
          if (!wouldOverlapSideProp(-32, 30, side, state.trees, state.houses)) {
            state.houses.push(createHouse(side));
          }
          break;
        case 'pothole':
          state.potholes.push(createPothole());
          break;
        case 'enemyFloat':
          state.enemyFloats.push(createEnemyFloat());
          break;
        case 'pedestrian':
          state.pedestrians.push(createPedestrian());
          break;
      }
    }
  }
}

// ============================================================
// SECTION 11: UPDATE FUNCTIONS
// ============================================================

function updatePlaying(state, dt) {
  // Move teddy
  var newPos = computeTeddyPosition(state.teddy, state.input, dt);
  state.teddy.x = newPos.x;
  state.teddy.y = newPos.y;

  // Throw timer visual reset
  if (state.teddy.throwTimer > 0) {
    state.teddy.throwTimer -= dt;
    if (state.teddy.throwTimer <= 0) {
      state.teddy.throwFrame = 0;
    }
  }

  // Bead throwing (supports both tap and hold-to-auto-throw)
  state.beadCooldown = Math.max(0, state.beadCooldown - dt);
  if ((state.input.beadLeftPressed || state.input.beadLeft) && state.beadCooldown <= 0 && state.beadsRemaining > 0) {
    state.beads.push(createBead(state.teddy.x, state.teddy.y, 'left', state.beadColorIndex));
    state.beadColorIndex = (state.beadColorIndex + 1) % 3;
    state.beadCooldown = BEAD_COOLDOWN;
    state.beadsRemaining--;
    state.teddy.throwFrame = 1;
    state.teddy.throwTimer = 0.2;
  }
  if ((state.input.beadRightPressed || state.input.beadRight) && state.beadCooldown <= 0 && state.beadsRemaining > 0) {
    state.beads.push(createBead(state.teddy.x, state.teddy.y, 'right', state.beadColorIndex));
    state.beadColorIndex = (state.beadColorIndex + 1) % 3;
    state.beadCooldown = BEAD_COOLDOWN;
    state.beadsRemaining--;
    state.teddy.throwFrame = 2;
    state.teddy.throwTimer = 0.2;
  }

  // Move beads
  for (var i = state.beads.length - 1; i >= 0; i--) {
    var bp = computeBeadPosition(state.beads[i], dt);
    state.beads[i].x = bp.x;
    state.beads[i].y = bp.y;
    state.beads[i].sparkleTimer += dt;
    state.beads[i].sparkle = Math.floor(state.beads[i].sparkleTimer * 10) % 2 === 0;
    if (isBeadOffScreen(state.beads[i])) {
      state.beads.splice(i, 1);
    }
  }

  // Scroll world
  var scrollDelta = state.scrollSpeed * dt;
  state.scrollDistance += scrollDelta;
  state.scrollOffset += scrollDelta;

  // Scroll all entities
  scrollEntitiesArray(state.kids, state.scrollSpeed, dt);
  scrollEntitiesArray(state.trees, state.scrollSpeed, dt);
  scrollEntitiesArray(state.houses, state.scrollSpeed, dt);
  scrollEntitiesArray(state.potholes, state.scrollSpeed, dt);
  scrollEntitiesArray(state.enemyFloats, state.scrollSpeed, dt);
  scrollEntitiesArray(state.beadPowerups, state.scrollSpeed, dt);

  // Update bead powerup animations
  for (var bpi = 0; bpi < state.beadPowerups.length; bpi++) {
    state.beadPowerups[bpi].animTimer += dt;
  }

  // Update enemy float animations and sway
  var swayAmount = state.level >= 3 ? 10 : 0;
  for (var efi = 0; efi < state.enemyFloats.length; efi++) {
    var ef = state.enemyFloats[efi];
    ef.animTimer += dt;
    if (ef.baseX === 0) ef.baseX = ef.x;
    if (swayAmount > 0) {
      ef.swayOffset = Math.sin(ef.animTimer * 2) * swayAmount;
      ef.x = ef.baseX + ef.swayOffset;
      // Clamp to road bounds
      ef.x = Math.max(ROAD_LEFT + 2, Math.min(ef.x, ROAD_RIGHT - ef.w + 2));
    }
  }

  // Pedestrians: scroll and move horizontally
  for (var pi = 0; pi < state.pedestrians.length; pi++) {
    var ped = state.pedestrians[pi];
    ped.y = scrollEntityY(ped, state.scrollSpeed, dt);
    ped.x += ped.direction * ped.speed * dt;
    ped.animTimer += dt;
    if (ped.animTimer > 0.3) {
      ped.animTimer = 0;
      ped.animFrame = ped.animFrame === 0 ? 1 : 0;
    }
  }

  // Kid animations
  for (var ka = 0; ka < state.kids.length; ka++) {
    state.kids[ka].animTimer += dt;
    if (state.kids[ka].animTimer > 0.4) {
      state.kids[ka].animTimer = 0;
      state.kids[ka].animFrame = state.kids[ka].animFrame === 0 ? 1 : 0;
    }
  }

  // Spawn new entities
  spawnEntities(state, dt);

  // Spawn bead powerups when low on beads
  if (state.beadsRemaining <= 5) {
    state.beadPowerupTimer -= dt;
    if (state.beadPowerupTimer <= 0) {
      state.beadPowerups.push(createBeadPowerup());
      state.beadPowerupTimer = 3.0 + Math.random() * 4.0;
    }
  }

  // Remove off-screen entities
  removeOffScreen(state);

  // Teddy vs bead powerup collision
  var th = getTeddyHitbox(state.teddy);
  for (var pui = state.beadPowerups.length - 1; pui >= 0; pui--) {
    var pu = state.beadPowerups[pui];
    if (checkAABB(th.x, th.y, th.w, th.h, pu.x, pu.y, pu.w, pu.h)) {
      state.beadsRemaining += 10;
      state.floatingTexts.push(createFloatingText(pu.x, pu.y, 10));
      // Gold particles
      for (var gpi = 0; gpi < 5; gpi++) {
        state.particles.push(createParticle(pu.x + 5, pu.y + 3, COLORS.gold));
      }
      state.beadPowerups.splice(pui, 1);
    }
  }

  // Bead collision detection
  var beadHits = checkBeadVsTargets(state.beads, state.kids, state.trees, state.houses);
  var beadsToRemove = {};
  for (var bhi = 0; bhi < beadHits.length; bhi++) {
    var hit = beadHits[bhi];
    beadsToRemove[hit.beadIndex] = true;
    state.score += hit.points;

    var hitBead = state.beads[hit.beadIndex];
    state.floatingTexts.push(createFloatingText(hitBead.x, hitBead.y, hit.points));

    if (hit.targetType === 'kid') {
      state.kids[hit.targetIndex].hit = true;
      // Gold flash particles
      for (var gp = 0; gp < 4; gp++) {
        state.particles.push(createParticle(hitBead.x, hitBead.y, COLORS.gold));
      }
    } else if (hit.targetType === 'tree') {
      state.trees[hit.targetIndex].hit = true;
      for (var tp = 0; tp < 3; tp++) {
        state.particles.push(createParticle(hitBead.x, hitBead.y, COLORS.greenDark));
      }
    } else if (hit.targetType === 'house') {
      state.houses[hit.targetIndex].hitTimer = 0.5;
      for (var hp = 0; hp < 3; hp++) {
        state.particles.push(createParticle(hitBead.x, hitBead.y, COLORS.red));
      }
    }
  }

  // Remove hit beads (iterate backwards)
  var beadIndices = Object.keys(beadsToRemove).map(Number).sort(function(a, b) { return b - a; });
  for (var ri = 0; ri < beadIndices.length; ri++) {
    state.beads.splice(beadIndices[ri], 1);
  }

  // Teddy vs obstacles collision (no damage once finish line is on screen)
  var distToFinish = LEVEL_CONFIGS[state.level].levelLength - state.scrollDistance;
  var finishOnScreen = distToFinish < 300 && (PLAY_TOP + (300 - distToFinish) - 60) > PLAY_TOP;
  if (state.invincibleTimer <= 0 && !finishOnScreen) {
    var collision = checkTeddyVsObstacles(
      state.teddy, state.potholes, state.enemyFloats, state.pedestrians
    );
    if (collision.collision) {
      state.hearts--;
      // Particles burst
      for (var cp = 0; cp < 6; cp++) {
        state.particles.push(createParticle(state.teddy.x + 16, state.teddy.y + 16, COLORS.red));
      }
      if (state.hearts <= 0) {
        state.lives--;
        if (state.lives <= 0) {
          state.screen = 'gameOver';
          return;
        }
        // Enter death transition: shake → pause → shake → stage start screen
        state.screen = 'deathTransition';
        state.deathPhase = 'shake1';
        state.deathTimer = 0;
        state.shakeTimer = 0.3;
        return;
      }
      state.invincibleTimer = INVINCIBLE_DURATION;
      state.shakeTimer = 0.3;
    }
  } else {
    state.invincibleTimer -= dt;
  }

  // Screen shake
  if (state.shakeTimer > 0) {
    state.shakeTimer -= dt;
    state.shakeX = (Math.random() - 0.5) * 4;
    state.shakeY = (Math.random() - 0.5) * 4;
  } else {
    state.shakeX = 0;
    state.shakeY = 0;
  }

  // Update floating texts
  for (var fti = state.floatingTexts.length - 1; fti >= 0; fti--) {
    state.floatingTexts[fti].timer += dt;
    if (state.floatingTexts[fti].timer >= state.floatingTexts[fti].duration) {
      state.floatingTexts.splice(fti, 1);
    }
  }

  // Update particles
  for (var pti = state.particles.length - 1; pti >= 0; pti--) {
    var part = state.particles[pti];
    part.x += part.vx * dt;
    part.y += part.vy * dt;
    part.timer += dt;
    if (part.timer >= part.duration) {
      state.particles.splice(pti, 1);
    }
  }

  // Update house hit timers
  for (var hti = 0; hti < state.houses.length; hti++) {
    if (state.houses[hti].hitTimer > 0) {
      state.houses[hti].hitTimer -= dt;
    }
  }

  // Ensure score doesn't go below 0
  if (state.score < 0) state.score = 0;

  // Check level end — Teddy crosses the finish line
  var levelConfig = LEVEL_CONFIGS[state.level];
  var distToEnd = levelConfig.levelLength - state.scrollDistance;
  if (distToEnd < 300) {
    var finishLineY = PLAY_TOP + (300 - distToEnd) - 60;
    if (finishLineY >= state.teddy.y + 16) {
      state.screen = 'levelEnd';
      state.levelEndTimer = 0;
      state.levelEndPhase = 'freeze';
      state.levelEndPassed = state.score >= state.targetScore;
      if (!state.levelEndPassed) {
        state.lives--;
      }
    }
  }

  // Pause toggle
  if (state.input.pausePressed) {
    state.paused = !state.paused;
  }
}

function scrollEntitiesArray(arr, speed, dt) {
  for (var i = 0; i < arr.length; i++) {
    arr[i].y = scrollEntityY(arr[i], speed, dt);
  }
}

function removeOffScreen(state) {
  state.kids = state.kids.filter(function(e) { return !isOffScreen(e); });
  state.trees = state.trees.filter(function(e) { return !isOffScreen(e); });
  state.houses = state.houses.filter(function(e) { return !isOffScreen(e); });
  state.potholes = state.potholes.filter(function(e) { return !isOffScreen(e); });
  state.enemyFloats = state.enemyFloats.filter(function(e) { return !isOffScreen(e); });
  state.beadPowerups = state.beadPowerups.filter(function(e) { return !isOffScreen(e); });
  state.pedestrians = state.pedestrians.filter(function(e) {
    return !isOffScreen(e) && e.x > -20 && e.x < CANVAS_WIDTH + 20;
  });
}

function updateLevelComplete(state, dt) {
  // Legacy — no longer used, kept for safety
  state.levelCompleteTimer += dt;
}

function updateLevelEnd(state, dt) {
  state.levelEndTimer += dt;
  var t = state.levelEndTimer;

  if (state.levelEndPhase === 'freeze' && t >= 1.0) {
    state.levelEndPhase = 'fadeOut';
    state.levelEndTimer = 0;
  } else if (state.levelEndPhase === 'fadeOut' && t >= 1.0) {
    state.levelEndPhase = 'result';
    state.levelEndTimer = 0;
  } else if (state.levelEndPhase === 'result' && t >= 5.0) {
    state.levelEndPhase = 'fadeOutResult';
    state.levelEndTimer = 0;
  } else if (state.levelEndPhase === 'fadeOutResult' && t >= 0.5) {
    // Transition to next state
    if (state.levelEndPassed) {
      if (state.level >= 3) {
        state.screen = 'win';
      } else {
        state.level++;
        resetLevelState(state);
        state.screen = 'playing';
      }
    } else {
      if (state.lives <= 0) {
        state.screen = 'gameOver';
      } else {
        resetLevelState(state);
        state.screen = 'playing';
      }
    }
  }
}

function updateDeathTransition(state, dt) {
  state.deathTimer += dt;

  if (state.deathPhase === 'shake1') {
    // First shake (0.3s) — same as normal collision shake
    state.shakeTimer -= dt;
    if (state.shakeTimer > 0) {
      state.shakeX = (Math.random() - 0.5) * 4;
      state.shakeY = (Math.random() - 0.5) * 4;
    } else {
      state.shakeX = 0;
      state.shakeY = 0;
      state.deathPhase = 'pause';
      state.deathTimer = 0;
    }
  } else if (state.deathPhase === 'pause') {
    // Frozen pause (1.0s)
    state.shakeX = 0;
    state.shakeY = 0;
    if (state.deathTimer >= 1.0) {
      state.deathPhase = 'shake2';
      state.shakeTimer = 0.3;
      state.deathTimer = 0;
    }
  } else if (state.deathPhase === 'shake2') {
    // Second shake (0.3s)
    state.shakeTimer -= dt;
    if (state.shakeTimer > 0) {
      state.shakeX = (Math.random() - 0.5) * 4;
      state.shakeY = (Math.random() - 0.5) * 4;
    } else {
      state.shakeX = 0;
      state.shakeY = 0;
      state.deathPhase = 'fadeOut';
      state.deathTimer = 0;
    }
  } else if (state.deathPhase === 'fadeOut') {
    // Fade to black (0.5s)
    if (state.deathTimer >= 0.5) {
      state.deathPhase = 'stageStart';
      state.deathTimer = 0;
    }
  } else if (state.deathPhase === 'stageStart') {
    // Show stage start screen (2.5s) then reset and play
    if (state.deathTimer >= 2.5) {
      resetLevelState(state);
      state.screen = 'playing';
    }
  }

  // Update particles so the red burst from the hit animates out
  for (var pti = state.particles.length - 1; pti >= 0; pti--) {
    var part = state.particles[pti];
    part.x += part.vx * dt;
    part.y += part.vy * dt;
    part.timer += dt;
    if (part.timer >= part.duration) {
      state.particles.splice(pti, 1);
    }
  }
}

function renderDeathTransition(ctx, state) {
  var phase = state.deathPhase;

  if (phase === 'shake1' || phase === 'pause' || phase === 'shake2') {
    // Render frozen gameplay frame with shake applied
    renderPlaying(ctx, state);
  } else if (phase === 'fadeOut') {
    // Frozen frame fading to black
    renderPlaying(ctx, state);
    var fadeAlpha = Math.min(state.deathTimer / 0.5, 1.0);
    ctx.fillStyle = 'rgba(0, 0, 0, ' + fadeAlpha + ')';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  } else if (phase === 'stageStart') {
    // Stage start screen — street name and lives
    var config = LEVEL_CONFIGS[state.level];
    ctx.fillStyle = '#1A0A2E';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    var fadeIn = Math.min(state.deathTimer / 0.5, 1.0);
    ctx.globalAlpha = fadeIn;

    // Level label
    var lvLine = 'LEVEL ' + state.level;
    var lvW = getTextWidth(lvLine, 2);
    drawText(ctx, lvLine, Math.floor((CANVAS_WIDTH - lvW) / 2), 60, COLORS.gold, 2);

    // Street name
    var nameW = getTextWidth(config.name, 2);
    drawText(ctx, config.name, Math.floor((CANVAS_WIDTH - nameW) / 2), 85, COLORS.white, 2);

    // Lives display
    var livesLine = 'LIVES: ' + state.lives;
    var livesW = getTextWidth(livesLine, 1);
    drawText(ctx, livesLine, Math.floor((CANVAS_WIDTH - livesW) / 2), 120, COLORS.greenLight, 1);

    // Teddy sprite
    drawSpriteFromPalette(ctx, TEDDY_IDLE, TEDDY_PALETTE, 112, 140);

    ctx.globalAlpha = 1.0;
  }
}

function updateTitleScreen(state, dt) {
  state.titleAnimTimer += dt;
}

function updateStory(state, dt) {
  var text = STORY_TEXTS[state.storyScreen];

  if (state.storyPhase === 'fadeIn') {
    state.storyFadeTimer += dt;
    if (state.storyFadeTimer >= 0.5) {
      state.storyPhase = 'typing';
      state.storyFadeTimer = 0;
    }
  } else if (state.storyPhase === 'typing') {
    state.storyTimer += dt;
    // ~30 chars per second typewriter speed
    state.storyCharIndex = Math.floor(state.storyTimer * 30);
    if (state.storyCharIndex >= text.length) {
      state.storyPhase = 'waiting';
      state.storyTimer = 0;
    }
  } else if (state.storyPhase === 'waiting') {
    state.storyTimer += dt;
    if (state.storyTimer >= 5.0) {
      state.storyPhase = 'fadeOut';
      state.storyFadeTimer = 0;
    }
  } else if (state.storyPhase === 'fadeOut') {
    state.storyFadeTimer += dt;
    if (state.storyFadeTimer >= 0.5) {
      advanceFromStory(state);
    }
  }
}

function hideStoryOverlay() {
  var overlay = document.getElementById('story-overlay');
  if (overlay) overlay.style.display = 'none';
}

function advanceFromStory(state) {
  if (state.storyScreen === 1) {
    // Go to story2
    state.screen = 'story';
    state.storyScreen = 2;
    state.storyTimer = 0;
    state.storyFadeTimer = 0;
    state.storyPhase = 'fadeIn';
    state.storyCharIndex = 0;
  } else if (state.storyScreen === 2) {
    // Start the game
    hideStoryOverlay();
    state.screen = 'playing';
    state.level = 1;
    state.lives = 3;
    state.hearts = 3;
    resetLevelState(state);
  } else if (state.storyScreen === 3) {
    // Go to game over / play again screen
    hideStoryOverlay();
    state.screen = 'gameOver';
    state.titleAnimTimer = 0;
  }
}

function renderStory(ctx, state) {
  var phase = state.storyPhase;
  var storyNum = state.storyScreen;
  var text = STORY_TEXTS[storyNum];

  // Dark background
  ctx.fillStyle = '#1A0A2E';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Show story image via HTML overlay (bypasses canvas pixelation)
  var overlay = document.getElementById('story-overlay');
  var imgEl = document.getElementById('story-image');
  if (overlay && imgEl) {
    overlay.style.display = 'block';
    var imgSrc = 'images/' + storyNum + '.jpeg';
    if (imgEl.getAttribute('src') !== imgSrc) {
      imgEl.src = imgSrc;
    }
    // Apply fade to the image element
    if (phase === 'fadeIn') {
      imgEl.style.opacity = Math.min(state.storyFadeTimer / 0.5, 1.0);
    } else if (phase === 'fadeOut') {
      imgEl.style.opacity = Math.max(1.0 - state.storyFadeTimer / 0.5, 0);
    } else {
      imgEl.style.opacity = 1;
    }
  }

  // Typewriter text below image (with ~2rem gap from image)
  var textY = 137;
  var charsToShow = Math.min(state.storyCharIndex, text.length);
  drawWrappedText(ctx, text, 8, 240, textY, COLORS.white, 1, charsToShow);

  // Fade overlay (for text area on canvas)
  if (phase === 'fadeIn') {
    var fadeAlpha = Math.max(0, 1.0 - state.storyFadeTimer / 0.5);
    ctx.fillStyle = 'rgba(0, 0, 0, ' + fadeAlpha + ')';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  } else if (phase === 'fadeOut') {
    var fadeAlpha2 = Math.min(state.storyFadeTimer / 0.5, 1.0);
    ctx.fillStyle = 'rgba(0, 0, 0, ' + fadeAlpha2 + ')';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }
}

// ============================================================
// SECTION 12: RENDER FUNCTIONS
// ============================================================

function renderPlaying(ctx, state) {
  ctx.save();
  ctx.translate(Math.floor(state.shakeX), Math.floor(state.shakeY));

  // Draw road and environment
  drawRoad(ctx, state.scrollOffset);

  // Draw houses (behind sidewalk entities)
  for (var hi = 0; hi < state.houses.length; hi++) {
    drawHouse(ctx, state.houses[hi]);
  }

  // Draw trees
  for (var ti = 0; ti < state.trees.length; ti++) {
    drawTree(ctx, state.trees[ti]);
  }

  // Draw kids
  for (var ki = 0; ki < state.kids.length; ki++) {
    drawKid(ctx, state.kids[ki]);
  }

  // Draw potholes
  for (var pi = 0; pi < state.potholes.length; pi++) {
    drawPothole(ctx, state.potholes[pi]);
  }

  // Draw bead powerups
  for (var bpui = 0; bpui < state.beadPowerups.length; bpui++) {
    drawBeadPowerup(ctx, state.beadPowerups[bpui]);
  }

  // Draw finish line approaching from ahead (top of screen, scrolls down)
  var levelConfig2 = LEVEL_CONFIGS[state.level];
  var distToEnd = levelConfig2.levelLength - state.scrollDistance;
  if (distToEnd < 300 && distToEnd > -40) {
    // finishLineY starts above screen and scrolls down as player approaches end
    var finishLineY = PLAY_TOP + (300 - distToEnd) - 60;
    if (finishLineY > PLAY_TOP - 20 && finishLineY < CANVAS_HEIGHT + 10) {
      drawFinishLine(ctx, finishLineY);
    }
  }

  // Draw enemy floats
  for (var ei = 0; ei < state.enemyFloats.length; ei++) {
    drawEnemyFloat(ctx, state.enemyFloats[ei]);
  }

  // Draw pedestrians
  for (var ped = 0; ped < state.pedestrians.length; ped++) {
    drawPedestrian(ctx, state.pedestrians[ped]);
  }

  // Draw beads
  for (var bi = 0; bi < state.beads.length; bi++) {
    drawBead(ctx, state.beads[bi]);
  }

  // Draw Teddy (with invincibility blink)
  if (state.invincibleTimer <= 0 || Math.floor(state.invincibleTimer * 8) % 2 === 0) {
    drawTeddy(ctx, state.teddy);
  }

  // Draw particles
  drawParticles(ctx, state.particles);

  // Draw floating texts
  drawFloatingTexts(ctx, state.floatingTexts);

  ctx.restore();

  // HUD (not affected by screen shake)
  drawHUD(ctx, state);

  // Paused overlay
  if (state.paused) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    var pauseText = 'PAUSED';
    var ptw = getTextWidth(pauseText, 2);
    drawText(ctx, pauseText, Math.floor((CANVAS_WIDTH - ptw) / 2), 100, COLORS.gold, 2);
  }
}

function renderTitleScreen(ctx, state) {
  // Background
  ctx.fillStyle = '#1A0A2E';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Animated bead particles in background
  var t = state.titleAnimTimer;
  for (var i = 0; i < 20; i++) {
    var bx = (Math.sin(t * 0.5 + i * 1.3) * 0.5 + 0.5) * CANVAS_WIDTH;
    var by = ((t * 15 + i * 47) % (CANVAS_HEIGHT + 10)) - 5;
    var color = BEAD_COLORS[i % 3];
    ctx.fillStyle = color;
    ctx.fillRect(Math.floor(bx), Math.floor(by), 3, 3);
  }

  // Title
  var title1 = "TEDDY'S";
  var title2 = 'MARDI GRAS';
  var title3 = 'BALL';
  var tw1 = getTextWidth(title1, 2);
  var tw2 = getTextWidth(title2, 2);
  var tw3 = getTextWidth(title3, 3);

  // Shadow
  drawText(ctx, title1, Math.floor((CANVAS_WIDTH - tw1) / 2) + 1, 31, COLORS.purpleDark, 2);
  drawText(ctx, title2, Math.floor((CANVAS_WIDTH - tw2) / 2) + 1, 51, COLORS.greenDark, 2);
  drawText(ctx, title3, Math.floor((CANVAS_WIDTH - tw3) / 2) + 1, 76, COLORS.goldDark, 3);

  // Main text
  drawText(ctx, title1, Math.floor((CANVAS_WIDTH - tw1) / 2), 30, COLORS.purple, 2);
  drawText(ctx, title2, Math.floor((CANVAS_WIDTH - tw2) / 2), 50, COLORS.green, 2);
  drawText(ctx, title3, Math.floor((CANVAS_WIDTH - tw3) / 2), 75, COLORS.gold, 3);

  // Draw mini Teddy
  drawSpriteFromPalette(ctx, TEDDY_IDLE, TEDDY_PALETTE, 112, 110);

  // Flashing "Press ENTER" text
  var showPrompt = Math.floor(t * 2) % 2 === 0;
  if (showPrompt) {
    var promptText = isTouchDevice() ? 'TAP TO START' : 'PRESS ENTER';
    var pw = getTextWidth(promptText, 1);
    drawText(ctx, promptText, Math.floor((CANVAS_WIDTH - pw) / 2), 160, COLORS.white, 1);
  }

  // Controls info
  var ctrl1 = isTouchDevice() ? 'DPAD: MOVE' : 'ARROWS: MOVE';
  var ctrl2 = isTouchDevice() ? 'A:LEFT B:RIGHT' : 'Z:LEFT X:RIGHT';
  var ctrl3 = 'THROW BEADS!';
  drawText(ctx, ctrl1, Math.floor((CANVAS_WIDTH - getTextWidth(ctrl1, 1)) / 2), 185, COLORS.grayLight, 1);
  drawText(ctx, ctrl2, Math.floor((CANVAS_WIDTH - getTextWidth(ctrl2, 1)) / 2), 195, COLORS.grayLight, 1);
  drawText(ctx, ctrl3, Math.floor((CANVAS_WIDTH - getTextWidth(ctrl3, 1)) / 2), 205, COLORS.gold, 1);

  // Decorative bottom bar
  ctx.fillStyle = COLORS.purple;
  ctx.fillRect(0, 225, CANVAS_WIDTH, 3);
  ctx.fillStyle = COLORS.green;
  ctx.fillRect(0, 228, CANVAS_WIDTH, 3);
  ctx.fillStyle = COLORS.gold;
  ctx.fillRect(0, 231, CANVAS_WIDTH, 3);
}

function renderLevelEnd(ctx, state) {
  var phase = state.levelEndPhase;
  var t = state.levelEndTimer;

  if (phase === 'freeze') {
    // Draw the frozen gameplay frame (Teddy stopped at the finish line)
    renderPlaying(ctx, state);
  } else if (phase === 'fadeOut') {
    // Draw gameplay, then overlay black fading in
    renderPlaying(ctx, state);
    var fadeAlpha = Math.min(t / 1.0, 1.0);
    ctx.fillStyle = 'rgba(0, 0, 0, ' + fadeAlpha + ')';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  } else if (phase === 'result') {
    // Full result screen with fade-in
    var fadeIn = Math.min(t / 0.5, 1.0);
    // Dark background
    ctx.fillStyle = '#1A0A2E';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.globalAlpha = fadeIn;
    if (state.levelEndPassed) {
      renderLevelCompleteContent(ctx, state);
    } else {
      renderLevelFailedContent(ctx, state);
    }
    ctx.globalAlpha = 1.0;
  } else if (phase === 'fadeOutResult') {
    // Result screen fading to black
    ctx.fillStyle = '#1A0A2E';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    if (state.levelEndPassed) {
      renderLevelCompleteContent(ctx, state);
    } else {
      renderLevelFailedContent(ctx, state);
    }
    var fadeOut = Math.min(t / 0.5, 1.0);
    ctx.fillStyle = 'rgba(0, 0, 0, ' + fadeOut + ')';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }
}

function renderLevelCompleteContent(ctx, state) {
  var line1 = 'LEVEL ' + state.level + ' CLEAR!';
  var line2 = 'SCORE: ' + state.score + '/' + state.targetScore;
  var line3 = state.level < 3 ? 'NEXT: ' + LEVEL_CONFIGS[state.level + 1].name : 'FINAL SCORE: ' + state.score;

  var w1 = getTextWidth(line1, 2);
  var w2 = getTextWidth(line2, 1);
  var w3 = getTextWidth(line3, 1);

  drawText(ctx, line1, Math.floor((CANVAS_WIDTH - w1) / 2), 60, COLORS.gold, 2);
  drawText(ctx, line2, Math.floor((CANVAS_WIDTH - w2) / 2), 95, COLORS.white, 1);
  drawText(ctx, line3, Math.floor((CANVAS_WIDTH - w3) / 2), 115, COLORS.greenLight, 1);

  // Happy teddy with smile
  drawSpriteFromPalette(ctx, TEDDY_IDLE, TEDDY_PALETTE, 112, 135);

  // Stars animation
  var starT = state.levelEndTimer;
  for (var si = 0; si < 8; si++) {
    var sx = CANVAS_WIDTH / 2 + Math.cos(starT * 3 + si * 0.8) * (40 + si * 8);
    var sy = 45 + Math.sin(starT * 3 + si * 0.8) * 15;
    ctx.fillStyle = BEAD_COLORS[si % 3];
    ctx.fillRect(Math.floor(sx), Math.floor(sy), 3, 3);
  }
}

function renderLevelFailedContent(ctx, state) {
  var fail1 = 'NOT ENOUGH BEADS!';
  var fail2 = 'SCORE: ' + state.score + '/' + state.targetScore;

  var w1 = getTextWidth(fail1, 2);
  var w2 = getTextWidth(fail2, 1);

  drawText(ctx, fail1, Math.floor((CANVAS_WIDTH - w1) / 2), 60, COLORS.red, 2);
  drawText(ctx, fail2, Math.floor((CANVAS_WIDTH - w2) / 2), 95, COLORS.white, 1);

  if (state.lives <= 0) {
    var fail3 = 'NO LIVES LEFT...';
    var w3 = getTextWidth(fail3, 1);
    drawText(ctx, fail3, Math.floor((CANVAS_WIDTH - w3) / 2), 115, COLORS.red, 1);
  } else {
    var fail3b = 'TRY AGAIN!';
    var fail4b = 'LIVES: ' + state.lives;
    var w3b = getTextWidth(fail3b, 1);
    var w4b = getTextWidth(fail4b, 1);
    drawText(ctx, fail3b, Math.floor((CANVAS_WIDTH - w3b) / 2), 115, COLORS.gold, 1);
    drawText(ctx, fail4b, Math.floor((CANVAS_WIDTH - w4b) / 2), 130, COLORS.greenLight, 1);
  }

  // Sad frowning teddy
  drawSpriteFromPalette(ctx, TEDDY_FROWN, TEDDY_PALETTE, 112, 150);
}

function renderGameOver(ctx, state) {
  ctx.fillStyle = '#1A0A2E';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  var go1 = 'GAME OVER';
  var go2 = 'FINAL SCORE: ' + state.score;
  var go3 = isTouchDevice() ? 'TAP TO RETRY' : 'PRESS ENTER';

  var w1 = getTextWidth(go1, 2);
  var w2 = getTextWidth(go2, 1);
  var w3 = getTextWidth(go3, 1);

  drawText(ctx, go1, Math.floor((CANVAS_WIDTH - w1) / 2), 80, COLORS.red, 2);
  drawText(ctx, go2, Math.floor((CANVAS_WIDTH - w2) / 2), 115, COLORS.white, 1);

  var show = Math.floor(state.titleAnimTimer * 2) % 2 === 0;
  if (show) {
    drawText(ctx, go3, Math.floor((CANVAS_WIDTH - w3) / 2), 150, COLORS.gold, 1);
  }

  // Sad teddy with frown
  drawSpriteFromPalette(ctx, TEDDY_FROWN, TEDDY_PALETTE, 112, 170);
}

function renderWin(ctx, state) {
  ctx.fillStyle = '#1A0A2E';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Celebration particles
  var wt = state.titleAnimTimer;
  for (var i = 0; i < 30; i++) {
    var wx = (Math.sin(wt * 0.8 + i * 0.9) * 0.5 + 0.5) * CANVAS_WIDTH;
    var wy = ((wt * 20 + i * 37) % (CANVAS_HEIGHT + 10)) - 5;
    ctx.fillStyle = BEAD_COLORS[i % 3];
    ctx.fillRect(Math.floor(wx), Math.floor(wy), 3, 3);
  }

  var win1 = 'LAISSEZ LES';
  var win2 = 'BONS TEMPS';
  var win3 = 'ROULER!';
  var win4 = 'SCORE: ' + state.score;
  var win5 = isTouchDevice() ? 'TAP TO PLAY AGAIN' : 'PRESS ENTER';

  drawText(ctx, win1, Math.floor((CANVAS_WIDTH - getTextWidth(win1, 2)) / 2), 30, COLORS.purple, 2);
  drawText(ctx, win2, Math.floor((CANVAS_WIDTH - getTextWidth(win2, 2)) / 2), 50, COLORS.green, 2);
  drawText(ctx, win3, Math.floor((CANVAS_WIDTH - getTextWidth(win3, 2)) / 2), 70, COLORS.gold, 2);

  // Happy Teddy
  drawSpriteFromPalette(ctx, TEDDY_IDLE, TEDDY_PALETTE, 112, 95);

  drawText(ctx, win4, Math.floor((CANVAS_WIDTH - getTextWidth(win4, 2)) / 2), 145, COLORS.white, 2);

  var show = Math.floor(wt * 2) % 2 === 0;
  if (show) {
    drawText(ctx, win5, Math.floor((CANVAS_WIDTH - getTextWidth(win5, 1)) / 2), 180, COLORS.gold, 1);
  }

  // Decorative bars
  ctx.fillStyle = COLORS.purple;
  ctx.fillRect(0, 200, CANVAS_WIDTH, 4);
  ctx.fillStyle = COLORS.green;
  ctx.fillRect(0, 204, CANVAS_WIDTH, 4);
  ctx.fillStyle = COLORS.gold;
  ctx.fillRect(0, 208, CANVAS_WIDTH, 4);
}

// ============================================================
// SECTION 13: GAME LOOP
// ============================================================

function gameLoop(timestamp, state, ctx) {
  var dt = Math.min((timestamp - state.lastTimestamp) / 1000, 0.05);
  state.lastTimestamp = timestamp;

  switch (state.screen) {
    case 'title':
      updateTitleScreen(state, dt);
      renderTitleScreen(ctx, state);
      if (state.input.enterPressed) {
        state.screen = 'titleFadeOut';
        state.storyFadeTimer = 0;
      }
      break;

    case 'titleFadeOut':
      renderTitleScreen(ctx, state);
      state.storyFadeTimer += dt;
      var tFade = Math.min(state.storyFadeTimer / 0.5, 1.0);
      ctx.fillStyle = 'rgba(0, 0, 0, ' + tFade + ')';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      if (state.storyFadeTimer >= 0.5) {
        state.screen = 'story';
        state.storyScreen = 1;
        state.storyTimer = 0;
        state.storyFadeTimer = 0;
        state.storyPhase = 'fadeIn';
        state.storyCharIndex = 0;
      }
      break;

    case 'story':
      updateStory(state, dt);
      renderStory(ctx, state);
      // Skip on Enter/tap (but NOT for story3)
      if (state.input.enterPressed && state.storyScreen !== 3) {
        advanceFromStory(state);
      }
      break;

    case 'playing':
      if (!state.paused) {
        updatePlaying(state, dt);
      } else {
        // Check for unpause
        if (state.input.pausePressed) {
          state.paused = false;
        }
      }
      renderPlaying(ctx, state);
      break;

    case 'levelEnd':
      updateLevelEnd(state, dt);
      renderLevelEnd(ctx, state);
      break;

    case 'deathTransition':
      updateDeathTransition(state, dt);
      renderDeathTransition(ctx, state);
      break;

    case 'gameOver':
      state.titleAnimTimer += dt;
      renderGameOver(ctx, state);
      if (state.input.enterPressed) {
        var savedInput = state.input;
        var savedStoryImages = state.storyImages;
        Object.assign(state, createInitialState());
        state.input = savedInput;
        state.storyImages = savedStoryImages;
        clearPressedFlags(state.input);
        state.screen = 'title';
      }
      break;

    case 'win':
      // Fade out then go to story 3
      state.storyFadeTimer = (state.storyFadeTimer || 0) + dt;
      ctx.fillStyle = '#1A0A2E';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      var winFade = Math.min(state.storyFadeTimer / 0.5, 1.0);
      ctx.fillStyle = 'rgba(0, 0, 0, ' + winFade + ')';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      if (state.storyFadeTimer >= 0.5) {
        state.screen = 'story';
        state.storyScreen = 3;
        state.storyTimer = 0;
        state.storyFadeTimer = 0;
        state.storyPhase = 'fadeIn';
        state.storyCharIndex = 0;
      }
      break;
  }

  clearPressedFlags(state.input);

  requestAnimationFrame(function(ts) {
    gameLoop(ts, state, ctx);
  });
}

// ============================================================
// SECTION 14: TOUCH DETECTION UTILITY
// ============================================================

function isTouchDevice() {
  return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
}

// ============================================================
// SECTION 15: INITIALIZATION
// ============================================================

function init() {
  var canvas = document.getElementById('game-canvas');
  var ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  // Preload story images
  var storyImages = {};
  var img1 = new Image(); img1.src = 'images/1.jpeg'; storyImages[1] = img1;
  var img2 = new Image(); img2.src = 'images/2.jpeg'; storyImages[2] = img2;
  var img3 = new Image(); img3.src = 'images/3.jpeg'; storyImages[3] = img3;

  var state = createInitialState();
  state.storyImages = storyImages;

  setupKeyboard(state.input);
  setupTouchControls(state.input);

  // Show mobile controls on touch devices
  if (isTouchDevice()) {
    var mobileControls = document.getElementById('mobile-controls');
    if (mobileControls) {
      mobileControls.style.display = 'flex';
    }
  }

  state.lastTimestamp = performance.now();
  requestAnimationFrame(function(ts) {
    gameLoop(ts, state, ctx);
  });
}

document.addEventListener('DOMContentLoaded', init);
