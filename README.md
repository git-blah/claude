# Speak Up

Practise speaking on the spot. You get a random prompt (a word, topic, real-life situation, something to explain, or an impromptu speech), a short time to think, and then you speak to your camera until the timer runs out. Watch the take back, check yourself and go again.

The goal is to improve spoken English, clarity, quick thinking and confidence on camera and in front of an audience.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000 and allow camera and microphone access. Optional features are switched on with keys in `.env.local`. Copy `.env.example` to get started. Browsers only allow camera access on `localhost` or over HTTPS. To use it on your phone, deploy it (for example on Vercel) rather than opening your laptop's IP address.

## How a session works

1. **Setup:** pick prompt types, difficulty, thinking time (0–60s) and speaking time (30s–3min).
2. **Ready:** the camera preview is on. The prompt stays hidden until you press *Reveal prompt*, and that's when the thinking clock starts.
3. **Think:** a countdown runs over the preview. You can start early or skip to a different prompt.
4. **Speak:** recording starts automatically and stops when time runs out. You can also press *Stop*.
5. **Review:** play the take back, tick the self-check list, download the video, then try the same prompt again or move to the next one.

After each take you get:

- **Stats:** pace (words per minute, with 130–160 as the target), fillers (um/uh plus possible fillers like "like", "you know", "basically"), long pauses (2 seconds or more), time to your first word, and word count with vocabulary variety.
- **Tips:** up to three concrete suggestions for your next take, based on those stats.
- **Transcript:** what you said, with fillers highlighted and long pauses marked. With Deepgram, clicking a word jumps the video to that moment.

With an AI coach turned on (Claude or a local Ollama model), you also get:

- **Coaching:** a short verdict, four scores out of 10 (clarity, structure, on topic, language), what worked, what to improve, grammar and word-choice fixes quoted from your transcript, and a stronger version of your answer.
- **A follow-up question** from an imaginary audience member. Press *Answer it now* to make it your next prompt, for quick-thinking practice.
- **A one-pager** on the topic (key points, perspectives, vocabulary with examples, an answer outline and strong openers) that you can print or save as a PDF.

Settings and a history of your takes (prompt, length, date, used for the daily streak) are saved in your browser. Video is never uploaded. It exists only until you leave the page, unless you download it. Speech is transcribed by your browser or, if you set it up, by Deepgram (see below).

## Transcription

There are two options. The app picks automatically.

| | Browser (default) | Deepgram (recommended) |
|---|---|---|
| Setup | None | Add an API key |
| Works in | Chrome, Edge, Safari | Any browser |
| Filler words | Often drops "um"/"uh" | Keeps them (`filler_words=true`) |
| Pauses and click-to-seek | No (no word timings) | Yes |
| Privacy | Chrome sends audio to Google | Audio sent to Deepgram from your server |
| Cost | Free | About $0.004/min ($200 free credit on sign-up) |

To use Deepgram, create a key at https://console.deepgram.com and add it to `.env.local` (and to your host's environment variables when you deploy):

```bash
DEEPGRAM_API_KEY=your_key_here
```

Restart `npm run dev`. The setup screen will say "Transcripts come from Deepgram". Only a small audio-only copy of each take (about 0.4 MB/min) is uploaded, never the video. That also keeps uploads under the 4.5 MB request limit on Vercel.

Known limitation: on Android Chrome, browser speech recognition can conflict with the camera's microphone. Use Deepgram there.

## AI coach: Claude or a local model

Pick the coach on the setup screen: **Claude**, **Ollama** or **Off**. Providers that aren't configured are greyed out.

### Claude

Add your key to `.env.local` (create one at https://console.anthropic.com):

```bash
ANTHROPIC_API_KEY=sk-ant-...
# optional, default claude-sonnet-5-5
ANTHROPIC_MODEL=claude-sonnet-5-5
```

Each take costs roughly 1–2 cents for coaching, plus about the same for a one-pager. One-pagers are cached in your browser, so asking again for the same prompt is free.

### Ollama (free, runs on your computer, nothing leaves your machine)

1. Install Ollama from https://ollama.com and start it.
2. Pull a model:
   ```bash
   ollama pull llama3.1:8b      # good default, about 5 GB, runs on most laptops with 8 GB+ RAM
   # or: ollama pull qwen3:8b   # often better at structured feedback
   # or: ollama pull gemma3:12b # stronger if you have 16 GB+ RAM
   ```
3. Restart `npm run dev`. **Ollama** becomes selectable, with a dropdown of your installed models.

Optional settings: `OLLAMA_BASE_URL` (default `http://127.0.0.1:11434`) and `OLLAMA_MODEL` (the default model to select).

Notes:
- Ollama is called from the app's server, so it works when you run the app on your own computer (`npm run dev` or `npm start`). A deployed copy (for example on Vercel) can't reach the Ollama on your laptop. Use Claude there, or point `OLLAMA_BASE_URL` at an Ollama server it can reach.
- The app uses Ollama's structured outputs (`format` set to a JSON Schema), which needs Ollama 0.5 or newer. Small models can still give weaker feedback than Claude. If replies look thin, try a bigger model.
- A first request can take 10–60 seconds while the model loads into memory. Later requests are faster.

## Project layout

```
app/                 Next.js App Router entry (layout, page, global styles)
components/Practice.tsx  The whole practice flow (setup → ready → prep → speaking → review)
components/Feedback.tsx  Stats tiles, tips and highlighted transcript
app/api/transcribe/  Server route that forwards audio to Deepgram (needs DEEPGRAM_API_KEY)
lib/prompts.ts       Prompt library (~100 prompts across 5 modes × 3 difficulties) + picker
lib/analysis.ts      Pace, fillers, pauses, vocabulary and tips (unit tested: npm test)
components/Coach.tsx     AI coach feedback and one-pager panels
app/api/coach/       GET: available AI providers; POST: coaching feedback on a take
app/api/learn/       POST: one-pager for a prompt
lib/coach/           Prompts, JSON Schemas + normalizers, Claude/Ollama provider layer
lib/useRecorder.ts   Camera/mic stream + MediaRecorder (video plus a small audio-only copy)
lib/useSpeechRecognition.ts  Live browser transcription fallback
lib/history.ts       Local take history and streak calculation
lib/settings.ts      Settings defaults and persistence
```

To add prompts, add a `[difficulty, "text"]` entry under the right mode in `lib/prompts.ts`.

## Roadmap

- ~~Phase 2: transcription and stats~~ ✅
- ~~Phase 3: AI coach and one-pager (Claude or local Ollama)~~ ✅
- **Phase 4: progress.** Score trends over time, saved recordings and a weekly review.
- **Later:** an audience mode (live follow-up questions), a comprehension mode (listen, then summarise), a debate mode (argue the other side) and an eye-contact check.
