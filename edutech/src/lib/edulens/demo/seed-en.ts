import type { EduLensStore } from "../types";

/** English seeded demo data */
export function createEnDemoStore(): EduLensStore {
  const subMathId = "demo-sub-math-quadratic";
  const subPhysicsId = "demo-sub-physics-electricity";
  const analysisMathId = "demo-analysis-math-quadratic";
  const analysisPhysicsId = "demo-analysis-physics-electricity";
  const lessonReqId = "demo-lesson-req-quadratic";
  const lessonOutId = "demo-lesson-out-quadratic";

  return {
    submissions: [
      {
        id: subMathId,
        subject: "Mathematics",
        level: "Sec 4",
        topic: "Quadratic equations",
        questionText:
          "Solve x² - 5x + 6 = 0 by factorisation. Show your working.",
        studentAnswer: "x² - 5x + 6 = (x-2)(x-3), so x = 2 or x = 3",
        standardAnswer: "Factorise: (x-2)(x-3)=0, roots x=2, x=3",
        createdAt: "2026-05-28T10:00:00.000Z",
      },
      {
        id: subPhysicsId,
        subject: "Physics",
        level: "Sec 3",
        topic: "Electricity",
        questionText:
          "Explain why increasing resistance in a series circuit reduces current.",
        studentAnswer:
          "More resistance means electrons move slower so less current flows.",
        createdAt: "2026-05-29T14:30:00.000Z",
      },
    ],
    analyses: [
      {
        id: analysisMathId,
        submissionId: subMathId,
        result: "correct",
        estimatedScore: { score: 4, maxScore: 4, confidence: "high" },
        correctSolution:
          "Step 1: Find two numbers that multiply to 6 and add to -5 → -2 and -3.\nStep 2: Write (x-2)(x-3)=0.\nStep 3: Apply zero product property → x=2 or x=3.",
        mistakeTypes: [],
        knowledgePoints: {
          mainTopic: "Quadratic equations",
          subTopics: ["Factorisation", "Zero product property"],
          prerequisites: ["Expansion of brackets", "Linear equations"],
        },
        rubricAnalysis: [
          {
            point: "Scoring point 1: Correct factorisation",
            maxMarks: 4,
            earnedMarks: 4,
            status: "present",
            confidence: 0.92,
            explanation: "Student factorised correctly.",
            standardAnswer: "(x-2)(x-3)=0",
          },
          {
            point: "Scoring point 2: Shows working",
            maxMarks: 4,
            earnedMarks: 3,
            status: "partial",
            confidence: 0.75,
            explanation: "Roots stated but intermediate steps are brief.",
            standardAnswer: "Find two numbers multiplying to 6 and summing to -5 → -2 and -3",
            improvementSuggestion: "Standardise steps: set up → calculate → compare → conclude.",
          },
        ],
        mistakeBreakdown: [
          {
            category: "Carelessness",
            percentage: 50,
            questionCount: 1,
            lostMarks: 1,
            recoverableMarks: 1,
            priority: "high",
            actionPlan: ["Mark key information while reading.", "Verify key steps."],
          },
        ],
        scoreForecast: {
          currentScore: 7,
          maxScore: 10,
          conservativeGain: 1,
          sprintGain: 3,
          nextTestMin: 8,
          nextTestMax: 10,
          recoverablePercentage: 20,
          executionDifficulty: "low",
        },
        improvementTips: [
          "Present full logical derivation on the answer sheet.",
          "Deeply understand the core factorisation method.",
        ],
        perfectAnswerTemplate:
          "Solution: Find two numbers multiplying to 6 and summing to -5 → -2 and -3.\n(x-2)(x-3)=0\nx=2 or x=3",
        feedback:
          "Strong answer. To improve exam presentation, show the factor pair search explicitly before writing factors.",
        similarQuestions: [
          {
            id: "sq-m1",
            question: "Solve x² - 7x + 12 = 0 by factorisation.",
            answer: "x = 3 or x = 4",
            difficulty: "standard",
          },
        ],
        remedialQuestions: [
          {
            id: "rq-m1",
            question: "Factorise x² + 5x + 6.",
            answer: "(x+2)(x+3)",
            difficulty: "basic",
          },
        ],
        extensionQuestions: [
          {
            id: "eq-m1",
            question: "Solve x² - 5x + 6 = 0 using the quadratic formula.",
            answer: "x = 2, 3 (verify same roots)",
            difficulty: "challenge",
          },
        ],
        learningPlan: [
          "Review factor pairs for trinomials with positive constant term.",
          "Practice 5 factorisation questions with full working.",
          "Compare factorisation vs quadratic formula for the same equation.",
        ],
        teacherReviewRecommended: false,
        createdAt: "2026-05-28T10:05:00.000Z",
      },
      {
        id: analysisPhysicsId,
        submissionId: subPhysicsId,
        result: "partially_correct",
        estimatedScore: { score: 2, maxScore: 4, confidence: "medium" },
        correctSolution:
          "In a series circuit, current I = V/R_total. Increasing resistance increases R_total, so for fixed voltage, I decreases (Ohm's law).",
        mistakeTypes: ["Incomplete explanation", "Informal vocabulary"],
        knowledgePoints: {
          mainTopic: "Electric circuits",
          subTopics: ["Ohm's law", "Series resistance"],
          prerequisites: ["Current and voltage", "Resistance definition"],
        },
        rubricAnalysis: [
          {
            point: "Links R to current",
            status: "present",
            confidence: 0.8,
            explanation: "Student connects more resistance to less current.",
          },
          {
            point: "Uses Ohm's law / scientific terms",
            status: "missing",
            confidence: 0.85,
            explanation: "No mention of V=IR or total resistance in series.",
          },
        ],
        feedback:
          "Direction is right but the explanation needs Ohm's law and series circuit reasoning.",
        similarQuestions: [
          {
            id: "sq-p1",
            question:
              "A 12 V battery is connected to two resistors in series: 4 Ω and 8 Ω. Find the current.",
            answer: "I = 12/(4+8) = 1 A",
            difficulty: "standard",
          },
        ],
        remedialQuestions: [
          {
            id: "rq-p1",
            question: "State Ohm's law in words and symbols.",
            answer: "V = I R; voltage equals current times resistance",
            difficulty: "basic",
          },
        ],
        extensionQuestions: [
          {
            id: "eq-p1",
            question:
              "Explain how adding a resistor in parallel affects total resistance.",
            difficulty: "challenge",
          },
        ],
        learningPlan: [
          "Memorise V=IR and practise series R_total = R1+R2.",
          "Rewrite your answer using 'potential difference' and 'total resistance'.",
          "Do 3 short-answer circuit explanation drills.",
        ],
        teacherReviewRecommended: true,
        createdAt: "2026-05-29T14:35:00.000Z",
      },
    ],
    lessonRequests: [
      {
        id: lessonReqId,
        userMode: "teacher",
        subject: "Mathematics",
        level: "Sec 4",
        topic: "Quadratic functions",
        classProfile:
          "Mixed ability Sec 4 Express; some struggle with graph sketching",
        durationMinutes: 60,
        difficulty: "mixed",
        outputTypes: ["lesson_plan", "worksheet", "answer_key", "misconceptions"],
        createdAt: "2026-05-30T09:00:00.000Z",
      },
    ],
    lessonOutputs: [
      {
        id: lessonOutId,
        requestId: lessonReqId,
        learningObjectives: [
          "Identify key features of quadratic graphs (vertex, roots, y-intercept)",
          "Relate algebraic form to graph shape",
          "Solve quadratic equations by factorisation",
        ],
        keyConcepts: [
          "Parabola shape",
          "Vertex form vs standard form",
          "Discriminant and number of roots",
        ],
        lessonPlan: [
          {
            phase: "Hook (5 min)",
            durationMinutes: 5,
            activities: ["Show two parabolas — ask what changes when a>0 vs a<0"],
          },
          {
            phase: "Instruction (20 min)",
            durationMinutes: 20,
            activities: [
              "Worked example: sketch y = x² - 4x + 3",
              "Link factors to x-intercepts",
            ],
            teacherNotes: "Use graphing app for visual learners",
          },
          {
            phase: "Guided practice (15 min)",
            durationMinutes: 15,
            activities: ["Pairs complete worksheet Q1–Q4"],
          },
          {
            phase: "Exit ticket (10 min)",
            durationMinutes: 10,
            activities: ["Individual: one factorisation + one graph feature"],
          },
        ],
        workedExamples: [
          {
            id: "we-1",
            question: "Sketch y = x² - 4x + 3 and state the vertex.",
            answer: "Vertex (2, -1); roots x=1,3",
            difficulty: "standard",
          },
        ],
        worksheet: [
          { id: "ws-1", question: "Factorise x² - 6x + 8", difficulty: "basic" },
          {
            id: "ws-2",
            question: "For y = x² - 6x + 8, find the vertex.",
            difficulty: "standard",
          },
          {
            id: "ws-3",
            question: "How many real roots does x² + 2x + 5 = 0 have?",
            difficulty: "challenge",
          },
        ],
        answerKey: [
          { questionId: "ws-1", answer: "(x-2)(x-4)", working: "2×4=8, 2+4=6" },
          {
            questionId: "ws-2",
            answer: "Vertex (3, -1)",
            working: "Complete the square or x=-b/2a",
          },
          { questionId: "ws-3", answer: "0 real roots", working: "D=4-20<0" },
        ],
        commonMisconceptions: [
          "Confusing x-intercepts with y-intercept",
          "Sign errors when factorising",
          "Assuming all quadratics cross the x-axis",
        ],
        revisionNotes:
          "Quadratic graphs are parabolas. Vertex at x=-b/(2a). Roots from factorised form.",
        exitTicket: [
          {
            id: "et-1",
            question: "Factorise x² - x - 6",
            answer: "(x-3)(x+2)",
          },
        ],
        homework: [
          { id: "hw-1", question: "Complete worksheet Q4–Q6 and sketch one parabola" },
        ],
        cheatSheet: "Standard form ax²+bx+c; vertex x=-b/2a; discriminant Δ=b²-4ac.",
        createdAt: "2026-05-30T09:10:00.000Z",
      },
    ],
    mistakeBook: [
      {
        id: "mb-1",
        analysisId: analysisPhysicsId,
        submissionId: subPhysicsId,
        subject: "Physics",
        level: "Sec 3",
        topic: "Electricity — Ohm's law",
        mistakeTypes: ["Incomplete explanation"],
        knowledgePoints: ["Ohm's law", "Series resistance"],
        summary: "Used informal reasoning; missing V=IR and R_total",
        savedAt: "2026-05-29T15:00:00.000Z",
      },
      {
        id: "mb-2",
        analysisId: "demo-mb-placeholder-2",
        submissionId: "demo-mb-sub-2",
        subject: "Mathematics",
        level: "Sec 4",
        topic: "Algebraic fractions",
        mistakeTypes: ["Sign error", "Procedural slip"],
        knowledgePoints: ["Factorisation", "Simplifying fractions"],
        summary: "Cancelled terms incorrectly when simplifying",
        savedAt: "2026-05-27T11:00:00.000Z",
      },
      {
        id: "mb-3",
        analysisId: "demo-mb-placeholder-3",
        submissionId: "demo-mb-sub-3",
        subject: "Mathematics",
        level: "Sec 4",
        topic: "Trigonometry",
        mistakeTypes: ["Conceptual misunderstanding"],
        knowledgePoints: ["Sine rule", "Ambiguous case"],
        summary: "Chose wrong triangle configuration for sine rule",
        savedAt: "2026-05-26T09:30:00.000Z",
      },
      {
        id: "mb-4",
        analysisId: "demo-mb-placeholder-4",
        submissionId: "demo-mb-sub-4",
        subject: "Chemistry",
        level: "Sec 3",
        topic: "Mole concept",
        mistakeTypes: ["Unit error"],
        knowledgePoints: ["Molar mass", "Unit conversion"],
        summary: "Mixed up g/mol with moles in final answer",
        savedAt: "2026-05-25T16:20:00.000Z",
      },
      {
        id: "mb-5",
        analysisId: "demo-mb-placeholder-5",
        submissionId: "demo-mb-sub-5",
        subject: "English",
        level: "Sec 4",
        topic: "Comprehension inference",
        mistakeTypes: ["Unsupported inference"],
        knowledgePoints: ["Evidence from text", "Inference"],
        summary: "Claim not backed by specific textual evidence",
        savedAt: "2026-05-24T13:45:00.000Z",
      },
    ],
  };
}
