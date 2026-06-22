# Vercel Deployment Guide — Leo Suite

Deploy each app as a **separate Vercel project** (one repo per app).

**Dashboard:** [vercel.com/cenzhi](https://vercel.com/cenzhi)

## Repository strategy

| App | Private deploy repo | Public showcase |
|-----|---------------------|-----------------|
| YouthMentor | [leo-suite-growth](https://github.com/mentorkokkwa/leo-suite-growth) | [leo-suite-growth-showcase](https://github.com/mentorkokkwa/leo-suite-growth-showcase) |
| EduLens | [leo-suite-edutech](https://github.com/mentorkokkwa/leo-suite-edutech) | [leo-suite-edutech-showcase](https://github.com/mentorkokkwa/leo-suite-edutech-showcase) |
| CampusBot | [leo-suite-robot](https://github.com/mentorkokkwa/leo-suite-robot) | same (public OK) |

Full setup: **[PRIVATE_PUBLIC_REPOS.md](PRIVATE_PUBLIC_REPOS.md)** · Cursor/Codex rule: **[DEPLOYMENT_CURSOR_CODEX.md](DEPLOYMENT_CURSOR_CODEX.md)**

---

## 1. YouthMentor (growth)

| Setting | Value |
|---------|-------|
| GitHub repo | `mentorkokkwa/leo-suite-growth` (Private) |
| Root Directory | `.` (empty) |
| Framework | Next.js |
| Build Command | `npm run build` |
| Production branch | `main` |

**Demo-safe env vars (recommended for school review):**

```bash
EDULENS_AI_MODE=mock
EDULENS_DEV_PROFILE=mock
EDULENS_SKIP_OLLAMA=true
NEXT_PUBLIC_DEMO_MODE=true
```

**Production URL:** https://leo-suite-growth-swart.vercel.app/youthmentor  
**Safety walkthrough:** https://leo-suite-growth-swart.vercel.app/youthmentor/safety-demo

---

## 2. EduLens (edutech)

| Setting | Value |
|---------|-------|
| GitHub repo | `mentorkokkwa/leo-suite-edutech` (Private) |
| Root Directory | `.` (empty) |

```bash
EDULENS_AI_MODE=mock
EDULENS_DEV_PROFILE=mock
EDULENS_SKIP_OLLAMA=true
EDULENS_RAG_WEB_ENABLED=false
NEXT_PUBLIC_DEMO_MODE=true
```

Live: https://leo-suite-edutech-six.vercel.app/edulens

---

## 3. CampusBot (robot)

| Setting | Value |
|---------|-------|
| GitHub repo | `mentorkokkwa/leo-suite-robot` (Public) |
| Root Directory | `.` (empty) |

No API keys required — fully client-side simulation.

Live: https://leo-suite-robot.vercel.app/campusbot · [/simulator](https://leo-suite-robot.vercel.app/campusbot/simulator)

---

## Deploy steps (each project)

1. Push code to **private** GitHub repo (growth / edutech).  
2. Vercel → **Add New** → Import private repo.  
3. Root Directory: **empty**. Framework: Next.js.  
4. Add env vars (mock mode first) → Deploy.  
5. Smoke-test demo flows and safety walkthrough.  
6. Push public showcase repo from `showcase/leo-suite-*-showcase/`.

---

## Demo reliability

| Priority | Method |
|----------|--------|
| 1 | Vercel with `EDULENS_AI_MODE=mock` |
| 2 | Local `npm run dev` on laptop |
| 3 | Pre-recorded walkthrough video |

---

## Build validation (before push)

```powershell
npm install
npm run lint
npm run typecheck
npm run build
```

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Build fails | Run `npm run build` locally first |
| API 500 | Set `EDULENS_AI_MODE=mock`; redeploy |
| Private repo not visible in Vercel | GitHub app → grant access to private repos |
| Slow first load | Serverless cold start; warm up before live demo |
| 404 on routes | No `output: 'export'` in next.config |

---

## Security

- Never commit `.env.local`  
- API keys only in Vercel dashboard  
- Private repos for full source; public showcase for portfolio docs only
