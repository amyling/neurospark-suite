# 3-Minute DSA Demo Script / 三分钟演示脚本

Use this script for interview, open house, or recorded backup.  
**Plan A:** local `localhost` demo. **Plan B:** Vercel URL with mock mode. **Plan C:** screen recording.

---

## English (≈3 minutes)

### 0:00 — Hook (15 s)

> "I'm [name], Sec 4. I built **NeuroSpark Suite** — three apps for how Singapore students **learn**, **grow**, and how schools could **serve** with robots. I'll show YouthMentor's safety feature — the part I'm most proud of."

### 0:15 — Problem (20 s)

> "Many students feel exam stress but won't talk to a counsellor until it's severe. Apps that only chat with AI can give harmful advice. I wanted structured reflection **plus** hard safety guardrails."

### 0:35 — Demo: normal flow (45 s)

**Actions:** Open `/youthmentor` → Demo → **Exam stress** → Check-in (pre-filled) → Continue → Reflection → **Get mentor response**.

> "User checks mood, writes a structured reflection — six prompts based on counselling-style questions — then gets a mentor persona response and action plan. Data stays in the browser; no account."

### 1:20 — Demo: safety (60 s) ★ highlight

**Actions:** Home → **Safety demo** page (or Demo → **High-risk sample**) → Reflection → **Get mentor response** → Safety page.

> "When high-risk language is detected, the pipeline **stops before** any coaching LLM call. You only see crisis resources — helplines, talk to a trusted adult. Here you can see which keywords triggered and the classifier reason. This is intentional: safety is not delegated to the model."

### 2:20 — Technical + product (30 s)

> "Stack: Next.js, TypeScript, multi-provider LLM with mock fallback. Character chat uses RAG-lite from public teachings. I also built EduLens for homework feedback and CampusBot with A* navigation — same repo, different problems."

### 2:50 — Close (10 s)

> "Next I'd pilot with school counsellors for the insights dashboard. Happy to show code on GitHub or walk through architecture."

---

## 中文（约 3 分钟）

### 0:00 — 开场（15 秒）

> 「我是 [姓名]，中四。我做了 **NeuroSpark 套件** 三个项目：帮学生**学**（EduLens）、**成长**（YouthMentor）、以及校园**机器人**仿真（CampusBot）。接下来重点演示 YouthMentor 的**安全拦截**。」

### 0:15 — 问题（20 秒）

> 「新加坡学生考试压力大，但不太愿意早点找 counsellor。纯聊天 AI 可能给出不安全的建议。我希望有结构化反思，加上**硬性安全护栏**。」

### 0:35 — 演示：正常流程（45 秒）

**操作：** 打开 `/youthmentor` → 演示案例 → **考试压力** → 签到 → 反思 → **获取导师回复**。

> 「用户记录心情、完成六步结构化反思，得到导师风格和行动计划。数据只在浏览器本地，无需账号。」

### 1:20 — 演示：安全拦截（60 秒）★ 重点

**操作：** 首页 → **安全演示**（或演示案例 → **高风险样本**）→ 反思 → **获取导师回复** → 安全页。

> 「检测到高风险用语时，系统在调用辅导 LLM **之前**就拦截，只显示危机资源热线。这里能看到触发的关键词和分类原因。安全不能交给模型自己判断。」

### 2:20 — 技术与产品（30 秒）

> 「技术栈：Next.js、TypeScript、多 LLM 供应商与 mock 降级。角色聊天用 RAG 注入公开资料。同一仓库里还有 EduLens 作业分析和 CampusBot 的 A* 路径规划。」

### 2:50 — 收尾（10 秒）

> 「下一步想和学校 counsellor 试点匿名统计面板。代码在 GitHub，也可以讲架构图。」

---

## Backup demo paths

| Scenario | Route | Time |
|----------|-------|------|
| Safety only | `/youthmentor/safety-demo` → Run demo | 60 s |
| Character chat | `/youthmentor/characters` → scenario card | 45 s |
| EduLens | `/edulens/homework-analyzer` → load demo | 45 s |
| CampusBot | `/campusbot/experiments` → run worksheet delivery | 60 s |

## If something breaks

1. Switch to **mock mode** (no API keys needed).  
2. Play pre-recorded video (record the safety demo once).  
3. Walk through `docs/ARCHITECTURE.md` on screen.

## Recording checklist

- [ ] 1920×1080, show browser URL bar  
- [ ] Record safety demo end-to-end (crisis panel visible)  
- [ ] Keep under 3 minutes  
- [ ] Export as `docs/demo-recording.mp4` (optional, gitignored if large)
