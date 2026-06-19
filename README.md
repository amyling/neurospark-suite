# NeuroSpark Suite (meta)

**Liu Cenzhi** · [github.com/mentorkokkwa](https://github.com/mentorkokkwa)

Three **separate repositories** — one app per repo, one Vercel project per import.

| App | GitHub | Vercel root |
|-----|--------|-------------|
| **YouthMentor AI** | [leo-suite-growth](https://github.com/mentorkokkwa/leo-suite-growth) | repo root |
| **EduLens AI** | [leo-suite-edutech](https://github.com/mentorkokkwa/leo-suite-edutech) | repo root |
| **CampusBot AI** | [leo-suite-robot](https://github.com/mentorkokkwa/leo-suite-robot) | repo root |

**Vercel:** [vercel.com/cenzhi](https://vercel.com/cenzhi) — import each repo once (no Root Directory).

> First time? See **[docs/GITHUB_SPLIT.md](docs/GITHUB_SPLIT.md)** if repos are not on mentorkokkwa yet.

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
| [docs/GITHUB_SPLIT.md](docs/GITHUB_SPLIT.md) | Three separate GitHub repos + transfer to mentorkokkwa |
| [docs/VERCEL_FIRST_DEPLOY.md](docs/VERCEL_FIRST_DEPLOY.md) | Deploy each repo to Vercel |
| [docs/portfolio-one-pager.html](docs/portfolio-one-pager.html) | One-page overview (print to PDF) |
| [docs/DEMO_SCRIPT.md](docs/DEMO_SCRIPT.md) | Product walkthrough script |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Architecture diagrams |
| [docs/PRICING.md](docs/PRICING.md) | Pricing model |
| [docs/USER_SURVEY.md](docs/USER_SURVEY.md) | User research template |

## License

MIT — see [LICENSE](LICENSE).
