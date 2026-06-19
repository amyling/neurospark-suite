import type { EduLensStore } from "../types";

/** Chinese seeded demo data */
export function createZhDemoStore(): EduLensStore {
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
        topic: "二次方程",
        questionText: "用因式分解法解 x² - 5x + 6 = 0，写出完整步骤。",
        studentAnswer: "x² - 5x + 6 = (x-2)(x-3)，所以 x = 2 或 x = 3",
        standardAnswer: "因式分解：(x-2)(x-3)=0，根 x=2, x=3",
        createdAt: "2026-05-28T10:00:00.000Z",
      },
      {
        id: subPhysicsId,
        subject: "Physics",
        level: "Sec 3",
        topic: "电学",
        questionText: "解释为什么串联电路中增大电阻会减小电流。",
        studentAnswer: "电阻越大，电子移动越慢，所以电流越小。",
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
          "步骤 1：找两数相乘得 6、相加得 -5 → -2 与 -3。\n步骤 2：写 (x-2)(x-3)=0。\n步骤 3：零积性质 → x=2 或 x=3。",
        mistakeTypes: [],
        knowledgePoints: {
          mainTopic: "二次方程",
          subTopics: ["因式分解", "零积性质"],
          prerequisites: ["展开括号", "一元一次方程"],
        },
        rubricAnalysis: [
          {
            point: "得分点1：因式分解正确",
            maxMarks: 4,
            earnedMarks: 4,
            status: "present",
            confidence: 0.92,
            explanation: "学生因式分解正确。",
            standardAnswer: "(x-2)(x-3)=0",
          },
          {
            point: "得分点2：展示解题步骤",
            maxMarks: 4,
            earnedMarks: 3,
            status: "partial",
            confidence: 0.75,
            explanation: "给出根但中间步骤略简。",
            standardAnswer: "找两数相乘得6、相加得-5 → -2与-3",
            improvementSuggestion: "规范步骤：列式→计算→比较→结论。",
          },
        ],
        mistakeBreakdown: [
          {
            category: "粗心大意",
            percentage: 50,
            questionCount: 1,
            lostMarks: 1,
            recoverableMarks: 1,
            priority: "high",
            actionPlan: ["读题时标注关键信息。", "验算关键步骤。"],
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
          "规范解题步骤，卷面呈现完整推导。",
          "深刻理解因式分解的核心方法。",
        ],
        perfectAnswerTemplate:
          "解：找两数相乘得6、相加得-5 → -2与-3。\n(x-2)(x-3)=0\nx=2或x=3",
        feedback:
          "作答较好。考试时可先写出因数对搜索过程，再写因式分解，步骤更完整。",
        similarQuestions: [
          {
            id: "sq-m1",
            question: "用因式分解法解 x² - 7x + 12 = 0。",
            answer: "x = 3 或 x = 4",
            difficulty: "standard",
          },
        ],
        remedialQuestions: [
          {
            id: "rq-m1",
            question: "因式分解 x² + 5x + 6。",
            answer: "(x+2)(x+3)",
            difficulty: "basic",
          },
        ],
        extensionQuestions: [
          {
            id: "eq-m1",
            question: "用求根公式解 x² - 5x + 6 = 0。",
            answer: "x = 2, 3（验证相同根）",
            difficulty: "challenge",
          },
        ],
        learningPlan: [
          "复习常数项为正的三项式因数对。",
          "完成 5 道因式分解题并写全步骤。",
          "比较因式分解法与求根公式解同一方程。",
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
          "串联电路中 I = V/R_总。电阻增大则 R_总 增大，电压不变时 I 减小（欧姆定律）。应使用「电势差」「电阻限制电流」等规范表述。",
        mistakeTypes: ["Incomplete explanation", "Informal vocabulary"],
        knowledgePoints: {
          mainTopic: "电路",
          subTopics: ["欧姆定律", "串联电阻"],
          prerequisites: ["电流与电压", "电阻定义"],
        },
        rubricAnalysis: [
          {
            point: "联系电阻与电流",
            status: "present",
            confidence: 0.8,
            explanation: "学生能联系电阻增大与电流减小。",
          },
          {
            point: "使用欧姆定律/科学术语",
            status: "missing",
            confidence: 0.85,
            explanation: "未提及 V=IR 或串联总电阻。",
          },
        ],
        feedback:
          "方向正确，但需补充欧姆定律与串联电路推理，避免仅用「电子变慢」的口语化说法。",
        similarQuestions: [
          {
            id: "sq-p1",
            question: "12 V 电池串联 4 Ω 与 8 Ω 电阻，求电流。",
            answer: "I = 12/(4+8) = 1 A",
            difficulty: "standard",
          },
        ],
        remedialQuestions: [
          {
            id: "rq-p1",
            question: "用文字和符号表述欧姆定律。",
            answer: "V = I R；电压等于电流乘以电阻",
            difficulty: "basic",
          },
        ],
        extensionQuestions: [
          {
            id: "eq-p1",
            question: "说明并联增加一个电阻对总电阻的影响。",
            difficulty: "challenge",
          },
        ],
        learningPlan: [
          "熟记 V=IR，练习 R_总 = R1+R2。",
          "用「电势差」「总电阻」重写你的答案。",
          "完成 3 道电路简答训练。",
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
        topic: "二次函数",
        classProfile: "中四混合能力班；部分学生图像作图较弱",
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
          "识别二次函数图像特征（顶点、根、y 截距）",
          "联系代数式与图像形状",
          "用因式分解解二次方程",
        ],
        keyConcepts: ["抛物线形状", "顶点式与标准式", "判别式与根的个数"],
        lessonPlan: [
          {
            phase: "导入（5 分钟）",
            durationMinutes: 5,
            activities: ["展示两条抛物线，讨论 a>0 与 a<0 的区别"],
          },
          {
            phase: "讲授（20 分钟）",
            durationMinutes: 20,
            activities: [
              "例题：作 y = x² - 4x + 3 的图像",
              "联系因式与 x 截距",
            ],
            teacherNotes: "可视学习者可使用作图软件",
          },
          {
            phase: "指导练习（15 分钟）",
            durationMinutes: 15,
            activities: ["两人一组完成习题 Q1–Q4"],
          },
          {
            phase: "出门测（10 分钟）",
            durationMinutes: 10,
            activities: ["个人：一道因式分解 + 一个图像特征"],
          },
        ],
        workedExamples: [
          {
            id: "we-1",
            question: "作 y = x² - 4x + 3 的图像并写出顶点。",
            answer: "顶点 (2, -1)；根 x=1,3",
            difficulty: "standard",
          },
        ],
        worksheet: [
          { id: "ws-1", question: "因式分解 x² - 6x + 8", difficulty: "basic" },
          {
            id: "ws-2",
            question: "对 y = x² - 6x + 8，求顶点坐标。",
            difficulty: "standard",
          },
          {
            id: "ws-3",
            question: "x² + 2x + 5 = 0 有几个实根？",
            difficulty: "challenge",
          },
        ],
        answerKey: [
          { questionId: "ws-1", answer: "(x-2)(x-4)", working: "2×4=8, 2+4=6" },
          {
            questionId: "ws-2",
            answer: "顶点 (3, -1)",
            working: "配方法或 x=-b/2a",
          },
          { questionId: "ws-3", answer: "0 个实根", working: "D=4-20<0" },
        ],
        commonMisconceptions: [
          "混淆 x 截距与 y 截距",
          "因式分解符号错误",
          "认为所有抛物线都与 x 轴相交",
        ],
        revisionNotes:
          "二次函数图像为抛物线。顶点横坐标 x=-b/(2a)。因式形式 (x-p)(x-q)=0 得根。用判别式 b²-4ac 判断根个数。",
        exitTicket: [
          { id: "et-1", question: "因式分解 x² - x - 6", answer: "(x-3)(x+2)" },
        ],
        homework: [
          { id: "hw-1", question: "完成习题 Q4–Q6 并作一条抛物线图像" },
        ],
        cheatSheet: "标准式 ax²+bx+c；顶点 x=-b/2a；判别式 Δ=b²-4ac。",
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
        topic: "电学 — 欧姆定律",
        mistakeTypes: ["Incomplete explanation"],
        knowledgePoints: ["欧姆定律", "串联电阻"],
        summary: "表述口语化，缺少 V=IR 与 R_总",
        savedAt: "2026-05-29T15:00:00.000Z",
      },
      {
        id: "mb-2",
        analysisId: "demo-mb-placeholder-2",
        submissionId: "demo-mb-sub-2",
        subject: "Mathematics",
        level: "Sec 4",
        topic: "代数分式",
        mistakeTypes: ["Sign error", "Procedural slip"],
        knowledgePoints: ["因式分解", "分式化简"],
        summary: "化简时错误约去项",
        savedAt: "2026-05-27T11:00:00.000Z",
      },
      {
        id: "mb-3",
        analysisId: "demo-mb-placeholder-3",
        submissionId: "demo-mb-sub-3",
        subject: "Mathematics",
        level: "Sec 4",
        topic: "三角学",
        mistakeTypes: ["Conceptual misunderstanding"],
        knowledgePoints: ["正弦定理", "歧义情形"],
        summary: "正弦定理选错三角形构型",
        savedAt: "2026-05-26T09:30:00.000Z",
      },
      {
        id: "mb-4",
        analysisId: "demo-mb-placeholder-4",
        submissionId: "demo-mb-sub-4",
        subject: "Chemistry",
        level: "Sec 3",
        topic: "摩尔概念",
        mistakeTypes: ["Unit error"],
        knowledgePoints: ["摩尔质量", "单位换算"],
        summary: "最终答案混淆 g/mol 与 mol",
        savedAt: "2026-05-25T16:20:00.000Z",
      },
      {
        id: "mb-5",
        analysisId: "demo-mb-placeholder-5",
        submissionId: "demo-mb-sub-5",
        subject: "English",
        level: "Sec 4",
        topic: "阅读理解推断",
        mistakeTypes: ["Unsupported inference"],
        knowledgePoints: ["文本证据", "推断"],
        summary: "结论缺乏具体文本依据",
        savedAt: "2026-05-24T13:45:00.000Z",
      },
    ],
  };
}
