# NeuroSpark Suite — Architecture

## Suite overview

```mermaid
flowchart LR
  subgraph Learn["EduLens AI (edutech)"]
    HW[Homework Analyzer]
    LG[Lesson Generator]
    MB[Mistake Book]
  end

  subgraph Grow["YouthMentor AI (growth)"]
    CI[Mood Check-in]
    RF[Reflection]
    SP[Safety Pipeline]
    CC[Character Chat]
  end

  subgraph Serve["CampusBot AI (robot)"]
    MAP[School Map]
    AST[A* Planner]
    SIM[Simulator]
  end

  Student((Student)) --> Learn
  Student --> Grow
  School((School)) --> Serve
```

## Shared AI layer (EduLens + YouthMentor)

```mermaid
flowchart TB
  UI[React UI] --> API[Next.js API Routes]
  API --> SVC[Service Layer]
  SVC --> PB[Prompt Builder]
  PB --> PR[Provider Chain]
  PR --> OLLAMA[Ollama]
  PR --> GEMINI[Gemini]
  PR --> GROQ[Groq]
  PR --> MOCK[Mock Fallback]
  PR --> PARSE[JSON Parser + Validator]
  PARSE --> STORE[localStorage / Response]
```

**Provider chain:** `OLLAMA → GEMINI → GROQ → … → MOCK`  
Configured via `EDULENS_PROVIDER_CHAIN` and `EDULENS_AI_MODE`.

## YouthMentor safety pipeline

```mermaid
flowchart TD
  IN[User text: check-in + reflection] --> KW[Keyword scan]
  KW -->|high_risk| BLOCK[Crisis panel only]
  KW -->|watch / normal| CLS[Risk classifier]
  CLS -->|high_risk| BLOCK
  CLS -->|normal| MENTOR[Structured mentor JSON]
  MENTOR --> PLAN[Action plan]
  BLOCK --> RES[Crisis resources + helplines]
```

**Design decisions (for interview):**

1. **Never rely on LLM alone for safety** — keyword layer runs first; high-risk blocks before any coaching prompt.
2. **localStorage** — no server database for reflections; fits PDPA-minded youth products and works offline for history.
3. **RAG-lite** — persona knowledge chunks retrieved by intimacy level; deeper chunks unlock with engagement, not payment alone.

## YouthMentor character chat

```mermaid
flowchart LR
  MSG[User message] --> LIM[Usage limits / quiet hours]
  LIM --> RAG[Knowledge chunk search]
  RAG --> MEM[Memory: facts + LLM summary]
  MEM --> LLM[Character prompt]
  LLM --> OUT[Reply + attribution footnote]
```

## CampusBot navigation

```mermaid
flowchart TD
  TASK[Task: e.g. worksheet delivery] --> GOAL[Goal cell]
  MAP[Grid map + obstacles] --> AST[A* pathfinding]
  GOAL --> AST
  AST --> PATH[Path waypoints]
  PATH --> SIM[Step simulation]
  SIM -->|collision / blocked| REPLAN[Dynamic re-plan]
  REPLAN --> AST
  SIM --> METRICS[Report: steps, collisions, re-plans]
```

## Deployment topology (Vercel)

```mermaid
flowchart TB
  subgraph Vercel["Vercel (3 projects)"]
    VE[EduLens app]
    VG[YouthMentor app]
    VR[CampusBot app]
  end
  CDN[Edge CDN — SG region] --> Vercel
  VE --> API1[/api/* serverless]
  VG --> API2[/api/* serverless]
  API1 --> LLM[External LLM APIs]
  API2 --> LLM
  VR --> STATIC[Static + client simulation]
```

Each app is a **separate Vercel project** (different roots: `edutech/`, `growth/`, `robot/`).  
Set `EDULENS_AI_MODE=mock` on Vercel for reliable demo without API keys.

## Data flow & privacy

| Data | Where stored | Shared? |
|------|--------------|---------|
| Reflections, mood history | Browser `localStorage` | No — device only |
| Character chat memory | Browser `localStorage` | No |
| Insights dashboard aggregates | Browser `localStorage` | Anonymous local only |
| LLM requests | Server API route → provider | Prompt text only; no persistent server DB |

## Future extensions (not implemented)

- Supabase cloud sync stub in YouthMentor Settings  
- Real robot hardware (Arduino / ROS2) for CampusBot  
- School admin SSO for EduLens class dashboards
