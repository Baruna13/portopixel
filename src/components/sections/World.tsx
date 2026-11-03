import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import type { NavPath } from "@/hooks/useGameNavigation";
import { AVATAR, BUILDINGS, WELCOME_SIGN, WORLD, type Building } from "@/data/worldMap";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { PixelButton } from "@/components/ui/PixelButton";
import skyUrl from "@/assets/world/sky.png";
import cloudsUrl from "@/assets/world/clouds.png";
import farUrl from "@/assets/world/far.png";
import backUrl from "@/assets/world/back.png";
import streetUrl from "@/assets/world/street.png";
import avatarUrl from "@/assets/world/avatar-walk.png";

interface WorldProps {
  /** Building the player just came out of; they spawn at its door. */
  spawnPath?: NavPath | null;
  onEnter: (path: NavPath) => void;
}

const WALK_SPEED = 70; // logical px / second
const RUN_SPEED = 120;
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

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

export function World({ spawnPath = null, onEnter }: WorldProps) {
  const reduced = usePrefersReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const input = useRef({ left: false, right: false, run: false });
  const nearRef = useRef<number | null>(null);
  const lockRef = useRef(false);
  const enterRef = useRef<(b: Building) => void>(() => {});

  const [near, setNear] = useState<number | null>(null);
  const [hasMoved, setHasMoved] = useState(false);
  const [entering, setEntering] = useState<Building | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [ready, setReady] = useState(false);

  const enter = useCallback(
    (b: Building) => {
      if (lockRef.current) return;
      lockRef.current = true;
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

  // Freeze walking while the fast-travel menu is open or a door transition plays.
  useEffect(() => {
    lockRef.current = menuOpen || entering !== null;
    if (lockRef.current) {
      input.current.left = false;
      input.current.right = false;
    }
  }, [menuOpen, entering]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !container || !ctx) return;

    let raf = 0;
    let last = 0;
    let cancelled = false;
    let movedFlag = false;

    const spawn = BUILDINGS.find((b) => b.path === spawnPath);
    const st = {
      x: spawn ? spawn.doorX : WORLD.spawnX,
      dir: 1 as 1 | -1,
      walkT: 0,
      time: 0,
      viewW: 384,
    };

    const resize = () => {
      const r = container.getBoundingClientRect();
      const aspect = r.width / Math.max(1, r.height);
      const vw = clamp(Math.round(WORLD.H * aspect), WORLD.minView, WORLD.maxView);
      if (canvas.width !== vw) canvas.width = vw;
      canvas.height = WORLD.H;
      st.viewW = vw;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    /* ---------- input ---------- */
    const isButtonTarget = (e: KeyboardEvent) => (e.target as HTMLElement | null)?.closest?.("button") != null;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        return;
      }
      if (lockRef.current) return;
      const k = e.key.toLowerCase();
      if (k === "arrowleft" || k === "a") {
        input.current.left = true;
        e.preventDefault();
      } else if (k === "arrowright" || k === "d") {
        input.current.right = true;
        e.preventDefault();
      } else if (k === "shift") {
        input.current.run = true;
      } else if ((k === "e" || k === "enter" || k === " " || k === "arrowup" || k === "w") && !e.repeat) {
        if (k === " " || k === "enter") {
          if (isButtonTarget(e)) return; // let focused buttons behave normally
        }
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
    const imgs = {} as Record<keyof typeof urls, HTMLImageElement>;

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 0);
      last = now;
      update(dt);
      draw();
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
    };

    const draw = () => {
      const vw = st.viewW;
      const H = WORLD.H;
      const camX = clamp(Math.round(st.x - vw / 2), 0, WORLD.W - vw);
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

      // Player: shadow + the current frame of the walking sprite sheet.
      const px = Math.round(st.x - camX);
      const moving = st.walkT > 0;
      const frame = moving
        ? AVATAR.walk[Math.floor(st.walkT * AVATAR.fps) % AVATAR.walk.length]
        : AVATAR.idle;
      const top = WORLD.feetY - AVATAR.frameH;

      ctx.fillStyle = "rgba(0,0,0,0.25)";
      ctx.fillRect(px - 11, WORLD.feetY - 1, 22, 3);

      ctx.save();
      ctx.translate(px, 0);
      // the artwork faces left, so mirror it when heading right
      if (st.dir > 0) ctx.scale(-1, 1);
      ctx.drawImage(
        imgs.avatar,
        frame * AVATAR.frameW,
        0,
        AVATAR.frameW,
        AVATAR.frameH,
        -AVATAR.anchorX,
        top,
        AVATAR.frameW,
        AVATAR.frameH,
      );
      ctx.restore();
    };

    Promise.all(
      (Object.keys(urls) as (keyof typeof urls)[]).map(
        (key) =>
          new Promise<void>((resolve, reject) => {
            const im = new Image();
            im.onload = () => {
              imgs[key] = im;
              resolve();
            };
            im.onerror = () => reject(new Error(`Failed to load ${key}`));
            im.src = urls[key];
          }),
      ),
    )
      .then(() => {
        if (cancelled) return;
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
    <div ref={containerRef} className="fixed inset-0 z-40 overflow-hidden bg-black">
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Interactive city map. Walk with the arrow keys or A and D, run with Shift, and press E at a door to enter a building."
        className="block h-full w-full object-contain [image-rendering:pixelated]"
      />

      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center bg-background">
          <p className="font-headline-md text-headline-md text-primary cursor-blink">LOADING MAP...</p>
        </div>
      )}

      {/* HUD: where am I */}
      <div className="pointer-events-none absolute left-3 top-3 border-[4px] border-primary bg-surface-container-high/90 px-3 py-2 shadow-[4px_4px_0_0_#020617]">
        <p className="font-label-sm text-label-sm text-primary">▶ PORTOPIXEL CITY</p>
        <p className="mt-1 font-label-sm text-label-sm text-on-surface-variant">
          {nearBuilding ? nearBuilding.hint : "MAIN STREET"}
        </p>
      </div>

      {/* HUD: fast travel (for people in a hurry, and keyboard-only users) */}
      <div className="absolute right-3 top-3 z-[60] flex flex-col items-end gap-2">
        <PixelButton
          variant="secondary"
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          className="px-3 py-2 text-label-sm font-label-sm"
        >
          {menuOpen ? "[ X ] CLOSE" : "FAST TRAVEL ▶"}
        </PixelButton>
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
            ▶ PRESS E TO ENTER: {nearBuilding.label}
          </button>
        ) : (
          !hasMoved && (
            <p className="max-w-sm bg-background/80 px-3 py-2 text-center font-label-sm text-label-sm leading-relaxed text-on-surface">
              A / D OR ◀ ▶ TO WALK · SHIFT = RUN
            </p>
          )
        )}
      </div>

      {/* Touch controls */}
      <div className="absolute inset-x-0 bottom-4 hidden items-end justify-between px-4 max-md:flex [@media(pointer:coarse)]:flex">
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

      {entering && <PixelCover />}
    </div>
  );
}