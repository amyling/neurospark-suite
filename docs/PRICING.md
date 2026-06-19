# NeuroSpark Suite — Pricing Model

Prototype pricing for DSA / pitch discussions. **Not live billing** — toggle "Premium demo" in YouthMentor Settings simulates paid tier.

## Consumer (B2C) — YouthMentor

| Tier | Price (SGD) | Messages / day | Coaching packs | Parent mode |
|------|-------------|----------------|----------------|-------------|
| **Free** | $0 | 20 | 2 starter packs | — |
| **Premium** | $4.99 / mo | Unlimited | All packs | Optional add-on |
| **Family** | $7.99 / mo | Unlimited | All packs | Parent dashboard + quiet hours |

**Parent add-on (Free tier):** $2.99 / mo — 10 msgs/day child cap, 22:00–07:00 quiet hours.

## School (B2B) — YouthMentor Insights

| Tier | Price (SGD) | Scope | Data |
|------|-------------|-------|------|
| **Pilot** | Free (1 term) | 1 school, up to 200 students | Anonymous aggregates only — no chat text |
| **School** | $800 / year | Unlimited students | Scenario usage, mood trends, pack completion |
| **District** | Custom | Multi-school | API export + counsellor training session |

**Privacy principle:** School tier never receives individual chat transcripts — aligned with PDPA-minimisation narrative for interview.

## EduLens — EduTech

| Tier | Price (SGD) | Users | Features |
|------|-------------|-------|----------|
| **Student** | $0 | 1 | 5 homework analyses / month |
| **Student Plus** | $3.99 / mo | 1 | Unlimited analyses, mistake book |
| **Classroom** | $12 / student / year | Teacher + class | Lesson generator, class dashboard, PDF reports |

## CampusBot — Robotics

| Tier | Price (SGD) | Deliverable |
|------|-------------|-------------|
| **Simulator** | Free (open) | Web A* demo — current product |
| **School lab** | $2,500 one-time | Map customization + teacher workshop |
| **Hardware kit** | $8,000+ | Future: Pi + motors + teleop (not implemented) |

## Revenue logic (one sentence for interview)

> "Free tier builds habit and trust; premium unlocks depth (coaching packs, unlimited chat); schools pay for **aggregate insights** without accessing private conversations."

## Cost assumptions (optional depth)

| Item | Estimate |
|------|----------|
| LLM API per active user / month | ~$0.15–0.50 (with caching + limits) |
| Vercel hosting (3 apps) | $0 (hobby) → $20/mo (pro) |
| Break-even (Premium) | ~50 paying users cover API + hosting |

See [USER_SURVEY.md](USER_SURVEY.md) for willingness-to-pay signal from peer survey.
