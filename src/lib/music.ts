import { useSyncExternalStore } from "react";

/**
 * Background music. Drop an .mp3 into src/assets/audio/ (any file name; the first
 * .mp3 found is used). If the folder has no mp3, the music button simply hides.
 *
 * Browsers only allow audio after a click / key press, so playback starts on the
 * first interaction (see App.tsx). The player's choice (on/off) is remembered.
 */
const tracks = import.meta.glob("../assets/audio/*.mp3", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;
const url: string | undefined = Object.values(tracks)[0];

export const MUSIC_CREDIT = "NIGHT SHADE — ADHESIVEWOMBAT";
const STORAGE_KEY = "portopixel-music";
const VOLUME_KEY = "portopixel-volume";
const DEFAULT_VOLUME = 0.12; // quiet by default; players can raise it with the slider

interface MusicState {
  available: boolean;
  muted: boolean;
  playing: boolean;
  volume: number; // 0..1
}

let audio: HTMLAudioElement | null = null;
let started = false;
let suspended = false; // true while the formal portfolio is shown: no music there
let muted = (() => {
  try {
    return localStorage.getItem(STORAGE_KEY) === "off";
  } catch {
    return false;
  }
})();

let volume = (() => {
  try {
    const saved = Number(localStorage.getItem(VOLUME_KEY));
    return localStorage.getItem(VOLUME_KEY) !== null && Number.isFinite(saved) ? Math.min(1, Math.max(0, saved)) : DEFAULT_VOLUME;
  } catch {
    return DEFAULT_VOLUME;
  }
})();

const listeners = new Set<() => void>();
let snapshot: MusicState = { available: Boolean(url), muted, playing: false, volume };

function emit() {
  snapshot = { available: Boolean(url), muted, playing: audio !== null && !audio.paused, volume };
  listeners.forEach((l) => l());
}

function ensureAudio(): HTMLAudioElement | null {
  if (!url) return null;
  if (!audio) {
    audio = new Audio(url);
    audio.loop = true;
    audio.volume = volume;
    audio.preload = "auto";
    audio.addEventListener("play", emit);
    audio.addEventListener("pause", emit);
  }
  return audio;
}

if (typeof document !== "undefined") {
  // Be polite: pause when the tab is hidden, resume when it comes back.
  document.addEventListener("visibilitychange", () => {
    if (!audio || muted || !started || suspended) return;
    if (document.hidden) audio.pause();
    else void audio.play().catch(() => undefined);
  });
}

export const music = {
  setVolume(v: number) {
    volume = Math.min(1, Math.max(0, v));
    if (audio) audio.volume = volume;
    try {
      localStorage.setItem(VOLUME_KEY, String(volume));
    } catch {
      /* ignore */
    }
    emit();
  },
  /** Call from a user gesture. Safe to call many times. */
  /** The formal portfolio is silent; the game version plays music. */
  setSuspended(value: boolean) {
    suspended = value;
    if (!audio) return;
    if (suspended) audio.pause();
    else if (started && !muted) void audio.play().catch(() => undefined);
  },
  start() {
    const a = ensureAudio();
    if (!a || started || suspended) return;
    started = true;
    if (!muted) {
      a.play().catch(() => {
        started = false; // autoplay was blocked; the next gesture will retry
      });
    }
  },
  toggle() {
    const a = ensureAudio();
    if (!a) return;
    muted = !muted;
    try {
      localStorage.setItem(STORAGE_KEY, muted ? "off" : "on");
    } catch {
      /* ignore: storage can be unavailable */
    }
    if (muted) {
      a.pause();
    } else {
      started = true;
      if (!suspended) void a.play().catch(() => undefined);
    }
    emit();
  },
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
const getSnapshot = () => snapshot;

export function useMusic(): MusicState {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
