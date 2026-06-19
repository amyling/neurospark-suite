# GitHub Setup — Publish NeuroSpark Suite

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
2. Name: `neurospark-suite` (or your choice)  
3. Public  
4. Do **not** add README (you already have one)

## Step 3 — Push

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/neurospark-suite.git
git push -u origin main
```

## Step 4 — Repository settings

- **About:** add description + link to Vercel demo  
- **Topics:** `nextjs`, `dsa`, `singapore`, `ai`, `education`, `wellbeing`  
- **License:** MIT (already in repo)

## What to put in README badges (optional)

```markdown
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
```

Add live demo links after Vercel deploy:

```markdown
- [YouthMentor Live](https://your-growth.vercel.app/youthmentor)
- [EduLens Live](https://your-edutech.vercel.app/edulens)
- [CampusBot Live](https://your-robot.vercel.app/campusbot)
```

## Interview: how to present GitHub

1. **Before interview:** send repo link in portfolio / DSA form if allowed.  
2. **During interview:** open README → Architecture doc → one API route (e.g. safety pipeline).  
3. **If asked "did you copy?":** walk through commit history and explain one bug you fixed.  
4. **Private repo alternative:** grant read access to interviewer email only — public is stronger for DSA.

## Security checklist

- [ ] `.gitignore` includes `.env*`  
- [ ] `git log` / `git status` show no secrets  
- [ ] Rotate any key that was ever committed  
- [ ] Use GitHub secret scanning (enabled by default on public repos)

## Large files

Do not commit `node_modules`, `.next`, or demo videos > 50 MB. Use `.gitignore`.
