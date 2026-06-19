# EduLens AI

Structured AI teaching and learning assistant for students and teachers — built on Next.js.

## Features

- **Homework Analyzer** — marking-style feedback, mistake types, knowledge points, similar/remedial/extension questions, learning plan
- **Lesson Generator** — lesson plans, worksheets, answer keys, misconceptions, revision notes
- **Mistake Book** — save analyses for targeted revision
- **Dashboard** — stats, topic weakness chart, saved history
- **Reports** — printable PDF export via browser print

## Routes

| Path | Description |
|------|-------------|
| `/edulens` | Product overview |
| `/edulens/homework-analyzer` | Analyze homework |
| `/edulens/lesson-generator` | Generate lesson packs |
| `/edulens/mistake-book` | Saved mistakes |
| `/edulens/dashboard` | Learning dashboard |
| `/edulens/reports/[id]` | Full report view |

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3006/edulens](http://localhost:3006/edulens).

Demo data works out of the box with `EDULENS_AI_MODE=mock` (default).

## AI configuration (free dev + GPT/Gemini switch)

Copy `.env.local.example` to `.env.local`:

```bash
EDULENS_DEV_PROFILE=agnes-free
AGNES_API_KEY=your_key_from_https://platform.agnes-ai.com
```

Or use Gemini:

```bash
EDULENS_DEV_PROFILE=gemini-free
GEMINI_API_KEY=your_key_from_https://aistudio.google.com/apikey
```

### Recommended free options (2026)

| Profile | Provider | Text | Vision OCR | Notes |
|---------|----------|------|------------|-------|
| `agnes-free` | Agnes AI | Yes | Yes | Free `agnes-2.0-flash`; OpenAI-compatible API |
| `gemini-free` | Google Gemini | Yes | Yes | Good fallback; free quota may 429 |
| `groq-free` | Groq | Yes | Optional | Very fast; set `GROQ_VISION_MODEL` |
| `ollama-local` | Ollama | Yes | Yes | `ollama pull llama3.2-vision` |
| `openrouter-free` | OpenRouter | Yes | Yes | Free model ids; OpenAI-compatible |
| `mock` | None | Demo only | Demo only | No API key |

### Switch to GPT (production)

```bash
EDULENS_DEV_PROFILE=openai
EDULENS_AI_MODE=openai
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
OPENAI_VISION_MODEL=gpt-4o
```

Groq and Ollama use the **same OpenAI-compatible code path** as GPT — only URL/model env vars change.

Set `EDULENS_AI_MODE=auto` to pick the first provider with a key (Agnes → Gemini → Groq → OpenRouter → OpenAI).

Provider chain (recommended): `EDULENS_PROVIDER_CHAIN=AGNES,GROQ,GEMINI,OPENROUTER,OPENAI,OLLAMA`

Architecture: **UI → API route → EduLens service → prompt builder → AI provider → JSON parser → validator → store**

## Demo examples (seeded)

- Sec 4 Math quadratic homework — `/edulens/reports/demo-analysis-math-quadratic`
- Sec 3 Physics electricity — `/edulens/reports/demo-analysis-physics-electricity`
- Sec 4 Math quadratic functions lesson — `/edulens/reports/demo-lesson-out-quadratic`
- Mistake book: 5 entries
- Dashboard topic weakness chart

## Safety

EduLens surfaces disclaimers that AI marking may need teacher review, open-ended scores are estimated, and generated classroom materials should be verified before use.
