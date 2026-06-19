# 拆分为三个 GitHub 仓库

每个 app **独立仓库** → Vercel **Import 一次**，无需 Root Directory。

## 仓库一览（目标账号：mentorkokkwa）

| App | 仓库 | Vercel Import |
|-----|------|---------------|
| YouthMentor | https://github.com/mentorkokkwa/leo-suite-growth | 根目录即可 |
| EduLens | https://github.com/mentorkokkwa/leo-suite-edutech | 根目录即可 |
| CampusBot | https://github.com/mentorkokkwa/leo-suite-robot | 根目录即可 |
| 文档 / 作品集 | https://github.com/mentorkokkwa/leo-suite | 仅 README + docs |

---

## 若 mentorkokkwa 下还没有这三个仓库

本机已推送到临时位置，任选一种方式迁到 **mentorkokkwa**：

### 方式 A：转移所有权（推荐，与 leo-suite 相同）

对每个仓库（在 **amyling** 或当前持有者账号下）：

1. 打开 `https://github.com/amyling/leo-suite-growth` → **Settings**
2. 最下方 **Transfer ownership** → 填 `mentorkokkwa`
3. 用 **mentorkokkwa** 登录 GitHub，在邮件/通知里 **接受转移**
4. 对 `leo-suite-edutech`、`leo-suite-robot` 重复

### 方式 B：在 mentorkokkwa 新建空仓库再推送

1. mentorkokkwa 登录 → New repository → 创建 `leo-suite-growth`（空、不要 README）
2. 在本机：

```powershell
cd C:\Users\HP\Downloads\cenling\neurospark\haibao_project\growth
git remote set-url origin https://github.com/mentorkokkwa/leo-suite-growth.git
git push -u origin main
```

3. 对 `edutech`、`robot` 同样操作（仓库名 `leo-suite-edutech`、`leo-suite-robot`）

### 方式 C：GitHub Import

1. mentorkokkwa → **New** → **Import a repository**
2. Source: `https://github.com/amyling/leo-suite-growth`
3. 目标名：`leo-suite-growth`
4. 对其余两个 app 重复

---

## 本地开发

`leo-suite` 元仓库不再包含 app 源码（仅文档）。本机仍可在同一文件夹开发：

- `growth/` → 自己的 git → `leo-suite-growth`
- `edutech/` → `leo-suite-edutech`
- `robot/` → `leo-suite-robot`

改代码后在**对应子目录**里 `git push`，只触发该 app 的 Vercel 部署。

---

## Vercel

见 [VERCEL_FIRST_DEPLOY.md](VERCEL_FIRST_DEPLOY.md) — 分别 Import 三个 mentorkokkwa 仓库。
