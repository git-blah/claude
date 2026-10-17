import type { Prompt } from "./prompts";

export interface Session {
  promptId: string;
  promptText: string;
  mode: Prompt["mode"];
  seconds: number;
  at: string; // ISO timestamp
}

const KEY = "speak-up:history";
const MAX = 200;

export function loadHistory(): Session[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Session[]) : [];
  } catch {
    return [];
  }
}

export function saveSession(session: Session): Session[] {
  const next = [session, ...loadHistory()].slice(0, MAX);
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Storage full or unavailable; history is a convenience only.
  }
  return next;
}

function dayKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

/** Consecutive days (ending today or yesterday) with at least one session. */
export function currentStreak(history: Session[]): number {
  const days = new Set(history.map((s) => dayKey(new Date(s.at))));
  const cursor = new Date();
  if (!days.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (days.has(dayKey(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
