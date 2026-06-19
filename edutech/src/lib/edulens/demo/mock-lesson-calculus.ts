import type { Locale } from "@/lib/i18n/types";
import type { LessonRequest } from "../types";
import type { LessonOutputPayload } from "../ai/validator";

/**
 * Calculus-themed demo lesson pack (integrals, FTC, area interpretation).
 */
export function buildCalculusMockLesson(
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
        `理解 ${topic} 中定积分的几何意义与代数计算`,
        `能运用基本积分公式与牛顿-莱布尼茨公式求值`,
        `识别 ${topic} 中常见的符号与上下限错误`,
      ],
      keyConcepts: ["不定积分与定积分", "曲边梯形面积", "牛顿-莱布尼茨公式"],
      teachingContent: [
        {
          type: "text",
          content: usedTeacher
            ? `【教师输入摘要】${request.teacherContent!.slice(0, 200)}…`
            : `本课围绕「${topic}」展开，适合${request.classProfile ?? request.level}。`,
        },
        {
          type: "formula",
          content: "幂函数不定积分",
          latex: "\\int x^n\\,dx=\\frac{x^{n+1}}{n+1}+C\\quad (n\\neq -1)",
        },
        {
          type: "formula",
          content: "牛顿-莱布尼茨公式",
          latex: "\\int_a^b f(x)\\,dx=F(b)-F(a)",
        },
        {
          type: "diagram",
          content:
            "板书画图：坐标系中画出 y=f(x)、曲边梯形；标出积分下限 a、上限 b 与面积区域。",
        },
        {
          type: "table",
          content:
            "| 被积函数 | 原函数 | 备注 |\n|------|--------|------|\n| $x^n\\ (n\\neq -1)$ | $\\frac{x^{n+1}}{n+1}+C$ | 幂函数法则 |\n| $\\frac{1}{x}$ | $\\ln\\lvert x\\rvert+C$ | 注意定义域 |\n| $\\cos x$ | $\\sin x+C$ | 基本三角积分 |",
        },
        {
          type: "text",
          content:
            "差异化：基础组求不定积分；标准组计算定积分；挑战组含换元或分段积分。",
        },
      ],
      lessonPlan: [
        {
          phase: "导入（8 分钟）",
          durationMinutes: 8,
          activities: [
            "复习：导数与切线斜率",
            "提问：如何求曲边梯形面积？",
          ],
          teacherScript:
            "同学们，导数描述变化率；积分反过来求累积量。今天从面积意义出发，建立定积分的直觉。",
        },
        {
          phase: "讲授与例题（22 分钟）",
          durationMinutes: 22,
          activities: [
            "例题1：求 ∫(2x+3)dx",
            "例题2：计算 ∫₀² x² dx",
            "例题3：∫₁⁴ 1/x dx 为何要注意区间",
          ],
          teacherScript:
            "先找原函数 F(x)，定积分代入上下限相减；不要忘记 +C 只出现在不定积分里。",
        },
        {
          phase: "巩固练习（20 分钟）",
          durationMinutes: 20,
          activities: ["完成积分习题单 Q1–Q5", "小组讨论换元思路"],
        },
        {
          phase: "总结与出门测（10 分钟）",
          durationMinutes: 10,
          activities: ["自评学习目标", "出门测 2 题定积分"],
          teacherScript: "请口述：定积分与不定积分的区别，以及牛顿-莱布尼茨公式。",
        },
      ],
      workedExamples: [
        {
          question: "计算 ∫₀² (x²+1) dx。",
          answer: "[x³/3+x]₀² = 14/3",
          difficulty: "standard",
        },
        {
          question: "求 ∫ 3x² dx。",
          answer: "x³+C",
          difficulty: "basic",
        },
      ],
      worksheet: [
        { question: "求 ∫(4x³-2x)dx。", difficulty: "basic" },
        { question: "计算 ∫₀¹ (2x+1)dx。", difficulty: "standard" },
        { question: "求 ∫₁ᵉ (1/x)dx。", difficulty: "standard" },
        { question: "说明为何 ∫₋₁¹ (1/x²)dx 需分段讨论。", difficulty: "challenge" },
      ],
      answerKey: [
        { questionId: "ws-1", answer: "x⁴-x²+C", working: "逐项积分" },
        { questionId: "ws-2", answer: "2", working: "[x²+x]₀¹=2" },
        { questionId: "ws-3", answer: "1", working: "[ln|x|]₁ᵉ=1" },
        { questionId: "ws-4", answer: "奇点 x=0 不在区间内", working: "反常积分" },
      ],
      commonMisconceptions: [
        "定积分结果误写 +C",
        "上下限代入顺序颠倒",
        "忽略 1/x 在 x=0 无定义",
      ],
      revisionNotes:
        "熟记基本积分表；定积分=原函数在上限值减下限值；作图帮助理解面积意义。",
      exitTicket: [
        { question: "写出 ∫₀³ x dx 的值。", answer: "9/2" },
      ],
      homework: [
        { question: "完成习题单 Q5–Q8；预习换元积分法" },
      ],
      cheatSheet: "∫x^n dx; ∫1/x dx=ln|x|+C; ∫_a^b f(x)dx=F(b)-F(a)",
      learningVisualLessons: [
        {
          title: `${topic}：从面积到定积分`,
          knowledgeGap: "需要把曲边梯形面积与牛顿-莱布尼茨公式联系起来",
          steps: [
            {
              title: "建立坐标系",
              body: "在坐标平面上标出 $x$ 轴、$y$ 轴，准备作图。",
              visualType: "integral_area",
            },
            {
              title: "画出 y = f(x)",
              body: "描出被积函数曲线，观察其在区间 $[a,b]$ 上的形状。",
              visualType: "integral_area",
            },
            {
              title: "曲边梯形面积",
              body: "定积分 $\\int_a^b f(x)\\,dx$ 表示曲线与 $x$ 轴之间的有向面积。",
              latex: "\\int_a^b f(x)\\,dx",
              visualType: "integral_area",
            },
            {
              title: "黎曼矩形逼近",
              body: "用越来越多矩形逼近面积，理解积分作为极限。",
              visualType: "integral_area",
            },
            {
              title: "牛顿-莱布尼茨公式",
              body: "若 $F'(x)=f(x)$，则 $\\int_a^b f(x)\\,dx=F(b)-F(a)$。",
              latex: "\\int_a^b f(x)\\,dx=F(b)-F(a)",
              visualType: "integral_area",
            },
            {
              title: "常见错误",
              body: "上下限写反、符号错误、在定积分后加 $+C$。",
              visualType: "mistake_compare",
            },
          ],
          summary: "定积分 = 原函数在上限的值减去在下限的值。",
        },
      ],
    };
  }

  return {
    contentSource: usedTeacher ? "mixed" : "ai_generated",
    learningObjectives: [
      `Explain geometric and algebraic meaning of integrals in ${topic}`,
      `Apply basic rules and the Fundamental Theorem of Calculus`,
      `Avoid common limit and notation errors`,
    ],
    keyConcepts: ["Indefinite vs definite integral", "Area under a curve", "FTC"],
    teachingContent: [
      {
        type: "text",
        content: usedTeacher
          ? `[From teacher notes] ${request.teacherContent!.slice(0, 200)}…`
          : `Full calculus lesson on ${topic} for ${request.classProfile ?? request.level}.`,
      },
      {
        type: "formula",
        content: "Power rule",
        latex: "\\int x^n\\,dx=\\frac{x^{n+1}}{n+1}+C\\quad (n\\neq -1)",
      },
      {
        type: "formula",
        content: "Fundamental Theorem of Calculus",
        latex: "\\int_a^b f(x)\\,dx=F(b)-F(a)",
      },
      {
        type: "diagram",
        content:
          "Board sketch: shade area under y=f(x) from x=a to x=b; label bounds and curve.",
      },
      {
        type: "table",
        content:
          "| Integrand | Antiderivative | Note |\n|------|----------------|------|\n| $x^n\\ (n\\neq -1)$ | $\\frac{x^{n+1}}{n+1}+C$ | power rule |\n| $\\frac{1}{x}$ | $\\ln\\lvert x\\rvert+C$ | domain x≠0 |\n| $\\cos x$ | $\\sin x+C$ | basic trig |",
      },
      {
        type: "text",
        content:
          "Differentiation: basic — indefinite integrals; standard — definite; challenge — substitution.",
      },
    ],
    lessonPlan: [
      {
        phase: "Starter (8 min)",
        durationMinutes: 8,
        activities: ["Recall derivatives as rates", "Ask: how to find area under a curve?"],
        teacherScript:
          "Derivatives describe change; integrals accumulate. Today we link area to definite integrals.",
      },
      {
        phase: "Teach & examples (22 min)",
        durationMinutes: 22,
        activities: [
          "Ex1: ∫(2x+3)dx",
          "Ex2: ∫₀² x² dx",
          "Ex3: ∫₁⁴ 1/x dx and domain issues",
        ],
        teacherScript:
          "Find F(x) first; for definite integrals substitute bounds — no +C in the final number.",
      },
      {
        phase: "Practice (20 min)",
        durationMinutes: 20,
        activities: ["Worksheet Q1–Q5", "Pairs discuss u-substitution"],
      },
      {
        phase: "Plenary (10 min)",
        durationMinutes: 10,
        activities: ["Self-check objectives", "Exit ticket ×2"],
        teacherScript: "State FTC aloud; compare indefinite vs definite answers.",
      },
    ],
    workedExamples: [
      {
        question: "Evaluate ∫₀² (x²+1) dx.",
        answer: "14/3",
        difficulty: "standard",
      },
    ],
    worksheet: [
      { question: "Find ∫(4x³-2x)dx.", difficulty: "basic" },
      { question: "Evaluate ∫₀¹ (2x+1)dx.", difficulty: "standard" },
      { question: "Evaluate ∫₁ᵉ (1/x)dx.", difficulty: "standard" },
    ],
    answerKey: [
      { questionId: "ws-1", answer: "x⁴-x²+C", working: "term by term" },
      { questionId: "ws-2", answer: "2", working: "[x²+x]₀¹" },
      { questionId: "ws-3", answer: "1", working: "[ln x]₁ᵉ" },
    ],
    commonMisconceptions: [
      "Adding +C to definite integral results",
      "Reversed bounds",
      "Ignoring domain of 1/x",
    ],
    revisionNotes: `Integral table; FTC; sketch area for ${topic}.`,
    exitTicket: [{ question: "∫₀³ x dx = ?", answer: "9/2" }],
    homework: [{ question: "Worksheet Q5–Q8; preview substitution" }],
    cheatSheet: "∫x^n; ∫1/x; FTC ∫_a^b f=F(b)-F(a)",
    learningVisualLessons: [
      {
        title: `${topic}: area to definite integral`,
        knowledgeGap: "Connect shaded area with the Fundamental Theorem",
        steps: [
          {
            title: "Set up axes",
            body: "Draw the coordinate plane with $x$ and $y$ axes.",
            visualType: "integral_area",
          },
          {
            title: "Sketch y = f(x)",
            body: "Plot the integrand on the interval $[a,b]$.",
            visualType: "integral_area",
          },
          {
            title: "Shaded area",
            body: "The definite integral $\\int_a^b f(x)\\,dx$ is signed area under the curve.",
            latex: "\\int_a^b f(x)\\,dx",
            visualType: "integral_area",
          },
          {
            title: "Riemann sums",
            body: "Approximate the area with rectangles — the limit defines the integral.",
            visualType: "integral_area",
          },
          {
            title: "Fundamental Theorem",
            body: "If $F'=f$, then $\\int_a^b f(x)\\,dx=F(b)-F(a)$.",
            latex: "\\int_a^b f(x)\\,dx=F(b)-F(a)",
            visualType: "integral_area",
          },
          {
            title: "Common mistakes",
            body: "Wrong limits, sign errors, +C on definite answers.",
            visualType: "mistake_compare",
          },
        ],
        summary: "Definite integral = antiderivative at upper minus lower bound.",
      },
    ],
  };
}
