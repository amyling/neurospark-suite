# Vercel 首次部署（从零开始）

账号：**https://vercel.com/cenzhi**  
仓库：**https://github.com/mentorkokkwa/leo-suite**

一个 GitHub 仓库要部署 **3 个 Vercel 项目**（不同 Root Directory）。

---

## 第 0 步：登录并连接 GitHub

1. 打开 https://vercel.com/login  
2. 用 **mentorkokkwa** 的 GitHub 登录（Continue with GitHub）  
3. 授权 Vercel 访问 GitHub  
4. 确认进入 https://vercel.com/cenzhi 能看到控制台  

若 Dashboard 是空的，说明还没导入项目——按下面做 3 次即可。

---

## 第 1 个项目：YouthMentor（growth）

1. https://vercel.com/new  
2. **Import** → 选 `mentorkokkwa/leo-suite`  
3. **Project Name:** `leo-suite-growth`（可自定）  
4. **Root Directory** → Edit → 填 `growth`  
5. Framework Preset：**Next.js**（自动识别）  
6. **Environment Variables** → 添加：

   | Name | Value |
   |------|-------|
   | `EDULENS_AI_MODE` | `mock` |

7. 点击 **Deploy**  
8. 部署完成后，Production URL 类似 `https://leo-suite-growth.vercel.app`  
9. 访问：`https://你的域名/youthmentor`  
10. 安全演示：`https://你的域名/youthmentor/safety-demo`

---

## 第 2 个项目：EduLens（edutech）

重复 **Add New Project**，同一仓库 `leo-suite`：

| 设置 | 值 |
|------|-----|
| Project Name | `leo-suite-edutech` |
| Root Directory | `edutech` |
| Env | `EDULENS_AI_MODE` = `mock` |

访问：`https://你的域名/edulens`

---

## 第 3 个项目：CampusBot（robot）

| 设置 | 值 |
|------|-----|
| Project Name | `leo-suite-robot` |
| Root Directory | `robot` |
| Env | 无需 API key |

访问：`https://你的域名/campusbot`

---

## 部署后检查清单

- [ ] Dashboard 有 3 个项目  
- [ ] `leo-suite-growth` → `/youthmentor` 能打开  
- [ ] `leo-suite-growth` → `/youthmentor/safety-demo` 能跑安全演示  
- [ ] `leo-suite-edutech` → `/edulens` 能打开  
- [ ] `leo-suite-robot` → `/campusbot` 能打开  
- [ ] 把 3 个 Production URL 写进 `README.md`  

---

## 常见问题

**Build failed**  
在本机对应目录先跑 `npm run build`（Windows 下分开执行，不要用 `&&`）。

**API 500 / AI 不回复**  
确认 `growth` 和 `edutech` 已设 `EDULENS_AI_MODE=mock`。

**只导入了 1 次仓库**  
正常。同一 repo 导入 3 次，每次改 Root Directory 即可。

**本机 `vercel` CLI 登录的是别的账号**  
浏览器用 **cenzhi / mentorkokkwa** 部署即可；CLI 账号不影响网页导入。

**自动部署**  
之后每次 `git push` 到 `main`，Vercel 会自动重新部署 3 个项目。

---

## 可选：真实 AI（非 mock）

在 Vercel → Project → Settings → Environment Variables 添加（仅当你有 key）：

```bash
EDULENS_AI_MODE=auto
GEMINI_API_KEY=...
GROQ_API_KEY=...
```

改完后 Redeploy。
