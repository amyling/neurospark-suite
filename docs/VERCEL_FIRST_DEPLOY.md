# Vercel 首次部署（三个独立仓库）

账号：**https://vercel.com/cenzhi**

每个 app 有**自己的 GitHub 仓库**，Vercel 上 **Import 一次 = 一个项目**，不需要设 Root Directory。

| Vercel 项目名（建议） | Import 这个仓库 |
|----------------------|-----------------|
| `leo-suite-growth` | https://github.com/mentorkokkwa/leo-suite-growth |
| `leo-suite-edutech` | https://github.com/mentorkokkwa/leo-suite-edutech |
| `leo-suite-robot` | https://github.com/mentorkokkwa/leo-suite-robot |

---

## 1. YouthMentor

1. https://vercel.com/new → Import **mentorkokkwa/leo-suite-growth**
2. Root Directory：**留空**（默认仓库根目录）
3. 环境变量：`EDULENS_AI_MODE` = `mock`
4. Deploy  
5. 访问：`https://你的域名/youthmentor`  
6. 安全演示：`/youthmentor/safety-demo`

## 2. EduLens

1. Import **mentorkokkwa/leo-suite-edutech**
2. 环境变量：`EDULENS_AI_MODE` = `mock`
3. 访问：`/edulens`

## 3. CampusBot

1. Import **mentorkokkwa/leo-suite-robot**
2. 无需 API key  
3. 访问：`/campusbot`

---

## 之后

每次对某个仓库 `git push main`，只有对应的 Vercel 项目会重新部署。

Meta 文档与作品集说明在：**https://github.com/mentorkokkwa/leo-suite**
