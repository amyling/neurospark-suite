# YouthMentor AI (Project 3 — Growth)

A safe digital mentor prototype for student wellbeing, structured reflection, and crisis guardrails. Built with Next.js 16, React 19, and Tailwind CSS 4.

## What it is

- A reflective wellbeing support assistant (not therapy or emergency care)
- Mood check-in, original mentor personas, guided reflection, action plans
- **Growth character chat** — scenario-based celebrity / religious-leader-style AI simulations + custom virtual characters
- Retention layer: memory, intimacy, daily quotes, coaching packs, reflection debrief bridge
- Layered safety: keyword scan → risk classifier → crisis-only response when high risk

## What it is not

- Not a counsellor replacement, diagnosis tool, or official voice of any real person or faith tradition

## Pages

| Route | Purpose |
|-------|---------|
| `/youthmentor` | Home, flow overview, demo cases |
| `/youthmentor/characters` | Scenarios, coaching packs, daily quote, character picker |
| `/youthmentor/characters/chat` | Multi-turn character chat with intimacy & limits |
| `/youthmentor/characters/insights` | Local anonymous usage dashboard (B2B-style) |
| `/youthmentor/settings` | Parent mode, quiet hours, premium demo, export/import |
| `/youthmentor/check-in` | Mood, intensity, stress source, mentor selection |
| `/youthmentor/reflection` | Six structured reflection prompts |
| `/youthmentor/mentor-chat` | Structured mentor response + character debrief CTA |
| `/youthmentor/action-plan` | Checklist + reflection debrief link |
| `/youthmentor/safety` | Safety review, crisis panel, debrief link |
| `/youthmentor/safety-demo` | **DSA demo** — guided high-risk guardrail walkthrough |
| `/youthmentor/history` | Local history with delete |

## Growth character chat features

| Feature | Description |
|---------|-------------|
| Scenario cards | Pain-point entry (exam anxiety, sleep, friendship, startup, etc.) → matched persona |
| Long-term memory | Profile + rule facts + LLM summary every 5 turns |
| Intimacy Lv.1–3 | Unlocks deeper RAG chunks as message count / streak grows |
| Reflection bridge | After structured reflection → character mentor debrief |
| Coaching packs | 21/30-day themed journeys (freemium: some packs need premium demo) |
| Freemium limits | 20 msgs/day free; parent mode 10/day + quiet hours 22:00–07:00 |
| Daily quote | Favorite character quote of the day |
| Resonance wall | Anonymous “you are not alone” estimate (no chat text shared) |
| Feedback | 👍/👎 per reply; TTS listen; share quote card |
| Knowledge attribution | Reply footnote cites public teaching themes |
| Backup | Export/import JSON; cloud sync stub for future Supabase |

## Demo cases

On the home page, load:

1. Exam stress  
2. Friendship conflict  
3. Procrastination  
4. Low confidence  
5. **High-risk sample** — triggers safety guardrail; no normal coaching

For the high-risk demo: open Reflection → **Get mentor response** → Safety page with crisis resources only.

## Services

- `classifyRisk()` — keyword scan + mock LLM classifier  
- `generateMentorResponse()` — structured JSON mentor output  
- `processCharacterChat()` — LLM + mock with RAG, memory, intimacy  
- `createActionPlan()` — checklist from action steps  
- `saveReflection()` / `getReflectionHistory()` / `deleteReflection()` — `localStorage`

API: `POST /api/youthmentor/process` — structured mentor pipeline  
API: `POST /api/character-chat` — character role-play chat  
API: `POST /api/character-memory` — LLM memory summarization  
API: `GET /api/ai/status` — provider availability

## Getting started

```bash
npm install
npm run dev
```

Open **[http://localhost:3007/youthmentor](http://localhost:3007/youthmentor)** (Growth uses port **3007**; EduTech uses **3006**).

| Project | Dev URL |
|---------|---------|
| **Growth (YouthMentor)** | http://localhost:3007/youthmentor |
| Character chat | http://localhost:3007/youthmentor/characters |
| EduTech (sibling) | http://localhost:3006 |

### LLM API (same env as EduTech)

Character chat uses real LLM when `EDULENS_*` keys are set (shared with the sibling `edutech` project):

```bash
# From growth folder — copy sibling env (Windows)
Copy-Item ..\edutech\.env.local .env.local
```

Or copy `.env.local.example` to `.env.local` and fill keys. Provider chain: `OLLAMA → GEMINI → GROQ → …` (see `EDULENS_PROVIDER_CHAIN`). Falls back to mock replies if all providers fail.

## Mentor personas (structured reflection)

- Study Coach  
- Mindful Mentor  
- Scientist Mentor  
- Kindness Mentor  
- Wisdom Mode (values-based, no religion claims)

## Character chat personas (open conversation)

Built-in simulations (not affiliated with real individuals):

- **Entrepreneurs:** Elon Musk, Steve Jobs, Marie Curie, Jack Ma, Ren Zhengfei, Kazuo Inamori, Warren Buffett
- **Religious teachers:** Dalai Lama, Pope Francis, Zen Teacher, Master Chin Kung (净空法师), Venerable Master Hsuan Hua (宣化上人), Master Hsing Yun (星云大师)
- Each built-in role has a **knowledge base** (public teachings / interviews) injected into LLM prompts for authentic tone
- Custom virtual characters — create your own name, greeting, personality, and style

## Data

Reflections and growth data are stored only in the browser (`localStorage`). No account required. Users can delete entries in History and export/import growth backup in Settings.
