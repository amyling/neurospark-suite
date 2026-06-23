# Leo Suite — Honest Limitations

Transparent assessment for DSA reviewers, teachers, and school IT. **Last updated:** June 2026.

---

## Suite-wide

| Limitation | Why it matters | Mitigation |
|------------|----------------|------------|
| **No production school deployment yet** | Not an MOE-endorsed or deployed school system | Positioned as portfolio + pilot-ready prototype |
| **Separate Vercel apps** | Four deployments to maintain | Shared TypeScript patterns; mock mode for reliable demos |
| **English-first engineering docs** | UI supports EN/ZH; some portfolio PDFs are English | Live demos fully bilingual |
| **No formal user study published** | Survey data in USER_SURVEY.md is peer-sample scale | Pilot plan in ROADMAP.md |

---

## EduLens AI

| Limitation | Detail |
|------------|--------|
| **Not official marking** | AI feedback is formative; `teacherReviewRecommended` flags uncertain outputs |
| **No class LMS integration** | No LMS, SLS, or Google Classroom sync in MVP |
| **RAG scope** | Syllabus chunks cover indexed MOE topics — not every school custom scheme |
| **Vision OCR variance** | Handwriting quality affects OCR; demo mode uses seeded text for reliability |
| **No student accounts** | History in browser localStorage — device-bound |
| **Marking accuracy** | LLM can hallucinate; Zod validation catches shape errors, not pedagogical truth |

---

## CampusBot AI

| Limitation | Detail |
|------------|--------|
| **Simulation only** | No real robot hardware or motor control in MVP |
| **Single campus layout** | Fuhua-inspired map — not every school's floor plan |
| **Grid abstraction** | Real robots need SLAM, not just grid A* |
| **Benchmark metrics** | Documented demo runs — live runs vary slightly with dynamic agents |

---

## YouthMentor AI

| Limitation | Detail |
|------------|--------|
| **Not therapy or emergency care** | Crisis panel points to helplines — not a hotline replacement |
| **Classifier false positives/negatives** | Keyword + classifier layers reduce but do not eliminate risk |
| **No cloud counsellor dashboard** | Insights are local anonymous aggregates in MVP |
| **Character chat** | AI simulation only — not real persons or faith leaders |
| **High-risk demo video** | Optional MP4 upload; live walkthrough always available |

---

## What we do well despite limitations

1. **Structured outputs** — EduLens JSON schemas enable mistake books and exports
2. **Safety before coaching** — YouthMentor blocks LLM on high risk
3. **Reproducible demos** — Mock mode works without API keys on Vercel
4. **Clear boundaries** — Disclaimers in-app and in showcase docs

---

## Related documents

- [ARCHITECTURE.md](ARCHITECTURE.md) — system design
- [ROADMAP.md](ROADMAP.md) — pilot and product phases
- [PRICING.md](PRICING.md) — commercial model
