# Leo Suite — One-Page Overview

> **Portfolio home:** [leo-suite.vercel.app](https://leo-suite.vercel.app)  
> **PDF download:** [One-page PDF](assets/portfolio/leo-suite-one-page.pdf) · [Full portfolio PDF](assets/portfolio/leo-suite-full-portfolio.pdf)  
> **Print source:** open [docs/portfolio-one-page.html](portfolio-one-page.html) in Chrome → Print → Save as PDF.

## About

- **Name:** Liu Cenzhi
- **Focus:** AI · full-stack · product · DSA-JC portfolio
- **Links:** [github.com/mentorkokkwa](https://github.com/mentorkokkwa) · [leo-suite.vercel.app](https://leo-suite.vercel.app) · [vercel.com/cenzhi](https://vercel.com/cenzhi)

## Elevator pitch

**Leo Suite** — three connected apps for how students **learn** (EduLens), **grow** (YouthMentor), and how schools could deploy **service robots** (CampusBot). Built with TypeScript, Next.js, and user-centred design; clear safety and privacy boundaries.

## Projects

### EduLens AI — Learning

- Homework analyzer with marking-style feedback, mistake book, lesson generator
- 3-part lesson pipeline with staged loading, RAG citation cleanup, and output-type filtering
- Multi-provider LLM with JSON validation and vision OCR
- **Tech:** Next.js API routes, prompt builder, provider chain

### YouthMentor AI — Wellbeing

- Mood check-in → 6-step reflection → mentor response OR crisis block
- Voice input, mood trend chart, trust metrics vs engagement-first AI companions
- Character chat with empathy-first protocol, RAG-lite, memory, intimacy, freemium limits
- **Safety:** keyword scan → classifier → crisis-only UI (no coaching LLM)
- **Walkthrough:** `/youthmentor/safety-demo`

### CampusBot AI — Robotics

- School map simulator, A* pathfinding, dynamic re-planning
- Task scenarios: worksheet delivery, visitor guide, library return
- **Tech:** grid navigation engine, metrics report

## Technical depth

| Area | Evidence |
|------|----------|
| Full-stack web | Next.js 16, React 19, TypeScript, Tailwind |
| AI engineering | LLM abstraction, RAG-lite, structured JSON output |
| Algorithms | A* pathfinding, collision handling |
| Product | User flows, demo cases, i18n (EN/ZH) |
| Safety & ethics | Crisis guardrails, disclaimers, local-first data |

## Commercial thinking

- Freemium (20 msgs/day) + premium coaching packs
- School B2B insights — anonymous aggregates, no chat text
- See `docs/PRICING.md` and `docs/USER_SURVEY.md`

## What I learned

1. Safety cannot be an afterthought in youth AI products.
2. Mock fallbacks keep demos reliable without API keys — good engineering hygiene.
3. Three focused apps tell a clearer story than one bloated codebase.

## Next steps

- Pilot YouthMentor insights with school counsellors (anonymous metrics)
- Connect CampusBot simulator to hardware prototype
- Expand user research beyond initial peer survey

---

*MIT License · Not a medical or counselling service · AI character replies are simulations*
