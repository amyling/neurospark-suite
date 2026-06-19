# GitHub Setup — leo-suite

Repository: **https://github.com/mentorkokkwa/leo-suite**

## Recommended: public repo, private secrets

| Public on GitHub | Never commit |
|------------------|--------------|
| Source code | `.env.local` |
| README, docs, LICENSE | API keys |
| `.env.local.example` (empty keys) | `node_modules/`, `.next/` |

## Step 1 — Initialize (if not done)

From `haibao_project` folder:

```bash
git init
git add .
git status
```

Verify `.env.local` is **not** staged.

## Step 2 — Create GitHub repository

1. GitHub → **New repository**  
2. Name: `leo-suite`  
3. Public  
4. Do **not** add README (you already have one)

## Step 3 — Push

```bash
git branch -M main
git remote add origin https://github.com/mentorkokkwa/leo-suite.git
git push -u origin main
```

## Step 4 — Repository settings

- **About:** short description + link to live demos  
- **Topics:** `nextjs`, `typescript`, `ai`, `education`, `wellbeing`, `robotics`  
- **License:** MIT (already in repo)

## What to put in README badges (optional)

```markdown
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
```

Add live demo links after Vercel deploy:

```markdown
- [YouthMentor Live](https://leo-suite-growth.vercel.app/youthmentor)
- [EduLens Live](https://leo-suite-edutech.vercel.app/edulens)
- [CampusBot Live](https://leo-suite-robot.vercel.app/campusbot)
```

## Sharing your work

1. Link README and live demos from your personal site or bio.  
2. To explain depth: README → `docs/ARCHITECTURE.md` → one API route (e.g. safety pipeline).  
3. Commit history shows how features evolved — walk through one meaningful change.  
4. Public repo is usually best for open-source credibility; use a private repo only if you have a specific reason.

## Security checklist

- [ ] `.gitignore` includes `.env*`  
- [ ] `git log` / `git status` show no secrets  
- [ ] Rotate any key that was ever committed  
- [ ] Use GitHub secret scanning (enabled by default on public repos)

## Large files

Do not commit `node_modules`, `.next`, or demo videos > 50 MB. Use `.gitignore`.
