# Leo Suite (meta)

Three **separate repositories** — one app per repo, one Vercel project per import on **vercel.com/cenzhi**.

## Repository map

| App | Private deploy | Public showcase | Vercel |
|-----|----------------|-----------------|--------|
| **YouthMentor AI** | [leo-suite-growth](https://github.com/mentorkokkwa/leo-suite-growth) | [leo-suite-growth-showcase](https://github.com/mentorkokkwa/leo-suite-growth-showcase) | leo-suite-growth |
| **EduLens AI** | [leo-suite-edutech](https://github.com/mentorkokkwa/leo-suite-edutech) | [leo-suite-edutech-showcase](https://github.com/mentorkokkwa/leo-suite-edutech-showcase) | leo-suite-edutech |
| **CampusBot AI** | [leo-suite-robot](https://github.com/mentorkokkwa/leo-suite-robot) | same repo (public) | leo-suite-robot |

**Setup:** [docs/PRIVATE_PUBLIC_REPOS.md](docs/PRIVATE_PUBLIC_REPOS.md) · [docs/CENZHI_SETUP.md](docs/CENZHI_SETUP.md)

## Live Demo (Vercel Production)

| App | URL |
|-----|-----|
| **YouthMentor AI** | https://leo-suite-growth-swart.vercel.app/youthmentor |
| **EduLens AI** | https://leo-suite-edutech-six.vercel.app/edulens |
| **CampusBot AI** | https://leo-suite-robot.vercel.app/campusbot |

| App | Key paths |
|-----|-----------|
| YouthMentor | [/safety-demo](https://leo-suite-growth-swart.vercel.app/youthmentor/safety-demo) · [/characters](https://leo-suite-growth-swart.vercel.app/youthmentor/characters) |
| EduLens | [/homework-analyzer](https://leo-suite-edutech-six.vercel.app/edulens/homework-analyzer) · [/lesson-generator](https://leo-suite-edutech-six.vercel.app/edulens/lesson-generator) |
| CampusBot | [/simulator](https://leo-suite-robot.vercel.app/campusbot/simulator) |

## Local dev (this folder)

If you keep a combined workspace on disk, run each app from its subfolder:

```bash
cd growth
npm install
npm run dev
```

```bash
cd edutech
npm install
npm run dev
```

```bash
cd robot
npm install
npm run dev
```

| App | Port | URL |
|-----|------|-----|
| YouthMentor | 3007 | http://localhost:3007/youthmentor |
| EduLens | 3006 | http://localhost:3006/edulens |
| CampusBot | 3002 | http://localhost:3002/campusbot |

## Docs

| Document | Purpose |
|----------|---------|
| [docs/PRIVATE_PUBLIC_REPOS.md](docs/PRIVATE_PUBLIC_REPOS.md) | Private deploy + public showcase repos |
| [docs/DEPLOYMENT_CURSOR_CODEX.md](docs/DEPLOYMENT_CURSOR_CODEX.md) | Cursor / Codex deployment rule |
| [docs/CENZHI_SETUP.md](docs/CENZHI_SETUP.md) | cenzhi Vercel + env vars checklist |
| [docs/GITHUB_SPLIT.md](docs/GITHUB_SPLIT.md) | GitHub repo map |
| [docs/VERCEL_FIRST_DEPLOY.md](docs/VERCEL_FIRST_DEPLOY.md) | Vercel import summary |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Full deployment guide |
| [docs/portfolio-one-pager.html](docs/portfolio-one-pager.html) | One-page overview (print to PDF) |
| [docs/DEMO_SCRIPT.md](docs/DEMO_SCRIPT.md) | Product walkthrough script |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Architecture diagrams |

## Showcase templates

Push to GitHub as public portfolio repos:

```
showcase/leo-suite-growth-showcase/
showcase/leo-suite-edutech-showcase/
showcase/init-showcase-repos.ps1
```

## License

MIT — see [LICENSE](LICENSE).
