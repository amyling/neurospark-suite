# Vercel 首次部署（cenzhi 账号）

**Dashboard：** https://vercel.com/cenzhi

## 仓库策略

| 类型 | 仓库 | 可见性 |
|------|------|--------|
| 部署源码 | leo-suite-growth, leo-suite-edutech | **Private** |
| 作品集展示 | leo-suite-growth-showcase, leo-suite-edutech-showcase | **Public** |
| CampusBot | leo-suite-robot | Public |

完整步骤：**[PRIVATE_PUBLIC_REPOS.md](PRIVATE_PUBLIC_REPOS.md)**

## Vercel Import

三个 app 各一个 GitHub 仓库 → Import 一次 → **Root Directory 留空**。

| Vercel 项目 | GitHub（Private） |
|-------------|-------------------|
| leo-suite-growth | mentorkokkwa/leo-suite-growth |
| leo-suite-edutech | mentorkokkwa/leo-suite-edutech |
| leo-suite-robot | mentorkokkwa/leo-suite-robot |

环境变量与验证清单：**[CENZHI_SETUP.md](CENZHI_SETUP.md)**

## 推荐：先开 Demo 模式

Vercel 环境变量（growth / edutech）：

```
EDULENS_AI_MODE=mock
EDULENS_DEV_PROFILE=mock
NEXT_PUBLIC_DEMO_MODE=true
```

无需 API Key，适合 DSA 评审演示。

## 入口 URL（Production）

| App | URL |
|-----|-----|
| YouthMentor | https://leo-suite-growth-swart.vercel.app/youthmentor |
| EduLens | https://leo-suite-edutech-six.vercel.app/edulens |
| CampusBot | https://leo-suite-robot.vercel.app/campusbot |

部署完成后，更新 showcase 仓库 README 中的 Live Demo 链接。
