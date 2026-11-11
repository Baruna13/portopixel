import type { NavPath } from "@/hooks/useGameNavigation";

/**
 * Shared numbers for the city map. The art in src/assets/world/*.png is drawn
 * to these coordinates (see world-art-generator.py). If you replace the art,
 * keep the same sizes or update the numbers here.
 *
 * All values are "logical pixels": the canvas is 216px tall and is scaled up
 * with nearest-neighbour filtering, which is what gives the crisp pixel look.
 */
export const WORLD = {
  H: 216, // canvas height (logical px)
  W: 2000, // world width (logical px)
  feetY: 178, // y where the avatar's feet stand (on the sidewalk)
  spawnX: 110, // starting x on a fresh visit
  minView: 150, // narrowest visible slice (portrait phones)
  maxView: 480, // widest visible slice (ultra-wide screens)
  doorTop: 94,
  doorHeight: 64,
  doorReach: 26, // how close you must be to a door to enter
  plateY: 83, // vertical centre of the name plates above the doors
} as const;

export interface Building {
  path: NavPath;
  label: string; // text on the building's name plate
  hint: string; // shown in the HUD when you stand at the door
  doorX: number;
  plateText: string; // plate text colour
}

const bx = (i: number) => 170 + i * 340 + 150; // door centre of the i-th building

export const BUILDINGS: Building[] = [
  { path: "profile", label: "PROFILE", hint: "PLAYER PROFILE", doorX: bx(0), plateText: "#2b1a0e" },
  { path: "missions", label: "MISSIONS", hint: "ACTIVE MISSIONS", doorX: bx(1), plateText: "#ffffff" },
  { path: "inventory", label: "INVENTORY", hint: "INVENTORY", doorX: bx(2), plateText: "#3a2a1a" },
  { path: "trophies", label: "TROPHIES", hint: "TROPHY HALL", doorX: bx(3), plateText: "#f2c94c" },
  { path: "contact", label: "CONTACT", hint: "CONTACT POST", doorX: bx(4), plateText: "#ffffff" },
];

/** Wooden welcome board next to the spawn point. */
export const WELCOME_SIGN = { x: 80, lines: [{ text: "WELCOME", y: 110 }, { text: "PLAYER 1", y: 122 }] };

/**
 * Walking sprite sheet: src/assets/world/avatar-walk.png, a horizontal strip of
 * equally sized frames. The artwork FACES LEFT; the engine mirrors it when
 * walking right. Tweak `walk` (frame order) and `fps` to change the gait.
 */
export const AVATAR = {
  frameW: 31,
  frameH: 60,
  anchorX: 13, // x inside a frame that sits on the player's position (head centre)
  idle: 0, // frame shown when standing still
  walk: [1, 2, 3, 4, 5], // frames looped while walking
  fps: 10, // walk animation speed (run is 1.6x faster)
} as const;

/* ------------------------------------------------------------------ NPCs */

export interface SheetSpec {
  frameW: number;
  frameH: number;
  anchorX: number;
  idle: number;
  walk: readonly number[];
  fps: number;
}

/** Default layout of an NPC sprite sheet: [idle, walk1, walk2, walk3, walk4], artwork facing LEFT. */
export const NPC_SHEET: SheetSpec = { frameW: 31, frameH: 60, anchorX: 13, idle: 0, walk: [1, 2, 3, 4], fps: 6 };

export interface Npc {
  /** Sprite sheet is read from src/assets/npcs/<id>.png (NPCs without a file are skipped). */
  id: string;
  name: string;
  x: number;
  /** "idle" stands still, "patrol" walks back and forth inside `range`. */
  behavior: "idle" | "patrol";
  range?: [number, number];
  speed?: number; // logical px / second
  lines: string[];
  /** Only needed if this NPC's sheet has a different layout than NPC_SHEET. */
  sheet?: Partial<SheetSpec>;
}

/** How close (logical px) the player must be for an NPC to stop and talk. */
export const NPC_TALK_RANGE = 40;

/**
 * The city's NPCs. Each sprite sheet lives in src/assets/npcs/<id>.png.
 * To change what someone says, edit `lines`. To move them, change `x` (or `range` for walkers).
 * `sheet` tells the engine the frame size of that person's sheet (frames in a row:
 * idle, 4 walking frames, idle).
 */
export const NPCS: Npc[] = [
  {
    id: "nayla",
    name: "NAYLA",
    x: 235,
    behavior: "idle",
    sheet: { frameW: 31, frameH: 56, anchorX: 15 },
    lines: ["HI! I'M NAYLA. WELCOME TO THE CITY.", "EVERY DOOR ON THIS STREET LEADS SOMEWHERE."],
  },
  {
    id: "choirun",
    name: "CHOIRUN",
    x: 600,
    behavior: "patrol",
    range: [540, 780],
    speed: 28,
    sheet: { frameW: 32, frameH: 56, anchorX: 14 },
    lines: ["HEY, I'M CHOIRUN. CHECK OUT THE MISSIONS!", "THE STORE WITH THE STRIPES IS WORTH A VISIT."],
  },
  {
    id: "daper",
    name: "DAPER",
    x: 830,
    behavior: "idle",
    sheet: { frameW: 32, frameH: 58, anchorX: 14 },
    lines: ["DAPER HERE. NICE DAY FOR A WALK, RIGHT?", "TRY HOLDING SHIFT TO RUN."],
  },
  {
    id: "farel",
    name: "FAREL",
    x: 1120,
    behavior: "patrol",
    range: [1060, 1290],
    speed: 24,
    sheet: { frameW: 34, frameH: 60, anchorX: 14 },
    lines: ["I'M FAREL. LOOKING FOR THE TROPHY HALL?", "KEEP WALKING RIGHT!"],
  },
  {
    id: "pria-solo",
    name: "PRIA SOLO",
    x: 1790,
    behavior: "idle",
    sheet: { frameW: 31, frameH: 58, anchorX: 15 },
    lines: ["WELCOME! YOU MADE IT TO THE END OF THE STREET.", "THE POST OFFICE IS BEHIND YOU."],
  },
];