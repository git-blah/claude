export interface Word {
  text: string;
  /** Seconds from the start of the take. Only present for timed transcripts. */
  start?: number;
  end?: number;
}

export interface Transcript {
  source: "deepgram" | "browser";
  text: string;
  words: Word[];
  /** True when every word has start/end times (enables pause detection and click-to-seek). */
  timed: boolean;
  /** Seconds until the first word, when known without word timings. */
  firstWordAt?: number;
}

/** Shape returned by POST /api/transcribe. */
export interface TranscribeResponse {
  text: string;
  words: Required<Word>[];
}

export function wordsFromText(text: string): Word[] {
  return text
    .split(/\s+/)
    .filter(Boolean)
    .map((t) => ({ text: t }));
}
