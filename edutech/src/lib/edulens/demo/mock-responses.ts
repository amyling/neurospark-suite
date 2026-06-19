import type { Locale } from "@/lib/i18n/types";
import { buildDetailedMockLesson } from "./mock-lesson-detailed";
import type { HomeworkSubmission, LessonRequest } from "../types";
import type { HomeworkAnalysisPayload, LessonOutputPayload } from "../ai/validator";

/**
 * Animated micro-lessons and next-study units for incorrect / partial answers.
 */
function buildLearningExtras(
  submission: HomeworkSubmission,
  locale: Locale
): Pick<HomeworkAnalysisPayload, "learningVisualLessons" | "nextKnowledgeUnits"> {
  const combined = `${submission.questionText}\n${submission.studentAnswer}`;
  const isIntegral = /\\int|∫|\bdx\b/i.test(combined);

  if (locale === "zh") {
    if (isIntegral) {
      return {
        learningVisualLessons: [
          {
            title: "定积分：从面积到计算",
            knowledgeGap: "未正确运用牛顿-莱布尼茨公式或上下限代入",
            steps: [
              {
                title: "定积分表示什么",
                body: "定积分 $\\int_a^b f(x)\\,dx$ 表示曲线 $y=f(x)$ 在 $[a,b]$ 上与 $x$ 轴围成的有向面积。",
                latex: "\\int_a^b f(x)\\,dx = F(b) - F(a)",
                highlightVars: ["a", "b", "f(x)", "dx"],
                visualType: "integral_area",
              },
              {
                title: "先找原函数",
                body: "若 $F'(x)=f(x)$，则 $F(x)$ 是 $f(x)$ 的一个原函数。对幂函数用 $\\int x^n\\,dx = \\frac{x^{n+1}}{n+1}+C$（$n\\neq -1$）。",
                latex: "F'(x) = f(x)",
                highlightVars: ["F(x)", "f(x)", "C"],
                visualType: "formula_spotlight",
              },
              {
                title: "代入本题上下限",
                body: "算出原函数后，把上限 $b$ 和下限 $a$ 分别代入，再相减：$F(b)-F(a)$。不要忘记代入，只写 $+C$ 不能得分。",
                highlightVars: ["F(b)", "F(a)"],
                visualType: "equation_balance",
              },
              {
                title: "常见错误",
                body: "上下限写反、符号算错、漏写 $dx$、或把不定积分答案直接当定积分结果。",
                highlightVars: ["dx", "+C"],
                visualType: "mistake_compare",
              },
              {
                title: "回到你的作答",
                body: `对照题目「${submission.questionText.slice(0, 80)}…」逐步写出：原函数 → 代入上限 → 代入下限 → 相减得数值。`,
              },
            ],
            summary: "定积分 = 原函数在上限的值 − 在下限的值。",
          },
        ],
        nextKnowledgeUnits: [
          {
            topic: "牛顿-莱布尼茨公式",
            whyNeeded: "定积分计算的核心工具，本题必须掌握。",
            keyIdeas: [
              "先求原函数，再代入上下限",
              "定积分结果是数，不需要 $+C$",
            ],
            formulas: ["\\int_a^b f(x)\\,dx = F(b) - F(a)", "F'(x)=f(x)"],
            studySteps: [
              "复习课本「定积分与面积」一节",
              "完成 5 道 $\\int_0^1 x^n\\,dx$ 类基础题",
              "用红笔标注每步代入的上下限数值",
            ],
          },
          {
            topic: "幂函数与基本积分表",
            whyNeeded: "多数课本积分题都建立在基本积分公式上。",
            keyIdeas: ["记住 $\\int x^n\\,dx$ 与 $\\int \\frac{1}{x}\\,dx$"],
            formulas: [
              "\\int x^n\\,dx = \\frac{x^{n+1}}{n+1}+C",
              "\\int \\frac{1}{x}\\,dx = \\ln|x|+C",
            ],
            studySteps: [
              "默写基本积分表 10 个公式",
              "做 3 道不定积分再改做定积分",
            ],
          },
        ],
      };
    }

    return {
      learningVisualLessons: [
        {
          title: "因式分解：从方程到根",
          knowledgeGap: "未能正确分解二次式或漏写解",
          steps: [
            {
              title: "识别题型",
              body: "形如 $ax^2+bx+c=0$ 且 $a=1$ 时，优先考虑因式分解。",
              highlightVars: ["a", "b", "c"],
              visualType: "generic",
            },
            {
              title: "核心方法",
              body: "找两个数 $m,n$：$m\\cdot n=c$ 且 $m+n=b$，则 $x^2+bx+c=(x+m)(x+n)$。",
              latex: "x^2+bx+c=(x+m)(x+n)",
              highlightVars: ["m", "n"],
              visualType: "factor_pairs",
            },
            {
              title: "零积性质",
              body: "若 $(x-m)(x-n)=0$，则 $x-m=0$ 或 $x-n=0$，解得 $x=m$ 或 $x=n$。",
              latex: "(x-m)(x-n)=0 \\Rightarrow x=m \\text{ or } x=n",
              visualType: "equation_balance",
            },
            {
              title: "常见错误",
              body: "符号弄反、只写因式不写根、或跳步导致阅卷扣分。",
              visualType: "mistake_compare",
            },
            {
              title: "对照你的题目",
              body: `针对「${submission.questionText.slice(0, 80)}…」重新写一遍：分解 → 令因式为 0 → 写出每个根。`,
            },
          ],
          summary: "因式分解后必须用零积性质写出所有根。",
        },
      ],
      nextKnowledgeUnits: [
        {
          topic: "二次方程因式分解",
          whyNeeded: "本题直接考查该技能。",
          keyIdeas: ["十字相乘法", "零积性质"],
          formulas: ["x^2+bx+c=(x+m)(x+n)", "(x-m)(x-n)=0"],
          studySteps: [
            "复习课本例题 3 道",
            "完成 5 道 $x^2+bx+c=0$ 练习",
            "错题本重写本题标准步骤",
          ],
        },
        {
          topic: "一元二次方程求根",
          whyNeeded: "因式分解失败时可用求根公式兜底。",
          keyIdeas: ["判别式 $\\Delta=b^2-4ac$"],
          formulas: ["x=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}"],
          studySteps: ["对比因式分解与求根公式两种解法"],
        },
      ],
    };
  }

  if (isIntegral) {
    return {
      learningVisualLessons: [
        {
          title: "Definite integrals: area to value",
          knowledgeGap: "Newton–Leibniz rule or limit substitution not applied correctly",
          steps: [
            {
              title: "What the integral means",
              body: "The definite integral $\\int_a^b f(x)\\,dx$ is the signed area under $y=f(x)$ on $[a,b]$.",
              latex: "\\int_a^b f(x)\\,dx = F(b) - F(a)",
              highlightVars: ["a", "b", "f(x)", "dx"],
            },
            {
              title: "Find an antiderivative",
              body: "If $F'(x)=f(x)$, then $F$ is an antiderivative. For powers: $\\int x^n\\,dx=\\frac{x^{n+1}}{n+1}+C$ ($n\\neq -1$).",
              latex: "F'(x)=f(x)",
              highlightVars: ["F(x)", "C"],
            },
            {
              title: "Substitute bounds",
              body: "Evaluate $F(b)-F(a)$. Do not stop at $+C$ — a definite integral is a number.",
              highlightVars: ["F(b)", "F(a)"],
            },
            {
              title: "Typical mistakes",
              body: "Reversed limits, sign errors, missing $dx$, or treating indefinite and definite answers the same.",
              highlightVars: ["dx"],
            },
            {
              title: "Apply to your work",
              body: `Re-work: antiderivative → upper limit → lower limit → subtract for your problem.`,
            },
          ],
          summary: "Definite integral = antiderivative at upper bound minus lower bound.",
        },
      ],
      nextKnowledgeUnits: [
        {
          topic: "Fundamental Theorem of Calculus",
          whyNeeded: "Required to evaluate this integral correctly.",
          keyIdeas: ["Antiderivative first", "No +C in definite integrals"],
          formulas: ["\\int_a^b f(x)\\,dx=F(b)-F(a)"],
          studySteps: [
            "Re-read the textbook section on definite integrals",
            "Solve 5 basic $\\int_0^1 x^n\\,dx$ problems",
          ],
        },
        {
          topic: "Basic integration rules",
          whyNeeded: "Building block for most textbook problems.",
          keyIdeas: ["Power rule", "Log rule for $1/x$"],
          formulas: [
            "\\int x^n\\,dx=\\frac{x^{n+1}}{n+1}+C",
            "\\int \\frac{1}{x}\\,dx=\\ln|x|+C",
          ],
          studySteps: ["Memorise the table", "Practice indefinite then definite variants"],
        },
      ],
    };
  }

  return {
    learningVisualLessons: [
      {
        title: "Factorisation: equation to roots",
        knowledgeGap: "Quadratic not factorised correctly or roots not stated",
        steps: [
          {
            title: "Recognise the type",
            body: "For $ax^2+bx+c=0$ with $a=1$, try factorisation first.",
            highlightVars: ["a", "b", "c"],
          },
          {
            title: "Core method",
            body: "Find $m,n$ with $m\\cdot n=c$ and $m+n=b$, then $x^2+bx+c=(x+m)(x+n)$.",
            latex: "x^2+bx+c=(x+m)(x+n)",
            highlightVars: ["m", "n"],
          },
          {
            title: "Zero-product property",
            body: "$(x-m)(x-n)=0$ implies $x=m$ or $x=n$.",
            latex: "(x-m)(x-n)=0",
          },
          {
            title: "Common errors",
            body: "Wrong signs, factors without roots, or skipped steps.",
          },
          {
            title: "Retry your question",
            body: "Factor → set each factor to zero → list every root.",
          },
        ],
        summary: "After factorising, always solve for all roots.",
      },
    ],
    nextKnowledgeUnits: [
      {
        topic: "Quadratic factorisation",
        whyNeeded: "Directly tested in this problem.",
        keyIdeas: ["Cross-multiplication", "Zero-product rule"],
        formulas: ["x^2+bx+c=(x+m)(x+n)"],
        studySteps: ["Review 3 textbook examples", "Complete 5 similar drills"],
      },
      {
        topic: "Quadratic formula (backup)",
        whyNeeded: "Use when factorisation is not obvious.",
        keyIdeas: ["Discriminant $\\Delta=b^2-4ac$"],
        formulas: ["x=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}"],
        studySteps: ["Compare factorisation vs formula on one problem"],
      },
    ],
  };
}

/**
 * Rich detailed analysis fields for demo / fallback mode.
 */
function buildDetailedAnalysisExtras(
  submission: HomeworkSubmission,
  locale: Locale,
  hasStandard: boolean
): Pick<
  HomeworkAnalysisPayload,
  | "rubricAnalysis"
  | "mistakeBreakdown"
  | "scoreForecast"
  | "improvementTips"
  | "perfectAnswerTemplate"
> {
  const maxScore = 10;
  const currentScore = hasStandard ? 7 : 3;

  if (locale === "zh") {
    return {
      rubricAnalysis: [
        {
          point: "得分点1：正确识别解题方法",
          maxMarks: 2,
          earnedMarks: hasStandard ? 2 : 0,
          status: hasStandard ? "present" : "missing",
          confidence: 0.9,
          explanation: hasStandard
            ? "学生选择了正确的因式分解方法。"
            : "未展示明确的解题方法。",
          standardAnswer: "因式分解法：找两数相乘得常数项、相加得一次项系数。",
          improvementSuggestion: hasStandard
            ? undefined
            : "读题后用铅笔标注「因式分解」关键词，避免盲目计算。",
        },
        {
          point: "得分点2：因式分解过程",
          maxMarks: 4,
          earnedMarks: hasStandard ? 3 : 1,
          status: hasStandard ? "partial" : "missing",
          confidence: 0.85,
          explanation: hasStandard
            ? "因式分解正确，但中间步骤略简。"
            : "因式分解有误或步骤缺失。",
          standardAnswer: "(x-2)(x-3)=0",
          improvementSuggestion:
            "计算时把等式两边分别列出结果对比，不要只写一个等号。",
        },
        {
          point: "得分点3：写出最终答案",
          maxMarks: 4,
          earnedMarks: hasStandard ? 2 : 2,
          status: hasStandard ? "present" : "partial",
          confidence: 0.88,
          explanation: "根的值正确。",
          standardAnswer: "x = 2 或 x = 3",
          improvementSuggestion: hasStandard
            ? "即使计算过程有瑕疵，也要给出明确的「是/否」结论。"
            : "最后一步必须写出具体数值，不能只写符号。",
        },
      ],
      mistakeBreakdown: hasStandard
        ? [
            {
              category: "粗心大意",
              percentage: 50,
              questionCount: 1,
              lostMarks: 1.5,
              recoverableMarks: 1.5,
              priority: "high" as const,
              actionPlan: [
                "读题时用笔画出关键信息，避免看错题。",
                "数学计算题验算一遍，选择题复查一遍。",
                "总结常见粗心错误，制作提醒清单。",
              ],
            },
            {
              category: "步骤不完整",
              percentage: 50,
              questionCount: 1,
              lostMarks: 1.5,
              recoverableMarks: 1,
              priority: "medium" as const,
              actionPlan: [
                "规范解题步骤：列式→计算→比较→结论。",
                "减少草稿化书写，卷面呈现完整推导。",
              ],
            },
          ]
        : [
            {
              category: "知识不会",
              percentage: 40,
              questionCount: 1,
              lostMarks: 4,
              recoverableMarks: 3,
              priority: "high" as const,
              actionPlan: [
                "回到课本重学相关章节基础知识。",
                "请老师或同学讲解因式分解方法。",
                "完成 5 道基础因式分解题。",
              ],
            },
            {
              category: "方法不对",
              percentage: 35,
              questionCount: 1,
              lostMarks: 2,
              recoverableMarks: 1.5,
              priority: "high" as const,
              actionPlan: [
                "整理题型与对应解题方法。",
                "多做同类题，总结解题套路。",
                "建立「方法库」，遇到题目快速匹配。",
              ],
            },
            {
              category: "粗心大意",
              percentage: 25,
              questionCount: 1,
              lostMarks: 1,
              recoverableMarks: 1,
              priority: "medium" as const,
              actionPlan: [
                "放慢速度，宁可少做几题也要保证正确率。",
                "验算关键步骤。",
              ],
            },
          ],
      scoreForecast: {
        currentScore,
        maxScore,
        conservativeGain: hasStandard ? 1.5 : 3,
        sprintGain: hasStandard ? 3 : 6,
        nextTestMin: currentScore + (hasStandard ? 1.5 : 3),
        nextTestMax: currentScore + (hasStandard ? 3 : 6),
        recoverablePercentage: hasStandard ? 20 : 35,
        executionDifficulty: hasStandard ? "low" : "medium",
      },
      improvementTips: [
        "深刻理解因式分解的核心：找两数相乘得常数项、相加得一次项系数。",
        "规范解题步骤：列式 → 计算 → 比较 → 结论。",
        "减少草稿化书写，卷面呈现完整逻辑推导。",
      ],
      perfectAnswerTemplate: `解：\n${submission.questionText}\n\n由题意，需将 $x^2 - 5x + 6$ 因式分解。\n找两数相乘得 6、相加得 -5 → -2 与 -3。\n$(x-2)(x-3)=0$\n由零积性质，$x-2=0$ 或 $x-3=0$\n解得 $x=2$ 或 $x=3$\n\n理由：因式分解正确，步骤完整，结论明确。`,
    };
  }

  return {
    rubricAnalysis: [
      {
        point: "Scoring point 1: Identify correct method",
        maxMarks: 2,
        earnedMarks: hasStandard ? 2 : 0,
        status: hasStandard ? "present" : "missing",
        confidence: 0.9,
        explanation: hasStandard
          ? "Student chose the correct factorisation method."
          : "No clear method shown.",
        standardAnswer:
          "Factorisation: find two numbers multiplying to the constant and summing to the coefficient.",
        improvementSuggestion: hasStandard
          ? undefined
          : "Underline key words like 'factorise' before starting.",
      },
      {
        point: "Scoring point 2: Factorisation working",
        maxMarks: 4,
        earnedMarks: hasStandard ? 3 : 1,
        status: hasStandard ? "partial" : "missing",
        confidence: 0.85,
        explanation: hasStandard
          ? "Factorisation correct but steps abbreviated."
          : "Factorisation error or missing steps.",
        standardAnswer: "(x-2)(x-3)=0",
        improvementSuggestion:
          "List both sides of the equation separately when comparing results.",
      },
      {
        point: "Scoring point 3: Final answer",
        maxMarks: 4,
        earnedMarks: hasStandard ? 2 : 2,
        status: hasStandard ? "present" : "partial",
        confidence: 0.88,
        explanation: "Roots are correct.",
        standardAnswer: "x = 2 or x = 3",
        improvementSuggestion: hasStandard
          ? "Even if working is flawed, state a clear yes/no conclusion."
          : "Final step must show specific values, not just symbols.",
      },
    ],
    mistakeBreakdown: hasStandard
      ? [
          {
            category: "Carelessness",
            percentage: 50,
            questionCount: 1,
            lostMarks: 1.5,
            recoverableMarks: 1.5,
            priority: "high" as const,
            actionPlan: [
              "Mark key information while reading to avoid misreading.",
              "Verify calculations; double-check multiple-choice answers.",
              "Summarise common careless mistakes into a reminder list.",
            ],
          },
          {
            category: "Incomplete steps",
            percentage: 50,
            questionCount: 1,
            lostMarks: 1.5,
            recoverableMarks: 1,
            priority: "medium" as const,
            actionPlan: [
              "Standardise steps: set up → calculate → compare → conclude.",
              "Present full logical derivation on the answer sheet.",
            ],
          },
        ]
      : [
          {
            category: "Knowledge gap",
            percentage: 40,
            questionCount: 1,
            lostMarks: 4,
            recoverableMarks: 3,
            priority: "high" as const,
            actionPlan: [
              "Return to textbook to relearn the relevant chapter basics.",
              "Ask a teacher or classmate to explain factorisation.",
              "Complete 5 basic factorisation drills.",
            ],
          },
          {
            category: "Wrong method",
            percentage: 35,
            questionCount: 1,
            lostMarks: 2,
            recoverableMarks: 1.5,
            priority: "high" as const,
            actionPlan: [
              "Organise question types and corresponding solution methods.",
              "Do more similar questions and summarise routines.",
              "Build a method library for quick matching.",
            ],
          },
          {
            category: "Carelessness",
            percentage: 25,
            questionCount: 1,
            lostMarks: 1,
            recoverableMarks: 1,
            priority: "medium" as const,
            actionPlan: [
              "Slow down — fewer questions with higher accuracy is better.",
              "Verify key calculation steps.",
            ],
          },
        ],
    scoreForecast: {
      currentScore,
      maxScore,
      conservativeGain: hasStandard ? 1.5 : 3,
      sprintGain: hasStandard ? 3 : 6,
      nextTestMin: currentScore + (hasStandard ? 1.5 : 3),
      nextTestMax: currentScore + (hasStandard ? 3 : 6),
      recoverablePercentage: hasStandard ? 20 : 35,
      executionDifficulty: hasStandard ? "low" : "medium",
    },
    improvementTips: [
      "Deeply understand factorisation: find two numbers for product and sum.",
      "Standardise steps: set up → calculate → compare → conclude.",
      "Reduce draft-like writing; show complete logical derivation.",
    ],
    perfectAnswerTemplate: `Solution:\n${submission.questionText}\n\nFactorise $x^2 - 5x + 6$.\nFind two numbers multiplying to 6 and summing to -5 → -2 and -3.\n$(x-2)(x-3)=0$\nBy zero-product property: $x-2=0$ or $x-3=0$\nTherefore $x=2$ or $x=3$.\n\nReason: Correct factorisation, complete steps, clear conclusion.`,
  };
}

/** Language instruction appended to AI prompts */
export function getLanguageRule(locale: Locale): string {
  return locale === "zh"
    ? "All JSON string values MUST be written in Simplified Chinese (简体中文)."
    : "All JSON string values MUST be written in English.";
}

/**
 * Attaches demo comparison block tied to the actual submission text.
 */
function withMockComparison(
  submission: HomeworkSubmission,
  payload: HomeworkAnalysisPayload,
  locale: Locale
): HomeworkAnalysisPayload {
  const demoNote =
    locale === "zh"
      ? "演示模式 — 配置真实 AI 后获得准确批改"
      : "Demo mode — configure a real AI provider for accurate marking";
  return {
    ...payload,
    answerComparison: {
      questionRecap: submission.questionText.slice(0, 300),
      studentAnswerRecap: submission.studentAnswer.slice(0, 300),
      modelAnswer: payload.correctSolution.slice(0, 400),
      keyDifferences: [demoNote],
    },
  };
}

/**
 * Locale-aware mock homework analysis for demo mode only (EDULENS_AI_MODE=mock).
 */
export function mockAnalyzeHomework(
  submission: HomeworkSubmission,
  locale: Locale
): HomeworkAnalysisPayload {
  const explainKw = locale === "zh" ? "解释" : "explain";
  const openEnded =
    submission.studentAnswer.length > 120 ||
    submission.questionText.toLowerCase().includes(explainKw);

  if (locale === "zh") {
    if (openEnded) {
      const extras = buildDetailedAnalysisExtras(submission, locale, false);
      const learning = buildLearningExtras(submission, locale);
      return withMockComparison(submission, {
        result: "partially_correct",
        estimatedScore: { score: 2, maxScore: 4, confidence: "medium" },
        correctSolution:
          "使用学科术语分步说明，将学生推理与标准概念对照，给出完整结论。",
        mistakeTypes: ["Incomplete explanation"],
        knowledgePoints: {
          mainTopic: submission.topic ?? submission.subject,
          subTopics: ["核心概念", "考试术语"],
          prerequisites: ["前置章节基础"],
        },
        ...extras,
        ...learning,
        rubricAnalysis: [
          {
            point: "概念准确性",
            maxMarks: 2,
            earnedMarks: 1,
            status: "partial",
            confidence: 0.65,
            explanation: "有部分正确想法，但需更精确。",
            standardAnswer: "使用学科术语准确表述核心概念。",
            improvementSuggestion: "补充定义、公式或图示，并给出清晰结论。",
          },
        ],
        feedback:
          "你的推理显示部分理解。请补充定义、公式或图示，并给出清晰结论。",
        similarQuestions: [
          {
            question: `相似练习：${submission.topic ?? "本主题"}简答题`,
            answer: "含关键术语的参考答案",
            difficulty: "standard",
          },
        ],
        remedialQuestions: [
          {
            question: "写出本主题关键术语的定义。",
            answer: "见课本词汇表",
            difficulty: "basic",
          },
        ],
        extensionQuestions: [
          { question: "在新情境中应用同一概念。", difficulty: "challenge" },
        ],
        learningPlan: [
          "重读课本相关章节并标注关键术语。",
          "用完整句子回答 3 道简答题。",
          "请教师复核你修改后的段落。",
        ],
        teacherReviewRecommended: true,
      }, locale);
    }

    const hasStandard =
      submission.standardAnswer &&
      submission.studentAnswer
        .replace(/\s/g, "")
        .includes(
          submission.standardAnswer.replace(/\s/g, "").slice(0, Math.min(8, submission.standardAnswer.length))
        );

    const extras = buildDetailedAnalysisExtras(submission, locale, Boolean(hasStandard));
    const learning = hasStandard ? {} : buildLearningExtras(submission, locale);
    return withMockComparison(submission, {
      result: hasStandard ? "correct" : "incorrect",
      estimatedScore: hasStandard
        ? { score: 3, maxScore: 4, confidence: "high" }
        : { score: 1, maxScore: 4, confidence: "medium" },
      correctSolution:
        "步骤 1：确定方法（如因式分解）。\n步骤 2：清晰展示计算过程。\n步骤 3：写出最终答案（含单位）。",
      mistakeTypes: hasStandard ? [] : ["Procedural slip", "Calculation error"],
      knowledgePoints: {
        mainTopic: submission.topic ?? submission.subject,
        subTopics: ["解题步骤"],
        prerequisites: ["运算/代数基础"],
      },
      ...extras,
      ...learning,
      feedback: hasStandard
        ? "做得不错。考试中可补充更多中间步骤以争取满分。"
        : "复习课堂笔记中的方法，逐步重做一道相似例题。",
      similarQuestions: [
        {
          question: `练习：${submission.topic ?? "同类型"}变式 1`,
          answer: "见笔记中的详解",
          difficulty: "standard",
        },
      ],
      remedialQuestions: [
        { question: "热身：一道较简单的同技能题", difficulty: "basic" },
      ],
      extensionQuestions: [
        { question: "挑战：多步综合应用题", difficulty: "challenge" },
      ],
      learningPlan: [
        "用红笔在错题本上改正错误。",
        "完成 5 道相似题。",
        "不看笔记向同学讲解解题方法。",
      ],
      teacherReviewRecommended: !hasStandard,
    }, locale);
  }

  if (openEnded) {
    const extras = buildDetailedAnalysisExtras(submission, locale, false);
    const learning = buildLearningExtras(submission, locale);
    return withMockComparison(submission, {
      result: "partially_correct",
      estimatedScore: { score: 2, maxScore: 4, confidence: "medium" },
      correctSolution:
        "Provide a step-by-step explanation using subject-specific vocabulary.",
      mistakeTypes: ["Incomplete explanation"],
      knowledgePoints: {
        mainTopic: submission.topic ?? submission.subject,
        subTopics: ["Core concepts", "Exam terminology"],
        prerequisites: ["Prior chapter foundations"],
      },
      ...extras,
      ...learning,
      rubricAnalysis: [
        {
          point: "Conceptual accuracy",
          maxMarks: 2,
          earnedMarks: 1,
          status: "partial",
          confidence: 0.65,
          explanation: "Some ideas are present but need precision.",
          standardAnswer: "Use subject-specific vocabulary accurately.",
          improvementSuggestion: "Add definitions, formulas, or diagrams with a clear conclusion.",
        },
      ],
      feedback:
        "Your reasoning shows partial understanding. Strengthen with definitions and a clear conclusion.",
      similarQuestions: [
        {
          question: `Similar practice: ${submission.topic ?? "core topic"}`,
          answer: "Model answer with key terms",
          difficulty: "standard",
        },
      ],
      remedialQuestions: [
        {
          question: "Define the key terms used in this topic.",
          answer: "See textbook glossary",
          difficulty: "basic",
        },
      ],
      extensionQuestions: [
        { question: "Apply the same concept to a new scenario.", difficulty: "challenge" },
      ],
      learningPlan: [
        "Re-read the textbook section and highlight key terms.",
        "Answer 3 short questions with full sentences.",
        "Ask a teacher to review your revised paragraph.",
      ],
      teacherReviewRecommended: true,
    }, locale);
  }

  const hasStandard =
    submission.standardAnswer &&
    submission.studentAnswer
      .replace(/\s/g, "")
      .toLowerCase()
      .includes(
        submission.standardAnswer.replace(/\s/g, "").toLowerCase().slice(0, 12)
      );

  const extras = buildDetailedAnalysisExtras(submission, locale, Boolean(hasStandard));
  const learning = hasStandard ? {} : buildLearningExtras(submission, locale);
  return withMockComparison(submission, {
    result: hasStandard ? "correct" : "incorrect",
    estimatedScore: hasStandard
      ? { score: 3, maxScore: 4, confidence: "high" }
      : { score: 1, maxScore: 4, confidence: "medium" },
    correctSolution:
      "Step 1: Identify the method.\nStep 2: Show working clearly.\nStep 3: State final answer with units if needed.",
    mistakeTypes: hasStandard ? [] : ["Procedural slip", "Calculation error"],
    knowledgePoints: {
      mainTopic: submission.topic ?? submission.subject,
      subTopics: ["Problem-solving steps"],
      prerequisites: ["Arithmetic / algebra fluency"],
    },
    ...extras,
    ...learning,
    feedback: hasStandard
      ? "Good work. Add more intermediate steps for full marks."
      : "Review class notes and redo a similar example step by step.",
    similarQuestions: [
      {
        question: `Practice: ${submission.topic ?? "same skill"} — variant 1`,
        answer: "Worked solution in notes",
        difficulty: "standard",
      },
    ],
    remedialQuestions: [
      { question: "Warm-up: one easier question on the same skill", difficulty: "basic" },
    ],
    extensionQuestions: [
      { question: "Challenge: multi-step application", difficulty: "challenge" },
    ],
    learningPlan: [
      "Correct the error in your notebook.",
      "Complete 5 similar questions.",
      "Explain the method to a peer without notes.",
    ],
    teacherReviewRecommended: !hasStandard,
  }, locale);
}

/** Locale-aware mock lesson pack with full teaching content */
export function mockLessonPack(
  request: LessonRequest,
  locale: Locale
): LessonOutputPayload {
  return buildDetailedMockLesson(request, locale);
}
