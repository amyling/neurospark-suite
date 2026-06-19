# Vercel Deployment Guide

Deploy each app as a **separate Vercel project** (one repo, three roots).

## Prerequisites

- GitHub: [github.com/mentorkokkwa/leo-suite](https://github.com/mentorkokkwa/leo-suite)
- Vercel: [vercel.com/cenzhi](https://vercel.com/cenzhi) (connected to the same GitHub account)
- Singapore users: Vercel CDN includes SG edge — static pages load fast

## 1. YouthMentor (growth)

| Setting | Value |
|---------|-------|
| Root Directory | `growth` |
| Framework | Next.js |
| Build Command | `npm run build` |
| Output | default |

**Environment variables (Vercel Dashboard → Settings → Environment Variables):**

```bash
EDULENS_AI_MODE=mock
```

For real AI replies (optional):

```bash
EDULENS_AI_MODE=auto
GEMINI_API_KEY=your_key
GROQ_API_KEY=your_key
```

**Production URL:** open [vercel.com/cenzhi](https://vercel.com/cenzhi) → **growth** project → copy domain, then add `/youthmentor`  
**Safety walkthrough:** same domain + `/youthmentor/safety-demo`

### Cold start note

First API call after idle may add 1–3 s. LLM calls add 2–10 s. For stable demos, use **mock mode** or local `localhost`.

## 2. EduLens (edutech)

| Setting | Value |
|---------|-------|
| Root Directory | `edutech` |

```bash
EDULENS_AI_MODE=mock
```

Live: [vercel.com/cenzhi](https://vercel.com/cenzhi) → **edutech** project → `/edulens`

## 3. CampusBot (robot)

| Setting | Value |
|---------|-------|
| Root Directory | `robot` |

No API keys required — fully client-side simulation.

Live: [vercel.com/cenzhi](https://vercel.com/cenzhi) → **robot** project → `/campusbot`

## Deploy steps (each project)

1. Push code to GitHub.  
2. Vercel → [vercel.com/cenzhi](https://vercel.com/cenzhi) → **Add New** → Import `mentorkokkwa/leo-suite`.  
3. Set **Root Directory** to `growth`, `edutech`, or `robot`.  
4. Add env vars → Deploy.  
5. Smoke-test safety walkthrough and one normal demo case.

## Demo reliability

| Priority | Method |
|----------|--------|
| 1 | Local `npm run dev` on laptop |
| 2 | Vercel with `EDULENS_AI_MODE=mock` |
| 3 | Pre-recorded walkthrough video |

## Custom domains (optional)

Vercel free tier supports `*.vercel.app`. Custom domain (e.g. `neurospark.sg`) is optional.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Build fails | Run `npm run build` locally in that folder first |
| API 500 | Check env vars; fall back to `mock` |
| Slow first load | Normal for serverless cold start; warm up once before a live demo |
| 404 on routes | Ensure Next.js app router; no `output: 'export'` |

## Security

- Never commit `.env.local`  
- Set API keys only in Vercel dashboard, not in git  
- Rotate keys if accidentally exposed
