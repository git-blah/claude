import type { Difficulty, Mode } from "./prompts";

export interface Settings {
  modes: Mode[];
  difficulty: Difficulty | "any";
  prepSeconds: number;
  speakSeconds: number;
  camera: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  modes: ["word", "topic", "situation", "explain", "speech"],
  difficulty: "any",
  prepSeconds: 15,
  speakSeconds: 60,
  camera: true,
};

export const PREP_OPTIONS = [0, 15, 30, 60];
export const SPEAK_OPTIONS = [30, 60, 120, 180];

const KEY = "speak-up:settings";

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } as Settings;
    return parsed.modes.length > 0 ? parsed : { ...parsed, modes: DEFAULT_SETTINGS.modes };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function storeSettings(settings: Settings): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(settings));
  } catch {
    // Non-essential.
  }
}

export function formatSeconds(total: number): string {
  const s = Math.max(0, Math.round(total));
  return s < 60 ? `${s}s` : `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
