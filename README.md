# Leo Suite: AI for Smarter Schools and Student Support

**Leo Suite** is a three-project AI and computing portfolio built for **DSA-JC Computing / AI / Robotics / Leadership** applications.

It explores how AI can improve:

1. **Student learning and teacher productivity** — EduLens AI  
2. **School service robotics** — CampusBot AI  
3. **Student wellbeing and responsible AI safety** — YouthMentor AI  

**Author:** Liu Cenzhi (刘岑之) · [github.com/mentorkokkwa](https://github.com/mentorkokkwa)

---

## Live Portfolio

| Entry | Link | What to click |
|-------|------|---------------|
| **Portfolio home** | **[leo-suite.vercel.app](https://leo-suite.vercel.app)** | Three project cards, PDF downloads, overview video |
| **EduLens AI** (primary) | [Live demo](https://leo-suite-edutech-six.vercel.app/edulens?locale=en) | Homework analyzer → paste or upload → structured feedback |
| **CampusBot AI** | [Live demo](https://leo-suite-robot.vercel.app/campusbot/simulator?locale=en) | Select scenario → run simulation → view metrics |
| **YouthMentor AI** | [Safety demo](https://leo-suite-growth-swart.vercel.app/youthmentor/safety-demo?locale=en) | Run safety walkthrough → crisis guardrail blocks coaching |

**Portfolio PDFs (download from site or repo):**

- [One-page summary](assets/portfolio/leo-suite-one-page.pdf) — for application upload  
- [Full portfolio (8–12 pages)](assets/portfolio/leo-suite-full-portfolio.pdf) — for interview prep  

---

## Why This Portfolio Matters

These projects are designed around **real school problems**, not toy demos.

| School problem | My response | What reviewers can verify |
|--------------|-------------|---------------------------|
| Teachers spend hours marking; students get scores without structured feedback | **EduLens AI** — marking-style JSON feedback, mistake book, lesson generator | Live homework analyzer + lesson generator |
| Schools explore service robots but lack software prototypes | **CampusBot AI** — A* pathfinding simulator with task metrics | Live simulator with re-planning |
| Unstructured AI chat poses wellbeing and safety risks for youth | **YouthMentor AI** — crisis guardrails before any coaching LLM | Safety walkthrough demo |

**What this demonstrates:**

- **Full-stack engineering** — Next.js API routes, TypeScript, deployment on Vercel (4 live sites)  
- **AI engineering** — multi-provider LLM chains, RAG-lite syllabus, Zod-validated JSON outputs  
- **Algorithms** — A* pathfinding with dynamic re-planning  
- **Leadership & ethics** — layered crisis pipeline, privacy-first local storage, teacher-review flags  

---

## What I Built (Quick Guide for Reviewers)

### EduLens AI — Primary project · Computing / AI

> Structured homework feedback and syllabus-aware lesson generation for teachers and students.

- **Try first:** [Homework analyzer](https://leo-suite-edutech-six.vercel.app/edulens/homework-analyzer?locale=en)  
- **Also see:** [Lesson generator](https://leo-suite-edutech-six.vercel.app/edulens/lesson-generator?locale=en)  
- **Public docs:** [leo-suite-edutech-showcase](https://github.com/mentorkokkwa/leo-suite-edutech-showcase)  

### CampusBot AI — Robotics · Algorithms

> School service robot simulator — A* navigation, dynamic re-planning, task metrics.

- **Try first:** [Simulator](https://leo-suite-robot.vercel.app/campusbot/simulator?locale=en)  
- **Source (public):** [leo-suite-robot](https://github.com/mentorkokkwa/leo-suite-robot)  

### YouthMentor AI — Leadership · Safety & Ethics

> Safety-first digital mentor — mood check-in, 6-step reflection, crisis guardrails.

- **Try first:** [Safety walkthrough](https://leo-suite-growth-swart.vercel.app/youthmentor/safety-demo?locale=en)  
- **Also see:** [Home](https://leo-suite-growth-swart.vercel.app/youthmentor?locale=en)  
- **Public docs:** [leo-suite-growth-showcase](https://github.com/mentorkokkwa/leo-suite-growth-showcase)  

---

## Technology Summary

| Area | Stack & evidence |
|------|------------------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS 4 |
| AI | Multi-provider chain (Agnes, Gemini, Groq, OpenRouter, Mock), RAG-lite, Zod validation |
| Algorithms | A* pathfinding, collision handling, dynamic re-plan |
| Safety | Keyword scan → classifier → crisis-only UI; `teacherReviewRecommended` flags |
| Deployment | Vercel (mock mode for reliable school demos); private deploy + public showcase repos |
| i18n | English / Chinese UI across apps |

---

## Repository Map

| App | Live demo | Private deploy | Public showcase |
|-----|-----------|----------------|-----------------|
| **Portfolio home** | [leo-suite.vercel.app](https://leo-suite.vercel.app) | — | this repo |
| **EduLens AI** | [edulens](https://leo-suite-edutech-six.vercel.app/edulens?locale=en) | [leo-suite-edutech](https://github.com/mentorkokkwa/leo-suite-edutech) | [showcase](https://github.com/mentorkokkwa/leo-suite-edutech-showcase) |
| **YouthMentor AI** | [youthmentor](https://leo-suite-growth-swart.vercel.app/youthmentor?locale=en) | [leo-suite-growth](https://github.com/mentorkokkwa/leo-suite-growth) | [showcase](https://github.com/mentorkokkwa/leo-suite-growth-showcase) |
| **CampusBot AI** | [campusbot](https://leo-suite-robot.vercel.app/campusbot?locale=en) | [leo-suite-robot](https://github.com/mentorkokkwa/leo-suite-robot) | same (public) |

**Setup guides:** [docs/PRIVATE_PUBLIC_REPOS.md](docs/PRIVATE_PUBLIC_REPOS.md) · [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

---

## Portfolio Documents

| Document | Purpose |
|----------|---------|
| [assets/portfolio/leo-suite-one-page.pdf](assets/portfolio/leo-suite-one-page.pdf) | One-page summary for application upload |
| [assets/portfolio/leo-suite-full-portfolio.pdf](assets/portfolio/leo-suite-full-portfolio.pdf) | Full 8–12 page portfolio for interviews |
| [docs/portfolio-one-page.html](docs/portfolio-one-page.html) | Print source (Chrome → Save as PDF) |
| [docs/portfolio-full.html](docs/portfolio-full.html) | Full print source |
| [docs/portfolio_full.md](docs/portfolio_full.md) | Extended EduLens write-up |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Architecture diagrams (all apps) |
| [docs/DEMO_SCRIPT.md](docs/DEMO_SCRIPT.md) | Product walkthrough script |

**Overview video:** add `assets/video/leo-suite-overview.mp4` to the repo (embedded on portfolio home — no YouTube required).

---

## Local Development

Standalone app repos are developed separately and deployed to their own Vercel projects. If you maintain a combined workspace locally:

| App | Folder | Port | URL |
|-----|--------|------|-----|
| EduLens | `edutech/` | 3006 | http://localhost:3006/edulens |
| YouthMentor | `growth/` | 3007 | http://localhost:3007/youthmentor |
| CampusBot | `robot/` | 3002 | http://localhost:3002/campusbot |

Regenerate PDFs after editing HTML sources:

```bash
npm install
npx playwright install chromium
npm run generate-pdf
```

---

## License

MIT — see [LICENSE](LICENSE).

*Not a medical or counselling service · AI character replies are simulations · Teachers should review AI marking before classroom use.*
