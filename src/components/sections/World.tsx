import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import type { NavPath } from "@/hooks/useGameNavigation";
import {
  AVATAR,
  BUILDINGS,
  NPCS,
  NPC_SHEET,
  NPC_TALK_RANGE,
  WELCOME_SIGN,
  WORLD,
  type Building,
  type Npc,
  type SheetSpec,
} from "@/data/worldMap";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { PixelButton } from "@/components/ui/PixelButton";
import { MusicButton, MusicCredit } from "@/components/ui/MusicButton";
import skyUrl from "@/assets/world/sky.png";
import cloudsUrl from "@/assets/world/clouds.png";
import farUrl from "@/assets/world/far.png";
import backUrl from "@/assets/world/back.png";
import streetUrl from "@/assets/world/street.png";
import avatarUrl from "@/assets/world/avatar-walk.png";

// Every PNG dropped into src/assets/npcs/ is picked up automatically (matched to an NPC by file name).
const npcModules = import.meta.glob("../../assets/npcs/*.png", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;
const npcSheetUrl = (id: string) => Object.entries(npcModules).find(([path]) => path.endsWith(`/${id}.png`))?.[1];

interface WorldProps {
  /** Building the player just came out of; they spawn at its door. */
  spawnPath?: NavPath | null;
  onEnter: (path: NavPath) => void;
}

interface NpcState {
  cfg: Npc;
  img: HTMLImageElement;
  sheet: SheetSpec;
  x: number;
  dir: 1 | -1;
  walkT: number;
  pause: number;
  phase: number;
  moving: boolean;
}

const WALK_SPEED = 70; // logical px / second
const RUN_SPEED = 120;
const HELP_SEEN_KEY = "portopixel-help-seen";
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const im = new Image();
    im.onload = () => resolve(im);
    im.onerror = () => reject(new Error(`Failed to load ${src}`));
    im.src = src;
  });

/** Squares that pop in at random: the "door transition" when entering a building. */
function PixelCover() {
  const cells = useMemo(
    () => Array.from({ length: 14 * 8 }, (_, i) => ({ id: i, delay: Math.random() * 0.4 })),
    [],
  );
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[70] grid"
      style={{ gridTemplateColumns: "repeat(14, 1fr)", gridTemplateRows: "repeat(8, 1fr)" }}
    >
      {cells.map((c) => (
        <motion.span
          key={c.id}
          className="bg-background"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: c.delay, duration: 0.1, ease: "linear" }}
        />
      ))}
    </div>
  );
}

/** Hold-to-press on-screen button (touch D-pad). */
function HoldButton({
  label,
  onHold,
  className = "",
  children,
}: {
  label: string;
  onHold: (down: boolean) => void;
  className?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        onHold(true);
      }}
      onPointerUp={() => onHold(false)}
      onPointerCancel={() => onHold(false)}
      onContextMenu={(e) => e.preventDefault()}
      className={`select-none touch-none border-[4px] border-primary bg-surface-container-high/90 font-headline-md text-headline-md text-primary active:bg-primary active:text-on-primary ${className}`}
    >
      {children}
    </button>
  );
}

/** A keyboard key drawn as a chunky pixel keycap. */
function Key({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-flex min-w-8 items-center justify-center border-2 border-primary bg-surface px-2 py-1 font-label-sm text-label-sm text-primary shadow-[2px_2px_0_0_#020617]">
      {children}
    </kbd>
  );
}

function HelpRow({ groups, text }: { groups: string[][]; text: string }) {
  return (
    <li className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <span className="flex flex-wrap items-center gap-2">
        {groups.map((g, gi) => (
          <span key={gi} className="flex items-center gap-1">
            {gi > 0 && <span className="px-1 text-on-surface-variant">OR</span>}
            {g.map((k) => (
              <Key key={k}>{k}</Key>
            ))}
          </span>
        ))}
      </span>
      <span className="text-on-surface-variant">{text}</span>
    </li>
  );
}

export function World({ spawnPath = null, onEnter }: WorldProps) {
  const reduced = usePrefersReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);

  const input = useRef({ left: false, right: false, run: false });
  const nearRef = useRef<number | null>(null);
  const talkIdxRef = useRef<number | null>(null);
  const lockRef = useRef(false);
  const enterRef = useRef<(b: Building) => void>(() => {});

  const [near, setNear] = useState<number | null>(null);
  const [talk, setTalk] = useState<{ name: string; line: string } | null>(null);
  const [hasMoved, setHasMoved] = useState(false);
  const [entering, setEntering] = useState<Building | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [helpOpen, setHelpOpen] = useState(() => {
    try {
      return sessionStorage.getItem(HELP_SEEN_KEY) !== "1";
    } catch {
      return true;
    }
  });

  const helpOpenRef = useRef(helpOpen);
  helpOpenRef.current = helpOpen;

  const closeHelp = useCallback(() => {
    setHelpOpen(false);
    try {
      sessionStorage.setItem(HELP_SEEN_KEY, "1");
    } catch {
      /* storage can be unavailable (private mode); the guide just shows again next visit */
    }
  }, []);
  const closeHelpRef = useRef(closeHelp);
  closeHelpRef.current = closeHelp;

  const enteringRef = useRef(false);
  const enter = useCallback(
    (b: Building) => {
      if (enteringRef.current) return; // a door transition is already playing
      enteringRef.current = true;
      setMenuOpen(false);
      if (reduced) {
        onEnter(b.path);
        return;
      }
      setEntering(b);
      window.setTimeout(() => onEnter(b.path), 650);
    },
    [onEnter, reduced],
  );
  enterRef.current = enter;

  // Freeze walking while a menu / the guide is open or a door transition plays.
  useEffect(() => {
    lockRef.current = menuOpen || helpOpen || entering !== null;
    if (lockRef.current) {
      input.current.left = false;
      input.current.right = false;
    }
  }, [menuOpen, helpOpen, entering]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !container || !ctx) return;

    let raf = 0;
    let last = 0;
    let cancelled = false;
    let movedFlag = false;
    let npcs: NpcState[] = [];
    const lineCounter: Record<string, number> = {};

    const spawn = BUILDINGS.find((b) => b.path === spawnPath);
    const st = {
      x: spawn ? spawn.doorX : WORLD.spawnX,
      dir: 1 as 1 | -1,
      walkT: 0,
      time: 0,
      viewW: 384,
      scale: 1,
      offX: 0,
      offY: 0,
    };

    const resize = () => {
      const r = container.getBoundingClientRect();
      const aspect = r.width / Math.max(1, r.height);
      const vw = clamp(Math.round(WORLD.H * aspect), WORLD.minView, WORLD.maxView);
      if (canvas.width !== vw) canvas.width = vw;
      canvas.height = WORLD.H;
      st.viewW = vw;
      // where the canvas actually sits on screen (object-contain), so the DOM bubble can follow an NPC
      st.scale = Math.min(r.width / vw, r.height / WORLD.H);
      st.offX = (r.width - vw * st.scale) / 2;
      st.offY = 0; // the canvas is top-aligned (object-top)
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    /* ---------- input ---------- */
    const isButtonTarget = (e: KeyboardEvent) => (e.target as HTMLElement | null)?.closest?.("button") != null;

    const onKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (helpOpenRef.current) {
        if (k === "e" || k === "enter" || k === " " || k === "escape") {
          e.preventDefault();
          closeHelpRef.current();
        }
        return;
      }
      if (k === "escape") {
        setMenuOpen(false);
        return;
      }
      if (lockRef.current) return;
      if (k === "arrowleft" || k === "a") {
        input.current.left = true;
        e.preventDefault();
      } else if (k === "arrowright" || k === "d") {
        input.current.right = true;
        e.preventDefault();
      } else if (k === "shift") {
        input.current.run = true;
      } else if ((k === "e" || k === "enter" || k === " " || k === "arrowup" || k === "w") && !e.repeat) {
        if ((k === " " || k === "enter") && isButtonTarget(e)) return; // let focused buttons behave normally
        if (nearRef.current !== null) {
          e.preventDefault();
          enterRef.current(BUILDINGS[nearRef.current]);
        }
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "arrowleft" || k === "a") input.current.left = false;
      else if (k === "arrowright" || k === "d") input.current.right = false;
      else if (k === "shift") input.current.run = false;
    };
    const onBlur = () => {
      input.current.left = false;
      input.current.right = false;
      input.current.run = false;
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);

    /* ---------- assets ---------- */
    const urls = {
      sky: skyUrl,
      clouds: cloudsUrl,
      far: farUrl,
      back: backUrl,
      street: streetUrl,
      avatar: avatarUrl,
    };
    const keys = Object.keys(urls) as (keyof typeof urls)[];
    const imgs = {} as Record<keyof typeof urls, HTMLImageElement>;

    const cameraX = () => clamp(Math.round(st.x - st.viewW / 2), 0, WORLD.W - st.viewW);

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 0);
      last = now;
      update(dt);
      draw();
    };

    const updateNpcs = (dt: number) => {
      // nearest NPC in talking range
      let talkIdx: number | null = null;
      let best = NPC_TALK_RANGE;
      npcs.forEach((n, i) => {
        const dist = Math.abs(st.x - n.x);
        if (dist < best) {
          best = dist;
          talkIdx = i;
        }
      });

      npcs.forEach((n, i) => {
        const patrol = !reduced && n.cfg.behavior === "patrol" && n.cfg.range;
        if (talkIdx === i) {
          n.moving = false;
          n.dir = st.x < n.x ? -1 : 1; // turn to face the player
        } else if (patrol && n.cfg.range) {
          if (n.pause > 0) {
            n.pause -= dt;
            n.moving = false;
          } else {
            n.moving = true;
            const [lo, hi] = n.cfg.range;
            n.x += n.dir * (n.cfg.speed ?? 25) * dt;
            if (n.x <= lo) {
              n.x = lo;
              n.dir = 1;
              n.pause = 1 + Math.random() * 1.5;
            } else if (n.x >= hi) {
              n.x = hi;
              n.dir = -1;
              n.pause = 1 + Math.random() * 1.5;
            }
          }
        } else {
          n.moving = false;
        }
        n.walkT = n.moving ? n.walkT + dt : 0;
      });

      if (talkIdx !== talkIdxRef.current) {
        talkIdxRef.current = talkIdx;
        if (talkIdx === null) {
          setTalk(null);
        } else {
          const n = npcs[talkIdx];
          const c = ((lineCounter[n.cfg.id] ?? -1) + 1) % n.cfg.lines.length;
          lineCounter[n.cfg.id] = c;
          setTalk({ name: n.cfg.name, line: n.cfg.lines[c] });
        }
      }
    };

    const update = (dt: number) => {
      const dirIn = (input.current.right ? 1 : 0) - (input.current.left ? 1 : 0);
      const moving = !lockRef.current && dirIn !== 0;
      if (moving) {
        st.dir = dirIn > 0 ? 1 : -1;
        const speed = input.current.run ? RUN_SPEED : WALK_SPEED;
        st.x = clamp(st.x + dirIn * speed * dt, 24, WORLD.W - 24);
        st.walkT += dt * (input.current.run ? 1.6 : 1);
        if (!movedFlag) {
          movedFlag = true;
          setHasMoved(true);
        }
      } else {
        st.walkT = 0;
      }
      st.time += dt;

      let n: number | null = null;
      BUILDINGS.forEach((b, i) => {
        if (Math.abs(st.x - b.doorX) < WORLD.doorReach) n = i;
      });
      if (n !== nearRef.current) {
        nearRef.current = n;
        setNear(n);
      }

      updateNpcs(dt);
    };

    const drawSprite = (
      img: HTMLImageElement,
      sheet: SheetSpec,
      frame: number,
      screenX: number,
      flip: boolean,
      yOffset = 0,
    ) => {
      ctx.fillStyle = "rgba(0,0,0,0.25)";
      ctx.fillRect(screenX - 11, WORLD.feetY - 1, 22, 3);
      ctx.save();
      ctx.translate(screenX, 0);
      if (flip) ctx.scale(-1, 1);
      ctx.drawImage(
        img,
        frame * sheet.frameW,
        0,
        sheet.frameW,
        sheet.frameH,
        -sheet.anchorX,
        WORLD.feetY - sheet.frameH + yOffset,
        sheet.frameW,
        sheet.frameH,
      );
      ctx.restore();
    };

    const draw = () => {
      const vw = st.viewW;
      const H = WORLD.H;
      const camX = cameraX();
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, vw, H);

      ctx.drawImage(imgs.sky, 0, 0);

      const cw = imgs.clouds.width;
      const drift = reduced ? 0 : st.time * 3;
      const cOff = Math.round(-((camX * 0.1 + drift) % cw));
      ctx.drawImage(imgs.clouds, cOff, 0);
      ctx.drawImage(imgs.clouds, cOff + cw, 0);

      ctx.drawImage(imgs.far, -Math.round(camX * 0.3), 0);
      ctx.drawImage(imgs.back, -Math.round(camX * 0.6), 0);
      ctx.drawImage(imgs.street, -camX, 0);

      // Text on the signs (drawn live so it uses the site's pixel font).
      ctx.font = '8px "Press Start 2P", monospace';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      BUILDINGS.forEach((b) => {
        ctx.fillStyle = b.plateText;
        ctx.fillText(b.label, b.doorX - camX, WORLD.plateY);
      });
      ctx.fillStyle = "#3a2a1a";
      WELCOME_SIGN.lines.forEach((l) => ctx.fillText(l.text, WELCOME_SIGN.x - camX, l.y));

      // Blinking outline around the door you can enter.
      const nearIdx = nearRef.current;
      if (nearIdx !== null && (reduced || Math.floor(st.time * 3) % 2 === 0)) {
        const b = BUILDINGS[nearIdx];
        ctx.strokeStyle = "#f2c94c";
        ctx.lineWidth = 1;
        ctx.strokeRect(b.doorX - camX - 22 + 0.5, WORLD.doorTop - 3 + 0.5, 44, WORLD.doorHeight + 4);
      }

      // NPCs (only the ones on screen).
      npcs.forEach((n) => {
        const sx = Math.round(n.x - camX);
        if (sx < -40 || sx > vw + 40) return;
        const frame = n.moving
          ? n.sheet.walk[Math.floor(n.walkT * n.sheet.fps) % n.sheet.walk.length]
          : n.sheet.idle;
        // standing NPCs "breathe" (1px up/down) so they don't look frozen
        const breathe = !n.moving && !reduced && Math.floor(st.time * 1.5 + n.phase) % 2 === 1 ? -1 : 0;
        drawSprite(n.img, n.sheet, frame, sx, n.dir > 0, breathe);
      });

      // Player.
      const moving = st.walkT > 0;
      const frame = moving
        ? AVATAR.walk[Math.floor(st.walkT * AVATAR.fps) % AVATAR.walk.length]
        : AVATAR.idle;
      drawSprite(imgs.avatar, AVATAR, frame, Math.round(st.x - camX), st.dir > 0);

      // Keep the DOM speech bubble glued above the NPC being talked to.
      const bubble = bubbleRef.current;
      const ti = talkIdxRef.current;
      if (bubble && ti !== null) {
        const n = npcs[ti];
        const sx = st.offX + (n.x - camX) * st.scale;
        const sy = st.offY + (WORLD.feetY - n.sheet.frameH - 4) * st.scale;
        bubble.style.transform = `translate(${sx}px, ${sy}px) translate(-50%, -100%)`;
        bubble.style.visibility = "visible";
      }
    };

    Promise.all([
      Promise.all(keys.map((k) => loadImage(urls[k]))),
      Promise.all(
        NPCS.flatMap((cfg) => {
          const url = npcSheetUrl(cfg.id);
          return url ? [loadImage(url).then((img) => ({ cfg, img }))] : [];
        }),
      ),
    ])
      .then(([loaded, npcLoaded]) => {
        if (cancelled) return;
        keys.forEach((k, i) => {
          imgs[k] = loaded[i];
        });
        npcs = npcLoaded.map(({ cfg, img }) => ({
          cfg,
          img,
          sheet: { ...NPC_SHEET, ...cfg.sheet },
          x: cfg.x,
          dir: (cfg.behavior === "patrol" ? 1 : -1) as 1 | -1,
          walkT: 0,
          pause: Math.random() * 1.5,
          phase: Math.random() * 2,
          moving: false,
        }));
        setReady(true);
        raf = requestAnimationFrame(loop);
      })
      .catch((err) => console.error(err));

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const nearBuilding = near !== null ? BUILDINGS[near] : null;

  return (
    <div ref={containerRef} className="fixed inset-0 z-40 select-none overflow-hidden bg-black [-webkit-tap-highlight-color:transparent]">
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Interactive city map. Walk with the arrow keys or A and D, run with Shift, and press E at a door to enter a building."
        className="block h-full w-full object-contain object-top [image-rendering:pixelated]"
      />

      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center bg-background">
          <p className="font-headline-md text-headline-md text-primary cursor-blink">LOADING MAP...</p>
        </div>
      )}

      {/* NPC speech bubble (thought-bubble style, follows the NPC) */}
      {talk && (
        <div
          ref={bubbleRef}
          style={{ visibility: "hidden" }}
          className="pointer-events-none absolute left-0 top-0 z-[55] flex flex-col items-center"
        >
          <div className="max-w-[220px] border-[4px] border-[#082f49] bg-[#fdfdf5] px-3 py-2 shadow-[4px_4px_0_0_#020617]">
            <p className="mb-1 font-label-sm text-label-sm text-[#b3262e]">{talk.name}</p>
            <p className="font-label-sm text-label-sm leading-relaxed text-[#082f49]">{talk.line}</p>
          </div>
          <span className="-translate-x-3 mt-1 block h-3 w-3 border-[3px] border-[#082f49] bg-[#fdfdf5]" />
          <span className="-translate-x-6 mt-1 block h-2 w-2 border-2 border-[#082f49] bg-[#fdfdf5]" />
          <span className="-translate-x-9 mt-1 block h-1 w-1 bg-[#082f49]" />
        </div>
      )}

      {/* HUD: where am I */}
      <div className="pointer-events-none absolute left-3 top-3 hidden border-[4px] border-primary bg-surface-container-high/90 px-3 py-2 shadow-[4px_4px_0_0_#020617] sm:block">
        <p className="font-label-sm text-label-sm text-primary">▶ PORTOPIXEL CITY</p>
        <p className="mt-1 font-label-sm text-label-sm text-on-surface-variant">
          {nearBuilding ? nearBuilding.hint : "MAIN STREET"}
        </p>
      </div>

      {/* HUD: help + fast travel (for people in a hurry, and keyboard-only users) */}
      <div className="absolute right-3 top-3 z-[60] flex flex-col items-end gap-2">
        <div className="flex gap-2">
          <PixelButton
            variant="ghost"
            onClick={() => setHelpOpen(true)}
            aria-label="How to play"
            className="px-3 py-2 text-label-sm font-label-sm"
          >
            ?<span className="hidden sm:inline"> HELP</span>
          </PixelButton>
          <PixelButton
            variant="secondary"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            className="px-3 py-2 text-label-sm font-label-sm"
          >
            {menuOpen ? (
              "[ X ] CLOSE"
            ) : (
              <>
                <span className="sm:hidden">MENU ▶</span>
                <span className="hidden sm:inline">FAST TRAVEL ▶</span>
              </>
            )}
          </PixelButton>
        </div>
        <MusicButton />
        {menuOpen && (
          <ul className="flex flex-col gap-2 border-[4px] border-primary bg-surface-container-high p-2 shadow-[6px_6px_0_0_#020617]">
            {BUILDINGS.map((b, i) => (
              <li key={b.path}>
                <button
                  type="button"
                  autoFocus={i === 0}
                  onClick={() => enter(b)}
                  className="w-full px-3 py-2 text-left font-label-sm text-label-sm text-on-surface hover:bg-primary hover:text-on-primary focus-visible:bg-primary focus-visible:text-on-primary focus-visible:outline-none"
                >
                  ▶ {b.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* HUD: prompt */}
      <div className="absolute inset-x-0 bottom-24 flex justify-center px-4 md:bottom-8">
        {nearBuilding ? (
          <button
            type="button"
            onClick={() => enter(nearBuilding)}
            className="border-[4px] border-secondary bg-surface-container-high px-4 py-3 font-label-sm text-label-sm text-secondary shadow-[4px_4px_0_0_#020617] cursor-blink"
          >
            ▶ <span className="max-md:hidden">PRESS E TO ENTER</span>
            <span className="md:hidden">TAP TO ENTER</span>: {nearBuilding.label}
          </button>
        ) : (
          !hasMoved &&
          !helpOpen && (
            <p className="max-w-sm bg-background/80 px-3 py-2 text-center font-label-sm text-label-sm leading-relaxed text-on-surface">
              A / D OR ◀ ▶ TO WALK · SHIFT = RUN
            </p>
          )
        )}
      </div>

      {/* Touch controls */}
      <div className="absolute inset-x-0 bottom-0 hidden items-end justify-between px-4 pb-[max(1rem,env(safe-area-inset-bottom))] max-md:flex [@media(pointer:coarse)]:flex">
        <div className="flex gap-3">
          <HoldButton label="Walk left" onHold={(d) => (input.current.left = d)} className="h-16 w-16">
            ◀
          </HoldButton>
          <HoldButton label="Walk right" onHold={(d) => (input.current.right = d)} className="h-16 w-16">
            ▶
          </HoldButton>
        </div>
        <div className="flex gap-3">
          <HoldButton label="Run" onHold={(d) => (input.current.run = d)} className="h-16 w-16 text-label-sm font-label-sm">
            RUN
          </HoldButton>
          <button
            type="button"
            aria-label="Enter building"
            onClick={() => nearBuilding && enter(nearBuilding)}
            disabled={!nearBuilding}
            className="h-16 w-16 select-none border-[4px] border-secondary bg-surface-container-high/90 font-headline-md text-headline-md text-secondary disabled:opacity-40"
          >
            A
          </button>
        </div>
      </div>

      {/* How to play */}
      {helpOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="help-title"
          className="absolute inset-0 z-[65] flex items-center justify-center overflow-y-auto bg-background/80 p-4"
        >
          <div className="w-full max-w-lg border-[6px] border-primary bg-surface-container p-5 shadow-[10px_10px_0_0_#020617]">
            <h2 id="help-title" className="mb-5 font-headline-md text-headline-md text-primary">
              ▶ HOW TO PLAY
            </h2>
            <ul className="mb-6 flex flex-col gap-4 font-label-sm text-label-sm leading-relaxed text-on-surface">
              <HelpRow groups={[["A", "D"], ["◀", "▶"]]} text="WALK LEFT / RIGHT" />
              <HelpRow groups={[["SHIFT"]]} text="HOLD TO RUN" />
              <HelpRow groups={[["E"], ["ENTER"], ["↑"]]} text="ENTER A BUILDING (WHEN ITS DOOR BLINKS)" />
              <li className="text-on-surface-variant">▶ WALK UP TO PEOPLE TO TALK TO THEM</li>
              <li className="text-on-surface-variant">▶ ON A PHONE USE THE ◀ ▶ RUN AND A BUTTONS</li>
              <li className="text-on-surface-variant">▶ IN A HURRY? USE FAST TRAVEL (TOP RIGHT)</li>
            </ul>
            <MusicCredit className="mb-4 font-label-sm text-label-sm text-on-surface-variant" />
            <PixelButton
              variant="primary"
              autoFocus
              onClick={closeHelp}
              className="px-4 py-3 text-label-sm font-label-sm"
            >
              [ START EXPLORING ]
            </PixelButton>
          </div>
        </div>
      )}

      {entering && <PixelCover />}
    </div>
  );
}