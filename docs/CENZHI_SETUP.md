# Leo Suite — cenzhi 部署清单

**官方位置：**

| 服务 | 账号 |
|------|------|
| GitHub | [mentorkokkwa](https://github.com/mentorkokkwa) |
| Vercel | [vercel.com/cenzhi](https://vercel.com/cenzhi) |

---

## 仓库策略（Private 部署 + Public 展示）

| 应用 | Private 部署仓库 | Public 展示仓库 |
|------|------------------|-----------------|
| YouthMentor | [leo-suite-growth](https://github.com/mentorkokkwa/leo-suite-growth) | [leo-suite-growth-showcase](https://github.com/mentorkokkwa/leo-suite-growth-showcase) |
| EduLens | [leo-suite-edutech](https://github.com/mentorkokkwa/leo-suite-edutech) | [leo-suite-edutech-showcase](https://github.com/mentorkokkwa/leo-suite-edutech-showcase) |
| CampusBot | [leo-suite-robot](https://github.com/mentorkokkwa/leo-suite-robot) | 同上（可保持 Public） |
| 文档 | [leo-suite](https://github.com/mentorkokkwa/leo-suite) | Public |

详细步骤：**[PRIVATE_PUBLIC_REPOS.md](PRIVATE_PUBLIC_REPOS.md)**

---

## Vercel 项目

Import 时 **Root Directory 留空**，Production 分支 **main**。

| Vercel 项目 | GitHub（Private） |
|-------------|-------------------|
| leo-suite-growth | mentorkokkwa/leo-suite-growth |
| leo-suite-edutech | mentorkokkwa/leo-suite-edutech |
| leo-suite-robot | mentorkokkwa/leo-suite-robot |

Private 仓库需在 GitHub → Settings → 安装 Vercel GitHub App 时勾选 **private repo access**。

**部署被 Block（Git author）？** 见 **[VERCEL_GIT_AUTHOR_FIX.md](VERCEL_GIT_AUTHOR_FIX.md)** — Hobby 团队只允许所有者的 Git 身份触发部署。

---

## 环境变量

路径：**Settings → Environment Variables**（不是 Environments 页）。

**robot：** 无需变量。

**growth / edutech：** 至少勾选 **Production + Preview + Development**。

### 推荐：Demo 模式（学校评审 / 无 API Key）

**leo-suite-growth：**

```
EDULENS_AI_MODE=mock
EDULENS_DEV_PROFILE=mock
EDULENS_SKIP_OLLAMA=true
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_APP_NAME=YouthMentor AI
```

**leo-suite-edutech：**

```
EDULENS_AI_MODE=mock
EDULENS_DEV_PROFILE=mock
EDULENS_SKIP_OLLAMA=true
EDULENS_RAG_ENABLED=true
EDULENS_RAG_WEB_ENABLED=false
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_APP_NAME=EduLens AI
```

### 可选：真实 AI 模式

```
EDULENS_AI_MODE=auto
EDULENS_PROVIDER_CHAIN=GEMINI,GROQ,DEEPSEEK,OPENROUTER,NVIDIA,OPENAI
EDULENS_SKIP_OLLAMA=true
EDULENS_PREFER_OLLAMA=false
```

### 密钥（从本机 `.env.local` 复制，勿提交 GitHub）

```
GEMINI_API_KEY=
GROQ_API_KEY=
DEEPSEEK_API_KEY=
OPENROUTER_API_KEY=
NVIDIA_API_KEY=
OPENAI_API_KEY=
```

edutech 若用 Agnes：`AGNES_API_KEY=`

> Ollama（127.0.0.1）无法在 Vercel 运行；线上只用云端 key 或 mock。

保存后 **Deployments → Redeploy**。

---

## 验证

| 检查 | 期望 |
|------|------|
| growth `/youthmentor` | 页面正常，Demo 按钮可用 |
| `/youthmentor/safety-demo` | 高风险样例触发危机拦截 |
| `/api/ai/status`（mock 模式） | `"mode": "mock"` |
| edutech `/edulens/homework-analyzer` | 返回结构化分析 |
| robot `/campusbot/simulator` | 仿真正常 |

---

## Public Showcase 仓库

模板目录：`showcase/leo-suite-growth-showcase/`、`showcase/leo-suite-edutech-showcase/`

推送脚本（PowerShell）：

```powershell
cd showcase
.\init-showcase-repos.ps1
```

推送后在 showcase README 填入 Vercel Production 域名。

---

## 本机 CLI（可选）

```powershell
vercel login
```

用 **cenzhi** 登录后，在 `growth/`、`edutech/`、`robot/` 执行 `vercel link`，选择 cenzhi 团队下对应项目。

---

## 安全

- `.env.local` 仅在本机，已在各 app 的 `.gitignore`
- API key 只放在 Vercel Dashboard，不要写入 GitHub
- growth / edutech 部署仓库设为 **Private**
- 展示仓库只含文档和样例代码，不含完整 API / prompt
