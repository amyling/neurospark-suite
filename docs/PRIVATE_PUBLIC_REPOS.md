# Leo Suite — Private Deploy + Public Showcase Repos

Two-repo strategy for **EduLens** and **YouthMentor** (CampusBot stays public — no API keys).

| Role | EduLens | YouthMentor |
|------|---------|-------------|
| **Private deploy repo** (Vercel source) | [leo-suite-edutech](https://github.com/mentorkokkwa/leo-suite-edutech) | [leo-suite-growth](https://github.com/mentorkokkwa/leo-suite-growth) |
| **Public showcase repo** (DSA portfolio) | [leo-suite-edutech-showcase](https://github.com/mentorkokkwa/leo-suite-edutech-showcase) | [leo-suite-growth-showcase](https://github.com/mentorkokkwa/leo-suite-growth-showcase) |
| **Vercel project** | leo-suite-edutech | leo-suite-growth |
| **Vercel team** | [vercel.com/cenzhi](https://vercel.com/cenzhi) | [vercel.com/cenzhi](https://vercel.com/cenzhi) |

---

## Why two repos per app?

| Private deploy repo | Public showcase repo |
|---------------------|----------------------|
| Full Next.js source | README, docs, screenshots |
| API routes + prompts | Architecture diagrams |
| AI provider chain | Demo links + video links |
| Safety classifier logic | Sample non-sensitive code |
| Connected to Vercel | DSA-JC portfolio proof |

**Never commit:** API keys, `.env.local`, full prompt templates, production scoring logic.

---

## Step 1 — Make deploy repos private

Do this on GitHub for **leo-suite-edutech** and **leo-suite-growth**:

1. Open repo → **Settings** → **General** → **Danger Zone**
2. **Change repository visibility** → **Make private**
3. Confirm

Vercel keeps deploying from private repos when the GitHub app has access:

1. [vercel.com/cenzhi](https://vercel.com/cenzhi) → each project → **Settings** → **Git**
2. Confirm connected repo is still linked
3. If disconnected: **Connect Git Repository** → re-import private repo

---

## Step 2 — Vercel environment (demo-safe defaults)

Set in **Settings → Environment Variables** for **Production + Preview + Development**:

### leo-suite-growth (YouthMentor)

```bash
EDULENS_AI_MODE=mock
EDULENS_DEV_PROFILE=mock
EDULENS_SKIP_OLLAMA=true
EDULENS_PREFER_OLLAMA=false
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_APP_NAME=YouthMentor AI
```

### leo-suite-edutech (EduLens)

```bash
EDULENS_AI_MODE=mock
EDULENS_DEV_PROFILE=mock
EDULENS_SKIP_OLLAMA=true
EDULENS_PREFER_OLLAMA=false
EDULENS_RAG_ENABLED=true
EDULENS_RAG_WEB_ENABLED=false
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_APP_NAME=EduLens AI
```

For real AI (optional, after demo review): switch to `EDULENS_AI_MODE=auto`, add provider keys in Vercel only — see [CENZHI_SETUP.md](CENZHI_SETUP.md).

After saving → **Deployments → Redeploy**.

---

## Step 3 — Create public showcase repos

Templates live in this workspace:

| Template folder | Push to GitHub as |
|-----------------|-------------------|
| `showcase/leo-suite-growth-showcase/` | `mentorkokkwa/leo-suite-growth-showcase` (Public) |
| `showcase/leo-suite-edutech-showcase/` | `mentorkokkwa/leo-suite-edutech-showcase` (Public) |

### GitHub: create empty public repo

1. **New repository** → name `leo-suite-growth-showcase` → **Public** → no README
2. Repeat for `leo-suite-edutech-showcase`

### Push from Windows (PowerShell)

Run from `haibao_project/showcase/leo-suite-growth-showcase/`:

```powershell
git init
git add .
git commit -m "Initial YouthMentor AI showcase portfolio"
git branch -M main
git remote add origin https://github.com/mentorkokkwa/leo-suite-growth-showcase.git
git push -u origin main
```

Repeat for `leo-suite-edutech-showcase`.

Or run the helper script:

```powershell
cd showcase
.\init-showcase-repos.ps1
```

---

## Step 4 — Fill in live demo URLs

After Vercel deploy, update showcase README files:

| App | Production URL pattern |
|-----|------------------------|
| YouthMentor | `https://leo-suite-growth-swart.vercel.app/youthmentor` |
| EduLens | `https://leo-suite-edutech-six.vercel.app/edulens` |
| CampusBot (public) | `https://leo-suite-robot.vercel.app/campusbot` |

Copy exact domains from [vercel.com/cenzhi](https://vercel.com/cenzhi) → project → **Domains**.

---

## Step 5 — Acceptance checklist

- [ ] Private repos: `leo-suite-edutech`, `leo-suite-growth`
- [ ] Public showcase repos created and pushed
- [ ] Vercel production URLs load all demo pages
- [ ] Mock mode works without API keys (no 500 errors)
- [ ] YouthMentor high-risk demo triggers safety guardrail
- [ ] EduLens homework demo returns structured report
- [ ] No secrets in GitHub history or frontend bundle
- [ ] Showcase README has live links + demo video placeholders filled

---

## Branch strategy

| Branch | Deployment |
|--------|------------|
| `main` | Production |
| `dev` | Preview |
| `feature/*` | Preview per PR |

Do not merge broken builds to `main`. Run locally before push:

```powershell
npm install
npm run lint
npm run typecheck
npm run build
```

---

## Related docs

| Document | Purpose |
|----------|---------|
| [DEPLOYMENT_CURSOR_CODEX.md](DEPLOYMENT_CURSOR_CODEX.md) | Full Cursor / Codex deployment rule |
| [CENZHI_SETUP.md](CENZHI_SETUP.md) | Vercel env vars (real AI mode) |
| [VERCEL_FIRST_DEPLOY.md](VERCEL_FIRST_DEPLOY.md) | First-time Vercel import |
| [DEMO_SCRIPT.md](DEMO_SCRIPT.md) | Live demo walkthrough |
