# Speak Up

Practise speaking on the spot. You get a random prompt (a word, topic, real-life situation, something to explain, or an impromptu speech), a short time to think, and then you speak to your camera until the timer runs out. Watch the take back, check yourself and go again.

The goal is to improve spoken English, clarity, quick thinking and confidence on camera and in front of an audience.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000 and allow camera and microphone access. Browsers only allow camera access on `localhost` or over HTTPS. To use it on your phone, deploy it (for example on Vercel) rather than opening your laptop's IP address.

## How a session works

1. **Setup:** pick prompt types, difficulty, thinking time (0–60s) and speaking time (30s–3min).
2. **Ready:** the camera preview is on. The prompt stays hidden until you press *Reveal prompt*, and that's when the thinking clock starts.
3. **Think:** a countdown runs over the preview. You can start early or skip to a different prompt.
4. **Speak:** recording starts automatically and stops when time runs out. You can also press *Stop*.
5. **Review:** play the take back, tick the self-check list, download the video, then try the same prompt again or move to the next one.

Settings and a history of your takes (prompt, length, date, used for the daily streak) are saved in your browser. Recordings are never uploaded. They exist only until you leave the page, unless you download them.

## Project layout

```
app/                 Next.js App Router entry (layout, page, global styles)
components/Practice.tsx  The whole practice flow (setup → ready → prep → speaking → review)
lib/prompts.ts       Prompt library (~100 prompts across 5 modes × 3 difficulties) + picker
lib/useRecorder.ts   Camera/mic stream + MediaRecorder hook (video or audio-only)
lib/history.ts       Local take history and streak calculation
lib/settings.ts      Settings defaults and persistence
```

To add prompts, add a `[difficulty, "text"]` entry under the right mode in `lib/prompts.ts`.

## Roadmap

- **Phase 2: transcription and stats.** Send each take to a speech-to-text API (Whisper or Deepgram) and show words per minute, filler-word count and long pauses.
- **Phase 3: AI coach and one-pager.** Send the prompt and transcript to Claude and get back structured feedback (scores, strengths, fixes, a stronger version of your answer) plus a one-page summary of the topic to learn from.
- **Phase 4: progress.** Score trends over time, saved recordings and a weekly review.
- **Later:** an audience mode (live follow-up questions), a comprehension mode (listen, then summarise), a debate mode (argue the other side) and an eye-contact check.
