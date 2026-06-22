# Deployment Rule for Cursor / Codex — Leo Suite

Adapted for **mentorkokkwa** Leo Suite (EduLens · YouthMentor · CampusBot).

---

## 1. Deployment Goal

Deploy AI School Portfolio projects to Vercel as polished web demos.

| Product | Private repo | Public showcase |
|---------|--------------|-----------------|
| EduLens AI | `leo-suite-edutech` | `leo-suite-edutech-showcase` |
| YouthMentor AI | `leo-suite-growth` | `leo-suite-growth-showcase` |
| CampusBot AI | `leo-suite-robot` (public OK) | same repo |

Requirements:

- Public demo URL for DSA-JC application
- Private source for apps with API routes / safety logic
- Demo mode when API keys are missing
- Environment-variable AI configuration
- No secrets in GitHub
- Stable laptop + browser demo

---

## 2. Repository Strategy

### Repo A — Private deployment (EduLens + YouthMentor)

| Setting | Value |
|---------|-------|
| Names | `leo-suite-edutech`, `leo-suite-growth` |
| Visibility | **Private** |
| Purpose | Full app, API routes, prompts, safety logic |
| Vercel | Deploy from these repos |

### Repo B — Public showcase

| Setting | Value |
|---------|-------|
| Names | `leo-suite-edutech-showcase`, `leo-suite-growth-showcase` |
| Visibility | **Public** |
| Purpose | DSA portfolio — README, docs, screenshots, demo links |
| Content | No API keys, no private prompts, no full provider code |

Templates: `showcase/leo-suite-*-showcase/` in this workspace.

Meta docs repo (public): [leo-suite](https://github.com/mentorkokkwa/leo-suite)

---

## 3. Vercel Deployment Policy

**Dashboard:** https://vercel.com/cenzhi

Each app = one Vercel project = one GitHub repo. **Root Directory: leave empty** (repo root is the app).

| Setting | Value |
|---------|-------|
| Framework | Next.js |
| Root Directory | `.` (empty) |
| Build Command | `npm run build` |
| Install Command | `npm install` |
| Output Directory | `.next` (default) |
| Production Branch | `main` |

`vercel.json` in each app repo:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "installCommand": "npm install"
}
```

---

## 4. Environment Variables

Never commit `.env` files. Use `.env.example` in each private repo.

Leo Suite uses `EDULENS_*` env names (shared AI layer). Mapping from generic names:

| Generic (portfolio spec) | Leo Suite equivalent |
|--------------------------|----------------------|
| `AI_PROVIDER=mock` | `EDULENS_AI_MODE=mock` |
| `DEMO_MODE=true` | `EDULENS_DEV_PROFILE=mock` + `NEXT_PUBLIC_DEMO_MODE=true` |
| `OPENAI_API_KEY` | `OPENAI_API_KEY` |
| `GEMINI_API_KEY` | `GEMINI_API_KEY` |
| `GROQ_API_KEY` | `GROQ_API_KEY` |
| `OLLAMA_BASE_URL` | `OLLAMA_API_URL` (local only) |

### Vercel — demo mode (recommended for school review)

**YouthMentor (growth):**

```bash
EDULENS_AI_MODE=mock
EDULENS_DEV_PROFILE=mock
EDULENS_SKIP_OLLAMA=true
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_APP_NAME=YouthMentor AI
```

**EduLens (edutech):**

```bash
EDULENS_AI_MODE=mock
EDULENS_DEV_PROFILE=mock
EDULENS_SKIP_OLLAMA=true
EDULENS_RAG_ENABLED=true
EDULENS_RAG_WEB_ENABLED=false
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_APP_NAME=EduLens AI
```

**CampusBot (robot):** no env vars — fully client-side.

Set keys in Vercel → **Settings → Environment Variables** → Production / Preview / Development → **Redeploy**.

---

## 5. Demo Mode Requirement

When `EDULENS_AI_MODE=mock`:

| App | Behavior |
|-----|----------|
| EduLens | Seeded homework / lesson analysis examples |
| CampusBot | Full local A* simulator (no AI) |
| YouthMentor | Safe mock mentor + crisis guardrail demo |

Required demo entry points:

| Button / route | URL |
|----------------|-----|
| Try YouthMentor Demo | `/youthmentor` |
| Safety walkthrough | `/youthmentor/safety-demo` |
| Try EduLens Demo | `/edulens/homework-analyzer` |
| Try CampusBot Demo | `/campusbot/simulator` |

No broken API errors during school review.

---

## 6. Branch Strategy

```
main        → production
dev         → preview
feature/*   → preview (PR)
```

- PR from `dev` → `main`
- Test local build before merge
- Only merge when demo flows work

---

## 7. Build Validation

Before push (run in `growth/` or `edutech/`):

```powershell
npm install
npm run lint
npm run typecheck
npm run build
```

EduLens also:

```powershell
npm run test
```

Reject deployment if:

- Build fails
- TypeScript errors
- Demo pages crash
- Missing API key breaks UX (use mock)
- YouthMentor high-risk demo does not trigger guardrail

---

## 8. Public Showcase Repo Content

Each showcase repo includes:

```
README.md
docs/product_overview.md
docs/architecture.md
docs/demo_script.md
docs/safety_design.md
docs/commercial_roadmap.md
demo-videos.md
screenshots/
sample/          # optional non-sensitive code excerpts
```

Showcase README must link live Vercel URLs and demo videos.

---

## 9. Deployment Steps

### Step 1 — Private repos

Repos already exist. Set visibility to **Private** on GitHub.

### Step 2 — Import to Vercel

1. [vercel.com/cenzhi](https://vercel.com/cenzhi) → **Add New** → Import Git Repository
2. Select private `leo-suite-growth` or `leo-suite-edutech`
3. Framework: Next.js, root `.`
4. Add env vars (mock mode first)
5. Deploy

### Step 3 — Confirm live demo

| App | Smoke-test routes |
|-----|-------------------|
| YouthMentor | `/`, `/youthmentor`, `/youthmentor/safety-demo`, `/youthmentor/characters` |
| EduLens | `/edulens`, `/edulens/homework-analyzer`, `/edulens/lesson-generator` |
| CampusBot | `/campusbot`, `/campusbot/simulator` |

### Step 4 — Public showcase repos

Push `showcase/leo-suite-*-showcase/` to GitHub (public). Update README with Vercel URLs.

---

## 10. Local Demo Setup

| App | Port | Command |
|-----|------|---------|
| YouthMentor | 3007 | `cd growth` → `npm run dev` |
| EduLens | 3006 | `cd edutech` → `npm run dev` |
| CampusBot | 3002 | `cd robot` → `npm run dev` |

Local mock mode: copy `.env.example` → `.env.local`, set `EDULENS_AI_MODE=mock`.

---

## 11. Backup Demo Plan

1. Live Vercel link (mock mode)
2. Local laptop demo
3. Screen-recorded walkthrough
4. PDF portfolio (`docs/portfolio-one-pager.html`)

---

## 12. Acceptance Criteria

Deployment complete when:

- [ ] Vercel production URLs work
- [ ] All three products reachable (three Vercel projects)
- [ ] EduLens demo produces structured report
- [ ] CampusBot simulator completes a task
- [ ] YouthMentor normal + high-risk demos work
- [ ] No API key in frontend or GitHub
- [ ] Public showcase READMEs are professional
- [ ] Mock mode works end-to-end

See also: [PRIVATE_PUBLIC_REPOS.md](PRIVATE_PUBLIC_REPOS.md)
