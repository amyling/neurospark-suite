# Leo Suite GitHub 仓库（mentorkokkwa）

每个 app **独立仓库** → Vercel **Import 一次**，Root Directory **留空**。

## Private 部署 + Public 展示

| App | Private（Vercel 部署） | Public（DSA 作品集） |
|-----|------------------------|----------------------|
| YouthMentor | [leo-suite-growth](https://github.com/mentorkokkwa/leo-suite-growth) | [leo-suite-growth-showcase](https://github.com/mentorkokkwa/leo-suite-growth-showcase) |
| EduLens | [leo-suite-edutech](https://github.com/mentorkokkwa/leo-suite-edutech) | [leo-suite-edutech-showcase](https://github.com/mentorkokkwa/leo-suite-edutech-showcase) |
| CampusBot | [leo-suite-robot](https://github.com/mentorkokkwa/leo-suite-robot) | 同上 |
| 文档 | [leo-suite](https://github.com/mentorkokkwa/leo-suite) | Public |

## 设置 Private 部署仓库

GitHub → 各 repo → **Settings** → **Danger Zone** → **Change visibility** → **Private**

Vercel 需已授权访问 private repos。

## 创建 Public Showcase 仓库

1. GitHub 新建 **Public** 空仓库：`leo-suite-growth-showcase`、`leo-suite-edutech-showcase`
2. 从本地模板推送：

```powershell
cd showcase
.\init-showcase-repos.ps1
```

模板内容：`showcase/leo-suite-*-showcase/`（README、docs、screenshots 占位）

## 本地开发

在各自子目录内 push，只更新对应 **private** 仓库：

```powershell
cd growth
git push origin main
```

（edutech、robot 同理。）

## Vercel

见 [CENZHI_SETUP.md](CENZHI_SETUP.md) — 仅在 **vercel.com/cenzhi** 部署。

完整部署规则：[DEPLOYMENT_CURSOR_CODEX.md](DEPLOYMENT_CURSOR_CODEX.md)
