# Vercel 部署被 Block — Git Author 修复指南

## 错误信息

```
Git author lingcenfan@gmail.com must have access to the team Cenzhi on Vercel to create deployments.
Hobby teams do not support collaboration. Please upgrade to Pro to add team members.
```

## 原因

| 项目 | 说明 |
|------|------|
| Vercel 团队 | **Cenzhi**（Hobby 计划） |
| **正确 Git 邮箱** | `cenzhi128@gmail.com`（Cenzhi Liu / mentorkokkwa） |
| **错误 Git 邮箱** | `lingcenfan@gmail.com`（本机之前用的 amy 账号邮箱） |
| growth / edutech | **Private** 仓库 → Hobby 团队对 private repo 严格校验 commit 作者 |
| robot | **Public** 仓库 → 同样错误邮箱也能部署（所以只有另外两个 block） |

> **改环境变量不会直接导致 Git author 报错。** 但保存 env 后会点 Redeploy，这时 Vercel 才检查 commit 作者；若邮箱不对，就会 block。时间上是 env 改动触发了 redeploy，根因仍是 **private repo + Git 作者邮箱不匹配**。

Vercel 通过 **GitHub Login Connection** 比对：commit 作者邮箱必须 = mentorkokkwa 在 GitHub/Vercel 上 verified 的 `cenzhi128@gmail.com`。

---

## 方案 A — 推荐：重连 GitHub（5 分钟）

1. 浏览器登录 **mentorkokkwa** 的 Vercel：https://vercel.com/account/settings/authentication  
2. **GitHub** → **Disconnect**（若已连接）→ **Connect** 再次授权  
3. 确保连接的是 GitHub 账号 **mentorkokkwa**（不是 amyling 等其他账号）  
4. 打开 GitHub **mentorkokkwa** → Settings → Emails  
5. 确认 **`cenzhi128@gmail.com`** 已 **Verified**（不要用 lingcenfan@gmail.com）  
6. 回到 Vercel → 项目 → **Deployments** → 对最新 commit **Redeploy**

---

## 方案 B — 对齐 Git 邮箱与 Vercel 账号邮箱

若 Vercel 主邮箱是 **`cenzhi128@gmail.com`**（Cenzhi Liu）：

```powershell
git config user.email "cenzhi128@gmail.com"
git config user.name "Cenzhi Liu"
```

3. 用正确作者重新提交并推送：

```powershell
git commit --amend --no-edit --reset-author
git push origin main
```

或对三个 private 仓库各做一个空提交：

```powershell
git commit --allow-empty -m "chore: trigger deploy with Vercel-linked git author"
git push origin main
```

---

## 方案 C — CLI 部署前改写作者（不改历史）

在 `growth/`、`edutech/`、`robot/` 目录：

```powershell
# 1. 设为 Vercel 账号邮箱（与 GitHub verified email 一致）
git config user.email "cenzhi128@gmail.com"
git config user.name "Cenzhi Liu"

# 2. 仅改写最后一次 commit 的作者（然后 force push 需谨慎）
git commit --amend --no-edit --reset-author
git push origin main

# 3. 或直接 CLI 部署（需已 vercel link）
vercel deploy --prod --yes --scope cenzhi
```

---

## 方案 D — Deploy Hook（绕过 Git 作者检查）

适合 Git 集成一直失败时：

1. Vercel → 项目 → **Settings** → **Git** → **Deploy Hooks**  
2. 创建 Hook（branch: `main`）  
3. 推送代码后手动或脚本调用：

```powershell
Invoke-WebRequest -Uri "YOUR_DEPLOY_HOOK_URL" -Method POST
```

Deploy Hook **不校验** commit author。

---

## 方案 E — 不用 Hobby Team（长期）

Hobby **Team** 不支持协作者。可选：

| 选项 | 说明 |
|------|------|
| 升级到 Pro | 可添加 `lingcenfan@gmail.com` 为团队成员 |
| 迁到个人账号 | 在 **mentorkokkwa 个人** scope 下 Import 项目（非 Cenzhi team） |

---

## 本机一键脚本

```powershell
cd C:\Users\HP\Downloads\cenling\neurospark\haibao_project\scripts
.\fix-vercel-git-author.ps1 -Email "cenzhi128@gmail.com" -Name "Cenzhi Liu"
```

脚本会为 growth / edutech / robot 设置 local git config 并创建空 commit 触发部署。

---

## 验证

部署成功后：

| 检查 | URL |
|------|-----|
| YouthMentor | https://leo-suite-growth-swart.vercel.app/youthmentor |
| EduLens | https://leo-suite-edutech-six.vercel.app/edulens |
| CampusBot | https://leo-suite-robot.vercel.app/campusbot |

Vercel Deployments 状态应为 **Ready**，不再出现 Git author block。

---

## 不要做的事

- 不要用 **amyling** 账号 push 到 mentorkokkwa 仓库后再指望 cenzhi 团队部署  
- 不要在未关联邮箱的情况下反复 Redeploy（会产生大量 UNKNOWN 卡住记录）  
- 不要升级 Pro 除非确实需要多人协作
