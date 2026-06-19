# NeuroSpark Suite

**Liu Cenzhi** · [github.com/mentorkokkwa](https://github.com/mentorkokkwa) · [leo-suite](https://github.com/mentorkokkwa/leo-suite)

Three connected prototypes I built out of interest in **AI engineering**, **product design**, and **commercial thinking** — focused on how students **learn**, **grow**, and how schools could **serve** with campus robotics.

## Live demos (Vercel)

**Dashboard:** [vercel.com/cenzhi](https://vercel.com/cenzhi) · Repo: [mentorkokkwa/leo-suite](https://github.com/mentorkokkwa/leo-suite)

Three projects from `leo-suite` (root: `growth` / `edutech` / `robot`). Copy each project's **Production URL** from the dashboard, then append:

| App | Root | Path |
|-----|------|------|
| YouthMentor | `growth` | `/youthmentor` |
| Safety walkthrough | `growth` | `/youthmentor/safety-demo` |
| EduLens | `edutech` | `/edulens` |
| CampusBot | `robot` | `/campusbot` |

Set `EDULENS_AI_MODE=mock` on `growth` and `edutech` for reliable demos without API keys.

| Project | Folder | Dev URL | Deploy path |
|---------|--------|---------|-------------|
| **EduLens AI** | `edutech/` | http://localhost:3006/edulens | `/edulens` |
| **YouthMentor AI** | `growth/` | http://localhost:3007/youthmentor | `/youthmentor` |
| **CampusBot AI** | `robot/` | http://localhost:3002/campusbot | `/campusbot` |

## Problem → Solution

| Pain point (Singapore students) | Product | Technical highlight |
|--------------------------------|---------|---------------------|
| Homework feedback is slow and generic | EduLens — homework analyzer, lesson generator, mistake book | Multi-provider LLM chain, JSON validation, vision OCR |
| Exam stress; reluctant to seek help early | YouthMentor — mood check-in, reflection, crisis guardrails | Layered safety pipeline, RAG-lite personas, local-first privacy |
| School service robots need safe navigation | CampusBot — map simulator, task planner, metrics report | A* pathfinding, dynamic re-planning, collision detection |

## Quick start (Windows)

Run each command separately (do not chain with `&&`):

```bash
cd edutech
npm install
npm run dev
```

```bash
cd growth
npm install
npm run dev
```

```bash
cd robot
npm install
npm run dev
```

Copy `edutech/.env.local.example` → `.env.local` for AI keys. Growth shares the same `EDULENS_*` variables. Without keys, **mock mode** works for demos.

## Documentation

| Document | Purpose |
|----------|---------|
| [docs/portfolio-one-pager.html](docs/portfolio-one-pager.html) | Print to PDF — one-page project overview |
| [docs/DEMO_SCRIPT.md](docs/DEMO_SCRIPT.md) | 3-minute product walkthrough (EN + 中文) |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | System architecture diagrams |
| [docs/PRICING.md](docs/PRICING.md) | Freemium / school pricing model |
| [docs/USER_SURVEY.md](docs/USER_SURVEY.md) | User research template + sample results |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Vercel deployment guide |
| [docs/GITHUB_SETUP.md](docs/GITHUB_SETUP.md) | Publish to GitHub safely |

## Safety demo (YouthMentor)

1. Open http://localhost:3007/youthmentor/safety-demo  
2. Click **Run safety demo**  
3. On Reflection → **Get mentor response**  
4. System blocks normal coaching and shows crisis resources only  

Or from home: Demo cases → **High-risk sample (safety demo)**.

## Tech stack

- **Frontend:** Next.js 16, React 19, Tailwind CSS 4, TypeScript  
- **AI:** Provider abstraction (`EDULENS_*`), Gemini / Groq / Ollama / mock fallback  
- **Storage:** Browser `localStorage` (privacy-first, no account required)  
- **Robotics:** Custom A* navigation engine (software simulation)

## License

MIT — see [LICENSE](LICENSE). API keys and `.env.local` are **not** included and must never be committed.

## Disclaimer

YouthMentor is reflective support, not therapy or emergency care. Character chat replies are **AI simulations**, not official voices of any real person or faith tradition.
