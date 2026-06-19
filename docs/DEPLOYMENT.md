# Vercel Deployment Guide

Deploy each app as a **separate Vercel project** (simplest for DSA demo links).

## Prerequisites

- GitHub repo pushed (see [GITHUB_SETUP.md](GITHUB_SETUP.md))
- [Vercel](https://vercel.com) account (free Hobby tier is enough)
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

**Demo URL after deploy:** `https://your-growth-app.vercel.app/youthmentor`  
**Safety demo:** `https://your-growth-app.vercel.app/youthmentor/safety-demo`

### Cold start note

First API call after idle may add 1–3 s. LLM calls add 2–10 s. For interviews, use **mock mode** or local `localhost`.

## 2. EduLens (edutech)

| Setting | Value |
|---------|-------|
| Root Directory | `edutech` |

```bash
EDULENS_AI_MODE=mock
```

Demo: `https://your-edutech-app.vercel.app/edulens`

## 3. CampusBot (robot)

| Setting | Value |
|---------|-------|
| Root Directory | `robot` |

No API keys required — fully client-side simulation.

Demo: `https://your-robot-app.vercel.app/campusbot`

## Deploy steps (each project)

1. Push code to GitHub.  
2. Vercel → **Add New Project** → Import repo.  
3. Set **Root Directory** to `growth`, `edutech`, or `robot`.  
4. Add env vars → Deploy.  
5. Test safety demo and one normal demo case.

## Interview strategy

| Priority | Method |
|----------|--------|
| 1 | Local `npm run dev` on laptop |
| 2 | Vercel with `EDULENS_AI_MODE=mock` |
| 3 | Pre-recorded video |

## Custom domains (optional)

Vercel free tier supports `*.vercel.app`. Custom domain (e.g. `neurospark.sg`) is optional for DSA.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Build fails | Run `npm run build` locally in that folder first |
| API 500 | Check env vars; fall back to `mock` |
| Slow first load | Normal for serverless cold start; click once before interview |
| 404 on routes | Ensure Next.js app router; no `output: 'export'` |

## Security

- Never commit `.env.local`  
- Set API keys only in Vercel dashboard, not in git  
- Rotate keys if accidentally exposed
