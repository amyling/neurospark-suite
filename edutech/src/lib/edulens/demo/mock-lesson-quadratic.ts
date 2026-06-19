import type { Locale } from "@/lib/i18n/types";
import type { LessonRequest } from "../types";
import type { LessonOutputPayload } from "../ai/validator";

/**
 * Quadratic-functions themed demo lesson pack.
 */
export function buildQuadraticMockLesson(
  request: LessonRequest,
  locale: Locale
): LessonOutputPayload {
  const usedTeacher = Boolean(request.teacherContent?.trim());
  const topic = request.topic;
  const isZh = locale === "zh";

  if (isZh) {
    return {
      contentSource: usedTeacher ? "mixed" : "ai_generated",
      learningObjectives: [
        `解释 ${topic} 的定义与图像特征`,
        `能在 ${request.level} 难度下完成相关计算与作图`,
        `识别并纠正 ${topic} 的常见误区`,
      ],
      keyConcepts: [
        "标准式与顶点式",
        "判别式与根的个数",
        "图像平移与伸缩",
      ],
      teachingContent: [
        {
          type: "text",
          content: usedTeacher
            ? `【教师输入摘要】${request.teacherContent!.slice(0, 200)}…`
            : `本课围绕「${topic}」展开，适合${request.classProfile ?? request.level}。`,
        },
        {
          type: "formula",
          content: "二次函数一般式",
          latex: "f(x)=ax^2+bx+c\\ (a\\neq0)",
        },
        {
          type: "formula",
          content: "顶点横坐标",
          latex: "x=-\\frac{b}{2a}",
        },
        {
          type: "diagram",
          content:
            "板书画图：抛物线开口由 a 的符号决定；标出顶点、对称轴、与 x 轴交点。",
        },
        {
          type: "table",
          content:
            "| 情形 | 判别式 Δ | 根 |\n|------|----------|----|\n| Δ>0 | 两个不等实根 | 与 x 轴两交点 |\n| Δ=0 | 重根 | 切于 x 轴 |",
        },
        {
          type: "text",
          content:
            "差异化：基础组完成因式分解；标准组求顶点；挑战组含参数或应用题。",
        },
      ],
      lessonPlan: [
        {
          phase: "导入（8 分钟）",
          durationMinutes: 8,
          activities: [
            "展示 y=x² 与 y=-x²+4 的图像对比",
            "提问：开口方向由什么决定？",
          ],
          teacherNotes: "快速巡视前测，记录符号错误",
          teacherScript:
            "同学们，先看这两条抛物线。一起说：当 a>0 时开口向哪里？当 a<0 呢？今天我们把图像特征和代数式联系起来。",
        },
        {
          phase: "讲授与例题（22 分钟）",
          durationMinutes: 22,
          activities: [
            "例题1：作 y=x²-4x+3 的图像并求顶点",
            "例题2：用判别式判断 x²+2x+5=0 的实根个数",
            "学生跟练一道配方法",
          ],
          teacherNotes: request.classProfile ?? request.level,
          teacherScript:
            "第一步写标准式；第二步配方或公式求顶点；第三步列表描点或利用对称性作图。",
        },
        {
          phase: "巩固练习（20 分钟）",
          durationMinutes: 20,
          activities: ["小组完成习题单 Q1–Q5", "教师抽查两组板书"],
        },
        {
          phase: "总结与出门测（10 分钟）",
          durationMinutes: 10,
          activities: ["学生自评学习目标", "完成出门测 2 题"],
          teacherScript: "请用一句话说出顶点公式，并检查单位与符号。",
        },
      ],
      workedExamples: [
        {
          question: "已知 f(x)=x²-6x+8，求顶点坐标与 x 截距。",
          answer: "顶点 (3,-1)；x 截距 x=2,4",
          difficulty: "standard",
        },
        {
          question: "判断 k 取何值时 x²+kx+9=0 有两个相等实根。",
          answer: "Δ=k²-36=0 → k=±6",
          difficulty: "challenge",
        },
      ],
      worksheet: [
        {
          question: "因式分解 x²-7x+12，并写出对应抛物线的 x 截距。",
          difficulty: "basic",
        },
        {
          question: "对 y=2x²-8x+5 配方，写出顶点式。",
          difficulty: "standard",
        },
        {
          question: "某球抛高度 h(t)=-5t²+20t+1，求最大高度及时刻。",
          difficulty: "challenge",
        },
        {
          question: "作 y=-x²+2x+3 的草图并标出关键点。",
          difficulty: "standard",
        },
      ],
      answerKey: [
        {
          questionId: "ws-1",
          answer: "(x-3)(x-4)=0，x=3,4",
          working: "3×4=12，3+4=7",
        },
        {
          questionId: "ws-2",
          answer: "y=2(x-2)²-3，顶点 (2,-3)",
          working: "提出系数 2 后配方",
        },
        {
          questionId: "ws-3",
          answer: "h_max=21m，t=2s",
          working: "顶点 t=-b/2a=2",
        },
        {
          questionId: "ws-4",
          answer: "顶点 (1,4)，根 x=-1,3",
          working: "配方或求根公式",
        },
      ],
      commonMisconceptions: [
        "把顶点纵坐标与 y 截距混淆",
        "配方时忘记提出 a 或符号错误",
        "判别式符号与根个数对应错误",
      ],
      revisionNotes:
        "熟记顶点横坐标公式；配方步骤：提系数→补常数→写顶点式；应用题先建模再求顶点。",
      exitTicket: [
        {
          question: "写出 y=x²-4x+1 的顶点坐标（不需作图）。",
          answer: "(2, -3)",
        },
      ],
      homework: [
        {
          question: "完成习题单 Q5–Q8；预习下一节不等式与图像区域",
        },
      ],
      cheatSheet:
        "f(x)=ax²+bx+c；顶点 x=-b/2a；Δ=b²-4ac；根与 x 截距对应。",
      learningVisualLessons: [
        {
          title: `${topic}：图像与判别式动画讲解`,
          knowledgeGap: "需要把代数式、图像特征与根的个数联系起来",
          steps: [
            {
              title: "认识抛物线",
              body: "二次函数 $y=ax^2+bx+c$ 的图像是抛物线。$a>0$ 开口向上。",
              latex: "y=ax^2+bx+c",
              visualType: "formula_spotlight",
            },
            {
              title: "标出顶点与对称轴",
              body: "在图上标出顶点、对称轴，以及与 $x$ 轴的交点。",
              visualType: "parabola_graph",
            },
            {
              title: "判别式判断根",
              body: "$\\Delta=b^2-4ac$ 决定与 $x$ 轴交点个数。",
              latex: "\\Delta=b^2-4ac",
              visualType: "equation_balance",
            },
            {
              title: "常见误区",
              body: "符号错误、顶点与截距混淆。",
              visualType: "mistake_compare",
            },
          ],
          summary: "图像特征与判别式要一起使用。",
        },
      ],
    };
  }

  return {
    contentSource: usedTeacher ? "mixed" : "ai_generated",
    learningObjectives: [
      `Explain definitions and graph features of ${topic}`,
      `Solve ${request.level}-level problems and sketch graphs`,
      `Address common errors in ${topic}`,
    ],
    keyConcepts: ["Standard and vertex form", "Discriminant and roots", "Transformations"],
    teachingContent: [
      {
        type: "text",
        content: usedTeacher
          ? `[From teacher notes] ${request.teacherContent!.slice(0, 200)}…`
          : `Full lesson on ${topic} for ${request.classProfile ?? request.level}.`,
      },
      {
        type: "formula",
        content: "General form",
        latex: "f(x)=ax^2+bx+c\\ (a\\neq0)",
      },
      {
        type: "formula",
        content: "Vertex x-coordinate",
        latex: "x=-\\frac{b}{2a}",
      },
      {
        type: "diagram",
        content:
          "Board sketch: parabola opening from sign of a; mark vertex, axis, x-intercepts.",
      },
      {
        type: "table",
        content:
          "| Case | Δ | Roots |\n|------|---|-------|\n| Δ>0 | two real | two x-intercepts |",
      },
      {
        type: "text",
        content:
          "Differentiation: basic — factorise; standard — vertex; challenge — parameters/applications.",
      },
    ],
    lessonPlan: [
      {
        phase: "Starter (8 min)",
        durationMinutes: 8,
        activities: ["Compare y=x² and y=-x²+4", "Discuss effect of sign of a"],
        teacherScript:
          "What changes when a is positive vs negative? Today we link algebra and graphs.",
      },
      {
        phase: "Teach & examples (22 min)",
        durationMinutes: 22,
        activities: [
          "Ex1: sketch y=x²-4x+3 and find vertex",
          "Ex2: use discriminant for x²+2x+5=0",
          "Guided practice: completing the square",
        ],
        teacherNotes: request.classProfile ?? request.level,
        teacherScript:
          "Step 1 standard form; step 2 vertex; step 3 plot or use symmetry.",
      },
      {
        phase: "Practice (20 min)",
        durationMinutes: 20,
        activities: ["Pairs: worksheet Q1–Q5", "Monitor two groups at board"],
      },
      {
        phase: "Plenary (10 min)",
        durationMinutes: 10,
        activities: ["Self-check objectives", "Exit ticket ×2"],
        teacherScript: "State the vertex formula aloud; check signs and units.",
      },
    ],
    workedExamples: [
      {
        question: "For f(x)=x²-6x+8, find vertex and x-intercepts.",
        answer: "Vertex (3,-1); x=2,4",
        difficulty: "standard",
      },
    ],
    worksheet: [
      {
        question: "Factorise x²-7x+12 and state x-intercepts of the graph.",
        difficulty: "basic",
      },
      {
        question: "Complete the square for y=2x²-8x+5.",
        difficulty: "standard",
      },
      {
        question: "Projectile h(t)=-5t²+20t+1: max height and time.",
        difficulty: "challenge",
      },
    ],
    answerKey: [
      { questionId: "ws-1", answer: "x=3,4", working: "(x-3)(x-4)" },
      { questionId: "ws-2", answer: "y=2(x-2)²-3", working: "factor 2 then CTS" },
      { questionId: "ws-3", answer: "21m at t=2s", working: "vertex t=2" },
    ],
    commonMisconceptions: [
      "Confusing vertex y with y-intercept",
      "Sign errors when completing the square",
      "Misreading discriminant vs number of roots",
    ],
    revisionNotes: `Vertex formula; completing the square steps; exam-style graph questions on ${topic}.`,
    exitTicket: [
      { question: "Vertex of y=x²-4x+1?", answer: "(2, -3)" },
    ],
    homework: [{ question: "Worksheet Q5–Q8; read ahead on inequalities" }],
    cheatSheet: "ax²+bx+c; vertex x=-b/2a; Δ=b²-4ac.",
    learningVisualLessons: [
      {
        title: `${topic}: graph and discriminant`,
        knowledgeGap: "Connect formula, graph features, and number of roots",
        steps: [
          {
            title: "Parabola shape",
            body: "A quadratic $y=ax^2+bx+c$ graphs as a parabola.",
            latex: "y=ax^2+bx+c",
            visualType: "formula_spotlight",
          },
          {
            title: "Mark key features",
            body: "Label vertex, axis of symmetry, and $x$-intercepts.",
            visualType: "generic",
          },
          {
            title: "Discriminant",
            body: "$\\Delta=b^2-4ac$ tells how many real roots exist.",
            latex: "\\Delta=b^2-4ac",
            visualType: "equation_balance",
          },
          {
            title: "Common mistakes",
            body: "Sign errors and mixing vertex with intercepts.",
            visualType: "mistake_compare",
          },
        ],
        summary: "Always pair the graph with the discriminant.",
      },
    ],
  };
}
